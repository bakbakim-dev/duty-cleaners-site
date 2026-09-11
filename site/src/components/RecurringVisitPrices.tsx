import { recurringVisitRows, type PricingTier } from "@/data/pricing";

/**
 * The price of each recurring visit, by schedule, for the tiers a page names.
 *
 * Both recurring pages printed the discounts (20%, 15%, 10%) and left the
 * reader to apply them to a table price that is rounded to the dollar. Every
 * figure here comes from recurringVisitRows() in pricing.ts, which runs the
 * booking form's own maths, so the page and the checkout agree to the cent.
 * The caption carries the conditions, because a price table without them
 * reads as the whole bill.
 */

const sizeLabel = (tier: PricingTier) => {
  const beds = `${tier.beds} bedroom${tier.beds === 1 ? "" : "s"}`;
  const baths = `${tier.bathrooms} bathroom${tier.bathrooms === 1 ? "" : "s"}`;
  return tier.halfBaths > 0 ? `${beds}, ${baths} and a half bath` : `${beds}, ${baths}`;
};

export default function RecurringVisitPrices({ tiers, caption }: { tiers: number[]; caption: string }) {
  const rows = recurringVisitRows(tiers);
  if (rows.length === 0) return null;
  const schedules = rows[0].visits;
  return (
    <div className="not-prose my-6 overflow-x-auto rounded-xl border border-border" tabIndex={0} role="region" aria-label={caption}>
      <table className="w-full bg-card text-sm">
        <caption className="px-4 py-3 text-left text-sm text-muted-foreground">{caption}</caption>
        <thead>
          <tr className="bg-secondary/40 text-left">
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">Home</th>
            <th scope="col" className="px-4 py-3 font-semibold text-foreground">First visit</th>
            {schedules.map((s) => (
              <th key={s.id} scope="col" className="px-4 py-3 font-semibold text-foreground">
                {s.label}, from visit two ({s.discountPct}% off)
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row) => (
            <tr key={row.tier.beds}>
              <th scope="row" className="px-4 py-3 text-left font-medium text-foreground">{sizeLabel(row.tier)}</th>
              <td className="px-4 py-3 tabular-nums text-foreground">{row.firstVisit}</td>
              {row.visits.map((v) => (
                <td key={v.id} className="px-4 py-3 tabular-nums font-semibold text-foreground">{v.price}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
