# Design Elevation Pass — Visual Voice Only

Goal: close the identity gap (typography, imagery, rhythm) without touching a single conversion mechanic. No CTA moves, no step changes, no price math changes, no copy-semantics changes. Navy/orange stays the flag.

## 1. Editorial serif for marketing display type

- Self-host Fraunces (woff2, two weights: 400 and 700) in `src/assets/fonts/`, loaded with `font-display: swap` from `src/index.css`.
- Register as `font-display` in the Tailwind theme, add a `.display-serif` treatment: negative tracking (~-0.02em) and fluid `clamp(2.5rem, 5vw, 4.5rem)` for h1, a smaller clamp for h2.
- Apply to marketing h1/h2 only: homepage (Edmonton), Calgary, service pages, pricing pages, about.
- Explicitly NOT applied: all body copy, all UI chrome, and every surface inside the quote funnel (`src/components/quote/**`). Eyebrow kickers stay exactly as they are.

## 2. Imagery triage

- Remove the step-2 "two cleaners" photo on the Edmonton homepage (`teamNidaySeval` in the `processImages` trio) and swap in a neutral real interior shot from the existing gallery assets until a real team photo is supplied. Audit the remaining `src/assets/team` and hero photos for other AI-looking people shots and list what I find rather than silently swapping them.
- Warm the hero: regenerate the Edmonton and Calgary hero images toward warm daylight (or warm-grade the existing frames) so the first impression reads "welcoming home", not "lab". Overlay opacity is retuned only as needed to keep text contrast passing.
- New `BeforeAfterGallery` component for "Real Edmonton/Calgary Homes": pairs are read from a data file that ships empty; when empty, the section renders a designed placeholder state (no broken frames, no fake pairs) or hides entirely. Owner drops real photos into the data file later.

## 3. Break the template rhythm (two sections only)

- Guarantee section on the city homepages becomes an asymmetric split: large serif pull-quote left, compact proof column right.
- One adjacent section runs full-bleed tinted (soft navy-tinted band edge to edge) instead of a boxed container.
- Section order and content stay identical.

## 4. Funnel summary card upgrade

On the Step-3 price surfaces (`PricePanel` sidebar/compact and the sticky bar):

- Green "Saving $XX.XX" pill when a recurring frequency is active — reuses the existing savings value already passed in, no new math.
- Secondary "Pay $0 today" pill.
- One-line itemized count, e.g. "Standard · 2 add-ons".
- Star-rating line is added only if a real review-count constant exists in `src/data/proof.ts`. It is currently `null`, so this line does not ship in this pass.

## 5. Bedroom / bathroom number chips

Replace the three Step-1 dropdowns with tappable number chip rows: bedrooms 1–7, full baths 1–7, half baths 0–4, minimum 44px targets, radio-group semantics with keyboard support. The existing sqft/size-cap label for the selected value appears as a caption under the chip row so no information is lost. Values, labels, and downstream pricing wiring are unchanged.

## 6. Micro-motion (three only)

Inside `@media (prefers-reduced-motion: no-preference)`, 200–400ms:
1. Card hover lift + shadow.
2. Section fade-up on first scroll into view.
3. The existing price-update flash (kept, timing normalized).

No new marquees, no video backgrounds, no loops.

## 7. Explicitly not adopted

Dark funnel variant, form-field emoji, tab-title bait, pastel palette, serif anywhere inside funnel UI.

## Technical notes

- Fonts: self-hosted woff2 + `@font-face` in `src/index.css`; `fontFamily.display` added to `tailwind.config.ts`. Preload the h1 weight only.
- Files touched: `src/index.css`, `tailwind.config.ts`, `index.html` (font preload), `src/components/CityConversionIntro.tsx`, `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx`, service/pricing/about pages (heading class only), `src/components/quote/PricePanel.tsx`, `src/components/quote/QuoteFlow.tsx` (Step-1 chips only), plus a new `src/components/BeforeAfterGallery.tsx` and its empty data file.
- Verification: Playwright screenshots at 1280 and 390 wide for homepage, Calgary, and funnel Steps 1 and 3; contrast check on the warmed hero; confirm the funnel renders zero serif and that reduced-motion disables all three interactions.
