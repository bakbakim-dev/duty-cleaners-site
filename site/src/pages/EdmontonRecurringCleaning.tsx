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
import heroImage from "@/assets/gallery/family-clean-home-edmonton.webp";
import kitchenImage from "@/assets/gallery/summerside-cleaner-home.webp";
import livingRoomImage from "@/assets/gallery/glenora-cleaner-living-room.webp";
import cleanerImage from "@/assets/gallery/westmount-cleaner-kitchen.webp";

// Published figures come from bk-config via pricing.ts. Hand-typing them
// here is what let this page drift out of step with /pricing and with what
// BookingKoala actually charges.
const TIERS = standardTierRows().map((row) => ({ size: row.beds, price: row.price }));
const FROM = TIERS[0].price;
/** Travel fee for an address outside Edmonton city limits, from bk-config. */
const TRAVEL = formatPrice(travelFee("standard") ?? 0);
const REVIEWS = CITY_PROOF.edmonton.googleReviewCount;
const WEEKLY = FREQUENCIES.find((f) => f.discount === 0.2);
const BIWEEKLY = FREQUENCIES.find((f) => f.discount === 0.15);
const FOUR_WEEKS = FREQUENCIES.find((f) => f.discount === 0.1);
const pct = (discount?: number) => `${Math.round((discount ?? 0) * 100)}%`;
/**
 * One quote for a published tier on one frequency. Both halves of every worked
 * example on this page come through here, so a base price and the discounted
 * price under it can never be derived two different ways.
 */
const quoteFor = (tierIndex: number, frequency: string) => {
  const tier = PRICING_TIERS[tierIndex];
  if (!tier) return null;
  return calculateQuote({
    service: "standard",
    homeType: homeTypeOptions("standard")[0]?.id ?? null,
    bedrooms: tier.beds,
    bathrooms: tier.bathrooms,
    halfBaths: tier.halfBaths,
    addOns: [],
    frequency,
  });
};
/**
 * The exact first-visit price, not the price table's rounded label. The table
 * rounds to the dollar, so a three-bedroom billed at $232.30 shows as $232 —
 * and the page printed that rounded figure beside unrounded discounted ones.
 * A reader taking 20% off $232 got $185.60 where the page said $185.84, which
 * reads as a page that cannot do arithmetic. Same helper, both halves.
 */
const firstVisit = (tierIndex: number) => {
  const quote = quoteFor(tierIndex, "one-time");
  return quote ? formatPrice(quote.firstClean) : "";
};
/** What a visit costs from the second one on, for a published tier on a frequency. */
const ongoing = (tierIndex: number, frequency?: string) => {
  const quote = frequency ? quoteFor(tierIndex, frequency) : null;
  return quote ? formatPrice(quote.ongoing ?? quote.firstClean) : "";
};

export default function EdmontonRecurringCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      crossCity={{ city: "Calgary", to: "/calgary/recurring-cleaning/", description: "Weekly and bi-weekly cleaning schedules for Calgary homes.", linkText: "Recurring cleaning in Calgary" }}
      quoteService="recurring-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle={`Recurring Cleaning Edmonton from ${FROM} | Weekly 20% Off`}
      seoDescription={`Recurring house cleaning in Edmonton from ${FROM}: weekly 20% off, bi-weekly 15% off, every 4 weeks 10% off from the second visit. No contract.`}
      serviceName="Recurring House Cleaning in Edmonton"
      canonical="https://dutycleaners.ca/edmonton/recurring-cleaning"
      heroHeading={<>Recurring Cleaning in <AccentGold>Edmonton</AccentGold></>}
      heroSubheading={`The standard clean on a weekly, bi-weekly or every-4-weeks schedule. The first visit is charged at the one-time rate, from ${FROM} for a one-bedroom; from the second, 20% off weekly, 15% off bi-weekly and 10% off every 4 weeks.`}
      heroBadges={["Weekly 20% Off", "Bi-Weekly 15% Off", "Every 4 Weeks 10% Off"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy Edmonton living room maintained with recurring cleaning service"
      heroImageWidth={1024}
      heroImageHeight={1024}
      overviewEyebrow="Service Overview"
      overviewHeading={<>The same clean, <Accent>on a schedule.</Accent></>}
      overviewParagraphs={[
        <>
          Recurring cleaning is the <Link to="/edmonton/regular-cleaning/">standard cleaning checklist</Link>, kitchen,
          bathrooms, bedrooms and living areas, done on a weekly, bi-weekly or every-4-weeks schedule. You book once and
          the visits repeat; there is no contract, and you can change, skip or pause the schedule.
        </>,
        "The first visit is charged at the one-time rate. From the second visit on, weekly is 20% off, bi-weekly 15% off and every 4 weeks 10% off. We try to send the same team each time, and the cleaners bring all supplies and equipment.",
        "A regular cadence earns its keep here more than in most cities. Edmonton's furnace season runs from October into April, and a home that is sealed up for six months cycles dust faster than one with the windows open, so bi-weekly visits keep ahead of what settles on fans, sills and electronics. Through the winter itself, scheduled cleans keep entry mats, front halls and stair treads from grinding sanded-road grit into the floors, and when the March melt arrives the mess meets a maintained home instead of a neglected one. Weekly works best for busy households in family neighbourhoods like Summerside or Terwillegar; bi-weekly suits most homes; every 4 weeks fits condo dwellers in Oliver and Downtown whose square footage stays manageable between visits.",
      ]}
      sections={[
        {
          heading: "Weekly, bi-weekly and monthly house cleaning in Edmonton",
          body: (
            <>
              <p>
                Three schedules, one checklist. Weekly is {pct(WEEKLY?.discount)} off from the second visit and suits a
                full house: children, a dog, a kitchen that is cooked in every night. Bi-weekly is{" "}
                {pct(BIWEEKLY?.discount)} off and is what most Edmonton clients pick; two weeks is about how long a home
                holds between visits through furnace season. Every 4 weeks, what most people call monthly, is{" "}
                {pct(FOUR_WEEKS?.discount)} off and is the tier for a condo or a household of one or two that mostly
                needs the floors and bathrooms reset.
              </p>
              <p>
                It is every 4 weeks rather than the calendar month because that is how the booking system schedules it:
                13 visits a year rather than 12. Worked through on a three-bedroom, the first visit is{" "}
                {firstVisit(2)}, which the table below rounds to the nearest dollar. From the second visit each clean is{" "}
                {ongoing(2, WEEKLY?.id)} weekly, {ongoing(2, BIWEEKLY?.id)} bi-weekly or {ongoing(2, FOUR_WEEKS?.id)}{" "}
                every 4 weeks, before GST.
              </p>
            </>
          ),
        },
        {
          heading: "Who books recurring cleaning in Edmonton",
          body: (
            <>
              <p>
                Households where nobody has a weekday afternoon free. Parents in Summerside or Terwillegar who want the
                bathrooms done before the weekend. People in Oliver and Downtown condos who would rather pay for a visit
                every 4 weeks than own a mop. Anyone whose first clean should be a{" "}
                <Link to="/edmonton/deep-cleaning/">deep clean in Edmonton</Link> to clear the build-up, with the
                schedule taking over from there.
              </p>
              <p>
                Short-term rental hosts are a separate case. A turnover between guests is priced by the hour and works
                to a different checklist, so short-term rental hosts should see{" "}
                <Link to="/edmonton/airbnb-cleaning/">Airbnb cleaning in Edmonton</Link> rather than book a recurring
                plan.
              </p>
              <p>
                Leduc, Beaumont and Devon are outside Edmonton city limits, so a plan there carries a {TRAVEL} travel fee
                on each visit, shown on the quote. Each has its own page:{" "}
                <Link to="/cleaning-services-leduc/">Leduc cleaning company</Link>,{" "}
                <Link to="/cleaning-services-beaumont/">house cleaning in Beaumont</Link> and{" "}
                <Link to="/cleaning-services-devon/">house cleaners in Devon</Link>.
              </p>
            </>
          ),
        },
      ]}
      includedHeading="What Every Recurring Visit Includes"
      includedSubheading="Kitchen, bathrooms, bedrooms and living areas, every visit."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Wipe-down of countertops, sinks, stovetop, exterior appliances, and cabinet fronts. Floors mopped and vacuumed." },
        { icon: Bath, title: "Bathroom Sanitization", description: "Toilets, tubs and showers scrubbed and sanitized, soap scum off the tile and glass, mirrors and vanities polished, floors washed." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Dusting accessible surfaces, vacuuming carpets and rugs, and mopping hard flooring throughout the home." },
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
        { name: "Kitchen", tasks: 4, sample: "countertops, stovetop, and sink" },
        { name: "Bathrooms", tasks: 4, sample: "sanitizing toilets, tubs, and showers" },
        { name: "Living Areas", tasks: 4, sample: "dusting, vacuuming, and mopping" },
        { name: "Bedrooms", tasks: 3, sample: "dusting surfaces and vacuuming under beds" },
      ]}
      pricingBySize={TIERS}
      pricingNote="Rates shown are one-time standard pricing, which is what your first clean costs. From the second visit on, recurring plans save 20% weekly · 15% bi-weekly · 10% every 4 weeks."
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
        { q: "How much do I save with recurring cleaning?", a: "Your first clean is charged at the standard one-time rate. From your second visit onward you save 20% on weekly, 15% on bi-weekly and 10% on every-4-weeks cleanings, compared to one-time pricing." },
        { q: "Is every 4 weeks the same as monthly cleaning?", a: "Nearly. Every 4 weeks is 13 visits a year and a calendar month is 12, so the date drifts through the month rather than landing on the same day each time. It is the schedule most people mean by monthly cleaning, and it is 10% off from the second visit." },
        { q: "Can I change or skip a scheduled cleaning?", a: `Yes, and there is no long-term contract — you can change, skip or pause a recurring schedule at any time. We ask for at least ${POLICY.cancellationNoticeHours} hours' notice so the slot can go to someone else. Inside that window there is a ${POLICY.cancellationFee} fee, and if the team arrives and cannot get in, the visit is charged at ${POLICY.lockoutFee}.` },
        { q: "Will I have the same cleaner each visit?", a: "We do our best to send the same cleaning team for each visit so they become familiar with your home and preferences. However, in cases such as emergencies, sick days, or scheduled leave, we may send a different trusted team. If you prefer the same cleaners each time and have flexibility with scheduling, we can also adjust your appointment to a day when your regular team is available." },
        { q: "Do I need to be home during the cleaning?", a: "No. Most recurring clients provide a lockbox code, smart-lock access, or leave keys in a safe spot. We'll lock up after we're done." },
        { q: "Do I need to provide cleaning supplies?", a: "No — our team brings all cleaning supplies and equipment. If you would prefer we use specific products, tell us when you book." },
        { q: "What if I only need a single cleaning?", a: "Book a standard clean or a deep clean as a one-time visit instead. Either can be put on a schedule later, and the discount starts from the second visit." },
        { q: "Which schedule do Edmonton clients usually pick?", a: "Bi-weekly is the most common choice across the city — it keeps ahead of furnace-season dust without over-servicing a tidy home. Families in newer areas like Summerside and Windermere often move to weekly during the school year, and downtown condo clients frequently find every 4 weeks is enough. You can change cadence at any time as the seasons or your household change." },
      ]}
      closingSections={[
        {
          heading: "Recurring cleaning in Edmonton, before you commit",
          body: (
            <>
              <p>
                No contract. Change, skip or pause with {POLICY.cancellationNoticeHours} hours' notice; inside that
                window the {POLICY.cancellationFee} cancellation fee applies. The first visit is billed at the one-time
                rate, so if the house is behind, a deep clean as the opening visit and standard visits after it is the
                usual order.
              </p>
              <p>
                Our Edmonton team is rated {RATING_CLAIM}{REVIEWS ? ` across ${REVIEWS} reviews` : ""};{" "}
                <Link to="/reviews/">read the reviews</Link>. Every service with its starting price is on{" "}
                <Link to="/services/">all Edmonton cleaning services and prices</Link>, and the one-time rate for each
                home size is on <Link to="/pricing/">the full Edmonton price list</Link>.
              </p>
            </>
          ),
        },
      ]}
      ctaHeading={<>Recurring cleaning in <AccentGold>Edmonton</AccentGold> from {FROM}, <AccentGold>discounted on a schedule.</AccentGold></>}
      ctaDescription={`The first visit is charged at the one-time rate, from ${FROM} for a one-bedroom. From the second visit on, weekly is 20% off, bi-weekly 15% off and every 4 weeks 10% off. No contract; change or pause the schedule with ${POLICY.cancellationNoticeHours} hours' notice.`}
      galleryImages={[
        { src: kitchenImage, alt: "Edmonton kitchen after a recurring cleaning visit" },
        { src: livingRoomImage, alt: "Bright, consistently clean Edmonton living room" },
        { src: cleanerImage, alt: "Professional cleaner wiping surfaces in an Edmonton home" },
      ]}
    />
  );
}
