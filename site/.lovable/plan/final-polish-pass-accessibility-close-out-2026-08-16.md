# Final Polish Pass — Accessibility Close-Out

No flow, pricing, or copy-meaning changes. Presentation, semantics, and one verification pass.

## 1. Target sizes
- Measure the Deep Cleaning hero-card link in the browser to confirm which element renders at 23px, then pad it to a 44px effective target (inline-flex + `min-h-11`, or padding where the layout is tight). Minimum accepted is 24px.
- Leaflet attribution links: add a scoped CSS rule in `src/index.css` giving `.leaflet-control-attribution a` at least 24px of vertical target via padding and line-height, without enlarging the visible control box awkwardly. If padding breaks the map chrome, keep it as-is and document the exemption in a comment (attribution is a third-party control, exempt under SC 2.5.8 "essential").

## 2. Fine print to 7:1
Raise the fine-print tokens to a slate-700-grade value (~7:1 on the light surface, and the dark-surface equivalent on navy):
- Travel-fee line in `QuoteFlow.tsx`
- GST notes in `PricePanel.tsx` and `QuoteFlow.tsx`
- `RiskReversalRow.tsx` text tone

Done through a new semantic token (e.g. `--fine-print` / `--fine-print-on-dark`) in `src/index.css` plus Tailwind config, not hardcoded colors.

## 3. Skip link
Add a "Skip to content" anchor as the first focusable element in the app shell (`src/App.tsx`), targeting `#main-content`. Visually hidden until focused, then pinned top-left with the standard focus ring. Ensure the page-level `<main>` elements carry `id="main-content"` and `tabIndex={-1}`.

## 4. Screen-reader completeness
- `PricePanel.tsx`: wrap the price figures in a container with `aria-live="polite"` and a concise composed sentence so a frequency change announces once ("First clean $169, then $143.65 per visit") rather than reading fragments.
- `QuoteFlow.tsx`: give each step an `<h2>` with `tabIndex={-1}` and a ref; on step change, focus that heading so the step number and label are announced. Skip the focus move on first mount so page load is not hijacked.

## 5. Error states
Audit and, where missing, correct step 2 contact validation:
- Inline message under each invalid field, `role="alert"`, at least 16px, using the destructive token at 4.5:1+.
- `aria-invalid` and `aria-describedby` wired to the message id.
- On failed submit, focus moves to the first invalid field.
- Confirm the relay-failure path renders the phone fallback and never advances to a price. Verified against the existing `submitQuote` contract (only a 2xx with a contact id counts as success).

## 6. Zoom reflow
Check the funnel and homepage at 320px width / 200% zoom for horizontal scroll, and fix any overflow found (typically fixed-width grids, the price sidebar, and the progress row) using wrapping and `min-w-0`.

## 7. Verification
Playwright + axe run across homepage, funnel steps 1–3, a city page, and a pricing page at both 1280px and 320px widths; plus keyboard walk-through of the skip link, step focus, and error focus. Report measured results.

## Technical notes
- Files touched: `src/index.css`, `tailwind.config.ts`, `src/App.tsx`, `src/components/quote/QuoteFlow.tsx`, `src/components/quote/PricePanel.tsx`, `src/components/quote/RiskReversalRow.tsx`, page `<main>` wrappers.
- No changes to `src/data/pricing.ts`, `src/lib/booking-redirect.ts`, or the GHL payload.
