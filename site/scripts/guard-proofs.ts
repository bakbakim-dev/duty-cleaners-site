/**
 * Every guard, and the one edit that must make it fail.
 *
 * Five guards in this repository passed for weeks while catching nothing: one
 * counted filenames instead of reading them, one compared a CSP against a
 * copy of itself, and three had their regexes mangled in transit (`\b` became
 * a backspace, `\r?\n` a real newline) so they matched nothing and asserted
 * "no matches" — which is exactly what a clean site also looks like.
 *
 * A guard is only known to work at the moment it has been seen to fail. So
 * each entry here names a target file, an exact edit that reintroduces the
 * defect the guard exists for, and the test that must then fail. The runner
 * (prove-guards.ts) applies each one, runs the guard, checks it failed for
 * the stated reason, and restores the file. The vitest side
 * (guard-proofs.test.ts) checks, cheaply and on every run, that every guard
 * file has an entry and that every `find` still occurs exactly once — so a
 * refactor cannot silently turn a proof into a no-op either.
 *
 * Add a guard, add its proof. The suite fails otherwise.
 */

export interface GuardProof {
  /** The test file this proves, relative to the site root. */
  guard: string;
  /** The file to break, relative to the site root. */
  target: string;
  /** Exact text to replace; must occur exactly once in the target. */
  find: string;
  replace: string;
  /** The `it(...)` title (or a tsc error fragment) that must then fail. */
  failing: string;
  /** What defect this reintroduces, in one sentence. */
  why: string;
  /** How the failure is detected. Defaults to running the guard with vitest. */
  check?: "vitest" | "tsc";
  /** The target lives in dist/, so the site must be built and prerendered. */
  dist?: boolean;
}

export const GUARD_PROOFS: GuardProof[] = [
  // ---- published prices --------------------------------------------------
  {
    guard: "src/data/published-prices.test.ts",
    target: "src/pages/locations/Sunalta.tsx",
    find: "priceRange: sitePriceRange(),",
    replace: 'priceRange: "$155-$539",',
    failing: "no page under src/pages hand-types a dollar figure unless it says why",
    why: "Retypes the band one location page derived, the defect 63 pages carried.",
  },
  {
    guard: "src/data/published-prices.test.ts",
    target: "src/data/gift-cards.ts",
    find: "rows.filter((r) => dollars(r) <= amount).at(-1) ?? null;",
    replace: "rows.filter((r) => dollars(r) <= amount).at(0) ?? null;",
    failing: "each gift card label promises only what its amount pays for",
    why: "Makes a gift-card label name the smallest home it covers instead of the largest.",
  },
  {
    guard: "src/data/published-prices.test.ts",
    target: "src/data/published-prices.test.ts",
    find: "const ALLOWED_LITERALS: Record<string, string> = {",
    replace: 'const ALLOWED_LITERALS: Record<string, string> = {\n  "Sunalta.tsx": "a stale entry excusing a file that has no literal",',
    failing: "every allowlisted page still contains the literal it is excused for",
    why: "An allowlist entry that matches nothing is a hole waiting for the next typed price.",
  },

  // ---- policy and provenance ---------------------------------------------
  {
    guard: "src/data/policy.test.ts",
    target: "src/data/policy.ts",
    find: 'guaranteeWindowHours: confirm(24, { by: "owner", on: "2026-08-24" }),',
    replace: 'guaranteeWindowHours: confirm(48, { by: "owner", on: "2026-08-24" }),',
    failing: "is 24 hours",
    why: "Reopens the 24-versus-48-hour guarantee drift at the one constant every surface reads.",
  },
  {
    guard: "src/data/policy.test.ts",
    target: "src/data/policy.ts",
    find: 'guaranteeWindowHours: confirm(24, { by: "owner", on: "2026-08-24" }),',
    replace: "guaranteeWindowHours: 24,",
    failing: "is not assignable to type 'Confirmed<number>'",
    why: "A bare literal in a Confirmed slot must not compile; that is what the brand is for.",
    check: "tsc",
  },
  {
    guard: "src/data/policy.test.ts",
    target: "src/data/policy.ts",
    find: '${money(travelFee("post-construction"))} for post-construction',
    replace: "$45 for post-construction",
    failing: "every dollar figure in policy.ts is either confirmed or derived",
    why: "Hand-types a bk-config figure back into the file that exists to stop that.",
  },

  // ---- the rest of the suite, one proof each -----------------------------
  {
    guard: "src/data/accessibility.test.ts",
    target: "src/components/CityIncludedChapter.tsx",
    find: "grid grid-cols-[2.5rem_minmax(0,1fr)] items-start gap-4",
    replace: "grid grid-cols-[2.5rem_minmax(0,11rem)_minmax(0,1fr)] items-start gap-4",
    failing: "does not reserve the desktop three-track grid below md",
    why: "Puts the 11rem title track back on the all-widths grid, the mobile clipping regression.",
  },
  {
    guard: "src/data/addon-table.test.ts",
    target: "src/data/addon-table.ts",
    find: 'const label = city === "calgary" ? "Outside Calgary (travel fee)" : "Outside Edmonton (travel fee)";',
    replace: 'const label = city === "calgary" ? "Outside Edmonton (travel fee)" : "Outside Calgary (travel fee)";',
    failing: "names the correct city on the travel-fee row",
    why: "Makes the Calgary add-on table say Edmonton on its travel-fee row.",
  },
  {
    guard: "src/data/blog-posts.test.ts",
    target: "src/pages/BlogVinegarBakingSoda.tsx",
    find: '"dateModified": modifiedOr("/cleaning-with-vinegar-and-baking-soda"),',
    replace: '"dateModified": "2026-01-25",',
    failing: "no post reintroduces a hand-typed dateModified",
    why: "Reintroduces a hand-typed modification date in a post's schema.",
  },
  {
    guard: "src/data/city-twins.test.ts",
    target: "dist/calgary/pricing/index.html",
    find: '<main id="main-content" tabindex="-1">',
    replace: '<main id="main-content" tabindex="-1"></main>',
    failing: "/calgary/pricing/ says something /pricing/ does not",
    why: "Empties the Calgary pricing body so it says nothing its Edmonton twin does not.",
    dist: true,
  },
  {
    guard: "src/data/claims-and-links.test.ts",
    target: "public/llms.txt",
    find: "a $29.99 travel fee is added to cleaning bookings",
    replace: "a $99 travel fee is added to cleaning bookings",
    failing: "every surface quoting a travel fee quotes the authority's amount",
    why: "Restores the $99-versus-$29.99 travel-fee drift on the machine-reader surface.",
  },
  {
    guard: "src/data/headers.test.ts",
    target: "index.html",
    find: 'document.documentElement.removeAttribute("data-motion")},4000);',
    replace: 'document.documentElement.removeAttribute("data-motion")},5000);',
    failing: "pins the current hash of the inline bootstrap script",
    why: "Changes one character of the inline script so the CSP hash in _headers no longer matches.",
  },
  {
    guard: "src/data/htaccess-parity.test.ts",
    target: "public/.htaccess",
    find: "RewriteRule ^services/commercial-cleaning/?$ /commercial-cleaning/ [R=301,L]",
    replace: "RewriteRule ^services/commercial-cleaning/?$ /commercial-cleaning-services-calgary/ [R=301,L]",
    failing: "every Netlify redirect has an Apache equivalent, and vice versa",
    why: "Repoints one Apache rule so the two generated rule sets disagree.",
  },
  {
    guard: "src/data/htaccess-parity.test.ts",
    target: "public/.htaccess",
    find: "  RewriteCond %{HTTPS} !=on\n  RewriteCond %{HTTP:X-Forwarded-Proto} !=https\n",
    replace: "  RewriteCond %{HTTPS} !=on [OR]\n  RewriteCond %{HTTP:X-Forwarded-Proto} =http\n",
    failing: "does not redirect a request that is already HTTPS behind the proxy",
    why: "Restores the OR'd HTTPS conditions that loop behind a TLS-terminating proxy.",
  },
  {
    guard: "src/data/internal-links.test.ts",
    target: "dist/locations/allendale/index.html",
    find: 'hover:text-accent" href="/edmonton/deep-cleaning/"',
    replace: 'hover:text-accent" href="/calgary/deep-cleaning/"',
    failing: "no location page links to the other city's service pages",
    why: "Makes an Edmonton location page link to a Calgary service page.",
    dist: true,
  },
  {
    guard: "src/data/legacy-families.test.ts",
    target: "src/data/legacy-urls.ts",
    find: 'legacy: "/cleaning-services-for-leduc-ab"',
    replace: 'legacy: "/cleaning-services-for-leduc-ab-old"',
    failing: "every /cleaning-services-for-… URL Search Console knows about is mapped",
    why: "Drops Leduc, the family member that hid in 'Crawled - currently not indexed'.",
  },
  {
    guard: "src/data/llms-txt.test.ts",
    target: "public/llms.txt",
    find: "[FAQ](https://dutycleaners.ca/faqs/): Answers to common cleaning questions",
    replace: "[FAQ](https://dutycleaners.ca/faqs): Answers to common cleaning questions",
    failing: "every page link is trailing-slash canonical",
    why: "Strips the trailing slash from one machine-reader link on a slash-canonical site.",
  },
  {
    guard: "src/data/localization.test.ts",
    target: "dist/locations/allendale/index.html",
    find: "A standard clean in Allendale runs",
    replace: "A standard clean in Edmonton runs",
    failing: "the injected place name in the pricing prose is the page's own",
    why: "Names the city instead of the page's own place in the pricing prose.",
    dist: true,
  },
  {
    guard: "src/data/location-directory.test.ts",
    target: "src/data/location-directory.ts",
    find: "  if (city) return BY_CITY[city].get(key) ?? null;",
    replace: "  if (city) return BY_CITY[city].get(key) ?? ANY_CITY.get(key) ?? null;",
    failing: "returns null rather than linking across cities",
    why: "Restores the cross-city fallback that sent a Calgary chip to an Edmonton page.",
  },
  {
    guard: "src/data/location-geo.test.ts",
    target: "src/data/location-geo.ts",
    find: '"/locations/spruce-avenue": { latitude: "53.56440", longitude: "-113.49842" },',
    replace: '"/locations/spruce-avenue": { latitude: "53.54610", longitude: "-113.49380" },',
    failing: "no pin has fallen back to a bare city centre",
    why: "Moves one pin onto the Edmonton centroid, the geocoder's city-centre fallback signature.",
  },
  {
    guard: "src/data/location-pages.test.ts",
    target: "dist/locations/allendale/index.html",
    find: '"@type":"BreadcrumbList"',
    replace: '"@type":"BreadcrumbLst"',
    failing: "every page emits BreadcrumbList",
    why: "Removes the breadcrumb schema from one built page.",
    dist: true,
  },
  {
    guard: "src/data/onpage-seo.test.ts",
    target: "dist/faqs/index.html",
    find: "<title>House Cleaning FAQs – Edmonton &amp; Calgary | Duty Cleaners</title>",
    replace: "<title>House Cleaning Frequently Asked Questions for Homeowners Across Edmonton &amp; Calgary | Duty Cleaners</title>",
    failing: "titles and descriptions fit the width Google gives a snippet",
    why: "Pushes a built title past the pixel width a snippet gets.",
    dist: true,
  },
  {
    guard: "src/data/pricing.test.ts",
    target: "src/data/pricing.ts",
    find: "price: displayPrice(money(standard + packagePrice)),",
    replace: "price: displayPrice(money(standard)),",
    failing: "prices a deep clean as Standard plus the Deep Cleaning package",
    why: "Publishes the deep tier without the package price bk-config adds to it.",
  },
  {
    guard: "src/data/quote-intent.test.ts",
    target: "src/hooks/use-quote-overlay.tsx",
    find: "const intentInHref = /[?&]intent=deep(?:[&#]|$)/.test(rawHref);",
    replace: "const intentInHref = false;",
    failing: "the interceptor reads the intent from the href, not only a data attribute",
    why: "Stops the quote interceptor reading intent=deep from the CTA href.",
  },
  {
    guard: "src/data/recurring-quote.test.ts",
    target: "src/data/pricing.ts",
    find: "const recurringAddOns = chosen.filter((addOn) => !addOn.firstVisitOnly);",
    replace: "const recurringAddOns = chosen;",
    failing: "leaves a first-visit-only extra out of the recurring price entirely",
    why: "Bills a first-visit-only extra on every recurring visit.",
  },
  {
    guard: "src/data/rendered-quality.test.ts",
    target: "dist/cleaning-services-st-albert/index.html",
    find: "house cleaning in St. Albert costs, worked through",
    replace: "house cleaning in St Albert costs, worked through",
    failing: "no banned grammar artifact appears on any rendered page",
    why: "Reintroduces the de-slugged 'St Albert' in rendered prose.",
    dist: true,
  },
  {
    guard: "src/data/service-radius.test.ts",
    target: "dist/index.html",
    find: "The Edmonton branch sends reference-checked cleaners across the city and the communities around it.",
    replace: "The Edmonton branch sends reference-checked cleaners across the city and the communities within a 30km radius.",
    failing: "no built page states a radius its own coordinates contradict",
    why: "States a 30 km radius that location-geo.ts contradicts (Stony Plain is 33.8 km out).",
    dist: true,
  },
  {
    guard: "src/data/structured-data.test.ts",
    target: "dist/contact-us/index.html",
    find: '"https://x.com/Dutycleaners"],"telephone":"+1-780-913-6565"',
    replace: '"https://x.com/Dutycleaners"],"telephone":"+1-7809136565"',
    failing: "every schema telephone is one of the two real numbers, in one format",
    why: "Reintroduces the unformatted E.164 that gave one @id two phone numbers.",
    dist: true,
  },
  {
    guard: "src/lib/booking-redirect.test.ts",
    target: "src/lib/booking-redirect.ts",
    find: "bedrooms: [1, { 1: 87, 2: 81, 3: 82, 4: 83, 5: 84, 6: 85, 7: 86 }],",
    replace: "bedrooms: [1, { 1: 87, 2: 81, 3: 83, 4: 83, 5: 84, 6: 85, 7: 86 }],",
    failing: "matches the reference example exactly",
    why: "Sends BookingKoala the 4-bedroom option id for a 3-bedroom home.",
  },
  {
    guard: "src/lib/city-from-path.test.ts",
    target: "src/lib/city-from-path.ts",
    find: 'if (/(^|[/-])calgary($|[/-])/.test(path)) return "calgary";',
    replace: 'if (path.startsWith("/calgary")) return "calgary";',
    failing: "treats the canonical Calgary landing URL as Calgary",
    why: "Restores the startsWith bug that put Edmonton's phone on the biggest Calgary page.",
  },
  {
    guard: "src/lib/google-listings.test.ts",
    target: "src/lib/google-listings.ts",
    find: '"8192121191672692049",',
    replace: '"8192121191672692040",',
    failing: "edmonton: the Place ID encodes the CID it is paired with",
    why: "Breaks the CID / Place ID pairing a review link depends on.",
  },
  {
    guard: "src/lib/schema-url.test.ts",
    target: "src/lib/pricing-schema.ts",
    find: 'url: canonicalUrlForPath("/calgary/pricing"),',
    replace: 'url: "https://dutycleaners.ca/calgary/pricing",',
    failing: "the pricing builder publishes a slash-canonical url for both cities",
    why: "Retypes the Calgary pricing URL without its trailing slash, so the Service node names a 301.",
  },

  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/components/CityCoverageGrid.tsx",
    find: 'intro = "Each name links to its own page. For an address that is not listed, call the branch.",',
    replace: 'intro = "Say goodbye to dirt. Each name links to its own page. For an address that is not listed, call the branch.",',
    failing: "no page or component carries filler that was only ever template noise",
    why: "Reintroduces a stock closer on a hub component that 146 pages render.",
  },
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/pages/locations/Leduc.tsx",
    // Was the About-section line "Many households here work a rotation rather
    // than a weekday." That sentence said the page's one local insight for the
    // second of three times and was cut; the insight now lives once, here, in
    // the local note. The proof follows it.
    find: "Leduc sits 33 km south of Edmonton and directly beside the international airport,",
    replace: "Leduc is a thriving city. Leduc sits 33 km south of Edmonton and directly beside the international airport,",
    failing: "the money pages carry none of the brochure vocabulary",
    why: "Puts the brochure register back on the town page where a reader lands first.",
  },
  {
    guard: "src/data/money-page-seo.test.ts",
    target: "dist/move-out-cleaning-edmonton/index.html",
    find: "<title>Move Out Cleaning Edmonton from $284 | Duty Cleaners</title>",
    replace: "<title>Move Out Cleaning Edmonton | Duty Cleaners</title>",
    failing: "title carries the query and a reason to click, under 60 characters",
    why: "Strips the price hook from a money-page title, the click-through defect the audit found on 20 pages.",
    dist: true,
  },
  {
    guard: "src/data/page-weight.test.ts",
    target: "src/data/page-weight.test.ts",
    find: "  js_gzip_kb: 170,",
    replace: "  js_gzip_kb: 17,",
    failing: "scripts total under 17 KB gzipped",
    why: "Asset names are hashed per build, so the proof tightens the budget and shows the measurement is real: every page's scripts weigh more than 17 KB.",
    // The target is the guard itself, but the guard only measures a built site.
  },
  {
    guard: "src/data/page-weight.test.ts",
    target: "src/data/page-weight.test.ts",
    find: "  image_kb: 100,",
    replace: "  image_kb: 10,",
    failing: "no body image is over 10 KB",
    why: "Tightens the per-image cap the same way, proving the cap reads real bytes: the 133 KB body photo the total-image budget hid would land over any honest cap.",
  },
  {
    guard: "src/data/page-weight.test.ts",
    target: "src/data/page-weight.test.ts",
    find: 'const HIDES_ON_PHONES = "hidden";',
    replace: 'const HIDES_ON_PHONES = "relative";',
    failing: "does not make a phone download a hero it never renders",
    why: "Points the ancestor scan at a class every hero really does sit inside, so a scan that never walked the wrappers would still report nothing and be caught.",
  },
  {
    guard: "src/data/page-weight.test.ts",
    target: "src/data/page-weight.test.ts",
    find: 'const REVEAL_HIDDEN = "opacity-0 translate-y-8";',
    replace: 'const REVEAL_HIDDEN = "<main";',
    failing: "ships no scroll-reveal wrapper still in its hidden start state",
    why: "Points the search at a string every built page contains, so a check reading the wrong file — or no file — cannot pass by finding nothing.",
  },
  {
    guard: "src/data/page-weight.test.ts",
    target: "src/data/page-weight.test.ts",
    find: "  const CAP_KB = 100;",
    replace: "  const CAP_KB = 10;",
    failing: "every image asset is at most 10 KB",
    why: "Asset names are hashed per build, so the proof tightens the cap: it shows the scan really reads every image in dist, not an empty list.",
  },
  // ---- FAQ answers are lifted alone --------------------------------------
  // One proof per banned term, each putting back a sentence that really
  // shipped inside FAQPage markup.
  {
    guard: "src/data/faq-answers.test.ts",
    target: "dist/calgary/deep-cleaning/index.html",
    find: 'each add a charge on the quote."}',
    replace: 'each add a charge on the quote. The table above lists every home size."}',
    failing: "no FAQ answer points at the rest of its page",
    why: "Restores the audited Calgary deep-clean answer, which sent a lifted reader to a table above it they cannot see.",
    dist: true,
  },
  // ---- the content-prompt rollout (DUTY-CLEANERS-CONTENT-PROMPT.md), 2026-09-10 ----
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/pages/locations/Mahogany.tsx",
    find: 'title: "Re-Clean Guarantee", description: "Tell us within 24 hours if something was missed',
    replace: 'title: "Re-Clean Guarantee", description: "Trusted by local families. Tell us within 24 hours if something was missed',
    failing: "no location page carries brochure vocabulary or a retired promise",
    why: "Puts a 'trusted by' line back on a neighbourhood page, where the money-page word list never reached.",
  },
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/pages/EdmontonPricing.tsx",
    find: "Every 4 weeks comes to 13 visits a year rather than 12.",
    replace: "Every 4 weeks comes to 13 visits a year rather than 12, with a 100% satisfaction guarantee.",
    failing: "no money page makes a promise the content prompt retired",
    why: "Restores a '100% satisfaction' promise the re-clean guarantee (policy T1) does not make.",
  },
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/pages/locations/Mahogany.tsx",
    find: 'description: "The team brings all supplies and equipment.',
    replace: 'description: "Run a business in Mahogany? We also handle commercial and office cleaning. The team brings all supplies and equipment.',
    failing: "no location page sells commercial cleaning",
    why: "Brings back the commercial-cleaning promo that seven neighbourhood pages ended on.",
  },
  {
    guard: "src/data/claims-and-links.test.ts",
    target: "dist/locations/mahogany/index.html",
    find: "Ready to Book a Clean in Mahogany?",
    replace: "Ready to Book a Clean in Mahogany? Same-day and next-day availability.",
    failing: "no house-cleaning page claims /same-day and next-day (?:availability|openings)/ — an unconditional same-day promise; the most the site says is that same-day and next-day slots depend on the schedule",
    why: "Restores the unconditional same-day card that ran on 150 neighbourhood pages.",
    dist: true,
  },
  {
    guard: "src/data/claims-and-links.test.ts",
    target: "dist/locations/mahogany/index.html",
    find: "Ready to Book a Clean in Mahogany?",
    replace: "Ready to Book a Clean in Mahogany? 100% satisfaction guaranteed.",
    failing: "no house-cleaning page claims /\\b100%\\s*satisf/ — the guarantee is a re-clean within 24 hours (policy T1), not a satisfaction promise",
    why: "Restores the '100% satisfaction' badge and FAQ that ran on 150 pages.",
    dist: true,
  },
  {
    guard: "src/data/claims-and-links.test.ts",
    target: "dist/locations/mahogany/index.html",
    find: "Ready to Book a Clean in Mahogany?",
    replace: "Ready to Book a Clean in Mahogany? Trusted by local families.",
    failing: "no house-cleaning page claims /\\btrusted by\\b/ — an endorsement no source backs",
    why: "Restores the 'trusted by' subtitle that ran on 158 pages.",
    dist: true,
  },
  {
    guard: "src/data/claims-and-links.test.ts",
    target: "dist/locations/mahogany/index.html",
    find: "Ready to Book a Clean in Mahogany?",
    replace: "Ready to Book a Clean in Mahogany? Our cleaners are fully insured.",
    failing: "no house-cleaning page claims /\\binsured\\b/ — no insurance fact exists in proof.ts or policy.ts",
    why: "Claims insurance, a fact nothing in the repository records.",
    dist: true,
  },
  {
    guard: "src/data/claims-and-links.test.ts",
    target: "dist/locations/mahogany/index.html",
    find: "Ready to Book a Clean in Mahogany?",
    replace: "Ready to Book a Clean in Mahogany? Cleaners trained to exacting quality standards.",
    failing: "no house-cleaning page claims /exacting quality standards/ — an unsourced quality claim",
    why: "Restores the 'exacting quality standards' card that ran on 132 pages.",
    dist: true,
  },
  {
    guard: "src/data/claims-and-links.test.ts",
    target: "dist/locations/mahogany/index.html",
    find: "Ready to Book a Clean in Mahogany?",
    replace: "Ready to Book a Clean in Mahogany? Here are the places that make Mahogany feel like home.",
    failing: "no house-cleaning page claims /feel like home/ — the landmark-tour sections the prompt retired as tourism",
    why: "Restores the landmark-tour intro that ran on 52 neighbourhood pages.",
    dist: true,
  },
  {
    guard: "src/data/location-pages.test.ts",
    target: "dist/locations/mahogany/index.html",
    find: "Ready to Book a Clean in Mahogany?",
    replace: "Ready to Book a Clean in Mahogany? Book today!",
    failing: "no location page's copy uses an exclamation mark",
    why: "Puts an exclamation mark back into a neighbourhood page's copy, as 146 pages had.",
    dist: true,
  },
  {
    guard: "src/data/faq-answers.test.ts",
    target: "dist/services/index.html",
    find: '"text":"No. Every price we quote in Edmonton,',
    replace: '"text":"No. Every figure on this page,',
    failing: "no FAQ answer points at the rest of its page",
    why: "Restores the audited GST answer, which named no price and pointed at this page instead.",
    dist: true,
  },
  {
    guard: "src/data/faq-answers.test.ts",
    target: "dist/how-much-does-a-house-cleaning-cost/index.html",
    find: '."}},{"@type":"Question","name":"How much does a move-out clean cost?"',
    replace: '. The table below shows what that does to each tier."}},{"@type":"Question","name":"How much does a move-out clean cost?"',
    failing: "no FAQ answer points at the rest of its page",
    why: "Restores the cost guide's recurring-table pointer, so the third banned word is seen to fail as well.",
    dist: true,
  },

  // ---- the owner's answers of 2026-09-10 ---------------------------------
  {
    guard: "src/data/rendered-quality.test.ts",
    target: "dist/reviews/index.html",
    find: "Alberta Bookings",
    replace: "Alberta Bookings, 4,000+ Edmonton homes cleaned",
    failing: "states volume only as the owner's confirmed bookings figure",
    why: "Restores the unconfirmed per-city homes figure the owner replaced with 5,000+ bookings.",
    dist: true,
  },
  {
    guard: "src/data/location-pages.test.ts",
    target: "dist/locations/black-diamond/index.html",
    find: ">Turner Valley (Diamond Valley)</a>",
    replace: ">Turner Valley</a>",
    failing: "every link to either half of Diamond Valley names the town",
    why: "Links Turner Valley from Black Diamond as if the two were still separate towns.",
    dist: true,
  },
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/components/CityIncludedChapter.tsx",
    find: '"Hard floors mopped",',
    replace: '"Hard floors mopped", "Light switches & door handles",',
    failing: "light switches are in the deep package, not the standard checklist",
    why: "Puts light switches back on the standard checklist, which the owner keeps for the deep clean.",
  },
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/components/quote/ServiceStartCard.tsx",
    find: 'to="/contact-us/?topic=airbnb" className="font-semibold',
    replace: 'to="/contact-us/" className="font-semibold',
    failing: "online quotes are for office cleaning only, and short-term rentals get a callback",
    why: "Sends Airbnb hosts to the general quote form again instead of the callback request.",
  },
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/components/RecentActivityStrip.tsx",
    find: "            {BOOKINGS_CLAIM}",
    replace: "            4,000+ {city} homes cleaned",
    failing: "no page or component labels a figure as homes cleaned",
    why: "Restores the per-city homes figure in a strip that renders only in the browser, where the prerendered check cannot see it.",
  },
  {
    guard: "src/data/copy-quality.test.ts",
    target: "src/pages/Contact.tsx",
    find: '<SelectItem value="commercial">Office Cleaning</SelectItem>',
    replace: '<SelectItem value="commercial">Office & Commercial Cleaning</SelectItem>',
    failing: "online quotes are for office cleaning only, and short-term rentals get a callback",
    why: "Offers online quotes for all commercial work again, when the owner quotes only offices online.",
  },

  // ---- and this registry itself ------------------------------------------
  {
    guard: "src/data/guard-proofs.test.ts",
    target: "scripts/guard-proofs.ts",
    find: 'find: \'legacy: "/cleaning-services-for-leduc-ab"\',',
    replace: 'find: \'legacy: "/cleaning-services-for-leduc-ab-gone"\',',
    failing: "every proof's find string occurs exactly once in its target",
    why: "A proof whose find string no longer exists would restore nothing and prove nothing.",
  },
];
