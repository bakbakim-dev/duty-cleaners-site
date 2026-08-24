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

export type City = "edmonton" | "calgary";

/**
 * Calgary-region towns whose slugs never contain "calgary".
 * Mirrors `calgarySurrounding` in src/data/city-locations.ts.
 */
const CALGARY_REGION_SLUGS = [
  "airdrie",
  "okotoks",
  "cochrane",
  "chestermere",
  "black-diamond",
  "crossfield",
  "high-river",
  "langdon",
  "strathmore",
  "turner-valley",
] as const;

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

  // Calgary-region satellite towns, on either URL form.
  const slug = path.replace(/^\/(locations|cleaning-services)[/-]?/, "");
  if (CALGARY_REGION_SLUGS.some((t) => slug === t || path.endsWith(`/${t}`) || path.endsWith(`-${t}`))) {
    return "calgary";
  }

  return "edmonton";
}

export const isCalgaryPath = (pathname: string) => cityFromPath(pathname) === "calgary";
