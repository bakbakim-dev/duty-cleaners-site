import { addOnFromPrice, formatPrice } from "@/data/pricing";
import { addOnTableRows, TRAVEL_FEE_KEY } from "@/data/addon-table";
import { useLocation } from "react-router-dom";
import { cityProofFor } from "@/data/proof";
import { quoteHrefFor } from "@/lib/quote-link";
import Navigation from "@/components/Navigation";
import { NOT_INCLUDED } from "@/data/policy";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import heroBg from "@/assets/whats-included-hero.webp";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  Sparkles, 
  Home, 
  HardHat, 
  Truck, 
  Star, 
  Phone, 
  Calculator,
  SprayCan,
  Refrigerator,
  Microwave,
  Fan,
  DoorOpen,
  Lightbulb,
  Blinds,
  Paintbrush,
  Warehouse,
  Bath,
  Utensils,
  BedDouble,
  Sofa,
  CircleOff,
  ShieldX,
  Bug,
  Weight,
  ArrowUpFromLine,
  Droplets,
  Wind,
  Wrench,
  AlertTriangle,
  LucideIcon,
  CheckCircle2,
  XCircle,
  Check,
  Plus,
  Minus
} from "lucide-react";

// Cleaning service card component
type MatrixLevel = "yes" | "addon" | "no";

/** The pricing pages publish the same rows from the same BookingKoala data.
 *  The last two are charges rather than choices, so they are split out. */
const NON_OPTIONAL = new Set(["Homes with pets"]);
const OPTIONAL_EXTRAS = addOnTableRows("edmonton").filter(
  (row) => !NON_OPTIONAL.has(row.service) && !/travel fee/i.test(row.service),
);
const PET_FEE = formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0);
const TRAVEL_FEE = formatPrice(addOnFromPrice("standard", TRAVEL_FEE_KEY) ?? 0);

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

const CleaningTypeCard = ({
  icon: Icon,
  title,
  description,
  items,
  highlight = false,
  index = 0
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  items: { icon: LucideIcon; text: string }[];
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
    <h3 className="text-xl font-bold mb-2 transition-transform duration-300 group-hover:translate-x-1">{title}</h3>
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

// Extra service badge
const ExtraBadge = ({ 
  icon: Icon, 
  text 
}: { 
  icon: LucideIcon; 
  text: string 
}) => (
  <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-lg border border-border hover:border-accent hover:shadow-sm transition-all">
    <Icon className="w-5 h-5 text-accent" />
    <span className="text-sm font-medium">{text}</span>
  </div>
);

// Exclusion item
const ExclusionItem = ({ text }: { text: string }) => (
  <li className="flex items-start gap-3 py-2 break-inside-avoid">
    <XCircle className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
    <span className="text-sm text-muted-foreground">{text}</span>
  </li>
);

export default function WhatsIncluded() {
  const { pathname } = useLocation();
  const cityProof = cityProofFor(pathname);
  const standardItems = [
    { icon: Sparkles, text: "Wipe down & dust all surfaces and furniture" },
    { icon: Droplets, text: "Vacuum and mop all floors and carpets" },
    { icon: SprayCan, text: "Clean countertops, sinks, and mirrors" },
    { icon: DoorOpen, text: "Clean bathrooms and outside appliances and cabinets, inside and outside the microwave" },
  ];

  const deepItems = [
    { icon: Fan, text: "Clean ceiling fan blades" },
    { icon: DoorOpen, text: "Kitchen cleaned (counters, sink, appliance exteriors, cabinet exteriors, and inside and outside of the microwave ONLY)" },
    { icon: Paintbrush, text: "Baseboards, doors, light switches, wall outlets, and outside vent covers" },
    { icon: Refrigerator, text: "Detailed stovetop, grates, and fridge top cleaning" },
  ];

  const moveOutItems = [
    { icon: Paintbrush, text: "Baseboards, doors, light switches, wall outlets, and outside vent covers" },
    { icon: Refrigerator, text: "Inside all appliances (oven, microwave, and fridge)" },
    { icon: DoorOpen, text: "Inside all drawers and cabinets" },
    { icon: Home, text: "Behind oven and fridge (if pre-pulled out)" },
  ];

  const bathroomItems = [
    "Scrub and sanitize toilets, tubs, and showers",
    "Clean mirrors, countertops, and vanities",
    "Remove soap scum from tiles and glass",
    "Wipe down outside the cabinets",
  ];

  const kitchenItems = [
    "Clean countertops, stovetop, and sink",
    "Wipe down all exterior appliances",
    "Inside and outside microwave",
    "Clean splashback and cabinet fronts",
  ];

  const livingItems = [
    "Dust all surfaces, shelves, and decor",
    "Vacuum carpets and rugs thoroughly",
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
        <title>What's Included | Duty Cleaners Cleaning Checklist</title>
        <meta name="description" content="See exactly what's included in a standard, deep and move-in/out clean with Duty Cleaners in Edmonton and Calgary. Room-by-room checklist." />
        <link rel="canonical" href="https://dutycleaners.ca/whats-included/" />
        <meta property="og:title" content="What's Included | Duty Cleaners Cleaning Checklist" />
        <meta property="og:description" content="See exactly what's included in a standard, deep and move-in/out clean with Duty Cleaners in Edmonton and Calgary. Room-by-room checklist." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/whats-included/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="What's Included | Duty Cleaners Cleaning Checklist" />
        <meta name="twitter:description" content="See exactly what's included in a standard, deep and move-in/out clean with Duty Cleaners in Edmonton and Calgary. Room-by-room checklist." />
      </Helmet>
      <Navigation />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>
      
      {/* Hero Section - Dark Navy */}
      <section className="relative text-white overflow-hidden">
        {/* Background image */}
        <img width={1920} height={1080}
          src={heroBg}
          alt="Freshly cleaned open-plan living space covered by the standard checklist"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-brand-navy/80" />
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 py-16 md:py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span>Professional Cleaning Standards</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              What's Included in{" "}<br />
              Your <span className="text-accent">Cleaning</span>
            </h1>

            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
              We adhere to a strict checklist to guarantee the highest quality clean. 
              Every room, every surface, every time.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-white h-12 px-6" asChild>
                <a href="#quote">
                  <Calculator className="mr-2 w-5 h-5" />
                  See My Instant Price
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12 px-6" asChild>
                <a href="tel:7809136565">
                  <Phone className="mr-2 w-5 h-5" />
                  (780) 913-6565
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
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Our Services</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Choose Your Perfect Clean</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Whether you need regular maintenance or a thorough deep clean, we have the perfect service for your home.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <CleaningTypeCard
              icon={Sparkles}
              title="Standard Cleaning"
              description="Perfect for one-time or regularly maintained homes. Keeps your space fresh, clean, and tidy with weekly, bi-weekly, or monthly service options."
              items={standardItems}
              index={0}
            />
            <CleaningTypeCard
              icon={Home}
              title="Deep Cleaning"
              description="Thorough top-to-bottom cleaning that covers all reachable areas. Includes everything in the standard package, plus more."
              items={deepItems}
              highlight={true}
              index={1}
            />
            <CleaningTypeCard
              icon={Truck}
              title="Move In/Out Clean"
              description="Cleaned to the standard a move-out inspection looks for. Our most thorough service."
              items={moveOutItems}
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
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Side-by-Side Service Comparison</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              See exactly what each cleaning package covers — clear scope, no guesswork.
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
                  <th scope="col" className="px-4 py-4 text-center font-semibold">
                    Deep
                    <span className="ml-2 rounded-full bg-brand-gold px-2.5 py-0.5 text-sm font-bold text-brand-navy">Most popular</span>
                  </th>
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
                      { item: "Bathrooms scrubbed & sanitized", standard: "yes", deep: "yes", move: "yes" },
                      { item: "Inside & outside microwave", standard: "yes", deep: "yes", move: "yes" },
                    ],
                  },
                  {
                    group: "Deeper attention",
                    rows: [
                      { item: "Baseboards, doors, light switches, wall outlets & vent covers", standard: "addon", deep: "yes", move: "yes" },
                      { item: "Ceiling fan blades (safely reachable)", standard: "no", deep: "yes", move: "yes" },
                      { item: "Detailed stovetop, grates & fridge top", standard: "addon", deep: "yes", move: "yes" },
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
        </div>
      </section>

      {/* Room by Room Breakdown */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">Room by Room</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">What We Clean in Each Space</h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              Every room gets special attention with our detailed cleaning approach.
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
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Available Add-Ons</h2>
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
              <ExtraBadge key={row.service} icon={Sparkles} text={`${row.service} — ${row.standard}`} />
            ))}
          </div>

          {/* Two charges are not optional, so they cannot sit in a list headed
              "add any of these". A pet owner cannot decline the pet charge. */}
          <p className="text-muted-foreground text-sm mt-8 max-w-2xl mx-auto text-center">
            Two charges are not optional and are added for you: {PET_FEE} per visit for a home with
            pets, and {TRAVEL_FEE} for an address outside Edmonton or Calgary city limits. Both show on
            your quote before you book.
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
                For safety and quality reasons, certain tasks are outside our standard services. 
                Have a special request? Just ask!
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

      {/* CTA Section */}
      <section className="relative bg-brand-navy text-white overflow-hidden py-16">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <Star className="w-12 h-12 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for a Spotless Home?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Get an instant quote in 60 seconds. No phone call required.
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">100% Satisfaction Guarantee</h2>
            <p className="text-muted-foreground text-lg mb-2">
              Every clean is backed by our 24-hour make-it-right promise.
            </p>
            <p className="text-muted-foreground mb-8">
              We stand behind the quality of our staff. If you're not 100% satisfied with your cleaning,
              let us know within 24 hours after the cleaning and we'll come back to re-clean at no additional charge.
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
