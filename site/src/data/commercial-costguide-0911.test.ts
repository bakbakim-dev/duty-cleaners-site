import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { commercialFaqs } from "@/components/CommercialDepth";
import { POLICY } from "@/data/policy";

/**
 * The owner's decisions of 2026-09-11 for the two commercial pages, the
 * contact page's callback topics and the cost guide.
 *
 * Commercial (owner: "go ahead with this"): both pages are titled for office
 * and commercial cleaning; the primary CTA opens the contact form with Office
 * Cleaning and the branch's city preselected; commercial work is priced per
 * square foot at a walkthrough (owner, 2026-09-03), never at an hourly rate
 * "wherever your premises are"; no card promises a health inspector's standard
 * or a product effect, because the cleaners are subcontractors who choose their
 * own products.
 *
 * Contact: a visitor sent to ?topic=office or ?topic=airbnb gets the option and
 * the city preselected and a callback prompt, not the home-pricing pitch, since
 * neither job is priced by the instant quote.
 *
 * Cost guide: whole-home cleans are flat, other home jobs are hourly from
 * HOME_HOURLY_RATE, Airbnb turnovers at HOURLY_RATE; the guide had said home
 * cleans are never hourly. The move-out card claimed interior glass, which is a
 * paid add-on. The market ranges come from a dated sample of other companies'
 * published prices (site/docs/cost-guide-price-sample-2026-09.md), and the page
 * must say so and agree with that record.
 *
 * Source-level on purpose: these run without a build.
 */

const SRC = join(__dirname, "..");
const SITE = join(SRC, "..");
const read = (rel: string) => readFileSync(join(SRC, rel), "utf-8");

/** Comments out, JSX comments included, so a note may cite the old wording. */
const stripComments = (s: string) =>
  s.replace(/\{\/\*[\s\S]*?\*\/\}/g, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

const COMMERCIAL = {
  edmonton: "pages/CommercialCleaning.tsx",
  calgary: "pages/CommercialCleaningCalgary.tsx",
} as const;
const COMMERCIAL_FILES = [COMMERCIAL.edmonton, COMMERCIAL.calgary, "components/CommercialDepth.tsx"];

describe("the commercial pages (owner, 2026-09-11)", () => {
  it("the commercial pages are titled for office and commercial cleaning", () => {
    for (const [city, rel] of Object.entries(COMMERCIAL)) {
      const src = stripComments(read(rel));
      const title = /const TITLE = "([^"]+)"/.exec(src)?.[1];
      expect(title, `${rel} has no TITLE constant`).toBeTruthy();
      expect(title, `${rel} title`).toMatch(/^Office & Commercial Cleaning /);
      expect(title!.toLowerCase(), `${rel} title names another city`).toContain(city);
      expect(src, `${rel} renders a title other than TITLE`).toContain("<title>{TITLE}</title>");
      expect(src, `${rel} H1`).toMatch(/<h1[^>]*>\s*Office &amp; Commercial Cleaning/);
    }
  });

  it("commercial pages never quote an hourly rate", () => {
    const hits = COMMERCIAL_FILES.filter((rel) => /hourly rate|same hourly/i.test(stripComments(read(rel))));
    expect(hits, "commercial work is priced per square foot at a walkthrough, not at an hourly rate").toEqual([]);
    for (const rel of COMMERCIAL_FILES) {
      expect(stripComments(read(rel)), `${rel} no longer says commercial work is priced per square foot`).toMatch(/per square\s+foot/);
    }
  });

  it("no commercial card promises a health department standard", () => {
    const hits = COMMERCIAL_FILES.filter((rel) => /health department|health inspector|meets? health/i.test(stripComments(read(rel))));
    expect(hits, "a promise to meet an inspector's standard; describe the written scope instead").toEqual([]);
  });

  it("commercial copy says what the team does, not what a product does", () => {
    // A disinfectant the client names at the walkthrough may be mentioned; a
    // claim that surfaces are sanitised or disinfected may not.
    // "disinfect" in any form but "disinfectant" (the client's product) counts.
    const CLAIM = /sanitiz|sanitis|disinfect(?!ants?\b)|hospital-grade|non-?toxic/i;
    const hits: string[] = [];
    for (const rel of COMMERCIAL_FILES) {
      const m = CLAIM.exec(stripComments(read(rel)));
      if (m) hits.push(`${rel}: "${m[0]}"`);
    }
    expect(hits, "a product-effect claim on a commercial page").toEqual([]);
  });

  it("the primary commercial CTA opens office cleaning for the branch's city", () => {
    for (const [city, rel] of Object.entries(COMMERCIAL)) {
      const src = stripComments(read(rel));
      const href = /const QUOTE_HREF = "([^"]+)"/.exec(src)?.[1];
      expect(href, `${rel} quote link`).toBe(`/contact-us/#topic=office&city=${city}`);
      const ctas = [...src.matchAll(/<Link to=\{QUOTE_HREF\}>([^<]+)<\/Link>/g)].map((m) => m[1].trim());
      expect(ctas.length, `${rel} has no CTA on QUOTE_HREF`).toBeGreaterThanOrEqual(2);
      // Owner, 2026-09-11: the label names office cleaning, the only commercial
      // work quoted online; other premises start with a call.
      for (const label of ctas) expect(label).toBe("Request an Office Cleaning Quote");
      expect(src, `${rel} still links the bare contact form`).not.toMatch(/to="\/contact-us\/"/);
    }
  });

  it("the commercial FAQ says evening and weekend work can be arranged", () => {
    // Owner, 2026-09-11: work outside the office's regular hours can be
    // arranged. The answer had said to ask at the walkthrough.
    for (const city of ["Edmonton", "Calgary"] as const) {
      const answer = commercialFaqs(city, "(000) 000-0000").find((f) => /outside our business hours/i.test(f.q))?.a ?? "";
      expect(answer, "the out-of-hours answer is gone").not.toBe("");
      expect(answer).toMatch(/^Yes\./);
      expect(answer).toContain(`evening and weekend visits outside the ${city} office's regular hours can be arranged`);
      expect(answer, "hedged again").not.toMatch(/ask at the walkthrough about times|outside that window/i);
    }
  });

  it("the commercial FAQ applies the home cancellation fee and re-clean window, read from policy.ts", () => {
    // Owner, 2026-09-11: both apply to commercial clients as they do to homes.
    const src = stripComments(read("components/CommercialDepth.tsx"));
    for (const field of ["cancellationNoticeHours", "cancellationFee", "guaranteeWindowHours"]) {
      expect(src, `the FAQ no longer reads POLICY.${field}`).toContain("${POLICY." + field + "}");
    }
    expect(src, "a dollar figure typed into the commercial FAQ").not.toMatch(/\$\d/);
    const faqs = commercialFaqs("Calgary", "(000) 000-0000");
    const contract = faqs.find((f) => /long-term contract/i.test(f.q))?.a ?? "";
    expect(contract).toContain(
      `Commercial clients have the same cancellation rule as homes: a visit can be moved or cancelled with ${POLICY.cancellationNoticeHours} hours' notice, and inside that window the fee is ${POLICY.cancellationFee}.`,
    );
    const missed = faqs.find((f) => /something is missed/i.test(f.q))?.a ?? "";
    expect(missed).toContain(
      `Commercial clients have the same re-clean guarantee as homes. Tell us within ${POLICY.guaranteeWindowHours} hours of the clean`,
    );
    expect(faqs.map((f) => f.a).join(" "), "a deposit claim nobody confirmed").not.toMatch(/deposit/i);
  });

  it("premises other than offices are scoped by phone, not quoted online", () => {
    // Owner, 2026-09-10: office cleaning is the only commercial work quoted
    // online. A page listing warehouses, shops, clinics, restaurants and gyms
    // must say those start with a call to the branch.
    for (const [city, rel] of Object.entries(COMMERCIAL)) {
      const text = stripComments(read(rel)).replace(/\s+/g, " ");
      const cityName = city[0].toUpperCase() + city.slice(1);
      expect(text, `${rel} no longer says only office cleaning goes through the form`).toContain(
        "Office cleaning can be requested with the quote form. Warehouse, retail, medical, restaurant and gym premises are scoped by phone and at a walkthrough with the " +
          cityName +
          " office",
      );
    }
    const depth = stripComments(read("components/CommercialDepth.tsx")).replace(/\s+/g, " ");
    expect(depth).toContain("other premises are scoped by phone and at a walkthrough with the {city} office");
  });

  it("the residential-pricing link goes to the branch's price list", () => {
    const src = stripComments(read("components/CommercialDepth.tsx"));
    const at = src.indexOf("See residential pricing for");
    expect(at, "the residential-pricing link is gone").toBeGreaterThan(-1);
    const link = src.slice(src.lastIndexOf("<Link", at), at);
    expect(link).toContain('to={city === "Edmonton" ? "/pricing/" : "/calgary/pricing/"}');
  });
});

describe("the contact page's callback topics", () => {
  it("preselects office or Airbnb and the city, and drops the home-pricing pitch", () => {
    const src = stripComments(read("pages/Contact.tsx"));
    expect(src).toMatch(/const isCallbackTopic = isOffice \|\| isAirbnb;/);
    expect(src).toMatch(/const presetCity = topicCity === "edmonton" \|\| topicCity === "calgary" \? topicCity : "";/);
    expect(src).toMatch(/isAirbnb \? "airbnb" : isOffice \? "commercial"/);
    expect(src, "the form no longer starts from the preset city").toMatch(/\n\s*city: presetCity,/);
    expect(src, "the form no longer starts from the preset service").toMatch(/\n\s*service: presetService,/);
    expect(
      src,
      "office and Airbnb visitors must see the callback prompt in place of the instant-price pitch",
    ).toMatch(/\{isCallbackTopic \? \([\s\S]*?Tell us about the premises or turnover, timing and required scope\.[\s\S]*?\) : \([\s\S]*?skip the form/);
  });

  it("a topic link followed on the contact page replaces an unedited preset message", () => {
    // The effect that carries a new ?topic= into a mounted form must swap the
    // message while it is still the last preset written, and keep typed text.
    const src = stripComments(read("pages/Contact.tsx"));
    expect(src).toMatch(/const lastPresetMessage = useRef\(presetMessage\);/);
    expect(src).toMatch(/const previousPreset = lastPresetMessage\.current;/);
    expect(src).toMatch(/const untouched = !prev\.message\.trim\(\) \|\| prev\.message === previousPreset;/);
    expect(src).toMatch(/message: presetMessage && untouched \? presetMessage : prev\.message,/);
    expect(src, "the effect must follow the preset message").toMatch(/\}, \[presetCity, presetService, presetMessage\]\);/);
  });

  it("office and Airbnb visitors are not pointed at the instant price anywhere on the page", () => {
    const src = stripComments(read("pages/Contact.tsx"));
    // Hero paragraph, hero button and the form's intro line each switch on the topic.
    expect(src, "hero paragraph").toMatch(
      /\{isCallbackTopic \? \(\s*<p[^>]*>\s*\{isOffice[\s\S]{0,600}?\) : \(\s*<p[^>]*>\s*The fastest answer to most questions/,
    );
    expect(src, "hero button").toMatch(
      /\{isCallbackTopic \? \(\s*<Button[\s\S]{0,300}?href="#contact-form"[\s\S]{0,200}?Request a Callback[\s\S]{0,100}?\) : \(\s*<Button[\s\S]{0,300}?See My Instant Price/,
    );
    expect(src, "form intro").toMatch(
      /\{isCallbackTopic \? \(\s*<p[^>]*>\s*\{isOffice[\s\S]{0,600}?\) : \(\s*<p[^>]*>\s*For questions the price cannot answer/,
    );
    expect(src, "the callback button has nowhere to go").toMatch(/<form id="contact-form"/);
    // Every instant-price pitch sits in the plain-contact branch.
    for (const phrase of ["See My Instant Price", "The fastest answer", "For questions the price cannot answer", "skip the form"]) {
      for (const m of src.matchAll(new RegExp(phrase, "g"))) {
        const before = src.slice(0, m.index);
        const ternary = before.lastIndexOf("{isCallbackTopic ? (");
        const elseAt = before.lastIndexOf(") : (");
        expect(ternary, `"${phrase}" is outside any isCallbackTopic switch`).toBeGreaterThan(-1);
        expect(elseAt, `"${phrase}" is not in the plain-contact branch`).toBeGreaterThan(ternary);
        // A ternary closes on a line of its own; the phrase must sit before that.
        expect(before.slice(elseAt), `"${phrase}" follows a closed isCallbackTopic switch`).not.toMatch(/\n\s*\)\}\s*\n/);
      }
    }
  });
});

describe("the cost guide (owner, 2026-09-11)", () => {
  const guide = () => stripComments(read("pages/BlogHouseCleaningCost.tsx"));

  it("the cost guide no longer says home cleans are never hourly", () => {
    const src = guide();
    for (const phrase of [/does not charge by the hour/i, /home cleans are not\b/i, /prices every home clean flat/i]) {
      expect(src, `the guide still says ${phrase.source}`).not.toMatch(phrase);
    }
  });

  it("the cost guide's hourly answer quotes the home rate for home jobs and the Airbnb rate for turnovers", () => {
    const src = guide();
    expect(src).toMatch(/const HOME_HOURLY = formatPrice\(HOME_HOURLY_RATE\);/);
    expect(src).toMatch(/const HOURLY = formatPrice\(HOURLY_RATE\);/);
    const answer = /id: "per-hour",[\s\S]*?a: `([^`]*)`/.exec(src)?.[1] ?? "";
    expect(answer, "the per-hour answer is gone").not.toBe("");
    expect(answer).toMatch(/Partial or unusual home-cleaning jobs[^.]*from \$\{HOME_HOURLY\} per cleaner-hour/);
    expect(answer).toMatch(/Airbnb and short-term rental turnovers have a separate rate of \$\{HOURLY\} per cleaner-hour/);
    expect(answer, "the minimums").toContain("a minimum of 3 hours for one cleaner or 2 hours for two");
  });

  it("the cost guide's move-out card leaves interior glass to the add-ons", () => {
    const src = guide();
    const card = /title: "Move-in or move-out clean",([\s\S]*?)pricedBy:/.exec(src)?.[1] ?? "";
    expect(card, "the move-out card is gone").not.toBe("");
    expect(card).not.toMatch(/interior glass|reachable glass|walls spot-cleaned/i);
    expect(card).toMatch(/Interior window cleaning, blinds, spot wall cleaning and full wall washing are separate/);
    expect(card).toContain('to="/move-out-cleaning-edmonton/"');
    expect(card).toContain('to="/move-out-cleaning-calgary/"');
  });

  it("the cost guide dates and sources its market ranges", () => {
    const src = guide();
    expect(src).toMatch(
      /Ranges from the published prices of \{MARKET_SAMPLE\.companies\} Edmonton and Calgary\s+cleaning companies, checked \{MARKET_SAMPLE\.checked\}, taken as each company\s+published them: before GST, including GST, or not saying\. Your own quote may differ\./,
    );
    // The sample mixes GST treatments, so the ranges must never be called
    // "before GST" as a whole.
    const doc = readFileSync(join(SITE, "docs", "cost-guide-price-sample-2026-09.md"), "utf-8");
    const gstColumn = [...doc.matchAll(/^\| \d+ \|(?:[^|]*\|){5}([^|]*)\|/gm)].map((m) => m[1].trim());
    expect(gstColumn.length, "the sample table moved").toBeGreaterThan(0);
    if (gstColumn.some((cell) => !/^Yes\b/.test(cell))) {
      expect(src).not.toMatch(/checked \{MARKET_SAMPLE\.checked\},? before GST/);
    }
    expect(/checked: "([^"]+)"/.exec(src)?.[1], "the sample's month").toMatch(/^(January|February|March|April|May|June|July|August|September|October|November|December) \d{4}$/);
  });

  it("the cost guide's market ranges match the recorded price sample", () => {
    const src = guide();
    const doc = readFileSync(join(SITE, "docs", "cost-guide-price-sample-2026-09.md"), "utf-8");
    const recorded = (key: string) => {
      const m = new RegExp(`^\\| ${key} \\| (\\d+) \\| (\\d+) \\|`, "m").exec(doc);
      expect(m, `the sample record has no ${key} row`).toBeTruthy();
      return [Number(m![1]), Number(m![2])];
    };
    const onPage = (field: string) => {
      const m = new RegExp(`${field}: \\[(\\d+), (\\d+)\\]`).exec(src);
      expect(m, `MARKET_SAMPLE has no ${field}`).toBeTruthy();
      return [Number(m![1]), Number(m![2])];
    };
    expect(onPage("standardTwoBedroom")).toEqual(recorded("standard-2-bedroom"));
    expect(onPage("moveOutTwoBedroom")).toEqual(recorded("move-out-2-bedroom"));
    expect(onPage("hourlyPerCleaner")).toEqual(recorded("hourly-per-cleaner"));
    const companies = /companies: (\d+),/.exec(src)?.[1];
    expect(companies, "company count").toBe(/Companies behind the ranges: (\d+)/.exec(doc)?.[1]);
    expect(Number(companies), "a range needs a real sample").toBeGreaterThanOrEqual(6);
  });
});
