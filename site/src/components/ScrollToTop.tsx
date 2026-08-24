import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Ensures every route navigation lands at the top of the page.
 * Uses useLayoutEffect so the scroll reset happens before the
 * browser paints the new route — preventing a visible "double load"
 * flash where the page paints at the old scroll position first.
 *
 * Honors in-page hash anchors (e.g. /page#section). Images and embeds
 * above the anchor can finish loading after the initial jump and push the
 * target down, so the anchor scroll is re-applied on delayed retries and
 * whenever the page height shifts, for a short window after navigation.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    // Quote deep links open the full-screen booking takeover instead of
    // scrolling to a section (see QuoteOverlayProvider) — nothing to do here.
    if (hash === "#quote" || hash === "#quote-form") return;

    const id = hash.replace("#", "");
    const startedAt = Date.now();
    // The quote embed loads and settles its fit-to-viewport zoom over several
    // seconds, shifting the card height each time — keep the correction
    // window open long enough to land precisely after the final fit.
    const MAX_CORRECTION_MS = 12000;
    const timers: number[] = [];

    const scrollToAnchor = () => {
      const anchorEl = document.getElementById(id);
      if (!anchorEl) return;
      // Quote CTAs should land the visitor directly on the form card — with
      // the whole form filling the viewport — not on the section heading
      // above it. When the anchor section contains a form card, target it.
      const formCard = anchorEl.querySelector<HTMLElement>("#quote-form");
      (formCard ?? anchorEl).scrollIntoView({ behavior: "auto", block: "start" });
    };

    // Initial jump plus delayed retries for late-rendering content.
    scrollToAnchor();
    [250, 750, 1500, 3000, 5000, 7000, 9000, 11000].forEach((ms) => {
      timers.push(window.setTimeout(scrollToAnchor, ms));
    });

    // Re-apply whenever the page height shifts (images, iframes loading) or
    // the quote embed settles a new fit-to-viewport zoom.
    const withinWindow = () => Date.now() - startedAt < MAX_CORRECTION_MS;
    const observer = new ResizeObserver(() => {
      if (withinWindow()) scrollToAnchor();
    });
    observer.observe(document.body);
    const onQuoteFit = () => {
      if (withinWindow()) scrollToAnchor();
    };
    window.addEventListener("quoteform:fit", onQuoteFit);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      observer.disconnect();
      window.removeEventListener("quoteform:fit", onQuoteFit);
    };
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
