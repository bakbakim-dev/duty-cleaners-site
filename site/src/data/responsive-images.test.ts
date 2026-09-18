/**
 * Content images ship responsive sources and their intrinsic size.
 *
 * AuditSpur scan 1131 (2026-09-17) listed 15 pages whose content images had
 * no responsive sources — a 1024-px file for a card that renders at 132 CSS px
 * on a phone — and nine pages with images missing width/height. Those images
 * now come through vite-imagetools (`?card` / `?col` / `?hero` imports, see
 * IMAGE_PRESETS in vite.config.ts) and <ResponsiveImage>, which emits a
 * width-descriptor srcset, a `sizes` that matches the layout, and the
 * intrinsic width and height.
 *
 * Measured, not assumed: the presets were sized against the rendered widths
 * on the built pages at 375 and 1366 CSS px, and the largest candidate never
 * exceeds the source (imagetools does not upscale).
 */
import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { SIZES } from "../components/ResponsiveImage";

const ROOT = join(__dirname, "..", "..");
const DIST = join(ROOT, "dist");

/** The 15 pages scan 1131 named, plus the four service pages whose galleries lacked dimensions. */
const PAGES = [
  "",
  "cleaning-services-calgary",
  "edmonton/airbnb-cleaning",
  "airbnb-cleaning-services-calgary",
  "blog",
  "wall-washing-wall-cleaning",
  "wall-washing-wall-cleaning-calgary",
  "move-out-cleaning-edmonton",
  "move-out-cleaning-calgary",
  "how-often-should-a-cleaning-service-clean-my-house",
  "blog/cleaning-schedule",
  "edmonton/march-out-cleaning",
  "how-much-does-a-house-cleaning-cost",
  "cleaning-with-vinegar-and-baking-soda",
  "the-top-5-must-have-cleaning-products-for-a-spotless-home",
  "edmonton/regular-cleaning",
  "calgary/regular-cleaning",
  "edmonton/recurring-cleaning",
  "calgary/recurring-cleaning",
];

/** Images that are not content: map tiles, the logo, team headshots at a fixed size, a blank placeholder. */
const NOT_CONTENT = /openstreetmap\.org|\/logo\.png|\/team\/|^data:/;

function imgs(html: string): string[] {
  return [...html.matchAll(/<img\b[^>]*>/g)].map((m) => m[0]);
}
const attr = (tag: string, name: string) => new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];

function allPages(): string[] {
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

describe("content images ship responsive sources", () => {
  it("every content image on the pages scan 1131 named has a srcset, sizes, width and height", () => {
    if (!existsSync(DIST)) return; // unbuilt tree
    const bad: string[] = [];
    let seen = 0;
    for (const page of PAGES) {
      const file = join(DIST, page, "index.html");
      const html = readFileSync(file, "utf-8");
      for (const tag of imgs(html)) {
        const src = attr(tag, "src") ?? "";
        if (NOT_CONTENT.test(src)) continue;
        seen++;
        const width = Number(attr(tag, "width"));
        const height = Number(attr(tag, "height"));
        const srcset = attr(tag, "srcset");
        const sizes = attr(tag, "sizes");
        // A source narrower than every preset width ships as itself: no
        // candidates, no sizes, but still its intrinsic box.
        const tiny = width > 0 && width < 480;
        if (!(width > 0 && height > 0)) bad.push(`/${page}/ ${src.replace(/.*\//, "")}: no width/height`);
        else if (!tiny && !srcset) bad.push(`/${page}/ ${src.replace(/.*\//, "")}: no srcset`);
        else if (!tiny && !sizes) bad.push(`/${page}/ ${src.replace(/.*\//, "")}: srcset without sizes`);
      }
    }
    expect(seen, "no content images found on the audited pages").toBeGreaterThan(80);
    expect(bad, "content images without responsive sources or an intrinsic size").toEqual([]);
  });

  it("no srcset candidate is wider than the image's own intrinsic width", () => {
    const pages = allPages();
    if (!pages.length) return;
    const upscaled: string[] = [];
    for (const page of pages) {
      for (const tag of imgs(readFileSync(page, "utf-8"))) {
        const srcset = attr(tag, "srcset");
        const width = Number(attr(tag, "width"));
        if (!srcset || !width) continue;
        for (const m of srcset.matchAll(/\s(\d+)w(?:,|$)/g)) {
          if (Number(m[1]) > width) upscaled.push(`${page.slice(DIST.length)} ${m[1]}w > ${width}`);
        }
      }
    }
    expect(upscaled, "a candidate wider than the source is an upscale").toEqual([]);
  });

  it("the sizes presets describe the layouts they are named for", () => {
    // The strings are what the browser uses to pick a candidate; a preset that
    // claims 100vw on desktop for a card would fetch the 1024 file for a
    // 240-px slot on every desktop visit.
    expect(SIZES.card).toMatch(/^\(min-width: 1024px\) 360px, \(min-width: 640px\) 50vw, 100vw$/);
    expect(SIZES.column).toMatch(/^\(min-width: 1024px\) 896px, 100vw$/);
    expect(SIZES.full).toBe("100vw");
  });
});
