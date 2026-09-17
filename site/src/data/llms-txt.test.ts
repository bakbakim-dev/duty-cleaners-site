import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import {
  standardTierRows,
  deepCleanTierRows,
  moveInOutTierRows,
  sqftTierOptions,
  formatPrice,
  HOURLY_RATE,
} from "./pricing";
import { BK_PRICE_OVERRIDES } from "./bk-price-overrides";
import { CITY_PROOF } from "./proof";
import { PROVENANCE } from "./confirmed";

/**
 * llms.txt exists for exactly one audience — machine readers that will not
 * follow a redirect chain the way a browser does. It was handing that audience
 * a redirect map: 27 of its 28 links omitted the trailing slash on a
 * trailing-slash-canonical site, and 9 pointed at paths that 301 elsewhere.
 *
 * The file is hand-maintained, so nothing stopped it drifting. This does.
 */

const ROOT = join(__dirname, "..", "..");
const llms = readFileSync(join(ROOT, "public", "llms.txt"), "utf-8");
const redirectsRaw = readFileSync(join(ROOT, "public", "_redirects"), "utf-8");

/** Path -> target, for real redirects only. */
const redirects = new Map<string, string>();
for (const line of redirectsRaw.split("\n")) {
  const parts = line.trim().split(/\s+/);
  if (parts.length < 3 || !parts[0].startsWith("/")) continue;
  // Netlify writes a forced rule as "301!"; matching a bare "301" misses most
  // of this file. Status 200 rows are the SPA rewrite, not a redirect.
  const status = parts[2].replace(/!$/, "");
  if (status !== "301" && status !== "302") continue;
  redirects.set(parts[0].replace(/\/$/, "") || "/", parts[1]);
}

/**
 * THE BLIND SPOT THIS CLOSES
 *
 * Every link assertion below used to read llms.txt alone. llms-full.txt was
 * loaded further down for the price checks only — so the link rules never
 * touched it, and it kept the exact bug this file was written to kill: all 27
 * of its links omitted the trailing slash on a trailing-slash-canonical site,
 * 9 pointed at paths that 301 elsewhere, and one pointed at /gift-cards, which
 * 200-rewrites to the noindexed SPA shell while the real page is /gift-card.
 *
 * Both files are machine-reader surfaces and both get the same rules now.
 */
const llmsFullRaw = readFileSync(join(ROOT, "public", "llms-full.txt"), "utf-8");

const linksIn = (text: string) =>
  [...text.matchAll(/https:\/\/dutycleaners\.ca(\/[^\s)\]]*)/g)].map((m) => m[1]);

const links = [...linksIn(llms), ...linksIn(llmsFullRaw)];

describe("llms.txt", () => {
  it("actually contains links", () => {
    expect(redirects.size).toBeGreaterThan(50);
    expect(links.length).toBeGreaterThan(20);
  });

  it("every page link is trailing-slash canonical", () => {
    // File paths are exempt: /llms-full.txt is a file, and a trailing slash on
    // it is a hard 404 — which is exactly the bug this suite once passed.
    const isFile = (l: string) => /\.[a-z0-9]{2,4}$/i.test(l.split("?")[0]);
    const bare = links.filter((l) => !l.endsWith("/") && !isFile(l));
    expect(bare, `these omit the trailing slash: ${bare.join(", ")}`).toEqual([]);
  });

  it("no link lands on a redirect", () => {
    const hops = links
      .map((l) => [l, redirects.get(l.replace(/\/$/, "") || "/")] as const)
      .filter(([, target]) => target !== undefined);
    expect(
      hops.map(([from, to]) => `${from} -> ${to}`),
      "llms.txt points machine readers at redirects",
    ).toEqual([]);
  });
});

/**
 * The llms.txt files publish price tables for machine readers. They were
 * hand-maintained and had drifted badly: deep cleaning was quoted at
 * $242–$463 against a real $255–$485, and move-in/out at $284–$519 against a
 * real $284–$539 — the same understated figures the service pages carried, and
 * still wrong here after those pages were fixed.
 */
describe("llms.txt price tables match bk-config", () => {
  const llmsFull = readFileSync(join(ROOT, "public", "llms-full.txt"), "utf-8");
  const both = `${llms}\n${llmsFull}`;

  const rows = {
    standard: standardTierRows(),
    deep: deepCleanTierRows(),
    "move-in-out": moveInOutTierRows(),
  };

  for (const [service, tiers] of Object.entries(rows)) {
    it(`quotes the real ${service} range`, () => {
      const low = tiers[0].price;
      const high = tiers[tiers.length - 1].price;
      expect(both, `${service} low (${low}) missing from llms files`).toContain(low);
      expect(both, `${service} high (${high}) missing from llms files`).toContain(high);
    });
  }

  /**
   * The two services these files used to describe as "quoted by scope".
   *
   * Both are priced, and priced in this repository: post-construction on a
   * square-footage ladder in bk-config, Airbnb at an hourly rate read from the
   * one hourly service BookingKoala sells. "Quoted by scope" told an assistant
   * there was no published price to give, on the surface that exists to be
   * quoted verbatim — so a machine reader answering "what does post-construction
   * cost in Edmonton?" had nothing, while the page beside it printed a band.
   */
  it("quotes the post-construction band and the hourly rate, not 'by scope'", () => {
    const bands = sqftTierOptions("post-construction");
    const low = formatPrice(bands[0].price);
    const high = formatPrice(bands[bands.length - 1].price);
    const hourly = formatPrice(HOURLY_RATE);

    for (const [name, text] of [["llms.txt", llms], ["llms-full.txt", llmsFull]] as const) {
      expect(text, `${name} never states the post-construction floor (${low})`).toContain(low);
      expect(text, `${name} never states the post-construction ceiling (${high})`).toContain(high);
      expect(text, `${name} never states the hourly rate (${hourly})`).toContain(hourly);
      expect(
        /quoted by scope/i.test(text),
        `${name} still says "quoted by scope" for a service this repository prices`,
      ).toBe(false);
    }
  });

  it("carries no figure that is not a real published tier", () => {
    // Every tier price across the three services, plus the hourly rate and the
    // add-on shelf, is legitimate. Anything else is a hand-typed leftover.
    const legitimate = new Set(
      Object.values(rows).flat().map((r) => r.price),
    );
    const stale = ["$242", "$463", "$519", "$300", "$355", "$414", "$481"]
      .filter((v) => !legitimate.has(v) && both.includes(v));
    expect(stale, `stale prices still in the llms files: ${stale.join(", ")}`).toEqual([]);
  });
});

/**
 * The blind spot this closes: the checks above verify a link is trailing-slash
 * canonical and does not hit a 301 — and both passed a hard 404
 * (`/llms-full.txt/`, a trailing slash on a file path) and a soft duplicate
 * (`/gift-cards/`, which 200-rewrites to the SPA shell while the real page is
 * `/gift-card/`). Passing those two is exactly the failure this file exists to
 * prevent, so it now asserts the target is a thing that actually exists.
 */
describe("llms.txt links point at real destinations", () => {
  const DIST = join(ROOT, "dist");

  /**
   * `dist` exists after `bun run build`, but the per-route index.html files
   * only appear after `node scripts/prerender.mjs --all`. Guarding on the
   * directory alone meant a build-without-prerender reported all 53 links as
   * broken — a false alarm loud enough to train someone to ignore this test.
   * A known prerendered route is the honest sentinel.
   */
  const prerendered = () => existsSync(join(DIST, "pricing", "index.html"));

  it("every link resolves to a built page or a real file", () => {
    if (!existsSync(DIST) || !prerendered()) return;
    const missing: string[] = [];
    for (const link of links) {
      const clean = link.split("?")[0];
      const asFile = join(DIST, clean.replace(/^\//, ""));
      const asPage = join(DIST, clean.replace(/^\//, ""), "index.html");
      if (!existsSync(asFile) && !existsSync(asPage)) missing.push(link);
    }
    expect(missing, `llms.txt links with no destination in dist: ${missing.join(", ")}`).toEqual([]);
  });

  it("never puts a trailing slash on a file path", () => {
    // /llms-full.txt/ is a hard 404 in production. It is NOT caught by an
    // existsSync check, because the local filesystem happily resolves the file
    // through the trailing slash — so this needs asserting directly.
    const bad = links.filter((l) => l.endsWith("/") && /\.[a-z0-9]{2,4}\/$/i.test(l));
    expect(bad, `file paths with a trailing slash 404 in production: ${bad.join(", ")}`).toEqual([]);
  });

  it("never links a path that 200-rewrites to the SPA shell", () => {
    // These resolve, so an existence check alone would pass them — but they
    // serve the shell, not the page the link claims to point at.
    const shellRewrites = new Set<string>();
    for (const line of redirectsRaw.split("\n")) {
      const parts = line.trim().split(/\s+/);
      if (parts.length >= 3 && parts[2] === "200" && /spa-shell|index\.html/.test(parts[1])) {
        shellRewrites.add(parts[0].replace(/\/$/, "") || "/");
      }
    }
    const bad = links.filter((l) => shellRewrites.has(l.replace(/\/$/, "") || "/"));
    expect(bad, `llms.txt links at SPA-shell rewrites: ${bad.join(", ")}`).toEqual([]);
  });
});

/**
 * Claims the site has deliberately retired, guarded across every surface.
 *
 * All three of these were removed from the rendered pages in earlier passes and
 * survived in llms.txt and llms-full.txt — the two files written specifically
 * for AI assistants to quote. That is the worst possible place for them to
 * survive: gone from where a person would read it, intact where a machine will
 * repeat it as fact.
 *
 *   "non-toxic"   0 live pages, 3 hits in the llms files. The owner's position
 *                 is that not every product is non-toxic. Under Competition Act
 *                 s.74.01(b.1) a product claim needs pre-existing testing, and
 *                 it is privately actionable.
 *
 *   "licensed"    5 live surfaces plus both llms files, with no licence field
 *                 anywhere in proof.ts. policy.ts warns that the legacy
 *                 "licensed, insured and bonded" claim is not the true position
 *                 and must not be reintroduced.
 *
 *   "five-star"   15 live pages plus llms.txt, against a real rating of 4.9.
 *                 proof.ts already replaced the canonical claim with
 *                 RATING_CLAIM = "4.9 on Google"; these were stragglers.
 *
 * Uses of "five-star" that describe an individual review, a star-icon row, or
 * an Airbnb guest experience are NOT rating claims about this business and are
 * deliberately left alone — the pattern below only matches the rating form.
 */
describe("retired claims stay retired", () => {
  const surfaces: Array<[string, string]> = [
    ["llms.txt", llms],
    ["llms-full.txt", llmsFullRaw],
  ];

  const FORBIDDEN: Array<[RegExp, string]> = [
    [/non-?toxic/i, "product-safety claim with no substantiation (s.74.01(b.1))"],
    [/\blicen[sc]ed\b/i, "no licence field exists in proof.ts; see the warning in policy.ts"],
    [/\bbonded\b/i, "part of the retired 'licensed, insured and bonded' claim"],
    [/five[- ]star\s+(?:rated|customer|service|house cleaning)/i, "rounds the real 4.9 up to 5"],
  ];

  for (const [name, text] of surfaces) {
    for (const [pattern, why] of FORBIDDEN) {
      it(`${name} does not claim ${pattern.source} — ${why}`, () => {
        const m = pattern.exec(text);
        expect(
          m ? `${name}: "...${text.slice(Math.max(0, m.index - 60), m.index + 80)}..."` : null,
        ).toBeNull();
      });
    }
  }

  /**
   * The travel fee is mandatory outside the two metros and applied by postal
   * code. An assistant quoting a price for one of those towns from these files
   * while omitting it repeats the drip-pricing problem s.74.01(1.1) describes —
   * which turns on effect, not intent. Both files must carry the fee.
   */
  for (const [name, text] of surfaces) {
    it(`${name} discloses the travel fee alongside its prices`, () => {
      expect(/\$\d/.test(text), `${name} should quote prices`).toBe(true);
      expect(/travel fee/i.test(text), `${name} quotes prices but never mentions the travel fee`).toBe(true);
    });
  }

  /**
   * The travel fee was the only compulsory charge these files disclosed, and it
   * is the one that applies LEAST often — it needs an address outside the two
   * metros. The two that apply everywhere were missing:
   *
   *   home type  every tier price in both files is an apartment-or-condo price;
   *              a bungalow or basement suite adds $15, a townhouse $40 and a
   *              two-storey house $55
   *   pets       $19.99 on every visit, and policy.ts calls it "compulsory, not
   *              an add-on" because BookingKoala's own extra is named "Must
   *              choose if you have pets"
   *
   * So an assistant pricing a two-storey home with a pet from these files
   * answered $155 where the real figure is $229.99 — understated by a third,
   * on the surface that exists specifically to be quoted verbatim by machines.
   *
   * The amounts are read from BK_PRICE_OVERRIDES so the guard cannot pass
   * against a stale figure typed into the files.
   */
  const HOME_TYPE_IDS = { bungalow: 54, basementSuite: 56, townhouse: 89, twoStorey: 90 };

  for (const [name, text] of surfaces) {
    it(`${name} discloses the home-type surcharges its tier prices exclude`, () => {
      for (const [label, id] of Object.entries(HOME_TYPE_IDS)) {
        const amount = BK_PRICE_OVERRIDES[id]?.price;
        expect(amount, `no BK override for ${label} (id ${id})`).toBeGreaterThan(0);
        expect(
          text.includes(`$${amount}`),
          `${name} never states the ${label} surcharge of $${amount}; a machine quoting a tier ` +
            "price for that home type would understate it",
        ).toBe(true);
      }
    });

    it(`${name} discloses the per-visit pet charge`, () => {
      expect(
        /\$19\.99/.test(text),
        `${name} quotes prices but never states the $19.99 pet charge, which policy.ts records ` +
          "as compulsory rather than an add-on",
      ).toBe(true);
    });
  }
});

/**
 * The review counts these files publish are the counts proof.ts recorded.
 *
 * llms.txt said "4.9 from 224 reviews (Edmonton)". The Edmonton listing had
 * 236, read from the listing itself on 2026-09-01 and recorded in proof.ts with
 * that provenance; Calgary's 51 appeared in neither file. 224 was not a typo —
 * it was a real count, once, and it survived a rewrite of the file around it
 * because nothing tied the number to its source. That is the exact way a stale
 * figure lives longest: on the surface written to be quoted verbatim by
 * machines, where no human reading the site would ever see it to notice.
 *
 * So the assertion runs both ways. Every count these files publish has to be
 * one proof.ts holds, and every count proof.ts holds has to be published — the
 * second half is what stops Calgary being quietly dropped again, and the first
 * is what stops 224 coming back or the two being summed into a "287" that
 * neither listing reports.
 */
describe("llms.txt review counts match the listings proof.ts read", () => {
  const confirmed = new Set(
    Object.values(CITY_PROOF)
      .map((city) => city.googleReviewCount)
      // Unconfirmed is null, and a null count is not a count to publish.
      .filter((count) => count !== null)
      .map(String),
  );

  // The date both listings were read, from the same provenance the counts carry.
  const READ_ON = [...new Set(PROVENANCE.filter((p) => p.by === "google-listing").map((p) => p.on))];

  it("proof.ts actually holds a count for both cities", () => {
    // A guard that reads an empty set asserts nothing. This is the sentinel.
    expect(confirmed.size).toBe(2);
  });

  for (const [name, text] of [["llms.txt", llms], ["llms-full.txt", llmsFullRaw]] as const) {
    // The count guard below matches numbers only, so a refresh that updates
    // the counts can still leave "read ... on <old date>" standing on the one
    // surface written to be quoted verbatim by machines. Hold the date too.
    it(`${name} states the date the counts were read`, () => {
      expect(READ_ON, "the four Google figures should share one read date").toHaveLength(1);
      expect(text, `${name} must say the counts were read on ${READ_ON[0]}`).toContain(`on ${READ_ON[0]}`);
    });

    it(`${name} publishes every confirmed count and no other`, () => {
      const published = [...text.matchAll(/([\d,]+)\s+reviews?\b/gi)].map((m) =>
        m[1].replace(/,/g, ""),
      );
      const wrong = published.filter((n) => !confirmed.has(n));
      expect(
        wrong,
        `${name} quotes review counts proof.ts does not hold: ${wrong.join(", ")}. ` +
          `The confirmed counts are ${[...confirmed].join(" and ")}, read from the two ` +
          `Google listings on ${READ_ON.join("/")}. A sum of the two is not a count either listing reports.`,
      ).toEqual([]);

      const missing = [...confirmed].filter((n) => !published.includes(n));
      expect(
        missing,
        `${name} omits the confirmed review count(s) ${missing.join(", ")}. Both listings are ` +
          `linked from this file; publishing one city's count and not the other is how ` +
          `Calgary's 51 went missing the first time.`,
      ).toEqual([]);
    });

    it(`${name} states the rating from proof.ts rather than a rounded one`, () => {
      const rating = String(CITY_PROOF.edmonton.googleRating);
      expect(text, `${name} does not state the confirmed ${rating} rating`).toContain(rating);
      const rounded = [...text.matchAll(/\b([0-9](?:\.[0-9])?)\s*(?:out of 5|\/\s*5|stars?)\b/gi)]
        .map((m) => m[1])
        .filter((v) => v !== rating);
      expect(
        rounded,
        `${name} states a rating that is not the confirmed ${rating}: ${rounded.join(", ")}`,
      ).toEqual([]);
    });
  }
});

describe("llms.txt describes the frequencies the business actually sells", () => {
  /**
   * Both files told machine readers the recurring options were "weekly,
   * bi-weekly, or monthly", and that the third tier was "10% off monthly".
   *
   * Monthly is not a thing this business sells. BookingKoala's own config —
   * bk-config.json, the vendor's export and the authority for what can be
   * booked — lists `every_4_weeks`; the pricing block renders "Every 4 Weeks
   * 10% Off"; the service pages are titled "Weekly to Every 4 Weeks". The
   * difference is not cosmetic: monthly is 12 visits a year and every four
   * weeks is 13, so the annual cost implied by "monthly" is a month's cleaning
   * short.
   *
   * These files exist to be quoted verbatim by machine readers, which makes a
   * wrong frequency worse here than in prose a human would skim past. The
   * existing tests in this file check the links and the price tiers; nothing
   * checked the words around them.
   */
  const full = readFileSync(join(ROOT, "public", "llms-full.txt"), "utf-8");

  it("neither file offers a monthly schedule", () => {
    const hits: string[] = [];
    for (const [name, text] of [["llms.txt", llms], ["llms-full.txt", full]] as const) {
      text.split("\n").forEach((line, i) => {
        if (/\bmonthly\b/i.test(line)) hits.push(`${name}:${i + 1}  ${line.trim()}`);
      });
    }
    expect(
      hits,
      `These lines offer a monthly clean:\n${hits.join("\n")}\n` +
        `The bookable frequencies are weekly, bi-weekly and every 4 weeks — ` +
        `bk-config.json says every_4_weeks and the pricing block renders ` +
        `"Every 4 Weeks 10% Off". Monthly is 12 visits a year, every 4 weeks ` +
        `is 13; quoting the wrong one misstates the annual cost.`,
    ).toEqual([]);
  });

  it("both files name every 4 weeks as the third frequency", () => {
    for (const [name, text] of [["llms.txt", llms], ["llms-full.txt", full]] as const) {
      expect(
        /every[- ]4[- ]weeks/i.test(text),
        `${name} lists recurring discounts but never names the every-4-weeks tier.`,
      ).toBe(true);
    }
  });
});
