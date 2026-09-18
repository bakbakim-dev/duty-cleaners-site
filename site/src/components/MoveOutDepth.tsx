import { Link } from "react-router-dom";
import Stars from "@/components/Stars";
import { ClipboardCheck, Sparkles, KeyRound } from "lucide-react";
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
 * src/data/reviews.ts WERE both empty when this was written — that is no
 * longer true (reviews.ts was rewritten; see its "WHY ONE LIST" header), and
 * EDMONTON_REVIEWS now carries real, named, dated move-out quotes. The link to
 * the Google review count stays because it is honest and cheap, but the reason
 * recorded here for having no quote is stale: surfacing a real one is now
 * possible and would be stronger. Inventing one still is not.
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
    // Both move-out pages already state the flat rate in their own terms grid.
    // This step used to say it a third time; it now says what the form does.
    body: "Give the bedrooms, the bathrooms, the home type and the date. The quote is priced from those answers, and every add-on you choose shows on it as its own line before you book.",
  },
  {
    icon: Sparkles,
    title: "We work down the move-out checklist",
    // Was a second copy of the includes list. The pages that render this
    // component both print that list in full above it. "The inspection
    // standard" and "the order an inspection reads it" rested on no fact; this
    // is the supplies line (T5) and the clutter line (T6).
    body: "The team brings its own products and equipment and works through the move-out checklist. Clear counters and floors get cleaned, and anything still sitting on them gets worked around, so book the clean for after the last boxes are out.",
  },
  {
    icon: KeyRound,
    title: "Lock up, or hand back the keys",
    body: "You do not need to be there. Most customers leave a key, a lockbox code or smart-lock access, and the team locks up when the checklist is done.",
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
            <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Move in / move out cleaning prices in {city}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Each price is a flat rate for an apartment or condo of that size, before 5% GST. The price
              does not change because a clean took longer than expected, and the card is charged only
              once the clean is complete.
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
            More bathrooms, add-ons, a home type other than an apartment or condo, a pet in the home
            and an address outside {city} city limits each raise the price, and the quote lists every one
            of them before you book.
          </p>
        </div>
      </section>
      )}

      {/* 3-step process: a real ordered list with plain numerals and no card
          boxes, so the terms grid on each page is the only card grid. Radius
          rule for the family: images and cards are rounded-xl, buttons follow
          the Button component, tables and hairline boxes stay square. */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-10">
            <span className="text-accent font-semibold text-sm uppercase tracking-wide">How it works</span>
            <h2 className="display-serif text-3xl md:text-4xl font-bold mt-2 text-foreground">
              Three steps from booking to move-in ready
            </h2>
          </div>
          <ol className="mx-auto grid max-w-5xl gap-10 md:grid-cols-3">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <li key={title}>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-navy text-brand-gold">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="mt-3 text-lg font-bold text-foreground">{i + 1}. {title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Real review proof — a link, not an invented quote. */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center border border-border p-8">
            <Stars size={1.25} className="block mx-auto" />
            <p className="mt-3 text-foreground">
              Every cleaner is rated by the customer after each visit, and those ratings decide who we
              keep sending.{" "}
              <Link to="/reviews/" className="font-semibold text-primary underline underline-offset-4">Read the reviews</Link>{" "}
              from {city} customers before booking, or go straight to the Google listing.
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
