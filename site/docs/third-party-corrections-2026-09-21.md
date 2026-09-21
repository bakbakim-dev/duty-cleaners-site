# Third-party corrections: insurance, guarantee, products, prices (2026-09-21)

Why this exists: the HiBot "AI visibility audit" of 2026-09-21 showed AI answers
saying Duty Cleaners is "insured, bonded and background-checked", has a "100%
satisfaction guarantee", and a "48-hour" re-clean window. None of that is true
(owner, `POLICY.insuranceStatus` 2026-09-18; `POLICY.guaranteeWindowHours` 24,
"explicitly not 48"). This pack lists where those claims live and what to send.

It is a submission draft. Nothing here has been sent. Sending a correction or
claiming a listing is the owner's action (or needs the owner's explicit go-ahead).

## 1. The biggest source is our own old pages in Google's index

Search results still quote the retired WordPress site on dutycleaners.ca itself:
"fully licensed, insured and bonded", "comes with a 100% satisfaction
guarantee ... let us know within 48 hours", "all cleaning professionals ... are
bonded and insured prior to working for the company". The new site says none of
this. It corrects itself as Google recrawls; to speed it up, in Search Console
(account slot /u/6/) use URL Inspection → Request indexing on:

`/`, `/cleaning-services-calgary/`, `/move-out-cleaning-calgary/`,
`/move-out-cleaning-edmonton/`, `/commercial-cleaning-services-calgary/`,
`/commercial-cleaning/`, `/services/`, `/about-us/`, `/faqs/`, `/pricing/`,
`/satisfaction-guarantee/`, `/reviews/`, `/cleaning-services-st-albert/`

(Google allows roughly 10 requests a day per property: do them over two days.)

## 2. Third-party pages, checked 2026-09-21

| Source | What it says that is wrong | How to fix |
|---|---|---|
| edmontontop10.ca — "Top 10 Best Home Cleaning Companies in Edmonton" (#5) | "100% Money Back Guarantee" | Their "Suggest a correction" form (`/contact?about=correction`). Copy A. |
| threebestrated.ca — Edmonton house cleaning | Old prices (3-bed $210 / deep $320), office cleaning "$60 per hour per cleaner", "complete satisfaction guarantee" | Use `threebestrated-correction-pack-2026-09-20.md`; it already carries the 24-hour re-clean wording. |
| bestprosintown.com — Duty Cleaners, Edmonton | "eco-friendly products upon request" | Ask for removal. Copy B. |
| poyst.com — Duty Cleaners House Cleaning Services Calgary | "safe, pet- and child-friendly products", "eco-friendly solutions" | "Claim this business", then edit the description. Copy B + Copy C. |
| mylifegb.com — Duty Cleaners, Edmonton | Wrong address (14250 85 Ave NW, T5R 3Z2); "we use eco-friendly cleaning products" | Contact the site; correct address is 18615 71 Ave NW, Edmonton, AB T5T 2V9. Copy B. |
| trustanalytica.org — Duty Cleaners reviews, Edmonton | Invented prices: Standard "$100–$150", Deep "$200–$300", Move-out "$300–$500" | Unclaimed profile: claim it, replace with Copy C prices or remove price ranges. |
| yelp.ca — duty-cleaners-edmonton-2 | Wrong address (14250 85 Ave NW); 3.6 stars from 15 reviews; one review quotes a "100% Satisfaction Guarantee" | Already on the owner's launch list (claimed profile). Fix the address; read the "About the Business" text for "insured"/"bonded" and remove it. |
| sunnyedmonton.com — best house cleaning services Edmonton | Mostly correct (24-hour guarantee, 20/15/10% discounts). Says equipment includes "HEPA systems and pressure washers" | Owner to confirm. If untrue, ask for removal; no contact form found on the page. |
| yellowpages.ca | Correct address; no false claims found | Nothing to do. |
| doineedacleaningservice.com | No false claims; no address shown | Optional: claim and add address. |

Not readable by automated check (log in or look manually): Facebook page
"About", Polarsteps "Cleaning Services Edmonton Duty Cleaners" (posted by a
Duty Cleaners account, so it is ours to edit), Wheree, Yably, and the three
Google Business Profile descriptions (owner only; the repo rule is never to log
in to GBP). Check each for "insured", "bonded", "licensed", "100%", "48 hours",
"eco", "green", "non-toxic", "pet-safe".

## 3. Copy to send

**Copy A — guarantee (and insurance, where it appears)**

> Please correct the Duty Cleaners listing. We do not offer a "100% money back
> guarantee". Our guarantee is: if something on our checklist was missed, tell
> us within 24 hours of the clean and we come back and re-clean it at no charge.
> Duty Cleaners holds a business licence. The company does not carry insurance
> or a bond. Some of our cleaners, who work as independent subcontractors, carry
> their own insurance and bond; if you need a cleaner who does, ask for it
> specifically when you book. Source: https://dutycleaners.ca/satisfaction-guarantee/
> and https://dutycleaners.ca/faqs/

**Copy B — products**

> Please remove "eco-friendly" / "green" / "pet- and child-friendly" product
> claims from the Duty Cleaners listing. Our cleaners are independent
> subcontractors who choose their own products, so we make no product-effect
> claims. Customers can ask for optional alternative products ($15 before GST);
> the office confirms what is available and suitable for their surfaces.

**Copy C — facts block for listings you can edit**

> Duty Cleaners has cleaned Alberta homes since 2017 (5,000+ bookings), from
> offices in Edmonton, Calgary and Red Deer. Standard, deep, move-in/move-out,
> recurring, post-construction and Airbnb turnover cleaning; office cleaning in
> Edmonton and Calgary. Standard cleaning from $155 before GST for a one-bedroom;
> recurring visits are 20% off weekly, 15% off bi-weekly, 10% off every four
> weeks. Instant price and online booking at https://dutycleaners.ca/pricing/.
> Missed something? Tell us within 24 hours and we re-clean it free.
> Edmonton: 18615 71 Ave NW, (780) 913-6565. Calgary: 2835 37 Street SW #24,
> (403) 768-1341. Red Deer: 5212 48 St, (587) 570-6979.

Never add "insured", "bonded", "licensed" (as a quality claim), "100%",
"48 hours", "eco", "green", "non-toxic" or "pet-safe" to any listing.

## 4. Re-check

Re-run the AI visibility audit in 3–4 weeks. If "insured and bonded" still
appears, ask the tool which source the engine cited, and add that source here.
