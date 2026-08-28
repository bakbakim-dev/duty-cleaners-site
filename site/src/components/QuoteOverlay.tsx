import { useEffect, useRef, lazy, Suspense } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, Phone, Star, X } from "lucide-react";
import { useQuoteOverlay } from "@/hooks/use-quote-overlay";
import { useLocation } from "react-router-dom";
import { isCalgaryPath } from "@/lib/city-from-path";

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
  const isCalgary = isCalgaryPath(pathname);
  const phone = isCalgary ? "(403) 768-1341" : "(780) 913-6565";
  const phoneLink = isCalgary ? "tel:4037681341" : "tel:7809136565";

  // Lock the page behind the takeover, trap focus, and support Escape.
  useEffect(() => {
    if (!isOpen) return;

    openerRef.current = document.activeElement as HTMLElement | null;
    scrollYRef.current = window.scrollY;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeQuote();
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
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
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-secondary md:inline-flex"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to {pageLabel(pathname)}
          </button>
          <span className="hidden h-5 w-px bg-border md:inline-block" />
          <span className="flex items-center gap-1.5">
            <span className="flex gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
              ))}
            </span>
            <span className="truncate text-xs font-semibold text-muted-foreground sm:text-sm">
              4.9 on Google
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={phoneLink}
            className="hidden items-center gap-1.5 text-sm font-bold text-accent hover:underline lg:inline-flex"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Prefer to book by phone? {phone}
          </a>
          <a
            href={phoneLink}
            aria-label={`Call ${phone}`}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-accent hover:bg-secondary lg:hidden"
          >
            <Phone className="h-5 w-5" aria-hidden="true" />
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
        <div className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
          <div className="rounded-lg border border-border bg-card p-5 shadow-[0_18px_40px_-32px_hsl(var(--brand-navy)/0.5)] md:p-8">
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
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
