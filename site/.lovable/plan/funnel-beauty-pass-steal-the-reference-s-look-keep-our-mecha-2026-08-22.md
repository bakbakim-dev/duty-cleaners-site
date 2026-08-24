# Funnel beauty pass — steal the reference's look, keep our mechanics

The reference shots are the same 4-step flow we already run. What they do better is purely visual: a calmer warm canvas, a slimmer and more legible progress bar, chapter-numbered headings, one consistent field grid, and one authority moment on the final step. Nothing below changes steps, questions, pricing, validation, claims, or CTA destinations.

## 1. Canvas and rhythm

- Funnel surface moves from cold off-white to the existing warm paper tone (`--cream-50`), with the card content on white. Right now the overlay is one flat `--background` field, which is why it reads clinical.
- One consistent vertical rhythm: section gap, field gap, and control gap standardized instead of the current mix of `space-y-8` plus negative `-mt-6` hacks under headings.
- Content column widens slightly and centers, matching the reference's comfortable measure.

## 2. Progress bar (the biggest visual win)

Replace the current chip row + separate bar with the reference's two-tier header:

```text
INSTANT PRICE / 02        • About your home        50% complete
YOUR CLEANING CHECKLIST   Step 2 of 4 — About your home        50%
[========================------------------------]
```

- Slim eyebrow line, centred current-step label with a small orange dot, right-aligned percentage.
- One thin full-width track, orange fill, quiet teal-tinted remainder.
- Stays sticky at the top of the overlay so position is always visible.
- Same `aria-current` / live-region announcements as today.

## 3. Chapter heading block

Every step gets the same header pattern seen in the shots:

- Small square teal-tinted badge with the step number (`01`–`04`).
- Orange letter-spaced eyebrow ("ABOUT YOUR HOME").
- Fraunces serif headline (already in the system).
- The existing muted companion line directly beneath — kept, just spaced properly instead of pulled up with negative margins.

## 4. Callout rail

The "counting rule" and "we send this to BookingKoala" notes become the reference's left-orange-rule callout: pale grey field, 3px orange left border, small caps label on the left, sentence on the right. Replaces today's inline paragraphs and mismatched tinted boxes. Same wording.

## 5. Fields and controls

- Two-column responsive grid for paired questions (home type / bedrooms, full baths / half-baths) instead of the current single stacked column — halves the scroll on step 2.
- Uniform control styling: same height, same 1px teal-navy border, same radius across selects, chips, checkboxes and radios.
- Add-on shelf and frequency options become an even card grid with identical cell heights, aligned checkbox/radio at left, label bold, sub-line muted.
- Selected state stays deep ink with white text (unchanged), plus the already-built `motion-depth` shadow.
- Chips keep their tap targets; nothing drops below 48px.

## 6. Footer row per step

Standardize to the reference: underlined plain-text "Back" on the left, single orange pill CTA with arrow on the right, thin hairline rule above. Risk-reversal lines sit above that rule rather than crowding the button.

## 7. Final step (step 4)

- Serif headline with the italic orange second line, as shown.
- Deep-ink "PRICE AUTHORITY" card top-right (fixing the reference's own contrast slip — body text on it gets our `--fine-print-on-dark`, not a faded grey).
- Configuration summary in a bordered pale-teal strip.
- Live-price CTA block on a soft grey field with the orange button right-aligned.

## Guardrails

- No motifs (linen line, sun disc) enter the funnel — the existing rule stands.
- No copy semantics change: every question, label, price, disclosure and trust line stays exactly as written.
- No change to BookingKoala handoff params, postal-code precedence, or frequency logic.
- Colours come from existing tokens only; no new hues.

## Verification

- Playwright screenshots of all four steps at desktop and 390px mobile.
- Contrast check on the new warm canvas, callout rail, progress track, and the deep-ink price-authority card.
- Reduced-motion run.
- Existing 121 tests plus typecheck stay green.

## Technical notes

Work is confined to `src/components/quote/QuoteFlow.tsx`, `PricePanel.tsx`, `FrequencyChips.tsx`, `BookingHandoff.tsx`, `QuoteOverlay.tsx`, and a small block of funnel-scoped classes in `src/index.css` (progress header, callout rail, control sizing). A `StepHeader` and `Callout` component are extracted so all four steps share one implementation.
