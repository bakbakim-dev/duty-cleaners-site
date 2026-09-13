import { DC_NOTES_MAX, normalizePostalCode, type CleanerDetails } from "./booking-redirect";

// Equivalent to the live BookingKoala questions, verified 2026-09-12.
export const CLEANLINESS_OPTIONS = [
  { value: 1, label: "1 - Almost Spotless" },
  { value: 2, label: "2 - Mostly Clean" },
  { value: 3, label: "3 - Decently Clean" },
  { value: 4, label: "4 - Needs Attention" },
  { value: 5, label: "5- Very Dirty" },
] as const;
export const FLEXIBILITY_OPTIONS = [
  { value: "both", label: "Yes - Date & Time is flexible (Specify flexibility in the comment section below)" },
  { value: "time", label: "Yes - Only time is flexible (Specify flexible times in the comment section below)" },
  { value: "date", label: "Yes - Only date is flexible (Specify flexible times in the comment section below)" },
  { value: "none", label: "NO - Not Flexible At All" },
] as const;

export function cleanerNotesLimit(details: CleanerDetails): number {
  return DC_NOTES_MAX - (details.entry === "lockbox" ? "Entry: Key in a lockbox.\n".length : 0);
}

export function validateCleanerDetails(details: CleanerDetails): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!details.address?.trim()) errors.address = "Enter the street address where we will clean.";
  if (!details.city?.trim()) errors.city = "Enter your service address city or town.";
  if (!details.province?.trim()) errors.province = "Enter the province.";
  if (!normalizePostalCode(details.postalCode)) errors.postalCode = "Enter your complete Canadian postal code, e.g. T5J 0N3.";
  if (!["home", "mailbox", "lockbox", "code", "other"].includes(details.entry ?? "")) errors.entry = "Tell us how we get in.";
  if (!CLEANLINESS_OPTIONS.some(option => option.value === details.cleanliness)) errors.cleanliness = "Select your home's current cleanliness from 1 to 5.";
  if (!["street", "visitor", "driveway", "paid"].includes(details.parking ?? "")) errors.parking = "Tell us where to park.";
  if (!FLEXIBILITY_OPTIONS.some(option => option.value === details.flexibility)) errors.flexibility = "Tell us whether your date/time is flexible.";
  if (details.flexibility && details.flexibility !== "none" && !details.notes?.trim()) errors.notes = "Describe your date/time flexibility in the notes.";
  if ((details.notes?.trim().length ?? 0) > cleanerNotesLimit(details)) errors.notes = `Keep your notes within ${cleanerNotesLimit(details)} characters so all instructions carry over.`;
  for (const key of ["address", "apartment", "city", "province"] as const) {
    if ((details[key]?.trim().length ?? 0) > 120) errors[key] = "Use no more than 120 characters.";
  }
  return errors;
}
