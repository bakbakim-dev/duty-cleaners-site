import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, CalendarCheck, ThumbsUp, Mail, PaintRoller, Sparkles, Check } from "lucide-react";
import spruceGroveFamilyHome from "@/assets/gallery/spruce-grove-family-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS } from "@/data/pricing";
import { travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Figures come from bk-config through pricing.ts; nothing here is hand-typed.
const STANDARD = standardTierRows();
const DEEP = deepCleanTierRows();
const MOVE = moveInOutTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TO = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = DEEP[0].price;
const DEEP_TO = DEEP[DEEP.length - 1].price;
const MOVE_FROM = MOVE[0].price;
const MOVE_TO = MOVE[MOVE.length - 1].price;
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
const PAGE_TITLE = `House Cleaning Spruce Grove | Duty Cleaners`;
const META_DESCRIPTION = `Spruce Grove house cleaning starts at ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// four-bedroom two-storey house on a move-in clean, no pets, outside city
// limits. The table rounds each size to the dollar, so no total is built from a
// table card.
const EXAMPLE_SIZE = PRICING_TIERS[3];
const EXAMPLE_TIER = MOVE[3];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "move-in-out", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("move-in-out")[0]?.id ?? null));
const EXAMPLE_BASE_TEXT = EXAMPLE_BASE === EXAMPLE_TIER.price ? EXAMPLE_BASE : `${EXAMPLE_BASE} (${EXAMPLE_TIER.price} in the table, which rounds to the dollar)`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(90, [TRAVEL_FEE_KEY]));

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Spruce Grove" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Spruce Grove" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Priced flat by home size, for moving out of a Spruce Grove home or into one.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Spruce Grove" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Priced by square footage, for the drywall dust a renovation or a new build leaves.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Spruce Grove" },
  { icon: PaintRoller, title: "Wall Washing", description: "Spot cleaning or a full wash, added to a clean and priced by home size.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Spruce Grove" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: "The standard clean booked to repeat. Weekly takes 20% off from the second visit, bi-weekly 15% and every four weeks 10%.", to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Spruce Grove" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `The Edmonton listing carries ${CITY_PROOF.edmonton.googleReviewCount} of them, and a Spruce Grove clean is rated on that listing.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "Check it on Google" } },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: "Tell us within 24 hours if something was missed and the team comes back to re-clean it, at no charge." },
];

// Only names on the Edmonton branch's list in data/city-locations.ts.
const nearbyAreas = ["Stony Plain"];

export default function SpruceGrove() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in Spruce Grove?",
      answer: `Yes. Spruce Grove is its own city, outside Edmonton's limits, so home-cleaning bookings here carry a ${TRAVEL_FEE} travel fee on top of the flat rate, and a post-construction booking carries the higher ${PC_TRAVEL_FEE} fee instead. Nothing else is priced differently from an Edmonton address. The flat rate is the same figure for the same size of home, and the pet charge and the home-type surcharges are added here on the same terms: ${PET_FEE} a visit where there are pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} on a bungalow or basement suite, ${HOME_TYPE.townhouse} on a townhouse and ${HOME_TYPE.twoStorey} on a two-storey house.`
    },
    {
      question: "What does a standard clean cost in Spruce Grove?",
      answer: `A standard clean in Spruce Grove is ${STANDARD_FROM} for a one-bedroom apartment or condo, up to ${STANDARD_TO} for five bedrooms, before the travel fee and 5% GST; a house and a pet add their own charges. The deep clean package on top brings the range to ${DEEP_FROM} to ${DEEP_TO}. Weekly, bi-weekly and every-four-weeks schedules are discounted 20%, 15% and 10%. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "How soon can you clean in Spruce Grove?",
      answer: `Same-day and next-day slots depend on the schedule; call ${CITY_PROOF.edmonton.phone} to check. The team arrives inside a window of ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]}, and you do not need to be home if there is a key, a lockbox code or smart-lock access.`
    },
    {
      question: "Do you do move-out cleaning in Spruce Grove?",
      answer: `Yes. Move-in and move-out cleans run ${MOVE_FROM} to ${MOVE_TO} by home size for an apartment or condo, before GST and the travel fee, with oven, fridge and cabinet interiors included in the price. A house or a pet adds its usual charge. Book it once the rooms are clear.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning, Edmonton and Spruce Grove" }
    },
    {
      question: "Do you bring the supplies?",
      answer: `Yes. The team brings all supplies and equipment. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}. Running water is required, and vacuuming needs power.`
    },
    {
      question: "How long does a first clean in Spruce Grove take?",
      answer: `We work to a checklist, not a clock. The crew stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within 24 hours and the team comes back to your Spruce Grove home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "Do I need to tidy before the team comes to Spruce Grove?",
      answer: `No. You do not need to clean before the team arrives at a Spruce Grove home. Clear counters and floors get cleaned and cluttered ones get worked around, and decluttering or organising is a separate hourly add-on.`
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
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-spruce-grove/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-spruce-grove/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Spruce Grove, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-spruce-grove", areaServed: "Spruce Grove, AB" }))}</script>
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
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <span className="dc-icon dc-icon-map-pin w-4 h-4 text-accent" aria-hidden="true" />
                <span className="text-white/90 text-sm font-medium">Serving Spruce Grove, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Spruce Grove
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Standard cleans in Spruce Grove start at {STANDARD_FROM} for a one-bedroom apartment or condo, before GST, and every home-cleaning booking here carries a {TRAVEL_FEE} travel fee; a house or a pet raises the figure. The Edmonton branch that takes Spruce Grove bookings is rated {RATING_CLAIM}, from {CITY_PROOF.edmonton.googleReviewCount} reviews on its listing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(780) 913-6565
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
              <img width={1024} height={768}
                src={spruceGroveFamilyHome}
                alt="A family of four on a sofa in a bright, open living room"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
              loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* Worked price example. Replaces the landmark tour and the "Around
          Spruce Grove" history and attractions box, none of it in the local note. */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Worked example</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                A Spruce Grove move-in clean, worked through
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Picture a four-bedroom two-storey house in Spruce Grove with three and a half bathrooms, booked for a move-in clean before the boxes arrive. The move-in rate for that size is {EXAMPLE_BASE_TEXT} as an apartment or condo, the travel fee is {TRAVEL_FEE} and the two-storey surcharge is {HOME_TYPE.twoStorey}, which makes {EXAMPLE_PRICE} before 5% GST. With no pets in the empty house there is no pet charge; a home with pets pays {PET_FEE} a visit.
                </p>
                <p>
                  The quote is set before the team arrives and does not grow because the clean takes longer than expected. It goes up for what is booked: more bathrooms, a larger home type, a pet or an add-on such as interior windows. If a house turns out to need substantially more work than was described, such as heavy build-up or far more glass or cabinetry than stated, the team explains what it found and the options before continuing.
                </p>
                <p>
                  Spruce Grove is outside Edmonton city limits, which is why the travel fee applies; post-construction carries {PC_TRAVEL_FEE} instead. Inside the city there is no trip fee, and everything else on a Spruce Grove quote matches the{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">Edmonton house cleaning service</Link>. Hosts in Spruce Grove letting a suite book turnovers as{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>, priced by the hour.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Move-out cleaning in the town */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Moving</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Move-out cleaning in Spruce Grove
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>The same move-in or move-out clean works in the other direction for anyone leaving a Spruce Grove home. It covers the standard rooms and goes inside the oven, fridge and microwave, and inside every cabinet, drawer and closet, priced flat by home size with the Spruce Grove travel fee on top.</p>
                <p>
                  For tenants, Alberta's Residential Tenancies Act sets two things. The landlord completes a move-out inspection report with the tenant. Within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days), as set out in{" "}
                  <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>. The landlord decides what happens to the deposit, and we do not promise it comes back.</p>
                <p>
                  Empty rooms make the best move-out clean, because a cupboard with plates still in it cannot be cleaned inside. No one needs to be home: most customers leave a key, a lockbox code or smart-lock access, and the team locks up. Anything beyond a 3-step ladder is outside the checklist, and so are exterior windows and garages. The checklist is shared with{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">move-out cleaning across Edmonton</Link>.
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
                Cleaning Services for Spruce Grove Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep and move-out cleans are flat by home size; post-construction is priced by square footage, and wall washing is booked alongside a clean. The page listing{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>{" "}
                has the add-ons and the checklist for each.
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
                Spruce Grove house cleaners, rated after every visit
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Each clean ends with a rating from the customer, and those ratings decide who keeps working for us.{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">Read the reviews</Link>{" "}
                to see what they say.
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
              Cleaning services in Spruce Grove, Stony Plain and the other Edmonton-area towns
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              The same Edmonton office runs{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">cleaning services in St. Albert</Link>,{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">a Morinville cleaning company</Link>,{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Sherwood Park</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">Leduc house cleaners</Link>{" "}
              at the same flat rates as Spruce Grove, and Stony Plain is on its list too. Like Spruce Grove, each is outside Edmonton city limits and carries the {TRAVEL_FEE} travel fee.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Ground truth"
        heading="What Parkland County blows in"
        paragraphs={[
          "Parkland County wraps the city on every side, and Stony Plain is its only urban neighbour. North and south of the limits that county land is prime cropland, worked at both ends of the season: seeding in May, combines from late August. Both put fine mineral soil in the air, and it settles along sills, in screen mesh and on top of door frames. Grit like that scratches if you wet it first, so it comes off dry, vacuum then cloth.",
          "The 2021 census found more people here than the 2016 count did, and that kind of growth arrives in Spruce Grove as new houses. Freshly finished homes hold drywall fines in return-air grilles long after possession day, so a first deep clean wipes the vent covers before any general surface. Do the room first and the furnace puts the whole lot back through it.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

      {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">FAQ</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">
                        {faq.answer}
                        {faq.link && (
                          <>
                            {" "}
                            <Link to={faq.link.to} className="text-primary underline underline-offset-2 font-medium">{faq.link.text}</Link>
                          </>
                        )}
                      </AccordionContent>
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
              Book house cleaning in Spruce Grove
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              See your flat rate before you book. Nothing is charged until the clean is done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href="tel:7809136565">
                  <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (780) 913-6565
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
