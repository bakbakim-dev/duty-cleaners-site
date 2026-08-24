# Visual Direction — What's Worth Taking

The document is written against a teal/citrus palette that isn't ours, and several of its recommendations (authentic photo system, price-first hero, familiar controls, no fake proof, reduced-motion respect) are already in place. Below is only what is genuinely new and compatible with the navy/gold system.

## Adopt

1. **Asymmetric moment per major section.** The homepage still leans on equal-height card grids. Give the three heaviest sections one asymmetric composition each:
   - "Our Top Services" — promote Standard cleaning to an oversized panel with a real interior crop, the other three as a stacked column beside it.
   - "What's included" — offset the checklist against a side caption rail instead of an even grid.
   - Recent cleans / coverage — full-width tonal field with an annotation instead of a card row.
   Same content, same links, same CTA positions.

2. **Two-layer copy ("life regained").** Keep every practical label; add one short human line beneath section headings on marketing surfaces only:
   - Choose your service → "Start with what would make this week feel easier."
   - Review your price → "Know the number before you give up the afternoon."
   - Recurring → "Keep the reset without rebuilding the plan each time."
   Never inside funnel questions or price copy.

3. **Signature threshold line.** A single fine, low-contrast contour line (doorway/folded-linen suggestion) as an SVG at the hero's bottom edge and as the divider between marketing chapters. One reusable component, low opacity, decorative-only, never behind text.

4. **Micro-motion with meaning.** 120–180ms accent underline draw on marketing headings when they enter view, and a quiet depth gain on the selected service tile. Nothing that delays the funnel, shifts layout, or runs under reduced-motion.

5. **Service-area module as home life, not tourism.** Replace the generic framing above the Edmonton/Calgary coverage grid with seasonal domestic imagery already in the gallery set (entryway, mudroom, morning light) and a one-line local framing. No skylines, no landmarks.

## Not adopting

- Teal/citrus palette and "misted glass" surfaces — conflicts with the locked navy/gold theme.
- Sun-disc motif and a redesigned header "blue tab" — header stays as-is per the doc's own guardrail.
- New photography commissioning — the authentic local photo set is already in place.
- Anything touching funnel structure, price authority, or the BookingKoala handoff.

## Technical notes

- New `ThresholdLine` SVG component in `src/components`; used by `CityConversionIntro` and homepage section dividers.
- Motion added via existing `use-reveal-on-scroll` hook and `index.css` reduced-motion guards (already present at lines 341/367/418).
- Asymmetric layouts are Tailwind grid changes inside `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx` plus `CityCoverageGrid`; no data or route changes.
- All new surfaces use existing tokens (`cream-50`, `blue-grey-100`, `brand-navy`, `accent`) — no new hues.
