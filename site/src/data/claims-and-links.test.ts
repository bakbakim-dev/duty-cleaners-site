import { describe, it, expect } from "vitest";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { addOnFromPrice, formatPrice } from "./pricing";
import { TRAVEL_FEE_KEY } from "./addon-table";

/**
 * Guards for the defects the v2 audit found — every one of which survived six
 * prior rounds because the existing guard was VACUOUS against it.
 *
 * The pattern worth naming: a guard that asserts a phrase EXISTS cannot catch a
 * wrong number inside that phrase. llms-txt.test.ts asserted "travel fee"
 * appeared next to prices; both llms files then said $99 for eighteen months of
 * commits while the authority and all 19 town pages said $29.99. The test was
 * green the entire time.
 *
 * So these assert VALUES against their source of truth, not the presence of
 * words.
 */

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

function distPages(): string[] {
  if (!existsSync(DIST)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === "index.html") out.push(p);
    }
  };
  walk(DIST);
  return out;
}

const pages = distPages();
const read = (p: string) => readFileSync(p, "utf-8");
const rel = (p: string) => p.replace(ROOT, "").replace(/\\/g, "/");

/** Visible text of a page, scripts stripped. */
function visible(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ");
}

describe("the travel fee states one number, everywhere", () => {
  const fee = addOnFromPrice("standard", TRAVEL_FEE_KEY);

  it("the authority still defines it", () => {
    expect(fee).not.toBeNull();
  });

  /**
   * $99 was a misreading of a truncated "$29.99" grep hit. The number now has
   * to match bk-config on every surface that states one — including the two
   * machine-reader files, which is where the wrong figure survived.
   */
  it("every surface quoting a travel fee quotes the authority's amount", () => {
    if (fee === null) return;
    const expected = formatPrice(fee); // "$29.99"
    const surfaces: Array<[string, string]> = [
      ["public/llms.txt", readFileSync(join(ROOT, "public", "llms.txt"), "utf-8")],
      ["public/llms-full.txt", readFileSync(join(ROOT, "public", "llms-full.txt"), "utf-8")],
      ...pages.map((p) => [rel(p), visible(read(p))] as [string, string]),
    ];
    const wrong: string[] = [];
    for (const [name, text] of surfaces) {
      const allAmounts = [...text.matchAll(/\$[\d,]+(?:\.\d{2})?/g)].map((m) => ({
        value: m[0],
        index: m.index!,
      }));
      // Work per SENTENCE, not per character window.
      //
      // Two instrument bugs were found writing this guard, both of which made
      // it silently green while llms.txt said $99:
      //   1. a 60-char lookahead matched an unrelated add-on row sitting above
      //      the travel-fee row in the pricing table (false positive), and
      //   2. a 120-char post-construction exclusion swallowed the real check,
      //      because the bullet directly above the travel-fee line happens to
      //      read "Post-Construction and Airbnb cleaning: quoted by scope"
      //      (false negative — the dangerous kind).
      // Sentence scope fixes both: post-construction only excuses a figure when
      // it is the subject of the SAME sentence.
      // Sentence scope decides WHETHER to check; tight proximity decides WHICH
      // amount is the fee. Sentence scope alone over-fires on the pricing
      // tables, whose stripped text is one unbroken run — every add-on price
      // then looks like it belongs to the travel-fee row.
      for (const phrase of text.matchAll(/travel fee/gi)) {
        const i = phrase.index!;
        const sentence = (() => {
          const start = Math.max(
            text.lastIndexOf(". ", i) + 1,
            text.lastIndexOf("\n", i) + 1,
            0,
          );
          const dot = text.indexOf(". ", i);
          const nl = text.indexOf("\n", i);
          const end = Math.min(dot === -1 ? text.length : dot, nl === -1 ? text.length : nl);
          return text.slice(start, end);
        })();
        if (/post-construction/i.test(sentence)) continue; // its own, larger extra
        // Match amounts against the FULL text and filter by position, rather
        // than slicing a window and matching inside it — slicing cut "$29.99"
        // in half at the boundary and reported the fragment "$29" as a
        // mismatch. Two instrument bugs in this one check; both were caught by
        // running it against a known-good build before trusting it.
        //
        // The fee sits immediately beside the phrase in either order:
        // "a $29.99 travel fee" (9 before) or "(travel fee) $29.99" (2 after).
        // The bound stays tight because at ±25 it reached into the previous row
        // of the add-on table and flagged a neighbouring add-on.
        const end = i + "travel fee".length;
        for (const a of allAmounts) {
          if (a.index < i - 12 || a.index > end + 12) continue;
          if (a.value !== expected) wrong.push(`${name}: ${a.value} (expected ${expected})`);
        }
      }
    }
    expect([...new Set(wrong)], "a travel-fee amount disagrees with bk-config").toEqual([]);
  });
});

describe("retired claims stay retired on every rendered page", () => {
  /**
   * Each of these was removed once and came back — or was never fully removed
   * because the sweep matched one spelling. "five-star" was fixed while
   * "5-Star Rated" shipped on four pages for another round.
   */
  const FORBIDDEN: Array<[RegExp, string]> = [
    [/\b(?:5|five)[-\s]star\s+rated\b/i, 'rounds the sourced 4.9 up — use RATING_CLAIM'],
    [/non-?toxic/i, "unsubstantiated product-safety claim (s.74.01(b.1))"],
    [/\bsafe,\s*green\s+cleaning\s+products\b/i, "untested product-safety + green claim"],
    [/\bgreen\s+cleaning\s+products\s+perfect\b/i, "untested product-safety + green claim"],
    [/\blicen[sc]ed\b/i, "no licence field exists in proof.ts"],
    [/\bbonded\b/i, "retired 'licensed, insured and bonded' claim"],
    [/100%\s*stress-free/i, "invented guarantee name with no policy behind it"],
  ];

  for (const [pattern, why] of FORBIDDEN) {
    it(`no page claims /${pattern.source}/ — ${why}`, () => {
      if (!pages.length) return;
      const hits = pages
        .filter((p) => pattern.test(visible(read(p))))
        .map(rel);
      expect(hits.slice(0, 12)).toEqual([]);
    });
  }
});

describe("internal links use the canonical trailing-slash form", () => {
  /**
   * 10,227 of 11,949 internal links (85.6%) used the slash-less form on a
   * trailing-slash-canonical site: every one a 301 hop at the host, and every
   * anchor disagreeing with its target's own <link rel="canonical">. Six audit
   * rounds missed it because each surface was slash-correct in isolation —
   * nobody measured the anchor layer, so nothing tested it.
   */
  it("no page links to an indexable path without the trailing slash", () => {
    if (!pages.length) return;
    const offenders: string[] = [];
    for (const p of pages) {
      for (const m of read(p).matchAll(/href="(\/[^"]*)"/g)) {
        const base = m[1].split(/[?#]/)[0];
        if (base === "/" || base.endsWith("/")) continue;
        if (/\.[a-z0-9]{2,5}$/i.test(base)) continue; // /llms.txt, /logo.png, fonts
        offenders.push(`${rel(p)} -> ${m[1]}`);
      }
    }
    expect(offenders.slice(0, 15), `${offenders.length} slash-less internal links`).toEqual([]);
  });
});

describe("shipped copy is free of the garbled legacy lines", () => {
  const RELICS = [
    "outside AC outlet panels", // shipped on 157 pages, inside FAQPage JSON-LD
    "customer-rated, and customer-rated",
    "confirm completion by phone 30 minutes before we finish",
  ];
  for (const relic of RELICS) {
    it(`"${relic}" is gone`, () => {
      if (!pages.length) return;
      expect(pages.filter((p) => read(p).includes(relic)).map(rel)).toEqual([]);
    });
  }
});
