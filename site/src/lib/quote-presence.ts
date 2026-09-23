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
 * The reports carry the random visit id and the step only: no name, no
 * contact details. Stopping (booking page, call-back, closing the quote)
 * simply ends the reports; the relay already knows a confirmed visit is done.
 */

const RELAY_URL = "/api/ghl-quote.php";
export const PRESENCE_INTERVAL_MS = 60_000;
export const PRESENCE_IDLE_MS = 10 * 60_000;

export type PresenceStep = "price" | "details";

export function createPresenceSessionId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `dc-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;
}

function report(sessionId: string, step: PresenceStep): void {
  try {
    void fetch(RELAY_URL, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operation: "ping", session_id: sessionId, step }),
    }).catch(() => undefined);
  } catch {
    // A missed report only brings the "left" moment forward; never an error.
  }
}

/**
 * Start reporting. Returns a controller: `step()` reports a move to a new
 * step at once, `stop()` ends every report and listener.
 */
export function startPresence(sessionId: string, initialStep: PresenceStep) {
  let step = initialStep;
  let lastInteraction = Date.now();
  let stopped = false;
  const active = () =>
    !stopped && document.visibilityState === "visible" && Date.now() - lastInteraction < PRESENCE_IDLE_MS;
  const touch = () => {
    lastInteraction = Date.now();
  };
  const onVisibility = () => {
    // Coming back counts as activity: report straight away so a short trip to
    // another app never reads as leaving.
    if (document.visibilityState === "visible") {
      touch();
      if (active()) report(sessionId, step);
    }
  };
  const events = ["pointerdown", "keydown", "scroll", "touchstart"] as const;
  events.forEach((name) => window.addEventListener(name, touch, { passive: true, capture: true }));
  document.addEventListener("visibilitychange", onVisibility);
  const timer = window.setInterval(() => {
    if (active()) report(sessionId, step);
  }, PRESENCE_INTERVAL_MS);
  report(sessionId, step);

  return {
    step(next: PresenceStep) {
      if (stopped || next === step) return;
      step = next;
      touch();
      report(sessionId, step);
    },
    stop() {
      if (stopped) return;
      stopped = true;
      window.clearInterval(timer);
      events.forEach((name) => window.removeEventListener(name, touch, { capture: true }));
      document.removeEventListener("visibilitychange", onVisibility);
    },
  };
}
