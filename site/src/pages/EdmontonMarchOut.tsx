import { BUSINESS_TRADE_TYPE } from "@/data/proof";
import { CITY_PROOF, RATING_CLAIM, COMPANY } from "@/data/proof";
import { canonicalUrlForPath } from "@/data/legacy-urls";
import {
  BRANCH_ID,
  BRANCH_IDENTITY,
  BRANCH_PROFILES,
  branchGeoFor,
  schemaAddressFor,
  openingHoursShortFor,
  openingHoursSpecFor,
} from "@/data/proof";
import { GST_RATE, moveInOutTierRows, sitePriceRange } from "@/data/pricing";
import { ARRIVAL_WINDOWS, POLICY } from "@/data/policy";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ShieldCheck, ClipboardCheck, UtensilsCrossed, Bath, Footprints, DoorOpen, Search, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Breadcrumbs from "@/components/Breadcrumbs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

import ResponsiveImage, { SIZES } from "@/components/ResponsiveImage";
import heroBg from "@/assets/gallery/move-out-clean.webp?hero";
import imgKitchen from "@/assets/gallery/kitchen-deep-clean.webp?card";
import imgBathroom from "@/assets/gallery/bathroom-clean.webp?card";
import imgWalls from "@/assets/gallery/clean-walls-edmonton.webp?card";

const PHONE_DISPLAY = "(780) 913-6565";
const PHONE_TEL = "tel:7809136565";
// /contact force-301s to /contact-us/ and a redirect may drop the prefill.
const CALLBACK_HREF = "/contact-us/#topic=march-out&city=edmonton";
/* CFHA's own move-out checklist, in the Occupant Handbook. Until 11 September 2026
   this page said the clean was "done to CFHA's march-out inspection standards", but
   that checklist also covers repairs, bulbs, the furnace filter, the yard, exterior
   windows and steam-cleaned carpets, none of which the team does. The page now
   links the checklist and says which part of it the clean covers. */
const CFHA_MOVING_OUT =
  "https://www.canada.ca/en/department-national-defence/services/benefits-military/military-housing/occupant-handbook/moving-out.html";

const proof = CITY_PROOF.edmonton;
const GST_PCT = `${Math.round(GST_RATE * 100)}%`;
const GUARANTEE_HOURS = POLICY.guaranteeWindowHours;
/*
  A march-out is quoted by phone and has no published price. The civilian
  move-out rate is the nearest service that does, so the page names it as a
  reference point for a different service, never as the march-out price.
*/
const MOVE_FROM = moveInOutTierRows()[0]?.price ?? "";
/* policy.ts writes each window with a spaced dash; three in one sentence read badly. */
const WINDOWS = ARRIVAL_WINDOWS.map((w) => w.replace(" – ", " to "));
const WINDOWS_LINE = `${WINDOWS.slice(0, -1).join(", ")} or ${WINDOWS[WINDOWS.length - 1]}`;

const PAGE_TITLE = "March Out Cleaning Edmonton | Military Housing Move-Outs";
/* One sentence for description, og and twitter alike. The old one promised a
   "same-day quote", which is a response time nobody has confirmed. */
const META_DESCRIPTION =
  "March out cleaning in Edmonton for military housing, worked from your CFHA move-out checklist and quoted by phone on (780) 913-6565.";

const AnimatedSection = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
};

/*
  The cards used to say what inspectors "open first" and that the crew hands
  the keys back after a walkthrough. Neither is on file, so the cards now say
  what the clean covers and nothing about the inspector.
*/
const included = [
  {
    icon: UtensilsCrossed,
    title: "Kitchen and appliances",
    description:
      "Inside and outside the oven, fridge and microwave, the outside of the dishwasher, then the counters, sink and cabinet fronts.",
  },
  {
    icon: Footprints,
    title: "Floors, edges and baseboards",
    description:
      "Every floor vacuumed and mopped, with baseboards, corners and door tracks worked by hand.",
  },
  {
    icon: Bath,
    title: "Bathrooms",
    description:
      "Tubs, showers, tile, sinks, toilets and mirrors scrubbed. Hard Alberta water leaves mineral scale on taps and shower glass, so those get their own pass.",
  },
  {
    icon: DoorOpen,
    title: "Doors, frames and fixtures",
    description:
      "Doors, frames, cabinet interiors and exteriors, switch plates, vent covers and fixtures wiped down.",
  },
  {
    icon: Search,
    title: "Worked from your list",
    description:
      "The team cleans room by room from the inspection list you give us when you call, so the scope matches the home.",
  },
  {
    icon: Sparkles,
    title: "Add-ons the list names",
    description:
      "Wall washing, interior windows and unfinished basements are add-ons. If the list asks for them, they go into the phone quote.",
  },
];

/* What the office needs to price the job. This replaced a list of fears
   ("a failed inspection", "re-clean charges you didn't budget for") that no
   record supports. */
const callPrep = [
  "The inspection date, so the clean can be booked close to it",
  "The home's size: bedrooms, bathrooms, and whether it is a house or an apartment",
  "The inspection list, or the items on it you are unsure about",
  "Whether there are pets in the home, and how the team will get in",
];

/*
  Rewritten 10 September 2026 from the content prompt's FACTS. The old answers
  claimed CFHA inspections are "far more detailed than a typical landlord
  walkthrough", that march-out dates "cluster around posting season", and that
  a re-clean follows anything "flagged at inspection" when the guarantee runs
  24 hours from the clean. None of that was on file.
*/
const faqs = [
  {
    q: "What is a march-out clean?",
    a: `A march-out clean is the move-out clean for a home managed by CFHA, the Canadian Forces Housing Agency, worked from the cleaning items on the CFHA move-out checklist. Duty Cleaners quotes it by phone from the Edmonton office at ${PHONE_DISPLAY}, because the scope follows the inspection list for each home.`,
  },
  {
    q: "How is a march-out clean different from a regular move-out clean?",
    a: `A civilian move-out clean in Edmonton is booked online at a flat rate by home size, from ${MOVE_FROM} for a one-bedroom apartment before ${GST_PCT} GST, with a house, pets or an address outside the city adding to that figure. The landlord judges it at the move-out inspection that Alberta's Residential Tenancies Act requires. A march-out is judged at CFHA's final inspection on move-out day instead, against a checklist that covers the yard, repairs and the furnace filter as well as the cleaning, which is why it is quoted by phone from the list for the home.`,
  },
  {
    q: "Are wall washing and interior windows included in a march-out clean?",
    a: "No. Wall washing, interior window cleaning and unfinished basement cleaning are add-ons that sit outside the march-out clean itself. If the inspection list for the home names any of them, say so on the call and they go into the quote before anything is booked.",
  },
  {
    q: "How far ahead should I book a march-out clean?",
    a: `Book it as soon as you have the inspection date. Same-day and next-day slots depend on the schedule. The team arrives in a booked window of ${WINDOWS_LINE}, so an early call leaves the most windows to choose from.`,
  },
  {
    q: "Why is there no instant online price for a march-out clean?",
    a: `The online form prices a civilian home by size, and a march-out follows the inspection list for the home, which decides the add-ons the job needs. The Edmonton office prices it by phone at ${PHONE_DISPLAY}, Monday to Saturday 8:00 AM to 8:00 PM and Sunday 9:00 AM to 3:00 PM, and every figure is before ${GST_PCT} GST. The price does not change because the clean took longer. It changes only if the home needs substantially more work than was described, and the team explains the options before carrying on.`,
  },
  {
    q: "What if the inspector finds something the clean missed?",
    a: `Tell us within ${GUARANTEE_HOURS} hours of the clean and the team comes back and re-cleans the missed items at no charge. Photos help but are not required. The window runs from the clean, so booking the clean close to the inspection date keeps the inspection inside it. The commitment is the return visit; it is not a refund, though you can call the Edmonton office to talk it through.`,
  },
  {
    q: "Do I need to be home for the march-out clean?",
    a: "No. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves. The team brings all supplies and equipment. Running water is required, and vacuuming may not be possible without electricity, so keep the utilities on until the clean is done.",
  },
  {
    q: "What happens if my inspection date moves?",
    a: `Moving or cancelling a booking needs ${POLICY.cancellationNoticeHours} hours' notice; inside that window the fee is ${POLICY.cancellationFee}. If we have to move a booking ourselves, because a cleaner is ill or the roads are unsafe, we say so as soon as we know and offer the earliest slot we have. Cancelling a booking we moved costs nothing.`,
  },
  {
    q: "What does a march-out clean not include?",
    a: "A march-out clean does not include lifting anything over 25 lb, exterior windows or other outdoor work, garages (a balcony or garage sweep is a separate add-on, offered mostly in summer when the weather allows), anything beyond a 3-step ladder, carpet steam cleaning, furnace and duct cleaning, furnace filters, light bulbs, repairs, or mould remediation. Light surface mildew may be wiped where it is safe to do so. If the inspection list asks for any of these, tell the Edmonton office on the call so the quote says plainly what the team will and will not do.",
  },
];

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "March Out Cleaning Edmonton",
  serviceType: "Military housing march-out cleaning",
  description:
    "Military housing move-out cleaning in Edmonton, worked from the cleaning items on the CFHA move-out checklist. Quoted by phone.",
  provider: {
    "@type": "LocalBusiness",
    additionalType: BUSINESS_TRADE_TYPE,
    "@id": BRANCH_ID.edmonton,
    name: BRANCH_IDENTITY.edmonton.name,
    url: BRANCH_IDENTITY.edmonton.url,
    telephone: CITY_PROOF.edmonton.phoneE164,
    // One authority for the address (data/proof.ts). The street and postal code
    // were retyped here: correct on the day they were typed, and a second copy
    // of the office address is a copy that drifts the day the branch moves.
    address: schemaAddressFor("edmonton"),
    // This provider is the only LocalBusiness node the march-out page emits, so
    // without hours the page published a business that never says when it
    // answers — one of the 17 the 2026-09-11 AuditSpur scan counted.
    openingHours: openingHoursShortFor("edmonton"),
    openingHoursSpecification: openingHoursSpecFor("edmonton"),
    // The rest of what the shared builders publish for the branch, from the
    // same authorities. This node was hand-built and had drifted: scan 1131
    // (2026-09-17) found it the only branch node with no price band, image or
    // profiles, and no office pin.
    geo: branchGeoFor("edmonton"),
    priceRange: sitePriceRange(),
    image: "https://dutycleaners.ca/og-image.jpg",
    sameAs: [...BRANCH_PROFILES.edmonton],
  },
  areaServed: { "@type": "City", name: "Edmonton" },
  url: canonicalUrlForPath("/edmonton/march-out-cleaning"),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function EdmontonMarchOut() {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={META_DESCRIPTION} />
        <link rel="canonical" href="https://dutycleaners.ca/edmonton/march-out-cleaning/" />
        <meta property="og:title" content={PAGE_TITLE} />
        <meta property="og:description" content={META_DESCRIPTION} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dutycleaners.ca/edmonton/march-out-cleaning/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={PAGE_TITLE} />
        <meta name="twitter:description" content={META_DESCRIPTION} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      <Navigation city="edmonton" />
      <main id="main-content" tabIndex={-1}>
      <div className="container mx-auto px-4 pt-4">
        <Breadcrumbs />
      </div>

      {/* Hero */}
      <section className="relative py-20 px-4 bg-brand-navy overflow-hidden">
        <ResponsiveImage
          picture={heroBg}
          sizes={SIZES.full}
          alt="A bedroom with a made bed and matching nightstands"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
         loading="eager" fetchPriority="high"/>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/85 via-brand-navy/70 to-brand-navy/90" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <ShieldCheck className="w-4 h-4 text-accent" />
            <span className="text-white/90 text-sm font-medium">Military housing move-outs, quoted by phone</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
            March Out Cleaning in Edmonton
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-white/90 font-medium">
            Worked from your CFHA move-out checklist
          </p>
          <p className="text-lg mb-8 text-white/90 max-w-3xl mx-auto leading-relaxed">
            A march-out clean is the move-out clean for military housing. The Edmonton team works through
            the kitchen, bathrooms, floors and fixtures against the inspection list for the home, and the
            inspector decides whether it passes. Duty Cleaners is rated {RATING_CLAIM} across{" "}
            {proof.googleReviewCount} reviews on the Edmonton listing, and has cleaned Alberta homes{" "}
            {COMPANY.sinceLabel}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={PHONE_TEL}>
                <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                Call {PHONE_DISPLAY}
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-lg border-white/20 text-white hover:bg-white/10"
            >
              <Link to={CALLBACK_HREF}>Request a Callback</Link>
            </Button>
          </div>
          <p className="text-white/80 text-sm">
            March-out jobs are quoted by phone, because the scope follows the inspection list for each home.
            If you are leaving a civilian rental instead, book{" "}
            <Link to="/move-out-cleaning-edmonton/" className="underline underline-offset-2">
              move-out cleaning in Edmonton
            </Link>{" "}
            at a flat rate, from {MOVE_FROM} for a one-bedroom apartment before {GST_PCT} GST, with the pet charge, a
            house or an address outside the city adding to it. The{" "}
            <Link to="/whats-included/" className="underline underline-offset-2">
              what&rsquo;s-included checklist
            </Link>{" "}
            and the{" "}
            <Link to="/pricing/" className="underline underline-offset-2">
              full Edmonton price list
            </Link>{" "}
            set out every add-on and its price, including{" "}
            <Link to="/wall-washing-wall-cleaning/" className="underline underline-offset-2">
              wall washing
            </Link>
            .
          </p>
        </div>
      </section>

      {/* How it differs */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-5xl grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                How a march-out differs from a civilian move-out
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                A civilian tenancy in Alberta ends with the landlord completing a move-out inspection report
                with the tenant, as the Residential Tenancies Act requires, and the landlord decides what
                happens to the deposit. A march-out ends with a final inspection on move-out day, against
                the move-out checklist in the{" "}
                <a
                  href={CFHA_MOVING_OUT}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  CFHA Occupant Handbook
                </a>
                , so the clean starts from the list for the home. What to have ready when you call the
                Edmonton office:
              </p>
              <div className="space-y-3">
                {callPrep.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <ClipboardCheck className="w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-muted-foreground leading-relaxed">
                The team works from the list you give us. Most of the cleaning on a CFHA list is in the
                cards below. Wall washing, interior windows and an unfinished basement are add-ons that go
                into the quote, and anything else the list names, such as the ceilings, goes on the call so
                the quote says whether the team does it. Some of the list is yours to arrange, including
                steam-cleaning carpets, exterior windows and screens, the yard, snow and sheds, the garage,
                light bulbs, repairs and the furnace filter.
              </p>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Anything the team misses that you report within {GUARANTEE_HOURS} hours of the clean is
                re-cleaned at no charge.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ResponsiveImage
                picture={imgKitchen}
                sizes={"(min-width: 1024px) 240px, 50vw"}
                alt="A cleaned kitchen with wiped appliance fronts"
                loading="lazy"
                className="rounded-2xl object-cover w-full h-full aspect-[4/5]"
              />
              <div className="grid gap-4">
                <ResponsiveImage
                  picture={imgBathroom}
                  sizes={"(min-width: 1024px) 240px, 50vw"}
                  alt="A cleaner wiping a bathroom mirror above the sink"
                  loading="lazy"
                  className="rounded-2xl object-cover w-full aspect-square"
                />
                <ResponsiveImage
                  picture={imgWalls}
                  sizes={"(min-width: 1024px) 240px, 50vw"}
                  alt="White painted walls in a bright, nearly empty room"
                  loading="lazy"
                  className="rounded-2xl object-cover w-full aspect-square"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* What's included */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                What our Edmonton march-out cleaning covers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Room by room, against the inspection list you give us.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {included.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className="group bg-card rounded-xl border border-border p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-12">
                    <Icon className="w-6 h-6 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* The branch behind the clean */}
      <section className="py-20 px-4 bg-brand-navy">
        <AnimatedSection>
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              The Edmonton branch behind a march-out clean
            </h2>
            <p className="text-white/85 max-w-2xl mx-auto mb-10">
              Duty Cleaners has cleaned homes in Alberta {COMPANY.sinceLabel}, and march-out cleans are booked
              through the Edmonton office at {proof.address}. The same office books every other service, each
              listed with its starting price under{" "}
              <Link to="/services/" className="underline underline-offset-2">
                all Edmonton cleaning services and prices
              </Link>
              .
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-left">
              {[
                "Every cleaner is reference-checked before a first job and rated by the customer after each visit, and the ratings decide who we keep sending.",
                "The team brings all supplies and equipment, so an empty house needs only running water and, for the vacuum, electricity.",
                "Nothing is charged at booking. A temporary hold the day before confirms the card, and the charge goes through once the clean is complete.",
                `If something was missed, tell us within ${GUARANTEE_HOURS} hours and the team comes back and re-cleans it at no charge.`,
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-5"
                >
                  <span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                  <span className="text-white/90 text-sm leading-relaxed">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-background">
        <AnimatedSection>
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                March-out cleaning FAQs
              </h2>
              <p className="text-muted-foreground">Edmonton, CFHA housing, and what to expect.</p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-2 md:p-4 shadow-sm">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((f, i) => (
                  <AccordionItem key={f.q} value={`item-${i}`} className="px-4">
                    <AccordionTrigger className="text-left font-semibold text-foreground">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* Closing CTA */}
      <section className="py-20 px-4 bg-secondary/30">
        <AnimatedSection>
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Book your Edmonton march-out clean
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Tell us the inspection date, the size of the home and what the list asks for, and the Edmonton
              office prices the clean over the phone before anything is booked.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg bg-accent text-accent-foreground hover:bg-accent/90">
                <a href={PHONE_TEL}>
                  <span className="dc-icon dc-icon-phone w-4 h-4 mr-2" aria-hidden="true" />
                  Call {PHONE_DISPLAY}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg">
                <Link to={CALLBACK_HREF}>Request a Callback</Link>
              </Button>
            </div>
            <p className="mt-8 text-sm text-muted-foreground inline-flex items-center gap-2 justify-center">
              <span className="dc-icon dc-icon-map-pin w-4 h-4 text-primary" aria-hidden="true" />
              18615 71 Ave NW, Edmonton · Mon–Sat 8am–8pm · Sun 9am–3pm
            </p>
          </div>
        </AnimatedSection>
      </section>
      </main>

      <Footer />
    </div>
  );
}
