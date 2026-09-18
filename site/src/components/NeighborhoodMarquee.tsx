import { useEffect, useState } from "react";
import { withTrailingSlash } from "@/data/legacy-urls";
import { Link } from "react-router-dom";
import { Pause, Play } from "lucide-react";
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
 * links to its registered location page. It is the one marquee left on the
 * hubs. Pauses on hover and focus, and from the pause button (WCAG 2.2.2 is
 * Level A, and hover is no mechanism at all on a touch screen); static when
 * the visitor prefers reduced motion.
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
  const [paused, setPaused] = useState(false);
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
          <span className="display-serif whitespace-nowrap pr-12 text-lg italic text-muted-foreground md:pr-16 md:text-2xl">
            {qualifier}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section className="band-hairline relative overflow-hidden bg-card py-10 md:py-14" aria-label={`Neighbourhoods and communities the ${city} branch serves`}>
      {looping && (
        <button
          type="button"
          onClick={() => setPaused((was) => !was)}
          className="absolute right-2 top-2 z-10 motion-reduce:hidden inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white/90 text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          <span className="sr-only">{paused ? "Resume the scrolling place names" : "Pause the scrolling place names"}</span>
        </button>
      )}
      <div className="dc-marquee">
        <div
          className={`flex w-max${looping ? " dc-marquee-track" : ""}`}
          style={paused ? { animationPlayState: "paused" } : undefined}
        >
          {run(false)}
          {looping && run(true)}
        </div>
      </div>
    </section>
  );
}
