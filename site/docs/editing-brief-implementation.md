# Duty Cleaners editing-brief implementation

Date: 12 September 2026. Source baseline: git `753d44b` in the editable project,
not the older compiled ZIP. Implementation is local; no deployment, push, DNS,
Google Business Profile, GoHighLevel or BookingKoala account change was made.

## Brief coverage

| Brief | Implemented / verified | Explicit limits |
|---|---|---|
| EB-01 | Edmonton and Calgary city pages retain original title/H1, designed service chapter and booking selectors. Removed the separate duplicated “by the job” section; updated descriptions and comparison-link labels. Kept one commercial pointer through the shared chapter. | Legal detail formerly in the Calgary duplicate section belongs on the already-cited move-out page. |
| EB-02 | Both service hubs retargeted as comparison pages: new title/H1/description/opening, accessible four-option table, three decision comparisons and links to specialists. Removed bedroom-tier repeats and redundant comparison prose; retained scoped starting prices, fees, tax, reviews and quote paths. | No new comparison URLs. |
| EB-03 | Both standard pages target a one-time standard/maid visit; revised headings, metadata and intent-specific quote labels. Checklist, exclusions, single-visit examples, preparation/access and recurring links retained. | Existing maid routing remains provisional; no redirects from aggregate GSC data. |
| EB-04 | Both recurring pages target schedules; first/later pricing is explicit, with deep-first-visit and rescheduling sections. Shortened seasonal prescriptions; clarified Calgary regional coverage vs Airbnb and retained actual access/team-continuity caveats. | No promise that every household needs the same frequency or will always get the same cleaner. |
| EB-05 | Both local price lists retain complete rates and add-ons. Worked examples labelled illustrative. Shortened hourly-vs-flat discussion and linked the cost guide; removed repeated tax/discount paragraph from the secondary introduction. | Prices still derive from existing BookingKoala snapshot, not newly typed estimates. |
| EB-06 | Cost guide now teaches scope/quote comparison; removed all four repeated city tier-table renderings and their unused renderer. Added one calculator-derived illustrative example, questions before accepting a quote and links to both local price lists. Updated title/H1/description and matched visible FAQ headings to schema. | Existing attributed market sample retained as a dated sample, not a market average or fresh survey. |
| EB-07 | General hiring guide has less repeated sales copy. Calgary guide now concentrates on building access questions, branch/coverage checks, home-type quotes and a booking checklist; generic screening grid removed. Updated blog-index labels. | Existing Calgary URL retained. |
| EB-08 | Company checklist branded explicitly; frequency guide is about hiring cadence with less discount repetition; DIY schedule labelled as household chores with a frequency-guide handoff. Updated metadata/social metadata/article headlines. | No new guides. |
| EB-09 | Existing deep, move-out, march-out, commercial, post-construction and Airbnb scope/quote/readiness/limitation sections reviewed and retained where already satisfactory. Service comparison deep-package wording aligned; wall-washing intros no longer promise every mark lifts or the finish always remains unchanged. | No fabricated projects or new capabilities. Real photography/evidence remains an owner dependency. |
| EB-10 | Added contextual scope/navigation notes for Kensington, Marda Loop, Beltline/Victoria Park, West Calgary, Scarboro/Sunalta West, Mount Royal, both Diamond Valley historical areas, Castle Downs, Clareview and Hermitage. Used existing routes and explicit branch-not-neighbourhood-office wording. | Parkhill/Stanley Park merger and Upper-only Mount Royal narrowing remain in `held-location-copy-drafts.md`. No new boundary promises or URL removals. |
| EB-11 | Clarified comparison/standard/recurring/price destinations, preserved service query parameters and existing correctly routed links. Added regression checks for new district links and quote selection. | No sitewide exact-match anchor quota. |
| EB-12 | Reused the confirmed fact modules and current supporting pages rather than duplicate policies or invent facts. Root content prompt now gives the approved editorial roles priority over old word/keyword quotas. | No operations-policy changes; no new real-job assets were available. |
| EB-13 | Source changes, page-change ledger, regression tests, build/prerender verification and held copy drafts supplied. Generated Apache config protects the exact intentional SiteGround staging host. | Production ranking/conversion outcomes and real-host HTTP behaviour must be measured after upload. |

## Business facts used

F-01: `src/data/bk-config.json`, `pricing.ts`, `addon-table.ts`, `bk-price-overrides.ts`.
The illustrative quote uses `calculateQuote` and `GST_RATE`; base tables stop at
five bedrooms. No pricing-system settings were changed.

F-02: existing frequencies and confirmed policy; recurring discounts begin on the
second visit. Every four weeks is 13 visits/year, not calendar-month scheduling.

F-03: existing specialist/checklist scope plus `policy.ts`; standard includes the
microwave inside/out, while oven/fridge interiors are add-ons; deep adds the
confirmed extra tasks. Interior windows are not included in move-out.

F-04: `proof.ts` and `policy.ts` govern screening, payment/hold timing, lockout,
cancellation and re-clean terms. No new credential or guaranteed outcome added.

F-05: `CITY_PROOF`, `city-locations.ts`, `nearby.ts` and existing route map. Red Deer
retained as the third branch, without invented reviews. Diamond Valley's two
historical-area URLs remain per the already recorded owner decision.

F-06: no publishable new real-job photos or case-study permissions supplied. Existing
imagery was not re-labelled as real evidence. Follow `PHOTO-SHOOT-BRIEF.md` before
replacing illustrative/AI imagery with actual staff and job photography.

## Geographic verification

The new notes distinguish labels and routes; they do not invent street boundaries.
City sources checked for the relevant naming:

- [Kensington business district / Hillhurst-Sunnyside](https://newsroom.calgary.ca/kensington-plaza-just-got-a-whole-lot-brighter/).
- [Marda Loop business district](https://www.calgary.ca/planning/projects/marda-loop-main-street.html).
- [Beltline and Victoria Park planning context](https://engage.calgary.ca/greenline1/beltline).
- [Scarboro/Sunalta West community](https://www.calgary.ca/communities/profiles/scarboro-sunalta-west.html).
- [Upper Mount Royal](https://www.calgary.ca/communities/profiles/upper-mount-royal.html) and [Lower Mount Royal](https://www.calgary.ca/communities/profiles/lower-mount-royal.html).
- [Castle Downs area plan](https://www.edmonton.ca/public-files/assets/document?path=Castle_Downs_OP_Consolidation.pdf) and [Clareview Town Centre plan](https://webdocs.edmonton.ca/infraplan/plans_in_effect/Clareview_Town_Centre_NASP_Consolidation.pdf).

## Verification and upload boundaries

Final command results and rendered-page changes accompany the handoff. Tests check
prices, policies, schema, routing, citations, metadata, page weight and other
regressions. The new role tests cover the comparison scope, cost-guide table
separation, quote intent, district links and staging-header condition.

Changed old tests only where their assertion contradicted the approved brief:
intent-specific titles/CTAs, chooser placement, no universal 900-word requirement,
legal detail moved off the city page, and deep-only cobweb copy in a comparison
card. Factual and booking protections remain. Mutation-proof targets follow the
new source locations and FAQ names.

The Apache staging header is conditional on `mikaily131.sg-host.com`, so copying
the same build to `dutycleaners.ca` does not apply that noindex. Production-host
normalization no longer catches HTTP requests on the test host. This is **not**
password protection. Confirm the actual response headers after upload, and use
host access protection for private testing. Do not change canonicals to the
temporary host. Netlify's existing preview workflow remains unchanged.

Before public launch, separately verify real-host redirects/statuses, staging
noindex versus production indexability, SSL, analytics consent/tracking, a real
quote and booking handoff, and the owner-managed GHL workflow/relay. No customer
lead or booking was submitted in this implementation. Existing dependency/tooling
warnings are not repaired by an editorial change; no dependency upgrade was made.
