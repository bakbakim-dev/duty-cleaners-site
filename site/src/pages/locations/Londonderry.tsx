import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import { standardTierRows, FREQUENCIES } from "@/data/pricing";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Home, Truck, SprayCan, Bath, Leaf, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import { Suspense, lazy } from "react";
import londonderryCleanerImg from "@/assets/gallery/londonderry-cleaner-living-room.webp";

const LondonderryMap = lazy(() => import("@/components/LondonderryMap"));
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
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

const services = locationServices("Londonderry", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

const faqs = [
  { q: "How much does cleaning cost in Londonderry?", a: `A standard clean in Londonderry starts at ${RECURRING_FROM} for a one-bedroom, one-bathroom apartment or condo, before 5% GST. Larger homes cost more, a bungalow, basement suite, townhouse or two-storey house adds a home-type surcharge, and a home with pets adds a compulsory pet charge. There is no trip fee inside Edmonton city limits, and the instant price shows every charge before you book.` },
  { q: "Do I need to be home during the cleaning?", a: "No. Most Duty Cleaners customers leave a key, a lockbox code or smart-lock access, and the team locks up when the clean is finished. The team brings its own supplies and equipment, but the water needs to be running, and vacuuming may not be possible without electricity." },
  { q: "How are your cleaners vetted?", a: "Every Duty Cleaners cleaner is reference-checked before a first job and rated by the customer after each visit. Those ratings decide who the Edmonton branch keeps sending to homes in Londonderry." },
];

export default function Londonderry() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>Londonderry, Edmonton House Cleaning | Duty Cleaners</title>
        <meta name="description" content="Move-out and house cleaning in Londonderry, Edmonton, where row housing, walk-ups and 1960s houses share the blocks between 137 and 153 Avenue." />
        <script type="application/ld+json">
          {JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Londonderry, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/londonderry",
  areaServed: "Londonderry, Edmonton, AB",
  description: "Move-out and house cleaning in Londonderry, Edmonton, where row housing, walk-ups and 1960s houses share the blocks between 137 and 153 Avenue.",
}))}
        </script>
        {/* The FAQs below this page already renders — marked up so machine
            readers get the same Q&A the visitor sees. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/londonderry/" />
        <meta property="og:title" content="Londonderry, Edmonton House Cleaning | Duty Cleaners" />
        <meta property="og:description" content="Move-out and house cleaning in Londonderry, Edmonton, where row housing, walk-ups and 1960s houses share the blocks between 137 and 153 Avenue." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/londonderry/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Londonderry, Edmonton House Cleaning | Duty Cleaners" />
        <meta name="twitter:description" content="Move-out and house cleaning in Londonderry, Edmonton, where row housing, walk-ups and 1960s houses share the blocks between 137 and 153 Avenue." />
      </Helmet>

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
                  Professional House Cleaning in Londonderry
                </h1>
                <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  About a third of Londonderry households rent, and move-out cleaning is available here as well as regular house cleaning. Our Edmonton branch cleans its detached houses, row housing and apartments at flat rates by home size.
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
                  src={londonderryCleanerImg}
                  alt="Cleaner in a navy uniform vacuuming a light wood floor beside a grey sofa"
                  width={896}
                  height={1024}
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
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                  Cleaning Services for Londonderry Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Row houses, walk-up suites and detached homes in Londonderry are all quoted by bedroom and bathroom count before 5% GST, with any home-type surcharge added on the quote.
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
                {"Londonderry is one of the Edmonton neighbourhoods we clean. See "}
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
                  Why Londonderry Residents Choose Duty Cleaners
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
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">Serving the Londonderry Area</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Londonderry runs from 137 Avenue north to 153 Avenue, between 82 Street on the west and 66 Street on the east. The neighbourhood is inside Edmonton city limits, so there is no trip fee.
                </p>
              </div>
              <Suspense fallback={<div className="w-full h-[400px] bg-muted rounded-2xl animate-pulse" />}>
                <LondonderryMap />
              </Suspense>
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
                    Our Edmonton branch cleans in Kilkenny and Evansdale too, both on its list of 80 city neighbourhoods.
                  </p>
                </div>
                <CoverageChips areas={["Kilkenny", "Evansdale"]} variant="compact" />
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
        eyebrow="Area notes"
        heading="Between 137 and 153 Avenue"
        paragraphs={[
          "Roughly half the homes between these two avenues went up in the 1960s, and the mix runs the full range: detached houses, long runs of row housing, and apartment blocks, walk-up and taller, with about a third of households renting. That changes the work. Rentals mean move-out cleans, and row housing means narrow stairwells and tight kitchens.",
          "The southeast corner sits where 137 Avenue meets 66 Street; 82 Street closes the west side and 153 Avenue the north. Homes fronting those roads collect the winter sanding heavy traffic throws off — grey grit at the entry mat, in the door tracks, along the baseboards nearest the front hall. Interior blocks, set back behind a full depth of housing, show noticeably less of it.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border border-border px-6">
                      <AccordionTrigger className="text-foreground font-semibold text-left">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AnimatedSection>
          </div>
        </section>
        <HonestReviewLink city="Edmonton" area="Londonderry" />

        {/* CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
                Ready to Book a Clean in Londonderry?
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
