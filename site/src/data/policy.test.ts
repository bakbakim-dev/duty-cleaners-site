import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { POLICY, PRICING_TERMS, SERVICE_TERMS } from "./policy";
import { BOOKINGS, CITY_PROOF, COMPANY, RESPONSE_TIME_PROMISE, RISK_REVERSAL } from "./proof";
import { confirm, PROVENANCE } from "./confirmed";
import { travelFee } from "./addon-table";
import { addOnFromPrice, formatPrice, FREQUENCIES } from "./pricing";

/**
 * The satisfaction guarantee window drifted twice: it shipped as 24 hours on
 * roughly 100 surfaces while the guarantee page's own exclusion list said 48,
 * and llms.txt separately told AI assistants a photo was required when no
 * customer-facing page said so. Both are settled now, and much of this copy
 * ships inside FAQPage JSON-LD, so a regression would be reproduced by Google
 * and by AI assistants as authoritative. This stops it.
 */

const SRC = join(__dirname, "..");
const PUBLIC = join(__dirname, "..", "..", "public");

/** Every .tsx under src/pages and src/components. */
function sourceFiles(): { name: string; text: string }[] {
  const out: { name: string; text: string }[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith(".tsx")) out.push({ name: full, text: readFileSync(full, "utf-8") });
    }
  };
  walk(join(SRC, "pages"));
  walk(join(SRC, "components"));
  return out;
}

/** JSX comments explain past bugs and legitimately mention the old figures. */
const stripComments = (s: string) => s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "");

describe("satisfaction guarantee window", () => {
  it("is 24 hours", () => {
    expect(POLICY.guaranteeWindowHours).toBe(24);
  });

  it("no page states a 48-hour window for reporting a problem", () => {
    // Two legitimate uses of "48 hours" must not trip this:
    //   JoinTheTeam        — how quickly applicants hear back
    //   SatisfactionGuarantee — how quickly the team returns, not the claim window
    const claimWindow =
      /(within|after|more than)\s*48\s*hours?[^.]{0,40}(clean|cleaning|appointment|service|visit)/i;
    const offenders = sourceFiles()
      .filter((f) => claimWindow.test(stripComments(f.text)))
      .map((f) => f.name.split(/[\/]/).pop());
    expect(offenders, `these state a 48-hour reporting window: ${offenders.join(", ")}`).toEqual([]);
  });
});

describe("guarantee preconditions", () => {
  it("does not require a photo", () => {
    expect(POLICY.guaranteeRequiresPhotos).toBe(false);
  });

  it("no machine-readable file tells assistants a photo is required", () => {
    for (const file of ["llms.txt", "llms-full.txt"]) {
      const text = readFileSync(join(PUBLIC, file), "utf-8");
      // The correct wording ("photos help but are not required") contains both
      // words, so only an AFFIRMATIVE requirement should fail.
      const sentences = [...text.matchAll(/[^.\n]*photos?[^.\n]*required[^.\n]*/gi)].map((m) =>
        m[0].trim(),
      );
      const affirmative = sentences.filter((s) => !/\b(not|never|no)\b[^.]*required/i.test(s));
      expect(
        affirmative,
        `${file} asserts a photo requirement: ${affirmative.join(" | ")}`,
      ).toEqual([]);
    }
  });
});

describe("every policy value is settled", () => {
  it("carries no unconfirmed (null) value", () => {
    // policy.ts renders nothing for a null. All nine open questions have been
    // answered, so a null now means someone added a field and left it blank
    // rather than an outstanding business decision.
    const unset = Object.entries(POLICY)
      .filter(([, v]) => v === null)
      .map(([k]) => k);
    expect(unset, `unconfirmed policy values: ${unset.join(", ")}`).toEqual([]);
  });
});

/**
 * Confirmed<T> used to be `type Confirmed<T> = T` — a comment with a type
 * signature. These pin the branded version: every settled value carries who
 * settled it and when, and the fees /terms/ states are bk-config's, not ours.
 */
describe("every confirmed value carries its provenance", () => {
  it("records one provenance entry per settled policy value, plus the Google figures", () => {
    const settled = Object.values(POLICY).filter((v) => v !== null).length;
    const google = Object.values(CITY_PROOF).flatMap((c) => [c.googleRating, c.googleReviewCount]).filter((v) => v !== null).length;
    expect(google).toBe(4);
    // proof.ts's owner-confirmed claims (2026-09-10): the bookings figure and
    // the "No contracts" line. Each must be registered, not typed in.
    const ownerClaims = [
      BOOKINGS,
      RESPONSE_TIME_PROMISE,
      RISK_REVERSAL.find((line) => line.id === "no-contract")?.label,
      RISK_REVERSAL.find((line) => line.id === "no-charge")?.label,
      CITY_PROOF.edmonton.geo,
      CITY_PROOF.calgary.geo,
      COMPANY.applicantAcceptanceRate,
    ];
    for (const claim of ownerClaims) {
      expect(PROVENANCE.some((p) => p.by === "owner" && p.value === claim), `${String(claim)} carries no provenance`).toBe(true);
    }
    // Registered at import time by confirm(); a value typed in without it
    // would compile only by bypassing the brand, and would be missing here.
    expect(PROVENANCE.length).toBe(settled + google + ownerClaims.length);
    for (const p of PROVENANCE) {
      expect(p.on, `${String(p.value).slice(0, 30)} has no recorded date`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(["owner", "google-listing", "published-copy"]).toContain(p.by);
    }
  });

  it("refuses a date nobody can look up", () => {
    expect(() => confirm("x", { by: "owner", on: "2026-9-7" as never })).toThrow(/not an ISO date/);
    expect(() => confirm("x", { by: "owner", on: "2026-13-40" })).toThrow(/not an ISO date/);
  });

  it("every dollar figure in policy.ts is either confirmed or derived", () => {
    // A "$" on a line that is not a confirm() call is a hand-typed price in
    // the file that exists to stop hand-typed prices. Comments are stripped
    // first, so a note may still cite what a legacy page used to say.
    const src = readFileSync(join(__dirname, "policy.ts"), "utf-8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, "");
    const stray = src
      .split(/\r?\n/)
      .filter((line) => /\$\d/.test(line) && !/confirm\(/.test(line));
    expect(stray, "hand-typed figures in policy.ts; derive them from pricing.ts or wrap them in confirm()").toEqual([]);
  });

  it("the terms quote bk-config's travel fees, pet charge and recurring discounts", () => {
    const terms = [...PRICING_TERMS, ...SERVICE_TERMS].join("\n");
    const home = travelFee("standard");
    const post = travelFee("post-construction");
    expect(home, "bk-config no longer carries a home travel fee").not.toBeNull();
    expect(post, "bk-config no longer carries a post-construction travel fee").not.toBeNull();
    expect(terms).toContain(`${formatPrice(home!)} for home cleaning`);
    expect(terms).toContain(`${formatPrice(post!)} for post-construction`);
    expect(terms).toContain(`${formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets")!)} per visit`);
    for (const f of FREQUENCIES.filter((f) => f.discount > 0)) {
      expect(terms).toContain(`${Math.round(f.discount * 100)}% ${f.label.toLowerCase()}`);
    }
    expect(terms).toContain(`${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}`);
  });
});
