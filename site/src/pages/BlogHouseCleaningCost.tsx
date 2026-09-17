import { modifiedOr, publishedFor } from "@/data/post-published";
import { useEffect } from "react";
import {
  standardTierRows,
  deepCleanTierRows,
  moveInOutTierRows,
  FREQUENCIES,
  HOURLY_RATE,
  HOME_HOURLY_RATE,
  formatPrice,
  addOnFromPrice,
  calculateQuote,
  homeTypeOptions,
  PRICING_TIERS,
  GST_RATE,
} from "@/data/pricing";
import { travelFee } from "@/data/addon-table";
import { POLICY } from "@/data/policy";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { absoluteAssetUrl, ARTICLE_AUTHOR, ARTICLE_PUBLISHER } from "@/lib/seo";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import { Calendar, Clock, ArrowLeft, DollarSign, Home, Users, Sparkles, Clock3, MapPin, Package, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

import heroImage from "@/assets/blog/house-cleaning-cost-hero.webp";
import apartmentImage from "@/assets/blog/apartment-cleaning.webp";
import suppliesImage from "@/assets/blog/cleaning-supplies-cost.webp";
import deepCleanImage from "@/assets/blog/deep-cleaning-kitchen.webp";

const POST_PATH = "/how-much-does-a-house-cleaning-cost";

/**
 * What each service covers and how it is priced. These cards used to carry
 * hand-typed market ranges for Canadian cities. The content prompt
 * (DUTY-CLEANERS-CONTENT-PROMPT.md) allows no figure that is not in its FACTS
 * block, and those ranges had no source on file, so the page now states only
 * Duty Cleaners' own prices, each derived from bk-config. The scope lines come
 * from SERVICES in data/pricing.ts and the deep package row in bk-config.
 */
const cleaningTypes = [
  {
    title: "Standard clean",
    description: "Kitchen surfaces and appliance exteriors, the bathrooms, dusting of reachable surfaces, and every floor vacuumed and mopped. Ours is priced flat by bedrooms, bathrooms and home type.",
    pricedBy: "Flat by home size"
  },
  {
    title: "Deep clean",
    description: "A standard clean plus the deep package: baseboards, doors, light switches, wall outlets and vent covers. The inside of the oven and fridge are add-ons on top of the package.",
    pricedBy: "Flat by home size"
  },
  {
    title: "Move-in or move-out clean",
    // Owner, 2026-09-11: interior window cleaning is a paid add-on on a
    // move-out, and so are blinds and walls. The sills and tracks are wiped
    // (SERVICES "move-in-out" inclusions in data/pricing.ts).
    description: (
      <>
        Done once the home is empty: the inside of cabinets, drawers, closets, the oven and the
        fridge, window sills and tracks wiped, and baseboards, doors and light switches wiped.
        Interior window cleaning, blinds, spot wall cleaning and full wall washing are separate
        add-ons. Details are on{" "}
        <Link to="/move-out-cleaning-edmonton/" className="text-primary underline">end of tenancy cleaning in Edmonton</Link> and{" "}
        <Link to="/move-out-cleaning-calgary/" className="text-primary underline">end of tenancy cleaning in Calgary</Link>.
      </>
    ),
    pricedBy: "Flat by home size"
  },
  {
    title: "Post-construction clean",
    description: "Fine dust from a renovation settles on every surface in the house, so this clean is priced by square footage rather than bedroom count.",
    pricedBy: "By square footage"
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
/** Airbnb and short-term rental turnovers only. */
const HOURLY = formatPrice(HOURLY_RATE);
/** Any other hourly home cleaning: a minimum, so the copy says "from". */
const HOME_HOURLY = formatPrice(HOME_HOURLY_RATE);

/**
 * Other companies' published prices, for the market ranges in the per-hour
 * section. Not our prices, so nothing in bk-config can supply them: each
 * figure is the low or high end of a sample of six Edmonton and Calgary
 * companies' own published prices, read on 2026-09-11 and recorded with
 * company, URL and job in site/docs/cost-guide-price-sample-2026-09.md.
 * Figures are taken as each company published them: some before GST, one
 * including it, some not saying. The source line under the ranges says so.
 * A range uses only prices published for that job and size (no "any size"
 * starting price, no two-person team rate read as a per-cleaner rate).
 * commercial-costguide-0911.test.ts checks these numbers against that file's
 * "Ranges used on the page" table, so change both together.
 */
const MARKET_SAMPLE = {
  companies: 6,
  checked: "September 2026",
  standardTwoBedroom: [139, 300],
  moveOutTwoBedroom: [199, 387],
  hourlyPerCleaner: [42, 75],
} as const;
const marketRange = ([low, high]: readonly [number, number]) => `${formatPrice(low)} to ${formatPrice(high)}`;
/** The largest home-type surcharge (a two-storey house), over the apartment or condo price. */
const HOUSE_MAX = formatPrice(Math.max(0, ...homeTypeOptions("standard").map((option) => option.price)));

/** The compulsory charges, named without figures, for answers that already state a price. */
const EXTRAS_SHORT =
  "A house rather than an apartment, a home with pets, and an address outside Edmonton or Calgary city limits each add a charge to that price.";

const pricingFactors = [
  {
    icon: Home,
    title: "Size and type of the home",
    description: `Most companies price by home size, using bedrooms and bathrooms or square footage. Ours is flat by bedroom and bathroom count for an apartment or condo, and a bungalow, basement suite, townhouse or two-storey house adds up to ${HOUSE_MAX}.`
  },
  {
    icon: Users,
    title: "Bedrooms and bathrooms",
    description: "Bathrooms are the slow rooms, so a home with more bathrooms moves up the price list even when its floor area is the same."
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
    description: `Hair, paw prints and nose marks add time in every room, so homes with pets are charged more. Ours is ${PET_FEE} per visit; it is compulsory, and it shows on the quote before you book. A home that has not been cleaned in months is a deep-clean job rather than a standard one.`
  },
  {
    icon: Sparkles,
    title: "Add-ons",
    description: `Inside the oven (${OVEN_FEE} at ours), inside the fridge, inside kitchen and bathroom cabinets, interior windows, window blinds and wall washing are priced on top of the base clean, and each shows in the booking form before you commit.`
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

/**
 * Per-visit price of a standard clean once a recurring plan is running, from
 * the same quote maths the funnel uses (BookingKoala's formula), at the same
 * bath assumptions as the published tiers.
 */


/**
 * The six questions the guide answers, each with the paragraph that opens its
 * section. The same array feeds the FAQPage JSON-LD, so the markup can never
 * say something the page does not.
 */
const SECTIONS = [
  {
    id: "per-hour",
    h2: "What should you compare in flat-rate and hourly quotes?",
    q: "What should you compare in flat-rate and hourly quotes?",
    a: `At Duty Cleaners, whole-home standard, deep and move-out cleans are priced flat by home size, so the price stays the same if a clean runs long. Partial or unusual home-cleaning jobs, such as a few rooms, a one-off task list or a home no size tier fits, are quoted by the hour from ${HOME_HOURLY} per cleaner-hour before 5% GST, with a minimum of 3 hours for one cleaner or 2 hours for two. Airbnb and short-term rental turnovers have a separate rate of ${HOURLY} per cleaner-hour before GST, with the same minimums. Outside Edmonton or Calgary city limits, a home clean also carries a ${TRAVEL_FEE} travel fee.`,
  },
  {
    id: "edmonton",
    h2: "Where can you find our Edmonton and Calgary prices?",
    q: "Where can you find our Edmonton and Calgary prices?",
    a: "Use the price list for the branch serving your address. Each lists home-size tiers and applicable extras; compare the same service and home type. The instant quote calculates the total for your booking details.",
  },
  {
    id: "calgary",
    h2: "How does an illustrative cleaning quote break down?",
    q: "How does an illustrative cleaning quote break down?",
    a: "Check the home-size assumptions first, then any home-type adjustment, pet charge, travel fee and optional tasks. Compare the first visit separately from discounted recurring visits, and check whether tax is included. A worked example is an illustration, not a quote for every home.",
  },
  {
    id: "move-out",
    h2: "Why do move-out and standard cleaning quotes differ?",
    q: "Why do move-out and standard cleaning quotes differ?",
    a: `A move-in or move-out clean is ${MOVE[0].price} for a 1-bedroom apartment or condo and ${last(MOVE).price} for five bedrooms, before GST, in Edmonton or Calgary. That includes the inside of the oven, fridge, cabinets, drawers and closets, which are add-ons on a standard clean. ${EXTRAS_SHORT}`,
  },
  {
    id: "deep",
    h2: "How does the deep-clean package change scope and price?",
    q: "How does the deep-clean package change scope and price?",
    a: `A deep clean is ${COST_SPANS.deep} before GST, from a 1-bedroom apartment or condo to five bedrooms. It is a standard clean plus the deep package, which adds ${DEEP[0].packagePrice} on a 1-bedroom and ${last(DEEP).packagePrice} on a 5-bedroom home for baseboards, doors, light switches, wall outlets and vent covers. ${EXTRAS_SHORT}`,
  },
  {
    id: "what-changes",
    h2: "What changes the price of a house cleaning?",
    q: "What changes the price of a house cleaning?",
    a: `The price of a house cleaning moves with the size and type of the home, the service, how often you book, and any add-ons. Three charges apply whenever they fit the home: up to ${HOUSE_MAX} for a house rather than an apartment or condo, ${PET_FEE} a visit for a home with pets, and a ${TRAVEL_FEE} travel fee outside Edmonton or Calgary city limits. Condition matters too: if a home needs substantially more work than described, the team explains what it found and the options before continuing.`,
  },
] as const;

const ILLUSTRATIVE_QUOTE = calculateQuote({ service: "standard", homeType: homeTypeOptions("standard")[0]?.id ?? null, bedrooms: PRICING_TIERS[0].beds, bathrooms: PRICING_TIERS[0].bathrooms, halfBaths: PRICING_TIERS[0].halfBaths, addOns: [], frequency: "one-time" });
const TITLE = "How Much Does House Cleaning Cost? Rates Explained";
const DESCRIPTION = "Understand flat-rate and hourly cleaning quotes, the extras that change the total, and how to compare services. Find Duty Cleaners' local price lists.";

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
const WORD_COUNT = 2015;
const READ_MINUTES = Math.max(1, Math.round(WORD_COUNT / 220));



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
          "headline": "House Cleaning Costs Explained: Rates, Scope and Extras",
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
              </div>

              <h1 className="text-3xl md:text-5xl font-bold mb-6 text-foreground leading-tight">House Cleaning Costs Explained: Rates, Scope and Extras</h1>

              <p className="text-xl text-muted-foreground mb-8">A cleaning quote is only useful when you know what it includes. Home size, service scope and additional tasks can change the total. Learn how to compare quotes, then use our city price lists for current rates.</p>

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
                  Compare cleaning quotes by the work included, the size and condition of the home, required extras and GST. A lower headline price is not necessarily a lower total for the same job.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed mt-4">Compare the same home, tasks and visit frequency before judging two quotes. Separate the base service from mandatory fees, optional extras and tax. A low starting figure does not tell you what your own booking will cost.</p>
              </div>

              <div className="mb-10 p-6 border border-border rounded-xl"><h2 className="text-2xl font-bold mb-4">Questions to ask before accepting a quote</h2><ul className="list-disc pl-5 space-y-2"><li>Does the quote cover the same rooms, surfaces and appliance interiors?</li><li>Are the home type, pets, travel and selected add-ons accounted for?</li><li>Is the hourly rate per cleaner, and is there a minimum booking?</li><li>What happens if the property needs substantially more work than described?</li><li>Is this the first-visit price, and is GST included?</li></ul></div>
              {/* Own figures first. All derived. */}
              <div className="mb-10 p-6 bg-primary/5 rounded-xl border-2 border-primary/20">
                <p className="text-xl font-bold text-foreground mb-3">What Duty Cleaners charges</p>
                <p className="text-muted-foreground leading-relaxed mb-3">
                  At Duty Cleaners, a standard clean in Edmonton or Calgary is {COST_SPANS.standard} depending on the size
                  of the home, a deep clean {COST_SPANS.deep}, and a move-in or move-out clean{" "}
                  {COST_SPANS.moveInOut}. Those are flat rates in Canadian dollars before 5% GST for an
                  apartment or condo, and they do not change because a clean ran long. A house rather than an apartment, a
                  home with pets and an address outside Edmonton or Calgary city limits each add a
                  charge.
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
                  Every Duty Cleaners price in this guide is in Canadian dollars before 5% GST, read
                  from our booking system, so it matches what the booking form shows for the same
                  home. The market ranges in the per-hour section are other companies&rsquo;
                  published prices, with their source and date beside them.
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
                      <h3 className="font-bold text-foreground">Priced by the hour</h3>
                    </div>
                    <ul className="text-muted-foreground text-sm space-y-2">
                      <li>• The bill is the rate times the hours worked, so a slow clean costs more.</li>
                      <li>• Hourly bookings often carry a minimum number of hours.</li>
                      <li>
                        • At Duty Cleaners, partial or unusual home-cleaning jobs are billed this way, from {HOME_HOURLY} per
                        cleaner-hour (see{" "}
                        <Link to="/pricing/" className="text-primary underline">hourly home cleaning on the Edmonton price list</Link>
                        ), and Airbnb turnovers at their own rate of {HOURLY}. Whole-home cleans are priced flat.
                      </li>
                    </ul>
                  </div>
                  <div className="p-6 bg-accent/10 rounded-xl border border-accent/20">
                    <div className="flex items-center gap-2 mb-3">
                      <DollarSign className="h-5 w-5 text-accent-foreground" />
                      <h3 className="font-bold text-foreground">Priced by the home</h3>
                    </div>
                    <ul className="text-muted-foreground text-sm space-y-2">
                      <li>• The price is set by bedrooms, bathrooms and home type.</li>
                      <li>• You know the number before anyone arrives.</li>
                      <li>• Ours covers standard, deep and move-out cleans; post-construction is priced by square footage.</li>
                    </ul>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-6 bg-muted/30 rounded-xl border">
                    <h3 className="font-bold text-foreground mb-3 text-lg">Independent cleaner</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Usually priced by the hour, at a rate the person sets. Someone starting out tends to charge less than an established cleaner with a full book. There is rarely a second cleaner to send if they are ill, and any promise to come back and re-clean is between you and them.
                    </p>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-primary font-semibold text-center">Rate set by the person</p>
                    </div>
                  </div>
                  <div className="p-6 bg-muted/30 rounded-xl border">
                    <h3 className="font-bold text-foreground mb-3 text-lg">Cleaning company</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Many price flat by home size and show the number before you book; some quote per hour with a minimum. Duty Cleaners prices whole-home standard, deep and move-out cleans flat by size, quotes partial jobs by the hour, discounts recurring visits from the second one, and re-cleans anything missed at no charge if you tell us within 24 hours.
                    </p>
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-primary font-semibold text-center">Discounts for recurring visits</p>
                    </div>
                  </div>
                </div>

                {/* Market ranges: other companies' own published prices, sampled
                    and recorded in site/docs/cost-guide-price-sample-2026-09.md. */}
                <div className="mt-8 p-6 bg-muted/30 rounded-xl border">
                  <h3 className="font-bold text-foreground mb-3 text-lg">What other Edmonton and Calgary companies publish</h3>
                  <p className="text-muted-foreground text-sm mb-3 leading-relaxed">
                    Among Edmonton and Calgary cleaning companies that publish their prices, a
                    standard clean of a 2-bedroom home ran {marketRange(MARKET_SAMPLE.standardTwoBedroom)},
                    and a move-out clean of a 2-bedroom home {marketRange(MARKET_SAMPLE.moveOutTwoBedroom)}.
                    Companies that bill by the hour charged {marketRange(MARKET_SAMPLE.hourlyPerCleaner)} per
                    cleaner-hour. For a {PRICING_TIERS[1].beds}-bedroom, {PRICING_TIERS[1].bathrooms}-bathroom
                    apartment or condo, ours is {STANDARD[1].price} for a standard clean and {MOVE[1].price} for
                    a move-out clean, and hourly home cleaning is from {HOME_HOURLY} per cleaner-hour.
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    Ranges from the published prices of {MARKET_SAMPLE.companies} Edmonton and Calgary
                    cleaning companies, checked {MARKET_SAMPLE.checked}, taken as each company
                    published them: before GST, including GST, or not saying. Your own quote may differ.
                  </p>
                </div>
              </div>

              {/* Edmonton */}
              <div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">{section("edmonton").h2}</h2><p className="text-muted-foreground mb-4">{section("edmonton").a}</p><p>See the <Link className="text-primary underline" to="/pricing/">Edmonton house cleaning price list</Link> or <Link className="text-primary underline" to="/calgary/pricing/">Calgary house cleaning price list</Link>. Compare the <Link className="text-primary underline" to="/whats-included/">written service checklists</Link> alongside the rates.</p></div>

              {/* Calgary */}
              <div className="mb-16"><h2 className="text-2xl md:text-3xl font-bold mb-6">{section("calgary").h2}</h2><p className="text-muted-foreground mb-4">{section("calgary").a}</p><p className="text-muted-foreground mb-4">For illustration, a one-time standard clean for a one-bedroom, one-bathroom apartment or condo is {formatPrice(ILLUSTRATIVE_QUOTE.firstClean)} before GST. With 5% GST, that example is {formatPrice(Math.round(ILLUSTRATIVE_QUOTE.firstClean * (1 + GST_RATE) * 100) / 100)}. It assumes no pets, no add-ons and an address inside Edmonton or Calgary city limits. A different home type or any applicable extra changes the total.</p><p>For a schedule, compare the first visit and later visits using the <Link className="text-primary underline" to="/edmonton/recurring-cleaning/">Edmonton recurring options</Link> or <Link className="text-primary underline" to="/calgary/recurring-cleaning/">Calgary recurring options</Link>.</p></div>

              {/* Move-out */}
              <div className="mb-16">
                <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                  {section("move-out").h2}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">{section("move-out").a}</p>
                <p className="text-muted-foreground leading-relaxed">
                  The difference buys the inside of the oven, fridge, cabinets, drawers and closets, which are the places a move-out inspection opens. Book it for the day after the furniture leaves, so nothing blocks a wall or a floor. Details are on{" "}
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
                <p className="text-muted-foreground leading-relaxed">
                  Book a deep clean when the home has not been professionally cleaned in the last few months, or as the first visit of a recurring schedule; the standard visits after it cost less. What the package covers is on{" "}
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

                <h3 className="text-xl font-bold mb-4 text-foreground">What each service covers</h3>
                <div className="space-y-4 mb-10">
                  {cleaningTypes.map((type, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-muted/30 rounded-xl border">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{type.title}</h4>
                        <p className="text-muted-foreground text-sm">{type.description}</p>
                      </div>
                      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-sm whitespace-nowrap">
                        {type.pricedBy}
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
                      A company that prices by home size can show you the number before you book. Ours shows on screen before you book, as a flat rate before 5% GST that does not change if the clean runs long. If a home needs substantially more work than described, the team explains what it found and the options before continuing. Treat &ldquo;we&rsquo;ll assess it on arrival&rdquo; as a reason to ask more questions.{" "}
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
