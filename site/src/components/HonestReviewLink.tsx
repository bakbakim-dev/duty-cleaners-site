
import Stars from "@/components/Stars";
import { getListing, openGoogleListing } from "@/lib/google-listings";

interface HonestReviewLinkProps {
  city: "Edmonton" | "Calgary";
  /** Neighbourhood or community name, for the sentence — e.g. "Abbottsfield". */
  area?: string;
}

/**
 * Replaces a fabricated testimonial block.
 *
 * 52 location pages carried a "What Our Clients Say" section with an invented
 * name and an invented quote attributed to that specific neighbourhood — e.g.
 * "— Marie" on the Abbottsfield page, "Owen Bolton, Bannerman Resident" on the
 * Bannerman page. None of it is real: EDMONTON_REVIEWS and CALGARY_REVIEWS in
 * src/data/reviews.ts were empty arrays at the time, so there was no source for
 * these quotes — they were written, not collected. (Those arrays are populated
 * now, with real Google reviews, but none is neighbourhood-specific, so this
 * component's reasoning still holds for location pages.) A fabricated review
 * attached to a real, named business is a genuine problem, not a style choice,
 * so every instance is replaced with this: a link to the real review count.
 */
export default function HonestReviewLink({ city, area }: HonestReviewLinkProps) {
  const listing = getListing(city);
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-xl border border-border bg-card p-8 text-center">
          <Stars size={1.25} className="block mx-auto" />
          <p className="mt-3 text-foreground">
            See what real {city} customers say{area ? ` before booking in ${area}` : ""} — read the
            reviews on our Google Business Profile.
          </p>
          <a
            href={listing.reviewsUrl}
            onClick={(e) => openGoogleListing(e, listing.reviewsUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center font-semibold text-primary underline underline-offset-4"
          >
            Read {city} reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
