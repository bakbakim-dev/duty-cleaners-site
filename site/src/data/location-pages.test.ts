import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * Guards the 153 location pages against the four ways they were failing.
 *
 * These pages are the site's long tail and nobody reads them end to end, so
 * every one of these regressed quietly and stayed regressed:
 *
 *   54 of 153 titles ran past 60 characters, so Google truncated the brand off
 *      the end. Concentrated in "House Cleaning Services in X, Edmonton |
 *      Duty Cleaners" at 61-62.
 *
 *   12 meta descriptions ran 199-403 characters — 1.2x to 2.5x the limit —
 *      because LocationPageTemplate used one `description` prop for both the
 *      hero blurb and the meta tag, and a hero blurb is written as prose.
 *
 *  138 of 153 showed no price at all, and the split was exactly inverted: the
 *      only 15 that quoted a figure were the most templated pages on the site,
 *      while the 138 with real local content sent every visitor to a form.
 *
 *    4 emitted no BreadcrumbList, having never mounted <Breadcrumbs>.
 *
 * Everything here reads the PRERENDERED output rather than the source, because
 * that is what a crawler sees, and three of the four bugs were invisible in the
 * source (a prop reused for two jobs, a component nobody mounted, a price
 * helper nobody called).
 */

const DIST = join(__dirname, "..", "..", "dist");
const LIMIT_TITLE = 60;
const DESC_MIN = 70;
const DESC_MAX = 160;

function locationUrls(): string[] {
  if (!existsSync(DIST)) return [];
  const out: string[] = [];
  for (const f of readdirSync(DIST).filter((n) => /^sitemap-locations-.*\.xml$/.test(n))) {
    const xml = readFileSync(join(DIST, f), "utf-8");
    for (const m of xml.matchAll(/<loc>https:\/\/dutycleaners\.ca(\/[^<]*)<\/loc>/g)) out.push(m[1]);
  }
  return out;
}

const read = (url: string) => readFileSync(join(DIST, url.replace(/^\/|\/$/g, ""), "index.html"), "utf-8");

/** Visible text inside <main>, markup and scripts stripped. */
function mainText(html: string): string {
  const raw = html.replace(/<script[\s\S]*?<\/script>/g, " ");
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(raw);
  return (m ? m[1] : raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

const decode = (s: string) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const urls = locationUrls();

describe("location pages", () => {
  it("the sitemaps actually list them", () => {
    if (!existsSync(DIST)) return;
    expect(urls.length).toBeGreaterThan(140);
  });

  it("every title fits inside 60 characters", () => {
    // &amp; counts as one character to a reader and five to a naive length
    // check — measuring the raw HTML is how six main-page titles were once
    // "fixed" that were never too long.
    const over = urls
      .map((u) => {
        const m = /<title[^>]*>([\s\S]*?)<\/title>/.exec(read(u));
        const t = m ? decode(m[1].replace(/\s+/g, " ").trim()) : "";
        return { u, t, len: t.length };
      })
      .filter((r) => r.len > LIMIT_TITLE);
    expect(over.map((r) => `${r.len} ${r.u} — ${r.t}`), "titles Google will truncate").toEqual([]);
  });

  it("every meta description fits inside 160 characters", () => {
    const bad = urls
      .map((u) => {
        const m = /<meta name="description"[^>]*content="([^"]*)"/.exec(read(u));
        const d = m ? decode(m[1].trim()) : "";
        return { u, len: d.length };
      })
      .filter((r) => r.len > DESC_MAX || r.len < DESC_MIN);
    expect(bad.map((r) => `${r.len} ${r.u}`), "descriptions outside 70-160").toEqual([]);
  });

  it("every page states a price", () => {
    // Prices do not vary by neighbourhood, so there is no reason for a page to
    // withhold one. <LocationPricing> derives every figure from bk-config.
    const silent = urls.filter((u) => !/\$\d/.test(mainText(read(u))));
    expect(silent, "location pages that quote no price at all").toEqual([]);
  });

  it("every page emits BreadcrumbList", () => {
    const missing = urls.filter((u) => !/"BreadcrumbList"/.test(read(u)));
    expect(missing, "location pages with no BreadcrumbList").toEqual([]);
  });

  /**
   * A satellite town is charged a mandatory travel fee applied by postal code.
   * Advertising a headline rate on that town's page while omitting the fee is
   * drip pricing under Competition Act s.74.01(1.1), which turns on the effect
   * rather than the intent. The price and the fee line must ship together.
   */
  it("any page for a place outside the two metros discloses the travel fee", () => {
    const towns = urls.filter((u) => /^\/cleaning-services-/.test(u));
    if (!towns.length) return;
    const undisclosed = towns.filter((u) => {
      const t = mainText(read(u));
      return /\$\d/.test(t) && !/travel fee/i.test(t);
    });
    expect(undisclosed, "priced satellite-town pages with no travel-fee disclosure").toEqual([]);
  });
});

/**
 * The doorway-page guard.
 *
 * Thirteen pages shared LocationPageTemplate and varied by name plus one
 * blurb. Measured as novel 8-grams against the union of every sibling location
 * page — with the page's own place name normalised away, so a find-and-replace
 * earns nothing — they scored a median of 37 and a floor of 14 (Laurel), while
 * the 140 hand-written pages sat at 116-158.
 *
 * The floor is set at 50: comfortably under the current worst page (57) so
 * ordinary copy edits do not trip it, and far above the 14-48 band the
 * templated pages occupied, so a new page shipped as a straight copy fails.
 */
describe("location pages are not copies of each other", () => {
  /**
   * Raised from 50 after the doorway-floor pass of 2026-08-29: 41 pages in the
   * 65-115 band received a LocalMarketNote each (housing era, geography, and
   * their cleaning consequences, distinctly worded per page), lifting the
   * measured floor from 65 to 120 and the median from 142 to 195. 100 leaves
   * room for ordinary copy edits below the real floor while still failing any
   * page that ships as a find-and-replace of its siblings — the old floor of
   * 50 would have passed pages the site now considers templated.
   */
  const MIN_NOVEL = 100;

  it("no page is a find-and-replace of its siblings", () => {
    if (!urls.length) return;
    const norm = (text: string, url: string) => {
      const slug = url.replace(/\/+$/, "").split("/").pop()!.replace(/^cleaning-services-/, "");
      let out = text.toLowerCase();
      for (const tok of slug.split("-")) if (tok.length > 3) out = out.split(tok).join("place");
      return out.replace(/edmonton|calgary|alberta/g, "city");
    };
    const grams = (t: string) => {
      const w = t.split(" ");
      const s = new Set<string>();
      for (let i = 0; i + 8 <= w.length; i++) s.add(w.slice(i, i + 8).join(" "));
      return s;
    };
    const byUrl = new Map(urls.map((u) => [u, grams(norm(mainText(read(u)), u))]));
    const thin: string[] = [];
    for (const u of urls) {
      const mine = byUrl.get(u)!;
      let novel = 0;
      for (const g of mine) {
        let seen = false;
        for (const v of urls) {
          if (v === u) continue;
          if (byUrl.get(v)!.has(g)) { seen = true; break; }
        }
        if (!seen) novel++;
      }
      if (novel < MIN_NOVEL) thin.push(`${u} (${novel} novel 8-grams)`);
    }
    expect(
      thin,
      "these read as templated copies. Give each one content true of that place " +
        "and not its siblings — housing era and layout, what the location does to a " +
        "home, the seasonal load. See the localNote prop on LocationPageTemplate.",
    ).toEqual([]);
  });
});
