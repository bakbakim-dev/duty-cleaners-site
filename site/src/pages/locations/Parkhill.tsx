import { WALL_WASHING_DESCRIPTION } from "@/data/service-copy";
import { getListing } from "@/lib/google-listings";
import {
  CITY_PROOF } from "@/data/proof"; import { RATING_CLAIM } from "@/data/proof"; import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods"; import LocalMarketNote from "@/components/LocalMarketNote"; import { useEffect } from "react"; import { Helmet } from "react-helmet-async"; import Navigation from "@/components/Navigation"; import Footer from "@/components/Footer"; import Breadcrumbs from "@/components/Breadcrumbs"; import { Button } from "@/components/ui/button"; import { useScrollAnimation } from "@/hooks/use-scroll-animation"; import { Link } from "react-router-dom"; import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; import {   Phone, CheckCircle2, Star, Shield, Clock, Award, Home, Sparkles, Truck, SprayCan, Bath, Building2, Leaf, Users, CalendarCheck, ThumbsUp, MapPin, Mail, PaintRoller
} from "lucide-react";
import cleanHomeImg from "@/assets/gallery/neighborhoods/parkhill.webp";
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
  { icon: Home, title: "Standard Cleaning", description: "A one-time clean of every room, priced flat by home size.", to: "/calgary/regular-cleaning/", linkText: "Standard cleaning in Parkhill" },
  { icon: Sparkles, title: "Deep Cleaning", description: "The standard checklist plus the deep-clean package: baseboards, doors, light switches, wall outlets and vent covers.", to: "/calgary/deep-cleaning/", linkText: "Deep cleaning in Parkhill" },
  { icon: Truck, title: "Move In/Out Cleaning", description: "Inside the oven, fridge and microwave, and inside every cabinet, drawer and closet.", to: "/move-out-cleaning-calgary/", linkText: "Move-out cleaning in Parkhill" },
  { icon: SprayCan, title: "Post-Construction Cleanup", description: "Construction dust after a Parkhill renovation, priced by the home's square footage.", to: "/post-construction-cleaning-calgary/", linkText: "Post-construction cleaning in Parkhill" },
  { icon: PaintRoller, title: "Wall Washing", description: WALL_WASHING_DESCRIPTION, to: "/wall-washing-wall-cleaning-calgary/", linkText: "Wall washing in Parkhill" },
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


const nearbyAreas = ["Stanley Park", "Erlton", "Rideau Park", "Roxboro", "Manchester", "Mission"];

const faqs = [
  {
    question: "How long does an initial cleaning take?",
    answer: `We work to a checklist, not a clock. Your Parkhill team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
  },
  {
    question: "What cleaning services does Duty Cleaners offer in Parkhill?",
    answer: `In Parkhill, the Calgary branch books these services:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
  },
  {
    question: "Do you offer discounts?",
    answer: `Yes — the discount grows with visit frequency:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
  },
  {
    question: "What's included in a deep cleaning?",
    answer: `The deep package extends the standard clean with:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped`
  },
  {
    question: "What happens if something is missed?",
    answer: "Tell us within 24 hours and the team comes back to your Parkhill home to re-clean what was missed, at no charge. Photos help but are not required."
  }
];

const structuredData = buildLocationSchema({
  name: "Duty Cleaners - Parkhill Calgary",
  city: "calgary",
  url: "https://dutycleaners.ca/locations/parkhill-calgary",
  priceRange: sitePriceRange(),
  geo: { latitude: "51.0250", longitude: "-114.0623" },
});

export default function Parkhill() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>House Cleaning Services in Parkhill, Calgary | Duty Cleaners</title>
        <meta name="description" content="Parkhill homes near Macleod Trail get a wet pass on entry tile for winter brine; those on the Elbow River valley side collect fine pathway dust on sills." />
        <meta property="og:title" content="House Cleaning Services in Parkhill, Calgary | Duty Cleaners" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning Services in Parkhill, Calgary | Duty Cleaners" />
        <meta name="twitter:description" content="Parkhill homes near Macleod Trail get a wet pass on entry tile for winter brine; those on the Elbow River valley side collect fine pathway dust on sills." />
        <meta property="og:description" content="Parkhill homes near Macleod Trail get a wet pass on entry tile for winter brine; those on the Elbow River valley side collect fine pathway dust on sills." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/parkhill-calgary/" />
        <link rel="canonical" href="https://dutycleaners.ca/locations/parkhill-calgary/" />
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
                <span className="text-white/90 text-sm font-medium">Serving Parkhill, SW Calgary</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Professional House Cleaning in Parkhill
              </h1>
              <p className="text-lg md:text-xl text-white/80 mb-10 max-w-3xl mx-auto leading-relaxed">
                Parkhill runs from Macleod Trail on its eastern edge to ground that falls away west into the Elbow River valley. Homes near the road collect winter brine haze, and homes on the valley side collect fine pathway dust.
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
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Cleaning Services for Parkhill Homes</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  Each of these services is bookable in Parkhill through the Calgary branch, and the quote shows the flat price before anything is booked.
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
                {"Parkhill is one of the Calgary neighbourhoods we clean — see "}
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
                  <h2 className="text-3xl font-bold text-foreground mt-2 mb-4">Parkhill Service Area</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Parkhill is inside Calgary city limits, so there is no trip fee on a Parkhill booking.
                  </p>
                </div>
                <div className="rounded-2xl overflow-hidden shadow-xl border border-border">
                  <GoogleMapEmbed query="Parkhill, Calgary, AB" title="Parkhill Calgary Service Area Map" />
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
                  <img width={1024} height={768} src={cleanHomeImg} alt="White bathroom with a glass shower screen over the tub, a rain shower head and a pedestal sink" className="w-full h-full object-cover aspect-[4/3]" loading="lazy" />
                </div>
                <div>
                  <span className="text-primary text-sm font-semibold tracking-wider uppercase">What a Parkhill clean covers</span>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4">Bathrooms, kitchens and floors, done properly</h2>
                  <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                    Hard Alberta water leaves mineral scale on taps, shower glass and kettles. Calgary thaws and refreezes on chinooks all winter, so sand and de-icer reach the door again and again from November to April and settle along baseboards and carpet edges.
                  </p>
                  <ul className="space-y-3">
                    {["Customer-rated cleaners","All supplies and equipment brought","Re-clean at no charge if you tell us within 24 hours"].map((t,i)=>(
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
                  Duty Cleaners cleans homes across Parkhill and in these nearby Calgary neighbourhoods.{" "}
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
        eyebrow="From the route"
        heading="What Macleod Trail leaves behind"
        paragraphs={[
          "Macleod Trail runs the length of the eastern boundary, and the City names it among the roads carrying over twenty thousand vehicles a day — the tier it treats first with anti-icing brine when snow is forecast. Storm doors and east-facing glass on those first blocks carry a pale brine haze all winter, and entry tile picks the same thing up off boots. Salt wants rinsing off before a cloth goes near it, so in those homes the tile gets a wet pass first.",
          "The opposite edge has no traffic at all. Ground falls away west into the Elbow River valley, with Stanley Park and the river pathway below. That side stays open to whatever moves through the valley, and the work follows — fine pathway dust settling on sills through summer, damp entry mats through the melt, and patio door tracks that need doing far more often than anything up on the flat.",
        ]}
        accent="calgary"
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
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">Why Parkhill Residents Choose Duty Cleaners</h2>
                <p className="text-white/90 max-w-2xl mx-auto text-lg">
                  Cleaners are reference-checked first and rated after each Parkhill visit, and a missed spot reported within 24 hours gets a return visit at no charge.
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
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Book a Clean in Parkhill?</h2>
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
