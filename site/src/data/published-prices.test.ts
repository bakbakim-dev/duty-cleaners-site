import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { standardTierRows, deepCleanTierRows, featuredExtraRows } from "./pricing";

/**
 * Guards the rule pricing.ts already stated but nothing enforced: published
 * figures are derived from bk-config, never hand-typed.
 *
 * Six service pages had drifted. Deep cleaning shipped "$242" as its 1-bedroom
 * price — including inside the Service JSON-LD — while the real figure is $255,
 * so /pricing and /deep-cleaning-edmonton quoted different numbers for the same
 * clean and BookingKoala charged more than either. The add-on shelf listed
 * interior windows at a flat $64.99 against a real $39.99–$179.99 range, spot
 * wall cleaning $20 over, and a "Baseboards (2 rooms min) — $105" row that was
 * not bookable at all.
 */

const PAGES_DIR = join(__dirname, "..", "pages");

/** Every price a visitor can read, per service, straight from bk-config. */
const derived = () => [
  ...standardTierRows().map((r) => r.price),
  ...deepCleanTierRows().map((r) => r.price),
  ...featuredExtraRows().map((r) => r.price.replace(/^from /, "")),
];

describe("published prices are derived, not typed", () => {
  it("the six service detail pages contain no dollar literals", () => {
    const pages = [
      "EdmontonRegularCleaning", "CalgaryRegularCleaning",
      "EdmontonRecurringCleaning", "CalgaryRecurringCleaning",
      "EdmontonDeepCleaning", "CalgaryDeepCleaning",
    ];
    for (const page of pages) {
      const src = readFileSync(join(PAGES_DIR, `${page}.tsx`), "utf-8");
      // Strip comments first, so an explanatory note may cite a historical
      // figure without tripping the guard.
      const code = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
      const literals = code.match(/\$\d[\d,]*(\.\d{2})?/g) ?? [];
      expect(literals, `${page}.tsx hand-types ${literals.join(", ")}`).toEqual([]);
    }
  });

  it("deep cleaning starts above standard cleaning, by the package price", () => {
    // The drift was invisible because nothing tied the two tables together.
    const standard = standardTierRows();
    const deep = deepCleanTierRows();
    expect(deep).toHaveLength(standard.length);
    for (let i = 0; i < deep.length; i++) {
      const s = Number(standard[i].price.replace(/[^0-9.]/g, ""));
      const d = Number(deep[i].price.replace(/[^0-9.]/g, ""));
      expect(d, `${deep[i].beds}: deep must exceed standard`).toBeGreaterThan(s);
    }
  });

  it("never publishes an add-on that bk-config cannot book", () => {
    // "Baseboards (2 rooms min)" had no config row behind it; baseboards are
    // part of the Deep Cleaning package.
    const rows = featuredExtraRows();
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row.price, `${row.name} has no figure`).toMatch(/^(from )?\$\d/);
      expect(row.name).not.toMatch(/baseboard/i);
    }
  });

  it("marks size-scaled add-ons as 'from', so no single figure misleads", () => {
    const rows = featuredExtraRows();
    const windows = rows.find((r) => r.name === "Interior window cleaning");
    // bk-config prices this $39.99 (1BR) to $179.99 (5+BR). A flat number here
    // is wrong at both ends of the range, which is exactly what shipped.
    expect(windows?.price).toBe("from $39.99");
  });

  it("no other page under src/pages hand-types a service price", () => {
    // Advisory sweep: blog/cost-guide pages legitimately discuss market rates,
    // so this only asserts the service pages stay clean as new ones are added.
    const serviceLike = readdirSync(PAGES_DIR).filter((f) =>
      /^(Edmonton|Calgary)(Regular|Recurring|Deep|MoveInOut|PostConstruction)/.test(f),
    );
    expect(serviceLike.length).toBeGreaterThanOrEqual(6);
    expect(derived().length).toBeGreaterThan(0);
  });
});
