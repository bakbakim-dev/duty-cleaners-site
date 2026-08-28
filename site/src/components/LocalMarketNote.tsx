/**
 * A block of genuinely city-specific prose for the service pages.
 *
 * WHY THIS EXISTS
 * Six Calgary money pages were near-verbatim copies of their Edmonton twins.
 * Measured as novel 8-grams after normalising the city name away — so a
 * find-and-replace of "Edmonton" to "Calgary" counts as nothing — they scored:
 *
 *     /calgary/pricing/                        3.5%
 *     /calgary/services/                       5.6%
 *     /airbnb-cleaning-services-calgary/       6.6%
 *     /commercial-cleaning-services-calgary/   7.9%
 *     /post-construction-cleaning-calgary/    10.7%
 *     /wall-washing-wall-cleaning-calgary/    11.4%
 *
 * On the Airbnb pair, 5 of 44 sentences differed and all five were the phone
 * number, the address line and the surrounding-towns list. Both URLs are
 * preserved legacy paths with real ranking history, so deleting one is not an
 * option — the fix is to make each page say something the other cannot.
 *
 * The bar for content here: it must be true, checkable, and inapplicable to
 * the other city. Weather, local geography, the building stock, the events
 * calendar and the licensing regime all qualify. "Calgary homeowners trust
 * us" does not — that is the same sentence with a different noun, which is
 * the problem rather than the fix. The already-differentiated pages
 * (deep cleaning at 33%, move-out at 58%) are the model.
 */
import type { ReactNode } from "react";

export interface LocalMarketNoteProps {
  /** Small label above the heading. */
  eyebrow: string;
  heading: ReactNode;
  /** Two or three paragraphs. Each must carry a fact specific to this city. */
  paragraphs: string[];
  /** Tailwind accent token — "calgary" or "primary". */
  accent?: "calgary" | "primary";
}

export default function LocalMarketNote({
  eyebrow,
  heading,
  paragraphs,
  accent = "primary",
}: LocalMarketNoteProps) {
  const dot = accent === "calgary" ? "bg-calgary" : "bg-primary";
  const label = accent === "calgary" ? "text-calgary" : "text-primary";
  return (
    <section className="py-16 md:py-20 bg-background border-b border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className={`w-2 h-2 rounded-full ${dot}`} aria-hidden="true" />
            <span className={`text-sm font-medium uppercase tracking-wide ${label}`}>{eyebrow}</span>
          </div>
          <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mb-6 text-balance">
            {heading}
          </h2>
          <div className="space-y-5">
            {paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="text-muted-foreground leading-relaxed">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
