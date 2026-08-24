import { describe, expect, it } from "vitest";

import {
  deepCleanTierRows,
  moveInOutTierRows,
  standardTierRows,
} from "./pricing";

/**
 * Build assertion: every published price must be derived from bk-config. If
 * BookingKoala prices change, re-capture the snapshot — these assertions then
 * follow automatically instead of guarding hand-typed numbers.
 */

const money = (value: string) => Number(value.replace(/[^0-9.]/g, ""));

describe("derived pricing tables", () => {
  it("returns one row per published tier, ascending and non-zero", () => {
    for (const rows of [standardTierRows(), moveInOutTierRows()]) {
      expect(rows).toHaveLength(5);
      const values = rows.map((row) => money(row.price));
      expect(values.every((value) => value > 0)).toBe(true);
      expect([...values].sort((a, b) => a - b)).toEqual(values);
    }
  });

  it("keeps every table on the same home-size labels", () => {
    const labels = standardTierRows().map((row) => row.beds);
    expect(moveInOutTierRows().map((row) => row.beds)).toEqual(labels);
    expect(deepCleanTierRows().map((row) => row.beds)).toEqual(labels);
  });

  it("prices a deep clean as Standard plus the Deep Cleaning package", () => {
    const standard = standardTierRows();
    deepCleanTierRows().forEach((row, index) => {
      expect(row.standard).toBe(standard[index].price);
      expect(money(row.price)).toBe(money(row.standard) + money(row.packagePrice));
    });
  });

  it("prices a move in/out above the equivalent standard clean", () => {
    const standard = standardTierRows();
    moveInOutTierRows().forEach((row, index) => {
      expect(money(row.price)).toBeGreaterThan(money(standard[index].price));
    });
  });
});
