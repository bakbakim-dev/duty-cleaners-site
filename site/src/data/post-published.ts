/**
 * Publication dates for blog posts — hand-maintained, unlike `post-dates.ts`,
 * which is generated from git and holds `dateModified`.
 *
 * WHY THIS FILE EXISTS. Four posts kept their WordPress URLs when the site was
 * rebuilt, and their Article schema declared `datePublished` in January 2026.
 * They were live well before that: the mirrored copies reference
 * `wp-content/uploads/2024/08` and `2025/02`, so the posts existed by August
 * 2024 at the latest. Age is an asset on those URLs and a January 2026
 * birthdate throws it away — and worse, states something the site knows to be
 * untrue.
 *
 * The mirror does not carry the real dates (its only `datePublished` values are
 * relative strings from an embedded review widget), so they cannot be recovered
 * from anything in this repository. Until the owner reads them out of the
 * WordPress admin, these four are `null` and the schema simply omits the field.
 *
 * That follows the rule proof.ts already applies to the job posting: "Google
 * demotes and eventually drops postings with stale or missing dates — a wrong
 * date is worse than no markup." An omitted date costs a minor signal. A false
 * one is a false statement in structured data.
 *
 * TO FIX: open each post in the WordPress admin, read its publish date, and put
 * it here as `YYYY-MM-DD`. Nothing else needs to change.
 */
import { modifiedFor } from "./post-dates";

export const POST_PUBLISHED: Readonly<Record<string, string | null>> = {
  // Preserved WordPress URLs — real dates unknown, see above.
  "/how-much-does-a-house-cleaning-cost": null,
  "/how-often-should-a-cleaning-service-clean-my-house": null,
  "/cleaning-with-vinegar-and-baking-soda": null,
  "/the-top-5-must-have-cleaning-products-for-a-spotless-home": null,

  // Written for this site, so these dates are known and correct.
  "/blog/choosing-cleaning-company": "2026-01-27",
  "/blog/cleaning-schedule": "2026-01-20",
  "/blog/cleaning-services-calgary": "2026-08-24",
  "/blog/spotless-home-tips": "2026-08-24",
};

/**
 * The publication date for a post, or null when it is not known.
 *
 * Callers must omit `datePublished` from Article schema when this returns null
 * rather than substituting a fallback — the whole point is not to assert a date
 * nobody has checked.
 */
export function publishedFor(path: string): string | null {
  const clean = path.replace(/\/+$/, "") || "/";
  return POST_PUBLISHED[clean] ?? null;
}

/**
 * `dateModified` for a post, without needing a publication date to fall back on.
 *
 * `modifiedFor` takes a fallback because a post missing from the generated map
 * would otherwise render `undefined` into JSON-LD. Every post is in that map —
 * it is generated from git for all of them — so the fallback never fires here;
 * this wrapper exists so a page with no known publication date does not have to
 * invent one just to satisfy the signature.
 */
export function modifiedOr(path: string): string {
  return modifiedFor(path, POST_PUBLISHED[path.replace(/\/+$/, "") || "/"] ?? "");
}
