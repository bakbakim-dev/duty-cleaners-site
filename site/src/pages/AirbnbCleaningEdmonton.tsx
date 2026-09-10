import { HOURLY_RATE, GST_RATE, formatPrice, withGst, FREQUENCIES } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import { CITY_PROOF, RATING_CLAIM, COMPANY } from "@/data/proof";
import { canonicalForPath } from "@/data/legacy-urls";
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
  ClipboardCheck,
  KeyRound,
  Wand2,
  DoorOpen,
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
import imgBathroom from "@/assets/gallery/bathroom-clean.webp";
import imgKitchen from "@/assets/gallery/kitchen-deep-clean.webp";
import imgLiving from "@/assets/gallery/living-room-clean.webp";
import imgLaundry from "@/assets/cleaning-equipment-flatlay.webp";
import imgEssentials from "@/assets/gallery/eco-products.webp";
import heroBg from "@/assets/airbnb/edmonton-hero-living.webp";

import gal1 from "@/assets/gallery/family-clean-home-edmonton.webp";
import gal2 from "@/assets/gallery/bathroom-clean.webp";
import gal3 from "@/assets/gallery/kitchen-deep-clean.webp";
import gal4 from "@/assets/gallery/living-room-clean.webp";
import gal5 from "@/assets/gallery/before-after.webp";
import gal6 from "@/assets/hero-family-bedroom.webp";
import { Helmet } from "react-helmet-async";
import CityCrossLink from "@/components/CityCrossLink";
import LocalMarketNote from "@/components/LocalMarketNote";

/* Every figure on this page derives from bk-config, policy.ts or proof.ts.
   Nothing here is hand-typed. */
const proof = CITY_PROOF.edmonton;
const RATE = formatPrice(HOURLY_RATE);
const MIN_ONE = formatPrice(HOURLY_RATE * 3);
const MIN_ONE_GST = formatPrice(withGst(HOURLY_RATE * 3));
const MIN_TWO = formatPrice(HOURLY_RATE * 2 * 2);
const FOUR_HOURS = formatPrice(HOURLY_RATE * 4);
const GST_PCT = `${Math.round(GST_RATE * 100)}%`;
const TRAVEL = travelFee("airbnb");
const TRAVEL_LINE = TRAVEL === null ? "a travel fee, quoted when you book" : `a ${formatPrice(TRAVEL)} travel fee per visit`;
const WEEKLY = FREQUENCIES.find((f) => f.id === "weekly");
const WEEKLY_PCT = WEEKLY ? `${Math.round(WEEKLY.discount * 100)}%` : "a";
const GUARANTEE_HOURS = POLICY.guaranteeWindowHours;
const PRICING = canonicalForPath("/pricing");
const RECURRING = canonicalForPath("/edmonton/recurring-cleaning");
const SERVICES = canonicalForPath("/services");
const TITLE = `Airbnb Cleaning Edmonton from ${RATE}/hour | Duty Cleaners`;
const DESCRIPTION = `Airbnb turnover cleaning across Edmonton from ${RATE} per cleaner-hour, 3-hour minimum. Linens, restocking and a fixed checklist between guests.`;

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
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="font-bold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const AirbnbCleaningEdmonton = () => {
  /* One list. The page used to carry this twice, once with photos and once
     with icons, and the two had drifted apart. */
  const whatWeClean = [
    { image: imgBedroom, title: "Bedrooms and beds", description: "Beds stripped and remade with the linen you leave out, nightstands and surfaces dusted, floors vacuumed." },
    { image: imgBathroom, title: "Bathrooms sanitised", description: "Toilets, sinks, tubs and showers disinfected, mirrors and chrome wiped dry, hair cleared from the drain cover." },
    { image: imgKitchen, title: "Kitchen reset", description: "Counters and sink scrubbed, appliance exteriors and the inside of the microwave wiped, dishwasher emptied if it has run." },
    { image: imgLiving, title: "Living areas", description: "Floors vacuumed and mopped, surfaces dusted, cushions straightened, remotes and chargers put back where the listing photo shows them." },
    { image: imgLaundry, title: "Laundry and linen changes", description: "Available when the machines are ready to use and clean linens are prepared and accessible for the cleaners. Without a spare set, the beds are made with what is on site." },
    { image: imgEssentials, title: "Restocking and bins", description: "Soap, shampoo and paper goods replenished from the supplies you leave on site. Bins emptied and relined, garbage and recycling taken to the building's collection point." },
  ];

  const howItWorks = [
    { icon: ClipboardCheck, title: "Send the checkout time", description: "Book online or by phone with the checkout and the next check-in. Those two times set the window we work in." },
    { icon: KeyRound, title: "Tell us how to get in", description: "Lockbox code, smart lock or a key on site. Most hosts are never present, and the booking form asks for access and parking." },
    { icon: Wand2, title: "The turnover runs to a checklist", description: "The same list every visit, so the third turnover looks like the first. Anything the guest left behind is set aside and reported." },
    { icon: DoorOpen, title: "Ready before check-in", description: "Beds made, supplies restocked, bins out, door locked. If something needs your attention, a photo comes with the report." },
  ];

  const whyChooseUs = [
    { icon: Clock, title: "Arrival windows, not a vague afternoon", description: `We schedule to one of three windows: ${ARRIVAL_WINDOWS.join(", ")}. For a same-day changeover, tell us the checkout time and we pick the window that fits.` },
    { icon: Star, title: RATING_CLAIM, description: `That rating covers Edmonton homes and rentals ${COMPANY.sinceLabel}. Every cleaner is reference-checked before their first job and rated by the customer after every visit.` },
    { icon: Calendar, title: "No contract, no deposit", description: "Nothing is charged when you book. Your card is charged once the turnover is complete, and you can book one visit or a season of them." },
    { icon: Shield, title: "We bring the supplies", description: `Products and equipment come with the team. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.` },
  ];

  const gallery = [
    { src: gal1, alt: "Clean Edmonton Airbnb home interior" },
    { src: gal2, alt: "Sanitised Edmonton Airbnb bathroom" },
    { src: gal3, alt: "Edmonton short-term rental kitchen deep clean" },
    { src: gal4, alt: "Edmonton Airbnb living room after a turnover" },
    { src: gal5, alt: "Edmonton Airbnb cleaning before and after" },
    { src: gal6, alt: "Edmonton Airbnb bedroom turnover" },
  ];

  const faqs = [
    {
      q: "How much does Airbnb cleaning cost in Edmonton?",
      a: `${RATE} per cleaner per hour, before ${GST_PCT} GST, with a minimum of 3 hours for one cleaner or 2 hours for two. A one-bedroom condo at the minimum is ${MIN_ONE} before tax. Most hosts know their typical figure after the first two or three turnovers, and it holds unless the guest count or the condition changes.`,
    },
    {
      q: "Why is it hourly rather than a flat rate?",
      a: "A flat rate by home size assumes a lived-in home, and a rental between guests can be anything from ten minutes of tidying to a full reset after a week-long stay. Hourly means you pay for the time the turnover actually took. If you would rather have a fixed number, the standard cleaning rates on the Edmonton price list apply to short-term rentals as well.",
    },
    {
      q: "Do you offer same-day Airbnb cleaning?",
      a: "Only when a team is free that day, which we cannot promise. Book each turnover as soon as the checkout date is fixed. During K-Days and the Fringe the afternoon slots fill first, and a host with the dates booked in advance keeps them.",
    },
    {
      q: "Do you handle laundry and linens?",
      a: "Laundry and linen changes are available, provided that the machines are ready to use and clean linens are prepared and accessible for the cleaners. A second set of sheets and towels is the single change that shortens a turnover most, because the beds go on while the wash runs.",
    },
    {
      q: "Can you restock guest supplies?",
      a: "Yes, from supplies you leave on site. We do not buy stock on your behalf. Keep a labelled bin of soap, paper goods and coffee in a closet and tell us where it is in the booking notes.",
    },
    {
      q: "Do I need to be there?",
      a: `No. Most hosts give us a lockbox code or a smart-lock code and never meet the team. If nobody can get in at the booked time, the lockout fee is ${POLICY.lockoutFee}, so keep the code current.`,
    },
    {
      q: "Is there a travel fee for listings outside Edmonton?",
      a: `Inside Edmonton city limits there is no trip fee. Listings in St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont or the other surrounding towns carry ${TRAVEL_LINE}, shown on the quote before you confirm.`,
    },
    {
      q: "What if a guest checks in and finds something missed?",
      a: `Tell us within ${GUARANTEE_HOURS} hours of the turnover and we come back and re-clean the missed item at no charge. Photos help but are not required. The window is short on purpose: after a new guest has been in, nobody can tell whose mess it is.`,
    },
    {
      q: "What happens if I cancel a turnover?",
      a: `Free with ${POLICY.cancellationNoticeHours} hours' notice. Inside that window the cancellation fee is ${POLICY.cancellationFee}. A guest cancelling on you is the usual reason, so tell us the moment the platform does.`,
    },
    {
      q: "Do you clean the unit when it is my own home between guests?",
      a: `Yes, and if you live there most of the year, recurring cleaning is usually cheaper than hourly turnovers: ${WEEKLY_PCT} off from the second weekly visit, with the first clean at the standard rate. Book the recurring plan for your own weeks and hourly turnovers for the guest weeks.`,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/edmonton/airbnb-cleaning/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/edmonton/airbnb-cleaning/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
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
          {JSON.stringify(buildServiceSchema({ name: "Airbnb Turnover Cleaning", description: DESCRIPTION, path: "/edmonton/airbnb-cleaning", city: "edmonton" }))}
        </script>
      </Helmet>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-brand-navy overflow-hidden">
        <img width={1280} height={720}
          src={heroBg}
          alt="Guest-ready short-term rental living room in Edmonton after a turnover clean"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Home className="w-4 h-4 text-accent" />
            <span className="text-white/90 text-sm font-medium">
              Short-term rental turnovers, by the hour
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            Airbnb Cleaning Service in Edmonton
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
            {RATE} per cleaner-hour before GST, 3-hour minimum, rated {RATING_CLAIM}
          </p>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            Between guests the team works to the same checklist every visit: beds stripped and remade
            with your linen, bathrooms and kitchen sanitised, supplies restocked from what you leave on
            site, bins out and the door locked. You pay for the hours the turnover takes, and nothing
            is charged until it is done.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={PRICING}>See my price</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <Link to="/contact-us/?topic=airbnb&city=edmonton">Request a callback</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <a href={proof.phoneLink}>
                <Phone className="w-4 h-4 mr-2" />
                Call {proof.phone}
              </a>
            </Button>
          </div>
          <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Nothing charged when you book</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>No contract: one turnover or a season</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>{GUARANTEE_HOURS}-hour re-clean guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>{RATE} per cleaner-hour, or 2 hours with two cleaners</span>
            </div>
          </div>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Edmonton turnovers"
        heading="What running a short-term rental in Edmonton actually demands"
        paragraphs={[
          "Edmonton's short-term rental year has two peaks rather than one, and they sit back to back. K-Days runs through late July, and the Fringe takes over Old Strathcona for most of August. A Whyte Avenue or Garneau listing can spend those weeks fully booked on one- and two-night stays, which means turnovers every single day rather than the two or three a week the same property sees in October.",
          "Winter is the opposite problem, and it is the one that damages a listing's rating. Edmonton holds its cold rather than cycling through it, so the salt and sand tracked in from November onward arrives dry and stays put. It works into entry mats, along baseboards and into the grout at the door. Guests notice it immediately because it is the first thing they step on. Entryways get specific attention on every winter turnover for exactly that reason.",
          "The paperwork matters too. Edmonton requires a business licence to operate a short-term rental, and hosts renting near Rogers Place or the university are the ones most likely to be asked about their cleaning process, by the platform, by a condo board, or by a guest querying a cleaning fee. We work to a fixed checklist, so you can say precisely what is covered on each visit.",
        ]}
      />

      {/* What a turnover includes: one list, with photos */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">The checklist</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What a short-term rental turnover includes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Six areas, the same order every visit. Laundry and dishes sit outside the standard
                scope; laundry is added when the machines and a spare set of linen are ready.
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

      {/* How It Works */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How an Airbnb turnover is booked and done
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Four steps, and you are not needed for any of them after the first.
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

      {/* Cost, with the worked minimum. Hourly service is the honest figure for
          a turnover; the rate and the minimum both derive from bk-config. */}
      <section className="py-16 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              What an Airbnb turnover costs in Edmonton
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Turnovers are priced hourly at {RATE} per cleaner, before {GST_PCT} GST, because no two
              properties take the same time. A one-bedroom condo with a stacked washer is a different
              job from a four-bedroom house with three bathrooms. The minimum is 3 hours for one
              cleaner, or 2 hours for two.
            </p>
            <div className="bg-card rounded-2xl border border-border p-6 mb-4">
              <h3 className="font-bold text-foreground mb-3">Worked example: a one-bedroom condo downtown</h3>
              <ul className="space-y-2 text-muted-foreground text-sm leading-relaxed">
                <li>One cleaner at the 3-hour minimum: 3 × {RATE} = <strong>{MIN_ONE}</strong> before GST, {MIN_ONE_GST} with it.</li>
                <li>Two cleaners for the 2-hour minimum, when the check-in is close behind the checkout: 4 cleaner-hours = <strong>{MIN_TWO}</strong> before GST.</li>
                <li>A three-bedroom house after a week-long stay usually runs to 4 cleaner-hours, {FOUR_HOURS} before GST, and less once the routine is established.</li>
                <li>Listings outside Edmonton city limits add {TRAVEL_LINE}.</li>
              </ul>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Most hosts settle into a predictable number within the first two or three turnovers, and
              we tell you what that looks like for your property after the first clean. If you would
              rather have a flat rate by home size, the standard cleaning rates on{" "}
              <Link to={PRICING} className="text-accent underline underline-offset-2">
                the full Edmonton price list
              </Link>{" "}
              apply to short-term rentals too. Every figure there is before GST, and nothing is charged
              until the clean is done.
            </p>
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
                  The terms
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Edmonton Airbnb hosts get from Duty Cleaners
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

      {/* Where we go, and where the rest of the service sits */}
      <section className="py-16 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Where we turn over short-term rentals
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Anywhere inside Edmonton city limits at the rate above, with no trip fee. Outside them
              the same crews cover the surrounding towns for {TRAVEL_LINE}:{" "}
              <Link to="/cleaning-services-st-albert/" className="text-accent underline underline-offset-2">
                St. Albert house cleaners
              </Link>{" "}
              come from the same office, and{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-accent underline underline-offset-2">
                house cleaning in Sherwood Park
              </Link>{" "}
              runs on the same checklist east of the city.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Turnovers are one service of nine. The company has done{" "}
              <Link to="/" className="text-accent underline underline-offset-2">
                house cleaning in Edmonton
              </Link>{" "}
              {COMPANY.sinceLabel}, and you can compare{" "}
              <Link to={SERVICES} className="text-accent underline underline-offset-2">
                all Edmonton cleaning services and prices
              </Link>{" "}
              on one page. A host who lives in the unit most of the year usually does better on{" "}
              <Link to={RECURRING} className="text-accent underline underline-offset-2">
                recurring cleaning in Edmonton
              </Link>{" "}
              for their own weeks, with hourly turnovers only for the guest weeks.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Before you book, you can{" "}
              <Link to="/reviews/" className="text-accent underline underline-offset-2">
                read the reviews
              </Link>{" "}
              behind the {RATING_CLAIM} figure. They are from homeowners and hosts, unedited.
            </p>
          </div>
        </AnimatedSection>
      </section>

      {/* Guest-Ready Results Gallery */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-primary text-sm font-medium">After the turnover</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                What a finished turnover looks like
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The state every Edmonton rental is left in before the next guest checks in.
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
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Airbnb cleaning questions from Edmonton hosts
              </h2>
              <p className="text-muted-foreground">
                Rate, minimum, linen, access and what happens when something goes wrong.
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

      {/* Guarantee and contact */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-4xl text-center">
            <div className="bg-card rounded-2xl border border-border p-10 shadow-sm">
              <Shield className="w-14 h-14 mx-auto mb-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
                The {GUARANTEE_HOURS}-hour re-clean guarantee
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                If a turnover misses something, tell us within {GUARANTEE_HOURS} hours and we come back
                and re-clean it at no charge. Photos help us send the right person but are not a
                condition. {POLICY.insuranceClaim}
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-muted/30 rounded-xl p-6 text-left">
                  <h3 className="font-bold text-foreground mb-2">Payment</h3>
                  <p className="text-muted-foreground text-sm">
                    Nothing is charged when you book. The day before, a temporary hold confirms the
                    card; it is charged once the turnover is complete. Visa, Mastercard, American
                    Express, debit and e-transfer.
                  </p>
                </div>
                <div className="bg-muted/30 rounded-xl p-6 text-left">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3 className="font-bold text-foreground">Contact Us</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-1">
                    <strong>Call:</strong>{" "}
                    <a href={proof.phoneLink} className="text-accent underline underline-offset-2">{proof.phone}</a>
                  </p>
                  <p className="text-muted-foreground text-sm mb-1">
                    <strong>Address:</strong> {proof.address}
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
            Book the next Edmonton turnover
          </h2>
          <p className="text-xl mb-8 text-white/80">
            {RATE} per cleaner-hour, before GST. Send the checkout time and how to get in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={PRICING}>See my price</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <Link to="/contact-us/?topic=airbnb&city=edmonton">Request a callback</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
              <a href={proof.phoneLink}>
                <Phone className="w-4 h-4 mr-2" />
                Call {proof.phone}
              </a>
            </Button>
          </div>
        </div>
      </section>
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <CityCrossLink city="Calgary" to="/airbnb-cleaning-services-calgary/" description="Airbnb turnover cleaning for Calgary short-term rentals." />
        </div>
      </section>
      </main>


      <Footer />
    </div>
  );
};

export default AirbnbCleaningEdmonton;
