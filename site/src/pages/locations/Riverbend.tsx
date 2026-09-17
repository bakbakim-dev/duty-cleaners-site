import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import LocalMarketNote from "@/components/LocalMarketNote"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import { useEffect, lazy, Suspense } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Award, Home, Truck, Building2, HardHat, Bath, Leaf, CalendarCheck, ThumbsUp, Mail, PaintRoller, Sparkles } from "lucide-react";
import riverbendCleanerImg from "@/assets/gallery/riverbend-cleaner-family-room.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import LocationPricing from "@/components/LocationPricing";
const RiverbendMap = lazy(() => import("@/components/RiverbendMap"));

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

const WhyUsCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: React.ReactNode }) => (
  <div className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center transition-all duration-500 ease-out hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-7 h-7 text-accent" />
    </div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 text-sm leading-relaxed">{description}</p>
  </div>
);

const services = [
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Riverbend" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Riverbend" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Riverbend" },
  { icon: HardHat, title: "Post-Construction Cleanup", description: "Renovation dust and debris cleared from a Riverbend house, priced by square footage.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Riverbend" },
  { icon: PaintRoller, title: "Wall Washing", description: WALL_WASHING_DESCRIPTION, to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Riverbend" },
];

const whyUsItems = [
  { icon: Shield, title: "Reference-Checked, Then Rated by You", description: "Every cleaner is reference-checked before their first job, then rated by the customer after every visit. Those ratings decide who keeps cleaning for us." },
  // Was "287 reviews across Edmonton and Calgary" — a sum Google never
  // reports, printed with no link, while this page's LocalBusiness node points
  // at one listing showing a different number. Both the count and the link now
  // come from that same listing.
  {
    icon: Star,
    title: RATING_CLAIM,
    description: (
      <>
        {CITY_PROOF.edmonton.googleReviewCount} reviews on our{" "}
        <a
          href={getListing(CITY_PROOF.edmonton.city).reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline underline-offset-2 hover:text-accent"
        >
          {CITY_PROOF.edmonton.city} Google listing
        </a>
        , which is where that rating is read from.
      </>
    ),
  },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: "Tell us within 24 hours if something was missed and the team comes back to re-clean it, at no charge." },
];

export default function Riverbend() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "Do you serve all of Riverbend?",
      answer: "Yes. Riverbend is one of the 80 Edmonton neighbourhoods on the Edmonton branch's list. If you are unsure whether your address falls inside Riverbend, call the Edmonton office on (780) 913-6565 and ask."
    },
    {
      question: "How do you clean the finishes in a Riverbend home?",
      answer: "Riverbend was laid out under a 1972 district plan, so its housing is a generation younger than the inner-city stock, with sealed counters, engineered flooring and tub and shower surrounds that stain rather than soil. Those finishes want a mild product and time to work. Hard Alberta water also leaves mineral scale on taps and shower glass, and scale answers to the same patience."
    },
    {
      question: "Can I book recurring cleaning services?",
      answer: "Yes. Recurring cleaning in Riverbend is the standard clean on a weekly, bi-weekly or every-4-weeks schedule, and the discount applies from the second visit. We send your regular team where we can, and a booking can be changed with 24 hours' notice."
    },
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Riverbend?",
      answer: `In Riverbend, the Edmonton branch books these services:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes. In Riverbend, a recurring schedule is discounted by frequency:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `Beyond the standard scope, deep cleaning covers:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped`
    },
    {
      question: "What happens if something is missed?",
      answer: "Tell us within 24 hours and the team comes back to your Riverbend home to re-clean what was missed, at no charge. Photos help but are not required."
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
        <title>House Cleaning in Riverbend, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Riverbend in Edmonton backs onto ravine and river, so house cleaning there deals with thaw mud, June poplar fluff and leaf fall at the back entry." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/riverbend/" />
        <meta property="og:title" content="House Cleaning in Riverbend, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Riverbend in Edmonton backs onto ravine and river, so house cleaning there deals with thaw mud, June poplar fluff and leaf fall at the back entry." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/riverbend/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning in Riverbend, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Riverbend in Edmonton backs onto ravine and river, so house cleaning there deals with thaw mud, June poplar fluff and leaf fall at the back entry." />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Riverbend, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/riverbend",
  areaServed: "Riverbend, Edmonton, AB",
  description: "Riverbend in Edmonton backs onto ravine and river, so house cleaning there deals with thaw mud, June poplar fluff and leaf fall at the back entry.",
}))}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>

      <div className="min-h-screen">
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
            <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                  <span className="dc-icon dc-icon-map-pin w-4 h-4 text-accent" aria-hidden="true" />
                  <span className="text-white/90 text-sm font-medium">Serving Riverbend, Edmonton</span>
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                  House Cleaning in Riverbend
                </h1>
                <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl leading-relaxed">
                  Whitemud Creek Ravine borders Riverbend on the east and south and the North Saskatchewan River closes the north, so many homes back onto trees rather than rooftops.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                    <a href="tel:7809136565"><span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(780) 913-6565</a>
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
              <div className="flex-shrink-0 w-full max-w-[500px]">
                <img width={896} height={672}
                  src={riverbendCleanerImg}
                  alt="Cleaner in a white shirt and denim apron mopping a rug in a family room with wood trim, bookshelves and a fireplace"
                  className="rounded-2xl shadow-2xl w-full h-auto object-cover"
                loading="eager"
                  {...{ fetchpriority: "high" } as Record<string, string>} decoding="async" />
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Riverbend Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Edmonton's furnace season runs from October into April, and a Riverbend house sealed up that long cycles dust faster. Standard, deep and move-out cleans are priced flat by home size, before GST.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((s, i) => <ServiceCard key={i} {...s} />)}
              </div>
            </AnimatedSection>
            <AnimatedSection>
              {/* Up-link to the Edmonton hub, which is the homepage.
                  The Calgary pages have carried the mirror of this sentence to their
                  own hub since the link-graph audit; the Edmonton side never got it,
                  on the reasoning that the homepage is already reached from every nav,
                  footer and breadcrumb. Those are site furniture: they carry no anchor
                  text worth having and sit outside the editorial body. The count was
                  76 of 76 Calgary pages linking their hub in-body against 1 of 90 on
                  the Edmonton side — for the page that has to hold "house cleaning
                  edmonton". */}
              <p className="mt-10 text-center text-muted-foreground">
                {"Riverbend is one of the Edmonton neighbourhoods we clean — see "}
                <Link to="/" className="text-primary underline underline-offset-2">
                  house cleaning services in Edmonton
                </Link>
                {" for the full picture."}
              </p>
            </AnimatedSection>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Before the visit</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">Access and Tidying Before a Riverbend Clean</h2>
                <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
                  <p>You do not need to be home for a clean in Riverbend. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves.</p>
                  <p>There is no need to tidy before the team arrives. Clear counters and floors get cleaned and cluttered ones get worked around; decluttering or organising is a separate hourly add-on. On a recurring schedule we send your regular team where we can.</p>
                </div>
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
                <span className="text-white text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Riverbend Families Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">Duty Cleaners has cleaned Alberta homes since 2017, and Riverbend bookings run through the Edmonton office at 18615 71 Ave NW.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => <WhyUsCard key={i} {...item} />)}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Where the Edmonton Branch Cleans</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Riverbend is inside Edmonton city limits, so a clean here has no trip fee. The Edmonton branch also covers nine communities outside the city, where a travel fee applies.</p>
                </div>
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">View All Service Areas →</Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="From the route"
        heading="Ravine on two sides"
        paragraphs={[
          "Whitemud Creek Ravine wraps the east and south, and the North Saskatchewan closes the north, so this area has more edge against wild land than almost anywhere else in the southwest. Households back onto trees rather than another row of rooftops. What comes through the door is organic and seasonal: thaw mud in spring, poplar fluff in June, and leaf fall that runs from September until the snow holds.",
          "The area was laid out under a 1972 district plan, so the housing is a generation younger than the inner-city stock and the finishes are different in kind — sealed counters, engineered flooring, tub and shower surrounds that stain rather than soil. Those want a mild product and time, not pressure, and a back entry that takes the ravine traffic wants attention before anything else does.",
        ]}
      />

      <LocationPricing />

        {/* Map */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Location</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Riverbend Service Area</h2>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-primary/10">
                  <Suspense fallback={<div className="w-full h-[400px] bg-muted animate-pulse rounded-2xl" />}>
                    <RiverbendMap />
                  </Suspense>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        <HonestReviewLink city="Edmonton" area="Riverbend" />

        {/* Final CTA */}
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

        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute bottom-0 left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10 text-center">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Book a Clean in Riverbend?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565"><span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (780) 913-6565</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote"><Mail className="mr-2 w-5 h-5" />See My Instant Price</a>
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
