# Duty Cleaners — dutycleaners.ca rebuild

Read this first. It is the current state as of 2026-09-11; where any other document in this
repo disagrees with it or with the code, the code and this file win.

## What this is
A prerendered React/Vite rebuild of dutycleaners.ca: a house-cleaning company with three branches
(Edmonton, Calgary and, since 2026-09-11, Red Deer), each with its own address, phone and Google
listing. Edmonton and Calgary have full city hubs; Red Deer has one branch page. The app is in
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
- `bun run prerender:all` — prerenders all 210 pages into `dist/` (about 47 s). Run it after any
  build: many tests read `dist/`.
- `bunx vitest run` — the suite (32 files). `bun run typecheck` — tsc.
- `bun run prove` — break-it proofs: every guard test has an entry in `scripts/guard-proofs.ts`
  that breaks its target and must make the named `it()` fail. Proof targets must be committed
  first (it refuses dirty targets). Add a guard, add its proof.
- Deploy: `bun run deploy:preview` / `bun run deploy:production -- --site <id> --verify-url <url>`
  (`scripts/deploy.mjs`, Netlify). The preview is https://duty-cleaners-preview.netlify.app on the
  owner's lokkom Netlify team (since 2026-09-11; the CLI must be logged in as lokkom@gmail.com).
  The old dutycleaners-preview site on bakbakim's team is stale: that team spent its free credits.
  The new site sits behind Netlify visitor access (401 + login redirect for anyone not signed in
  to the lokkom team), so it is private, not just noindexed; turning that off is the owner's call.
  deploy.mjs uploads with `--no-build` (newer netlify-cli rebuilds by default, wiping the noindex).
  The old GitHub Pages preview and its `deploy-preview.ps1` were retired on 2026-09-11.

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
- Legacy WordPress URLs: `legacy-urls.ts` (32 preserved, 138 redirected; /cleaning-services-red-deer/ is the Red Deer branch page). Trailing slash is canonical.
- Copy rules and facts: `DUTY-CLEANERS-CONTENT-PROMPT.md` (also published as a private artifact;
  edit the markdown, then republish the artifact to the same URL).

## Owner decisions (2026-09-10 and 11) — do not contradict or re-ask
- Volume claim: "5,000+ Alberta bookings since 2017" (`BOOKINGS_CLAIM`). Bookings, not homes;
  never split by city.
- "No contracts" and "You won't be charged today" are confirmed. Online bookings need at least 24
  hours' notice; a temporary card hold goes on the day before the clean (not a charge); the card
  is charged after the clean. Same-day or next-day slots: by phone, when the schedule allows.
- Name, email and phone remain required before the full price and extras. A lead-relay failure must
  never hide the locally calculated price after those valid fields were provided. Show the price
  with an accurate capture-retry notice; never say "honour your quote" before a price has appeared
  (owner correction, 2026-09-13).
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
  (`/contact-us/?topic=airbnb`). The owner approved strengthening the two commercial pages on
  2026-09-11: "Office & Commercial Cleaning <city>", priced per square foot, scoped at a
  walkthrough and confirmed in a written quote; primary CTA `/contact-us/?topic=office&city=<city>`.
  Each city homepage and services hub carries one pointer to its commercial page, nothing more.
  The button reads "Request an Office Cleaning Quote". The late-cancellation fee and the 24-hour
  re-clean apply to commercial clients too, and work outside office hours can be arranged (owner).
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
  copy-quality.test.ts. The $15 option is "Optional alternative products" (owner, 2026-09-11):
  ask the office which products are available and suitable for your surfaces. Never eco, green,
  non-toxic or pet-safe. Guarded.
- Garage/balcony sweep (2026-09-11): a real add-on, offered mostly in summer when the weather
  allows; a sweep, not a full garage clean. Garages and patios are otherwise excluded. It stays
  bookable year-round in BookingKoala; the site note is enough (owner).
- Move-out: interior window cleaning is a paid add-on, never part of the move-out clean (window
  sills and tracks are wiped).
- Red Deer is a third branch (owner, 2026-09-11) with its own office and Google listing: "Duty
  Cleaners House Cleaning Services Red Deer", 5212 48 St, Red Deer, AB T4N 1S4, (587) 570-6979,
  Mon-Sat 7 AM-9 PM, Sunday closed, pin 52.2673285,-113.8189323, CID 10449244954117051184. Same
  prices, no travel fee inside Red Deer, bookable online (BookingKoala accepts Red Deer postal
  codes). The listing's website button points to /cleaning-services-red-deer/, which is the
  branch page (no longer a redirect). No Google reviews yet: never give Red Deer a rating.
  Red Deer offers every service the other branches do except march-out (owner): post-construction,
  wall washing, Airbnb turnovers and office cleaning. Addresses around Red Deer pay the standard
  travel fee and book online (owner). Hiring in Red Deer too. The commercial pages stay
  Edmonton/Calgary (owner: no need to mention Red Deer).
- Travel-fee postal codes (2026-09-11): T1Y is Calgary (no fee), T3Z pays the fee, Tsuut'ina
  Nation (T3T) pays no fee (owner). FSAs that straddle a city limit (T2Y, T3L, T3P, T3R, T2P, T1X,
  T4A) stay as they are (owner).
- Worked price examples show exact cents beside the rounded table card (owner OK). Individual
  Google review links are not needed; review links open the branch profile and say so.
- Alberta deposit rule (alberta.ca/ending-a-tenancy): within 10 days of the tenant moving out the
  landlord returns the deposit, or the balance with a statement of deductions (an estimate is
  allowed, final statement within 30 days). Never the bare "returned within 10 days". Guarded.
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
- The commercial pages (`CommercialCleaning.tsx`, `CommercialCleaningCalgary.tsx`,
  `CommercialDepth.tsx`) may be edited since the owner's go-ahead of 2026-09-11. Keep commercial
  offers out of the body of house-cleaning pages beyond the one pointer per homepage and hub.
- Never push without asking. Commit messages end with
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (or the current model's line).
- Location-page local notes are fact-checked. Never delete one to fix a guard: the duplicate-content
  guards depend on them. Geographic claims need an independent check.
- `_redirects` and `.htaccess` are generated; never hand-edit them.

## Owner to-dos before or on launch day (checked 2026-09-11)
Owner reminder request (2026-09-13): when the owner announces launch, review and present every remaining task in `site/docs/launch-day-reminder.md`. A quiet launch-announcement heartbeat is registered. SiteGround is the selected production host; older Netlify production-plan details below are historical and must not be treated as required launch purchases.

1. Publish the GoHighLevel "Instant Quote Automation" workflow. It is still a Draft with 0
   enrolled, so leads get no admin email, customer text or pipeline card.
2. Rotate the GoHighLevel Private Integration token ("dutycleaners.ca website funnel", created and
   last updated Aug 14 2026, exposed in a screenshot), then put the new token in the relay's secret
   in the same step, or leads stop arriving.
3. BookingKoala receiver v2 is now published in Theme Builder → Settings → Tracking & Conversion
   → Header code (owner-approved, 2026-09-12). Source: `bk-prefill-v2.js`; regenerate the pasteable
   snippet with `node site/scripts/build-booking-prefill.mjs`. Native-field transfer was verified
   on five public test cases without submitting a booking. The encrypted funnel handoff now runs
   as `site/public/api/booking-handoff.php` on SiteGround; Supabase is not required for it. It is
   NOT yet launch-ready: the PHP endpoint and its private secret file must be uploaded to the
   staging host, followed by an end-to-end test. See
   `site/docs/booking-handoff-implementation-2026-09-12.md`. Do not publish the new frontend first.
4. Take down the old GitHub Pages preview (bakbakim-dev.github.io/dutycleaners-preview).
5. Yelp: correct the Edmonton profile's address (it is claimed; the old URL now redirects to
   "duty-cleaners-edmonton-2", so check for a duplicate listing) and claim the Calgary profile.
6. Book a real photo shoot (PHOTO-SHOOT-BRIEF.md): every people image is still AI-generated.
7. The launch-gate items: production Netlify site, DNS, analytics, an end-to-end quote test.
   Netlify refuses deploys on this account (403 Forbidden since 2026-09-11; the site stays up).
   It is on the credit-based Free plan (300 credits a period, reset on the 4th of each month),
   and 18 production deploys ran on 4-5 September, so the credits are spent (confirmed: the dashboard banner says production deploys are paused
   until an upgrade or the next billing cycle). The
   production site is meant to go on this same account, so upgrade or top up before launch day,
   or a launch deploy fails the same way. `netlify api getAccount` shows the plan. The preview
   now lives on the lokkom team (300 fresh credits, about 20 deploys a month): batch deploys.
   Decide which team hosts production, then upgrade it (or move to Cloudflare Pages).
8. Say which products the $15 "optional alternative products" option means, if you want the site
   to name them. Until then it sends people to the office and makes no environmental claim.
9. Delete the stale dutycleaners-preview site on bakbakim's Netlify team (it still serves the
   5 September build, noindexed).
10. Redeploy the ghl-quote relay (Supabase) so it accepts the new preview origin; the code
   allows it since 2026-09-11, but until the relay is redeployed the quote form on
   duty-cleaners-preview.netlify.app cannot submit. Touches the lead pipeline: owner go-ahead first.
11. Red Deer Google listing: its primary category shows "Janitorial service"; "House cleaning
   service" matches what the branch sells. It has no reviews yet: ask real Red Deer customers.
12. Tracking: the GA4 property exists (account "Dutycleaners", property "Duty Cleaners - GA4",
   web stream 3636867999, Measurement ID G-5WNJ12G60D). Stream settings done 2026-09-11 (Outbound clicks, Form
   interactions and history-based page changes off; Redact email on; the nine BookingKoala
   prefill parameters redacted; stream URL https). The ID is in site/.env.production.local, so
   the next production build switches GA on; it loads only on dutycleaners.ca / www. It goes in
   `site/.env.production.local` as `VITE_GA4_MEASUREMENT_ID` (git-ignored; read by the local
   production build that deploy.mjs uploads with --no-build, never by Netlify's environment).
   Analytics loads only on dutycleaners.ca / www, never on previews. In the GA web stream first:
   Enhanced measurement Outbound clicks OFF, Form interactions OFF, history-based page changes
   OFF; Redact email on and redact the BookingKoala prefill query parameters (list in
   site/.env.example); Google signals off. Then verify Search Console as a Domain property (DNS
   TXT record) and add Bing Webmaster Tools on launch day.
13. Form-health monitoring is implemented in source but not deployed. Upload
   `public/api/form-health.php`, install the private config outside `public_html`, verify a real
   alert and recovery email, then set `FORM_HEALTH_URL` and `FORM_HEALTH_SECRET` on the GHL relay
   before redeploying it. Add an external uptime check because SiteGround cannot report its own
   outage. See `site/docs/form-health-monitoring.md`.

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
