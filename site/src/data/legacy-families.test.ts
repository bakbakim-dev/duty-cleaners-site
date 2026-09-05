import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { LEGACY_URLS } from "./legacy-urls";

/**
 * Legacy URL FAMILIES, pinned.
 *
 * legacy-urls.ts was generated from the Search Console Performance export, so
 * it only ever contained URLs that earn impressions. The Coverage export lists
 * a different population — URLs Google crawls that earn nothing — and two whole
 * families turned out to be sitting in it, each already half-present:
 *
 *   /cleaning-services-for-<place>-ab   fort-saskatchewan was mapped (2,467
 *                                       impressions); the other six were not.
 *   /services-pricing/<service>         an entire WordPress section, unmapped.
 *
 * Being half-present is what made them invisible: a spot check on any mapped
 * member looked fine. Worse, fixing them one bucket at a time missed members
 * too — leduc sat in "Crawled - currently not indexed" rather than "Page with
 * redirect", and two /services-pricing/ children appeared in neither. The
 * members below came from grepping EVERY export for the family prefix.
 *
 * So this does not check that redirects work in general — generate-redirects.ts
 * and the deploy probe cover that. It pins the membership lists, so a future
 * regeneration of legacy-urls.ts from Performance data alone drops them loudly.
 */

const REDIRECTS = join(__dirname, "..", "..", "dist", "_redirects");

/** Family prefix -> every member Search Console has ever reported. */
const FAMILIES: Record<string, string[]> = {
  "/cleaning-services-for-": [
    "/cleaning-services-for-devon-ab",
    "/cleaning-services-for-fort-saskatchewan-ab",
    "/cleaning-services-for-leduc-ab",
    "/cleaning-services-for-morinville-ab",
    "/cleaning-services-for-sherwood-park-ab",
    "/cleaning-services-for-spruce-grove-ab",
    "/cleaning-services-for-st-albert-ab",
  ],
  "/services-pricing": [
    "/services-pricing",
    "/services-pricing/cleaning-services-fort-saskatchewan",
    "/services-pricing/commercial-cleaning-edmonton",
    "/services-pricing/move-in-move-out",
    "/services-pricing/post-construction-cleaning",
    "/services-pricing/wall-washing-wall-cleaning",
  ],
};

describe("legacy URL families stay complete", () => {
  const mapped = new Set(LEGACY_URLS.map((entry) => entry.legacy));

  for (const [prefix, members] of Object.entries(FAMILIES)) {
    it(`every ${prefix}… URL Search Console knows about is mapped`, () => {
      const missing = members.filter((member) => !mapped.has(member));
      expect(
        missing,
        `${missing.length} member(s) of the ${prefix} family lost their redirect: ${missing.join(", ")}`,
      ).toEqual([]);
    });
  }

  it("each family member points at a target that is itself served", () => {
    // A redirect to a path nothing serves is a 404 with extra steps. Targets are
    // checked against the other entries plus the live routes the map preserves.
    const preserved = new Set(
      LEGACY_URLS.filter((entry) => entry.mode === "preserve").map((entry) => entry.legacy),
    );
    for (const members of Object.values(FAMILIES)) {
      for (const member of members) {
        const entry = LEGACY_URLS.find((candidate) => candidate.legacy === member);
        expect(entry, `${member} is not mapped`).toBeTruthy();
        const target = entry!.target;
        // Either a preserved legacy path, or a modern route — never a path that
        // only exists as another entry's *legacy* side and would 301 again.
        const chains = LEGACY_URLS.find(
          (candidate) => candidate.legacy === target && candidate.mode === "redirect",
        );
        expect(
          chains,
          `${member} -> ${target}, which itself 301s to ${chains?.target} — collapse the hop`,
        ).toBeFalsy();
        expect(target.startsWith("/"), `${member} has a malformed target`).toBe(true);
        if (!preserved.has(target)) expect(target.length).toBeGreaterThan(1);
      }
    }
  });

  it("no redirect in the whole map lands on another redirect", () => {
    // Promoted from the family check above once the map was measured hop-free
    // at 168 entries. A chained 301 is not fatal — Google follows up to five —
    // but every hop is latency the visitor pays and a place for a later edit to
    // break the middle link. Hand-adding salvage redirects one export at a time
    // is exactly how chains appear, so the whole map is held to it, not just
    // the entries added that way.
    const destinations = new Map(
      LEGACY_URLS.filter((entry) => entry.mode === "redirect").map((entry) => [entry.legacy, entry.target]),
    );
    const chained = LEGACY_URLS.filter(
      (entry) => entry.mode === "redirect" && destinations.has(entry.target),
    ).map((entry) => `${entry.legacy} -> ${entry.target} -> ${destinations.get(entry.target)}`);
    expect(chained, `${chained.length} redirect(s) hop twice`).toEqual([]);
  });

  it("no entry redirects to itself, and none is mapped twice", () => {
    const seen = new Set<string>();
    const duplicated: string[] = [];
    for (const entry of LEGACY_URLS) {
      expect(entry.target, `${entry.legacy} points at itself`).not.toBe(entry.legacy);
      if (seen.has(entry.legacy)) duplicated.push(entry.legacy);
      seen.add(entry.legacy);
    }
    expect(duplicated, `mapped more than once: ${duplicated.join(", ")}`).toEqual([]);
  });

  it("the generated _redirects actually carries every member", () => {
    if (!existsSync(REDIRECTS)) return; // unbuilt tree; the source guards above still run
    const rules = readFileSync(REDIRECTS, "utf-8");
    for (const members of Object.values(FAMILIES)) {
      for (const member of members) {
        expect(
          rules.includes(`${member}/ `) || rules.includes(`${member} `),
          `${member} never reached dist/_redirects — regenerate it`,
        ).toBe(true);
      }
    }
  });
});
