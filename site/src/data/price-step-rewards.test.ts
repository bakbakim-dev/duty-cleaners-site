import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Price-step rewards (owner, 2026-09-22): the step should feel good to use,
 * the honest way. Every answer gets immediate feedback (a check, a rolling
 * total, a note of what changed), savings read in dollars, and a progress bar
 * fills to "All set". The casino mechanics the owner asked about work by
 * hiding or distorting outcomes (random rewards, near-misses, countdowns), and
 * Canada's Competition Bureau treats false urgency and scarcity as misleading,
 * so they are banned here, as are pre-ticked extras and unsupported badges.
 */
const ROOT = join(__dirname, "..", "..");

function codeOf(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf-8")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ");
}

const FUNNEL = [
  "src/components/quote/QuoteFlow.tsx",
  "src/components/quote/FrequencyChips.tsx",
  "src/components/quote/PricePanel.tsx",
  "src/components/quote/RollingPrice.tsx",
  "src/lib/use-count-up.ts",
];

/** The `@media (prefers-reduced-motion: no-preference) { ... }` blocks of a stylesheet. */
function noPreferenceBlocks(css: string): string[] {
  const blocks: string[] = [];
  const marker = "@media (prefers-reduced-motion: no-preference) {";
  let from = 0;
  for (;;) {
    const start = css.indexOf(marker, from);
    if (start === -1) return blocks;
    let depth = 0;
    let i = start + marker.length - 1;
    for (; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) break;
    }
    blocks.push(css.slice(start, i + 1));
    from = i + 1;
  }
}

describe("the price step rewards honestly", () => {
  it("has no casino mechanics: no random prices, timers, fake scarcity or unsupported badges", () => {
    for (const file of FUNNEL) {
      const src = codeOf(file);
      expect(src, file).not.toMatch(/Math\.random/);
      expect(src, file).not.toMatch(/count\s*down|expires in|ends in|only \d+ (left|spots)|spots? left|hurry/i);
      expect(src, file).not.toMatch(/["'`>]\s*(most\s+)?popular/i);
      expect(src, file).not.toMatch(/spin to win|spin the wheel|jackpot|\blucky\b|you(?:'ve| have)? won[\s!.,]/i);
    }
  });

  it("starts with every extra unticked", () => {
    expect(codeOf("src/components/quote/QuoteFlow.tsx")).toMatch(
      /const \[addOns, setAddOns\] = useState<Record<string, number>>\(restored\?\.addOns \?\? \{\}\);/,
    );
  });

  it("shows plan savings in dollars from the funnel's own quote", () => {
    const flow = codeOf("src/components/quote/QuoteFlow.tsx");
    const chips = codeOf("src/components/quote/FrequencyChips.tsx");
    expect(flow).toMatch(/<FrequencyChips value=\{frequency\} onChange=\{setFrequency\} pricing=\{planPricing\} \/>/);
    expect(chips).toMatch(/Save \$\{formatPrice\(figures\.savePerVisit\)\}/);
  });

  it("keeps rolling digits away from screen readers, which hear the final figure", () => {
    const rolling = codeOf("src/components/quote/RollingPrice.tsx");
    expect(rolling).toMatch(/<span aria-hidden="true" className="tabular-nums">/);
    expect(rolling).toMatch(/<span className="sr-only">\{formatPrice\(value\)\}<\/span>/);
    expect(codeOf("src/lib/use-count-up.ts")).toMatch(/prefers-reduced-motion: reduce/);
  });

  it("runs every price-step animation only when motion is welcome", () => {
    const css = readFileSync(join(ROOT, "src/index.css"), "utf-8");
    const allowed = noPreferenceBlocks(css).join("\n");
    for (const name of ["funnel-pop", "funnel-float", "funnel-ready"]) {
      const uses = css.match(new RegExp(`animation:\\s*${name}\\b`, "g")) ?? [];
      const allowedUses = allowed.match(new RegExp(`animation:\\s*${name}\\b`, "g")) ?? [];
      expect(uses.length, name).toBeGreaterThan(0);
      expect(allowedUses.length, `${name} animates outside a no-preference block`).toBe(uses.length);
    }
  });

  it("fits a phone: the price step never scrolls sideways", () => {
    const flow = codeOf("src/components/quote/QuoteFlow.tsx");
    // An implicit grid column grew to the widest unbreakable child (the
    // one-line "Almost there..." button, 456px on a 375px phone).
    expect(flow).toMatch(/"grid grid-cols-1 gap-8 lg:grid-cols-\[minmax\(0,1fr\)_320px\]"/);
    expect(flow).toMatch(/h-auto min-h-\[56px\] w-full whitespace-normal rounded-full/);
  });
});
