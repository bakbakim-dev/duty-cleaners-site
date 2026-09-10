import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM, COMPANY } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import fortSaskKitchen from "@/assets/gallery/fort-saskatchewan-kitchen-clean.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

import LocationPricing from "@/components/LocationPricing";

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

const PAGE_TITLE = `House Cleaning Fort Saskatchewan from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `Fort Saskatchewan cleans start at ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote built from the same rows the price table uses: a
// three-bedroom two-storey house on a move-in clean, outside city limits.
const dollars = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
const EXAMPLE_TIER = MOVE[2];
const EXAMPLE_PRICE = formatPrice(dollars(EXAMPLE_TIER.price) + BK_PRICE_OVERRIDES[90].price + (travelFee("standard") ?? 0));
// An add-on on a standard clean; the move-in/move-out clean includes it.
const OVEN_FROM = formatPrice(addOnFromPrice("standard", "inside-oven") ?? 0);

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Fort Saskatchewan" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: cobwebs, ceiling fans, light switches, outlet covers and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Fort Saskatchewan" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Fort Saskatchewan" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after a build or a renovation, priced by square footage.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Fort Saskatchewan" },
  { icon: PaintRoller, title: "Wall Washing", description: "Spot cleaning or a full wash of painted walls, booked together with a clean rather than on its own.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Fort Saskatchewan" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The standard clean on a standing booking, from ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. Every visit after the first is 20% off weekly, 15% bi-weekly, 10% every 4 weeks.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Fort Saskatchewan" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `A Fort Saskatchewan clean is rated on the Edmonton listing, which carries ${CITY_PROOF.edmonton.googleReviewCount} reviews.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "Read the listing" } },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: `Tell us within ${POLICY.guaranteeWindowHours} hours if something was missed and the team comes back to re-clean it, at no charge.` },
];

const nearbyAreas = [
  "Sherwood Park", "St. Albert"
];

export default function FortSaskatchewan() {
  const faqs = [
    {
      question: "Is there a travel fee for cleaning in Fort Saskatchewan?",
      answer: `There is. Fort Saskatchewan is outside Edmonton city limits, so bookings here carry a ${TRAVEL_FEE} travel fee on top of the flat rate. It is one line, added at booking, and it is the same whether the clean is a standard, a deep or a move-out; post-construction is the one service with its own figure, ${PC_TRAVEL_FEE}. That line is the only thing an Edmonton address would not have. The rest of the bill is built the same way, including the pet charge and the home-type surcharges: ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "When does the team arrive in Fort Saskatchewan?",
      answer: `The booking sets an arrival window, not an exact time: ${ARRIVAL_WINDOWS.join(", ")}. Same-day and next-day slots depend on the schedule, so phone ${CITY_PROOF.edmonton.phone} to ask what is open. If someone in the house sleeps days after a plant shift, name the room at booking and the team changes the order it cleans in. You do not need to be home if you leave a key, a lockbox code or smart-lock access, and the team locks up.`
    },
    {
      question: "Do you offer move-out cleaning in Fort Saskatchewan?",
      answer: `Yes. A move-in or move-out clean in Fort Saskatchewan runs from ${MOVE_FROM} for a one-bedroom apartment or condo to ${MOVE_TOP} for five or more bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. It covers what a standard clean leaves closed: inside the oven, fridge and microwave, and inside every cabinet, drawer and closet. For a house nobody has lived in yet, it is also the right clean to book before the furniture arrives. Under Alberta's Residential Tenancies Act the landlord completes a move-out inspection report with the tenant, and we do not promise the deposit comes back; the landlord decides.`
    },
    {
      question: "How much is a standard house clean in Fort Saskatchewan?",
      answer: `A standard clean in Fort Saskatchewan is ${STANDARD_FROM} for a one-bedroom apartment or condo, rising to ${STANDARD_TOP} for five or more bedrooms, before GST and the ${TRAVEL_FEE} travel fee; a house or a home with pets adds its surcharge. A deep clean of the same one-bedroom is ${DEEP_FROM}. On a weekly schedule the standard rate is 20% less, bi-weekly 15% less and every 4 weeks 10% less. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "Do I have to provide cleaning products?",
      answer: `No. The team brings all supplies and equipment, including the vacuum. Leave the water and power on until the clean is done, because running water is required and vacuuming may not be possible without electricity. Eco-friendly products cost ${POLICY.ecoProductsFee} extra: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Fort Saskatchewan home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does cancelling or moving a Fort Saskatchewan booking cost?",
      answer: `Cancelling or moving a booking with less than ${POLICY.cancellationNoticeHours} hours' notice costs ${POLICY.cancellationFee}; with more notice there is no fee. If the team arrives and cannot get in, the charge is ${POLICY.lockoutFee}. If we have to move a booking, for a sick cleaner, a vehicle that will not start or unsafe roads, we say so as soon as we know and offer the earliest slot we have, and you can cancel a booking we moved at no charge.`
    },
    {
      question: "Will the team clean a storage room or clear clutter?",
      answer: `The team cleans clear floors and counters and works around whatever is stacked on them, so a storage room in a long-settled Fort Saskatchewan home has to be emptied before it can be cleaned. Decluttering or organising is a separate hourly add-on. Lifting anything over 25 lb, hoarding situations and large debris removal are not included, and nor are garages or outdoor areas.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-fort-saskatchewan/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-fort-saskatchewan/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Fort Saskatchewan, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-fort-saskatchewan", areaServed: "Fort Saskatchewan, AB" }))}</script>
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
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Fort Saskatchewan, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Fort Saskatchewan
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                House cleaning in Fort Saskatchewan starts at {STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a {TRAVEL_FEE} travel fee and any house-type or pet surcharge, and the card is charged after the clean. The Edmonton branch is rated {RATING_CLAIM} from {CITY_PROOF.edmonton.googleReviewCount} reviews, and Duty Cleaners has cleaned Alberta homes {COMPANY.sinceLabel}.
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
              <img width={512} height={640}
                src={fortSaskKitchen}
                alt="A cleaner wiping down a kitchen appliance"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-8">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Map</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Fort Saskatchewan on the map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fort Saskatchewan cleans are booked by the Edmonton office at 18615 71 Ave NW, which takes calls from 8:00 AM to 8:00 PM Monday to Saturday and from 9:00 AM to 3:00 PM on Sunday.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75200.0!2d-113.21489!3d53.71286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a03e0e0bffffff%3A0x9a3a0e0e0bffffff!2sFort+Saskatchewan%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Fort Saskatchewan Service Area Map"
              />
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
                Cleaning Services for Fort Saskatchewan Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Five of these services are priced flat by home size, and post-construction is priced by square footage.
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
                Why Fort Saskatchewan Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Every Fort Saskatchewan booking comes with all four.
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

      {/* Local Coverage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              House cleaning in Fort Saskatchewan and other towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              The Edmonton branch cleans nine communities outside the city, and Fort Saskatchewan is one of them, on the same checklist and flat rates as our{" "}
              <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning inside Edmonton city limits</Link>. The same office sends out our{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert cleaning crews</Link>, does{" "}
              <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">Beaumont house cleaning</Link>{" "}
              and runs{" "}
              <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Devon</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-stony-plain/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Stony Plain</Link>. Every one of those towns is outside Edmonton city limits, so the {TRAVEL_FEE} travel fee applies there exactly as it does here.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="From the route"
        heading="Quiet hours in a shift town"
        paragraphs={[
          "Alberta's Industrial Heartland, a hydrocarbon processing region, takes in Fort Saskatchewan and the counties around it, and enough of the households we clean run on a plant rotation that we ask about it at booking. Someone may be asleep at two in the afternoon. Tell us which room: the order a house gets done in is easy to change, and the vacuum is the part that matters.",
          "Growth here has been steep and long: Southfort and Westpark were laid out generations after the older streets near the original fort site, so the work swings between move-in cleans in houses nobody has lived in yet and long-settled homes where a storage room has to be emptied before it can be cleaned at all.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

      {/* Which clean, and what it costs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Choosing</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                Matching the clean to the house
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A new house in Southfort or Westpark that nobody has lived in yet needs a move-in clean, and the same clean serves both ends of a move. Book{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">move-out cleans in Fort Saskatchewan</Link>{" "}
                  from {MOVE_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, and have it done before the furniture arrives, while every cabinet, drawer and closet is still empty.
                </p>
                <p>
                  A long-settled home on the older streets near the fort site is better started with a deep clean, from {DEEP_FROM} on the same terms, which adds cobwebs, ceiling fans, light switches, outlet covers and vent covers to the standard checklist. After that, the standard clean from {STANDARD_FROM} on the same terms keeps it. A storage room has to be emptied before the team can clean it, because clutter gets worked around rather than cleared.
                </p>
                <p>
                  A suite listed as a short-term rental needs a turnover between guests rather than a scheduled clean, priced by the hour with a minimum of 3 hours for one cleaner or 2 hours for two; the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning for Edmonton-area hosts</Link>{" "}
                  page sets that out. Every tier by bedroom count and every add-on is on{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">the Edmonton price list, tier by tier</Link>. Add the {TRAVEL_FEE} travel fee to any of those figures for an address in Fort Saskatchewan.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* A worked quote, built from the same rows as the price table */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">A worked quote</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                What a house cleaning quote in Fort Saskatchewan adds up to
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Take a three-bedroom, two-storey house in Fort Saskatchewan that nobody has lived in yet, with two bathrooms and a half bath, booked for a move-in clean. The table price for that size is {EXAMPLE_TIER.price}, which assumes an apartment or condo. A two-storey house adds {HOME_TYPE.twoStorey} and a Fort Saskatchewan address adds the {TRAVEL_FEE} travel fee, so the quote comes to {EXAMPLE_PRICE} before 5% GST. Once a pet lives there, every visit also carries the compulsory {PET_FEE} pet charge.
                </p>
                <p>
                  The figure moves with the home and the extras; how long the clean takes does not change it. More bathrooms than the table assumes raise it. On a later standard clean, an add-on such as inside the oven, from {OVEN_FROM} before GST, raises the price of that visit. If a home needs substantially more work than described, such as heavy build-up, the team explains what it found and the options before continuing.
                </p>
                <p>
                  Every line, the travel fee included, shows on the instant price before you book. Nothing is charged at booking, and the card is charged once the clean is complete.
                </p>
              </div>
            </div>
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Fort Saskatchewan house cleaning questions</h2>
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
              Book house cleaning in Fort Saskatchewan
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
