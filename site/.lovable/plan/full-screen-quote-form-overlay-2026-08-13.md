# Full-Screen Quote Form Overlay

## Goal
Clicking any "Get Instant Quote" / "Get Free Quote" CTA opens the booking form as a full-screen takeover — nothing else on screen — so the form can be rendered as large as possible, from "Step 1 of 2 – About your home" down to the blue "Get My Instant Quote" button. Works on desktop and mobile.

## What the visitor sees
- The page dims and a full-screen panel takes over: a slim top bar with the Duty Cleaners wordmark, a "Five-Star Rated on Google" line, a phone fallback ("Prefer to book by phone? (780) 913-6565"), and a large close (X) button.
- Below that, the form fills every remaining pixel of the screen — no page header, no footer, no hero, no trust sections, no step strip.
- Closing returns the visitor exactly where they were, with no page reload.
- Mobile: same takeover, form at natural size, scrolls if it must; close button stays fixed and thumb-reachable.

## How the form gets bigger
The form lives in a vendor iframe, so scaling the iframe is the only lever. In the overlay the available height is the whole viewport minus the slim top bar (~64px), instead of today's page chrome (~235-260px) plus a narrow card. That alone is a large gain. On top of it:
- Zoom is computed to fit the full form height into that space, clamped between 0.85x and 1.6x (today's ceiling is 1.2x). On a 1249px-tall screen this lands meaningfully larger than the current rendering.
- Width also expands: the overlay gives the form up to ~900px of layout width instead of the current card.
- Existing stability guards are kept unchanged: max-tracked natural height, 300ms validation debounce (no flicker on empty submit), scrollbar lock, loading skeleton.

## Technical changes
1. **New `src/components/QuoteOverlay.tsx`** — full-screen dialog (portal + fixed inset-0, `role="dialog"`, `aria-modal`), body scroll lock, Escape to close, focus trap, fade/scale-in. Renders a compact header and `QuoteFormEmbed` in `variant="overlay"`.
2. **New `src/context/QuoteOverlayProvider.tsx`** (or a small zustand-free context in `src/hooks/use-quote-overlay.tsx`) — `openQuote()` / `closeQuote()`, mounted once in `src/App.tsx` so any CTA anywhere can trigger it.
3. **`src/components/QuoteFormEmbed.tsx`** — add an `variant` prop. `overlay` mode measures against `window.innerHeight - OVERLAY_CHROME` and uses the wider zoom clamp; `inline` mode keeps today's behavior for the in-page sections.
4. **CTA rewiring** — every control currently pointing at `#quote` calls `openQuote()` instead (preventing default) in: `Navigation.tsx` (desktop CTA, mobile menu, sticky mobile bar), `CityConversionIntro.tsx`, `WhoWeHelp.tsx`, `GetInTouch.tsx`, `ServiceDetailPage.tsx`, `Footer.tsx`, `Edmonton2.tsx`, `Calgary2.tsx`, `EdmontonPricing.tsx`, `CalgaryPricing.tsx`, and the post-construction pages' "Get Instant Price" buttons. Links keep their `href="#quote"` so they remain crawlable and right-click/new-tab still works.
5. **Deep links** — arriving with `#quote` in the URL (e.g. from another page or an ad) auto-opens the overlay instead of scrolling. `ScrollToTop.tsx`'s `#quote-form` correction logic is retired for that hash.
6. **In-page quote sections** — the existing `#quote` section on the city and post-construction pages stays as the fallback/SEO target, but is simplified: heading, trust line, and a single large "Open the quote form" button rather than a shrunken embedded copy, so the form is only ever rendered once at full size.

## Verification
- Playwright at 1887x1249, 1280x900, and 390x844: click the header CTA on `/` and `/calgary-2`, screenshot the overlay, and confirm "Step 1 of 2 – About your home" and the "Get My Instant Quote" button are both visible without scrolling on desktop.
- Empty-submit click inside the overlay: confirm no flicker or shrink.
- Escape and X close, body scroll restored, no scrollbar inside the iframe.
