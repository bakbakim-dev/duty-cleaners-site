import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { contentFingerprint, revisionFor } from "../../scripts/content-revisions";
import { WALL_WASHING_DESCRIPTION } from "./service-copy";

const src = (path: string) => readFileSync(resolve("src", path), "utf8");
describe("SEO editorial integrity", () => {
  it("qualifies wall-washing results in the shared description", () => {
    expect(WALL_WASHING_DESCRIPTION).toContain("some marks may remain");
    expect(WALL_WASHING_DESCRIPTION).toContain("add-on");
    const bad = readdirSync(resolve("src/pages/locations")).filter(f => f.endsWith(".tsx") && src(`pages/locations/${f}`).includes("without stripping the finish"));
    expect(bad).toEqual([]);
  });
  it("labels card revision dates and does not invent publication or reading dates", () => {
    const blog = src("pages/Blog.tsx");
    expect(blog).toContain('date={modifiedFor(post.slug ?? "", "")}');
    expect(blog).not.toMatch(/\b(?:date|readTime):\s*"/);
    expect(src("components/blog/BlogPostCard.tsx")).toContain("Updated <time");
  });
  it("does not present the mislabelled skyline asset as Calgary", () => {
    for (const page of ["Blog", "BlogChoosingCalgaryCleaner", "CalgaryServices", "Locations"]) {
      expect(src(`pages/${page}.tsx`)).not.toContain("hero-calgary-skyline.webp");
    }
  });
  it("does not change revision dates for CSS or date-only edits", () => {
    const html = '<title>Cleaning</title><main class="old"><h1>Price</h1><p>155</p><time>2026-09-12</time></main><script type="application/ld+json">{"dateModified":"2026-09-12","price":155}</script>';
    const hash = contentFingerprint(html);
    expect(contentFingerprint(html.replace('class="old"', 'class="new"').replace(/2026-09-12/g, "2026-09-13"))).toBe(hash);
    expect(contentFingerprint(html.replace(/155/g, "165"))).not.toBe(hash);
    const previous = {hash, modified: "2026-09-12"};
    expect(revisionFor(previous, hash, "2026-09-13")).toEqual(previous);
    expect(revisionFor(previous, "changed", "2026-09-13").modified).toBe("2026-09-13");
    expect(() => revisionFor(previous, "changed", "2026-09-11")).toThrow();
  });
  it("never derives publication freshness from git or build time", () => {
    for (const file of ["generate-sitemap.ts", "generate-post-dates.ts"]) {
      const generator = readFileSync(resolve("scripts", file), "utf8");
      expect(generator).toContain("content-revisions.json");
      expect(generator).not.toMatch(/execSync|new Date\(/);
    }
  });
});
