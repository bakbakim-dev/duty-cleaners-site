import { Link } from "react-router-dom";
import { POLICY } from "@/data/policy";
import { formatPrice } from "@/data/pricing";
import { addOnFromPrice } from "@/data/pricing";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { deepCleanTierRows, featuredExtraRows } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { CITY_PROOF, CALGARY_RATING_CLAIM } from "@/data/proof";
import { Accent } from "@/components/Accent";
import { Sparkles, Bath, UtensilsCrossed, Layers, Check } from "lucide-react";
import heroImage from "@/assets/gallery/calgary-kitchen-clean.webp";
import heroImageCard from "@/assets/gallery/calgary-kitchen-clean.webp?card";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
/** Cheapest published price for an add-on, straight from bk-config. */
const addOnLabel = (key: string) => formatPrice(addOnFromPrice("standard", key) ?? 0);

const ROWS = deepCleanTierRows();
const TIERS = ROWS.map((row) => ({ size: row.beds, price: row.price, assumption: row.assumption }));
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
      heroHeading={<>Deep Cleaning Services in <em className="italic text-accent-on-dark">Calgary</em></>}
      heroSubheading={`A standard clean plus the baseboards, door frames, switch plates and vent covers it passes over, from ${TIERS[0].price} before GST for a one-bedroom apartment, charged after the clean.`}
      heroBadges={["Baseboards & Door Frames by Hand", "All Supplies Brought For You", `${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee`]}
      heroImage={heroImage}
      heroImageAlt="Long kitchen with granite counters, a gas cooktop under a range hood and two stainless-steel fridges"
      heroImageWidth={800}
      heroImageHeight={800}
      overviewHeading={<>When to choose <Accent>a deep clean.</Accent></>}
      overviewParagraphs={[
        <>
          A deep clean is the full <Link to="/calgary/regular-cleaning/">Calgary standard clean</Link> with the
          deep-clean package on top, priced flat by home size and starting at {TIERS[0].price} before GST for a one-bedroom.
        </>,
        "The deep-clean package adds baseboards, doors, switches, outlet and vent covers, cobwebs and detailed kitchen tasks. Tell us about fragile finishes or marks that may need assessment; cleaning does not repair worn surfaces.",
        "For a Beltline or Eau Claire condo, include building access and parking instructions. In any Calgary neighbourhood, dust left by building or renovation work needs a post-construction scope, not a deep clean selected solely because the home is new.",
      ]}
      // The price section stays above the checklist. The out-of-town section
      // reads after the FAQ, with the other closing prose, so the page reaches
      // the checklist and the price grid sooner.
      sections={[
        {
          heading: "Deep house cleaning in Calgary: two worked prices",
          body: (
            <>
              <p>
                Every deep clean is two numbers added together, the standard rate for the home and the deep-clean
                package for its size. A two-bedroom condo in the Beltline with {DEEP2.assumption.replace("Assumes ", "").toLowerCase()} pays {DEEP2.standard} for the standard clean
                and {DEEP2.packagePrice} for the package, {DEEP2.price} in total. A four-bedroom in Mahogany with {DEEP4.assumption.replace("Assumes ", "").toLowerCase()} pays{" "}
                {DEEP4.standard} plus {DEEP4.packagePrice}, or {DEEP4.price}. Both are the apartment rate before GST.
                As a two-storey house, the Mahogany home adds the {TWO_STOREY} home-type charge, for {MAHOGANY_TOTAL}{" "}
                before GST, and a home with a dog or a cat adds the {addOnLabel("must-choose-if-you-have-pets")} pet
                charge on each visit.
              </p>
              <p>
                The package is what buys the hours on trim, doors, switch plates, vents and the kitchen
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
      ]}
      includedHeading="What a deep clean adds"
      includedSubheading="The places a standard visit passes over, room by room."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen", description: "The stovetop and range hood degreased, appliance exteriors, cabinet fronts and the backsplash wiped, and every prep surface wiped down." },
        { icon: Bath, title: "Bathrooms", description: "Tile, grout and shower glass worked over, soap scum and mineral scale lifted off tubs and fixtures, toilets done inside and out, vanities and mirrors polished." },
        { icon: Layers, title: "Baseboards and door frames", description: "Baseboards, door frames, light switches, outlet covers, vents and the corners that hold dust, all wiped by hand." },
        { icon: Sparkles, title: "Dusting, high and low", description: "Vents and the high and low surfaces a 3-step ladder reaches, dusted through the whole home. Ceiling fans on request, where they can be reached safely." },
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
      pricingBySize={TIERS}
      fromPrice={TIERS[0].price}
      extras={featuredExtraRows()}
      // The list was all safety exclusions: 25 lb, ladders, mould. The four
      // named in the lead are scope, and they are what customers actually
      // assume a deep clean covers: the commonest disputes in this trade, on
      // the page where someone is about to spend several hundred dollars. So
      // the exclusion is stated outright, once, and the prices stay in the
      // add-on list beside it, which reads them from bk-config.
      notIncludedLead="A deep clean does not go inside the oven, the fridge, the cabinets and drawers, or do the interior windows. Those four are priced add-ons, and the Add-ons list has each price."
      notIncludedGroups={[
        {
          label: "Separate work",
          items: [
            "Wall washing, a separate add-on booked with the clean rather than part of the package",
            "Exterior windows and any outdoor work",
            "Garages, patios and balconies, apart from the balcony or garage sweep add-on, available mostly in summer when the weather allows",
          ],
        },
        {
          label: "What the team leaves alone",
          items: [
            "Furniture and anything else over 25 lbs stays where it is",
            "Mould remediation, bodily fluids and pest removal",
            "Anything higher than a 3-step ladder reaches",
            "Light bulbs, chandeliers and fragile fixtures",
          ],
        },
      ]}
      faqs={[
        { q: "Is there a best time of year for a deep clean in Calgary?", a: "Book when the home's condition and your plans call for the extra checklist, whether after a period of limited upkeep or before guests arrive. There is no required season. Online bookings need at least 24 hours' notice; call for closer availability, which is not guaranteed." },
        { q: "Can I book a deep clean for only part of the house?", a: `The deep clean is priced flat for the whole home by its size, from ${TIERS[0].price} for a one-bedroom before GST, so the quote covers every room. If one room needs more attention than the rest, note it on the booking so the team knows before it arrives. For a job that is only one or two rooms, call the Calgary office at (403) 768-1341 and describe it before you book.` },
        { q: "How should I get the house ready?", a: "You do not need to clean before the team comes; clear counters and floors get cleaned and cluttered ones get worked around; decluttering and organising are a separate hourly add-on. Clutter matters more on a deep clean than on a standard one, because the package is surfaces, baseboards and trim: nobody can wipe a baseboard behind a row of boxes or degrease a stovetop under a drying rack. If a room should be skipped, say so on the booking." },
        { q: "Is deep cleaning more expensive than standard cleaning?", a: `Yes, by the price of the deep-clean package. For a one-bedroom that is ${DEEP.packagePrice}: ${DEEP.price} for the deep clean against ${DEEP.standard} for a standard clean. The package rises with each bedroom, to ${DEEP5.packagePrice} on a five-bedroom home, where a deep clean is ${DEEP5.price} against ${DEEP5.standard}. Those are apartment or condo rates before GST; a townhouse or two-storey house, a home with pets and an address outside Calgary city limits each add a charge on the quote.` },
        { q: "Will the team deal with mould in the shower?", a: "Light surface mildew on grout or caulking gets wiped where it is safe to. Anything heavier is mould remediation, which is a different trade, and we will tell you so rather than scrub at it." },
        { q: "How long will a Calgary deep clean take?", a: `In a two-bedroom, one-bathroom apartment, ${POLICY.typicalVisitLength?.deep}. Larger homes and heavier build-up take longer, and the team does not leave until the whole scope is done. The price is flat by home size, so a longer visit costs the same.` },
        { q: "What does a deep clean do that a standard clean does not?", a: "The standard clean keeps a kept-up home kept up: floors, bathrooms, kitchen surfaces, dusting. The deep-clean package goes to what those visits pass over, the baseboards and door frames, the switch plates and outlet covers, the vents, the tile and shower glass, and the range hood and stovetop grease." },
        { q: "Are the products safe around children and pets?", a: `We bring standard professional products. If anyone in the house has a sensitivity, or there is a product you would rather we did not use, say so when you book. Optional alternative products are available for ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}. A home with pets carries a ${addOnLabel("must-choose-if-you-have-pets")} charge on each visit, and it shows on the quote before you book.` },
        { q: "How often does a Calgary home need a deep clean?", a: "There is no fixed interval for every home. Check the condition of baseboards, doors and other deep-package items, along with the upkeep you do between visits. Recurring standard cleaning can help with routine tasks but does not include every deep-clean item." },
      ]}
      closingSections={[
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
                Outside the city, the pet charge and the home-type charge for a townhouse or two-storey house apply
                just as they do inside it, and each one is a separate line on the quote before you confirm.
              </p>
            </>
          ),
        },
        {
          heading: "After the deep clean",
          body: (
            <>
              <p>
                For ongoing help after a deep clean, you can book the standard
                checklist on a schedule, and{" "}
                <Link to="/calgary/recurring-cleaning/">recurring cleaning in Calgary</Link> takes 20% off weekly, 15%
                off bi-weekly and 10% off every 4 weeks from the second visit. Scuffed or greasy walls are a separate
                job: <Link to="/wall-washing-wall-cleaning-calgary/">wall washing in Calgary</Link>.
              </p>
              <p>
                Our Calgary team is rated {CALGARY_RATING_CLAIM}{REVIEWS ? ` over ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link>. The rest of what we do here, each with its starting
                price, is on <Link to="/calgary/services/">every Calgary cleaning service, with starting prices</Link>.
              </p>
            </>
          ),
        },
      ]}
      ctaHeading={<>Deep cleaning in <em className="italic text-accent-on-dark">Calgary</em> from {TIERS[0].price}.</>}
      ctaDescription={`The deep clean is priced flat by home size, from ${TIERS[0].price} before GST for a one-bedroom apartment, and a pet charge, a home-type charge or a travel fee outside Calgary city limits can apply. Anything missed is re-cleaned at no charge if you tell us within ${POLICY.guaranteeWindowHours} hours.`}
      galleryImages={[
        { picture: heroImageCard, alt: "Kitchen with granite counters and a range hood over a gas cooktop, with a dining table by the window" },
      ]}
      galleryRepeatsHero
    />
  );
}
