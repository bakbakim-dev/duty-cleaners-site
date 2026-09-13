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
notification per 30 minutes. The first recovery after an open incident generates
one recovery notification.

## SiteGround setup

1. Build and upload the site normally. This publishes
   `public/api/form-health.php` as `/api/form-health.php`.
2. Create a mailbox or authenticated sender for
   `website-alerts@dutycleaners.ca`. Ensure SPF and DKIM are enabled for the
   domain in SiteGround, then send a real test and check delivery outside the
   domain.
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

Set these secrets on the `ghl-quote` Supabase Edge Function and redeploy it:

- `FORM_HEALTH_URL=https://dutycleaners.ca/api/form-health.php` (use the staging
  host until launch).
- `FORM_HEALTH_SECRET=<the same private shared secret>`.

This server-to-server path matters because a lead can be safely stored and the
browser can receive a receipt while GoHighLevel delivery is still failing in the
background. Browser monitoring alone cannot see that state.

## Independent availability check

The PHP endpoint cannot report that SiteGround itself is unavailable. Add its
public GET URL to an external uptime monitor after the staging host is public.
Check every five minutes from at least two locations, require HTTP 200 and the
JSON fields `"ok":true` and `"alerts_enabled":true`, and send alerts to a destination independent of the
website host. Also monitor the homepage and the BookingKoala booking page.

An endpoint health check proves that the monitor is reachable; it does not prove
a real lead can traverse every dependency. Before launch, and after changes to
the funnel, GHL, Supabase, SiteGround PHP or BookingKoala, run one controlled
end-to-end submission and verify the durable lead row, GHL contact and booking
field transfer.
