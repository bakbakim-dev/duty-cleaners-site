import { canonicalUrlForPath } from "@/data/legacy-urls";
import { useEffect } from "react";
import Navigation from "@/components/Navigation";
import heroFamilyBedroom from "@/assets/hero-family-bedroom.jpg";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Phone, CheckCircle2, Star, Shield, Clock, Award,
  Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed,
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail
} from "lucide-react";

interface LocationPageProps {
  city: string;
  region: "edmonton" | "calgary";
  title: string;
  description: string;
  phone: string;
  phoneLink: string;
  /** Real, verbatim-sourced "Things To Do" paragraphs for this town, if confirmed. */
  thingsToDo?: string[];
  /**
   * Set for places that are their OWN municipality rather than a neighbourhood
   * of the region's main city. Black Diamond is a town near Calgary, not part
   * of it, so "Black Diamond, Calgary, AB" is geographically false.
   */
  isOwnMunicipality?: boolean;
}

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
  { icon: Home, title: "Standard House Cleaning", description: "Weekly or bi-weekly maintenance to keep your home spotless and fresh year-round." },
  { icon: Sparkles, title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning reaching every corner, baseboard, and hidden surface." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for smooth transitions — leave or arrive to a pristine home." },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Expert dust and debris removal after renovations or new builds in the area." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Customer-Rated Cleaners", description: "Every cleaner is reference-checked before working in a customer’s home." },
  { icon: Star, title: "Five-Star Rated", description: "Trusted by thousands of Alberta families with verified Google reviews." },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability. We work around your busy life." },
  { icon: Leaf, title: "High Quality Cleaning Supplies", description: "Safe for your family, pets, and the planet — without compromising on clean." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

export default function LocationPageTemplate({
  city,
  region,
  title,
  description,
  phone,
  phoneLink,
  thingsToDo,
  isOwnMunicipality = false,
}: LocationPageProps) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  const { pathname } = useLocation();
  const regionLabel = region === "edmonton" ? "Edmonton" : "Calgary";
  // One resolved URL for canonical, og:url and JSON-LD. Using the raw pathname
  // here made the schema url and og:url disagree with the canonical on every
  // preserved legacy route (e.g. /locations/black-diamond vs its real canonical
  // /cleaning-services-black-diamond/).
  const canonicalUrl = canonicalUrlForPath(pathname);
  const jsonLd = buildLocationSchema({
    name: `Duty Cleaners - ${city} ${regionLabel}`,
    city: region,
    url: canonicalUrl,
    description,
    areaServed: isOwnMunicipality ? `${city}, AB` : `${city}, ${regionLabel}, AB`,
  });

  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: `What cleaning services does Duty Cleaners offer in ${city}?`,
      answer: `We offer a full range of services:\n\n• Commercial Cleaning\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes! We offer recurring discounts:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `Deep cleaning adds to our standard package:\n\n• Clean outside AC outlet panels\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!`
    },
    {
      question: "What is your 100% satisfaction guarantee policy?",
      answer: "If you're not 100% satisfied, call us within 24 hours and we'll return to make it right — at no extra cost!"
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
    <div className="min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <Navigation city={region} />
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">
        <img
          src={heroFamilyBedroom}
          alt="Happy family laughing in a clean, freshly cleaned bedroom"
          width={1920}
          height={1280}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Serving {city}, {regionLabel}</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Professional House Cleaning in {city}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href={phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />{phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                <a href="#quote">See My Instant Price</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: CheckCircle2, text: "Pay After Your Clean" },
                { icon: CalendarCheck, text: "Same-Day Available" },
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

      {thingsToDo && thingsToDo.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Life</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Things To Do In {city}
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  {thingsToDo.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Cleaning Services for {city} Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                From routine upkeep to deep cleans and move-outs, we have every service your home needs.
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
                Why {city} Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Trusted by families across {regionLabel} for reliable, thorough cleaning with non-toxic products.
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
              Proudly Serving {city} & Surrounding Areas
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We provide professional house cleaning services throughout {city} and nearby communities in the {regionLabel} region.
            </p>
            <Link to="/locations" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            {/* Commercial cross-link: Search Console shows office/commercial
                queries for these towns ranking 20-40 with zero clicks. */}
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in {city}? We also handle{" "}
              <Link
                to={region === "calgary" ? "/commercial-cleaning-services-calgary" : "/commercial-cleaning"}
                className="text-primary hover:underline font-medium"
              >
                commercial and office cleaning across the {regionLabel} region
              </Link>
              .
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
              Ready for a Spotless Home in {city}?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Get your free quote today and experience the Duty Cleaners difference!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href={phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />Call {phone}
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

      <Footer />
    </div>
  );
}
