# Audit Round 2 — Honest Quote Claims, Service Parity, Frequency Default

## 1. Remove the "price before your name" claim (High)

Verified: in the quote flow, contact details are collected at Step 2 and the price is revealed at Step 3. The homepage line "You see the price on screen before you give us your name" is therefore inaccurate.

Replace it, and any sibling copy making the same promise, with accurate language:

- How-it-works subhead: "Answer a few questions and get your personalized quote."
- Step 02 card ("See your price") stays, but its description becomes "A real dollar figure for your home — no waiting, no obligation."
- Sweep the rest of the site for the same claim wording ("before you give us your name", "see the price first") and align it.

No change to when contact is collected — the funnel order stays as built.

## 2. Same service taxonomy in hero and expanded form (High)

The hero picker currently offers Standard, Move In/Move Out, Post-Construction, Office; the expanded form also has Airbnb Turnover.

Fix: the hero's "Specialty cleaning" group exposes all three specialty services — Office Cleaning, Airbnb Turnover, Post-Construction — so the hero and the form share one taxonomy. Core group stays Standard and Move In / Move Out. Specialty renders as a 3-up (stacked on narrow screens) compact row so the Continue button stays reachable on mobile.

## 3. Frequency must be an explicit choice (High)

Verified: the quote form defaults to the "most popular" frequency (Bi-Weekly, 15%), so a visitor can see a recurring price without choosing recurring service.

Fix: default the funnel to One-Time. Bi-Weekly keeps its "Popular" and "Save 15%" cues as an option, not a preselection. The price shown before any frequency interaction is the one-time price.

## 4. Reconcile "Step 1 of 4" with "Three steps" (High)

Keep the four-stage progress (the fourth stage is scheduling on the booking page) and fix the content section instead:

- Section heading becomes "How booking works".
- Add a fourth step card: "04 — Confirm your booking: pick your time and address on our secure booking page."

## 5. Calgary hero visibility (Medium)

Give the Calgary hero a lighter treatment than the shared default so the human cleaning scene stays visible: reduce the flat navy wash and rely on a directional gradient behind the text column only. Edmonton keeps its current treatment. Verified at 1280 and 390 widths that headline contrast still passes.

## 6. Review proof (Medium)

Unchanged from the previous plan: the hero prints a real rating and count the moment `src/data/proof.ts` has them; until then it shows "Five-Star Rated on Google" with the live review link. No invented numbers.

**Still needed from you:** verified Google rating and review count per city.

## 7. Mobile fatigue — persistent action (Medium)

Add the sticky bottom bar (still outstanding from the previous round): "See My Instant Price" plus tap-to-call, appearing only after the hero quote panel scrolls out of view, 48px targets, mobile only. Long-form sections stay for search; no content is removed.

## 8. Mobile contrast and target audit at 390px (Low)

Pass over the announcement bar, hero proof line, and reassurance microcopy: minimum 14px effective size for utility text, 44px minimum interactive height, and contrast checked against the navy background. Fixes applied only where a check fails.

## Technical notes

- Copy and step cards: `src/components/CityConversionIntro.tsx` (`processSteps`, how-it-works subhead, `SPECIALTY_SERVICE_IDS` gains `airbnb`).
- Frequency default: `DEFAULT_FREQUENCY` in `src/data/pricing.ts` switches to the one-time entry; `mostPopular` stays on Bi-Weekly for the chip badge. No pricing math changes.
- Step labels/`TOTAL_STEPS` in `src/components/quote/QuoteFlow.tsx` are unchanged.
- Calgary overlay: a per-city overlay prop on `CityConversionIntro`, used by `src/pages/Calgary2.tsx`.
- New `src/components/MobileStickyCTA.tsx`, mounted on both city pages.
- Verification: 1280 and 390px screenshots of both cities, plus a funnel pass confirming the default price is the one-time figure.
