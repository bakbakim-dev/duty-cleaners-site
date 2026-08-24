# Vetting Claims Amendment

Replace every claim implying formal background/criminal checks with the true position: cleaners are reference-checked before their first job and rated by the customer after every clean.

## New hard constraint

Never use: "background-checked", "background check", "criminal record check", "police-checked", "screened", "record-checked". Vetting = reference checks + post-clean customer ratings only.

## What changes

**1. Site-wide sweep** — 344 matches across ~180 files (city pages, all neighbourhood location pages, service pages, components, `index.html`, `public/llms.txt`, `public/llms-full.txt`, `src/data/proof.ts`). Automated replacement mapping:
- "record-checked cleaners" / "criminal-record-checked cleaners" -> "customer-rated cleaners"
- "Criminal-Record-Checked Cleaners" (headings) -> "Reference-Checked & Customer-Rated"
- longer sentences describing checks -> reference-check + rating wording
- any remaining "screened" / "background" phrasing -> reference-checked

**2. Hero kicker** (both city homepages, and any page reusing it):
"PAY AFTER YOUR CLEAN · CUSTOMER-RATED CLEANERS · LICENSED SINCE 2017"

**3. All short chips** (hero chip, proof strip, funnel step 2/3 micro-lines, pricing-page chips, trust marquee, footer):
"Pay after your clean · customer-rated cleaners"

**4. Trust bar card 2** (`CityConversionIntro.tsx`):
Title "Reference-Checked & Customer-Rated" — "Every cleaner is reference-checked before their first job, and rated by the customer after every clean. Those ratings decide who comes back."

**5. Promise section** (`DutyCleanPromise.tsx`) — merge cards 1 and 2 into one, leaving FOUR cards:
- "Earned Trust, Every Visit" — "Every cleaner is reference-checked before their first job — then rated by the customer after every single clean. Those ratings decide who keeps cleaning for us. Trust isn't something our cleaners claim; it's something they earn at every visit."
- Judgment-Free, Always (unchanged)
- Priced on What You Tell Us (unchanged)
- Make-It-Right Guarantee (unchanged)

**6. Claim-set chip** -> "Reference-checked, customer-rated cleaners"

**7. FAQ "Who will be cleaning my home?"** -> "A cleaner from our Edmonton and Calgary team. Every cleaner is reference-checked before their first job with us, and every clean is rated by the customer afterwards — those ratings decide who we keep sending. Cleaners who don't keep their scores up don't come back."

## Technical notes

- Sweep runs as an ordered regex script (longest phrases first) so no sentence is half-replaced; each file is re-read after the sweep for grammar breaks in prose paragraphs (location pages carry the phrase inside full sentences).
- Promise section grid currently sizes for five items; it moves to a four-card layout in the existing asymmetric split, checked at 375 / 768 / 1280px.
- `src/pages/JoinTheTeam.tsx` mentions checks in recruiting copy — reworded to reference checks, not removed.
- Tests: extend the forbidden-term grep assertion list with the six new terms; run typecheck and the existing 118 pricing/booking tests.

## Out of scope

No changes to prices, funnel steps, CTAs, routes, or the pay-after-clean and make-it-right claims.
