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
import postConstructionBeforeAfter from "@/assets/gallery/post-construction-before-after.webp";
import CityCrossLink from "@/components/CityCrossLink";
import { POLICY } from "@/data/policy";
import { COMPANY, RATING_CLAIM, CITY_PROOF } from "@/data/proof";
import { travelFee } from "@/data/addon-table";

import { startingPrice, formatPrice, sqftTierOptions, GST_RATE } from "@/data/pricing";
const REVIEWS = CITY_PROOF.edmonton.googleReviewCount;
/** A before-tax figure with 5% GST added, for the worked example. */
const withGst = (value: number) => formatPrice(Math.round(value * (1 + GST_RATE) * 100) / 100);
/* The figure /services/ already publishes for this service, from bk-config. */
const startingPriceLabel = formatPrice(startingPrice("post-construction"));
/* And the top of the real ladder. "Starts at $550" is true but anchors a
   visitor at the floor of a nine-tier table that reaches $1,900.
   Quoting a floor beside the words "no hidden fees" is how a page sets up its
   own quote call to disappoint. Derived, so it cannot drift from bk-config. */
const sqftTiers = sqftTierOptions("post-construction");
const topPriceLabel = formatPrice(sqftTiers[sqftTiers.length - 1]?.price ?? 0);
/* BookingKoala's tier names mix "sq/ft" and "SQFT"; the figures are the fact,
   the suffix is presentation. */
const tierLabel = (label: string) => label.replace(/\s*(sq\/ft|sqft)\s*$/i, " sq ft");
/* Post-construction carries its own travel-fee row, larger than the home-
   cleaning one. Read from bk-config, as /terms/ reads it. */
const pcTravelFee = formatPrice(travelFee("post-construction") ?? 0);

/* The title carries the derived floor and the payment term; the brand would
   push it past 60 characters. */
const PAGE_TITLE = `Post-Construction Cleaning Edmonton from ${startingPriceLabel} | Pay After`;
const META_DESCRIPTION = `Once the last trade leaves an Edmonton new build or renovation, post-construction cleaning is priced by square footage from ${startingPriceLabel} before GST.`;

/* Card titles were Title Case service-brochure headings ("Fine Dust & Debris
   Removal", "Kitchen Deep Cleaning") of the kind the Calgary twin was rewritten
   out of. They now name the thing on the page rather than a service line. */
const includedServices = [
  { icon: Wind, title: "Where the drywall dust ends up", desc: "Off the baseboards, the vents, the window ledges, the trim and the floors, wiped and vacuumed rather than moved from one surface to the next." },
  { icon: Sparkles, title: "Kitchen, inside the cabinets", desc: "Every cabinet and drawer inside and out, the counters, the backsplash, the sink, and the outside of the new appliances once their film is off." },
  { icon: Droplets, title: "Bathrooms, for first use", desc: "Tubs, showers, toilets, vanities, mirrors and tile, with the grout haze new tile carries taken off rather than spread." },
  { icon: SprayCan, title: "Floors, vacuumed before mopped", desc: "Hardwood, tile, vinyl and laminate. The grit is lifted first, because a mop grinds it into a floor that is a week old." },
  { icon: Shield, title: "Windows and mirrors, indoors", desc: "Paint flecks and label adhesive come off first; polishing over either one is how a new pane gets scratched." },
  { icon: Wind, title: "Doors, switches and sills", desc: "The handles and plates a trade opened all week, plus the baseboards and window sills below them, wiped clean." },
];

const excludedServices = [
  "Final-stage post-construction cleaning only: no rough construction cleanup and no active job-site cleaning",
  "No removal of construction debris, drywall scraps, or leftover building materials",
  "No hauling, disposal, or large debris removal services",
  "No removal of plastics from new appliances, and no removal of stickers from windows, doors, or surfaces",
  // Was "more than a two-step stool", a limit that appeared on this page and
  // nowhere else. NOT_INCLUDED in policy.ts sets it at a 3-step ladder, which is
  // what the crew carries and what every other page tells a customer.
  "Anything beyond the reach of a 3-step ladder, which is what the crew carries: no extension ladders, no scaffolding",
  "No exterior window cleaning, pressure washing, or outdoor surface cleaning",
];

/* "Flexible Scheduling", "Professional Equipment" and "Transparent Pricing"
   were card titles that could sit on any cleaning company's page in any city.
   Each now states the term it was standing in for. */
const whyChooseUs = [
  { icon: Calendar, title: "Booked around your possession date", desc: "The crew arrives in a booked window, 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM, rather than at an exact time. Give us the date the last trade finishes and book the first open slot after it." },
  { icon: Shield, title: "Pay after the clean", desc: "Nothing is charged when you book. The day before your appointment a temporary hold confirms the card is valid, and no money moves. Your card is charged once the clean is complete." },
  { icon: Sparkles, title: "Ledges, tracks and vents by hand", desc: "Four places a machine cannot do are wiped by hand: the ledges, the window tracks, the vent slots and the top edge of the trim." },
  { icon: Wrench, title: "What the crew brings, what the site needs", desc: "Vacuums, cloths, products and the 3-step ladder come with the crew. The site has to have power and running water, which on a new build is worth confirming with the builder." },
  { icon: Heart, title: `${POLICY.guaranteeWindowHours}-hour re-clean`, desc: `Tell us within ${POLICY.guaranteeWindowHours} hours about anything we missed and we re-clean it free of charge. Photos help the team find it and are not a condition.` },
  { icon: DollarSign, title: "The band is the price", desc: `${startingPriceLabel} to ${topPriceLabel}, before 5% GST, set by the square-footage band of the finished space. Nothing is added for a clean that runs long, and an address outside Edmonton city limits also pays the travel fee.` }
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
    a: "It is the clean that goes in after the trades have finished and the material has gone. It takes the sanding dust off the vent covers and out of the window channels and the new drawers, lifts the paint flecks and adhesive off the glass, and leaves the place fit to move into. It is neither rough cleanup nor a site clean: if a trade is still due back for something, the room is not ready for us.",
  },
  {
    q: "How much does post-construction cleaning cost in Edmonton?",
    a: `It is priced by the square footage of the finished space: ${startingPriceLabel} for ${tierLabel(sqftTiers[0]?.label ?? "").toLowerCase()}, rising by band to ${topPriceLabel} for ${tierLabel(sqftTiers[sqftTiers.length - 1]?.label ?? "")}, all before 5% GST. The band is set before you book and does not change if the clean runs long. Inside Edmonton city limits there is no travel fee; outside them a post-construction clean carries a ${pcTravelFee} travel fee.`,
  },
  {
    q: "Do you remove construction debris or leftover materials?",
    a: "No. Hauling, disposal and large debris removal are outside the service, and the crew arrives with cleaning equipment and no way to take material away. Offcuts, packaging, old fixtures and the empty tins leave with whoever brought them. A room with material still stacked in it cannot be cleaned properly either, because half the floor and most of the trim are underneath it.",
  },
  {
    q: "Can you clean my Edmonton home after a kitchen or bathroom renovation?",
    a: "Yes. Post-renovation cleaning of a single room is the same service on a smaller footprint. We detail cabinets inside and out and scrub tubs and tile. The drywall dust travels into the rooms around the one that was worked on, so tell us at booking which of those rooms took it.",
  },
  {
    q: "How is post-construction cleaning different from a regular deep clean?",
    a: "Post-construction cleaning targets the fine construction dust that settles on every surface, including inside cabinets, drawers, vents, and window tracks, as well as light paint splatters, smudges, and residue left behind by tradespeople. A deep clean does not open every cabinet and drawer, clear the window tracks, or lift paint flecks and adhesive residue off glass and fixtures. This one does.",
    more: { lead: "For a lived-in home with no building work, compare it with", to: "/edmonton/deep-cleaning/", anchor: "a deep clean in Edmonton" },
  },
  {
    q: "How long does a post-construction cleaning take?",
    a: "We work to a checklist, not a clock, and the crew stays until every item on the post-construction list is done. The price is set by the square-footage band before you book, and it does not change because the clean ran long. The booking gives an arrival window, 9:00 to 10:00 AM, 12:00 to 1:00 PM or 3:00 to 4:00 PM, rather than an exact start time.",
    more: { lead: "Once the dust stops resurfacing, the home moves onto", to: "/edmonton/regular-cleaning/", anchor: "a standard house clean in Edmonton" },
  },
  {
    q: "Do I need to be home during the cleaning?",
    a: `You do not need to be. Most of these jobs run on a code left in the booking notes, a key at the builder's site office, or whatever access the realtor has arranged — the only requirement is that it opens the door on the day, because if the crew cannot get in the lockout charge is ${POLICY.lockoutFee}. Every cleaner is reference-checked before a first job and rated by the customer afterwards.`,
  },
  {
    q: "Do you remove stickers from new windows and appliances?",
    a: "No. Peeling appliance film and scraping window decals is slow work and it is not cleaning; hurried, it leaves adhesive smears and scratches on glass nobody has used yet. Take them off before we come, or the crew cleans around them and tells you which ones it left.",
  },
  {
    q: "Do you clean inside appliances during post-renovation cleaning?",
    a: "The outside is wiped down; the interiors are not on this list. Nothing has been cooked in a new oven yet. If it is a renovation in a house you have been living in and you want the oven and the fridge done inside, those are their own rows on the booking form and belong on a deep clean.",
  },
  {
    q: "Can you clean a home that is not completely empty after renovations?",
    a: "Construction debris and materials do have to be gone before we start — that part is not negotiable, because our team is not equipped to haul it and it hides the surfaces we are there to clean. Furniture is a different question: a renovated kitchen or bathroom in a home you still live in is normal work for us, and we clean around what is there. Tell us at booking what is still in the rooms and we will say plainly whether a post-construction clean is the right service or whether a deep clean fits better.",
  },
  {
    q: "Is there a guarantee on a post-construction clean?",
    a: `Yes, and it is a re-clean. If any area of the post-construction clean is not right, tell us within ${POLICY.guaranteeWindowHours} hours and we return to re-clean it free of charge. Photos help the team find it and are not a condition. The commitment is the return visit rather than a refund, though you can call the Edmonton office on (780) 913-6565 to talk through anything else.`,
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

export default function EdmontonPostConstruction() {

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/post-construction-cleaning/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/post-construction-cleaning/" />
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
          {JSON.stringify(buildServiceSchema({ name: "Post-Construction Cleaning", description: META_DESCRIPTION, path: "/post-construction-cleaning", city: "edmonton", offerFrom: Number(startingPriceLabel.replace(/[^0-9.]/g, "")), offerTo: Number(topPriceLabel.replace(/[^0-9.]/g, "")), offerNote: "Set by square footage and scope; quoted before booking." }))}
        </script>
      </Helmet>

      <Navigation city="edmonton" />
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
                  <span className="text-white/90 text-sm font-medium">{RATING_CLAIM}{REVIEWS ? `, ${REVIEWS} reviews` : ""}</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-accent/20 backdrop-blur-sm rounded-full px-4 py-2">
                  <Home className="w-4 h-4 text-accent" />
                  <span className="text-accent text-sm font-semibold">Final-Stage Cleaning Only</span>
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                Post-Construction Cleaning in <span className="text-accent">Edmonton, AB</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/80 max-w-3xl mb-4">
                From {startingPriceLabel} before 5% GST for a finished space{" "}
                {tierLabel(sqftTiers[0]?.label ?? "").toLowerCase()}, priced by square footage; an address outside
                Edmonton city limits adds a travel fee. It is the final-stage clean for newly built and freshly
                renovated Edmonton homes, booked once the last trade has left.
              </p>
              <p className="text-base md:text-lg text-white/90 max-w-3xl mb-8">
                The crew takes fine drywall dust, smudges and contractor residue off cabinets, windows,
                baseboards and floors, and nothing is charged until the clean is done.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-10">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-white text-lg px-8">
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button asChild size="lg" className="bg-white/95 text-brand-navy hover:bg-white text-lg px-8">
                  <a href="tel:7809136565">
                    <Phone className="mr-2 w-5 h-5" />
                    (780) 913-6565
                  </a>
                </Button>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-white/80">
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Priced by square footage</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>Pay after the clean</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-accent" /><span>{POLICY.guaranteeWindowHours}-hour re-clean</span></div>
              </div>
            </div>
            <div className="flex-shrink-0 w-full lg:w-[500px]">
              <img width={640} height={832}
                src={postConstructionBeforeAfter}
                alt="Newly built interior after a post-construction clean, drywall dust removed from floors, sills and fixtures"
                className="rounded-2xl shadow-2xl w-full h-auto object-cover"
               loading="eager" fetchPriority="high"/>
            </div>
          </div>
        </div>
      </section>

      <LocalMarketNote
        eyebrow="Edmonton builds"
        heading="Where the post-construction work in Edmonton actually is"
        paragraphs={[
          "In a community still being built, the lots around a finished home keep producing dust long after that home is done, so a final clean scheduled before the neighbouring builds are closed in gets partly undone. We would rather come after the last trade has left than be the reason you clean twice.",
          "Furnace season runs from October into April, and a house sealed up that long cycles dust faster. In a winter-finished Edmonton home the drywall dust settles into the tops of door frames and closet shelves.",
        ]}
      />

      {/* Description Section */}
      <section className="py-20">
        <AnimatedSection>
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">What is left behind after the trades leave</h2>
              <p className="text-lg text-muted-foreground mb-4">
                Drywall dust settles on baseboards, vents, counters, window ledges, and floors. Fine particles work their way into cabinets and drawers. Smudges, fingerprints, and adhesive residue cling to windows, mirrors, and new fixtures. Painted walls hold a film of the same dust, and where a trade has left a mark on the paint it wants washing rather than wiping —{" "}
                <Link to="/wall-washing-wall-cleaning/" className="text-primary underline underline-offset-4">wall washing in Edmonton</Link>{" "}
                is a separate add-on, priced by the size of the home.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Duty Cleaners in Edmonton does <strong>final-stage post-construction cleaning</strong>, the clean that
                goes in once construction is complete and the space is empty of debris. That covers new builds, kitchen
                and bathroom remodels, basement renovations and whole-home refreshes. A finished home that is simply
                changing hands is{" "}
                <Link to="/move-out-cleaning-edmonton/" className="text-primary underline underline-offset-4">move-in cleaning in Edmonton</Link>{" "}
                instead, priced by bedrooms rather than square footage.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                <strong>Important:</strong> we do not provide rough construction cleanup, debris hauling, or active job-site cleaning. Our service begins after your contractor has finished and removed all materials.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Post-renovation cleaning, room by room */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 max-w-4xl">
          <AnimatedSection>
            <div className="text-center mb-8">
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Renovations</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Post-renovation cleaning after a kitchen, bathroom or basement remodel</h2>
            </div>
            <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
              <p>
                <strong className="text-foreground">Kitchen remodel.</strong> The dust from a kitchen goes into
                the new drawers before the drawers have anything in them. We wipe every cabinet and drawer
                inside and out, the counters, the backsplash and the outside of the new appliances. The
                appliance interiors are not part of this clean, and the film and stickers on them have to be
                off before we arrive, because peeling them is not cleaning and we do not do it.
              </p>
              <p>
                <strong className="text-foreground">Bathroom remodel.</strong> New tile carries a grout haze that
                wiping spreads and washing removes. The tub, the shower glass, the mirror and the vanity are
                cleaned for first use.
              </p>
              <p>
                <strong className="text-foreground">Basement renovation.</strong> A basement is the job where the
                dust does not stay put: the furnace draws it up and puts it through the rest of the house. Tell
                us at booking whether the upstairs was lived in through the work. A basement suite finished to
                rent out is the same clean; once it is furnished and guests start arriving, that becomes{" "}
                <Link to="/edmonton/airbnb-cleaning/" className="text-primary underline underline-offset-4">turnover cleaning for short-term rentals</Link>,
                which is priced by the hour rather than by square footage.
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-white">
              What a post-construction clean covers in Edmonton
            </h2>
            <p className="text-center text-white/90 mb-12 max-w-2xl mx-auto">
              Six parts of the clean: dust, kitchen, bathrooms, floors, interior glass, and the doors, handles and switches everyone touches.
            </p>
          </AnimatedSection>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
            {includedServices.map((item, index) => (
              <AnimatedSection key={index}>
                <div
                  className="group bg-white/10 backdrop-blur-sm rounded-xl p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:bg-white/15 cursor-default"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-accent/20 rounded-lg p-3 flex-shrink-0">
                      <item.icon className="w-6 h-6 text-accent transition-transform duration-500 group-hover:rotate-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 text-white">{item.title}</h3>
                      <p className="text-white/90">{item.desc}</p>
                    </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">What post-construction cleaning costs in Edmonton</h2>
              <p className="text-muted-foreground leading-relaxed">
                This is the one clean we price by square footage rather than by bedrooms, because the dust
                does not care how the rooms are divided. Pick the band the finished space falls in and that
                is the rate, before 5% GST. It does not rise if the clean runs long.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl overflow-hidden border border-border rounded-xl">
              <table className="w-full">
                <thead className="bg-brand-navy text-brand-navy-foreground">
                  <tr>
                    <th className="py-3 px-5 text-left text-sm font-bold">Finished space</th>
                    <th className="py-3 px-5 text-right text-sm font-bold">Flat rate, before GST</th>
                  </tr>
                </thead>
                <tbody>
                  {sqftTiers.map((t, i) => (
                    <tr key={t.id} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                      <td className="py-3 px-5 text-foreground">{tierLabel(t.label)}</td>
                      <td className="py-3 px-5 text-right font-bold text-foreground">{formatPrice(t.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mx-auto mt-6 max-w-3xl text-muted-foreground leading-relaxed space-y-4">
              <p>
                What changes the figure: the square footage band, and whether the address is inside Edmonton
                city limits. Outside them a post-construction clean carries a {pcTravelFee} travel fee, which is
                what a new build in Leduc or Beaumont pays on top of its band. The rest of what we do in
                Leduc, Beaumont and St. Albert is on their own pages:{" "}
                <Link to="/cleaning-services-leduc/" className="text-primary underline underline-offset-4">house cleaning in Leduc</Link>,{" "}
                <Link to="/cleaning-services-beaumont/" className="text-primary underline underline-offset-4">house cleaning in Beaumont</Link>{" "}
                and{" "}
                <Link to="/cleaning-services-st-albert/" className="text-primary underline underline-offset-4">St. Albert house cleaners</Link>.
              </p>
              {sqftTiers[2] && (
                <p>
                  Take a new house with a finished space in the {tierLabel(sqftTiers[2].label)} band. Inside the city
                  limits the clean is {formatPrice(sqftTiers[2].price)} before GST and {withGst(sqftTiers[2].price)} once
                  5% GST is added; the same house in Leduc adds the travel fee before the tax is worked out.
                </p>
              )}
              <p>
                Standard, deep and move-out cleans are priced by bedrooms and bathrooms instead; those rows are on{" "}
                <Link to="/pricing/" className="text-primary underline underline-offset-4">the full Edmonton price list</Link>.
                If the dust keeps coming back after the clean,{" "}
                <Link to="/edmonton/recurring-cleaning/" className="text-primary underline underline-offset-4">a recurring clean in Edmonton</Link>{" "}
                carries a discount from the second visit.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            {/* Was "Why Edmonton Homeowners Choose Duty Cleaners", a heading that
                promised a sales pitch and sat over six booking terms. */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What is settled before an Edmonton crew arrives</h2>
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            {/* "What We Don't Cover" over "To set clear expectations, here's what
                falls outside our scope" was the template at its plainest. */}
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Six jobs that are not ours</h2>
            <p className="text-center text-muted-foreground mb-4 max-w-2xl mx-auto">
              This is <strong>final-stage cleaning only</strong>. These six belong to the contractor or to
              you, and a crew that turns up to find them undone cannot start:
            </p>
            <p className="text-center text-sm text-muted-foreground mb-12 max-w-2xl mx-auto italic">
              Rough cleanup and debris removal are your contractor's job, and they have to be done before our team arrives.
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

      {/* Satisfaction Guarantee */}
      <section className="py-20 bg-brand-navy relative overflow-hidden">
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-accent/20 rounded-full px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-accent" />
                <span className="text-accent text-sm font-semibold uppercase">Cleaning Edmonton homes {COMPANY.sinceLabel}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Tell us within {POLICY.guaranteeWindowHours} hours if we missed a ledge</h2>
              <p className="text-lg text-white/90 mb-4">
                If any area of the post-construction clean is not right, tell us within{" "}
                {POLICY.guaranteeWindowHours} hours and we come back to re-clean it at no charge. Photos help
                the team find it and are not a condition.
              </p>
              <p className="text-base text-white/90 mb-8">
                The post-construction checklist names the cabinet interiors, the window tracks and the
                baseboards, so a miss is easy to point to. Our Edmonton team is rated{" "}
                {RATING_CLAIM}{REVIEWS ? ` across ${REVIEWS} reviews` : ""}; read them on the{" "}
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
              Questions Edmonton homeowners, builders and renovators ask before a post-construction clean.
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Talk to the Edmonton office</h2>
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Phone, title: "Give us a call", desc: "Questions before you book", action: "(780) 913-6565", href: "tel:7809136565" },
              { icon: MapPin, title: "Our office", desc: "18615 71 Ave NW\nEdmonton, AB", action: "Get Directions", href: getListing("edmonton").url },
              { icon: Clock, title: "Hours of operation", desc: "Mon-Sat: 8am–8pm\nSun: 9am–3pm", action: "Reviews", href: getListing("edmonton").reviewsUrl },
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
                The form quotes by square footage. Pick the band the finished space falls in and the price is
                on screen before you book; nothing is charged until the clean is done. The other cleans, with
                their starting prices, are listed under{" "}
                <Link to="/services/" className="text-white underline underline-offset-4">all Edmonton cleaning services and prices</Link>.
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
          <CityCrossLink city="Calgary" to="/post-construction-cleaning-calgary/" description="Post-construction cleaning for newly built and renovated Calgary homes." />
        </div>
      </section>
      </main>


      <Footer />
    </div>
  );
}
