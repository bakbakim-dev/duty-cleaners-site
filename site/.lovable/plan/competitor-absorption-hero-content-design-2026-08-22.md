# Competitor Absorption — Hero, Content, Design

Three batches of work, ordered so the visible hero changes land first. Nothing in the funnel's mechanics, pricing, or claims language changes; all vetting/insurance constraints stay in force.

## Batch A — Hero (visual first impression)

1. **Warm interior photo behind the hero.** The city hero (`CityConversionIntro`) already accepts a hero image; make it full-bleed behind the whole hero band with a navy gradient scrim so the headline stays AA-contrast. Reuse the existing real-interior photography set (same look as the step-2 imagery). No new AI imagery.
2. **Funnel card overlap.** The quote card sits on top of the hero and overlaps its bottom edge by ~48px, with a 3px orange top border. Mobile keeps a stacked, non-overlapping layout.
3. **"Before you book" note card.** Small floating navy card on the hero image (desktop) / directly under the hero CTA (mobile):
   - Eyebrow (orange): BEFORE YOU BOOK
   - "You don't need to tidy up before we come."
   - Sub: "Start with the rooms that matter — we'll handle the rest."
   - Links down to the Judgment-Free section.
4. **Trust chips.** Add "No payment today" as the first hero chip, ahead of the existing chips.
5. **Headline scale + accent device.** Hero H1 to `clamp(3rem, 6vw, 4.75rem)`, tracking `-0.02em`; the final word or two of the hero and major marketing headlines renders italic in the orange accent. Marketing surfaces only — never funnel steps.

## Batch B — Content and copy

6. **Judgment-Free splice.** Lead becomes: "Some homes have gotten away from people — after an illness, a new baby, a hard season, or simply more than you want to handle alone." Final body sentence replaced with: "Describe the home as it is — clear information helps, and no apology is needed." Biohazard fine print unchanged.
7. **New page `/prepare` — "Getting Ready for Your Clean"** (~600–800 words), four sections: you don't need to pre-clean (links Judgment-Free); Standard vs Deep chooser using the funnel's own condition language (links the funnel); move-day checklist; the details that help (pets, parking, entry, rooms to skip — noting the funnel asks these). Own title/meta, BreadcrumbList + FAQPage schema on the Q&A blocks, standard "See my price" CTA. Linked from the footer (Company), the FAQ page, and the booking-handoff page.
8. **FAQ addition** (exact wording supplied) — "Do I need to clean before the cleaners arrive?" added to the main FAQ page and its FAQPage schema.
9. **Quote-only page CTAs.** On both Airbnb pages, both post-construction pages and both commercial pages, "Request a Callback" becomes "Request a cleaning plan" — same mechanism, warmer label. Instant-price funnel pages untouched.

## Batch C — Design system

10. **Tonal ladder.** Add two intermediate tints (a cream-50 and a soft blue-grey-100) as tokens in the design system — tints of the existing navy/cream, no new hues — and vary section backgrounds on the homepage and service pages so no two adjacent sections share a background.
11. **Editorial numbering.** Numbered kickers on major section eyebrows in the existing letter-spaced style ("01 · HOW BOOKING WORKS", "02 · TRANSPARENT PRICING", …). Homepage "Our Top Services" cards get sublabels: THE REGULAR RESET / THE FULL RESET / THE HANDOFF CLEAN / THE FINAL SWEEP.
12. **Funnel step titles.** Each step gets a Fraunces serif H2 plus a numbered chip eyebrow ("01 · ABOUT YOUR HOME"). Controls, labels and buttons stay sans; question text unchanged.
13. **Labeled callouts.** The bedroom-counting rule and the travel-fee note become tagged callouts: small-caps tag (COUNTING RULE / TRAVEL FEE), 3px orange left bar, cream background.
14. **Embed handoff flag.** `BOOKING_HANDOFF_EMBED`, default ON for funnel arrivals only: the booking redirect appends `embed=true` so BookingKoala renders header-less. Nav "Book Now" and login paths keep the normal URL. Tests assert the embed variant still carries the payment/hold copy path.

## Not adopted
Consultation-request funnel, hidden prices, "4+" bedroom bucket, Deep Cleaning removed as a service, optional email, "Live price" placeholders, contact-before-price ordering, "First clean only" labels, their add-on shelf.

## Technical notes
- Hero work is contained in `CityConversionIntro` (already takes `heroImage`/`heroAlt`), so Edmonton, Calgary and the variant pages all inherit it.
- Accent-word device ships as a reusable `Accent` component (already exists) applied to marketing headlines.
- Tonal-ladder tints are added as HSL tokens in `index.css` + `tailwind.config.ts`; no hardcoded colour utilities in components.
- Embed flag lives beside `buildBookingUrl`/`buildBookingEmbedUrl` in `src/lib/booking-redirect.ts`, covered by `booking-redirect.test.ts`.
- `/prepare` registers as a lazy route in `App.tsx`, added to the sitemap generator and `Breadcrumbs` label map.
