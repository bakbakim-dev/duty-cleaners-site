import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/**
 * Guards the city-twin pages against sliding back into being copies.
 *
 * Nine service pages exist in Edmonton/Calgary pairs. Six of them were
 * near-verbatim duplicates — measured as novel 8-grams AFTER normalising the
 * city name away, so a find-and-replace of "Edmonton" to "Calgary" counts as
 * contributing nothing:
 *
 *     /calgary/pricing/                        3.5%
 *     /calgary/services/                       5.6%
 *     /airbnb-cleaning-services-calgary/       6.6%
 *     /commercial-cleaning-services-calgary/   7.9%
 *     /post-construction-cleaning-calgary/    10.7%
 *     /wall-washing-wall-cleaning-calgary/    11.4%
 *
 * On the Airbnb pair, 5 of 44 sentences differed and every one of those five
 * was a phone number, an address, or the surrounding-towns list. Both URLs in
 * each pair are preserved legacy paths with real ranking history, so neither
 * can be deleted — differentiation is the only available fix, and this keeps it.
 *
 * WHY THE THRESHOLD IS ON WORDS, NOT PERCENT
 * Percentage is the honest measure of how similar two pages read, but it is a
 * bad gate: the pricing pages are dominated by price tables that are IDENTICAL
 * BY DESIGN — prices do not differ by city, and varying them to pass a test
 * would be lying to customers. That drags the percentage down no matter how
 * much real local content the page carries. So the gate is absolute: each page
 * must carry a substantial block of content its twin does not have. The
 * percentage is reported in the failure message for context.
 */

const DIST = join(__dirname, "..", "..", "dist");

/** Every twin pair on the site. Edmonton first. */
const PAIRS: ReadonlyArray<readonly [string, string]> = [
  ["/pricing/", "/calgary/pricing/"],
  ["/services/", "/calgary/services/"],
  ["/edmonton/airbnb-cleaning/", "/airbnb-cleaning-services-calgary/"],
  ["/commercial-cleaning/", "/commercial-cleaning-services-calgary/"],
  ["/post-construction-cleaning/", "/post-construction-cleaning-calgary/"],
  ["/wall-washing-wall-cleaning/", "/wall-washing-wall-cleaning-calgary/"],
  ["/edmonton/deep-cleaning/", "/calgary/deep-cleaning/"],
  ["/edmonton/regular-cleaning/", "/calgary/regular-cleaning/"],
  ["/edmonton/recurring-cleaning/", "/calgary/recurring-cleaning/"],
  ["/move-out-cleaning-edmonton/", "/move-out-cleaning-calgary/"],
  ["/", "/cleaning-services-calgary/"],
];

/**
 * The lowest novel-8-gram count any pair carried after the differentiation
 * pass was 289 (/calgary/pricing/, the most table-dominated page on the list).
 * 200 leaves room for ordinary copy edits while still failing loudly if a
 * page's local content is deleted or a new twin ships as a straight copy.
 */
const MIN_NOVEL_NGRAMS = 200;

/** Visible text inside <main>, with scripts and markup stripped. */
function mainText(url: string): string | null {
  const path = url === "/" ? join(DIST, "index.html") : join(DIST, url.replace(/^\/|\/$/g, ""), "index.html");
  if (!existsSync(path)) return null;
  const raw = readFileSync(path, "utf-8").replace(/<script[\s\S]*?<\/script>/g, " ");
  const main = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(raw);
  return (main ? main[1] : raw).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

/** City names collapse to one token, so swapping them earns no credit. */
const normalize = (s: string) => s.toLowerCase().replace(/edmonton|calgary|alberta/g, "city");

const ngrams = (words: string[], n = 8) => {
  const out = new Set<string>();
  for (let i = 0; i + n <= words.length; i++) out.add(words.slice(i, i + n).join(" "));
  return out;
};

describe("city twin pages are not copies of each other", () => {
  for (const [edmonton, calgary] of PAIRS) {
    it(`${calgary} says something ${edmonton} does not`, () => {
      const a = mainText(edmonton);
      const b = mainText(calgary);
      if (a === null || b === null) return; // nothing to check before a prerender

      const wordsA = normalize(a).split(" ");
      const wordsB = normalize(b).split(" ");
      const gramsA = ngrams(wordsA);
      const gramsB = ngrams(wordsB);
      const novel = [...gramsB].filter((g) => !gramsA.has(g));
      const percent = ((novel.length / Math.max(gramsB.size, 1)) * 100).toFixed(1);

      expect(
        novel.length,
        `${calgary} carries only ${novel.length} novel 8-grams vs ${edmonton} (${percent}% of the page). ` +
          `It reads as a find-and-replace copy. Add content true of this city and not the other — ` +
          `weather, geography, building stock, the events calendar, licensing. See LocalMarketNote.`,
      ).toBeGreaterThanOrEqual(MIN_NOVEL_NGRAMS);
    });
  }
});
