import LocalMarketNote from "@/components/LocalMarketNote";
import NearbyNeighbourhoods from "@/components/NearbyNeighbourhoods";
import { useEffect, lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import LocationPricing from "@/components/LocationPricing";
import { POLICY } from "@/data/policy";
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
      answer: `We work to a checklist, not a clock. Your Greenfield team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Greenfield?",
      answer: `Every service we run can be booked locally:\n\n• Standard & Deep Cleaning Packages\n• Move-In & Move-Out Cleaning\n• Post-Construction Cleaning\n• Wall Washing and Wall Cleaning`
    },
    {
      question: "Do you offer discounts?",
      answer: `Yes — customers in Greenfield on a recurring schedule save:\n\n• Every week: 20% off\n• Every two weeks: 15% off\n• Every four weeks: 10% off\n\nDiscounts start from the second visit; the first clean is charged at the one-time rate.`
    },
    {
      question: "What's included in a deep cleaning?",
      answer: `In Greenfield, a deep clean adds to the standard package:\n\n• Wall outlet covers wiped\n• Cobweb removal\n• Ceiling fans dusted and cleaned\n• Light switches fully cleaned\n• Vent covers wiped`
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
        <title>House Cleaning in Greenfield Edmonton | Duty Cleaners</title>
        <meta name="description" content="Most Greenfield houses in Edmonton went up in the 1960s. In kitchens and baths never redone, porous grout and stained tub surrounds set the pace." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/greenfield-edmonton/" />
        <meta property="og:title" content="House Cleaning in Greenfield Edmonton | Duty Cleaners" />
        <meta property="og:description" content="Most Greenfield houses in Edmonton went up in the 1960s. In kitchens and baths never redone, porous grout and stained tub surrounds set the pace." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/locations/greenfield-edmonton/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="House Cleaning in Greenfield Edmonton | Duty Cleaners" />
        <meta name="twitter:description" content="Most Greenfield houses in Edmonton went up in the 1960s. In kitchens and baths never redone, porous grout and stained tub surrounds set the pace." />
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
              Greenfield is almost all detached houses, most of them built in the 1960s. Our Edmonton branch cleans them at a flat rate by home size before GST, and a bungalow or a two-storey house adds a home-type surcharge to the condo price.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <Button size="lg" className="text-lg px-8" asChild>
                <a href="#quote">GET INSTANT PRICE</a>
              </Button>
              <a href="tel:7809136565" className="flex items-center gap-2 text-lg font-semibold text-primary hover:text-primary/80 transition-colors">
                <Phone className="w-5 h-5" />
                (780) 913-6565
              </a>
            </div>
          </div>
        </section>

      <NearbyNeighbourhoods />

      <LocalMarketNote
        eyebrow="On the ground"
        heading="Built in one decade, kept ever since"
        paragraphs={[
          "Seventy-seven per cent of these houses went up in the 1960s and another fifth in the 1970s, so the whole neighbourhood reaches the same wear points at the same time. Kitchens and bathrooms of that vintage that have never been redone are the slow rooms: original tile grout that has gone porous, and tub surrounds where staining sits in the material rather than on it.",
          "Ninety-two per cent of it is detached, which means whole-home visits rather than suites — more floor area per stop, more separate rooms, more trim.",
        ]}
      />

      <LocationPricing />

        {/* Our work in Greenfield homes.
            The alt text describes what the picture shows and makes no claim about
            where it was taken: we have no photo of a Greenfield home. */}
        <section className="py-8 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              <img
                src={greenfieldCleanHome}
                alt="A family playing with toys on a wooden living-room floor"
                width={1024}
                height={1024}
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
              Residential Cleaning in Greenfield, Edmonton
            </h2>
            <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
              <p>
                Greenfield houses have been through decades of Edmonton winters, and the winter still sets the calendar. Sand and salt tracked in from November arrive dry and stay, working into carpet edges and along baseboards. Furnace season runs from October into April, and a house sealed up that long cycles dust faster; the spring melt then brings a whole winter of grit indoors in about three weeks.
              </p>
              <p>
                Every cleaner sent to a Greenfield house is reference-checked before a first job and rated by the customer after each visit, and those ratings decide who we keep sending. We book an arrival window rather than an exact time: 9:00 to 10:00 AM, 12:00 to 1:00 PM, or 3:00 to 4:00 PM.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                Getting In While You Are Out
              </h3>
              <p>
                You do not need to be home for a clean in Greenfield. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up on the way out. The team brings all supplies and equipment; running water is required, and vacuuming may not be possible without electricity.
              </p>
              <p>
                If the team arrives and cannot get in, the lockout charge is half the cost of the scheduled service, so check the code or the key the day before.
              </p>
              <p>
                Greenfield is inside Edmonton city limits, so no trip fee is added to a clean here.
              </p>

              <h3 className="text-2xl font-bold mt-8 mb-4 text-foreground">
                What You Can Expect
              </h3>
              <p>
                If we have to move a booking because a cleaner is ill, a vehicle will not start or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have. Nobody pays for a visit we did not do. To cancel or change a booking yourself, give 24 hours' notice; inside 24 hours the cancellation fee is {POLICY.cancellationFee}.
              </p>
              <p>
                There is no need to tidy before the team comes. Clear counters and floors get cleaned, cluttered ones get worked around, and decluttering or organising is a separate hourly add-on.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {/* The other 163 location pages route to the service pages through their
            card grid; these two have a bespoke layout and were the only ones
            left with no path into the services at all. */}
        <section className="py-10 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold mb-4 text-foreground">Cleaning services in Greenfield</h2>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li>
                <Link to="/edmonton/regular-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Standard cleaning in Greenfield
                </Link>
              </li>
              <li>
                <Link to="/edmonton/deep-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Deep cleaning in Greenfield
                </Link>
              </li>
              <li>
                <Link to="/move-out-cleaning-edmonton/" className="font-semibold text-primary hover:text-accent">
                  Move-out cleaning in Greenfield
                </Link>
              </li>
              <li>
                <Link to="/post-construction-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Post-construction cleaning in Greenfield
                </Link>
              </li>
              <li>
                <Link to="/wall-washing-wall-cleaning/" className="font-semibold text-primary hover:text-accent">
                  Wall washing in Greenfield
                </Link>
              </li>
            </ul>
            <p className="mt-6 text-muted-foreground">
              {"Greenfield is one of the Edmonton neighbourhoods we clean — see "}
              <Link to="/" className="text-primary underline underline-offset-2">
                house cleaning services in Edmonton
              </Link>
              {" for the full picture."}
            </p>
          </div>
        </section>

        <section className="py-16 px-4 bg-primary/5">
          <div className="container mx-auto max-w-4xl text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Get an instant price for your Greenfield home
            </h3>
            <Button size="lg" className="mb-8" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
            <div className="space-y-4">
              <p className="text-lg font-semibold text-foreground">Cleaning homes in Alberta since 2017</p>
              <p className="text-muted-foreground">
                <strong>24-hour re-clean guarantee.</strong><br />
                Tell us within 24 hours if something was missed and we come back to re-clean it at no charge. The commitment is the return visit.
              </p>
              <Button variant="link" asChild>
                <Link to="/satisfaction-guarantee/">How the re-clean guarantee works</Link>
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
              See the flat rate for your Greenfield house before you book. Nothing is charged at booking; the card is charged once the clean is complete.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              To talk it through first, call the Edmonton office at (780) 913-6565, Monday to Saturday 8:00 AM to 8:00 PM or Sunday 9:00 AM to 3:00 PM.
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
}
