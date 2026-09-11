/**
 * Google Ads / marketing attribution capture.
 *
 * Captures gclid + UTM parameters from the landing URL into sessionStorage
 * (first-touch wins), so they can be forwarded through the quote funnel —
 * onto the BookingKoala handoff (src/lib/booking-redirect.ts).
 *
 * Also tracks the `service` context (from ?service=<slug> deep links) so the
 * quote section can personalize its heading. Unlike ad params, service intent
 * always updates to the latest value.
 */

import type { ServiceId } from "@/data/pricing";

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

/* ------------------------------------------------------------------ *
 * The page's own service context
 * ------------------------------------------------------------------ */

/**
 * Service pages whose quote CTAs are bare `#quote` links. The page itself is
 * the service context: a quote opened on the Calgary move-out page is a
 * move-out quote. Edmonton's march-out page is a move-out clean too.
 */
const PAGE_SERVICES: [RegExp, ServiceId][] = [
  [
    /^\/(?:move-out-cleaning-(?:edmonton|calgary)|(?:edmonton|calgary)\/move-in-move-out-cleaning|edmonton\/march-out-cleaning)\/?$/,
    "move-in-out",
  ],
  [
    /^\/(?:post-construction-cleaning(?:-calgary)?|(?:edmonton|calgary)\/post-construction-cleaning)\/?$/,
    "post-construction",
  ],
];

/** `?service=` slugs a landing URL can carry, onto the funnel's own services. */
const SERVICE_SLUGS: Record<string, ServiceId> = {
  "regular-cleaning": "standard",
  "recurring-cleaning": "standard",
  "deep-cleaning": "standard",
  standard: "standard",
  "move-in-out-cleaning": "move-in-out",
  "move-in-out": "move-in-out",
  "post-construction-cleaning": "post-construction",
  "post-construction": "post-construction",
};

/**
 * The service the current page asks for, or null when the page is not about
 * one service. The path decides first; a `?service=` slug on the landing URL
 * counts only when the path says nothing. Session storage is never read here:
 * a service remembered from an earlier page is exactly the stale choice this
 * must not bring back.
 */
export function pageServiceFor(pathname: string, search = ""): ServiceId | null {
  for (const [pattern, service] of PAGE_SERVICES) {
    if (pattern.test(pathname)) return service;
  }
  const slug = new URLSearchParams(search).get("service")?.toLowerCase() ?? "";
  return SERVICE_SLUGS[slug] ?? null;
}

/**
 * Which service the quote flow shows when the overlay opens.
 *
 * The overlay stays mounted from page to page, so its state outlives the page
 * it was chosen on. A reviewer chose Standard, moved to the Calgary move-out
 * page, pressed "See My Instant Price" and was quoted Standard. The order:
 *
 *   1. A CTA that carried a service (the hero card's Continue) was just
 *      clicked: it wins.
 *   2. The page is about one service, and the visitor has not picked a
 *      service inside the flow on this same page: the page wins.
 *   3. Otherwise the flow keeps what it has, so a choice made in the flow on
 *      this page survives closing and reopening the overlay.
 *
 * "This page" is the path together with its query string: a choice made on
 * "/" does not outlive a later link to "/?service=regular-cleaning".
 */
export function serviceOnOpen({
  current,
  preset,
  pageService,
  choicePath,
  pathname,
  search = "",
}: {
  current: ServiceId;
  /** The service the opening CTA carried, or null for a bare #quote link. */
  preset: ServiceId | null;
  pageService: ServiceId | null;
  /**
   * Where the visitor last picked a service inside the flow, if anywhere: the
   * path plus query string (`pathname + search`) it was picked on.
   */
  choicePath: string | null;
  pathname: string;
  /** The current query string, "" or "?service=…". */
  search?: string;
}): ServiceId {
  if (preset) return preset;
  if (pageService && choicePath !== pathname + search) return pageService;
  return current;
}
