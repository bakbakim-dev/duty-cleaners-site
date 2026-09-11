/**
 * Analytics: one small module, three jobs.
 *
 *  1. track(): the only way the site records an event. It strips anything that
 *     could identify a person before the event leaves this function, then hands
 *     it to Google Analytics 4 (when the loader below has run) or pushes it to a
 *     GTM-style dataLayer (when it has not). Nothing in the funnel depends on a
 *     tag being installed, and analytics can never break the booking flow.
 *  2. initAnalytics(): the optional GA4 loader. It does nothing at all unless
 *     VITE_GA4_MEASUREMENT_ID is set at build time, and then only on
 *     dutycleaners.ca / www.dutycleaners.ca. No inline script: index.html
 *     carries exactly one inline script, pinned by a sha256 in public/_headers.
 *  3. initContactClickTracking(): one document-level listener that records
 *     phone_click / email_click for every tel: and mailto: link on the site,
 *     without the number or address itself.
 *
 * What may be sent: the city, the service, the funnel step, the frequency, the
 * kind of price shown, the deep-clean intent and the device class. Names,
 * emails, phone numbers, addresses, postal codes, notes and any other free text
 * are dropped here, whatever the caller passes. The privacy policy
 * (pages/PrivacyPolicy.tsx) describes exactly this.
 */

import { branchFromPath } from "@/lib/city-from-path";
import { TRACKED_PARAMS } from "@/lib/tracking";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    /** Set by initAnalytics() once gtag.js has been requested. */
    __dcGa4?: string;
  }
}

/** The only keys an event may carry. Anything else is dropped. */
export const ALLOWED_PROP_KEYS = [
  "city",
  "service",
  "step",
  "step_number",
  "pane",
  "frequency",
  "price_type",
  "intent",
  "device",
] as const;

/** Keys that name personal data. Dropped even if a later edit allowlists them. */
const PERSONAL_KEY =
  /name|mail|phone|tel|mobile|address|street|postal|zip|message|note|comment|text|contact|detail|entry|instruction/i;

const EMAIL_VALUE = /[^\s@]+@[^\s@]+/;
/** Seven or more digits, with or without separators: any phone number. */
const PHONE_VALUE = /(?:\d[\s().+-]*){7,}/;
/** A Canadian postal code, spaced or not. */
const POSTAL_VALUE = /\b[A-Za-z]\d[A-Za-z][\s-]?\d[A-Za-z]\d\b/;
/** Allowed values are short tokens ("calgary", "move-in-out", "price"), never prose. */
const TOKEN_VALUE = /^[A-Za-z0-9_.:/-]{1,40}$/;

/**
 * Returns only the props that are safe to send: allowlisted keys, primitive
 * values, and strings that look like a short token rather than a person's
 * details or free text.
 */
export function filterEventProps(props: Record<string, unknown> = {}): Record<string, string | number | boolean> {
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!(ALLOWED_PROP_KEYS as readonly string[]).includes(key)) continue;
    if (PERSONAL_KEY.test(key)) continue;
    if (typeof value === "boolean") {
      safe[key] = value;
    } else if (typeof value === "number") {
      // Small counters only (a step number); a long number could be a phone.
      if (Number.isFinite(value) && Math.abs(value) < 1_000_000) safe[key] = value;
    } else if (typeof value === "string") {
      const text = value.trim();
      if (!TOKEN_VALUE.test(text)) continue;
      if (EMAIL_VALUE.test(text) || PHONE_VALUE.test(text) || POSTAL_VALUE.test(text)) continue;
      safe[key] = text;
    }
  }
  return safe;
}

/** "mobile" under 768 px, "tablet" under 1024 px, otherwise "desktop". */
export function deviceClass(): "mobile" | "tablet" | "desktop" | "unknown" {
  if (typeof window === "undefined" || typeof window.innerWidth !== "number") return "unknown";
  if (window.innerWidth < 768) return "mobile";
  if (window.innerWidth < 1024) return "tablet";
  return "desktop";
}

/** Event names are fixed identifiers written in code, never built from input. */
const EVENT_NAME = /^[a-z][a-z0-9_]{0,39}$/;

export function track(event: string, props: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  if (!EVENT_NAME.test(event)) return;
  try {
    const safe = filterEventProps({ device: deviceClass(), ...props });
    if (window.__dcGa4 && typeof window.gtag === "function") {
      // gtag() writes to the dataLayer itself; pushing the object as well would
      // hand a future GTM container the same event twice.
      const location = safePageLocation(window.location?.href ?? "");
      window.gtag("event", event, location ? { ...safe, page_location: location } : safe);
      return;
    }
    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event, ...safe });
  } catch {
    /* analytics must never break the booking flow */
  }
}

/* ------------------------------------------------------------------ *
 * Google Analytics 4 loader
 * ------------------------------------------------------------------ */

export const GA4_SCRIPT_ORIGIN = "https://www.googletagmanager.com";
const GA4_ID = /^G-[A-Z0-9]{4,20}$/;

/** True when the browser asks sites not to track (Global Privacy Control or Do Not Track). */
function browserAsksNotToTrack(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1" || nav.msDoNotTrack === "1";
}

/**
 * The only hostnames that record anything: the live site. Netlify previews
 * (*.netlify.app, deploy previews), local servers and the prerender's
 * 127.0.0.1 are built from the same dist/ with the same measurement ID baked
 * in, and must count no visits.
 */
export const PRODUCTION_HOSTS = ["dutycleaners.ca", "www.dutycleaners.ca"] as const;

export function isProductionHost(hostname: string | null | undefined): boolean {
  const host = (hostname ?? "").toLowerCase().replace(/\.$/, "");
  return (PRODUCTION_HOSTS as readonly string[]).includes(host);
}

/**
 * The prerender (scripts/prerender.mjs) renders every page in headless Chrome
 * and saves the DOM. Loading the tag there would record 209 fake visits per
 * build and freeze a second gtag <script> into every snapshot. It serves from
 * 127.0.0.1, which the hostname check already refuses; this is the backstop.
 */
function isHeadless(): boolean {
  return typeof navigator !== "undefined" && /HeadlessChrome/i.test(navigator.userAgent ?? "");
}

/**
 * Query parameters a page address may keep when it is sent to Google
 * Analytics: the ad click ids and UTM tags it needs for attribution. Anything
 * else in the query string is dropped, so no URL the site ever carries (the
 * /book page's BookingKoala prefill, in embed mode, holds a name, email, phone
 * and postal code) can reach Google as a page_location.
 */
const PAGE_LOCATION_PARAMS: readonly string[] = TRACKED_PARAMS;

/**
 * The page address as Google Analytics may see it: origin and path, plus only
 * the allowlisted campaign parameters, and never a fragment. A value that looks
 * like an email or postal code is dropped even from those.
 */
export function safePageLocation(href: string): string {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return "";
  }
  const kept = new URLSearchParams();
  for (const key of PAGE_LOCATION_PARAMS) {
    const value = url.searchParams.get(key);
    if (!value) continue;
    if (EMAIL_VALUE.test(value) || POSTAL_VALUE.test(value)) continue;
    kept.set(key, value);
  }
  const query = kept.toString();
  return `${url.origin}${url.pathname}${query ? `?${query}` : ""}`;
}

/** A referrer reduced to its origin and path: another site's query is none of ours to send. */
function safeReferrer(referrer: string | null | undefined): string {
  if (!referrer) return "";
  try {
    const url = new URL(referrer);
    return `${url.origin}${url.pathname}`;
  } catch {
    return "";
  }
}

/** The last page_location sent, so a hash change or re-render never counts twice. */
let lastPageLocation: string | null = null;

/**
 * Sends one page_view for the current address, cleaned by safePageLocation().
 * gtag's own automatic page_view is switched off (send_page_view: false):
 * it reads the raw address bar, query string included.
 */
function sendPageView(): void {
  if (!window.__dcGa4 || typeof window.gtag !== "function") return;
  const location = safePageLocation(window.location?.href ?? "");
  if (!location || location === lastPageLocation) return;
  const referrer =
    lastPageLocation ?? safeReferrer(typeof document === "undefined" ? "" : document.referrer);
  lastPageLocation = location;
  // `set` makes every later hit (funnel events included) carry the cleaned
  // address instead of the browser's own.
  window.gtag("set", { page_location: location, page_referrer: referrer });
  window.gtag("event", "page_view", {
    page_location: location,
    page_referrer: referrer,
    page_title: typeof document === "undefined" ? undefined : document.title,
  });
}

/**
 * The site is a single-page app: moving between pages is a history.pushState,
 * not a page load. This reports each new address once, after the router has
 * rendered it (so document.title is the new page's).
 */
function watchRouteChanges(): void {
  const { history } = window;
  if (!history || typeof window.addEventListener !== "function") return;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const schedule = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(sendPageView, 300);
  };
  for (const method of ["pushState", "replaceState"] as const) {
    const original = history[method];
    if (typeof original !== "function") continue;
    history[method] = function (this: History, ...args: Parameters<History["pushState"]>) {
      const result = original.apply(this, args);
      schedule();
      return result;
    };
  }
  window.addEventListener("popstate", schedule);
}

/**
 * Loads gtag.js for the given GA4 measurement ID and configures it with
 * advertising features off. Returns true only when the tag was requested.
 *
 * With no ID (the default: VITE_GA4_MEASUREMENT_ID unset), a malformed ID, no
 * browser, any host but dutycleaners.ca / www.dutycleaners.ca, a headless
 * render, or a browser sending Global Privacy Control / Do Not Track, it adds
 * nothing to the page and returns false.
 *
 * Page views are sent by this module, not by gtag, so that no query string
 * but campaign tags ever reaches Google. Enhanced measurement has no switch
 * in gtag.js itself: its outbound-click, form-interaction and history-change
 * page views must be switched off in the GA4 data stream (see .env.example).
 */
export function initAnalytics(measurementId?: string | null): boolean {
  const id = (measurementId ?? "").trim();
  if (!GA4_ID.test(id)) return false;
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (!isProductionHost(window.location?.hostname)) return false;
  if (isHeadless()) return false;
  if (browserAsksNotToTrack()) return false;
  if (window.__dcGa4) return true;

  window.dataLayer = window.dataLayer ?? [];
  // gtag.js reads Arguments objects off the dataLayer, not arrays, so this has
  // to be a real function using `arguments`: the documented snippet, as a module.
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "granted",
  });
  window.gtag("js", new Date());
  window.gtag("config", id, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    send_page_view: false,
    page_location: safePageLocation(window.location?.href ?? ""),
  });
  window.__dcGa4 = id;
  lastPageLocation = null;
  sendPageView();
  watchRouteChanges();

  const script = document.createElement("script");
  script.async = true;
  script.src = `${GA4_SCRIPT_ORIGIN}/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
  return true;
}

/* ------------------------------------------------------------------ *
 * Phone and email clicks
 * ------------------------------------------------------------------ */

let contactListenerInstalled = false;

/**
 * One capture-phase listener for the whole document: a click on any tel: or
 * mailto: link records phone_click or email_click with the page's city. The
 * number or address in the link is never sent.
 */
export function initContactClickTracking(): void {
  if (typeof document === "undefined" || contactListenerInstalled) return;
  contactListenerInstalled = true;
  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.('a[href^="tel:"], a[href^="mailto:"]');
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      // The branch, so a call from the Red Deer page records "reddeer".
      const city = branchFromPath(window.location.pathname);
      track(href.startsWith("tel:") ? "phone_click" : "email_click", { city });
    },
    { capture: true, passive: true },
  );
}
