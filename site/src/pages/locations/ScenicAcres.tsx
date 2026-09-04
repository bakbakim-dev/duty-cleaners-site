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
  Home, Sparkles, Truck, SprayCan, Bath, Building2,
  Leaf, Users, CalendarCheck, ThumbsUp, Mountain, TreePine
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { buildLocationSchema } from "@/lib/location-schema";
import CoverageChips from "@/components/CoverageChips";
import LocationPricing from "@/components/LocationPricing";
import calgaryKitchen from "@/assets/gallery/calgary-kitchen-clean.webp";

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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning that resets the whole home, room by room.", to: "/calgary/regular-cleaning/", linkText: "Standard cleaning in Scenic Acres" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Top-to-bottom detail that reaches what weekly cleaning never does.", to: "/calgary/deep-cleaning/", linkText: "Deep cleaning in Scenic Acres" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for smooth transitions — leave or arrive to a pristine home near Crowfoot Crossing.", to: "/move-out-cleaning-calgary/", linkText: "Move-out cleaning in Scenic Acres" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Expert dust and debris removal after renovations or new builds in Scenic Acres.", to: "/post-construction-cleaning-calgary/", linkText: "Post-construction cleaning in Scenic Acres" },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: Building2, title: "Commercial Cleaning", description: "Professional office and commercial space cleaning for businesses near Scenic Acres." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability in Scenic Acres. We work around your busy life." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const nearbyAreas = ["Tuscany", "Arbour Lake", "Citadel", "Hawkwood", "Ranchlands", "Varsity", "Silver Springs", "Dalhousie"];

const faqs = [
  {
    question: "How long does an initial cleaning take?",
    answer: `We work to a checklist, not a clock. Your Scenic Acres team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
  },
  {
    question: "What cleaning services does Duty Cleaners offer in Scenic Acres?",
    answer: `We offer:\n\n• Commercial Cleaning\n• Standard Cleaning & Deep Cleaning Packages\n• Move-In And Move-Out Cleaning Service\n• Post Construction Cleaning\n• Wall Washing and Wall Cleaning`
  },
  {
    question: "Do you offer discounts?",
    answer: `We offer recurring discounts for our Standard and Deep Cleaning Packages.\n\nIf you avail of our recurring discount, on your next cleaning:\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off`
  },
  {
    question: "What's included in a deep cleaning?",
    answer: `Deep cleaning adds the following to our standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!`
  },
  {
    question: "What is your 100% satisfaction guarantee policy?",
    answer: "If anything was missed, call within 24 hours and we'll re-clean the areas of concern free of charge."
  }
];

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Scenic Acres Calgary",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/scenic-acres",
  description: "Professional house cleaning in Scenic Acres, Calgary. Peaceful NW community beside Twelve Mile Coulee. 100% satisfaction guarantee. Call (403) 768-1341.",
  priceRange: "$$",
  geo: { latitude: "51.0983", longitude: "-114.1933" },
});

export default function ScenicAcres() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>House Cleaning Services Scenic Acres Calgary | Duty Cleaners</title>
        <meta name="description" content="Professional house cleaning in Scenic Acres, Calgary. Peaceful NW community beside Twelve Mile Coulee. 100% satisfaction guarantee." />
        <meta name="keywords" content="house cleaning Scenic Acres Calgary, cleaning services Scenic Acres, maid service Scenic Acres Calgary, home cleaning Northwest Calgary" />
        <meta property="og:title" content="House Cleaning Services Scenic Acres Calgary | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Services Scenic Acres Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="Professional house cleaning in Scenic Acres, Calgary. Peaceful NW community beside Twelve Mile Coulee. 100% satisfaction guarantee." />
        <meta property="og:description" content="Professional house cleaning in Scenic Acres, Calgary. Peaceful NW community beside Twelve Mile Coulee. 100% satisfaction guarantee." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/scenic-acres/" />
        <link rel="canonical" href="https://dutycleaners.ca/locations/scenic-acres/" />
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
                  <TreePine className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Scenic Acres, Calgary NW</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  House Cleaning Services in Scenic Acres, Calgary
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  Professional cleaning for one of Calgary's most peaceful neighbourhoods. Customer-rated cleaners trusted by families living beside Twelve Mile Coulee.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:4037681341">
                      <Phone className="mr-2 w-5 h-5" />(403) 768-1341
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <Link to="/calgary/pricing/">See My Instant Price</Link>
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
                  src={calgaryKitchen}
                  alt="A spotless kitchen after a Duty Cleaners visit in Calgary"
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Cleaning Services Tailored to Scenic Acres Living
                </h2>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  <p>
                    Scenic Acres is one of Calgary's most peaceful and established neighbourhoods, located in the northwest, close to the{" "}
                    <a href="https://www.google.com/maps/place/Twelve+Mile+Coulee+Natural+Environment+Park,+Calgary,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Twelve Mile Coulee</a>.
                    This community is perfect for nature lovers, offering immediate access to some of the city's most scenic trails and green spaces. Residents enjoy watching wildlife, hiking through natural prairies, and taking in stunning views of the city and mountains.
                  </p>
                  <p>
                    The neighbourhood has a friendly, family-oriented atmosphere with excellent schools, quiet streets, and mature trees. Conveniently located near{" "}
                    <a href="https://www.google.com/maps/place/Crowfoot+Crossing,+Calgary,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Crowfoot Crossing</a>{" "}
                    and with easy access to the{" "}
                    <a href="https://www.google.com/maps/place/Crowfoot+Station,+Calgary,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Crowfoot LRT Station</a>,
                    Scenic Acres provides all the amenities you need while maintaining its tranquil, nature-focused character. After a day of exploring{" "}
                    <a href="https://www.google.com/maps/place/Scenic+Acres+Community+Association,+Calgary,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Scenic Acres Community Centre</a>{" "}
                    or the nearby trails, let Duty Cleaners take care of your home so you can relax in a spotless space.
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
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-6">Scenic Acres Service Area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d20000!2d-114.1933!3d51.0983!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53716e0d1b0a1e5d%3A0x2c8e5e3a1b0d8f1a!2sScenic+Acres%2C+Calgary%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    title="Scenic Acres Service Area Map"
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
                  Scenic Acres & Nearby Neighbourhoods We Serve
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  We proudly serve families and homeowners across Scenic Acres and surrounding NW Calgary communities.
                </p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="On the ground"
        heading="Coulee trails and commuter grit"
        paragraphs={[
          "Across Stoney Trail on the western edge, 12 Mile Coulee drops toward the Bow through native grassland and aspen. The pathway along the top of the ridge is paved, but the trails down in the coulee itself are dirt, and those are the ones that show up in our work. Melt weeks put mud on paws and boot soles; late summer sends grass seed and burrs home in coats and sock cuffs. Entry mats and stair treads catch nearly all of it.",
          "There is no road from Scenic Acres to its own C-Train stop. Crowfoot station sits in the median of Crowchild Trail along the northern boundary, and the way across is a pedestrian overpass. From November to April that walk covers sanded walkways and a bridge deck above a sanded freeway, and the grit finishes its trip indoors - in entryway grout, in door tracks, and on the first flight of stairs.",
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
                  Cleaning Services for Scenic Acres Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  From routine upkeep to deep cleans and move-outs, we have every service your home near Crowfoot Crossing needs.
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
                  Why Scenic Acres Residents Choose Duty Cleaners
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

        {/* FAQ */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">FAQ</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">
                        {faq.answer}
                      </AccordionContent>
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
                Ready for a Spotless Home in Scenic Acres?
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Get your free quote today and experience the Duty Cleaners difference!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341">
                    <Phone className="mr-2 w-5 h-5" />(403) 768-1341
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <Link to="/calgary/pricing/">See My Instant Price</Link>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
        </main>
      </div>

      <Footer />
    </>
  );
}
