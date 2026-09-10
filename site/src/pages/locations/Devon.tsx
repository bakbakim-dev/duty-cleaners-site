import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import devonLandmark from "@/assets/gallery/devon-landmark.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

import LocationPricing from "@/components/LocationPricing";

// Every figure on this page is derived from bk-config or policy.ts.
const STANDARD = standardTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TOP = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = deepCleanTierRows()[0].price;
const MOVE = moveInOutTierRows();
const MOVE_FROM = MOVE[0].price;
const MOVE_TOP = MOVE[MOVE.length - 1].price;
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
const REVIEW_COUNT = CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount;

const PAGE_TITLE = `House Cleaning Devon from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `Flat-rate house cleaning in Devon, AB: standard cleans from ${STANDARD_FROM}, deep cleans from ${DEEP_FROM}, ${RATING_CLAIM}. See your price before you book.`;

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Devon" },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces regular visits skip.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Devon" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Move-day cleaning done to the standard landlords check for.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Devon" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Dust and debris cleared after renovations or new builds.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Devon" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Devon" },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${REVIEW_COUNT} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day slots when a crew has room." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Cleaners who work to the Duty Cleaners checklist and are rated by the customer after each visit." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we'll return to make it right — at no additional charge.` },
];

const nearbyAreas = [
  "Leduc", "Beaumont", "Calmar", "Thorsby",
  "Spruce Grove", "Stony Plain", "Nisku", "Warburg"
];

export default function Devon() {
  const faqs = [
    {
      question: "Do you charge a travel fee in Devon?",
      answer: `We do. Devon is outside Edmonton city limits, and every booking outside the two cities carries a ${TRAVEL_FEE} travel fee. It goes on at booking, so the total you agree to is the total you pay. The fee does not change with the size of the home or the type of clean.`
    },
    {
      question: "Is same-day house cleaning available in Devon?",
      answer: `When a crew has a gap, yes. Call the Edmonton office and ask; the answer is a yes or a no on the spot rather than a callback. Crews arrive in one of three windows, ${ARRIVAL_WINDOWS.join(", ")}, and a same-day booking takes whichever of those is still open.`
    },
    {
      question: "Can you do a move-out clean in Devon?",
      answer: `Yes. Move-in and move-out cleans run ${MOVE_FROM} to ${MOVE_TOP} by bedroom count. Unlike a standard clean, the inside of the oven, the fridge and the kitchen and bathroom cabinets are part of the job rather than add-ons, because that is what an inspection looks at. Have the house empty before the crew arrives.`
    },
    {
      question: "What does a standard clean cost in Devon?",
      answer: `A one-bedroom is ${STANDARD_FROM}; five or more bedrooms is ${STANDARD_TOP}. Those are flat rates before GST, and a Devon address adds the ${TRAVEL_FEE} travel fee. The deep clean, which adds baseboards, ceiling fans, vents, outlet covers and light switches, starts at ${DEEP_FROM}. Weekly, bi-weekly and every-four-weeks schedules take 20%, 15% and 10% off from the second visit.`
    },
    {
      question: "Do the cleaners bring their own supplies to Devon?",
      answer: `Yes, everything: products, cloths, mop, vacuum. You do not need to be home, either; a key, a lockbox code or a smart-lock code is how most customers do it. If you want eco-friendly products, they are ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What if a room was not done properly?",
      answer: `Say so within ${POLICY.guaranteeWindowHours} hours and we come back for that room at no cost. We do not ask for photos first. On the other side of the ledger, a cancellation with less than ${POLICY.cancellationNoticeHours} hours' notice costs ${POLICY.cancellationFee}, and if the crew cannot get in at the booked time the lockout charge is ${POLICY.lockoutFee}.`
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
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-devon/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-devon/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Devon, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-devon", areaServed: "Devon, AB" }))}</script>
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
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Devon, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Devon
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Standard cleans in Devon start at {STANDARD_FROM} and deep cleans at {DEEP_FROM}, flat by home size, with the price shown before you book. Rated {RATING_CLAIM} across Edmonton and Calgary.
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
              <img width={1024} height={768}
                src={devonLandmark}
                alt="A wooded river valley trail"
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
                House cleaning in Devon, at a flat rate
              </h2>
              <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                <p>
                  Devon sits on the south bank of the North Saskatchewan River, southwest of Edmonton. We clean homes from{" "}
                  <a href="https://www.google.com/maps/place/Devon+Voyageur+Park/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Voyageur Park
                  </a>{" "}
                  and the{" "}
                  <a href="https://www.google.com/maps/place/Devon+River+Valley+Trail/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Devon River Valley Trail
                  </a>{" "}
                  up to the streets around the{" "}
                  <a href="https://www.google.com/maps/place/Devon+Community+Centre/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Devon Community Centre
                  </a>{" "}
                  and{" "}
                  <a href="https://www.google.com/maps/place/Lions+Campground,+Devon,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Lions Park &amp; Campground
                  </a>. The price is set by bedroom count before anyone arrives, from {STANDARD_FROM} for a one-bedroom, and it does not move if the clean runs long. Devon is outside Edmonton city limits, so a {TRAVEL_FEE} travel fee is added to each booking.
                </p>
                <p>
                  The older streets along{" "}
                  <a href="https://www.google.com/maps/place/Athabasca+Ave,+Devon,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Athabasca Avenue
                  </a>{" "}
                  and the crescents near the{" "}
                  <a href="https://www.google.com/maps/place/Devon+Golf+and+Conference+Centre/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Devon Golf &amp; Conference Centre
                  </a>{" "}
                  get the same crews and the same checklist. Those crews are reference-checked before a first job and rated by the customer after every visit, which is how the rating stays at {RATING_CLAIM}; the{" "}
                  <Link to="/reviews/" className="text-primary underline underline-offset-2 font-medium">{REVIEW_COUNT} Google reviews</Link>{" "}
                  are all on the listing, unedited. The full menu, with a starting price on each line, is on{" "}
                  <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">every Edmonton cleaning service with its starting price</Link>.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Landmarks */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Life</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Around Devon
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>Devon exists because of the Leduc No. 1 well, drilled in 1947, and the Leduc No. 1 Energy Discovery Centre just east of town is where that story is kept. The other names on the map: the University of Alberta Botanic Garden, the Devon Museum, River Valley Adventure Co. on the river, and Voyageur Park at the bottom of the hill.</p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Interactive Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-8">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Find Us in Devon
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We serve all of Devon and surrounding communities including Leduc, Calmar, and Beaumont.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38000.0!2d-113.73170!3d53.36335!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a01f8b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sDevon%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Devon Service Area Map"
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
                Cleaning Services for Devon Homes
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
                Why Devon Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                What the booking includes, on every visit.
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

      {/* Local Coverage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              Near Devon: other communities we clean
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              Devon and Leduc are next to each other, and the same crews cover both. We do{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Leduc</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Beaumont</Link>{" "}
              to the east, and{" "}
              <Link to="/cleaning-services-stony-plain/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Stony Plain</Link>{" "}
              to the northwest, across the river. Our{" "}
              <Link to="/cleaning-services-fort-saskatchewan/" className="text-primary underline underline-offset-2 font-medium">Fort Saskatchewan house cleaners</Link>{" "}
              work the opposite corner of the region. Each of those towns is outside city limits and carries the {TRAVEL_FEE} travel fee, the same as Devon.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Devon? We also handle{" "}
              <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Edmonton region
              </Link>.
            </p>

          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="Ground truth"
        heading="Planned in one go, in 1947"
        paragraphs={[
          "Imperial Oil built this town from nothing after the Leduc No. 1 well came in on 13 February 1947, and it was the first community in Canada approved by a regional planning commission. A place laid out all at once ages all at once: the original streets share a build era, a floor plan vocabulary and a set of finishes, so the same rooms reach the same wear points across whole blocks rather than house by house.",
          "The townsite sits on the south bank of the North Saskatchewan about 26 km southwest of Edmonton, with the river valley and its trail network immediately below. Households backing that edge bring the valley home — mud through the thaw, seed and pollen in early summer — and it concentrates at whichever door faces the slope.",
        ]}
      />

      <LocationPricing />

      {/* Which clean, and what it costs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Choosing</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                Standard, deep or move-out: which one to book in Devon
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  For a house that is kept up, book the standard clean, from {STANDARD_FROM}, and put it on a repeating schedule for the discount. The deep clean, from {DEEP_FROM}, is the right first visit for a house that has not been professionally cleaned before, because the baseboards and fan blades only need doing once before a standard visit can keep them. For a rental handover, book{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">Devon move-out cleaning</Link>{" "}
                  from {MOVE_FROM} and have the house empty first; a crew cannot clean the inside of a cupboard that still has plates in it.
                </p>
                <p>
                  If the property is a short-term rental, the job is a turnover between guests rather than a scheduled clean, and it is priced by the hour on the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb turnover cleaning in Edmonton</Link>{" "}
                  page. For every tier and every add-on in one table, see{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">what each home size costs in Edmonton</Link>, then add the {TRAVEL_FEE} travel fee for a Devon address.
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Questions about house cleaning in Devon</h2>
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
              Book house cleaning in Devon
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
