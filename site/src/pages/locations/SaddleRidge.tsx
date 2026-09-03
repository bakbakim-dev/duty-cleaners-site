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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Phone, CheckCircle2, Star, Shield, Clock, Award,
  Home, Sparkles, Truck, SprayCan, Bath, Building2,
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail
} from "lucide-react";
import { buildLocationSchema } from "@/lib/location-schema";
import CoverageChips from "@/components/CoverageChips";
import LocationPricing from "@/components/LocationPricing";
import calgaryLivingRoom from "@/assets/gallery/calgary-living-room-clean.webp";

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
  <div className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
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
  <div className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);

const services = [
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning to refresh your Saddle Ridge home consistently clean and fresh.", to: "/calgary/regular-cleaning/", linkText: "Standard cleaning in Saddle Ridge" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Comprehensive cleaning of the house — perfect for seasonal refreshes and thorough sanitization.", to: "/calgary/deep-cleaning/", linkText: "Deep cleaning in Saddle Ridge" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for smooth transitions in Saddle Ridge's growing residential market.", to: "/move-out-cleaning-calgary/", linkText: "Move-out cleaning in Saddle Ridge" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Dust and debris removal after renovations or constructions in your home.", to: "/post-construction-cleaning-calgary/", linkText: "Post-construction cleaning in Saddle Ridge" },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: Building2, title: "Commercial Cleaning", description: "Professional cleaning for businesses near the Genesis Centre and surrounding area." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability. We work around your busy family schedule." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs. Tell us about any sensitivities, or products you would rather we used, and we will work to them." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to deliver thorough and consistent results." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const nearbyAreas = ["Taradale", "Martindale", "Cityscape", "Skyview Ranch", "Falconridge", "Castleridge", "Coral Springs", "Redstone"];

const faqs = [
  { question: "How long does an initial cleaning take?", answer: "We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes." },
  { question: "What cleaning services does Duty Cleaners offer in Saddle Ridge?", answer: "We offer:\n\n• Commercial Cleaning\n• Standard Cleaning & Deep Cleaning Packages\n• Move-In And Move-Out Cleaning Service\n• Post Construction Cleaning\n• Wall Washing and Wall Cleaning" },
  { question: "Do you offer discounts?", answer: "We offer recurring discounts for our Standard and Deep Cleaning Packages.\n\nIf you avail of our recurring discount, on your next cleaning:\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off" },
  { question: "What's included in a deep cleaning?", answer: "Deep cleaning adds the following to our standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!" },
  { question: "What is your 100% satisfaction guarantee policy?", answer: "Not fully satisfied? Let us know within 24 hours and we'll come back and put it right at no charge." },
];

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Saddle Ridge Calgary",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/saddle-ridge",
  priceRange: "$$",
  geo: { latitude: "51.1347", longitude: "-113.9469" },
});

export default function SaddleRidge() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>House Cleaners in Saddle Ridge, Calgary | Duty Cleaners</title>
        <meta name="description" content="Professional house cleaning in Saddle Ridge, Calgary. Family-friendly NE community near Prairie Winds Park & Genesis Centre. 100% satisfaction guaranteed." />
        <meta property="og:title" content="House Cleaners in Saddle Ridge, Calgary | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaners in Saddle Ridge, Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="Professional house cleaning in Saddle Ridge, Calgary. Family-friendly NE community near Prairie Winds Park & Genesis Centre. 100% satisfaction guaranteed." />
        <meta property="og:description" content="Professional house cleaning in Saddle Ridge, Calgary. Family-friendly NE community near Prairie Winds Park & Genesis Centre. 100% satisfaction guaranteed." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/saddle-ridge/" />
        <link rel="canonical" href="https://dutycleaners.ca/locations/saddle-ridge/" />
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
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Saddle Ridge, Calgary</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Professional House Cleaning in Saddle Ridge
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  Trusted cleaning services for one of Calgary's most family-friendly northeast communities. Customer-rated cleaners committed to your satisfaction.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:4037681341"><Phone className="mr-2 w-5 h-5" />(403) 768-1341</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
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
              <div className="flex-shrink-0 w-full lg:w-[500px]">
                <img
                  src={calgaryLivingRoom}
                  alt="A tidy, freshly cleaned Calgary living room"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                  loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* About the Neighbourhood */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Cleaning Services Tailored to Saddle Ridge Living</h2>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  <p>
                    Saddle Ridge is a thriving residential community in northeast Calgary, one of the city's largest and most diverse neighbourhoods. Families enjoy the popular{" "}
                    <a href="https://www.google.com/maps/place/Prairie+Winds+Park,+Calgary,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Prairie Winds Park</a>{" "}
                    with its playgrounds, spray park, and walking paths — one of Calgary's largest community parks.
                  </p>
                  <p>
                    Residents also benefit from the{" "}
                    <a href="https://www.google.com/maps/place/Genesis+Centre,+Calgary,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Genesis Centre</a>{" "}
                    recreation facility and easy access to{" "}
                    <a href="https://www.google.com/maps/place/CrossIron+Mills,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CrossIron Mills</a>{" "}
                    outlet mall. Whether you have a spacious family home or a cozy townhouse, we deliver thorough cleaning tailored to your household.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Find Us</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-6">Saddle Ridge Service Area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10040.0!2d-113.9469!3d51.1347!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537164a5a1c1e0a7%3A0x1b0d1e1e1e1e1e1e!2sSaddle+Ridge%2C+Calgary%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000"
                    width="100%" height="450" style={{ border: 0 }} allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer" title="Saddle Ridge Service Area Map"
                  />
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
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Coverage</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Nearby Neighbourhoods We Serve</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">We proudly serve families and homeowners across Saddle Ridge and surrounding communities.</p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Local knowledge"
        heading="Saddle Ridge at family scale"
        paragraphs={[
          "Saddle Ridge runs to some of Calgary's largest family households, and its 2000s homes are built for them — double-primary layouts, spice kitchens whose cooking films need degreasing on a schedule regular kitchens never demand, and main-floor bedrooms that add an extra full bath to the count. A Saddle Ridge clean is bigger than its bedroom number implies.",
          "Saddletowne's LRT and plaza anchor daily life, and the northeast's wind carries fine dust off Métis Trail and the airport lands to west-facing sills. Ongoing construction on the community's growing edges keeps site grit in rotation — window tracks tell you which phase is building.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Services */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Saddle Ridge Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Professional cleaning packages for every home and budget.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((s, i) => <ServiceCard key={i} {...s} />)}
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Saddle Ridge Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">Reliable, detail-first cleaning families count on.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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

        {/* Service Areas */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Proudly Serving Saddle Ridge & Surrounding Areas</h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">We provide professional house cleaning services throughout Saddle Ridge and nearby communities in Calgary.</p>
              <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">View All Service Areas →</Link>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready for a Spotless Home in Saddle Ridge?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Get your free quote today and experience the Duty Cleaners difference!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341"><Phone className="mr-2 w-5 h-5" />Call (403) 768-1341</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote"><Mail className="mr-2 w-5 h-5" />See My Instant Price</a>
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
