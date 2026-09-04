import { POLICY } from "@/data/policy";
import CityCrossLink from "@/components/CityCrossLink";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import calgaryMoveInOutHero from "@/assets/calgary-move-in-out-hero.webp";
import calgaryKitchenClean from "@/assets/gallery/calgary-kitchen-clean.webp";
import calgaryBathroomClean from "@/assets/gallery/calgary-bathroom-clean.webp";
import calgaryLivingRoomClean from "@/assets/gallery/calgary-living-room-clean.webp";
import calgaryMoveOutClean from "@/assets/gallery/calgary-move-out-clean.webp";
import calgaryBeforeAfter from "@/assets/gallery/calgary-before-after.webp";
import calgaryTeamCleaning from "@/assets/gallery/calgary-team-cleaning.webp";
import calgaryWindowCleaning from "@/assets/gallery/calgary-window-cleaning.webp";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Phone, Home, Shield, Star, Clock, DollarSign, Award, MapPin, Calculator, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MoveOutDepth from "@/components/MoveOutDepth";
import { moveInOutTierRows } from "@/data/pricing";
import { buildServiceSchema } from "@/lib/service-schema";
import { schemaAddressFor, BRANCH_ID, ORG_ID, RATING_CLAIM, BRANCH_IDENTITY } from "@/data/proof";

// Derived, never hand-typed (published-prices.test.ts): the cheapest
// move-in/out tier from bk-config is the honest floor.
const moveInOutFromPrice = () => moveInOutTierRows()[0]?.price ?? "";

/**
 * The branch node, carrying the two properties buildServiceSchema does not
 * model: priceRange and opening hours. It reuses BRANCH_ID, so this merges
 * into the existing Calgary entity instead of declaring a second anonymous
 * business — which is what the Edmonton twin was doing with a hardcoded
 * street address that could drift from proof.ts.
 */
const branchSchema = () => {
  const rows = moveInOutTierRows();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": BRANCH_ID.calgary,
    name: BRANCH_IDENTITY.calgary.name,
    telephone: "+1-403-768-1341",
    email: "support@dutycleaners.ca",
    address: schemaAddressFor("calgary"),
    url: BRANCH_IDENTITY.calgary.url,
    priceRange: `${rows[0]?.price}-${rows[rows.length - 1]?.price}+`,
    openingHours: ["Mo-Sa 08:00-20:00", "Su 09:00-15:00"],
    parentOrganization: { "@id": ORG_ID },
  };
};
// The FAQ accordion below already renders these nine Q&As — kept as data
// so the FAQPage schema (previously absent, along with any other schema on
// this page) matches visible content exactly.
const faqs = [
  { q: 'Do I need to be home during the move out cleaning?', a: "No, you don't need to be present. Just provide access to the home, and we'll lock up after we finish. Many clients prefer to schedule their move out cleaning after they've already relocated to their new home." },
  { q: 'How long does move out cleaning take in Calgary?', a: "We work to the move-out checklist rather than a set number of hours. Your team stays until every task is complete, and your flat rate does not change based on how long it takes. We'll confirm your arrival window when you book." },
  { q: 'Should I clean before you arrive?', a: 'For move in and move out cleaning, the home must be completely empty before our team arrives — that includes all personal belongings, furniture, and trash. This ensures we can deliver a thorough, top-to-bottom clean without obstacles.' },
  // Confirmed by the owner: the return visit is honoured, inside the same
  // 24-hour window as everything else. It used to read as open-ended, which
  // the guarantee does not cover, and Edmonton made no promise at all.
  { q: "Do you guarantee I'll get my security deposit back?", a: `While we cannot control a landlord's decision, the clean is done to the standard a move-out inspection looks for. If the inspection cites cleaning, tell us within ${POLICY.guaranteeWindowHours} hours of the walkthrough and we return to put it right at no additional cost — the same window as every other clean we do.` },
  { q: 'Do you bring your own cleaning supplies and equipment?', a: "Yes, our professional move out cleaners bring all necessary cleaning supplies, equipment, and can use products you prefer on request. You don't need to provide anything except access to the property and functioning utilities (water and electricity)." },
  { q: 'What is included in move out cleaning in Calgary?', a: 'A complete top-to-bottom deep clean: kitchen degreasing (stovetop, range hood, backsplash, inside oven, microwave, fridge), inside cabinets and drawers, full bathroom sanitization (soap scum, hard water, tile), all floors, baseboards, door frames, light switches, vents, window sills, and inside closets and storage spaces.' },
  { q: 'Do you clean inside appliances and cabinets?', a: 'Yes — inside the oven, microwave, fridge, freezer, dishwasher, and the inside of every cabinet and drawer are all included in our standard move out / move in cleaning in Calgary.' },
  { q: "What's the difference between regular cleaning and move out cleaning?", a: 'Regular cleaning maintains an occupied home week to week. Move out (and move in) cleaning is a one-time, far more detailed service that addresses built-up grime, hidden surfaces, inside appliances, baseboards, vents, and every storage space — the level of detail required for inspections, walk-throughs, and turnovers.' },
  { q: 'Is move out cleaning required to get my damage deposit back?', a: 'Most Calgary lease agreements require the unit returned in "reasonably clean" condition, and professional move out cleaning is the most reliable way to meet inspection standards. Our service is built specifically around landlord and property-manager checklists.' },
];

export default function CalgaryMoveInOut() {
  return <div className="min-h-screen">
      <Helmet>
        <title>Move Out & Move In Cleaning Calgary | Duty Cleaners</title>
        <meta name="description" content="Inspection-ready move out cleaning Calgary & move in cleaning services. End of tenancy cleaning trusted by landlords. Same-day available." />
        <meta name="keywords" content="move out cleaning Calgary, move in cleaning Calgary, end of tenancy cleaning Calgary, move in ready cleaning, damage deposit cleaning Calgary" />
        <link rel="canonical" href="https://dutycleaners.ca/move-out-cleaning-calgary/" />
        <meta property="og:title" content="Move Out & Move In Cleaning Calgary | Duty Cleaners" />
        <meta property="og:description" content="Inspection-ready move out cleaning Calgary & move in cleaning services. End of tenancy cleaning trusted by landlords. Same-day available." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/move-out-cleaning-calgary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Move Out & Move In Cleaning Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="Inspection-ready move out cleaning Calgary & move in cleaning services. End of tenancy cleaning trusted by landlords. Same-day available." />
        {/* This page had no structured data at all. Service ties the offering
            to the Calgary LocalBusiness node; FAQPage mirrors the accordion
            content rendered further down the page.

            Built through buildServiceSchema rather than hand-rolled, so this
            page and its Edmonton twin emit the same node shape. The hand-rolled
            version named a bare provider @id with no inline node and no
            address, while Edmonton emitted a full LocalBusiness — the two pages
            described the business differently for no reason. */}
        <script type="application/ld+json">
          {JSON.stringify(
            buildServiceSchema({
              name: "Move Out and Move In Cleaning",
              description:
                "Inspection-ready move out cleaning Calgary & move in cleaning services. End of tenancy cleaning trusted by landlords. Same-day available.",
              path: "/move-out-cleaning-calgary",
              city: "calgary",
            }),
          )}
        </script>
        <script type="application/ld+json">{JSON.stringify(branchSchema())}</script>
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
      </Helmet>
      <Navigation city="calgary" />
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
                Move Out & Move In Cleaning in Calgary
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
                  <a href="tel:4037681341">
                    <Phone className="mr-2 w-5 h-5" />
                    (403) 768-1341
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
                  <span className="font-medium">Trusted by Calgary Landlords</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">{RATING_CLAIM}</span>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0">
              <img
                src={calgaryMoveInOutHero}
                alt="Spotless empty Calgary home after professional move-out cleaning"
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
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Get Started</span>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-3">See My Instant Price in Under 60 Seconds</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Skip the phone tag. Tell us your home size, condition, and move-out date — get personalized, all-inclusive pricing instantly. Backed by our 100% satisfaction guarantee and 24-hour re-clean promise.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
              {/* The heading above promises an instant price and "no phone call
                  required"; this used to open the contact form. */}
              <a href="#quote">
                <Calculator className="w-5 h-5 mr-2" />
                See My Instant Price
              </a>
            </Button>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground mt-4">
              <span>⚡ Instant pricing</span>
              <span>📞 No phone call required</span>
              <span>💳 No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-6">
            Detailed, Inspection-Ready Move In / Move Out Cleaning in Calgary
          </h2>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Moving is one of life's most stressful events — deep cleaning shouldn't add to it. Our <strong>move out cleaning Calgary</strong> service is a one-time, top-to-bottom deep clean designed specifically for end-of-tenancy turnovers, home sales, and pre-move-in resets across Calgary, Airdrie, Cochrane, Okotoks, Chestermere, and surrounding communities.
            </p>
            <p>
              We tackle everything routine cleaning leaves behind: <strong>built-up grease</strong> on stovetops, range hoods, and kitchen backsplashes; the inside of <strong>cabinets, drawers, closets, and storage spaces</strong>; <strong>baseboards, door frames, light switches</strong>, and other high-touch surfaces; <strong>soap scum, hard water stains, and bathroom buildup</strong>; and the layers of <strong>dust, dander, allergens, and lingering odors</strong> left behind by previous tenants or vacated homes.
            </p>
            <p>
              Whether you need <strong>move in cleaning Calgary</strong> to make a new home truly move-in ready, or end-of-tenancy cleaning to maximize your damage deposit return, every job follows a detailed landlord and property-manager checklist — the level of detail required for inspections, walk-throughs, and turnovers across the Calgary region.
            </p>
          </div>
        </div>
      </section>


      {/* Services Breakdown */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">
            Comprehensive Move Out & Move In Cleaning Services
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-lg">
            Whether you're leaving a rental or settling into a new home, our detailed move in/move out cleaning services cover every inch of your Calgary property:
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            {/* Kitchen */}
            <div className="bg-white rounded-xl p-8 shadow-md border-2 border-[hsl(160,100%,30%)]/20 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[hsl(160,100%,30%)]/10 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-[hsl(160,100%,30%)]" />
                </div>
                <h3 className="text-2xl font-bold">Kitchen Deep Cleaning</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(160,100%,30%)] mt-0.5 flex-shrink-0" />
                  <span>Scrubbing and sanitizing countertops, sinks, and backsplashes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(160,100%,30%)] mt-0.5 flex-shrink-0" />
                  <span>Cleaning inside and outside of cabinets, drawers, and all appliances</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(160,100%,30%)] mt-0.5 flex-shrink-0" />
                  <span>Removes grease, grime, and built-up residue from all kitchen surfaces, including walls.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(160,100%,30%)] mt-0.5 flex-shrink-0" />
                  <span>Thorough cleaning behind the oven and refrigerator</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(160,100%,30%)] mt-0.5 flex-shrink-0" />
                  <span>Degreasing stovetops, range hoods, and exhaust fans</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[hsl(160,100%,30%)] mt-0.5 flex-shrink-0" />
                  <span>Sanitizing all food preparation areas to eliminate bacteria</span>
                </li>
              </ul>
            </div>

            {/* Bathroom */}
            <div className="bg-white rounded-xl p-8 shadow-md border-2 border-blue-200 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">Bathroom Cleaning</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Disinfecting toilets, tubs, showers, and sinks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Scrubbing tiles, floors, mirrors, and glass surfaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Cleaning reachable outside vents and baseboards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Removing soap scum, hard water stains, and mineral deposits</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>Sanitizing all high-touch surfaces including handles and knobs</span>
                </li>
              </ul>
            </div>

            {/* Living Areas */}
            <div className="bg-white rounded-xl p-8 shadow-md border-2 border-accent/20 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Living Areas & Bedrooms</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Vacuuming and mopping all floors, carpets, and hard surfaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Wiping down doors, baseboards, light switches, wall outlets, and vent covers</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Dusting ceiling fans, and window sills</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Cleaning inside closets and storage spaces</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Removing cobwebs from corners</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <span>Surface cleaning of the entire home</span>
                </li>
              </ul>
            </div>

            {/* Add-ons */}
            <div className="bg-white rounded-xl p-8 shadow-md border-2 border-purple-200 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">Optional Add-On Services</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Inside window cleaning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Blind cleaning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Wall washing</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Basement cleaning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <span>Garage sweeping and organization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Showcase – Detail Shots */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-8">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">The Difference</span>
            <h2 className="display-serif text-2xl md:text-3xl font-bold mt-2">See the Inspection-Ready Detail</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg group">
              <img width={800} height={800} src={calgaryKitchenClean} alt="Spotless Calgary kitchen after move-out cleaning" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="p-4 bg-white">
                <h3 className="font-bold mb-1">Degreased Kitchens</h3>
                <p className="text-sm text-muted-foreground">Stovetops, range hoods, backsplashes, and inside every appliance.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg group">
              <img width={800} height={800} src={calgaryBathroomClean} alt="Sanitized Calgary bathroom with polished tile" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="p-4 bg-white">
                <h3 className="font-bold mb-1">Bathroom Transformations</h3>
                <p className="text-sm text-muted-foreground">Soap scum, hard water stains, and high-touch areas restored.</p>
              </div>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg group">
              <img width={800} height={800} src={calgaryLivingRoomClean} alt="Move-in ready Calgary living room professionally cleaned" className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
              <div className="p-4 bg-white">
                <h3 className="font-bold mb-1">Move-In Ready Rooms</h3>
                <p className="text-sm text-muted-foreground">Baseboards, vents, light switches, and inside closets all detailed.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Band */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img width={800} height={800} src={calgaryMoveOutClean} alt="Calgary family moving into a clean, fresh home" className="w-full h-[420px] object-cover" loading="lazy" />
            </div>
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Move-In Ready</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Walk Into a Truly Fresh Home</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A previous tenant's "clean" rarely meets your standards. Our move in cleaning Calgary service strips away years of hidden dust, kitchen grease, bathroom buildup, and lingering odors so the first night in your new home feels like a brand-new build — not someone else's leftovers.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span>Professional cleaning team assigned based on the size and needs of the home</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span>High-quality equipment and professional cleaning products</span></li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" /><span>Move-out cleaning checklist designed to meet landlord inspection standards your landlord will love</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <MoveOutDepth city="Calgary" showPricing={false} />

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose Duty Cleaners for Move Out Cleaning in Calgary
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[hsl(160,100%,97%)] to-white border-2 border-[hsl(160,100%,30%)]/20 rounded-xl p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="w-16 h-16 bg-[hsl(160,100%,30%)]/10 rounded-2xl flex items-center justify-center mb-4">
                <DollarSign className="w-8 h-8 text-[hsl(160,100%,30%)]" />
              </div>
              <h3 className="text-xl font-bold mb-3">Get Your Full Deposit Back</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our detailed move out cleaning service ensures you leave the property in pristine condition, increasing the likelihood of receiving your full security deposit. Calgary landlords and property managers know and trust our thorough cleaning standards.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <Home className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Move Into a Spotless Home</h3>
              <p className="text-muted-foreground leading-relaxed">
                Starting fresh? Our professional move in cleaning in Calgary eliminates dust, allergens, and lingering odors, so your new home is truly move-in ready. We clean areas that previous occupants may have neglected.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white border-2 border-green-200 rounded-xl p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Affordable & Transparent Pricing</h3>
              <p className="text-muted-foreground leading-relaxed">
                {/* Was "no hidden fees" on a page that named none of them. */}
                Starting rates depend on your home’s size, condition and the services you choose. Three
                charges sit outside that: {POLICY.cancellationFee} for cancelling inside{" "}
                {POLICY.cancellationNoticeHours} hours, {POLICY.lockoutFee} if we arrive and cannot get in,
                and $29.99 for an address outside Calgary city limits. All three appear on your quote before
                you book, and every figure is before 5% GST.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-white border-2 border-accent/20 rounded-xl p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-4">
                <Clock className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-3">Availability & Service Areas</h3>
              <p className="text-muted-foreground leading-relaxed">
                We offer weekday and weekend move-in / move-out cleaning across Calgary, Airdrie, Cochrane, Okotoks, Chestermere, and surrounding communities, based on availability.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-xl p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Trusted & Experienced Cleaners</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our move out cleaners in Calgary are carefully vetted professionals, committed to delivering a high-quality cleaning experience. We bring all the necessary equipment, and products you prefer can be used on request.
              </p>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-200 rounded-xl p-8 transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl hover:shadow-[hsl(200,30%,70%)]/30">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Satisfaction Guarantee</h3>
              <p className="text-muted-foreground leading-relaxed">
                We stand behind our work with a complete satisfaction guarantee. If you're not happy with any aspect of our Calgary move out cleaning services, just let us know within 24 hours of your cleaning and we'll come back to re-clean at no additional charge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">
            Move Out Cleaning Services Throughout Calgary
          </h2>
          <p className="text-center text-muted-foreground mb-12">
            Our professional move out cleaning teams serve all neighbourhoods across Calgary and surrounding areas
          </p>

          <div className="bg-white rounded-xl p-8 shadow-md">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Downtown Calgary', 'Beltline', 'Kensington', 'Inglewood', 'Brentwood', 'McKenzie Towne', 'Varsity', 'Bridgeland', 'Marda Loop', 'Mahogany', 'Auburn Bay', 'Cranston', 'Airdrie', 'Cochrane', 'Okotoks'].map(area => <div key={area} className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span>{area}</span>
                </div>)}
            </div>

            <p className="text-center text-muted-foreground mt-8 pt-6 border-t">
              Don't see your neighbourhood listed? <Link to="/contact-us/" className="text-primary font-semibold hover:underline">Contact us!</Link> We likely serve your area and can provide professional move out cleaning services throughout the Calgary region.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">
            Transparent Move Out Cleaning Pricing in Calgary
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            Our move out cleaning prices in Calgary are based on your home's size, condition, and any additional services you choose. We offer clear starting rates to help you plan your cleaning.
          </p>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gradient-to-br from-primary/10 to-white border-2 border-primary/20 rounded-xl p-8 text-center hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4">Studio/1 Bedroom</h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-primary">$284</div>
                <div className="text-sm text-muted-foreground">Starting at</div>
              </div>
              <p className="text-sm text-muted-foreground">Flat rate — full checklist</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-8 text-center hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4">2-3 Bedrooms</h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-blue-600">$361-$424</div>
                <div className="text-sm text-muted-foreground">Starting at</div>
              </div>
              <p className="text-sm text-muted-foreground">Flat rate — full checklist</p>
            </div>

            <div className="bg-gradient-to-br from-accent/10 to-white border-2 border-accent/20 rounded-xl p-8 text-center hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-bold mb-4">4+ Bedrooms</h3>
              <div className="mb-4">
                <div className="text-4xl font-bold text-accent">$501+</div>
                <div className="text-sm text-muted-foreground">Starting at</div>
              </div>
              <p className="text-sm text-muted-foreground">Flat rate — full checklist</p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground mb-6">
              For the most accurate pricing, use our online calculator or contact us for a custom quote tailored to your specific needs.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white" asChild>
              <a href="#quote">
                See My Instant Price
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">
            Frequently Asked Questions About Move Out Cleaning in Calgary
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`} className="bg-white rounded-xl px-6 border-2 border-border">
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
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold mb-6">
            Book Your Calgary Move Out Cleaning Today
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Don't let cleaning add to your moving stress—leave it to the pros! Our expert move out cleaners in Calgary ensure a spotless, move-in ready home with flexible scheduling and guaranteed results.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-white text-brand-navy hover:bg-white/90 text-lg px-8 h-14" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8 h-14" asChild>
              <a href="tel:4037681341">
                <Phone className="mr-2 w-5 h-5" />
                Call Now: (403) 768-1341
              </a>
            </Button>
          </div>

          <p className="text-white/80">
            Same-day and next-day appointments are often available. Contact us now to secure your preferred date and time.
          </p>
        </div>
      </section>
      </main>

      <section className="pb-16">

        <div className="container mx-auto px-4">

          <CityCrossLink city="Edmonton" to="/move-out-cleaning-edmonton/" description="Move-out and move-in cleaning for Edmonton homes and rentals." />

        </div>

      </section>

      <Footer hasQuoteSection />
    </div>;
}