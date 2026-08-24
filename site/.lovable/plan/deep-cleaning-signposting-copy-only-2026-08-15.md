# Deep Cleaning signposting (copy only)

Guide visitors who want a deep clean through the existing funnel without adding a service, changing pricing logic, or touching the booking URL.

## What changes

1. **Service step (Step 1)** — an info note below the service cards, visually distinct from the selectable options (not clickable, no `aria-pressed`):

   "Need a Deep Cleaning? Choose Standard — you'll add the Deep Cleaning package on the booking page (from $99.99, priced by home size). Booking a Move In/Out? That's already a deep clean."

2. **Move In / Move Out card** — append a short line to that card only: it already includes deep cleaning.

3. **Step 3 price screen** — once home size is known, resolve the exact Deep Cleaning package price for that size and show it:

   "Want it deep-cleaned? Add the Deep Cleaning package on the booking page: +$X for your home size. It's the first item under Select Extras."

   Only shown for Standard Cleaning (the package exists there). If no tier resolves for the selected size, the line is hidden rather than showing a guess.

4. **Step 4 / booking page line** (`src/pages/Book.tsx`) — append to the existing "details are carried over" copy:

   "Add-ons like the Deep Cleaning package are under 'Select Extras'."

## Technical notes

- Price resolution reuses the existing extras lookup `addOnsFor(service, quote.bedroomVariableId)` from `src/data/pricing.ts` and picks the entry keyed `deep-cleaning`. That function already selects the correct size tier from the BookingKoala snapshot (rows 146–152), so no new pricing logic or hardcoded numbers.
- Formatting via the existing `formatPrice`; the pre-GST convention on that screen is unchanged.
- Nothing is pre-selected, no extras are sent in the handoff, and `booking-redirect.ts` / the embed URL are untouched.

## Files

- `src/components/quote/QuoteFlow.tsx` — items 1, 2, 3
- `src/pages/Book.tsx` — item 4
