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
    // Read from the live Google Reviews widget embedded on the legacy site's
    // /reviews/ page (dutycleaners.ca), captured 2026-08-24. Reconfirm before
    // launch in case the count has moved since.
    googleRating: 4.9,
    googleReviewCount: 224,
  },
  calgary: {
    city: "Calgary",
    phone: "(403) 768-1341",
    phoneLink: "tel:4037681341",
    address: "2835 37 Street SW #24, Calgary, AB",
    googleRating: null, // TODO-OWNER
    googleReviewCount: null, // TODO-OWNER
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

export const RATING_CLAIM = "Five-Star Rated";

export const cityProofFor = (pathname: string) =>
  // Canonical-aware. A bare startsWith("/calgary") missed every preserved
  // legacy Calgary URL (/cleaning-services-calgary/ chief among them), so the
  // quote flow showed Edmonton's phone and address on Calgary's biggest page.
  cityFromPath(pathname) === "calgary" ? CITY_PROOF.calgary : CITY_PROOF.edmonton;

/** Company-wide facts. Operating since 2017 — never "10+ years". */
export const COMPANY = {
  foundedYear: 2017,
  sinceLabel: "since 2017",
  /** Applicant acceptance rate — already published on the site. */
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
  { id: "reschedule", label: "Free reschedule or cancel up to 24 hours before", enabled: true },
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
 * How fast we promise to come back after a booking request.
 * TODO-OWNER: confirm the real promise before launch.
 */
export const RESPONSE_TIME_PROMISE = "1 hour during business hours";

/** BookingKoala scheduling handoff — v2 only. TODO-OWNER: confirm the URL. */
export const BOOKING_KOALA_URL: string | null = null;

