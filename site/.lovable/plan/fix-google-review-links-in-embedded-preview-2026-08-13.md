# Fix Google Review Links in Embedded Preview

## Goal
Make every Google review/profile link open reliably with a normal left-click, including when the website is viewed inside Lovable’s embedded preview.

## Confirmed current state
- Both city profiles use stable Google CID permalinks from `src/lib/google-listings.ts`.
- Review cards, city verification links, Reviews-page buttons, and footer badges already use `target="_blank"`.
- Because the same URL works via right-click/open-new-tab, the destination is valid; the remaining issue is the preview frame’s handling of ordinary anchor clicks.

## Changes
1. Add a small shared external-link opener that handles the click, prevents the embedded frame’s default navigation, and explicitly opens the Google URL in a new top-level browser tab with `noopener`/`noreferrer` protection.
2. Apply it consistently to:
   - “Read it on Google” review-card links
   - City-level “Verify every review” links
   - Reviews-page Edmonton and Calgary verification buttons
   - Footer Edmonton and Calgary Google Review badges
3. Preserve real `href` values, `target="_blank"`, and accessible link behavior so links remain crawlable and still support right-click, keyboard activation, and opening outside the preview.

## Verification
- Test normal left-clicks from the homepage review cards, Reviews page, and footer in the embedded preview.
- Confirm each opens the correct Edmonton or Calgary Google profile in a separate tab without loading Google inside the preview iframe.
- Confirm right-click/open-new-tab and keyboard activation still work.
