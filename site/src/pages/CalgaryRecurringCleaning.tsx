import { Link } from "react-router-dom";
import { POLICY } from "@/data/policy";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import {
  standardTierRows, featuredExtraRows, formatPrice, calculateQuote, homeTypeOptions, PRICING_TIERS, FREQUENCIES,
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
      crossCity={{ city: "Edmonton", to: "/edmonton/recurring-cleaning/", description: "Weekly and bi-weekly cleaning schedules for Edmonton homes.", linkText: "Recurring cleaning in Edmonton" }}
      quoteService="recurring-cleaning"
      phone="(403) 768-1341"
      phoneHref="tel:4037681341"
      seoTitle={`Recurring Cleaning Calgary from ${FROM} | Weekly 20% Off`}
      seoDescription={`Recurring house cleaning in Calgary from ${FROM}. Weekly 20% off, bi-weekly 15% off, every 4 weeks 10% off from the second visit; no contract to sign.`}
      serviceName="Recurring House Cleaning in Calgary"
      canonical="https://dutycleaners.ca/calgary/recurring-cleaning"
      heroHeading={<>Recurring Cleaning in <AccentGold>Calgary</AccentGold></>}
      heroSubheading={`Weekly, bi-weekly or every-4-weeks visits of the standard clean. Your first visit is at the one-time rate, ${FROM} for a one-bedroom; every visit after it is 20% off weekly, 15% off bi-weekly or 10% off every 4 weeks.`}
      heroBadges={["Weekly 20% Off", "Bi-Weekly 15% Off", "Every 4 Weeks 10% Off"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Calgary living room maintained with recurring cleaning service"
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
        "Choosing that cadence in Calgary usually comes down to the season and the front door. Because the city swings above and below freezing all winter instead of staying frozen, road sand and de-icer arrive indoors continuously from roughly October to April, so households that are comfortable on an every-4-weeks schedule through the summer often move to bi-weekly once the chinooks start. Homes with a dog, a garage entry, or small children tracking straight through from the yard tend to feel it first.",
        "Frequency also tracks how you live. A Beltline or Mission apartment where two people leave early and come back late holds up on a visit every 4 weeks. A family home in Evergreen, Panorama Hills or Cranston with a busy kitchen usually wants weekly or bi-weekly. There is no contract either way, so you can start on one cadence, see how your home behaves through a Calgary winter, and change it.",
      ]}
      sections={[
        {
          heading: "Weekly, bi-weekly or monthly cleaning in Calgary: what each one costs",
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
                The tier most people call monthly is booked as every 4 weeks, because that is what the booking system
                schedules: 13 visits across the year instead of 12, so the day moves through the month rather than
                repeating on the same date. The checklist and the team are the same as on the other two tiers.
              </p>
            </>
          ),
        },
        {
          heading: "Planning a Calgary cleaning schedule around the seasons",
          body: (
            <>
              <p>
                The Calgary pattern that works: every 4 weeks from May to September, bi-weekly from October to April.
                The switch is not about the house being dirtier in a general way; it is the front hall, the stairs and
                the kitchen floor taking road sand every time a chinook turns the streets to slush and the next cold
                snap freezes it again. Two weeks is about as long as an entryway stays presentable in that cycle.
              </p>
              <p>
                Weekly is for the households where the kitchen never gets a day off. A garage entry counts as a second
                front door for grit; a dog counts as a third. If you are unsure, start bi-weekly in October, look at
                the floors in January, and move up or down. There is no contract, and a change with notice costs nothing.
              </p>
              <p>
                If the house is already behind, open with a <Link to="/calgary/deep-cleaning/">Calgary deep clean</Link>{" "}
                and let the schedule take over from the second visit; the discount applies from that visit either way.
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
                A short-term rental is not a recurring plan. Turnovers between guests are priced by the hour against
                a different checklist, so hosts should see{" "}
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
        { icon: Bath, title: "Bathroom Sanitization", description: "Toilet, tub and shower scrubbed, soap scum taken off tile and glass, mirror and vanity polished, floor washed." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Reachable surfaces dusted, carpets and rugs vacuumed, hard floors mopped, room by room through the home." },
      ]}
      bullets={[
        "Kitchen, bathrooms, and living areas cleaned",
        "Floors vacuumed and mopped",
        "Dusting of all accessible surfaces and furniture",
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
        { q: "How often should I book in Calgary specifically?", a: "Bi-weekly through the winter and every 4 weeks through the summer is the usual pattern; homes with a dog, a garage entry or young children tend to stay bi-weekly all year. There is no contract, so start on one cadence and change it once you see how the house behaves." },
        { q: "What does the discount come to in dollars?", a: `On a two-bedroom apartment at ${TWO_BED}, the first visit is ${TWO_BED} and every visit after it is ${ongoing(1, WEEKLY?.id)} weekly, ${ongoing(1, BIWEEKLY?.id)} bi-weekly or ${ongoing(1, FOUR_WEEKS?.id)} every 4 weeks, before GST. The percentages are the same for every home size.` },
        { q: "What notice do you need to move or skip a visit?", a: `${POLICY.cancellationNoticeHours} hours. With that notice there is no charge and no limit on how often you change. Inside ${POLICY.cancellationNoticeHours} hours the ${POLICY.cancellationFee} cancellation fee applies, and a visit where the team arrives and cannot get in is billed at ${POLICY.lockoutFee}.` },
        { q: "Is it the same Calgary team every time?", a: "That is the aim, and it usually holds, because a team that knows the house is faster and misses less. Illness and holidays happen; when they do, another of our teams covers the visit. If you would rather wait for your regular team, tell us and we will move the date instead." },
        { q: "What if nobody is home when the team arrives?", a: "That is how most recurring visits run. A lockbox, a smart-lock code, a garage code or a fob with the concierge all work; tell us which when you book. The team locks up when they leave." },
        { q: "Do I need to leave out cleaning products?", a: "No. The team brings its own products and equipment to every visit. If there is something you want used, or something you want kept away from a surface, note it on the booking." },
        { q: "Can I just book one clean and decide later?", a: "Yes. A one-time standard clean or deep clean is priced flat by home size, and if you put it on a schedule afterwards the discount applies from the second visit. Nothing is lost by starting with one." },
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
      ctaDescription={`Your first visit is at the one-time rate, from ${FROM} for a one-bedroom; after that, weekly is 20% off, bi-weekly 15% off and every 4 weeks 10% off. There is no contract, and a change or skip needs ${POLICY.cancellationNoticeHours} hours' notice.`}
      galleryImages={[
        { src: kitchenImage, alt: "Calgary kitchen after a recurring cleaning visit" },
        { src: livingRoomImage, alt: "Bright, consistently clean Calgary living room" },
        { src: cleanerImage, alt: "Professional cleaner wiping surfaces in a Calgary home" },
      ]}
    />
  );
}
