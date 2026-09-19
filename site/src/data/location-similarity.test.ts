import { describe, it, expect } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Location pages are measured against each other.
 *
 * AuditSpur's doorway check (scan 1145, 2026-09-18) compares indexable pages by
 * the three-word phrases of their <p> text, after setting aside paragraphs found
 * on 80% of the site, and flags a pair at a Jaccard similarity of 0.5. All 153
 * location pages sat on one band, median 0.47, 44 of them at the bar: the six
 * service-card descriptions and four "why us" descriptions were identical on
 * every page and outweighed each page's own researched copy.
 *
 * The cards are titles and links now (data/location-cards.tsx), which put the
 * highest page at 0.45 and the median at 0.37. This guard repeats the measure on
 * the prerendered build so shared copy cannot creep back. If it fails, the fix is
 * never to hide text, spin variants or write filler: take the shared sentence
 * out, or give the page something true of that place.
 */
const DIST = join(__dirname, "..", "..", "dist");
const MAX_NEAREST = 0.48;
/**
 * The same measure on the Edmonton/Calgary twins of each service page. The two
 * commercial pages sat at 0.58 (AuditSpur, 2026-09-19): each said its scope,
 * vetting, re-clean and written-quote terms three or four times, in the same words
 * as the other. The repeats went; one short statement of each term stays on both,
 * because the terms are the same at both offices. Measured 0.45 after the fix;
 * every other twin is under 0.25.
 */
const MAX_TWIN = 0.48;
const TWINS: Array<[string, string]> = [
  ["/commercial-cleaning/", "/commercial-cleaning-services-calgary/"],
  ["/", "/cleaning-services-calgary/"],
  ["/pricing/", "/calgary/pricing/"],
  ["/services/", "/calgary/services/"],
  ["/move-out-cleaning-edmonton/", "/move-out-cleaning-calgary/"],
  ["/edmonton/deep-cleaning/", "/calgary/deep-cleaning/"],
  ["/edmonton/recurring-cleaning/", "/calgary/recurring-cleaning/"],
  ["/edmonton/airbnb-cleaning/", "/airbnb-cleaning-services-calgary/"],
  ["/post-construction-cleaning/", "/post-construction-cleaning-calgary/"],
  ["/wall-washing-wall-cleaning/", "/wall-washing-wall-cleaning-calgary/"],
];

function pages(): Map<string, string[]> {
  const out = new Map<string, string[]>();
  const walk = (dir: string, url: string) => {
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p, `${url}${entry}/`);
      else if (entry === "index.html") {
        const html = readFileSync(p, "utf-8");
        if (/<meta name="robots" content="noindex/.test(html)) continue;
        const paras = [...html.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)]
          .slice(0, 60)
          .map((m) => m[1].replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").toLowerCase().split(/\s+/).filter(Boolean).join(" "))
          .filter((t) => t.split(" ").length >= 4);
        out.set(url, paras);
      }
    }
  };
  if (existsSync(DIST)) walk(DIST, "/");
  return out;
}

function shingles(text: string): Set<string> {
  const toks = text.match(/[a-z0-9']+/g) ?? [];
  const out = new Set<string>();
  for (let i = 0; i + 3 <= toks.length; i++) out.add(`${toks[i]} ${toks[i + 1]} ${toks[i + 2]}`);
  return out;
}

describe("location pages are not each other with the name swapped", () => {
  it("no location page shares close to half its phrases with another", () => {
    const all = pages();
    if (all.size === 0) return;
    const counts = new Map<string, number>();
    for (const paras of all.values()) for (const t of new Set(paras)) counts.set(t, (counts.get(t) ?? 0) + 1);
    const floor = Math.max(10, Math.floor(0.8 * all.size));
    const sets = [...all.entries()]
      .filter(([url]) => url.startsWith("/locations/"))
      .map(([url, paras]) => [url, shingles(paras.filter((t) => (counts.get(t) ?? 0) < floor).join(" "))] as const);
    expect(sets.length).toBeGreaterThan(150);
    const worst: string[] = [];
    for (let i = 0; i < sets.length; i++) {
      for (let j = i + 1; j < sets.length; j++) {
        const [a, A] = sets[i];
        const [b, B] = sets[j];
        let inter = 0;
        for (const s of A) if (B.has(s)) inter++;
        const sim = inter / (A.size + B.size - inter);
        if (sim >= MAX_NEAREST) worst.push(`${sim.toFixed(3)} ${a} ~ ${b}`);
      }
    }
    expect(
      worst.sort().reverse().slice(0, 15),
      `Location pages within ${MAX_NEAREST} of each other (AuditSpur flags 0.5). ` +
        `Remove the shared sentence or add copy true of the place; never hide text or write filler.`,
    ).toEqual([]);
  });

  it("no Calgary service page is its Edmonton twin with the city swapped", () => {
    const all = pages();
    if (all.size === 0) return;
    const counts = new Map<string, number>();
    for (const paras of all.values()) for (const t of new Set(paras)) counts.set(t, (counts.get(t) ?? 0) + 1);
    const floor = Math.max(10, Math.floor(0.8 * all.size));
    const set = (url: string) => {
      const paras = all.get(url);
      expect(paras, `${url} is not in the build`).toBeDefined();
      return shingles(paras!.filter((t) => (counts.get(t) ?? 0) < floor).join(" "));
    };
    const close: string[] = [];
    for (const [a, b] of TWINS) {
      const A = set(a);
      const B = set(b);
      let inter = 0;
      for (const s of A) if (B.has(s)) inter++;
      const sim = inter / (A.size + B.size - inter);
      if (sim >= MAX_TWIN) close.push(`${sim.toFixed(3)} ${a} ~ ${b}`);
    }
    expect(close, `Twin pages within ${MAX_TWIN} of each other (AuditSpur flags 0.5). Say each term once, or add copy true of the city.`).toEqual([]);
  });
});
