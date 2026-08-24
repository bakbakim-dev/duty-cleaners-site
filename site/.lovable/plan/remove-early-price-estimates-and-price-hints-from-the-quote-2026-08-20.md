# Remove early price estimates and price hints from the quote funnel

Two problems in the funnel: a dollar figure appears before the visitor has given contact details, and it silently changes as they adjust bedrooms and bathrooms. Deep Cleaning also carries pricing language up front.

## What changes

**1. No price before Step 3**

- Remove the "Estimated from $169, then $143.65 per visit — see your exact price next." line above the Continue button on Step 1.
- Remove the same estimate teaser above the Step 2 (contact) submit button.
- Result: the first dollar amount a visitor sees is the real quote on Step 3, after contact details are captured. Nothing changes silently underneath them.

**2. Deep Cleaning stays an option, loses its pricing hints**

In the on-page funnel (Step 1):
- Keep Deep Cleaning selectable, but drop the "from $99.99" figure and the "priced by home size ($X for your current size)" wording.
- Replace with plain, price-free copy: Deep Cleaning is a package added to a standard clean, with the exact amount shown on the price screen.

In the hero quote card at the top of the page:
- Keep the Deep Cleaning row, remove the "Standard + package" descriptor so it reads as a normal option alongside the others.

Nothing else about the funnel logic changes: Deep Cleaning intent still flows through to Step 3, the add-on shelf, and the BookingKoala handoff exactly as it does today.

## Technical notes

- `src/components/quote/QuoteFlow.tsx` — delete the two `Estimated from {formatPrice(quote.firstClean)}` blocks (Step 1 and Step 2 CTA areas); rewrite the deep-clean intro paragraphs so they no longer call `deepCleanFromPrice()` or render `deepCleanPrice`.
- `src/components/CityConversionIntro.tsx` — remove the "Standard + package" span from the Deep Cleaning button.
- Applies to Edmonton and Calgary automatically (both render the shared components).
- Verify with the existing Vitest suite plus a browser pass through Steps 1 to 3 confirming no dollar amount renders before the price screen.
