import { ServiceCard, WhyUsCard, QuoteReceipt } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import {
  CITY_PROOF } from "@/data/proof"; import { EDMONTON_RATING_CLAIM, COMPANY } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, CalendarCheck, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import fortSaskKitchen from "@/assets/gallery/fort-saskatchewan-kitchen-clean.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS } from "@/data/pricing";
import { travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

import LocationPricing from "@/components/LocationPricing";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

// Every figure on this page is derived from bk-config or policy.ts.
const STANDARD = standardTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TOP = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = deepCleanTierRows()[0].price;
const MOVE = moveInOutTierRows();
const MOVE_FROM = MOVE[0].price;
const MOVE_TOP = MOVE[MOVE.length - 1].price;
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
// Post-construction carries its own travel-fee row in bk-config, at a higher amount.
const PC_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
// Charged for you rather than chosen, and charged inside the city too.
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const HOME_TYPE = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
const EDMONTON_LISTING = GOOGLE_LISTINGS.edmonton;

const PAGE_TITLE = `House Cleaning Fort Saskatchewan | Duty Cleaners`;
const PAGE_DESCRIPTION = `Fort Saskatchewan cleans start at ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// three-bedroom two-storey house on a move-in clean, outside city limits. The
// table rounds each size to the dollar, so no total is built from a table card.
const EXAMPLE_SIZE = PRICING_TIERS[2];
const EXAMPLE_TIER = MOVE[2];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "move-in-out", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("move-in-out")[0]?.id ?? null));
// The table card rounds to the dollar; the receipt says so when the two differ.
const EXAMPLE_TABLE_NOTE = EXAMPLE_BASE === EXAMPLE_TIER.price ? undefined : `${EXAMPLE_TIER.price} in the table, which rounds to the dollar`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(90, [TRAVEL_FEE_KEY]));
// An add-on on a standard clean; the move-in/move-out clean includes it.
const OVEN_FROM = formatPrice(addOnFromPrice("standard", "inside-oven") ?? 0);

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("Fort Saskatchewan", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

const nearbyAreas = [
  "Sherwood Park", "St. Albert"
];

export default function FortSaskatchewan() {
  const faqs = [
    {
      question: "Is there a travel fee for cleaning in Fort Saskatchewan?",
      answer: `There is. Fort Saskatchewan is outside Edmonton city limits, so bookings here carry a ${TRAVEL_FEE} travel fee on top of the flat rate. It is one line, added at booking, and it is the same whether the clean is a standard, a deep or a move-out; post-construction is the one service with its own figure, ${PC_TRAVEL_FEE}. That line is the only thing an Edmonton address would not have. The rest of the bill is built the same way, including the pet charge and the home-type surcharges: ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "When does the team arrive in Fort Saskatchewan?",
      answer: `The booking sets an arrival window, not an exact time: ${ARRIVAL_WINDOWS.join(", ")}. Same-day and next-day slots depend on the schedule, so phone ${CITY_PROOF.edmonton.phone} to ask what is open. If someone in the house sleeps days after a plant shift, name the room at booking and the team changes the order it cleans in. You do not need to be home if you leave a key, a lockbox code or smart-lock access, and the team locks up.`
    },
    {
      question: "Do you offer move-out cleaning in Fort Saskatchewan?",
      answer: `Yes. A move-in or move-out clean in Fort Saskatchewan runs from ${MOVE_FROM} for a one-bedroom apartment or condo to ${MOVE_TOP} for five bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. It covers inside the oven, fridge and microwave, and every empty cabinet, drawer and closet. For a never-occupied new build, choose it only after the builder's final clean when no fine construction dust or trade residue remains; otherwise choose post-construction cleaning. Under Alberta's Residential Tenancies Act the landlord completes a move-out inspection report with the tenant, and we do not promise the deposit comes back; the landlord decides.`
    },
    {
      question: "How much is a standard house clean in Fort Saskatchewan?",
      answer: `A standard clean in Fort Saskatchewan is ${STANDARD_FROM} for a one-bedroom apartment or condo, rising to ${STANDARD_TOP} for five bedrooms, before GST and the ${TRAVEL_FEE} travel fee; a house or a home with pets adds its surcharge. A deep clean of the same one-bedroom is ${DEEP_FROM}. On a weekly schedule the standard rate is 20% less, bi-weekly 15% less and every 4 weeks 10% less. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "Do I have to provide cleaning products?",
      answer: `No. The team brings all supplies and equipment, including the vacuum. Leave the water and power on until the clean is done, because running water is required and vacuuming may not be possible without electricity. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Fort Saskatchewan home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does cancelling or moving a Fort Saskatchewan booking cost?",
      answer: `Cancelling or moving a booking with less than ${POLICY.cancellationNoticeHours} hours' notice costs ${POLICY.cancellationFee}; with more notice there is no fee. If the team arrives and cannot get in, the charge is ${POLICY.lockoutFee}. If we have to move a booking, for a sick cleaner, a vehicle that will not start or unsafe roads, we say so as soon as we know and offer the earliest slot we have, and you can cancel a booking we moved at no charge.`
    },
    {
      question: "Will the team clean a storage room or clear clutter?",
      answer: `The team cleans clear floors and counters and works around whatever is stacked on them, so a storage room in a long-settled Fort Saskatchewan home has to be emptied before it can be cleaned. Decluttering or organising is a separate hourly add-on. Lifting anything over 25 lb, hoarding situations and large debris removal are not included, and nor are garages or outdoor areas, apart from a balcony or garage sweep add-on offered mostly in summer when the weather allows.`
    }
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-fort-saskatchewan/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-fort-saskatchewan/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Fort Saskatchewan, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-fort-saskatchewan", areaServed: "Fort Saskatchewan, AB" }))}</script>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="display-serif text-[2rem] sm:text-[2.25rem] xl:text-[2.75rem] text-white mb-6 leading-[1.12] text-balance">
                Professional House Cleaning in Fort Saskatchewan
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                House cleaning in Fort Saskatchewan starts at {STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a {TRAVEL_FEE} travel fee and any house-type or pet surcharge, and the card is charged after the clean.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(780) 913-6565
                  </a>
                </Button>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-white/90">
                <Star className="w-4 h-4 shrink-0 fill-brand-gold text-brand-gold" aria-hidden="true" />
                <span className="font-medium">{EDMONTON_RATING_CLAIM}, {CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton listing. Cleaning Alberta homes {COMPANY.sinceLabel}.</span>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[440px]">
              <img width={512} height={640}
                src={fortSaskKitchen}
                alt="A cleaner wiping down a kitchen appliance"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* What the hero pills said, as one plain row under the hero */}
      <div className="border-b border-border bg-muted/30">
        <ul className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm font-medium text-foreground">
          {["Pay after your clean", "Open 7 days a week", "24-hour re-clean guarantee"].map((text) => (
            <li key={text} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Cleaning services for Fort Saskatchewan homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Five of these services are priced flat by home size, and post-construction is priced by square footage.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services.map((s, i) => (
                <ServiceCard key={i} {...s} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-accent-on-dark text-sm font-semibold tracking-wider uppercase">Why Us</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-4 text-balance">
                Why Fort Saskatchewan residents choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Every Fort Saskatchewan booking comes with all four.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {whyUsItems.map((item, i) => (
                <WhyUsCard key={i} {...item} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Local Coverage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
              House cleaning in Fort Saskatchewan and other towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              The Edmonton branch cleans nine communities outside the city, and Fort Saskatchewan is one of them, on the same checklist and flat rates as our{" "}
              <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning inside Edmonton city limits</Link>. The same office sends out our{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert cleaning crews</Link>, does{" "}
              <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">Beaumont house cleaning</Link>{" "}
              and runs{" "}
              <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Devon</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-stony-plain/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Stony Plain</Link>. Every one of those towns is outside Edmonton city limits, so the {TRAVEL_FEE} travel fee applies there exactly as it does here.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="From the route"
        heading="Quiet hours in a shift town"
        paragraphs={[
          "Alberta's Industrial Heartland, a hydrocarbon processing region, takes in Fort Saskatchewan and the counties around it, and enough of the households we clean run on a plant rotation that we ask about it at booking. Someone may be asleep at two in the afternoon. Tell us which room: the order a house gets done in is easy to change, and the vacuum is the part that matters.",
          "Growth here has been steep and long: Southfort and Westpark were laid out generations after the older streets near the original fort site. In a new build, the remaining condition decides the service: post-construction for fine building dust or trade residue, and move-in cleaning only after the builder's final clean when the home is dust-free.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

      {/* Which clean, and what it costs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
                Matching the clean to the house
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A new house in Southfort or Westpark uses a move-in clean only after the builder's final clean, when no fine construction dust or trade residue remains. If those are still present, book{" "}
                  <Link to="/post-construction-cleaning/" className="text-primary underline underline-offset-2 font-medium">post-construction cleaning in the Edmonton area</Link>{" "}
                  instead, priced by square footage. For a dust-free handover, book{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">move-out cleans in Fort Saskatchewan</Link>{" "}
                  from {MOVE_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, and have it done before the furniture arrives, while every cabinet, drawer and closet is still empty.
                </p>
                <p>
                  A long-settled home on the older streets near the fort site is better started with a deep clean, from {DEEP_FROM} on the same terms, which adds baseboards, doors, light switches, wall outlets and vent covers to the standard checklist. After that, the standard clean from {STANDARD_FROM} on the same terms keeps it. A storage room has to be emptied before the team can clean it, because clutter gets worked around rather than cleared.
                </p>
                <p>
                  A suite listed as a short-term rental needs a turnover between guests rather than a scheduled clean, priced by the hour with a minimum of 3 hours for one cleaner or 2 hours for two; the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning for Edmonton-area hosts</Link>{" "}
                  page sets that out. Every tier by bedroom count and every add-on is on{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">the Edmonton price list, tier by tier</Link>. Add the {TRAVEL_FEE} travel fee to any of those figures for an address in Fort Saskatchewan.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* A worked quote, built from the same rows as the price table */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">A worked quote</span>
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6 text-balance">
                What a house cleaning quote in Fort Saskatchewan adds up to
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Take a three-bedroom, two-storey house in Fort Saskatchewan with two bathrooms and a half bath, booked for a move-in clean after the builder's final clean has removed construction dust and trade residue.
                </p>
                <QuoteReceipt
                  lines={[
                    { label: "Rate for that size, which assumes an apartment or condo", amount: EXAMPLE_BASE, note: EXAMPLE_TABLE_NOTE },
                    { label: "Two-storey house", amount: `+ ${HOME_TYPE.twoStorey}` },
                    { label: "Travel fee for a Fort Saskatchewan address", amount: `+ ${TRAVEL_FEE}` },
                  ]}
                  total={{ label: "Quote before 5% GST", amount: EXAMPLE_PRICE }}
                  extras={[
                    { label: "Once a pet lives there: the compulsory pet charge on every visit", amount: `+ ${PET_FEE}` },
                  ]}
                />
                <div className="not-prose pt-1">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="#quote">
                      <Calculator className="mr-2 w-5 h-5" />See My Instant Price
                    </a>
                  </Button>
                </div>
                <p>
                  The figure moves with the home and the extras; how long the clean takes does not change it. More bathrooms than the table assumes raise it. On a later standard clean, an add-on such as inside the oven, from {OVEN_FROM} before GST, raises the price of that visit. If a home needs substantially more work than described, such as heavy build-up, the team explains what it found and the options before continuing.
                </p>
                <p>
                  Every line, the travel fee included, shows on the instant price before you book. Nothing is charged at booking, and the card is charged once the clean is complete.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                Fort Saskatchewan on the map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fort Saskatchewan cleans are booked by the Edmonton office at 18615 71 Ave NW, which takes calls from 8:00 AM to 8:00 PM Monday to Saturday and from 9:00 AM to 3:00 PM on Sunday.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <GoogleMapEmbed query="Fort Saskatchewan, AB" title="Fort Saskatchewan Service Area Map" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Fort Saskatchewan house cleaning questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AnimatedSection>
          </div>
        </section>

      {/* CTA */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
              Book house cleaning in Fort Saskatchewan
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              See your flat rate before you book. Nothing is charged until the clean is done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href="#quote">
                  <Calculator className="mr-2 w-5 h-5" />See My Instant Price
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
      </main>

      <Footer />
    </div>
  );
}
