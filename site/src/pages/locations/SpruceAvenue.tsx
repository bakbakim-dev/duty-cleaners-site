import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import { standardTierRows, FREQUENCIES } from "@/data/pricing";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect, lazy, Suspense } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Home, Truck, SprayCan, Bath, Leaf, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import spruceAvenueHero from "@/assets/gallery/spruce-avenue-clean-home.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
const SpruceAvenueMap = lazy(() => import("@/components/SpruceAvenueMap"));

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

/**
 * The recurring card's figures, read from bk-config so this page cannot drift
 * from what the booking form charges. The 10% tier is "Every 4 Weeks" there —
 * thirteen visits a year, not twelve — so nothing here calls it monthly.
 */
const RECURRING_FROM = standardTierRows()[0].price;
const pctOff = (bkId: number) =>
  `${Math.round((FREQUENCIES.find((f) => f.bkId === bkId)?.discount ?? 0) * 100)}%`;
const OFF_WEEKLY = pctOff(3);
const OFF_BIWEEKLY = pctOff(4);
const OFF_FOUR_WEEKLY = pctOff(2);

const services = locationServices("Spruce Avenue", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

export default function SpruceAvenue() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Spruce Avenue?",
      answer: `In Spruce Avenue, households can book:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning, booked with a clean`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes. A recurring schedule earns a standing discount:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `A deep clean layers these onto the standard visit:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped`
    },
    {
      question: "What happens if something is missed?",
      answer: "Tell us within 24 hours and the team comes back to your Spruce Avenue home to re-clean what was missed, at no charge. Photos help but are not required."
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
    <>
      <Helmet>
        <title>House Cleaning in Spruce Avenue, Edmonton | Duty Cleaners</title>
        <meta name="description" content="House cleaning in Spruce Avenue, Edmonton, where 1910s houses bring high baseboards, panel doors and basement suites that double the wet rooms." />
        <script type="application/ld+json">
          {JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Spruce Avenue, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/spruce-avenue",
  areaServed: "Spruce Avenue, Edmonton, AB",
  description: "House cleaning in Spruce Avenue, Edmonton, where 1910s houses bring high baseboards, panel doors and basement suites that double the wet rooms.",
}))}
        </script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/spruce-avenue/" />
        <meta property="og:title" content="House Cleaning in Spruce Avenue, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="House cleaning in Spruce Avenue, Edmonton, where 1910s houses bring high baseboards, panel doors and basement suites that double the wet rooms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/spruce-avenue/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning in Spruce Avenue, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="House cleaning in Spruce Avenue, Edmonton, where 1910s houses bring high baseboards, panel doors and basement suites that double the wet rooms." />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="min-h-screen">
        <Navigation city="edmonton" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero */}
        <section className="relative py-24 bg-brand-navy overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="display-serif text-[2rem] sm:text-[2.25rem] xl:text-[2.75rem] text-white mb-6 leading-[1.12] text-balance">
                  Professional House Cleaning in Spruce Avenue
                </h1>
                <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Spruce Avenue mixes 1910s houses with post-war infill. The older houses bring high baseboards, panel doors and stair balustrades, and some basements now serve as suites with their own bathroom and kitchenette.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="tel:7809136565">
                      <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(780) 913-6565
                    </a>
                  </Button>
                </div>
              </div>
              <div className="lg:w-[440px] flex-shrink-0">
                <img
                  src={spruceAvenueHero}
                  alt="Cleaner in a grey uniform vacuuming a bright living room with a white sofa"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  width={896}
                  height={1152}
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
                  Cleaning Services for Spruce Avenue Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  The century houses in Spruce Avenue need regular upkeep, and the student rentals near NAIT turn over with move-out cleans.
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
            <AnimatedSection>
              {/* Up-link to the Edmonton hub, which is the homepage.
                  The Calgary pages have carried the mirror of this sentence to their
                  own hub since the link-graph audit; the Edmonton side never got it,
                  on the reasoning that the homepage is already reached from every nav,
                  footer and breadcrumb. Those are site furniture: they carry no anchor
                  text worth having and sit outside the editorial body. The count was
                  76 of 76 Calgary pages linking their hub in-body against 1 of 90 on
                  the Edmonton side — for the page that has to hold "house cleaning
                  edmonton". */}
              <p className="mt-10 text-center text-muted-foreground">
                {"Spruce Avenue is one of the Edmonton neighbourhoods we clean. See "}
                <Link to="/" className="text-primary underline underline-offset-2">
                  house cleaning services in Edmonton
                </Link>
                {" for the full picture."}
              </p>
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
                  Why Spruce Avenue Residents Choose Duty Cleaners
                </h2>
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

        {/* Map */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto text-center mb-10">
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">Serving the Spruce Avenue Area</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Kingsway's traffic and the hospital district's coming and going keep grit high in Spruce Avenue. The Edmonton office at 18615 71 Ave NW books cleans here.
                </p>
              </div>
              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-border">
                <Suspense fallback={<div className="w-full h-[400px] bg-muted animate-pulse rounded-2xl" />}>
                  <SpruceAvenueMap />
                </Suspense>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">More Edmonton-area neighbourhoods we clean</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The Edmonton branch also cleans in Eastwood and Delton. For an address not on the full list, call (780) 913-6565.
                  </p>
                </div>
                <CoverageChips areas={["Eastwood", "Delton"]} variant="compact" />
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                    View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="Local knowledge"
        heading="Spruce Avenue's century mix"
        paragraphs={[
          "Spruce Avenue blends 1910s houses with post-war infill north of the Royal Alex, and the older share brings century-home work: high baseboards, panel doors, stair balustrades, and basements never designed as living space now serving as suites. Suite bathrooms and kitchenettes double the wet-room count in a modest footprint.",
          "Kingsway's traffic and the hospital district's constant coming-and-going keep the area's ambient grit high, and NAIT's proximity adds student-rental turnover cleans to the local mix — end-of-lease work that runs closer to move-out standard than maintenance.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />
        <HonestReviewLink city="Edmonton" area="Spruce Avenue" />

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Frequently Asked Questions</h2>
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
                Ready to Book a Clean in Spruce Avenue?
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
    </>
  );
}
