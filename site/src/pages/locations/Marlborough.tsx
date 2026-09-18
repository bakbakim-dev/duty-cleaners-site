import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { sitePriceRange } from "@/data/pricing";
import { getListing } from "@/lib/google-listings";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; import { CheckCircle2, Star, Shield, Home, Truck, SprayCan, Bath, Building2, Leaf, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import { buildLocationSchema } from "@/lib/location-schema";
import CoverageChips from "@/components/CoverageChips";
import LocationPricing from "@/components/LocationPricing";
import calgaryBathroom from "@/assets/gallery/calgary-bathroom-clean.webp";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("Marlborough", "calgary", ["standard", "deep", "move-out", "post-construction", "wall-washing"]);

const whyUsItems = locationWhyUs("calgary");

const nearbyAreas = ["Forest Lawn", "East Village"];

const faqs = [
  { question: "How long does an initial cleaning take?", answer: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
  { question: "What cleaning services does Duty Cleaners offer in Marlborough?", answer: "We offer:\n\n• Standard Cleaning & Deep Cleaning Packages\n• Move-In And Move-Out Cleaning Service\n• Post Construction Cleaning\n• Wall Washing and Wall Cleaning" },
  { question: "Do you offer discounts?", answer: "Yes, on a recurring standard clean, starting with the second visit:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nThe first clean is charged at the one-time rate." },
  { question: "What's included in a deep cleaning?", answer: "Deep cleaning adds the following to our standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped" },
  { question: "What happens if something is missed?", answer: "Tell us within 24 hours and the team comes back to your home to re-clean what was missed, at no charge. Photos help but are not required." },
];

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Marlborough Calgary",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/marlborough",
  priceRange: sitePriceRange(),
  geo: { latitude: "51.0558", longitude: "-113.9741" },
});

export default function Marlborough() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>Marlborough, Calgary House Cleaning | Duty Cleaners</title>
        <meta name="description" content="Duty Cleaners cleans Marlborough's 1970s bungalows and split-levels in northeast Calgary top-down, from drop-ceiling rec rooms to sunken living rooms." />
        <meta property="og:title" content="Marlborough, Calgary House Cleaning | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Marlborough, Calgary House Cleaning | Duty Cleaners" />
        <meta name="twitter:description" content="Duty Cleaners cleans Marlborough's 1970s bungalows and split-levels in northeast Calgary top-down, from drop-ceiling rec rooms to sunken living rooms." />
        <meta property="og:description" content="Duty Cleaners cleans Marlborough's 1970s bungalows and split-levels in northeast Calgary top-down, from drop-ceiling rec rooms to sunken living rooms." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/marlborough/" />
        <link rel="canonical" href="https://dutycleaners.ca/locations/marlborough/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        {/* The FAQs this page already renders — marked up so machine readers
            get the same Q&A the visitor sees. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          })}
        </script>
      </Helmet>

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
                  Professional House Cleaning in Marlborough
                </h1>
                <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Marlborough's 1970s bungalows and split-levels have dark-stained trim, sunken living rooms and basement rec rooms with drop ceilings. A clean there works from the top down so the dust does not resettle.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="tel:4037681341"><span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(403) 768-1341</a>
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-[440px]">
                <img
                  src={calgaryBathroom}
                  alt="A white bathroom with a glass shower screen, a tub and a vanity"
                  width={800}
                  height={800}
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
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">Marlborough Service Area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <GoogleMapEmbed query="Marlborough, Calgary, AB" title="Marlborough Calgary Service Area Map" />
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
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">More Calgary Neighbourhoods We Serve</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Besides Marlborough, the Calgary branch cleans homes in these neighbourhoods too.</p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Local knowledge"
        heading="Marlborough's established northeast"
        paragraphs={[
          "Marlborough's 1970s bungalows and split-levels carry the era's fixtures — dark-stained rails and trim that show dust plainly but forgive wear, sunken living rooms whose low returns recirculate floor dust, and basement rec rooms with drop ceilings that shed fine particles when disturbed. Cleans here are top-down or they undo themselves.",
          "Marlborough's transit exchange anchors the neighbourhood's daily traffic, and Memorial Drive's flow adds arterial grit to the southern blocks. Homes near the exchange collect more entry wear; the interior crescents keep the quieter rhythm of long-settled streets.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Services */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Cleaning Services for Marlborough Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Standard cleaning covers regular upkeep in Marlborough; a deep clean is the same checklist plus the deep-clean package.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((s, i) => <ServiceCard key={i} {...s} />)}
              </div>
            </AnimatedSection>
            <AnimatedSection>
              {/* Up-link to the city hub. /cleaning-services-calgary/ is a
                  subpage, unlike Edmonton's hub which is the homepage, so it is
                  the one that actually needs internal support: it ranked 24.8
                  for "cleaning services calgary" against Edmonton's 6.3 on the
                  identical query, on comparable impressions. */}
              <p className="mt-10 text-center text-muted-foreground">
                {"Marlborough is one of the Calgary neighbourhoods we clean. See "}
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-4 text-balance">Why Marlborough Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">Dependable cleaning, visit after visit.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => <WhyUsCard key={i} {...item} />)}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-background">
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

        {/* Service Areas */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">Marlborough and the Rest of Our Calgary List</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">Marlborough is one of 66 Calgary neighbourhoods our branch cleans. Outside the city, the branch also covers nine communities, from Chestermere to High River, where a travel fee applies.</p>
              <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" /></Link>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6 text-balance">Ready to Book a Clean in Marlborough?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">See your flat rate before you book. Nothing is charged until the clean is done.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="#quote"><Calculator className="mr-2 w-5 h-5" />See My Instant Price</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="tel:4037681341"><span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (403) 768-1341</a>
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
