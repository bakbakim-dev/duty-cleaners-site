import { Star, MapPin, BadgeCheck, ShieldCheck, ExternalLink } from "lucide-react";
import type { RecentCleanReview } from "@/components/CityRecentCleans";
import { HOMES_CLEANED, RATING_CLAIM, CITY_PROOF } from "@/data/proof";
import { getListing, openGoogleListing } from "@/lib/google-listings";

type RecentActivityStripProps = {
  city: string;
  reviews: RecentCleanReview[];
};

/**
 * Horizontal marquee of recent five-star cleans, shown directly above the
 * quote form to build urgency and social proof at the conversion point.
 *
 * With no verified review text on file we still owe the visitor proof at this
 * moment — so the slot falls back to claims we can stand behind (rating,
 * homes cleaned, customer-rated cleaners) plus a link to verify on Google. Blank
 * space at the conversion point is the one option that helps nobody.
 */
const RecentActivityStrip = ({ city, reviews }: RecentActivityStripProps) => {
  if (reviews.length === 0) {
    const listing = getListing(city);
    const isCalgary = city.toLowerCase().startsWith("calgary");
    const homes = isCalgary ? HOMES_CLEANED.calgary : HOMES_CLEANED.edmonton;
    const proof = isCalgary ? CITY_PROOF.calgary : CITY_PROOF.edmonton;
    const ratingLabel =
      proof.googleRating && proof.googleReviewCount
        ? `${proof.googleRating} on Google · ${proof.googleReviewCount} ${city} reviews`
        : `${RATING_CLAIM} on Google in ${city}`;
    return (
      <div className="border-y border-border bg-white py-3" aria-label={`${city} trust signals`}>
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2">
            <span className="flex gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, index) => (
                <Star key={index} className="h-3.5 w-3.5 fill-brand-gold text-brand-gold" />
              ))}
            </span>
            {ratingLabel}
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
            {homes} {city} homes cleaned
          </span>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-accent" aria-hidden="true" />
            Pay after your clean
          </span>
          <a
            href={listing.reviewsUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={(event) => openGoogleListing(event, listing.reviewsUrl)}
            className="inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-primary underline-offset-2 hover:text-accent hover:underline"
          >
            Read the reviews
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }
  const items = [...reviews, ...reviews]; // duplicated for a seamless loop

  return (
    <div
      className="marquee-hover-pause overflow-hidden border-y border-border bg-white py-3"
      aria-label={`Recent five-star cleans in ${city}`}
    >
      <div className="animate-marquee flex w-max items-center gap-3">
        {items.map((review, index) => (
          <span
            key={`${review.name}-${index}`}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-secondary/40 px-4 py-2 text-xs font-medium text-foreground"
          >
            <span className="flex gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, starIndex) => (
                <Star key={starIndex} className="h-3 w-3 fill-brand-gold text-brand-gold" />
              ))}
            </span>
            <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {review.location}
            <span className="text-muted-foreground">· {review.date}</span>
            <BadgeCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            <span className="text-muted-foreground">Verified on Google</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityStrip;
