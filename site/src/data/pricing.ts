/**
 * SINGLE SOURCE OF TRUTH for every price shown on this site.
 *
 * Nothing in this file invents a number. Every option, label and dollar
 * figure is read from `bk-config.json`, which is a captured snapshot of the
 * live BookingKoala booking form's own configuration
 * (https://dutycleaners.bookingkoala.com/booknow).
 *
 * If a price changes in BookingKoala, re-capture the snapshot — do not edit
 * numbers here. See `scripts/capture-bk-config.md`.
 */

import bkConfig from "./bk-config.json";
import { BK_PRICE_OVERRIDES, GST_RATE } from "./bk-price-overrides";
import { deepCleaningExtraFor } from "@/lib/booking-redirect";



/* ------------------------------------------------------------------ *
 * Snapshot access
 * ------------------------------------------------------------------ */

interface BkVariable {
  id: number;
  name: string;
  description?: string | null;
  price_ml: number | null;
  time_ml?: number | null;
  service_categories?: number[] | null;
  variable_category?: number | null;
  status?: number | null;
  display_order?: number | null;
}

interface BkExtra {
  id: number;
  name: string;
  description?: string | null;
  tooltip_text?: string | null;
  prices_ml?: number[] | null;
  service_categories?: number[] | null;
  variables?: number[] | null;
  exempt_extra_from_freq_disc?: boolean | null;
  apply_to_bookings?: string | null;
  status?: number | null;
}

interface BkFrequency {
  id: number;
  name: string;
  repeat_every?: string | null;
  occurence_time?: string | null;
  discount: number | null;
  discount_type?: string | null;
  discount_on?: string | null;
  display_order?: number | null;
  status?: number | null;
}

interface BkIndustry {
  id: number;
  name: string;
  slug: string;
  services: { id: number; name: string; description?: string | null }[];
  frequencies: BkFrequency[];
  pricing_parameters: { id: number; name: string; value: BkVariable[] }[];
  extras: BkExtra[];
}

const INDUSTRIES = bkConfig.industries as unknown as BkIndustry[];

const industry = (id: number) =>
  INDUSTRIES.find((entry) => entry.id === id) ?? INDUSTRIES[0];

/** Every variable of an industry, flattened, live only. */
const variablesOf = (industryId: number) =>
  industry(industryId)
    .pricing_parameters.flatMap((parameter) => parameter.value)
    .filter((variable) => variable.status !== 0);

/** Variables in one BK "variable category", limited to one service. */
const variablesIn = (industryId: number, categoryId: number, serviceCategoryId?: number) =>
  variablesOf(industryId).filter(
    (variable) =>
      variable.variable_category === categoryId &&
      (serviceCategoryId === undefined ||
        (variable.service_categories ?? []).includes(serviceCategoryId))
  );

/** Pulls the leading count out of a BK label ("3 Bedrooms (Under 1700sqft)"). */
const leadingCount = (label: string) => {
  const match = label.trim().match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
};

/* ------------------------------------------------------------------ *
 * Services
 * ------------------------------------------------------------------ */

export type ServiceId =
  | "standard"
  | "move-in-out"
  | "post-construction"
  | "airbnb"
  | "commercial";

/** How a service is priced in BookingKoala. */
type PricingModel = "home" | "sqft-tier" | "hourly" | "sqft-rate";

interface ServiceSource {
  industryId: number;
  serviceCategoryId: number;
  model: PricingModel;
  /** BK variable-category ids for the home-size questions. */
  homeTypeCategory?: number;
  bedroomCategory?: number;
  bathroomCategory?: number;
  halfBathCategory?: number;
  /** For sqft-tier / rate models. */
  tierCategory?: number;
  hourlyRate?: number;
}

export interface ServicePricing {
  id: ServiceId;
  label: string;
  /** One-line description used on cards and in the quote flow. */
  blurb: string;
  inclusions: string[];
  /** Typical on-site hours, shown beside the price. */
  hours: string;
  /** False when an exact online price is not honest for this service. */
  exactPricing: boolean;
  /** Range spread applied when exactPricing is false (±%). */
  estimateSpread?: number;
  /** True when no online figure is honest at all (site visit required). */
  quoteOnly?: boolean;
  /** Note explaining how the price is really set, shown with estimates. */
  rateNote?: string;
  /** Whether recurring frequencies apply to this service. */
  supportsRecurring: boolean;
  /** Whether this service asks the home-size questions. */
  asksHomeSize: boolean;
  /**
   * False for services we price manually (hourly / per-site). They are never
   * selectable in the funnel — visitors are routed to a callback instead, so
   * nobody can self-declare into an hourly rate and under-book the job.
   */
  selfServe: boolean;
  mostPopular?: boolean;
  source: ServiceSource;
}

export const SERVICES: ServicePricing[] = [
  {
    id: "standard",
    label: "Standard Cleaning",
    blurb: "Regular upkeep for a home that is already in good shape.",
    inclusions: [
      "Kitchen surfaces, exterior of appliances, sink",
      "Bathrooms: toilet, tub/shower, mirrors, floors",
      "Dusting reachable surfaces throughout",
      "Vacuum and mop all floors",
      "Trash removed to your bins",
    ],
    hours: "2–4 hrs",
    exactPricing: true,
    supportsRecurring: true,
    asksHomeSize: true,
    selfServe: true,
    mostPopular: true,
    source: {
      industryId: 1,
      serviceCategoryId: 6,
      model: "home",
      homeTypeCategory: 9,
      bedroomCategory: 1,
      bathroomCategory: 2,
      halfBathCategory: 8,
    },
  },
  {
    id: "move-in-out",
    label: "Move In / Move Out",
    blurb: "Handover-day clean for damage deposits, listings and new keys.",
    inclusions: [
      "Inside all cabinets, drawers and closets",
      "Inside oven and fridge",
      "Window tracks and reachable interior glass",
      "Walls spot-cleaned, marks removed where possible",
    ],
    hours: "5–8 hrs",
    exactPricing: true,
    supportsRecurring: false,
    asksHomeSize: true,
    selfServe: true,
    source: {
      industryId: 1,
      serviceCategoryId: 2,
      model: "home",
      homeTypeCategory: 9,
      bedroomCategory: 5,
      bathroomCategory: 6,
      halfBathCategory: 7,
    },
  },
  {
    id: "post-construction",
    label: "Post-Construction",
    blurb: "Final clean after a renovation or new build, priced by square footage.",
    inclusions: [
      "Fine construction dust removed from all surfaces",
      "Kitchen and bathroom detail clean",
      "Floors vacuumed and washed",
      "Light debris removed (heavy debris excluded)",
    ],
    hours: "6–10 hrs",
    exactPricing: false,
    estimateSpread: 0.1,
    rateNote: "Priced by square footage — confirmed once we know the exact size.",
    supportsRecurring: false,
    asksHomeSize: true,
    selfServe: true,
    source: {
      industryId: 27,
      serviceCategoryId: 15,
      model: "sqft-tier",
      tierCategory: 12,
    },
  },
  {
    id: "airbnb",
    label: "Airbnb Turnover",
    blurb: "Fast, reliable turnovers between guests, charged by the hour.",
    inclusions: [
      "Full reset of every room between stays",
      "Beds stripped and remade with your linen",
      "Kitchen and bathrooms sanitised",
      "Restocking of supplies you leave on site",
    ],
    hours: "2–4 hrs",
    exactPricing: false,
    estimateSpread: 0.2,
    // $60, confirmed by the owner 2026-09-03. It was hand-typed at $65 while
    // BookingKoala's only hourly service is named "$60 Per Hour/ Per Cleaner";
    // the booking system was right. Every figure on the Airbnb pages derives
    // from HOURLY_RATE, so this is the only place it is written.
    rateNote: "Hourly service at $60 per hour, per cleaner.",
    supportsRecurring: false,
    asksHomeSize: true,
    selfServe: false,
    source: { industryId: 28, serviceCategoryId: 16, model: "hourly", hourlyRate: 60 },
  },
  {
    id: "commercial",
    label: "Commercial / Office",
    blurb: "Offices, clinics and common areas on a schedule that suits you.",
    inclusions: [
      "Desks, common areas and touchpoints disinfected",
      "Washrooms and breakroom cleaned and restocked",
      "Floors vacuumed and mopped",
      "Waste and recycling removed",
    ],
    hours: "Varies by site",
    exactPricing: false,
    quoteOnly: true,
    // Confirmed by the owner 2026-09-03: per square foot. The commercial pages
    // used to argue for hourly pricing against this record; they now agree.
    rateNote: "Charged by square footage — we confirm the rate after a quick walkthrough.",
    // Priced per site, so BookingKoala's recurring discounts do not apply here.
    supportsRecurring: false,

    asksHomeSize: false,
    selfServe: false,
    source: { industryId: 17, serviceCategoryId: 8, model: "sqft-rate" },
  },
];

/** Services a visitor can pick and price themselves. */
export const SELECTABLE_SERVICES = SERVICES.filter((service) => service.selfServe);

export const getService = (id: ServiceId) =>
  SERVICES.find((service) => service.id === id) ?? SERVICES[0];

/** Maps legacy `?service=` slugs onto the real BookingKoala services. */
export const resolveServiceId = (slug?: string | null): ServiceId => {
  if (!slug) return "standard";
  const value = slug.toLowerCase();
  if (SELECTABLE_SERVICES.some((service) => service.id === value)) return value as ServiceId;
  if (value.includes("move")) return "move-in-out";
  if (value.includes("construction")) return "post-construction";
  // Airbnb turnovers and commercial sites are quoted manually, so their
  // legacy slugs open the standard flow rather than an hourly self-quote.
  if (value.includes("airbnb")) return "standard";
  if (value.includes("office") || value.includes("commercial")) return "standard";
  // "deep-cleaning" is not a BookingKoala service — it is an extras package
  // on top of a standard clean, so the funnel opens on standard.
  return "standard";
};

/* ------------------------------------------------------------------ *
 * Options (all read from the snapshot)
 * ------------------------------------------------------------------ */

export interface Option {
  /** BK variable id — used for extras targeting. */
  id: number;
  /** Numeric answer (bedrooms, baths…). */
  value: number;
  label: string;
  price: number;
}

/**
 * Prices and labels come from the verified admin capture whenever BK's
 * variable id is present there; the snapshot only supplies the structure.
 */
const toOptions = (variables: BkVariable[]): Option[] =>
  variables
    .map((variable) => {
      const override = BK_PRICE_OVERRIDES[variable.id];
      return {
        id: variable.id,
        value: leadingCount(variable.name),
        label: (override?.label ?? variable.name).trim(),
        price: override ? override.price : variable.price_ml ?? 0,
      };
    })
    .sort((a, b) => a.value - b.value);

// Fails loudly rather than quoting a stale snapshot number.
if (import.meta.env?.DEV) {
  const HOME_CATEGORIES = [9, 1, 2, 8, 5, 6, 7];
  const missing = variablesOf(1)
    .filter(
      (variable) =>
        HOME_CATEGORIES.includes(variable.variable_category ?? -1) &&
        !BK_PRICE_OVERRIDES[variable.id] &&
        !/click here/i.test(variable.name)
    )
    .map((variable) => `${variable.id} ${variable.name}`);
  if (missing.length > 0) {
    console.warn(
      "[pricing] BookingKoala options without a verified price override:",
      missing
    );
  }
}


/** Home type is shared by both home-cleaning services. */
export const homeTypeOptions = (id: ServiceId): Option[] => {
  const { source } = getService(id);
  if (!source.homeTypeCategory) return [];
  return toOptions(
    variablesIn(source.industryId, source.homeTypeCategory, source.serviceCategoryId)
      // The first entry is BookingKoala's "Click Here and Select…" placeholder.
      .filter((variable) => !/click here/i.test(variable.name))
  ).sort((a, b) => a.price - b.price);
};

export const bedroomOptions = (id: ServiceId): Option[] => {
  const { source } = getService(id);
  if (source.model === "sqft-tier" || source.model === "hourly") {
    // Sized off the standard-clean ladder so the labels keep BK's sqft wording.
    return toOptions(variablesIn(1, 1, 6));
  }
  if (!source.bedroomCategory) return [];
  return toOptions(variablesIn(source.industryId, source.bedroomCategory, source.serviceCategoryId));
};

export const bathroomOptions = (id: ServiceId): Option[] => {
  const { source } = getService(id);
  if (!source.bathroomCategory) return [];
  return toOptions(variablesIn(source.industryId, source.bathroomCategory, source.serviceCategoryId));
};

export const halfBathOptions = (id: ServiceId): Option[] => {
  const { source } = getService(id);
  if (!source.halfBathCategory) return [];
  const options = toOptions(
    variablesIn(source.industryId, source.halfBathCategory, source.serviceCategoryId)
  );
  return options.some((option) => option.value === 0)
    ? options
    : [{ id: -1, value: 0, label: "0 Half Baths", price: 0 }, ...options];
};

/** Square-footage tiers, used by post-construction. */
export const sqftTierOptions = (id: ServiceId): Option[] => {
  const { source } = getService(id);
  if (source.model !== "sqft-tier") return [];
  return variablesOf(source.industryId)
    .filter((variable) => (variable.price_ml ?? 0) > 0)
    .map((variable, index) => ({
      id: variable.id,
      value: index,
      label: variable.name.trim(),
      price: variable.price_ml ?? 0,
    }));
};

/* ------------------------------------------------------------------ *
 * Add-ons (BookingKoala "extras", tiered by home size)
 * ------------------------------------------------------------------ */

export interface AddOn {
  /** Stable key across size tiers, so a selection survives a size change. */
  id: string;
  /** BK extra id for the currently selected size. */
  bkId: number;
  label: string;
  price: number;
  note?: string;
  /** Charged on the first visit only — never on recurring visits. */
  firstVisitOnly: boolean;
  /** Excluded from the recurring discount. */
  exemptFromDiscount: boolean;
}

const addOnKey = (name: string) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/**
 * BookingKoala prices most extras differently per home size, storing one
 * extra row per tier with a `variables` list of the sizes it applies to.
 * We surface exactly the row that matches the selected bedroom variable.
 */
export const addOnsFor = (id: ServiceId, bedroomVariableId: number | null): AddOn[] => {
  const { source } = getService(id);
  const extras = industry(source.industryId).extras.filter(
    (extra) =>
      extra.status !== 0 &&
      (extra.service_categories ?? []).includes(source.serviceCategoryId) &&
      (extra.prices_ml?.[0] ?? 0) > 0
  );

  const byKey = new Map<string, AddOn>();

  extras.forEach((extra) => {
    const targets = extra.variables ?? [];
    const matchesSize =
      bedroomVariableId === null || targets.length === 0 || targets.includes(bedroomVariableId);
    if (!matchesSize) return;

    const key = addOnKey(extra.name);
    // First match wins; BK lists exactly one row per size tier.
    if (byKey.has(key)) return;

    byKey.set(key, {
      id: key,
      bkId: extra.id,
      label: extra.name.trim(),
      price: extra.prices_ml?.[0] ?? 0,
      note: extra.description?.trim() || undefined,
      firstVisitOnly: extra.apply_to_bookings === "first-only",
      exemptFromDiscount: Boolean(extra.exempt_extra_from_freq_disc),
    });
  });

  return [...byKey.values()];
};

/* ------------------------------------------------------------------ *
 * Frequencies
 * ------------------------------------------------------------------ */

export type FrequencyId = string;

export interface Frequency {
  id: FrequencyId;
  bkId: number;
  label: string;
  /** Fraction, e.g. 0.15 — straight from BookingKoala. */
  discount: number;
  mostPopular?: boolean;
}

/** BK's customer-facing home-cleaning frequencies, in display order. */
const HOME_FREQUENCY_IDS = [1, 2, 4, 3];

export const FREQUENCIES: Frequency[] = HOME_FREQUENCY_IDS.map((bkId) => {
  const source = industry(1).frequencies.find((frequency) => frequency.id === bkId);
  const percentage = source?.discount_type === "percentage" ? source.discount ?? 0 : 0;
  return {
    id: addOnKey(source?.name ?? String(bkId)),
    bkId,
    label: (source?.name ?? "").replace(/\s*\(Every 2 Weeks\)/i, "").trim() || String(bkId),
    discount: percentage / 100,
    mostPopular: bkId === 4,
  };
})
  .filter((frequency) => frequency.label.length > 0)
  .sort((a, b) => a.discount - b.discount);

/**
 * The funnel opens on the most-chosen plan (Bi-Weekly, the one carrying the
 * "Popular" badge) so the badge and the default agree. One-Time is always one
 * tap away and every chip prints its own discount.
 */
export const DEFAULT_FREQUENCY: FrequencyId =
  FREQUENCIES.find((frequency) => frequency.mostPopular)?.id ??
  FREQUENCIES.find((frequency) => frequency.discount === 0)?.id ??
  FREQUENCIES[0].id;


export const getFrequency = (id: FrequencyId) =>
  FREQUENCIES.find((frequency) => frequency.id === id) ?? FREQUENCIES[0];

/* ------------------------------------------------------------------ *
 * Quote calculation — mirrors BookingKoala's own maths
 * ------------------------------------------------------------------ */

export interface QuoteInput {
  service: ServiceId;
  /** BK home-type variable id. */
  homeType: number | null;
  bedrooms: number;
  bathrooms: number;
  halfBaths: number;
  addOns: string[];
  frequency: FrequencyId;
}

export interface QuoteResult {
  /** Price of the first visit — BK applies recurring discounts from visit two. */
  firstClean: number;
  /** Per-visit price once a recurring plan is running. */
  ongoing: number | null;
  /** Dollars saved per ongoing visit versus the first clean. */
  savings: number;
  discountPct: number;
  /** True when this service can only be honestly estimated. */
  isEstimate: boolean;
  /** True when no online figure is honest at all. */
  quoteOnly: boolean;
  rangeLow: number;
  rangeHigh: number;
  hours: string;
  rateNote?: string;
  /** BK variable id of the selected bedroom option (drives extras tiers). */
  bedroomVariableId: number | null;
}

const money = (value: number) => Math.round(value * 100) / 100;

const priceFor = (options: Option[], value: number) =>
  options.find((option) => option.value === value)?.price ?? 0;

export function calculateQuote(input: QuoteInput): QuoteResult {
  const service = getService(input.service);
  const frequency = getFrequency(input.frequency);
  const beds = bedroomOptions(input.service);
  const bedroomVariableId =
    beds.find((option) => option.value === input.bedrooms)?.id ?? beds[0]?.id ?? null;

  let base = 0;

  if (service.source.model === "home") {
    const homeTypes = homeTypeOptions(input.service);
    const homeTypePrice =
      homeTypes.find((option) => option.id === input.homeType)?.price ?? 0;
    base =
      homeTypePrice +
      priceFor(beds, input.bedrooms) +
      priceFor(bathroomOptions(input.service), input.bathrooms) +
      priceFor(halfBathOptions(input.service), input.halfBaths);
  } else if (service.source.model === "sqft-tier") {
    // Bedrooms map onto BK's square-footage ladder, in the same order.
    const tiers = sqftTierOptions(input.service);
    const index = Math.min(Math.max(input.bedrooms - 1, 0), tiers.length - 1);
    base = tiers[index]?.price ?? 0;
  } else if (service.source.model === "hourly") {
    // BK bills the standard-clean job length at the hourly rate.
    const standardVariables = variablesIn(1, 1, 6);
    const seconds =
      standardVariables.find((variable) => leadingCount(variable.name) === input.bedrooms)
        ?.time_ml ?? 7200;
    base = (seconds / 3600) * (service.source.hourlyRate ?? 65);
  }

  const availableAddOns = addOnsFor(input.service, bedroomVariableId);
  const chosen = availableAddOns.filter((addOn) => input.addOns.includes(addOn.id));
  const addOnTotal = chosen.reduce((total, addOn) => total + addOn.price, 0);

  // BookingKoala's verified formula:
  //   subtotal = bedrooms + full baths + half baths + home type + extras
  //   recurring = subtotal x (1 - frequency discount)
  const subtotal = base + addOnTotal;
  const firstClean = money(subtotal);

  const recurring = service.supportsRecurring && frequency.discount > 0;
  const ongoing = recurring ? money(subtotal * (1 - frequency.discount)) : null;


  const spread = service.estimateSpread ?? 0;

  return {
    firstClean,
    ongoing,
    savings: ongoing !== null ? money(firstClean - ongoing) : 0,
    discountPct: recurring ? Math.round(frequency.discount * 100) : 0,
    isEstimate: !service.exactPricing,
    quoteOnly: Boolean(service.quoteOnly),
    rangeLow: money(firstClean * (1 - spread)),
    rangeHigh: money(firstClean * (1 + spread)),
    hours: service.hours,
    rateNote: service.rateNote,
    bedroomVariableId,
  };
}

/** Cheapest honest anchor for a service card ("from $X"). */
export const startingPrice = (id: ServiceId) => {
  const service = getService(id);
  const beds = bedroomOptions(id);
  const smallest = beds[0];
  if (service.source.model === "sqft-tier") return sqftTierOptions(id)[0]?.price ?? 0;
  if (service.source.model === "hourly") return service.source.hourlyRate ?? 0;
  if (!smallest) return 0;
  const baths = bathroomOptions(id)[0]?.price ?? 0;
  return money(smallest.price + baths);
};

/**
 * Hourly rate BookingKoala charges per cleaner. Read from the hourly service
 * row so marketing pages can never advertise a rate the booking form
 * disagrees with.
 */
export const HOURLY_RATE = getService("airbnb").source.hourlyRate ?? 0;

/** Cheapest flat-rate home clean we publish ("Starting at $X"). */
export const flatRateFromPrice = () => startingPrice("standard");

/**
 * Lowest published price for an add-on across every home-size tier. BK stores
 * one extra row per size, so a single lookup would quote whichever tier
 * happened to be listed first — this walks them all and returns the honest
 * "from" figure.
 */
export const addOnFromPrice = (id: ServiceId, key: string): number | null => {
  const sizes = bedroomOptions(id).map((option) => option.id);
  const prices = [null, ...sizes]
    .flatMap((size) => addOnsFor(id, size))
    .filter((addOn) => addOn.id === key)
    .map((addOn) => addOn.price);
  return prices.length ? Math.min(...prices) : null;
};

/** Highest published price for an add-on across every home-size tier. */
export const addOnMaxPrice = (id: ServiceId, key: string): number | null => {
  const sizes = bedroomOptions(id).map((option) => option.id);
  const prices = [null, ...sizes]
    .flatMap((size) => addOnsFor(id, size))
    .filter((addOn) => addOn.id === key)
    .map((addOn) => addOn.price);
  return prices.length ? Math.max(...prices) : null;
};

/** Every quoted figure is before tax; BookingKoala adds 5% GST on top. */
export { GST_RATE };
export const withGst = (value: number) => Math.round(value * (1 + GST_RATE) * 100) / 100;


export const formatPrice = (value: number) =>
  `$${value.toLocaleString("en-CA", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;


/* ------------------------------------------------------------------ *
 * Deep Cleaning — a BookingKoala extras package, never a service
 * ------------------------------------------------------------------ */

/** BookingKoala's own key for the Deep Cleaning package row. */
export const DEEP_CLEAN_ADDON_ID = "deep-cleaning";

/**
 * Exact Deep Cleaning package price for a home size. Read from the same
 * bedrooms → extra map the booking URL uses, so the quoted figure and the
 * ticked BookingKoala tile can never disagree. (A positional read of the
 * sorted tier list quotes the unreachable $199.99 entry for 6 bedrooms.)
 */
export const deepCleanPackagePrice = (bedrooms: number): number | null =>
  deepCleaningExtraFor(bedrooms)?.price ?? null;

/** Lowest package tier — the honest "from $X" anchor. */
export const deepCleanFromPrice = () => deepCleanPackagePrice(bedroomOptions("standard")[0]?.value ?? 1);


/**
 * The home sizes the pricing tables advertise, with the bath counts those
 * published figures have always assumed. Keeping them here means the Standard
 * and Deep Cleaning tables are computed from bk-config with identical
 * assumptions, so the two can never drift apart.
 */
export interface PricingTier {
  beds: number;
  label: string;
  bathrooms: number;
  halfBaths: number;
}

export const PRICING_TIERS: PricingTier[] = [
  { beds: 1, label: "1 Bedroom", bathrooms: 1, halfBaths: 0 },
  { beds: 2, label: "2 Bedroom", bathrooms: 2, halfBaths: 0 },
  { beds: 3, label: "3 Bedroom", bathrooms: 2, halfBaths: 1 },
  { beds: 4, label: "4 Bedroom", bathrooms: 3, halfBaths: 1 },
  { beds: 5, label: "5+ Bedroom", bathrooms: 3, halfBaths: 1 },
];

const tierStandardPrice = (tier: PricingTier) =>
  calculateQuote({
    service: "standard",
    homeType: homeTypeOptions("standard")[0]?.id ?? null,
    bedrooms: tier.beds,
    bathrooms: tier.bathrooms,
    halfBaths: tier.halfBaths,
    addOns: [],
    frequency: "one-time",
  }).firstClean;

const displayPrice = (value: number) => `$${Math.round(value)}`;

/**
 * A deep clean is a Standard clean plus the Deep Cleaning package — both halves
 * derived from bk-config, never hand-typed.
 */
export const deepCleanTierRows = () =>
  PRICING_TIERS.map((tier) => {
    const standard = tierStandardPrice(tier);
    const packagePrice = deepCleanPackagePrice(tier.beds) ?? 0;
    return {
      beds: tier.label,
      standard: displayPrice(standard),
      packagePrice: displayPrice(packagePrice),
      price: displayPrice(money(standard + packagePrice)),
    };
  });

/**
 * Published table rows for any home-priced service (Standard, Move In/Out),
 * computed from bk-config with the same bath assumptions as `PRICING_TIERS`.
 * Pages must render these instead of hand-typed figures so a re-captured
 * snapshot updates every table at once.
 */
export const serviceTierRows = (id: ServiceId) =>
  PRICING_TIERS.map((tier) => ({
    beds: tier.label,
    price: displayPrice(
      calculateQuote({
        service: id,
        homeType: homeTypeOptions(id)[0]?.id ?? null,
        bedrooms: tier.beds,
        bathrooms: tier.bathrooms,
        halfBaths: tier.halfBaths,
        addOns: [],
        frequency: "one-time",
      }).firstClean,
    ),
  }));

export const standardTierRows = () => serviceTierRows("standard");
export const moveInOutTierRows = () => serviceTierRows("move-in-out");

/**
 * The add-on shelf published on the service detail pages.
 *
 * These used to be hand-typed on six pages and had drifted badly: interior
 * window cleaning was listed at a flat $64.99 when bk-config prices it from
 * $39.99 to $179.99 by home size, spot wall cleaning was $20 over, and
 * "Baseboards (2 rooms min) — $105" was not a bookable row at all (baseboards
 * are part of the Deep Cleaning package). Names live here; every figure is
 * read from bk-config.
 *
 * Several rows scale with home size, so a single number would be wrong at both
 * ends of the range. Those are published as "from $X" using the smallest home,
 * which is what the customer is comparing against when they read a starting
 * price. Flat rows print bare.
 */
const FEATURED_EXTRAS: { id: string; name: string; suffix?: string }[] = [
  { id: "inside-fridge", name: "Inside fridge cleaning" },
  { id: "inside-oven", name: "Inside oven cleaning" },
  { id: "inside-cabinets-kitchen-bathroom-only", name: "Inside cabinets (empty)" },
  { id: "inside-windows", name: "Interior window cleaning" },
  { id: "spot-cleaning-inside-walls", name: "Spot wall cleaning" },
  { id: "wipe-window-blinds-per-set", name: "Wipe window blinds", suffix: "/set" },
  { id: "sweep-only-of-garage-or-balcony", name: "Balcony/garage sweeping" },
];

export const featuredExtraRows = (): { name: string; price: string }[] => {
  const rows: { name: string; price: string }[] = [];
  for (const entry of FEATURED_EXTRAS) {
    // Price the row at every published home size; a row that quotes the same
    // figure across all of them is genuinely flat.
    const prices: number[] = [];
    for (const tier of PRICING_TIERS) {
      const bedroomId = bedroomOptions("standard").find((b) => b.value === tier.beds)?.id ?? null;
      const found = addOnsFor("standard", bedroomId).find((a) => a.id === entry.id);
      if (found) prices.push(found.price);
    }
    // A row bk-config no longer carries is dropped rather than published at a
    // stale price — an unbookable line item is worse than a missing one.
    if (prices.length === 0) continue;

    const min = Math.min(...prices);
    const flat = prices.every((p) => p === min);
    const money = `$${min.toFixed(2).replace(/\.00$/, "")}${entry.suffix ?? ""}`;
    rows.push({ name: entry.name, price: flat ? money : `from ${money}` });
  }
  return rows;
};
