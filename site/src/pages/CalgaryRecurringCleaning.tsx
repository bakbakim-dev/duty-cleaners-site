import { Link } from "react-router-dom";
import { POLICY } from "@/data/policy";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import {
  standardTierRows, featuredExtraRows, formatPrice, calculateQuote, homeTypeOptions, PRICING_TIERS, FREQUENCIES,
  addOnFromPrice,
} from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
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
/** Travel fee for an address outside Calgary city limits, from bk-config. */
const TRAVEL = formatPrice(travelFee("standard") ?? 0);
const REVIEWS = CITY_PROOF.calgary.googleReviewCount;
/** The compulsory per-visit pet charge, from bk-config. */
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const WEEKLY = FREQUENCIES.find((f) => f.discount === 0.2);
const BIWEEKLY = FREQUENCIES.find((f) => f.discount === 0.15);
const FOUR_WEEKS = FREQUENCIES.find((f) => f.discount === 0.1);
const pct = (discount?: number) => `${Math.round((discount ?? 0) * 100)}%`;
/** What a visit costs from the second one on, for a published tier on a frequency. */
const ongoing = (tierIndex: number, frequency?: string) => {
  const tier = PRICING_TIERS[tierIndex];
  if (!tier || !frequency) return "";
  const quote = calculateQuote({
    service: "standard",
    homeType: homeTypeOptions("standard")[0]?.id ?? null,
    bedrooms: tier.beds,
    bathrooms: tier.bathrooms,
    halfBaths: tier.halfBaths,
    addOns: [],
    frequency,
  });
  return formatPrice(quote.ongoing ?? quote.firstClean);
};

export default function CalgaryRecurringCleaning() {
  return (
    <ServiceDetailPage
      city="calgary"
      crossCity={{ city: "Edmonton", to: "/edmonton/recurring-cleaning/", description: "Weekly, bi-weekly and every-4-weeks cleaning schedules for Edmonton homes.", linkText: "Recurring cleaning in Edmonton" }}
      quoteService="recurring-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle={`Recurring Cleaning Calgary from ${FROM} | Weekly 20% Off`}
      seoDescription={`Weekly, bi-weekly or every-4-weeks house cleaning in Calgary: 20%, 15% or 10% off from visit two. A one-bedroom first clean is ${FROM} before GST.`}
      serviceName="Recurring House Cleaning in Calgary"
      canonical="https://dutycleaners.ca/calgary/recurring-cleaning"
      heroHeading={<>Recurring Cleaning in <AccentGold>Calgary</AccentGold></>}
      heroSubheading={`Weekly, bi-weekly or every-4-weeks visits of the standard clean. Your first visit is at the one-time rate, ${FROM} before GST for a one-bedroom apartment plus any pet or home-type charge; every visit after it is 20% off weekly, 15% off bi-weekly or 10% off every 4 weeks.`}
      heroBadges={["Weekly 20% Off", "Bi-Weekly 15% Off", "Every 4 Weeks 10% Off"]}
      heroImage={heroImage}
      heroImageAlt="Living room in afternoon sun, with a beige sofa, a patterned rug, hardwood floors and a fireplace"
      heroImageWidth={800}
      heroImageHeight={800}
      overviewEyebrow="Service Overview"
      overviewHeading={<>Standard cleaning, <Accent>on a schedule you set.</Accent></>}
      overviewParagraphs={[
        <>
          Recurring cleaning is the <Link to="/calgary/regular-cleaning/">Calgary standard clean</Link> repeated
          weekly, bi-weekly or every 4 weeks. The first visit is charged at the one-time rate; from the second, weekly
          is 20% off, bi-weekly 15% off and every 4 weeks 10% off. You pick the cadence; we keep to it.
        </>,
        "Choosing that cadence in Calgary comes down to the season and the front door. The city thaws and refreezes on chinooks all winter, so sand and de-icer reach the doormat again and again from November to April and settle along baseboards and carpet edges. A home that holds up on a visit every 4 weeks through the summer may want one every 2 weeks once that starts. A dog, a garage entry or children coming straight in from the yard all carry more of it inside.",
        `Frequency also tracks how you live. A Beltline or Mission apartment where two people leave early and come back late holds up on a visit every 4 weeks. A family house in a newer suburb such as Mahogany, Seton or Livingston has construction dust to deal with as well as a full kitchen, and weekly or bi-weekly suits it better. You can start on one cadence, see how the house fares through a Calgary winter, and change it with ${POLICY.cancellationNoticeHours} hours' notice.`,
      ]}
      sections={[
        {
          heading: "Weekly, bi-weekly or every-4-weeks cleaning in Calgary: what each one costs",
          body: (
            <>
              <p>
                The three tiers are the same checklist at three prices. Take a two-bedroom apartment, {TWO_BED} as a
                one-time clean and for the first visit of any plan. From the second visit, weekly comes to{" "}
                {ongoing(1, WEEKLY?.id)} a visit ({pct(WEEKLY?.discount)} off), bi-weekly to{" "}
                {ongoing(1, BIWEEKLY?.id)} ({pct(BIWEEKLY?.discount)} off) and every 4 weeks to{" "}
                {ongoing(1, FOUR_WEEKS?.id)} ({pct(FOUR_WEEKS?.discount)} off), all before GST.
              </p>
              <p>
                Every 4 weeks is what many people mean by monthly house cleaning, and it is how the booking system
                schedules the 10% tier: 13 visits across the year instead of 12, so the day moves through the month
                rather than repeating on the same date. The checklist is the same on all three tiers.
              </p>
              <p>
                The two-bedroom figures are the apartment rate. A townhouse or a two-storey house adds a home-type
                charge to each visit, and a home with pets adds the pet charge
                {PET_FEE !== null ? `, ${formatPrice(PET_FEE)} a visit` : ""}. Both are compulsory, and both show
                on the quote before the first visit is booked.
              </p>
            </>
          ),
        },
        {
          heading: "Planning a Calgary cleaning schedule around the seasons",
          body: (
            <>
              <p>
                One way to plan a Calgary year: every 4 weeks from May to October, bi-weekly from November to April.
                The switch is not about the house being dirtier in a general way; it is the front hall, the stairs and
                the kitchen floor taking road sand every time a chinook turns the streets to slush and the next cold
                snap freezes it again. A visit every two weeks lifts that grit before it has a month to work into the
                carpet edges.
              </p>
              <p>
                Weekly is for the households where the kitchen never gets a day off. A garage entry counts as a second
                front door for grit; a dog counts as a third. If you are unsure, start bi-weekly in November, look at
                the floors in January, and move up or down. A change made with {POLICY.cancellationNoticeHours} hours'
                notice costs nothing.
              </p>
              <p>
                If the house is already behind, book a <Link to="/calgary/deep-cleaning/">Calgary deep clean</Link>{" "}
                to clear the build-up, then start the schedule. The first standard visit of the plan is charged at the
                one-time rate, and the discount applies from the second.
              </p>
            </>
          ),
        },
        {
          heading: "Recurring cleaning in Airdrie, Cochrane and for short-term rentals",
          body: (
            <>
              <p>
                Airdrie, Cochrane, Okotoks and Chestermere are outside Calgary city limits, so a plan there carries a{" "}
                {TRAVEL} travel fee on each visit, shown on the quote before you book. Airdrie and Cochrane have their
                own pages: <Link to="/cleaning-services-airdrie/">Airdrie house cleaners</Link> and{" "}
                <Link to="/cleaning-services-cochrane/">house cleaning in Cochrane</Link>.
              </p>
              <p>
                A short-term rental is not a recurring plan. Turnovers between guests are priced by the hour rather
                than by home size, so hosts should see{" "}
                <Link to="/airbnb-cleaning-services-calgary/">short-term rental turnover cleaning in Calgary</Link>{" "}
                instead.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What Every Recurring Visit Includes"
      includedSubheading="Kitchen, bathrooms, bedrooms and living areas, on every visit."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Counters, sink and stovetop wiped, the outside of the fridge, oven and dishwasher and the cabinet fronts done, then the floor vacuumed and mopped." },
        { icon: Bath, title: "Bathrooms", description: "Toilet, tub and shower scrubbed, soap scum taken off tile and glass, mirror and vanity polished, floor washed." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Reachable surfaces dusted, carpets and rugs vacuumed, hard floors mopped, room by room through the home." },
      ]}
      bullets={[
        "Kitchen, bathrooms, and living areas cleaned",
        "Floors vacuumed and mopped",
        "Dusting of all accessible surfaces and furniture",
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
      pricingNote="The table is the one-time rate, which is what the first visit costs. Every visit after it is 20% off weekly, 15% off bi-weekly or 10% off every 4 weeks."
      fromPrice={FROM}
      extras={featuredExtraRows()}
      notIncluded={[
        "Furniture and anything else over 25 lbs stays where it is",
        "Exterior windows and any outdoor work",
        "Mould remediation, bodily fluids and pest removal",
        "Anything higher than a 3-step ladder reaches",
        "Light bulbs, chandeliers and fragile fixtures",
        "Garages, patios and balconies (a balcony sweep is an add-on)",
      ]}
      faqs={[
        { q: "How often should I book in Calgary specifically?", a: `A Calgary home takes in sand and de-icer from November to April, as chinooks thaw and refreeze the streets, so bi-weekly through those months and every 4 weeks through the summer is a sensible place to start. A home with a dog, a garage entry or young children may want bi-weekly all year. Start on one cadence and change it with ${POLICY.cancellationNoticeHours} hours' notice once you see how the house holds up.` },
        { q: "What does the discount come to in dollars?", a: `On a two-bedroom apartment at ${TWO_BED}, the first visit is ${TWO_BED} and every visit after it is ${ongoing(1, WEEKLY?.id)} weekly, ${ongoing(1, BIWEEKLY?.id)} bi-weekly or ${ongoing(1, FOUR_WEEKS?.id)} every 4 weeks, before GST. The percentages are the same for every home size. A townhouse or two-storey house, a home with pets and an address outside Calgary city limits each add a charge, shown on the quote before you book.` },
        { q: "What notice do you need to move or skip a visit?", a: `${POLICY.cancellationNoticeHours} hours. A visit moved or skipped with that much notice costs nothing. Inside ${POLICY.cancellationNoticeHours} hours the ${POLICY.cancellationFee} cancellation fee applies, and a visit where the team arrives and cannot get in is billed at ${POLICY.lockoutFee}.` },
        { q: "Will the same Calgary team come every time?", a: "We send your regular team where we can send them. Illness, holidays and the schedule mean that is not always possible, and when it is not, another Calgary team works through the same checklist. If you would rather wait for your regular team, tell us and we will offer another date instead." },
        { q: "What if nobody is home when the team arrives?", a: "Nobody needs to be home for a recurring visit: most customers leave a key, a lockbox code or smart-lock access, and a fob left with the concierge works in a Calgary tower. Tell us which when you book. The team locks up when they leave." },
        { q: "Do I need to leave out cleaning products?", a: `No. The team brings its own products and equipment to every visit. If there is something you want used, or something you want kept away from a surface, note it on the booking. Eco-friendly products are ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.` },
        { q: "Can I just book one clean and decide later?", a: `Yes. A one-time standard clean is priced flat by home size, from ${FROM} for a one-bedroom before GST. If you later put the standard clean on a schedule, the first visit of the plan is charged at the one-time rate and the discount applies from the second.` },
      ]}
      closingSections={[
        {
          heading: "Starting a recurring plan in Calgary",
          body: (
            <>
              <p>
                Pick a cadence and a first date; the quote shows the one-time rate for the first visit and the
                discounted rate for the rest. Nothing is charged when you book, and the card is charged after each
                clean is done. Anything missed is re-cleaned at no charge if you tell us within{" "}
                {POLICY.guaranteeWindowHours} hours.
              </p>
              <p>
                Our Calgary team is rated {RATING_CLAIM}{REVIEWS ? ` over ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link>. The one-time rate for every home size is on{" "}
                <Link to="/calgary/pricing/">the Calgary price list</Link>, and the rest of what we do is on{" "}
                <Link to="/calgary/services/">every Calgary cleaning service, with starting prices</Link>.
              </p>
            </>
          ),
        },
      ]}
      ctaHeading={<>Recurring cleaning in <AccentGold>Calgary</AccentGold> from {FROM}.</>}
      ctaDescription={`Your first visit is at the one-time rate, from ${FROM} before GST for a one-bedroom apartment plus any pet or home-type charge; after that, weekly is 20% off, bi-weekly 15% off and every 4 weeks 10% off. Changing or skipping a visit needs ${POLICY.cancellationNoticeHours} hours' notice.`}
      galleryImages={[
        { src: kitchenImage, alt: "Kitchen with white cabinets, a stainless-steel fridge and range, and a quartz island" },
        { src: livingRoomImage, alt: "Living room with a cream sectional sofa, potted plants and hardwood floors" },
        { src: cleanerImage, alt: "Two cleaners in green aprons, one wiping a counter and one holding a spray bottle" },
      ]}
    />
  );
}
