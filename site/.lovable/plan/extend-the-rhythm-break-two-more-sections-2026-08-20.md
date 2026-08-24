# Extend the Rhythm Break — Two More Sections

Same rules as the design elevation pass: visual voice only. No CTA moves, no copy-semantics changes, no pricing or funnel logic changes. Section order and content stay identical. Applied to both city homepages (Edmonton and Calgary) so they stay in sync.

## 1. Gallery section — asymmetric editorial split

Today "Real Edmonton Homes" is centered kicker → H2 → 6 equal tiles, which is the exact template rhythm we're breaking.

New layout at `lg` and up:
- Left column (sticky, ~1/3 width): the kicker, serif H2, one short existing supporting line, and the existing "View all" style link if present on that page. Nothing new is written.
- Right column (~2/3): the photo grid becomes an uneven mosaic — first tile spans two columns/rows, the rest fill around it — instead of six identical 4:3 boxes.
- Mobile stays a stacked 2-column grid exactly as now.

## 2. FAQ section — full-bleed tinted band

The FAQ currently sits in a boxed `bg-secondary/30` container like several neighbours. It becomes an edge-to-edge tinted band (soft navy-tinted surface with top/bottom borders, matching the "What's Included" treatment) and switches to a two-column layout on desktop: heading plus the existing "still have questions / call" block on the left, accordion list on the right. Accordion behaviour, order and copy are untouched.

To avoid two tinted bands colliding, the "Our Top Services" section directly above keeps its current background and the gallery section returns to plain page background.

## 3. Consistency and motion

- Both new layouts use the existing `motion-reveal` fade-up and `motion-lift` hover classes — no new animation types.
- Serif stays on H2 only; nothing inside the funnel changes.

## Technical notes

- Files touched: `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx` (section markup and classes only).
- Tint uses existing tokens (`bg-quote-shelf` / `border-quote-shelf-border`); no new colours.
- Verification: Playwright screenshots of both homepages at 1280 and 390 wide, confirming the FAQ accordion still opens/closes and no horizontal overflow from the full-bleed band.
