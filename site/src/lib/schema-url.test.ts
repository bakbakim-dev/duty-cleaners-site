import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { buildPricingSchema } from "./pricing-schema";
import { buildLocationSchema } from "./location-schema";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows } from "@/data/pricing";

/**
 * Every URL a schema node publishes for this site is the canonical one.
 *
 * dutycleaners.ca is trailing-slash canonical — /pricing 301s to /pricing/ —
 * and pricing-schema.ts hand-typed its two page URLs as absolute strings. One
 * of them drifted: the Calgary entry read
 * "https://dutycleaners.ca/calgary/pricing" with no slash, so the Service node
 * on /calgary/pricing/ named a URL that redirects and contradicted the
 * <link rel="canonical"> on the very page emitting it. `url` is how a node says
 * which page it is about; naming a redirect there is naming a different page.
 *
 * The fix was to derive both from canonicalUrlForPath, the helper every
 * canonical, link and sitemap entry already goes through. This is the guard
 * that keeps the next hand-typed literal out — it checks what the builders
 * actually emit, not what the source looks like, because the location builder
 * takes 152 un-slashed call-site strings and normalises them, which is correct
 * and must keep being allowed.
 */

/** Path part of a site URL, with any query and fragment removed. */
const pathOf = (url: string) => url.replace(/^https:\/\/dutycleaners\.ca/, "").split(/[?#]/)[0];

/** A real file (logo.png, llms-full.txt) is not a page and takes no slash. */
const isFile = (path: string) => /\.[a-z0-9]{2,5}$/i.test(path);

const offenders = (url: string) => {
  if (!url.startsWith("https://dutycleaners.ca")) return false;
  const path = pathOf(url);
  if (path === "" || path === "/") return false; // the root, with or without a fragment
  return !isFile(path) && !path.endsWith("/");
};

/** Every string value in a JSON-LD tree that is meant to identify a page. */
function urlValues(value: unknown, key = "", out: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const item of value) urlValues(item, key, out);
    return out;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) urlValues(v, k, out);
    return out;
  }
  if (typeof value === "string" && /^(url|@id|hasMap|item|mainEntityOfPage|sameAs)$/.test(key)) {
    out.push(value);
  }
  return out;
}

const rows = (fn: () => { beds: string; price: string; assumption: string }[]) =>
  fn().map((r) => ({ beds: r.beds, price: r.price, assumption: r.assumption }));

describe("schema URLs are canonical", () => {
  it("the pricing builder publishes a slash-canonical url for both cities", () => {
    const bad: string[] = [];
    for (const city of ["edmonton", "calgary"] as const) {
      const node = buildPricingSchema({
        city,
        standard: rows(standardTierRows),
        deep: rows(deepCleanTierRows),
        moveInOut: rows(moveInOutTierRows),
      });
      for (const url of urlValues(node)) {
        if (offenders(url)) bad.push(`${city}: ${url}`);
      }
    }
    expect(
      bad,
      `A pricing Service node names a URL that 301s:\n${bad.join("\n")}\n` +
        `Derive it from canonicalUrlForPath rather than typing it.`,
    ).toEqual([]);
  });

  it("the location builder normalises whatever url its call site passes", () => {
    // 152 of the 155 call sites pass the un-slashed form. Normalising in the
    // builder is what stops that reaching the markup, so both forms go in here.
    const bad: string[] = [];
    for (const url of [
      "https://dutycleaners.ca/cleaning-services-st-albert",
      "https://dutycleaners.ca/cleaning-services-st-albert/",
      "https://dutycleaners.ca/locations/windsor-park-calgary",
      "https://dutycleaners.ca/locations/black-diamond/",
    ]) {
      const city = url.includes("calgary") || url.includes("black-diamond") ? "calgary" : "edmonton";
      const node = buildLocationSchema({
        name: "Duty Cleaners - Test Place, AB",
        city,
        url,
        areaServed: "Test Place, AB",
      });
      for (const value of urlValues(node)) {
        if (offenders(value)) bad.push(`${url} -> ${value}`);
      }
    }
    expect(bad, `A location node names a URL that 301s:\n${bad.join("\n")}`).toEqual([]);
  });
});

/**
 * The same rule against the markup a crawler actually receives.
 *
 * The builder checks above cannot see a page that hand-builds its own node
 * instead of calling a builder, and that is where the second instance of this
 * defect was hiding: /edmonton/march-out-cleaning/ types its Service `url`
 * without the slash on the line above the <link rel="canonical"> that has one.
 *
 * Reads dist/ and skips when the site has not been built and prerendered, in
 * the same shape as the other dist-backed guards in this repository — so it
 * reports the LAST build, and a fix in source clears only after a rebuild.
 */
describe("no built page publishes a schema url that redirects", () => {
  const DIST = join(__dirname, "..", "..", "dist");
  const prerendered = () => existsSync(join(DIST, "pricing", "index.html"));

  it("every schema url on dutycleaners.ca ends with a slash", () => {
    if (!existsSync(DIST) || !prerendered()) return;

    const bad: string[] = [];
    const walk = (dir: string, url: string) => {
      let entries: string[];
      try {
        entries = readdirSync(dir);
      } catch {
        return;
      }
      if (entries.includes("index.html")) {
        const html = readFileSync(join(dir, "index.html"), "utf-8");
        for (const block of html.matchAll(
          /<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi,
        )) {
          let parsed: unknown;
          try {
            parsed = JSON.parse(block[1].trim());
          } catch {
            continue; // a block that does not parse is structured-data.test.ts's business
          }
          for (const value of urlValues(parsed)) {
            if (offenders(value)) bad.push(`${url} -> ${value}`);
          }
        }
      }
      for (const e of entries) {
        const p = join(dir, e);
        try {
          if (readdirSync(p)) walk(p, `${url}${e}/`);
        } catch {
          /* not a directory */
        }
      }
    };
    walk(DIST, "/");

    expect(
      [...new Set(bad)],
      `Schema naming a URL that 301s:\n${[...new Set(bad)].join("\n")}\n` +
        `The site is trailing-slash canonical, so a slash-less url in a node ` +
        `contradicts the canonical on the page that emits it. Fix it in the ` +
        `page or builder that emits the node — canonicalUrlForPath("/path") ` +
        `from data/legacy-urls.ts returns the canonical form — then rebuild, ` +
        `because this reads dist.`,
    ).toEqual([]);
  });
});
