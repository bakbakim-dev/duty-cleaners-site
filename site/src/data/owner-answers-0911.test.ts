import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { getService, recurringVisitRows } from "./pricing";
import { benefitForExtra } from "@/lib/bk-extras";
import { addOnTableRows } from "./addon-table";
import { NOT_INCLUDED, POLICY } from "./policy";

/**
 * The owner's answers of 11 September 2026, held in place.
 *
 * - The deposit: Alberta's rule is not "returned within 10 days". The landlord
 *   returns the deposit, or the balance with a statement of deductions, within
 *   10 days of the tenant giving up possession, and an estimate is allowed with
 *   the final statement within 30 days (alberta.ca/ending-a-tenancy, checked
 *   2026-09-11). Seventeen pages stated only the first half.
 * - The $15 option is "optional alternative products". The cleaners are
 *   subcontractors who choose their own products, so nothing supports calling
 *   them eco-friendly or green.
 * - The tables stop at five bedrooms; six and seven are priced in the quote.
 * - Interior windows and wall washing are paid add-ons on a move-out.
 * - Red Deer is served ("yes i serve it").
 * - The balcony / garage sweep is a real add-on, offered mostly in summer; the
 *   Edmonton price list had filtered it out of its add-on table.
 * - Walls are an add-on, so the Edmonton services hub's move-out card no
 *   longer lists "the kitchen walls".
 * - How to ask for alternative products is policy.ts's sentence
 *   (ecoProductsHowToRequest), not one retyped on 14 location pages, and the
 *   fee is stated before GST.
 * - A garage exclusion names the sweep add-on, and the add-on's own line says
 *   it is a sweep, not a garage clean.
 * - The recurring visit table prints cents in every cell.
 *
 * Comments are stripped before scanning, so a note may cite what used to be
 * there.
 */

const SRC = join(__dirname, "..");
const PUBLIC = join(SRC, "..", "public");

const stripComments = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

function walk(dir: string, keep: (name: string) => boolean): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full, keep));
    else if (keep(e.name)) out.push(full);
  }
  return out;
}

const rel = (full: string) => full.slice(SRC.length + 1).replace(/\\/g, "/");
const pageAndComponentFiles = () => [
  ...walk(join(SRC, "pages"), (n) => n.endsWith(".tsx")),
  ...walk(join(SRC, "components"), (n) => n.endsWith(".tsx")),
];
const dataFiles = () => walk(join(SRC, "data"), (n) => n.endsWith(".ts") && !n.endsWith(".test.ts"));
const llmsFiles = () => ["llms.txt", "llms-full.txt"].map((n) => join(PUBLIC, n));
const read = (full: string) => (full.endsWith(".txt") ? readFileSync(full, "utf-8") : stripComments(readFileSync(full, "utf-8")));

/** Source text as a reader sees it: JSX spacing resolved, tags dropped, one line. */
const prose = (s: string) =>
  s.replace(/\{" "\}/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

describe("the owner's answers of 2026-09-11", () => {
  it("no page states the 10-day deposit rule without the deductions it allows", () => {
    const hits: string[] = [];
    for (const full of pageAndComponentFiles()) {
      const text = prose(read(full));
      for (const sentence of text.split(/(?<=[.?!])\s+|[`"]/)) {
        if (!/\b(?:10|ten) days\b/i.test(sentence)) continue;
        if (!/deposit|moves? out|moving out|tenan/i.test(sentence)) continue;
        if (!/deduction/i.test(sentence)) hits.push(`${rel(full)}: "${sentence.trim().slice(0, 160)}"`);
      }
    }
    expect(hits, "the 10-day rule stated without the statement of deductions (alberta.ca/ending-a-tenancy)").toEqual([]);
  });

  it("no page, data file or llms file sells eco-friendly or green products", () => {
    const CLAIM = /eco-?friendly|eco products|green products/i;
    const hits: string[] = [];
    for (const full of [...pageAndComponentFiles(), ...dataFiles(), ...llmsFiles()]) {
      const text = read(full);
      const m = CLAIM.exec(text);
      if (m) hits.push(`${rel(full)}: "${text.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, " ")}"`);
    }
    expect(hits, "the $15 option is 'optional alternative products' (owner, 2026-09-11)").toEqual([]);
    expect(POLICY.ecoProductsHowToRequest).toMatch(/which products are available and suitable for your surfaces/);
  });

  it("no page describes the top tier as five or more bedrooms", () => {
    const hits: string[] = [];
    for (const full of pageAndComponentFiles()) {
      const m = /five-or-more|five or more|5\+ ?bed/i.exec(read(full));
      if (m) hits.push(`${rel(full)}: "${m[0]}"`);
    }
    expect(hits, "the tables stop at 5 Bedroom; six and seven are priced in the quote form").toEqual([]);
  });

  it("the move-out inclusions leave interior windows and walls to the add-ons", () => {
    const inclusions = getService("move-in-out").inclusions;
    expect(inclusions.length, "the move-in-out service lost its inclusions").toBeGreaterThan(0);
    const bad = inclusions.filter(
      (line) =>
        /glass|interior window|inside window/i.test(line) ||
        (/window/i.test(line) && !/sills?|tracks?/i.test(line)) ||
        /\bwalls?\b/i.test(line),
    );
    expect(bad, "interior window cleaning and wall washing are paid add-ons on a move-out").toEqual([]);
  });

  it("nothing says Red Deer is not served", () => {
    const DENIAL = /(?:do|does|will) not (?:serve|clean in|cover) Red Deer|Red Deer is not (?:served|covered)|not serving Red Deer/i;
    const hits: string[] = [];
    for (const full of [
      ...pageAndComponentFiles(),
      ...dataFiles(),
      ...walk(join(SRC, "lib"), (n) => n.endsWith(".ts") && !n.endsWith(".test.ts")),
      ...llmsFiles(),
    ]) {
      const m = DENIAL.exec(prose(read(full)));
      if (m) hits.push(`${rel(full)}: "${m[0]}"`);
    }
    expect(hits, "the owner serves Red Deer from its own office").toEqual([]);
  });

  it("the Edmonton price list shows the balcony / garage sweep add-on", () => {
    const rows = addOnTableRows("edmonton");
    expect(rows.some((r) => /garage/i.test(r.service)), "bk-config no longer carries the sweep; update this guard").toBe(true);
    const src = stripComments(readFileSync(join(SRC, "pages", "EdmontonPricing.tsx"), "utf-8"));
    const decl = /const addOnServices\s*=\s*([^;]+);/.exec(src)?.[1] ?? "";
    expect(decl, "EdmontonPricing no longer declares addOnServices; point this guard at its add-on table").toContain('addOnTableRows("edmonton")');
    expect(decl, "the Edmonton add-on table filters rows out").not.toMatch(/filter|garage/i);
    expect(prose(src), "the sweep's season is not stated on the Edmonton price list").toMatch(/mostly in summer/i);
    expect(NOT_INCLUDED.join(" "), "policy T7 no longer names the sweep exception").toMatch(/garage sweep add-on, available mostly in summer/);
  });

  it("location pages take the alternative-products request from policy.ts, with the fee before GST", () => {
    const howTo = String(POLICY.ecoProductsHowToRequest);
    const typed: string[] = [];
    const noGst: string[] = [];
    for (const full of walk(join(SRC, "pages", "locations"), (n) => n.endsWith(".tsx"))) {
      const text = prose(read(full));
      if (text.includes(howTo)) typed.push(rel(full));
      for (const m of text.matchAll(/ecoProductsFee\}([^.]*)/g)) {
        if (!/before GST/.test(m[1])) noGst.push(`${rel(full)}: "...ecoProductsFee}${m[1].slice(0, 80)}"`);
      }
    }
    expect(typed, "the request clause is hand-typed; use ${POLICY.ecoProductsHowToRequest}").toEqual([]);
    expect(noGst, "the $15 fee is stated without 'before GST'").toEqual([]);
  });

  it("the balcony / garage sweep says it is a sweep only, in season", () => {
    const line = benefitForExtra("sweep only of garage or balcony");
    expect(line).toMatch(/sweep only/i);
    expect(line).toMatch(/not a full garage clean/i);
    expect(line).toMatch(/mostly in summer/i);
  });

  it("no location page or blog post excludes garages without naming the sweep add-on", () => {
    // Scoped to the location pages and blog posts; the service pages carry
    // their own exclusion lists (EdmontonMarchOut.tsx still had a bare one).
    const files = [
      ...walk(join(SRC, "pages", "locations"), (n) => n.endsWith(".tsx")),
      ...walk(join(SRC, "pages"), (n) => /^Blog.*\.tsx$/.test(n)),
    ];
    const hits: string[] = [];
    for (const full of files) {
      for (const sentence of prose(read(full)).split(/(?<=[.?!])\s+|[`"]/)) {
        if (/\b(?:not|never|nor|exclud\w*)\b[^.]*\bgarages\b|\bgarages\b[^.]*\b(?:not|exclud\w*)\b/i.test(sentence) && !/sweep/i.test(sentence)) {
          hits.push(`${rel(full)}: "${sentence.trim().slice(0, 160)}"`);
        }
      }
    }
    expect(hits, "the balcony or garage sweep add-on is offered mostly in summer (owner, 2026-09-11)").toEqual([]);
  });

  it("the recurring visit table prints every price with cents", () => {
    const rows = recurringVisitRows([0, 1, 2, 3, 4]);
    expect(rows.length).toBeGreaterThan(0);
    const cells = rows.flatMap((r) => [r.firstVisit, ...r.visits.map((v) => v.price)]);
    expect(cells.filter((c) => !/^\$[\d,]+\.\d{2}$/.test(c)), "mixed '$227' and '$123.99' in one table").toEqual([]);
  });

  it("the Edmonton services page lists no kitchen walls in a move-out", () => {
    const src = stripComments(readFileSync(join(SRC, "pages", "EdmontonServices.tsx"), "utf-8"));
    expect(src.toLowerCase(), "walls are an add-on, not part of a move-out clean").not.toContain("kitchen walls");
  });
});
