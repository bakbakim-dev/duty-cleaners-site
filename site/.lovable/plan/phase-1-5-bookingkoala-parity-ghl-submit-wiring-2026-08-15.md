# Phase 1.5 — BookingKoala parity + GHL submit wiring

Two pieces in one pass: the funnel's options and prices get regenerated from BookingKoala's real config, and the submit button starts sending the lead to the GHL form.

## Verified current state

- `src/lib/quote-submit.ts` and `src/config/ghl.ts` exist but hold no real values — `GHL_FORM_ENDPOINT`/`GHL_FORM_ID` are `null`, so `submitQuote()` returns `{ok:false, unconfigured:true}` and the UI shows the failure card. No lead can send today.
- `src/data/pricing.ts` is hand-written with invented values (add-ons: interior windows $45, inside fridge $35, wall washing $60; `basePrice` marked `TODO-OWNER`). None of it came from BookingKoala.
- 1.5.6 fixes are already shipped: `<5%` stat renders statically, ticker says "Serving Alberta since 2017", Step 3 reads "Send your booking request" in `CityConversionIntro`/`Edmonton2`/`Calgary2`, `/edmonton-2` and `/calgary-2` redirect to `/` and `/calgary`, footer phone is city-derived, and `src/data/reviews.ts` is empty-by-default so no invented reviews render.
- Not yet done from 1.5.6: the quote-dialog freeze is unreproduced, and both the page section and the overlay mount their own `QuoteFlow`.

## 1. Capture BookingKoala's config

A Playwright script loads `https://dutycleaners.bookingkoala.com/booknow`, lets the page do its own session bootstrap, and records the JSON responses for `/api/v4/industry/{id}/form-settings`, `/api/v4/merchant/form-settings/...`, and `/api/v4/industry-settings-new/{industry}/{form}?type=add` — for each industry tab (Home Cleaning, Post Construction, Airbnb, Office).

Raw responses are saved to `src/data/bk-config.json` (committed), plus a `scripts/capture-bk-config.md` note describing the 2-minute re-capture and diff procedure for parity checks.

## 2. Regenerate the funnel from that config

`src/data/pricing.ts` becomes a thin typed adapter that reads `bk-config.json` instead of holding hard-coded numbers:

- Industries as the top level; Home Cleaning services limited to what BK actually offers (Standard, Move In/Move Out). "Deep Cleaning" moves out of services and becomes the tiered extras package BK defines.
- Home type, bedrooms (keeping BK's sqft wording in the labels), full baths, half baths driven by BK's variables.
- Frequencies and recurring discounts from BK (One-Time / Weekly / Bi-Weekly / Every 4 Weeks).
- Extras with BK's real prices, including the pets surcharge and travel fee.
- Price math mirrors BK's `prices_ml` fields so the displayed first-clean and recurring prices match BK's own quote.

`QuoteFlow`, `PricePanel`, and `FrequencyChips` keep their current look; only the options and numbers they render change. Any service BK doesn't price online keeps the existing "request a quote" path rather than showing a number.

Expect visible price changes on the site — for example interior windows goes from the invented $45 to BK's $179.99.

## 3. Wire the GHL submit

Captured account values go into `src/config/ghl.ts`: endpoint `https://api.bookin60.com/forms/submit`, form ID `AwJDnvuYtkojIN3aOysC`, location `4OROmtMn8LQqaDsUJPjC`, and the six custom field IDs (service, home type, bedrooms, bathrooms, half baths, frequency) alongside `full_name`/`email`/`phone`.

Only those nine fields map for now. The remaining payload keys (city, postal code, add-ons, both prices, discount %, page URL, UTM/gclid) stay defined in the field map with empty IDs and are skipped at send time until you add the fields in the form builder — filling them in later is a one-line change each.

Dropdown values are sent using BK/GHL's own option labels so workflow filters stay reliable.

**Verification step, done before anything ships:** one clearly-marked test submission from the site against the live endpoint, with the response status read (no `no-cors`). If Cloudflare Turnstile or CORS rejects it, the client switches to posting the full JSON payload to a Zapier/Make webhook URL read from `VITE_GHL_WEBHOOK_URL` — you create the Zap (Webhook trigger → GHL create/update contact) and give me the URL. No captcha bypass is attempted either way.

Success stays gated on a real 2xx; the failure card, retained form data, honeypot, and minimum-time check already in `QuoteFlow` are unchanged.

## 4. Freeze investigation

Profile the quote dialog with Playwright and a render counter across all three steps, watching the frequency-reset effect in `QuoteFlow`, the `#quote` hash effect in `use-quote-overlay`, and the overlay focus trap. If nothing reproduces, collapse the duplicate funnel so only one `QuoteFlow` instance mounts per page, since two live funnels is the most likely source.

## What I need from you

- The Zapier/Make webhook URL, if the direct POST turns out to be blocked.
- The real response-time promise for the success line (currently "1 hour during business hours").
- The verbatim Google reviews, whenever you have them — the sections stay hidden until then.
- Confirmation once the extra GHL custom fields exist, with their IDs.

## Verification

Desktop and mobile Playwright runs: full funnel to submit with the request intercepted (assert every mapped field present and prices matching what the panel showed), a forced failure (assert no success screen, fallback copy, data retained), honeypot filled (assert no request), plus a diff of the funnel's rendered options and prices against the captured BK config.
