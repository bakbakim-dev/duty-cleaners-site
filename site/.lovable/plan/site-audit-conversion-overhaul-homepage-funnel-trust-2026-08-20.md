# Site Audit + Conversion Overhaul (Homepage → Funnel → Trust)

## What I checked
Homepage (`/` = Edmonton2), its Calgary twin, the navigation, and the quote funnel section order. Findings below reference what is actually in the code today.

## The core problem
The homepage currently runs roughly this order: hero → top services → pricing table → what's included → recent cleans → promise → FAQ → video → coverage grid + map → cross-link → who we help → mission/values → get in touch → trust stats → big CTA band → activity strip → **quote funnel** → trust icons → sticky CTA bar → footer.

The instant-price engine — the single highest-converting asset on the site — is the second-to-last thing on the page. Every CTA scrolls the visitor past 15 sections of persuasion they did not ask for. Psychologically this inverts the modern pattern: people decide in the first screen whether to engage, and commitment grows *after* a small first action (foot-in-the-door), not after reading a brochure.

## Plan

### 1. Put the funnel where the decision happens
- Move Step 1 of the quote flow into the hero area on both city pages, so the first screen is: promise headline + 3 trust proofs + "What kind of clean?" choices.
- Starting the funnel in the hero triggers the commitment/consistency effect: once someone taps a service tile, completing Steps 2–3 becomes the path of least resistance.
- Keep a second full funnel instance near the bottom for scroll-readers; all `#quote` links target the nearest one.

### 2. Cut the homepage to a decision path, not a catalogue
Target order after the hero funnel:
1. Social proof strip (recent cleans + rating)
2. Pricing table (single CTA back to funnel)
3. What's included / the promise (merged — they overlap today)
4. Reviews
5. FAQ (objection handling, last)
6. Coverage + map
7. Footer

Move Who We Help, Mission & Values, Video Showcase, Trust Stats, Cross-link and Get In Touch off the homepage onto About/Locations. They are brand content, not decision content, and each one is a scroll-cost between intent and action.

### 3. One primary action, one colour
Audit every button on the homepage: orange = "See My Instant Price" only. Phone, checklist, service-page links become quiet text links. Today the page has multiple large filled buttons plus a bottom CTA band plus a sticky bar, which produces choice overload and dilutes the click.

### 4. Sticky bar earns its place
Show the sticky bar only after the visitor scrolls past the hero funnel, and label it with progress state ("Finish your price — Step 2 of 4") when the funnel has been started. An abandoned-progress cue converts far better than a generic repeat CTA (Zeigarnik effect).

### 5. Trust placed at the moment of doubt, not in a badge wall
- Put one specific proof line directly under each conversion point: next to the price screen ("4,000+ Edmonton homes cleaned · re-clean if you're not happy"), next to the contact step ("We never share your details — one text, one email").
- Replace generic badge rows with concrete, dated proof (recent clean, neighbourhood name, star rating).

### 6. Readability and pace
- Cap body copy at ~65ch, raise section spacing, and alternate white / light-navy backgrounds so each section reads as a distinct beat rather than a wall.
- Trim section headlines to one line and drop duplicate sub-headlines; the page currently repeats the same value props in three places.

### 7. Navigation simplification
Reduce the top bar to: Services · Pricing · Reviews · Areas · Company + one orange "See My Instant Price". Fewer choices in the nav measurably increases the odds the visitor takes the one action that matters.

## Technical notes
- Section reordering and hero funnel placement happen in `src/pages/Edmonton2.tsx` and `src/pages/Calgary2.tsx`; `QuoteFlow` is already self-contained, so a second mount needs an `id`/instance guard so anchors and analytics stay unique.
- Sections removed from the homepage move to `AboutUs.tsx` / `Locations.tsx` rather than being deleted.
- Sticky-bar progress state reads the funnel's current step via shared state or a lightweight context.
- CTA colour cleanup is a class-level pass using existing tokens (`bg-accent` for the single primary action).
- No pricing logic, BookingKoala handoff, or CRM payload changes.

## Suggested sequence
1. Hero funnel + section reorder (biggest lift)
2. CTA colour/hierarchy pass + nav trim
3. Sticky bar progress state
4. Proof placement + readability pass
