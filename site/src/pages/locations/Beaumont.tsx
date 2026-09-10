import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM, COMPANY } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import beaumontLandmark from "@/assets/gallery/beaumont-landmark.webp";
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

const PAGE_TITLE = `House Cleaning Beaumont from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `House cleaning in Beaumont from ${STANDARD_FROM}, flat by home size. Standard, deep and move-out cleans, rated ${RATING_CLAIM}. Pay after the clean.`;

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
  { icon: Home, title: "Standard Cleaning", description: "One visit, every room, one flat rate set by bedroom count.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Beaumont" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Baseboards, fans, vents and the surfaces a standard visit does not reach.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Beaumont" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "The empty-house clean, done to the standard a landlord checks against.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Beaumont" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Drywall dust and site debris cleared after a renovation or a new build.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Beaumont" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Beaumont" },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${REVIEW_COUNT} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day slots when the schedule allows." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Cleaners trained to the Duty Cleaners checklist, and rated by you after every visit." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we'll return to make it right — at no additional charge.` },
];

const nearbyAreas = [
  "Leduc", "Nisku", "New Sarepta", "Calmar", "Devon", "South Edmonton", "Ellerslie", "Heritage Valley"
];

export default function Beaumont() {
  const faqs = [
    {
      question: "Is there a travel fee for house cleaning in Beaumont?",
      answer: `Yes. Beaumont is outside Edmonton city limits, so a ${TRAVEL_FEE} travel fee is added to every booking here. It is added when you book, it is in the total before you confirm, and it is the same amount for a standard clean, a deep clean or a move-out.`
    },
    {
      question: "Can I get same-day cleaning in Beaumont?",
      answer: `Sometimes. Same-day and next-day slots come up when a crew has room, and the office can tell you in one call whether today is one of those days. Arrival windows are ${ARRIVAL_WINDOWS.join(", ")}. Booking a day or two ahead is the reliable way to get the window you want.`
    },
    {
      question: "Do you do move-out cleaning in Beaumont?",
      answer: `Yes. A move-in or move-out clean in Beaumont is ${MOVE_FROM} to ${MOVE_TOP} depending on bedroom count, and it covers the empty house: inside the oven and fridge, inside cupboards and drawers, baseboards, and the marks a landlord or buyer walks in looking for. Book it for the day after the movers, once the rooms are clear.`
    },
    {
      question: "How much does a standard clean cost in Beaumont?",
      answer: `${STANDARD_FROM} for a one-bedroom up to ${STANDARD_TOP} for five or more bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee. A deep clean starts at ${DEEP_FROM}. The rate is flat: it is set by the size of the home, not by how long the crew is there, and it does not change once you have booked.`
    },
    {
      question: "Do I need to have cleaning supplies at the house?",
      answer: `No. The crew brings its own products, cloths, mop and vacuum. If you would rather we used something you already own, leave it out and say so at booking. Eco-friendly products are available for ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What happens if something gets missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and we come back and do that part again at no charge. No photos are needed. Cancellations need ${POLICY.cancellationNoticeHours} hours' notice; inside that window the fee is ${POLICY.cancellationFee}.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-beaumont/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-beaumont/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Beaumont, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-beaumont", areaServed: "Beaumont, AB" }))}</script>
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
                <span className="text-white/90 text-sm font-medium">Serving Beaumont, AB Region</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Beaumont
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                Flat-rate house cleaning in Beaumont from {STANDARD_FROM} for a one-bedroom, rated {RATING_CLAIM}. You see the price before you book and pay after the clean. Cleaning Alberta homes {COMPANY.sinceLabel}.
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
              <img width={800} height={544}
                src={beaumontLandmark}
                alt="A neighbourhood park with a playground on a clear summer day"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover border-2 border-white/10"
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
                House cleaning in Beaumont, priced by home size
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Beaumont is south of Edmonton, next to Nisku and Leduc. We clean homes across the city: around{" "}
                  <a href="https://www.google.com/maps/place/Four+Seasons+Park,+Beaumont,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Four Seasons Park
                  </a>,{" "}
                  <a href="https://www.google.com/maps/place/Beaumont+Community+Centre,+Beaumont,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Ken Nicol Regional Park
                  </a>, the{" "}
                  <a href="https://www.google.com/maps/place/Centre+Communautaire+Beaumont+Community+Centre/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Beaumont Community Centre
                  </a>{" "}
                  and the shops along{" "}
                  <a href="https://www.google.com/maps/place/50+Ave,+Beaumont,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    50th Avenue
                  </a>. The rate is flat and set by bedroom count, from {STANDARD_FROM} for a one-bedroom, and because Beaumont is outside Edmonton city limits a {TRAVEL_FEE} travel fee is added at booking. It is in the total before you confirm, not a surprise on the invoice afterwards.
                </p>
                <p>
                  Every cleaner is reference-checked before a first job and rated by the customer after each visit; the ratings decide who we keep sending. Across both cities the rating is {RATING_CLAIM}, and you can{" "}
                  <Link to="/reviews/" className="text-primary underline underline-offset-2 font-medium">read the reviews</Link>{" "}
                  before you book. If you want the whole menu in one place, see{" "}
                  <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>.
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
                Around Beaumont
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>The landmarks we route by: St. Vital Church on the hill, the Beaumont Farmers Market, the Beaumont &amp; District Heritage Society, Four Seasons Park, and Chartier on the old main street. The downtown keeps its red brick walkways; most of the housing around it is newer than the street front suggests, and that matters more to a quote than the postcard does.</p>
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
                Cleaning Services for Beaumont Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                From routine upkeep to deep cleans and move-outs — every service a home needs.
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
                Why Beaumont Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                The same terms on every visit, in Beaumont or anywhere else we go.
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
              Near Beaumont: other communities we clean
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              The same crews cover the towns around the city. We do{" "}
              <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Devon</Link>{" "}
              to the west, and we are a{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">Leduc cleaning company</Link>{" "}
              as much as a Beaumont one, the two being next door. On the far side of Edmonton we run{" "}
              <Link to="/cleaning-services-fort-saskatchewan/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Fort Saskatchewan</Link>, and we send{" "}
              <Link to="/cleaning-services-stony-plain/" className="text-primary underline underline-offset-2 font-medium">Stony Plain house cleaners</Link>{" "}
              out past Spruce Grove. All of these are outside city limits, so all of them carry the same {TRAVEL_FEE} travel fee Beaumont does.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Beaumont? We also handle{" "}
              <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Edmonton region
              </Link>.
            </p>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="What we see here"
        heading="The hill, then the fields"
        paragraphs={[
          "Beaumont was named in 1895 for the hill it stands on, and St. Vital Church has held the top of that rise since 1919. The city is still high ground with farmland close at the edges, and little stands between the newest streets and the nearest field. Through seeding, and again at harvest, a fine mineral grit turns up on thresholds, in door tracks and on the sills of any window left open for the evening.",
          "A village from 1973, a town from 1980, and a city only since 2019 — the population rose by a fifth between the 2016 and 2021 censuses alone. Most of what we clean is the product of that run: large, recent family houses where the difficulty is arithmetic, not grime. More bathrooms, more floor, more glass than the street frontage suggests. The honest quote here is about scale.",
        ]}
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
                Which clean a Beaumont house usually needs
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A house that is kept up wants the standard clean, from {STANDARD_FROM}. A house that has gone a season without one, or has just come through a renovation, wants the deep clean from {DEEP_FROM}: the baseboards, the fan blades, the vent covers and the light switches are where that money goes. An empty house on handover day wants{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">move-out cleaning in Beaumont</Link>, from {MOVE_FROM}, because a landlord or a buyer checks the inside of the oven and the cupboards, and a standard clean does not open them.
                </p>
                <p>
                  Hosts with a suite or a whole house on a booking platform are a different job again, with a turnaround between guests rather than a schedule; that is priced by the hour and described on the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>{" "}
                  page. Every tier by bedroom count, and every add-on, is on the{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">Edmonton house cleaning prices by home size</Link>{" "}
                  page. Add the {TRAVEL_FEE} travel fee to any of those figures for a Beaumont address.
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
                Beaumont Service Area
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Beaumont and the Edmonton communities around it, on the map.
              </p>
            </div>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-border">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38400.0!2d-113.41514!3d53.35255!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a01e8b8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sBeaumont%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Beaumont Service Area Map"
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Beaumont house cleaning questions</h2>
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
              Book house cleaning in Beaumont
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
