/**
 * SINGLE SOURCE OF TRUTH for every number, claim and guarantee line on the
 * site. Anything not yet confirmed by the owner is `null` — components must
 * hide the element rather than print an invented figure.
 */

import { cityFromPath } from "@/lib/city-from-path";
import { confirm, type Confirmed, type Unconfirmed } from "./confirmed";

export interface CityProof {
  city: "Edmonton" | "Calgary";
  phone: string;
  phoneLink: string;
  /**
   * The same number in E.164, for schema.org `telephone`.
   *
   * It lives here because it was hard-coded in eight other files and one of
   * them drifted: /contact-us/ built its value as
   * `phoneLink.replace("tel:", "+1-")`, which yields "+1-7809136565" — no
   * separators, unlike the "+1-780-913-6565" on the other 208 pages. Both
   * described the SAME entity, https://dutycleaners.ca/#edmonton, so the graph
   * asserted one business with two different phone numbers.
   */
  phoneE164: string;
  address: string;
  /**
   * Structured NAP parts, for schema. An AuditSpur build audit found 175 pages
   * shipping a LocalBusiness node with NO address at all — the provider nodes
   * in pricing-schema.ts and ServiceDetailPage.tsx each hand-built their own
   * entity and none carried one. Schema reads these parts; display strings
   * above stay as they are. Postal sources: Edmonton from this site's own
   * footer; Calgary from the live dutycleaners.ca footer (captured 2026-08-25,
   * AuditSpur scan 422), since no file in this repo declared it.
   */
  streetAddress: string;
  postalCode: string;
  /** The listing's rating, read from Google — never typed from memory. */
  googleRating: Confirmed<number> | Unconfirmed;
  /** The listing's review count, same source and date. */
  googleReviewCount: Confirmed<number> | Unconfirmed;
  /** The office pin, for the hub's LocalBusiness `geo`. */
  geo: Confirmed<{ latitude: number; longitude: number }>;
}

export const CITY_PROOF: Record<"edmonton" | "calgary", CityProof> = {
  edmonton: {
    city: "Edmonton",
    phone: "(780) 913-6565",
    phoneLink: "tel:7809136565",
    phoneE164: "+1-780-913-6565",
    address: "18615 71 Ave NW, Edmonton, AB",
    streetAddress: "18615 71 Ave NW",
    postalCode: "T5T 2V9",
    // Read directly from the Google listing on 2026-09-01, reached through the
    // CID pinned in google-listings.ts (8192121191672692049) — not from the
    // legacy site's embedded widget, which lagged the real count by 12.
    googleRating: confirm(4.9, { by: "google-listing", on: "2026-09-01", note: "CID 8192121191672692049" }),
    googleReviewCount: confirm(236, { by: "google-listing", on: "2026-09-01", note: "CID 8192121191672692049" }),
    // The office pin as the Google listing stores it (the !3d/!4d pair in its
    // Maps URL), read 2026-09-10. A click on the pin icon reads a point on the
    // drawn marker instead; the owner's click landed about 16 m north.
    geo: confirm({ latitude: 53.504317, longitude: -113.64391 }, { by: "owner", on: "2026-09-10", note: "Google listing pin, CID 8192121191672692049" }),
  },
  calgary: {
    city: "Calgary",
    phone: "(403) 768-1341",
    phoneLink: "tel:4037681341",
    phoneE164: "+1-403-768-1341",
    address: "2835 37 Street SW #24, Calgary, AB",
    streetAddress: "2835 37 Street SW #24",
    postalCode: "T3E 3B3",
    // Same source and date as Edmonton, via CID 6193344199307583189.
    googleRating: confirm(4.9, { by: "google-listing", on: "2026-09-01", note: "CID 6193344199307583189" }),
    googleReviewCount: confirm(51, { by: "google-listing", on: "2026-09-01", note: "CID 6193344199307583189" }),
    // Same source as Edmonton: the listing's own pin, read 2026-09-10.
    geo: confirm({ latitude: 51.029252, longitude: -114.142131 }, { by: "owner", on: "2026-09-10", note: "Google listing pin, CID 6193344199307583189" }),
  },
};

/**
 * The one volume claim the site makes; every page reads it from here.
 *
 * The owner confirmed "over 5,000 bookings" on 2026-09-10. It counts bookings,
 * not homes: a recurring customer's home is booked again and again, so the
 * figure must never be restated as homes cleaned. It is not split by city
 * either. The site used to print "4,000+ Edmonton homes" and "1,000+ Calgary
 * homes", a split nobody confirmed that added up to 5,000 homes.
 */
export const BOOKINGS = confirm("5,000+", { by: "owner", on: "2026-09-10", note: "over 5,000 bookings, Alberta-wide" });

/**
 * The site said "Five-Star Rated" on 170 pages, which rounds the real 4.9 up to
 * a number the business has not earned — and sat on the same page as "4.9 out of
 * 5", contradicting it. This states the sourced figure instead. The rating is
 * defined once, in CITY_PROOF.<city>.googleRating (read from each Google listing);
 * this line is built from it. Both listings read 4.9. If they ever differ, make
 * this per-branch rather than picking one.
 */
export const RATING_CLAIM = `${CITY_PROOF.edmonton.googleRating} on Google`;

export const cityProofFor = (pathname: string) =>
  // Canonical-aware. A bare startsWith("/calgary") missed every preserved
  // legacy Calgary URL (/cleaning-services-calgary/ chief among them), so the
  // quote flow showed Edmonton's phone and address on Calgary's biggest page.
  cityFromPath(pathname) === "calgary" ? CITY_PROOF.calgary : CITY_PROOF.edmonton;

/** Company-wide facts. Operating since 2017 — never "10+ years". */
export const COMPANY = {
  foundedYear: 2017,
  sinceLabel: "since 2017",
  /**
   * Applicant acceptance rate. NOT published anywhere, and unconfirmed — the
   * figure floated was "under 5%", which stays here as a note and nowhere
   * else. It used to sit in this slot as a string, which is exactly the shape a
   * page would render. Open question put to the owner on 2026-09-10: publish a
   * real figure, or never?
   */
  applicantAcceptanceRate: null as Confirmed<string> | Unconfirmed,
  /**
   * Percentage of customers who rebook. Null by the owner's choice (2026-09-10):
   * the site publishes no rebook rate. Do not ask again or fill it in unless the
   * owner raises it.
   */
  rebookRate: null as number | null,
};

/** BOOKINGS with its scope and start year: "5,000+ Alberta bookings since 2017". */
export const BOOKINGS_CLAIM = `${BOOKINGS} Alberta bookings since ${COMPANY.foundedYear}`;

/**
 * Risk-reversal lines shown beside every submit button.
 * Set `enabled: false` for anything not operationally true.
 * The owner confirmed "No contracts" and the no-charge line on 2026-09-10, and
 * the reschedule line restates the 24-hour notice policy.ts confirms. Online
 * bookings need 24 hours' notice, so nothing is ever charged on the booking day.
 * The card hold placed the day before the clean (PAYMENT_TERMS) is not a charge,
 * though it can land on the booking day for a clean booked just over 24 hours out.
 */
export const RISK_REVERSAL: { id: string; label: string; enabled: boolean }[] = [
  { id: "no-charge", label: confirm("You won't be charged today", { by: "owner", on: "2026-09-10" }), enabled: true },
  { id: "reschedule", label: "Free to reschedule or cancel with 24 hours' notice", enabled: true },
  { id: "no-contract", label: confirm("No contracts — book one clean or many", { by: "owner", on: "2026-09-10" }), enabled: true },
];

export const activeRiskReversal = () => RISK_REVERSAL.filter((line) => line.enabled);

/**
 * Where completed quotes are submitted: see `src/config/ghl.ts`. Kept out of
 * this file deliberately so there is exactly one place to configure it.
 */

/** Email shown whenever a submission fails. */
export const SUPPORT_EMAIL = "support@dutycleaners.ca";

/**
 * Every profile that represents this business elsewhere on the web, for schema
 * `sameAs`. These are all linked in the footer already; until now `sameAs`
 * carried only the two Google Maps permalinks, so the other seven did no
 * entity-disambiguation work at all. Keep this in sync with Footer.tsx.
 *
 * The Calgary Yelp URL is stored without its leftover ?osq= search parameter —
 * a canonical profile URL, not the search that happened to find it.
 */
export const BRAND_PROFILES = [
  "https://www.google.com/maps?cid=8192121191672692049",
  "https://www.google.com/maps?cid=6193344199307583189",
  "https://www.yelp.ca/biz/duty-cleaners-edmonton",
  "https://www.yelp.ca/biz/duty-cleaners-calgary-calgary",
  "https://www.facebook.com/dutycleaners/",
  "https://www.instagram.com/dutycleaners/",
  "https://www.linkedin.com/company/duty-cleaners/",
  "https://www.youtube.com/@dutycleaners2795",
  "https://x.com/Dutycleaners",
] as const;

/**
 * Per-branch sameAs. Use this on any node scoped to ONE city.
 *
 * BRAND_PROFILES is the ORGANISATION's full profile set and is correct on the
 * Organization node — but it was also being emitted on all 165 location
 * #business nodes and both branch nodes, so every Edmonton location claimed
 * identity with Calgary's Google Business Profile and Yelp listing, and vice
 * versa. sameAs asserts "this node IS that entity", so that told Google the two
 * GBP listings are the same business as each other and as every neighbourhood
 * node — the precise opposite of the disambiguation the @id work was for.
 *
 * City-specific profiles first, brand-wide social after (those genuinely are
 * shared by both branches).
 */
const SHARED_SOCIAL = [
  "https://www.facebook.com/dutycleaners/",
  "https://www.instagram.com/dutycleaners/",
  "https://www.linkedin.com/company/duty-cleaners/",
  "https://www.youtube.com/@dutycleaners2795",
  "https://x.com/Dutycleaners",
] as const;

export const BRANCH_PROFILES: Record<"edmonton" | "calgary", readonly string[]> = {
  edmonton: [
    "https://www.google.com/maps?cid=8192121191672692049",
    "https://www.yelp.ca/biz/duty-cleaners-edmonton",
    ...SHARED_SOCIAL,
  ],
  calgary: [
    "https://www.google.com/maps?cid=6193344199307583189",
    "https://www.yelp.ca/biz/duty-cleaners-calgary-calgary",
    ...SHARED_SOCIAL,
  ],
};

/** Stable @id for the Organization every branch and location node hangs off. */
export const ORG_ID = "https://dutycleaners.ca/#org";

/** Stable @id per branch, so 166 location nodes stop being anonymous businesses. */
export const BRANCH_ID = {
  edmonton: "https://dutycleaners.ca/#edmonton",
  calgary: "https://dutycleaners.ca/#calgary",
} as const;

/**
 * The canonical identity of each branch entity: one url, one name.
 *
 * The @id is shared by five surfaces (both city hubs, both move-out pages and
 * /contact-us) and each was emitting its OWN page url and its own name spelling
 * — so #edmonton appeared with three different `url` values and two names.
 * An @id means "this is the same entity", so three urls for one @id is a
 * contradiction that undoes the disambiguation the @id exists to provide.
 *
 * url points at the branch's own hub page, not at whichever page happens to be
 * rendering the node.
 */
export const BRANCH_IDENTITY = {
  edmonton: { url: "https://dutycleaners.ca/", name: "Duty Cleaners Edmonton" },
  calgary: {
    url: "https://dutycleaners.ca/cleaning-services-calgary/",
    name: "Duty Cleaners Calgary",
  },
} as const;


/**
 * How soon we text back after a quote request to confirm the time. The owner
 * set it at 24 hours on 2026-09-10; the site had said 1 hour.
 */
export const RESPONSE_TIME_PROMISE = confirm("24 hours", { by: "owner", on: "2026-09-10" });

/**
 * Cleaner recruitment posting.
 *
 * JobPosting structured data is only emitted when `datePosted` is set, because
 * Google demotes and eventually drops postings with stale or missing dates — a
 * wrong date is worse than no markup. `baseSalary` is deliberately absent until
 * the owner confirms a real range; the site never prints an invented figure.
 *
 * The owner hires continuously (2026-09-10). Google's job-posting guidance says
 * to leave validThrough out when a posting never expires, so it stays null.
 * datePosted is the date this posting went up; set it to null if hiring stops.
 */
export const CLEANER_JOB_POSTING: {
  datePosted: string | null;
  validThrough: string | null;
  employmentType: string;
} = {
  datePosted: "2026-09-10",
  validThrough: null,
  // /join-the-team/ requires a CRA Business Number, an own vehicle and own
  // equipment. That is contractor work; PART_TIME would misdescribe it in
  // structured data the moment datePosted is set.
  employmentType: "CONTRACTOR",
};


/**
 * The city's PostalAddress node for JSON-LD, from the same source of truth the
 * display strings use. Every LocalBusiness/provider node on the site must call
 * this rather than hand-building an entity: an AuditSpur build audit found 175
 * pages whose LocalBusiness carried no address because three emitters each
 * built their own.
 */
export const schemaAddressFor = (city: "edmonton" | "calgary") => {
  const p = CITY_PROOF[city];
  return {
    "@type": "PostalAddress",
    streetAddress: p.streetAddress,
    addressLocality: p.city,
    addressRegion: "AB",
    postalCode: p.postalCode,
    addressCountry: "CA",
  } as const;
};
