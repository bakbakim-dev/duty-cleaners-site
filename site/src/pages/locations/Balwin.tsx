import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import { standardTierRows, FREQUENCIES } from "@/data/pricing";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Home, Truck, SprayCan, Bath, Leaf, ThumbsUp, Calculator, Quote, PaintRoller, Sparkles } from "lucide-react";
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
import cleanHomeImg from "@/assets/hero-room-edmonton-manus-1280w.webp";
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

/** Shared by the visible FAQ and its FAQPage schema, so the two cannot drift. */
const COST_ANSWER = `A standard clean in Balwin starts at ${RECURRING_FROM} before GST for a one-bedroom, one-bathroom apartment or condo, and a deep or move-out clean costs more. A bungalow, basement suite, townhouse or two-storey house adds a home-type surcharge, a home with pets adds a compulsory pet charge, and add-ons such as inside the oven or fridge are extra. The instant price shows every charge before you book, and no trip fee applies inside Edmonton city limits.`;

const services = locationServices("Balwin", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

export default function Balwin() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jsonLd = buildLocationSchema({
  name: "Duty Cleaners – Balwin, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/balwin-edmonton",
  description: "House cleaning in Balwin, Edmonton, for detached houses, duplexes, row housing and the suites in low-rise rental blocks.",
});
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does cleaning cost in Balwin?",
        acceptedAnswer: { "@type": "Answer", text: COST_ANSWER },
      },
      {
        "@type": "Question",
        name: "Do I need to be home during the cleaning?",
        acceptedAnswer: { "@type": "Answer", text: "No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when the clean is done. In a Balwin walk-up, tell us how the team gets through the building's front door as well as the suite door." },
      },
      {
        "@type": "Question",
        name: "How are your cleaners vetted?",
        acceptedAnswer: { "@type": "Answer", text: "Each cleaner's references are checked before a first job, and the customer rates every visit. Those ratings decide who we keep sending." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>House Cleaners in Balwin, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Row housing, duplexes and walk-up rental suites sit beside detached houses in Balwin, Edmonton, a neighbourhood built out by the early 1980s." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/balwin-edmonton/" />
        <meta property="og:title" content="House Cleaners in Balwin, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Row housing, duplexes and walk-up rental suites sit beside detached houses in Balwin, Edmonton, a neighbourhood built out by the early 1980s." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/balwin-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaners in Balwin, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Row housing, duplexes and walk-up rental suites sit beside detached houses in Balwin, Edmonton, a neighbourhood built out by the early 1980s." />
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
                Professional House Cleaning in Balwin
              </h1>
              <p className="text-lg text-white/85 mb-8 max-w-3xl mx-auto leading-relaxed">
                In Balwin, detached houses share the streets with duplexes, row housing and low-rise rental blocks, all built out by the early 1980s. A house and a walk-up suite are each priced flat by home size, before GST.
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

        {/* Services */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                  Cleaning Services for Balwin Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Balwin homes can book weekly upkeep for a house or a move-out clean when a suite is handed back.
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
                {"Balwin is one of the Edmonton neighbourhoods we clean. See "}
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
                  Why Balwin Residents Choose Duty Cleaners
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

        <HonestReviewLink city="Edmonton" area="Balwin" />

        {/* Google Map */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">Serving the Balwin Community</h2>
              </div>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <img width={1280} height={720} src={cleanHomeImg} alt="A kitchen with a light oak island, a spray bottle and folded cloths by the sink, and a dining table under a bright window" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <GoogleMapEmbed query="Balwin, Edmonton, AB" title="Balwin Edmonton Map" height={400} />
                </div>
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
                    Our Edmonton branch also cleans these four neighbourhoods, at the same flat rates by home size as Balwin.
                  </p>
                </div>
                <CoverageChips areas={["Belvedere", "Beacon Heights", "Spruce Avenue", "Eastwood"]} variant="compact" />
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
        eyebrow="Neighbourhood notes"
        heading="Two kinds of front door"
        paragraphs={[
          "Detached houses are one part of the picture in Balwin — low-rise rental blocks, duplexes and row housing make up a sizeable share of the rest, and the residential build-out was finished by the early 1980s.",
          "The south side ends at 127 Avenue, with the rail and industrial land of the Yellowhead corridor beyond it, so the quiet interior streets and the exposed edge are a few blocks apart. Winter sand off an arterial travels on tires and boots more than on wind. In a walk-up it lands on the shared stairs and the landing first, which is why entrance mats in these buildings earn their keep.",
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
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">How much does cleaning cost in Balwin?</AccordionTrigger>
                    <AccordionContent>
                      {COST_ANSWER}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">Do I need to be home during the cleaning?</AccordionTrigger>
                    <AccordionContent>
                      No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when the clean is done. In a Balwin walk-up, tell us how the team gets through the building's front door as well as the suite door.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">How are your cleaners vetted?</AccordionTrigger>
                    <AccordionContent>
                      Each cleaner's references are checked before a first job, and the customer rates every visit. Those ratings decide who we keep sending.
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
                Ready to Book a Clean in Balwin?
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
