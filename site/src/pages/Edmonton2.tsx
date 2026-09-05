import { CITY_PROOF } from "@/data/proof";
import LocalMarketNote from "@/components/LocalMarketNote";
import { BRANCH_PROFILES, BRANCH_IDENTITY } from "@/data/proof";
import { useEffect, useState } from "react";
import { EDMONTON_REVIEWS } from "@/data/reviews";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import CityConversionIntro from "@/components/CityConversionIntro";
import CityRecentCleans from "@/components/CityRecentCleans";
import CityCoverageGrid from "@/components/CityCoverageGrid";
import ThresholdLine from "@/components/ThresholdLine";
import HomeRhythmStrip from "@/components/HomeRhythmStrip";
import Eyebrow from "@/components/Eyebrow";
import CityServicesChapter from "@/components/CityServicesChapter";
import CityIncludedChapter from "@/components/CityIncludedChapter";
import RecentActivityStrip from "@/components/RecentActivityStrip";
import ServiceStartCard from "@/components/quote/ServiceStartCard";
import DutyCleanPromise from "@/components/DutyCleanPromise";
import JudgmentFree from "@/components/JudgmentFree";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import { Accent } from "@/components/Accent";
import { edmontonNeighborhoods, edmontonSurrounding } from "@/data/city-locations";
import CityPricingTable from "@/components/CityPricingTable";
import StatBand from "@/components/StatBand";
import NeighborhoodMarquee from "@/components/NeighborhoodMarquee";
import CostGuides from "@/components/CostGuides";
import judgmentRoom from "@/assets/whats-included-hero.webp";
import DirectContactPanel from "@/components/DirectContactPanel";
import { Button } from "@/components/ui/button";
import { Phone, Calculator, CheckCircle2, Sparkles, Home, HardHat, Star, Shield, Clock, MapPin, Award, Users, TrendingUp, Bed, Bath, Sofa, ChefHat, ChevronDown, ChevronUp, LucideIcon, Zap, ThumbsUp, Leaf, DollarSign, Truck, Calendar, MessageSquare, ExternalLink, Play, Heart, KeyRound, ArrowRight, BadgeCheck, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import CityCrossLink from "@/components/CityCrossLink";
import GetInTouch from "@/components/GetInTouch";
import { quoteCtaLabel, useQuoteProgress } from "@/lib/quote-progress";
import { Suspense, lazy } from "react";
const EdmontonServiceAreaMap = lazy(() => import("@/components/EdmontonServiceAreaMap"));
import edmontonHeroRoom from "@/assets/hero-room-edmonton-manus.webp";
import edmontonHeroRoom640 from "@/assets/hero-room-edmonton-manus-640w.webp";
import edmontonHeroRoom960 from "@/assets/hero-room-edmonton-manus-960w.webp";
import edmontonHeroRoom1280 from "@/assets/hero-room-edmonton-manus-1280w.webp";
import edmontonHeroRoom1920 from "@/assets/hero-room-edmonton-manus-1920w.webp";

import galleryLivingRoom from "@/assets/gallery/living-room-clean.webp";
import galleryMoveOutClean from "@/assets/gallery/move-out-clean.webp";
import galleryWindowDetail from "@/assets/gallery/window-cleaning.webp";
import teamCheryse from "@/assets/team/edmonton-cheryse.webp";
import teamRuchan from "@/assets/team/edmonton-ruchan.webp";
import teamScottilee from "@/assets/team/edmonton-scottilee.webp";
import teamDijana from "@/assets/team/edmonton-dijana.webp";
import teamClarice from "@/assets/team/clarice-cleaner.webp";

import galleryOvenBA from "@/assets/gallery/dc-oven-before-after.webp";
import galleryPostKitchen from "@/assets/gallery/dc-post-kitchen.webp";
import galleryStoveDetail from "@/assets/gallery/dc-stove-detail.webp";
import galleryStoveBA from "@/assets/gallery/dc-stove-before-after.webp";
import galleryModernKitchen from "@/assets/gallery/dc-modern-kitchen.webp";
import galleryToiletBA from "@/assets/gallery/dc-toilet-before-after.webp";
import { standardTierRows, moveInOutTierRows } from "@/data/pricing";

/* Width-descriptor set for the hero, the LCP element on this page. Without
   it a phone pulled the same 1920px file as a desktop: hero-room-edmonton-manus at 1920w against
   the 640w variant a phone actually needs. sizes is 100vw because the hero
   is full-bleed. */
const HERO_SRCSET = [
  `${edmontonHeroRoom640} 640w`,
  `${edmontonHeroRoom960} 960w`,
  `${edmontonHeroRoom1280} 1280w`,
  `${edmontonHeroRoom1920} 1920w`,
].join(", ");

/* The schema priceRange, derived. It was hand-typed as "$155-$539+" here and
   "$155-$539" on the twin — numerically right today, inconsistent with each
   other, and exactly the pattern EdmontonMoveInOut.tsx:126 already calls out:
   a figure that stays put while the real prices move. Floor is the cheapest
   standard clean, ceiling the dearest move-out, both straight from bk-config. */
const PRICE_RANGE = `${standardTierRows()[0].price}-${moveInOutTierRows()[moveInOutTierRows().length - 1].price}`;

// Counter card for room counts
const CounterCard = ({
  icon: Icon,
  title,
  count,
  onIncrement,
  onDecrement,
}: {
  icon: LucideIcon;
  title: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) => (
  <div className="flex flex-col items-center gap-2 p-4 bg-card rounded-xl border border-border transition-all">
    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-accent" />
    </div>
    <span className="text-sm font-medium text-center">{title}</span>
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrement}
        className="w-8 h-8 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center text-lg font-medium text-muted-foreground"
      >
        −
      </button>
      <span className="text-lg font-bold w-6 text-center">{count}</span>
      <button
        onClick={onIncrement}
        className="w-8 h-8 rounded-full border border-border hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center text-lg font-medium text-muted-foreground"
      >
        +
      </button>
    </div>
  </div>
);


// Feature card with icon
const FeatureCard = ({
  icon: Icon,
  title,
  description,
  index = 0
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}) => <div className={`group bg-white rounded-xl border border-border p-5 transition-all duration-300 ease-out cursor-pointer hover:-translate-y-2 ${index % 2 === 0 ? 'hover:translate-x-0.5' : 'hover:-translate-x-0.5'} hover:border-primary hover:shadow-xl hover:shadow-primary/10`} style={{
  transformStyle: 'preserve-3d'
}}>
    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
      <Icon className="w-5 h-5 text-primary transition-transform duration-300 group-hover:rotate-12" />
    </div>
    <h3 className="font-bold mb-2 transition-transform duration-300 group-hover:translate-x-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>;

export default function Edmonton2() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  // True while the quote section is on screen — the floating CTA is hidden
  // then, so it never covers the form fields visitors are filling out.
  const [quoteInView, setQuoteInView] = useState(false);
  const quoteProgress = useQuoteProgress();


  useEffect(() => {
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 800);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = ["quote"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => setQuoteInView(entries.some((entry) => entry.isIntersecting)),
      { threshold: 0.05 }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };
  // Flagship LocalBusiness entity — same type pair and richness as the 178
  // location pages, plus a stable @id so every schema node on the site can
  // reference one Edmonton business. No aggregateRating: self-serving review
  // markup is against Google policy. TODO-OWNER: add `geo` with the verified
  // lat/long (5+ decimals) of the 71 Ave office when confirmed.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://dutycleaners.ca/#edmonton",
    name: BRANCH_IDENTITY.edmonton.name,
    url: BRANCH_IDENTITY.edmonton.url,
    parentOrganization: { "@id": "https://dutycleaners.ca/#org" },
    image: "https://dutycleaners.ca/og-image.jpg",
    logo: "https://dutycleaners.ca/logo.png",
    telephone: CITY_PROOF.edmonton.phoneE164,
    email: "support@dutycleaners.ca",
    address: {
      "@type": "PostalAddress",
      streetAddress: "18615 71 Ave NW",
      addressLocality: "Edmonton",
      addressRegion: "AB",
      postalCode: "T5T 2V9",
      addressCountry: "CA"
    },
    hasMap: "https://www.google.com/maps?cid=8192121191672692049",
    sameAs: [...BRANCH_PROFILES.edmonton],
    areaServed: [
      "Edmonton", "St. Albert", "Sherwood Park", "Spruce Grove", "Leduc",
      "Beaumont", "Fort Saskatchewan", "Stony Plain", "Morinville", "Devon",
    ].map((name) => ({ "@type": "City", name })),
    priceRange: PRICE_RANGE,
    openingHours: ["Mo-Sa 08:00-20:00", "Su 09:00-15:00"],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "08:00",
        closes: "20:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "Sunday", opens: "09:00", closes: "15:00" },
    ]
  };
  const faqs = [{
    question: "Do you serve all areas of Edmonton?",
    answer: "Yes! Our Edmonton cleaning teams serve all quadrants (NW, NE, SW, SE, Central) and surrounding communities within a 30km radius including St. Albert, Sherwood Park, Spruce Grove, Leduc, Fort Saskatchewan, and Beaumont."
  }, {
    question: "How do Edmonton winters affect your cleaning service?",
    answer: "Our Edmonton cleaning professionals work year-round! We account for Alberta winter conditions by scheduling buffer time for traffic and weather delays."
  }, {
    question: "Do you clean high-rise condos in downtown Edmonton?",
    answer: "Absolutely! Our Edmonton team is experienced with high-rise building protocols, parking passes, and building access requirements in Oliver, Downtown, and along Jasper Avenue."
  }, {
    question: "Do you offer same-day cleaning service in Edmonton?",
    answer: "Yes, subject to availability! Our Edmonton cleaning crews understand that life gets busy. Call us and we'll do our best to accommodate same-day or next-day requests."
  }, {
    question: "What cleaning products do you use?",
    answer: "Our teams arrive with all supplies and equipment included. If there is a product line you prefer — or one you want us to avoid — note it on your booking and we will work to it."
  }];
  // Schema must mirror the FAQs actually rendered on the page.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer }
    }))
  };
  // Real Google reviews only — see src/data/reviews.ts.
  const googleReviews = EDMONTON_REVIEWS;
  return <>
      <Helmet>
        <title>House Cleaning Services Edmonton | Duty Cleaners</title>
        <meta name="description" content="Book trusted house cleaning services in Edmonton. Standard, deep, move-out, and recurring cleaning with customer-rated cleaners." />
        <link rel="canonical" href="https://dutycleaners.ca/" />
        <meta property="og:title" content="House Cleaning Services Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Book trusted house cleaning services in Edmonton. Standard, deep, move-out, and recurring cleaning with customer-rated cleaners." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Services Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Book trusted house cleaning services in Edmonton. Standard, deep, move-out, and recurring cleaning with customer-rated cleaners." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="edmonton" />
        <main id="main-content" tabIndex={-1}>
        
        
         <CityConversionIntro
           city="Edmonton"
           phone="(780) 913-6565"
           phoneLink="tel:7809136565"
           heroImage={edmontonHeroRoom}
           heroSrcSet={HERO_SRCSET}
           heroAlt="Bright, freshly cleaned Edmonton living room with sunlight across the floor"
           heroPosition="center"
           heroScrim="soft"
           processImages={[
             { src: galleryPostKitchen, alt: "Spotless Edmonton kitchen after a professional cleaning" },
             { src: galleryLivingRoom, alt: "Tidy Edmonton living room after a Duty Cleaners visit" },
             { src: galleryModernKitchen, alt: "Fresh Edmonton home kitchen after a detailed cleaning" },
           ]}
         />


        {/*
          Mirrors Calgary's note, which sat on that page alone. Every claim here
          is already made in the same terms across the fact-checked location
          pages — Edmonton's winter holds rather than thawing repeatedly, so the
          grit arrives in one March load instead of all season.
        */}
        <LocalMarketNote
          accent="primary"
          eyebrow="Cleaning in Edmonton"
          heading="What an Edmonton house actually needs, and when"
          paragraphs={[
            "Edmonton's winter holds. Where Calgary thaws and refreezes all season, the roads here stay frozen, so the sand and de-icer that go down in November largely stay outside until the melt — and then arrive at the door in one heavy load through March and early April. That timing is the useful part: entryways, stair treads and the first two metres of hallway take the whole winter's worth at once, which is why spring is when Edmonton homes book a deep clean rather than a standard one, and why a February visit is mostly maintenance.",
            "The housing stock splits the work in two. The mature core — Glenora, Westmount, Old Strathcona, Garneau — is largely pre-war and early post-war: original trim, deeper window sills, more door frames, and rooms divided rather than open, all of which take longer per square metre than the floor area suggests. The newer edges in the southwest and southeast, Windermere, Terwillegar, Summerside and Glastonbury, are larger and faster to clean per square metre, but a home in its first year or two is still shedding construction dust from vents and closet shelves. The same bedroom count can be two quite different jobs, so describe the home rather than only its size.",
            "We clean across Edmonton and the surrounding communities — St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville and Devon — with no trip fee inside the city itself. Prices are identical to Calgary's; there is no city premium, and every figure is before 5% GST. If you are not sure whether your home needs a standard clean or a deep one, the booking form asks when it was last properly cleaned and recommends from your answer.",
          ]}
        />

        {/* Social proof first — momentum before persuasion */}
        <RecentActivityStrip city="Edmonton" reviews={googleReviews} />

        <StatBand />

        <CityPricingTable />

        <CostGuides />

        <CityIncludedChapter city="Edmonton" />

        <DutyCleanPromise />

       <JudgmentFree image={judgmentRoom} alt="Tidied Edmonton living room after a routine clean — lived-in, not staged" />

        <CityServicesChapter
          city="Edmonton"
          basePath="/edmonton"
          featureImage={galleryLivingRoom}
          featureImageAlt="Bright Edmonton living room after a standard Duty Cleaners visit"
          deepImage={galleryStoveDetail}
          deepImageAlt="Detailed stovetop after a deep clean in an Edmonton home"
        />

        {/* Gallery — asymmetric editorial split: sticky heading column left,
            uneven photo mosaic right. */}
        <section className="band band-paper band-hairline">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>The standard</Eyebrow>
                {/* Was "Real Edmonton Homes" over the AI-generated set, directly
                    above a block saying the real before/afters are not shot yet. */}
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">What a finished clean looks like</h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[
                  { src: galleryPostKitchen, alt: "A kitchen at the end of a clean: countertops cleared and wiped, sink and taps polished, appliance fronts free of marks", label: "Kitchen", tag: "Kitchen" },
                  { src: galleryOvenBA, alt: "An oven interior after the inside-oven add-on: racks, door glass and floor of the cavity degreased", label: "Inside the oven", tag: "Add-on" },
                  { src: galleryToiletBA, alt: "A toilet scrubbed inside and out, including the base and the hinges where build-up collects", label: "Bathroom", tag: "Bathroom" },
                  { src: galleryStoveDetail, alt: "A stovetop and backsplash with cooking film removed, grates and burner rings degreased", label: "Stovetop", tag: "Deep clean" },
                  { src: galleryStoveBA, alt: "A range and the wall behind it after degreasing, with no film left on the surround", label: "Range and surround", tag: "Deep clean" },
                  { src: galleryModernKitchen, alt: "A condo kitchen cleaned to move-out standard, cabinet interiors and drawers emptied and wiped", label: "Move-out", tag: "Move-out" },
                ].map((photo, index) => (
                  <figure
                    key={index}
                    className={`group card-warm relative overflow-hidden bg-muted transition-all duration-300 hover:shadow-xl ${
                      index === 0
                        ? "col-span-2 row-span-2 aspect-[4/3] md:aspect-auto md:min-h-[22rem]"
                        : "aspect-[4/3]"
                    }`}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3 left-3 z-10 text-sm font-semibold uppercase tracking-wider bg-white/90 text-primary px-2.5 py-1 rounded-full shadow-sm">
                      {photo.tag}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <figcaption className="text-white text-sm font-semibold">{photo.label}</figcaption>
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>


        <BeforeAfterGallery city="Edmonton" />

        {/* Reviews */}
        <CityRecentCleans city="Edmonton" reviews={googleReviews} />

        {/* FAQ — objection handling, last before the ask. Full-bleed tinted
            band + two-column split so it doesn't resolve like every other
            centered section. */}
        <section className="band band-white band-hairline">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>FAQ</Eyebrow>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Frequently Asked Questions</h2>

                <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
                  <p className="text-lg font-semibold">Still have a question? Talk to a real human.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Mon&ndash;Sat 8 AM&ndash;8 PM &middot; Sun 9 AM&ndash;3 PM</p>
                  <a href="tel:7809136565" className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-gold-ink transition-colors hover:text-brand-navy">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call (780) 913-6565
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => <div key={index} className="bg-white rounded-xl border border-border overflow-hidden transition-colors hover:border-brand-gold/60">
                    <button onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-secondary/30 transition-colors">
                      <span className="flex items-baseline gap-3">
                        <span className="shrink-0 text-sm font-bold text-gold-ink">{String(index + 1).padStart(2, "0")}</span>
                        <span className="font-semibold pr-4">{faq.question}</span>
                      </span>
                      {openFAQ === index ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0" />}
                    </button>
                    {/* Always in the DOM (hidden when collapsed) so the FAQPage
                        schema's answers match crawlable page content. */}
                    <div className={`px-5 pb-5 pl-[3.25rem] text-muted-foreground leading-relaxed max-w-[65ch] ${openFAQ === index ? "" : "hidden"}`}>
                        {faq.answer}
                      </div>
                  </div>)}
              </div>
            </div>
          </div>
        </section>


        {/* Service Areas — full-width tonal field with a domestic-life crop */}
        <section className="band band-paper band-hairline">
          <div className="container mx-auto px-4">
            <div className="mb-12 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-14">
              <div>
                <Eyebrow>Coverage</Eyebrow>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Edmonton Service Areas</h2>
                <p className="text-muted-foreground mt-4 prose-column leading-relaxed">
                  We proudly serve Edmonton and surrounding communities within a 30km radius.
                </p>
                <p className="text-muted-foreground mt-3 prose-column leading-relaxed">
                  Boot trays in March, windows in June — we clean the way homes are actually lived in here.
                </p>
                <ThresholdLine className="mt-6 max-w-[220px]" />
              </div>
              <HomeRhythmStrip
                slots={[
                  {
                    src: galleryLivingRoom,
                    width: 1024,
                    height: 1024,
                    alt: "Morning light across a tidied Edmonton living room",
                    caption: "Morning light — the front rooms",
                  },
                  {
                    src: galleryMoveOutClean,
                    width: 1024,
                    height: 1024,
                    alt: "Cleaned Edmonton entryway floor after a winter week",
                    caption: "Snow season — the entryway",
                  },
                  {
                    src: galleryWindowDetail,
                    width: 800,
                    height: 800,
                    alt: "Cleaned window and sill detail in an Edmonton home",
                    caption: "Spring — window and sill detail",
                  },
                ]}
              />
            </div>


            <NeighborhoodMarquee city="Edmonton" />
            <CityCoverageGrid city="Edmonton" neighbourhoods={edmontonNeighborhoods} surrounding={edmontonSurrounding} />

            <div className="mt-10 max-w-5xl mx-auto">
              <Suspense fallback={<div className="w-full h-[400px] rounded-xl bg-muted animate-pulse" />}>
                <EdmontonServiceAreaMap />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section id="quote" className="band band-tight band-white band-hairline scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 text-center">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Your next step</span>
                <h2 className="display-serif mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl">Get your instant price.</h2>
                <p className="prose-column mx-auto mt-4 text-lg leading-relaxed text-muted-foreground">
                  Answer a few questions to see your cleaning quote and choose the service that fits your home.
                </p>
              </div>


              <div id="quote-form" className="mx-auto grid w-full max-w-4xl scroll-mt-20 items-stretch overflow-hidden border border-border shadow-xl shadow-brand-navy/10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,20rem)]">
                <div className="bg-card p-2 sm:p-4">
                  <ServiceStartCard phone="(780) 913-6565" phoneLink="tel:7809136565" />
                </div>
                <DirectContactPanel phone="(780) 913-6565" phoneLink="tel:7809136565" />
              </div>



              {/* What happens next */}
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: BadgeCheck, title: "We confirm your price", text: "You see the full quote before anything is booked." },
                  { icon: Users, title: "We match a vetted pro", text: "A reference-checked cleaner is assigned to your home." },
                  { icon: CalendarCheck, title: "We arrive on time", text: "Your pro shows up as scheduled, ready to clean." },
                ].map(({ icon: Icon, title, text }) => (
                  <li key={title} className="rounded-xl border border-border bg-card p-5 text-center">
                    <Icon className="mx-auto h-6 w-6 text-accent" aria-hidden="true" />
                    <p className="mt-3 font-bold text-foreground">{title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4">
          <CityCrossLink
            city="Calgary"
            to="/cleaning-services-calgary/"
            description="House cleaning rated 4.9 on Google for Calgary and surrounding communities, with the same vetted pros and transparent pricing."
          />
        </div>

        <GetInTouch city="Edmonton" />

        </main>

        {/* Floating CTA — reflects unfinished funnel progress */}
        {showFloatingButton && !quoteInView && <aside aria-label="Quick booking actions" className="fixed bottom-4 left-1/2 z-50 hidden -translate-x-1/2 gap-3 md:flex lg:hidden">
            <Button className="flex-1 min-h-[48px] bg-accent px-6 text-base font-bold text-accent-foreground shadow-xl hover:bg-accent/90 sm:flex-none" asChild>
              <a href="#quote">{quoteCtaLabel(quoteProgress)}</a>
            </Button>
            <Button variant="outline" className="min-h-[48px] border-border bg-card px-6 text-base font-semibold shadow-xl" asChild>
              <a href="tel:7809136565">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
            </Button>
          </aside>}


        <Footer hasQuoteSection />
      </div>
    </>;
}