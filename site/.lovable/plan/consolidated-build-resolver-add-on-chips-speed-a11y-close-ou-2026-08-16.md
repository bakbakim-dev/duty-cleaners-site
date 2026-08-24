# Consolidated build: resolver, add-on chips, speed, a11y close-out

## Already done (verified in code this turn — will re-run their tests, not rebuild)

- **Part C1 — Speculation Rules prefetch**: `QuoteFlow.tsx` injects a `speculationrules` script on step 3 keyed to `bookingUrl`, removed on unmount. It already re-injects on frequency/deep-intent change because `bookingUrl` is a memo of those inputs; add-on chips will feed the same memo.
- **Part C2 — Interstitial**: `BookingHandoff.tsx` fallback timer is already 3000ms.
- **Part C3 — Embed warm-up**: `BookingEmbed` has a `warmup` prop (hidden, `visibility:hidden`, timers disabled) mounted on step 3 when `BOOKING_MODE === "embed"`.
- **Part D1–D7**: skip link (`SkipLink.tsx`), `<main id="main-content">`, 7:1 `--fine-print` tokens on travel-fee/GST/risk-reversal, padded Deep Cleaning link and Leaflet attribution, `aria-live` price panel, step-heading focus (`stepHeadingRef`), inline `aria-describedby` errors with phone fallback, 320px reflow.

Part D work this pass is re-verification only: axe on home + all funnel steps, keyboard pass, error path, 200% zoom. Anything that regressed gets fixed; anything that passes is reported "already done".

## Part A — config-driven extra resolver

New in `src/lib/booking-redirect.ts` (or a small `src/lib/bk-extras.ts` it re-exports):

```text
resolveExtraId(name, serviceId, bedroomOptionId) ->
  bk-config industry 1 extras rows where
    name.trim() === name
    && service_categories includes serviceId
    && variables includes bedroomOptionId
  -> row.id, else null
```

`DEEP_CLEANING_EXTRAS`'s hardcoded id table is deleted; the deep path calls the resolver with the bedroom option id already produced by `STANDARD_PARAMS.bedrooms`. Price for display comes from the resolved row's `prices_ml[0]`, so price and id can never disagree.

Null result omits the `extras[...]` param entirely.

**One conflict the config forces a decision on:** the current 6-bedroom deep id (152, $199.99, supplied by you as a correction) does **not** satisfy the resolver — that row's `service_categories` is `[6]` only and its `variables` do not contain bedroom option 85. Every other size (146–151) resolves cleanly. Plan: implement the resolver honestly, let 6-bed resolve to `null` (no extras param, no wrong-tier id), and surface it in the dev assertion output as a known config gap to fix on the BookingKoala side. 6-bed deep bookings then tick the package on BK's page as before rather than silently mis-pricing.

**Dev/CI assertion** in `booking-redirect.test.ts` plus a dev-only runtime check: every offered extra × every bedroom option of its service must resolve. It fails loudly with the offending name/size list. A fixture test renames an extra to prove the failure fires.

## Part B — two add-on chips on step 3

- State `addOns: Set<"Inside Oven" | "Inside Fridge">`, empty by default, reset when service changes.
- Row renders only when service is `standard`, placed below the price block and above `RiskReversalRow`, heading "Want to add anything? (optional)".
- Chips: `min-h-[44px]`, 16px text, label `Inside Oven +$59.99` (price read from the resolved row), `aria-pressed`, selected state uses existing accent tokens.
- Displayed first-clean total adds selected chip prices live; the `aria-live` price wrapper announces it. CTA never gated.
- `BookingUrlInput` gains `addOnExtraIds: number[]`; `buildBookingQuery` emits one `extras[id]=1` per resolved id, composing with the deep extra.
- GHL step-3 upsert: chosen names appended to `addons` (maps to `contact.selected_extras`) and their cost included in `first_clean_price`.
- Handoff/step-3 copy: when any add-on is selected, "Your add-ons are already added — just pick your time." The passive "Popular add-ons like inside oven & fridge can be added on the booking page." line is removed.

## Files

- `src/lib/booking-redirect.ts` — resolver, extras param composition, `addOnExtraIds`.
- `src/lib/booking-redirect.test.ts` — resolver coverage, assertion, fixture-failure test.
- `src/data/pricing.ts` — deep price sourced from resolved row.
- `src/components/quote/QuoteFlow.tsx` — chip row, totals, GHL payload, copy, prefetch URL already keyed to it.
- `src/components/quote/PricePanel.tsx` — add-on-inclusive total if it renders the figure.

## Tests I can run here

1. Resolver assertion (deep × 7 sizes, both chips) + fixture-rename failure.
5. GHL payload shape: add-on names in `addons`, inclusive `first_clean_price`.
6. Browser: `speculationrules` present on step 3, rewrites on frequency and on chip toggle, no console errors.
7. axe on home + steps 1–3, keyboard/focus pass, 200% zoom / 320px reflow.
8. Interstitial fallback link at 3s under throttling.

Tests 2/3/4 need the live BookingKoala page — the sandbox is Cloudflare-blocked, so I will report the exact URLs to click through from a real browser.
