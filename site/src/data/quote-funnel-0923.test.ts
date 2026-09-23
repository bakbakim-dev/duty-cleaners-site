import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SERVICES } from "@/data/pricing";
import { FLEXIBILITY_OPTIONS } from "@/lib/booking-details";

/**
 * Quote funnel guards added on 2026-09-23 (owner).
 *
 * 1. Step 1's cards: Standard is not pitched as "for a home already in good
 *    shape" (reads as needing a deep clean first), Move In / Move Out says what
 *    it covers instead of "handover-day", and the Deep card names no cobwebs.
 * 2. On a phone, answering pets scrolled straight to the add-ons, past "inside
 *    city limits". An answer now moves to the next unanswered question.
 * 3. The flexibility question comes before the visitor picks a slot, so its
 *    buttons speak plainly; BookingKoala's own labels still travel on.
 * 4. The bedroom size cap ("under 1,700 sq ft") shows on every chip.
 */
const ROOT = join(__dirname, "..", "..");
const FLOW = "src/components/quote/QuoteFlow.tsx";
const codeOf = (file: string) => readFileSync(join(ROOT, file), "utf8");

describe("step 1 service cards", () => {
  it("say what each clean covers, without the rejected lines", () => {
    const standard = SERVICES.find((s) => s.id === "standard")!.blurb;
    const move = SERVICES.find((s) => s.id === "move-in-out")!.blurb;
    expect(standard).not.toMatch(/good shape/i);
    expect(move).not.toMatch(/handover/i);
    expect(move).toMatch(/everything in a standard clean, plus/i);
    const deepCard = codeOf(FLOW).match(/label: "Deep Cleaning",\s*blurb: "([^"]+)"/)?.[1] ?? "";
    expect(deepCard).toMatch(/Everything in a standard clean, plus/);
    expect(deepCard).not.toMatch(/cobweb/i);
  });
});

describe("answers on the price step", () => {
  it("move to the next unanswered question, never straight past city limits", () => {
    const src = codeOf(FLOW);
    expect(src).toMatch(/guideToNext\("pets"\)/);
    expect(src).not.toMatch(/peek\(shelfRef\)/);
    expect(src).toMatch(/const next = \[\.\.\.order\.slice\(at \+ 1\), \.\.\.order\.slice\(0, at\)\]\.find\(\(key\) => open\[key\]\)/);
  });
});

describe("the flexibility question", () => {
  it("shows plain buttons and a lead-in, and still sends BookingKoala's labels", () => {
    for (const option of FLEXIBILITY_OPTIONS) {
      expect(option.display).not.toMatch(/comment section/i);
      expect(option.label).toMatch(/flexible|Flexible/);
    }
    const src = codeOf(FLOW);
    expect(src).toMatch(/\{option\.display\}/);
    expect(src).toMatch(/You pick your date and time on the next page/);
  });
});

describe("the bedroom picker", () => {
  it("puts the size cap on every chip, not only in a caption", () => {
    const src = codeOf(FLOW);
    expect(src).toMatch(/const sub = \(\/sq\\s\*ft\/i\.test\(match\?\.\[2\] \?\? ""\) \? match\?\.\[2\] : undefined\)/);
    // \D* swallowed "(Under", so the cap was never captured at all.
    expect(src).toMatch(/option\.label\.match\(\/\^\(\\d\+\)\[\^\(\]\*/);
  });
});

describe("round two: the same honest rewards on every step", () => {
  it("the details pane counts its four answers and moves to the next open one", () => {
    const src = codeOf(FLOW);
    expect(src).toMatch(/if \(first\) guideDetails\("cleanliness"\)/);
    expect(src).toMatch(/of \$\{detailAnswers\.length\} answered/);
  });
  it("the price card ticks in only the visitor's real answers, beside the price", () => {
    const src = codeOf(FLOW);
    const tally = src.match(/<ul className="funnel-tally[\s\S]*?<\/ul>/)?.[0] ?? "";
    expect(tally).toMatch(/\$\{bedrooms\} bedroom/);
    // No invented work: no timers, no random items, nothing hides the figure.
    expect(tally).not.toMatch(/setTimeout|Math\.random/);
    expect(codeOf("src/index.css")).toMatch(/@media \(prefers-reduced-motion: no-preference\) \{\s*\.funnel-tally li/);
  });
});
