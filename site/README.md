# Duty Cleaners — marketing site (runbook)

The rebuild of dutycleaners.ca: a Vite + React + TypeScript site (shadcn-ui, Tailwind) that is
prerendered to static HTML (209 pages) and deployed to Netlify. It serves Edmonton and Calgary,
shows live prices generated from the BookingKoala config, sends leads to GoHighLevel, and hands
bookings off to BookingKoala.

**Status (2026-09-10): not live yet.** DNS for dutycleaners.ca still points at the old WordPress
site. The public preview is https://dutycleaners-preview.netlify.app, which is deliberately noindexed.

This folder started as a Lovable project. Lovable is no longer part of the workflow: the site is
built, tested and deployed from this repo. (`lovable-tagger` is still a dev dependency in vite.config.ts.)

## Commands

Run everything from `site/`, with [bun](https://bun.sh) installed.

| Command | What it does |
|---|---|
| `bun install` | Install dependencies |
| `bun run dev` | Dev server on port 8080 (the predev step regenerates post dates, sitemaps and redirects) |
| `bunx vite build` | Fast build only, no generators |
| `bun run build` | Full build: the prebuild generators re-date the sitemaps and post dates from git and regenerate redirects and .htaccess, then run vite build |
| `bun run prerender:all` | Prerender all 209 pages into `dist/` (about 47 s). The dist tests read this output, so rebuild instead of leaving them red |
| `bunx vitest run` | Test suite (32 files, about 1,556 tests). There is no `test` script in package.json |
| `bun run typecheck` | `tsc` over the app, no emit |
| `bun run prove` | Break-it proofs: every guard is broken on purpose and must fail. Targets must be committed first (the script refuses to run on dirty targets) |
| `bun run deploy:preview` | Build, prerender, check the noindex header, deploy to the Netlify preview site |
| `bun run deploy:production -- --site <id> --verify-url <url>` | Production deploy. It checks that no page is noindexed, then probes the live URL over HTTP |

Netlify's own build (netlify.toml) runs `bun run build && bun run prerender:all`.

## Commit order when content changes

1. Commit the content change.
2. Run `bun run build` (the prebuild generators re-date the sitemaps and `post-dates.ts` from git).
3. Commit only the regenerated `site/public/sitemap*.xml` and `site/src/data/post-dates.ts`.

## Where the truth lives

Change facts in these files and nowhere else. Never hard-code a price, count or claim in a component.

| What | Where |
|---|---|
| Prices, options, labels, frequency discounts | `src/data/bk-config.json` (a captured snapshot of the live BookingKoala form), read through `src/data/pricing.ts`. BookingKoala is the source of truth: re-capture the snapshot after any BK admin change, never edit numbers by hand. See `bk-config.md` at the repo root |
| Business facts and claims (bookings claim, risk-reversal lines, response time, city phones, addresses and office pins in `CITY_PROOF`, job posting) | `src/data/proof.ts` |
| Policies (guarantee, cancellation, payment terms, vetting and insurance wording) | `src/data/policy.ts` |
| Copywriting rules | `DUTY-CLEANERS-CONTENT-PROMPT.md` at the repo root |
| Guard proofs | `scripts/guard-proofs.ts` (registry), run by `scripts/prove-guards.ts`. Every new guard needs a proof registered here |
| GoHighLevel lead delivery | `src/config/ghl.ts` plus the `supabase/functions/ghl-quote` relay (API v2 `contacts/upsert`). The old hidden-form transport is dead. See `GHL-INTEGRATION-BRIEF.md` |
| Booking host | `BOOKING_ORIGIN` in `src/lib/booking-redirect.ts` (switch it when book.dutycleaners.ca goes live) |

## Deploying

Use `scripts/deploy.mjs` through `bun run deploy:preview` and `bun run deploy:production`. It makes
the noindex decision based on the target (preview is always noindexed, production never is) and
checks it in every built page.

`deploy-preview.ps1` at the repo root is the older GitHub Pages preview path
(bakbakim-dev.github.io/dutycleaners-preview). It is not the current deploy.

## Older documents at the repo root

`REBUILD-PLAN.md` is the historical build spec. Where it disagrees with the code or the owner
decisions recorded in `proof.ts` and `policy.ts`, the code wins. `notes.md` covers the legacy
WordPress site's GHL-form-to-BookingKoala bridge, not this site's lead path.
