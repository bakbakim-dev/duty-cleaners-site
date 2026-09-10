import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import LocationPricing from "@/components/LocationPricing"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, ExternalLink, PaintRoller
} from "lucide-react";
import stonyPlainHome from "@/assets/gallery/stony-plain-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice } from "@/data/pricing";
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
const REVIEW_COUNT = CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount;

const PAGE_TITLE = `House Cleaning Stony Plain from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `House cleaning in Stony Plain, home of the downtown murals: standard cleans from ${STANDARD_FROM}, flat by home size, rated ${RATING_CLAIM}. Pay after the clean.`;

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Stony Plain" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Baseboards, ceiling fans, vents and switch plates, on top of the standard scope.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Stony Plain" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "The empty-house clean for handover day, appliance and cabinet interiors included.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Stony Plain" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared properly after renos and handovers.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Stony Plain" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Stony Plain" },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${REVIEW_COUNT} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day openings most weeks, when a crew has room." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Cleaners who work to the Duty Cleaners checklist and are rated by the customer after each visit." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we'll return to make it right — at no additional charge.` },
];

const landmarks = [
  { name: "Heritage Park", url: "https://www.google.com/maps/place/Heritage+Park,+Stony+Plain,+AB/" },
  { name: "Rotary Park", url: "https://www.google.com/maps/place/Rotary+Park,+Stony+Plain,+AB/" },
  { name: "Stony Plain Pioneer Museum", url: "https://www.google.com/maps/place/Multicultural+Heritage+Centre,+Stony+Plain,+AB/" },
  { name: "Main Street (50th Avenue)", url: "https://www.google.com/maps/place/50+Ave,+Stony+Plain,+AB/" },
  { name: "Whispering Waters Park", url: "https://www.google.com/maps/place/Whispering+Waters+Park,+Stony+Plain,+AB/" },
  { name: "Stony Plain Golf Course", url: "https://www.google.com/maps/place/Stony+Plain+Golf+Course,+Stony+Plain,+AB/" },
];

const nearbyCommunities = ["Spruce Grove", "Parkland County", "Acheson", "Carvel", "Duffield"];

export default function StonyPlain() {
  const faqs = [
    {
      question: "Does house cleaning in Stony Plain include a travel fee?",
      answer: `It does, because Stony Plain is outside Edmonton city limits. The travel fee is ${TRAVEL_FEE} per booking, added at booking and included in the total you confirm. The rate for the clean itself is the same flat rate an Edmonton address pays for the same size of home.`
    },
    {
      question: "How soon can you come out to Stony Plain?",
      answer: `Same-day when a crew has room, next-day more often, and a day or two out almost always. Phone the Edmonton office for a same-day answer. Crews arrive within one of three windows, ${ARRIVAL_WINDOWS.join(", ")}, and you do not need to be home if you leave a key or a code.`
    },
    {
      question: "Do you do move-in and move-out cleaning in Stony Plain?",
      answer: `Yes. Move-in and move-out cleans are ${MOVE_FROM} to ${MOVE_TOP} by bedroom count. The difference from a standard clean is the closed things: oven interior, fridge interior, and the inside of kitchen and bathroom cabinets, which are add-ons on a standard visit and part of the job on a move-out. The house needs to be empty first.`
    },
    {
      question: "What is the price of a standard clean in Stony Plain?",
      answer: `${STANDARD_FROM} for a one-bedroom, ${STANDARD_TOP} for five or more bedrooms, before GST, and the ${TRAVEL_FEE} travel fee on top. A deep clean of a one-bedroom is ${DEEP_FROM}. Book weekly and the standard price drops 20% from the second visit; bi-weekly drops it 15% and every four weeks drops it 10%.`
    },
    {
      question: "Should I leave out cleaning supplies?",
      answer: `Only if there is something particular you want used. Otherwise the crew brings its own products, cloths, mop and vacuum. Eco-friendly products are ${POLICY.ecoProductsFee} extra: ${POLICY.ecoProductsHowToRequest}. Running water is required, and vacuuming needs the power on.`
    },
    {
      question: "What if I am not happy with part of the clean?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and we return to redo that part at no charge, and we do not ask for photos before we come. Cancelling inside ${POLICY.cancellationNoticeHours} hours costs ${POLICY.cancellationFee}; a lockout, where the crew arrives and cannot get in, is charged at ${POLICY.lockoutFee}.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-stony-plain/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-stony-plain/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Stony Plain, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-stony-plain", areaServed: "Stony Plain, AB" }))}</script>
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
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Stony Plain, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Stony Plain
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                A standard clean in Stony Plain is {STANDARD_FROM} to {STANDARD_TOP} by bedroom count, and a deep clean starts at {DEEP_FROM}. Flat rates, shown before you book. Rated {RATING_CLAIM}.
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
              <img width={800} height={608}
                src={stonyPlainHome}
                alt="A charming residential home in Stony Plain, Alberta"
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
                House cleaning in Stony Plain, at a flat rate
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                Stony Plain is west of Edmonton, past Spruce Grove. We clean the older streets off Main Street and the newer developments on the edge of town at the same flat rate, set by bedroom count and shown before you book: from {STANDARD_FROM} for a one-bedroom. Stony Plain is outside Edmonton city limits, so a {TRAVEL_FEE} travel fee is added at booking.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                Crews work around Heritage Park, Rotary Park and the Multicultural Heritage Centre most weeks. Each cleaner is reference-checked before a first job and rated by the customer after every visit; the rating across both cities is {RATING_CLAIM}, and{" "}
                <Link to="/reviews/" className="text-primary underline underline-offset-2 font-medium">the reviews page</Link>{" "}
                shows them unedited. For the whole menu with a starting price on each line, see{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all the cleaning services we run in Edmonton</Link>.
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                {landmarks.map((landmark, i) => (
                  <a
                    key={i}
                    href={landmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-primary/5 hover:bg-primary/10 rounded-lg px-4 py-3 transition-colors group"
                  >
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm font-medium text-foreground">{landmark.name}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
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
                Around Stony Plain
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>The town was settled in the late 1800s and the downtown core from that era still stands, painted with murals of the town's own history, and a self-guided tour of them starts downtown. The Multicultural Heritage Centre keeps the local artwork and runs the workshops; Shikaoi Park is the garden.</p>
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
                Cleaning Services for Stony Plain Homes
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
                Why Stony Plain Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                The same terms on every visit.
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

      <LocationPricing />

      {/* Which clean, and what it costs */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Choosing</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                Which clean to book for a Stony Plain home
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  An older house near the downtown murals, with original wood and plaster, is a standard clean from {STANDARD_FROM} done gently, and it is worth saying at booking that the finishes are period ones. A newer house on the edge of town that has never had a professional clean starts better with the deep clean from {DEEP_FROM}, so the baseboards and fan blades are done once before a standard schedule takes over. A handover needs{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">move-in and move-out cleaning in Stony Plain</Link>, from {MOVE_FROM}, with the house empty.
                </p>
                <p>
                  A suite let to visitors is a turnover between guests, priced by the hour; the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">short-term rental cleaning in Edmonton</Link>{" "}
                  page explains how that is booked. Every tier and add-on is listed under{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">Edmonton cleaning prices for every bedroom count</Link>; add the {TRAVEL_FEE} travel fee for a Stony Plain address.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="What we see"
        heading="Murals on the old downtown"
        paragraphs={[
          "The old downtown here is painted — dozens of murals covering the town's own history — and the heritage buildings behind them are the reason the interiors run older than the newer subdivisions suggest. Original wood, plaster and period tile need a gentler method than a modern finish does: damp and wrung out, no abrasive pad, and time given to the material rather than pressure applied to it.",
          "The town shares a boundary with Spruce Grove and is otherwise wrapped by Parkland County, so open country starts a short way past the last streets in most directions. That is a wind exposure rather than a traffic one, and it lands on window screens and the outward face of the glass rather than on floors.",
        ]}
      />

      <NearbyNeighbourhoods />

      {/* Interactive Map */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Service Area</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Our Stony Plain Service Area
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stony Plain and the Parkland County communities around it.
              </p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38000.0!2d-114.00487!3d53.52899!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x539ff70e3f41d2ad%3A0x4399e4bfc1b1e30d!2sStony%20Plain%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Stony Plain Service Area Map"
              />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Local Coverage */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              Near Stony Plain: other communities we clean
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              Stony Plain shares a boundary with Spruce Grove, so our{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Spruce Grove</Link>{" "}
              are the same crews on the same days. South of the river our{" "}
              <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">Devon house cleaners</Link>{" "}
              cover the river town to the south, and we do{" "}
              <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Beaumont</Link>{" "}
              on the far side of the city. Northeast, we run{" "}
              <Link to="/cleaning-services-fort-saskatchewan/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Fort Saskatchewan</Link>. All four are outside Edmonton city limits and carry the same {TRAVEL_FEE} travel fee as Stony Plain.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {nearbyCommunities.map((community, i) => (
                <span key={i} className="bg-white/70 border border-border rounded-full px-5 py-2 text-sm font-medium text-foreground">
                  {community}
                </span>
              ))}
            </div>
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Stony Plain? We also handle{" "}
              <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Edmonton region
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Stony Plain house cleaning questions</h2>
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
              Book house cleaning in Stony Plain
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
