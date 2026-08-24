/**
 * VERIFIED BookingKoala Form 1 prices (Home Cleaning, industry 1).
 *
 * Captured 2026-08-15 from the BookingKoala admin
 * (Settings → Industries → Home Cleaning → Form 1). Currency CAD, before GST.
 *
 * Why this file exists: the public snapshot in `bk-config.json` carries BK's
 * *default* `price_ml` values, not the Form 1 prices the customer is actually
 * quoted (e.g. 1 Bedroom reads $99 in the snapshot but is $120.99 on the form).
 * The snapshot stays the source of structure — which options exist, which
 * extras attach to which size, frequencies and discounts — while every base
 * option's price and label is resolved from the table below.
 *
 * Keyed by BookingKoala variable id so a label edit in BK can never silently
 * re-point a price. Re-capture whenever BK settings change.
 */

export interface PriceOverride {
  /** Verbatim BookingKoala label — must match BK, the site and the email. */
  label: string;
  /** Price in CAD, before GST. */
  price: number;
  /** On-site duration in seconds, as BK stores it. */
  timeSeconds: number;
}

/** BK variable id → verified price. */
export const BK_PRICE_OVERRIDES: Record<number, PriceOverride> = {
  /* ---- Home type (shared by Standard and Move In/Move Out) ---------- */
  90: { label: "Two Storey House (Main + Upper Floor)", price: 55, timeSeconds: 2400 },
  89: { label: "Two Story Townhouse (Duplex)", price: 40, timeSeconds: 1800 },
  54: { label: "Bungalow (Single Story Home)", price: 15, timeSeconds: 300 },
  56: { label: "Basement Suite Only", price: 15, timeSeconds: 300 },
  55: { label: "Apartment or Condo", price: 0, timeSeconds: 0 },

  /* ---- Standard Cleaning — bedrooms --------------------------------- */
  87: { label: "1 Bedroom (Under 800sqft)", price: 120.99, timeSeconds: 6300 },
  81: { label: "2 Bedrooms (Under 1100sqft)", price: 135.0, timeSeconds: 7200 },
  82: { label: "3 Bedrooms (Under 1700sqft)", price: 157.3, timeSeconds: 8100 },
  83: { label: "4 Bedrooms (Under 2300sqft)", price: 178.75, timeSeconds: 9000 },
  84: { label: "5 Bedrooms (Under 3000sqft)", price: 200.2, timeSeconds: 9900 },
  85: { label: "6 Bedrooms (Under 3600sqft)", price: 222.3, timeSeconds: 11700 },
  86: { label: "7 Bedrooms (Under 4200sqft)", price: 254.99, timeSeconds: 13500 },

  /* ---- Standard Cleaning — full bathrooms --------------------------- */
  88: { label: "1 Full Bath(s)", price: 34.0, timeSeconds: 1800 },
  9: { label: "2 Full Bath(s)", price: 60.0, timeSeconds: 3600 },
  11: { label: "3 Full Bath(s)", price: 90.0, timeSeconds: 5400 },
  13: { label: "4 Full Bath(s)", price: 120.0, timeSeconds: 7200 },
  15: { label: "5 Full Bath(s)", price: 150.0, timeSeconds: 9000 },
  17: { label: "6 Full Bath(s)", price: 180.0, timeSeconds: 10800 },
  19: { label: "7 Full Bath(s)", price: 210.0, timeSeconds: 12600 },

  /* ---- Standard Cleaning — half baths ------------------------------- */
  51: { label: "0 Half Baths (With Only A Toilet or Sink)", price: 0, timeSeconds: 0 },
  8: { label: "1 Half Bath", price: 15.0, timeSeconds: 900 },
  10: { label: "2 Half Baths", price: 30.0, timeSeconds: 1800 },
  12: { label: "3 Half Baths", price: 45.0, timeSeconds: 2700 },
  16: { label: "4 Half Baths", price: 65.0, timeSeconds: 3600 },

  /* ---- Move In / Move Out — bedrooms -------------------------------- */
  74: { label: "1 Bedroom (Under 800sqft)", price: 243.75, timeSeconds: 11700 },
  75: { label: "2 Bedroom (Under 1100sqft)", price: 281.25, timeSeconds: 13500 },
  76: { label: "3 Bedroom (Under 1700sqft)", price: 318.75, timeSeconds: 15300 },
  77: { label: "4 Bedroom (Under 2300sqft)", price: 356.25, timeSeconds: 17100 },
  78: { label: "5 Bedroom (Under 3000sqft)", price: 393.75, timeSeconds: 18900 },
  79: { label: "6 Bedroom (Under 3600sqft)", price: 431.25, timeSeconds: 20700 },
  80: { label: "7 Bedroom (Under 4200sqft)", price: 468.75, timeSeconds: 22500 },

  /* ---- Move In / Move Out — full bathrooms -------------------------- */
  39: { label: "1 Full Bath(s)", price: 39.99, timeSeconds: 1800 },
  40: { label: "2 Full Bath(s)", price: 79.99, timeSeconds: 3600 },
  41: { label: "3 Full Bath(s)", price: 119.99, timeSeconds: 5400 },
  42: { label: "4 Full Bath(s)", price: 159.99, timeSeconds: 7200 },
  43: { label: "5 Full Bath(s)", price: 199.99, timeSeconds: 9000 },
  44: { label: "6 Full Bath(s)", price: 239.99, timeSeconds: 10800 },

  /* ---- Move In / Move Out — half baths ------------------------------ */
  58: { label: "0 Half Baths", price: 0, timeSeconds: 0 },
  45: { label: "1 Half Bath", price: 25.0, timeSeconds: 900 },
  46: { label: "2 Half Baths", price: 50.0, timeSeconds: 1800 },
  47: { label: "3 Half Baths", price: 75.0, timeSeconds: 2700 },
  48: { label: "4 Half Baths", price: 110.0, timeSeconds: 3600 },
};

/** GST charged on top of every quoted figure. */
export const GST_RATE = 0.05;
