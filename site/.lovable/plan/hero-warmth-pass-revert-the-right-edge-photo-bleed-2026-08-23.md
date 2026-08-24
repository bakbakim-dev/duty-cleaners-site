# Hero warmth pass + revert the right-edge photo bleed

## 1. Revert the half-bleed photography

Remove the `bleed-right` treatment added in the last pass:

- Deep Cleaning photo panel in the services chapter goes back to a normal contained card.
- The seasonal photo strip in the Edmonton service-areas section goes back inside the container.
- Delete the `.bleed-right` utility and the `overflow-x-clip` wrappers added for it.

Everything else from the warm-band pass stays.

## 2. Rebuild the hero as a warm split, not a darkened photo

The reference hero feels inviting because the photo is **not** darkened. It's a bright, real kitchen shown at full warmth on the right, and the words sit on a warm plaster-coloured panel on the left in dark ink. Ours currently stretches one photo across the whole hero and lays a navy scrim over it — that scrim is what reads cold and heavy.

New structure on desktop:

```text
+------------------------------+---------------------------------+
|  warm cream panel (~45%)     |  real interior photo (~55%)     |
|  eyebrow · trust line        |  full warmth, no navy scrim     |
|  H1 in dark navy serif       |                                 |
|  with italic orange accent   |   [ compact navy decision card  |
|  short subline               |     floating over the photo ]   |
|  three proof points          |                                 |
|  orange CTA + call link      |                                 |
|  "Before you book" note      |                                 |
+------------------------------+---------------------------------+
```

- **Left panel:** cream surface, navy headline, orange italic accent, gold-ink eyebrow. All existing copy and CTAs kept verbatim.
- **Right photo:** the existing real interior shot, warm-graded, no navy overlay and no brightness crush. A soft cream-to-transparent feather where it meets the panel so there's no hard seam.
- **Decision card:** the compact navy `ink` quote card floats over the photo (desktop), unchanged in content and behaviour.
- **"Before you book" note:** stays in the left panel under the CTA row.
- **Mobile:** photo on top at full warmth, cream panel with the text below it, decision card under the CTA — no overlay text on the photo, so contrast is never an issue.

Colour tokens stay exactly as they are; the change is which surface carries the text.

## 3. Double-check pass across the rest of the page

- Verify the band ladder still alternates cleanly with the new light hero (the hero is now light, so the section right after it needs to not be light-on-light).
- Check every band seam on desktop and mobile for hard colour jumps or doubled hairlines.
- Confirm no horizontal overflow at 375 / 768 / 1280 / 1920.
- Confirm heading, body, fine-print, and CTA contrast on the new cream hero panel clears the existing AA/AAA levels.
- Run the test suite and take Playwright screenshots at mobile and desktop.

## Technical notes

- Hero lives in `src/components/CityConversionIntro.tsx` — replace the absolute background image + gradient scrims with a two-column grid; keep `ServiceStartCard variant="ink"` as-is.
- Revert touches: `src/index.css` (`.bleed-right`), `src/components/CityServicesChapter.tsx`, `src/components/HomeRhythmStrip.tsx`, `src/pages/Edmonton2.tsx`.
- The Calgary page uses the same hero component, so it inherits the change automatically.
