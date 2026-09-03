/**
 * Server-side relay for the quote funnel → GoHighLevel API v2.
 *
 * The site never talks to GHL directly: the browser posts the quote payload
 * here, this function records it in `quote_leads`, then upserts the contact
 * through GHL's official API using a Private Integration token that only ever
 * exists server-side.
 *
 * The relay never invents success: only a 2xx carrying a contact id is
 * reported as ok, so the funnel can gate its next step on a real result.
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

  const tags = ["instant-quote"];
  if (payload.city) tags.push(payload.city.toLowerCase());
  if (payload.stage === "confirm") tags.push("quote-confirmed");
  // Deep-clean intent: Standard + the Deep Cleaning package at booking.
  if (payload.intent === "deep") tags.push("deep-intent");

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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("cf-connecting-ip") ??
      "unknown";
    if (rateLimited(ip)) {
      return json({ ok: false, status: 429, error: "rate limited" });
    }

    const parsed = PayloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return json({ ok: false, status: 400, error: parsed.error.flatten().fieldErrors }, 400);
    }
    const payload = parsed.data;

    const token = Deno.env.get("GHL_PI_TOKEN");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Backup capture first — a lead is never lost, whatever GHL does next.
    const { data: row } = await supabase
      .from("quote_leads")
      .insert({
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
      .select("id")
      .single();

    if (!token) {
      console.error("[ghl-quote] GHL_PI_TOKEN is not set");
      if (row?.id) {
        await supabase
          .from("quote_leads")
          .update({ ghl_ok: false, ghl_status: 0, ghl_error: "token missing" })
          .eq("id", row.id);
      }
      return json({ ok: false, status: 0, error: "relay not configured" });
    }

    let result: { ok: boolean; status: number; contactId?: string; error: string };
    try {
      result = await upsertContact(payload, token);
    } catch (error) {
      console.error("[ghl-quote] upsert failed", String(error));
      result = { ok: false, status: 0, error: String(error) };
    }

    // The contact form's Message is free text with nowhere to go in FIELD_MAP,
    // so it used to be dropped here. GHL keeps notes on their own endpoint.
    // Best-effort: the contact is already saved, and a failed note is not a
    // reason to report a failed submission.
    if (result.ok && result.contactId && payload.notes?.trim()) {
      try {
        const noteRes = await ghlFetch(
          `/contacts/${result.contactId}/notes`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: payload.notes.trim() }),
          },
          token
        );
        if (!noteRes.ok) {
          console.error(
            "[ghl-quote] note failed",
            noteRes.status,
            (await noteRes.text()).slice(0, 300)
          );
        }
      } catch (error) {
        console.error("[ghl-quote] note failed", String(error));
      }
    }

    if (row?.id) {
      await supabase
        .from("quote_leads")
        .update({
          ghl_ok: result.ok,
          ghl_status: result.status,
          ghl_contact_id: result.contactId ?? null,
          ghl_error: result.error || null,
        })
        .eq("id", row.id);
    }

    console.log("[ghl-quote]", payload.stage, result.ok, result.status, result.contactId ?? "");

    return json({
      ok: result.ok,
      status: result.status,
      contactId: result.contactId ?? null,
      error: result.ok ? undefined : result.error.slice(0, 300),
    });
  } catch (error) {
    console.error("[ghl-quote] relay failed", String(error));
    return json({ ok: false, status: 0, error: "relay error" });
  }
});
