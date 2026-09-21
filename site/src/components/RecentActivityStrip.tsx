import Stars from "@/components/Stars";
import { BadgeCheck } from "lucide-react";
import type { RecentCleanReview } from "@/components/CityRecentCleans";
import { BOOKINGS_CLAIM, CALGARY_RATING_CLAIM, EDMONTON_RATING_CLAIM, CITY_PROOF } from "@/data/proof";
import { getListing, openGoogleListing } from "@/lib/google-listings";

type RecentActivityStripProps = {
  city: string;
  reviews: RecentCleanReview[];
};

/**
 * One static proof row under the local note: the branch's Google rating and
 * review count, the owner-confirmed bookings figure, and a link to read the
 * reviews on Google.
 *
 * It used to be a marquee of sixteen pills that carried no review text, only
 * stars, a city and a date, half of the dates two years old on a strip named
 * "recent". The row below was that component's fallback; it is now the whole
 * component. The reviews themselves are further down the page, word for word,
 * in CityRecentCleans. `reviews` stays in the props so callers need no change.
 */
const RecentActivityStrip = ({ city }: RecentActivityStripProps) => {
  const listing = getListing(city);
  const isCalgary = city.toLowerCase().startsWith("calgary");
  const proof = isCalgary ? CITY_PROOF.calgary : CITY_PROOF.edmonton;
  const ratingLabel =
    proof.googleRating && proof.googleReviewCount
      ? `${proof.googleRating} on Google · ${proof.googleReviewCount} ${city} reviews`
      : `${isCalgary ? CALGARY_RATING_CLAIM : EDMONTON_RATING_CLAIM} in ${city}`;
  return (
    <div className="border-y border-border bg-white py-3" aria-label={`${city} trust signals`}>
      <div className="container mx-auto px-4">
        <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm font-medium text-foreground">
          <li className="inline-flex items-center gap-2">
            <Stars size={0.875} />
            {ratingLabel}
          </li>
          <li className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
            {BOOKINGS_CLAIM}
          </li>
          <li>
            <a
              href={listing.reviewsUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              onClick={(event) => openGoogleListing(event, listing.reviewsUrl)}
              className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-primary underline-offset-2 hover:text-accent hover:underline"
            >
              Read the reviews
              <span className="dc-icon dc-icon-external-link h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RecentActivityStrip;
