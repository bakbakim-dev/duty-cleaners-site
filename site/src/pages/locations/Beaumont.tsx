import { ServiceCard, WhyUsCard, QuoteReceipt } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import {
  CITY_PROOF } from "@/data/proof"; import { EDMONTON_RATING_CLAIM, COMPANY } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, CalendarCheck, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import beaumontLandmark from "@/assets/gallery/beaumont-landmark.webp";
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

// "Beaumont" alone reads as the Texas city to a search engine, and most of this
// page's impressions were for that one. Title and H1 both say Alberta now.
const PAGE_TITLE = `House Cleaning Beaumont, AB | Duty Cleaners`;
const PAGE_DESCRIPTION = `Most homes we clean in Beaumont, Alberta are large, recent family houses; house cleaning here starts at ${STANDARD_FROM} before GST, plus a ${TRAVEL_FEE} travel fee.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// four-bedroom two-storey house on a standard clean, outside city limits. The
// table rounds each size to the dollar, so no total is built from a table card.
const EXAMPLE_SIZE = PRICING_TIERS[3];
const EXAMPLE_TIER = STANDARD[3];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "standard", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("standard")[0]?.id ?? null));
// The table card rounds to the dollar; the receipt says so when the two differ.
const EXAMPLE_TABLE_NOTE = EXAMPLE_BASE === EXAMPLE_TIER.price ? undefined : `${EXAMPLE_TIER.price} in the table, which rounds to the dollar`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(90, [TRAVEL_FEE_KEY]));

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("Beaumont", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

// Only the names on the Edmonton coverage list in data/city-locations.ts stay.
// Nisku, New Sarepta, Calmar, South Edmonton, Ellerslie and Heritage Valley
// were chips here and are not on that list.
const nearbyAreas = [
  "Leduc", "Devon"
];

export default function Beaumont() {
  const faqs = [
    {
      question: "Is there a travel fee for house cleaning in Beaumont?",
      answer: `Yes. Beaumont is outside Edmonton city limits, so a ${TRAVEL_FEE} travel fee is added to a home-cleaning booking here, and ${PC_TRAVEL_FEE} to a post-construction one. It goes on when you book and is in the total before you confirm. Compared with an Edmonton address that fee is the only difference: the flat rate is the same, and so are the pet charge and the home-type surcharge, ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house. All of it is before 5% GST.`
    },
    {
      question: "How far ahead should I book a clean in Beaumont?",
      answer: `Same-day and next-day slots depend on the schedule; the Edmonton office on (780) 913-6565 can say what is free. Each booking gets an arrival window rather than an exact time: ${ARRIVAL_WINDOWS.join(", ")}. Nobody needs to be home, because most customers leave a key, a lockbox code or smart-lock access and the team locks up afterwards.`
    },
    {
      question: "Do you do move-out cleaning in Beaumont?",
      answer: `Yes. A move-in or move-out clean in Beaumont is ${MOVE_FROM} to ${MOVE_TOP} by home size for an apartment or condo, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet charge. It adds the inside of the oven, fridge and microwave, and the inside of every cabinet, drawer and closet, to the standard checklist. Book it for after the movers, once the rooms are clear. Duty Cleaners does not promise the security deposit comes back; the landlord decides.`
    },
    {
      question: "How much does a standard clean cost in Beaumont?",
      answer: `${STANDARD_FROM} for a one-bedroom apartment or condo up to ${STANDARD_TOP} for five bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee; a house-type charge and the pet charge can apply on top. A deep clean starts at ${DEEP_FROM}. The rate is flat: it is set by the size of the home, and it does not change because a clean took longer than expected.`
    },
    {
      question: "Is there a discount for regular cleaning in Beaumont?",
      answer: `Yes. The standard clean on a schedule is 20% off weekly, 15% off bi-weekly and 10% off every 4 weeks, which is what many people mean by monthly. Discounts start from the second visit; the first clean is charged at the one-time rate. Every discounted price is still before 5% GST.`
    },
    {
      question: "Do I need to have cleaning supplies at the house?",
      answer: `No. The team brings all supplies and equipment. Running water is required, and vacuuming may not be possible without electricity, so both need to be on while the team works. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Beaumont home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What are the cancellation terms in Beaumont?",
      answer: `A Beaumont booking can be cancelled or changed free with ${POLICY.cancellationNoticeHours} hours' notice; inside that window the fee is ${POLICY.cancellationFee}. A lockout, where the team arrives and cannot get in, is charged at ${POLICY.lockoutFee}. If Duty Cleaners has to move the booking, the office tells you as soon as it knows, offers the earliest slot it has, and charges nothing if you would rather cancel.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-beaumont/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-beaumont/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Beaumont, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-beaumont", areaServed: "Beaumont, AB" }))}</script>
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
                Professional House Cleaning in Beaumont, Alberta
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                House cleaning in Beaumont starts at {STANDARD_FROM} before GST for a one-bedroom apartment or condo, plus a {TRAVEL_FEE} travel fee and the house-type and pet charges shown on the quote, and you pay after the clean.
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
              <img width={800} height={544}
                src={beaumontLandmark}
                alt="A neighbourhood park with a playground on a clear summer day"
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
          {["Pay after your clean", "Open 7 days a week", "24-hour re-clean guarantee"].map((text) => (
            <li key={text} className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
              {text}
            </li>
          ))}
        </ul>
      </div>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                Cleaning services for Beaumont homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Six services for Beaumont homes, from a one-time clean to a schedule, all run by the Edmonton branch.
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
                Why Beaumont residents choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                The same terms on every visit, in Beaumont or anywhere else we go.
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
            {/* This used to be a second "Near Beaumont" H2, sitting a screen
                away from the one <NearbyNeighbourhoods> renders. One of them
                keeps that wording; this one names the service instead. */}
            <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
              Cleaning services in Beaumont and the towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              These are the crews behind our{" "}
              <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning inside Edmonton</Link>, and the Edmonton branch covers nine communities outside the city on the same terms. We do{" "}
              <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Devon</Link>{" "}
              and we are a{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">Leduc cleaning company</Link>{" "}
              as much as a Beaumont one. We also run{" "}
              <Link to="/cleaning-services-fort-saskatchewan/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Fort Saskatchewan</Link>{" "}
              and send{" "}
              <Link to="/cleaning-services-stony-plain/" className="text-primary underline underline-offset-2 font-medium">Stony Plain house cleaners</Link>{" "}
              out from the same office. All of these are outside Edmonton city limits, so all of them carry the same {TRAVEL_FEE} travel fee Beaumont does.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="What we see here"
        heading="The hill, then the fields"
        paragraphs={[
          "Beaumont was named for the hill it stands on, and St. Vital Church holds the top of that rise. The city is still high ground with farmland close at the edges, and little stands between the newest streets and the nearest field. Through seeding, and again at harvest, a fine mineral grit turns up on thresholds, in door tracks and on the sills of any window left open for the evening.",
          "Most of the homes we clean in Beaumont are large, recent family houses, where the difficulty is arithmetic, not grime. They carry more bathrooms, more floor and more glass than the street frontage suggests. The quote here is about scale.",
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
                Which clean a Beaumont house usually needs
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A home that is kept up wants the standard clean, from {STANDARD_FROM}. A home that has gone a season without one wants the deep clean, from {DEEP_FROM}, which adds the deep-clean package to the standard checklist: baseboards, doors, light switches, wall outlets and vent covers. An empty home on handover day wants{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">the Beaumont move-out clean</Link>, from {MOVE_FROM}, because that checklist opens the oven, the fridge and every cupboard, and a standard clean does not. Each of those figures is for a one-bedroom apartment or condo, before 5% GST; a house adds its home-type charge, a pet adds the pet charge, and a Beaumont address adds the {TRAVEL_FEE} travel fee.
                </p>
                <p>
                  Hosts with a suite or a whole house on a booking platform are a different job again, with a turnaround between guests rather than a schedule; that is priced by the hour and described on the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>{" "}
                  page. Every tier by bedroom count, and every add-on, is on the{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">Edmonton house cleaning prices by home size</Link>{" "}
                  page.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Worked quote */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-accent text-sm font-semibold tracking-wider uppercase">A quote, line by line</span>
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6 text-balance">
                House cleaning in Beaumont, worked through for a family house
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Much of what the team cleans in Beaumont is a large, recent family house, so take one: a two-storey with four bedrooms, three bathrooms and a half bath, on a one-time standard clean.
                </p>
                <QuoteReceipt
                  lines={[
                    { label: "Rate for that size", amount: EXAMPLE_BASE, note: EXAMPLE_TABLE_NOTE },
                    { label: "Two-storey charge", amount: `+ ${HOME_TYPE.twoStorey}` },
                    { label: "Travel fee", amount: `+ ${TRAVEL_FEE}` },
                  ]}
                  total={{ label: "Quote before 5% GST", amount: EXAMPLE_PRICE }}
                />
                <p>
                  A pet in the house adds the pet charge on every visit, and a fourth full bathroom or an add-on raises the figure again; the instant price shows the exact total before you book.
                </p>
                <div className="not-prose pt-1">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="#quote">
                      <Calculator className="mr-2 w-5 h-5" />See My Instant Price
                    </a>
                  </Button>
                </div>
                <p>
                  The size of the house sets the price, and the hours do not. A clean that runs longer than expected costs the same. If a house turns out to need substantially more work than described, such as heavy build-up or far more glass or cabinetry than the booking said, the team explains what it found and the options before carrying on. Add-ons such as the inside of the oven, the inside of the fridge and interior windows carry their own prices, shown on the quote.
                </p>
                <p>
                  Payment comes last. Nothing is charged at booking; the day before, a temporary hold for the price goes on the card (on a debit card the amount is set aside). The card is charged once the clean is complete, by Visa, Mastercard, American Express or debit; e-transfer is arranged by phone. You can{" "}
                  <Link to="/reviews/" className="text-primary underline underline-offset-2 font-medium">read Duty Cleaners reviews</Link>{" "}
                  or compare{" "}
                  <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>{" "}
                  first.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Move-out cleaning */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
                Move-out cleaning in Beaumont, and the deposit
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A move-out clean in Beaumont starts at {MOVE_FROM} before GST for a one-bedroom apartment or condo and runs to {MOVE_TOP} for five bedrooms, with the {TRAVEL_FEE} travel fee added because the address is outside Edmonton city limits. The house-type and pet charges apply as they do on any clean. For a family house that is being sold or handed back, the full checklist is on the page for{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">end of tenancy cleaning from the Edmonton branch</Link>.
                </p>
                <p>
                  Tenants leaving a Beaumont rental are covered by Alberta's Residential Tenancies Act. The landlord completes a move-out inspection report with the tenant. Under{" "}
                  <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>, within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days). We do not promise the deposit comes back; the landlord decides. Booking the clean for after the movers and before the inspection gives the team empty rooms to work in.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                Beaumont service area
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Beaumont is served from the Edmonton office at 18615 71 Ave NW.
              </p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-border">
              <GoogleMapEmbed query="Beaumont, AB" title="Beaumont Service Area Map" />
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
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Beaumont house cleaning questions</h2>
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
              Book house cleaning in Beaumont
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
