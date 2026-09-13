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
import heroImage from "@/assets/hero-room-calgary-960w.webp";
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



const FAQS = [
  {
    q: "What should I confirm before a Calgary condo cleaning?",
    a: "Ask your building about entry, visitor registration, parking and any elevator booking. Give the Calgary office the agreed access instructions and describe the home accurately for the quote. Building requirements vary; confirm them before the visit.",
  },
  {
    q: "How much does a house cleaning cost in Calgary?",
    a: `At Duty Cleaners, a standard clean of a one-bedroom, one-bathroom apartment or condo in Calgary is ${formatPrice(flatRateFromPrice())} before 5% GST. More bedrooms or bathrooms, a house or townhouse rather than a condo, add-ons and the compulsory charge for homes with pets all raise the price. There is no trip fee inside Calgary city limits, a travel fee applies outside them, and the Calgary price list shows every tier by home size.`,
  },
  {
    q: "Do Calgary cleaning companies bring their own supplies?",
    a: "Duty Cleaners teams in Calgary bring all supplies and equipment, so there is nothing to buy or leave out before a clean. The home needs running water, and vacuuming may not be possible without electricity. Optional alternative products are a paid add-on: ask the office which products are available and suitable for your surfaces when you book.",
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
  const title = "Hiring a Calgary Cleaner: Condo Access, Quotes & Coverage";
  const description =
    "Before hiring a Calgary cleaner, check building access, service coverage, quote details and branch reviews. Use this practical booking checklist.";

  return (
    <>
      <Helmet>
        <title>{`${title}`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={`${title}`} />
        <meta property="og:description" content={description} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${title}`} />
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
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">What to Check Before Hiring a Cleaner in Calgary</h1>

              <p className="text-xl text-muted-foreground mb-8">Before choosing a cleaner for your Calgary home, confirm access to your building, the service area, the home type and what the quote includes. Use these booking questions alongside our <Link to="/blog/choosing-cleaning-company/" className="text-primary underline">general guide to choosing a cleaning company</Link>.</p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img
                  width={1600}
                  height={900}
                  src={heroImage}
                  alt="Illustrative bright living room with a sofa, armchairs and clean floors"
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
                <div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">Check access with your condo building</h2><p className="text-muted-foreground mb-4">For a condo in <Link className="text-primary underline" to="/locations/beltline-calgary/">Beltline</Link>, <Link className="text-primary underline" to="/locations/mission/">Mission</Link> or <Link className="text-primary underline" to="/locations/eau-claire-calgary/">Eau Claire</Link>, ask your building whether cleaners need visitor registration, an elevator reservation or a particular entry point. These are questions to confirm with the building, not requirements shared by every Calgary condo.</p><p className="text-muted-foreground">Give the office the approved entry instructions and parking information before the visit. Do not put a private access code in a public review or photograph. If the building changes its arrangements, update the booking instructions.</p></div>
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
              <div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-4">Confirm the Calgary branch and service coverage</h2><p className="text-muted-foreground mb-4">Duty Cleaners' Calgary office is at {CITY_PROOF.calgary.address}. Call <a className="text-primary underline" href={CITY_PROOF.calgary.phoneLink}>{CITY_PROOF.calgary.phone}</a> to discuss an address or access arrangement. Read the Calgary branch's feedback on our <Link className="text-primary underline" to="/reviews/">reviews page</Link>; another branch's reviews are not a substitute.</p><p className="text-muted-foreground">There is no trip fee inside Calgary city limits. A booking in <Link className="text-primary underline" to="/cleaning-services-airdrie/">Airdrie</Link> or <Link className="text-primary underline" to="/cleaning-services-cochrane/">Cochrane</Link> carries a travel charge. Check the <Link className="text-primary underline" to="/calgary/pricing/">Calgary price list and regional fees</Link> and ask the office about an address not listed in our coverage.</p></div>

              <div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-4">Compare the quote for your actual home</h2><p className="text-muted-foreground mb-4">A condo and a two-storey house with the same bedroom count have different home-type pricing. Include bathrooms, pets and any appliance interiors you want cleaned. Describe renovation dust rather than assuming it is included in routine upkeep; compare <Link className="text-primary underline" to="/post-construction-cleaning-calgary/">post-construction cleaning in Calgary</Link> for a renovation job.</p><p className="text-muted-foreground mb-4">For an occupied home, compare the <Link className="text-primary underline" to="/calgary/regular-cleaning/">one-time standard checklist</Link> with <Link className="text-primary underline" to="/calgary/deep-cleaning/">Calgary deep cleaning</Link>. For an empty property handover, review <Link className="text-primary underline" to="/move-out-cleaning-calgary/">Calgary move-out cleaning</Link>, including the exclusions.</p><h3 className="text-xl font-bold mb-3">Before confirming the booking</h3><ul className="list-disc pl-5 text-muted-foreground space-y-2"><li>Confirm the service, property address and home type.</li><li>Check all required charges, add-ons and GST.</li><li>Arrange entry, building access and parking.</li><li>Read the <Link className="text-primary underline" to="/terms/">cancellation and access terms</Link>.</li><li>Choose the appropriate <Link className="text-primary underline" to="/cleaning-services-calgary/">Calgary house cleaning booking</Link>.</li></ul></div>

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
