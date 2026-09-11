# Cost guide price sample, September 2026

Source record for the market ranges on `/how-much-does-a-house-cleaning-cost/`
(`src/pages/BlogHouseCleaningCost.tsx`, `MARKET_SAMPLE`). Every figure below was
read from the company's own website on 11 September 2026 and re-read the same day
when the sample was corrected. The page states only the ranges, the number of
companies and the month; it never names or links a competitor.
`src/data/commercial-costguide-0911.test.ts` checks that the page's ranges equal
the "Ranges used on the page" table at the bottom of this file, so update both
together.

Only a company's own published prices count. Market estimates that a company
writes about "the Edmonton market" or "most Calgary cleaners" without saying it
charges them were read and left out (see "Read and excluded"). A range uses only
prices published for that job and that home size: a starting price for "any
size" does not set a 2-bedroom range, and a rate for a two-person team is not a
per-cleaner rate.

Figures are recorded as each company published them. Some say they are before
GST, one says it includes GST and some do not say, so the page's source line
says the figures are "taken as each company published them: before GST,
including GST, or not saying".

## Sample

| # | Company | City | URL | What was priced | Figure as published | Before GST? | Checked |
|---|---|---|---|---|---|---|---|
| 1 | Hellamaid (Edmonton) | Edmonton | https://hellamaid.ca/cleaning-guide/how-much-do-house-cleaners-charge-in-edmonton/ | Standard clean, 2 bed / 1 bath, about 1,100 sq ft (their worked example) | $228 | Yes ("before applicable tax") | 2026-09-11 |
| 1 | Hellamaid (Edmonton) | Edmonton | same | Move-in/move-out surcharge on the standard package | +$159 (2 bed / 1 bath: $228 + $159 = $387) | Yes | 2026-09-11 |
| 1 | Hellamaid (Edmonton) | Edmonton | same | Hourly, per cleaner, 3-hour minimum | $55 | Yes | 2026-09-11 |
| 2 | Art of CleaNest | Edmonton | https://www.artofcleanest.ca/house-cleaning-prices-edmonton/ | Standard clean, 1 to 2 bedroom apartment or condo ("Condition. The single biggest factor." sets where in the band a home falls) | $240 to $300 | Not stated | 2026-09-11 (page "Updated August 2026") |
| 2 | Art of CleaNest | Edmonton | same | Move-in/move-out, any size, ten-hour minimum | from $650 | Not stated | 2026-09-11 |
| 2 | Art of CleaNest | Edmonton | same | Hourly: standard $60, deep and move-out $65, "for our two-person teams" | $60 to $65 per team hour | Not stated | 2026-09-11 |
| 3 | AnyClean | Edmonton | https://anyclean.ca/move-out-cleaning-edmonton/ | Move-out clean, 2 bedrooms (fixed price) | $325 | Not stated | 2026-09-11 |
| 4 | NeatNow Cleaning | Calgary | https://neatnow.ca/blog/house-cleaning-cost-calgary/ | Standard clean, 2 bedrooms, 1 bath, 700 to 999 sq ft (one-time) | $165 (each extra bathroom +$25) | Yes ("before 5% GST") | 2026-09-11 (page updated 23 July 2026) |
| 4 | NeatNow Cleaning | Calgary | same | Move-out clean, small 2 bed, 1 bath, 700 to 999 sq ft | $340 | Yes | 2026-09-11 |
| 4 | NeatNow Cleaning | Calgary | same | Hourly custom cleaning, one cleaner, 3-hour minimum | $75 | Yes | 2026-09-11 |
| 5 | Three North Clean | Calgary | https://threenorthclean.com/pricing/ | Standard clean, 2-bedroom | $139 to $169 | Yes ("before GST") | 2026-09-11 |
| 5 | Three North Clean | Calgary | same | Move-out clean, 2-bedroom | $199 to $269 | Yes | 2026-09-11 |
| 6 | Two Peas Cleaning | Calgary | https://www.twopeascleaning.com/house-cleaning-in-calgary-prices-honest-ranges-real-examples-and-how-to-budget-for-a-cleaner-home/ | Hourly, per cleaner ("an hourly rate of $42, including GST, per hour, per cleaner") | $42 including GST | No: includes GST | 2026-09-11 (page dated 28 July 2026) |
| 7 | Calgary Trusted Cleaners | Calgary | https://calgarytrustedcleaners.com/service/house-cleaning-rates-calgary/ | Move-in/move-out, all sizes; deep clean, all sizes | $399 to $899; $349 to $849 | Yes ("+ GST") | 2026-09-11 |

Notes:

- Three North Clean's pricing page also lists "700–1,200 sq ft (1–2 bed)" at $109 to $149
  in a square-footage table. The bedroom table was used because it matches how the guide
  prices a home.
- Art of CleaNest's standard band is for a 1 to 2 bedroom apartment or condo and moves with
  the home's condition, so a 2-bedroom can be charged the top of it. That is why $300 is the
  high end of the standard range. Its move-out price ("from $650", any size, ten-hour
  minimum) is a starting price for every size, so it does not set the 2-bedroom move-out
  range. Its hourly rates are for a two-person team, so they do not feed the per-cleaner
  hourly range.
- Calgary Trusted Cleaners (row 7) publishes move-out and deep-clean prices only as ranges
  across all home sizes, so its figures are recorded here but do not feed the 2-bedroom
  ranges. Its standard prices are recurring-only. That leaves six companies behind the
  ranges (rows 1 to 6).
- GST: Hellamaid, NeatNow and Three North Clean say their prices are before GST. Two Peas
  says its $42 includes GST (about $40 before it). Art of CleaNest and AnyClean do not say.
  All are taken as published, and the hourly low end is Two Peas' $42 as published.

## Comparison with the guide

Before this sample the guide carried no market ranges: the ranges it once had were removed on
2026-09-10 because no source was on file, and it stated only Duty Cleaners' own prices. The
sample supports three ranges, each for a job the guide already prices, so they sit next to our
own figure for the same home:

| Job | Sample low | Sample high | Duty Cleaners (bk-config, before GST) |
|---|---|---|---|
| Standard clean, 2-bedroom home | $139 (Three North Clean) | $300 (Art of CleaNest, top of its 1 to 2 bedroom band) | $195 (2 bed, 2 bath apartment or condo) |
| Move-out clean, 2-bedroom home | $199 (Three North Clean) | $387 (Hellamaid, $228 + $159) | $361 (2 bed, 2 bath apartment or condo) |
| Hourly rate per cleaner | $42 (Two Peas, including GST) | $75 (NeatNow) | from $65 (home cleaning), $60 (Airbnb turnovers) |

Figures behind each range:

- Standard, 2-bedroom: Three North Clean $139 to $169, NeatNow $165, Hellamaid $228, Art of
  CleaNest $240 to $300.
- Move-out, 2-bedroom: Three North Clean $199 to $269, AnyClean $325, NeatNow $340,
  Hellamaid $387.
- Hourly per cleaner: Two Peas $42 (including GST), Hellamaid $55, NeatNow $75.

The companies' 2-bedroom figures are for one bathroom where they say so; ours are for two, so
ours is not the cheaper home to clean. The page says the ranges come from published prices,
taken as published, and that a quote may differ.

## Ranges used on the page

Machine-read by `src/data/commercial-costguide-0911.test.ts`. Keep the key names.

| key | low | high |
|---|---|---|
| standard-2-bedroom | 139 | 300 |
| move-out-2-bedroom | 199 | 387 |
| hourly-per-cleaner | 42 | 75 |

Companies behind the ranges: 6

## Read and excluded

These pages publish market estimates, not their own prices, or could not be read:

- Luxora Clean, https://luxoracleans.ca/blog/house-cleaning-cost-calgary (its hourly figures
  are a market estimate: "Most Calgary house cleaners charge between $35 and $50 per hour per
  cleaner"; not its own published price, so removed from the sample on 2026-09-11).
- Fussy Cleaning Services, https://faq.fussycleaning.ca/faq/how-much-do-house-cleaners-charge-in-edmonton/ (market ranges only; asks for a quote).
- Three North Clean's Edmonton guide, https://threenorthclean.com/blog/house-cleaning-cost-edmonton/ (market ranges only).
- Divine Maids, https://www.divinemaids.com/blog/house-cleaning-edmonton-prices (a Seattle company writing about Edmonton in general).
- Sherwood Cleaning Services, https://www.sherwoodcleaningservices.ca/how-much-does-house-cleaning-cost-in-alberta (ranges only, no size-based prices).
- Mesh Maids, https://meshmaids.ca/blog/how-much-you-should-expect-to-pay-for-cleaning-services-in-calgary/ (an "expect to pay" guide; not clear the figures are its own, so left out).
- KL Cleaning, https://www.klcleaning.ca/ (returned HTTP 403).

Re-check this sample before quoting it after March 2027; the page line says "checked
September 2026" and should move with the next check.
