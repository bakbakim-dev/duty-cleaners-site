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
 * ONE QUESTION, ON THE PRICE STEP (owner, 2026-09-22)
 * - The branch comes from the page. Step 1 asked it on the homepage and the
 *   branch-less pages until the owner dropped that question: its answer only
 *   became a GoHighLevel tag no workflow reads. Those pages are "general": the
 *   funnel names no city and the office shown is the page's default.
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
import { branchFromPath, explicitBranchFromPath, type Branch } from "@/lib/city-from-path";

export interface ServiceArea {
  branch: Branch;
  /** Outside the branch city's limits (the travel fee applies); null until answered. */
  outside: boolean | null;
  /** The town or neighbourhood, when the page named it. */
  place?: string;
  /**
   * A page that names no branch (the homepage, FAQ, blog...): the city-limits
   * question asks about Edmonton or Calgary (Red Deer left out for now, owner
   * 2026-09-22) and no branch is claimed for the lead.
   */
  general?: boolean;
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
 * (the homepage and branch-less pages) a general answer that names no city.
 */
export function initialAreaFor(pathname: string): ServiceArea {
  const preset = areaPresetFor(pathname);
  if (preset) return preset;
  // The homepage is Edmonton's page by title, but it is the front door for
  // every branch (brand searches land there), so it names no city.
  const isHome = (pathname || "/").replace(/\/+$/, "") === "";
  const branch = isHome ? null : explicitBranchFromPath(pathname);
  return branch ? { branch, outside: null } : { branch: branchFromPath(pathname), outside: null, general: true };
}

/** The city (or cities) the city-limits question and the fee note name. */
export function limitsCity(area: ServiceArea, joiner: "or" | "and"): string {
  return area.general ? `Edmonton ${joiner} Calgary` : BRANCH_CITY[area.branch];
}

/**
 * "in Leduc", "near Edmonton", "in Calgary", "in the Calgary area" until
 * answered; on a general page "inside city limits" / "outside city limits",
 * or nothing until answered.
 */
export function areaPhrase(area: ServiceArea): string {
  if (area.general) return area.outside === null ? "" : area.outside ? "outside city limits" : "inside city limits";
  if (area.place && area.outside !== null) return `in ${area.place}`;
  if (area.outside === null) return `in the ${BRANCH_CITY[area.branch]} area`;
  return `${area.outside ? "near" : "in"} ${BRANCH_CITY[area.branch]}`;
}
