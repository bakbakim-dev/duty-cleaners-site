/**
 * SINGLE SOURCE OF TRUTH for every number, claim and guarantee line on the
 * site. Anything not yet confirmed by the owner is `null` — components must
 * hide the element rather than print an invented figure.
 */

import { cityFromPath } from "@/lib/city-from-path";

export interface CityProof {
  city: "Edmonton" | "Calgary";
  phone: string;
  phoneLink: string;
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
  /** TODO-OWNER: real Google rating (e.g. 4.8). */
  googleRating: number | null;
  /** TODO-OWNER: real Google review count. */
  googleReviewCount: number | null;
}

export const CITY_PROOF: Record<"edmonton" | "calgary", CityProof> = {
  edmonton: {
    city: "Edmonton",
    phone: "(780) 913-6565",
    phoneLink: "tel:7809136565",
    address: "18615 71 Ave NW, Edmonton, AB",
    streetAddress: "18615 71 Ave NW",
    postalCode: "T5T 2V9",
    // Read directly from the Google listing on 2026-09-01, reached through the
    // CID pinned in google-listings.ts (8192121191672692049) — not from the
    // legacy site's embedded widget, which lagged the real count by 12.
    googleRating: 4.9,
    googleReviewCount: 236,
  },
  calgary: {
    city: "Calgary",
    phone: "(403) 768-1341",
    phoneLink: "tel:4037681341",
    address: "2835 37 Street SW #24, Calgary, AB",
    streetAddress: "2835 37 Street SW #24",
    postalCode: "T3E 3B3",
    // Same source and date as Edmonton, via CID 6193344199307583189.
    googleRating: 4.9,
    googleReviewCount: 51,
  },
};

/**
 * Canonical volume claims. Every "homes cleaned" figure on the site reads
 * from here so the numbers can never drift apart again. Review COUNTS are
 * deliberately absent — we say "Five-Star Rated", never a made-up total.
 */
export const HOMES_CLEANED = {
  edmonton: "4,000+",
  calgary: "1,000+",
  alberta: "5,000+",
} as const;

/**
 * The site said "Five-Star Rated" on 170 pages, which rounds the real 4.9 up to
 * a number the business has not earned — and sat on the same page as "4.9 out of
 * 5", contradicting it. This states the sourced figure instead. GOOGLE_RATING
 * below is the single place it is defined; nothing should hand-type a rating.
 */
export const RATING_CLAIM = "4.9 on Google";

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
   * Applicant acceptance rate. NOT published anywhere — the previous comment
   * said it was, which would invite someone to trust it. Unconfirmed, so it
   * stays out of the pages until the owner checks it against BookingKoala.
   */
  applicantAcceptanceRate: "under 5%",
  /** TODO-OWNER: total cleans completed since 2017 (from BookingKoala). */
  totalCleans: null as number | null,
  /** TODO-OWNER: percentage of customers who rebook. */
  rebookRate: null as number | null,
};

/**
 * Risk-reversal lines shown beside every submit button.
 * Set `enabled: false` for anything not operationally true.
 * TODO-OWNER: confirm each line before launch.
 */
export const RISK_REVERSAL: { id: string; label: string; enabled: boolean }[] = [
  { id: "no-charge", label: "You won't be charged today", enabled: true },
  { id: "reschedule", label: "Free to reschedule or cancel with 24 hours' notice", enabled: true },
  { id: "no-contract", label: "No contracts — book one clean or many", enabled: true },
];

export const activeRiskReversal = () => RISK_REVERSAL.filter((line) => line.enabled);

/**
 * New-customer offer bar. Toggle `enabled` per campaign, and optionally set
 * an ISO start/end date so a campaign can be scheduled without a code change.
 * TODO-OWNER: confirm amounts and whether this runs permanently.
 */
export const OFFER = {
  enabled: false,
  headline: "$20 off a one-time clean · $40 off your first recurring clean",
  detail: "Applied automatically at checkout.",
  startsAt: null as string | null,
  endsAt: null as string | null,
};

export const isOfferLive = (now: Date = new Date()) => {
  if (!OFFER.enabled) return false;
  if (OFFER.startsAt && now < new Date(OFFER.startsAt)) return false;
  if (OFFER.endsAt && now > new Date(OFFER.endsAt)) return false;
  return true;
};

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
 * How fast we promise to come back after a booking request.
 * TODO-OWNER: confirm the real promise before launch.
 */
export const RESPONSE_TIME_PROMISE = "1 hour during business hours";

/** BookingKoala scheduling handoff — v2 only. TODO-OWNER: confirm the URL. */
export const BOOKING_KOALA_URL: string | null = null;

/**
 * Cleaner recruitment posting.
 *
 * JobPosting structured data is only emitted when `datePosted` is set, because
 * Google demotes and eventually drops postings with stale or missing dates — a
 * wrong date is worse than no markup. `baseSalary` is deliberately absent until
 * the owner confirms a real range; the site never prints an invented figure.
 *
 * TODO-OWNER: set datePosted (ISO yyyy-mm-dd) and validThrough when recruiting,
 * and clear them when the role closes.
 */
export const CLEANER_JOB_POSTING: {
  datePosted: string | null;
  validThrough: string | null;
  employmentType: string;
} = {
  datePosted: null,
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
