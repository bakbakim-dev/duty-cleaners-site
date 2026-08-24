# Polish the "Who We Help" Section

Elevate the persona grid on `/` (Edmonton) and `/calgary-2` to match the premium bar set by the recent "How It Works" and Trust sections — inspired by Simply Maid's audience framing, adapted to the Duty Cleaners navy/gold brand.

## What changes

### 1. New shared component: `src/components/WhoWeHelp.tsx`
- Both city pages currently duplicate this section inline. Extract it into one component with a `city` prop (Edmonton / Calgary) so future polish applies once.
- Copy stays city-specific via props (headline + intro line reference the city name).

### 2. Header treatment (matches the polished "How It Works" style)
- Gold-flanked uppercase eyebrow: `— Who We Help —` with the same `h-px` accent rules used in CityConversionIntro.
- Larger editorial headline: "Perfect for busy Edmonton homes." with a gold italic accent word via the existing `Accent` component.
- Intro line kept, tightened max-width for readability.

### 3. Card redesign (6 personas)
- **Navy icon chip with gold icon** (inverts to gold chip / navy icon on hover) — replaces the current light-primary wash, which reads flat next to the newer sections.
- **Gold top accent bar** that slides in on hover (`scale-x` transition), echoing the FAQ card hover borders.
- **Consistent card height** (`h-full`, flex column) so the 3-column grid rows align perfectly.
- **Refined typography**: `text-lg` bold titles, `text-sm` relaxed body, gold micro-label above each title (e.g. "For packed schedules") for scanability.
- Hover kept within the established standard: `-translate-y-1.5`, soft shadow, gold border — no 3D tilt.
- Fully responsive: 1 / 2 / 3 columns with generous gaps, 48px+ touch-friendly padding.

### 4. Section footer strip
- Slim trust line under the grid: gold-dot separators — `4,000+ Edmonton homes cleaned · Non-toxic products · Rigorously vetted pros` (Calgary gets its own stat).
- Small CTA anchor link "See your price in 60 seconds →" scrolling to `#quote-form`, styled per CTA psychology memory (solid, not ghost).

### 5. Wiring
- `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx`: replace the inline section with `<WhoWeHelp city="Edmonton" />` / `city="Calgary"`, removing duplicated card markup and unused icon imports.

## Technical details
- Files: new `src/components/WhoWeHelp.tsx`; edits to `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx`.
- Tokens only: `brand-navy`, `brand-gold`, `accent`, `muted-foreground`, `border` — no hardcoded colors; no color changes.
- Icons stay Lucide (Briefcase, Baby, PawPrint, Accessibility, Building2, Home).
- No content/copy rewrites beyond the micro-labels and trust strip; no changes to Mission/Values or Contact sections.

## Verification
- Playwright screenshot pass at desktop (1280px) and mobile (390px) on both city pages: alignment, hover states, anchor scroll target, no overlap with the mobile sticky CTA bar.
