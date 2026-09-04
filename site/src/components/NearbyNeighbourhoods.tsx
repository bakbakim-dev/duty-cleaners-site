import { Link, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import { canonicalForPath } from "@/data/legacy-urls";
import { nearbyFor, placeNameFor } from "@/data/nearby";

/**
 * Links out to the five closest sibling location pages.
 *
 * WHY
 * The location network was almost a star. Every one of the 166 neighbourhood
 * pages received a link from the /locations/ hub and sent almost nothing
 * onward: the median page had 3 outbound location links, and 61 pages had 2 or
 * fewer inbound. Authority arriving at the hub had nowhere to flow, and a
 * visitor who landed on the wrong neighbourhood had no route to the right one
 * except back through the directory.
 *
 * The neighbours come from src/data/nearby.ts, which is generated from the
 * coordinates the site already publishes in its GeoCoordinates schema — so the
 * word "nearby" is load-bearing and true. Pages with no sibling inside 12 km
 * render nothing rather than a misleading list.
 */
/**
 * WHY THERE IS NO COPY ROTATION HERE ANY MORE
 *
 * This block used to pick one of six headings and one of six blurbs by hashing
 * the page's path, so the same section read six different ways across 155
 * pages. The comment that stood here said why: fixed copy "pushed three page
 * pairs to 60% raw overlap", and the hash was later changed from h*31 to FNV-1a
 * because the old one "put /locations/larkspur-edmonton/ and
 * /locations/schonsee-edmonton/ on the SAME heading and the SAME blurb".
 *
 * That is spun copy. It was not written to serve a reader — six ways of saying
 * "here are some nearby areas" tell nobody anything — it was written to move a
 * duplication metric, which is the practice src/data/localization.test.ts
 * already forbids elsewhere in this codebase and which the location template
 * had its own spinner removed for.
 *
 * The heading now names the neighbourhood. That is better on both counts: it is
 * genuinely different text on every page, because the place really is
 * different, and it does keyword work that "A few minutes from here" never did.
 * The shared mass it costs is one short blurb. Measured after the change, the
 * worst location-page pair sits well inside the 0.70 ceiling that guard
 * enforces.
 */
export default function NearbyNeighbourhoods() {
  const { pathname } = useLocation();
  const canonical = canonicalForPath(pathname);
  const places = nearbyFor(canonical);
  if (places.length === 0) return null;

  const place = placeNameFor(canonical);

  return (
    <section className="py-14 md:py-16 bg-muted/30 border-y border-border" aria-labelledby="nearby-heading">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-medium uppercase tracking-wide text-primary">
              Close by
            </span>
          </div>
          <h2 id="nearby-heading" className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-3 text-balance">
            {place ? `Near ${place}: other areas we clean` : "Other areas we clean"}
          </h2>
          <p className="text-muted-foreground mb-7">
            Same crews, same flat rates by home size.
          </p>
          <ul className="flex flex-wrap justify-center gap-3">
            {places.map((place) => (
              <li key={place.to}>
                <Link
                  to={place.to}
                  className="inline-flex min-h-[44px] items-center rounded-full border border-border bg-white/70 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  {place.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
