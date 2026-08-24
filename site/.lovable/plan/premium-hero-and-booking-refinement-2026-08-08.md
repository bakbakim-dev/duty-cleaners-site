# Premium hero and booking refinement

## Goal
Make the Edmonton and Calgary first viewport feel more premium and conversion-focused by bringing the quote journey visually closer to the hero, while preserving the existing Duty Cleaners navy/gold identity and Bookin60 form as the single quote source.

## Experience changes
1. **Hero composition**
   - Rework the shared `CityConversionIntro` hero into a more editorial, full-bleed composition inspired by the reference site: stronger authentic cleaning image presence, controlled navy treatment, clearer headline hierarchy, and less visual clutter.
   - Keep the city-specific H1, local phone action, and existing trust language; do not copy the reference brand, wording, or typography.
   - Make the primary “Get Your Free Quote” action the unmistakable focal point, with the phone action remaining a secondary fallback.
   - Preserve the four-item trust strip directly below the hero, but tune its spacing and visual weight so it reads as proof rather than another competing section.

2. **Hero-to-booking transition**
   - Add a compact booking-intent panel within the hero flow that clearly explains the next step and directs visitors to the existing `#quote` anchor.
   - Use a restrained progress/reassurance treatment around the CTA rather than recreating the vendor form or adding a second booking workflow.
   - Ensure navigation CTAs and in-page CTAs continue to land on the existing quote section without changing redirect behavior.

3. **Quote section presentation**
   - Reframe the existing quote section on Edmonton2 and Calgary2 as the intentional second act of the hero: stronger section heading, quieter supporting copy, and a more integrated form frame.
   - Keep the current iframe sizing, no-scroll behavior, desktop fit-to-viewport logic, and mobile behavior intact.
   - Maintain the quote section at the end of each page, as already established, while improving the visual continuity from the hero CTA to the form.

4. **Visual consistency**
   - Use the existing semantic `brand-navy`, `brand-gold`, `background`, `card`, and text tokens rather than introducing hardcoded colors.
   - Reduce competing rounded-card treatments and unnecessary effects in the hero/quote path; favor deliberate spacing, crisp borders, and subtle motion.
   - Respect reduced-motion preferences and keep tap targets accessible on mobile.

## Files in scope
- `src/components/CityConversionIntro.tsx`
- `src/pages/Edmonton2.tsx`
- `src/pages/Calgary2.tsx`
- `src/components/QuoteFormEmbed.tsx` only if a presentation wrapper adjustment is required; do not alter its form behavior without a validation need.

## Validation
- Check the Edmonton and Calgary routes at desktop and mobile widths.
- Verify the hero CTA, header CTA, and final CTA all reach the same quote anchor.
- Confirm the iframe remains fully usable without internal scrollbars or click-induced flicker.
- Check heading wrapping, image contrast, trust-strip alignment, and quote-section continuity in the first viewport.
