# Search Console query-to-page and coverage audit — 2026-09-20

## Scope and evidence

- Property: `sc-domain:dutycleaners.ca`
- Live Search Console data checked through 2026-09-17.
- Fresh exports:
  - `C:\Users\Marketplace\Downloads\dutycleaners.ca-Performance-on-Search-2026-09-20.xlsx`
  - `C:\Users\Marketplace\Downloads\dutycleaners.ca-Performance-on-Search-Generative-AI-Features-2026-09-20.xlsx`
- The main export contains 1,000 query rows and 64 page rows.
- The apparent “16 months” view contains data only from 2026-08-23 through 2026-09-17 (26 days). Treat low-volume conclusions as provisional.
- Exact queries were filtered in the live report and the Pages table was read with clicks, impressions, CTR and average position. This is joined query-by-page evidence; it is not an inferred join between separate CSVs.
- These measurements describe the current `dutycleaners.ca` site, not the not-yet-launched replacement. Rankings can change after migration, redirects and recrawling.

## Performance baseline

| Metric | Value |
|---|---:|
| Clicks | 487 |
| Impressions | 71,168 |
| CTR | 0.7% |
| Average position | 28 |
| Canada | 445 clicks / 61,037 impressions |
| Mobile | 309 clicks / 13,341 impressions / 2.32% CTR / position 17.2 |
| Desktop | 170 clicks / 57,630 impressions / 0.29% CTR / position 30.5 |

Desktop carries most impressions but is generally ranking too low to earn clicks. The overall CTR is therefore not mainly a title-description problem; low average visibility is a major factor.

## Confirmed query-to-page conflicts

### P1 — Edmonton move-out target is being displaced by the homepage

For `move out cleaning edmonton`:

| URL | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| `/` | 13 | 300 | 4.3% | 3.1 |
| `/move-out-cleaning-edmonton/` | 3 | 139 | 2.2% | 9.4 |

For `move out cleaning services`, impressions are split among `/move-out-cleaning-edmonton/` (220 at position 20.7), `/` (209 at 31.8) and `/move-out-cleaning-calgary/` (26 at 14.9).

**Decision:** keep both city move-out pages. Do not merge them into the homepage. Make the Edmonton page the unequivocal Edmonton move-out destination: strongest exact-topic internal anchors, self-canonical, complete service/pricing/scope proof and no homepage copy block that functions as an alternate full move-out landing page. The homepage may summarize and link, but should not carry equivalent move-out targeting depth.

### P1 — Edmonton commercial and office intent is landing on the homepage

| Query | Homepage | `/commercial-cleaning/` |
|---|---|---|
| `commercial cleaning edmonton` | 88 impressions, position 1.4 | 190 impressions, position 23.4 |
| `commercial cleaning services edmonton` | 137 impressions, position 1.6 | 147 impressions, position 24.7 |
| `office cleaning edmonton` | 217 impressions, position 1.5 | 192 impressions, position 25.6 |

The specialist page receives more impressions for two queries, but the homepage is dramatically stronger when it appears. The intended commercial URL has weak relevance/authority consolidation.

**Decision:** retain the commercial page and strengthen it rather than merging it into the homepage. Reduce commercial-topic depth on the homepage to a concise service summary and descriptive link. Point commercial/office contextual links to `/commercial-cleaning/`. Ensure the commercial page clearly covers office cleaning and Edmonton in title, H1, introductory copy, proof, service area and conversion path.

### P1 — Edmonton post-construction intent is also split

For `post construction cleaning edmonton`:

| URL | Clicks | Impressions | CTR | Position |
|---|---:|---:|---:|---:|
| `/` | 2 | 66 | 3.0% | 1.8 |
| `/post-construction-cleaning/` | 0 | 119 | 0% | 9.0 |

**Decision:** retain the specialist page, provided the operational scope is confirmed. Consolidate Edmonton post-construction relevance and internal links onto it. Keep the homepage treatment brief. Do not publish stronger scope promises until the service boundaries are approved.

## Material overlap that needs monitoring, not deletion

### Wall cleaning pages

Both regional pages appear for generic terms:

| Query | Edmonton/generic URL | Calgary URL |
|---|---|---|
| `wall cleaning` | 10 impressions, position 14.3 | 6 impressions, position 6.5 |
| `wall washing` | 10 impressions, position 14.1 | 3 impressions, position 4.7 |
| `wall cleaning service` | 6 impressions, position 8.3 | 6 impressions, position 4.7; 1 click |
| `exterior wall cleaning services` | 42 impressions, position 70.0 | 44 impressions, position 9.9 |

Search Console does not expose searcher city, so identical unqualified text may legitimately route to different city pages through localization. Do not merge solely from these rows. Make the Edmonton and Calgary geography explicit and monitor city-qualified terms after launch.

### Sherwood Park and St. Albert

- `cleaning services sherwood park`: local page 12 impressions at position 32.4; homepage 6 at position 1.0.
- `house cleaning sherwood park`: homepage 22 at position 16.0; local page 10 at position 31.6.
- `cleaning services st albert`: local page 21 at position 19.6; homepage 4 at position 1.0 and one click.
- `house cleaning st albert`: local page 23 at position 25.8; homepage 6 at position 2.7.

This looks more like authority/relevance weakness on the town pages than a reason to delete them. Keep them only if the business genuinely serves the areas and each page has useful local booking information. Improve local proof and links, then reassess after enough post-launch data.

### Broad Edmonton residential leakage

The homepage correctly owns the main Edmonton residential terms. The move-out page receives secondary impressions, but at much weaker positions:

- `cleaning services edmonton`: homepage 1,020 impressions at 4.6; move-out page 43 at 60.2.
- `house cleaning edmonton`: homepage 395 at 8-ish overall; move-out page 83 secondary impressions.
- `residential cleaning edmonton`: homepage 119; move-out page 24.
- `maid service edmonton`: homepage 174; move-out page 9.

This is not presently a page-removal case. Avoid expanding general house-cleaning copy on the move-out page and keep its internal-anchor profile move-out specific.

## Clean routing observed

- Calgary broad residential intent is routed almost exclusively to `/cleaning-services-calgary/`.
- Airdrie queries checked route only to `/cleaning-services-airdrie/`.
- Red Deer queries checked route only to `/cleaning-services-red-deer/`.
- Cochrane and Fort Saskatchewan queries checked route to their intended local pages.
- Calgary move-out, post-construction and deep-cleaning queries checked route to the intended Calgary pages.

Do not disturb this routing without stronger contrary evidence.

## Pages without enough query evidence

- `/cleaning-services-black-diamond/` has 48 page impressions, but no Black Diamond query row is present in the top 1,000 query export.
- `/cleaning-services-turner-valley/` is crawled but not indexed.
- Parkhill and Stanley Park pages have no page rows or named query rows in this 26-day dataset.

No data-backed merge or deletion decision can be made for these pairs yet. Keep the pages only when service coverage and useful local booking content are real; otherwise decide from operations and content quality, not assumed cannibalization.

## Indexing and crawl findings

Search Console reports 63 indexed URLs and 109 not indexed:

| Status | URLs |
|---|---:|
| Page with redirect | 32 |
| Not found (404) | 11 |
| Alternate page with proper canonical | 3 |
| Discovered, currently not indexed | 45 |
| Crawled, currently not indexed | 18 |

The 45 discovered-but-unindexed URLs are dominated by Edmonton neighbourhood and nearby-town pages. They also include `/about-us/` and `/airbnb-cleaning-services-edmonton/`. The 18 crawled-but-unindexed URLs include Turner Valley, multiple neighbourhood pages and obsolete service/pricing variants. This is strong evidence that Google is not assigning equal value to the scaled local-page inventory.

**Action:** do not mass-expand the local pages. Launch the strongest, operationally valid pages with unique proof and booking information; exclude weak or unsupported pages from the canonical sitemap until they justify indexation. Judge the new site after recrawl rather than validating the old site's coverage issue.

### Important 404 redirect candidates

Search Console still crawls high-intent historical URLs including:

- `/house-cleaning-edmonton/`
- `/maid-service-edmonton/`
- `/duty-cleaners-edmonton/`
- `/professional-maid-service/`
- `/choose-professional-maid-service/`
- `/how-it-works/`
- `/home/`
- an old AMP URL and booking URLs with query parameters

Verify one-hop 301 mappings to the closest relevant new destinations during launch testing. Do not redirect all old URLs indiscriminately to the homepage.

## Sitemap findings

Search Console contains 16 historical sitemap submissions. Seven report success, including duplicate sitemap indexes and duplicate page sitemaps; nine obsolete paths report “Couldn't fetch.”

**Launch action:** expose one canonical HTTPS sitemap index or sitemap on the production host, ensure it contains only canonical indexable URLs, submit that sitemap, and retire obsolete submissions after the replacement is live and verified. Do not submit staging URLs.

## Experience, security and structured data

- Mobile Core Web Vitals: 37 URLs “need improvement,” all for CLS over 0.1; 0 good and 0 poor. This is field data for the old site. Recheck after the new design accumulates sufficient real-user data.
- Desktop Core Web Vitals: insufficient field data.
- HTTPS: 37 HTTPS URLs and 0 non-HTTPS problems in the report.
- Review snippets: 333 valid items and 0 invalid. Valid syntax does not guarantee eligibility or justify self-serving review markup; the new site's schema still needs policy review.
- Manual actions: none detected.
- Security issues: none detected.
- Links report: still “Processing data”; Search Console currently cannot support an authority/backlink conclusion.

## Google generative-AI visibility

The beta AI-features report shows 1,148 impressions across 49 pages for 2026-08-23 through 2026-09-17. Leading pages include:

| Page | AI-feature impressions |
|---|---:|
| `/` | 409 |
| `/move-out-cleaning-edmonton/` | 300 |
| `/cleaning-services-calgary/` | 87 |
| `/8060/how-often-should-a-cleaning-service-clean-my-house/` | 80 |
| `/8081/the-top-5-must-have-cleaning-products-for-a-spotless-home/` | 78 |
| `/move-out-cleaning-calgary/` | 64 |

This establishes AI-feature visibility, not citations, leads or bookings. Preserve factual, extractable service scope, prices/assumptions, local proof, authorship and update dates on the replacement site.

## Recommended order

1. Preserve and test redirects for the high-intent legacy 404s.
2. Consolidate Edmonton move-out intent on `/move-out-cleaning-edmonton/`.
3. Consolidate Edmonton commercial/office intent on `/commercial-cleaning/`.
4. Consolidate Edmonton post-construction intent on `/post-construction-cleaning/` after scope approval.
5. Keep Calgary broad residential routing intact.
6. Keep town pages only where service coverage and useful local information are real; do not merge Black Diamond/Turner Valley or Parkhill/Stanley Park on this evidence alone.
7. Launch one clean canonical sitemap and remove historical sitemap clutter after verification.
8. Re-run the same joined query-page audit 28 and 90 days after the production migration.
