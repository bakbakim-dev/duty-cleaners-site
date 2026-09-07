import { useEffect, useRef, useState, type ReactNode } from "react";

interface DeferUntilVisibleProps {
  /** Rendered once the placeholder is within `marginPx` of the viewport. */
  children: ReactNode;
  /** Shown until then. Must reserve the final height, or the page shifts. */
  placeholder: ReactNode;
  /** How early to start, so loading finishes before the reader arrives. */
  marginPx?: number;
}

/**
 * Render children only once they are near the viewport.
 *
 * React.lazy + Suspense defers RENDERING, not LOADING: a lazy component sitting
 * unconditionally in the tree has its dynamic import resolved at hydration. The
 * two city hubs did exactly that with their Leaflet coverage map, so every
 * visitor to the pages carrying 63.9% of site value downloaded 149 KB of
 * Leaflet plus a 15 KB render-blocking stylesheet, and hit three
 * openstreetmap.org origins, on page load — for a map about 20,000 px down a
 * 25,000 px document that most sessions never reach.
 *
 * TWO INDEPENDENT TRIGGERS, deliberately. IntersectionObserver is the efficient
 * one, but it only fires while the document is actually being rendered — in a
 * hidden or background tab it stays silent, and a reader who restores that tab
 * scrolled to the map would find a placeholder that never resolves. So a cheap
 * geometry check runs alongside it on scroll, resize and visibilitychange.
 * Either one is enough, and both are cleaned up as soon as one wins.
 *
 * Where IntersectionObserver does not exist at all, children render straight
 * away: the degraded state is the old always-load behaviour, never a map that
 * refuses to appear.
 */
export default function DeferUntilVisible({
  children,
  placeholder,
  marginPx = 300,
}: DeferUntilVisibleProps) {
  const anchorRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const node = anchorRef.current;
    if (!node) return;

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setVisible(true);
    };

    /** True once the element's box reaches within marginPx of the viewport. */
    const near = () => {
      const rect = node.getBoundingClientRect();
      const height = window.innerHeight || document.documentElement.clientHeight;
      return rect.top < height + marginPx && rect.bottom > -marginPx;
    };

    if (near()) {
      reveal();
      return;
    }

    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) reveal();
        },
        { rootMargin: `${marginPx}px` },
      );
      observer.observe(node);
    }

    const onMaybe = () => {
      if (near()) reveal();
    };
    window.addEventListener("scroll", onMaybe, { passive: true });
    window.addEventListener("resize", onMaybe, { passive: true });
    document.addEventListener("visibilitychange", onMaybe);

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onMaybe);
      window.removeEventListener("resize", onMaybe);
      document.removeEventListener("visibilitychange", onMaybe);
    };
  }, [marginPx, visible]);

  return <div ref={anchorRef}>{visible ? children : placeholder}</div>;
}
