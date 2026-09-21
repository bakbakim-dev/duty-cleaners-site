# Duty Cleaners form-health monitoring

## What is covered

The system watches all four customer submission paths in this repository:

1. Instant-price funnel lead capture and final confirmation.
2. Contact form.
3. Cleaner application form.
4. Encrypted BookingKoala transfer.

The browser reports relay HTTP errors, timeouts, network failures and malformed
success responses. The GoHighLevel relay independently reports durable-storage
failures, missing configuration and failed GHL delivery attempts. A later
successful attempt sends a recovery notice.

The reporting contract does not accept arbitrary messages or form fields. Logs
and notifications contain only the form name, step, failure category, numeric
HTTP status, pathname and UTC timestamps. Names, emails, phone numbers,
addresses, postal codes, enquiry messages, booking notes and access instructions
are never sent to this system.

Repeated reports for the same form and step are logged but generate at most one
successful notification per 30 minutes. If every configured delivery channel
fails, the next failure report retries the alert after 60 seconds. The first
recovery after an open incident generates one recovery notification. The
privacy-safe event log rotates at 5 MB by default.

## SiteGround setup

Production status (2026-09-20): the endpoint and private configuration are installed on
`dutycleaners.ca`. A controlled production `booking-handoff` failure, immediate duplicate and
recovery proved the full alert cycle: the first HTTP 503 report was recorded and sent, the
duplicate was recorded without a second notification, and the HTTP 200 recovery was recorded and
sent. Gmail showed exactly one problem message and one recovery message, both in the
`info@dutycleaners.ca` inbox. SPF, DKIM and DMARC passed. The SiteGround-native GHL relay is live
and a controlled production quote completed its GHL workflow. Independent UptimeRobot monitoring
was configured on 2026-09-20 with five-minute checks and immediate email alerts to
`info@dutycleaners.ca`: homepage HTTP, homepage content (`Duty Cleaners`), form-health response
content (`"alerts_enabled":true`) and BookingKoala content (`Duty Cleaners`). Periodic controlled
failure/recovery retests remain outstanding. All four completed their first external check as Up
with 100% uptime and zero incidents.

1. Build and upload the site normally. This publishes
   `public/api/form-health.php` as `/api/form-health.php`.
2. Use an authenticated sender accepted by the hosting mail server. The staging
   installation currently uses a SiteGround-authenticated sender; the alert
   recipient is `info@dutycleaners.ca`. Ensure SPF, DKIM and DMARC pass, then send
   a real failure and recovery test and inspect delivery outside the website host.
3. Copy `private-examples/form-health-config.php.example` to
   `/home/customer/www/<host>/private/form-health-config.php`, beside
   `public_html`, not inside it. Replace the shared secret with a cryptographically
   random value of at least 32 characters. Set the desired recipient address.
4. Open `/api/form-health.php` in a browser. It must return:
   `{"ok":true,"service":"form-health","version":1,"alerts_enabled":true}`.
5. Submit a controlled failure event from the staging origin and verify both the
   email and the private `form-health/events.jsonl` record. Repeat it immediately
   and confirm the duplicate is logged without a second email. Send a recovery
   and confirm the recovery email.

If the preview remains on Netlify while the endpoint is on SiteGround, set
`VITE_FORM_HEALTH_ENDPOINT=https://mikaily131.sg-host.com/api/form-health.php`
for that preview build. On the final same-origin SiteGround deployment, leave it
blank.

## GoHighLevel relay setup

The production relay is `public/api/ghl-quote.php`, with secrets stored in the SiteGround private
configuration outside `public_html`; Supabase is not part of this path. Keep the form-health URL
and shared secret in that private configuration, never in frontend code or public logs.

This server-to-server path matters because a lead can be safely stored and the
browser can receive a receipt while GoHighLevel delivery is still failing in the
background. Browser monitoring alone cannot see that state.

## Independent availability check

The PHP endpoint cannot report that SiteGround itself is unavailable. UptimeRobot now checks it
externally every five minutes and requires the JSON field `"alerts_enabled":true`. Separate monitors
check the homepage HTTP response, the homepage's `Duty Cleaners` content and BookingKoala's
`Duty Cleaners` content. All four send immediate alerts to the Google Workspace mailbox
`info@dutycleaners.ca`, which is independent of the website host. Revisit a paid multi-location
option only if the business needs faster or region-specific checks.

An endpoint health check proves that the monitor is reachable; it does not prove
a real lead can traverse every dependency. Before launch, and after changes to
the funnel, GHL, SiteGround PHP or BookingKoala, run one controlled
end-to-end submission and verify the durable lead row, GHL contact and booking
field transfer.
