import { Fragment } from "react";

interface FormulaStep {
  title: string;
  desc: string;
  /** How the step joins the ones before it: a charge adds, the discount subtracts. */
  operator?: "+" | "−";
}

/* The 10% tier is "Every 4 Weeks" in BookingKoala, thirteen visits a year.
   This card used to call it "monthly", which is twelve. */
const steps: FormulaStep[] = [
  { title: "Service", desc: "Standard, deep, or move-in/out. Deep is the standard rate plus a package sized to the home." },
  { title: "Home size", operator: "+", desc: "Bedrooms pick the tier, then each bathroom is priced on top." },
  { title: "Home type", operator: "+", desc: "An apartment or condo is the base. A bungalow or basement suite, a townhouse or a two-storey house adds a set amount." },
  { title: "Add-ons", operator: "+", desc: "Inside the oven, the fridge, the cabinets, interior windows and the rest, each a fixed line per visit." },
  /* Frequency is a discount, so it joins with a minus sign. The row used to
     read "... + Add-ons + Frequency = Your price". */
  { title: "Frequency", operator: "−", desc: "20% off weekly, 15% off bi-weekly, 10% off every 4 weeks, from the second visit." },
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
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mb-10">
          <h2 className="display-serif text-3xl md:text-4xl font-bold mb-4 text-balance">How {article} {city} cleaning price is put together</h2>
          <p className="text-lg text-muted-foreground">
            Five things set {article} {city} price, and pets or an address outside city limits add their own charge. The form asks for each one and shows the total before you book.
          </p>
        </div>

        {/* The plus, minus and equals signs carry the sequence, so the tiles
            have no 01-06 numerals. Nothing here is clickable, so nothing lifts
            on hover. */}
        <div className="flex flex-col lg:flex-row items-stretch gap-3">
          {steps.map((step) => (
            <Fragment key={step.title}>
              {step.operator && (
                <div className="flex items-center justify-center py-1 lg:py-0" aria-hidden="true">
                  <span className="text-2xl font-bold text-accent">{step.operator}</span>
                </div>
              )}
              <div className="flex-1 bg-card rounded-xl border border-border/50 p-5">
                <h3 className="font-bold text-foreground mb-1">{step.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            </Fragment>
          ))}

          {/* Final tile */}
          <div className="flex items-center justify-center py-1 lg:py-0" aria-hidden="true">
            <span className="text-2xl font-bold text-accent">=</span>
          </div>
          <div className="flex-1 rounded-xl border-2 border-accent bg-accent/5 p-5">
            <h3 className="font-bold text-foreground mb-1">Your price</h3>
            <p className="text-xs text-foreground/90 leading-relaxed">
              One figure, before 5% GST, shown before you confirm and charged after the clean.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
