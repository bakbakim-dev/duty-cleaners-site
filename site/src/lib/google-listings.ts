import type { MouseEvent } from "react";

/**
 * Canonical Google Business Profile listings.
 *
 * These are the only citation targets we control that a reader can follow to
 * the source. Generic `/maps/search/...` URLs are NOT permalinks — they resolve
 * to whatever Google's search box returns that day — so never link review proof
 * at a search query. Always link one of the values below.
 *
 * Each `cid` is the numeric Google Maps customer ID, decoded from the listing's
 * share link (`0x<feature>:0x<cid-hex>` in the resolved /maps/place data blob).
 * `https://www.google.com/maps?cid=<cid>` is a stable, indefinitely storable
 * permalink to that exact profile.
 *
 * Note: we deliberately do NOT emit Review/AggregateRating JSON-LD from these —
 * self-serving review markup is rich-result ineligible.
 */

export type CityKey = "edmonton" | "calgary";

export interface GoogleListing {
  /** Business name exactly as it appears on the profile. */
  name: string;
  /** Numeric Google Maps CID for the profile. */
  cid: string;
  /** Permalink to the profile itself. */
  url: string;
  /** Permalink used when citing review content. */
  reviewsUrl: string;
}

const listing = (name: string, cid: string): GoogleListing => ({
  name,
  cid,
  url: `https://www.google.com/maps?cid=${cid}`,
  // Same permalink: the profile page shows its reviews. Do NOT append an
  // `#lrd=` fragment unless it carries Google's real hex feature ID — an
  // empty one (`#lrd=,1,,,`) is junk that shows up in the address bar.
  reviewsUrl: `https://www.google.com/maps?cid=${cid}`,
});


export const GOOGLE_LISTINGS: Record<CityKey, GoogleListing> = {
  edmonton: listing(
    "Duty Cleaners House Cleaning Services Edmonton",
    "8192121191672692049",
  ),
  calgary: listing(
    "Duty Cleaners House Cleaning Services Calgary",
    "6193344199307583189",
  ),
};

/** Resolve a listing from a free-text city label such as "Calgary". */
export function getListing(city: string): GoogleListing {
  return city.trim().toLowerCase().startsWith("calgary")
    ? GOOGLE_LISTINGS.calgary
    : GOOGLE_LISTINGS.edmonton;
}

/**
 * Citation target for a single quoted review.
 *
 * DIRECT: if we hold a working per-review share link, that is the strongest
 * citation and wins. Otherwise fall back to the listing permalink, which still
 * lands the reader on the source rather than on a search box.
 */
export function reviewSourceUrl(city: string, sourceUrl?: string): string {
  return sourceUrl?.trim() || getListing(city).reviewsUrl;
}

/**
 * Open Google outside embedded site previews instead of allowing the preview
 * frame to try to render a destination that Google forbids in iframes.
 * Modified clicks keep their native browser behavior.
 */
export function openGoogleListing(
  event: MouseEvent<HTMLAnchorElement>,
  url: string,
): void {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }

  event.preventDefault();
  window.open(url, "_blank", "noopener,noreferrer");
}
