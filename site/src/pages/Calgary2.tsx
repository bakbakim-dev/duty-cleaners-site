import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import LocalMarketNote from "@/components/LocalMarketNote";
import { useEffect, useState } from "react";
import { CALGARY_REVIEWS } from "@/data/reviews";
import { schemaAddressFor, BRANCH_PROFILES, BRANCH_IDENTITY } from "@/data/proof";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
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
import calgaryHeroRoom640 from "@/assets/hero-room-calgary-640w.webp";
import calgaryHeroRoom960 from "@/assets/hero-room-calgary-960w.webp";
import calgaryHeroRoom1280 from "@/assets/hero-room-calgary-1280w.webp";
import calgaryHeroRoom1920 from "@/assets/hero-room-calgary-1920w.webp";


import galleryOvenBA from "@/assets/gallery/calgary-oven-ba.webp";
import galleryKitchenBA from "@/assets/gallery/calgary-kitchen-ba.webp";
import galleryCalgaryOvenBA from "@/assets/gallery/calgary-oven-ba.webp";
import galleryHappyPlace from "@/assets/gallery/calgary-happy-place.webp";
import galleryCalgaryMoveOut from "@/assets/gallery/calgary-move-out-clean.webp";
import galleryCalgaryWindow from "@/assets/gallery/calgary-window-cleaning.webp";
import gallerySpotlessKitchen from "@/assets/gallery/calgary-spotless-kitchen.webp";
import galleryBathroomDeep from "@/assets/gallery/calgary-bathroom-deep.webp";
import galleryToiletBA from "@/assets/gallery/calgary-toilet-ba.webp";
import {
  sitePriceRange,
  standardTierRows,
  deepCleanTierRows,
  moveInOutTierRows,
  formatPrice,
  FREQUENCIES,
  HOURLY_RATE,
} from "@/data/pricing";
import DeferUntilVisible from "@/components/DeferUntilVisible";

/*
  Every figure in the prose below is read from bk-config or policy.ts; the
  published-prices guard bans a typed dollar sign under src/pages. Prices are
  the same as Edmonton's by design, so the words, not the numbers, are what
  keep this page from being a copy of the homepage.
*/
const STANDARD = standardTierRows();
const FROM_STANDARD = STANDARD[0]?.price ?? "";
const FROM_STANDARD_3BED = STANDARD.find((row) => row.beds === "3 Bedroom")?.price ?? "";
const FROM_DEEP = deepCleanTierRows()[0]?.price ?? "";
const FROM_MOVE = moveInOutTierRows()[0]?.price ?? "";
const AIRBNB_RATE = formatPrice(HOURLY_RATE);
const RECURRING_DISCOUNTS = FREQUENCIES.filter((f) => f.discount > 0)
  .sort((a, b) => b.discount - a.discount)
  .map((f) => `${Math.round(f.discount * 100)}% ${f.label.toLowerCase()}`)
  .join(", ");
/** Outside city limits only; post-construction has its own row in bk-config. */
const homeTravel = travelFee("standard");
const postTravel = travelFee("post-construction");
const HOME_TRAVEL_FEE = homeTravel === null ? "a travel fee quoted when you book" : `a ${formatPrice(homeTravel)} travel fee`;
const POST_TRAVEL_FEE = postTravel === null ? "a fee quoted when you book" : formatPrice(postTravel);
const CALGARY_REVIEW_COUNT = CITY_PROOF.calgary.googleReviewCount;
/** The ring towns that are not linked by name in the coverage paragraph. */
const OUTER_TOWNS = calgarySurrounding
  .filter((town) => !["Airdrie", "Cochrane", "Okotoks", "Chestermere"].includes(town.name))
  .map((town) => town.name);

const PAGE_TITLE = `House Cleaning Calgary from ${FROM_STANDARD} | Pay After the Clean`;
const PAGE_DESCRIPTION = "House cleaning services in Calgary. Pay after your clean, customer-rated cleaners, flexible scheduling. Get an instant quote in 60 seconds.";

/* Width-descriptor set for the hero, the LCP element on this page. Without
   it a phone pulled the same 1920px file as a desktop: hero-room-calgary at 1920w against
   the 640w variant a phone actually needs. sizes is 100vw because the hero
   is full-bleed. */
const HERO_SRCSET = [
  `${calgaryHeroRoom640} 640w`,
  `${calgaryHeroRoom960} 960w`,
  `${calgaryHeroRoom1280} 1280w`,
  `${calgaryHeroRoom1920} 1920w`,
].join(", ");

/* The schema priceRange, derived. It was hand-typed as "$155-$539+" here and
   "$155-$539" on the twin — numerically right today, inconsistent with each
   other, and exactly the pattern EdmontonMoveInOut.tsx:126 already calls out:
   a figure that stays put while the real prices move. Floor is the cheapest
   standard clean, ceiling the dearest move-out, both straight from bk-config. */

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
    telephone: CITY_PROOF.calgary.phoneE164,
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
    priceRange: sitePriceRange(),
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
  // Written for Calgary, not copied from the homepage and re-labelled: the
  // money-page contract measures how much of this page repeats the Edmonton
  // hub, and FAQ answers ship inside FAQPage JSON-LD, so they count twice.
  const faqs = [{
    question: "Which parts of Calgary do you cover?",
    answer: `All four quadrants and the centre, with no trip fee inside city limits. The towns around the city are covered too: Airdrie, Cochrane, Okotoks, Chestermere, ${OUTER_TOWNS.join(", ")}. Past the limits, home cleans carry ${HOME_TRAVEL_FEE}.`
  }, {
    question: "What does a house clean cost in Calgary?",
    answer: `The same as in Edmonton. One bedroom and one bathroom: ${FROM_STANDARD}. Three bedrooms: ${FROM_STANDARD_3BED}. Deep cleans begin at ${FROM_DEEP} and move-outs at ${FROM_MOVE}, and all of it is before 5% GST. The form shows your exact figure before you pick a date.`
  }, {
    question: "Does a chinook winter change how you clean?",
    answer: "It changes what people book, not how we work. The grit that each thaw-and-refreeze brings in is why Calgary homes book a deep clean in late winter and standard visits the rest of the year. The teams work year-round; in winter we add buffer time for the roads."
  }, {
    question: "Do you clean condos in the Beltline and downtown towers?",
    answer: "Yes. The Calgary team cleans in the Beltline, Downtown, Eau Claire and along 17th Avenue, and is used to condo rules: signing in at the desk, visitor parking passes, and whatever the building needs for access. Put the building's requirements on the booking and the cleaner arrives knowing them."
  }, {
    question: "Can I get a same-day clean in Calgary?",
    answer: "Occasionally. It depends on what the day's schedule has open. Phone the Calgary line and we will say straight away rather than leave you waiting on a callback."
  }, {
    question: "Do I have to be there while you clean?",
    answer: "No. A key, a lockbox code or a smart-lock code is how most Calgary customers handle it, and the team locks the door behind them. The water has to be on, and the vacuum needs an outlet."
  }, {
    question: "Whose products and equipment are used?",
    answer: `Ours; the team brings everything. Eco-friendly products cost ${POLICY.ecoProductsFee} extra (${POLICY.ecoProductsHowToRequest}), and anything you would rather we did not use in the house goes on the booking note.`
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
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-calgary/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-calgary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
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
           heroSrcSet={HERO_SRCSET}
           heroAlt="Bright, freshly cleaned Calgary living room with sunlight across the floor"
           heroPosition="center 58%"
           processImages={[
             { src: gallerySpotlessKitchen, alt: "Calgary kitchen after a professional cleaning" },
             { src: galleryHappyPlace, alt: "Duty Cleaners cleaning result in a welcoming Calgary home" },
             { src: galleryKitchenBA, alt: "Fresh Calgary kitchen after a detailed cleaning" },
           ]}
          />


        <LocalMarketNote
          accent="calgary"
          eyebrow="Cleaning in Calgary"
          heading="What a Calgary house needs, and when"
          paragraphs={[
            "Calgary is hard on floors and easy on nothing. Because the chinooks keep pushing the city above freezing and back down again, the roads are gritted, melted and gritted again rather than staying frozen through to spring — so sand and de-icer arrive at the door repeatedly from November to April instead of once. It works along baseboards, into carpet edges, down the sides of stair treads and under furniture, and by February it is past the point a vacuum reaches. That is the single most common reason a Calgary home books a deep clean rather than a standard one.",
            "The city's quadrant split is a planning difference, and it shows up in the work. Inner-city Beltline, Mission, Kensington and Inglewood are mostly condos and older infill: small in square footage, heavy on window tracks, balcony seals and the fine dust a dry, windy city drives into every gap. The newer edges — Mahogany, Seton and Cranston in the deep south, Livingston and Cornerstone in the north — are larger, faster homes still shedding construction dust from vents and closet shelves for a year or two after possession.",
            "We serve the city and the ring of towns around it, including Airdrie, Cochrane, Okotoks and Chestermere, with no trip fee inside Calgary itself. Prices are the same here as in Edmonton — there is no city premium — and every figure quoted is before the 5% GST. If you are not sure whether your home needs a standard or a deep clean, describe it on the phone and we will tell you which is the cheaper honest answer.",
          ]}
        />

        {/* Recent activity — social proof right before the conversion point */}
        <RecentActivityStrip city="Calgary" reviews={googleReviews} />


        <StatBand city="Calgary" />

        <CityPricingTable />

        <CostGuides city="Calgary" />

        <CityIncludedChapter city="Calgary" />


        <DutyCleanPromise city="Calgary" />

       <JudgmentFree city="Calgary" image={judgmentRoom} alt="Calgary living room reset after a clean, lived-in rather than staged" />

        <CityServicesChapter
          city="Calgary"
          basePath="/calgary"
          featureImage={gallerySpotlessKitchen}
          featureImageAlt="Calgary kitchen after a standard Duty Cleaners visit"
          deepImage={galleryCalgaryOvenBA}
          deepImageAlt="Oven before and after a Calgary deep clean"
        />

        {/* The services in prose, with the from-prices, in Calgary's own
            words. The cards above name the services; this says what each one
            is and who in Calgary books it. */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>By the job</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Cleaning services in Calgary, by the job</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  Four cleans cover nearly every Calgary booking. The standard clean is the upkeep visit, from{" "}
                  {FROM_STANDARD} for a one-bedroom condo and {FROM_STANDARD_3BED} for a three-bedroom house; it is priced
                  flat by size, so the number does not move if the team is slow. What the visit covers is on the{" "}
                  <Link to="/calgary/regular-cleaning/" className="font-semibold text-primary hover:underline">Calgary standard cleaning page</Link>.
                </p>
                <p>
                  Add the deep-clean package and it becomes a deep clean, from {FROM_DEEP}: baseboards, tile film, the
                  strip along the floor edge where chinook grit settles. Most Calgary homes want one in late winter and
                  standard visits the rest of the year. The room-by-room list is under{" "}
                  <Link to="/calgary/deep-cleaning/" className="font-semibold text-primary hover:underline">Calgary deep cleaning</Link>.
                </p>
                <p>
                  Move-out cleans start at {FROM_MOVE} and are timed to the walkthrough. Post-construction cleans are
                  priced on floor area, for the dust a renovation leaves in every vent. Short-term rental hosts book{" "}
                  <Link to="/airbnb-cleaning-services-calgary/" className="font-semibold text-primary hover:underline">turnover cleaning for Calgary Airbnbs</Link>{" "}
                  by the hour, at {AIRBNB_RATE} per cleaner. Every service, with its starting price, is on{" "}
                  <Link to="/calgary/services/" className="font-semibold text-primary hover:underline">the Calgary services page</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>On repeat</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Maid service in Calgary, on a schedule or once</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  Ask for a maid service in Calgary and what you get is a standard clean on repeat: one cleaner who knows
                  the house, the same checklist each time, every week, every two weeks or every four weeks. That is{" "}
                  <Link to="/calgary/recurring-cleaning/" className="font-semibold text-primary hover:underline">recurring cleaning in Calgary</Link>,
                  and the discount starts on visit two: {RECURRING_DISCOUNTS}.
                </p>
                <p>
                  It works without a contract. The first clean is billed at the one-time rate, which is the same price as
                  booking a{" "}
                  <Link to="/calgary/regular-cleaning/" className="font-semibold text-primary hover:underline">single standard clean in Calgary</Link>,
                  so nothing is lost by trying one visit and deciding later.
                </p>
                <p>
                  For a house in Mahogany or Seton, a visit every two weeks keeps construction dust and boot-tray grit
                  from building up between deep cleans; in a Beltline or Mission condo, every four weeks is often enough
                  because there is less floor. Either way you need not be in: a lockbox code or a smart lock works, and
                  the team locks up. If the clean is for somebody else,{" "}
                  <Link to="/gift-card/" className="font-semibold text-primary hover:underline">a gift card</Link> covers any
                  service and never expires.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Real Calgary Homes — asymmetric split: sticky heading column left,
            bento mosaic right. */}
        <section className="py-16 md:py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.75fr)_minmax(0,2fr)] lg:gap-14">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <Eyebrow>Our Work</Eyebrow>
                {/* Was "Real Calgary Homes" over the AI-generated set, directly above a
                    block saying the real before/afters are not shot yet. */}
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">What a finished clean looks like</h2>
              </div>

            {/* Photo Gallery - Polished Bento Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-4">

              {[
                { src: gallerySpotlessKitchen, alt: "A kitchen at the end of a clean: countertops cleared and wiped, sink and taps polished, appliance fronts free of marks", label: "Kitchen", tag: "Kitchen", className: "col-span-2 row-span-2" },
                { src: galleryOvenBA, alt: "An oven interior after the inside-oven add-on: racks, door glass and floor of the cavity degreased", label: "Inside the oven", tag: "Add-on", className: "col-span-2 row-span-2" },
                { src: galleryBathroomDeep, alt: "A bathroom after a deep clean, with soap scum off the glass and mineral build-up off the fixtures", label: "Bathroom", tag: "Deep clean", className: "col-span-2 md:col-span-1 row-span-1" },
                { src: galleryKitchenBA, alt: "A range and the wall behind it after degreasing, with no film left on the surround", label: "Range and surround", tag: "Deep clean", className: "col-span-2 md:col-span-2 row-span-1" },
                { src: galleryToiletBA, alt: "A toilet scrubbed inside and out, including the base and the hinges where build-up collects", label: "Bathroom", tag: "Bathroom", className: "col-span-2 md:col-span-1 row-span-1" },
                
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

        {/* Who turns up. Same facts as the homepage, from policy.ts and
            proof.ts, said in Calgary's words with Calgary's review count. */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>Who turns up</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Calgary house cleaners you rate after every visit</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  A cleaner's references are checked before their first Calgary job. Then the customer rates each
                  visit, and that rating is what keeps a cleaner on our list. Low ratings mean we stop sending that
                  cleaner; there is no other measure that overrides the customer.
                </p>
                <p>
                  That is also why the guarantee is workable. Report a miss within {POLICY.guaranteeWindowHours} hours
                  and a team returns to redo it, with no charge and no argument. Photos help the team find what was
                  missed, but the return visit does not depend on them.
                </p>
                <p>
                  Calgary customers have left {CALGARY_REVIEW_COUNT} Google reviews at {RATING_CLAIM}. The{" "}
                  <Link to="/reviews/" className="font-semibold text-primary hover:underline">reviews page</Link> reprints
                  them as posted, and the listing itself is a click away if you would rather check the source.
                </p>
              </div>
            </div>
          </div>
        </section>

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
                    <button type="button" onClick={() => toggleFAQ(index)} aria-expanded={openFAQ === index} className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-secondary/30 transition-colors">
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
                  Chinook dust in the entryway, sun through the front windows. We clean the way homes are lived in
                  here, and there is no trip fee anywhere inside Calgary city limits.
                </p>
                {/* The towns outside the limits, linked in a sentence with the
                    travel fee stated once. Okotoks and Chestermere live under
                    /locations/; Airdrie and Cochrane keep their legacy URLs. */}
                <p className="text-muted-foreground mt-3 max-w-[55ch] leading-relaxed">
                  Beyond the limits the same teams do{" "}
                  <Link to="/cleaning-services-airdrie/" className="font-semibold text-primary hover:underline">house cleaning in Airdrie</Link>, work as{" "}
                  <Link to="/cleaning-services-cochrane/" className="font-semibold text-primary hover:underline">Cochrane house cleaners</Link>, and cover{" "}
                  <Link to="/locations/okotoks/" className="font-semibold text-primary hover:underline">cleaning services in Okotoks</Link> and{" "}
                  <Link to="/locations/chestermere/" className="font-semibold text-primary hover:underline">Chestermere house cleaning</Link>, with{" "}
                  {HOME_TRAVEL_FEE} on a home clean and {POST_TRAVEL_FEE} on a post-construction job. The ring towns
                  farther out are listed below.
                </p>
                <p className="text-muted-foreground mt-3 max-w-[55ch] leading-relaxed">
                  <Link to="/calgary/pricing/" className="font-semibold text-primary hover:underline">Calgary house cleaning prices by home size</Link>{" "}
                  are on one page, and they match Edmonton's to the dollar.
                </p>
                <ThresholdLine className="mt-6 max-w-[220px]" />
              </div>
              <HomeRhythmStrip
                slots={[
                  {
                    src: galleryHappyPlace,
                    width: 1080,
                    height: 1920,
                    alt: "Morning light across a tidied Calgary living room",
                    caption: "Morning light — the front rooms",
                  },
                  {
                    src: galleryCalgaryMoveOut,
                    width: 800,
                    height: 800,
                    alt: "Cleaned Calgary entryway floor after a winter week",
                    caption: "Chinook season — the entryway",
                  },
                  {
                    src: galleryCalgaryWindow,
                    width: 800,
                    height: 800,
                    alt: "Cleaned window and sill detail in a Calgary home",
                    caption: "Spring — window and sill detail",
                  },
                ]}
              />
            </div>


            <NeighborhoodMarquee city="Calgary" />
            <CityCoverageGrid
              city="Calgary"
              neighbourhoods={calgaryNeighborhoods}
              surrounding={calgarySurrounding}
              intro="Every quadrant, the inner city, and the towns on the ring road and beyond it."
            />

            <div className="mt-10 max-w-5xl mx-auto">
              {/* The map is ~20,000px down the page. lazy() defers rendering
                  but not loading, so without this gate every visitor pulled
                  149KB of Leaflet and hit three tile origins on page load. */}
              <DeferUntilVisible placeholder={<div className="w-full h-[400px] rounded-xl bg-muted animate-pulse" />}>
                <Suspense fallback={<div className="w-full h-[400px] rounded-xl bg-muted animate-pulse" />}>
                  <CalgaryServiceAreaMap />
                </Suspense>
              </DeferUntilVisible>
            </div>

          </div>
        </section>

        {/* Quote Section */}
        <section id="quote" className="scroll-mt-24 border-t border-border bg-secondary/30 py-12 lg:py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl">
              <div className="mb-8 text-center">
                <span className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">Your next step</span>
                <h2 className="display-serif mt-3 text-3xl font-bold leading-tight text-foreground md:text-4xl">See the instant price for your Calgary home.</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
                  A few questions, then the figure. Choose the service after you have seen the number, not before.
                </p>
              </div>


              <div id="quote-form" className="mx-auto grid w-full max-w-4xl scroll-mt-20 items-stretch overflow-hidden border border-border shadow-xl shadow-brand-navy/10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,20rem)]">
                <div className="bg-card p-2 sm:p-4">
                  <ServiceStartCard phone="(403) 768-1341" phoneLink="tel:4037681341" />
                </div>
                <DirectContactPanel city="Calgary" phone="(403) 768-1341" phoneLink="tel:4037681341" />
              </div>



              {/* What happens next */}
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: BadgeCheck, title: "The price is confirmed", text: "The full quote is on screen before any date is booked." },
                  { icon: Users, title: "A cleaner is assigned", text: "Reference-checked, and rated by the last Calgary customer they cleaned for." },
                  { icon: CalendarCheck, title: "They arrive in the window", text: "With supplies and equipment; you do not stock anything." },
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
            description={`Edmonton house cleaning at the same prices, rated ${RATING_CLAIM}, with the same reference-checked cleaners and the same guarantee.`}
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
