# BookingKoala pricing config — Home Cleaning (industry 1, form 1)

**Source of truth for the website funnel.** Captured 2026-08-15 from BookingKoala admin
(Settings → Industries → Home Cleaning → Form 1). Currency CAD. Prices exclude GST.

⚠️ The website must NEVER invent an option or a price. Everything below comes from BookingKoala.
Re-capture whenever BK settings change.

---

## Verified price formula

```
subtotal      = bedrooms + full_bathrooms + half_baths + home_type + extras
first_clean   = subtotal
recurring     = subtotal × (1 − frequency_discount)
displayed tax = 5% GST added on top of each
```

**Verified against a live customer quote:** Standard Cleaning, 1 bed / 1 bath / 0 half, Bi-Weekly →
120.99 + 34.00 = **$154.99 before tax** → with GST **$162.74** (matches BK's "TOTAL"), and
154.99 × 0.85 = 131.74 × 1.05 = **$138.33** (matches BK's "Recurring Total"). The formula is exact.

Note: BK displays the first clean before tax and the recurring total **with** tax on its own summary.
The website should present both consistently (recommend: show both before tax, and note "+ GST").

---

## Services (customer-facing only)

| Service | ID | Frequencies allowed |
|---|---|---|
| Standard Cleaning | 6 | One-Time · Weekly · Bi-Weekly · Every 4 Weeks |
| Move in Move Out Cleaning | 2 | **One-Time only** |

Admin-only (never show on the website): Hourly Cleaning (17), Re-Clean $0 (4),
Re-Clean – different cleaner $25 (5).

➡️ **Build rule:** frequency chips appear only for Standard Cleaning. If Move In/Out is selected,
hide recurring options entirely — BookingKoala will not accept a recurring move-out booking.

## Frequencies & discounts

| Frequency | Discount | ID |
|---|---|---|
| One-Time | 0% | 1 |
| Weekly | 20% | 3 |
| Bi-Weekly (Every 2 Weeks) | 15% | 4 — **default** |
| Every 4 Weeks | 10% | 64 |

(Hourly-variant frequencies 65/66/68 are for the admin-only Hourly service — ignore.)

---

## Base prices — STANDARD CLEANING

**Bedrooms** (use these exact labels, sqft included)

| Option | Price | Time |
|---|---|---|
| 1 Bedroom (Under 800sqft) | $120.99 | 1h45 |
| 2 Bedrooms (Under 1100sqft) | $135.00 | 2h |
| 3 Bedrooms (Under 1700sqft) | $157.30 | 2h15 |
| 4 Bedrooms (Under 2300sqft) | $178.75 | 2h30 |
| 5 Bedrooms (Under 3000sqft) | $200.20 | 2h45 |
| 6 Bedrooms (Under 3600sqft) | $222.30 | 3h15 |
| 7 Bedrooms (Under 4200sqft) | $254.99 | 3h45 |

**Full bathrooms**

| Option | Price | Time |
|---|---|---|
| 1 Full Bath(s) | $34.00 | 30m |
| 2 Full Bath(s) | $60.00 | 1h |
| 3 Full Bath(s) | $90.00 | 1h30 |
| 4 Full Bath(s) | $120.00 | 2h |
| 5 Full Bath(s) | $150.00 | 2h30 |
| 6 Full Bath(s) | $180.00 | 3h |
| 7 Full Bath(s) | $210.00 | 3h30 |

**Half baths**

| Option | Price | Time |
|---|---|---|
| 0 Half Baths (With Only A Toilet or Sink) | $0 | — |
| 1 Half Bath | $15.00 | 15m |
| 2 Half Baths | $30.00 | 30m |
| 3 Half Baths | $45.00 | 45m |
| 4 Half Baths | $65.00 | 1h |

**Home type**

| Option | Price | Time |
|---|---|---|
| Two Storey House (Main + Upper Floor) | $55.00 | 40m |
| Two Story Townhouse (Duplex) | $40.00 | 30m |
| Bungalow (Single Story Home) | $15.00 | 5m |
| Basement Suite Only | $15.00 | 5m |
| Apartment or Condo | $0 | — |

---

## Base prices — MOVE IN / MOVE OUT

**Bedrooms**

| Option | Price | Time |
|---|---|---|
| 1 Bedroom (Under 800sqft) | $243.75 | 3h15 |
| 2 Bedroom (Under 1100sqft) | $281.25 | 3h45 |
| 3 Bedroom (Under 1700sqft) | $318.75 | 4h15 |
| 4 Bedroom (Under 2300sqft) | $356.25 | 4h45 |
| 5 Bedroom (Under 3000sqft) | $393.75 | 5h15 |
| 6 Bedroom (Under 3600sqft) | $431.25 | 5h45 |
| 7 Bedroom (Under 4200sqft) | $468.75 | 6h15 |

**Full bathrooms:** 1 = $39.99 · 2 = $79.99 · 3 = $119.99 · 4 = $159.99 · 5 = $199.99 · 6 = $239.99 (7 = follows pattern, verify)
**Half baths:** 0 = $0 · 1 = $25.00 · 2 = $50.00 · 3 = $75.00 · 4 = $110.00

---

## Extras — a (service × size-tier) matrix, NOT a flat list

Every extras row in BK is scoped to a **service category** and (for tiered ones) a **home-size
variable range**. The customer only ever sees the rows matching their selected service, with the
price resolved by their home size. The near-duplicate basement names are **deliberate**: the
asterisked variants are the Standard-clean (lighter/exterior) versions, the non-asterisked ones are
the Move-In/Move-Out (deeper) versions at higher prices and longer durations. The site must
reproduce this exact filtering.

**Available on STANDARD CLEANING:**

| Extra | Price by size tier | Notes |
|---|---|---|
| Deep Cleaning | $99.99 / $119.99 / $139.99 / $159.99 / $179.99 / $199.99 / $219.99 | Package, Standard only (Move-Out is already deep) |
| Inside Windows | $39.99 / $64.99 / $109.99 / $139.99 / $179.99 | Shared with MIMO |
| Spot cleaning inside Walls | $39.99 – $109.99 (7 tiers) | Shared with MIMO |
| Complete Inside Wall Washing | $119.99 – $234.99 (7 tiers) | Shared with MIMO |
| Inside cabinets (Kitchen & Bathroom Only) | $74.99 / $129.99 / $199.99 | Standard only |
| Inside Oven | $59.99 flat | Standard only (included in Move-Out) |
| Inside Fridge | $59.99 flat | Standard only (included in Move-Out) |
| Finished basement* | $64.99 / $74.99 / $94.99 / $119.99 / $134.99 | Standard version (the `*` naming is intentional) |
| Finished Basement with Kitchenette* (exterior only) | $94.99 / $119.99 / $159.99 / $199.99 | Standard version |
| Unfinished Basement Sweep | $24.99 / $39.99 / $64.99 | Shared with MIMO |
| Must choose if you have pets | $19.99 flat | All services |
| De-cluttering or Organizing Per Hour | $69.99/hr | |
| wipe window blinds (per set) | $15.00/set | Shared with MIMO |
| sweep only of garage or balcony | $29.99 flat | |
| Outside Edmonton/Calgary – Travel fee | $29.99 flat | Customer self-selects today |

**Available on MOVE IN / MOVE OUT (replacing the Standard basement versions):**

| Extra | Price by size tier |
|---|---|
| Finished basement | $99.99 / $109.99 / $144.99 / $174.99 |
| Finished Basement with Kitchenette | $194.99 / $199.99 / $219.99 / $239.99 |
| plus the shared ones above (Inside Windows, walls, blinds, basement sweep, pets, travel fee) | |

➡️ **Build rules:** (1) filter the extras list by the selected service exactly as BK does;
(2) show ONE entry per extra and resolve the tier price from the selected home size — never show
tier rows as separate checkboxes; (3) keep BK's exact names including asterisks so the site,
BK, and the confirmation all match.

---

## Build notes for the funnel

1. Show one entry per extra name; resolve the tier price from the selected home size.
2. Recurring pricing applies to Standard only; extras are typically first-clean-only in BK — mirror that.
3. Travel fee is currently an honour-system checkbox. Options: keep it as a checkbox with BK's exact
   wording, or omit it from the site and let BK collect it at booking (the plan's small-print line
   already warns that out-of-city addresses may include a travel fee).
4. Every label above must be reproduced verbatim so the site, BookingKoala and the customer's
   confirmation email all say the same thing.
