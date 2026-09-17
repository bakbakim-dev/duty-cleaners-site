import { GST_RATE } from "@/data/pricing";
import { RATING_CLAIM, CITY_PROOF, COMPANY } from "@/data/proof";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
import { canonicalForPath } from "@/data/legacy-urls";
import ServiceIntentComparison from "@/components/ServiceIntentComparison";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Home, Truck, HardHat, PaintRoller, BedDouble, Repeat, DollarSign, Star, MessageSquare, CheckCircle2, Shield, Heart, Phone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import calgaryHero from "@/assets/hero-room-calgary.webp";
import { Helmet } from "react-helmet-async";
import {
  deepCleanTierRows,
  formatPrice,
  getFrequency,
  homeTypeOptions,
  serviceTierRows,
  startingPrice,
  calculateQuote,
  addOnFromPrice,
  DEFAULT_FREQUENCY,
  FREQUENCIES,
  HOURLY_RATE,
  PRICING_TIERS,
  type FrequencyId,
} from "@/data/pricing";

/* Every published figure comes from the BookingKoala config snapshot. */
const from = (value: number) => `from ${formatPrice(value)}`;

/** These cards print four prices and said nothing about tax. */
const GST_PCT = `${Math.round(GST_RATE * 100)}%`;
const GST_LINE = `Starting prices, before ${GST_PCT} GST.`;

/**
 * One rounding rule, and both halves of the recurring pair out of one helper.
 *
 * The card used to read "from $155, then $131.74": the base rounded to the
 * whole dollar the way pricing.ts prints its tier tables, the derived figure
 * not, so the reader's own arithmetic on the printed base — 155 x 0.85 is
 * 131.75 — could not reproduce the number beside it. Every home price on this
 * page now comes out of `homeSizes()`, at one frequency each, rounded once.
 */
const dollars = (value: number) => formatPrice(Math.round(value));

/** Smallest, middle and largest published home — enough to price your own. */
const pickThree = <T,>(rows: T[]): T[] => [rows[0], rows[2], rows[rows.length - 1]];
const SHOWN_TIERS = pickThree(PRICING_TIERS);

const homeSizes = (frequency: FrequencyId) =>
  SHOWN_TIERS.map((tier) => {
    const quote = calculateQuote({
      service: "standard",
      homeType: homeTypeOptions("standard")[0]?.id ?? null,
      bedrooms: tier.beds,
      bathrooms: tier.bathrooms,
      halfBaths: tier.halfBaths,
      addOns: [],
      frequency,
    });
    return {
      label: tier.label,
      price: dollars(frequency === "one-time" ? quote.firstClean : quote.ongoing),
    };
  });

const STANDARD_SIZES = homeSizes("one-time");
const RECURRING_SIZES = homeSizes(DEFAULT_FREQUENCY);
const DEFAULT_FREQ_LABEL = getFrequency(DEFAULT_FREQUENCY).label.toLowerCase();
const STANDARD_PRICE = STANDARD_SIZES[0].price;
const STANDARD_FROM = `from ${STANDARD_PRICE}`;
const RECURRING_PRICE = RECURRING_SIZES[0].price;
const DEEP_ROWS = deepCleanTierRows();
const DEEP_ROW = DEEP_ROWS[0];
const DEEP_FROM = `from ${DEEP_ROW.price}`;
const DEEP_SIZES = pickThree(DEEP_ROWS).map((row) => ({ label: row.beds, price: row.price }));
const MOVE_ROWS = serviceTierRows("move-in-out");
const MOVE_PRICE = MOVE_ROWS[0].price;
const MOVE_FROM = `from ${MOVE_PRICE}`;
const MOVE_SIZES = pickThree(MOVE_ROWS).map((row) => ({ label: row.beds, price: row.price }));
const POST_FROM = from(startingPrice("post-construction"));
const HOURLY = formatPrice(HOURLY_RATE);
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const PET_LINE = PET_FEE === null ? "a pet charge we quote when you book" : `${formatPrice(PET_FEE)} on every visit`;
const TRAVEL_HOME = travelFee("standard");
const TRAVEL_POST = travelFee("post-construction");
const money = (v: number | null) => (v === null ? "a fee quoted when you book" : formatPrice(v));
const pct = (id: string) => {
  const f = FREQUENCIES.find((x) => x.id === id);
  return f ? `${Math.round(f.discount * 100)}%` : "";
};
const proof = CITY_PROOF.calgary;
const QUOTE = `${canonicalForPath("/calgary")}#quote`;
const PRICING = canonicalForPath("/calgary/pricing");
/*
 * The priced menu, not the Calgary landing page. Titled "Cleaning Services
 * Calgary from $155", it competed with /cleaning-services-calgary/ for the
 * query family that page has to own. The title now describes what a visitor
 * gets here instead: the whole list, with the prices attached.
 */
const TITLE = "Compare Cleaning Services in Calgary | Duty Cleaners";
const DESCRIPTION = "Compare cleaning services in Calgary, from one-time visits to recurring and move-out cleaning. Find the scope and pricing basis that fit your job.";

/** Spot wall cleaning, the cheapest wall add-on, from bk-config. */
const WALL_SPOT = addOnFromPrice("standard", "spot-cleaning-inside-walls");

/* The opening paragraph of the choosing guide. It sits above the cards; the
   rest of the guide sits below them. */
const GUIDE_OPENER =
  "In short: if the home is lived in and has been cleaned in the last month or two, standard cleaning is the right service and the cheapest one. Deep cleaning is for the build-up standard cleaning does not reach, and in Calgary that build-up has a winter cause. The city thaws and refreezes on chinooks, so roads get gritted, melt and get gritted again, and sand and de-icer keep coming through the door from November to April. By late winter it is along the baseboards, into carpet edges and under furniture, where a vacuum no longer lifts it.";

type Service = {
  title: string;
  description: string;
  features: string[];
  price: string;
  /**
   * Three published home sizes. Every card used to price a one-bedroom and
   * nothing else, so anyone with a family home had to open a second page to
   * find out what their own house costs.
   */
  sizes?: { label: string; price: string }[];
  /** What the three figures are, in one line. */
  sizesNote?: string;
  link: string;
  linkText: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: boolean;
  badge?: string;
};

const services: Service[] = [
  {
    title: "Standard Cleaning",
    description: "A single visit at a flat rate set by the size of the home. Dusting, vacuuming, kitchen surfaces, bathrooms and floors, with the price fixed before the team arrives.",
    features: [
      "Every room dusted and vacuumed",
      "Bathrooms scrubbed and wiped down",
      "Kitchen counters, sink and the outside of appliances and cabinets",
      "Hard floors mopped after vacuuming"
    ],
    price: STANDARD_FROM,
    sizes: STANDARD_SIZES,
    sizesNote: "A single visit, priced by bedrooms.",
    link: "/calgary/regular-cleaning/",
    linkText: "See Standard Cleaning",
    icon: Home,
    badge: "Popular",
    accent: true
  },
  {
    title: "Recurring Cleaning",
    description: `The standard clean on a standing booking. The first visit is charged at the one-time rate; after that it is ${pct("weekly")} off weekly, ${pct("bi-weekly-every-2-weeks")} off bi-weekly and ${pct("every-4-weeks")} off every 4 weeks.`,
    features: [
      "The standard checklist, repeated on your schedule",
      "Kitchen, bathrooms and living areas each visit",
      "Floors vacuumed, then mopped"
    ],
    // Both numbers, because BookingKoala charges the standard rate for the
    // first clean and only applies the discount from the second visit. Both
    // are rounded by `dollars`, so 155 x 0.85 lands where the card says it does.
    price: `${STANDARD_FROM}, then ${RECURRING_PRICE} ${DEFAULT_FREQ_LABEL}`,
    sizes: RECURRING_SIZES,
    sizesNote: `Each repeat visit on the ${DEFAULT_FREQ_LABEL} plan.`,
    link: "/calgary/recurring-cleaning/",
    linkText: "See Recurring Cleaning",
    icon: Repeat,
    accent: true
  },
  {
    title: "Deep Cleaning",
    description: "The standard clean with the Deep Cleaning package on top, for the grit and scale a Calgary winter leaves behind.",
    features: [
      "The whole standard clean, then the build-up it does not reach",
      "Standard kitchen and bathroom tasks retained",
      "Cobwebs removed within safe reach",
      "Baseboards, door frames, switches, outlets and vent covers wiped by hand"
    ],
    price: DEEP_FROM,
    sizes: DEEP_SIZES,
    sizesNote: "The standard clean with the package added.",
    link: "/calgary/deep-cleaning/",
    linkText: "See Deep Cleaning",
    icon: Sparkles,
    accent: true
  },
  {
    title: "Move-In/Move-Out Cleaning",
    // The guarantee page states plainly that we do not guarantee the damage
    // deposit comes back, because a landlord decides that, not us.
    description: "An empty home cleaned to the move-out checklist before the inspection, or before your boxes arrive.",
    features: [
      "Every deep cleaning task",
      "Inside every cabinet and drawer, and the storage spaces",
      "Inside the oven, fridge and microwave",
      "Every floor vacuumed and mopped, carpets vacuumed"
    ],
    price: MOVE_FROM,
    sizes: MOVE_SIZES,
    sizesNote: "An empty home, cleaned to the move-out checklist.",
    link: "/move-out-cleaning-calgary/",
    linkText: "See Move-In/Move-Out Cleaning",
    icon: Truck,
    accent: false
  },
  {
    title: "Post-Construction Cleaning",
    description: "Drywall and sanding dust cleared from a new or renovated Calgary home once the trades have left, priced by square footage before GST.",
    features: [
      "Fine drywall and sanding dust lifted from ledges and floors",
      "Dust wiped from vent covers, closet shelves and the tops of doors",
      "Every floor vacuumed and mopped",
      "Priced by square footage instead of bedrooms"
    ],
    price: POST_FROM,
    link: "/post-construction-cleaning-calgary/",
    linkText: "See Post-Construction Cleaning",
    icon: HardHat,
    accent: true
  },
  {
    title: "Wall Washing & Cleaning",
    description: "Hand-washed walls: fingerprints, cooking film, smoke residue and the dust line that dry Calgary air leaves above the heat registers. Booked together with a clean, not on its own.",
    features: [
      "Handprints and scuffs removed",
      "Smoke film washed back, with no promise it goes completely",
      "Walls ready for paint or a listing photo"
    ],
    price: WALL_SPOT === null ? "Priced by home size" : `from ${formatPrice(WALL_SPOT)} with a clean`,
    link: "/wall-washing-wall-cleaning-calgary/",
    linkText: "See Wall Washing & Cleaning",
    icon: PaintRoller,
    accent: false
  },
  {
    title: "Airbnb Cleaning Service",
    description: `Hourly turnovers for short-term rental hosts at ${HOURLY} per cleaner before GST, with a minimum of 3 hours for one cleaner or 2 hours for two.`,
    features: [
      "Beds stripped and remade with your linen",
      "Kitchen and bathrooms cleaned",
      "Guest supplies topped up from your stock",
      "The same checklist on every turnover"
    ],
    price: `${HOURLY} per cleaner-hour`,
    link: "/airbnb-cleaning-services-calgary/",
    linkText: "See Airbnb Cleaning Service",
    icon: BedDouble,
    accent: true
  }
];

/* Calgary's own answers, from pricing.ts and policy.ts. One array feeds
   both the FAQPage JSON-LD and the accordion. */
const faqs = [
  {
    q: "Standard or deep cleaning for a Calgary home?",
    a: `If the home has been cleaned in the last couple of months, standard. If you can point at scale on the shower glass, grit in the carpet edges or a greasy range hood, that is the Deep Cleaning package, which is the standard checklist plus baseboards, doors, light switches, wall outlets, vent covers and cobweb removal. On a one-bedroom apartment or condo the standard clean is ${DEEP_ROW.standard} and the package adds ${DEEP_ROW.packagePrice}, so ${DEEP_ROW.price} before GST, with any home-type, pet or travel charge added on the quote. Book the deep clean once, then go back to standard visits.`,
  },
  {
    q: "When do I need move-out cleaning rather than a deep clean?",
    a: `When someone is going to inspect the empty home. Move-out cleaning covers the deep clean and then the places an inspection opens: inside every cabinet and drawer, the storage spaces, the inside of the oven and fridge, and every floor including carpet. A one-bedroom is ${MOVE_PRICE} against ${DEEP_ROW.price} for the deep clean. Your property manager decides whether the deposit comes back, so that is not something we promise; we clean to the move-out checklist.`,
  },
  {
    q: "Are Calgary prices shown with or without GST?",
    a: `Without. GST of ${GST_PCT} goes on top of every figure we quote in Calgary: the flat rate for the home, any add-on, the pet charge, and the travel fee to Airdrie, Cochrane and the other towns outside city limits. You are not charged at booking; a temporary hold checks the card the day before, and the charge goes through when the clean is finished. Visa, Mastercard, American Express, debit and e-transfer all work.`,
  },
  {
    q: "How much do I save by booking recurring cleaning?",
    a: `Nothing on the first visit, which is charged at the one-time standard rate, and then ${pct("weekly")} on every weekly visit, ${pct("bi-weekly-every-2-weeks")} on every bi-weekly visit or ${pct("every-4-weeks")} on every visit every 4 weeks. A standing booking can be moved, skipped or ended with ${POLICY.cancellationNoticeHours} hours' notice; inside that window the fee is ${POLICY.cancellationFee}.`,
  },
  {
    q: "Is there a pet fee?",
    a: `Yes, ${PET_LINE}. A dog that has been out on gravel paths all winter leaves prints in every room, and cat hair adds time on every soft surface, so the charge covers time we know will be spent. It is compulsory for a home with pets, and it appears on the quote before you book. Litter boxes and animal waste are outside what we handle.`,
  },
  {
    q: "Do you charge a travel fee to Airdrie or Cochrane?",
    a: `Yes, because both sit outside Calgary city limits. The travel fee is ${money(TRAVEL_HOME)} per visit for home cleaning and ${money(TRAVEL_POST)} for post-construction, and it is on the quote before you confirm. Inside the city limits, from the Beltline to Seton, there is no trip fee.`,
  },
];

function ServiceCard({ service }: { service: Service }) {
  const Icon = service.icon;
  const badge = service.badge;

  return (
    <div
      className="group relative h-full flex flex-col bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-primary"
    >
      {badge && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
          <span className="dc-icon dc-icon-sparkles w-3 h-3" aria-hidden="true" /> {badge}
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 bg-primary/10">
          <Icon className="w-7 h-7 text-primary" />
        </div>
        {/* Each service is a section of this page, so its name is an H2. */}
        <h2 className="text-xl font-bold text-foreground">{service.title}</h2>
      </div>

      <p className="text-muted-foreground mb-6 leading-relaxed">
        {service.description}
      </p>

      <ul className="space-y-3 mb-8">
        {service.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-primary" />
            <span className="text-sm text-foreground/80">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="pt-6 border-t border-border/50 mt-auto">

        <div className="text-xl font-bold mb-4 text-primary">
          {service.price}
        </div>
        <Button className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link to={service.link}>
            {service.linkText}
            <span className="dc-icon dc-icon-arrow-right w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function CalgaryServices() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/calgary/services/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/calgary/services/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({ name: "House Cleaning Services", description: DESCRIPTION, path: "/calgary/services", city: "calgary" }))}
        </script>
        {/* Generated from the same `faqs` array the accordion renders. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
      </Helmet>
      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <img width={1920} height={1080}
          src={calgaryHero}
          alt="Illustrative bright living room with clean floors and white seating"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/70 via-brand-navy/60 to-brand-navy/80" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <span className="dc-icon dc-icon-sparkles w-4 h-4 text-accent" aria-hidden="true" />
              <span className="text-white/90 text-sm font-medium">{services.length} services on one Calgary price list</span>
            </div>

            <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Which cleaning service do you need in <span className="text-accent">Calgary</span>?
            </h1>

            <p className="text-xl text-white/80 leading-relaxed mb-4">Choose the service for your Calgary home before comparing the price. Use the side-by-side scope guide for everyday upkeep, a deep clean or a property handover, with specialist options below.</p>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              The quote form asks about bedrooms, bathrooms, pets and add-ons and shows the price
              before you book. Nothing is booked until you say so.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to={QUOTE}>See my instant price</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
                <a href={proof.phoneLink}>
                  <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                  Call {proof.phone}
                </a>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm">Pay After Your Clean</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Heart className="w-5 h-5 text-accent" />
                <span className="text-sm">{POLICY.guaranteeWindowHours}-Hour Re-Clean Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-sm">{RATING_CLAIM}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ServiceIntentComparison city="calgary" />
      {/* Services Grid.
          The list and the prices are what this page is searched for, so they
          sit directly under the hero. The guide that used to run for three
          paragraphs above them keeps its opening paragraph here and continues
          below the cards. */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">Explore each service and its starting price</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{GUIDE_OPENER}</p>
            <p className="text-muted-foreground leading-relaxed">The cards identify the scope and starting price of each service. Full home-size tiers and add-ons stay on the city price list. Pets, home type and an address outside city limits can add charges; the quote shows the applicable total before booking.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto items-stretch">
            {services.map((service) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
          {/* Four prices on this page and, until now, nothing about tax. */}
          <p className="text-center text-sm text-muted-foreground mt-8">{GST_LINE}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <Link to={QUOTE}>See my instant price</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to={PRICING}>Every Calgary price by home size</Link>
            </Button>
          </div>
          {/* Owner, 2026-09-11: office work gets its own route off this hub,
              kept apart from the home-cleaning cards and the calculator. */}
          <div className="max-w-3xl mx-auto mt-12 border-t border-border pt-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">Office cleaning in Calgary</h2>
            <p className="text-muted-foreground leading-relaxed">
              A Calgary office is priced per square foot after a walkthrough, and the quote is kept
              separate from home cleaning.{" "}
              <Link to="/commercial-cleaning-services-calgary/" className="text-primary font-semibold underline underline-offset-2">
                Request a commercial cleaning quote
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Choosing a service in Calgary"
        heading="Why a Beltline condo and a Seton new-build are different jobs"
        paragraphs={[
          "Where you live shifts the work more than the size of the home does. A Beltline, Mission or Eau Claire condo is the simplest job, though dry air and wind keep fine grit airborne for most of the year. A newer house in Mahogany, Seton or Livingston carries construction dust. The same square footage can be a very different job.",
          `Move-in and move-out cleaning is a separate service, not a bigger version of a deep clean, and it covers the inside of the oven, fridge and microwave and of every cabinet, drawer and closet. If you are working to a walk-through date, that is the one to book. If you are not sure which applies, call the Calgary office on ${proof.phone} and describe the home.`,
        ]}
      />

      {/* How to choose, and where the rest of the site sits */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-6">Other jobs, reviews and regional coverage</h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">

              <p>Guest changeovers have a different scope from scheduled cleaning of your own home. See <Link to="/airbnb-cleaning-services-calgary/" className="text-accent underline underline-offset-2">Calgary Airbnb turnover cleaning</Link> for hourly pricing and access arrangements.</p>
              <p>For a home after building or renovation work, review <Link to="/post-construction-cleaning-calgary/" className="text-accent underline underline-offset-2">post-construction cleaning in Calgary</Link>. Confirm the dust, debris and readiness requirements with the office.</p>
              <p>
                Every one of those figures is laid out by bedroom count on{" "}
                <Link to={PRICING} className="text-accent underline underline-offset-2">
                  the Calgary house cleaning price list
                </Link>
                , and the {proof.googleReviewCount} reviews on the Calgary Google listing are worth ten
                minutes before you book; you can{" "}
                <Link to="/reviews/" className="text-accent underline underline-offset-2">
                  read the reviews
                </Link>{" "}
                here. A clean also makes a practical present for a new parent or someone recovering from
                surgery, so you can{" "}
                <Link to="/gift-card/" className="text-accent underline underline-offset-2">
                  give a clean as a gift
                </Link>
                .
              </p>
              <p>
                Inside Calgary city limits none of those services carries a trip fee. The Calgary branch
                also cleans in nine communities outside the city, where each home-cleaning visit carries a{" "}
                {money(TRAVEL_HOME)} travel fee and a post-construction clean {money(TRAVEL_POST)}. Two of
                them have a page of their own, with the same services and the fee stated up front:{" "}
                <Link to="/cleaning-services-airdrie/" className="text-accent underline underline-offset-2">
                  house cleaning in Airdrie
                </Link>{" "}
                and{" "}
                <Link to="/cleaning-services-cochrane/" className="text-accent underline underline-offset-2">
                  Cochrane house cleaners
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
                Deep clean, move-out or recurring: what Calgary callers ask first
              </h2>
              <p className="text-muted-foreground">
                Answers taken from the Calgary price list and the terms.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-2 md:p-4 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </div>
      </section>

      {/* Get In Touch Section */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <span className="dc-icon dc-icon-phone w-4 h-4 text-accent" aria-hidden="true" />
              <span className="text-white/90 text-sm font-medium">Contact Us</span>
            </div>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-white">Get In Touch</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="font-bold text-xl text-white mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <span className="dc-icon dc-icon-phone w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Phone</p>
                    <a href={proof.phoneLink} className="font-semibold text-white hover:text-accent transition-colors">
                      {proof.phone}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <span className="dc-icon dc-icon-map-pin w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Address</p>
                    <p className="font-semibold text-white">{proof.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <span className="dc-icon dc-icon-clock w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Hours</p>
                    <p className="font-semibold text-white">Mon-Sat: 8AM-8PM, Sun: 9AM-3PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="font-bold text-xl text-white mb-6">Quick Links</h3>
              <div className="space-y-4">
                <Link
                  to="/calgary/pricing/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">View Pricing</span>
                  <span className="dc-icon dc-icon-arrow-right w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                </Link>
                <Link
                  to="/reviews/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">Read Reviews</span>
                  <span className="dc-icon dc-icon-arrow-right w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                </Link>
                <Link
                  to="/faqs/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <MessageSquare className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">Full FAQ</span>
                  <span className="dc-icon dc-icon-arrow-right w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                </Link>
                <Link
                  to="/about-us/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <span className="dc-icon dc-icon-users w-5 h-5 text-accent" aria-hidden="true" />
                  </div>
                  <span className="font-medium">About Us</span>
                  <span className="dc-icon dc-icon-arrow-right w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
