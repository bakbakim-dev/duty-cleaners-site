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
  /** Null until the visitor picks a plan: nothing is preselected. */
  value: FrequencyId | null;
  onChange: (id: FrequencyId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="group" aria-label="How often">
      {FREQUENCIES.map((frequency) => {
        const selected = frequency.id === value;
        return (
          <button
            key={frequency.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onChange(frequency.id)}
            className={`min-h-[64px] rounded-md border px-4 py-2 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              selected
                ? "border-brand-navy bg-brand-navy text-brand-navy-foreground"
                : "border-input bg-card text-foreground hover:border-brand-navy"
            }`}
          >
            <span className="block text-base font-bold">{frequency.label}</span>
            <span
              className={`block text-sm font-medium ${
                selected ? "text-brand-navy-foreground/85" : "text-muted-foreground"
              }`}
            >
              {frequency.discount > 0 ? `Save ${Math.round(frequency.discount * 100)}%` : "Full price"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
