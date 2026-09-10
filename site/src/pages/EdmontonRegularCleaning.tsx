import { Link } from "react-router-dom";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { standardTierRows, featuredExtraRows, formatPrice, addOnFromPrice, FREQUENCIES } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY } from "@/data/policy";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { Accent, AccentGold } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/family-clean-home-edmonton.webp";
import kitchenImage from "@/assets/gallery/lakeview-clean-kitchen.webp";
import livingRoomImage from "@/assets/gallery/edmonton-standard-bathroom-shelves.webp";
import cleanerImage from "@/assets/gallery/westmount-cleaner-kitchen.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));
const FROM = TIERS[0].price;
const THREE_BED = TIERS[2].price;
/** Travel fee for an address outside Edmonton city limits, from bk-config. */
const TRAVEL = formatPrice(travelFee("standard") ?? 0);
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const pct = (discount: number) => `${Math.round(discount * 100)}%`;
const WEEKLY = FREQUENCIES.find((f) => f.discount === 0.2);
const BIWEEKLY = FREQUENCIES.find((f) => f.discount === 0.15);
const FOUR_WEEKS = FREQUENCIES.find((f) => f.discount === 0.1);
const REVIEWS = CITY_PROOF.edmonton.googleReviewCount;

export default function EdmontonRegularCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      crossCity={{ city: "Calgary", to: "/calgary/regular-cleaning/", description: "The same standard clean, priced the same way, from our Calgary team.", linkText: "Standard cleaning in Calgary" }}
      quoteService="regular-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle={`Standard Cleaning & Maid Service Edmonton from ${FROM}`}
      seoDescription={`Standard house cleaning in Edmonton from ${FROM}, flat by home size. One visit, full checklist, nothing charged until the clean is done.`}
      canonical="https://dutycleaners.ca/edmonton/regular-cleaning"
      heroHeading={<>Standard Cleaning Services in <AccentGold>Edmonton</AccentGold></>}
      heroSubheading={`One visit covering the kitchen, bathrooms, bedrooms and living areas, priced flat by home size from ${FROM} for a one-bedroom. If you want it kept up, the same clean on a schedule is discounted from the second visit.`}
      heroBadges={["Reference-Checked Cleaners", "All Supplies Brought For You", "100% Satisfaction Guarantee"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Edmonton living room after a standard cleaning visit"
      overviewEyebrow="Service Overview"
      overviewHeading={<>One visit, every room, <Accent>one flat price.</Accent></>}
      overviewParagraphs={[
        <>
          A standard clean is one visit covering the kitchen, bathrooms, bedrooms and living areas: dusting, vacuuming,
          mopping, and high-touch surfaces wiped down. It is priced flat by home size, from {FROM} for a one-bedroom;{" "}
          <Link to="/pricing/">the full Edmonton price list</Link> has every size. If you want it kept up, the same clean
          on a weekly, bi-weekly or every-4-weeks schedule is discounted from the second visit; see{" "}
          <Link to="/edmonton/recurring-cleaning/">recurring cleaning in Edmonton</Link>.
        </>,
        <>
          The microwave is cleaned inside and out. The inside of the oven and fridge are add-ons, and baseboards, vents,
          switches and other build-up belong to a <Link to="/edmonton/deep-cleaning/">deep clean in Edmonton</Link>.
        </>,
        "Our cleaners follow a room-by-room checklist and bring all the supplies and equipment. We ask that the home is reasonably prepared before arrival: clothing, toys, dishes and clutter picked up. Small items may be put away if it takes a minute or two, but the visit is cleaning, not decluttering or organising.",
      ]}
      sections={[
        {
          heading: "Maid service in Edmonton: what people mean, and what it costs",
          body: (
            <>
              <p>
                Maid service, house cleaning and standard cleaning are the same thing on this site. A cleaner or a team
                comes to the house, works through the kitchen, bathrooms, bedrooms and living areas from a checklist, and
                leaves. Nobody lives in and nobody bills by the hour. The price is flat by home size, {FROM} for a
                one-bedroom and {THREE_BED} for a three-bedroom before GST, and it does not move if the visit runs long.
              </p>
              <p>
                What changes the figure is the home, not the day. Bedrooms and bathrooms set the base rate; a bungalow,
                townhouse or two-storey house adds a home-type charge on top of the apartment price; add-ons such as the
                inside of the oven are priced per item.
                {PET_FEE !== null
                  ? ` Homes with pets carry a ${formatPrice(PET_FEE)} charge per visit, shown on the quote before you book.`
                  : ""}
              </p>
              <p>
                If what you want is a maid on a schedule rather than a single visit, that is recurring cleaning: the same
                checklist, {WEEKLY ? pct(WEEKLY.discount) : ""} off weekly, {BIWEEKLY ? pct(BIWEEKLY.discount) : ""} off
                bi-weekly and {FOUR_WEEKS ? pct(FOUR_WEEKS.discount) : ""} off every 4 weeks, from the second visit on.
              </p>
            </>
          ),
        },
        {
          heading: "House cleaning in Edmonton and the towns around it",
          body: (
            <>
              <p>
                Inside Edmonton city limits there is no travel fee. St. Albert, Sherwood Park and Spruce Grove sit outside
                the limits, so a visit there carries a travel fee of {TRAVEL}, listed on the quote before you book. Each
                has its own page: <Link to="/cleaning-services-st-albert/">St. Albert house cleaners</Link>,{" "}
                <Link to="/cleaning-services-sherwood-park/">house cleaning in Sherwood Park</Link> and{" "}
                <Link to="/cleaning-services-spruce-grove/">cleaning services in Spruce Grove</Link>.
              </p>
              <p>
                Everything else we do in the city, with a starting price beside each one, is on{" "}
                <Link to="/services/">all Edmonton cleaning services and prices</Link>.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What a standard clean covers"
      includedSubheading="Kitchen, bathrooms, bedrooms and living areas, in one visit."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Wipe-down of countertops, sinks, stovetop, exterior appliances, and cabinet fronts. Floors mopped and vacuumed." },
        { icon: Bath, title: "Bathroom Sanitization", description: "Toilets, tubs and showers scrubbed and sanitized, soap scum off the tile and glass, mirrors and vanities polished, floors washed." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Dusting accessible surfaces, vacuuming carpets and rugs, and mopping hard flooring throughout the home." },
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
        "Bathrooms scrubbed and sanitized",
        "Mirrors and glass surfaces polished",
        "Trash emptied",
      ]}
      roomTasks={[
        { name: "Kitchen", tasks: 4, sample: "countertops, stovetop and sink" },
        { name: "Bathrooms", tasks: 4, sample: "sanitizing toilets, tubs and showers" },
        { name: "Living Areas", tasks: 4, sample: "dusting, vacuuming and mopping" },
        { name: "Bedrooms", tasks: 3, sample: "dusting surfaces and vacuuming under beds" },
      ]}
      pricingBySize={TIERS}
      fromPrice={FROM}
      extras={featuredExtraRows()}
      notIncluded={[
        "Moving heavy items over 25 lbs",
        "Outdoor or exterior window cleaning",
        "Mold remediation, bodily fluids, or pest removal",
        "Areas beyond the reach of a 3-step ladder",
        "Light bulbs and fragile fixtures",
        "Garages, patios, and outdoor areas (winter safety)",
      ]}
      faqs={[
        { q: "Is this the same as a maid service?", a: "Yes. Maid service, housekeeping and standard cleaning all describe the same visit here: a checklist clean of the kitchen, bathrooms, bedrooms and living areas at a flat rate by home size. We do not place live-in or hourly maids. If you want the visit repeated, book it as recurring cleaning and the discount applies from the second visit." },
        { q: "Does standard cleaning include cleaning the kitchen?", a: "Yes. We clean kitchen counters, sinks, exterior appliance surfaces, outside of the cupboards, and floors." },
        { q: "What's the difference between standard and deep cleaning?", a: "Standard cleaning refreshes a home that's already clean — dusting, vacuuming, mopping, and sanitizing high-use areas. Deep cleaning tackles built-up grime, baseboards, doors, light switches, wall outlets, and outside vents." },
        { q: "How long does a standard cleaning take?", a: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
        { q: "How often should I schedule standard cleaning?", a: "A standard clean is a single visit, so book it when the home needs one. If you want it kept up, the recurring cleaning page has the same clean on a schedule: 20% off weekly, 15% off bi-weekly, and 10% off every 4 weeks, from the second visit on." },
        // Was "or leave the keys under the mat", inside FAQPage schema. A cleaning
        // company recommending that is advising customers into something most
        // home-insurance policies exclude, next to a policy charging half the
        // visit when the team cannot get in.
        { q: "Do I need to be home during the cleaning?", a: "No. Most clients leave a lockbox or smart-lock code, a garage code, or a key with a concierge — a lockbox is the safest of these. Tell us the arrangement when you book so the team is not left standing outside, and we lock up when we leave." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment. If you would prefer we use specific products, tell us when you book." },
        { q: "What should I do to prepare?", a: "Please pick up any personal items you'd like put away and clear surfaces such as vanities, countertops, and other cluttered areas so our cleaners can work efficiently. You may also let us know any priority areas or spaces you would like us to focus on or skip." },
      ]}
      closingSections={[
        {
          heading: "Before you book a standard clean in Edmonton",
          body: (
            <>
              <p>
                Nothing is charged when you book. A temporary hold goes on the card the day before, and the charge goes
                through once the clean is complete. If something was missed, tell us within {POLICY.guaranteeWindowHours}{" "}
                hours and the team comes back to re-clean it at no charge.
              </p>
              <p>
                Our Edmonton team is rated {RATING_CLAIM}{REVIEWS ? ` across ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link> before you decide, then compare every home size on{" "}
                <Link to="/pricing/">the Edmonton price list</Link>.
              </p>
            </>
          ),
        },
      ]}
      ctaHeading={<>Standard cleaning in <AccentGold>Edmonton</AccentGold> from {FROM}.</>}
      ctaDescription="One visit, priced flat by home size. Nothing is charged when you book; your card is charged once the clean is complete. Discounts for a weekly, bi-weekly or every-4-weeks schedule are on the recurring cleaning page."
      galleryImages={[
        { src: kitchenImage, alt: "Clean, tidy kitchen after standard cleaning service in Edmonton" },
        { src: livingRoomImage, alt: "Freshly cleaned Edmonton bathroom with tidy shelves and polished surfaces" },
        { src: cleanerImage, alt: "Professional cleaner wiping kitchen surfaces in an Edmonton home" },
      ]}
    />
  );
}
