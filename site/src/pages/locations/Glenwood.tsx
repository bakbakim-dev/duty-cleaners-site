import { CITY_PROOF } from "@/data/proof";
import { RATING_CLAIM } from "@/data/proof";
import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods";
import LocalMarketNote from "@/components/LocalMarketNote";
import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import {
  Phone, CheckCircle2, Star, Shield, Clock, Award,
  Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed,
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail
} from "lucide-react";
import heroImg from "@/assets/gallery/glenwood-cleaner-home.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
const LocationMap = lazy(() => import("@/components/LocationMap"));

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const ServiceCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div
    className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

const WhyUsCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div
    className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);

const services = [
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning for a spotless, fresh reset in one visit." },
  { icon: Sparkles, title: "Deep Cleaning", description: "Every corner, baseboard, and hidden surface, cleaned top to bottom." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inspection-grade detail for moving out or settling in." },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Post-renovation dust and debris, professionally removed." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Customer-Rated Cleaners", description: "Every cleaner is reference-checked before working in a customer’s home." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability in Glenwood. We work around your busy life." },
  { icon: Leaf, title: "High Quality Cleaning Supplies", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Vetted cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "Not happy? Let us know within 24 hours and we'll re-clean at no additional charge." },
];

export default function Glenwood() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. The crew stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Glenwood?",
      answer: `Every service we run can be booked locally:\n\n• Commercial Cleaning\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes — customers in Glenwood on a recurring schedule save:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `In Glenwood, a deep clean adds to the standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!`
    },
    {
      question: "What is your 100% satisfaction guarantee policy?",
      answer: "If you're not 100% satisfied, call us within 24 hours and we'll re-clean the missed areas — at no extra cost!"
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
        <title>House Cleaning in Glenwood, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Professional house cleaning in Glenwood, Edmonton. Trusted local cleaners serving west Edmonton families. Customer-rated cleaners, rated 4.9 on Google." />
        <script type="application/ld+json">
          {JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Glenwood, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/glenwood-edmonton",
  areaServed: "Glenwood, Edmonton, AB",
  description: "Professional house cleaning in Glenwood, Edmonton. Trusted local cleaners serving west Edmonton families. Customer-rated cleaners, rated 4.9 on Google.",
  geo: { latitude: "53.53", longitude: "-113.621" },
}))}
        </script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/glenwood-edmonton/" />
        <meta property="og:title" content="House Cleaning in Glenwood, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Professional house cleaning in Glenwood, Edmonton. Trusted local cleaners serving west Edmonton families. Customer-rated cleaners, rated 4.9 on Google." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/glenwood-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning in Glenwood, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Professional house cleaning in Glenwood, Edmonton. Trusted local cleaners serving west Edmonton families. Customer-rated cleaners, rated 4.9 on Google." />
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
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Glenwood, Edmonton</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Professional House Cleaning in Glenwood
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  Your reliable, local cleaning team serving the Glenwood community. From classic 1950s bungalows on quiet crescents to renovated infills near Stony Plain Road — enjoy dependable cleaning built on trust and genuine care.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:7809136565">
                      <Phone className="mr-2 w-5 h-5" />780-913-6565
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  {[
                    { icon: CheckCircle2, text: "Pay After Your Clean" },
                    { icon: CalendarCheck, text: "Flexible Scheduling Available" },
                    { icon: Award, text: "100% Satisfaction Guarantee" },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <badge.icon className="w-4 h-4 text-accent" />
                      <span className="text-white/90 text-sm">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-[500px] flex-shrink-0">
                <img
                  src={heroImg}
                  alt="Professional cleaner wiping a living room window in a Glenwood, Edmonton home"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  width={1024}
                  height={1024}
                loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Residential Cleaning in Glenwood</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Glenwood is a leafy, family-friendly community in west Edmonton with mature streets, mid-century bungalows and easy access to Stony Plain Road. The people who live here take pride in their homes, and at Duty Cleaners, we're proud to be part of the rhythm of daily life in Glenwood.
                  </p>
                  <p>
                    Whether your home is near{" "}
                    <a href="https://www.google.com/maps/place/Glenwood+Park,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Glenwood Park</a>,
                    steps from <a href="https://www.google.com/maps/place/Stony+Plain+Rd,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Stony Plain Road</a>,
                    minutes from <a href="https://www.google.com/maps/search/Glenwood+Elementary+School+Edmonton/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Glenwood Elementary School</a>,
                    or close to <a href="https://www.google.com/maps/place/156+St+NW,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">156 Street</a>,
                    we bring a personal, attentive approach to every visit.
                  </p>
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
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  Cleaning Services for Glenwood Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Everything from weekly upkeep to full move-out cleans.
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

        {/* Why Us */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  Why Glenwood Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Reliable, detail-first cleaning families count on.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Find Us</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Serving the Glenwood Area</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Located in west Edmonton, we're always just around the corner.
                </p>
              </div>
              <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-lg border border-border">
                <Suspense fallback={<div className="w-full h-[400px] bg-muted animate-pulse rounded-2xl" />}>
                  <LocationMap center={[53.53, -113.621]} label="Glenwood, Edmonton" />
                </Suspense>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Coverage */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">We Know Glenwood</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We're in and around the neighbourhood daily, so we know the area well.
                  </p>
                </div>
                <CoverageChips areas={["Glenwood Park", "Stony Plain Road", "Glenwood Elementary", "156 Street", "Meadowlark Health Centre", "100 Avenue", "West Edmonton Mall", "Mayfield"]} variant="compact" />
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                    View All Service Areas →
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="Local knowledge"
        heading="Glenwood's west-end vintage"
        paragraphs={[
          "Glenwood's 1950s bungalows west of 156 Street keep original oak floors and plaster coves in many homes, and their small square footage packs a full complement of trim, doors and built-ins into few rooms — slow, satisfying hand-work rather than open-floor speed. Garden suites are appearing on the deep lots, adding second small kitchens to the job.",
          "Stony Plain Road defines the north edge and 156 Street the east, and the Valley Line West LRT runs down that 156 Street edge to the Glenwood/Sherwood stop: construction seasons have left dust in older homes' ducts, and the corridor's bus-and-rail traffic keeps a steady fine grit on east-facing sills. Meadowlark's shops keep the south end's foot traffic constant.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />
        <HonestReviewLink city="Edmonton" area="Glenwood" />

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">FAQ</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
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
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready for a Spotless Home in Glenwood?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Get your free quote today and experience the Duty Cleaners difference!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />Call 780-913-6565
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
