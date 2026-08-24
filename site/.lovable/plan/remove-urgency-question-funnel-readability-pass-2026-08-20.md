# Remove urgency question + funnel readability pass

## 1. Remove "How soon do you need it?"

The chips, their heading and helper line, the `urgency` state, and the `Urgency: ...` entry in the CRM payload all come out. Nothing replaces it — the space closes up so the section flows straight from the cleaner-details fields into the price/CTA zone.

## 2. Reduce visual fatigue with clearer colour zones

Step 3 is currently one long white scroll. Each block gets its own calm surface so the eye can find its place:

- Add-on groups: cool near-white cards, unchanged headings.
- Cleaner details: neutral light-grey card, clearly separated from the add-ons.
- Price + savings: warm cream card, recurring savings stays green.
- CTA zone: plain white so the orange button is the only strong colour on screen.

Orange stays reserved for primary CTAs; selected states stay filled navy. All surfaces are added as semantic tokens in `index.css` (no hardcoded colours) and checked for AA contrast in body text, 7:1 on fine print.

## 3. Readability and rhythm

- Consistent question typography: 18px bold question, 14-15px muted helper line, uniform spacing between questions.
- Wider gaps between groups, tighter gaps inside a group, so grouping is visible without borders doing all the work.
- Labels and helper text on a single measure (max ~65ch) so long lines don't sprawl on wide desktops.
- Add-on tiles keep their current structure; only spacing and line-height are tuned for scanability.

## 4. Accessibility

- Every group wrapped in a `fieldset`/`legend` (visually styled as the existing headings) so screen readers announce the question with each option.
- All chip/radio groups get proper roles and keyboard arrow-key navigation; focus rings visible on every interactive element.
- Tap targets at least 48px tall throughout, including the quantity steppers.
- Live price updates announced once via a single `aria-live="polite"` region (no duplicate announcements from sticky bar and price card).
- All motion respects `prefers-reduced-motion`.

## Technical notes

- `src/components/quote/QuoteFlow.tsx`: remove urgency state/UI/payload line; restructure Step-3 section wrappers, typography scale, fieldsets and aria-live.
- `src/index.css`: new semantic surface tokens for the detail and add-on zones.
- `src/lib/quote-submit.ts` / `supabase/functions/ghl-quote/index.ts`: no schema change needed — urgency was only appended into the existing extras string, so it just stops being appended.
