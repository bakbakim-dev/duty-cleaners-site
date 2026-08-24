import { Fragment } from "react";
import { Sparkles, Home, PlusCircle, Percent, MessageCircle, Tag, type LucideIcon } from "lucide-react";

interface FormulaStep {
  icon: LucideIcon;
  title: string;
  desc: string;
}

const steps: FormulaStep[] = [
  { icon: Sparkles, title: "Service Base Rate", desc: "Standard, deep, or move-in/out cleaning" },
  { icon: Home, title: "Home Size", desc: "Priced simply by number of bedrooms" },
  { icon: PlusCircle, title: "Optional Add-ons", desc: "Inside oven, fridge, windows & more — listed by service" },
  { icon: Percent, title: "Recurring Discount", desc: "Save 10–20% on weekly, bi-weekly, or monthly cleans" },
  { icon: MessageCircle, title: "Service Scope", desc: "Rooms, tasks, and add-ons selected for your visit" }
];

interface PricingFormulaProps {
  city: string;
}

export default function PricingFormula({ city }: PricingFormulaProps) {
  return (
    <section className="py-16 md:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Transparent Pricing</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">How Pricing Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Every {city} estimate is shaped by clear service factors, so you know what goes into your cleaning plan.
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
            <h3 className="font-bold text-white mb-1">Your Cleaning Plan</h3>
            <p className="text-xs text-white/90 leading-relaxed">
              A clear outline built around your home’s size and cleaning priorities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
