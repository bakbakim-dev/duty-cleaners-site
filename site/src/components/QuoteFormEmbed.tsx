import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { isCalgaryPath } from "@/lib/city-from-path";
import { Loader2, Phone, RefreshCw } from "lucide-react";


const EMBED_SCRIPT_SRC = "https://api.bookin60.com/js/form_embed.js";
const IFRAME_ID = "inline-AwJDnvuYtkojIN3aOysC";

/** The vendor's initial full-form height before its resizer reports a value. */
const BASE_FORM_HEIGHT = 1180;
/**
 * Desktop zoom range — the form is scaled so the whole widget (from the first
 * question down to the submit button) fits in the visitor's viewport when
 * they land on it: no scrolling up or down while filling it out. Tall screens
 * zoom up to MAX_DESKTOP_ZOOM (senior-friendly enlargement); shorter screens
 * scale down, but never below MIN_DESKTOP_ZOOM so text stays readable (only a
 * minimal scroll remains on very short screens). The iframe layout width is
 * compensated (100 / zoom %), so the widget reflows naturally at a
 * narrower/wider layout width and is then scaled to exactly fill the card:
 * no clipping, no gutters. Mobile stays at natural size — the widget's mobile
 * layout is already well proportioned.
 */
const MIN_DESKTOP_ZOOM = 0.5;
const MAX_DESKTOP_ZOOM = 1.2;
/**
 * Vertical space the form shares the viewport with when the visitor lands on
 * the form card: sticky nav + card header (rating line, micro-badges) +
 * breathing room. Subtracted from the viewport height to get the height the
 * form must fit into. On short desktop screens (< 1000px tall) the card
 * header drops its badge row (see QuoteFormIntro), so less chrome is
 * reserved — matching SHORT_VIEWPORT_CHROME keeps the fit calculation in
 * sync with what is actually on screen.
 */
const VIEWPORT_CHROME = 260;
const SHORT_VIEWPORT_CHROME = 235;
/**
 * Full-screen overlay mode: the form owns the whole viewport apart from the
 * slim takeover header, so it can be scaled far larger than it ever could
 * inside a page section.
 */
const OVERLAY_CHROME = 84;
const OVERLAY_MIN_ZOOM = 0.7;
const OVERLAY_MAX_ZOOM = 1.6;

declare global {
  interface Window {
    iFrameResize?: (options: Record<string, unknown>, target: string) => void;
  }
}

/**
 * Shared "See My Instant Price" form (Bookin60 embed).
 * Used on get-a-price sections only (Edmonton2, Calgary2, Post-Construction pages).
 *
 * Two things make the embed feel native here:
 *
 * 1. No scroll handle: the vendor script only auto-initializes iframes present
 *    at script load and enables iframe scrolling — which strands SPA-mounted
 *    iframes at a fixed height with a scrollbar. This component initializes
 *    the resizer itself on every mount (scrolling disabled) and locks
 *    scrollbars off once the resizer owns the iframe height.
 *
 * 2. Fit-to-viewport on desktop: the vendor widget is cross-origin, so its
 *    fonts can't be restyled directly. Instead the iframe is rendered at a
 *    compensated width and uniformly scaled about its top-left corner, with
 *    the zoom chosen so the whole form (first question → submit button) fits
 *    in the visitor's viewport — no scrolling while filling it out. The
 *    wrapper reserves exactly formHeight × zoom of vertical space.
 */
export default function QuoteFormEmbed({
  variant = "inline",
}: {
  variant?: "inline" | "overlay";
}) {
  const isOverlay = variant === "overlay";
  const iframeRef = useRef<HTMLIFrameElement>(null);
  // Validation submissions can make the vendor resizer briefly report a
  // transient height. Treating that value as the new natural height creates
  // a feedback loop that clips the form after every click. Keep the largest
  // natural height observed for the current zoom mode.
  const naturalHeightRef = useRef(BASE_FORM_HEIGHT);
  // Zoom mode changes (desktop <-> mobile) change the widget's layout width,
  // so the tracked natural height is reset when the mode flips.
  const zoomModeRef = useRef<boolean | null>(null);
  // "loading" until the vendor's resizer reports a real content height —
  // the iframe `load` event fires well before the widget paints, and hiding
  // the skeleton then is what left visitors staring at a blank white panel.
  const [status, setStatus] = useState<"loading" | "ready" | "stalled">(
    "loading"
  );
  // Bumping this remounts the iframe: used by the auto-retry and the manual
  // "Reload form" button in the recovery card.
  const [reloadKey, setReloadKey] = useState(0);
  const retriedRef = useRef(false);
  const [fit, setFit] = useState<{ zoom: number; formHeight: number }>({
    zoom: 1,
    formHeight: 0,
  });
  const { pathname } = useLocation();
  const isCalgary = isCalgaryPath(pathname);
  const phone = isCalgary ? "(403) 768-1341" : "(780) 913-6565";
  const phoneLink = isCalgary ? "tel:4037681341" : "tel:7809136565";


  /**
   * Measure the form and apply the desktop zoom. CSS transforms do not affect
   * offsetHeight, so the reported height is always the widget's layout
   * height, independent of the visual scale.
   */
  const applyFit = useCallback(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const reportedHeight =
      iframe.offsetHeight || parseFloat(iframe.style.height) || 0;
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

    if (zoomModeRef.current !== isDesktop) {
      zoomModeRef.current = isDesktop;
      naturalHeightRef.current = Math.max(reportedHeight, BASE_FORM_HEIGHT);
    } else if (reportedHeight > naturalHeightRef.current) {
      naturalHeightRef.current = reportedHeight;
    }

    const formHeight = naturalHeightRef.current;
    const minimumHeight = `${formHeight}px`;
    if (iframe.style.minHeight !== minimumHeight) {
      iframe.style.minHeight = minimumHeight;
    }

    // Desktop: pick the zoom that fits the whole form (first question through
    // the submit button) into the viewport, clamped to the readable range.
    // Rounded to 0.05 steps so small reflows don't re-trigger the resizer in
    // a feedback loop.
    let zoom = 1;
    if (isDesktop) {
      const chrome = isOverlay
        ? OVERLAY_CHROME
        : window.matchMedia("(min-height: 1000px)").matches
          ? VIEWPORT_CHROME
          : SHORT_VIEWPORT_CHROME;
      const fitZoom = (window.innerHeight - chrome) / formHeight;
      zoom = isOverlay
        ? Math.min(
            OVERLAY_MAX_ZOOM,
            // Round down in overlay mode so the last field and the submit
            // button are never pushed a few pixels past the fold.
            Math.max(OVERLAY_MIN_ZOOM, Math.floor(fitZoom * 20) / 20)
          )
        : Math.min(
            MAX_DESKTOP_ZOOM,
            Math.max(MIN_DESKTOP_ZOOM, Math.round(fitZoom * 20) / 20)
          );
    }
    // Readiness is proven by a postMessage from inside the widget (see the
    // message listener below), not by anything measurable out here: a failed
    // cross-origin load still leaves a resizer-initialized iframe with an
    // inline height, which is exactly how visitors ended up on a blank
    // white panel.

    setFit((prev) =>
      prev.zoom === zoom && prev.formHeight === formHeight
        ? prev
        : { zoom, formHeight }
    );
  }, [isOverlay]);

  // The only trustworthy "the widget is alive" signal: a postMessage sent by
  // the vendor's script running inside the iframe.
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (typeof event.origin === "string" && event.origin.includes("bookin60.com")) {
        setStatus("ready");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);


  // Stall watchdog: retry once silently, then hand the visitor a way out
  // instead of leaving them on a blank white panel.
  useEffect(() => {
    if (status === "ready") return;
    const timer = window.setTimeout(() => {
      if (!retriedRef.current) {
        retriedRef.current = true;
        setStatus("loading");
        setReloadKey((key) => key + 1);
      } else {
        setStatus("stalled");
      }
    }, 8000);
    return () => window.clearTimeout(timer);
  }, [status, reloadKey]);


  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const isInitialized = () =>
      iframe.getAttribute("data-iframe-resizer-initialized") === "true";

    // Once the resizer owns the height, hide the scroll handle entirely.
    // Safe: autoResize keeps the iframe exactly as tall as its content.
    const lockNoScroll = () => {
      iframe.setAttribute("scrolling", "no");
      iframe.style.overflow = "hidden";
    };

    const initResizer = () => {
      if (isInitialized()) {
        lockNoScroll();
        applyFit();
        return;
      }
      if (!window.iFrameResize) return;
      window.iFrameResize(
        {
          log: false,
          checkOrigin: false,
          enablePublicMethods: true,
          scrolling: false,
          autoResize: true,
          sizeWidth: false,
          sizeHeight: true,
          heightCalculationMethod: "offset",
        },
        `#${IFRAME_ID}`
      );
      lockNoScroll();
      applyFit();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${EMBED_SCRIPT_SRC}"]`
    );

    if (window.iFrameResize) {
      initResizer();
    } else if (existingScript) {
      existingScript.addEventListener("load", initResizer);
    } else {
      const script = document.createElement("script");
      script.src = EMBED_SCRIPT_SRC;
      script.async = true;
      script.addEventListener("load", initResizer);
      document.body.appendChild(script);
    }

    // On first page load the vendor script's own auto-init can win the race
    // and turn scrolling on — keep enforcing the no-scroll lock until the
    // resizer has taken over sizing.
    const poll = window.setInterval(() => {
      if (isInitialized()) {
        lockNoScroll();
        applyFit();
      }
    }, 500);
    const stopPoll = window.setTimeout(() => window.clearInterval(poll), 10000);

    // Validation can produce a burst of height mutations. Refitting on every
    // intermediate frame makes the cross-origin widget visibly flicker, so
    // wait until its layout has settled and refit once.
    let mutationTimer: number | undefined;
    const observer = new MutationObserver(() => {
      window.clearTimeout(mutationTimer);
      mutationTimer = window.setTimeout(applyFit, 300);
    });
    observer.observe(iframe, {
      attributes: true,
      attributeFilter: ["style"],
    });

    let resizeTimer: number | undefined;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(applyFit, 150);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.clearInterval(poll);
      window.clearTimeout(stopPoll);
      window.clearTimeout(resizeTimer);
      window.clearTimeout(mutationTimer);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      existingScript?.removeEventListener("load", initResizer);
    };
    // reloadKey remounts the iframe element, so the resizer must be
    // initialized again against the fresh node.
  }, [applyFit, reloadKey]);

  const zoomed = fit.zoom !== 1 && fit.formHeight > 0;

  /**
   * Announce every settled fit so anchor navigation (ScrollToTop) can
   * re-land on the form card after the card's height changes — otherwise the
   * scroll position computed before the zoom settles ends up off by the
   * height difference once scaling applies.
   */
  useEffect(() => {
    if (fit.formHeight > 0) {
      window.dispatchEvent(new CustomEvent("quoteform:fit"));
    }
  }, [fit]);

  return (
    <div
      className="relative w-full"
      style={
        zoomed
          ? { height: `${fit.formHeight * fit.zoom}px`, overflow: "hidden" }
          : undefined
      }
    >
      {status !== "ready" && (
        <div className="absolute inset-0 z-10 flex min-h-[560px] flex-col items-center justify-center gap-5 bg-card px-6 text-center">
          {status === "loading" ? (
            <>
              <Loader2 className="h-8 w-8 animate-spin text-accent" aria-hidden="true" />
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">
                  Getting your instant quote ready…
                </p>
                <p className="text-sm text-muted-foreground">
                  1. Tell us about your home &nbsp;→&nbsp; 2. See your price
                  &nbsp;→&nbsp; 3. Pick your time
                </p>
              </div>
              <a
                href={phoneLink}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-full px-4 text-sm font-bold text-accent hover:underline"
              >
                <Phone className="h-4 w-4" aria-hidden="true" />
                Prefer to book by phone? {phone}
              </a>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-base font-semibold text-foreground">
                  This is taking longer than usual
                </p>
                <p className="text-sm text-muted-foreground">
                  Your connection may be slow. Reload the form, or call us and
                  we'll price your clean over the phone in a minute.
                </p>
              </div>
              <div className="flex flex-col items-center gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => {
                    setStatus("loading");
                    setReloadKey((key) => key + 1);
                  }}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-brand-navy px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-brand-navy/90"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  Reload form
                </button>
                <a
                  href={phoneLink}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-accent px-6 text-sm font-bold text-accent-foreground transition-opacity hover:opacity-90"
                >
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {phone}
                </a>
              </div>
            </>
          )}
        </div>
      )}
      <iframe
        key={reloadKey}
        ref={iframeRef}
        onLoad={() => applyFit()}
        src="https://api.bookin60.com/widget/form/AwJDnvuYtkojIN3aOysC"
        style={{
          // Width compensation: layout width = card width / zoom, then the
          // transform scales the iframe back up to exactly fill the card —
          // the widget reflows naturally and simply renders larger.
          width: zoomed ? `${100 / fit.zoom}%` : "100%",
          height: `${BASE_FORM_HEIGHT}px`,
          border: "none",
          borderRadius: "0px",
          transform: zoomed ? `scale(${fit.zoom})` : undefined,
          transformOrigin: "top left",
        }}
        aria-busy={status !== "ready"}
        className={`transition-opacity duration-500 ${status === "ready" ? "opacity-100" : "opacity-0"}`}

        id={IFRAME_ID}
        data-layout="{'id':'INLINE'}"
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="Website Form"
        data-height="1180"
        data-layout-iframe-id={IFRAME_ID}
        data-form-id="AwJDnvuYtkojIN3aOysC"
        title="Website Form"
      />
    </div>
  );
}
