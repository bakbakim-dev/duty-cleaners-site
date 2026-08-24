# Simply Maid SEO Analysis + Adoption Plan

I crawled Simply Maid's homepage, sitemaps, robots.txt, llms.txt, and 8 representative page types (city, suburb, service, pricing, blog article, cleaner directory, help), then compared against Semrush ranking data (AU database) and our current codebase.

## What they do right (with evidence)

**1. AI-search optimization (the newest best practice)**
- `robots.txt` explicitly manages ~30 AI crawlers: allows answer/assistant bots (GPTBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, MistralAI, DuckAssist) and blocks training-only scrapers (CCBot, Bytespider, Amazonbot, meta-externalagent).
- Ships `/llms.txt` AND `/llms-full.txt` — structured markdown with Key Facts, full pricing table, service descriptions, and location coverage written for LLM consumption.
- We have a basic 36-line `llms.txt` and no AI-crawler rules.

**2. Sitemap architecture**
- A sitemap *index* splitting 3,885 URLs into 7 child sitemaps by section (main, locations, cleaning-101, help, cleaners, cleans, customers) — lets Google prioritize sections and makes index-coverage debugging per-section possible.
- Ours: one flat static `sitemap.xml` (208 URLs).

**3. Programmatic location SEO**
- 3,415 location pages in 3 levels (`/sydney` → `/sydney/inner-west` → `/sydney/inner-west/abbotsford`), each ~3,200 words with genuinely localized copy (housing stock, suburb character: "heritage terraces", "harbour living").
- Titles are keyword-first and 52–60 chars: `#1 Rated House Cleaning in Abbotsford, Sydney | Simply Maid`.
- Every page carries ~100 unique internal links (nav + content + footer).

**4. Stacked schema per page type**
- Baseline everywhere: Organization + WebSite + WebPage + BreadcrumbList.
- City/suburb: dual-typed `["LocalBusiness","HouseCleaning"]` with full NAP, geo, `openingHoursSpecification`, `hasMap`, Google Place ID, `sameAs`, plus 3× Service schemas + ItemList.
- Service pages: Product w/ offers · Pricing: OfferCatalog · Blog: Article + HowTo · Directory: CollectionPage · Homepage: FAQPage + VideoObject.
- Ours: LocalBusiness on location pages (with a self-serving `aggregateRating` Google ignores — and its `reviewCount: 100` violates our no-review-counts rule), FAQPage on the FAQ page. Missing: Service, Article/HowTo, OfferCatalog, BreadcrumbList JSON-LD (our Breadcrumbs component is visual only).

**5. Fine-grained SERP robots meta**
- Every page: `index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1` — unlocks large image previews and full snippets. We have none.

**6. Content hubs earning top-of-funnel rankings**
- 227 "Cleaning 101" articles (Article+HowTo schema) ranking for how-to queries (hardwood floors, pet hair), an 87-page help center, and a glossary. Semrush: ~2,239 keywords, #1 "house maid", #4 "house cleaning" (Canberra), #8 "professional cleaning service" (Melbourne).

## What we'll adopt now

**A. AI-search optimization**
1. `public/robots.txt`: add AI-crawler rules — allow assistant/search bots (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended, MistralAI-User, DuckAssistBot), block training-only crawlers (CCBot, Bytespider, Amazonbot, meta-externalagent). Keep existing bot blocks and the Sitemap line.
2. Expand `public/llms.txt` to the proven format: Key Facts (4,000+ Edmonton homes, 1,000+ Calgary homes, bonded & insured, 10+ years, 60-second quote), Pricing (real hourly + flat rates), Services with descriptions, Locations with neighbourhood counts.
3. Create `public/llms-full.txt` — expanded per-city, per-service detail mirroring the site.

**B. SERP display controls**
4. Add `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">` to `index.html` (applies site-wide; per-page Helmet can still override).

**C. Sitemap index**
5. Replace the flat `public/sitemap.xml` with a sitemap index + 4 static child sitemaps: `sitemap-main.xml`, `sitemap-edmonton-locations.xml`, `sitemap-calgary-locations.xml`, `sitemap-blog.xml`. No `<lastmod>` (we have no authoritative per-page timestamps). robots.txt Sitemap line stays pointed at the index.

**D. Schema upgrades**
6. New shared `LocationJsonLd` component: dual type `["LocalBusiness","HouseCleaning"]`, full NAP, geo, `openingHoursSpecification` (Mon–Sat 8:00–20:00, Sun 9:00–15:00), `hasMap`/`sameAs` Google Maps links. Roll out via codemod across the 136 location files with inline schema + `LocationPageTemplate` (13 more); **remove the self-serving `aggregateRating`** (ignored by Google, violates our review-count rule).
7. Service schema on the 12 service detail pages (via `ServiceDetailPage`).
8. Article + HowTo schema on the 5 blog posts.
9. OfferCatalog schema on both pricing pages.
10. BreadcrumbList JSON-LD emitted by the existing `Breadcrumbs` component.

**E. Copy/localization (sample of the bigger play)**
11. Enrich the "About cleaning in {neighbourhood}" section on our highest-priority neighbourhood pages with housing-stock-specific copy (their "heritage terraces" pattern) — start with the custom standalone pages already marked high-priority.

## What we're deliberately not copying

- **3,415 programmatic suburb pages / 3-level hierarchy** — we have 165 neighbourhood pages; deepening their copy (item 11) beats multiplying thin pages at our scale.
- **227-post blog, help center, glossary** — real ranking assets, but a separate content effort; can be scoped later.
- Their service pages are only ~850 words — ours are already deeper. No change.

## Technical details

- Domain convention stays `https://dutycleaners.ca` (matches existing canonicals/sitemap/robots).
- Codemod approach for item 6: the 136 inline blocks share one shape; a scripted regex swap to `<LocationJsonLd ... />` keeps this to one reviewable pass instead of 136 hand edits.
- All schema validated with JSON.parse during build; no new dependencies.
- Copy rules respected: "Five-Star Rated" (no review counts), non-toxic terminology, vetting language, operational hours from memory.
