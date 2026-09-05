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

describe("image loading priority", () => {
  /**
   * Which image a page paints first is the one thing on the page that Core Web
   * Vitals measures directly, and the browser cannot work it out on its own —
   * it has to be told.
   *
   * The audit found the site half-way there: 89 pages gave their hero
   * loading="eager" fetchPriority="high" and 47 did not, and 26 images sitting
   * three or four sections down the page were still fetched eagerly, competing
   * with the paint the visitor was waiting on.
   *
   * The rule these tests pin has two halves, and the first matters more than
   * the second: an image that another image already precedes is never the LCP
   * element, so it is safe to defer — while deferring the hero is the one
   * change that makes LCP actively worse. That asymmetry is why "first <img>
   * with at most one <section> before it" is the definition of a hero here,
   * and why everything else is required to be lazy.
   *
   * Getting this wrong once already: an earlier pass keyed off "first <img> in
   * the source FILE", which is not the same thing — in four files a card
   * component is declared above the page body, so the file's first image is the
   * card and the real hero is further down. Those four heroes came out lazy.
   * The check below runs on the built page, where that distinction does not
   * exist.
   */
  const imgs = (main: string) => [...main.matchAll(/<img\b([^>]*)>/gi)];
  const mainOf = (html: string) => {
    const m = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(noScripts(html));
    return m ? m[1] : null;
  };

  it("every hero image is eager and high priority", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      const main = mainOf(html);
      if (!main) continue;
      const all = imgs(main);
      if (all.length === 0) continue;
      const first = all[0];
      const sectionsBefore = (main.slice(0, first.index ?? 0).match(/<section/g) ?? []).length;
      if (sectionsBefore > 1) continue; // the first image is genuinely deep in the page
      const loading = attr(first[1], "loading");
      const priority = attr(first[1], "fetchpriority");
      if (loading !== "eager" || priority !== "high") {
        bad.push(`${url}: loading=${loading ?? "(none)"} fetchpriority=${priority ?? "(none)"}`);
      }
    }
    expect(
      bad,
      `These pages do not tell the browser to prioritise their largest image:\n${bad.join("\n")}\n` +
        `A hero wants loading="eager" fetchPriority="high". Lazy is the worst ` +
        `of the three — it defers the very paint LCP is measuring.`,
    ).toEqual([]);
  });

  it("images below the hero are lazy", () => {
    // BrandHome renders the homepage's own hero, and /locations/ embeds
    // BrandHome whole at the foot of its directory. The image is correctly
    // eager on / and merely early on /locations/; making it lazy would trade a
    // real regression on the homepage for a marginal gain on one other page.
    const ALLOWED = new Set(["/locations/"]);
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      const main = mainOf(html);
      if (!main || ALLOWED.has(url)) continue;
      for (const m of imgs(main).slice(1)) {
        if (attr(m[1], "loading") !== "lazy") {
          bad.push(`${url}: ${(attr(m[1], "src") ?? "?").split("/").pop()}`);
        }
      }
    }
    expect(
      bad,
      `These images are below the hero but still fetched eagerly:\n${bad.join("\n")}\n` +
        `They compete for bandwidth with the image the visitor is waiting to see.`,
    ).toEqual([]);
  });
});

describe("declared image dimensions match the file", () => {
  /**
   * width and height on an <img> exist so the browser can reserve the right box
   * before the bytes arrive. Declaring the wrong SHAPE is worse than declaring
   * nothing: the page lays out around a box of the wrong proportions and then
   * reflows everything under it when the real image lands.
   *
   * 20 tags were wrong when this was written. The worst declared 640x480 —
   * landscape, 4:3 — for a photo that is 1080x1920, portrait. Several square
   * 800x800 and 1024x1024 photos were declared as 600x400. Most came from one
   * shared strip component that hard-coded a single size for every photo handed
   * to it, so the numbers described the component rather than the image.
   *
   * The ratio is what matters, not the exact pixels — a correctly-shaped box at
   * half scale reserves the same space — so that is what this compares.
   */
  function webpSize(file: string): { w: number; h: number } | null {
    let buf: Buffer;
    try {
      buf = readFileSync(file);
    } catch {
      return null;
    }
    if (buf.length < 30 || buf.toString("ascii", 0, 4) !== "RIFF") return null;
    const fmt = buf.toString("ascii", 12, 16);
    if (fmt === "VP8X") return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
    if (fmt === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    if (fmt === "VP8 ") return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    return null;
  }

  it("no image declares an aspect ratio its file does not have", () => {
    const bad: string[] = [];
    const sizes = new Map<string, { w: number; h: number } | null>();
    for (const { url, html } of pages()) {
      for (const m of noScripts(html).matchAll(/<img\b([^>]*)>/gi)) {
        const w = Number(attr(m[1], "width"));
        const h = Number(attr(m[1], "height"));
        const src = attr(m[1], "src");
        if (!w || !h || !src || !src.endsWith(".webp")) continue;
        const file = join(DIST, src.replace(/^\//, ""));
        if (!sizes.has(file)) sizes.set(file, webpSize(file));
        const real = sizes.get(file);
        if (!real || !real.w || !real.h) continue;
        if (Math.abs(w / h - real.w / real.h) > 0.02) {
          bad.push(`${url}: ${src.split("/").pop()} declared ${w}x${h}, file is ${real.w}x${real.h}`);
        }
      }
    }
    expect(
      [...new Set(bad)],
      `These images declare a box the wrong shape:\n${[...new Set(bad)].join("\n")}\n` +
        `The browser reserves that shape, then reflows the page under it when ` +
        `the real image arrives. Take the numbers from the file.`,
    ).toEqual([]);
  });
});

/**
 * The two full-bleed hero images are the LCP element on the site's two highest
 * value pages, and they shipped a single 1920x1080 file to every device — the
 * homepage's was 177 KB where the 640w variant a phone actually needs is 25 KB.
 *
 * The preload hint has to carry the same set. Without imagesrcset the browser
 * preloads the full-width file, then the img element picks a narrower one, and
 * the page downloads both.
 */
describe("the hub heroes are responsive", () => {
  const HUBS = ["/", "/cleaning-services-calgary/"];

  it("each hero has a srcset, sizes, and a matching preload hint", () => {
    const built = pages();
    if (!built.length) return;
    for (const url of HUBS) {
      const page = built.find((p) => p.url === url);
      expect(page, `${url} is not in the build`).toBeTruthy();
      const html = page!.html;

      const hero = /<img[^>]+fetchpriority="high"[^>]*>/.exec(html);
      expect(hero, `${url} has no high-priority hero image`).toBeTruthy();
      expect(hero![0], `${url} hero has no srcset`).toMatch(/srcset="[^"]*\d+w/);
      expect(hero![0], `${url} hero has no sizes`).toMatch(/sizes="/);

      const preload = /<link[^>]+rel="preload"[^>]+as="image"[^>]*>/.exec(html);
      expect(preload, `${url} has no image preload`).toBeTruthy();
      expect(
        preload![0],
        `${url} preloads one fixed hero while the img offers a srcset — the browser will fetch both`,
      ).toMatch(/imagesrcset="[^"]*\d+w/);
    }
  });
});
