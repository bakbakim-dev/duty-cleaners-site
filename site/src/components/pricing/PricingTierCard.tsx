import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

interface PricingTierCardProps {
  beds: string;
  price: string;
  /** Bathroom count used to calculate this displayed tier. */
  assumption: string;
  /** Small line under the price, e.g. the Standard + package breakdown. */
  note?: string;
}

/**
 * One tier: bedrooms, the flat rate and, on the deep tab, the package
 * breakdown. The card is not a link, so it carries no button and no hover
 * motion; each tab has one PricingTierCta under its grid instead. Five
 * buttons a tab wrapped "See My Instant Price" onto two lines at 142px and
 * competed with the figure they sat under.
 */
const PricingTierCard = ({ beds, price, assumption, note }: PricingTierCardProps) => (
  <div className="bg-card rounded-xl border border-border/50 px-4 py-6 text-center">
    <h3 className="font-semibold text-foreground mb-1">{beds}</h3>
    <div className="text-3xl font-bold text-accent">{price}</div>
    <p className="mt-2 text-xs font-medium text-foreground/80">{assumption}</p>
    {note ? <p className="mt-2 text-xs text-muted-foreground">{note}</p> : null}
  </div>
);

/**
 * The one funnel button under a tab's grid. The href is passed in because the
 * deep tab keeps its `#quote&intent=deep` target (quote-intent.test.ts).
 */
export const PricingTierCta = ({ href }: { href: string }) => (
  <div className="mt-8 text-center">
    <Button
      size="lg"
      className="h-auto whitespace-nowrap bg-accent px-8 py-4 text-base font-semibold text-accent-foreground hover:bg-accent/90"
      asChild
    >
      <a href={href}>
        <Calculator className="w-5 h-5 mr-2" />
        See My Instant Price
      </a>
    </Button>
  </div>
);

export default PricingTierCard;
