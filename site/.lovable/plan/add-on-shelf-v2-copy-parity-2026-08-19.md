# Add-on shelf v2 + copy parity

Step 3 of the quote funnel gets a grouped, fully visible add-on grid, and four copy fixes bring the booking page's important notes into the funnel where the decisions are made.

## Part A — Shelf redesign

1. **Remove the expander.** "Show all add-ons (N more)" and its state go away; every applicable add-on renders immediately.
2. **Grid layout.** 2 columns at ≥768px, 1 column below, equal-height tiles per row. The funnel content column widens on desktop (the overlay is capped at `max-w-5xl` today) so the grid and price sidebar both have room.
3. **Groups.** Small uppercase, letter-spaced, muted subheadings: KITCHEN, DEEP CLEAN, WINDOWS, BASEMENT, OUTDOOR & OTHER. Grouping is a display layer keyed off extra names over the existing resolver output — the item list is never hardcoded. Unmatched names fall into OTHER; a group with no applicable items doesn't render.
4. **Tiles.** Whole tile is the toggle (≥44px, 16px text), backed by a visually hidden real checkbox with the tile as its label — Tab reaches it, Space toggles, visible focus ring, state announced. Line 1: name + bolded price. Line 2: the supplied benefit copy at 14px muted (omitted when an extra has none). Quantity items (window blinds, De-cluttering) keep a −/+ stepper inside the tile with "+$15/set" and "+$69.99/hr" pricing. Selected = filled navy, white text, checkmark, "Added" label — not colour alone.
5. **"★ Most added"** badge on Inside Oven and Inside Fridge only.
6. **Live total** between grid and CTA: "First clean $169 → $288.99 (2 add-ons)", `aria-live="polite"`.
7. **Deep-clean contradiction fix.** The "add it on the booking page — first item under Select Extras" line is deleted. Deep Cleaning is a tile. With deep intent active the tile renders pre-selected and the copy reads "Your Deep Cleaning package is included below."
8. **Unchanged:** nothing else pre-selected, no urgency or confirmshaming, CTA never gated or moved, resolver-driven IDs, unresolvable extras hidden and logged, GHL basket payload as-is.

## Part B — Copy parity

1. Under the Bedrooms label on Step 1, always visible, 14px muted: "Count offices, dens & bonus rooms as bedrooms — we price by home size, not rooms cleaned. Only want some rooms done? Still count them all."
2. Sub-line under "Want to add anything? (optional)": "These aren't part of the standard checklist — add only what you need."
3. Under the Step 3 price block: "Not happy? We re-clean within 24 hours of notice — free."
4. Handoff line becomes: "Pick your time, answer 3 quick questions, add your address & card — about 2 minutes."

No entry-method, cleanliness, parking or notes questions are added to the funnel.

## Technical notes

- `src/lib/bk-extras.ts`: add a name→group mapping and benefit-copy map, plus a `groupExtras()` helper over `listExtrasFor()` output. `FEATURED_EXTRA_PREFIXES` / `FEATURED_COUNT` stay only if still used for the "most added" badge; otherwise removed.
- `src/components/quote/QuoteFlow.tsx`: drop `shelfExpanded`, `hiddenShelfCount`, `shownShelf`; render grouped grid; pre-seed the Deep Cleaning entry in `addOns` when `deepCleanIntent` is set (so it flows through the existing URL builder and GHL basket rather than the separate deep-intent path — verified single source of truth before wiring); add the live-total line; apply the four copy edits.
- `src/components/QuoteOverlay.tsx`: widen the container on desktop.
- Booking URL builder, resolver semantics, pricing data and GHL payload shape are untouched. Existing tests must stay green.

## Files

`src/lib/bk-extras.ts`, `src/components/quote/QuoteFlow.tsx`, `src/components/QuoteOverlay.tsx`
