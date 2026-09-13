# SEO editorial implementation — 13 September 2026

Implemented in the current local rebuild following the independent audit and the owner's instruction to do everything that does not require them. No deployment, account change, URL retirement or customer submission is included.

## Completed scope

- Replaced 117 repeated wall-washing finish guarantees with `WALL_WASHING_DESCRIPTION`, a shared add-on description that explicitly allows marks to remain. Qualified additional specialist-page outcomes and paint compatibility.
- Corrected company-wide Terms, guarantee, checklist, FAQ and About coverage for the approved Edmonton, Calgary and Red Deer branches. Kept city ratings and branch hours scoped. Clarified that 2017 is the Alberta business history, not an asserted opening date for every branch.
- Replaced blog-card fabricated publication-looking dates with labelled revisions from the date source. Removed hand-authored reading-time badges from cards and articles.
- Removed unsupported operational conclusions from the two main city pages, standard/deep/recurring pages, commercial and post-construction pairs, Airbnb pages and Stanley Park. Kept appropriate geographic context and replaced conjecture with actual booking/scope instructions. This is not a new independent geographic fact-check of every paragraph on all 153 area pages.
- Removed the incomplete base price from 11 satellite-town titles; retained travel-fee disclosures. Clarified Airbnb title units and wall washing as an add-on. Corrected Calgary's hourly-price spacing.
- Preserved both historical Diamond Valley URLs while explaining the present municipality in titles/H1s. No redirect or noindex changes.
- Shortened repeated homepage decision/proof copy, retaining inclusions, fees, branch contact information, guarantee and real review components. Clarified single-visit versus recurring service and excluded housekeeping work.
- Replaced overly broad cleaning-product compatibility/dwell-time claims, unsupported home recipes and natural-equals-safer implications. Product recommendations are categories, not invented comparative tests. Kept relevant primary-source references.
- Differentiated between-clean maintenance tips from the DIY schedule. Added relevant contextual links from preparation and Calgary booking information. Removed "Fresh From Google" wording from static review excerpts.
- Replaced git/build-time date inference with a reviewed rendered-content fingerprint ledger. Added a regression guard and a release check before existing scripted deployments. Removed unsupported AI-indexing claims from the IndexNow script comments.
- Browser QA caught a mislabelled Calgary skyline asset that appeared to depict Seattle. Removed its four imports and reused an existing generic interior illustration with accurate alt text; no image is presented as new customer proof.
- Updated obsolete test requirements that forced promotional titles, repeated keyword headings, FAQ/link counts and artificial city-text differences. Pricing, intended targeting, schema integrity and navigability remain checked.

## Revision-date workflow

`src/data/content-revisions.json` stores each canonical route's content fingerprint and last approved modification date. The baseline was seeded from the existing 210 prerendered pages and their existing sitemap dates; those historical dates retain their old provenance and are not a recovery of WordPress publication history.

1. Build and fully prerender the local changes.
2. Run `bun run content-dates`. Review the changed pages. It checks rendered main text, titles/descriptions, main links, image alt text and structured data, so shared prices/policies are covered.
3. Approve substantive changes with `bun run content-dates --approve YYYY-MM-DD` using the actual editorial revision date.
4. Rebuild and fully prerender to emit the approved article/sitemap dates, then run `bun run content-dates` again. It must report no content drift or stale sitemap dates.

For a reviewed cosmetic correction, append `--keep-date /canonical-path,/another-path` to the approval command. This accepts the new fingerprint while retaining those routes' previous dates. In this pass, the general hiring, DIY schedule and frequency articles only lost inaccurate reading-time badges; their revision dates are retained.

CSS/classes, script bundle hashes and revision dates themselves do not update the fingerprint. The check is a review aid, not a proof of significance: date-only details, photographs with unchanged alt text, hidden interactive states and external business changes still need human/editorial review. There is no automatic freshness stamping or ranking guarantee. Commit the ledger and regenerated date/sitemap artifacts with the release.

## Deliberately not changed

- Name/email/phone remain before the full price-and-extras screen. BookingKoala remains the availability authority. No form or payment flow redesign in this SEO pass.
- No fabricated staff, customer cases, business history, certifications, fresh review counts or photos represented as actual jobs.
- No automatic area-page mergers, blanket noindex, deletion of useful local facts, new synonym/location pages or mass FAQ removal.
- No claim that these changes guarantee Google rankings or AI citations. Tests are regression checks, not an SEO rating.

## Owner/external dependencies

The launch checklist retains SiteGround deployment/credentials, relay and email delivery checks, BookingKoala receiver installation and approved booking test, real photos/profiles, Red Deer gift-card scope, unknown original article dates, account-based authority work and evidence-based consolidation decisions. Production Core Web Vitals and ranking/conversion changes require the actual host and traffic.

## Primary references used for cleaning-advice corrections

- [Health Canada: household chemical safety](https://www.canada.ca/en/health-canada/services/home-safety/household-chemical-safety.html)
- [Moen: faucet finish care](https://solutions.moen.com/Article_Library/Faucet_Finish_Care_and_Cleaning)
- [Whirlpool: vinegar and washing machines](https://www.whirlpool.com/blog/washers-and-dryers/should-you-clean-washing-machine-with-vinegar.html)

## Verification results

- Full production build and prerender: **210/210 pages**, zero render failures, zero snapshots hiding below-hero content.
- Regression suite: **47 test files; 1,659 passed, two skipped, zero failed**. The changed count reflects removal of unsupported per-city wording-overlap tests and addition of editorial/date guards, not an SEO score.
- Mutation proofs: **6/6 caught their injected defects**, including an unqualified wall promise, a date advance without content change, incorrect published prices and a title stripped of its service/city. All targets restored.
- Reviewed content dates: **zero drift across 210 routes** after approval and regeneration. The three reading-badge-only articles retain their previous revision dates.
- Rendered crawl: no missing pages, missing/multiple H1s, unexpected noindex, wrong canonicals, duplicate titles/descriptions, unresolved internal page destinations, redirect-only internal page links or orphan pages. All JSON-LD scripts parse. This does not establish rich-result eligibility, fragment-target correctness or external link uptime.
- The prior wall-finish promise appears on **zero** rendered pages, down from 117.
- Homepage main-text counts decreased from approximately **3,788 to 3,458 words** (Edmonton) and **3,616 to 3,320 words** (Calgary), preserving price/scope disclosures. These are editorial measurements, not ranking limits or performance scores.
- Browser QA: desktop blog cards; mobile blog and homepage at 390×844; quote opening and step-one-to-contact-step navigation. Name/email/phone remain before full price. No contact data, form submission, payment or booking was sent. Browser viewport restored afterwards.
- Live hosting, email delivery, BookingKoala receiver/availability and field Core Web Vitals still need the production/staging environment. No external deployment was performed.

The detailed machine-readable post-change crawl is saved in the task workspace as `duty-audit-after-implementation-2026-09-13.json`; the original audit data was preserved.
