/**
 * Leave detection for the quote funnel (owner, 2026-09-23).
 *
 * After the visitor has seen a price, the funnel tells the relay "still here"
 * about once a minute, but only while the page is on screen and the visitor
 * has touched it in the last ten minutes. The relay marks the visit as left
 * when those reports stop for five minutes (ghl-quote.php,
 * DC_GHL_QUIET_SECONDS); GoHighLevel then alerts the office and sends the
 * first text. Reading a text for a minute is not leaving; closing the tab,
 * locking the phone for good or walking away from an open tab is.
 *
 * The reports carry the random visit id, the step and (owner, 2026-09-24) the
 * quote on screen: prices, service, home size, plan and extras, so the
 * office's "left without booking" email and the GoHighLevel contact say what
 * the visitor saw. No name, no contact details, no notes, no entry details.
 * The quote rides nested under `shown`, never as a top-level price: a price
 * check stays a lead until the visitor confirms (quote-submit.ts stageFor).
 * Stopping (booking page, call-back, closing the quote) simply ends the
 * reports; the relay already knows a confirmed visit is done.
 */

const RELAY_URL = "/api/ghl-quote.php";
export const PRESENCE_INTERVAL_MS = 60_000;
export const PRESENCE_IDLE_MS = 10 * 60_000;
/**
 * A changed quote is reported this long after the last change, and never
 * sooner than PRESENCE_MIN_GAP_MS after the previous report: the relay allows
 * eight requests a minute per visitor, and the confirmation must never be the
 * one refused. Hiding or closing the page reports a pending change at once.
 */
export const SHOWN_SETTLE_MS = 4_000;
export const PRESENCE_MIN_GAP_MS = 30_000;

export type PresenceStep = "price" | "details";

/** The quote on the visitor's screen, in GoHighLevel's own option wording. */
export interface ShownQuote {
  /** The branch key ("edmonton", "calgary", "reddeer"); empty on a general page. */
  city: string;
  service: string;
  home_type: string;
  bedrooms: string;
  full_bathrooms: string;
  half_baths: string;
  /** Empty until a plan is chosen. */
  frequency: string;
  /** True when the service has no online price (custom quote). */
  quote_only: boolean;
  /** First clean before GST; null when quote_only. The low end of a range. */
  first_clean_price: number | null;
  /** The top of the range when the screen shows an estimate; otherwise null. */
  first_clean_price_high: number | null;
  /** Every visit after the first, when a plan is chosen; otherwise null. */
  recurring_price: number | null;
  /** Extras in the price (deep package, add-ons, travel fee) and the area answer. */
  addons: string[];
  /** The booking page's public selections (splitBookingQuery), for the visitor's own booking link. */
  booking_query?: string;
}

export function createPresenceSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function report(sessionId: string, step: PresenceStep, shown: ShownQuote | null): void {
  try {
    void fetch(RELAY_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation: "ping", session_id: sessionId, step, ...(shown ? { shown } : {}) }),
    }).catch(() => undefined);
  } catch {
    // A missed report only brings the "left" moment forward; never an error.
  }
}

/**
 * Start reporting. Returns a controller: `step()` reports a move to a new
 * step at once, `shown()` updates the quote on screen, `stop()` ends every
 * report and listener.
 */
export function startPresence(sessionId: string, initialStep: PresenceStep, initialShown: ShownQuote | null = null) {
  let step = initialStep;
  let shown = initialShown;
  let shownKey = JSON.stringify(shown);
  let sentShownKey = shownKey;
  let lastReportAt = 0;
  let settleTimer: number | undefined;
  let lastInteraction = Date.now();
  let stopped = false;
  const active = () =>
    !stopped && document.visibilityState === "visible" && Date.now() - lastInteraction < PRESENCE_IDLE_MS;
  const touch = () => {
    lastInteraction = Date.now();
  };
  const send = () => {
    window.clearTimeout(settleTimer);
    settleTimer = undefined;
    lastReportAt = Date.now();
    sentShownKey = shownKey;
    report(sessionId, step, shown);
  };
  /** Report a changed quote once it settles, within the request budget. */
  const scheduleShown = () => {
    window.clearTimeout(settleTimer);
    const wait = Math.max(SHOWN_SETTLE_MS, lastReportAt + PRESENCE_MIN_GAP_MS - Date.now());
    settleTimer = window.setTimeout(() => {
      settleTimer = undefined;
      if (!stopped && shownKey !== sentShownKey && active()) send();
    }, wait);
  };
  const onVisibility = () => {
    // Coming back counts as activity: report straight away so a short trip to
    // another app never reads as leaving.
    if (document.visibilityState === "visible") {
      touch();
      if (active()) send();
    } else if (!stopped && shownKey !== sentShownKey) {
      // Leaving (tab hidden or closed) with a changed quote not yet reported:
      // report it now, so the office hears the price the visitor last saw.
      send();
    }
  };
  const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
  events.forEach((name) => window.addEventListener(name, touch, { passive: true, capture: true }));
  document.addEventListener("visibilitychange", onVisibility);
  const timer = window.setInterval(() => {
    if (active()) send();
  }, PRESENCE_INTERVAL_MS);
  send();

  return {
    step(next: PresenceStep) {
      if (stopped || next === step) return;
      step = next;
      touch();
      send();
    },
    shown(next: ShownQuote | null) {
      const key = JSON.stringify(next);
      if (stopped || key === shownKey) return;
      shown = next;
      shownKey = key;
      scheduleShown();
    },
    stop() {
      if (stopped) return;
      stopped = true;
      window.clearInterval(timer);
      window.clearTimeout(settleTimer);
      events.forEach((name) => window.removeEventListener(name, touch, { capture: true }));
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
