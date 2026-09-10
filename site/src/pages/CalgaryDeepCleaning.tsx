import { Link } from "react-router-dom";
import { POLICY } from "@/data/policy";
import { formatPrice } from "@/data/pricing";
import { addOnFromPrice } from "@/data/pricing";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { deepCleanTierRows, featuredExtraRows } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
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
      seoDescription={`Deep cleaning in Calgary from ${TIERS[0].price}, flat by home size: baseboards, door frames, vents, fans, tile and grout, kitchen degreased. Misses re-cleaned free.`}
      serviceName="Deep House Cleaning in Calgary"
      canonical="https://dutycleaners.ca/calgary/deep-cleaning"
      heroHeading={<>Deep Cleaning Services in <AccentGold>Calgary</AccentGold></>}
      heroSubheading={`Everything in a standard clean, plus what a standard clean does not reach: baseboards and door frames, switches and outlet covers, vents and ceiling fans, tile and shower glass, the stovetop and range hood degreased. From ${TIERS[0].price}, flat by home size. Inside the oven and fridge on request.`}
      heroBadges={["Top-to-Bottom Detail", "All Supplies Brought For You", "100% Satisfaction Guarantee"]}
      heroImage={heroImage}
      heroImageAlt="Calgary kitchen after a deep clean"
      heroImageWidth={800}
      heroImageHeight={800}
      overviewEyebrow="Service Overview"
      overviewHeading={<>The reset regular cleaning <Accent>can't reach.</Accent></>}
      overviewParagraphs={[
        <>
          A deep clean is the full <Link to="/calgary/regular-cleaning/">Calgary standard clean</Link> with the
          deep-clean package on top, priced flat by home size and starting at {TIERS[0].price} for a one-bedroom.
        </>,
        "Calgary homes collect that build-up differently than most. Sitting at the foot of the Rockies, the city thaws and refreezes all winter long, so roads are gritted, melted and gritted again rather than staying frozen through to spring. That sand and de-icer does not stop at the door. It works along baseboards, into carpet edges, down the sides of stair treads and under furniture, and by February it is somewhere a vacuum no longer reaches. A deep clean is what takes it back out.",
        "The rest depends on where you live. In a Beltline or Eau Claire condo the work concentrates on window tracks, balcony door channels and the fine dust that a dry, windy city drives into every seal. In a newer home out in Mahogany, Cranston or Seton it is usually construction dust, which keeps resurfacing from vents, closet shelves and the tops of doors for a year or two after handover. Our team works from top to bottom, room by room: scrubbing baseboards and door frames, hand-wiping switches and outlet covers, degreasing stovetops and range hoods, and detailing tile and shower glass.",
      ]}
      sections={[
        {
          heading: "Deep house cleaning in Calgary: two worked prices",
          body: (
            <>
              <p>
                Every deep clean is two numbers added together, the standard rate for the home and the deep-clean
                package for its size. A two-bedroom condo in the Beltline: {DEEP2.standard} for the standard clean,{" "}
                {DEEP2.packagePrice} for the package, {DEEP2.price} in total. A four-bedroom in Cranston: {DEEP4.standard}{" "}
                plus {DEEP4.packagePrice}, {DEEP4.price}. Both are the apartment rate before GST; the Cranston house
                adds the two-storey charge shown under the table, because the quote asks what kind of home it is.
              </p>
              <p>
                The package is what buys the hours on trim, doors, switch plates, vents, fans and the kitchen
                degrease, so it rises with the bedroom count. The oven interior, the fridge interior and the insides of
                cabinets are not in it; each is a priced add-on, listed below with its starting figure. The standard
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
                A newer home in any of the four has the Seton and Mahogany problem: construction dust that keeps
                working its way out of vents and closet shelves for a year or two after handover, in a house nobody
                would call dirty.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What a deep clean adds"
      includedSubheading="The places a weekly visit never reaches, room by room."
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
        "Vents and ceiling fans dusted",
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
        "Wall washing, which is its own service rather than part of the package",
        "Furniture and anything else over 25 lbs stays where it is",
        "Exterior windows and any outdoor work",
        "Mould remediation, bodily fluids and pest removal",
        "Anything higher than a 3-step ladder reaches",
        "Light bulbs, chandeliers and fragile fixtures",
        "Garages, patios and balconies (a balcony sweep is an add-on)",
      ]}
      faqs={[
        { q: "Is there a best time of year for a deep clean in Calgary?", a: "Early spring is the most popular, because it clears out a full winter of road sand and de-icer at once. Calgary thaws and refreezes on chinooks all season, so entryways and baseboards collect grit continuously rather than staying frozen over. Late autumn is the other good window, resetting the house before that cycle starts. Both book up quickly, so give us a week or two of notice if you can." },
        { q: "Can I have only part of the house deep cleaned?", a: "Yes. Tell us which rooms when you book: the bathrooms only, the kitchen only, the main floor, or the basement. The rest of the house can have the standard clean on the same visit." },
        { q: "How should I get the house ready?", a: "You do not need to clean before the team comes; clear counters and floors get cleaned and cluttered ones get worked around; decluttering and organising are a separate hourly add-on. It costs you more on a deep clean than on a standard one, because the package is surfaces, baseboards and trim: nobody can wipe a baseboard behind a row of boxes or degrease a stovetop under a drying rack. If a room should be skipped, say so on the booking." },
        { q: "Is deep cleaning more expensive than standard cleaning?", a: `Yes, by the price of the deep-clean package. For a one-bedroom that is ${DEEP.packagePrice}: ${DEEP.price} for the deep clean against ${DEEP.standard} for a standard clean. The package rises with each bedroom, to ${DEEP5.packagePrice} on a five-bedroom home, where a deep clean is ${DEEP5.price} against ${DEEP5.standard}. Those are apartment or condo rates before GST.` },
        { q: "Will the team deal with mould in the shower?", a: "Light surface mildew on grout or caulking gets wiped where it is safe to. Anything heavier is mould remediation, which is a different trade, and we will tell you so rather than scrub at it." },
        { q: "How long will a Calgary deep clean take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "What does a deep clean do that a standard clean does not?", a: "The standard clean keeps a kept-up home kept up: floors, bathrooms, kitchen surfaces, dusting. The deep-clean package goes to what those visits pass over, the baseboards and door frames, the switch plates and outlet covers, the vents and fans, the tile and shower glass, and the range hood and stovetop grease. It is the reset; the standard visits are the maintenance." },
        { q: "Are the products safe around children and pets?", a: `We bring standard professional products. If anyone in the house has a sensitivity, or there is a product you would rather we did not use, say so when you book. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.` },
        { q: "How often does a Calgary home need a deep clean?", a: "Twice a year suits most homes: once after the last chinook melt, once before the furnace goes on. Between them, a standard clean on a schedule keeps the build-up from returning, and a home with a dog or a garage entry may want the second deep clean sooner." },
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
      ctaDescription={`Priced flat by home size, starting at ${TIERS[0].price} for a one-bedroom. Anything missed is re-cleaned at no charge if you tell us within ${POLICY.guaranteeWindowHours} hours.`}
      galleryImages={[
        { src: heroImage, alt: "Calgary kitchen after a deep clean" },
      ]}
    />
  );
}
