# Warmer, more "homey" homepage — no rebrand

The reference page doesn't feel homey because of different colours — it uses the same navy/teal + orange + cream family we already have. It feels warmer because of **how the page is built**: warm paper backgrounds instead of white, big real-home photography that bleeds to the page edge, generous breathing room, and magazine-style alternating bands. That's what we adopt.

## Direction: keep the palette, change the temperature

Keep navy, gold, and orange exactly as they are. Shift the *default page surface* from cool off-white to the warm cream we already defined (`--cream-50`), and reserve pure white for cards and the funnel. That single change makes every existing section read warmer without touching brand identity.

## What changes

1. **Warm paper base**
   Marketing sections on the homepage sit on cream instead of cool grey-white. Cards, price panels, and anything inside the quote funnel stay white for maximum legibility.

2. **Magazine band rhythm**
   Sections alternate in a deliberate ladder — cream → white → cream → ink (navy) — with a soft hairline between bands instead of hard colour jumps. Roughly one dark ink band per screenful-and-a-half, not two back to back.

3. **Photography that breathes**
   The hero photo extends to the right page edge with the warm grade already in place. Two existing sections (services chapter and coverage) get a full-bleed or half-bleed real interior photo instead of a boxed image. No AI imagery, no stock product shots.

4. **More air**
   Increase vertical section padding and the gap between headline and body copy. Cap marketing paragraph width around 62 characters so text sets like a magazine column rather than a wall.

5. **Soft edges and light shadows**
   Slightly larger corner radius on marketing cards and a low, warm shadow instead of the current flat borders. Funnel controls keep their current radius and hit areas.

6. **Editorial detail carried through**
   The Fraunces headline + italic orange accent treatment already on the hero gets applied consistently to every marketing section heading, with the small orange eyebrow label above each one.

## What does not change

- No colour token values are replaced; only which surface is used where.
- No CTA moves, no copy meaning changes, no pricing or funnel logic touched.
- Funnel steps, tap targets, and contrast levels stay exactly as they are (all AA/AAA checks preserved).

## Technical notes

- Add `surface-paper` / band-rhythm utility classes in `src/index.css` built on existing `--cream-50`, `--blue-grey-100`, and `--brand-navy` tokens.
- Apply band classes at the section wrappers on the homepage (`/`, the Edmonton page) and its chapter components: `CityConversionIntro`, `CityServicesChapter`, `CityIncludedChapter`, `JudgmentFree`, `CityCoverageGrid`, `DutyCleanPromise`.
- Verify with Playwright screenshots at desktop and mobile, and confirm the existing test suite stays green.

## Rollout

Homepage first. Once you're happy with it, the same band rhythm gets rolled to the Calgary page and service pages in a follow-up.
