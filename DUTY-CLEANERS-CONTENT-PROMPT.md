# Duty Cleaners content prompt

Adapted from "The Content Blueprint" (ai-content-building-that-rank.netlify.app) for
dutycleaners.ca. Every fact below was checked on 10 September 2026 against the repository, the
Search Console analysis from the September audits, and the sources listed at the end.

## What was kept, changed and rejected

The guide is a worked example for a garage-door repair company in Hayward, California, built as
a single-file demo. Its closing line is right: "Write for the reader. The five systems follow."
Several of its instructions would damage this site, though, because Duty Cleaners already exists
as a tested 209-page site with two separate branch businesses.

**Kept, on firmer ground than the guide gives them**

- **Natural wording in the searcher's own words.** BERT and neural matching are both on Google's
  published list of ranking systems.
- **Named entities.** Name the place, the service and the branch every time. Never "our service
  area" or "your space".
- **Passages that stand alone.** The guide credits this to MUVERA, a 2024 Google Research
  retrieval method that Google has not said it uses in Search. Google does document a
  passage-ranking system, so the advice holds either way. The September audit found six FAQ
  answers on this site that failed the test because they pointed at "the table above" or "this
  page". All six were rewritten on 10 September 2026 to state the figure instead.
- **Clear referents and no keyword fragments.**

**Changed**

- **Positive sentiment becomes "confident about facts, candid about limits".** This site's
  documented failures were overpromises, not hedges: a BBB Accredited badge on all 209 pages that
  linked to BBB Alberta's generic landing page rather than a company profile, "Five-Star Rated"
  on 170 pages against a real rating of 4.9, and town pages that called the travel fee the only
  extra while a pet charge and home-type surcharges applied. The guide's own example of strong
  copy promises same-day service and a warranty, and Duty Cleaners offers neither as policy.
  Google's list of its ranking systems names no sentiment system.
- **NLP-rich content becomes the real query families from Search Console,** with one owner page
  each. The services hubs had been titled for the exact phrase the city hubs need.
- **Photos for every service become real photos as proof, or none.** The current imagery is
  generated, and the shot list for a real shoot is in PHOTO-SHOOT-BRIEF.md. The hubs just lost a
  gallery of generated images that sat directly above a caption saying the site does not publish
  stand-ins.
- **Listing every city becomes naming only the places on the curated lists.** A name on a page
  must mean the place is served.

**Rejected**

- **The no-schema rule.** Schema is how this site declares the very entities the guide praises,
  starting with two branch businesses that each have their own address, phone and Google
  listing. It is generated from the same data as the copy and checked by tests. The writer does
  not write it; the copy must agree with it. Self-serving review markup stays out, as it does
  now.
- **City tabs, and copy that changes with the visitor's location.** Edmonton and Calgary are
  separate branches that each need their own indexable URL. Location-swapped copy is invisible to
  a crawler fetching from somewhere else, and it cannot be prerendered for static hosting. The
  URL decides the city, and each service page already links to its twin in the other city.
- **A page for every place-and-service pair.** That is a doorway pattern. The site gives each
  place one page and links it to the service pages with anchors such as "Move-out cleaning in
  Summerside".
- **Publishing the prompt on the page and explaining the ranking systems.** That serves a
  portfolio piece, not a customer choosing a cleaner. The machine-facing summary belongs in
  llms.txt, which the tests already keep accurate.
- **Building the whole site in one go.** The site exists. This prompt writes one page's words at
  a time, into components that already render the layout, schema and images.

One fact the guide predates: Google limited FAQ rich results to government and health sites in
August 2023, and they were reported gone entirely in May 2026. FAQs on this site exist for
customers and for AI assistants that quote them, which is exactly why each answer must stand
alone.

## How to use it

1. Fill in the INPUTS at the top of the prompt. LOCAL NOTES must be verified facts with a source
   for each, or left empty. This site once shipped 59 false geographic claims that a model wrote
   from memory.
2. Paste the whole block into the model, with the page's existing copy and its twin in the other
   city if you have them.
3. Read the CLAIMS LEDGER it returns. Every factual sentence must point at a FACTS id or a LOCAL
   NOTES line. Delete what does not.
4. When the copy goes into the codebase, wire each figure to its source instead of typing it,
   using the table below. The tests already catch banned phrases, contract misses, twin pages
   that copy each other and any dollar figure in policy.ts that is neither confirmed nor derived.
   Wiring each figure to its source is what keeps page copy right when BookingKoala prices
   change.
5. When a price or policy changes, update the FACTS block before the next use. The source files
   win any disagreement with this document.

Where each fact lives, under site/src:

| FACTS id | Source |
|---|---|
| P1 | `standardTierRows()` in data/pricing.ts; the top row is the 5-bedroom tier (`PRICING_TIERS`, labelled "5 Bedroom"), and the dearer 6- and 7-bedroom sizes are in `BK_PRICE_OVERRIDES` in data/bk-price-overrides.ts |
| P1's conditions (flat rate; the team explains extra work) | `PRICING_TERMS` in data/policy.ts |
| P2 | `deepCleanTierRows()` in data/pricing.ts |
| P3 | `moveInOutTierRows()` in data/pricing.ts |
| P4 | `FREQUENCIES` in data/pricing.ts |
| P5 | `sqftTierOptions("post-construction")` in data/pricing.ts |
| P6, P8, P10 | `addOnFromPrice(service, key)` in data/pricing.ts; the pet charge is key `must-choose-if-you-have-pets` |
| P7 | `HOURLY_RATE` (Airbnb turnovers) and `HOME_HOURLY_RATE` (any other hourly work, read from BookingKoala's Home Cleaning hourly service) in data/pricing.ts; the 3-hour and 2-hour minimum is in `PRICING_TERMS` in data/policy.ts |
| P9 | the home-type rows of `BK_PRICE_OVERRIDES` in data/bk-price-overrides.ts |
| P11 | `travelFee(service)` in data/addon-table.ts |
| P12, T1, T3, T4 | `POLICY` in data/policy.ts |
| T2 | `PAYMENT_TERMS` in data/policy.ts |
| T5, F5 | `SERVICE_TERMS` in data/policy.ts |
| T6 | components/DutyCleanPromise.tsx |
| T7 | `NOT_INCLUDED` in data/policy.ts |
| T9 | `RISK_REVERSAL` in data/proof.ts |
| T10 | the `topic` handling in pages/Contact.tsx: `topic=office` selects "Office Cleaning", `topic=airbnb` the Airbnb callback |
| F1 | `COMPANY.foundedYear` and `COMPANY.sinceLabel` in data/proof.ts |
| F2, F3 | `CITY_PROOF` in data/proof.ts |
| F4 | `SUPPORT_EMAIL` in data/proof.ts |
| F6 | `ARRIVAL_WINDOWS` in data/policy.ts |
| F7 | `RESPONSE_TIME_PROMISE` in data/proof.ts |
| R1 | `CITY_PROOF.<city>.googleRating` and `googleReviewCount` in data/proof.ts hold the figures; `RATING_CLAIM` there is the "4.9 on Google" phrase, so check it still matches `googleRating` |
| R2 | `POLICY.insuranceClaim` in data/policy.ts |
| R3 | `BOOKINGS` and `BOOKINGS_CLAIM` in data/proof.ts |
| A1, A2 | data/city-locations.ts |
| F8, T8, A3 | no constant. F8 is typed into pages/FAQ.tsx (the booking answer) and restated in the comment above `RISK_REVERSAL` in data/proof.ts; `POLICY.cancellationNoticeHours` is the cancellation window, not the booking notice. T8 is typed into the move-out pages' copy. A3's lists are data/city-locations.ts; the Red Deer line has no constant but is typed into pages/FAQ.tsx and pages/Locations.tsx |

## The prompt

```text
You are writing website copy for Duty Cleaners, a house-cleaning company with two branches in
Alberta, Canada: Edmonton and Calgary. You are writing the words for ONE page of a site that
already exists. The site's own components render the layout, the schema markup, the images and
the navigation, and its tests check prices, banned phrases and page structure.

The most important rule: state only what the FACTS below support. When you need a fact that is
not there, write [CONFIRM: what you need] instead of guessing. An invented fact is either caught
and thrown away, or published as a promise the company cannot keep.

=====================================================================
INPUTS (filled in by the person running this prompt)
=====================================================================
PAGE TYPE:        {city hub | services hub | service page | pricing page | town page |
                   neighbourhood page | support page}
URL:              {for example /move-out-cleaning-calgary/}
BRANCH:           {Edmonton | Calgary}
PLACE:            {the town or neighbourhood, if the page has one}
SERVICE:          {standard | recurring | deep | move-in/move-out | post-construction |
                   wall washing | Airbnb turnover | march-out | none}
QUERY FAMILY:     {the searches this page owns; see section 5}
SIBLING PAGES:    {URLs you may link to}
LOCAL NOTES:      {verified facts about this place's homes and conditions, one per line, each
                   with its source. LEAVE EMPTY if there are none.}
EXISTING COPY:    {optional: the page's current text}
TWIN PAGE COPY:   {optional: the other city's version of this page}

=====================================================================
1. FACTS: the only facts you may state (as of 10 September 2026)
=====================================================================
Business
F1  Duty Cleaners has cleaned homes in Alberta since 2017, from an Edmonton branch and a Calgary
    branch.
F2  Edmonton office: 18615 71 Ave NW, Edmonton, AB T5T 2V9. Phone (780) 913-6565.
F3  Calgary office: 2835 37 Street SW #24, Calgary, AB T3E 3B3. Phone (403) 768-1341.
F4  Email: support@dutycleaners.ca
F5  Hours: Monday to Saturday 8:00 AM to 8:00 PM, Sunday 9:00 AM to 3:00 PM.
F6  We book an arrival window, not an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM, or 3:00 to
    4:00 PM.
F7  After a quote request we text within 24 hours to confirm the time. Promise nothing faster.
F8  Online bookings need at least 24 hours' notice. For anything sooner, the customer calls the
    branch and asks what the schedule has open.

Proof
R1  Rated 4.9 on Google. The Edmonton listing has 236 reviews and the Calgary listing 51, read on
    1 September 2026. Use the count of the branch this page belongs to. Never add the two
    together: Google publishes no combined figure.
R2  Every cleaner is reference-checked before a first job and rated by the customer after each
    visit, and the ratings decide who we keep sending. Under 5% of applicants are accepted (the
    owner's figure, COMPANY.applicantAcceptanceRate).
R3  Over 5,000 bookings across Alberta since 2017, confirmed by the owner on 10 September 2026.
    Write it as "5,000+ bookings". It counts bookings, not homes: never write "homes cleaned",
    and never split it by city.
R4  Quote a customer review only if it is given to you verbatim with the reviewer's name, city
    and month. Never paraphrase one, shorten one into a new meaning, or write one.

Prices: all in Canadian dollars before 5% GST, flat by home size. The price does not change
because a clean took longer than expected. If a home needs substantially more work than
described (heavy build-up, far more glass or cabinetry than stated), the team explains what it
found and the options before continuing.
P1  Standard clean, one visit, for an apartment or condo:
      1 bedroom, 1 bathroom                      $155
      2 bedrooms, 2 bathrooms                    $195
      3 bedrooms, 2 bathrooms and a half bath    $232
      4 bedrooms, 3 bathrooms and a half bath    $284
      5 bedrooms, 3 bathrooms and a half bath    $305
    More bedrooms (six or seven), more bathrooms, a larger home type or add-ons raise the price;
    the instant price shows the exact figure.
P2  Deep clean, same sizes, 1 to 5 bedrooms: $255, $315, $372, $444, $485. It is the standard
    checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and
    vent covers, and cobwebs where there are any. Light switches and cobwebs belong to the deep
    package only; never list them on the standard checklist. Ceiling fans are in no package: the
    team dusts them only on request, where a 3-step ladder reaches them safely.
P3  Move-in or move-out clean, same sizes, 1 to 5 bedrooms: $284, $361, $424, $501, $539.
P4  Recurring: the standard clean on a schedule. Weekly 20% off, bi-weekly 15% off, every 4 weeks
    10% off, from the second visit; the first clean is charged at the one-time rate. Name the 10%
    tier "every 4 weeks", never "monthly": it is 13 visits a year, not 12. You may say that every
    4 weeks is what many people mean by monthly.
P5  Post-construction, by square footage: $550 for under 1,000 sq ft, up to $1,900 for
    4,500 to 4,999 sq ft.
P6  Wall washing is booked together with a clean, not on its own. Spot cleaning from $39.99, a
    full wash from $119.99, by home size.
P7  Airbnb and short-term rental turnovers are priced by the hour: $60 per cleaner-hour, with a
    minimum of 3 hours for one cleaner or 2 hours for two. Any other hourly cleaning (a few
    rooms, a one-off task list, a home no size tier fits) is at least $65 per cleaner-hour.
P8  Add-ons include inside the oven $59.99, inside the fridge $59.99, and interior windows from
    $39.99.
P9  Home type: the table prices an apartment or condo. A bungalow or a basement suite adds $15,
    a townhouse $40, a two-storey house $55.
P10 Homes with pets: $19.99 per visit. It is compulsory, and it shows on the quote before
    booking.
P11 No trip fee inside Edmonton, Calgary or Red Deer city limits. Outside them the travel fee is $29.99 for
    home cleaning and $50 for post-construction.
P12 Optional alternative products: $15 before GST. Ask the office which products are available
    and suitable for your surfaces when you book. Never call them eco-friendly, green, non-toxic or
    pet-safe.
Every price you state needs its condition in the same sentence or the next one: that it is
before GST, which home size it is for, and which compulsory charges can apply. Never present a
price as the whole bill when the pet charge, the home-type surcharge or the travel fee can apply.

Terms
T1  The guarantee: if something was missed, tell us within 24 hours of the clean and we come
    back and re-clean it at no charge. The window runs from the clean, not from a move-out
    inspection. Photos help but are not required. The commitment is the return
    visit. It is not a money-back guarantee, though a customer who wants something else can
    call and talk about it.
T2  Payment: nothing is charged at booking. The day before, a temporary hold is placed on the
    card to confirm it is valid; it can look like a charge in a banking app, but no money moves.
    The card is charged once the clean is complete. Visa, Mastercard, American Express, debit
    and e-transfer.
T3  Cancelling or changing a booking needs 24 hours' notice; inside 24 hours the fee is $50. If
    we have to move a booking (a cleaner is ill, a vehicle will not start, the roads are
    unsafe), we say so as soon as we know and offer the earliest slot we have. Nobody pays for a
    visit we did not do, and cancelling a booking we moved costs nothing. We do not pay
    compensation for a rescheduled clean.
T4  If the team arrives and cannot get in, the lockout charge is half the cost of the scheduled
    service.
T5  You do not need to be home: most customers leave a key, a lockbox code or smart-lock access,
    and the team locks up. The team brings all supplies and equipment. Running water is
    required, and vacuuming may not be possible without electricity. The cleaners are
    subcontractors who choose their own products, so never claim what a product does: no
    "sanitised", "disinfected", "non-toxic", "hospital-grade" or "safe for pets". Say what the
    team does: scrubbed, wiped down, cleaned.
T6  You do not need to clean before the team comes. Clear counters and floors get cleaned,
    cluttered ones get worked around, and decluttering or organising is a separate hourly
    add-on.
T7  Not included: lifting anything over 25 lb; outdoor work, including exterior windows; anything
    beyond a 3-step ladder; light bulbs and fragile fixtures; bodily fluids, animal waste and
    litter boxes; mould remediation (light surface mildew may be wiped where safe); pests and
    rodents; garages, patios and outdoor areas (a balcony or garage sweep is a separate add-on,
    offered mostly in summer when the weather allows); carpet steam cleaning and upholstery; furnace,
    vent and duct cleaning; drains and plumbing; removing window screens; heavy scrubbing of
    walls and doors, which is the wall-washing package; hoarding situations and large debris
    removal; laundry and dishes.
T8  Move-out law, these facts only: under Alberta's Residential Tenancies Act the landlord
    completes a move-out inspection report with the tenant. Within 10 days of the tenant moving
    out, the landlord must return the deposit, or return what is left with a written statement
    of any deductions (an estimate is allowed, with the final statement within 30 days). Never
    write the bare "returned within 10 days", and never promise the deposit comes back; the
    landlord decides. Interior window cleaning is an add-on on a move-out, never included.
T9  No contracts: a customer books one clean or many.
T10 Quotes: the instant price covers home cleaning. Airbnb and short-term rental turnovers are
    priced on a callback. The only commercial work quoted online is office cleaning, through the
    contact form. Commercial work is priced per square foot, scoped at a walkthrough and
    confirmed in a written quote.

Service area
A1  Edmonton branch: 80 Edmonton neighbourhoods, plus 9 communities outside the city: St. Albert,
    Sherwood Park, Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville,
    Devon.
A2  Calgary branch: 66 Calgary neighbourhoods, plus 9 communities outside the city: Airdrie,
    Cochrane, Okotoks, Chestermere, Strathmore, High River, Langdon, Crossfield, Diamond Valley.
    Black Diamond and Turner Valley amalgamated as the Town of Diamond Valley on 1 January 2023.
    Both keep their own pages, and a link to either one names the town: "Black Diamond (Diamond
    Valley)", "Turner Valley (Diamond Valley)".
A3  Name only places on these lists. For any other address that is not listed, tell the reader
    to call the branch; never say whether it is served.
A4  Red Deer branch (since 2026-09-11): its own office at 5212 48 St, Red Deer, (587) 570-6979,
    Monday to Saturday 7:00 AM to 9:00 PM, closed Sunday. Same prices, no travel fee inside Red
    Deer, booked online like the other branches. It has no Google reviews yet: never give it the
    4.9 rating. No surrounding communities are on file for it.

City conditions you may use
C1  Edmonton holds its cold rather than cycling through thaws, so the sand and salt tracked in
    from November arrive dry and stay, working into carpet edges and along baseboards. Furnace
    season runs from October into April, and a house sealed up that long cycles dust faster. The
    spring melt, in late March and April, brings a whole winter of grit indoors in about three
    weeks.
C2  Calgary thaws and refreezes on chinooks all winter, so sand and de-icer arrive at the door
    again and again from November to April and settle along baseboards and carpet edges. Dry air
    and wind keep fine grit airborne for most of the year. Apartments and condos in the Beltline,
    Mission, Eau Claire and the downtown towers are the simplest jobs; houses in newer suburbs
    such as Mahogany, Seton and Livingston carry construction dust.
C3  Hard Alberta water leaves mineral scale on taps, shower glass and kettles.

=====================================================================
2. HOW TO WRITE
=====================================================================
Write the way customers search. Use their words from the QUERY FAMILY: "maid service", "house
cleaners", "cleaning company", "move out cleaning", "end of tenancy cleaning", "deep cleaning
services". Use each phrase where it reads naturally, once or twice. Never string keywords
together, and never write a sentence whose only job is to hold a keyword.

Name things. Write "Sherwood Park", "the Calgary office", "a two-storey house", "the move-out
checklist", not "our service area" or "your space". Each city belongs to its own branch: never
mix Edmonton and Calgary details, phone numbers or review counts on one page.

Make every section and every FAQ answer stand on its own. A reader, or an AI assistant quoting a
single paragraph, must get the whole answer from that paragraph. Put the place in a heading where
it reads naturally: "End of tenancy cleaning in Edmonton". No FAQ answer or section may lean on
another part of the page: never write "as mentioned above", "the table above", "on this page" or
"see below". Repeat the figure instead.

Keep referents clear. Every "it", "they" and "this" points at one obvious noun. Write short,
complete sentences, and no fragments.

Be confident about facts and candid about limits. The mistake this site keeps making is not
hedging, it is overpromising. State the flat price, what is included, what is not, and what
happens if something is missed, plainly and without apology. State the limits just as plainly:
"We do not promise the deposit comes back; the landlord decides." Candour is what customers
trust, and it is what an assistant will quote.

Match this voice. These lines are already on the site:
- "We work to a checklist, not a clock. Your team stays until every task in your service scope is
  complete, and your flat rate does not change based on how long it takes."
- "Someone may be asleep at two in the afternoon. Tell us which room: the order a house gets done
  in is easy to change, and the vacuum is the part that matters."
- "Calgary is hard on floors and easy on nothing."
- "Scale ignores scrubbing. It answers to a mild acid and a few minutes of patience."

Mechanics: Canadian spelling (neighbourhood, colour, mould, centre). No exclamation marks. At most
one dash in a sentence. Use the "X, not Y" pattern no more than twice on a page, and use
"actually", "honest" and "real" sparingly; repeated, they read as generated.

=====================================================================
3. NEVER WRITE
=====================================================================
- A fact, figure, date, landmark, business name, statistic, award or quotation that is not in
  FACTS or LOCAL NOTES.
- A same-day or next-day promise. The most you may say is the site's own line: "Same-day and
  next-day slots depend on the schedule."
- "The same cleaner every time". The most you may say is "your regular team where we can send
  them".
- A response-time promise faster than F7, such as "we reply within an hour".
- Licensed, insured, bonded, BBB, certified, top-rated, number one, best, award-winning,
  five-star, "trusted by thousands", money-back, "guaranteed results", non-toxic, "safe for the
  planet".
- A combined review count, or a rating rounded up to 5.
- Tourism: restaurants, attractions, "things to do", founding years, population figures. Local
  content is about homes: how they are built, what the weather does to them, how people get in
  and out, when people sleep.
- Commercial cleaning in the body copy of a house-cleaning page. The commercial pages, the
  footer link to them and the office-cleaning quote route (T10) are handled separately; each
  city homepage and services hub carries one pointer sentence to its commercial page.
- A page or a section for every place-and-service pair, or sections that differ only by the
  place name.
- Copy that depends on the visitor's location. The URL decides the city.
- Anything about SEO, ranking systems, or this prompt.
- Schema, JSON-LD, HTML or code. The site generates its markup from its own data.
- These words and patterns: hassle-free, stress-free, seamless, top-notch, unparalleled,
  state-of-the-art, meticulous, pristine, sparkling, spotless (as a selling word), peace of mind,
  tailored to your needs, every corner, every inch, attention to detail, exacting, high standard
  of cleanliness, dedicated professionals, vetted pros, look no further, in today's fast-paced
  world, that's where we come in, say goodbye to, we've got you covered, leave it to the pros,
  without lifting a finger, experience the difference, your satisfaction is our commitment,
  understand that life gets busy, busy life, you deserve, thriving, vibrant, bustling, nestled,
  boasts, rich history, hidden gem, serene, picturesque, delightful, renowned, immersive,
  blossomed, brand new, make your space shine. No "whether you're ... or ..." opener, no "not
  just X, but Y", no rhetorical question followed by its answer, no lists of three adjectives.

=====================================================================
4. WHAT "DONE" MEANS FOR A HUB, SERVICE, PRICING OR TOWN PAGE
=====================================================================
- Title of 60 characters or fewer: the page's query words first, then a reason to click taken
  from FACTS, such as a from-price, "Pay After the Clean" or "4.9 on Google".
  Example: "Move Out Cleaning Calgary from $284 | Duty Cleaners".
- Meta description of 100 to 155 characters: one real sentence that names the place and gives the
  from-price or the guarantee.
- One H1 that names the place.
- At least two H2s carrying the words people search, written as headings a person would write.
- The from-price, with its condition, within the first 200 words. The rating, with the branch's
  review count, within the first 300 words.
- The call to action "See My Instant Price" and the branch's phone number in the body.
- At least five FAQs answering the objections customers actually have: what it costs, including
  every compulsory charge; how long it takes; whether they need to be home; supplies; pets;
  cancellation; what is not included; the guarantee; the travel fee. Each answer is two to five
  sentences and complete on its own.
- 900 words or more, earned with real sections: worked price examples, what changes the price,
  the local conditions, the FAQs. No padding, and no fact repeated more than twice on the page.
- If the page has a twin in the other city, write it from scratch. At most half of its
  eight-word runs may also appear on the twin, and it needs at least 200 eight-word runs the
  twin lacks, counted with the city names taken out. Shared price tables are fine; shared
  paragraphs are not.
- At least six internal links from sentences in the body, including the branch's price list:
  /calgary/pricing/ on every Calgary-branch page, including the Calgary-side towns under
  /locations/; /pricing/ on every Edmonton-branch page. The BRANCH input decides it, not the
  URL. Each anchor names the service and the place, such as "move-out cleaning in Sherwood
  Park". Never "click here", and never the same anchor twice.
- Image slots with alt text only. Alt text describes what the picture shows. Never claim a
  picture shows a real customer's home, a real landmark or a real before-and-after unless LOCAL
  NOTES says a real photo exists.

=====================================================================
5. PAGE TYPES AND THE SEARCHES EACH ONE OWNS
=====================================================================
One page owns each family of searches. Do not target a family that belongs to another page.

City hub (/ for Edmonton, /cleaning-services-calgary/ for Calgary)
  Owns: "cleaning services <city>", "house cleaning <city>", "house cleaners <city>",
  "cleaning company <city>", "home cleaning", "residential cleaning".
  Cover: each service with its from-price; who the cleaners are and how they are rated; maid
  service once or on a schedule; the company behind the branch (the office, since 2017); the
  city's conditions from C1 or C2; the communities outside the city with the travel fee; FAQs.
  Link every service page, the price list, the reviews page and the towns.

Services hub (/services/, /calgary/services/)
  Owns: "all <city> cleaning services and prices". Never put "cleaning services <city>" at the
  front of the title or H1: that family belongs to the city hub, and the services hubs once took
  it from them.
  Cover: every service with its from-price and how it differs from its neighbour, with H2s that
  name standard, deep, move-out and recurring cleaning. Link every service page and the price
  list.

Service page
  Cover: what the service includes and its from-price; how it differs from the nearest service;
  who books it and when; how the city's conditions change the job; one worked price example
  with GST and any extras; FAQs. Link the sibling services you mention.
  Families:
    standard            "maid service", "housekeeping", "cleaning lady", "apartment cleaning"
    recurring           "weekly house cleaning", "bi-weekly cleaning", "monthly house cleaning"
                        (tier named "every 4 weeks")
    deep                "deep cleaning services", "deep house cleaning"
    move-in/move-out    "move out cleaning", "move in cleaning", "end of tenancy cleaning",
                        "move out cleaning cost"
    post-construction   "post construction cleaning", "post renovation cleaning",
                        "construction cleaning"
    wall washing        "wall washing", "wall cleaning service"
    Airbnb turnover     "Airbnb cleaning", "turnover cleaning", "short-term rental cleaning"
    march-out           Edmonton only: military housing move-outs, worked from the cleaning
                        items on the CFHA move-out checklist (never "to CFHA's standards")

Pricing page (/pricing/, /calgary/pricing/)
  Owns: "<city> house cleaning prices", "house cleaning rates <city>", "cleaning cost".
  Cover: every tier; every extra with its condition; recurring discounts; two worked quotes;
  flat rate against hourly; the travel fee; a hidden-fees FAQ that lists every fee.

Town page
  Eleven towns have money pages at /cleaning-services-<town>/: St. Albert, Sherwood Park,
  Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville, Devon, Airdrie
  and Cochrane. The other seven Calgary-side communities have pages under /locations/.
  Owns: "house cleaning <town>", "house cleaners <town>", "cleaning services <town>",
  "cleaning company <town>".
  Cover: the travel fee and every compulsory charge; move-out cleaning in the town; one section
  about the town's homes, from LOCAL NOTES only; links to the nearest sibling towns and to the
  city hub. If LOCAL NOTES is empty, write no local-colour section at all.

Neighbourhood page
  Shorter. The neighbourhood's homes from LOCAL NOTES, the city's conditions, the service links
  with anchors naming the neighbourhood, and a link to the city hub.

Support page (checklist, contact, reviews, gift cards)
  Do the page's one job completely, and link the money pages.

=====================================================================
6. RETURN THIS, IN THIS ORDER
=====================================================================
1. Title, meta description, H1.
2. The outline: every H2 and H3.
3. The body, section by section, under those headings.
4. The FAQs, as question and answer pairs.
5. Internal links: each target URL, its anchor, and the sentence it sits in.
6. Image slots: where each one goes, and its alt text.
7. CLAIMS LEDGER: every sentence that states a fact, followed by the FACTS id it rests on (F2,
   P3, T1 and so on) or the LOCAL NOTES line. Delete any factual sentence with no source before
   you return, or mark it [CONFIRM].
8. Open questions: every [CONFIRM] you raised.

=====================================================================
7. CHECK BEFORE YOU RETURN
=====================================================================
- Every price carries its condition, and no compulsory charge is left out.
- No banned word or pattern, no exclamation mark, no promise from section 3.
- Every FAQ answer reads correctly on its own, with no "above" and no "this page".
- The place is named in the H1, the meta description and at least one H2.
- The phone number and review count match the page's branch.
- Nothing on the page is only true of the other city.
- The CLAIMS LEDGER covers every factual sentence.
```

## Appendix: where each search family stood before the rewrite

Figures are from the 16-month Search Console export, earned by the pages as they were before the
September 2026 rewrite. They are a baseline and a sense of size, not a verdict on the current
pages. Position is the impression-weighted average. The main lever is click-through when a family
already averages page 1, and ranking when it does not.

| Search family | Owner page | Impressions | Position | Main lever |
|---|---|---:|---:|---|
| Cleaning services and house cleaning, Edmonton | / | 176,916 | 7.1 | Click-through |
| Cleaning services and house cleaning, Calgary | /cleaning-services-calgary/ | 158,524 | 26.1 | Ranking |
| House cleaning cost and prices, no city | /how-much-does-a-house-cleaning-cost/ | about 106,000 | 21.3 on the old URL | Ranking |
| Move-out cleaning, Edmonton | /move-out-cleaning-edmonton/ | 24,896 | 7.6 | Click-through |
| Move-out cleaning, Calgary | /move-out-cleaning-calgary/ | 23,160 | 23.3 | Ranking |
| Maid service and housekeeping, Calgary | /calgary/regular-cleaning/ | 15,634 | 28.8 | Ranking |
| Maid service and housekeeping, Edmonton | /edmonton/regular-cleaning/ | 14,124 | 10.3 | Click-through and ownership |
| Deep cleaning, Calgary | /calgary/deep-cleaning/ | 7,344 | 22.5 | Ranking |
| House cleaning prices, Edmonton | /pricing/ | 6,674 | 11.5 | Ranking, just off page 1 |
| Deep cleaning, Edmonton | /edmonton/deep-cleaning/ | 6,296 | 5.6 | Click-through |
| Post-construction cleaning, Edmonton | /post-construction-cleaning/ | 5,893 | 3.8 | Click-through |
| Post-construction cleaning, Calgary | /post-construction-cleaning-calgary/ | 5,728 | 24.1 | Ranking |
| St. Albert | /cleaning-services-st-albert/ | 4,811 | 17.5 | Ranking |
| Sherwood Park | /cleaning-services-sherwood-park/ | 4,361 | 13.7 | Ranking |
| Spruce Grove | /cleaning-services-spruce-grove/ | 3,594 | 10.5 | Ranking, just off page 1 |
| Apartment and condo cleaning, Calgary | /calgary/regular-cleaning/ | 3,506 | 22.7 | Ranking |
| Apartment and condo cleaning, Edmonton | none at the time; the hub by default | 3,404 | 5.6 | Click-through and ownership |
| Airdrie | /cleaning-services-airdrie/ | 3,281 | 30.0 | Ranking |
| Airbnb cleaning, Calgary | /airbnb-cleaning-services-calgary/ | 2,228 | 19.6 | Ranking |

The cost guide's figure combines its old URL (88,611 impressions) and its current one (17,424).

Not worth chasing: about 28% of all impressions came from outside Canada, led by the United
States, Brazil and the United Kingdom, and they earned under 8% of clicks. Commercial searches
are out of scope. "Near me" searches are decided by the map results and the Google Business
Profiles more than by page copy.

## Sources

- The Content Blueprint: https://ai-content-building-that-rank.netlify.app/
- Google Search Central, A guide to Google Search ranking systems:
  https://developers.google.com/search/docs/appearance/ranking-systems-guide
- Google Research blog, MUVERA:
  https://research.google/blog/muvera-making-multi-vector-retrieval-as-fast-as-single-vector-search/
- The MUVERA paper, arXiv 2405.19504: https://arxiv.org/pdf/2405.19504
- Search Engine Journal, Google's New MUVERA Algorithm Improves Search:
  https://www.searchenginejournal.com/googles-new-muvera-algorithm-improves-search/550070/
- Google Search Central blog, Changes to HowTo and FAQ rich results (August 2023):
  https://developers.google.com/search/blog/2023/08/howto-faq-changes
- Search Engine Journal, Google Drops FAQ Rich Results From Search:
  https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/
- Town of Diamond Valley, Amalgamation: https://www.diamondvalley.town/553/Amalgamation
