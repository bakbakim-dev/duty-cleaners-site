# Compact navy hero panel — the funnel entrance as an invitation

Only one item from that critique is still open: the hero card. The "COUNTING RULE" labeled callout already shipped in Step 1 of the funnel (orange-ruled `Callout` with the counting text), so nothing to do there.

## What changes

The hero currently shows the full Step 1 form: progress bar, heading, four service buttons, orange Continue, three risk-reversal lines, and the Airbnb/commercial paragraph. It reads as a form before the visitor has agreed to anything.

Replace it (hero placement only) with a compact deep-ink panel:

- Small orange eyebrow: `01 / 04 · CHOOSE YOUR CLEAN`
- One question in the editorial serif, white on navy: "What kind of clean do you need?"
- Four slim, full-width choice rows: Standard, Deep Cleaning, Move In / Move Out, Post-Construction. Selected row gets a gold left edge and a lighter ink fill; unselected rows are hairline-bordered on the navy field.
- One orange Continue button (unchanged behaviour: `openQuote(service, deepIntent)`).
- One fine-print line under it: "You won't be charged today" — the other two risk-reversal lines and the Airbnb/commercial paragraph move out of the panel and sit as a small muted line just below it, on the hero, not inside the card.

Panel keeps its current hero position over the photo, but becomes visibly smaller and lighter to read. All existing prewarm/hover-prefetch behaviour, service IDs, and the deep-intent flag stay exactly as they are.

## What does not change

- The `#quote` section lower on the city pages keeps the current white card — that placement is a genuine "do the work now" moment and the honesty of the full form is right there.
- No pricing, copy semantics, step count, routing, or CTA destinations change.
- No new motifs inside the funnel itself.

## Technical notes

- Add a `variant?: "form" | "ink"` prop to `src/components/quote/ServiceStartCard.tsx`; `ink` renders the compact navy panel, `form` keeps today's markup as the default.
- Hero call sites pass `variant="ink"`: `src/pages/Edmonton2.tsx` (line ~393) and `src/pages/Calgary2.tsx` (line ~387). `src/components/CityConversionIntro.tsx` stays on the default.
- Use `.surface-ink` plus `--brand-gold` / `--accent-on-dark` / `--fine-print-on-dark` tokens — no hardcoded colours. Contrast checked against the hero photo scrim.
- Tap targets stay at 48px minimum; the four rows stay real buttons with `aria-pressed`.

## Verification

- Playwright screenshots of the Edmonton and Calgary heroes at 1280px and 390px.
- Confirm Continue still opens the overlay at Step 1 with the right service, including the Deep Cleaning intent path.
- Existing 121 tests stay green.
