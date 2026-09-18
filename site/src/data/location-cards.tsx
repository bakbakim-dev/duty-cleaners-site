/**
 * The service cards and "why us" cards every location page shows: ONE copy.
 *
 * Until 2026-09-18 these two arrays were typed out inside 150 files under
 * src/pages/locations/ and again, in a different wording, inside
 * LocationPageTemplate.tsx. The copies had drifted: 146 of 150 carried the
 * canonical standard-clean sentence, 75 pages had no Recurring card, two had a
 * Post-Construction card with no link.
 *
 * They are also short on purpose. AuditSpur scan 1145 measured the location
 * pages on one continuous band of similarity to their nearest neighbour (median
 * 0.47, 44 pages over the 0.5 bar). On /locations/casselman-edmonton/, of 603
 * compared words only 165 were the page's own; 246 were these card descriptions,
 * identical on 138-151 pages, and the vetting sentence ran again in a paragraph
 * and in the footer. Each service page already says what its service includes,
 * so a service card is a title and a geo-qualified link, nothing more, and a
 * "why us" card is a title. The one card that keeps a line is the rating card:
 * it names the branch's review count and links the listing it was read from.
 * What makes a location page worth having is its researched local copy; that
 * now carries the page.
 *
 * Measured with AuditSpur's own functions on the build (three-word phrases, net
 * of paragraphs on 80% of the site; bar 0.5), nearest-neighbour similarity:
 *   as it was            median 0.47  highest 0.56  44 pages at the bar
 *   one-line cards       median 0.44  highest 0.54  14 pages
 *   titles only (this)   median 0.37  highest 0.45   0 pages
 * One-line descriptions were tried first and were not enough.
 *
 * Do NOT pad these back out, do not hide text to get under a similarity bar,
 * and do not reintroduce per-page variants ("spinning").
 */
import type { ElementType, ReactNode } from "react";
import { CalendarCheck, Home, Leaf, PaintRoller, Shield, Sparkles, SprayCan, Star, ThumbsUp, Truck } from "lucide-react";
import { canonicalForPath } from "@/data/legacy-urls";
import { CITY_PROOF, RATING_CLAIM } from "@/data/proof";
import { getListing } from "@/lib/google-listings";

export type LocationRegion = "edmonton" | "calgary";
export type LocationServiceKey = "standard" | "deep" | "move-out" | "post-construction" | "wall-washing" | "recurring";

export interface LocationServiceCard {
  icon: ElementType;
  title: string;
  to: string;
  linkText: string;
}

export interface LocationWhyUsCard {
  icon: ElementType;
  title: string;
  description?: ReactNode;
}

/** The full menu, in the order the grid shows it. */
export const ALL_LOCATION_SERVICES: readonly LocationServiceKey[] = [
  "standard",
  "deep",
  "move-out",
  "post-construction",
  "wall-washing",
  "recurring",
];

const PATHS: Record<LocationRegion, Record<LocationServiceKey, string>> = {
  edmonton: {
    standard: "/edmonton/regular-cleaning",
    deep: "/edmonton/deep-cleaning",
    "move-out": "/move-out-cleaning-edmonton",
    "post-construction": "/post-construction-cleaning",
    "wall-washing": "/wall-washing-wall-cleaning",
    recurring: "/edmonton/recurring-cleaning",
  },
  calgary: {
    standard: "/calgary/regular-cleaning",
    deep: "/calgary/deep-cleaning",
    "move-out": "/move-out-cleaning-calgary",
    "post-construction": "/post-construction-cleaning-calgary",
    "wall-washing": "/wall-washing-wall-cleaning-calgary",
    recurring: "/calgary/recurring-cleaning",
  },
};

const CARD: Record<LocationServiceKey, { icon: ElementType; title: string; link: string }> = {
  standard: { icon: Home, title: "Standard Cleaning", link: "Standard cleaning" },
  deep: { icon: Sparkles, title: "Deep Cleaning", link: "Deep cleaning" },
  "move-out": { icon: Truck, title: "Move In/Out Cleaning", link: "Move-out cleaning" },
  "post-construction": { icon: SprayCan, title: "Post-Construction Cleanup", link: "Post-construction cleaning" },
  "wall-washing": { icon: PaintRoller, title: "Wall Washing", link: "Wall washing" },
  recurring: { icon: CalendarCheck, title: "Recurring Cleaning", link: "Recurring cleaning" },
};

/**
 * The service cards for one place. `keys` is the set that page shows: twelve
 * pages state their own count in the copy ("five services", "six services"),
 * so a page keeps the cards it has; pass nothing for the full menu.
 */
export function locationServices(
  place: string,
  region: LocationRegion,
  keys: readonly LocationServiceKey[] = ALL_LOCATION_SERVICES,
): LocationServiceCard[] {
  return keys.map((key) => ({
    icon: CARD[key].icon,
    title: CARD[key].title,
    // The geo-qualified anchor is the point of the grid: it is the body link
    // that carries the local signal to the service page.
    to: canonicalForPath(PATHS[region][key]),
    linkText: `${CARD[key].link} in ${place}`,
  }));
}

/**
 * The four "why us" cards. `third` replaces the supplies card on a page that has
 * something of its own to say there (Aspen Woods: what a 3-step ladder reaches).
 */
export function locationWhyUs(region: LocationRegion, third?: LocationWhyUsCard): LocationWhyUsCard[] {
  return [
    { icon: Shield, title: "Reference-checked, then rated by you" },
    // Each page states its own branch's count and links the listing it came
    // from. It used to add the two branches together, a sum Google never reports.
    {
      icon: Star,
      title: RATING_CLAIM,
      description: (
        <>
          {CITY_PROOF[region].googleReviewCount} reviews on our{" "}
          <a
            href={getListing(CITY_PROOF[region].city).reviewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-white underline underline-offset-2 hover:text-accent"
          >
            {CITY_PROOF[region].city} Google listing
          </a>
          , which is where that rating is read from.
        </>
      ),
    },
    third ?? { icon: Leaf, title: "All supplies brought for you" },
    // The window is part of the promise, so it is in the title (policy.ts: 24 hours from the clean).
    { icon: ThumbsUp, title: "24-hour re-clean guarantee" },
  ];
}
