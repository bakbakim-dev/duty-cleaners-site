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
  HOURLY_RATE,
  addOnFromPrice,
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
/** Outside the two city limits only; bk-config carries a separate row for post-construction. */
const homeTravel = travelFee("standard");
const postTravel = travelFee("post-construction");
const HOME_TRAVEL_FEE = homeTravel === null ? "a travel fee quoted when you book" : `a ${formatPrice(homeTravel)} travel fee`;
const POST_TRAVEL_FEE = postTravel === null ? "a fee quoted when you book" : formatPrice(postTravel);
/** The compulsory per-visit pet charge (FACTS P10), read from bk-config rather than typed. */
const petCharge = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const PET_FEE = petCharge === null ? "a pet charge" : formatPrice(petCharge);
/** "A, B and C": the communities are read from city-locations.ts, never hand-listed. */
const joinNames = (names: string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names.join("");
const EDMONTON_TOWNS = joinNames(edmontonSurrounding.map((town) => town.name));
const EDMONTON_REVIEW_COUNT = CITY_PROOF.edmonton.googleReviewCount;

/*
  "Cleaning services edmonton" is the largest query family this site has any
  claim on — 80,890 impressions — and the title carrying it was /services/,
  a page with a fraction of this one's authority. The hub takes the phrase and
  keeps the reason to click; /services/ is being retitled off it separately.
*/
const PAGE_TITLE = `House Cleaning Services Edmonton from ${FROM_STANDARD} | Pay After`;
const PAGE_DESCRIPTION = `House cleaning services in Edmonton from ${FROM_STANDARD} before GST for a one-bedroom condo, rated ${RATING_CLAIM}, and nothing is charged until the clean is done.`;

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
  // markup is against Google policy. `geo` is the office pin the owner
  // confirmed on 2026-09-10 (proof.ts).
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
    geo: { "@type": "GeoCoordinates", ...CITY_PROOF.edmonton.geo },
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
  // Every answer rests on the content prompt's FACTS block (A1, A3, C1, P1-P4,
  // P9-P11, T1, T3-T5) or on this page's local note, and stands on its own:
  // each one ships inside the FAQPage markup, where nothing else is visible.
  const faqs = [{
    question: "Which parts of Edmonton and the towns around it do you clean in?",
    answer: `The Edmonton branch covers ${edmontonNeighborhoods.length} Edmonton neighbourhoods, with no trip fee anywhere inside city limits, and ${edmontonSurrounding.length} communities outside them: ${EDMONTON_TOWNS}. A home clean in one of those communities carries ${HOME_TRAVEL_FEE}, before GST. If your address is not in one of those neighbourhoods or communities, call the Edmonton office at (780) 913-6565 and ask.`
  }, {
    question: "How much does house cleaning cost in Edmonton?",
    answer: `A standard clean of a one-bedroom, one-bathroom apartment or condo is ${FROM_STANDARD}, and three bedrooms, two bathrooms and a half bath is ${FROM_STANDARD_3BED}. A deep clean starts at ${FROM_DEEP} and a move-out clean at ${FROM_MOVE} for the one-bedroom size. Every figure is before 5% GST and prices an apartment or condo: a bungalow, basement suite, townhouse or two-storey house adds a home-type charge, homes with pets add ${PET_FEE} per visit, and an address outside city limits adds the travel fee. The instant price adds those up for your home before you choose a date.`
  }, {
    question: "How do Edmonton winters change what a clean needs?",
    // Was "we schedule buffer time for traffic and weather delays", which told
    // a customer nothing they could act on. Now FACTS C1 and the local note.
    answer: "Edmonton holds its cold rather than cycling through thaws, so the sand and salt tracked in from November arrive dry and stay, working into carpet edges and along baseboards. Furnace season runs from October into April, and a house sealed up that long cycles dust faster. The spring melt in late March and April then brings a winter of grit indoors in about three weeks."
  }, {
    question: "Do you clean condos and apartments in downtown Edmonton?",
    answer: "Yes. Downtown is one of the Edmonton neighbourhoods the branch covers, and a condo or apartment is priced straight from the size table, by bedrooms and bathrooms, with no home-type charge and before 5% GST. Put the fob, front-desk and visitor-parking details on the booking. If the team arrives and cannot get in, the lockout charge is half the cost of the scheduled service."
  }, {
    question: "Do you offer same-day cleaning service in Edmonton?",
    answer: "Same-day and next-day slots depend on the schedule. Call the Edmonton office at (780) 913-6565 and ask what the schedule has open."
  }, {
    question: "Do I need to be home during the clean?",
    answer: "No. Most Edmonton customers leave a key, a lockbox code or smart-lock access, and the team locks up when they finish. Running water is required, and vacuuming may not be possible without electricity."
  }, {
    question: "Do I need to provide cleaning supplies?",
    answer: `No. The team brings all supplies and equipment, so there is nothing to buy or set out before the visit. Optional alternative products are available for ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.`
  }, {
    question: "What happens if something is missed on an Edmonton clean?",
    answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and a team comes back to re-clean it at no charge. Photos help but are not required. The commitment is the return visit, and it does not come as a refund; a customer who wants something else can call the Edmonton office and talk about it.`
  }, {
    question: "Can I cancel or move an Edmonton booking?",
    answer: `Yes, with ${POLICY.cancellationNoticeHours} hours' notice; inside ${POLICY.cancellationNoticeHours} hours the fee is ${POLICY.cancellationFee}. If we have to move a booking because a cleaner is ill, a vehicle will not start or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have. Nobody pays for a visit we did not do, and cancelling a booking we moved costs nothing.`
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
           heroAlt="Bright kitchen and dining area with a wooden table and a window onto trees"
           heroPosition="center"
           heroScrim="soft"
           processImages={[
             { src: galleryPostKitchen, alt: "Kitchen with white cabinets, grey counters and a stainless steel range" },
             { src: galleryLivingRoom, alt: "A dog lying on a living-room rug beside a vacuum cleaner" },
             { src: galleryModernKitchen, alt: "Kitchen with dark cabinets, a white island and a stainless fridge" },
           ]}
         />


        {/*
          Mirrors Calgary's note. The winter paragraph is FACTS C1 and nothing
          more: the grit tracked in from November stays, and the spring melt
          brings the rest in. The era and per-square-metre claims about the
          mature core and the newer edges had no source and were cut.
        */}
        <LocalMarketNote
          accent="primary"
          eyebrow="Cleaning in Edmonton"
          heading="What an Edmonton house needs, and when"
          paragraphs={[
            "Edmonton's winter holds. The sand and salt tracked in from November arrive dry and stay, working into carpet edges and along baseboards, and the spring melt in late March and April brings a whole winter of grit indoors in about three weeks.",
            "The same bedroom count can be two quite different jobs, so describe the home rather than only its size.",
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

       <JudgmentFree city="Edmonton" image={judgmentRoom} alt="Sunlit living room with white armchairs, a sofa and a vase of flowers" />

        <CityServicesChapter
          city="Edmonton"
          basePath="/edmonton"
          featureImage={galleryLivingRoom}
          featureImageAlt="Living room with a golden dog on a shaggy rug and a vacuum cleaner in front of it"
          deepImage={galleryStoveDetail}
          deepImageAlt="Glass-top stove with the oven door open, under a microwave"
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
                  priced flat by bedrooms and bathrooms, and the price does not change because a clean took longer than
                  expected. Add the deep-clean package and it becomes a{" "}
                  <Link to="/edmonton/deep-cleaning/" className="font-semibold text-primary hover:underline">deep clean in Edmonton</Link>{" "}
                  from {FROM_DEEP}. That figure is before 5% GST for a one-bedroom,
                  one-bathroom apartment or condo, and a house, a pet or an address outside the city adds to it.
                </p>
                <p>
                  A <Link to="/move-out-cleaning-edmonton/" className="font-semibold text-primary hover:underline">move-out clean</Link>{" "}
                  starts at {FROM_MOVE}, before GST at the same one-bedroom size, and the same house, pet and travel
                  charges can apply to it. Book it ahead of the move-out inspection the landlord completes with the
                  tenant under Alberta's Residential Tenancies Act. We do not promise the deposit comes back; the
                  landlord decides.
                </p>
                <p>
                  <Link to="/post-construction-cleaning/" className="font-semibold text-primary hover:underline">Post-construction cleaning in Edmonton</Link>{" "}
                  is priced on floor area, because drywall dust does not care how many bedrooms there are.{" "}
                  <Link to="/wall-washing-wall-cleaning/" className="font-semibold text-primary hover:underline">Wall washing in Edmonton</Link>{" "}
                  is only booked together with a clean. Short-term rental hosts book{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="font-semibold text-primary hover:underline">Airbnb cleaning in Edmonton</Link>{" "}
                  by the hour, at {AIRBNB_RATE} per cleaner-hour before GST, with a minimum of 3 hours for one cleaner or
                  2 hours for two, and{" "}
                  <Link to="/services/" className="font-semibold text-primary hover:underline">all Edmonton cleaning services and prices</Link>{" "}
                  sit on one page.
                </p>
                {/* Owner, 2026-09-11: one line routes office work to its own
                    page, kept apart from the home-cleaning prices. */}
                <p>
                  For an office or business premises, see our{" "}
                  <Link to="/commercial-cleaning/" className="font-semibold text-primary hover:underline">office and commercial cleaning in Edmonton</Link>.
                  Commercial work is quoted separately from home cleaning.
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
                  A maid service is a standard clean on a regular day: the same checklist, your regular team where we
                  can send them, every week, every two weeks or every four. The page for that visit is{" "}
                  <Link to="/edmonton/regular-cleaning/" className="font-semibold text-primary hover:underline">maid service in Edmonton</Link>.
                  Put it on a schedule and it becomes{" "}
                  <Link to="/edmonton/recurring-cleaning/" className="font-semibold text-primary hover:underline">recurring cleaning in Edmonton</Link>.
                </p>
                <p>
                  The first visit is charged at the one-time rate, so a single standard clean is the same booking as the
                  first of a series; decide afterwards whether you want another. Every four weeks is what many people
                  mean by monthly, though it comes to 13 visits a year where monthly would be 12.
                </p>
                <p>
                  A schedule suits people who are out. Leave a key, a lockbox code or smart-lock access and the team
                  locks up on the way out. Somebody may be asleep at two in the afternoon; tell us which room, because
                  the order a house gets done in is easy to change. If the clean is for someone else, you can{" "}
                  <Link to="/gift-card/" className="font-semibold text-primary hover:underline">give a clean as a gift</Link>.
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
                  and has cleaned Alberta homes {COMPANY.sinceLabel}. The work is residential: houses, condos, basement
                  suites and homes in the communities past the city limits. Each cleaner's references are checked before
                  they take a first job with us, and home cleaning is quoted from the same list the booking form charges
                  from, so there is nothing to work out on the doorstep.
                </p>
                <p>
                  Call the Edmonton office on{" "}
                  <a href="tel:7809136565" className="font-semibold text-primary hover:underline">(780) 913-6565</a>{" "}
                  Monday to Saturday from 8:00 AM to 8:00 PM, or Sunday from 9:00 AM to 3:00 PM. A booking gets an
                  arrival window, not an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM.
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
                  Getting in is the part that differs. A building may want a fob or a key left for the lobby, a visitor
                  stall or a spot in the parkade, a sign-in at the desk, and in some cases the service elevator booked
                  for a slot. Put what your building needs on the booking, with the arrival window you picked, because a
                  team that cannot get in means a lockout charge of half the cost of the scheduled service.
                </p>
                <p>
                  The price is simpler than the access. The size table is written for an apartment or condo, so a condo
                  carries no home-type charge, where a bungalow, townhouse or two-storey house does. The checklist and
                  the guarantee are the same for a condo as for a house, and that holds for{" "}
                  <Link to="/locations/downtown-edmonton/" className="font-semibold text-primary hover:underline">house cleaning in downtown Edmonton</Link>{" "}
                  as much as anywhere else in the city. A one-bedroom condo is a short visit and a three-bedroom
                  apartment is not, which is the whole of why the number changes.
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
                <p>
                  The Edmonton listing is rated {RATING_CLAIM} across {EDMONTON_REVIEW_COUNT} reviews, and the{" "}
                  <Link to="/reviews/" className="font-semibold text-primary hover:underline">Duty Cleaners reviews page</Link>{" "}
                  reprints what Edmonton customers wrote there, unedited. Read a few before you book.
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Questions about house cleaning in Edmonton</h2>

                <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
                  <p className="text-lg font-semibold">Ask the Edmonton office.</p>
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
                  Inside Edmonton city limits there is no trip fee, in any of the {edmontonNeighborhoods.length}{" "}
                  neighbourhoods the Edmonton branch covers. For an address that is not on the list, call the Edmonton
                  office and ask.
                </p>
                {/* Communities outside city limits, each linked in a sentence
                    rather than a chip, with the travel fee stated once. */}
                <p className="text-muted-foreground mt-3 prose-column leading-relaxed">
                  The communities outside city limits are covered by the Edmonton branch, with {HOME_TRAVEL_FEE} (before
                  GST) added to a home clean: <Link to="/cleaning-services-st-albert/" className="font-semibold text-primary hover:underline">house cleaning in St. Albert</Link>,{" "}
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
              {/* Alt text describes what each picture shows. The old strings
                  called a made bed an entryway floor and named Edmonton homes
                  the pictures are not. */}
              <HomeRhythmStrip
                slots={[
                  {
                    src: galleryLivingRoom,
                    width: 1024,
                    height: 1024,
                    alt: "Golden dog resting on a shaggy rug in a living room, with a vacuum cleaner nearby",
                    caption: "Homes with pets carry a per-visit charge",
                  },
                  {
                    src: galleryMoveOutClean,
                    width: 1024,
                    height: 1024,
                    alt: "Made bed with white bedding between two bedside tables and lamps",
                    caption: "The bedroom",
                  },
                  {
                    src: galleryWindowDetail,
                    width: 800,
                    height: 800,
                    alt: "Floor-to-ceiling windows looking out over city towers",
                    caption: "Interior windows are an add-on",
                  },
                ]}
              />
            </div>


            <NeighborhoodMarquee city="Edmonton" />
            <CityCoverageGrid
              city="Edmonton"
              neighbourhoods={edmontonNeighborhoods}
              surrounding={edmontonSurrounding}
              intro="The Edmonton branch sends reference-checked cleaners across the city and the communities around it."
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
                  { icon: CalendarCheck, title: "We arrive in your window", text: "Your team arrives inside the arrival window you picked, with supplies and equipment." },
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
            description={`House cleaning from the Calgary branch at the same prices, rated ${RATING_CLAIM}, with every cleaner reference-checked and rated after each visit.`}
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