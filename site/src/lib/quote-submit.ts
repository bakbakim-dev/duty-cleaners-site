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

import { supabase } from "@/integrations/supabase/client";
import { getStoredTracking } from "@/lib/tracking";

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
    const { data, error } = await supabase.functions.invoke("ghl-quote", {
      body: {
        ...payload,
        stage: stageFor(payload),
        tracking: getStoredTracking(),
      },
    });

    if (error) {
      console.error("[quote] relay error", error);
      return { ok: false, status: 0 };
    }

    const result = data as { ok?: boolean; status?: number; contactId?: string | null };
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
