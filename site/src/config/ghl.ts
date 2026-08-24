/**
 * GoHighLevel bridge configuration.
 *
 * Leads reach GHL through its official API v2 (`/contacts/upsert`), called
 * server-side by the `ghl-quote` edge function with a Private Integration
 * token. The browser never talks to GHL and there is no form submission
 * anywhere in this path — the old hidden-form transport was removed.
 *
 * What lives here is only what the client needs: the sub-account id and the
 * verbatim option labels GHL expects for its dropdown custom fields.
 */

/** The GHL location (sub-account) id. */
export const GHL_LOCATION_ID = "4OROmtMn8LQqaDsUJPjC";


/* ------------------------------------------------------------------ *
 * Dropdown value translation
 *
 * GHL's own option labels, read from the live form. Values are sent using
 * these strings so workflow filters keep matching.
 * ------------------------------------------------------------------ */

export const GHL_SERVICE_LABELS: Record<string, string> = {
  standard: "Standard Cleaning",
  "move-in-out": "Move in Move out Cleaning",
};

export const GHL_HOME_TYPE_LABELS: Record<number, string> = {
  90: "Two Storey Detached Home (Main Floor & Upper Floor)",
  89: "Two Storey Townhouse/Duplex",
  54: "Bungalow (Single Storey Home)",
  56: "Bungalow (Single Storey Home)",
  55: "Apartment/Condo (Single Storey)",
};

const BEDROOM_WORDS = ["One", "Two", "Three", "Four", "Five", "Six", "Seven"];
const BEDROOM_SQFT = ["800", "1100", "1700", "2300", "3000", "3600", "4200"];

export const ghlBedroomLabel = (count: number) => {
  const index = Math.min(Math.max(count, 1), 7) - 1;
  return `${BEDROOM_WORDS[index]} Bedroom${index === 0 ? "" : "s"} (Under ${BEDROOM_SQFT[index]} Sqft)`;
};

export const ghlBathroomLabel = (count: number) =>
  `${count} Bathroom${count === 1 ? "" : "s"}`;

export const ghlHalfBathLabel = (count: number) =>
  `${count} Half Baths (With only a Toilet and Sink)`;

/** Keyed by BookingKoala frequency id. */
export const GHL_FREQUENCY_LABELS: Record<number, string> = {
  1: "One Time",
  2: "Every Week (20% off)",
  4: "Every 2 Weeks (Most Popular Option 15% off )",
  3: "Every 4 Weeks (10% off)",
};
