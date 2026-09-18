import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle2, CalendarCheck, Award, Home, Truck, Repeat, HardHat, PaintRoller, KeyRound, Building2, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  CITY_PROOF,
  BRANCH_ID,
  BRANCH_IDENTITY,
  BRANCH_PROFILES,
  ORG_ID,
  RED_DEER_PATH,
  RESPONSE_TIME_PROMISE,
  SUPPORT_EMAIL,
  hoursLineFor,
  hoursRowsFor,
  openingHoursShortFor,
  openingHoursSpecFor,
  schemaAddressFor,
} from "@/data/proof";
import { POLICY, PAYMENT_TERMS, ARRIVAL_WINDOWS } from "@/data/policy";
import {
  sitePriceRange,
  standardTierRows,
  deepCleanTierRows,
  moveInOutTierRows,
  formatPrice,
  addOnFromPrice,
  calculateQuote,
  homeTypeOptions,
  PRICING_TIERS,
  FREQUENCIES,
  HOURLY_RATE,
  startingPrice,
} from "@/data/pricing";
import { TRAVEL_FEE_KEY, travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { RED_DEER_LISTING } from "@/lib/google-listings";
import redDeerHero from "@/assets/generated/red-deer-cleaning-hero-v1.webp";
import redDeerHero640 from "@/assets/generated/red-deer-cleaning-hero-v1-640w.webp";
import redDeerHero960 from "@/assets/generated/red-deer-cleaning-hero-v1-960w.webp";
import redDeerHero1280 from "@/assets/generated/red-deer-cleaning-hero-v1-1280w.webp";

/**
 * The Red Deer branch page, at the preserved legacy URL /cleaning-services-red-deer/.
 *
 * Red Deer is a third branch with its own office and Google Business Profile
 * (owner, 2026-09-11), and that profile's Website button links this URL. Every
 * figure is derived: the NAP, hours and pin from proof.ts, prices from
 * bk-config through pricing.ts, terms from policy.ts. The price sheet is the
 * one Edmonton and Calgary use, with no travel fee inside Red Deer.
 *
 * What this page deliberately does NOT say:
 *  - no rating or review count. The Red Deer listing has no reviews yet, and
 *    RATING_CLAIM is the Edmonton and Calgary listings' figure;
 *  - no surrounding communities by name. An address outside Red Deer city
 *    limits pays the standard travel fee and books online (owner, 2026-09-11);
 *  - no march-out work (military housing is an Edmonton service). Post-
 *    construction, wall washing, Airbnb turnovers and office cleaning are
 *    offered in Red Deer (owner, 2026-09-11) on the other branches' terms;
 *  - no local colour. Nothing about Red Deer's homes or weather has been
 *    checked against an authoritative source, so none is written.
 */

const OFFICE = CITY_PROOF.reddeer;
const PAGE_URL = `https://dutycleaners.ca${RED_DEER_PATH}`;

const STANDARD = standardTierRows();
const DEEP = deepCleanTierRows();
const MOVE = moveInOutTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TOP = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = DEEP[0].price;
const MOVE_FROM = MOVE[0].price;
const MOVE_TOP = MOVE[MOVE.length - 1].price;
// Compulsory for a home with pets, on every visit.
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const HOME_TYPE = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
/** "20% off weekly, 15% off bi-weekly and 10% off every 4 weeks", from bk-config. */
const DISCOUNTED = [...FREQUENCIES].filter((f) => f.discount > 0).sort((a, b) => b.discount - a.discount);
const RECURRING = DISCOUNTED.map((f) => `${Math.round(f.discount * 100)}% off ${f.label.toLowerCase()}`);
const RECURRING_LINE = `${RECURRING.slice(0, -1).join(", ")} and ${RECURRING[RECURRING.length - 1]}`;

// A worked quote through calculateQuote, the funnel's own maths: a two-storey
// house with three bedrooms, two bathrooms and a half bath, standard clean,
// one visit, inside Red Deer (so no travel fee).
const EXAMPLE_SIZE = PRICING_TIERS[2];
const EXAMPLE_TIER = STANDARD[2];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "standard", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("standard")[0]?.id ?? null));
const EXAMPLE_BASE_TEXT = EXAMPLE_BASE === EXAMPLE_TIER.price ? EXAMPLE_BASE : `${EXAMPLE_BASE} (${EXAMPLE_TIER.price} in the table, which rounds to the dollar)`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(90));
const EXAMPLE_WITH_PET = formatPrice(exampleQuote(90, ["must-choose-if-you-have-pets"]));

// The standard out-of-town travel fee, for an address outside Red Deer city limits.
const TRAVEL_FEE = formatPrice(addOnFromPrice("standard", TRAVEL_FEE_KEY) ?? 0);
// Post-construction carries its own out-of-town travel fee.
const POST_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
const POST_FROM = formatPrice(startingPrice("post-construction"));
const WALL_SPOT = formatPrice(addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0);
const TURNOVER_RATE = formatPrice(HOURLY_RATE);

const paymentTerm = (pattern: RegExp) => PAYMENT_TERMS.find((term) => pattern.test(term)) ?? "";

const PAGE_TITLE = `House Cleaning Red Deer from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `House cleaning in Red Deer from ${STANDARD_FROM} before GST, with no travel fee inside the city. Book the Red Deer office online and pay after the clean.`;

const FULL_ADDRESS = `${OFFICE.streetAddress}, Red Deer, AB ${OFFICE.postalCode}`;
const HERO_SRCSET = [
  `${redDeerHero640} 640w`,
  `${redDeerHero960} 960w`,
  `${redDeerHero1280} 1280w`,
  `${redDeerHero} 1672w`,
].join(", ");

/**
 * The branch entity, the same shape as the Edmonton and Calgary hubs' nodes:
 * one @id, the Google listing's own name, the office's address, phone, pin and
 * hours, and the listing as sameAs. No aggregateRating: the listing has no
 * reviews, and self-serving review markup is not eligible anyway.
 */
const branchJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": BRANCH_ID.reddeer,
  name: BRANCH_IDENTITY.reddeer.name,
  url: BRANCH_IDENTITY.reddeer.url,
  parentOrganization: { "@id": ORG_ID },
  image: "https://dutycleaners.ca/og-image.jpg",
  logo: "https://dutycleaners.ca/logo.png",
  telephone: OFFICE.phoneE164,
  email: SUPPORT_EMAIL,
  address: schemaAddressFor("reddeer"),
  geo: { "@type": "GeoCoordinates", latitude: OFFICE.geo.latitude, longitude: OFFICE.geo.longitude },
  hasMap: RED_DEER_LISTING.url,
  sameAs: [...BRANCH_PROFILES.reddeer],
  areaServed: { "@type": "City", name: "Red Deer" },
  priceRange: sitePriceRange(),
  openingHours: openingHoursShortFor("reddeer"),
  openingHoursSpecification: openingHoursSpecFor("reddeer"),
};

// Every answer stands on its own: each ships inside the FAQPage markup, where
// nothing else on the page is visible.
const FAQS = [
  {
    question: "How much does house cleaning cost in Red Deer?",
    answer: `A standard clean of a one-bedroom apartment or condo in Red Deer is ${STANDARD_FROM} before GST, and a five-bedroom apartment or condo is ${STANDARD_TOP}. A deep clean starts at ${DEEP_FROM} and a move-in or move-out clean at ${MOVE_FROM} for the one-bedroom size. A house adds a home-type charge (${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house), and a home with pets adds ${PET_FEE} a visit. There is no travel fee inside Red Deer city limits, and every figure is before 5% GST.`,
  },
  {
    question: "Is there a travel fee for house cleaning in Red Deer?",
    answer: `No. Duty Cleaners has an office in Red Deer, at ${OFFICE.streetAddress}, so an address inside Red Deer city limits pays no travel fee. The price is the same price list the Edmonton and Calgary branches use. An address outside Red Deer city limits pays the ${TRAVEL_FEE} travel fee, shown on the quote before you book.`,
  },
  {
    question: "What are the Red Deer office's hours?",
    answer: `The Red Deer office is open ${hoursLineFor("reddeer")}. A clean is booked into an arrival window rather than an exact time: ${ARRIVAL_WINDOWS.join(", ")}.`,
  },
  {
    question: "How far ahead do I need to book a clean in Red Deer?",
    answer: `Online bookings need at least 24 hours' notice. For anything sooner, call the Red Deer office at ${OFFICE.phone} and ask what the schedule has open; same-day and next-day slots depend on the schedule. After a quote request, the office texts within ${RESPONSE_TIME_PROMISE} to confirm the time.`,
  },
  {
    question: "Do I need to be home for a clean in Red Deer?",
    answer: "No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it finishes. The team brings all supplies and equipment. Running water is required, and vacuuming may not be possible without electricity.",
  },
  {
    question: "Do you clean homes with pets in Red Deer?",
    answer: `Yes. A home with pets is charged ${PET_FEE} per visit, before GST, and the charge shows on the quote before you book. Tell the team where the pets will be during the clean. Litter boxes and animal waste are outside what the team handles.`,
  },
  {
    question: "What happens if something is missed on a Red Deer clean?",
    answer: `Tell us within ${POLICY.guaranteeWindowHours} hours of the clean and the team comes back to re-clean what was missed, at no charge. The window runs from the clean. Photos help but are not required.`,
  },
  {
    question: "When is my card charged for a Red Deer clean?",
    answer: `${paymentTerm(/Nothing is charged when you book/)} ${paymentTerm(/temporary hold/)} ${paymentTerm(/charged once the clean is complete/)} ${paymentTerm(/We accept/)}`,
  },
  {
    question: "What does it cost to cancel a Red Deer booking?",
    answer: `Cancelling or changing a booking needs ${POLICY.cancellationNoticeHours} hours' notice; inside that, the fee is ${POLICY.cancellationFee}. If the team reaches the home and cannot get in, the lockout charge is ${POLICY.lockoutFee}. There is no contract: book one clean or many.`,
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

const SERVICES = [
  {
    icon: Home,
    title: "Standard house cleaning",
    text: `A standard clean dusts every room, vacuums and mops the floors, and cleans the kitchen and bathrooms, from ${STANDARD_FROM} for a one-bedroom apartment or condo.`,
    to: "/edmonton/regular-cleaning/",
    anchor: "Standard house cleaning checklist",
  },
  {
    icon: Sparkles,
    title: "Deep cleaning",
    text: `A deep clean is the standard checklist plus baseboards, doors, light switches, wall outlets and vent covers, from ${DEEP_FROM}.`,
    to: "/edmonton/deep-cleaning/",
    anchor: "Deep cleaning package in full",
  },
  {
    icon: Truck,
    title: "Move-in and move-out cleaning",
    text: `A move-in or move-out clean adds the inside of the oven, fridge and microwave, and of every cabinet, drawer and closet, from ${MOVE_FROM}.`,
    to: "/move-out-cleaning-edmonton/",
    anchor: "Move-out cleaning checklist",
  },
  {
    icon: Repeat,
    title: "Recurring cleaning",
    text: `A recurring clean is the standard clean on a schedule, at ${RECURRING_LINE} from the second visit.`,
    to: "/edmonton/recurring-cleaning/",
    anchor: "Recurring cleaning schedules",
  },
  {
    icon: HardHat,
    title: "Post-construction cleaning",
    text: `The fine dust a build or renovation leaves, cleared once the trades are out, priced by square footage from ${POST_FROM} before GST.`,
    to: "/post-construction-cleaning/",
    anchor: "Post-construction cleaning in full",
  },
  {
    icon: PaintRoller,
    title: "Wall washing",
    text: `Wall washing is added to a clean, not booked on its own, from ${WALL_SPOT} for spot cleaning, before GST.`,
    to: "/wall-washing-wall-cleaning/",
    anchor: "Wall washing prices and limits",
  },
  {
    icon: KeyRound,
    title: "Airbnb turnovers",
    text: `Turnovers between guests are priced by the hour, at ${TURNOVER_RATE} per cleaner-hour before GST, after a call from the Red Deer office.`,
    to: "/contact-us/#topic=airbnb&city=reddeer",
    anchor: "Request a Red Deer turnover quote",
  },
  {
    icon: Building2,
    title: "Office cleaning",
    text: "Office cleaning is scoped at a walkthrough and confirmed in a written quote before any work is booked.",
    to: "/contact-us/#topic=office&city=reddeer",
    anchor: "Request a Red Deer office cleaning quote",
  },
];

export default function RedDeer() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={PAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <link rel="preload" as="image" href={redDeerHero} imageSrcSet={HERO_SRCSET} imageSizes="100vw" />
        <script type="application/ld+json">{JSON.stringify(branchJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      <div className="min-h-screen">
        <Navigation branch="reddeer" />
        <main id="main-content" tabIndex={-1}>
          <div className="container mx-auto px-4 pt-4">
            <Breadcrumbs />
          </div>

          {/* Hero */}
          <section className="relative overflow-hidden bg-brand-navy py-20 md:py-24">
            <img
              src={redDeerHero}
              srcSet={HERO_SRCSET}
              sizes="100vw"
              alt="Professional cleaner wiping a dining table in a Red Deer home"
              width={1672}
              height={941}
              loading="eager"
              decoding="async"
              {...{ fetchpriority: "high" } as Record<string, string>}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/95 via-brand-navy/82 to-brand-navy/30" />
            <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="container relative z-10 mx-auto px-4">
              <div className="mx-auto max-w-4xl text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-5 py-2 backdrop-blur-sm">
                  <span className="dc-icon dc-icon-map-pin h-4 w-4 text-accent" aria-hidden="true" />
                  <span className="text-sm font-medium text-white/90">The Red Deer office, {OFFICE.streetAddress}</span>
                </div>
                <h1 className="mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
                  House cleaning in Red Deer
                </h1>
                <p className="mb-10 max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
                  {`Duty Cleaners has a Red Deer office with its own phone line, ${OFFICE.phone}. A standard clean of a one-bedroom apartment or condo in Red Deer is ${STANDARD_FROM} before GST, on the same price list as Edmonton and Calgary, and there is no travel fee inside Red Deer city limits. A house or a pet adds a set charge, shown on the quote before you book.`}
                </p>
                <div className="mb-10 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
                  <Button size="lg" className="bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 px-8 text-base text-white hover:bg-white/10" asChild>
                    <a href={OFFICE.phoneLink}>
                      <span className="dc-icon dc-icon-phone mr-2 h-5 w-5" aria-hidden="true" />
                      Call {OFFICE.phone}
                    </a>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                  {[
                    { icon: CheckCircle2, text: "Pay after your clean" },
                    { icon: Award, text: `${POLICY.guaranteeWindowHours}-hour re-clean guarantee` },
                    { icon: CalendarCheck, text: "No contracts" },
                  ].map((badge) => (
                    <div key={badge.text} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
                      <badge.icon className="h-4 w-4 text-accent" aria-hidden="true" />
                      <span className="text-sm text-white/90">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* The office */}
          <section className="bg-background py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2">
                <div>
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">The branch</span>
                  <h2 className="mb-6 mt-2 text-3xl font-bold text-foreground">The Red Deer office</h2>
                  <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
                    <p>
                      Red Deer cleans are booked through the Red Deer branch, which has its own office at{" "}
                      {FULL_ADDRESS}, its own phone number and its own hours. Call it on{" "}
                      <a href={OFFICE.phoneLink} className="font-semibold text-primary underline underline-offset-2">
                        {OFFICE.phone}
                      </a>{" "}
                      to ask about a date, a home that does not fit the size table, or anything the instant price does not cover.
                    </p>
                    <div className="rounded-xl border border-border bg-muted/30 p-5">
                      <div className="mb-3 flex items-center gap-2 font-semibold text-foreground">
                        <span className="dc-icon dc-icon-clock h-5 w-5 text-primary" aria-hidden="true" />
                        Red Deer office hours
                      </div>
                      <dl className="space-y-1 text-base">
                        {hoursRowsFor("reddeer").map(([days, time]) => (
                          <div key={days} className="flex justify-between gap-4">
                            <dt>{days}</dt>
                            <dd className="font-medium text-foreground">{time}</dd>
                          </div>
                        ))}
                      </dl>
                      <p className="mt-3 text-sm">
                        The Red Deer hours differ from the Edmonton and Calgary offices', which also open on Sunday.
                      </p>
                    </div>
                    {/* Rendered only while proof.ts records no review count for the
                        Red Deer listing, so it cannot outlive the first review. */}
                    {OFFICE.googleReviewCount === null && (
                    <p>
                      The Red Deer listing on Google is new and has no reviews yet. You can find it as{" "}
                      <a href={RED_DEER_LISTING.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">
                        the Red Deer office on Google Maps
                      </a>
                      . Reviews from customers of the Edmonton and Calgary branches are on the{" "}
                      <Link to="/reviews/" className="font-semibold text-primary underline underline-offset-2">
                        Duty Cleaners reviews page
                      </Link>
                      .
                    </p>
                    )}
                  </div>
                </div>
                <div className="overflow-hidden rounded-2xl shadow-xl">
                  <GoogleMapEmbed query={`${RED_DEER_LISTING.name}, ${FULL_ADDRESS}`} title="Map of the Duty Cleaners Red Deer office" />
                </div>
              </div>
            </div>
          </section>

          {/* Prices */}
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-4xl">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Prices</span>
                <h2 className="mb-4 mt-2 text-3xl font-bold text-foreground">House cleaning prices in Red Deer</h2>
                <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                  Red Deer is priced on the same sheet as the Edmonton and Calgary branches, flat by home size. Each figure is for an
                  apartment or condo, before 5% GST, and inside Red Deer city limits there is no travel fee. Six and seven bedrooms
                  cost more than the five-bedroom row, and the instant price shows the exact figure for them.
                </p>
                <div className="overflow-x-auto rounded-2xl border border-border bg-white">
                  <table className="w-full min-w-[520px] text-sm">
                    <caption className="sr-only">Red Deer house cleaning prices by home size, before GST</caption>
                    <thead>
                      <tr className="bg-brand-navy text-white">
                        <th scope="col" className="px-5 py-3 text-left font-semibold">Home size</th>
                        <th scope="col" className="px-5 py-3 text-left font-semibold">Standard clean</th>
                        <th scope="col" className="px-5 py-3 text-left font-semibold">Deep clean</th>
                        <th scope="col" className="px-5 py-3 text-left font-semibold">Move-in or move-out</th>
                      </tr>
                    </thead>
                    <tbody>
                      {STANDARD.map((row, i) => (
                        <tr key={row.beds} className="border-t border-border/60">
                          <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">{row.beds}</th>
                          <td className="px-5 py-3">{row.price}</td>
                          <td className="px-5 py-3">{DEEP[i].price}</td>
                          <td className="px-5 py-3">{MOVE[i].price}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    Two charges can apply on top of the table in Red Deer, exactly as they do in Edmonton and Calgary. A house adds a
                    home-type charge: {HOME_TYPE.bungalow} for a bungalow or a basement suite, {HOME_TYPE.townhouse} for a townhouse and{" "}
                    {HOME_TYPE.twoStorey} for a two-storey house. A home with pets adds {PET_FEE} a visit. Both show on the quote before
                    you book, and recurring schedules take {RECURRING_LINE} from the second visit.
                  </p>
                  <p>
                    Take a two-storey house in Red Deer with three bedrooms, two bathrooms and a half bath, booked for one standard
                    clean. The rate for that size is {EXAMPLE_BASE_TEXT}, the two-storey charge adds {HOME_TYPE.twoStorey}, and with no
                    travel fee the quote comes to {EXAMPLE_PRICE} before GST. With a dog or a cat at home, the pet charge takes it to{" "}
                    {EXAMPLE_WITH_PET}. Every tier and add-on is on{" "}
                    <Link to="/pricing/" className="text-primary underline underline-offset-2">
                      the full house cleaning price list
                    </Link>
                    , which Red Deer shares.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section className="bg-background py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-5xl">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Services</span>
                <h2 className="mb-4 mt-2 text-3xl font-bold text-foreground">Cleaning services from the Red Deer office</h2>
                <p className="mb-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">
                  The Red Deer office books the same services as the other branches, on the same checklists and prices. Home
                  cleaning and post-construction are priced instantly online; Airbnb turnovers and office cleaning are quoted by
                  the office. The service pages linked below are written for Edmonton; their prices are the Red Deer prices too.
                  Questions go to the Red Deer office at{" "}
                  <a href={OFFICE.phoneLink} className="text-primary underline underline-offset-2">{OFFICE.phone}</a>.
                </p>
                <div className="grid gap-6 md:grid-cols-2">
                  {SERVICES.map((s) => (
                    <div key={s.title} className="rounded-xl border border-border bg-white p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <s.icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-foreground">{s.title}</h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
                      <Link to={s.to} className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-primary hover:text-accent">
                        {s.anchor}
                      </Link>
                    </div>
                  ))}
                </div>
                <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
                  A move-in or move-out clean in Red Deer runs from {MOVE_FROM} to {MOVE_TOP} by home size, before GST. Book it for
                  after the movers have been, so the team can reach inside every cabinet and closet. Interior windows are an add-on on
                  a move-out, not part of it. See{" "}
                  <Link to="/whats-included/" className="text-primary underline underline-offset-2">
                    what each clean includes, room by room
                  </Link>{" "}
                  before you choose.
                </p>
              </div>
            </div>
          </section>

          {/* Booking */}
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <span className="text-sm font-semibold uppercase tracking-wider text-primary">Booking</span>
                <h2 className="mb-6 mt-2 text-3xl font-bold text-foreground">How booking a Red Deer clean works</h2>
                <div className="space-y-4 text-lg leading-relaxed text-muted-foreground">
                  <p>
                    The instant price asks for the home's size and type, whether there are pets, and the add-ons you want, then shows
                    the figure before you choose a date. A Red Deer postal code carries no travel fee, and the booking goes through
                    the same online booking page as an Edmonton or Calgary clean. Online bookings need at least 24 hours' notice; for
                    anything sooner, call the Red Deer office and ask what is open.
                  </p>
                  <p>
                    Nothing is charged at booking. The day before the clean, a temporary hold is placed on the card to confirm it is
                    valid; it can look like a charge in a banking app, but no money moves until the clean is complete. If something
                    was missed, tell us within {POLICY.guaranteeWindowHours} hours of the clean and the team comes back to re-clean it
                    at no charge. The full terms are on{" "}
                    <Link to="/satisfaction-guarantee/" className="text-primary underline underline-offset-2">
                      the re-clean guarantee page
                    </Link>
                    , and{" "}
                    <Link to="/prepare/" className="text-primary underline underline-offset-2">
                      how to get a home ready for a clean
                    </Link>{" "}
                    is one short page.
                  </p>
                  <p>
                    The Red Deer page covers addresses inside Red Deer city limits. An address outside the city books the same
                    way and pays the {TRAVEL_FEE} travel fee on a home clean or {POST_TRAVEL_FEE} on post-construction, shown on
                    the quote. For anything else, call the Red Deer office at{" "}
                    {OFFICE.phone}, or write through{" "}
                    <Link to="/contact-us/#city=reddeer" className="text-primary underline underline-offset-2">
                      the contact form for the Red Deer office
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className="bg-background py-20">
            <div className="container mx-auto px-4">
              <div className="mx-auto max-w-3xl">
                <div className="mb-12 text-center">
                  <span className="text-sm font-semibold uppercase tracking-wider text-primary">FAQ</span>
                  <h2 className="mb-4 mt-2 text-3xl font-bold text-foreground md:text-4xl">Red Deer house cleaning questions</h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, index) => (
                    <AccordionItem key={faq.question} value={`item-${index}`}>
                      <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="relative overflow-hidden bg-brand-navy py-20">
            <div className="container relative z-10 mx-auto px-4 text-center">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Book house cleaning in Red Deer</h2>
              <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <Button size="lg" className="bg-accent px-8 text-base text-accent-foreground hover:bg-accent/90" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 px-8 text-base text-white hover:bg-white/10" asChild>
                  <a href={OFFICE.phoneLink}>
                    <span className="dc-icon dc-icon-phone mr-2 h-5 w-5" aria-hidden="true" />
                    Call the Red Deer office
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
