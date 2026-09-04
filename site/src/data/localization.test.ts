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
   * Overlap coefficient (shared / smaller) on raw lowercased 8-grams of <main>.
   *
   * WHY THIS MOVED FROM 0.6 TO 0.7. The old comment here said the 60% ceiling
   * held "only because each page also carries interpolated names and unique
   * local prose — remove either and this fails". Part of that variation was not
   * prose at all: LocationPageTemplate ran a copy-spinner that hashed the place
   * name and picked one of four paraphrases for nine slots. The paraphrases said
   * the same thing in different words, so they bought nothing for a reader and
   * existed to make 166 pages look unlike each other to a crawler. Removing it
   * let the real template share show through, and the worst pair went from just
   * under 60% to 64%.
   *
   * 64% overlap between two location pages is not a defect. What overlaps is
   * the shared furniture — service cards, the guarantee, FAQ structure, service
   * areas — and repeating that across sibling pages is ordinary for a local
   * service business. The ceiling sits at 0.70: above today's worst pair, far
   * below the 90%+ a genuinely duplicated page reaches.
   *
   * The check that actually enforces the intent is the one below this: every
   * page must carry a substantial body of text found on no other location page.
   * A ratio can be gamed by paraphrase; a unique-content floor cannot.
   */
  const CEILING = 0.7;

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

  /**
   * Every location page must say something no other location page says.
   *
   * This is what the overlap ceiling was really proxying for, stated
   * directly. A page can only pass by carrying its own researched local
   * note — the shared template contributes nothing here, because template
   * text appears on 150+ pages and is excluded by definition.
   *
   * Measured today: every one of the 153 pages carries between 304 and 682
   * 8-grams found nowhere else, median 404, on pages of roughly 880 total.
   * The floor of 250 sits below the thinnest page so it catches a real
   * regression — a page shipped with the template and no note — rather than
   * flagging normal variation.
   */
  const UNIQUE_FLOOR = 250;

  it("every location page carries content unique to it", () => {
    if (!locs.length) return;
    const grams = new Map<string, Set<string>>();
    for (const { url } of locs) {
      const w = mainText(read(url)).toLowerCase().split(" ");
      const g = new Set<string>();
      for (let i = 0; i + 8 <= w.length; i++) g.add(w.slice(i, i + 8).join(" "));
      grams.set(url, g);
    }
    const seen = new Map<string, number>();
    for (const g of grams.values())
      for (const s of g) seen.set(s, (seen.get(s) ?? 0) + 1);
    const thin: string[] = [];
    for (const [url, g] of grams) {
      let own = 0;
      for (const s of g) if (seen.get(s) === 1) own++;
      if (own < UNIQUE_FLOOR) thin.push(`${url}: ${own} unique 8-grams`);
    }
    expect(
      thin,
      `These location pages are mostly template:\n${thin.join("\n")}\n` +
        `Each needs its own researched local note — what the homes there are ` +
        `actually like and what that means for cleaning them. Do not solve it ` +
        `by paraphrasing the template; that is what the removed copy-spinner did.`,
    ).toEqual([]);
  }, 120_000);
});

describe("the nearby-areas heading names its neighbourhood", () => {
  /**
   * This section used to pick one of six headings and one of six blurbs by
   * hashing the page's path, so the same block read six different ways across
   * 155 pages. The comment in the component said plainly what that was for:
   * fixed copy "pushed three page pairs to 60% raw overlap", and the hash had
   * already been swapped from h*31 to FNV-1a because the old one "put
   * /locations/larkspur-edmonton/ and /locations/schonsee-edmonton/ on the SAME
   * heading and the SAME blurb".
   *
   * It was spun copy — six ways of saying "here are some nearby areas", written
   * to move a metric rather than to tell a reader anything. The same practice
   * was removed from the location template for the same reason.
   *
   * It also bought almost nothing. Measured across all 13,695 location-page
   * pairs before and after removal: worst pair 43.7% -> 43.8%, median 18.9% ->
   * 19.2%, and zero pairs above 60% either way. The rotation was defending a
   * 70% ceiling it was never within 26 points of.
   *
   * Naming the place is strictly better: genuinely different on every page
   * because the place is different, and it does keyword work the old headings
   * never did.
   */
  it("every page with the section heads it with its own place name", () => {
    if (!existsSync(DIST)) return;
    const bad: string[] = [];
    const headings = new Set<string>();
    let withSection = 0;
    for (const { url } of locationUrls()) {
      let html: string;
      try {
        html = read(url);
      } catch {
        continue;
      }
      const m = /<h2 id="nearby-heading"[^>]*>([\s\S]*?)<\/h2>/.exec(html);
      if (!m) continue;
      withSection++;
      const text = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
      headings.add(text);
      const slug = url.replace(/\/+$/, "").split("/").pop()!;
      const first = displayNameFor(slug).split(" ")[0];
      if (first && !text.toLowerCase().includes(first.toLowerCase())) {
        bad.push(`${url}: "${text}" does not name ${first}`);
      }
    }
    expect(
      bad,
      `These nearby-areas headings do not name their own place:\n${bad.join("\n")}\n` +
        `A heading interchangeable between neighbourhoods is spun copy — it was ` +
        `six hash-rotated variants before, and it measurably bought nothing.`,
    ).toEqual([]);
    // A rotation pool would collapse this number; naming the place cannot.
    if (withSection > 20) {
      expect(
        headings.size,
        `${withSection} pages carry the nearby-areas section but only ${headings.size} ` +
          `distinct headings ship. That is a rotation pool, not localized copy.`,
      ).toBeGreaterThan(withSection * 0.8);
    }
  });
});
