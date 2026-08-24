# Deep audit: what's actually broken (verified) and what to fix

I ran two audits and then verified every claim in the browser and in code. Two of the "critical" findings were false alarms — worth saying plainly:

- **Quote CTAs are NOT dead.** The `#quote` links on location, About, What's Included, Reviews and Pricing pages all open the full-screen quote overlay. Confirmed by clicking them in a real browser on 6 page types — the funnel opened every time.
- **Sitemap coverage is fine.** 208 URLs across 4 sitemaps; only the 404 catch-all, `/book` and `/quote-redirect` are excluded, which is correct.

Below is what genuinely needs fixing.

## Conversion fixes

1. **Inert button on the Calgary pricing page** — the "See My Instant Price" button in the "Why Choose" band (`CalgaryPricing.tsx:489`) has no link and no click handler. Clicking does literally nothing. Wire it to the quote funnel.
2. **CTA that lies about speed** — the pricing cards' "See My Instant Price" button routes to `/contact`, a form that promises a reply "within 24 hours." A visitor who just saw a price and clicked "instant" lands in an inbox queue. Point it at the quote funnel instead.
3. **Two broken internal links** — `/about` on the Wall Washing Edmonton and Calgary pages 404s (the real route is `/about-us`).
4. **Commercial and Airbnb pages are phone-only** — those pages give a phone number and no online path. Keep the phone CTA, add a secondary "Request a callback" link so after-hours visitors aren't lost. These services stay callback-only by design; the funnel is not offered for them.

## SEO fixes

5. **13 neighbourhood pages ship no title or description tag** — `LocationPageTemplate.tsx` only emits a canonical; the title is set later by JavaScript, so crawlers and previews see the generic sitewide one. Add title, description and og tags to the template.
6. **Homepage FAQ schema doesn't match the page** — the structured data lists 2 questions while 5 are visible. Google expects these to match. Generate the schema from the same list the page renders.
7. **Redirects listed as indexable pages** — `/edmonton`, `/edmonton-2` and `/calgary-2` are client-side redirects but appear in `sitemap-main.xml` at priority 0.8. Remove those three entries.
8. **Most pages inherit the homepage's social preview** — 128 pages never set their own `og:url`/`og:title`, so shared links report the site root. Add per-page og tags to the highest-value pages (city pages, pricing, each service page) rather than all 200.
9. **Breadcrumbs have no structured data** — the visual trail exists sitewide but emits no `BreadcrumbList` JSON-LD. Add it inside `Breadcrumbs.tsx` so all ~165 pages gain it at once.
10. **LCP images are lazy-loaded** — the hero photo in `CityConversionIntro.tsx` uses `loading="lazy"`, which delays the largest paint on every city page. Switch to eager with high fetch priority, and drop the leftover Bookin60 preload tags in `index.html` from the retired iframe form.

## Known limit worth stating

Per-page titles, descriptions and social previews are injected by JavaScript. Google executes JS and sees them; Facebook, LinkedIn and Slack do not — they only read the static `index.html`. Fixes 5, 8 and 9 improve Google, but accurate per-page social previews need server rendering. The app can get that by upgrading to Lovable's latest template — type "/" in chat and choose "Migrate to TanStack Start", or just ask me. Here's [what the upgrade gives you](https://lovable.dev/blog/building-apps-using-tanstack-start).

## Technical notes

- Quote CTA behaviour is centralised in `use-quote-overlay.tsx` via a delegated click listener on `#quote` hrefs — new CTAs inherit it automatically, so fixes 1 and 2 just need a proper `#quote` anchor, not custom handlers.
- Fix 6: derive `faqSchema` from the existing `faqs` array in `Edmonton2.tsx` (and mirror in `Calgary2.tsx`) instead of a hand-written duplicate.
- Fix 9: build the `BreadcrumbList` items from the same crumb array `Breadcrumbs.tsx` already computes.
- The ~150 neighbourhood pages share ~90% boilerplate with unique local paragraphs. That's acceptable for programmatic local SEO; no change proposed now, but it's the thing to strengthen next if those pages underperform.
