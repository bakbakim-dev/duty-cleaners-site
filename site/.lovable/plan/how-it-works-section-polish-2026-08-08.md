# How It Works section polish

## Goal
Make the shared “How it works” section on the Edmonton and Calgary city pages feel more premium, easier to scan, and more persuasive while preserving the existing Duty Cleaners navy/gold visual system and authentic process photography.

## Experience changes
1. **Stronger editorial hierarchy**
   - Refine the eyebrow, headline, and supporting copy so the section communicates a clear journey from quote to a reset home without repeating the hero language.
   - Improve max-widths, spacing, and line lengths so the heading reads confidently on desktop and remains comfortable for older visitors on mobile.

2. **Connected three-step presentation**
   - Rework the three image cards into a deliberate process sequence with equal visual weight, clearer 01/02/03 markers, and a subtle connector treatment on desktop.
   - Keep the sequence vertical and easy to follow on mobile, with the connector and numbering adapting without crowding text or imagery.
   - Preserve the existing process images and alt text; no stock or decorative imagery will be introduced.

3. **Premium interaction and polish**
   - Keep the existing restrained image zoom and lift interaction, refining borders, shadows, image framing, and label placement so the section feels intentional rather than card-heavy.
   - Respect reduced-motion preferences and keep all controls/tap targets accessible; this section will remain informational rather than adding a competing booking workflow.

4. **Responsive and regression validation**
   - Verify the section on the shared city-page flow at desktop, laptop, and mobile widths.
   - Check heading wrapping, equal card alignment, connector positioning, image loading, horizontal overflow, and console/runtime behavior.

## Technical details
- Update the shared `CityConversionIntro` process markup/styles so Edmonton and Calgary receive the same improvement.
- Use semantic design tokens and existing Tailwind theme classes only; do not introduce hardcoded colors or a new visual subsystem.
- Keep the current section order, page copy constraints, and downstream promise/quote flow unchanged.