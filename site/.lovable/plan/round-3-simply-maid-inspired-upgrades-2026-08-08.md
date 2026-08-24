# Round 3 — Simply Maid-Inspired Upgrades

Three tracks approved by the user: listing-style service pages, recent cleans + coverage grid, and a copy-voice pass on key headlines.

## Track 1 — Listing-Style Service Pages (Airbnb-inspired)

Upgrade the shared `ServiceDetailPage` template (powers all 6 pages: Regular, Deep, Recurring × Edmonton/Calgary) so each service page reads like a polished listing instead of a brochure.

- **Photo strip**: convert the existing optional `galleryImages` into a horizontal snap-scroll photo strip directly under the hero (authentic interior photos only, per project media rules).
- **"Where we'll clean" room cards**: room-by-room breakdown with task counts ("Kitchen — 11 tasks") plus a one-line sample task per room, sourced from the existing What's Included checklist data — no invented tasks.
- **Pricing by home size**: card row ("2BR/1BA — $X · ~2–2.5 hrs") using the exact rates already published on the Edmonton/Calgary pricing pages (Unified Pricing Model memory — numbers must match, no new pricing invented). Recurring-discount note where the page is the Recurring service.
- **Included vs. not included**: two-column layout with Check / Minus icons and a "Show all" expander (mirrors the WhatsIncluded matrix data).
- **Sticky price bar**: upgrade the existing floating CTA into a "From $X · Five-Star Rated · Get Instant Price" bar on scroll (desktop) — anchors to the city's quote form.
- New props are optional with graceful fallbacks so the 6 pages adopt it incrementally; all new styling uses semantic tokens (`bg-brand-navy`, `text-accent`, etc.).

## Track 2 — Recent Cleans + Coverage Grid

- **New `CityRecentCleans` component** ("Recent Five-Star Cleans in Edmonton/Calgary"): Simply Maid-style feed cards showing reviewer first name + initial avatar, neighborhood, relative date, star row, and review snippet — built **only from the real Google reviews already fetched** by the existing edge-function integration. No invented job data, no fake prices, no bed/bath counts, no review counts (Review Count Policy memory).
- **New `CityCoverageGrid` component** ("Covering all of Edmonton / Calgary"): chip grid linking to every neighborhood/location page for that city, derived from the actual registered routes — strengthens the internal-linking silo. Capped display with a "View all locations" link to `/locations`.
- Both components placed on `/edmonton-2` and `/calgary-2` (and the city homepages where layout allows).

## Track 3 — Copy-Voice Pass on Key Headlines

- Refresh hero and section headlines on `/` (Edmonton home), `/edmonton-2`, `/calgary-2`, and the 6 service detail pages: confident, warm, plain-spoken tone in Simply Maid's spirit ("We do the cleaning. You do the living.") — written fresh for Duty Cleaners, not copied.
- Italic accent-word treatment inside headlines via a small shared helper (accent-colored italic span), applied selectively to H1s and major H2s only.
- Hard constraints from project memory: keep "Rigorously Vetted Pros" (never employees), "non-toxic" (never eco-friendly), "Five-Star Rated" (no specific review counts), "10+ Years of Service", and the 24-hour satisfaction-guarantee wording exactly as approved.

## Technical Notes

- Main files: `src/components/ServiceDetailPage.tsx`, the 6 service page files, new `src/components/CityRecentCleans.tsx` + `src/components/CityCoverageGrid.tsx`, `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx`, headline edits across city/home pages.
- Room-task and pricing data come from existing page content (WhatsIncluded checklists, pricing pages) — single source of truth, no duplicated invented numbers.
- Verify with a production build plus Playwright screenshots of one service page per city and both city pages.

## Out of Scope (confirmed)

- Discounts/offers page, referral program, cleaner-profile expansion, careers-page ticker (user did not select these).
- Exact review counts, star-distribution bars, insurance/"Care & Cover" page (conflicts with project policies).
