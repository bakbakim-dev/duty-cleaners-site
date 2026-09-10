import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import LocationPricing from "@/components/LocationPricing"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, ExternalLink, PaintRoller
} from "lucide-react";
import stonyPlainHome from "@/assets/gallery/stony-plain-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Every figure on this page is derived from bk-config or policy.ts.
const STANDARD = standardTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TOP = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = deepCleanTierRows()[0].price;
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
const EDMONTON_LISTING = GOOGLE_LISTINGS.edmonton;

const PAGE_TITLE = `House Cleaning Stony Plain from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `Wood, plaster and period tile in Stony Plain get a gentler method, and cleaning is from ${STANDARD_FROM} before GST for a one-bedroom condo plus a ${TRAVEL_FEE} travel fee.`;

// A worked move-out quote built from the same rows the price table uses: a
// two-bedroom bungalow, outside Edmonton city limits.
const dollars = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
const cents = (value: number) => Math.round(value * 100) / 100;
const EXAMPLE_TIER = MOVE[1];
const EXAMPLE_TOTAL = cents(dollars(EXAMPLE_TIER.price) + BK_PRICE_OVERRIDES[54].price + (travelFee("move-in-out") ?? travelFee("standard") ?? 0));
const EXAMPLE_PRICE = formatPrice(EXAMPLE_TOTAL);

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Stony Plain" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: cobwebs, ceiling fans, light switches, outlet covers and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Stony Plain" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Stony Plain" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "The final clean after a renovation or a new build, priced by square footage rather than bedrooms.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Stony Plain" },
  { icon: PaintRoller, title: "Wall Washing", description: "Spot cleaning or a full wash of the walls, added to a booked clean and priced by home size.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Stony Plain" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The standard clean on a schedule, from ${STANDARD_FROM} a visit before GST for a one-bedroom apartment or condo, plus the ${TRAVEL_FEE} travel fee and any pet or home-type charge. The first visit is charged at the one-time rate, then 20% off weekly, 15% bi-weekly, 10% every four weeks.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Stony Plain" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `Stony Plain cleans are rated on the Edmonton listing, which stands at ${CITY_PROOF.edmonton.googleReviewCount} reviews.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "Go to the listing" } },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: "Tell us within 24 hours if something was missed and the team comes back to re-clean it, at no charge." },
];

// Only names on the Edmonton branch's curated list in city-locations.ts. The
// old chips (Parkland County, Acheson, Carvel, Duffield) are not on it.
const nearbyCommunities = ["Spruce Grove"];

export default function StonyPlain() {
  const faqs = [
    {
      question: "Does house cleaning in Stony Plain include a travel fee?",
      answer: `It does, because Stony Plain is outside Edmonton city limits. The travel fee is ${TRAVEL_FEE} on a standard, deep or move-out booking and ${PC_TRAVEL_FEE} on a post-construction one, added at booking and included in the total you confirm. Beyond that fee the price is built exactly as it is for an Edmonton address: the same flat rate for the same size of home, ${PET_FEE} a visit if the home has pets, and the home-type charge on top of the apartment or condo rate, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "How soon can you come out to Stony Plain?",
      answer: `Same-day and next-day slots depend on the schedule. Call the Edmonton office at ${CITY_PROOF.edmonton.phone} and ask what is open. The team arrives within one of three windows, ${ARRIVAL_WINDOWS.join(", ")}, and you do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and the team locks up.`
    },
    {
      question: "Do you do move-in and move-out cleaning in Stony Plain?",
      answer: `Yes. Move-in and move-out cleans are ${MOVE_FROM} to ${MOVE_TOP} before GST by bedroom count, priced for an apartment or condo, plus the ${TRAVEL_FEE} travel fee and any house-type or pet charge. The move-out checklist adds the inside of the oven, fridge and microwave and the inside of every cabinet, drawer and closet to the standard clean. On a standard visit, the inside of the oven and the inside of the fridge are add-ons instead.`
    },
    {
      question: "What is the price of a standard clean in Stony Plain?",
      answer: `${STANDARD_FROM} for a one-bedroom apartment or condo, up to ${STANDARD_TOP} for five or more bedrooms, before GST, with the ${TRAVEL_FEE} travel fee on top and the house-type or pet charge where it applies. A deep clean of a one-bedroom is ${DEEP_FROM} on the same terms. Book weekly and the standard price drops 20%; bi-weekly drops it 15% and every four weeks drops it 10%. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "Should I leave out cleaning supplies?",
      answer: `No. The team brings all supplies and equipment. Eco-friendly products are ${POLICY.ecoProductsFee} extra: ${POLICY.ecoProductsHowToRequest}. Running water is required, and vacuuming may not be possible without electricity.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within 24 hours and the team comes back to your Stony Plain home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does it cost to cancel or change a Stony Plain booking?",
      answer: `Changing or cancelling needs ${POLICY.cancellationNoticeHours} hours' notice; inside that window the fee is ${POLICY.cancellationFee}. If the team arrives and cannot get in, the lockout charge is ${POLICY.lockoutFee}. If we have to move a booking, because a cleaner is ill or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have, and cancelling a booking we moved costs nothing.`
    },
    {
      question: "What is not included in a Stony Plain clean?",
      answer: `Outdoor work is not part of any clean, so exterior windows, garages and patios are excluded, and so is removing window screens. In Stony Plain that matters, because the wind off the open country around the town lands on the screens and the outward face of the glass. Lifting anything over 25 lb, anything beyond a 3-step ladder, carpet steam cleaning, upholstery, laundry and dishes are also excluded.`
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
    <div className="min-h-screen">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-stony-plain/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-stony-plain/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Stony Plain, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-stony-plain", areaServed: "Stony Plain, AB" }))}</script>
      <Navigation city="edmonton" />
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
                <span className="text-white/90 text-sm font-medium">Serving Stony Plain, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Stony Plain
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                A standard clean in Stony Plain is {STANDARD_FROM} to {STANDARD_TOP} before GST by bedroom count, priced for an apartment or condo. The {TRAVEL_FEE} travel fee is added, with a house-type surcharge and the pet charge where they apply. The Edmonton listing is rated {RATING_CLAIM} across {CITY_PROOF.edmonton.googleReviewCount} reviews.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />(780) 913-6565
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
              <img width={800} height={608}
                src={stonyPlainHome}
                alt="A two-storey house with a covered front porch, spruce trees and a mowed front lawn"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* A worked move-out quote. Replaces the brochure "About the
          Neighbourhood" section, its landmark cards and "Around Stony Plain",
          whose parks, museum and settlement history were not in the local
          note or the FACTS block. */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">A worked quote</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Move-out cleaning in Stony Plain, priced line by line
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Say a two-bedroom, two-bathroom bungalow in Stony Plain is being handed back to its landlord. The move-in and move-out table price for that size is {EXAMPLE_TIER.price}, set for an apartment or condo. A bungalow adds {HOME_TYPE.bungalow}, and the {TRAVEL_FEE} travel fee applies because Stony Plain sits outside Edmonton city limits, which makes {EXAMPLE_PRICE} before 5% GST. A home with pets adds the {PET_FEE} pet charge on top; it is compulsory, and it shows on the quote before booking.
                </p>
                <p>
                  For that figure the team works through the standard checklist and then the move-out extras: the inside of the oven, fridge and microwave, and the inside of every cabinet, drawer and closet. Under Alberta's Residential Tenancies Act the landlord completes a move-out inspection report with the tenant, and the security deposit must be returned within 10 days after the tenant moves out. We do not promise the deposit comes back; the landlord decides.
                </p>
                <p>
                  The same arithmetic works for any Stony Plain booking. The bedroom and bathroom count sets the table price, a townhouse adds {HOME_TYPE.townhouse} and a two-storey house {HOME_TYPE.twoStorey}, and eco-friendly products are {POLICY.ecoProductsFee} if you ask for them when you book. How long the clean runs never changes the price, and if a home needs far more work than described, the team says what it found and the options before going on. These are the rates the Edmonton branch charges for its{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Edmonton</Link>.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Service Area</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Our Stony Plain Service Area
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Bookings in Stony Plain run through the Edmonton branch at 18615 71 Ave NW. The office is open Monday to Saturday from 8:00 AM to 8:00 PM, and Sunday from 9:00 AM to 3:00 PM.
              </p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38000.0!2d-114.00487!3d53.52899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x539ff70e3f41d2ad%3A0x4399e4bfc1b1e30d!2sStony%20Plain%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Stony Plain Service Area Map"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Cleaning Services for Stony Plain Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep and move-out cleans are set by home size, post-construction by square footage, and wall washing is added to a booked clean. The{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">Edmonton cleaning services and starting prices</Link>{" "}
                list covers each one for a Stony Plain address.
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
                Who cleans a Stony Plain home, and how they are rated
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Customers rate each clean when it is done, and those ratings decide which cleaners the Edmonton branch keeps sending. The{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">Edmonton house cleaning reviews</Link>{" "}
                are there to read before you book.
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

      <LocationPricing />

      {/* Which clean, and what it costs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Choosing</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                Which clean to book for a Stony Plain home
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A house that is kept up wants the standard clean, from {STANDARD_FROM}. A house in one of the newer subdivisions that has never had a professional clean starts better with the deep clean from {DEEP_FROM}, so the ceiling fans, light switches and vent covers are done once before a standard schedule takes over. A handover needs{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">move-in and move-out cleaning in Stony Plain</Link>, from {MOVE_FROM}. All three figures are before GST for a one-bedroom apartment or condo, and the house-type surcharge and the pet charge apply to each where they fit the home.
                </p>
                <p>
                  A suite let to visitors is a turnover between guests, priced by the hour; the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">short-term rental cleaning in Edmonton</Link>{" "}
                  page explains how that is booked. Every tier and add-on is listed under{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">Edmonton cleaning prices for every bedroom count</Link>; add the {TRAVEL_FEE} travel fee for a Stony Plain address.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="What we see"
        heading="Murals on the old downtown"
        paragraphs={[
          "The old downtown here is painted with dozens of murals covering the town's own history. The heritage buildings behind them are the reason the interiors run older than the newer subdivisions suggest. Original wood, plaster and period tile need a gentler method than a modern finish does: damp and wrung out, no abrasive pad, and time given to the material rather than pressure applied to it.",
          "The town shares a boundary with Spruce Grove and is otherwise wrapped by Parkland County, so open country starts a short way past the last streets in most directions. That is a wind exposure rather than a traffic one, and it lands on window screens and the outward face of the glass rather than on floors.",
        ]}
      />

      {/* Local Coverage */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            {/* Renamed off "Near Stony Plain": <NearbyNeighbourhoods> above
                already heads a block with that wording, and two of them in a
                row read as the same section printed twice. */}
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              Cleaning services in Stony Plain and other Edmonton-branch towns
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              Stony Plain shares a boundary with Spruce Grove, and{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Spruce Grove</Link>{" "}
              run from the same Edmonton office on the same terms. From that office the branch also sends{" "}
              <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">Devon house cleaners</Link>{" "}
              and runs{" "}
              <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Beaumont</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-fort-saskatchewan/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Fort Saskatchewan</Link>. All four are outside Edmonton city limits and carry the same {TRAVEL_FEE} travel fee as Stony Plain.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {nearbyCommunities.map((community, i) => (
                <span key={i} className="bg-white/70 border border-border rounded-full px-5 py-2 text-sm font-medium text-foreground">
                  {community}
                </span>
              ))}
            </div>
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Stony Plain house cleaning questions</h2>
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
              Book house cleaning in Stony Plain
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              See your flat rate before you book. Nothing is charged until the clean is done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href="tel:7809136565">
                  <Phone className="mr-2 w-5 h-5" />Call (780) 913-6565
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
  );
}
