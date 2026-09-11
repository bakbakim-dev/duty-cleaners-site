# Duty Cleaners — Hero Photography Production Brief

> **Updated 2026-09-10.** The subject-position line, the crop map and the dev implementation plan were rewritten to match the current hero in `site/src/components/CityConversionIntro.tsx`. The earlier version described a cream feather on the left edge, a tall right-side slice and a single JPG swap, none of which exist any more. The shot, styling, consent and alt-text sections are unchanged.

**Purpose:** Replace the AI-generated hero imagery on the Edmonton and Calgary landing pages with original, documentary-style photography of real Duty Cleaners professionals. One approved frame per city, plus safety alternates.

**Why:** An asset audit (Aug 2026) found every "cleaner" image in the site library is AI-generated (visible artifacts: garbled uniform text, warped gloves). Research cited in the hero recommendation shows consumers prefer real service imagery for high-involvement in-home services, and AI imagery reads as impersonal and less credible. An interim fix is live; this shoot produces the final trust asset.

---

## The shot: "A home that feels like yours again"

An editorial, unposed finishing moment. A real Duty Cleaners team member completing work in a calm, sunlit home — **the peaceful after, not the labour**. The visitor should feel: *a capable local person is helping restore a real home, with care and without judgment.*

### Shot list (per city)

| # | Scene | Action | Priority |
|---|-------|--------|----------|
| 1 | Kitchen, morning light | Cleaner smoothing a cloth across a finished counter, weight settled, gaze down at the surface | **Hero primary** |
| 2 | Living room | Lightly straightening a cushion on a sofa, three-quarter view | Hero alternate |
| 3 | Bedroom / bath doorway | Placing a folded towel on a made bed or towel bar | Hero alternate |
| 4 | Entryway | Cleaner stepping back from a tidy entry, coat hooks and clean floor visible | B-roll / process cards |
| 5 | Detail | Hands-free result shots: counter with kettle, sofa corner with throw | B-roll / process cards |

**Do NOT shoot:** foreground spray bottles, rubber-glove close-ups, sparkle effects, before/after splits, mid-scrub action, multiple faces in one frame, luxury mansions.

### Subject & styling

- One identifiable, **consented** Duty Cleaners team member per city. Profile or three-quarter view; a soft, natural downward gaze beats a camera smile.
- Clean branded or plain uniform in navy/charcoal (no loud logos needed; no text that can blur).
- **Subject position: centre to centre-right.** Keep the left third quiet and low-detail. On desktop the headline sits there over a navy wash, and the quote card fills a column on the right edge, so the clearest view of the photo is the middle of the frame. See the crop map below.
- Home: customer-approved or styled to feel like a believable Edmonton/Calgary home — not a showroom. 2–3 warmth cues max: pale wood, linen, a matte ceramic, one plant, a folded throw.
- Calgary bonus (optional): a window glimpse that reads as Calgary (foothills/skyline) — only if it stays soft and out of focus.

### Light & colour

- Soft **neutral-warm daylight**, late-morning window light, moderate contrast. Calm morning — not a catalogue shoot, not an orange "cozy" filter, no cool blue shadows, no dramatic luxury lighting.
- Palette: cream, oat, pale oak, muted sage, soft charcoal; subtle echoes of brand navy/rust. Avoid teal, clinical blue, vivid primaries, saturated red.
- Finish: minimal retouching; slight natural grain OK. **No** artificial bokeh, HDR, film borders, or anything that could read as synthetic.

---

## Technical & crop map

| Spec | Requirement |
|------|-------------|
| Source file | Landscape 3:2, minimum **3200 × 2133 px** (RAW + edited JPG) |
| How the site shows it | **Full-bleed**: the photo fills the whole hero section (`object-cover`, `sizes="100vw"`) under a navy ink wash, with the headline and the quote card on top. There is no cream panel or side slice. |
| Desktop crop (≥1024 px) | A landscape frame at least 620 px tall (`lg:min-h-[620px]`). The wash runs left to right: darkest behind the headline on the left, fading to transparent at about 74% of the width on the "soft" scrim and 84% on the "strong" one. The quote card sits in a right-hand column up to 23rem wide. The subject and one home cue should sit centre to centre-right and still read if the card overlaps the right edge. |
| Mobile crop (<1024 px) | The same full-bleed photo behind stacked text and the quote card, so the section is taller than it is wide and `object-cover` crops to a **portrait slice of the frame's centre** (or wherever `heroPosition` points). The wash runs top to bottom across the whole width and dims the entire photo, so on phones it reads as atmosphere. The home cue must survive a narrow centre crop. |
| Safe zones | Keep the left third low-detail (headline area on desktop). Keep the subject away from the extreme left and right edges, because the phone crop keeps only the centre. |
| Delivery | Full-res JPG (sRGB). One frame serves both layouts. There is no separate mobile export: `heroImageMobile` is accepted by `CityConversionIntro` but unused. |

## Consent checklist

- [ ] Signed model release from each photographed team member (commercial web use, no expiry)
- [ ] Homeowner property release, or use a styled/rented location
- [ ] No family photos, mail, documents, house numbers, or street views identifiable in frame
- [ ] Team member approves final selects before publication

## Alt text (use verbatim)

- Edmonton: `Duty Cleaners professional finishing a kitchen counter in a bright Edmonton home`
- Calgary: `Duty Cleaners professional straightening sofa cushions in a bright Calgary living room`

## Implementation plan (dev)

1. Export each approved frame as **.webp at 640, 960, 1280 and 1920 px wide**, plus a full-size file for `src`. Add them to `site/src/assets/` using the current pattern: `hero-room-<city>-640w.webp`, `-960w`, `-1280w`, `-1920w`, next to the base `hero-room-<city>.webp`. The existing Edmonton set is named `hero-room-edmonton-manus*`. **Budget:** the hero rendition a phone downloads must be ≤100 KB (`BUDGET.hero_kb` in `site/src/data/page-weight.test.ts`), and so must every image asset in the build. The "200 KB" in commit 45ca010's message is not the enforced value. No full-resolution JPG goes into `src/assets`.
2. Replace the `edmontonHeroRoom*` imports in `src/pages/Edmonton2.tsx` and the `calgaryHeroRoom*` imports in `src/pages/Calgary2.tsx`, the base file and the four width variants. `HERO_SRCSET` in each file feeds the `heroSrcSet` prop and the per-route preload, so all four variants must be present. Update `heroAlt` to the alt text above.
3. Tune the crop with the `heroPosition` prop on `CityConversionIntro`, a CSS object-position: Edmonton uses `"center"` today and Calgary `"center 58%"`; use e.g. `"60% center"` to bias toward a centre-right subject. Pick `heroScrim`: `"strong"` (the default, for dim rooms) or `"soft"` (keeps bright rooms bright and leans on text shadows; Edmonton uses it). `heroOverlay` is declared but unused, so setting it changes nothing.
4. Rebuild and run the dist tests (`bunx vite build`, `bun run prerender:all`, then `bunx vitest run`) so `page-weight.test.ts` checks the new hero against its budget.
5. Keep everything else frozen — headline, quote card, CTA labels, trust copy — so the A/B test isolates the visual.

## Success measures (A/B vs current hero)

Decisive: **quote completion + booking rate** (a rise in starts that abandons more is not a win). Supporting: quote-flow start rate, tap-to-call, review click-through, 5-second comprehension test ("what does this company do — would you let them into your home?"). Retain the new hero only if it preserves or improves downstream completion.
