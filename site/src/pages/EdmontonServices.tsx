import { GST_RATE } from "@/data/pricing";
import { RATING_CLAIM, CITY_PROOF, COMPANY } from "@/data/proof";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
import { canonicalForPath } from "@/data/legacy-urls";
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
import {
  Sparkles,
  ShieldCheck,
  Home,
  Truck,
  HardHat,
  PaintRoller,
  Briefcase,
  BedDouble,
  Repeat,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Star,
  MessageSquare,
  Users,
  CheckCircle2,
  ArrowRight,
  Shield,
  Heart
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import edmontonHero from "@/assets/edmonton-hero-cleaner.webp";
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
const PET_LINE = PET_FEE === null ? "a pet charge quoted when you book" : `${formatPrice(PET_FEE)} per visit`;
const TRAVEL_HOME = travelFee("standard");
const TRAVEL_POST = travelFee("post-construction");
const money = (v: number | null) => (v === null ? "a fee quoted when you book" : formatPrice(v));
const pct = (id: string) => {
  const f = FREQUENCIES.find((x) => x.id === id);
  return f ? `${Math.round(f.discount * 100)}%` : "";
};
const proof = CITY_PROOF.edmonton;
const QUOTE = "/#quote";
const PRICING = canonicalForPath("/pricing");
/*
 * This page is the priced menu, not the city landing page. It used to be
 * titled "Cleaning Services Edmonton from $155" — the phrase the Edmonton hub
 * at "/" has to own — and drew 78,000 impressions at position 25 for the
 * trouble. The title now says what the page is: every service, priced.
 */
const TITLE = `All Edmonton Cleaning Services & Prices from ${STANDARD_PRICE}`;
const DESCRIPTION = "Every Edmonton cleaning service on one page, with what each costs for a one-bedroom, three-bedroom and five-bedroom home, before GST.";

/* The opening paragraph of the choosing guide. It sits above the cards; the
   rest of the guide sits below them, where a reader who has already found the
   price they came for will actually read it. */
const GUIDE_OPENER =
  "The honest short version: if the home is lived in and has been cleaned in the last month or two, standard cleaning is the right service and the cheapest one. Deep cleaning is for what standard cleaning cannot reach, and Edmonton generates that in its own way — the cold here holds rather than cycling, so the heating season runs unbroken from October to April. The furnace simply keeps going, and everything that moves through the ducts in those months settles on the tops of doors, along ceiling lines and behind furniture where nothing disturbs it.";


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
    description: "One visit, flat rate by home size. Kitchen, bathrooms, floors and dusting in every room, and the price does not move if it takes longer than planned.",
    features: [
      "All rooms dusted and vacuumed",
      "Bathrooms properly cleaned and sanitised",
      "Kitchen cleaned (counters, sink, appliance and cabinet exteriors only)",
      "Floors mopped and vacuumed"
    ],
    price: STANDARD_FROM,
    sizes: STANDARD_SIZES,
    sizesNote: "One visit, by home size.",
    link: "/edmonton/regular-cleaning/",
    linkText: "See Standard Cleaning",
    icon: Home,
    badge: "Popular",
    accent: true
  },
  {
    title: "Recurring Cleaning",
    description: `Weekly, bi-weekly or every-4-weeks cleaning on a standing booking. Your first clean is the standard rate; from the second visit on you save ${pct("weekly")} weekly, ${pct("bi-weekly-every-2-weeks")} bi-weekly and ${pct("every-4-weeks")} every 4 weeks.`,
    features: [
      "Same checklist as a standard clean, on a schedule",
      "Kitchen, bathrooms, and living areas cleaned",
      "Floors vacuumed and mopped"
    ],
    // Both numbers, because BookingKoala charges the standard rate for the
    // first clean and only applies the discount from the second visit. Both
    // are rounded by `dollars`, so 155 x 0.85 lands where the card says it does.
    price: `${STANDARD_FROM}, then ${RECURRING_PRICE} ${DEFAULT_FREQ_LABEL}`,
    sizes: RECURRING_SIZES,
    sizesNote: `Every visit after the first, on the ${DEFAULT_FREQ_LABEL} plan.`,
    link: "/edmonton/recurring-cleaning/",
    linkText: "See Recurring Cleaning",
    icon: Repeat,
    accent: true
  },
  {
    title: "Deep Cleaning",
    description: "A standard clean plus the Deep Cleaning package: grout, descaling, degreasing and the trim a regular visit walks past.",
    // Was four bullets: two copied verbatim from the Standard card above and
    // one repeating another inside this card. These are the four scope items
    // the deep-cleaning page itself publishes.
    features: [
      "Everything in a standard clean, plus the build-up a regular visit skips",
      "Tile, grout and shower glass scrubbed; tubs and fixtures descaled",
      "Stovetops, range hoods and cabinet fronts degreased",
      "Baseboards, door frames, switches, outlets and vent covers hand-wiped"
    ],
    price: DEEP_FROM,
    sizes: DEEP_SIZES,
    sizesNote: "Standard clean plus the Deep Cleaning package.",
    link: "/edmonton/deep-cleaning/",
    linkText: "See Deep Cleaning",
    icon: Sparkles,
    accent: true
  },
  {
    title: "Move-In/Move-Out Cleaning",
    // The guarantee page states plainly that we do not guarantee the damage
    // deposit comes back, because a landlord decides that, not us.
    description: "Cleaned to the standard a move-out inspection looks for, or ready to move into.",
    features: [
      "All deep cleaning tasks",
      "Inside all cabinets, drawers, and the kitchen walls",
      "Cleaning of inside and outside appliances",
      "Vacuuming and mopping of all floors, including carpet vacuuming"
    ],
    price: MOVE_FROM,
    sizes: MOVE_SIZES,
    sizesNote: "Empty home, inspection standard, by size.",
    link: "/move-out-cleaning-edmonton/",
    linkText: "See Move-In/Move-Out Cleaning",
    icon: Truck,
    accent: false
  },
  {
    title: "Post-Construction Cleaning",
    description: "The fine dust a renovation leaves, cleared from walls, inside windows, baseboards and floors after the trades are out.",
    features: [
      "Drywall and sanding dust removed",
      "Cleaning of walls, inside windows, baseboards",
      "Vacuuming and mopping of all floors",
      "Final move-in ready detailing"
    ],
    price: POST_FROM,
    link: "/post-construction-cleaning/",
    linkText: "See Post-Construction Cleaning",
    icon: HardHat,
    accent: true
  },
  {
    title: "March Out Cleaning",
    description: "Military housing move-out cleaning in Edmonton, done to CFHA march-out inspection standards so your handover passes the first time.",
    features: [
      "Appliance interiors, edges and baseboards",
      "Bathrooms cleaned to inspection standards",
      "Wall washing & interior windows available as add-ons",
      "Final walkthrough against the inspection list"
    ],
    price: "Quoted by Phone",
    link: "/edmonton/march-out-cleaning/",
    linkText: "See March Out Cleaning",
    icon: ShieldCheck,
    accent: false
  },
  {
    title: "Wall Washing & Cleaning",
    description: "Walls washed by hand: handprints, cooking film, smoke residue and the grey line above the baseboard heater.",
    features: [
      "Remove handprints and smudges",
      "Lift nicotine tar and smoke residue",
      "Clean dust and cobwebs",
      "Prepare walls for painting or a sale"
    ],
    price: "Custom Pricing",
    link: "/wall-washing-wall-cleaning/",
    linkText: "See Wall Washing & Cleaning",
    icon: PaintRoller,
    accent: false
  },
  {
    title: "Airbnb Cleaning Service",
    description: `Turnovers between guests for short-term rental hosts, billed by the hour at ${HOURLY} per cleaner with a 3-hour minimum.`,
    features: [
      "Beds remade with your linen",
      "Laundry when the machines and a spare set are ready",
      "Supplies restocked from your stock",
      "Same checklist on every turnover"
    ],
    price: `${HOURLY} per cleaner-hour`,
    link: "/edmonton/airbnb-cleaning/",
    linkText: "See Airbnb Cleaning Service",
    icon: BedDouble,
    accent: true
  },
  {
    title: "Commercial Cleaning",
    description: "Professional cleaning for offices, retail spaces, and commercial properties across Edmonton.",
    features: [
      "Offices & commercial spaces",
      "Recurring cleaning schedules",
      "Reference-checked, customer-rated cleaners",
      "Flexible scheduling options"
    ],
    price: "Custom Pricing",
    link: "/commercial-cleaning/",
    linkText: "See Commercial Cleaning",
    icon: Briefcase,
    badge: "Professional Service",
    accent: true
  }
];

/* Answered from pricing.ts and policy.ts. Feeds the FAQPage JSON-LD below
   and the accordion, from one array. */
const faqs = [
  {
    q: "What is the difference between standard and deep cleaning?",
    a: `Deep cleaning is a standard clean with the Deep Cleaning package added. The standard visit covers dusting, vacuuming, bathrooms, kitchen surfaces and floors. The package adds the build-up a regular visit does not touch: tile, grout and shower glass scrubbed, tubs and taps descaled, stovetop and cabinet fronts degreased, and baseboards, door frames, switches and vent covers wiped by hand. For a one-bedroom home the standard clean is ${DEEP_ROW.standard}, the package ${DEEP_ROW.packagePrice}, ${DEEP_ROW.price} together before GST.`,
  },
  {
    q: "Is move-out cleaning the same as a deep clean?",
    a: `No. Move-out cleaning includes every deep cleaning task and then goes where a landlord's inspection goes: inside every cabinet and drawer, inside the oven and fridge, the kitchen walls, and every floor including carpet. A one-bedroom home is ${MOVE_PRICE}, against ${DEEP_ROW.price} for a deep clean. Whether the damage deposit comes back is the landlord's decision, so we do not guarantee it; we clean to the list they inspect against.`,
  },
  {
    q: "Do the prices include GST?",
    a: `No. Every figure on this page is before tax, and ${GST_PCT} GST is added on top. Nothing is charged when you book. The day before the visit a temporary hold confirms the card, and it is charged once the clean is complete. Visa, Mastercard, American Express, debit and e-transfer are accepted.`,
  },
  {
    q: "How do the recurring discounts work?",
    a: `The first clean is charged at the standard one-time rate. From the second visit on, the discount depends on how often we come: ${pct("weekly")} weekly, ${pct("bi-weekly-every-2-weeks")} bi-weekly and ${pct("every-4-weeks")} every 4 weeks. There is no contract; if you stop, the standing booking stops with you.`,
  },
  {
    q: "Is there a charge for pets?",
    a: `Yes, ${PET_LINE}. Paw prints, nose marks on glass and shed hair add real time in every room, and the charge appears on your quote before you book. Litter boxes and animal waste stay outside what we handle.`,
  },
  {
    q: "Is there a travel fee outside Edmonton?",
    a: `Inside Edmonton city limits there is no trip fee. Outside them, in St. Albert, Sherwood Park, Spruce Grove, Leduc, Beaumont, Fort Saskatchewan, Stony Plain, Morinville or Devon, a travel fee applies: ${money(TRAVEL_HOME)} for home cleaning and ${money(TRAVEL_POST)} for post-construction. It shows on the quote before you confirm.`,
  },
];

type ServiceLocal = Service;

function ServiceCard({ service }: { service: ServiceLocal }) {
  const Icon = service.icon;
  const badge = service.badge;

  return (
    <div
      className="group relative h-full flex flex-col bg-white rounded-2xl shadow-lg p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl border-t-4 border-primary"
    >
      {badge && (
        <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow">
          <Sparkles className="w-3 h-3" /> {badge}
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
        {service.sizes && (
          <div className="mb-4">
            <dl className="space-y-1.5">
              {service.sizes.map((size) => (
                <div key={size.label} className="flex items-baseline justify-between gap-3 text-sm">
                  <dt className="text-muted-foreground">{size.label}</dt>
                  <dd className="font-semibold text-foreground tabular-nums">{size.price}</dd>
                </div>
              ))}
            </dl>
            {service.sizesNote && (
              <p className="pt-2 text-xs text-muted-foreground">{service.sizesNote}</p>
            )}
          </div>
        )}
        <div className="text-xl font-bold mb-4 text-primary">
          {service.price}
        </div>
        <Button className="w-full group/btn bg-primary hover:bg-primary/90 text-primary-foreground" asChild>
          <Link to={service.link}>
            {service.linkText}
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default function EdmontonServices() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/services/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/services/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({ name: "House Cleaning Services", description: DESCRIPTION, path: "/services", city: "edmonton" }))}
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
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <img width={1024} height={1024}
          src={edmontonHero}
          alt="Duty Cleaners cleaner at work in an Edmonton home"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/70 via-brand-navy/60 to-brand-navy/80" />
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">{services.length} services, one price list</span>
            </div>

            <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Every <span className="text-accent">Edmonton</span> cleaning service, with its
              starting price
            </h1>

            <p className="text-xl text-white/80 leading-relaxed mb-4">
              Flat rates by home size {STANDARD_FROM} before GST, or {HOURLY} per cleaner-hour for
              the jobs a size tier cannot describe. Rated {RATING_CLAIM} across Edmonton homes {COMPANY.sinceLabel}.
            </p>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              Answer a few questions about the home and the quote form shows your price in about 60
              seconds, before anything is booked.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
                <Link to={QUOTE}>See my instant price</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg border-white/20 text-white hover:bg-white/10">
                <a href={proof.phoneLink}>
                  <Phone className="w-4 h-4 mr-2" />
                  Call {proof.phone}
                </a>
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 text-white/90">
                <Shield className="w-5 h-5 text-accent" />
                <span className="text-sm">Pay After Your Clean</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Heart className="w-5 h-5 text-accent" />
                <span className="text-sm">{POLICY.guaranteeWindowHours}-hour re-clean guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Star className="w-5 h-5 text-accent" />
                <span className="text-sm">{RATING_CLAIM}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid.
          The list and the prices are what this page is searched for, so they
          sit directly under the hero. The guide that used to run for three
          paragraphs above them keeps its opening paragraph here and continues
          below the cards. */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto mb-12">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
              Standard, deep, move-out and recurring cleaning, priced by home size
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">{GUIDE_OPENER}</p>
            <p className="text-muted-foreground leading-relaxed">
              Each card prices three of the five published sizes: a one-bedroom, a three-bedroom and
              the five-or-more tier, all before {GST_PCT} GST. Pets, add-ons and the type of home
              move the figure, and the quote form shows the total before you commit to anything.
            </p>
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
              <Link to={PRICING}>Compare every price by home size</Link>
            </Button>
          </div>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Choosing a service in Edmonton"
        heading="How an Edmonton winter decides between a standard and a deep clean"
        paragraphs={[
          "A closed-up Edmonton winter adds a second kind of dirt. With windows shut for five months, cooking vapour, fireplace soot and pet dander recirculate instead of venting, and they land as a film rather than as dust — which is why kitchens and the walls around them so often need more than a wipe by March. In older Oliver, Garneau and Strathcona homes with original trim and radiators there is more surface to hand-clean than the square footage suggests; in newer Windermere, Keswick or Laurel builds it is usually construction dust still working its way out of the vents.",
          "Move-in and move-out cleaning is a separate service rather than a larger deep clean, priced against what landlords actually inspect: inside appliances, inside every cabinet and drawer, and the storage spaces. If you are working to a walk-through date, book that one. If you are unsure which fits, the instant quote asks a few questions about the home and tells you — or you can call and describe it and we will say which is the cheaper honest answer.",
        ]}
      />

      {/* How to choose, and where the rest of the site sits */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              How to choose between standard, deep, recurring and move-out cleaning
            </h2>
            <div className="space-y-5 text-muted-foreground leading-relaxed">
              <p>
                Start with the standard clean unless you can name what it would miss. It is priced flat by
                home size, {STANDARD_FROM}, and the rate does not change if the team is there longer than
                expected. If what you can name is grout, a scaled shower door, a greasy range hood or grey
                baseboards, that is the Deep Cleaning package, and the honest way to buy it is once, then
                drop back to standard visits.
              </p>
              <p>
                Recurring cleaning is the standard clean on a standing booking, and it is the cheapest way to
                keep a lived-in home at the same level: the first visit is charged at the one-time rate and
                every visit after it is discounted by how often we come. It suits a family home, a rental you
                manage for a long-term tenant, and a host who lives in the unit most of the year; for the guest
                weeks,{" "}
                <Link to="/edmonton/airbnb-cleaning/" className="text-accent underline underline-offset-2">
                  Airbnb cleaning in Edmonton
                </Link>{" "}
                is billed by the hour instead.
              </p>
              <p>
                Move-out cleaning is for a walk-through date. It is the deep clean plus the inside of every
                cabinet, drawer and appliance, {MOVE_FROM}, and the deposit decision stays with the landlord.
                Post-construction cleaning is a different job again: fine dust rather than dirt, {POST_FROM},
                and it is worth booking after the trades have finished, not between them.
              </p>
              <p>
                Every price here is on{" "}
                <Link to={PRICING} className="text-accent underline underline-offset-2">
                  the full Edmonton price list
                </Link>{" "}
                by home size, and {proof.googleReviewCount} Google reviews sit behind the rating; you can{" "}
                <Link to="/reviews/" className="text-accent underline underline-offset-2">
                  read before you decide
                </Link>
                . If the clean is for someone else, a parent after surgery or a friend with a newborn, you can{" "}
                <Link to="/gift-card/" className="text-accent underline underline-offset-2">
                  give a clean as a gift
                </Link>{" "}
                and let them pick the date.
              </p>
              <p>
                All of it runs inside Edmonton city limits at the prices above, with no trip fee. The same
                crews cover the towns around the city for a travel fee of {money(TRAVEL_HOME)} per home-cleaning
                visit:{" "}
                <Link to="/cleaning-services-st-albert/" className="text-accent underline underline-offset-2">
                  house cleaning in St. Albert
                </Link>
                ,{" "}
                <Link to="/cleaning-services-sherwood-park/" className="text-accent underline underline-offset-2">
                  Sherwood Park house cleaners
                </Link>{" "}
                and{" "}
                <Link to="/cleaning-services-spruce-grove/" className="text-accent underline underline-offset-2">
                  cleaning services in Spruce Grove
                </Link>{" "}
                each have their own page with the same service list.
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
                Standard, deep or move-out: the questions Edmonton callers ask
              </h2>
              <p className="text-muted-foreground">
                Answered from the price list and the terms, not from a script.
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
        {/* Decorative Elements */}
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-4">
              <Phone className="w-4 h-4 text-accent" />
              <span className="text-white/90 text-sm font-medium">Contact Us</span>
            </div>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-white">Get In Touch</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Contact Information */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="font-bold text-xl text-white mb-6">Contact Information</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Phone className="w-5 h-5 text-accent" />
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
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Address</p>
                    <p className="font-semibold text-white">{proof.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Clock className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-white/80">Hours</p>
                    <p className="font-semibold text-white">Mon-Sat: 8AM-8PM, Sun: 9AM-3PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="font-bold text-xl text-white mb-6">Quick Links</h3>
              <div className="space-y-4">
                <Link
                  to="/pricing/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <DollarSign className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">View Pricing</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
                <Link
                  to="/reviews/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Star className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">Read Reviews</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
                <Link
                  to="/faqs/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <MessageSquare className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">Full FAQ</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </Link>
                <Link
                  to="/about-us/"
                  className="flex items-center gap-3 text-white/80 hover:text-accent transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-accent/30">
                    <Users className="w-5 h-5 text-accent" />
                  </div>
                  <span className="font-medium">About Us</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
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
