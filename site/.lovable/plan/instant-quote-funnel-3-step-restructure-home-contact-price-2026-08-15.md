# Instant-quote funnel — 3-step restructure (home → contact → price)

Reorders the existing native funnel so contact details are captured *before* the price reveal, wires both submissions to the real GoHighLevel form, and makes all "how it works" copy match.

## Verified current state

- `QuoteFlow.tsx` steps are `["About your home", "Your price", "Confirmation details"]` — price is shown before contact details, the reverse of the requested order.
- Step 3 currently asks for a postal code (`contact.postal`, input at lines 528-537) and it is sent as `postal_code`.
- `src/config/ghl.ts` still has `GHL_FORM_ENDPOINT`/`GHL_FORM_ID`/`GHL_LOCATION_ID` as `null` and `FIELD_KEYS` mapped to plain placeholder names, so `submitQuote()` returns `{ok:false, unconfigured:true}` today — no lead can send.
- Extras, home types, bedroom sqft labels, bathrooms, half baths and frequency discounts already come from `bk-config.json` + the verified admin overrides; nothing new is invented by this change.
- Step copy to update lives in `CityConversionIntro.tsx` (steps array + "Step 1 of 3" chip), `Edmonton2.tsx`, `Calgary2.tsx`, `QuoteFormEmbed.tsx`.

## Step 1 of 3 — About your home

Service, home type, bedrooms (BK sqft labels), full baths 1-7, half baths 0-4, frequency chips with the real discount printed, Bi-Weekly preselected with the Most Popular badge (chips remain Standard-Cleaning-only, since Move In/Out has no recurring pricing in BK). No price panel, no contact fields, no postal code anywhere in the funnel — the postal input and `postal_code` payload key are removed. Progress bar reads "Step 1 of 3". Continue button.

## Step 2 of 3 — Where should we send your quote?

Full name, email, phone only. Button "See my price →". Microcopy: "You won't be charged today · No spam, no obligation · Prefer to talk? (780) 913-6565" (number stays city-derived, Calgary pages show the Calgary line).

On submit it POSTs to `https://api.bookin60.com/forms/submit` with form `AwJDnvuYtkojIN3aOysC`, location `4OROmtMn8LQqaDsUJPjC`, and exactly: `full_name`, `email`, `phone`, `zZe52Ae37d5GYopA6Ozr` (service), `otoaEP8TY5qqswGWnUL4` (home type), `NhySfYuxF5om26mXd0Cn` (bedrooms), `T8UTS5jMZjlggnAFfNTm` (full baths), `ZH7gPapo6SSzd82UNkDf` (half baths), `jh1wUn1kdBcgytjX0YZu` (frequency). Dropdown values are sent as BK/GHL's own option labels.

Advance to Step 3 only on a 2xx. On failure: no price, no success state — "Something went wrong — call (780) 913-6565 and we'll honour your quote", with tappable call/email buttons, entered data kept, and a Retry button. Honeypot and minimum-fill-time checks stay.

## Step 3 of 3 — Price reveal + extras

"First clean $X · then $Y per visit" with the "Saving $Z per visit" chip on recurring frequencies, computed from the BK config as today (GST line kept). Below: "Anything extra?" — the BK extras list with real names and prices (Deep Cleaning tiered by home size, Inside Windows, Inside Oven, Inside Fridge, pets surcharge, wall washing, blinds), toggling updates the price live, first-clean-only extras respected per BK's rules. Small print: "Addresses outside Edmonton or Calgary city limits may include a travel fee — we confirm before your clean."

Final CTA "Confirm my booking request →" posts to the same endpoint with the same email (GHL updates the contact) plus first-clean price, recurring price and selected extras. Those three need custom field IDs; until you supply them they are held in the field map with empty IDs and skipped at send time, and I'll say so rather than pretend they sent. Success: "Request received — we'll text you shortly to confirm your time." No date picker.

## Endpoint verification (before this ships)

The form's public page renders a Cloudflare Turnstile token, so a bare POST may be rejected. First a real request-shape capture against `https://api.bookin60.com/widget/form/AwJDnvuYtkojIN3aOysC` (one clearly-marked test submission, response status read — no `no-cors`), then the test contact is deleted. If Turnstile or CORS blocks the browser POST, the client keeps the same interface and the request is relayed through a Lovable Cloud edge function server-side. No captcha bypass is attempted.

Because the price is now gated behind a successful submit, a blocked endpoint means no visitor sees a price — so this verification happens before the reorder goes live.

## Copy alignment

"How it works" everywhere becomes: 1. Tell us about your home → 2. Tell us where to send your quote → 3. See your price & customize — in `CityConversionIntro.tsx`, `Edmonton2.tsx`, `Calgary2.tsx`, `QuoteFormEmbed.tsx`, with the step count honest in every progress indicator.

## Technical notes

- `QuoteFlow.tsx`: step array reordered, submit split into `submitLead()` (step 2 gate) and `confirmBooking()` (step 3), postal state/field removed.
- `src/config/ghl.ts`: real endpoint/form/location constants, `FIELD_KEYS` remapped to the six custom IDs; unmapped keys (city, addons, prices, page URL, UTM/gclid) skipped until IDs exist.
- `src/lib/quote-submit.ts`: `postal_code` dropped from `QuotePayload`, skip-empty-field-ID behaviour added.

## Verification

Desktop and mobile Playwright runs: full funnel with the request intercepted (assert the six custom IDs plus contact fields present, values matching the panel), a forced failure at step 2 (assert no price shown, fallback copy, data retained), honeypot filled (assert no request), and a diff of rendered options/prices against `bk-config.json`.
