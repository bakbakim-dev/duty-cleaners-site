# Homepage Conversion Sharpening (Edmonton `/`)

Goal: make the first 15 seconds answer "do you serve me, can I trust you, what will it cost, what happens next" — without adding generic marketing copy.

## Phase 1 — Above the fold (highest impact)

1. **CTA wording**: primary button becomes "See My Instant Price", with "No phone call required — transparent pricing before you book" directly beneath. Applies to the hero and the final CTA. Buttons keep opening the existing full-screen quote overlay.
2. **Proof beside the CTA**: a compact row with Google star rating + "Five-Star Rated on Google" linking to the live listing (using the existing verified Google listing links). Per your review-count policy, no numeric review count is shown unless you want live counts pulled from the Google sync.
3. **City clarity**: a small "Edmonton | Calgary" city switcher chip under the hero eyebrow, so Calgary visitors self-select instantly. Announcement bar copy becomes "Locally trusted home cleaning in Edmonton and Calgary".
4. **Guarantee clarity**: replace "24-hour guarantee" phrasing with "If we missed something, tell us within 24 hours and we'll re-clean it at no extra charge" (matches the stated policy).
5. **Hero hierarchy**: single gold italic accent phrase in the H1 only; supporting line rewritten to "Choose your service, see an upfront price in about 60 seconds, and book vetted professionals on your schedule."
6. **Secondary CTA**: phone icon + "Prefer to talk? Call ..." kept visually subordinate to the primary CTA.

## Phase 2 — Header simplification

Desktop header keeps: logo, Services, Pricing, Locations, About, click-to-call, one primary button. Careers and Blog move into a "More" dropdown (still crawlable, still in the footer). Mobile menu keeps all items grouped.

## Phase 3 — Page flow below the hero

Reorder the existing homepage sections into decision order, reusing current components rather than building new ones:

```text
Hero  ->  Proof strip  ->  Choose your cleaning (4 service cards)
      ->  How it works (3 steps)  ->  Local reviews (Fresh from Google)
      ->  What's included  ->  Price confidence  ->  Guarantee + FAQs
      ->  Service areas  ->  Final CTA
```

- Service cards: Recurring, Deep, Move-in/out, Commercial — each gets a one-line fit statement and its own CTA ("Price a deep clean").
- Price confidence module moves ahead of the long pricing detail; no promise of a locked price before work begins.
- Consolidate duplicated "why choose us" blocks into objection-led FAQs (supplies, do I need to be home, what's included, vetting, rescheduling).

## Phase 4 — Mobile + hygiene

- Sticky bottom bar: "Get price" (opens quote overlay) + true tap-to-call; keeps yielding while the quote section is on screen.
- Enforce 44px minimum tap targets; increase announcement bar and top-nav font size on small screens.
- One H1, descriptive H2s; FAQ schema only for visible Q&A; fix typos and repeated benefit statements found in the copy pass.

## Technical notes

- Hero/CTA changes live in `src/components/CityConversionIntro.tsx` and are shared by `/` (Edmonton) and `/calgary-2`, so Calgary gets a genuinely Calgary-worded variant, not a name swap.
- Header changes in `src/components/Navigation.tsx` and `src/components/AnnouncementBar.tsx`.
- Section reorder is JSX reordering inside `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx`; no new pages, no routing changes.
- Reviews link through the existing `src/lib/google-listings.ts` helpers (top-level navigation escape already handled).

## Out of scope unless you say otherwise

Analytics event wiring for CTA clicks / quote starts / call clicks, and any A/B test infrastructure.
