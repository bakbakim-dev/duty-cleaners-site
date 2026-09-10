import { getListing } from "@/lib/google-listings";
import { withTrailingSlash } from "@/data/legacy-urls";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { addOnMaxPrice, addOnFromPrice, addOnsFor, bedroomOptions, formatPrice, standardTierRows, withGst } from "@/data/pricing";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import {
  Phone, MapPin, Clock, Star, Shield, Sparkles, Droplets, Wind,
  HandMetal, Cigarette, Home, Utensils, Cloud, ClipboardCheck, Search, Brush, ThumbsUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
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

const calgaryLocations = [
  { name: "Airdrie", path: "/cleaning-services-airdrie" },
  { name: "Cochrane", path: "/cleaning-services-cochrane" },
  { name: "Okotoks", path: "/locations/okotoks" },
  { name: "Chestermere", path: "/locations/chestermere" },
  { name: "High River", path: "/locations/high-river" },
  { name: "Strathmore", path: "/locations/strathmore" },
  { name: "Crossfield", path: "/locations/crossfield" },
  { name: "Langdon", path: "/locations/langdon" },
  { name: "Black Diamond", path: "/locations/black-diamond" },
  { name: "Turner Valley", path: "/locations/turner-valley" },
];

const wallProblems = [
  { icon: Wind, title: "Static-held dust film", description: "The grey film above vents and behind doors that a duster moves around rather than removes." },
  { icon: Cloud, title: "Furnace halo", description: "The soft dark band above the registers and along the ceiling line that chinook restarts build up." },
  { icon: Droplets, title: "Hard-water haze", description: "The mineral film around the shower and behind the sink that wiping does not shift." },
  { icon: Utensils, title: "Cooking film", description: "Grease and hard-water residue combined into a film on the backsplash surround." },
  { icon: HandMetal, title: "Handprints & scuffs", description: "Around switches, along hallways and entry walls, where hands and bags touch the wall." },
  { icon: Cigarette, title: "Nicotine & smoke residue", description: "Yellow tar film that dulls the paint. It fades with washing; full removal is not promised." },
];

const includedItems = [
  { icon: Brush, title: "The full wash", description: "Painted drywall in each room on the booking, washed with a damp cloth and a bucket, top of the wall to the baseboard." },
  { icon: Sparkles, title: "Marks first", description: "Scuffs, handprints and the odd crayon line are worked one at a time before the wash, so the wash does not spread them." },
  { icon: Wind, title: "Corners and the ceiling line", description: "Cobwebs and the furnace halo come down before the wall is touched, or they end up back on it." },
  { icon: Droplets, title: "Hard-water haze", description: "The mineral film around the shower and behind the taps is dissolved, not scrubbed, so the paint underneath survives." },
  { icon: Cloud, title: "Smoke and cooking film", description: "The film comes off the wall. The smell in the drywall may not, and we say so before you book rather than after." },
  { icon: Shield, title: "Light mildew on bathroom walls", description: "Surface spots on humid-room walls are treated where the paint allows it. Anything in the drywall itself is a remediation job, not a wash." },
];

const steps = [
  { icon: ClipboardCheck, title: "Tick the wall add-on", description: "It sits on the booking form under the clean you are booking. Choose spot cleaning for the marks or the full wash for whole rooms, and the price for your home size appears beside it." },
  { icon: Search, title: "Paint check on arrival", description: "The team tests an out-of-the-way patch in each room. Flat and matte finishes mark if they are rubbed, so those rooms get the lighter method and we tell you which ones." },
  { icon: Brush, title: "Wash, room by room", description: "By hand, with a product suited to painted walls. Marks are worked first, then the whole wall in one pass so it dries without streaks." },
  { icon: ThumbsUp, title: "Walk it with you", description: `We look at the rooms together before we leave. A mark we missed is re-cleaned at no charge if you tell us within ${POLICY.guaranteeWindowHours} hours.` },
];

const whyUs = [
  { icon: Sparkles, title: "What washing removes", description: "The static-held film, the furnace halo, cooking film, hard-water haze, handprints and scuffs." },
  { icon: Shield, title: "What it cannot promise", description: "That a nicotine wall goes back to white, or that a matte finish takes a hard scrub. Some marks fade rather than vanish, and we say which." },
  { icon: Home, title: "When it earns its price", description: "Before a listing photo, before a repaint, and on a move-out, where the entry wall is the first thing the inspection sees." },
  { icon: Droplets, title: "Bathroom walls", description: "Calgary water is hard, so the haze around the shower is on most of the bathroom walls we wash. It comes off with a mild acid, not force." },
  { icon: ThumbsUp, title: `${POLICY.guaranteeWindowHours}-hour re-clean`, description: `A wall or a mark we missed is put right at no charge. Tell us within ${POLICY.guaranteeWindowHours} hours of the clean.` },
  { icon: Star, title: "Rated by Calgary customers", description: `${CITY_PROOF.calgary.googleRating} on Google across ${CITY_PROOF.calgary.googleReviewCount} Calgary reviews.` },
];

const faqs = [
  { q: "Can all wall stains be removed?", a: "No, and we will not tell you otherwise on the phone. Handprints, scuffs, the dust film and cooking grease come off. Nicotine fades but rarely disappears. A mark that has been on a matte wall for years may leave a shadow where the paint has taken the stain in. The team tells you at the paint check which kind you have." },
  { q: "Do you clean all types of painted walls?", a: "Most of them. Eggshell, satin and semi-gloss take a proper wash. Flat and matte paint burnishes if it is rubbed, so those rooms get a lighter spot-clean and we say which rooms that was." },
  { q: "Do you remove mold from walls?", a: "Surface mildew on a painted bathroom wall, yes. Mold that has grown into the drywall or the wall behind it, no; that is a remediation job, and washing the face of it hides the problem without fixing it. If we find that, we tell you and leave it alone." },
  { q: "Do I need to move furniture?", a: "Move what you can. A wall behind a sofa gets washed to where we can reach without dragging the sofa, and we do not move anything over 25 pounds. Pictures and shelves come down before we arrive if you want the wall behind them done." },
  { q: "Do you offer wall cleaning for rentals or move-outs?", a: "Yes. The wall add-on is on the move-out booking form as well as the standard one. The entry wall and the stairwell are what a Calgary landlord photographs first, so spot cleaning those two is the usual choice; the full wash is for a repaint or a listing." },
  { q: "Do you clean ceilings in homes affected by smoke or nicotine?", a: "Not as part of the wall add-on. A flat ceiling that is reachable from a step ladder can be added for an extra charge agreed before the visit, and it takes longer than a wall of the same size. Popcorn ceilings are not cleaned and are usually replaced instead. Whichever ceiling it is, we do not promise the stain or the smell goes completely." },
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
 * Both wall extras at every size bk-config prices them at, and the full wash
 * with GST on it.
 *
 * The table used to be built off PRICING_TIERS, which stops at a "5+ Bedroom"
 * row — so it ended at $89.99 / $194.99 while the hero quoted $109.99 and
 * $234.99, the six- and seven-bedroom figures the table never showed. Seven
 * rows, seven prices, and the hero's two ends are now the first and last of
 * them. The old fourth column (a standard clean of that size plus spot
 * cleaning) could only be computed for the five sizes the home-cleaning table
 * publishes bath counts for; that figure is stated in the paragraph below the
 * table instead.
 */
const STANDARD_ROWS = standardTierRows();
const WALL_ROWS = bedroomOptions("standard").map((bedroom) => {
  const addOns = addOnsFor("standard", bedroom.id);
  const spot = addOns.find((a) => a.id === "spot-cleaning-inside-walls")?.price;
  const full = addOns.find((a) => a.id === "complete-inside-wall-washing")?.price;
  return {
    beds: sizeLabel(bedroom.label),
    spot: spot === undefined ? "" : formatPrice(spot),
    full: full === undefined ? "" : formatPrice(full),
    fullWithGst: full === undefined ? "" : formatPrice(withGst(full)),
  };
});
const STANDARD_FROM = STANDARD_ROWS[0]?.price ?? "";
const TRAVEL_FEE = formatPrice(travelFee("standard") ?? 0);

const PAGE_TITLE = `Wall Washing & Cleaning Calgary from ${formatPrice(WALL_FROM)} | Duty Cleaners`;
const META_DESCRIPTION = `Wall washing in Calgary from ${formatPrice(WALL_FROM)}: static-held dust film, hard-water haze and cooking film washed off painted walls, added to any clean we do.`;

export default function WallWashingCalgary() {

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/wall-washing-wall-cleaning-calgary/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/wall-washing-wall-cleaning-calgary/" />
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
          {JSON.stringify(buildServiceSchema({ name: "Wall Washing and Wall Cleaning", description: META_DESCRIPTION, path: "/wall-washing-wall-cleaning-calgary", city: "calgary", offerFrom: WALL_FROM, offerTo: WALL_FULL_MAX, offerNote: "Added to a standard, deep or move-out clean; not sold as a standalone visit." }))}
        </script>
      </Helmet>
      <Navigation city="calgary" />
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
                <span className="text-white/90 text-sm font-medium">{RATING_CLAIM}, a missed mark re-cleaned free within {POLICY.guaranteeWindowHours} hours</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Wall Washing & Cleaning <span className="text-accent">Calgary</span>
              </h1>
              <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl">
                Walls washed by hand, not wiped. The static-held dust film, the halo above the registers and the hard-water haze in the bathroom come off, and the paint finish stays.
              </p>
              {/* The three cleans this add-on can ride on, linked. The sentence
                  named all three and linked none, which left the reader told
                  what to do and not where to do it. */}
              <p className="text-lg text-white/90 mb-10 leading-relaxed max-w-2xl">
                Wall washing rides on{" "}
                <Link to="/calgary/regular-cleaning/" className="text-white underline underline-offset-4">a standard clean</Link>,{" "}
                <Link to="/calgary/deep-cleaning/" className="text-white underline underline-offset-4">a deep clean</Link>{" "}
                or{" "}
                <Link to="/move-out-cleaning-calgary/" className="text-white underline underline-offset-4">a move-out clean</Link>;
                it is not a visit on its own. Spot cleaning is {formatPrice(WALL_FROM)} to{" "}
                {formatPrice(WALL_SPOT_MAX)} by home size and the full top-to-bottom wash{" "}
                {formatPrice(WALL_FULL)} to {formatPrice(WALL_FULL_MAX)}, both before 5% GST. Each of
                those seven sizes has its own row in the table below.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                  <a href="#quote">
                    See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                  <a href="tel:4037681341">
                    <Phone className="w-4 h-4 mr-2" />
                    (403) 768-1341
                  </a>
                </Button>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <img width={1024} height={768}
                src={livingRoomWalls}
                alt="Washed living room walls in a Calgary home"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
               loading="eager" fetchPriority="high"/>
            </div>
          </div>
        </div>
      </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Why Calgary walls"
        heading="What actually ends up on a wall in Calgary"
        paragraphs={[
          "Calgary sits in a semi-arid belt at the edge of the foothills, and the air here is dry enough for most of the year that fine dust never really settles — it circulates and clings. Walls above baseboards, around vents and behind doors pick up a grey film that a duster moves around rather than removes, because static is holding it there. That film is the single most common thing we are called about, and it comes off with washing rather than dusting.",
          "The chinooks make it worse in a specific way. Temperature swings of twenty degrees inside a day drive the furnace on and off repeatedly instead of letting it hold a steady cycle, and every restart pushes another load of duct dust into the room. Above the registers and along the ceiling line is where that shows first — a soft dark halo that homeowners often mistake for a paint defect.",
          "The other Calgary problem is water. The supply comes off the Bow and the Elbow, drawing through Rockies limestone, and it is hard. In bathrooms that leaves a mineral haze on the wall around the shower and behind the sink that regular cleaning does not shift, and in kitchens it combines with cooking grease into a film on the backsplash surround. Both need the wall washed rather than wiped.",
        ]}
      />

      {/* Real Results Gallery */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <span className="text-accent font-semibold text-sm uppercase tracking-wider">What comes off</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                What comes off a Calgary wall
              </h2>
              <p className="text-muted-foreground">
                The dust film first, then the furnace halo, the haze in the bathroom, the cooking film beside the stove, and the handprints along the hallway.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              <ResultCard src={dirtyWallBefore} caption="The grey film on a wall before washing" />
              <ResultCard src={livingRoomWalls} caption="Living room walls after the full wash" />
              <ResultCard src={stainCloseup} caption="One mark, worked out by hand" />
              <ResultCard src={hallwayClean} caption="A hallway with the handprints gone" />
              <ResultCard src={kitchenGrease} caption="Cooking film off the wall beside a stove" />
              <ResultCard src={wallStainRemoval} caption="Scuffs along a stairwell, cleaned" />
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
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">The six marks Calgary walls collect</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  The static-held dust film is the most common call in Calgary. These are the rest.
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
                  What a Calgary wall wash includes
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
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">How wall washing is booked and done in Calgary</h2>
              <p className="text-muted-foreground">There is no separate wall visit. The add-on goes on whichever clean you are booking, and the
                walls in a room are done before that room's floor.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What wall washing costs in Calgary</h2>
                <p className="text-muted-foreground">
                  The add-on is priced by the size of the home on the booking, not by the number of walls,
                  and the same row applies whether it rides on a standard, deep or move-out clean. Seven
                  sizes, seven rows, ending where the booking form ends. The last column carries the 5% GST
                  on the full wash, because that is the number that reaches the card.
                </p>
              </div>
              <div className="overflow-x-auto border border-border rounded-xl">
                <table className="w-full">
                  <thead className="bg-brand-navy text-brand-navy-foreground">
                    <tr>
                      <th className="py-3 px-4 text-left text-sm font-bold">Home size</th>
                      <th className="py-3 px-4 text-right text-sm font-bold">Spot cleaning</th>
                      <th className="py-3 px-4 text-right text-sm font-bold">Full wash</th>
                      <th className="py-3 px-4 text-right text-sm font-bold">Full wash with GST</th>
                    </tr>
                  </thead>
                  <tbody>
                    {WALL_ROWS.map((r, i) => (
                      <tr key={r.beds} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                        <td className="py-3 px-4 text-foreground">{r.beds}</td>
                        <td className="py-3 px-4 text-right font-bold text-foreground">{r.spot}</td>
                        <td className="py-3 px-4 text-right font-bold text-foreground">{r.full}</td>
                        <td className="py-3 px-4 text-right text-foreground">{r.fullWithGst}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                So the least a Calgary wall job can cost is a standard clean from {STANDARD_FROM} plus spot
                wall cleaning from {formatPrice(WALL_FROM)}, before GST. A full wash of a one-bedroom on a
                move-out is the move-out rate plus {formatPrice(WALL_FULL)}. Walls covered in drywall dust
                after a build or a renovation are not this add-on at all;{" "}
                <Link to="/post-construction-cleaning-calgary/" className="text-primary underline underline-offset-4">post-construction cleaning in Calgary</Link>{" "}
                takes the whole house and is priced by square footage. The cleans themselves, and the
                other add-ons, are on{" "}
                <Link to="/calgary/pricing/" className="text-primary underline underline-offset-4">Calgary house cleaning prices by home size</Link>.
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
                <span className="text-accent font-semibold text-sm uppercase tracking-wider">Plain terms</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What you are paying for when you add the walls</h2>
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
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Wall washing across Calgary, Airdrie and Cochrane</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Inside Calgary city limits the price is the row above and nothing else. The towns around
                  the city carry a {TRAVEL_FEE} travel fee on the clean the walls are added to, and two of them
                  have their own pages:{" "}
                  <Link to="/cleaning-services-airdrie/" className="text-primary underline underline-offset-4">house cleaning in Airdrie</Link>{" "}
                  and{" "}
                  <Link to="/cleaning-services-cochrane/" className="text-primary underline underline-offset-4">Cochrane house cleaners</Link>.
                  The wash, and the row it is priced from, are the same in every one of them.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {calgaryLocations.map((loc) => (
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
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Wall washing questions from Calgary customers</h2>
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
                {CITY_PROOF.calgary.googleRating} on Google from {CITY_PROOF.calgary.googleReviewCount} Calgary reviews
              </h2>
              <p className="text-xl font-semibold text-accent mb-6">A missed mark is re-cleaned free</p>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                The Calgary listing carries fewer reviews than Edmonton's; the rating is the same. Tell us
                within {POLICY.guaranteeWindowHours} hours about a wall we got wrong and it is put right at
                no charge.{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-4">Read the reviews</Link>{" "}
                from both cities before you decide.
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
                <h2 className="text-3xl md:text-4xl font-bold mt-2">The Calgary office</h2>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Phone</h3>
                    <p className="text-muted-foreground text-sm mb-3">Ask about a paint finish or a stain before you book</p>
                    <a href="tel:4037681341" className="text-primary font-semibold hover:underline">(403) 768-1341</a>
                  </CardContent>
                </Card>

                <Card className="text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <CardContent className="pt-8 pb-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:rotate-12">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Address</h3>
                    <p className="text-muted-foreground text-sm mb-3">2835 37 Street SW #24<br />Calgary, AB</p>
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=2835+37+Street+SW+%2324+Calgary+AB"
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
                    <h3 className="font-semibold text-lg mb-2">Hours</h3>
                    <p className="text-muted-foreground text-sm"><strong>Mon–Sat:</strong> 8am – 8pm</p>
                    <p className="text-muted-foreground text-sm mb-3"><strong>Sunday:</strong> 9am – 3pm</p>
                    <a
                      href={getListing("calgary").reviewsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary font-semibold hover:underline"
                    >
                      Google listing
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
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Book the walls with the next clean</h2>
            <p className="text-white/90 mb-8 max-w-xl mx-auto">
              Spot cleaning from {formatPrice(WALL_FROM)}, the full wash from {formatPrice(WALL_FULL)}, on top of a
              standard clean from {STANDARD_FROM}, all before GST and none of it charged until the clean is
              done. The cleans it can ride on are listed with their starting prices under{" "}
              <Link to="/calgary/services/" className="text-white underline underline-offset-4">every Calgary cleaning service, with starting prices</Link>.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                <a href="#quote">See My Instant Price</a>
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                <a href="tel:4037681341">
                  <Phone className="w-4 h-4 mr-2" />
                  Call (403) 768-1341
                </a>
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <CityCrossLink city="Edmonton" to="/wall-washing-wall-cleaning/" description="Wall washing and wall cleaning for Edmonton homes." />
        </div>
      </section>
      </main>


      <Footer />
    </div>
  );
}
