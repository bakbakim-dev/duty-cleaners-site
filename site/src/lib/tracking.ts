/**
 * Google Ads / marketing attribution capture.
 *
 * Captures gclid + UTM parameters from the landing URL into sessionStorage
 * (first-touch wins), so they can be forwarded through the quote funnel —
 * including the GHL form -> /quote-redirect -> BookingKoala chain.
 *
 * Also tracks the `service` context (from ?service=<slug> deep links) so the
 * quote section can personalize its heading. Unlike ad params, service intent
 * always updates to the latest value.
 */

const STORAGE_KEY = "dc-tracking";

export const TRACKED_PARAMS = [
  "gclid",
  "gbraid",
  "wbraid",
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

export const SERVICE_LABELS: Record<string, string> = {
  "regular-cleaning": "Standard Cleaning",
  "deep-cleaning": "Deep Cleaning",
  "recurring-cleaning": "Recurring Cleaning",
  "move-in-out-cleaning": "Move In/Out Cleaning",
};

export function getStoredTracking(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, string>) : {};
  } catch {
    return {};
  }
}

export function captureTrackingParams(): void {
  if (typeof window === "undefined") return;
  try {
    const search = new URLSearchParams(window.location.search);
    const incoming: Record<string, string> = {};
    for (const key of TRACKED_PARAMS) {
      const value = search.get(key);
      if (value) incoming[key] = value;
    }
    const service = search.get("service");

    // First-touch wins for ad params — existing stored values take priority.
    const merged = { ...incoming, ...getStoredTracking() };
    // Service intent always reflects the latest deep link.
    if (service) merged.service = service;

    if (Object.keys(incoming).length > 0 || service) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    }
  } catch {
    // Storage unavailable (private mode etc.) — attribution is best-effort.
  }
}

/**
 * Resolves the current quote-service label from the URL first, then storage.
 * Returns null when no recognized service context exists.
 */
export function getQuoteServiceLabel(): string | null {
  if (typeof window === "undefined") return null;
  const fromUrl = new URLSearchParams(window.location.search).get("service");
  const slug = fromUrl ?? getStoredTracking().service ?? null;
  return slug ? SERVICE_LABELS[slug] ?? null : null;
}
