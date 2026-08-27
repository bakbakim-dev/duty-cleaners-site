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

import { calgarySurrounding, calgaryNeighborhoods } from "@/data/city-locations";

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
 */
const CALGARY_SLUGS: ReadonlySet<string> = new Set(
  [...calgarySurrounding, ...calgaryNeighborhoods].map((entry) =>
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
