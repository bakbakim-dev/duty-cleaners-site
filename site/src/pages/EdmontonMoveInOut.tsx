import CityCrossLink from "@/components/CityCrossLink";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Phone, Calculator, CheckCircle2, Star, Shield, Clock, Award, MapPin,
  Truck, ThumbsUp, Leaf, DollarSign, Sparkles, Home, Bath,
  UtensilsCrossed, ChevronDown, ChevronUp, ExternalLink, Mail, Zap,
  LucideIcon, Calendar, Package, Eye
} from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import familyCleanHome from "@/assets/gallery/family-clean-home-edmonton.jpg";
import kitchenDeepClean from "@/assets/gallery/kitchen-deep-clean.jpg";
import bathroomClean from "@/assets/gallery/bathroom-clean.jpg";
import livingRoomClean from "@/assets/gallery/living-room-clean.jpg";
import moveOutClean from "@/assets/gallery/move-out-clean.jpg";
import beforeAfter from "@/assets/gallery/before-after.jpg";
import windowCleaning from "@/assets/gallery/window-cleaning.jpg";




// Animated section wrapper
import MoveOutDepth from "@/components/MoveOutDepth";
import { moveInOutTierRows } from "@/data/pricing";

// Derived, never hand-typed (published-prices.test.ts): the cheapest
// move-in/out tier from bk-config is the honest floor.
const moveInOutFromPrice = () => moveInOutTierRows()[0]?.price ?? "";

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

// 3D hover card
const ServiceCard = ({ icon: Icon, title, description, index = 0 }: { icon: LucideIcon; title: string; description: string; index?: number }) => (
  <div
    className={`group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out cursor-pointer hover:-translate-y-2 ${index % 2 === 0 ? "hover:translate-x-0.5" : "hover:-translate-x-0.5"} hover:border-primary hover:shadow-xl hover:shadow-primary/10`}
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
      <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
    </div>
    <h3 className="text-lg font-bold mb-2 transition-transform duration-300 group-hover:translate-x-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

// Why-us card for dark sections
const WhyUsCard = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) => (
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

// Neighborhood link pill

const services = [
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Degreasing stovetops, range hoods, and backsplashes; scrubbing countertops, sinks, and faucets; cleaning inside and outside of cabinets, drawers, oven, microwave, and fridge; sanitizing every food-prep surface." },
  { icon: Bath, title: "Bathroom Sanitization", description: "Disinfecting toilets, tubs, showers, sinks, and tiles; removing soap scum, hard water stains, and mineral buildup; polishing mirrors, glass, and high-touch handles for an inspection-ready shine." },
  { icon: Home, title: "Living Areas & Bedrooms", description: "Vacuuming and mopping all floors; wiping baseboards, door frames, light switches, outlets, and vents; dusting ceiling fans and window sills; cleaning inside closets, drawers, and storage spaces." },
  { icon: Package, title: "Optional Add-Ons", description: "Inside window cleaning, blind and track detailing, wall washing, full basement cleaning, garage and balcony sweeping, interior wall spot-cleaning, and appliance pull-outs available on request." },
];

const whyUsItems = [
  { icon: DollarSign, title: "Deposit Protection Standard", description: "Inspection-ready cleaning calibrated to the standards Edmonton landlords, property managers, and rental agencies expect — designed to maximize your damage deposit return." },
  { icon: Home, title: "Move-In Ready Freshness", description: "We eliminate built-up dust, pet dander, allergens, and lingering odors left by previous tenants so your new Edmonton home feels genuinely fresh from day one." },
  { icon: Clock, title: "Availability & Service Areas", description: "We offer weekday and weekend move-in / move-out cleaning across Edmonton, Sherwood Park, St. Albert, Spruce Grove, Leduc, and Beaumont, based on availability." },
  { icon: Sparkles, title: "Pro-Grade Tools & Supplies", description: "High-quality equipment and non-toxic cleaning products designed for move-in and move-out deep cleaning standards." },
  { icon: Shield, title: "Reference-Checked & Customer-Rated", description: "Reference-checked cleaners trained specifically on end-of-tenancy checklists, equipped with all supplies — eco-friendly products available on request for a $15 add-on." },
  { icon: Award, title: "24-Hour Re-Clean Guarantee", description: "If anything is missed, let us know within 24 hours and we'll return to make it right — completely free of charge." },
];

const faqs = [
  { q: "What is included in move out cleaning in Edmonton?", a: "A complete top-to-bottom deep clean: kitchen degreasing (stovetop, range hood, backsplash, inside oven, microwave, fridge), inside cabinets and drawers, full bathroom sanitization (soap scum, hard water, tile), all floors, baseboards, door frames, light switches, vents, window sills, and inside closets and storage spaces." },
  { q: "How long does a move out cleaning take?", a: "We work to the move-out checklist rather than a set number of hours. Your team stays until every task is complete, and your flat rate does not change based on how long that takes. We confirm your arrival window at booking." },
  { q: "Do I need to clean before you arrive?", a: "No pre-cleaning required, but the home must be fully empty — all furniture, belongings, and garbage removed — so our team can deep-clean every surface, including inside cabinets, closets, and behind appliances." },
  { q: "Is move out cleaning required to get my damage deposit back?", a: "Most Edmonton lease agreements require the unit returned in 'reasonably clean' condition, and professional move out cleaning is the most reliable way to meet inspection standards. Our service is built specifically around landlord and property-manager checklists." },
  { q: "Do you clean inside appliances and cabinets?", a: "Yes — inside the oven, microwave, fridge, freezer, dishwasher, and the inside of every cabinet and drawer are all included in our standard move out / move in cleaning." },
  { q: "What's the difference between regular cleaning and move out cleaning?", a: "Regular cleaning maintains an occupied home week to week. Move out (and move in) cleaning is a one-time, far more detailed service that addresses built-up grime, hidden surfaces, inside appliances, baseboards, vents, and every storage space — the level of detail required for inspections and turnovers." },
  { q: "Do you bring your own cleaning supplies?", a: "Yes — we bring all supplies, equipment, and non-toxic products on request. You only need to ensure water and electricity are still active at the property." },
  { q: "Do I need to be home during the cleaning?", a: "Most clients leave a key in a mailbox, lockbox, or provide a buzzer code. Once the cleaning is complete, we will lock up and confirm completion by phone 30 minutes before we finish." },
];

export default function EdmontonMoveInOut() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showFloating, setShowFloating] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => setShowFloating(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Duty Cleaners - Edmonton Move In/Out Cleaning",
    telephone: "+1-780-913-6565",
    email: "support@dutycleaners.ca",
    address: { "@type": "PostalAddress", streetAddress: "18615 71 Ave NW", addressLocality: "Edmonton", addressRegion: "AB", postalCode: "T5T 2V9", addressCountry: "CA" },
    url: "https://dutycleaners.ca/move-out-cleaning-edmonton/",
    priceRange: "$284-$539+",
    openingHours: ["Mo-Sa 08:00-20:00", "Su 09:00-15:00"],
  };

  // The FAQ section below already renders these eight Q&As — this mirrors
  // them so the FAQPage schema (previously absent from this page) matches
  // visible content exactly.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <Helmet>
        <title>Move Out & Move In Cleaning Edmonton | Duty Cleaners</title>
        <meta name="description" content="Inspection-ready move out cleaning Edmonton & move in cleaning services. End of tenancy cleaning trusted by landlords. Same-day available." />
        <meta name="keywords" content="move out cleaning Edmonton, move in cleaning Edmonton, end of tenancy cleaning Edmonton, move in ready cleaning, damage deposit cleaning Edmonton, move out cleaners Edmonton" />
        <link rel="canonical" href="https://dutycleaners.ca/move-out-cleaning-edmonton/" />
        <meta property="og:title" content="Move Out Cleaning Edmonton | Move In Cleaning Services | Duty Cleaners" />
        <meta property="og:description" content="Inspection-ready move out cleaning Edmonton & move in cleaning services. End of tenancy cleaning trusted by landlords. Same-day available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/move-out-cleaning-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Move Out Cleaning Edmonton | Move In Cleaning Services | Duty Cleaners" />
        <meta name="twitter:description" content="Inspection-ready move out cleaning Edmonton & move in cleaning services. End of tenancy cleaning trusted by landlords. Same-day available." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="edmonton" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
        <section className="relative bg-brand-navy text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                  Move Out & Move In Cleaning in Edmonton
                </h1>
                <p className="text-xl md:text-2xl mb-8 text-white/85">
                  Secure Your Deposit & Start Fresh with Expert Cleaning{" "}
                  — flat-rate from {moveInOutFromPrice()} by home size, plus 5% GST.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 h-14" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                  <Button size="lg" className="bg-white/95 text-brand-navy hover:bg-white text-lg px-8 h-14" asChild>
                    <a href="tel:7809136565">
                      <Phone className="mr-2 w-5 h-5" />
                      (780) 913-6565
                    </a>
                  </Button>
                </div>

                <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">100% Satisfaction Guarantee</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">Trusted by Edmonton Landlords</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-medium">5-Star Rated Service</span>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0">
                <img
                  src={familyCleanHome}
                  alt="Spotless Edmonton home after professional move-out cleaning"
                  width={500}
                  height={500}
                  className="lg:w-[500px] w-full rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Instant Quote CTA */}
        <section id="quote" className="py-16 bg-secondary/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">Get Started</span>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-3">See My Instant Price in Under 60 Seconds</h2>
                <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                  Skip the phone tag. Tell us your home size, condition, and move-out date — get personalized, all-inclusive pricing instantly. Backed by our 100% satisfaction guarantee and 24-hour re-clean promise.
                </p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                  <Link to="/contact-us">
                    <Calculator className="w-5 h-5 mr-2" />
                    See Pricing & Availability
                  </Link>
                </Button>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
                  <span>⚡ Instant pricing</span>
                  <span>📞 No phone call required</span>
                  <span>💳 No credit card required</span>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Introduction / Service Explanation */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-4xl">
            <AnimatedSection>
              <div className="text-center mb-8">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">About the Service</span>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Detailed, Inspection-Ready Move In / Move Out Cleaning in Edmonton</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                <p>
                  Moving is one of life's most stressful events — deep cleaning shouldn't add to it. Our <strong>move out cleaning Edmonton</strong> service is a one-time, top-to-bottom deep clean designed specifically for end-of-tenancy turnovers, home sales, and pre-move-in resets across Edmonton, Sherwood Park, St. Albert, Spruce Grove, Leduc, and Beaumont.
                </p>
                <p>
                  We tackle everything routine cleaning leaves behind: <strong>built-up grease</strong> on stovetops, range hoods, and kitchen backsplashes; the inside of <strong>cabinets, drawers, closets, and storage spaces</strong>; <strong>baseboards, door frames, light switches</strong>, and other high-touch areas; <strong>soap scum, hard water stains, and bathroom buildup</strong>; and the layers of <strong>dust, dander, allergens, and lingering odors</strong> left behind by previous tenants or vacated homes.
                </p>
                <p>
                  Whether you need <strong>move in cleaning Edmonton</strong> to make a new home truly move-in ready, or end-of-tenancy cleaning to maximize your damage deposit return, every job follows a detailed landlord and property-manager checklist — the level of detail required for inspections, walk-throughs, and turnovers.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">What's Included</span>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Comprehensive Move In & Move Out Cleaning</h2>
                <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">Every inch of your Edmonton property cleaned to inspection-ready standards.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {services.map((s, i) => (
                  <ServiceCard key={i} icon={s.icon} title={s.title} description={s.description} index={i} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Visual Showcase – Detail Shots */}
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatedSection>
              <div className="text-center mb-8">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">The Difference</span>
                <h2 className="display-serif text-2xl md:text-3xl font-bold mt-2">See the Inspection-Ready Detail</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="rounded-xl overflow-hidden shadow-lg group">
                  <img width={1024} height={1024} src={kitchenDeepClean} alt="Spotless Edmonton kitchen after move-out cleaning" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="p-4 bg-white">
                    <h3 className="font-bold mb-1">Degreased Kitchens</h3>
                    <p className="text-sm text-muted-foreground">Stovetops, range hoods, backsplashes, and inside every appliance.</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg group">
                  <img width={1024} height={1024} src={bathroomClean} alt="Sanitized bathroom with polished tile in Edmonton" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="p-4 bg-white">
                    <h3 className="font-bold mb-1">Bathroom Transformations</h3>
                    <p className="text-sm text-muted-foreground">Soap scum, hard water stains, and high-touch areas restored.</p>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden shadow-lg group">
                  <img width={1024} height={1024} src={livingRoomClean} alt="Move-in ready Edmonton living room professionally cleaned" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="p-4 bg-white">
                    <h3 className="font-bold mb-1">Move-In Ready Rooms</h3>
                    <p className="text-sm text-muted-foreground">Baseboards, vents, light switches, and inside closets all detailed.</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Lifestyle Band */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-6xl">
            <AnimatedSection>
              <div className="grid lg:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img width={1024} height={1024} src={moveOutClean} alt="Edmonton family moving into a clean, fresh home" className="w-full h-[420px] object-cover" loading="lazy" />
                </div>
                <div>
                  <span className="text-accent font-semibold text-sm uppercase tracking-wide">Move-In Ready</span>
                  <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Walk Into a Truly Fresh Home</h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    A previous tenant's "clean" rarely meets your standards. Our move in cleaning Edmonton service strips away years of hidden dust, kitchen grease, bathroom buildup, and lingering odors so the first night in your new home feels like a brand-new build — not someone else's leftovers.
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span>Professional cleaning team assigned based on the size and needs of the home</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span>High-quality equipment and non-toxic cleaning products</span></li>
                    <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span>Move-out cleaning checklist designed to meet landlord inspection standards your landlord will love</span></li>
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <MoveOutDepth city="Edmonton" />

        {/* Why Choose Us — Dark */}
        <section className="py-16 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">Why Us</span>
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mt-2">Why Edmonton Families Choose Duty Cleaners</h2>
                <p className="text-white/90 mt-3 max-w-2xl mx-auto">Trusted by hundreds of families, landlords, and property managers across Edmonton.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => (
                  <WhyUsCard key={i} icon={item.icon} title={item.title} description={item.description} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-3xl">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">FAQ</span>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Frequently Asked Questions</h2>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="space-y-4">
                {faqs.map((faq, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border overflow-hidden transition-all duration-300 hover:shadow-md">
                    <button onClick={() => setOpenFAQ(openFAQ === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left font-semibold">
                      <span>{faq.q}</span>
                      {openFAQ === i ? <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                    </button>
                    {/* Always in the DOM (hidden when collapsed) so the FAQPage
                        schema's answers match crawlable page content. */}
                    <div
                      className={`px-5 pb-5 text-muted-foreground leading-relaxed border-t border-border pt-4 ${
                        openFAQ === i ? "" : "hidden"
                      }`}
                    >
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6">
                Book Your Edmonton Move Out Cleaning Today
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Don't let cleaning add to your moving stress — leave it to the pros! Flexible scheduling and guaranteed results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="#quote">
                    <Mail className="mr-2 w-5 h-5" />See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />Call (780) 913-6565
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Floating CTA */}
        {showFloating && (
          <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-4">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white shadow-2xl rounded-full h-14 px-6" asChild>
              <a href="tel:7809136565">
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </a>
            </Button>
          </div>
        )}
        </main>

        <section className="pb-16">

          <div className="container mx-auto px-4">

            <CityCrossLink city="Calgary" to="/move-out-cleaning-calgary/" description="Move-out and move-in cleaning for Calgary homes and rentals." />

          </div>

        </section>

        <Footer hasQuoteSection />
      </div>
    </>
  );
}
