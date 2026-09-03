import LocalMarketNote from "@/components/LocalMarketNote";
import { useEffect, useState } from "react";
import { CALGARY_REVIEWS } from "@/data/reviews";
import { schemaAddressFor, BRANCH_PROFILES, BRANCH_IDENTITY } from "@/data/proof";
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
import DutyCleanPromise from "@/components/DutyCleanPromise";
import JudgmentFree from "@/components/JudgmentFree";
import BeforeAfterGallery from "@/components/BeforeAfterGallery";
import ServiceStartCard from "@/components/quote/ServiceStartCard";
import { Accent } from "@/components/Accent";
import { calgaryNeighborhoods, calgarySurrounding } from "@/data/city-locations";
import CityPricingTable from "@/components/CityPricingTable";
import StatBand from "@/components/StatBand";
import NeighborhoodMarquee from "@/components/NeighborhoodMarquee";
import CostGuides from "@/components/CostGuides";
import judgmentRoom from "@/assets/hero-faq-living-room.webp";
import DirectContactPanel from "@/components/DirectContactPanel";
import { Button } from "@/components/ui/button";
import { Phone, Calculator, CheckCircle2, Sparkles, Home, HardHat, Star, Shield, Clock, MapPin, Award, Users, TrendingUp, Bed, Bath, Sofa, ChefHat, ChevronDown, ChevronUp, LucideIcon, Zap, ThumbsUp, Leaf, DollarSign, Truck, Calendar, MessageSquare, ExternalLink, Play, Heart, KeyRound, ArrowRight, BadgeCheck, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import CityCrossLink from "@/components/CityCrossLink";
import GetInTouch from "@/components/GetInTouch";
import { quoteCtaLabel, useQuoteProgress } from "@/lib/quote-progress";
import { Suspense, lazy } from "react";
const CalgaryServiceAreaMap = lazy(() => import("@/components/CalgaryServiceAreaMap"));
import calgaryHeroRoom from "@/assets/hero-room-calgary.webp";

import galleryOvenBA from "@/assets/gallery/calgary-oven-ba.webp";
import galleryKitchenBA from "@/assets/gallery/calgary-kitchen-ba.webp";
import galleryCalgaryOvenBA from "@/assets/gallery/calgary-oven-ba.webp";
import galleryHappyPlace from "@/assets/gallery/calgary-happy-place.webp";
import galleryCalgaryMoveOut from "@/assets/gallery/calgary-move-out-clean.webp";
import galleryCalgaryWindow from "@/assets/gallery/calgary-window-cleaning.webp";
import gallerySpotlessKitchen from "@/assets/gallery/calgary-spotless-kitchen.webp";
import galleryBathroomDeep from "@/assets/gallery/calgary-bathroom-deep.webp";
import galleryToiletBA from "@/assets/gallery/calgary-toilet-ba.webp";

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

export default function Calgary2() {
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
  // Flagship LocalBusiness entity — mirrors the Edmonton node. Street address
  // matches the one already published on the Contact section (GetInTouch).
  // No aggregateRating: self-serving review markup is against Google policy.
  // TODO-OWNER: confirm postal code + verified lat/long for the 37 Street SW
  // location, then add postalCode and `geo`.
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": "https://dutycleaners.ca/#calgary",
    name: BRANCH_IDENTITY.calgary.name,
    url: BRANCH_IDENTITY.calgary.url,
    parentOrganization: { "@id": "https://dutycleaners.ca/#org" },
    image: "https://dutycleaners.ca/og-image.jpg",
    logo: "https://dutycleaners.ca/logo.png",
    telephone: "+1-403-768-1341",
    email: "support@dutycleaners.ca",
    // One authority for the entity's address (data/proof.ts) — this inline
    // block was one of two stragglers still missing postalCode after the
    // provider-node sweep.
    address: schemaAddressFor("calgary"),
    hasMap: "https://www.google.com/maps?cid=6193344199307583189",
    sameAs: [...BRANCH_PROFILES.calgary],
    areaServed: [
      "Calgary", "Airdrie", "Cochrane", "Okotoks", "Chestermere", "Strathmore",
      "High River", "Langdon", "Crossfield",
    ].map((name) => ({ "@type": "City", name })),
    priceRange: "$155-$539",
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
    question: "Do you serve all areas of Calgary?",
    answer: "Yes! Our Calgary cleaning teams serve all quadrants (NW, NE, SW, SE, Downtown) and surrounding communities within a 30km radius including Airdrie, Cochrane, Okotoks, Chestermere, and surrounding areas."
  }, {
    question: "How do Calgary winters affect your cleaning service?",
    answer: "Our Calgary cleaning professionals work year-round! We account for Alberta winter conditions by scheduling buffer time for traffic and weather delays."
  }, {
    question: "Do you clean high-rise condos in downtown Calgary?",
    answer: "Absolutely! Our Calgary team is experienced with high-rise building protocols, parking passes, and building access requirements in Beltline, Downtown, and along 17th Avenue."
  }, {
    question: "Do you offer same-day cleaning service in Calgary?",
    answer: "Yes, subject to availability! Our Calgary cleaning crews understand that life gets busy. Call us and we'll do our best to accommodate same-day or next-day requests."
  }, {
    question: "What cleaning products do you use?",
    answer: "We bring all cleaning supplies and equipment, and we can use specific products you prefer — just tell us when you book."
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
  const googleReviews = CALGARY_REVIEWS;
  return <>
      <Helmet>
        <title>House Cleaning Services Calgary | Duty Cleaners</title>
        <meta name="description" content="House cleaning services in Calgary. Pay after your clean, customer-rated cleaners, flexible scheduling. Get an instant quote in 60 seconds." />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-calgary/" />
        <meta property="og:title" content="House Cleaning Services Calgary | Duty Cleaners" />
        <meta property="og:description" content="House cleaning services in Calgary. Pay after your clean, customer-rated cleaners, flexible scheduling. Get an instant quote in 60 seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-calgary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Services Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="House cleaning services in Calgary. Pay after your clean, customer-rated cleaners, flexible scheduling. Get an instant quote in 60 seconds." />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="calgary" />
        <main id="main-content" tabIndex={-1}>
        {/* The Calgary hub was the only location-class page with no breadcrumb
            — visible or in schema. It imported Breadcrumbs and never rendered
            it. The Edmonton hub is the site root, where having none is
            correct; this page sits a level down and needs the trail. */}
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

         <CityConversionIntro
           city="Calgary"
           phone="(403) 768-1341"
           phoneLink="tel:4037681341"
           heroImage={calgaryHeroRoom}
           heroAlt="Bright, freshly cleaned Calgary living room with sunlight across the floor"
           heroPosition="center 58%"
           processImages={[
             { src: gallerySpotlessKitchen, alt: "Spotless Calgary kitchen after a professional cleaning" },
             { src: galleryHappyPlace, alt: "Duty Cleaners cleaning result in a welcoming Calgary home" },
             { src: galleryKitchenBA, alt: "Fresh Calgary kitchen after a detailed cleaning" },
           ]}
          />


        <LocalMarketNote
          accent="calgary"
          eyebrow="Cleaning in Calgary"
          heading="What a Calgary house actually needs, and when"
          paragraphs={[
            "Calgary is hard on floors and easy on nothing. Because the chinooks keep pushing the city above freezing and back down again, the roads are gritted, melted and gritted again rather than staying frozen through to spring — so sand and de-icer arrive at the door repeatedly from November to April instead of once. It works along baseboards, into carpet edges, down the sides of stair treads and under furniture, and by February it is past the point a vacuum reaches. That is the single most common reason a Calgary home books a deep clean rather than a standard one.",
            "The city's quadrant split is a genuine planning difference, not just an address convention, and it shows up in the work. Inner-city Beltline, Mission, Kensington and Inglewood are mostly condos and older infill: small in square footage, heavy on window tracks, balcony seals and the fine dust a dry, windy city drives into every gap. The newer edges — Mahogany, Seton and Cranston in the deep south, Livingston and Cornerstone in the north — are larger, faster homes still shedding construction dust from vents and closet shelves for a year or two after possession.",
            "We serve the city and the ring of towns around it, including Airdrie, Cochrane, Okotoks and Chestermere, with no trip fee inside Calgary itself. Prices are the same here as in Edmonton — there is no city premium — and every figure quoted is before the 5% GST. If you are not sure whether your home needs a standard or a deep clean, describe it on the phone and we will tell you which is the cheaper honest answer.",
          ]}
        />

        {/* Recent activity — social proof right before the conversion point */}
        <RecentActivityStrip city="Calgary" reviews={googleReviews} />


        <StatBand />

        <CityPricingTable />

        <CostGuides />

        <CityIncludedChapter city="Calgary" />


        <DutyCleanPromise />

       <JudgmentFree image={judgmentRoom} alt="Calgary living room reset after a clean — lived-in, not staged" />

        <CityServicesChapter
          city="Calgary"
          basePath="/calgary"
          featureImage={gallerySpotlessKitchen}
          featureImageAlt="Spotless Calgary kitchen after a standard Duty Cleaners visit"
          deepImage={galleryCalgaryOvenBA}
          deepImageAlt="Oven before and after a Calgary deep clean"
        />

        {/* Real Calgary Homes — asymmetric split: sticky heading column left,
            bento mosaic right. */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>Our Work</Eyebrow>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Real Calgary Homes</h2>
                <p className="text-muted-foreground mt-3">
                  See the homes we’ve cleaned and the results we deliver for homeowners across the city.
                </p>
              </div>

            {/* Photo Gallery - Polished Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-4">

              {[
                { src: gallerySpotlessKitchen, alt: "Spotless Calgary kitchen with stainless appliances after a Duty Cleaners visit", label: "Spotless Kitchen", tag: "Result", className: "col-span-2 row-span-2" },
                { src: galleryOvenBA, alt: "Before and after oven deep cleaning by Duty Cleaners Calgary", label: "Oven Deep Clean", tag: "Before / After", className: "col-span-2 row-span-2" },
                { src: galleryBathroomDeep, alt: "Sparkling Calgary bathroom after a deep clean", label: "Bathroom Deep Clean", tag: "Result", className: "col-span-2 md:col-span-1 row-span-1" },
                { src: galleryKitchenBA, alt: "Before and after kitchen transformation in a Calgary home", label: "Kitchen Transformation", tag: "Before / After", className: "col-span-2 md:col-span-2 row-span-1" },
                { src: galleryToiletBA, alt: "Before and after bathroom toilet sanitization in a Calgary home", label: "Toilet Sanitization", tag: "Before / After", className: "col-span-2 md:col-span-1 row-span-1" },
                
              ].map((photo, index) => (
                <figure key={index} className={`group relative rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-xl transition-all duration-300 ${photo.className}`}>
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 z-10 text-sm font-semibold uppercase tracking-wider bg-white/90 text-primary px-2.5 py-1 rounded-full shadow-sm">
                    {photo.tag}
                  </span>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <figcaption className="text-white text-sm font-semibold">{photo.label}</figcaption>
                  </div>
                </figure>
              ))}
            </div>
            </div>
          </div>
        </section>


        <BeforeAfterGallery city="Calgary" />

        <CityRecentCleans city="Calgary" reviews={googleReviews} />

        {/* FAQ — full-bleed tinted band + two-column split. */}
        <section className="py-16 md:py-20 bg-quote-shelf border-y border-quote-shelf-border">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>FAQ</Eyebrow>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Frequently Asked Questions</h2>

                <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
                  <p className="text-lg font-semibold">Still have a question? Talk to a real human.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Mon&ndash;Sat 8 AM&ndash;8 PM &middot; Sun 9 AM&ndash;3 PM</p>
                  <a href="tel:4037681341" className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-gold-ink transition-colors hover:text-brand-navy">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Call (403) 768-1341
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
        <section className="border-y border-border bg-blue-grey-100 py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-14">
              <div>
                <Eyebrow>Coverage</Eyebrow>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Calgary Service Areas</h2>
                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-relaxed">
                  We proudly serve Calgary and surrounding communities within a 30km radius.
                </p>
                <p className="text-muted-foreground mt-3 max-w-[55ch] leading-relaxed">
                  Chinook dust in the entryway, sun through the front windows — we clean the way homes
                  are actually lived in here.
                </p>
                <ThresholdLine className="mt-6 max-w-[220px]" />
              </div>
              <HomeRhythmStrip
                slots={[
                  {
                    src: galleryHappyPlace,
                    alt: "Morning light across a tidied Calgary living room",
                    caption: "Morning light — the front rooms",
                  },
                  {
                    src: galleryCalgaryMoveOut,
                    alt: "Cleaned Calgary entryway floor after a winter week",
                    caption: "Chinook season — the entryway",
                  },
                  {
                    src: galleryCalgaryWindow,
                    alt: "Cleaned window and sill detail in a Calgary home",
                    caption: "Spring — window and sill detail",
                  },
                ]}
              />
            </div>


            <NeighborhoodMarquee city="Calgary" />
            <CityCoverageGrid city="Calgary" neighbourhoods={calgaryNeighborhoods} surrounding={calgarySurrounding} />

            <div className="mt-10 max-w-5xl mx-auto">
              <Suspense fallback={<div className="w-full h-[400px] rounded-xl bg-muted animate-pulse" />}>
                <CalgaryServiceAreaMap />
              </Suspense>
            </div>

          </div>
        </section>

        {/* Quote Section */}
        <section id="quote" className="scroll-mt-24 border-t border-border bg-secondary/30 py-12 lg:py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 text-center">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Your next step</span>
                <h2 className="display-serif mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl">Get your instant price.</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  Answer a few questions to see your cleaning quote and choose the service that fits your home.
                </p>
              </div>


              <div id="quote-form" className="mx-auto grid w-full max-w-4xl scroll-mt-20 items-stretch overflow-hidden border border-border shadow-xl shadow-brand-navy/10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,20rem)]">
                <div className="bg-card p-2 sm:p-4">
                  <ServiceStartCard phone="(403) 768-1341" phoneLink="tel:4037681341" />
                </div>
                <DirectContactPanel phone="(403) 768-1341" phoneLink="tel:4037681341" />
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
            city="Edmonton"
            to="/"
            description="House cleaning rated 4.9 on Google for Edmonton and surrounding communities, with the same vetted pros and transparent pricing."
          />
        </div>

        <GetInTouch city="Calgary" />

        </main>

        {/* Floating CTA */}
        {showFloatingButton && !quoteInView && <aside aria-label="Quick booking actions" className="fixed bottom-4 left-1/2 z-50 hidden -translate-x-1/2 gap-3 md:flex lg:hidden">
            <Button className="flex-1 min-h-[48px] bg-accent px-6 text-base font-bold text-accent-foreground shadow-xl hover:bg-accent/90 sm:flex-none" asChild>
              <a href="#quote">{quoteCtaLabel(quoteProgress)}</a>
            </Button>
            <Button variant="outline" className="min-h-[48px] border-border bg-card px-6 text-base font-semibold shadow-xl" asChild>
              <a href="tel:4037681341">
                <Phone className="w-4 h-4 mr-2" />
                Call
              </a>
            </Button>
          </aside>}

        <Footer hasQuoteSection />
      </div>
    </>;
}
