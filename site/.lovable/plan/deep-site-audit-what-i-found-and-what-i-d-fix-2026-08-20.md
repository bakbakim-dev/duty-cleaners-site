# Deep site audit — what I found and what I'd fix

I audited everything outside the homepage and the quote funnel: all service and city pages, ~160 neighborhood pages, the blog, About, FAQ, Contact, Careers, Gift Cards, Locations, legal pages, the 404, plus the global shell (nav, footer, routing, performance, accessibility).

The funnel itself is in good shape now. The problems left are **credibility leaks, silent dead-ends, and speed** — the three things that quietly cost the most bookings.

## The honest summary

Three findings matter more than everything else combined:

1. **We're publishing review numbers we agreed never to publish.** "4.9/5" appears on Reviews, Contact, Locations and the brand home, and "300+ / 200+ reviews" appears on Locations and BrandHome — while our own source of truth deliberately stores these as "unknown". They also contradict each other page to page. One skeptical visitor cross-checking Google finds a mismatch, and every other claim on the page loses weight.
2. **Two hard factual claims are unverified.** The Insurance page states "$2,000,000 commercial liability insurance… active and in good standing" while our data file marks the coverage amount as unconfirmed. About still carries "since 2015" in one place and "since 2017" everywhere else.
3. **Two forms tell people they succeeded when nothing was sent.** The careers application shows "Application submitted!" after a fake 1-second timer, and the blog newsletter box has no handler at all. Every applicant who used it is lost.

Everything else below is real but secondary.

## Phase 1 — Credibility and lost leads (do first)

- Replace every hardcoded rating/review count with the shared proof data, falling back to "Five-Star Rated" language when a real number isn't available (Reviews, Contact, Locations, BrandHome).
- Remove the unverified $2M insurance figure; state coverage in qualitative terms ("bonded and insured — certificate available on request") until the real number is confirmed.
- Fix "since 2015" on About and delete the leftover duplicate title/description code that fights the page's own metadata.
- Wire the careers application to the same lead relay the contact form uses, so applications actually arrive; make the blog newsletter box either functional or remove it rather than fake a success.

## Phase 2 — Dead ends and wasted traffic

- Rebuild the 404 page with the real header, footer, a short apology, the phone number, top service links and a primary "See My Instant Price" button. Today it's an unbranded text link and a hard exit.
- Fix the move-in/move-out canonical URLs, which currently point at an address that doesn't exist on the site — search engines are being told to index a dead URL.
- Add the missing page titles/descriptions to six city service pages (Edmonton/Calgary regular, deep, recurring) that inherit whatever page the visitor came from, and add canonical tags to the two commercial pages.
- Add an end-of-article booking CTA to blog posts that don't have one, so content traffic has somewhere to go.

## Phase 3 — Speed and navigation

- **Code-split the routes.** Every one of ~212 pages is loaded up front, so a first-time visitor downloads all 160 neighborhood pages and every blog post before the homepage paints. Lazy-loading the routes is the single biggest speed win available and directly affects mobile conversion.
- Add lazy loading to the ~55 neighborhood page images that are missing it.
- Split or rename the "Company" menu (six unrelated destinations under one label) and pull Blog out where it can be found.
- Mobile menu: trap focus while open, close on Escape, and mark it as a dialog — right now keyboard users tab into the hidden page behind it.
- Respect "reduce motion" for the remaining animations (blob, glow, shake, dropdown slides); only the ticker is currently gated.

## Phase 4 — Consistency polish

- Move the repeated raw `#1a365d` / `text-white` values on ~15 pages onto the existing navy/gold tokens so future brand changes are one edit, not fifty.
- Add jump links to the FAQ page (10+ sections, no way to navigate).
- Give the neighborhood template pages at least one genuinely local paragraph each over time; ~160 near-identical pages is a thin-content risk.

## Technical notes

- Files most affected: `src/pages/Reviews.tsx`, `Contact.tsx`, `Locations.tsx`, `BrandHome.tsx`, `InsuranceLiability.tsx`, `AboutUs.tsx`, `JoinTheTeam.tsx`, `Blog.tsx`, `NotFound.tsx`, the six city service pages, `src/App.tsx`, `src/components/Navigation.tsx`, `src/index.css`.
- Ratings/counts read from `src/data/proof.ts`; no new numbers introduced anywhere.
- Careers submission reuses `submitQuote` in `src/lib/quote-submit.ts` with a `careers` tag; success state only on a real 2xx.
- Route splitting via `React.lazy` + a single `<Suspense>` shell fallback in `src/App.tsx`; city/homepage routes can stay eager so the primary landing paths are unaffected.
- No funnel, pricing, or BookingKoala handoff logic changes in any phase.

## One question before I start

Phase 1 removes the "$2,000,000 insurance" claim and all "4.9/5 / 300+ reviews" figures. If you can confirm the real coverage amount and want the true Google rating shown, I'll wire the live figures instead of removing them.
