import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { explicitBranchFromPath, NEUTRAL_PATHS } from "../lib/city-from-path";
import { nextBranchPreference } from "../lib/branch-preference";
import { CITY_PROOF } from "./proof";

/**
 * Branch-neutral chrome (owner, 2026-09-17).
 *
 * The header and footer pick their office from the URL. Pages that belong to
 * no branch — About, FAQs, the blog, the legal pages — used to fall back to
 * Edmonton, so a visitor who had just chosen Calgary was shown the Edmonton
 * phone on their next click, and a first-time visitor from search was told
 * the business is one office. They now offer every office, and a visitor's
 * last branch is remembered in localStorage and applied to the chrome only,
 * after mount. The prerender and every crawler are stateless and must get the
 * neutral default: these guards read dist/, so they see exactly that.
 */
const DIST = join(__dirname, "..", "..", "dist");
const built = existsSync(join(DIST, "index.html"));
const html = (route: string) => readFileSync(join(DIST, route.replace(/^\//, ""), "index.html"), "utf-8");
/** The site header's <nav> is the first one in the document (breadcrumbs come later). */
const headerNav = (route: string) => {
  const nav = html(route).match(/<nav\b[\s\S]*?<\/nav>/)?.[0] ?? "";
  expect(nav, `${route}: no header nav found`).toContain("See My Instant Price");
  return nav;
};
const telsIn = (markup: string) => new Set([...markup.matchAll(/href="tel:(\d+)"/g)].map((m) => m[1]));
const TEL = {
  edmonton: CITY_PROOF.edmonton.phoneLink.replace("tel:", ""),
  calgary: CITY_PROOF.calgary.phoneLink.replace("tel:", ""),
  reddeer: CITY_PROOF.reddeer.phoneLink.replace("tel:", ""),
};

describe("which branch a URL belongs to, allowing for none", () => {
  it("a page that belongs to no branch resolves to null", () => {
    for (const path of ["/about-us", "/about-us/", "/faqs", "/reviews", "/contact-us", "/locations", "/blog", "/blog/cleaning-schedule", "/how-much-does-a-house-cleaning-cost", "/privacy-policy"]) {
      expect(explicitBranchFromPath(path), path).toBeNull();
    }
  });

  it("every other page belongs to a branch, as cityFromPath has always said", () => {
    expect(explicitBranchFromPath("/")).toBe("edmonton");
    expect(explicitBranchFromPath("/pricing/")).toBe("edmonton");
    expect(explicitBranchFromPath("/edmonton/deep-cleaning/")).toBe("edmonton");
    expect(explicitBranchFromPath("/locations/balwin-edmonton/")).toBe("edmonton");
    expect(explicitBranchFromPath("/cleaning-services-calgary/")).toBe("calgary");
    expect(explicitBranchFromPath("/calgary/pricing/")).toBe("calgary");
    expect(explicitBranchFromPath("/locations/tuxedo-park-calgary/")).toBe("calgary");
    expect(explicitBranchFromPath("/cleaning-services-airdrie/")).toBe("calgary");
    expect(explicitBranchFromPath("/cleaning-services-red-deer/")).toBe("reddeer");
    // The neutral list never grows to swallow a branch page by accident.
    for (const p of NEUTRAL_PATHS) expect(p, "neutral paths carry no city token").not.toMatch(/calgary|edmonton|red-deer/);
  });
});

describe("what a visit remembers", () => {
  it("an Edmonton page never overwrites a Red Deer choice", () => {
    // Red Deer shares every Edmonton page, so opening the price list from the
    // Red Deer page must not turn a Red Deer visitor into an Edmonton one.
    expect(nextBranchPreference("reddeer", "edmonton")).toBe("reddeer");
    expect(nextBranchPreference("calgary", "edmonton")).toBe("edmonton");
    expect(nextBranchPreference(null, "edmonton")).toBe("edmonton");
    expect(nextBranchPreference("edmonton", "calgary")).toBe("calgary");
    expect(nextBranchPreference("edmonton", "reddeer")).toBe("reddeer");
    expect(nextBranchPreference("reddeer", "calgary")).toBe("calgary");
  });
});

describe("the prerendered chrome is neutral where the page is", () => {
  const neutralRoutes = [...NEUTRAL_PATHS, "/blog"].filter((p) => existsSync(join(DIST, p.replace(/^\//, ""), "index.html")));

  it("every branch-less page offers every office in its header", () => {
    if (!built) return;
    expect(neutralRoutes.length, "no neutral pages found in dist").toBeGreaterThan(10);
    const bad: string[] = [];
    for (const route of neutralRoutes) {
      const nav = headerNav(route);
      const tels = telsIn(nav);
      for (const [key, tel] of Object.entries(TEL)) if (!tels.has(tel)) bad.push(`${route} header lacks the ${key} office`);
      if (!/>Call us</.test(nav)) bad.push(`${route} header has no "Call us" menu`);
    }
    expect(bad).toEqual([]);
  });

  it("a page that belongs to a branch shows only that office in its header", () => {
    if (!built) return;
    const cases: Array<[string, keyof typeof TEL]> = [
      ["/", "edmonton"],
      ["/edmonton/deep-cleaning/", "edmonton"],
      ["/pricing/", "edmonton"],
      ["/cleaning-services-calgary/", "calgary"],
      ["/calgary/pricing/", "calgary"],
      ["/locations/tuxedo-park-calgary/", "calgary"],
      ["/cleaning-services-red-deer/", "reddeer"],
    ];
    const bad: string[] = [];
    for (const [route, key] of cases) {
      const tels = [...telsIn(headerNav(route))];
      if (tels.length !== 1 || tels[0] !== TEL[key]) bad.push(`${route} header offers ${tels.join(",") || "no office"}; expected only ${key}`);
    }
    expect(bad).toEqual([]);
  });

  it("no snapshot carries a remembered branch", () => {
    if (!built) return;
    // The preference is read after mount; a prerender that captured one would
    // hand every crawler a Calgary (or Edmonton) header on a neutral page.
    for (const route of ["/", "/about-us", "/cleaning-services-calgary"]) {
      expect(html(route), route).not.toMatch(/<html[^>]*data-branch/);
    }
  });

  it("a neutral page's own call button names no single office", () => {
    if (!built) return;
    // About's hero and the blog index used to hand a first-time visitor the
    // Edmonton number as the number. Before mount they now offer the offices.
    for (const route of ["/about-us", "/blog"]) {
      const main = html(route).match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? "";
      expect(main, route).toContain(">Call an office<");
      expect(main, route).not.toMatch(/>Call \(780\) 913-6565<|>Edmonton office: \(780\)/);
    }
    expect(html("/about-us")).toContain('id="offices"');
  });

  it("the privacy policy names the remembered-office preference", () => {
    if (!built) return;
    expect(html("/privacy-policy")).toContain("whose pages you last looked at");
  });
});
