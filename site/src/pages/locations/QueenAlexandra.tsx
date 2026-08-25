import { lazy, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import { buildLocationSchema } from "@/lib/location-schema";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";
import HonestReviewLink from "@/components/HonestReviewLink";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import strathconaCleanHome from "@/assets/gallery/old-strathcona-cleaner-home.jpg";

const LocationMap = lazy(() => import("@/components/LocationMap"));

const QueenAlexandra = () => {
  const faqs = [
    {
      question: "How long does an initial cleaning take?",
      answer: `We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.`
    },
    {
      question: "What cleaning services does Duty Cleaners offer in Queen Alexandra?",
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
        <title>Queen Alexandra House Cleaning Professionals | Duty Cleaners Edmonton</title>
        <meta name="description" content="Reliable home cleaning in Queen Alexandra, Edmonton. Professional service near Queen Alexandra School, Tipton Park, and Whyte Avenue." />
        <link rel="canonical" href="https://dutycleaners.ca/locations/queen-alexandra-edmonton/" />
        <script type="application/ld+json">{JSON.stringify(buildLocationSchema({ name: "Duty Cleaners - Queen Alexandra Edmonton", city: "edmonton", url: "https://dutycleaners.ca/locations/queen-alexandra-edmonton", areaServed: "Queen Alexandra, Edmonton, AB" }))}</script>
      </Helmet>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>

        {/* Hero Section */}
        <section className="pt-24 pb-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
                Queen Alexandra House Cleaning Professionals
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Reliable home cleaning in Queen Alexandra, Edmonton. We offer friendly, professional service with a local touch.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" asChild>
                  <a href="/contact-us">GET INSTANT PRICE</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="tel:780-913-6565">
                    <Phone className="mr-2 h-5 w-5" />
                    780-913-6565
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Our work in the Queen Alexandra / Old Strathcona area. Queen Alexandra
            sits immediately south of Whyte Avenue, so this Old Strathcona photo is
            genuinely from the same few blocks — the alt text says what it shows
            rather than over-claiming. */}
        <section className="py-8 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="rounded-lg overflow-hidden shadow-lg border border-border">
              <img
                src={strathconaCleanHome}
                alt="A Duty Cleaners cleaner finishing a home in the Old Strathcona area, just north of Queen Alexandra"
                width={1200}
                height={800}
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
            <h2 className="text-3xl font-bold">Residential Cleaning in Queen Alexandra</h2>
            <p>
              Queen Alexandra is one of those rare neighbourhoods that feels truly lived in—where the houses have history, the yards are full of personality, and the sidewalks are busy with families, students, and long-time locals alike. At Duty Cleaners, we're proud to be part of the rhythm here, offering dependable, friendly home cleaning that fits right into Queen Alexandra's laid-back yet lively atmosphere.
            </p>
            <p>
              We're a local team—not a corporate outfit—which means we value familiarity, reliability, and real relationships. Whether you're in a heritage home near 105 Street, tucked behind Queen Alexandra School, or close to the buzz of Whyte Avenue, you'll get personal service from a team that already knows the area.
            </p>

            <h3 className="text-3xl font-bold">We're Right Around the Corner—and Easy to Count On</h3>
            <p>
              We don't just serve Queen Alexandra—we're often just a few streets over. That local presence means we're able to show up on time, adjust to your schedule, and get the job done without you having to follow up or micromanage.
            </p>
            <p>
              Clients here appreciate our consistency. You'll see the same faces, get straightforward communication, and know your home is being cared for with real attention to detail—not a one-size-fits-all routine. We respect your space, your time, and the trust you place in us.
            </p>

            <h3 className="text-3xl font-bold">A Neighbourhood with Character—and We Treat It That Way</h3>
            <p>
              Queen Alexandra has a bit of everything: tree-lined avenues, charming walk-ups, updated duplexes, and growing families all sharing space with university students and longtime residents. From early-morning walks in Tipton Park to quick stops near the Strathcona Farmers' Market, we work in the community daily—and that matters.
            </p>
            <p>
              We understand what it means to care for homes with history, personality, and quirks. Whether you're just a block from Queen Alexandra Park or in a tucked-away corner near 104 Street, our service is shaped by what works best for you and your space.
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
            <h2 className="text-3xl md:text-4xl font-bold">Get an instant quote, without all the hassle.</h2>
            <Button size="lg" asChild>
              <a href="/contact-us">GET A FREE ESTIMATE</a>
            </Button>
            <div className="pt-8">
              <p className="text-sm text-muted-foreground mb-2">Serving Alberta homes</p>
              <p className="text-2xl font-bold">SINCE 2017</p>
              <p className="text-lg font-semibold mt-4">100% Satisfaction Guarantee.</p>
              <p className="text-muted-foreground">
                We stand behind the quality of our staff. If you're not 100% satisfied with your cleaning, we'll come back and re-clean it at no additional charge, as long as we’re informed within 24 hours after the cleaning.
              </p>
            </div>
          </div>
        </section>

        <HonestReviewLink city="Edmonton" area="Queen Alexandra" />

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

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Here When You Need Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Home should be a place to unwind—not one more thing on your checklist. If you're looking for a team that treats your home with care, respects your time, and blends right into your routine, we'd love to help.
            </p>
            <p className="text-muted-foreground">
              Give us a call or request a free quote today. We're right here in the neighbourhood—and ready when you are.
            </p>
            <Button size="lg" asChild>
              <a href="/contact-us">GET A FREE ESTIMATE</a>
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
