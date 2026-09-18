import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import { standardTierRows, FREQUENCIES } from "@/data/pricing";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, Leaf, CalendarCheck, ThumbsUp, Mail, PaintRoller, Sparkles } from "lucide-react";
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
import { POLICY } from "@/data/policy";
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

// These two FAQ answers are rendered twice, in the FAQ markup and in the
// accordion, so each is written once here. The old versions promised
// "familiar faces" and gave no price at all.
const TRUST_ANSWER = "Every cleaner is reference-checked before a first job and rated by the customer after each visit, and those ratings decide who we keep sending to Bellevue homes. If you book a recurring clean, you get your regular team where we can send them.";
const COST_ANSWER = `A standard clean in Bellevue starts at ${RECURRING_FROM} before 5% GST, for a one-bedroom, one-bathroom apartment or condo. A bungalow, basement suite, townhouse or two-storey house adds a home-type charge, and a home with pets adds a compulsory pet charge. There is no trip fee inside Edmonton city limits, and the instant price shows every charge before you book.`;

/** Shared by the visible FAQ and its FAQPage schema. The alternative-products fee comes from POLICY (P12). */
const PRODUCTS_ANSWER = `We bring all the products and equipment the job needs. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`;

const services = locationServices("Bellevue", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

export default function Bellevue() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jsonLd = buildLocationSchema({
  name: "Duty Cleaners – Bellevue, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/bellevue-edmonton",
  description: "Bellevue, Edmonton was built out by 1960, and house cleaning here keeps the cloths wrung out on its softwood floors and painted trim.",
});
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How do I know I can trust your cleaners in Bellevue?",
        acceptedAnswer: { "@type": "Answer", text: TRUST_ANSWER },
      },
      {
        "@type": "Question",
        name: "How much does it cost to get started?",
        acceptedAnswer: { "@type": "Answer", text: COST_ANSWER },
      },
      {
        "@type": "Question",
        name: "Are your cleaning products safe for pets and children?",
        acceptedAnswer: { "@type": "Answer", text: PRODUCTS_ANSWER },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>House Cleaners in Bellevue, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Bellevue, Edmonton was built out by 1960, and house cleaning here keeps the cloths wrung out on its softwood floors and painted trim." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/bellevue-edmonton/" />
        <meta property="og:title" content="House Cleaners in Bellevue, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Bellevue, Edmonton was built out by 1960, and house cleaning here keeps the cloths wrung out on its softwood floors and painted trim." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/bellevue-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaners in Bellevue, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Bellevue, Edmonton was built out by 1960, and house cleaning here keeps the cloths wrung out on its softwood floors and painted trim." />
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
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <span className="dc-icon dc-icon-map-pin w-4 h-4 text-accent" aria-hidden="true" />
                <span className="text-white/90 text-sm font-medium">Serving Bellevue, Edmonton</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Bellevue
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Bellevue was essentially built out by 1960, and 96 per cent of its homes are detached. Houses facing the river valley track in spring mud, and those along Wayne Gretzky Drive get the winter sanding grit.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(780) 913-6565
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {[
                  { icon: CheckCircle2, text: "Pay After Your Clean" },
                  { icon: CalendarCheck, text: "Open 7 Days a Week" },
                  { icon: Award, text: "24-Hour Re-Clean Guarantee" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                    <badge.icon className="w-4 h-4 text-accent" />
                    <span className="text-white/90 text-sm">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  Cleaning Services for Bellevue Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Bellevue homes can book a single clean or a weekly, bi-weekly or every-4-weeks schedule, plus deep, move-out and post-construction cleans, with wall washing booked alongside a clean.
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
                {"Bellevue is one of the Edmonton neighbourhoods we clean — see "}
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
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  Why Bellevue Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Here is how the cleaners sent to Bellevue homes are chosen and rated, and what happens if something is missed.
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

        <HonestReviewLink city="Edmonton" area="Bellevue" />

        {/* Google Map */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Serving Bellevue & Surrounding Areas</h2>
              </div>
              <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <img width={1280} height={720} src={cleanHomeImg} alt="A kitchen with a light oak island, a spray bottle and folded cloths by the sink, and a dining table under a bright window" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <GoogleMapEmbed query="Bellevue, Edmonton, AB" title="Bellevue, Edmonton Map" height={400} />
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
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">More Edmonton-area neighbourhoods we clean</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The flat rates that apply in Bellevue apply in Montrose too, and the service-area list names every place the Edmonton branch cleans.
                  </p>
                </div>
                <CoverageChips areas={["Montrose"]} variant="compact" />
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                    View All Service Areas →
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="Local knowledge"
        heading="Wartime houses above the valley"
        paragraphs={[
          "Building here was essentially finished by 1960, and better than a fifth of the houses predate the end of the Second World War. Ninety-six per cent are detached and three quarters are owner-occupied, which makes this long-run maintenance work on finishes people intend to keep rather than the reset a turnover needs. Softwood floors and painted trim of that age grey under standing water, so the wet work stays wrung out.",
          "The south boundary is the river valley itself and Wayne Gretzky Drive runs the west side. Those are two very different neighbours: the valley sends organic litter and spring mud to the doors facing it, while the arterial throws winter sanding grit at the houses on its flank. Which side a home sits on decides which of the two it fights.",
        ]}
      />

      <LocationPricing />

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">FAQ</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">How do I know I can trust your cleaners in Bellevue?</AccordionTrigger>
                    <AccordionContent>{TRUST_ANSWER}</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">How much does it cost to get started?</AccordionTrigger>
                    <AccordionContent>{COST_ANSWER}</AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">Are your cleaning products safe for pets and children?</AccordionTrigger>
                    <AccordionContent>{PRODUCTS_ANSWER}</AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to Book a Clean in Bellevue?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (780) 913-6565
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote">
                    <Mail className="mr-2 w-5 h-5" />See My Instant Price
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
