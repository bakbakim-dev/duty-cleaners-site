/**
 * Where the home is, for the quote funnel: which branch office serves it and
 * whether it lies outside that city's limits (owner, 2026-09-22).
 *
 * WHY THE FUNNEL ASKS
 * The travel fee is a BookingKoala extra the customer used to tick by hand, so
 * a nearby-town visitor saw a price without it and met the fee, or skipped it,
 * at checkout. And the funnel said "in Edmonton" to every homepage visitor,
 * tagged their lead `edmonton` in GoHighLevel and showed Edmonton's hours to
 * Calgary and Red Deer customers alike.
 *
 * TWO QUESTIONS, ASKED WHERE THEY COST LEAST (owner, 2026-09-22, "lighter version")
 * - The branch. Most pages already name it (a city hub, a service page, a town
 *   or neighbourhood page), so step 1 asks only on pages that belong to no
 *   branch: the homepage, the FAQ, the blog and the other company pages.
 * - Inside or outside city limits, a required yes/no on the price step beside
 *   the pets question, because it changes the price. A satellite-town page
 *   (Leduc, Airdrie...) answers "outside" and a neighbourhood page "inside" in
 *   advance; the visitor can still change it. It is never an opt-in add-on: a
 *   mandatory fee has to be in the price shown (Competition Act, drip pricing).
 *
 * The booking page repeats the inside/outside check from the postal code the
 * customer types (bk-travel-fee.js, same rules as booking-redirect.ts), so a
 * wrong answer here is corrected there, with a note saying why.
 */

import {
  calgaryMergedRoutes,
  calgaryNeighborhoods,
  calgarySurrounding,
  edmontonNeighborhoods,
  edmontonSurrounding,
  type CityLocation,
} from "@/data/city-locations";
import { explicitBranchFromPath, type Branch } from "@/lib/city-from-path";

export interface ServiceArea {
  branch: Branch;
  /** Outside the branch city's limits (the travel fee applies); null until answered. */
  outside: boolean | null;
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

/** The full answer a location page settles, or null. */
export function areaPresetFor(pathname: string): ServiceArea | null {
  const path = (pathname || "/").toLowerCase();
  // Location pages only: a slug match elsewhere would be a coincidence.
  if (!/^\/(?:locations\/|cleaning-services-)/.test(path)) return null;
  return PRESET_BY_SLUG.get(slugOf(pathname || "/")) ?? null;
}

/**
 * What the funnel starts from on this page: a location page's full answer,
 * else the page's own branch with the city-limits question still open, else
 * nothing (a page that belongs to no branch asks for it on step 1).
 */
export function initialAreaFor(pathname: string): ServiceArea | null {
  const preset = areaPresetFor(pathname);
  if (preset) return preset;
  // The homepage is Edmonton's page by title, but it is the front door for all
  // three branches (brand searches land there), so the funnel asks.
  if ((pathname || "/").replace(/\/+$/, "") === "") return null;
  const branch = explicitBranchFromPath(pathname);
  return branch ? { branch, outside: null } : null;
}

/** Step 1 asks for the branch only where the page names none. */
export const asksBranch = (pathname: string) => initialAreaFor(pathname) === null;

/** The branch answers, for pages that name none. */
export const BRANCH_OPTIONS: { branch: Branch; label: string }[] = [
  { branch: "edmonton", label: "Edmonton area" },
  { branch: "calgary", label: "Calgary area" },
  { branch: "reddeer", label: "Red Deer area" },
];

/** "in Leduc", "near Edmonton", "in Calgary", or "in the Calgary area" until answered. */
export function areaPhrase(area: ServiceArea): string {
  if (area.place && area.outside !== null) return `in ${area.place}`;
  if (area.outside === null) return `in the ${BRANCH_CITY[area.branch]} area`;
  return `${area.outside ? "near" : "in"} ${BRANCH_CITY[area.branch]}`;
}
