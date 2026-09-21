import { BUSINESS_TRADE_TYPE } from "@/data/proof";
import { CITY_PROOF, COMPANY, CALGARY_RATING_CLAIM, hoursRowsFor } from "@/data/proof";
import LocalMarketNote from "@/components/LocalMarketNote";
import {
  BRANCH_PROFILES,
  BRANCH_IDENTITY,
  schemaAddressFor,
  openingHoursShortFor,
  openingHoursSpecFor,
} from "@/data/proof";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
import { useEffect, useRef, useState } from "react";
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
import NeighborhoodMarquee from "@/components/NeighborhoodMarquee";
import CostGuides from "@/components/CostGuides";
import judgmentRoom from "@/assets/whats-included-hero.webp?hero";
import DirectContactPanel from "@/components/DirectContactPanel";
import { Button } from "@/components/ui/button";
import { Calculator, CheckCircle2, Home, HardHat, Star, Shield, Award, TrendingUp, Bed, Bath, Sofa, ChefHat, ChevronUp, LucideIcon, Zap, ThumbsUp, Leaf, DollarSign, Truck, Calendar, MessageSquare, Play, Heart, KeyRound, BadgeCheck, CalendarCheck, Users } from "lucide-react";
import { Link } from "react-router-dom";
import CityCrossLink from "@/components/CityCrossLink";
import GetInTouch from "@/components/GetInTouch";
import { quoteCtaLabel, useQuoteProgress } from "@/lib/quote-progress";
import { Suspense, lazy } from "react";
const EdmontonServiceAreaMap = lazy(() => import("@/components/EdmontonServiceAreaMap"));
import edmontonHeroRoom from "@/assets/generated/edmonton-cleaning-hero-v1.webp?hero";

import galleryLivingRoomCard from "@/assets/gallery/living-room-clean.webp?card";
import galleryMoveOutClean from "@/assets/gallery/move-out-clean.webp?card";
import galleryWindowDetail from "@/assets/gallery/window-cleaning.webp?card";
import teamCheryse from "@/assets/team/edmonton-cheryse.webp";
import teamRuchan from "@/assets/team/edmonton-ruchan.webp";
import teamScottilee from "@/assets/team/edmonton-scottilee.webp";
import teamDijana from "@/assets/team/edmonton-dijana.webp";
import teamClarice from "@/assets/team/clarice-cleaner.webp";

/* The oven, stove and toilet crops went with the six-photo mosaic: generated
   images captioned as finished cleans, sitting directly above a line promising
   no stand-ins. The two kitchen thumbnails went with the "How it works"
   thumbnails (three photos for four steps); what is left is what the services
   chapter and the coverage strip use. */
import galleryStoveDetail from "@/assets/gallery/dc-stove-detail.webp?card";
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
const PAGE_DESCRIPTION = "Explore house cleaning in Edmonton. Compare services, check what's included and see pricing for your home before you book with Duty Cleaners.";

/* Width-descriptor set for the hero, the LCP element on this page. Without
   it a phone pulled the full file instead of the 640w variant it needs.
   the 640w variant a phone actually needs. sizes is 100vw because the hero
   is full-bleed. */
const HERO_SRCSET = edmontonHeroRoom.sources.webp;

/* The schema priceRange, derived. It was hand-typed as "$155-$539+" here and
   "$155-$539" on the twin — numerically right today, inconsistent with each
   other, and exactly the pattern EdmontonMoveInOut.tsx:126 already calls out:
   a figure that stays put while the real prices move. Floor is the cheapest
   standard clean, ceiling the dearest move-out, both straight from bk-config. */

export default function Edmonton2() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  // True while the quote section is on screen — the floating CTA is hidden
  // then, so it never covers the form fields visitors are filling out.
  const [quoteInView, setQuoteInView] = useState(false);
  const quoteProgress = useQuoteProgress();

  // The floating bar shows once the first 800px of the page have scrolled away.
  // An 800px sentinel at the top of the page and an IntersectionObserver say
  // the same thing a scroll listener did, without running on every scroll.
  const topSentinel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    const sentinel = topSentinel.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => setShowFloatingButton(!entry.isIntersecting));
    observer.observe(sentinel);
    return () => observer.disconnect();
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
    additionalType: BUSINESS_TRADE_TYPE,
    "@id": "https://dutycleaners.ca/#edmonton",
    name: BRANCH_IDENTITY.edmonton.name,
    url: BRANCH_IDENTITY.edmonton.url,
    parentOrganization: { "@id": "https://dutycleaners.ca/#org" },
    image: "https://dutycleaners.ca/og-image.jpg",
    logo: "https://dutycleaners.ca/logo.png",
    telephone: CITY_PROOF.edmonton.phoneE164,
    email: "support@dutycleaners.ca",
    // One authority for the address (data/proof.ts), as the Calgary twin
    // already did. The street and postal code were retyped here: right on the
    // day they were typed, and a second copy of the office address is a copy
    // that drifts the day the branch moves.
    address: schemaAddressFor("edmonton"),
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
    // Read from data/proof.ts, not retyped. Both runs were literals here, and
    // a second copy of the hours is a copy that drifts the day the office
    // changes them — the same reason the priceRange above is derived.
    openingHours: openingHoursShortFor("edmonton"),
    openingHoursSpecification: openingHoursSpecFor("edmonton")
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

      <div className="relative min-h-screen bg-background">
        <div ref={topSentinel} aria-hidden="true" className="pointer-events-none absolute left-0 top-0 h-[800px] w-px" />
        <Navigation city="edmonton" />
        <main id="main-content" tabIndex={-1}>

         <CityConversionIntro
           city="Edmonton"
           phone="(780) 913-6565"
           phoneLink="tel:7809136565"
           heroImage={edmontonHeroRoom.img.src}
           heroSrcSet={HERO_SRCSET}
           heroWidth={edmontonHeroRoom.img.w}
           heroHeight={edmontonHeroRoom.img.h}
           heroAlt="Professional cleaner wiping a kitchen island in a bright Edmonton home"
           heroPosition="center 48%"
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
            "If winter grit or spring mud is being tracked into your Edmonton home, tell us which entryways and floors need attention. A standard clean covers routine floor care; baseboards are part of the deep-clean package. Carpet steam cleaning is not included.",
            "The same bedroom count can be two quite different jobs, so describe the home rather than only its size.",
            "We clean across Edmonton and the surrounding communities: St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville and Devon, with no trip fee inside the city itself. Prices are identical to Calgary's; there is no city premium, and every figure is before 5% GST. If you are not sure whether your home needs a standard clean or a deep one, the quote asks you to rate its current cleanliness from 1 to 5 and explains when the deep-clean package may fit.",
          ]}
        />

        {/* One static proof row: rating, the bookings figure, the reviews link.
            The four-figure StatBand that followed it is gone: three of its
            four figures repeated the trust plate and the hero card. */}
        <RecentActivityStrip city="Edmonton" reviews={googleReviews} />

        <CityPricingTable />

        <CostGuides city="Edmonton" />

        <CityIncludedChapter city="Edmonton" />

        {/* The page's one navy band. The Judgment-Free photo band used to
            follow it directly, two dark screens touching; it now sits after
            the reviews. */}
        <DutyCleanPromise city="Edmonton" />

        <CityServicesChapter
          city="Edmonton"
          basePath="/edmonton"
          featureImage={galleryLivingRoomCard}
          featureImageAlt="Living room with a golden dog on a shaggy rug and a vacuum cleaner in front of it"
          deepImage={galleryStoveDetail}
          deepImageAlt="Glass-top stove with the oven door open, under a microwave"
        />

        {/* The services in prose. This used to describe all six of them a
            second time, with the same from-prices the card grid above already
            carries — three paragraphs that told a reader who had just scrolled
            past the cards nothing new. What is left is the part the cards do
            not do: the routes, and the prices that are not in the table. */}

        {/* One band, three columns on desktop. These were three full-height
            text-only bands in a row; each keeps its H2, its wording and its
            links, because the headings answer measured query families. */}
        <section className="band band-white band-hairline">
          <div className="container mx-auto px-4">
            <div className="mx-auto grid max-w-6xl gap-x-12 gap-y-12 lg:grid-cols-3">
            <div>
              <h2 className="display-serif text-2xl md:text-[1.75rem] font-bold leading-snug">Maid service in Edmonton, on a schedule or once</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                {/* This linked the recurring page, which is the schedule. The
                    page whose title carries "Maid Service" is the standard
                    clean, so the phrase now points where it goes and the
                    schedule keeps its own link, for the discount. */}
                <p>
                  Book the standard checklist once or repeat it weekly, bi-weekly or every four weeks.
                  Compare the scope for{" "}
                  <Link to="/edmonton/regular-cleaning/" className="font-semibold text-primary hover:underline">maid service in Edmonton</Link>.
                  Put it on a schedule and it becomes{" "}
                  <Link to="/edmonton/recurring-cleaning/" className="font-semibold text-primary hover:underline">recurring cleaning in Edmonton</Link>.
                </p>
                <p>
                  Every four weeks means 13 visits a year, not 12 calendar-month visits.
                </p>
                <p>
                  You need not be home: provide approved entry instructions and tell us about rooms to avoid.
                  Laundry and dishes are not included. For someone else, you can{" "}
                  <Link to="/gift-card/" className="font-semibold text-primary hover:underline">give a clean as a gift</Link>.
                </p>
              </div>
            </div>

            {/*
              "Cleaning company edmonton" (21,509 impressions) was in this page's
              body twice and in no heading on either hub. What the company is, in
              the words people search with, and nothing that is not in proof.ts.
            */}
            <div>
              <h2 className="display-serif text-2xl md:text-[1.75rem] font-bold leading-snug">The cleaning company behind the Edmonton team</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  Our Edmonton office is at {CITY_PROOF.edmonton.streetAddress}.
                  Duty Cleaners has cleaned Alberta homes {COMPANY.sinceLabel}. Cleaners are reference-checked before
                  their first job and customer-rated after each visit. <Link to="/about-us/" className="font-semibold text-primary hover:underline">Learn how Duty Cleaners works</Link>.
                </p>
                <p>
                  Call the Edmonton office on{" "}
                  <a href="tel:7809136565" className="font-semibold text-primary hover:underline">(780) 913-6565</a>{" "}
                  Monday to Saturday from 8:00 AM to 8:00 PM, or Sunday from 9:00 AM to 3:00 PM. A booking gets an
                  arrival window, not an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM.
                </p>
              </div>
            </div>

            {/*
              Apartments and condos: 3,404 page-one impressions in Edmonton and no
              heading anywhere on the site. Access is the only thing that differs,
              so the section says what differs and what does not.
            */}
            <div>
              <h2 className="display-serif text-2xl md:text-[1.75rem] font-bold leading-snug">Apartment and condo cleaning in Edmonton</h2>
              <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
                <p>
                  Include lobby access, visitor parking and any required elevator booking.
                  If the team cannot enter, the lockout charge is half the scheduled service cost.
                </p>
                <p>
                  Apartments and condos have no home-type surcharge; houses do.
                  The same service checklist and guarantee apply to{" "}
                  <Link to="/locations/downtown-edmonton/" className="font-semibold text-primary hover:underline">house cleaning in downtown Edmonton</Link>{" "}
                  and homes elsewhere in the city.
                </p>
              </div>
            </div>
            </div>
          </div>
        </section>

        <BeforeAfterGallery city="Edmonton" />

        {/* Reviews */}
        <CityRecentCleans city="Edmonton" reviews={googleReviews} />

        {/* Proof, then reassurance, then the questions and the ask. */}
        <JudgmentFree city="Edmonton" image={judgmentRoom} alt="Sunlit living room with white armchairs, a sofa and a vase of flowers" />

        {/* FAQ — objection handling, last before the ask. Full-bleed tinted
            band + two-column split so it doesn't resolve like every other
            centered section. */}
        <section className="band band-white band-hairline">
          <div className="container mx-auto px-4">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
              <div className="lg:sticky lg:top-28 lg:self-start">
                <h2 className="display-serif text-3xl md:text-4xl font-bold">Questions about house cleaning in Edmonton</h2>

                <div className="mt-8 rounded-lg border border-border bg-white p-6 shadow-sm">
                  <p className="text-lg font-semibold">Ask the Edmonton office.</p>
                  {/* One hours format on the page, read from proof.ts like the footer's. */}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {hoursRowsFor("edmonton").map(([days, time]) => (
                      <span key={days} className="block">{days}: {time}</span>
                    ))}
                  </p>
                  <a href="tel:7809136565" className="mt-3 inline-flex min-h-[44px] items-center gap-2 font-semibold text-gold-ink transition-colors hover:text-brand-navy">
                    <span className="dc-icon dc-icon-phone h-4 w-4" aria-hidden="true" />
                    Call (780) 913-6565
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => <div key={index} className="bg-white rounded-lg border border-border overflow-hidden transition-colors hover:border-brand-navy/40">
                    <button type="button" onClick={() => toggleFAQ(index)} aria-expanded={openFAQ === index} className="w-full flex items-center justify-between gap-3 p-5 text-left hover:bg-secondary/30 transition-colors">
                      <span className="font-semibold pr-4">{faq.question}</span>
                      {openFAQ === index ? <ChevronUp className="w-5 h-5 text-primary flex-shrink-0" /> : <span className="dc-icon dc-icon-chevron-down w-5 h-5 text-muted-foreground flex-shrink-0" aria-hidden="true" />}
                    </button>
                    {/* Always in the DOM (hidden when collapsed) so the FAQPage
                        schema's answers match crawlable page content. */}
                    <div className={`px-5 pb-5 text-muted-foreground leading-relaxed max-w-[65ch] ${openFAQ === index ? "" : "hidden"}`}>
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
            {/* Leads with the photo strip at full width. It was one more narrow
                left rail with a heading, directly under the FAQ's. */}
            <h2 className="display-serif text-3xl md:text-4xl font-bold">Edmonton service areas</h2>
            {/* Alt text describes what each picture shows. The old strings
                called a made bed an entryway floor and named Edmonton homes
                the pictures are not. */}
            <HomeRhythmStrip
              className="mt-8"
              slots={[
                {
                  picture: galleryLivingRoomCard,
                  alt: "Golden dog resting on a shaggy rug in a living room, with a vacuum cleaner nearby",
                  caption: "Homes with pets carry a per-visit charge",
                },
                {
                  picture: galleryMoveOutClean,
                  alt: "Made bed with white bedding between two bedside tables and lamps",
                  caption: "Beds are made with your linens",
                },
                {
                  picture: galleryWindowDetail,
                  alt: "Floor-to-ceiling windows looking out over city towers",
                  caption: "Interior windows are an add-on",
                },
              ]}
            />
            <div className="mb-12 mt-10 grid items-start gap-x-12 gap-y-4 lg:grid-cols-2">
              <div>
                <p className="text-muted-foreground prose-column leading-relaxed">
                  Inside Edmonton city limits there is no trip fee, in any of the {edmontonNeighborhoods.length}{" "}
                  neighbourhoods the Edmonton branch covers. For an address that is not on the list, call the Edmonton
                  office and ask.
                </p>
                <ThresholdLine className="mt-6 hidden max-w-[220px] lg:block" />
              </div>
              <div>
                {/* Communities outside city limits, each linked in a sentence
                    rather than a chip, with the travel fee stated once. */}
                <p className="text-muted-foreground prose-column leading-relaxed">
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
              </div>
            </div>

            <NeighborhoodMarquee city="Edmonton" />
            <CityCoverageGrid
              city="Edmonton"
              neighbourhoods={edmontonNeighborhoods}
              surrounding={edmontonSurrounding}
            />

            <div className="mt-10 max-w-5xl mx-auto">
              {/* The map is ~20,000px down the page. lazy() defers rendering
                  but not loading, so without this gate every visitor pulled
                  149KB of Leaflet and hit three tile origins on page load. */}
              <DeferUntilVisible placeholder={<div className="w-full h-[400px] rounded-lg bg-muted animate-pulse" />}>
                <Suspense fallback={<div className="w-full h-[400px] rounded-lg bg-muted animate-pulse" />}>
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
                <h2 className="display-serif text-3xl font-bold leading-tight text-foreground md:text-4xl">Get your instant price.</h2>
                <p className="prose-column mx-auto mt-4 text-lg leading-relaxed text-muted-foreground">
                  Answer a few questions to see your cleaning quote and choose the service that fits your home.
                </p>
              </div>

              <div id="quote-form" className="mx-auto grid w-full max-w-4xl scroll-mt-20 items-stretch overflow-hidden rounded-lg border border-border shadow-xl shadow-brand-navy/10 lg:grid-cols-[minmax(0,1fr)_minmax(280px,20rem)]">
                <div className="bg-card p-2 sm:p-4">
                  <ServiceStartCard phone="(780) 913-6565" phoneLink="tel:7809136565" topBorder="accent" />
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
                  <li key={title} className="rounded-lg border border-border bg-card p-5 text-center">
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
            description={`House cleaning from the Calgary branch at the same prices, rated ${CALGARY_RATING_CLAIM}.`}
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
                <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                Call
              </a>
            </Button>
          </aside>}

        <Footer hasQuoteSection />
      </div>
    </>;
}
