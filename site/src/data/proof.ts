/**
 * SINGLE SOURCE OF TRUTH for every number, claim and guarantee line on the
 * site. Anything not yet confirmed by the owner is `null` — components must
 * hide the element rather than print an invented figure.
 */

import { branchFromPath, type Branch } from "@/lib/city-from-path";
import { confirm, type Confirmed, type Unconfirmed } from "./confirmed";

export type { Branch } from "@/lib/city-from-path";

/** The days of the week, in schema.org's spelling. */
export const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
export type Weekday = (typeof WEEKDAYS)[number];

/**
 * One run of opening hours: the days it covers and the times, 24-hour "HH:MM".
 * A day that appears in no run is a day the office is closed.
 */
export interface OfficeHours {
  days: readonly Weekday[];
  opens: string;
  closes: string;
}

export interface CityProof {
  /** The branch key, e.g. for a ?city= link. */
  key: Branch;
  city: "Edmonton" | "Calgary" | "Red Deer";
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
  /**
   * The office's opening hours. Edmonton and Calgary keep the same hours; Red
   * Deer's differ, so the hours are per branch rather than one shared line.
   */
  hours: readonly OfficeHours[];
}

/**
 * Edmonton and Calgary's hours: Monday to Saturday 8:00 AM to 8:00 PM, Sunday
 * 9:00 AM to 3:00 PM. These are the hours every Edmonton and Calgary surface
 * has published (policy.ts SERVICE_TERMS, the footer, the schema).
 */
const METRO_HOURS: readonly OfficeHours[] = [
  { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "08:00", closes: "20:00" },
  { days: ["Sunday"], opens: "09:00", closes: "15:00" },
];

export const CITY_PROOF: Record<Branch, CityProof> = {
  edmonton: {
    key: "edmonton",
    city: "Edmonton",
    phone: "(780) 913-6565",
    phoneLink: "tel:7809136565",
    phoneE164: "+1-780-913-6565",
    address: "18615 71 Ave NW, Edmonton, AB",
    streetAddress: "18615 71 Ave NW",
    postalCode: "T5T 2V9",
    // Read directly from the Google listing, reached through the CID pinned in
    // google-listings.ts (8192121191672692049) — not from the legacy site's
    // embedded widget, which lagged the real count by 12. First read
    // 2026-09-01 (236); re-read 2026-09-17. Re-read at least every 90 days
    // (policy.test.ts), and update llms.txt and llms-full.txt in the same step.
    googleRating: confirm(4.9, { by: "google-listing", on: "2026-09-17", note: "CID 8192121191672692049" }),
    googleReviewCount: confirm(238, { by: "google-listing", on: "2026-09-17", note: "CID 8192121191672692049" }),
    // The office pin as the Google listing stores it (the !3d/!4d pair in its
    // Maps URL), read 2026-09-10. A click on the pin icon reads a point on the
    // drawn marker instead; the owner's click landed about 16 m north.
    geo: confirm({ latitude: 53.504317, longitude: -113.64391 }, { by: "owner", on: "2026-09-10", note: "Google listing pin, CID 8192121191672692049" }),
    hours: METRO_HOURS,
  },
  calgary: {
    key: "calgary",
    city: "Calgary",
    phone: "(403) 768-1341",
    phoneLink: "tel:4037681341",
    phoneE164: "+1-403-768-1341",
    address: "2835 37 Street SW #24, Calgary, AB",
    streetAddress: "2835 37 Street SW #24",
    postalCode: "T3E 3B3",
    // Same source and dates as Edmonton, via CID 6193344199307583189 (51 on
    // both reads).
    googleRating: confirm(4.9, { by: "google-listing", on: "2026-09-17", note: "CID 6193344199307583189" }),
    googleReviewCount: confirm(51, { by: "google-listing", on: "2026-09-17", note: "CID 6193344199307583189" }),
    // Same source as Edmonton: the listing's own pin, read 2026-09-10.
    geo: confirm({ latitude: 51.029252, longitude: -114.142131 }, { by: "owner", on: "2026-09-10", note: "Google listing pin, CID 6193344199307583189" }),
    hours: METRO_HOURS,
  },
  /**
   * The Red Deer branch (owner, 2026-09-11: "a gbp listing is up for it ... no
   * travel charge because it has its own office"). Name, address, phone, hours
   * and pin are read from its Google Business Profile on 2026-09-11, reached
   * through CID 10449244954117051184 ("Duty Cleaners House Cleaning Services
   * Red Deer", located in Heritage Village).
   *
   * The listing has NO reviews yet, so the rating and count are null: the site
   * renders no rating for Red Deer, and RATING_CLAIM (the Edmonton and Calgary
   * listings' 4.9) must never be presented as Red Deer's.
   */
  reddeer: {
    key: "reddeer",
    city: "Red Deer",
    phone: "(587) 570-6979",
    phoneLink: "tel:5875706979",
    phoneE164: "+1-587-570-6979",
    address: "5212 48 St, Red Deer, AB",
    streetAddress: "5212 48 St",
    postalCode: "T4N 1S4",
    googleRating: null,
    googleReviewCount: null,
    geo: confirm({ latitude: 52.2673285, longitude: -113.8189323 }, { by: "owner", on: "2026-09-11", note: "Google listing pin, CID 10449244954117051184" }),
    // Monday to Saturday 7:00 AM to 9:00 PM; closed Sunday (the listing, 2026-09-11).
    hours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], opens: "07:00", closes: "21:00" }],
  },
};

/** "07:00" -> "7:00 AM", "21:00" -> "9:00 PM". */
const clock = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
};

/** "Monday to Saturday" for a consecutive run, "Sunday" for one day. */
const dayRange = (days: readonly Weekday[]) =>
  days.length === 1 ? days[0] : `${days[0]} to ${days[days.length - 1]}`;

/**
 * The branch's hours as a sentence fragment, e.g. "Monday to Saturday 8:00 AM
 * to 8:00 PM, and Sunday 9:00 AM to 3:00 PM", or "Monday to Saturday 7:00 AM
 * to 9:00 PM, and not on Sunday". It reads after "is open" or "answers".
 */
export function hoursLineFor(branch: Branch): string {
  const runs = CITY_PROOF[branch].hours.map((h) => `${dayRange(h.days)} ${clock(h.opens)} to ${clock(h.closes)}`);
  const open = new Set(CITY_PROOF[branch].hours.flatMap((h) => h.days));
  const closed = WEEKDAYS.filter((d) => !open.has(d));
  const parts = [...runs, ...(closed.length ? [`not on ${closed.join(" or ")}`] : [])];
  return parts.length > 1 ? `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}` : parts[0];
}

/** Per-run display rows for an hours table: ["Mon to Sat", "7:00 AM to 9:00 PM"], plus closed days. */
export function hoursRowsFor(branch: Branch): Array<[string, string]> {
  const short = (d: Weekday) => d.slice(0, 3);
  const rows: Array<[string, string]> = CITY_PROOF[branch].hours.map((h) => [
    h.days.length === 1 ? h.days[0] : `${short(h.days[0])} to ${short(h.days[h.days.length - 1])}`,
    `${clock(h.opens)} to ${clock(h.closes)}`,
  ]);
  const open = new Set(CITY_PROOF[branch].hours.flatMap((h) => h.days));
  for (const d of WEEKDAYS) if (!open.has(d)) rows.push([d, "Closed"]);
  return rows;
}

/** schema.org `openingHoursSpecification` for the branch. */
export function openingHoursSpecFor(branch: Branch) {
  return CITY_PROOF[branch].hours.map((h) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: h.days.length === 1 ? h.days[0] : [...h.days],
    opens: h.opens,
    closes: h.closes,
  }));
}

/** schema.org `openingHours` shorthand for the branch, e.g. "Mo-Sa 08:00-20:00". */
export function openingHoursShortFor(branch: Branch): string[] {
  const ab = (d: Weekday) => d.slice(0, 2);
  return CITY_PROOF[branch].hours.map((h) =>
    `${h.days.length === 1 ? ab(h.days[0]) : `${ab(h.days[0])}-${ab(h.days[h.days.length - 1])}`} ${h.opens}-${h.closes}`,
  );
}

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
 *
 * It is the Edmonton and Calgary listings' rating. The Red Deer listing has no
 * reviews yet (2026-09-11), so a Red Deer surface shows no rating at all; see
 * `hasGoogleRating`.
 */
export const RATING_CLAIM = `${CITY_PROOF.edmonton.googleRating} on Google`;

/** Whether this branch's own Google listing carries a rating the site may show. */
export const hasGoogleRating = (branch: Branch) => CITY_PROOF[branch].googleRating !== null;

/**
 * "4.9 on Google" from this branch's own listing, or null when it has none
 * (Red Deer). Surfaces that follow the visitor's branch, like the quote funnel,
 * use this rather than RATING_CLAIM, which is the Edmonton listing's figure.
 */
export const ratingClaimFor = (branch: Branch): string | null => {
  const rating = CITY_PROOF[branch].googleRating;
  return rating === null ? null : `${rating} on Google`;
};

export const cityProofFor = (pathname: string) =>
  // Canonical-aware. A bare startsWith("/calgary") missed every preserved
  // legacy Calgary URL (/cleaning-services-calgary/ chief among them), so the
  // quote flow showed Edmonton's phone and address on Calgary's biggest page.
  // The Red Deer page resolves to the Red Deer office.
  CITY_PROOF[branchFromPath(pathname)];

/** Company-wide facts. Operating since 2017 — never "10+ years". */
export const COMPANY = {
  foundedYear: 2017,
  sinceLabel: "since 2017",
  /**
   * Applicant acceptance rate: "under 5%". The owner asked on 2026-09-11 to
   * publish the figure most likely to be accurate. This is the only figure on
   * record (the old site printed it), so it is published as the owner's figure.
   * Replace it if hiring records show otherwise.
   */
  applicantAcceptanceRate: confirm("under 5%", { by: "owner", on: "2026-09-11", note: "the owner's figure, carried over from the old site" }) as Confirmed<string> | Unconfirmed,
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
  { id: "no-contract", label: confirm("No contracts. Book one clean or many.", { by: "owner", on: "2026-09-10", note: "punctuation only changed 2026-09-18" }), enabled: true },
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
 * `sameAs`. Until the September audit `sameAs` carried only the two Google Maps
 * permalinks, so the other profiles did no entity-disambiguation work at all.
 *
 * Edmonton's Yelp profile is left out (2026-09-11): it shows the wrong address
 * (14250 85 Ave NW) and asserting it as this entity would feed that address into
 * entity matching. Add it back once the owner has corrected it. Calgary's Yelp
 * profile has the right address, so it stays here, though the footer no longer
 * links it (it is unclaimed).
 *
 * The Calgary Yelp URL is stored without its leftover ?osq= search parameter —
 * a canonical profile URL, not the search that happened to find it.
 */
export const BRAND_PROFILES = [
  "https://www.google.com/maps?cid=8192121191672692049",
  "https://www.google.com/maps?cid=6193344199307583189",
  "https://www.google.com/maps?cid=10449244954117051184",
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

export const BRANCH_PROFILES: Record<Branch, readonly string[]> = {
  edmonton: [
    "https://www.google.com/maps?cid=8192121191672692049",
    ...SHARED_SOCIAL,
  ],
  calgary: [
    "https://www.google.com/maps?cid=6193344199307583189",
    "https://www.yelp.ca/biz/duty-cleaners-calgary-calgary",
    ...SHARED_SOCIAL,
  ],
  // The Red Deer Google Business Profile (CID read 2026-09-11). No Yelp profile
  // is on file for Red Deer.
  reddeer: [
    "https://www.google.com/maps?cid=10449244954117051184",
    ...SHARED_SOCIAL,
  ],
};

/** Stable @id for the Organization every branch and location node hangs off. */
export const ORG_ID = "https://dutycleaners.ca/#org";

/**
 * The trade, for every LocalBusiness node. schema.org has no cleaning-service
 * subtype, so the nodes stay LocalBusiness and name the trade with
 * additionalType, the route schema.org documents for this. Wikidata Q6735317
 * is "maid service: professional service focused on maintaining cleanliness
 * and sanitation of buildings" (looked up 2026-09-18). It goes on every full
 * business record, never on the three pointers in index.html: a pointer carries
 * only @id, @type, name and url, and one extra key makes AuditSpur and Google's
 * tester read it as an incomplete business on all 210 pages (measured 2026-09-18).
 */
export const BUSINESS_TRADE_TYPE = "https://www.wikidata.org/wiki/Q6735317";

/** Stable @id per branch, so 166 location nodes stop being anonymous businesses. */
export const BRANCH_ID = {
  edmonton: "https://dutycleaners.ca/#edmonton",
  calgary: "https://dutycleaners.ca/#calgary",
  reddeer: "https://dutycleaners.ca/#reddeer",
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
  // The Red Deer page is the branch's only page, so it is the entity's url. The
  // name is the Google Business Profile's own, character for character.
  reddeer: {
    url: "https://dutycleaners.ca/cleaning-services-red-deer/",
    name: "Duty Cleaners House Cleaning Services Red Deer",
  },
} as const;

/**
 * The branch office's pin as a schema.org GeoCoordinates node, for the
 * LocalBusiness that carries the branch @id.
 *
 * On a business node `geo` means "where this business IS", so the only pin a
 * branch node may carry is the one that matches the address beside it: the
 * Google listing's, confirmed by the owner (CITY_PROOF[branch].geo). The pin of
 * a neighbourhood the branch SERVES belongs on areaServed, never here — a
 * business at 18615 71 Ave NW with a pin 30 km away in Leduc contradicts
 * itself, and one address with 153 different pins is the shape of a
 * location-page scheme. location-geo.test.ts holds both halves of that line.
 *
 * Built field by field rather than spread, so the confirm() brand never rides
 * into the JSON and the node is exactly the three keys the hubs publish.
 */
export function branchGeoFor(branch: Branch) {
  const pin = CITY_PROOF[branch].geo;
  return { "@type": "GeoCoordinates", latitude: pin.latitude, longitude: pin.longitude } as const;
}

/** The Red Deer page's canonical path: the preserved legacy URL. */
export const RED_DEER_PATH = "/cleaning-services-red-deer/";


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
 * wrong date is worse than no markup. `baseSalary` is deliberately absent:
 * cleaners are independent contractors paid per job, and the owner chose on
 * 2026-09-11 not to publish a pay range.
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
export const schemaAddressFor = (city: Branch) => {
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
