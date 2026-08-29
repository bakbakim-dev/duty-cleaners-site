import { BRANCH_ID, BRANCH_IDENTITY } from "@/data/proof";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Phone,
  CheckCircle,
  ClipboardCheck,
  AlertTriangle,
  Sparkles,
  UtensilsCrossed,
  Bath,
  Footprints,
  DoorOpen,
  Search,
  MapPin,
} from "lucide-react";
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

import heroBg from "@/assets/gallery/move-out-clean.webp";
import imgKitchen from "@/assets/gallery/kitchen-deep-clean.webp";
import imgBathroom from "@/assets/gallery/bathroom-clean.webp";
import imgWalls from "@/assets/gallery/clean-walls-edmonton.webp";

const PHONE_DISPLAY = "(780) 913-6565";
const PHONE_TEL = "tel:7809136565";
// /contact force-301s to /contact-us/ and a redirect may drop the prefill.
const CALLBACK_HREF = "/contact-us/?topic=march-out&city=edmonton";

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

const included = [
  {
    icon: UtensilsCrossed,
    title: "Appliance Deep Cleaning",
    description:
      "Inside and outside of the stove, oven, fridge, dishwasher and microwave — the areas inspectors open first.",
  },
  {
    icon: Footprints,
    title: "Floors, Edges & Baseboards",
    description:
      "Vacuuming, mopping and detailed edge work along baseboards, corners and door tracks.",
  },
  {
    icon: Bath,
    title: "Bathroom Sanitizing",
    description:
      "Tubs, showers, tile, sinks, toilets and mirrors scrubbed to march-out inspection standards.",
  },
  {
    icon: DoorOpen,
    title: "Surface Wipe-Down",
    description:
      "Doors, frames, cabinet interiors and exteriors, switch plates, vents covers and fixtures.",
  },
  {
    icon: Search,
    title: "Final Walkthrough",
    description:
      "We re-check every room against the march-out list before we hand the keys back to you.",
  },
  {
    icon: Sparkles,
    title: "Add-Ons on Request",
    description:
      "Wall washing, interior windows and unfinished basements are often required at march-out — tell us in advance and we'll include them.",
  },
];

const risks = [
  "Missed details that lead to a failed inspection",
  "Last-minute re-clean charges you didn't budget for",
  "Delays to your move-out approval and handover date",
];

const faqs = [
  {
    q: "What is a march-out cleaning?",
    a: "It's the move-out clean required when you release military housing. The inspection follows CFHA's move-out condition guidelines, which are far more detailed than a typical landlord walkthrough — appliance interiors, baseboards, wall marks, vents and cabinet interiors are all checked.",
  },
  {
    q: "How is it different from a regular move-out clean?",
    a: "A standard move-out clean targets what a new tenant would notice. A march-out clean targets what an inspector measures against a checklist, so we spend far more time on edges, appliance interiors, wall marks and fixture detail.",
  },
  {
    q: "Are wall washing and interior windows included?",
    a: "No — wall washing, interior window cleaning and unfinished basement cleaning are add-ons, not part of the standard march-out package. They're commonly required to pass, so let us know when you call and we'll quote them in.",
  },
  {
    q: "How far in advance should I book?",
    a: "As early as you have your inspection date. March-out dates cluster around posting season, so the earlier you call, the more likely you get your preferred window.",
  },
  {
    q: "Why can't I get an instant online price?",
    a: "March-out jobs vary too much by home size, condition and which add-ons your inspection requires. We quote them by phone so the number you get is the number you pay.",
  },
  {
    q: "What if something is flagged at inspection?",
    a: "Tell us within 24 hours after the cleaning and we'll come back and re-clean the flagged areas at no additional charge.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "March Out Cleaning Edmonton",
  serviceType: "Military housing march-out cleaning",
  description:
    "Military housing move-out cleaning in Edmonton, cleaned to CFHA march-out inspection standards. Quoted by phone.",
  provider: {
    "@type": "LocalBusiness",
    "@id": BRANCH_ID.edmonton,
    name: BRANCH_IDENTITY.edmonton.name,
    url: BRANCH_IDENTITY.edmonton.url,
    telephone: "+1-780-913-6565",
    address: {
      "@type": "PostalAddress",
      streetAddress: "18615 71 Ave NW",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      postalCode: "T5T 2V9",
      addressCountry: "CA",
    },
  },
  areaServed: { "@type": "City", name: "Edmonton" },
  url: "https://dutycleaners.ca/edmonton/march-out-cleaning",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function EdmontonMarchOut() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>March Out Cleaning Edmonton | CFHA Move-Out Cleaners</title>
        <meta
          name="description"
          content="March out cleaning in Edmonton for military housing, cleaned to CFHA inspection standards. Call (780) 913-6565 for a same-day quote."
        />
        <link rel="canonical" href="https://dutycleaners.ca/edmonton/march-out-cleaning/" />
        <meta property="og:title" content="March Out Cleaning Edmonton | CFHA Move-Out Cleaners" />
        <meta
          property="og:description"
          content="Military housing move-out cleaning in Edmonton, done to CFHA march-out inspection standards."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/edmonton/march-out-cleaning/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="March Out Cleaning Edmonton | CFHA Move-Out Cleaners" />
        <meta name="twitter:description" content="Military housing move-out cleaning in Edmonton, done to CFHA march-out inspection standards." />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-20 px-4 bg-brand-navy overflow-hidden">
        <img
          src={heroBg}
          alt="Emptied Edmonton military home cleaned to march-out inspection standard"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-white/90 text-sm font-medium">Military Housing Move-Out Specialists</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            March Out Cleaning in Edmonton
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
            Cleaned to CFHA march-out inspection standards
          </p>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Releasing military housing means passing a detailed march-out inspection before your move is
            approved. We clean to that checklist — appliances, edges, walls and fixtures — so the handover
            goes through the first time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={PHONE_TEL}>
                <Phone className="w-4 h-4 mr-2" />
                Call {PHONE_DISPLAY}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg border-white/20 text-white hover:bg-white/10"
            >
              <Link to={CALLBACK_HREF}>Request a Callback</Link>
            </Button>
          </div>
          <p className="text-white/80 text-sm">
            March-out jobs are quoted by phone — every inspection list is a little different.
          </p>
        </div>
      </section>

      {/* Why it's different */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Why military move-out inspections are different
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A march-out inspection is measured against a written condition standard, not a quick
                walkthrough. Inspectors open the oven, check behind the fridge, run a hand along baseboards
                and look for marks on walls and door frames. Cleaners who have never worked a CFHA-managed
                home routinely miss those areas.
              </p>
              <div className="space-y-3">
                {risks.map((risk) => (
                  <div key={risk} className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">{risk}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                We clean against the same list the inspector uses, and we walk the home again before we
                leave.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img width={1024} height={1024}
                src={imgKitchen}
                alt="Kitchen appliances deep cleaned for an Edmonton march-out inspection"
                loading="lazy"
                className="rounded-2xl object-cover w-full h-full aspect-[4/5]"
              />
              <div className="grid gap-4">
                <img width={1024} height={1024}
                  src={imgBathroom}
                  alt="Bathroom sanitized to march-out standards in Edmonton"
                  loading="lazy"
                  className="rounded-2xl object-cover w-full aspect-square"
                />
                <img width={768} height={1024}
                  src={imgWalls}
                  alt="Washed walls in an Edmonton military housing unit"
                  loading="lazy"
                  className="rounded-2xl object-cover w-full aspect-square"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* What's included */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                What our Edmonton march-out cleaning covers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Room by room, against the inspection checklist.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {included.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group bg-card rounded-xl border border-border p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">Please note:</strong> wall washing, interior window
                  cleaning and unfinished basement cleaning are frequently required to pass a march-out
                  inspection, but they are add-ons rather than part of the standard package. Mention them when
                  you call and we'll build them into your quote.
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Why families choose us */}
      <section className="py-20 px-4 bg-brand-navy">
        <AnimatedSection>
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Why Edmonton military families call us
            </h2>
            <p className="text-white/85 max-w-2xl mx-auto mb-10">
              We've been cleaning Alberta homes since 2017, and march-out work is one of the jobs we're asked
              for most around posting season.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                "We clean to CFHA move-out condition guidelines, not a generic checklist.",
                "Reference-checked, customer-rated cleaners who've done march-outs before.",
                "Add-ons like wall washing quoted upfront, so nothing gets missed on inspection day.",
                "Not happy? Tell us within 24 hours and we re-clean at no additional charge.",
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-white/90 text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                March-out cleaning FAQs
              </h2>
              <p className="text-muted-foreground">Edmonton, CFHA housing, and what to expect.</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-2 md:p-4 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`} className="px-4">
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

      {/* Closing CTA */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Book your Edmonton march-out clean
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tell us your inspection date and home size and we'll give you a firm price over the phone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={PHONE_TEL}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call {PHONE_DISPLAY}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to={CALLBACK_HREF}>Request a Callback</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground inline-flex items-center gap-2 justify-center">
              <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
              18615 71 Ave NW, Edmonton · Mon–Sat 8am–8pm · Sun 9am–3pm
            </p>
          </div>
        </AnimatedSection>
      </section>
      </main>

      <Footer />
    </div>
  );
}
