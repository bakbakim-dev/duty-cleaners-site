# Hero card: stop covering the photo, and make it a warm form

Right now the hero quote card is a dark navy panel that floats on top of the right-hand photo, landing over the cleaner's face and body. It reads as a heavy block dropped on the picture rather than part of the page.

## What changes

**1. The card moves off the photo.**
The hero becomes a clean two-column split: text column on the left, the card sitting in its own cream column, and the photo occupying the right edge behind/beside it rather than under it. On desktop the photo panel narrows so the card no longer overlaps the person in the frame; the photo's focal point shifts so the subject stays fully visible. On mobile nothing overlaps today and that stays true.

**2. The card becomes a light "form" card, styled like the attached reference.**
Instead of the dark ink panel:

- Warm off-white/paper card on a soft shadow, hairline border, thin orange rule along the top.
- A slim progress strip at the top: `INSTANT PRICE / 01` on the left, `Step 1 of 4 — Choose your clean` centered, `25%` on the right, over an orange-filled track — matching the funnel's own step header so the hero and the overlay feel like one object.
- Numbered badge `01` in a pale tinted square next to a small orange eyebrow `CHOOSE YOUR CLEAN`.
- Serif headline: "What kind of clean do you need?" in deep navy.
- One short companion line under it.
- Four choice rows as light bordered options; the selected row gets a navy border and pale fill (not a dark swap), so the card stays bright.
- Orange `Continue →` button, full width.
- One fine-print line: "You won't be charged today."

**3. The trust/Airbnb text below the card** loses the translucent chip hack (it only existed because the card sat on the photo) and becomes plain muted text on the cream panel.

## What does not change

- Brand tokens stay as they are — cream, navy, orange, gold. No new palette.
- Service IDs, the deep-intent flag, prewarm/prefetch behaviour, and `openQuote(...)` are untouched.
- The `#quote` section lower on the page keeps its existing card.
- No copy semantics, pricing, step count, or CTA destinations change.

## Technical notes

- `src/components/quote/ServiceStartCard.tsx`: rework the `ink` variant into a light paper variant (rename intent, keep the `variant="ink"` prop value so call sites don't churn, or switch call sites to `variant="hero"`). Use `card-warm`, `--cream-50`, `--brand-navy`, `--accent` tokens only; no hardcoded colours.
- `src/components/CityConversionIntro.tsx`: adjust the desktop grid and the photo panel width/`object-position` so the card column and the photo no longer overlap. Keep the cream feather gradient.
- Tap targets stay ≥48px; rows stay real buttons with `aria-pressed`.

## Verification

- Playwright screenshots of the Edmonton and Calgary heroes at 1280px, 1920px and 390px, confirming the subject in the photo is unobstructed.
- Continue still opens the overlay at Step 1 with the right service, including Deep Cleaning intent.
- Existing 121 tests stay green.
