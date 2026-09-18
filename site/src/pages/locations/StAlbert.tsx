import { ServiceCard, WhyUsCard, QuoteReceipt } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, CalendarCheck, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
// Was st-albert-landmark.webp: a generated "St. Albert Farmers' Market"
// whose sign reads "FARMS MAKT / SIT. ALBERT" under a dozen US flags.
import stAlbertHome from "@/assets/gallery/family-clean-home-edmonton.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS } from "@/data/pricing";
import { travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

// Every figure below is read from bk-config through pricing.ts; the page never
// types a price of its own.
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
// Post-construction sits on its own, higher travel-fee row in bk-config, so the
// FAQ cannot say "one fee whatever you book" the way it used to.
const PC_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
// The two charges that are added for you rather than chosen. They apply inside
// the city too, which is why the fee is the only *difference* and not the only extra.
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const HOME_TYPE = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
const EDMONTON_LISTING = GOOGLE_LISTINGS.edmonton;
const PAGE_TITLE = `House Cleaning St. Albert | Duty Cleaners`;
const META_DESCRIPTION = `House cleaners in St. Albert from ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// three-bedroom two-storey house on a one-time standard clean, outside
// Edmonton city limits, first without and then with a pet. The table card for
// that size is rounded to the dollar, so the example states the exact rate and
// never builds an exact-cent total from the rounded card.
const EXAMPLE_SIZE = PRICING_TIERS[2];
const EXAMPLE_TIER = STANDARD[2];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "standard", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("standard")[0]?.id ?? null));
// The table card rounds to the dollar; the receipt says so when the two differ.
const EXAMPLE_TABLE_NOTE = EXAMPLE_BASE === EXAMPLE_TIER.price ? undefined : `${EXAMPLE_TIER.price} in the table, which rounds to the dollar`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(90, [TRAVEL_FEE_KEY]));
const EXAMPLE_WITH_PET = formatPrice(exampleQuote(90, [TRAVEL_FEE_KEY, "must-choose-if-you-have-pets"]));

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("St. Albert", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

export default function StAlbert() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in St. Albert?",
      answer: `Yes. St. Albert is outside Edmonton city limits, so a ${TRAVEL_FEE} travel fee goes on a standard, deep or move-out booking here; a post-construction clean carries its own higher fee of ${PC_TRAVEL_FEE}. That fee is the only difference from an Edmonton address. The flat rate for the clean is the Edmonton rate, and the pet charge and the home-type surcharges apply here exactly as they do in the city: ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "What does a standard clean in St. Albert cost?",
      answer: `A standard clean in St. Albert is ${STANDARD_FROM} for a one-bedroom, one-bathroom apartment or condo, rising by size to ${STANDARD_TO} for five bedrooms, before 5% GST. The ${TRAVEL_FEE} travel fee is added to every St. Albert home-cleaning booking, and the pet charge and the house-type surcharge apply where they fit the home. A deep clean is ${DEEP_FROM} to ${DEEP_TO} on the same terms. On a recurring schedule the discount is 20% weekly, 15% every two weeks and 10% every four weeks. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "How soon can a cleaner come to St. Albert?",
      answer: `Same-day and next-day slots depend on the schedule, so call the Edmonton office at ${CITY_PROOF.edmonton.phone} and ask what is free. Office hours are Monday to Saturday 8:00 AM to 8:00 PM and Sunday 9:00 AM to 3:00 PM. Each booking gets an arrival window of ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]} rather than an exact minute.`
    },
    {
      question: "Do you do move-out cleaning in St. Albert?",
      answer: `Yes. A move-in or move-out clean runs ${MOVE_FROM} to ${MOVE_TO} before GST by home size, plus the ${TRAVEL_FEE} travel fee for a St. Albert address and the pet or house-type charge where it applies. The move-out checklist covers the inside of the oven, fridge and microwave, and the inside of every cabinet, drawer and closet.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning in Edmonton and St. Albert" }
    },
    {
      question: "Do you bring supplies?",
      answer: `Yes. The team brings all supplies and equipment, so there is nothing to leave out. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}. Running water is required, and vacuuming may not be possible without electricity, so leave both on until the clean is done.`
    },
    {
      question: "Do I need to be home while my St. Albert house is cleaned?",
      answer: `No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves. If the team arrives and cannot get in, the lockout charge is ${POLICY.lockoutFee}.`
    },
    {
      question: "How long does a first clean in St. Albert take?",
      answer: `We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within 24 hours and the team comes back to your St. Albert home to re-clean what was missed, at no charge. Photos help but are not required.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-st-albert/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-st-albert/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - St. Albert, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-st-albert", areaServed: "St. Albert, AB" }))}</script>
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
                Professional House Cleaning in St. Albert
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                A standard clean in St. Albert starts at {STANDARD_FROM} before GST for a one-bedroom apartment or condo, plus the {TRAVEL_FEE} travel fee and any house-type or pet charge, and you pay after the clean.
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
              <img width={1024} height={1024}
                src={stAlbertHome}
                alt="A family in a living room with clean floors and clear surfaces"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover border-2 border-white/10"
              loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* What the hero pills said, as one plain row under the hero */}
      <div className="border-b border-border bg-muted/30">
        <ul className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm font-medium text-foreground">
          {["Pay After Your Clean", "Open 7 Days a Week", "24-Hour Re-Clean Guarantee"].map((text) => (
            <li key={text} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* A worked quote. Replaces the brochure "About the Neighbourhood" and
          "Around St. Albert" sections, whose landmarks and history were not
          in the local note or the FACTS block. */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">A worked quote</span>
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6 text-balance">
                What house cleaning in St. Albert costs, worked through
              </h2>
              <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                <p>
                  Take a three-bedroom two-storey house on one of St. Albert's older streets, with two bathrooms and a half bath, booked for a one-time standard clean.
                </p>
                <QuoteReceipt
                  lines={[
                    { label: "Apartment or condo rate for that size", amount: EXAMPLE_BASE, note: EXAMPLE_TABLE_NOTE },
                    { label: "Two-storey house", amount: `+ ${HOME_TYPE.twoStorey}` },
                    { label: "Travel fee, outside Edmonton city limits", amount: `+ ${TRAVEL_FEE}` },
                  ]}
                  total={{ label: "Quote before 5% GST", amount: EXAMPLE_PRICE }}
                  extras={[
                    { label: `With pets: the compulsory ${PET_FEE} pet charge`, amount: EXAMPLE_WITH_PET, note: "Still before GST" },
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
                  More bathrooms, a larger home type and add-ons such as the inside of the oven, the inside of the fridge or interior windows all raise a St. Albert quote, and optional alternative products add {POLICY.ecoProductsFee} before GST: {POLICY.ecoProductsHowToRequest}. How long the clean takes does not change it. If a home needs substantially more work than described, such as heavy build-up or far more glass than stated, the team explains what it found and the options before continuing.
                </p>
                <p>
                  The Edmonton branch cleans St. Albert homes to the same checklist and flat rates as its{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Edmonton</Link>, and the travel fee is the only difference. Every size and add-on is set out under{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">house cleaning prices for St. Albert and Edmonton</Link>. Hosts letting a suite in St. Albert book turnovers through{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>, which is priced by the hour instead.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Cleaning services for St. Albert homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep and move-out cleans are priced flat by home size, post-construction by square footage, and wall washing is booked together with a clean. The list of{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>{" "}
                covers the add-ons too.
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
                St. Albert house cleaners you rate after every visit
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Every rating comes from a customer after a clean, and the ratings decide who keeps cleaning for us. You can{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">read the reviews</Link>{" "}
                before you book.
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
              Cleaning services in St. Albert and the towns around it
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              The Edmonton branch cleans the other communities outside the city on the same terms as St. Albert, among them{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">Morinville house cleaners</Link>,{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Sherwood Park</Link>,{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Spruce Grove</Link>{" "}
              and a{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">Leduc cleaning company</Link>{" "}
              run from the same office. All five sit outside Edmonton city limits, so the {TRAVEL_FEE} travel fee applies in each.
            </p>
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Neighbourhood notes"
        heading="Elm seeds on the old streets"
        paragraphs={[
          "St. Albert took New Town status on 1 January 1957, and the council plan behind it laid out four neighbourhoods, Braeside, Mission and Sturgeon Heights among them. Those streets carry much of the city's mature canopy today. Elms are a common boulevard tree on those older streets, and every spring they drop papery samaras that mat into window screens and sliding-door channels, then ride indoors on shoes for weeks.",
          "Riverside, one of the city's newest communities, sits on the west side by Big Lake, its boulevard trees years from filling in. Those homes trade screen debris for unshaded south and west glass that collects street dust with no canopy to slow it.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

      {/* Move-out cleaning in the town, which the content prompt asks every
          town page to cover. */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
                Move-out cleaning in St. Albert
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A move-in or move-out clean in St. Albert costs {MOVE_FROM} for a one-bedroom apartment or condo, up to {MOVE_TO} for five bedrooms, before 5% GST. The {TRAVEL_FEE} travel fee is added, along with the house-type surcharge or the pet charge where either applies. On top of the standard checklist, the clean covers the inside of the oven, fridge and microwave, and the inside of every cabinet, drawer and closet.
                </p>
                <p>
                  For a tenant, Alberta's Residential Tenancies Act sets out two parts of the handover. The landlord completes a move-out inspection report with the tenant. Within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days), as set out in{" "}
                  <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>. We do not promise the deposit comes back; that decision is the landlord's.
                </p>
                <p>
                  Some things sit outside every clean, a move-out included: outdoor work such as exterior windows, garages and patios, carpet steam cleaning, lifting anything over 25 lb, and removing window screens. That last exclusion matters in spring on the older streets, where elm seed mats into the screens, because the team leaves them in place. The{" "}
                  <Link to="/whats-included/" className="text-primary underline underline-offset-2 font-medium">cleaning checklist for St. Albert homes</Link>{" "}
                  lists what each clean does cover.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                St. Albert service area
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                St. Albert is one of nine communities outside Edmonton city limits that the Edmonton branch cleans, all served from its office at 18615 71 Ave NW.
              </p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-border">
              <GoogleMapEmbed query="St. Albert, AB" title="St. Albert Service Area Map" />
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
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Frequently asked questions</h2>
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
              Book house cleaning in St. Albert
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
