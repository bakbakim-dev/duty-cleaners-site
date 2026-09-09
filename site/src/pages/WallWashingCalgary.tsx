import { getListing } from "@/lib/google-listings";
import { withTrailingSlash } from "@/data/legacy-urls";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { addOnMaxPrice, addOnFromPrice, formatPrice } from "@/data/pricing";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  CheckCircle, Phone, MapPin, Clock, Star, Shield, Sparkles, Droplets, Wind,
  HandMetal, Cigarette, Home, Utensils, Cloud, ClipboardCheck, Search, Brush, ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import wallStainRemoval from "@/assets/wall-washing/wall-stain-removal.webp";
import hallwayClean from "@/assets/wall-washing/hallway-clean.webp";
import livingRoomWalls from "@/assets/wall-washing/living-room-walls.webp";
import kitchenGrease from "@/assets/wall-washing/kitchen-grease.webp";
import dirtyWallBefore from "@/assets/wall-washing/dirty-wall-before.webp";
import stainCloseup from "@/assets/wall-washing/stain-closeup.webp";
import { Helmet } from "react-helmet-async";
import CityCrossLink from "@/components/CityCrossLink";
import { CITY_PROOF } from "@/data/proof";

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
};

const ProblemCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="group bg-white rounded-xl border border-border p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const ResultCard = ({ src, caption }: { src: string; caption: string }) => (
  <div className="group rounded-xl overflow-hidden border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={src}
        alt={caption}
        loading="lazy"
        width={1024}
        height={768}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-4">
      <p className="text-sm font-medium text-foreground">{caption}</p>
    </div>
  </div>
);

const StepCard = ({ step, icon: Icon, title, description }: { step: number; icon: React.ElementType; title: string; description: string }) => (
  <div className="relative bg-white rounded-xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center text-sm shadow-md">
      {step}
    </div>
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const calgaryLocations = [
  { name: "Airdrie", path: "/cleaning-services-airdrie" },
  { name: "Cochrane", path: "/cleaning-services-cochrane" },
  { name: "Okotoks", path: "/locations/okotoks" },
  { name: "Chestermere", path: "/locations/chestermere" },
  { name: "High River", path: "/locations/high-river" },
  { name: "Strathmore", path: "/locations/strathmore" },
  { name: "Crossfield", path: "/locations/crossfield" },
  { name: "Langdon", path: "/locations/langdon" },
  { name: "Black Diamond", path: "/locations/black-diamond" },
  { name: "Turner Valley", path: "/locations/turner-valley" },
];

const wallProblems = [
  { icon: Wind, title: "Static-held dust film", description: "The grey film above vents and behind doors that a duster moves around rather than removes." },
  { icon: Cloud, title: "Furnace halo", description: "The soft dark band above the registers and along the ceiling line that chinook restarts build up." },
  { icon: Droplets, title: "Hard-water haze", description: "The mineral film around the shower and behind the sink that wiping does not shift." },
  { icon: Utensils, title: "Cooking film", description: "Grease and hard-water residue combined into a film on the backsplash surround." },
  { icon: HandMetal, title: "Handprints & scuffs", description: "Around switches, along hallways and entry walls, where hands and bags touch the wall." },
  { icon: Cigarette, title: "Nicotine & smoke residue", description: "Yellow tar film that dulls the paint. It fades with washing; full removal is not promised." },
];

const includedItems = [
  { icon: Brush, title: "Full wall wash", description: "Painted drywall in every room you book, washed rather than wiped, top to bottom." },
  { icon: Sparkles, title: "Stain, smudge & mark removal", description: "Spots, smudges and marks treated one at a time before the wash." },
  { icon: Wind, title: "Cobweb removal", description: "Corners and the ceiling line first, then the wall." },
  { icon: Droplets, title: "Spot treatment for grime", description: "Built-up grime around switches, door frames and the backsplash surround." },
  { icon: Cloud, title: "Smoke & cooking residue", description: "The film smoke and cooking leave on a wall is washed off. We do not promise the smell goes with it." },
  { icon: Shield, title: "Gentle mildew surface treatment", description: "Light surface cleaning on bathroom and humid-area walls where suitable." },
];

const steps = [
  { icon: ClipboardCheck, title: "Request a quote", description: "Tell us about your home, rooms and the wall condition you'd like cleaned." },
  { icon: Search, title: "We assess the walls", description: "On arrival the team checks the paint finish room by room. Very flat or delicate finishes get a gentler spot-clean." },
  { icon: Brush, title: "We wash the walls", description: "Washed rather than wiped, top to bottom, with products suited to painted surfaces. Marks first, then the whole wall." },
  { icon: ThumbsUp, title: "Final walkthrough", description: "We walk the rooms with you before we leave. Anything missed and reported within 24 hours is re-cleaned free." },
];

const whyUs = [
  { icon: Sparkles, title: "What comes off", description: "Cooking film, nicotine, handprints, scuffs, hard-water haze and the static-held dust film." },
  { icon: Shield, title: "What stays", description: "The paint finish. Very flat or delicate paint limits how hard a mark can be worked, and some stains only fade." },
  { icon: Home, title: "When to book it", description: "After a tenant moves out, before a listing, or with a move-out clean." },
  { icon: Droplets, title: "Safe interior wall methods", description: "Products and techniques suited to painted surfaces." },
  { icon: ThumbsUp, title: "Satisfaction guarantee", description: "We'll re-clean any missed area at no charge within 24 hours." },
  { icon: Star, title: "Trusted across Calgary", description: `Rated ${CITY_PROOF.calgary.googleRating} on Google by homeowners across the Calgary region.` },
];

const faqs = [
  { q: "Can all wall stains be removed?", a: "Most common stains like smudges, dirt, fingerprints and marks can be significantly improved or removed depending on severity, paint type and how long they've been there." },
  { q: "Do you clean all types of painted walls?", a: "Yes, we use safe cleaning methods suitable for most interior painted surfaces. Very flat or delicate finishes may require a gentler spot-clean approach." },
  { q: "Do you remove mold from walls?", a: "We handle light surface mold and mildew cleaning. Severe or structural mold cases may require a specialized mold remediation company." },
  { q: "Do I need to move furniture?", a: "We recommend clearing access where possible to make sure we can reach the full wall, but our team can carefully work around furniture when needed." },
  { q: "Do you offer wall cleaning for rentals or move-outs?", a: "Yes — wall washing is one of the most-requested add-ons for move-out cleans and property refreshes before listing or new tenants." },
  { q: "Do you clean ceilings in homes affected by smoke or nicotine?", a: "We generally do not clean very high areas like ceilings as part of our standard service. However, as long as the ceiling is safely reachable and not very high, we can attempt to clean flat ceilings for an additional charge, since this work can take significantly more time and effort. Please note: ceiling cleaning is considered an extra service, additional charges and time may apply, and we cannot guarantee full stain or odour removal. We do not clean popcorn ceilings and usually recommend replacement instead, especially in heavily smoke-damaged homes." },
];

/** Cheapest bookable wall service, derived from bk-config — never typed. */
const WALL_FROM = addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0;
const WALL_FULL = addOnFromPrice("standard", "complete-inside-wall-washing") ?? 0;
/** These pages are the site's highest click-efficiency content and stated no
 *  price at all, so neither a shopper nor an AI assistant could name one.
 *  Both figures are derived from bk-config, never typed. */
/** Both extras have seven rows in BookingKoala, one per home size, so a single
 *  figure called a "flat rate" understated the large end by up to $115. */
const WALL_SPOT_MAX = addOnMaxPrice("standard", "spot-cleaning-inside-walls") ?? 0;
const WALL_FULL_MAX = addOnMaxPrice("standard", "complete-inside-wall-washing") ?? 0;
const WALL_PRICE_LINE = `Wall washing is added to a standard, deep or move-out clean rather than booked on its own. Spot cleaning runs ${formatPrice(WALL_FROM)} to ${formatPrice(WALL_SPOT_MAX)} and a full top-to-bottom wash ${formatPrice(WALL_FULL)} to ${formatPrice(WALL_FULL_MAX)}, by home size, before 5% GST. Your exact figure is on the quote before you book.`;

export default function WallWashingCalgary() {

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Wall Washing & Wall Cleaning Calgary | Duty Cleaners</title>
        <meta name="description" content="Wall washing and wall cleaning in Calgary — scuffs, handprints and cooking film off painted walls. Added to a standard, deep or move-out clean." />
        <link rel="canonical" href="https://dutycleaners.ca/wall-washing-wall-cleaning-calgary/" />
        <meta property="og:title" content="Wall Washing & Wall Cleaning Calgary | Duty Cleaners" />
        <meta property="og:description" content="Wall washing and wall cleaning in Calgary — scuffs, handprints and cooking film off painted walls. Added to a standard, deep or move-out clean." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/wall-washing-wall-cleaning-calgary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Wall Washing & Wall Cleaning Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="Wall washing and wall cleaning in Calgary — scuffs, handprints and cooking film off painted walls. Added to a standard, deep or move-out clean." />
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
          {JSON.stringify(buildServiceSchema({ name: "Wall Washing and Wall Cleaning", description: "Wall washing and wall cleaning in Calgary — scuffs, handprints and cooking film off painted walls. Added to a standard, deep or move-out clean.", path: "/wall-washing-wall-cleaning-calgary", city: "calgary", offerFrom: WALL_FROM, offerTo: WALL_FULL_MAX, offerNote: "Added to a standard, deep or move-out clean; not sold as a standalone visit." }))}
        </script>
      </Helmet>
      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">100% Satisfaction Guaranteed</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Wall Washing & Cleaning <span className="text-accent">Calgary</span>
              </h1>
              <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl">
                Painted walls washed by hand. Scuffs, handprints, cooking film and the grey film a duster only moves around come off without stripping the finish.
              </p>
              <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl">
                {WALL_PRICE_LINE}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                  <a href="#quote">
                    See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                  <a href="tel:4037681341">
                    <Phone className="w-4 h-4 mr-2" />
                    (403) 768-1341
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <img width={1024} height={768}
                src={livingRoomWalls}
                alt="Professionally cleaned walls in a Calgary home"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
               loading="eager" fetchPriority="high"/>
            </div>
          </div>
        </div>
      </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Why Calgary walls"
        heading="What actually ends up on a wall in Calgary"
        paragraphs={[
          "Calgary sits in a semi-arid belt at the edge of the foothills, and the air here is dry enough for most of the year that fine dust never really settles — it circulates and clings. Walls above baseboards, around vents and behind doors pick up a grey film that a duster moves around rather than removes, because static is holding it there. That film is the single most common thing we are called about, and it comes off with washing rather than dusting.",
          "The chinooks make it worse in a specific way. Temperature swings of twenty degrees inside a day drive the furnace on and off repeatedly instead of letting it hold a steady cycle, and every restart pushes another load of duct dust into the room. Above the registers and along the ceiling line is where that shows first — a soft dark halo that homeowners often mistake for a paint defect.",
          "The other Calgary problem is water. The supply comes off the Bow and the Elbow, drawing through Rockies limestone, and it is hard. In bathrooms that leaves a mineral haze on the wall around the shower and behind the sink that regular cleaning does not shift, and in kitchens it combines with cooking grease into a film on the backsplash surround. Both need the wall washed rather than wiped.",
        ]}
      />

      {/* Real Results Gallery */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">What comes off</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                What wall cleaning actually takes off
              </h2>
              <p className="text-muted-foreground">
                Scuffs, fingerprints around switches, cooking film above the stove, and the grey band that builds along a stairwell.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <ResultCard src={dirtyWallBefore} caption="Dirty walls before cleaning" />
              <ResultCard src={livingRoomWalls} caption="Living room wall refresh" />
              <ResultCard src={stainCloseup} caption="Close-up stain removal" />
              <ResultCard src={hallwayClean} caption="Hallway wall after washing" />
              <ResultCard src={kitchenGrease} caption="Kitchen wall grease removal" />
              <ResultCard src={wallStainRemoval} caption="Smudge & handprint clean-up" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Wall Problems Grid */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Common Issues</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Common Issues We Fix</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The static-held dust film is the most common call in Calgary. These are the rest.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallProblems.map((p, i) => (
                  <ProblemCard key={i} icon={p.icon} title={p.title} description={p.description} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Service</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  What's Included in Our Wall Washing
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {includedItems.map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Process</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">How Wall Cleaning Works</h2>
              <p className="text-muted-foreground">Wall washing is an add-on, so it starts where your clean does:
                tick it in the booking form and the price appears with it.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {steps.map((s, i) => (
                <StepCard key={i} step={i + 1} icon={s.icon} title={s.title} description={s.description} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Why Calgary Homeowners Choose Us</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {whyUs.map((w, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-3">
                      <w.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-1">{w.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Service Areas</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Where We Serve in Calgary</h2>
                <p className="text-muted-foreground max-w-xl mx-auto">
                  We offer professional wall cleaning to homeowners across Calgary and surrounding communities.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {calgaryLocations.map((loc) => (
                  <Link
                    key={loc.path}
                    to={withTrailingSlash(loc.path)}
                    className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">FAQ</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Wall Cleaning FAQs</h2>
              </div>
              <Accordion type="single" collapsible className="bg-white rounded-xl border border-border px-6">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className={i === faqs.length - 1 ? "border-0" : ""}>
                    <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Happy Clients */}
      <section className="py-16 md:py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-7 h-7 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Rated {CITY_PROOF.calgary.googleRating} on Google across {CITY_PROOF.calgary.googleReviewCount} Calgary reviews
              </h2>
              <p className="text-xl font-semibold text-accent mb-6">100% Satisfaction Guarantee</p>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                We stand behind the quality of our staff. If you're not 100% satisfied with your cleaning, we'll come back and re-clean it at no additional charge, as long as we're informed within 24 hours after the cleaning.
              </p>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/about-us/">About Duty Cleaners</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Contact</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Get in Touch</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Give Us a Call</h3>
                    <p className="text-muted-foreground text-sm mb-3">Questions before you book</p>
                    <a href="tel:4037681341" className="text-primary font-semibold hover:underline">(403) 768-1341</a>
                  </CardContent>
                </Card>

                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Our Office</h3>
                    <p className="text-muted-foreground text-sm mb-3">2835 37 Street SW #24<br />Calgary, AB</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=2835+37+Street+SW+%2324+Calgary+AB"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Get Directions
                    </a>
                  </CardContent>
                </Card>

                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Hours of Operation</h3>
                    <p className="text-muted-foreground text-sm"><strong>Mon–Sat:</strong> 8am – 8pm</p>
                    <p className="text-muted-foreground text-sm mb-3"><strong>Sunday:</strong> 9am – 3pm</p>
                    <a
                      href={getListing("calgary").reviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Reviews
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Add wall washing to your next clean</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Spot cleaning from {formatPrice(WALL_FROM)} and a full wash from {formatPrice(WALL_FULL)}, by home size, before GST. Nothing is charged until the clean is done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                <a href="#quote">Get Instant Estimate</a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                <a href="tel:4037681341">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <CityCrossLink city="Edmonton" to="/wall-washing-wall-cleaning/" description="Wall washing and wall cleaning for Edmonton homes." />
        </div>
      </section>
      </main>


      <Footer />
    </div>
  );
}
