# BookingKoala handoff implementation — 12 September 2026

## Status

The BookingKoala companion receiver is published and its native-field adapter works in the live public booking form. The funnel changes and encrypted transfer endpoint are implemented locally. **The encrypted end-to-end journey is not yet verified or ready to launch.** The endpoint is a PHP file designed for the SiteGround host; Supabase is not required for this handoff. It still must be uploaded to `mikaily131.sg-host.com` with its private secret file before staging verification.

No booking was submitted, no payment was entered, and no customer contact data was used in the live tests. The website frontend has not been deployed by this change. BookingKoala retains authority over availability, final prices, card collection and booking confirmation.

## Owner-approved changes implemented

- Name, email and phone remain before the full price/extras screen.
- The after-price details pane collects street address, optional unit, city and province, alongside postal code. Province starts at AB and remains editable.
- Cleanliness now asks the actual BookingKoala 1–5 question, with exactly its five answer meanings. Cleaning history is no longer misrepresented as dirtiness.
- Date/time flexibility uses BookingKoala's four answers. Flexible customers must describe their flexibility in the notes.
- Lockbox now maps to native **Other**, with `Entry: Key in a lockbox.` in the notes. It never maps to mailbox. The legacy mailbox value remains supported for genuine mailbox selections, but is not shown as the funnel's lockbox option.
- Notes reserve space for the lockbox explanation, avoiding silent truncation of instructions.
- Existing service, property, frequency and extra-ID mappings remain intact.
- Receiver status reports filled, needs review, partial transfer or unavailable. It checks two stable field readbacks, supports late-mounted controls, limits writes and protects existing/customer-edited values, including browser-assisted edits.
- Failed encryption never silently falls back to a URL containing personal answers. The customer can retry, return to their answers, or explicitly continue with service selections only and enter personal information at BookingKoala.
- Browser-back protection resets the funnel's handoff lock. Receiver history restores retain customer edits and can reopen an unexpired encrypted envelope.

## How personal information travels

1. The funnel builds its existing field-mapping contract in memory.
2. `/api/booking-handoff.php` seals only allowlisted contact/address/custom-answer fields using AES-256-GCM and a dedicated server-side secret stored outside `public_html`. Nothing is persisted in a database by this endpoint.
3. Service selections remain in the normal BookingKoala query string. Personal answers travel as an authenticated encrypted envelope in `#dc_handoff=…`, not as plain-text navigation parameters.
4. The BookingKoala-side receiver removes that fragment when session storage is available, retains ciphertext only for reload/back recovery, and asks the endpoint to decrypt it.
5. The receiver fills visible native controls through normal input/change/blur events. It does not touch the calendar, Stripe iframe, consent or submit buttons.

The envelope expires after 20 minutes. It is a bearer capability, not a one-time token: someone possessing it can redeem it until expiry. CORS is a browser restriction, not authentication against arbitrary HTTP clients. The endpoint grants no account, customer-database or booking API access. Do not log request bodies, tokens or secrets in monitoring. Other scripts on the booking page can see the filled form as they can see ordinary user input; encryption does not change that trust boundary.

Legacy query parameters remain accepted by the receiver for compatibility and controlled synthetic testing. The new funnel does not navigate with those personal parameters.

## Verification completed

The SiteGround endpoint includes a PHP integration test for AES-GCM seal/unseal, origin and action separation, tamper rejection, field allowlisting, response headers and the request-size limit. The locally installed PHP 8.3 build does not include its OpenSSL extension, so that two-test integration group is skipped on this computer; PHP syntax and security-contract tests pass. It must run and pass against SiteGround before launch. SiteGround documents PHP management in Site Tools and says its servers default to PHP 8.2.

The automated checks that run locally cover field validation, personal/public parameter separation, endpoint origin/expiry/crypto contracts and safe failures. A small DOM fixture exercises native-control writes, delayed controls, ambiguity rejection and edit protection; it does not simulate Angular's internal model.

The exhaustive mapping test evaluates 9,100 input combinations across Standard and Move In/Out, five home types, supported bedroom/bathroom/half-bath counts and all four incoming frequency choices. Move In/Out correctly stays one-time. These are automated mapping combinations, not 9,100 live bookings.

Five public live cases successfully transferred all requested custom answers, collectively covering all five cleanliness values, all four flexibility choices, all four parking choices and the four entry choices exposed by the funnel. Native service summaries verified:

| Case | Native selections | First total incl. tax | Recurring total shown |
| --- | --- | ---: | ---: |
| 1 | Standard, one-time, condo, 2 bed / 1 full / 0 half | $177.45 | — |
| 2 | Standard, weekly, bungalow, 3 bed / 2 full / 1 half, Deep Cleaning + Inside Oven | $469.64 | $207.73 |
| 3 | Move In/Out, basement suite, 3 bed / 2 full / 1 half | $460.68 | — |
| 4 | Standard, bi-weekly, duplex, 4 bed / 3 full / 2 half | $355.69 | $302.34 |
| 5 | Standard, every four weeks, two-storey house, 5 bed / 4 full / 3 half | $441.21 | $397.09 |

These figures are observations of BookingKoala's test summaries, not new price constants or a guarantee of every basket's parity. The first case also verified street/unit/city/province/postal code and the explicit lockbox note. Its address appeared in BookingKoala's native summary, and changing frequency updated the recurring total. A later customer city edit remained Calgary instead of being overwritten with the original Edmonton value.

No date, card or final booking submission was tested. A success banner verifies visible form values, not a saved booking record. Full frontend-through-encryption-to-BookingKoala testing remains blocked by deployment access. Browser-specific address autocomplete, real contact masking, encrypted reload/back/expiry and a consented end-to-end booking still belong in launch QA.

## Deployment and rollback

1. Build and upload the site to the SiteGround staging document root. Vite copies `public/api/booking-handoff.php` into `dist/api/booking-handoff.php`.
2. Generate a new cryptographically random secret of at least 32 characters. Copy `hosting/siteground-private/booking-handoff-secret.php.example` to `/home/customer/www/mikaily131.sg-host.com/private/booking-handoff-secret.php`, outside `public_html`, and put the secret there. Do not reuse the GHL integration token or expose the secret in source, chat, URLs or logs.
3. Verify the PHP endpoint returns 200 for a staging-origin seal request and allows unseal only from the BookingKoala origin. Confirm rejection/expiry paths, real browser field readback and history behavior.
4. Before the final DNS switch, change the receiver endpoint from the staging host to `https://dutycleaners.ca/api/booking-handoff.php`, regenerate `bk-header-fill.html`, and Save & Publish it in BookingKoala after the production endpoint is reachable.
5. Resolve the separate existing GHL durable-receipt relay deployment/migration requirements before a full funnel test. Do not weaken the existing contact gate to bypass that dependency.
6. Only then publish the rebuilt frontend and test the complete journey with owner-approved contact data. Do not auto-submit a real booking during tests.

Receiver publication location: BookingKoala → Theme Builder → Settings → Tracking & Conversion → Header code. Both Header and Footer fields were empty before this change. Only Header was changed. To roll back this receiver, remove the marked `Duty Cleaners booking handoff v2` block and Save & Publish, preserving any later additions. Regenerate the header snippet after any edit to `bk-prefill-v2.js`.

Keep `BOOKING_MODE` set to `redirect`. The dormant `/book` embed shell now accepts the encrypted fragment, but that is not evidence the iframe journey has been tested. Do not switch modes until the same-site booking domain and iframe flow are separately verified.
