# Step 3 refinements + cleaner-details handoff

## 0. Basement extras on apartments (the stale-config item)

I can't pull a fresh export from BookingKoala myself — `src/data/bk-config.json` is a captured snapshot, and in the current snapshot the basement rows carry no home-type restriction, which is why an Apartment/Condo still sees a BASEMENT group.

Two-part fix:

- **Now:** add an explicit suppression rule in the resolver — basement-prefixed rows are never offered (and never sent) for Apartment/Condo and Basement Suite Only home types. This removes the price-mismatch immediately and is independent of the snapshot.
- **When you paste a fresh export:** drop it into `bk-config.json`; the rule stays as a belt-and-braces guard and the config-driven filtering takes over. A coverage test asserts an apartment quote has zero basement rows.

## 1. Remove "★ Most added"

Badge and its `isMostAdded` helper removed from the shelf, the exports, and the tests. No replacement label.

## 2. Recurring-savings block beside the frequency buttons

When a recurring frequency is selected, a green-tinted card renders directly under the frequency chips:

```text
  $169.00 (struck)  →  $143.65 +GST per visit
  [ ✓ Save $25.35 per visit (15%) ]
```

- Recurring price is the largest element; the struck anchor stays labelled as the first-clean price so the comparison is truthful.
- One 300ms fade/slide on first appearance only, wrapped in `prefers-reduced-motion: no-preference`. No looping animation.
- The sidebar/price-panel version stays as-is; this inline card is the primary display.
- Green tokens added to the design system (light green surface, dark green text, 4.5:1+), not hardcoded classes.

## 3. Preferred date → urgency chips

- The date field, its state, the `date` input on the URL builder, and the `date=` param are all removed (a test already asserts `date=` never ships; it becomes the permanent rule).
- Same position gains: **"How soon do you need it?"** — ASAP / This week / Next week / Flexible. Optional, no calendar, no wording that implies a held slot.
- The answer rides along in the CRM payload for follow-up prioritisation.

## 4. Travel fee: required-feeling radio question

- Checkbox replaced by **"Is your service address inside Edmonton or Calgary city limits?"** with Yes / No radios, neither preselected, placed above the price card's fine print.
- Unanswered is priced as Yes; the CTA is never blocked.
- "No" reveals a neutral note ("A $29.99 travel fee applies outside city limits — it covers the extra travel time.") and adds a labelled `+$29.99 travel fee` line to the price card, the sticky bar and the CRM total. The travel-fee extra still goes into the booking URL exactly as today.

## 5. Extras tile readability

White tiles on the group's tinted background, 1.5px navy border, 8px radius, whole tile clickable with pointer cursor, hover raises and darkens the border. Selected state: filled navy, white text, leading ✓, label "Added ✓". Name 16px with bolded price on line 1, 14px muted benefit line below. Quantity steppers keep their own hit targets so stepping doesn't toggle the tile.

## 6. "Details for your cleaner" group

New optional group on Step 3, after the add-ons and before frequency, headed "Details for your cleaner (optional — saves you a step at booking)":

- How do we enter the home? — Someone will be home / Key in mailbox / Access code / Other
- How clean is it right now? — 1 Almost spotless … 5 Very dirty
- Where should we park? — Street / Visitor / Driveway / Paid nearby
- Anything we should know? — textarea, 500-char cap with a counter

Answered fields only are appended to the booking URL as `dc_entry`, `dc_clean`, `dc_park`, `dc_notes` (URL-encoded, truncated to 500). They are built inside the shared query builder, so the embed mode picks them up on the iframe `src` automatically when `BOOKING_MODE` flips. The same answers are added to the Step-3 CRM upsert.

## Technical notes

- `src/lib/bk-extras.ts` — home-type suppression for basement rows; remove `isMostAdded`.
- `src/lib/booking-redirect.ts` — drop `date` from `BookingUrlInput` and the query; add `dc_*` to `buildBookingQuery` (shared by redirect and embed).
- `src/lib/booking-redirect.test.ts` — new cases: no basement rows for apartment ids, `dc_*` only when answered and notes capped, `date=` never present.
- `src/components/quote/QuoteFlow.tsx` — inline savings card, urgency chips, travel radio, tile restyle, cleaner-details group, sticky-bar and price-card travel line, extended CRM payload.
- `src/components/quote/PricePanel.tsx` — labelled travel-fee line item.
- `src/lib/quote-submit.ts` + `supabase/functions/ghl-quote/index.ts` — carry `urgency` and the `dc_*` answers; they append into the existing `selected_extras` custom field (readable one-liner) so no new GHL field has to exist before this ships.
- `src/index.css` — green savings tokens.
