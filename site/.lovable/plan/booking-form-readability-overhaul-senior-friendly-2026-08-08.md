# Booking Form Readability Overhaul (Senior-Friendly)

## The problem (verified with screenshots)

1. **The form is shrunk to half size on laptops.** The `QuoteFormEmbed` "fit-to-viewport" feature scales the Bookin60 form down so the whole form fits on screen. On a typical 1366×768 laptop it renders at **0.5×** — field labels are effectively ~7px and placeholders are unreadable. This is the root cause of "hard to read."
2. **The card is too narrow to zoom.** The two-column section layout caps the form card at ~630px, so the form can't be enlarged where it currently sits.
3. **Mobile CTA covers the form.** On phones, the floating "Get Free Quote / Call" bar overlaps the form fields while visitors are filling them out.

## The fix: zoom IN, never shrink

Note: the form lives in a cross-origin vendor iframe, so its fonts can't be restyled directly — scaling the iframe is the only lever for making the form text itself bigger.

### 1. Invert the scaling logic — `QuoteFormEmbed.tsx`
- Desktop: zoom the form **UP to ~1.2×** (and never below 1×) using width compensation: iframe layout width = `100/1.2 %` with `transform: scale(1.2)`, so the widget reflows cleanly and renders bigger without clipping. Wrapper height = reported form height × scale.
- Keep the existing resizer, no-scroll lock, and validation debounce logic (no flicker regression).
- Remove the shrink-to-fit behavior entirely. Natural page scrolling while filling the form is normal and expected — readability wins.
- Mobile stays at natural 1× (the widget's mobile layout is already well sized).

### 2. Give the form room to be big — `Edmonton2.tsx`, `Calgary2.tsx`
- Restructure the quote section to a **single centered column**: intro copy centered above, form card below at `max-w-3xl` (~768px). The zoomed form becomes the hero of the section instead of a cramped sidebar.
- Post-construction pages: widen the form card from `max-w-[550px]` to `max-w-3xl` so the zoom fits there too.

### 3. Senior-friendly framing around the form
- **3 quick steps** line above the form: "1. Tell us about your home → 2. See your price → 3. Pick your time" — sets expectations and reduces form anxiety.
- **Prominent phone fallback**: "Prefer to book by phone? Call (780) 913-6565 — we're happy to help." Many older visitors bail on forms entirely; this catches them at the exact decision point.
- **What happens next** mini-list under the form (we confirm your price / we match a vetted pro / we arrive on time).
- Bigger trust pills and intro text (`text-sm`→`text-base`, badges `text-[11px]`→`text-sm`) in `QuoteFormIntro.tsx`.

### 4. Fix the mobile overlap — city pages
- Hide the floating "Get Free Quote / Call" bar whenever the `#quote` section is on screen (IntersectionObserver), so it never covers form inputs.

## Validation
- Playwright at 1366×768, 1280×800, 1920×1080, and 390×844: confirm zoomed form renders larger, no clipping, no horizontal overflow.
- Empty-submit click: confirm the debounced refit still prevents flicker at the new scale.
- Mobile: confirm floating CTA disappears inside the quote section and reappears elsewhere.

## Files touched
- `src/components/QuoteFormEmbed.tsx` — zoom-up scaling
- `src/components/QuoteFormIntro.tsx` — larger, clearer type
- `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx` — section layout, steps, phone fallback, CTA overlap fix
- `src/pages/EdmontonPostConstruction.tsx`, `src/pages/CalgaryPostConstruction.tsx` — wider card
