import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocationPricing from "@/components/LocationPricing";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone } from "lucide-react";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import greenfieldCleanHome from "@/assets/gallery/family-clean-home-edmonton.webp";

const LocationMap = lazy(() => import("@/components/LocationMap"));

export default function Greenfield() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Greenfield?",
      answer: `We offer a full range of services:\n\n• Commercial Cleaning\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes! We offer recurring discounts:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `Deep cleaning adds to our standard package:\n\n• Clean outside AC outlet panels\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• All reachable vents cleaned\n• And more!`
    },
    {
      question: "What is your 100% satisfaction guarantee policy?",
      answer: "If you're not 100% satisfied, call us within 24 hours and we'll return to make it right — at no extra cost!"
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
        <title>House Cleaning in Greenfield Edmonton | Duty Cleaners</title>
        <meta name="description" content="Professional residential cleaning services in Greenfield, Edmonton. Local cleaners serving Greenfield and surrounding areas." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/greenfield-edmonton/" />
        <meta property="og:title" content="House Cleaning in Greenfield Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Professional residential cleaning services in Greenfield, Edmonton. Local cleaners serving Greenfield and surrounding areas." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/greenfield-edmonton/" />
        <meta property="og:image" content="https://dutycleaners.ca/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning in Greenfield Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Professional residential cleaning services in Greenfield, Edmonton. Local cleaners serving Greenfield and surrounding areas." />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Greenfield Edmonton", city: "edmonton", url: "https://dutycleaners.ca/locations/greenfield-edmonton", areaServed: "Greenfield, Edmonton, AB", geo: { latitude: "53.475", longitude: "-113.511" },
}))}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>
        
        {/* Hero Section */}
        <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Greenfield House Cleaning Professionals
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Reliable house cleaners in Greenfield, Edmonton.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="#quote">GET INSTANT PRICE</a>
              </Button>
              <a href="tel:780-913-6565" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
                <Phone className="w-5 h-5" />
                780-913-6565
              </a>
            </div>
          </div>
        </section>

      <LocationPricing />

        {/* Our work in Greenfield homes.
            The alt text describes what the photo actually shows — a Duty Cleaners
            result in an Edmonton home — rather than asserting it depicts Greenfield
            specifically, which we have no photo of. */}
        <section className="py-8 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              <img
                src={greenfieldCleanHome}
                alt="A freshly cleaned family living space in an Edmonton home"
                width={1200}
                height={800}
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* Map */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              <Suspense fallback={<div className="w-full h-[400px] bg-muted animate-pulse" />}>
                <LocationMap center={[53.475, -113.511]} label="Greenfield, Edmonton" />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-6 text-foreground">
              Residential Cleaning in Greenfield – Consistent Help from People Who Live Nearby
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Greenfield isn't just a place on the map—it's a real community, one where people take pride in their homes, know their neighbors, and enjoy a slower, more thoughtful pace of life. From the tidy bungalows near 61 Avenue to the tree-covered paths by Greenfield Park, this neighbourhood is full of character. And we're proud to be a small part of keeping it that way.
              </p>
              <p>
                At Duty Cleaners, we don't just drive through Greenfield—we work here, we know the streets, and we understand the value of being reliable. Our clients don't need to chase us for answers or wonder who's showing up. They know us by name, and we do our best to return that trust with every visit.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                We're Already in the Neighborhood
              </h3>
              <p>
                It's not unusual for our team to have multiple stops in Greenfield during the week—sometimes even on the same street. Whether we're near Greenfield School, close to Southgate Centre, or tucked between the quiet crescents that define this part of town, we're nearby and ready to help when you need it.
              </p>
              <p>
                Being local means less waiting, fewer delays, and a smoother experience all around.
              </p>
              <p>
                We're proud to be among the trusted providers of residential cleaning service in Edmonton—serving the Greenfield neighbourhood with a level of care that reflects the community itself.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                What You Can Expect
              </h3>
              <p>
                We don't overpromise. Instead, we focus on showing up when we say we will, doing the job right, and communicating clearly every step of the way. You won't find call centers or generic replies here—just a small team who respects your home and your time.
              </p>
              <p>
                It's the kind of service that makes sense in a neighbourhood like this: consistent, considerate, and never rushed.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Get an instant quote, without all the hassle.
            </h3>
            <Button size="lg" className="mb-8" asChild>
              <a href="#quote">GET A FREE ESTIMATE</a>
            </Button>
            <div className="space-y-4">
              <p className="text-lg font-semibold text-foreground">Trusted by Alberta families since 2017</p>
              <p className="text-muted-foreground">
                <strong>100% Satisfaction Guarantee.</strong><br />
                We stand behind the quality of our staff. If you're not 100% satisfied with your cleaning, we'll come back and re-clean it at no additional charge, as long as we’re informed within 24 hours after the cleaning.
              </p>
              <Button variant="link" asChild>
                <Link to="/satisfaction-guarantee">Read the Satisfaction Guarantee</Link>
              </Button>
            </div>
          </div>
        </section>

        <HonestReviewLink city="Edmonton" area="Greenfield" />

        {/* Final CTA */}
        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
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
          </div>
        </section>

        <section className="py-16 px-4 bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-3xl font-bold mb-6 text-foreground">
              Ready When You Are
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Let us take one thing off your plate. Whether it's been a busy month, a full week, or just a day that got away from you—we're here to help you feel at ease in your home again.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Call us today or request a free quote online. We'd love to add you to our growing list of Greenfield clients who value service that's close to home and easy to trust.
            </p>
            <Button size="lg" asChild>
              <a href="#quote">GET A FREE ESTIMATE</a>
            </Button>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
