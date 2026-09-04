import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * On-page SEO guards, from the full audit of the built site.
 *
 * These run against dist/, which is what a crawler receives — not the source
 * and not the SPA shell. Most of them were already clean when the audit ran and
 * are pinned here so they stay that way: no page was missing a title, a meta
 * description, an H1, a canonical, og:title/og:image, lang or viewport; none had
 * a duplicate title or description; none had two H1s or an empty heading; no
 * image was missing an alt attribute.
 *
 * Two were not clean, and are the reason the width checks exist. Google trims a
 * snippet on RENDERED WIDTH, not character count, so a description of 157
 * characters is not automatically safe and one of 143 is not automatically
 * unsafe — "Illinois" and "WWWWWWWW" are both eight characters and nothing
 * like the same width. 64 descriptions and 2 titles were past the line, all of
 * them between 143 and 160 characters, and the cut landed mid-word: "Get an
 * instant q…". Nine lost a phone number or a specific claim.
 *
 * The width model below is the same one the audit used. It is an approximation
 * of Arial and it is deliberately a little generous, because the point is to
 * catch a description that has drifted well past the line, not to litigate the
 * last ten pixels.
 */

const DIST = join(__dirname, "..", "..", "dist");

/** Approximate rendered width, in pixels, at the given font size. */
const NARROW = "ijl.,;:'!|[]()t fIr";
const WIDE = "MWmw@";
function width(text: string, size: number): number {
  let total = 0;
  for (const ch of text) {
    if (NARROW.includes(ch)) total += 0.3;
    else if (WIDE.includes(ch)) total += 0.86;
    else if (ch !== ch.toLowerCase() && ch === ch.toUpperCase()) total += 0.68;
    else total += 0.52;
  }
  return total * size;
}

/** Google's desktop limits, with a little headroom on each. */
const TITLE_PX = 600;
const DESC_PX = 960;

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

const noScripts = (s: string) => s.replace(/<script[\s\S]*?<\/script>/g, " ");

function unescapeHtml(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;|&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ");
}

/**
 * Read an attribute with the quote character MATCHED. Reading to the next quote
 * of either kind truncates every value containing an apostrophe, which made
 * four of this site's descriptions look 16 characters long during the audit.
 */
function attr(tag: string, name: string): string | null {
  const m = new RegExp(`${name}=(["'])([\\s\\S]*?)\\1`).exec(tag);
  return m ? unescapeHtml(m[2]) : null;
}

const titleOf = (html: string) => {
  const m = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html);
  return m ? unescapeHtml(m[1]).trim() : null;
};

const descOf = (html: string) => {
  const m = /<meta[^>]+name=["']description["'][^>]*>/i.exec(html);
  return m ? attr(m[0], "content") : null;
};

describe("on-page SEO", () => {
  it("every page has exactly one title, one description and one H1", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      const s = noScripts(html);
      const titles = s.match(/<title[^>]*>/gi) ?? [];
      const descs = s.match(/<meta[^>]+name=["']description["'][^>]*>/gi) ?? [];
      const h1s = s.match(/<h1\b[^>]*>/gi) ?? [];
      if (titles.length !== 1) bad.push(`${url}: ${titles.length} <title>`);
      if (descs.length !== 1) bad.push(`${url}: ${descs.length} meta descriptions`);
      if (h1s.length !== 1) bad.push(`${url}: ${h1s.length} <h1>`);
    }
    expect(bad, `Pages without exactly one of each:\n${bad.join("\n")}`).toEqual([]);
  });

  it("no two pages share a title or a description", () => {
    const byTitle = new Map<string, string[]>();
    const byDesc = new Map<string, string[]>();
    for (const { url, html } of pages()) {
      const t = titleOf(html);
      const d = descOf(html);
      if (t) byTitle.set(t, [...(byTitle.get(t) ?? []), url]);
      if (d) byDesc.set(d, [...(byDesc.get(d) ?? []), url]);
    }
    const dupes: string[] = [];
    for (const [t, us] of byTitle) if (us.length > 1) dupes.push(`title "${t.slice(0, 60)}" on ${us.join(", ")}`);
    for (const [d, us] of byDesc) if (us.length > 1) dupes.push(`description "${d.slice(0, 60)}" on ${us.join(", ")}`);
    expect(
      dupes,
      `Duplicated across pages:\n${dupes.join("\n")}\n` +
        `Two pages with the same title are two pages competing for the same query.`,
    ).toEqual([]);
  });

  it("titles and descriptions fit the width Google gives a snippet", () => {
    const over: string[] = [];
    for (const { url, html } of pages()) {
      const t = titleOf(html);
      const d = descOf(html);
      if (t && width(t, 20) > TITLE_PX) over.push(`${url}: title ~${Math.round(width(t, 20))}px — "${t}"`);
      if (d && width(d, 14) > DESC_PX) over.push(`${url}: description ~${Math.round(width(d, 14))}px — "${d}"`);
    }
    expect(
      over,
      `These are cut off in results:\n${over.join("\n")}\n` +
        `Google trims on rendered width, not character count. The cut lands ` +
        `mid-word, and whatever the sentence ended with is what gets lost — ` +
        `which is where a phone number or "we re-clean it within 24 hours" went.`,
    ).toEqual([]);
  });

  it("headings are non-empty and do not skip a level", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      const heads: Array<{ level: number; text: string }> = [];
      for (const m of noScripts(html).matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
        const text = unescapeHtml(m[2].replace(/<svg[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " "))
          .replace(/\s+/g, " ")
          .trim();
        heads.push({ level: Number(m[1]), text });
      }
      let prev: number | null = null;
      for (const { level, text } of heads) {
        if (!text) bad.push(`${url}: empty <h${level}>`);
        if (prev !== null && level > prev + 1) {
          bad.push(`${url}: h${prev} -> h${level} ("${text.slice(0, 40)}")`);
          break;
        }
        prev = level;
      }
    }
    expect(
      bad,
      `Heading structure problems:\n${bad.join("\n")}\n` +
        `An empty heading is a heading with nothing to say; a skipped level ` +
        `breaks the outline a screen reader and a crawler both read.`,
    ).toEqual([]);
  });

  it("no heading splits a word across a <br>", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      for (const m of noScripts(html).matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)) {
        // No whitespace on EITHER side is the defect — "Cleaning<br>Services"
        // reads as "CleaningServices" to anything that strips tags without
        // substituting a space. "Commercial Cleaning <br>Services" is fine and
        // is how this site's headings are written.
        const hit = /(\w)<br\s*\/?>(\w)/i.exec(m[2]);
        if (hit) bad.push(`${url}: h${m[1]} …${hit[1]}|${hit[2]}…`);
      }
    }
    expect(bad, `Headings with a word split across a <br>:\n${bad.join("\n")}`).toEqual([]);
  });

  it("every image carries an alt attribute", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      for (const m of noScripts(html).matchAll(/<img\b([^>]*)>/gi)) {
        if (attr(m[1], "alt") === null) bad.push(`${url}: ${(attr(m[1], "src") ?? "?").slice(0, 60)}`);
      }
    }
    expect(
      bad,
      `Images with no alt attribute:\n${bad.join("\n")}\n` +
        `An alt is how the image is described to a screen reader and how it ` +
        `earns a place in image search. Decorative images take alt="".`,
    ).toEqual([]);
  });

  it("every page has a canonical, og:title, og:image, lang and viewport", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      const s = noScripts(html);
      const canonicals = s.match(/<link[^>]+rel=["']canonical["'][^>]*>/gi) ?? [];
      if (canonicals.length !== 1) bad.push(`${url}: ${canonicals.length} canonical tags`);
      if (!/property=["']og:title["']/i.test(s)) bad.push(`${url}: no og:title`);
      if (!/property=["']og:image["']/i.test(s)) bad.push(`${url}: no og:image`);
      if (!/<html[^>]+lang=/i.test(s)) bad.push(`${url}: no lang on <html>`);
      if (!/name=["']viewport["']/i.test(s)) bad.push(`${url}: no viewport`);
    }
    expect(bad, `Head essentials missing:\n${bad.join("\n")}`).toEqual([]);
  });
});
