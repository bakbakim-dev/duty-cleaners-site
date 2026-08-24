import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";


interface PricingOptionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  priceLabel: string;
  features: string[];
  buttonText: string;
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
  isHighlighted = false,
}: PricingOptionCardProps) => {
  return (
    <div className="group h-full" style={{ perspective: "1000px" }}>
      <div
        className={`relative h-full flex flex-col bg-brand-navy rounded-2xl shadow-lg p-8 transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:scale-[1.02] ${
          isHighlighted
            ? "border-2 border-brand-gold ring-2 ring-brand-gold/20"
            : "border border-white/10"
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {isHighlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-gold text-brand-gold-foreground text-xs font-bold px-4 py-1 rounded-full shadow-md">
            Most Popular
          </div>
        )}
        <div className="w-12 h-12 bg-brand-gold/15 rounded-xl flex items-center justify-center mb-5 transition-transform duration-500 group-hover:rotate-6">
          <Icon className="w-6 h-6 text-brand-gold" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-white/90 leading-relaxed mb-5">{description}</p>
        <div className="text-4xl font-bold text-brand-gold mb-1">{price}</div>
        <p className="text-sm text-white/90 mb-6">{priceLabel}</p>
        <ul className="space-y-3 mb-8">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-brand-gold mt-0.5 flex-shrink-0" />
              <span className="text-sm text-white/90">{item}</span>
            </li>
          ))}
        </ul>
        <Button
          className="mt-auto w-full bg-brand-gold hover:bg-brand-gold/90 text-brand-gold-foreground font-semibold shadow-md hover:shadow-lg transition-all min-h-12"
          asChild
        >
          {/* "Instant price" must open the instant-quote funnel, not the 24h contact inbox. */}
          <a href="#quote">{buttonText}</a>
        </Button>
      </div>
    </div>
  );
};

export default PricingOptionCard;
