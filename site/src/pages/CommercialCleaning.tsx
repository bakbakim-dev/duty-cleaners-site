import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Building2, CheckCircle2, Clock, Shield, Award, Users, Phone,
  Star, Sparkles, Briefcase, Dumbbell, UtensilsCrossed, Stethoscope,
  ShoppingBag, Warehouse, ThumbsUp, Leaf, CalendarCheck, LucideIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import CommercialDepth, { commercialFaqs } from "@/components/CommercialDepth";

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

export default function CommercialCleaning() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const industries = [
    { icon: Briefcase, title: "Office Cleaning", description: "Maintain a professional, productive workspace. From desks and keyboards to common areas, we keep your office pristine and hygienic." },
    { icon: Warehouse, title: "Warehouse Cleaning", description: "Industrial-strength cleaning for warehouses and storage facilities. We handle large spaces with specialized equipment and techniques." },
    { icon: ShoppingBag, title: "Retail Cleaning", description: "Create a welcoming environment for customers with sparkling clean retail spaces that reflect your brand's commitment to excellence." },
    { icon: Stethoscope, title: "Medical Office Cleaning", description: "Specialized cleaning for healthcare facilities with strict sanitation protocols to ensure a safe environment for patients and staff." },
    { icon: UtensilsCrossed, title: "Restaurant Cleaning", description: "Commercial kitchen and dining area cleaning that keeps your restaurant spotless." },
    { icon: Dumbbell, title: "Gym & Fitness Center", description: "High-touch surface sanitization and thorough cleaning to maintain a healthy environment for members and staff." },
  ];

  return (
    <>
      <Helmet>
        <title>Commercial Cleaning Services Edmonton | Duty Cleaners</title>
        <meta name="description" content="Professional commercial cleaning services in Edmonton. Offices, warehouses, retail, medical facilities & more. Pay after your clean. Get a free estimate today!" />
        <link rel="canonical" href="https://dutycleaners.ca/commercial-cleaning/" />
        <meta property="og:title" content="Commercial Cleaning Services Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Professional commercial cleaning services in Edmonton. Offices, warehouses, retail, medical facilities & more. Pay after your clean. Get a free estimate today!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/commercial-cleaning/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Commercial Cleaning Services Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Professional commercial cleaning services in Edmonton. Offices, warehouses, retail, medical facilities & more. Pay after your clean. Get a free estimate today!" />
        {/* These pages carried no structured data at all. Service ties the
            offering to the city LocalBusiness node; FAQPage mirrors the Q&A
            rendered further down the page. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            serviceType: "Commercial Cleaning",
            name: "Commercial Cleaning Services Edmonton",
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
            mainEntity: commercialFaqs("Edmonton", "(780) 913-6565").map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="edmonton" />
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
                <span>Trusted by Edmonton Businesses</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Commercial Cleaning<br />
                Services in <span className="text-accent">Edmonton</span>
              </h1>

              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                Professional, reliable cleaning tailored to your business. We keep your workspace spotless so you can focus on what matters most.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-6" asChild>
                  <Link to="/contact-us">Get Free Estimate</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />
                    (780) 913-6565
                  </a>
                </Button>
              </div>

              <div className="flex flex-wrap justify-center gap-6 pt-4 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Flexible Scheduling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Transparent Pricing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-accent" />
                  <span>Industry-Specific Cleaning</span>
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
                  Edmonton's Premier Commercial Cleaning
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Edmonton businesses need clean, well-maintained spaces to provide a welcoming environment for clients 
                  and a productive atmosphere for employees. At Duty Cleaners, we deliver top-quality commercial cleaning 
                  customized to your business's needs.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  From corporate offices to warehouses and retail spaces, our trained cleaners handle routine cleaning, 
                  deep cleaning, and specialty services. Regular professional cleaning shows your team they're 
                  valued and helps them work with confidence and motivation.
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

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
                <FeatureItem icon={Shield} title="Customer-Rated Cleaners" description="Every cleaner is reference-checked before working in a customer’s home." />
                <FeatureItem icon={Award} title="Experienced Professionals" description="Years of experience in commercial cleaning with specialized training for different industries." />
                <FeatureItem icon={CalendarCheck} title="Flexible Scheduling" description="We work around your business hours with options for weekend cleanings." />
                <FeatureItem icon={ThumbsUp} title="100% Satisfaction Guaranteed" description="If you're not happy with our service, we’ll come back free of charge. Simply let us know within 24 hours after your cleaning, and we’ll make it right." />
                <FeatureItem icon={Star} title="Transparent Pricing" description="Upfront, honest pricing with no hidden fees. We provide detailed quotes and work within your budget." />
                <FeatureItem icon={Leaf} title="Safe Quality Products" description="Safe, non-toxic cleaning products that are effective for commercial environments and gentle on surfaces." />
              </div>
            </div>
          </section>
        </AnimatedSection>

        <CommercialDepth city="Edmonton" phone="(780) 913-6565" phoneLink="tel:7809136565" />

        {/* CTA Section */}
        <AnimatedSection>
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto bg-secondary/30 rounded-2xl p-10 text-center border border-border">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                  Contact us today for a free estimate and let us help you maintain a clean, professional workspace.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8" asChild>
                    <Link to="/contact-us">Get Free Estimate</Link>
                  </Button>
                  <Button size="lg" variant="outline" className="h-12 px-8" asChild>
                    <a href="tel:7809136565">
                      <Phone className="mr-2" />
                      Call (780) 913-6565
                    </a>
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-6">
                  Also serving: <Link to="/commercial-cleaning-services-calgary" className="text-primary hover:underline font-medium">Calgary Commercial Cleaning</Link>
                </p>
              </div>
            </div>
          </section>
        </AnimatedSection>

        <Footer />
      </div>
    </>
  );
}
