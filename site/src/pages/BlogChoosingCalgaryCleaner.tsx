import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Calendar, Clock, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { COMPANY, CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { flatRateFromPrice, formatPrice } from "@/data/pricing";

import { modifiedFor } from "@/data/post-dates";
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
    good: "You see a price for your specific home before you commit to anything, with no \"we'll assess on arrival\" surprise.",
    bad: "Vague hourly estimates with no upper bound, or pricing that only appears after a phone call.",
  },
  {
    title: "Screened cleaners, rated after each visit",
    good: "The company can tell you how cleaners are screened before a first job, and how customers rate them after each visit.",
    // Was "No mention of background checks" — which flagged this company,
    // since policy.ts records reference checks, not background checks.
    bad: "No answer on how cleaners are screened, or a different unnamed contractor every time.",
  },
  {
    title: "A clear written scope",
    good: "A checklist of what each service includes, so there is no ambiguity about what a \"standard clean\" covers.",
    bad: "Marketing copy about being \"thorough\" with no list of tasks.",
  },
  {
    title: "A guarantee with a process behind it",
    good: "A specific window, such as 24 hours, to report anything missed, and a return visit to re-clean it at no charge.",
    bad: "A satisfaction slogan with no deadline, no remedy and no process for what happens if you are not satisfied.",
  },
];

const FAQS = [
  {
    q: "What should I look for when choosing a cleaning service in Calgary?",
    a: "Look for four things in a Calgary cleaning company: a flat price quoted before you book, a clear answer on how cleaners are screened and rated, a written list of what each service includes, and a guarantee with a deadline and a remedy.",
  },
  {
    q: "How much does a house cleaning cost in Calgary?",
    a: `At Duty Cleaners, a standard clean of a one-bedroom, one-bathroom apartment or condo in Calgary is ${formatPrice(flatRateFromPrice())} before 5% GST. More bedrooms or bathrooms, a house or townhouse rather than a condo, add-ons and the compulsory charge for homes with pets all raise the price. There is no trip fee inside Calgary city limits, a travel fee applies outside them, and the Calgary price list shows every tier by home size.`,
  },
  {
    q: "Do Calgary cleaning companies bring their own supplies?",
    a: "Duty Cleaners teams in Calgary bring all supplies and equipment, so there is nothing to buy or leave out before a clean. The home needs running water, and vacuuming may not be possible without electricity. Eco-friendly products are a paid add-on: ask when you book and the office adds it.",
  },
  {
    q: "Is a cleaning service worth it for a Calgary condo versus a house?",
    a: "At Duty Cleaners the price list is set for an apartment or condo by bedrooms and bathrooms, and a bungalow, townhouse or two-storey house of the same size adds a home-type surcharge. A Calgary condo therefore costs less per visit than a house with the same rooms. Apartments and condos in the Beltline, Mission, Eau Claire and the downtown towers are also among the simplest jobs in the city. Recurring plans lower the price of each visit again from the second visit, for either kind of home.",
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
    "A practical buyer's guide to hiring a house cleaning service in Calgary: what separates a reliable company from a risky one, and what to check first.";

  return (
    <>
      <Helmet>
        <title>{`${title} | Duty Cleaners`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title} | Duty Cleaners`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title} | Duty Cleaners`} />
        <meta name="twitter:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          image: "https://dutycleaners.ca/og-image.jpg",
          ...(publishedFor("/blog/cleaning-services-calgary") ? { datePublished: publishedFor("/blog/cleaning-services-calgary") } : {}),
          dateModified: modifiedOr("/blog/cleaning-services-calgary"),
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
            <Button variant="ghost" className="mb-6" asChild>
              <Link to="/blog/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
            </Button>

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
                book <Link to="/cleaning-services-calgary/" className="text-primary underline underline-offset-2 font-medium">house cleaning services in Calgary</Link>.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  width={1600}
                  height={900}
                  src={heroImage}
                  alt="The Calgary skyline"
                  className="w-full h-full object-cover"
                 loading="eager" fetchPriority="high"/>
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
                  it. Most of the bad experiences people report, such as no-shows, surprise charges
                  and uneven quality, trace back to the same handful of gaps in how a company
                  operates. None of them are hard to check for before you book.
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
                    width={1536}
                    height={1024}
                    src={teamImage}
                    alt="Two cleaners mopping a floor and spraying a window in a bright living room"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  How we handle it
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  Duty Cleaners has cleaned homes in Alberta {COMPANY.sinceLabel}, and the Calgary
                  branch is rated {RATING_CLAIM} across {CITY_PROOF.calgary.googleReviewCount} reviews.
                  The price is flat by home size and shown before you book, and every cleaner is
                  reference-checked before a first job and rated by the customer after each visit.
                  If something was missed, tell us within 24 hours and we come back and re-clean it
                  at no charge. Photos help but are not required.
                </p>
              </div>

              {/*
                At 566 words this was the thinnest article on the site against
                867-1,481 for the rest, and it is the destination of two
                preserved legacy URLs — so it earns its traffic on hiring
                intent and had almost nothing to say once someone arrived. The
                two sections below answer what a reader at that moment actually
                still has to decide.
              */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  Questions worth asking before you book
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Most of what separates companies does not show up on a website, and the
                  answers are quick to collect on the phone. Ask what happens if the clean takes
                  longer than expected. A flat rate should not move, and if the answer is vague
                  you are being quoted an estimate rather than a price. Ask who will come, and
                  whether a recurring booking keeps your regular team where the company can send
                  them. A team that already knows a home needs fewer instructions.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ask what is <em>not</em> included, and be wary of a company that says
                  everything is. Duty Cleaners, for example, does not lift anything over 25 lb,
                  clean exterior windows, handle bodily fluids or litter boxes, or work beyond a
                  three-step ladder. A firm that will not name its exclusions up front is one you
                  are likely to disagree with later. Ask how payment works, too. Paying in full
                  before any work happens leaves you little to stand on if something goes wrong.
                  Duty Cleaners charges nothing at booking: a temporary hold the day before
                  confirms the card is valid, and the card is charged once the clean is complete.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Finally, ask about the guarantee in specifics. A promise of total satisfaction
                  means nothing on its own. What is the deadline for reporting a problem, what is
                  the remedy, and does claiming it require photographs? A company that can answer
                  those three questions immediately has a process; one that cannot has a
                  marketing line.
                </p>
              </div>

              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                  What is specific to Calgary
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Two local things change what you should book. The first is the chinook cycle.
                  Calgary thaws and refreezes on chinooks all winter, so sand and de-icer arrive at
                  the door again and again from November to April and settle along baseboards and
                  carpet edges. By late winter a home can need{" "}
                  <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-2 font-medium">deep cleaning in Calgary</Link>{" "}
                  rather than a standard visit, and a company that books a standard clean without
                  asking about the season is not paying attention.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The second is the housing split. Apartments and condos in the Beltline, Mission,
                  Eau Claire and the downtown towers are the simplest jobs. Houses in newer suburbs
                  such as Mahogany, Seton and Livingston carry construction dust, and Calgary's dry
                  air and wind keep fine grit airborne for most of the year. A quote that asks only
                  about bedrooms misses the home type, which is why the Duty Cleaners price list
                  adds a set surcharge for a bungalow, a basement suite, a townhouse or a
                  two-storey house.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  One thing that should <em>not</em> vary locally is the price. Duty Cleaners
                  charges one flat price list with no city premium, and there is no trip fee inside
                  Calgary city limits; outside them a travel fee applies. Every published figure is
                  before 5% GST. If a company quotes a Calgary surcharge, ask what it covers.
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
                  <div
                    className="relative p-5 border border-border rounded-xl bg-card transition-colors hover:border-accent"
                  >
                    <h3 className="font-bold text-foreground">
                      <Link
                        to="/how-much-does-a-house-cleaning-cost/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        How Much Does a House Cleaning Cost?
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      What professional cleaning costs in Alberta, and what changes the number.
                    </p>
                  </div>
                  <div
                    className="relative p-5 border border-border rounded-xl bg-card transition-colors hover:border-accent"
                  >
                    <h3 className="font-bold text-foreground">
                      <Link
                        to="/calgary/pricing/"
                        className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                      >
                        Calgary Pricing
                      </Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      See current rates by home size for Calgary service.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  See exactly what your clean would cost
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  See a flat price for your Calgary home online before you book. Nothing is charged at
                  booking, and the card is charged once the clean is complete. To talk it through,
                  call the Calgary office at{" "}
                  <a href="tel:4037681341" className="text-primary underline underline-offset-2 font-medium">(403) 768-1341</a>.
                </p>
                <Button size="lg" variant="accent" className="w-full sm:w-auto min-h-[52px] text-base font-bold" asChild>
                  <Link to="/cleaning-services-calgary/#quote">
                    See My Instant Price — Calgary
                  </Link>
                </Button>
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
