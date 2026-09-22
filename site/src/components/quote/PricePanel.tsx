import { formatPrice, withGst, type QuoteResult } from "@/data/pricing";
import { useCountUp } from "@/lib/use-count-up";

/**
 * The price, always visible. Sidebar on desktop, pinned bar on mobile.
 * Shows first-clean vs ongoing whenever a recurring frequency is selected.
 *
 * Every figure is shown before tax with the 5% GST total beside it, so the
 * site, BookingKoala's summary and the confirmation email all agree.
 */
export default function PricePanel({
  quote,
  serviceLabel,
  variant = "sidebar",
  firstCleanOverride = null,
  firstCleanNote,
  ongoingOverride = null,
  savingsOverride = null,
  ongoingNote,
  addOnCount = 0,
  plansFrom = null,
}: {
  quote: QuoteResult;
  serviceLabel: string;
  variant?: "sidebar" | "bar" | "compact";
  /** Deep-clean intent: the first clean is Standard + the package. */
  firstCleanOverride?: number | null;
  firstCleanNote?: string;
  /** Per-visit price including recurring add-ons, when any are selected. */
  ongoingOverride?: number | null;
  /** Savings on the discountable portion only. */
  savingsOverride?: number | null;
  ongoingNote?: string;
  /** Number of add-ons currently selected — drives the itemized one-liner. */
  addOnCount?: number;
  /** Cheapest per-visit plan price, shown until the visitor picks a plan. */
  plansFrom?: number | null;
}) {

  const firstClean = firstCleanOverride ?? quote.firstClean;
  const ongoing = quote.ongoing === null ? null : (ongoingOverride ?? quote.ongoing);
  const savings = savingsOverride ?? quote.savings;
  // The low end of an estimate is BookingKoala's own tier price, never the
  // spread below it: "$495" for a post-construction tier published at $550
  // quoted a figure BookingKoala does not charge.
  // The visible figures roll to a new total (lib/use-count-up.ts); the live
  // region below always speaks the final figures.
  const shownFirst = Math.round(useCountUp(firstClean) * 100) / 100;
  const shownOngoing = Math.round(useCountUp(ongoing ?? 0) * 100) / 100;
  const finalLabel = quote.isEstimate
    ? `${formatPrice(quote.firstClean)}–${formatPrice(quote.rangeHigh)}`
    : formatPrice(firstClean);
  const priceLabel = quote.isEstimate ? finalLabel : formatPrice(shownFirst);

  /**
   * One composed sentence for screen readers. It lives in a polite live
   * region so changing the frequency chip announces the whole new price
   * ("First clean $169, then $143.65 per visit") instead of stray fragments.
   */
  const spokenPrice = ongoing
    ? `First clean ${finalLabel} before GST, then ${formatPrice(ongoing)} per visit.`
    : `Your price, ${finalLabel} before GST.`;

  const liveRegion = (
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {spokenPrice}
    </p>
  );

  /* One-line itemization: what the price actually covers right now. */
  const itemLine = `${serviceLabel}${
    addOnCount > 0 ? ` · ${addOnCount} add-on${addOnCount === 1 ? "" : "s"}` : ""
  }`;

  /* Reassurance pills. Green savings pill only when a recurring frequency is
     active; "not charged today" is always true — payment happens after the clean. */
  const pills = (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {ongoing !== null && savings > 0 && (
        <span className="inline-flex items-center rounded-full border border-savings-border bg-savings px-3 py-1 text-sm font-bold text-savings-foreground">
          Saving {formatPrice(savings)} per visit
        </span>
      )}
      <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm font-semibold text-fine-print">
        You won’t be charged today
      </span>
    </div>
  );

  /* A first-visit-only extra — the deep-clean package, an oven, a fridge — is
     charged once and never on a recurring visit. Without saying so, the drop
     from first clean to ongoing reads as a far bigger discount than the
     frequency actually gives: a 3-bedroom weekly plan with the deep package
     goes $331.29 to $153.04, which is not 20%. */
  const firstVisitNote = ongoing !== null && quote.firstVisitExtras ? (
    <p className="mt-2 text-sm text-fine-print">
      Your deep-clean extras are charged on the first visit only, so they are not in the
      per-visit price below.
    </p>
  ) : null;



  if (variant === "compact") {
    /* Step 3 already shows the full price card in the main column; the rail
       only needs to keep the number in view while the visitor scrolls. Deep
       ink: this is the authority moment, so it reads as one solid surface. */
    return (
      <aside className="rounded-lg bg-brand-navy p-5 text-brand-navy-foreground shadow-lg shadow-brand-navy/20">
        {liveRegion}
        <p className="text-sm font-semibold text-fine-print-on-dark">
          {serviceLabel}
        </p>
        {/* On a plan the per-visit price is what the customer pays from then on,
            so it gets the same size as the first clean, never small print. */}
        <div className={ongoing !== null || plansFrom !== null ? "mt-3 grid grid-cols-2 gap-3" : "mt-3"}>
          <div>
            <p className="text-sm font-semibold text-fine-print-on-dark">
              {ongoing || plansFrom !== null ? "First clean" : "Your price"}
            </p>
            <p className="text-3xl font-bold leading-tight">{priceLabel}</p>
          </div>
          {ongoing !== null && (
            <div className="border-l border-brand-navy-foreground/25 pl-3">
              <p className="text-sm font-semibold text-fine-print-on-dark">Every visit after</p>
              <p className="text-3xl font-bold leading-tight">{formatPrice(shownOngoing)}</p>
            </div>
          )}
          {ongoing === null && plansFrom !== null && (
            <div className="border-l border-brand-navy-foreground/25 pl-3">
              <p className="text-sm font-semibold text-fine-print-on-dark">Plans from</p>
              <p className="text-3xl font-bold leading-tight">{formatPrice(plansFrom)}</p>
            </div>
          )}
        </div>
        <p className="mt-1 text-sm text-fine-print-on-dark">Before 5% GST</p>
        {/* The service is already the card's heading; this line earns its place
            only once it has add-ons to count. */}
        {addOnCount > 0 && (
          <p className="mt-2 border-t border-brand-navy-foreground/20 pt-3 text-sm text-fine-print-on-dark">
            {itemLine}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ongoing !== null && savings > 0 && (
            <span className="inline-flex items-center rounded-full bg-brand-gold px-3 py-1 text-sm font-bold text-brand-gold-foreground">
              Saving {formatPrice(savings)} per visit
            </span>
          )}
          <span className="inline-flex items-center rounded-full border border-brand-navy-foreground/30 px-3 py-1 text-sm font-semibold text-fine-print-on-dark">
            You won’t be charged today
          </span>
        </div>
      </aside>
    );
  }

  if (variant === "bar") {
    return (
      <div className="flex items-center justify-between gap-4 border-t border-border bg-card px-4 py-3">
        {liveRegion}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
            {ongoing ? "First clean" : "Your price"}
          </p>
          <p className="text-2xl font-bold leading-tight text-foreground">{priceLabel}</p>
          {!quote.isEstimate && (
            <p className="text-sm text-foreground/80">
              {formatPrice(withGst(firstClean))} with GST
            </p>
          )}
        </div>
        {ongoing !== null && (
          <div className="text-right">
            <p className="text-sm font-semibold uppercase tracking-wide text-foreground/80">
              Then per visit
            </p>
            <p className="text-lg font-bold leading-tight text-foreground">
              {formatPrice(shownOngoing)}
            </p>
            <p className="text-sm text-foreground/80">
              {formatPrice(withGst(ongoing))} with GST
            </p>
          </div>
        )}
        <div className="hidden sm:block">{firstVisitNote}{pills}</div>
      </div>
    );
  }

  return (
    <aside className="rounded-sm border-t-4 border-brand-gold bg-card p-6 shadow-xl shadow-brand-navy/10">
      {liveRegion}
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
        {serviceLabel}
      </p>

      <p className="mt-4 text-sm font-semibold text-muted-foreground">
        {ongoing ? "First clean" : "Your price"}
      </p>
      <p className="text-4xl font-bold leading-tight text-foreground">
        {priceLabel}
        <span className="ml-2 align-middle text-sm font-medium text-fine-print">
          + 5% GST
        </span>
      </p>
      {!quote.isEstimate && (
        <p className="mt-1 text-sm text-fine-print">
          {formatPrice(withGst(firstClean))} with GST
        </p>
      )}
      {firstCleanNote && (
        <p className="mt-1 text-sm text-muted-foreground">{firstCleanNote}</p>
      )}
      <p className="mt-1 text-sm text-muted-foreground">Set price by home size, for the condition you describe.</p>
      <p className="mt-1 text-[0.9375rem] text-muted-foreground">
        Know the number before you give up the afternoon.
      </p>

      {ongoing !== null && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-sm font-semibold text-muted-foreground">Then every visit</p>
          <p className="text-2xl font-bold leading-tight text-foreground">
            {formatPrice(shownOngoing)}
            <span className="ml-2 align-middle text-sm font-medium text-fine-print">
              + 5% GST
            </span>
          </p>
          <p className="mt-1 text-sm text-fine-print">
            {formatPrice(withGst(ongoing))} with GST
          </p>
          {ongoingNote && (
            <p className="mt-1 text-sm text-muted-foreground">{ongoingNote}</p>
          )}
        </div>
      )}

      <p className="mt-4 border-t border-border pt-4 text-sm font-semibold text-muted-foreground">{itemLine}</p>
      {firstVisitNote}
      {pills}

      {quote.isEstimate && (
        <p className="mt-5 border-t border-border pt-5 text-sm leading-relaxed text-muted-foreground">
          This service is priced on site condition, so we show an honest range. Lock in your
          exact price by picking a time and we confirm before any work begins.
        </p>
      )}
    </aside>
  );
}
