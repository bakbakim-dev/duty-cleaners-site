import { addOnFromPrice, formatPrice, FREQUENCIES } from "@/data/pricing";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { HardHat, Home, KeyRound, PaintRoller, Repeat, Truck } from "lucide-react";
import { Accent } from "@/components/Accent";
import Eyebrow from "@/components/Eyebrow";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";

/**
 * The discounts, read from bk-config. They are the reason to choose a
 * recurring plan, so the card leads with them rather than describing the
 * cadence in the abstract.
 */
const RECURRING_DISCOUNTS = FREQUENCIES
  .filter((frequency) => frequency.discount > 0)
  .sort((a, b) => b.discount - a.discount)
  .map((frequency) => `${Math.round(frequency.discount * 100)}% ${frequency.label.toLowerCase()}`)
  .join(", ");

/**
 * Wall washing was the one service neither hub linked from its body, though
 * both hubs sell it. It is an extra on a clean rather than a visit of its own,
 * so the card says so and quotes the spot-cleaning floor read from bk-config.
 */
const WALL_FROM = formatPrice(addOnFromPrice("standard", "spot-cleaning-inside-walls") ?? 0);

/**
 * Card copy per city. The services and their links are identical; the words
 * are not, because both hubs render this chapter and the money-page contract
 * caps how much of the Calgary hub may repeat the Edmonton one.
 */
const COPY = {
  Edmonton: {
    heading: <>Pick the clean that fits the job in <Accent>Edmonton</Accent></>,
    standard: "Standard cleaning is a maintenance clean of the kitchen, bathrooms, bedrooms and floors, with the dusting and surfaces done. It suits a home that needs regular upkeep.",
    deep: "Deep cleaning is the standard checklist plus the deep-clean package, which adds the baseboards, doors, light switches, wall outlets and vent covers. In Edmonton it suits the weeks after the spring melt, which brings a whole winter of grit indoors.",
    move: "A move-in or move-out clean is done in the empty home. It is booked for tenant turnover, for listing photos and ahead of the move-out inspection a landlord completes with the tenant.",
    moveNote: "Book it for the empty day between the last box and the walkthrough.",
    // Was "Same cleaner on a schedule". The recurring page says we do our best
    // to send the same team and policy.ts carries no continuity term, so the
    // card promised something the service pages take back.
    recurring: `Recurring cleaning is the standard clean on a schedule. From the second visit you save ${RECURRING_DISCOUNTS}; the first visit is charged at the one-time rate, and we send your regular team where we can.`,
    post: "Post-construction cleaning clears the drywall and construction dust that a renovation or a new build leaves behind. It is priced by square footage.",
    wall: `Wall washing takes marks, scuffs and cooking film off the walls. It is booked with a standard, deep or move-out clean, and spot cleaning starts at ${WALL_FROM} before GST, by home size.`,
  },
  Calgary: {
    heading: <>Calgary services, from upkeep to <Accent>handover</Accent></>,
    standard: "The upkeep visit covers the kitchen, bathrooms, bedrooms, floors and dusting, worked from the same list every time. It is the right choice for a home that is already in reasonable shape.",
    deep: "Deep cleaning is the standard checklist with the deep-clean package added: baseboards, doors, light switches, wall outlets and vent covers. It suits the end of a Calgary winter, after months of chinook thaws have carried sand and de-icer to the door.",
    move: "Move-out cleaning is an empty-home clean for the handover. Tenants, landlords and sellers book it, and so does anyone who needs the rooms ready for listing photos.",
    moveNote: "Book it around the possession date.",
    recurring: `Recurring cleaning puts the standard clean on a set day, with your regular team where we can send them. The discount starts at visit two: ${RECURRING_DISCOUNTS}.`,
    post: "Post-construction cleaning lifts the fine dust from drywall and sanding after a renovation or on possession of a new build. It is priced by square footage.",
    wall: `Wall washing handles hallway scuffs, kitchen film and the wall behind the stove. It is added to a standard, deep or move-out clean and cannot be booked alone, and spot cleaning is priced by home size from ${WALL_FROM} before GST.`,
  },
} as const;

interface CityServicesChapterProps {
  city: "Edmonton" | "Calgary";
  /** e.g. "/edmonton" */
  basePath: string;
  featureImage: string;
  featureImageAlt: string;
  /** Vertical crop for the Deep Cleaning panel. */
  deepImage: string;
  deepImageAlt: string;
}

/**
 * Services as an editorial chapter rather than four equal cards:
 * Standard is an oversized warm-paper panel, Deep a vertical photo panel,
 * Move-In/Out a full-width deep-ink band, Post-Construction a slim card.
 * Same links, same destinations, same CTA positions.
 */
export default function CityServicesChapter({
  city,
  basePath,
  featureImage,
  featureImageAlt,
  deepImage,
  deepImageAlt,
}: CityServicesChapterProps) {
  const heading = useRevealOnScroll<HTMLDivElement>();
  const copy = COPY[city];

  return (
    <section className="band band-white band-hairline">
      <div className="container mx-auto px-4">
        <div ref={heading.ref} className={`max-w-2xl ${heading.className}`}>
          <Eyebrow>Services</Eyebrow>
          <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">{copy.heading}</h2>
          <span className={`rule-draw mt-4 ${heading.className}`} aria-hidden="true" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
          {/* Oversized warm-paper panel */}
          <div
            className="motion-lift paper-rule card-warm group relative flex flex-col overflow-hidden border bg-white"
          >
            <div className="relative h-56 w-full overflow-hidden md:h-72 lg:h-80">
              <img
                src={featureImage}
                alt={featureImageAlt}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="flex flex-1 flex-col p-6 md:p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <span className="dc-icon dc-icon-sparkles h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="display-serif text-2xl font-bold md:text-3xl">Standard Cleaning</h3>
              <p className="mt-3 max-w-[52ch] text-muted-foreground leading-relaxed">{copy.standard}</p>
              <Link
                  to={canonicalForPath(`${basePath}/regular-cleaning`)}
                  className="mt-5 inline-flex items-center font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1 after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Standard cleaning in {city} <span className="dc-icon dc-icon-arrow-right ml-1.5 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Vertical photo panel */}
          <div
            className="motion-lift paper-rule card-warm group relative flex min-h-[420px] flex-col overflow-hidden border bg-white"
          >
            <div className="relative flex-1 overflow-hidden">
              <img
                src={deepImage}
                alt={deepImageAlt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
              />
            </div>
            <div className="p-6">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Home className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <h3 className="font-bold">Deep Cleaning</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{copy.deep}</p>
              <Link
                  to={canonicalForPath(`${basePath}/deep-cleaning`)}
                  className="mt-3 inline-flex items-center text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1 after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  Deep cleaning in {city} <span className="dc-icon dc-icon-external-link ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>

        {/* Full-width deep-ink band */}
        <div
          className="surface-ink motion-lift card-warm group mt-6 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8 relative"
        >
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-brand-navy-foreground/10">
            <Truck className="h-7 w-7 text-accent-on-dark" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="display-serif text-2xl font-bold">Move-In / Move-Out</h3>
            <p className="mt-2 max-w-[60ch] leading-relaxed text-brand-navy-foreground/85">{copy.move}</p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-brand-navy-foreground/70">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              {copy.moveNote}
            </p>
          </div>
          <Link
              to={canonicalForPath(`${basePath}/move-in-move-out-cleaning`)}
              className="inline-flex items-center font-semibold text-accent-on-dark transition-transform duration-300 group-hover:translate-x-1 after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              Move-in and move-out cleaning in {city} <span className="dc-icon dc-icon-arrow-right ml-1.5 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/*
          Recurring was missing from this page entirely — the highest-lifetime-
          value service and the biggest price lever the business has, present in
          the homepage meta description and then nowhere in its body but a
          footer link. It gets a slim card beside post-construction, with the
          discounts, because the discount is the whole proposition.
        */}
        <div
          className="motion-lift paper-rule card-warm group mt-6 flex items-center gap-4 border bg-white p-5 md:p-6 relative"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Repeat className="h-6 w-6 text-accent" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Recurring</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{copy.recurring}</p>
          </div>
          <Link
              to={canonicalForPath(`${basePath}/recurring-cleaning`)}
              className="hidden items-center text-sm font-semibold text-accent transition-transform duration-300 group-hover:translate-x-1 sm:inline-flex after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {city} recurring cleaning <span className="dc-icon dc-icon-external-link ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Slim paper card */}
        <div
          className="motion-lift paper-rule card-warm group mt-6 flex items-center gap-4 border bg-white p-5 md:p-6 relative"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <HardHat className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Post-Construction</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{copy.post}</p>
          </div>
          <Link
              to={canonicalForPath(`${basePath}/post-construction-cleaning`)}
              className="hidden items-center text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1 sm:inline-flex after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {city} post-construction cleaning <span className="dc-icon dc-icon-external-link ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* Wall washing. Six of the seven services were linked from these two
            hubs and this was the seventh — no route to it from the body of
            either page, though both hubs sell it. It is an extra on a clean,
            not a visit of its own, so it sits after post-construction with the
            price it is added at. Edmonton's canonical is
            /wall-washing-wall-cleaning/, Calgary's the -calgary twin; both come
            out of canonicalForPath from the route path. */}
        <div
          className="motion-lift paper-rule card-warm group mt-6 flex items-center gap-4 border bg-white p-5 md:p-6 relative"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <PaintRoller className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Wall Washing</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{copy.wall}</p>
          </div>
          <Link
            to={canonicalForPath(`${basePath}/wall-washing`)}
            className="hidden items-center text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1 sm:inline-flex after:absolute after:inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {city} wall washing <span className="dc-icon dc-icon-external-link ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        {/* The commercial card that sat here went in September 2026. These are
            the residential hubs, and the content prompt puts commercial and
            office cleaning out of scope on residential pages. The commercial
            pages keep their own routes and navigation links. */}
        <div className="mt-10 text-center">
          <Link
            to={canonicalForPath(`${basePath}/services`)}
            className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline"
          >
            Compare cleaning services in {city} <span className="dc-icon dc-icon-external-link ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    <p className="container mx-auto px-4 pb-8 text-center text-sm text-muted-foreground">For a workplace, <Link to={city === "Edmonton" ? "/commercial-cleaning/" : "/commercial-cleaning-services-calgary/"} className="text-primary underline">request an office cleaning quote in {city}</Link>. Office work is scoped separately from residential cleaning.</p>
      </section>
  );
}
