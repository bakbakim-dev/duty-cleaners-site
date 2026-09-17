import { CITY_PROOF, COMPANY, RATING_CLAIM } from "@/data/proof";
import LocalMarketNote from "@/components/LocalMarketNote";
import { useEffect, useState } from "react";
import { CALGARY_REVIEWS } from "@/data/reviews";
import { schemaAddressFor, BRANCH_PROFILES, BRANCH_IDENTITY, openingHoursShortFor, openingHoursSpecFor } from "@/data/proof";
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
import { Calculator, CheckCircle2, Home, HardHat, Star, Shield, Award, TrendingUp, Bed, Bath, Sofa, ChefHat, ChevronUp, LucideIcon, Zap, ThumbsUp, Leaf, DollarSign, Truck, Calendar, MessageSquare, Play, Heart, KeyRound, BadgeCheck, CalendarCheck, Phone, Users } from "lucide-react";
import { Link } from "react-router-dom";
import CityCrossLink from "@/components/CityCrossLink";
import GetInTouch from "@/components/GetInTouch";
import { quoteCtaLabel, useQuoteProgress } from "@/lib/quote-progress";
import { Suspense, lazy } from "react";
const CalgaryServiceAreaMap = lazy(() => import("@/components/CalgaryServiceAreaMap"));
import calgaryHeroRoom from "@/assets/generated/calgary-cleaning-hero-v1.webp";
import calgaryHeroRoom640 from "@/assets/generated/calgary-cleaning-hero-v1-640w.webp";
import calgaryHeroRoom960 from "@/assets/generated/calgary-cleaning-hero-v1-960w.webp";
import calgaryHeroRoom1280 from "@/assets/generated/calgary-cleaning-hero-v1-1280w.webp";

/* The oven, bathroom and toilet crops left with the five-photo bento mosaic:
   generated images labelled as finished Calgary cleans, printed directly above
   a line promising no stock stand-ins. What is left is what the hero strip,
   the services chapter and the seasonal strip use. */
import galleryKitchenBA from "@/assets/gallery/calgary-kitchen-ba.webp";
import galleryCalgaryOvenBA from "@/assets/gallery/calgary-oven-ba.webp";
import galleryHappyPlace from "@/assets/gallery/calgary-happy-place.webp";
import galleryCalgaryMoveOut from "@/assets/gallery/calgary-move-out-clean.webp";
import galleryCalgaryWindow from "@/assets/gallery/calgary-window-cleaning.webp";
import gallerySpotlessKitchen from "@/assets/gallery/calgary-spotless-kitchen.webp";
import {
  sitePriceRange,
  standardTierRows,
  deepCleanTierRows,
  moveInOutTierRows,
  formatPrice,
  FREQUENCIES,
  HOURLY_RATE,
  addOnFromPrice,
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
/** The compulsory per-visit pet charge (FACTS P10), read from bk-config rather than typed. */
const petCharge = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const PET_FEE = petCharge === null ? "a pet charge" : formatPrice(petCharge);
/** "A, B and C", so a list read from city-locations.ts reads as a sentence. */
const joinNames = (names: string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names.join("");
/** Every community outside the city on the Calgary branch's list (FACTS A2). */
const CALGARY_TOWNS = joinNames(calgarySurrounding.map((town) => town.name));
/** The ring towns that are not linked by name in the coverage paragraph. */
const OUTER_TOWNS = calgarySurrounding
  .filter((town) => !["Airdrie", "Cochrane", "Okotoks", "Chestermere"].includes(town.name))
  .map((town) => town.name);

/*
  "Cleaning services calgary" is 63,216 impressions and the title carrying it
  was /calgary/services/, a page this one outranks on every other signal. The
  hub takes the phrase; the services hub is being retitled off it separately.
*/
const PAGE_TITLE = `House Cleaning Services Calgary from ${FROM_STANDARD} | Pay After`;
const PAGE_DESCRIPTION = "Find the right house cleaning service for your Calgary home. Review scope, prices and booking details with Duty Cleaners.";

/* Width-descriptor set for the hero, the LCP element on this page. Without
   it a phone pulled the full file instead of the 640w variant it needs.
   the 640w variant a phone actually needs. sizes is 100vw because the hero
   is full-bleed. */
const HERO_SRCSET = [
  `${calgaryHeroRoom640} 640w`,
  `${calgaryHeroRoom960} 960w`,
  `${calgaryHeroRoom1280} 1280w`,
  `${calgaryHeroRoom} 1672w`,
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
  // postalCode comes from proof.ts through schemaAddressFor, and `geo` is the
  // office pin the owner confirmed on 2026-09-10.
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
    geo: { "@type": "GeoCoordinates", ...CITY_PROOF.calgary.geo },
    hasMap: "https://www.google.com/maps?cid=6193344199307583189",
    sameAs: [...BRANCH_PROFILES.calgary],
    // Hand-listed, this had fallen two towns behind the FAQ on the same page:
    // the answer named ten places we cover and the entity claimed nine. Both
    // now read the same array, so a change in city-locations.ts moves both.
    areaServed: ["Calgary", ...calgarySurrounding.map((town) => town.name)].map((name) => ({
      "@type": "City",
      name,
    })),
    priceRange: sitePriceRange(),
    // Read from data/proof.ts, not retyped. Both runs were literals here, and
    // a second copy of the hours is a copy that drifts the day the office
    // changes them — the same reason the priceRange above is derived.
    openingHours: openingHoursShortFor("calgary"),
    openingHoursSpecification: openingHoursSpecFor("calgary")
  };
  // Written for Calgary, not copied from the homepage and re-labelled: the
  // money-page contract measures how much of this page repeats the Edmonton
  // hub, and FAQ answers ship inside FAQPage JSON-LD, so they count twice.
  // Each answer rests on the content prompt's FACTS block (A2, A3, C2, P1-P3,
  // P9-P11, T3-T5, T7) or on this page's local note.
  const faqs = [{
    question: "Which parts of Calgary do you cover?",
    answer: `Inside Calgary, the branch works in ${calgaryNeighborhoods.length} neighbourhoods and charges no trip fee anywhere within city limits. Past the limits it cleans in ${CALGARY_TOWNS}, where a home clean carries ${HOME_TRAVEL_FEE} and a post-construction job ${POST_TRAVEL_FEE}, both before GST. For an address missing from those lists, phone (403) 768-1341 and ask.`
  }, {
    question: "What does a house clean cost in Calgary?",
    answer: `In an apartment or condo, a standard clean runs ${FROM_STANDARD} for one bedroom and one bathroom, and ${FROM_STANDARD_3BED} for a three-bedroom unit with two and a half baths. Deep cleans begin at ${FROM_DEEP} and move-outs at ${FROM_MOVE} at the one-bedroom size. None of those figures includes the 5% GST, the home-type charge for a two-storey house, townhouse, bungalow or basement suite, the ${PET_FEE} charged per visit in homes with pets, or the travel fee past the city limits. The form totals your own figure before you pick a date.`
  }, {
    question: "Does a chinook winter change how you clean?",
    answer: "It changes what people book, not how we work. Every thaw and refreeze brings sand and de-icer back to the door between November and April, and the grit settles along baseboards and carpet edges. When the roads are unsafe and a booking has to move, the office tells you once it knows and offers its earliest open slot."
  }, {
    question: "Do you clean condos in the Beltline and downtown towers?",
    answer: "Yes. Apartments and condos in the Beltline, Mission, Eau Claire and the downtown towers carry no home-type charge on top of the size table, which is before 5% GST. Put the building's rules on the booking: desk sign-in, visitor parking, and how the team gets through the door. If the team reaches the door and cannot get in, you are billed half of what the scheduled clean would have cost."
  }, {
    question: "Can I get a same-day clean in Calgary?",
    answer: "Same-day and next-day slots depend on the schedule. Phone the Calgary line at (403) 768-1341 and the office can check what the day has open."
  }, {
    question: "Do I have to be there while you clean?",
    answer: "No. A key, a lockbox code or a smart-lock code is how most Calgary customers handle it, and the team locks the door behind them. The water has to be on, and without electricity the vacuuming may not be possible."
  }, {
    question: "Whose products and equipment are used?",
    answer: `The products are ours: the team brings every supply and every piece of equipment. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`
  }, {
    question: "Is there a charge for pets in a Calgary home?",
    answer: `Yes. A home with pets carries ${PET_FEE} per visit, before GST. The charge is compulsory, and it shows on the quote before you book. Litter boxes and animal waste are outside what the team cleans.`
  }, {
    question: "What will the Calgary team not clean?",
    answer: "The team does no outdoor work, which rules out exterior windows, garages and patios (a balcony or garage sweep is an add-on, offered mostly in summer when the weather allows), and it will not lift anything over 25 lb or climb beyond a 3-step ladder. Mould remediation, pests, bodily fluids, carpet steam cleaning, upholstery, ducts, drains, laundry and dishes are also outside the service. Heavy scrubbing of walls and doors belongs to the wall-washing package, and decluttering or organising is a separate hourly add-on."
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
           heroWidth={1672}
           heroHeight={941}
           heroAlt="Professional cleaner vacuuming a living-room rug in a bright Calgary home"
           heroPosition="center 52%"
           processImages={[
             { src: gallerySpotlessKitchen, alt: "Galley kitchen with white cabinets, a stainless fridge and a sink in the island" },
             { src: galleryHappyPlace, alt: "Kitchen with white cabinets, an island and a wooden dining table" },
             { src: galleryKitchenBA, alt: "Two views of a basement kitchen with oak cabinets and tiled counters" },
           ]}
          />

        <LocalMarketNote
          accent="calgary"
          eyebrow="Cleaning in Calgary"
          heading="What a Calgary house needs, and when"
          paragraphs={[
            "If boots are tracking grit or slush into your Calgary home, flag the entryway and floors when you book. Choose the service by the condition of the rooms and the checklist you need, not by the season alone. Carpet steam cleaning is outside our service.",
            "For a Beltline or Mission condo, include concierge, fob and visitor-parking instructions. If renovation work has left construction dust in any neighbourhood, ask about post-construction cleaning instead of assuming it is part of a standard visit.",
            "We serve the city and the ring of towns around it, including Airdrie, Cochrane, Okotoks and Chestermere, with no trip fee inside Calgary itself. Prices are the same here as in Edmonton, with no city premium, and every figure quoted is before the 5% GST. If you are not sure whether your home needs a standard or a deep clean, describe it on the phone and we will tell you which is the cheaper honest answer.",
          ]}
        />

        {/* Recent activity — social proof right before the conversion point */}
        <RecentActivityStrip city="Calgary" reviews={googleReviews} />

        <StatBand city="Calgary" />

        <CityPricingTable />

        <CostGuides city="Calgary" />

        <CityIncludedChapter city="Calgary" />

        <DutyCleanPromise city="Calgary" />

       <JudgmentFree city="Calgary" image={judgmentRoom} alt="Minimal living room with a pale sectional sofa, a rug and a wall-mounted television" />

        <CityServicesChapter
          city="Calgary"
          basePath="/calgary"
          featureImage={gallerySpotlessKitchen}
          featureImageAlt="Kitchen with white shaker cabinets, grey counters and a stainless steel fridge"
          deepImage={galleryCalgaryOvenBA}
          deepImageAlt="Four oven-interior panels labelled before and after, heavily soiled on the left and clean on the right"
        />

        {/* The services in prose, with the from-prices, in Calgary's own
            words. The cards above name the services; this says what each one
            is and who in Calgary books it. */}

        <section className="py-16 md:py-20 bg-secondary/30 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>On repeat</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Maid service in Calgary, on a schedule or once</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                {/* The phrase pointed at the recurring page. The page whose
                    title carries "Maid Service" is the standard clean, so it
                    takes the anchor and the schedule keeps its own link. The
                    "one cleaner who knows the house" line went with it: the
                    recurring page only promises our best effort at the same
                    team, and policy.ts has no continuity term at all. */}
                <p>
                  Book the standard checklist once or repeat it weekly, bi-weekly or every four weeks.
                  Compare the scope for{" "}
                  <Link to="/calgary/regular-cleaning/" className="font-semibold text-primary hover:underline">maid service in Calgary</Link>,
                  and putting it on{" "}
                  <Link to="/calgary/recurring-cleaning/" className="font-semibold text-primary hover:underline">a repeating Calgary schedule</Link>{" "}
                  is what starts the discount at visit two: {RECURRING_DISCOUNTS}.
                </p>
                <p>
                  The first visit uses the one-time rate for a{" "}
                  <Link to="/calgary/regular-cleaning/" className="font-semibold text-primary hover:underline">single standard clean in Calgary</Link>,
                  with recurring discounts starting at visit two.
                </p>
                <p>
                  You need not be home: provide approved entry instructions. Laundry and dishes are excluded.
                  For someone else,{" "}
                  <Link to="/gift-card/" className="font-semibold text-primary hover:underline">a gift card</Link> lets you
                  give it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/*
          "Cleaning company calgary" is 20,110 impressions and had no heading
          on either hub. Address and year from proof.ts; nothing else claimed.
        */}
        <section className="py-16 md:py-20 bg-background border-b border-border">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <Eyebrow>Who we are</Eyebrow>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">The cleaning company on the other end of the Calgary line</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-muted-foreground">
                <p>
                  Our Calgary office is at {CITY_PROOF.calgary.streetAddress}.
                  Duty Cleaners has cleaned Alberta homes {COMPANY.sinceLabel}. Cleaners are reference-checked before
                  their first job and customer-rated after each visit. <Link to="/about-us/" className="font-semibold text-primary hover:underline">Learn how Duty Cleaners works</Link>.
                </p>
                <p>
                  The Calgary line,{" "}
                  <a href="tel:4037681341" className="font-semibold text-primary hover:underline">(403) 768-1341</a>, is
                  open from 8:00 AM until 8:00 PM Monday to Saturday and from 9:00 AM until 3:00 PM on Sundays, and written
                  questions go to support@dutycleaners.ca. Nobody books an exact minute: a Calgary visit gets one of three
                  hour-long arrival windows, starting at 9:00 AM, 12:00 PM or 3:00 PM.
                  For building-access and quote checks, read our <Link to="/blog/cleaning-services-calgary/" className="font-semibold text-primary hover:underline">Calgary cleaner hiring guide</Link>.
                </p>
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">What Calgary customers ask before booking</h2>

                <div className="mt-8 rounded-xl border border-border bg-white p-6 shadow-sm">
                  <p className="text-lg font-semibold">The Calgary office takes calls.</p>
                  <p className="mt-1 text-sm text-muted-foreground">Mon&ndash;Sat 8 AM&ndash;8 PM &middot; Sun 9 AM&ndash;3 PM</p>
                  <a href="tel:4037681341" className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-gold-ink transition-colors hover:text-brand-navy">
                    <span className="dc-icon dc-icon-phone h-4 w-4" aria-hidden="true" />
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
                      {openFAQ === index ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" /> : <span className="dc-icon dc-icon-chevron-down w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
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
        {/* bg-background, not bg-blue-grey-100 (2026-09-11): on the blue-grey the
            muted paragraphs measured 4.38:1 and the primary links 4.44:1, under
            the 4.5:1 WCAG AA asks of normal text. On --background they are
            4.83:1 and 4.90:1, and the links are underlined so colour is not
            the only thing marking them. */}
        <section className="border-y border-border bg-background py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 grid items-start gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-14">
              <div>
                <Eyebrow>Coverage</Eyebrow>
                <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Calgary Service Areas</h2>
                <p className="text-muted-foreground mt-4 max-w-[55ch] leading-relaxed">
                  There is no trip fee anywhere in the {calgaryNeighborhoods.length} Calgary neighbourhoods the branch
                  covers, from condos and infill in Kensington and Mission to newer houses in Cranston.
                </p>
                {/* The towns outside the limits, linked in a sentence with the
                    travel fee stated once. Okotoks and Chestermere live under
                    /locations/; Airdrie and Cochrane keep their legacy URLs. */}
                <p className="text-muted-foreground mt-3 max-w-[55ch] leading-relaxed">
                  Beyond the limits the Calgary branch does{" "}
                  <Link to="/cleaning-services-airdrie/" className="font-semibold text-primary underline underline-offset-2">house cleaning in Airdrie</Link>, works as{" "}
                  <Link to="/cleaning-services-cochrane/" className="font-semibold text-primary underline underline-offset-2">Cochrane house cleaners</Link>, and covers{" "}
                  <Link to="/locations/okotoks/" className="font-semibold text-primary underline underline-offset-2">cleaning services in Okotoks</Link> and{" "}
                  <Link to="/locations/chestermere/" className="font-semibold text-primary underline underline-offset-2">Chestermere house cleaning</Link>, with{" "}
                  {HOME_TRAVEL_FEE} on a home clean and {POST_TRAVEL_FEE} on a post-construction job, both before GST.{" "}
                  {joinNames(OUTER_TOWNS)} are covered on the same terms.
                </p>
                <p className="text-muted-foreground mt-3 max-w-[55ch] leading-relaxed">
                  <Link to="/calgary/pricing/" className="font-semibold text-primary underline underline-offset-2">Calgary house cleaning prices by home size</Link>{" "}
                  are on one page, and the same list applies past the city limits with only the travel fee added.
                </p>
                <ThresholdLine className="mt-6 max-w-[220px]" />
              </div>
              {/* Alt text describes what each picture shows. The old strings
                  called a kitchen a living room and an empty bedroom an
                  entryway, and named Calgary homes the pictures are not. */}
              <HomeRhythmStrip
                slots={[
                  {
                    src: galleryHappyPlace,
                    width: 1080,
                    height: 1920,
                    alt: "Kitchen island and a wooden dining table under pendant lights",
                    caption: "Kitchen and dining table",
                  },
                  {
                    src: galleryCalgaryMoveOut,
                    width: 800,
                    height: 800,
                    alt: "Empty carpeted room with sunlight through the window",
                    caption: "An empty carpeted room",
                  },
                  {
                    src: galleryCalgaryWindow,
                    width: 800,
                    height: 800,
                    alt: "Tall windows framing a view of city towers",
                    caption: "Interior window cleaning is an add-on",
                  },
                ]}
              />
            </div>

            <NeighborhoodMarquee city="Calgary" />
            <CityCoverageGrid
              city="Calgary"
              neighbourhoods={calgaryNeighborhoods}
              surrounding={calgarySurrounding}
              intro={`The Calgary branch covers these ${calgaryNeighborhoods.length} Calgary neighbourhoods and ${calgarySurrounding.length} nearby communities.`}
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
                  The form asks about the home first and shows the figure next, so you can choose the service with the
                  number in front of you.
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
                  { icon: Users, title: "A cleaner is assigned", text: "Every cleaner is reference-checked and rated by the Calgary customers they clean for." },
                  { icon: CalendarCheck, title: "They arrive in the window", text: "The team comes inside the arrival window you chose and brings the supplies and equipment." },
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
            description={`The Edmonton branch, rated ${RATING_CLAIM}, prices homes from the same table and backs each clean with the same re-clean guarantee.`}
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
                <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                Call
              </a>
            </Button>
          </aside>}

        <Footer hasQuoteSection />
      </div>
    </>;
}
