import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import {
  Phone, CheckCircle2, Star, Shield, Clock, Award,
  Home, Sparkles, Truck, Building2, HardHat, Bath,
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail
} from "lucide-react";
import terwillegarCleanerImg from "@/assets/gallery/terwillegar-cleaner-bathroom.jpg";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

const TerwillegarMap = lazy(() => import("@/components/TerwillegarMap"));

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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning to refresh your Terwillegar home welcoming and fresh every week." },
  { icon: Sparkles, title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning reaching every corner — perfect after outdoor adventures." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for smooth transitions in Terwillegar's active real estate market." },
  { icon: HardHat, title: "Post-Construction Cleanup", description: "Expert dust and debris removal after renovations or new builds in the area." },
  { icon: Building2, title: "Office & Commercial Cleaning", description: "A clean workspace promotes productivity for Terwillegar's local businesses." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
];

const whyUsItems = [
  { icon: Shield, title: "Customer-Rated Cleaners", description: "Every cleaner is reference-checked before working in a customer’s home." },
  { icon: Star, title: "4.9 on Google", description: "Trusted by thousands of Alberta families with verified Google reviews." },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability. We work around your busy life." },
  { icon: Leaf, title: "High Quality Cleaning Supplies", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

export default function Terwillegar() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "Do you serve all areas of Terwillegar?",
      answer: "Yes! We serve Terwillegar Towne, Terwillegar Gardens, South Terwillegar, and all surrounding areas including Magrath Heights."
    },
    {
      question: "Can you handle homes with pets?",
      answer: "Absolutely! Many Terwillegar families have dogs (we know the off-leash park is popular!). We're experienced with pet-friendly homes and can address pet hair and outdoor messes."
    },
    {
      question: "Do you offer move-in/move-out cleaning?",
      answer: "Yes! We offer comprehensive move-in and move-out cleaning services perfect for Terwillegar's active real estate market."
    },
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Terwillegar?",
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
    <>
      <Helmet>
        <title>Home Cleaning You Can Count On in Terwillegar, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Trusted local house cleaning in Terwillegar, Edmonton. Cleaners serving Terwillegar Park, Magrath Heights and surrounding areas." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/terwillegar/" />
        <meta property="og:title" content="Home Cleaning You Can Count On in Terwillegar, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Trusted local house cleaning in Terwillegar, Edmonton. Cleaners serving Terwillegar Park, Magrath Heights and surrounding areas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/terwillegar/" />
        <meta property="og:image" content="https://dutycleaners.ca/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Home Cleaning You Can Count On in Terwillegar, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Trusted local house cleaning in Terwillegar, Edmonton. Cleaners serving Terwillegar Park, Magrath Heights and surrounding areas." />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Terwillegar, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/terwillegar",
  areaServed: "Terwillegar, Edmonton, AB",
  description: "Professional house cleaning services in Terwillegar, Edmonton.",
}))}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="min-h-screen">
        <Navigation city="edmonton" />
        <main id="main-content" tabIndex={-1}>

        {/* Hero */}
        <section className="relative py-24 bg-brand-navy overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Terwillegar, Edmonton</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Home Cleaning You Can Count On in Terwillegar
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  More time on the trails, less time cleaning — trusted local service for nature-connected homes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:7809136565"><Phone className="mr-2 w-5 h-5" />780-913-6565</a>
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
                  src={terwillegarCleanerImg}
                  alt="Professional cleaner cleaning a bathroom in Terwillegar, Edmonton"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* About Terwillegar */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Residential Cleaning in Terwillegar</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Terwillegar is truly a gem in Southwest Edmonton, offering the best of both worlds — urban convenience and natural beauty. With direct access to <a href="https://www.google.com/maps/search/Terwillegar+Park+Edmonton" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Terwillegar Park</a> and the North Saskatchewan River Valley, this neighbourhood attracts families, outdoor enthusiasts, and anyone who values a connection to nature.
                  </p>
                  <p>
                    Whether you live near the park trails or in a newer build along <a href="https://www.google.com/maps/search/Terwillegar+Drive+Edmonton" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Terwillegar Drive</a>, we bring a personal, attentive approach to each visit. Our team handles everything from mudroom messes to spotless living spaces with care.
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Terwillegar Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Find the perfect cleaning package for your nature-connected home.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((s, i) => <ServiceCard key={i} {...s} />)}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Commitment</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Trust Starts at the Door</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>Good service starts long before we pick up a cloth or vacuum. It begins with trust, and that trust is earned through reliability, respect, and a commitment to doing things right.</p>
                  <p>Many of our Terwillegar clients have worked with us for years, referring friends and neighbours along the way. You'll see familiar faces and receive the kind of dependable service that makes things easier — not more complicated.</p>
                </div>
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
                <span className="text-white text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Terwillegar Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">Trusted by families across Edmonton for reliable, thorough cleaning.</p>
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
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">We Know Terwillegar</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We're in and around the neighbourhood daily, so we know the area's pace and personality well.</p>
                </div>
                <CoverageChips areas={["Terwillegar Park & Trails", "Terwillegar Towne", "Terwillegar Gardens", "South Terwillegar", "Magrath Heights", "Terwillegar Recreation Centre"]} variant="compact" />
                <div className="text-center mt-8">
                  <Link to="/locations" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">View All Service Areas →</Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Map */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Terwillegar Service Area</h2>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-primary/10">
                  <Suspense fallback={<div className="w-full h-[400px] bg-muted animate-pulse rounded-2xl" />}>
                    <TerwillegarMap />
                  </Suspense>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <HonestReviewLink city="Edmonton" area="Terwillegar" />

        {/* Final CTA */}
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

        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Let's Take Cleaning Off Your Plate</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Enjoy Terwillegar's trails and lifestyle while we take care of the cleaning. Call us today or request your free quote.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565"><Phone className="mr-2 w-5 h-5" />Call 780-913-6565</a>
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
