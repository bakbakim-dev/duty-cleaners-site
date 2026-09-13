import { CITY_PROOF } from "@/data/proof";
import { RATING_CLAIM } from "@/data/proof";
import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods";
import { canonicalUrlForPath, canonicalForPath } from "@/data/legacy-urls";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, addOnFromPrice, formatPrice, FREQUENCIES } from "@/data/pricing";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { TRAVEL_FEE_KEY } from "@/data/addon-table";
import { getListing } from "@/lib/google-listings";
import Navigation from "@/components/Navigation";
import heroFamilyBedroom from "@/assets/hero-family-bedroom.webp";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link, useLocation } from "react-router-dom";
import AreaScopeNote from "@/components/AreaScopeNote";
import { quoteHrefFor } from "@/lib/quote-link";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import LocalMarketNote from "@/components/LocalMarketNote";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight,
  Phone, CheckCircle2, Star, Shield, Award,
  Home, Sparkles, Truck, SprayCan, Bath,
  Leaf, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";

interface LocationPageProps {
  city: string;
  /** Current municipal label without changing the preserved route or area key. */
  heroTitle?: string;
  region: "edmonton" | "calgary";
  title: string;
  /** Hero blurb. Prose, so it runs long — NOT the meta description. */
  description: string;
  /**
   * The meta description, which must fit inside 160 characters.
   *
   * `description` used to serve both jobs, and it is written as hero prose —
   * so the twelve pages using this template shipped meta descriptions of 199
   * to 403 characters, every one of them truncated in search results. Falls
   * back to `description` when absent so nothing regresses silently, but
   * location-meta.test.ts fails any page that leaves it that way.
   */
  seoDescription?: string;
  phone: string;
  phoneLink: string;
  /**
   * Cleaning-relevant local content — the thing that stops this page being a
   * copy of the other twelve.
   *
   * Measured as novel 8-grams against every sibling location page with the
   * place name normalised away, these thirteen pages had a median of 37 and a
   * floor of 14 (Laurel). The 140 hand-written location pages median 116-158.
   * The gap was entirely this: the template varied by name and one blurb.
   *
   * Write what changes the JOB, not what a tourism board would write. Housing
   * era and type is the strongest axis — a 1950s bungalow with original trim
   * and a 2015 open-plan build shed dust differently and take different
   * amounts of time — followed by what the location does to a home: ring-road
   * grit, lake and wetland humidity, LRT-adjacent traffic, active construction
   * next door.
   */
  localNote?: { heading: string; paragraphs: string[] };
  /**
   * Set for places that are their OWN municipality rather than a neighbourhood
   * of the region's main city. Black Diamond is half of the Town of Diamond
   * Valley, outside Calgary, so "Black Diamond, Calgary, AB" is geographically false.
   */
  isOwnMunicipality?: boolean;
}


/**
 * Prices shown on every location page, derived once from bk-config.
 * published-prices.test.ts forbids hand-typed dollar literals on pricing
 * surfaces; these come from the same tier rows the pricing tables use.
 */
const span = (rows: { price: string }[]) => `${rows[0].price} to ${rows[rows.length - 1].price}`;
const LOCATION_PRICES = {
  standard: span(standardTierRows()),
  deep: span(deepCleanTierRows()),
  moveInOut: span(moveInOutTierRows()),
};
/** Mandatory outside the two metros, applied by postal code at booking. */
const TRAVEL_FEE = (() => {
  const v = addOnFromPrice("standard", TRAVEL_FEE_KEY);
  return v === null ? null : formatPrice(v);
})();

/**
 * The other two compulsory extras, read the same way /pricing/ reads them.
 *
 * The travel fee was the only one this page named, which made the flat-rate
 * sentence read as though it were the whole story. It is not: the home-type
 * surcharge is chosen on the booking form and the pet charge is BookingKoala
 * extra 122, "Must choose if you have pets", billed on every visit. Quoting a
 * headline rate and disclosing one of the three is the same drip-pricing
 * pattern the travel-fee line exists to avoid, so all three ship together.
 * Keyed by BK variable id, as EdmontonPricing does, so a price change in BK
 * moves this sentence with it.
 */
const HOME_TYPE_EXTRA = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);

/**
 * Recurring discounts, read from bk-config by BookingKoala frequency id so the
 * card and the price paragraph can never disagree with the booking form. The
 * 10% tier is "Every 4 Weeks" there — 13 visits a year, not 12 — which is why
 * nothing here says "monthly".
 */
const pctOff = (bkId: number) =>
  `${Math.round((FREQUENCIES.find((f) => f.bkId === bkId)?.discount ?? 0) * 100)}%`;
const OFF_WEEKLY = pctOff(3);
const OFF_BIWEEKLY = pctOff(4);
const OFF_FOUR_WEEKLY = pctOff(2);
/** The cheapest published standard clean, the same figure /pricing/ leads with. */
const RECURRING_FROM = standardTierRows()[0].price;

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
  /** Omitted for the two room-level cards, which have no page of their own. */
  to?: string;
  linkText?: string;
}) => (
  <div
    className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
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
        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
      </Link>
    )}
  </div>
);

const WhyUsCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: React.ReactNode }) => (
  <div
    className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);


/*
 * There used to be a copy-spinner here: `variantOf` hashed the place name to
 * 0-3 and `pickV` picked one of four paraphrases for nine slots across all 166
 * location pages, five of them inside FAQPage JSON-LD. The variants said the
 * same thing in different words, so no reader was better off for which one they
 * got — the rotation existed to make the pages look unlike each other to a
 * crawler, which is what Google's scaled-content-abuse policy describes. Only
 * variant 0 even interpolated the place name, so three quarters of the "local"
 * copy was not local.
 *
 * These pages carry researched local notes; that is what makes them worth
 * having. Repeating one clear service description across sibling pages is
 * ordinary and fine. Do not reintroduce a spinner.
 */

const services = (place: string, region: "edmonton" | "calgary", ownMunicipality: boolean) => {
  const city = region === "edmonton" ? "edmonton" : "calgary";
  const moveOut = region === "edmonton" ? "/move-out-cleaning-edmonton" : "/move-out-cleaning-calgary";
  const postCon =
    region === "edmonton" ? "/post-construction-cleaning" : "/post-construction-cleaning-calgary";
  const wallWashing =
    region === "edmonton" ? "/wall-washing-wall-cleaning" : "/wall-washing-wall-cleaning-calgary";
  return [
  { icon: Home, title: "Standard House Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: canonicalForPath(`/${city}/regular-cleaning`), linkText: `Standard cleaning in ${place}` },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: canonicalForPath(`/${city}/deep-cleaning`), linkText: `Deep cleaning in ${place}` },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: canonicalForPath(moveOut), linkText: `Move-out cleaning in ${place}` },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after a renovation or a new build, priced by square footage.", to: canonicalForPath(postCon), linkText: `Post-construction cleaning in ${place}` },
  // Wall washing has a real page in both cities and was the only service on the
  // menu with no card here, so the 166 location pages sent it exactly ONE
  // in-body link between them against 88-91 for every linked sibling. Nav and
  // footer reached it, but none of the geo-qualified body support that carries
  // the local signal for the rest of the menu.
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film washed off painted walls, booked together with a clean.", to: canonicalForPath(wallWashing), linkText: `Wall washing in ${place}` },
  // Bathroom sanitization gave up its slot: it is a task inside a standard or
  // deep clean rather than a bookable service, it is described on
  // /whats-included/, and the grid holds exactly six (2x3 and 3x2 both divide
  // it; a seventh card would sit alone on a row). The 150 location pages that
  // inline their own copy of this array were changed the same way.
  //
  // The sixth card used to be "Kitchen Deep Clean" — the only card with no
  // price and no link, describing a service pricing.ts does not sell. Appliance
  // interiors are add-ons on a standard clean and included on a move-out clean;
  // there is no kitchen-only package to book. Recurring cleaning is a real
  // bookable frequency with its own page in both cities, and it was the only
  // service on the menu with no card here.
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The standard checklist on a schedule. The first clean is charged at the one-time rate, from ${RECURRING_FROM} for a one-bedroom, one-bathroom apartment or condo before GST${ownMunicipality && TRAVEL_FEE !== null ? `, the ${TRAVEL_FEE} travel fee` : ""} and any pet or home-type charge. From the second clean on, weekly takes ${OFF_WEEKLY} off, every two weeks ${OFF_BIWEEKLY} and every four weeks ${OFF_FOUR_WEEKLY}.`, to: canonicalForPath(`/${city}/recurring-cleaning`), linkText: `Recurring cleaning in ${place}` },
  ];
};

const whyUsItems = (region: "edmonton" | "calgary") => [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  // This card used to add the two branches together and say "287 reviews across
  // Edmonton and Calgary", unlinked, while the LocalBusiness node on the same
  // page pointed at ONE listing showing 236 or 51. Google never reports the sum,
  // so no reader could check it anywhere. Each page now states its own branch's
  // count and links the listing it came from.
  {
    icon: Star,
    title: RATING_CLAIM,
    description: (
      <>
        {CITY_PROOF[region].googleReviewCount} reviews on our{" "}
        <a
          href={getListing(CITY_PROOF[region].city).reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline underline-offset-2 hover:text-accent"
        >
          {CITY_PROOF[region].city} Google listing
        </a>
        , which is where that rating is read from.
      </>
    ),
  },
  // "and the planet" is an environmental-benefit claim. Since the June 2024
  // Competition Act amendments those require substantiation on an internationally
  // recognised methodology, and private applications to the Tribunal have been
  // live since June 2025. Nothing on the site or in the repo substantiates it.
  // The card title had already been softened from an eco claim to "High Quality
  // Cleaning Supplies" — this finishes that edit, which was left half-done.
  // The card now states only SERVICE_TERMS (T5 in the content prompt): the team
  // brings supplies, and it needs running water and power.
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: "Tell us within 24 hours if something was missed and the team comes back to re-clean it, at no charge." },
];

export default function LocationPageTemplate({
  city,
  heroTitle,
  region,
  title,
  description,
  seoDescription,
  phone,
  phoneLink,
  localNote,
  isOwnMunicipality = false,
}: LocationPageProps) {
  // Falls back so an un-migrated page still renders; the test enforces the rest.
  const metaDescription = seoDescription ?? description;


  const { pathname } = useLocation();
  const regionLabel = region === "edmonton" ? "Edmonton" : "Calgary";
  // One resolved URL for canonical, og:url and JSON-LD. Using the raw pathname
  // here made the schema url and og:url disagree with the canonical on every
  // preserved legacy route (e.g. /locations/black-diamond vs its real canonical
  // /cleaning-services-black-diamond/).
  const canonicalUrl = canonicalUrlForPath(pathname);
  const jsonLd = buildLocationSchema({
    // A neighbourhood is genuinely "Allendale Edmonton". A separate municipality
    // is not: "Leduc Edmonton" or "St. Albert Edmonton" names a place that does
    // not exist, and reads as though the town were part of the city. The
    // isOwnMunicipality flag already distinguishes the two for areaServed below;
    // the entity name needs it just as much.
    name: isOwnMunicipality ? `Duty Cleaners - ${city}, AB` : `Duty Cleaners - ${city} ${regionLabel}`,
    city: region,
    url: canonicalUrl,
    description,
    areaServed: isOwnMunicipality ? `${city}, AB` : `${city}, ${regionLabel}, AB`,
  });

  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: `What cleaning services does Duty Cleaners offer in ${city}?`,
      answer: `Duty Cleaners books all of these for homes in ${city}:\n\n• Standard & Deep Cleaning Packages\n• Recurring Cleaning: weekly, every two weeks or every four weeks\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing, booked together with a clean`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes. A recurring schedule of the standard clean in ${city} saves:\n\n• Every week: ${OFF_WEEKLY} off\n• Every two weeks: ${OFF_BIWEEKLY} off\n• Every four weeks: ${OFF_FOUR_WEEKLY} off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `A deep clean layers these onto the standard visit:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within 24 hours and the team comes back to your ${city} home to re-clean what was missed, at no charge. Photos help but are not required.`
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
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <Navigation city={region} />
      <main id="main-content" tabIndex={-1}>
        <AreaScopeNote />
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">
        <img
          src={heroFamilyBedroom}
          alt="A freshly cleaned bedroom"
          width={1280}
          height={853}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              {/* Same distinction as the schema name: "Serving Leduc, Edmonton"
                  misstates a separate town as part of the city. */}
              <span className="text-white/90 text-sm font-medium">
                Serving {city}, {isOwnMunicipality ? "AB" : regionLabel}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {heroTitle ?? `Professional House Cleaning in ${city}`}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href={phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />{phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                <a href={quoteHrefFor(pathname)}>See My Instant Price</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: CheckCircle2, text: "Pay After Your Clean" },
                // The same badges the hand-written neighbourhood pages carry. The
                // content prompt retired the same-day badge (no same-day promise)
                // and the 100% satisfaction wording: the guarantee is a 24-hour
                // re-clean, POLICY in data/policy.ts.
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
        </div>
      </section>

      {/* What it costs here.
          No location page stated a price -- 145 of them -- so a visitor who
          searched "house cleaning in <neighbourhood>" and landed here could not
          find a number, and neither could an assistant answering on their
          behalf. Every figure is derived from bk-config, so this cannot drift
          from what BookingKoala charges.

          The travel-fee line is not optional politeness: the fee is applied
          automatically by postal code, which makes it MANDATORY for these
          customers. Advertising a price to them without disclosing it is the
          pattern the Competition Act calls drip pricing, so the two have to
          appear together. Only own-municipality pages (the satellite towns)
          get it -- inside Edmonton and Calgary no fee applies. */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">What it costs</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Cleaning prices in {city}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                A standard clean in {city} runs {LOCATION_PRICES.standard} depending on the size of your
                home, a deep clean {LOCATION_PRICES.deep}, and a move-in or move-out clean{" "}
                {LOCATION_PRICES.moveInOut}. Those are flat rates in Canadian dollars before 5% GST, and
                they do not go up because a clean took longer than expected. Those figures are for an
                apartment or condo: a bungalow or
                basement suite adds {HOME_TYPE_EXTRA.bungalow}, a townhouse {HOME_TYPE_EXTRA.townhouse} and
                a two-storey house {HOME_TYPE_EXTRA.twoStorey}, and a home with pets {PET_FEE} a visit.
                {/* "outside Edmonton and Calgary city limits" named the wrong
                    city on half the pages that printed it — a Calgary-side town
                    was being told about Edmonton's boundary. The fee is charged
                    against the branch this page belongs to, so that is the
                    boundary to name. */}
                {isOwnMunicipality && TRAVEL_FEE !== null
                  ? ` Because ${city} is outside ${regionLabel} city limits, a ${TRAVEL_FEE} travel fee is added to bookings here.`
                  : ""}
                {" Every one of them shows on the quote before you book."}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {/* These thirteen pages stated the recurring tiers as plain text,
                    called the 10% tier "monthly" (it is Every 4 Weeks in
                    BookingKoala, 13 visits a year), and offered no body route to
                    a price list at all. Both links are what the 139 hand-built
                    location pages already carry through <LocationPricing>. */}
                On a{" "}
                <Link
                  to={canonicalForPath(`/${region}/recurring-cleaning`)}
                  className="text-primary underline underline-offset-2"
                >
                  recurring schedule in {city}
                </Link>{" "}
                the discount is {OFF_WEEKLY} weekly, {OFF_BIWEEKLY} bi-weekly and {OFF_FOUR_WEEKLY} every
                four weeks from the second clean. Your first clean is charged at the standard one-time
                rate. The{" "}
                <Link
                  to={canonicalForPath(region === "calgary" ? "/calgary/pricing" : "/pricing")}
                  className="text-primary underline underline-offset-2"
                >
                  full {regionLabel} price list
                </Link>{" "}
                breaks every tier down by bedroom count and lists the add-ons.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      {localNote && (
        <LocalMarketNote
          eyebrow={`Homes in ${city}`}
          heading={localNote.heading}
          paragraphs={localNote.paragraphs}
          accent={region === "calgary" ? "calgary" : "primary"}
        />
      )}

      {/* A "Things To Do" section and its thingsToDo prop were removed: no page
          passed it, and the content prompt keeps tourism off these pages. */}

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Cleaning Services for {city} Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Each of these six services is priced flat by home size, except post-construction cleaning, which is priced by square footage.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services(city, region, isOwnMunicipality).map((s, i) => (
                <ServiceCard key={i} {...s} />
              ))}
            </div>
          </AnimatedSection>
          <AnimatedSection>
            {/* Up-link to the city hub.
                Both hubs receive 8 editorial in-body links from the whole
                site — the "217 vs 13" gap a naive count shows is breadcrumbs,
                which sit inside <main>. The difference that matters is what
                each hub IS: Edmonton's is the homepage, already fed by every
                nav, footer and breadcrumb on 209 pages, while Calgary's is a
                subpage that ranked 24.8 for "cleaning services calgary"
                against Edmonton's 6.3 on the same query and comparable
                impressions.

                That reasoning is why this sentence was Calgary-only, and it
                went one step too far. Nav, footer and breadcrumb links are
                site furniture: they carry no anchor text worth having and sit
                outside the editorial body every link audit measures. The
                result was 76 of 76 Calgary pages linking their hub in-body and
                1 of 90 Edmonton-side pages linking theirs — the homepage,
                which is the page that has to hold "house cleaning edmonton".
                Both sides now carry the mirror of the same sentence.

                isOwnMunicipality keeps it true: Airdrie, Okotoks, St. Albert
                and the rest are separate towns, not city neighbourhoods. */}
            <p className="mt-10 text-center text-muted-foreground">
              {isOwnMunicipality
                ? `We clean ${city} and the wider ${regionLabel} area — see `
                : `${city} is one of the ${regionLabel} neighbourhoods we clean — see `}
              <Link
                to={region === "calgary" ? canonicalForPath("/cleaning-services-calgary") : "/"}
                className="text-primary underline underline-offset-2"
              >
                house cleaning services in {regionLabel}
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
                Why {city} Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Duty Cleaners has cleaned homes in Alberta since 2017. Homes in {city} are cleaned by the {regionLabel} branch.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              {whyUsItems(region).map((item, i) => (
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
              House Cleaning in {city} and the Wider {regionLabel} Area
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              The {regionLabel} branch cleans homes across {city}. Every neighbourhood and community it serves is on the service-area list.
            </p>
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            {/* The commercial cross-link that sat here was removed: the content
                prompt keeps commercial work off the house-cleaning pages. */}
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
              Ready to Book a Clean in {city}?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              See your flat rate before you book. Nothing is charged until the clean is done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href={phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />Call {phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                <a href={quoteHrefFor(pathname)}>
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
