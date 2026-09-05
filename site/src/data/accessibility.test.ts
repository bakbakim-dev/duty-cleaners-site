import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Accessibility guards, from the six-dimension site audit.
 *
 * Most of what was checked was already clean and is pinned in onpage-seo.test.ts
 * (alt text) or was verified by measurement rather than assertion (contrast on
 * real computed styles across four page types, zero links or buttons without an
 * accessible name, one <main> and a skip link on every page). The two things
 * below were real failures, and both are invisible to anything that only reads
 * the built HTML for structure.
 */

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

function pages(): Array<{ url: string; html: string }> {
  if (!existsSync(DIST)) return [];
  const out: Array<{ url: string; html: string }> = [];
  const walk = (dir: string, url: string) => {
    let entries: string[];
    try {
      entries = readdirSync(dir);
    } catch {
      return;
    }
    if (entries.includes("index.html")) {
      out.push({ url, html: readFileSync(join(dir, "index.html"), "utf-8") });
    }
    for (const e of entries) {
      const p = join(dir, e);
      try {
        if (statSync(p).isDirectory()) walk(p, `${url}${e}/`);
      } catch {
        /* skip */
      }
    }
  };
  walk(DIST, "/");
  return out;
}

describe("links in prose are not distinguished by colour alone", () => {
  /**
   * WCAG 1.4.1 is a Level A criterion: a link inside a block of text has to be
   * tellable from the text by something other than its colour, unless the two
   * differ by at least 3:1.
   *
   * Measured on the deployed page: the link colour is rgb(194, 62, 10) and the
   * body text around it rgb(98, 112, 132) — a contrast of 1.05:1, which is to
   * say the same apparent lightness in two hues. With `hover:underline` there
   * was no underline, no border and no weight change until the pointer arrived,
   * so on a static page, to a colourblind reader, or on a poor screen, the link
   * simply was not there.
   *
   * 17 call sites carried the bare `text-accent hover:underline`, one of them in
   * LocationPricing which renders on 153 location pages. Bold accent CTAs are a
   * different case and are left alone: weight is itself a non-colour indicator.
   */
  it("no prose link relies on hover for its underline", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      for (const m of html.matchAll(/<a\b[^>]*class="([^"]*)"[^>]*>/g)) {
        const cls = m[1];
        // Token-wise, not by substring. A regex for \bunderline\b also matches
        // inside "hover:underline" — which is the very thing being looked for,
        // so the first version of this check skipped every case it existed to
        // catch and passed while the defect was still on the page.
        const tokens = cls.split(/\s+/);
        // Any link colour, not one named token. Keying this on "text-accent"
        // is what let 357 landmark links on 86 location pages through: they use
        // text-primary, measure 1.02:1 against the prose around them, and were
        // the same failure under a different colour. The behaviour is the rule,
        // not the palette entry.
        if (!tokens.some((t) => /^text-(accent|primary|secondary|brand-[a-z]+)$/.test(t))) continue;
        if (tokens.includes("underline")) continue; // persistent underline
        if (tokens.some((t) => t === "font-semibold" || t === "font-bold")) continue; // weight distinguishes it
        // 1.4.1 is about a link *inside a block of text*. A flex row is its own
        // line — the contact links on /satisfaction-guarantee/ are one per row
        // with a phone icon beside them, which is both a different layout and a
        // non-colour cue. Those are not the failure; a link mid-sentence is.
        if (
          tokens.some(
            (t) => t === "inline-flex" || t === "flex" || t === "inline-block" || t === "rounded-full",
          )
        )
          continue;
        if (tokens.some((t) => t === "hover:underline")) bad.push(`${url}: class="${cls.slice(0, 70)}"`);
      }
    }
    expect(
      [...new Set(bad)].slice(0, 20),
      `These links are distinguishable from the text around them only by colour:\n${[...new Set(bad)].slice(0, 20).join("\n")}\n` +
        `Link and body text measure 1.05:1 against each other. Use ` +
        `"text-accent underline underline-offset-2" so the underline is there ` +
        `before the pointer is.`,
    ).toEqual([]);
  });
});

describe("map markers have an accessible name", () => {
  /**
   * Leaflet gives every marker keyboard focus by default and renders it as
   * role="button". Without `alt` or `title` that is a focusable control with no
   * accessible name — a screen reader announces "button" and stops.
   *
   * This cannot be caught by reading dist: Leaflet renders client-side, so the
   * marker does not exist in the prerendered HTML at all. The guard reads the
   * source instead.
   *
   * The three multi-pin service-area maps are a deliberate and different
   * choice — they set `interactive: false, keyboard: false` and expose the same
   * list as text below the map, so their pins are decoration and stay out of
   * the tab order. Those are allowed here.
   */
  it("every focusable marker is named", () => {
    const dir = join(ROOT, "src", "components");
    if (!existsSync(dir)) return;
    const bad: string[] = [];
    for (const file of readdirSync(dir)) {
      if (!file.endsWith(".tsx")) continue;
      const src = readFileSync(join(dir, file), "utf-8");
      // Each L.marker(...) call up to its closing brace-paren.
      for (const m of src.matchAll(/L\.marker\(([\s\S]{0,400}?)\)\s*\n?\s*\./g)) {
        const opts = m[1];
        const named = /\balt:/.test(opts) || /\btitle:/.test(opts) || /aria-label/.test(opts);
        const optedOut = /keyboard:\s*false/.test(opts) && /interactive:\s*false/.test(opts);
        if (!named && !optedOut) {
          bad.push(`${file}: a marker with neither a name nor keyboard:false + interactive:false`);
        }
      }
    }
    expect(
      [...new Set(bad)],
      `Focusable map markers with no accessible name:\n${[...new Set(bad)].join("\n")}\n` +
        `Pass alt/title when creating the marker, or opt it out of the tab ` +
        `order with interactive:false + keyboard:false the way the ` +
        `service-area maps do.`,
    ).toEqual([]);
  });
});
