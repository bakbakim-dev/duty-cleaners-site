import { getListing } from "@/lib/google-listings";
import LocalMarketNote from "@/components/LocalMarketNote";
import Navigation from "@/components/Navigation";
import { buildServiceSchema } from "@/lib/service-schema";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  Phone, Shield, Sparkles, Droplets, Wind, SprayCan,
  Ban, Star, Clock, MapPin, CheckCircle2, Heart,
  Home, DollarSign, Calendar, Wrench
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import calgaryPostConstructionBeforeAfter from "@/assets/gallery/calgary-post-construction-before-after.webp";
import CityCrossLink from "@/components/CityCrossLink";
import { POLICY } from "@/data/policy";
import { COMPANY, CITY_PROOF, RATING_CLAIM } from "@/data/proof";
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

const PAGE_TITLE = `Post-Construction Cleaning Calgary from ${startingPriceLabel} | Duty Cleaners`;
const META_DESCRIPTION = `Post-construction cleaning for a Calgary new build or renovation is priced by square footage, from ${startingPriceLabel} before GST for the smallest band.`;

const includedServices = [
  { icon: Wind, title: "Drywall dust, everywhere it settled", desc: "Tops of door frames, window channels, closet shelves, the vent covers and along every baseboard, wiped and vacuumed rather than pushed around." },
  { icon: Sparkles, title: "Kitchen and bathrooms", desc: "Cabinets and drawers inside and out, counters, sinks, tubs and showers, grout haze off new tile, and the outside of the new appliances once their film and stickers are off." },
  { icon: Droplets, title: "Floors", desc: "Vacuumed before they are mopped, so the grit is lifted rather than ground into new hardwood or vinyl by the mop." },
  { icon: SprayCan, title: "Interior glass", desc: "Windows, mirrors and glass doors, with paint flecks and adhesive lifted before the glass is polished." },
  { icon: Shield, title: "Doors, handles and switches", desc: "The surfaces a trade touched with a dusty hand, wiped clean." },
];

const excludedServices = [
  "Final-stage cleaning of a finished space only: no rough cleanup, and no work on a site where trades are still active",
  "Drywall offcuts, lumber, packaging and other debris are the contractor's to remove before we arrive",
  "No hauling or disposal of any kind",
  "Appliance film and window stickers stay on unless you or the builder take them off first",
  // The two-step stool was this page's own invention; policy.ts (NOT_INCLUDED)
  // puts the limit at a 3-step ladder and the rest of the site follows it.
  "The 3-step ladder the crew carries is the ceiling on height: no extension ladders, no scaffolding",
  "No exterior glass, pressure washing or outdoor surfaces",
];

const whyChooseUs = [
  { icon: Calendar, title: "Timed after the last trade", desc: "Book us for after the final walkthrough. A clean done while a trade still has a key gets undone by the next visit. Weekday and weekend slots depend on the schedule." },
  { icon: Shield, title: "Pay after the clean", desc: "Nothing is charged when you book. A temporary hold checks the card the day before, and the charge goes through once the clean is complete." },
  { icon: DollarSign, title: "Priced by square footage", desc: `${startingPriceLabel} to ${topPriceLabel} before 5% GST, by the size band of the finished space. The quote shows the band before you book, and a travel fee is added only outside Calgary city limits.` },
  { icon: Wrench, title: "Supplies and equipment", desc: "The team brings the vacuums, cloths and products. You need the power and water on, which on a new build means checking the builder has not shut them off." },
  { icon: Heart, title: `${POLICY.guaranteeWindowHours}-hour re-clean`, desc: `A ledge or a track we missed is re-cleaned free if you tell us within ${POLICY.guaranteeWindowHours} hours.` },
  { icon: Sparkles, title: "Reference-checked, rated by customers", desc: "Every cleaner is reference-checked before their first job and rated by the customer after every visit. Those ratings decide who we keep sending." },
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
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex flex-wrap items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-white/90 text-sm font-medium">{RATING_CLAIM}</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Home className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-semibold">After the last trade, not before</span>
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Post-Construction Cleaning in <span className="text-accent">Calgary, AB</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-4">
                From {startingPriceLabel} before 5% GST when the finished space is{" "}
                {tierLabel(sqftTiers[0]?.label ?? "").toLowerCase()}; the band rises with square footage, and a
                travel fee is added outside Calgary city limits. It is the final clean on Calgary new builds, renovations and conversions, booked for after
                the trades are out.
              </p>
              <p className="text-base md:text-lg text-white/90 max-w-3xl mb-8">
                The team takes drywall dust off the vent covers and out of the tracks and cabinets, and paint flecks and
                adhesive off the glass. Nothing is charged at booking; the card is charged once the clean is done.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8">
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button asChild size="lg" className="bg-white/95 text-brand-navy hover:bg-white text-lg px-8">
                  <a href="tel:4037681341">
                    <Phone className="mr-2 w-5 h-5" />
                    (403) 768-1341
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/80">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Square-footage bands, before GST</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Charged after the clean</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Missed spots re-cleaned free if reported within {POLICY.guaranteeWindowHours} hours</span></div>
              </div>
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

      <LocalMarketNote
        accent="calgary"
        eyebrow="Calgary builds"
        heading="Where the post-construction work in Calgary actually is"
        paragraphs={[
          "Houses in newer suburbs such as Mahogany, Seton and Livingston carry construction dust. Where the lots around a finished home are still being built, drywall dust from the lot next door keeps arriving after your own build is done, which is why a final clean too early gets undone and why we would rather come after the last trade than before.",
          "Calgary's freeze-thaw cycle makes the timing harder than it is elsewhere. Calgary thaws and refreezes on chinooks all winter, so sand and de-icer arrive at the door again and again from November to April. That grit ends up ground into new flooring and pushed into the corners of window channels, and it has to be lifted before anything wet touches it, or it just spreads.",
        ]}
      />

      {/* Description Section */}
      <section className="py-20">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What the trades leave, and what we do about it</h2>
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
                basements and whole-home renovations all book the same way, by the square footage of the space
                that was worked on.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                <strong>Not this service:</strong> rough cleanup, hauling, or a site where the trades are still
                coming and going. Our part starts once the contractor has finished and taken the material away.
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
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Builder handovers and the chinook week</h2>
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
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Renovations</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Post-renovation cleaning after a kitchen, bathroom or basement remodel in Calgary</h2>
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
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">What a Calgary post-construction clean covers</h2>
            <p className="text-center text-white/90 mb-12 max-w-2xl mx-auto">
              Five parts, in the order the team does them: the dust, the wet rooms, the floors, the glass, and everything a hand touches.
            </p>
          </AnimatedSection>
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
            {includedServices.slice(0, 3).map((item, index) => (
              <AnimatedSection key={index}>
                <div
                  className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-white/15 cursor-default h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-accent/20 rounded-lg p-3">
                      <item.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:rotate-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                    <p className="text-white/90">{item.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 mt-6 md:max-w-3xl">
            {includedServices.slice(3).map((item, index) => (
              <AnimatedSection key={index + 3}>
                <div
                  className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-white/15 cursor-default h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="bg-accent/20 rounded-lg p-3">
                      <item.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:rotate-6" />
                    </div>
                    <h3 className="font-semibold text-lg text-white">{item.title}</h3>
                    <p className="text-white/90">{item.desc}</p>
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
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Price List</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What post-construction cleaning costs in Calgary</h2>
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Six terms of a Calgary post-construction booking</h2>
          </AnimatedSection>
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyChooseUs.map((item, index) => (
              <AnimatedSection key={index}>
                <div
                  className="group bg-white rounded-xl p-6 border border-muted shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg h-full"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="bg-accent/10 rounded-lg w-12 h-12 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* What We Don't Offer Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Where this clean stops</h2>
            <p className="text-center text-muted-foreground mb-4 max-w-2xl mx-auto">
              Six things that are not in the price, written down so nobody finds out on the day.
            </p>
            <p className="text-center text-sm text-muted-foreground mb-12 max-w-2xl mx-auto italic">
              The contractor's cleanup and ours are two different jobs, and theirs comes first.
            </p>
          </AnimatedSection>
          <div className="max-w-3xl mx-auto space-y-4">
            {excludedServices.map((item, index) => (
              <AnimatedSection key={index}>
                <div className="flex items-start gap-4 bg-destructive/5 border border-destructive/10 rounded-xl p-5">
                  <Ban className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">{item}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-semibold uppercase">Cleaning Alberta homes {COMPANY.sinceLabel}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tell us within {POLICY.guaranteeWindowHours} hours and a missed track is re-cleaned free</h2>
              <p className="text-lg text-white/90 mb-4">
                Window tracks and the tops of door frames are where a post-construction clean gets caught out, so
                both are on the checklist. If something was still missed, tell us within{" "}
                {POLICY.guaranteeWindowHours} hours and we come back to it at no charge. Photos help; they are not a
                condition.
              </p>
              <p className="text-base text-white/90 mb-8">
                The Calgary listing is rated {RATING_CLAIM} across {CITY_PROOF.calgary.googleReviewCount} reviews, and
                you can read them on the{" "}
                <Link to="/reviews/" className="text-white underline underline-offset-4">reviews page</Link>.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white">
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button asChild size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  <a href="/about-us/">About Duty Cleaners</a>
                </Button>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Post-Construction Cleaning FAQs</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">The Calgary office</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Phone, title: "Phone", desc: "Questions before you book", action: "(403) 768-1341", href: "tel:4037681341" },
              { icon: MapPin, title: "Address", desc: "2835 37 Street SW #24\nCalgary, AB", action: "Get Directions", href: getListing("calgary").url },
              { icon: Clock, title: "Hours", desc: "Mon-Sat: 8am–8pm\nSun: 9am–3pm", action: "Google listing", href: getListing("calgary").reviewsUrl },
            ].map((card, index) => (
              <AnimatedSection key={index}>
                <div
                  className="group bg-white rounded-xl p-6 text-center border border-muted shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-lg"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="bg-accent/10 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                    <card.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground mb-4 whitespace-pre-line">{card.desc}</p>
                  <Button asChild variant="outline" className="border-accent/30 text-accent hover:bg-accent/5">
                    <a href={card.href} target={card.href.startsWith("http") ? "_blank" : undefined} rel={card.href.startsWith("http") ? "noopener noreferrer" : undefined}>
                      {card.action}
                    </a>
                  </Button>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Section: one promise, the instant price */}
      <section id="contact-form" className="py-20 lg:py-12 bg-brand-navy relative overflow-hidden scroll-mt-20">
        <div className="absolute top-10 right-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">See My Instant Price</h2>
              <p className="text-white/90 mb-8">
                The form asks for the square footage band and the date, and shows the price before you book. The other cleans
                are listed under{" "}
                <Link to="/calgary/services/" className="text-white underline underline-offset-4">every Calgary cleaning service, with starting prices</Link>.
              </p>
              <a
                href="#quote"
                className="inline-flex h-14 items-center justify-center rounded-md bg-accent px-10 text-lg font-bold text-accent-foreground shadow-lg shadow-accent/30 transition-colors hover:bg-accent/90"
              >
                See My Instant Price
              </a>
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
