import { BUSINESS_TRADE_TYPE } from "@/data/proof";
import { CITY_PROOF } from "@/data/proof";
import { POLICY, ARRIVAL_WINDOWS } from "@/data/policy";
import CityCrossLink from "@/components/CityCrossLink";
import { Helmet } from "react-helmet-async";
import Navigation from "@/components/Navigation";
import ResponsiveImage, { SIZES } from "@/components/ResponsiveImage";
import Stars from "@/components/Stars";
import calgaryMoveInOutHero from "@/assets/calgary-move-in-out-hero.webp?col";
import calgaryKitchenClean from "@/assets/gallery/calgary-kitchen-clean.webp?card";
import calgaryBathroomClean from "@/assets/gallery/calgary-bathroom-clean.webp?card";
import calgaryLivingRoomClean from "@/assets/gallery/calgary-living-room-clean.webp?card";
import calgaryMoveOutClean from "@/assets/gallery/calgary-move-out-clean.webp?col";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import { Shield, DollarSign, Award } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import MoveOutDepth from "@/components/MoveOutDepth";
import MoveOutServiceAreas from "@/components/MoveOutServiceAreas";
import { moveInOutTierRows, addOnFromPrice, formatPrice } from "@/data/pricing";
import { TRAVEL_FEE_KEY } from "@/data/addon-table";
import { buildServiceSchema } from "@/lib/service-schema";
import {
  schemaAddressFor,
  branchGeoFor,
  BRANCH_ID,
  ORG_ID,
  CALGARY_RATING_CLAIM,
  BRANCH_IDENTITY,
  openingHoursShortFor,
  openingHoursSpecFor,
} from "@/data/proof";

/*
  Every figure on this page is derived. The three price cards and the travel
  fee used to be hand-typed; they happened to be right, which is the dangerous
  version, because the Edmonton twin derives the same figures and the next
  bk-config change would have moved one page and not the other.
  published-prices.test.ts now bans dollar literals under src/pages outright.
*/
const MOVE_ROWS = moveInOutTierRows();
const MOVE_FROM = MOVE_ROWS[0]?.price ?? "";
const MOVE_TO = MOVE_ROWS[MOVE_ROWS.length - 1]?.price ?? "";
const TRAVEL_FEE_LABEL = (() => {
  const value = addOnFromPrice("standard", TRAVEL_FEE_KEY);
  return value === null ? "a travel fee" : formatPrice(value);
})();
/** The compulsory pet charge, from bk-config, for the price answers. */
const PET_LABEL = (() => {
  const value = addOnFromPrice("standard", "must-choose-if-you-have-pets");
  return value === null ? "a pet charge" : formatPrice(value);
})();
/** ", from $X" for a move-in/out add-on, or nothing when bk-config has no such row. */
const addOnLabel = (key: string) => {
  const value = addOnFromPrice("move-in-out", key);
  return value === null ? "" : `, from ${formatPrice(value)}`;
};

// Derived, never hand-typed (published-prices.test.ts): the cheapest
// move-in/out tier from bk-config is the honest floor.
const moveInOutFromPrice = () => moveInOutTierRows()[0]?.price ?? "";

const META_DESCRIPTION = `End of tenancy and move-out cleaning in Calgary is ${MOVE_FROM} before GST for a one-bedroom, and a miss reported within ${POLICY.guaranteeWindowHours} hours is re-cleaned free.`;
const PAGE_TITLE = `Move Out Cleaning Calgary from ${MOVE_FROM} | Duty Cleaners`;
/** The three-up detail-shot grid (md:grid-cols-3 in a max-w-6xl container): a third of the row from 768 px, capped by the container. */
const THREE_UP_SIZES = "(min-width: 1152px) 360px, (min-width: 768px) 33vw, 100vw";

/**
 * The branch node. It used to carry the hours because buildServiceSchema did
 * not model them; since 2026-09-11 that builder publishes them too, from the
 * same proof.ts helper, so the two agree. It reuses BRANCH_ID, so this merges
 * into the existing Calgary entity instead of declaring a second anonymous
 * business — which is what the Edmonton twin was doing with a hardcoded
 * street address that could drift from proof.ts.
 */
const branchSchema = () => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    additionalType: BUSINESS_TRADE_TYPE,
    "@id": BRANCH_ID.calgary,
    name: BRANCH_IDENTITY.calgary.name,
    telephone: CITY_PROOF.calgary.phoneE164,
    email: "support@dutycleaners.ca",
    address: schemaAddressFor("calgary"),
    // The office pin, matching the address (data/proof.ts).
    geo: branchGeoFor("calgary"),
    url: BRANCH_IDENTITY.calgary.url,
    /* No priceRange here. This node shares BRANCH_ID with the Calgary hub,
       which publishes the site-wide band, and a second value on the same @id
       made one business advertise two different ranges. The move-out band
       belongs to the SERVICE; the tier table on the page carries it. */
    openingHours: openingHoursShortFor("calgary"),
    openingHoursSpecification: openingHoursSpecFor("calgary"),
    parentOrganization: { "@id": ORG_ID },
  };
};

// The FAQ accordion renders these ten Q&As and the FAQPage schema reads the
// same array, so the markup can never say something the page does not.
// Every figure comes from pricing.ts or policy.ts.
const faqs = [
  {
    q: "How much does move out cleaning cost in Calgary?",
    a: `From ${MOVE_FROM} for a one-bedroom to ${MOVE_TO} for five bedrooms, before 5% GST, at the apartment rate. Six and seven bedrooms cost more and are priced by the instant quote. A townhouse or two-storey house adds a home-type charge, a home with pets adds ${PET_LABEL}, and an address outside Calgary city limits adds ${TRAVEL_FEE_LABEL} in travel. The number of bathrooms and any add-ons you pick also move the figure, and the quote form shows the exact price before you book. The price is for an empty home in the condition you describe.`,
  },
  {
    q: "How long does a move out clean take?",
    a: "It depends on the size and condition of the home, which must be empty. The price is set by home size for the condition you describe, and if it needs much more work than that, we agree any extra charge with you before doing it. You are given an arrival window when you book, not a finish time.",
  },
  {
    q: "Do I need to be there?",
    a: `No. Leave a key in a lockbox, with the concierge, or with the property manager, and tell us in the booking notes where it is and where it goes afterward. We lock up when we finish. If we arrive and cannot get in, the lockout charge is ${POLICY.lockoutFee}, so a fob or code that works is worth checking the day before.`,
  },
  {
    q: "Are the oven and fridge interiors included?",
    a: "Yes. The inside of the oven, fridge and microwave is part of the move-out checklist, along with the inside of every cabinet, drawer and closet. None of it is an add-on. Appliances need to be switched on and reachable; we do not move anything over 25 pounds.",
  },
  {
    q: "What happens if the landlord finds something at the inspection?",
    a: `Tell us within ${POLICY.guaranteeWindowHours} hours of the clean and we come back to put it right at no charge. Photos of what was cited help the team find it, but they are not a condition of the return visit. We cannot decide the deposit; the landlord does that, and a clean cannot fix anything that is not cleaning.`,
  },
  {
    q: "Can you clean the same day I hand over the keys?",
    a: `Same-day and next-day slots depend on the schedule, so a key-day clean is not something we promise. The team arrives in a booked window rather than at an exact time: ${ARRIVAL_WINDOWS.map((w) => w.replace(/\s*–\s*/, " to ")).join(", ")}. The safer booking is the day before the inspection. Walk through the home yourself and tell us within ${POLICY.guaranteeWindowHours} hours of the clean if anything was missed, and we come back for it.`,
  },
  {
    q: "What do I need to do before the team arrives?",
    a: "Get your belongings out, and leave the power and running water on: the team cannot clean without running water, and vacuuming may not be possible without electricity. No pre-cleaning is required. The emptier the home is, the more of it the team can reach, because a move-out is priced to clean inside cabinets, closets and appliances; a few pieces of furniture left in place are fine. If the home is still fully furnished and the cupboards are full, a move-out is not the right service. We would book it as a deep clean with whatever add-ons it needs, and we will say so before the day rather than improvise at the door.",
  },
  {
    q: "Do you do move-in cleaning as well?",
    a: `Yes. A move-in clean is the same checklist run on the home you are arriving at, before the boxes go in, at the same flat rate by home size. Book the move-out and the move-in as two visits at two addresses; each is priced by its own size. If the new home is in Airdrie, Cochrane or another community outside Calgary city limits, the ${TRAVEL_FEE_LABEL} travel fee applies to that visit only.`,
  },
  {
    q: "Is there a travel fee outside Calgary?",
    a: `Inside Calgary city limits there is no travel fee. Outside them, including Airdrie, Cochrane, Okotoks and Chestermere, a travel fee of ${TRAVEL_FEE_LABEL} is added and shown on your quote before you book.`,
  },
  {
    q: "What is the cancellation policy?",
    a: `Cancel or move the booking with ${POLICY.cancellationNoticeHours} hours' notice at no charge. Inside that window the fee is ${POLICY.cancellationFee}. If we are the ones who have to move a clean, you are not charged for a visit we did not do, and there is no cancellation fee if the new date does not suit you.`,
  },
];

// The flat-rate checklist, room by room, each with the photo that used to sit
// in a second card grid below it. The alt text says what is in the frame.
const rooms = [
  {
    picture: calgaryKitchenClean,
    alt: "Kitchen with granite counters, a gas cooktop and a stainless-steel range hood",
    title: "Kitchen",
    items: [
      "Countertops, sink and backsplash scrubbed",
      "Inside and outside of cabinets, drawers and appliances",
      "Grease off the stovetop, range hood and exhaust fan",
      "Inside the oven, fridge and microwave",
      "Kitchen floor vacuumed and mopped last",
    ],
  },
  {
    picture: calgaryBathroomClean,
    alt: "White bathroom with a glass shower screen, a rain shower head and a stone vanity",
    title: "Bathrooms",
    items: [
      "Toilets, tubs, showers and sinks scrubbed",
      "Tile, floors, mirrors and shower glass",
      "Soap scum, hard-water scale and mineral deposits",
      "Vents and baseboards within reach",
      "Handles, knobs, switches and the inside of the vanity",
    ],
  },
  {
    picture: calgaryLivingRoomClean,
    alt: "Living room with a sofa and rug, white baseboards and a fireplace on hardwood floors",
    title: "Bedrooms, living areas and entry",
    items: [
      "Floors vacuumed and mopped, carpet and hard surface",
      "Doors, baseboards, switches, outlets and vent covers wiped",
      "Window sills dusted, and ceiling fans on request where safely reachable",
      "Inside closets, shelves and storage",
      "Cobwebs from corners, and the road sand out of the front entry",
    ],
  },
];

// The add-ons as a plain list, each with its lowest bk-config price.
const addOns = [
  { label: "Inside windows", key: "inside-windows" },
  { label: "Blinds, per set", key: "wipe-window-blinds-per-set" },
  { label: "Wall washing, spot or full", key: "spot-cleaning-inside-walls" },
  { label: "Basement, unfinished sweep or finished clean", key: "unfinished-basement-sweep" },
  { label: "Garage or balcony sweep", key: "sweep-only-of-garage-or-balcony" },
];

// Three places the checklist reaches: the lines that captioned the photo row.
// The shower line says what is done and names no product: the cleaners choose
// their own (owner, 2026-09-11).
const reachPoints = [
  { title: "The oven and the range hood", body: "Grease shows on both at a glance, and both are on the move-out checklist." },
  { title: "Shower glass and grout", body: "Hard-water scale is taken off the glass and the taps, and the tile and grout are scrubbed." },
  { title: "Baseboards and closet shelves", body: "Furniture hides them for years, and the move-out clean reaches them once the room is empty." },
];

// One of the six booking terms on the navy band. Static on purpose: it is
// text, not a link, so it gets no hover motion.
const TermCard = ({ icon, title, children }: { icon: React.ReactNode; title: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-xl border border-white/20 bg-white/10 p-6">
    <div className="w-12 h-12 rounded-full bg-accent/20 text-accent flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/80 leading-relaxed">{children}</p>
  </div>
);

export default function CalgaryMoveInOut() {
  return <div className="min-h-screen">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/move-out-cleaning-calgary/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/move-out-cleaning-calgary/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        {/* Service ties the offering to the Calgary LocalBusiness node; FAQPage
            mirrors the accordion content rendered further down the page.

            Built through buildServiceSchema rather than hand-rolled, so this
            page and its Edmonton twin emit the same node shape. The hand-rolled
            version named a bare provider @id with no inline node and no
            address, while Edmonton emitted a full LocalBusiness — the two pages
            described the business differently for no reason. */}
        <script type="application/ld+json">
          {JSON.stringify(
            buildServiceSchema({
              name: "Move Out and Move In Cleaning",
              description: META_DESCRIPTION,
              path: "/move-out-cleaning-calgary",
              city: "calgary",
              // The five rows the cost table prints, declared as Offers. The
              // page published a full price list and no offer of any kind, so
              // nothing machine-readable carried a figure. Same rows, same
              // source: moveInOutTierRows().
              offerCatalog: {
                name: "Move-out cleaning by home size",
                rows: MOVE_ROWS.map((row) => ({
                  name: row.beds,
                  price: row.price,
                  assumption: row.assumption,
                })),
              },
            }),
          )}
        </script>
        <script type="application/ld+json">{JSON.stringify(branchSchema())}</script>
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
      <Navigation city="calgary" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero: the H1, one price sentence, the two buttons and the rating. The
          paragraph that sat here opens the section below. */}
      <section className="relative bg-brand-navy text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="display-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                Move Out Cleaning in Calgary
              </h1>
              <p className="text-lg md:text-xl mb-8 text-white/85 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Flat rate from {moveInOutFromPrice()} before GST for a one-bedroom apartment or condo, fixed
                by home size, and you pay after the clean.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-14" asChild>
                  <a href="#quote">See My Instant Price</a>
                </Button>
                <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 text-lg px-8 h-14" asChild>
                  <a href="tel:4037681341">
                    <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />
                    Call (403) 768-1341
                  </a>
                </Button>
              </div>

              <p className="flex items-center justify-center lg:justify-start gap-2 text-white/90">
                <Stars size={1} />
                <span className="font-medium">{CALGARY_RATING_CLAIM}</span>
              </p>
            </div>

            <div className="flex-shrink-0">
              <ResponsiveImage
                picture={calgaryMoveInOutHero}
                sizes={SIZES.half}
                alt="Empty living room with hardwood floors, a bay window and a fireplace"
                className="lg:w-[500px] w-full rounded-xl shadow-2xl"
               loading="eager" fetchPriority="high"/>
            </div>
          </div>
        </div>
      </section>

      {/* Slim strip under the hero: the re-clean window, and the charges that
          sit outside the flat rate, so the figure above never stands alone. */}
      <div className="border-b border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-4">
          <ul className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-center lg:justify-start gap-x-8 gap-y-2 text-sm">
            <li className="flex items-center gap-2 text-foreground">
              <span className="dc-icon dc-icon-circle-check w-4 h-4 text-primary flex-shrink-0" aria-hidden="true" />
              <span className="font-medium">{POLICY.guaranteeWindowHours}-hour re-clean</span>
            </li>
            <li className="text-muted-foreground">
              A townhouse or house, a pet or an address outside Calgary city limits each adds a charge, shown on your quote before you book.
            </li>
          </ul>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-6">
            What a move-out clean in Calgary includes
          </h2>

          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            {/* The room-by-room cards below are this page's includes list. This
                paragraph used to repeat the whole of it, and so did the hero and
                the end-of-tenancy section; it now says what makes the checklist
                different instead. */}
            <p>
              A move-out clean is the one-time clean an empty home gets between tenants or owners,
              from {moveInOutFromPrice()} for a one-bedroom. It is timed for the gap after the
              furniture goes and before the keys do, because that is the state the inspection
              measures the home in. Book online with the instant price, or call the Calgary office.
            </p>
            <p>
              Move-out cleaning is the deepest clean we do.{" "}
              <Link to="/calgary/regular-cleaning/" className="text-primary underline underline-offset-4">A standard clean in Calgary</Link>{" "}
              keeps an occupied home in order and works around whatever is in it. The move-out
              checklist assumes nothing is in the way, so it goes behind and inside things rather
              than over them, and it is scored by somebody with a form. It runs room by room:
              the kitchen, the bathrooms, then the bedrooms, living areas and the front entry.
            </p>
            <p>
              The same checklist covers a <strong>move-in clean</strong>, an{" "}
              <strong>end of tenancy clean</strong> for a rental, and the handover clean on a
              house sale. Book it as move-out, move-in, or both, and the price is the same flat
              rate by home size, whichever of the three it is.
            </p>
            <p>
              Some things stay outside the checklist in any home: carpet steam cleaning, exterior
              windows, anything past the reach of a three-step ladder, and lifting anything over 25
              pounds. Inside windows, blinds,{" "}
              <Link to="/wall-washing-wall-cleaning-calgary/" className="text-primary underline underline-offset-4">wall washing in Calgary</Link>,
              the basement and a garage sweep are add-ons you pick at booking, each a separate line
              on the quote. The garage or balcony sweep is offered mostly in summer, when the weather
              allows.
            </p>
          </div>
        </div>
      </section>

      {/* The checklist and its photos, one block: each room's picture sits over
          its list, the add-ons are a plain list, and the three reach points
          that captioned the old photo row follow as text. */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">
            The move-out checklist, room by room
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto text-lg">
            The three rooms are the flat rate. The list under them is what you can add at booking.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <div key={room.title}>
                <ResponsiveImage picture={room.picture} sizes={THREE_UP_SIZES} alt={room.alt} className="w-full h-64 object-cover rounded-xl" loading="lazy" />
                <h3 className="text-xl font-bold mt-5 mb-3">{room.title}</h3>
                <ul className="space-y-2 text-muted-foreground">
                  {room.items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="dc-icon dc-icon-circle-check w-5 h-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto mt-14">
            <h3 className="text-xl font-bold mb-3">Add-ons, each priced separately</h3>
            <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 list-disc pl-5 text-muted-foreground">
              {addOns.map((addOn) => (
                <li key={addOn.key}>{addOn.label}{addOnLabel(addOn.key)}</li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground mt-3">Add-on prices are before 5% GST.</p>
          </div>

          <div className="max-w-3xl mx-auto mt-12 border-t border-border pt-10">
            <h2 className="display-serif text-2xl md:text-3xl font-bold mb-4">Three places the move-out checklist reaches</h2>
            <dl className="space-y-3 text-muted-foreground leading-relaxed">
              {reachPoints.map((point) => (
                <div key={point.title}>
                  <dt className="inline font-semibold text-foreground">{point.title}: </dt>
                  <dd className="inline">{point.body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Pricing — the cost table and the FAQ now sit ABOVE the 26-name
          coverage list. A reader who came for "move out cleaning cost calgary"
          had to scroll past every neighbourhood we serve to reach a price. */}
      {/* id="quote": the instant-price overlay intercepts every #quote link. Without
          JavaScript the same link now lands here, on the prices. */}
      <section id="quote" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">
            Move out cleaning cost in Calgary
          </h2>
          <p className="text-center text-muted-foreground mb-10 max-w-3xl mx-auto">
            Move out cleaning in Calgary costs from {MOVE_FROM} for a one-bedroom to {MOVE_TO} for
            a five-bedroom home, before 5% GST. Each row is the flat rate for the full checklist
            with the bathroom count shown, rounded to the nearest dollar. Your instant quote uses
            the exact price including cents.
          </p>

          <div className="mx-auto mb-8 max-w-2xl overflow-hidden border border-border">
            <table className="w-full">
              <thead className="bg-brand-navy text-brand-navy-foreground">
                <tr>
                  <th className="py-3 px-5 text-left text-sm font-bold">Home size</th>
                  <th className="py-3 px-5 text-left text-sm font-bold">Bathrooms assumed</th>
                  <th className="py-3 px-5 text-right text-sm font-bold">Move-out clean, before GST</th>
                </tr>
              </thead>
              <tbody>
                {MOVE_ROWS.map((r, i) => (
                  <tr key={r.beds} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                    <td className="py-3 px-5 text-foreground">{r.beds}</td>
                    <td className="py-3 px-5 text-sm text-muted-foreground">{r.assumption.replace("Assumes ", "")}</td>
                    <td className="py-3 px-5 text-right font-bold text-foreground">from {r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mx-auto max-w-3xl text-muted-foreground space-y-4 mb-10">
            <p>
              What moves the price: the number of bathrooms, the home type (the rows are the
              apartment rate, and a townhouse or two-storey house costs more), the {PET_LABEL} pet
              charge in a home with pets, the add-ons you pick (inside windows, blinds, wall
              washing, a basement, a garage sweep), and a {TRAVEL_FEE_LABEL} travel fee
              for an address outside Calgary city limits. Airdrie, Cochrane, Okotoks and Chestermere
              are outside; the city itself carries no travel fee. The same checklist and the same
              rows cover{" "}
              <Link to="/cleaning-services-airdrie/" className="text-primary underline underline-offset-4">house cleaning in Airdrie</Link>{" "}
              and{" "}
              <Link to="/cleaning-services-cochrane/" className="text-primary underline underline-offset-4">house cleaning in Cochrane</Link>,
              with the fee added on the quote.
            </p>
            <p>
              What does not move it: how long the clean takes. The rate on your quote is the rate
              you pay, and a two-bedroom that takes an extra hour is still a two-bedroom. If the home
              is staying lived in, the service you want is{" "}
              <Link to="/calgary/deep-cleaning/" className="text-primary underline underline-offset-4">a deep clean in Calgary</Link>{" "}
              instead, and the standard, deep and move-out rates sit row against row on{" "}
              <Link to="/calgary/pricing/" className="text-primary underline underline-offset-4">Calgary house cleaning prices by home size</Link>.
            </p>
          </div>

          {/* What the quote asks for, folded in from the "Get Started" band that
              repeated the hero's button one screen below it. */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-muted-foreground mb-6">
              Choose the home size, the number of bathrooms and the date. The price shown is the
              flat rate for the full move-out checklist, before 5% GST, and nothing is charged
              until the clean is done.
            </p>
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-14" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
            {/* Was "No credit card required". PAYMENT_TERMS places a temporary
                hold on the card the day before the clean, so that is false as a
                claim about booking and true as one about the quote. */}
            <p className="text-sm text-muted-foreground mt-4">
              Instant pricing, no phone call required, and no card needed to see your price.
            </p>
          </div>
        </div>
      </section>

      <MoveOutDepth city="Calgary" showPricing={false} />

      {/* Why book us: six terms on the page's one navy band, as on the Edmonton
          twin. They were ten cards in six pastel hues that meant nothing. */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Why book Duty Cleaners for move-out cleaning in Calgary
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <TermCard icon={<Shield className="w-6 h-6" />} title="Reference-checked, rated after every visit">
              {POLICY.insuranceClaim}
            </TermCard>

            <TermCard icon={<DollarSign className="w-6 h-6" />} title="Set price by home size">
              The price is set by bedrooms and bathrooms when you book, from {MOVE_FROM} for a
              one-bedroom. It is for an empty home in the condition you describe; much more work than that is agreed with you, and priced, before it is done.
            </TermCard>

            <TermCard icon={<span className="dc-icon dc-icon-circle-check w-6 h-6" aria-hidden="true" />} title="The charges outside the flat rate">
              {/* Was "no hidden fees" on a page that named none of them. */}
              A home with pets adds {PET_LABEL} a visit, a townhouse or two-storey house adds a
              home-type charge, and an address outside Calgary city limits adds {TRAVEL_FEE_LABEL}.
              Each shows on your quote before you book, and quoted prices are before 5% GST.
              Cancelling inside {POLICY.cancellationNoticeHours} hours costs {POLICY.cancellationFee},
              and if we arrive and cannot get in, the lockout charge is {POLICY.lockoutFee}.
            </TermCard>

            <TermCard icon={<span className="dc-icon dc-icon-sparkles w-6 h-6" aria-hidden="true" />} title="Supplies and equipment included">
              The team brings everything. Optional alternative products are available for{" "}
              {POLICY.ecoProductsFee} before GST: {POLICY.ecoProductsHowToRequest}. You only need the power and
              running water on at the address.
            </TermCard>

            <TermCard icon={<Award className="w-6 h-6" />} title={<>A {POLICY.guaranteeWindowHours}-hour window to report a miss</>}>
              Walk through the home after the clean and tell us within{" "}
              {POLICY.guaranteeWindowHours} hours of it if anything was missed; we return at no
              charge. Book the clean as close to the inspection as you can, since the window runs
              from the clean. Photos help and are not required.
            </TermCard>

            <TermCard icon={<span className="dc-icon dc-icon-clock w-6 h-6" aria-hidden="true" />} title="Pay after the clean">
              Nothing is charged when you book. A temporary hold checks the card the day before,
              and the charge goes through once the clean is complete. Visa, Mastercard, American
              Express and debit; e-transfer can be arranged by phone.
            </TermCard>
          </div>
        </div>
      </section>

      {/* Move-in cleaning */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="rounded-xl overflow-hidden">
              <ResponsiveImage picture={calgaryMoveOutClean} sizes={SIZES.half} alt="Empty carpeted bedroom with white walls and sunlight through the window" className="w-full h-[420px] object-cover" loading="lazy" />
            </div>
            <div>
              <span className="text-accent font-semibold text-sm uppercase tracking-wide">Move-in cleaning</span>
              <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4">Move-in cleaning before you unpack</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                A move-in clean is the same checklist run on the home you are arriving at, before
                the boxes go in. The previous occupant's clean was done to their standard, and a
                house in a newer suburb such as Seton, Mahogany or Livingston carries construction
                dust on its closet shelves and door tops. With the home empty we get inside the cabinets, wipe the shelves
                and drawers you are about to fill, clean the oven and fridge interiors, and mop
                the floors before furniture covers them. Book it for the day before the movers, or
                the morning of if the keys come early.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-4">
                For a move across Calgary, or out to Airdrie or Cochrane, one booking clears the
                old address and another does the new one. Each is priced by its own size, and the
                travel fee is added only for an address outside city limits.
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2"><span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Same flat rate by home size as a move-out clean</span></li>
                <li className="flex items-start gap-2"><span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Cabinet, drawer and closet interiors wiped before you fill them</span></li>
                <li className="flex items-start gap-2"><span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent flex-shrink-0 mt-0.5" aria-hidden="true" /><span>Move-out and move-in booked as two visits, each priced by its own home size</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* End of tenancy */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* The page ranks for "end of tenancy cleaning calgary" and the heading
              that carried the phrase named no city. */}
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-6">
            End of tenancy cleaning in Calgary and the inspection report
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Under <a href="https://www.alberta.ca/ending-a-tenancy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">Alberta's Residential Tenancies Act</a> the landlord completes a move-out
              inspection report with the tenant. Within 10 days of the tenant moving out, the
              landlord must return the deposit, or return what is left with a written statement of
              any deductions (an estimate is allowed, with the final statement within 30 days). The inspection is where cleaning gets cited, so
              an end of tenancy clean is timed for the day before it.
            </p>
            <p>
              A room that looks right from the doorway can still be cited once somebody opens the
              oven or runs a finger along a closet shelf, which is why the move-out checklist goes
              inside things. Walk through the home yourself once the team leaves, and tell us within{" "}
              {POLICY.guaranteeWindowHours} hours of the clean if anything was missed; we come back at
              no charge. The window runs from the clean, not the inspection, so book the clean as close
              to the inspection as you can. Photos help the team find it and are not a condition.
            </p>
            <p>
              We do not promise the deposit. The landlord decides that, and a clean cannot fix
              anything that is not cleaning.
            </p>
          </div>
        </div>
      </section>

      {/* Condos, apartments and houses */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-6">
            Condos, apartments and houses
          </h2>
          <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
            <p>
              Condos and apartments in the Beltline, Mission, Eau Claire and the downtown towers are
              the simplest move-outs in Calgary to clean. What differs is access. If the
              building books its elevator for move-outs, tell us the hours it is yours and we book
              the arrival window that fits them, where the schedule allows. Parkade access, the lobby fob, and where the keys go
              afterward (concierge desk, lockbox, or property manager) all belong in the booking
              notes. In a condo the kitchen and one or two bathrooms are most of the job; the
              balcony is a sweep add-on.
            </p>
            <p>
              Houses add rooms a condo does not have: the garage, the basement, and the mudroom or
              front entry where chinook melt and road sand get tracked in all winter.
              The same grit rides into a condo on boots and tires through the parkade. A finished
              basement is priced as an add-on and an unfinished one as a sweep; the garage is a
              sweep, not a scrub. Houses in newer suburbs such as Mahogany, Seton and Livingston
              also carry construction dust, which settles on closet shelves and the tops of door frames.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-12">
            Move out cleaning in Calgary: questions we get asked
          </h2>

          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, i) => (
              <AccordionItem key={faq.q} value={`item-${i}`} className="bg-white rounded-xl px-6 border border-border">
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <MoveOutServiceAreas city="Calgary" />

      {/* Final CTA */}
      <section className="py-20 bg-brand-navy text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold mb-6">
            Book move-out cleaning in Calgary
          </h2>
          <p className="text-xl mb-8 text-white/90">
            From {MOVE_FROM} plus 5% GST, fixed by home size. Our move out cleaners in Calgary work
            to the move-out checklist, and nothing is charged until the clean is done.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8 h-14" asChild>
              <a href="#quote">See My Instant Price</a>
            </Button>
            <Button size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10 text-lg px-8 h-14" asChild>
              <a href="tel:4037681341">
                <span className="dc-icon dc-icon-phone mr-2 w-5 h-5" aria-hidden="true" />
                Call (403) 768-1341
              </a>
            </Button>
          </div>

          <p className="text-white/80">
            Same-day and next-day slots depend on the schedule. The day before the inspection is
            the safest date to book. Once you are in the new place,{" "}
            <Link to="/calgary/recurring-cleaning/" className="text-white underline underline-offset-4">a recurring clean in Calgary</Link>{" "}
            carries a discount from the second visit, and{" "}
            <Link to="/calgary/services/" className="text-white underline underline-offset-4">every Calgary cleaning service, with starting prices</Link>{" "}
            is listed on one page.
          </p>
        </div>
      </section>
      <section className="pb-16">

        <div className="container mx-auto px-4">

          <CityCrossLink city="Edmonton" to="/move-out-cleaning-edmonton/" description="Move-out and move-in cleaning for Edmonton homes and rentals." />

        </div>

      </section>
      </main>

      <Footer hasQuoteSection />
    </div>;
}
