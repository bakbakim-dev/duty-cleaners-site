# Next build: config repair, full add-on shelf, two new prefill params

## Verified before planning

- `src/data/bk-config.json` (industry 1) matches your report exactly: extra **151** ($219.99) has bedroom options **85 and 86** in `variables`; extra **152** ($199.99) has **no bedroom option at all**. So 6-bed resolves to 151/$219.99 today, and 152 is unreachable — the guard was right, the snapshot is stale.
- Drift confirmed elsewhere: extras 135/136 are still `"Finished basement *"` (stray space) in the snapshot.
- Rows the shelf needs beyond the current two chips exist and are resolvable: Inside Oven (123), Inside Fridge (124), Inside Windows (143/109/110/112/113), Inside cabinets (125/126/47), Spot cleaning walls, Complete Wall Washing, Unfinished/Finished basement tiers, Kitchenette tiers.
- Quantity extras: **114** "wipe window blinds (per set)" $15, `quantity_based: 30`; **141** "De-cluttering or Organizing Per Hour" $69.99, `quantity_based: 8`.
- Pets = extra **122** ($19.99) and Travel fee = extra **108** ($29.99). Both have `variables: null` — the current resolver rejects null-variables rows, so both would fail to resolve as written. That's a resolver bug to fix, not a config gap.
- Parts C/D status in code: speculation-rules script present on step 3 keyed to `bookingUrl`; interstitial fallback timer is already 3000ms; `<BookingEmbed query warmup />` mounts on step 3. The Deep Cleaning link inside the funnel is already `min-h-[44px]` — the 23px one you measure is elsewhere (hero card), to be located and padded.

## Part 1 — repair the config, harden the guard

1. Minimal fix in `bk-config.json`: remove 85 from extra 151's `variables`, add 85 to extra 152's. Result: 6-bed → 152/$199.99, 7-bed → 151/$219.99.
2. Attempt a fresh re-capture of the BookingKoala config. The sandbox is Cloudflare-blocked for automated browsers, so this will likely 403; if it does, I ship the minimal fix, leave the snapshot's `captured_at` honest, and ask you for a fresh export from a real browser rather than hand-editing more rows.
3. Resolver fix: a row with `variables: null` applies to every home size (that is BK's own semantics for pets/travel/blinds), so it must resolve rather than be rejected.
4. Coverage guard into build output: a `bun` script (`scripts/check-bk-extras.ts`) runs `findCoverageGaps` over every offered extra × every bedroom option × both services and exits non-zero with the offending list. Wired into the test suite so a stale config fails CI, not just the DEV console.

## Part 2 — full add-on shelf

- `src/lib/bk-extras.ts` gains `listExtrasFor(serviceId, bedroomOptionId)`: every active row whose `service_categories` includes the service and whose `variables` contains the bedroom option (or is null), deduped by name — the size-specific tier wins, so each name appears once at its correct price. No hardcoded list.
- Shelf renders below the price block, above the CTA. Heading "Add anything else? (optional)". First five in the order Inside Oven, Inside Fridge, Inside Windows, Inside cabinets, Deep Cleaning — Deep Cleaning omitted when deep intent already added it. Remainder behind "Show all add-ons (N more)", expanding inline.
- Rows ≥44px, 16px text, price on the control, unselected by default. Selecting updates first-clean total, GST, the `aria-live` price panel and the sticky panel live. CTA is never gated and stays in view.
- Quantity extras (114, 141) render a −/+ stepper (0…20, default 0); URL carries `extras[<id>]=<qty>`, price = unit × qty.
- Pets is a separate Yes/No question above the shelf: "Do you have pets? (+$19.99)" → extra 122.
- Travel fee stays out of the shelf: a checkbox under the existing small-print line, "My address is outside Edmonton/Calgary city limits (+$29.99 travel fee)" → extra 108, unchecked by default.
- Anything that fails to resolve is hidden silently and logged — no price ever rendered without an id behind it.
- Handoff copy flips to "Your add-ons are already added — just pick your time." whenever the basket is non-empty. The remaining "add it on the booking page" nudges for oven/fridge are removed.
- GHL step-3 upsert carries the full basket (names + quantities) in `selected_extras` and the inclusive total in `site_quoted_first_clean_price`.

## Part 3 — date and coupon prefill

- Optional "When would you like it?" date picker on step 3, below the price and above the shelf. Chosen date appends `date=YYYY-MM-DD`. Never required; handoff copy stays "pick your time" since time isn't prefillable.
- A `promo` query param on our site is captured once (persisted for the session so it survives step navigation) and passed through as `coupon=<CODE>`. No coupon UI.
- `location=N` skipped as agreed.

## Part 4 — confirmations

Re-verified in a browser rather than asserted: speculation-rules script present on step 3 and rewritten when frequency, deep intent, add-ons, quantity, pets, travel or date change the URL; 3s interstitial fallback; hidden embed warm-up under the flag. Then locate the 23px "Deep Cleaning" hero-card link and pad it to ≥24px (44px effective).

## Testing

- Unit: resolver over 1/3/7-bed Standard and Move In/Out — shelf contents and prices, dedupe, null-variables rows, quantity math, deep-clean never twice, unresolved rows omitted.
- URL: composed `extras[...]` for a mixed basket including a quantity extra, plus `date` and `coupon`.
- Browser: shelf expansion, live totals, CTA visibility at 320px and 200% zoom, axe pass on step 3.
- Item-for-item parity against the live BookingKoala page can't run here (Cloudflare blocks the sandbox); I'll hand you the exact URLs to click through from a real browser.

## Files

`src/data/bk-config.json`, `src/lib/bk-extras.ts`, `src/lib/booking-redirect.ts`, `src/lib/booking-redirect.test.ts`, `scripts/check-bk-extras.ts`, `src/components/quote/QuoteFlow.tsx`, `src/components/quote/PricePanel.tsx`, `src/components/quote/BookingHandoff.tsx`, `src/lib/quote-submit.ts`, plus the hero card holding the 23px Deep Cleaning link.
