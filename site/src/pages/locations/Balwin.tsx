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
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, Quote
} from "lucide-react";
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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning to bring the whole home back to baseline." },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces regular visits skip." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inspection-grade detail for moving out or settling in." },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared properly after renos and handovers." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Customer-Rated Cleaners", description: "Every cleaner is reference-checked before working in a customer’s home." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability in Balwin. We work around your busy life." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

export default function Balwin() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const jsonLd = buildLocationSchema({
  name: "Duty Cleaners – Balwin, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/balwin-edmonton",
  description: "Professional house cleaning in Balwin, Edmonton. Serving families near Zoie Gardens Park, Princeton School & more. Local cleaners you can trust.",
});
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much does cleaning cost in Balwin?",
        acceptedAnswer: { "@type": "Answer", text: "Cleaning costs depend on the type and size of the home, the condition it's in, the type of service requested (such as standard, deep, or move-out cleaning), and any additional services added like interior window cleaning, baseboards, or appliances." },
      },
      {
        "@type": "Question",
        name: "Do I need to be home during the cleaning?",
        acceptedAnswer: { "@type": "Answer", text: "You don't need to be home during the cleaning. You can provide access by sharing a code, leaving a key in a lockbox, or giving us a garage code. If you'd like to do a walkthrough, we can call you about 30 minutes before they finish." },
      },
      {
        "@type": "Question",
        name: "How are your cleaners vetted?",
        acceptedAnswer: { "@type": "Answer", text: "Yes. Every cleaner is reference-checked before their first job, and every visit is rated by the customer afterwards." },
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>House Cleaners in Balwin, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Professional house cleaning in Balwin, Edmonton. Serving families near Zoie Gardens Park, Princeton School & more. Local cleaners you can trust." />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/balwin-edmonton/" />
        <meta property="og:title" content="House Cleaners in Balwin, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Professional house cleaning in Balwin, Edmonton. Serving families near Zoie Gardens Park, Princeton School & more. Local cleaners you can trust." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/balwin-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaners in Balwin, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Professional house cleaning in Balwin, Edmonton. Serving families near Zoie Gardens Park, Princeton School & more. Local cleaners you can trust." />
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
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Balwin, Edmonton</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Balwin
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Your reliable, local cleaning team serving the Balwin community. From family homes near Zoie Gardens Park to residences by Princeton School — enjoy dependable cleaning built on trust and genuine care.
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

        {/* About Balwin */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Residential Cleaning in Balwin</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Balwin is a neighbourhood with a proud history and a strong sense of community. With its tree-lined streets, family-friendly atmosphere, and easy access to schools and parks, it's a place many Edmontonians are proud to call home.
                  </p>
                  <p>
                    Whether your home is near{" "}
                    <a href="https://www.google.com/maps/place/Zoie+Gardens+Park/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Zoie Gardens Park</a>,
                    close to{" "}
                    <a href="https://www.google.com/maps/place/Princeton+School,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Princeton School</a>,
                    steps from{" "}
                    <a href="https://www.google.com/maps/place/132+Ave+NW,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">132 Avenue</a>,
                    or a short drive to{" "}
                    <a href="https://www.google.com/maps/place/Northgate+Centre,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Northgate Centre</a>,
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
                  Cleaning Services for Balwin Homes
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

        {/* Why Choose Us */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  Why Balwin Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Trusted by Balwin families for reliable, thorough cleaning.
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

        <HonestReviewLink city="Edmonton" area="Balwin" />

        {/* Google Map */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Serving the Balwin Community</h2>
              </div>
              <div className="max-w-4xl mx-auto rounded-xl overflow-hidden shadow-lg border border-border">
                <iframe
                  title="Balwin Edmonton Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9448.5!2d-113.47!3d53.58!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a0245e2f1c1c1d%3A0x5a3e5b5e5b5e5b5e!2sBalwin%2C+Edmonton%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
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
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">We Know Balwin</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    We're in and around the neighbourhood daily, so we know the area well.
                  </p>
                </div>
                <CoverageChips areas={["Zoie Gardens Park", "Princeton School", "132 Avenue", "Northgate Centre", "Belvedere", "Beacon Heights", "Spruce Avenue", "Eastwood"]} variant="compact" />
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
        eyebrow="Neighbourhood notes"
        heading="Two kinds of front door"
        paragraphs={[
          "Detached houses are only part of the picture in Balwin — low-rise rental blocks, duplexes and row housing make up a real share of the rest, and the residential build-out was finished by the early 1980s. That changes what the schedule looks like. So the week's schedule mixes recurring visits with suites handed back on a possession date in the same walk-up, sometimes on the same stairwell.",
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
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">FAQ</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger className="text-left">How much does cleaning cost in Balwin?</AccordionTrigger>
                    <AccordionContent>
                      Cleaning costs depend on the type and size of the home, the condition it's in, the type of service requested (such as standard, deep, or move-out cleaning), and any additional services added like interior window cleaning, baseboards, or appliances.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger className="text-left">Do I need to be home during the cleaning?</AccordionTrigger>
                    <AccordionContent>
                      You don't need to be home during the cleaning. You can provide access by sharing a code, leaving a key in a lockbox, or giving us a garage code. If you'd like to do a walkthrough, we can call you about 30 minutes before they finish.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger className="text-left">How are your cleaners vetted?</AccordionTrigger>
                    <AccordionContent>
                      Yes. Every cleaner is reference-checked before their first job, and every visit is rated by the customer afterwards.
                    </AccordionContent>
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
                Ready for a Spotless Home in Balwin?
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
