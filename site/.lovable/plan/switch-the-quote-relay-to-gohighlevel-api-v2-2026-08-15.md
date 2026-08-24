# Switch the quote relay to GoHighLevel API v2

The funnel itself does not change: same three steps, same UI, same pricing, same honeypot and fill-time checks. Only the way a lead reaches GoHighLevel changes — the old hidden-form post is removed entirely and replaced by a server-side call to GHL's official API. The form's captcha can stay on; we never touch that form again.

## Verified current state

- `supabase/functions/ghl-quote/index.ts` posts multipart to `backend.leadconnectorhq.com/forms/submit` — this whole path gets deleted.
- `src/lib/quote-submit.ts` builds GHL form field keys from `src/config/ghl.ts` and invokes the relay.
- `src/components/quote/QuoteFlow.tsx` calls `submitQuote` twice: `submitLead` (Step 2) and `confirmBooking` (Step 3). Both keep their exact signatures and outcome handling.
- No `quote_leads` table exists yet — it is created as part of this work.

## 1. Secret

Ask for `GHL_PI_TOKEN` through the secure secrets input. It lives only in the backend function: never sent to the browser, never logged, never written into code.

## 2. Backend relay rewrite (`ghl-quote`)

- **Field-ID mapping**: on first request, `GET /locations/{location}/customFields` (Version `2021-07-28`), build a map from the ten `contact.*` keys listed by you to their IDs, and cache it in memory for the function's lifetime. If any of the ten is missing, the function fails loudly with a clear error and the funnel shows the phone fallback — no partial send.
- **Upsert**: `POST https://services.leadconnectorhq.com/contacts/upsert` with locationId, name/firstName/lastName, email, phone normalized to E.164, `source: "dutycleaners.ca instant quote"`, tags `["instant-quote", "<edmonton|calgary>"]`, and `customFields` built from the mapped IDs.
- **Values**: BookingKoala's exact option labels from bk-config for service, home type, bedrooms, bathrooms, half baths and frequency; page URL including UTM params.
- **Step 3 confirm**: same endpoint, same email/phone so GHL updates the same contact, adding tag `quote-confirmed` plus first-clean price, recurring price and extras (semicolon-separated BK extra names).
- **Reliability**: 10s timeout; one retry on network error or 5xx; never retry a 4xx. Success = 2xx carrying a contact id; anything else returns a failure the funnel treats as failure.
- **Input validation** with Zod on the request body; per-browser rate limit retained.

## 3. Backup capture (`quote_leads`)

Every attempt writes a row first (home details, contact details, quoted prices, extras, page URL, tracking params, step), then the GHL outcome (contact id or error) is recorded on that row. Row Level Security on, no public read, inserts and updates server-side only. A lead is never lost even if GHL rejects the call.

## 4. Frontend cleanup

- `src/config/ghl.ts`: drop the form endpoint, form id and the form field-key map; keep the location id and the BookingKoala label helpers.
- `src/lib/quote-submit.ts`: send the plain payload plus a `stage` of `lead` or `confirm`; no more GHL form-key flattening. Return shape `{ ok, status }` stays, so `QuoteFlow.tsx` needs no behavioural change.

## 5. Live test walkthrough (after build)

1. You submit a test lead on Step 2 — I watch the relay logs and confirm a 2xx with a contact id.
2. You open the contact in GHL: tags `instant-quote` + city, and the six home fields populated with the BK labels.
3. You complete Step 3 confirm — I confirm the same contact id comes back.
4. You verify no duplicate contact, and that `quote-confirmed`, both prices and the extras list are now filled.
5. Delete the test contact.

## Technical notes

- Files: `supabase/functions/ghl-quote/index.ts` (rewrite), `src/lib/quote-submit.ts`, `src/config/ghl.ts`, one migration for `quote_leads` with GRANTs and RLS.
- `QuoteFlow.tsx` is untouched apart from nothing — its two call sites keep working as-is.
- Phone normalization: strip non-digits, prefix `+1` for 10-digit Canadian numbers, pass through anything already starting with `+`.
