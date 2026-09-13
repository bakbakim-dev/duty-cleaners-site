/**
 * Server-side relay for the quote funnel → GoHighLevel API v2.
 *
 * The site never talks to GHL directly: the browser posts the quote payload
 * here, this function records it in `quote_leads`, returns that durable receipt,
 * then upserts the contact through GHL's official API in the background using a
 * Private Integration token that only ever exists server-side.
 *
 * The relay never invents capture: only a successfully stored row is reported
 * as ok. GHL delivery is a separate delivered/pending state and can be retried
 * with the authenticated retry operation below.
 */

import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GHL_API = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";
const LOCATION_ID = "4OROmtMn8LQqaDsUJPjC";
const TIMEOUT_MS = 10_000;

/**
 * Independent operational alert path. This intentionally sends no payload or
 * customer data: SiteGround receives only fixed diagnostic labels. If the
 * notifier is unavailable, lead storage and GHL retries continue unchanged.
 */
async function reportFormHealth(
  event: "failed" | "recovered",
  stage: "ghl-delivery" | "durable-capture",
  category: "storage" | "delivery" | "configuration",
  status: number,
  source?: string,
) {
  const url = Deno.env.get("FORM_HEALTH_URL");
  const secret = Deno.env.get("FORM_HEALTH_SECRET");
  if (!url || !secret) return;
  const form = source?.startsWith("contact-form")
    ? "contact-form"
    : source?.startsWith("careers-application")
      ? "careers-application"
      : "quote-funnel";
  try {
    await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Form-Health-Secret": secret,
      },
      body: JSON.stringify({ event, form, stage, category, status, path: "/server/ghl-quote" }),
      signal: AbortSignal.timeout(5_000),
    });
  } catch (error) {
    console.error("[ghl-quote] form-health report failed", String(error));
  }
}

function createRelayClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

type RelayClient = ReturnType<typeof createRelayClient>;

/** Field key in GHL → payload key coming from the funnel. */
const FIELD_MAP: Record<string, string> = {
  "contact.what_type_of_service_would_you_like": "service",
  "contact.what_type_of_home_do_you_have": "home_type",
  "contact.bedrooms_in_total": "bedrooms",
  "contact.bathrooms": "full_bathrooms",
  "contact.half_baths": "half_baths",
  "contact.frequency_in_bookings": "frequency",
  "contact.site_quoted_first_clean_price": "first_clean_price",
  "contact.site_quoted_recurring_price": "recurring_price",
  "contact.selected_extras": "addons",
  "contact.quote_page_url": "page_url",
};

const PayloadSchema = z.object({
  request_id: z.string().uuid().optional(),
  stage: z.enum(["lead", "confirm"]).default("lead"),
  city: z.string().max(80).optional(),
  service: z.string().max(200).optional(),
  home_type: z.string().max(200).optional(),
  bedrooms: z.union([z.string(), z.number()]).optional(),
  full_bathrooms: z.union([z.string(), z.number()]).optional(),
  half_baths: z.union([z.string(), z.number()]).optional(),
  frequency: z.string().max(200).optional(),
  frequency_discount_pct: z.union([z.string(), z.number()]).optional(),
  addons: z.array(z.string().max(200)).max(40).optional(),
  first_clean_price: z.number().nullable().optional(),
  recurring_price: z.number().nullable().optional(),
  currency: z.string().max(8).optional(),
  full_name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(40),
  page_url: z.string().max(2000).optional(),
  submitted_at: z.string().max(40).optional(),
  source: z.string().max(120).optional(),
  /* Anti-abuse, both optional so an older client keeps working. */
  website: z.string().max(200).optional(),   // honeypot; humans never fill it
  formOpenedAt: z.number().optional(),        // ms epoch when the form mounted
  turnstileToken: z.string().max(4000).optional(),
  /** Free-text message from the contact form; kept in the stored payload. */
  notes: z.string().max(2000).optional(),
  /** "deep" when the visitor entered through a Deep Cleaning CTA. */
  intent: z.enum(["deep"]).nullable().optional(),
  tracking: z.record(z.string()).optional(),
});

type Payload = z.infer<typeof PayloadSchema>;

/* ---------------------------------------------------------------- *
 * Simple in-memory per-IP rate limit (best effort across warm runs).
 * ---------------------------------------------------------------- */
const hits = new Map<string, number[]>();
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 8;

/* ---------------------------------------------------------------- *
 * Abuse controls.
 *
 * The rate limit above is per-isolate and dies with the isolate, so across a
 * warm pool the real ceiling is far above 8/min, and rotating IPs defeats it
 * outright. Every accepted call writes a row AND upserts a CRM contact, so the
 * cost of abuse is paid in a poisoned CRM, not just in database rows.
 *
 * Three layers, cheapest first, none of which asks a real customer to do
 * anything:
 *
 *   origin     the funnel is same-origin; a browser attacker cannot forge this
 *   honeypot   a field CSS hides and humans never see, so anything in it is a bot
 *   dwell      a real person cannot read and complete this form in under 3s
 *
 * Turnstile is the fourth and only one needing an account: set TURNSTILE_SECRET
 * and it is enforced; leave it unset and it is skipped, so this deploys safely
 * before the keys exist.
 * ---------------------------------------------------------------- */
const ALLOWED_ORIGINS = [
  "https://dutycleaners.ca",
  "https://www.dutycleaners.ca",
  "https://dutycleaners-preview.netlify.app",
  "https://duty-cleaners-preview.netlify.app",
  "https://mikaily131.sg-host.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];
const MIN_DWELL_MS = 3_000;

function originAllowed(req: Request) {
  const origin = req.headers.get("origin");
  // Non-browser callers send no Origin. Those are not the abuse vector this
  // stops, and blocking them would break server-side testing.
  if (!origin) return true;
  return ALLOWED_ORIGINS.includes(origin);
}

async function turnstileOk(token: string | undefined, ip: string) {
  const secret = Deno.env.get("TURNSTILE_SECRET");
  if (!secret) return true; // not configured yet
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
    });
    const body = await res.json();
    return body.success === true;
  } catch {
    // Never let an outage at Cloudflare stop a real lead reaching the CRM.
    return true;
  }
}

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > RATE_MAX;
}

/** Canadian numbers to E.164; anything already prefixed passes through. */
export function toE164(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed.startsWith("+")) return "+" + trimmed.slice(1).replace(/\D/g, "");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return `+${digits}`;
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  return { firstName: parts[0] ?? "", lastName: parts.slice(1).join(" ") };
}

async function ghlFetch(path: string, init: RequestInit, token: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(`${GHL_API}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${token}`,
        Version: GHL_VERSION,
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

/* ---------------------------------------------------------------- *
 * Custom-field id map, fetched once and cached for the isolate.
 * ---------------------------------------------------------------- */
let fieldIdCache: Record<string, string> | null = null;

async function getFieldIds(token: string): Promise<Record<string, string>> {
  if (fieldIdCache) return fieldIdCache;

  const res = await ghlFetch(`/locations/${LOCATION_ID}/customFields`, { method: "GET" }, token);
  if (!res.ok) {
    throw new Error(`customFields lookup failed with ${res.status}`);
  }
  const json = (await res.json()) as { customFields?: Array<{ id: string; fieldKey?: string }> };
  const byKey = new Map<string, string>();
  for (const field of json.customFields ?? []) {
    if (field.fieldKey) byKey.set(field.fieldKey, field.id);
  }

  const resolved: Record<string, string> = {};
  const missing: string[] = [];
  for (const key of Object.keys(FIELD_MAP)) {
    const id = byKey.get(key);
    if (!id) missing.push(key);
    else resolved[key] = id;
  }
  if (missing.length) {
    throw new Error(`missing GHL custom fields: ${missing.join(", ")}`);
  }

  fieldIdCache = resolved;
  return resolved;
}

function customFieldValue(payloadKey: string, payload: Payload): string {
  const raw = (payload as Record<string, unknown>)[payloadKey];
  if (raw === null || raw === undefined) return "";
  if (Array.isArray(raw)) return raw.join("; ");
  return String(raw);
}

async function upsertContact(payload: Payload, token: string) {
  const ids = await getFieldIds(token);
  const { firstName, lastName } = splitName(payload.full_name);

  const customFields = Object.entries(FIELD_MAP)
    .map(([fieldKey, payloadKey]) => ({
      id: ids[fieldKey],
      field_value: customFieldValue(payloadKey, payload),
    }))
    .filter((entry) => entry.field_value !== "");

  /*
    A job applicant is not a sales lead.

    Every submission used to get "instant-quote" regardless of where it came
    from, so people applying through /join-the-team/ landed in the CRM carrying
    the tag the quote funnel uses as its marker. Any workflow keyed on that tag
    would send cleaning quotes and follow-up marketing to someone who asked for
    a job — commercial messages without consent, which is a CASL problem, and a
    purpose-limitation problem under PIPA besides.

    Careers submissions now carry one tag of their own and none of the sales
    ones: no city, no quote-confirmed, no deep-intent, nothing a quote
    automation can match on.
  */
  const isCareers = payload.source === "careers-application";
  const tags = isCareers ? ["careers-applicant"] : ["instant-quote"];
  if (!isCareers) {
    if (payload.city) tags.push(payload.city.toLowerCase());
    if (payload.stage === "confirm") tags.push("quote-confirmed");
    // Deep-clean intent: Standard + the Deep Cleaning package at booking.
    if (payload.intent === "deep") tags.push("deep-intent");
  }

  const body = JSON.stringify({
    locationId: LOCATION_ID,
    name: payload.full_name,
    firstName,
    lastName,
    email: payload.email,
    phone: toE164(payload.phone),
    source: payload.source || "dutycleaners.ca instant quote",
    tags,
    customFields,
  });

  // One retry, network errors and 5xx only — a 4xx is never retried.
  let lastError = "";
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await ghlFetch(
        "/contacts/upsert",
        { method: "POST", headers: { "Content-Type": "application/json" }, body },
        token
      );
      const text = await res.text();
      let contactId: string | undefined;
      try {
        const parsed = JSON.parse(text);
        contactId = parsed?.contact?.id ?? parsed?.id;
      } catch {
        /* non-JSON response */
      }

      if (res.ok && contactId) {
        return { ok: true, status: res.status, contactId, error: "" };
      }
      if (res.status < 500) {
        return {
          ok: false,
          status: res.status,
          contactId: undefined,
          error: text.slice(0, 500),
        };
      }
      lastError = text.slice(0, 500);
    } catch (error) {
      lastError = String(error);
    }
  }

  return { ok: false, status: 0, contactId: undefined, error: lastError };
}

const RETRY_DELAY_MINUTES = [5, 30, 120, 720, 1440, 2880];

/** Delivers one durably stored row and records whether another retry is due. */
async function deliverStoredLead(
  row: { id: string; ghl_attempts?: number | null },
  payload: Payload,
  token: string,
  supabase: RelayClient,
) {
  const attempt = (row.ghl_attempts ?? 0) + 1;
  let result: { ok: boolean; status: number; contactId?: string; error: string };
  try {
    result = await upsertContact(payload, token);
  } catch (error) {
    console.error("[ghl-quote] upsert failed", String(error));
    result = { ok: false, status: 0, error: String(error) };
  }

  // Free-text contact messages belong in a GHL note, never a custom field.
  // Best-effort: the durable row and contact already exist at this point.
  if (result.ok && result.contactId && payload.notes?.trim()) {
    try {
      const noteRes = await ghlFetch(
        `/contacts/${result.contactId}/notes`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: payload.notes.trim() }),
        },
        token,
      );
      if (!noteRes.ok) console.error("[ghl-quote] note failed", noteRes.status);
    } catch (error) {
      console.error("[ghl-quote] note failed", String(error));
    }
  }

  const terminal = !result.ok && attempt >= RETRY_DELAY_MINUTES.length;
  const delayMinutes = RETRY_DELAY_MINUTES[Math.min(attempt - 1, RETRY_DELAY_MINUTES.length - 1)];
  const nextRetry = result.ok || terminal
    ? null
    : new Date(Date.now() + delayMinutes * 60_000).toISOString();

  await supabase
    .from("quote_leads")
    .update({
      ghl_ok: result.ok,
      ghl_status: result.status,
      ghl_contact_id: result.contactId ?? null,
      ghl_error: result.error ? result.error.slice(0, 500) : null,
      ghl_attempts: attempt,
      ghl_last_attempt_at: new Date().toISOString(),
      ghl_next_retry_at: nextRetry,
      delivery_state: result.ok ? "delivered" : terminal ? "failed" : "pending",
    })
    .eq("id", row.id);

  if (result.ok && (row.ghl_attempts ?? 0) > 0) {
    await reportFormHealth("recovered", "ghl-delivery", "delivery", result.status, payload.source);
  } else if (!result.ok) {
    await reportFormHealth(
      "failed",
      "ghl-delivery",
      "delivery",
      result.status,
      payload.source,
    );
  }

  console.log("[ghl-quote] delivery", payload.stage, result.ok, result.status, attempt);
  return result;
}

/** Authenticated target for a Supabase Cron invocation. */
async function retryPendingLeads(
  req: Request,
  supabase: RelayClient,
  token: string | undefined,
) {
  const expected = Deno.env.get("QUOTE_RETRY_SECRET");
  if (!expected || req.headers.get("x-quote-retry-secret") !== expected) {
    return { body: { ok: false, error: "unauthorized" }, status: 401 };
  }
  if (!token) return { body: { ok: false, error: "relay not configured" }, status: 503 };

  const { data, error } = await supabase
    .from("quote_leads")
    .select("id,payload,ghl_attempts")
    .eq("delivery_state", "pending")
    .lt("ghl_attempts", RETRY_DELAY_MINUTES.length)
    .lte("ghl_next_retry_at", new Date().toISOString())
    .order("ghl_next_retry_at", { ascending: true })
    .limit(10);

  if (error) return { body: { ok: false, error: "queue unavailable" }, status: 503 };

  let delivered = 0;
  let pending = 0;
  for (const queued of data ?? []) {
    const parsed = PayloadSchema.safeParse(queued.payload);
    if (!parsed.success) {
      await supabase
        .from("quote_leads")
        .update({ delivery_state: "failed", ghl_error: "stored payload is invalid" })
        .eq("id", queued.id);
      continue;
    }
    const result = await deliverStoredLead(queued, parsed.data, token, supabase);
    if (result.ok) delivered += 1;
    else pending += 1;
  }
  return { body: { ok: true, checked: (data ?? []).length, delivered, pending }, status: 200 };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const raw = await req.json();
    const token = Deno.env.get("GHL_PI_TOKEN");
    const supabase = createRelayClient();

    if (raw && typeof raw === "object" && (raw as { operation?: unknown }).operation === "retry_pending") {
      const retry = await retryPendingLeads(req, supabase, token);
      return json(retry.body, retry.status);
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("cf-connecting-ip") ??
      "unknown";
    if (!originAllowed(req)) {
      return json({ ok: false, status: 403, error: "forbidden origin" }, 403);
    }
    if (rateLimited(ip)) {
      return json({ ok: false, status: 429, error: "rate limited" }, 429);
    }

    const parsed = PayloadSchema.safeParse(raw);
    if (!parsed.success) {
      return json({ ok: false, status: 400, error: parsed.error.flatten().fieldErrors }, 400);
    }
    const payload = parsed.data;

    /*
      Silent rejections. These use a generic accepted response but never claim
      that a row was stored and never return a receipt id. The browser requires
      that verifiable receipt before it reveals the complete price.
    */
    if (payload.website && payload.website.trim() !== "") {
      return json({ ok: true, stored: false, delivery: "pending", status: 202 });
    }
    if (payload.formOpenedAt && Date.now() - payload.formOpenedAt < MIN_DWELL_MS) {
      return json({ ok: true, stored: false, delivery: "pending", status: 202 });
    }
    if (!(await turnstileOk(payload.turnstileToken, ip))) {
      return json({ ok: false, status: 403, error: "verification failed" }, 403);
    }

    // Backup capture first — the durable receipt, not GHL's availability, is
    // what permits the customer to see the complete price.
    const requestId = payload.request_id ?? crypto.randomUUID();
    let { data: row } = await supabase
      .from("quote_leads")
      .select("id,ghl_ok,ghl_contact_id,ghl_attempts")
      .eq("request_id", requestId)
      .maybeSingle();

    if (!row) {
      const stored = await supabase
        .from("quote_leads")
        .insert({
          request_id: requestId,
          stage: payload.stage,
          city: payload.city ?? null,
          service: payload.service ?? null,
          home_type: payload.home_type ?? null,
          bedrooms: payload.bedrooms != null ? String(payload.bedrooms) : null,
          full_bathrooms: payload.full_bathrooms != null ? String(payload.full_bathrooms) : null,
          half_baths: payload.half_baths != null ? String(payload.half_baths) : null,
          frequency: payload.frequency ?? null,
          addons: payload.addons?.join("; ") ?? null,
          first_clean_price: payload.first_clean_price ?? null,
          recurring_price: payload.recurring_price ?? null,
          currency: payload.currency ?? "CAD",
          full_name: payload.full_name,
          email: payload.email,
          phone: toE164(payload.phone),
          page_url: payload.page_url ?? null,
          tracking: payload.tracking ?? {},
          payload,
        })
        .select("id,ghl_ok,ghl_contact_id,ghl_attempts")
        .single();
      row = stored.data;
      if (stored.error) {
        // A concurrent same-id request may have won the unique-index race.
        const existing = await supabase
          .from("quote_leads")
          .select("id,ghl_ok,ghl_contact_id,ghl_attempts")
          .eq("request_id", requestId)
          .maybeSingle();
        row = existing.data;
      }
    }

    if (!row?.id) {
      console.error("[ghl-quote] durable capture failed");
      await reportFormHealth("failed", "durable-capture", "storage", 503, payload.source);
      return json({ ok: false, stored: false, status: 503, error: "capture unavailable" }, 503);
    }

    await reportFormHealth("recovered", "durable-capture", "storage", 200, payload.source);

    if (row.ghl_ok && row.ghl_contact_id) {
      return json({
        ok: true,
        stored: true,
        delivery: "delivered",
        status: 200,
        receiptId: row.id,
        contactId: row.ghl_contact_id,
      });
    }

    if (!token) {
      console.error("[ghl-quote] GHL_PI_TOKEN is not set");
      await supabase
        .from("quote_leads")
        .update({ ghl_ok: false, ghl_status: 0, ghl_error: "token missing", delivery_state: "pending" })
        .eq("id", row.id);
      await reportFormHealth("failed", "ghl-delivery", "configuration", 0, payload.source);
      return json({ ok: true, stored: true, delivery: "pending", status: 202, receiptId: row.id });
    }

    const deliveryTask = deliverStoredLead(row, payload, token, supabase);
    const runtime = globalThis as typeof globalThis & {
      EdgeRuntime?: { waitUntil(promise: Promise<unknown>): void };
    };
    if (runtime.EdgeRuntime?.waitUntil) runtime.EdgeRuntime.waitUntil(deliveryTask);
    else void deliveryTask;

    return json({
      ok: true,
      stored: true,
      delivery: "pending",
      status: 202,
      receiptId: row.id,
    });
  } catch (error) {
    console.error("[ghl-quote] relay failed", String(error));
    return json({ ok: false, status: 500, error: "relay error" }, 500);
  }
});
