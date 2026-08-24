import { Link } from "react-router-dom";
import { Star, ClipboardCheck, Sparkles, KeyRound } from "lucide-react";
import { moveInOutTierRows } from "@/data/pricing";
import { getListing, openGoogleListing } from "@/lib/google-listings";

/**
 * The depth sections missing from the move-in/move-out pages.
 *
 * Why this exists: the move-out query cluster earns 121,774 impressions / 853
 * clicks at an average position of 19.3, and the two highest earners —
 * /move-out-cleaning-edmonton (251k impr, position 4.5) and
 * /move-out-cleaning-calgary (116k impr) — lost 51% and 36% of their word
 * count in the rebuild versus the pages Google currently ranks. Edmonton in
 * particular is close to page one; thin content is the more plausible ceiling
 * than any technical issue.
 *
 * What was actually missing, not just short: a real price (the old pages and
 * competitors show one; this one didn't), a plain-language explanation of the
 * process, and FAQPage schema (present on neither page — Edmonton had 8 good
 * FAQs and zero markup; Calgary had 9 and zero markup, and zero schema of any
 * kind).
 *
 * No testimonials are added here. EDMONTON_REVIEWS / CALGARY_REVIEWS in
 * src/data/reviews.ts are both empty — there are no real quotes on file to
 * use, and inventing customer testimonials is not something to do. The honest
 * substitute is a direct link to the real Google review count.
 */

interface MoveOutDepthProps {
  city: "Edmonton" | "Calgary";
  /** Skip when the page already renders its own accurate pricing section. */
  showPricing?: boolean;
}

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Tell us the home size and your date",
    body: "Bedrooms, bathrooms, and whether it's a move-out, move-in, or both. Your price is calculated from that — the same flat rate whether the clean takes three hours or six.",
  },
  {
    icon: Sparkles,
    title: "We clean to the inspection standard",
    body: "Every cabinet, drawer, appliance interior, baseboard, and light switch — the level of detail a landlord or buyer's walkthrough actually checks, not just the surfaces that are easy to reach.",
  },
  {
    icon: KeyRound,
    title: "Lock up, or hand back the keys",
    body: "Most clients aren't home for a move-out clean — leave a key in a lockbox or with the property manager. We confirm by phone once the job is done.",
  },
];

export default function MoveOutDepth({ city, showPricing = true }: MoveOutDepthProps) {
  const rows = moveInOutTierRows();
  const listing = getListing(city);

  return (
    <>
      {/* Real pricing — the old pages showed a number; this one didn't. */}
      {showPricing && (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">Pricing</p>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 mb-4 text-foreground">
              Move in / move out cleaning prices in {city}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Flat rate by home size, GST included. The price you see is the price you pay — it
              doesn't change if the job runs long, and nothing is charged until the clean is done.
            </p>
          </div>

          <div className="mx-auto mt-10 max-w-2xl overflow-hidden border border-border">
            <table className="w-full">
              <thead className="bg-brand-navy text-brand-navy-foreground">
                <tr>
                  <th className="py-3 px-5 text-left text-sm font-bold">Home size</th>
                  <th className="py-3 px-5 text-right text-sm font-bold">Starting price</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.beds} className={i % 2 ? "bg-secondary/20" : "bg-card"}>
                    <td className="py-3 px-5 text-foreground">{r.beds}</td>
                    <td className="py-3 px-5 text-right font-bold text-foreground">from {r.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mx-auto mt-4 max-w-2xl text-center text-sm text-muted-foreground">
            Condition, add-ons, and exact bathroom count can change the final number — your quote
            spells all of it out before you book.
          </p>
        </div>
      </section>
      )}

      {/* 3-step process */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">How it works</p>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 text-foreground">
              Three steps from booking to move-in ready
            </h2>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <div key={title} className="bg-card border border-border p-6">
                <span className="text-sm font-bold tracking-[0.16em] text-accent">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="mt-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-bold text-foreground">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real review proof — a link, not an invented quote. */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center border border-border p-8">
            <span className="flex justify-center gap-0.5" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-brand-gold text-brand-gold" />
              ))}
            </span>
            <p className="mt-3 text-foreground">
              Move-out cleaning affects a deposit you don't get a second chance at — read what actual
              {` ${city}`} customers said before booking.
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
    </>
  );
}
