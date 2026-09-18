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

## Bundle diet, same day: measured, nothing shipped

Three candidates from the entry-chunk table above, each measured before touching the tree.

- **Router swap.** Attributing the entry's *minified* bytes through its source map (not whole
  source files) put the whole react-router stack at 21 KB. A swap across 236 files would save
  about 5 KB gzipped. Dropped.
- **tailwind-merge.** An instrumented `cn()` recorded, across all 210 prerendered pages, 99
  distinct class lists where the merge removed a genuinely conflicting utility (the Button base
  `bg-primary` under a caller's `bg-accent`, `text-sm` under `text-base`, and so on). Without it
  those would be decided by stylesheet order. Kept.
- **Fewer chunks.** A `manualChunks` rule folding every lucide icon into one chunk and every
  image-URL module into another took the homepage from 27 script requests to 9 and, over the
  HTTP/1.1 harness, from 88 / FCP 2853 / LCP 3166 to 93 / 2406 / 2793; a higher
  `experimentalMinChunkSize` reached 94 / 2257 / 2718. Over **HTTP/2** (self-signed TLS, the
  protocol SiteGround serves) the three builds are indistinguishable: 96 / 1961 / 2487 for the
  committed build against 96 / 1955 / 2481 for both variants. The whole gain was the per-request
  round trip of HTTP/1.1, which a multiplexed connection does not pay. The fold also cost a
  blog post 150 ms (four files became six, one of them the 53 KB icon chunk). Not shipped.

What separates the HTTP/2 harness (96) from PageSpeed against the host (87 to 90) is the host:
about 100 to 150 ms of server time per request on top of the TLS round trip (curl TTFB 200 to
270 ms from here, TLS done at about 115 ms), which the simulator adds to every one of the
requests before paint. That is SiteGround's Apache path (NGINX Direct Delivery is off by the
owner's decision so the generated cache rules apply), not the bundle.

Harness rule from this: measure request-count changes over HTTP/2 (`lh-bench-h2.mjs` in the
session scratchpad: `http2.createSecureServer` + `--ignore-certificate-errors`), never over
the plain HTTP/1.1 server.

## Addendum, 2026-09-18: the "element render delay" in PageSpeed is not a second paint

A PageSpeed mobile run of the homepage reported an LCP breakdown of TTFB 10 ms, load
delay 390 ms, load duration 160 ms and **element render delay 2,240 ms**, which reads like
the hero being painted again after hydration. It is not. In a real Chrome on the host
(mobile viewport, full CPU) `PerformanceObserver('largest-contentful-paint', buffered)` returns
exactly one candidate: the hero `<img>` (the 960 candidate), painted at 788 ms, equal to first
contentful paint, with `__dcMounted` already true and no later candidate. createRoot replaces
the DOM but the replacement hero has the same source and size, so no new LCP entry is issued.
PageSpeed's figure is the simulator attributing the script dependency chain to the paint (the
byte-budget effect described above), not an observed repaint. Do not reopen SSR on the strength
of that number.

The same run's real findings were three 112-px hub thumbnails fetching a 480-px candidate (a
`?thumb` preset now serves 224/336/480) and a 1366-px desktop picking the 1672-px hero master
(a 1440 candidate now sits in the hero preset). The "forced reflow" at
`use-scroll-animation.tsx:25` is the first `getBoundingClientRect` after mount forcing the
full-page layout that the next frame would have run anyway: moved, not added.
