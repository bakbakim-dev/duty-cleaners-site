import { Link } from "react-router-dom";
import { POLICY } from "@/data/policy";
import { formatPrice } from "@/data/pricing";
import { addOnFromPrice } from "@/data/pricing";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { deepCleanTierRows, featuredExtraRows } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { Accent, AccentGold } from "@/components/Accent";
import { Sparkles, Bath, UtensilsCrossed, Layers } from "lucide-react";
import heroImage from "@/assets/gallery/calgary-kitchen-clean.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
/** Cheapest published price for an add-on, straight from bk-config. */
const addOnLabel = (key: string) => formatPrice(addOnFromPrice("standard", key) ?? 0);

const ROWS = deepCleanTierRows();
const TIERS = ROWS.map((row) => ({ size: row.beds, price: row.price }));
/** The one-bedroom row, with its standard and package halves, for the price FAQ. */
const DEEP = ROWS[0];
/** The two- and four-bedroom rows, for the worked examples. */
const DEEP2 = ROWS[1];
const DEEP4 = ROWS[3];
/** The two-storey home-type charge (verified BookingKoala Form 1 capture), and the Mahogany example's total with it. */
const TWO_STOREY = formatPrice(BK_PRICE_OVERRIDES[90].price);
const MAHOGANY_TOTAL = formatPrice(Number(DEEP4.price.replace(/[^0-9.]/g, "")) + BK_PRICE_OVERRIDES[90].price);
/** The largest row, so the price FAQ can state the top of the range itself. */
const DEEP5 = ROWS[ROWS.length - 1];
/** Travel fee for an address outside Calgary city limits, from bk-config. */
const TRAVEL = formatPrice(travelFee("standard") ?? 0);
const REVIEWS = CITY_PROOF.calgary.googleReviewCount;

export default function CalgaryDeepCleaning() {
  return (
    <ServiceDetailPage
      city="calgary"
      crossCity={{ city: "Edmonton", to: "/edmonton/deep-cleaning/", description: "The same deep clean, delivered by our Edmonton team.", linkText: "Deep cleaning in Edmonton" }}
      quoteService="deep-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle={`Deep Cleaning Services Calgary from ${TIERS[0].price} | Duty Cleaners`}
      seoDescription={`A Calgary deep clean adds baseboards, door frames, vents, grout and stovetop degreasing to the standard clean, from ${TIERS[0].price} before GST for a one-bedroom.`}
      serviceName="Deep House Cleaning in Calgary"
      canonical="https://dutycleaners.ca/calgary/deep-cleaning"
      heroHeading={<>Deep Cleaning Services in <AccentGold>Calgary</AccentGold></>}
      heroSubheading={`Everything in a standard clean, plus what a standard clean does not reach: baseboards and door frames, switches and outlet covers, vent covers, tile and shower glass, the stovetop and range hood degreased. From ${TIERS[0].price} before GST for a one-bedroom, flat by home size, with any pet charge, home-type charge or travel fee added on the quote. The inside of the oven and fridge are add-ons.`}
      heroBadges={["Baseboards & Door Frames by Hand", "All Supplies Brought For You", `Missed Spots Re-Cleaned if Reported Within ${POLICY.guaranteeWindowHours} Hours`]}
      heroImage={heroImage}
      heroImageAlt="Long kitchen with granite counters, a gas cooktop under a range hood and two stainless-steel fridges"
      heroImageWidth={800}
      heroImageHeight={800}
      overviewEyebrow="Service Overview"
      overviewHeading={<>The reset regular cleaning <Accent>can't reach.</Accent></>}
      overviewParagraphs={[
        <>
          A deep clean is the full <Link to="/calgary/regular-cleaning/">Calgary standard clean</Link> with the
          deep-clean package on top, priced flat by home size and starting at {TIERS[0].price} before GST for a one-bedroom.
        </>,
        "In Calgary the build-up a deep clean removes has a winter cause. The city thaws and refreezes on chinooks from November to April, so the roads are gritted, melted and gritted again, and sand and de-icer arrive at the door with every thaw. That grit does not stop at the mat. It works along baseboards, into carpet edges, down the sides of stair treads and under furniture, and by late winter it sits where an ordinary vacuum pass no longer reaches. A deep clean is what takes it back out.",
        "The rest depends on where you live. A Beltline or Eau Claire condo is one of the simplest jobs in the city, and its build-up is the fine grit that dry air and wind keep moving around the city for most of the year. In a newer house in Mahogany, Seton or Livingston the build-up is construction dust. A deep clean covers scrubbing baseboards and door frames, hand-wiping switches and outlet covers, degreasing stovetops and range hoods, and detailing tile and shower glass.",
      ]}
      sections={[
        {
          heading: "Deep house cleaning in Calgary: two worked prices",
          body: (
            <>
              <p>
                Every deep clean is two numbers added together, the standard rate for the home and the deep-clean
                package for its size. A two-bedroom condo in the Beltline pays {DEEP2.standard} for the standard clean
                and {DEEP2.packagePrice} for the package, {DEEP2.price} in total. A four-bedroom in Mahogany pays{" "}
                {DEEP4.standard} plus {DEEP4.packagePrice}, or {DEEP4.price}. Both are the apartment rate before GST.
                As a two-storey house, the Mahogany home adds the {TWO_STOREY} home-type charge, for {MAHOGANY_TOTAL}{" "}
                before GST, and a home with a dog or a cat adds the {addOnLabel("must-choose-if-you-have-pets")} pet
                charge on each visit.
              </p>
              <p>
                The package is what buys the hours on trim, doors, switch plates, vents, fans and the kitchen
                degrease, so it rises with the bedroom count. The oven interior, the fridge interior and the insides of
                cabinets are not in it: inside the oven is {addOnLabel("inside-oven")}, inside the fridge{" "}
                {addOnLabel("inside-fridge")}, and inside the cabinets from{" "}
                {addOnLabel("inside-cabinets-kitchen-bathroom-only")}, each before GST. The standard
                rates by themselves are on{" "}
                <Link to="/calgary/pricing/">Calgary house cleaning prices by home size</Link>.
              </p>
            </>
          ),
        },
        {
          heading: "Deep cleaning in Airdrie, Cochrane, Okotoks and Chestermere",
          body: (
            <>
              <p>
                All four are outside Calgary city limits, so a deep clean there is the same flat rate plus a {TRAVEL}{" "}
                travel fee, shown on the quote before you book. Inside the city there is no travel fee. Airdrie and
                Cochrane have their own pages: <Link to="/cleaning-services-airdrie/">house cleaning in Airdrie</Link>{" "}
                and <Link to="/cleaning-services-cochrane/">cleaning services in Cochrane</Link>.
              </p>
              <p>
                Outside the city the checklist and the package are the same as in Calgary, and the travel fee is the
                one charge the distance adds. The pet charge and the home-type charge for a townhouse or two-storey house apply there just as
                they do inside the city, and each one is a separate line on the quote before you confirm.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What a deep clean adds"
      includedSubheading="The places a standard visit passes over, room by room."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Detail Clean", description: "The stovetop and range hood degreased, appliance exteriors, cabinet fronts and the backsplash wiped, and every prep surface sanitized." },
        { icon: Bath, title: "Bathroom Deep Scrub", description: "Tile, grout and shower glass worked over, soap scum and mineral scale lifted off tubs and fixtures, toilets done inside and out, vanities and mirrors polished." },
        { icon: Layers, title: "Edges & Details", description: "Baseboards, door frames, light switches, outlet covers, vents and the corners that hold dust, all wiped by hand." },
        { icon: Sparkles, title: "Full Dust Reset", description: "Fans, vents and the high and low surfaces a reach can get to, dusted through the whole home." },
      ]}
      bullets={[
        "All standard cleaning tasks included",
        "Baseboards hand-wiped throughout",
        "Doors, door frames, and trim wiped",
        "Light switches and outlet covers cleaned",
        "Stovetop and range hood degreased",
        "Exterior of all kitchen appliances cleaned",
        "Cabinet fronts and handles wiped",
        "Tile and shower glass detailed",
        "Vent covers wiped",
        "Detailed cobweb and corner cleaning",
        "Floors thoroughly mopped and vacuumed",
      ]}
      roomTasks={[
        { name: "Kitchen Detail", tasks: 6, sample: "the stovetop and range hood degreased" },
        { name: "Bathroom Scrub", tasks: 5, sample: "tile and shower glass worked over" },
        { name: "Edges & Details", tasks: 5, sample: "baseboards and door frames wiped by hand" },
        { name: "Bedrooms & Living", tasks: 4, sample: "high and low surfaces dusted" },
      ]}
      pricingBySize={TIERS}
      fromPrice={TIERS[0].price}
      extras={featuredExtraRows()}
      notIncluded={[
        // The list was all safety exclusions — 25 lb, ladders, mould. The four
        // below are scope, and they are what customers actually assume a deep
        // clean covers: the commonest disputes in this trade, on the page where
        // someone is about to spend several hundred dollars. Prices are derived
        // from bk-config, because the published-prices guard is right that a
        // hand-typed figure drifts the moment BookingKoala changes.
        `Inside the oven: an add-on at ${addOnLabel("inside-oven")}`,
        `Inside the fridge: an add-on at ${addOnLabel("inside-fridge")}`,
        `Inside cabinets and drawers: an add-on from ${addOnLabel("inside-cabinets-kitchen-bathroom-only")}`,
        `Interior windows: an add-on from ${addOnLabel("inside-windows")}`,
        "Wall washing, a separate add-on booked with the clean rather than part of the package",
        "Furniture and anything else over 25 lbs stays where it is",
        "Exterior windows and any outdoor work",
        "Mould remediation, bodily fluids and pest removal",
        "Anything higher than a 3-step ladder reaches",
        "Light bulbs, chandeliers and fragile fixtures",
        "Garages, patios and balconies (a balcony sweep is an add-on)",
      ]}
      faqs={[
        { q: "Is there a best time of year for a deep clean in Calgary?", a: "Late winter or early spring clears a whole winter of road sand and de-icer at once. Calgary thaws and refreezes on chinooks from November to April, so entryways and baseboards collect grit again and again rather than staying frozen over. Late autumn is the other sensible window, resetting the house before that cycle starts. If a particular date matters, book ahead: same-day and next-day slots depend on the schedule." },
        { q: "Can I book a deep clean for only part of the house?", a: `The deep clean is priced flat for the whole home by its size, from ${TIERS[0].price} for a one-bedroom before GST, so the quote covers every room. If one room needs more attention than the rest, note it on the booking so the team knows before it arrives. For a job that is only one or two rooms, call the Calgary office at (403) 768-1341 and describe it before you book.` },
        { q: "How should I get the house ready?", a: "You do not need to clean before the team comes; clear counters and floors get cleaned and cluttered ones get worked around; decluttering and organising are a separate hourly add-on. Clutter matters more on a deep clean than on a standard one, because the package is surfaces, baseboards and trim: nobody can wipe a baseboard behind a row of boxes or degrease a stovetop under a drying rack. If a room should be skipped, say so on the booking." },
        { q: "Is deep cleaning more expensive than standard cleaning?", a: `Yes, by the price of the deep-clean package. For a one-bedroom that is ${DEEP.packagePrice}: ${DEEP.price} for the deep clean against ${DEEP.standard} for a standard clean. The package rises with each bedroom, to ${DEEP5.packagePrice} on a five-bedroom home, where a deep clean is ${DEEP5.price} against ${DEEP5.standard}. Those are apartment or condo rates before GST; a townhouse or two-storey house, a home with pets and an address outside Calgary city limits each add a charge on the quote.` },
        { q: "Will the team deal with mould in the shower?", a: "Light surface mildew on grout or caulking gets wiped where it is safe to. Anything heavier is mould remediation, which is a different trade, and we will tell you so rather than scrub at it." },
        { q: "How long will a Calgary deep clean take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "What does a deep clean do that a standard clean does not?", a: "The standard clean keeps a kept-up home kept up: floors, bathrooms, kitchen surfaces, dusting. The deep-clean package goes to what those visits pass over, the baseboards and door frames, the switch plates and outlet covers, the vents and fans, the tile and shower glass, and the range hood and stovetop grease. It is the reset; the standard visits are the maintenance." },
        { q: "Are the products safe around children and pets?", a: `We bring standard professional products. If anyone in the house has a sensitivity, or there is a product you would rather we did not use, say so when you book. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}. A home with pets carries a ${addOnLabel("must-choose-if-you-have-pets")} charge on each visit, and it shows on the quote before you book.` },
        { q: "How often does a Calgary home need a deep clean?", a: "Twice a year is a sensible rhythm for a Calgary home: once in spring, after the chinook season that runs from November to April, and once in late autumn before it starts again. Between them, the standard clean on a schedule keeps the build-up from returning, at 10% to 20% off from the second visit. A home with a dog or a garage entry may want the second deep clean sooner." },
      ]}
      closingSections={[
        {
          heading: "Keeping it that way",
          body: (
            <>
              <p>
                A deep clean resets the house; it does not stop the chinooks. The usual next step is the standard
                checklist on a schedule, and{" "}
                <Link to="/calgary/recurring-cleaning/">recurring cleaning in Calgary</Link> takes 20% off weekly, 15%
                off bi-weekly and 10% off every 4 weeks from the second visit. Scuffed or greasy walls are a separate
                job: <Link to="/wall-washing-wall-cleaning-calgary/">wall washing in Calgary</Link>.
              </p>
              <p>
                Our Calgary team is rated {RATING_CLAIM}{REVIEWS ? ` over ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link>. The rest of what we do here, each with its starting
                price, is on <Link to="/calgary/services/">every Calgary cleaning service, with starting prices</Link>.
              </p>
            </>
          ),
        },
      ]}
      ctaHeading={<>Deep cleaning in <AccentGold>Calgary</AccentGold> from {TIERS[0].price}.</>}
      ctaDescription={`The deep clean is priced flat by home size, from ${TIERS[0].price} before GST for a one-bedroom apartment, and a pet charge, a home-type charge or a travel fee outside Calgary city limits can apply. Anything missed is re-cleaned at no charge if you tell us within ${POLICY.guaranteeWindowHours} hours.`}
      galleryImages={[
        { src: heroImage, alt: "Kitchen with granite counters and a range hood over a gas cooktop, with a dining table by the window" },
      ]}
    />
  );
}
