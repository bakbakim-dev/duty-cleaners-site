# Postal code drives the travel fee

## What changes on Step 3

A new optional field joins "Details for your cleaner": **Postal code** — 7 characters max, auto-uppercased, formatted as `A1A 1A1` while typing, with a light validity check (no error nagging while typing, just a quiet hint if it isn't a Canadian format).

The postal code becomes the source of truth for the travel fee:

- Prefix **T5 / T6** (Edmonton) or **T2 / T3** (Calgary) → inside city limits. No travel fee, and the "Is your service address inside city limits?" radio question is hidden entirely.
- Any other valid prefix → outside city limits. The neutral note appears automatically ("A $29.99 travel fee applies outside city limits — it covers the extra travel time.") and the `+$29.99 travel fee` line item is added to the price card, the sticky bar, the booking URL and the CRM total. No question is shown — it's already answered.
- **No postal code entered** (or an unparseable one) → the existing Yes/No radio question stays exactly as it is today, as the fallback. Unanswered is still priced as inside city limits, and the CTA is never blocked.

Typing a postal code after answering the radio overrides the manual answer; clearing it hands control back to the radio.

## Booking handoff

The value is appended to the booking URL as `dc_zip=<value>` only when entered, alongside the existing `dc_entry`, `dc_clean`, `dc_park`, `dc_notes`. Same shared query builder, so embed mode picks it up automatically. The postal code also rides along in the Step-3 CRM upsert with the other cleaner details.

Street address, apartment, city and province are deliberately **not** added — no `dc_addr` / `dc_apt` / `dc_city` / `dc_prov` for now.

## Technical notes

- `src/lib/booking-redirect.ts` — add `postalCode` to `CleanerDetails`; normalise (uppercase, single space, strip junk) and emit `dc_zip`. Export a `postalCodeCityStatus(value)` helper returning `"inside" | "outside" | "unknown"` based on the T5/T6/T2/T3 prefixes, so pricing and UI share one rule.
- `src/components/quote/QuoteFlow.tsx` — derive `outsideCity` from the postal-code status first, falling back to the existing `insideCity` radio only when the status is `unknown`; the radio fieldset renders only in that fallback case. Everything downstream (extras basket at L426–434, price card line, sticky bar) keeps using the derived `outsideCity`, so no other logic moves. Add the input to the cleaner-details group and the postal code to the CRM `addons` payload line.
- `src/lib/booking-redirect.test.ts` — cases: `dc_zip` present only when entered and normalised to `A1A 1A1`; T5/T2 classified inside; T7/other outside; blank or partial classified unknown.
