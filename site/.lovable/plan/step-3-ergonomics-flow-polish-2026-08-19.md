# Step-3 ergonomics + flow polish

## 0. bk-config re-capture — blocked in this environment

The sandbox cannot reach BookingKoala: a request to the live booking form returns **403** (Cloudflare bot challenge), same as during the embed work. So I can't pull a fresh snapshot myself — please send the fresh export and I'll swap it in.

Two things I verified in the current snapshot (`captured_at: 2026-08-15`) that matter regardless of the export:

- Home types are real option ids in the config: 90 Two Storey House, 89 Two Storey Townhouse, 54 Bungalow, 56 Basement Suite Only, 55 Apartment or Condo.
- Basement extras still list **55 (Apartment or Condo)** in their `variables` — matching your "stale" report.
- More important: the shelf resolver filters extras by service and **bedroom option only** — home type is never considered. So even with a fresh export, condos would still see the basement group. That filtering gap is fixed as part of this work.

**Fix:** extend the resolver to filter on the full set of chosen option ids (home type + bedrooms), so a row must be valid for every one of them. Once your fresh export lands, condos/basement suites show no BASEMENT group, houses/townhouses/bungalows show all three, and the dev coverage guard is widened to check home types too.

## 1. Sticky summary bar (Step 3)

Bottom-anchored bar: live "First clean $169 → $228.99" (aria-live polite) plus a "Choose my date & time" button reusing the existing in-page CTA handler. Always on mobile; on desktop it appears only while the in-page CTA is off-screen (IntersectionObserver on the CTA). ≥48px tall, `env(safe-area-inset-bottom)` padding, with matching bottom padding on the scroll container so it never covers the last content. Hidden when the booking embed is mounted (item 6).

## 2. Auto-advance on decisive answers

- Step 1: choosing a service card smooth-scrolls to "What type of home?"; choosing a frequency scrolls Continue into view.
- Step 3 shelf tiles: no auto-scroll (browsing, not a question).
- Never scroll on select/dropdown focus — only after a committed choice.
- All scrolling respects `prefers-reduced-motion` (instant jump instead of smooth).

## 3. Section peek

Tune Step-3 group spacing/padding so the next group heading sits partially in view at 812px and 1249px viewport heights. Verified with browser screenshots at both heights. No arrow indicators.

## 4. Color rhythm

- Price block: soft warm cream card, subtle border, slight radius.
- Add-on shelf: cool near-white card behind each group; small-caps headings unchanged.
- Frequency + CTA zone: plain white.
- Orange stays exclusive to primary CTAs; selected states stay filled navy — and the same filled-navy treatment is applied to the pets Yes/No control and the travel-fee checkbox so every answered control reads as answered.
- New surfaces added as semantic tokens in `index.css` (no hardcoded colors), checked for AA body contrast and 7:1 on fine print.

## 5. Kill the repeated service question

When the hero card already picked a service, Step 1 opens with a collapsed chip — "Standard Cleaning ✓ — change" — and moves focus to "What type of home?". The full service-card grid renders only after "change", or when no service was preselected. Progress bar and step count unchanged.

## 6. Embed readiness (note only)

The sticky bar's visibility condition is written so it is suppressed once the BookingKoala embed container is mounted — no further change needed when `BOOKING_MODE` flips to `embed`.

## Technical notes

- `src/lib/bk-extras.ts`: resolver signature moves from `bedroomOptionId` to a set of selected option ids; `listExtrasFor`, `resolveExtra`, `petsExtraFor`, `travelFeeExtraFor`, and `findCoverageGaps` follow.
- `src/lib/booking-redirect.ts` and `src/data/pricing.ts` updated at call sites; existing tests extended with a condo-vs-house basement case.
- `src/components/quote/QuoteFlow.tsx`: sticky bar, collapsed service chip, scroll-on-commit helper, spacing and surface changes.
- `src/data/bk-config.json` swapped wholesale when you supply the fresh export.
