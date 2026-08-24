import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * sessionStorage flag written the moment the funnel hands off to BookingKoala.
 * Browser Back from the booking page would otherwise land on this interstitial
 * and bounce the visitor straight out again — a trap. Step 3 reads the flag on
 * mount and renders the quote instead of the splash.
 */
const HANDOFF_FLAG = "handoffFired";

export function markHandoffFired() {
  try {
    window.sessionStorage.setItem(HANDOFF_FLAG, "1");
  } catch {
    /* private mode — the back/forward check below still guards */
  }
}

export function clearHandoffFlag() {
  try {
    window.sessionStorage.removeItem(HANDOFF_FLAG);
  } catch {
    /* nothing to clear */
  }
}

/** True when we already sent this visitor out, or they arrived via back/forward. */
export function handoffAlreadyFired(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.sessionStorage.getItem(HANDOFF_FLAG) === "1") return true;
  } catch {
    /* ignore */
  }
  const entry = window.performance?.getEntriesByType?.("navigation")?.[0] as
    | PerformanceNavigationTiming
    | undefined;
  return entry?.type === "back_forward";
}

/**
 * Branded transition between our funnel and the BookingKoala booking page.
 *
 * It goes up instantly on click — before any network call — so the hop feels
 * like one continuous funnel. If navigation hasn't happened after 3 seconds
 * (blocked script, dead network) a plain link to the exact same URL appears,
 * so a visitor can never be stranded here.
 */
export default function BookingHandoff({
  priceLabel,
  bookingUrl,
  hasAddOns = false,
}: {
  priceLabel: string | null;
  bookingUrl: string;
  /** Add-on chips picked on step 3 ride along in the URL — say so. */
  hasAddOns?: boolean;
}) {
  const [stalled, setStalled] = useState(false);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const timer = window.setTimeout(() => setStalled(true), 3000);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-brand-navy px-6 text-center"
    >
      <p className="text-2xl font-bold tracking-tight text-brand-navy-foreground">
        Duty <span className="text-brand-gold">Cleaners</span>
      </p>

      {reducedMotion ? (
        <span className="h-8 w-8 rounded-full border-2 border-brand-gold" aria-hidden="true" />
      ) : (
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" aria-hidden="true" />
      )}

      <div>
        <p className="text-lg font-semibold text-brand-navy-foreground">
          Locking in your {priceLabel ?? "quote"}
          {priceLabel ? " quote" : ""}&hellip;
        </p>
        <p className="mt-1 text-brand-navy-foreground/75">
          {hasAddOns
            ? "Your add-ons are already added — just pick your time."
            : "Taking you to secure booking"}
        </p>
      </div>

      {stalled && (
        <a
          href={bookingUrl}
          className="mt-2 min-h-[48px] bg-brand-gold px-6 py-3 font-bold text-brand-gold-foreground underline-offset-4 hover:underline"
        >
          Taking longer than expected — continue to booking
        </a>
      )}
    </div>
  );
}
