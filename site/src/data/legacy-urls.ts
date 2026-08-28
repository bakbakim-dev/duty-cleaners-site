/**
 * Legacy URL preservation map — derived from 16 months of Search Console data
 * (May 2025 – Aug 2026), see SEO-AUDIT-2026.md.
 *
 * The old WordPress site earns ~2.9M impressions/yr on URLs whose slugs do not
 * exist in this rebuild. Google states 301s do not lose PageRank, but every
 * changed URL still forces a re-evaluation — so the highest-earning URLs are
 * PRESERVED (served at their original path, and canonical there) rather than
 * redirected. Everything else 301s.
 *
 *   mode: "preserve" — render `target`'s component AT `legacy`; canonical = legacy
 *   mode: "redirect" — 301 `legacy` -> `target`
 *
 * Generated once from GSC; edit by hand thereafter.
 */
export interface LegacyUrl {
  /** Path on the old site, no trailing slash. */
  legacy: string;
  /** Modern route whose content answers it (preserve), or the 301 destination. */
  target: string;
  mode: "preserve" | "redirect";
  /** Impressions over the 16-month window — why this entry exists. */
  impressions: number;
}

export const LEGACY_URLS: LegacyUrl[] = [
  { legacy: "/cleaning-services-calgary", target: "/calgary", mode: "preserve", impressions: 468459 },
  { legacy: "/move-out-cleaning-edmonton", target: "/edmonton/move-in-move-out-cleaning", mode: "preserve", impressions: 251178 },
  { legacy: "/commercial-cleaning-services-calgary", target: "/calgary/commercial-cleaning", mode: "preserve", impressions: 136659 },
  { legacy: "/move-out-cleaning-calgary", target: "/calgary/move-in-move-out-cleaning", mode: "preserve", impressions: 116317 },
  { legacy: "/post-construction-cleaning", target: "/edmonton/post-construction-cleaning", mode: "preserve", impressions: 101701 },
  { legacy: "/8038/how-much-does-a-house-cleaning-cost", target: "/how-much-does-a-house-cleaning-cost", mode: "redirect", impressions: 89115 },
  { legacy: "/services", target: "/edmonton/services", mode: "preserve", impressions: 78958 },
  { legacy: "/8081/the-top-5-must-have-cleaning-products-for-a-spotless-home", target: "/the-top-5-must-have-cleaning-products-for-a-spotless-home", mode: "redirect", impressions: 73104 },
  { legacy: "/post-construction-cleaning-calgary", target: "/calgary/post-construction-cleaning", mode: "preserve", impressions: 54453 },
  { legacy: "/8060/how-often-should-a-cleaning-service-clean-my-house", target: "/how-often-should-a-cleaning-service-clean-my-house", mode: "redirect", impressions: 44921 },
  { legacy: "/cleaning-services-beaumont", target: "/locations/beaumont", mode: "preserve", impressions: 44138 },
  { legacy: "/contact-us", target: "/contact", mode: "preserve", impressions: 43173 },
  { legacy: "/cleaning-services-morinville", target: "/locations/morinville", mode: "preserve", impressions: 41995 },
  { legacy: "/pricing", target: "/edmonton/pricing", mode: "preserve", impressions: 29379 },
  { legacy: "/services/move-in-move-out-cleaning", target: "/move-out-cleaning-edmonton", mode: "redirect", impressions: 28633 },
  { legacy: "/8088/cleaning-with-vinegar-and-baking-soda", target: "/cleaning-with-vinegar-and-baking-soda", mode: "redirect", impressions: 28619 },
  { legacy: "/cleaning-services-sherwood-park", target: "/locations/sherwood-park", mode: "preserve", impressions: 24577 },
  { legacy: "/cleaning-services-leduc", target: "/locations/leduc", mode: "preserve", impressions: 23690 },
  { legacy: "/cleaning-services-spruce-grove", target: "/locations/spruce-grove", mode: "preserve", impressions: 23508 },
  { legacy: "/airbnb-cleaning-services-calgary", target: "/calgary/airbnb-cleaning", mode: "preserve", impressions: 22924 },
  { legacy: "/cleaning-services-st-albert", target: "/locations/st-albert", mode: "preserve", impressions: 22375 },
  { legacy: "/how-much-does-a-house-cleaning-cost", target: "/blog/house-cleaning-cost", mode: "preserve", impressions: 17782 },
  { legacy: "/cleaning-services-airdrie", target: "/locations/airdrie", mode: "preserve", impressions: 15899 },
  { legacy: "/8102/a-house-cleaning-schedule-that-does-not-overwhelm-you", target: "/blog/cleaning-schedule", mode: "redirect", impressions: 14131 },
  { legacy: "/cleaning-services-devon", target: "/locations/devon", mode: "preserve", impressions: 14092 },
  { legacy: "/faqs", target: "/faq", mode: "preserve", impressions: 12764 },
  { legacy: "/wall-washing-wall-cleaning", target: "/edmonton/wall-washing", mode: "preserve", impressions: 12418 },
  { legacy: "/cleaning-services-fort-saskatchewan", target: "/locations/fort-saskatchewan", mode: "preserve", impressions: 11976 },
  { legacy: "/cleaning-services-cochrane", target: "/locations/cochrane", mode: "preserve", impressions: 11692 },
  { legacy: "/services/commercial-cleaning", target: "/commercial-cleaning", mode: "redirect", impressions: 10200 },
  { legacy: "/services/post-construction-cleaning", target: "/post-construction-cleaning", mode: "redirect", impressions: 9473 },
  /**
   * Retargeted from /book to /pricing.
   *
   * /book is deliberately `noindex, nofollow` — it is step 4 of the funnel, a
   * checkout shell with no nav, and that is the right call for that page. But
   * it meant this redirect handed 9,130 impressions a year of legacy equity to
   * a page that immediately disclaims itself, so Google drops the URL and the
   * equity evaporates rather than transferring.
   *
   * /pricing is the closest indexable match for the intent: someone who
   * searched their way onto the old WordPress booking page wants to know what
   * it costs and then book, and the pricing page answers the first and carries
   * the instant-quote CTA for the second.
   *
   * /checkout below stays pointed at /book — it carries 10 impressions, and
   * checkout is genuinely what it means.
   */
  { legacy: "/booking-page", target: "/pricing", mode: "redirect", impressions: 9130 },
  { legacy: "/wall-washing-wall-cleaning-calgary", target: "/calgary/wall-washing", mode: "preserve", impressions: 7354 },
  { legacy: "/move-in-move-out-cleaning", target: "/move-out-cleaning-edmonton", mode: "redirect", impressions: 5988 },
  { legacy: "/cleaning-services-stony-plain", target: "/locations/stony-plain", mode: "preserve", impressions: 5446 },
  { legacy: "/cleaning-services-windermere", target: "/locations/windermere", mode: "preserve", impressions: 3309 },
  { legacy: "/cleaning-with-vinegar-and-baking-soda", target: "/blog/vinegar-baking-soda", mode: "preserve", impressions: 2718 },
  { legacy: "/cleaning-services-for-fort-saskatchewan-ab", target: "/cleaning-services-fort-saskatchewan", mode: "redirect", impressions: 2467 },
  { legacy: "/1948/house-cleaning-tips-for-a-spotless-home-environment", target: "/blog/spotless-home-tips", mode: "redirect", impressions: 2323 },
  { legacy: "/march-out-cleaning-calgary", target: "/move-out-cleaning-calgary", mode: "redirect", impressions: 2088 },
  { legacy: "/how-to-deep-clean-your-home", target: "/edmonton/deep-cleaning", mode: "redirect", impressions: 1733 },
  { legacy: "/cleaning-services-okotoks", target: "/locations/okotoks", mode: "redirect", impressions: 1500 },
  { legacy: "/cleaning-services-black-diamond", target: "/locations/black-diamond", mode: "redirect", impressions: 1333 },
  { legacy: "/cleaning-services-chestermere", target: "/locations/chestermere", mode: "redirect", impressions: 1240 },
  { legacy: "/10042/cleaning-services-calgary-transform-your-space", target: "/blog/cleaning-services-calgary", mode: "redirect", impressions: 1230 },
  { legacy: "/cleaning-services-downtown-edmonton-ab", target: "/locations/downtown-edmonton", mode: "redirect", impressions: 1114 },
  { legacy: "/cleaning-services-langdon", target: "/locations/langdon", mode: "redirect", impressions: 1088 },
  { legacy: "/airbnb-cleaning-service", target: "/edmonton/airbnb-cleaning", mode: "redirect", impressions: 918 },
  { legacy: "/cleaning-services-strathmore", target: "/locations/strathmore", mode: "redirect", impressions: 855 },
  { legacy: "/march-out-cleaning-edmonton", target: "/edmonton/march-out-cleaning", mode: "redirect", impressions: 806 },
  { legacy: "/cleaning-services-red-deer", target: "/locations", mode: "redirect", impressions: 600 },
  { legacy: "/cleaning-services-glenora-edmonton-ab", target: "/locations/glenora-edmonton", mode: "redirect", impressions: 528 },
  { legacy: "/1848/house-cleaning-hacks-easy-tips-for-busy-lives", target: "/blog", mode: "redirect", impressions: 521 },
  // PRESERVE, matching the cost and vinegar posts above: the numeric WordPress
  // URL 301s to the clean WP slug, and the clean slug is canonical. This entry
  // used to redirect too, so BOTH legacy URLs pointed at /blog/cleaning-frequency —
  // a slug that never existed on WordPress — while /8060/ was earning 264 clicks
  // and 44,921 impressions at position 12.65.
  { legacy: "/how-often-should-a-cleaning-service-clean-my-house", target: "/blog/cleaning-frequency", mode: "preserve", impressions: 509 },
  { legacy: "/services/wall-washing-wall-cleaning", target: "/wall-washing-wall-cleaning", mode: "redirect", impressions: 459 },
  { legacy: "/cleaning-services-riverdale-edmonton-ab", target: "/locations/riverdale-edmonton", mode: "redirect", impressions: 444 },
  { legacy: "/cleaning-services-edmonton", target: "/", mode: "redirect", impressions: 430 },
  { legacy: "/the-top-5-must-have-cleaning-products-for-a-spotless-home", target: "/blog/cleaning-products", mode: "preserve", impressions: 426 },
  { legacy: "/cleaning-services-avonmore-edmonton-ab", target: "/locations/avonmore-edmonton", mode: "redirect", impressions: 415 },
  { legacy: "/cleaning-services-hazeldean-edmonton-ab", target: "/locations/hazeldean", mode: "redirect", impressions: 353 },
  { legacy: "/the-benefits-of-using-leather-conditioner-for-automotive-seats-and-home-furniture", target: "/blog", mode: "redirect", impressions: 291 },
  { legacy: "/9448/cleaning-services-edmonton-you-can-trust", target: "/", mode: "redirect", impressions: 281 },
  { legacy: "/2038/top-benefits-of-professional-cleaning-services-today", target: "/blog", mode: "redirect", impressions: 247 },
  { legacy: "/cleaning-services-turner-valley", target: "/locations/turner-valley", mode: "redirect", impressions: 237 },
  { legacy: "/cleaning-services-crossfield", target: "/locations/crossfield", mode: "redirect", impressions: 221 },
  { legacy: "/cleaning-services-bonnie-doon-edmonton-ab", target: "/locations/bonnie-doon-edmonton", mode: "redirect", impressions: 215 },
  { legacy: "/cleaning-services-abbottsfield-edmonton-ab", target: "/locations/abbottsfield-edmonton", mode: "redirect", impressions: 175 },
  { legacy: "/cleaning-services-canora-edmonton-ab", target: "/locations/canora-edmonton", mode: "redirect", impressions: 173 },
  { legacy: "/how-it-works", target: "/", mode: "redirect", impressions: 150 },
  { legacy: "/cleaning-services-greenfield-edmonton-ab", target: "/locations/greenfield-edmonton", mode: "redirect", impressions: 114 },
  { legacy: "/why-hire-duty-cleaners-for-commercial-cleaning", target: "/commercial-cleaning", mode: "redirect", impressions: 103 },
  { legacy: "/cleaning-services-dovercourt-edmonton-ab", target: "/locations/dovercourt-edmonton", mode: "redirect", impressions: 100 },
  { legacy: "/cleaning-services-evansdale-edmonton-ab", target: "/locations/evansdale-edmonton", mode: "redirect", impressions: 87 },
  { legacy: "/cleaning-services-ambleside-edmonton-ab", target: "/locations/ambleside-edmonton", mode: "redirect", impressions: 84 },
  { legacy: "/cleaning-services-glenwood-edmonton-ab", target: "/locations/glenwood-edmonton", mode: "redirect", impressions: 72 },
  { legacy: "/tag/cleaning-services", target: "/blog", mode: "redirect", impressions: 69 },
  { legacy: "/services-pricing/commercial-cleaning-edmonton", target: "/commercial-cleaning", mode: "redirect", impressions: 68 },
  { legacy: "/cleaning-services-ottewell-edmonton-ab", target: "/locations/ottewell-edmonton", mode: "redirect", impressions: 63 },
  { legacy: "/cleaning-services-inglewood-edmonton-ab", target: "/locations/inglewood", mode: "redirect", impressions: 59 },
  { legacy: "/cleaning-services-mcconachie-edmonton-ab", target: "/locations/mcconachie-edmonton", mode: "redirect", impressions: 53 },
  { legacy: "/cleaning-services-belvedere-edmonton-ab", target: "/locations/belvedere-edmonton", mode: "redirect", impressions: 50 },
  { legacy: "/cleaning-services-boyle-street-edmonton-ab", target: "/locations/boyle-street-edmonton", mode: "redirect", impressions: 49 },
  { legacy: "/cleaning-services-delton-edmonton-ab", target: "/locations/delton", mode: "redirect", impressions: 49 },
  { legacy: "/cleaning-services-aspen-gardens-edmonton-ab", target: "/locations/aspen-gardens-edmonton", mode: "redirect", impressions: 47 },
  { legacy: "/1735/choosing-the-right-cleaning-company-for-your-needs", target: "/blog/choosing-cleaning-company", mode: "redirect", impressions: 42 },
  { legacy: "/cleaning-services-high-river", target: "/locations/high-river", mode: "redirect", impressions: 41 },
  { legacy: "/cleaning-services-allendale-edmonton-ab", target: "/locations/allendale", mode: "redirect", impressions: 38 },
  { legacy: "/cleaning-services-matt-berry-edmonton-ab", target: "/locations/matt-berry-edmonton", mode: "redirect", impressions: 37 },
  { legacy: "/cleaning-services-beacon-heights-edmonton-ab", target: "/locations/beacon-heights-edmonton", mode: "redirect", impressions: 36 },
  { legacy: "/cleaning-services-rapperswill-edmonton-ab", target: "/locations/rapperswill-edmonton", mode: "redirect", impressions: 34 },
  { legacy: "/march-out-cleaning", target: "/edmonton/march-out-cleaning", mode: "redirect", impressions: 30 },
  { legacy: "/cleaning-services-queen-alexandra-edmonton-ab", target: "/locations/queen-alexandra-edmonton", mode: "redirect", impressions: 24 },
  { legacy: "/cleaning-services-montrose-edmonton-ab", target: "/locations/montrose", mode: "redirect", impressions: 24 },
  { legacy: "/cleaning-services-prince-charles-edmonton-ab", target: "/locations/prince-charles-edmonton", mode: "redirect", impressions: 14 },
  { legacy: "/natural-cleaning-solutions-for-your-kitchen-appliances", target: "/cleaning-with-vinegar-and-baking-soda", mode: "redirect", impressions: 14 },
  { legacy: "/services-pricing/move-in-move-out", target: "/move-out-cleaning-edmonton", mode: "redirect", impressions: 12 },
  { legacy: "/shop", target: "/", mode: "redirect", impressions: 11 },
  { legacy: "/cleaning-services-glengarry-edmonton-ab", target: "/locations/glengarry-edmonton", mode: "redirect", impressions: 11 },
  { legacy: "/checkout", target: "/book", mode: "redirect", impressions: 10 },
  { legacy: "/cleaning-services-capilano-edmonton-ab", target: "/locations/capilano-edmonton", mode: "redirect", impressions: 9 },
  { legacy: "/cleaning-services-castle-downs-edmonton-ab", target: "/locations/castle-downs", mode: "redirect", impressions: 8 },
  { legacy: "/airbnb-cleaning-services-edmonton", target: "/edmonton/airbnb-cleaning", mode: "redirect", impressions: 7 },
  { legacy: "/cleaning-services-hermitage-edmonton-ab", target: "/locations/hermitage-edmonton", mode: "redirect", impressions: 6 },
  { legacy: "/cleaning-services-casselman-edmonton-ab", target: "/locations/casselman-edmonton", mode: "redirect", impressions: 5 },
  { legacy: "/cleaning-services-griesbach-edmonton-ab", target: "/locations/griesbach-edmonton", mode: "redirect", impressions: 4 },
  { legacy: "/cart", target: "/", mode: "redirect", impressions: 2 },
  { legacy: "/my-account", target: "/", mode: "redirect", impressions: 1 },
  { legacy: "/cochrane-cleaning-services", target: "/cleaning-services-cochrane", mode: "redirect", impressions: 1 },
  { legacy: "/cleaning-services-belmont-edmonton-ab", target: "/locations/belmont-edmonton", mode: "redirect", impressions: 1 },
  { legacy: "/#!", target: "/", mode: "redirect", impressions: 1 },
  { legacy: "/what-to-expect-from-professional-cleaners", target: "/blog/choosing-cleaning-company", mode: "redirect", impressions: 1 },
  { legacy: "/cleaning-services-lauderdale-edmonton-ab", target: "/locations/lauderdale", mode: "redirect", impressions: 1 },
  { legacy: "/2011/how-cleaning-services-improve-your-homes-health", target: "/blog", mode: "redirect", impressions: 1 },
  // Found by crawling the live site rather than Search Console: these pages
  // earn too little to appear in the GSC top-1000 export, but they are live,
  // ~1000 words each, and would 404 under the /* -> /404.html rule.
  { legacy: "/cleaning-services-miller-edmonton-ab", target: "/locations/miller-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-ozerna-edmonton-ab", target: "/locations/ozerna-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-mcleod-edmonton-ab", target: "/locations/mcleod-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-hollick-kenyon-edmonton-ab", target: "/locations/hollick-kenyon-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-brintnell-edmonton-ab", target: "/locations/brintnell-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-kilkenny-edmonton-ab", target: "/locations/kilkenny-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-delwood-edmonton-ab", target: "/locations/delwood-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-woodcroft-edmonton-ab", target: "/locations/woodcroft-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-holyrood-edmonton-ab", target: "/locations/holyrood-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-londonderry-edmonton-ab", target: "/locations/londonderry", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-spruce-avenue-edmonton-ab", target: "/locations/spruce-avenue", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-bannerman-edmonton-ab", target: "/locations/bannerman", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-balwin-edmonton-ab", target: "/locations/balwin-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-bellevue-edmonton-ab", target: "/locations/bellevue-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-secord-edmonton-ab", target: "/locations/secord-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-pleasantview-edmonton-ab", target: "/locations/pleasantview", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-hairsine-edmonton-ab", target: "/locations/hairsine-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-mayfield-edmonton-ab", target: "/locations/mayfield-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-mccauley-edmonton-ab", target: "/locations/mccauley-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-central-mcdougall-edmonton-ab", target: "/locations/central-mcdougall-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-westmount-edmonton-ab", target: "/locations/westmount-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-brookside-edmonton-ab", target: "/locations/brookside-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-kildare-edmonton-ab", target: "/locations/kildare-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-grovenor-edmonton-ab", target: "/locations/grovenor", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-eastwood-edmonton-ab", target: "/locations/eastwood-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/cleaning-services-sherbrooke-edmonton-ab", target: "/locations/sherbrooke-edmonton", mode: "redirect", impressions: 0 },
  { legacy: "/author/lokkom", target: "/blog", mode: "redirect", impressions: 0 },
  { legacy: "/category/cleaning-services", target: "/blog", mode: "redirect", impressions: 0 },
  { legacy: "/category/house-cleaning", target: "/blog", mode: "redirect", impressions: 0 },
];

/** legacy path -> modern route, for the routes we serve at the old URL. */
export const PRESERVED_URLS = LEGACY_URLS.filter((u) => u.mode === "preserve");

/** modern route -> preserved legacy path (the canonical URL for that content). */
const CANONICAL_BY_TARGET = new Map(PRESERVED_URLS.map((u) => [u.target, u.legacy]));

/**
 * The canonical path for a piece of content. Pages pass their modern route and
 * get back the legacy URL when one is being preserved, so both URLs agree on a
 * single canonical and Google keeps the equity it already assigned.
 */
export function canonicalPath(modernPath: string): string {
  return CANONICAL_BY_TARGET.get(modernPath) ?? modernPath;
}

/** Absolute canonical URL for a modern route. */
export function canonicalUrl(modernPath: string): string {
  return `https://dutycleaners.ca${canonicalPath(modernPath)}`;
}

/** legacy path -> the modern route it serves. */
const TARGET_BY_LEGACY = new Map(PRESERVED_URLS.map((u) => [u.legacy, u.target]));

/**
 * Resolve ANY path (modern route or preserved legacy path) to the single
 * canonical path for that content. Both URLs therefore agree, so serving a
 * page at two paths never creates a duplicate.
 */
export function canonicalForPath(path: string): string {
  const clean = path.replace(/\/+$/, "") || "/";
  if (TARGET_BY_LEGACY.has(clean)) return clean; // already the canonical legacy URL
  return canonicalPath(clean);
}

/**
 * dutycleaners.ca has always been trailing-slash canonical (WordPress default:
 * /about-us 301s to /about-us/). 122 of the 131 indexed URLs — 2.2M impressions
 * — are the slash form, so that is the form we keep. Dropping the slash would
 * change the URL of every indexed page, including pages whose content never
 * changed at all.
 */
export function withTrailingSlash(path: string): string {
  if (path === "/") return path;
  const [p, ...rest] = path.split(/(?=[?#])/);
  return (p.endsWith("/") ? p : `${p}/`) + rest.join("");
}

/** Absolute canonical URL for any path, in the site's trailing-slash form. */
export function canonicalUrlForPath(path: string): string {
  return `https://dutycleaners.ca${withTrailingSlash(canonicalForPath(path))}`;
}

/**
 * Like `canonicalForPath`, but ALSO follows `mode: "redirect"` entries.
 *
 * Breadcrumb ancestors are generated by slicing the current path, which can
 * produce a segment that only exists as a redirect (e.g. "/edmonton" 301s to
 * "/"). Linking a crumb there sends every breadcrumb click — and the
 * BreadcrumbList schema item — through a redirect hop.
 */
const REDIRECT_TARGET_BY_LEGACY = new Map(
  LEGACY_URLS.filter((u) => u.mode === "redirect").map((u) => [u.legacy, u.target]),
);

export function resolvedLinkPath(path: string): string {
  const canonical = canonicalForPath(path);
  const clean = canonical.replace(/\/+$/, "") || "/";
  return REDIRECT_TARGET_BY_LEGACY.get(clean) ?? canonical;
}
