# Full-site conversion, UX and psychology audit

I walked the live site top to bottom — homepage desktop and mobile, the four-step funnel, service, reviews, FAQ, contact, gift cards, and the location pages — plus a code-level pass. The funnel itself is genuinely strong now. The problem is that most of the site does not feed it, and a few defects quietly break the promise the buttons make.

## What is working

- Hero puts Step 1 of the funnel on screen immediately. That is the right psychology: a small first commitment beats a "Get a quote" button.
- Risk reversal is present at the exact moments of doubt (won't be charged today, free reschedule, no contracts, re-clean guarantee).
- Price honesty is excellent — GST shown, recurring price shown, no fake countdowns or invented review counts.
- Accessibility work (labels, fieldsets, tap targets, focus states) is well above local-competitor standard.

## The five real problems

### 1. The biggest leak: 151 buttons that say "See My Instant Price" go to a contact form

Every location page, most service pages, and several secondary pages render a "See My Instant Price" button that links to `/contact`. The visitor is promised a price and gets a message box. This is the single highest-value fix on the site: it converts dozens of long-tail SEO landing pages from dead ends into funnel entrances.

Fix: point every one of those CTAs at the quote funnel (`#quote`), which already opens the overlay from any page.

### 2. Calgary service pages wear Edmonton's phone number

`ServiceDetailPage` never receives a city, so the header on every Calgary deep-clean / regular / recurring page shows the Edmonton number while the page body shows Calgary. That is a trust break on exactly the pages meant to convert Calgary traffic.

### 3. The proof slots are empty

`RecentActivityStrip` and `CityRecentCleans` sit at the two highest-impact trust moments on both homepages — and both render nothing, because the review arrays are intentionally empty pending real reviews. Meanwhile `/reviews` shows eight hardcoded testimonials and four different volume claims exist across the site (500+, 1,000+, 4,000+, 5,000+). One number, one source.

### 4. Banned copy is still live, and Step 3 contradicts Step 1

- "Typically 2–4 hrs on site" still appears in the price panel. You asked for no time estimates anywhere.
- Step 1 says "Looking for a Deep Cleaning? Choose Standard — the package is added at booking," while Step 3 sells Deep Cleaning as a $119.99 add-on tile. Two answers to the same question, 30 seconds apart.
- Frequency is asked on Step 1 and again on Step 3.
- The price appears three times on one screen (hero card, right rail, sticky bar) with slightly different framing.
- Add-on tiles are inconsistent (some inline "Add", some full-width) and some labels come through lowercase from the config ("wipe window blinds (per set)", "sweep only of garage or balcony").

### 5. Dead ends

- Gift Cards: all three primary buttons do nothing. A visitor ready to spend money has no path.
- FAQ: 450 lines of objection handling with no CTA until the very bottom.
- Contact form: no visible backend call — it shows a success toast on a timer.
- Mobile homepage is 24,500px tall and the funnel card sits below a full screen of hero copy.

## Proposed work, in order

### Phase 1 — Stop the leaks (highest revenue impact)

1. Rewrite all 151 `/contact` "See My Instant Price" CTAs to `#quote` (script-driven, one pass, verified by crawl).
2. Pass the correct `city` to `Navigation` in `ServiceDetailPage`.
3. Wire the three Gift Cards buttons to a real destination.
4. Remove "Typically 2–4 hrs on site" from `PricePanel` and drop the `hours` field usage from `pricing.ts`.

### Phase 2 — Fix the funnel contradictions

5. Resolve Deep Cleaning: keep it as one mechanism only — a Step 1 service choice — and remove or relabel the Step 3 tile so the two screens never disagree.
6. Remove the duplicate frequency question from Step 1 (keep it on Step 3 where the price visibly moves — that is where the discount lands emotionally).
7. Collapse the triple price display to one hero number plus the sticky bar; the right rail becomes a compact summary.
8. Normalize add-on tiles: identical card shape, title-cased labels, consistent "Add" control, and collapse categories beyond the top two behind "More add-ons".

### Phase 3 — Proof and consistency

9. Single source of truth for volume/rating claims in `proof.ts`; every page reads from it. Pick one homes-cleaned number per city.
10. Move the `/reviews` testimonials into `reviews.ts` so the homepage strips render real content instead of blank space.
11. Add a mid-page CTA to FAQ and a short "still deciding?" answer block.

### Phase 4 — Mobile and pace

12. Tighten the mobile hero so the first funnel question is visible on load (shorter headline block, trust chips condensed to one line, no duplicate "no phone call needed").
13. Trim homepage length: merge the two checklist sections and cap gallery items on mobile.

## Technical notes

- CTA rewrite is a codemod across `src/pages/locations/*`, `src/pages/services/*` and shared templates; `use-quote-overlay` already intercepts any `#quote` anchor sitewide, so no per-page wiring is needed.
- `ServiceDetailPage.tsx:207` needs the existing `city` prop threaded into `<Navigation city={...} />`.
- `PricePanel.tsx:110` is the only render of `quote.hours`.
- Add-on shelf and Deep Cleaning tile logic live in `QuoteFlow.tsx` (shelf ~1498-1674) and `bk-extras.ts`.
- Contact form backend status needs confirming before I claim it works; if it is a stub I will wire it to the same relay the funnel uses.

## Questions for you

- Real Google review text and the correct homes-cleaned numbers: can you supply them, or should I keep the slots hidden until you do?
- Gift cards: should the buttons open the funnel, go to a checkout, or start a callback request?
