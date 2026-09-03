import { FREQUENCIES } from "@/data/pricing";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { ArrowRight, ExternalLink, HardHat, Home, KeyRound, Repeat, Sparkles, Truck } from "lucide-react";
import { Accent } from "@/components/Accent";
import Eyebrow from "@/components/Eyebrow";
import useRevealOnScroll from "@/hooks/use-reveal-on-scroll";

/**
 * The discounts, read from bk-config. They are the reason to choose a
 * recurring plan, so the card leads with them rather than describing the
 * cadence in the abstract.
 */
const RECURRING_PITCH = `Same cleaner on a schedule, and from the second visit you save ${FREQUENCIES
  .filter((frequency) => frequency.discount > 0)
  .sort((a, b) => b.discount - a.discount)
  .map((frequency) => `${Math.round(frequency.discount * 100)}% ${frequency.label.toLowerCase()}`)
  .join(", ")}.`;

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

  return (
    <section className="band band-white band-hairline">
      <div className="container mx-auto px-4">
        <div ref={heading.ref} className={`max-w-2xl ${heading.className}`}>
          <Eyebrow>Services</Eyebrow>
          <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2">
            Our Top Services in <Accent>{city}</Accent>
          </h2>
          <span className={`rule-draw mt-4 ${heading.className}`} aria-hidden="true" />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
          {/* Oversized warm-paper panel */}
          <Link
            to={canonicalForPath(`${basePath}/services`)}
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
                <Sparkles className="h-7 w-7 text-primary" aria-hidden="true" />
              </div>
              <h3 className="display-serif text-2xl font-bold md:text-3xl">Standard Cleaning</h3>
              <p className="mt-3 max-w-[52ch] text-muted-foreground leading-relaxed">
                A maintenance clean for kitchens, bathrooms, bedrooms, floors, dusting, and surfaces.
                Best for homes that need regular upkeep.
              </p>
              <span className="mt-5 inline-flex items-center font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
                Explore standard cleaning <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>

          {/* Vertical photo panel */}
          <Link
            to={canonicalForPath(`${basePath}/services`)}
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
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                A more detailed top-to-bottom clean for built-up dust, grime, baseboards, bathrooms,
                kitchens, and hard-to-reach areas.
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1">
                Explore deep cleaning <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>

        {/* Full-width deep-ink band */}
        <Link
          to={canonicalForPath(`${basePath}/move-in-move-out-cleaning`)}
          className="surface-ink motion-lift card-warm group mt-6 flex flex-col gap-6 p-6 md:flex-row md:items-center md:p-8"
        >
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-brand-navy-foreground/10">
            <Truck className="h-7 w-7 text-accent-on-dark" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="display-serif text-2xl font-bold">Move-In / Move-Out</h3>
            <p className="mt-2 max-w-[60ch] leading-relaxed text-brand-navy-foreground/85">
              A detailed empty-home clean designed for move transitions, listing photos, tenant
              turnover, and landlord walkthroughs.
            </p>
            <p className="mt-3 inline-flex items-center gap-2 text-sm text-brand-navy-foreground/70">
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Keys in, keys out — timed around your walkthrough.
            </p>
          </div>
          <span className="inline-flex items-center font-semibold text-accent-on-dark transition-transform duration-300 group-hover:translate-x-1">
            Explore move-in/out cleaning <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
          </span>
        </Link>

        {/*
          Recurring was missing from this page entirely — the highest-lifetime-
          value service and the biggest price lever the business has, present in
          the homepage meta description and then nowhere in its body but a
          footer link. It gets a slim card beside post-construction, with the
          discounts, because the discount is the whole proposition.
        */}
        <Link
          to={canonicalForPath(`${basePath}/recurring-cleaning`)}
          className="motion-lift paper-rule card-warm group mt-6 flex items-center gap-4 border bg-white p-5 md:p-6"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent/10">
            <Repeat className="h-6 w-6 text-accent" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Recurring</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              {RECURRING_PITCH}
            </p>
          </div>
          <span className="hidden items-center text-sm font-semibold text-accent transition-transform duration-300 group-hover:translate-x-1 sm:inline-flex">
            Explore recurring cleaning <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
          </span>
        </Link>

        {/* Slim paper card */}
        <Link
          to={canonicalForPath(`${basePath}/post-construction-cleaning`)}
          className="motion-lift paper-rule card-warm group mt-6 flex items-center gap-4 border bg-white p-5 md:p-6"
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <HardHat className="h-6 w-6 text-primary" aria-hidden="true" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">Post-Construction</h3>
            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
              Dust and debris removal after renovations or constructions.
            </p>
          </div>
          <span className="hidden items-center text-sm font-semibold text-primary transition-transform duration-300 group-hover:translate-x-1 sm:inline-flex">
            Explore post-construction <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
          </span>
        </Link>

        <div className="mt-10 text-center">
          <Link
            to={canonicalForPath(`${basePath}/services`)}
            className="inline-flex min-h-[44px] items-center font-semibold text-primary hover:underline"
          >
            View all {city} services <ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
