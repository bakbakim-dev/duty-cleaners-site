import { ServiceCard, WhyUsCard, QuoteReceipt } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import {
  CITY_PROOF } from "@/data/proof"; import { EDMONTON_RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, CalendarCheck, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import morinvilleHome from "@/assets/gallery/morinville-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS } from "@/data/pricing";
import { travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

// Prices come from bk-config through pricing.ts; the page types none.
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
const PAGE_TITLE = `House Cleaning Morinville | Duty Cleaners`;
const META_DESCRIPTION = `Morinville house cleaning starts at ${STANDARD_FROM} before GST for a one-bedroom apartment, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// two-bedroom, two-bathroom townhouse with a pet, on a standard clean, outside
// city limits. The table rounds each size to the dollar, so no total is built
// from a table card.
const EXAMPLE_SIZE = PRICING_TIERS[1];
const EXAMPLE_TIER = STANDARD[1];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "standard", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("standard")[0]?.id ?? null));
// The table card rounds to the dollar; the receipt says so when the two differ.
const EXAMPLE_TABLE_NOTE = EXAMPLE_BASE === EXAMPLE_TIER.price ? undefined : `${EXAMPLE_TIER.price} in the table, which rounds to the dollar`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(89, [TRAVEL_FEE_KEY, "must-choose-if-you-have-pets"]));

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("Morinville", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

// Only names on the Edmonton branch's list in data/city-locations.ts.
const nearbyAreas = ["St. Albert"];

export default function Morinville() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in Morinville?",
      answer: `Yes. Morinville is about 34 km up Highway 2 from Edmonton and outside its city limits, so a ${TRAVEL_FEE} travel fee goes on every home-cleaning booking here; post-construction is the exception and carries ${PC_TRAVEL_FEE}. Against an Edmonton address that fee is the only difference, which is not the same as the only extra. The clean is priced at the same flat rate as an Edmonton home of the same size, and the pet charge and the home-type surcharges are charged the same either side of the city limit: ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "What does a standard clean in Morinville cost?",
      answer: `A standard clean in Morinville is ${STANDARD_FROM} for a one-bedroom apartment or condo and ${STANDARD_TO} for five bedrooms, with each size in between priced flat, before the travel fee and 5% GST. A sixth or seventh bedroom is priced by the instant quote. A house adds its home-type surcharge, and a home with pets adds the pet charge. With the deep clean package the range is ${DEEP_FROM} to ${DEEP_TO}. Recurring visits are discounted 20% weekly, 15% every two weeks and 10% every four weeks. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "How soon can a team come out to Morinville?",
      answer: `Same-day and next-day slots depend on the schedule, so call ${CITY_PROOF.edmonton.phone} and ask what is open. Bookings are made to an arrival window: ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]}. You do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and the team locks up.`
    },
    {
      question: "Do you do move-out cleaning in Morinville?",
      answer: `Yes. A move-in or move-out clean in Morinville is ${MOVE_FROM} to ${MOVE_TO} by home size for an apartment or condo, before GST and the travel fee, and a house or a pet adds its usual charge. The inside of the oven, fridge and microwave, and of every cabinet, drawer and closet, is included in that price. Book it for after the furniture has gone, so every cupboard can be cleaned inside.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning for Morinville and Edmonton" }
    },
    {
      question: "Do you bring supplies out to Morinville?",
      answer: `Yes. The team brings all supplies and equipment to every Morinville visit. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}. Running water is required, and vacuuming may not be possible without electricity.`
    },
    {
      question: "How long does a first clean in Morinville take?",
      answer: `It depends on the size and condition of the home. The price is set by home size for the condition you describe, and if the home needs much more work than that, we agree any extra charge with you before doing it.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within 24 hours and the team comes back to your Morinville home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What if I need to cancel or move a Morinville booking?",
      answer: `Cancelling or changing a booking needs 24 hours' notice; inside 24 hours the fee is ${POLICY.cancellationFee}. If we have to move a booking because a cleaner is ill, a vehicle will not start or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have. Nobody pays for a visit we did not do, and cancelling a booking we moved costs nothing.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-morinville/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-morinville/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Morinville, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-morinville", areaServed: "Morinville, AB" }))}</script>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="display-serif text-[2rem] sm:text-[2.25rem] xl:text-[2.75rem] text-white mb-6 leading-[1.12] text-balance">
                Professional House Cleaning in Morinville
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Standard cleans in Morinville start at {STANDARD_FROM} for a one-bedroom apartment or condo, before GST and a {TRAVEL_FEE} travel fee; a house or a pet adds to that, and you pay after the clean.
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
                <span className="font-medium">{EDMONTON_RATING_CLAIM}, {CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton listing</span>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[440px]">
              <img width={1024} height={672}
                src={morinvilleHome}
                alt="A bungalow with a covered porch, a front lawn and two young trees"
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

      {/* Worked price example. Replaces the landmark tour and the "Around
          Morinville" history box, whose claims were not in the local note. */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">Worked example</span>
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6 text-balance">
                What house cleaning in Morinville costs, line by line
              </h2>
              <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                <p>
                  Take a two-bedroom, two-bathroom townhouse in Morinville with a dog, booked for a standard clean.
                </p>
                <QuoteReceipt
                  lines={[
                    { label: "Two-bedroom rate", amount: EXAMPLE_BASE, note: EXAMPLE_TABLE_NOTE },
                    { label: "Townhouse", amount: `+ ${HOME_TYPE.townhouse}` },
                    { label: "Pet charge", amount: `+ ${PET_FEE}` },
                    { label: "Travel fee", amount: `+ ${TRAVEL_FEE}` },
                  ]}
                  total={{ label: "Quote before 5% GST", amount: EXAMPLE_PRICE }}
                />
                <div className="not-prose pt-1">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="#quote">
                      <Calculator className="mr-2 w-5 h-5" />See My Instant Price
                    </a>
                  </Button>
                </div>
                <p>
                  The rate is flat by home size, so it stays the same if the clean runs longer than expected. What raises it is what you book: more bathrooms than the table assumes, a larger home type, a pet, or an add-on such as the inside of the oven or the fridge. If a Morinville home needs substantially more work than was described, such as heavy build-up or far more glass or cabinetry than stated, the team explains what it found and the options before continuing.
                </p>
                <p>
                  The travel fee is there because Morinville is outside Edmonton city limits, and a post-construction booking carries {PC_TRAVEL_FEE} instead. Inside the city there is no trip fee; otherwise a quote here is built exactly like one for{" "}
                  <Link to="/" className="text-primary underline underline-offset-2">house cleaning in Edmonton itself</Link>. A suite in Morinville let to short-term guests is booked as{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2">Airbnb cleaning in Edmonton</Link>, which is priced by the hour.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Move-out cleaning in the town */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
                Move-out cleaning in Morinville
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>A move-in or move-out clean in Morinville covers the standard rooms and then goes inside the oven, fridge and microwave, and inside every cabinet, drawer and closet. It is priced flat by home size, and the same travel fee applies as on any other Morinville booking.</p>
                <p>
                  If you rent, two facts from Alberta's Residential Tenancies Act are worth knowing before the last day. The landlord completes a move-out inspection report with the tenant. Within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days), as set out in{" "}
                  <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>. We do not promise the deposit comes back; the landlord decides.
                </p>
                <p>
                  Book the clean for after the furniture has gone. Empty cupboards can be cleaned inside, while shelves that still hold things get worked around. Garages, patios and exterior windows are not part of any clean, apart from a balcony or garage sweep add-on offered mostly in summer when the weather allows. The checklist is the one used for{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2">end of tenancy cleaning in Edmonton</Link>.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">Morinville service area</h2>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <GoogleMapEmbed query="Morinville, AB" title="Morinville Service Area Map" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Local Coverage */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                Morinville and the other towns the Edmonton branch cleans
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If your address is near Morinville but not in one of the nine communities outside the city that the Edmonton branch cleans, call the Edmonton office on {CITY_PROOF.edmonton.phone} before you book.
              </p>
            </div>
            <CoverageChips areas={nearbyAreas} />
          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="Local knowledge"
        heading="A parish town in open farm country"
        paragraphs={[
          "Morinville has housing from every decade since the early 1900s, which is the practical fact for us.",
          "About 34 km up Highway 2 from the city, with farmland close on every side, this is high open country rather than a sheltered grid. Wind carries field soil to the newest streets in the dry months, and it comes to rest where a routine pass tends not to look: the window sills and the top edge of a door.",
        ]}
      />

      {/* Services. This grid sits ABOVE the price block on purpose: the reader
          has to know which cleans exist before a paragraph of prices means
          anything. It used to render after it. */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Cleaning services for Morinville homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep and move-out cleans are priced flat by home size, post-construction by square footage, and wall washing is booked together with a clean. The add-ons and the checklists are on the page for{" "}
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

      <LocationPricing />

      {/* Why Choose Us */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-accent-on-dark text-sm font-semibold tracking-wider uppercase">Why Us</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-4 text-balance">
                Morinville house cleaners you rate after every visit
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                A rating from the customer closes every clean, and the ratings decide who we keep sending. You can{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">read the reviews</Link>{" "}
                before you decide.
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

      {/* Service Areas */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
              Cleaning services in Morinville and the towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              The Edmonton office that sends crews to Morinville also runs{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">house cleaning in St. Albert</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Spruce Grove</Link>, and it is the{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">Sherwood Park house cleaners</Link>{" "}
              and the{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">Leduc cleaning company</Link> too, all at the same flat rates. Every one of those towns is outside Edmonton city limits, so the {TRAVEL_FEE} travel fee is the same in each.
            </p>
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
            </Link>

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
              Book house cleaning in Morinville
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
