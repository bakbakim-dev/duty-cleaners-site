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
import oldStrathconaCleanerImg from "@/assets/gallery/old-strathcona-cleaner-home.webp";
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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning to refresh your Old Strathcona home spotless and welcoming.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Old Strathcona" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Comprehensive cleaning of the house, reaching every corner, baseboard, and hidden surface.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Old Strathcona" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for moving day — leave or arrive to a pristine home.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Old Strathcona" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Dust and debris removal after renovations or constructions in the area.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Old Strathcona" },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day openings most weeks. We work around your busy life." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

export default function OldStrathcona() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. The crew stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Old Strathcona?",
      answer: `Households here can book any of the following:\n\n• Commercial Cleaning\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
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
        <title>House Cleaning Old Strathcona Edmonton | Duty Cleaners</title>
        <meta name="description" content="Professional house cleaning in Old Strathcona, Edmonton. Serving the heritage homes of the Whyte Avenue district. Pay after your clean." />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Old Strathcona, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/old-strathcona",
  areaServed: "Old Strathcona, Edmonton, AB",
  description: "Professional house cleaning in Old Strathcona, Edmonton. Serving the heritage homes of the Whyte Avenue district. Pay after your clean.",
}))}</script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/old-strathcona/" />
        <meta property="og:title" content="House Cleaning Old Strathcona Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Professional house cleaning in Old Strathcona, Edmonton. Serving the heritage homes of the Whyte Avenue district. Pay after your clean." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/old-strathcona/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Old Strathcona Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Professional house cleaning in Old Strathcona, Edmonton. Serving the heritage homes of the Whyte Avenue district. Pay after your clean." />
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
                  <span className="text-white/90 text-sm font-medium">Serving Old Strathcona, Edmonton</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  House Cleaning in Old Strathcona
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  Professional cleaning for Edmonton's iconic cultural district. From heritage homes near Whyte Avenue to cozy apartments by the Farmers' Market — enjoy a spotless space in this vibrant community.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:7809136565"><Phone className="mr-2 w-5 h-5" />(780) 913-6565</a>
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
              <div className="flex-shrink-0 w-full max-w-[500px]">
                <img width={896} height={672}
                  src={oldStrathconaCleanerImg}
                  alt="Professional cleaner tidying a stylish loft-style home in Old Strathcona, Edmonton"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* About Old Strathcona */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Residential Cleaning in Old Strathcona</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Old Strathcona is one of Edmonton's most beloved and culturally rich neighbourhoods. Known for its historic{" "}
                    <a href="https://www.google.com/maps/place/Whyte+Avenue,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Whyte Avenue</a>,
                    eclectic mix of boutiques, cafes, live music venues, and the famous{" "}
                    <a href="https://www.google.com/maps/place/Old+Strathcona+Farmers'+Market/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Old Strathcona Farmers' Market</a>,
                    this district is a hub of creativity and community spirit.
                  </p>
                  <p>
                    Whether you live in a charming heritage home along the tree-lined streets, a modern condo near the{" "}
                    <a href="https://www.google.com/maps/place/Walterdale+Bridge,+Edmonton,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Walterdale Bridge</a>,
                    or an apartment close to the{" "}
                    <a href="https://www.google.com/maps/place/ATB+Financial+Arts+Barns/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Arts Barns</a>,
                    we bring a personal, attentive approach to every visit. We understand the unique character of Old Strathcona homes and treat each one with care.
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Old Strathcona Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Upkeep, deep cleans, move-outs: the whole toolkit in one place.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Old Strathcona Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">Trusted by Old Strathcona families for reliable, thorough cleaning.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => <WhyUsCard key={i} {...item} />)}
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
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">We Know Old Strathcona</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We're in and around the neighbourhood daily, so we know the area well.</p>
                </div>
                <CoverageChips areas={["Whyte Avenue", "Old Strathcona Farmers' Market", "Walterdale Bridge", "Arts Barns", "River Valley Trails", "Garneau Theatre"]} variant="compact" />
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">View All Service Areas →</Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="Ground truth"
        heading="Pre-1913 houses off Whyte Avenue"
        paragraphs={[
          "The oldest houses on the blocks off Whyte Avenue went up before Strathcona amalgamated with Edmonton in 1912, in the boom that began when the Calgary and Edmonton Railway arrived in 1891. Plaster walls and softwood floors do not behave like drywall and engineered plank. Plaster takes a damp cloth rather than a wet one, and a floor that soft is scratched by whatever gets tracked across it, not by the mop.",
          "These are also the blocks that host the Fringe each August — the oldest and largest festival of its kind in North America, staged in and around Old Strathcona. Residents near the venues spend that stretch with visitors coming and going off the street, and a hundred-year-old floor registers every bit of it. Mats at each door and a dry sweep before anything wet goes down are worth more here than any product.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Map */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Old Strathcona Service Area</h2>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-primary/10">
                  <iframe
                    title="Old Strathcona Edmonton Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9460!2d-113.5!3d53.5195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a0221b2e8b0e5d%3A0x1!2sOld+Strathcona%2C+Edmonton%2C+AB!5e0!3m2!1sen!2sca!4v1"
                    width="100%" height="400" style={{ border: 0 }} allowFullScreen loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready for a Spotless Home in Old Strathcona?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Get your free quote today and experience the Duty Cleaners difference!</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565"><Phone className="mr-2 w-5 h-5" />Call (780) 913-6565</a>
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
