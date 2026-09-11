import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import leducChildDog from "@/assets/gallery/leduc-child-dog-clean-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Every price on this page is read from bk-config through pricing.ts.
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
const PAGE_TITLE = `House Cleaning Leduc from ${STANDARD_FROM} | Duty Cleaners`;
const META_DESCRIPTION = `Leduc house cleaning is priced by home size, from ${STANDARD_FROM} before GST for a one-bedroom condo, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote built from the same rows the price table uses: a
// three-bedroom bungalow on a standard clean, outside city limits.
const dollars = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
const EXAMPLE_TIER = STANDARD[2];
const EXAMPLE_TOTAL = dollars(EXAMPLE_TIER.price) + BK_PRICE_OVERRIDES[54].price + (travelFee("standard") ?? 0);
const EXAMPLE_PRICE = formatPrice(EXAMPLE_TOTAL);
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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Leduc" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Leduc" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Leduc" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after a renovation or a new build, priced by square footage.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Leduc" },
  { icon: PaintRoller, title: "Wall Washing", description: "Spot cleaning or a full wash of painted walls, booked together with a clean rather than on its own.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Leduc" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `A standard clean that repeats weekly, every two weeks or every 4 weeks, from ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. The first visit is at the one-time rate; the discount starts on the second.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Leduc" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `A Leduc clean is rated on the Edmonton listing, and that listing holds ${CITY_PROOF.edmonton.googleReviewCount} reviews.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "Read them on Google" } },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: `Tell us within ${POLICY.guaranteeWindowHours} hours if something was missed and the team comes back to re-clean it, at no charge.` },
];

const nearbyAreas = [
  "Beaumont", "Devon"
];

export default function Leduc() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in Leduc?",
      answer: `Yes. Leduc is 33 km south of Edmonton and outside its city limits, so a ${TRAVEL_FEE} travel fee is added to each home-cleaning booking here, while a post-construction clean carries its own fee of ${PC_TRAVEL_FEE}. That fee is the only difference from an Edmonton address, but it is not the only extra on the bill. The flat rate for the clean is the Edmonton rate, and the pet charge and the home-type surcharges are charged here as they are in the city: ${PET_FEE} on any visit to a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "What does a standard clean in Leduc cost?",
      answer: `A standard clean in Leduc runs from ${STANDARD_FROM} for a one-bedroom apartment or condo to ${STANDARD_TO} for five bedrooms or more, flat, before GST, the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. Adding the deep-clean package takes the range to ${DEEP_FROM} to ${DEEP_TO}. Book weekly and the discount is 20%; every two weeks it is 15% and every 4 weeks 10%. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "When does the team arrive in Leduc?",
      answer: `The team arrives in a window of ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]} rather than at an exact minute, and you do not have to be in the house for it: most customers leave a key, a lockbox code or smart-lock access. Same-day and next-day slots depend on the schedule; call ${CITY_PROOF.edmonton.phone} to ask what is open. If someone in the house works a rotation and sleeps in the afternoon, tell us which room and the order the house gets done in changes.`
    },
    {
      question: "Do you do move-out cleaning in Leduc?",
      answer: `Yes. A move-in or move-out clean in Leduc runs from ${MOVE_FROM} for a one-bedroom apartment or condo to ${MOVE_TO} for five or more bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. It includes inside the oven, fridge and microwave, and inside every cabinet, drawer and closet, without add-ons. We do not promise the deposit comes back; the landlord decides.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning in Leduc and Edmonton" }
    },
    {
      question: "Do you bring supplies to Leduc?",
      answer: `Yes. The team brings all supplies and equipment, from products and cloths to the vacuum and mop. Leduc's post-war bungalows and its newest subdivisions have different surfaces, painted softwood and original tile on one and sealed stone and engineered plank on the other, and the kit covers both. Leave the water and power on until the clean is done. Eco-friendly products are ${POLICY.ecoProductsFee} extra, and the way to get them is to ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "How long does a first clean in Leduc take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Leduc home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does it cost to cancel a Leduc clean?",
      answer: `A cancellation or change needs ${POLICY.cancellationNoticeHours} hours' notice, and inside that window the fee is ${POLICY.cancellationFee}. If the team arrives and cannot get in, the lockout charge is ${POLICY.lockoutFee}. When we have to move a booking ourselves, because a cleaner is ill, a vehicle will not start or the roads are unsafe, we say so as soon as we know, offer the earliest slot we have, and charge nothing if you cancel it.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Leduc, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-leduc", areaServed: "Leduc, AB" }))}</script>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Leduc, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Leduc
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                House cleaning in Leduc starts at {STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a {TRAVEL_FEE} travel fee and any house-type or pet surcharge, with all supplies brought. Leduc cleans are rated on the Edmonton listing: {RATING_CLAIM} from {CITY_PROOF.edmonton.googleReviewCount} reviews.
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
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
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
                src={leducChildDog}
                alt="A child and a dog playing together in a clean home"
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
                Leduc on the map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                The Edmonton office at 18615 71 Ave NW books every Leduc clean. It also books{" "}
                <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Beaumont</Link>{" "}
                and sends out the{" "}
                <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">Devon house cleaners</Link>.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75904.04936517384!2d-113.55117!3d53.26078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a018e7b3e3f5ab%3A0x60e2ac0e20373bfa!2sLeduc%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Leduc Service Area Map"
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
                Cleaning Services for Leduc Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep, move-out and wall washing are priced flat by home size, and post-construction by square footage. For the add-ons and every checklist, see{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>.
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
                A Leduc cleaning company that quotes before you book
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                The price is on screen before you confirm, nothing is charged until the clean is done, and the cleaner is rated by you afterwards.{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">Read the reviews</Link>{" "}
                before you book.
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
              Cleaning services in Leduc and the towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Leduc is one of nine communities outside Edmonton cleaned from the Edmonton office. The others include{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Sherwood Park</Link>,{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Spruce Grove</Link>,{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert house cleaners</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Morinville</Link>. All of them sit outside Edmonton city limits, so the {TRAVEL_FEE} travel fee Leduc pays applies there too.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="From the route"
        heading="A city built beside an airport"
        paragraphs={[
          "Leduc sits 33 km south of Edmonton and directly beside the international airport, and a good share of the households we clean work to a rotation rather than a weekday. Somebody may be asleep at two in the afternoon. Tell us which room and the order the house gets done in changes at no cost — it is the vacuum, not the schedule, that has to move.",
          "The city has grown hard since the 1947 oil strike that carries its name, so the housing runs from post-war bungalows near the old core to subdivisions finished in the last few years. Those two ends want opposite handling: painted softwood and original tile on one, sealed stone and engineered plank on the other.",
        ]}
      />

      <LocationPricing />

      {/* A worked quote, built from the same rows as the price table */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">A worked quote</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                A Leduc house cleaning quote, line by line
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Take a three-bedroom post-war bungalow near the old core, with two bathrooms and a half bath, on a one-time standard clean. The table price for that size is {EXAMPLE_TIER.price}, which assumes an apartment or condo. A bungalow adds {HOME_TYPE.bungalow} and a Leduc address adds the {TRAVEL_FEE} travel fee, so the quote comes to {EXAMPLE_PRICE} before 5% GST. A home with pets adds the compulsory {PET_FEE} pet charge on every visit.
                </p>
                <p>
                  The clean itself is priced the way our{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning across Edmonton</Link>{" "}
                  is, and the travel fee is the only line an Edmonton address would not have. More bathrooms than the table assumes, a townhouse or a two-storey house, and add-ons such as inside the oven, from {OVEN_FROM} before GST, all raise the figure. The time the clean takes does not. If a home needs substantially more work than described, such as heavy build-up, the team explains what it found and the options before continuing.
                </p>
                <p>
                  Every line shows on the instant price before you book. Nothing is charged at booking: the day before, a temporary hold confirms the card is valid, and the card is charged once the clean is complete.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Which clean to book */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Choosing</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                Standard, deep or move-out cleaning in Leduc
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  For a home that is kept up, the standard clean holds it, from {STANDARD_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, and it can go on a repeating schedule. The deep clean, from {DEEP_FROM} on the same terms, adds baseboards, doors, light switches, wall outlets and vent covers to the standard checklist, which makes it the better first visit for a home that has not had a professional clean.
                </p>
                <p>
                  For a handover, book{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">end of tenancy cleaning in Leduc</Link>{" "}
                  from {MOVE_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, once the last box has left. Under Alberta's Residential Tenancies Act the landlord completes a move-out inspection report with the tenant, and the security deposit must be returned within 10 days after the tenant moves out.
                </p>
                <p>
                  A suite listed as a short-term rental needs a turnover between guests rather than a scheduled clean, priced by the hour with a minimum of 3 hours for one cleaner or 2 hours for two. Leduc hosts can book it as{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>, with the travel fee added. Every tier and every add-on is on{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">the Edmonton price list by home size</Link>.
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Leduc house cleaning questions</h2>
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
              See your Leduc price before you book
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
