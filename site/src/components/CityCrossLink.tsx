
import { Link } from "react-router-dom";
import Eyebrow from "@/components/Eyebrow";

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
      {/* motion-lift is the guarded hover (index.css: only under
          prefers-reduced-motion: no-preference). The whole card is the link. */}
      <div className="motion-lift group relative flex flex-col items-start gap-5 rounded-lg bg-brand-navy p-6 text-brand-navy-foreground shadow-lg shadow-brand-navy/15 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-brand-gold/15 text-brand-gold">
            <span className="dc-icon dc-icon-map-pin h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            {/* index.css remaps .text-accent to the on-dark accent inside .bg-brand-navy. */}
            <Eyebrow>Also serving {city}</Eyebrow>
            <p className="mt-1 text-lg font-bold">Duty Cleaners {city}</p>
            <p className="mt-1 max-w-md text-sm leading-relaxed text-brand-navy-foreground/75">{description}</p>
          </div>
        </div>
        <Link
          to={to}
          className="inline-flex shrink-0 items-center gap-2 font-semibold text-accent-on-dark after:absolute after:inset-0 after:rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
        >
          {linkText ?? `Explore ${city} services`}
          <span className="dc-icon dc-icon-arrow-right h-5 w-5 transition-transform duration-300 motion-safe:group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
