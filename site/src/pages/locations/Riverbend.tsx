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
import riverbendCleanerImg from "@/assets/gallery/riverbend-cleaner-family-room.jpg";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

const RiverbendMap = lazy(() => import("@/components/RiverbendMap"));

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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning to refresh your established Riverbend home welcoming and fresh." },
  { icon: Sparkles, title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning — from hardwood floors to baseboards, handled with care." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for smooth transitions in Riverbend's active real estate market." },
  { icon: HardHat, title: "Post-Construction Cleanup", description: "Expert dust and debris removal after renovations to established homes." },
  { icon: Building2, title: "Office & Commercial Cleaning", description: "Professional workspace cleaning for businesses near Southgate Centre." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
];

const whyUsItems = [
  { icon: Shield, title: "Customer-Rated Cleaners", description: "Every cleaner is reference-checked before working in a customer’s home." },
  { icon: Star, title: "Five-Star Rated", description: "Trusted by thousands of Alberta families with verified Google reviews." },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability. We work around your busy life." },
  { icon: Leaf, title: "High Quality Cleaning Supplies", description: "Safe for your family, pets, and the planet — without compromising on clean." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners experienced with mature homes and delicate surfaces." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

export default function Riverbend() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "Do you serve all of Riverbend?",
      answer: "Yes! We serve all areas of Riverbend including Brander Gardens, Rhatigan Ridge, Ramsay Heights, and surrounding neighborhoods."
    },
    {
      question: "How do you handle older homes with special care needs?",
      answer: "Our team is experienced with mature homes. We use appropriate products for hardwood floors, vintage fixtures, and delicate surfaces, always taking extra care with cherished features."
    },
    {
      question: "Can I book recurring cleaning services?",
      answer: "Absolutely! Many Riverbend families prefer weekly or bi-weekly cleaning. We offer flexible scheduling and priority booking for regular clients."
    },
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Riverbend?",
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
        <title>Home Cleaning You Can Count On in Riverbend, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Trusted, local house cleaning service for homes in Riverbend, Edmonton. Professional cleaners serving Brander Gardens, Rhatigan Ridge, Southgate area, and surrounding streets." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/riverbend/" />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Riverbend, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/riverbend",
  areaServed: "Riverbend, Edmonton, AB",
  description: "Professional house cleaning services in Riverbend, Edmonton.",
}))}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="min-h-screen">
        <Navigation city="edmonton" />

        {/* Hero */}
        <section className="relative py-24 bg-brand-navy overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Riverbend, Edmonton</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Home Cleaning You Can Count On in Riverbend
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  Trusted, local service for one of Edmonton's most cherished established communities.
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
                  src={riverbendCleanerImg}
                  alt="Professional cleaner mopping a cozy family room in Riverbend, Edmonton"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* About Riverbend */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Residential Cleaning in Riverbend</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>
                    Riverbend is one of Southwest Edmonton's most treasured neighborhoods, known for its mature trees, established homes, and incredible sense of community. For decades, families have chosen Riverbend for its proximity to <a href="https://www.google.com/maps/search/Southgate+Centre+Edmonton" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Southgate Centre</a>, excellent schools, and beautiful parks.
                  </p>
                  <p>
                    Whether you live in a classic family home near <a href="https://www.google.com/maps/search/Brander+Gardens+Edmonton" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Brander Gardens</a> or a well-kept property along <a href="https://www.google.com/maps/search/Riverbend+Road+Edmonton" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Riverbend Road</a>, we bring experience with mature homes and a personal, attentive approach to every visit.
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Riverbend Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Quality care your established home deserves.</p>
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
                  <p>Many of our Riverbend clients have worked with us for years, referring friends and neighbours along the way. We understand hardwood floors, older fixtures, and the care that established homes require.</p>
                  <p>You'll see familiar faces and receive the kind of dependable service that makes things easier — not more complicated. We treat every Riverbend home like our own.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Riverbend Families Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">Trusted by families across Edmonton for reliable, thorough, and non-toxic cleaning.</p>
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
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">We Know Riverbend</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">We're in and around the neighbourhood daily, so we know the area's pace and personality well.</p>
                </div>
                <CoverageChips areas={["Brander Gardens", "Rhatigan Ridge", "Ramsay Heights", "Southgate Centre Area", "Riverbend Road", "Whitemud Drive Corridor"]} variant="compact" />
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
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Riverbend Service Area</h2>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-primary/10">
                  <Suspense fallback={<div className="w-full h-[400px] bg-muted animate-pulse rounded-2xl" />}>
                    <RiverbendMap />
                  </Suspense>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <HonestReviewLink city="Edmonton" area="Riverbend" />

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
                Trust your cherished home to Edmonton's favorite cleaning team. Call us today or request your free quote — no pressure, no hassle.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565"><Phone className="mr-2 w-5 h-5" />Call 780-913-6565</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="https://dutycleaners.ca/get-a-quote/"><Mail className="mr-2 w-5 h-5" />See My Instant Price</a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
