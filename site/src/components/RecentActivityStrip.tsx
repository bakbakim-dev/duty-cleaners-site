import { useState } from "react";
import Stars from "@/components/Stars";
import { Pause, Play, BadgeCheck, ShieldCheck } from "lucide-react";
import type { RecentCleanReview } from "@/components/CityRecentCleans";
import { BOOKINGS_CLAIM, RATING_CLAIM, CITY_PROOF } from "@/data/proof";
import { getListing, openGoogleListing } from "@/lib/google-listings";

type RecentActivityStripProps = {
  city: string;
  reviews: RecentCleanReview[];
};

/**
 * Horizontal marquee of recent Google reviews, shown directly above the
 * quote form to build urgency and social proof at the conversion point.
 *
 * With no verified review text on file we still owe the visitor proof at this
 * moment — so the slot falls back to claims we can stand behind (rating,
 * bookings, customer-rated cleaners) plus a link to verify on Google. Blank
 * space at the conversion point is the one option that helps nobody.
 */
const RecentActivityStrip = ({ city, reviews }: RecentActivityStripProps) => {
  const [paused, setPaused] = useState(false);
  if (reviews.length === 0) {
    const listing = getListing(city);
    const isCalgary = city.toLowerCase().startsWith("calgary");
    const proof = isCalgary ? CITY_PROOF.calgary : CITY_PROOF.edmonton;
    const ratingLabel =
      proof.googleRating && proof.googleReviewCount
        ? `${proof.googleRating} on Google · ${proof.googleReviewCount} ${city} reviews`
        : `${RATING_CLAIM} in ${city}`;
    return (
      <div className="border-y border-border bg-white py-3" aria-label={`${city} trust signals`}>
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm font-medium text-foreground">
          <span className="inline-flex items-center gap-2">
            <Stars size={0.875} />
            {ratingLabel}
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck className="h-4 w-4 text-success" aria-hidden="true" />
            {BOOKINGS_CLAIM}
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
            <span className="dc-icon dc-icon-external-link h-3.5 w-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    );
  }
  const items = [...reviews, ...reviews]; // duplicated for a seamless loop

  return (
    /*
      WCAG 2.2.2 is Level A: anything that moves by itself for more than five
      seconds beside other content needs a control to stop it. Pausing on hover
      was the only mechanism here, which is no mechanism at all for a keyboard
      or touch user — and this strip sits directly above the quote form, so the
      moving text is in view exactly while someone is trying to read and fill it.
    */
    <div
      className={`marquee-hover-pause relative overflow-hidden border-y border-border bg-white py-3${
        paused ? " marquee-paused" : ""
      }`}
      aria-label={`Google reviews from ${city} customers`}
    >
      <button
        type="button"
        onClick={() => setPaused((was) => !was)}
        aria-pressed={paused}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-white/90 p-1.5 text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        {paused ? <Play className="h-3.5 w-3.5" aria-hidden="true" /> : <Pause className="h-3.5 w-3.5" aria-hidden="true" />}
        <span className="sr-only">{paused ? "Resume the recent reviews strip" : "Pause the recent reviews strip"}</span>
      </button>
      <div className="animate-marquee flex w-max items-center gap-3">
        {items.map((review, index) => (
          <span
            key={`${review.name}-${index}`}
            className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-secondary/40 px-4 py-2 text-xs font-medium text-foreground"
          >
            <Stars size={0.75} />
            <span className="dc-icon dc-icon-map-pin h-3.5 w-3.5 text-accent" aria-hidden="true" />
            {review.location}
            <span className="text-muted-foreground">· {review.date}</span>
            <span className="dc-icon dc-icon-badge-check h-3.5 w-3.5 text-success" aria-hidden="true" />
            {/* Google publishes reviews; it does not verify them, and the
                review cards further down the page already say "Posted on
                Google". Two labels for one fact, one of them untrue. */}
            <span className="text-muted-foreground">Posted on Google</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default RecentActivityStrip;
