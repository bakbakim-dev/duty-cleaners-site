/**
 * Single source of truth for "which city is this URL about?".
 *
 * WHY THIS EXISTS
 * Five components independently used `pathname.startsWith("/calgary")` to pick
 * the city. That test is wrong for every *canonical* Calgary URL, because the
 * canonical form of the Calgary pages is the preserved legacy URL, not the
 * modern one:
 *
 *   /calgary                        -> 301 -> /cleaning-services-calgary/   <- canonical
 *   /calgary/commercial-cleaning    -> 301 -> /commercial-cleaning-services-calgary/
 *   /calgary/move-in-move-out-...   -> 301 -> /move-out-cleaning-calgary/
 *
 * `"/cleaning-services-calgary".startsWith("/calgary")` is false, so on the
 * site's single highest-traffic Calgary page (468k impressions over 16 months)
 * the footer rendered the *Edmonton* phone number, and the quote flow loaded
 * Edmonton's address and phone. See src/data/legacy-urls.ts for the canonical
 * policy this has to agree with.
 *
 * The rule below matches on the whole path rather than a prefix, so it is
 * correct for every Calgary URL shape the router actually serves:
 *   - /calgary and /calgary/*
 *   - /cleaning-services-calgary, /move-out-cleaning-calgary,
 *     /commercial-cleaning-services-calgary, /wall-washing-wall-cleaning-calgary,
 *     /airbnb-cleaning-services-calgary, /post-construction-cleaning-calgary, …
 *   - /locations/<neighbourhood>-calgary (66 Calgary neighbourhood pages)
 *   - the Calgary-region satellite towns, which contain no "calgary" token
 */

import {
  calgarySurrounding,
  calgaryNeighborhoods,
  calgaryMergedRoutes,
} from "@/data/city-locations";

export type City = "edmonton" | "calgary";

/**
 * Every Calgary path whose URL carries no "calgary" token.
 *
 * This used to be a hand-maintained list of the ten satellite towns, and it
 * silently omitted the Calgary NEIGHBOURHOODS whose slugs are bare — Tuscany,
 * Mahogany, Cranston, Auburn Bay, Marda Loop, Mission, Kensington and eight
 * more. Those fifteen pages fell through to `return "edmonton"`, so a Calgary
 * visitor got the Edmonton phone number in the footer CTA, eight links to
 * Edmonton service pages, and the Edmonton number in the quote overlay — on
 * pages whose own H1 and schema said Calgary.
 *
 * Deriving the set from city-locations.ts instead means the directory that
 * renders the links and the resolver that picks the city can no longer
 * disagree: adding a Calgary neighbourhood there now routes it correctly here
 * with no second edit. Entries are stored as bare slugs so both URL forms
 * (/locations/<slug> and /cleaning-services-<slug>) resolve.
 *
 * `calgaryMergedRoutes` is folded in for the same reason. A page can leave the
 * coverage list without leaving the site — /locations/turner-valley/ is half of
 * the amalgamated Town of Diamond Valley and still serves at its own URL — and
 * a served Calgary page that this resolver does not recognise renders the
 * Edmonton phone number under Calgary schema.
 */
const CALGARY_SLUGS: ReadonlySet<string> = new Set(
  [...calgarySurrounding, ...calgaryNeighborhoods, ...calgaryMergedRoutes].map((entry) =>
    entry.to.replace(/^\/(?:locations|cleaning-services)[/-]?/, "").replace(/\/+$/, ""),
  ),
);

/**
 * Blog posts are editorial, not a city landing page. `/blog/cleaning-services-calgary`
 * is *about* Calgary but should not flip the whole chrome to Calgary, so blog
 * paths are excluded deliberately.
 */
export function cityFromPath(pathname: string): City {
  const path = (pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";

  if (path.startsWith("/blog")) return "edmonton";

  if (path === "/calgary" || path.startsWith("/calgary/")) return "calgary";

  // Any service or location URL carrying the "calgary" token, in any position:
  // /cleaning-services-calgary, /move-out-cleaning-calgary, /locations/varsity-calgary…
  if (/(^|[/-])calgary($|[/-])/.test(path)) return "calgary";

  // Calgary neighbourhoods and satellite towns, on either URL form.
  const slug = path.replace(/^\/(locations|cleaning-services)[/-]?/, "");
  if (CALGARY_SLUGS.has(slug)) return "calgary";

  return "edmonton";
}

export const isCalgaryPath = (pathname: string) => cityFromPath(pathname) === "calgary";

/**
 * Pages that belong to no branch: the company pages, the help pages, the blog
 * and the legal pages. Their header shows every office until the visitor has
 * been to a city page (branch-preference.ts). Every other page belongs to a
 * branch: Calgary or Red Deer by the rules in this file, otherwise Edmonton,
 * because the Edmonton hub, price list and service pages are the site's
 * default family and `cityFromPath` has always said so.
 */
export const NEUTRAL_PATHS: ReadonlySet<string> = new Set([
  "/about-us",
  "/faqs",
  "/faq",
  "/reviews",
  "/contact-us",
  "/contact",
  "/locations",
  "/whats-included",
  "/prepare",
  "/gift-card",
  "/gift-cards",
  "/join-the-team",
  "/satisfaction-guarantee",
  "/insurance-liability",
  "/privacy-policy",
  "/terms",
  "/book",
  "/how-much-does-a-house-cleaning-cost",
  "/how-often-should-a-cleaning-service-clean-my-house",
  "/cleaning-with-vinegar-and-baking-soda",
  "/the-top-5-must-have-cleaning-products-for-a-spotless-home",
]);

/**
 * The branch a URL belongs to, or null for a page that belongs to none.
 * Unlike `branchFromPath`, which must always answer (the quote flow needs an
 * office), this one is allowed to say "no branch", and the chrome uses that
 * to show every office instead of defaulting to one.
 */
export function explicitBranchFromPath(pathname: string): Branch | null {
  const path = (pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
  if (path.startsWith("/blog") || NEUTRAL_PATHS.has(path)) return null;
  return branchFromPath(pathname);
}

/**
 * The three branches. Red Deer is a branch with its own office, phone, hours
 * and Google listing (owner, 2026-09-11), but it has ONE page and no service,
 * pricing or neighbourhood pages of its own. So `City` stays the two cities
 * that own a hub, a price list and a set of service pages, and `Branch` adds
 * Red Deer for the things that follow the office rather than the page family:
 * the phone number, the address, the hours and the schema entity.
 */
export type Branch = City | "reddeer";

/** Every URL that serves the Red Deer page: the canonical one and its modern route. */
const RED_DEER_PATHS: ReadonlySet<string> = new Set([
  "/cleaning-services-red-deer",
  "/locations/red-deer",
]);

/**
 * Which branch office a URL belongs to. The Red Deer page is the only Red Deer
 * URL; everything else resolves exactly as `cityFromPath` does, so the
 * Edmonton and Calgary behaviour is unchanged.
 */
export function branchFromPath(pathname: string): Branch {
  const path = (pathname || "/").toLowerCase().replace(/\/+$/, "") || "/";
  if (RED_DEER_PATHS.has(path)) return "reddeer";
  return cityFromPath(pathname);
}
