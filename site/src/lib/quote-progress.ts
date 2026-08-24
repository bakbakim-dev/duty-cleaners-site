import { useSyncExternalStore } from "react";

/**
 * Tiny shared store for "how far did the visitor get in the quote funnel".
 *
 * The floating CTA lives outside the funnel's React tree (page level, and the
 * funnel itself renders inside an overlay), so a module-level store is the
 * lightest way to let the CTA show an abandoned-progress cue instead of a
 * generic repeat CTA.
 */
export type QuoteProgress = {
  /** 0-based step index the visitor last reached. */
  step: number;
  /** True once the visitor has interacted with the funnel at all. */
  started: boolean;
};

const TOTAL_STEPS = 4;

let progress: QuoteProgress = { step: 0, started: false };
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

export function setQuoteStep(step: number) {
  if (progress.step === step && (progress.started || step === 0)) return;
  progress = { step, started: progress.started || step > 0 };
  emit();
}

export function markQuoteStarted() {
  if (progress.started) return;
  progress = { ...progress, started: true };
  emit();
}

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => progress;

export function useQuoteProgress() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

/** CTA label that reflects unfinished progress (Zeigarnik cue). */
export function quoteCtaLabel(progressState: QuoteProgress) {
  if (!progressState.started) return "See My Instant Price";
  return `Finish your price — Step ${Math.min(progressState.step + 1, TOTAL_STEPS)} of ${TOTAL_STEPS}`;
}
