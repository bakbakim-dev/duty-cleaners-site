# Site Audit + Conversion Rebuild Plan

## What I found (top to bottom)

**The funnel itself is strong.** Native pricing, add-on shelf, postal-code logic, guarantee copy and progress rail are all in good shape. The problems are around it.

**1. The homepage asks for the same click 13+ times.** The root page (Edmonton) stacks 17 sections and repeats the primary CTA in the hero, in every one of the 9 pricing-table rows, in the final band, in the floating aside, in the sticky bar and in the footer. Nine identical buttons inside one table split attention and, worse, they send people to a separate pricing page instead of the quote flow that already lives on the same page.

**2. Five different CTA phrasings are live.** "See My Instant Price" (correct), "Get Flat-Rate Quote" (pricing pages), "Get Your Instant Move Out Quote" / "Get Your Custom Quote" (move-in/out), "Get Your Free Cleaning Quote" (blog), "Book Now" (two dead legacy pages). Mixed value props too: instant vs free vs flat-rate vs custom.

**3. Mobile can show two floating CTA bars at once.** Two separate scroll observers hide two separate bars, and they watch different sections — between the pricing and how-it-works sections neither fires, so the nav sticky bar and the homepage floating aside can stack.

**4. Navigation hides money pages.** "About" is a catch-all holding About, Reviews, FAQ, Gift Cards, Careers, Blog and Contact — seven unrelated items, with Reviews (the highest-trust page) buried inside.

**5. Small print on navy.** Secondary copy repeatedly uses white at 60–70% opacity on saturated navy, including the pricing footnote directly under a CTA. Marketing sections also have no line-length cap, unlike the funnel.

**6. Proof is repeated, never escalated.** Star ratings appear five-plus times at the same visual weight, so nothing lands as the credibility moment.

**7. Dead weight.** `src/pages/Edmonton.tsx` and `src/pages/Calgary.tsx` (3,400 lines combined) are unrouted legacy pages still carrying old "Book Now" copy.

## Build plan (in order)

### Priority 0 — Remove time estimates everywhere
- Drop `typically X hrs on site` from the funnel price card; replace with a scope line (e.g. "Flat rate — we stay until the checklist is done").
- Remove the `hours` field usage from `src/data/pricing.ts` consumers, and delete the "duration" column from the Edmonton/Calgary Regular, Deep and Recurring pricing tables.
- Rewrite FAQ answers that quote hour ranges (FAQ page, Calgary/Edmonton pricing pages, Calgary Move-In/Out) so they describe scope and crew size instead of clock time.

### Priority 1 — One action, one phrase
- Standardize every primary CTA site-wide to "See My Instant Price" (mid-funnel buttons stay "Continue").
- Pricing table: remove the 9 per-row buttons, keep one CTA under the table, and point it at the on-page `#quote` flow rather than the pricing page.
- Update pricing pages, move-in/out pages and blog CTAs to the standard phrase.
- Delete the two orphan legacy pages.

### Priority 2 — Mobile CTA sanity
- Collapse the two floating CTA systems into one shared controller so only a single bar can ever appear, hidden whenever the quote flow is on screen.
- Make the pricing table stack into cards on narrow screens instead of horizontal scroll.

### Priority 3 — Navigation
- Split the "About" catch-all: surface Reviews and Pricing as top-level items; group the rest under "Company" (About, Careers, Blog, Gift Cards, Contact).

### Priority 4 — Readability and proof
- Raise secondary text on navy from 60–70% opacity to a defined muted token that clears 4.5:1, and apply a `max-w-[65ch]` measure to marketing body copy.
- Reduce the homepage to one hero proof strip, one full review section, and one short proof line beside the final CTA; remove the redundant repeats.
- Trim the homepage stack by merging the two coverage/service-area blocks and moving the gallery below the quote form.

## Technical notes
- Funnel logic, BookingKoala handoff, extras resolution and postal-code precedence are untouched — this is copy, layout and CTA routing only.
- `hours` stays in the `ServicePricing` type for now but becomes unused by UI; removed in a follow-up if nothing else reads it.
- Existing Vitest suite and Playwright regression scripts run after Priority 0 and Priority 1 to confirm no pricing or handoff regression.
