import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

/**
 * The money pages do not read like a template filled in by a machine.
 *
 * A five-reader pass on 8 September 2026 found the same defects on page after
 * page: "Get your free quote today and experience the Duty Cleaners
 * difference!" closing 159 pages; "Moving is one of life's most stressful
 * events" opening both move-out pages; a Leduc paragraph praising a
 * distillery's "unique brews"; "A spotless home, without lifting a finger";
 * FAQ answers that began "Absolutely!" and told the customer nothing. Every
 * one was rewritten. This keeps them out.
 *
 * Two lists. The first is banned everywhere under src/pages and
 * src/components: phrases that carry no information and were only ever
 * template filler. The second is banned on the money pages and the
 * components they render, and is stricter, because those pages are where a
 * sceptical customer and a helpful-content reviewer both land first.
 *
 * Comments are stripped before scanning, so a note may cite what used to be
 * there. Match is case-insensitive.
 */

const SRC = join(__dirname, "..");

/** Filler that has no legitimate use anywhere on the site. */
const BANNED_EVERYWHERE = [
  "experience the duty cleaners difference",
  "one of life's most stressful",
  "leave it to the pros",
  "your landlord will love",
  "without lifting a finger",
  "your satisfaction is our commitment",
  "will take care of everything!",
  "understand that life gets busy",
  "seamlessly intertwines",
  "delight your taste buds",
  "unique brews",
  "and more!",
  "look no further",
  "in today's fast-paced world",
  "that's where we come in",
  "say goodbye to",
  "we've got you covered",
  "hassle-free",
  "stress-free",
  "top-notch",
  "unparalleled",
  "state-of-the-art",
  "guaranteed results",
];

/** Stricter list for the pages that earn the money. */
const BANNED_ON_MONEY_PAGES = [
  ...BANNED_EVERYWHERE,
  "meticulous",
  "pristine",
  "sparkling",
  "peace of mind",
  "tailored to your",
  "every corner",
  "every inch",
  "attention to detail",
  "exacting",
  "high standard of cleanliness",
  "standard of cleanliness",
  "dedicated professionals",
  "vetted pros",
  "thriving",
  "vibrant",
  "bustling",
  "nestled",
  "boasts",
  "rich history",
  "hidden gem",
  "serene",
  "picturesque",
  "delightful",
  "delectable",
  "renowned",
  "immersive",
  "blossomed",
  "flourished",
  "enchanted",
  "make your space shine",
  "restore the look and feel",
  "brand new",
  "busy life",
  "whether you're",
  "whether you need",
  "whether your home is near",
];

/** The 22 money pages (commercial excluded by policy) and the components they render. */
const MONEY_PAGE_FILES = [
  "pages/Edmonton2.tsx",
  "pages/Calgary2.tsx",
  "pages/EdmontonRegularCleaning.tsx",
  "pages/CalgaryRegularCleaning.tsx",
  "pages/EdmontonRecurringCleaning.tsx",
  "pages/CalgaryRecurringCleaning.tsx",
  "pages/EdmontonDeepCleaning.tsx",
  "pages/CalgaryDeepCleaning.tsx",
  "pages/EdmontonMoveInOut.tsx",
  "pages/CalgaryMoveInOut.tsx",
  "pages/EdmontonPostConstruction.tsx",
  "pages/CalgaryPostConstruction.tsx",
  "pages/WallWashingEdmonton.tsx",
  "pages/WallWashingCalgary.tsx",
  "pages/EdmontonPricing.tsx",
  "pages/CalgaryPricing.tsx",
  "pages/locations/StAlbert.tsx",
  "pages/locations/SherwoodPark.tsx",
  "pages/locations/SpruceGrove.tsx",
  "pages/locations/Leduc.tsx",
  "pages/locations/Morinville.tsx",
  "pages/locations/Airdrie.tsx",
  "components/ServiceDetailPage.tsx",
  "components/MoveOutDepth.tsx",
  "components/MoveOutServiceAreas.tsx",
  "components/LocationPageTemplate.tsx",
  "components/LocationPricing.tsx",
  "components/DutyCleanPromise.tsx",
  "components/CityRecentCleans.tsx",
  "components/CityServicesChapter.tsx",
  "components/CityIncludedChapter.tsx",
];

const stripComments = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

function allTsx(dir: string, prefix = ""): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) out.push(...allTsx(join(dir, e.name), `${prefix}${e.name}/`));
    else if (e.name.endsWith(".tsx")) out.push(`${prefix}${e.name}`);
  }
  return out;
}

function offences(files: string[], phrases: string[]): string[] {
  const hits: string[] = [];
  for (const rel of files) {
    const text = stripComments(readFileSync(join(SRC, rel), "utf-8")).toLowerCase();
    for (const p of phrases) {
      const at = text.indexOf(p);
      if (at !== -1) hits.push(`${rel}: "${p}" near …${text.slice(Math.max(0, at - 30), at + p.length + 20).replace(/\s+/g, " ")}…`);
    }
  }
  return hits;
}

describe("the copy does not read like a template filled in by a machine", () => {
  it("no page or component carries filler that was only ever template noise", () => {
    const files = [...allTsx(join(SRC, "pages"), "pages/"), ...allTsx(join(SRC, "components"), "components/")];
    expect(files.length).toBeGreaterThan(200);
    expect(offences(files, BANNED_EVERYWHERE), "template filler; say the fact instead").toEqual([]);
  });

  it("the money pages carry none of the brochure vocabulary", () => {
    for (const f of MONEY_PAGE_FILES) {
      expect(() => readFileSync(join(SRC, f)), `${f} is gone; update MONEY_PAGE_FILES`).not.toThrow();
    }
    expect(offences(MONEY_PAGE_FILES, BANNED_ON_MONEY_PAGES), "brochure vocabulary on a money page").toEqual([]);
  });

  it("no FAQ answer on a money page starts with an exclamation", () => {
    // "Yes!", "Absolutely!", "Yes, subject to availability!" — the customer
    // learns nothing from the first sentence. Answers start with the fact.
    const hits: string[] = [];
    for (const f of MONEY_PAGE_FILES) {
      const text = stripComments(readFileSync(join(SRC, f), "utf-8"));
      for (const m of text.matchAll(/(?:answer|a):\s*[`"']([^`"'\n]{0,40}!)/g)) hits.push(`${f}: ${m[1]}`);
    }
    expect(hits, "FAQ answers opening with an exclamation").toEqual([]);
  });
});
