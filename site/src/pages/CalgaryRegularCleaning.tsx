import { Link } from "react-router-dom";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import { standardTierRows, featuredExtraRows, formatPrice, addOnFromPrice, FREQUENCIES } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY } from "@/data/policy";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { Accent, AccentGold } from "@/components/Accent";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/calgary-living-room-clean.webp";
import kitchenImage from "@/assets/gallery/calgary-spotless-kitchen.webp";
import livingRoomImage from "@/assets/gallery/calgary-clean-home-northwest.webp";
import cleanerImage from "@/assets/gallery/calgary-team-cleaning.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));
const FROM = TIERS[0].price;
const TWO_BED = TIERS[1].price;
const THREE_BED = TIERS[2].price;
/** Travel fee for an address outside Calgary city limits, from bk-config. */
const TRAVEL = formatPrice(travelFee("standard") ?? 0);
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const BALCONY = addOnFromPrice("standard", "sweep-only-of-garage-or-balcony");
const pct = (discount: number) => `${Math.round(discount * 100)}%`;
const WEEKLY = FREQUENCIES.find((f) => f.discount === 0.2);
const BIWEEKLY = FREQUENCIES.find((f) => f.discount === 0.15);
const FOUR_WEEKS = FREQUENCIES.find((f) => f.discount === 0.1);
const REVIEWS = CITY_PROOF.calgary.googleReviewCount;

export default function CalgaryRegularCleaning() {
  return (
    <ServiceDetailPage
      city="calgary"
      crossCity={{ city: "Edmonton", to: "/edmonton/regular-cleaning/", description: "The same standard clean, at the same flat rates, from our Edmonton team.", linkText: "Standard cleaning in Edmonton" }}
      quoteService="regular-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle={`Standard Cleaning & Maid Service Calgary from ${FROM}`}
      seoDescription={`A Calgary maid service visit is a standard clean at a flat rate by home size: ${FROM} before GST for a one-bedroom apartment, charged after the clean.`}
      serviceName="Standard House Cleaning in Calgary"
      canonical="https://dutycleaners.ca/calgary/regular-cleaning"
      heroHeading={<>Standard Cleaning in <AccentGold>Calgary</AccentGold></>}
      heroSubheading={`Kitchen, bathrooms, bedrooms and floors in one visit, at a flat rate by home size that starts at ${FROM} before GST for a one-bedroom apartment, with any pet or home-type charge added on the quote. Put the same clean on a schedule and every visit after the first is discounted.`}
      heroBadges={["Reference-Checked Cleaners", "All Supplies Brought For You", "Missed Spots Re-Cleaned Free"]}
      heroImage={heroImage}
      heroImageAlt="Sunlit living room with a beige sofa, a patterned rug on hardwood floors and a gas fireplace"
      heroImageWidth={800}
      heroImageHeight={800}
      overviewEyebrow="Service Overview"
      overviewHeading={<>One visit, <Accent>priced flat by home size.</Accent></>}
      overviewParagraphs={[
        <>
          A standard clean is a single visit: kitchen, bathrooms, floors, bedrooms and the living spaces you use,
          dusted, vacuumed, mopped and wiped down. It is priced flat by home size from {FROM} for a one-bedroom, the
          rate holds if the visit runs long, and{" "}
          <Link to="/calgary/pricing/">Calgary house cleaning prices by home size</Link> lists the rest.
        </>,
        "In Calgary most of that job is dust and grit. Dry air and wind keep fine grit airborne for most of the year, so it lands on sills, shelves and the tops of frames between visits. From November to April the city thaws and refreezes on chinooks, and every thaw carries road sand and de-icer back through the front door on boots, where it settles along the baseboards and into the carpet edges.",
        <>
          The cheaper way to stay ahead of that, in a Beltline condo or a two-storey house in Seton, is the
          same clean on a schedule; <Link to="/calgary/recurring-cleaning/">recurring cleaning in Calgary</Link> lists
          the weekly, bi-weekly and every-4-weeks discounts. Grit that has already worked into the baseboards and carpet
          edges needs a <Link to="/calgary/deep-cleaning/">Calgary deep clean</Link> first.
        </>,
      ]}
      sections={[
        {
          heading: "Maid service in Calgary: what it covers and what it costs",
          body: (
            <>
              <p>
                In Calgary a maid service, a housekeeper visit and a standard clean are one product under three names,
                and the Calgary office books all three the same way. A team
                arrives with its own supplies, works from a room-by-room checklist, and leaves the kitchen, bathrooms,
                bedrooms and floors done. Nobody lives in and nobody runs a meter.
              </p>
              <p>
                The price is fixed before the team arrives: {FROM} for a one-bedroom apartment and {THREE_BED} for three
                bedrooms, before GST. A townhouse or a two-storey house adds a home-type charge that the quote shows
                before you commit, and add-ons such as the inside of the oven are priced per item.
                {PET_FEE !== null ? ` Pets add ${formatPrice(PET_FEE)} to each visit, also on the quote.` : ""}
              </p>
              <p>
                Decluttering and organising cupboards are what people sometimes expect of the word maid. They are an
                hourly add-on outside the visit, and we would rather say so here than at the door. A maid on a
                schedule is recurring cleaning: {WEEKLY ? pct(WEEKLY.discount) : ""} off weekly,{" "}
                {BIWEEKLY ? pct(BIWEEKLY.discount) : ""} off bi-weekly, {FOUR_WEEKS ? pct(FOUR_WEEKS.discount) : ""} off
                every 4 weeks, from the second visit.
              </p>
            </>
          ),
        },
        {
          heading: "Standard cleaning for Calgary condos and apartments",
          body: (
            <>
              <p>
                Apartments and condos in the Beltline, Mission, Eau Claire and the downtown towers are the simplest job
                we price: the apartment rate with no home-type charge, {FROM} for one bedroom and {TWO_BED} for two.
              </p>
              <p>
                Two things are different in a tower. Access: the team has to get past the lobby, so leave a fob with the
                concierge or meet them at the door, and tell us the visitor-parking arrangement when you book. Scope:
                the balcony is a sweep-only add-on
                {BALCONY !== null ? ` at ${formatPrice(BALCONY)}` : ""}, and anything beyond the reach of a three-step
                ladder, including high glass, stays off the list.
              </p>
            </>
          ),
        },
        {
          heading: "Outside Calgary city limits, and the jobs a standard clean does not cover",
          body: (
            <>
              <p>
                Inside Calgary city limits there is no travel fee. Airdrie, Cochrane, Okotoks and Chestermere are outside
                them, and a visit there carries a {TRAVEL} travel fee that shows on the quote before you book. Airdrie
                and Cochrane each have their own page: <Link to="/cleaning-services-airdrie/">house cleaning in Airdrie</Link>{" "}
                and <Link to="/cleaning-services-cochrane/">Cochrane house cleaners</Link>.
              </p>
              <p>
                Some jobs are not this one. A place being handed back to a landlord is{" "}
                <Link to="/move-out-cleaning-calgary/">move-out cleaning in Calgary</Link>, on a price table of its own.
                A basement or kitchen the trades have just finished with is{" "}
                <Link to="/post-construction-cleaning-calgary/">post-construction cleaning</Link>, quoted against square
                footage instead of bedrooms. Walls that have taken hands, boots and frying are{" "}
                <Link to="/wall-washing-wall-cleaning-calgary/">wall washing in Calgary</Link>, a package added to a
                clean rather than folded into it. A guest suite between bookings is{" "}
                <Link to="/airbnb-cleaning-services-calgary/">short-term rental turnover cleaning</Link>, billed by the
                hour.
              </p>
              <p>
                The full menu is on <Link to="/calgary/services/">every Calgary cleaning service, with starting prices</Link>.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What a standard clean covers"
      includedSubheading="Kitchen, bathrooms, bedrooms, floors and living areas, in one visit."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Counters, sink and stovetop wiped, the outside of the fridge, oven and dishwasher and the cabinet fronts done, then the floor vacuumed and mopped." },
        { icon: Bath, title: "Bathrooms", description: "Toilet, tub and shower scrubbed, soap scum taken off tile and glass, mirror and vanity polished, floor washed." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Reachable surfaces dusted, carpets and rugs vacuumed, hard floors mopped, room by room through the home." },
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
      roomTasks={[
        { name: "Kitchen", tasks: 4, sample: "the counters, the stovetop and the sink" },
        { name: "Bathrooms", tasks: 4, sample: "the toilet, tub and shower scrubbed" },
        { name: "Living Areas", tasks: 4, sample: "dusting, then vacuuming and mopping" },
        { name: "Bedrooms", tasks: 3, sample: "surfaces dusted and under the bed vacuumed" },
      ]}
      pricingBySize={TIERS}
      fromPrice={FROM}
      extras={featuredExtraRows()}
      notIncluded={[
        "Furniture and anything else over 25 lbs stays where it is",
        "Exterior windows and any outdoor work",
        "Mould remediation, bodily fluids and pest removal",
        "Anything higher than a 3-step ladder reaches",
        "Light bulbs, chandeliers and fragile fixtures",
        "Garages, patios and balconies, apart from the balcony or garage sweep add-on, available mostly in summer when the weather allows",
      ]}
      faqs={[
        { q: "Is a standard clean the same as a maid service in Calgary?", a: "Yes. Whatever you call it, a maid service, a housekeeper or a cleaner, the visit is the same: the kitchen, bathrooms, bedrooms and floors worked through from a checklist at a flat rate set by home size. Nobody lives in and nothing is billed by the hour. If you want the maid back every week or two, book it as recurring cleaning and the discount starts on the second visit." },
        { q: "Why does my Calgary home get dusty so quickly?", a: "Dry air and wind keep fine grit airborne in Calgary for most of the year, and from November to April road sand comes in on boots each time a chinook melts the streets. It is not something you are doing wrong; a standard clean takes it back off the floors, sills and entryway in one visit." },
        { q: "What does a Calgary standard clean do in the kitchen?", a: "Counters, the sink and the stovetop are cleaned, the microwave is done inside and out, the outside of the fridge, oven and dishwasher and the cabinet fronts are wiped, and the floor is vacuumed and mopped. The inside of the oven and fridge are separate add-ons." },
        { q: "When is a deep clean the better choice?", a: "A deep clean is the better choice once the grit has already worked in. A standard clean resets a Calgary home that is basically kept up. If the baseboards, door frames, switch plates, vents and the range hood have not been touched in months, book the deep clean first and keep it up with standard visits after that." },
        { q: "Is the price by the hour?", a: "No. The rate is fixed by home size before the team arrives, and it stays fixed if the visit takes longer than expected. The team works to the checklist, not to a clock, and leaves when the checklist is done." },
        { q: "How often do Calgary homes need a standard clean?", a: "One visit is one visit; book it when the house needs it. To keep a Calgary home at one level, put the standard clean on a schedule: weekly visits are 20% off, bi-weekly 15% off and every 4 weeks 10% off. The discount starts on the second visit, and the first is charged at the one-time rate." },
        { q: "Can the team get in if I am at work?", a: `Yes. You do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and in a Calgary tower a fob left with the concierge does the same job. Tell us which when you book, and the team locks up on the way out. If the team cannot get in, the lockout charge is ${POLICY.lockoutFee}.` },
        { q: "Who supplies the products and the vacuum?", a: `We do. The team brings every product and piece of equipment, the vacuum included. If there is a product you want used or avoided, say so when you book. Optional alternative products are ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.` },
        { q: "How should I get the house ready?", a: "You do not need to clean before the team comes; clear counters and floors get cleaned and cluttered ones get worked around; decluttering and organising are a separate hourly add-on. If a room should be skipped, or one deserves extra time, note it on the booking." },
      ]}
      closingSections={[
        {
          heading: "Booking a standard clean in Calgary",
          body: (
            <>
              <p>
                You pick a date and an arrival window, the quote shows the flat rate before you confirm, and nothing is
                charged until the clean is done. If the team missed something, say so within{" "}
                {POLICY.guaranteeWindowHours} hours and they come back for it at no charge.
              </p>
              <p>
                Our Calgary team is rated {RATING_CLAIM}{REVIEWS ? ` over ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link>, then{" "}
                <Link to="/calgary/pricing/">check the Calgary price for your home size</Link>.
              </p>
            </>
          ),
        },
      ]}
      ctaHeading={<>Standard cleaning in <AccentGold>Calgary</AccentGold> from {FROM}.</>}
      ctaDescription="That figure is the one-bedroom apartment rate before GST. A townhouse or two-storey house adds a home-type charge, a home with pets adds the pet charge and an address outside Calgary city limits adds the travel fee, all shown on the quote before you book. Nothing is charged until the clean is complete."
      galleryImages={[
        { src: kitchenImage, alt: "Kitchen with white shaker cabinets, stainless-steel appliances and a quartz island with a double sink" },
        { src: livingRoomImage, alt: "Bright living room with a cream sectional sofa, a glass coffee table and hardwood floors" },
        { src: cleanerImage, alt: "Two cleaners in aprons and gloves, one wiping a kitchen counter and one holding a spray bottle" },
      ]}
    />
  );
}
