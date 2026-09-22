# Duty Cleaners — dutycleaners.ca rebuild

Read this first. It is the current state as of 2026-09-11; where any other document in this
repo disagrees with it or with the code, the code and this file win.

### Revision-date workflow override — 2026-09-13

Revision dates now come from `site/src/data/content-revisions.json`, not component
git timestamps. After editing content: build and fully prerender, run
`bun run content-dates` from `site/`, review the reported changes and approve the
actual revision date with `bun run content-dates --approve YYYY-MM-DD`. Rebuild and
prerender again, then rerun the check to ensure stable content and matching dates.
Commit the ledger and regenerated dates/sitemaps. Existing deployment scripts gate
on this check. Do not advance dates merely for deployment or unrelated commits.
This supersedes the old git-date commit-order explanation below. The baseline
retains previously published sitemap dates, not newly recovered publication dates.
See `site/docs/seo-implementation-2026-09-13.md` for scope and limitations.

## What this is
A prerendered React/Vite rebuild of dutycleaners.ca: a house-cleaning company with three branches
(Edmonton, Calgary and, since 2026-09-11, Red Deer), each with its own address, phone and Google
listing. Edmonton and Calgary have full city hubs; Red Deer has one branch page. The app is in
`site/`. Leads go to GoHighLevel through the SiteGround-native API v2 contacts/upsert relay
(`site/public/api/ghl-quote.php`); bookings hand off to BookingKoala
(`site/src/lib/booking-redirect.ts`, `BOOKING_ORIGIN`). The rebuilt site has been live at
`dutycleaners.ca` on SiteGround since 2026-09-20; the previous WordPress site is retained in the
SiteGround backup/archive for rollback. The
launch checklist is the "Duty Cleaners Launch Gate" artifact; REBUILD-PLAN.md Appendix G holds the
BookingKoala header script.

## Commands (run from `site/`, with bun)
- `bunx vite build` — fast build, no generators.
- `bun run build` — prebuild generators (post dates, sitemaps, redirects, .htaccess; they date
  sitemaps from git) then vite build.
- `bun run prerender:all` — prerenders all 210 pages into `dist/` (about 47 s). Run it after any
  build: many tests read `dist/`.
- Images: a content image is imported as `@/assets/x.webp?card` (grid cards, thumbnails),
  `?col` (a reading column or two-up feature) or `?hero` (full-bleed), which vite-imagetools 9.0.3
  (pinned: the last release for Vite 5) turns into a Picture; render it with
  `<ResponsiveImage picture sizes alt>` (`src/components/ResponsiveImage.tsx`, SIZES presets measured
  on the built pages). Variants are WebP only and never wider than the source; encodes are cached in
  `node_modules/.cache/imagetools`, so only new or changed images cost a rebuild. A plain
  `@/assets/x.webp` import is still a URL string (JSON-LD, og:image, CSS backgrounds). Guarded by
  `responsive-images.test.ts`.
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
- Google rating and review counts: `CITY_PROOF.<city>.googleRating` / `googleReviewCount` in proof.ts,
  read from the two listings (CIDs in google-listings.ts). Re-read at least every 90 days —
  policy.test.ts fails past that — and update in one step: the four confirm() calls, and the
  count + read-date sentence in `public/llms.txt` and `public/llms-full.txt`. A count tick does
  not move revision dates (content-revisions.ts masks the number); only /reviews/ re-dates.
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
  (`/contact-us/#topic=airbnb`). The owner approved strengthening the two commercial pages on
  2026-09-11: "Office & Commercial Cleaning <city>", priced per square foot, scoped at a
  walkthrough and confirmed in a written quote; primary CTA `/contact-us/#topic=office&city=<city>`.
  (Link intent rides in the URL fragment since 2026-09-17, `src/lib/url-intent.ts`: the query
  form made a crawler fetch 14 duplicate pages. Readers still accept `?topic=` for old links.)
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

## Owner decisions (2026-09-17) — do not contradict or re-ask
- HSTS is on for the production host only (`env=DUTY_PRODUCTION_HOST`), `max-age=86400` to start,
  no includeSubDomains (mail., ftp. and autodiscover. exist and are not confirmed HTTPS), no
  preload. Raise to 63072000 after a clean week on the domain (launch-day reminder).
- The four preserved WordPress posts were published 2025-02-07 (read from the live site's
  wp-json on 2026-09-17; IDs 8038, 8060, 8081, 8088). `post-published.ts` holds them.
- /cleaning-services-red-deer/ keeps linking the Edmonton-titled service and pricing pages, as
  disclosed on the page; no Red Deer service pages and no retitling of /pricing/ or /services/.
- Branch-neutral chrome (owner chose "option 1", 2026-09-17): pages that belong to no branch —
  the set in `NEUTRAL_PATHS` (city-from-path.ts) plus /blog — show every office in the header
  ("Call us" menu) and footer; a visitor's last branch is remembered in localStorage
  (`duty-branch`, branch-preference.ts) and applied to the CHROME ONLY after mount, so the
  prerender and crawlers always get the neutral default. Body copy and JSON-LD never follow
  it. An Edmonton page never overwrites a Red Deer choice (Red Deer shares Edmonton's pages).
- NGINX Direct Delivery is OFF on the SiteGround site (turned off 2026-09-17) so the generated
  `.htaccess` cache rules apply; it must be off on the production site too.

## Owner decisions (2026-09-18) — do not contradict or re-ask
- Insurance: the company holds a business licence and does NOT carry insurance or a bond. Some
  subcontractor cleaners carry their own insurance and bond; a customer who needs that must ask for it
  when booking. The sentence lives in `POLICY.insuranceStatus` (policy.ts) and must reach /faqs/ and both
  llms files verbatim (guarded). "Insured", "bonded" and "licensed" stay banned as claims.
- Typical visit length (2-bedroom, 1-bathroom apartment): standard about 2 hours 30 minutes, deep about
  4 hours (`POLICY.typicalVisitLength`). The price stays flat whatever the time.
- Cleaners change the bedding on request, using linens the customer leaves out. A family member can book
  and pay for someone else's recurring plan (the seniors sections on both recurring pages).

## Owner decisions (2026-09-21) — do not contradict or re-ask
- E-transfer is arranged by phone, never online; with no card to hold, an e-transfer booking is
  paid in full the day before the clean (`PAYMENT_TERMS`, FAQ, funnel call-back line).
- The funnel does not ask for a postal code or address (still true after 2026-09-22 below).
- The cleanliness question stays on the cleaner-details pane. Cobwebs stay out of the
  BookingKoala deep-clean descriptions. We may phone quote leads; never promise "only on request".
- Open question, owner undecided: whether basement bedrooms count under the bedroom counting
  rule (finished basements are separate add-ons). Raise it again when the funnel copy is next touched.

## Owner decisions (2026-09-22) — do not contradict or re-ask
- Step 1 asks "Where is the home?": Edmonton / Calgary / Red Deer, or "Near" each
  (`src/lib/service-area.ts`). Town pages preset "near", neighbourhood pages preset the city;
  hubs, service pages and the homepage ask. "Near" puts BookingKoala's travel-fee row in the
  funnel price (every visit, full price) and the handoff ticks the same box, so the funnel and
  the booking page show one total. The branch (office, hours, GHL `city` tag, wording) follows
  the answer, not the page.
- The booking page ticks or unticks the travel fee from the postal code the customer types
  (`bk-travel-fee.js`, the third block of the BookingKoala header code, published 2026-09-22).
  Its FSA rules must match `postalCodeCityStatus`; `bk-travel-fee.test.ts` checks every FSA.
- The last funnel screen: one main button ("Choose my time"); the call-back is a smaller
  "Prefer a call?" control under it, never an equal button. No "What happens next" paragraph,
  no arrival-window or "comment section" explainer (the booking page shows the windows).
- Card holds: never "no money moves" or "it is not a charge" alone. A hold is for the price; on
  a debit card the amount is set aside until the charge (`PAYMENT_TERMS`). Guarded.

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
- Location-page cards (2026-09-18): the service and "why us" cards on all 163 location pages come
  from `site/src/data/location-cards.tsx` and render through `site/src/components/LocationCards.tsx`.
  They are titles and links on purpose (only the rating card keeps a line): identical card
  descriptions put 44 location pages at AuditSpur's 0.5 near-duplicate bar. Do not add
  descriptions back or copy the cards into a page. `location-similarity.test.ts` repeats
  AuditSpur's measure on the build and fails at 0.48.

## Design rules for money and location pages (owner-approved taste pass, 2026-09-18)
- One hero pattern: H1 in `display-serif` (two lines at 1366px), one sentence carrying the from-price,
  "before GST", the unit and pay-after wording, then "See My Instant Price" as the filled accent button,
  the phone as the outline button, and the Google rating line. Chips sit in a slim strip under the hero.
  The two city hubs keep the quote card in place of the buttons.
- One accent: `accent` (burnt orange), `text-accent-on-dark` on navy. `brand-gold` is for stars, the
  rating and small marks on navy only; gold text on a light surface fails contrast (2.36:1).
- Every H1 and H2 on marketing pages uses `display-serif`; never inside the quote funnel.
- Section labels above headings: at most one per three sections, never one that restates its heading.
  Numerals only on real sequences (booking steps). No hover lift, scale or rotate on cards that are
  not links; use `.motion-lift` on ones that are.
- Everything that opens the quote funnel reads "See My Instant Price". The editorial-brief labels on
  the regular and recurring service pages and the commercial "Request an Office Cleaning Quote" stay.
- Never "five bedrooms or more"; the guard in owner-answers-0911.test.ts now catches that wording.

## Owner to-dos before or on launch day (checked 2026-09-11)
Owner reminder request (2026-09-13): when the owner announces launch, review and present every remaining task in `site/docs/launch-day-reminder.md`. A quiet launch-announcement heartbeat is registered. SiteGround is the selected production host; older Netlify production-plan details below are historical and must not be treated as required launch purchases.

1. Completed 2026-09-20: the GoHighLevel "Instant Quote Automation" workflow is published.
   A controlled production run executed the admin email, customer SMS, New Lead-Forms opportunity
   and trigger-tag removal, and finished successfully.
   The separate "After-Hours Quote Reply" workflow was also published on 2026-09-20. It is limited
   to SMS replies to Instant Quote Automation contacts carrying `quote-confirmed`, routes the real
   Edmonton/Calgary and Red Deer office hours through five OR segments, sends the owner-approved
   closed-office wording only on the None/closed branch, uses +15878124907, and has re-entry off.
2. Rotate the GoHighLevel Private Integration token ("dutycleaners.ca website funnel", created and
   last updated Aug 14 2026, exposed in a screenshot), then put the new token in the relay's secret
   in the same step, or leads stop arriving.
3. BookingKoala receiver v2 is now published in Theme Builder → Settings → Tracking & Conversion
   → Header code (owner-approved, 2026-09-12). Source: `bk-prefill-v2.js`; regenerate the pasteable
   snippet with `node site/scripts/build-booking-prefill.mjs`. Native-field transfer was verified
   on five public test cases without submitting a booking. The encrypted funnel handoff now runs
   as `site/public/api/booking-handoff.php` on SiteGround; Supabase is not required for it. The
   production endpoint and private secret were installed on 2026-09-20. Controlled seal, unseal,
   field round-trip, tamper-rejection and foreign-origin tests passed, and the published receiver
   points to `https://dutycleaners.ca/api/booking-handoff.php`. A controlled final booking with a
   date/card is still required to prove saved-record persistence. See
   `site/docs/booking-handoff-implementation-2026-09-12.md`.
4. Take down the old GitHub Pages preview (bakbakim-dev.github.io/dutycleaners-preview).
5. Yelp: correct the Edmonton profile's address (it is claimed; the old URL now redirects to
   "duty-cleaners-edmonton-2", so check for a duplicate listing) and claim the Calgary profile.
6. Book a real photo shoot (PHOTO-SHOOT-BRIEF.md): every people image is still AI-generated.
7. Completed 2026-09-20: production moved to SiteGround, DNS serves the rebuilt site, and a
   controlled quote ran end to end through durable capture and the published GHL workflow.
   Netlify production plans are superseded and must not be treated as launch requirements.
8. Say which products the $15 "optional alternative products" option means, if you want the site
   to name them. Until then it sends people to the office and makes no environmental claim.
9. Delete the stale dutycleaners-preview site on bakbakim's Netlify team (it still serves the
   5 September build, noindexed).
10. Completed/superseded 2026-09-20: the quote relay runs natively on SiteGround at
    `/api/ghl-quote.php`; Supabase is not part of the production lead path. The encrypted queue and
    five-minute retry cron are live. The receiver acknowledges durable storage before GHL delivery.
    Its anti-spam elapsed-time check must keep the clock-skew guard added on 2026-09-20: a negative
    browser/server time difference is not an instant bot submission.
11. Red Deer Google listing: its primary category shows "Janitorial service"; "House cleaning
   service" matches what the branch sells. It has no reviews yet: ask real Red Deer customers.
12. Tracking: the GA4 property exists (account "Dutycleaners", property "Duty Cleaners - GA4",
   web stream 3636867999, Measurement ID G-5WNJ12G60D). Realtime visibly received production
   page views on 2026-09-20. Stream settings checked the same day: Outbound clicks, Form
   interactions and history-based page changes off; Redact email on; the nine BookingKoala
   prefill parameters redacted; stream URL https; Google Signals and user-provided data collection
   off. Event and user-data retention are both 14 months. `generate_lead` and
   `contact_enquiry_submitted` are configured as key events, counted once per event with no default
   monetary value. Realtime proved `generate_lead` as a real key event on 2026-09-20, alongside
   production `quote_step`, `quote_price_view` and `contact_submitted` funnel events. A live contact
   form returned success, but the Chrome test profile remained opted out of analytics even after a
   third-party-cookie exception was added; a submission from a trackable browser is still needed
   to prove `contact_enquiry_submitted` end to end. Do not mark `booking_handoff_succeeded` as a
   completed booking. The ID is in
   site/.env.production.local, so the production build switches GA on; it loads only on
   dutycleaners.ca / www. It goes in
   `site/.env.production.local` as `VITE_GA4_MEASUREMENT_ID` (git-ignored; read by the local
   production build that deploy.mjs uploads with --no-build, never by Netlify's environment).
   Analytics loads only on dutycleaners.ca / www, never on previews. In the GA web stream first:
   Enhanced measurement Outbound clicks OFF, Form interactions OFF, history-based page changes
   OFF; Redact email on and redact the BookingKoala prefill query parameters (list in
   site/.env.example); Google signals off. Then verify Search Console as a Domain property (DNS
   TXT record) and add Bing Webmaster Tools on launch day.
   Completed 2026-09-20: the Search Console Domain property was open in the owner account and the
   new `https://dutycleaners.ca/sitemap.xml` sitemap index was submitted successfully. Search
   Console showed Success immediately; discovered-page counts require Google to recrawl. The old
   WordPress sitemap submissions remain as historical entries for later cleanup.
13. Form-health monitoring was installed on the SiteGround production host on 2026-09-20 with its
   private config outside `public_html`. A controlled production `booking-handoff` failure,
   immediate duplicate and recovery proved the full cycle: the first failure generated one inbox
   alert at `info@dutycleaners.ca`, the duplicate generated no second email, and recovery generated
   one inbox alert. SPF, DKIM and DMARC passed. Independent UptimeRobot monitoring was added with
   five-minute checks for homepage HTTP, homepage content, the form-health healthy response and
   BookingKoala content; alerts go immediately to the Google Workspace `info@dutycleaners.ca`
   mailbox. Periodically run controlled failure/recovery and end-to-end quote tests. See
   `site/docs/form-health-monitoring.md`.
14. Booking domain: checkout still leaves the site for `dutycleaners.bookingkoala.com`.
   `book.dutycleaners.ca` does not resolve (checked 2026-09-20). BookingKoala must enable the
   custom domain and issue its certificate (their settings: owner go-ahead first), then the CNAME
   goes in. Only after it serves their form, swap `BOOKING_ORIGIN`, `GIFT_CARD_ORIGIN` and the
   CSP `frame-src`/`form-action` hosts in one commit and retest a booking journey.
   `booking-handoff.php` already accepts both origins. Steps in
   `site/docs/launch-day-reminder.md`.

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
