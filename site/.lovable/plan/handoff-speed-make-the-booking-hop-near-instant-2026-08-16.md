# Handoff speed: make the booking hop near-instant

The interstitial stays as the safety net. The goal is that most customers see only a flash of it.

## Verified current state

- `QuoteFlow.tsx` already builds `bookingQuery` in a `useMemo` (recomputed when service, home, frequency, deep intent or contact change) and derives `bookingUrl` from it. The CTA uses that exact URL.
- The Helmet block on the funnel already emits `preconnect` + `dns-prefetch` for `BOOKING_ORIGIN`. These stay.
- `BOOKING_MODE` is `"redirect"`; embed mode is built but off.
- `BookingHandoff.tsx` shows its fallback link after 5000ms.

## 1. Speculation Rules prefetch (redirect mode, ships now)

On the price step (step index 2), inject a `<script type="speculationrules">` into `<head>` containing:

```text
{ "prefetch": [{ "urls": ["<bookingUrl>"], "eagerness": "immediate" }] }
```

- Managed by an effect keyed on `bookingUrl`: rewrite the script's contents whenever the URL changes (frequency chip, bedroom edits), remove it when leaving step 3 or unmounting. A single reused node id keeps it from stacking.
- Only injected when `BOOKING_MODE === "redirect"` and `bookingUrl` is non-null.
- Progressive enhancement only: Chrome/Edge honour it, Safari/Firefox ignore an unknown script type silently. Nothing in the flow gates on it, and the existing preconnect tags stay as the cross-browser warm-up.
- Cross-site prefetch is skipped by Chrome for visitors who already hold `bookingkoala.com` cookies, i.e. it helps exactly the new customers who need it. When `BOOKING_ORIGIN` flips to `book.dutycleaners.ca` the same rule becomes same-site and applies to everyone — no code change needed then.

## 2. Embed warm-up (behind the existing embed flag)

When `BOOKING_MODE === "embed"` and step 3 is showing, mount the booking iframe hidden (`visibility: hidden`, zero-height wrapper, `aria-hidden`, not `display:none` so it actually loads) using the final embed src. On "Choose my date & time", navigate to `/book` as today — the warmed connection, cookies and cached document make the visible frame paint immediately. No interstitial in embed mode (already the case). The 8s fallback link and auto-redirect in `BookingEmbed` stay untouched, error path only.

Honest caveat: a React Router navigation unmounts the funnel, so `/book` creates a fresh iframe element — the win is HTTP cache + warm TLS + BK session, not literal frame reuse. This ships dormant with the flag either way.

## 3. Interstitial tune

`BookingHandoff.tsx`: fallback-link timer 5000ms → 3000ms. Copy unchanged.

## Files

- `src/components/quote/QuoteFlow.tsx` — speculation-rules effect, hidden embed warm-up on step 3.
- `src/components/quote/BookingHandoff.tsx` — 3s timer.

## Verification

- Unit/build check plus a browser pass on step 3: assert the `speculationrules` script exists, its JSON URL equals the CTA href, and it changes when a frequency chip is toggled.
- Confirm no console errors in a non-Chromium engine path (rule ignored silently).
- Throttled-3G click-to-paint is measured in a real browser on the live domain; the sandbox is bot-challenged by the booking host and cannot validate it.
