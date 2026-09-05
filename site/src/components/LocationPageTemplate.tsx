import { CITY_PROOF } from "@/data/proof";
import { RATING_CLAIM } from "@/data/proof";
import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods";
import { canonicalUrlForPath, canonicalForPath } from "@/data/legacy-urls";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, addOnFromPrice, formatPrice } from "@/data/pricing";
import { TRAVEL_FEE_KEY } from "@/data/addon-table";
import Navigation from "@/components/Navigation";
import heroFamilyBedroom from "@/assets/hero-family-bedroom.webp";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { Link, useLocation } from "react-router-dom";
import { quoteHrefFor } from "@/lib/quote-link";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import LocalMarketNote from "@/components/LocalMarketNote";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowRight,
  Phone, CheckCircle2, Star, Shield, Clock, Award,
  Home, Sparkles, Truck, SprayCan, Bath, UtensilsCrossed,
  Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail
} from "lucide-react";

interface LocationPageProps {
  city: string;
  region: "edmonton" | "calgary";
  title: string;
  /** Hero blurb. Prose, so it runs long — NOT the meta description. */
  description: string;
  /**
   * The meta description, which must fit inside 160 characters.
   *
   * `description` used to serve both jobs, and it is written as hero prose —
   * so the twelve pages using this template shipped meta descriptions of 199
   * to 403 characters, every one of them truncated in search results. Falls
   * back to `description` when absent so nothing regresses silently, but
   * location-meta.test.ts fails any page that leaves it that way.
   */
  seoDescription?: string;
  phone: string;
  phoneLink: string;
  /** Real, verbatim-sourced "Things To Do" paragraphs for this town, if confirmed. */
  thingsToDo?: string[];
  /**
   * Cleaning-relevant local content — the thing that stops this page being a
   * copy of the other twelve.
   *
   * Measured as novel 8-grams against every sibling location page with the
   * place name normalised away, these thirteen pages had a median of 37 and a
   * floor of 14 (Laurel). The 140 hand-written location pages median 116-158.
   * The gap was entirely this: the template varied by name and one blurb.
   *
   * Write what changes the JOB, not what a tourism board would write. Housing
   * era and type is the strongest axis — a 1950s bungalow with original trim
   * and a 2015 open-plan build shed dust differently and take different
   * amounts of time — followed by what the location does to a home: ring-road
   * grit, lake and wetland humidity, LRT-adjacent traffic, active construction
   * next door.
   */
  localNote?: { heading: string; paragraphs: string[] };
  /**
   * Set for places that are their OWN municipality rather than a neighbourhood
   * of the region's main city. Black Diamond is a town near Calgary, not part
   * of it, so "Black Diamond, Calgary, AB" is geographically false.
   */
  isOwnMunicipality?: boolean;
}


/**
 * Prices shown on every location page, derived once from bk-config.
 * published-prices.test.ts forbids hand-typed dollar literals on pricing
 * surfaces; these come from the same tier rows the pricing tables use.
 */
const span = (rows: { price: string }[]) => `${rows[0].price} to ${rows[rows.length - 1].price}`;
const LOCATION_PRICES = {
  standard: span(standardTierRows()),
  deep: span(deepCleanTierRows()),
  moveInOut: span(moveInOutTierRows()),
};
/** Mandatory outside the two metros, applied by postal code at booking. */
const TRAVEL_FEE = (() => {
  const v = addOnFromPrice("standard", TRAVEL_FEE_KEY);
  return v === null ? null : formatPrice(v);
})();

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
  /** Omitted for the two room-level cards, which have no page of their own. */
  to?: string;
  linkText?: string;
}) => (
  <div
    className="group bg-white rounded-xl border border-border p-6 transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
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
        <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
      </Link>
    )}
  </div>
);

const WhyUsCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div
    className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl"
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);


/*
 * There used to be a copy-spinner here: `variantOf` hashed the place name to
 * 0-3 and `pickV` picked one of four paraphrases for nine slots across all 166
 * location pages, five of them inside FAQPage JSON-LD. The variants said the
 * same thing in different words, so no reader was better off for which one they
 * got — the rotation existed to make the pages look unlike each other to a
 * crawler, which is what Google's scaled-content-abuse policy describes. Only
 * variant 0 even interpolated the place name, so three quarters of the "local"
 * copy was not local.
 *
 * These pages carry researched local notes; that is what makes them worth
 * having. Repeating one clear service description across sibling pages is
 * ordinary and fine. Do not reintroduce a spinner.
 */

const services = (place: string, region: "edmonton" | "calgary") => {
  const city = region === "edmonton" ? "edmonton" : "calgary";
  const moveOut = region === "edmonton" ? "/move-out-cleaning-edmonton" : "/move-out-cleaning-calgary";
  const postCon =
    region === "edmonton" ? "/post-construction-cleaning" : "/post-construction-cleaning-calgary";
  return [
  { icon: Home, title: "Standard House Cleaning", description: "Weekly or bi-weekly maintenance to keep your home spotless and fresh year-round.", to: canonicalForPath(`/${city}/regular-cleaning`), linkText: `Standard cleaning in ${place}` },
  { icon: Sparkles, title: "Deep Cleaning", description: "A full top-to-bottom reset — corners, baseboards, and the surfaces a regular visit skips.", to: canonicalForPath(`/${city}/deep-cleaning`), linkText: `Deep cleaning in ${place}` },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Move-day cleaning done to the standard a move-out inspection looks for.", to: canonicalForPath(moveOut), linkText: `Move-out cleaning in ${place}` },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust and debris cleared after a renovation or a new build.", to: canonicalForPath(postCon), linkText: `Post-construction cleaning in ${place}` },
  { icon: Bath, title: "Bathroom Sanitization", description: "Deep scrubbing and disinfecting of showers, tubs, toilets, and tiles." },
  // No page of its own. An anchor pointing at /whats-included/ would not
  // describe that page, and pointing it at deep cleaning would hand one target
  // three of the six cards on every location page. Left as a description.
  { icon: UtensilsCrossed, title: "Kitchen Deep Clean", description: "Appliance interiors, countertops, backsplashes, and sink areas thoroughly cleaned." },
  ];
};

const whyUsItems = () => [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  { icon: Star, title: RATING_CLAIM, description: `${CITY_PROOF.edmonton.googleReviewCount + CITY_PROOF.calgary.googleReviewCount} reviews across Edmonton and Calgary, and every one of them is on our Google listing.` },
  { icon: Clock, title: "Flexible Scheduling", description: "Same-day and next-day slots when the schedule allows, including weekends." },
  // "and the planet" is an environmental-benefit claim. Since the June 2024
  // Competition Act amendments those require substantiation on an internationally
  // recognised methodology, and private applications to the Tribunal have been
  // live since June 2025. Nothing on the site or in the repo substantiates it.
  // The card title had already been softened from an eco claim to "High Quality
  // Cleaning Supplies" — this finishes that edit, which was left half-done.
  // The family-and-pets half is kept: it describes handling, not an environmental
  // benefit, and matches what the FAQ already tells customers.
  { icon: Leaf, title: "All Supplies Brought For You", description: "We bring everything the job needs — and any product you would rather we used." },
  { icon: Users, title: "Experienced Cleaners", description: "Every cleaner comes with paid professional cleaning experience before their first job with us — it is one of the things we check." },
  { icon: ThumbsUp, title: "Satisfaction Guarantee", description: "If something was missed, tell us within 24 hours and we'll return to make it right — at no additional charge." },
];

export default function LocationPageTemplate({
  city,
  region,
  title,
  description,
  seoDescription,
  phone,
  phoneLink,
  thingsToDo,
  localNote,
  isOwnMunicipality = false,
}: LocationPageProps) {
  // Falls back so an un-migrated page still renders; the test enforces the rest.
  const metaDescription = seoDescription ?? description;


  const { pathname } = useLocation();
  const regionLabel = region === "edmonton" ? "Edmonton" : "Calgary";
  // One resolved URL for canonical, og:url and JSON-LD. Using the raw pathname
  // here made the schema url and og:url disagree with the canonical on every
  // preserved legacy route (e.g. /locations/black-diamond vs its real canonical
  // /cleaning-services-black-diamond/).
  const canonicalUrl = canonicalUrlForPath(pathname);
  const jsonLd = buildLocationSchema({
    // A neighbourhood is genuinely "Allendale Edmonton". A separate municipality
    // is not: "Leduc Edmonton" or "St. Albert Edmonton" names a place that does
    // not exist, and reads as though the town were part of the city. The
    // isOwnMunicipality flag already distinguishes the two for areaServed below;
    // the entity name needs it just as much.
    name: isOwnMunicipality ? `Duty Cleaners - ${city}, AB` : `Duty Cleaners - ${city} ${regionLabel}`,
    city: region,
    url: canonicalUrl,
    description,
    areaServed: isOwnMunicipality ? `${city}, AB` : `${city}, ${regionLabel}, AB`,
  });

  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: `What cleaning services does Duty Cleaners offer in ${city}?`,
      answer: `Every service we run can be booked here:\n\n• Commercial Cleaning\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes. From the second visit on, a recurring schedule saves:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `A deep clean layers these onto the standard visit:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!`
    },
    {
      question: "What is your 100% satisfaction guarantee policy?",
      answer: `If you're not 100% satisfied, call us within 24 hours and we'll come back and put it right — at no extra cost!`
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
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDescription} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>
      <Navigation city={region} />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-24 bg-brand-navy overflow-hidden">
        <img
          src={heroFamilyBedroom}
          alt={`Freshly cleaned bedroom in a ${city} home`}
          width={1280}
          height={853}
          className="absolute inset-0 w-full h-full object-cover opacity-25"
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
              <MapPin className="w-4 h-4 text-accent" />
              {/* Same distinction as the schema name: "Serving Leduc, Edmonton"
                  misstates a separate town as part of the city. */}
              <span className="text-white/90 text-sm font-medium">
                Serving {city}, {isOwnMunicipality ? "AB" : regionLabel}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Professional House Cleaning in {city}
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href={phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />{phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                <a href={quoteHrefFor(pathname)}>See My Instant Price</a>
              </Button>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { icon: CheckCircle2, text: "Pay After Your Clean" },
                // Round one deliberately softened the body of these pages to
                // "Flexible Scheduling Available", but this badge kept promising
                // same-day outright, so the hero contradicted the section below it.
                // The FAQ's own wording is the qualified version — "same-day and
                // next-day appointments based on availability" — so match that
                // rather than either over-promising or dropping a real selling point.
                { icon: CalendarCheck, text: "Same-Day When Available" },
                { icon: Award, text: "100% Satisfaction Guarantee" },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <badge.icon className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What it costs here.
          No location page stated a price -- 145 of them -- so a visitor who
          searched "house cleaning in <neighbourhood>" and landed here could not
          find a number, and neither could an assistant answering on their
          behalf. Every figure is derived from bk-config, so this cannot drift
          from what BookingKoala charges.

          The travel-fee line is not optional politeness: the fee is applied
          automatically by postal code, which makes it MANDATORY for these
          customers. Advertising a price to them without disclosing it is the
          pattern the Competition Act calls drip pricing, so the two have to
          appear together. Only own-municipality pages (the satellite towns)
          get it -- inside Edmonton and Calgary no fee applies. */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">What it costs</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Cleaning prices in {city}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed mb-4">
                A standard clean in {city} runs {LOCATION_PRICES.standard} depending on the size of your
                home, a deep clean {LOCATION_PRICES.deep}, and a move-in or move-out clean{" "}
                {LOCATION_PRICES.moveInOut}. Those are flat rates in Canadian dollars before 5% GST — the
                figure you see before booking is the figure you pay, and it does not go up because a clean
                took longer than expected.
                {isOwnMunicipality && TRAVEL_FEE !== null
                  ? ` Because ${city} sits outside our Edmonton and Calgary service areas, a ${TRAVEL_FEE} travel fee is added to bookings here.`
                  : ""}
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Recurring visits save 20% weekly, 15% bi-weekly and 10% monthly from the second clean.
                Your first clean is charged at the standard one-time rate.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <NearbyNeighbourhoods />

      {localNote && (
        <LocalMarketNote
          eyebrow={`Homes in ${city}`}
          heading={localNote.heading}
          paragraphs={localNote.paragraphs}
          accent={region === "calgary" ? "calgary" : "primary"}
        />
      )}

      {thingsToDo && thingsToDo.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Life</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                  Things To Do In {city}
                </h2>
                <div className="text-muted-foreground text-lg leading-relaxed space-y-4">
                  {thingsToDo.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Services */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14">
              <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                Cleaning Services for {city} Homes
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                From routine upkeep to deep cleans and move-outs, we have every service your home needs.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {services(city, region).map((s, i) => (
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
                Why {city} Residents Choose Duty Cleaners
              </h2>
              <p className="text-white/90 max-w-2xl mx-auto text-lg">
                Trusted by families across {regionLabel} for reliable, thorough cleaning.
              </p>
            </div>
          </AnimatedSection>
          <AnimatedSection>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {whyUsItems().map((item, i) => (
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
              Proudly Serving {city} & Surrounding Areas
            </h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              We provide professional house cleaning services throughout {city} and nearby communities in the {regionLabel} region.
            </p>
            <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
              View All Service Areas →
            </Link>
            {/* Commercial cross-link: Search Console shows office/commercial
                queries for these towns ranking 20-40 with zero clicks. */}
            <p className="mt-6 text-sm text-muted-foreground">
              Run a business in {city}? We also handle{" "}
              <Link
                to={region === "calgary" ? "/commercial-cleaning-services-calgary/" : "/commercial-cleaning/"}
                className="text-primary underline underline-offset-2 font-medium"
              >
                commercial and office cleaning across the {regionLabel} region
              </Link>
              .
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
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
              Ready for a Spotless Home in {city}?
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              Get your free quote today and experience the Duty Cleaners difference!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                <a href={phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />Call {phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                <a href={quoteHrefFor(pathname)}>
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
