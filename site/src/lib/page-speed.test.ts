import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { GA4_FALLBACK_MS, GA4_START_EVENTS, filterEventProps, initAnalytics } from "@/lib/analytics";
import { lazyWithPreload } from "@/lib/lazy-with-preload";
import { initWebVitals, webVitalProps } from "@/lib/web-vitals";

/**
 * The three page-speed changes of 2026-10-06, each measured on the live site
 * the day before (see the comments in analytics.ts, lazy-with-preload.ts and
 * main.tsx for the numbers):
 *  1. gtag.js waits for the visitor's first scroll, tap or key press.
 *  2. A prerendered page's own module loads before React's first render, so
 *     that render never puts the "Loading page…" spinner over the page.
 *  3. Real visitors' page speed reaches GA4 through the same privacy filter.
 */

const ROOT = join(__dirname, "..", "..");
const codeOf = (rel: string) => readFileSync(join(ROOT, rel), "utf8");

function stubLiveSite() {
  const appended: { src?: string }[] = [];
  const listeners = new Map<string, (event?: unknown) => void>();
  vi.stubGlobal("window", {
    location: { hostname: "dutycleaners.ca", href: "https://dutycleaners.ca/" },
    innerWidth: 400,
    addEventListener: (type: string, fn: (event?: unknown) => void) => listeners.set(type, fn),
    removeEventListener: (type: string) => listeners.delete(type),
  });
  vi.stubGlobal("navigator", { userAgent: "Mozilla/5.0 (Linux; Android 14) Chrome/141 Mobile" });
  vi.stubGlobal("document", {
    createElement: () => ({}),
    head: { appendChild: (node: { src?: string }) => appended.push(node) },
  });
  return { appended, listeners };
}

describe("Google Analytics waits for the visitor", () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("gtag.js loads on the first scroll, tap or key press, not at startup", () => {
    const { appended, listeners } = stubLiveSite();
    expect(initAnalytics("G-TEST12345")).toBe(true);
    expect(appended, "gtag.js was requested at startup again").toEqual([]);
    expect([...listeners.keys()].sort()).toEqual([...GA4_START_EVENTS].sort());
    listeners.get("scroll")!();
    expect(appended).toHaveLength(1);
    expect(appended[0].src).toBe("https://www.googletagmanager.com/gtag/js?id=G-TEST12345");
    expect(listeners.size, "the start listeners stay attached after gtag.js loaded").toBe(0);
    vi.advanceTimersByTime(GA4_FALLBACK_MS * 2);
    expect(appended, "gtag.js was requested twice").toHaveLength(1);
  });

  it("an untouched page still loads gtag.js after ten seconds", () => {
    const { appended } = stubLiveSite();
    initAnalytics("G-TEST12345");
    expect(GA4_FALLBACK_MS).toBe(10_000);
    vi.advanceTimersByTime(GA4_FALLBACK_MS - 1);
    expect(appended).toEqual([]);
    vi.advanceTimersByTime(1);
    expect(appended).toHaveLength(1);
  });

  it("the page view and campaign tags are queued at startup, before gtag.js arrives", () => {
    stubLiveSite();
    initAnalytics("G-TEST12345");
    const dataLayer = (globalThis.window as unknown as { dataLayer: ArrayLike<unknown>[] }).dataLayer;
    const commands = dataLayer.map((args) => Array.from(args));
    expect(commands.some((c) => c[0] === "event" && c[1] === "page_view")).toBe(true);
    expect(commands.some((c) => c[0] === "config")).toBe(true);
  });
});

describe("the first render never suspends over a prerendered page", () => {
  it("a route page renders without suspending once its module has loaded", async () => {
    const Page = () => null;
    const Preloadable = lazyWithPreload(async () => ({ default: Page }));
    const before = Preloadable({}) as unknown as { type: { $$typeof?: symbol } };
    expect(before.type.$$typeof, "an unloaded page should still behave like React.lazy").toBe(Symbol.for("react.lazy"));
    await Preloadable.preload();
    const after = Preloadable({}) as unknown as { type: unknown };
    expect(after.type, "after preload() the page must render directly, without a Suspense round trip").toBe(Page);
  });

  it("a failed fetch can be retried", async () => {
    let calls = 0;
    const Page = () => null;
    const Preloadable = lazyWithPreload(async () => {
      calls += 1;
      if (calls === 1) throw new Error("network");
      return { default: Page };
    });
    await expect(Preloadable.preload()).rejects.toThrow("network");
    await Preloadable.preload();
    expect((Preloadable({}) as unknown as { type: unknown }).type).toBe(Page);
  });

  it("every route in App.tsx is a preloadable page or a redirect", () => {
    const app = codeOf("src/App.tsx");
    expect(app, "a route went back to plain React.lazy").not.toMatch(/\blazy\(/);
    const preloadable = new Set([...app.matchAll(/const (\w+) = lazyWithPreload\(\(\) => import\(/g)].map((m) => m[1]));
    // A page imported eagerly (NotFound) is already loaded, so it cannot suspend either.
    for (const m of app.matchAll(/^import (\w+) from "\.\/pages\//gm)) preloadable.add(m[1]);
    const elements = [...app.matchAll(/<Route path="[^"]*" element=\{<(\w+)\b/g)].map((m) => m[1]);
    expect(elements.length).toBeGreaterThan(300);
    const other = [...new Set(elements.filter((name) => name !== "Navigate" && !preloadable.has(name)))];
    expect(other, "these routes cannot be preloaded before the first render").toEqual([]);
    expect(app).toMatch(/<Routes>\{routeTree\}<\/Routes>/);
  });

  it("main.tsx loads the page's module before React's first render on a prerendered page", () => {
    const main = codeOf("src/main.tsx");
    expect(main).toMatch(/matchRoutes\(\s*createRoutesFromChildren\(routeTree\.props\.children\)/);
    expect(main, "createRoot renders before the page's module is loaded").toMatch(
      /if \(rootElement\.hasChildNodes\(\)\) void preloadCurrentRoute\(\)\.then\(mount\);/,
    );
    expect(main.match(/createRoot\(/g), "a second createRoot call renders without waiting").toHaveLength(1);
  });
});

describe("real visitors' page speed", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("measurements reach analytics with only their own fields", () => {
    expect(filterEventProps(webVitalProps({ name: "LCP", value: 2512.4, rating: "good" }, "4g", "/pricing/"))).toEqual({
      metric: "LCP",
      metric_value: 2512,
      metric_rating: "good",
      connection: "4g",
      metric_page: "/pricing/",
    });
    // CLS is a unitless score; it is sent as a whole number, ×1000.
    expect(webVitalProps({ name: "CLS", value: 0.0734, rating: "good" })).toEqual({
      metric: "CLS",
      metric_value: 73,
      metric_rating: "good",
    });
    // The filter still drops anything that looks like a person's details.
    expect(filterEventProps({ metric: "LCP", connection: "jane@example.com", metric_rating: "780 555 0199" })).toEqual({
      metric: "LCP",
    });
  });

  it("nothing is measured where Google Analytics is off", () => {
    // Still loading, so a version that skipped the GA4 check would wait for
    // the load event here, and the spy would see it.
    const addEventListener = vi.fn();
    vi.stubGlobal("window", { addEventListener });
    vi.stubGlobal("document", { readyState: "loading" });
    initWebVitals();
    expect(addEventListener).not.toHaveBeenCalled();
  });

  it("the privacy policy tells visitors about the speed measurements", () => {
    const policy = codeOf("src/pages/PrivacyPolicy.tsx");
    expect(policy).toMatch(/how quickly each page appeared and responded on your device/);
    expect(policy).toMatch(/type of\s+connection your browser reports/);
  });
});
