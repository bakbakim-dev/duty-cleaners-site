import { CITY_PROOF, COMPANY, RATING_CLAIM } from "@/data/proof";
import LocalMarketNote from "@/components/LocalMarketNote";
import { BRANCH_PROFILES, BRANCH_IDENTITY } from "@/data/proof";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
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

/* The oven, stove and toilet crops went with the six-photo mosaic: generated
   images captioned as finished cleans, sitting directly above a line promising
   no stand-ins. The three still imported here are the ones the hero strip and
   the services chapter use. */
import galleryPostKitchen from "@/assets/gallery/dc-post-kitchen.webp";
import galleryStoveDetail from "@/assets/gallery/dc-stove-detail.webp";
import galleryModernKitchen from "@/assets/gallery/dc-modern-kitchen.webp";
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
  Every figure in the prose below is read from bk-config or policy.ts. The
  published-prices guard bans a typed dollar sign anywhere under src/pages, and
  the reason is on this very page: the schema priceRange used to be hand-typed
  here and on the Calgary twin, and the two had already drifted apart.
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
/** Outside the two city limits only; bk-config carries a separate row for post-construction. */
const homeTravel = travelFee("standard");
const postTravel = travelFee("post-construction");
const HOME_TRAVEL_FEE = homeTravel === null ? "a travel fee quoted when you book" : `a ${formatPrice(homeTravel)} travel fee`;
const POST_TRAVEL_FEE = postTravel === null ? "a fee quoted when you book" : formatPrice(postTravel);

/*
  "Cleaning services edmonton" is the largest query family this site has any
  claim on — 80,890 impressions — and the title carrying it was /services/,
  a page with a fraction of this one's authority. The hub takes the phrase and
  keeps the reason to click; /services/ is being retitled off it separately.
*/
const PAGE_TITLE = `House Cleaning Services Edmonton from ${FROM_STANDARD} | Pay After`;
const PAGE_DESCRIPTION = `House cleaning services in Edmonton from ${FROM_STANDARD}, and nothing is charged until the clean is done. See your price in about 60 seconds. Rated ${RATING_CLAIM}.`;

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
    // Read from city-locations.ts rather than hand-listed. The Calgary twin's
    // hand-list had already fallen two towns behind its own FAQ; a second copy
    // of a list that lives in the data is a copy that drifts.
    areaServed: ["Edmonton", ...edmontonSurrounding.map((town) => town.name)].map((name) => ({
      "@type": "City",
      name,
    })),
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
  const faqs = [{
    question: "Do you serve all areas of Edmonton?",
    answer: `Yes. We clean in all quadrants (NW, NE, SW, SE, Central) with no trip fee inside city limits, and in the surrounding communities, including St. Albert, Sherwood Park, Spruce Grove, Leduc, Fort Saskatchewan, Beaumont, Stony Plain, Morinville and Devon, where ${HOME_TRAVEL_FEE} is added to a home clean.`
  }, {
    question: "How much does house cleaning cost in Edmonton?",
    answer: `A standard clean starts at ${FROM_STANDARD} for a one-bedroom, one-bathroom home and ${FROM_STANDARD_3BED} for three bedrooms. A deep clean starts at ${FROM_DEEP} and a move-out clean at ${FROM_MOVE}. Every figure is before 5% GST, and the booking form shows the exact price for your home before you choose a date.`
  }, {
    question: "How do Edmonton winters affect your cleaning service?",
    // Was "we schedule buffer time for traffic and weather delays", which told
    // a customer nothing they could act on. The season changes what to book
    // and when, and that is on this page already.
    answer: "It changes what to book more than how we clean. The winter here holds instead of thawing, so the sand and de-icer stay outside until the melt and then come through the door in one load through March and early April. That makes spring the deep-clean month in Edmonton, when entryways, stair treads and the first two metres of hallway have taken the whole season at once; book a standard clean over the winter itself and a deep clean once the melt is through."
  }, {
    question: "Do you clean high-rise condos in downtown Edmonton?",
    answer: "Yes. Our Edmonton team cleans high-rise condos in Oliver, Downtown and along Jasper Avenue, and knows the building protocols, parking passes and access requirements that come with them."
  }, {
    question: "Do you offer same-day cleaning service in Edmonton?",
    answer: "Sometimes. Same-day and next-day slots depend on the schedule; call and we will tell you what is open."
  }, {
    question: "Do I need to be home during the clean?",
    answer: "No. Most Edmonton customers leave a key, a lockbox code or smart-lock access, and the team locks up when they finish. Running water is required, and vacuuming needs electricity."
  }, {
    question: "What cleaning products do you use?",
    answer: `Our teams arrive with all supplies and equipment included. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}. If there is a product you want kept out of the house, note it on your booking and we will work to it.`
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
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
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
             { src: galleryPostKitchen, alt: "Edmonton kitchen after a professional cleaning" },
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
          heading="What an Edmonton house needs, and when"
          paragraphs={[
            "Edmonton's winter holds. Where Calgary thaws and refreezes all season, the roads here stay frozen, so the sand and de-icer that go down in November largely stay outside until the melt — and then arrive at the door in one heavy load through March and early April. That timing is the useful part: entryways, stair treads and the first two metres of hallway take the whole winter's worth at once, which is why spring is when Edmonton homes book a deep clean rather than a standard one, and why a February visit is mostly maintenance.",
            "The housing stock splits the work in two. The mature core — Glenora, Westmount, Old Strathcona, Garneau — is largely pre-war and early post-war: original trim, deeper window sills, more door frames, and rooms divided rather than open, all of which take longer per square metre than the floor area suggests. The newer edges in the southwest and southeast, Windermere, Terwillegar, Summerside and Glastonbury, are larger and faster to clean per square metre, but a home in its first year or two is still shedding construction dust from vents and closet shelves. The same bedroom count can be two quite different jobs, so describe the home rather than only its size.",
            "We clean across Edmonton and the surrounding communities: St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville and Devon, with no trip fee inside the city itself. Prices are identical to Calgary's; there is no city premium, and every figure is before 5% GST. If you are not sure whether your home needs a standard clean or a deep one, the booking form asks when it was last properly cleaned and recommends from your answer.",
          ]}
        />

        {/* Social proof first — momentum before persuasion */}
        <RecentActivityStrip city="Edmonton" reviews={googleReviews} />

        <StatBand city="Edmonton" />

        <CityPricingTable />

        <CostGuides city="Edmonton" />

        <CityIncludedChapter city="Edmonton" />

        <DutyCleanPromise city="Edmonton" />

       <JudgmentFree city="Edmonton" image={judgmentRoom} alt="Tidied Edmonton living room after a routine clean, lived-in rather than staged" />

        <CityServicesChapter
          city="Edmonton"
          basePath="/edmonton"
          featureImage={galleryLivingRoom}
          featureImageAlt="Bright Edmonton living room after a standard Duty Cleaners visit"
          deepImage={galleryStoveDetail}
          deepImageAlt="Detailed stovetop after a deep clean in an Edmonton home"
        />

        {/* The services in prose. This used to describe all six of them a
            second time, with the same from-prices the card grid above already
            carries — three paragraphs that told a reader who had just scrolled
            past the cards nothing new. What is left is the part the cards do
            not do: the routes, and the prices that are not in the table. */}
        <section className="band band-paper band-hairline">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>By the job</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Cleaning services in Edmonton, by the job</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  The upkeep visit is the{" "}
                  <Link to="/edmonton/regular-cleaning/" className="font-semibold text-primary hover:underline">standard clean</Link>,
                  priced flat by bedrooms and bathrooms; add the deep-clean package and it becomes a{" "}
                  <Link to="/edmonton/deep-cleaning/" className="font-semibold text-primary hover:underline">deep clean in Edmonton</Link>{" "}
                  from {FROM_DEEP}, which is what the spring melt is for.
                </p>
                <p>
                  A <Link to="/move-out-cleaning-edmonton/" className="font-semibold text-primary hover:underline">move-out clean</Link>{" "}
                  from {FROM_MOVE} empties the home of everything a walkthrough would find, and post-construction is
                  priced on floor area, because drywall dust does not care how many bedrooms there are. Short-term
                  rental hosts book{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="font-semibold text-primary hover:underline">Airbnb cleaning in Edmonton</Link>{" "}
                  by the hour at {AIRBNB_RATE} per cleaner, and{" "}
                  <Link to="/services/" className="font-semibold text-primary hover:underline">all Edmonton cleaning services and prices</Link>{" "}
                  sit on one page.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="band band-white band-hairline">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>On a schedule</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Maid service in Edmonton, on a schedule or once</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {/* This linked the recurring page, which is the schedule. The
                    page whose title carries "Maid Service" is the standard
                    clean, so the phrase now points where it goes and the
                    schedule keeps its own link, for the discount. */}
                <p>
                  People searching for a maid service in Edmonton are usually describing a standard clean on a regular
                  day: the same checklist, your regular team where we can send them, every week, every two weeks or
                  every four. The page for that visit is{" "}
                  <Link to="/edmonton/regular-cleaning/" className="font-semibold text-primary hover:underline">maid service in Edmonton</Link>.
                  Put it on a schedule and the discount starts at the second visit:{" "}
                  <Link to="/edmonton/recurring-cleaning/" className="font-semibold text-primary hover:underline">recurring cleaning</Link>{" "}
                  takes off {RECURRING_DISCOUNTS}.
                </p>
                <p>
                  There is no contract. The first visit is charged at the one-time rate, so a single{" "}
                  <Link to="/edmonton/regular-cleaning/" className="font-semibold text-primary hover:underline">standard clean</Link>{" "}
                  is the same booking as the first of a series; decide afterwards whether you want another.
                </p>
                <p>
                  A schedule suits people who are out. Leave a key, a lockbox code or smart-lock access and the team
                  locks up on the way out. Somebody may be asleep at two in the afternoon; tell us which room and the
                  order the house gets done in changes at no cost. If the clean is for someone else, you can{" "}
                  <Link to="/gift-card/" className="font-semibold text-primary hover:underline">give a clean as a gift</Link>; the
                  card never expires.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*
          "Cleaning company edmonton" (21,509 impressions) was in this page's
          body twice and in no heading on either hub. What the company is, in
          the words people search with, and nothing that is not in proof.ts.
        */}
        <section className="band band-paper band-hairline">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>Who we are</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">The cleaning company behind the Edmonton team</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  Duty Cleaners is a cleaning company with its own Edmonton office, at {CITY_PROOF.edmonton.streetAddress},
                  and has worked in this city {COMPANY.sinceLabel}. Residential cleaning is what this page prices:
                  houses, condos, suites, and the communities past the city limits. The cleaners are ours to send and
                  reference-checked before a first job, and home cleaning is quoted from the same list the booking form
                  charges from, so there is nothing to work out on the doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*
          Apartments and condos: 3,404 page-one impressions in Edmonton and no
          heading anywhere on the site. Access is the only thing that differs,
          so the section says what differs and what does not.
        */}
        <section className="band band-white band-hairline">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>Apartments and condos</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Apartment and condo cleaning in Edmonton</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  Getting in is the part that differs. High-rises in Oliver,{" "}
                  <Link to="/locations/downtown-edmonton/" className="font-semibold text-primary hover:underline">downtown Edmonton</Link>{" "}
                  and along Jasper Avenue each want something different: a fob or a key left for the lobby, a visitor
                  stall or a spot in the parkade, a sign-in at the desk, and in some buildings the service elevator
                  booked for a slot. Put what your building needs on the booking, with the arrival window you have
                  picked, and the cleaner turns up already knowing it.
                </p>
                <p>
                  Nothing else moves. The price comes off the same table as a house: bedrooms, bathrooms, and whatever
                  you add to the visit. The checklist is the one on this page and the guarantee is the same. A
                  one-bedroom condo is a short visit and a three-bedroom apartment is not, which is the whole of why the
                  number changes.
                </p>
              </div>
            </div>
          </div>
        </section>


        <BeforeAfterGallery city="Edmonton" />

        {/* Reviews */}
        <CityRecentCleans city="Edmonton" reviews={googleReviews} />

        {/* Who turns up, and what keeps them on the list. The facts are the
            ones policy.ts confirms; nothing about licensing or insurance. */}
        <section className="band band-white band-hairline">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>Who turns up</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Edmonton house cleaners you rate after every visit</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  Before a cleaner takes a first Edmonton job with us, we check their references. After every visit, the
                  customer rates the clean. Those ratings are not decoration: they decide who we keep sending, and a
                  cleaner who stops earning them stops getting work from us.
                </p>
                {/* The window was stated twice above this paragraph, in the
                    trust plate and again in the promise block. Said once
                    apiece is enough; this one keeps the part the others do not
                    make: photos help, and are not a condition. */}
                <p>
                  That rule is what makes the guarantee workable. A team that expects to be rated tends to finish the
                  list, and when something is missed anyway the return visit costs nothing. Photos help the team find
                  what was missed, but they are not a condition of coming back.
                </p>
                <p>
                  The <Link to="/reviews/" className="font-semibold text-primary hover:underline">reviews page</Link> reprints
                  what Edmonton customers wrote on Google, unedited, and the {RATING_CLAIM} figure at the top of this page
                  comes from that listing. Read a few before you book.
                </p>
              </div>
            </div>
          </div>
        </section>

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
        <section className="band band-paper band-hairline">
          <div className="container mx-auto px-4">
            <div className="mb-12 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-14">
              <div>
                <Eyebrow>Coverage</Eyebrow>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Edmonton Service Areas</h2>
                <p className="text-muted-foreground mt-4 prose-column leading-relaxed">
                  Inside Edmonton city limits there is no trip fee. Boot trays in March, windows in June: we clean the
                  way homes are lived in here.
                </p>
                {/* Communities outside city limits, each linked in a sentence
                    rather than a chip, with the travel fee stated once. */}
                <p className="text-muted-foreground mt-3 prose-column leading-relaxed">
                  The communities outside city limits are covered by the same teams, with {HOME_TRAVEL_FEE} added to a
                  home clean: <Link to="/cleaning-services-st-albert/" className="font-semibold text-primary hover:underline">house cleaning in St. Albert</Link>,{" "}
                  <Link to="/cleaning-services-sherwood-park/" className="font-semibold text-primary hover:underline">Sherwood Park house cleaners</Link>,{" "}
                  <Link to="/cleaning-services-spruce-grove/" className="font-semibold text-primary hover:underline">cleaning services in Spruce Grove</Link>,{" "}
                  a <Link to="/cleaning-services-leduc/" className="font-semibold text-primary hover:underline">Leduc cleaning company</Link> you can price online,{" "}
                  <Link to="/cleaning-services-beaumont/" className="font-semibold text-primary hover:underline">house cleaning in Beaumont</Link>,{" "}
                  <Link to="/cleaning-services-fort-saskatchewan/" className="font-semibold text-primary hover:underline">Fort Saskatchewan house cleaning</Link>,{" "}
                  <Link to="/cleaning-services-stony-plain/" className="font-semibold text-primary hover:underline">cleaners in Stony Plain</Link>,{" "}
                  <Link to="/cleaning-services-morinville/" className="font-semibold text-primary hover:underline">Morinville house cleaners</Link> and{" "}
                  <Link to="/cleaning-services-devon/" className="font-semibold text-primary hover:underline">house cleaning in Devon</Link>.
                  Post-construction jobs outside the city carry {POST_TRAVEL_FEE} instead.
                </p>
                <p className="text-muted-foreground mt-3 prose-column leading-relaxed">
                  <Link to="/pricing/" className="font-semibold text-primary hover:underline">The full Edmonton price list</Link>{" "}
                  applies everywhere we go; the travel fee is the only thing that changes outside the city.
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
            <CityCoverageGrid
              city="Edmonton"
              neighbourhoods={edmontonNeighborhoods}
              surrounding={edmontonSurrounding}
              intro="Reference-checked cleaners across the city and the communities around it."
            />

            <div className="mt-10 max-w-5xl mx-auto">
              {/* The map is ~20,000px down the page. lazy() defers rendering
                  but not loading, so without this gate every visitor pulled
                  149KB of Leaflet and hit three tile origins on page load. */}
              <DeferUntilVisible placeholder={<div className="w-full h-[400px] rounded-xl bg-muted animate-pulse" />}>
                <Suspense fallback={<div className="w-full h-[400px] rounded-xl bg-muted animate-pulse" />}>
                  <EdmontonServiceAreaMap />
                </Suspense>
              </DeferUntilVisible>
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
                <DirectContactPanel city="Edmonton" phone="(780) 913-6565" phoneLink="tel:7809136565" />
              </div>



              {/* What happens next */}
              <ul className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  { icon: BadgeCheck, title: "We confirm your price", text: "You see the full quote before anything is booked." },
                  { icon: Users, title: "We assign your cleaner", text: "A reference-checked cleaner is assigned to your home." },
                  { icon: CalendarCheck, title: "We arrive on time", text: "Your cleaner arrives as scheduled, with supplies and equipment." },
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
            description={`House cleaning rated ${RATING_CLAIM} for Calgary and surrounding communities, at the same prices and with the same reference-checked cleaners.`}
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