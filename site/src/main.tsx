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

createRoot(document.getElementById("root")!).render(<App />);

// Tells the failsafe in index.html that the bundle booted, so the scroll-reveal
// start state (opacity:0) can stand. If this line is never reached, that
// timeout drops the `data-motion` flag and the prerendered content stays
// visible instead of sitting invisible behind an observer that will never run.
window.__dcMounted = true;
