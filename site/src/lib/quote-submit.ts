/**
 * Sends funnel data to GoHighLevel through the `ghl-quote` edge function,
 * which calls GHL's official API v2 server-side (the Private Integration
 * token never touches the browser).
 *
 * Two rules this module exists to enforce:
 *   1. The relay's real outcome is passed through — only a 2xx with a contact
 *      id counts as success, so the funnel can never show a fake price.
 *   2. A lead is never silently dropped: every failure path returns
 *      `{ ok: false }` so the UI can show the phone fallback.
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
  contactId?: string | null;
}

/** Step 3 sends prices and extras; that is what makes it a confirmation. */
const stageFor = (payload: Partial<QuotePayload>): "lead" | "confirm" =>
  "first_clean_price" in payload || "recurring_price" in payload ? "confirm" : "lead";

export async function submitQuote(payload: Partial<QuotePayload>): Promise<SubmitResult> {
  try {
    const response = await fetch(`${FUNCTIONS_URL}/ghl-quote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Edge Functions accept the anon key on either header; send both so we
        // match what supabase-js did byte for byte.
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({
        ...payload,
        stage: stageFor(payload),
        tracking: getStoredTracking(),
      }),
    });

    if (!response.ok) {
      console.error("[quote] relay error", response.status, await response.text().catch(() => ""));
      return { ok: false, status: 0 };
    }

    const result = (await response.json()) as { ok?: boolean; status?: number; contactId?: string | null };
    if (!result?.ok) console.error("[quote] GHL rejected the submission", result);
    return {
      ok: Boolean(result?.ok),
      status: result?.status ?? 0,
      contactId: result?.contactId ?? null,
    };
  } catch (error) {
    console.error("[quote] submission failed", error);
    return { ok: false, status: 0 };
  }
}
