import { Link } from "react-router-dom";
import {
  calgaryNeighborhoods,
  calgarySurrounding,
  edmontonNeighborhoods,
  edmontonSurrounding,
  type CityLocation,
} from "@/data/city-locations";

interface NeighborhoodMarqueeProps {
  city: "Edmonton" | "Calgary";
}

/**
 * Slow-scrolling ledger of real service areas in oversized serif — every name
 * links to its registered location page. Pauses on hover; static when the
 * visitor prefers reduced motion.
 */
export default function NeighborhoodMarquee({ city }: NeighborhoodMarqueeProps) {
  const places: CityLocation[] =
    city === "Calgary"
      ? [...calgaryNeighborhoods.slice(0, 9), ...calgarySurrounding.slice(0, 5)]
      : [...edmontonNeighborhoods.slice(0, 9), ...edmontonSurrounding.slice(0, 5)];

  const run = (ariaHidden: boolean) => (
    <div className="flex w-max items-baseline" aria-hidden={ariaHidden || undefined}>
      {places.map(({ name, to }) => (
        <span key={`${to}${ariaHidden ? "-b" : ""}`} className="flex items-baseline">
          <Link
            to={to}
            tabIndex={ariaHidden ? -1 : undefined}
            className="display-serif whitespace-nowrap px-2 text-4xl font-bold tracking-tight text-foreground transition-colors hover:text-accent md:text-6xl"
          >
            {name}
          </Link>
          <span className="display-serif whitespace-nowrap pr-6 text-lg italic text-muted-foreground md:text-2xl">
            {city}
          </span>
          <span className="px-4 text-brand-gold" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="band-hairline overflow-hidden bg-card py-10 md:py-14" aria-label={`${city} neighbourhoods we serve`}>
      <div className="dc-marquee" title="Hover to pause">
        <div className="dc-marquee-track flex w-max">
          {run(false)}
          {run(true)}
        </div>
      </div>
    </section>
  );
}
