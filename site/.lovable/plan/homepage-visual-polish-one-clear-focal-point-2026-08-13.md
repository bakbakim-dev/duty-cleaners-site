# Homepage Visual Polish: One Clear Focal Point

Goal: make the first screen feel like a premium local service brand — one dominant headline, one vivid action, one piece of real proof — instead of many competing surfaces. Navy/orange identity stays; nothing below the hero changes structurally.

## 1. One action colour

Orange (the existing accent token) becomes the only colour used for booking buttons, site-wide. Gold is demoted to what it does best: star ratings, small labels, dividers, icon marks, and premium detail.

- Hero primary CTA, header CTA, mobile sticky "Get Price", and the gold buttons in deeper sections all become orange.
- The secondary phone action becomes a quiet outlined/ghost link, not a second heavy button.

## 2. Hero hierarchy

- H1 becomes the single dominant element: larger, tighter tracking, slightly more line-height, and rebalanced into intentional lines so "Edmonton" is never stranded with a dash at a line end. The gold italic accent stays on one short phrase only.
- One orange CTA plus the reassurance line beneath it. The phone option sits beside it as a text link.
- The "A simpler way to book" 1-2-3 row moves out of the left column and into the quote card, where it belongs.
- The four-item hero trust strip becomes three items with stronger icons and higher contrast; the most persuasive proof (verified Google rating + the 24-hour re-clean guarantee) moves up next to the CTA.

## 3. Verified proof beside the CTA

A compact proof block directly under the hero CTA: gold stars, the rating claim, and a linked "read the reviews on Google" citation using the existing verified listing link. The guarantee line ("Tell us within 24 hours and we'll re-clean at no extra charge") sits with it.

## 4. Quote card as a raised surface

The navy-on-navy outlined panel becomes a lighter, tactile card: a solid light surface with a real shadow and a thin gold top rule, so it reads as a distinct object floating on the hero rather than a faint outline.

Inside it: the three steps get numbered circles connected by a subtle progress line, then a single orange "See My Instant Price" button that opens the full-screen quote overlay.

## 5. Hero photograph

Generate a brighter, authentic-feeling hero image: a real Edmonton-style home interior with a cleaner mid-task, naturally lit. Soften the navy overlay so the subject is clearly recognizable while text contrast stays accessible. A matching Calgary variant is generated too. The ambient video layer stays but at lower opacity so it never muddies the photo.

## 6. Header simplification

Primary desktop nav trims to five items: Services, Pricing, Service Areas, About, More. Slightly larger nav type and more breathing room between items. One phone link, one orange CTA. The announcement bar becomes shorter and lower-contrast so it stops competing with the header.

## Scope

Presentation only — no copy rewrites beyond the hero headline rebalance and step labels, no section reordering, no backend or form-logic changes. Calgary's hero receives the identical treatment so the two cities stay consistent.

## Technical notes

- `src/components/CityConversionIntro.tsx`: hero grid, H1 rhythm, proof block, raised quote card, 3-item trust strip.
- `src/components/Navigation.tsx` + `src/components/AnnouncementBar.tsx`: spacing, type scale, orange CTA, quieter bar.
- Colour changes use existing semantic tokens (`accent` for actions, `brand-gold` for emphasis); a `--shadow-card` style token is added to the global CSS for the raised card rather than ad-hoc shadow classes.
- Gold-to-orange button sweep across `Edmonton2.tsx`, `Calgary2.tsx`, and shared CTA components.
- New hero assets generated into `src/assets/`.
- Verify with desktop (1280 and short 900px-tall) plus mobile screenshots, and confirm text contrast over the lightened photo.
