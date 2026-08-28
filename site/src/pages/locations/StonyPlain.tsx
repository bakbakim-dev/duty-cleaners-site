import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LocationPricing from "@/components/LocationPricing";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import {
  Phone, CheckCircle2, Star, Shield, Clock, Award,
  Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed,
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, ExternalLink
} from "lucide-react";
import stonyPlainHome from "@/assets/gallery/stony-plain-home.jpg";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

const landmarks = [
  { name: "Heritage Park", url: "https://www.google.com/maps/place/Heritage+Park,+Stony+Plain,+AB/" },
  { name: "Rotary Park", url: "https://www.google.com/maps/place/Rotary+Park,+Stony+Plain,+AB/" },
  { name: "Stony Plain Pioneer Museum", url: "https://www.google.com/maps/place/Multicultural+Heritage+Centre,+Stony+Plain,+AB/" },
  { name: "Main Street (50th Avenue)", url: "https://www.google.com/maps/place/50+Ave,+Stony+Plain,+AB/" },
  { name: "Whispering Waters Park", url: "https://www.google.com/maps/place/Whispering+Waters+Park,+Stony+Plain,+AB/" },
  { name: "Stony Plain Golf Course", url: "https://www.google.com/maps/place/Stony+Plain+Golf+Course,+Stony+Plain,+AB/" },
];

const nearbyCommunities = ["Spruce Grove", "Parkland County", "Acheson", "Carvel", "Duffield"];

export default function StonyPlain() {
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Stony Plain?",
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
        <title>House Cleaning Stony Plain, AB | Duty Cleaners</title>
        <meta name="description" content="Trusted house cleaning in Stony Plain, home of the downtown murals. Flat-rate standard, deep and move-out cleans — quoted online, paid after the work is done." />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-stony-plain/" />
        <meta property="og:title" content="House Cleaning Stony Plain, AB | Duty Cleaners" />
        <meta property="og:description" content="Trusted house cleaning in Stony Plain, home of the downtown murals. Flat-rate standard, deep and move-out cleans — quoted online, paid after the work is done." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-stony-plain/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Stony Plain, AB | Duty Cleaners" />
        <meta name="twitter:description" content="Trusted house cleaning in Stony Plain, home of the downtown murals. Flat-rate standard, deep and move-out cleans — quoted online, paid after the work is done." />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Stony Plain, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-stony-plain", areaServed: "Stony Plain, AB" }))}</script>
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
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Stony Plain, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Stony Plain
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Trusted house cleaning services in Stony Plain. Customer-rated cleaners.
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
              <img width={800} height={608}
                src={stonyPlainHome}
                alt="A charming residential home in Stony Plain, Alberta"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              loading="lazy" decoding="async" />
            </div>
          </div>
        </div>
      </section>

      <LocationPricing />

      {/* About the Neighbourhood */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Cleaning Services Rooted in Stony Plain
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Stony Plain is a charming town west of Edmonton known for its rich heritage, vibrant murals, and welcoming small-town feel. Whether you live near the shops along Main Street or in one of the newer developments on the edge of town, Duty Cleaners is proud to serve this community with reliable, professional cleaning.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Our team regularly works near landmarks like Heritage Park, Rotary Park, and the Multicultural Heritage Centre — so we're always just minutes away and ready to help keep your Stony Plain home looking its best.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {landmarks.map((landmark, i) => (
                  <a
                    key={i}
                    href={landmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 rounded-lg px-4 py-3 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{landmark.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
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
                Things To Do In Stony Plain
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>With a population of approximately 18,000, Stony Plain embraces its rich history, dating back to the late 1800s when European immigrants settled it. Unlike other cities, it has preserved its historic character through its well-preserved downtown core, adorned with colourful murals that depict the town's past.</p>
                <p>Stony Plain stands out as a town that cherishes its roots while embracing the opportunities of the present. Begin your exploration by embarking on a self-guided tour of the town's nationwide famous murals, which adorn the buildings and depict the area's history and culture with captivating colors and storytelling. Keeping up with cultural activities, experience the creative atmosphere of the Multicultural Heritage Centre, where you can admire local artwork and participate in workshops that celebrate the diverse traditions of the community. If you're getting hungry, Twenty Eight Urban Kitchen is a trendy casual restaurant offering a fusion of global flavours and modern culinary techniques that will delight your taste buds and leave you wanting more. Complete your day with a nice walk through the picturesque Shikaoi Park, admiring the serene gardens and finding inspiration amidst the natural beauty that surrounds you.</p>
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
                Cleaning Services for Stony Plain Homes
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
                Why Stony Plain Residents Choose Duty Cleaners
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

      {/* Interactive Map */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Service Area</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Our Stony Plain Service Area
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We serve Stony Plain and surrounding Parkland County communities with professional cleaning services.
              </p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38000.0!2d-114.01!3d53.53!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x539ff70e3f41d2ad%3A0x4399e4bfc1b1e30d!2sStony%20Plain%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Stony Plain Service Area Map"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Local Coverage */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              Proudly Serving Stony Plain & Surrounding Areas
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We provide professional house cleaning services throughout Stony Plain and nearby communities in the Edmonton region.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {nearbyCommunities.map((community, i) => (
                <span key={i} className="bg-white/70 border border-border rounded-full px-5 py-2 text-sm font-medium text-foreground">
                  {community}
                </span>
              ))}
            </div>
            <Link to="/locations" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Stony Plain? We also handle 
              <Link to="/commercial-cleaning" className="text-primary hover:underline font-medium">
                commercial and office cleaning across the Edmonton region
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
              Ready for a Spotless Home in Stony Plain?
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
