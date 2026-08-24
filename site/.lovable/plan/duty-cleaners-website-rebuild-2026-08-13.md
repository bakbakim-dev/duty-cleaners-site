# Duty Cleaners — Website Rebuild

Four phases, executed in order. Phase 1 replaces the embedded third-party form with a native quote flow that shows a real dollar price before asking for contact details. Everything after supports that.

Pricing is scaffolded in one data file seeded from the rates currently visible on the site, with every uncertain value marked `TODO-OWNER` in a comment so it is obvious what still needs your numbers. No invented review counts, insurer names, or stats — those render as clearly-marked placeholders until you supply them.

---

## Phase 1 — Booking engine

**Single source of truth**
- New `src/data/pricing.ts`: base price per service, per-bedroom and per-bathroom increments, half-bath increment, add-on menu with prices, frequency discount percentages, and per-service hour estimates. Every price on the site reads from here.
- New `src/data/proof.ts`: Google rating + review count per city, cleans-since-2017, rebook rate, insurer name and coverage, background-check provider. Placeholders flagged; components hide a stat rather than print a fake one when its value is unset.

**Quote flow** (`src/components/quote/`)
- Step 1 home details → Step 2 price shown → Step 3 contact ("Where should we send your confirmation?"). Price is never gated behind contact fields.
- Sticky price panel: sidebar on desktop, pinned bar on mobile. Shows first-clean price, ongoing per-visit price when recurring is selected, and a computed "Saving $X" chip.
- Services without exact pricing (Post-Construction, Commercial) show an honest range and a "lock in your exact price by picking a time" line.
- Frequency chips replace the dropdown: One-time · Every 4 Weeks −5% · Every 2 Weeks −10% (Most Popular, pre-selected) · Weekly −15%. Percentages read from the data file.
- Submit posts the computed quote, service, home size, frequency, and UTM data as hidden fields to the existing GHL form endpoint, then hands off to BookingKoala. Endpoint constant marked `TODO-OWNER`.
- The full-screen overlay stays: same shell, native flow inside it instead of the iframe.

**Hero as step 1**
- Eyebrow "Bonded, insured, and locally trusted" · H1 "See your Edmonton cleaning price in 60 seconds." · support line about vetted local pros, no phone call.
- The informational card becomes a real first step: one control (service selector), a "Step 1 of 3" progress bar, and Continue that carries the answer into the flow.
- Exactly three hero proof points: review metric, "No phone call needed", "Bonded & insured".

**Risk reversal**
- A compact trust row beside every submit/continue button: no charge today, free reschedule up to 24 h, no contracts. Each line is driven by a flag in `proof.ts` so any line you cannot stand behind is switched off rather than edited out of markup.
- Same row rendered on the BookingKoala handoff page.

**Announcement bar**
- New-customer offer text plus an on/off flag and optional start/end dates in the data file, so a campaign can be scheduled without a code change. Amounts `TODO-OWNER`.

---

## Phase 2 — Trust and proof

- Rating and review count pulled from `proof.ts` and shown in the hero, beside the submit button, and under each review-platform tile.
- "Bonded & Insured" becomes the real coverage figure and insurer once supplied.
- Vetting block promotes the "fewer than 5% of applicants" stat out of the buried Values section.
- 2–4 stat tiles (cleans since 2017, rebook rate) that render only when real values exist.
- Site-wide: every "10+ years" → "since 2017".
- One dedicated 24-Hour Re-Clean Promise section (what qualifies, how to report, remedy and timeframe, three reassurance chips, one CTA to a full policy page). Everywhere else the guarantee is at most a one-liner linking here — the current repetition of bonded/insured/vetted claims is cut to one home each.
- Meet-the-team: 4–8 static profile cards plus a `/team` page. No per-cleaner ratings, no generated profile pages.
- Review wall: reviews live in a data file with an approved flag (manual queue), showing name, neighbourhood, date, stars, and "Showing 12 of N". Honest 4-star reviews included.

---

## Phase 3 — Pricing presentation

- Pricing table replaced by three merchandised service cards: cheapest honest "from $X" anchor plus hour estimate, incremental bullets ("Everything in Standard, plus: …"), a "Most Popular" badge on the real best-seller, and CTAs that deep-link into the quote flow with the service pre-selected.
- `/pricing`: publishes the real formula — base prices, increments, priced add-on menu, frequency discounts, and a worked example. Reads from the same data file as the calculator and cards. Keeps the existing honest caption about price drivers.

---

## Phase 4 — Structure and polish

- `/calgary` becomes a fully localized hub: Calgary reviews, map pins, FAQ, office block, phone.
- 8–15 hand-written neighbourhood pages per city under `/edmonton/<area>` and `/calgary/<area>`, linked from the footer. No programmatic generation.
- Each service card gets a real detail page so the site is a browsable tree.
- Header: fewer primary links, secondary items grouped, one orange "See my price" button, phone kept, mobile Call button kept.
- CTA language split: primary = booking ("See my price & book"), secondary = intent ("See what's included", "Read the 24-hour promise").
- Floating buttons reserve margin / hide on desktop so they never overlap cards, video caption, or FAQ rows at 1440×900 and 1920×1080.
- Design system: navy for authority sections, ivory content backgrounds, gold for emphasis only, orange reserved for booking. Brighter hero photography with a visible human subject. Section rhythm: hero/booking → how it works → guarantee → team → pricing → reviews → local/map → FAQ, with the duplicate "why choose us" blocks consolidated. BBB and both Chamber badges kept.
- `/offers` and a referral page last, after the calculator exists.

---

## Technical notes

- New files: `src/data/pricing.ts`, `src/data/proof.ts`, `src/data/reviews.ts`, `src/components/quote/*` (flow, steps, price panel, frequency chips, risk-reversal row), `src/pages/Team.tsx`, `src/pages/Pricing.tsx`, `src/pages/Offers.tsx`.
- `QuoteFormEmbed.tsx` and its iframe scaling logic are removed once the native flow ships; `QuoteOverlay.tsx` and `use-quote-overlay.tsx` are retained as the shell.
- Service pre-selection travels by URL param (`?service=deep`) and overlay state; a selection made on a card is never discarded.
- No video hero, no animation libraries. Existing ambient video in the hero is dropped for Lighthouse mobile ≥ 90.
- Client-side only; no backend work needed for the GHL form POST.

## Verification

Playwright checks at 1440×900, 1920×1080, and mobile: a price appears with no contact details entered, the hero step-1 control advances the flow, recurring chips update first-clean vs ongoing, floating buttons clear all content, and a Lighthouse mobile run on the homepage.

## Still needed from you

Price matrix and discount percentages · offer amounts and schedule · insurer, coverage, background-check provider · confirmation of the three risk-reversal lines · real Google ratings/counts, total cleans, rebook % · team members with consent · referral amounts · GHL form endpoint URL.
