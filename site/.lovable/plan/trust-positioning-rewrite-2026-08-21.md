# Trust & Positioning Rewrite

Remove every protection/insurance-style claim from the site and replace the trust story with what is actually true: pay after the clean, record-checked and customer-rated cleaners, judgment-free service, and honest pricing.

Scope check from the codebase: 188 files currently contain at least one restricted term ("bonded", "insured", "insurance", "fully protected", "rigorously vetted", "no surprises", "eco-friendly/organic" as a standing claim, "over 8 years"). Most are the ~150 neighbourhood location pages, which repeat two shared blocks ("Bonded & Insured" feature card and a "Bonded & Insured" chip), so they can be swept mechanically.

## 1. Site-wide removal

- Sweep all restricted terms across `src/`, `index.html`, `public/llms*.txt` and sitemaps.
- Delete the Promise line "Your home and belongings are fully protected on every single visit — no exceptions." outright (no replacement wording).
- Location pages: replace the shared "Bonded & Insured" feature card with "Criminal-Record-Checked Cleaners" and the chip with "Pay after your clean".
- Footer: drop "Bonded, insured, and connected to..." and the "Fully Liability Insured" badge tile; replace with pay-after-clean and record-check badges.
- Meta descriptions on the Edmonton, Calgary and location pages currently say "bonded and insured" — rewritten to the new claim set.
- `/insurance-liability` is an entire page built on insurance claims. Recommendation: delete the page and route, remove it from the footer/sitemap, and redirect the path to `/satisfaction-guarantee` so the URL doesn't 404. If you'd rather keep a page at that URL, say so and it becomes a "How we work" page instead.
- `proof.ts`: remove the `insurerName` field and any insurance-related constants.

## 2. Hero and chips

- Hero kicker → "PAY AFTER YOUR CLEAN · RECORD-CHECKED CLEANERS · LICENSED SINCE 2017".
- Every short "Bonded & insured" chip (hero, homepage proof strip, funnel step 2 and step 3 micro-lines, pricing-page chips) → "Pay after your clean · record-checked cleaners".

## 3. Trust bar — 3 cards

1. You Pay After the Clean — temporary hold the day before, charged only once the clean is done.
2. Criminal-Record-Checked Cleaners — record check plus reference verification.
3. Make-It-Right Guarantee — existing copy unchanged.

## 4. Duty Clean Promise — 5 cards

Record-checked cleaners / Rated After Every Clean / Judgment-Free, Always / Priced on What You Tell Us / Make-It-Right Guarantee, using the exact copy supplied. The section keeps its asymmetric split; the right column becomes a 5-card stack.

## 5. New homepage section — "Judgment-Free, Always"

Full asymmetric split (serif pull-quote left, supporting copy right) placed directly after the guarantee section on both city homepages: eyebrow, serif heading, lead, body, 14px muted biohazard fine print, and a "See my price" button wired to the existing funnel trigger.

## 6. Pricing framing

Homepage pricing section, `/edmonton/pricing` and `/calgary/pricing` get the "Pricing that fits the job" heading and flat-or-hourly body copy, keeping the existing condition/pets/add-ons sub-line. Any remaining absolute pricing promise is removed.

## 7. Claim set

The 15 approved claims become the source list for chips, list items and supporting copy across service, city and location pages, replacing removed protection claims.

## 8. FAQ

Add or replace the six supplied entries (charging, pricing, who cleans, judgment, supplies, unhappy) on `/faq`, and delete the existing "Are your cleaners insured and bonded?" entry and the insured/background-checked wording inside the key-access answer. The `Fully Insured` badge on that page is replaced.

## 9. Condition-aware deep-clean routing

In the funnel's condition question ("When was it last properly cleaned?", stored as `dc_clean` 1-5):

- If the answer maps to 4 or 5 and Deep Cleaning is not in the basket, show a dismissible, non-blocking info callout beneath the chips with the supplied copy and an "Add Deep Cleaning +$XX.XX" button.
- Price is resolved live from `bk-config` for the selected home size through the existing extras resolver — never hardcoded.
- 3 or below: no callout. Deep Cleaning already selected: suppressed. Never auto-adds, never blocks Continue.

## 10. Consistency

"since 2017" everywhere ("over 8 years" removed), "4,000+ homes cleaned" kept, review count left as-is until an owner-supplied number arrives, and a final pass confirming no page implies damage protection, standard eco products, or price immutability.

## 11. Verification

- Grep proving zero occurrences of every banned term and phrase.
- Render checks at 375 / 768 / 1280 px for the trust bar (3 cards), Promise (5 cards) and the Judgment-Free section.
- All six FAQ entries present in the accordion.
- Funnel checks: condition 5 shows the callout with the correct per-size Deep price, tapping it updates totals and the handoff URL; condition 3 shows nothing; Deep already selected shows nothing.
- Existing pricing/booking test suite stays green.

## Technical notes

- Shared edits land in `DutyCleanPromise.tsx`, `Footer.tsx`, `QuoteFlow.tsx`, `CityConversionIntro.tsx`, `LocationPageTemplate.tsx` and the two city homepages; the per-location pages are swept with scripted find/replace on the two repeated blocks.
- Deep-clean callout reuses `resolveExtra` in `src/lib/bk-extras.ts` and the existing add-on state so totals and `extras[...]` handoff params flow unchanged.
- Memory rules that conflict ("Rigorously Vetted Pros", eco/non-toxic phrasing) will be updated to the new approved wording.
