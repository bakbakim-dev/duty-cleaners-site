import { describe, it, expect } from "vitest";
import {
  addOnsFor,
  bathroomOptions,
  bedroomOptions,
  calculateQuote,
  FREQUENCIES,
  halfBathOptions,
  homeTypeOptions,
  type QuoteInput,
} from "./pricing";

/**
 * The recurring price has to obey BookingKoala's two per-extra flags.
 *
 * Both were computed from bk-config and then never read: `calculateQuote`
 * discounted the whole subtotal, extras included. On a 3-bedroom weekly plan
 * with the Deep Cleaning package that quoted $265.03 a visit, when BookingKoala
 * charges $153.04 — the package is billed once, on the first visit, and is
 * exempt from frequency discounts, so it is not part of a recurring visit at
 * all. The site was advertising a recurring price for a service it would not
 * perform, and the customer would have found out at the booking screen.
 *
 *   firstVisitOnly      charged on visit 1 only  → absent from the ongoing price
 *   exemptFromDiscount  recurs, but at full price → added after the discount
 */

const weekly = FREQUENCIES.find((f) => Math.round(f.discount * 100) === 20);

/** A three-bedroom apartment, the archetypal basket. */
function baseInput(): QuoteInput {
  const beds = bedroomOptions("standard");
  return {
    service: "standard",
    homeType: homeTypeOptions("standard")[0].id,
    bedrooms: beds[2].value,
    bathrooms: bathroomOptions("standard")[0].value,
    halfBaths: halfBathOptions("standard")[0].value,
    frequency: weekly!.id,
    addOns: [],
  };
}

describe("recurring quotes honour BookingKoala's per-extra flags", () => {
  it("has a weekly frequency to test against", () => {
    expect(weekly).toBeDefined();
  });

  it("discounts the base clean by the frequency rate", () => {
    const q = calculateQuote(baseInput());
    expect(q.ongoing).not.toBeNull();
    expect(q.ongoing).toBeCloseTo(q.firstClean * (1 - weekly!.discount), 2);
    expect(q.firstVisitExtras).toBe(false);
  });

  it("leaves a first-visit-only extra out of the recurring price entirely", () => {
    const input = baseInput();
    const bedroomVariableId = bedroomOptions("standard").find(
      (o) => o.value === input.bedrooms,
    )!.id;
    const firstOnly = addOnsFor("standard", bedroomVariableId).find((a) => a.firstVisitOnly);
    expect(firstOnly, "bk-config should carry at least one first-visit-only extra").toBeDefined();

    const plain = calculateQuote(input);
    const withExtra = calculateQuote({ ...input, addOns: [firstOnly!.id] });

    // It is on the first clean...
    expect(withExtra.firstClean).toBeCloseTo(plain.firstClean + firstOnly!.price, 2);
    // ...and nowhere near the recurring one.
    expect(withExtra.ongoing).toBeCloseTo(plain.ongoing!, 2);
    expect(withExtra.firstVisitExtras).toBe(true);
  });

  it("charges a discount-exempt recurring extra at full price", () => {
    const input = baseInput();
    const bedroomVariableId = bedroomOptions("standard").find(
      (o) => o.value === input.bedrooms,
    )!.id;
    const exempt = addOnsFor("standard", bedroomVariableId).find(
      (a) => a.exemptFromDiscount && !a.firstVisitOnly,
    );
    if (!exempt) return; // bk-config need not carry this combination

    const plain = calculateQuote(input);
    const withExtra = calculateQuote({ ...input, addOns: [exempt.id] });

    // Full price on top of the discounted base, not discounted alongside it.
    expect(withExtra.ongoing).toBeCloseTo(plain.ongoing! + exempt.price, 2);
  });

  it("never quotes a recurring visit above the first clean", () => {
    const input = baseInput();
    const bedroomVariableId = bedroomOptions("standard").find(
      (o) => o.value === input.bedrooms,
    )!.id;
    for (const addOn of addOnsFor("standard", bedroomVariableId)) {
      const q = calculateQuote({ ...input, addOns: [addOn.id] });
      expect(
        q.ongoing!,
        `${addOn.label}: ongoing ${q.ongoing} exceeds first clean ${q.firstClean}`,
      ).toBeLessThanOrEqual(q.firstClean);
    }
  });
});
