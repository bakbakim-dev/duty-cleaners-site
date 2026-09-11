import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, Building2, PaintRoller
} from "lucide-react";
import airdrieImg from "@/assets/gallery/airdrie-landmark.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { sitePriceRange, standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS } from "@/data/pricing";
import { travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

// Every figure on this page is derived from bk-config or policy.ts.
const STANDARD = standardTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TOP = STANDARD[STANDARD.length - 1].price;
const DEEP = deepCleanTierRows();
const DEEP_FROM = DEEP[0].price;
const DEEP_TOP = DEEP[DEEP.length - 1].price;
const MOVE = moveInOutTierRows();
const MOVE_FROM = MOVE[0].price;
const MOVE_TOP = MOVE[MOVE.length - 1].price;
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
// Post-construction carries its own travel-fee row in bk-config, at a higher amount.
const PC_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
// Charged for you rather than chosen, and charged inside the city too.
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const HOME_TYPE = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
const CALGARY_LISTING = GOOGLE_LISTINGS.calgary;
const CALGARY_RATING = `${CITY_PROOF.calgary.googleRating} on Google`;

const PAGE_TITLE = `House Cleaning Airdrie from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `Airdrie homes get a ${POLICY.guaranteeWindowHours}-hour re-clean guarantee and a flat rate by home size: house cleaning from ${STANDARD_FROM} before GST, plus a ${TRAVEL_FEE} travel fee.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// three-bedroom two-storey house on a standard clean, outside city limits. The
// table rounds each size to the dollar, so no total is built from a table card.
const EXAMPLE_SIZE = PRICING_TIERS[2];
const EXAMPLE_TIER = STANDARD[2];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "standard", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("standard")[0]?.id ?? null));
const EXAMPLE_BASE_TEXT = EXAMPLE_BASE === EXAMPLE_TIER.price ? EXAMPLE_BASE : `${EXAMPLE_BASE} (${EXAMPLE_TIER.price} in the table, which rounds to the dollar)`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(90, [TRAVEL_FEE_KEY]));
const EXAMPLE_WITH_PET = formatPrice(exampleQuote(90, [TRAVEL_FEE_KEY, "must-choose-if-you-have-pets"]));

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const ServiceCard = ({
  icon: Icon,
  title,
  description,
  to,
  linkText,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  /** Absent on the two room-level cards, which have no page of their own. */
  to?: string;
  linkText?: string;
}) => (
  <div className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    {to && linkText && (
      <Link
        to={to}
        className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-primary transition-colors hover:text-accent"
      >
        {linkText}
      </Link>
    )}
  </div>
);

const WhyUsCard = ({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  /** Present on the rating card, which cites the listing the count comes from. */
  link?: { href: string; text: string };
}) => (
  <div className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">
      {description}
      {link && (
        <>
          {" "}
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2 font-medium">
            {link.text}
          </a>
        </>
      )}
    </p>
  </div>
);

const services = [
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/calgary/regular-cleaning/", linkText: "Standard cleaning in Airdrie" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/calgary/deep-cleaning/", linkText: "Deep cleaning in Airdrie" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-calgary/", linkText: "Move-out cleaning in Airdrie" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after renovations and new builds in Airdrie, priced by square footage.", to: "/post-construction-cleaning-calgary/", linkText: "Post-construction cleaning in Airdrie" },
  { icon: PaintRoller, title: "Wall Washing", description: "Spot cleaning or a full wash of the walls, priced by home size and booked together with a clean.", to: "/wall-washing-wall-cleaning-calgary/", linkText: "Wall washing in Airdrie" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: "The standard clean on a weekly, bi-weekly or every-4-weeks schedule, discounted from the second visit.", to: "/calgary/recurring-cleaning/", linkText: "Recurring cleaning in Airdrie" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `An Airdrie clean is rated on the Calgary listing, which carries ${CITY_PROOF.calgary.googleReviewCount} reviews.`, link: { href: CALGARY_LISTING.reviewsUrl, text: "See the Calgary listing" } },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: `Tell us within ${POLICY.guaranteeWindowHours} hours if something was missed and the team comes back to re-clean it, at no charge.` },
];

// The coverage chips that stood here (Coopers Crossing, Luxstone, Bayside,
// Williamstown, Windsong, Midtown, Hillcrest, Cobblestone Creek) are gone:
// none of them is on the Calgary coverage list in data/city-locations.ts, and
// a name on a page must mean the place is on that list.

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Airdrie",
  city: "calgary",
  url: "https://dutycleaners.ca/cleaning-services-airdrie",
  areaServed: "Airdrie, AB",
  priceRange: sitePriceRange(),
});

export default function Airdrie() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "Is there a travel fee for house cleaning in Airdrie?",
      answer: `Yes. Airdrie is outside Calgary city limits, so a home-cleaning booking here carries a ${TRAVEL_FEE} travel fee, and a post-construction booking carries ${PC_TRAVEL_FEE}. The fee is added at booking and sits in the total before you confirm. Two other charges apply in Airdrie exactly as they do inside Calgary: ${PET_FEE} a visit for a home with pets, and a home-type charge on top of the apartment-or-condo table price, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse and ${HOME_TYPE.twoStorey} for a two-storey house. Every figure is before 5% GST.`
    },
    {
      question: "How soon can a cleaning team come to Airdrie?",
      answer: `Same-day and next-day slots depend on the schedule, and the Calgary office on (403) 768-1341 can tell you what is open. A booking gets an arrival window rather than an exact time: ${ARRIVAL_WINDOWS.join(", ")}. You do not need to be home; most customers leave a key, a lockbox code or smart-lock access, and the team locks up.`
    },
    {
      question: "Do you do move-out cleaning in Airdrie?",
      answer: `Yes. A move-in or move-out clean in Airdrie is ${MOVE_FROM} to ${MOVE_TOP} by home size for an apartment or condo, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet charge. On top of the standard checklist it covers the inside of the oven, fridge and microwave, and the inside of every cabinet, drawer and closet. Book it for after the movers have been, so the team can reach all of them.`
    },
    {
      question: "What does a standard clean cost in Airdrie?",
      answer: `${STANDARD_FROM} for a one-bedroom apartment or condo through ${STANDARD_TOP} for five bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee. A house adds a home-type charge, and a home with pets adds the pet charge on every visit. Recurring schedules take 20% off weekly, 15% off bi-weekly and 10% off every 4 weeks. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "Do the cleaners bring supplies to Airdrie?",
      answer: `Yes. The team brings all supplies and equipment, including the vacuum. Running water is required, and vacuuming may not be possible without electricity, so leave both on until the clean is done. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Airdrie home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does it cost to cancel an Airdrie booking?",
      answer: `Cancelling or changing a booking needs ${POLICY.cancellationNoticeHours} hours' notice; inside that, the fee is ${POLICY.cancellationFee}. If the team reaches your Airdrie address and cannot get in, the lockout charge is ${POLICY.lockoutFee}. If Duty Cleaners has to move a booking, the office says so as soon as it knows and offers the earliest slot it has, and cancelling a booking we moved costs nothing.`
    }
  ];
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };


  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-airdrie/" />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-airdrie/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="min-h-screen">
        <Navigation city="calgary" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero */}
        <section className="relative py-24 bg-brand-navy overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Airdrie, Calgary Region</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Professional House Cleaning in Airdrie
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  {`A standard clean of a one-bedroom apartment or condo in Airdrie is ${STANDARD_FROM} before GST, and a home-cleaning booking here adds a ${TRAVEL_FEE} travel fee because Airdrie is outside Calgary city limits. A house or a pet adds a set charge, shown on the quote before you book. Airdrie cleans are rated on the Calgary listing: ${CALGARY_RATING}, from ${CITY_PROOF.calgary.googleReviewCount} reviews.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:4037681341">
                      <Phone className="mr-2 w-5 h-5" />(403) 768-1341
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  {[
                    { icon: CheckCircle2, text: "Pay After Your Clean" },
                    { icon: CalendarCheck, text: "Open 7 Days a Week" },
                    { icon: Award, text: "24-Hour Re-Clean Guarantee" },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <badge.icon className="w-4 h-4 text-accent" />
                      <span className="text-white/90 text-sm">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-[500px]">
                <img width={800} height={600}
                  src={airdrieImg}
                  alt="A river path through a prairie town at dusk"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Find Us</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-6">Airdrie Service Area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <GoogleMapEmbed query="Airdrie, AB" title="Airdrie Service Area Map" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="Supply and scale"
        heading="Cloudy glass, not dirty glass"
        paragraphs={[
          "No treatment plant operates here. The water arrives already treated, bought from the City of Calgary and held in local reservoirs before it reaches a tap — and the published hardness at that supplier's two plants never drops below about 140 milligrams per litre in any quarter. So shower glass, kettle elements and chrome go cloudy rather than grubby. Scale ignores scrubbing. It answers to a mild acid and a few minutes of patience.",
          "A 2012 annexation brought in 12,640 acres from Rocky View County, land banked to carry growth all the way to 2062. That is four decades of city edge with a build site somewhere along it. Downwind of an active phase, what collects in window tracks and on the inside of door glass is gypsum and sawdust — light, dry and abrasive. Lift it off dry. Wiping it across glass is how glass gets scratched.",
        ]}
        accent="calgary"
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Worked quote */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Worked example</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                  What a house cleaning quote in Airdrie adds up to
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    Take a two-storey house in Airdrie with three bedrooms, two bathrooms and a half bath, booked for a one-time standard clean. The rate for that size is {EXAMPLE_BASE_TEXT}, the two-storey charge adds {HOME_TYPE.twoStorey}, and the travel fee adds {TRAVEL_FEE}, so the quote comes to {EXAMPLE_PRICE} before 5% GST. With a dog or a cat in the house, the {PET_FEE} pet charge takes it to {EXAMPLE_WITH_PET}. Every one of those lines is on the quote before you book.
                  </p>
                  <p>
                    Four things move an Airdrie quote: the number of bedrooms and bathrooms, the type of home, pets, and add-ons such as the inside of the oven, the inside of the fridge or interior windows. Time does not. The price is flat by home size, and it does not change because a clean took longer than expected. If a home needs substantially more work than described, such as heavy build-up or far more glass or cabinetry than stated, the team explains what it found and the options before continuing.
                  </p>
                  <p>
                    Nothing is charged at booking. The day before the clean, a temporary hold is placed on the card to confirm it is valid; it can look like a charge in a banking app, but no money moves until the clean is complete. Before you book, compare{" "}
                    <Link to="/calgary/services/" className="text-primary underline underline-offset-2">every Calgary cleaning service, with starting prices</Link>, or{" "}
                    <Link to="/reviews/" className="text-primary underline underline-offset-2">read the Duty Cleaners reviews</Link>.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Deep cleaning */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">The first visit</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                  Deep cleaning services in Airdrie
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    A deep clean in Airdrie is {DEEP_FROM} for a one-bedroom apartment or condo and {DEEP_TOP} for five bedrooms, before GST, plus the {TRAVEL_FEE} travel fee and any house-type or pet charge. It is the standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers. Book it once to catch up, then keep the home on a standard schedule. The{" "}
                    <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-2">deep cleaning in Calgary</Link>{" "}
                    page has the full checklist and the price at every bedroom count.
                  </p>
                  <p>
                    A suite on a booking platform is a turnover between guests rather than a schedule, and it is priced by the hour on the{" "}
                    <Link to="/airbnb-cleaning-services-calgary/" className="text-primary underline underline-offset-2">short-term rental turnover cleaning in Calgary</Link>{" "}
                    page. Every tier and every add-on is on{" "}
                    <Link to="/calgary/pricing/" className="text-primary underline underline-offset-2">Calgary house cleaning prices by home size</Link>; add the {TRAVEL_FEE} travel fee for an Airdrie address.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Move-out cleaning */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Handover day</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                  Move-out cleaning in Airdrie
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    Move-out cleaning in Airdrie starts at {MOVE_FROM} before GST for a one-bedroom apartment or condo, and the {TRAVEL_FEE} travel fee is added because the address is outside Calgary city limits. The same home sizes, house-type charges and pet charge apply as on a standard clean. The full checklist for{" "}
                    <Link to="/move-out-cleaning-calgary/" className="text-primary underline underline-offset-2">end of tenancy cleaning for an Airdrie rental</Link>{" "}
                    is on the Calgary move-out page.
                  </p>
                  <p>
                    Under Alberta's Residential Tenancies Act, the landlord of an Airdrie rental completes a move-out inspection report with the tenant. Within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days), as set out in{" "}
                    <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>. Duty Cleaners does not promise the deposit comes back; the landlord decides. What the clean can do is have the home finished to the move-out checklist before that inspection starts.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  Cleaning Services for Airdrie Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Six services for Airdrie homes; every booking here carries the travel fee.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((s, i) => (
                  <ServiceCard key={i} {...s} />
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection>
              {/* Up-link to the city hub. /cleaning-services-calgary/ is a
                  subpage, unlike Edmonton's hub which is the homepage, so it is
                  the one that actually needs internal support: it ranked 24.8
                  for "cleaning services calgary" against Edmonton's 6.3 on the
                  identical query, on comparable impressions. */}
              <p className="mt-10 text-center text-muted-foreground">
                {"We clean Airdrie and the wider Calgary area — see "}
                <Link
                  to="/cleaning-services-calgary/"
                  className="text-primary underline underline-offset-2"
                >
                  house cleaning services in Calgary
                </Link>
                {" for the full picture."}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  Why Airdrie Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  The terms are the same in Airdrie as they are in Calgary.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => (
                  <WhyUsCard key={i} {...item} />
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Service Areas */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Other towns the Calgary house cleaners cover
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
                The same Calgary crews do{" "}
                <Link to="/cleaning-services-cochrane/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Cochrane</Link>, and both towns are outside Calgary city limits, so both carry the {TRAVEL_FEE} travel fee. The Calgary branch also does{" "}
                <Link to="/locations/okotoks/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Okotoks</Link>{" "}
                and runs{" "}
                <Link to="/locations/chestermere/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Chestermere</Link>, as well as Strathmore, High River, Langdon, Crossfield and Diamond Valley, and the same fee applies in each. Inside Calgary city limits there is no trip fee.
              </p>
              <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                View All Service Areas →
              </Link>

            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">FAQ</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Airdrie house cleaning questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Book house cleaning in Airdrie
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341">
                    <Phone className="mr-2 w-5 h-5" />Call (403) 768-1341
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote">
                    <Mail className="mr-2 w-5 h-5" />See My Instant Price
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
