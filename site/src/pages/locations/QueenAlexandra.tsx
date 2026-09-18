import { Link } from "react-router-dom";
import LocalMarketNote from "@/components/LocalMarketNote";
import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods";
import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocationPricing from "@/components/LocationPricing";
import { Button } from "@/components/ui/button";

import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import strathconaCleanHome from "@/assets/gallery/old-strathcona-cleaner-home.webp";

const LocationMap = lazy(() => import("@/components/LocationMap"));

const QueenAlexandra = () => {
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. The crew stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Queen Alexandra?",
      answer: `In Queen Alexandra, the Edmonton branch books these services:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes. A recurring standard clean is discounted by frequency:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `Beyond the standard scope, deep cleaning covers:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Baseboards and doors wiped\n• Light switches fully cleaned\n• Vent covers wiped`
    },
    {
      question: "What happens if something is missed?",
      answer: "Tell us within 24 hours and the team comes back to your home to re-clean what was missed, at no charge. Photos help but are not required."
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
        <title>House Cleaning in Queen Alexandra, Edmonton</title>
        <meta name="description" content="Move-out and suite cleaning in Queen Alexandra, Edmonton, where about seven in ten homes are rented and possession dates cluster at month end." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/queen-alexandra-edmonton/" />
        <meta property="og:title" content="House Cleaning in Queen Alexandra, Edmonton" />
        <meta property="og:description" content="Move-out and suite cleaning in Queen Alexandra, Edmonton, where about seven in ten homes are rented and possession dates cluster at month end." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/queen-alexandra-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning in Queen Alexandra, Edmonton" />
        <meta name="twitter:description" content="Move-out and suite cleaning in Queen Alexandra, Edmonton, where about seven in ten homes are rented and possession dates cluster at month end." />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Queen Alexandra Edmonton", city: "edmonton", url: "https://dutycleaners.ca/locations/queen-alexandra-edmonton", areaServed: "Queen Alexandra, Edmonton, AB",   geo: { latitude: "53.518", longitude: "-113.504" },
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
        <section className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6">
              <h1 className="display-serif text-[2rem] sm:text-[2.25rem] md:text-[3rem] leading-[1.12] text-balance text-foreground">
                Queen Alexandra House Cleaning Professionals
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Just over half the homes in Queen Alexandra are low-rise walk-up apartments, and about seven in ten are rented in the <a href="https://data.edmonton.ca/Census/2016-Census-Dwelling-Unit-by-Ownership-Neighbourho/d2xp-ctch" target="_blank" rel="noopener noreferrer" className="text-accent-on-dark underline underline-offset-2">City of Edmonton's 2016 municipal census</a>. Every clean is a flat rate by home size, shown before you book.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone mr-2 h-5 w-5" aria-hidden="true" />
                    (780) 913-6565
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="What we see"
        heading="Seven in ten of it is rented"
        paragraphs={[
          "Seven of every ten homes between Whyte Avenue and 70 Avenue that reported their tenure in the City's 2016 municipal census are rented, and just over half the stock is low-rise walk-up apartments rather than houses. That shapes the calendar more than the method: possession dates cluster at month end, and a suite handed back gets the oven, the fridge seals and every cabinet interior whether the last tenant opened them or not.",
          "Whyte Avenue's pedestrian strip closes the north side. Ground-floor suites and the first buildings in off the avenue take what the sidewalk carries — grit through winter, dust through summer, and a film on street-facing glass that comes back faster than anything the household itself produces.",
        ]}
      />

      <LocationPricing />

        {/* This picture is not documented as a photo of a Queen Alexandra or Old
            Strathcona home, so the alt text describes what it shows and names no
            place, customer or cleaner. */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              <img
                src={strathconaCleanHome}
                alt="A cleaner vacuuming a loft living room with exposed brick walls, overhead ductwork and tall windows"
                width={896}
                height={672}
                className="w-full h-auto object-cover"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4">
          <div className="container mx-auto max-w-4xl prose prose-lg">
            <h2 className="display-serif text-2xl md:text-3xl font-bold text-balance">Residential Cleaning in Queen Alexandra</h2>
            <p>
              Most homes in Queen Alexandra are rented, and possession dates cluster at month end. A move-out clean on a suite covers the oven, the fridge seals and every cabinet interior, whether the last tenant used them or not.
            </p>
            <p>
              Under Alberta's Residential Tenancies Act, the landlord completes a move-out inspection report with the tenant. Within 10 days of the tenant moving out, the landlord must return the deposit, or return what is left with a written statement of any deductions (an estimate is allowed, with the final statement within 30 days), as set out in{" "}
              <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's rules on ending a tenancy</a>. We do not promise the deposit comes back; the landlord decides.
            </p>

            <h3 className="text-3xl font-bold">Arrival Windows, Keys and Lockboxes</h3>
            <p>
              We book an arrival window, not an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM, or 3:00 to 4:00 PM. You do not need to be home. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves.
            </p>
            <p>
              Changing or cancelling a booking needs 24 hours' notice, and a fee applies to any change or cancellation made inside 24 hours. Nothing is charged at booking; the card is charged once the clean is complete.
            </p>

            <h3 className="text-3xl font-bold">Whyte Avenue Grit Through an Edmonton Winter</h3>
            <p>
              Edmonton holds its cold rather than cycling through thaws, so the sand and salt tracked in from November arrive dry and stay, working into carpet edges and along baseboards. The spring melt in late March and April brings a whole winter of grit indoors in about three weeks.
            </p>
            <p>
              Ground-floor suites near Whyte Avenue add the sidewalk's own grit to that load. Interior windows are an add-on, and exterior windows are outdoor work that is not part of a clean.
            </p>
          </div>
        </section>

        {/* Map */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              <Suspense fallback={<div className="w-full h-[400px] bg-muted animate-pulse" />}>
                <LocationMap center={[53.518, -113.504]} label="Queen Alexandra, Edmonton" />
              </Suspense>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="display-serif text-2xl md:text-3xl font-bold text-balance">See Your Queen Alexandra Price Before You Book</h2>
            <Button size="lg" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-2">Serving Alberta homes</p>
              <p className="text-2xl font-bold">SINCE 2017</p>
              <p className="text-lg font-semibold mt-4">24-Hour Re-Clean Guarantee</p>
              <p className="text-muted-foreground">
                If something was missed, tell us within 24 hours and the team comes back to re-clean it at no charge.
              </p>
            </div>
          </div>
        </section>

        {/* Bespoke layout with no services grid — this was one of two location
            pages with no path into the service pages at all. */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="display-serif text-2xl font-bold mb-4 text-foreground text-balance">Cleaning services in Queen Alexandra</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li>
                <Link to="/edmonton/regular-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Standard cleaning in Queen Alexandra
                </Link>
              </li>
              <li>
                <Link to="/edmonton/deep-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Deep cleaning in Queen Alexandra
                </Link>
              </li>
              <li>
                <Link to="/move-out-cleaning-edmonton/" className="font-semibold text-primary hover:text-accent">
                  Move-out cleaning in Queen Alexandra
                </Link>
              </li>
              <li>
                <Link to="/post-construction-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Post-construction cleaning in Queen Alexandra
                </Link>
              </li>
              <li>
                <Link to="/wall-washing-wall-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Wall washing in Queen Alexandra
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-muted-foreground">
              {"Queen Alexandra is one of the Edmonton neighbourhoods we clean. See "}
              <Link to="/" className="text-primary underline underline-offset-2">
                house cleaning services in Edmonton
              </Link>
              {" for the full picture."}
            </p>
          </div>
        </section>

        <HonestReviewLink city="Edmonton" area="Queen Alexandra" />

        {/* Final CTA */}
        {/* FAQ */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">Frequently Asked Questions</h2>
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

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-balance">Book a Clean in Queen Alexandra</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See your flat rate before you book, and pay nothing until the clean is done. The price is set by home size before 5% GST, and a pet charge or home-type surcharge shows on the quote when it applies.
            </p>
            <p className="text-muted-foreground">
              The Edmonton office answers (780) 913-6565 Monday to Saturday from 8:00 AM to 8:00 PM and Sunday from 9:00 AM to 3:00 PM.
            </p>
            <Button size="lg" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default QueenAlexandra;
