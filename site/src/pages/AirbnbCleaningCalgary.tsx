import {
  CheckCircle,
  Clock,
  Star,
  Shield,
  Calendar,
  Sparkles,
  Home,
  Phone,
  MapPin,
  BedDouble,
  Bath,
  UtensilsCrossed,
  Shirt,
  Package,
  Trash2,
  ClipboardCheck,
  KeyRound,
  Wand2,
  PartyPopper,
} from "lucide-react";
import { Link } from "react-router-dom";
import { buildServiceSchema } from "@/lib/service-schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import React from "react";

import imgBedroom from "@/assets/hero-family-bedroom.webp";
import imgBathroom from "@/assets/gallery/calgary-bathroom-clean.webp";
import imgKitchen from "@/assets/gallery/calgary-kitchen-clean.webp";
import imgLiving from "@/assets/gallery/calgary-living-room-clean.webp";
import imgLaundry from "@/assets/cleaning-equipment-flatlay.webp";
import imgEssentials from "@/assets/gallery/calgary-eco-products.webp";

import heroBg from "@/assets/airbnb/calgary-hero-living.webp";
import gal1 from "@/assets/airbnb/turnover-living.webp";
import gal2 from "@/assets/airbnb/turnover-bedroom.webp";
import gal3 from "@/assets/airbnb/turnover-bathroom.webp";
import gal4 from "@/assets/airbnb/turnover-kitchen.webp";
import gal5 from "@/assets/airbnb/turnover-dining.webp";
import gal6 from "@/assets/airbnb/turnover-entry.webp";
import { Helmet } from "react-helmet-async";
import CityCrossLink from "@/components/CityCrossLink";
import LocalMarketNote from "@/components/LocalMarketNote";

const AnimatedSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const WhatWeCleanCard = ({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) => (
  <div className="group bg-card rounded-2xl border border-border overflow-hidden transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-xl">
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
    <div className="p-5">
      <h3 className="font-bold text-foreground mb-1.5">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  </div>
);

const IncludedCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) => (
  <div
    className={`group bg-white rounded-xl border border-border p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl ${
      index % 2 === 0 ? "hover:translate-x-0.5" : "hover:-translate-x-0.5"
    }`}
  >
    <div className="w-12 h-12 rounded-lg bg-calgary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-calgary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </div>
);

const WhyUsCard = ({
  icon: Icon,
  title,
  description,
  index,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  index: number;
}) => (
  <div
    className={`group bg-white/10 backdrop-blur-sm rounded-xl border border-white/10 p-6 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-white/5 ${
      index % 2 === 0 ? "hover:translate-x-0.5" : "hover:-translate-x-0.5"
    }`}
  >
    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-white/90 text-sm leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({
  step,
  icon: Icon,
  title,
  description,
}: {
  step: number;
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <div className="relative bg-card rounded-2xl border border-border p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl">
    <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold text-sm shadow-md">
      {step}
    </div>
    <div className="w-12 h-12 rounded-lg bg-calgary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-calgary" />
    </div>
    <h3 className="font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const AirbnbCleaningCalgary = () => {
  const whatWeClean = [
    { image: imgBedroom, title: "Bedroom & Bed Making", description: "Hotel-style setup with crisp linens, dusted surfaces, and tidy nightstands." },
    { image: imgBathroom, title: "Bathroom Deep Clean & Sanitization", description: "Disinfected toilets, sinks, tubs, and mirrors polished to a streak-free shine." },
    { image: imgKitchen, title: "Kitchen Reset & Surface Cleaning", description: "Counters wiped, appliances cleaned, sink scrubbed, and trash removed." },
    { image: imgLiving, title: "Living Area Refresh", description: "Vacuumed floors, dusted surfaces, and cushions arranged for guest arrival." },
    { image: imgLaundry, title: "Laundry & Linen Service", description: "Laundry and linen changes are available, provided that the machines are ready to use and clean linens are prepared and accessible for the cleaners." },
    { image: imgEssentials, title: "Restocking Guest Essentials", description: "Soap, shampoo, paper goods, and basics replenished if provided by host." },
  ];

  const includedServices = [
    { icon: BedDouble, title: "Bedroom & Living Area Refresh", description: "Dusting, vacuuming, and neatly making beds with fresh linens." },
    { icon: Bath, title: "Bathroom Deep Cleaning & Sanitization", description: "Toilets, sinks, tubs, and mirrors disinfected to a sparkling finish." },
    { icon: UtensilsCrossed, title: "Kitchen Cleaning & Surface Wipe-Down", description: "Countertops, appliances, and sinks left spotless and guest-ready." },
    { icon: Shirt, title: "Optional Laundry & Linen Service", description: "Laundry and linen changes are available, provided that the machines are ready to use and clean linens are prepared and accessible for the cleaners." },
    { icon: Package, title: "Guest Essentials Restocking", description: "Soap, shampoo, and toilet paper replenished when supplied by host." },
    { icon: Trash2, title: "Trash Removal & Final Tidy", description: "Bins emptied and the space left looking fresh and inviting." },
  ];

  const howItWorks = [
    { icon: ClipboardCheck, title: "Book Your Cleaning", description: "Request your turnover online or by phone in just a couple of minutes." },
    { icon: KeyRound, title: "We Confirm Details & Access", description: "Share access instructions and any special notes for your property." },
    { icon: Wand2, title: "Full Guest-Ready Reset", description: "Our team completes a top-to-bottom turnover to short-term rental standards." },
    { icon: PartyPopper, title: "Ready for Your Next Guest", description: "Your Airbnb is clean, restocked, and staged for a five-star check-in." },
  ];

  const whyChooseUs = [
    { icon: Clock, title: "Fast & Reliable Turnovers", description: "Consistent same-window cleanings so your property is always ready on time." },
    { icon: Star, title: "Trusted by Calgary Hosts", description: "Calgary Airbnb hosts and property managers rely on us for repeat turnovers." },
    { icon: Calendar, title: "Flexible Scheduling", description: "We schedule based on availability — book in advance to lock in your preferred time." },
    { icon: Shield, title: "Safe, Guest-Friendly Products", description: "Professional cleaning products suited to guest-ready turnovers." },
  ];

  const gallery = [
    { src: gal1, alt: "Spotless Calgary Airbnb kitchen reset" },
    { src: gal2, alt: "Deep cleaned Airbnb bathroom in Calgary" },
    { src: gal3, alt: "Calgary short-term rental kitchen before and after" },
    { src: gal4, alt: "Clean Airbnb living area in northwest Calgary" },
    { src: gal5, alt: "Calgary Airbnb cleaning before and after" },
    { src: gal6, alt: "Calgary oven cleaned for short-term rental turnover" },
  ];

  const faqs = [
    {
      q: "Do you offer same-day Airbnb cleaning?",
      a: "We offer flexible scheduling based on availability. We recommend booking in advance to secure your preferred time.",
    },
    {
      q: "Do you handle laundry and linens?",
      a: "Laundry and linen changes are available, provided that the machines are ready to use and clean linens are prepared and accessible for the cleaners.",
    },
    {
      q: "Can you restock guest supplies?",
      a: "Yes, if supplies are provided by the host.",
    },
    {
      q: "Do I need to be home during cleaning?",
      a: "No, most Airbnb hosts provide self-entry instructions.",
    },
    {
      q: "What areas do you serve?",
      a: "Calgary and surrounding areas, including Airdrie, Cochrane, Okotoks, Chestermere, and nearby communities.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Airbnb Cleaning Calgary | Turnover Service | Duty Cleaners</title>
        <meta name="description" content="Reliable Airbnb and short-term rental turnover cleaning in Calgary. Restocking, fresh linens and fast turnarounds — priced per hour." />
        <link rel="canonical" href="https://dutycleaners.ca/airbnb-cleaning-services-calgary/" />
        <meta property="og:title" content="Airbnb Cleaning Calgary | Turnover Service | Duty Cleaners" />
        <meta property="og:description" content="Reliable Airbnb and short-term rental turnover cleaning in Calgary. Restocking, fresh linens and fast turnarounds — priced per hour." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/airbnb-cleaning-services-calgary/" />
        <meta property="og:image" content="https://dutycleaners.ca/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Airbnb Cleaning Calgary | Turnover Service | Duty Cleaners" />
        <meta name="twitter:description" content="Reliable Airbnb and short-term rental turnover cleaning in Calgary. Restocking, fresh linens and fast turnarounds — priced per hour." />
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
          {JSON.stringify(buildServiceSchema({ name: "Airbnb Turnover Cleaning", description: "Reliable Airbnb and short-term rental turnover cleaning in Calgary. Restocking, fresh linens and fast turnarounds — priced per hour.", path: "/airbnb-cleaning-services-calgary", city: "calgary" }))}
        </script>
      </Helmet>
      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-brand-navy overflow-hidden">
        <img width={1920} height={1080}
          src={heroBg}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-calgary/20 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Home className="w-4 h-4 text-accent" />
            <span className="text-white/90 text-sm font-medium">
              Short-Term Rental Specialists
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Airbnb Cleaning Service in Calgary
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
            Guest-Ready Turnovers with Consistent Cleaning Quality
          </p>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Maximize your Calgary Airbnb bookings with a cleaning service built for short-term rentals.
            We deliver spotless, fully sanitized turnovers so every guest walks into a five-star space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact-us/?topic=airbnb&city=calgary">Request a Callback</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <a href="tel:4037681341">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Flexible Scheduling Based on Availability</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>No Long-Term Contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Guest-Ready Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Hourly Service — 3 Hour Minimum Per Cleaner</span>
            </div>
          </div>
        </div>
      </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Calgary turnovers"
        heading="What running a short-term rental in Calgary actually demands"
        paragraphs={[
          "Calgary's booking calendar is not evenly spread, and the cleaning schedule has to bend around it. Stampede lands in the first half of July and compresses a month of demand into ten days — hosts who normally see a turnover every few days suddenly need same-day back-to-backs, often with a checkout at 11 and a check-in at 4. Booking that window early matters more here than almost anywhere else in the province, because every host in the city wants the same afternoon slot.",
          "The other rhythm is the mountains. A large share of Calgary stays are one- and two-night stopovers — guests landing at YYC, sleeping, and driving west to Banff or Canmore in the morning, or coming back the other way. Short stays mean more turnovers per month than a comparable property elsewhere, and they mean grit: ski boots, hiking gear and gravel from the Trans-Canada come in with every party, so entryways, tub bases and floor edges take the visible wear.",
          "Then there is the licensing side. The City of Calgary requires a business licence to operate a short-term rental, and the inspection standards that come with it make a documented, repeatable cleaning routine worth having on paper — not just for guest reviews, but for the file. We work to a fixed checklist and can tell you exactly what was covered on any given turnover.",
        ]}
      />

      {/* What We Clean - Visual Grid */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-calgary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-calgary" />
                <span className="text-calgary text-sm font-medium">What We Clean</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Every Corner of Your Calgary Airbnb
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hospitality-grade cleaning across every room your guests will see, touch, and remember.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {whatWeClean.map((item, i) => (
                <WhatWeCleanCard key={i} {...item} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What's Included in Every Turnover
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Tailored to short-term rental standards so your property is always five-star ready.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {includedServices.map((service, index) => (
                <IncludedCard key={index} {...service} index={index} />
              ))}
            </div>
            <p className="mt-8 text-center text-muted-foreground text-sm">
              Need add-ons like dish washing? Just let us know.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How It Works
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A simple, host-friendly process from booking to check-in.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((s, i) => (
                <StepCard key={i} step={i + 1} {...s} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-10 right-20 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl relative z-10">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">
                  Why Hosts Choose Us
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Calgary Airbnb Hosts Choose Duty Cleaners
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {whyChooseUs.map((item, index) => (
                <WhyUsCard key={index} {...item} index={index} />
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Guest-Ready Results Gallery */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-calgary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-calgary" />
                <span className="text-calgary text-sm font-medium">Guest-Ready Results</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Recent Calgary Airbnb Turnovers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                A look at the spotless spaces our team delivers for hosts across the city.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              {gallery.map((g, i) => (
                <div
                  key={i}
                  className={`overflow-hidden rounded-xl border border-border group ${
                    i === 0 ? "md:col-span-2 md:row-span-2" : ""
                  }`}
                >
                  <img
                    src={g.src}
                    alt={g.alt}
                    loading="lazy"
                    className="w-full h-full object-cover aspect-[4/3] transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Airbnb Cleaning FAQs
              </h2>
              <p className="text-muted-foreground">
                Quick answers to the questions Calgary hosts ask most.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-2 md:p-4 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Satisfaction Guarantee */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-card rounded-2xl border border-border p-10 shadow-sm">
              <Shield className="w-14 h-14 mx-auto mb-6 text-calgary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                100% Satisfaction Guarantee
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                We stand behind the quality of our staff. If you're not 100% satisfied with your cleaning,
                we'll come back and re-clean it at no additional charge, as long as we're informed within
                24 hours after the cleaning.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-xl p-6 text-left">
                  <h3 className="font-bold text-foreground mb-2">Trusted by Calgary Hosts</h3>
                  <p className="text-muted-foreground text-sm">
                    Calgary Airbnb hosts and property managers rely on us for consistent turnovers.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-calgary" />
                    <h3 className="font-bold text-foreground">Contact Us</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">
                    <strong>Call:</strong> (403) 768-1341
                  </p>
                  <p className="text-muted-foreground text-sm mb-1">
                    <strong>Address:</strong> Calgary, AB
                  </p>
                  <p className="text-muted-foreground text-sm">
                    <strong>Hours:</strong> Mon-Sat 8am–8pm | Sun 9am–3pm
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Get Your Airbnb Guest-Ready in Calgary
          </h2>
          <p className="text-xl mb-8 text-white/80">
            Reliable turnovers. Consistent quality. Flexible scheduling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to="/contact-us/?topic=airbnb&city=calgary">Request a Callback</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <a href="tel:4037681341">
                <Phone className="w-4 h-4 mr-2" />
                Call (403) 768-1341
              </a>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <section className="pb-16">
        <div className="container mx-auto px-4">
          <CityCrossLink city="Edmonton" to="/edmonton/airbnb-cleaning/" description="Airbnb turnover cleaning for Edmonton short-term rentals." />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AirbnbCleaningCalgary;
