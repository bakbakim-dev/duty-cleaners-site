import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import { standardTierRows, FREQUENCIES } from "@/data/pricing";
import { POLICY } from "@/data/policy";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, Leaf, CalendarCheck, ThumbsUp, Mail, PaintRoller, Sparkles } from "lucide-react";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import cleanHomeImg from "@/assets/whats-included-hero.webp";
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
      </Link>
    )}
  </div>
);

const WhyUsCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: React.ReactNode }) => (
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

/**
 * The recurring card's figures, read from bk-config so this page cannot drift
 * from what the booking form charges. The 10% tier is "Every 4 Weeks" there —
 * thirteen visits a year, not twelve — so nothing here calls it monthly.
 */
const RECURRING_FROM = standardTierRows()[0].price;
const pctOff = (bkId: number) =>
  `${Math.round((FREQUENCIES.find((f) => f.bkId === bkId)?.discount ?? 0) * 100)}%`;
const OFF_WEEKLY = pctOff(3);
const OFF_BIWEEKLY = pctOff(4);
const OFF_FOUR_WEEKLY = pctOff(2);

const services = [
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/edmonton/regular-cleaning/", linkText: "Standard cleaning in Bannerman" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/edmonton/deep-cleaning/", linkText: "Deep cleaning in Bannerman" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-edmonton/", linkText: "Move-out cleaning in Bannerman" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Renovation dust through a Bannerman home, priced by square footage.", to: "/post-construction-cleaning/", linkText: "Post-construction cleaning in Bannerman" },
  { icon: PaintRoller, title: "Wall Washing", description: WALL_WASHING_DESCRIPTION, to: "/wall-washing-wall-cleaning/", linkText: "Wall washing in Bannerman" },
  // The sixth card was "Kitchen Deep Clean": the only one with no price and
  // no link, describing a service pricing.ts does not sell — appliance
  // interiors are add-ons on a standard clean and included on a move-out one.
  // Recurring cleaning is a real bookable frequency with its own page, and it
  // was the only service on the menu with no card here.
  { icon: CalendarCheck, title: "Recurring Cleaning", description: `The standard checklist on a schedule, from ${RECURRING_FROM} a visit for a one-bedroom, one-bathroom apartment or condo, before GST and any pet or home-type charge. From the second clean on, weekly takes ${OFF_WEEKLY} off, every two weeks ${OFF_BIWEEKLY} and every four weeks ${OFF_FOUR_WEEKLY}.`, to: "/edmonton/recurring-cleaning/", linkText: "Recurring cleaning in Bannerman" },
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

/**
 * Bannerman-specific questions first, then the shared operational ones.
 *
 * These neighbourhood-specific entries used to be dead code: a second
 * `const faqs` declared inside the component shadowed this one, so the generic
 * template list rendered instead and none of this reached the page or the
 * FAQPage schema. This is now the single source for both.
 */
const faqs = [
  {
    question: "What cleaning services do you offer in Bannerman?",
    answer: "Standard cleaning, recurring cleaning, deep cleaning, move-in and move-out cleaning, post-construction cleaning and wall washing are all available in Bannerman. Wall washing is booked together with a clean, not on its own.",
  },
  {
    question: "How do I book a cleaning in Bannerman?",
    answer: "Call the Edmonton office at (780) 913-6565, or see your instant price online and book it there. You pick an arrival window rather than an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM. Nothing is charged at booking.",
  },
  {
    question: "How are your cleaners vetted?",
    answer: "Every cleaner is reference-checked before a first job and rated by the customer after each visit. Those ratings decide who we keep sending to Bannerman homes.",
  },
  {
    question: "Do the cleaners bring their own products?",
    answer: `Yes. The team brings all supplies and equipment to a Bannerman clean, and needs running water, plus power for the vacuum. Optional alternative products cost ${POLICY.ecoProductsFee} extra, before GST: ${POLICY.ecoProductsHowToRequest}.`,
  },
  {
    question: "How long does an initial cleaning take?",
    answer: "We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes.",
  },
  {
    question: "Do you offer discounts?",
    answer: "Yes, from the second visit on a recurring schedule:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nThe first clean is charged at the one-time rate.",
  },
  {
    question: "What's included in a deep cleaning?",
    answer: "Deep cleaning adds to our standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped",
  },
  {
    question: "What happens if something is missed?",
    answer: "Tell us within 24 hours and the team comes back to your Bannerman home to re-clean what was missed, at no charge. Photos help but are not required.",
  },
];

export default function Bannerman() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
        <title>Bannerman, Edmonton House Cleaning | Duty Cleaners</title>
        <meta name="description" content="Most homes in Bannerman, Edmonton, date from the 1970s, and clay from the river valley to the east comes back up on boots and paws." />
        <script type="application/ld+json">
          {JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Bannerman, Edmonton",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/bannerman",
  areaServed: "Bannerman, Edmonton, AB",
  description: "House cleaning in Bannerman, Edmonton, where over a third of the homes are row houses and most were built in the 1970s.",
}))}
        </script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/bannerman/" />
        <meta property="og:title" content="Bannerman, Edmonton House Cleaning | Duty Cleaners" />
        <meta property="og:description" content="Most homes in Bannerman, Edmonton, date from the 1970s, and clay from the river valley to the east comes back up on boots and paws." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/bannerman/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Bannerman, Edmonton House Cleaning | Duty Cleaners" />
        <meta name="twitter:description" content="Most homes in Bannerman, Edmonton, date from the 1970s, and clay from the river valley to the east comes back up on boots and paws." />
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
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <span className="dc-icon dc-icon-map-pin w-4 h-4 text-accent" aria-hidden="true" />
                <span className="text-white/90 text-sm font-medium">Serving Bannerman, Edmonton</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Bannerman
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Most of Bannerman's housing went up in the 1970s, and over a third of it is row housing in the <a href="https://data.edmonton.ca/Census/2016-Census-Dwelling-Unit-by-Structure-Type-Neighb/xxgm-nnaq" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">City of Edmonton's 2016 municipal census</a>. East of the last houses the ground drops into the river valley, and its clay comes back up on boots and paws.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(780) 913-6565
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
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
          </div>
        </section>

        {/* Services */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Our Services</span>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">
                  Cleaning Services for Bannerman Homes
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Bannerman's row houses, rented apartments and detached homes are priced flat by home size and type before GST, and only post-construction is priced by square footage.
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
                {"Bannerman is one of the Edmonton neighbourhoods we clean — see "}
                <Link to="/" className="text-primary underline underline-offset-2">
                  house cleaning services in Edmonton
                </Link>
                {" for the full picture."}
              </p>
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
                  Why Bannerman Residents Choose Duty Cleaners
                </h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Every cleaner is reference-checked before a first job and rated after each visit, and every clean carries a 24-hour re-clean guarantee.
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

        {/* Google Map */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Map</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Bannerman Service Area</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Bannerman is inside Edmonton city limits, so no trip fee is added to the price.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                    <img width={1280} height={720} src={cleanHomeImg} alt="A sunlit living room with white sofas, a glass coffee table and fresh flowers on polished hardwood" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                    <GoogleMapEmbed query="Bannerman, Edmonton, AB" title="Bannerman Edmonton Map" height={400} />
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">More Edmonton-area neighbourhoods we clean</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Clareview, Belvedere and Beacon Heights are cleaned by our Edmonton branch too, at the same flat rates.
                  </p>
                </div>
                <CoverageChips areas={["Clareview", "Belvedere", "Beacon Heights"]} variant="compact" />
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">
                    View All Service Areas →
                  </Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="On the rim"
        heading="The edge with no street"
        paragraphs={[
          "Three sides of these blocks are roads — Victoria Trail on the west, 137 Avenue south, 144 Avenue north. The fourth side has no street at all: east of the last houses the ground falls away into the river valley, with trails at the bottom and an unsurfaced bank in between. What comes back up on boots and paws is valley clay, and clay releases from a mat while it is damp, then stops releasing the moment it dries to powder.",
          "The build-out was quick: better than three quarters of the housing dates to the 1970s and almost all the rest to the 1980s. Fewer than half the homes are detached; over a third are row houses, and most of the remainder are rented apartments in buildings under five storeys. A round here concentrates in an entry, a kitchen and one bathroom instead of spreading across a main floor, and where tile is original, grout wants patience over pressure.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />
        <HonestReviewLink city="Edmonton" area="Bannerman" />

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
                Ready to Book a Clean in Bannerman?
              </h2>
              <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <p className="text-white/90 mb-10 max-w-2xl mx-auto">
                The Edmonton office is open Monday to Saturday 8:00 AM to 8:00 PM and Sunday 9:00 AM to 3:00 PM.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />Call (780) 913-6565
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
    </>
  );
}
