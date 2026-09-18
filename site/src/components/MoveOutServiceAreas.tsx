import { Link } from "react-router-dom";

import {
  calgaryNeighborhoods,
  calgarySurrounding,
  edmontonNeighborhoods,
  edmontonSurrounding,
} from "@/data/city-locations";
import { canonicalForPath, withTrailingSlash } from "@/data/legacy-urls";

interface MoveOutServiceAreasProps {
  city: "Edmonton" | "Calgary";
}

/**
 * Where move-out cleaning is offered, named and linked.
 *
 * The two move-out pages had opposite problems. Edmonton — the site's
 * second-most-valuable page and its best-ranking geo page — named ZERO of its
 * 80 neighbourhoods and had no coverage section at all. Calgary had one, but
 * its fifteen places were a hardcoded array rendered as plain spans, so the
 * lower-value twin carried the geography and neither page linked to a single
 * location page from its body.
 *
 * Both now read the same data the marquee, the coverage grid and areaServed
 * read, and the names are links, because a location page is what a reader
 * searching "move out cleaning <suburb>" actually wants next.
 *
 * Neighbourhoods and separate municipalities stay in labelled groups. Leduc is
 * its own city and Airdrie is not a Calgary neighbourhood; collapsing the two
 * lists is how this repo has produced false geographic claims before.
 */
export default function MoveOutServiceAreas({ city }: MoveOutServiceAreasProps) {
  const isCalgary = city === "Calgary";
  const neighbourhoods = (isCalgary ? calgaryNeighborhoods : edmontonNeighborhoods).slice(0, 16);
  const towns = isCalgary ? calgarySurrounding : edmontonSurrounding;

  const group = (label: string, places: typeof neighbourhoods) => (
    <div>
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{label}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {places.map((place) => (
          <Link
            key={place.to}
            to={withTrailingSlash(canonicalForPath(place.to))}
            className="flex items-center gap-2 text-sm text-foreground transition-colors hover:text-accent"
          >
            <span className="dc-icon dc-icon-map-pin h-4 w-4 flex-shrink-0 text-primary" aria-hidden="true" />
            <span>{place.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="display-serif text-3xl md:text-4xl font-bold text-center mb-4">
          Move Out Cleaning Throughout {city}
        </h2>
        <p className="text-center text-muted-foreground mb-12">
          The move-out checklist and the prices by home size are the same in every place named here,
          and each one has its own page. Communities outside {city} city limits add a travel fee.
        </p>

        <div className="flex flex-col gap-10 rounded-xl border border-border bg-white p-8">
          {group(`${city} neighbourhoods`, neighbourhoods)}
          {group(`Outside ${city} city limits`, towns)}
        </div>
      </div>
    </section>
  );
}
