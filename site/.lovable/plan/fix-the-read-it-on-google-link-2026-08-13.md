# Fix the "Read it on Google" link

## What's actually happening

Two separate things, one real bug and one preview-only artifact.

**1. The URL has junk on the end (real bug, my fault).**

The review links currently point at:

```text
https://www.google.com/maps?cid=8192121191672692049&hl=en#lrd=,1,,,
```

That `#lrd=,1,,,` fragment was meant to pop the reviews panel open, but the
real form of it needs Google's internal hex feature ID between `lrd=` and the
comma. With those slots empty it is meaningless — that's the "weird URL" you
saw. The `?cid=` part in front of it is correct and does resolve: I checked
both listings and each returns HTTP 200.

**2. The block is the preview frame, not the link.**

`www.google.com/maps` responds with `x-frame-options: SAMEORIGIN`, meaning
Google flatly refuses to be displayed inside anyone else's frame. The Lovable
preview runs your site inside an iframe, so when the click is handled inside
that frame instead of opening a real tab, Chrome kills it with
`ERR_BLOCKED_BY_RESPONSE`. Right-clicking bypasses the frame entirely, which
is exactly why that works.

The links already carry `target="_blank"`; the preview frame is not honouring
it. **On the published site, outside the preview iframe, these links will open
normally** — this is not something visitors will hit. Worth confirming on the
real domain after publish rather than trusting the preview.

## The change

Single edit to `src/lib/google-listings.ts`: drop the broken fragment so
`reviewsUrl` is the same clean, verified permalink as `url`:

```text
https://www.google.com/maps?cid=8192121191672692049
```

That lands the reader on the correct Google Business Profile with reviews
visible on the page. Nothing else needs touching — every consumer (footer
badges, review cards, `/reviews` buttons, legacy carousels, schema `hasMap`)
reads from this one file.

## Optional, only if you want the reviews tab pre-expanded

Deep-linking straight into the expanded reviews panel needs Google's hex
feature ID for each listing, which I'd have to pull by resolving your two
share links again. It is cosmetic — the reviews are on the profile page
either way — so I'd skip it unless you specifically want that behaviour.

## Not covered here

The review text is still hardcoded. This plan only fixes the citation URL.
