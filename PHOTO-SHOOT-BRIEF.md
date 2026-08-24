# Duty Cleaners — Hero Photography Production Brief

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
- **Subject position: the far-right 20–25% of the frame.** The left 60% must be quiet negative space / low-detail room, because the site feathers the photo into a cream panel on its left edge.
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
| Desktop crop | The site shows a **tall right-side slice ≈ 0.55:1** (about 26–32% of viewport width, full hero height ~680px). The subject and one home cue must survive a centre-right vertical crop. |
| Mobile crop | A **wide band, 240–320 px tall** (≈ 1.7:1). One unmistakable home detail with the worker at the right edge or just out of frame. Shoot loose enough that both crops come from the same frame, or supply a dedicated mobile alternate. |
| Safe zones | Nothing critical in the leftmost 15% (cream feather) or the extreme top/bottom 10% (mobile band crop). |
| Delivery | Full-res JPG (sRGB), plus 1600px web export per crop. |

## Consent checklist

- [ ] Signed model release from each photographed team member (commercial web use, no expiry)
- [ ] Homeowner property release, or use a styled/rented location
- [ ] No family photos, mail, documents, house numbers, or street views identifiable in frame
- [ ] Team member approves final selects before publication

## Alt text (use verbatim)

- Edmonton: `Duty Cleaners professional finishing a kitchen counter in a bright Edmonton home`
- Calgary: `Duty Cleaners professional straightening sofa cushions in a bright Calgary living room`

## Implementation plan (dev)

1. Drop final images into `site/src/assets/` as `edmonton-hero-real.jpg` / `calgary-hero-real.jpg`.
2. Swap the `heroImage` import in `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx`.
3. Tune the crop with the `heroPosition` prop on `CityConversionIntro` (CSS object-position, e.g. `"65% center"` to bias toward a right-placed subject) and pick `heroOverlay`: `default` | `light` | `muted`.
4. Keep everything else frozen — headline, quote card, CTA labels, trust copy — so the A/B test isolates the visual.

## Success measures (A/B vs current hero)

Decisive: **quote completion + booking rate** (a rise in starts that abandons more is not a win). Supporting: quote-flow start rate, tap-to-call, review click-through, 5-second comprehension test ("what does this company do — would you let them into your home?"). Retain the new hero only if it preserves or improves downstream completion.
