import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";

interface PricingTierCardProps {
  beds: string;
  price: string;
  buttonVariant?: "edmonton" | "calgary" | "accent";
  /** Where the row CTA goes; defaults to the contact page. */
  ctaHref?: string;
  /** Small line under the price, e.g. the Standard + package breakdown. */
  note?: string;
}

const PricingTierCard = ({ beds, price, ctaHref = canonicalForPath("/contact"), note }: PricingTierCardProps) => {
  return (
    <div className="group" style={{ perspective: "1000px" }}>
      <div
        className="bg-card rounded-xl border border-border/50 shadow-sm p-6 text-center transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-xl group-hover:scale-[1.02]"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-3 transition-transform duration-500 group-hover:rotate-6">
          <Home className="w-5 h-5 text-accent" />
        </div>
        <h3 className="font-semibold text-foreground mb-1">{beds}</h3>
        <div className="text-3xl font-bold text-accent">{price}</div>
        {note ? <p className="mb-4 mt-1 text-xs text-muted-foreground">{note}</p> : <div className="mb-4" />}
        <Button
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold shadow-md hover:shadow-lg transition-all"
          asChild
        >
          <Link to={ctaHref}>See My Instant Price</Link>
        </Button>
      </div>
    </div>
  );
};

export default PricingTierCard;
