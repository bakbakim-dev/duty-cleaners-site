/**
 * Verified Google reviews.
 *
 * Hard rule: nothing in this file may be invented. Every entry must be a
 * verbatim review copied from the Google Business Profile linked in
 * `src/lib/google-listings.ts`, with the reviewer's real display name and
 * the real recency label Google shows.
 *
 * The arrays start empty on purpose — the review sections simply don't
 * render until real reviews are pasted in. An empty proof section is
 * honest; a fabricated one is not.
 *
 * TODO-OWNER: paste the real Edmonton and Calgary reviews below.
 */

export interface CityReview {
  /** Reviewer name exactly as Google displays it. */
  name: string;
  /** Avatar letter — derived from the name. */
  initial: string;
  /** Neighbourhood, only when the review itself states it. */
  location: string;
  /** Tailwind class for the avatar chip. */
  color: string;
  /** Recency label as shown on Google, e.g. "2 weeks ago". */
  date: string;
  /** The review text, verbatim. */
  text: string;
}

export const EDMONTON_REVIEWS: CityReview[] = [];

export const CALGARY_REVIEWS: CityReview[] = [];

export const reviewsForCity = (city: string): CityReview[] =>
  city.toLowerCase().startsWith("calgary") ? CALGARY_REVIEWS : EDMONTON_REVIEWS;
