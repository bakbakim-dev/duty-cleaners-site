import { Link, useLocation } from "react-router-dom";
import { MapPin } from "lucide-react";
import { canonicalForPath } from "@/data/legacy-urls";
import { nearbyFor } from "@/data/nearby";

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
 * The block ships on 165 pages, so a single fixed heading and paragraph would
 * add ~40 identical words to every one of them. That is exactly the shared-text
 * mass the duplicate-content guard exists to catch — and it did: adding this
 * section with fixed copy pushed three page pairs to 60% raw overlap. The copy
 * therefore rotates deterministically by path, the same way the location
 * template's other shared slots do.
 */
const HEADINGS = [
  "We clean the streets either side of here too",
  "The next neighbourhoods over",
  "Where else our crews are working",
  "Just past the boundary",
  "Nearest areas on the same route",
  "A few minutes from here",
] as const;

// Short on purpose: this ships on 165 pages, so every word here is a word
// those pages share. The links carry the value; the sentence only frames them.
const BLURBS = [
  "Same crews, same flat rates by home size.",
  "On a boundary? The quote is identical either way.",
  "All within a few minutes, all priced the same.",
  "Pricing does not change from one to the next.",
  "Pick whichever is nearest — the rate is the same.",
  "Same price sheet applies across all of them.",
] as const;

/** Stable per-path index, so a page always renders the same variant. */
function variantFor(path: string, pool: number): number {
  // FNV-1a: the previous h*31 hash put /locations/larkspur-edmonton/ and
  // /locations/schonsee-edmonton/ on the SAME heading and the SAME blurb, which
  // was enough shared text to tip that already-similar pair over the 60% raw
  // duplication ceiling.
  let h = 0x811c9dc5;
  for (let i = 0; i < path.length; i++) {
    h ^= path.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h % pool;
}

export default function NearbyNeighbourhoods() {
  const { pathname } = useLocation();
  const canonical = canonicalForPath(pathname);
  const places = nearbyFor(canonical);
  if (places.length === 0) return null;

  const heading = HEADINGS[variantFor(canonical, HEADINGS.length)];
  const blurb = BLURBS[variantFor(canonical + "#b", BLURBS.length)];

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
            {heading}
          </h2>
          <p className="text-muted-foreground mb-7">
            {blurb}
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
