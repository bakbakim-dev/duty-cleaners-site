/**
 * Real visitors' page speed, recorded in Google Analytics 4 as "web_vital"
 * events: one per metric per page load, from Google's web-vitals library.
 *
 * Why (2026-10-05): Google has no field data for this site (too few Chrome
 * visits for its public report), so the only speed figures were lab tests,
 * and PageSpeed scores for the same page swung 25 points between runs. This
 * records what visitors' own phones measured, with the connection type the
 * browser reports, so a decision such as moving pages to static HTML can be
 * judged on how many visitors are on slow connections rather than guessed.
 *
 * What is sent: the metric's name (LCP, INP, CLS, FCP, TTFB), its value in
 * milliseconds (CLS as a whole number ×1000), Google's rating (good,
 * needs-improvement, poor), the connection type (4g, 3g…) where the browser
 * reports one, and the device class that track() adds. Everything still goes
 * through track() and its allowlist; page_location is the cleaned address.
 *
 * It runs only where GA4 runs (initAnalytics() set window.__dcGa4: the live
 * domain, a measurement ID, no Global Privacy Control or Do Not Track), and the
 * library (one self-contained 9 KB module, about 3 KB gzipped) is fetched
 * after the page's load event. It is imported by URL, not bundled: as a normal
 * dynamic import, the build's 10 KB small-chunk rule (vite.config.ts) folded it
 * into the entry chunk every page downloads, and pushed the Calgary hub past
 * its script budget (page-weight.test.ts). Events wait in the dataLayer until
 * gtag.js loads.
 */
import webVitalsUrl from "web-vitals?url";
import { track } from "@/lib/analytics";

export interface VitalMetric {
  name: string;
  value: number;
  rating: string;
}

/** What the browser reports about the connection ("4g", "3g"…); Chromium only. */
export function connectionType(): string | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as Navigator & { connection?: { effectiveType?: unknown } };
  const type = nav.connection?.effectiveType;
  return typeof type === "string" && type ? type : undefined;
}

/** The event properties for one measurement. */
export function webVitalProps(metric: VitalMetric, connection?: string): Record<string, string | number> {
  const value = metric.name === "CLS" ? metric.value * 1000 : metric.value;
  const props: Record<string, string | number> = {
    metric: metric.name,
    metric_value: Math.round(value),
    metric_rating: metric.rating,
  };
  if (connection) props.connection = connection;
  return props;
}

let started = false;

export function initWebVitals(): void {
  if (started || typeof window === "undefined" || typeof document === "undefined") return;
  if (!window.__dcGa4) return;
  started = true;
  const start = () => {
    (import(/* @vite-ignore */ webVitalsUrl) as Promise<typeof import("web-vitals")>)
      .then(({ onCLS, onFCP, onINP, onLCP, onTTFB }) => {
        const report = (metric: VitalMetric) => track("web_vital", webVitalProps(metric, connectionType()));
        onLCP(report);
        onINP(report);
        onCLS(report);
        onFCP(report);
        onTTFB(report);
      })
      .catch(() => {
        /* measuring must never break the page */
      });
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
}
