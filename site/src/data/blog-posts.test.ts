import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { POST_MODIFIED } from "./post-dates";

/**
 * Guards the eight blog posts.
 *
 * The bug worth a permanent test is the date one, because it was invisible
 * from either side on its own. Every post hardcoded `dateModified` equal to
 * `datePublished`, so no post had ever been marked revised. Meanwhile
 * generate-sitemap.ts derives <lastmod> from git, and several of these posts
 * HAD been revised. The two outputs therefore disagreed on all eight posts, by
 * up to seven months:
 *
 *     /blog/choosing-cleaning-company/          schema 2026-01-27  sitemap 2026-08-28
 *     /cleaning-with-vinegar-and-baking-soda/   schema 2026-01-25  sitemap 2026-08-28
 *
 * Google reads both. The schema said "untouched since January" while the
 * sitemap said "revised last week", and the sitemap was the accurate one — so
 * the stale half was actively suppressing freshness on advice content, which is
 * exactly where freshness counts.
 *
 * Both now read from scripts/generate-post-dates.ts. This asserts they still
 * agree, so reintroducing a hand-typed date fails loudly.
 */

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

const POSTS = Object.keys(POST_MODIFIED).map((p) => `${p}/`);

const read = (url: string) => readFileSync(join(DIST, ...url.replace(/^\/|\/$/g, "").split("/"), "index.html"), "utf-8");

/** Every <loc>/<lastmod> pair across the sitemaps that carry articles. */
function sitemapLastmod(): Map<string, string> {
  const out = new Map<string, string>();
  for (const f of ["sitemap-blog.xml", "sitemap-main.xml"]) {
    const p = join(DIST, f);
    if (!existsSync(p)) continue;
    const xml = readFileSync(p, "utf-8");
    for (const m of xml.matchAll(
      /<loc>https:\/\/dutycleaners\.ca(\/[^<]*)<\/loc>\s*<lastmod>([^<]*)<\/lastmod>/g,
    )) {
      out.set(m[1], m[2].slice(0, 10));
    }
  }
  return out;
}

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

describe("blog post dates", () => {
  it("post-dates.ts covers every post", () => {
    expect(Object.keys(POST_MODIFIED).length).toBe(8);
  });

  it("every generated date is a real ISO date", () => {
    const bad = Object.entries(POST_MODIFIED).filter(([, d]) => !/^\d{4}-\d{2}-\d{2}$/.test(d));
    expect(bad, "generate-post-dates wrote something that is not an ISO date").toEqual([]);
  });

  it("schema dateModified agrees with the sitemap's lastmod", () => {
    if (!existsSync(DIST)) return;
    const lastmod = sitemapLastmod();
    const conflicts: string[] = [];
    for (const url of POSTS) {
      const m = /"dateModified":"([^"]*)"/.exec(read(url));
      const schema = m ? m[1].slice(0, 10) : "MISSING";
      const sitemap = lastmod.get(url);
      if (!sitemap) continue;
      if (schema !== sitemap) conflicts.push(`${url}: schema ${schema} vs sitemap ${sitemap}`);
    }
    expect(
      conflicts,
      "the Article schema and the sitemap disagree about when these were last revised. " +
        "Both should come from scripts/generate-post-dates.ts — do not hand-type dateModified.",
    ).toEqual([]);
  });

  it("no post reintroduces a hand-typed dateModified", () => {
    // A literal date string next to dateModified in the SOURCE is the shape of
    // the original bug; the value must come through modifiedFor().
    const files = [
      "BlogChoosingCleaningCompany", "BlogCleaningSchedule", "BlogChoosingCalgaryCleaner",
      "BlogSpotlessHomeTips", "BlogVinegarBakingSoda", "BlogHouseCleaningCost",
      "BlogCleaningFrequency", "BlogCleaningProducts",
    ];
    const bad = files.filter((f) => {
      const src = readFileSync(join(ROOT, "src", "pages", `${f}.tsx`), "utf-8");
      return /"?dateModified"?:\s*"\d{4}-\d{2}-\d{2}"/.test(src);
    });
    expect(bad, "these hand-type dateModified instead of calling modifiedFor()").toEqual([]);
  });
});

describe("blog post metadata", () => {
  it("every title fits inside 60 characters", () => {
    if (!existsSync(DIST)) return;
    const over = [...POSTS, "/blog/"]
      .map((u) => {
        const m = /<title[^>]*>([\s\S]*?)<\/title>/.exec(read(u));
        const t = m ? decode(m[1].replace(/\s+/g, " ").trim()) : "";
        return { u, t, len: t.length };
      })
      .filter((r) => r.len > 60);
    expect(over.map((r) => `${r.len} ${r.u} — ${r.t}`)).toEqual([]);
  });

  it("every meta description fits inside 160 characters", () => {
    if (!existsSync(DIST)) return;
    const over = [...POSTS, "/blog/"]
      .map((u) => {
        const m = /<meta name="description"[^>]*content="([^"]*)"/.exec(read(u));
        return { u, len: m ? decode(m[1]).length : 0 };
      })
      .filter((r) => r.len > 160);
    expect(over.map((r) => `${r.len} ${r.u}`)).toEqual([]);
  });

  it("the index declares Blog schema listing every post", () => {
    if (!existsSync(DIST)) return;
    const html = read("/blog/");
    expect(html, "/blog/ should declare itself a Blog").toContain('"@type":"Blog"');
    // One BlogPosting stub per real post.
    const stubs = (html.match(/"@type":"BlogPosting"/g) || []).length;
    expect(stubs).toBe(POSTS.length);
    // The display date ("August 24, 2026") must never reach the schema.
    expect(
      /"datePublished":"[A-Z][a-z]+ /.test(html),
      "a display date leaked into the index schema — it must be ISO 8601",
    ).toBe(false);
  });

  /**
   * The Article schema read its dates from post-published.ts and post-dates.ts,
   * but the byline under each post's title was hand-typed: the preserved
   * WordPress posts said "January 22, 2026" over a 2025-02-07 datePublished
   * (an audit flagged all three, 2026-09-27). Every visible <time> in the post
   * header must now name a date the schema also states, and every schema date
   * must be shown.
   */
  it("each post shows the same dates its Article schema declares", () => {
    if (!existsSync(DIST)) return;
    const bad: string[] = [];
    for (const u of POSTS) {
      const html = read(u);
      const article = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
        .map((m) => { try { return JSON.parse(m[1]); } catch { return null; } })
        .find((j) => j?.["@type"] === "Article" || j?.["@type"] === "BlogPosting");
      const schema = new Set([article?.datePublished, article?.dateModified].filter(Boolean) as string[]);
      const main = html.slice(html.indexOf("<main"));
      const header = main.slice(0, main.indexOf("<h1") > 0 ? main.indexOf("</h1>") + 2000 : 4000);
      const shown = new Set([...header.matchAll(/<time[^>]*dateTime="([^"]+)"/gi)].map((m) => m[1]));
      const handTyped = /<span[^>]*>\s*(?:<svg[\s\S]*?<\/svg>)?\s*[A-Z][a-z]+ \d{1,2}, \d{4}\s*<\/span>/.test(header);
      if (handTyped) bad.push(`${u} has a hand-typed display date`);
      for (const d of shown) if (!schema.has(d)) bad.push(`${u} shows ${d}, schema says ${[...schema].join("/")}`);
      for (const d of schema) if (!shown.has(d)) bad.push(`${u} schema ${d} is not shown`);
    }
    expect(bad).toEqual([]);
  });

  /**
   * The vinegar and cost articles opened with un-edited WordPress copy that had
   * survived the rebuild — "household items that are not only skilled and
   * efficient", "unsafe to use in every household" (which states the opposite
   * of what it means), and "Running errands also steal". All three sat in the
   * first paragraph, which is what a reader and an extractor see first.
   */
  it("the legacy WordPress intros stay gone", () => {
    if (!existsSync(DIST)) return;
    const relics = [
      "unsafe to use in every household",
      "skilled and efficient home cleaners",
      "Running errands also steal",
      "we can utilize household items",
    ];
    const found: string[] = [];
    for (const u of POSTS) {
      const text = read(u);
      for (const r of relics) if (text.includes(r)) found.push(`${u}: "${r}"`);
    }
    expect(found).toEqual([]);
  });
});
