import { Link } from "react-router-dom";
import { POLICY } from "@/data/policy";
import { formatPrice } from "@/data/pricing";
import { addOnFromPrice } from "@/data/pricing";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import {
  deepCleanTierRows, featuredExtraRows, calculateQuote, homeTypeOptions, PRICING_TIERS, DEEP_CLEAN_ADDON_ID, GST_RATE,
} from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { Accent, AccentGold } from "@/components/Accent";
import { Sparkles, Bath, UtensilsCrossed, Layers } from "lucide-react";
import heroImage from "@/assets/gallery/kitchen-deep-clean.webp";
import heroImageCard from "@/assets/gallery/kitchen-deep-clean.webp?card";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
/** Cheapest published price for an add-on, straight from bk-config. */
const addOnLabel = (key: string) => formatPrice(addOnFromPrice("standard", key) ?? 0);

const ROWS = deepCleanTierRows();
const TIERS = ROWS.map((row) => ({ size: row.beds, price: row.price }));
/** The one-bedroom row, with its standard and package halves, for the price FAQ. */
const DEEP = ROWS[0];
/** The three-bedroom row, for the worked example. */
const DEEP3 = ROWS[2];
/** The largest row, so the price FAQ can give the top of the range itself. */
const DEEP5 = ROWS[ROWS.length - 1];
/** Travel fee for an address outside Edmonton city limits, from bk-config. */
const TRAVEL = formatPrice(travelFee("standard") ?? 0);
const REVIEWS = CITY_PROOF.edmonton.googleReviewCount;
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
/**
 * The worked example, to the cent: a three-bedroom deep clean quoted through
 * calculateQuote, the booking form's own maths, once as an apartment and once
 * as a two-storey house with a pet.
 */
const TWO_STOREY = homeTypeOptions("standard").find((o) => /storey house/i.test(o.label)) ?? null;
const deepQuote = (homeType: number | null, addOns: string[]) => {
  const tier = PRICING_TIERS[2];
  if (!tier) return null;
  return calculateQuote({
    service: "standard",
    homeType,
    bedrooms: tier.beds,
    bathrooms: tier.bathrooms,
    halfBaths: tier.halfBaths,
    addOns: [DEEP_CLEAN_ADDON_ID, ...addOns],
    frequency: "one-time",
  }).firstClean;
};
const withGst = (value: number) => formatPrice(Math.round(value * (1 + GST_RATE) * 100) / 100);
const APT3 = deepQuote(homeTypeOptions("standard")[0]?.id ?? null, []);
const HOUSE3 = TWO_STOREY && PET_FEE !== null ? deepQuote(TWO_STOREY.id, ["must-choose-if-you-have-pets"]) : null;

export default function EdmontonDeepCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      crossCity={{ city: "Calgary", to: "/calgary/deep-cleaning/", description: "The same deep clean, delivered by our Calgary team.", linkText: "Deep cleaning in Calgary" }}
      quoteService="deep-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle={`Deep Cleaning Services Edmonton from ${TIERS[0].price} | Duty Cleaners`}
      seoDescription={`An Edmonton deep clean adds baseboards, switches, vents and stovetop detail to the standard checklist, from ${TIERS[0].price} before GST for a one-bedroom.`}
      serviceName="Deep House Cleaning in Edmonton"
      canonical="https://dutycleaners.ca/edmonton/deep-cleaning"
      heroHeading={<>Deep Cleaning Services in <AccentGold>Edmonton</AccentGold></>}
      heroSubheading={`A deep clean is everything in a standard clean plus the build-up a standard clean does not reach: baseboards, door frames, switches and outlet covers, vent covers, tile and shower glass, and the stovetop, grates and fridge top detailed. It is priced flat by home size, from ${TIERS[0].price} for a one-bedroom apartment or condo before GST, with any home-type, pet or travel charge shown on the quote.`}
      heroBadges={["Standard Checklist Plus the Deep Package", "All Supplies Brought For You", `${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee`]}
      heroImage={heroImage}
      heroImageAlt="Kitchen after a deep clean"
      heroImageWidth={1024}
      heroImageHeight={1024}
      overviewEyebrow="Service Overview"
      overviewHeading={<>The reset regular cleaning <Accent>can't reach.</Accent></>}
      overviewParagraphs={[
        <>
          A deep clean is the <Link to="/edmonton/regular-cleaning/">standard cleaning checklist</Link> plus the
          deep-clean package, and both halves are priced flat by home size.
        </>,
        "Edmonton earns its deep cleans the hard way. The city holds its cold rather than thawing and refreezing, so the sand and salt tracked in from November arrive dry and stay, and by spring they have worked into carpet edges and along the baseboards where a vacuum no longer lifts them. The spring melt, in late March and April, brings a whole winter of grit indoors in about three weeks. Meanwhile the furnace has been running since October, and a house sealed up that long cycles dust faster, onto vent covers, baseboards and the tops of door frames.",
        "What the work looks like depends on the home. In an older house, painted trim and panelled doors hold dust along every edge of the profile, and most of the job is hand-wiping. In the bathrooms, hard Alberta water leaves mineral scale on the taps and the shower glass; scale does not scrub off, and it comes away with a mild acid given a few minutes to work. In an apartment or condo there is less trim, so more of the job is the kitchen and the bathrooms. Our team works top to bottom, room by room: scrubbing baseboards and door frames, hand-wiping switches and outlet covers, detailing the stovetop, grates and fridge top, and detail-cleaning bathrooms.",
      ]}
      sections={[
        {
          heading: "Deep house cleaning in Edmonton, priced by home size",
          body: (
            <>
              <p>
                The price is the standard rate for the home plus the deep-clean package for that size, and both halves
                come from the same price list. A one-bedroom is {DEEP.price}: {DEEP.standard} for the standard clean
                and {DEEP.packagePrice} for the package. A three-bedroom is {DEEP3.price}: {DEEP3.standard} plus{" "}
                {DEEP3.packagePrice}. The package grows with the bedroom count because the trim, the doors and the
                switch plates do.
              </p>
              <p>
                Those figures are for an apartment or condo before GST. A bungalow or basement suite, a townhouse or a
                two-storey house adds a home-type charge, a home with pets adds the compulsory
                {PET_FEE !== null ? ` ${formatPrice(PET_FEE)}` : ""} pet charge, and an address outside Edmonton city
                limits adds the {TRAVEL} travel fee. The inside of the oven, the fridge and the cabinets are priced per
                item. The standard rates on their own, for every home size, are on{" "}
                <Link to="/pricing/">the full Edmonton price list</Link>.
              </p>
              {APT3 !== null && (
                <p>
                  Worked to the cent, a three-bedroom apartment or condo comes to {formatPrice(APT3)} before GST, which
                  the price list rounds to {DEEP3.price}, and {withGst(APT3)} once 5% GST is added.
                  {HOUSE3 !== null && TWO_STOREY && PET_FEE !== null
                    ? ` The same deep clean in a two-storey house with a dog adds the ${formatPrice(TWO_STOREY.price)} house-type charge and the ${formatPrice(PET_FEE)} pet charge, for ${formatPrice(HOUSE3)} before GST and ${withGst(HOUSE3)} with it.`
                    : ""}
                </p>
              )}
            </>
          ),
        },
        {
          heading: "Deep cleaning outside Edmonton: Fort Saskatchewan, Stony Plain and Morinville",
          body: (
            <>
              <p>
                Inside Edmonton city limits there is no travel fee. Fort Saskatchewan, Stony Plain and Morinville are
                outside them, and a deep clean there carries a travel fee of {TRAVEL}, shown on the quote before you
                book. Each town has its own page:{" "}
                <Link to="/cleaning-services-fort-saskatchewan/">house cleaning in Fort Saskatchewan</Link>,{" "}
                <Link to="/cleaning-services-stony-plain/">Stony Plain house cleaners</Link> and{" "}
                <Link to="/cleaning-services-morinville/">cleaning services in Morinville</Link>.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What a deep clean adds"
      includedSubheading="The places a weekly visit never reaches, room by room."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Detail Clean", description: "The team details the stovetop, grates and fridge top, wipes appliance exteriors, cabinet fronts and the backsplash, and wipes down all prep surfaces." },
        { icon: Bath, title: "Bathroom Deep Scrub", description: "Tile, grout and shower glass detailed, soap scum and mineral build-up removed from tubs and fixtures, toilets scrubbed inside and out, vanities and mirrors polished." },
        { icon: Layers, title: "Edges & Details", description: "Hand-wiping baseboards, door frames, light switches, outlet covers, vents, and corners that collect dust." },
        { icon: Sparkles, title: "Full Dust Reset", description: "Detailed dusting of vents and the high and low areas a 3-step ladder reaches, throughout the home. Ceiling fans on request, where they can be reached safely." },
      ]}
      bullets={[
        "All standard cleaning tasks included",
        "Baseboards hand-wiped throughout",
        "Doors, door frames, and trim wiped",
        "Light switches and outlet covers cleaned",
        "Stovetop, grates and fridge top detailed",
        "Exterior of all kitchen appliances cleaned",
        "Cabinet fronts and handles wiped",
        "Tile and shower glass detailed",
        "Vent covers wiped",
        "Detailed cobweb and corner cleaning",
        "Floors thoroughly mopped and vacuumed",
      ]}
      roomTasks={[
        { name: "Kitchen Detail", tasks: 6, sample: "detailing the stovetop, grates and fridge top" },
        { name: "Bathroom Scrub", tasks: 5, sample: "detailing tile and shower glass" },
        { name: "Edges & Details", tasks: 5, sample: "hand-wiping baseboards and door frames" },
        { name: "Bedrooms & Living", tasks: 4, sample: "dusting high and low areas" },
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
        `Inside the oven — add it for ${addOnLabel("inside-oven")}`,
        `Inside the fridge — add it for ${addOnLabel("inside-fridge")}`,
        `Inside cabinets and drawers — add it from ${addOnLabel("inside-cabinets-kitchen-bathroom-only")}`,
        `Interior windows — add them from ${addOnLabel("inside-windows")}`,
        "Wall washing — a separate service, not part of the deep package",
        "Moving heavy items over 25 lbs",
        "Outdoor or exterior window cleaning",
        "Mould remediation, bodily fluids, or pest removal",
        "Areas beyond the reach of a 3-step ladder",
        "Light bulbs and fragile fixtures",
        "Garages, patios and outdoor areas, apart from the balcony or garage sweep add-on, available mostly in summer when the weather allows",
        "Laundry and dishes",
      ]}
      faqs={[
        { q: "Can I book deep cleaning for only certain areas?", a: "A deep clean is priced by home size, as the standard checklist plus the deep-clean package for the whole home. Tell us which rooms matter most when you book, such as the bathrooms, the kitchen or a basement that has been shut up since October." },
        { q: "Should I declutter before deep cleaning?", a: "No. You do not need to clean before the team comes; clear counters and floors get cleaned and cluttered ones get worked around; decluttering and organising are a separate hourly add-on. On a deep clean the trade-off is easy to see, because the package is trim, edges and surfaces: a baseboard behind a stack of storage bins is a baseboard nobody can reach." },
        { q: "Is deep cleaning more expensive than standard cleaning?", a: `Yes. A one-bedroom deep clean is ${DEEP.price} against ${DEEP.standard} for a standard clean, and the ${DEEP.packagePrice} difference is the deep-clean package: baseboards, trim, switches, vents and the kitchen degrease. The package grows with the home, so a five-bedroom deep clean is ${DEEP5.price} against ${DEEP5.standard} for a standard clean. Those figures are for an apartment or condo, before GST. A bungalow, townhouse or two-storey house adds a home-type charge, a home with pets adds the compulsory pet charge${PET_FEE !== null ? ` of ${formatPrice(PET_FEE)}` : ""}, and an address outside Edmonton city limits adds the ${TRAVEL} travel fee, all shown on the quote.` },
        { q: "Does a deep clean remove mould or mildew?", a: "No. Mould remediation is a different trade, and it is not what a deep clean buys. Light mildew on shower grout or caulking is wiped when it is safe to. Past that we stop, tell you where it is and what it looks like, and leave it to somebody equipped for it." },
        { q: "When should I book a deep cleaning?", a: "In Edmonton, book for the spring melt, when a whole winter of sanding grit comes off boots and paws in about three weeks; a booking in late March or April clears it before it is ground into the floors. Fall, just before furnace season closes the windows until April, is the other good time. Outside those two, book one before guests arrive, after a long stretch without a clean, or as the first visit before a recurring schedule starts." },
        { q: "How long does a deep cleaning take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "How is deep cleaning different from regular cleaning?", a: "A standard clean is the surfaces you use: floors, bathrooms, kitchen counters, and dusting whatever is in reach. The deep clean adds the package on top, which is the trim and door frames, the switch plates, the outlet covers, the vent covers, the shower glass, and the stovetop, grates and fridge top. In a house that has been sealed since October, that is where the furnace dust and the boot grit have gone." },
        { q: "Do I need to prepare anything?", a: "Two things help, and neither of them is cleaning. Tell us how the team gets in, whether that is a lockbox, a smart-lock code, a garage code or a key with a concierge. Then tell us which rooms matter most and which to leave alone, because a deep clean spends its hours on trim and edges and there is no sense spending them in a room you would rather we skipped." },
        { q: "Are your products safe for kids and pets?", a: `We bring our own standard professional products. Tell us about any sensitivities, or anything you would rather we did not use, when you book. Optional alternative products are ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.` },
        { q: "How often should I get a deep cleaning?", a: "There is no fixed interval, and a number of months is the wrong way to decide it. What sets it is how long the edges have been left: if the trim, the vents and the tops of the door frames have not been touched since the last one, it is due. A home where the furnace runs all winter and everybody comes in through the same door reaches that point sooner. Standard visits on a schedule in between are what keep the gap long." },
        { q: "What happens if something is missed?", a: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to re-clean it at no charge. Photos help but are not required. The commitment is the return visit rather than a refund, though you can call the Edmonton office on (780) 913-6565 to talk through anything else.` },
      ]}
      closingSections={[
        {
          heading: "After the deep clean",
          body: (
            <>
              <p>
                The usual next step is the standard checklist on a schedule, so the build-up does not come back:{" "}
                <Link to="/edmonton/recurring-cleaning/">recurring cleaning in Edmonton</Link> is 20% off
                weekly, 15% off bi-weekly and 10% off every 4 weeks from the second visit. A one-off{" "}
                <Link to="/edmonton/regular-cleaning/">standard clean in Edmonton</Link> works too. Walls are their own
                service: <Link to="/wall-washing-wall-cleaning/">wall washing in Edmonton</Link>.
              </p>
              <p>
                Our Edmonton team is rated {RATING_CLAIM}{REVIEWS ? ` across ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link>. Everything we do in the city, with a starting price
                beside each, is on <Link to="/services/">all Edmonton cleaning services and prices</Link>.
              </p>
            </>
          ),
        },
      ]}
      ctaHeading={<>Deep cleaning in <AccentGold>Edmonton</AccentGold> from {TIERS[0].price}.</>}
      ctaDescription={`A deep clean is the standard checklist plus the deep-clean package, priced flat by home size before GST: ${TIERS[0].price} is a one-bedroom apartment or condo, and any home-type, pet or travel charge shows on the quote. Nothing is charged until the clean is complete.`}
      galleryImages={[
        { picture: heroImageCard, alt: "Kitchen after a deep clean" },
      ]}
    />
  );
}
