import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { CITY_PROOF } from "./proof";

/**
 * Structured-data guards, from the six-dimension site audit.
 *
 * 809 JSON-LD blocks ship across 209 pages and every one of them parsed, so the
 * markup was not broken. What it was, in one place, was inconsistent: three
 * pages declared `https://dutycleaners.ca/#edmonton` with the telephone
 * "+1-7809136565" while the other 208 declared the same @id with
 * "+1-780-913-6565". /contact-us/ built its value as
 * `phoneLink.replace("tel:", "+1-")` instead of using the formatted constant,
 * so the graph asserted one business with two different phone numbers.
 *
 * An @id is a promise that every mention describes the same entity. Two
 * descriptions that disagree is exactly the NAP inconsistency local search
 * treats as a trust signal, and no test looked at it — the E.164 number was
 * hard-coded in eight files, which is what let one of them drift.
 *
 * These run against dist/, the markup a crawler actually receives.
 */

const DIST = join(__dirname, "..", "..", "dist");

type Node = Record<string, unknown>;

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

/** Every node in every ld+json block, flattening @graph and top-level arrays. */
function nodesOf(html: string): Node[] {
  const out: Node[] = [];
  for (const m of html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )) {
    let parsed: unknown;
    try {
      parsed = JSON.parse(m[1].trim());
    } catch {
      out.push({ __parseError: m[1].trim().slice(0, 120) });
      continue;
    }
    for (const top of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!top || typeof top !== "object") continue;
      const graph = (top as Node)["@graph"];
      for (const n of Array.isArray(graph) ? graph : [top]) {
        if (n && typeof n === "object") out.push(n as Node);
      }
    }
  }
  return out;
}

const visibleText = (html: string) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

describe("structured data", () => {
  it("every ld+json block parses", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      for (const n of nodesOf(html)) {
        if (n.__parseError) bad.push(`${url}: ${String(n.__parseError)}`);
      }
    }
    expect(
      bad,
      `Unparseable JSON-LD:\n${bad.join("\n")}\n` +
        `A block that does not parse is a block Google discards silently.`,
    ).toEqual([]);
  });

  it("one @id never describes two different businesses", () => {
    // The properties that make a NAP. If two nodes share an @id, these must agree.
    const NAP = ["name", "telephone", "email", "url"] as const;
    const seen = new Map<string, { url: string; values: Record<string, string> }>();
    const conflicts: string[] = [];
    for (const { url, html } of pages()) {
      for (const n of nodesOf(html)) {
        const id = typeof n["@id"] === "string" ? (n["@id"] as string) : null;
        if (!id) continue;
        const values: Record<string, string> = {};
        for (const k of NAP) if (typeof n[k] === "string") values[k] = n[k] as string;
        if (Object.keys(values).length === 0) continue;
        const first = seen.get(id);
        if (!first) {
          seen.set(id, { url, values });
          continue;
        }
        for (const k of NAP) {
          if (values[k] && first.values[k] && values[k] !== first.values[k]) {
            conflicts.push(
              `${id}\n    ${first.url} says ${k}="${first.values[k]}"\n    ${url} says ${k}="${values[k]}"`,
            );
          }
        }
      }
    }
    expect(
      [...new Set(conflicts)],
      `The same @id is described two different ways:\n${[...new Set(conflicts)].join("\n")}\n` +
        `An @id says "this is the same entity". Two mentions that disagree on ` +
        `name, phone, email or url is the NAP inconsistency local search reads ` +
        `as a reason to trust the listing less.`,
    ).toEqual([]);
  });

  it("every schema telephone is one of the two real numbers, in one format", () => {
    const allowed = new Set([CITY_PROOF.edmonton.phoneE164, CITY_PROOF.calgary.phoneE164]);
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      for (const n of nodesOf(html)) {
        const t = n.telephone;
        if (typeof t === "string" && !allowed.has(t)) bad.push(`${url}: "${t}"`);
      }
    }
    expect(
      [...new Set(bad)],
      `Schema telephone values that are not the canonical E.164 form:\n${[...new Set(bad)].join("\n")}\n` +
        `The two real numbers are ${CITY_PROOF.edmonton.phoneE164} and ` +
        `${CITY_PROOF.calgary.phoneE164}, both in data/proof.ts. Read them from ` +
        `there rather than writing the digits again.`,
    ).toEqual([]);
  });

  it("a page never publishes the other city's phone number in schema", () => {
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      const text = visibleText(html);
      const edm = text.includes("780-913-6565") || text.includes("(780) 913-6565");
      const cal = text.includes("403-768-1341") || text.includes("(403) 768-1341");
      if (edm === cal) continue; // both or neither — no single city to contradict
      const city = edm ? "edmonton" : "calgary";
      const wrong = edm ? CITY_PROOF.calgary.phoneE164 : CITY_PROOF.edmonton.phoneE164;
      for (const n of nodesOf(html)) {
        if (n.telephone === wrong) bad.push(`${url} shows the ${city} number but its schema says ${wrong}`);
      }
    }
    expect(
      bad,
      `Schema contradicting the page:\n${bad.join("\n")}\n` +
        `A visitor is told one number and a crawler another.`,
    ).toEqual([]);
  });

  it("no aggregateRating without the rating visible on the page", () => {
    // Currently zero blocks carry one. Pinned because review markup that the
    // page does not itself show is a manual-action risk, not a ranking win.
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      const text = visibleText(html);
      for (const n of nodesOf(html)) {
        const ar = n.aggregateRating as Node | undefined;
        if (!ar || typeof ar !== "object") continue;
        const value = String(ar.ratingValue ?? "");
        const count = String(ar.reviewCount ?? ar.ratingCount ?? "");
        if (value && !text.includes(value)) bad.push(`${url}: ratingValue ${value} is not shown on the page`);
        else if (count && !text.includes(count)) bad.push(`${url}: review count ${count} is not shown on the page`);
      }
    }
    expect(
      bad,
      `Review markup with nothing behind it:\n${bad.join("\n")}\n` +
        `Google requires the rating to be visible to the user on the page ` +
        `carrying the markup.`,
    ).toEqual([]);
  });

  it("every LocalBusiness carries the properties that make it useful", () => {
    const REQUIRED = ["name", "telephone", "address", "url"];
    const bad: string[] = [];
    for (const { url, html } of pages()) {
      for (const n of nodesOf(html)) {
        const t = n["@type"];
        const types = Array.isArray(t) ? t : [t];
        if (!types.includes("LocalBusiness")) continue;
        const missing = REQUIRED.filter((k) => !n[k]);
        if (missing.length) bad.push(`${url}: LocalBusiness missing ${missing.join(", ")}`);
      }
    }
    expect(
      [...new Set(bad)],
      `Incomplete LocalBusiness nodes:\n${[...new Set(bad)].join("\n")}\n` +
        `175 pages once shipped a LocalBusiness with no address at all.`,
    ).toEqual([]);
  });
});

describe("NAP consistency in what the visitor sees", () => {
  /**
   * The schema was not the only place the number appeared in two shapes. The
   * rendered pages carried "(780) 913-6565" 370 times and a bare
   * "780-913-6565" 310 times, while Calgary was always "(403) 768-1341" — one
   * business, two house styles for one of its two branches. The site-wide
   * cause was Navigation.tsx, which wrote both numbers out by hand and gave
   * only Calgary its parentheses:
   *
   *   const phone = city === "calgary" ? "(403) 768-1341" : "780-913-6565";
   *
   * Four tel: hrefs were hyphenated where the other 400 were bare digits.
   *
   * Name, address and phone are the three things a local listing is matched
   * on. Presenting one of them two ways is the inconsistency that costs
   * nothing to avoid and is invisible until someone counts.
   */
  const DISPLAY = [CITY_PROOF.edmonton.phone, CITY_PROOF.calgary.phone];
  const TEL = [CITY_PROOF.edmonton.phoneLink, CITY_PROOF.calgary.phoneLink];
  const PHONE_LIKE = /\(?\b(?:780|403)\)?[\s.-]?\d{3}[\s.-]?\d{4}/g;

  const visible = (html: string) =>
    html
      .replace(/<script[\s\S]*?<\/script>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/\s+/g, " ");

  it("every phone number a visitor reads is in the canonical format", () => {
    const bad = new Map<string, string[]>();
    for (const { url, html } of pages()) {
      for (const m of visible(html).matchAll(PHONE_LIKE)) {
        if (DISPLAY.includes(m[0])) continue;
        if (!bad.has(m[0])) bad.set(m[0], []);
        const where = bad.get(m[0])!;
        if (where.length < 4 && !where.includes(url)) where.push(url);
      }
    }
    const lines = [...bad.entries()].map(([v, urls]) => `"${v}" on ${urls.join(", ")}`);
    expect(
      lines,
      `Phone numbers shown in a format other than the canonical one:\n${lines.join("\n")}\n` +
        `The two are "${DISPLAY[0]}" and "${DISPLAY[1]}", both in data/proof.ts.`,
    ).toEqual([]);
  });

  it("every tel: href uses the canonical link", () => {
    const bad = new Map<string, string[]>();
    for (const { url, html } of pages()) {
      for (const m of html.matchAll(/href="(tel:[^"]*)"/g)) {
        if (TEL.includes(m[1])) continue;
        if (!bad.has(m[1])) bad.set(m[1], []);
        const where = bad.get(m[1])!;
        if (where.length < 4 && !where.includes(url)) where.push(url);
      }
    }
    const lines = [...bad.entries()].map(([v, urls]) => `"${v}" on ${urls.join(", ")}`);
    expect(
      lines,
      `tel: hrefs that are not the canonical link:\n${lines.join("\n")}\n` +
        `Use CITY_PROOF[city].phoneLink.`,
    ).toEqual([]);
  });
});
