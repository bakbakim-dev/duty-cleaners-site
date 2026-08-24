# Two booking bugs + accessibility leftovers

## Bug 1 — Phone corruption at the booking handoff (P0)

Today the booking URL builder strips non-digits and sends whatever remains. An autofilled
`+1 780 555 0199` becomes an 11-digit string and BookingKoala's mask renders it as a wrong
number.

Fix: one shared normalizer used by the booking-URL builder.

- Strip non-digits.
- Drop a leading `1` when the result is 11 digits.
- Send `phone` only when exactly 10 digits remain; otherwise omit the parameter entirely.

The lead payload sent to the CRM is untouched and keeps its `+1…` format.

Tests to add: `(780) 555-0199`, `780.555.0199`, `1-780-555-0199`, `+1 780 555 0199`,
`+17805550199` all produce `7805550199`; `555-0199` produces no phone parameter.

## Bug 2 — Back-button trap on the handoff screen (P0)

Coming back from the booking page re-mounts the interstitial, which fires the redirect again
and traps the visitor.

Fix:

- When the interstitial performs the redirect, record a `handoffFired` flag in sessionStorage.
- On mount, if that flag is set — or the navigation is a back/forward one
  (`PerformanceNavigationTiming.type === "back_forward"`) — do not redirect. Show Step 3 with
  the visitor's quote intact instead.
- Clear the flag whenever the Step 3 booking CTA is clicked fresh, so a genuine second attempt
  still works.

## Accessibility leftovers

1. **Image alt text** — a scan shows every `<img>` in the project already carries an `alt`
   attribute, so nothing is structurally missing. What I will do instead is review the alt text
   on the informational images (hero, gallery, city, service photos) and rewrite generic or
   filename-style descriptions into meaningful ones, and set `alt=""` where the image is purely
   decorative. If you have the specific list of 10 images from the audit, send it and I will
   target those exactly.
2. **Tap targets under 24px** — pad the pricing-table row links and remaining inline text links
   to a minimum 24px target, using 44px effective height wherever the layout allows
   (WCAG 2.2 SC 2.5.8). Covers the Edmonton/Calgary pricing pages, pricing cards, and inline
   links inside the funnel and city pages.
3. **14px form inputs** — the shared input component drops to 14px at desktop widths
   (`md:text-sm`). Remove that so all inputs stay at 16px, which also prevents iOS focus-zoom.
   Same treatment for textarea and select controls.

## Technical notes

- Phone normalizer lives in `src/lib/booking-redirect.ts` and is exported for reuse and tests;
  `buildBookingQuery` calls it instead of inlining `replace(/\D/g, "")`.
- CRM submission in `src/lib/quote-submit.ts` is not modified.
- Back-guard logic sits in `src/components/quote/BookingHandoff.tsx` (flag write + navigation
  type check) and `src/components/quote/QuoteFlow.tsx` (flag clear on CTA, render Step 3 when
  guarded).
- Input sizing change in `src/components/ui/input.tsx` (and textarea if it shares the pattern).
- Verification: extend `src/lib/booking-redirect.test.ts` with the phone cases and run the full
  suite plus a typecheck.
