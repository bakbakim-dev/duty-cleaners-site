# Deep Cleaning guidance — consolidated

Deep Cleaning stays what BookingKoala says it is: a Standard clean plus the Deep Cleaning package (extras tier priced by home size). No new service, no new card, no extras menu, no change to the redirect/embed mechanics. What changes is where visitors can enter with a deep intent, and what the funnel says and sends once they do.

## Verified current state

- `src/data/pricing.ts` has no Deep Cleaning service; `resolveServiceId` already maps a `deep-cleaning` slug to `standard`. `addOnsFor(service, bedroomVariableId)` returns the `deep-cleaning` package with the exact tier price.
- `QuoteFlow.tsx` already has a local `deepCleanIntent` boolean, set only by clicking the banner. It is not driven by any URL flag, does not survive entry from another page, and does not affect Step 2/3 payloads.
- The overlay (`use-quote-overlay.tsx`) opens from any `#quote` anchor and reads `data-quote-service`; there is no intent channel.
- Step 3 shows one flat "First clean $X" figure plus a separate deep-clean guidance line; `confirmFields()` sends `first_clean_price = quote.firstClean` and no `addons`.
- The GHL relay (`ghl-quote`) builds tags as `["instant-quote", city, ("quote-confirmed")]` — no deep tag.
- `EdmontonPricing.tsx` and `CalgaryPricing.tsx` render a Deep Cleaning tab from hand-typed `deepPricing` arrays, not from bk-config.

## 1. The intent flag

One flag, two ways in, one meaning:

- `?intent=deep` in the URL (direct links, ads, service-page CTAs, pricing rows).
- `data-quote-intent="deep"` on any `#quote` CTA, since overlay CTAs don't navigate.

The overlay context carries `initialIntent`; `QuoteFlow` seeds `deepCleanIntent` from it and from the URL, keeps it across steps 1-3, and clears it only if the visitor picks a non-Standard service. Clicking the existing banner still sets it manually.

## 2. Entry points

- Hero service strip on `/` and `/calgary`: add a visible **Deep Cleaning** chip. It is not a new service — selecting it chooses Standard and opens the funnel with the deep flag.
- Service lists, city pages and footer: existing Deep Cleaning links get `?intent=deep`.
- Deep Cleaning service pages (Edmonton/Calgary): primary CTA carries the flag.
- Pricing pages: the Deep Cleaning tier cards stop using hand-typed numbers. A new helper in `pricing.ts` returns, per bedroom count, the Standard base plus the Deep Cleaning package tier straight from bk-config. Row CTAs carry the flag.

## 3. Funnel copy

**Step 1 — default (no flag):** one compact line above the cards, "Deep Cleaning" bolded — "Looking for a **Deep Cleaning**? Choose Standard — the package is added at booking, from $99.99."

**Step 1 — with flag:** replaced by the confirmed banner — "Deep clean — good choice. Pick Standard below; your Deep Cleaning package is priced by home size and added on the booking page."

**Move In/Out card:** keeps "Already includes deep cleaning." (already present).

**Step 3 — with flag:** the price block becomes a line item — "Standard clean $A + Deep Cleaning package $B (your home size) = First clean $TOTAL", with the existing "+ 5% GST" note and GST-inclusive figure recalculated on the total. Plus:
- recurring frequency chosen: "then $C/visit — recurring visits are Standard upkeep; the package applies to your first clean."
- One-Time chosen: "Most deep-clean customers switch to Bi-Weekly upkeep after — that'd be $C/visit."

**Handoff (Step 3 CTA area and the `/book` header) — with flag:** "Last step: tick 'Deep Cleaning' — it's the first item under Select Extras on the booking page. Your quote already includes it." No claim that it's pre-ticked.

Without the flag, nothing changes for Standard/Move In/Out visitors beyond the one compact line.

## 4. GHL payload

- Step 2 with the flag: tag `deep-intent` added alongside `instant-quote` and the city.
- Step 3 with the flag: `site_quoted_first_clean_price` = the deep TOTAL (Standard + package), and `selected_extras` includes "Deep Cleaning (package)" — so the office's quote-vs-booking check compares like with like.
- Without the flag: identical payload to today.

The flag travels as a validated `intent` field on the relay payload; tag and price composition happen server-side in `ghl-quote`, and the `quote_leads` backup row records it too.

## 5. Verification

1. Enter through a deep CTA (hero chip, pricing row, service page) and confirm the flag survives steps 1-3.
2. Check the line-item total against bk-config's Standard base and Deep Cleaning tier for two different bedroom counts.
3. Submit a test lead: contact carries `deep-intent`, the deep total in the quoted price, and the package in `selected_extras`.
4. Confirm the handoff line and `/book` header show the personalized instruction.
5. Enter the funnel directly with no flag: only the compact line appears, prices and payload unchanged.

## Technical notes

Files: `src/data/pricing.ts` (deep package + total helpers), `src/hooks/use-quote-overlay.tsx` (intent channel), `src/components/quote/QuoteFlow.tsx` (flag, copy, line-item, payload), `src/pages/Book.tsx`, `src/components/CityConversionIntro.tsx` (hero chip), `src/pages/EdmontonPricing.tsx` and `CalgaryPricing.tsx` (derived deep rows + CTAs), `src/components/Footer.tsx` and the Deep Cleaning service pages (flagged links), `src/lib/quote-submit.ts` and `supabase/functions/ghl-quote/index.ts` (intent field, tag, deep total, extras string). `booking-redirect.ts` is untouched.
