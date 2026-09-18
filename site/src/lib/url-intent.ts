/**
 * Intent that rides on a link — which contact topic, which city, which
 * service, deep-clean or not — travels in the URL FRAGMENT, not the query
 * string.
 *
 * It used to be `?topic=office&city=calgary` and `/?intent=deep#quote`. Every
 * one of those is a distinct URL to a crawler: a Screaming Frog pass on
 * 2026-09-17 listed 14 of them, each with a duplicate title, a duplicate
 * description and a canonical pointing back at the clean page. Canonicals do
 * fold them, but a crawler still fetches them, and every audit that counts
 * duplicates counts them first. A fragment is never sent to the server and is
 * never a separate page, so `/contact-us/#topic=office&city=calgary` is
 * `/contact-us/` to every crawler and the intent to the app.
 *
 * Shape: `#` + an optional anchor id + `key=value` pairs, all joined by `&`:
 *
 *   /contact-us/#topic=office&city=calgary
 *   /#quote&intent=deep
 *   /cleaning-services-calgary/#quote&service=deep-cleaning&intent=deep
 *
 * The anchor is the first token without an `=`. Readers merge the query
 * string too, because links the site does not control still use it: the
 * campaign `?promo=CODE`, ad `?service=` deep links, and any old
 * `/contact-us/?topic=airbnb` copied somewhere. The fragment wins on a clash.
 */

/** The anchor id in a fragment, or "" when the fragment carries only pairs. */
export function hashAnchor(hash: string): string {
  const body = hash.startsWith("#") ? hash.slice(1) : hash;
  return body.split("&").find((token) => token && !token.includes("=")) ?? "";
}

/** Query-string pairs, then fragment pairs on top. Either input may be "". */
export function intentParams(search: string, hash: string): URLSearchParams {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const body = hash.startsWith("#") ? hash.slice(1) : hash;
  for (const token of body.split("&")) {
    const eq = token.indexOf("=");
    if (eq <= 0) continue;
    try {
      params.set(decodeURIComponent(token.slice(0, eq)), decodeURIComponent(token.slice(eq + 1)));
    } catch {
      // A malformed escape in someone's hand-typed fragment is not our problem.
    }
  }
  return params;
}

/**
 * The merged intent as a query string ("" or "?k=v&…"), for code that keys on
 * "the page address with its intent" — the quote flow remembers where a
 * service was chosen as `pathname + intentQuery`.
 */
export function intentQuery(search: string, hash: string): string {
  const qs = intentParams(search, hash).toString();
  return qs ? `?${qs}` : "";
}

/**
 * Build a link that carries intent in its fragment. Empty, null and undefined
 * values are dropped; with nothing to carry and no anchor, the path is
 * returned untouched.
 */
export function intentHref(
  path: string,
  params: Record<string, string | number | null | undefined>,
  anchor?: string,
): string {
  const tokens = anchor ? [anchor] : [];
  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") continue;
    tokens.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }
  return tokens.length ? `${path}#${tokens.join("&")}` : path;
}
