import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  CITY_PROOF,
  BRANCH_ID,
  BRANCH_IDENTITY,
  BRANCH_PROFILES,
  BRAND_PROFILES,
  RED_DEER_PATH,
  cityProofFor,
  hasGoogleRating,
  hoursLineFor,
  openingHoursShortFor,
  openingHoursSpecFor,
} from "./proof";
import { LEGACY_URLS, canonicalForPath } from "./legacy-urls";
import { postalCodeCityName, postalCodeCityStatus } from "@/lib/booking-redirect";
import { branchFromPath, cityFromPath } from "@/lib/city-from-path";
import { RED_DEER_LISTING } from "@/lib/google-listings";
import { buildLocationSchema } from "@/lib/location-schema";

/**
 * The Red Deer branch (owner, 2026-09-11).
 *
 * Red Deer is a third branch with its own office and Google Business Profile.
 * The owner: "a gbp listing is up for it ... no travel charge because it has
 * its own office, and yes bookingkoala does [accept Red Deer postal codes]".
 * The profile's Website button links /cleaning-services-red-deer/, which used
 * to 301 to /locations/. The facts below are the listing's own, read the same
 * day, and the listing has no reviews yet.
 *
 * Source-level guards: they read the code and data, not dist/, so they hold
 * before a build.
 */

const SRC = join(__dirname, "..");
const ROOT = join(SRC, "..");
const read = (rel: string) => readFileSync(join(SRC, rel), "utf-8");
/** Source with comments stripped: a guard must test code, not prose. */
const codeOf = (rel: string) =>
  read(rel)
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/^\s*\/\/.*$/gm, " ");

describe("the Red Deer page is a real page at the listing's URL", () => {
  it("the Red Deer page route exists and the legacy redirect is gone", () => {
    const app = codeOf("App.tsx");
    expect(app, "the preserved route is missing").toMatch(/<Route path="\/cleaning-services-red-deer" element=\{<RedDeer \/>\} \/>/);
    expect(app, "the modern route it preserves is missing").toMatch(/<Route path="\/locations\/red-deer" element=\{<RedDeer \/>\} \/>/);
    expect(app, "App.tsx still redirects the Red Deer URL").not.toMatch(/path="\/cleaning-services-red-deer"[^>]*<Navigate/);

    const entry = LEGACY_URLS.filter((u) => u.legacy === "/cleaning-services-red-deer");
    expect(entry, "one legacy entry for the Red Deer URL").toHaveLength(1);
    expect(entry[0].mode, "the Red Deer URL must serve the page, not 301").toBe("preserve");
    expect(canonicalForPath("/locations/red-deer")).toBe(RED_DEER_PATH);
    expect(canonicalForPath("/cleaning-services-red-deer")).toBe(RED_DEER_PATH);
    expect(BRANCH_IDENTITY.reddeer.url).toBe(`https://dutycleaners.ca${RED_DEER_PATH}`);
  });

  it("the Red Deer URL resolves to the Red Deer office and nothing else moves", () => {
    for (const path of ["/cleaning-services-red-deer/", "/cleaning-services-red-deer", "/locations/red-deer/"]) {
      expect(branchFromPath(path), path).toBe("reddeer");
      expect(cityProofFor(path).city, path).toBe("Red Deer");
    }
    expect(branchFromPath("/")).toBe("edmonton");
    expect(branchFromPath("/cleaning-services-calgary/")).toBe("calgary");
    expect(branchFromPath("/locations/mahogany/")).toBe("calgary");
    // The page family stays Edmonton's: Red Deer has no service pages of its own.
    expect(cityFromPath("/cleaning-services-red-deer/")).toBe("edmonton");
  });
});

describe("proof.ts holds the Red Deer listing's own facts", () => {
  it("proof.ts Red Deer NAP, pin and hours equal the Google listing", () => {
    const rd = CITY_PROOF.reddeer;
    expect(rd.city).toBe("Red Deer");
    expect(rd.streetAddress).toBe("5212 48 St");
    expect(rd.postalCode).toBe("T4N 1S4");
    expect(rd.phone).toBe("(587) 570-6979");
    expect(rd.phoneLink).toBe("tel:5875706979");
    expect(rd.phoneE164).toBe("+1-587-570-6979");
    expect({ ...rd.geo }).toEqual({ latitude: 52.2673285, longitude: -113.8189323 });
    expect(openingHoursSpecFor("reddeer")).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "07:00",
        closes: "21:00",
      },
    ]);
    expect(openingHoursShortFor("reddeer")).toEqual(["Mo-Sa 07:00-21:00"]);
    expect(hoursLineFor("reddeer")).toBe("Monday to Saturday 7:00 AM to 9:00 PM, and not on Sunday");

    expect(BRANCH_IDENTITY.reddeer.name).toBe("Duty Cleaners House Cleaning Services Red Deer");
    expect(RED_DEER_LISTING.name).toBe(BRANCH_IDENTITY.reddeer.name);
    expect(RED_DEER_LISTING.url).toBe(`https://www.google.com/maps?cid=${RED_DEER_LISTING.cid}`);
    // The hex form in the listing's data blob and the decimal CID are one id.
    expect(BigInt(RED_DEER_LISTING.cidHex).toString()).toBe(RED_DEER_LISTING.cid);
  });

  it("the Edmonton and Calgary hours are unchanged by the per-branch model", () => {
    for (const key of ["edmonton", "calgary"] as const) {
      expect(openingHoursShortFor(key)).toEqual(["Mo-Sa 08:00-20:00", "Su 09:00-15:00"]);
      expect(openingHoursSpecFor(key)).toEqual([
        {
          "@type": "OpeningHoursSpecification",
          dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          opens: "08:00",
          closes: "20:00",
        },
        { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "15:00" },
      ]);
    }
    const provider = buildLocationSchema({ name: "x", city: "edmonton", url: "https://dutycleaners.ca/locations/garneau" }).provider;
    expect(provider.openingHours).toEqual(["Mo-Sa 08:00-20:00", "Su 09:00-15:00"]);
  });
});

describe("Red Deer shows no rating it has not earned", () => {
  it("the Red Deer page never renders RATING_CLAIM or a review count", () => {
    // The listing has no reviews yet (2026-09-11). RATING_CLAIM is the
    // Edmonton and Calgary listings' 4.9, so presenting it on the Red Deer page
    // would claim a rating the Red Deer listing does not carry.
    expect(CITY_PROOF.reddeer.googleRating).toBeNull();
    expect(CITY_PROOF.reddeer.googleReviewCount).toBeNull();
    expect(hasGoogleRating("reddeer")).toBe(false);

    const page = codeOf("pages/locations/RedDeer.tsx");
    expect(page, "the Red Deer page reads a rating").not.toMatch(/RATING_CLAIM|googleRating|aggregateRating/);
    expect(page, "the Red Deer page prints a review count or star figure").not.toMatch(/\d[\d,]*\s+reviews?\b|\d\.\d on Google|\d\.\d out of 5/i);
    expect(page, "the Red Deer page borrows another branch's review count").not.toMatch(/CITY_PROOF\.(?:edmonton|calgary)\.googleReviewCount/);

    // The shared surfaces that list every office hide the rating for Red Deer.
    expect(codeOf("pages/Contact.tsx")).toMatch(/showRating=\{hasGoogleRating\("reddeer"\)\}/);
    expect(codeOf("components/quote/QuoteFlow.tsx")).toMatch(/hasGoogleRating\(proof\.key\) \? <>Rated \{RATING_CLAIM\}/);
  });
});

describe("the funnel prices Red Deer like any in-city address", () => {
  it("Red Deer FSAs add no travel fee", () => {
    // Statistics Canada 2021 FSA boundaries against the City of Red Deer
    // (CSD 4808011): T4P and T4R lie wholly inside, T4N mostly (see
    // booking-redirect.ts). BookingKoala accepts them (owner, 2026-09-11).
    for (const code of ["T4N 1S4", "T4P 1A1", "T4R 2B2"]) {
      expect(postalCodeCityStatus(code), code).toBe("inside");
      expect(postalCodeCityName(code), code).toBe("Red Deer");
    }
  });

  it("T3T (Tsuut'ina Nation) adds no travel fee", () => {
    // Owner, 2026-09-11: Tsuut'ina Nation addresses do not pay the travel fee.
    expect(postalCodeCityStatus("T3T 0A1")).toBe("inside");
  });
});

describe("the Organization lists the Red Deer branch", () => {
  it("the Organization schema lists the Red Deer branch", () => {
    const html = readFileSync(join(ROOT, "index.html"), "utf-8");
    const block = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? "{}";
    const org = JSON.parse(block) as { subOrganization?: { "@id": string }[]; sameAs?: string[] };
    expect((org.subOrganization ?? []).map((s) => s["@id"])).toContain(BRANCH_ID.reddeer);
    expect(org.sameAs ?? []).toContain(RED_DEER_LISTING.url);
    expect(BRAND_PROFILES).toContain(RED_DEER_LISTING.url);
    // The branch node's sameAs is its own listing first, never another branch's.
    expect(BRANCH_PROFILES.reddeer[0]).toBe(RED_DEER_LISTING.url);
    expect(BRANCH_PROFILES.reddeer.some((u) => /cid=(?:8192121191672692049|6193344199307583189)/.test(u))).toBe(false);

    // The Red Deer page's LocalBusiness node reads the branch authority.
    const page = codeOf("pages/locations/RedDeer.tsx");
    expect(page).toMatch(/"@id": BRANCH_ID\.reddeer,/);
    expect(page).toMatch(/openingHoursSpecification: openingHoursSpecFor\("reddeer"\),/);
    expect(page).toMatch(/parentOrganization: \{ "@id": ORG_ID \},/);
  });
});
