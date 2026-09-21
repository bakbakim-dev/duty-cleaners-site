import { ServiceCard, WhyUsCard, QuoteReceipt } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, Building2, Leaf, CalendarCheck, ThumbsUp, Calculator, PaintRoller, Sparkles } from "lucide-react";
import cochraneImg from "@/assets/gallery/cochrane-clean-home.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { sitePriceRange, standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice, calculateQuote, homeTypeOptions, PRICING_TIERS } from "@/data/pricing";
import { travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";

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
const CALGARY_LISTING = GOOGLE_LISTINGS.calgary;
const CALGARY_RATING = `${CITY_PROOF.calgary.googleRating} on Google`;

const PAGE_TITLE = `House Cleaning Cochrane | Duty Cleaners`;
const PAGE_DESCRIPTION = `Cochrane house cleaning is charged to the card only once the clean is complete: from ${STANDARD_FROM} before GST for a one-bedroom, plus a ${TRAVEL_FEE} travel fee.`;

// A worked quote run through calculateQuote, the booking funnel's own maths: a
// two-bedroom townhouse on a standard clean, outside city limits. The table
// rounds each size to the dollar, so no total is built from a table card.
const EXAMPLE_SIZE = PRICING_TIERS[1];
const EXAMPLE_TIER = STANDARD[1];
const exampleQuote = (homeType: number | null, addOns: string[] = []) =>
  calculateQuote({ service: "standard", homeType, bedrooms: EXAMPLE_SIZE.beds, bathrooms: EXAMPLE_SIZE.bathrooms, halfBaths: EXAMPLE_SIZE.halfBaths, addOns, frequency: "one-time" }).firstClean;
const EXAMPLE_BASE = formatPrice(exampleQuote(homeTypeOptions("standard")[0]?.id ?? null));
// The table card rounds to the dollar; the receipt says so when the two differ.
const EXAMPLE_TABLE_NOTE = EXAMPLE_BASE === EXAMPLE_TIER.price ? undefined : `${EXAMPLE_TIER.price} in the table, which rounds to the dollar`;
const EXAMPLE_PRICE = formatPrice(exampleQuote(89, [TRAVEL_FEE_KEY]));

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

const services = locationServices("Cochrane", "calgary");

const whyUsItems = locationWhyUs("calgary");

// The coverage chips that stood here (Sunset Ridge, Fireside, Heartland,
// Riversong, Heritage Hills, Jumping Pound Ridge, West Valley) are gone: none
// of them is on the Calgary coverage list in data/city-locations.ts, and a
// name on a page must mean the place is on that list. Sunset Ridge and Fireside
// still appear where the local note puts them.

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Cochrane",
  city: "calgary",
  url: "https://dutycleaners.ca/cleaning-services-cochrane",
  areaServed: "Cochrane, AB",
  priceRange: sitePriceRange(),
});

export default function Cochrane() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "Do you charge a travel fee in Cochrane?",
      answer: `We do. Cochrane is a town outside Calgary's city limits, so a home-cleaning booking here carries a ${TRAVEL_FEE} travel fee, and a post-construction booking carries ${PC_TRAVEL_FEE}. It is added at booking, so the total you see before you confirm already has it in. Beyond that fee a Cochrane clean costs what a Calgary one does: the same flat rate by home size, ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} on a bungalow or basement suite, ${HOME_TYPE.townhouse} on a townhouse, ${HOME_TYPE.twoStorey} on a two-storey house. Every figure is before 5% GST.`
    },
    {
      question: "Can I book house cleaning in Cochrane at short notice?",
      answer: `Same-day and next-day slots depend on the schedule, so ring the Calgary office on (403) 768-1341 and ask. Arrival windows are ${ARRIVAL_WINDOWS.join(", ")}, and a short-notice booking takes whichever window is still open. You do not need to be home if you leave a key, a lockbox code or smart-lock access; the team locks up when it leaves.`
    },
    {
      question: "Is move-out cleaning available in Cochrane?",
      answer: `Yes. A move-in or move-out clean is ${MOVE_FROM} to ${MOVE_TOP} by home size for an apartment or condo, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet charge. It includes the inside of the oven, fridge and microwave, and every empty cabinet, drawer and closet. In a new build, choose it only after the builder's final clean when no construction dust or trade residue remains; otherwise choose post-construction cleaning.`
    },
    {
      question: "How much is a standard clean in Cochrane?",
      answer: `${STANDARD_FROM} for a one-bedroom apartment or condo and ${STANDARD_TOP} for five bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee; a house-type charge and the pet charge can apply on top. The deep clean starts at ${DEEP_FROM}. Put the standard clean on a weekly schedule and it is 20% less; bi-weekly is 15% less, every 4 weeks 10% less. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "Do I need to supply anything for the clean?",
      answer: `No. The team brings all supplies and equipment. It does need running water, and vacuuming may not be possible without electricity, so leave the water and power on. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Cochrane home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does a cancellation cost in Cochrane?",
      answer: `Cancelling inside ${POLICY.cancellationNoticeHours} hours costs ${POLICY.cancellationFee}; with more notice than that, changing or cancelling is free. If the crew arrives in Cochrane and cannot get in, the lockout charge is ${POLICY.lockoutFee}. If Duty Cleaners has to move your booking, you hear as soon as the office knows, you are offered the earliest slot it has, and cancelling that moved booking costs nothing.`
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
    <>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-cochrane/" />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-cochrane/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="min-h-screen">
        <Navigation city="calgary" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero */}
        <section className="relative py-24 bg-brand-navy overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <h1 className="display-serif text-[2rem] sm:text-[2.25rem] xl:text-[2.75rem] text-white mb-6 leading-[1.12] text-balance">
                  Professional House Cleaning in Cochrane
                </h1>
                <p className="text-lg text-white/85 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Cochrane house cleaning runs from {STANDARD_FROM} for a one-bedroom apartment or condo, and move-out cleaning from {MOVE_FROM}, both before GST, a {TRAVEL_FEE} travel fee and any house-type or pet charge; you pay after the clean.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="tel:4037681341">
                      <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(403) 768-1341
                    </a>
                  </Button>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-white/90">
                  <Star className="w-4 h-4 shrink-0 fill-brand-gold text-brand-gold" aria-hidden="true" />
                  <span className="font-medium">{CALGARY_RATING}, {CITY_PROOF.calgary.googleReviewCount} reviews on the Calgary listing</span>
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-[440px]">
                <img width={800} height={608}
                  src={cochraneImg}
                  alt="A clean modern home interior with mountain views through the windows"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* What the hero pills said, as one plain row under the hero */}
        <div className="border-b border-border bg-muted/30">
          <ul className="container mx-auto px-4 py-3 flex flex-wrap items-center justify-center gap-x-8 gap-y-1 text-sm font-medium text-foreground">
            {["Pay after your clean", "Open 7 days a week", "24-hour re-clean guarantee"].map((text) => (
              <li key={text} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />
                {text}
              </li>
            ))}
          </ul>
        </div>

      <LocalMarketNote
        eyebrow="From the route"
        heading="At the base of Big Hill"
        paragraphs={[
          "The town sits at the base of Big Hill, downtown low on the Bow River valley floor, with most of the newer streets up on the higher ground either side of it. Those upper communities lose the shelter the valley gives. Wind comes off the foothills to the west over open ranch country, and screens and window tracks up there load with dry grit far faster than they do downtown. Brushing tracks out is a standing item here, not a deep-clean extra.",
          "Construction continues around Sunset Ridge and Fireside, so the service choice depends on what is actually left in the home. Fine building dust and trade residue call for post-construction cleaning; an empty, dust-free home after the builder's final clean can use the move-in checklist.",
        ]}
        accent="calgary"
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Which clean, and what it costs */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
                  Which clean a Cochrane house needs, and what it costs
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    Choose by condition, not by the age of the house. If trades recently left fine building dust or residue, book{" "}
                    <Link to="/post-construction-cleaning-calgary/" className="text-primary underline underline-offset-2">post-construction cleaning for Cochrane</Link>,
                    priced by square footage. If there is no construction residue but the lived-in home needs the baseboards, doors, light switches, wall outlets and vent covers detailed, choose the deep clean from {DEEP_FROM} before GST for a one-bedroom apartment or condo, plus the {TRAVEL_FEE} travel fee and any home-type or pet charge.
                  </p>
                  <p>
                    Cleaning inside ducts is not part of either service. Once the building dust is gone, the standard clean keeps the lived-in home up. The{" "}
                    <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-2">Calgary deep cleaning</Link>{" "}
                    page has the checklist and the price at every bedroom count.
                  </p>
                  <p>
                    A suite or a whole house let to visitors is a turnover between guests, priced by the hour on the{" "}
                    <Link to="/airbnb-cleaning-services-calgary/" className="text-primary underline underline-offset-2">Airbnb turnover cleaning in Calgary</Link>{" "}
                    page. Every tier and every add-on is on{" "}
                    <Link to="/calgary/pricing/" className="text-primary underline underline-offset-2">the Calgary price list by bedroom count</Link>; add the {TRAVEL_FEE} travel fee for a Cochrane address.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Worked quote */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">One quote, in full</span>
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6 text-balance">
                  How a Cochrane house cleaning quote is built
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    Take a two-bedroom, two-bathroom townhouse in Cochrane on a one-time standard clean.
                  </p>
                  <QuoteReceipt
                    lines={[
                      { label: "Rate for that size", amount: EXAMPLE_BASE, note: EXAMPLE_TABLE_NOTE },
                      { label: "Townhouse charge", amount: `+ ${HOME_TYPE.townhouse}` },
                      { label: "Travel fee, outside Calgary city limits", amount: `+ ${TRAVEL_FEE}` },
                    ]}
                    total={{ label: "Quote before 5% GST", amount: EXAMPLE_PRICE }}
                  />
                  <p>
                    If a cat or a dog lives there, the pet charge goes on as well, and it appears on the quote before booking like the rest.
                  </p>
                  <div className="not-prose pt-1">
                    <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                      <a href="#quote">
                        <Calculator className="mr-2 w-5 h-5" />See My Instant Price
                      </a>
                    </Button>
                  </div>
                  <p>
                    Bedrooms, bathrooms, the type of home, pets and add-ons are what change a Cochrane price. The inside of the oven, the inside of the fridge and interior windows are add-ons with their own prices. How long the clean takes is no part of it: the rate is flat by home size and does not rise because a visit ran long. When a home needs substantially more work than described, such as heavy build-up, the team explains what it found and the options before it goes on.
                  </p>
                  <p>
                    Nothing is charged when you book. A temporary hold goes on the card the day before to confirm it is valid, and the card is charged once the clean is complete; no money moves before then. To weigh the options first, see{" "}
                    <Link to="/calgary/services/" className="text-primary underline underline-offset-2">all Calgary cleaning services and prices</Link>{" "}
                    or{" "}
                    <Link to="/reviews/" className="text-primary underline underline-offset-2">the Duty Cleaners reviews page</Link>.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Move-out cleaning */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-3xl mx-auto">
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
                  Move-out cleaning in Cochrane
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    A handover in either direction is booked as a move-in or move-out clean, from {MOVE_FROM} before GST for a one-bedroom apartment or condo, plus the {TRAVEL_FEE} travel fee for a Cochrane address and any house-type or pet charge. For a new build, this is the right route only after the builder's final clean, when construction dust and trade residue are gone. If either remains, use the post-construction service above. The full handover checklist is on the page for{" "}
                    <Link to="/move-out-cleaning-calgary/" className="text-primary underline underline-offset-2">move-out cleaning in Calgary</Link>.
                  </p>
                  <p>
                    Renters leaving a Cochrane home fall under Alberta's Residential Tenancies Act, which has the landlord complete a move-out inspection report with the tenant. Within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days), as set out in{" "}
                    <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>. We never promise the deposit comes back, because the landlord decides. What a move-out clean does is finish the home to the checklist before that inspection.
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
                  Cleaning services for Cochrane homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Six services for Cochrane homes, all run from the Calgary branch.
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
            <AnimatedSection>
              {/* Up-link to the city hub. /cleaning-services-calgary/ is a
                  subpage, unlike Edmonton's hub which is the homepage, so it is
                  the one that actually needs internal support: it ranked 24.8
                  for "cleaning services calgary" against Edmonton's 6.3 on the
                  identical query, on comparable impressions. */}
              <p className="mt-10 text-center text-muted-foreground">
                {"We clean Cochrane and the wider Calgary area. See "}
                <Link
                  to="/cleaning-services-calgary/"
                  className="text-primary underline underline-offset-2"
                >
                  house cleaning services in Calgary
                </Link>
                {" for the full picture."}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent-on-dark text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mt-2 mb-4 text-balance">
                  Why Cochrane residents choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  The terms, in one place.
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

        {/* Service Areas */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-4 text-balance">
                Other towns the Calgary cleaning company covers
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
                Our{" "}
                <Link to="/cleaning-services-airdrie/" className="text-primary underline underline-offset-2 font-medium">Airdrie house cleaners</Link>{" "}
                work from the same Calgary office as the Cochrane crews. Airdrie and Cochrane are both outside Calgary city limits, so both carry the {TRAVEL_FEE} travel fee, and so do Strathmore, Langdon, Crossfield, Okotoks and Chestermere. The same fee applies to{" "}
                <Link to="/locations/high-river/" className="text-primary underline underline-offset-2 font-medium">cleaning services in High River</Link>{" "}
                and to{" "}
                <Link to="/locations/black-diamond/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Diamond Valley</Link>, the town Black Diamond and Turner Valley became on 1 January 2023. Inside Calgary city limits there is no trip fee.
              </p>
              <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                View All Service Areas<span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
              </Link>

            </AnimatedSection>
          </div>
        </section>

        {/* Interactive Map */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">Cochrane service area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <GoogleMapEmbed query="Cochrane, AB" title="Cochrane Service Area Map" />
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
                  <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Cochrane house cleaning questions</h2>
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
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6 text-balance">
                Book house cleaning in Cochrane
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="#quote">
                    <Calculator className="mr-2 w-5 h-5" />See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="tel:4037681341">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (403) 768-1341
                  </a>
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
