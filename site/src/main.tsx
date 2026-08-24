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
