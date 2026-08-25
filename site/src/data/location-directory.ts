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

export type LocationCity = "edmonton" | "calgary";

/** "St. Albert" / "st-albert" / "St Albert" all collapse to the same key. */
const normalize = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

function index(list: CityLocation[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const loc of list) {
    const key = normalize(loc.name);
    if (!m.has(key)) m.set(key, loc.to);
  }
  return m;
}

const BY_CITY: Record<LocationCity, Map<string, string>> = {
  edmonton: index([...edmontonSurrounding, ...edmontonNeighborhoods]),
  calgary: index([...calgarySurrounding, ...calgaryNeighborhoods]),
};

/** Union, Edmonton first — only used when no city context is available. */
const ANY_CITY = index([
  ...edmontonSurrounding,
  ...edmontonNeighborhoods,
  ...calgarySurrounding,
  ...calgaryNeighborhoods,
]);

/**
 * Resolve a display name to its location route, or null when no page exists.
 *
 * `city` scopes the lookup, and that matters more than it looks: several place
 * names exist in both markets. Without scoping, a "Downtown", "Inglewood" or
 * "Westmount" chip on a Calgary page resolved against the Edmonton half of the
 * list and linked the visitor — and Google — to the wrong city. That was
 * happening on twelve links across ten Calgary pages.
 *
 * When a city is given and the name has no page IN THAT CITY, this returns null
 * rather than falling back across the border. An unlinked chip is correct;
 * pointing Calgary's Montrose at Edmonton's Montrose is not.
 */
export function locationRouteForName(
  name: string,
  city?: LocationCity,
): string | null {
  const key = normalize(name);
  if (city) return BY_CITY[city].get(key) ?? null;
  return ANY_CITY.get(key) ?? null;
}

/** Total number of linkable locations — used by tests to catch silent regressions. */
export const LINKABLE_LOCATION_COUNT = ANY_CITY.size;
