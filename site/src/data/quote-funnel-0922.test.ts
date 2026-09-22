import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Quote funnel guards added on 2026-09-22 (owner).
 *
 * 1. The travel fee is in the funnel's price. It used to appear only if the
 *    customer ticked BookingKoala's box, so a nearby-town price rose at
 *    checkout or skipped the fee. "Where is the home?" now decides it, the
 *    price includes it, and the handoff ticks the same BookingKoala row.
 * 2. The answer is required: without it the funnel cannot name the office or
 *    know whether the fee applies.
 * 3. One main button on the last screen. The call-back stays, smaller, under
 *    "Choose my time" (an equal outline button competed with it).
 * 4. The last screen stays short on a phone, and makes no claim that a card
 *    hold "moves no money": on a debit card the held amount is unavailable.
 */
const ROOT = join(__dirname, "..", "..");

function codeOf(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf-8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");
}

const FLOW = "src/components/quote/QuoteFlow.tsx";

describe("the travel fee is in the funnel's price", () => {
  it("a home outside city limits carries BookingKoala's travel-fee row into the price and the handoff", () => {
    const src = codeOf(FLOW);
    expect(src).toMatch(/const travelFeeExtra = area\?\.outside === true \? travelFeeRow : null;/);
    expect(src).toMatch(/const firstCleanTotal = \(deepFirstCleanBase \?\? quote\.firstClean\) \+ addOnTotal \+ travelFeeAmount;/);
    expect(src, "the booking page would not tick the fee the price includes").toMatch(
      /for \(const row of chargeRows\) basket\[row\.extra\.name\] = row\.quantity;/,
    );
    expect(src).toMatch(/recurringExtraTotals\(chargeRows, quote\.discountPct\)/);
  });

  it("step 1 asks no location question, and a general page claims no branch for the lead", () => {
    // Owner, 2026-09-22: the step-1 "Where is the home?" answer only became a
    // GoHighLevel tag no workflow reads, so it was dropped.
    const src = codeOf(FLOW);
    expect(src).not.toContain("Where is the home?");
    expect(src).toMatch(/city: area\?\.general \? "" : proof\.key,/);
    expect(src).toMatch(/Is the home inside \{limitsCity\(area, "or"\)\} city limits\?/);
  });

  it("the price step requires an answer to 'inside city limits?', beside pets, not an opt-in add-on", () => {
    const src = codeOf(FLOW);
    expect(src).toMatch(/const missLimits = travelFeeOffered !== null && area !== null && area\.outside === null;/);
    expect(src).toContain("city limits?");
    expect(src).toMatch(/No, a nearby town \(\+\$\{formatPrice\(travelFeeOffered\)\}\)/);
  });
});

describe("the overlay header shows the office the visitor chose", () => {
  it("the Call button and phone line follow the answer, not the page", () => {
    const flow = codeOf(FLOW);
    const overlay = codeOf("src/components/QuoteOverlay.tsx");
    expect(flow).toMatch(/setQuoteBranch\(area && !area\.general \? area\.branch : null\)/);
    expect(overlay).toMatch(/chosenBranch \? CITY_PROOF\[chosenBranch\] : cityProofFor\(pathname\)/);
  });
});

describe("one main button on the last screen", () => {
  it("the call-back is a smaller control under Choose my time, not an equal button beside it", () => {
    const src = codeOf(FLOW);
    expect(src).not.toContain("Ask us to call me instead");
    expect(src).toMatch(/Choose my time[\s\S]{0,300}<button\s+type="button"\s+onClick=\{requestCallback\}/);
  });
});

describe("no page says a card hold moves no money", () => {
  it("the site, the policy source and the llms files describe a hold accurately", () => {
    const files = [
      "src/data/policy.ts", "public/llms.txt", "public/llms-full.txt", "src/pages/FAQ.tsx",
      "src/pages/EdmontonRegularCleaning.tsx", "src/pages/EdmontonRecurringCleaning.tsx",
      "src/pages/locations/RedDeer.tsx", "src/pages/locations/Airdrie.tsx", "src/pages/locations/Beaumont.tsx",
      "src/pages/locations/Devon.tsx", "src/pages/locations/Southwood.tsx",
    ];
    const offenders = files.filter((file) => /no money moves|moves no money/i.test(codeOf(file)));
    expect(offenders).toEqual([]);
  });
});

describe("the last screen stays short and accurate", () => {
  it("no hold claim, no arrival-window or comment-section explainer", () => {
    const src = codeOf(FLOW);
    expect(src).not.toMatch(/moves no money/i);
    expect(src).not.toMatch(/comment section/i);
    expect(src).not.toMatch(/ARRIVAL_WINDOWS/);
    expect(src).not.toMatch(/What happens next/);
  });
});
