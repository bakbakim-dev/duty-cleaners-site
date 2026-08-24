/**
 * BookingKoala handoff.
 *
 * Step 3 of the funnel ends on BookingKoala's own booking page with every
 * selection preselected, so the visitor never re-enters what they just told
 * us. This module is the single place that knows the booking host and the
 * BookingKoala option IDs — nothing else may hard-code either.
 *
 * Category and option IDs differ per service. If a value has no mapping the
 * parameter is omitted entirely: a wrong-category ID is worse than none.
 */

import {
  DEEP_CLEANING_EXTRA_NAME,
  FEATURED_EXTRA_PREFIXES,
  PETS_EXTRA_NAME,
  findCoverageGaps,
  listExtrasFor,
  petsExtraFor,
  resolveExtra,
  travelFeeExtraFor,
  type CoverageGap,
  type ResolvedExtra,
} from "@/lib/bk-extras";

export {
  resolveExtra,
  resolveExtraId,
  findCoverageGaps,
  listExtrasFor,
  petsExtraFor,
  travelFeeExtraFor,
  FEATURED_COUNT,
  groupExtras,
  groupForExtra,
  benefitForExtra,
  extraDisplayName,
  EXTRA_GROUP_ORDER,
} from "@/lib/bk-extras";
export type { ResolvedExtra } from "@/lib/bk-extras";



/** Swap this one constant when book.dutycleaners.ca goes live. */
export const BOOKING_ORIGIN = "https://dutycleaners.bookingkoala.com";

/**
 * "redirect" sends the visitor to BookingKoala; "embed" keeps them on our
 * /book page with the BK form in an iframe. Flip to "embed" ONLY once
 * BOOKING_ORIGIN is the same-site book.dutycleaners.ca — a cross-site iframe
 * makes in-frame customer login flaky. Rollback = set this back to "redirect".
 */
export const BOOKING_MODE: "redirect" | "embed" = "redirect";


/** BookingKoala service ids, keyed by our own service id. */
const SERVICE_IDS: Record<string, number> = {
  standard: 6,
  "move-in-out": 2,
};

/** BookingKoala booknow frequency ids, keyed by the bk-config frequency id. */
const FREQUENCY_IDS: Record<number, number> = {
  1: 1, // One-Time
  2: 3, // Weekly
  4: 4, // Bi-Weekly
  3: 64, // Every 4 Weeks
};

/**
 * BookingKoala models the Deep Cleaning package as a SEPARATE extra per home
 * size — each id is only valid for its bedroom tier, and BK silently ignores
 * an id sent for the wrong size. Both the id and the price are therefore
 * resolved out of bk-config by (name + service category + bedroom option id):
 * see `src/lib/bk-extras.ts`. No extra id is hard-coded anywhere.
 */
export const deepCleaningExtraFor = (bedrooms: number): ResolvedExtra | null => {
  const bedroomOptionId = STANDARD_PARAMS.bedrooms[1][bedrooms];
  if (!bedroomOptionId) return null;
  return resolveExtra(DEEP_CLEANING_EXTRA_NAME, SERVICE_IDS.standard, bedroomOptionId);
};

/** BookingKoala's service id for one of our own service ids. */
export const bkServiceIdFor = (service: string): number | null =>
  SERVICE_IDS[service] ?? null;

/** The bedroom option id BookingKoala uses for a service + bedroom count. */
export const bedroomOptionIdFor = (service: string, bedrooms: number): number | null =>
  PARAMS_BY_SERVICE[service]?.bedrooms[1][bedrooms] ?? null;

/**
 * The full add-on shelf for a service + home size + home type: exactly the
 * rows BookingKoala itself would show, at the prices it would charge. Home
 * type matters — BK gates basement rows on it, so a condo must not be offered
 * a "Finished Basement" add-on it can never book.
 */
export const shelfExtrasFor = (
  service: string,
  bedrooms: number,
  homeTypeId?: number | null
): ResolvedExtra[] => {
  const serviceId = SERVICE_IDS[service];
  if (!serviceId) return [];
  return listExtrasFor(serviceId, [bedroomOptionIdFor(service, bedrooms), homeTypeId ?? null]);
};

/** The pets question's extra for a service + home size. */
export const petsExtraForSelection = (
  service: string,
  bedrooms: number,
  homeTypeId?: number | null
): ResolvedExtra | null => {
  const serviceId = SERVICE_IDS[service];
  if (!serviceId) return null;
  return petsExtraFor(serviceId, [bedroomOptionIdFor(service, bedrooms), homeTypeId ?? null]);
};

/** The travel-fee checkbox's extra for a service + home size. */
export const travelFeeExtraForSelection = (
  service: string,
  bedrooms: number,
  homeTypeId?: number | null
): ResolvedExtra | null => {
  const serviceId = SERVICE_IDS[service];
  if (!serviceId) return null;
  return travelFeeExtraFor(serviceId, [
    bedroomOptionIdFor(service, bedrooms),
    homeTypeId ?? null,
  ]);
};





/** pricing_parameter[9] — shared by both services. */
const HOME_TYPE_IDS: Record<number, number> = {
  90: 90, // Two Storey House (Main + Upper Floor)
  89: 89, // Two Storey Townhouse (Duplex)
  54: 54, // Bungalow (Single Storey Home)
  56: 56, // Basement Suite Only
  55: 55, // Apartment or Condo
};

interface ParamGroup {
  /** pricing_parameter category index → value → BookingKoala option id. */
  bedrooms: [number, Record<number, number>];
  bathrooms: [number, Record<number, number>];
  halfBaths: [number, Record<number, number>];
}

const STANDARD_PARAMS: ParamGroup = {
  bedrooms: [1, { 1: 87, 2: 81, 3: 82, 4: 83, 5: 84, 6: 85, 7: 86 }],
  bathrooms: [2, { 1: 88, 2: 9, 3: 11, 4: 13, 5: 15, 6: 17, 7: 19 }],
  halfBaths: [8, { 0: 51, 1: 8, 2: 10, 3: 12, 4: 16 }],
};

const MOVE_PARAMS: ParamGroup = {
  bedrooms: [5, { 1: 74, 2: 75, 3: 76, 4: 77, 5: 78, 6: 79, 7: 80 }],
  // No 7-bathroom option exists for Move In/Out — omitted when selected.
  bathrooms: [6, { 1: 39, 2: 40, 3: 41, 4: 42, 5: 43, 6: 44 }],
  halfBaths: [7, { 0: 58, 1: 45, 2: 46, 3: 47, 4: 48 }],
};

const PARAMS_BY_SERVICE: Record<string, ParamGroup> = {
  standard: STANDARD_PARAMS,
  "move-in-out": MOVE_PARAMS,
};

/** Hard cap on the free-text note, matched by the funnel's textarea. */
export const DC_NOTES_MAX = 500;

export type DcEntry = "home" | "mailbox" | "code" | "other";
export type DcParking = "street" | "visitor" | "driveway" | "paid";

/** "t5j0n3" → "T5J 0N3"; anything that isn't a full Canadian code → null. */
export function normalizePostalCode(input: string | undefined | null): string | null {
  const raw = (input ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(raw)) return null;
  return `${raw.slice(0, 3)} ${raw.slice(3)}`;
}

/** Forward sortation areas we service without a travel fee. */
const IN_CITY_PREFIXES = ["T5", "T6", "T2", "T3"];

/** Which city an in-city prefix belongs to, for the confirmation line. */
const CITY_BY_PREFIX: Record<string, string> = {
  T5: "Edmonton",
  T6: "Edmonton",
  T2: "Calgary",
  T3: "Calgary",
};

/**
 * Whether an address is inside Edmonton/Calgary city limits, judged by the
 * postal code alone. "unknown" means we couldn't tell and the funnel should
 * fall back to asking.
 */
export function postalCodeCityStatus(
  input: string | undefined | null
): "inside" | "outside" | "unknown" {
  const normalized = normalizePostalCode(input);
  if (!normalized) return "unknown";
  return IN_CITY_PREFIXES.includes(normalized.slice(0, 2)) ? "inside" : "outside";
}

/** "T5J 0N3" → "Edmonton"; null when the code isn't an in-city one. */
export function postalCodeCityName(input: string | undefined | null): string | null {
  const normalized = normalizePostalCode(input);
  if (!normalized) return null;
  return CITY_BY_PREFIX[normalized.slice(0, 2)] ?? null;
}

/** Optional booking-page answers collected on step 3. */
export interface CleanerDetails {
  entry?: DcEntry | null;
  /** 1 (almost spotless) … 5 (very dirty). */
  cleanliness?: number | null;
  parking?: DcParking | null;
  notes?: string | null;
  /** Canadian postal code; also decides the travel fee. */
  postalCode?: string | null;
}


export interface BookingUrlInput {
  /** Our own service id, e.g. "standard" or "move-in-out". */
  service: string;
  /** BookingKoala home-type id, or null when the service doesn't ask. */
  homeType: number | null;
  bedrooms: number;
  bathrooms: number;
  halfBaths: number;
  /** The bk-config frequency id (1 One-Time, 2 Weekly, 4 Bi-Weekly, 3 Every 4 Weeks). */
  frequencyBkId: number;
  /** Deep-clean intent — preselects the Deep Cleaning extras package. */
  deepClean?: boolean;
  /**
   * The add-on basket, by BookingKoala extra name → quantity. Names (not ids)
   * because the id is size-specific and is resolved here, at build time, from
   * the same config row whose price the customer was shown.
   */
  extras?: Record<string, number>;
  /**
   * Optional "details for your cleaner" answers. Only answered fields are
   * sent; a BookingKoala-side script reads dc_* and pre-fills the matching
   * booking-page questions. No preferred date is ever sent — the booking page
   * owns real crew availability.
   */
  cleanerDetails?: CleanerDetails;
  /** Campaign coupon code, passed straight through to BookingKoala. */
  coupon?: string | null;
  contact?: { name?: string; email?: string; phone?: string };

}


/** "Jane Van Der Berg" → first "Jane", last "Van Der Berg". */
export function splitName(fullName: string): { first: string; last: string } {
  const trimmed = (fullName ?? "").trim().replace(/\s+/g, " ");
  if (!trimmed) return { first: "", last: "" };
  const gap = trimmed.indexOf(" ");
  if (gap === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, gap), last: trimmed.slice(gap + 1) };
}

/**
 * BookingKoala's phone field is a 10-digit mask: it renders the first ten
 * characters it receives. An autofilled "+1 780 555 0199" would otherwise
 * arrive as 11 digits and be saved as a wrong number. So: drop a country-code
 * 1, and send nothing at all unless exactly ten digits remain — an empty field
 * is recoverable, a corrupted number is not.
 *
 * This is the booking-URL rule only. The CRM payload keeps E.164 (+1…).
 */
export function normalizeBookingPhone(input: string | undefined | null): string | null {
  let digits = (input ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.length === 10 ? digits : null;
}

/**
 * Builds the prefill query string shared by the redirect and the embed, or
 * null when the service has no online booking form (those keep the callback
 * path instead). One source of truth for both modes.
 */
export function buildBookingQuery(input: BookingUrlInput): string | null {

  const serviceId = SERVICE_IDS[input.service];
  const group = PARAMS_BY_SERVICE[input.service];
  if (!serviceId || !group) return null;

  const params = new URLSearchParams();
  params.set("industry_id", "1");
  params.set("form_id", "1");
  params.set("service_id", String(serviceId));

  // Move In/Out is never recurring on BookingKoala.
  const frequencyId =
    input.service === "move-in-out" ? 1 : FREQUENCY_IDS[input.frequencyBkId];
  if (frequencyId) params.set("frequency_id", String(frequencyId));

  const homeTypeId = input.homeType === null ? undefined : HOME_TYPE_IDS[input.homeType];
  if (homeTypeId) params.set("pricing_parameter[9]", String(homeTypeId));

  const setParam = ([category, table]: [number, Record<number, number>], value: number) => {
    const optionId = table[value];
    if (optionId) params.set(`pricing_parameter[${category}]`, String(optionId));
  };

  setParam(group.bedrooms, input.bedrooms);
  setParam(group.bathrooms, input.bathrooms);
  setParam(group.halfBaths, input.halfBaths);

  // Deep Cleaning is a Standard-service extras package; Move In/Out is already
  // a deep clean, so the id never rides along on that service. The id is
  // size-specific — an unresolved bedroom count sends nothing rather than a
  // wrong-tier id BK would silently drop.
  if (input.deepClean && input.service === "standard") {
    const extra = deepCleaningExtraFor(input.bedrooms);
    if (extra) params.set(`extras[${extra.id}]`, "1");
  }

  // The step-3 add-on shelf, including pets and the travel fee. Same rule as
  // above: a resolved id or nothing at all. Everything composes — BookingKoala
  // ticks every extras[] it receives, and honours a quantity where the row
  // allows one.
  const bedroomOptionId = bedroomOptionIdFor(input.service, input.bedrooms);
  // An unknown home size means no extras row can be trusted — send none.
  if (input.extras && bedroomOptionId !== null) {
    const travelFee = travelFeeExtraForSelection(input.service, input.bedrooms, homeTypeId ?? null);
    for (const [name, quantity] of Object.entries(input.extras)) {
      if (!quantity || quantity < 1) continue;
      const extra =
        travelFee && travelFee.name === name
          ? travelFee
          : resolveExtra(name, serviceId, [bedroomOptionId, homeTypeId ?? null]);
      if (!extra) continue;

      params.set(`extras[${extra.id}]`, String(Math.min(quantity, extra.maxQuantity)));
    }
  }




  // Details for the cleaner. Answered fields only — an empty dc_* param would
  // overwrite a booking-page default with nothing.
  const details = input.cleanerDetails ?? {};
  if (details.entry) params.set("dc_entry", details.entry);
  if (details.cleanliness) params.set("dc_clean", String(details.cleanliness));
  if (details.parking) params.set("dc_park", details.parking);
  const notes = (details.notes ?? "").trim().slice(0, DC_NOTES_MAX);
  if (notes) params.set("dc_notes", notes);
  const postalCode = normalizePostalCode(details.postalCode);
  if (postalCode) params.set("dc_zip", postalCode);


  const coupon = (input.coupon ?? "").trim();
  if (coupon) params.set("coupon", coupon);







  const { first, last } = splitName(input.contact?.name ?? "");
  if (first) params.set("f_name", first);
  if (last) params.set("l_name", last);

  const email = (input.contact?.email ?? "").trim();
  if (email) params.set("email", email);

  const phone = normalizeBookingPhone(input.contact?.phone);
  if (phone) params.set("phone", phone);

  return params.toString();
}

/** Full-page redirect target. */
export function buildBookingUrl(input: BookingUrlInput): string | null {
  const query = buildBookingQuery(input);
  return query === null ? null : `${BOOKING_ORIGIN}/booknow?${query}`;
}

/** Same form, chrome-less, for the in-site iframe at /book. */
export function buildBookingEmbedUrl(query: string): string {
  return `${BOOKING_ORIGIN}/booknow?embed=true&${query}`;
}


/**
 * Coverage guard: every headline extra we lean on — the Deep Cleaning package,
 * the five featured shelf rows, pets and the travel fee — must resolve to an
 * id for every home size of its service. A BookingKoala config change that
 * renames or re-scopes a row would otherwise fail silently (the param is
 * simply omitted, and the customer's booking quietly loses what they paid
 * for), so it fails loudly instead: in CI via `scripts/check-bk-extras.ts`
 * and in the DEV console here.
 *
 * A name is only required at every size if it exists at some size for that
 * service — BookingKoala genuinely doesn't offer, say, a finished-basement row
 * for a one-bedroom apartment, and that is not drift.
 */
export function bkExtrasCoverageGaps(): CoverageGap[] {
  const offers: { name: string; serviceId: number; bedroomOptionIds: number[] }[] = [];

  for (const [service, serviceId] of Object.entries(SERVICE_IDS)) {
    const bedroomOptionIds = Object.values(PARAMS_BY_SERVICE[service].bedrooms[1]);

    // Every name the shelf could show for this service, at any size.
    const names = new Set<string>();
    for (const bedroomOptionId of bedroomOptionIds) {
      for (const extra of listExtrasFor(serviceId, bedroomOptionId)) {
        const value = extra.name.toLowerCase();
        if (FEATURED_EXTRA_PREFIXES.some((prefix) => value.startsWith(prefix))) {
          names.add(extra.name);
        }
      }
    }
    if (serviceId === SERVICE_IDS.standard) names.add(DEEP_CLEANING_EXTRA_NAME);
    if (petsExtraFor(serviceId, bedroomOptionIds[0])) names.add(PETS_EXTRA_NAME);

    for (const name of names) offers.push({ name, serviceId, bedroomOptionIds });
  }

  const gaps = findCoverageGaps(offers);

  // The travel fee is matched by prefix, so it is checked directly.
  for (const service of Object.keys(SERVICE_IDS)) {
    for (const bedrooms of Object.keys(PARAMS_BY_SERVICE[service].bedrooms[1])) {
      if (!travelFeeExtraForSelection(service, Number(bedrooms))) {
        gaps.push({
          extra: "Travel fee",
          serviceId: SERVICE_IDS[service],
          bedroomOptionId: bedroomOptionIdFor(service, Number(bedrooms)) ?? 0,
        });
      }
    }
  }

  return gaps;
}

if (import.meta.env?.DEV) {
  const gaps = bkExtrasCoverageGaps();
  if (gaps.length > 0) {
    console.error("[bk-extras] unresolved BookingKoala extras — prefill will be omitted:", gaps);
  }
}

