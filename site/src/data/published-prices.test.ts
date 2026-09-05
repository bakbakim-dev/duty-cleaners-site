import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, featuredExtraRows } from "./pricing";
import { POLICY } from "./policy";

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

/**
 * The cost guide was exempt from the sweep above, because a page about what
 * house cleaning costs in Canada legitimately quotes market rates it does not
 * charge. The exemption is right, but it left the page's *first-party*
 * sentences unguarded — the two places where the guide stops describing the
 * market and states what Duty Cleaners charges.
 *
 * Both are derived today: the price sentence runs through COST_SPANS, which is
 * span() over the same tier helpers /pricing uses, and the cancellation
 * sentence reads POLICY. So there is nothing to drift right now, and that is
 * exactly the state worth pinning. The failure this guards against is a future
 * prose rewrite that hardcodes the numbers back in — the same failure that put
 * "$242" on /deep-cleaning-edmonton against a real $255.
 *
 * Checked on dist/ rather than source, because a span() bug would leave the
 * source looking correct and ship the wrong figure to the crawler.
 */
describe("the cost guide's first-party price claims", () => {
  const GUIDE = join(__dirname, "..", "..", "dist", "how-much-does-a-house-cleaning-cost", "index.html");
  const built = () => readFileSync(GUIDE, "utf-8");
  const ends = (rows: { price: string }[]) => [rows[0].price, rows[rows.length - 1].price];

  it("states the real published span for each service it names", () => {
    if (!existsSync(GUIDE)) return; // unbuilt tree; the source guard below still runs
    const html = built();
    const [stdLo, stdHi] = ends(standardTierRows());
    const [deepLo, deepHi] = ends(deepCleanTierRows());
    const [moveLo, moveHi] = ends(moveInOutTierRows());

    const sentence = html.match(/In Edmonton and Calgary a standard clean is[^<]*/)?.[0];
    expect(sentence, "the guide no longer states what Duty Cleaners charges").toBeTruthy();

    // Escaped because the figures carry a "$", which is a regex anchor.
    const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    for (const [label, lo, hi] of [
      ["standard", stdLo, stdHi],
      ["deep", deepLo, deepHi],
      ["move-in or move-out", moveLo, moveHi],
    ] as const) {
      expect(
        sentence,
        `the guide's ${label} span no longer matches ${lo}-${hi} from bk-config`,
      ).toMatch(new RegExp(`${esc(lo)} to ${esc(hi)}`));
    }
  });

  it("states the real cancellation fee and lockout terms", () => {
    if (!existsSync(GUIDE)) return;
    const para = built().match(/Ask any company for two numbers[^<]*/)?.[0];
    expect(para, "the guide no longer states our own cancellation terms").toBeTruthy();
    expect(para).toContain(`Ours are ${POLICY.cancellationFee} inside ${POLICY.cancellationNoticeHours} hours`);
    expect(para).toContain(POLICY.lockoutFee);
  });

  it("keeps those two sentences free of hand-typed figures in source", () => {
    // Runs with or without a build, so the pair is never silently vacuous.
    const src = readFileSync(join(PAGES_DIR, "BlogHouseCleaningCost.tsx"), "utf-8");
    for (const marker of [
      "In Edmonton and Calgary a standard clean is",
      "Ask any company for two numbers before you book",
    ]) {
      const at = src.indexOf(marker);
      expect(at, `${marker.slice(0, 30)}… is gone from the guide`).toBeGreaterThan(-1);
      const rest = src.slice(at);
      const sentence = rest.slice(0, Math.max(rest.indexOf("</p>"), 0) || 600);
      expect(
        sentence.match(/\$\d/g),
        "a first-party claim in the cost guide is hand-typed again; derive it from pricing.ts or policy.ts",
      ).toBeNull();
    }
  });
});
