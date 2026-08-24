import { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { getStoredTracking, TRACKED_PARAMS } from "@/lib/tracking";

/**
 * Bridge page: GoHighLevel form redirect → BookingKoala pre-filled booking.
 *
 * GHL's On-Submit redirect sends merge-tag LABELS (e.g. "3 Bedrooms") as URL
 * params; BookingKoala needs internal IDs. This page translates label → ID
 * and immediately forwards the visitor to BK via window.location.replace
 * (no history entry, so Back doesn't loop through here).
 *
 * Expected incoming params (from the GHL redirect URL):
 *   service, frequency, bedrooms, bathrooms, halfbaths, hometype,
 *   name, email, phone
 *
 * Debugging: append &debug=1 to the URL to see exactly what GHL sent, what
 * each label resolved to, and the final BK URL — without redirecting.
 * Any label that arrives as literal "{{contact.xyz}}" text means the GHL
 * merge-tag key is wrong; fix it in GHL, not here.
 */

/* ======================= EDIT THESE TWO BLOCKS ======================= */

/** Your BookingKoala booking form URL (no trailing slash). */
const BK_BASE = "https://REPLACE-WITH-YOUR-BOOKINGKOALA-URL.com/booking";
const IS_BOOKING_CONFIGURED = !BK_BASE.includes("REPLACE-WITH-YOUR-BOOKINGKOALA-URL");

/**
 * Label → ID translation. The LEFT side must match your GHL dropdown option
 * text CHARACTER-FOR-CHARACTER (what merge tags output). The RIGHT side is
 * the BookingKoala ID/value for that option.
 *
 * `param` is the BK URL parameter name for that field.
 * Set `param: null` to skip a field entirely (e.g. if home type turns out
 * not to be a BK pricing parameter, the visitor picks it manually).
 */
const FIELD_MAP: Record<
  string,
  { param: string | null; values: Record<string, string> }
> = {
  service: {
    param: "service_id", // TODO: confirm BK param name
    values: {
      // TODO: replace labels/IDs with your real GHL options + BK IDs
      "Standard Cleaning": "1",
      "Deep Cleaning": "2",
      "Move In/Out Cleaning": "3",
      "Post-Construction Cleaning": "4",
    },
  },
  frequency: {
    param: "frequency", // TODO: confirm BK param name
    values: {
      "One-Time": "1",
      "Weekly": "2",
      "Bi-Weekly": "3",
      "Monthly": "4",
    },
  },
  bedrooms: {
    param: "beds", // TODO: confirm BK param name
    values: {
      "1 Bedroom": "1",
      "2 Bedrooms": "2",
      "3 Bedrooms": "3",
      "4 Bedrooms": "4",
      "5+ Bedrooms": "5",
    },
  },
  bathrooms: {
    param: "baths", // TODO: confirm BK param name
    values: {
      "1 Bathroom": "1",
      "2 Bathrooms": "2",
      "3 Bathrooms": "3",
      "4+ Bathrooms": "4",
    },
  },
  halfbaths: {
    param: "halfbaths", // TODO: confirm BK param name
    values: {
      "0": "0",
      "1": "1",
      "2": "2",
    },
  },
  hometype: {
    // Set to null to skip home type entirely if BK doesn't accept it.
    param: "home_type", // TODO: confirm BK param name, or set null
    values: {
      "House": "1",
      "Apartment/Condo": "2",
      "Townhouse": "3",
    },
  },
};

/** Contact identity fields pass through unchanged — just confirm BK's param names. */
const CONTACT_PARAMS: Record<string, string> = {
  name: "name", // TODO: confirm BK param name
  email: "email",
  phone: "phone",
};

/* ===================== END OF EDITABLE CONFIGURATION ===================== */

interface Resolution {
  incoming: string;
  outgoing: string | null; // null = skipped (param disabled)
  matched: boolean; // false = label not found in map
}

function buildBookingUrl(search: URLSearchParams) {
  const out = new URLSearchParams();
  const resolutions: Record<string, Resolution> = {};

  // Dropdown fields: translate label → ID via FIELD_MAP
  for (const [key, field] of Object.entries(FIELD_MAP)) {
    const label = search.get(key);
    if (!label) continue;
    if (!field.param) {
      resolutions[key] = { incoming: label, outgoing: null, matched: true };
      continue;
    }
    const id = field.values[label];
    resolutions[key] = { incoming: label, outgoing: id ?? null, matched: id !== undefined };
    if (id !== undefined) out.set(field.param, id);
  }

  // Contact fields: pass through verbatim
  for (const [key, bkParam] of Object.entries(CONTACT_PARAMS)) {
    const value = search.get(key);
    if (!value) continue;
    resolutions[key] = { incoming: value, outgoing: value, matched: true };
    out.set(bkParam, value);
  }

  // Ad attribution (gclid/UTM) captured on the landing page rides through
  // to BookingKoala so Google Ads conversions can be matched back to clicks.
  const storedTracking = getStoredTracking();
  for (const key of TRACKED_PARAMS) {
    const value = search.get(key) ?? storedTracking[key];
    if (!value) continue;
    resolutions[key] = {
      incoming: search.get(key) ?? "(from session)",
      outgoing: value,
      matched: true,
    };
    out.set(key, value);
  }

  const qs = out.toString();
  return { url: qs ? `${BK_BASE}?${qs}` : BK_BASE, resolutions };
}

export default function QuoteRedirect() {
  const search = useMemo(() => new URLSearchParams(window.location.search), []);
  const debug = search.get("debug") === "1";
  const { url, resolutions } = useMemo(() => buildBookingUrl(search), [search]);

  useEffect(() => {
    if (debug || !IS_BOOKING_CONFIGURED) return;
    // Small delay so the branded splash paints before the hop.
    const t = window.setTimeout(() => window.location.replace(url), 400);
    return () => window.clearTimeout(t);
  }, [debug, url]);

  if (!IS_BOOKING_CONFIGURED) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center gap-4 px-4 text-center">
        <Helmet>
          <title>Booking Unavailable | Duty Cleaners</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1 className="text-2xl font-bold">We couldn't open the booking page</h1>
        <p className="text-primary-foreground/70 max-w-lg">
          Please call us and we'll help complete your quote right away.
        </p>
        <a
          href="tel:7809136565"
          className="min-h-12 inline-flex items-center justify-center rounded bg-accent px-6 py-3 font-bold text-accent-foreground hover:bg-accent/90"
        >
          Call 780-913-6565
        </a>
      </div>
    );
  }

  if (debug) {
    return (
      <div className="min-h-screen bg-primary text-primary-foreground px-4 py-16">
        <Helmet>
          <title>Quote Redirect — Debug | Duty Cleaners</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">Quote Redirect — Debug Mode</h1>
          <p className="text-primary-foreground/70 mb-8">
            No redirect is happening. Compare the incoming labels against the map and fix any
            unmatched entries (or the GHL merge-tag key, if a value below is literal
            {"{{contact…}}"} text).
          </p>

          <div className="bg-white/10 rounded-lg overflow-hidden mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/20">
                  <th className="px-4 py-3 font-semibold">Field</th>
                  <th className="px-4 py-3 font-semibold">GHL sent</th>
                  <th className="px-4 py-3 font-semibold">BK receives</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(resolutions).map(([key, r]) => (
                  <tr key={key} className="border-b border-white/10">
                    <td className="px-4 py-3 font-medium">{key}</td>
                    <td className="px-4 py-3 break-all">{r.incoming}</td>
                    <td className="px-4 py-3">{r.outgoing ?? "—"}</td>
                    <td className="px-4 py-3">
                      {r.outgoing === null && r.matched
                        ? "skipped"
                        : r.matched
                          ? "matched"
                          : "NO MATCH — fix map"}
                    </td>
                  </tr>
                ))}
                {Object.keys(resolutions).length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-primary-foreground/60">
                      No parameters received. Submit the GHL form with &debug=1 appended to the
                      redirect URL to inspect the handoff.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-semibold mb-2">Final BookingKoala URL</h2>
          <p className="bg-white/10 rounded-lg px-4 py-3 break-all font-mono text-sm">{url}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary text-primary-foreground flex flex-col items-center justify-center gap-4 px-4 text-center">
      <Helmet>
        <title>Redirecting to Booking | Duty Cleaners</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Loader2 className="h-10 w-10 animate-spin text-accent" aria-hidden="true" />
      <p className="text-xl font-semibold">Taking you to our booking page…</p>
      <p className="text-primary-foreground/70 text-sm max-w-md">
        Your quote details are being transferred. If nothing happens,{" "}
        <a href={url} className="text-accent underline hover:opacity-90">
          continue to booking
        </a>
        .
      </p>
    </div>
  );
}
