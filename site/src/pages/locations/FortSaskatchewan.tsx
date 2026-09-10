import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM, COMPANY } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import fortSaskKitchen from "@/assets/gallery/fort-saskatchewan-kitchen-clean.webp";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, formatPrice, addOnFromPrice } from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { BK_PRICE_OVERRIDES } from "@/data/bk-price-overrides";
import { GOOGLE_LISTINGS } from "@/lib/google-listings";
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
// Post-construction carries its own travel-fee row in bk-config, at a higher amount.
const PC_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
// Charged for you rather than chosen, and charged inside the city too.
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const HOME_TYPE = {
  bungalow: formatPrice(BK_PRICE_OVERRIDES[54].price),
  townhouse: formatPrice(BK_PRICE_OVERRIDES[89].price),
  twoStorey: formatPrice(BK_PRICE_OVERRIDES[90].price),
};
const EDMONTON_LISTING = GOOGLE_LISTINGS.edmonton;

const PAGE_TITLE = `House Cleaning Fort Saskatchewan from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `House cleaning in Fort Saskatchewan from ${STANDARD_FROM}, flat by home size and rated ${RATING_CLAIM}. Standard, deep and move-out cleans, paid after the clean.`;

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Fort Saskatchewan" },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces regular visits skip.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Fort Saskatchewan" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "The empty-house clean, inside the appliances and cabinets included.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Fort Saskatchewan" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Drywall dust and site debris cleared after a build or a renovation.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Fort Saskatchewan" },
  { icon: PaintRoller, title: "Wall Washing", description: "Scuffs, handprints and cooking film off painted walls, without stripping the finish.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Fort Saskatchewan" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The standard clean on a standing booking, from ${STANDARD_FROM}. Every visit after the first is 20% off weekly, 15% bi-weekly, 10% every four weeks.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Fort Saskatchewan" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `A Fort Saskatchewan clean is rated on the Edmonton listing, which carries ${CITY_PROOF.edmonton.googleReviewCount} reviews.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "Read the listing" } },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day slots when the schedule allows." },
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Team", description: "Cleaners who work to the Duty Cleaners checklist and are rated by you after each visit." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: `If something was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we'll return to make it right — at no additional charge.` },
];

const nearbyAreas = [
  "Sherwood Park", "St. Albert", "Gibbons", "Redwater",
  "Bon Accord", "Bruderheim", "Lamont", "Sturgeon County"
];

export default function FortSaskatchewan() {
  const faqs = [
    {
      question: "Is there a travel fee for cleaning in Fort Saskatchewan?",
      answer: `There is. Fort Saskatchewan is its own city, outside Edmonton's limits, so bookings here carry a ${TRAVEL_FEE} travel fee on top of the flat rate. It is one line, added at booking, and it is the same whether the clean is a standard, a deep or a move-out; post-construction is the one service with its own figure, ${PC_TRAVEL_FEE}. That line is the only thing an Edmonton address would not have. The rest of the bill is built the same way, including the pet charge and the home-type surcharges: ${PET_FEE} a visit for a home with pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "Can I book same-day cleaning in Fort Saskatchewan?",
      answer: `Often, yes, and the way to find out is to phone rather than fill in a form. Arrival windows are ${ARRIVAL_WINDOWS.join(", ")}. Booking a day or two ahead is the reliable way to get the window you want, and you do not need to be home if you leave a key or a code.`
    },
    {
      question: "Do you offer move-out cleaning in Fort Saskatchewan?",
      answer: `Yes. A move-in or move-out clean is ${MOVE_FROM} to ${MOVE_TOP} depending on bedroom count and is priced for an empty house. It covers what a standard clean leaves closed: inside the oven, inside the fridge, and inside the kitchen and bathroom cabinets. For a house nobody has lived in yet, it is also the right clean to book before the furniture arrives.`
    },
    {
      question: "How much is a standard house clean in Fort Saskatchewan?",
      answer: `${STANDARD_FROM} for a one-bedroom, rising to ${STANDARD_TOP} for a home with five or more bedrooms, before GST, and then the ${TRAVEL_FEE} travel fee. A deep clean of the same one-bedroom is ${DEEP_FROM}. On a weekly schedule the standard rate is 20% less from the second visit; bi-weekly is 15% less and every four weeks is 10% less.`
    },
    {
      question: "Do I have to provide cleaning products?",
      answer: `No. The crew arrives with everything, including the vacuum. If there is a product you want used on a particular surface, leave it out and tell us at booking. Eco-friendly products cost ${POLICY.ecoProductsFee} extra: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What is the guarantee, and what does cancelling cost?",
      answer: `If anything was missed, tell us within ${POLICY.guaranteeWindowHours} hours and we return to do it at no charge, no photos required. Cancelling or moving a booking with less than ${POLICY.cancellationNoticeHours} hours' notice costs ${POLICY.cancellationFee}. If the crew arrives and cannot get in, the charge is ${POLICY.lockoutFee}.`
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
        <link rel="canonical" href="https://dutycleaners.ca/cleaning-services-fort-saskatchewan/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={PAGE_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/cleaning-services-fort-saskatchewan/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={PAGE_DESCRIPTION} />
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Fort Saskatchewan, AB", city: "edmonton", url: "https://dutycleaners.ca/cleaning-services-fort-saskatchewan", areaServed: "Fort Saskatchewan, AB" }))}</script>
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
                <span className="text-white/90 text-sm font-medium">Serving Fort Saskatchewan, AB</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Fort Saskatchewan
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                House cleaning in Fort Saskatchewan from {STANDARD_FROM}, a flat rate you see before booking and pay after the clean. Rated {RATING_CLAIM}, cleaning Alberta homes {COMPANY.sinceLabel}.
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
              <img width={512} height={640}
                src={fortSaskKitchen}
                alt="Professional cleaner cleaning a kitchen appliance in a Fort Saskatchewan home"
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
                House cleaning in Fort Saskatchewan, priced by bedroom count
              </h2>
              <div className="prose prose-lg text-muted-foreground max-w-none space-y-4">
                <p>
                  Fort Saskatchewan is on the North Saskatchewan River, northeast of Edmonton. We clean homes from the streets around{" "}
                  <a href="https://www.google.com/maps/place/Legacy+Park,+Fort+Saskatchewan,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Legacy Park
                  </a>{" "}
                  and the{" "}
                  <a href="https://www.google.com/maps/place/North+Saskatchewan+River/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    North Saskatchewan River Valley
                  </a>{" "}
                  to the newer blocks along{" "}
                  <a href="https://www.google.com/maps/place/99+Ave,+Fort+Saskatchewan,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    99 Avenue
                  </a>{" "}
                  and near{" "}
                  <a href="https://www.google.com/maps/place/Turner+Park,+Fort+Saskatchewan,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Turner Park
                  </a>. A standard clean starts at {STANDARD_FROM} for a one-bedroom and the rate is fixed by home size, not by the clock. Fort Saskatchewan is outside Edmonton city limits, so a {TRAVEL_FEE} travel fee is added at booking and shown in the total before you confirm.
                </p>
                <p>
                  The{" "}
                  <a href="https://www.google.com/maps/place/Fort+Saskatchewan+Dow+Centennial+Centre/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Dow Centennial Centre
                  </a>{" "}
                  and the{" "}
                  <a href="https://www.google.com/maps/place/Fort+Heritage+Precinct,+Fort+Saskatchewan,+AB/" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 font-medium">
                    Fort Heritage Precinct
                  </a>{" "}
                  are the two landmarks a crew steers by. These are the crews who do our{" "}
                  <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning inside Edmonton city limits</Link>, on the same checklist and the same flat rate, with the travel fee added out here. They are reference-checked before a first job and rated by the customer after every visit, and those ratings are what keep the score at {RATING_CLAIM}; you can see{" "}
                  <Link to="/reviews/" className="text-primary underline underline-offset-2 font-medium">what customers wrote</Link>{" "}
                  before you book. The{" "}
                  <Link to="/services/" className="text-primary underline underline-offset-2 font-medium">Edmonton services list, with a starting price on each</Link>, covers everything we run here.
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
                Around Fort Saskatchewan
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>The city takes its name from the North-West Mounted Police fort of 1875, and the Fort Heritage Precinct sits on that history. The Dow Centennial Centre holds the theatre, the gallery and the fitness rooms; Legacy Park has the river trails and the picnic ground; Elk Island National Park is the campground people drive out to. The petrochemical plants are east of town.</p>
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
                Find Us in Fort Saskatchewan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fort Saskatchewan and the communities around it, including Sherwood Park, Gibbons and Bruderheim.
              </p>
            </div>
            <div className="max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-xl">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d75200.0!2d-113.21489!3d53.71286!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x53a03e0e0bffffff%3A0x9a3a0e0e0bffffff!2sFort+Saskatchewan%2C+AB!5e0!3m2!1sen!2sca!4v1700000000000!5m2!1sen!2sca"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Fort Saskatchewan Service Area Map"
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
                Cleaning Services for Fort Saskatchewan Homes
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
                Why Fort Saskatchewan Residents Choose Duty Cleaners
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

      {/* Local Coverage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              Near Fort Saskatchewan: other communities we clean
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              Our{" "}
              <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-2 font-medium">St. Albert cleaning crews</Link>{" "}
              cover the north side of the region with us. South of the city we do{" "}
              <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">Beaumont house cleaning</Link>{" "}
              and run{" "}
              <Link to="/cleaning-services-devon/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Devon</Link>{" "}
              on the river to the southwest, and we do{" "}
              <Link to="/cleaning-services-stony-plain/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Stony Plain</Link>{" "}
              out west. Every one of those towns is outside Edmonton city limits, so the {TRAVEL_FEE} travel fee applies there exactly as it does here.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in Fort Saskatchewan? We also handle{" "}
              <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">
                commercial and office cleaning across the Edmonton region
              </Link>.
            </p>

          </AnimatedSection>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="From the route"
        heading="Quiet hours in a shift town"
        paragraphs={[
          "Alberta's Industrial Heartland, which describes itself as Canada's largest hydrocarbon processing region, takes in Fort Saskatchewan and the counties around it, and enough of the households we clean run on a plant rotation that we ask about it at booking. Someone may be asleep at two in the afternoon. Tell us which room: the order a house gets done in is easy to change, and the vacuum is the part that matters.",
          "Growth here has been steep and long: roughly 2,600 residents in the mid-1950s, more than 27,000 by 2021. Southfort and Westpark were laid out generations after the older streets near the 1875 fort site, so the work swings between move-in cleans in houses nobody has lived in yet and long-settled homes where a storage room has to be emptied before it can be cleaned at all.",
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
                Matching the clean to the house
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  A house in Southfort or Westpark that the trades left a few months ago is a deep-clean first visit, from {DEEP_FROM}, because the baseboards, vent covers and fan blades need doing once, properly, before a standard visit can keep them. After that, the standard clean from {STANDARD_FROM} holds it. A house that is being handed over empty needs{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">move-out cleans in Fort Saskatchewan</Link>, from {MOVE_FROM}, with the oven, fridge and cabinet interiors part of the job rather than add-ons.
                </p>
                <p>
                  A suite listed as a short-term rental is a turnover between guests rather than a scheduled clean, priced by the hour; the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb cleaning for Edmonton-area hosts</Link>{" "}
                  page sets that out. Every tier by bedroom count and every add-on is on{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">the Edmonton price list, tier by tier</Link>. Add the {TRAVEL_FEE} travel fee to any of those figures for an address in Fort Saskatchewan.
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
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Fort Saskatchewan cleaning questions</h2>
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
              Book house cleaning in Fort Saskatchewan
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
