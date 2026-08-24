# Simply Maid Premium Patterns — Round 2 Upgrades

After reviewing Simply Maid's homepage, About, Booking, Sydney city page, and Cleaners recruitment page, these are the strongest patterns we have NOT yet adopted — adapted to Duty Cleaners' brand rules (navy/gold, "Rigorously Vetted Pros", "non-toxic", "Five-Star Rated" with no review counts, 24-hour re-clean window).

## New reusable components

1. **TrustMarquee** — an infinitely scrolling horizontal band of trust claims separated by gold dots, in their style: `RIGOROUSLY VETTED PROS · NON-TOXIC PRODUCTS · 24-HOUR RE-CLEAN PROMISE · 10+ YEARS OF SERVICE · FIVE-STAR RATED · HIGH QUALITY SUPPLIES`. CSS animation, pauses on hover, accessible (`aria-hidden` duplicate). Placed between major sections on Edmonton/Calgary pages.

2. **Animated stat counters** — upgrade `CityTrustStats` so numbers count up when scrolled into view (10+ Years, 4,000+/1,000+ Homes, <5% Applicants, Five-Star). Their "Real numbers from real cleans" pattern. Uses IntersectionObserver + requestAnimationFrame; respects `prefers-reduced-motion`.

3. **Numbered FAQ with human-support CTA** — number each FAQ (01, 02, 03...) in gold, and add their "Still have a question? Talk to a real human." block with phone + hours (Mon–Sat 8AM–8PM, Sun 9AM–3PM). Applied to `FAQ.tsx` and city page FAQ sections.

4. **Service comparison matrix** — their booking page's strongest feature: a "What's included" table comparing Standard / Deep / Move In-Out with Included / Add-on / Not included cells (gold check, navy dash). Added to `WhatsIncluded.tsx` to complement the existing checklist structure.

## Page updates

5. **Quote embed framing (Edmonton2/Calgary2)** — we can't style inside the Bookin60 iframe, but we can adopt their framing around it: a step-style header ("Step 1 of 1 — Your price in 60 seconds"), a reassurance line with a green dot ("Serving Edmonton homes since 2015 — no callbacks, no obligation"), and the three trust pills (Satisfaction Guarantee · Insured Every Clean · Vetted & Trained) directly beneath the form.

6. **About Us page** — adopt their About patterns within our existing content: numbered "What we believe" values (01–04 with gold numerals), a "Our journey" timeline (founding → 4,000+ Edmonton homes → Calgary expansion → today), and a founder monogram card treatment for the existing founder story. No new claims invented — only restructuring existing approved copy.

7. **Join the Team page** — adopt their recruitment page structure: numbered onboarding steps (Apply → Vet → Train → Start) shown as step cards with a small preview panel inside each, plus a cleaner-style testimonial/quote strip. Keeps the 24–48h contact copy and existing form untouched.

8. **Hero star-rating line** — under the hero subhead on both city pages, add their five-gold-stars visual with the text "Five-Star Rated" (no counts, per brand policy).

## Optional (included unless you say no)

9. **Announcement top bar** — a thin dismissible navy bar above the header with a seasonal message + "Get Free Quote" link (their promo-bar pattern). Dismissal remembered in sessionStorage.

## Technical notes

- All new colors via existing `brand-navy` / `brand-gold` tokens; no hardcoded colors.
- Marquee and counters are pure CSS/JS animations — no new dependencies.
- No third-party embeds or iframes added; no review counts, no "employees" wording, no "eco-friendly" wording anywhere.
- Mobile-first; marquee speed and counter animation disabled under `prefers-reduced-motion`.
