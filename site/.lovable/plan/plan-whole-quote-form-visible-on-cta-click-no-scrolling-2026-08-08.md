# Plan: Whole Quote Form Visible on CTA Click — No Scrolling

## Goal
When a visitor clicks any "Get Instant Quote" / "Get Free Quote" button, they land on the quote section with the **entire form visible in the viewport** — from "What type of service would you like?" down to the "Get My Instant Quote" button — with no scrolling up or down needed to fill it out.

## Current Problem
- The form renders at a fixed 1.2x desktop zoom (~1,400px tall), far taller than any viewport, so visitors must scroll while filling it out.
- CTA buttons anchor to the top of the quote **section**, so visitors land on the heading/step strip and must scroll down just to reach the first question.

## Changes

### 1. Fit-to-viewport form scaling — `src/components/QuoteFormEmbed.tsx` (desktop only)
- Replace the fixed 1.2x desktop zoom with a **computed zoom that makes the whole form fit the viewport**:
  - `zoom = availableHeight / naturalFormHeight`
  - `availableHeight = viewport height − sticky nav (~96px) − form-card header (rating/badges, ~150px) − small margin`
- Clamp the zoom to a sane range: **up to 1.2x** on tall screens (keeps the senior-friendly enlargement when there's room), **never below ~0.8x** so text stays readable. On very short laptop screens where 0.8x still can't fit, the form stays at 0.8x and only a minimal scroll remains.
- Keep the existing width-compensation technique (`width = 100/zoom %`, `transform: scale(zoom)`) so the vendor widget reflows naturally at any zoom — no clipping, no gutters. Works the same for scaling down (<1) as up (>1).
- Keep all existing stability guards unchanged: max-tracked natural height, 300ms validation debounce (no flicker), scrollbar lock, loading skeleton.
- **Mobile (<1024px): unchanged** — natural 1x size; a phone screen physically cannot show a ~1,180px form at a readable size, so the widget's well-proportioned mobile layout stays as-is.

### 2. Land directly on the form, not the section heading
- Add `id="quote-form"` to the form card wrapper on all 4 pages that use the embed:
  - `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx`, `src/pages/EdmontonPostConstruction.tsx`, `src/pages/CalgaryPostConstruction.tsx`
- Update `src/components/ScrollToTop.tsx`: when the URL hash is `#quote`, scroll to `#quote-form` (with sticky-nav offset) instead of the section top — so after **any** CTA click (header, hero, floating bar, in-page or cross-page), the card top sits right under the nav and the scaled form fills the screen. Falls back to the section anchor on pages without a form card (e.g. Move In/Out pages keep current behavior).
- No CTA links need to change — they all already point to `#quote`.

### 3. Tighten the space above the form (desktop)
- Reduce the quote section's top padding and heading-block margin on desktop (`lg:py-20` → tighter, smaller `mb-10`) so even the section heading remains reachable with one small scroll-up, and the landing position maximizes form height.

## What stays the same
- No changes to the form vendor, colors, branding, or copy.
- Move In/Out pages (local forms) and mobile layout are untouched.

## Verification
- Playwright at 1280x900 and 1887x1249: click "Get Instant Quote" in the header on `/edmonton-2` and `/calgary-2` — screenshot confirms the full form (first question → submit button) is visible without scrolling.
- Regression checks: validation-click stability (no shrink/flicker), no scrollbar in the iframe, mobile (390px) lands correctly at natural size.
