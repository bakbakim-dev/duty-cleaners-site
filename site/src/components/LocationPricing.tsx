import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { canonicalForPath } from "@/data/legacy-urls";
import { cityFromPath } from "@/lib/city-from-path";
import {
  standardTierRows,
  deepCleanTierRows,
  moveInOutTierRows,
  addOnFromPrice,
  formatPrice,
} from "@/data/pricing";
import { TRAVEL_FEE_KEY } from "@/data/addon-table";
import { edmontonSurrounding, calgarySurrounding } from "@/data/city-locations";

/**
 * The price block for the 138 hand-written location pages.
 *
 * WHY THIS EXISTS
 * 138 of the 153 location pages showed no price anywhere, and the split was
 * exactly inverted: the only 15 pages that quoted a figure were the ones built
 * on LocationPageTemplate — the most templated, least differentiated pages on
 * the site. The 138 pages with genuine local content, the ones actually worth
 * ranking, sent every visitor to a quote form to find out what anything cost.
 *
 * Prices do not vary by neighbourhood, so this needs no per-page arguments. It
 * derives the city from the route the same way <CoverageChips> does, and every
 * figure comes from bk-config through pricing.ts — published-prices.test.ts
 * forbids hand-typed dollar literals on pricing surfaces.
 *
 * THE TRAVEL FEE IS NOT OPTIONAL POLITENESS
 * Satellite towns are charged a travel fee applied by postal code at booking.
 * Advertising a headline rate on a page for one of those towns while omitting a
 * mandatory fee is drip pricing under Competition Act s.74.01(1.1), which does
 * not care whether the omission was deliberate. That is why no price could
 * simply be dropped onto these pages wholesale: the fee line and the price have
 * to ship together, and the surrounding-town lists in city-locations.ts are
 * what decides which pages get it.
 */

const span = (rows: { price: string }[]) => `${rows[0].price} to ${rows[rows.length - 1].price}`;
const PRICES = {
  standard: span(standardTierRows()),
  deep: span(deepCleanTierRows()),
  moveInOut: span(moveInOutTierRows()),
};

const TRAVEL_FEE = (() => {
  const v = addOnFromPrice("standard", TRAVEL_FEE_KEY);
  return v === null ? null : formatPrice(v);
})();

/** Route slugs for every place that is its own municipality, not a neighbourhood. */
const SURROUNDING_SLUGS: ReadonlySet<string> = new Set(
  [...edmontonSurrounding, ...calgarySurrounding].map((entry) =>
    entry.to.replace(/^\/(?:locations|cleaning-services)[/-]?/, "").replace(/\/+$/, ""),
  ),
);

export interface LocationPricingProps {
  /** Display name for this place. Defaults to a title-cased slug. */
  place?: string;
}

export default function LocationPricing({ place }: LocationPricingProps) {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\/(locations|cleaning-services)[/-]?/, "").replace(/\/+$/, "");
  const city = cityFromPath(pathname) === "calgary" ? "Calgary" : "Edmonton";
  const isOwnMunicipality = SURROUNDING_SLUGS.has(slug);
  const name =
    place ??
    slug
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
  const pricingPath = city === "Calgary" ? "/calgary/pricing" : "/pricing";

  return (
    <section className="py-16 md:py-20 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <span className="text-primary text-sm font-semibold tracking-wider uppercase">
            What it costs
          </span>
          <h2 className="display-serif text-2xl md:text-3xl font-bold text-foreground mt-2 mb-6">
            Cleaning prices in {name}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-4">
            A standard clean runs {PRICES.standard} depending on the size of your home, a deep
            clean {PRICES.deep}, and a move-in or move-out clean {PRICES.moveInOut}. Those are flat
            rates in Canadian dollars before 5% GST — the figure you see before booking is the
            figure you pay, and it does not go up because a clean took longer than expected.
            {isOwnMunicipality && TRAVEL_FEE !== null
              ? ` Because ${name} sits outside our Edmonton and Calgary service areas, a ${TRAVEL_FEE} travel fee is added to bookings here.`
              : ""}
          </p>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Recurring visits save 20% weekly, 15% bi-weekly and 10% monthly from the second clean.
            Your first clean is charged at the standard one-time rate. The{" "}
            <Link to={canonicalForPath(pricingPath)} className="text-accent hover:underline">
              full {city} price list
            </Link>{" "}
            breaks every tier down by bedroom count and lists the add-ons.
          </p>
        </div>
      </div>
    </section>
  );
}
