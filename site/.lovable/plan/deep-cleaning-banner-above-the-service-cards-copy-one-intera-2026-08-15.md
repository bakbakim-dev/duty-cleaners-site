# Deep Cleaning banner above the service cards (copy + one interaction)

Placement 1 moves into the scan path. Placements 2 (price screen line) and 3 (booking-page line) stay exactly as they are.

## What changes

1. **Banner moves above the service cards**, between the "What type of clean do you need?" heading and the grid, so the words are seen before the choices are scanned. Styled as an info band (border + subtle fill), clearly not a selectable card — no `aria-pressed`, no card styling.

   Copy, leading with the goal words:

   "**Deep Cleaning available** — choose Standard and add the Deep Cleaning package at booking (from $99.99, priced by home size). Booking a Move In/Out? That's already a deep clean."

2. **"Deep Cleaning" in the banner becomes a button.** Clicking it selects Standard Cleaning (same handler the card uses) and swaps the banner to a confirmation state:

   "Good choice — Standard selected. You'll add the Deep Cleaning package at booking: +$X for your home size."

   The +$X appears once a home size resolves a tier; until then the line reads "priced by home size". Nothing is pre-ticked and no extras travel in the handoff.

3. **Step 3 personalizes** for anyone who clicked: the existing line opens with "As you wanted a deep clean —" instead of "Want it deep-cleaned?". Same resolved tier price, same wording after that. Everyone else sees the current line unchanged.

4. The "Already includes deep cleaning." line on the Move In / Move Out card stays.

## Technical notes

- One new local state flag in `QuoteFlow.tsx` (e.g. `deepCleanIntent`) set by the banner click; it only drives copy, never pricing or the redirect.
- Price continues to come from `addOnsFor(service, quote.bedroomVariableId)` keyed on `deep-cleaning`, formatted with `formatPrice`. If no tier resolves, the price fragment is omitted rather than guessed.
- No changes to `pricing.ts`, `booking-redirect.ts`, the embed URL, or the step count.

## Files

- `src/components/quote/QuoteFlow.tsx` — all four items

## Not included (BookingKoala side)

Reordering Deep Cleaning to the top of Select Extras and adding the "Quoted a deep clean on our site?" description line are changes in the BookingKoala admin, outside this codebase.
