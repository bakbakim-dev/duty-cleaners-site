import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { HOMES_CLEANED, COMPANY } from "@/data/proof";

import heroImage from "@/assets/hero-calgary-skyline.webp";
import teamImage from "@/assets/calgary-cleaning-team.webp";

/**
 * Replaces the old WordPress post "/10042/cleaning-services-calgary-
 * transform-your-space/" — 1,230 impressions over 16 months, currently
 * redirected to the plain /cleaning-services-calgary location page. The
 * original post was thin, keyword-stuffed SEO filler (a broken merged table,
 * generic "maid service" copy with no Calgary specifics) — not something
 * worth reproducing. This is a genuine buyer's guide written for the same
 * search intent, using only real facts already established in proof.ts.
 */

const WHAT_TO_CHECK = [
  {
    title: "Flat pricing, quoted before booking",
    good: "You see a price for your specific home before you commit to anything — no \"we'll assess on arrival\" surprises.",
    bad: "Vague hourly estimates with no upper bound, or pricing that only appears after a phone call.",
  },
  {
    title: "Vetted, consistent cleaners",
    good: "The company screens who they send into your home, and you can request the same cleaner for recurring visits.",
    bad: "No mention of background checks, or a different unnamed contractor every time.",
  },
  {
    title: "A clear written scope",
    good: "A checklist of exactly what's included in each service tier, so there's no ambiguity about what \"standard clean\" actually covers.",
    bad: "Marketing copy about being \"thorough\" with no actual list of tasks.",
  },
  {
    title: "A real satisfaction guarantee",
    good: "A specific window (e.g. 24 hours) to flag anything missed, with a free return visit — not just a slogan.",
    bad: "\"100% satisfaction guaranteed!\" with no process for what happens if you're not satisfied.",
  },
];

const FAQS = [
  {
    q: "What should I look for when choosing a cleaning service in Calgary?",
    a: "Four things: flat pricing quoted before you book, vetted and consistent cleaners, a written scope of exactly what's included, and a real satisfaction guarantee with a defined process — not just a slogan.",
  },
  {
    q: "How much does a house cleaning cost in Calgary?",
    a: "It depends mainly on home size and service type (standard, deep, or move-out). See our full Calgary pricing breakdown for current rates by home size.",
  },
  {
    q: "Do Calgary cleaning companies bring their own supplies?",
    a: "Reputable ones do — you shouldn't need to provide anything. Ask specifically whether products are pet- and child-safe if that matters to your household.",
  },
  {
    q: "Is a cleaning service worth it for a Calgary condo versus a house?",
    a: "Condos generally cost less to clean since there's less square footage, which makes recurring service more affordable per visit. The core value — getting hours back every week — applies the same either way.",
  },
];

export default function BlogChoosingCalgaryCleaner() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonical = "https://dutycleaners.ca/blog/cleaning-services-calgary/";
  // Retitled from "Cleaning Services Calgary: What to Look For Before You Book" —
  // the exact-match front-load competed with the money page for its own head
  // term. The slug is a preserved legacy URL and deliberately unchanged.
  const title = "How to Choose a Cleaning Company in Calgary";
  const description =
    "A practical buyer's guide to hiring a house cleaning service in Calgary — what separates a reliable company from a risky one, and what to check before you book.";

  return (
    <>
      <Helmet>
        <title>{`${title} | Duty Cleaners`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} | Duty Cleaners`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: "https://dutycleaners.ca/og-image.jpg",
          datePublished: "2026-08-24",
          dateModified: "2026-08-24",
          author: { "@type": "Organization", name: "Duty Cleaners", url: "https://dutycleaners.ca/" },
          publisher: {
            "@type": "Organization",
            name: "Duty Cleaners",
            logo: { "@type": "ImageObject", url: "https://dutycleaners.ca/logo.png" },
          },
          mainEntityOfPage: canonical,
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQS.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        })}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation city="calgary" />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero */}
        <section className="relative pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Link to="/blog">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                  Hiring Guide
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  August 24, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  7 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                How to Choose a Cleaning Company in Calgary
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                Calgary has no shortage of cleaning companies. The difference between a good one and a
                risky one usually shows up in four specific places — here's what to check before you
                book <Link to="/cleaning-services-calgary/" className="text-primary hover:underline font-medium">house cleaning services in Calgary</Link>.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  width={1920}
                  height={1080}
                  src={heroImage}
                  alt="Calgary skyline, home to Duty Cleaners' Calgary cleaning team"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Hiring a cleaning service should save you time and stress, not add a new source of
                  it. Most of the bad experiences people report — no-shows, surprise charges, uneven
                  quality — trace back to the same handful of gaps in how a company operates. None of
                  them are hard to check for before you book.
                </p>
              </div>

              {/* What to check */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
                  Four things that separate a reliable company from a risky one
                </h2>
                <div className="space-y-6">
                  {WHAT_TO_CHECK.map((item) => (
                    <div key={item.title} className="border-t border-border pt-6">
                      <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="flex gap-3 p-4 bg-primary/10 rounded-lg border border-primary/20">
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <p className="text-muted-foreground text-sm">{item.good}</p>
                        </div>
                        <div className="flex gap-3 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                          <p className="text-muted-foreground text-sm">{item.bad}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Local team */}
              <div className="mb-16">
                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img
                    width={1024}
                    height={576}
                    src={teamImage}
                    alt="Duty Cleaners' Calgary cleaning team"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  How we handle it
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Duty Cleaners has been operating {COMPANY.sinceLabel}, with {HOMES_CLEANED.calgary} Calgary
                  homes cleaned. Pricing is quoted up front based on your home's size, every cleaner is
                  reference-checked before their first job, and if something's missed, tell us within
                  24 hours and we'll come back and make it right at no additional charge — no fine
                  print attached to that.
                </p>
              </div>

              {/* FAQ */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Common questions
                </h2>
                <div className="space-y-4">
                  {FAQS.map((f) => (
                    <div key={f.q} className="border border-border rounded-xl p-5 bg-card">
                      <h3 className="font-bold text-foreground mb-2">{f.q}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{f.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">Keep reading</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    to="/how-much-does-a-house-cleaning-cost"
                    className="block p-5 border border-border rounded-xl bg-card hover:border-accent transition-colors"
                  >
                    <h3 className="font-bold text-foreground">How Much Does a House Cleaning Cost?</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      What professional cleaning costs in Alberta, and what changes the number.
                    </p>
                  </Link>
                  <Link
                    to="/calgary/pricing"
                    className="block p-5 border border-border rounded-xl bg-card hover:border-accent transition-colors"
                  >
                    <h3 className="font-bold text-foreground">Calgary Pricing</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      See current rates by home size for Calgary service.
                    </p>
                  </Link>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  See exactly what your clean would cost
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  No phone call required — get a flat price for your Calgary home in about 60 seconds,
                  and pay only after the clean is done.
                </p>
                <Link to="/cleaning-services-calgary#quote">
                  <Button size="lg" variant="accent" className="w-full sm:w-auto min-h-[52px] text-base font-bold">
                    See My Instant Price — Calgary
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
