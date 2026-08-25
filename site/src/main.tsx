import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { captureTrackingParams } from "./lib/tracking";
import "./index.css";

// Capture gclid/UTM attribution from the landing URL (first-touch wins).
captureTrackingParams();

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
 */
createRoot(document.getElementById("root")!).render(<App />);

// Tells the failsafe in index.html that the bundle booted, so the scroll-reveal
// start state (opacity:0) can stand. If this line is never reached, that
// timeout drops the `data-motion` flag and the prerendered content stays
// visible instead of sitting invisible behind an observer that will never run.
window.__dcMounted = true;
