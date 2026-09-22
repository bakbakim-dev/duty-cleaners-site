import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import {
  CITY_PROOF } from "@/data/proof"; import { CALGARY_RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Home, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, ThumbsUp, Calculator, Building2, PaintRoller, Sparkles } from "lucide-react";
import chestermereImg from "@/assets/gallery/chestermere-landmark.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import LocationPricing from "@/components/LocationPricing";
import { sitePriceRange, addOnFromPrice, formatPrice } from "@/data/pricing";
import { TRAVEL_FEE_KEY } from "@/data/addon-table";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

/** The travel fee outside Calgary city limits (P11), read from bk-config the way <LocationPricing> reads it. */
const TRAVEL_FEE = formatPrice(addOnFromPrice("standard", TRAVEL_FEE_KEY) ?? 0);

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("Chestermere", "calgary", ["standard", "deep", "move-out", "post-construction", "wall-washing"]);

const whyUsItems = locationWhyUs("calgary");

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Chestermere",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/chestermere",
  areaServed: "Chestermere, AB",
  priceRange: sitePriceRange(),
});

export default function Chestermere() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `It depends on the size and condition of the home. The price is set by home size for the condition you describe, and if the home needs much more work than that, we agree any extra charge with you before doing it.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Chestermere?",
      answer: `Duty Cleaners books these services in Chestermere:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes — the discount grows with visit frequency:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `Beyond the standard scope, deep cleaning covers:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped`
    },
    {
      question: "What happens if something is missed?",
      answer: "Tell us within 24 hours and the team comes back to your Chestermere home to re-clean what was missed, at no charge. Photos help but are not required."
    },
    {
      question: "Is there a travel fee for house cleaning in Chestermere?",
      answer: `Yes. Chestermere is outside Calgary city limits, so a ${TRAVEL_FEE} travel fee is added to home-cleaning bookings there, before 5% GST. It comes on top of the flat price by home size, the home-type charge for a bungalow, basement suite, townhouse or two-storey house, and the compulsory pet charge for a home with pets. Each of these charges shows on the quote before you book.`
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
        <title>{`House Cleaning Chestermere, ${CALGARY_RATING_CLAIM} | Duty Cleaners`}</title>
        <meta name="description" content="No season is a dry one at a Chestermere back door, and house cleaning here is priced flat by home size with a 24-hour re-clean guarantee." />
        <meta property="og:title" content={`House Cleaning Chestermere, ${CALGARY_RATING_CLAIM} | Duty Cleaners`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`House Cleaning Chestermere, ${CALGARY_RATING_CLAIM} | Duty Cleaners`} />
        <meta name="twitter:description" content="No season is a dry one at a Chestermere back door, and house cleaning here is priced flat by home size with a 24-hour re-clean guarantee." />
        <meta property="og:description" content="No season is a dry one at a Chestermere back door, and house cleaning here is priced flat by home size with a 24-hour re-clean guarantee." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/chestermere/" />
        <link rel="canonical" href="https://dutycleaners.ca/locations/chestermere/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="min-h-screen">
        <Navigation city="calgary" />
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
                  Professional House Cleaning in Chestermere
                </h1>
                <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Chestermere is built on every side of a canal-fed reservoir, and the Calgary branch cleans homes all the way around it. Because Chestermere is outside Calgary city limits, a travel fee is added to the quote.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="tel:4037681341">
                      <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(403) 768-1341
                    </a>
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-[440px]">
                <img width={1024} height={1024}
                  src={chestermereImg}
                  alt="A prairie lake at golden hour"
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

        {/* Interactive Map */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">Chestermere Service Area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <GoogleMapEmbed query="Chestermere, AB" title="Chestermere Service Area Map" />
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
                  Where We Clean in Chestermere
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The Calgary branch books homes on every side of the lake in Chestermere. If you are not sure an address is covered, call the Calgary office at (403) 768-1341 before booking.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <LocationPricing />

      <LocalMarketNote
        eyebrow="Reservoir town"
        heading="Nothing natural about this lake"
        paragraphs={[
          "The CPR dammed this slough into a lake for irrigation, and it is still plumbed that way — canal-fed from the Bow River and draining out through two more canals. The city stands on every side of it. No home here sits far from open water, and no season here is a dry one at the back door.",
          "The lake is in use in every season, so wet gear comes through the back door twelve months a year, which makes damp the recurring problem rather than dirt — mats that never fully dry, thresholds that darken at the edges, a mudroom that smells before it looks dirty. Air movement and dry storage fix more here than any cleaning product does.",
        ]}
        accent="calgary"
      />

      <NearbyNeighbourhoods />

        {/* Services */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                  Cleaning Services for Chestermere Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Chestermere homes can book standard, deep and move-out cleaning at flat prices by home size before GST, and post-construction cleaning priced by square footage. Wall washing is booked together with a clean, not on its own.
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
              {/* Up-link to the city hub. /cleaning-services-calgary/ is a
                  subpage, unlike Edmonton's hub which is the homepage, so it is
                  the one that actually needs internal support: it ranked 24.8
                  for "cleaning services calgary" against Edmonton's 6.3 on the
                  identical query, on comparable impressions. */}
              <p className="mt-10 text-center text-muted-foreground">
                {"We clean Chestermere and the wider Calgary area. See "}
                <Link
                  to="/cleaning-services-calgary/"
                  className="text-primary underline underline-offset-2"
                >
                  house cleaning services in Calgary
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
                  Why Chestermere Residents Choose Duty Cleaners
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

        {/* Service Areas */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                House Cleaning in Chestermere & Surrounding Areas
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                The Calgary branch covers 66 Calgary neighbourhoods and nine communities outside the city: Chestermere, Airdrie, Cochrane, Okotoks, Strathmore, High River, Langdon, Crossfield and Diamond Valley.
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
                Ready to Book a Clean in Chestermere?
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
                  <a href="tel:4037681341">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (403) 768-1341
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
