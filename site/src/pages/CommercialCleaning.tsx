import LocalMarketNote from "@/components/LocalMarketNote";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Building2, Briefcase, Dumbbell, UtensilsCrossed, Stethoscope, ShoppingBag, Warehouse, LucideIcon } from "lucide-react";
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

const TITLE = "Office & Commercial Cleaning Edmonton | Duty Cleaners";
const DESCRIPTION =
  "Office and commercial cleaning in Edmonton, scoped around your premises and schedule. Request a walkthrough and a written cleaning quote.";
/** Office cleaning is the one commercial job quoted online (owner, 2026-09-10); Contact.tsx preselects it and the city. */
const QUOTE_HREF = "/contact-us/#topic=office&city=edmonton";

export default function CommercialCleaning() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* Owner, 2026-09-11: the cleaners are subcontractors who choose their own
     products, so no card claims what a product does to a surface; each says
     what the team does, inside the scope agreed at the walkthrough. */
  const industries = [
    { icon: Briefcase, title: "Office Cleaning", description: "Workstations, meeting rooms, kitchens, washrooms and floors, cleaned to the areas and visit frequency set out in your written quote." },
    { icon: Warehouse, title: "Warehouse Cleaning", description: "Floors, loading bays, racking dust and staff washrooms, scoped at the walkthrough around your shifts and deliveries." },
    { icon: ShoppingBag, title: "Retail Cleaning", description: "Sales floors, fitting rooms, counters, entry glass and customer washrooms, cleaned before opening or after close." },
    { icon: Stethoscope, title: "Medical Office Cleaning", description: "Medical-office cleaning is scoped at a walkthrough. Before accepting the work, we confirm the rooms, surfaces, product requirements and documentation we can provide." },
    { icon: UtensilsCrossed, title: "Restaurant Cleaning", description: "Kitchen and dining-area cleaning within the written scope agreed at the walkthrough." },
    { icon: Dumbbell, title: "Gym & Fitness Center", description: "High-touch surfaces wiped down, and change rooms, washrooms and floors cleaned, to the scope agreed at the walkthrough." },
  ];

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/commercial-cleaning/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/commercial-cleaning/" />
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
            name: "Office & Commercial Cleaning Edmonton",
            url: "https://dutycleaners.ca/commercial-cleaning/",
            provider: { "@id": "https://dutycleaners.ca/#edmonton" },
            areaServed: { "@type": "City", name: "Edmonton" },
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
            mainEntity: commercialFaqs("Edmonton", CITY_PROOF.edmonton.phone).map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="edmonton" />
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
                <span>The Edmonton office</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Office &amp; Commercial Cleaning{" "}<br />
                in <span className="text-accent">Edmonton</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Offices and commercial premises in Edmonton, cleaned to a written scope. The areas,
                the visit frequency and the pricing basis are agreed at a walkthrough before any
                work is booked.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-6" asChild>
                  <Link to={QUOTE_HREF}>Request an Office Cleaning Quote</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                  <a href={CITY_PROOF.edmonton.phoneLink}>
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />
                    {CITY_PROOF.edmonton.phone}
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
                  Commercial cleaning in Edmonton, scoped in writing
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Edmonton office cleans offices, retail units, clinics and warehouse space in the
                  city and the communities around it. Every job starts with a walkthrough of the
                  premises, where we agree which rooms and surfaces are in scope and how often the
                  team comes.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Commercial work is priced per square foot. After the walkthrough you get a written
                  quote that states the areas, the visit frequency and the pricing basis, and nothing
                  is booked until you have read it. If your building needs a named product, a key or
                  fob arrangement, or evening access, raise it at the walkthrough so it is in the quote.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <LocalMarketNote
          eyebrow="Edmonton commercial"
          heading="Planning cleaning for your Edmonton premises"
          paragraphs={[
            "If your Edmonton premises use a procurement process, send the requirements before requesting a quote. Include the rooms, surfaces, proposed frequency and any product, documentation or security requirements. We confirm the agreed scope in writing; do not assume that a general office clean meets a specialist contract.",
            "For a downtown building near the Ice District or Jasper Avenue, tell us the approved cleaning hours, parking and loading arrangements, and who authorizes key or fob access. Early or late service must be arranged for your building rather than assumed from its location.",
            "The rest of the volume sits away from the core — clinics and retail in the south around Windermere and Terwillegar, and warehouse and light-industrial space out in the northwest and toward Nisku. Those buildings have long floor runs, dock-level grit, and in the medical ones, the clinic's own product and waste-handling requirements, which a general office scope does not cover. They are scoped by phone and at a walkthrough, on their own terms rather than at an office rate.",
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
                Edmonton office:{" "}
                <a href={CITY_PROOF.edmonton.phoneLink} className="font-semibold text-primary underline underline-offset-4">
                  call {CITY_PROOF.edmonton.phone}
                </a>
                .
              </p>
            </div>
          </section>
        </AnimatedSection>

        <CommercialDepth city="Edmonton" phone={CITY_PROOF.edmonton.phone} phoneLink={CITY_PROOF.edmonton.phoneLink} />

        {/* Service areas — parity with the Calgary page, which added this after
            Search Console showed satellite-town commercial queries ranking at
            position 20-40 with zero clicks because no page named those towns. */}
        <AnimatedSection>
          <section className="py-16 bg-secondary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <span className="text-primary text-sm font-semibold tracking-wider uppercase">Service Areas</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                  Commercial Cleaning Across the Edmonton Region
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  We clean offices, retail units, warehouses and industrial space in Edmonton and the
                  surrounding communities.
                </p>
                <CoverageChips
                  areas={[
                    "St. Albert",
                    "Sherwood Park",
                    "Spruce Grove",
                    "Leduc",
                    "Beaumont",
                    "Fort Saskatchewan",
                    "Stony Plain",
                    "Morinville",
                    "Devon",
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
                  Request a commercial cleaning quote in Edmonton
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Tell us the address, roughly how much floor space needs cleaning, and how often.
                  The Edmonton office arranges the walkthrough and sends the written quote.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8" asChild>
                    <Link to={QUOTE_HREF}>Request an Office Cleaning Quote</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                    <a href={CITY_PROOF.edmonton.phoneLink}>
                      <span className="dc-icon dc-icon-phone mr-2" aria-hidden="true" />
                      Call {CITY_PROOF.edmonton.phone}
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Also serving: <Link to="/commercial-cleaning-services-calgary/" className="text-primary underline underline-offset-2 font-medium">Calgary Commercial Cleaning</Link>
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
