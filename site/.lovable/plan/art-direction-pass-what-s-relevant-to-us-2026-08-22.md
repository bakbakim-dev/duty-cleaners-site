# Art-Direction Pass — what's relevant to us

Most of the doc's structural ideas already shipped last round (asymmetric services + checklist chapters, threshold/linen line, coverage band, eyebrow underline draw). This plan takes only the parts that are genuinely new or still half-done, and drops the parts that conflict with our system.

## 1. Material tokens (formalize what we're already doing by hand)

Add two named surface recipes to the design system so sections stop hand-rolling tints:

- **Warm paper** — cream surface, 1px hairline rules, no heavy shadow. For reading/editorial sections.
- **Deep ink** — existing navy, for authority moments (pricing band, Promise, final CTA). Orange stays action-only.

Apply them to the homepage and service pages in place of the current ad-hoc `bg-secondary/30` / `bg-white` mix, keeping the existing alternation so no two adjacent sections match.

## 2. Motif set — finish it (2 of 3)

- **Linen line**: already shipped as `ThresholdLine` (hero edge, checklist rail, coverage). Tighten it to the doc's rules: cap opacity, hide below 768px, and add it to the footer top edge. No new placements.
- **Sun disc**: small hand-drawn inline-SVG mark (~14px) replacing the dash/plain text start of section eyebrows across marketing sections.
- **Duty tab**: skipping — the header logo block is a wordmark in a solid teal plate already; a second tab reads as clutter, and touching the logo is a brand decision, not an art-direction one.

Hard rule enforced in review: zero motifs inside funnel steps, forms, payment copy, error/confirmation states.

## 3. Nav glass (chrome only)

Nav is currently `bg-background/95 backdrop-blur-md`. Add an `@supports not (backdrop-filter: blur(0))` fully-solid fallback and confirm the alpha stays at 0.95. No translucency anywhere else — funnel card and controls stay solid.

## 4. Remaining editorial moments

Two sections still read as equal cards:

- **Services stacked column** (shipped last round): promote "Deep Cleaning" to a vertical photo panel and "Move-In / Move-Out" to a full-width deep-ink band with a small key-handoff annotation line. Same links, same copy, same CTA positions.
- **Reviews / guarantee**: offset pull-quote treatment using the pattern already used in the Promise section.

## 5. "Life regained" companion lines (4 positions only)

One muted 14–15px line under existing headings, additive only — nothing operational is replaced or promised:

| Position | Line |
|---|---|
| Funnel step 1 heading | "Start with what would make this week feel easier." (already shipped on the Services chapter — move/duplicate to step 1) |
| Funnel step 2 (details) | "A clear scope means fewer surprises at the door." |
| Step 3 price card | "Know the number before you give up the afternoon." |
| Frequency / recurring | "Keep the reset without rebuilding the plan each time." |

Nowhere else. Judgment-Free and all trust claims untouched.

This is the one place the doc puts text inside the funnel; it's copy, not motif, so it stays within the funnel constraints.

## 6. Home-rhythm imagery in the coverage section

The coverage band already takes a domestic interior crop. Extend it to a three-slot seasonal set (morning-light entryway, snow-season mudroom, spring window detail) built so owner-supplied photos drop straight in. Until then it uses existing real interior shots — no skylines, no landmarks, no AI people, no generated art.

## 7. Micro-motion tightening

Existing reveal utilities get the doc's durations: eyebrow underline draw 120–180ms (already 180ms), selected-tile depth gain 150ms, image reveal fade + 2% scale ≤200ms. All under `prefers-reduced-motion: no-preference`, nothing moves layout, nothing delays interaction.

## 8. Hero

Already carries the warm interior, funnel overlap, orange top border, and linen line. Remaining: verify the scrim gives ≥4.5:1 against the worst-case region of the hero photo (measured, not assumed) and strengthen it if it fails.

## Not adopting

- Citrus/sea-glass palette — conflicts with navy/gold.
- Glass/translucency on any text-bearing panel.
- "Duty tab" logo mark (see above).
- Any raster or AI-generated motif art.

## Verification

- Contrast check on every surface the motifs and new tokens touch, worst-case backgrounds.
- Playwright screenshots of all three funnel steps confirming zero motif presence.
- Nav rendered with `backdrop-filter` disabled to prove the solid fallback.
- Reduced-motion run showing all animations disabled.
- Companion lines present at exactly the four positions and nowhere else.
- Existing 121 tests stay green.

## Technical notes

Tokens land in `src/index.css` + `tailwind.config.ts`; motifs are inline SVG components beside `ThresholdLine.tsx`; section recomposition touches `CityServicesChapter.tsx`, `CityCoverageGrid.tsx`, `Edmonton2.tsx`, `Calgary2.tsx`; companion lines touch `QuoteFlow.tsx`, `PricePanel.tsx`, `FrequencyChips.tsx`.
