# Simply Maid-Inspired Design Recommendations

## What is worth borrowing

1. **One-action hero**
   - Use a full-bleed, authentic cleaning/interior image with a dark navy treatment so the brand and service are immediately clear.
   - Make the headline more direct and outcome-focused, with one dominant gold CTA: “Get Your Free Quote.”
   - Keep the phone action secondary and visible for visitors who prefer to call.

2. **Quote-first booking experience**
   - Borrow the reference site's strongest conversion idea: put the quote journey inside the first viewport rather than making visitors hunt through the site.
   - Keep Duty Cleaners' Bookin60 embed as the actual form source. Add a branded intro above it with a clear progress cue and reassurance, rather than rebuilding the form or adding another booking engine.
   - Make the form landing state predictable on desktop and mobile, with no competing CTA destinations.

3. **Compact trust strip under the hero**
   - Add a clean horizontal row of four trust signals immediately below the hero: bonded and insured, vetted professionals, non-toxic supplies, and the satisfaction guarantee.
   - Use icons, short labels, and consistent alignment so visitors can scan it in seconds.

4. **Three-step “How it works” section**
   - Reframe the process as: choose your service, get matched with a rigorously vetted pro, return to a clean home.
   - Use three authentic local cleaning or interior images with generous whitespace and numbered steps.
   - Keep the copy short and practical, matching the reference site's calm, low-friction tone.

5. **Guarantee as a visual promise**
   - Give the satisfaction guarantee its own high-contrast section, with the actual Duty Cleaners rule stated plainly: notify us within 24 hours after cleaning and we will re-clean the missed area at no additional charge.
   - Present the promise with one large icon, a concise explanation, and one supporting CTA instead of burying it in a list of benefits.

6. **Service comparison cards**
   - Borrow the reference site's clear service grouping: Standard, Deep, Move-In/Out, and Post-Construction.
   - Each card should show who it is for, the main included tasks, and a direct action. Use “transparent quote” language where pricing varies instead of invented starting prices.
   - Visually distinguish the most common service with a restrained “Most popular” marker, not a heavy badge treatment.

7. **People and proof, not generic claims**
   - Add a locally grounded “Meet the professionals” or “Why customers trust us” area using real Duty Cleaners team imagery where available.
   - Pair each profile or trust block with evidence such as screening, training, service area, or customer feedback. Keep “Rigorously Vetted Pros” as the preferred positioning.
   - Use the existing live Google review component as the source of review content and avoid unsupported review totals.

8. **Service-area selection as a guided path**
   - Adapt the reference site's city selector into a two-city Edmonton / Calgary choice with nearby community links underneath.
   - Use recognizable local references and maps to make the coverage feel specific, not nationwide and generic.

9. **Editorial rhythm and motion**
   - Use the reference's alternation between dark navy bands and bright content sections to create a more premium reading rhythm.
   - Keep motion subtle: fade/slide reveals, gentle card lift, and a restrained trust strip movement if needed. Respect reduced-motion preferences.

## What not to copy

- Do not copy Simply Maid's logo, typography, wording, Australian location structure, or exact layouts.
- Do not introduce unsupported numerical claims, fake-looking cleaner profiles, or review totals that conflict with Duty Cleaners' content policy.
- Do not use discount-code blocks or referral mechanics unless they are real business offers.
- Do not replace the existing Bookin60 form with a second custom quote flow; the form and its validation should remain the single source of truth.
- Do not use decorative gradient blobs or stock/product imagery. Keep the visual system anchored in Duty Cleaners' dark navy, white, and golden accent theme.

## Recommended priority

### Phase 1 — highest conversion impact

- Rework the Edmonton and Calgary hero sections around a clearer headline, primary quote CTA, phone fallback, and compact trust strip.
- Improve the quote section framing so the embedded form feels like part of the site rather than an external widget.
- Add the three-step process and guarantee sections in a more editorial sequence.

### Phase 2 — depth and credibility

- Rebuild service cards around included work and transparent expectations.
- Add locally grounded team/proof content and city selection.
- Standardize the same visual rhythm across the main city pages and key service pages.

### Technical notes

- Preserve semantic design tokens in `src/index.css` and the existing navy/gold theme.
- Reuse current Button, review, map, navigation, footer, and quote embed components instead of introducing parallel systems.
- Validate the quote form at desktop and mobile widths after any layout change, including empty-submit validation, iframe height stability, and anchor navigation.
