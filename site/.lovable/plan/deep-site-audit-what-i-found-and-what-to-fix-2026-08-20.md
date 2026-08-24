# Deep Site Audit — What I Found and What to Fix

Two full audits (conversion/UX and SEO/performance) plus my own verification pass. The funnel itself is in good shape now, so everything below sits outside it. Every item was confirmed in the code, not assumed.

## The honest headline

The site converts well where it has been worked on (hero funnel, city pages). The weak spots are now the *edges*: trust pages that dead-end, forms that behave worse than the funnel, a mobile bar that covers the bottom of almost every page, and page weight.

---

## Priority 1 — Real defects hurting visitors right now

**1. Mobile sticky CTA bar covers the bottom of nearly every page.**
The bar is fixed to the bottom and only auto-hides on pages containing the `how-it-works` / `who-we-help` / `quote` sections — i.e. the homepage variants. On Contact, FAQ, blog posts, gift cards, all ~200 neighborhood pages and every trust page it stays up permanently, and nothing adds compensating bottom padding, so the last ~70px of the footer sits underneath it on mobile.
Fix: add bottom padding on mobile when the bar is visible (plus iOS safe-area inset), and hide the bar once the footer enters view.

**2. Trust pages are conversion dead ends.**
Insurance & Liability, Satisfaction Guarantee and Privacy Policy have no in-page CTA at all. People reading "are you insured?" and "what if I'm not happy?" are high-intent buyers. Fix: add the same dual CTA block the 404 page already uses (instant price + call), plus a short proof strip.

**3. Gift card selection is silently dropped.**
Gift card buttons send `?topic=gift-card&design=…` to Contact, and Contact never reads query params — the visitor's choice disappears and they retype it. Fix: read the params, preselect the subject and show a confirmation line ("Gift card — Classic design").

**4. Contact and Join-the-Team forms lag the funnel on mobile.**
Contact's phone field has no `type="tel"` / `inputMode` (QWERTY keyboard instead of dialer), and neither form sets `autoComplete` on name/email/phone/city. The funnel already does this properly. Fix: bring both forms up to the funnel's standard.

**5. Wrong phone number on one page.**
The Calgary Airbnb page shows (587) 800-0451 in two places instead of (403) 768-1341 — inconsistent NAP hurts local SEO and loses calls.

---

## Priority 2 — Performance (this is your biggest SEO lever)

- Two team photos are saved as PNG at **2.7MB and 2.3MB**; plus a 1.4MB bathroom photo and a 1.2MB hero. Convert to WebP at sensible dimensions — expect ~90% smaller with no visible difference.
- **145 of 204 `<img>` tags have no width/height**, which causes layout shift (a Core Web Vitals ranking factor). Mechanical fix.
- Main JS bundle is **818KB (220KB gzip)** because the homepage is eagerly imported. Split the heaviest below-the-fold homepage sections so first paint ships less.

## Priority 3 — SEO cleanups

- Missing canonical tags on `/book`, `/blog`, `/join-the-team`, and both post-construction pages.
- `/book` missing from the sitemap.
- `/locations` (BrandHome) opens with an `<h2>`, no `<h1>` on the page. (I checked the other pages flagged as "missing h1" — they get theirs from shared components and are fine.)
- The 13 neighborhood pages that use the shared `LocationPageTemplate` are near-identical: same hero image, same service list, same copy, only the name changes. Give each a unique intro paragraph and a local image, or accept the thin-content risk knowingly.
- JSON-LD in `LocationPageTemplate` renders in the body instead of inside `<Helmet>` — inconsistent with the rest of the site.
- The showcase video has no captions track.

---

## Proposed build order

1. Mobile sticky bar padding + footer-aware hiding
2. CTA + proof blocks on the three trust pages
3. Gift-card context carried into Contact; form input/autocomplete parity on both forms
4. Calgary Airbnb phone number correction
5. Image compression (4 files) and width/height on images
6. Canonicals, `/book` sitemap entry, `/locations` h1, JSON-LD placement
7. Optional: unique copy for the 13 templated neighborhood pages

### Technical notes
- Sticky bar logic lives in `Navigation.tsx` (IntersectionObserver on section ids); add a footer sentinel and a `pb-[…]` utility applied via a layout wrapper so no page needs individual edits.
- Contact/GiftCards handoff via `useSearchParams` into the existing zod form defaults.
- Image conversion done in-repo with re-encoded WebP assets; imports updated in place.
