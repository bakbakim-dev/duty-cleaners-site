import { Accessibility, Baby, Briefcase, Building2, Home, PawPrint, type LucideIcon } from "lucide-react";
import { Accent } from "@/components/Accent";
import { addOnFromPrice, formatPrice, FREQUENCIES } from "@/data/pricing";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";

type City = "Edmonton" | "Calgary";

interface Persona {
  icon: LucideIcon;
  label: string;
  title: string;
  desc: (city: City) => string;
}

/** The compulsory pet charge, read from bk-config rather than typed. */
const PET_FEE = addOnFromPrice("standard", "must-choose-if-you-have-pets");

/** The recurring discounts, read from bk-config: "20% weekly, 15% bi-weekly, 10% every 4 weeks". */
const RECURRING_DISCOUNTS = FREQUENCIES
  .filter((frequency) => frequency.discount > 0)
  .sort((a, b) => b.discount - a.discount)
  .map((frequency) => `${Math.round(frequency.discount * 100)}% ${frequency.label.toLowerCase()}`)
  .join(", ");

const personas: Persona[] = [
  {
    icon: Briefcase,
    label: "For long workdays",
    title: "People Out at Work",
    desc: () =>
      "You do not need to be home. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when it leaves.",
  },
  {
    icon: Baby,
    label: "For growing families",
    title: "Families With Kids",
    desc: () =>
      "You do not need to clean before the team comes. Clear floors and counters get cleaned, and cluttered ones get worked around.",
  },
  {
    icon: PawPrint,
    label: "For homes with pets",
    title: "Pet Owners",
    desc: () =>
      PET_FEE === null
        ? "Homes with pets carry a compulsory charge per visit, and it shows on the quote before you book. Litter boxes and animal waste are not part of the clean."
        : `Homes with pets carry a ${formatPrice(PET_FEE)} charge per visit before GST, and it shows on the quote before you book. Litter boxes and animal waste are not part of the clean.`,
  },
  {
    icon: Accessibility,
    label: "For older adults",
    title: "Seniors",
    desc: () =>
      "The team brings all the supplies and equipment, so there is nothing to buy, carry or store. Lifting anything over 25 lb is not part of the clean.",
  },
  {
    icon: Building2,
    label: "For rentals between tenants",
    title: "Landlords & Property Managers",
    desc: (city) =>
      `Move-out cleaning between ${city} tenancies is an empty-home clean, priced flat by the size of the unit before GST. Under Alberta's Residential Tenancies Act, the landlord completes the move-out inspection report with the tenant.`,
  },
  {
    icon: Home,
    label: "For regular upkeep",
    title: "Homeowners on a Schedule",
    desc: () =>
      `A standard clean on a schedule costs less from the second visit: ${RECURRING_DISCOUNTS}. The first visit is charged at the one-time rate.`,
  },
];

export function WhoWeHelp({ city }: { city: City }) {
  const proof = city === "Calgary" ? CITY_PROOF.calgary : CITY_PROOF.edmonton;
  const ratingLine = proof.googleReviewCount
    ? `Rated ${RATING_CLAIM}, from ${proof.googleReviewCount} reviews on the ${city} listing.`
    : `Rated ${RATING_CLAIM} by ${city} customers.`;

  return (
    <section id="who-we-help" className="bg-white py-16 md:py-24" aria-labelledby={`who-we-help-${city.toLowerCase()}`}>
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center md:mb-16">
          <div className="mb-4 flex items-center justify-center gap-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
            <span>Who We Help</span>
            <span className="h-px w-8 bg-accent/60" aria-hidden="true" />
          </div>
          <h2 id={`who-we-help-${city.toLowerCase()}`} className="text-3xl font-bold leading-tight text-foreground md:text-5xl">
            Who books house cleaners in {city}, <Accent>and what each of them should know.</Accent>
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {ratingLine}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <article
                key={persona.title}
                className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-brand-gold/60 hover:shadow-xl hover:shadow-primary/10 md:p-7"
              >
                <span
                  className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-brand-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
                  aria-hidden="true"
                />
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-navy text-brand-gold transition-colors duration-300 group-hover:bg-brand-gold group-hover:text-brand-navy">
                  <Icon className="h-7 w-7" aria-hidden="true" />
                </div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.14em] text-accent">{persona.label}</p>
                <h3 className="mb-2 text-lg font-bold text-foreground">{persona.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{persona.desc(city)}</p>
              </article>
            );
          })}
        </div>

        <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-5 text-center">
          <ul className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground">
            {["You pay after the clean", "We bring the supplies", "Reference-checked cleaners"].map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                {i > 0 && <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />}
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a
            href="#quote-form"
            className="inline-flex min-h-[48px] items-center gap-2 rounded-lg bg-accent px-6 py-3 text-sm font-bold text-accent-foreground shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/90 hover:shadow-md"
          >
            See My Instant Price
            <span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
