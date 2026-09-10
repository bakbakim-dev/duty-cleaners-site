import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import leducChildDog from "@/assets/gallery/leduc-child-dog-clean-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Every price on this page is read from bk-config through pricing.ts.
const STANDARD = standardTierRows();
const DEEP = deepCleanTierRows();
const MOVE = moveInOutTierRows();
const STANDARD_FROM = STANDARD[0].price;
const STANDARD_TO = STANDARD[STANDARD.length - 1].price;
const DEEP_FROM = DEEP[0].price;
const DEEP_TO = DEEP[DEEP.length - 1].price;
const MOVE_FROM = MOVE[0].price;
const MOVE_TO = MOVE[MOVE.length - 1].price;
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
const PAGE_TITLE = `House Cleaning Leduc from ${STANDARD_FROM} | Duty Cleaners`;
const META_DESCRIPTION = `House cleaning in Leduc from ${STANDARD_FROM}, Telford Lake to Fred Johns Park. Standard, deep and move-out cleans at a flat price you see before you book.`;

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Leduc" },
  { icon: Sparkles, title: "Deep Cleaning", description: "Top-to-bottom detail that reaches what weekly cleaning never does.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Leduc" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Move-day cleaning done to the standard landlords check for.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Leduc" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after a renovation or a new build.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Leduc" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Leduc" },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day slots when the schedule allows." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Cleaners trained to the Duty Cleaners checklist, and rated by you after every visit." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const nearbyAreas = [
  "Nisku", "Beaumont", "Devon", "Calmar", "Millet",
  "New Sarepta", "Thorsby", "Warburg"
];

export default function Leduc() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in Leduc?",
      answer: `Yes. Leduc is 33 km south of Edmonton and outside its city limits, so a ${TRAVEL_FEE} travel fee is added to each home-cleaning booking. The flat rate for the clean is the same as inside Edmonton; the fee is the only difference.`
    },
    {
      question: "What does a standard clean in Leduc cost?",
      answer: `From ${STANDARD_FROM} for a one-bedroom to ${STANDARD_TO} for five bedrooms or more, flat, before the travel fee and GST. Adding the deep clean package takes the range to ${DEEP_FROM} to ${DEEP_TO}. Book weekly and the second visit onward is 20% off; every two weeks is 15% off; every four weeks is 10% off.`
    },
    {
      question: "Can you come to Leduc same-day?",
      answer: `If the day has room, yes. Same-day and next-day slots turn up when the schedule allows; call ${CITY_PROOF.edmonton.phone} and ask. The team arrives in a window of ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]}, which matters in a city where someone is often asleep after a night shift.`
    },
    {
      question: "Do you do move-out cleaning in Leduc?",
      answer: `Yes. A move-in or move-out clean is ${MOVE_FROM} to ${MOVE_TO} by home size, plus the travel fee, and it covers the inside of the oven, the fridge and the cabinets without add-ons.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning in Leduc and Edmonton" }
    },
    {
      question: "Do you bring supplies to Leduc?",
      answer: `Yes, everything: products, cloths, vacuum and mop. Eco-friendly products are ${POLICY.ecoProductsFee} extra, and the way to get them is to ${POLICY.ecoProductsHowToRequest}. The post-war bungalows near the old core and the new builds in Southfork have different floors, and the kit covers both.`
    },
    {
      question: "How long does a first clean in Leduc take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
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
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-leduc/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Leduc, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-leduc", areaServed: "Leduc, AB" }))}</script>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 max-w-6xl mx-auto">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Leduc, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Leduc
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                House cleaning in Leduc, rated {RATING_CLAIM}. Standard cleans from {STANDARD_FROM}, deep cleans from {DEEP_FROM}, flat by home size, all supplies included.
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
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
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
                src={leducChildDog}
                alt="A child and dog playing together in a freshly cleaned home in Leduc, Alberta"
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
                House cleaning in Leduc
              </h2>
              <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                <p>
                  Leduc is 33 km south of Edmonton, beside the Edmonton International Airport. We clean across the city, from the established streets near{" "}
                  <a href="https://www.google.com/maps/place/William+F.+Lede+Park,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    William F. Lede Park
                  </a>{" "}
                  and{" "}
                  <a href="https://www.google.com/maps/place/Fred+Johns+Park,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Fred Johns Park
                  </a>{" "}
                  to the newer ones in Southfork and Bridgeport, and around{" "}
                  <a href="https://www.google.com/maps/place/Telford+Lake,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Telford Lake
                  </a>, the{" "}
                  <a href="https://www.google.com/maps/place/Leduc+Recreation+Centre/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Leduc Recreation Centre
                  </a>{" "}
                  and the shops on{" "}
                  <a href="https://www.google.com/maps/place/50+Ave,+Leduc,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    50th Avenue
                  </a>.
                </p>
                <p>
                  Many households here work a rotation rather than a weekday. Tell us at booking if someone will be asleep and the room order changes at no cost.
                </p>
                <p>
                  Hosts in Leduc with a suite let to airport travellers can book turnovers as{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>, with the travel fee added.
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
                Around Leduc
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>The Leduc #1 Energy Discovery Centre covers the 1947 oil strike the city is known for. Telford Lake Park has walking trails, picnic areas and a beach. The Maclab Centre for the Performing Arts hosts theatre.</p>
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
                Find Us in Leduc
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We serve all of Leduc and the communities around it, including Nisku,{" "}
                <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Beaumont</Link>{" "}
                and{" "}
                <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">Devon house cleaners</Link>.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75904.04936517384!2d-113.55117!3d53.26078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a018e7b3e3f5ab%3A0x60e2ac0e20373bfa!2sLeduc%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Leduc Service Area Map"
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
                Cleaning Services for Leduc Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep, move-out, post-construction and wall washing, each at a flat rate by home size. For the add-ons and every checklist, see{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>.
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
                A Leduc cleaning company that quotes before you book
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                The price is on screen before you confirm, nothing is charged until the clean is done, and the cleaner is rated by you afterwards.{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">Read the reviews</Link>{" "}
                those ratings add up to.
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
              Cleaning services in Leduc and the towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Near Leduc, the other communities we clean from the same Edmonton office are{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Sherwood Park</Link>{" "}
              to the northeast,{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Spruce Grove</Link>{" "}
              to the northwest, and{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert house cleaners</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Morinville</Link>{" "}
              on the far side of the city. All of them sit outside Edmonton city limits, so the {TRAVEL_FEE} travel fee Leduc pays applies there too.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Leduc? We also handle{" "}
              <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Edmonton region
              </Link>.
            </p>

          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="From the route"
        heading="A city built beside an airport"
        paragraphs={[
          "Leduc sits 33 km south of Edmonton and directly beside the international airport, and a good share of the households we clean work to a rotation rather than a weekday. Somebody may be asleep at two in the afternoon. Tell us which room and the order the house gets done in changes at no cost — it is the vacuum, not the schedule, that has to move.",
          "The city has grown hard since the 1947 oil strike that carries its name, past 34,000 at the last census, so the housing runs from post-war bungalows near the old core to subdivisions finished in the last few years. Those two ends want opposite handling: painted softwood and original tile on one, sealed stone and engineered plank on the other.",
        ]}
      />

      <LocationPricing />

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
                      <AccordionContent className="text-muted-foreground whitespace-pre-line">
                        {faq.answer}
                        {faq.link && (
                          <>
                            {" "}
                            <Link to={faq.link.to} className="text-primary underline underline-offset-2 font-medium">{faq.link.text}</Link>
                          </>
                        )}
                      </AccordionContent>
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
              See your Leduc price before you book
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
