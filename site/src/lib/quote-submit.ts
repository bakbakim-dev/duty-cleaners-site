/**
 * Sends funnel data to GoHighLevel through Duty Cleaners' SiteGround relay.
 * The relay calls GHL's official API v2 server-side, so the Private
 * Integration token never touches the browser.
 *
 * Two rules this module exists to enforce:
 *   1. A successful result requires a durable receipt for the private
 *      quote_leads table. The funnel may still reveal its locally calculated
 *      price on failure, with an honest retry notice, so a CRM outage does not
 *      become a customer-facing calculator outage.
 *   2. A lead is never silently dropped: a timeout, rejected request or failed
 *      durable write returns `{ ok: false }` so the UI can retain every field
 *      and offer a same-request retry.
 */

import { getStoredTracking } from "@/lib/tracking";
import {
  monitoredFormForSource,
  reportFormFailure,
  reportFormRecovery,
  type FailureCategory,
} from "@/lib/form-health";

const RELAY_URL = "/api/ghl-quote.php";

export interface QuotePayload {
  /** Stable across retries; lead and confirmation use different ids. */
  request_id: string;
  source: string;
  city: string;
  service: string;
  home_type: string;
  bedrooms: string | number;
  full_bathrooms: string | number;
  half_baths: string | number;
  addons: string[];
  frequency: string;
  /** Null while the visitor has not chosen a plan yet. */
  frequency_discount_pct: number | null;
  first_clean_price: number | null;
  recurring_price: number | null;
  currency: "CAD";
  full_name: string;
  email: string;
  phone: string;
  /** Free-form customer instructions are sent separately from short add-on labels. */
  notes?: string;
  page_url: string;
  submitted_at: string;
  /** "deep" when the visitor came through a Deep Cleaning entry point. */
  intent: "deep" | null;
}

export interface SubmitResult {
  ok: boolean;
  status: number;
  stored?: boolean;
  delivery?: "delivered" | "pending";
  receiptId?: string | null;
  contactId?: string | null;
}

/** Step 3 sends prices and extras; that is what makes it a confirmation. */
const stageFor = (payload: Partial<QuotePayload>): "lead" | "confirm" =>
  "first_clean_price" in payload || "recurring_price" in payload ? "confirm" : "lead";

/*
  When this module was first evaluated — close enough to when the visitor
  arrived to serve as a dwell reference. The relay rejects submissions that
  complete in under three seconds, which no person reading the form can do and
  most scripted posts will.
*/
const LOADED_AT = Date.now();

export interface SubmitQuoteOptions {
  /** Stable id supplied by the funnel so a visible Retry cannot duplicate a row. */
  requestId?: string;
  /** A bounded wait keeps a failed relay from trapping the customer forever. */
  timeoutMs?: number;
  /** Keeps the final-details request alive while the browser leaves for BookingKoala. */
  keepalive?: boolean;
  /** The funnel visit this submission belongs to (leave detection, quote-presence.ts). */
  sessionId?: string;
}

/**
 * Ask the relay to hand a stored submission to GoHighLevel now. SiteGround
 * cannot keep working after it answers, so without this a lead waited for the
 * five-minute cron job. Fire and forget: the receipt already exists, and the
 * cron job still delivers anything this misses.
 */
export function requestDelivery(requestId: string): void {
  try {
    void fetch(RELAY_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation: "deliver", request_id: requestId }),
    }).catch(() => undefined);
  } catch {
    // Delivery still happens through the cron job.
  }
}

export function createQuoteRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

/**
 * A retry may reuse its request id only while the customer-visible payload is
 * unchanged. Submission timestamps are transport metadata, so they are omitted.
 */
export function fingerprintQuotePayload(payload: Partial<QuotePayload>): string {
  const { submitted_at: _submittedAt, request_id: _requestId, ...stable } = payload;
  return JSON.stringify(stable, Object.keys(stable).sort());
}

export async function submitQuote(
  payload: Partial<QuotePayload>,
  options: SubmitQuoteOptions = {},
): Promise<SubmitResult> {
  const form = monitoredFormForSource(payload.source);
  const stage = form === "quote-funnel"
    ? (stageFor(payload) === "confirm" ? "confirmation" : "lead")
    : "form-submit";
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 12_000;
  const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  const requestId = options.requestId ?? payload.request_id ?? createQuoteRequestId();
  try {
    const response = await fetch(RELAY_URL, {
      method: "POST",
      signal: controller.signal,
      keepalive: options.keepalive ?? false,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        request_id: requestId,
        ...(options.sessionId ? { session_id: options.sessionId } : {}),
        stage: stageFor(payload),
        tracking: getStoredTracking(),
        // Anti-abuse. The honeypot stays empty for anyone using a browser; the
        // timestamp lets the relay reject instant submissions. Neither asks the
        // customer for anything, and neither blocks a real lead if omitted.
        website: "",
        formOpenedAt: LOADED_AT,
      }),
    });

    if (!response.ok) {
      // Never log the response body: a proxy or validation error can echo
      // submitted personal data back to the browser console.
      console.error("[quote] relay error", response.status);
      reportFormFailure({ form, stage, category: "http", status: response.status });
      return { ok: false, status: response.status };
    }

    let result: {
      ok?: boolean;
      stored?: boolean;
      delivery?: "delivered" | "pending";
      status?: number;
      receiptId?: string | null;
      contactId?: string | null;
    };
    try {
      result = await response.json();
    } catch {
      console.error("[quote] relay returned invalid JSON");
      reportFormFailure({ form, stage, category: "invalid-response", status: response.status });
      return { ok: false, status: response.status };
    }
    const hasDurableReceipt = Boolean(result?.ok && result?.stored && result?.receiptId);
    if (!hasDurableReceipt) {
      console.error("[quote] relay did not issue a durable receipt");
      reportFormFailure({ form, stage, category: "invalid-response", status: result?.status ?? response.status });
    } else {
      reportFormRecovery({ form, stage, category: "invalid-response", status: result?.status ?? response.status });
      if (result?.delivery === "pending") requestDelivery(requestId);
    }
    return {
      ok: hasDurableReceipt,
      status: result?.status ?? 0,
      stored: Boolean(result?.stored),
      delivery: result?.delivery,
      receiptId: result?.receiptId ?? null,
      contactId: result?.contactId ?? null,
    };
  } catch (error) {
    const category: FailureCategory = error instanceof Error && error.name === "AbortError"
      ? "timeout"
      : "network";
    console.error(
      "[quote] submission failed",
      category,
    );
    reportFormFailure({ form, stage, category, status: 0 });
    return { ok: false, status: 0 };
  } finally {
    globalThis.clearTimeout(timer);
  }
}
