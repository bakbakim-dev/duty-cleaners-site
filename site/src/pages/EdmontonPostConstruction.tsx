import Navigation from "@/components/Navigation";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Phone, Shield, Sparkles, Droplets, Wind, SprayCan,
  Ban, Star, Clock, MapPin, CheckCircle2, Heart, Award,
  Home, DollarSign, Calendar, Wrench
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import postConstructionBeforeAfter from "@/assets/gallery/post-construction-before-after.jpg";
import CityCrossLink from "@/components/CityCrossLink";

const includedServices = [
  { icon: Wind, title: "Fine Dust & Debris Removal", desc: "Drywall and construction dust wiped from baseboards, vents, window ledges, trim, and floors — no fine residue left behind." },
  { icon: Sparkles, title: "Kitchen Deep Cleaning", desc: "Inside and outside of all cabinets and drawers, countertops, backsplashes, sinks, and the exterior of new appliances detailed and polished." },
  { icon: Droplets, title: "Bathroom Cleaning", desc: "Tubs, showers, toilets, vanities, mirrors, and tile sanitized and polished — fully ready for first use after renovation." },
  { icon: SprayCan, title: "Floor Deep Cleaning", desc: "Sweeping, vacuuming, and mopping of hardwood, tile, vinyl, and laminate to lift fine dust and contractor footprints." },
  { icon: Shield, title: "Interior Window & Glass Cleaning", desc: "Smudges, fingerprints, paint flecks, and renovation residue removed from interior glass, mirrors, and glass doors." },
  { icon: Wind, title: "Surface Disinfection", desc: "Doors, handles, light switches, baseboards, window sills, and reachable high-touch areas wiped and sanitized." },
];

const excludedServices = [
  "We provide FINAL-stage post-construction cleaning only — not rough construction cleanup or active job-site cleaning",
  "No removal of construction debris, drywall scraps, or leftover building materials",
  "No hauling, disposal, or large debris removal services",
  "No removal of plastics from new appliances, and no removal of stickers from windows, doors, or surfaces",
  "No cleaning of areas requiring more than a two-step stool (no ladders or scaffolding)",
  "No exterior window cleaning, pressure washing, or outdoor surface cleaning",
];

const whyChooseUs = [
  { icon: Calendar, title: "Flexible Scheduling", desc: "Weekday and weekend appointments available, subject to availability, to work around your move-in date or project completion." },
  { icon: Shield, title: "Pay After Your Clean", desc: "Customer-rated Edmonton cleaners who work to a post-construction checklist from start to finish." },
  { icon: Sparkles, title: "Attention to Detail", desc: "We hand-wipe ledges, tracks, vents, and trim where dust quietly settles after construction." },
  { icon: Wrench, title: "Professional Equipment", desc: "High-performance vacuums, microfiber cleaning systems, and surface-safe products designed for post-renovation cleaning." },
  { icon: Heart, title: "Satisfaction Guarantee", desc: "Not happy with an area? Let us know within 24 hours and we'll re-clean it free of charge." },
  { icon: DollarSign, title: "Transparent Pricing", desc: "Clear starting estimates based on square footage and scope — no hidden fees." }
];

const faqs = [
  {
    q: "What is final-stage post-construction cleaning?",
    a: "Final-stage post-construction cleaning is the detailed cleaning performed after all construction or renovation work is complete and the space is empty of debris. It removes fine drywall dust, smudges, fingerprints, and contractor residue so the home is move-in ready. We do not perform rough cleanup or work on active job sites.",
  },
  {
    q: "Do you remove construction debris or leftover materials?",
    a: "No. We only handle final-stage cleaning of completed spaces. Drywall scraps, lumber, packaging, and other large debris must be removed by your contractor before our team arrives.",
  },
  {
    q: "Can you clean my Edmonton home after a kitchen or bathroom renovation?",
    a: "Yes — renovation cleaning is one of our most requested services. We detail cabinets inside and out, sanitize tubs and tile, and remove drywall dust from surrounding areas.",
  },
  {
    q: "How is post-construction cleaning different from a regular deep clean?",
    a: "Post-construction cleaning targets the fine construction dust that settles on every surface — including inside cabinets, drawers, vents, and window tracks — as well as light paint splatters, smudges, and residue left behind by tradespeople. It is significantly more detailed and intensive than a standard deep clean.",
  },
  {
    q: "How long does a post-construction cleaning take?",
    a: "Most Edmonton homes take between 4 and 10 hours depending on square footage, number of bathrooms, and how much fine dust remains. We'll give you a clear estimate before booking.",
  },
  {
    q: "Do I need to be home during the cleaning?",
    a: "No. Many clients provide lockbox or contractor access. Our cleaners are reference-checked and customer-rated.",
  },
  {
    q: "Do you remove stickers from new windows and appliances?",
    a: "No. Manufacturer stickers, plastic films on appliances, and window decals must be removed by the homeowner or contractor before our visit.",
  },
  {
    q: "Do you clean inside appliances during post-renovation cleaning?",
    a: "For post-renovation cleaning, we only clean the exterior of appliances. The interiors are not included in this service.",
  },
  {
    q: "Can you clean a home that is not completely empty after renovations?",
    a: "We require the home to be fully empty before performing post-renovation cleaning to ensure a thorough and safe clean. If the home will not be empty, please let us know during booking so we can recommend a more suitable service option.",
  },
  {
    q: "Do you offer a satisfaction guarantee?",
    a: "Yes. If you're not satisfied with any area of your post-construction cleaning, contact us within 24 hours and we'll return to re-clean it free of charge.",
  },
];

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

export default function EdmontonPostConstruction() {

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Post-Construction Cleaning Edmonton | Duty Cleaners</title>
        <meta name="description" content="Final-stage post-construction cleaning in Edmonton for newly built and renovated homes. Remove drywall dust, smudges, and contractor residue." />
        <link rel="canonical" href="https://dutycleaners.ca/post-construction-cleaning/" />
        <meta property="og:title" content="Post-Construction Cleaning Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Final-stage post-construction cleaning in Edmonton for newly built and renovated homes. Remove drywall dust, smudges, and contractor residue." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/post-construction-cleaning/" />
        <meta property="og:image" content="https://dutycleaners.ca/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Post-Construction Cleaning Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Final-stage post-construction cleaning in Edmonton for newly built and renovated homes. Remove drywall dust, smudges, and contractor residue." />
        {/* Mirrors the FAQ rendered on this page. Generated from the same
            `faqs` array, so the markup can never drift from the copy. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({ name: "Post-Construction Cleaning", description: "Final-stage post-construction cleaning in Edmonton for newly built and renovated homes. Remove drywall dust, smudges, and contractor residue.", path: "/post-construction-cleaning", city: "edmonton" }))}
        </script>
      </Helmet>

      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Shield className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Customer-Rated Cleaners</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Home className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-semibold">Final-Stage Cleaning Only</span>
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Post-Construction Cleaning in <span className="text-accent">Edmonton, AB</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-4">
                Final-stage move-in cleaning for newly built and freshly renovated Edmonton homes — completed projects only, ready for handover.
              </p>
              <p className="text-base md:text-lg text-white/90 max-w-3xl mb-8">
                We remove fine drywall dust, smudges, and contractor residue from cabinets, windows, baseboards, and floors so your home looks brand new the moment you walk in.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8">
                  <a href="#contact-form">See My Instant Price</a>
                </Button>
                <Button asChild size="lg" className="bg-white/95 text-brand-navy hover:bg-white text-lg px-8">
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />
                    780-913-6565
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/80">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Flexible Scheduling Available</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Satisfaction Guarantee</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Transparent Pricing</span></div>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <img width={640} height={832}
                src={postConstructionBeforeAfter}
                alt="Before and after post-construction cleaning of a newly built Edmonton home"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Description Section */}
      <section className="py-20">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why You Need Professional Post-Construction Cleaning</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Even after the trades have packed up and the last tool has been put away, a freshly built or renovated Edmonton home is anything but clean. Drywall dust settles on baseboards, vents, counters, window ledges, and floors. Fine particles work their way into cabinets and drawers. Smudges, fingerprints, and adhesive residue cling to windows, mirrors, and new fixtures.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                At Duty Cleaners Edmonton, we specialize in <strong>final-stage post-construction cleaning</strong> — the detailed move-in cleaning performed once construction is fully complete and the space is empty of debris. Whether it's a brand-new build, a kitchen or bathroom remodel, a basement renovation, or a full home refresh, we make your property genuinely move-in ready.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                <strong>Important:</strong> we do not provide rough construction cleanup, debris hauling, or active job-site cleaning. Our service begins after your contractor has finished and removed all materials.
              </p>
              <a href="/contact-us" className="inline-flex items-center gap-3 bg-accent/10 rounded-full px-6 py-3 hover:bg-accent/20 transition-colors cursor-pointer">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-accent font-semibold">Flexible Scheduling | Transparent Pricing</span>
              </a>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              What's Included
            </h2>
            <p className="text-center text-white/90 mb-12 max-w-2xl mx-auto">
              Our comprehensive post-construction cleaning covers every detail to make your space shine.
            </p>
          </AnimatedSection>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {includedServices.map((item, index) => (
              <AnimatedSection key={index}>
                <div
                  className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-white/15 cursor-default"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/20 rounded-lg p-3 flex-shrink-0">
                      <item.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:rotate-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-white">{item.title}</h3>
                      <p className="text-white/90">{item.desc}</p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Why Edmonton Homeowners Choose Duty Cleaners</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              From flexible scheduling to a backed satisfaction guarantee — every detail is built around delivering a truly move-in ready finish.
            </p>
          </AnimatedSection>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <AnimatedSection key={index}>
                <div
                  className="group bg-white rounded-xl p-6 border border-muted shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="bg-accent/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Don't Offer Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What We Don't Cover</h2>
            <p className="text-center text-muted-foreground mb-4 max-w-2xl mx-auto">
              We provide <strong>final-stage post-construction cleaning only</strong>. To set clear expectations, here's what falls outside our scope:
            </p>
            <p className="text-center text-sm text-muted-foreground mb-12 max-w-2xl mx-auto italic">
              Need rough cleanup or debris removal? Please coordinate that with your contractor before our team arrives.
            </p>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto space-y-4">
            {excludedServices.map((item, index) => (
              <AnimatedSection key={index}>
                <div className="flex items-start gap-4 bg-destructive/5 border border-destructive/10 rounded-xl p-5">
                  <Ban className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Satisfaction Guarantee */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-semibold">TRUSTED ACROSS EDMONTON SINCE 2017</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">100% Satisfaction Guarantee</h2>
              <p className="text-lg text-white/90 mb-4">
                We stand behind the quality of our staff. If you're not 100% satisfied with your cleaning, we'll come back and re-clean it at no additional charge, as long as we’re informed within 24 hours after the cleaning.
              </p>
              <p className="text-base text-white/90 mb-8">
                Every Edmonton post-construction job is reviewed against a detailed checklist before we leave — from cabinet interiors and window tracks to baseboards — so the home truly feels brand new.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  <a href="#contact-form">Get a Free Estimate</a>
                </Button>
                <Button asChild size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  <a href="/about-us">Learn More</a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Post-Construction Cleaning FAQs</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Answers to the questions Edmonton homeowners, builders, and renovators ask us most.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-xl border border-muted shadow-sm px-5"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Get In Touch</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Phone, title: "Give us a call", desc: "We're here to answer your questions!", action: "780-913-6565", href: "tel:7809136565" },
              { icon: MapPin, title: "Our office", desc: "18615 71 Ave NW\nEdmonton, AB", action: "Get Directions", href: "https://maps.app.goo.gl/vM1BgjC6i8wbMnX97" },
              { icon: Clock, title: "Hours of operation", desc: "Mon-Sat: 8am–8pm\nSun: 9am–3pm", action: "Reviews", href: "https://maps.app.goo.gl/vM1BgjC6i8wbMnX97" },
            ].map((card, index) => (
              <AnimatedSection key={index}>
                <div
                  className="group bg-white rounded-xl p-6 text-center border border-muted shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="bg-accent/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <card.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground mb-4 whitespace-pre-line">{card.desc}</p>
                  <Button asChild variant="outline" className="border-accent/30 text-accent hover:bg-accent/5">
                    <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                      {card.action}
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact-form" className="py-20 lg:py-12 bg-brand-navy relative overflow-hidden scroll-mt-20">
        <div className="absolute top-10 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-6xl mx-auto lg:grid lg:grid-cols-5 lg:gap-10 lg:items-start">
              <div className="lg:col-span-2 text-center lg:text-left mb-8 lg:mb-0 lg:pt-2">
                <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-4">
                  <Award className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-semibold">Free, No-Obligation Quote</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">See My Instant Price</h2>
                <p className="text-white/90">Fill out the form and we'll instantly email you a quote.</p>
              </div>
              <div id="quote-form" className="lg:col-span-3 max-w-3xl mx-auto w-full scroll-mt-20 bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center">
                <p className="text-xl font-bold text-foreground">Your price in 60 seconds</p>
                <p className="mt-2 text-muted-foreground">
                  A few quick questions about the site — no obligation.
                </p>
                <a
                  href="#quote"
                  className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-md bg-accent px-8 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-colors hover:bg-accent/90"
                >
                  Open the quote form
                </a>
                <p className="mt-3 text-sm text-muted-foreground">
                  Opens full screen — nothing else in the way.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      </main>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <CityCrossLink city="Calgary" to="/post-construction-cleaning-calgary/" description="Post-construction cleaning for newly built and renovated Calgary homes." />
        </div>
      </section>

      <Footer />
    </div>
  );
}
