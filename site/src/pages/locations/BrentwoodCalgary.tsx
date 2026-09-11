import { getListing } from "@/lib/google-listings";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, Building2, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import cleanHomeImg from "@/assets/gallery/calgary-clean-home-northwest.webp";
import { buildLocationSchema } from "@/lib/location-schema";
import CoverageChips from "@/components/CoverageChips";

import LocationPricing from "@/components/LocationPricing";
import { sitePriceRange } from "@/data/pricing";
import GoogleMapEmbed from "@/components/GoogleMapEmbed";
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
  { icon: Home, title: "Standard Cleaning", description: "A standard clean is a one-time clean of every room, priced flat by home size.", to: "/calgary/regular-cleaning/", linkText: "Standard cleaning in Brentwood" },
  { icon: Sparkles, title: "Deep Cleaning", description: "A deep clean is the standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/calgary/deep-cleaning/", linkText: "Deep cleaning in Brentwood" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "A move-in or move-out clean goes inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-calgary/", linkText: "Move-out cleaning in Brentwood" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "The team clears dust and debris after a renovation or rebuild in Brentwood.", to: "/post-construction-cleaning-calgary/", linkText: "Post-construction cleaning in Brentwood" },
  { icon: PaintRoller, title: "Wall Washing", description: "Wall washing takes scuffs, handprints and cooking film off painted walls without stripping the finish.", to: "/wall-washing-wall-cleaning-calgary/", linkText: "Wall washing in Brentwood" },
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
        {CITY_PROOF.calgary.googleReviewCount} reviews on our{" "}
        <a
          href={getListing(CITY_PROOF.calgary.city).reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-white underline underline-offset-2 hover:text-accent"
        >
          {CITY_PROOF.calgary.city} Google listing
        </a>
        , which is where that rating is read from.
      </>
    ),
  },
  { icon: Leaf, title: "All Supplies Brought For You", description: "The team brings all supplies and equipment. Leave the water and power on until the clean is done." },
  { icon: ThumbsUp, title: "Re-Clean Guarantee", description: "Tell us within 24 hours if something was missed and the team comes back to re-clean it, at no charge." },
];


const nearbyAreas = ["Varsity","Dalhousie"];

const faqs = [
  {
    question: "How long does an initial cleaning take?",
    answer: `We work to a checklist, not a clock. Your cleaners stay until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
  },
  {
    question: "What cleaning services does Duty Cleaners offer in Brentwood?",
    answer: `In Brentwood, Duty Cleaners' Calgary branch offers:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
  },
  {
    question: "Do you offer discounts?",
    answer: `Yes. A recurring schedule earns a standing discount:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
  },
  {
    question: "What's included in a deep cleaning?",
    answer: `The deep package extends the standard clean with:\n\n• Baseboards wiped\n• Doors wiped\n• Light switches fully cleaned\n• Wall outlet covers wiped\n• Vent covers wiped`
  },
  {
    question: "What happens if something is missed?",
    answer: "Tell us within 24 hours and the team comes back to your Brentwood home to re-clean what was missed, at no charge. Photos help but are not required."
  }
];

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Brentwood Calgary",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/brentwood-calgary",
  priceRange: sitePriceRange(),
  geo: { latitude: "51.0902", longitude: "-114.1366" },
});

export default function BrentwoodCalgary() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>House Cleaning in Brentwood, Calgary | Duty Cleaners</title>
        <meta name="description" content="Between student-rental turnovers and original 1960s vanities, Brentwood homes in Calgary get a flat-rate clean priced by size and paid after the visit." />
        <meta property="og:title" content="House Cleaning in Brentwood, Calgary | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning in Brentwood, Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="Between student-rental turnovers and original 1960s vanities, Brentwood homes in Calgary get a flat-rate clean priced by size and paid after the visit." />
        <meta property="og:description" content="Between student-rental turnovers and original 1960s vanities, Brentwood homes in Calgary get a flat-rate clean priced by size and paid after the visit." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/brentwood-calgary/" />
        <link rel="canonical" href="https://dutycleaners.ca/locations/brentwood-calgary/" />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        {/* The FAQs this page already renders — marked up so machine readers
            get the same Q&A the visitor sees. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen">
        <Navigation city="calgary" />
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
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">Serving Brentwood, NW Calgary</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Brentwood
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Brentwood's 1960s bungalows sit a walk from the University of Calgary, and a share of them are rented to students. Our Calgary branch cleans owner-occupied homes and rental turnovers at a flat rate by home size.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341"><Phone className="mr-2 w-5 h-5" />(403) 768-1341</a>
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Brentwood Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  A Brentwood rental between students is closer to a move-out clean than a maintenance visit. Move-out and standard cleans are both priced flat by home size, before 5% GST.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {services.map((s, i) => <ServiceCard key={i} {...s} />)}
              </div>
            </AnimatedSection>
            <AnimatedSection>
              {/* Up-link to the city hub. /cleaning-services-calgary/ is a
                  subpage, unlike Edmonton's hub which is the homepage, so it is
                  the one that actually needs internal support: it ranked 24.8
                  for "cleaning services calgary" against Edmonton's 6.3 on the
                  identical query, on comparable impressions. */}
              <p className="mt-10 text-center text-muted-foreground">
                {"Brentwood is one of the Calgary neighbourhoods we clean — see "}
                <Link
                  to="/cleaning-services-calgary/"
                  className="text-primary underline underline-offset-2"
                >
                  house cleaning services in Calgary
                </Link>
                {" for the full picture."}
              </p>
            </AnimatedSection>
          </div>
        </section>


        {/* Map */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Find Us</span>
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Brentwood Service Area</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Brentwood Village and the LRT station keep foot traffic steady, and front entries on the walking routes to campus pick up more grit than the crescents behind them.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
                  <GoogleMapEmbed query="Brentwood, Calgary, AB" title="Brentwood Calgary Service Area Map" />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Featured Image */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img width={1024} height={768} src={cleanHomeImg} alt="Living room with a cream sectional sofa and a glass coffee table in afternoon sun" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                </div>
                <div>
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">Turnovers and originals</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Brentwood Rentals and Mid-Century Bungalows</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Between tenants, a Brentwood rental gets the move-out checklist: inside the oven, fridge and microwave, and inside every cabinet, drawer and closet. Scuff lines from furniture moves are a job for wall washing, which is booked together with a clean. The landlord completes the move-out inspection report with the tenant and decides what happens to the deposit. In the owner-occupied bungalows, original vanities keep their porcelain and chrome, and hard Alberta water leaves mineral scale on the taps.
                  </p>
                  <ul className="space-y-3">
                    {["Cleaners reference-checked, then rated by you","All supplies and equipment brought in","Re-clean at no charge if told within 24 hours"].map((t,i)=>(
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-1" />
                        <span className="text-foreground">{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Local Coverage */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <AnimatedSection>
              <div className="text-center mb-10">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Local Coverage</span>
                <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">More Calgary-area neighbourhoods we clean</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Our Calgary branch cleans 66 Calgary neighbourhoods, Brentwood among them, plus nine communities outside the city such as Airdrie and Cochrane.{" "}
                  <Link to="/locations/" className="text-primary underline underline-offset-2">
                    See every area we serve
                  </Link>.
                </p>
              </div>
              <CoverageChips areas={nearbyAreas} />
            </AnimatedSection>
          </div>
        </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Local knowledge"
        heading="Brentwood bungalows and student wear"
        paragraphs={[
          "Brentwood's 1960s bungalows sit a walk from the University of Calgary, and a meaningful share run as student rentals — which compresses years of wear into semesters. Turnover cleans here are a distinct job: inside appliances and closet shelving, closer to a move-out standard than a maintenance visit.",
          "Owner-occupied homes are classic mid-century: hardwood under carpet, plaster ceilings, original vanities whose porcelain and chrome reward polishing. Brentwood Village and the LRT station keep pedestrian traffic steady, and homes along the walking routes to campus see more front-entry grit than the crescents behind them.",
        ]}
      />

      <NearbyNeighbourhoods />

      <LocationPricing />

        {/* Why Choose Us */}
        <section className="py-20 bg-brand-navy relative overflow-hidden">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
          <div className="container mx-auto px-4 relative z-10">
            <AnimatedSection>
              <div className="text-center mb-14">
                <span className="text-accent text-sm font-semibold tracking-wider uppercase">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Brentwood Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Every cleaner is reference-checked before a first job and rated after each visit, and every clean carries a 24-hour re-clean guarantee.
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {whyUsItems.map((item, i) => <WhyUsCard key={i} {...item} />)}
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-background">
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Book a Clean in Brentwood?</h2>
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                See your flat rate before you book. Nothing is charged until the clean is done.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="tel:4037681341"><Phone className="mr-2 w-5 h-5" />Call (403) 768-1341</a>
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
