import { getListing } from "@/lib/google-listings";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Shield, Droplets, Wind, SprayCan, Star, Sparkles } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import calgaryPostConstructionBeforeAfter from "@/assets/gallery/calgary-post-construction-before-after.webp";
import CityCrossLink from "@/components/CityCrossLink";
import { POLICY } from "@/data/policy";
import { COMPANY, CITY_PROOF, RATING_CLAIM, hoursRowsFor } from "@/data/proof";
import { travelFee } from "@/data/addon-table";

import { startingPrice, formatPrice, sqftTierOptions, withGst } from "@/data/pricing";
/* The figure /calgary/services/ already publishes for this service, from bk-config. */
const startingPriceLabel = formatPrice(startingPrice("post-construction"));
/* And the top of the real ladder. "Starts at $550" is true but anchors a
   visitor at the floor of a nine-tier table that reaches $1,900, and the
   new-build communities this page names (Seton, Mahogany, Livingston) are not
   sub-1000 sq ft homes. Derived, so it cannot drift from bk-config. */
const sqftTiers = sqftTierOptions("post-construction");
const topPriceLabel = formatPrice(sqftTiers[sqftTiers.length - 1]?.price ?? 0);
/* BookingKoala's tier names mix "sq/ft" and "SQFT"; the figures are the fact,
   the suffix is presentation. */
const tierLabel = (label: string) => label.replace(/\s*(sq\/ft|sqft)\s*$/i, " sq ft");
/* Post-construction carries its own travel-fee row, larger than the home-
   cleaning one. Read from bk-config, as /terms/ reads it. */
const pcTravelFee = formatPrice(travelFee("post-construction") ?? 0);
const OFFICE = CITY_PROOF.calgary;

const PAGE_TITLE = `Post-Construction Cleaning Calgary from ${startingPriceLabel} | Duty Cleaners`;
const META_DESCRIPTION = `Post-construction cleaning for a Calgary new build or renovation is priced by square footage, from ${startingPriceLabel} before GST for the smallest band.`;

const includedServices = [
  { icon: Wind, title: "Drywall dust, everywhere it settled", desc: "Tops of door frames, window channels, closet shelves, the vent covers and along every baseboard, wiped and vacuumed rather than pushed around." },
  { icon: Sparkles, title: "Kitchen and bathrooms", desc: "Cabinets and drawers inside and out, counters, sinks, tubs and showers, grout haze off new tile, and the outside of the new appliances once their film and stickers are off." },
  { icon: Droplets, title: "Floors", desc: "Vacuumed before they are mopped, so the grit is lifted rather than ground into new hardwood or vinyl by the mop." },
  { icon: SprayCan, title: "Interior glass", desc: "Windows, mirrors and glass doors, with paint flecks and adhesive lifted before the glass is polished." },
  { icon: Shield, title: "Doors, handles and switches", desc: "The surfaces a trade touched with a dusty hand, wiped clean." },
];

/* The six limits, grouped by whose job each one is. They used to be six
   red-bordered rows with a Ban icon apiece. */
const excludedServices = [
  {
    heading: "The contractor's part, which comes first",
    items: [
      "Final-stage cleaning of a finished space only: no rough cleanup, and no work on a site where trades are still active",
      "Drywall offcuts, lumber, packaging and other debris are the contractor's to remove before we arrive",
      "No hauling or disposal of any kind",
    ],
  },
  {
    heading: "Beyond the reach of this clean",
    items: [
      "Appliance film and window stickers stay on unless you or the builder take them off first",
      // The two-step stool was this page's own invention; policy.ts (NOT_INCLUDED)
      // puts the limit at a 3-step ladder and the rest of the site follows it.
      "The 3-step ladder the crew carries is the ceiling on height: no extension ladders, no scaffolding",
      "No exterior glass, pressure washing or outdoor surfaces",
    ],
  },
];

const whyChooseUs = [
  { title: "Timed after the last trade", desc: "Book us for after the final walkthrough. A clean done while a trade still has a key gets undone by the next visit. Weekday and weekend slots depend on the schedule." },
  { title: "Pay after the clean", desc: "Nothing is charged when you book. A temporary hold checks the card the day before, and the charge goes through once the clean is complete." },
  { title: "Priced by square footage", desc: `${startingPriceLabel} to ${topPriceLabel} before 5% GST, by the size band of the finished space. The quote shows the band before you book, and a travel fee is added only outside Calgary city limits.` },
  { title: "Supplies and equipment", desc: "The team brings the vacuums, cloths and products. You need the power and water on, which on a new build means checking the builder has not shut them off." },
  { title: `${POLICY.guaranteeWindowHours}-hour re-clean`, desc: `A ledge or a track we missed is re-cleaned free if you tell us within ${POLICY.guaranteeWindowHours} hours.` },
  { title: "Reference-checked, rated by customers", desc: "Every cleaner is reference-checked before their first job and rated by the customer after every visit. Those ratings decide who we keep sending." },
];

/**
 * `more` is a trailing sentence with a link, rendered after the answer and
 * folded into the FAQPage text as plain words, so the markup and the visible
 * answer still say the same thing.
 */
interface Faq {
  q: string;
  a: string;
  more?: { lead: string; to: string; anchor: string };
}

const faqs: Faq[] = [
  {
    q: "What is final-stage post-construction cleaning?",
    a: "It is the clean that happens after the last trade has packed up and the debris is gone: the drywall dust off every surface it settled on, the smudges and paint flecks off the glass, the adhesive off the fixtures, so the home can be moved into. It is not a site clean. If there is still a drywall offcut in the corner or a plumber due on Thursday, the space is not ready for us.",
  },
  {
    q: "How much does post-construction cleaning cost in Calgary?",
    a: `From ${startingPriceLabel} for the smallest square-footage band to ${topPriceLabel} for the largest, before 5% GST. The band is set by the square footage of the finished space. Outside Calgary city limits a post-construction clean adds a ${pcTravelFee} travel fee. If any space needs substantially more work than described, the team explains what it found and the options before continuing.`,
  },
  {
    q: "Do you remove construction debris or leftover materials?",
    a: "No. Offcuts, lumber, packaging and the empty paint cans go with the contractor. We are not set up to haul anything, and debris hides the surfaces we are there to clean, so a room with material still in it does not get cleaned properly either.",
  },
  {
    q: "Can you clean my Calgary home after a kitchen or bathroom renovation?",
    a: "Yes. A single-room renovation is the same clean on a smaller footprint. The dust from a kitchen or bathroom job settles in the rooms around it as well, so tell us at booking which of those rooms took the dust. The cabinets and tile in the new room get done inside and out.",
  },
  {
    q: "How is post-construction cleaning different from a regular deep clean?",
    a: "The difference is the dust. A deep clean is built for a lived-in home: grease, scale, the baseboards and the fridge top. This clean is built for fine drywall dust, which gets inside cabinets, drawers, vents and window tracks and keeps coming back for weeks, plus the paint flecks and adhesive a trade leaves on glass and fixtures. Every cabinet and drawer is opened, every vent cover wiped, every track cleared.",
    more: { lead: "For a Calgary home with no building work in it, the right service is", to: "/calgary/deep-cleaning/", anchor: "a deep clean in Calgary" },
  },
  {
    q: "How long does a post-construction cleaning take?",
    a: "It depends on the square footage, the number of bathrooms and how much dust the trades left, so we do not quote a number of hours for a Calgary post-construction clean. We work to a checklist, not a clock. Your team stays until every task in your service scope is complete, and your flat rate does not change based on how long it takes.",
    more: { lead: "Once the house has stopped shedding dust, what it needs after that is", to: "/calgary/regular-cleaning/", anchor: "a standard house clean in Calgary" },
  },
  {
    q: "Do I need to be home during the cleaning?",
    a: `No. A lockbox code, a key with the site super, or the builder's access arrangement all work; put it in the booking notes. If the team arrives and cannot get in, the lockout charge is ${POLICY.lockoutFee}. Every cleaner is reference-checked and rated by the customer after each visit.`,
  },
  {
    q: "Do you remove stickers from new windows and appliances?",
    a: "No. The window labels, the plastic film on the appliances and the decals on the glass are the builder's or the homeowner's to take off before we arrive. If they are still on, we clean around them.",
  },
  {
    q: "Do you clean inside appliances during post-renovation cleaning?",
    a: "No. The outside of every appliance is wiped down; the inside is not part of this clean, and a new oven or fridge has nothing in it yet. For older appliances that stayed through a renovation, the oven and fridge interiors are part of a move-out clean and add-ons on a deep clean.",
  },
  {
    q: "Can you clean a home that is not completely empty after renovations?",
    a: "Furniture, yes. Debris, no. A renovated kitchen in a house you are still living in is normal work, and we clean around what is there. Building material has to be gone, because we cannot haul it and it hides the surfaces we are there for. Say at booking what is still in the rooms and we tell you whether this clean or a deep clean is the right one.",
  },
  {
    q: "What is the guarantee on a Calgary post-construction clean?",
    a: `The guarantee is a re-clean. Tell us within ${POLICY.guaranteeWindowHours} hours about a track, a ledge or a cabinet that was missed and we come back to re-clean it at no charge. Photos help the team find it; they are not a condition. It is not a money-back guarantee, though you can call the Calgary office at (403) 768-1341 to talk it through.`,
  },
];

/** The answer as the FAQPage schema carries it: the visible words, link flattened. */
const faqText = (f: Faq) => (f.more ? `${f.a} ${f.more.lead} ${f.more.anchor}.` : f.a);

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div ref={ref} className={`transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}>
      {children}
    </div>
  );
}

export default function CalgaryPostConstruction() {

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/post-construction-cleaning-calgary/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/post-construction-cleaning-calgary/" />
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
              acceptedAnswer: { "@type": "Answer", text: faqText(f) },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(buildServiceSchema({ name: "Post-Construction Cleaning", description: META_DESCRIPTION, path: "/post-construction-cleaning-calgary", city: "calgary", offerFrom: Number(startingPriceLabel.replace(/[^0-9.]/g, "")), offerTo: Number(topPriceLabel.replace(/[^0-9.]/g, "")), offerNote: "Set by square footage and scope; quoted before booking." }))}
        </script>
      </Helmet>

      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 bg-brand-navy overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              {/* H1, one priced sentence, the two buttons, the rating. The rest of
                  what the hero used to say is in the row under it and in the
                  section after the local note. */}
              <h1 className="display-serif text-4xl md:text-5xl font-bold leading-[1.1] mb-6 text-white">
                Post-Construction Cleaning in <span className="text-accent-on-dark">Calgary, AB</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-8">
                From {startingPriceLabel} before 5% GST when the finished space is{" "}
                {tierLabel(sqftTiers[0]?.label ?? "").toLowerCase()}; the card is charged once the clean is done,
                not at booking.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                  <a href="tel:4037681341">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />
                    (403) 768-1341
                  </a>
                </Button>
              </div>
              <p className="flex items-center justify-center lg:justify-start gap-2 text-sm font-medium text-white/90">
                <Star className="w-4 h-4 text-brand-gold fill-current" aria-hidden="true" />
                <span>{RATING_CLAIM}, from {OFFICE.googleReviewCount} Calgary reviews</span>
              </p>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <img width={1024} height={1024}
                src={calgaryPostConstructionBeforeAfter}
                alt="Illustration contrasting a house interior strewn with construction debris and an empty room with polished hardwood floors"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
               loading="eager" fetchPriority="high"/>
            </div>
          </div>
        </div>
      </section>

      {/* What the hero's second pill and three ticks said, in one row, with the
          travel fee next to the from-price above it. */}
      <div className="border-b border-border bg-secondary/30">
        <ul className="container mx-auto px-4 py-3 flex flex-wrap justify-center gap-x-8 gap-y-1 text-sm text-muted-foreground">
          <li>Booked after the last trade</li>
          <li>The band rises with square footage, and outside Calgary city limits a post-construction clean adds a {pcTravelFee} travel fee</li>
          <li>Missed spots re-cleaned free if reported within {POLICY.guaranteeWindowHours} hours</li>
        </ul>
      </div>

      <LocalMarketNote
        accent="calgary"
        eyebrow="Calgary builds"
        heading="When to schedule your Calgary post-construction clean"
        paragraphs={[
          "Whether the work is a renovation or a new home in Mahogany, Seton or Livingston, describe the actual construction cleanup needed. Do not choose the service from the age or neighbourhood of the house alone. Tell the office which trades still need access before agreeing on a final-clean date.",
          "Confirm safe entry, working utilities and any care instructions for new flooring, fixtures or finishes. If work will continue after the clean, further dust may settle. Repairs, hazardous-material cleanup and duct cleaning are outside this service.",
        ]}
      />

      {/* Description Section */}
      <section className="py-20">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="display-serif text-3xl md:text-4xl font-bold mb-6">What the trades leave, and what we do about it</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Sanding dust does not fall; it drifts, and it lands on the top of every door frame, inside every
                vent, along every window channel and in the drawers of the cabinets that were installed last week.
                Tile leaves a grout haze. Painters leave flecks on the glass. Whoever fitted the fixtures left a
                fingerprint on each one. The flecks come off the glass with the dust; a scuff on the paint itself
                is a different job, and that one is{" "}
                <Link to="/wall-washing-wall-cleaning-calgary/" className="text-primary underline underline-offset-4">wall washing in Calgary</Link>,
                added to the clean and priced by home size.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                The Calgary team does <strong>final-stage post-construction cleaning</strong>, the{" "}
                <Link to="/move-out-cleaning-calgary/" className="text-primary underline underline-offset-4">move-in clean</Link>{" "}
                that follows the last trade out of the building. New builds, kitchen and bathroom remodels, finished
                basements, conversions and whole-home renovations all book the same way, by the square footage of the space
                that was worked on.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Rough cleanup, hauling and a site where the trades are still coming and going are not part of
                this service. Our part starts once the contractor has finished and taken the material away,
                and the limits are set out under{" "}
                <a href="#clean-stops" className="text-primary underline underline-offset-4">where this clean stops</a>.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Calgary-only: handovers and the chinook cycle */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-8">
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Two Calgary jobs</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">Builder handovers and the chinook week</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                <strong className="text-foreground">Possession day in Seton, Mahogany or Livingston.</strong> Our
                clean is booked for the days after possession, before the movers arrive with the furniture. It goes
                to the window channels, the tops of the door frames, the vent covers
                and the cabinet drawers, which is where possession-day dust is. If the lot next door is still being
                framed, say so at booking: the dust keeps arriving until that house is closed in, and we would rather
                schedule around it than have you pay twice.
              </p>
              <p>
                <strong className="text-foreground">The chinook week.</strong> When a chinook thaws the city and it
                refreezes, sand and de-icer come in on the boots. Grit is vacuumed before anything wet touches the
                floor, or the mop grinds it into new hardwood.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Post-renovation cleaning */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-8">
              <h2 className="display-serif text-3xl md:text-4xl font-bold">Post-renovation cleaning after a kitchen, bathroom or basement remodel in Calgary</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                <strong className="text-foreground">Kitchen.</strong> The new cabinets are wiped inside and out
                before anything goes in them, the counters and backsplash are cleaned of grout haze and silicone
                smears, and the outside of the appliances is done once their film is off. Inside the oven and
                fridge is not part of this clean; there is nothing in them yet.
              </p>
              <p>
                <strong className="text-foreground">Bathroom.</strong> Tile dust and grout haze come off the new
                tile, and the shower glass and the mirror are cleaned for first use.
              </p>
              <p>
                <strong className="text-foreground">Basement.</strong> Dust from a basement job does not stay
                downstairs, because the furnace can carry it through the house, so we ask at booking whether the rest of the house was
                lived in during the work and price the clean for the space that needs it. A basement suite
                finished to let is the same job until the first guest arrives; after that it is{" "}
                <Link to="/airbnb-cleaning-services-calgary/" className="text-primary underline underline-offset-4">turnover cleaning for short-term rentals in Calgary</Link>,
                which is priced by the hour.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* What's Included Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">What a Calgary post-construction clean covers</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Five parts, in the order the team does them: the dust, the wet rooms, the floors, the glass, and everything a hand touches.
            </p>
          </AnimatedSection>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {includedServices.slice(0, 3).map((item, index) => (
              <AnimatedSection key={index}>
                <div className="bg-white rounded-xl border border-border p-6 h-full">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-accent/10 rounded-lg p-3">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-6 md:max-w-3xl">
            {includedServices.slice(3).map((item, index) => (
              <AnimatedSection key={index + 3}>
                <div className="bg-white rounded-xl border border-border p-6 h-full">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-accent/10 rounded-lg p-3">
                      <item.icon className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Price by square footage */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4">What post-construction cleaning costs in Calgary</h2>
              <p className="text-muted-foreground leading-relaxed">
                Bedrooms do not predict dust; floor area does, so this is the one clean priced by square footage.
                Each band has one figure, with the GST shown beside it because the form adds it at the end and
                the number on the card should not be a surprise.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl overflow-hidden border border-border rounded-xl">
              <table className="w-full">
                <thead className="bg-brand-navy text-brand-navy-foreground">
                  <tr>
                    <th className="py-3 px-5 text-left text-sm font-bold">Finished space</th>
                    <th className="py-3 px-5 text-right text-sm font-bold">Before GST</th>
                    <th className="py-3 px-5 text-right text-sm font-bold">With 5% GST</th>
                  </tr>
                </thead>
                <tbody>
                  {sqftTiers.map((t, i) => (
                    <tr key={t.id} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                      <td className="py-3 px-5 text-foreground">{tierLabel(t.label)}</td>
                      <td className="py-3 px-5 text-right font-bold text-foreground">{formatPrice(t.price)}</td>
                      <td className="py-3 px-5 text-right text-foreground">{formatPrice(withGst(t.price))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mx-auto mt-6 max-w-3xl text-muted-foreground leading-relaxed space-y-4">
              <p>
                Inside Calgary city limits no travel fee is added to the band. Outside them a post-construction clean
                carries a {pcTravelFee} travel fee, so a new build in Airdrie or Cochrane pays its square-footage
                band plus that. The rest of what we do in each town is on its own page:{" "}
                <Link to="/cleaning-services-airdrie/" className="text-primary underline underline-offset-4">house cleaning in Airdrie</Link>{" "}
                and{" "}
                <Link to="/cleaning-services-cochrane/" className="text-primary underline underline-offset-4">house cleaning in Cochrane</Link>.
              </p>
              <p>
                Standard, deep and move-out cleans are priced by bedrooms and bathrooms, and those rows are on{" "}
                <Link to="/calgary/pricing/" className="text-primary underline underline-offset-4">Calgary house cleaning prices by home size</Link>.
                In a community still being built around the house, drywall dust from the lots next door keeps
                arriving after possession, and if you would rather not chase it,{" "}
                <Link to="/calgary/recurring-cleaning/" className="text-primary underline underline-offset-4">a recurring clean in Calgary</Link>{" "}
                is discounted from the second visit onward.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">Six terms of a Calgary post-construction booking</h2>
          </AnimatedSection>
          {/* The six terms, set as a definition list: a term and its sentence,
              no icon and nothing that lifts on hover. */}
          <AnimatedSection>
            <dl className="max-w-5xl mx-auto grid md:grid-cols-2 gap-x-12 gap-y-8">
              {whyChooseUs.map((item) => (
                <div key={item.title} className="border-t border-border pt-4">
                  <dt className="font-semibold text-lg text-foreground mb-1">{item.title}</dt>
                  <dd className="text-muted-foreground">{item.desc}</dd>
                </div>
              ))}
            </dl>
          </AnimatedSection>
        </div>
      </section>

      {/* What We Don't Offer Section */}
      <section id="clean-stops" className="py-20 bg-muted/30 scroll-mt-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">Where this clean stops</h2>
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              Six things that are not in the price, written down so nobody finds out on the day.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="max-w-4xl mx-auto bg-white border border-border rounded-xl p-6 md:p-8 grid md:grid-cols-2 gap-8">
              {excludedServices.map((group) => (
                <div key={group.heading}>
                  <h3 className="font-semibold text-lg text-foreground mb-3">{group.heading}</h3>
                  <ul className="list-disc pl-5 space-y-3 text-muted-foreground">
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">Post-construction cleaning FAQs</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              The questions Calgary buyers, renovators and site supers ask before they book.
            </p>
          </AnimatedSection>
          <AnimatedSection>
            <div className="max-w-3xl mx-auto">
              <Accordion type="single" collapsible className="space-y-3">
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={index}
                    value={`item-${index}`}
                    className="bg-white rounded-xl border border-muted shadow-sm px-5"
                  >
                    <AccordionTrigger className="text-left font-semibold hover:no-underline">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.a}
                      {faq.more && (
                        <>
                          {" "}{faq.more.lead}{" "}
                          <Link to={faq.more.to} className="text-primary underline underline-offset-4">{faq.more.anchor}</Link>.
                        </>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">The Calgary office</h2>
          </AnimatedSection>
          {/* Phone, address and hours in one block. Hours are read from
              proof.ts. The "Hours" card used to end in a "Google listing"
              button; that link moved down beside the rating. */}
          <AnimatedSection>
            <dl className="max-w-4xl mx-auto bg-white border border-border rounded-xl p-6 md:p-8 grid sm:grid-cols-3 gap-8">
              <div>
                <dt className="font-semibold text-foreground mb-1">Phone</dt>
                <dd className="text-muted-foreground">
                  Questions before you book
                  <a href={OFFICE.phoneLink} className="mt-1 block text-lg font-semibold text-primary underline underline-offset-4">{OFFICE.phone}</a>
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-foreground mb-1">Address</dt>
                <dd className="text-muted-foreground">
                  {OFFICE.address}
                  <a href={getListing("calgary").url} target="_blank" rel="noopener noreferrer" className="mt-1 block font-semibold text-primary underline underline-offset-4">Get Directions</a>
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
          </AnimatedSection>
        </div>
      </section>

      {/* Closing band: the re-clean promise, where the reviews are, and the
          price button. Two navy sections became this one; the old one was
          headed with its button's own label and had a contact-form id. */}
      <section className="py-20 bg-brand-navy">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="display-serif text-3xl md:text-4xl font-bold text-white mb-4">Tell us within {POLICY.guaranteeWindowHours} hours and a missed track is re-cleaned free</h2>
              <p className="text-lg text-white/90 mb-4">
                Window tracks and the tops of door frames are where a post-construction clean gets caught out, so
                both are on the checklist. Photos of a miss help; they are not a condition.
              </p>
              <p className="text-base text-white/90 mb-4">
                Duty Cleaners has cleaned Alberta homes {COMPANY.sinceLabel}. The Calgary listing is rated{" "}
                {RATING_CLAIM} across {CITY_PROOF.calgary.googleReviewCount} reviews, and
                you can read them on the{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-4">reviews page</Link>{" "}
                or open{" "}
                <a href={getListing("calgary").reviewsUrl} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4">the Calgary branch's Google listing</a>.
                The company is described on{" "}
                <Link to="/about-us/" className="text-white underline underline-offset-4">About Duty Cleaners</Link>.
              </p>
              <p className="text-base text-white/90 mb-8">
                The form asks for the square footage band and the date, and shows the price before you book. The other cleans
                are listed under{" "}
                <Link to="/calgary/services/" className="text-white underline underline-offset-4">every Calgary cleaning service, with starting prices</Link>.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8">
                  <a href={OFFICE.phoneLink}>
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />
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
          <CityCrossLink city="Edmonton" to="/post-construction-cleaning/" description="Post-construction cleaning for newly built and renovated Edmonton homes." />
        </div>
      </section>
      </main>

      <Footer />
    </div>
  );
}
