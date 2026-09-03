import { addOnFromPrice } from "@/data/pricing";
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
  deepCleanTierRows,
  flatRateFromPrice,
  formatPrice,
  HOURLY_RATE,
  moveInOutTierRows,
  standardTierRows,
} from "@/data/pricing";
import { addOnTableRows } from "@/data/addon-table";
import {
  CheckCircle2, Phone, Calculator, Sparkles, Shield, Clock,
  Star, BadgeCheck, Home, Ruler, Bath, Wrench, CalendarClock,
  DollarSign, HelpCircle, Award, Users, Info
} from "lucide-react";
import { COMPANY, RATING_CLAIM } from "@/data/proof";

/* Derived from bk-config — never hand-typed, so the table can never
   drift from what BookingKoala actually charges. */
/** BookingKoala extra 122, "Must choose if you have pets" — charged on every
 *  visit, so a "no hidden fees" answer has to name it. */
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);

const standardPricing = standardTierRows();

/**
 * Derived from bk-config: a deep clean is a Standard clean plus the Deep
 * Cleaning package tier for that home size — never hand-typed.
 */
const deepPricing = deepCleanTierRows();

const moveInOutPricing = moveInOutTierRows();

/** "$155 to $305" — derived, so the prose summary can never contradict the tables. */
const priceSpan = (rows: { price: string }[]) =>
  `${rows[0].price} to ${rows[rows.length - 1].price}`;

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


const pricingFactors = [
  { icon: Ruler, title: "Size of the house", desc: "Larger homes require more time and effort" },
  { icon: Bath, title: "Number of bathrooms & bedrooms", desc: "More rooms = more comprehensive cleaning" },
  { icon: Wrench, title: "Type of service required", desc: "Standard, deep, or move-out cleaning" },
  { icon: Sparkles, title: "Add-on services", desc: "Inside fridge, inside oven, inside the cabinets, windows, blinds, baseboards, walls, etc." },
  { icon: CalendarClock, title: "Frequency of cleaning", desc: "Recurring services get discounts up to 20%" },
  { icon: DollarSign, title: "Type of pricing", desc: "Hourly Cleaning or flat-rate options available" },
];

const faqItems = [
  { value: "trust", question: "Can I trust my house cleaners?", answer: "Every cleaner is reference-checked before their first job, and every visit is rated by the customer afterwards — those ratings decide who we send back." },
  { value: "included", question: "What is included in maid service in Calgary?", answer: "Our standard cleaning includes dusting all surfaces, vacuuming carpets, mopping floors, cleaning mirrors, kitchen cleaning (sink, stovetop, outside appliances, countertops), and bathroom cleaning (scrubbing toilets, showers, tubs, sinks). Deep cleaning and move-in/out services include additional tasks like baseboards, inside appliances, and cabinets." },
  { value: "duration", question: "How long does a typical house cleaning take?", answer: "We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes. Deep cleaning and move-in/out services cover more tasks than a standard clean." },
  { value: "supplies", question: "Are there discounts if I provide my own cleaning supplies?", answer: "We bring all professional-grade cleaning supplies and equipment at no extra cost. While we don't offer discounts for providing your own supplies, we're happy to use specific products you prefer at your request." },
  { value: "recurring", question: "Do you offer recurring service discounts?", answer: "Yes! We offer substantial discounts for recurring services: 20% off for weekly cleaning, 15% off for bi-weekly cleaning, and 10% off for monthly cleaning. These discounts apply to standard and deep cleaning services. Your first clean is at the standard one-time rate — the discount starts from your second visit and applies to every visit after that." },
  { value: "pricing-types", question: "What's the difference between Hourly Cleaning and flat-rate pricing?", answer: `Hourly Cleaning (${formatPrice(HOURLY_RATE)}/hour per cleaner) is flexible and ideal for one-time needs or focusing on specific areas. Our hourly service has a minimum of 3 hours for 1 cleaner or 2 hours for 2 cleaners. Flat-rate pricing offers predictable costs based on your home size and service type, with comprehensive cleaning included. Most customers prefer flat-rate for its transparency and value.` },
  // A FAQ with this title has to name the charges customers call hidden. Both
  // are published on /terms/ and both read from POLICY, so this answer can
  // never drift away from the terms it summarises.
  { value: "hidden-fees", question: "Are there any hidden fees?", answer: `No. Here is every charge that is not the price on the card. A home with pets adds ${PET_FEE} to each visit, because paw prints and shedding add time. Addresses outside Edmonton and Calgary city limits carry a $29.99 travel fee; inside city limits there is no trip fee and no diagnostic fee. Cancelling or rescheduling inside ${POLICY.cancellationNoticeHours} hours is ${POLICY.cancellationFee}, and if the team arrives and cannot get in, the visit is charged at ${POLICY.lockoutFee}. Every one of those appears on your quote before you book. Anything else you add is optional and priced in the table above. Estimates are based on the details you give when booking; uncommon condition-based adjustments may apply if a home needs substantially more time or work than expected.` },
  { value: "satisfaction", question: "What if I'm not satisfied with the cleaning?", answer: "We offer 100% satisfaction guarantee. If you're not completely happy with our service, let us know within 24 hours and we'll come back to re-clean the areas of concern at no additional cost. Your satisfaction is our commitment." },
];

export default function CalgaryPricing() {
  const { pathname } = useLocation();
  const { ref: heroRef } = useScrollAnimation();
  const { ref: tabsRef } = useScrollAnimation();
  const { ref: addOnsRef } = useScrollAnimation();
  const { ref: recurringRef } = useScrollAnimation();
  const { ref: factorsRef } = useScrollAnimation();
  const { ref: optionsRef } = useScrollAnimation();
  const { ref: whyRef } = useScrollAnimation();
  const { ref: faqRef } = useScrollAnimation();
  const { ref: ctaRef } = useScrollAnimation();

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>Calgary House Cleaning Prices | Duty Cleaners</title>
        <meta name="description" content="Calgary cleaning rates, flat by home size — the same price sheet as Edmonton, with every add-on listed and 5% GST stated upfront." />
        <link rel="canonical" href="https://dutycleaners.ca/calgary/pricing/" />
        <meta property="og:title" content="Calgary House Cleaning Prices | Duty Cleaners" />
        <meta property="og:description" content="Calgary cleaning rates, flat by home size — the same price sheet as Edmonton, with every add-on listed and 5% GST stated upfront." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/calgary/pricing/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Calgary House Cleaning Prices | Duty Cleaners" />
        <meta name="twitter:description" content="Calgary cleaning rates, flat by home size — the same price sheet as Edmonton, with every add-on listed and 5% GST stated upfront." />
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
              Calgary cleaning prices that{" "}
              <span className="text-accent">fit the job</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/85 mb-3 leading-relaxed">
              Most homes are priced flat by size — you see your number before you book, plus 5% GST, and it doesn’t go up because a clean took longer.
            </p>
            <p className="text-lg text-white/90 mb-10">
              The figures below are for an apartment or condo. A bungalow adds $15 and a townhouse or two-storey house adds $50, because there are stairs and more floor to cover — the quote asks which you have and shows the difference before you book.
            </p>
            <p className="text-lg text-white/90 mb-10">
              If a flat rate doesn’t suit your job or your budget, we’ll quote you hourly instead — and tell you which option costs you less. Condition, pets and add-ons can change the final number.
            </p>

            {/* Plain-text summary of all three services. The tables further down
                live in tab panels, and an inactive panel is display:none — so a
                reader that extracts rendered text (most AI assistants do) saw
                Standard pricing only and missed deep and move-out entirely.
                Every figure is derived, never typed. */}
            <p className="text-lg text-white/90 mb-10">
              In Calgary, a standard clean runs {priceSpan(standardPricing)} depending on home
              size, a deep clean {priceSpan(deepPricing)}, and a move-in or move-out clean{" "}
              {priceSpan(moveInOutPricing)}. All figures are flat rates in Canadian dollars before
              5% GST. Recurring visits save 20% weekly, 15% bi-weekly and 10% monthly from the
              second clean.
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
          "Everything quoted here is before tax; 5% GST is added on top. Recurring discounts of 20% weekly, 15% bi-weekly and 10% monthly start from your second visit, and the first clean is charged at the one-time rate. If the home turns out to need substantially more work than described, the team explains what they found and your options before continuing rather than adjusting the bill afterwards.",
        ]}
      />

      {/* Service Pricing Tabs */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={tabsRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Rates</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Choose Your Service</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select the type of cleaning that fits your needs
              </p>
            </div>

            {/* Pricing Disclaimer */}
            <div className="mb-10 bg-accent/5 border border-accent/20 rounded-xl p-5 md:p-6 flex items-start gap-3 md:gap-4 max-w-3xl mx-auto">
              <Info className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-foreground/90 leading-relaxed">
                  <span className="font-semibold text-foreground">Please note: prices shown are starting estimates, not the final amount.</span>{" "}
                  Final pricing depends on home size, condition, number of bathrooms, and selected add-ons. Homes with heavier buildup or a cleanliness rating above 3 may require additional time and service adjustments.
                </p>
              </div>
            </div>

            <Tabs defaultValue="standard" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-10 h-auto bg-muted/50 rounded-xl p-1">
                <TabsTrigger value="standard" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Standard Cleaning</TabsTrigger>
                <TabsTrigger value="deep" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Deep Cleaning</TabsTrigger>
                <TabsTrigger value="moveinout" className="min-h-[48px] py-3 px-2 text-sm md:text-base rounded-lg data-[state=active]:bg-brand-navy data-[state=active]:text-white">Move In/Out</TabsTrigger>
              </TabsList>

              <TabsContent value="standard">
                <p className="text-center text-muted-foreground mb-8">Regular maintenance cleaning for your home</p>
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
                <p className="text-center text-muted-foreground mb-8">Comprehensive deep cleaning including baseboards and more</p>
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
                <p className="text-center text-muted-foreground mb-8">Complete cleaning for moving in or out, including appliances and cabinets</p>
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
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Customize Your Clean</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Additional Services</h2>
              <p className="text-lg text-muted-foreground">Add-ons to enhance your cleaning experience</p>
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
                      <td className="px-6 py-4 text-sm text-foreground">{item.service}</td>
                      <td className="px-6 py-4 text-center text-sm text-muted-foreground">{item.standard}</td>
                      <td className={`px-6 py-4 text-center text-sm ${item.moveInOut === "Included" ? "text-accent font-semibold" : "text-muted-foreground"}`}>{item.moveInOut}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Office Cleaning Card */}
            <div className="mt-10 max-w-lg mx-auto group" style={{ perspective: "1000px" }}>
              <div className="bg-card rounded-xl border border-border/50 shadow-sm p-8 text-center transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover shadow-xl group-hover:scale-[1.02]" style={{ transformStyle: "preserve-3d" }}>
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-500 group-hover:rotate-6">
                  <Home className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-1">Office Cleaning</h3>
                <p className="text-sm text-muted-foreground mb-3">Professional office cleaning services</p>
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
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Save More</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">Save with Recurring Service</h2>
              <p className="text-lg text-white/90">Enjoy discounts up to 20% when you book regular cleaning</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <RecurringDiscountCard percentage="20%" title="Weekly Cleaning" />
              <RecurringDiscountCard percentage="15%" title="Bi-weekly Cleaning" isPopular />
              <RecurringDiscountCard percentage="10%" title="Monthly Cleaning" />
            </div>

            <p className="text-center text-sm text-white/80 max-w-2xl mx-auto">
              <strong className="text-white">Note:</strong> Recurring discounts apply to Standard and Deep cleaning services only.
              Initial cleaning and move-out services are not eligible for recurring discounts.
            </p>
          </div>
        </div>
      </section>

      {/* Factors That Affect Pricing */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4" ref={factorsRef}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Good to Know</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Factors That Affect Final Pricing</h2>
              <p className="text-lg text-muted-foreground">Every home is unique—here's what influences your quote</p>
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
                   <h3 className="text-xl font-bold text-white">Clear Pricing, Thoughtful Service</h3>
                 </div>
                 <p className="text-white/90 leading-relaxed mb-6 max-w-2xl">
                   Get an estimate before booking tailored to your cleaning needs. We do not charge trip or diagnostic fees, and uncommon condition-based adjustments are considered only when a home requires substantially more time or work than expected.

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
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Flexible Options</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Choosing the Right Pricing for You</h2>
              <p className="text-lg text-muted-foreground">Two simple ways to book your cleaning</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <PricingOptionCard
                icon={Clock}
                title="Hourly Cleaning"
                description="Ideal for one-off cleaning needs or focusing on specific areas of your home. This flexible package lets you customize the cleaning by selecting only the tasks you want done."
                price={`${formatPrice(HOURLY_RATE)}/hour`}
                priceLabel="Per cleaner"
                features={["Flexible and customizable", "Focus on your priority areas", "Pay only for time used", "Great for one-time needs"]}
                buttonText="Book Hourly Service"
              />
              <PricingOptionCard
                icon={Home}
                title="Flat-Rate Pricing"
                description="Starting rates for services like move-in/out, office, or deep cleaning. Pricing is shaped by bedrooms, bathrooms, property size, condition, and selected add-ons."
                price={`from ${formatPrice(flatRateFromPrice())}`}
                priceLabel="Base estimate — final time and cost vary by home size, condition, bathrooms, and add-ons"
                features={["Clear starting rates", "Comprehensive cleaning included", "No trip or diagnostic fees", "Most popular option"]}
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
              <span className="text-brand-gold font-semibold text-sm uppercase tracking-wider">Why Us</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-white">Why Choose Duty Cleaners?</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: Clock, title: `Serving Alberta since ${COMPANY.foundedYear}`, desc: "Operating across Calgary" },
                { icon: Award, title: "100% Satisfaction Guarantee", desc: "Not happy? Let us know within 24 hours and we'll re-clean at no cost" },
                { icon: Users, title: "Skilled Professionals", desc: "Reference-checked and customer-rated" },
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

            <p className="text-center text-white/90 leading-relaxed max-w-2xl mx-auto mb-8">
              Simply complete our quick online form, choose your service, and receive an instant quote before confirming
              your booking. <strong className="text-white">Duty Cleaners will take care of everything!</strong>
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
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Common Questions</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">Answers to common pricing questions</p>
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
            <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
            <p className="text-lg text-white/75 mb-8 leading-relaxed">
              Get your instant quote now or call us for personalized service
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
