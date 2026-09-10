import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import {
  standardTierRows,
  deepCleanTierRows,
  moveInOutTierRows,
  FREQUENCIES,
  HOURLY_RATE,
  formatPrice,
  addOnFromPrice,
  calculateQuote,
  homeTypeOptions,
  PRICING_TIERS,
} from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY } from "@/data/policy";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, DollarSign, Home, Users, Sparkles, Clock3, MapPin, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/house-cleaning-cost-hero.webp";
import apartmentImage from "@/assets/blog/apartment-cleaning.webp";
import suppliesImage from "@/assets/blog/cleaning-supplies-cost.webp";
import deepCleanImage from "@/assets/blog/deep-cleaning-kitchen.webp";

const POST_PATH = "/how-much-does-a-house-cleaning-cost";

/**
 * Market ranges for Canadian cities, gathered from publicly advertised rates.
 * These are the only hand-typed dollar figures on the page, and
 * published-prices.test.ts allows them because they describe the market, not
 * our price list. The same test checks each range still brackets our own
 * tiers end to end, so a market figure can never anchor a reader below what
 * the quote will ask.
 */
const cleaningTypes = [
  {
    title: "General Cleanings",
    description: "Surfaces, floors, kitchen and bathrooms, with appliance exteriors wiped. Most companies price it flat by bedroom and bathroom count; a few still quote by square footage.",
    priceRange: "$150 - $500"
  },
  {
    title: "Deep Cleanings",
    description: "A general clean plus the detail work: baseboards, doors, switches, vents and fan blades. The inside of the oven and fridge is usually an add-on rather than part of the package.",
    // Both ends bracket our own published deep range ($255-$485). A market
    // range that stops below what we charge anchors the reader low and then
    // surprises them at the quote, which is what "$170 - $400" did.
    priceRange: "$200 - $550"
  },
  {
    title: "Move-in/Move-out Cleanings",
    description: "Cleaned empty, to the standard an inspection looks for: the deep list plus the inside of the oven, fridge, cabinets, drawers and closets. Wall washing and interior windows are add-ons, at ours and at most companies.",
    // Ours run $284-$539, so the ceiling has to clear $539.
    priceRange: "$130 - $600"
  },
  {
    title: "Post-Construction Cleanings",
    description: "Dust from a renovation reaches every surface in the house, so this is priced by floor area rather than bedroom count.",
    priceRange: "$0.10 - $0.50/sq ft"
  }
];

/** Straight from BookingKoala, so the article cannot quote a stale discount. */
const RECURRING = FREQUENCIES.filter((frequency) => frequency.discount > 0).sort((a, b) => a.discount - b.discount);
const FREQUENCY_DISCOUNTS = [...RECURRING]
  .reverse()
  .map((frequency) => `${Math.round(frequency.discount * 100)}% ${frequency.label.toLowerCase()}`)
  .join(", ");

/** The largest recurring discount, so the Calgary answer can show what it does to a real price. */
const DEEPEST = RECURRING[RECURRING.length - 1];

const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const OVEN_FEE = formatPrice(addOnFromPrice("standard", "inside-oven") ?? 0);
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);
const HOURLY = formatPrice(HOURLY_RATE);

const pricingFactors = [
  {
    icon: Home,
    title: "Size of the home",
    description: "Most companies price by home size: bedrooms and bathrooms, or square footage. A 2-bedroom apartment (800 sq ft) may cost ~$325 for deep cleaning, while a 4-bedroom home (2,000 sq ft) can cost $400+."
  },
  {
    icon: Users,
    title: "Bedrooms and bathrooms",
    description: "Bathrooms are the slow rooms. Two homes with the same floor area can differ by a full price tier because one has three bathrooms and the other has one."
  },
  {
    icon: Clock3,
    title: "How often you book",
    description: `A home cleaned regularly is quicker to clean each time, so the per-visit price drops. Ours is discounted from the second visit on: ${FREQUENCY_DISCOUNTS}.`
  },
  {
    icon: MapPin,
    title: "Where the home is",
    description: `Addresses outside a company's city usually carry a travel charge. Ours is ${TRAVEL_FEE} per visit outside Edmonton or Calgary city limits, and nothing inside them.`
  },
  {
    icon: Package,
    title: "Pets and condition",
    description: `Hair, paw prints and nose marks add time in every room, so homes with pets are charged more; ours is ${PET_FEE} per visit. A home that has not been cleaned in months is a deep-clean job, not a standard one.`
  },
  {
    icon: Sparkles,
    title: "Add-ons",
    description: `Inside the oven (${OVEN_FEE} at ours), inside the fridge, inside cabinets, interior windows, blinds and wall washing are priced on top of the base clean, and each shows in the booking form before you commit.`
  }
];


/** Derived from bk-config so this page cannot quote a stale figure. */
const span = (rows: { price: string }[]) => `${rows[0].price} to ${rows[rows.length - 1].price}`;
const STANDARD = standardTierRows();
const DEEP = deepCleanTierRows();
const MOVE = moveInOutTierRows();
const COST_SPANS = {
  standard: span(STANDARD),
  deep: span(DEEP),
  moveInOut: span(MOVE),
};
const last = <T,>(rows: T[]) => rows[rows.length - 1];
const dollars = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
/**
 * Per-visit price of a standard clean once a recurring plan is running, from
 * the same quote maths the funnel uses (BookingKoala's formula), at the same
 * bath assumptions as the published tiers.
 */
const ongoingPrice = (tier: (typeof PRICING_TIERS)[number], frequency: string) => {
  const quote = calculateQuote({
    service: "standard",
    homeType: homeTypeOptions("standard")[0]?.id ?? null,
    bedrooms: tier.beds,
    bathrooms: tier.bathrooms,
    halfBaths: tier.halfBaths,
    addOns: [],
    frequency,
  });
  return `$${Math.round(quote.ongoing ?? quote.firstClean)}`;
};

/**
 * The six questions the guide answers, each with the paragraph that opens its
 * section. The same array feeds the FAQPage JSON-LD, so the markup can never
 * say something the page does not.
 */
const SECTIONS = [
  {
    id: "per-hour",
    h2: "How much does house cleaning cost per hour in Canada?",
    q: "How much does house cleaning cost per hour in Canada?",
    a: `Advertised hourly rates across Canadian cities run about $40 to $65 per hour per cleaner for a small home and $70 to $80 for a larger one, usually with a minimum booking. Duty Cleaners charges ${HOURLY} per cleaner per hour for hourly work, with a minimum of 3 hours for one cleaner or 2 hours for two, but most homes are priced flat by size instead, so the hourly figure only matters for partial jobs.`,
  },
  {
    id: "edmonton",
    h2: "Edmonton house cleaning prices by home size",
    q: "How much does house cleaning cost in Edmonton?",
    a: `In Edmonton a standard clean is ${STANDARD[0].price} for a 1-bedroom home and ${last(STANDARD).price} for five or more bedrooms, a deep clean ${COST_SPANS.deep}, and a move-out clean ${COST_SPANS.moveInOut}. All are flat rates before 5% GST, and the figure does not change if the clean runs long.`,
  },
  {
    id: "calgary",
    h2: "Calgary house cleaning prices by home size",
    q: "How much does house cleaning cost in Calgary?",
    a: `Calgary uses the same price list as Edmonton: ${COST_SPANS.standard} for a standard clean by bedroom count, before GST. Booked weekly, bi-weekly or every 4 weeks, the visit is discounted ${FREQUENCY_DISCOUNTS} from the second clean on. On a ${DEEPEST.label.toLowerCase()} plan that takes a 1-bedroom home from ${STANDARD[0].price} to ${ongoingPrice(PRICING_TIERS[0], DEEPEST.id)} a visit, and five or more bedrooms from ${last(STANDARD).price} to ${ongoingPrice(last(PRICING_TIERS), DEEPEST.id)}.`,
  },
  {
    id: "move-out",
    h2: "How much does a move-out clean cost?",
    q: "How much does a move-out clean cost?",
    a: `${MOVE[0].price} for a 1-bedroom home to ${last(MOVE).price} for five or more bedrooms, before GST. That includes the inside of the oven, fridge, cabinets, drawers and closets, which are add-ons on a standard clean. Outside Edmonton or Calgary city limits a ${TRAVEL_FEE} travel fee is added.`,
  },
  {
    id: "deep",
    h2: "How much does a deep clean cost?",
    q: "How much does a deep clean cost?",
    a: `${COST_SPANS.deep} before GST. It is a standard clean plus the deep package, which adds ${DEEP[0].packagePrice} on a 1-bedroom and ${last(DEEP).packagePrice} on a 5-bedroom home for baseboards, doors, switches, outlets, vent covers, fan blades, and a detailed stovetop and fridge top.`,
  },
  {
    id: "what-changes",
    h2: "What changes the price",
    q: "What changes the price of a house cleaning?",
    a: `Home size, the service, how often you book, add-ons, pets and the address. A home with pets is ${PET_FEE} more per visit, and an address outside city limits ${TRAVEL_FEE}. Condition matters too: if a home needs substantially more work than described, the team explains what they found and your options before continuing.`,
  },
] as const;

const TITLE = "How Much Does House Cleaning Cost? | Duty Cleaners";
const DESCRIPTION =
  "What house cleaning costs in Canada, with real Edmonton and Calgary prices by home size for standard, deep and move-out cleans, before GST.";

/** "2026-09-05" -> "September 5, 2026", without a timezone shifting the day. */
const readableDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[m - 1] && d ? `${months[m - 1]} ${d}, ${y}` : iso;
};

/**
 * Words in the article body at 220 words a minute. The page said "12 min
 * read" over roughly 1,250 words, which is a six-minute read. The count is
 * stated once here so the header cannot drift from the copy again; update it
 * when the prose changes materially.
 */
const WORD_COUNT = 1550;
const READ_MINUTES = Math.max(1, Math.round(WORD_COUNT / 220));

const TierTable = ({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: { beds: string; cells: string[] }[];
}) => (
  <div className="overflow-x-auto rounded-xl border border-border bg-white mb-6">
    <table className="w-full min-w-[420px] text-sm">
      <caption className="px-5 py-3 text-left text-sm text-muted-foreground">{caption}</caption>
      <thead>
        <tr className="bg-primary/10">
          <th scope="col" className="px-5 py-3 text-left font-semibold text-foreground">Home size</th>
          {columns.map((column) => (
            <th key={column} scope="col" className="px-5 py-3 text-right font-semibold text-foreground">{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.beds} className="border-t border-border/60">
            <th scope="row" className="px-5 py-3 text-left font-medium text-foreground">{row.beds}</th>
            {row.cells.map((cell, index) => (
              <td key={index} className="px-5 py-3 text-right text-foreground">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function BlogHouseCleaningCost() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const published = publishedFor(POST_PATH);
  const modified = modifiedOr(POST_PATH);
  const section = (id: (typeof SECTIONS)[number]["id"]) => SECTIONS.find((s) => s.id === id)!;

  return (
    <>
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/how-much-does-a-house-cleaning-cost/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta name="twitter:card" content="summary_large_image" />
        {/* This post's own hero, so a share card shows the article rather
            than the generic site image. */}
        <meta property="og:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:image" content={absoluteAssetUrl(heroImage)} />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content="https://dutycleaners.ca/how-much-does-a-house-cleaning-cost/" />
        {/* datePublished is emitted only when post-published.ts knows it. This
            post kept its WordPress URL and its real date is unknown, so the
            field is omitted rather than invented; dateModified comes from git
            through the post-dates generator. */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "How Much Does a House Cleaning Cost? Edmonton and Calgary Prices by Home Size",
          "description": DESCRIPTION,
          "image": absoluteAssetUrl(heroImage),
          ...(published ? { datePublished: published } : {}),
          "dateModified": modified,
          "author": ARTICLE_AUTHOR,
          "publisher": ARTICLE_PUBLISHER,
          "mainEntityOfPage": canonicalUrlForPath(POST_PATH)
})}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: SECTIONS.map((s) => ({
            "@type": "Question",
            name: s.q,
            acceptedAnswer: { "@type": "Answer", text: s.a },
          })),
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
                  Cost Guide
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Updated {readableDate(modified)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {READ_MINUTES} min read
                </span>
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">
                How Much Does a House Cleaning Cost?
              </h1>

              <p className="text-xl text-muted-foreground mb-8">
                Per hour and per visit, across Canada and at Duty Cleaners in Edmonton and Calgary,
                with the real price tables by bedroom count for standard, deep and move-out cleans.
              </p>

              <div className="aspect-video rounded-2xl overflow-hidden mb-12">
                <img width={1920} height={1080}
                  src={heroImage}
                  alt="Professional house cleaner with cleaning supplies and pricing checklist"
                  className="w-full h-full object-cover"
                 loading="eager" fetchPriority="high"/>
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
                  Cleaning is the job that loses. Work, children and errands all have deadlines attached; the kitchen floor does not, so it waits, and by the time it stops waiting it is a bigger job than it was. That is the calculation most people are actually making when they start pricing a cleaner: not whether the house needs it, but whether the hours are worth buying back.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">
                  The price depends on four things: the size of the home, its condition, which service you book, and how often. This guide gives the market ranges for Canada first, then our own tables, so you can tell the two apart.
                </p>
              </div>

              {/* Own figures first, market context after. All derived. */}
              <div className="mb-10 p-6 bg-primary/5 rounded-xl border-2 border-primary/20">
                <p className="text-xl font-bold text-foreground mb-3">What Duty Cleaners charges</p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  In Edmonton and Calgary a standard clean is {COST_SPANS.standard} depending on the size
                  of the home, a deep clean {COST_SPANS.deep}, and a move-in or move-out clean{" "}
                  {COST_SPANS.moveInOut}. Those are flat rates in Canadian dollars before 5% GST, and
                  they do not change because a clean ran long.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The full tables by bedroom count, including add-ons, are on{" "}
                  <Link to="/pricing/" className="text-primary underline">the full Edmonton price list</Link> and{" "}
                  <Link to="/calgary/pricing/" className="text-primary underline">Calgary house cleaning prices by home size</Link>, and{" "}
                  <Link to="/whats-included/" className="text-primary underline">what's included</Link> lists
                  every task per service.
                </p>
              </div>

              <div className="mb-12 p-6 bg-muted/40 rounded-xl border-l-4 border-primary">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">About the figures in this guide.</strong>{" "}
                  Every price is in Canadian dollars. The market ranges are typical advertised
                  rates across Canadian cities, not a survey and not a quote. Every Duty Cleaners
                  figure is read from our booking system, so it is the number the form will show.
                </p>
              </div>

              {/* Per hour */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {section("per-hour").h2}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{section("per-hour").a}</p>

                <div className="aspect-video rounded-xl overflow-hidden mb-6">
                  <img width={1024} height={1024}
                    src={apartmentImage}
                    alt="Clean modern apartment living room"
                    className="w-full h-full object-cover"
                   loading="lazy" decoding="async"/>
                </div>

                <p className="text-muted-foreground mb-6">
                  There are two ways a company charges: an <strong>hourly rate</strong> or a <strong>flat rate</strong>. Hourly suits a partial job, a few rooms or a one-off task list. Flat suits a whole home, because the number is fixed before anyone arrives.
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-secondary/10 rounded-xl border border-secondary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock3 className="h-5 w-5 text-secondary-foreground" />
                      <h3 className="font-bold text-foreground">Hourly rate, market</h3>
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
                      <h3 className="font-bold text-foreground">Flat rate, market</h3>
                    </div>
                    <ul className="text-muted-foreground text-sm space-y-2">
                      <li>• Based on the size of your home</li>
                      <li>• Small 1-bedroom apartment: <strong>$200-$300</strong> for deep cleaning</li>
                      <li>• Larger 4-bedroom house: <strong>$400+</strong></li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-muted/30 rounded-xl border">
                    <h3 className="font-bold text-foreground mb-3 text-lg">Independent cleaner</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Priced by the hour, at a rate set by the person. Someone starting out charges less; an established cleaner with a full book charges more. You supply the guarantee yourself: if they are ill, the clean does not happen.
                    </p>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-primary font-semibold text-center">$50 - $90 for 2 hours</p>
                    </div>
                  </div>
                  <div className="p-6 bg-muted/30 rounded-xl border">
                    <h3 className="font-bold text-foreground mb-3 text-lg">Cleaning company</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Most price flat by home size, bedrooms and bathrooms, and publish the number before you book. Some quote per hour with a minimum. Ours is {HOURLY} per cleaner per hour for hourly work, and flat by size for everything else.
                    </p>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-primary font-semibold text-center">Discounts for recurring visits</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edmonton */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {section("edmonton").h2}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{section("edmonton").a}</p>
                <TierTable
                  caption="Edmonton, one-time visit, before 5% GST. Bathroom counts follow the published tiers."
                  columns={["Standard", "Deep", "Move-out"]}
                  rows={STANDARD.map((row, index) => ({
                    beds: row.beds,
                    cells: [row.price, DEEP[index].price, MOVE[index].price],
                  }))}
                />
                <p className="text-muted-foreground leading-relaxed">
                  Each service has its own Edmonton page with the same table and what it covers:{" "}
                  <Link to="/edmonton/regular-cleaning/" className="text-primary underline">standard cleaning in Edmonton</Link>,{" "}
                  <Link to="/edmonton/deep-cleaning/" className="text-primary underline">deep cleaning in Edmonton</Link> and{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline">move-out cleaning in Edmonton</Link>. The whole menu is on{" "}
                  <Link to="/services/" className="text-primary underline">all Edmonton cleaning services and prices</Link>.
                </p>
              </div>

              {/* Calgary */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {section("calgary").h2}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{section("calgary").a}</p>
                <TierTable
                  caption="Calgary standard clean per visit, one-time and from the second recurring visit, before 5% GST."
                  columns={["One-time", ...RECURRING.map((f) => f.label)]}
                  rows={PRICING_TIERS.map((tier, index) => ({
                    beds: STANDARD[index].beds,
                    cells: [STANDARD[index].price, ...RECURRING.map((f) => ongoingPrice(tier, f.id))],
                  }))}
                />
                <p className="text-muted-foreground leading-relaxed">
                  The first visit is charged at the one-time rate whichever frequency you pick, because the first clean of a home is the slow one. Calgary's own pages:{" "}
                  <Link to="/calgary/regular-cleaning/" className="text-primary underline">standard cleaning in Calgary</Link>,{" "}
                  <Link to="/calgary/recurring-cleaning/" className="text-primary underline">recurring cleaning in Calgary</Link> and{" "}
                  <Link to="/calgary/services/" className="text-primary underline">every Calgary cleaning service, with starting prices</Link>.
                </p>
              </div>

              {/* Move-out */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {section("move-out").h2}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{section("move-out").a}</p>
                <TierTable
                  caption="Move-in or move-out clean, either city, before 5% GST."
                  columns={["Standard", "Move-out", "Difference"]}
                  rows={MOVE.map((row, index) => ({
                    beds: row.beds,
                    cells: [STANDARD[index].price, row.price, `$${dollars(row.price) - dollars(STANDARD[index].price)}`],
                  }))}
                />
                <p className="text-muted-foreground leading-relaxed">
                  The difference buys the inside of every appliance and cupboard, which is what a landlord or buyer opens first. Book it for the day after the furniture leaves, so nothing blocks a wall or a floor. Details and the inspection-day checklist are on{" "}
                  <Link to="/move-out-cleaning-edmonton/" className="text-primary underline">move-out cleaning in Edmonton</Link> and{" "}
                  <Link to="/move-out-cleaning-calgary/" className="text-primary underline">move-out cleaning in Calgary</Link>.
                </p>
              </div>

              {/* Deep */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {section("deep").h2}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{section("deep").a}</p>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={deepCleanImage}
                      alt="Professional cleaner deep cleaning kitchen appliances"
                      className="w-full h-full object-cover"
                     loading="lazy" decoding="async"/>
                  </div>
                  <div className="aspect-video rounded-xl overflow-hidden">
                    <img width={1024} height={1024}
                      src={suppliesImage}
                      alt="Professional cleaning supplies and equipment"
                      className="w-full h-full object-cover"
                     loading="lazy" decoding="async"/>
                  </div>
                </div>

                <TierTable
                  caption="Deep clean, either city: the standard price plus the deep package, before 5% GST."
                  columns={["Standard", "Deep package", "Deep clean"]}
                  rows={DEEP.map((row) => ({
                    beds: row.beds,
                    cells: [row.standard, row.packagePrice, row.price],
                  }))}
                />
                <p className="text-muted-foreground leading-relaxed">
                  Book a deep clean when the home has not been professionally cleaned in the last few months, or as the first visit of a recurring schedule; the standard visits after it are the cheap ones. What the package covers is on{" "}
                  <Link to="/edmonton/deep-cleaning/" className="text-primary underline">deep cleaning in Edmonton</Link> and{" "}
                  <Link to="/calgary/deep-cleaning/" className="text-primary underline">deep cleaning in Calgary</Link>.
                </p>
              </div>

              {/* What changes the price */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {section("what-changes").h2}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{section("what-changes").a}</p>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
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

                <h3 className="text-xl font-bold mb-4 text-foreground">Market ranges by service</h3>
                <div className="space-y-4 mb-10">
                  {cleaningTypes.map((type, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-muted/30 rounded-xl border">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{type.title}</h4>
                        <p className="text-muted-foreground text-sm">{type.description}</p>
                      </div>
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
                        {type.priceRange}
                      </div>
                    </div>
                  ))}
                </div>

                <h3 className="text-xl font-bold mb-4 text-foreground">Two numbers to ask for before you book</h3>
                <div className="space-y-4">
                  <div className="p-5 bg-destructive/10 rounded-xl border border-destructive/20">
                    <h4 className="font-semibold text-foreground mb-2">Late cancellation and lockout fees</h4>
                    <p className="text-muted-foreground text-sm">
                      Ask any company for two numbers before you book: what a late cancellation costs, and what happens if the cleaner arrives and cannot get in. Ours are {POLICY.cancellationFee} inside {POLICY.cancellationNoticeHours} hours, and {POLICY.lockoutFee} for a lockout.
                    </p>
                  </div>

                  <div className="p-5 bg-muted/30 rounded-xl border">
                    <h4 className="font-semibold text-foreground mb-2">You should not need an estimate visit</h4>
                    <p className="text-muted-foreground text-sm">
                      A company that prices by home size can show you the number before you book. Ours takes about a minute to see, and it is the figure you pay, before 5% GST, whether the clean runs long or not. Treat &ldquo;we&rsquo;ll assess it on arrival&rdquo; as a reason to ask more questions, not a courtesy.{" "}
                      <Link to="/reviews/" className="text-primary underline">Read the reviews</Link> from both cities before you decide.
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
