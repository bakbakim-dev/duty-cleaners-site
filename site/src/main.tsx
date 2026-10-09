import { createRoot } from "react-dom/client";
import { createRoutesFromChildren, matchRoutes } from "react-router-dom";
import App, { routeTree } from "./App.tsx";
import { captureReferrer, captureTrackingParams } from "./lib/tracking";
import { initAnalytics, initContactClickTracking } from "./lib/analytics";
import { initWebVitals } from "./lib/web-vitals";
import "./index.css";

// Capture gclid/UTM attribution from the landing URL (first-touch wins).
captureTrackingParams();
captureReferrer();

// Google Analytics 4 loads only when a measurement ID is set at build time
// (VITE_GA4_MEASUREMENT_ID, see .env.example); without one this adds nothing.
initAnalytics(import.meta.env.VITE_GA4_MEASUREMENT_ID);
// phone_click / email_click for every tel: and mailto: link, without the number.
initContactClickTracking();
// Real visitors' page speed (LCP, INP, CLS, FCP, TTFB) as GA4 events, only
// where GA4 itself runs; the library loads after the page has finished loading.
initWebVitals();

// Prevent the browser from restoring previous scroll position on refresh —
// our <ScrollToTop /> handles scroll on every route change. Without this,
// the page can briefly render at the old scroll offset then jump to the
// top, producing a visible "reload" flicker.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

/**
 * createRoot, not hydrateRoot — and this is deliberate. Do not "fix" it.
 *
 * It is true that createRoot on a non-empty container throws the prerendered
 * markup away: React 18 empties the container before its first render, so the
 * snapshots in dist help crawlers and nobody else. hydrateRoot looks like the
 * obvious upgrade. It was tried, measured, and reverted.
 *
 * The reason is that scripts/prerender.mjs snapshots a CLIENT render. Chrome
 * loads the SPA shell, React renders normally, and --dump-dom captures the
 * result. React's useId deliberately uses a different id prefix for
 * client-rendered trees than for hydrated ones, so the snapshot is full of
 * Radix ids like `radix-:r0:-trigger-standard` that hydration can never
 * reproduce. Loading a prerendered page with hydrateRoot produced React error
 * #418 (hydration mismatch) followed by #423 (whole root falls back to client
 * rendering) — 44 generated ids on /pricing/ alone. The net effect was the
 * same full client render as today, plus console errors.
 *
 * Hydration here needs a real server render (renderToString) so the ids are
 * generated in the mode hydration expects. Swapping the two calls is not
 * enough, and a --dump-dom snapshot can never be hydrated.
 *
 * What createRoot must not do is suspend on its first render. Every route is
 * lazy, and a lazy page suspends the first time it renders even when its chunk
 * is already downloaded, so the first render used to put App.tsx's full-screen
 * "Loading page…" fallback over the prerendered page and draw the page again a
 * moment later (seen on every load in Chrome, 2026-10-05). So on a prerendered
 * page the matched route's module is loaded first (lazyWithPreload), and the
 * first render produces the page itself.
 */
function preloadCurrentRoute(): Promise<void> {
  try {
    const matches = matchRoutes(
      createRoutesFromChildren(routeTree.props.children),
      window.location.pathname,
      import.meta.env.BASE_URL,
    );
    const element = matches?.[matches.length - 1]?.route.element as
      | { type?: { preload?: () => Promise<void> } }
      | null
      | undefined;
    const preload = element?.type?.preload;
    // A failed fetch is left to the first render, which shows the error page.
    return preload ? preload().catch(() => undefined) : Promise.resolve();
  } catch {
    return Promise.resolve();
  }
}

const rootElement = document.getElementById("root")!;

function mount(): void {
  createRoot(rootElement).render(<App />);
  // Tells the failsafe in index.html that the bundle booted, so the scroll-reveal
  // start state (opacity:0) can stand. If this line is never reached, that
  // timeout drops the `data-motion` flag and the prerendered content stays
  // visible instead of sitting invisible behind an observer that will never run.
  window.__dcMounted = true;
}

// A prerendered page has content to keep on screen until its own module is
// ready; the empty SPA shell (/book, 404) shows the loading spinner instead.
if (rootElement.hasChildNodes()) void preloadCurrentRoute().then(mount);
else mount();
