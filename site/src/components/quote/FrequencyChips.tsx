import { FREQUENCIES, formatPrice, type FrequencyId } from "@/data/pricing";

export interface PlanPricing {
  /** What each visit costs on this plan (after the first, for a recurring plan). */
  perVisit: number;
  /** Dollars saved per visit against the one-time price; 0 for One-Time. */
  savePerVisit: number;
}

/**
 * The plan cards. Each prints its real per-visit price and, for a recurring
 * plan, the saving in dollars: for a purchase this size a dollar saving reads
 * as larger than the same saving in percent (Chen, Monroe & Lou 1998). The
 * percent stays as the smaller line. No card is preselected and none carries
 * a "most popular" badge: nothing on the site supports that claim (owner,
 * 2026-09-18). Choosing one pops a check in (reduced motion: it just appears).
 */
export default function FrequencyChips({
  value,
  onChange,
  disabled = false,
  pricing,
}: {
  /** Null until the visitor picks a plan: nothing is preselected. */
  value: FrequencyId | null;
  onChange: (id: FrequencyId) => void;
  disabled?: boolean;
  /** Per-plan figures from the funnel's own quote; omitted, the cards show percent only. */
  pricing?: Partial<Record<FrequencyId, PlanPricing>>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4" role="group" aria-label="How often">
      {FREQUENCIES.map((frequency) => {
        const selected = frequency.id === value;
        const figures = pricing?.[frequency.id];
        const percent = Math.round(frequency.discount * 100);
        return (
          <button
            key={frequency.id}
            type="button"
            disabled={disabled}
            aria-pressed={selected}
            onClick={() => onChange(frequency.id)}
            className={`relative min-h-[88px] rounded-lg border-[1.5px] px-3.5 py-3 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              selected
                ? "border-brand-navy bg-brand-navy text-brand-navy-foreground shadow-[0_10px_24px_-16px_hsl(var(--brand-navy)/0.8)]"
                : "border-input bg-card text-foreground hover:border-brand-navy"
            }`}
          >
            {selected && (
              <span
                aria-hidden="true"
                className="funnel-pop absolute right-2.5 top-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-brand-navy-foreground text-brand-navy"
              >
                <span className="dc-icon dc-icon-check h-4 w-4" />
              </span>
            )}
            <span className={`block pr-7 text-base ${selected ? "font-bold" : "font-semibold"}`}>
              {frequency.label}
              {frequency.discount > 0 && (
                <span className={`ml-1.5 text-xs font-semibold ${selected ? "text-brand-navy-foreground/80" : "text-muted-foreground"}`}>
                  {percent}% off
                </span>
              )}
            </span>
            {figures && (
              <span className="mt-0.5 block text-lg font-extrabold leading-tight tabular-nums">
                {formatPrice(figures.perVisit)}
                <span className={`ml-1 text-sm font-medium ${selected ? "text-brand-navy-foreground/80" : "text-muted-foreground"}`}>
                  /visit
                </span>
              </span>
            )}
            {frequency.discount > 0 ? (
              <span className="mt-1.5 inline-flex items-center rounded-full border border-savings-border bg-savings px-2 py-0.5 text-xs font-bold text-savings-foreground">
                {figures && figures.savePerVisit > 0 ? `Save ${formatPrice(figures.savePerVisit)}` : `Save ${percent}%`}
              </span>
            ) : (
              <span className={`mt-1.5 block text-xs font-semibold ${selected ? "text-brand-navy-foreground/80" : "text-muted-foreground"}`}>
                Full price, no plan
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
