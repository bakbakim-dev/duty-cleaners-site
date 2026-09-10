import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { addOnFromPrice } from "@/data/pricing";
import { TRAVEL_FEE_KEY } from "@/data/addon-table";
import { POLICY } from "@/data/policy";
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
import PricingFactorCard from "@/components/pricing/PricingFactorCard";
import PricingOptionCard from "@/components/pricing/PricingOptionCard";
import PricingFormula from "@/components/PricingFormula";
import {
  calculateQuote,
  deepCleanTierRows,
  formatPrice,
  FREQUENCIES,
  homeTypeOptions,
  HOURLY_RATE,
  moveInOutTierRows,
  PRICING_TIERS,
  standardTierRows,
} from "@/data/pricing";
import { addOnTableRows } from "@/data/addon-table";
import {
  CheckCircle2, Phone, Calculator, Sparkles, Shield, Clock,
  Star, BadgeCheck, Home, Ruler, Bath, Wrench, CalendarClock,
  DollarSign, HelpCircle, Award, Users, Info, MapPin, Receipt
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

const standardPricing = standardTierRows();

/**
 * Derived from bk-config: a deep clean is a Standard clean plus the Deep
 * Cleaning package for that home size — never hand-typed.
 */
const deepPricing = deepCleanTierRows();

const moveInOutPricing = moveInOutTierRows();

/**
 * The "from" figure for the title, the meta and the flat-rate card: the first
 * row of the standard table, so none of them can disagree with the card.
 */
const FROM_PRICE = standardPricing[0].price;

/** "$155 to $305" — derived, so the prose summary can never contradict the tables. */
const priceSpan = (rows: { price: string }[]) =>
  `${rows[0].price} to ${rows[rows.length - 1].price}`;

/* ---- Worked quotes: the booking form's own calculator, rounded to the
   dollar the way the tier cards are. ---- */
const whole = (value: number) => formatPrice(Math.round(value));
const APARTMENT = homeTypeOptions("standard")[0]?.id ?? null;
const TWO_STOREY = homeTypeOptions("standard").find((o) => /two storey house/i.test(o.label))?.id ?? null;
const BI_WEEKLY = FREQUENCIES.find((f) => f.discount === 0.15)?.id ?? "one-time";
const quote = (input: { homeType: number | null; bedrooms: number; bathrooms: number; halfBaths: number; addOns?: string[]; frequency?: string }) =>
  calculateQuote({ service: "standard", addOns: [], frequency: "one-time", ...input });

/** A Beltline one-bedroom, one bathroom: the first card, on a bi-weekly plan. */
const beltline = quote({ homeType: APARTMENT, bedrooms: 1, bathrooms: 1, halfBaths: 0, frequency: BI_WEEKLY });
/** A four-bedroom two-storey in Mahogany with two bathrooms and a dog. */
const mahoganyBase = quote({ homeType: APARTMENT, bedrooms: 4, bathrooms: 2, halfBaths: 0 });
const mahogany = quote({ homeType: TWO_STOREY, bedrooms: 4, bathrooms: 2, halfBaths: 0, addOns: ["must-choose-if-you-have-pets"], frequency: BI_WEEKLY });

/** Bathrooms the fourth card assumes, so the Mahogany example can say why it lands under it. */
const fourBedTier = PRICING_TIERS[3];

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
  "Baseboards, doors, light switches, wall outlets, and outside vent covers",
  "Inside appliances",
  "Inside cabinets",
  "Interior windows",
  "Wall washing",
  "Garage/balcony",
  "Decluttering/Organizing",
  "Basement",
];

/* Derived from bk-config — see src/data/addon-table.ts. */
const addOnServices = addOnTableRows("calgary");

/** Add-on rows that have a Calgary service page of their own. */
const ADD_ON_PAGE: Record<string, string> = {
  "Top-to-bottom wall washing": "/wall-washing-wall-cleaning-calgary/",
  "Spot cleaning of walls": "/wall-washing-wall-cleaning-calgary/",
};

/** Places outside Calgary city limits, where the travel fee applies. */
const CALGARY_TOWNS: { anchor: string; to: string }[] = [
  { anchor: "house cleaning in Airdrie", to: "/cleaning-services-airdrie/" },
  { anchor: "Cochrane house cleaners", to: "/cleaning-services-cochrane/" },
  { anchor: "cleaning services in Okotoks", to: "/locations/okotoks/" },
  { anchor: "house cleaning in Chestermere", to: "/locations/chestermere/" },
];

const pricingFactors = [
  { icon: Ruler, title: "Type of home", desc: `An apartment or condo is the base. A bungalow or basement suite is ${HOME_TYPE_EXTRA.bungalow} more, a townhouse ${HOME_TYPE_EXTRA.townhouse} more, a two-storey house ${HOME_TYPE_EXTRA.twoStorey} more.` },
  { icon: Bath, title: "Bedrooms and bathrooms", desc: "Bedrooms pick the tier. Bathrooms are priced on top, one by one, which is why the Mahogany example below lands under its card." },
  { icon: Wrench, title: "Type of service", desc: "Standard is the base rate. Deep is that base plus a package sized to the home. Move-in/out is its own rate with the fridge, oven and cabinets inside it." },
  { icon: Sparkles, title: "Add-ons", desc: "Each one is a fixed line from the table, chosen visit by visit. None is compulsory except the pet charge." },
  { icon: CalendarClock, title: "Frequency", desc: "Weekly takes 20% off, bi-weekly 15%, every 4 weeks 10%, from the second visit onward." },
  { icon: DollarSign, title: "Flat rate or hourly", desc: `Flat by size for a whole home. ${formatPrice(HOURLY_RATE)} an hour per cleaner for a few rooms or a one-off list, 3 hours minimum for one cleaner or 2 for two.` },
];

const faqItems = [
  { value: "trust", question: "Can I trust my house cleaners?", answer: "Every cleaner on a Calgary crew was reference-checked before their first job with us, and the customer rates each visit afterwards. Those ratings decide who we keep sending to Calgary homes." },
  { value: "included", question: "What is included in maid service in Calgary?", answer: "A standard clean in Calgary covers the kitchen (sink, stovetop, counters, the inside and outside of the microwave, the outside of the other appliances), every bathroom (toilets, showers, tubs, sinks), and the bedrooms and living areas (dusting, mirrors, window sills, chairs and tables, vacuuming and mopping). The inside of the fridge, the oven and the cabinets are add-ons on a standard clean and part of a move-in/out clean. Baseboards are in the Deep Cleaning package." },
  { value: "duration", question: "How long does a typical house cleaning take?", answer: "As long as the checklist takes. A Beltline one-bedroom and a Mahogany four-bedroom are each billed at their flat rate whether the crew finishes in two hours or four, because the rate is set by the home and not by the clock. Deep and move-in/out cleans have longer lists and run longer." },
  { value: "supplies", question: "Are there discounts if I provide my own cleaning supplies?", answer: `No. The crew arrives with its own supplies and equipment, and the rate already assumes that. If there is a product you want used on a particular surface, leave it out and note it on the booking; that costs nothing extra. Eco-friendly products are ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.` },
  { value: "recurring", question: "Do you offer recurring service discounts?", answer: "Weekly is 20% off, bi-weekly 15% off, every 4 weeks 10% off. The discount begins on the second visit and the first is charged at the one-time rate. When that first visit is a deep clean, the package part is billed once and never discounted, and the visits after it are standard cleans at the discounted price. Move-out cleans do not recur, so they carry no discount." },
  { value: "pricing-types", question: "What's the difference between Hourly Cleaning and flat-rate pricing?", answer: `Flat rate: one figure set by bedrooms, bathrooms and home type, unchanged if the clean runs long. Hourly, at ${formatPrice(HOURLY_RATE)} per cleaner per hour: for a few rooms, a one-off task list, or a home no size tier fits, with a minimum of 3 hours for one cleaner or 2 hours for two. A Calgary condo owner who only wants the kitchen and one bathroom done is an hourly job; the same condo done end to end is a flat rate.` },
  // A FAQ with this title has to name the charges customers call hidden. Both
  // are published on /terms/ and both read from POLICY, so this answer can
  // never drift away from the terms it summarises.
  { value: "hidden-fees", question: "Are there any hidden fees?", answer: `Every charge outside the card price is on the quote before you book, and this is the whole list. Pets: ${PET_FEE} a visit, because shed hair and nose marks on glass add time in every room. An address outside Calgary city limits, such as Airdrie, Cochrane, Okotoks or Chestermere: a ${TRAVEL_FEE} travel fee. Cancelling or moving a booking inside ${POLICY.cancellationNoticeHours} hours: ${POLICY.cancellationFee}. A lockout, where the crew arrives and cannot get in: ${POLICY.lockoutFee}. Eco-friendly products: ${POLICY.ecoProductsFee}, and since the form has no box for them, ${POLICY.ecoProductsHowToRequest}. The flat rate itself does not rise because a clean ran long. It changes only when a home needs substantially more work than the booking described, and the crew tells you what they found before continuing.` },
  { value: "satisfaction", question: "What if I'm not satisfied with the cleaning?", answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the crew comes back to re-clean whatever was missed, at no cost. There is no form to fill in and no photo requirement.` },
  { value: "same-as-edmonton", question: "Is the price different in Calgary than in Edmonton?", answer: "No. One price sheet covers both cities and neither carries a premium. What differs is which service a Calgary home tends to need: after a winter of chinook melt-and-grit cycles, the deep clean is the right first booking more often than it is in Edmonton. That is a difference in what you choose, not in what we charge." },
];

export default function CalgaryPricing() {
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

  const title = `Calgary House Cleaning Prices from ${FROM_PRICE} | Duty Cleaners`;
  const description = `Calgary house cleaning prices from ${FROM_PRICE} by home size. GST stated, no trip fee inside city limits, and you pay after the clean, not before.`;

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href="https://dutycleaners.ca/calgary/pricing/" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/calgary/pricing/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify(buildPricingSchema({ city: "calgary", standard: standardPricing, deep: deepPricing, moveInOut: moveInOutPricing }))}
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

      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="bg-brand-navy py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10" ref={heroRef}>
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8 rotate-3 hover:rotate-0 transition-transform duration-500">
              <Calculator className="w-10 h-10 text-accent" />
            </div>

            <h1 className="display-serif text-3xl md:text-5xl font-bold mb-6 leading-tight text-balance text-white">
              Calgary house cleaning prices,{" "}
              <span className="text-accent">by home size</span>
            </h1>
            {/* All three services in plain text, up top. The tab panels below
                render one at a time, and a text extractor only ever saw the
                Standard one. Every figure is derived, never typed. */}
            <p className="text-xl md:text-2xl text-white/85 mb-3 leading-relaxed">
              One flat rate per bedroom count, before 5% GST: {priceSpan(standardPricing)} for a standard clean,{" "}
              {priceSpan(deepPricing)} for a deep clean, {priceSpan(moveInOutPricing)} to move in or out. The
              number on the quote is the number on the card, charged once the crew has finished.
            </p>
            <p className="text-lg text-white/90 mb-10">
              {/* Read from the verified Form 1 table so BK and the page cannot
                  diverge; the old line put two home types under one number. */}
              Those rates assume an apartment or condo. A bungalow or a basement suite is {HOME_TYPE_EXTRA.bungalow} more,
              a townhouse {HOME_TYPE_EXTRA.townhouse} more, and a two-storey house {HOME_TYPE_EXTRA.twoStorey} more,
              because a second floor and its stairs take longer to cover. Pick the home type on the form and the total
              updates in front of you.
            </p>
            <p className="text-lg text-white/90 mb-10">
              Nothing about how the day goes moves the rate. A quote changes only when a home needs substantially more
              work than it was described as needing, and the crew explains what they found before they carry on. A
              few rooms, or a home with no bedroom count that fits, is quoted hourly at {formatPrice(HOURLY_RATE)} per
              hour per cleaner instead.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              {[
                { icon: Star, label: RATING_CLAIM },
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
              {/* Without asChild + href this rendered as a bare <button> that did
                  nothing — the primary CTA on the Calgary pricing page. Edmonton's
                  identical block has always pointed at #quote. */}
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                <a href="#quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  See My Instant Price
                </a>
              </Button>
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 h-auto font-semibold transition-all duration-300" asChild>
                <a href="tel:4037681341">
                  <Phone className="w-5 h-5 mr-2" />
                  (403) 768-1341
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PricingFormula city="Calgary" />

      <LocalMarketNote
        accent="calgary"
        eyebrow="Calgary pricing, in plain terms"
        heading="Why your Calgary quote lands where it does"
        paragraphs={[
          "Our prices are the same in Calgary as in Edmonton — we do not charge a city premium, and there is no trip fee inside either city. What differs is which service a Calgary home usually needs, and that is where the real cost difference shows up. Because the chinooks keep putting the roads through melt-and-grit cycles all winter, sand and de-icer accumulate along baseboards and carpet edges in a way that a standard clean is not scoped to remove. Booked in late winter, a Calgary home is more likely to genuinely need the deep clean than the standard one.",
          "Home type moves the number more than neighbourhood does. A Beltline or Mission condo is small in square footage but heavy on glass, tracks and balcony seals, so it prices lower than a suburban house but takes longer per square foot than the tier suggests. A newer place in Mahogany, Seton or Livingston is the reverse — larger and quicker, unless it is still shedding construction dust from the vents and closet shelves, which is common for a year or two after possession.",
          "Everything quoted here is before tax; 5% GST is added on top. Recurring discounts of 20% weekly, 15% bi-weekly and 10% every four weeks start from your second visit, and the first clean is charged at the one-time rate. If the home turns out to need substantially more work than described, the team explains what they found and your options before continuing rather than adjusting the bill afterwards.",
        ]}
      />

      {/* Service Pricing Tabs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={tabsRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">The rates</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Calgary house cleaning rates, card by card</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Three services, five home sizes. Every card is a flat rate before GST.
              </p>
            </div>

            {/* This box used to open "prices shown are starting estimates, not
                the final amount", which contradicted the banner further down
                the page. The rate is fixed; here is the one thing that moves it. */}
            <div className="mb-6 bg-accent/5 border border-accent/20 rounded-xl p-5 md:p-6 flex items-start gap-3 md:gap-4 max-w-3xl mx-auto">
              <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <span className="font-semibold text-foreground">The rate is fixed by home size and bathroom count, and it does not go up because the crew took longer.</span>{" "}
                  It changes in one case only: a home that needs substantially more work than the booking described,
                  heavy build-up or far more glass and cabinetry than stated. Then the crew tells you what they found
                  and your options before continuing, not on the invoice afterwards.
                </p>
              </div>
            </div>

            <p className="text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-10">
              Reading the cards: left to right is bedroom count, and each card assumes an apartment or condo with a
              set number of bathrooms: {PRICING_TIERS[0].bathrooms} for the one-bedroom, {PRICING_TIERS[1].bathrooms} for the two-bedroom, and{" "}
              {fourBedTier.bathrooms} full plus a half bath by the four-bedroom. A Beltline one-bedroom with one
              bathroom is the first card exactly; a four-bedroom in Mahogany with two bathrooms comes in under the
              fourth, worked through below. The{" "}
              <Link to="/calgary/regular-cleaning/" className="text-accent underline underline-offset-4 hover:text-accent/80">Calgary standard cleaning</Link>{" "}
              rate is the base for everything. A{" "}
              <Link to="/calgary/deep-cleaning/" className="text-accent underline underline-offset-4 hover:text-accent/80">deep clean in Calgary</Link>{" "}
              adds the Deep Cleaning package for the size on top of it. A{" "}
              <Link to="/move-out-cleaning-calgary/" className="text-accent underline underline-offset-4 hover:text-accent/80">move-out clean in Calgary</Link>{" "}
              is priced on its own, with the fridge, the oven and the cabinets already inside the figure.
            </p>

            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-10 h-auto bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="standard" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Standard Cleaning</TabsTrigger>
                <TabsTrigger value="deep" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Deep Cleaning</TabsTrigger>
                <TabsTrigger value="moveinout" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Move In/Out</TabsTrigger>
              </TabsList>

              <TabsContent value="standard">
                <p className="text-center text-muted-foreground mb-8">The visit most Calgary homes book, at the rate for their size</p>
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
                      <h3 className="text-lg font-bold text-white">What's Included</h3>
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
                <p className="text-center text-muted-foreground mb-8">Standard rate plus the Deep Cleaning package for the size; the package price sits under each figure</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {deepPricing.map((item) => (
                    <PricingTierCard
                      key={item.beds}
                      beds={item.beds}
                      price={item.price}
                      note={`${item.standard} standard + ${item.packagePrice} Deep Cleaning package`}
                      ctaHref="/cleaning-services-calgary/?intent=deep#quote"
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="moveinout">
                <p className="text-center text-muted-foreground mb-8">An empty home, top to bottom, appliances and cabinets inside the price</p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {moveInOutPricing.map((item) => (
                    <PricingTierCard key={item.beds} beds={item.beds} price={item.price} />
                  ))}
                </div>
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
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Calgary add-on prices, per visit</h2>
              <p className="text-lg text-muted-foreground">What a standard clean leaves out, and what each piece costs to put back in</p>
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
              The rows are the jobs a standard visit does not do. What it does do, surface by surface, is the{" "}
              <Link to="/whats-included/" className="text-accent underline underline-offset-4 hover:text-accent/80">full what's-included checklist</Link>,
              and the two wall rows link to the Calgary wall-washing page for the detail.
            </p>

            {/* Office Cleaning Card */}
            <div className="mt-10 max-w-lg mx-auto group" style={{ perspective: "1000px" }}>
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-8 text-center transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover shadow-xl group-hover:scale-[1.02]" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-1">Office Cleaning</h3>
                <p className="text-sm text-muted-foreground mb-3">Office cleaning, billed by the hour.</p>
                <div className="text-4xl font-bold text-accent mb-1">{formatPrice(HOURLY_RATE)}/hour</div>
                <p className="text-sm text-muted-foreground">Per cleaner · Flexible scheduling</p>
              </div>
            </div>
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
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">Weekly, bi-weekly or every 4 weeks: the recurring rates</h2>
              <p className="text-lg text-white/90">The percentage comes off the standard clean from the second visit onward.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <RecurringDiscountCard percentage="20%" title="Weekly Cleaning" />
              <RecurringDiscountCard percentage="15%" title="Bi-weekly Cleaning" isPopular />
              <RecurringDiscountCard percentage="10%" title="Every 4 Weeks" />
            </div>

            <p className="text-center text-sm text-white/80 max-w-2xl mx-auto mb-6">
              {/* In bk-config six of seven Deep Cleaning rows are
                  exempt_extra_from_freq_disc AND first-only, so the deep portion
                  neither recurs nor discounts. */}
              <strong className="text-white">Note:</strong> A deep clean on the first visit is billed once at the
              one-time price and neither recurs nor discounts. A move-out clean is a one-off by nature and carries no
              frequency discount at all.
            </p>
            <p className="text-center text-sm text-white/80 max-w-2xl mx-auto">
              How a bi-weekly Calgary plan works out over a year is on the{" "}
              <Link to="/calgary/recurring-cleaning/" className="text-accent underline underline-offset-4 hover:text-white">recurring cleaning in Calgary</Link>{" "}
              page. Hosts turning a unit between guests should read{" "}
              <Link to="/airbnb-cleaning-services-calgary/" className="text-accent underline underline-offset-4 hover:text-white">short-term rental turnover cleaning in Calgary</Link>{" "}
              instead; that work is priced by the hour.
            </p>
          </div>
        </div>
      </section>

      {/* Worked examples */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={examplesRef}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Worked quotes</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">What two Calgary homes actually pay</h2>
              <p className="text-lg text-muted-foreground">The form's own arithmetic, with every figure shown.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Receipt className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">A one-bedroom in the Beltline</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  One bedroom, one bathroom, no pets: the first card, {standardPricing[0].price} for a standard clean
                  plus GST. Booked bi-weekly, the second visit and every one after it is{" "}
                  {whole(beltline.ongoing ?? beltline.firstClean)}. Start with a deep clean instead and that first
                  visit is {deepPricing[0].price}, the {deepPricing[0].standard} standard rate plus the{" "}
                  {deepPricing[0].packagePrice} package, before the bi-weekly rate takes over.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Receipt className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">A four-bedroom in Mahogany</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  A two-storey house with four bedrooms, two bathrooms and a dog. Four bedrooms and two bathrooms
                  set {whole(mahoganyBase.firstClean)}; the two-storey house adds {HOME_TYPE_EXTRA.twoStorey}; the
                  pet charge is {PET_FEE} a visit. That is {whole(mahogany.firstClean)} before GST, under the
                  fourth card because the card assumes {fourBedTier.bathrooms} full bathrooms, and{" "}
                  {whole(mahogany.ongoing ?? mahogany.firstClean)} a visit from the second clean on a bi-weekly plan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Travel fee and the places it covers */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4" ref={travelRef}>
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-accent" />
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Beyond city limits</span>
            </div>
            <h2 className="display-serif text-2xl md:text-3xl font-bold mb-6 text-balance">Outside Calgary city limits: what the travel fee covers</h2>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Inside Calgary there is no trip fee and no diagnostic fee. Past the city limits, each visit carries a{" "}
              {TRAVEL_FEE} travel fee, and that fee is the only thing separating a Calgary quote from one in the towns
              around it. The flat rate, the add-on prices and the recurring discounts are the city figures, and the fee
              shows as its own line on the quote before you confirm.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-5">
              It pays for the drive, nothing more, and it is the same whether the crew is heading to{" "}
              {CALGARY_TOWNS.map((town, i) => (
                <span key={town.to}>
                  <Link to={town.to} className="text-accent underline underline-offset-4 hover:text-accent/80">{town.anchor}</Link>
                  {i < CALGARY_TOWNS.length - 2 ? ", " : i === CALGARY_TOWNS.length - 2 ? " or " : "."}
                </span>
              ))}
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Edmonton and the towns around it work the same way and are on{" "}
              <Link to="/pricing/" className="text-accent underline underline-offset-4 hover:text-accent/80">the full Edmonton price list</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* Factors That Affect Pricing */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={factorsRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">What the form asks</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">What moves the cost of a Calgary clean</h2>
              <p className="text-lg text-muted-foreground">Six questions on the form, and each one moves the total in the open</p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mb-10">
              {pricingFactors.map((factor) => (
                <PricingFactorCard key={factor.title} icon={factor.icon} title={factor.title} description={factor.desc} />
              ))}
            </div>

            {/* No Hidden Fees Banner */}
            <div className="bg-brand-navy rounded-2xl p-8 md:p-10 border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-accent" />
                  </div>
                   <h3 className="text-xl font-bold text-white">Seen before you book, charged after the clean</h3>
                 </div>
                 <p className="text-white/90 leading-relaxed mb-6 max-w-2xl">
                   The quote is fixed before you confirm, and nothing is charged at booking. Your card is charged once the crew has finished. Inside Calgary there is no trip or diagnostic fee. Should a home turn out to need substantially more work than the booking described, the crew says so and gives you the options before continuing.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-md hover:shadow-lg transition-all" asChild>
                    <a href={quoteHrefFor(pathname)}>
                      <CalendarClock className="w-5 h-5 mr-2" />
                      Book Your Cleaning
                    </a>
                  </Button>
                  <Button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all" asChild>
                    <a href="tel:4037681341">
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
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Two ways to price a job</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Hourly or flat rate: which costs a Calgary home less</h2>
              <p className="text-lg text-muted-foreground">A whole home goes flat. A few rooms or a one-off list goes by the hour.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <PricingOptionCard
                icon={Clock}
                title="Hourly Cleaning"
                description="A few rooms, a one-off list, or a home no bedroom tier fits. You write the list, the crew works down it, and you pay for the hours it took."
                price={`${formatPrice(HOURLY_RATE)}/hour`}
                priceLabel="Per cleaner"
                features={["3 hours minimum for one cleaner, 2 hours for two", "Your list, in your order", "Billed by the hour, per cleaner"]}
                buttonText="Book Hourly Service"
              />
              <PricingOptionCard
                icon={Home}
                title="Flat-Rate Pricing"
                description="One figure for the whole home, set by bedrooms, bathrooms and home type. Standard, deep and move-in/out cleans are all priced this way, with add-ons as separate lines."
                price={`from ${FROM_PRICE}`}
                priceLabel="Set by home size, before 5% GST"
                features={["The quote is the bill", "Standard, deep and move-in/out", "No trip or diagnostic fee inside Calgary", "Most popular option"]}
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
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Behind the number</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">What the Calgary price buys</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Clock, title: `In Calgary and Edmonton ${COMPANY.sinceLabel}`, desc: `${CITY_PROOF.calgary.googleReviewCount} Google reviews on the Calgary listing, ${CITY_PROOF.calgary.googleRating} average` },
                { icon: Award, title: `${POLICY.guaranteeWindowHours}-hour re-clean`, desc: "Say so inside the window and the crew returns to redo what was missed, at no cost and with no photos needed" },
                { icon: Users, title: "Reference-checked crews", desc: "The customer rates every visit, and the ratings decide who comes back" },
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
              Pick a service on the form and the Calgary price appears before you confirm.{" "}
              <strong className="text-white">Nothing is charged at booking.</strong>
            </p>
            <p className="text-center text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
              The{" "}
              <Link to="/reviews/" className="text-accent underline underline-offset-4 hover:text-white">{CITY_PROOF.calgary.googleReviewCount} Calgary Google reviews</Link>{" "}
              are worth ten minutes before you book. If the job is not in the tabs above, it is under{" "}
              <Link to="/calgary/services/" className="text-accent underline underline-offset-4 hover:text-white">every Calgary cleaning service, with starting prices</Link>.
              And a clean makes a straightforward present:{" "}
              <Link to="/gift-card/" className="text-accent underline underline-offset-4 hover:text-white">give a clean as a gift</Link>{" "}
              and the card never expires.
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
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Asked on the phone</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Calgary cleaning prices, question by question</h2>
              <p className="text-lg text-muted-foreground">What Calgary callers ask before they book, answered in full</p>
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
            <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4 text-white">See your Calgary price</h2>
            <p className="text-lg text-white/75 mb-8 leading-relaxed">
              The form shows the number before you confirm anything, or phone the Calgary office and we read it to you.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-10 py-6 h-auto font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" asChild>
                <Link to="/cleaning-services-calgary/#quote">
                  <Calculator className="w-5 h-5 mr-2" />
                  See My Instant Price
                </Link>
              </Button>
              <Button size="lg" className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 text-lg px-8 py-6 h-auto font-semibold transition-all duration-300" asChild>
                <a href="tel:4037681341">
                  <Phone className="w-5 h-5 mr-2" />
                  Calgary: (403) 768-1341
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {[
                { icon: CheckCircle2, label: "Flexible Scheduling" },
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
