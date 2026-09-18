# SSR + hydrateRoot spike — measured and declined (2026-09-17)

**Question.** The homepage's Lighthouse mobile LCP sits at about 3.1 s. `main.tsx` mounts with
`createRoot`, which throws the prerendered DOM away and paints the hero a second time; would a
real server render (`renderToPipeableStream` + `StaticRouter` + `HelmetProvider context`) with
`hydrateRoot` pull LCP down enough to justify migrating all 210 routes off `scripts/prerender.mjs`?

**Method.** One-off scratch build of the homepage only, nothing committed:
`App` took `Router`/`helmetContext` props, `main.tsx` switched to `hydrateRoot`, a server entry
rendered `/` with `onAllReady`, and the SPA shell got the same 26 `modulepreload` hints the
prerender snapshot carries. Both pages served with gzip from the same local harness, Lighthouse
12 mobile (simulated Slow 4G), three runs each, medians.

| build | score | FCP | LCP | LCP element render delay | TBT |
|---|---|---|---|---|---|
| committed prerender (createRoot) | 88 | 2853 ms | 3166 ms | 143–150 ms | 0 |
| SSR + hydrateRoot | 89 | 2854 ms | 3079 ms | 88–103 ms | 0 |

Hydration itself was clean: no React #418/#423, the server DOM was adopted (the h1 kept its
SSR text-node comments), title, canonical, description and all three JSON-LD blocks matched the
snapshot, and the quote toggles and menu worked.

**Why it barely moved.** FCP did not change, and FCP is where the time is. In the unthrottled
trace Chrome paints at about 115 ms, by which point 27 High-priority scripts (166 KB gzipped:
the 104 KB entry plus the route's 26 preloaded chunks), the hero image (30 KB, `fetchpriority=high`),
the stylesheet (22 KB) and the font (18 KB) have all finished. Lighthouse's throttling model
treats every VeryHigh/High request that ended before the observed paint as a prerequisite of the
paint, so it simulates 269 KB over Slow 4G before FCP: that is the 2.85 s. The double render
only accounted for the ~60 ms of "element render delay" that SSR removed.

**Decision.** Not migrating. A 210-route SSR pipeline (plus reproducing the prerender's tile
strip, preload strip, reveal rewrite and embed settling, and re-anchoring the dist guards)
buys about 90 ms of lab LCP and one point. The spike files were reverted; the server entry is
kept only in the session scratchpad.

**What the number says the lever is.** The High-priority byte budget before paint. Entry-chunk
composition by pre-minified source (365 KB minified, 104 KB gzipped):

| source | KB |
|---|---|
| react-router-dom + react-router + @remix-run/router | 308 |
| react-dom | 190 |
| tailwind-merge (`cn()`) | 73 |
| `App.tsx` route table | 50 |
| `legacy-urls.ts` | 29 |
| Navigation + Footer | 46 |

Candidates, none tried: a smaller router (the app uses `Routes`, `Link`, `useLocation`,
`Navigate` and a basename), dropping tailwind-merge for the handful of `cn()` merges that
actually conflict, and lazy-loading `legacy-urls.ts` behind the redirect route. Together
roughly 30–35 KB gzipped, so about 12% of the budget, worth maybe 0.3 s of lab FCP. Demoting
the chunk preloads to low priority is the other route to an early FCP, and it was tried and
reverted the same day: PageSpeed then counted hydration as blocking time (see the comment in
`scripts/prerender.mjs`).

Harness note: the earlier "hung" Lighthouse runs were a deadlock, a blocking `spawnSync` in the
same process as the static server Lighthouse was loading from. The bench now spawns
asynchronously.
