# Site-wide conversion, UX and psychology audit — round 4

I walked the live site again (desktop 1280 and mobile 390), read the funnel code path end to end, and checked what earlier rounds left behind. The funnel mechanics are now genuinely good. What is left is **proof, promise-keeping, and pace** — and one silent bug that throws away real leads.

Current measurements: homepage is 14,727px on desktop and **23,946px on mobile** (Calgary 25,031px). Every page has exactly one H1 and every image has alt text — that part is clean.

## The seven things actually costing you money

### 1. A silent lead-dropping bug (fix first, this is revenue on the floor)

`QuoteFlow.tsx:577-582`: the spam guard treats any submission completed faster than the fill-time floor as a bot. It then **advances the visitor to the price screen without ever sending the lead**. A decisive, fast-typing visitor sees a price, believes they are in your pipeline, and no record reaches your CRM. The honeypot alone catches bots; a time floor punishes your best-intent traffic.

Fix: keep the honeypot as a hard block, drop the time floor as a block. If the timing looks fast, still submit the lead and flag it in the payload so your office can sort it, rather than discarding it.

### 2. Zero social proof on your two most important pages

`reviews.ts:31,33` — both city review arrays are empty. Because both components bail on an empty array (`RecentActivityStrip.tsx:14`, `CityRecentCleans.tsx:103`), the homepage renders **no reviews at all**, at exactly the two moments the code comments call "momentum before persuasion". Meanwhile `/reviews` carries eight named testimonials.

The psychology here is not subtle: for a stranger entering your home, review visibility is the single strongest lever in local services, and burying trust below the fold is the most common failure in the category. You are currently at zero on the pages that matter.

Fix: move the eight existing testimonials into `reviews.ts` so both strips render — **only if those are genuine reviews you can stand behind**. If they are not verifiable, we render a smaller honest block ("Five-Star Rated on Google — read them") instead of blank space, which is still better than nothing.

### 3. Your structured data claims 200 reviews you don't show

`Calgary2.tsx:142-146` publishes `aggregateRating 4.9 / 200 reviews` while the page displays none, and Edmonton publishes no rating at all. Inconsistent between cities, unsupported on-page, and exposed to manual-action risk. Also `openingHours: "Mo-Sa 08:00-18:00"` on `Calgary2.tsx:141`, `Edmonton2.tsx:149` and `EdmontonMoveInOut.tsx:113` contradicts your real hours (Mon-Sat 8-8, Sun 9-3) already correct in `location-schema.ts:57`.

Fix: remove the unsupported `aggregateRating` (or restore it once real counts exist), and point all three pages at the correct hours.

### 4. "Instant price" is not instant — the promise breaks mid-funnel

Every CTA on the site says **See My Instant Price**. Step 2 then says "Your price is ready — we show it on the next screen" and demands name, email and phone before revealing it. That gap between promise and delivery is where trust drains and abandonment spikes.

Two honest options, pick one:
- **Keep the gate**, but change the promise at the moment of the ask: label Step 2 as the last step before the number, show a range or "from $X" so value precedes cost of entry, and make the button say "Show my price".
- **Drop the gate**: show the price, then ask for details to hold the booking. Higher price-screen views, fewer captured emails.

### 5. Mobile is a 24,000px scroll and the hero buries the funnel

On a 390px screen the first funnel question sits below the fold behind the city switcher, eyebrow, three-line headline, subhead, rating line and a call link — and the sticky bar already offers "Call" plus "See My Instant Price", so the in-hero call link is a third redundant option. "Bonded and insured" appears three times within the first two screens (eyebrow, chip, trust bar).

Fix: on mobile, collapse the eyebrow and the duplicate call link, cut the trust chips to the rating line only, and let the Step 1 card start on screen. Then trim the tail: 14 sections per city page, with five of them (Service Areas, Who We Help, Mission & Values, cross-link, Get In Touch) sitting **after** the quote form. Merge or drop the weakest two.

### 6. The Step 1 card wastes its most valuable line

Inside the hero card, a four-line paragraph about Airbnb and commercial pricing sits between the service choices and the Continue button. It speaks to a small minority and it is the last thing every visitor reads before the primary action. Move it below the button as one quiet line.

### 7. Nine money pages have no title, description or canonical

`AboutUs`, `Reviews`, `WhatsIncluded`, `EdmontonServices`, `CalgaryServices`, `AirbnbCleaningEdmonton`, `AirbnbCleaningCalgary`, `WallWashingEdmonton`, `WallWashingCalgary` — all rendered without `<Helmet>`, so they inherit the generic index.html metadata. Several are linked directly from the primary nav. Mobile menu also has no primary CTA inside it and orders items differently from desktop.

## Proposed order of work

**Phase 1 — stop losing leads and trust (same day)**
1. Fix the fast-fill lead drop in `QuoteFlow.tsx`.
2. Populate `reviews.ts` so both homepage proof slots render (pending your answer on review authenticity).
3. Remove the unsupported Calgary `aggregateRating`; correct opening hours on all three schema blocks.

**Phase 2 — keep the promise**
4. Resolve the instant-price contradiction using whichever option you choose in #4.
5. Add a "from $X" reassurance line at the Step 2 ask.

**Phase 3 — mobile pace**
6. Tighten the mobile hero so Step 1 is visible on load; remove duplicate call and trust claims.
7. Move the Airbnb/commercial note below the Continue button.
8. Merge the post-funnel tail from five sections to three.

**Phase 4 — findability**
9. Add `<Helmet>` (title, description, canonical) to the nine pages missing it.
10. Give the mobile menu a primary CTA and match desktop ordering.

## Technical notes

- Lead fix: `QuoteFlow.tsx:577-582` — keep `honeypot` as the block, convert `tooFast` into a payload flag passed through `submitQuote`.
- Proof: `src/data/reviews.ts` exports `EDMONTON_REVIEWS` / `CALGARY_REVIEWS`; both consumers already handle any array length.
- Schema: `Calgary2.tsx:138-146`, `Edmonton2.tsx:149`, `EdmontonMoveInOut.tsx:113`; canonical hours already live in `src/lib/location-schema.ts:57`.
- Hero: `CityConversionIntro.tsx:156-206` (eyebrow, chips, call link) and `251-268` (Airbnb paragraph).
- Metadata: follow the existing `ServiceDetailPage.tsx:201-206` Helmet pattern.

## Two decisions I need from you

1. **Reviews** — are the eight testimonials on `/reviews` real Google reviews we can publish on the homepage? If yes I move them into `reviews.ts` today. If no, I ship the honest fallback.
2. **Instant price** — keep the contact gate with a softened promise, or show the price first and ask for details after?
