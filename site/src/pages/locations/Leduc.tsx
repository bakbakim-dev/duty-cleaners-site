import { ServiceCard, WhyUsCard, QuoteReceipt } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, CalendarCheck, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import leducChildDog from "@/assets/gallery/leduc-child-dog-clean-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS } from "@/data/pricing";
import { travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

// Every price on this page is read from bk-config through pricing.ts.
const STANDARD = standardTierRows();
const DEEP = deepCleanTierRows();
const MOVE = moveInOutTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TO = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = DEEP[0].price;
const DEEP_TO = DEEP[DEEP.length - 1].price;
const MOVE_FROM = MOVE[0].price;
const MOVE_TO = MOVE[MOVE.length - 1].price;
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
const PAGE_TITLE = `House Cleaning Leduc | Duty Cleaners`;
const META_DESCRIPTION = `Leduc house cleaning is priced by home size, from ${STANDARD_FROM} before GST for a one-bedroom condo, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// three-bedroom bungalow on a standard clean, outside city limits. The table
// rounds each size to the dollar, so no total is built from a table card.
const EXAMPLE_SIZE = PRICING_TIERS[2];
const EXAMPLE_TIER = STANDARD[2];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "standard", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("standard")[0]?.id ?? null));
// The table card rounds to the dollar; the receipt says so when the two differ.
const EXAMPLE_TABLE_NOTE = EXAMPLE_BASE === EXAMPLE_TIER.price ? undefined : `${EXAMPLE_TIER.price} in the table, which rounds to the dollar`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(54, [TRAVEL_FEE_KEY]));
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

const services = locationServices("Leduc", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

const nearbyAreas = [
  "Beaumont", "Devon"
];

export default function Leduc() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in Leduc?",
      answer: `Yes. Leduc is 33 km south of Edmonton and outside its city limits, so a ${TRAVEL_FEE} travel fee is added to each home-cleaning booking here, while a post-construction clean carries its own fee of ${PC_TRAVEL_FEE}. That fee is the only difference from an Edmonton address, but it is not the only extra on the bill. The flat rate for the clean is the Edmonton rate, and the pet charge and the home-type surcharges are charged here as they are in the city: ${PET_FEE} on any visit to a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "What does a standard clean in Leduc cost?",
      answer: `A standard clean in Leduc runs from ${STANDARD_FROM} for a one-bedroom apartment or condo to ${STANDARD_TO} for five bedrooms, flat, before GST, the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. A sixth or seventh bedroom is priced by the instant quote. Adding the deep-clean package takes the range to ${DEEP_FROM} to ${DEEP_TO}. Book weekly and the discount is 20%; every two weeks it is 15% and every 4 weeks 10%. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "When does the team arrive in Leduc?",
      answer: `The team arrives in a window of ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]} rather than at an exact minute, and you do not have to be in the house for it: most customers leave a key, a lockbox code or smart-lock access. Same-day and next-day slots depend on the schedule; call ${CITY_PROOF.edmonton.phone} to ask what is open. If someone in the house works a rotation and sleeps in the afternoon, tell us which room and the order the house gets done in changes.`
    },
    {
      question: "Do you do move-out cleaning in Leduc?",
      answer: `Yes. A move-in or move-out clean in Leduc runs from ${MOVE_FROM} for a one-bedroom apartment or condo to ${MOVE_TO} for five bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. It includes inside the oven, fridge and microwave, and inside every cabinet, drawer and closet, without add-ons. We do not promise the deposit comes back; the landlord decides.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning in Leduc and Edmonton" }
    },
    {
      question: "Do you bring supplies to Leduc?",
      answer: `Yes. The team brings all supplies and equipment, from products and cloths to the vacuum and mop. Leduc's post-war bungalows and its newest subdivisions have different surfaces, painted softwood and original tile on one and sealed stone and engineered plank on the other, and the kit covers both. Leave the water and power on until the clean is done. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "How long does a first clean in Leduc take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Leduc home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does it cost to cancel a Leduc clean?",
      answer: `A cancellation or change needs ${POLICY.cancellationNoticeHours} hours' notice, and inside that window the fee is ${POLICY.cancellationFee}. If the team arrives and cannot get in, the lockout charge is ${POLICY.lockoutFee}. When we have to move a booking ourselves, because a cleaner is ill, a vehicle will not start or the roads are unsafe, we say so as soon as we know, offer the earliest slot we have, and charge nothing if you cancel it.`
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
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Leduc, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-leduc", areaServed: "Leduc, AB" }))}</script>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="display-serif text-[2rem] sm:text-[2.25rem] xl:text-[2.75rem] text-white mb-6 leading-[1.12] text-balance">
                Professional House Cleaning in Leduc
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                House cleaning in Leduc starts at {STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a {TRAVEL_FEE} travel fee and any house-type or pet surcharge, and you pay after the clean.
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
                <span className="font-medium">{RATING_CLAIM}, {CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton listing</span>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[440px]">
              <img width={1024} height={768}
                src={leducChildDog}
                alt="A child and a dog playing together in a clean home"
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
                Cleaning services for Leduc homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep, move-out and wall washing are priced flat by home size, and post-construction by square footage. For the add-ons and every checklist, see{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>.
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
                A Leduc cleaning company that quotes before you book
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                You rate the cleaner after each clean, and you can{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">read the reviews</Link>{" "}
                first.
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
              Cleaning services in Leduc and the towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Leduc is one of nine communities outside Edmonton cleaned from the Edmonton office. The others include{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Sherwood Park</Link>,{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Spruce Grove</Link>,{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert house cleaners</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Morinville</Link>. All of them sit outside Edmonton city limits, so the {TRAVEL_FEE} travel fee Leduc pays applies there too.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="From the route"
        heading="A city built beside an airport"
        paragraphs={[
          "Leduc sits 33 km south of Edmonton and directly beside the international airport, and a good share of the households we clean work to a rotation rather than a weekday. Somebody may be asleep at two in the afternoon. Tell us which room and the order the house gets done in changes at no cost — it is the vacuum, not the schedule, that has to move.",
          "The city has grown hard since the 1947 oil strike that carries its name, so the housing runs from post-war bungalows near the old core to subdivisions finished in the last few years. Those two ends want opposite handling: painted softwood and original tile on one, sealed stone and engineered plank on the other.",
        ]}
      />

      <LocationPricing />

      {/* A worked quote, built from the same rows as the price table */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6 text-balance">
                A Leduc house cleaning quote, line by line
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Take a three-bedroom post-war bungalow near the old core, with two bathrooms and a half bath, on a one-time standard clean.
                </p>
                <QuoteReceipt
                  lines={[
                    { label: "Rate for that size, which assumes an apartment or condo", amount: EXAMPLE_BASE, note: EXAMPLE_TABLE_NOTE },
                    { label: "Bungalow", amount: `+ ${HOME_TYPE.bungalow}` },
                    { label: "Travel fee for a Leduc address", amount: `+ ${TRAVEL_FEE}` },
                  ]}
                  total={{ label: "Quote before 5% GST", amount: EXAMPLE_PRICE }}
                  extras={[
                    { label: "A home with pets: the compulsory pet charge on every visit", amount: `+ ${PET_FEE}` },
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
                  The clean itself is priced the way our{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning across Edmonton</Link>{" "}
                  is, and the travel fee is the only line an Edmonton address would not have. More bathrooms than the table assumes, a townhouse or a two-storey house, and add-ons such as inside the oven, from {OVEN_FROM} before GST, all raise the figure. The time the clean takes does not. If a home needs substantially more work than described, such as heavy build-up, the team explains what it found and the options before continuing.
                </p>
                <p>
                  Every line shows on the instant price before you book. Nothing is charged at booking: the day before, a temporary hold confirms the card is valid, and the card is charged once the clean is complete.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Which clean to book */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
                Standard, deep or move-out cleaning in Leduc
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  For a home that is kept up, the standard clean holds it, from {STANDARD_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, and it can go on a repeating schedule. Choose the deep clean from {DEEP_FROM} when its added tasks—baseboards, doors, light switches, wall outlets and vent covers—or the home's build-up are what you need. A first professional visit does not automatically require the deeper package.
                </p>
                <p>
                  For a handover, book{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">end of tenancy cleaning in Leduc</Link>{" "}
                  from {MOVE_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, once the last box has left. Under Alberta's Residential Tenancies Act the landlord completes a move-out inspection report with the tenant. Within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days), as set out in{" "}
                  <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>.
                </p>
                <p>
                  A suite listed as a short-term rental needs a turnover between guests rather than a scheduled clean, priced by the hour with a minimum of 3 hours for one cleaner or 2 hours for two. Leduc hosts can book it as{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>, with the travel fee added. Every tier and every add-on is on{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">the Edmonton price list by home size</Link>.
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
                Leduc on the map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Edmonton office at 18615 71 Ave NW books every Leduc clean. It also books{" "}
                <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Beaumont</Link>{" "}
                and sends out the{" "}
                <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">Devon house cleaners</Link>.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <GoogleMapEmbed query="Leduc, AB" title="Leduc Service Area Map" />
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
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Leduc house cleaning questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">
                        {faq.answer}
                        {faq.link && (
                          <>
                            {" "}
                            <Link to={faq.link.to} className="text-primary underline underline-offset-2 font-medium">{faq.link.text}</Link>
                          </>
                        )}
                      </AccordionContent>
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
              See your Leduc price before you book
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Nothing is charged until the clean is done.
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
