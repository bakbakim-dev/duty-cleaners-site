import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
// Was st-albert-landmark.webp: a generated "St. Albert Farmers' Market"
// whose sign reads "FARMS MAKT / SIT. ALBERT" under a dozen US flags.
import stAlbertHome from "@/assets/gallery/family-clean-home-edmonton.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Every figure below is read from bk-config through pricing.ts; the page never
// types a price of its own.
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
// Post-construction sits on its own, higher travel-fee row in bk-config, so the
// FAQ cannot say "one fee whatever you book" the way it used to.
const PC_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
// The two charges that are added for you rather than chosen. They apply inside
// the city too, which is why the fee is the only *difference* and not the only extra.
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const HOME_TYPE = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
const EDMONTON_LISTING = GOOGLE_LISTINGS.edmonton;
const PAGE_TITLE = `House Cleaning St. Albert from ${STANDARD_FROM} | Duty Cleaners`;
const META_DESCRIPTION = `House cleaners in St. Albert from ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a ${TRAVEL_FEE} travel fee and any pet or home-type charge.`;

// A worked quote built from the same rows the price table uses: a
// three-bedroom two-storey house on a one-time standard clean, outside
// Edmonton city limits, first without and then with a pet.
const dollars = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
const cents = (value: number) => Math.round(value * 100) / 100;
const EXAMPLE_TIER = STANDARD[2];
const EXAMPLE_TOTAL = cents(dollars(EXAMPLE_TIER.price) + BK_PRICE_OVERRIDES[90].price + (travelFee("standard") ?? 0));
const EXAMPLE_PRICE = formatPrice(EXAMPLE_TOTAL);
const EXAMPLE_WITH_PET = formatPrice(cents(EXAMPLE_TOTAL + (addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0)));

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in St. Albert" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in St. Albert" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in St. Albert" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after a renovation or a new build, priced by square footage.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in St. Albert" },
  { icon: PaintRoller, title: "Wall Washing", description: "Spot cleaning or a full wash of painted walls, booked together with a clean rather than on its own.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in St. Albert" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The standard clean on a repeating schedule, from ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. The first visit is the one-time rate; after that it is 20% off weekly, 15% bi-weekly, 10% every four weeks.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning for St. Albert homes" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton listing, which is the listing a St. Albert booking is rated on.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "See the listing on Google" } },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: "Tell us within 24 hours if something was missed and the team comes back to re-clean it, at no charge." },
];

export default function StAlbert() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in St. Albert?",
      answer: `Yes. St. Albert is outside Edmonton city limits, so a ${TRAVEL_FEE} travel fee goes on a standard, deep or move-out booking here; a post-construction clean carries its own higher fee of ${PC_TRAVEL_FEE}. That fee is the only difference from an Edmonton address. The flat rate for the clean is the Edmonton rate, and the pet charge and the home-type surcharges apply here exactly as they do in the city: ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "What does a standard clean in St. Albert cost?",
      answer: `A standard clean in St. Albert is ${STANDARD_FROM} for a one-bedroom, one-bathroom apartment or condo, rising by size to ${STANDARD_TO} for five or more bedrooms, before 5% GST. The ${TRAVEL_FEE} travel fee is added to every St. Albert home-cleaning booking, and the pet charge and the house-type surcharge apply where they fit the home. A deep clean is ${DEEP_FROM} to ${DEEP_TO} on the same terms. On a recurring schedule the discount is 20% weekly, 15% every two weeks and 10% every four weeks. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "How soon can a cleaner come to St. Albert?",
      answer: `Same-day and next-day slots depend on the schedule, so call the Edmonton office at ${CITY_PROOF.edmonton.phone} and ask what is free. Office hours are Monday to Saturday 8:00 AM to 8:00 PM and Sunday 9:00 AM to 3:00 PM. Each booking gets an arrival window of ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]} rather than an exact minute.`
    },
    {
      question: "Do you do move-out cleaning in St. Albert?",
      answer: `Yes. A move-in or move-out clean runs ${MOVE_FROM} to ${MOVE_TO} before GST by home size, plus the ${TRAVEL_FEE} travel fee for a St. Albert address and the pet or house-type charge where it applies. The move-out checklist covers the inside of the oven, fridge and microwave, and the inside of every cabinet, drawer and closet.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning in Edmonton and St. Albert" }
    },
    {
      question: "Do you bring supplies?",
      answer: `Yes. The team brings all supplies and equipment, so there is nothing to leave out. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}. Running water is required, and vacuuming may not be possible without electricity, so leave both on until the clean is done.`
    },
    {
      question: "Do I need to be home while my St. Albert house is cleaned?",
      answer: `No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves. If the team arrives and cannot get in, the lockout charge is ${POLICY.lockoutFee}.`
    },
    {
      question: "How long does a first clean in St. Albert take?",
      answer: `We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within 24 hours and the team comes back to your St. Albert home to re-clean what was missed, at no charge. Photos help but are not required.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-st-albert/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-st-albert/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - St. Albert, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-st-albert", areaServed: "St. Albert, AB" }))}</script>
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
                <span className="text-white/90 text-sm font-medium">Serving St. Albert, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in St. Albert
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                A standard clean in St. Albert starts at {STANDARD_FROM} before GST for a one-bedroom apartment or condo, plus the {TRAVEL_FEE} travel fee, with a house-type surcharge and the pet charge added where they apply. Rated {RATING_CLAIM} across {CITY_PROOF.edmonton.googleReviewCount} reviews on the Edmonton listing, and the card is charged only once the clean is complete.
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
              <img width={1024} height={1024}
                src={stAlbertHome}
                alt="A family in a living room with clean floors and clear surfaces"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover border-2 border-white/10"
              loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
            </div>
          </div>
        </div>
      </section>

      {/* A worked quote. Replaces the brochure "About the Neighbourhood" and
          "Around St. Albert" sections, whose landmarks and history were not
          in the local note or the FACTS block. */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">A worked quote</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                What house cleaning in St. Albert costs, worked through
              </h2>
              <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                <p>
                  Take a three-bedroom two-storey house on one of St. Albert's older streets, with two bathrooms and a half bath, booked for a one-time standard clean. The table price for that size is {EXAMPLE_TIER.price}, which is the rate for an apartment or condo. A two-storey house adds {HOME_TYPE.twoStorey}, and the {TRAVEL_FEE} travel fee applies because St. Albert is outside Edmonton city limits, so the clean comes to {EXAMPLE_PRICE} before 5% GST. If the home has pets, the {PET_FEE} pet charge is compulsory and the figure becomes {EXAMPLE_WITH_PET}, still before GST.
                </p>
                <p>
                  More bathrooms, a larger home type and add-ons such as the inside of the oven, the inside of the fridge or interior windows all raise a St. Albert quote, and eco-friendly products add {POLICY.ecoProductsFee} when you ask for them at booking. How long the clean takes does not change it. If a home needs substantially more work than described, such as heavy build-up or far more glass than stated, the team explains what it found and the options before continuing.
                </p>
                <p>
                  The Edmonton branch cleans St. Albert homes to the same checklist and flat rates as its{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Edmonton</Link>, and the travel fee is the only difference. Every size and add-on is set out under{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">house cleaning prices for St. Albert and Edmonton</Link>. Hosts letting a suite in St. Albert book turnovers through{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>, which is priced by the hour instead.
                </p>
              </div>
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
                Cleaning Services for St. Albert Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep and move-out cleans are priced flat by home size, post-construction by square footage, and wall washing is booked together with a clean. The list of{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>{" "}
                covers the add-ons too.
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
                St. Albert house cleaners you rate after every visit
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Every rating comes from a customer after a clean, and the ratings decide who keeps cleaning for us. You can{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">read the reviews</Link>{" "}
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
              Cleaning services in St. Albert and the towns around it
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              The Edmonton branch cleans the other communities outside the city on the same terms as St. Albert, among them{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">Morinville house cleaners</Link>,{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Sherwood Park</Link>,{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Spruce Grove</Link>{" "}
              and a{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">Leduc cleaning company</Link>{" "}
              run from the same office. All five sit outside Edmonton city limits, so the {TRAVEL_FEE} travel fee applies in each.
            </p>
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Neighbourhood notes"
        heading="Elm seeds on the old streets"
        paragraphs={[
          "St. Albert took New Town status on 1 January 1957, and the council plan behind it laid out four neighbourhoods, Braeside, Mission and Sturgeon Heights among them. Those streets carry much of the city's mature canopy today. Elms are a common boulevard tree on those older streets, and every spring they drop papery samaras that mat into window screens and sliding-door channels, then ride indoors on shoes for weeks.",
          "Riverside, one of the city's newest communities, sits on the west side by Big Lake, its boulevard trees years from filling in. Those homes trade screen debris for unshaded south and west glass that collects street dust with no canopy to slow it.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

      {/* Move-out cleaning in the town, which the content prompt asks every
          town page to cover. */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Moving out</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                Move-out cleaning in St. Albert
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A move-in or move-out clean in St. Albert costs {MOVE_FROM} for a one-bedroom apartment or condo, up to {MOVE_TO} for five or more bedrooms, before 5% GST. The {TRAVEL_FEE} travel fee is added, along with the house-type surcharge or the pet charge where either applies. On top of the standard checklist, the clean covers the inside of the oven, fridge and microwave, and the inside of every cabinet, drawer and closet.
                </p>
                <p>
                  For a tenant, Alberta's Residential Tenancies Act sets out two parts of the handover: the landlord completes a move-out inspection report with the tenant, and the security deposit has to be returned within 10 days after the tenant moves out. We do not promise the deposit comes back; that decision is the landlord's.
                </p>
                <p>
                  Some things sit outside every clean, a move-out included: outdoor work such as exterior windows, garages and patios, carpet steam cleaning, lifting anything over 25 lb, and removing window screens. That last exclusion matters in spring on the older streets, where elm seed mats into the screens, because the team leaves them in place. The{" "}
                  <Link to="/whats-included/" className="text-primary underline underline-offset-2 font-medium">cleaning checklist for St. Albert homes</Link>{" "}
                  lists what each clean does cover.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Find Us</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                St. Albert Service Area
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                St. Albert is one of nine communities outside Edmonton city limits that the Edmonton branch cleans, all served from its office at 18615 71 Ave NW.
              </p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38000.0!2d-113.62884!3d53.63324!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a035b1a1a1a1a1%3A0x1a1a1a1a1a1a1a1a!2sSt.%20Albert%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="St. Albert Service Area Map"
              />
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
              Book house cleaning in St. Albert
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
