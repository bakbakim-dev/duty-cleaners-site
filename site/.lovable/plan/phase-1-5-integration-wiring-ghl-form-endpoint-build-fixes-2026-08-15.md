# Phase 1.5 — Integration wiring (GHL form endpoint) + build fixes

The funnel UI stays exactly as it is. This phase makes "Confirm my booking request" actually send the lead, makes success/failure honest, and clears the copy and routing defects found in the review.

## Verified current state

- `QuoteFlow.tsx` submit: posts only if `GHL_FORM_ENDPOINT` is set — it is `null` in `src/data/proof.ts`, so today it logs a console warning and shows success anyway. Also uses `mode: "no-cors"`, which makes a 2xx impossible to detect.
- `BOOKING_KOALA_URL` is `null`; the only BK URL in the codebase is the placeholder in `src/pages/QuoteRedirect.tsx`.
- `CityTrustStats.tsx` counts up any digits inside a stat string, so `"<5%"` animates from `<0%` — that is the "<0% of applicants" bug.
- `TrustMarquee.tsx` line 10 still reads "10+ Years of Service".
- `Footer.tsx` builds `quoteHref` as `/${city}-2#quote` and hard-codes the Calgary number `(403) 768-1341` in both the CTA button and the contact row, on every page including Edmonton.
- Step 3 label "Pick your time" appears in `CityConversionIntro.tsx`, `QuoteFormEmbed.tsx`, `Edmonton2.tsx`, `Calgary2.tsx`.
- The three named reviews (Jennifer M., Michael R., Sarah K.) are hard-coded arrays in `Edmonton2.tsx` and `Calgary2.tsx`.
- Routes: `/` → Edmonton2, `/edmonton` → old Edmonton page, `/calgary` → old Calgary page, `/calgary-2` → Calgary2.

## 1. Submit path

**Config** — new `src/config/ghl.ts` holding the hidden GHL form's endpoint and field-name map in one place, read from `VITE_GHL_FORM_ENDPOINT` / `VITE_GHL_FORM_ID` with the constants as fallback. `GHL_FORM_ENDPOINT` in `proof.ts` is removed so there is a single source.

**Request** — a `submitQuote()` helper in `src/lib/quote-submit.ts`:
- Builds the full payload (source, city, service, bedrooms, full_bathrooms, half_baths, addons, frequency, frequency_discount_pct, first_clean_price, recurring_price, currency, full_name, email, phone, postal_code, page_url, submitted_at) plus stored UTM/gclid.
- Posts it as the GHL form submission request (form-encoded/multipart with the form ID and field keys, matching what the real form posts). **Not** `no-cors` — the response status must be readable so success is real. If GHL's endpoint blocks the browser origin with CORS, the fallback is a tiny Lovable Cloud edge function that relays the POST server-side; the client keeps the same interface.
- Returns `{ ok, status }`; throws nothing silently.

**States in `QuoteFlow.tsx`**
- Success only on a 2xx: "Request received — we'll text you within [RESPONSE_TIME] to confirm your time." `RESPONSE_TIME` is a constant in `proof.ts` (TODO-OWNER, placeholder "1 hour during business hours").
- Failure keeps the form filled and shows: "Something went wrong — call us at (780) 913-6565 or email support@dutycleaners.ca and we'll honour this price," with tappable call/email buttons (city-aware number) and a Retry button.
- Postal code field added to Step 3 (payload requires it), zod-validated.

**Spam protection** — hidden honeypot input (label off-screen, `tabIndex={-1}`, `autoComplete="off"`) and a minimum 4-second time-on-form check. Both fail silently into a fake success for bots only; no CAPTCHA.

**BookingKoala** — untouched in v1. The post-submit redirect to `BOOKING_KOALA_URL` is removed from the flow so the booking-request model is honest; `QuoteRedirect.tsx` stays as the v2 bridge.

## 2. Build fixes (same pass)

- `CityTrustStats.tsx`: skip the count-up for values whose digits are not the whole number (e.g. `<5%`, `Five-Star`) — render them statically so `<5%` never shows as `<0%`.
- `TrustMarquee.tsx`: "10+ Years of Service" → "Serving Alberta since 2017".
- `Footer.tsx`: derive phone from `cityProofFor(pathname)` in `proof.ts` so Edmonton pages show (780) 913-6565 and Calgary pages (403) 768-1341; `quoteHref` becomes `/#quote` on Edmonton and `/calgary#quote` on Calgary.
- Step 3 copy: "Pick your time" → "Send your booking request" in all four files.
- Reviews: move the three hard-coded testimonials into `src/data/reviews.ts` seeded empty with a `TODO-OWNER` note; the section renders only when real verbatim reviews exist, so nothing invented ships in the meantime.

## 3. Routes

Proposed (say the word if you'd rather keep the old pages):
- Calgary2 takes over `/calgary`; the older `Calgary.tsx` is retired and `/calgary-2` redirects to `/calgary`.
- Edmonton2 stays at `/`; `/edmonton` and `/edmonton-2` redirect to `/`; the older `Edmonton.tsx` is retired.
- All internal links (`Navigation`, `Footer`, `Locations`, `BrandHome`, `Contact`, `CalgaryPricing`, `ServiceDetailPage`, `CityConversionIntro`) updated to the clean slugs; sitemaps and canonicals updated to match.

## 4. Freeze investigation

Profile the quote dialog with Playwright + a React render counter: step through all three steps and watch for repeated renders. Prime suspects to check are the `useEffect` in `QuoteFlow` that resets frequency when `supportsRecurring` changes, the `#quote` hash effect in `use-quote-overlay.tsx` (which calls `openQuote` on every location change), and the overlay's focus-trap keydown listener. Fixes applied only where a loop is actually observed.

## What I need from you

- The GHL form's submission endpoint/form ID and its custom field keys (created per 1.5.2), or confirmation to ship the constants blank until you have them.
- The real response-time promise for the success line.
- The verbatim Google reviews (name, date, text) to replace the placeholders.

## Verification

Playwright run at desktop and mobile: full funnel to submit with the network request intercepted (assert the payload contains every field), a forced 500 (assert no success screen, fallback copy visible, data retained), honeypot filled (assert no request), plus screenshots of the corrected stat tile, ticker, footer phone/CTA, and step-3 label.
