# Video Upgrades Inspired by Simply Maid

## What Simply Maid does with video

1. **Full-bleed ambient hero video** — their hero is not a photo, it's a muted, autoplaying, looping background video of a real home interior with people in it. A dark gradient overlay keeps the headline and booking card readable. The video fades in softly once loaded (`opacity` transition), sits absolutely positioned with `object-cover`, and uses `autoplay loop playsinline preload="none"` for performance.
2. **A second ambient video mid-page** — their "Background-checked, trained, and top-rated" section also uses a looping background video as the visual anchor instead of a static photo.
3. **Human, in-home footage** — the footage shows real people in a real lived-in home, which makes the brand feel warm rather than corporate.
4. **Restraint** — no video player chrome in the hero, no sound, no controls. Video is atmosphere; the one control-based player never competes with the booking flow.

Our situation: we already have a real 78-second team video (`public/videos/duty-cleaners.mp4`, 720p), but it only appears as a standard player with controls in the "Gallery & Video" section of the Edmonton and Calgary pages. The hero above it is a static photo.

## Proposed changes

### 1. Ambient hero background video (the big win)

- Update `src/components/CityConversionIntro.tsx` so the hero plays `duty-cleaners.mp4` as a muted, looping, autoplay background behind the headline and quote panel (same pattern as Simply Maid: absolute fill, `object-cover`, navy overlay on top, soft fade-in once the video can play).
- Keep the existing hero photo as the `poster` and as the fallback image, so first paint is instant and nothing looks broken while the video loads.
- Respect `prefers-reduced-motion`: visitors with reduced-motion settings see the static photo, not the video.
- Performance: `preload="metadata"`, lazy start, and an optional compressed ~20s loop version (cut with ffmpeg from the existing file, roughly 1–2MB) so the hero stays fast on mobile data.

### 2. Polish the "Meet Duty Cleaners" player section

- Restyle the Gallery & Video player on the Edmonton and Calgary pages into a premium framed card: navy frame with soft shadow, gold play affordance on the poster before playback, and a caption bar (title + runtime).
- Add a "Key moments" line under the video (e.g., team intro, supplies, in-home cleaning, final walkthrough) — we already use this pattern on the older Calgary page and it aids scanning.
- Add `VideoObject` JSON-LD schema so the video is eligible for Google video rich results.

### 3. Optional: ambient video accent band

- Reuse the compressed loop as a subtle background in one dark section (e.g., the guarantee/promise band) on the two city pages, mirroring Simply Maid's second ambient video. Only if you want it — it can be dropped without affecting items 1–2.

## What stays the same

- No third-party embeds or iframes (YouTube/Vimeo) — self-hosted HTML5 video only, per our media policy.
- No changes to the Bookin60 quote embed, colors, fonts, or page copy.
- The static hero photo remains the poster/fallback everywhere.

## Technical notes

- Files touched: `src/components/CityConversionIntro.tsx`, `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx`, plus a new compressed clip in `public/videos/` and optional `src/lib/video-schema.ts`.
- Verify on desktop and mobile widths: hero text contrast over video, autoplay muted behavior, reduced-motion fallback, and no layout shift when the video fades in.
