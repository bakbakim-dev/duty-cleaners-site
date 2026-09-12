import { getListing } from "@/lib/google-listings";
import { withTrailingSlash } from "@/data/legacy-urls";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { addOnMaxPrice, addOnFromPrice, addOnsFor, bedroomOptions, formatPrice, standardTierRows } from "@/data/pricing";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  CheckCircle, Phone, MapPin, Clock, Star, Shield, Sparkles, Droplets, Wind, Bug,
  HandMetal, Baby, Cigarette, Home, Utensils, Cloud, ClipboardCheck, Search, Brush, ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import cleanWallsPhoto from "@/assets/gallery/clean-walls-edmonton.webp";
import wallStainRemoval from "@/assets/wall-washing/wall-stain-removal.webp";
import hallwayClean from "@/assets/wall-washing/hallway-clean.webp";
import livingRoomWalls from "@/assets/wall-washing/living-room-walls.webp";
import kitchenGrease from "@/assets/wall-washing/kitchen-grease.webp";
import dirtyWallBefore from "@/assets/wall-washing/dirty-wall-before.webp";
import stainCloseup from "@/assets/wall-washing/stain-closeup.webp";
import { Helmet } from "react-helmet-async";
import CityCrossLink from "@/components/CityCrossLink";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";

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

const ProblemCard = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="group bg-white rounded-xl border border-border p-5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center mb-3 transition-transform duration-300 group-hover:rotate-12">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <h3 className="font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
);

const ResultCard = ({ src, caption }: { src: string; caption: string }) => (
  <div className="group rounded-xl overflow-hidden border border-border bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="aspect-[4/3] overflow-hidden">
      <img
        src={src}
        alt={caption}
        loading="lazy"
        width={1024}
        height={768}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
    </div>
    <div className="p-4">
      <p className="text-sm font-medium text-foreground">{caption}</p>
    </div>
  </div>
);

const StepCard = ({ step, icon: Icon, title, description }: { step: number; icon: React.ElementType; title: string; description: string }) => (
  <div className="relative bg-white rounded-xl border border-border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
    <div className="absolute -top-3 -left-3 w-9 h-9 rounded-full bg-accent text-accent-foreground font-bold flex items-center justify-center text-sm shadow-md">
      {step}
    </div>
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
  </div>
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
  { icon: Wind, title: "Furnace dust film", description: "The grey deposit above every register and along the ceiling line that a duster only spreads." },
  { icon: Utensils, title: "Cooking film", description: "The sticky layer that spreads past the backsplash onto the surrounding wall and holds whatever lands on it." },
  { icon: HandMetal, title: "Handprints & scuffs", description: "Around switches, along hallways and up the stairwell, where hands and bags touch the wall." },
  { icon: Droplets, title: "Salt & grit at the entry", description: "Grit and salt marks on the wall beside the door and along the stairwell." },
  { icon: Cigarette, title: "Nicotine & smoke residue", description: "Yellow tar film that dulls the paint. It fades with washing; full removal is not promised." },
  { icon: Sparkles, title: "Light surface mildew", description: "Wiped off painted bathroom walls where it is safe to. Mould that has gone into the drywall is remediation work, which the team does not do." },
];

const includedItems = [
  { icon: Brush, title: "Full wall wash", description: "Every painted wall in the rooms you book, washed top to bottom." },
  { icon: Sparkles, title: "Stain, smudge & mark removal", description: "Spots, smudges and marks worked on one at a time before the wall is washed." },
  { icon: Droplets, title: "Spot treatment for grime & gentle mildew", description: "Built-up grime around switches and door frames, and light surface mildew on bathroom walls where the paint allows it." },
  { icon: Cigarette, title: "Nicotine & tar stain treatment", description: "Targeted cleaning to reduce yellow nicotine and tar buildup on walls in smoked-in homes." },
  { icon: Shield, title: "Paint-ready wall cleaning", description: "Dust, residue and film taken off so primer and paint go onto a clean wall." },
];

/* The last step used to promise a walkthrough "with you before we leave".
   Most customers are not home (content prompt T5), so it now says what is
   true for all of them. */
const steps = [
  { icon: ClipboardCheck, title: "Tick it on the booking form", description: "Choose the clean first, then add spot cleaning or the full wash for your home size. The price shows before you book." },
  { icon: Search, title: "We assess the walls", description: "On arrival the team checks the paint finish in each room. Very flat or delicate finishes get a gentler spot-clean." },
  { icon: Brush, title: "We wash the walls", description: "By hand, top to bottom, with products suited to painted surfaces. Marks are worked on first, then the whole wall." },
  { icon: ThumbsUp, title: "Locked up, then paid", description: "You do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and the team locks up. The card is charged once the clean is complete." },
];

const whyUs = [
  { icon: Sparkles, title: "What comes off", description: "Cooking film, nicotine, handprints, scuffs and the grey furnace-dust film." },
  { icon: Shield, title: "What stays", description: "The paint finish. Very flat or delicate paint limits how hard a mark can be worked, and some stains only fade." },
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
  { q: "Can all wall stains be removed?", a: "Some come off, some only lighten. The furnace-dust film, cooking film, handprints and scuffs wash off. Nicotine lightens and rarely leaves altogether. Ink, crayon and a mark that has sat on flat paint for years often leave a ghost, because the pigment has gone into the paint. The team looks at the finish before it starts and tells you which kind you have." },
  { q: "Do you clean all types of painted walls?", a: "Painted drywall, yes, and the finish decides the method. Satin and semi-gloss take a proper wash. A flat or matte finish polishes to a shine wherever it is rubbed hard, so a mark on one of those is worked gently and left faint. Wallpaper, bare drywall and unpainted wood are not washed at all." },
  { q: "Do you remove mould from walls?", a: "Light surface mildew on a painted wall, yes — the spots that come up in a bathroom after a winter of shut windows. Mould that has gone into the drywall or behind it, no. Washing the face of that hides it and fixes nothing, so if the crew finds it they stop, tell you, and leave it for a remediation contractor." },
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

const PAGE_TITLE = `Wall Washing & Cleaning Edmonton from ${formatPrice(WALL_FROM)} | Duty Cleaners`;
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
      <section className="relative py-20 md:py-28 bg-brand-navy overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <Star className="w-4 h-4 text-accent" />
                <span className="text-white/90 text-sm font-medium">{RATING_CLAIM} across {PROOF.googleReviewCount} Edmonton reviews</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Wall Washing & Cleaning <span className="text-accent">Edmonton</span>
              </h1>
              <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl">
                The team washes painted walls by hand. The team assesses scuffs, handprints and cooking film against the paint finish before washing. Some marks remain, and fragile finishes may need a lighter treatment.
              </p>
              {/* The sentence names the three cleans this add-on rides on and
                  used to link none of them, on a page that cannot be booked
                  without one. */}
              <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl">
                Wall washing is added to{" "}
                <Link to="/edmonton/regular-cleaning/" className="text-white underline underline-offset-4">a standard clean</Link>,{" "}
                <Link to="/edmonton/deep-cleaning/" className="text-white underline underline-offset-4">a deep clean</Link>{" "}
                or{" "}
                <Link to="/move-out-cleaning-edmonton/" className="text-white underline underline-offset-4">a move-out clean</Link>{" "}
                rather than booked on its own. Spot cleaning runs {formatPrice(WALL_FROM)} to{" "}
                {formatPrice(WALL_SPOT_MAX)} and a full top-to-bottom wash {formatPrice(WALL_FULL)} to{" "}
                {formatPrice(WALL_FULL_MAX)}, by home size, before 5% GST. The booking form prices
                seven home sizes, and your own figure is on the quote before you book.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                  <a href="#quote">
                    See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                  <a href="tel:7809136565">
                    <Phone className="w-4 h-4 mr-2" />
                    (780) 913-6565
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <img width={768} height={1024}
                src={cleanWallsPhoto}
                alt="A bright room with white painted walls and a doorway"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
               loading="eager" fetchPriority="high"/>
            </div>
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
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">What comes off</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
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
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <ResultCard src={dirtyWallBefore} caption="A handprint and scuffs beside a door frame" />
              <ResultCard src={livingRoomWalls} caption="A living room with pale painted walls" />
              <ResultCard src={stainCloseup} caption="An orange stain beside a cleaning cloth" />
              <ResultCard src={hallwayClean} caption="A hallway with white painted walls" />
              <ResultCard src={kitchenGrease} caption="Wiping grey film off the wall behind a stove" />
              <ResultCard src={wallStainRemoval} caption="A gloved hand wiping a stain off a painted wall" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Wall Problems Grid */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Common Issues</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Common Issues We Fix</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  What ends up on Edmonton walls, and what we are booked to take off.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {wallProblems.map((p, i) => (
                  <ProblemCard key={i} icon={p.icon} title={p.title} description={p.description} />
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 md:py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Service</span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
                  What's Included in Our Wall Washing
                </h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {includedItems.map((item, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10 transition-all duration-300 hover:-translate-y-1 hover:bg-white/15">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                        <item.icon className="w-5 h-5 text-accent" />
                      </div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                    </div>
                    <p className="text-sm text-white/90 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">Process</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">How Wall Cleaning Works</h2>
              <p className="text-muted-foreground">Wall washing is an add-on, so it starts where your clean does:
                tick it in the booking form and the price appears with it.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {steps.map((s, i) => (
                <StepCard key={i} step={i + 1} icon={s.icon} title={s.title} description={s.description} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Cost by home size */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Price list</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What wall washing costs in Edmonton</h2>
                <p className="text-muted-foreground">
                  Two add-ons, each priced by the size of the home the clean is booked for, before 5% GST.
                  Spot cleaning is the marks: the switch plates, the stairwell band, the wall behind the
                  bin. The full wash is every painted wall in the rooms you book. The booking form carries
                  one row per home size, and all seven of them are printed below.
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
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Why Choose Us</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What wall washing will and will not do</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {whyUs.map((w, i) => (
                  <div key={i} className="bg-white rounded-xl border border-border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
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
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Service Areas</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Where We Serve in Edmonton</h2>
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
                    <MapPin className="w-3.5 h-3.5" />
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
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">FAQ</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Wall Cleaning FAQs</h2>
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

      {/* Happy Clients */}
      <section className="py-16 md:py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-7 h-7 fill-accent text-accent" />
                  ))}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                Rated {CITY_PROOF.edmonton.googleRating} on Google across {CITY_PROOF.edmonton.googleReviewCount} Edmonton reviews
              </h2>
              <p className="text-xl font-semibold text-accent mb-6">{POLICY.guaranteeWindowHours}-hour re-clean</p>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                If a wall or a mark was missed, tell us within {POLICY.guaranteeWindowHours} hours of the clean
                and we come back to it at no charge. The reviews are on this site as well as on Google:{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-4">read the reviews</Link>{" "}
                before you book.
              </p>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                <Link to="/about-us/">About Duty Cleaners</Link>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Contact</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">Get in Touch</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Give Us a Call</h3>
                    <p className="text-muted-foreground text-sm mb-3">Questions before you book</p>
                    <a href="tel:7809136565" className="text-primary font-semibold hover:underline">(780) 913-6565</a>
                  </CardContent>
                </Card>

                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Our Office</h3>
                    <p className="text-muted-foreground text-sm mb-3">18615 71 Ave NW, Edmonton, AB</p>
                    <a
                      href="https://www.google.com/maps/dir//18615+71+Ave+NW,+Edmonton,+AB+T5T+2V9,+Canada"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Get Directions
                    </a>
                  </CardContent>
                </Card>

                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <Clock className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Hours of Operation</h3>
                    <p className="text-muted-foreground text-sm"><strong>Mon–Sat:</strong> 8am – 8pm</p>
                    <p className="text-muted-foreground text-sm mb-3"><strong>Sunday:</strong> 9am – 3pm</p>
                    <a
                      href={getListing("edmonton").reviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Reviews
                    </a>
                  </CardContent>
                </Card>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 right-20 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Add wall washing to your next clean</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Spot cleaning from {formatPrice(WALL_FROM)} and a full wash from {formatPrice(WALL_FULL)}, by home size, before GST. Nothing is charged until the clean is done. The cleans it can be added to, with their starting prices, are listed under{" "}
              <Link to="/services/" className="text-white underline underline-offset-4">all Edmonton cleaning services and prices</Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                <a href="#quote">See My Instant Price</a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                <a href="tel:7809136565">
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </a>
              </Button>
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
