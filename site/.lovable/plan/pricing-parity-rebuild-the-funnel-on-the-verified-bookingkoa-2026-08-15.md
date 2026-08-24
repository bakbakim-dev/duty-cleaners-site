# Pricing parity — rebuild the funnel on the verified BookingKoala config

## What I checked first

The captured snapshot (`src/data/bk-config.json`) does **not** match the admin figures you just supplied. Its `price_ml` values are BK's default/base fields, not the Form 1 prices:

| Item | In our snapshot | Your admin capture |
|---|---|---|
| 1 Bedroom (Standard) | $99.00 | $120.99 |
| 1 Full Bath (Standard) | $10.00 | $34.00 |
| Two Storey House | $50.00 | $55.00 |
| Move In/Out bedrooms | $219.99 flat for every size | $243.75 → $468.75 ladder |
| Move In/Out full baths | $29.99 flat | $39.99 → $239.99 ladder |

So today the site quotes a 1-bed/1-bath standard clean at $109 while BK quotes $154.99. Extras, frequencies and discounts in the snapshot **do** match your capture exactly (Deep Cleaning tiers, Inside Windows $39.99–$179.99, wall washing $119.99–$234.99, pets $19.99, Weekly 20% / Bi-Weekly 15% / Every 4 Weeks 10%), and Bi-Weekly is already the default.

## 1. Verified price overrides

Add `src/data/bk-price-overrides.ts` holding your admin-captured table verbatim (labels, prices, durations) for: Standard bedrooms, Standard full baths, Standard half baths, home types, Move In/Out bedrooms, Move In/Out full baths, Move In/Out half baths.

`pricing.ts` keeps reading `bk-config.json` for structure (which options exist, which extras attach to which size, frequencies, discounts) but resolves each option's **price and label from the override table** when a match exists. Any option present in BK but absent from the override table logs a build-time warning rather than silently pricing at the stale number.

The exact labels including sqft wording and "(With Only A Toilet or Sink)" are reproduced verbatim.

## 2. Price formula

`calculateQuote` becomes exactly:

```text
subtotal    = bedrooms + full_baths + half_baths + home_type + extras
first_clean = subtotal
recurring   = subtotal x (1 - frequency_discount)
```

Note this changes current behaviour: today extras marked `first-only` are dropped from the recurring figure. Your verified formula discounts the whole subtotal, so the funnel will match BK's own "Recurring Total" instead.

Regression check built into the change: Standard, 1 bed / 1 bath / 0 half / Apartment-Condo, Bi-Weekly must produce $154.99 first clean and $131.74 recurring ($162.74 / $138.33 with GST).

## 3. GST

Prices stay displayed before tax, with "+ 5% GST" beside them, and the price panel adds a small line showing the with-GST total for both the first clean and the recurring visit so the site and BK's summary read the same.

## 4. Service and frequency rules

- Standard Cleaning (BK id 6) and Move In / Move Out (id 2) only. Hourly Cleaning, Re-Clean $0 and Re-Clean-different-cleaner are filtered out of anything customer-facing.
- Frequency chips render only for Standard. Selecting Move In/Out hides the recurring block entirely and forces One-Time — no recurring price, no savings badge.
- Chip order and discounts straight from BK: One-Time 0%, Every 4 Weeks 10%, Bi-Weekly 15% (default, "Popular"), Weekly 20%.

## 5. Extras

- One row per extra name; the tier price resolves from the selected bedroom option. Never show tier rows as separate checkboxes.
- Filtered by selected service exactly as BK does, so Standard shows `Finished basement*` / `Finished Basement with Kitchenette* (exterior only)` and Move In/Out shows the non-asterisked deeper versions, with the shared extras (Inside Windows, wall spot-cleaning, wall washing, blinds, basement sweep, pets, travel fee) on both.
- Standard-only extras stay Standard-only: Deep Cleaning package, inside cabinets, Inside Oven, Inside Fridge.
- Names kept verbatim, asterisks included.
- Travel fee stays as a checkbox with BK's exact wording "Outside Edmonton/Calgary – Travel fee" ($29.99), matching BK's own honour-system behaviour.

## 6. Payload parity

The GHL submit payload keeps sending the funnel's displayed prices, so what BK, GHL and the customer's confirmation quote all stay identical to what the panel showed.

## Verification

Playwright pass on desktop and mobile: the reference quote above matched to the cent; a Move In/Out selection asserted to show no frequency chips and no recurring figure; every Standard and Move In/Out extra list diffed against your capture; and a spot check that each bedroom, bath, half-bath and home-type option renders its verbatim label and override price.

## One thing to confirm

Move In/Out 7 full baths is unverified in your capture. I will follow the $39.99 step ($279.99) and mark it as unverified in code — tell me if BK shows something different.
