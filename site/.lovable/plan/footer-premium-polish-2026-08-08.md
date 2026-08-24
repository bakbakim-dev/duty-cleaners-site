# Footer Premium Polish

## Goal
Refine the footer into a more premium, conversion-friendly closing section inspired by Simply Maid while keeping Duty Cleaners’ existing dark navy, white, and gold brand system.

## Planned changes
1. Add a compact closing CTA band above the footer columns with a clear “Get a Free Quote” action and a secondary click-to-call option.
2. Reorganize the footer into clearer groups:
   - Brand, trust message, social links, and existing certifications
   - Explore / company links
   - Residential and specialty cleaning services
   - Locations and office contact details
3. Make locations more useful at a glance by presenting Edmonton, Calgary, and the all-locations hub as intentional navigation items rather than only office labels.
4. Preserve the existing review-platform and certification content, but improve its visual hierarchy so it reads as one cohesive trust area rather than a collection of separate blocks.
5. Apply premium interaction details: consistent heading alignment, quieter dividers, gold hover/focus states, subtle link movement, and minimum 48px interactive targets on mobile.
6. Improve mobile behavior with a cleaner stacked order, better spacing around phone/hours information, and a bottom legal row that remains easy to scan.
7. Keep all current working destinations, external-link security attributes, phone numbers, office details, business hours, and legal links intact. Do not add unsupported review counts, discount promises, or new data collection.

## Technical details
- Update only the shared footer component and use existing semantic theme tokens/classes; do not introduce hardcoded color values.
- Keep the footer responsive across the current desktop and mobile layouts.
- Validate the rendered footer at desktop and mobile widths, including link destinations, keyboard focus visibility, and absence of horizontal overflow.
