import LocalMarketNote from "@/components/LocalMarketNote";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Building2, Shield, Award, Star, Briefcase, Dumbbell, UtensilsCrossed, Stethoscope, ShoppingBag, Warehouse, ThumbsUp, ClipboardCheck, CalendarCheck, LucideIcon } from "lucide-react";
import { POLICY } from "@/data/policy";
import { CITY_PROOF } from "@/data/proof";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import CommercialDepth, { commercialFaqs } from "@/components/CommercialDepth";
import CoverageChips from "@/components/CoverageChips";

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

const IndustryCard = ({
  icon: Icon,
  title,
  description,
  index = 0,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  index?: number;
}) => (
  <div
    className={`group bg-white rounded-xl border border-border p-6 transition-all duration-300 ease-out cursor-default hover:-translate-y-2 ${index % 2 === 0 ? "hover:translate-x-0.5" : "hover:-translate-x-0.5"} hover:border-primary hover:shadow-xl hover:shadow-primary/10`}
    style={{ transformStyle: "preserve-3d" }}
  >
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
      <Icon className="w-6 h-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
    </div>
    <h3 className="font-bold text-lg mb-2 transition-transform duration-300 group-hover:translate-x-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const FeatureItem = ({ icon: Icon, title, description }: { icon: LucideIcon; title: string; description: string }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
      <Icon className="w-5 h-5 text-accent" />
    </div>
    <div>
      <h3 className="font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-white/90 leading-relaxed">{description}</p>
    </div>
  </div>
);

const TITLE = "Office & Commercial Cleaning Calgary | Duty Cleaners";
const DESCRIPTION =
  "Office and commercial cleaning in Calgary, scoped around your premises and schedule. Request a walkthrough and a written cleaning quote.";
/** Office cleaning is the one commercial job quoted online (owner, 2026-09-10); Contact.tsx preselects it and the city. */
const QUOTE_HREF = "/contact-us/#topic=office&city=calgary";

export default function CommercialCleaningCalgary() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Owner, 2026-09-11: the cleaners are subcontractors who choose their own
     products, so no card claims what a product does to a surface or that the
     work meets an inspector's standard; each says what the team does, inside
     the scope agreed at the walkthrough. */
  const industries = [
    { icon: Briefcase, title: "Office Cleaning", description: "Desks, meeting rooms, break rooms, washrooms and floors, on the visit frequency set out in your written quote." },
    { icon: Warehouse, title: "Warehouse Cleaning", description: "Long floor runs, dock areas, racking dust and site washrooms, scoped at the walkthrough so cleaning never blocks a shift." },
    { icon: ShoppingBag, title: "Retail Cleaning", description: "Counters, fitting rooms, entry glass, sales floors and customer washrooms, timed around opening hours." },
    { icon: Stethoscope, title: "Medical Office Cleaning", description: "Medical-office cleaning is scoped at a walkthrough. Before accepting the work, we confirm the rooms, surfaces, product requirements and documentation we can provide." },
    { icon: UtensilsCrossed, title: "Restaurant Cleaning", description: "Kitchen and dining-area cleaning within the written scope agreed at the walkthrough." },
    { icon: Dumbbell, title: "Gym & Fitness Center", description: "High-touch surfaces wiped down, and change rooms, washrooms and floors cleaned, to the scope agreed at the walkthrough." },
  ];

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/commercial-cleaning-services-calgary/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/commercial-cleaning-services-calgary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        {/* These pages carried no structured data at all. Service ties the
            offering to the city LocalBusiness node; FAQPage mirrors the Q&A
            rendered further down the page. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Commercial Cleaning",
            name: "Office & Commercial Cleaning Calgary",
            url: "https://dutycleaners.ca/commercial-cleaning-services-calgary/",
            provider: { "@id": "https://dutycleaners.ca/#calgary" },
            areaServed: { "@type": "City", name: "Calgary" },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "Commercial cleaning services",
              itemListElement: [
                "Office cleaning", "Janitorial services", "Retail space cleaning",
                "Warehouse cleaning", "Medical office cleaning", "Restaurant cleaning",
              ].map((n) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: n } })),
            },
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: commercialFaqs("Calgary", CITY_PROOF.calgary.phone).map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="calgary" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section - Dark Navy */}
        <section className="relative bg-brand-navy text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/15 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
                <Building2 className="w-4 h-4 text-accent" />
                <span>The Calgary office</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Office &amp; Commercial Cleaning{" "}<br />
                in <span className="text-accent">Calgary</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Calgary offices, shops, clinics and warehouses, cleaned to a scope you agree at a
                walkthrough and see in writing before the first visit is booked.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-6" asChild>
                  <Link to={QUOTE_HREF}>Request an Office Cleaning Quote</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                  <a href={CITY_PROOF.calgary.phoneLink}>
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />
                    {CITY_PROOF.calgary.phone}
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <span className="dc-icon dc-icon-circle-check w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Walkthrough before the quote</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="dc-icon dc-icon-circle-check w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Priced per square foot</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="dc-icon dc-icon-circle-check w-4 h-4 text-accent" aria-hidden="true" />
                  <span>Scope confirmed in writing</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <AnimatedSection>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">About Our Service</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-6">
                  Commercial cleaning in Calgary, scoped in writing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  A commercial job with the Calgary office begins on site. Someone from the office
                  walks the premises with you, notes the floor types, the washrooms and the rooms that
                  matter most, and asks when the building is empty enough to clean.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The price is per square foot of the area cleaned. You receive it as a written quote
                  listing the areas, the visit frequency and the pricing basis, and the first visit is
                  booked only once you have agreed to it. Access, alarm codes and any product your
                  site requires belong in that conversation too.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <LocalMarketNote
          accent="calgary"
          eyebrow="Calgary commercial"
          heading="Planning cleaning for your Calgary premises"
          paragraphs={[
            "For a Calgary office with shared floors, vacant rooms or renovation work nearby, identify exactly which areas need service. Occupied office cleaning and post-construction cleanup need different scopes. A walkthrough lets us agree on the surfaces, access and tasks before issuing a written quote.",
            "Tell us when cleaning is permitted in your building, whether before opening or after closing. Arrange the security sign-in, freight elevator if required, and an authorized access contact. We confirm the service window for your premises; we do not assume a schedule from your industry or neighbourhood.",
            "Outside the core it is a different job again. The industrial and warehouse stock through the northeast toward the airport, and the retail and clinic space in the newer south and far-north communities, come with their own constraints: dock-level dust, long unbroken floor runs, and in medical space, the clinic's own product and waste-handling requirements, which a general office scope does not cover. We scope those by phone and at a walkthrough and price them separately rather than folding them into a single rate.",
          ]}
        />

        {/* Industries We Serve */}
        <AnimatedSection>
          <section className="py-16 bg-secondary/30">
            <div className="container mx-auto px-4">
              <div className="text-center mb-10">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">What We Clean</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Industries We Serve</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {industries.map((industry, index) => (
                  <IndustryCard key={index} icon={industry.icon} title={industry.title} description={industry.description} index={index} />
                ))}
              </div>

              {/* Owner, 2026-09-10: office cleaning is the only commercial work
                  quoted through the form; everything else starts with a call. */}
              <p className="mt-8 text-center text-muted-foreground max-w-2xl mx-auto">
                Office cleaning can be requested with the quote form. Warehouse, retail, medical,
                restaurant and gym premises are scoped by phone and at a walkthrough with the
                Calgary office:{" "}
                <a href={CITY_PROOF.calgary.phoneLink} className="font-semibold text-primary underline underline-offset-4">
                  call {CITY_PROOF.calgary.phone}
                </a>
                .
              </p>
            </div>
          </section>
        </AnimatedSection>

        {/* Why Choose Us - Dark Navy */}
        <AnimatedSection>
          <section className="relative bg-brand-navy text-white py-16 overflow-hidden">
            <div className="absolute top-0 left-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
              <div className="text-center mb-10">
                <span className="text-accent font-semibold text-sm uppercase tracking-wide">Why Us</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Why Choose Duty Cleaners</h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                <FeatureItem icon={Shield} title="Customer-Rated Cleaners" description="Every cleaner is reference-checked before their first job and rated after every visit. Those ratings decide who keeps working on your site." />
                <FeatureItem icon={Award} title="Experienced Professionals" description="Cleaning in Alberta since 2017. For contracts needing specific insurance certificates or security clearances, ask at the walkthrough and we confirm in writing what we can provide." />
                <FeatureItem icon={CalendarCheck} title="Flexible Scheduling" description="Early-morning, evening and weekend visits outside the Calgary office's regular hours can be arranged around the hours your business keeps." />
                <FeatureItem icon={ThumbsUp} title="Missed Items Re-Cleaned" description={`Tell us within ${POLICY.guaranteeWindowHours} hours of the clean if something in the agreed scope was missed, and the team comes back to clean it at no charge.`} />
                <FeatureItem icon={Star} title="Written Quotes" description="Priced per square foot, with the areas, the visit frequency and the pricing basis set out in writing before anything is booked." />
                <FeatureItem icon={ClipboardCheck} title="Products and Site Protocols" description="Tell us about required products and site protocols at the walkthrough. We confirm in writing which requirements we can meet before you book." />
              </div>
            </div>
          </section>
        </AnimatedSection>

        <CommercialDepth city="Calgary" phone={CITY_PROOF.calgary.phone} phoneLink={CITY_PROOF.calgary.phoneLink} />

        {/* Service areas.
            Search Console shows real, entirely unserved demand for commercial
            cleaning in the Calgary-region towns — "commercial cleaning services
            cochrane" (1,946 impressions), "industrial cleaning cochrane" (1,582)
            and "office cleaning services airdrie" (1,536) all rank between
            position 20 and 40 with ZERO clicks, because this page never named a
            single one of those towns. */}
        <AnimatedSection>
          <section className="py-16 bg-secondary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Service Areas</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                  Commercial Cleaning Across the Calgary Region
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We clean offices, retail units, warehouses and industrial space in Calgary and the
                  surrounding towns, including Cochrane, Airdrie, Okotoks and Chestermere. Commercial
                  work is priced per square foot, scoped at a walkthrough and confirmed in a written
                  quote that states the areas, visit frequency and pricing basis before work is booked.
                </p>
                <CoverageChips
                  areas={[
                    "Cochrane",
                    "Airdrie",
                    "Okotoks",
                    "Chestermere",
                    "Strathmore",
                    "High River",
                    "Langdon",
                    "Crossfield",
                    // Black Diamond and Turner Valley are one town since 2023.
                    "Diamond Valley",
                  ]}
                />
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* CTA Section */}
        <AnimatedSection>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto bg-secondary/30 rounded-2xl p-10 text-center border border-border">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Request a commercial cleaning quote in Calgary
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Send the address, the approximate area to be cleaned and the visit frequency you
                  have in mind. The Calgary office books the walkthrough and follows it with a written quote.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8" asChild>
                    <Link to={QUOTE_HREF}>Request an Office Cleaning Quote</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                    <a href={CITY_PROOF.calgary.phoneLink}>
                      <span className="dc-icon dc-icon-phone mr-2" aria-hidden="true" />
                      Call {CITY_PROOF.calgary.phone}
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Also serving: <Link to="/commercial-cleaning/" className="text-primary underline underline-offset-2 font-medium">Edmonton Commercial Cleaning</Link>
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>
        </main>

        <Footer />
      </div>
    </>
  );
}
