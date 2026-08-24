import { FREQUENCIES, type FrequencyId } from "@/data/pricing";

/**
 * Frequency selector that prints the discount on the chip itself, so the
 * recurring saving is visible before the visitor commits to anything.
 */
export default function FrequencyChips({
  value,
  onChange,
  disabled = false,
}: {
  value: FrequencyId;
  onChange: (id: FrequencyId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2.5 pt-3" role="group" aria-label="How often">
      {FREQUENCIES.map((frequency) => {
        const selected = frequency.id === value;
        return (
          <button
            key={frequency.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onChange(frequency.id)}
            className={`relative min-h-[48px] rounded-sm border px-4 py-2 text-left text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              frequency.mostPopular ? "pt-6" : ""
            } ${
              selected
                ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                : "border-border bg-card text-foreground hover:border-brand-navy/40"
            }`}
          >
            <span className="block">{frequency.label}</span>
            <span
              className={`block text-base font-medium ${
                selected ? "text-brand-gold" : "text-muted-foreground"
              }`}
            >
              {frequency.discount > 0 ? `Save ${Math.round(frequency.discount * 100)}%` : "No discount"}
            </span>
            {frequency.mostPopular && (
              <span className="absolute -top-2 right-2 bg-brand-gold px-1.5 py-0.5 text-sm font-bold uppercase tracking-wide text-brand-gold-foreground">
                Popular
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
