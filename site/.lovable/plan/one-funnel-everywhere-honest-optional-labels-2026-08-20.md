# One funnel everywhere + honest "optional" labels

## 1. Every quote funnel opens the same full-screen flow

Today the hero launches a distraction-free takeover, while the `#quote` block at the bottom of the Edmonton and Calgary pages renders the whole funnel inline — a second, longer, scroll-heavy version of the same thing.

The inline copy goes away. In its place, the `#quote` section keeps its heading and becomes a compact launcher card:

- Service choices (Standard / Move In-Out / Deep) shown as tiles, exactly like the hero.
- Picking one opens the same overlay, pre-set to that service, at Step 1.
- The quiet "prefer to book by phone" line and the "what happens next" list stay.

Anything on the site that links to `#quote` still works: the anchor scrolls to the launcher, and CTAs that already call the overlay are unchanged.

## 2. "Details for your cleaner" is not optional — stop calling it that

BookingKoala needs this information to create the booking, so the funnel asks for it properly instead of hiding it behind a collapsed "optional" toggle.

- Section becomes an always-open block headed **"Details for your cleaner"** with the sub-line "BookingKoala needs these to confirm your clean — answer here and skip them at checkout."
- Required before the booking handoff: **entry method**, **parking**, **how clean it is now**, and **postal code**.
- Free-text notes stay genuinely optional and are labelled that way.
- Postal code moves out of the price card's "optional" label; it keeps its position beside the travel fee but is now marked required, and its travel-fee logic is untouched.
- Attempting to continue with a gap doesn't silently fail: the button stays enabled, the missing fields get inline red messages, and focus jumps to the first one.

## 3. Site-wide honesty pass on labels

Sweep every form and funnel for the same defect — fields marked "(optional)" that are in fact needed, and required fields with no marker:

- Contact form, join-the-team application, gift-card enquiry, and the funnel's Step 2 contact fields.
- Any field that is truly required gets a visible "Required" marker; any field marked optional must actually be skippable end to end.
- Copy that promises "a few quick questions" is checked against the real number of questions.

## Technical notes

- `src/components/quote/QuoteFlow.tsx` — replace the `<details>` wrapper with an open `<fieldset>` group; add a `detailErrors` state and a validation gate in the step-3 booking handler covering `entry`, `parking`, `cleanliness` and a valid `postalCode` (via the existing `normalizePostalCode`); `notes` remains optional; relabel the postal-code field.
- `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx` — swap the inline `<QuoteFlow />` for a launcher card using `useQuoteOverlay().openQuote`, mirroring `CityConversionIntro`'s service tiles.
- Extract the hero's service-tile markup into a small shared component so hero and launcher can't drift apart.
- No change to `buildBookingQuery`, the `dc_*` contract, or the GHL payload — the same fields are sent, they are just now guaranteed present.
- Re-run the Vitest suite and a Playwright pass over both city pages plus the overlay.
