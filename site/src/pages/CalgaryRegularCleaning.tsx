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
      seoDescription={`Standard house cleaning in Calgary from ${FROM}, flat by home size. Kitchen, bathrooms, bedrooms and floors in one visit; card charged only when it is done.`}
      canonical="https://dutycleaners.ca/calgary/regular-cleaning"
      heroHeading={<>Standard Cleaning in <AccentGold>Calgary</AccentGold></>}
      heroSubheading={`Kitchen, bathrooms, bedrooms and floors in one visit, at a flat rate by home size that starts at ${FROM} for a one-bedroom. Put the same clean on a schedule and every visit after the first is discounted.`}
      heroBadges={["Reference-Checked Cleaners", "All Supplies Brought For You", "100% Satisfaction Guarantee"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Calgary living room after a standard cleaning visit"
      overviewEyebrow="Service Overview"
      overviewHeading={<>One visit, <Accent>priced flat by home size.</Accent></>}
      overviewParagraphs={[
        <>
          A standard clean is a single visit: kitchen, bathrooms, floors, bedrooms and the living spaces you use,
          dusted, vacuumed, mopped and wiped down. It is priced flat by home size from {FROM} for a one-bedroom, the
          rate holds if the visit runs long, and{" "}
          <Link to="/calgary/pricing/">Calgary house cleaning prices by home size</Link> lists the rest.
        </>,
        "In Calgary that job is mostly a losing battle with dust, and the reason is geography. The city is dry, it is windy, and it sits where the prairie meets the foothills, so fine grit stays in the air far more of the year than it does further north. Add a winter that thaws and refreezes on a chinook rather than staying locked in, and entryways take a beating from October through April as road sand and de-icer come in on boots, over and over.",
        <>
          The cheaper way to stay ahead of that, in a downtown condo or a family home in Tuscany or Auburn Bay, is the
          same clean on a schedule; <Link to="/calgary/recurring-cleaning/">recurring cleaning in Calgary</Link> lists
          the weekly, bi-weekly and every-4-weeks discounts. Grit that has already worked into the baseboards and carpet
          edges is a job for a <Link to="/calgary/deep-cleaning/">Calgary deep clean</Link>, not a standard one.
        </>,
      ]}
      sections={[
        {
          heading: "Maid service in Calgary: what it covers and what it costs",
          body: (
            <>
              <p>
                People search for a maid service in Calgary and land on this page, so it is worth saying plainly: this
                is it. A maid service, a housekeeper visit and a standard clean are one product with three names. A team
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
                hourly add-on, not part of the visit, and we would rather say so here than at the door. A maid on a
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
          heading: "House cleaning in Airdrie, Cochrane and the rest of the Calgary area",
          body: (
            <>
              <p>
                Inside Calgary city limits there is no travel fee. Airdrie, Cochrane, Okotoks and Chestermere are outside
                them, and a visit there carries a {TRAVEL} travel fee that shows on the quote before you book. Airdrie
                and Cochrane each have their own page: <Link to="/cleaning-services-airdrie/">house cleaning in Airdrie</Link>{" "}
                and <Link to="/cleaning-services-cochrane/">Cochrane house cleaners</Link>.
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
        { icon: Bath, title: "Bathroom Sanitization", description: "Toilet, tub and shower scrubbed, soap scum taken off tile and glass, mirror and vanity polished, floor washed." },
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
        "Bathrooms scrubbed and sanitized",
        "Mirrors and glass surfaces polished",
        "Trash emptied",
      ]}
      roomTasks={[
        { name: "Kitchen", tasks: 4, sample: "the counters, the stovetop and the sink" },
        { name: "Bathrooms", tasks: 4, sample: "the toilet, tub and shower sanitized" },
        { name: "Living Areas", tasks: 4, sample: "dusting, then vacuuming and mopping" },
        { name: "Bedrooms", tasks: 3, sample: "surfaces dusted and under the bed vacuumed" },
      ]}
      pricingBySize={TIERS}
      fromPrice={FROM}
      extras={featuredExtraRows()}
      notIncluded={[
        "Furniture and anything else over 25 lbs stays where it is",
        "Exterior windows and any outdoor work",
        "Mold remediation, bodily fluids and pest removal",
        "Anything higher than a 3-step ladder reaches",
        "Light bulbs, chandeliers and fragile fixtures",
        "Garages, patios and balconies (a balcony sweep is an add-on)",
      ]}
      faqs={[
        { q: "Is a standard clean the same as a maid service in Calgary?", a: "Yes. Whatever you call it, a maid service, a housekeeper or a cleaner, the visit is the same: the kitchen, bathrooms, bedrooms and floors worked through from a checklist at a flat rate set by home size. Nobody lives in and nothing is billed by the hour. If you want the maid back every week or two, book it as recurring cleaning and the discount starts on the second visit." },
        { q: "Why does my Calgary home get dusty so quickly?", a: "Dry air and wind keep fine grit airborne here for most of the year, and in winter road sand comes in on boots each time a chinook melts the streets. It is not something you are doing wrong; a standard clean takes it back off the floors, sills and entryway in one visit." },
        { q: "What does a Calgary standard clean do in the kitchen?", a: "Counters, the sink and the stovetop are cleaned, the microwave is done inside and out, the outside of the fridge, oven and dishwasher and the cabinet fronts are wiped, and the floor is vacuumed and mopped. The inside of the oven and fridge are separate add-ons." },
        { q: "When is a deep clean the better choice?", a: "When the grit has already worked in. A standard clean resets a home that is basically kept up. If the baseboards, door frames, switch plates, vents and the range hood have not been touched in months, book the deep clean first and keep it up with standard visits after that." },
        { q: "Is the price by the hour?", a: "No. The rate is fixed by home size before the team arrives, and it stays fixed if the visit takes longer than expected. The team works to the checklist, not to a clock, and leaves when the checklist is done." },
        { q: "How often do Calgary homes need a standard clean?", a: "One visit is one visit; book it when the house needs it. Bi-weekly is the usual choice for keeping it up, and the recurring cleaning page has that schedule at 15% off, weekly at 20% off and every 4 weeks at 10% off, from the second visit on." },
        { q: "Can the team get in if I am at work?", a: "Yes. A lockbox is the arrangement we prefer; a smart-lock code, a garage code or a fob left with the concierge also works. Tell us which when you book so the team is not locked out, and they lock up on the way out." },
        { q: "Who supplies the products and the vacuum?", a: "We do. The team brings everything, including the vacuum. If there is a product you want used or avoided, say so when you book." },
        { q: "How should I get the house ready?", a: "Pick up clothes, toys, dishes and anything else on the floors and counters so the team can clean the surfaces rather than clear them. If a room should be skipped, or one deserves extra time, note it on the booking." },
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
      ctaDescription="A single visit at a flat rate by home size. Nothing is charged when you book and your card is charged once the clean is complete. If you want the house kept ahead of a Calgary winter, the recurring cleaning page has the schedule discounts."
      galleryImages={[
        { src: kitchenImage, alt: "Calgary kitchen after a standard clean" },
        { src: livingRoomImage, alt: "Bright, freshly cleaned Calgary living room" },
        { src: cleanerImage, alt: "Professional cleaner wiping surfaces in a Calgary home" },
      ]}
    />
  );
}
