import { Link } from "react-router-dom";
import Stars from "@/components/Stars";
import { ExternalLink } from "lucide-react";
import { Accent } from "@/components/Accent";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { getListing, openGoogleListing, reviewSourceUrl } from "@/lib/google-listings";

export interface RecentCleanReview {
  name: string;
  initial: string;
  location: string;
  date: string;
  text: string;
  /** Stars as left on Google (data/reviews.ts). No stars are drawn without it. */
  rating?: number;
  /** Optional per-review Google share link. Overrides the listing permalink. */
  sourceUrl?: string;
}

interface CityRecentCleansProps {
  city: string;
  reviews: RecentCleanReview[];
  reviewsTo?: string;
}

const avatarColors = ["bg-primary", "bg-accent", "bg-brand-navy", "bg-brand-gold"];

const GoogleMark = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26.67-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.1c0-.7.12-1.37.34-2L2.18 9.04A9.995 9.995 0 0 0 2 12c0 1.61.39 3.14 1.07 4.51l2.77-2.41z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

/**
 * The review's own star rating, read from the data. The stars carry
 * information, so the group is one image with the rating as its name; the
 * individual icons stay hidden. It used to be a plain <div aria-label="Google
 * review"> with five hard-coded stars: a label on a role-less div is ignored by
 * most screen readers, and "Google review" never said how many stars.
 */
function ReviewStars({ rating, size }: { rating?: number; size: number }) {
  if (typeof rating !== "number") return null;
  const stars = Math.max(0, Math.min(5, Math.round(rating)));
  return <Stars rating={stars} size={size} label={`${stars} out of 5 stars`} />;
}

/**
 * The link under each review. Without a per-review share URL the href is the
 * branch's reviews page, so the link says exactly that; it used to be labelled
 * "Read <name>'s review on our Google Business Profile" while opening the
 * general profile. The visible text is the whole accessible name either way,
 * so what a screen reader announces matches what a sighted reader sees.
 */
function ReviewSourceLink({ review, city, iconSize }: { review: RecentCleanReview; city: string; iconSize: string }) {
  const perReview = Boolean(review.sourceUrl?.trim());
  const href = reviewSourceUrl(city, review.sourceUrl);
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      onClick={(event) => openGoogleListing(event, href)}
      className="inline-flex items-center gap-1 font-semibold text-primary underline-offset-2 hover:text-accent hover:underline"
    >
      {perReview ? "Read this review on Google" : `View ${city} Google reviews`}
      <ExternalLink className={iconSize} aria-hidden="true" />
    </a>
  );
}

function CleanCard({ review, index, city }: { review: RecentCleanReview; index: number; city: string }) {
  const { ref, isVisible } = useScrollAnimation(0.15);
  return (

    <article
      ref={ref}
      className={`group bg-white rounded-lg border border-border p-6 shadow-sm transition-all duration-500 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${index * 90}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-11 h-11 ${avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center text-white font-bold text-lg`}
            aria-hidden="true"
          >
            {review.initial}
          </span>
          <div>
            <p className="font-bold leading-tight">{review.name}</p>
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-0.5">
              <span className="dc-icon dc-icon-map-pin w-3 h-3 text-accent" aria-hidden="true" />
              {review.location} · {review.date}
            </p>
          </div>
        </div>
        <GoogleMark className="w-5 h-5 shrink-0" />
      </div>

      <div className="mb-3">
        <ReviewStars rating={review.rating} size={1} />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
        &ldquo;{review.text}&rdquo;
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 text-muted-foreground">
          <span className="dc-icon dc-icon-circle-check w-3.5 h-3.5 text-green-500" aria-hidden="true" />
          Posted on Google
        </span>
        <ReviewSourceLink review={review} city={city} iconSize="w-3 h-3" />
      </div>

    </article>
  );
}

/** Offset pull-quote treatment for the lead review. */
function PullQuote({ review, city }: { review: RecentCleanReview; city: string }) {
  const { ref, isVisible } = useScrollAnimation(0.15);
  return (
    <figure
      ref={ref}
      className={`paper-rule relative rounded-lg border bg-white p-8 transition-all duration-500 md:p-10 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="flex items-center justify-between">
        <ReviewStars rating={review.rating} size={1.25} />
        <GoogleMark className="h-6 w-6 shrink-0" />
      </div>
      <blockquote className="display-serif mt-5 text-2xl font-semibold leading-snug md:text-[1.75rem]">
        &ldquo;{review.text}&rdquo;
      </blockquote>
      <figcaption className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
        <span className="font-bold text-foreground">{review.name}</span>
        <span className="inline-flex items-center gap-1">
          <span className="dc-icon dc-icon-map-pin h-3.5 w-3.5 text-accent" aria-hidden="true" />
          {review.location} · {review.date}
        </span>
        <ReviewSourceLink review={review} city={city} iconSize="h-3.5 w-3.5" />
      </figcaption>
    </figure>
  );
}

/**
 * Recent Google reviews: a transparency feed built only
 * from real Google review snippets (no invented job data, prices, or counts).
 */
export default function CityRecentCleans({ city, reviews, reviewsTo = "/reviews/" }: CityRecentCleansProps) {
  const shown = reviews.slice(0, 3);
  // No verified review text on file yet: rather than leave one of the two
  // highest-trust slots on the page empty, show an honest invitation to read
  // the profile itself.
  if (shown.length === 0) {
    const listing = getListing(city);
    return (
      <section className="band band-tight band-paper band-hairline">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-lg border border-border bg-white p-8 text-center shadow-sm">
            <Stars size={1.25} className="block mx-auto mb-3" />
            <h2 className="text-2xl font-bold md:text-3xl">
              Rated 4.9 on Google by <Accent>{city}</Accent> customers
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Every review is on our Google Business Profile. Read what {city} customers say before
              you book.
            </p>
            <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
              <a
                href={listing.reviewsUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                onClick={(event) => openGoogleListing(event, listing.reviewsUrl)}
                className="inline-flex min-h-[48px] items-center gap-2 font-semibold text-primary transition-colors hover:text-accent"
              >
                Read our {city} reviews on Google
                <span className="dc-icon dc-icon-external-link h-4 w-4" aria-hidden="true" />
              </a>
              <Link
                to={reviewsTo}
                className="inline-flex min-h-[48px] items-center gap-2 font-semibold text-muted-foreground transition-colors hover:text-accent"
              >
                Read Duty Cleaners reviews
                <span className="dc-icon dc-icon-arrow-right h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="band band-paper band-hairline">
      <div className="container mx-auto px-4">
        <div className="mb-10 max-w-2xl">
          <h2 className="display-serif text-3xl md:text-4xl font-bold">
            Google reviews from <Accent>{city}</Accent>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-[55ch] leading-relaxed">
            Each review is copied word for word from Google; a long one is cut only at the end of a sentence, marked […].
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-start">
          <PullQuote review={shown[0]} city={city} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 lg:mt-10">
            {shown.slice(1).map((review, i) => (
              <CleanCard key={review.name + review.date} review={review} index={i + 1} city={city} />
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-8">
          <Link
            to={reviewsTo}
            className="inline-flex items-center gap-2 font-semibold text-primary hover:text-accent transition-colors"
          >
            Read more customer reviews
            <span className="dc-icon dc-icon-arrow-right w-4 h-4" aria-hidden="true" />
          </Link>
          <a
            href={getListing(city).reviewsUrl}
            target="_blank"
            rel="nofollow noopener noreferrer"
            onClick={(event) => openGoogleListing(event, getListing(city).reviewsUrl)}
            className="inline-flex items-center gap-2 font-semibold text-muted-foreground hover:text-accent transition-colors"
          >
            Verify every review on our {city} Google profile
            <span className="dc-icon dc-icon-external-link w-4 h-4" aria-hidden="true" />
          </a>
        </div>

      </div>
    </section>
  );
}
