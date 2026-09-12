import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { addOnFromPrice } from "@/data/pricing";
import { TRAVEL_FEE_KEY, travelFee } from "@/data/addon-table";
import { POLICY, PRICING_TERMS } from "@/data/policy";
import { useLocation } from "react-router-dom";
import { quoteHrefFor } from "@/lib/quote-link";
import LocalMarketNote from "@/components/LocalMarketNote";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { buildPricingSchema } from "@/lib/pricing-schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import PricingTierCard from "@/components/pricing/PricingTierCard";
import RecurringDiscountCard from "@/components/pricing/RecurringDiscountCard";
import PricingOptionCard from "@/components/pricing/PricingOptionCard";
import PricingFormula from "@/components/PricingFormula";
import {
  calculateQuote,
  deepCleanTierRows,
  formatPrice,
  FREQUENCIES,
  homeTypeOptions,
  HOME_HOURLY_RATE,
  moveInOutTierRows,
  PRICING_TIERS,
  standardTierRows,
  startingPrice,
} from "@/data/pricing";
import { addOnTableRows } from "@/data/addon-table";

import heroPricingCleaner from "@/assets/hero-edmonton-pricing-cleaner.webp";
import {
  CheckCircle2, Phone, Calculator, Sparkles, Shield, Clock,
  Star, BadgeCheck, Home, CalendarClock,
  HelpCircle, Award, Users, Info, MapPin, Receipt
} from "lucide-react";
import { CITY_PROOF, COMPANY, RATING_CLAIM } from "@/data/proof";

/* Derived from bk-config — never hand-typed, so the table can never
   drift from what BookingKoala actually charges. */
/** BookingKoala extra 122, "Must choose if you have pets" — charged on every
 *  visit, so a "no hidden fees" answer has to name it. */
/**
 * Home-type surcharges, read from the verified BookingKoala Form 1 capture by
 * variable id so a price change in BK moves this sentence with it.
 */
const HOME_TYPE_EXTRA = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};

const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
/* Derived for the same reason PET_FEE is: this sentence is the page's own
   answer to "are there any hidden fees", and a hand-typed figure inside it is
   the one most likely to be read as authoritative and the least likely to be
   noticed when BookingKoala moves. */
const TRAVEL_FEE = formatPrice(addOnFromPrice("standard", TRAVEL_FEE_KEY) ?? 0);
/** Post-construction carries its own, larger travel fee (content prompt P11). */
const POST_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
/* The add-on that answer gives as its example. It is lifted out of the page on
   its own, so it states a price rather than pointing at the add-on table. */
const OVEN_FEE = formatPrice(addOnFromPrice("standard", "inside-oven") ?? 0);

const standardPricing = standardTierRows();

/**
 * Derived from bk-config: a deep clean is a Standard clean plus the Deep
 * Cleaning package for that home size — never hand-typed.
 */
const deepPricing = deepCleanTierRows();

const moveInOutPricing = moveInOutTierRows();

/**
 * Post-construction is the one service on this site that is not priced by
 * bedroom count, and this page never mentioned it. The floor of its
 * square-footage ladder, read from bk-config like every other figure here.
 */
const POST_CONSTRUCTION_FROM = formatPrice(startingPrice("post-construction"));

/**
 * The "from" figure for the title, the meta and the flat-rate card. It is the
 * first row of the standard table, so the three can never disagree with the
 * table the way "from $154.99" beside a "$155" card did.
 */
const FROM_PRICE = standardPricing[0].price;

/** "$155 to $305" — derived, so the prose summary can never contradict the tables. */
const priceSpan = (rows: { price: string }[]) =>
  `${rows[0].price} to ${rows[rows.length - 1].price}`;

/* ---- Worked quotes: every figure comes out of the same calculator the
   booking form uses, rounded to the dollar the way the tier cards are. ---- */
const whole = (value: number) => formatPrice(Math.round(value));
const homeTypeId = (pattern: RegExp) =>
  homeTypeOptions("standard").find((o) => pattern.test(o.label))?.id ?? null;
const APARTMENT = homeTypeOptions("standard")[0]?.id ?? null;
const BUNGALOW = homeTypeId(/bungalow/i);
const BI_WEEKLY = FREQUENCIES.find((f) => f.discount === 0.15)?.id ?? "one-time";
const quote = (input: { homeType: number | null; bedrooms: number; bathrooms: number; halfBaths: number; addOns?: string[]; frequency?: string }) =>
  calculateQuote({ service: "standard", addOns: [], frequency: "one-time", ...input });

/** A two-bedroom condo, two bathrooms: the second card, booked bi-weekly. */
const condo = quote({ homeType: APARTMENT, bedrooms: 2, bathrooms: 2, halfBaths: 0, frequency: BI_WEEKLY });
/** A three-bedroom bungalow with the bathrooms the third card assumes, plus a dog. */
const bungalowTier = PRICING_TIERS[2];
const bungalowBase = quote({ homeType: APARTMENT, bedrooms: bungalowTier.beds, bathrooms: bungalowTier.bathrooms, halfBaths: bungalowTier.halfBaths });
const bungalow = quote({ homeType: BUNGALOW, bedrooms: bungalowTier.beds, bathrooms: bungalowTier.bathrooms, halfBaths: bungalowTier.halfBaths, addOns: ["must-choose-if-you-have-pets"], frequency: BI_WEEKLY });

/** The bathroom counts each tier card assumes, e.g. "3 Bedroom: 2 full and 1 half". */
const tierAssumptions = PRICING_TIERS.map(
  (t) => `${t.label}: ${t.bathrooms} full${t.halfBaths ? ` and ${t.halfBaths} half` : ""}`,
).join("; ");

/** The two policy lines that say how a quote can and cannot change. */
const FIXED_RATE_TERM = PRICING_TERMS.find((t) => /flat rate does not change/.test(t)) ?? "";
const MORE_WORK_TERM = PRICING_TERMS.find((t) => /substantially more work/.test(t)) ?? "";

const standardIncludes = [
  "Dust & clean all surfaces",
  "Vacuum carpets",
  "Clean floors",
  "Clean mirrors",
  "Clean window ledges/sills",
  "Clean chairs and tables",
  "Kitchen: sink, stovetop, inside & outside the microwave, outside of all other appliances, countertops",
  "Bathrooms: scrub toilets, showers, tubs, sinks",
  "Living areas: dust furniture, vacuum/mop floors",
];

const standardAddOns = [
  "Baseboards, doors, light switches, wall outlets, and the outside of vent covers",
  "Inside appliances",
  "Inside cabinets",
  "Interior windows",
  "Wall washing",
  "Balcony or garage sweep, mostly in summer",
  "Decluttering and organising, by the hour",
  "Basement",
];

/* Derived from bk-config — see src/data/addon-table.ts. */
/* Every row is shown, the balcony / garage sweep included: the owner
   confirmed on 2026-09-11 that it is a real add-on, offered mostly in summer,
   and the note under the table says so. */
const addOnServices = addOnTableRows("edmonton");

/** Add-on rows that have a service page of their own. */
const ADD_ON_PAGE: Record<string, string> = {
  "Top-to-bottom wall washing": "/wall-washing-wall-cleaning/",
  "Spot cleaning of walls": "/wall-washing-wall-cleaning/",
};

/** Towns outside Edmonton city limits, where the travel fee applies. */
const EDMONTON_TOWNS: { anchor: string; to: string }[] = [
  { anchor: "house cleaning in St. Albert", to: "/cleaning-services-st-albert/" },
  { anchor: "Sherwood Park house cleaners", to: "/cleaning-services-sherwood-park/" },
  { anchor: "cleaning services in Spruce Grove", to: "/cleaning-services-spruce-grove/" },
  { anchor: "Leduc cleaning company", to: "/cleaning-services-leduc/" },
  { anchor: "house cleaning in Beaumont", to: "/cleaning-services-beaumont/" },
  { anchor: "Morinville house cleaners", to: "/cleaning-services-morinville/" },
  { anchor: "cleaning services in Devon", to: "/cleaning-services-devon/" },
  { anchor: "house cleaning in Fort Saskatchewan", to: "/cleaning-services-fort-saskatchewan/" },
  { anchor: "Stony Plain house cleaners", to: "/cleaning-services-stony-plain/" },
];

/* The six "what changes the price" cards used to sit here and again in the
   section below the travel fee: home type, bedrooms and bathrooms, service,
   add-ons and frequency are the five steps of the builder near the top of the
   page, stated a second time in smaller type. The builder stays; the cards are
   gone. The sixth card was the only one carrying a fact the builder does not —
   flat rate against hourly — and that survives as a sentence. */

const faqItems = [
  { value: "trust", question: "Can I trust my house cleaners?", answer: "Every cleaner is reference-checked before their first job, and every visit is rated by the customer afterwards. Those ratings decide who we send back." },
  { value: "included", question: "What is included in maid service in Edmonton?", answer: "A standard clean covers dusting all surfaces, vacuuming carpets, mopping floors, mirrors, window sills, the kitchen (sink, stovetop, countertops, inside and outside the microwave, the outside of the other appliances) and the bathrooms (toilets, showers, tubs, sinks). Inside the fridge, the oven and the cabinets are add-ons on a standard clean and included on a move-in/out clean. Baseboards come with the Deep Cleaning package." },
  { value: "duration", question: "How long does a typical house cleaning take?", answer: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes. Deep cleaning and move-in/out services cover more tasks than a standard clean, so they take longer." },
  { value: "supplies", question: "Are there discounts if I provide my own cleaning supplies?", answer: `No. We bring all cleaning supplies and equipment, and the rate already assumes that. Optional alternative products are ${POLICY.ecoProductsFee} before GST: ${POLICY.ecoProductsHowToRequest}.` },
  { value: "recurring", question: "Do you offer recurring service discounts?", answer: "Yes: 20% off weekly, 15% off bi-weekly and 10% off every 4 weeks. Every 4 weeks comes to 13 visits a year rather than 12. The discount starts from your second visit; the first is at the one-time rate. If you start with a deep clean, the deep-cleaning package is charged once on that first visit and is not discounted, and the visits after it are standard cleans at the discounted rate." },
  { value: "pricing-types", question: "What's the difference between Hourly Cleaning and flat-rate pricing?", answer: `A flat rate is fixed by home size and service type, and it does not change if the clean takes longer than expected. Hourly Cleaning (from ${formatPrice(HOME_HOURLY_RATE)} per hour per cleaner, before GST) is for partial or unusual jobs: a few rooms, a one-off task list, or a home that does not fit a size tier. The minimum hourly booking is 3 hours for 1 cleaner or 2 hours for 2 cleaners.` },
  // A FAQ with this title has to name the charges customers call hidden. Both
  // are published on /terms/ and both read from POLICY, so this answer can
  // never drift away from the terms it summarises.
  // It is also lifted on its own from the FAQPage markup, so it names the
  // home-type charges and an add-on's price instead of "the table above".
  { value: "hidden-fees", question: "Are there any hidden fees?", answer: `No. The quote shows every charge added to the flat rate for your home size before you book, each before 5% GST: a bungalow or basement suite adds ${HOME_TYPE_EXTRA.bungalow}, a townhouse ${HOME_TYPE_EXTRA.townhouse} and a two-storey house ${HOME_TYPE_EXTRA.twoStorey} to the apartment or condo rate, a home with pets adds ${PET_FEE} a visit, and an address outside Edmonton city limits adds a ${TRAVEL_FEE} travel fee to a home clean or ${POST_TRAVEL_FEE} to a post-construction clean, with no trip fee inside the city. Cancelling or rescheduling inside ${POLICY.cancellationNoticeHours} hours is ${POLICY.cancellationFee}, and if the team arrives and cannot get in, the visit is charged at ${POLICY.lockoutFee}. Add-ons such as the inside of the oven at ${OVEN_FEE} before GST are optional, each a tick-box on the booking form with its price beside it, except optional alternative products at ${POLICY.ecoProductsFee}, which are not on the form, so ${POLICY.ecoProductsHowToRequest}. The flat rate does not change because a clean took longer; it changes only if the home needs substantially more work than it was described as needing, and the team explains what they found before continuing.` },
  { value: "satisfaction", question: "What if I'm not satisfied with the cleaning?", answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean the areas that were missed at no additional cost. Photos help but are not required. The commitment is the return visit; it is not a money-back guarantee, though you can call the Edmonton office at (780) 913-6565 to talk about anything else.` },
];

export default function EdmontonPricing() {
  const { pathname } = useLocation();
  const { ref: heroRef } = useScrollAnimation();
  const { ref: tabsRef } = useScrollAnimation();
  const { ref: addOnsRef } = useScrollAnimation();
  const { ref: recurringRef } = useScrollAnimation();
  const { ref: examplesRef } = useScrollAnimation();
  const { ref: travelRef } = useScrollAnimation();
  const { ref: factorsRef } = useScrollAnimation();
  const { ref: optionsRef } = useScrollAnimation();
  const { ref: whyRef } = useScrollAnimation();
  const { ref: faqRef } = useScrollAnimation();
  const { ref: ctaRef } = useScrollAnimation();

  const title = `Edmonton House Cleaning Prices from ${FROM_PRICE} | Duty Cleaners`;
  const description = `Edmonton house cleaning prices by home size, from ${FROM_PRICE} for a one-bedroom apartment before GST, with deep, move-out, add-on and recurring rates.`;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://dutycleaners.ca/pricing/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/pricing/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify(buildPricingSchema({ city: "edmonton", standard: standardPricing, deep: deepPricing, moveInOut: moveInOutPricing }))}
        </script>
        {/* Mirrors the FAQ rendered on this page. Generated from the same
            `faqItems` array, so the markup can never drift from the copy. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          })}
        </script>
      </Helmet>

      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="bg-brand-navy py-20 md:py-28 relative overflow-hidden">
        <img
          src={heroPricingCleaner}
          alt="Professional cleaner wiping kitchen counter in a bright modern home"
          width={1280}
          height={725}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/85 via-brand-navy/75 to-brand-navy/90 pointer-events-none" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Calculator className="w-10 h-10 text-accent" />
            </div>

            <h1 className="display-serif text-3xl md:text-5xl font-bold mb-6 leading-tight text-balance text-white">
              Edmonton house cleaning prices,{" "}
              <span className="text-accent">by home size</span>
            </h1>
            {/* Plain-text summary of all three services, first. The tables
                further down live in tab panels, and an inactive panel is
                display:none, so a reader that extracts rendered text saw
                Standard pricing only. Every figure is derived, never typed. */}
            <p className="text-xl md:text-2xl text-white/85 mb-3 leading-relaxed">
              Prices are flat rates by bedroom count. A standard clean is {priceSpan(standardPricing)}, a deep clean{" "}
              {priceSpan(deepPricing)}, and a move-in or move-out clean {priceSpan(moveInOutPricing)}, all before 5% GST
              and before any pet charge, home-type surcharge or travel fee outside city limits.
              You see the figure before you book and pay after the clean.
            </p>
            <p className="text-lg text-white/90 mb-10">
              {/* Was "a bungalow adds $15 and a townhouse or two-storey house adds
                  $50" — two home types under one number, over by $10 on the
                  townhouse and under by $5 on the two-storey. Read from the
                  verified Form 1 table so BK and the page cannot diverge. */}
              Those figures are for an apartment or condo. A bungalow or basement suite adds{" "}
              {HOME_TYPE_EXTRA.bungalow}, a townhouse {HOME_TYPE_EXTRA.townhouse}, and a two-storey house{" "}
              {HOME_TYPE_EXTRA.twoStorey}. The quote asks which you have and
              shows the difference before you book.
            </p>
            <p className="text-lg text-white/90 mb-10">
              The rate does not go up because a clean took longer. It changes only when a home needs substantially
              more work than it was described as needing, and the team says so before continuing. Partial jobs and
              homes that fit no size tier are quoted hourly from {formatPrice(HOME_HOURLY_RATE)} per hour per cleaner
              before GST, with a minimum of 3 hours for one cleaner or 2 hours for two.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              {[
                { icon: Star, label: `${RATING_CLAIM} across ${CITY_PROOF.edmonton.googleReviewCount} Edmonton reviews` },
                { icon: Shield, label: "Pay after your clean" },
                { icon: BadgeCheck, label: "No Hidden Fees" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <badge.icon className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                <a href="#quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  See My Instant Price
                </a>
              </Button>
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 h-auto font-semibold transition-all duration-300" asChild>
                <a href="tel:7809136565">
                  <Phone className="w-5 h-5 mr-2" />
                  (780) 913-6565
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PricingFormula city="Edmonton" />

      <LocalMarketNote
        eyebrow="Edmonton pricing, in plain terms"
        heading="Choosing the service for your Edmonton home"
        paragraphs={[
          "Our prices are identical in Edmonton and Calgary — there is no city premium and no trip fee within either city. What varies is which service a given home needs. Furnace season in Edmonton runs from October into April, and a house sealed up that long cycles dust faster. A home booked in early spring after that season may need the deep clean rather than the standard one, and it is cheaper to hear that up front than to book the wrong tier.",
        ]}
      />

      {/* Service Pricing Tabs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={tabsRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our rates</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">House cleaning rates in Edmonton, by home size</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Pick the service. Each card is the flat rate for that bedroom count, before GST.
              </p>
            </div>

            {/* How a quote can and cannot change: the two lines from policy.ts,
                verbatim, so this box and /terms/ cannot drift apart. It used to
                say "starting estimates, not the final amount", which contradicted
                the banner further down. */}
            <div className="mb-6 bg-accent/5 border border-accent/20 rounded-xl p-5 md:p-6 flex items-start gap-3 md:gap-4 max-w-3xl mx-auto">
              <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <span className="font-semibold text-foreground">{FIXED_RATE_TERM}</span>{" "}
                  {MORE_WORK_TERM}
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
              How to read the cards: each one assumes an apartment or condo with a set number of bathrooms
              ({tierAssumptions}), and the form prices your actual count. The{" "}
              <Link to="/edmonton/regular-cleaning/" className="text-accent underline underline-offset-4 hover:text-accent/80">Edmonton standard cleaning</Link>{" "}
              rate is the base. A{" "}
              <Link to="/edmonton/deep-cleaning/" className="text-accent underline underline-offset-4 hover:text-accent/80">deep clean in Edmonton</Link>{" "}
              is that base plus the Deep Cleaning package for the size, shown under each figure. A{" "}
              <Link to="/move-out-cleaning-edmonton/" className="text-accent underline underline-offset-4 hover:text-accent/80">move-out clean in Edmonton</Link>{" "}
              is its own rate, with the inside of the fridge, oven and cabinets already in it.
            </p>

            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-10 h-auto bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="standard" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Standard Cleaning</TabsTrigger>
                <TabsTrigger value="deep" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Deep Cleaning</TabsTrigger>
                <TabsTrigger value="moveinout" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Move In/Out</TabsTrigger>
              </TabsList>

              <TabsContent value="standard">
                <p className="text-center text-muted-foreground mb-8">The regular clean for a lived-in home</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
                  {standardPricing.map((item) => (
                    <PricingTierCard key={item.beds} beds={item.beds} price={item.price} />
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="bg-brand-navy p-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-lg font-bold text-white">What to Expect</h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {standardIncludes.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden">
                    <div className="bg-brand-navy p-5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="text-lg font-bold text-white">Available as Add-ons</h3>
                    </div>
                    <div className="p-6">
                      <ul className="space-y-3">
                        {standardAddOns.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="deep">
                <p className="text-center text-muted-foreground mb-8">The standard clean plus the Deep Cleaning package for the size, baseboards included</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {deepPricing.map((item) => (
                    <PricingTierCard
                      key={item.beds}
                      beds={item.beds}
                      price={item.price}
                      note={`${item.standard} standard + ${item.packagePrice} Deep Cleaning package`}
                      ctaHref="/?intent=deep#quote"
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="moveinout">
                <p className="text-center text-muted-foreground mb-8">For an empty home, with the inside of the appliances and cabinets included</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {moveInOutPricing.map((item) => (
                    <PricingTierCard key={item.beds} beds={item.beds} price={item.price} />
                  ))}
                </div>
                <p className="text-center text-sm text-muted-foreground mt-8 max-w-2xl mx-auto">
                  An empty home the trades have just left is the one clean these bedroom tiers do not
                  price.{" "}
                  <Link to="/post-construction-cleaning/" className="text-accent underline underline-offset-4 hover:text-accent/80">
                    Post-construction cleaning in Edmonton
                  </Link>{" "}
                  goes by square footage instead, because drywall dust settles on every surface regardless of
                  how many bedrooms there are. It starts at {POST_CONSTRUCTION_FROM} for under 1,000 sq ft before
                  GST, with a {POST_TRAVEL_FEE} post-construction travel fee outside city limits.
                </p>
              </TabsContent>
            </Tabs>

          </div>
        </div>
      </section>

      {/* Additional Services Table */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4" ref={addOnsRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Add-ons</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Add-on prices, per visit</h2>
              <p className="text-lg text-muted-foreground">The jobs a standard clean leaves out, each with its own line</p>
            </div>

            <div
              className="overflow-x-auto rounded-xl shadow-sm border border-border/50"
              tabIndex={0}
              role="region"
              aria-label="Additional services pricing table"
            >
              <table className="w-full bg-card">
                <thead>
                  <tr className="bg-brand-navy">
                    <th className="px-6 py-4 text-left text-white font-semibold">Service</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Standard &amp; Deep Clean</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Move In/Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {addOnServices.map((item, index) => (
                    <tr key={item.service} className={index % 2 === 1 ? "bg-muted/20" : ""}>
                      <td className="px-6 py-4 text-sm text-foreground">
                        {ADD_ON_PAGE[item.service] ? (
                          <Link to={ADD_ON_PAGE[item.service]} className="text-accent underline underline-offset-4 hover:text-accent/80">{item.service}</Link>
                        ) : (
                          item.service
                        )}
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-muted-foreground">{item.standard}</td>
                      <td className={`px-6 py-4 text-center text-sm ${item.moveInOut === "Included" ? "text-accent font-semibold" : "text-muted-foreground"}`}>{item.moveInOut}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-8 text-center">
              Everything a standard clean already covers, room by room, is on the{" "}
              <Link to="/whats-included/" className="text-accent underline underline-offset-4 hover:text-accent/80">what's-included checklist</Link>.
              The table lists the tasks a standard clean does not cover. Its pet line and, outside city
              limits, its travel-fee line are not optional.
            </p>

            {/* An "Office Cleaning" card sat here until 10 September 2026. The
                content prompt keeps commercial work off the house-cleaning
                pages, so it went, and the space now says what no add-on buys. */}
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mt-6 text-center">
              The balcony / garage sweep is a sweep of the floor only, and it is available mostly in
              summer, when the weather allows. Some jobs stay outside every Edmonton clean, with or
              without add-ons: exterior windows, cleaning a garage or patio beyond that sweep, carpet
              steam cleaning, furnace and duct cleaning, and lifting anything over 25 lb. Decluttering and organising are a separate hourly add-on, not part of the flat rate.
            </p>
          </div>
        </div>
      </section>

      {/* Recurring Service Discounts */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={recurringRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Recurring</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">Recurring rates: weekly, bi-weekly or every 4 weeks</h2>
              <p className="text-lg text-white/90">The discount comes off from the second visit. The first clean is at the one-time rate.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <RecurringDiscountCard percentage="20%" title="Weekly Cleaning" />
              <RecurringDiscountCard percentage="15%" title="Bi-weekly Cleaning" />
              <RecurringDiscountCard percentage="10%" title="Every 4 Weeks" />
            </div>

            <p className="text-center text-sm text-white/80 max-w-2xl mx-auto mb-6">
              {/* Was "apply to Standard and Deep cleaning services only". In
                  bk-config six of seven Deep Cleaning rows are
                  exempt_extra_from_freq_disc AND first-only, so the deep portion
                  neither recurs nor discounts. */}
              <strong className="text-white">Note:</strong> The discount applies to the standard clean on every
              visit after your first. A deep clean is charged once, on the first visit, at the one-time rate.
              Initial cleaning and move-out services are not eligible for recurring discounts.
            </p>
            <p className="text-center text-sm text-white/80 max-w-2xl mx-auto">
              What a year of each frequency costs, and who books which, is on the{" "}
              <Link to="/edmonton/recurring-cleaning/" className="text-accent underline underline-offset-4 hover:text-white">recurring cleaning in Edmonton</Link>{" "}
              page. Hosts turning a unit over between guests are priced separately under{" "}
              <Link to="/edmonton/airbnb-cleaning/" className="text-accent underline underline-offset-4 hover:text-white">Airbnb cleaning in Edmonton</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Worked examples */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={examplesRef}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Worked examples</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Illustrative Edmonton quotes, worked through</h2>
              <p className="text-lg text-muted-foreground">The same arithmetic the booking form does, with the figures shown.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Receipt className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">A two-bedroom condo in Garneau</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Two bedrooms, two bathrooms, no pets: that is the two-bedroom rate, {standardPricing[1].price} for a
                  standard clean before GST. Booked bi-weekly, the second visit and every one after it is{" "}
                  {whole(condo.ongoing ?? condo.firstClean)}. If the first visit is a deep clean instead, that visit
                  is {deepPricing[1].price} ({deepPricing[1].standard} standard plus the {deepPricing[1].packagePrice}{" "}
                  Deep Cleaning package), and the visits after it drop to the discounted standard rate.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Receipt className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">A three-bedroom bungalow in Old Strathcona</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Three bedrooms, two full bathrooms and a half bath, one dog. The size and bathrooms set{" "}
                  {whole(bungalowBase.firstClean)}, the bungalow adds {HOME_TYPE_EXTRA.bungalow}, and the pet charge
                  is {PET_FEE} a visit: {whole(bungalow.firstClean)} before GST. On a bi-weekly plan the visits
                  after the first are {whole(bungalow.ongoing ?? bungalow.firstClean)}. Add the inside of the oven
                  for the first visit and it goes on as its own line, {OVEN_FEE} before GST. GST at 5% then goes
                  on the total.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel fee and the towns it covers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4" ref={travelRef}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Outside city limits</span>
            </div>
            <h2 className="display-serif text-2xl md:text-3xl font-bold mb-6 text-balance">Outside Edmonton: the travel fee and the towns it covers</h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Inside Edmonton city limits there is no trip fee. An address outside them carries a {TRAVEL_FEE} travel
              fee per home-cleaning visit, or {POST_TRAVEL_FEE} on a post-construction clean, on top of the same flat
              rate, the same add-on prices and the same recurring discounts. It covers the drive and nothing else, and
              it appears as its own line on the quote before you book.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">
              That is the whole price difference for{" "}
              {EDMONTON_TOWNS.map((town, i) => (
                <span key={town.to}>
                  <Link to={town.to} className="text-accent underline underline-offset-4 hover:text-accent/80">{town.anchor}</Link>
                  {i < EDMONTON_TOWNS.length - 2 ? ", " : i === EDMONTON_TOWNS.length - 2 ? " and " : "."}
                </span>
              ))}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Calgary, Airdrie and Cochrane are on the{" "}
              <Link to="/calgary/pricing/" className="text-accent underline underline-offset-4 hover:text-accent/80">Calgary house cleaning prices by home size</Link>{" "}
              page, and the Calgary branch works from the same price sheet.
            </p>
          </div>
        </div>
      </section>

      {/* Flat rate against hourly, then the no-hidden-fees banner */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={factorsRef}>
          <div className="max-w-5xl mx-auto">
            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10 text-center">
              A flat rate prices a whole home. Ask for less than that, a few rooms or a one-off task
              list, and the job is quoted hourly instead, from {formatPrice(HOME_HOURLY_RATE)} per hour per
              cleaner before GST.
            </p>

            {/* No Hidden Fees Banner */}
            <div className="bg-brand-navy rounded-2xl p-8 md:p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                   <h3 className="text-xl font-bold text-white">The price before the booking</h3>
                 </div>
                 <p className="text-white/90 leading-relaxed mb-6 max-w-2xl">
                   You see the price before you book, and your card is charged once the clean is complete. There is no trip fee inside Edmonton city limits. The number moves only when a home needs substantially more work than it was described as needing, and the team tells you before continuing.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md hover:shadow-lg transition-all" asChild>
                    <a href={quoteHrefFor(pathname)}>
                      <CalendarClock className="w-5 h-5 mr-2" />
                      Book Your Cleaning
                    </a>
                  </Button>
                  <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all" asChild>
                    <a href="tel:7809136565">
                      <Phone className="w-5 h-5 mr-2" />
                      Call for Quote
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Options */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4" ref={optionsRef}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12"><h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">Comparing flat-rate and hourly quotes</h2><p className="text-muted-foreground leading-relaxed">Compare the written scope as well as the total. A whole-home flat rate and an hourly booking for selected tasks answer different needs. Check minimum hours, how many cleaners the rate covers, any extras and GST before choosing.</p><p className="mt-4"><Link className="text-primary underline" to="/how-much-does-a-house-cleaning-cost/">How to compare cleaning quotes and price factors</Link></p></div>

            <div className="grid md:grid-cols-2 gap-8">
              <PricingOptionCard
                icon={Clock}
                title="Hourly Cleaning"
                description="For partial or unusual jobs: a few rooms, a one-off task list, or a home that does not fit a size tier. You set what gets done and pay for the time it takes."
                price={`from ${formatPrice(HOME_HOURLY_RATE)}/hour`}
                priceLabel="Per cleaner, before 5% GST"
                features={["Minimum booking: 1 cleaner for 3 hours or 2 cleaners for 2 hours", "You set the task list and the order", "Billed by the hour, per cleaner"]}
                buttonText="Book Hourly Service"
              />
              <PricingOptionCard
                icon={Home}
                title="Flat-Rate Pricing"
                description="The rate for most homes. Set by bedrooms, bathrooms and home type, with add-ons priced separately, for standard, deep and move-in/out cleans."
                price={`from ${FROM_PRICE}`}
                priceLabel="Fixed by home size, before 5% GST"
                features={["The price shows before you book","Standard, deep and move-in/out cleans", "No trip fee inside Edmonton city limits", "Pet charge and home type shown before you book"]}
                buttonText="See My Instant Price"
                isHighlighted
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={whyRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Who you are booking</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">What the price includes</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Clock, title: `Edmonton and Calgary, ${COMPANY.sinceLabel}`, desc: "One price sheet for both cities, and no city premium on either" },
                { icon: Award, title: "Re-clean guarantee", desc: `Tell us within ${POLICY.guaranteeWindowHours} hours and we re-clean the missed areas at no cost` },
                { icon: Users, title: "Reference-checked cleaners", desc: "Rated by the customer after every visit; the ratings decide who we send back" },
              ].map((item, i) => (
                <div key={i} className="group text-center" style={{ perspective: "1000px" }}>
                  <div className="transition-all duration-500 ease-out group-hover:-translate-y-2" style={{ transformStyle: "preserve-3d" }}>
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
                      <item.icon className="w-7 h-7 text-accent" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 text-white">{item.title}</h3>
                    <p className="text-sm text-white/90 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-white/90 leading-relaxed max-w-2xl mx-auto mb-4">
              Fill in the online form and choose a service; the price shows before you confirm anything.{" "}
              <strong className="text-white">Nothing is charged when you book.</strong>
            </p>
            <p className="text-center text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
              <Link to="/reviews/" className="text-accent underline underline-offset-4 hover:text-white">Read the reviews</Link>{" "}
              before you decide, or see{" "}
              <Link to="/services/" className="text-accent underline underline-offset-4 hover:text-white">all Edmonton cleaning services and prices</Link>{" "}
              if the job you have in mind is not a standard, deep or move-in/out clean. You can also{" "}
              <Link to="/gift-card/" className="text-accent underline underline-offset-4 hover:text-white">give a clean as a gift</Link>; the card does not expire.
            </p>

            <div className="text-center">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5">
                <a href="#quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  See My Instant Price
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={faqRef}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Common questions</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Questions about Edmonton cleaning prices</h2>
              <p className="text-lg text-muted-foreground">The ones we get asked on the phone, answered the same way</p>
            </div>

            <div className="bg-card rounded-xl shadow-sm border border-border/50 overflow-hidden">
              <div className="bg-brand-navy p-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <HelpCircle className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-white">Pricing Questions</h3>
              </div>
              <div className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item) => (
                    <AccordionItem key={item.value} value={item.value} className="border-border/50">
                      <AccordionTrigger className="text-left hover:no-underline py-4">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-brand-navy relative overflow-hidden" id="contact">
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={ctaRef}>
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4 text-white">See your Edmonton price</h2>
            <p className="text-lg text-white/75 mb-8 leading-relaxed">
              Fill in the form for the number, or call and we will quote it over the phone.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                <Link to="/#quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  See My Instant Price
                </Link>
              </Button>
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 h-auto font-semibold transition-all duration-300" asChild>
                <a href="tel:7809136565">
                  <Phone className="w-5 h-5 mr-2" />
                  Edmonton: (780) 913-6565
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { icon: CheckCircle2, label: `${POLICY.guaranteeWindowHours}-hour re-clean` },
                { icon: Shield, label: "Pay after your clean" },
                { icon: BadgeCheck, label: "No Hidden Fees" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <badge.icon className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
