import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import { standardTierRows, FREQUENCIES } from "@/data/pricing";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Home, Truck, SprayCan, Bath, Leaf, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
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
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import cleanHomeImg from "@/assets/whats-included-hero.webp";
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

const services = locationServices("McConachie", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

export default function McConachie() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does house cleaning cost in McConachie?",
        acceptedAnswer: { "@type": "Answer", text: `A standard clean of a one-bedroom, one-bathroom apartment or condo in McConachie starts at ${RECURRING_FROM} before 5% GST, and larger homes are priced flat by size. A bungalow, basement suite, townhouse or two-storey house adds a home-type charge, and a home with pets adds a compulsory per-visit pet charge. Both show on the quote before you book, and there is no trip fee inside Edmonton city limits.` },
      },
      {
        "@type": "Question",
        name: "Do I need to be home during the cleaning appointment?",
        acceptedAnswer: { "@type": "Answer", text: "You do not need to be home for a clean in McConachie. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves. Running water is required, and vacuuming may not be possible without electricity." },
      },
      {
        "@type": "Question",
        name: "How are McConachie cleaners checked?",
        acceptedAnswer: { "@type": "Answer", text: "Every cleaner who comes to a McConachie home was reference-checked before a first job, and the customer rates each visit afterwards. Those ratings decide who we keep sending." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>House Cleaners in McConachie, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Cleaning McConachie homes in Edmonton: the glass shower enclosures and brushed fixtures here show water spots, so drying and buffing carry the visit." />
        <script type="application/ld+json">
          {JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – McConachie",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/mcconachie-edmonton",
  areaServed: "McConachie, Edmonton, AB",
  description: "Cleaning McConachie homes in Edmonton: the glass shower enclosures and brushed fixtures here show water spots, so drying and buffing carry the visit.",
}))}
        </script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/mcconachie-edmonton/" />
        <meta property="og:title" content="House Cleaners in McConachie, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Cleaning McConachie homes in Edmonton: the glass shower enclosures and brushed fixtures here show water spots, so drying and buffing carry the visit." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/mcconachie-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaners in McConachie, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Cleaning McConachie homes in Edmonton: the glass shower enclosures and brushed fixtures here show water spots, so drying and buffing carry the visit." />
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
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="display-serif text-[2rem] sm:text-[2.25rem] md:text-[3rem] text-white mb-6 leading-[1.12] text-balance">
                Professional House Cleaning in McConachie
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-3xl mx-auto leading-relaxed">
                McConachie's structure plan was adopted in 2006, and the houses that followed share the same flooring, glass shower enclosures and brushed fixtures street after street.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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

        {/* Before the visit */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img width={1280} height={720} src={cleanHomeImg} alt="A sunlit living room with white sofas, a glass coffee table and fresh flowers on polished hardwood" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                </div>
                <div>
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">Before a Clean in McConachie</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    We book an arrival window for a McConachie clean rather than an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM, or 3:00 to 4:00 PM.
                  </p>
                  <p>
                    There is no need to tidy up before the team comes. Clear counters and floors get cleaned, cluttered ones get worked around, and decluttering or organising is a separate hourly add-on.
                  </p>
                </div>
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
                  Cleaning Services for McConachie Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Standard, deep and move-out cleaning for McConachie houses, plus post-construction clean-up, wall washing and recurring visits.
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
                {"McConachie is one of the Edmonton neighbourhoods we clean. See "}
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
                  Why McConachie Residents Choose Duty Cleaners
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

        <HonestReviewLink city="Edmonton" area="McConachie" />

        {/* Local Coverage */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">Edmonton Neighbourhoods We Serve</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The Edmonton branch cleans in 80 city neighbourhoods, McConachie among them. Here are four more from that list.
                  </p>
                </div>
                <CoverageChips areas={["Clareview", "Belvedere", "Beacon Heights", "Hollick-Kenyon"]} variant="compact" />
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
        eyebrow="Ground truth"
        heading="One catalogue, street after street"
        paragraphs={[
          "McConachie's houses followed a structure plan adopted in 2006 and came out of the same few years of catalogue: the same flooring, the same glass shower enclosures, the same brushed fixtures, street after street. Those surfaces rarely want scrubbing. They show water spotting and streaking, and the wrong product leaves haze on exactly them, so drying and buffing carry the visit. The earliest phases are near twenty years old now, and starting to show it.",
          "Anthony Henday Drive runs the north edge and then angles southeast, so the last streets on that side face it twice. The windows and sills on those two exposures fill faster than anywhere else in the house: road film through the wet months, fine dust through the dry ones.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Map */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">McConachie Service Area</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Anthony Henday Drive runs along McConachie's north edge and then angles southeast.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
                  <GoogleMapEmbed query="McConachie, Edmonton, AB" title="McConachie Edmonton Map" height={400} />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/20">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">How much does house cleaning cost in McConachie?</AccordionTrigger>
                    <AccordionContent>
                      {`A standard clean of a one-bedroom, one-bathroom apartment or condo in McConachie starts at ${RECURRING_FROM} before 5% GST, and larger homes are priced flat by size. A bungalow, basement suite, townhouse or two-storey house adds a home-type charge, and a home with pets adds a compulsory per-visit pet charge. Both show on the quote before you book, and there is no trip fee inside Edmonton city limits.`}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">Do I need to be home during the cleaning appointment?</AccordionTrigger>
                    <AccordionContent>
                      You do not need to be home for a clean in McConachie. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves. Running water is required, and vacuuming may not be possible without electricity.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">How are McConachie cleaners checked?</AccordionTrigger>
                    <AccordionContent>
                      Every cleaner who comes to a McConachie home was reference-checked before a first job, and the customer rates each visit afterwards. Those ratings decide who we keep sending.
                    </AccordionContent>
                  </AccordionItem>
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
                Ready for a Cleaner Home in McConachie?
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
