import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

import type { ServiceId } from "@/data/pricing";

export type QuoteIntent = "deep" | null;

type QuoteOverlayValue = {
  isOpen: boolean;
  /** True once the form has been mounted — it then stays mounted (hidden). */
  isMounted: boolean;
  /** Service the visitor already chose before opening the flow. */
  initialService: ServiceId;
  /** "deep" when the visitor arrived through a Deep Cleaning entry point. */
  initialIntent: QuoteIntent;
  /** True when the CTA itself already chose the service for the visitor. */
  servicePreset: boolean;
  openQuote: (service?: ServiceId, intent?: QuoteIntent) => void;
  closeQuote: () => void;
  /** Mount the form in the background on hover/touch intent. */
  prewarmQuote: () => void;
};

const QuoteOverlayContext = createContext<QuoteOverlayValue>({
  isOpen: false,
  isMounted: false,
  initialService: "standard",
  initialIntent: null,
  servicePreset: false,
  openQuote: () => {},
  closeQuote: () => {},
  prewarmQuote: () => {},
});

export const useQuoteOverlay = () => useContext(QuoteOverlayContext);

const HISTORY_FLAG = "quoteOverlay";

const isQuoteHref = (href: string) => /#quote(-form)?$/.test(href);

/**
 * Owns the full-screen booking form takeover.
 *
 * Every quote CTA on the site is an anchor pointing at `#quote` (kept that
 * way so the links stay crawlable and right-click / new-tab still work). A
 * single delegated click listener turns those left-clicks into an overlay
 * open, so no individual CTA has to be rewired — and any future `#quote`
 * link inherits the behavior automatically.
 *
 * Three things make it feel like a real screen rather than a popup:
 *
 * 1. Once opened, the overlay stays mounted (hidden) so re-opening is
 *    instant and the visitor's answers survive an accidental close.
 * 2. Hover/touch on any quote CTA prewarms the form in the background.
 * 3. Opening pushes a history entry, so the browser/Android Back button
 *    closes the form and returns to the page it opened from.
 */
export function QuoteOverlayProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [initialService, setInitialService] = useState<ServiceId>("standard");
  const [initialIntent, setInitialIntent] = useState<QuoteIntent>(null);
  // Whether the CTA carried a service, so step 1 can collapse that question
  // instead of asking it again.
  const [servicePreset, setServicePreset] = useState(false);
  const { pathname, hash, search } = useLocation();
  // Set while we ourselves are unwinding the history entry, so the popstate
  // handler doesn't try to unwind it a second time.
  const closingViaHistoryRef = useRef(false);

  const prewarmQuote = useCallback(() => setIsMounted(true), []);

  const openQuote = useCallback((service?: ServiceId, intent?: QuoteIntent) => {
    if (service) setInitialService(service);
    setServicePreset(Boolean(service));
    if (intent !== undefined) setInitialIntent(intent);
    setIsMounted(true);
    setIsOpen((wasOpen) => {
      if (!wasOpen && !window.history.state?.[HISTORY_FLAG]) {
        // Same URL, extra entry: Back becomes "close the form".
        window.history.pushState(
          { ...window.history.state, [HISTORY_FLAG]: true },
          "",
          window.location.href
        );
      }
      return true;
    });
  }, []);

  const closeQuote = useCallback(() => {
    setIsOpen(false);
    if (window.history.state?.[HISTORY_FLAG] && !closingViaHistoryRef.current) {
      closingViaHistoryRef.current = true;
      window.history.back();
    }
  }, []);

  // Back button closes the takeover instead of leaving the page.
  useEffect(() => {
    const onPopState = () => {
      closingViaHistoryRef.current = true;
      setIsOpen(false);
      window.setTimeout(() => {
        closingViaHistoryRef.current = false;
      }, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // Delegated interception of every quote CTA on the page.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      // Leave modified clicks (new tab / new window) alone.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (!isQuoteHref(anchor.getAttribute("href") ?? "")) return;

      event.preventDefault();
      const service = anchor.dataset.quoteService as ServiceId | undefined;
      // CTAs can't carry a query string (they're #quote anchors), so the deep
      // intent travels on a data attribute instead.
      const intent: QuoteIntent = anchor.dataset.quoteIntent === "deep" ? "deep" : null;
      openQuote(service, intent);
    };

    // Intent prewarm: by the time the click lands, the form is already there.
    const onIntent = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      if (isQuoteHref(anchor.getAttribute("href") ?? "")) prewarmQuote();
    };

    document.addEventListener("click", onClick);
    document.addEventListener("pointerover", onIntent, { passive: true });
    document.addEventListener("touchstart", onIntent, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
      document.removeEventListener("pointerover", onIntent);
      document.removeEventListener("touchstart", onIntent);
    };
  }, [openQuote, prewarmQuote]);

  // Deep links (ads, cross-page CTAs) land with #quote — open the takeover
  // instead of scrolling to a section. Any other navigation closes it.
  useEffect(() => {
    if (hash === "#quote" || hash === "#quote-form") {
      // Deep links from ads / other pages: ?intent=deep in the URL.
      const params = new URLSearchParams(search);
      openQuote(undefined, params.get("intent") === "deep" ? "deep" : null);
    } else {
      setIsOpen(false);
    }
  }, [pathname, hash, search, openQuote]);

  const value = useMemo(
    () => ({
      isOpen,
      isMounted,
      initialService,
      initialIntent,
      servicePreset,
      openQuote,
      closeQuote,
      prewarmQuote,
    }),
    [
      isOpen,
      isMounted,
      initialService,
      initialIntent,
      servicePreset,
      openQuote,
      closeQuote,
      prewarmQuote,
    ]
  );

  return (
    <QuoteOverlayContext.Provider value={value}>{children}</QuoteOverlayContext.Provider>
  );
}
