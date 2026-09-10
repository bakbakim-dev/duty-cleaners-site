import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { MONEY_PAGES } from "./money-page-seo.test";

/**
 * What a money page costs to load, pinned.
 *
 * The site is prerendered, so the HTML paints before any script runs; the
 * JavaScript is hydration, not content. That is why the budget is generous
 * on script and strict on the things that block the first paint: the HTML
 * itself, the stylesheet, and the hero image, which must be declared with
 * fetchpriority so the browser starts it first.
 *
 * Measured on 9 September 2026: 86 KB gzipped for the main bundle, 60 KB for
 * the UI-library chunk, 20 KB for the stylesheet, heroes of 50 to 180 KB.
 * A dependency added to the shared bundle, a hero swapped for an unsized
 * original, or a stylesheet that stops being purged shows up here before it
 * shows up in Search Console's Core Web Vitals report.
 *
 * Reads dist/ and skips when there is no build.
 */

const DIST = join(__dirname, "..", "..", "dist");
const built = existsSync(join(DIST, "index.html"));

const BUDGET = {
  html_gzip_kb: 60,
  css_gzip_kb: 28,
  js_gzip_kb: 170,
  js_gzip_kb_support: 220,
  hero_kb: 200,
  images_total_kb: 800,
};

const pagePath = (url: string) => (url === "/" ? join(DIST, "index.html") : join(DIST, ...url.split("/").filter(Boolean), "index.html"));
const gz = (buf: Buffer | string) => gzipSync(buf).length / 1024;
const assetSize = (src: string) => {
  const p = join(DIST, ...src.split("?")[0].split("/").filter(Boolean));
  return existsSync(p) ? statSync(p).size : 0;
};
const assetGzip = (src: string) => {
  const p = join(DIST, ...src.split("?")[0].split("/").filter(Boolean));
  return existsSync(p) ? gz(readFileSync(p)) : 0;
};

describe("every money page stays inside its weight budget", () => {
  if (!built) {
    it.skip("no build; run prerender:all first", () => {});
    return;
  }
  for (const page of MONEY_PAGES) {
    describe(page.url, () => {
      const h = readFileSync(pagePath(page.url), "utf-8");
      const scripts = [...new Set([...h.matchAll(/<(?:script|link)[^>]+(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]))];
      const styles = [...new Set([...h.matchAll(/<link[^>]+href="(\/assets\/[^"]+\.css)"/g)].map((m) => m[1]))];
      const main = h.match(/<main[\s\S]*?<\/main>/)?.[0] ?? h;
      const images = [...new Set([...main.matchAll(/<img[^>]+src="(\/[^"]+\.(?:webp|avif|png|jpe?g))"/g)].map((m) => m[1]))];

      it(`HTML is under ${BUDGET.html_gzip_kb} KB gzipped`, () => {
        expect(gz(h), "HTML gzipped KB").toBeLessThanOrEqual(BUDGET.html_gzip_kb);
      });
      it(`stylesheets total under ${BUDGET.css_gzip_kb} KB gzipped`, () => {
        expect(styles.reduce((n, s) => n + assetGzip(s), 0), `css: ${styles.join(", ")}`).toBeLessThanOrEqual(BUDGET.css_gzip_kb);
      });
      // The contact page carries the form stack (schema validation, toasts,
      // the select) that no other page needs; it is a support page and gets
      // room for it. Money pages do not.
      const jsBudget = page.kind === "support" ? BUDGET.js_gzip_kb_support : BUDGET.js_gzip_kb;
      it(`scripts total under ${jsBudget} KB gzipped`, () => {
        expect(scripts.reduce((n, s) => n + assetGzip(s), 0), `js: ${scripts.join(", ")}`).toBeLessThanOrEqual(jsBudget);
      });
      if (page.kind !== "support") {
        it("declares a hero image with fetchpriority=high, under budget, or has no hero image at all", () => {
          const hero = main.match(/<img[^>]+fetchpriority="high"[^>]*>/)?.[0];
          if (!hero) {
            // A page with no hero image cannot mis-prioritise one; only check nothing large is lazy-less at the top.
            expect(images.length === 0 || /loading="lazy"/.test(main.match(/<img[^>]*>/)?.[0] ?? ""), "first image is neither the hero nor lazy").toBe(true);
            return;
          }
          const src = hero.match(/src="([^"]+)"/)?.[1] ?? "";
          expect(assetSize(src) / 1024, `hero ${src}`).toBeLessThanOrEqual(BUDGET.hero_kb);
        });
      }
      it(`images referenced in the body total under ${BUDGET.images_total_kb} KB`, () => {
        expect(images.reduce((n, s) => n + assetSize(s), 0) / 1024, `images: ${images.length}`).toBeLessThanOrEqual(BUDGET.images_total_kb);
      });
    });
  }
});
