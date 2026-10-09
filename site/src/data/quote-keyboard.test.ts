import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Every role="radiogroup" in the quote form is one tab stop whose choices move
 * with the arrow keys: that is what a screen reader announces for a radio group.
 * The home-type group was the one that still made keyboard users Tab through
 * every option (deep audit, 2026-10-09).
 */
const src = readFileSync(join(__dirname, "..", "..", "src/components/quote/QuoteFlow.tsx"), "utf8");

describe("quote form radio groups", () => {
  it("the home-type choices take one tab stop and move with the arrow keys", () => {
    const start = src.indexOf('<div id="homeType" role="radiogroup"');
    expect(start).toBeGreaterThan(0);
    const group = src.slice(start, src.indexOf("</div>", src.indexOf("homeTypes.map(", start)) );
    expect(group).toMatch(/tabIndex=\{index === focusIndex \? 0 : -1\}/);
    expect(group).toMatch(/ArrowDown[\s\S]*ArrowUp[\s\S]*setHomeType\(homeTypes\[next\]\.id\)/);
  });
});
