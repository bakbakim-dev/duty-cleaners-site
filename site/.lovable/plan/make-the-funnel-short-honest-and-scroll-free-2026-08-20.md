# Make the funnel short, honest and scroll-free

The hero step works because it asks a small set of questions on one screen and moves on. Step 3 does the opposite: price, add-ons, hidden "More add-ons", required details and frequency all stack into one very tall page. This splits it into focused panes and removes anything hidden or mislabelled.

## 1. Split "Your price" into two focused panes

Same 4-node rail, no extra step number. Node 3 gets two panes:

```text
Pane A — Your price          Pane B — Final details
price card                   how we enter *
frequency chips              how clean is it *
add-ons (all visible)        where to park *
[ Continue ]                 postal code *
                             anything we should know
                             [ Choose my time ]
```

- Pane A ends in Continue; Pane B has a Back link to Pane A.
- Each pane fits a laptop screen at default zoom; the price summary stays pinned (sidebar on desktop, sticky bar on mobile) so the number never scrolls away.
- The handoff still only fires from Pane B, with the existing required-field validation.

## 2. No hidden add-ons

"More add-ons / Show" disappears. Every add-on the visitor's home qualifies for renders at once as compact one-line tiles (name + price on one line, benefit line only on the tiles that need it), grouped as today. Fewer pixels per tile means the full shelf fits without a reveal.

## 3. Frequency moves above the add-ons

Choosing how often changes every price on the shelf, so it is asked before the shelf instead of below it. The savings line stays.

## 4. Honesty sweep, whole site

Rule: a field is labelled optional only when nothing downstream requires it.

- Funnel: cleaner-details are required and marked (already fixed); confirm no "(optional)" remains on anything gated.
- Sweep the contact form, join-the-team form, gift-card form and every remaining quote entry point: any field the validation schema requires gets `*`, any field it does not gets "(optional)". Remove asterisks that are decoration only.
- Any "we'll ask this later" phrasing that is untrue gets rewritten.

## Technical notes

- `src/components/quote/QuoteFlow.tsx` — add a `pricePane: "price" | "details"` state inside step 3; render the two panes from the existing markup with no logic change to pricing, extras resolution, `dc_*` params or the GHL upsert. Delete the `More add-ons` collapse state. Sticky-bar label and `quote-progress` copy follow the active pane.
- `src/lib/quote-progress.ts` — pane-aware label for the mobile bar ("Continue" vs "Choose my time").
- Add-on tile restyle is presentational only, inside the shelf renderer.
- Forms audited against their own zod schemas: `src/pages/Contact.tsx`, `src/pages/JoinTheTeam.tsx`, `src/pages/GiftCards.tsx`, `src/components/GetInTouch.tsx`.
- Existing booking-redirect tests stay green; add a case asserting the handoff is still blocked until all four details are answered.
