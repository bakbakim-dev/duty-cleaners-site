import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import CityRecentCleans, { type RecentCleanReview } from "@/components/CityRecentCleans";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import { BEFORE_AFTER } from "@/data/before-after";
import { CALGARY_REVIEWS, EDMONTON_REVIEWS } from "@/data/reviews";
import { getListing } from "@/lib/google-listings";

/**
 * Area-page performance and accessibility guards (2026-09-11).
 *
 * 1. The Altadore mobile lab run fetched about 405 KiB of Google Maps scripts
 *    on first load from an embed iframe that was lazy in name only, and the
 *    prerendered snapshot froze that iframe into the HTML. GoogleMapEmbed
 *    renders a button and a link first and creates the iframe on request.
 * 2. The review star rows were <div aria-label="Google review"> with no role:
 *    a name nobody announces, and one that never said how many stars.
 * 3. Each review's link was named "Read <name>'s review on our Google Business
 *    Profile" while it opened the branch's general reviews page.
 * 4. The before-and-after gallery printed a placeholder line about photos that
 *    do not exist yet.
 *
 * These render the real components to static markup, which is also what the
 * prerender snapshot starts from, so what they check is what ships.
 */

const SRC = join(__dirname, "..");
/** Source with comments removed, so a comment describing the old defect cannot trip or satisfy a check. */
const read = (rel: string) =>
  readFileSync(join(SRC, rel), "utf-8")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");

const render = (el: Parameters<typeof renderToStaticMarkup>[0]) => {
  // useScrollAnimation uses useLayoutEffect, which React warns about on the
  // server. The warning is noise here; the markup is what is under test.
  const original = console.error;
  console.error = () => {};
  try {
    return renderToStaticMarkup(el);
  } finally {
    console.error = original;
  }
};

const decode = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

function anchors(html: string): Array<{ href: string; name: string }> {
  return [...html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].map((m) => {
    const attrs = m[1];
    const href = decode(/\bhref="([^"]*)"/.exec(attrs)?.[1] ?? "");
    const label = /\baria-label="([^"]*)"/.exec(attrs)?.[1];
    const text = m[2].replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<[^>]+>/g, "");
    return { href, name: decode(label ?? text).trim() };
  });
}

const recentCleans = (city: string, reviews: RecentCleanReview[]) =>
  render(createElement(MemoryRouter, null, createElement(CityRecentCleans, { city, reviews })));

describe("area pages: Google Maps loads only on request", () => {
  it("the map embed's first render has no iframe and no Google Maps request", () => {
    const html = render(createElement(GoogleMapEmbed, { query: "Altadore, Calgary, AB", title: "Altadore Calgary Service Area Map" }));
    expect(html).not.toMatch(/<iframe/i);
    expect(html).not.toContain("output=embed");
    expect(html).not.toMatch(/maps\.(?:googleapis|gstatic)\.com/);
    expect(html).not.toMatch(/<script/i);
    // The same holds when a page keeps its own "maps/embed?pb=" URL.
    const kept = render(createElement(GoogleMapEmbed, { query: "Airdrie, AB", title: "Airdrie map", embedSrc: "https://www.google.com/maps/embed?pb=!1m18" }));
    expect(kept).not.toMatch(/<iframe/i);
    expect(kept).not.toContain("maps/embed");
  });

  it("the map embed offers a real Show map button and a plain link to the place", () => {
    const html = render(createElement(GoogleMapEmbed, { query: "Altadore, Calgary, AB", title: "Altadore Calgary Service Area Map" }));
    expect(html).toMatch(/<button type="button"[^>]*>[\s\S]*?Show map<\/button>/);
    const link = anchors(html).find((a) => a.href.startsWith("https://www.google.com/maps/search/"));
    expect(link?.name).toBe("Open Altadore, Calgary, AB in Google Maps");
    // The box is about the place, not about how the website loads it.
    expect(html).not.toMatch(/loads from Google|press Show map/i);
  });

  it("Altadore renders its map through GoogleMapEmbed, with no inline iframe", () => {
    const src = read("pages/locations/Altadore.tsx");
    expect(src).not.toMatch(/<iframe/);
    expect(src).not.toContain("output=embed");
    expect(src).toMatch(/<GoogleMapEmbed\b/);
  });

  it("no location page ships an inline Google Maps iframe", () => {
    // 93 more pages carried the same lazy-in-name-only iframe (51 "?q=" and 42
    // "maps/embed?pb=" embeds). Every map goes through GoogleMapEmbed now, and
    // each names its place with the province, and the city for a neighbourhood.
    const dir = join(SRC, "pages", "locations");
    const pages = readdirSync(dir).filter((n) => n.endsWith(".tsx"));
    expect(pages.length, "the location pages moved; point this guard at them").toBeGreaterThan(100);
    const inline: string[] = [];
    const badQuery: string[] = [];
    let maps = 0;
    for (const name of pages) {
      const src = read(`pages/locations/${name}`);
      if (/<iframe\b/i.test(src) || /google\.com\/maps/.test(src)) inline.push(name);
      for (const m of src.matchAll(/<GoogleMapEmbed\b[^>]*\bquery="([^"]*)"/g)) {
        maps++;
        if (!/, AB$/.test(m[1])) badQuery.push(`${name}: "${m[1]}"`);
      }
    }
    expect(inline, "these location pages still load Google Maps in their own markup").toEqual([]);
    expect(maps, "the pages lost their maps; GoogleMapEmbed should carry them").toBeGreaterThan(90);
    expect(badQuery, "a map query should end in the province").toEqual([]);
  });
});

describe("recent Google reviews: stars and links say what they are", () => {
  it("every star group is one image named with the review's own rating", () => {
    const shown = CALGARY_REVIEWS.slice(0, 3);
    const html = recentCleans("Calgary", shown);
    expect(html).not.toContain('aria-label="Google review"');
    const groups = [...html.matchAll(/<div\b[^>]*\brole="img"[^>]*\baria-label="([^"]*)"/g)].map((m) => m[1]);
    expect(groups).toEqual(shown.map((r) => `${r.rating} out of 5 stars`));
    // A four-star review is announced as four, not as a fixed five.
    const four = recentCleans("Calgary", [{ ...shown[0], rating: 4 }]);
    expect(four).toContain('aria-label="4 out of 5 stars"');
  });

  it("no labelled div without a role or aria-hidden is left in the component", () => {
    const src = read("components/CityRecentCleans.tsx");
    const bad = [...src.matchAll(/<div\b[^>]*>/g)]
      .map((m) => m[0])
      .filter((tag) => /\baria-label=/.test(tag) && !/\brole=/.test(tag) && !/\baria-hidden=/.test(tag));
    expect(bad).toEqual([]);
  });

  it("a review link that opens the branch profile does not claim to open one review", () => {
    for (const [city, reviews] of [["Calgary", CALGARY_REVIEWS], ["Edmonton", EDMONTON_REVIEWS]] as const) {
      const profile = getListing(city).reviewsUrl;
      const html = recentCleans(city, reviews.slice(0, 3).map((r) => ({ ...r, sourceUrl: undefined })));
      const toProfile = anchors(html).filter((a) => a.href === profile);
      expect(toProfile.length).toBeGreaterThan(0);
      for (const a of toProfile) {
        expect(a.name, `${city}: "${a.name}"`).not.toMatch(/'s review|this review|Business Profile/i);
      }
      expect(toProfile.map((a) => a.name)).toContain(`View ${city} Google reviews`);
    }
  });

  it("a review with its own Google share link is named as that review", () => {
    const shareUrl = "https://maps.app.goo.gl/example-review";
    const html = recentCleans("Calgary", [{ ...CALGARY_REVIEWS[0], sourceUrl: shareUrl }]);
    const link = anchors(html).find((a) => a.href === shareUrl);
    expect(link?.name).toBe("Read this review on Google");
  });
});

describe("before-and-after gallery: nothing until approved photos exist", () => {
  it("renders nothing, and no placeholder line, when a city has no approved pairs", () => {
    for (const city of ["Edmonton", "Calgary"] as const) {
      if (BEFORE_AFTER[city].length !== 0) continue;
      const html = render(createElement(BeforeAfterGallery, { city }));
      expect(html).toBe("");
    }
    expect(read("components/BeforeAfterGallery.tsx")).not.toMatch(/go up here|once the homeowners have approved/i);
  });

  it("still renders real pairs once they are added", () => {
    const pair = { before: "/b.webp", after: "/a.webp", label: "Oven, Edmonton", beforeAlt: "An oven before", afterAlt: "The oven after" };
    BEFORE_AFTER.Edmonton.push(pair);
    try {
      const html = render(createElement(BeforeAfterGallery, { city: "Edmonton" }));
      expect(html).toContain("<figure");
      expect(html).toContain('alt="An oven before"');
      expect(html).toContain('alt="The oven after"');
    } finally {
      BEFORE_AFTER.Edmonton.pop();
    }
  });
});
