import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { POLICY } from "./policy";

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
