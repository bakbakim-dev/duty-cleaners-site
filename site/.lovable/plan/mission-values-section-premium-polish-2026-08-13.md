# Mission & Values Section — Premium Polish

## Goal
Bring the "Our Mission / Our Values" section up to the same premium standard as the new "Who We Help" section: shared component, editorial hierarchy, navy/gold icon chips, refined hover states — with zero copy loss and city-aware content.

## Current state
The section is duplicated inline in four routed pages:
- `src/pages/Edmonton2.tsx` (serves `/` and `/edmonton-2`) and `src/pages/Calgary2.tsx` — hover-lift cards with inline `preserve-3d` styles and `cursor-pointer` on non-clickable cards.
- `src/pages/Edmonton.tsx` (`/edmonton`) and `src/pages/Calgary.tsx` (`/calgary`) — plainer legacy cards; legacy Calgary uses a hardcoded purple `hsl(250,100%,50%)` that is off-brand, plus slightly older copy.

## Changes

### 1. New shared component `src/components/MissionValues.tsx`
Same architecture as `WhoWeHelp`, with a `city: "Edmonton" | "Calgary"` prop:

- **Mission block (top)**
  - Gold-flanked uppercase eyebrow: "Our Mission"
  - Editorial headline: `Making {city} homes cleaner,` + `<Accent>lives easier.</Accent>` (italic gold serif accent, matching Who We Help)
  - The mission paragraph stays word-for-word, centered, `text-lg leading-relaxed`, max-width constrained
  - Presented as a navy panel with gold border accent (replaces the flat gradient box) so it reads as the anchor of the section
- **Values grid (4 cards: Shield, Star, Clock, Heart)**
  - Section sub-eyebrow "Our Values" + one-line intro
  - Cards match Who We Help language: navy icon chip that inverts to gold on hover, sliding gold top accent bar, `-translate-y-1.5` lift, soft shadow, rounded-xl border
  - Micro-label above each title ("Safety", "Craft", "Dependability", "Local") for scannability
  - Remove `cursor-pointer` and `preserve-3d` inline styles from non-interactive cards
- **City-specific copy preserved**: Oilers/Rogers Place/River Valley for Edmonton; Flames/Saddledome/Bow River for Calgary (uses the newer Calgary2 wording, unifying the legacy variants)

### 2. Wire into all four pages
- Replace the inline Mission & Values markup in `Edmonton2.tsx` and `Calgary2.tsx` with `<MissionValues city="…" />`; prune now-unused icon imports.
- Replace the legacy inline blocks in `Edmonton.tsx` and `Calgary.tsx` with the same component — this also retires the off-brand purple in legacy Calgary and standardizes the copy.

### 3. Out of scope
- About Us page's separate mission block stays as-is (different content/structure).
- No color/token changes — uses existing `brand-navy`, `brand-gold`, `accent` tokens.

## Verification
Playwright pass at desktop (1280px) and mobile (390px) on `/`, `/calgary-2`, `/edmonton`, `/calgary`:
- Screenshot the section; confirm headline, navy panel, 4 value cards, and hover states render correctly.
- Confirm city-specific community copy per page.
- Confirm zero console/page errors and no floating CTA overlap regression.
