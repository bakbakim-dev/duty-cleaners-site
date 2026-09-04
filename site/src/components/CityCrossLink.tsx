import { ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

interface CityCrossLinkProps {
  city: string;
  to: string;
  description: string;
  /**
   * Anchor text. Defaults to "Explore {city} services", but a caller that knows
   * the service should say so — this is the only link between a service page
   * and its twin in the other city, and "Deep cleaning in Calgary" describes
   * the destination where the default does not.
   */
  linkText?: string;
}

export default function CityCrossLink({ city, to, description, linkText }: CityCrossLinkProps) {
  return (
    <div className="mx-auto mt-12 max-w-4xl">
      <div className="group relative flex flex-col items-start gap-5 rounded-2xl bg-brand-navy p-6 text-brand-navy-foreground shadow-lg shadow-brand-navy/15 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-brand-navy/25 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-gold/15 text-brand-gold">
            <MapPin className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-gold">Also serving {city}</p>
            <p className="mt-1 text-lg font-bold">Duty Cleaners {city}</p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-brand-navy-foreground/75">{description}</p>
          </div>
        </div>
        <Link
          to={to}
          className="inline-flex shrink-0 items-center gap-2 font-semibold text-brand-gold after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          {linkText ?? `Explore ${city} services`}
          <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
