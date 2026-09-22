/**
 * Where the home is, for the quote funnel: which branch office serves it and
 * whether it lies outside that city's limits (owner, 2026-09-22).
 *
 * WHY THE FUNNEL ASKS
 * The travel fee is a BookingKoala extra the customer used to tick by hand, so
 * a nearby-town visitor saw a price without it and met the fee, or skipped it,
 * at checkout. And the funnel said "in Edmonton" to every homepage visitor,
 * tagged their lead `edmonton` in GoHighLevel and showed Edmonton's hours to
 * Calgary and Red Deer customers alike. One tap answers both: the branch, and
 * whether the price carries the travel fee.
 *
 * A page that already knows the answer presets it, shown as a chip the
 * visitor can change: a satellite-town page (Leduc, Airdrie...) is outside its
 * city, and a neighbourhood page is inside it. City hubs, service pages and
 * the homepage cannot know, because people from St. Albert land on the
 * Edmonton hub too, so there the question is asked.
 *
 * The booking page repeats the check from the postal code the customer types
 * (bk-prefill-v2.js, same rules as booking-redirect.ts), so a wrong tap here
 * is corrected there, with a note saying why.
 */

import {
  calgaryMergedRoutes,
  calgaryNeighborhoods,
  calgarySurrounding,
  edmontonNeighborhoods,
  edmontonSurrounding,
  type CityLocation,
} from "@/data/city-locations";
import { branchFromPath, explicitBranchFromPath, type Branch } from "@/lib/city-from-path";

export interface ServiceArea {
  branch: Branch;
  /** Outside the branch city's limits: the travel fee applies. */
  outside: boolean;
  /** The town or neighbourhood, when the page named it. */
  place?: string;
}

export const BRANCH_CITY: Record<Branch, string> = {
  edmonton: "Edmonton",
  calgary: "Calgary",
  reddeer: "Red Deer",
};

const slugOf = (to: string) =>
  to.replace(/^\/(?:locations|cleaning-services)[/-]?/, "").replace(/\/+$/, "").toLowerCase();

const pathSlug = (pathname: string) => slugOf(pathname || "/");

function presets(list: CityLocation[], branch: Branch, outside: boolean): [string, ServiceArea][] {
  return list.map((entry) => [slugOf(entry.to), { branch, outside, place: entry.name }]);
}

/**
 * Pages that settle the answer. Turner Valley is half of Diamond Valley
 * (calgaryMergedRoutes), and every label names Diamond Valley.
 */
const PRESET_BY_SLUG: ReadonlyMap<string, ServiceArea> = new Map([
  ...presets(edmontonSurrounding, "edmonton", true),
  ...presets(calgarySurrounding, "calgary", true),
  ...presets(calgaryMergedRoutes, "calgary", true).map(
    ([slug, area]): [string, ServiceArea] => [slug, { ...area, place: "Diamond Valley" }],
  ),
  ...presets(edmontonNeighborhoods, "edmonton", false),
  ...presets(calgaryNeighborhoods, "calgary", false),
]);

/** The answer a page settles, or null when the funnel must ask. */
export function areaPresetFor(pathname: string): ServiceArea | null {
  const path = (pathname || "/").toLowerCase();
  // Location pages only: a slug match elsewhere would be a coincidence.
  if (!/^\/(?:locations\/|cleaning-services-)/.test(path)) return null;
  return PRESET_BY_SLUG.get(pathSlug(pathname)) ?? null;
}

export interface AreaOption {
  branch: Branch;
  outside: boolean;
  label: string;
}

/**
 * The six answers, two per branch: the city, then its nearby towns. The
 * page's own branch comes first, so an Edmonton-page visitor reads their
 * city at the top.
 */
export function areaOptionsFor(pathname: string): AreaOption[] {
  const first = explicitBranchFromPath(pathname);
  const order: Branch[] = ["edmonton", "calgary", "reddeer"];
  const sorted = first ? [first, ...order.filter((branch) => branch !== first)] : order;
  return sorted.flatMap((branch) => [
    { branch, outside: false, label: BRANCH_CITY[branch] },
    { branch, outside: true, label: `Near ${BRANCH_CITY[branch]}` },
  ]);
}

/** "in Leduc", "near Edmonton", "in Calgary". */
export function areaPhrase(area: ServiceArea): string {
  if (area.place) return `in ${area.place}`;
  return `${area.outside ? "near" : "in"} ${BRANCH_CITY[area.branch]}`;
}

/** The branch the funnel uses before the visitor has answered. */
export const fallbackBranch = (pathname: string): Branch => branchFromPath(pathname);
