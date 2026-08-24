/**
 * Name -> route lookup for every location page on the site.
 *
 * Built from the curated coverage lists in city-locations.ts so there is exactly
 * one place a location's canonical route is written down. Used by
 * <CoverageChips> to decide whether a "nearby area" chip is a real page worth
 * linking to, or just a landmark/street that should stay plain text.
 */

import {
  edmontonSurrounding,
  edmontonNeighborhoods,
  calgarySurrounding,
  calgaryNeighborhoods,
  type CityLocation,
} from "@/data/city-locations";

const ALL: CityLocation[] = [
  ...edmontonSurrounding,
  ...edmontonNeighborhoods,
  ...calgarySurrounding,
  ...calgaryNeighborhoods,
];

/** "St. Albert" / "st-albert" / "St Albert" all collapse to the same key. */
const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

const ROUTE_BY_NAME = new Map<string, string>();
for (const loc of ALL) {
  const key = normalize(loc.name);
  // First definition wins: the curated lists are ordered most-canonical first.
  if (!ROUTE_BY_NAME.has(key)) ROUTE_BY_NAME.set(key, loc.to);
}

/**
 * Resolve a display name to its location route, or null when no page exists.
 * Returning null (rather than guessing a URL) is what keeps chips for
 * landmarks and streets from becoming 404 links.
 */
export function locationRouteForName(name: string): string | null {
  return ROUTE_BY_NAME.get(normalize(name)) ?? null;
}

/** Total number of linkable locations — used by tests to catch silent regressions. */
export const LINKABLE_LOCATION_COUNT = ROUTE_BY_NAME.size;
