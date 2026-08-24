import { formatPrice, withGst, type QuoteResult } from "@/data/pricing";

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
}) {

  const firstClean = firstCleanOverride ?? quote.firstClean;
  const ongoing = quote.ongoing === null ? null : (ongoingOverride ?? quote.ongoing);
  const savings = savingsOverride ?? quote.savings;
  const priceLabel = quote.isEstimate
    ? `${formatPrice(quote.rangeLow)}–${formatPrice(quote.rangeHigh)}`
    : formatPrice(firstClean);

  /**
   * One composed sentence for screen readers. It lives in a polite live
   * region so changing the frequency chip announces the whole new price
   * ("First clean $169, then $143.65 per visit") instead of stray fragments.
   */
  const spokenPrice = ongoing
    ? `First clean ${priceLabel} before GST, then ${formatPrice(ongoing)} per visit.`
    : `Your price, ${priceLabel} before GST.`;

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
     active; "Pay $0 today" is always true — payment happens after the clean. */
  const pills = (
    <div className="mt-3 flex flex-wrap items-center gap-2">
      {ongoing !== null && savings > 0 && (
        <span className="inline-flex items-center rounded-full border border-savings-border bg-savings px-3 py-1 text-sm font-bold text-savings-foreground">
          Saving {formatPrice(savings)} per visit
        </span>
      )}
      <span className="inline-flex items-center rounded-full border border-border bg-muted px-3 py-1 text-sm font-semibold text-fine-print">
        Pay $0 today
      </span>
    </div>
  );



  if (variant === "compact") {
    /* Step 3 already shows the full price card in the main column; the rail
       only needs to keep the number in view while the visitor scrolls. Deep
       ink: this is the authority moment, so it reads as one solid surface. */
    return (
      <aside className="rounded-lg bg-brand-navy p-5 text-brand-navy-foreground shadow-lg shadow-brand-navy/20">
        {liveRegion}
        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.2em] text-brand-gold">
          Price authority
        </p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-fine-print-on-dark">
          {serviceLabel}
        </p>
        <p className="mt-3 text-sm font-semibold text-fine-print-on-dark">
          {ongoing ? "First clean" : "Your price"}
        </p>
        <p className="text-3xl font-bold leading-tight">{priceLabel}</p>
        {ongoing !== null && (
          <p className="mt-2 text-sm font-semibold">
            Then {formatPrice(ongoing)} per visit
          </p>
        )}
        <p className="mt-2 border-t border-brand-navy-foreground/20 pt-3 text-sm text-fine-print-on-dark">
          {itemLine}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {ongoing !== null && savings > 0 && (
            <span className="inline-flex items-center rounded-full bg-brand-gold px-3 py-1 text-sm font-bold text-brand-gold-foreground">
              Saving {formatPrice(savings)} per visit
            </span>
          )}
          <span className="inline-flex items-center rounded-full border border-brand-navy-foreground/30 px-3 py-1 text-sm font-semibold text-fine-print-on-dark">
            Pay $0 today
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
              {formatPrice(ongoing)}
            </p>
            <p className="text-sm text-foreground/80">
              {formatPrice(withGst(ongoing))} with GST
            </p>
          </div>
        )}
        <div className="hidden sm:block">{pills}</div>
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
      <p className="mt-1 text-sm text-muted-foreground">Flat rate — we stay until the job is done right.</p>
      <p className="mt-1 text-[0.9375rem] text-muted-foreground">
        Know the number before you give up the afternoon.
      </p>

      {ongoing !== null && (
        <div className="mt-5 border-t border-border pt-5">
          <p className="text-sm font-semibold text-muted-foreground">Then every visit</p>
          <p className="text-2xl font-bold leading-tight text-foreground">
            {formatPrice(ongoing)}
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
