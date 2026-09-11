# Duty Cleaners — dutycleaners.ca rebuild

Read this first. It is the current state as of 2026-09-10; where any other document in this
repo disagrees with it or with the code, the code and this file win.

## What this is
A prerendered React/Vite rebuild of dutycleaners.ca: a house-cleaning company with two branches
(Edmonton and Calgary), each with its own address, phone and Google listing. The app is in
`site/`. Leads go to GoHighLevel through the API v2 contacts/upsert relay (`site/src/config/ghl.ts`);
bookings hand off to BookingKoala (`site/src/lib/booking-redirect.ts`, `BOOKING_ORIGIN`).
The site is NOT live yet: DNS still points at the old WordPress site. The launch checklist is the
"Duty Cleaners Launch Gate" artifact; REBUILD-PLAN.md Appendix G holds the BookingKoala header script.

## Commands (run from `site/`, with bun)
- `bunx vite build` — fast build, no generators.
- `bun run build` — prebuild generators (post dates, sitemaps, redirects, .htaccess; they date
  sitemaps from git) then vite build.
- `bun run prerender:all` — prerenders all 209 pages into `dist/` (about 47 s). Run it after any
  build: many tests read `dist/`.
- `bunx vitest run` — the suite (32 files). `bun run typecheck` — tsc.
- `bun run prove` — break-it proofs: every guard test has an entry in `scripts/guard-proofs.ts`
  that breaks its target and must make the named `it()` fail. Proof targets must be committed
  first (it refuses dirty targets). Add a guard, add its proof.
- Deploy: `bun run deploy:preview` / `bun run deploy:production -- --site <id> --verify-url <url>`
  (`scripts/deploy.mjs`, Netlify). `deploy-preview.ps1` at the repo root is the older GitHub
  Pages path.

**Commit order when content changes:** commit the content, run `bun run build`, then commit only
the regenerated `site/public/sitemap*.xml` and `site/src/data/post-dates.ts`.

## Sources of truth — never hand-type these
- Prices, add-ons, fees: `site/src/data/bk-config.json` (a BookingKoala snapshot; re-capture it
  after any BK admin change), read through `pricing.ts`, `addon-table.ts`, `bk-price-overrides.ts`.
- Claims, figures, phones, addresses, office pins, response time, job posting: `site/src/data/proof.ts`.
- Policies (guarantee, cancellation, payment terms, exclusions): `site/src/data/policy.ts`.
- Owner-settled values are wrapped in `confirm()` (`confirmed.ts`) with who and when. In proof.ts
  a `null` means "not confirmed; render nothing". policy.ts allows no nulls.
- Coverage lists: `city-locations.ts`. Nearby links: `nearby.ts`, generated from coordinates.
- Legacy WordPress URLs: `legacy-urls.ts` (31 preserved, 139 redirected). Trailing slash is canonical.
- Copy rules and facts: `DUTY-CLEANERS-CONTENT-PROMPT.md` (also published as a private artifact;
  edit the markdown, then republish the artifact to the same URL).

## Owner decisions (2026-09-10) — do not contradict or re-ask
- Volume claim: "5,000+ Alberta bookings since 2017" (`BOOKINGS_CLAIM`). Bookings, not homes;
  never split by city.
- "No contracts" and "You won't be charged today" are confirmed. Online bookings need at least 24
  hours' notice; a temporary card hold goes on the day before the clean (not a charge); the card
  is charged after the clean. Same-day or next-day slots: by phone, when the schedule allows.
- After a quote request we text within 24 hours (`RESPONSE_TIME_PROMISE`).
- Deep package: baseboards, doors, light switches, wall outlets, vent covers, plus cobwebs.
  Light switches and cobwebs are deep-only. Ceiling fans are in no package: dusted only on
  request, where a 3-step ladder reaches them safely.
- Commercial: office cleaning is the only commercial work quoted online (contact form "Office
  Cleaning"). Airbnb/short-term-rental turnovers are priced per hour on a callback
  (`/contact-us/?topic=airbnb`).
- Black Diamond + Turner Valley are the Town of Diamond Valley: both URLs stay; every link and
  label names Diamond Valley.
- Office pins are the Google listings' own coordinates (`CITY_PROOF.geo`).
- Always hiring: the JobPosting has a datePosted and no validThrough.
- No new-customer offer. The rebook rate stays unpublished.

## Rules
- Never log into the Google Business Profile.
- Do not edit the commercial-cleaning pages (`CommercialCleaning.tsx`,
  `CommercialCleaningCalgary.tsx`, `CommercialDepth.tsx`), and keep commercial offers out of the
  house-cleaning pages.
- Never push without asking. Commit messages end with
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (or the current model's line).
- Location-page local notes are fact-checked. Never delete one to fix a guard: the duplicate-content
  guards depend on them. Geographic claims need an independent check.
- `_redirects` and `.htaccess` are generated; never hand-edit them.

## Open questions for the owner (asked 2026-09-10; record answers here and in the code)
1. Price tables label the top row "5+ Bedroom" at the 5-bedroom price, but BookingKoala prices 6
   and 7 bedrooms higher. Relabel to "5 Bedroom"?
2. General hourly work: $60 (what the site says) or BookingKoala's separate Home Cleaning
   "Hourly Cleaning" service?
3. Will the old GHL "Website Form" redirect to `/quote-redirect/` still be used after go-live?
   (`QuoteRedirect.tsx` is legacy and not configured.)
4. Is the GitHub Pages preview retired in favour of the Netlify preview?
5. GHL token rotated? "Instant Quote Automation" workflow published? BK header script installed?
6. Any real photography yet? Every people image is AI-generated.
7. Publish an applicant acceptance rate, or never? 8. A pay range on the job posting, or never?

## Historical documents
REBUILD-PLAN.md, SEO-AUDIT-2026.md, CWV-BASELINE.md, notes.md (the legacy WordPress site's lead
path), `_home.txt` / `_cal.txt` (page snapshots) and `site/.lovable/plan/` are dated records.
Each carries a note saying what superseded it; do not take instructions or copy from them.

## Windows tooling
Bash may start with an empty PATH: prefix
`export PATH="/usr/bin:/c/Program Files/Git/cmd:/c/Program Files/nodejs:/c/Users/Marketplace/AppData/Roaming/npm:$PATH"`.
Heredocs in the Bash tool turn `\\` into `\` (write scripts to files instead); Git Bash rewrites
arguments that look like `/paths`; paths under `.claude/worktrees` can exceed Windows' limit.
