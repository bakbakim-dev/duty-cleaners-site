import { BUSINESS_TRADE_TYPE } from "@/data/proof";
import { CITY_PROOF } from "@/data/proof";
import { POLICY } from "@/data/policy";
import CityCrossLink from "@/components/CityCrossLink";
import { buildServiceSchema } from "@/lib/service-schema";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Shield, Award, DollarSign, LucideIcon, Package, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import ResponsiveImage, { SIZES } from "@/components/ResponsiveImage";
import Stars from "@/components/Stars";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import familyCleanHome from "@/assets/gallery/family-clean-home-edmonton.webp?col";
import kitchenDeepClean from "@/assets/gallery/kitchen-deep-clean.webp?card";
import bathroomClean from "@/assets/gallery/bathroom-clean.webp?card";
import livingRoomClean from "@/assets/gallery/living-room-clean.webp?card";
import moveOutClean from "@/assets/gallery/move-out-clean.webp?col";

// Animated section wrapper
import MoveOutDepth from "@/components/MoveOutDepth";
import MoveOutServiceAreas from "@/components/MoveOutServiceAreas";
import {
  moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS, GST_RATE,
} from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import {
  schemaAddressFor,
  branchGeoFor,
  BRANCH_ID,
  ORG_ID,
  EDMONTON_RATING_CLAIM,
  BRANCH_IDENTITY,
  openingHoursShortFor,
  openingHoursSpecFor,
} from "@/data/proof";

// Derived, never hand-typed (published-prices.test.ts): the cheapest
// move-in/out tier from bk-config is the honest floor.
const moveInOutFromPrice = () => moveInOutTierRows()[0]?.price ?? "";
const moveInOutTopPrice = () => moveInOutTierRows().at(-1)?.price ?? "";
const moveInOutTravelFee = () => formatPrice(travelFee("move-in-out") ?? 0);
/** The compulsory pet charge (P10), from bk-config; null if the row is ever removed. */
const MOVE_PET_FEE = addOnFromPrice("move-in-out", "must-choose-if-you-have-pets");
const REVIEWS = CITY_PROOF.edmonton.googleReviewCount;
/**
 * The worked example in the price list: a two-bedroom townhouse with a pet,
 * quoted through calculateQuote, the booking form's own maths, so the figure
 * is exact rather than the table's rounded label.
 */
const TOWNHOUSE = homeTypeOptions("move-in-out").find((o) => /townhouse/i.test(o.label)) ?? null;
const WORKED_MOVE = (() => {
  const tier = PRICING_TIERS[1];
  if (!tier || !TOWNHOUSE || MOVE_PET_FEE === null) return null;
  const total = calculateQuote({
    service: "move-in-out",
    homeType: TOWNHOUSE.id,
    bedrooms: tier.beds,
    bathrooms: tier.bathrooms,
    halfBaths: tier.halfBaths,
    addOns: ["must-choose-if-you-have-pets"],
    frequency: "one-time",
  }).firstClean;
  return {
    house: formatPrice(TOWNHOUSE.price),
    pet: formatPrice(MOVE_PET_FEE),
    beforeGst: formatPrice(total),
    withGst: formatPrice(Math.round(total * (1 + GST_RATE) * 100) / 100),
  };
})();

/**
 * Title and description are built once so the <title>, og:, twitter: and the
 * Service schema all say the same thing. The from-price is derived, so the
 * title moves when bk-config does; the width guard in onpage-seo.test.ts
 * keeps it inside a desktop snippet.
 */
/** The three-up detail-shot grid (md:grid-cols-3 in a max-w-6xl container): a third of the row from 768 px, capped by the container. */
const THREE_UP_SIZES = "(min-width: 1152px) 360px, (min-width: 768px) 33vw, 100vw";
const PAGE_TITLE = `Move Out Cleaning Edmonton from ${moveInOutFromPrice()} | Duty Cleaners`;
const META_DESCRIPTION = `Edmonton move-out and end of tenancy cleaning is priced flat by home size from ${moveInOutFromPrice()} before GST, and a miss reported within ${POLICY.guaranteeWindowHours} hours is re-cleaned free.`;

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

// Why-us card for the navy band. Static on purpose: it is text, not a link,
// so it gets no hand cursor and no hover motion.
const WhyUsCard = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) => (
  <div className="rounded-xl border border-white/20 bg-white/10 p-6 text-center">
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);

// What a move-out clean covers, room by room. Every line matches the
// move-in/out column on /whats-included/ and the add-on rows in bk-config.
// Each room carries its photo, so the checklist and the picture are one block
// rather than two card grids saying the same thing. The alt text says what is
// in the frame: these are furnished, AI-generated rooms until the real shoot.
const rooms = [
  { picture: kitchenDeepClean, alt: "Kitchen with white upper cabinets, dark lower cabinets, a stainless range hood, and a kettle and a bowl of lemons on the counter", title: "Kitchen", description: "Stovetop, grates, range hood and backsplash degreased. Counters, sink and taps scrubbed. Inside and outside the oven, microwave and fridge, and inside all cabinets and drawers." },
  { picture: bathroomClean, alt: "Cleaner in an apron and yellow rubber gloves wiping a bathroom mirror above a white sink", title: "Bathrooms", description: "Toilets, tubs and showers scrubbed. Soap scum and hard-water scale taken off tile, glass and taps. Mirrors, counters, vanities and cabinet fronts wiped, and the inside of the vanity cabinets." },
  { picture: livingRoomClean, alt: "Furnished living room with a golden retriever lying on a shag rug beside a vacuum head", title: "Living areas and bedrooms", description: "All floors vacuumed and mopped. Baseboards, doors, door frames, light switches, outlets and vent covers wiped. Window sills and tracks wiped, and closets and built-in storage cleaned inside. Ceiling fans are dusted on request, where they can be reached safely." },
];

/** ", from $X" for a move-in/out add-on, or nothing when bk-config has no such row. */
const addOnLabel = (key: string) => {
  const value = addOnFromPrice("move-in-out", key);
  return value === null ? "" : `, from ${formatPrice(value)}`;
};
// The add-ons as a plain list, each with its lowest bk-config price.
const addOns = [
  { label: "Interior windows", key: "inside-windows" },
  { label: "Window blinds by the set", key: "wipe-window-blinds-per-set" },
  { label: "Spot or full wall washing", key: "spot-cleaning-inside-walls" },
  { label: "A finished or unfinished basement", key: "unfinished-basement-sweep" },
  { label: "A sweep of the garage or balcony", key: "sweep-only-of-garage-or-balcony" },
];

// Where an inspection looks: the three lines that used to caption the photo row.
const inspectionPoints = [
  { title: "Kitchens", body: "Grease off the hood and backsplash, inside the oven and fridge, cabinets wiped out once they are empty." },
  { title: "Bathrooms", body: "Soap scum off the glass, scale off the taps, tile and grout scrubbed, the toilet inside and out." },
  { title: "Rooms and closets", body: "Baseboards, vents, switches and the inside of the closets, then the floors last so nobody walks on them." },
];

// One verifiable fact per card. Sources: policy.ts (insuranceClaim,
// guaranteeRequiresPhotos, ecoProductsFee, PAYMENT_TERMS, SERVICE_TERMS)
// and pricing.ts (flat rate by size).
const whyUsItems = [
  { icon: Shield, title: "Reference-checked, rated after every visit", description: "Every cleaner is reference-checked before their first job and rated by the customer after every visit. Those ratings decide who we keep sending." },
  // This grid is where the two terms the page used to repeat on every screen
  // are actually stated: the flat rate, and the re-clean window. The window is
  // in the card title, so the description does not say the number again.
  { icon: DollarSign, title: "Set price by home size", description: "The price is set by bedrooms and bathrooms when you book, for an empty home in the condition you describe." },
  { icon: Award, title: `${POLICY.guaranteeWindowHours}-hour re-clean`, description: `Walk through the home within ${POLICY.guaranteeWindowHours} hours of the clean and tell us anything missed, and we return to put it right at no charge. The window runs from the clean, not the inspection, so book the clean as close to the inspection as you can. Photos help but are not required.` },
  { icon: Package, title: "Supplies included", description: "The crew brings the products, the vacuum and the step ladder. You need the water left on, and power for the vacuum." },
  { icon: Package, title: `Alternative products for ${POLICY.ecoProductsFee}`, description: `Optional alternative products are available for ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.` },
  { icon: Clock, title: "Pay after the clean", description: "Nothing is charged when you book. A temporary hold goes on your card the day before, and the charge goes through once the clean is complete." },
];

// Feeds the FAQPage schema as well as the accordion. Every figure is derived.
const faqs = [
  { q: "How much does move out cleaning cost in Edmonton?", a: `A move-out clean is ${moveInOutFromPrice()} for a one-bedroom apartment or condo and ${moveInOutTopPrice()} for a home with five bedrooms, before 5% GST. The price is fixed by bedrooms and bathrooms when you book, and a bungalow or basement suite, a townhouse or a two-storey house adds a home-type charge${MOVE_PET_FEE !== null ? `; a home with pets adds ${formatPrice(MOVE_PET_FEE)}, which is compulsory` : ""}. Add-ons such as interior windows or a finished basement are priced on the booking form, and addresses outside Edmonton city limits carry a ${moveInOutTravelFee()} travel fee.` },
  { q: "How long does a move out clean take?", a: "It depends on the size and condition of the home, which must be empty. The price is set by home size for the condition you describe, and if it needs much more work than that, we agree any extra charge with you before doing it. You get an arrival window when you book rather than an exact time." },
  { q: "Do I need to be there?", a: `No. Most customers leave a key in a lockbox or with the property manager, or give us a buzzer code. We lock up when we finish. If the crew arrives and cannot get in, the lockout fee is ${POLICY.lockoutFee}, so check that the access you give us works.` },
  { q: "Are the oven and fridge interiors included?", a: "Yes. Inside the oven, fridge and microwave, and inside all cabinets, drawers and closets, are part of a move-out clean at no extra charge. On a standard or deep clean they are add-ons; on a move-out they are the point of the service. The crew does not move anything over 25 pounds, so the oven and fridge stay where they are." },
  { q: "What if the landlord finds something at the inspection?", a: `Tell us within ${POLICY.guaranteeWindowHours} hours of the clean and we come back to put it right at no charge. The window runs from the clean, not the inspection, so book the clean as close to the inspection as you can. Photos help but are not a condition. We cannot decide what a landlord does with the deposit, so the promise is the re-clean, not the deposit.` },
  { q: "Can you clean the same day I hand over the keys?", a: "Same-day and next-day slots depend on the schedule, so book as soon as you have the handover date. The team arrives in a booked window, 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM, rather than at an exact time. The safer plan is the day before the handover, which leaves time for a walkthrough of your own." },
  // Was "the home must be fully empty", which contradicted the graduated answer
  // on /faqs/ — the one that is actually the policy. A few pieces of furniture
  // are fine; a fully furnished home is a deep clean, not a move-out.
  { q: "What should I do before you arrive?", a: "Take your belongings out, including whatever is in the cabinets and closets, because a move-out is priced to clean inside them. Leave the water and power on until the clean is done; running water is required, and the vacuum needs electricity. A few pieces of furniture are fine. A fully furnished home with full cupboards is booked as a deep clean instead, and we will say so rather than turn up and improvise." },
  { q: "Do you do move-in cleaning too?", a: "Yes. Move-in cleaning is the same checklist on the home you are moving into, and the time to book it is the gap between getting the keys and the moving truck, while the rooms are empty. It is priced the same way, by home size, plus 5% GST." },
  { q: "Is there a travel fee?", a: `Not inside Edmonton city limits. Outside them, including Sherwood Park, St. Albert, Spruce Grove, Leduc and Beaumont, a ${moveInOutTravelFee()} travel fee is added to the booking.` },
  { q: "What is the cancellation policy?", a: `Give us ${POLICY.cancellationNoticeHours} hours' notice to cancel or move a booking at no charge. Inside ${POLICY.cancellationNoticeHours} hours the fee is ${POLICY.cancellationFee}. If we have to move a booking, there is no fee to you and we offer the earliest slot we have.` },
];

export default function EdmontonMoveInOut() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /**
   * The branch node. It carried the hours because buildServiceSchema did not
   * model them; since 2026-09-11 that builder publishes them too, from the
   * same proof.ts helper, so the two agree. It reuses BRANCH_ID so it merges into
   * the existing Edmonton entity rather than declaring a second, anonymous
   * business under a different name.
   *
   * The address and the price range were both hardcoded here. The address is
   * now read from proof.ts and the range derived from bk-config, because a
   * hand-typed "$284-$539+" is exactly the kind of figure that stays put while
   * the real prices move.
   */
  const moveRows = moveInOutTierRows();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: BUSINESS_TRADE_TYPE,
    "@id": BRANCH_ID.edmonton,
    name: BRANCH_IDENTITY.edmonton.name,
    telephone: CITY_PROOF.edmonton.phoneE164,
    email: "support@dutycleaners.ca",
    address: schemaAddressFor("edmonton"),
    // The office pin, matching the address (data/proof.ts).
    geo: branchGeoFor("edmonton"),
    url: BRANCH_IDENTITY.edmonton.url,
    /* No priceRange here. This node shares BRANCH_ID with the hub, which
       publishes the site-wide band, and a second value on the same @id made
       one business advertise two different ranges. The move-out band belongs
       to the SERVICE, and the price list below renders the tier table. */
    openingHours: openingHoursShortFor("edmonton"),
    openingHoursSpecification: openingHoursSpecFor("edmonton"),
    parentOrganization: { "@id": ORG_ID },
  };

  // The FAQ section below renders these ten Q&As — this mirrors them so the
  // FAQPage schema matches visible content exactly.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/move-out-cleaning-edmonton/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/move-out-cleaning-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        {/* The five tiers the price table below prints, as Offers. The page
            published a whole price list and declared none of it, so a rich
            result had nothing to show and an assistant asked what a move-out
            costs in Edmonton had to guess. Rows come straight from
            moveInOutTierRows(), so the markup cannot drift from the table. */}
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({
            name: "Move Out and Move In Cleaning",
            description: META_DESCRIPTION,
            path: "/move-out-cleaning-edmonton",
            city: "edmonton",
            offerCatalog: {
              name: "Move-out cleaning by home size",
              rows: moveInOutTierRows().map((row) => ({
                name: row.beds,
                price: row.price,
                assumption: row.assumption,
              })),
            },
          }))}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="edmonton" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero: the H1, one price sentence, the two buttons and the rating.
            The definition paragraph that sat here opens the section below, and
            the charges outside the from-price sit in the strip under the hero. */}
        <section className="relative bg-brand-navy text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  Move Out Cleaning in Edmonton
                </h1>
                <p className="text-lg md:text-xl mb-8 text-white/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  From {moveInOutFromPrice()} before GST for a one-bedroom apartment or condo, fixed by home size
                  before you book, and nothing is charged until the clean is done.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-14" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 text-lg px-8 h-14" asChild>
                    <a href="tel:7809136565">
                      <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />
                      Call (780) 913-6565
                    </a>
                  </Button>
                </div>

                <p className="flex items-center justify-center lg:justify-start gap-2 text-white/90">
                  <Stars size={1} />
                  <span className="font-medium">{EDMONTON_RATING_CLAIM}{REVIEWS ? `, ${REVIEWS} reviews` : ""}</span>
                </p>
              </div>

              <div className="flex-shrink-0">
                <ResponsiveImage
                  picture={familyCleanHome}
                  sizes={SIZES.half}
                  alt="Two adults and two small children laughing on the hardwood floor of a bright living room with a grey sofa"
                  className="lg:w-[500px] w-full rounded-xl shadow-2xl"
                 loading="eager" fetchPriority="high"/>
              </div>
            </div>
          </div>
        </section>

        {/* Slim strip under the hero: the guarantee, and the charges that sit
            outside the from-price, so the figure above never stands alone. */}
        <div className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-4">
            <ul className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-center lg:justify-start gap-x-8 gap-y-2 text-sm">
              <li className="flex items-center gap-2 text-foreground">
                <span className="dc-icon dc-icon-circle-check w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
                <span className="font-medium">{POLICY.guaranteeWindowHours}-hour re-clean guarantee</span>
              </li>
              <li className="text-muted-foreground">A house, a pet or an address outside Edmonton adds its own line to the quote.</li>
            </ul>
          </div>
        </div>

        {/* What's included: the definition, then each room's photo with its
            checklist, the add-ons as a list, and where an inspection looks. */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="display-serif text-3xl md:text-4xl font-bold">What a move-out clean in Edmonton includes</h2>
              {/* The answer to the search: what it is, what is in it and how
                  to book. It sat in the hero and pushed the buttons below the
                  fold; it is still the first thing under it. */}
              <p className="text-base md:text-lg mt-5 text-muted-foreground leading-relaxed">
                A move-out clean, which a landlord calls end of tenancy cleaning, is the one-time clean an
                empty home gets before the keys change hands, done to the checklist a landlord or buyer walks
                through. Inside the oven, fridge,
                microwave, cabinets, drawers and closets are included, along with baseboards, switches,
                vents and all floors. Book it with the home size and the date the keys go back. The
                emptier the rooms are on the day, the more of that list the crew can reach.
              </p>
            </div>
            <AnimatedSection>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {rooms.map((room) => (
                  <div key={room.title}>
                    <ResponsiveImage picture={room.picture} sizes={THREE_UP_SIZES} alt={room.alt} className="w-full h-64 object-cover rounded-xl" loading="lazy" />
                    <h3 className="text-lg font-bold mt-4 mb-2">{room.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{room.description}</p>
                  </div>
                ))}
              </div>

              <div className="max-w-3xl mx-auto mt-12">
                <h3 className="text-lg font-bold mb-3">Add-ons on the booking form</h3>
                <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-5 text-muted-foreground">
                  {addOns.map((addOn) => (
                    <li key={addOn.key}>{addOn.label}{addOnLabel(addOn.key)}</li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Each has its own price on the booking form and is added only if you choose it. Add-on
                  prices are before 5% GST.
                </p>
              </div>

              <div className="max-w-3xl mx-auto mt-12 border-t border-border pt-10">
                <h2 className="display-serif text-2xl md:text-3xl font-bold mb-4">Where a move-out inspection looks</h2>
                <dl className="space-y-3 text-muted-foreground leading-relaxed">
                  {inspectionPoints.map((point) => (
                    <div key={point.title}>
                      <dt className="inline font-semibold text-foreground">{point.title}: </dt>
                      <dd className="inline">{point.body}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <p className="text-sm text-muted-foreground max-w-3xl mx-auto mt-8 text-center leading-relaxed">
                Not included: exterior windows, carpet steam cleaning, furnace and duct cleaning, anything
                beyond the reach of a 3-step ladder, and moving anything over 25 pounds. Garages and balconies
                are a sweep of the floor only, booked as an add-on and offered mostly in summer, when the
                weather allows. Marks on the paint are a separate row on
                the same form: what a wash takes off, and what it costs by home size, is on{" "}
                <Link to="/wall-washing-wall-cleaning/" className="text-primary underline underline-offset-4">wall washing in Edmonton</Link>.
                The full list is on{" "}
                <Link to="/whats-included/" className="text-primary underline underline-offset-4">what's included</Link>.
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Price list — rendered here rather than by MoveOutDepth so the heading
            carries the cost query and the travel-fee line sits beside the table. */}
        {/* id="quote": the instant-price overlay intercepts every #quote link. Without
            JavaScript the same link now lands here, on the prices. */}
        <section id="quote" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">Move out cleaning cost in Edmonton</h2>
                <p className="text-muted-foreground leading-relaxed">
                  The move-out cleaning price list, before 5% GST. Each row assumes the bathroom count a home
                  that size usually has; a third bathroom in a two-bedroom moves the figure, and the quote
                  shows it.
                </p>
              </div>

              <div className="mx-auto mt-10 max-w-2xl overflow-hidden border border-border">
                <table className="w-full">
                  <thead className="bg-brand-navy text-brand-navy-foreground">
                    <tr>
                      <th className="py-3 px-5 text-left text-sm font-bold">Home size</th>
                      <th className="py-3 px-5 text-left text-sm font-bold">Bathrooms assumed</th>
                      <th className="py-3 px-5 text-right text-sm font-bold">Starting price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moveRows.map((r, i) => (
                      <tr key={r.beds} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                        <td className="py-3 px-5 text-foreground">{r.beds}</td>
                        <td className="py-3 px-5 text-sm text-muted-foreground">{r.assumption.replace("Assumes ", "")}</td>
                        <td className="py-3 px-5 text-right font-bold text-foreground">from {r.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground leading-relaxed">
                The table rounds each apartment or condo rate to the nearest dollar. Your instant
                quote uses the exact price including cents, then adds any applicable items below.
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground leading-relaxed">
                The price moves with the number of bedrooms and bathrooms, the home type, any pets, the
                add-ons you choose such as interior windows or a finished basement, and a{" "}
                {moveInOutTravelFee()} travel fee for addresses outside Edmonton city limits. It does not move
                with how long the crew is there, and your quote lists each line before you book.
              </p>
              {WORKED_MOVE && (
                <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground leading-relaxed">
                  Take a two-bedroom townhouse with a cat, inside the city limits. The two-bedroom rate, which
                  the price list rounds to {moveRows[1]?.price}, the {WORKED_MOVE.house} townhouse charge and the{" "}
                  {WORKED_MOVE.pet} pet charge come to {WORKED_MOVE.beforeGst} before GST, and{" "}
                  {WORKED_MOVE.withGst} once 5% GST is added.
                </p>
              )}
              <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground leading-relaxed">
                The travel fee covers the towns around the city, so{" "}
                <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-4">house cleaning in Sherwood Park</Link>,{" "}
                <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-4">house cleaning in St. Albert</Link> and{" "}
                <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-4">house cleaning in Leduc</Link>{" "}
                are the same rows plus the travel fee. If the home is staying lived in rather than
                being handed back, the rows for{" "}
                <Link to="/edmonton/regular-cleaning/" className="text-primary underline underline-offset-4">a standard house clean in Edmonton</Link>{" "}
                sit beside these on{" "}
                <Link to="/pricing/" className="text-primary underline underline-offset-4">the full Edmonton price list</Link>.
              </p>
              {/* What the quote asks for, folded in from the "Get Started" band
                  that repeated the hero's button one screen below it. */}
              <div className="mx-auto mt-10 max-w-2xl text-center">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Enter the bedrooms, the bathrooms, the home type and the date you hand over the keys. The
                  quote lists every add-on you tick, the pet charge if the home has pets, and the travel fee
                  if the address sits outside the city, so the figure on screen is the whole figure before
                  5% GST.
                </p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-14" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
                {/* Was "No credit card required", which read as a promise about
                    the booking. PAYMENT_TERMS puts a temporary hold on the card
                    the day before the clean, so the true version of the claim is
                    about the quote: seeing the price costs nothing. */}
                <p className="text-sm text-muted-foreground mt-4">
                  Instant pricing, no phone call required, and no card needed to see your price.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <MoveOutDepth city="Edmonton" showPricing={false} />

        {/* Why Choose Us — Dark */}
        <section className="py-16 bg-brand-navy relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-12">
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-white">The terms of a move-out booking in Edmonton</h2>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => (
                  <WhyUsCard key={i} icon={item.icon} title={item.title} description={item.description} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Move-in cleaning */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatedSection>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="rounded-xl overflow-hidden">
                  <ResponsiveImage picture={moveOutClean} sizes={SIZES.half} alt="Made bed with white linen and a tufted headboard between two white nightstands with lamps" className="w-full h-[420px] object-cover" loading="lazy" />
                </div>
                <div>
                  <span className="text-accent font-semibold text-sm uppercase tracking-wide">Move-in cleaning</span>
                  <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Move-in cleaning for the home you are moving into</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Move-in cleaning is the same checklist run on the home you are moving into, before the
                    boxes arrive. An empty home is the only time the inside of the cabinets, the closet shelves
                    and the floor along the baseboards are all reachable at once, so it is done before the
                    furniture goes in. Book it for the gap between getting the keys and the moving truck if
                    you can.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Same flat rate by home size as a move-out, plus 5% GST</span></li>
                    <li className="flex items-start gap-2"><span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Inside the oven, fridge, microwave, cabinets, drawers and closets included</span></li>
                    <li className="flex items-start gap-2"><span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Leaving one home and taking the keys to another: book both, each priced by its own size</span></li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* End of tenancy: the inspection, the deposit, and Edmonton's turnover calendar */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <AnimatedSection>
              <div className="text-center mb-8">
                {/* The city belongs in the heading: this page targets "end of
                    tenancy cleaning edmonton" and the H2 that owned the phrase
                    named no place at all. */}
                <h2 className="display-serif text-3xl md:text-4xl font-bold">End of tenancy cleaning in Edmonton and your damage deposit</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  We do not promise the deposit comes back; that decision is the landlord's. What we promise is
                  the checklist: inside the oven and fridge, inside the cabinets, drawers and closets, baseboards,
                  switches, vents, window sills and tracks, bathrooms scrubbed, and the floors mopped last.
                </p>
                <p>
                  End of tenancy cleaning in Edmonton is judged at the move-out inspection. Under{" "}
                  <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's Residential Tenancies Act</a> the landlord completes a move-out inspection report with
                  the tenant. Within 10 days of the tenant moving out, the landlord must return the security
                  deposit (the damage deposit in everyday use), or return what is left with a written statement
                  of any deductions (an estimate is allowed, with the final statement within 30 days). That report is where a landlord notes cleaning, so
                  our <strong>move out cleaners in Edmonton</strong> clean to the inspection checklist.
                </p>
                <p>
                  A spring move-out in Edmonton meets the whole winter at once. The sand and salt tracked in
                  since November arrive dry and stay, so by handover they are worked into the carpet edges and
                  along the baseboards by the door, and the spring melt in late March and April brings the rest
                  in over about three weeks. A house with the furnace running since October has cycled its dust
                  onto the vent covers and the tops of the door frames, and hard Alberta water leaves scale on
                  the taps and the shower glass. Each of those is a room and a surface, the kind of line a
                  move-out inspection report can carry, and each is on the move-out checklist.
                </p>
                <p>
                  {/* L8: /edmonton/march-out-cleaning/ had one contextual link into
                      it from the whole site. This page is where the reader who
                      needs it actually is. */}
                  Families leaving military housing in Edmonton are held
                  to a CFHA march-out inspection instead of a landlord's walkthrough. What CFHA's checklist
                  asks for, and how the clean is booked around the inspection date, is set out on{" "}
                  <Link to="/edmonton/march-out-cleaning/" className="text-primary underline underline-offset-4">march-out cleaning in Edmonton</Link>.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Apartments, condos and houses */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <AnimatedSection>
              <div className="text-center mb-8">
                <h2 className="display-serif text-3xl md:text-4xl font-bold">Move-out cleaning for Edmonton apartments, condos and houses</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  <strong className="text-foreground">Apartment move out cleaning.</strong> Tell us how the crew
                  gets in: a buzzer code, a fob, or a key left with the building manager. Where the building
                  books the elevator or limits parkade access to a move-out window, give us the times and the
                  arrival window is booked to fit them where the schedule allows. The price is set by bedroom
                  count, so a one-bedroom apartment is the first row on the price list.
                </p>
                <p>
                  <strong className="text-foreground">Condos.</strong> The same checklist and the same access
                  questions. In-suite laundry machines are wiped down on the outside. A balcony is a sweep
                  only, added on the booking form, and the railings and outside glass are not cleaned.
                </p>
                <p>
                  <strong className="text-foreground">Houses and basement suites.</strong> A bungalow or a
                  basement suite, a townhouse or a two-storey house adds a home-type charge to the apartment
                  row, and a finished basement under a house is an add-on on the booking form. A garage is a
                  sweep of the floor only. If a basement suite is changing hands on its own, book it at its
                  own size, as a basement suite. A house that is still furnished,
                  with the cupboards full, is booked as{" "}
                  <Link to="/edmonton/deep-cleaning/" className="text-primary underline underline-offset-4">a deep clean in Edmonton</Link>{" "}
                  instead.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ: the shared accordion, as on the Calgary twin. It force-mounts
            every answer, so the FAQPage schema matches crawlable content. */}
        <section className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <AnimatedSection>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-10">Move-out cleaning questions</h2>
            </AnimatedSection>
            <AnimatedSection>
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, i) => (
                  <AccordionItem key={faq.q} value={`item-${i}`} className="bg-white rounded-xl px-6 border border-border">
                    <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </AnimatedSection>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6">
                Book move-out cleaning in Edmonton
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                From {moveInOutFromPrice()} plus 5% GST for a one-bedroom apartment or condo. Give us the home
                size, the home type and the handover date, and the quote adds any pet or travel charge before
                you book. If the new address needs a clean too, or{" "}
                <Link to="/edmonton/recurring-cleaning/" className="text-white underline underline-offset-4">a recurring clean in Edmonton</Link>{" "}
                once you are in,{" "}
                <Link to="/services/" className="text-white underline underline-offset-4">all Edmonton cleaning services and prices</Link>{" "}
                are on one page.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="#quote">
                    See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (780) 913-6565
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <MoveOutServiceAreas city="Edmonton" />

      </main>

        <section className="pb-16">

          <div className="container mx-auto px-4">

            <CityCrossLink city="Calgary" to="/move-out-cleaning-calgary/" description="Move-out and move-in cleaning for Calgary homes and rentals." />

          </div>

        </section>

        <Footer hasQuoteSection />
      </div>
    </>
  );
}
