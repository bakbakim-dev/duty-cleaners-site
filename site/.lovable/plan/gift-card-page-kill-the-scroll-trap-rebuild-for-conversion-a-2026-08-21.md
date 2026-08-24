# Gift card page: kill the scroll trap, rebuild for conversion + accessibility

Today `/gift-card` drops the BookingKoala form straight into a fixed-height iframe. The
form is taller than the box, so it grows its own inner scrollbar — a second scrolling
surface inside the page. That is the "sliding scrolling" that feels off-putting, and it is
the single worst thing on the page for anyone who finds websites hard to use.

## What changes

### 1. One page, one scrollbar
- Let the iframe be as tall as its content instead of boxing it: no `overflow-hidden`
  wrapper, a generous floor height, and height driven by BookingKoala's resizer when it
  reports in. If the resizer stays silent (it is behind Cloudflare and can be blocked),
  fall back to a tall fixed height so the form is never trapped in a small window.
- Remove the fade/absolute-positioning trick that makes the form jump on load. Show a
  calm, non-animated "Loading the gift card form…" panel, then the form.

### 2. A page that sells before it asks
Order top to bottom:
1. **Hero** — headline, one-line promise, three plain benefit points (kept, tightened).
2. **How it works** — four numbered steps: choose an amount, pick a design/message,
   we email it, they book whenever. Removes the "what happens after I pay?" hesitation.
3. **How much should I give?** — three suggested amounts with plain-language guidance
   (one-bed standard / two-bed standard / deep clean), each labelled "starts around" and
   pulled from the pricing config, plus "any amount you like". Anchoring, not pressure.
4. **The form** — clearly headed "Buy your gift card", with a short "takes about two
   minutes" reassurance line directly above it.
5. **Prefer not to do this online?** — phone numbers for Edmonton and Calgary as a real
   alternative path, plus the existing direct-link fallback.
6. **Good to know** — short reassurance list: no expiry surprises (redeem within six
   months), usable on any service, satisfaction guarantee wording (notify within 24 hours,
   we re-clean at no extra charge).

### 3. Accessibility and ergonomics
- Skip link target and a "Jump to the gift card form" anchor button in the hero, so a
  visitor who already knows what they want never scrolls past the sales content.
- Single `<h1>`, ordered `<h2>` per section, real list markup, no icon-only controls.
- 48px minimum tap targets on every button and phone link; body text at 16px+.
- Descriptive iframe `title`, `aria-busy` while loading, and a visible text alternative if
  the frame fails.
- Respect `prefers-reduced-motion`: no pulsing skeleton, no entrance animations on this page.

## Style
Existing brand language only: dark navy hero, white text, golden accents, solid orange
primary CTA. No new colours, no stock imagery.

## Technical notes
- All work is in `src/pages/GiftCard.tsx`; suggested amounts derive from
  `standardTierRows()` / `deepCleanTierRows()` in `src/data/pricing.ts` — no hand-typed prices.
- The BookingKoala embed URL and `resources/embed.js` stay as they are. Both return 403 to
  server-side requests (Cloudflare bot challenge, a known false alarm — they work from real
  browsers), so height handling must degrade gracefully rather than depend on the resizer.
- Verification: load `/gift-card` in a headless browser at desktop and mobile widths and
  confirm the page has exactly one scrollbar and the form is reachable by keyboard.
