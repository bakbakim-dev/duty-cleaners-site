import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { displayNameFor, proseNameFor } from "./place-names";

/**
 * Two guards from the duplicate-content / localization sweep of 2026-08-29.
 *
 * 1. RAW pairwise overlap between location pages. The doorway guard in
 *    location-pages.test.ts normalizes place names away, which is right for
 *    doorway detection but blind to what a crawler actually reads — pages can
 *    pass it while sharing 86% of their raw text through template blocks,
 *    which is what hollick-kenyon did against twenty siblings. This guard
 *    measures the raw text, no normalization, overlap-of-smaller-page: after
 *    place-name interpolation into the shared blocks and local notes for every
 *    hub page, no location pair measures >= 60%.
 *
 * 2. Per-page localization: each location page's injected place name must be
 *    ITS OWN. The interpolation that fixed the overlap also created the risk
 *    this checks — LocationPricing's first name derivation kept the city
 *    suffix, so ~100 pages rendered "A standard clean in Altadore Calgary
 *    runs..." until the localization sweep caught it. The check reads the
 *    prose, not the component, so any future derivation bug fails here.
 */

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

function locationUrls(): Array<{ url: string; city: "edmonton" | "calgary" }> {
  if (!existsSync(DIST)) return [];
  const out: Array<{ url: string; city: "edmonton" | "calgary" }> = [];
  for (const f of readdirSync(DIST).filter((n) => /^sitemap-locations-.*\.xml$/.test(n))) {
    const city = f.includes("calgary") ? "calgary" : "edmonton";
    const xml = readFileSync(join(DIST, f), "utf-8");
    for (const m of xml.matchAll(/<loc>https:\/\/dutycleaners\.ca(\/[^<]*)<\/loc>/g)) {
      out.push({ url: m[1], city });
    }
  }
  return out;
}

const read = (url: string) =>
  readFileSync(join(DIST, ...url.replace(/^\/|\/$/g, "").split("/"), "index.html"), "utf-8");

function mainText(html: string): string {
  const noScript = html.replace(/<script[\s\S]*?<\/script>/g, " ");
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(noScript);
  return (m ? m[1] : noScript).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const locs = locationUrls();

describe("every location page is localized to its own place", () => {
  it("the injected place name in the pricing prose is the page's own", () => {
    if (!locs.length) return;
    const wrong: string[] = [];
    for (const { url } of locs) {
      const slug = url.replace(/\/+$/, "").split("/").pop()!;
      const name = proseNameFor(slug);
      const text = mainText(read(url));
      const m = /A standard clean in (.+?) runs/.exec(text);
      if (m && m[1].trim() !== name) {
        wrong.push(`${url}: prose says "${m[1].trim()}", page is "${name}"`);
      }
    }
    expect(wrong.slice(0, 10)).toEqual([]);
  });

  it("the place name appears in title, H1 and body", () => {
    if (!locs.length) return;
    const missing: string[] = [];
    for (const { url } of locs) {
      const slug = url.replace(/\/+$/, "").split("/").pop()!;
      const first = displayNameFor(slug).split(" ")[0].toLowerCase();
      const html = read(url);
      const title = (/<title[^>]*>([\s\S]*?)<\/title>/.exec(html)?.[1] ?? "").toLowerCase();
      const h1 = (/<h1[^>]*>([\s\S]*?)<\/h1>/.exec(html)?.[1] ?? "")
        .replace(/<[^>]+>/g, "")
        .toLowerCase();
      if (!title.includes(first)) missing.push(`${url}: title lacks place`);
      if (!h1.includes(first)) missing.push(`${url}: h1 lacks place`);
    }
    expect(missing.slice(0, 10)).toEqual([]);
  });

  it("the correct branch phone dominates each page", () => {
    if (!locs.length) return;
    const wrong: string[] = [];
    for (const { url, city } of locs) {
      const text = mainText(read(url));
      const edm = (text.match(/780-913-6565|\(780\) 913-6565/g) || []).length;
      const cal = (text.match(/403-768-1341|\(403\) 768-1341/g) || []).length;
      if (city === "edmonton" && cal > edm) wrong.push(`${url}: Calgary phone dominates`);
      if (city === "calgary" && edm > cal) wrong.push(`${url}: Edmonton phone dominates`);
    }
    expect(wrong).toEqual([]);
  });
});

describe("no two location pages read as raw near-duplicates", () => {
  /**
   * Overlap coefficient (shared / smaller) on raw lowercased 8-grams of
   * <main>. 60% is where the sweep landed after interpolation + notes; the
   * worst pair today is below it. Template blocks legitimately shared (price
   * facts, guarantee, FAQ structure) fit under this ceiling only because each
   * page also carries interpolated names and unique local prose — remove
   * either and this fails.
   */
  const CEILING = 0.6;

  it("no pair reaches the ceiling", () => {
    if (!locs.length) return;
    const grams = new Map<string, Set<string>>();
    for (const { url } of locs) {
      const w = mainText(read(url)).toLowerCase().split(" ");
      const g = new Set<string>();
      for (let i = 0; i + 8 <= w.length; i++) g.add(w.slice(i, i + 8).join(" "));
      grams.set(url, g);
    }
    const urls = [...grams.keys()];
    const bad: string[] = [];
    for (let i = 0; i < urls.length; i++) {
      const gi = grams.get(urls[i])!;
      for (let j = i + 1; j < urls.length; j++) {
        const gj = grams.get(urls[j])!;
        const [small, big] = gi.size <= gj.size ? [gi, gj] : [gj, gi];
        let inter = 0;
        for (const g of small) if (big.has(g)) inter++;
        const ov = inter / small.size;
        if (ov >= CEILING) bad.push(`${urls[i]} <-> ${urls[j]} (${(ov * 100).toFixed(0)}%)`);
      }
    }
    expect(bad.slice(0, 10)).toEqual([]);
  }, 120_000);
});
