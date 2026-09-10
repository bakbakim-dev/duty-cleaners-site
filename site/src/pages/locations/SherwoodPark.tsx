import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import sherwoodParkHome from "@/assets/gallery/sherwood-park-home.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";

// Prices are read from bk-config through pricing.ts, never typed here.
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
// Post-construction has its own travel-fee row in bk-config, at a higher amount.
const PC_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
// Added for you, inside the city as well as outside it.
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const HOME_TYPE = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
const EDMONTON_LISTING = GOOGLE_LISTINGS.edmonton;
const PAGE_TITLE = `House Cleaning Sherwood Park from ${STANDARD_FROM} | Duty Cleaners`;
const META_DESCRIPTION = `House cleaning across Sherwood Park from ${STANDARD_FROM}: Broadmoor, Emerald Hills and Lakeland Ridge. Flat rates by home size, paid after the clean.`;

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

const WhyUsCard = ({
  icon: Icon,
  title,
  description,
  link,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  /** Present on the rating card, which cites the listing the count comes from. */
  link?: { href: string; text: string };
}) => (
  <div className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">
      {description}
      {link && (
        <>
          {" "}
          <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-2 font-medium">
            {link.text}
          </a>
        </>
      )}
    </p>
  </div>
);

const services = [
  { icon: Home, title: "Standard Cleaning", description: "A thorough one-time cleaning to bring the whole home back to baseline.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Sherwood Park" },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces regular visits skip.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Sherwood Park" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Move-day cleaning done to the standard landlords check for.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Sherwood Park" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared properly after renos and handovers.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Sherwood Park" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Sherwood Park" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The same standard clean on a weekly, bi-weekly or every-four-weeks visit, from ${STANDARD_FROM}. The discount starts on the second clean and there is no contract.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Sherwood Park" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `That is the Edmonton listing, the one a Sherwood Park clean is rated on, and it holds ${CITY_PROOF.edmonton.googleReviewCount} reviews.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "Open the Google listing" } },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day slots when the schedule allows." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Cleaners trained to the Duty Cleaners checklist, and rated by you after every visit." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

const nearbyAreas = [
  "Summerwood", "Clarkdale Meadows", "Lakeland Ridge", "Emerald Hills", "Broadmoor", "Nottingham", "Mills Haven", "Foxboro"
];

export default function SherwoodPark() {
  const faqs: { question: string; answer: string; link?: { to: string; text: string } }[] = [
    {
      question: "Is there a travel fee in Sherwood Park?",
      answer: `Yes. Sherwood Park is in Strathcona County, outside Edmonton city limits, so a ${TRAVEL_FEE} travel fee is added to each home-cleaning booking, and a post-construction clean carries a higher one at ${PC_TRAVEL_FEE}. Set against an Edmonton address, that fee is the only difference. The clean is the same flat rate, and the pet charge and the home-type surcharges are charged here on the same terms as in the city: ${PET_FEE} per visit if there are pets in the house, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or a basement suite, ${HOME_TYPE.townhouse} for a townhouse and ${HOME_TYPE.twoStorey} for a two-storey.`
    },
    {
      question: "What does a standard clean in Sherwood Park cost?",
      answer: `A one-bedroom is ${STANDARD_FROM} and a home with five or more bedrooms is ${STANDARD_TO}, with the sizes between priced in steps. Add the travel fee and 5% GST. A deep clean runs ${DEEP_FROM} to ${DEEP_TO}, and a recurring schedule takes 20%, 15% or 10% off from the second visit depending on how often we come.`
    },
    {
      question: "Can you come out to Sherwood Park same-day?",
      answer: `Sometimes. Same-day and next-day slots depend on what the day's schedule has left; call ${CITY_PROOF.edmonton.phone} and ask. Bookings are made to an arrival window (${ARRIVAL_WINDOWS[0]}, ${ARRIVAL_WINDOWS[1]} or ${ARRIVAL_WINDOWS[2]}) rather than to a fixed minute, and you do not need to be home if you leave a key or a code.`
    },
    {
      question: "Do you do move-out cleaning in Sherwood Park?",
      answer: `Yes. Move-in and move-out cleans are ${MOVE_FROM} to ${MOVE_TO} by home size before the travel fee, and the oven, fridge and cabinet interiors are covered rather than added on.`,
      link: { to: "/move-out-cleaning-edmonton/", text: "Move-out cleaning for Sherwood Park and Edmonton" }
    },
    {
      question: "Do you bring your own supplies?",
      answer: `Yes. The team arrives with all cleaning products and equipment. Eco-friendly products are ${POLICY.ecoProductsFee} extra: ${POLICY.ecoProductsHowToRequest}. If you prefer a particular product on a surface, a sealed stone counter for instance, leave it out with a note and the team uses it.`
    },
    {
      question: "How long does a first clean in Sherwood Park take?",
      answer: `We work to a checklist, not a clock. Your Sherwood Park team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-sherwood-park/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-sherwood-park/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Sherwood Park, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-sherwood-park", areaServed: "Sherwood Park, AB" }))}</script>
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
                <span className="text-white/90 text-sm font-medium">Serving Sherwood Park, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Sherwood Park
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                House cleaning in Sherwood Park, rated {RATING_CLAIM}. Standard cleans from {STANDARD_FROM}, deep cleans from {DEEP_FROM}, flat by home size, from Broadmoor Lake Park to Millennium Place and across the hamlet.
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
              <img width={1024} height={672}
                src={sherwoodParkHome}
                alt="A suburban home in Sherwood Park, Alberta"
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
                House cleaning in Sherwood Park
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Sherwood Park is a hamlet in Strathcona County, just east of Edmonton, with Refinery Row on its west edge. We clean homes across it, from{" "}
                  <a href="https://www.google.com/maps/place/Broadmoor+Lake+Park,+Sherwood+Park,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Broadmoor Lake Park</a>{" "}
                  and{" "}
                  <a href="https://www.google.com/maps/place/Millennium+Place,+Sherwood+Park,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Millennium Place</a>{" "}
                  to{" "}
                  <a href="https://www.google.com/maps/place/Sherwood+Park+Mall,+Sherwood+Park,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Sherwood Park Mall</a>{" "}
                  and{" "}
                  <a href="https://www.google.com/maps/place/Heritage+Hills+Park,+Sherwood+Park,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Heritage Hills Park</a>,
                  and in Summerwood, Emerald Hills and Lakeland Ridge.
                </p>
                <p>
                  The crews come off the same schedule as our{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">Edmonton house cleaning</Link>{" "}
                  and work to the same checklist, with the travel fee added for a Sherwood Park address.
                </p>
                <p>
                  Hosts in Sherwood Park with a basement suite or a whole-home listing can book turnovers as{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning in Edmonton</Link>; the same travel fee applies.
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
                Around Sherwood Park
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>Strathcona Science Provincial Park has trails and lakes. The Strathcona County Museum and Archives covers the county's pioneer history. Festival Place hosts concerts, theatre and dance.</p>
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
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-6">Sherwood Park Service Area</h2>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37826.07!2d-113.29663!3d53.52570!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a0184c30c1bced%3A0x8b04fae2f1a1a0f4!2sSherwood%20Park%2C%20AB!5e0!3m2!1sen!2sca!4v1700000000000"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  title="Sherwood Park Service Area Map"
                />
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
                Cleaning Services for Sherwood Park Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Five services, each with a flat rate by home size. See{" "}
                <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">all Edmonton cleaning services and prices</Link>{" "}
                for the add-ons and what each visit includes.
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
                Sherwood Park house cleaners you rate after every visit
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                The rating you leave after a clean decides who comes back. Before you book,{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-2 font-medium">read the reviews</Link>.
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
              Cleaning services in Sherwood Park and the towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Near Sherwood Park, the other communities we clean from the Edmonton office are{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert house cleaners</Link>{" "}
              to the northwest,{" "}
              <Link to="/cleaning-services-morinville/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Morinville</Link>{" "}
              beyond it,{" "}
              <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-2 font-medium">Spruce Grove house cleaners</Link>{" "}
              on the west side and{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Leduc</Link>{" "}
              by the airport. Each is outside city limits, so each carries the same {TRAVEL_FEE} travel fee as Sherwood Park.
            </p>
            <CoverageChips areas={nearbyAreas} variant="compact" />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Sherwood Park? We also handle{" "}
              <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Edmonton region
              </Link>.
            </p>

          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="On the ground"
        heading="A hamlet of just over seventy-two thousand"
        paragraphs={[
          "Sherwood Park is officially a hamlet, which is a strange label for just over seventy-two thousand people at the 2021 census — the province recognises its urban service area as the equivalent of a city, and Strathcona County runs it. It began in 1953 as Campbelltown and took its present name three years later, so the oldest streets are now seventy years old while the outer edges are still being finished. Both ends turn up on the same week's schedule.",
          "Refinery Row lies immediately west, and the shift patterns that come with it are the thing worth telling us at booking. Plant rotations put people asleep during the day, and the room order is easy to change when we know. It costs nothing to work outward from the far end of the house instead of the near one.",
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
              See your Sherwood Park price before you book
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
