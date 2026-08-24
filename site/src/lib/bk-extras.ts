/**
 * BookingKoala extras resolver.
 *
 * BookingKoala models most extras as SEPARATE rows per home size: the same
 * name repeats with a different id, price and set of `variables` (the pricing
 * option ids the row is valid for). Sending an id that does not match the
 * selected home size is silently dropped by BookingKoala — the customer's
 * quote and their actual booking then disagree, and nobody notices until the
 * cleaner arrives.
 *
 * So no extra id is ever hard-coded. Everything resolves out of the captured
 * config by (name + service category + bedroom option id), and an unresolved
 * extra sends NOTHING rather than a guess.
 *
 * `extras[<id>]=<quantity>` is a documented BookingKoala URL surface
 * (help.bookingkoala.com — "Query parameters & preselected fields on the
 * booking form").
 */

import bkConfig from "@/data/bk-config.json";

export interface BkExtraRow {
  id: number;
  name: string;
  prices_ml?: number[] | null;
  service_categories?: number[] | null;
  variables?: number[] | null;
  /** BookingKoala's own maximum when quantities are enabled. */
  quantity_based?: number | null;
  enable_quantity_based?: string | null;
  /** BookingKoala flag: the row is charged in full on recurring visits. */
  exempt_extra_from_freq_disc?: boolean | null;
  status?: number | null;
}

/** Home Cleaning — the only industry the funnel books into. */
const HOME_CLEANING_INDUSTRY_ID = 1;

const EXTRA_ROWS: BkExtraRow[] = (
  (bkConfig.industries as unknown as { id: number; extras: BkExtraRow[] }[]).find(
    (entry) => entry.id === HOME_CLEANING_INDUSTRY_ID
  )?.extras ?? []
).filter((row) => row.status !== 0);

export interface ResolvedExtra {
  id: number;
  /** BookingKoala's own display name for the row. */
  name: string;
  /** The row's own price, so the figure we quote and the id we send agree. */
  price: number;
  /** 1 for a normal tick-box extra; higher when BookingKoala allows a count. */
  maxQuantity: number;
  /**
   * True when BookingKoala charges this row at FULL price on every recurring
   * visit (no frequency discount). Read from the config row — never guessed.
   */
  exemptFromFrequencyDiscount: boolean;
}

/** Names carry stray spaces and casing drift in the config — normalise both. */
const norm = (value: string) => value.trim().replace(/\s+/g, " ").toLowerCase();

/**
 * The option ids a row must be valid for: the bedroom tier AND the home type
 * (BookingKoala gates basement extras on home type — condos and basement
 * suites don't get them). Accepts a single id for the older bedroom-only
 * call sites.
 */
export type OptionIds = number | (number | null)[] | null;

const toIds = (optionIds: OptionIds): number[] => {
  if (optionIds === null) return [];
  if (typeof optionIds === "number") return [optionIds];
  return optionIds.filter((id): id is number => typeof id === "number");
};

/**
 * A row applies to a selection when its `variables` contains EVERY selected
 * option id — or when it has no `variables` at all, which is BookingKoala's
 * way of saying "every size" (pets, travel fee, window blinds).
 */
const appliesToSize = (row: BkExtraRow, optionIds: OptionIds): boolean => {
  if (!row.variables || row.variables.length === 0) return true;
  const ids = toIds(optionIds);
  if (ids.length === 0) return true;
  return ids.every((id) => row.variables!.includes(id));
};

/**
 * Home types that can never book a basement extra: Apartment or Condo (55)
 * and Basement Suite Only (56). BookingKoala drops those rows server-side, so
 * offering them here would quote a price the booking page never charges.
 * The captured config snapshot doesn't always carry that restriction, so the
 * rule is enforced here as well and survives a stale export.
 */
const BASEMENT_BLOCKED_HOME_TYPE_IDS = [55, 56];
const BASEMENT_PREFIXES = ["finished basement", "unfinished basement", "basement"];

const isBasementRow = (name: string) =>
  BASEMENT_PREFIXES.some((prefix) => norm(name).startsWith(prefix));

/** True when this row must not be offered for the selected options. */
const isBlockedForSelection = (row: BkExtraRow, optionIds: OptionIds): boolean => {
  if (!isBasementRow(row.name ?? "")) return false;
  const ids = toIds(optionIds);
  return ids.some((id) => BASEMENT_BLOCKED_HOME_TYPE_IDS.includes(id));
};

const isQuantityBased = (row: BkExtraRow) =>
  String(row.enable_quantity_based ?? "").toLowerCase() === "yes";

const toResolved = (row: BkExtraRow): ResolvedExtra => ({
  id: row.id,
  name: (row.name ?? "").trim().replace(/\s+/g, " "),
  price: row.prices_ml?.[0] ?? 0,
  maxQuantity: isQuantityBased(row) ? Math.max(1, row.quantity_based ?? 1) : 1,
  exemptFromFrequencyDiscount: row.exempt_extra_from_freq_disc === true,
});

/**
 * The extras row for a name at a given service + selection, or null.
 * A size-specific row always beats an every-size row of the same name.
 */
export function resolveExtra(
  name: string,
  serviceId: number,
  optionIds: OptionIds
): ResolvedExtra | null {
  const wanted = norm(name);
  const candidates = EXTRA_ROWS.filter(
    (row) =>
      norm(row.name ?? "") === wanted &&
      row.service_categories?.includes(serviceId) &&
      appliesToSize(row, optionIds) &&
      !isBlockedForSelection(row, optionIds)
  );
  if (candidates.length === 0) return null;
  const sized = candidates.find((row) => row.variables && row.variables.length > 0);
  return toResolved(sized ?? candidates[0]);
}


/** Convenience: the id only. */
export const resolveExtraId = (
  name: string,
  serviceId: number,
  optionIds: OptionIds
): number | null => resolveExtra(name, serviceId, optionIds)?.id ?? null;

/* ------------------------------------------------------------------ *
 * The shelf
 * ------------------------------------------------------------------ */

/** BookingKoala's exact row name for the Deep Cleaning package. */
export const DEEP_CLEANING_EXTRA_NAME = "Deep Cleaning";

/** Asked as its own question above the shelf — operational, not an upsell. */
export const PETS_EXTRA_NAME = "Must choose if you have pets";

/**
 * Travel fee. Its config name is a full sentence, so it is matched by prefix
 * rather than typed out: BookingKoala's copy there changes often.
 */
const TRAVEL_FEE_PREFIX = "outside edmonton/calgary";

/** Rows the shelf must never render — they have their own dedicated control. */
const SHELF_EXCLUDED = (name: string) =>
  norm(name) === norm(PETS_EXTRA_NAME) || norm(name).startsWith(TRAVEL_FEE_PREFIX);

/** The first five rows, in this order, before "Show all add-ons". */
export const FEATURED_EXTRA_PREFIXES = [
  "inside oven",
  "inside fridge",
  "inside windows",
  "inside cabinets",
  "deep cleaning",
];

export const FEATURED_COUNT = FEATURED_EXTRA_PREFIXES.length;

const featuredRank = (name: string) => {
  const value = norm(name);
  const index = FEATURED_EXTRA_PREFIXES.findIndex((prefix) => value.startsWith(prefix));
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
};

/**
 * Every extra BookingKoala itself would offer for this service + home size,
 * exactly as BK filters them, deduped by name (the size-specific tier wins)
 * and ordered featured-first. Pets and the travel fee are excluded — they are
 * separate questions in the funnel.
 */
export function listExtrasFor(
  serviceId: number,
  optionIds: OptionIds
): ResolvedExtra[] {
  const byName = new Map<string, BkExtraRow>();

  for (const row of EXTRA_ROWS) {
    if (!row.service_categories?.includes(serviceId)) continue;
    if (!appliesToSize(row, optionIds)) continue;
    if (isBlockedForSelection(row, optionIds)) continue;
    if (SHELF_EXCLUDED(row.name ?? "")) continue;

    const key = norm(row.name ?? "");
    const existing = byName.get(key);
    if (!existing) {
      byName.set(key, row);
      continue;
    }
    // A size-specific row is always the truthful one for this home.
    const existingSized = Boolean(existing.variables?.length);
    const rowSized = Boolean(row.variables?.length);
    if (rowSized && !existingSized) byName.set(key, row);
  }

  return [...byName.values()]
    .map(toResolved)
    .sort((a, b) => {
      const rank = featuredRank(a.name) - featuredRank(b.name);
      if (rank !== 0) return rank;
      return a.name.localeCompare(b.name);
    });
}

/** The pets extra for this service + size, or null when unavailable. */
export const petsExtraFor = (
  serviceId: number,
  optionIds: OptionIds
): ResolvedExtra | null => resolveExtra(PETS_EXTRA_NAME, serviceId, optionIds);

/** The travel-fee extra for this service + size, or null when unavailable. */
export function travelFeeExtraFor(
  serviceId: number,
  optionIds: OptionIds
): ResolvedExtra | null {
  const row = EXTRA_ROWS.find(
    (entry) =>
      norm(entry.name ?? "").startsWith(TRAVEL_FEE_PREFIX) &&
      entry.service_categories?.includes(serviceId) &&
      appliesToSize(entry, optionIds)
  );
  return row ? toResolved(row) : null;
}

/* ------------------------------------------------------------------ *
 * Coverage assertion
 * ------------------------------------------------------------------ */

export interface CoverageGap {
  extra: string;
  serviceId: number;
  bedroomOptionId: number;
}

/**
 * Every extra we offer must resolve for every bedroom option of its service.
 * A BookingKoala config change then fails loudly here instead of silently at
 * the handoff.
 */
export function findCoverageGaps(
  offers: { name: string; serviceId: number; bedroomOptionIds: number[] }[]
): CoverageGap[] {
  const gaps: CoverageGap[] = [];
  for (const offer of offers) {
    for (const bedroomOptionId of offer.bedroomOptionIds) {
      if (!resolveExtraId(offer.name, offer.serviceId, bedroomOptionId)) {
        gaps.push({ extra: offer.name, serviceId: offer.serviceId, bedroomOptionId });
      }
    }
  }
  return gaps;
}

/* ------------------------------------------------------------------ *
 * Display layer: groups and benefit copy
 * ------------------------------------------------------------------ *
 * Categorising an assortment raises both perceived variety and choice
 * satisfaction (Mogilner, Rudnick & Iyengar, JCR 2008), so every applicable
 * add-on is shown at once, grouped. This is presentation only — the item list
 * always comes from `listExtrasFor`, never from these tables. Anything the
 * tables don't recognise still renders, under OTHER.
 */

export const EXTRA_GROUP_ORDER = [
  "KITCHEN",
  "DEEP CLEAN",
  "WINDOWS",
  "BASEMENT",
  "OUTDOOR & OTHER",
] as const;

export type ExtraGroup = (typeof EXTRA_GROUP_ORDER)[number];

const GROUP_PREFIXES: [ExtraGroup, string[]][] = [
  ["KITCHEN", ["inside oven", "inside fridge", "inside cabinets", "kitchenette"]],
  [
    "DEEP CLEAN",
    ["deep cleaning", "spot cleaning", "complete inside wall", "complete wall"],
  ],
  ["WINDOWS", ["inside windows", "wipe window blinds", "window blinds"]],
  ["BASEMENT", ["finished basement", "unfinished basement"]],
  ["OUTDOOR & OTHER", ["sweep", "de-cluttering", "decluttering"]],
];

/** The group a row belongs to; unmatched rows fall to OUTDOOR & OTHER. */
export function groupForExtra(name: string): ExtraGroup {
  const value = norm(name);
  for (const [group, prefixes] of GROUP_PREFIXES) {
    if (prefixes.some((prefix) => value.startsWith(prefix))) return group;
  }
  return "OUTDOOR & OTHER";
}

/** Plain-language benefit line under the name. Empty string = no second line. */
const BENEFIT_COPY: [string, string][] = [
  ["inside oven", "Baked-on grease and grime removed"],
  ["inside fridge", "Shelves and drawers emptied & wiped"],
  ["inside cabinets", "Inside shelves, kitchen & bathroom"],
  ["inside windows", "Interior glass, sills & tracks"],
  ["deep cleaning", "Our most thorough first-clean package"],
  ["wipe window blinds", "Dusted and wiped, per set"],
  ["spot cleaning", "Targeted marks & scuffs"],
  ["complete inside wall", "Every wall, top to bottom"],
  ["complete wall", "Every wall, top to bottom"],
  ["finished basement with kitchenette", "Includes kitchenette exterior"],
  ["finished basement", "Full clean of the finished space"],
  ["unfinished basement", "Sweep & tidy only"],
  ["de-cluttering", "A pro organizer, by the hour"],
  ["sweep only of garage", "Sweep-out only"],
  ["sweep of garage", "Sweep-out only"],
];

export function benefitForExtra(name: string): string {
  const value = norm(name);
  // Longest prefix wins, so "finished basement with kitchenette" beats
  // "finished basement".
  let best = "";
  let bestLength = -1;
  for (const [prefix, copy] of BENEFIT_COPY) {
    if (value.startsWith(prefix) && prefix.length > bestLength) {
      best = copy;
      bestLength = prefix.length;
    }
  }
  return best;
}

/** The shelf, split into ordered groups. Empty groups are dropped. */
export function groupExtras(
  extras: ResolvedExtra[]
): { group: ExtraGroup; items: ResolvedExtra[] }[] {
  return EXTRA_GROUP_ORDER.map((group) => ({
    group,
    items: extras.filter((extra) => groupForExtra(extra.name) === group),
  })).filter((entry) => entry.items.length > 0);
}

/**
 * BookingKoala stores some rows lowercase ("wipe window blinds (per set)").
 * Title-case them for display only — matching, mapping and the booking URL
 * always use the raw `extra.name`.
 */
const LOWERCASE_WORDS = new Set(["of", "or", "and", "per", "with", "the", "a", "to", "in", "on"]);

export function extraDisplayName(name: string): string {
  return name
    .split(" ")
    .map((word, index) => {
      if (/[A-Z]/.test(word)) return word;
      const bare = word.replace(/^\(/, "");
      if (index > 0 && LOWERCASE_WORDS.has(bare.toLowerCase())) return word;
      return word.replace(/^(\(?)([a-z])/, (_m, p, c) => p + c.toUpperCase());
    })
    .join(" ");
}
