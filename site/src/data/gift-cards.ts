import { standardTierRows, deepCleanTierRows, moveInOutTierRows } from "./pricing";

/**
 * The gift card denominations and what each one actually buys.
 *
 * The amounts are the owner's choice of round numbers, so they are typed here
 * — they are not prices and bk-config does not know them. The DESCRIPTIONS are
 * not typed, because the page shipped "$350 — best for a full house deep clean
 * or move-in/move-out" while a 3-bedroom deep clean is $372 and a 3-bedroom
 * move-out $424: a gift that could not buy what its own label promised.
 *
 * So each label is computed from the tier tables: the largest home each
 * amount covers, per service. Change a price in bk-config and the label moves
 * with it; change an amount here and the label moves too.
 */
export const GIFT_CARD_AMOUNTS = [165, 250, 350] as const;

type Tier = { beds: string; price: string };
const dollars = (t: Tier) => Number(t.price.replace(/[^0-9.]/g, ""));

/** The dearest tier an amount pays for in full, or null if it covers none. */
const covers = (rows: Tier[], amount: number): Tier | null =>
  rows.filter((r) => dollars(r) <= amount).at(-1) ?? null;

/** "1 Bedroom" -> "a 1-bedroom home"; "5 Bedroom" -> "a 5-bedroom home". */
const home = (beds: string) => `a ${beds.replace(" Bedroom", "-bedroom").replace("+-", "+ ")} home`;

export type GiftCardTier = { amount: string; description: string };

export function giftCardGuide(): GiftCardTier[] {
  const guide: GiftCardTier[] = GIFT_CARD_AMOUNTS.map((amount) => {
    const move = covers(moveInOutTierRows(), amount);
    const deep = covers(deepCleanTierRows(), amount);
    const std = covers(standardTierRows(), amount);
    const parts: string[] = [];
    if (deep) parts.push(`a deep clean of ${home(deep.beds)}`);
    if (move) parts.push(`a move-in/move-out clean of ${home(move.beds)}`);
    if (!deep && std) parts.push(`a standard clean of ${home(std.beds)}`);
    const claim = parts.length ? `Covers ${parts.join(", or ")}` : "Goes toward any clean";
    return { amount: `$${amount}`, description: claim };
  });
  guide.push({ amount: "Custom", description: "Choose any amount that fits your budget" });
  return guide;
}
