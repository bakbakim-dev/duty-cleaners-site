import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, Building2, PaintRoller
} from "lucide-react";
import airdrieImg from "@/assets/gallery/airdrie-landmark.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { sitePriceRange, standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

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
const PAGE_DESCRIPTION = `House cleaning in Airdrie from ${STANDARD_FROM}, flat by home size, with the travel fee shown up front. Standard, deep and move-out cleans rated ${CALGARY_RATING}.`;

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of the whole home, priced flat by home size.", to: "/calgary/regular-cleaning/", linkText: "Standard cleaning in Airdrie" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Corners, baseboards and the surfaces a regular visit skips, cleaned top to bottom.", to: "/calgary/deep-cleaning/", linkText: "Deep cleaning in Airdrie" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Detailed cleaning for moving day, on the way out or the way in.", to: "/move-out-cleaning-calgary/", linkText: "Move-out cleaning in Airdrie" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after renovations and new builds in Airdrie.", to: "/post-construction-cleaning-calgary/", linkText: "Post-construction cleaning in Airdrie" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning-calgary/", linkText: "Wall washing in Airdrie" },
  { icon: Building2, title: "Commercial Cleaning", description: "Office and commercial cleaning for Airdrie businesses." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `An Airdrie clean is rated on the Calgary listing, which carries ${CITY_PROOF.calgary.googleReviewCount} reviews.`, link: { href: CALGARY_LISTING.reviewsUrl, text: "See the Calgary listing" } },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability, schedule permitting." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners who work to the Duty Cleaners checklist." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we'll return to make it right — at no additional charge.` },
];

const nearbyAreas = ["Coopers Crossing", "Luxstone", "Bayside", "Williamstown", "Windsong", "Midtown", "Hillcrest", "Cobblestone Creek"];

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
      answer: `Yes. Airdrie is its own city north of Calgary's limits, and a home-cleaning booking outside Calgary carries a ${TRAVEL_FEE} travel fee. It is added at booking and sits in the total before you confirm. Home size does not change it, but the type of clean can: post-construction has its own fee of ${PC_TRAVEL_FEE}. Beyond that fee, nothing here is priced differently from a Calgary address. The pet charge and the home-type surcharges apply in Airdrie exactly as they do in the city: ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse and ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "Can I get a same-day clean in Airdrie?",
      answer: `When a Calgary crew has a gap in the north of the city, yes; the office can tell you on the phone. Arrival windows are ${ARRIVAL_WINDOWS.join(", ")}. Booking a day or two ahead is the sure way to get the window you want, and you do not need to be home if you leave a key or a code.`
    },
    {
      question: "Do you do move-out cleaning in Airdrie?",
      answer: `Yes. A move-in or move-out clean in Airdrie is ${MOVE_FROM} to ${MOVE_TOP} by bedroom count, plus the travel fee. It is priced for an empty house and includes what a standard clean treats as add-ons: the inside of the oven, the inside of the fridge, and the inside of the kitchen and bathroom cabinets. The Calgary move-out page lists the full checklist.`
    },
    {
      question: "What does a standard clean cost in Airdrie?",
      answer: `${STANDARD_FROM} for a one-bedroom through ${STANDARD_TOP} for five or more bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee. A deep clean runs ${DEEP_FROM} to ${DEEP_TOP} on the same scale. Recurring schedules take 20% off weekly, 15% off bi-weekly and 10% off every four weeks, from the second visit.`
    },
    {
      question: "Do the cleaners bring supplies to Airdrie?",
      answer: `Yes, all of them, including the vacuum and the descaler. If there is a product you would rather we used on a particular surface, leave it out and say so at booking. Eco-friendly products are ${POLICY.ecoProductsFee} extra: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What is the guarantee on an Airdrie clean?",
      answer: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we come back and do it at no charge; photos are not required. Cancelling with less than ${POLICY.cancellationNoticeHours} hours' notice costs ${POLICY.cancellationFee}, and a lockout is charged at ${POLICY.lockoutFee}.`
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
                  {`House cleaning in Airdrie from ${STANDARD_FROM}, flat by home size, with the ${TRAVEL_FEE} travel fee for addresses outside Calgary shown before you book. Rated ${CALGARY_RATING} by Calgary customers, from Coopers Crossing to Bayside.`}
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
                    { icon: CalendarCheck, text: "Flexible Scheduling Available" },
                    { icon: Award, text: "100% Satisfaction Guarantee" },
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

        {/* About the Neighbourhood */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  House cleaning in Airdrie
                </h2>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  <p>
                    Airdrie is north of Calgary on the{" "}
                    <a href="https://www.google.com/maps/place/Queen+Elizabeth+II+Hwy,+Alberta/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Queen Elizabeth II Highway</a>.
                    We clean homes across the city, from{" "}
                    <a href="https://www.google.com/maps/place/Nose+Creek+Park,+Airdrie,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Nose Creek Park</a>,{" "}
                    <a href="https://www.google.com/maps/place/Iron+Horse+Park,+Airdrie,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Iron Horse Park</a>{" "}
                    and{" "}
                    <a href="https://www.google.com/maps/place/East+Lake+Regional+Park,+Airdrie,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">East Lake Regional Park</a>{" "}
                    to{" "}
                    <a href="https://www.google.com/maps/place/Luxstone,+Airdrie,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Luxstone</a>{" "}
                    and{" "}
                    <a href="https://www.google.com/maps/place/Coopers+Crossing,+Airdrie,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Coopers Crossing</a>.
                  </p>
                  <p>
                    The price is a flat rate by bedroom count, from {STANDARD_FROM} for a one-bedroom, and Airdrie is outside Calgary city limits, so a {TRAVEL_FEE} travel fee is added at booking rather than discovered on the invoice. The crews are the Calgary crews: reference-checked before a first job, rated by the customer after every visit, and you can{" "}
                    <Link to="/reviews/" className="text-primary underline underline-offset-2">read the reviews</Link>{" "}
                    before you book. For the whole menu at a glance, see{" "}
                    <Link to="/calgary/services/" className="text-primary underline underline-offset-2">every Calgary cleaning service, with starting prices</Link>.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      {/* Things To Do */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Life</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Around Airdrie
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>Airdrie began as a railway village in the late 1800s and is now part of the Calgary Metropolitan Region. Nose Creek Park hosts the Airdrie Festival of Lights each year, Iron Horse Park runs miniature train rides, and East Lake Regional Park has walking trails. The other name on the map is the Airdrie Farmers Market.</p>
              </div>
            </div>
          </AnimatedSection>
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
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37826.07!2d-114.01062!3d51.28597!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x537165b57e9b9e8d%3A0x4c0b0e1e5b3d!2sAirdrie%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    title="Airdrie Service Area Map"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Coverage</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                  Airdrie Neighbourhoods We Serve
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The Airdrie communities we cover, at the same flat rate in each.
                </p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="Supply and scale"
        heading="Cloudy glass, not dirty glass"
        paragraphs={[
          "No treatment plant operates here. The water arrives already treated, bought from the City of Calgary and held in local reservoirs before it reaches a tap — and the published hardness at that supplier's two plants never drops below about 140 milligrams per litre in any quarter. So shower glass, kettle elements and chrome go cloudy rather than grubby. Scale ignores scrubbing. It answers to a mild acid and a few minutes of patience.",
          "A 2012 annexation brought in 12,640 acres from Rocky View County, land banked to carry growth all the way to 2062. That is four decades of city edge with a build site somewhere along it. Downwind of an active phase, what collects in window tracks and on patio doors is gypsum and sawdust — light, dry and abrasive. Lift it off dry. Wiping it across glass is how glass gets scratched.",
        ]}
        accent="calgary"
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Deep cleaning */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">The first visit</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                  Deep cleaning services in Airdrie
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    A deep clean in Airdrie is {DEEP_FROM} for a one-bedroom and {DEEP_TOP} for five or more bedrooms, plus the {TRAVEL_FEE} travel fee. It is the standard clean with the once-a-season work added: baseboards, ceiling fans, vent covers, outlet covers and light switches. Most homes book it once, then hold the result on a standard schedule. The{" "}
                    <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-2">deep cleaning in Calgary</Link>{" "}
                    page has the full checklist and the price at every bedroom count.
                  </p>
                  <p>
                    For a handover, the job is{" "}
                    <Link to="/move-out-cleaning-calgary/" className="text-primary underline underline-offset-2">Calgary move-out cleaning</Link>{" "}
                    from {MOVE_FROM}, priced for an empty house with the oven, fridge and cabinet interiors included. A suite on a booking platform is a turnover between guests rather than a schedule, and it is priced by the hour on the{" "}
                    <Link to="/airbnb-cleaning-services-calgary/" className="text-primary underline underline-offset-2">short-term rental turnover cleaning in Calgary</Link>{" "}
                    page. Every tier and every add-on is on{" "}
                    <Link to="/calgary/pricing/" className="text-primary underline underline-offset-2">Calgary house cleaning prices by home size</Link>; add the {TRAVEL_FEE} travel fee for an Airdrie address.
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
                  Everything from weekly upkeep to full move-out cleans.
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
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
                Near Airdrie: other communities we clean
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
                The same Calgary crews do{" "}
                <Link to="/cleaning-services-cochrane/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Cochrane</Link>, west of the city in the foothills, and both towns are outside Calgary limits, so both carry the {TRAVEL_FEE} travel fee. Inside Calgary there is no fee; the city page lists every neighbourhood we cover.
              </p>
              <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                View All Service Areas →
              </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Airdrie? We also handle{" "}
              <Link to="/commercial-cleaning-services-calgary/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Calgary region
              </Link>.
            </p>

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
