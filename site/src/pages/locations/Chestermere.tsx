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
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, Building2
} from "lucide-react";
import chestermereImg from "@/assets/gallery/chestermere-landmark.webp";
import { buildLocationSchema } from "@/lib/location-schema";
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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning that resets the whole home, room by room." },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces regular visits skip." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for smooth transitions — leave or arrive to a pristine lakeside home." },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Expert dust and debris removal after renovations or new builds in Chestermere." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: Building2, title: "Commercial Cleaning", description: "Professional office and commercial space cleaning for Chestermere businesses of all sizes." },
];

const whyUsItems = [
  { icon: Shield, title: "Customer-Rated Cleaners", description: "Every cleaner is reference-checked before working in a customer’s home." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day slots when the schedule allows. We work around your busy life." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const nearbyAreas = ["Westmere", "Kinniburgh", "Lakepointe", "Rainbow Falls", "Dawson's Landing", "Shores", "Waterford", "The Cove"];

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Chestermere",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/chestermere",
  areaServed: "Chestermere, AB",
  priceRange: "$155-$539",
});

export default function Chestermere() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Chestermere?",
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
      answer: "If you're not 100% satisfied, call us within 24 hours and we'll come back and put it right — at no extra cost!"
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
        <title>House Cleaning Services in Chestermere, AB | Duty Cleaners</title>
        <meta name="description" content="Professional cleaners serving Chestermere. Flat rates by home size, vetted and customer-rated pros, pay after your clean." />
        <meta property="og:title" content="House Cleaning Services in Chestermere, AB | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Services in Chestermere, AB | Duty Cleaners" />
        <meta name="twitter:description" content="Professional cleaners serving Chestermere. Flat rates by home size, vetted and customer-rated pros, pay after your clean." />
        <meta property="og:description" content="Professional cleaners serving Chestermere. Flat rates by home size, vetted and customer-rated pros, pay after your clean." />
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
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Chestermere, Calgary Region</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Professional House Cleaning in Chestermere
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  Trusted house cleaning services in Chestermere, AB. Customer-rated cleaners loved by lakeside families — from Kinniburgh to Rainbow Falls.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:4037681341">
                      <Phone className="mr-2 w-5 h-5" />(403) 768-1341
                    </a>
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
                <img width={1024} height={1024}
                  src={chestermereImg}
                  alt="Chestermere Lake at golden hour — the heart of this vibrant lakeside community east of Calgary"
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Cleaning Services Tailored to Chestermere Living
                </h2>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  <p>
                    Chestermere is a beautiful lakeside city just east of Calgary, centered around the iconic{" "}
                    <a href="https://www.google.com/maps/place/Chestermere+Lake/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Chestermere Lake</a>,
                    known for boating, paddleboarding, and family-friendly beaches. Whether your home overlooks the lake
                    in{" "}
                    <a href="https://www.google.com/maps/place/Kinniburgh,+Chestermere,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Kinniburgh</a>,
                    is near the scenic pathways of{" "}
                    <a href="https://www.google.com/maps/place/John+Peake+Park,+Chestermere,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">John Peake Park</a>,
                    or in one of the newer developments around{" "}
                    <a href="https://www.google.com/maps/place/Dawson's+Landing,+Chestermere,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Dawson's Landing</a>,
                    our team knows Chestermere well and is ready to keep your home spotless.
                  </p>
                  <p>
                    From the established neighbourhoods of{" "}
                    <a href="https://www.google.com/maps/place/Westmere,+Chestermere,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Westmere</a>{" "}
                    to the growing community of{" "}
                    <a href="https://www.google.com/maps/place/Rainbow+Falls,+Chestermere,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Rainbow Falls</a>,
                    we provide flexible scheduling and cleaning suited to every lakeside household.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      {/* Things To Do */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Life</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Things To Do In Chestermere
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>Located just east of Calgary, Chestermere is a beautiful lakeside city known for its vibrant community and outdoor recreational opportunities. With a population of over 20,000, Chestermere combines small-town charm with the convenience of city amenities. Start your day with a visit to Chestermere Lake, the heart of the community, perfect for boating, kayaking, paddleboarding, and even swimming during the summer months. For a scenic stroll or a bike ride, the Chestermere Pathway System offers picturesque views around the lake and throughout the city. If you’re into golf, Lakeside Golf Club offers a beautiful course with stunning views and a relaxed atmosphere.</p>
                <p>Families can enjoy a fun day at John Peake Park, which features playgrounds, picnic spots, and a boat launch. For shopping and dining, check out Chestermere Station, a bustling hub with local shops, boutiques, and cozy restaurants. The Canadian Brewhouse is on Chestermere Station Way. After a day of exploring Chestermere, come home to a spotless space with the help of Duty Cleaners.</p>
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
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-6">Chestermere Service Area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25182.0!2d-113.82!3d51.05!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537170e3a5b7e2b7%3A0x1c2e5e3a0c1b1a0!2sChestermere%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    title="Chestermere Service Area Map"
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
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                  Chestermere Neighbourhoods We Serve
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We proudly serve families and homeowners across all Chestermere communities.
                </p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="Reservoir town"
        heading="Nothing natural about this lake"
        paragraphs={[
          "The CPR dammed this slough into a lake in 1907 for irrigation, and it is still plumbed that way — canal-fed from the Bow River, draining out through two more canals, five kilometres long and nowhere deeper than seven metres. The city stands on every side of it. No home here sits far from open water, and no season here is a dry one at the back door.",
          "Summer is swimming, windsurfing and fishing; winter is skating on the same surface. Wet gear comes through the back door twelve months a year, which makes damp the recurring problem rather than dirt — mats that never fully dry, thresholds that darken at the edges, a mudroom that smells before it looks dirty. Air movement and dry storage fix more here than any cleaning product does.",
        ]}
        accent="calgary"
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Services */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  Cleaning Services for Chestermere Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  From routine upkeep to deep cleans and move-outs, we have every service your lakeside home needs.
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
                  Why Chestermere Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Trusted by families across the Calgary region for reliable, thorough cleaning.
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

        {/* Service Areas */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Proudly Serving Chestermere & Surrounding Areas
              </h2>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                We provide professional house cleaning services throughout Chestermere and nearby communities in the Calgary region.
              </p>
              <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                View All Service Areas →
              </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Chestermere? We also handle{" "}
              <Link to="/commercial-cleaning-services-calgary/" className="text-primary hover:underline font-medium">
                commercial and office cleaning across the Calgary region
              </Link>.
            </p>

            </AnimatedSection>
          </div>
        </section>

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
                Ready for a Spotless Home in Chestermere?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Get your free quote today and experience the Duty Cleaners difference!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341">
                    <Phone className="mr-2 w-5 h-5" />Call (403) 768-1341
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
