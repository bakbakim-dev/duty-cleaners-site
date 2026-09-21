import { getListing } from "@/lib/google-listings";
import Stars from "@/components/Stars";
import { withTrailingSlash } from "@/data/legacy-urls";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { addOnMaxPrice, addOnFromPrice, addOnsFor, bedroomOptions, formatPrice, standardTierRows } from "@/data/pricing";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Star, Shield, Droplets, Home, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { Picture } from "vite-imagetools";
import ResponsiveImage, { SIZES } from "@/components/ResponsiveImage";
import cleanWallsPhoto from "@/assets/gallery/clean-walls-edmonton.webp?col";
import kitchenGrease from "@/assets/wall-washing/kitchen-grease.webp?card";
import dirtyWallBefore from "@/assets/wall-washing/dirty-wall-before.webp?card";
import stainCloseup from "@/assets/wall-washing/stain-closeup.webp?card";
import { Helmet } from "react-helmet-async";
import CityCrossLink from "@/components/CityCrossLink";
import { CITY_PROOF, EDMONTON_RATING_CLAIM, hoursRowsFor } from "@/data/proof";

const AnimatedSection = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
};

/* A picture and its caption. It links nowhere, so it does not lift or zoom on
   hover. */
const ResultCard = ({ src, caption }: { src: Picture; caption: string }) => (
  <figure className="rounded-xl overflow-hidden border border-border bg-white">
    <div className="aspect-[4/3] overflow-hidden">
      <ResponsiveImage
        picture={src}
        sizes={"(min-width: 640px) 33vw, 100vw"}
        alt={caption}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
    <figcaption className="p-4 text-sm font-medium text-foreground">{caption}</figcaption>
  </figure>
);

const edmontonLocations = [
  { name: "St. Albert", path: "/cleaning-services-st-albert" },
  { name: "Sherwood Park", path: "/cleaning-services-sherwood-park" },
  { name: "Spruce Grove", path: "/cleaning-services-spruce-grove" },
  { name: "Stony Plain", path: "/cleaning-services-stony-plain" },
  { name: "Leduc", path: "/cleaning-services-leduc" },
  { name: "Beaumont", path: "/cleaning-services-beaumont" },
  { name: "Fort Saskatchewan", path: "/cleaning-services-fort-saskatchewan" },
  { name: "Devon", path: "/cleaning-services-devon" },
  { name: "Morinville", path: "/cleaning-services-morinville" },
];

const wallProblems = [
  { title: "Furnace dust film", description: "The grey deposit above every register and along the ceiling line that a duster only spreads." },
  { title: "Cooking film", description: "The sticky layer that spreads past the backsplash onto the surrounding wall and holds whatever lands on it." },
  { title: "Handprints & scuffs", description: "Around switches, along hallways and up the stairwell, where hands and bags touch the wall." },
  { title: "Salt & grit at the entry", description: "Grit and salt marks on the wall beside the door and along the stairwell." },
  { title: "Nicotine & smoke residue", description: "Yellow tar film that dulls the paint. It fades with washing; full removal is not promised." },
  { title: "Light surface mildew", description: "Wiped off painted bathroom walls where it is safe to. Mould that has gone into the drywall is remediation work, which the team does not do." },
];

const includedItems = [
  { title: "Full wall wash", description: "Every painted wall in the rooms you book, washed top to bottom." },
  { title: "Spot treatment for grime & gentle mildew", description: "Built-up grime around switches and door frames, and light surface mildew on bathroom walls where the paint allows it." },
  { title: "Paint-ready wall cleaning", description: "Dust, residue and film taken off so primer and paint go onto a clean wall." },
];

/* The last step used to promise a walkthrough "with you before we leave".
   Most customers are not home (content prompt T5), so it now says what is
   true for all of them. */
const steps = [
  { title: "Tick it on the booking form", description: "Choose the clean first, then add spot cleaning or the full wash for your home size. The price shows before you book." },
  { title: "We assess the walls", description: "On arrival the team checks the paint finish in each room. Flat or delicate finishes may need limited treatment or may not be washable." },
  { title: "We wash the walls", description: "By hand, top to bottom, with products suited to painted surfaces. Marks are worked on first, then the whole wall." },
  { title: "Locked up, then paid", description: "You do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and the team locks up. The card is charged once the clean is complete." },
];

const whyUs = [
  { icon: Shield, title: "What the paint allows", description: "Very flat or delicate paint limits how hard a mark can be worked, and some stains only fade." },
  { icon: Home, title: "When to book it", description: "Before painting, after a tenant moves out, or with a move-out clean." },
  { icon: Droplets, title: "What the team leaves alone", description: "Wallpaper, bare drywall and unpainted wood are not washed, and nothing is reached from higher than a 3-step ladder." },
  { icon: ThumbsUp, title: `${POLICY.guaranteeWindowHours}-hour re-clean`, description: `Tell us within ${POLICY.guaranteeWindowHours} hours about a wall or a mark we missed and we come back to it at no charge.` },
  /* This card repeated the rating the hero badge and the reviews heading
     already give, a third time. It now carries R2 from the content prompt. */
  { icon: Star, title: "Rated after every visit", description: "Every cleaner is reference-checked before a first job and rated by the customer after each visit, and the ratings decide who we keep sending." },
];

/*
  Answers 1 to 4 and 6 were legacy filler — "we use safe cleaning methods
  suitable for most interior painted surfaces", "can be significantly improved
  or removed depending on severity", "our team can carefully work around
  furniture when needed", and a ceilings answer whose middle sentence began
  "Please note". None of them told a customer what would happen in their house,
  and all of them shipped inside FAQPage JSON-LD. They now say which marks come
  off, which fade, and what the crew will not touch.
*/
const faqs = [
  { q: "Can all wall stains be removed?", a: "No. Surface film and marks may lighten or come off, but stains held in paint or drywall can remain. Results depend on the mark, finish and condition. The team assesses the walls before washing; wall cleaning does not include repainting or repairs." },
  { q: "Do you clean all types of painted walls?", a: "Not every finish is suitable. The team assesses painted walls first, and delicate, damaged or flat finishes may need limited treatment or may not be washable. Wallpaper, bare drywall and unpainted wood are not washed. Tell us about the finish and any care instructions before booking." },
  { q: "Do you remove mould from walls?", a: "Light surface mildew on a painted wall, yes: the spots that come up in a bathroom after a winter of shut windows. Mould that has gone into the drywall or behind it, no. Washing the face of that hides it and fixes nothing, so if the crew finds it they stop, tell you, and leave it for a remediation contractor." },
  { q: "Do I need to move furniture?", a: "Only what you want the wall behind. The crew washes as far as it can reach without dragging furniture about, and it does not move anything over 25 pounds. Pictures, mirrors and shelves are worth taking down the night before: the wall under them is the cleanest part of the room, and the outline shows once the rest is washed." },
  { q: "Do you offer wall cleaning for rentals or move-outs?", a: `Yes. Wall washing is an add-on on the move-out booking form, and it takes in the band of salt and grit beside an Edmonton entry. Book spot cleaning for the marks, from ${formatPrice(addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0)}, or the full wash for every wall in the rooms you choose, from ${formatPrice(addOnFromPrice("standard", "complete-inside-wall-washing") ?? 0)}, by home size and before GST.` },
  /* This answer used to offer a flat ceiling "for a charge agreed before the
     visit" and to say a smoke-stained ceiling "is normally replaced". Neither
     is on file; the ladder limit is (content prompt T7). */
  { q: "Do you clean ceilings in homes affected by smoke or nicotine?", a: `Ceilings are not part of wall washing, and the team works from nothing higher than a 3-step ladder. Smoke stain and smell can both survive a wash on the walls, so call the Edmonton office at ${CITY_PROOF.edmonton.phone} before booking to talk through a particular room.` },
  { q: "How much does wall washing cost in Edmonton?", a: `Spot cleaning runs ${formatPrice(addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0)} to ${formatPrice(addOnMaxPrice("standard", "spot-cleaning-inside-walls") ?? 0)} and a full wash ${formatPrice(addOnFromPrice("standard", "complete-inside-wall-washing") ?? 0)} to ${formatPrice(addOnMaxPrice("standard", "complete-inside-wall-washing") ?? 0)}, by home size and before 5% GST. Wall washing is booked together with a clean, so the bill also carries that clean, from ${standardTierRows()[0]?.price ?? ""} for a one-bedroom apartment. A home with pets adds a compulsory ${formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0)} a visit, a bungalow, basement suite, townhouse or two-storey house costs more than an apartment, and an address outside Edmonton city limits adds a ${formatPrice(travelFee("standard") ?? 0)} travel fee; each shows on the quote before you book.` },
];

/** Cheapest bookable wall service, derived from bk-config — never typed. */
const WALL_FROM = addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0;
const WALL_FULL = addOnFromPrice("standard", "complete-inside-wall-washing") ?? 0;
/** These pages are the site's highest click-efficiency content and stated no
 *  price at all, so neither a shopper nor an AI assistant could name one.
 *  Both figures are derived from bk-config, never typed. */
/** Both extras have seven rows in BookingKoala, one per home size, so a single
 *  figure called a "flat rate" understated the large end by up to $115. */
const WALL_SPOT_MAX = addOnMaxPrice("standard", "spot-cleaning-inside-walls") ?? 0;
const WALL_FULL_MAX = addOnMaxPrice("standard", "complete-inside-wall-washing") ?? 0;

/** BookingKoala writes "800sqft"; the figure is the fact, the spacing is ours. */
const sizeLabel = (label: string) => label.replace(/(\d)\s*sqft/gi, (_match, digit) => `${digit} sq ft`);

/**
 * Both wall extras at every size bk-config prices them at — seven rows, not the
 * five the home-cleaning tables use.
 *
 * The hero quotes the top of each range, and those two figures ($109.99 and
 * $234.99) live in the sixth and seventh rows. Built off PRICING_TIERS the
 * table stopped at a "5 Bedroom" row of $89.99 / $194.99, so the hero appeared
 * to quote prices the page never showed, and the "+" in that label promised the
 * six- and seven-bedroom homes a rate they are not charged.
 */
const WALL_ROWS = bedroomOptions("standard").map((bedroom) => {
  const addOns = addOnsFor("standard", bedroom.id);
  const spot = addOns.find((a) => a.id === "spot-cleaning-inside-walls")?.price;
  const full = addOns.find((a) => a.id === "complete-inside-wall-washing")?.price;
  return {
    beds: sizeLabel(bedroom.label),
    spot: spot === undefined ? "" : formatPrice(spot),
    full: full === undefined ? "" : formatPrice(full),
  };
});
/** The cheapest clean a wall add-on can ride on. */
const STANDARD_FROM = standardTierRows()[0]?.price ?? "";

/** The compulsory charge on the clean a wall add-on rides on (content prompt P10). */
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");
const PET_LINE = PET_FEE === null ? "a pet charge" : `${formatPrice(PET_FEE)} a visit`;
const TRAVEL_LINE = formatPrice(travelFee("standard") ?? 0);
const PROOF = CITY_PROOF.edmonton;

const PAGE_TITLE = "Wall Washing Add-On Edmonton | Duty Cleaners";
const META_DESCRIPTION = `Wall washing in Edmonton from ${formatPrice(WALL_FROM)} before GST, by home size: handprints and cooking film off painted walls, with a standard or move-out clean.`;

export default function WallWashingEdmonton() {

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/wall-washing-wall-cleaning/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/wall-washing-wall-cleaning/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        {/* Mirrors the FAQ rendered on this page. Generated from the same
            `faqs` array, so the markup can never drift from the copy. */}
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
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({ name: "Wall Washing and Wall Cleaning", description: META_DESCRIPTION, path: "/wall-washing-wall-cleaning", city: "edmonton", offerFrom: WALL_FROM, offerTo: WALL_FULL_MAX, offerNote: "Added to a standard, deep or move-out clean; not sold as a standalone visit." }))}
        </script>
      </Helmet>
      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 md:py-24 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              {/* One hero pattern: H1, one priced sentence, two buttons, the
                  rating. The paint-finish caveat and the three linked cleans
                  moved to the section directly below. */}
              <h1 className="display-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
                Wall Washing & Cleaning <span className="text-accent-on-dark">Edmonton</span>
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Wall washing is added to a clean: spot cleaning from {formatPrice(WALL_FROM)} and a full wash
                from {formatPrice(WALL_FULL)}, by home size, before 5% GST, paid after the clean.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                  <a href="#quote">
                    See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                  <a href="tel:7809136565">
                    <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                    (780) 913-6565
                  </a>
                </Button>
              </div>
              <p className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium text-white/90">
                <Star className="w-4 h-4 text-brand-gold fill-current" aria-hidden="true" />
                <span>{EDMONTON_RATING_CLAIM} across {PROOF.googleReviewCount} Edmonton reviews</span>
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <ResponsiveImage
                picture={cleanWallsPhoto}
                sizes={SIZES.half}
                alt="A bright room with white painted walls and a doorway"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
               loading="eager" fetchPriority="high"/>
            </div>
          </div>
        </div>
      </section>

      {/* What the hero used to carry: the paint-finish caveat, and the three
          cleans this add-on rides on. The three are linked on purpose, because
          the page cannot be booked without one of them. */}
      <section className="py-10 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Painted walls are washed by hand once the team has assessed the scuffs, handprints and cooking
              film against the paint finish. Some marks remain, and fragile finishes may need a lighter
              treatment.
            </p>
            <p>
              Wall washing is added to{" "}
              <Link to="/edmonton/regular-cleaning/" className="text-primary underline underline-offset-4">a standard clean</Link>,{" "}
              <Link to="/edmonton/deep-cleaning/" className="text-primary underline underline-offset-4">a deep clean</Link>{" "}
              or{" "}
              <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-4">a move-out clean</Link>{" "}
              rather than booked on its own. Spot cleaning runs {formatPrice(WALL_FROM)} to{" "}
              {formatPrice(WALL_SPOT_MAX)} and a full top-to-bottom wash {formatPrice(WALL_FULL)} to{" "}
              {formatPrice(WALL_FULL_MAX)}, by home size, before 5% GST. The booking form prices
              seven home sizes, and your own figure is on the quote before you book. The clean underneath
              has its own price and compulsory charges, which are set out with the price table further down.
            </p>
          </div>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Why Edmonton walls"
        heading="What actually ends up on a wall in Edmonton"
        paragraphs={[
          "Edmonton runs a long, unbroken heating season, and the furnace here simply runs, month after month, from October into April. Everything that cycles through the ducts in that time ends up somewhere, and a good deal of it ends up on the walls: a fine, even grey deposit above every register, along the ceiling line, and in the still air behind doors and furniture. It builds slowly, and it shows when a picture comes down.",
          "Closed-up houses concentrate the rest. Through furnace season the windows stay shut, so cooking vapour and pet dander recirculate. Kitchens take the worst of it — a sticky film spreads well past the backsplash onto the surrounding wall, and because it is greasy it holds onto everything that lands on it afterwards.",
          "Then there is the entry. Edmonton's cold holds through the winter, so road salt and sand arrive dry and get kicked up. Grit and salt mark the wall beside the door and along the stairwell.",
        ]}
      />

      {/* Real Results Gallery */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">What we assess</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">
                What wall cleaning takes off an Edmonton wall
              </h2>
              <p className="text-muted-foreground">
                Scuffs, fingerprints around switches, cooking film above the stove, and the grey band that builds
                along a stairwell. The pictures are illustrations of marks and washed walls, not photographs of a
                customer&rsquo;s home.
              </p>
            </div>
            {/* The captions used to read as a before-and-after set ("Dirty walls
                before cleaning", "Hallway wall after washing") over generated
                images. They now say what each picture shows. */}
            {/* Three pictures, each of a mark or of one being wiped. The two
                plain room shots and a second gloved hand were dropped. */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <ResultCard src={dirtyWallBefore} caption="A handprint and scuffs beside a door frame" />
              <ResultCard src={stainCloseup} caption="An orange stain beside a cleaning cloth" />
              <ResultCard src={kitchenGrease} caption="Wiping grey film off the wall behind a stove" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The marks and the wash, side by side as two plain lists. They were two
          card grids back to back (six icon cards, then five more on navy) that
          said some of the same things twice. Every line is kept. */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">
                  What's included in our wall washing
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                <div>
                  <h3 className="font-semibold text-xl text-foreground mb-4">Marks and film the team works on</h3>
                  <dl className="space-y-4">
                    {wallProblems.map((p) => (
                      <div key={p.title} className="border-t border-border pt-3">
                        <dt className="font-semibold text-foreground">{p.title}</dt>
                        <dd className="text-muted-foreground leading-relaxed">{p.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div>
                  <h3 className="font-semibold text-xl text-foreground mb-4">What the wash covers</h3>
                  <dl className="space-y-4">
                    {includedItems.map((item) => (
                      <div key={item.title} className="border-t border-border pt-3">
                        <dt className="font-semibold text-foreground">{item.title}</dt>
                        <dd className="text-muted-foreground leading-relaxed">{item.description}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works: a real ordered list, so the sequence survives without
          the corner badges the four step cards used to carry. */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">How wall cleaning works</h2>
            </div>
            <ol className="max-w-3xl mx-auto list-decimal pl-6 space-y-6 marker:font-bold marker:text-accent">
              {steps.map((s) => (
                <li key={s.title} className="pl-2">
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{s.description}</p>
                </li>
              ))}
            </ol>
          </AnimatedSection>
        </div>
      </section>

      {/* Cost by home size */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">What wall washing costs in Edmonton</h2>
                <p className="text-muted-foreground">
                  Two add-ons, each priced by the size of the home the clean is booked for, before 5% GST.
                  Spot cleaning is the marks: the switch plates, the stairwell band, the wall behind the
                  bin. The full wash is every painted wall in the rooms you book.
                </p>
              </div>
              <div className="overflow-hidden border border-border rounded-xl">
                <table className="w-full">
                  <thead className="bg-brand-navy text-brand-navy-foreground">
                    <tr>
                      <th className="py-3 px-5 text-left text-sm font-bold">Home size</th>
                      <th className="py-3 px-5 text-right text-sm font-bold">Spot cleaning</th>
                      <th className="py-3 px-5 text-right text-sm font-bold">Full wash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WALL_ROWS.map((r, i) => (
                      <tr key={r.beds} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                        <td className="py-3 px-5 text-foreground">{r.beds}</td>
                        <td className="py-3 px-5 text-right font-bold text-foreground">{r.spot}</td>
                        <td className="py-3 px-5 text-right font-bold text-foreground">{r.full}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                Wall washing is not sold on its own, so the smallest bill is a standard clean from{" "}
                {STANDARD_FROM} for a one-bedroom apartment plus spot wall cleaning from {formatPrice(WALL_FROM)} at
                the smallest size in the table, both before GST. The clean underneath carries its own compulsory charges: a home with
                pets adds {PET_LINE}, a bungalow, basement suite, townhouse or two-storey house costs more than an apartment,
                and an address outside Edmonton city limits adds a {TRAVEL_LINE} travel fee. After building work
                the film on the paint is sanding dust, and that whole job is{" "}
                <Link to="/post-construction-cleaning/" className="text-primary underline underline-offset-4">post-construction cleaning in Edmonton</Link>,
                priced by square footage. The clean itself, and every other add-on, is priced on{" "}
                <Link to="/pricing/" className="text-primary underline underline-offset-4">the full Edmonton price list</Link>.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">What wall washing will and will not do</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {whyUs.map((w, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-5">
                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center mb-3">
                      <w.icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="font-semibold mb-1">{w.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{w.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Service Areas */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">Where we serve in Edmonton</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Wall washing is booked with a clean anywhere we work. The towns outside Edmonton city limits
                  carry a {formatPrice(travelFee("standard") ?? 0)} travel fee on top of the clean, and each has
                  its own page:{" "}
                  <Link to="/cleaning-services-sherwood-park/" className="text-primary underline underline-offset-4">house cleaning in Sherwood Park</Link>,{" "}
                  <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-4">St. Albert house cleaners</Link> and{" "}
                  <Link to="/cleaning-services-spruce-grove/" className="text-primary underline underline-offset-4">cleaning services in Spruce Grove</Link>{" "}
                  among them.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {edmontonLocations.map((loc) => (
                  <Link
                    key={loc.path}
                    to={withTrailingSlash(loc.path)}
                    className="inline-flex items-center gap-2 bg-white border border-border rounded-full px-5 py-2.5 text-sm font-medium text-foreground hover:border-primary hover:text-primary transition-colors duration-200"
                  >
                    <span className="dc-icon dc-icon-map-pin w-3.5 h-3.5" aria-hidden="true" />
                    {loc.name}
                  </Link>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">Wall cleaning FAQs</h2>
              </div>
              <Accordion type="single" collapsible className="bg-white rounded-xl border border-border px-6">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className={i === faqs.length - 1 ? "border-0" : ""}>
                    <AccordionTrigger className="text-left font-semibold">{f.q}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact: one office block. The hours are read from proof.ts, where the
          footer reads them, so the two cannot drift. The third card used to be
          headed "Hours of Operation" over a "Reviews" link; that link now sits
          beside the rating in the closing band. */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="display-serif text-3xl md:text-4xl font-bold">Get in touch</h2>
              </div>
              <dl className="bg-white border border-border rounded-xl p-6 md:p-8 grid sm:grid-cols-3 gap-8">
                <div>
                  <dt className="font-semibold text-foreground mb-1">Give us a call</dt>
                  <dd className="text-muted-foreground">
                    Questions before you book
                    <a href={PROOF.phoneLink} className="mt-1 block text-lg font-semibold text-primary underline underline-offset-4">{PROOF.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground mb-1">Our office</dt>
                  <dd className="text-muted-foreground">
                    {PROOF.address}
                    <a
                      href="https://www.google.com/maps/dir//18615+71+Ave+NW,+Edmonton,+AB+T5T+2V9,+Canada"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 block font-semibold text-primary underline underline-offset-4"
                    >
                      Get Directions
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground mb-1">Hours</dt>
                  <dd className="text-muted-foreground">
                    {hoursRowsFor("edmonton").map(([days, time]) => (
                      <span key={days} className="block">{days}: {time}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* The one closing band: the rating, the reviews and the price button.
          It was two navy sections with the contact cards between them. */}
      <section className="py-16 md:py-20 bg-brand-navy">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Stars size={1.75} className="text-brand-gold" />
              </div>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-6">
                Rated {CITY_PROOF.edmonton.googleRating} on Google across {CITY_PROOF.edmonton.googleReviewCount} Edmonton reviews
              </h2>
              <p className="text-white/90 mb-4 max-w-xl mx-auto">
                The reviews are on this site as well as on Google:{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-4">read the reviews</Link>{" "}
                before you book, or open{" "}
                <a href={getListing("edmonton").reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">the Edmonton branch's Google profile</a>.
                Who we are is on{" "}
                <Link to="/about-us/" className="text-white underline underline-offset-4">About Duty Cleaners</Link>.
              </p>
              <h3 className="text-2xl font-bold text-white mt-10 mb-3">Add wall washing to your next clean</h3>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                Spot cleaning from {formatPrice(WALL_FROM)} and a full wash from {formatPrice(WALL_FULL)}, by home size, before GST. Nothing is charged until the clean is done. The cleans it can be added to, with their starting prices, are listed under{" "}
                <Link to="/services/" className="text-white underline underline-offset-4">all Edmonton cleaning services and prices</Link>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                  <a href={PROOF.phoneLink}>
                    <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                    {PROOF.phone}
                  </a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <CityCrossLink city="Calgary" to="/wall-washing-wall-cleaning-calgary/" description="Wall washing and wall cleaning for Calgary homes." />
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
