import { useLocation } from "react-router-dom";
import { quoteHrefFor } from "@/lib/quote-link";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

interface PricingOptionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  priceLabel: string;
  features: string[];
  buttonText: string;
  /**
   * Where the button goes; defaults to the instant-price funnel. Pass a
   * `tel:` link for work the funnel cannot price (hourly cleaning is quoted
   * by the office), with the phone number as `buttonText`.
   */
  buttonHref?: string;
  isHighlighted?: boolean;
}

const PricingOptionCard = ({
  icon: Icon,
  title,
  description,
  price,
  priceLabel,
  features,
  buttonText,
  buttonHref,
  isHighlighted = false,
}: PricingOptionCardProps) => {
  const { pathname } = useLocation();
  const href = buttonHref ?? quoteHrefFor(pathname);
  const isCall = href.startsWith("tel:");
  return (
    <div
      className={`relative h-full flex flex-col bg-card rounded-xl p-8 ${
        isHighlighted ? "border-2 border-accent" : "border border-border/60"
      }`}
    >
      {isHighlighted && (
        <div className="absolute -top-3 left-8 bg-brand-navy text-white text-xs font-semibold px-4 py-1 rounded-full">
          Most popular
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-6 h-6 text-accent shrink-0" aria-hidden="true" />
        <h3 className="text-xl font-bold text-foreground">{title}</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">{description}</p>
      <div className="text-4xl font-bold text-foreground mb-1">{price}</div>
      <p className="text-sm text-muted-foreground mb-6">{priceLabel}</p>
      <ul className="space-y-3 mb-8">
        {features.map((item) => (
          <li key={item} className="flex items-start gap-2.5">
            <span className="dc-icon dc-icon-circle-check w-5 h-5 text-accent mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span className="text-sm text-foreground/90">{item}</span>
          </li>
        ))}
      </ul>
      {isCall ? (
        <Button
          variant="outline"
          className="mt-auto w-full min-h-12 whitespace-nowrap text-foreground font-semibold"
          asChild
        >
          {/* Hourly work is quoted by the office: the funnel has no hourly service to price. */}
          <a href={href} aria-label={`Call ${buttonText}`}>
            <span className="dc-icon dc-icon-phone w-5 h-5 mr-2" aria-hidden="true" />
            {buttonText}
          </a>
        </Button>
      ) : (
        <Button
          className="mt-auto w-full min-h-12 whitespace-nowrap bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
          asChild
        >
          {/* "Instant price" must open the instant-quote funnel, not the 24h contact inbox. */}
          <a href={href}>{buttonText}</a>
        </Button>
      )}
    </div>
  );
};

export default PricingOptionCard;
