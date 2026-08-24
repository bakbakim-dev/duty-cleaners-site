# Deep Cleaning: native prefill at the booking handoff

BookingKoala accepts `extras[<id>]=<quantity>` in the booking URL. The Deep Cleaning package is extra ID 148. With that, a deep-intent visitor lands on the booking page with the package already ticked, so the handoff copy becomes a confirmation instead of an instruction.

## What changes

1. **Booking URL builder** — when the visitor carries deep intent, the query gains `extras[148]=1`. Because the redirect URL and the embedded `/book` iframe are both built from the same query builder, one change covers both. Without the flag, no extras parameter is added at all.

2. **Handoff copy flips to confirmation** in three places:
   - Step 3 price screen note (currently "Last step: tick Deep Cleaning…")
   - Step 3 "Step 4 takes about a minute" line
   - `/book` page header line
   
   New wording: "Your Deep Cleaning package is already added — just pick your time."
   
   The non-deep variants stay exactly as they are (including the "+$X on the booking page" upsell line for visitors without the flag).

3. **Everything else from the consolidated spec stays untouched**: `?intent=deep` entry points, Step 1 banner states, the Move In/Out "already includes deep cleaning" sub-label, the Step 3 line-item quote with GST note, the recurring "then $C/visit" line, the Bi-Weekly gateway line, and both GHL payloads (deep-intent tag at Step 2; package + deep total at Step 3).

## Technical notes

- `src/lib/booking-redirect.ts`: add `export const DEEP_CLEANING_EXTRA_ID = 148;` beside the other BookingKoala ID maps, and an optional `deepClean?: boolean` field on `BookingUrlInput`. In `buildBookingQuery`, when true: `params.set(\`extras[${DEEP_CLEANING_EXTRA_ID}]\`, "1")`. `URLSearchParams` encodes the brackets as `%5B148%5D` automatically, matching the verified format. `buildBookingUrl` and `buildBookingEmbedUrl` inherit it with no edits.
- `src/components/quote/QuoteFlow.tsx`: pass `deepClean: deepCleanIntent` into the `buildBookingQuery` memo (and add it to the dependency array). Update the two copy blocks. The `&intent=deep` flag on the `/book` navigation stays — it still drives our own header copy.
- `src/pages/Book.tsx`: it strips `intent` before handing the query to the iframe; `extras[148]` is part of the BK query and passes through untouched. Update the deep-intent header sentence.
- `src/lib/booking-redirect.test.ts`: add cases for (a) deep intent producing `extras[148]=1` on both the redirect URL and embed src, (b) no flag producing no `extras` key, (c) a recurring frequency still carrying the package param while the site's recurring price stays Standard-only.

## Verification

- Unit tests as above.
- Browser run: enter the funnel from a Deep Cleaning CTA, reach Step 3, confirm the line-item total, click through and confirm the resulting BookingKoala URL carries `extras%5B148%5D=1` and the booking page shows Deep Cleaning ticked with the correct tier for the chosen home size.
- Recurring check: the on-site recurring "$C/visit" figure remains Standard upkeep only.
- No-flag check: booking URL has no extras parameter and nothing is pre-selected.
- Embed mode is still gated behind the custom domain; `extras[148]=1` + `embed=true` gets verified on production when that flag ships.
