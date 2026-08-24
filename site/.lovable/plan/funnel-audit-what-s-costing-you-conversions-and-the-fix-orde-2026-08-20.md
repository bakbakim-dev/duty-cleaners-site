# Funnel audit — what's costing you conversions, and the fix order

I walked the live funnel (Edmonton, desktop 1280px) end to end: hero card → Step 1 → Step 2 → Step 3 price + add-on shelf + cleaner details. Findings below are what I actually observed, ranked by revenue impact.

## Tier 1 — fix first (these leak money on every session)

**1. Two different progress systems disagree on the same screen.**
Above the form: a 3-dot rail reading "1 Tell us about your home → 2 See your price → 3 Pick your time". Directly under it: "Step 2 of 4 — Your details, 50%". A visitor cannot tell if there are 3 steps or 4, and the rail never highlights the current step. Fix: one indicator, 4 nodes, current one active, the rail becomes the only step language and the duplicate "Step X of 4" heading text is dropped.

**2. The step heading is said twice, and the section headline contradicts it.**
On the price screen you get: section headline "Tell us about your home." + progress "Step 3 of 4 — Your price" + H-heading "Step 3 of 4 — your price, lock in your time." Three headings, two of them wrong for that step. Fix: the section headline becomes step-aware (Step 2 → "Where should we send it?", Step 3 → "Your price"), and the in-form heading loses its redundant "Step 3 of 4 —" prefix.

**3. One-Time is preselected while Bi-Weekly wears the POPULAR badge.**
The default is the most expensive per-visit, least valuable option, and the badge points elsewhere — anchoring works against you. Fix: preselect Bi-Weekly (Standard Cleaning only), keep One-Time one tap away, and show the saving on the chip as it already does.

**4. Price is invisible on Steps 1 and 2 — the hero promised it in 60 seconds.**
The visitor answers 6 questions and hands over name/email/phone with zero price signal. Fix: a live "estimated from $X" line under the Step 1 questions and a "Your price is ready — $X, we'll show it on the next screen" reassurance line on Step 2. It preserves the contact gate but removes the blind leap.

**5. Step 2 asks for contact with no reason given.**
Three bare fields, no "why", and the reassurance line sits *below* the button where it's read too late. Fix: a one-line reason above the fields ("So we can send your quote and hold your price — no spam, no obligation"), reassurance moved above the CTA, phone marked optional-if-it-is or explained if required.

## Tier 2 — friction and clarity on the money screen

**6. The city-limits radio is unanswered by default and sits inside the price card.**
It reads as a required question blocking the price. Since the postal-code field further down already answers it, the radio should be secondary: move the postal-code input *up* next to the price, and only fall back to the radio when no postal code is entered — the current logic already supports this, the layout doesn't reflect it.

**7. The add-on shelf is a wall of 11 tiles with no running context.**
"First clean $169" appears once, in small bold text at the bottom of the shelf. Fix: each added tile shows its own "+$59.99 added" state and the shelf total line becomes a persistent, larger "Your total: $X" that updates as tiles are added.

**8. Quantity steppers start at 0 with no add affordance.**
Blinds and de-cluttering show "− 0 +" while every other tile has an "Add" button — two interaction models side by side. Fix: quantity tiles get an "Add" button that reveals the stepper at 1.

**9. "Details for your cleaner (optional — saves you a step at booking)" is a long, low-reward block at the point of highest intent.**
It is the last thing before the CTA, and it is all optional. Fix: collapse it behind "Add access & parking details (optional)" so the CTA sits directly under the price for visitors who just want to book.

**10. Pets is priced in the question label.** "Do you have pets? (+$19.99)" reads as a penalty for owning a dog. Fix: "Do you have pets? Yes — adds $19.99 for extra time & tools."

## Tier 3 — trust, copy and polish

- Sticky bar shows "First clean $169" but never the recurring per-visit price, which is the number that sells a subscription. Add "then $143.65/visit" when a recurring frequency is chosen.
- No social proof anywhere inside the funnel — reviews live above and below it but not beside the fields. A single one-line real review near the Step 2 CTA is the highest-value place for it.
- "Prefer to book by phone?" appears as a large card *below* the form on every step; it competes with the primary path. Shrink to one line.
- Bedroom helper text ("Count offices, dens & bonus rooms…") is squeezed into a narrow column under a select, wrapping to 5 lines. Widen it to the form measure.
- Selects are native dropdowns while everything else is chips/cards — inconsistent and slower on mobile. Bedrooms/baths as chips would match the rest.
- Duplicate funnel instances on the page (hero card and the #quote section) hold independent state: choosing a service in the hero, then scrolling to the bottom form, starts over. Worth confirming the hero card hands its selection to the main flow.

## Suggested build order

1. Step indicator + heading cleanup (items 1, 2)
2. Frequency default + price visibility (items 3, 4, 5)
3. Price-screen structure: postal up, cleaner details collapsed, add-on totals (items 6, 7, 8, 9, 10)
4. Trust and polish (Tier 3)

## Technical notes

All of it is presentation-level in `src/components/quote/QuoteFlow.tsx` plus `CityConversionIntro.tsx` (the 3-dot rail) and `PricePanel.tsx` (recurring line in the sticky bar). No pricing math, `bk-extras` resolver, booking-URL or CRM payload changes — the travel-fee, postal-precedence and recurring-add-on logic stays exactly as verified.
