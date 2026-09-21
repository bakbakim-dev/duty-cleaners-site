import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync } from "node:fs";

import {
  calculateQuote,
  deepCleanTierRows,
  homeTypeOptions,
  moveInOutTierRows,
  PRICING_TIERS,
  standardTierRows,
  withGst,
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

  it("publishes the BookingKoala bathroom assumption on every tier", () => {
    const expected = [
      "Assumes 1 full bathroom",
      "Assumes 2 full bathrooms",
      "Assumes 2 full bathrooms + 1 half bathroom",
      "Assumes 3 full bathrooms + 1 half bathroom",
      "Assumes 3 full bathrooms + 1 half bathroom",
    ];
    expect(standardTierRows().map((row) => row.assumption)).toEqual(expected);
    expect(deepCleanTierRows().map((row) => row.assumption)).toEqual(expected);
    expect(moveInOutTierRows().map((row) => row.assumption)).toEqual(expected);
  });

  it("reconciles the public two-bedroom bathroom examples with BookingKoala", () => {
    const apartment = homeTypeOptions("standard")[0]?.id ?? null;
    const quote = (bathrooms: number) => calculateQuote({
      service: "standard",
      homeType: apartment,
      bedrooms: 2,
      bathrooms,
      halfBaths: 0,
      addOns: [],
      frequency: "one-time",
    }).firstClean;

    expect(PRICING_TIERS[1]).toMatchObject({ beds: 2, bathrooms: 2, halfBaths: 0 });
    expect(quote(1)).toBe(169);
    expect(withGst(quote(1))).toBe(177.45);
    expect(quote(2)).toBe(195);
    expect(withGst(quote(2))).toBe(204.75);
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

describe("local pricing language", () => {
  it("does not claim every service is priced by home size", () => {
    const directory = new URL("../pages/locations/", import.meta.url);
    const failures: string[] = [];

    for (const file of readdirSync(directory).filter((name) => name.endsWith(".tsx"))) {
      const source = readFileSync(new URL(file, directory), "utf8").replace(/\s+/g, " ");
      const statements = source.split(/[.!?](?:\s|<)/);
      for (const statement of statements) {
        const blanketClaim =
          /\b(?:each|every|all|six)\b.{0,220}\bservice\w*\b.{0,220}\b(?:home size|size of the home)\b/i.test(
            statement,
          );
        const identifiesException = /\b(?:except|apart|square footage|or by)\b/i.test(statement);
        if (blanketClaim && !identifiesException) failures.push(`${file}: ${statement.trim()}`);
      }
    }

    expect(failures).toEqual([]);
  });

  it("never groups post-construction into home-size pricing", () => {
    const directory = new URL("../pages/locations/", import.meta.url);
    const failures = readdirSync(directory)
      .filter((name) => name.endsWith(".tsx"))
      .flatMap((file) => {
        const source = readFileSync(new URL(file, directory), "utf8").replace(/\s+/g, " ");
        return /post-construction\s+cleaning[^.!?]{0,100}(?:each\s+)?priced\s+by\s+home\s+size/i.test(source)
          ? [file]
          : [];
      });

    expect(failures).toEqual([]);
  });
});
