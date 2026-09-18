/**
 * The pieces every location page draws its service list, its "why us" row and
 * (on the town pages) its worked quote with. Until 2026-09-18 each of the 150
 * files under src/pages/locations/ carried its own copy of both cards
 * (identical apart from line breaks), and LocationPageTemplate a third. The
 * data they show lives in data/location-cards.tsx; read the note at the top of
 * that file before giving a card a description.
 *
 * Motion (2026-09-18): the cards used to lift, scale, tilt their icon 12
 * degrees and sit in a preserve-3d context on hover, none of it behind a
 * reduced-motion guard, and the "why us" card did all that with nothing to
 * click. The service entry is now a boxless row whose link covers the whole
 * row, so there is one card grid per page instead of two back to back; the
 * "why us" card is static.
 */
import type { ElementType, ReactNode } from "react";
import { Link } from "react-router-dom";

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  to,
  linkText,
}: {
  icon: ElementType;
  title: string;
  /** Location cards carry none: the service page says what the service includes. */
  description?: string;
  to?: string;
  linkText?: string;
}) => (
  <div className="relative flex items-start gap-4 rounded-xl p-3 transition-colors hover:bg-primary/5">
    <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
      <Icon className="w-6 h-6 text-primary" />
    </div>
    <div className="min-w-0">
      <h3 className="text-lg font-bold text-foreground">{title}</h3>
      {description ? <p className="text-muted-foreground text-sm leading-relaxed">{description}</p> : null}
      {to && linkText && (
        // The link text stays the anchor text; the ::after only widens the
        // target to the whole row. The class list ends in hover:text-accent
        // because a guard proof finds the link by that ending.
        <Link
          to={to}
          className="inline-flex min-h-[44px] items-center font-semibold text-primary after:absolute after:inset-0 after:rounded-xl transition-colors hover:text-accent"
        >
          {linkText}
          <span className="dc-icon dc-icon-arrow-right ml-1.5 h-4 w-4 shrink-0" aria-hidden="true" />
        </Link>
      )}
    </div>
  </div>
);

export const WhyUsCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description?: ReactNode;
}) => (
  <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 text-center">
    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
      <Icon className="w-7 h-7 text-accent-on-dark" />
    </div>
    <h3 className={`text-xl font-bold text-white ${description ? "mb-3" : ""}`}>{title}</h3>
    {description ? <p className="text-white/80 text-sm leading-relaxed">{description}</p> : null}
  </div>
);

export interface QuoteReceiptLine {
  label: string;
  /** Already formatted by pricing.ts: the page never types a figure. */
  amount: string;
  note?: string;
}

/**
 * A worked quote set out as a receipt. The town pages ran the same figures
 * through one paragraph of prose (six dollar amounts in a sentence); the
 * amounts still come from calculateQuote on the page, this only lays them out.
 * `extras` are lines that apply to some homes only, such as the pet charge,
 * and sit under the total.
 */
export const QuoteReceipt = ({
  lines,
  total,
  extras = [],
}: {
  lines: QuoteReceiptLine[];
  total: QuoteReceiptLine;
  extras?: QuoteReceiptLine[];
}) => (
  <dl className="not-prose max-w-xl rounded-xl border border-border bg-white px-5 py-3 text-base text-foreground">
    {lines.map((line) => (
      <div key={line.label} className="flex items-baseline justify-between gap-6 border-b border-dashed border-border py-2.5">
        <dt>
          {line.label}
          {line.note ? <span className="block text-sm text-muted-foreground">{line.note}</span> : null}
        </dt>
        <dd className="shrink-0 font-medium tabular-nums">{line.amount}</dd>
      </div>
    ))}
    <div className="flex items-baseline justify-between gap-6 py-3 text-lg font-bold">
      <dt>{total.label}</dt>
      <dd className="shrink-0 tabular-nums">{total.amount}</dd>
    </div>
    {extras.map((line) => (
      <div key={line.label} className="flex items-baseline justify-between gap-6 border-t border-dashed border-border py-2.5 text-muted-foreground">
        <dt>
          {line.label}
          {line.note ? <span className="block text-sm">{line.note}</span> : null}
        </dt>
        <dd className="shrink-0 font-medium tabular-nums text-foreground">{line.amount}</dd>
      </div>
    ))}
  </dl>
);
