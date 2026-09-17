import { useEffect, useState } from "react";
import { withTrailingSlash } from "@/data/legacy-urls";
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
  /*
    The two lists are NOT the same kind of place, and the marquee used to print
    the hub city under both: "Leduc / Edmonton", "Black Diamond / Calgary".
    Leduc is its own city with its own mayor, and Black Diamond is a town 60 km
    from Calgary — labelling them as the hub city is a false geographic claim,
    on the two pages that carry 63.9% of site value. This site has shipped 59
    of those before, and the data already keeps the two classes apart; only
    this component collapsed them.

    Neighbourhoods keep the city as their qualifier because that is what they
    are. Separate municipalities get the province instead, which is true of
    both and still reads as a place line.
  */
  const neighbourhoods = city === "Calgary" ? calgaryNeighborhoods : edmontonNeighborhoods;
  const surrounding = city === "Calgary" ? calgarySurrounding : edmontonSurrounding;
  const places: Array<CityLocation & { qualifier: string }> = [
    ...neighbourhoods.slice(0, 9).map((place) => ({ ...place, qualifier: city })),
    ...surrounding.slice(0, 5).map((place) => ({ ...place, qualifier: "AB" })),
  ];

  // The seamless loop needs the list twice, but the second copy is pure
  // animation: it carries no link a crawler needs (every one is in the first
  // copy) and it cost every prerendered hub 60 nodes before hydration. Ship
  // one copy; add the duplicate and start the animation once JavaScript is
  // running. Until then the row simply sits still.
  const [looping, setLooping] = useState(false);
  useEffect(() => setLooping(true), []);
  const run = (ariaHidden: boolean) => (
    <div className="flex w-max items-baseline" aria-hidden={ariaHidden || undefined}>
      {places.map(({ name, to, qualifier }) => (
        <span key={`${to}${ariaHidden ? "-b" : ""}`} className="flex items-baseline">
          <Link
            to={withTrailingSlash(to)}
            tabIndex={ariaHidden ? -1 : undefined}
            className="display-serif whitespace-nowrap px-2 text-4xl font-bold tracking-tight text-foreground transition-colors hover:text-accent md:text-6xl"
          >
            {name}
          </Link>
          <span className="display-serif whitespace-nowrap pr-6 text-lg italic text-muted-foreground md:text-2xl">
            {qualifier}
          </span>
          <span className="px-4 text-brand-gold" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="band-hairline overflow-hidden bg-card py-10 md:py-14" aria-label={`Neighbourhoods and communities the ${city} branch serves`}>
      <div className="dc-marquee" title="Hover to pause">
        <div className={`flex w-max${looping ? " dc-marquee-track" : ""}`}>
          {run(false)}
          {looping && run(true)}
        </div>
      </div>
    </section>
  );
}
