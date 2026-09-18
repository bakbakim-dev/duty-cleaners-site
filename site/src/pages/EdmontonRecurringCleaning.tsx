import { Link } from "react-router-dom";
import { POLICY } from "@/data/policy";
import ServiceDetailPage from "@/components/ServiceDetailPage";
import {
  standardTierRows, featuredExtraRows, formatPrice, calculateQuote, homeTypeOptions, PRICING_TIERS, FREQUENCIES,
  addOnFromPrice, GST_RATE,
} from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { Accent } from "@/components/Accent";
import RecurringVisitPrices from "@/components/RecurringVisitPrices";
import { Home, Bath, UtensilsCrossed } from "lucide-react";
import heroImage from "@/assets/gallery/family-clean-home-edmonton.webp";
import kitchenImage from "@/assets/gallery/summerside-cleaner-home.webp?card";
import livingRoomImage from "@/assets/gallery/glenora-cleaner-living-room.webp?card";
import cleanerImage from "@/assets/gallery/westmount-cleaner-kitchen.webp?card";

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
/** The compulsory pet charge on a one-time visit (P10), from bk-config. */
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
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
/** The same ongoing figure with 5% GST added, for the worked example. */
const ongoingWithGst = (tierIndex: number, frequency?: string) => {
  const quote = frequency ? quoteFor(tierIndex, frequency) : null;
  const value = quote ? quote.ongoing ?? quote.firstClean : null;
  return value === null ? "" : formatPrice(Math.round(value * (1 + GST_RATE) * 100) / 100);
};

export default function EdmontonRecurringCleaning() {
  return (
    <ServiceDetailPage
      city="edmonton"
      crossCity={{ city: "Calgary", to: "/calgary/recurring-cleaning/", description: "Weekly and bi-weekly cleaning schedules for Calgary homes.", linkText: "Recurring cleaning in Calgary" }}
      quoteService="recurring-cleaning"
      phone="(780) 913-6565"
      phoneHref="tel:7809136565"
      seoTitle="Weekly & Biweekly Cleaning Edmonton | Duty Cleaners"
      seoDescription="Compare weekly, biweekly and every-four-weeks cleaning in Edmonton. Understand first-visit pricing and ongoing service before choosing a schedule."
      serviceName="Recurring House Cleaning in Edmonton"
      canonical="https://dutycleaners.ca/edmonton/recurring-cleaning"
      heroHeading={<>Recurring House Cleaning in <em className="italic text-accent-on-dark">Edmonton</em></>}
      heroSubheading={`Weekly, bi-weekly or every-4-weeks visits from ${FROM} before GST for a one-bedroom apartment or condo, ${pct(FOUR_WEEKS?.discount)} to ${pct(WEEKLY?.discount)} off from the second visit. You pay after each clean.`}
      heroBadges={["Weekly 20% Off", "Bi-Weekly 15% Off", "Every 4 Weeks 10% Off"]}
      heroImage={heroImage}
      heroImageAlt="Bright, tidy living room kept up by a recurring clean"
      heroImageWidth={1024}
      heroImageHeight={1024}
      overviewHeading={<>The same clean, <Accent>on a schedule.</Accent></>}
      overviewParagraphs={[
        <>
          Each visit follows the <Link to="/edmonton/regular-cleaning/">standard cleaning checklist</Link>: kitchen,
          bathrooms, bedrooms and living areas. You book once, and the visits repeat on the schedule you picked until
          you change it.
        </>,
        "The first visit is charged at the one-time rate, and the schedule discount starts with the second. Each visit goes to your regular team where we can send them, and the cleaners bring all the supplies and equipment.",
        <>
          Choose an interval around how much upkeep your household wants help with. Weekly visits may suit a busy
          kitchen or frequently used rooms; biweekly leaves more upkeep to you between visits; every four weeks may
          suit a lightly used home. These are options to try, not rules based on bedroom count or neighbourhood. Our
          guide to <Link to="/how-often-should-a-cleaning-service-clean-my-house/">how often a cleaning service should clean your house</Link> works through that choice room by room.
        </>,
      ]}
      // The schedule-and-price section stays above the checklist. "Who books"
      // reads after the FAQ, with the other closing prose, so the page reaches
      // the checklist and the price grid sooner.
      sections={[
        {
          heading: "Choose weekly, biweekly or every-four-weeks cleaning in Edmonton",
          body: (
            <>
              <p>
                There are three schedules and one checklist. Weekly is {pct(WEEKLY?.discount)} off from the second visit
                and offers the shortest gap between cleans. Bi-weekly is{" "}
                {pct(BIWEEKLY?.discount)} off and leaves more upkeep to you between visits.
                Every 4 weeks is {pct(FOUR_WEEKS?.discount)} off and means fewer paid visits,
                but more time for dirt to build up. Choose around your rooms' condition,
                your own cleaning routine and budget, then adjust if the interval is not working.
              </p>
              <p>
                The tier is every 4 weeks rather than the calendar month because that is how the booking system
                schedules it: 13 visits a year rather than 12, with the date moving through the month. Worked through on
                a three-bedroom apartment or condo, the first visit is {firstVisit(2)} before GST, the exact figure that
                price lists round to the nearest dollar. From the second visit each clean is {ongoing(2, WEEKLY?.id)}{" "}
                weekly, {ongoing(2, BIWEEKLY?.id)} bi-weekly or {ongoing(2, FOUR_WEEKS?.id)} every 4 weeks, before GST;
                on the bi-weekly plan that is {ongoingWithGst(2, BIWEEKLY?.id)} a visit once 5% GST is added.
              </p>
              <RecurringVisitPrices
                tiers={[0, 3]}
                caption="Each Edmonton visit on a schedule, for the smallest home and a four-bedroom, at the apartment or condo rate before GST. The first visit is the one-time rate."
              />
              <p>
                Those figures are for an apartment or condo. A bungalow, townhouse or two-storey house costs more on
                every visit, and a home with pets carries the compulsory pet charge; the quote shows both before you
                book, for the first visit and for the visits after it.
              </p>
            </>
          ),
        },
      ]}
      closingSections={[
        {
          heading: "Who books recurring cleaning in Edmonton",
          body: (
            <>
              <p>
                Recurring cleaning suits a household with no weekday afternoon to spare: parents who want the bathrooms
                done before the weekend, or a couple in a condo who would rather pay for a visit every 4 weeks than give a
                Saturday to the floors. A home that is behind should start with a{" "}
                <Link to="/edmonton/deep-cleaning/">deep clean in Edmonton</Link> to clear the build-up, and the schedule
                takes over from there.
              </p>
              <p>
                Short-term rental hosts are a separate case. A turnover between guests is priced by the hour and works
                to a different checklist, so a host is better served by{" "}
                <Link to="/edmonton/airbnb-cleaning/">Airbnb cleaning in Edmonton</Link> than by a recurring plan.
              </p>
              <p>
                Leduc, Beaumont and Devon are outside Edmonton city limits, so a plan there carries the {TRAVEL} travel
                fee, shown on the quote. Each has its own page:{" "}
                <Link to="/cleaning-services-leduc/">Leduc cleaning company</Link>,{" "}
                <Link to="/cleaning-services-beaumont/">house cleaning in Beaumont</Link> and{" "}
                <Link to="/cleaning-services-devon/">house cleaners in Devon</Link>.
              </p>
            </>
          ),
        },
        { heading: "Changing or rescheduling your visits", body: <><p>Move, skip or cancel a visit with {POLICY.cancellationNoticeHours} hours' notice. Inside that window the cancellation fee is {POLICY.cancellationFee}. If we move a booking and the new date does not suit you, cancelling that booking carries no fee.</p><p>Read the <Link to="/terms/">booking and cancellation terms</Link>, and tell the Edmonton office if your access instructions or room preferences change.</p></> },
        { heading: "Does your first visit need a deep clean?", body: <p>Describe the condition of the home before choosing the first visit. Compare <Link to="/edmonton/deep-cleaning/">deep cleaning in Edmonton</Link> when the extra tasks are needed; a deep clean is not automatically required just because you want a recurring schedule.</p> },
        {
          heading: "Recurring cleaning in Edmonton, before you commit",
          body: (
            <>
              <p>
                Nothing is charged when you book: the card gets a temporary hold the day before each visit, which can
                look like a charge in a banking app although no money moves, and it is charged once the clean is
                complete. The first visit is billed at the one-time rate, so if the house is behind, a deep clean as the
                opening visit and standard visits after it is the sensible order.
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
      includedHeading="What every recurring visit includes"
      includedSubheading="Kitchen, bathrooms, bedrooms and living areas, every visit."
      included={[
        { icon: UtensilsCrossed, title: "Kitchen Cleaning", description: "Wipe-down of countertops, sinks, stovetop, exterior appliances, and cabinet fronts. Floors mopped and vacuumed." },
        { icon: Bath, title: "Bathrooms", description: "Toilets, tubs and showers scrubbed, soap scum off the tile and glass, mirrors and vanities polished, floors washed." },
        { icon: Home, title: "Bedrooms & Living Areas", description: "Dusting accessible surfaces, vacuuming carpets and rugs, and mopping hard flooring throughout the home." },
      ]}
      bullets={[
        "Kitchen, bathrooms, and living areas cleaned",
        "Floors vacuumed and mopped",
        "Dusting of all accessible surfaces and furniture",
        "Bathrooms scrubbed and wiped down",
        "Mirrors and glass surfaces polished",
        "Trash emptied",
      ]}
      pricingBySize={TIERS}
      pricingNote="Rates shown are the one-time standard price, which is what the first clean costs. The schedule discount applies from the second visit."
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
      ]}
      faqs={[
        { q: "How much do I save with recurring cleaning?", a: `The first clean is charged at the one-time rate. From the second visit on, weekly saves ${pct(WEEKLY?.discount)}, bi-weekly ${pct(BIWEEKLY?.discount)} and every 4 weeks ${pct(FOUR_WEEKS?.discount)} against that rate. On a one-bedroom apartment or condo, that is ${firstVisit(0)} for the first visit and ${ongoing(0, BIWEEKLY?.id)} a visit bi-weekly after it, before GST. A bungalow, townhouse or two-storey house, a pet, or an address outside Edmonton city limits adds its own charge, and the quote shows each one.` },
        { q: "Is every 4 weeks the same as monthly cleaning?", a: `Nearly. Every 4 weeks is 13 visits a year and a calendar month is 12, so the date drifts through the month rather than landing on the same day each time. Many people mean this schedule when they ask for monthly cleaning, and it is ${pct(FOUR_WEEKS?.discount)} off from the second visit.` },
        { q: "Can I change or skip a scheduled cleaning?", a: `Yes. Any visit on the schedule can be moved or cancelled with ${POLICY.cancellationNoticeHours} hours' notice at no charge, and the schedule itself can be changed or stopped the same way. Inside ${POLICY.cancellationNoticeHours} hours the fee is ${POLICY.cancellationFee}. If we have to move a visit, because a cleaner is ill or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have.` },
        { q: "Will I have the same cleaner each visit?", a: "We send your regular team where we can send them. Illness, leave and the schedule sometimes mean a different team. Every cleaner is reference-checked before a first job and rated by the customer after each visit, and those ratings decide who we keep sending." },
        { q: "Do I need to be home during the cleaning?", a: `No. Most customers on a schedule leave a key, a lockbox code or smart-lock access, and the team locks up after each visit. If the code changes between visits, tell us, because a team that arrives and cannot get in is a lockout, charged at ${POLICY.lockoutFee}.` },
        { q: "Do I need to provide cleaning supplies?", a: `No. The team brings all the supplies and equipment to every visit. The home needs running water, and without electricity the vacuuming may not be possible. Optional alternative products are available for ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.` },
        ...(PET_FEE !== null
          ? [{ q: "Is there a charge for pets on a recurring plan?", a: `Yes. A home with pets carries a compulsory pet charge, ${formatPrice(PET_FEE)} on a one-time visit, and the quote shows it before you book, for the first visit and for the visits after it. Tell us about the pets on the booking so the team knows who it will meet.` }]
          : []),
        { q: "What if I only need a single cleaning?", a: "Book a standard clean or a deep clean as a one-time visit instead. Either can be put on a schedule later, and the discount starts from the second visit." },
        { q: "Which schedule suits an Edmonton home?", a: `Choose by how quickly the rooms need attention and how much cleaning you do between visits. Weekly may suit a busy household, biweekly regular help alongside your own upkeep, and every four weeks a lighter-use home. You can adjust the schedule with ${POLICY.cancellationNoticeHours} hours' notice as your needs change.` },
      ]}
      ctaHeading={<>Recurring cleaning in <em className="italic text-accent-on-dark">Edmonton</em> from {FROM}, <em className="italic text-accent-on-dark">discounted on a schedule.</em></>}
      ctaDescription={`The first visit is charged at the one-time rate, from ${FROM} for a one-bedroom apartment or condo before GST, and the schedule discount starts with the second. The quote adds any home-type, pet or travel charge before you book.`}
      galleryImages={[
        { picture: kitchenImage, alt: "Kitchen after a recurring cleaning visit" },
        { picture: livingRoomImage, alt: "Bright, consistently clean living room" },
        { picture: cleanerImage, alt: "Professional cleaner wiping surfaces in a home" },
      ]}
    />
  );
}
