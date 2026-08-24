# Embedded BookingKoala checkout at /book (behind a flag)

Redirect stays the default and the rollback. Everything below is built and switched on by one constant once `book.dutycleaners.ca` is live.

## Verified current state

- `src/lib/booking-redirect.ts` holds `BOOKING_ORIGIN`, `BOOKING_MODE`, `buildBookingQuery()`, `buildBookingUrl()`, and `buildBookingEmbedUrl()` — the single source of truth for the booking host and the BookingKoala option IDs.
- `/book` (`src/pages/Book.tsx`) and `BookingEmbed.tsx` are built: stable iframe src, `embed.js` (iframe-resizer) injection, navy skeleton, 8s fallback link, and auto-redirect to the full page on error/blocked.
- `QuoteFlow.tsx` branches `goToBooking`: embed mode navigates to `/book`; redirect mode keeps the interstitial. Preconnect/dns-prefetch for `BOOKING_ORIGIN` are emitted from `QuoteFlow`'s Helmet block.
- `BOOKING_MODE` is currently `"redirect"`, so customers see no change yet.

## False alarm — no revert, no BK support ticket

The earlier 403 + `X-Frame-Options: sameorigin` was Cloudflare's bot-challenge page (challenge pages carry that header themselves), not the BookingKoala app refusing to be framed. XFO is a browser render directive on a 200 response and cannot produce a 403. The sandbox's requests get bot-scored and blocked, so that environment cannot validate this embed at all.

Verified from a real browser against the live account:
- `/booknow?embed=true` loads normally top-level.
- Framed from a foreign origin, the form fully boots: BK's `embed.js` completed the iframe-resizer handshake and auto-resized the iframe 900px → ~7400px. Zero XFO console errors.
- Prefill works with `embed=true`: `f_name`/`l_name`/`email` populated, frequency pre-selected.

## What remains

1. Leave `BOOKING_MODE='redirect'` until the custom domain `book.dutycleaners.ca` is live (same-site with `dutycleaners.ca` exempts the iframe's cookies from third-party partitioning — the reason to gate on the domain).
2. When the domain is live: flip `BOOKING_ORIGIN` to `https://book.dutycleaners.ca` and `BOOKING_MODE` to `"embed"` in the one module.
3. Run tests 1–6 only from a real browser on the production domain — never from the sandbox:
   - Prefill passthrough (service, frequency, bedrooms, baths, half baths, home type, name, email, phone all pre-selected).
   - Auto-height through the whole form (extras, date-picker, payment) — no inner scrollbar, nothing clipped.
   - One real test booking end-to-end inside the embed (test card), then delete in BK admin.
   - Existing-customer login inside the frame (Safari as the cookie canary).
   - Mobile iOS Safari + Android Chrome.
   - Browser back from `/book` returns to Step 3 with the quote still displayed.
4. Keep the 8s fallback link and auto-redirect exactly as built — they are the correct graceful path for the rare real visitor whose iframe request gets Cloudflare-challenged (a challenge can't render inside a frame, so those visitors fall through to the full booking page).

## Rollback

`BOOKING_MODE = 'redirect'`.
