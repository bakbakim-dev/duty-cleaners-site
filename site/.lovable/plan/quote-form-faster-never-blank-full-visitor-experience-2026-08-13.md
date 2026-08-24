# Quote Form: Faster, Never Blank, Full Visitor Experience

## What's wrong today

- **Blank white form.** The overlay unmounts the iframe every time it closes, so each open is a cold cross-origin load of the vendor widget. If that load stalls or the vendor's resizer reports a height before content paints, the loading spinner fades out and the visitor stares at an empty white panel with nothing to do.
- **Slow first open.** Nothing is warmed up ahead of time: DNS, TLS, the vendor script, and the form HTML all start only after the click.
- **No way back.** Closing is X or Escape only. The browser Back button doesn't close the overlay — it navigates away from the page entirely, which feels like losing your place.

## The fix

### 1. Never show a blank panel
- Keep the loading skeleton up until the form has actually reported a real content height, not just until the iframe `load` event fires.
- Add a watchdog: if no real height arrives within ~8 seconds, show a friendly recovery card inside the overlay — "Taking longer than usual" with a **Reload form** button and a prominent **Call us** button (city-correct number). One-tap retry, never a dead end.
- Reload the iframe once automatically on the first stall before showing the recovery card, so most stalls self-heal invisibly.

### 2. Make it open fast
- Add `preconnect` + `dns-prefetch` for the form host in `index.html` so the connection is already warm before any click.
- Load the vendor embed script once, early and idle (after first paint), instead of on first overlay open.
- **Keep the form alive between opens:** once opened, the overlay stays mounted and is hidden with CSS instead of being destroyed. Second and later opens are instant, and a visitor who closes by accident comes back to their answers still filled in.
- Prewarm on intent: when a visitor hovers or touches any quote CTA, mount the hidden overlay in the background so the form is already loaded by the time they click.

### 3. Real "back" behavior
- Opening the overlay pushes a history entry, so the browser/Android **Back button closes the form and returns to exactly the page and scroll position it opened from** — no page reload, no lost place.
- Closing via X or Escape pops that entry, so Back never re-opens the form unexpectedly.
- Restore the underlying page's scroll position on close (currently the body-scroll lock can leave the page jumped).

### 4. Full-experience polish
- **Return context in the header:** replace the bare X with "← Back to <page name>" (e.g. "Back to Edmonton cleaning") on desktop, keeping the X on mobile — so it's obvious where closing takes you.
- **Reassurance while loading:** the skeleton shows the three steps ("Tell us about your home → See your price → Pick your time") plus the phone fallback, so the wait is informative rather than empty.
- **Exit safety:** if the visitor has started filling the form and presses Escape, confirm before closing so answers aren't lost by accident (X and Back get the same guard).
- **Accessibility:** focus trap inside the overlay, focus returned to the CTA that opened it, and `aria-busy` while loading.
- Mobile: keep the sticky bottom call bar hidden while the overlay is open (already the case) and make sure the recovery card's call button meets the 48px tap target.

## Technical notes

- `index.html` — preconnect/dns-prefetch for `api.bookin60.com`.
- `src/hooks/use-quote-overlay.tsx` — history-entry push/pop for Back support, `prewarm()` intent hook, keep-mounted state, opener-element tracking for focus return.
- `src/components/QuoteOverlay.tsx` — hidden-not-unmounted rendering, back-labelled header, focus trap/return, scroll restore, unsaved-answers confirm.
- `src/components/QuoteFormEmbed.tsx` — skeleton tied to first real reported height, auto-retry + recovery card, idle script preload. Existing fit-to-viewport zoom, validation debounce, and no-scroll lock stay exactly as they are.

## Verification

Playwright at 1887x1249, 1280x900, and 390x844: first open time, second open is instant with answers preserved, Back button closes and restores scroll, forced-stall path shows the recovery card, and empty-submit still doesn't shrink or flicker the form.
