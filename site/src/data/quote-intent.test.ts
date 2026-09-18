import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * A quote CTA that advertises a price must open the funnel at that price.
 *
 * The five Deep Cleaning tier cards on /pricing/ and the five on
 * /calgary/pricing/ ship `href="/#quote&intent=deep"`. The overlay interceptor
 * preventDefaults every #quote click and used to read the intent ONLY from a
 * `data-quote-intent` attribute — which no page in the build has ever carried.
 * So the intent was dropped on all ten: click a card reading "$255 — $155
 * standard + $100 Deep Cleaning package" and the funnel quotes $155, the deep
 * package falls back to an optional add-on, and the CRM lead records no intent.
 *
 * Because preventDefault also stops the URL changing, QuoteFlow's own
 * URLSearchParams read never saw it either — there was no second chance.
 *
 * Two halves, and both are needed: the CTAs must still exist (or this guard
 * silently passes on an empty set), and the interceptor must still read the
 * channel they actually use.
 */


/** Source with comments stripped — a guard must test code, not prose. */
function codeOf(path: string): string {
  return readFileSync(path, "utf-8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
}

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

function builtPages(): string[] {
  if (!existsSync(DIST)) return [];
  const out: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      if (statSync(full).isDirectory()) walk(full);
      else if (entry === "index.html") out.push(full);
    }
  };
  walk(DIST);
  return out;
}

describe("quote CTAs carry their intent into the funnel", () => {
  it("the deep-clean CTAs still ship with the intent in their href", () => {
    const pages = builtPages();
    if (!pages.length) return; // unbuilt tree
    const withDeepCta = pages.filter((p) => readFileSync(p, "utf-8").includes("#quote&amp;intent=deep"));
    expect(
      withDeepCta.length,
      "no page ships a deep-intent quote CTA any more; re-point this guard at whatever replaced them",
    ).toBeGreaterThan(0);
  });

  it("the interceptor reads the intent from the href, not only a data attribute", () => {
    const src = codeOf(join(ROOT, "src", "hooks", "use-quote-overlay.tsx"));
    // It may also read the data attribute — that is fine, and some CTAs use it.
    // What it must not do is read ONLY that, because the shipped CTAs do not.
    // Comments are stripped first: the first version of this guard matched the
    // word "intent=deep" inside its own explanatory comment and passed against
    // a reverted interceptor.
    expect(
      /intent=deep/.test(src),
      "use-quote-overlay no longer inspects the href for intent=deep, so the ten deep-clean " +
        "CTAs on the two pricing pages will silently quote the standard tier again",
    ).toBe(true);
  });

  it("every intent-bearing quote CTA uses a channel the interceptor can read", () => {
    const pages = builtPages();
    if (!pages.length) return;
    const src = codeOf(join(ROOT, "src", "hooks", "use-quote-overlay.tsx"));
    const readsHref = /intent=deep/.test(src);
    const readsAttr = /dataset\.quoteIntent/.test(src);

    const orphaned: string[] = [];
    for (const page of pages) {
      const html = readFileSync(page, "utf-8");
      for (const m of html.matchAll(/<a\b[^>]*href="([^"]*#quote)"[^>]*>/g)) {
        const tag = m[0];
        const href = m[1];
        if (!/[?&]intent=/.test(href)) continue; // no intent to lose
        const ok = (readsHref) || (readsAttr && /data-quote-intent=/.test(tag));
        if (!ok) orphaned.push(`${page.replace(DIST, "")} -> ${href}`);
      }
    }
    expect(
      orphaned.slice(0, 5),
      `${orphaned.length} quote CTA(s) carry an intent the overlay will discard`,
    ).toEqual([]);
  });
});
