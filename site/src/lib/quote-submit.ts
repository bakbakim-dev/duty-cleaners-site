/**
 * Sends funnel data to GoHighLevel through the `ghl-quote` edge function,
 * which calls GHL's official API v2 server-side (the Private Integration
 * token never touches the browser).
 *
 * Two rules this module exists to enforce:
 *   1. The price opens only after the relay returns a durable receipt for the
 *      private quote_leads table. GHL delivery happens behind that receipt and
 *      may be retried without holding the customer on this screen.
 *   2. A lead is never silently dropped: a timeout, rejected request or failed
 *      durable write returns `{ ok: false }` so the UI can retain every field
 *      and offer a same-request retry.
 */

import { getStoredTracking } from "@/lib/tracking";

/**
 * The relay is a Supabase Edge Function, but reaching it is a single
 * unauthenticated POST — no session, no realtime, no database queries. Pulling
 * in @supabase/supabase-js for that shipped the whole SDK to every visitor on
 * every page just to build one fetch() call. `functions.invoke(name, { body })`
 * is exactly the request below, so we make it directly.
 */
const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

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
  frequency_discount_pct: number;
  first_clean_price: number | null;
  recurring_price: number | null;
  currency: "CAD";
  full_name: string;
  email: string;
  phone: string;
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
}

export function createQuoteRequestId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

export async function submitQuote(
  payload: Partial<QuotePayload>,
  options: SubmitQuoteOptions = {},
): Promise<SubmitResult> {
  const controller = new AbortController();
  const timeoutMs = options.timeoutMs ?? 12_000;
  const timer = globalThis.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${FUNCTIONS_URL}/ghl-quote`, {
      method: "POST",
      signal: controller.signal,
      keepalive: options.keepalive ?? false,
      headers: {
        "Content-Type": "application/json",
        // Edge Functions accept the anon key on either header; send both so we
        // match what supabase-js did byte for byte.
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        ...payload,
        request_id: options.requestId ?? payload.request_id ?? createQuoteRequestId(),
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
      return { ok: false, status: response.status };
    }

    const result = (await response.json()) as {
      ok?: boolean;
      stored?: boolean;
      delivery?: "delivered" | "pending";
      status?: number;
      receiptId?: string | null;
      contactId?: string | null;
    };
    const hasDurableReceipt = Boolean(result?.ok && result?.stored && result?.receiptId);
    if (!hasDurableReceipt) console.error("[quote] relay did not issue a durable receipt");
    return {
      ok: hasDurableReceipt,
      status: result?.status ?? 0,
      stored: Boolean(result?.stored),
      delivery: result?.delivery,
      receiptId: result?.receiptId ?? null,
      contactId: result?.contactId ?? null,
    };
  } catch (error) {
    console.error(
      "[quote] submission failed",
      error instanceof Error && error.name === "AbortError" ? "timeout" : "network",
    );
    return { ok: false, status: 0 };
  } finally {
    globalThis.clearTimeout(timer);
  }
}
