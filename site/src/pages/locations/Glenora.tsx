import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Home, Truck, Building2, HardHat, Bath, Leaf, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import glenoraCleanerImg from "@/assets/gallery/glenora-cleaner-living-room.webp";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import LocationPricing from "@/components/LocationPricing";
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("Glenora", "edmonton", ["standard", "deep", "move-out", "post-construction", "wall-washing"]);

const whyUsItems = locationWhyUs("edmonton");

export default function Glenora() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How much does cleaning cost in Glenora?",
      answer: "A Glenora clean is a flat rate set by the service and the size of the home, before 5% GST, and it does not go up because the clean took longer than expected. The base rates are for an apartment or condo, so a detached house adds a home-type surcharge and a home with pets adds a compulsory pet charge. There is no trip fee inside Edmonton, and the instant price shows the full figure before you book."
    },
    {
      question: "Do I need to be home during the cleaning?",
      answer: "You do not need to be home. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when the clean is done."
    },
    {
      question: "How are your Glenora cleaners checked?",
      answer: "Every cleaner is reference-checked before a first job and rated by the customer after each visit. Those ratings decide who we keep sending to Glenora homes."
    },
    {
      question: "How long does an initial cleaning take?",
      answer: `It depends on the size and condition of the home. The price is set by home size for the condition you describe, and if the home needs much more work than that, we agree any extra charge with you before doing it.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Glenora?",
      answer: `Households here can book any of the following:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes — the discount grows with visit frequency:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `In Glenora, a deep clean adds to the standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped`
    },
    {
      question: "What happens if something is missed?",
      answer: "Tell us within 24 hours and the team comes back to your Glenora home to re-clean what was missed, at no charge. Photos help but are not required."
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
        <title>Home Cleaning You Can Count On in Glenora, Edmonton</title>
        <meta name="description" content="Nine in ten Glenora homes in Edmonton were standing by 1970, and their plaster, deep milled trim and original hardwood take no saturated mop." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/glenora-edmonton/" />
        <meta property="og:title" content="Home Cleaning You Can Count On in Glenora, Edmonton" />
        <meta property="og:description" content="Nine in ten Glenora homes in Edmonton were standing by 1970, and their plaster, deep milled trim and original hardwood take no saturated mop." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/glenora-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Cleaning You Can Count On in Glenora, Edmonton" />
        <meta name="twitter:description" content="Nine in ten Glenora homes in Edmonton were standing by 1970, and their plaster, deep milled trim and original hardwood take no saturated mop." />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Glenora Edmonton", city: "edmonton", url: "https://dutycleaners.ca/locations/glenora-edmonton", areaServed: "Glenora, Edmonton, AB" }))}</script>
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
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="display-serif text-[2rem] sm:text-[2.25rem] xl:text-[2.75rem] text-white mb-6 leading-[1.12] text-balance">
                  Home Cleaning You Can Count On in Glenora
                </h1>
                <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Three quarters of Glenora is detached houses, most standing by 1970, and a fifth is high-rise suites, mostly on the Groat Road side. The Edmonton branch cleans both at a flat rate by home size.
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
              <div className="flex-shrink-0 w-full max-w-[440px]">
                <img width={896} height={672}
                  src={glenoraCleanerImg}
                  alt="Cleaner vacuuming a heritage-style living room"
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
                  Cleaning Services for Glenora Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  The Edmonton branch offers five services for Glenora houses and tower suites, each priced before 5% GST: flat by home size, or by square footage for post-construction.
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
                {"Glenora is one of the Edmonton neighbourhoods we clean. See "}
                <Link to="/" className="text-primary underline underline-offset-2">
                  house cleaning services in Edmonton
                </Link>
                {" for the full picture."}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">Getting Into a Glenora Home</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    You do not need to be home for a Glenora clean. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up on the way out. If the team arrives and cannot get in, the lockout charge is half the cost of the scheduled service.
                  </p>
                  <p>
                    In a high-rise suite on the Groat Road side, tell us how the team reaches the unit. In a house facing the ravine, tell us which door takes the spring mud. On a recurring schedule, we send your regular team where we can send them.
                  </p>
                </div>
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
                  Why Glenora Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Duty Cleaners has cleaned Alberta homes since 2017, and Glenora's houses and tower suites are booked through the Edmonton branch.
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
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">Glenora Within Edmonton</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    The Edmonton branch covers 80 neighbourhoods inside the city, Glenora among them, plus nine communities outside it such as St. Albert and Sherwood Park.
                  </p>
                </div>
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                    View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="Ground truth"
        heading="Government House and the ravine edge"
        paragraphs={[
          "Nine homes in ten here were standing by 1970, and the south edge is not a street at all — it drops into the river valley and MacKinnon Ravine. Two consequences follow. Interiors of that age carry plaster, deep milled trim and original hardwood, none of which take a saturated mop; and the ravine sends leaf litter, seed and spring mud up to the doors that face it.",
          "The other surprise is the housing mix. Three quarters is detached, but a full fifth sits in high-rise apartments, mostly along the Groat Road side by Government House. That is two different jobs on one street grid: a century house wants slow dry work on trim and radiators, while a tower suite is a compact kitchen and a bathroom fan.",
        ]}
      />

      <LocationPricing />

        <HonestReviewLink city="Edmonton" area="Glenora" />

        {/* Final CTA */}
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

        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
                Ready to Book a Clean in Glenora?
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
