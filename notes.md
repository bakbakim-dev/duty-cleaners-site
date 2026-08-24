# Duty Cleaners — GHL → BookingKoala prefill

Goal: stop asking the same 6 home-detail questions twice. GHL form captures the
lead, then BookingKoala arrives pre-filled so it reads as "verify" not "re-enter."

## Pieces

1. **GHL form** — done (layout, labels, contrast, button copy). Two cosmetic
   items open: trust-bar wrapping 2+1 at 548px, and the form background
   decision (navy pattern vs transparent).
2. **Redirect URL** in GHL → On Submit → Redirect to URL. Static text box, but
   merge tags *do* resolve there (verified: `?email={{contact.email}}` produced
   a real address). Field keys confirmed from the live widget payload. As
   deployed — note fname/lname; `{{contact.full_name}}` gets silently stripped
   by GHL's server (see go-live lessons below):

   ```
   https://dutycleaners.ca/quote-redirect/?service={{contact.what_type_of_service_would_you_like}}&frequency={{contact.frequency_in_bookings}}&hometype={{contact.what_type_of_home_do_you_have}}&bedrooms={{contact.bedrooms_in_total}}&bathrooms={{contact.bathrooms}}&halfbaths={{contact.half_baths}}&fname={{contact.first_name}}&lname={{contact.last_name}}&email={{contact.email}}&phone={{contact.phone}}
   ```
3. **Bridge page** at `/quote-redirect/` — blank page running `bridge.js`
   (inline in a script tag, or enqueued; no dependencies). Translates labels →
   BK numeric IDs, forwards via `location.replace()` so Back doesn't trap them.
4. **BookingKoala** — receives the prefilled URL.

## Blocking work before this can ship

**P0 — RESOLVED, was a false alarm.** `dutycleaners.ca/booking-page/` does *not*
404. Checked 2026-08-07 with `fetch(..., {redirect:'manual'})`: it returns a 3xx
(`type: "opaqueredirect"`) and forwards to BookingKoala. Leads are landing on
the booking form, not a dead page. Either it was fixed, or the original 404 came
from a different condition.

`/quote-redirect/` returns a clean 404, confirming the slug is free.

**P1 — Turnstile 600010** blocks submit testing, so the redirect never fires.
Ladder, stop at first success:

1. Submit via the form's native GHL hosted link, clean incognito, **devtools
   closed** (open devtools is a documented 600010 trigger).
2. Submit the embed on production `dutycleaners.ca`, not the preview domain,
   same clean conditions.
3. Re-copy the official GHL embed code fresh and remove the "anti-spam redirect
   guard" an earlier AI agent added — that code is unreviewed. Diff it first.
4. Only then toggle the form's captcha off *as a diagnostic*, not for
   production (uncaptcha'd GHL forms attract heavy spam). If a standard embed
   on the live domain still fails, open a GHL ticket.

Note: the earlier agent's claim that GHL must "authorize dutycleaners.ca and
the preview domain" is an unverified hypothesis. Don't act on it as fact.

**P2 — fill the IDs** in `bridge.js`. Everything is `FILL_ME` until pulled from
BK Settings → Industries → Home Cleaning → Form 1 (Service Category tab,
Frequency tab, Pricing Parameters → Manage Variables).

## BookingKoala IDs — verified 2026-08-07

Industry: **Home Cleaning = 1**. Form: **Form 1 = 1**.
Admin paths: `/admin/industry/1/1/frequencies`, `/service-category`,
`/pricing-parameters`, `/pricing-parameters-categories`.

### Services (Form 1 → Service Category)

| Service | ID | Display |
|---|---|---|
| Standard Cleaning | 6 | Both |
| Move in Move Out Cleaning | 2 | Both |
| Hourly Cleaning | 17 | Admin only |
| Re-Clean $0 | 4 | Admin only |
| Re-Clean – different cleaner $25 | 5 | Admin only |

### Frequencies (Form 1 → Frequencies)

| Frequency | ID | Discount |
|---|---|---|
| One-Time | 1 | 0 |
| Weekly | 3 | 20% |
| Bi-Weekly (Every 2 Weeks) | 4 | 15% — BK default |
| Every 4 Weeks | 64 | 10% |
| Every 2 Weeks (Hourly) | 65 | — Hourly service only |
| Weekly Cleaning (Hourly) | 66 | — Hourly service only |
| Every 4 weeks! (Hourly) | 68 | — Hourly service only |

### Pricing parameter categories (Manage Variables)

| Category | ID | Applies to |
|---|---|---|
| Bedrooms | 1 | Standard |
| Full Bathrooms | 2 | Standard |
| Half Baths | 8 | Standard |
| Bedrooms -Move in Move out | 5 | Move In/Out |
| Full Bathrooms - Move in Move Out | 6 | Move In/Out |
| Half Baths - Move In Move Out | 7 | Move In/Out |
| What Type of Home? Click Here | 9 | **both** |

### Option IDs

**Standard Cleaning** — Bedrooms (cat 1): 1→87, 2→81, 3→82, 4→83, 5→84, 6→85,
7→86. Full Bathrooms (cat 2): 1→88, 2→9, 3→11, 4→13, 5→15, 6→17, 7→19.
Half Baths (cat 8): 0→51, 1→8, 2→10, 3→12, 4→16.

**Move In/Move Out** — Bedrooms (cat 5): 1→74, 2→75, 3→76, 4→77, 5→78, 6→79,
7→80. Full Bathrooms (cat 6): 1→39, 2→40, 3→41, 4→42, 5→43, 6→44 (**no 7**).
Half Baths (cat 7): 0→58, 1→45, 2→46, 3→47, 4→48.

**Home type (cat 9, both services)** — Two Storey House (Main + Upper Floor)
→90, Two Story Townhouse (Duplex) →89, Bungalow (Single Story Home) →54,
Basement Suite Only →56, Apartment or Condo →55. Option 57 ("Click Here and
Select Your Type of Home") is the placeholder — never send it.

## Structural consequence: the parameter set depends on the service

This is the big one, and it wasn't in the original plan. Bedrooms, bathrooms and
half baths each exist **twice** in BK — one category for Standard, one for Move
In/Move Out — with different category IDs *and* different option IDs. "3
Bedrooms" is option 82 for a Standard clean and option 76 for a move-out.

So the bridge can't hold one flat map. `bridge.js` now selects the whole map off
`service_id`, and skips the three numeric parameters entirely if the service
didn't map — sending option IDs from the wrong category is worse than sending
nothing.

Two range gaps to know about: Move In/Move Out tops out at **6 bathrooms**
(Standard goes to 7), and half baths top out at 4 for both. Anything past those
is dropped rather than guessed.

## GHL form options — verified 2026-08-07

Read from the live widget payload at
`https://api.leadconnectorhq.com/widget/form/AwJDnvuYtkojIN3aOysC`.
(The v2 builder SPA won't render in an automation tab; the public widget does,
and its payload carries the authoritative field keys and option text.)

| Field key | Options |
|---|---|
| `what_type_of_service_would_you_like` | "Standard Cleaning ", "Move in Move out Cleaning " |
| `what_type_of_home_do_you_have` | "What type of home do you have? Click here", "Two Storey Detached Home (Main Floor & Upper Floor)", "Two Storey Townhouse/Duplex ", "Bungalow (Single Storey Home)", "Apartment/Condo (Single Storey)" |
| `bedrooms_in_total` | "One Bedroom (Under 800 Sqft)" … "Seven Bedrooms (Under 4200 Sqft)" |
| `bathrooms` | "1 Bathroom" … "6 Bathrooms" |
| `half_baths` | "0 Half Baths (With only a Toilet and Sink)" … "4 Half Baths …" |
| `frequency_in_bookings` | "One Time", "Every Week (20% off)", "Every 2 Weeks (Most Popular Option 15% off )", "Every 4 Weeks (10% off)" |

Everything maps. Good news vs. the earlier worry: **there is no Deep Cleaning
option**, so no service is left stranded.

Three quirks the matcher has to absorb, all handled by `normalize()`:

- Several options carry **trailing spaces** ("Standard Cleaning ").
- Frequencies carry **discount suffixes** ("Every Week (20% off)").
- Bedrooms use **word numbers with a sqft hint in parentheses** — "One Bedroom
  (Under 800 Sqft)". Reading the first digit off that string yields **800**.
  `normalize()` strips parenthetical content *before* the count is parsed,
  which is the only reason bedrooms work at all.

Coverage gaps, both harmless: BK's "Basement Suite Only" (56) has no GHL
equivalent, so it's unreachable from this funnel; and GHL stops at 6 bathrooms
while Standard Cleaning supports 7.

## Go-live checklist

1. ~~Add the Move In/Move Out frequency condition in GHL~~ — **done, live.**
2. ~~Pull all BK + GHL IDs and build the bridge~~ — **done, 60 checks passing.**
3. ~~`node build.js`~~ — **done**, output in `dist/quote-redirect/`.
4. ~~Deploy the page~~ — **done.** Created `public_html/quote-redirect/index.html`
   via SiteGround File Manager (folder + file, content pasted into the Monaco
   editor since the upload button opens a native picker that can't be driven).
5. ~~Confirm it loads~~ — **done.** Returns 200 `text/html`. The served bytes
   normalize (CRLF→LF) to sha256 `0fcb5cef…52718d59`, identical to the local
   build. Extracted the served `<script>` and ran it against both service
   branches: all expected params present, move-out correctly uses categories
   5/6/7 rather than 1/2/8.
6. ~~Change the GHL redirect URL~~ — **done 2026-08-07, verified in the live
   widget payload.** All ten params stored:
   `service, frequency, hometype, bedrooms, bathrooms, halfbaths` (custom field
   keys) + `fname={{contact.first_name}}`, `lname={{contact.last_name}}`,
   `email`, `phone`.

**THE FUNNEL IS LIVE**: GHL form → `/quote-redirect/` → BookingKoala prefilled.

Two lessons from getting the save through, for future edits:

- **`{{contact.full_name}}` is not a valid merge tag** in the redirect-URL box.
  GHL's server strips it silently on save — the UI preview shows it fine, the
  stored URL has `name=` empty. Use `first_name`/`last_name` tags instead
  (both store correctly). `bridge.js` reads `fname`/`lname` first and falls
  back to a single `name` param.
- **Saves fail silently and irregularly in the builder.** Several Save →
  (script Alert) → Proceed rounds produced no persisted change and no error;
  eventually one stuck. The browser console shows the white-label's injected
  scripts (titanbluehost.com — 503s — and "pimp-my-ghl" S3 scripts) throwing
  during builder sessions, plus an uncaught promise rejection. After ANY save,
  verify against the live widget payload
  (`api.leadconnectorhq.com/widget/form/AwJDnvuYtkojIN3aOysC` — search for
  `quote-redirect`), not the builder UI, which happily shows unsaved state.

### Note on the conditional-logic banner

The Settings tab now shows: *"Conditional logic will take precedence over the
message / redirect here."* That warning fires whenever any condition exists. The
condition on this form is **Show/Hide Fields**, not **Redirect to URL**, so the
redirect configured here still applies to every submission. If a Redirect
condition is ever added, it would override this box.

## Deploying the bridge page

Site is **WordPress 7.0.3 + Elementor** (hello-elementor theme), on SiteGround
(`sg-cachepress` present).

Build the page — inlines `bridge.js` into `template.html`:

```bash
node build.js
```

Output: `dist/quote-redirect/index.html` (~9 KB, no external requests).

**Preferred: ship it as a static file.** Upload the `quote-redirect/` folder to
the site root (SiteGround Site Tools → File Manager, or SFTP) so it lands at
`public_html/quote-redirect/index.html`.

WordPress's `.htaccess` only routes requests that *don't* match a real file or
directory, so Apache serves this directly — no WordPress bootstrap, no Elementor
CSS/JS, no theme. On a page whose entire job is to bounce, that's the difference
between an instant handoff and a visible stall. It also can't be broken by a
plugin update or a page-builder edit.

Rebuild and re-upload after any change to `bridge.js`.

**Alternative, if you'd rather stay in wp-admin:** create a Page with slug
`quote-redirect`, set the template to **Elementor Canvas** (no header/footer),
and drop the contents of the `<script>` block into an Elementor HTML widget.
Works fine — just slower, since the visitor waits on Elementor's assets before
the redirect fires, and it's one more thing a builder edit can clobber.

Either way, exclude the URL from SiteGround caching if you see stale behaviour.
The HTML is identical for every visitor and all the logic is client-side, so
caching is harmless in principle — the script reads `location.search` at runtime.

## Verification

`verify.js` drives the real `bridge.js` with every GHL option string and asserts
the resulting BK URL. Run it after any edit to either form:

```bash
node verify.js
```

60 checks, all passing as of 2026-08-07 — every option in every dropdown, both
service branches, plus the guards (invalid service/frequency pair, missing
service, name splitting, phone digits, empty query).

Sample output for a full handoff:

```
https://dutycleaners.bookingkoala.com/booknow?industry_id=1&form_id=1
  &f_name=Jane&l_name=Doe&email=jane%40example.ca&phone=7805550142
  &service_id=6&frequency_id=4
  &pricing_parameter%5B9%5D=54   (Bungalow)
  &pricing_parameter%5B1%5D=82   (3 Bedrooms, Standard)
  &pricing_parameter%5B2%5D=9    (2 Full Baths, Standard)
  &pricing_parameter%5B8%5D=8    (1 Half Bath, Standard)
```

## RESOLVED: "Two Storey Detached Home" not transferring (2026-08-07)

After the funnel went live, every field transferred except this one home-type
option. Root cause: it is the only option label containing an ampersand —
"Two Storey Detached Home (Main Floor **&** Upper Floor)" — and **GHL
substitutes merge-tag values into the redirect URL raw, without URL-encoding**.
The `&` inside the label splits the query parameter:

    hometype=Two Storey Detached Home (Main Floor   ← truncated
     Upper Floor)=                                  ← garbage param

The truncated value has an unbalanced `(` which the balanced-parens strip in
`normalize()` couldn't remove → no map match → silently dropped (the designed
degradation, on exactly one input).

Fix: `normalize()` now also cuts from any stray unbalanced `(` to end of
string, recovering "two storey detached home" → option 90. Covered by three
permanent tests in `verify.js` (raw split, encoded full label, neighbor params
unaffected). Redeployed 2026-08-07; live hash `838882d1…` matches local build,
and the served script was re-run against the exact mangled query — all params
correct.

Lesson for future GHL work: **any option text containing `&` (or `#`) will
break raw merge-tag substitution into URLs.** Prefer renaming such options in
GHL ("+" instead of "&"), or keep bridge-side defenses like this one.

## Home type prefill — deep dive (2026-08-07)

With everything else prefilling live, category 9 alone fails. Reverse-engineered
BK's customer bundle (`cdn.bookingkoala.com/customer-build/157/main.*.js`) to
find out why. Findings:

1. **The URL parser is fine.** `createParamObjFromUrl` turns
   `pricing_parameter[9]=90` into `{id: 9, quantity: 90}` exactly as it does
   for the working categories. Values must be numeric (ours are).
2. **The prefill guard passes.** `prefilledPricingParam` only applies an entry
   if `settingsObj.pricing_param[<category id>]` exists; for form 1 that map is
   keyed by plain category id, and 9 is a normal category, so the entry gets
   into the form model.
3. **The difference is downstream, in the widget.** Category 9 is unique in two
   ways:
   - it belongs to **two service categories** (Standard + Move In/Move Out) —
     every working category is single-service;
   - it is the **dependency hub**: each home-type variable gates which extras
     and custom fields display (checked variable 90's Dependencies tab — it
     controls the extras list and the custom-field list).
   Best explanation: when the service selection (also from the URL) initializes
   the parameter widgets, the dependency cascade re-initializes the home-type
   widget and the prefilled value is lost. A BK order-of-operations bug.
4. **Red herring ruled out**: the placeholder option 57 has "Default" checked,
   but so does "1 Bedroom" (87) in a category that prefills fine — defaults are
   overridden by URL prefill elsewhere, so the default isn't the cause.
5. Noticed in passing: "Apartment or Condo" (55) has frequency **-NA-** while
   every other home type lists all frequencies. Unrelated but worth fixing in
   BK admin.

### Discriminating tests (run in incognito, devtools closed)

1. `https://dutycleaners.bookingkoala.com/booknow?industry_id=1&form_id=1&pricing_parameter%5B9%5D=90`
   — home type alone, NO service_id. If it preselects here, the service-init
   cascade is confirmed as the killer.
2. Same URL + `&service_id=6` — if 1 works and this doesn't, cascade confirmed.

### If confirmed → BK support ticket, with this repro

"On Form 1, pricing parameter category 9 (multi-service category with variable
dependencies configured) does not honour `pricing_parameter[9]=<id>` URL
preselection, while single-service categories 1/2/8 on the same form do. Repro:
[the two URLs above]."

### Shipping decision

Ship as-is. 9 of 10 fields prefill; home type is the first question on the BK
form and the visitor answers it in one click. The bridge already sends the
correct `pricing_parameter[9]` value, so if BK fixes their bug (or the test
shows a variant that works), it lights up with no changes on our side.

## Known issue: "what type of home" won't preselect — ORIGINAL notes (superseded by deep dive above)

The hand-built test URL preselected everything except home type. Now that the
IDs are confirmed, the most likely cause is simply a **wrong category ID**: home
type is category **9**, and the categories are numbered in an order that doesn't
match their on-screen position (What Type of Home is listed first but is ID 9,
while Bedrooms is listed fifth and is ID 1). Easy to grab the wrong number.

Retest with `pricing_parameter[9]=90`. If it still won't take, the fallback
hypothesis is BK's cascade logic — home type gates the later fields, so BK
re-renders and clears it.

The wording mismatch is now handled: GHL says "Two Storey Detached Home (Main
Floor & Upper Floor)" where BK says "Two Storey House (Main + Upper Floor)", and
`bridge.js` maps between them explicitly rather than by string similarity.

## Fix at the source: Move In/Move Out + recurring frequency

GHL offers all four frequencies regardless of service, but BK's Move In/Move Out
accepts **One-Time only**. Someone can currently answer "Move in Move out" +
"Every Week (20% off)" — a combination that doesn't exist.

### What GHL conditional logic can actually do

Checked in the builder (Edit tab → the conditions icon, top-left next to "+").
GHL calls it **Conditions**, with four types:

| Condition | What it does |
|---|---|
| Redirect to URL | Different post-submission redirect per answer |
| Display custom message | Show a message based on inputs |
| Disqualify lead | Filter out entries |
| Show/Hide Fields | `If <field> <state> <value>` → Hide/Show Field(s) |

The rule builder's actions are **Hide Field / Show Field / Hide Fields / Show
Fields** — they operate on whole fields. There is **no option-level filtering**:
you cannot conditionally remove "Every Week" from a dropdown while keeping the
others. (The form currently has no conditions defined.)

### DONE — condition is live (2026-08-07)

Added in the builder and saved; verified in the live widget payload:

```json
{ "conditions": [{ "selectedField": "what_type_of_service_would_you_like?",
                   "selectedOperation": "isEqualTo",
                   "inputValue": "Move in Move out Cleaning " }],
  "outcome": { "type": "showHideFields", "hideType": "Hide",
               "value": "frequency_in_bookings" } }
```

Note GHL stored the trailing space in `inputValue` — it matched against its own
option list, so that's correct and self-consistent. Don't hand-edit it.

Saving the form triggers a generic GHL warning about third-party scripts in HTML
blocks. That's about the form's pre-existing custom HTML elements (the trust bar
and the "Script Added!" blocks), not anything new — but it *is* a reminder that
the unreviewed "anti-spam redirect guard" from the earlier AI agent is still in
there and still hasn't been read. See P1 below.

### The reasoning

Because Move In/Move Out has exactly one valid frequency, the question is
meaningless for that service — so don't ask it:

> **If** `What type of service would you like?` **is** `Move in Move out Cleaning`
> **Then** Hide Field → `Frequency in bookings`

`bridge.js` now fills in `frequency_id=1` whenever the service offers exactly one
frequency, whether or not GHL sent the answer. So the hidden field costs nothing
and the visitor answers one fewer question on a move-out.

The same rule also covers the case where someone picks a recurring frequency
*before* switching the service to move-out: the stale answer is dropped and
corrected to One-Time rather than passed through.

A second frequency field (One-Time only) shown conditionally would also work,
but it means a second custom field and a second key for the bridge to read. Not
worth it when the answer is never in doubt.

## Maintenance rule

The label→ID map is hand-maintained. Renaming a GHL dropdown option, or
reordering/changing BK options, breaks that mapping silently (field just lands
blank). Re-check after any edit to either form.

## Fallback

If prefill proves flaky in production, fall back to slimming the GHL form to 5
fields (service, frequency, name, email, phone) and letting BK collect home
details once. Same duplication fix, less machinery.

## Mobile friendliness — findings + fixes (2026-08-07)

Diagnosed by rendering the live widget in a real 375px iframe and measuring.

**What was actually fine (no action needed):**
- No horizontal overflow at any width; the widget is width-responsive.
- The homepage embed auto-resizes height correctly. `form_embed.js` is bundled
  inside SiteGround's *deferred* combined JS, so the iframe stays hidden
  (opacity 0) until the visitor's first scroll/click, then reveals and sizes
  itself (measured: 800px → 1232px after interaction). Looks alarming in
  testing; fine for real visitors.
- Text inputs are 16px — no iOS auto-zoom on focus.

**Fixed (saved to form custom CSS, verified live):**
- Dropdown display text was 12px on phones → bumped to 15px via
  `@media (max-width: 600px) { .multiselect... { font-size: 15px !important } }`.

**ROUND 2 (2026-08-07): full cross-browser audit at 320px and 375px.**
Found beyond the padding issue:

- **Name/Email/Phone inputs render at 12px** — poor readability everywhere,
  and the classic iOS-Safari focus-zoom trigger (currently suppressed only by
  the widget's `maximum-scale=1` viewport; 16px makes it robust).
- **The submit button is 101px tall on every device** — a stray `<br>` inside
  the button label's HTML adds an empty text line. CSS `br { display: none }`
  inside the button fixes it (measured 101px → 62px). Could also be fixed at
  source by re-typing the button label in the builder.
- Everything else held up: no horizontal overflow at 320 or 375, embed height
  auto-resizes, dropdown option rows are 56px (comfortable tap targets).

**The complete tested block** — every rule verified in live 320px and 375px
renders of the real widget (fields 13px/13px gaps, inputs 16px, dropdowns
15px, button 62px, zero overflow). Replace the whole existing
`/* MOBILE ... */` section at the bottom of Custom CSS (builder → Styles &
Options → Advanced → Custom CSS) with:

```css
/* Stray <br> in the submit label inflates the button (all devices) */
#_builder-form button[type=submit] br { display: none !important; }

/* MOBILE: side padding, readable text (GHL zeroes form padding on phones
   via layered CSS, so pad the field items instead) */
@media (max-width: 600px) {
  .form-builder--item { padding-left: 12px !important; padding-right: 12px !important; }
  .multiselect, .multiselect__single, .multiselect__placeholder, .multiselect__option { font-size: 15px !important; }
  #_builder-form input[type=text], #_builder-form input[type=email], #_builder-form input[type=tel] { font-size: 16px !important; }
}
```

After saving, verify the save actually persisted (the builder fails saves
silently): load
`https://api.leadconnectorhq.com/widget/form/AwJDnvuYtkojIN3aOysC` and search
the page source for `form-builder--item`.

**Prior finding, superseded by the block above:**
fields sit ~1px from the left screen edge on phones.

## DEPLOYED: mobile touch-scroll fix (2026-08-07)

**Symptom (user, on a real phone):** the form area doesn't scroll — visitors
can't reach the lower fields or the submit button.

**Cause:** the GHL embed iframe on the homepage has inline `height: 800px`.
The resize script (bundled into SiteGround's deferred combined JS) doesn't
reliably grow it on phones, where the form is ~1300px tall. A fixed-height
iframe becomes an inner scroll region — and touch scrolling inside iframes is
broken/unreliable on iOS and Android. Desktop users never noticed because
mouse-wheel inner scrolling works.

**Fix (deployed and verified live):** MU-plugin at
`wp-content/mu-plugins/dc-form-embed-fix.php` (local copy in this folder).
It injects into `wp_head`:

    @media (max-width: 768px) {
      iframe[id^="inline-AwJDnvuYtkojIN3aOysC"] {
        height: 1420px !important;
        min-height: 1420px !important;
      }
    }

On phones the iframe is floored above the form's full height, so there is no
inner scroll region — the form rides the normal page scroll (exactly the
behavior the user asked for). GHL's resize script can still grow it, never
shrink it. MU-plugins need no activation and survive theme/plugin updates.

SG Dynamic Cache flushed after deploy; verified the style tag is served in the
plain (cacheable) homepage HTML.

Note: the mu-plugins folder existed but was empty — the fix is the only file
in it. If the form ever grows taller than ~1400px on mobile (more fields),
bump the floor.
Root cause: GHL zeroes the form's padding on small screens through its own
stylesheet (loaded cross-origin, apparently using CSS layers — even a
triple-id `!important` custom rule loses, and the element's inline
`padding: 30px 20px` is overridden). The form's Margin & Padding control has a
**per-device toggle** (small monitor icon beside "Margin & Padding" in
Styles → Layout) — the mobile values are what GHL applies on phones.

Fix in the builder (30 seconds): Styles & Options → Styles → Layout →
Margin & Padding → click the little device icon → switch to mobile → set
left/right padding ~12-16px → Save.

Alternative that is PROVEN to work if the device toggle disappoints (tested
live in the 375px iframe: fields moved to 13px/16px gaps, no overflow):

    .form-builder--item { padding-left: 12px !important; }

inside the existing `@media (max-width: 600px)` block in Custom CSS. The
saved block currently still contains the older `#_builder-form { padding-left:
14px ... }` variant — it's a harmless no-op (GHL's layered CSS beats it);
replace it with the line above when editing.

**Builder automation warning:** the form-builder UI lives in a cross-origin
iframe (leadgen-apps-form-survey-builder.leadconnectorhq.com) — DOM access and
the accessibility tree are both blind to it, screenshots lag badly, and panel
clicks misfire. Small style edits are far faster by hand than by automation.

## Form colour / contrast redesign (2026-08-07)

Optimised for legibility rather than brand match, per the research below.
All values measured by injecting into the live widget and reading computed
styles — not estimated.

| Element | Before | After |
|---|---|---|
| Placeholder | #8C8C8C on #E8D882 = **2.33 FAIL** | #6B7280 on #FFFFFF = **4.83** |
| Typed / selected value | 12.31 | **14.68** |
| Field border | mustard edge = **2.14 FAIL** | #6B7280 = **4.83** |
| Labels | #555555 = 7.46 | #111827 semibold = **16.69** |
| Submit button | white on #1D6FB8 = 5.23 (AA) | white on #175A96 = **7.14 (AAA)** |
| Dropdown highlight | vue default green | #175A96 + white = **7.14** |
| Focus indicator | none visible | 3px #175A96 ring = **6.72** vs card |

Palette: off-white card `#F7F8FA`, white field wells, `#6B7280` borders,
`#1F2937` input text, `#111827` labels, `#175A96` blue for button/focus/
highlight.

### Research the choices are based on

- **WCAG 1.4.11** — a field is identifiable by *either* its fill or its edge at
  3:1. So a white field with a real border is compliant; a tinted fill isn't
  required, and white maximises text contrast.
- **WCAG 2.4.13** — focus indicator needs ≥2px and 3:1 between focused and
  unfocused states. Recolouring the grey border blue gives only **1.08:1**
  (near-identical luminance) — a trap worth remembering. An outline with
  `outline-offset` paints over card pixels instead: 6.72:1.
- **NN/g** — pale grey form elements are an accessibility problem for
  low-vision and older users *and* slow visual processing for everyone;
  always-visible labels beat placeholder-as-label.
- **Dyslexia / visual-stress research** — pure black on pure white causes
  halation and apparent "shimmer"; near-black text on a slightly off-white
  surface is preferred. Hence #1F2937 on #F7F8FA rather than #000 on #FFF.

### Two specificity traps (both cost real time here)

1. The mustard field colour was NOT untouchable vendor CSS — it's in the
   form's own generated stylesheet at `#_builder-form .multiselect
   .multiselect__tags` (1,2,0) with !important. A single-id override loses
   even with !important. **Double the id** → (2,2,0) → wins. Verified live.
2. Within this stylesheet, focus rules must be at least as specific as the
   base field rules. `input:focus` (2,1,0) loses to `input[type=text]`
   (2,1,1). Use `input[type=text]:focus` (2,2,1).

Note: `:focus` cannot be verified via browser automation — `:focus` stops
matching when the automation window loses OS focus. Verified instead by
applying the identical declarations through a temporary class at matching
specificity; outline rendered `solid 3px rgb(23,90,150)`, offset 2px.

### The specificity trap (important for any future CSS work)

The mustard field colour is NOT from a GHL stylesheet you can't touch — it's in
the form's own generated CSS as:

    #_builder-form .multiselect .multiselect__tags { background-color: ... !important }

specificity (1,2,0). A custom rule written as `#_builder-form .multiselect__tags`
is (1,1,0) and **loses even with !important** — which is what made earlier
attempts look like an unwinnable "CSS layers" problem. It isn't. Repeat the id
(`#_builder-form#_builder-form ...`) to reach (2,2,0) and it wins. Verified live.

### Status: LIVE (saved 2026-08-07, verified on the live widget)

Saved customStyle is 5149 chars, braces balanced. Measured on the rendered
live form afterwards — every target met:

    card #F7F8FA · fields #FFFFFF · border #6B7280
    placeholder 4.83 · label 16.69 · border-vs-field 4.83 · button 7.14
    button height 101px -> 62px
    mobile @375px: 13/13px side gaps, inputs 16px, no horizontal overflow

Note GHL lowercases hex values on save (`#F7F8FA` -> `#f7f8fa`) — search
case-insensitively when verifying.

The documented (commented) copy of the same rules lives in
`form-custom-css.css` in this folder; the builder holds a compacted version.
Edit the file first, then mirror the change into the builder.

**Builder automation is barely viable** — the panel lives in a cross-origin iframe
(no DOM access, no accessibility tree), screenshots lag 5-30s, the panel shifts
a few px between frames so clicks land on the close button, and saves fail
silently. Every builder edit in this project took multiple attempts or was
ultimately done by hand. Do CSS edits manually; verify after every save by
loading `api.leadconnectorhq.com/widget/form/AwJDnvuYtkojIN3aOysC` and
searching the source for a string from the new rules.

## Round 3 — errors, labels, trust bar, resize bug (2026-08-08)

All LIVE and verified on the rendered widget (saved customStyle 6038 chars,
braces balanced).

- **Labels 14px -> 16px.**
- **Validation errors now mark the field.** GHL already rendered the message
  text at 4.75:1 (passes) but left the field unmarked. Now the whole field
  block tints `#FEF2F2` with a 4px `#B91C1C` bar down the left edge, message
  bumped to `#B3261E` semibold (5.98:1).
- **Trust bar** fits one line at 375px and 320px, no overflow.
- **mu-plugin bug fixed.** It had `height: 1420px !important`, which
  *overrode GHL's own resize script* and froze the iframe at a hard-coded
  guess — add a field and it would clip. Now `min-height` only, so the script
  can grow it. Self-correcting, which is what was actually wanted.

### Two findings worth remembering

1. **Only 3 fields are required** (Full Name, Email, Phone). All six
   home-detail dropdowns are optional — someone can submit with zero home
   details and reach BookingKoala with nothing prefilled.
2. **`:has(.error)` is safe** because GHL injects `.error` only after failed
   validation — confirmed zero `.error` nodes exist pre-submit. If GHL ever
   changes to pre-rendering hidden error nodes, every field would go red.
3. Something in GHL's CSS beats even **inline `!important`** on input borders.
   Styling the wrapper (`box-shadow`) instead is uncontested. Don't burn time
   fighting the input border again.

### Inbound webhook: NOT AVAILABLE (checked 2026-08-08)

The native-form rebuild is blocked. Automation -> Workflows -> Add trigger ->
Events -> Inbound webhook shows:

> **Premium features** — "This feature is currently disabled for your account.
> Please contact your Admin/Support."

That's a Bookin60 agency restriction, not a GHL plan limit. Worth one support
ticket to Bookin60, since it's the change that would end the iframe problems
permanently (own markup, autocomplete attributes, native selects, real inline
validation, no Turnstile, direct redirect).

### Measurement: GHL covers submissions only

GHL natively tracks form submissions (Submissions + Analytics tabs). It cannot
know about BookingKoala bookings — different system, no shared identity. The
gap is the *join*, not the counting. The bridge page is the one place both
systems touch, so a source parameter passed through it is how you'd attribute
BK bookings back to the form.

## Round 4 — leftover mustard + desktop scroll (2026-08-08)

**The placeholder highlight.** After switching fields to white, a yellow box
still hugged the placeholder text in all six dropdowns. Cause: the mustard was
set on the placeholder/value **spans**, not just on the field — so changing
the field's background left the span's own background behind. Grey `#6B7280`
on that mustard measures **3.36:1 (fails)**, so the earlier "4.83 passes"
reading was wrong for the dropdowns; it was measuring against the field, not
the span. Fixed by clearing the span backgrounds; now genuinely 4.83.

Lesson: when a colour is being replaced, check whether it is set on the
container *and* its children. Measure contrast against the element the text
actually sits on.

**Desktop inner scroll.** Measured content heights: **1239px desktop,
1328px mobile** — against an 800px iframe. So desktop also had a hidden inner
scroll region until the deferred resize script fired. Floors now:

    all widths       min-height: 1300px
    <= 768px         min-height: 1420px

Both `min-height`, so GHL's resize script can still grow the iframe. Verified
live: iframe renders 1300px, no inner scrollbar.

**Placeholder copy is DONE** (user did it): "First and last name",
"you@example.com", "Phone Number". Dropdowns left alone by design.

### The builder preview lies about colour

The form-builder canvas ignores saved Custom CSS — it renders every field in
the old mustard while the live form is white. Every builder screenshot in this
project showed yellow fields that do not exist in production. **Judge the form
at `api.bookin60.com/widget/form/AwJDnvuYtkojIN3aOysC` or on the live site,
never in the builder.**

## Round 5 — section headings (2026-08-08)

**LIVE.** Two headings now split the form:

    STEP 1 OF 2 - ABOUT YOUR HOME          (above the six dropdowns)
    STEP 2 OF 2 - WHERE TO SEND YOUR QUOTE (above the contact fields, with a
                                            divider rule above it)

Implemented as `::before` on the first field wrapper of each group, anchored
to the stable ids `[id$=_zZe52Ae37d5GYopA6Ozr_0]` and `[id$=_full_name_6]`.
Chosen over adding builder elements because that needs drag-and-drop, which
is not reliably automatable here. Colour #4B5563 = 7.11:1 on the card.

Why headings rather than a progress bar: **this form config has no
page/slide/step support at all** — GHL *Forms* are single-page; multi-step
with a progress bar lives in GHL *Surveys*. A real progress bar therefore
means rebuilding as a Survey, which would also mean re-doing the prefill
wiring. Not worth it for the progress bar alone.

Also worth remembering: research favours *making a form shorter* over
*signalling that it is long* — an explicit progress indicator can raise
abandonment by making the length concrete. Dropping Half Baths would beat
any amount of progress signposting.

## Autofill is disabled on the contact fields (found 2026-08-08)

    full_name   autocomplete: (none)
    email       autocomplete: (none)
    phone       autocomplete: "off"    <-- explicitly disabled

On mobile this kills one-tap fill for the three required fields — the single
biggest time-saver a phone user can get. It is an HTML attribute, so it
cannot be fixed from CSS, and the form is a cross-origin iframe so JS cannot
reach it either.

**Add this to the same Bookin60 support ticket as the inbound webhook.**
Both are unlocked by the native-form rebuild.

## Round 6 — REGRESSION I CAUSED, and its fix (2026-08-08)

**Symptom (user, on a phone):** after tapping any field, the page stops
scrolling; you have to fight it.

**Cause: me.** The section headings added ~100px, taking mobile content from
1328px to **1428px** — against the **1420px** iframe floor. That 8px overflow
re-created an inner scroll region, and on iOS an iframe with *any* internal
scroll swallows the swipe. Exactly the bug the floor was introduced to
prevent, reintroduced by adding content without re-measuring.

**Rule going forward: any change that adds height to the form must be
followed by re-measuring content height and comparing it to the floors in
`dc-form-embed-fix.php`.** Note `documentElement.scrollHeight` is clamped to
the iframe height and will lie — measure the real content instead:

    let m=0; doc.querySelectorAll('body *').forEach(el=>{
      const r=el.getBoundingClientRect();
      if(r.height>0) m=Math.max(m, r.bottom+doc.defaultView.scrollY); });

**Fix (tested, NOT YET PASTED):** tightening the mobile rhythm takes content
1368px -> **1205px** (163px / 12% less scrolling), comfortably under the
1420px floor, which removes the inner scroll region. Tap targets stay 59px.
Wrapper margins 16px -> 10px; label line-height 1.8 -> 1.35; label margin
8px -> 5px; form padding trimmed.

Ready-to-paste block: `PASTE-ME-into-GHL-custom-css.txt` in this folder.
The builder crashed or closed the panel on four consecutive attempts.

**Heading text corrected** in the same block: "Where to send your quote" was
wrong (the quote appears on the next page, it is not emailed) ->
"Step 2 of 2 - Your details".

## INCIDENT: site taken down, 2026-08-08

**What happened.** Editing `wp-content/mu-plugins/dc-form-embed-fix.php`
through SiteGround's File Manager, a paste landed as invalid PHP and was
saved. dutycleaners.ca returned "There has been a critical error on this
website." SiteGround Site Tools then also returned "Site Unavailable", so the
file could not be reverted from there. The user renamed the file to disable
it and the site recovered.

**Root cause of the bad save.** `Ctrl+A` in the Monaco editor did not take
effect before the paste, so the new content merged with the old instead of
replacing it — the same append-instead-of-replace behaviour seen earlier in
the session. It was saved without re-reading the editor contents.

**Two rules that follow from this:**

1. **Never put this kind of tweak in PHP.** The iframe height floor is now in
   **Appearance → Customize → Additional CSS** (mirrored in
   `wp-additional-css.css`). CSS cannot white-screen a site; PHP can. There
   was never a reason for this to be PHP.
2. **Verify the editor's contents before saving, and verify the site after.**
   Read the value back programmatically (brace balance, comment balance,
   expected strings) rather than trusting a laggy screenshot, and load the
   live URL before navigating away.

The MU-plugin is disabled (`dc-form-embed-fix.php.off`) and should stay that
way. Its local copy has been deleted from this folder so it cannot be
redeployed by mistake.

## Current live state (2026-08-08)

| Thing | Where it lives | State |
|---|---|---|
| Prefill bridge | `public_html/quote-redirect/index.html` | live |
| GHL redirect URL | GHL → Settings → On Submit | live |
| Move-out frequency condition | GHL → Conditions | live |
| Colours, focus ring, errors, labels, trust bar, headings | GHL → Custom CSS | live |
| Iframe height floor | WP Customizer → Additional CSS | live (1400 / 1500) |
| Homepage copy | Elementor widget `5a149dd2`, page id 6615 | live |
| Mobile rhythm + corrected Step 2 heading | GHL → Custom CSS | live |

**Everything is now applied.** Verified 2026-08-08 end to end:

    headings      "Step 1 of 2 - About your home"
                  "Step 2 of 2 - Your details"   (old wording gone)
    content       desktop 1279px · mobile 1227px @320 · 1205px @375+
    floor         1350px, ~71px headroom, no inner scroll at any width
    contrast      placeholder 4.83 · labels 16.69 · button 7.14
    layout        13/13px side gaps, 59px tap targets, no x-overflow
    copy          "see your price on the next page. No waiting."

Floor consolidated from two breakpoints (1400/1500) to a single 1350px, since
the mobile tightening made mobile content *shorter* than desktop. That also
cut ~220px of dead space below the form.

Homepage copy now reads: *"Fill out the form below and see your price on the
next page. No waiting."* — replacing "we'll instantly email you a quote",
which promised an email that never arrives. Edited in Elementor
(`/wp-admin/post.php?post=6615&action=elementor`), published, verified live.

### Still open

- **Placeholder copy** — the three text fields still restate their labels
  ("Full Name" under "Full Name"). Per NN/g they should carry format examples:
  Full Name -> remove or "First and last name"; Email -> "you@example.com";
  Phone -> "(780) 555-0123". Dropdown placeholders ("Select service") are
  fine as-is — for a select, the placeholder IS the empty-state affordance.
  Not done: the builder would not load on the final attempt.
- **Sticky mobile CTA** — deliberately NOT built. Because the iframe is
  floored tall enough not to scroll internally, sticky positioning inside the
  form has nothing to stick to; done on the parent page it could only scroll
  to the button, not submit (cross-origin). And a permanent CTA while fields
  are empty invites clicks that only trigger validation errors. A "Free
  instant quote ↓" bar that scrolls people *back* to the form is the variant
  that would actually help.

## Backlog

- Handoff copy on the BK page so it reads as step 2 ("Here's your price — pick a
  date to lock it in").
- Track weekly: GHL submissions vs completed BK bookings. That ratio is the
  metric this whole rebuild targets.
- Phone-required decision (required phone can cost up to ~37% of submissions;
  mitigate with optional phone or "no sales calls" microcopy).
- BK page's own bugs: triplicated booking-summary sidebar, weak "Save Booking"
  button copy for a checkout.
- Longer-term: replace the GHL form with a native HTML form that POSTs to a GHL
  inbound webhook and redirects straight to BK — removes GHL form constraints
  entirely.

## 2026-08-23 — Google Analytics tag swap (security)

**Finding.** dutycleaners.ca was loading Google Analytics property **G-WD50W6TPBS**, which is
NOT in the owner's Analytics account. The owner's only property, **G-5WNJ12G6OD**
(account "Dutycleaners" 88353021 / property 318563830), appeared zero times on the site and
showed "No data received from your website yet".

Why it matters: Search Console's Google Analytics verification method requires (a) the
property's gtag on the homepage and (b) Edit permission on that property. Whoever controls
G-WD50W6TPBS satisfied both, permanently — the most likely route for the unknown owner who
appeared in Search Console. Removing users from Search Console and from the owner's own GA
account would not have closed it.

Ruled out beforehand: no verification `<meta>` tag on the site; no verification TXT in DNS
other than the owner's own; google8c1a8ea32c757621.html is the owner's own file (tokens are
account-specific, so it could never have verified anyone else) — DO NOT DELETE IT.

**Location of the tag.** WPCode (Lite) -> Code Snippets -> Header & Footer -> Global Header.
Not SEOPress: SEOPress -> Analytics has Google Analytics toggled OFF with an empty
measurement-ID field. The header box is ~40,543 chars / 1,261 lines; the JSON-LD LocalBusiness
schema occupies most of it and the gtag block sat at lines 1252-1260. Standard Google-issued
snippet, nothing malicious in it — just the wrong property.

**Change made.** Replaced both occurrences of the ID (script src on line 1253, gtag('config')
on line 1259). Done by double-clicking the token in the CodeMirror editor and typing the
replacement — both IDs are 12 chars, so no line lengths shifted. Saved, then purged SG cache
from the admin bar.

**Verified live:** homepage and /house-cleaning-services-edmonton/ both return 2x
G-5WNJ12G6OD and 0x G-WD50W6TPBS; 2 JSON-LD blocks still present; HTTP 200.

**To reverse** (only if G-WD50W6TPBS turns out to belong to the owner under a different Google
login): same box, swap 5WNJ12G6OD back to WD50W6TPBS, save, purge cache.

**Still open for the owner:**
- Search Console: remove any remaining owners; lean on the new Domain property (DNS-based, so
  it cannot be claimed by putting a tag on a page).
- GA property access shows one human (dutycleanersedmonton@gmail.com, Administrator) plus five
  automatic Google Ads link rows for Ads account 848-201-1139. The `administrator` row grants
  **Editor** on the GA property — confirm nobody outside the business has admin on that Ads
  account, or that link is a live door.
- Check WordPress -> Users for accounts that shouldn't be there. The two (inactive) WPCode
  sample snippets are authored by a WP user `wjmwebteam` — likely the agency/developer that
  built the site, and a plausible owner of G-WD50W6TPBS.
- Analytics history restarts from zero in G-5WNJ12G6OD. Past data lives in G-WD50W6TPBS and
  can only be recovered by whoever controls it.

## 2026-08-23 — Full site content/malware audit

Scope: all 121 URLs in the sitemap (posts, pages, categories, tags), fetched live and
inspected for hidden links, cloaking, obfuscated scripts, and off-site redirects. No server
filesystem access — this is a black-box audit of what the site actually serves.

**Clean:**
- No `eval()`, `atob()`, `document.write`, `fromCharCode`, `unescape`, or base64-blob payloads
  in any page's scripts.
- No hidden-text link spam (display:none / visibility:hidden / font-size:0 anchors) — the only
  `display:none` anchor is WordPress core's own "cancel comment reply" link.
- No off-domain canonical tags, no noindex/cloaking via robots meta (all 121 pages carry a
  normal `index, follow`).
- No spam anchor text (casino/pharma/loan/etc.) anywhere in 121 pages.
- iframes only ever point to api.bookin60.com (your GHL form), Google Maps, or your own BK
  booking domain. Scripts only load from the site itself + googletagmanager.com.
- Googlebot-UA vs real-browser-UA served byte-identical link sets — confirmed NOT cloaking
  (an earlier 403 on a bare-curl "browser" request was SiteGround's WAF rejecting a
  header-thin request, not the site; a full browser header set got 200 + identical HTML).
- No injected redirects: /wp-admin, 404s, ?p=, /amp/, /wp-json/ all behave normally; no
  unexpected 301/302 chains.
- Backdoor-file probes (shell.php, wp-vcd.php, .env, wp-config.php.bak, debug.log, etc.) all
  403/blocked; uploads directory listing is off.
- Every external link across all 121 pages is either your own domain, your socials
  (FB/IG/X/YouTube), Google (Maps/Search/Docs), gmpg.org (WP theme boilerplate), BookingKoala,
  or genuine Edmonton-area local citations (schools, community leagues, city sites, malls,
  parks) consistent with the site's neighborhood/location content — normal local SEO, not link
  spam.

**One real issue found — leaking links to a stranger's staging site.**
Post: https://dutycleaners.ca/10042/cleaning-services-calgary-transform-your-space/
Contains 3 links to `mikaily92.sg-host.com` — a SiteGround default *.sg-host.com temp/staging
domain belonging to someone else's WordPress install (username-looking prefix "mikaily92").
Read as AI-generated/templated blog content whose internal links were never swapped from the
writer's demo site to dutycleaners.ca before publishing — not a hack, but:
  - Bleeds a little authority to an unrelated stranger's site on every crawl/visit.
  - If SiteGround ever recycles that subdomain to a different customer, visitors following
    those links land on an unrelated, unvetted site — a live (if minor) reputational/safety
    risk that will only get worse with time, silently.
Fix: edit the post, replace the 3 `mikaily92.sg-host.com` links with the matching
dutycleaners.ca pages (services/, and the two blog posts they're clearly meant to cross-link
to), or remove the links if no matching page exists. Low urgency, but worth doing.

**Not checked (needs server/plugin-admin access, out of scope for a black-box HTTP audit):**
- Raw PHP/theme file diffs against clean copies (can't read the filesystem).
- WordPress core/plugin/theme integrity or version-vulnerability scan.
- Database-level injected content (would only show if it renders on a public page — none did).
- Scheduled/cron-triggered cloaking that only fires for specific referrers or times.
If deeper assurance is wanted, a WordPress security plugin (e.g. Wordfence/Sucuri) file-integrity
scan from inside wp-admin would cover this gap.

## 2026-08-23 — Fixed the mikaily92.sg-host.com link leak

Edited https://dutycleaners.ca/10042/cleaning-services-calgary-transform-your-space/ in the
Gutenberg editor (post ID 10042). Repointed all 3 links:
  - "Click here to learn more about: services" -> https://dutycleaners.ca/services/
  - "Affordable Cleaning Calgary Delivers Quality Services" -> https://dutycleaners.ca/cleaning-services-calgary/
    (no exact-match post exists on the site for this one; used the closest topical page)
  - "Cleaning Services Edmonton You Can Trust" -> https://dutycleaners.ca/9448/cleaning-services-edmonton-you-can-trust/
    (exact match — this post already exists on the site)
Verified live: 0 remaining references to mikaily92.sg-host.com on the page; all 3 new links
confirmed present in the served HTML.

Note for future edits in this editor: an accidental Page_Down keypress while a text block had
focus typed the literal string into the post instead of scrolling (the canvas doesn't respond
to mouse-wheel scroll reliably — use the List View panel, click a block there, to navigate
instead). The Ctrl+Z recovery from that also undid one edit too many and silently reverted the
first link fix; re-verify each link's target after any undo, don't just trust the visual
"looks right" state.
