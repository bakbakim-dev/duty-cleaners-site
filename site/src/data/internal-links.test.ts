import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Internal linking guards, from the link-graph audit.
 *
 * The graph was already clean on the mechanical checks — no broken targets, no
 * missing trailing slashes (each would be a 301 hop), no internal nofollow, no
 * orphans, every page within two clicks of the homepage. What it was not clean
 * on was the silo:
 *
 *   Only 31 of 165 location pages carried a body link to any service page, and
 *   all 31 went to commercial cleaning. /edmonton/deep-cleaning/ had three
 *   in-body links site-wide and /calgary/deep-cleaning/ had two, while
 *   /pricing/ had 87 — because ServiceCard on the location pages was a <div>.
 *   Six cards per page describing the services, none of them a link, 166 times.
 *
 * These tests pin the two properties that fix cost the most effort to get
 * right: that the path exists at all, and that it points at the correct city.
 * The second one matters more than it looks — while making this change I sent
 * two Calgary pages at Edmonton services, because the source files carry no
 * phone number and my city check silently defaulted.
 */

const DIST = join(__dirname, "..", "..", "dist");

/** Location and surrounding-community pages, excluding the two hubs. */
function locationPages(): string[] {
  if (!existsSync(DIST)) return [];
  const out: string[] = [];
  const locations = join(DIST, "locations");
  if (existsSync(locations)) {
    for (const slug of readdirSync(locations)) {
      if (slug === "all") continue;
      if (statSync(join(locations, slug)).isDirectory()) out.push(`/locations/${slug}/`);
    }
  }
  for (const entry of readdirSync(DIST)) {
    if (!entry.startsWith("cleaning-services-")) continue;
    if (entry === "cleaning-services-calgary") continue; // the Calgary hub
    if (statSync(join(DIST, entry)).isDirectory()) out.push(`/${entry}/`);
  }
  return out;
}

const html = (url: string) =>
  readFileSync(join(DIST, url.replace(/^\/|\/$/g, ""), "index.html"), "utf-8");

/** Body only — a nav or footer link is not a contextual one. */
function mainHtml(url: string): string {
  const raw = html(url).replace(/<script[\s\S]*?<\/script>/g, " ");
  const m = /<main\b[^>]*>([\s\S]*?)<\/main>/.exec(raw);
  return m ? m[1] : "";
}

/** Which branch a page belongs to, read from the phone number it publishes. */
function cityOf(url: string): "edmonton" | "calgary" {
  const s = html(url);
  const edm = (s.match(/\(780\) 913-6565|780-913-6565/g) ?? []).length;
  const cal = (s.match(/\(403\) 768-1341|403-768-1341/g) ?? []).length;
  return edm > cal ? "edmonton" : "calgary";
}

const SERVICE_HREF =
  /href="(\/(?:edmonton|calgary)\/(?:regular|deep|recurring)-cleaning\/|\/move-out-cleaning-(?:edmonton|calgary)\/|\/post-construction-cleaning(?:-calgary)?\/)"/g;

describe("location pages feed the service pages", () => {
  it("every location page links to at least one service page from its body", () => {
    const pages = locationPages();
    if (pages.length === 0) return;
    const bare = pages.filter((url) => {
      SERVICE_HREF.lastIndex = 0;
      return !SERVICE_HREF.test(mainHtml(url));
    });
    expect(
      bare,
      `These location pages have no body link to any service page:\n${bare.join("\n")}\n` +
        `The long-tail tier exists to catch "house cleaning in <place>" and then ` +
        `route that visitor to the service they came for. A page that only links ` +
        `to the price list and /locations/ passes its relevance to a table.`,
    ).toEqual([]);
  });

  it("no location page links to the other city's service pages", () => {
    const pages = locationPages();
    if (pages.length === 0) return;
    const wrong: string[] = [];
    for (const url of pages) {
      const city = cityOf(url);
      const body = mainHtml(url);
      SERVICE_HREF.lastIndex = 0;
      let m: RegExpExecArray | null;
      while ((m = SERVICE_HREF.exec(body))) {
        const target = m[1];
        const targetCity = target.includes("calgary") ? "calgary" : "edmonton";
        if (targetCity !== city) wrong.push(`${url} (${city}) -> ${target}`);
      }
    }
    expect(
      wrong,
      `These location pages send visitors to the wrong branch:\n${wrong.join("\n")}\n` +
        `A Calgary neighbourhood linking to /edmonton/deep-cleaning/ splits the ` +
        `geographic signal and lands the visitor on the wrong phone number.`,
    ).toEqual([]);
  });

  it("service links carry a place-qualified anchor, not one repeated everywhere", () => {
    const pages = locationPages();
    if (pages.length === 0) return;
    const anchors = new Map<string, Set<string>>();
    for (const url of pages) {
      const body = mainHtml(url);
      for (const a of body.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]{0,300}?)<\/a>/g)) {
        const href = a[1];
        if (!/^(\/(edmonton|calgary)\/(regular|deep|recurring)-cleaning\/|\/move-out-cleaning-|\/post-construction-cleaning)/.test(href))
          continue;
        const text = a[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
        if (!anchors.has(href)) anchors.set(href, new Set());
        anchors.get(href)!.add(text);
      }
    }
    // Each service page should be reached under many different anchors, one per
    // place, rather than the same string 87 times.
    const thin: string[] = [];
    for (const [href, set] of anchors) {
      if (set.size < 10) thin.push(`${href}: only ${set.size} distinct anchors`);
    }
    expect(
      thin,
      `These service pages are linked under too few distinct anchors:\n${thin.join("\n")}\n` +
        `The anchor carries the place name ("Deep cleaning in Westmount") so that ` +
        `87 links arrive under 87 anchors. One repeated anchor wastes the signal.`,
    ).toEqual([]);
  });
});

describe('anchors describe where they go', () => {
  /**
   * An anchor that names a service has to link to that service.
   *
   * The first version of this check ignored anchors over 60 characters, on the
   * theory that long ones were card wrappers rather than editorial links. That
   * theory hid the defect: both city homepages had a card headed Deep Cleaning
   * whose CTA read "Explore deep cleaning" and whose link went to /services/,
   * and because the whole card was the anchor it ran to 217 characters — over
   * the cap, so it was never examined. The two faults concealed each other.
   *
   * No length cap now. The anchor is matched on the service it names.
   */
  const NAMES: ReadonlyArray<readonly [RegExp, RegExp]> = [
    [/\bdeep clean(ing)?\b/i, /deep-cleaning/],
    [/\brecurring clean(ing)?\b/i, /recurring-cleaning/],
    [/\bmove[- ]?(in|out)\b/i, /move-out-cleaning-|move-in-move-out/],
    [/\bpost[- ]construction\b/i, /post-construction/],
    [/\bwall wash(ing)?\b/i, /wall-washing/],
    [/\bairbnb\b/i, /airbnb/],
  ];

  it('no anchor names one service and links to another', () => {
    const pages = [...locationPages(), '/', '/cleaning-services-calgary/'];
    if (pages.length === 0) return;
    const bad: string[] = [];
    for (const url of pages) {
      let body: string;
      try {
        body = mainHtml(url).replace(/<svg[\s\S]*?<\/svg>/g, ' ');
      } catch {
        continue;
      }
      for (const a of body.matchAll(/<a\b[^>]*href="(\/[^"]*)"[^>]*>([\s\S]*?)<\/a>/g)) {
        const href = a[1];
        const text = a[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
        for (const [names, goes] of NAMES) {
          if (names.test(text) && !goes.test(href)) {
            bad.push(`${url}: "${text.slice(0, 52)}" -> ${href}`);
            break;
          }
        }
      }
    }
    expect(
      bad,
      `These anchors name a service and link somewhere else:\n${bad.join('\n')}\n` +
        `An anchor is a promise about the destination. Point it at the page it ` +
        `names, or rename it.`,
    ).toEqual([]);
  });
});
