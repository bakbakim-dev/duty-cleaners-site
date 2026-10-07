import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { CITY_PROOF, RED_DEER_OPENS_LINE } from "./proof";
import { footerOfficeOrder } from "@/components/Footer";
import { explicitBranchFromPath } from "@/lib/city-from-path";

/**
 * Red Deer has no office yet (owner, 2026-10-06).
 *
 * "Red Deer is not open until next year." Red Deer homes are booked online on
 * the same prices, with no travel fee inside the city; the Edmonton office runs
 * the cleans; the Red Deer number, (587) 570-6979, rings that office and is
 * answered in its hours; and a Red Deer office opens in 2027. Until then no page,
 * no schema node and no llms file may present the Google listing's street
 * address (5212 48 St, T4N 1S4) as an office, give Red Deer its old Monday to
 * Saturday 7 AM to 9 PM hours, or speak of "the Red Deer office" or "three
 * offices".
 *
 * The same day the owner approved two footer fixes, guarded here too: a page
 * that belongs to a branch lists that branch's office first (Google's snippet
 * for a Calgary page quoted another block's hours), from the page path so the
 * prerender carries it; and the "charged after your clean" badges do not list
 * e-transfer, which is paid in full the day before (policy.ts PAYMENT_TERMS).
 *
 * Source checks hold before a build; the dist checks skip on an unbuilt tree.
 */

const SRC = join(__dirname, "..");
const ROOT = join(SRC, "..");
const DIST = join(ROOT, "dist");

/** Source with comments stripped: a guard must test code, not prose. */
const stripComments = (text: string) =>
  text
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

function sourceFiles(dir: string, prefix = ""): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = `${prefix}${entry.name}`;
    if (entry.isDirectory()) {
      if (entry.name !== "assets") out.push(...sourceFiles(join(dir, entry.name), `${rel}/`));
    } else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) {
      out.push(rel);
    }
  }
  return out;
}

/** What a reader of the shipped copy sees: every source file, plus the llms files. */
function shippedCopy(): Array<{ file: string; text: string }> {
  const files = sourceFiles(SRC).map((rel) => ({
    file: `src/${rel}`,
    // Whitespace collapsed: JSX wraps a sentence across lines.
    text: stripComments(readFileSync(join(SRC, rel), "utf-8")).replace(/\s+/g, " "),
  }));
  for (const name of ["llms.txt", "llms-full.txt"]) {
    files.push({ file: `public/${name}`, text: readFileSync(join(ROOT, "public", name), "utf-8") });
  }
  return files;
}

/**
 * Wording that presents Red Deer as an open, staffed office. "Red Deer office
 * cleaning" (the commercial service) and "a Red Deer office opens in 2027" are
 * not office claims, so they are left out of the patterns.
 */
const OFFICE_CLAIMS: Array<[string, RegExp]> = [
  ["the Red Deer office", /\bthe Red Deer office\b(?! cleaning)/i],
  ["Red Deer office is/hours/answers/covers/at", /\bRed Deer office(?:'s)? (?:is|hours|answers|covers|at|books)\b/i],
  ["Red Deer has its own office", /Red Deer (?:has|is a branch with) its own office/i],
  ["three offices", /\bthree (?:branch )?offices\b/i],
  ["office in each of the three cities", /office in each of the three cities/i],
  ["Edmonton, Calgary and Red Deer offices", /Edmonton, Calgary (?:and|or) Red Deer (?:office|branch)/i],
  ["offices in Edmonton, Calgary and Red Deer", /offices? in Edmonton, Calgary(?:,)? and Red Deer/i],
];

const LISTING_ADDRESS = [/5212\s*48(?:th)?\s*St/i, /T4N\s?1S4/i];
const OLD_HOURS = [/7:00\s*AM\s*(?:to|–|-)\s*9:00\s*PM/i, /"07:00"/, /"21:00"/, /07:00-21:00/];

const visible = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/\s+/g, " ");

function builtPages(): Array<{ url: string; html: string }> {
  if (!existsSync(DIST)) return [];
  const out: Array<{ url: string; html: string }> = [];
  const walk = (dir: string, url: string) => {
    for (const e of readdirSync(dir)) {
      const p = join(dir, e);
      if (e === "index.html") out.push({ url, html: readFileSync(p, "utf-8") });
      else if (statSync(p).isDirectory() && e !== "assets") walk(p, `${url}${e}/`);
    }
  };
  walk(DIST, "/");
  return out;
}

const pageHtml = (rel: string) => {
  const file = join(DIST, rel, "index.html");
  return existsSync(file) ? readFileSync(file, "utf-8") : null;
};

describe("no surface presents a Red Deer office (owner, 2026-10-06)", () => {
  it("no source or llms file calls Red Deer an office or counts three offices", () => {
    const hits: string[] = [];
    for (const { file, text } of shippedCopy()) {
      for (const [label, pattern] of OFFICE_CLAIMS) {
        const m = pattern.exec(text);
        if (m) hits.push(`${file}: ${label} ("${text.slice(Math.max(0, m.index - 30), m.index + 50).replace(/\s+/g, " ")}")`);
      }
    }
    expect(hits, "Red Deer has no office until 2027").toEqual([]);
  });

  it("no source or llms file carries the listing's street address or the old 7-to-9 hours", () => {
    const hits: string[] = [];
    for (const { file, text } of shippedCopy()) {
      for (const pattern of [...LISTING_ADDRESS, ...OLD_HOURS]) {
        if (pattern.test(text)) hits.push(`${file}: ${pattern}`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("no built page shows the listing's street address, the old hours or a Red Deer office", () => {
    const pages = builtPages();
    if (!pages.length) return; // unbuilt tree
    const hits: string[] = [];
    for (const { url, html } of pages) {
      const text = visible(html);
      for (const pattern of [...LISTING_ADDRESS, OLD_HOURS[0], ...OFFICE_CLAIMS.map(([, p]) => p)]) {
        if (pattern.test(text)) hits.push(`${url}: ${pattern}`);
      }
      // The JSON-LD too: no node may carry the listing's street or postal code.
      for (const m of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
        if (LISTING_ADDRESS.some((p) => p.test(m[1])) || /07:00/.test(m[1])) hits.push(`${url}: JSON-LD`);
      }
    }
    expect(hits).toEqual([]);
  });

  it("the Red Deer page says a Red Deer office opens in 2027 and keeps its phone", () => {
    expect(RED_DEER_OPENS_LINE).toBe("A Red Deer office opens in 2027.");
    const code = stripComments(readFileSync(join(SRC, "pages", "locations", "RedDeer.tsx"), "utf-8"));
    expect(code, "the Red Deer page does not state the opening year").toMatch(/\{RED_DEER_OPENS_LINE\}/);
    expect(code, "the Red Deer page lost its phone").toMatch(/href=\{OFFICE\.phoneLink\}/);
    const html = pageHtml("cleaning-services-red-deer");
    if (!html) return; // unbuilt tree
    const text = visible(html);
    expect(text).toContain(RED_DEER_OPENS_LINE);
    expect(text).toContain(CITY_PROOF.reddeer.phone);
    expect(html).toContain(`href="${CITY_PROOF.reddeer.phoneLink}"`);
  });
});

describe("the footer (owner, 2026-10-06)", () => {
  const footer = stripComments(readFileSync(join(SRC, "components", "Footer.tsx"), "utf-8"));

  /** The tel: links inside the footer's #offices block, in order. */
  const officeOrder = (html: string) => {
    const start = html.indexOf('id="offices"');
    const end = html.indexOf("</footer>", start);
    const block = start < 0 ? "" : html.slice(start, end);
    return [...block.matchAll(/href="(tel:\d+)"/g)].map((m) => m[1]);
  };

  it("lists the page's own branch office first, ordered from the path", () => {
    // From the path, never the remembered branch: the prerender and crawlers
    // must see the page's own order.
    expect(footer).toMatch(/footerOfficeOrder\(pageBranch\)\.map/);
    expect(footer).not.toMatch(/footerOfficeOrder\(remembered\)|footerOfficeOrder\(shownBranch\)/);
    const orderFor = (path: string) => footerOfficeOrder(explicitBranchFromPath(path));
    expect(orderFor("/cleaning-services-calgary/")).toEqual(["calgary", "edmonton", "reddeer"]);
    expect(orderFor("/locations/mahogany/")).toEqual(["calgary", "edmonton", "reddeer"]);
    expect(orderFor("/")).toEqual(["edmonton", "calgary", "reddeer"]);
    expect(orderFor("/cleaning-services-red-deer/")).toEqual(["edmonton", "reddeer", "calgary"]);
    expect(orderFor("/about-us/")).toEqual(["edmonton", "calgary", "reddeer"]);

    const { edmonton, calgary, reddeer } = CITY_PROOF;
    const cases: Array<[string, string[]]> = [
      ["cleaning-services-calgary", [calgary.phoneLink, edmonton.phoneLink, reddeer.phoneLink]],
      ["", [edmonton.phoneLink, calgary.phoneLink, reddeer.phoneLink]],
      ["cleaning-services-red-deer", [edmonton.phoneLink, reddeer.phoneLink, calgary.phoneLink]],
      ["about-us", [edmonton.phoneLink, calgary.phoneLink, reddeer.phoneLink]],
    ];
    for (const [rel, expected] of cases) {
      const html = pageHtml(rel);
      if (!html) continue; // unbuilt tree
      expect(officeOrder(html), `/${rel}${rel ? "/" : ""} footer office order`).toEqual(expected);
    }
  });

  it("never lists e-transfer under the card charged after the clean", () => {
    // The two badges sit side by side: "Card Charged After Your Clean" and
    // the accepted cards. E-transfer is paid the day before, so it has its
    // own line instead.
    const badges = /Card Charged[\s\S]*?<CreditCard[^>]*\/>\s*<span>([\s\S]*?)<\/span>/.exec(footer);
    expect(badges, "the footer payment badges are missing").not.toBeNull();
    expect(badges![1], "e-transfer is listed beside 'charged after'").not.toMatch(/e-?transfer/i);
    expect(footer).toMatch(/E-transfer: arranged by phone, paid the day before/);
  });
});
