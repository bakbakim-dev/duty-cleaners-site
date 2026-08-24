# Audit remainder — what's real, what's already fixed

I checked each finding against the current code before planning. Five of the eight items are already done; three are real and one item is partly real. Details below, then the work.

## Already correct (no change needed)

- **Calgary phone (item 1)**: every Calgary page and Calgary neighbourhood page already renders `(403) 768-1341`; header and footer are city-aware (`Navigation.tsx`, `Footer.tsx`, `proof.ts`). Zero Edmonton numbers found on Calgary routes. I'll add the regression test anyway.
- **Airbnb CTAs (item 3)**: `/edmonton/airbnb-cleaning` has no "See My Instant Price" — both CTAs are already `Call (780) 913-6565`. Same for the Calgary version. Test only.
- **Alt text (item 5)**: zero `<img>` tags without `alt` anywhere in `src`. Nothing to fill.
- **Sticky summary bar (item 6)**: it exists on Step 3 and already hides when the real CTA scrolls into view. I'll verify at 375px rather than rebuild it.
- **Polish carryover (item 8)**: handoff copy already reads "about 90 seconds", the cleanliness question is already the temporal chip set mapping to `dc_clean` 1–5, and the homepage floating CTA is already `lg:hidden`.

## Real work

### 1. Price source of truth (pricing pages)
The tier tables are already derived from the funnel config, but three blocks on `/edmonton/pricing` and `/calgary/pricing` are still hand-typed and one of them is wrong:

- "Hourly Cleaning — **$65/hour**" contradicts the config's **$60/hour** (and the same page's own "$60/hour" callout).
- "Flat-Rate Pricing — Starting at $155" is a typed number, not derived.
- The additional-services (add-on) table is a typed list of prices that can drift from the BookingKoala config.

Fix: pull the hourly rate, the flat-rate starting price and every add-on price from `src/data/pricing.ts` / `bk-config.json`, label derived figures "from $X", and extend `src/data/pricing.test.ts` with a parity assertion so a config change that isn't reflected on the page fails the build.

### 2. SEO batch
Gaps found (everything else already has title + description + canonical, including all template-driven service and location pages):

- `/book` — no description, no canonical.
- `/locations` (`BrandHome.tsx`) — no canonical.
- `/quote-redirect` — should be `noindex` rather than gaining tags.
- `NotFound` — add `noindex`.
- Unused `Index.tsx` placeholder — remove it.
- FAQPage schema exists on `/faq` and both city hubs, but not on the pricing pages or service pages that render FAQ accordions — add it there.
- Service schema on service pages; keep LocalBusiness with the correct per-city phone on the city hubs.

### 3. Funnel performance (Step 3)
`QuoteFlow.tsx` is a single 2,226-line component: every keystroke in the notes field re-renders the whole add-on shelf, price panel and summary bar. That matches the reported intermittent freeze and dropped inputs.

Fix: extract the shelf tile into a memoized child component, derive the totals once per state change instead of per tile, and debounce the notes/postal text state. Behaviour, prices and copy stay identical.

## Tests added

- City-phone assertion: no `780` in Calgary route files, no `403` in Edmonton route files.
- Price parity: hourly rate, flat-rate starting price and each add-on price equal the config value.
- Grep assertion: zero "See My Instant Price" on either Airbnb page.
- Unique title + description per route.
- Alt-text lint (currently passing — locks it in).
- Manual 375px check that the Step-3 sticky bar appears and hides correctly and is absent on the BookingKoala embed screen.

## Technical notes

Files touched: `src/pages/EdmontonPricing.tsx`, `src/pages/CalgaryPricing.tsx`, `src/data/pricing.ts` (new exported helpers only), `src/data/pricing.test.ts`, new `src/lib/seo.test.ts` and `src/lib/content-guards.test.ts`, `src/pages/Book.tsx`, `src/pages/BrandHome.tsx`, `src/pages/NotFound.tsx`, `src/pages/QuoteRedirect.tsx`, deletion of `src/pages/Index.tsx`, and a memoization refactor inside `src/components/quote/QuoteFlow.tsx` (plus a new `src/components/quote/ExtraTile.tsx`).

No funnel logic, price maths, BookingKoala parameters or approved trust copy change.
