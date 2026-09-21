# Funnel and launch implementation — 2026-09-12

This is the handoff for the implementation that follows the owner's settled decisions:

- name, email and phone remain required before the complete price and extras;
- BookingKoala remains the only availability and booking authority;
- the initial launch uses the prefilled redirect, not the iframe;
- temporary generated lifestyle imagery is allowed until the real shoot replaces it.

## Implemented in the repository

1. The browser quote request has a bounded deadline and a visible same-request retry.
2. Lead and confirmation submissions carry separate idempotency UUIDs.
3. A successful lead capture requires the SiteGround encrypted queue to return a durable receipt ID. A relay failure no longer hides the locally calculated price: the customer sees the price with a precise, non-blocking retry notice, and the same idempotent request is retried from that screen and before BookingKoala opens.
4. GHL delivery runs through `public/api/ghl-quote.php` and is recorded as pending, delivered or failed outside `public_html`.
5. Failed deliveries have a protected retry operation, exponential retry dates and a six-attempt limit.
6. The final price, extras and cleaner details receive a bounded, keepalive-enabled save before BookingKoala opens.
7. The SiteGround test host and the two exact development origins are allowed; loose `localhost` matching is gone.
8. The handoff says that secure booking is opening and that an available time is chosen next. It makes no reservation claim.
9. The contact screen explains phone use, consent, payment timing and links to the privacy policy.
10. Funnel events now use `quote_started`, `property_details_completed`, `quote_price_view`, `contact_submitted`, `quote_revealed`, `extras_selected`, `booking_handoff_succeeded` and `booking_handoff_failed`. `generate_lead` remains because it is GA4's recommended lead event and fires only after durable lead capture succeeds.
11. First-touch Google Ads and UTM values are carried into the BookingKoala URL using BookingKoala-supported UTM parameters. Arbitrary keys cannot pass.
12. Responsive generated heroes are wired into the Alberta, Edmonton, Calgary and Red Deer landing pages. The Alberta location selector now includes the third branch and no longer implies that Red Deer has Google reviews.

## Production relay status (SiteGround)

Supabase is not used by the production quote path. On 2026-09-20 the private SiteGround config,
encrypted queue and five-minute CLI retry cron were installed. The receiver now returns the durable
receipt before contacting GHL, so an upstream delay cannot create a false customer-facing failure.
A production browser test created/updated the GHL contact, added the confirmation tag, ran the
published workflow, sent the SMS and admin notification, created the New Lead-Forms opportunity,
removed `instant-quote`, and finished successfully.

SiteGround's server clock was about three minutes behind the browser during launch. The receiver's
anti-spam timing check was corrected so only a non-negative elapsed time below three seconds is
treated as an instant submission. Preserve this guard in future relay rewrites.

## BookingKoala account work

1. Paste the repository-root `bk-header-fill.html` into Theme Builder → Settings → Tracking & Conversion → Header code.
2. Use a controlled test to verify name, email, phone, postal code, service, frequency, bedroom/bathroom parameters, deep package, each extra quantity, access, parking, home condition and notes.
3. Confirm UTM source, medium, campaign, ID, term and content appear in BookingKoala's attribution/reporting where supported.
4. Keep `BOOKING_MODE` as `redirect`.
5. Later connect `book.dutycleaners.ca` as BookingKoala's custom subdomain. Change `BOOKING_ORIGIN` only after DNS, login, payment and mobile tests pass.

BookingKoala's public roadmap still describes an open API as gathering feedback. Do not build a custom availability calendar or scrape private endpoints.

## BookingKoala → LeadConnector/GHL automations

Create separate Zaps and use BookingKoala booking `id` as the deduplication key:

| BookingKoala trigger | Filter | LeadConnector action |
|---|---|---|
| New Booking | `booking_source = Customer`; distinguish `is_first` | Find/create contact, store booking ID, mark the opportunity Booked, stop abandoned-quote workflow |
| Booking Updated | Existing booking ID | Update scheduled date, arrival window and price fields |
| Booking Cancelled | Existing booking ID | Mark Cancelled; start only the approved recovery workflow |
| Booking Completed | Existing booking ID | Mark Service Completed; do not treat this as web checkout |
| Booking Charged | Existing booking ID | Mark Paid and record total/revenue |
| Booking Charge Declined | Existing booking ID | Start the approved payment-recovery workflow |

Automatic recurring bookings must not be counted as new website acquisitions. BookingKoala owns booking confirmations and schedule reminders; GHL owns quote recovery and sales nurture. Review every SMS/email so the two systems do not send duplicates.

## Analytics checks

1. Keep preview and SiteGround analytics off; the production-host guard already enforces this in code.
2. In GA4 keep outbound clicks, form interactions and history-driven page views off because the site sends privacy-filtered events itself.
3. Keep email and BookingKoala contact-query redaction on, Google Signals off and ad-personalization consent denied.
4. Treat `booking_handoff_succeeded` only as an intermediate event. It means the BookingKoala page opened with the handoff payload; it is not evidence that the customer found an available time or completed a booking. Do not mark it as a GA4 key event for booked revenue.
5. Import or send verified `New Booking` and `Booking Charged` events as the primary booking and revenue outcomes after the Zapier reconciliation exists.
6. Never send names, email, phone, postal code, addresses, notes, payment details or access instructions to GA4.

## Hosting and launch checks

- Build and prerender all pages before upload.
- Upload the generated `.htaccess`; it gives only `mikaily131.sg-host.com` an `X-Robots-Tag: noindex, nofollow` header.
- Verify that the real `dutycleaners.ca` response does not carry that header.
- Run the complete quote-to-booking test on mobile and desktop.
- Verify redirects, canonical tags, sitemap, robots, JSON-LD, 404s, security headers and cache headers on the hosted copy.
- Publish the GHL workflow only after its tags/stages match the automation table above.
- Replace generated people imagery with real, permission-cleared photography when the shoot is available.

## Sources used for the boundary design

- BookingKoala query parameters and preselection: https://help.bookingkoala.com/help/pre-select-fields-on-the-booking-form
- BookingKoala UTM tracking: https://help.bookingkoala.com/help/utms
- BookingKoala Zapier triggers and fields: https://help.bookingkoala.com/help/zapier-integration
- Supabase background tasks: https://supabase.com/docs/guides/functions/background-tasks
- Supabase scheduled Edge Functions: https://supabase.com/docs/guides/functions/schedule-functions
- GA4 cross-domain measurement: https://support.google.com/analytics/answer/10071811
