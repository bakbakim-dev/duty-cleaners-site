import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import {
  Phone, CheckCircle2, Star, Shield, Clock, Award,
  Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed,
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail
} from "lucide-react";
import leducChildDog from "@/assets/gallery/leduc-child-dog-clean-home.webp";
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
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning to refresh your home spotless and fresh year-round." },
  { icon: Sparkles, title: "Deep Cleaning", description: "Thorough top-to-bottom cleaning reaching every corner, baseboard, and hidden surface." },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for smooth transitions — leave or arrive to a pristine home." },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Expert dust and debris removal after renovations or new builds in the area." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Customer-Rated Cleaners", description: "Every cleaner is reference-checked before working in a customer’s home." },
  { icon: Star, title: "4.9 on Google", description: "Trusted by thousands of Alberta families with verified Google reviews." },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability. We work around your busy life." },
  { icon: Leaf, title: "High Quality Cleaning Supplies", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners trained to Duty Cleaners' exacting quality standards." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const nearbyAreas = [
  "Nisku", "Beaumont", "Devon", "Calmar", "Millet",
  "New Sarepta", "Thorsby", "Warburg"
];

export default function Leduc() {
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Leduc?",
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
        <title>House Cleaning Leduc, AB | Duty Cleaners</title>
        <meta name="description" content="Professional house cleaning in Leduc, from Telford Lake to Fred Johns Park. Standard, deep and move-out cleans at a flat price you see before booking." />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta property="og:title" content="House Cleaning Leduc, AB | Duty Cleaners" />
        <meta property="og:description" content="Professional house cleaning in Leduc, from Telford Lake to Fred Johns Park. Standard, deep and move-out cleans at a flat price you see before booking." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Leduc, AB | Duty Cleaners" />
        <meta name="twitter:description" content="Professional house cleaning in Leduc, from Telford Lake to Fred Johns Park. Standard, deep and move-out cleans at a flat price you see before booking." />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Leduc, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-leduc", areaServed: "Leduc, AB" }))}</script>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Leduc, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Leduc
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Top-rated house cleaning services in Leduc. Thorough cleaning with all supplies included.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />780-913-6565
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
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
              <img width={1024} height={768}
                src={leducChildDog}
                alt="A child and dog playing together in a freshly cleaned home in Leduc, Alberta"
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
                Cleaning Services Tailored to Leduc Living
              </h2>
              <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                <p>
                  Leduc is a thriving city just south of Edmonton, known for its welcoming community, growing neighbourhoods, and convenient access to the Edmonton International Airport. Whether your home is near{" "}
                  <a href="https://www.google.com/maps/place/Fred+Johns+Park,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    Fred Johns Park
                  </a>{" "}
                  or close to the shops along{" "}
                  <a href="https://www.google.com/maps/place/50+Ave,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    50th Avenue
                  </a>, our team knows the area and delivers spotless results every time.
                </p>
                <p>
                  Families enjoying the trails around{" "}
                  <a href="https://www.google.com/maps/place/Telford+Lake,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    Telford Lake
                  </a>{" "}
                  or spending weekends at the{" "}
                  <a href="https://www.google.com/maps/place/Leduc+Recreation+Centre/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    Leduc Recreation Centre
                  </a>{" "}
                  deserve a home that's just as clean and inviting as the community around them. We bring professional products and meticulous attention to detail to every Leduc home we service.
                </p>
                <p>
                  From the established streets near{" "}
                  <a href="https://www.google.com/maps/place/William+F.+Lede+Park,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                    William F. Lede Park
                  </a>{" "}
                  to the newer developments in Southfork and Bridgeport, Duty Cleaners is proud to keep Leduc homes sparkling.
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
                Things To Do In Leduc
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>Nestled in the heart of Alberta lies Leduc, a captivating city that seamlessly intertwines the warmth of a small-town atmosphere with the vast array of opportunities found in larger urban centres. Leduc also boasts a rich history rooted in agriculture, oil, and gas, which is celebrated at the Leduc #1 Energy Discovery Centre, where you can explore the city's pivotal role in the energy industry. If you want to take a stroll, get to the beautiful Telford Lake Park (named after the city's founder), where you can enjoy a serene waterfront oasis with walking trails, picnic areas, and a beach. Go for an immersive cultural experience, and attend a performance at the Maclab Centre for the Performing Arts, a state-of-the-art venue hosting diverse theatrical productions. Lastly, end your day savouring a craft beer at Rig Hand Distillery, a local hotspot renowned for its unique brews and friendly atmosphere.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-8">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Find Us in Leduc
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We serve all of Leduc and surrounding communities including Nisku, Beaumont, and Devon.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75904.04936517384!2d-113.59!3d53.26!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a018e7b3e3f5ab%3A0x60e2ac0e20373bfa!2sLeduc%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Leduc Service Area Map"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Cleaning Services for Leduc Homes
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
                Why Leduc Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Trusted by families across Edmonton for reliable, thorough cleaning.
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

      {/* Local Coverage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              Proudly Serving Leduc & Surrounding Areas
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We provide professional house cleaning services throughout Leduc and nearby communities in the Edmonton region.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Leduc? We also handle 
              <Link to="/commercial-cleaning" className="text-primary hover:underline font-medium">
                commercial and office cleaning across the Edmonton region
              </Link>.
            </p>

          </AnimatedSection>
        </div>
      </section>

      <LocationPricing />

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
              Ready for a Spotless Home in Leduc?
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
  );
}
