import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import { standardTierRows, deepCleanTierRows, moveInOutTierRows, FREQUENCIES } from "@/data/pricing";
import { POLICY } from "@/data/policy";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { modifiedFor } from "@/data/post-dates";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, DollarSign, Home, Users, Sparkles, Clock3, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/house-cleaning-cost-hero.webp";
import apartmentImage from "@/assets/blog/apartment-cleaning.webp";
import suppliesImage from "@/assets/blog/cleaning-supplies-cost.webp";
import deepCleanImage from "@/assets/blog/deep-cleaning-kitchen.webp";

const cleaningTypes = [
  {
    title: "General Cleanings",
    description: "Involves sanitizing and tidying up surfaces like countertops, cabinets, and appliances. For a 3-bedroom, 2,000 sq ft home: $150-$250. For larger homes (3,000-3,500 sq ft): $350-$500.",
    priceRange: "$150 - $500"
  },
  {
    title: "Deep Cleanings",
    description: "Intensive cleaning of all surfaces with special attention to hard-to-reach areas like interior of appliances and cabinets. Takes longer to complete.",
    // Floor was $200, which put it above this page's own "$170-$200 for a
    // small 1-bedroom deep clean" two sections down.
    priceRange: "$170 - $400"
  },
  {
    title: "Move-in/Move-out Cleanings",
    description: "More thorough than general cleanings. Includes washing walls and windows, scrubbing hard surfaces. For homes 600-2,400 sq ft.",
    priceRange: "$130 - $500"
  },
  {
    title: "Post-Construction Cleanings",
    description: "For post-renovation or post-construction cleaning. Includes removing dust and debris from all surfaces. Charged per square foot.",
    priceRange: "$0.10 - $0.50/sq ft"
  }
];

/** Straight from BookingKoala, so the article cannot quote a stale discount. */
const FREQUENCY_DISCOUNTS = FREQUENCIES.filter((frequency) => frequency.discount > 0)
  .sort((a, b) => b.discount - a.discount)
  .map((frequency) => `${Math.round(frequency.discount * 100)}% ${frequency.label.toLowerCase()}`)
  .join(", ");

const pricingFactors = [
  {
    icon: Home,
    title: "Size of House",
    description: "Companies typically charge by square footage. A 2-bedroom apartment (800 sq ft) may cost ~$180 for deep cleaning, while a 4-bedroom home (2,000 sq ft) can cost $350+."
  },
  {
    icon: Users,
    title: "Number of Bedrooms & Bathrooms",
    description: "More rooms and bathrooms = more time-consuming to clean, resulting in higher rates."
  },
  {
    icon: Clock3,
    title: "Frequency of Service",
    description: `More frequent service means a lower price per visit, because a home cleaned often is faster to clean each time. Ours are discounted from the second visit on: ${FREQUENCY_DISCOUNTS}.`
  },
  {
    icon: MapPin,
    title: "Your Location",
    description: "Travel charges may apply for areas outside the company's city or far from their office."
  },
  {
    icon: Package,
    title: "Products & Supplies",
    description: "Companies that provide their own supplies may charge more. Larger companies with more resources typically include this in their pricing."
  },
  {
    icon: Sparkles,
    title: "Additional Services",
    description: "Extras like carpet cleaning, window cleaning, laundry, or dishes will increase the total cost."
  }
];


/** Derived from bk-config so this page cannot quote a stale figure. */
const span = (rows: { price: string }[]) => `${rows[0].price} to ${rows[rows.length - 1].price}`;
const COST_SPANS = {
  standard: span(standardTierRows()),
  deep: span(deepCleanTierRows()),
  moveInOut: span(moveInOutTierRows()),
};

export default function BlogHouseCleaningCost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>How Much Does House Cleaning Cost? | Duty Cleaners</title>
        <meta
          name="description"
          content="Discover house cleaning costs in Canada. Learn about hourly rates, flat rates, and factors affecting professional cleaning service prices in Alberta."
        />
        <link rel="canonical" href="https://dutycleaners.ca/how-much-does-a-house-cleaning-cost/" />
        <meta property="og:title" content="How Much Does House Cleaning Cost? | Duty Cleaners" />
        <meta property="og:description" content="Discover house cleaning costs in Canada. Learn about hourly rates, flat rates, and factors affecting professional cleaning service prices in Alberta." />
        <meta name="twitter:card" content="summary_large_image" />
        {/* This post's own hero, so a share card shows the article rather
            than the generic site image. */}
        <meta property="og:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:title" content="How Much Does House Cleaning Cost? | Duty Cleaners" />
        <meta name="twitter:description" content="Discover house cleaning costs in Canada. Learn about hourly rates, flat rates, and factors affecting professional cleaning service prices in Alberta." />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/how-much-does-a-house-cleaning-cost/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How Much Does House Cleaning Cost? Complete Pricing Guide",
          "description": "Discover house cleaning costs in Canada. Learn about hourly rates, flat rates, and factors affecting professional cleaning service prices in Alberta.",
          "image": absoluteAssetUrl(heroImage),
          ...(publishedFor("/how-much-does-a-house-cleaning-cost") ? { datePublished: publishedFor("/how-much-does-a-house-cleaning-cost") } : {}),
          "dateModified": modifiedOr("/how-much-does-a-house-cleaning-cost"),
          "author": ARTICLE_AUTHOR,
          "publisher": ARTICLE_PUBLISHER,
          "mainEntityOfPage": canonicalUrlForPath("/how-much-does-a-house-cleaning-cost")
})}</script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />
        <main id="main-content" tabIndex={-1}>
        <div className="container mx-auto px-4 pt-4">
          <Breadcrumbs />
        </div>

        {/* Hero Section */}
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
                  Pricing Guide
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  January 25, 2026
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  12 min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                How Much Does a House Cleaning Cost?
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8">
                Understand the factors that affect professional house cleaning prices and what you can expect to pay for different types of cleaning services.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1920} height={1080}
                  src={heroImage}
                  alt="Professional house cleaner with cleaning supplies and pricing checklist"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {/*
                    Un-edited WordPress-era intro. "Running errands also steal"
                    was a subject-verb disagreement sitting in the first
                    paragraph of the site's highest-intent article — the one
                    people land on while deciding whether to hire anyone at all.
                  */}
                  Cleaning is the job that loses. Work, children and errands all have deadlines attached; the kitchen floor does not, so it waits — and by the time it stops waiting, it is a bigger job than it was. That is the calculation most people are actually making when they start pricing a cleaner: not whether the house needs it, but whether the hours are worth buying back.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  But how much do these services cost? Unfortunately, there is no one simple answer to this question. There are numerous factors that go into how much a cleaner or professional cleaning company will charge for their services. Every home is different, so they will have different needs.
                </p>
              </div>

              {/* This article publishes roughly 30 dollar figures and originally
                  carried no currency marker and no statement of where they came
                  from — on a page whose own meta description says Canada. Readers
                  had no way to tell market ranges apart from this company's actual
                  prices, and the two are not the same thing. */}
              {/* This page is the most likely of any on the site to be pulled for
                  the highest-volume cost query, and its only extractable numbers
                  were generic Canadian market ranges in styled cards. Duty
                  Cleaners' own prices appeared nowhere on it, so a passage-level
                  extractor would attribute someone else's ranges to this domain.
                  Own figures first, market context after. All derived. */}
              <div className="mb-10 p-6 bg-primary/5 rounded-xl border-2 border-primary/20">
                <h2 className="text-xl font-bold text-foreground mb-3">What Duty Cleaners charges</h2>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  In Edmonton and Calgary a standard clean is {COST_SPANS.standard} depending on the size
                  of the home, a deep clean {COST_SPANS.deep}, and a move-in or move-out clean{" "}
                  {COST_SPANS.moveInOut}. Those are flat rates in Canadian dollars before 5% GST, and
                  they do not change because a clean ran long.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  See <a href="/pricing/" className="text-primary underline">Edmonton pricing</a> or{" "}
                  <a href="/calgary/pricing/" className="text-primary underline">Calgary pricing</a> for
                  the full table by bedroom count, including add-ons.
                </p>
              </div>

              <div className="mb-12 p-6 bg-muted/40 rounded-xl border-l-4 border-primary">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">About the figures in this guide.</strong>{" "}
                  Every price below is in Canadian dollars. They are typical market ranges for
                  professional cleaning across Canadian cities, gathered from publicly advertised
                  rates — not a statistical survey, and not a quote. What any given company charges
                  depends on your home, its condition and where you live.
                </p>
              </div>

              {/* Types of Cleaners */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Types of House Cleaners and Their Cost
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-muted/30 rounded-xl border">
                    <h3 className="font-bold text-foreground mb-3 text-lg">🧹 Independent Cleaner</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      The cost of an independent cleaner will depend on their rate and the type of cleaning you require. An independent cleaner who just started out may offer lower rates, while an established house cleaner may charge more.
                    </p>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-primary font-semibold text-center">$50 - $90 for 2 hours</p>
                    </div>
                  </div>
                  <div className="p-6 bg-muted/30 rounded-xl border">
                    <h4 className="font-bold text-foreground mb-3 text-lg">🏢 Professional Cleaning Company</h4>
                    <p className="text-muted-foreground text-sm mb-4">
                      Pricing for professional companies is typically more standardized. They don't usually charge by the hour but by square footage. You can always expect to pay around the same amount for basic cleaning.
                    </p>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-primary font-semibold text-center">Discounts for recurring services</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Types of Charges */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Types of Cleaning Charges
                </h2>

                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img width={1024} height={1024}
                    src={apartmentImage}
                    alt="Clean modern apartment living room"
                    className="w-full h-full object-cover"
                  />
                </div>

                <p className="text-muted-foreground mb-6">
                  There are two types of charges for home cleaning services: the <strong>hourly rate</strong> and the <strong>flat rate</strong>. What you pay depends far more on the size and state of the home than on which company you call — the ranges below cover most Canadian cities.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock3 className="h-5 w-5 text-secondary-foreground" />
                      <h3 className="font-bold text-foreground">Hourly Rate</h3>
                    </div>
                    <ul className="text-muted-foreground text-sm space-y-2">
                      <li>• 2-bedroom apartment: <strong>$40-$65/hour</strong> per cleaner</li>
                      <li>• Larger homes with more rooms: <strong>$70-$80/hour</strong> per cleaner</li>
                      <li>• Professional companies usually have minimum hours (e.g., a 3-hour minimum, so $150–$195 for that 2-bedroom)</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-accent/10 rounded-xl border border-accent/20">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-accent-foreground" />
                      <h3 className="font-bold text-foreground">Flat Rate</h3>
                    </div>
                    <ul className="text-muted-foreground text-sm space-y-2">
                      <li>• Based on the size of your home</li>
                      <li>• Small 1-bedroom apartment: <strong>$170-$200</strong> for deep cleaning</li>
                      <li>• Larger 4-bedroom house: <strong>$400+</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Pricing Factors */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Factors That Affect House Cleaning Cost
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pricingFactors.map((factor, index) => (
                    <div key={index} className="p-5 bg-muted/30 rounded-xl border">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                        <factor.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{factor.title}</h3>
                      <p className="text-muted-foreground text-sm">{factor.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Types of Cleaning Services */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Types of Cleaning Services & Their Cost
                </h2>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={deepCleanImage}
                      alt="Professional cleaner deep cleaning kitchen appliances"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={suppliesImage}
                      alt="Professional cleaning supplies and equipment"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {cleaningTypes.map((type, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-muted/30 rounded-xl border">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{type.title}</h3>
                        <p className="text-muted-foreground text-sm">{type.description}</p>
                      </div>
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
                        {type.priceRange}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Considerations */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  Additional Considerations
                </h2>

                <div className="space-y-4">
                  <div className="p-5 bg-destructive/10 rounded-xl border border-destructive/20">
                    <h3 className="font-semibold text-foreground mb-2">⚠️ Late Cancellation Fees</h3>
                    <p className="text-muted-foreground text-sm">
                      Ask any company for two numbers before you book: what a late cancellation costs, and what happens if the cleaner arrives and cannot get in. Ours are {POLICY.cancellationFee} inside {POLICY.cancellationNoticeHours} hours, and {POLICY.lockoutFee} for a lockout.
                    </p>
                  </div>
                  
                  <div className="p-5 bg-muted/30 rounded-xl border">
                    <h3 className="font-semibold text-foreground mb-2">You should not need an estimate visit</h3>
                    <p className="text-muted-foreground text-sm">
                      A company that prices by home size can show you the number before you book. Ours takes about a minute to see, and it is the figure you pay, before 5% GST, whether the clean runs long or not. Treat &ldquo;we&rsquo;ll assess it on arrival&rdquo; as a reason to ask more questions, not a courtesy.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 text-center">
                <h3 className="text-2xl font-bold mb-4 text-foreground">
                  See My Instant Price Today
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Answer a few questions about your home and the price is on screen. Nothing is charged until the clean is done.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="accent" className="w-full sm:w-auto min-h-[52px] text-base font-bold" asChild>
                    <Link to="/#quote">
                      See My Instant Price — Edmonton
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto min-h-[52px] text-base font-semibold" asChild>
                    <Link to="/cleaning-services-calgary/#quote">
                      See My Instant Price — Calgary
                    </Link>
                  </Button>
                </div>
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
