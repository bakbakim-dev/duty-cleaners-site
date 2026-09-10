import { Fragment } from "react";
import { Sparkles, Home, Building2, PlusCircle, Percent, Tag, type LucideIcon } from "lucide-react";

interface FormulaStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

/* The 10% tier is "Every 4 Weeks" in BookingKoala, thirteen visits a year.
   This card used to call it "monthly", which is twelve. */
const steps: FormulaStep[] = [
  { icon: Sparkles, title: "Service", desc: "Standard, deep, or move-in/out. Deep is the standard rate plus a package sized to the home." },
  { icon: Home, title: "Home size", desc: "Bedrooms pick the tier, then each bathroom is priced on top." },
  { icon: Building2, title: "Home type", desc: "An apartment or condo is the base. A bungalow or basement suite, a townhouse or a two-storey house adds a set amount." },
  { icon: PlusCircle, title: "Add-ons", desc: "Inside the oven, the fridge, the cabinets, interior windows and the rest, each a fixed line per visit." },
  { icon: Percent, title: "Frequency", desc: "20% off weekly, 15% off bi-weekly, 10% off every 4 weeks, from the second visit." },
];

interface PricingFormulaProps {
  city: string;
}

/**
 * "an Edmonton price", "a Calgary price".
 *
 * The template hard-coded "a", so both pricing pages shipped headings reading
 * "How a Edmonton cleaning price is put together" — the article is chosen by
 * the city name, and one of the two cities starts with a vowel.
 */
const articleFor = (place: string) => (/^[aeiou]/i.test(place.trim()) ? "an" : "a");

export default function PricingFormula({ city }: PricingFormulaProps) {
  const article = articleFor(city);

  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">How the price is built</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">How {article} {city} cleaning price is put together</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Five things set {article} {city} price, and pets or an address outside city limits add their own charge. The form asks for each one and shows the total before you book.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-stretch justify-center gap-3 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <Fragment key={step.title}>
              <div className="flex-1 bg-card rounded-xl border border-border/50 shadow-sm p-5 text-center relative hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                <span className="absolute top-3 left-3 text-xs font-bold text-muted-foreground">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3 mt-2">
                  <step.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="flex items-center justify-center py-1 lg:py-0" aria-hidden="true">
                  <span className="text-2xl font-bold text-accent">+</span>
                </div>
              )}
            </Fragment>
          ))}

          {/* Final tile */}
          <div className="flex items-center justify-center py-1 lg:py-0" aria-hidden="true">
            <span className="text-2xl font-bold text-accent">=</span>
          </div>
          <div className="flex-1 bg-brand-navy rounded-xl shadow-lg p-5 text-center border border-accent/40 flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-brand-gold mb-2">06</span>
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-3">
              <Tag className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="font-bold text-white mb-1">Your price</h3>
            <p className="text-xs text-white/90 leading-relaxed">
              One figure, before 5% GST, shown before you confirm and charged after the clean.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
