# Duty Cleaners — Full Local SEO Audit & Fix Report

**Date:** August 23, 2026 · **Scope:** entire site (209 routes), Manus audit verification, 2026 local-SEO research, implemented fixes.
**Method:** two parallel audits — a file-level inventory of all 209 routes, and a source-verified research pass on the mid-2026 local SEO landscape — plus live no-JS crawl testing.

---

## 1. Verdict on the Manus audit

| Manus claim | Verdict |
|---|---|
| "No robots.txt or sitemap exists" — P0 | **Wrong.** `public/robots.txt` (856 B, per-crawler AI policy + Sitemap directive) and a sitemap **index + 4 child sitemaps** (204 URLs, auto-generated from the router on every build, zero drift) both exist. Manus almost certainly audited the noindexed staging preview, where these are deliberately stripped. |
| "H1 is 'A cleaner home, made simple'" | **Wrong.** The real H1 is "House cleaning in Edmonton, made simple." — already city+service specific. Manus misread a footer `<h2>`. |
| "LocalBusiness schema lacks hours" | **Wrong as stated.** Hours present on every node; the two city pages used shorthand instead of `openingHoursSpecification` (now fixed). |
| "FAQ text not mirrored in page HTML" | **Half right — their sharpest observation.** Questions were in the DOM; *answers* were conditionally mounted and absent until clicked (now fixed). |
| FAQ rich results deprecated May 7, 2026 | **Confirmed** against Google's changelog. Markup kept (harmless); visible Q&A is what matters now. |
| "@id/sameAs/areaServed are Google-recommended" | **Overstated.** Not in Google's LocalBusiness doc at all — harmless entity-disambiguation extras. The actually-recommended set is `geo`, `telephone`, `url`, `openingHoursSpecification`, `priceRange`, `image`. |

Manus's structural instinct (validate rendered SEO; entity completeness) was right; most of its specific facts were not.

## 2. What my audit found that Manus missed (22 defects — the big ones)

- **Cross-domain canonical leak:** `/locations` canonicalized to `dutycleaners-clone-project.lovable.app` — actively donating the hub page's signals to a staging host.
- **Zero `og:image`/`twitter:image` site-wide** despite ~96 pages declaring `summary_large_image` — every social/AI share card rendered imageless.
- **Client-side rendering ceiling:** raw served HTML was ~381 bytes of text, no H1, generic head on all 209 routes. Google renders JS; the AI fetchers behind ChatGPT/Perplexity and social scrapers largely don't — and 45% of consumers now use AI for local recommendations (BrightLocal 2026).
- `/gift-card` vs `/gift-cards` duplicate pair with contradictory sitemap/link/canonical treatment.
- Flagship city pages had the *weakest* LocalBusiness markup on the site (all 178 neighbourhood pages were richer); Calgary schema had no street address while one is published on the Contact section; Calgary `priceRange` contradicted the pricing engine.
- Six service pages rendered FAQs with no FAQPage markup; two pages emitted duplicate BreadcrumbList; blog Article schema is rich-result-ineligible (no image/dates); nav links pointed through redirect routes; llms.txt linked Calgary to a redirect URL; NAP display formats inconsistent between cities.

## 3. Implemented today (all verified in prerendered output)

**Structural**
1. **Build-time prerendering** (`site/scripts/prerender.mjs`, `bun run prerender` / `prerender:all`): all 40 core routes (main + blog) now ship real static HTML — correct per-route title, meta, canonical, H1, full body (~2,100+ words on city pages), and 3–4 JSON-LD blocks — to *every* crawler, JS or not. Location pages still render client-side (run `--all` before go-live if desired). Deploy script updated: prerenders on every publish, noindexes all 41 HTML files on staging, keeps the pristine SPA shell as the 404 fallback.
2. **Social cards:** branded 1200×630 `og-image.jpg` + square `logo.png` generated and wired into the static head (`og:image` + dimensions + alt + `twitter:image`) — visible to non-JS scrapers on every route.

**Entity/schema**
3. City pages upgraded to full LocalBusiness entities: `@id` (`/#edmonton`, `/#calgary`), typed `["LocalBusiness","HouseCleaning"]`, `parentOrganization` → new `Organization` `@id` node (now with logo, image, phone, GBP `sameAs`), `openingHoursSpecification`, `hasMap` + `sameAs` (real GBP CID permalinks), `areaServed` (real served communities), `image`/`logo`, Calgary street address added, Calgary priceRange corrected to `$155–$519`. **No aggregateRating — self-serving review markup violates Google policy.**
4. FAQ answers now always in the DOM (hidden until opened) on both city pages + all service pages — schema/content parity restored. FAQPage markup added to the 6 service pages.
5. Duplicate BreadcrumbList removed (GiftCard, Prepare); LewisEstates double-Helmet removed.

**Hygiene**
6. `/locations` canonical → `dutycleaners.ca`; `/gift-cards` canonicalized onto the linked `/gift-card`; nav + cross-links no longer route through `/edmonton` redirect; `/prepare` added to sitemap; llms.txt Calgary link fixed; footer phone formats unified.

## 4. What matters most in 2026 (research highlights, sourced in-session)

- Local pack weights (Whitespark 2026): **Reviews ~20%**, Behavioral ~18%, GBP ~17%, Citations ~13%↓, Links ~12%, On-page ~11%. **Review velocity + fast owner replies is the single biggest lever** — and it's off-site.
- **AI local packs** show only 1–2 businesses (~32% of the businesses traditional packs surface); AI Overviews appear on 40–68% of local queries; Local Services Ads now on 31% of tracked queries.
- **GBP Q&A is dead** (API killed Nov 2025; replaced by Gemini "Ask Maps" which synthesizes from your site + reviews) — on-site Q&A content is the replacement tactic. Our FAQ-parity fix feeds exactly this.
- **AI citations are ~77% off-page:** Yelp (~33% of local LLM answers), Reddit, curated "best of [city]" lists. "Mentions are the new link."
- **llms.txt: near-zero consumption** by any major AI crawler (500M-visit log studies) — ours stays, but expect nothing from it.
- CWV thresholds unchanged (LCP 2.5s / INP 200ms / CLS 0.1) and a minor local factor — passing is sufficient.

## 5. Remaining recommendations (not implementable from the repo)

**Owner / go-live checklist**
1. Search Console: submit sitemap, URL-inspect `/` and `/calgary`, verify rendered HTML + JSON-LD post-launch.
2. **Claim Bing Places** (feeds Copilot/ChatGPT) and **Apple Business Connect** (Maps/Siri/Apple Intelligence) — 2026 table stakes, free, underused by competitors.
3. Review engine: steady ask-cadence on both GBP profiles + reply to every review quickly and non-generically (reviews = ~20% of pack weight; 97% of consumers read them).
4. Pursue placement on curated "best cleaners in Edmonton/Calgary" lists and keep Yelp complete — the #1 and #5 AI-visibility factors.
5. Supply verified data to finish schema: Edmonton office lat/long (5+ decimals), Calgary postal code + lat/long, real publish dates + hero images for the 5 blog posts (Article schema is rich-result-ineligible without them).
6. Consider `prerender:all` at go-live so all 204 URLs ship static HTML (adds ~10–15 min to the build).
7. Backfill `geo` on the 111 location pages missing it — data task, needs verified coordinates.

**Deliberately NOT done:** aggregateRating markup (policy violation), keyword-expanding the homepage (against Google's people-first guidance and the page already ranks its intent), removing FAQPage markup (harmless), mass-editing 184 phone-format instances outside the Footer (cosmetic, wide diff).

---

## 6. URL preservation plan — IMPLEMENTED (Aug 23, 2026)

**Why:** GSC (May 2025–Aug 2026) showed **120 of 131 earning URLs had no matching route** in the rebuild — 1.94M impressions (67%) and 4,420 clicks (46%) at risk. Google states 301s don't lose PageRank, but a changed URL still forces re-evaluation; industry data shows botched migrations lose 30–60% for 6–12 months. The zero-risk option for a URL is not changing it.

**Strategy — hybrid, driven by `src/data/legacy-urls.ts` (single source of truth):**

| Tier | Count | Impressions | Treatment |
|---|---|---|---|
| **Preserve** | 27 | **1,598,934 (83%)** | Old URL is served *and* canonical. No redirect, no re-evaluation. |
| **Redirect** | 86 | 340,177 | 301 → canonical successor. |

Preserved URLs are also better keyword matches than the modern slugs (`/cleaning-services-calgary` vs `/calgary`; `/move-out-cleaning-edmonton` — pos 4.5, 280 clicks — vs `/edmonton/move-in-move-out-cleaning`).

**What was built**
1. `src/data/legacy-urls.ts` — the map plus `canonicalForPath()` / `canonicalUrlForPath()` resolvers.
2. `App.tsx` — 27 preserve routes (render the successor's component at the legacy path) + 86 `<Navigate>` redirects.
3. **Canonical consolidation** — both the legacy and modern path resolve to ONE canonical (the legacy URL). Patched in `LocationPageTemplate`, `ServiceDetailPage`, 15 standalone pages, and 12 location pages.
4. **Sitemap** now advertises the preserved URL and omits the superseded modern duplicate (verified: `/cleaning-services-calgary` in, `/calgary` out).
5. **Server-side 301s** generated for any host: `public/_redirects` (Netlify/Cloudflare), `legacy-redirects.htaccess`, `.vercel.json`, `.nginx.conf`.
6. `URL-MIGRATION-MAP.csv` — full 113-row audit table.

**Verified:** 27/27 preserved URLs prerender with real content and a self-canonical; no redirect chains, no dead targets, no route collisions; typecheck + build clean; confirmed live (e.g. `/cleaning-services-calgary` → 2,717 words, correct title/canonical, no JS required).

**Still owner-side:** the production host must serve the generated 301 file (the SPA `<Navigate>` routes are a client-side safety net, not real 301s), The content gap is now **closed** — see 6c.

### 6b. Trailing-slash canonicalisation — the rule that mattered most

**Credit where due:** a second audit caught what both my analysis and the first one missed. My URL-diff normalised trailing slashes away in its very first step (`url.rstrip('/')`), which hid the finding completely.

**The finding, verified:**
- **122 of 131 indexed URLs carry a trailing slash — 2,219,425 impressions, 4,541 clicks.** The 8 slash-less rows are junk (wp-content images, `/#!`) totalling **9 impressions**.
- Live `dutycleaners.ca` is trailing-slash canonical and enforces it: `/about-us` → **301** → `/about-us/`. Standard WordPress behaviour.
- The rebuild canonicalised to the slash-*less* form and its sitemap contained **zero** trailing-slash URLs.

So launching as-built would have changed the URL of **every indexed page** — including pages whose content and slug never changed (`/about-us/`, `/reviews/`, `/whats-included/`). By the same logic that drove URL preservation, the fix is to match what is indexed.

**Implemented:**
1. `withTrailingSlash()` in `src/data/legacy-urls.ts`; `canonicalUrlForPath()` now emits the slash form.
2. Trailing slash applied to **281 canonical/og:url tags across 186 files**.
3. Sitemap regenerated — **205/205 URLs** now slash-form.
4. Host configs rewritten: legacy 301s target the slash form, and slash-normalisation is delegated to the host (`netlify.toml`, `trailingSlash: true` for Vercel, mod_rewrite/nginx rules). A catch-all `_redirects` rule was deliberately **not** used — it matches the slash form too and loops.
5. `/gift-card` (5,106 impressions, linked, canonical) removed from the sitemap exclusion list.

**Final coverage of all GSC-earning impressions:**

| Outcome | Impressions | Share |
|---|---|---|
| Served directly at its own unchanged URL | **2,551,363** | **88.1%** |
| Handled by a single 301 | 340,177 | 11.7% |
| Unhandled | 5,639 | 0.2% (dead wp-content images + canonical duplicates) |

Verified live: `/cleaning-services-calgary/`, `/move-out-cleaning-edmonton/`, `/contact-us/`, `/about-us/`, `/faqs/` all self-canonical in slash form.


### 6c. Cleaning-products post — WRITTEN (Aug 23, 2026)

The one genuine content loss in the migration is closed. `/8081/the-top-5-must-have-cleaning-products-for-a-spotless-home/` earned **73,104 impressions / 281 clicks** — the old site's highest-clicking blog post — and had no successor.

**New post:** `src/pages/BlogCleaningProducts.tsx`, ~1,700 words, served at the **preserved legacy URL** `/the-top-5-must-have-cleaning-products-for-a-spotless-home/` (canonical), with `/blog/cleaning-products` as a modern alias. The numeric `/8081/` URL now 301s here instead of to `/blog`.

**Written against the query cluster it actually earned** — 12,058 impressions of pure product intent:
`best cleaning products` (3,638, pos 8.9) · `best all purpose cleaner` (667, pos 7.7) · `top 5 cleaning products` (325) · `must have cleaning supplies` (210) · `best cleaning products for deep cleaning` (288) · plus kitchen/bathroom and Canada-qualified variants. The Canadian variants rank best (pos ~5.3), so Canadian availability and total cost are stated explicitly.

**Structure:** the five products, each with a "what to look for" / "common mistake" pair; a room-by-room mapping; a "what you can stop buying" section; a consolidated shopping list; and 5 FAQs whose answers appear **verbatim in the DOM** (verified 5/5 against the `FAQPage` schema).

`Article` schema carries `image`, `datePublished` and `dateModified` — so unlike the other five posts, this one is rich-result eligible. Blog index updated; sitemap regenerated.

Preserve tier is now **28 URLs / 1,599,360 impressions**.

### 6d. Blog Article schema — all six posts now rich-result eligible (Aug 23, 2026)

Defect #11 in the original audit is closed. Every post now carries `image`, `datePublished`, `dateModified` and `publisher.logo`.

New helper `src/lib/seo.ts` — `absoluteAssetUrl()` turns Vite's hashed asset path into a fully-qualified URL and strips the staging base prefix, so the emitted schema image is correct in both environments. `ARTICLE_AUTHOR` / `ARTICLE_PUBLISHER` supply the publisher node (with logo) that Google requires and that every post was missing.

Two problems found while fixing, neither previously known:
- **`BlogChoosingCleaningCompany` already had an image and dates — all three were wrong.** The image URL was `https://dutycleaners.ca/blog/choosing-cleaning-company-hero.jpg`, a path the site does not serve (no `public/blog/` directory), so the Article was rich-result ineligible despite appearing complete. Its `datePublished: 2024-06-01` / `dateModified: 2026-07-02` also contradicted the "January 27, 2026" shown on the page and in the blog index.
- `mainEntityOfPage` pointed at the modern `/blog/...` URL on every post while the canonical now resolves to the preserved legacy URL. Both now run through `canonicalUrlForPath()` so they agree.

`dateModified` is set equal to `datePublished` rather than to today — the content was not changed, and back-dating a false freshness signal is not worth the risk.

**Verified across all six posts:** image present and the referenced file exists in `dist`; publisher.logo present; and every schema date matches the date visible on the page (6/6).

### 6e. Staging now mirrors production (Aug 23, 2026)

`deploy-preview.ps1` ran the short 54-route `prerender` while `netlify.toml` runs `prerender:all`. With `public/_redirects` ending in `/*  /404.html  404`, that difference meant staging was never exercising the configuration production would actually serve. Aligned:

- Staging now runs `prerender:all` — **207 pages on disk**, the same set Netlify will have.
- Added a guard that aborts the publish if fewer than 150 pages were prerendered, so a silent fall back to the short prerender cannot ship a build whose 404 fallback would swallow real pages.
- `dist/.git` is the Pages remote *and* Vite's `outDir`; a build emptied it and broke a publish. The script now stashes and restores it around the build.
- `spa-shell.html` is a build intermediate and no longer ships; `404.html` (written by prerender, then noindexed) is asserted to exist before publishing.

**Verified live:** 154 `/locations/*` pages prerender with real content (e.g. `/locations/inglewood/` — 1,122 words, one H1); the 13 whose content is superseded by a preserved legacy URL correctly carry a 301 instead (`/locations/windermere/ → /cleaning-services-windermere/`), and that target is prerendered.

Note: GitHub Pages ignores `_redirects`, so on staging those 13 render the SPA shell rather than redirecting. On Netlify they 301. This is the one behaviour staging still cannot reproduce.
