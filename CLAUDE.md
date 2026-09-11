# Duty Cleaners — dutycleaners.ca rebuild

Read this first. It is the current state as of 2026-09-11; where any other document in this
repo disagrees with it or with the code, the code and this file win.

## What this is
A prerendered React/Vite rebuild of dutycleaners.ca: a house-cleaning company with two branches
(Edmonton and Calgary), each with its own address, phone and Google listing. The app is in
`site/`. Leads go to GoHighLevel through the API v2 contacts/upsert relay (`site/src/config/ghl.ts`,
`site/supabase/functions/ghl-quote`); bookings hand off to BookingKoala
(`site/src/lib/booking-redirect.ts`, `BOOKING_ORIGIN`). The site is NOT live yet: DNS still points
at the old WordPress site, which the owner will stop using once this one is on the domain. The
launch checklist is the "Duty Cleaners Launch Gate" artifact; REBUILD-PLAN.md Appendix G holds the
BookingKoala header script.

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
  (`scripts/deploy.mjs`, Netlify). The Netlify preview is the only preview; the old GitHub Pages
  preview and its `deploy-preview.ps1` were retired on 2026-09-11.

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

## Owner decisions (2026-09-10 and 11) — do not contradict or re-ask
- Volume claim: "5,000+ Alberta bookings since 2017" (`BOOKINGS_CLAIM`). Bookings, not homes;
  never split by city.
- "No contracts" and "You won't be charged today" are confirmed. Online bookings need at least 24
  hours' notice; a temporary card hold goes on the day before the clean (not a charge); the card
  is charged after the clean. Same-day or next-day slots: by phone, when the schedule allows.
- After a quote request we text within 24 hours (`RESPONSE_TIME_PROMISE`).
- Prices: the tables stop at five bedrooms (`PRICING_TIERS`, "5 Bedroom"); six and seven bedrooms
  cost more and are priced by the instant quote. Never write "5+" or "five or more".
- Hourly rates: Airbnb/short-term-rental turnovers are $60 per cleaner-hour (`HOURLY_RATE`), the
  only work at $60. Any other hourly cleaning is at least $65 (`HOME_HOURLY_RATE`, read from
  BookingKoala's Home Cleaning hourly service), quoted as "from $65".
- Deep package: baseboards, doors, light switches, wall outlets, vent covers, plus cobwebs.
  Light switches and cobwebs are deep-only. Ceiling fans are in no package: dusted only on
  request, where a 3-step ladder reaches them safely.
- Commercial: office cleaning is the only commercial work quoted online (contact form "Office
  Cleaning"). Airbnb/short-term-rental turnovers are priced per hour on a callback
  (`/contact-us/?topic=airbnb`).
- Black Diamond + Turner Valley are the Town of Diamond Valley: both URLs stay; every link and
  label names Diamond Valley.
- Office pins are the Google listings' own coordinates (`CITY_PROOF.geo`); the addresses match
  the listings.
- Cleaners: reference-checked, customer-rated, and "under 5% of applicants are accepted"
  (`COMPANY.applicantAcceptanceRate`, the owner's figure). Always hiring: the JobPosting has a
  datePosted, no validThrough and no pay range (independent contractors paid per job).
- No new-customer offer. The rebook rate stays unpublished.
- Products (2026-09-11): the cleaners are subcontractors who choose their own products, so
  house-cleaning copy claims no product effect ("sanitised", "disinfected", "non-toxic",
  "hospital-grade"). It says what the team does: scrubbed, wiped down, cleaned. Guarded in
  copy-quality.test.ts. The $15 eco-friendly option stays as confirmed on 2026-09-07 until the
  owner defines it (to-do 8).
- The re-clean window runs 24 hours from the clean, never from an inspection; move-out copy tells
  the customer to book the clean as close to the inspection as they can. Guarded.
- March-out: worked from the cleaning items on CFHA's move-out checklist (linked). Never "to
  CFHA's standards": that checklist also covers repairs, bulbs, the furnace filter, the yard and
  steam-cleaned carpets. Guarded.
- Yelp is not linked (2026-09-11): the Edmonton profile shows the wrong address (14250 85 Ave NW)
  and 3.6 stars, and Calgary's is unclaimed. Edmonton's Yelp URL is out of `sameAs` too. Restore
  both once the owner has fixed and claimed them.
- Outbound citations: plain followed links to official sources, attached to the sentence they
  support (move-out pages → Alberta's tenancy rules; product posts → Transport Canada and Health
  Canada; FAQ mould answer → Health Canada; march-out page → CFHA Occupant Handbook). No nofollow on trusted sources, no sitewide or footer
  citation links, no links to "best of" lists or directories. Guarded in rendered-quality.test.ts. The legacy `/quote-redirect/` bridge
  was removed with the old site.

## Rules
- Never log into the Google Business Profile. Don't change GoHighLevel or BookingKoala settings
  without the owner's explicit go-ahead; reading them is fine.
- Do not edit the commercial-cleaning pages (`CommercialCleaning.tsx`,
  `CommercialCleaningCalgary.tsx`, `CommercialDepth.tsx`), and keep commercial offers out of the
  house-cleaning pages.
- Never push without asking. Commit messages end with
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (or the current model's line).
- Location-page local notes are fact-checked. Never delete one to fix a guard: the duplicate-content
  guards depend on them. Geographic claims need an independent check.
- `_redirects` and `.htaccess` are generated; never hand-edit them.

## Owner to-dos before or on launch day (checked 2026-09-11)
1. Publish the GoHighLevel "Instant Quote Automation" workflow. It is still a Draft with 0
   enrolled, so leads get no admin email, customer text or pipeline card.
2. Rotate the GoHighLevel Private Integration token ("dutycleaners.ca website funnel", created and
   last updated Aug 14 2026, exposed in a screenshot), then put the new token in the relay's secret
   in the same step, or leads stop arriving.
3. Paste `bk-header-fill.html` into BookingKoala → Theme Builder → Settings → Tracking & Conversion
   → Header code. It is not on the live booking page.
4. Take down the old GitHub Pages preview (bakbakim-dev.github.io/dutycleaners-preview).
5. Yelp: correct the Edmonton profile's address (it is claimed; the old URL now redirects to
   "duty-cleaners-edmonton-2", so check for a duplicate listing) and claim the Calgary profile.
6. Book a real photo shoot (PHOTO-SHOOT-BRIEF.md): every people image is still AI-generated.
7. The launch-gate items: production Netlify site, DNS, analytics, an end-to-end quote test.
   Netlify refuses deploys on this account (403 Forbidden since 2026-09-11; the site stays up).
   It is on the credit-based Free plan (300 credits a period, reset on the 4th of each month),
   and 18 production deploys ran on 4-5 September, so the credits are most likely spent. The
   production site is meant to go on this same account, so upgrade or top up before launch day,
   or a launch deploy fails the same way. `netlify api getAccount` shows the plan.
8. Decide what the $15 eco-friendly option buys. The cleaners choose their own products, so name a
   minimum the office can check (for example, products with ECOLOGO certification) or retire
   the option. Until then the site lists it as confirmed and makes no other environmental claim.

## Historical documents
REBUILD-PLAN.md, SEO-AUDIT-2026.md, CWV-BASELINE.md, notes.md (the legacy WordPress site's lead
path), `bridge.js` / `build.js` / `template.html` (that site's retired /quote-redirect bridge),
`_home.txt` / `_cal.txt` (page snapshots) and `site/.lovable/plan/` are dated records. Each doc
carries a note saying what superseded it; do not take instructions or copy from them.

## Windows tooling
Bash may start with an empty PATH: prefix
`export PATH="/usr/bin:/c/Program Files/Git/cmd:/c/Program Files/nodejs:/c/Users/Marketplace/AppData/Roaming/npm:$PATH"`.
Heredocs in the Bash tool turn `\\` into `\` (write scripts to files instead); Git Bash rewrites
arguments that look like `/paths`; paths under `.claude/worktrees` can exceed Windows' limit.
