import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Helmet } from "react-helmet-async"; import { buildLocationSchema } from "@/lib/location-schema"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import devonLandmark from "@/assets/gallery/devon-landmark.webp";
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

// A worked quote built from the same rows the price table uses: a
// two-bedroom bungalow on a standard clean, outside city limits, with a pet.
const dollars = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
const EXAMPLE_TIER = STANDARD[1];
const EXAMPLE_TOTAL = dollars(EXAMPLE_TIER.price) + BK_PRICE_OVERRIDES[54].price + (travelFee("standard") ?? 0);
const EXAMPLE_PRICE = formatPrice(EXAMPLE_TOTAL);
const EXAMPLE_WITH_PET = formatPrice(EXAMPLE_TOTAL + (addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0));
// Add-ons on a standard clean; the move-in/move-out clean includes both.
const OVEN_FROM = formatPrice(addOnFromPrice("standard", "inside-oven") ?? 0);
const FRIDGE_FROM = formatPrice(addOnFromPrice("standard", "inside-fridge") ?? 0);

// Unqualified, "Devon" is an English county, and that is where most of this
// page's impressions came from. Title and H1 both carry Alberta now.
const PAGE_TITLE = `House Cleaning Devon, AB from ${STANDARD_FROM} | Duty Cleaners`;
const PAGE_DESCRIPTION = `Flat-rate house cleaning in Devon, Alberta, about 26 km southwest of Edmonton, starts at ${STANDARD_FROM} before GST for a one-bedroom, plus a ${TRAVEL_FEE} travel fee.`;

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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Devon" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Devon" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Devon" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust cleared after a renovation or a new build, priced by square footage.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Devon" },
  { icon: PaintRoller, title: "Wall Washing", description: "Spot cleaning or a full wash of painted walls, booked together with a clean rather than on its own.", to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Devon" },
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The standard clean booked to come back, from ${STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. Weekly saves 20% from the second visit, bi-weekly 15%, every 4 weeks 10%.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Devon" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `The Edmonton listing, which is where a Devon clean is rated, holds ${CITY_PROOF.edmonton.googleReviewCount} reviews.`, link: { href: EDMONTON_LISTING.reviewsUrl, text: "View the listing" } },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: `Tell us within ${POLICY.guaranteeWindowHours} hours if something was missed and the team comes back to re-clean it, at no charge.` },
];

const nearbyAreas = [
  "Leduc", "Beaumont", "Spruce Grove", "Stony Plain"
];

export default function Devon() {
  const faqs = [
    {
      question: "Do you charge a travel fee in Devon?",
      answer: `Yes. Devon is outside Edmonton city limits, so a home-cleaning booking here carries a ${TRAVEL_FEE} travel fee, and a post-construction clean carries ${PC_TRAVEL_FEE} instead; the size of the home does not change it. The fee shows on the quote before you book. It is the only charge an Edmonton address would not have, but it is not the only extra that can apply. The pet charge and the home-type surcharges apply in Devon exactly as they do in the city: ${PET_FEE} a visit where there are pets, and the step up from an apartment or condo, ${HOME_TYPE.bungalow} for a bungalow or basement suite, ${HOME_TYPE.townhouse} for a townhouse, ${HOME_TYPE.twoStorey} for a two-storey house.`
    },
    {
      question: "When does the team arrive in Devon, and do I need to be home?",
      answer: `Every booking gets an arrival window rather than an exact time: ${ARRIVAL_WINDOWS.join(", ")}. Same-day and next-day slots depend on the schedule, so call the Edmonton office at ${CITY_PROOF.edmonton.phone} to ask what is open. You do not need to be home for a Devon clean: most customers leave a key, a lockbox code or smart-lock access, and the team locks up.`
    },
    {
      question: "Can you do a move-out clean in Devon?",
      answer: `Yes. A move-in or move-out clean in Devon runs from ${MOVE_FROM} for a one-bedroom apartment or condo to ${MOVE_TOP} for five or more bedrooms, before GST, plus the ${TRAVEL_FEE} travel fee and any house-type or pet surcharge. Unlike a standard clean, it includes inside the oven, fridge and microwave, and inside every cabinet, drawer and closet. Empty the house before the team arrives, because a cupboard that still holds plates gets worked around rather than cleaned inside. We do not promise the deposit comes back; the landlord decides.`
    },
    {
      question: "What does a standard clean cost in Devon?",
      answer: `A standard clean of a one-bedroom apartment or condo in Devon is ${STANDARD_FROM} before GST, and five or more bedrooms is ${STANDARD_TOP}. A Devon address adds the ${TRAVEL_FEE} travel fee, and a house or a home with pets adds its surcharge on top. The deep clean, which adds baseboards, doors, light switches, wall outlets and vent covers, starts at ${DEEP_FROM} on the same terms. Weekly, bi-weekly and every-4-weeks schedules take 20%, 15% and 10% off. Discounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "Do the cleaners bring their own supplies to Devon?",
      answer: `Yes. The team brings all supplies and equipment, from products and cloths to the mop and the vacuum. Leave the water and power on until the clean is done: running water is required, and vacuuming may not be possible without electricity. If you want eco-friendly products, they are ${POLICY.ecoProductsFee}: ${POLICY.ecoProductsHowToRequest}.`
    },
    {
      question: "What happens if something is missed?",
      answer: `Tell us within ${POLICY.guaranteeWindowHours} hours and the team comes back to your Devon home to re-clean what was missed, at no charge. Photos help but are not required.`
    },
    {
      question: "What does it cost to cancel or change a Devon booking?",
      answer: `Cancelling or changing a booking needs ${POLICY.cancellationNoticeHours} hours' notice; inside that window the fee is ${POLICY.cancellationFee}. If the team arrives and cannot get in, the lockout charge is ${POLICY.lockoutFee}. If we have to move a booking, because a cleaner is ill or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have. Cancelling a booking we moved costs nothing.`
    },
    {
      question: "What is not included in a Devon house clean?",
      answer: `Outdoor work is not included, which means exterior windows, garages, patios and other outdoor areas; in a Devon house backing the river valley, the mud gets cleaned once it is inside the door. The team does not lift anything over 25 lb or work beyond a 3-step ladder. Carpet steam cleaning, upholstery, mould remediation, pests, litter boxes, laundry and dishes are also out of scope. Heavy scrubbing of walls and doors is the separate wall-washing package, and decluttering or organising is a separate hourly add-on.`
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
                Professional House Cleaning in Devon, Alberta
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto lg:mx-0 leading-relaxed">
                A standard clean in Devon starts at {STANDARD_FROM} for a one-bedroom apartment or condo before GST, plus a {TRAVEL_FEE} travel fee and any house-type or pet surcharge. The Edmonton branch is rated {RATING_CLAIM} from {CITY_PROOF.edmonton.googleReviewCount} reviews.
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
                  { icon: CalendarCheck, text: "Open 7 Days a Week" },
                  { icon: Award, text: "24-Hour Re-Clean Guarantee" },
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

      {/* Interactive Map */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-8">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Map</span>
              <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
                Devon on the map
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every Devon clean is booked through the Edmonton office at 18615 71 Ave NW, open Monday to Saturday 8:00 AM to 8:00 PM and Sunday 9:00 AM to 3:00 PM.
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
                Each clean is priced flat by home size, except post-construction, which goes by square footage.
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
                These four hold on every Devon booking.
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

      {/* Local Coverage */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 text-center">
          <AnimatedSection>
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
            {/* One "Near Devon" H2 on the page is enough, and it belongs to
                <NearbyNeighbourhoods>. This heading names the service. */}
            <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">
              Cleaning services in Devon and other towns around Edmonton
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl mx-auto text-left md:text-center">
              Devon is one of nine communities outside Edmonton that the Edmonton branch cleans, on the same checklist and the same flat rates as our{" "}
              <Link to="/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Edmonton proper</Link>. The same office does{" "}
              <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Leduc</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-2 font-medium">house cleaning in Beaumont</Link>, runs{" "}
              <Link to="/cleaning-services-stony-plain/" className="text-primary underline underline-offset-2 font-medium">cleaning services in Stony Plain</Link>{" "}
              and sends out our{" "}
              <Link to="/cleaning-services-fort-saskatchewan/" className="text-primary underline underline-offset-2 font-medium">Fort Saskatchewan house cleaners</Link>. Each of those towns is outside Edmonton city limits and carries the {TRAVEL_FEE} travel fee, the same as Devon.
            </p>
            <CoverageChips areas={nearbyAreas} />
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>

          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="Ground truth"
        heading="Planned in one go, in 1947"
        paragraphs={[
          "Imperial Oil built this town from nothing after the Leduc No. 1 well came in during 1947, and it was the first community in Canada approved by a regional planning commission. A place laid out all at once ages all at once: the original streets share a build era, a floor plan vocabulary and a set of finishes, so the same rooms reach the same wear points across whole blocks rather than house by house.",
          "The townsite sits on the south bank of the North Saskatchewan about 26 km southwest of Edmonton, with the river valley and its trail network immediately below. Households backing that edge bring the valley home: mud through the thaw, seed and pollen in early summer. All of it concentrates at whichever door faces the slope.",
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
                  For a house that is kept up, book the standard clean, from {STANDARD_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, and put it on a repeating schedule for the discount. The deep clean, from {DEEP_FROM} on the same terms, is the better first visit for a house that has not had a professional clean, because it adds baseboards, doors, light switches, wall outlets and vent covers to the standard checklist.
                </p>
                <p>
                  For a rental handover, book{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-2 font-medium">Devon move-out cleaning</Link>{" "}
                  from {MOVE_FROM} for a one-bedroom apartment or condo, before GST, the travel fee and any house-type or pet surcharge, and empty the cupboards first. Under Alberta's Residential Tenancies Act the landlord completes a move-out inspection report with the tenant, and the security deposit must be returned within 10 days after the tenant moves out. We do not promise the deposit comes back; the landlord decides.
                </p>
                <p>
                  If the property is a short-term rental, the job is a turnover between guests rather than a scheduled clean. It is priced by the hour, with a minimum of 3 hours for one cleaner or 2 hours for two, on the{" "}
                  <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-2 font-medium">Airbnb turnover cleaning in Edmonton</Link>{" "}
                  page. For every tier and every add-on in one table, see{" "}
                  <Link to="/pricing/" className="text-primary underline underline-offset-2 font-medium">what each home size costs in Edmonton</Link>, then add the {TRAVEL_FEE} travel fee for a Devon address.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* A worked quote, built from the same rows as the price table */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">A worked quote</span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
                What a Devon house cleaning quote adds up to
              </h2>
              <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                <p>
                  Take a two-bedroom, two-bathroom bungalow in Devon, booked for a one-time standard clean. The table price for that size is {EXAMPLE_TIER.price}, which assumes an apartment or condo. A bungalow adds {HOME_TYPE.bungalow} and a Devon address adds the {TRAVEL_FEE} travel fee, so the quote comes to {EXAMPLE_PRICE} before 5% GST. If a dog or a cat lives there, the {PET_FEE} pet charge is compulsory on every visit and takes it to {EXAMPLE_WITH_PET}, still before GST.
                </p>
                <p>
                  What else moves the figure is the home and the extras, not the clock. More bathrooms than the table assumes raise it, and so do add-ons: on a standard clean, inside the oven is from {OVEN_FROM} and inside the fridge from {FRIDGE_FROM}, both before GST. How long the clean takes does not change it. If a home needs substantially more work than described, such as heavy build-up, the team explains what it found and the options before continuing.
                </p>
                <p>
                  Every line shows on the instant price before you book, and nothing is charged at booking. The day before the clean, a temporary hold confirms the card is valid; it can look like a charge in a banking app, but no money moves. The card is charged once the clean is complete.
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
