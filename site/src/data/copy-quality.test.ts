import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { SERVICES } from "./pricing";

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

  /**
   * Promises and brochure lines the content prompt retired
   * (DUTY-CLEANERS-CONTENT-PROMPT.md at the repository root, section 3).
   *
   * Until 10 September 2026 the neighbourhood pages carried them by the
   * hundred: a "Flexible Scheduling" card promising same-day availability on
   * 150 pages, "exacting quality standards" on 132, a "100% satisfaction"
   * guarantee that is really a 24-hour re-clean on 150, "trusted by" lines on
   * 158, and a landmark tour ("the places that make X feel like home") on 52.
   * The money-page list above never reached those pages, which is how they
   * lasted. Every location page now gets the full list.
   */
  const RETIRED_BY_THE_CONTENT_PROMPT = [
    "100% satisfaction",
    "same-day and next-day availability",
    "next-day openings most weeks",
    "work around your busy",
    "exacting quality",
    "trusted by",
    "trusted local",
    "proudly serv",
    "premier",
    "resort-style",
    "feel like home",
    "know the area inside and out",
    "always around the corner",
    "sought-after",
    "most desirable",
    "stunning",
    "spotless home",
  ];

  // The cards every location page shows moved out of the 150 page files on
  // 2026-09-18, so the files that hold them are location copy too.
  const locationFiles = () => [
    ...allTsx(join(SRC, "pages", "locations"), "pages/locations/"),
    "data/location-cards.tsx",
    "components/LocationCards.tsx",
  ];

  it("no location page carries brochure vocabulary or a retired promise", () => {
    const files = locationFiles();
    expect(files.length).toBeGreaterThan(150);
    expect(
      offences(files, [...BANNED_ON_MONEY_PAGES, ...RETIRED_BY_THE_CONTENT_PROMPT]),
      "brochure vocabulary or a retired promise on a location page",
    ).toEqual([]);
  });

  it("no money page makes a promise the content prompt retired", () => {
    expect(offences(MONEY_PAGE_FILES, RETIRED_BY_THE_CONTENT_PROMPT), "a retired promise on a money page").toEqual([]);
  });

  it("no location page sells commercial cleaning", () => {
    // The prompt keeps commercial work out of the house-cleaning pages: 73
    // neighbourhood pages carried a "Commercial Cleaning" card with no link,
    // 132 listed it as a bullet in an FAQ, and seven ended on "Run a business
    // in X? We also handle commercial and office cleaning".
    const re = /title: "(?:office & )?commercial cleaning"|\\n• (?:office & )?commercial|run a business in|commercial and office cleaning|office and commercial/;
    const hits: string[] = [];
    for (const rel of locationFiles()) {
      const m = re.exec(stripComments(readFileSync(join(SRC, rel), "utf-8")).toLowerCase());
      if (m) hits.push(`${rel}: "${m[0]}"`);
    }
    expect(hits, "a commercial-cleaning offer on a house-cleaning page").toEqual([]);
  });

  it("light switches are in the deep package, not the standard checklist", () => {
    // Owner, 2026-09-10: light switches are wiped in the deep clean only. The
    // hubs' standard checklist had listed "Light switches & door handles".
    const src = stripComments(readFileSync(join(SRC, "components", "CityIncludedChapter.tsx"), "utf-8"));
    const rooms = /const rooms[\s\S]*?\n\];/.exec(src)?.[0] ?? "";
    expect(rooms, "CityIncludedChapter's checklist moved; point this guard at it").toMatch(/Living areas/i);
    expect(rooms.toLowerCase(), "the standard checklist lists light switches").not.toContain("light switch");
  });

  it("online quotes are for office cleaning only, and short-term rentals get a callback", () => {
    // Owner, 2026-09-10: the only commercial work quoted online is office
    // cleaning. Airbnb and other short-term rentals are priced on a callback.
    const contact = readFileSync(join(SRC, "pages", "Contact.tsx"), "utf-8");
    expect(/<SelectItem value="commercial">([^<]*)<\/SelectItem>/.exec(contact)?.[1], "the contact form's commercial option").toBe("Office Cleaning");
    for (const rel of ["components/quote/QuoteFlow.tsx", "components/quote/ServiceStartCard.tsx"]) {
      const text = stripComments(readFileSync(join(SRC, rel), "utf-8")).toLowerCase();
      expect(text, `${rel} offers a quote for commercial property`).not.toMatch(/commercial (?:property|properties|site)/);
      expect(text, `${rel} no longer routes short-term rentals to the callback form`).toContain("/contact-us/#topic=airbnb");
      expect(text, `${rel} offers a quote form where short-term rentals need a callback`).not.toMatch(/request a quote\b/);
    }
  });

  it("no page or component labels a figure as homes cleaned", () => {
    // Owner, 2026-09-10: the figure is 5,000+ bookings (proof.ts BOOKINGS), not
    // homes, and not split by city. The prerendered check in
    // rendered-quality.test.ts cannot see the quote flow or the gift-card badge,
    // which render only in the browser, so this one reads the source.
    const files = [...allTsx(join(SRC, "pages"), "pages/"), ...allTsx(join(SRC, "components"), "components/")];
    const hits: string[] = [];
    for (const rel of files) {
      const text = stripComments(readFileSync(join(SRC, rel), "utf-8"));
      const m = /homes cleaned\s*(?:["'`<]|$)|\b\d{1,3}(?:,\d{3})+\+\s+(?:[A-Z][a-z]+\s+)?homes\b/im.exec(text);
      if (m) hits.push(`${rel}: "${m[0].trim()}"`);
    }
    expect(hits, "a homes-cleaned figure; use BOOKINGS or BOOKINGS_CLAIM from proof.ts").toEqual([]);
  });

  it("ceiling fans are an on-request extra, never part of a package", () => {
    // Owner, 2026-09-10: the deep package is baseboards, doors, light switches,
    // wall outlets and vent covers, and cobwebs where there are any. Ceiling
    // fans are dusted only on request, where they can be reached safely; 146
    // pages had listed them in the package. Blog tips are general advice and
    // image alt text describes a photo, so neither counts. Plain "fans" counts
    // too where it sits in a package sentence or on a deep-clean page: both
    // deep pages listed "vents, fans" in the package until 2026-09-11, while
    // "dust settles on fans" on a recurring page describes a home, not a package.
    const files = [...allTsx(join(SRC, "pages"), "pages/"), ...allTsx(join(SRC, "components"), "components/")].filter(
      (f) => !/Blog|Commercial/.test(f),
    );
    const hits: string[] = [];
    for (const rel of files) {
      const text = stripComments(readFileSync(join(SRC, rel), "utf-8"));
      for (const m of text.matchAll(/ceiling fan|\bfans\b/gi)) {
        const before = text.slice(0, m.index);
        const after = text.slice(m.index);
        const start = Math.max(before.lastIndexOf(". "), before.lastIndexOf('"'), before.lastIndexOf("`"), before.lastIndexOf("•"), before.lastIndexOf(">"));
        const end = after.search(/\. |"|`|\\n|</);
        const sentence = text.slice(start + 1, m.index + (end < 0 ? after.length : end));
        const line = text.slice(text.lastIndexOf("\n", m.index) + 1, m.index);
        const inPackage = /ceiling/i.test(m[0]) || /package|deep/i.test(sentence) || /Deep/.test(rel);
        if (inPackage && !/request/i.test(sentence) && !/\balt\b/.test(line)) hits.push(`${rel}: "${sentence.trim().slice(0, 120)}"`);
      }
    }
    expect(hits, "ceiling fans listed as included; they are dusted on request only").toEqual([]);
  });

  it("cobwebs are in the deep package, not a standard or wall-washing list", () => {
    // Owner, 2026-09-10: cobwebs are deep-clean only. The hubs' standard
    // checklist, both services hubs' wall-washing bullets and both wall-washing
    // pages had listed them.
    const files = [
      "components/CityIncludedChapter.tsx",
      "pages/CalgaryServices.tsx",
      "pages/EdmontonServices.tsx",
      "pages/WallWashingCalgary.tsx",
      "pages/WallWashingEdmonton.tsx",
    ];
    const hits = files.filter((rel) => {
      let source = stripComments(readFileSync(join(SRC, rel), "utf-8"));
      // Comparison hubs also describe the deep package. Exclude only that
      // card and its deep-comparison FAQ; keep standard/wall lists guarded.
      if (/Services\.tsx$/.test(rel)) source = source
        .replace(/title: "Deep Cleaning",[\s\S]*?accent: true/g, "")
        .replace(/q: "[^"]*(?:deep|Deep)[^"]*",\s*a: `[^`]*`/g, "");
      return /cobweb/i.test(source);
    });
    expect(hits, "cobwebs listed outside the deep package").toEqual([]);
  });

  it("service copy promises cleaning, not sanitising or disinfecting", () => {
    // Owner, 2026-09-11: the cleaners are subcontractors who bring the products
    // they work best with, so the office cannot say which product touched a
    // surface. "Sanitised" and "disinfected" describe what a product does to
    // germs (a disinfectant carries a Health Canada DIN and a label contact
    // time), and 20 house-cleaning files made the claim. The copy now says what
    // the team does: scrubbed, wiped down, cleaned. The three product posts
    // discuss disinfectants in general and the commercial pages are out of
    // scope, so neither counts; the other blog posts describe our own service
    // and do. The data and lib files feed rendered copy and JSON-LD, so they are
    // read too (pricing.ts through SERVICES, which skips the commercial tier;
    // reviews stay verbatim).
    const CLAIM = /sanitis|sanitiz|disinfect|non-?toxic|chemical-free|hospital-grade/i;
    const files = [...allTsx(join(SRC, "pages"), "pages/"), ...allTsx(join(SRC, "components"), "components/")].filter(
      (f) => !/BlogCleaningProducts|BlogVinegarBakingSoda|BlogSpotlessHomeTips|Commercial/.test(f),
    );
    for (const dir of ["data", "lib"]) {
      for (const name of readdirSync(join(SRC, dir))) {
        if (name.endsWith(".ts") && !name.endsWith(".test.ts") && name !== "pricing.ts" && !/review/i.test(name)) files.push(`${dir}/${name}`);
      }
    }
    const hits: string[] = [];
    for (const rel of files) {
      const text = stripComments(readFileSync(join(SRC, rel), "utf-8"));
      const m = CLAIM.exec(text);
      if (m) hits.push(`${rel}: "${text.slice(Math.max(0, m.index - 40), m.index + 40).replace(/\s+/g, " ")}"`);
    }
    for (const s of SERVICES.filter((x) => x.id !== "commercial")) {
      for (const line of [s.blurb, ...s.inclusions]) if (CLAIM.test(line)) hits.push(`pricing.ts ${s.id}: "${line}"`);
    }
    for (const name of ["llms.txt", "llms-full.txt"]) {
      for (const line of readFileSync(join(SRC, "..", "public", name), "utf-8").split("\n")) {
        const commercialOnly = /commercial|office/i.test(line) && !/residential|home|house/i.test(line);
        if (CLAIM.test(line) && !commercialOnly) hits.push(`${name}: "${line.trim().slice(0, 100)}"`);
      }
    }
    expect(hits, "a product-effect claim on house-cleaning copy; say what the team does").toEqual([]);
  });

  it("the march-out copy works from CFHA's checklist and never claims its standards", () => {
    // CFHA's move-out checklist (the Occupant Handbook, linked from the march-out
    // page) covers repairs, bulbs, the furnace filter, the yard, steam-cleaned
    // carpets and exterior windows as well as cleaning. The team does none of
    // those, so "done to CFHA's march-out inspection standards", on five
    // surfaces until 2026-09-11, claimed more than the service delivers.
    const files = [...allTsx(join(SRC, "pages"), "pages/"), ...allTsx(join(SRC, "components"), "components/")];
    const hits: string[] = [];
    for (const rel of files) {
      const m = /CFHA[^.<"`]{0,40}standards?/i.exec(stripComments(readFileSync(join(SRC, rel), "utf-8")));
      if (m) hits.push(`${rel}: "${m[0].replace(/\s+/g, " ")}"`);
    }
    expect(hits, "a claim to meet CFHA's inspection standards").toEqual([]);
  });

  it("a re-clean tied to an inspection is promised only inside the window that runs from the clean", () => {
    // policy.ts: a miss is reported within guaranteeWindowHours of the clean.
    // Both move-out pages said "if the inspection or your own walkthrough finds
    // something missed ... we return", and one said "come back if the inspection
    // finds something we missed", which reads as a promise that holds whenever
    // the inspection happens. A sentence that ties the return visit to an
    // inspection must state the window: within N hours of the clean. An FAQ
    // question that names the inspection and an answer that promises the
    // return are one promise, so each q and a are read together; the Edmonton
    // move-out FAQ slipped past the sentence check that way.
    const files = [...allTsx(join(SRC, "pages"), "pages/"), ...allTsx(join(SRC, "components"), "components/")].filter(
      (f) => !/Commercial/.test(f),
    );
    // "we/the team come back", not "the deposit comes back".
    const RETURN = /\b(?:we|team|crew)(?: will)? (?:return|come back|comes back)\b|\bre-clean|\bto come back\b|\bcome back (?:at no charge|for)\b/i;
    const WINDOW = /within (?:\$?\{[^}]+\}|24|twenty-four) hours (?:of|from|after) (?:the|your) clean|window runs from the clean/i;
    const tied = (unit: string) => /\binspect(?:ion|or)s?\b/i.test(unit) && RETURN.test(unit) && !WINDOW.test(unit);
    const hits: string[] = [];
    for (const rel of files) {
      const text = stripComments(readFileSync(join(SRC, rel), "utf-8")).replace(/\{" "\}/g, " ").replace(/\s+/g, " ");
      for (const sentence of text.split(/[.?!](?=\s)|["`<>]/)) {
        if (tied(sentence)) hits.push(`${rel}: "${sentence.trim().slice(0, 140)}"`);
      }
      for (const m of text.matchAll(/\bq(?:uestion)?:\s*(["`])(.*?)\1,\s*a(?:nswer)?:\s*(["`])(.*?)\3/g)) {
        if (tied(`${m[2]} ${m[4]}`)) hits.push(`${rel}: Q "${m[2].slice(0, 70)}" A "${m[4].slice(0, 110)}"`);
      }
    }
    expect(hits, "a re-clean tied to the inspection, without the window that runs from the clean").toEqual([]);
  });
});
