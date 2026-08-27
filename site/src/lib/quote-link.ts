import { canonicalForPath } from "@/data/legacy-urls";
import { cityFromPath } from "@/lib/city-from-path";

/**
 * City-aware link to the quote section.
 *
 * Five components linked a bare `#quote` on the CURRENT page, but only the two
 * city home pages (and one move-out page) actually render an `id="quote"`
 * section — so on 172 of 209 built pages the primary CTA pointed at a fragment
 * that exists nowhere on the page. This sends the visitor to their city's home
 * page quote section instead, the same canonical-aware way the footer already
 * does it.
 */
export function quoteHrefFor(pathname: string): string {
  return `${cityFromPath(pathname) === "calgary" ? canonicalForPath("/calgary") : "/"}#quote`;
}
