import { addOnFromPrice, deepCleanTierRows, formatPrice, moveInOutTierRows, standardTierRows } from "@/data/pricing";
import { addOnTableRows, travelFee, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { useLocation } from "react-router-dom";
import { CITY_PROOF, cityProofFor, RATING_CLAIM } from "@/data/proof";
import { quoteHrefFor } from "@/lib/quote-link";
import Navigation from "@/components/Navigation";
import { NOT_INCLUDED, POLICY } from "@/data/policy";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import heroBg from "@/assets/whats-included-hero.webp";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import {
  Sparkles,
  Home,
  Truck,
  Star,
  Phone,
  Calculator,
  SprayCan,
  Refrigerator,
  Fan,
  DoorOpen,
  Paintbrush,
  Bath,
  Utensils,
  BedDouble,
  Sofa,
  Droplets,
  LucideIcon,
  CheckCircle2,
  XCircle,
  Check,
  Plus,
  Minus
} from "lucide-react";

// Cleaning service card component
type MatrixLevel = "yes" | "addon" | "package" | "no";

/** The pricing pages publish the same rows from the same BookingKoala data.
 *  The last two are charges rather than choices, so they are split out. */
const NON_OPTIONAL = new Set(["Homes with pets"]);
const OPTIONAL_EXTRAS = addOnTableRows("edmonton").filter(
  (row) => !NON_OPTIONAL.has(row.service) && !/travel fee/i.test(row.service),
);
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const TRAVEL_FEE = formatPrice(addOnFromPrice("standard", TRAVEL_FEE_KEY) ?? 0);
/* Post-construction carries its own travel-fee row in bk-config, larger than
   the home-cleaning one, which is why this page can no longer publish a single
   figure and call it the whole answer. Read the same way /terms/ reads it. */
const POST_CONSTRUCTION_TRAVEL_FEE = formatPrice(travelFee("post-construction") ?? 0);
const OVEN_FEE = formatPrice(addOnFromPrice("standard", "inside-oven") ?? 0);
const FRIDGE_FEE = formatPrice(addOnFromPrice("standard", "inside-fridge") ?? 0);
const CABINET_FEE = formatPrice(addOnFromPrice("standard", "inside-cabinets-kitchen-bathroom-only") ?? 0);

const STANDARD = standardTierRows();
const DEEP = deepCleanTierRows();
const MOVE = moveInOutTierRows();
const last = <T,>(rows: T[]) => rows[rows.length - 1];

/**
 * The questions a customer asks at the door, answered from policy.ts and
 * bk-config so the answer here is the answer the team gives. Feeds both the
 * visible accordion and the FAQPage JSON-LD.
 */
const FAQS = [
  {
    q: "What is the difference between a standard clean and a deep clean?",
    a: `A deep clean is the standard checklist plus the deep package: baseboards, doors, light switches, wall outlets and vent covers, cobwebs where there are any, and a detailed stovetop, grates and fridge top. Ceiling fans are not part of the package; the team dusts them on request, where a 3-step ladder reaches them safely. The package adds ${DEEP[0].packagePrice} to a 1-bedroom standard clean and ${last(DEEP).packagePrice} to a 5-bedroom, so a deep clean runs ${DEEP[0].price} to ${last(DEEP).price} against ${STANDARD[0].price} to ${last(STANDARD).price} for standard, before GST.`,
  },
  {
    q: "Is the inside of the oven included?",
    a: `Only on a move-in or move-out clean, where the inside of the oven, fridge, cabinets and drawers are part of the service. On a standard or deep clean the oven is an add-on at ${OVEN_FEE}, the fridge ${FRIDGE_FEE}, and inside cabinets ${CABINET_FEE} once they are empty, all before GST. Each is a tick-box in the booking form.`,
  },
  {
    q: "Is there a charge for pets?",
    a: `Yes, ${PET_FEE} per visit before GST, added when you tell us the home has pets. Hair, paw prints and nose marks on glass add time in every room. Litter boxes and animal waste stay outside what we handle.`,
  },
  {
    q: "Do you charge extra outside Edmonton or Calgary city limits?",
    a: `Inside the limits there is no trip fee. Outside them a ${TRAVEL_FEE} travel fee, before GST, is added per visit on a house clean, which covers St. Albert, Sherwood Park, Airdrie, Cochrane and the other surrounding towns. Post-construction cleaning is quoted from its own table and its travel fee is ${POST_CONSTRUCTION_TRAVEL_FEE}. Either way it shows on your quote before you book.`,
  },
  {
    q: "What is never included in a clean?",
    a: "Moving anything over 25 pounds, anything past the reach of a 3-step ladder, outdoor work including exterior windows, light bulbs and chandeliers, bodily fluids and litter boxes, mould remediation, pest removal, carpet steam cleaning, duct cleaning, plumbing, hoarding clean-outs, laundry and dishes. Heavy scrubbing of walls is a separate wall-washing package rather than an exclusion.",
  },
  {
    q: "What happens if something on the checklist was missed?",
    a: `Tell us within ${POLICY.guaranteeWindowHours} hours and we come back and re-clean what was missed at no charge. The guarantee is measured against the checklist for the service you booked, whether that is the standard, deep or move-out list.`,
  },
];

const MatrixCell = ({ level }: { level: MatrixLevel }) => {
  if (level === "yes") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <Check className="h-4 w-4 text-brand-gold" aria-hidden="true" />
        Included
      </span>
    );
  }
  if (level === "addon") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-accent">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add-on
      </span>
    );
  }
  /* Two rows used to say "Add-on" here and could not be bought that way:
     bk-config has no baseboard extra and no stovetop-detail extra at any price,
     on any service. Both are inside the Deep Cleaning package, so on a standard
     clean the package is the only route to them. "Add-on" pointed a customer at
     a tick-box that does not exist in the booking form. */
  if (level === "package") {
    return (
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <Plus className="h-4 w-4 text-brand-gold" aria-hidden="true" />
        Deep package
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-muted-foreground" aria-label="Not included">
      <Minus className="h-4 w-4" aria-hidden="true" />
      —
    </span>
  );
};

const FragmentGroup = ({
  section,
}: {
  section: { group: string; rows: readonly { item: string; standard: MatrixLevel; deep: MatrixLevel; move: MatrixLevel }[] };
}) => (
  <>
    <tr className="bg-secondary/50">
      <th scope="rowgroup" colSpan={4} className="px-5 py-2.5 text-left text-xs font-bold uppercase tracking-wide text-muted-foreground">
        {section.group}
      </th>
    </tr>
    {section.rows.map((row) => (
      <tr key={row.item} className="border-t border-border/60 transition-colors hover:bg-secondary/30">
        <th scope="row" className="px-5 py-3.5 text-left font-medium text-foreground">
          {row.item}
        </th>
        <td className="px-4 py-3.5 text-center">
          <MatrixCell level={row.standard} />
        </td>
        <td className="bg-brand-gold/5 px-4 py-3.5 text-center">
          <MatrixCell level={row.deep} />
        </td>
        <td className="px-4 py-3.5 text-center">
          <MatrixCell level={row.move} />
        </td>
      </tr>
    ))}
  </>
);

/**
 * One checklist per service. The title is an <h2>: these three lists are the
 * page, and a reader scanning headings should land on them by name.
 */
const CleaningTypeCard = ({
  icon: Icon,
  title,
  description,
  items,
  links,
  highlight = false,
  index = 0
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  items: { icon: LucideIcon; text: string }[];
  links: { to: string; label: string }[];
  highlight?: boolean;
  index?: number;
}) => (
  <div
    className={`group rounded-2xl border p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-2 ${index % 2 === 0 ? 'hover:translate-x-0.5' : 'hover:-translate-x-0.5'} hover:shadow-xl ${
      highlight
        ? 'bg-brand-navy text-white border-brand-navy hover:shadow-[#1a365d]/20'
        : 'bg-white border-border hover:border-primary hover:shadow-primary/10'
    }`}
    style={{ transformStyle: 'preserve-3d' }}
  >
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 ${
      highlight ? 'bg-white/10' : 'bg-primary/10 group-hover:bg-primary/20'
    }`}>
      <Icon className={`w-7 h-7 transition-transform duration-300 group-hover:rotate-12 ${
        highlight ? 'text-accent' : 'text-primary'
      }`} />
    </div>
    <h2 className="text-xl font-bold mb-2 transition-transform duration-300 group-hover:translate-x-1">{title}</h2>
    <p className={`text-sm mb-6 leading-relaxed ${highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
      {description}
    </p>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
            highlight ? 'bg-accent/20' : 'bg-primary/10'
          }`}>
            <item.icon className={`w-3.5 h-3.5 ${highlight ? 'text-accent' : 'text-primary'}`} />
          </div>
          <span className={`text-sm leading-relaxed ${highlight ? 'text-white/90' : 'text-foreground'}`}>
            {item.text}
          </span>
        </li>
      ))}
    </ul>
    <p className={`mt-6 text-sm ${highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
      Priced by home size:{" "}
      {links.map((link, idx) => (
        <span key={link.to}>
          <Link to={link.to} className={`underline underline-offset-2 ${highlight ? 'text-accent' : 'text-primary'}`}>
            {link.label}
          </Link>
          {idx < links.length - 1 ? " and " : "."}
        </span>
      ))}
    </p>
  </div>
);

// Room cleaning item component
const RoomItem = ({
  icon: Icon,
  title,
  items
}: {
  icon: LucideIcon;
  title: string;
  items: string[]
}) => (
  <div className="bg-white rounded-xl border border-border p-5 transition-all duration-300 hover:border-primary/30 hover:shadow-md">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
    <ul className="space-y-2">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Extra service badge — every add-on is a row on the Edmonton price list, so
// the name links there. The price sits beside the link rather than inside it,
// so the anchor says what the destination is and nothing else.
const ExtraBadge = ({
  icon: Icon,
  service,
  price
}: {
  icon: LucideIcon;
  service: string;
  price: string
}) => (
  <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-border hover:border-accent hover:shadow-sm transition-all">
    <Icon className="w-5 h-5 text-accent" aria-hidden="true" />
    <span className="text-sm font-medium">
      <Link to="/pricing/" className="underline underline-offset-2 hover:text-primary">
        {service}
      </Link>
      {" — "}
      {price}
    </span>
  </div>
);

// Exclusion item
const ExclusionItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 py-2 break-inside-avoid">
    <XCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
    <span className="text-sm text-muted-foreground">{text}</span>
  </li>
);

const TITLE = "House Cleaning Checklist: Edmonton & Calgary | Duty Cleaners";
const DESCRIPTION =
  "What is included in a standard, deep and move-out clean in Edmonton and Calgary: a room-by-room checklist, add-on prices and what we never do.";

export default function WhatsIncluded() {
  const { pathname } = useLocation();
  const cityProof = cityProofFor(pathname);
  const standardItems = [
    { icon: Sparkles, text: "Dust and wipe all surfaces and furniture" },
    { icon: Droplets, text: "Vacuum and mop all floors and carpets" },
    { icon: SprayCan, text: "Clean countertops, sinks and mirrors" },
    { icon: DoorOpen, text: "Bathrooms scrubbed, appliance and cabinet exteriors wiped, inside and outside the microwave" },
  ];

  const deepItems = [
    { icon: Check, text: "Everything on the standard checklist" },
    { icon: Paintbrush, text: "Baseboards, doors, light switches, wall outlets and vent covers" },
    { icon: Refrigerator, text: "Detailed stovetop, grates and fridge top; inside the oven and fridge stay add-ons" },
  ];

  const moveOutItems = [
    { icon: Paintbrush, text: "Baseboards, doors, light switches, wall outlets and vent covers" },
    { icon: Refrigerator, text: "Inside all appliances: oven, microwave and fridge" },
    { icon: DoorOpen, text: "Inside all drawers, cabinets and closets, plus window sills" },
    { icon: Home, text: "Behind the oven and fridge, if they are pulled out before we arrive" },
  ];

  const bathroomItems = [
    "Scrub toilets, tubs and showers",
    "Clean mirrors, countertops and vanities",
    "Remove soap scum from tiles and glass",
    "Wipe the outside of the cabinets",
  ];

  const kitchenItems = [
    "Clean countertops, stovetop and sink",
    "Wipe the outside of every appliance",
    "Inside and outside the microwave",
    "Clean the splashback and cabinet fronts",
  ];

  const livingItems = [
    "Dust all surfaces, shelves and decor",
    "Vacuum carpets and rugs",
    "Mop hard floors",
    "Dust furniture and window sills",
  ];

  const bedroomItems = [
    "Dust all surfaces and furniture",
    "Vacuum floors and under beds",
    "Clean mirrors",
  ];

  /**
   * Read from policy.ts rather than authored here. This page is the document
   * both sides reach for in a doorstep disagreement, and it used to contradict
   * itself twice in the same section:
   *
   *  - "Heavy wall or door scrubbing" sat in the exclusions while the table
   *    directly above offered "Wall washing" as an add-on, and the site sells
   *    dedicated wall-washing services. It is not refused, it is a separate
   *    package — the list now says so.
   *  - "Chandelier cleaning (we can attempt if safely reachable, but not a
   *    specialized service)" was an exclusion that said it was not an exclusion.
   *    Chandeliers now sit unambiguously with fragile lighting fixtures.
   */
  const exclusions = NOT_INCLUDED;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/whats-included/" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/whats-included/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        {/* Mirrors the accordion at the foot of the page; the answers are in
            the DOM whether or not a visitor opens them. */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: { "@type": "Answer", text: faq.a },
            })),
          })}
        </script>
      </Helmet>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section - Dark Navy */}
      <section className="relative text-white overflow-hidden">
        {/* Background image */}
        <img width={1280} height={720}
          src={heroBg}
          alt="Sunlit living room with a white sofa and armchairs, a glass coffee table and wood floors"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
         loading="eager" fetchPriority="high"/>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-brand-navy/80" />
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>The checklist the team works to</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              What's Included in{" "}<br />
              Your <span className="text-accent">House Cleaning</span>
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              We work to a checklist, not a clock. Here is that checklist for Edmonton and
              Calgary: what a standard, deep and move-out clean covers, what is an add-on with
              its price, and what we do not do.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-6" asChild>
                <a href={quoteHrefFor(pathname)}>
                  <Calculator className="mr-2 w-5 h-5" />
                  See My Instant Price
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                <a href={CITY_PROOF.edmonton.phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />
                  Edmonton {CITY_PROOF.edmonton.phone}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                <a href={CITY_PROOF.calgary.phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />
                  Calgary {CITY_PROOF.calgary.phone}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Cleaning Types Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Three services</span>
            <p className="text-3xl md:text-4xl font-bold mt-2">One checklist per service</p>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Each list builds on the one before it. Deep adds to standard; move-out adds to
              deep. Nothing is taken away as you go up. Each from-price is for a 1-bedroom,
              1-bathroom apartment or condo, before 5% GST; a larger home type, pets or an address
              outside city limits add to it.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <CleaningTypeCard
              icon={Sparkles}
              title="Standard cleaning checklist"
              description={`The one-time or recurring clean, from ${STANDARD[0].price} for a 1-bedroom home before GST. Book it weekly, bi-weekly or every 4 weeks and the recurring discount applies from the second visit.`}
              items={standardItems}
              links={[
                { to: "/edmonton/regular-cleaning/", label: "standard cleaning in Edmonton" },
                { to: "/calgary/regular-cleaning/", label: "standard cleaning in Calgary" },
              ]}
              index={0}
            />
            <CleaningTypeCard
              icon={Home}
              title="Deep cleaning checklist"
              description={`The standard checklist plus the deep package, from ${DEEP[0].price} for a 1-bedroom home before GST. The right first clean for a home that has not been professionally cleaned in a while.`}
              items={deepItems}
              links={[
                { to: "/edmonton/deep-cleaning/", label: "deep cleaning in Edmonton" },
                { to: "/calgary/deep-cleaning/", label: "deep cleaning in Calgary" },
              ]}
              highlight={true}
              index={1}
            />
            <CleaningTypeCard
              icon={Truck}
              title="Move-out cleaning checklist"
              description={`The home is cleaned empty, to the standard a move-out inspection looks for, from ${MOVE[0].price} for a 1-bedroom home before GST. The same list applies to a move-in.`}
              items={moveOutItems}
              links={[
                { to: "/move-out-cleaning-edmonton/", label: "move-out cleaning in Edmonton" },
                { to: "/move-out-cleaning-calgary/", label: "move-out cleaning in Calgary" },
              ]}
              index={2}
            />
          </div>
        </div>
      </section>

      {/* Service Comparison Matrix */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Compare</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Side-by-side checklist: standard, deep and move-out</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Included, add-on or not offered, for each of the three services.
            </p>
          </div>

          <div
            className="max-w-4xl mx-auto overflow-x-auto rounded-2xl border border-border shadow-sm"
            tabIndex={0}
            role="region"
            aria-label="What is included comparison table"
          >
            <table className="w-full min-w-[640px] border-collapse bg-white text-sm">
              <thead>
                <tr className="bg-brand-navy text-brand-navy-foreground">
                  <th scope="col" className="px-5 py-4 text-left font-semibold">What's included</th>
                  <th scope="col" className="px-4 py-4 text-center font-semibold">Standard</th>
                  {/* A "Most popular" badge sat here; no booking figure backs it. */}
                  <th scope="col" className="px-4 py-4 text-center font-semibold">Deep</th>
                  <th scope="col" className="px-4 py-4 text-center font-semibold">Move In/Out</th>
                </tr>
              </thead>
              <tbody>
                {([
                  {
                    group: "Always included",
                    rows: [
                      { item: "Dust all accessible surfaces & furniture", standard: "yes", deep: "yes", move: "yes" },
                      { item: "Vacuum & mop all floors", standard: "yes", deep: "yes", move: "yes" },
                      { item: "Kitchen counters, sink & appliance exteriors", standard: "yes", deep: "yes", move: "yes" },
                      { item: "Bathrooms scrubbed & wiped down", standard: "yes", deep: "yes", move: "yes" },
                      { item: "Inside & outside microwave", standard: "yes", deep: "yes", move: "yes" },
                    ],
                  },
                  {
                    group: "Deeper attention",
                    rows: [
                      { item: "Baseboards, doors, light switches, wall outlets & vent covers", standard: "package", deep: "yes", move: "yes" },
                      { item: "Detailed stovetop, grates & fridge top", standard: "package", deep: "yes", move: "yes" },
                    ],
                  },
                  {
                    group: "Move-ready extras",
                    rows: [
                      { item: "Inside oven & fridge", standard: "addon", deep: "addon", move: "yes" },
                      { item: "Inside all drawers & cabinets", standard: "no", deep: "no", move: "yes" },
                      { item: "Inside closets & window sills", standard: "no", deep: "no", move: "yes" },
                      { item: "Wall washing", standard: "addon", deep: "addon", move: "addon" },
                    ],
                  },
                ] as const).map((section) => (
                  <FragmentGroup key={section.group} section={section} />
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            {/* "Just mention them when booking" implied a conversation and hid
                that every add-on has a price. They are tick-boxes in the form,
                and the total updates as you tick them. */}
            Every add-on is a tick-box in the booking form, with its price beside it. The total
            updates as you choose, so you see it before you commit.
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-center text-xs text-muted-foreground">
            Two rows say "Deep package" rather than "Add-on" because there is no tick-box for them:
            baseboards and the detailed stovetop are sold only inside the Deep Cleaning package,
            which adds {DEEP[0].packagePrice} to a 1-bedroom standard clean and{" "}
            {last(DEEP).packagePrice} to a 5-bedroom, before GST.
          </p>
        </div>
      </section>

      {/* Room by Room Breakdown */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Room by Room</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Room-by-room checklist</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              What the standard checklist covers in each room. Deep and move-out add to it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <RoomItem icon={Bath} title="Bathrooms" items={bathroomItems} />
            <RoomItem icon={Utensils} title="Kitchen" items={kitchenItems} />
            <RoomItem icon={Sofa} title="Living Areas" items={livingItems} />
            <RoomItem icon={BedDouble} title="Bedrooms" items={bedroomItems} />
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Extras</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Add-ons not included in the base price</h2>
            <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
              Add any of these to a standard or deep clean. Prices are per visit, before 5% GST,
              and every one is shown in the booking form before you commit.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
            {/* Was seven hand-typed badges while the pricing pages published
                twelve extras read from BookingKoala — the list left out inside
                oven, inside fridge and inside cabinets, which are the three
                customers ask about most. Same source now, so the two pages
                cannot disagree, and each badge carries its price. */}
            {OPTIONAL_EXTRAS.map((row) => (
              <ExtraBadge key={row.service} icon={Sparkles} service={row.service} price={row.standard} />
            ))}
          </div>

          <p className="text-muted-foreground text-sm mt-6 max-w-2xl mx-auto text-center">
            Several of these scale with home size, which is why they read "from". The figure for
            your home is on{" "}
            <Link to="/pricing/" className="text-primary underline underline-offset-2">
              the full Edmonton price list
            </Link>{" "}
            and{" "}
            <Link to="/calgary/pricing/" className="text-primary underline underline-offset-2">
              Calgary house cleaning prices by home size
            </Link>
            .
          </p>

          {/* These charges are not optional, so they cannot sit in a list headed
              "add any of these". A pet owner cannot decline the pet charge. The
              line used to name one travel fee and call the list complete;
              bk-config holds two, and post-construction carries the larger. */}
          <p className="text-muted-foreground text-sm mt-4 max-w-2xl mx-auto text-center">
            Some charges are not a choice and are added for you. A home with pets is {PET_FEE} a
            visit. A bungalow, basement suite, townhouse or two-storey house adds a home-type
            surcharge to the apartment-or-condo price. An address outside Edmonton or Calgary city
            limits carries a travel fee per visit:{" "}
            {TRAVEL_FEE} on a house clean, and {POST_CONSTRUCTION_TRAVEL_FEE} on{" "}
            <Link to="/post-construction-cleaning/" className="text-primary underline underline-offset-2">
              post-construction cleaning in Edmonton
            </Link>
            , which is quoted from its own table. All of them show on your quote before you book.
          </p>
        </div>
      </section>

      {/* What's Not Included */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-muted-foreground font-semibold text-sm uppercase tracking-wide">Good to Know</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">What's Not Included</h2>
              <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                These sit outside every service, for safety or because they need different
                equipment. Heavy scrubbing of walls is sold separately as{" "}
                <Link to="/wall-washing-wall-cleaning/" className="text-primary underline underline-offset-2">
                  wall washing in Edmonton
                </Link>{" "}
                and{" "}
                <Link to="/wall-washing-wall-cleaning-calgary/" className="text-primary underline underline-offset-2">
                  wall washing in Calgary
                </Link>
                .
              </p>
            </div>

            <div className="bg-secondary/30 rounded-2xl p-6 md:p-8">
              <ul className="md:columns-2 md:gap-x-8">
                {exclusions.map((item, idx) => (
                  <ExclusionItem key={idx} text={item} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Questions</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Checklist questions, answered</h2>
            </div>
            <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-white px-6">
              {FAQS.map((faq, index) => (
                <AccordionItem key={faq.q} value={`faq-${index}`} className="border-border/60">
                  <AccordionTrigger className="text-left text-base font-semibold text-foreground hover:text-primary">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-brand-navy text-white overflow-hidden py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Star className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Price this checklist for your home
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Answer a few questions about the home and the price is on screen in about a minute.
              Rated {RATING_CLAIM}; you can{" "}
              <Link to="/reviews/" className="text-accent underline underline-offset-2">
                read the reviews
              </Link>{" "}
              first, or see{" "}
              <Link to="/services/" className="text-accent underline underline-offset-2">
                all Edmonton cleaning services and prices
              </Link>{" "}
              and{" "}
              <Link to="/calgary/services/" className="text-accent underline underline-offset-2">
                every Calgary cleaning service, with starting prices
              </Link>
              .
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-8" asChild>
                {/* The line above promises an instant quote and no phone call;
                    this used to open the 24-hour contact inbox. */}
                <a href={quoteHrefFor(pathname)}>
                  <Calculator className="mr-2 w-5 h-5" />
                  See My Instant Price
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-8" asChild>
                <a href={cityProof.phoneLink}>
                  <Phone className="mr-2 w-5 h-5" />{cityProof.phone}</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Satisfaction Guarantee */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-6">
              <Star className="w-8 h-8 text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The 24-hour re-clean guarantee</h2>
            <p className="text-muted-foreground text-lg mb-2">
              Each service's checklist is what the guarantee is measured against.
            </p>
            <p className="text-muted-foreground mb-8">
              If something on it was missed, tell us within {POLICY.guaranteeWindowHours} hours of the
              clean and we come back and re-clean it at no additional charge.{" "}
              <Link to="/satisfaction-guarantee/" className="text-primary underline underline-offset-2">
                The guarantee
              </Link>{" "}
              sets out exactly what that covers, and a clean bought as a{" "}
              <Link to="/gift-card/" className="text-primary underline underline-offset-2">
                gift card
              </Link>{" "}
              is covered the same way.
            </p>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about-us/">Learn More About Us</Link>
            </Button>
          </div>
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
