import { useEffect, useRef, useState } from "react";

/**
 * Fade-up on first scroll into view — one of the three sanctioned
 * micro-interactions. The CSS lives behind
 * `@media (prefers-reduced-motion: no-preference)`, so reduced-motion
 * visitors simply see the content with no transition.
 */
export default function useRevealOnScroll<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || visible) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, visible]);

  return { ref, visible, className: visible ? "is-visible" : "" };
}
