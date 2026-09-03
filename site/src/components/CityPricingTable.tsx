import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { FREQUENCIES } from "@/data/pricing";
import { useLocation } from "react-router-dom";
import { quoteHrefFor } from "@/lib/quote-link";
import { Button } from "@/components/ui/button";
import { deepCleanTierRows, moveInOutTierRows, standardTierRows } from "@/data/pricing";

/**
 * Shared pricing block for the city landing pages.
 *
 * Conversion note: this used to render nine identical CTA buttons (one per
 * cell) that all pointed at a separate pricing page. That split attention and
 * pulled people away from the quote flow living lower on the same page. Now
 * there is a single CTA, and it goes to the city home page's #quote section
 * (a same-page #quote was broken on every page without that id).
 *
 * Every figure is derived from `src/data/pricing.ts` (a capture of the live
 * BookingKoala config) — nothing here is hand-typed, so this table can never
 * quote a price the booking form disagrees with.
 */

/** The three published columns, each anchored on its smallest home size. */
const priceAt = (rows: { beds: string; price: string }[], label: string) =>
  rows.find((row) => row.beds === label)?.price ?? "";

const columnPrices = (rows: { beds: string; price: string }[]) => [
  priceAt(rows, "1 Bedroom"),
  priceAt(rows, "3 Bedroom"),
  priceAt(rows, "4 Bedroom"),
];

const ROWS = [
  {
    service: "Standard Cleaning",
    popular: true,
    prices: columnPrices(standardTierRows()),
  },
  {
    service: "Deep Clean",
    prices: columnPrices(deepCleanTierRows()),
  },
  {
    service: "Move In/Out",
    prices: columnPrices(moveInOutTierRows()),
  },
];

const COLUMNS = ["1-2 Bedroom", "3 Bedroom", "4+ Bedroom"];


/** Discounts read from bk-config, so this line cannot quote a stale rate. */
const RECURRING_SAVINGS = FREQUENCIES.filter((frequency) => frequency.discount > 0)
  .sort((a, b) => b.discount - a.discount)
  .map((frequency) => `${Math.round(frequency.discount * 100)}% ${frequency.label.toLowerCase()}`)
  .join(", ");

/** Same city resolution the quote link uses, so both agree on every route. */
const cityBase = (pathname: string) =>
  quoteHrefFor(pathname).startsWith("/cleaning-services-calgary") ? "/calgary" : "/edmonton";

const CityPricingTable = () => {
  const { pathname } = useLocation();
  return (
  <section id="pricing" className="py-16 md:py-20 bg-brand-navy text-brand-navy-foreground">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-accent-on-dark font-semibold text-sm uppercase tracking-wide">
            Pricing
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">Pricing that fits the job</h2>
          <p className="text-white/90 mt-4 max-w-[65ch] mx-auto">
            Most homes are priced flat by size — you see your number before you book, plus 5% GST,
            and it doesn&rsquo;t go up because a clean took longer. If a flat rate doesn&rsquo;t suit
            your job or your budget, we&rsquo;ll quote you hourly instead — and tell you which option
            costs you less.
          </p>
          <p className="text-white/80 mt-3 max-w-[65ch] mx-auto text-sm">
            Condition, pets and add-ons can change the final number, and your quote spells all of it
            out before you book.
          </p>
        </div>

        {/* Desktop: comparison table */}
        <div className="hidden md:block">
          <table className="w-full bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead className="bg-white/15 text-white">
              <tr>
                <th className="py-4 px-6 text-left text-base">Service Type</th>
                {COLUMNS.map((c) => (
                  <th key={c} className="py-4 px-6 text-center text-base">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr
                  key={row.service}
                  className={`border-b border-white/20 last:border-0 ${row.popular ? "bg-white/10" : ""}`}
                >
                  <td className="py-5 px-6 font-semibold">
                    <div className="flex items-center gap-2">
                      {row.service}
                      {row.popular && (
                        <span className="inline-block bg-brand-gold text-brand-gold-foreground text-xs font-bold px-2 py-1 rounded-full w-fit">
                          Most Popular
                        </span>
                      )}
                    </div>
                  </td>
                  {row.prices.map((p, i) => (
                    <td key={`${row.service}-${COLUMNS[i]}`} className="py-5 px-6 text-center font-bold text-xl">
                      <span className="mr-1 text-sm font-semibold text-white/80">from</span>
                      {p}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards instead of a horizontally scrolling table */}
        <div className="md:hidden space-y-4">
          {ROWS.map((row) => (
            <div
              key={row.service}
              className={`rounded-xl border border-white/20 p-5 ${row.popular ? "bg-white/[0.18]" : "bg-white/10"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-lg">{row.service}</h3>
                {row.popular && (
                  <span className="inline-block bg-brand-gold text-brand-gold-foreground text-xs font-bold px-2 py-1 rounded-full">
                    Most Popular
                  </span>
                )}
              </div>
              <dl className="space-y-2">
                {COLUMNS.map((c, i) => (
                  <div key={c} className="flex items-baseline justify-between gap-4">
                    <dt className="text-white/90 text-sm">{c}</dt>
                    <dd className="font-bold text-lg">
                      <span className="mr-1 text-sm font-semibold text-white/80">from</span>
                      {row.prices[i]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>

        {/*
          The recurring discount belongs directly under the price anchoring,
          because it is the largest number on this page and it was not on this
          page at all. A 3-bedroom standard at $232 becomes $185.60 weekly.
        */}
        <p className="mt-6 text-center text-sm text-white/90 max-w-[62ch] mx-auto">
          Booking regularly? From your second visit you save {RECURRING_SAVINGS}. The first clean is
          charged at the standard one-time rate.{" "}
          <Link
            to={canonicalForPath(`${cityBase(pathname)}/recurring-cleaning`)}
            className="font-semibold text-accent-on-dark underline-offset-2 hover:underline"
          >
            See recurring cleaning
          </Link>
        </p>

        <div className="text-center mt-8">
          <Button
            asChild
            size="lg"
            className="bg-accent hover:bg-accent/90 text-white font-bold min-h-[48px] px-8"
          >
            <a href={quoteHrefFor(pathname)}>See My Instant Price</a>
          </Button>
          <p className="text-sm text-white/90 mt-4 max-w-[60ch] mx-auto">
            Answer a few quick questions and see your exact price — no phone call needed.
          </p>
        </div>
      </div>
    </div>
  </section>
  );
};

export default CityPricingTable;
