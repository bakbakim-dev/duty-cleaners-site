import { useEffect, useRef, useState } from "react";
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
 * It goes up instantly on click while final quote details receive a bounded,
 * durable save and encrypted handoff preparation. A failure offers retry,
 * back to answers, or an explicitly selected service-only fallback.
 */
export default function BookingHandoff({
  priceLabel,
  bookingUrl,
  hasAddOns = false,
  failed = false,
  onRetry,
  onBack,
}: {
  priceLabel: string | null;
  bookingUrl: string;
  /** Add-on chips picked on step 3 ride along in the URL — say so. */
  hasAddOns?: boolean;
  failed?: boolean;
  onRetry?: () => void;
  onBack?: () => void;
}) {
  const [stalled, setStalled] = useState(false);
  const headlineRef = useRef<HTMLParagraphElement>(null);
  const retryRef = useRef<HTMLButtonElement>(null);
  const reducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  // Each attempt gets its own 3-second clock: a retry after a failure must not
  // open on "taking longer than usual".
  useEffect(() => {
    if (failed) return;
    setStalled(false);
    const timer = window.setTimeout(() => setStalled(true), 3000);
    return () => window.clearTimeout(timer);
  }, [failed]);

  // A modal screen takes focus, or keyboard users stay on the covered form.
  useEffect(() => {
    (failed ? retryRef.current : headlineRef.current)?.focus({ preventScroll: true });
  }, [failed]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dc-handoff-title"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-brand-navy px-6 text-center"
    >
      <p className="text-2xl font-bold tracking-tight text-brand-navy-foreground">
        Duty <span className="text-brand-gold">Cleaners</span>
      </p>

      {failed ? null : reducedMotion ? (
        <span className="h-8 w-8 rounded-full border-2 border-brand-gold" aria-hidden="true" />
      ) : (
        <Loader2 className="h-8 w-8 animate-spin text-brand-gold" aria-hidden="true" />
      )}

      <div role={failed ? "alert" : "status"} aria-live={failed ? "assertive" : "polite"}>
        <p
          id="dc-handoff-title"
          ref={headlineRef}
          tabIndex={-1}
          className="text-lg font-semibold text-brand-navy-foreground focus:outline-none"
        >
          {failed ? "We couldn’t carry your answers over" : "Carrying your answers to the booking page…"}
        </p>
        <p className="mt-1 text-brand-navy-foreground/75">
          {failed ? "Your answers are still here. Try again, or continue and enter your personal details on the booking page." : hasAddOns
            ? `Your ${priceLabel ?? "quote"} and add-ons will carry over. Pick a live date and arrival time next.`
            : `Your ${priceLabel ?? "quote"} will carry over. Pick a live date and arrival time next.`}
        </p>
      </div>

      {/* The fallback URL contains service selections only. Personal answers
          are transferred only through the successfully sealed handoff. */}
      {stalled && !failed && <p className="text-brand-navy-foreground/75">This is taking longer than usual. Your answers are still safe on this page.</p>}
      {failed && (
        <div className="flex max-w-lg flex-col gap-3">
        <button ref={retryRef} type="button" onClick={onRetry} className="min-h-[56px] rounded-full bg-accent px-6 py-3 font-bold text-accent-foreground">Try again</button>
        <button type="button" onClick={onBack} className="min-h-[48px] px-6 py-3 text-brand-navy-foreground underline underline-offset-4">Back to my answers</button>
        <button
          type="button"
          onClick={() => window.location.assign(bookingUrl)}
          className="min-h-[48px] px-6 py-3 text-sm text-brand-navy-foreground/85 underline underline-offset-4"
        >
          Continue and re-enter my details on the booking page
        </button>
        </div>
      )}
    </div>
  );
}
