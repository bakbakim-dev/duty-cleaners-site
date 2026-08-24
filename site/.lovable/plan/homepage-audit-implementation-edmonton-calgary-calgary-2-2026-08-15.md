# Homepage Audit Implementation (Edmonton `/` + Calgary `/calgary-2`)

Applies the audit's recommendations. Both city pages get identical treatment so nothing drifts.

## 1. Standardize the instant-price language

"See My Instant Price" becomes the single primary CTA phrase everywhere on the two city pages: header CTA, hero CTA, service-card CTAs, pricing-table CTAs, final CTA. "Continue" stays only inside the multi-step quote form. Secondary phone link keeps "Prefer to talk? Call …".

## 2. Hero service picker

Options become: **Standard Cleaning · Deep Cleaning · Move In / Move Out · Post-Construction · Office Cleaning** (Airbnb Turnover is replaced by Office Cleaning). Standard, Deep and Move-in/out are the visually prominent choices; Post-Construction and Office Cleaning sit under a quieter "Specialty cleaning" grouping in the same panel so the Continue button stays reachable on mobile.

On mobile the options render as touch-friendly rows/2-up cards so the orange Continue button stays within the first screen.

## 3. City selector genuinely drives the page

- Keep "Choose your city:" descriptor, strengthen the active state (solid navy fill, clear inactive style) so it reads as a control, not a label.
- Audit the Edmonton and Calgary pages so every city-dependent element — headline, phone, review link, service-area copy, coverage grid, quote context, confirmation text — follows the selected city with no carryover.

## 4. Review proof

Wire the hero proof line to real numbers once you provide them: rating, review count, and the verified Google listing link, rendered as "4.9 on Google · N Edmonton reviews" style copy sourced from `src/data/proof.ts`. Until you supply the figures the current "Five-Star Rated on Google" line stays — no invented numbers are printed.

**Needed from you:** verified Google rating and review count for each city.

## 5. Guarantee wording

Replace "24-hour re-clean promise" wherever it appears on the homepage flow with: "If something was missed, tell us within 24 hours and we'll return to make it right — at no charge."

## 6. Form readability

Increase the size and contrast of the Step-1 label, progress percentage and reassurance microcopy in the quote panel; keep the progress plain-language ("Step 1 of 4 — About your home") rather than technical.

## 7. Page sequence below the hero

Reorder the existing sections on both city pages into the audit's sequence, reusing current components:

```text
Hero
1 Three trust points
2 How it works
3 Cleaning-service cards (Standard, Deep, Move-in/out, Specialty) — each with its own "See My Instant Price"
4 Real reviews (existing Google review components)
5 Guarantee + cleaner vetting
6 What's included + pricing clarity, ending in a quote CTA
7 City / service-area proof (coverage grid + map + neighborhoods)
8 FAQ + final CTA
```

Duplicate or redundant blocks encountered during the reorder are consolidated rather than repeated.

## 8. Mobile sales access

Sticky bottom bar with "See My Instant Price" + tap-to-call that appears only after the hero quote panel scrolls out of view, with 48px tap targets.

## 9. Navigation

Rename the "More" dropdown to "About" with a secondary menu that clearly lists Reviews, FAQ, Gift Cards, Careers, Blog and Contact, so reassurance pages aren't hidden behind a vague label.

## Explicitly not doing

- No postal-code field anywhere in the funnel (confirmed).
- No changes to the quote engine, pricing math, GHL relay, or the BookingKoala handoff.
- No new analytics events in this round.

## Technical notes

- Hero, city switcher, trust strip, how-it-works: `src/components/CityConversionIntro.tsx` (shared by both cities).
- Service list source: `src/data/pricing.ts` `SERVICES` — Office Cleaning maps to the existing commercial service entry; the hero stops using a blind `slice(0, 4)`.
- Section reorder is JSX reordering inside `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx`. No routing changes.
- Review numbers read from `src/data/proof.ts` (`googleRating` / `googleReviewCount`), which stay `null` until you confirm them.
- Nav change in `src/components/Navigation.tsx`; sticky mobile bar as a small shared component.
- Verify with desktop 1280 and mobile 390px screenshots of both cities plus a city-toggle pass.
