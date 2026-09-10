import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Synchronously reveal anything that has already reached the viewport when
  // this mounts. useLayoutEffect, not useEffect, so the state change lands in
  // the same commit as the first render and the browser never paints the
  // hidden state.
  //
  // This matters twice over. It stops the above-the-fold flicker where content
  // renders at opacity-0 for a frame before the async IntersectionObserver
  // callback fires. And it is what makes scripts/prerender.mjs safe to ship
  // these wrappers revealed: main.tsx mounts with createRoot, which throws the
  // prerendered markup away and renders the page again from scratch, so
  // without this check every section the reader could already see would fade
  // back out the moment the bundle booted.
  //
  // "Reached the viewport" is `rect.top < vh`, not an overlap test: an element
  // the reader has already scrolled past was visible a moment ago and must not
  // come back hidden either.
  useLayoutEffect(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const reached = rect.top < vh && rect.left < vw && rect.right > 0;
    if (reached) setIsVisible(true);
  }, []);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};
