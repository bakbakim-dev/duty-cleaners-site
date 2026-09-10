import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, Building2, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import cochraneImg from "@/assets/gallery/cochrane-clean-home.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { sitePriceRange, standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Every figure on this page is derived from bk-config or policy.ts.
const STANDARD = standardTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TOP = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = deepCleanTierRows()[0].price;
const MOVE = moveInOutTierRows();
const MOVE_FROM = MOVE[0].price;
const MOVE_TOP = MOVE[MOVE.length - 1].price;
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
const CALGARY_RATING = `${CITY_PROOF.calgary.googleRating} on Google`;
const REVIEW_COUNT = CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount;

const PAGE_TITLE = `House Cleaning Cochrane from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `House cleaning in Cochrane, AB: standard cleans from ${STANDARD_FROM}, move-out cleans from ${MOVE_FROM}, flat by home size, rated ${CALGARY_RATING}. Pay after the clean.`;

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

const WhyUsCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);

const services = [
  { icon: Home, title: "Standard Cleaning", description: "A one-time cleaning to bring the whole home back to baseline, priced flat by size.", to: "/calgary/regular-cleaning/", linkText: "Standard cleaning in Cochrane" },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces regular visits skip.", to: "/calgary/deep-cleaning/", linkText: "Deep cleaning in Cochrane" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Move-day cleaning to the standard a Calgary landlord checks against.", to: "/move-out-cleaning-calgary/", linkText: "Move-out cleaning in Cochrane" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Dust and debris removal after renovations or new builds in Cochrane.", to: "/post-construction-cleaning-calgary/", linkText: "Post-construction cleaning in Cochrane" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning-calgary/", linkText: "Wall washing in Cochrane" },
  { icon: Building2, title: "Commercial Cleaning", description: "Office and commercial space cleaning for Cochrane businesses." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${REVIEW_COUNT} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day availability, schedule permitting." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Cleaners who work to the Duty Cleaners checklist and are rated by the customer after each visit." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we'll return to make it right — at no additional charge.` },
];

const nearbyAreas = ["Sunset Ridge", "Fireside", "Heartland", "Riversong", "Heritage Hills", "Jumping Pound Ridge", "West Valley", "Cochrane Lakes"];

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
      answer: `We do. Cochrane is a town outside Calgary's city limits, and every booking outside Calgary and Edmonton carries a ${TRAVEL_FEE} travel fee. It is added at booking, so the total you see before you confirm already has it in. The clean itself is the same flat rate a Calgary address pays for the same home size.`
    },
    {
      question: "Can I book same-day house cleaning in Cochrane?",
      answer: `Sometimes, when a crew heading west has room. Ring the Calgary office and ask; a same-day answer is a phone answer, not a form answer. Arrival windows are ${ARRIVAL_WINDOWS.join(", ")}, and a same-day booking takes whichever is still open. You do not need to be home if you leave a key or a code.`
    },
    {
      question: "Is move-out cleaning available in Cochrane?",
      answer: `Yes. A move-in or move-out clean is ${MOVE_FROM} to ${MOVE_TOP} depending on bedroom count, plus the travel fee, and it is priced for an empty house. What sets it apart from a standard clean is the closed things: the oven, the fridge and the kitchen and bathroom cabinets are cleaned inside as part of the job. In a new build in Sunset Ridge or Fireside it doubles as the move-in clean before the furniture lands.`
    },
    {
      question: "How much is a standard clean in Cochrane?",
      answer: `${STANDARD_FROM} for a one-bedroom and ${STANDARD_TOP} for five or more bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee. The deep clean, which adds baseboards, fans, vents, outlet covers and light switches, starts at ${DEEP_FROM}. Put the standard clean on a weekly schedule and it is 20% less from the second visit; bi-weekly is 15% less, every four weeks 10% less.`
    },
    {
      question: "Do I need to supply anything for the clean?",
      answer: `No. The crew brings products, cloths, a mop and a vacuum. Up on the ridges, where window tracks load with grit, the crew brushes the tracks out dry before anything wet touches them; nothing is needed from you for that. Eco-friendly products are ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What is the guarantee, and what does a cancellation cost?",
      answer: `If a task was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we return to do it at no charge, without asking for photos. Cancelling inside ${POLICY.cancellationNoticeHours} hours costs ${POLICY.cancellationFee}. If the crew arrives in Cochrane and cannot get in, the lockout charge is ${POLICY.lockoutFee}.`
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
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <MapPin className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">Serving Cochrane, Calgary Region</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  Professional House Cleaning in Cochrane
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  {`Standard cleans in Cochrane from ${STANDARD_FROM} and move-out cleans from ${MOVE_FROM}, flat by home size and priced before you book. Rated ${CALGARY_RATING} by our Calgary customers, from Sunset Ridge to Fireside.`}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:4037681341">
                      <Phone className="mr-2 w-5 h-5" />(403) 768-1341
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                    <a href="#quote">See My Instant Price</a>
                  </Button>
                </div>
                <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                  {[
                    { icon: CheckCircle2, text: "Pay After Your Clean" },
                    { icon: CalendarCheck, text: "Flexible Scheduling Available" },
                    { icon: Award, text: "100% Satisfaction Guarantee" },
                  ].map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                      <badge.icon className="w-4 h-4 text-accent" />
                      <span className="text-white/90 text-sm">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 w-full lg:w-[500px]">
                <img width={800} height={608}
                  src={cochraneImg}
                  alt="Clean modern home interior in Cochrane with Rocky Mountain views"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* About the Neighbourhood */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">About the Neighbourhood</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  House cleaning in Cochrane, priced by home size
                </h2>
                <div className="text-muted-foreground space-y-4 text-lg leading-relaxed">
                  <p>
                    Cochrane is a town in the foothills west of Calgary, along{" "}
                    <a href="https://www.google.com/maps/place/Highway+1A,+Cochrane,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Highway 1A</a>.
                    We clean homes from the streets near the{" "}
                    <a href="https://www.google.com/maps/place/Cochrane+Ranche+Historic+Site/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Cochrane Ranche Historic Site</a>{" "}
                    and{" "}
                    <a href="https://www.google.com/maps/place/Mitford+Park,+Cochrane,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Mitford Park</a>{" "}
                    down on the river to the newer communities up the hill in{" "}
                    <a href="https://www.google.com/maps/place/Sunset+Ridge,+Cochrane,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Sunset Ridge</a>{" "}
                    and{" "}
                    <a href="https://www.google.com/maps/place/Fireside,+Cochrane,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Fireside</a>, and out toward{" "}
                    <a href="https://www.google.com/maps/place/Glenbow+Ranch+Provincial+Park/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Glenbow Ranch Provincial Park</a>.
                    The rate is flat by bedroom count, from {STANDARD_FROM} for a one-bedroom, and Cochrane is outside Calgary city limits, so a {TRAVEL_FEE} travel fee is added at booking and is in the total before you confirm.
                  </p>
                  <p>
                    The crews are our Calgary crews: reference-checked before a first job and rated by the customer after every visit. The Calgary listing stands at {CALGARY_RATING}, and the{" "}
                    <Link to="/reviews/" className="text-primary underline underline-offset-2">{REVIEW_COUNT} Google reviews</Link>{" "}
                    across both cities are there to read before you book. For the whole menu with a starting price on each line, see{" "}
                    <Link to="/calgary/services/" className="text-primary underline underline-offset-2">all Calgary cleaning services and prices</Link>.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      {/* Things To Do */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Life</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Around Cochrane
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>Cochrane sits where the prairie meets the Rockies, a short drive west of Calgary, and it has grown fast while keeping a small downtown. Glenbow Ranch Provincial Park has the trails along the Bow River; the Cochrane Ranche Historic Site keeps the ranching history; MacKay's Ice Cream has been there since 1948. The downtown is a few blocks of shops and cafes, and the newer communities are up the hill on either side of it.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

        {/* Interactive Map */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Find Us</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-6">Cochrane Service Area</h2>
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d40123.45!2d-114.47107!3d51.18746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5371478edc30d4e5%3A0x9c71b01253e3dc5c!2sCochrane%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000"
                    width="100%"
                    height="450"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    title="Cochrane Service Area Map"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Coverage</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                  Cochrane Neighbourhoods We Serve
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The Cochrane communities we cover, at the same flat rate in each.
                </p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="From the route"
        heading="At the base of Big Hill"
        paragraphs={[
          "The town sits at the base of Big Hill, downtown low on the Bow River valley floor, with most of the newer streets up on the higher ground either side of it. Those upper communities lose the shelter the valley gives. Wind comes off the foothills to the west over open ranch country, and screens and window tracks up there load with dry grit far faster than they do downtown. Brushing tracks out is a standing item here, not a deep-clean extra.",
          "The 2021 census counted 32,199 people here, a 24.5 per cent jump in five years, and the building has not let up since — the north end around Sunset Ridge, the streets south of the river in Fireside. Plenty of these households are in Sunset Ridge or Fireside, in a house the trades only recently left. Construction dust is mildly abrasive and still working out of ductwork months later. Wet cloths, changed often: a cloth that has already picked up construction fines becomes an abrasive itself.",
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
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Choosing</span>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                  Which clean a Cochrane house needs, and what it costs
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  <p>
                    A house in Sunset Ridge or Fireside that the trades left within the year wants the deep clean first, from {DEEP_FROM}, so the construction fines in the baseboards and vent covers are dealt with once; after that the standard clean from {STANDARD_FROM} holds it. The{" "}
                    <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-2">Calgary deep cleaning</Link>{" "}
                    page has the checklist and the price at every bedroom count. A handover, in either direction, is{" "}
                    <Link to="/move-out-cleaning-calgary/" className="text-primary underline underline-offset-2">move-out cleaning in Calgary</Link>{" "}
                    from {MOVE_FROM}, priced for an empty house with the appliance and cabinet interiors included.
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

        {/* Services */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  Cleaning Services for Cochrane Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Everything from weekly upkeep to full move-out cleans.
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
                {"We clean Cochrane and the wider Calgary area — see "}
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
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  Why Cochrane Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  The terms, in one place.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Near Cochrane: other communities we clean
              </h2>
              <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
                Our{" "}
                <Link to="/cleaning-services-airdrie/" className="text-primary underline underline-offset-2 font-medium">Airdrie house cleaners</Link>{" "}
                are the same Calgary crews working the north side instead of the west. Airdrie and Cochrane are both outside Calgary city limits, so both carry the {TRAVEL_FEE} travel fee; inside Calgary there is none, and the city page lists every neighbourhood we cover.
              </p>
              <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                View All Service Areas →
              </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Cochrane? We also handle{" "}
              <Link to="/commercial-cleaning-services-calgary/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Calgary region
              </Link>.
            </p>

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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cochrane house cleaning questions</h2>
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
                Book house cleaning in Cochrane
              </h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341">
                    <Phone className="mr-2 w-5 h-5" />Call (403) 768-1341
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
    </>
  );
}
