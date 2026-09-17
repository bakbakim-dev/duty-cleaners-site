# Launch-day reminder — owner request, September 13, 2026

When the owner announces launch or readiness to go live in this conversation, bring up this checklist and recheck the latest code and deployment evidence. A daily thread heartbeat is also registered as `duty-cleaners-launch-checklist`; it stays quiet until that announcement. Do not mark an item complete merely because its source code exists.

SiteGround is the chosen production host. `mikaily131.sg-host.com` is the staging host. Earlier instructions to buy Netlify production capacity are superseded by the owner's SiteGround decision.

## Before switching production traffic

- Back up the existing WordPress site and database, record current DNS and email records, and prepare a rollback. Confirm the actual deployment target and HTTPS certificate. Preserve working MX, SPF, DKIM and DMARC records during the change.
- Build and prerender the complete website; upload the generated Apache rules and PHP endpoints, including hidden files. Verify existing indexed URLs, permanent redirects, slash/host normalization, real 404 status and canonical URLs.
- Turn OFF NGINX Direct Delivery on the production SiteGround site (Site Tools → Speed → Caching → NGINX Direct Delivery). It is per site, so a new site for the real domain starts with it ON. While ON, nginx serves static files before Apache reads `.htaccess` and imposes its own TTLs — 180 days on `robots.txt`, `sitemap*.xml`, `llms.txt` and any `index.html` fetched by file name, one year on `logo.png`, `og-image.jpg` and `favicon.ico` — which defeats the content-dates ledger's sitemap refresh and the hourly revalidation of stable-named images. Disabled on `mikaily131.sg-host.com` 2026-09-17; verified live that every type then matches the generated rules (HTML `max-age=0, must-revalidate`, sitemaps/robots 1 h, images 1 h, `/assets/` one year immutable). Dynamic Cache and the CDN honour these headers, so they may stay on.
- Apply the pending lead delivery queue migration before redeploying `ghl-quote`; rotate the exposed GHL token and update the server secret together. Set the retry secret and activate the scheduled retry job. Verify allowed staging/production origins and durable receipt compatibility.
- Publish and test the GHL Instant Quote Automation workflow after its filters and stages are correct. Check staff notification, customer communication, and pipeline entry. Confirm all three forms deliver their content, including contact messages and application details, rather than only creating a contact.
- Install the BookingKoala PHP handoff secret outside public_html. Verify encryption support, expiry, origin controls and real field transfer. Point the published BookingKoala receiver at the reachable production endpoint when launching; verify the matching receiver version.
- Test the funnel, contact form and cleaner application on mobile and desktop. Check successful submission, timeout, retry, saved contact, displayed price, extras, complete service address, cleanliness, parking, entry instructions and flexibility. Keep name/email/phone before price, preserve answers on failure, and do not conceal the calculated price if lead capture fails.
- Test BookingKoala availability, transferred field readback, final total/GST and booking confirmation using an approved controlled booking. The website handoff itself is not a completed booking.
- Deploy form-health monitoring with its private recipient/sender configuration and shared relay secret. Confirm actual alert inbox delivery, duplicate grouping and recovery delivery. Check the monitor's failure handling, reporting latency, access/privacy protections and log storage limits before relying on it. A local test is not proof of live email delivery.
- Set up independent uptime monitoring and a destination outside the website host for alerts. Confirm site, alert endpoint and booking-page failures are detected. This remains unconfigured until there is deployment evidence.

## At the domain switch

- Confirm production has no staging password/noindex/X-Robots-Tag or accidental robots block. Keep staging and obsolete previews protected from indexing. Check rendered page content, production canonicals, sitemaps and JSON-LD on the actual host.
- Verify GA4 loads on production only and events arrive without personal information. Confirm existing redaction/enhanced-measurement settings. Treat booking_handoff as an intermediate event; use verified bookings and paid events for completed outcomes when integration is configured.
- Verify the Search Console domain property, submit production sitemaps, inspect key money pages and connect Bing Webmaster Tools. Preserve the same-domain migration's important existing URLs.
- Test phone/email links and every form again on the real domain. Verify incoming/outgoing business email after DNS changes. Inspect PHP/server errors and monitor alerts.

## Outstanding integrations and follow-ups

- Run the rendered-content date check (`bun run content-dates`) after the final build and full prerender. Review changes and explicitly approve their revision date, then rebuild/prerender again. Do not stamp all URLs with the launch date. Historical baseline dates remain inherited from the earlier build, not newly verified original publication dates.
- Confirm Red Deer gift-card redemption eligibility before adding it to gift-card claims. Recover the four unknown legacy article publication dates from WordPress if possible; until then, keep publication dates omitted and use labelled revision dates.
- Supply consent-cleared team/subcontractor profiles, real job photos and documented case examples. An owner's portrait is not required. Do not substitute invented jobs, certifications or generated people presented as staff.
- Use fresh query-by-page Search Console data, booking evidence and backlinks before approving any location-page consolidation (including Parkhill/Stanley Park and the Diamond Valley historical areas). Preserve the existing URLs until a specific retirement and redirect is approved.
- Measure production mobile Core Web Vitals and repeat the key booking journeys after hosting, caching and third-party integrations are active. Local checks do not establish field performance or live availability.
- Reconcile BookingKoala booking-created/updated/cancelled/completed/charged/declined events with GHL; deduplicate by booking ID and stop quote follow-up after booking. Confirm the exact supported triggers before setup. Avoid duplicate customer reminders or counting automatic recurring bookings as new acquisitions.
- Correct Edmonton Yelp address/duplicate issues and claim Calgary before reconsidering those links. Review Red Deer's business category and start requesting genuine customer reviews through the business's normal process.
- Replace generated people images with permission-cleared photographs of the actual team and jobs; retain the existing real-photo brief.
- Identify the optional alternative products if the owner wants them named. Keep current factual wording until confirmed.
- Retire obsolete public previews after confirming the replacement; do not delete the rollback backup.
- Review crawl/indexing errors, traffic and conversion changes after launch against the saved Search Console baseline.

Reference implementation details: `form-health-monitoring.md`, `booking-handoff-implementation-2026-09-12.md`, `funnel-and-launch-implementation-2026-09-12.md`, and the repository-root `CLAUDE.md`. Recheck dated statements before repeating them as current facts.
