import { CITY_PROOF } from "@/data/proof";
import { RATING_CLAIM } from "@/data/proof";
import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods";
import LocalMarketNote from "@/components/LocalMarketNote";
import { useEffect } from "react";
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
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  to,
  linkText,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  /** Absent on the two room-level cards, which have no page of their own. */
  to?: string;
  linkText?: string;
}) => (
  <div
    className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    {to && linkText && (
      <Link
        to={to}
        className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-primary transition-colors hover:text-accent"
      >
        {linkText}
      </Link>
    )}
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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning that leaves your Bannerman home spotless and fresh.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Bannerman" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning of your Bannerman home — every corner, baseboard, and hidden surface.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Bannerman" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inspection-grade detail for moving out or settling in.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Bannerman" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Post-renovation dust and debris, professionally removed.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Bannerman" },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability, schedule permitting. We work around your busy life." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

/**
 * Bannerman-specific questions first, then the shared operational ones.
 *
 * These neighbourhood-specific entries used to be dead code: a second
 * `const faqs` declared inside the component shadowed this one, so the generic
 * template list rendered instead and none of this reached the page or the
 * FAQPage schema. This is now the single source for both.
 */
const faqs = [
  {
    question: "What cleaning services do you offer in Bannerman?",
    answer: "We offer recurring house cleaning, deep cleaning, move in/out cleaning, post-construction cleanup, bathroom sanitization, and kitchen deep cleans for Bannerman homes.",
  },
  {
    question: "How do I book a cleaning in Bannerman?",
    answer: "You can call us at 780-913-6565 or request a free quote online. We'll match you with a local cleaner and schedule a time that works for you.",
  },
  {
    question: "How are your cleaners vetted?",
    answer: "Yes — every cleaner is reference-checked before working in a customer’s home, and every visit is rated by the customer afterwards.",
  },
  {
    question: "Can you use specific cleaning products I prefer?",
    answer: "Absolutely. We bring all supplies, and we can use specific products you prefer — just tell us when you book.",
  },
  {
    question: "How long does an initial cleaning take?",
    answer: "We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes.",
  },
  {
    question: "Do you offer discounts?",
    answer: "Yes! We offer recurring discounts:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off",
  },
  {
    question: "What's included in a deep cleaning?",
    answer: "Deep cleaning adds to our standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!",
  },
  {
    question: "What is your 100% satisfaction guarantee policy?",
    answer: "If you're not 100% satisfied, call us within 24 hours and we'll re-clean the missed areas — at no extra cost!",
  },
];

export default function Bannerman() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
        <title>Bannerman, Edmonton House Cleaning | Duty Cleaners</title>
        <meta name="description" content="Professional house cleaning in Bannerman, Edmonton. Serving families near Bannerman Park, Bannerman School, Hermitage Park & more." />
        <script type="application/ld+json">
          {JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Bannerman, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/bannerman",
  areaServed: "Bannerman, Edmonton, AB",
  description: "Professional house cleaning in Bannerman, Edmonton. Serving families near Bannerman Park, Bannerman School, Hermitage Park & more. Local cleaners you can trust.",
}))}
        </script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/bannerman/" />
        <meta property="og:title" content="Bannerman, Edmonton House Cleaning | Duty Cleaners" />
        <meta property="og:description" content="Professional house cleaning in Bannerman, Edmonton. Serving families near Bannerman Park, Bannerman School, Hermitage Park & more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/bannerman/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bannerman, Edmonton House Cleaning | Duty Cleaners" />
        <meta name="twitter:description" content="Professional house cleaning in Bannerman, Edmonton. Serving families near Bannerman Park, Bannerman School, Hermitage Park & more." />
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
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Bannerman, Edmonton</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Bannerman
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Your reliable, local cleaning team serving the Bannerman community. From family homes near Hermitage Park to residences by Bannerman School — enjoy dependable cleaning built on trust and genuine care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />780-913-6565
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
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
          </div>
        </section>

        {/* About Bannerman */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">A Local Touch for Bannerman Homes</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Life in Bannerman offers the best of both worlds: a close-knit community and quick access to Edmonton's northeast. With its family-oriented streets, welcoming parks, and nearby river valley, Bannerman is a neighbourhood where people take pride in their homes. Our role is simple — to help keep those homes feeling comfortable, refreshed, and cared for.
                  </p>
                  <p>
                    Whether your home is near{" "}
                    <a href="https://www.google.com/maps/place/Bannerman+Park,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bannerman Park</a>,
                    steps from{" "}
                    <a href="https://www.google.com/maps/place/Bannerman+School,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Bannerman School</a>,
                    close to{" "}
                    <a href="https://www.google.com/maps/place/Hermitage+Park,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Hermitage Park</a>,
                    or along{" "}
                    <a href="https://www.google.com/maps/place/144+Ave+NW,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">144 Avenue</a>,
                    we bring a personal, attentive approach to every visit.
                  </p>
                  <p>
                    From weekend soccer games at Bannerman Park to morning drop-offs at Bannerman School, we know what daily life looks like here. Being nearby means you don't have to worry about late arrivals or unfamiliar faces — we're a team that treats your home the way a neighbor would: with respect, consistency, and genuine care.
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
                  Cleaning Services for Bannerman Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  From routine upkeep to move-outs, Bannerman homes get every service they need.
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
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  Why Bannerman Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Trusted by Bannerman families for reliable, thorough cleaning.
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

        {/* Google Map */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Bannerman Service Area</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We serve Bannerman and surrounding northeast Edmonton communities.
                  </p>
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                  <iframe
                    title="Bannerman Edmonton Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9400!2d-113.4700!3d53.6050!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a02440c6a2b3d1%3A0x4a0b1e3c5f7d9e2a!2sBannerman%2C+Edmonton%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000"
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">We Know Bannerman</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We're in and around the neighbourhood daily, so we know the area well.
                  </p>
                </div>
                <CoverageChips areas={["Bannerman Park", "Bannerman School", "Hermitage Park", "144 Avenue", "Clareview Recreation Centre", "Clareview", "Belvedere", "Beacon Heights"]} variant="compact" />
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
        eyebrow="On the rim"
        heading="The edge with no street"
        paragraphs={[
          "Three sides of these blocks are roads — Victoria Trail on the west, 137 Avenue south, 144 Avenue north. The fourth side has no street at all: east of the last houses the ground falls away into the river valley, with trails at the bottom and an unsurfaced bank in between. What comes back up on boots and paws is valley clay, and clay releases from a mat while it is damp, then stops releasing the moment it dries to powder.",
          "The build-out was quick: better than three quarters of the housing dates to the 1970s and almost all the rest to the 1980s. Fewer than half the homes are detached; over a third are row houses, and most of the remainder are rented apartments in buildings under five storeys. A round here concentrates in an entry, a kitchen and one bathroom instead of spreading across a main floor, and where tile is original, grout wants patience over pressure.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />
        <HonestReviewLink city="Edmonton" area="Bannerman" />

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
                Ready for a Fresh Start in Bannerman?
              </h2>
              <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
                Whether you're near Hermitage Park, tucked close to 144 Avenue, or walking distance from Clareview Recreation Centre, we're right in the neighbourhood and ready to help.
              </p>
              <p className="text-white/90 mb-10 max-w-2xl mx-auto">
                Call us today or request your free quote online. A cleaner, more comfortable home in Bannerman is just a step away.
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
