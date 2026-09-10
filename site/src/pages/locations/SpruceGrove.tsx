import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import spruceGroveFamilyHome from "@/assets/gallery/spruce-grove-family-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Figures come from bk-config through pricing.ts; nothing here is hand-typed.
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
const PAGE_TITLE = `House Cleaning Spruce Grove from ${STANDARD_FROM} | Duty Cleaners`;
const META_DESCRIPTION = `House cleaning in Spruce Grove from ${STANDARD_FROM}, 11 km west of Edmonton. Standard, deep and move-out cleans, flat by home size, paid after the visit.`;

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Spruce Grove" },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces regular visits skip.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Spruce Grove" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inspection-grade detail for moving out or settling in.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Spruce Grove" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after renovations and handovers.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Spruce Grove" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Spruce Grove" },
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day openings most weeks." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Professional cleaners who work to the Duty Cleaners checklist." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const nearbyAreas = [
  "Stony Plain", "Parkland County", "Acheson", "Entwistle",
  "Seba Beach", "Wabamun", "Edmonton"
];

export default function SpruceGrove() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in Spruce Grove?",
      answer: `Yes. Spruce Grove is its own city, outside Edmonton's limits, so home-cleaning bookings here carry a ${TRAVEL_FEE} travel fee on top of the flat rate. The flat rate itself is the same figure Edmonton pays for the same size of home.`
    },
    {
      question: "What does a standard clean cost in Spruce Grove?",
      answer: `${STANDARD_FROM} for one bedroom, up to ${STANDARD_TO} for five or more, before the travel fee and 5% GST. The deep clean package on top brings the range to ${DEEP_FROM} to ${DEEP_TO}. Weekly, bi-weekly and every-four-weeks schedules are discounted 20%, 15% and 10% from the second clean on.`
    },
    {
      question: "Do you come out to Spruce Grove same-day?",
      answer: `When there is room in the day. Same-day and next-day openings come up most weeks; call ${CITY_PROOF.edmonton.phone} to check. The team arrives inside a window of ${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]}, and you do not need to be home if there is a lockbox or a code.`
    },
    {
      question: "Do you do move-out cleaning in Spruce Grove?",
      answer: `Yes, and on a new build a move-in clean is often the better order: vents and grilles first, then surfaces. Move-in and move-out cleans run ${MOVE_FROM} to ${MOVE_TO} by home size plus the travel fee, with oven, fridge and cabinet interiors included.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning, Edmonton and Spruce Grove" }
    },
    {
      question: "Do you bring the supplies?",
      answer: `Yes. Products, cloths, vacuum and mop all arrive with the team. Eco-friendly products cost ${POLICY.ecoProductsFee} more: ${POLICY.ecoProductsHowToRequest}. Running water is required, and vacuuming needs power.`
    },
    {
      question: "How long does a first clean in Spruce Grove take?",
      answer: `We work to a checklist, not a clock. The crew stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-spruce-grove/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-spruce-grove/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Spruce Grove, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-spruce-grove", areaServed: "Spruce Grove, AB" }))}</script>
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
                <span className="text-white/90 text-sm font-medium">Serving Spruce Grove, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Spruce Grove
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                Standard cleans in Spruce Grove from {STANDARD_FROM} and deep cleans from {DEEP_FROM}, flat by home size and rated {RATING_CLAIM}. Same-day and next-day openings most weeks.
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
                src={spruceGroveFamilyHome}
                alt="A family in a clean living room in Spruce Grove, Alberta"
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
                House cleaning in Spruce Grove
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Spruce Grove is 11 km west of Edmonton, with Stony Plain next door and Parkland County on every other side. We clean homes across the city, from the streets around{" "}
                  <a href="https://www.google.com/maps/place/Jubilee+Park,+Spruce+Grove,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">Jubilee Park</a>{" "}
                  and the{" "}
                  <a href="https://www.google.com/maps/place/Spruce+Grove+Grain+Elevator+Museum/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">Grain Elevator Museum</a>{" "}
                  to the homes out by{" "}
                  <a href="https://www.google.com/maps/place/The+Links+at+Spruce+Grove/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">The Links at Spruce Grove</a>.
                </p>
                <p>
                  A first visit here starts in one of two places. In a house finished recently it is the vents, before any surface. In an older one it is the sills and the screen mesh, where the county's field soil settles.
                </p>
                <p>
                  Hosts in Spruce Grove letting a suite can book turnovers as{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>, with the same travel fee applied.
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
                Around Spruce Grove
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>Spruce Grove dates from 1891, when French and Scottish families settled here. The Spruce Grove Grain Elevator Museum is the last wooden grain elevator in the area. Jubilee Park has walking trails and a pond, The Links at Spruce Grove is the golf course, and the Spruce Grove Art Gallery shows local work.</p>
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
                Cleaning Services for Spruce Grove Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Standard, deep, move-out, post-construction and wall washing, priced flat by home size. The page listing{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>{" "}
                has the add-ons and the checklist for each.
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
                Spruce Grove house cleaners, rated after every visit
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Each clean ends with a rating from the customer, and those ratings decide who keeps working for us.{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">Read the reviews</Link>{" "}
                to see what they say.
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
              Cleaning services in Spruce Grove, Stony Plain and Parkland County
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Near Spruce Grove, the other communities we clean from the Edmonton office are{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert house cleaners</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Morinville</Link>{" "}
              to the north,{" "}
              <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Sherwood Park</Link>{" "}
              on the far side of the city and a{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">Leduc cleaning company</Link>{" "}
              to the south. Like Spruce Grove, each is outside Edmonton city limits and carries the {TRAVEL_FEE} travel fee.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Spruce Grove? We also handle{" "}
              <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Edmonton region
              </Link>.
            </p>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Ground truth"
        heading="What Parkland County blows in"
        paragraphs={[
          "Parkland County wraps the city on every side, and Stony Plain is its only urban neighbour. North and south of the limits that county land is prime cropland, worked at both ends of the season: seeding in May, combines from late August. Both put fine mineral soil in the air, and it settles along sills, in screen mesh and on top of door frames. Grit like that scratches if you wet it first, so it comes off dry, vacuum then cloth.",
          "Between the 2016 and 2021 censuses the count went from 34,066 residents to 37,645, and a jump that size arrives as new houses. Freshly finished homes hold drywall fines in ductwork and return-air grilles long after possession day, so on a first clean the vents come before any general surface. Do the room first and the furnace puts the whole lot back through it.",
        ]}
      />

      <NearbyNeighbourhoods />

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
              Book house cleaning in Spruce Grove
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
