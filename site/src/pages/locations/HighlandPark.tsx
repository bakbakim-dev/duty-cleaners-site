import { CITY_PROOF } from "@/data/proof";
import { RATING_CLAIM } from "@/data/proof";
import LocalMarketNote from "@/components/LocalMarketNote";
import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods";
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
import cleanHomeImg from "@/assets/gallery/neighborhoods/highland-park.webp";
import { buildLocationSchema } from "@/lib/location-schema";
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
  <div className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
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
  { icon: Home, title: "Standard Cleaning", description: "A one-time thorough cleaning for Highland Park homes consistently fresh." },
  { icon: Sparkles, title: "Deep Cleaning", description: "Top-to-bottom deep cleans ideal for spring or post-holiday resets." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Move-in and move-out cleans for buyers, sellers, and renters." },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Post-reno dust removal for the area's many infill projects." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Detailed bathroom sanitization with disinfected tubs, showers, sinks, and tiles." },
  { icon: Building2, title: "Commercial Cleaning", description: "Commercial cleaning for nearby small businesses and clinics." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability, schedule permitting. We work around your busy life." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const landmarks = [
  {
    "title": "Confederation Park",
    "url": "https://www.google.com/maps/place/Confederation+Park,+Calgary,+AB/",
    "description": "Beloved park with golf, trails, and ponds"
  },
  {
    "title": "Centre Street N Shops",
    "url": "https://www.google.com/maps/place/Centre+Street+N,+Calgary,+AB/",
    "description": "Diverse local shops and restaurants"
  },
  {
    "title": "Highland Park Community Hall",
    "url": "https://www.google.com/maps/place/Highland+Park+Community+Association,+Calgary,+AB/",
    "description": "Local events and recreation hub"
  },
  {
    "title": "16 Avenue NW (TCH)",
    "url": "https://www.google.com/maps/place/16+Avenue+NW,+Calgary,+AB/",
    "description": "Trans-Canada corridor with quick access"
  }
];

const nearbyAreas = ["Tuxedo Park", "Mount Pleasant", "Greenview", "Thorncliffe", "Winston Heights", "Cambrian Heights"];

const faqs = [
  {
    question: "How long does an initial cleaning take?",
    answer: `We work to a checklist, not a clock. Your Highland Park team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
  },
  {
    question: "What cleaning services does Duty Cleaners offer in Highland Park?",
    answer: `The full service menu is available here:\n\n• Commercial Cleaning\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
  },
  {
    question: "Do you offer discounts?",
    answer: `Yes — the discount grows with visit frequency:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off`
  },
  {
    question: "What's included in a deep cleaning?",
    answer: `Beyond the standard scope, deep cleaning covers:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!`
  },
  {
    question: "What is your 100% satisfaction guarantee policy?",
    answer: "If you're not 100% satisfied, call us within 24 hours and we'll return and make it right — at no extra cost!"
  }
];

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Highland Park Calgary",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/highland-park-calgary",
  priceRange: "$155-$539",
  geo: { latitude: "51.0900", longitude: "-114.0750" },
});

export default function HighlandPark() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>House Cleaners in Highland Park, Calgary | Duty Cleaners</title>
        <meta name="description" content="Professional cleaners serving Highland Park, Calgary. Flat rates by home size, vetted and customer-rated pros, pay after your clean." />
        <meta property="og:title" content="House Cleaners in Highland Park, Calgary | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaners in Highland Park, Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="Professional cleaners serving Highland Park, Calgary. Flat rates by home size, vetted and customer-rated pros, pay after your clean." />
        <meta property="og:description" content="Professional cleaners serving Highland Park, Calgary. Flat rates by home size, vetted and customer-rated pros, pay after your clean." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/highland-park-calgary/" />
        <link rel="canonical" href="https://dutycleaners.ca/locations/highland-park-calgary/" />
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
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Highland Park, N Calgary</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Highland Park
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Highland Park sits on a quiet plateau north of downtown — mature trees, character bungalows, and one of Calgary's last truly walkable neighbourhood vibes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341"><Phone className="mr-2 w-5 h-5" />(403) 768-1341</a>
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

        {/* About the Neighbourhood */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Cleaning Services Built for Highland Park Homes</h2>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  <p>Highland Park is a tight-knit N Calgary community of 1940s and '50s character bungalows, generous lots, and tree-lined streets. The community is in the middle of a quiet renaissance, with thoughtful infills appearing alongside lovingly maintained originals.</p>
                  <p>We tailor every clean to your home's character — gentle on original hardwood and trim in older homes, thorough in modern builds. Always with professional products and a 100% satisfaction guarantee.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Highland Park Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Everything from weekly upkeep to full move-out cleans.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((s, i) => <ServiceCard key={i} {...s} />)}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Landmarks */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14 max-w-3xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Landmarks</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Around Highland Park</h2>
                <p className="text-muted-foreground text-lg">
                  We know the area inside and out — here are a few of the places that make Highland Park feel like home.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {landmarks.map((l, i) => (
                  <a key={i} href={l.url} target="_blank" rel="noopener noreferrer"
                     className="group flex gap-4 bg-white rounded-xl border border-border p-5 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:rotate-12">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{l.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{l.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Map */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Find Us</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Highland Park Service Area</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Proudly serving every street in Highland Park and the surrounding N Calgary communities.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
                  <iframe
                    src="https://www.google.com/maps?q=Highland+Park,+Calgary,+AB&output=embed"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    title="Highland Park Calgary Service Area Map"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img width={1024} height={768} src={cleanHomeImg} alt="Bright sanitized bathroom with subway tile in a Highland Park Calgary home cleaned by Duty Cleaners" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                </div>
                <div>
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">A Cleaner You Can Trust</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Sparkling Bathrooms, Soothing Spaces</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    There's something special about walking into a freshly cleaned bathroom — chrome that gleams, tile that sparkles, towels neatly folded. It's the small things that make Highland Park homes feel like a sanctuary.
                  </p>
                  <ul className="space-y-3">
                    {["Customer-rated cleaners","Professional products and equipment","100% satisfaction guarantee"].map((t,i)=>(
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <span className="text-foreground">{t}</span>
                      </li>
                    ))}
                  </ul>
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
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Nearby Communities We Serve</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We proudly serve families and homeowners across Highland Park and surrounding N Calgary communities.
                </p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="Neighbourhood notes"
        heading="Golf course north, cemetery southwest"
        paragraphs={[
          "Two large pieces of open ground shape this place: the Highland golf course across the northern section and Queens Park Cemetery in the southwest corner. Open grass on two flanks means seed heads through late summer and a mowing season's worth of fine organic dust, and it lands on patio glass and screens rather than on floors. Screens here repay coming out and being washed properly rather than wiped in place.",
          "The community dates to 1946, but almost half the buildings now are condominium or apartment and roughly two thirds of the housing is rented. That mix produces two rhythms at once — long-settled owners on the older detached streets, and suites turning over against a possession date — and they need different amounts of time booked for the same square footage.",
        ]}
        accent="calgary"
      />

      <LocationPricing />

        {/* Why Choose Us */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Highland Park Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Trusted locally for reliable, thorough cleaning.
                </p>
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

        {/* CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready for a Spotless Home in Highland Park?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Get your free quote today and experience the Duty Cleaners difference!
              </p>
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
