import { describe, it, expect } from "vitest";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, featuredExtraRows, FREQUENCIES } from "./pricing";
import { POLICY } from "./policy";
import { giftCardGuide, GIFT_CARD_AMOUNTS } from "./gift-cards";

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

/**
 * Pages allowed to contain a dollar literal, each with the reason it is not a
 * price we charge. Everything else under src/pages is denied by default.
 *
 * This replaces two allowlists-in-reverse: a hand-typed list of ten service
 * pages, and a filename regex for "service-like" pages. Both only ever looked
 * where a price had already gone wrong. The 63 Calgary location pages each
 * hand-typed `priceRange: "$155-$539"` into their LocalBusiness schema for as
 * long as it happened to match bk-config; the FAQ, Allendale and Delton typed
 * the $50 cancellation fee; the gift-card page typed a $350 label that a
 * 3-bedroom deep clean ($372) could not be bought with. None of those files
 * matched either list, so none were read.
 *
 * To add an entry here, write down why the figure is not something bk-config
 * or policy.ts knows. "It happens to be correct today" is not a reason — that
 * was true of every figure above on the day it was typed.
 */
const ALLOWED_LITERALS: Record<string, string> = {
  "BlogHouseCleaningCost.tsx":
    "quotes what cleaning costs across Canada, which is market data, not our price list; " +
    "the bracketing guard below keeps those ranges from undercutting our own tiers",
  "BlogCleaningProducts.tsx":
    "the ~$60 is the retail cost of a household's supply kit at a grocery chain, not a service we sell",
};

/** Source with comments removed, so an explanatory note may cite a historical figure. */
const stripComments = (src: string) =>
  src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const DOLLAR_LITERAL = /\$\d[\d,]*(\.\d{2})?/g;

/** Every .tsx under src/pages, recursively, as a path relative to PAGES_DIR. */
function pageFiles(dir = PAGES_DIR, prefix = ""): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) out.push(...pageFiles(join(dir, entry.name), `${prefix}${entry.name}/`));
    else if (entry.name.endsWith(".tsx")) out.push(`${prefix}${entry.name}`);
  }
  return out;
}

describe("published prices are derived, not typed", () => {
  it("no page under src/pages hand-types a dollar figure unless it says why", () => {
    const files = pageFiles();
    // A sweep that finds nothing to read has failed silently before; make sure
    // this one saw the whole site — the hubs, the services, and the locations.
    expect(files.length, "the sweep did not find the site's pages").toBeGreaterThan(150);
    expect(files, "the location pages are no longer under src/pages/locations").toContain("locations/Sunalta.tsx");

    const offenders: string[] = [];
    for (const file of files) {
      const base = file.split("/").pop()!;
      if (ALLOWED_LITERALS[base]) continue;
      const literals = stripComments(readFileSync(join(PAGES_DIR, file), "utf-8")).match(DOLLAR_LITERAL) ?? [];
      if (literals.length) offenders.push(`${file}: ${literals.join(", ")}`);
    }
    expect(
      offenders,
      "hand-typed figures; derive them from pricing.ts or policy.ts, or add the file to " +
        "ALLOWED_LITERALS with a reason it is not a price we charge",
    ).toEqual([]);
  });

  it("every allowlisted page still contains the literal it is excused for", () => {
    // An allowlist entry that no longer matches anything is a hole waiting for
    // the next hand-typed price. Drop the entry when the literal goes.
    for (const [file, reason] of Object.entries(ALLOWED_LITERALS)) {
      expect(reason.length, `${file} is allowlisted without a reason`).toBeGreaterThan(40);
      const literals = stripComments(readFileSync(join(PAGES_DIR, file), "utf-8")).match(DOLLAR_LITERAL) ?? [];
      expect(literals.length, `${file} no longer has a dollar literal; remove its allowlist entry`).toBeGreaterThan(0);
    }
  });

  it("each gift card label promises only what its amount pays for", () => {
    // "$350 — best for a full house deep clean or move-in/move-out" shipped
    // while a 3-bedroom deep clean was $372. The labels are now computed from
    // the tiers; this checks the computation against the tables directly.
    const dollars = (s: string) => Number(s.replace(/[^0-9.]/g, ""));
    const priced = giftCardGuide().filter((g) => g.amount !== "Custom");
    expect(priced).toHaveLength(GIFT_CARD_AMOUNTS.length);
    for (const { amount, description } of priced) {
      const budget = dollars(amount);
      expect(description, `${amount} label names no home size`).toMatch(/\d\+?-? ?bedroom/);
      const tables: Array<[string, { beds: string; price: string }[]]> = [
        ["deep clean", deepCleanTierRows()],
        ["move-in/move-out clean", moveInOutTierRows()],
        ["standard clean", standardTierRows()],
      ];
      for (const [service, rows] of tables) {
        const m = description.match(new RegExp(`${service} of a (\\d\\+?)[- ]bedroom`));
        if (!m) continue;
        const beds = m[1];
        const row = rows.find((r) => r.beds.startsWith(beds));
        expect(row, `${amount}: no ${service} tier for ${beds} bedroom`).toBeTruthy();
        expect(dollars(row!.price), `${amount} claims a ${beds}-bedroom ${service} it cannot pay for`).toBeLessThanOrEqual(budget);
        // And it must be the LARGEST such home, or the label undersells the card.
        const next = rows[rows.indexOf(row!) + 1];
        if (next) expect(dollars(next.price), `${amount} could cover the ${next.beds} ${service} too`).toBeGreaterThan(budget);
      }
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

/**
 * The market figures on the cost guide are hand-typed, and they should be: they
 * describe what cleaning costs in Canada, which is not something bk-config
 * knows. But four of them had drifted below what we actually charge for the
 * same service at the same size — a "$170-$200" small deep clean against a real
 * $255, "~$180" for a 2-bedroom deep against $315, and card ranges for deep and
 * move-out that stopped at $400 and $500 against real ceilings of $485 and $539.
 *
 * That is not a false claim about the market. It is worse for the business than
 * one: the page anchors the reader at a number, and then the quote asks for
 * more. This pins the one rule that has to hold — a market range the guide
 * states for a service we sell must contain our published prices for it.
 */

/** "$200 - $550" -> [200, 550]; "$400+" -> [400, Infinity]; "~$325" -> [325, 325]. */
const money = (text: string): [number, number] => {
  const found = (text.match(/\$[\d,]+/g) ?? []).map((m) => Number(m.slice(1).replace(/,/g, "")));
  if (!found.length) return [NaN, NaN];
  // "$400+" and "$350+" are open-ended, so they cannot understate the top.
  return [found[0], /\+/.test(text) ? Infinity : found[found.length - 1]];
};

const dollars = (rows: { price: string }[]) => rows.map((r) => Number(r.price.slice(1).replace(/,/g, "")));

describe("the cost guide's market figures still contain our own prices", () => {
  const guideSource = () => readFileSync(join(PAGES_DIR, "BlogHouseCleaningCost.tsx"), "utf-8");

  it("each service card quotes a range that brackets our tiers end to end", () => {
    const block = guideSource().match(/const cleaningTypes = \[([\s\S]*?)\n\];/)?.[1];
    expect(block, "the cleaningTypes cards are gone").toBeTruthy();
    const cards: Record<string, string> = {};
    for (const m of block!.matchAll(/title: "([^"]+)"[\s\S]*?priceRange: "([^"]+)"/g)) cards[m[1]] = m[2];
    expect(Object.keys(cards).length).toBeGreaterThanOrEqual(4);

    // Post-construction is priced per square foot, so it has no tier to compare.
    const cases: Array<[string, { price: string }[]]> = [
      ["General Cleanings", standardTierRows()],
      ["Deep Cleanings", deepCleanTierRows()],
      ["Move-in/Move-out Cleanings", moveInOutTierRows()],
    ];
    for (const [title, rows] of cases) {
      const stated = cards[title];
      expect(stated, `the "${title}" card is gone`).toBeTruthy();
      const [lo, hi] = money(stated);
      const ours = dollars(rows);
      const cheapest = Math.min(...ours);
      const dearest = Math.max(...ours);
      expect(lo, `"${title}: ${stated}" starts above our own $${cheapest}`).toBeLessThanOrEqual(cheapest);
      expect(hi, `"${title}: ${stated}" stops below our own $${dearest}`).toBeGreaterThanOrEqual(dearest);
    }
  });

  it("the size-specific deep-clean figures clear our price at that size", () => {
    const src = guideSource();
    const deep = dollars(deepCleanTierRows());
    const cases = [
      {
        what: "the 1-bedroom flat-rate example",
        pattern: /Small 1-bedroom apartment: <strong>([^<]+)<\/strong> for deep cleaning/,
        ours: deep[0],
      },
      {
        what: "the 2-bedroom square-footage example",
        pattern: /A 2-bedroom apartment \(800 sq ft\) may cost ([^,]+) for deep cleaning/,
        ours: deep[1],
      },
    ];
    for (const { what, pattern, ours } of cases) {
      const found = src.match(pattern);
      expect(found, `${what} has been reworded; re-point this guard at it`).toBeTruthy();
      const [, top] = money(found![1]);
      expect(top, `${what} reads "${found![1].trim()}", under our own $${ours}`).toBeGreaterThanOrEqual(ours);
    }
  });
});

/**
 * The recurring tiers are named the way BookingKoala sells them.
 *
 * The 10% tier is "Every 4 Weeks" in bk-config — 13 visits a year. Seven
 * strings across the two pricing pages and /faqs/ called it "monthly", which is
 * 12, and the difference is a whole extra visit the customer did not agree to.
 * The discount cards said "Monthly Cleaning" while the booking form the CTA
 * hands them to says "Every 4 Weeks", so the label changed under them mid-flow.
 *
 * Scoped to the DISCOUNT tiers on purpose: the blog legitimately discusses
 * monthly cleaning as a habit, and nothing here should stop it.
 */
describe("recurring tiers are named the way the booking system sells them", () => {
  const PAGES = ["EdmontonPricing.tsx", "CalgaryPricing.tsx", "FAQ.tsx"];

  it("no page calls a recurring DISCOUNT tier 'monthly'", () => {
    const tier = FREQUENCIES.find((f) => f.discount === 0.1);
    expect(tier, "no 10% frequency in bk-config any more").toBeTruthy();
    expect(tier!.label).toBe("Every 4 Weeks");

    const offenders: string[] = [];
    for (const page of PAGES) {
      const src = readFileSync(join(PAGES_DIR, page), "utf-8");
      for (const line of src.split(/\r?\n/)) {
        if (!/monthly/i.test(line)) continue;
        // A discount context is what matters: a percentage, the word discount,
        // or a RecurringDiscountCard title.
        if (/%|discount|RecurringDiscountCard/i.test(line)) {
          offenders.push(`${page}: ${line.trim().slice(0, 96)}`);
        }
      }
    }
    expect(
      offenders,
      `these call the ${tier!.label} tier "monthly"; the booking form the CTA leads to does not`,
    ).toEqual([]);
  });
});
