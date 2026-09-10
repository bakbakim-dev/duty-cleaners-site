import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
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
 * Measured on 9 September 2026, after the performance round: 100 KB gzipped
 * for the entry chunk (was 142), 137–178 KB of script per page, 20 KB for the
 * stylesheet, heroes of 14 to 76 KB, no single body image over 78 KB.
 *
 * Three of the checks here exist because the audit found the same defects the
 * weight budgets alone could not see:
 *
 *   - A page can sit inside its total-image budget and still ship one 133 KB
 *     photo mid-body, so every image is capped on its own as well.
 *   - Six pages fetched a hero at fetchpriority="high" inside a
 *     `hidden lg:block` wrapper: phones paid for it and never saw it. A hero
 *     the layout hides on a phone is not a hero, it is a download.
 *   - 1,862 scroll-reveal wrappers were frozen into the snapshots at
 *     `opacity-0 translate-y-8`, so on a slow connection 173 pages showed a
 *     hero and then nothing. scripts/prerender.mjs now rewrites them to the
 *     revealed state; this checks that it did.
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
  hero_kb: 100,
  image_kb: 100,
  images_total_kb: 800,
};

/**
 * The class token that takes an element out of the layout on a phone.
 *
 * Only the bare Tailwind `hidden` counts. `lg:hidden` is the opposite case —
 * the element shows on a phone and hides on a desktop — and `hidden lg:block`
 * is the defect: fetched by everyone, rendered only above 1024px.
 */
const HIDES_ON_PHONES = "hidden";

/** The hidden half of a scroll-reveal wrapper, which no snapshot may ship. */
const REVEAL_HIDDEN = "opacity-0 translate-y-8";

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

/**
 * The rendition a phone actually downloads, in KB.
 *
 * An `<img>` with a srcset and `sizes="100vw"` hands a 390px screen the
 * smallest candidate and never fetches the `src`, so counting the src would
 * charge the two hubs 177 KB for a 25 KB download and would punish the one
 * pattern this file wants more of. An image with no srcset has exactly one
 * size, and everybody pays it.
 */
const phoneRendition = (tag: string) => {
  const src = tag.match(/src="([^"]+)"/)?.[1] ?? "";
  const srcset = tag.match(/srcset="([^"]*)"/)?.[1];
  const candidates = srcset
    ? srcset.split(",").map((c) => c.trim().split(/\s+/)[0]).filter(Boolean)
    : [];
  const kb = candidates.length
    ? Math.min(...candidates.map((c) => assetSize(c) / 1024))
    : assetSize(src) / 1024;
  return { src, kb };
};

/**
 * The class attributes of every element still open at `index`, outermost first.
 *
 * Prerendered React output is balanced, so a straight tag scan answers "what
 * is this image inside" without parsing the document. Scripts, styles and
 * comments are stripped by the caller so their contents cannot be mistaken
 * for markup.
 */
const openAncestors = (html: string, index: number): string[] => {
  const VOID = new Set(["img", "br", "hr", "input", "meta", "link", "source", "area", "base", "col", "embed", "param", "track", "wbr"]);
  const tag = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;
  const stack: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = tag.exec(html)) !== null && m.index < index) {
    const [, slash, name, attrs] = m;
    if (VOID.has(name.toLowerCase())) continue;
    if (slash) stack.pop();
    else if (!attrs.trimEnd().endsWith("/")) stack.push(/class="([^"]*)"/.exec(attrs)?.[1] ?? "");
  }
  return stack;
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
      // Markup only: an inline JSON-LD payload must not be read as tags.
      const markup = main.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>|<!--[\s\S]*?-->/g, "");
      const imgTags = [...markup.matchAll(/<img[^>]*>/g)].map((m) => m[0]).filter((t) => /src="\/[^"]+\.(?:webp|avif|png|jpe?g)"/.test(t));
      const images = [...new Map(imgTags.map((t) => [phoneRendition(t).src, phoneRendition(t)])).values()];

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
          const hero = markup.match(/<img[^>]+fetchpriority="high"[^>]*>/)?.[0];
          if (!hero) {
            // A page with no hero image cannot mis-prioritise one; only check nothing large is lazy-less at the top.
            expect(images.length === 0 || /loading="lazy"/.test(markup.match(/<img[^>]*>/)?.[0] ?? ""), "first image is neither the hero nor lazy").toBe(true);
            return;
          }
          const { src, kb } = phoneRendition(hero);
          expect(kb, `hero ${src}`).toBeLessThanOrEqual(BUDGET.hero_kb);
        });
        it("does not make a phone download a hero it never renders", () => {
          const hero = markup.match(/<img[^>]+fetchpriority="high"[^>]*>/)?.[0];
          if (!hero) return;
          const at = markup.indexOf(hero);
          const hiding = openAncestors(markup, at).filter((cls) => cls.split(/\s+/).includes(HIDES_ON_PHONES));
          if (!hiding.length) return; // shown on phones: the hero is the LCP element, as it should be

          /*
            A hero inside a `hidden lg:block` wrapper is desktop-only, and the
            defect is not the wrapper — it is the download. Six service pages
            fetched a 48-84 KB image at fetchpriority="high" that no phone ever
            painted. The fix is a <picture> whose <source> is gated on a desktop
            media query, with a data: URI as the <img> fallback: below the
            breakpoint no source matches, the preload scanner resolves the inline
            pixel, and the phone makes no request.

            So the question this asks is what a phone actually resolves, not how
            the markup is nested. A desktop-only hero passes when its own src
            costs nothing on the wire and every real candidate is behind a
            min-width query.
          */
          const src = hero.match(/src="([^"]+)"/)?.[1] ?? "";
          const picture = markup.slice(markup.lastIndexOf("<picture", at), markup.indexOf("</picture>", at) + 10);
          const sources = [...picture.matchAll(/<source\b[^>]*>/g)].map((m) => m[0]);
          const ungated = sources.filter((s) => !/media="[^"]*min-width[^"]*"/.test(s));

          expect(
            src.startsWith("data:"),
            `the hero inside ${JSON.stringify(hiding)} resolves to ${src} on a phone, which is a network request for an image the phone never shows`,
          ).toBe(true);
          expect(
            ungated,
            "a <source> with no min-width media query is offered to phones too",
          ).toEqual([]);
          expect(sources.length, "a desktop-only hero needs a gated <source> carrying the real image").toBeGreaterThan(0);
        });
      }
      it(`no body image is over ${BUDGET.image_kb} KB`, () => {
        const over = images.filter((i) => i.kb > BUDGET.image_kb).map((i) => `${i.src} ${i.kb.toFixed(0)} KB`);
        expect(over, "one photo can blow a page's budget on its own").toEqual([]);
      });
      it(`images referenced in the body total under ${BUDGET.images_total_kb} KB`, () => {
        expect(images.reduce((n, i) => n + i.kb, 0), `images: ${images.length}`).toBeLessThanOrEqual(BUDGET.images_total_kb);
      });
      it("ships no scroll-reveal wrapper still in its hidden start state", () => {
        expect(
          h.split(REVEAL_HIDDEN).length - 1,
          "wrappers frozen at opacity-0 by the prerenderer; everything below the first of them is blank until React mounts",
        ).toBe(0);
      });
    });
  }
});

/**
 * No single image on the site is oversized, whatever page it sits on.
 *
 * The per-page budget above walks the money pages, so it never saw the 154
 * location pages. On 10 September 2026 those carried 33 photographs over
 * 100 KB, 4.2 MB in total, the worst a 205 KB neighbourhood shot; every one
 * of them is somebody's largest-contentful paint. Re-encoding took the set to
 * 2.7 MB with no dimension change, and this keeps it there: a photo dropped
 * in at camera quality fails here before anyone measures a page.
 */
describe("no image anywhere in the build is oversized", () => {
  if (!built) {
    it.skip("no build; run prerender:all first", () => {});
    return;
  }
  const CAP_KB = 100;
  it(`every image asset is at most ${CAP_KB} KB`, () => {
    const assets = join(DIST, "assets");
    const over = readdirSync(assets)
      .filter((f) => /\.(webp|avif|png|jpe?g)$/i.test(f))
      .map((f) => ({ f, kb: statSync(join(assets, f)).size / 1024 }))
      .filter((a) => a.kb > CAP_KB)
      .sort((a, b) => b.kb - a.kb)
      .map((a) => `${a.f} ${a.kb.toFixed(0)} KB`);
    expect(over, "re-encode these; a hero this size is a second of 4G on the LCP path").toEqual([]);
  });
});
