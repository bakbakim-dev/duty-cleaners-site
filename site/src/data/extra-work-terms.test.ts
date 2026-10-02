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
  // Audit of 2026-09-27: "it does not go up because a clean took longer" sat on
  // seven surfaces, including every location page, because no pattern above said "go up".
  /(do|does|will|would) not go up[^.]{0,60}(longer|took|how long|the time)/i,
  /(doesn't|won't|don't) go up[^.]{0,60}(longer|took|how long|the time)/i,
  // Review of 2026-10-01: 23 pages and llms.txt reworded the same promise past
  // every pattern above ("a clean that runs long costs the same", "the rate
  // holds if the visit runs long", "how long the clean takes does not change
  // it", "the time on site does not change the price", "a slow heritage room
  // does not raise the bill"). The owner's own "your price stays the same"
  // (priority list, EXTRA_WORK_TERM) names no length of time, so it passes.
  /(runs?|ran|running|takes?|took) long(er)?[^.]{0,60}(costs the same|stays the same|unchanged|holds|stays fixed)/i,
  /(costs the same|unchanged|holds|stays fixed|does not (move|grow|climb|change))[^.]{0,60}(runs? long|ran long|takes? longer|took longer|how long)/i,
  /(does not|doesn't|never) (move|grow|climb|change|raise)s?[^.]{0,40}(because[^.]{0,30}(slow|longer)|with how long)/i,
  /how long the (clean|crew|visit)[^.]{0,30}(does not|doesn't|never)/i,
  /the time the clean takes does not/i,
  /time on site does not/i,
  /not (by |to )?the clock/i,
  /costs? more for taking longer/i,
  /slow[^.]{0,30}(does not|doesn't) raise/i,
  /the hours do not/i,
];

const CARD_CHECK: RegExp[] = [
  /no money moves/i,
  /hold[^.]{0,40}(checks|confirms) (the|your) card/i,
  /(check|confirm) (that )?(it|the card) is valid/i,
];

const LOCKOUT_HALF = /(?<!up to )\bhalf (of what )?the (scheduled|cost of the scheduled)/i;

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

  it("no page describes the card hold as a check of the card", () => {
    // Owner, 2026-09-22 (PAYMENT_TERMS): the hold is for the price, and on a debit
    // card the amount is set aside. "A hold checks the card" or "no money moves"
    // tells a debit customer nothing is frozen. Review of 2026-10-01: 11 pages.
    const offenders: string[] = [];
    for (const file of FILES) {
      const text = codeOf(file);
      for (const pattern of CARD_CHECK) {
        const match = text.match(pattern);
        if (match) offenders.push(`${file.slice(ROOT.length + 1)}: "${match[0]}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("no page states the lockout charge as half without up to", () => {
    // Owner, 2026-09-25 (POLICY.lockoutFee): "up to half the cost of the scheduled
    // service". Review of 2026-10-01 found a flat "half" on four pages.
    const offenders: string[] = [];
    for (const file of FILES) {
      const match = codeOf(file).replace(/\s+/g, " ").match(LOCKOUT_HALF);
      if (match) offenders.push(`${file.slice(ROOT.length + 1)}: "${match[0]}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("the funnel and the published terms state the extra-work rule before the customer books", () => {
    const flow = codeOf(join(ROOT, "src/components/quote/QuoteFlow.tsx"));
    // The price card lines were removed as clutter (owner, 2026-09-22); the rule
    // stays where the customer states the condition, on the cleanliness question.
    expect(flow).toContain("your price is for the condition you describe here");
    expect(flow).toContain("If the home needs much more work than this, we contact you before any extra time, and you decide.");
    const policy = codeOf(join(ROOT, "src/data/policy.ts"));
    // Owner-approved wording, 2026-09-26: contact first, a halfway estimate, then
    // continue, add time or a priority list at the booked price.
    expect(policy).toContain("we'll contact you as soon as we know");
    expect(policy).toContain("we can't know the final total until it is finished");
    expect(policy).toContain("your price stays the same");
    expect(policy).not.toMatch(/most likely|tell you the new total/i);
    expect(policy).toContain("A clean is booked as one visit.");
  });
});
