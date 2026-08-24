# Conversion Upgrade — Simply Maid Patterns for Duty Cleaners

Goal: lift Google Ads and general conversion using patterns from simplymaid.com.au, adapted to our stack (Bookin60 embed, GHL → bridge → BookingKoala). No offer banner (user has no offer). Quote form stays at the end of each page.

## 1. Trust + Google rating beside the quote form

Both city pages (`Edmonton2.tsx`, `Calgary2.tsx`) already have a quote card with "Step 1 of 1" framing and trust pills. Upgrades, applied identically to both:

- **Google rating line directly above the form**: "Five-Star Rated on Google" with 5 gold stars and the Google mark — trust at the exact decision point (respects the no-specific-review-counts rule).
- **Micro-badge row under the form header**: Insured · Rigorously Vetted Pros · 24-Hour Re-Clean Promise — the risk-reversal stack adjacent to the CTA, like Simply Maid's hero.
- Change the form header from "Step 1 of 1" to **"Your price in 60 seconds"** with a subtle progress feel, matching Simply Maid's friction-reducing step framing.
- Hero CTAs keep anchoring to `#quote` (form stays at page end) — add "60-second quote" microcopy beside the hero button.

## 2. Pre-selected service deep links

Service pages currently link "Get Instant Price" to a plain quote anchor. The Bookin60 iframe can't be pre-filled from outside, so intent is carried as context instead:

- Append the service to quote links from `ServiceDetailPage.tsx` (hero, sticky bar, pricing tiers): e.g. `/edmonton-2?service=deep-cleaning#quote`.
- The city quote section reads the param and personalizes the heading: **"Your Deep Cleaning price in 60 seconds"** (falls back to generic copy with no param).
- The service value is stored with the tracking data (item 3) so it survives into the GHL → BookingKoala chain when that flow is wired up.

## 3. Google Ads tracking preservation (gclid / UTM)

Today `/quote-redirect` drops ad attribution when it forwards to BookingKoala.

- New `src/lib/tracking.ts`: on first landing, captures `gclid`, `gbraid`, `wbraid`, and `utm_*` params from the URL into `sessionStorage` (first-touch wins, so later internal navigation doesn't overwrite the ad click).
- `QuoteRedirect.tsx` appends the stored tracking params verbatim to the outgoing BookingKoala URL — conversions in BK can then be attributed back to the Google Ads click.
- Debug mode (`?debug=1`) shows which tracking params were captured and forwarded.

## 4. Live activity social proof strip

A compact version of Simply Maid's "16 cleans in the last 6 hrs" feed, using only real Google review data (no invented counts):

- New `src/components/RecentActivityStrip.tsx`: a single-row marquee of chips — `★★★★★ · Service type · Neighborhood · relative date` — built from the same review data as `CityRecentCleans`.
- Placed directly above the quote section on both city pages, so the last thing a visitor sees before the form is fresh, local proof.

## Files touched

- `src/pages/Edmonton2.tsx`, `src/pages/Calgary2.tsx` — quote section trust/rating upgrades, activity strip, service-param heading
- `src/components/ServiceDetailPage.tsx` — service-tagged quote links (all 6 service pages inherit)
- `src/components/RecentActivityStrip.tsx` — new
- `src/lib/tracking.ts` — new
- `src/pages/QuoteRedirect.tsx` — forward tracking params, extend debug view

## Out of scope

- Offer/discount banner (no offer to advertise — skipped per your selection)
- Moving the quote form into the hero (form stays at page end per your selection)
- No changes to the Bookin60 embed itself, GHL configuration, or BookingKoala IDs

## Verification

- Browser-check both city pages: rating line, badges, activity strip, personalized heading via `?service=deep-cleaning#quote`
- Browser-check `/quote-redirect?service=Deep Cleaning&debug=1` with gclid/UTM params to confirm capture + forwarding
- No console errors; mobile and desktop layouts intact
