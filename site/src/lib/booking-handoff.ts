import { BOOKING_ORIGIN } from "./booking-redirect";
import { TRACKED_PARAMS } from "./tracking";

const ENDPOINT = "/api/booking-handoff.php";
export const PRIVATE_HANDOFF_KEYS = ["f_name", "l_name", "email", "phone", "dc_entry", "dc_clean", "dc_park", "dc_flex", "dc_notes", "dc_addr", "dc_apt", "dc_city", "dc_prov", "dc_zip"] as const;

export function splitBookingQuery(query: string) {
  const fields: Record<string, string> = {};
  const publicParams = new URLSearchParams();
  for (const [key, value] of new URLSearchParams(query)) {
    if ((PRIVATE_HANDOFF_KEYS as readonly string[]).includes(key)) fields[key] = value;
    else if (key === "zipcode") fields.dc_zip ??= value;
    else if (/^(industry_id|form_id|service_id|frequency_id|pricing_parameter\[\d+\]|extras\[\d+\]|coupon)$/.test(key) || (TRACKED_PARAMS as readonly string[]).includes(key)) publicParams.set(key, value);
  }
  return { fields, publicQuery: publicParams.toString() };
}

/** Safe fallback contains service selections only, never personal answers. */
export function publicBookingUrl(query: string) {
  return `${BOOKING_ORIGIN}/booknow?${splitBookingQuery(query).publicQuery}`;
}

export async function prepareBookingHandoff(query: string): Promise<string | null> {
  const { fields, publicQuery } = splitBookingQuery(query);
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);
  try {
    const response = await fetch(ENDPOINT, {
      method: "POST", headers: { "Content-Type": "application/json" },
      signal: controller.signal, cache: "no-store", credentials: "omit",
      body: JSON.stringify({ action: "seal", fields }),
    });
    if (!response.ok) return null;
    const body = await response.json();
    if (typeof body.token !== "string" || !/^[\w-]{16}\.[\w-]{32,10000}$/.test(body.token)) return null;
    return `${BOOKING_ORIGIN}/booknow?${publicQuery}#dc_handoff=${body.token}`;
  } catch { return null; }
  finally { clearTimeout(timer); }
}
