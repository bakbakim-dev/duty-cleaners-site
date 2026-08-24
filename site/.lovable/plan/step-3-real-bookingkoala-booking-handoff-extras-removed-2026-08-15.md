# Step 3 → real BookingKoala booking handoff (extras removed)

Steps 1-2 and the GoHighLevel API relay stay exactly as built. Step 3 stops being the end of the funnel and becomes the price reveal that hands the visitor to BookingKoala with everything preselected.

## Verified current state

- `QuoteFlow.tsx` step 3 renders the "Anything extra?" fieldset (add-on toggles) and a single CTA "Confirm my booking request" wired to `confirmBooking()`, which upserts to GHL and sets the success state.
- Add-ons flow through `addOns` state → `calculateQuote` → `availableAddOns` (`addOnsFor`) → the `addons` field on the step-3 upsert.
- Progress indicator reads `Step {step + 1} of 3 — {STEP_LABELS[step]}` (line 289); `STEP_LABELS[2]` is "Your price".
- The travel-fee small print and "+ 5% GST" line already exist in step 3.
- Marketing "how it works" copy with the old step-3 wording lives in `CityConversionIntro.tsx`, `Edmonton2.tsx`, `Calgary2.tsx`, `QuoteFormEmbed.tsx`.
- No booking-host constant exists anywhere yet; nothing currently links to bookingkoala.com from the funnel.

## 1. Extras removed from the funnel

- Delete the "Anything extra?" fieldset, the `addOns` state, `toggleAddOn`, and the `availableAddOns` memo from `QuoteFlow.tsx`. `calculateQuote` is called with no add-ons, so the panel shows the core clean only: base combination, first-clean price, recurring price with the frequency discount.
- The step-3 upsert no longer sends `addons`.
- `addOnsFor` stays in `src/data/pricing.ts` (still used for pricing-page content), it is simply no longer rendered in the funnel.
- Under the price, keep "+ 5% GST" and the travel-fee line, and add the passive line: "Popular add-ons like inside oven & fridge can be added on the booking page."

## 2. BookingKoala redirect module

New `src/lib/booking-redirect.ts`, the single place that knows the booking host and the ID tables:

- `export const BOOKING_ORIGIN = "https://dutycleaners.bookingkoala.com"` — nothing else hard-codes the host, so switching to `book.dutycleaners.ca` later is a one-line change.
- `buildBookingUrl({ service, homeType, bedrooms, bathrooms, halfBaths, frequency, contact })` returns `${BOOKING_ORIGIN}/booknow?industry_id=1&form_id=1&...` with every value URL-encoded via `URLSearchParams`.
- Service: Standard → `service_id=6`, Move in Move Out → `service_id=2`.
- Frequency: One-Time 1 · Weekly 3 · Bi-Weekly 4 · Every 4 Weeks 64. Move In/Out always sends `frequency_id=1`.
- Standard pricing params: `[1]` bedrooms 1→87, 2→81, 3→82, 4→83, 5→84, 6→85, 7→86 · `[2]` full baths 1→88, 2→9, 3→11, 4→13, 5→15, 6→17, 7→19 · `[8]` half baths 0→51, 1→8, 2→10, 3→12, 4→16.
- Move In/Out pricing params: `[5]` bedrooms 1→74 … 7→80 · `[6]` full baths 1→39 … 6→44 (no 7 — parameter omitted) · `[7]` half baths 0→58, 1→45, 2→46, 3→47, 4→48.
- Home type `[9]` for both: Two Storey House 90 · Two Storey Townhouse/Duplex 89 · Bungalow 54 · Basement Suite Only 56 · Apartment/Condo 55. Sent even though BK sometimes ignores it.
- Contact: `f_name`, `l_name` (name split on first space), `email`, `phone` digits only.
- Any value with no mapping omits its parameter — never a wrong-category ID.

Unit tests in `src/lib/booking-redirect.test.ts`: one assertion per option ID in both services, Move In/Out frequency forcing, 7 full baths on Move In/Out omitted, unmapped values omitted, and encoding of `+` in emails and spaces/accents in names.

## 3. Step 3 CTAs

- Primary "Choose my date & time →":
  1. Show the interstitial overlay immediately (before any network call).
  2. Fire the step-3 GHL upsert (tag `quote-confirmed`, both site-quoted prices, no extras field) without blocking — a failure is logged to `quote_leads` by the relay and the flow continues.
  3. `window.location.assign(bookingUrl)`.
- Under it: "Step 4 takes about a minute — pick your time, add your address, done."
- Secondary text link "Prefer we call you? Request a callback instead" keeps the previous behaviour exactly: awaited upsert, then "Request received — we'll text you shortly to confirm your time.", with the existing phone-fallback card on failure.
- Step 3 headline becomes "Your price — lock in your time."

## 4. Branded transition interstitial

New `src/components/quote/BookingHandoff.tsx`: fixed full-viewport navy overlay, logo, subtle spinner, and two lines — "Locking in your $X quote…" and "Taking you to secure booking". `aria-live="polite"`; under `prefers-reduced-motion` the spinner renders static. After 5 seconds it reveals "Taking longer than expected — continue to booking" as a plain `<a href>` with the identical BookingKoala URL, so a blocked script can never strand a visitor. The overlay dies with the page unload.

## 5. Preconnect

On the funnel pages (Index/Edmonton, Calgary, and wherever the funnel or overlay mounts), add via the existing `react-helmet-async` head:

```text
<link rel="preconnect" href={BOOKING_ORIGIN} crossorigin />
<link rel="dns-prefetch" href={BOOKING_ORIGIN} />
```

read from the same constant.

## 6. Progress continuity

- In-funnel indicator becomes "Step X of 4": 1 About your home · 2 Your details · 3 Your price · 4 Pick your time. Step 4 is shown as the upcoming stage while the visitor is on step 3.
- Marketing "how it works" keeps its three beats, with step 3 returning to "Pick your time" in `CityConversionIntro.tsx`, `Edmonton2.tsx`, `Calgary2.tsx`, `QuoteFormEmbed.tsx` — the "& customize" wording goes away with the extras.

## Technical notes

- Files: `src/lib/booking-redirect.ts` (new), `src/lib/booking-redirect.test.ts` (new), `src/components/quote/BookingHandoff.tsx` (new), `src/components/quote/QuoteFlow.tsx`, the four copy files, and page heads for preconnect.
- `src/lib/quote-submit.ts` and `supabase/functions/ghl-quote/index.ts` are untouched; the confirm payload simply omits `addons`.

## Live test walkthrough

1. Standard / 3 bed / 2 bath / 1 half / bungalow / bi-weekly → BK opens with service, frequency, bedrooms, baths, half baths preselected; BK's before-tax price compared against our displayed price.
2. Move In/Out / 2 bed / 2 bath → BK opens One-Time with categories 5/6/7 preselected.
3. Callback path still updates GHL and shows the request-received state.
4. Network killed during the step-3 call → redirect still fires, `quote_leads` records the delivery failure.
5. No extras picker anywhere in the funnel; preconnect tags present; Slow 3G shows the overlay instantly and the 5s manual link; reduced-motion has no animated spinner; changing `BOOKING_ORIGIN` moves every redirect and preconnect with prefill intact.
