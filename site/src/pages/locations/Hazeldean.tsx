import { ServiceCard, WhyUsCard } from "@/components/LocationCards";
import { locationServices, locationWhyUs } from "@/data/location-cards";
import { getListing } from "@/lib/google-listings";
import { standardTierRows, FREQUENCIES } from "@/data/pricing";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; import { CheckCircle2, Star, Shield, Award, Home, Truck, SprayCan, Bath, Leaf, CalendarCheck, ThumbsUp, Mail, Quote, PaintRoller, Sparkles } from "lucide-react";
import { buildLocationSchema } from "@/lib/location-schema";
import HonestReviewLink from "@/components/HonestReviewLink";

import LocationPricing from "@/components/LocationPricing";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
import cleanHomeImg from "@/assets/hero-room-edmonton-manus-1280w.webp";
const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
};

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

const services = locationServices("Hazeldean", "edmonton");

const whyUsItems = locationWhyUs("edmonton");

const faqs = [
  { q: "What types of cleaning do you offer in Hazeldean?", a: "Our Edmonton branch offers standard, deep, move-in and move-out, recurring and post-construction cleaning in Hazeldean, plus wall washing booked together with a clean. Every service except post-construction is a flat rate by home size before 5% GST; post-construction cleaning is priced by square footage. If you are not sure which one fits, call the Edmonton office at (780) 913-6565." },
  { q: "How soon can I book a cleaning in Hazeldean?", a: "Same-day and next-day slots depend on the schedule, so booking a Hazeldean clean earlier gives you more choice of day. We book an arrival window rather than an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM, or 3:00 to 4:00 PM. Nothing is charged at booking; the card is charged once the clean is complete." },
  { q: "Do you provide cleaning services in all areas of Hazeldean?", a: "Yes. Hazeldean is on our Edmonton branch's list of 80 neighbourhoods, and it sits inside Edmonton city limits, so no trip fee applies anywhere in it. For an address you are unsure of, call the Edmonton office at (780) 913-6565." },
];

export default function Hazeldean() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <>
      <Helmet>
        <title>House Cleaners in Hazeldean, Edmonton | Duty Cleaners</title>
        <meta name="description" content="Between rail land and Mill Creek Ravine, Hazeldean's post-war Edmonton houses collect fine mineral dust on sills and ravine mud at the door." />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({
  name: "Duty Cleaners – Hazeldean",
  city: "edmonton",
  url: "https://dutycleaners.ca/locations/hazeldean",
  areaServed: "Hazeldean, Edmonton, AB",
  description: "Between rail land and Mill Creek Ravine, Hazeldean's post-war Edmonton houses collect fine mineral dust on sills and ravine mud at the door.",
}))}</script>
        <link rel="canonical" href="https://dutycleaners.ca/locations/hazeldean/" />
        <meta property="og:title" content="House Cleaners in Hazeldean, Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Between rail land and Mill Creek Ravine, Hazeldean's post-war Edmonton houses collect fine mineral dust on sills and ravine mud at the door." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/hazeldean/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaners in Hazeldean, Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Between rail land and Mill Creek Ravine, Hazeldean's post-war Edmonton houses collect fine mineral dust on sills and ravine mud at the door." />
        {/* The FAQs this page already renders — marked up so machine readers
            get the same Q&A the visitor sees. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Navigation city="edmonton" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4"><Breadcrumbs /></div>

        {/* Hero */}
        <section className="relative py-24 bg-brand-navy overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
                <span className="dc-icon dc-icon-map-pin w-4 h-4 text-accent" aria-hidden="true" />
                <span className="text-white/90 text-sm font-medium">Serving Hazeldean, Edmonton</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Hazeldean
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Three in four Hazeldean houses date from the end of the war to 1960, on streets between rail land to the west and Mill Creek Ravine to the east. You pay once the clean is complete, at a flat rate set by the size of the house.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:7809136565"><span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />(780) 913-6565</a>
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Hazeldean Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">Each of these six services for a Hazeldean house shows its price before you book, and every figure is before 5% GST.</p>
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
                {"Hazeldean is one of the Edmonton neighbourhoods we clean — see "}
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Hazeldean Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">The same four commitments apply to every house in Hazeldean.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => <WhyUsCard key={i} {...item} />)}
              </div>
            </AnimatedSection>
          </div>
        </section>

        <HonestReviewLink city="Edmonton" area="Hazeldean" />

        {/* Local Coverage */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Coverage</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Hazeldean and Other Edmonton Neighbourhoods</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Our Edmonton branch cleans 80 neighbourhoods inside the city, Hazeldean among them, and nine communities outside it where a travel fee applies.</p>
                </div>
                <div className="text-center mt-8">
                  <Link to="/locations/" className="inline-flex items-center gap-2 text-primary hover:underline font-semibold">View All Service Areas →</Link>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        eyebrow="Two boundaries"
        heading="Rail yards west, ravine east"
        paragraphs={[
          "Rail land sits on the west and northwest of this pocket and industrial blocks wrap the south, which puts a fine mineral dust on window tracks and sills — the sort that dry dusting lifts into the air and drops again two feet away.",
          "The east boundary is Mill Creek Ravine, where the paved path north of 67 Avenue runs on the old rail bed and the dirt side trails off it turn to mud after the melt — April soil and August soil arrive at the same door looking nothing alike. Indoors, three houses in four date from between the war's end and 1960 and barely one in fifteen from after 1970, so post-construction work here means renovation dust in an occupied house, not an empty shell.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Map */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Map</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Hazeldean on the Map</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-10 items-center">
                  <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                    <img width={1280} height={720} src={cleanHomeImg} alt="A kitchen with a light oak island, a spray bottle and folded cloths by the sink, and a dining table under a bright window" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                  </div>
                  <div className="rounded-xl overflow-hidden shadow-lg border border-border">
                    <GoogleMapEmbed query="Hazeldean, Edmonton, AB" title="Hazeldean Edmonton Map" height={400} />
                  </div>
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
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">FAQ</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Frequently Asked Questions</h2>
                </div>
                <Accordion type="single" collapsible className="space-y-3">
                  {faqs.map((faq, i) => (
                    <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-xl border border-border px-6">
                      <AccordionTrigger className="text-left font-semibold text-foreground">{faq.q}</AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Book a Clean in Hazeldean?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">See your flat rate before you book. Nothing is charged until the clean is done.</p>
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
