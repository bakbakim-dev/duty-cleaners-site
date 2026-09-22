import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

/**
 * Owner, 2026-09-22: a clean is booked as one visit, the price is set by home
 * size for the condition the customer describes, much more work than
 * described is agreed before it is done, and work beyond the booked visit is
 * quoted and scheduled separately by phone or email.
 *
 * The site used to promise the opposite on some 150 pages ("we work to a
 * checklist, not a clock", "the team stays until every task is complete",
 * "your flat rate does not change based on how long it takes", "the price is
 * flat whatever the time"), handing a customer an argument against any fair
 * extra charge. People accept an extra charge when it is tied to extra work
 * and follows a rule they were told first (Kahneman, Knetsch & Thaler 1986;
 * Bolton, Warlop & Alba 2003); they fight one that contradicts a promise.
 */
const ROOT = join(__dirname, "..", "..");

function codeOf(path: string): string {
  const text = readFileSync(path, "utf-8");
  if (!/\.(tsx?|jsx?)$/.test(path)) return text;
  return text
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.(tsx|ts)$/.test(name) && !/\.test\.ts$/.test(name) ? [path] : [];
  });
}

const FILES = [
  ...walk(join(ROOT, "src", "pages")),
  ...walk(join(ROOT, "src", "components")),
  join(ROOT, "src", "data", "policy.ts"),
  join(ROOT, "public", "llms.txt"),
  join(ROOT, "public", "llms-full.txt"),
];

const PROMISES: RegExp[] = [
  /not a clock/i,
  /stays? until (every|each|the checklist|it is done|the job|the whole)/i,
  /does not leave until/i,
  /however long (the clean|it takes|the hand-work)/i,
  /(does not|doesn't|won't|will not|never) (change|rise)[^.]{0,60}(longer|ran long|runs long|how long|the time)/i,
  /whatever the time/i,
  /costs the same whether the clean/i,
  /a longer visit costs the same/i,
];

describe("no page promises unlimited time for a set price", () => {
  it("no page, component, policy line or llms file says the team stays until done or the price holds however long it takes", () => {
    const offenders: string[] = [];
    for (const file of FILES) {
      const text = codeOf(file);
      for (const pattern of PROMISES) {
        const match = text.match(pattern);
        if (match) offenders.push(`${file.slice(ROOT.length + 1)}: "${match[0]}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("the funnel and the published terms state the extra-work rule before the customer books", () => {
    const flow = codeOf(join(ROOT, "src/components/quote/QuoteFlow.tsx"));
    // The price card lines were removed as clutter (owner, 2026-09-22); the rule
    // stays where the customer states the condition, on the cleanliness question.
    expect(flow).toContain("your price is for the condition you describe here");
    expect(flow).toContain("Much more work than this is agreed with you before it is done.");
    const policy = codeOf(join(ROOT, "src/data/policy.ts"));
    expect(policy).toContain("any extra charge is agreed with you before that work is done");
    expect(policy).toContain("A clean is booked as one visit.");
  });
});
