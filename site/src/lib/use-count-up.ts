import { useEffect, useRef, useState } from "react";

/**
 * A displayed number that rolls from its old value to its new one, so every
 * answer on the price step visibly moves the total (owner, 2026-09-22: make
 * choosing feel rewarding). Research basis: immediate, visible feedback on
 * each action (NN/g, visibility of system status). It only ever shows the
 * real figure it is rolling towards: nothing random, nothing withheld.
 *
 * Visual only. Screen readers get the final figure from the funnel's polite
 * live regions, never the in-between values. With reduced motion requested
 * (WCAG 2.3.3) the number simply changes.
 */
export function useCountUp(target: number, durationMs = 450): number {
  const [shown, setShown] = useState(target);
  const shownRef = useRef(target);

  useEffect(() => {
    const from = shownRef.current;
    if (from === target) return;
    const reduced =
      typeof window === "undefined" ||
      typeof window.requestAnimationFrame !== "function" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      shownRef.current = target;
      setShown(target);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      // Ease out: fast at first, settling on the real figure.
      const eased = 1 - Math.pow(1 - t, 3);
      const next = t === 1 ? target : from + (target - from) * eased;
      shownRef.current = next;
      setShown(next);
      if (t < 1) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return shown;
}
