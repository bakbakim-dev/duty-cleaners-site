import { useEffect, useRef, lazy, Suspense } from "react";
import Stars from "@/components/Stars";
import { createPortal } from "react-dom";
import { ArrowLeft, X } from "lucide-react";
import { useQuoteOverlay } from "@/hooks/use-quote-overlay";
import { useQuoteProgress } from "@/lib/quote-progress";
import { useLocation } from "react-router-dom";
import { branchFromPath, isCalgaryPath } from "@/lib/city-from-path";
import { CITY_PROOF, cityProofFor, hasGoogleRating, ratingClaimFor } from "@/data/proof";
import LoadErrorBoundary from "@/components/LoadErrorBoundary";

/**
 * The funnel (with react-hook-form + zod + the whole pricing engine) used to be
 * a static import, so every visitor downloaded it on every page even though the
 * overlay renders nothing until it is opened. It is lazy now, and because the
 * provider already prewarms on hover/touch of any quote CTA (see
 * use-quote-overlay), the chunk is normally in flight before the click lands.
 */
const QuoteFlow = lazy(() => import("@/components/quote/QuoteFlow"));

/**
 * Human label for wherever the visitor came from, so closing the takeover
 * reads as "go back to the page I was on" rather than a bare X.
 */
const pageLabel = (pathname: string) => {
  if (pathname === "/" || pathname.startsWith("/edmonton")) return "Edmonton cleaning";
  if (branchFromPath(pathname) === "reddeer") return "Red Deer cleaning";
  if (isCalgaryPath(pathname)) return "Calgary cleaning";
  if (pathname.startsWith("/blog")) return "the blog";
  if (pathname.startsWith("/pricing") || pathname.includes("pricing")) return "pricing";
  return "the site";
};

/**
 * Full-screen booking takeover.
 *
 * Clicking any quote CTA opens this instead of scrolling to an in-page card:
 * the form gets the entire viewport minus a slim header, so it can be scaled
 * up far more than it could inside a page section — the whole flow, from
 * "Step 1 of 2 — About your home" to the "Get My Instant Quote" button, is
 * on screen at a comfortable size.
 *
 * Once mounted it is never unmounted: closing hides it with `visibility`
 * (which keeps layout, so the embed can keep measuring itself) so re-opening
 * is instant and any answers already typed are still there.
 */
export default function QuoteOverlay() {
  const { isOpen, isMounted, initialService, initialIntent, servicePreset, closeQuote } =
    useQuoteOverlay();
  const { pathname } = useLocation();
  const panelRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const scrollYRef = useRef(0);
  // The home and contact steps are one column; the price step adds a rail.
  // Sizing the card to the step stops the short steps floating in a wide box.
  const { step: quoteStep, branch: chosenBranch } = useQuoteProgress();
  // The branch's own number, from data/proof.ts: never typed here. Once the
  // visitor says where the home is, the header follows that office.
  const { phone, phoneLink, key } = chosenBranch ? CITY_PROOF[chosenBranch] : cityProofFor(pathname);
  const cardWidth = quoteStep >= 2 ? "max-w-7xl" : "max-w-3xl";

  // Lock the page behind the takeover, trap focus, and support Escape.
  useEffect(() => {
    if (!isOpen) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    scrollYRef.current = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    const pageRoot = document.getElementById("root");
    const previousRootInert = pageRoot?.inert ?? false;
    const previousRootAriaHidden = pageRoot?.getAttribute("aria-hidden");
    document.body.style.overflow = "hidden";
    if (pageRoot) {
      pageRoot.inert = true;
      pageRoot.setAttribute("aria-hidden", "true");
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeQuote();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      /*
        Only VISIBLE elements can hold focus, and the panel's own header hides
        two of its controls responsively — the "Back to {page}" button is
        `hidden md:inline-flex`, so below 768px it is display:none while still
        matching this selector. It was the first match, so Shift+Tab from the
        top of the modal called .focus() on a display:none button, which does
        nothing: focus stayed where it was or fell to the body, and the trap
        leaked on every phone-width viewport. offsetParent is null for anything
        with display:none on itself or an ancestor, which is exactly the set
        that cannot take focus.
      */
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || active === panel || !panel.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panel.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      if (pageRoot) {
        pageRoot.inert = previousRootInert;
        if (previousRootAriaHidden === null) pageRoot.removeAttribute("aria-hidden");
        else pageRoot.setAttribute("aria-hidden", previousRootAriaHidden);
      }
      document.removeEventListener("keydown", onKeyDown);
      // Return the visitor exactly where they were, focus included.
      window.scrollTo(0, scrollYRef.current);
      openerRef.current?.focus?.();
    };
  }, [isOpen, closeQuote]);

  if (!isMounted) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get your instant cleaning quote"
      aria-hidden={!isOpen}
      className="fixed inset-0 z-[100] flex flex-col bg-background"
      style={
        isOpen
          ? undefined
          : { visibility: "hidden", pointerEvents: "none", opacity: 0 }
      }
      ref={panelRef}
      tabIndex={-1}
    >
      {/* Slim header — everything else on the page is hidden so the form
          can use the rest of the screen. */}
      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-card px-4 py-2.5 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={closeQuote}
            className="hidden min-h-[44px] items-center gap-2 rounded-full px-3 py-2 text-base font-bold text-foreground transition-colors hover:bg-secondary md:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to {pageLabel(pathname)}
          </button>
          <span className="hidden h-5 w-px bg-border md:inline-block" />
          {/* The branch's own listing rating: the Red Deer listing has no
              reviews yet, so the Red Deer page's takeover shows none. */}
          {hasGoogleRating(key) && (
          <span className="flex items-center gap-1.5">
            <Stars size={0.875} />
            <span className="truncate text-xs font-semibold text-muted-foreground sm:text-sm">
              {ratingClaimFor(key)}
            </span>
          </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={phoneLink}
            className="hidden min-h-[44px] items-center gap-1.5 text-base font-bold text-accent hover:underline lg:inline-flex"
          >
            <span className="dc-icon dc-icon-phone h-4 w-4" aria-hidden="true" />
            Or book by phone: {phone}
          </a>
          <a
            href={phoneLink}
            aria-label={`Call ${phone}`}
            className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-base font-bold text-accent hover:bg-secondary lg:hidden"
          >
            <span className="dc-icon dc-icon-phone h-5 w-5" aria-hidden="true" />
            Call
          </a>
          <button
            type="button"
            onClick={closeQuote}
            aria-label="Close quote form"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-foreground transition-colors hover:bg-secondary"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </header>

      {/* Warm canvas behind, white reading surface on top — the funnel itself
          stays motif-free. */}
      <div className="funnel-canvas flex-1 overflow-y-auto">
        <div className={`mx-auto w-full ${cardWidth} px-2 py-4 sm:px-4 md:px-6 md:py-8`}>
          <div className="rounded-lg border border-border bg-card p-4 sm:p-5 shadow-[0_18px_40px_-32px_hsl(var(--brand-navy)/0.5)] md:p-8">
            <LoadErrorBoundary area="quote form" onDismiss={closeQuote}>
              <Suspense
                fallback={
                  <div className="min-h-[420px] animate-pulse rounded-md bg-muted/40" aria-hidden="true" />
                }
              >
                <QuoteFlow
                  initialService={initialService}
                  initialIntent={initialIntent}
                  servicePreset={servicePreset}
                  onClose={closeQuote}
                />
              </Suspense>
            </LoadErrorBoundary>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
