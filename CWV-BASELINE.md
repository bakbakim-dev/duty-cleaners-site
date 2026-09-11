# Core Web Vitals baseline — pre-launch

> **Historical / superseded in part (note added 2026-09-10).** The numbers
> below are the pre-fix baseline of 2026-09-01, kept for comparison. Do not
> plan work from them without checking the current state first:
>
> - **Script.** Commit 45ca010 (2026-09-09) found every page shipping 179 KB
>   of gzipped JavaScript and cut the entry to 142 KB. The later performance
>   round took it to 100 KB; `site/src/data/page-weight.test.ts` records
>   137–178 KB of script per page, a 20 KB stylesheet and heroes of 14 to
>   76 KB (measured 9 September 2026).
> - **Leaflet.** The "Leaflet is properly code-split" finding below was
>   wrong. The prerenderer had frozen Leaflet's preload into the HTML of 55
>   pages. Since 45ca010 every map is a lazy shell behind a visibility gate,
>   and the prerenderer strips the baked preload.
> - **Hero.** The hub heroes now carry a 640/960/1280/1920w srcset with
>   `sizes="100vw"` (`HERO_SRCSET` in `site/src/pages/Edmonton2.tsx` and
>   `Calgary2.tsx`), so a phone gets the 640w file (25 KB on the homepage,
>   per `site/src/components/CityConversionIntro.tsx`), not the 177 kB one.
> - **Budgets are enforced** by `site/src/data/page-weight.test.ts`
>   (`BUDGET`), per money page: HTML ≤60 KB gzipped, CSS ≤28 KB gzipped,
>   scripts ≤170 KB gzipped (220 on support pages), the hero's phone
>   rendition ≤100 KB, any single body image ≤100 KB, and images ≤800 KB in
>   total. Separately, every image asset in `dist/assets` must be ≤100 KB. The
>   "hero under 200 KB" in 45ca010's commit message is not the enforced value.
>
> Headroom items 1 and 2 below are therefore largely done; check them against
> the test before starting on them.

Measured 2026-09-01 against the built, fully prerendered site served locally
(`bunx vite preview`, port 4178), homepage `/`.

**Read the caveat before using these.** Local timings are not field data: TTFB
was 5 ms and load 58 ms over loopback, which tells us nothing about what a
customer on mobile LTE will see. What is meaningful here is the *structure* —
byte counts, request shape, and layout stability — because those are the parts
we control and they carry over to the real thing. Field LCP and INP can only be
collected once the site is live and Search Console starts reporting.

## What was measured

| Metric | Value | Note |
|---|---|---|
| **CLS** | **0** | No layout shift at all. This one *is* real — it does not depend on network. |
| Prerendered document | 227.1 kB | Uncompressed. Large because the page ships its content as HTML rather than fetching it. |
| Render-blocking CSS | 143.2 kB | `index.css` 128.5 kB + `leaflet.css` 14.7 kB |
| Main JS bundle | 376.1 kB | 94.3 kB gzipped, module-deferred so not render-blocking |
| Hero image (LCP candidate) | 177.2 kB | `hero-room-edmonton-manus.webp` |
| **Critical path** | **547.5 kB** | document + blocking CSS + hero, uncompressed |
| Requests on first paint | 24 | |
| Images in the homepage DOM | 19 | |
| — eager | 4 | hero + three small badges |
| — lazy | 15 | working correctly; the gallery does not load until scrolled |
| All images if fully scrolled | 1,674 kB | the five before/after gallery photos are 220–336 kB each |

## What is already right

- **CLS is zero.** Every image carries explicit `width`/`height`, so nothing
  reflows as assets arrive. This is the vital most sites fail and it needs no work.
- **Lazy loading is real.** Only the hero and three badges load eagerly. The
  1.67 MB of gallery imagery is never fetched by a visitor who does not scroll.
- **Leaflet is properly code-split.** Its stylesheet appears on exactly 3 of the
  209 pages — the ones that actually render a map — not sitewide.
- **Content is prerendered**, so first paint does not wait on JS execution.

## Where the headroom is, in priority order

1. **The five gallery photos (1.3 MB combined).** At 220–336 kB each these are
   the largest single cost on the page. They are below the fold and lazy, so they
   do not hurt LCP — but they hurt anyone on a metered connection who scrolls.
   Re-encoding at a lower quality or serving smaller variants via `srcset` would
   cut most of it without a visible difference.
2. **The 177 kB hero.** This is the LCP element on the homepage. Halving it is
   the single most direct LCP improvement available.
3. **128 kB of render-blocking CSS.** Tailwind ships the whole utility surface;
   whether that is worth splitting depends on real LCP once measured.

## Re-measure after launch

None of the above substitutes for field data. Once the site is live:

- Search Console → Core Web Vitals, for real LCP/INP/CLS by URL group.
- PageSpeed Insights on `/`, `/pricing/` and one location page, which reports
  both lab and (once traffic exists) field numbers.

Re-run the local structural check with:

```
cd site && bun run build && node scripts/prerender.mjs --all && bunx vite preview --port 4178
```
