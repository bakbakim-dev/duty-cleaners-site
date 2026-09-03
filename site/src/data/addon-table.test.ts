import { describe, expect, it } from "vitest";

import { addOnTableRows } from "./addon-table";
import { HOURLY_RATE, flatRateFromPrice } from "./pricing";

/**
 * Build assertion: the marketing pricing pages render these rows directly, so
 * a stale or empty derivation must fail the build rather than publish a price
 * the booking form disagrees with.
 */
describe("derived add-on table", () => {
  it("publishes rows for both cities", () => {
    for (const city of ["edmonton", "calgary"] as const) {
      const rows = addOnTableRows(city);
      expect(rows.length).toBeGreaterThan(3);
      for (const row of rows) {
        expect(row.service.length).toBeGreaterThan(0);
        expect(row.standard).toMatch(/\$|Included/);
        // "Not offered" is the third legal answer, and it exists because the
        // other two are opposites: a move-out already cleans inside the fridge
        // and cabinets, but it is cleaned empty, so de-cluttering is not a
        // service it can carry. Printing "Included" for both cases told a
        // move-out customer to expect something they would never get.
        expect(row.moveInOut).toMatch(/\$|Included|Not offered/);
      }
    }
  });

  it("names the correct city on the travel-fee row", () => {
    const edmonton = addOnTableRows("edmonton").map((row) => row.service).join(" ");
    const calgary = addOnTableRows("calgary").map((row) => row.service).join(" ");
    expect(edmonton).not.toMatch(/Calgary/);
    expect(calgary).not.toMatch(/Edmonton/);
  });

  it("exposes non-zero headline rates for the pricing pages", () => {
    expect(HOURLY_RATE).toBeGreaterThan(0);
    expect(flatRateFromPrice()).toBeGreaterThan(0);
  });
});
