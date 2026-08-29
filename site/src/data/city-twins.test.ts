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

/**
 * BOTH directions are measured. The original guard only asked whether the
 * Calgary page said something Edmonton's did not - which let the Edmonton
 * sides of the deep-cleaning and recurring pairs sit at 191 and 196 novel
 * 8-grams (below threshold) without any test noticing, because Calgary had
 * been given bespoke local copy while Edmonton kept the generic base text.
 * A twin relationship is symmetric; the guard now is too.
 */
describe("city twin pages are not copies of each other", () => {
  const novelCount = (from: Set<string>, vs: Set<string>) => [...from].filter((g) => !vs.has(g)).length;

  for (const [edmonton, calgary] of PAIRS) {
    for (const [page, twin] of [
      [calgary, edmonton],
      [edmonton, calgary],
    ] as const) {
      it(`${page} says something ${twin} does not`, () => {
        const a = mainText(twin);
        const b = mainText(page);
        if (a === null || b === null) return; // nothing to check before a prerender

        const gramsTwin = ngrams(normalize(a).split(" "));
        const gramsPage = ngrams(normalize(b).split(" "));
        const novel = novelCount(gramsPage, gramsTwin);
        const percent = ((novel / Math.max(gramsPage.size, 1)) * 100).toFixed(1);

        expect(
          novel,
          `${page} carries only ${novel} novel 8-grams vs ${twin} (${percent}% of the page). ` +
            `It reads as a find-and-replace copy. Add content true of this city and not the other - ` +
            `weather, geography, building stock, the events calendar, licensing. See LocalMarketNote.`,
        ).toBeGreaterThanOrEqual(MIN_NOVEL_NGRAMS);
      });
    }
  }
});

/**
 * The homepage and /cleaning-services-calgary/ are the two conversion hubs.
 * They share the pricing tables, the what's-included checklist, and the quote
 * funnel BY DESIGN - funnel parity means a Calgary visitor gets the same
 * decision-grade information as an Edmonton one, and faking differences in
 * prices or scope to look "unique" would be lying to one city or the other.
 *
 * Measured RAW (no city-name normalisation), the pair sat at 76.1% 8-gram
 * overlap-of-smaller after the localization pass. That is acceptable for a
 * hub pair whose canonical/title/H1/schema/FAQ/testimonials/neighbourhood
 * content all differ - but it must not creep back toward a clone. The ceiling
 * fails the build if shared chapters grow or a city-specific chapter is
 * deleted.
 */
describe("hub pair raw similarity ceiling", () => {
  it("/ vs /cleaning-services-calgary/ stays under 78% raw 8-gram overlap", () => {
    const a = mainText("/");
    const b = mainText("/cleaning-services-calgary/");
    if (a === null || b === null) return; // nothing to check before a prerender

    const gramsA = ngrams(a.toLowerCase().split(" "));
    const gramsB = ngrams(b.toLowerCase().split(" "));
    const smaller = gramsA.size <= gramsB.size ? gramsA : gramsB;
    const larger = gramsA.size <= gramsB.size ? gramsB : gramsA;
    let shared = 0;
    for (const g of smaller) if (larger.has(g)) shared++;
    const overlap = (shared / Math.max(smaller.size, 1)) * 100;

    expect(
      overlap,
      `Homepage and the Calgary hub share ${overlap.toFixed(1)}% of raw 8-grams ` +
        `(ceiling 78%). The shared funnel chapters are by-design, but this much ` +
        `overlap means city-specific chapters shrank or new shared copy was added. ` +
        `Differentiate the new material per city before raising this ceiling.`,
    ).toBeLessThanOrEqual(78);
  });
});
