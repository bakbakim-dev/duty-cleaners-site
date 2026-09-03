import { addOnFromPrice, addOnsFor, formatPrice } from "@/data/pricing";

/**
 * Published add-on table for the city pricing pages.
 *
 * Every figure is read from bk-config through `addOnFromPrice`, so the table
 * can never advertise a price BookingKoala disagrees with. Rows are keyed by
 * the BookingKoala extra key (the slugified extra name), which is the same key
 * the quote funnel and the booking hand-off use.
 *
 * A move-in/out clean already covers several of these tasks, so where the extra
 * does not exist on that service we say "Included" instead of inventing a price
 * for it. The exception is an extra the service does not offer at all — see
 * `notOnMoveInOut` — because "Included" and "not available" are opposite
 * answers and the reader cannot tell them apart from a blank.
 */

interface AddOnTableRow {
  /** Human label shown in the table. */
  service: string;
  /** Standard clean (and deep clean, which is standard + the deep package). */
  standard: string;
  /** Move in/out — either its own price or "Included". */
  moveInOut: string;
}

interface AddOnSpec {
  key: string;
  label: string;
  /** Suffix appended to the price, e.g. "/set". */
  unit?: string;
  /**
   * The extra does not exist on move-in/out because the service does not offer
   * it, not because it is already covered. Without this the absent-means-
   * included rule below printed "Included" and a move-out customer expected a
   * service they were never going to get.
   */
  notOnMoveInOut?: boolean;
}

const ROWS: AddOnSpec[] = [
  { key: "inside-fridge", label: "Inside fridge cleaning" },
  { key: "inside-oven", label: "Inside oven cleaning" },
  { key: "inside-cabinets-kitchen-bathroom-only", label: "Inside cabinets (kitchen & bathrooms, must be empty)" },
  { key: "inside-windows", label: "Interior window cleaning" },
  { key: "spot-cleaning-inside-walls", label: "Spot cleaning of walls" },
  { key: "complete-inside-wall-washing", label: "Top-to-bottom wall washing" },
  { key: "wipe-window-blinds-per-set", label: "Wipe window blinds", unit: "/set" },
  { key: "sweep-only-of-garage-or-balcony", label: "Balcony / garage sweep" },
  { key: "finished-basement", label: "Finished basement" },
  { key: "unfinished-basement-sweep", label: "Unfinished basement sweep" },
  // Confirmed by the owner: not offered on a move-out, and the reason is the
  // service itself — a move-out is cleaned empty, so there is nothing to
  // de-clutter.
  { key: "de-cluttering-or-organizing-per-hour", label: "De-cluttering or organizing", unit: "/hr", notOnMoveInOut: true },
  { key: "must-choose-if-you-have-pets", label: "Homes with pets" },
];

export const TRAVEL_FEE_KEY =
  "outside-edmonton-calgary-surrounding-areas-travel-fee-do-not-select-this-if-you-live-inside-edmonton-calgary";

const priceCell = (value: number | null, unit?: string) =>
  value === null ? "Included" : `from ${formatPrice(value)}${unit ?? ""}`;

export function addOnTableRows(city: "edmonton" | "calgary"): AddOnTableRow[] {
  const moveInOutKeys = new Set(addOnsFor("move-in-out", null).map((addOn) => addOn.id));

  const rows = ROWS.flatMap((spec) => {
    const standard = addOnFromPrice("standard", spec.key);
    if (standard === null) return [];
    const moveInOut = moveInOutKeys.has(spec.key)
      ? addOnFromPrice("move-in-out", spec.key)
      : null;
    return [
      {
        service: spec.label,
        standard: priceCell(standard, spec.unit),
        // Absent from move-in/out means one of two things, and the table used to
        // print "Included" for both. Fridge, oven and cabinets really are
        // covered by that service; de-cluttering simply is not offered on it.
        moveInOut: spec.notOnMoveInOut ? "Not offered" : priceCell(moveInOut, spec.unit),
      },
    ];
  });

  const travel = addOnFromPrice("standard", TRAVEL_FEE_KEY);
  if (travel !== null) {
    const label = city === "calgary" ? "Outside Calgary (travel fee)" : "Outside Edmonton (travel fee)";
    const cell = `${formatPrice(travel)}`;
    rows.push({ service: label, standard: cell, moveInOut: cell });
  }

  return rows;
}
