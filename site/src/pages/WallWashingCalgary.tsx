import { getListing } from "@/lib/google-listings";
import Stars from "@/components/Stars";
import { withTrailingSlash } from "@/data/legacy-urls";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { addOnMaxPrice, addOnFromPrice, addOnsFor, bedroomOptions, formatPrice, standardTierRows, withGst } from "@/data/pricing";
import { POLICY } from "@/data/policy";
import { travelFee } from "@/data/addon-table";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Star, Shield, Droplets, Home, ThumbsUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import type { Picture } from "vite-imagetools";
import ResponsiveImage, { SIZES } from "@/components/ResponsiveImage";
// The two-up feature beside the hero copy (?col).
import livingRoomWallsFeature from "@/assets/wall-washing/living-room-walls.webp?col";
import kitchenGrease from "@/assets/wall-washing/kitchen-grease.webp?card";
import dirtyWallBefore from "@/assets/wall-washing/dirty-wall-before.webp?card";
import stainCloseup from "@/assets/wall-washing/stain-closeup.webp?card";
import { Helmet } from "react-helmet-async";
import CityCrossLink from "@/components/CityCrossLink";
import { CITY_PROOF, CALGARY_RATING_CLAIM, hoursRowsFor } from "@/data/proof";

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

/* An illustration with its caption. Nothing happens when it is clicked, so it
   stays still under the pointer. */
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

const calgaryLocations = [
  { name: "Airdrie", path: "/cleaning-services-airdrie" },
  { name: "Cochrane", path: "/cleaning-services-cochrane" },
  { name: "Okotoks", path: "/locations/okotoks" },
  { name: "Chestermere", path: "/locations/chestermere" },
  { name: "High River", path: "/locations/high-river" },
  { name: "Strathmore", path: "/locations/strathmore" },
  { name: "Crossfield", path: "/locations/crossfield" },
  { name: "Langdon", path: "/locations/langdon" },
  // Black Diamond and Turner Valley amalgamated as Diamond Valley on 1 January
  // 2023; city-locations.ts lists the town once, at this path.
  { name: "Diamond Valley", path: "/locations/black-diamond" },
];

const wallProblems = [
  { title: "Static-held dust film", description: "The grey film above vents and behind doors. Static holds it to the paint, so a duster only pushes it along." },
  { title: "Furnace halo", description: "The soft dark band above the registers and along the ceiling line." },
  { title: "Hard-water haze", description: "The mineral film around the shower and behind the sink that wiping does not shift." },
  { title: "Cooking film", description: "Grease and hard-water residue combined into a film on the backsplash surround." },
  { title: "Handprints & scuffs", description: "Around switches, along hallways and entry walls, where hands and bags touch the wall." },
  { title: "Nicotine & smoke residue", description: "Yellow tar film that dulls the paint. It fades with washing; full removal is not promised." },
];

const includedItems = [
  { title: "The full wash", description: "The team washes painted drywall in each room on the booking with a damp cloth and a bucket, from the top of the wall to the baseboard, within reach of a 3-step ladder." },
  { title: "Marks first", description: "Scuffs, handprints and the odd crayon line are worked one at a time before the wash, so the wash does not spread them." },
  { title: "Corners and the ceiling line", description: "The furnace halo along the ceiling line is cleared before the wall is washed, or it ends up back on the wall." },
  { title: "Hard-water haze", description: "Describe mineral marks around the shower and taps before booking. The team checks the surface and paint finish; washing is not a promise that all marks will lift." },
  { title: "Smoke and cooking film", description: "Washing may reduce surface cooking and smoke film. Stains and odours held in paint or drywall may remain; tell us about them before booking so we can discuss the limits." },
  { title: "Light mildew on bathroom walls", description: "Light surface mildew on a painted bathroom wall is wiped where it is safe to do so. Mould inside the drywall needs remediation, which the team does not do." },
];

const steps = [
  { title: "Tick the wall add-on", description: "It sits on the booking form under the clean you are booking. Choose spot cleaning for the marks or the full wash for whole rooms, and the price for your home size appears beside it." },
  { title: "Paint check on arrival", description: "The team checks each room's paint finish when it arrives. Flat and matte finishes mark if they are rubbed, so those rooms get the lighter method." },
  { title: "Wash, room by room", description: "By hand, with a product suited to painted walls. Marks are worked first, then the whole wall in one pass so it dries without streaks." },
  { title: "Locked up when the team leaves", description: `You do not need to be home: most customers leave a key, a lockbox code or smart-lock access, and the team locks up.` },
];

const whyUs = [
  { icon: Sparkles, title: "What washing removes", description: "The static-held film, the furnace halo, cooking film, hard-water haze, handprints and scuffs." },
  { icon: Shield, title: "What it cannot promise", description: "That a nicotine wall goes back to white, or that a matte finish takes a hard scrub. Some marks fade rather than vanish, and we say which." },
  { icon: Home, title: "When it earns its price", description: "Before a listing photo, before a repaint, and on a move-out, before the landlord completes the move-out inspection report with the tenant." },
  { icon: Droplets, title: "Supplies and water", description: "The team brings every supply and piece of equipment, including the product used on painted walls. The home needs running water, and vacuuming may not be possible without electricity." },
  { icon: ThumbsUp, title: `${POLICY.guaranteeWindowHours}-hour re-clean`, description: `A wall or a mark we missed is put right at no charge. Tell us within ${POLICY.guaranteeWindowHours} hours of the clean.` },
];

const faqs = [
  { q: "What does wall washing cost in Calgary?", a: `Spot cleaning is ${formatPrice(addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0)} to ${formatPrice(addOnMaxPrice("standard", "spot-cleaning-inside-walls") ?? 0)} and the full wash ${formatPrice(addOnFromPrice("standard", "complete-inside-wall-washing") ?? 0)} to ${formatPrice(addOnMaxPrice("standard", "complete-inside-wall-washing") ?? 0)}, set by home size and before 5% GST. Either one is added to a standard, deep or move-out clean, and that clean is priced on its own, from ${standardTierRows()[0]?.price ?? ""} for a one-bedroom apartment or condo. The clean can also carry the ${formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0)} pet charge, a home-type charge for a bungalow, basement suite, townhouse or two-storey house, and a ${formatPrice(travelFee("standard") ?? 0)} travel fee outside Calgary city limits. Every one of those lines is on the quote before you book.` },
  { q: "Can all wall stains be removed?", a: "No. Handprints, scuffs and surface film may lighten or come off, but stains and odours held in paint or drywall can remain. The result depends on the finish and condition. We assess the walls first and explain the limits; the add-on does not include painting or repairs." },
  { q: "Do you clean all types of painted walls?", a: "Not every finish is suitable. We assess the paint first; flat, fragile or damaged finishes may need limited treatment or may not be washable. Tell us about the finish and any care instructions before you book." },
  { q: "Do you remove mould from walls?", a: "Light surface mildew on a painted bathroom wall, yes, where it is safe to wipe it. Mould that has grown into the drywall or the wall behind it, no; that is a remediation job, and washing the face of it hides the problem without fixing it. If we find that, we tell you and leave it alone." },
  { q: "Do I need to move furniture?", a: "Move what you can. A wall behind a sofa gets washed to where we can reach without dragging the sofa, and we do not move anything over 25 pounds. Pictures and shelves come down before we arrive if you want the wall behind them done." },
  { q: "Do you offer wall cleaning for rentals or move-outs?", a: `Yes. The wall add-on is on the move-out booking form as well as the standard one, priced by home size from ${formatPrice(addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0)} for spot cleaning before GST. Spot cleaning the entry wall and the stairwell, where hands and bags touch the paint, is the lighter choice for a Calgary rental; the full wash suits a repaint or a listing.` },
  { q: "Do you clean ceilings in homes affected by smoke or nicotine?", a: "Not as part of the wall add-on, which covers painted walls from the top of the wall to the baseboard. Anything beyond the reach of a 3-step ladder is outside what the team does. Smoke film on the walls fades with washing, but we do not promise the stain or the smell goes completely. If the smoke has reached the ceiling, call the Calgary office at (403) 768-1341 before you book and we will say what the wall wash can and cannot do." },
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
 * The table used to be built off PRICING_TIERS, which stops at a "5 Bedroom"
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

const OFFICE = CITY_PROOF.calgary;

const PAGE_TITLE = "Wall Washing Add-On Calgary | Duty Cleaners";
const META_DESCRIPTION = `Wall washing in Calgary from ${formatPrice(WALL_FROM)} before GST, added to a standard, deep or move-out clean: dust film, hard-water haze and cooking film.`;

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
      <section className="relative py-20 md:py-24 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              {/* H1, one sentence with both from-prices, the two buttons and the
                  rating. The re-clean has its own band at the foot of the
                  page; the caveat and the linked cleans follow the hero. */}
              <h1 className="display-serif text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
                Wall Washing & Cleaning <span className="text-accent-on-dark">Calgary</span>
              </h1>
              <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                An add-on to your clean, priced by home size before 5% GST: spot cleaning from{" "}
                {formatPrice(WALL_FROM)}, the full wash from {formatPrice(WALL_FULL)}, and the card is charged
                once the clean is done.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-6">
                <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                  <a href="#quote">
                    See My Instant Price
                  </a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                  <a href="tel:4037681341">
                    <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                    (403) 768-1341
                  </a>
                </Button>
              </div>
              <p className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium text-white/90">
                <Star className="w-4 h-4 text-brand-gold fill-current" aria-hidden="true" />
                <span>{CALGARY_RATING_CLAIM}, from {OFFICE.googleReviewCount} Calgary reviews</span>
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <ResponsiveImage
                picture={livingRoomWallsFeature}
                sizes={SIZES.half}
                alt="A sunlit living room with pale painted walls and a cream sofa"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
               loading="eager" fetchPriority="high"/>
            </div>
          </div>
        </div>
      </section>

      {/* Moved down from the hero: the limits of a wash, and the three cleans
          the add-on can ride on. They are linked because a reader told what to
          book should also be shown where. */}
      <section className="py-10 bg-secondary/30 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Walls are washed by hand after the team has checked the paint finish and the marks. Some stains
              remain, and flat or delicate finishes may need a lighter treatment instead of a full wash.
            </p>
            <p>
              Wall washing rides on{" "}
              <Link to="/calgary/regular-cleaning/" className="text-primary underline underline-offset-4">a standard clean</Link>,{" "}
              <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-4">a deep clean</Link>{" "}
              or{" "}
              <Link to="/move-out-cleaning-calgary/" className="text-primary underline underline-offset-4">a move-out clean</Link>;
              it is not a visit on its own. Spot cleaning is {formatPrice(WALL_FROM)} to{" "}
              {formatPrice(WALL_SPOT_MAX)} by home size and the full top-to-bottom wash{" "}
              {formatPrice(WALL_FULL)} to {formatPrice(WALL_FULL_MAX)}, both before 5% GST. Each of
              the seven home sizes on the booking form has its own price for both. The clean is priced
              separately, and the pet, home-type and travel charges that can apply to it are listed under
              the price table.
            </p>
          </div>
        </div>
      </section>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Why Calgary walls"
        heading="What actually ends up on a wall in Calgary"
        paragraphs={[
          "If walls around vents, baseboards or doorways have a visible film, tell us where it is and what finish is on the wall. Wall washing is an add-on to a cleaning visit, not a repair or repainting service. We assess the finish and marks before deciding what can be washed.",
          "The chinooks add grit of their own: the city thaws and refreezes all winter, so sand and de-icer reach the door again and again from November to April and settle along the baseboards. Above the registers and along the ceiling line, dust shows as a soft dark halo.",
          "Kitchen splashes and bathroom marks need different care depending on the painted surface. Some marks may remain, and damaged or fragile paint may not be suitable for washing. Include these details when you request the add-on so the team can set expectations before the visit.",
        ]}
      />

      {/* Real Results Gallery */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">
                What comes off a Calgary wall
              </h2>
            </div>
            {/* Down from six pictures to the three that show a mark, or a mark
                being wiped. The room shots showed nothing a wash changes. */}
            <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <ResultCard src={dirtyWallBefore} caption="A grey handprint on a painted wall beside a door frame" />
              <ResultCard src={stainCloseup} caption="An orange stain on white paint, beside a microfibre cloth" />
              <ResultCard src={kitchenGrease} caption="A gloved cleaner wiping film off the wall behind a gas range" />
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* One section where there were two card grids (six marks, then six parts
          of the wash on navy). Two plain lists, every sentence carried over,
          including the limits on smoke, haze and mould. */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">
                  What a Calgary wall wash includes
                </h2>
              </div>
              <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                <div>
                  <h3 className="font-semibold text-xl text-foreground mb-4">The six marks Calgary walls collect</h3>
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
                  <h3 className="font-semibold text-xl text-foreground mb-4">The wash, part by part</h3>
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

      {/* How It Works, as an ordered list. The order is the point, so it is a
          real <ol> and not four cards with a badge on the corner. */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="text-center mb-10 max-w-3xl mx-auto">
              <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">How wall washing is booked and done in Calgary</h2>
              <p className="text-muted-foreground">There is no separate wall visit. The add-on goes on whichever clean you are booking, and the
                walls in a room are done before that room's floor.</p>
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">What wall washing costs in Calgary</h2>
                <p className="text-muted-foreground">
                  The add-on is priced by the size of the home on the booking, however many walls it has,
                  and the same row applies whether it rides on a standard, deep or move-out clean. The table
                  has one row for each of the seven home sizes on the booking form. The last column carries the 5% GST
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
                wall cleaning from {formatPrice(WALL_FROM)}, before GST. A home with pets adds the{" "}
                {formatPrice(addOnFromPrice("standard", "must-choose-if-you-have-pets") ?? 0)} pet charge to the
                clean, and a bungalow, basement suite, townhouse or two-storey house adds its home-type charge, both on the quote. A full
                wash of a one-bedroom on a move-out is the move-out rate plus {formatPrice(WALL_FULL)}. Walls covered in drywall dust
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">What you are paying for when you add the walls</h2>
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">Wall washing across Calgary, Airdrie and Cochrane</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Inside Calgary city limits there is no travel fee on a wall wash or the clean it rides on.
                  The towns around the city carry a {TRAVEL_FEE} travel fee on the clean the walls are added to, and two of them
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
                <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">Wall washing questions from Calgary customers</h2>
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

      {/* Contact, as a single block. Hours come from proof.ts. The old "Hours"
          card ended in a "Google listing" link, which now sits with the rating
          in the band below. */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-10">
                <h2 className="display-serif text-3xl md:text-4xl font-bold">The Calgary office</h2>
              </div>
              <dl className="bg-white border border-border rounded-xl p-6 md:p-8 grid sm:grid-cols-3 gap-8">
                <div>
                  <dt className="font-semibold text-foreground mb-1">Phone</dt>
                  <dd className="text-muted-foreground">
                    Ask about a paint finish or a stain before you book
                    <a href={OFFICE.phoneLink} className="mt-1 block text-lg font-semibold text-primary underline underline-offset-4">{OFFICE.phone}</a>
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-foreground mb-1">Address</dt>
                  <dd className="text-muted-foreground">
                    {OFFICE.address}
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=2835+37+Street+SW+%2324+Calgary+AB"
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
                    {hoursRowsFor("calgary").map(([days, time]) => (
                      <span key={days} className="block">{days}: {time}</span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Closing band. The rating-and-re-clean section and the final call to
          action were two navy bands; this is both, once. */}
      <section className="py-16 md:py-20 bg-brand-navy">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <Stars size={1.75} className="text-brand-gold" />
              </div>
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-3">
                {CITY_PROOF.calgary.googleRating} on Google from {CITY_PROOF.calgary.googleReviewCount} Calgary reviews
              </h2>
              <p className="text-xl font-semibold text-accent-on-dark mb-6">A missed mark is re-cleaned free</p>
              <p className="text-white/90 mb-4 max-w-xl mx-auto">
                Those are the reviews on{" "}
                <a href={getListing("calgary").reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">the Calgary branch's own Google listing</a>.
                Tell us within{" "}
                {POLICY.guaranteeWindowHours} hours about a wall we got wrong and it is put right at no
                charge.{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-4">Read the reviews</Link>{" "}
                before you decide; the company itself is on{" "}
                <Link to="/about-us/" className="text-white underline underline-offset-4">About Duty Cleaners</Link>.
              </p>
              <h3 className="text-2xl font-bold text-white mt-10 mb-3">Book the walls with the next clean</h3>
              <p className="text-white/90 mb-8 max-w-xl mx-auto">
                Spot cleaning from {formatPrice(WALL_FROM)} and the full wash from {formatPrice(WALL_FULL)} at the
                one-bedroom size, on top of a standard clean from {STANDARD_FROM} for a one-bedroom apartment or
                condo, all before GST and none of it charged until the clean is done. The pet charge, a home-type
                charge or the travel fee outside Calgary city limits can apply, and each one is on the quote before
                you book. The cleans it can ride on are listed under{" "}
                <Link to="/calgary/services/" className="text-white underline underline-offset-4">every Calgary cleaning service, with starting prices</Link>.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="accent" className="w-full sm:w-auto text-base px-8" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base border-white/30 text-white hover:bg-white/10" asChild>
                  <a href={OFFICE.phoneLink}>
                    <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                    {OFFICE.phone}
                  </a>
                </Button>
              </div>
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
