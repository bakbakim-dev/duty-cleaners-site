# Polish round + honest status on the site-wide batch

Four small fixes are real and confirmed in code. Most of the "site-wide fixes batch" is already shipped — I verified each item rather than re-doing it. What genuinely remains is listed at the end.

## 1. Stale handoff copy

The details screen already collects entry, condition and parking, then the line under the CTA still says they have three more questions coming.

Change to: "Pick your time, add your address & card — about 90 seconds." The Deep Cleaning sentence that follows stays as-is.

## 2. Desktop floating CTA pair

This is not the mobile bar (that one is correctly hidden above 768px). It's a separate floating pair on the two city homepages, shown from 768px up, which lands bottom-centre over the card links. Restrict it to tablet only so it disappears at 1024px and above.

## 3. Bedroom chip caption

The chips currently squeeze the sqft cap into a tiny sub-label inside each chip. Instead, show one caption under the selected chip row: "2 Bedrooms · under 1,100 sqft", pulled from the same option label so no number is invented. Same treatment for bathrooms is not needed — only bedrooms carry the size cap.

## 4. Cleanliness reframe

Replace the 1-5 numeric scale with temporal chips, mapping to the same `dc_clean` values:

```text
When was it last properly cleaned?
Within 2 weeks (1) · A few weeks (2) · A few months (3) · 6+ months or never (4) · Never professionally (5)
```

Nothing changes in the handoff URL, validation, or the summary line other than its wording.

## Status of the earlier site-wide batch

Verified already done — no work proposed:

- **Per-page titles/descriptions**: every page component emits a Helmet title, including the six city service pages (via the shared service template) and all ~165 neighbourhood pages (via the location template). The only file without one is the unused blank-app placeholder, which isn't routed.
- **FAQPage schema on /faq**: present, generated from the rendered question list.
- **Alt text**: zero `<img>` tags site-wide are missing `alt`.
- **Airbnb pages**: already call-only — no quote-funnel CTA on either page.

Still outstanding, proposed here:

- **Airbnb callback path**: both pages give a phone number and nothing else. Add a secondary "Request a callback" link to the contact page (with the service pre-selected) so after-hours visitors aren't lost. Phone stays the primary CTA.
- **Review-count constant**: `googleRating` / `googleReviewCount` are still `null`, so every rating line falls back to "Five-Star Rated". I can wire real figures the moment you give them — otherwise nothing changes here, and I will not invent numbers.
- **Price source of truth**: the pricing pages and the city pricing table hold hardcoded strings ("$155", "Starting at $242") that are typed by hand rather than derived from `src/data/pricing.ts`. Proposed: derive each row from the pricing module, label one-time rows "from $X", and add a test that fails the build if a displayed price drifts from the BookingKoala snapshot.

## Technical notes

- Items 1, 3, 4 are all in `src/components/quote/QuoteFlow.tsx`; item 4 only re-labels `DC_CLEANLINESS_OPTIONS`, leaving `dc_clean` encoding in `src/lib/booking-redirect.ts` untouched.
- Item 2 is a class change on the floating `aside` in `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx` (`md:flex` → `md:flex lg:hidden`).
- Price derivation touches `src/pages/EdmontonPricing.tsx`, `src/pages/CalgaryPricing.tsx` and `src/components/CityPricingTable.tsx`, reading through the existing `SERVICES` / option helpers; assertion added as a vitest spec next to `booking-redirect.test.ts`.

## One question

Do you want the price-derivation work in this round, or should I ship the four polish fixes plus the Airbnb callback link first and treat pricing as its own pass?
