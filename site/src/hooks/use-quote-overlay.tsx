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
import { hashAnchor, intentParams } from "@/lib/url-intent";

import type { ServiceId } from "@/data/pricing";
import { readQuoteReturn } from "@/lib/quote-return";

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

export const HISTORY_FLAG = "quoteOverlay";
/**
 * Every history entry the funnel owns carries `quoteStack`: the funnel steps
 * from the opening entry to this one ("0", "1", "2:price", "2:details"). Back
 * steps through them, and closing the funnel unwinds all of them at once.
 */
export const HISTORY_STACK = "quoteStack";
export const funnelStackOf = (state: unknown): string[] => {
  const stack = (state as Record<string, unknown> | null)?.[HISTORY_STACK];
  return Array.isArray(stack) && stack.length > 0 ? (stack as string[]) : ["0"];
};

// `#quote`, `#quote-form`, or either followed by intent pairs (`#quote&intent=deep`).
const isQuoteHref = (href: string) => /#quote(-form)?(?:&[^#]*)?$/.test(href);

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
  /**
   * Back from BookingKoala onto a reloaded page: reopen the funnel, which
   * restores the saved answers itself (lib/quote-return.ts). Decided once per
   * page load; an ordinary load discards any stale snapshot.
   */
  const restoreOnLoadRef = useRef<boolean | null>(null);
  if (restoreOnLoadRef.current === null) {
    restoreOnLoadRef.current = typeof window !== "undefined" && readQuoteReturn(pathname) !== null;
  }

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
          { ...window.history.state, [HISTORY_FLAG]: true, [HISTORY_STACK]: ["0"] },
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
      // Unwind every funnel step at once, back to the page the form opened on.
      window.history.go(-funnelStackOf(window.history.state).length);
    }
  }, []);

  // Back steps through the funnel (QuoteFlow listens for that); leaving the
  // funnel's first entry closes the takeover instead of leaving the page.
  useEffect(() => {
    const onPopState = (event: PopStateEvent) => {
      if (event.state?.[HISTORY_FLAG] && !closingViaHistoryRef.current) {
        // A funnel entry: Back between steps, or Forward back into the form.
        setIsOpen(true);
        return;
      }
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
      /*
        Read the intent from BOTH channels.

        This used to read only the data attribute, on the stated grounds that
        "CTAs can't carry a query string (they're #quote anchors)". Ten of them
        do: the five Deep Cleaning tier cards on /pricing/ and the five on
        /calgary/pricing/ ship href="/#quote&intent=deep". No page anywhere in
        the build carries data-quote-intent, so every one of those clicks was
        preventDefaulted — which also stops the URL changing, so QuoteFlow's own
        URLSearchParams read never saw it either — and the visitor who clicked a
        $255 deep-clean card was quoted the $155 standard tier, with the Deep
        Cleaning package demoted to an optional add-on they had to find again
        and the CRM lead written as intent: null.
      */
      const rawHref = anchor.getAttribute("href") ?? "";
      const intentInHref = /[?&]intent=deep(?:[&#]|$)/.test(rawHref);
      const intent: QuoteIntent =
        anchor.dataset.quoteIntent === "deep" || intentInHref ? "deep" : null;
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
    const anchor = hashAnchor(hash);
    if (anchor === "quote" || anchor === "quote-form") {
      // Deep links from ads / other pages: intent=deep in the fragment (or, for
      // links the site does not control, the query string).
      const params = intentParams(search, hash);
      openQuote(undefined, params.get("intent") === "deep" ? "deep" : null);
    } else if (restoreOnLoadRef.current) {
      restoreOnLoadRef.current = false;
      openQuote();
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
