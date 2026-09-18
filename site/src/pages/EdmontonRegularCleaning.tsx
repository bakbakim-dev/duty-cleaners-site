import { Link } from "react-router-dom";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import {
  standardTierRows, deepCleanTierRows, featuredExtraRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions,
  PRICING_TIERS, FREQUENCIES, GST_RATE,
} from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY } from "@/data/policy";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { Accent } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
// The recurring page keeps the family photo; this page had the same hero.
import heroImage from "@/assets/gallery/glenora-cleaner-living-room.webp";
import kitchenImage from "@/assets/gallery/lakeview-clean-kitchen.webp?card";
import livingRoomImage from "@/assets/gallery/edmonton-standard-bathroom-shelves.webp?card";
import cleanerImage from "@/assets/gallery/westmount-cleaner-kitchen.webp?card";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));
const FROM = TIERS[0].price;
const TWO_BED = TIERS[1].price;
const THREE_BED = TIERS[2].price;
/** Travel fee for an address outside Edmonton city limits, from bk-config. */
const TRAVEL = formatPrice(travelFee("standard") ?? 0);
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const pct = (discount: number) => `${Math.round(discount * 100)}%`;
const WEEKLY = FREQUENCIES.find((f) => f.discount === 0.2);
const BIWEEKLY = FREQUENCIES.find((f) => f.discount === 0.15);
const FOUR_WEEKS = FREQUENCIES.find((f) => f.discount === 0.1);
const REVIEWS = CITY_PROOF.edmonton.googleReviewCount;
/** Where the deep clean starts, for the standard-or-deep question. */
const DEEP_FROM = deepCleanTierRows()[0]?.price ?? "";
const tierPct = (f?: { discount: number }) => (f ? pct(f.discount) : "");
/**
 * The worked example: one visit to a three-bedroom two-storey house with a
 * pet. Quoted through calculateQuote, the booking form's own maths, so the
 * figure is exact rather than the price table's rounded label.
 */
const TWO_STOREY = homeTypeOptions("standard").find((o) => /storey house/i.test(o.label)) ?? null;
const WORKED = (() => {
  const tier = PRICING_TIERS[2];
  if (!tier || !TWO_STOREY || PET_FEE === null) return null;
  const total = calculateQuote({
    service: "standard",
    homeType: TWO_STOREY.id,
    bedrooms: tier.beds,
    bathrooms: tier.bathrooms,
    halfBaths: tier.halfBaths,
    addOns: ["must-choose-if-you-have-pets"],
    frequency: "one-time",
  }).firstClean;
  return {
    /** The exact three-bedroom rate the total is built on; the table shows it rounded. */
    rate: formatPrice(Math.round((total - TWO_STOREY.price - PET_FEE) * 100) / 100),
    house: formatPrice(TWO_STOREY.price),
    pet: formatPrice(PET_FEE),
    beforeGst: formatPrice(total),
    withGst: formatPrice(Math.round(total * (1 + GST_RATE) * 100) / 100),
  };
})();

export default function EdmontonRegularCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      crossCity={{ city: "Calgary", to: "/calgary/regular-cleaning/", description: "The same standard clean, priced the same way, from our Calgary team.", linkText: "Standard cleaning in Calgary" }}
      quoteService="regular-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle="One-Time Standard & Maid Cleaning Edmonton | Duty Cleaners"
      seoDescription="Book a one-time standard clean in Edmonton. Review the room checklist, exclusions and pricing for your home before choosing your visit."
      serviceName="Standard House Cleaning in Edmonton"
      canonical="https://dutycleaners.ca/edmonton/regular-cleaning"
      heroHeading={<>One-Time Standard Cleaning in <em className="italic text-accent-on-dark">Edmonton</em></>}
      heroSubheading={`One visit covering the kitchen, bathrooms, bedrooms and living areas, from ${FROM} before GST for a one-bedroom apartment or condo. You pay once the clean is complete.`}
      heroBadges={["Reference-Checked Cleaners", "All Supplies Brought For You", `${POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee`]}
      heroImage={heroImage}
      heroImageAlt="Cleaner in a blue uniform vacuuming the hardwood floor of a sunlit living room"
      heroImageWidth={896}
      heroImageHeight={672}
      overviewHeading={<>A standard clean, <Accent>priced flat by home size</Accent></>}
      overviewParagraphs={[
        <>
          Each visit runs through the kitchen, bathrooms, bedrooms and living areas from a written checklist: dusting,
          vacuuming, mopping, and high-touch surfaces wiped down. It is priced flat by home size, and{" "}
          <Link to="/pricing/">the full Edmonton price list</Link> has every size. To keep a home at that level, the same
          checklist on a weekly, bi-weekly or every-4-weeks schedule is{" "}
          <Link to="/edmonton/recurring-cleaning/">recurring cleaning in Edmonton</Link>, discounted from the second
          visit.
        </>,
        <>
          The microwave is cleaned inside and out. The inside of the oven and fridge are add-ons, and baseboards, vents,
          switches and other build-up belong to a <Link to="/edmonton/deep-cleaning/">deep clean in Edmonton</Link>.
          The team brings its own supplies and equipment, so there is nothing to buy or set out before the visit.
        </>,
      ]}
      // Only the scope-and-price section sits above the checklist. The condo
      // and coverage sections read after the FAQ, with the closing prose: all
      // of the copy is kept, and the page reaches the checklist and the price
      // grid without 800 words of prose in the way.
      sections={[
        {
          heading: "Booking a one-time maid visit: scope and price",
          body: (
            <>
              <p>
                For maid service or help with housekeeping, our standard clean covers the kitchen,
                bathrooms, bedrooms and living areas from a checklist, once or on a recurring schedule.
                It is not live-in help and does not include laundry or dishes. The price is flat by home size, {FROM} for a
                one-bedroom and {THREE_BED} for a three-bedroom apartment or condo before GST, and it does not move if the
                visit runs long.
              </p>
              <p>
                Bedrooms and bathrooms set the base rate, a bungalow,
                townhouse or two-storey house adds a home-type charge on top of the apartment price, and add-ons such as
                the inside of the oven are priced per item.
              </p>
              {WORKED && (
                <>
                  <p>
                    Take one visit to a three-bedroom two-storey house with a dog, inside the city limits. The price
                    table rounds the three-bedroom rate to {THREE_BED}, and the quote works from the exact figure:
                  </p>
                  {/* The worked example as a receipt. Every figure is computed above from calculateQuote. */}
                  <dl className="max-w-md rounded-xl border border-border bg-white text-base text-foreground">
                    <div className="flex items-baseline justify-between gap-6 px-5 py-3 border-b border-border/60">
                      <dt>Three-bedroom rate</dt>
                      <dd className="font-semibold tabular-nums">{WORKED.rate}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-6 px-5 py-3 border-b border-border/60">
                      <dt>Two-storey house-type charge</dt>
                      <dd className="font-semibold tabular-nums">{WORKED.house}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-6 px-5 py-3 border-b border-border/60">
                      <dt>Pet charge</dt>
                      <dd className="font-semibold tabular-nums">{WORKED.pet}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-6 px-5 py-3 border-b border-border/60 font-bold">
                      <dt>Total before GST</dt>
                      <dd className="tabular-nums">{WORKED.beforeGst}</dd>
                    </div>
                    <div className="flex items-baseline justify-between gap-6 px-5 py-3 text-muted-foreground">
                      <dt>With {Math.round(GST_RATE * 100)}% GST added</dt>
                      <dd className="font-semibold tabular-nums">{WORKED.withGst}</dd>
                    </div>
                  </dl>
                </>
              )}
              <p>A standard clean needs no contract or standing booking; for ongoing visits, compare <Link to="/edmonton/recurring-cleaning/">Edmonton recurring cleaning plans</Link>.</p>
            </>
          ),
        },
      ]}
      closingSections={[
        {
          heading: "What a standard visit covers in an apartment or condo",
          body: (
            <>
              <p>
                An apartment or a condo pays the table rate with no home-type charge on top, so a two-bedroom is{" "}
                {TWO_BED} before GST, with the pet charge added if the suite has pets. The floor it sits on changes nothing: a third-floor walk-up and a suite high in a
                Downtown tower are both priced by bedrooms and bathrooms, and stairs and elevators are not lines on the
                quote.
              </p>
              <p>
                Access is where two buildings differ: a fob, a buzzer code, a lockbox or somebody at the door. Put the
                arrangement on the booking, with
                where the team should leave the car, whether that is a visitor stall in the parkade or the street. A
                team that cannot get past the lobby is a lockout, and a lockout is charged at {POLICY.lockoutFee}.
              </p>
              <p>
                The checklist is the same in a condo. An in-suite
                laundry room is cleaned like any other room, the floor, the surfaces and the outside of the machines,
                but the laundry itself is not on the checklist. The balcony is outdoor space and stays off it as well,
                apart from a sweep booked as an add-on.
              </p>
              <p>
                Furnace season in Edmonton runs from October into April, and a suite sealed up that long cycles dust
                faster than one with the windows open. In a condo it settles on the sills, the vent covers and the tops
                of the door frames. A standard clean dusts what is within reach; the vents and the frames
                themselves are deep-clean work.
              </p>
            </>
          ),
        },
        {
          heading: "Standard cleaning coverage and service limits in Edmonton",
          body: (
            <>
              <p>
                When you book, tell us about entryway grit or rooms that need extra attention. Restoring damaged
                floors is not part of a standard clean.
              </p>
              <p>
                Inside Edmonton city limits there is no travel fee. St. Albert, Sherwood Park and Spruce Grove sit outside
                the limits, so a visit there carries a travel fee of {TRAVEL}, listed on the quote before you book. Each
                has its own page: <Link to="/cleaning-services-st-albert/">St. Albert house cleaners</Link>,{" "}
                <Link to="/cleaning-services-sherwood-park/">house cleaning in Sherwood Park</Link> and{" "}
                <Link to="/cleaning-services-spruce-grove/">cleaning services in Spruce Grove</Link>.
              </p>
              <p>
                A standard clean is not the right booking for every job. An empty place at the end of a tenancy is{" "}
                <Link to="/move-out-cleaning-edmonton/">move-out cleaning in Edmonton</Link>, which has a table of its
                own. A home just out of a renovation is{" "}
                <Link to="/post-construction-cleaning/">post-construction cleaning</Link>, priced by square footage
                rather than bedrooms. Scuffed or greasy walls are{" "}
                <Link to="/wall-washing-wall-cleaning/">wall washing</Link>, a package added to a clean rather than part
                of the checklist. A suite turned over between guests is{" "}
                <Link to="/edmonton/airbnb-cleaning/">Airbnb cleaning in Edmonton</Link>, billed by the hour.
              </p>
              <p>
                Everything else we do in the city, with a starting price beside each one, is on{" "}
                <Link to="/services/">compare cleaning services in Edmonton</Link>.
              </p>
            </>
          ),
        },
        {
          heading: "Before you book a standard clean in Edmonton",
          body: (
            <>
              <p>
                Nothing is charged when you book. A temporary hold goes on the card the day before to confirm it is
                valid; it can look like a charge in a banking app, but no money moves until the clean is complete.
              </p>
              <p>
                Our Edmonton team is rated {RATING_CLAIM}{REVIEWS ? ` across ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link> before you decide, then compare every home size on{" "}
                <Link to="/pricing/">the Edmonton house cleaning price list</Link>.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What a standard clean covers"
      includedSubheading="Kitchen, bathrooms, bedrooms and living areas, in one visit."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen", description: "Wipe-down of countertops, sinks, stovetop, exterior appliances, and cabinet fronts. Floors mopped and vacuumed." },
        { icon: Bath, title: "Bathrooms", description: "Toilets, tubs and showers scrubbed, soap scum off the tile and glass, mirrors and vanities polished, floors washed." },
        { icon: Home, title: "Bedrooms and living areas", description: "Dusting accessible surfaces, vacuuming carpets and rugs, and mopping hard flooring throughout the home." },
      ]}
      bullets={[
        "Dusting of all accessible surfaces and furniture",
        "Vacuuming carpets and rugs",
        "Mopping all hard floors",
        "Kitchen counters, sink, and stovetop cleaned",
        "Exterior of appliances and cabinets wiped",
        // /whats-included/ lists the microwave interior in every service.
        // These checklists left it out.
        "Microwave cleaned inside and out",
        "Bathrooms scrubbed and wiped down",
        "Mirrors and glass surfaces polished",
        "Trash emptied",
      ]}
      pricingBySize={TIERS}
      fromPrice={FROM}
      extras={featuredExtraRows()}
      notIncluded={[
        "Moving heavy items over 25 lbs",
        "Outdoor or exterior window cleaning",
        "Mould remediation, bodily fluids, or pest removal",
        "Areas beyond the reach of a 3-step ladder",
        "Light bulbs and fragile fixtures",
        "Garages, patios and outdoor areas, apart from the balcony or garage sweep add-on, available mostly in summer when the weather allows",
        "Laundry and dishes",
        "Carpet steam cleaning and upholstery",
      ]}
      faqs={[
        { q: "Is this the same as a maid service?", a: "If you mean routine cleaning help, our standard checklist can be booked once or on a recurring schedule. It covers kitchens, bathrooms, bedrooms and living areas at a flat rate by home size. It is not live-in housekeeping and does not include laundry or dishes. Recurring discounts apply from the second visit." },
        { q: "What does a standard clean cost in Edmonton, all in?", a: `A standard clean is ${FROM} for a one-bedroom apartment or condo and ${THREE_BED} for a three-bedroom, before 5% GST. A bungalow or basement suite, a townhouse or a two-storey house adds a home-type charge to that figure${PET_FEE !== null ? `, and a home with pets adds ${formatPrice(PET_FEE)} per visit, which is compulsory` : ""}. Inside Edmonton city limits there is no travel fee; outside them it is ${TRAVEL}. The quote lists each of these before you book, and nothing is charged until the clean is complete.` },
        { q: "Does standard cleaning include cleaning the kitchen?", a: "Yes. The team wipes the counters and the cupboard fronts, cleans the sink and the stovetop, does the microwave inside and out, wipes the fridge, oven and dishwasher on the outside, then vacuums and mops the floor. The oven and fridge interiors are add-ons, and the grease on the range hood is deep-clean work." },
        { q: "What's the difference between standard and deep cleaning?", a: `A standard clean keeps up a home that is lived in and looked after: dusting, vacuuming, mopping, and the kitchen and bathrooms cleaned. A deep clean is the same checklist plus the deep-clean package, which adds baseboards, doors and door frames, light switches, outlet covers, vents, and the grease on the stovetop and range hood. It starts at ${DEEP_FROM} for a one-bedroom apartment or condo, before GST and before any home-type or pet charge, and it is the better first booking for a home that has gone a long while without a clean.` },
        { q: "How long does a standard cleaning take?", a: `A standard clean of a two-bedroom, one-bathroom apartment usually takes ${POLICY.typicalVisitLength?.standard}; a bigger home takes longer. The team works to a checklist, not a clock, and stays until every task in your service scope is complete. Your flat rate does not change based on how long it takes. The booking gives an arrival window rather than an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM, or 3:00 to 4:00 PM.` },
        { q: "How often should I schedule standard cleaning?", a: `A standard clean is a single visit, so book it when the home needs one. For the same clean on a schedule, recurring cleaning is ${tierPct(WEEKLY)} off weekly, ${tierPct(BIWEEKLY)} off bi-weekly and ${tierPct(FOUR_WEEKS)} off every 4 weeks, from the second visit on. The first visit on any schedule is charged at the one-time rate.` },
        // Was "or leave the keys under the mat", inside FAQPage schema. A cleaning
        // company recommending that is advising customers into something most
        // home-insurance policies exclude, next to a policy charging half the
        // visit when the team cannot get in.
        { q: "Do I need to be home during the cleaning?", a: `No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves. Put the arrangement on the booking, because a team that arrives and cannot get in is a lockout, charged at ${POLICY.lockoutFee}.` },
        { q: "Do I need to provide cleaning supplies?", a: `No. The team brings all the supplies and equipment it uses. The home needs running water, and without electricity the vacuuming may not be possible. Optional alternative products are available for ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.` },
        { q: "What should I do to prepare?", a: "You do not need to clean before the team comes; clear counters and floors get cleaned and cluttered ones get worked around; decluttering and organising are a separate hourly add-on. What does help is telling us on the booking which room to start in and which to leave alone. If somebody works nights and will be asleep at two in the afternoon, say which room, and the order the house gets done in changes at no cost." },
        { q: "What if I need to cancel or move the visit?", a: `Give ${POLICY.cancellationNoticeHours} hours' notice and moving or cancelling costs nothing. Inside ${POLICY.cancellationNoticeHours} hours the fee is ${POLICY.cancellationFee}. If we have to move a booking, because a cleaner is ill or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have, at no charge to you.` },
      ]}
      ctaHeading={<>Standard cleaning in <em className="italic text-accent-on-dark">Edmonton</em> from {FROM}.</>}
      ctaDescription="A standard clean is one visit, priced flat by home size before GST and paid once the clean is complete."
      galleryImages={[
        { picture: kitchenImage, alt: "Clean, tidy kitchen after a standard cleaning visit" },
        { picture: livingRoomImage, alt: "Freshly cleaned bathroom with tidy shelves and polished surfaces" },
        { picture: cleanerImage, alt: "Professional cleaner wiping kitchen surfaces" },
      ]}
    />
  );
}
