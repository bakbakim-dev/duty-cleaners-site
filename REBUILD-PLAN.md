# Duty Cleaners — Website Rebuild Plan

**Purpose of this document:** A complete, self-contained build specification for the Duty Cleaners marketing site (currently a Lovable/React app at `preview--dutycleaners-clone-project.lovable.app`). It merges a competitive teardown of SimplyMaid.com.au (a best-in-class cleaning booking site) with a design review, into one prioritized plan. Execute phases in order — Phase 1 is the engine; everything else supports it.

**Business context the builder needs:**
- Duty Cleaners is a house-cleaning company serving **Edmonton** (main, phone 780-913-6565, office 18615 71 Ave NW) and **Calgary** (403-768-1341, office 2835 37 Street SW #24). Operating **since 2017**. Services: Standard Cleaning, Deep Cleaning, Move In/Out, Post-Construction, Commercial.
- Leads currently flow into **GoHighLevel (GHL)**; scheduling/booking runs on **BookingKoala**. The current site embeds a default-styled GHL 2-step form that collects name/email/phone and promises an "instant quote" — but **no price is ever shown on-page**. That is the single biggest problem this rebuild fixes.
- Brand: navy / warm gold / orange, local-Alberta identity. **Keep it.** Do not restyle toward a pastel/editorial look.

**Golden rules (apply to every task below):**
1. Every claim on the site must be literally true and verifiable (real review counts, real insurer, real dates). Placeholder numbers must be flagged `TODO-OWNER` for the owner to fill, never invented.
2. One primary CTA per screen-height, in orange; orange is used for booking actions only.
3. Verb-first, quantified copy ("See your price in 60 seconds"), not adjectives ("premium quality service").
4. One source of truth for all prices and all review numbers — a single config/data file that every component reads. Never hard-code a price or count in two places.
5. Keep the page light: no video hero, no heavy animation libraries. Small functional transitions only (form-step progress, hover states).

---

## Phase 1 — The booking engine (do this first, it's the whole point)

### 1.1 Live price calculator
Replace the embedded GHL iframe form with a **native React quote flow** that computes and displays a real dollar price before asking for contact details.

- **Do NOT invent a price matrix.** The funnel's entire option set and pricing comes from a snapshot of the live BookingKoala configuration (see 1.5.4 — BookingKoala is the source of truth). The site renders whatever BK asks, with BK's exact names and prices.
- Flow order (owner decision, 2026-08-15 — lead-first): **(1) home details → (2) contact details ("Where should we send your quote?") → (3) price reveal + extras → confirm**. The lead is captured in GHL at step 2, BEFORE the price is shown, so every person who sees a price is already a lead. (Trade-off accepted: slightly lower completion than price-first, in exchange for zero lost leads.)
- **No postal code anywhere in the site funnel** (owner decision: friction, plus move-in/move-out customers don't know which address's code to give). BookingKoala collects the full address — with browser autofill — at actual booking time. The site shows one honest disclaimer instead (see step 3 below).
- Sticky price panel (sidebar on desktop, pinned bar on mobile) that updates on every selection, showing: first-clean price, ongoing per-visit price when a recurring frequency is chosen, and a computed "Saving $X" chip.
- If exact pricing isn't possible for a service (e.g. Post-Construction), show an honest range: "Estimated $X–$Y — lock in your exact price by picking a time."
- On submit, POST to the hidden GHL form endpoint (see Phase 1.5 — the account has no Inbound Webhook trigger) with the **computed quote, service, home size, and frequency as custom fields** so leads arrive pre-qualified. Then hand off to BookingKoala for scheduling where applicable.
- Contact step heading: "Where should we send your quote?" with button "See my price →". Two POSTs to the GHL form: one at step 2 (the lead: contact + home selections), one at the step-3 confirm (GHL merges by email and adds the site-quoted price + chosen extras). These are a CRM snapshot of what the customer was shown — BookingKoala remains the source of the true final price at booking time.
- Step 3 is a **pure payoff screen** (decision 2026-08-15, conversion review): the price with a
  "+ 5% GST" note, NO extras selection anywhere in the site funnel. **[CORRECTED 2026-08-15:
  the original technical premise was wrong — BK's URL prefill DOES carry extras via
  `extras[id]=quantity` (verified live; see Appendix E). The no-extras-menu decision still stands,
  but now on conversion grounds alone (shorter funnel; Baymard's top abandonment driver is
  surprise costs), and the Deep Cleaning intent path uses the extras param to pre-select the
  package on handoff.] At most a passive line: "Popular add-ons like inside oven & fridge can be added
  on the booking page." Plus small print: "Addresses outside Edmonton or Calgary city limits may
  include a travel fee — we confirm before your clean." That one line replaces any
  postal-code/service-area gating.

### 1.2 Recurring-revenue architecture
- Replace the frequency dropdown with **chips that print the discount**, using BookingKoala's real frequency list and real recurring discounts from the config snapshot (BK's live frequencies: One-Time / Weekly / Bi-Weekly / Every 4 Weeks; the bi-weekly recurring discount observed live is ~10.7%, e.g. $154.99 first clean → $138.33 recurring). Pre-select Bi-Weekly with a "Most Popular" badge.
- Price panel splits into "First clean $X · then $Y per visit" whenever a recurring option is selected.
- New-customer offer in the announcement bar: "$20 off a one-time clean · $40 off your first recurring clean — applied automatically" (amounts `TODO-OWNER`). Build it so the bar can be toggled/scheduled per campaign — the owner has not decided whether it runs permanently.

### 1.3 Hero = Step 1 of the funnel
- H1 becomes a measurable action promise. Recommended: keep the local emotional line as an eyebrow and make the H1 verb-first — Eyebrow: "Bonded, insured, and locally trusted" · H1: "See your Edmonton cleaning price in 60 seconds." · Support: "Book rigorously vetted local pros on your schedule — no phone call needed."
- Replace the current informational hero card ("YOUR CLEAN STARTS HERE" — it has no input and no button) with the **real first step of the quote flow**: ONE control only (service type selector, or city/postal-code with an Edmonton placeholder like "Try T6X or Windermere"), a "Step 1 of 3" progress bar, and a Continue button that carries the answer into the full flow.
- Directly under the H1: one review metric ("4.8 ★ from N Google reviews in Edmonton" — real numbers, see 2.1), plus "No phone call needed" and "Bonded & insured". Maximum three proof points in the hero; move the rest below the fold.

### 1.4 Risk-reversal at the point of commitment
Adjacent to every submit/continue button (not in the FAQ):
- "You won't be charged today"
- "Free rescheduling or cancellation up to 24 hours before your clean"
- "No contracts — book one clean or many"
Only ship lines that are operationally true (`TODO-OWNER` to confirm each). Repeat the same trust row on the BookingKoala handoff page (BK supports custom header/footer content) so reassurance doesn't vanish mid-funnel.

---

## Phase 1.5 — Integration wiring (GHL + BookingKoala)

**Current state (verified 2026-08-13 by inspecting the deployed preview bundle):** the quote funnel UI is built and works — live price, frequency chips, Step 3 contact form ("Confirm my booking request"). But the submit handler makes **no network call**: it shows a success message and the data goes nowhere. The only BookingKoala reference in the bundle is the literal placeholder `replace-with-your-bookingkoala-url.com`, and there is no GHL/LeadConnector or webhook reference anywhere. This phase wires the existing UI to the real systems. **The UI stays as-is; only the submit path and handoff change.**

### 1.5.1 Architecture
**Constraint (confirmed 2026-08-13): this GHL account does NOT have the Inbound Webhook trigger — it's a premium feature that is not enabled. Do not build against it.** The v1 bridge is GHL's **native form endpoint**, available on every plan: a GHL form (never shown to customers) acts as the data inbox, and the standard **"Form Submitted"** workflow trigger runs the automation.

The site form is the customer-facing overlay. On submit it does ONE thing: POST the full quote payload to the hidden GHL form's submission endpoint. GHL is then the single bridge to everything else (CRM contact, follow-up automation, and the BookingKoala booking). The site never talks to BookingKoala directly in v1.

```
Site quote form ──POST (form fields)──▶ Hidden GHL Form ──"Form Submitted" trigger──▶ GHL Workflow
                                          ├─▶ Create/update contact + opportunity, tag "instant-quote"
                                          ├─▶ Notify office (SMS/email) with full quote details
                                          ├─▶ Confirmation SMS/email to customer ("we'll confirm your time shortly")
                                          └─▶ Create booking in BookingKoala (API / Zapier / Make, or manual office step in the interim)
```

(If Premium Triggers & Actions are ever enabled on the account, this can be swapped for an Inbound Webhook trigger with a JSON POST — cleaner, but strictly optional. Everything downstream stays identical.)

### 1.5.2 The submit request (site side)

**Captured values (inspected live from the account on 2026-08-13 — use these, do not re-derive):**

| Item | Value |
|---|---|
| GHL location ID | `4OROmtMn8LQqaDsUJPjC` |
| Form name / ID | "Website Form" / `AwJDnvuYtkojIN3aOysC` |
| Public form URL | `https://api.bookin60.com/widget/form/AwJDnvuYtkojIN3aOysC` |
| Submit endpoint | `POST https://api.bookin60.com/forms/submit` (the widget bundle references relative `/forms/submit`; this is the white-label proxy of GHL's standard `backend.leadconnectorhq.com/forms/submit`) |
| Standard field names | `full_name`, `email`, `phone` |
| Custom field: service type | `zZe52Ae37d5GYopA6Ozr` (placeholder "Select service") |
| Custom field: home type | `otoaEP8TY5qqswGWnUL4` |
| Custom field: bedrooms | `NhySfYuxF5om26mXd0Cn` |
| Custom field: bathrooms | `T8UTS5jMZjlggnAFfNTm` |
| Custom field: half baths | `ZH7gPapo6SSzd82UNkDf` |
| Custom field: frequency | `jh1wUn1kdBcgytjX0YZu` |

- **SUPERSEDED (2026-08-15): the form-endpoint path is dead — see `GHL-INTEGRATION-BRIEF.md`.**
  GHL rejects tokenless posts to the form endpoint (`429 missing-input-response`; the Turnstile
  sitekey is domain-locked to GHL's domains, error 600010 elsewhere). Instead of disabling the
  form's captcha, the relay now delivers leads via **GHL API v2 `POST /contacts/upsert`
  (services.leadconnectorhq.com) with a Private Integration token** stored as a backend secret —
  authenticated, documented, no open endpoint, form captcha stays on. Workflow trigger changes
  from "Form Submitted" to "Contact Tag Added = instant-quote" (+ optional `quote-confirmed` for
  step 3). The form field keys captured above remain useful only as the reference list of which
  contact custom fields must exist. Full payloads, owner setup, fallback (Plan B: captcha-off with
  mitigations, only if Private Integrations is unavailable), and test checklist: `GHL-INTEGRATION-BRIEF.md`.
- **Lead safety net (unchanged):** the relay writes every attempt to a locked-down `quote_leads` table (home details, contact, quoted prices, extras, page URL, tracking params, GHL delivery outcome) BEFORE calling GHL. Step 3 still opens only on genuine GHL success; the table means a GHL outage never loses a lead. No public read access; inserts server-side only.
- **Fields still missing from the form (owner adds in the form builder, can be hidden):** city, selected extras, first-clean price, recurring price, frequency discount %, page URL. (Postal code is intentionally NOT collected on the site — BookingKoala captures the full address at booking.) Until these exist, the funnel has nowhere to put the computed prices — add them BEFORE wiring.
- **Dropdown option values:** send the same option labels the public form shows (e.g. the service list on the form — verify by opening the public form URL once). Free-text mismatches will still store, but consistent values keep GHL workflow filters reliable.
- Map every funnel value to its field; store the endpoint + form ID in one config constant. Reference payload (same data, JSON view):

```json
{
  "source": "dutycleaners.ca instant quote",
  "city": "edmonton",
  "service": "standard",
  "bedrooms": 2,
  "full_bathrooms": 1,
  "half_baths": 0,
  "addons": ["inside_fridge"],
  "frequency": "every_2_weeks",
  "frequency_discount_pct": 10,
  "first_clean_price": 179,
  "recurring_price": 161,
  "currency": "CAD",
  "full_name": "…",
  "email": "…",
  "phone": "…",
  "page_url": "…",
  "submitted_at": "ISO-8601"
}
```

- **Success state:** only show the success message after a 2xx response. Success copy must match reality: "Request received — we'll text you within [X] to confirm your time." (`TODO-OWNER` for the real response-time promise.)
- **Failure state:** if the POST fails, do NOT show success. Show: "Something went wrong — call us at (780) 913-6565 or email support@dutycleaners.ca and we'll honour this price," and keep the entered data on screen. Optionally fire a fallback (e.g. mailto or retry) — but never silently drop a lead.
- Basic spam protection: honeypot field + a minimum-time-on-form check. No CAPTCHA (adds friction; prohibited from being the customer's problem at this volume).

### 1.5.3 GHL workflow (owner/GHL side)
Inside the workflow triggered by **"Form Submitted"** (select the "Website Instant Quote" form as the trigger filter):
1. Create/update contact; map custom fields for service, home size, frequency, quoted prices; tag `instant-quote` + city.
2. Create an opportunity in the pipeline with the quoted value.
3. Internal notification (SMS/email to office) with the full quote so a human can confirm scheduling fast — speed-to-lead is the point of this whole build.
4. Customer confirmation SMS + email restating THE SAME PRICE the site showed (pull from the submitted custom fields — never recompute in GHL, or the numbers will drift).
5. BookingKoala step — one of, in order of preference:
   a. BK API "create booking/lead" call if the BK plan includes API access (`TODO-OWNER` to confirm plan; BK exposes API + webhooks on higher tiers), via GHL's webhook action or a Zapier/Make bridge.
   b. Zapier/Make scenario: GHL → BookingKoala connector.
   c. Interim manual step: office receives the notification and enters the booking in BK. Acceptable at current volume; automate later.

### 1.5.4 BookingKoala is the source of truth (inspected live 2026-08-13)
**Principle: the site never invents an option or a price. The funnel renders what BookingKoala's booking form asks, with BK's exact names and BK-computed prices. GHL only skims the lead subset it wants.**

**The live BK booking form** (`https://dutycleaners.bookingkoala.com/booknow`, public) has this real structure — mirror it, do not substitute the invented taxonomy currently in the Lovable funnel:
- **Industries (tabs):** Home Cleaning · Post Construction Cleaning · Airbnb Cleaning · Office Cleaning. (Post-Construction and Commercial/Office are NOT services under Home Cleaning — they're separate industries with their own forms.)
- **Services (Home Cleaning):** Standard Cleaning · Move in Move Out Cleaning. **"Deep Cleaning" is NOT a service — it's an extras package tiered by home size ($99.99–$179.99+).**
- **Frequencies:** One-Time / Weekly / Bi-Weekly / Every 4 Weeks, with BK-configured recurring discounts (observed live: 1-bed standard $154.99 first clean → $138.33 recurring bi-weekly ≈ 10.7%).
- **Pricing variables:** home type (Two Storey House / Duplex Townhouse / Bungalow / Basement Suite / Apartment-Condo), bedrooms 1–7 **with sqft definitions in the labels** ("3 Bedrooms (Under 1700sqft)"), full baths 1–7, half baths 0–4.
- **Extras (real, with real prices from config):** Deep Cleaning (tiered), Inside Windows **$179.99** (the current Lovable funnel invented "+$45" — exactly the mismatch this section exists to prevent), wipe window blinds (per set), spot cleaning inside walls, complete wall washing, pets surcharge ("Must choose if you have pets"), Inside Oven, Inside Fridge, Inside cabinets, de-cluttering per hour, garage/balcony sweep, outside-Edmonton/Calgary travel fee.
- Also on the BK form: entry method, cleanliness scale 1–5, flexibility, parking, date/time with 1-hour arrival windows, tips, coupon codes, gift cards, card hold day-before / charge after service.

**How the site gets this data — generated snapshot (v1):**
- The BK booking page loads its whole config from public JSON endpoints on the BK subdomain: `GET /api/v4/industry/{id}/form-settings`, `GET /api/v4/merchant/form-settings/{industry}/{form}/settings`, `GET /api/v4/industry-settings-new/{industry}/{form}?type=add` (this last one contains services, variables, frequencies+discounts, packages, and extras with `prices_ml`/durations). Verified: the extras/prices are all present in these responses.
- **Do NOT script or probe these endpoints.** They require a session handshake (`/bkutility/v1/preload`, `/bkutility/v1/session/init`) plus an `Auth-Session` header the Angular app attaches; attempts to replicate it externally return "Error #119: Unauthorized request", and repeated attempts trip BookingKoala's anti-abuse protection — which blocks the booking form from rendering for that session (observed 2026-08-15 during research; the form's own `appload-customer` call began returning Error #119).
- **v1 capture — do it by hand, once (about 2 minutes):** open `https://dutycleaners.bookingkoala.com/booknow` in a normal browser → DevTools → Network → filter `industry-settings-new` → reload → right-click the request → "Copy response" (repeat for `/api/v4/industry/1/form-settings` and `/api/v4/merchant/form-settings/1/1/settings`) → paste into `bk-config.json` in the repo. This is a human action in a normal session; it triggers no protection. Re-do it whenever BookingKoala settings change. The funnel UI and price calculator are **generated entirely from this file** — services, home types, bedroom/bath labels (keep the sqft wording), extras with prices, frequency discounts, using BK's price fields. Re-sync = re-capture + redeploy whenever BK settings change (owner owns this trigger; prices change rarely).
- **Parity check:** a documented 2-minute procedure (re-capture live config, diff against `bk-config.json`) run before any deploy and monthly — drift between site and BK must fail loudly, not silently.
- **v2 (optional, later):** replicate the session bootstrap client-side to fetch config live at runtime with `bk-config.json` as fallback; or use BK's official API if the plan includes it. Only worth it if BK settings start changing often.

**Booking handoff — DECIDED 2026-08-15: prefilled redirect to BookingKoala (v2 is now the spec).**
The booking-request-only model tested poorly (customers never actually book). The funnel keeps its
lead-first flow, and Step 3's price screen now ends in a real booking:

- **Primary CTA: "Choose my date & time →"** — fires the existing GHL upsert (tag `quote-confirmed`),
  then redirects to BookingKoala with everything preselected:
  ```
  https://dutycleaners.bookingkoala.com/booknow?industry_id=1&form_id=1
    &service_id=<6 Standard | 2 Move In/Out>
    &frequency_id=<1 One-Time | 3 Weekly | 4 Bi-Weekly | 64 Every-4-Weeks>   (always 1 for Move In/Out)
    &pricing_parameter[9]=<home type option id>
    &pricing_parameter[1]=<bedrooms>  &pricing_parameter[2]=<full baths>  &pricing_parameter[8]=<half baths>   ← Standard
    &pricing_parameter[5]=<bedrooms>  &pricing_parameter[6]=<full baths>  &pricing_parameter[7]=<half baths>   ← Move In/Out (DIFFERENT category AND option ids)
    &f_name=&l_name=&email=&phone=
  ```
  This exact mechanism ran LIVE on the old site (see `notes.md` + `bridge.js` in this folder — the
  complete label→ID maps, verified 2026-08-07, including the per-service category/option ID split and
  the URL-encoding traps). URL preselection is officially supported by BookingKoala
  (help.bookingkoala.com "Query parameters & preselected fields on the booking form").
  The customer lands on BK with service/frequency/size matching the quoted price, then picks
  date/time, enters address + card — BK does the actual booking, payment hold, and confirmation.
- **Secondary CTA: "Prefer we call you? Request a callback"** — the previous booking-request
  behavior, for people who won't self-serve.
- Abandoners at the BK step are still captured GHL leads (the lead-first design's whole point) —
  the workflow follows up.

**Known wrinkles (hand these to the builder/owner):**
1. **Home type (category 9) may not preselect** — documented BK order-of-operations bug with
   multi-service dependency categories (deep dive + support-ticket repro already written in
   `notes.md`). Cost: the customer answers one question. Ship anyway; file the BK ticket.
2. **Extras do NOT carry through the URL** — which is WHY the site funnel no longer offers extras
   selection at all (see 1.1): the customer picks extras exactly once, on BK. The site's price
   screen carries only the passive add-ons line and the "+ 5% GST" note so the BK totals never
   read as a surprise.
3. Move In/Out sends `frequency_id=1` always; skip the three size params entirely if the service
   didn't map (wrong-category IDs are worse than none).
4. **Maintenance rule:** the label→ID map breaks silently if options are renamed/reordered in BK —
   re-verify after any BK settings change (same trigger as the bk-config re-sync).
5. Later polish: update the workflow SMS to offer the booking link, not just the phone.

**Seamless handoff — make site + BK read as ONE funnel (added 2026-08-15):**

*Tier 1 — ship with the redirect (all low-risk):*
1. **Custom domain**: connect `book.dutycleaners.ca` in BK (Design Forms & Website → "Change My
   Domain"; BK provisions SSL free). The redirect target becomes
   `https://book.dutycleaners.ca/booknow?...` — the URL bar never leaves the brand. (Owner adds
   one CNAME at the DNS host.)
2. **Warm the connection**: on the funnel pages add
   `<link rel="preconnect" href="https://book.dutycleaners.ca">` (+ dns-prefetch) so TLS is
   already negotiated when the CTA is clicked.
3. **Branded transition**: on CTA click, show a full-screen navy interstitial — spinner +
   "Locking in your $XXX quote… taking you to secure booking" — until the navigation unloads.
   Masks the hop; reads as one system.
4. **Progress continuity**: site steps become "Step 1/2/3 **of 4**"; the BK page's editable
   header reads "Last step — pick your time & confirm." The funnel never appears to end at 3.

*Tier 2 — embedded booking at `dutycleaners.ca/book` (spec'd 2026-08-15, full prompt in
Appendix D):* BK officially supports embedding. **Facts confirmed in this account's admin
(Settings → Design Forms & Website → Embed Forms):** the official snippet is
`<iframe src="https://<BK-origin>/booknow?embed=true" style="border:none;height:1000px" width=... scrolling=...>`
plus `<script src="https://<BK-origin>/resources/embed.js">` — and that script **is iframe-resizer
v4.1.1 (parent side)**: the embedded form reports its content height via postMessage and the
iframe auto-sizes. No double scrollbar, no fixed-height hacks, no custom resize code.
`embed=true` strips BK's own site chrome inside the frame. **Hard prerequisite — custom domain
first:** `book.dutycleaners.ca` is *same-site* with `dutycleaners.ca`, so the embedded frame's
cookies/storage are exempt from Safari ITP / Firefox ETP third-party partitioning and Chrome's
cookie protections; embedding the `bookingkoala.com` origin instead makes it a cross-site iframe
where in-frame login/session gets flaky. Sequence: connect domain → flip BOOKING_ORIGIN → enable
embed mode behind a `BOOKING_MODE` flag, redirect stays as instant rollback. (View Transitions API
is NOT applicable — cross-origin/subdomain navigations don't qualify.)

**BookingKoala optimization pass (owner, in BK admin) — the definitive checklist.**
Work top to bottom; P0 is where the money is. Exact replacement copy is provided — paste as-is.

*P0 — Conversion edits at the decision moments (~45 min)*
1. **Cut the friction tail** (Industries → Home Cleaning → Form 1 → Custom Sections): make
   entry method, cleanliness scale, flexibility, and parking all **optional**, and shorten their
   labels/options:
   - "How do we enter the home?" → options: "Someone will be home" / "Key in mailbox" /
     "Access code (add it in notes)" / "Other (see notes)"
   - "On a scale of 1-5, how clean is your house?" → "How's the current condition?" — "Pretty
     clean" / "Average" / "Needs extra attention"
   - DELETE the "Is your date/time flexible?" question (its answer belongs in notes; four
     wordy options for marginal scheduling value).
   - "Where do we park?" → "Street" / "Driveway" / "Visitor parking (details in notes)" /
     "Paid parking nearby".
   One "Special notes" textarea absorbs everything else. (Baymard: too-long/complicated = 18%
   of abandonment; these four questions are the longest stretch of the page.)
2. **Turn OFF tips at checkout** (form settings / tips section): a gratuity decision before the
   service exists inflates the total at the payment moment. Collect tips post-service instead.
3. **Payment-moment copy**: make "Your card is charged AFTER the appointment is completed" the
   headline of the payment section (bold, above the card fields), add "Secured by Stripe ·
   Free cancellation up to 24h" beneath the button. Via Settings → Translation, soften/replace
   the BookingKoala-branded consent boilerplate ("...authorize BookingKoala and its affiliates...
   to deliver marketing...") if editable — it name-drops a third party and promises marketing
   at the exact moment they're holding their credit card.
4. **Button copy** (Settings → Translation): "Save Booking" → **"Book My Clean →"**.
5. **Handoff headline** (Edit form text/sections): replace "Get Pricing & Book In 60 Seconds"
   + the "Super simple!..." paragraph with: **"Here's your price — pick a date to lock it in."**
   Subline: "Your details carried over. Takes about a minute."
6. **Date section rewrite**: replace the ALL-CAPS arrival-window paragraph with:
   "Pick a day and a 1-hour arrival window." + "Free rescheduling up to 24 hours before your
   clean." (Move the no-last-minute-bookings caveat into the calendar's unavailable slots, not
   a paragraph.)

*P1 — One-brand feel (~45 min)*
7. **Customize Theme** (Design Forms & Website): navy/gold/orange, site logo, closest font.
   Desktop and mobile are edited SEPARATELY — do both.
8. **Strip the chrome** (Edit header & footer menus): header = logo + phone + Login only; footer
   = Terms/Privacy/phone. No Gift Cards, no nav — this page is a checkout, not a second website.
9. **Booking summary** (Edit booking summary): fix the triplicated sidebar (old backlog item);
   ensure it shows the recurring line ("then $X every 2 weeks after your first clean") and names
   the discount.
10. **Trust chips near payment**: add a small text/HTML block above the card fields mirroring the
    site: "Bonded & insured · 24-hour re-clean promise · Cancel free up to 24h".
11. **Industry tabs review**: funnel arrivals land preselected on Home Cleaning; decide whether
    Post-Construction/Airbnb/Office tabs should stay visible here (each is an exit ramp — if they
    get few bookings from this page, give them dedicated links instead and hide the tabs).

*P2 — Polish (~30 min)*
12. **Extras**: retitle "Anything extra? (optional)", one-line intro, order by popularity
    (Deep Cleaning, Inside Oven, Inside Fridge first). Clarify the honor-system travel-fee row's
    label ("Outside Edmonton/Calgary city limits? Add the travel fee").
13. **FAQ block**: trim to the three booking-relevant questions (When am I charged? · Can I
    reschedule? · Same cleaner each visit?).
14. **Hide the waiting-list checkbox** unless actively used — niche control mid-checkout.
15. **Coupon field**: if BK allows, collapse to a "Have a coupon?" link — an open coupon box
    sends people off-site hunting for codes.
16. **Confirmation page copy**: "You're booked — confirmation text on its way. We'll remind you
    the day before." (Sets expectations; kills where's-my-email anxiety.)
17. **Data fixes**: home type "Apartment or Condo" (option 55) has frequency "-NA-" — repair;
    remove heavy imagery from the booknow theme for load speed.
18. **No forced accounts**: verify a first-time customer can complete booking without creating a
    password (BK creates the account passively) — forced account creation is Baymard's #2
    abandonment reason (19%).

**Rejected: full custom overlay replacing BK's checkout via API.** BK's public API (Make/Zapier
tier) manages existing bookings but offers no supported create-booking-with-payment flow —
rebuilding scheduling + card capture against undocumented internals is fragile and PCI-risky for
zero customer-visible gain over the prefilled handoff.

### 1.5.5 Integration test checklist
- [ ] Submit a test quote → contact appears in GHL with all custom fields populated (service, size, frequency, both prices)
- [ ] Office notification and customer SMS/email fire, quoting the identical price shown on the site
- [ ] Submit failure path tested (block the request in devtools) → no false success shown; phone fallback displayed
- [ ] BK booking created (per chosen path a/b/c) with matching price
- [ ] End-to-end double-check on mobile

### 1.5.6 Current-build fixes (found during the 2026-08-13 review — fix in the same pass)
1. Stat tile renders "**<0%** of applicants accepted" — must be "<5%".
2. Ticker still says "10+ Years of Service" while the footer says "Serving Alberta since 2017" — standardize on "since 2017".
3. Edmonton page footer CTA links to `/edmonton-2#quote` and shows the **Calgary** phone (403-768-1341) — the Edmonton footer must use the Edmonton number (780-913-6565) and a clean route.
4. City slugs `/calgary-2` and `/edmonton-2` — rename to `/calgary` and `/edmonton` (or `/`), with redirects.
5. "How it works" Step 3 says "**Pick your time**" but the funnel never offers time selection — change to "Send your booking request" (or add real scheduling in v2). Advertised steps must match the actual flow.
6. The three named homepage Google reviews (Jennifer M., Michael R., Sarah K.) must be replaced with verbatim real reviews from the linked Google Business Profile (`TODO-OWNER` to supply). Never ship invented reviews attributed to Google.
7. Investigate a one-off UI freeze observed while stepping through the quote dialog (tab became unresponsive briefly); profile the dialog for render loops.

---

## Phase 2 — Trust and proof

### 2.1 Numbers instead of superlatives
- Pull the real Google rating and review count per city (Places API or a manual monthly update in the single data file): show it in the hero, beside the form submit, and under each review-platform logo tile (which currently show logos with no numbers).
- Replace "Bonded & Insured" with the real figure and insurer: "$2M liability coverage through [insurer]" (`TODO-OWNER`).
- Promote the existing "we accept fewer than 5% of applicants" stat from the buried Values section into the main vetting block; name the background-check provider if permitted.
- Add 2–4 honest stat tiles from BookingKoala history, e.g. "11,200+ cleans since 2017 · 63% of customers rebook" (`TODO-OWNER` for real values). Small true numbers beat big fake ones.
- Site-wide find-and-replace: every "10+ years" → "since 2017" (the site currently claims both; 2017 is correct).

### 2.2 Guarantee as a story, not an icon
Build one dedicated section for the 24-Hour Re-Clean Promise (this window is a genuine competitive edge — SimplyMaid's is 48h): exactly what qualifies, how to report it (text/call/email), what the remedy is and by when, three reassurance chips, and a real human photo or the existing 1:18 team video. One CTA: "Read the full guarantee" → a full policy page. Everywhere else on the page, the guarantee appears at most as a one-liner linking here — kill the current 7× repetition of bonded/insured/vetted claims across the page.

### 2.3 Meet-the-team module
4–8 static profile cards with written consent: real photo, first name, Edmonton/Calgary area, years with Duty, one-line bio, "Background-checked · Insured" badges. A homepage strip + a simple /team page. **No numeric per-cleaner ratings and no auto-generated per-cleaner pages** (the competitor ships "0.00" ratings and 404ing profile pages — that failure mode is worse than nothing).

### 2.4 Moderated review wall
Syndicate Google reviews through a widget or Places API **with a manual approve queue**. Show name, neighbourhood, date, star value, and a running total ("Showing 12 of N reviews"). Approve honest 4-star reviews — an all-5.0 wall reads as curated. Never auto-publish (the competitor's raw feed displays review-selling spam on their own homepage).

---

## Phase 3 — Pricing presentation

### 3.1 Service cards as merchandising
Replace the current pricing table (which anchors at the most expensive service and has nine identical "Get Free Quote" buttons) with three cards:
- Lead with the cheapest honest anchor: "from $X" + hour estimate ("2–3 hrs").
- Incremental bullets: Standard lists its inclusions; Deep says "Everything in Standard, plus: …"; Move In/Out says "Everything in Deep, plus: …".
- Badge the actual best-seller "Most Popular"; badge Move In/Out with the guarantee that applies.
- Each card's CTA deep-links into the quote flow with the service **pre-selected** (URL params/state) — never discard a selection the visitor already made.

### 3.2 /pricing page
One page publishing the real formula: base prices, per-bedroom/bathroom increments, priced add-on menu, frequency discounts, and a worked example ("3-bed 2-bath standard clean, every 2 weeks = $X first clean, $Y ongoing"). Keep the existing honest caption about price drivers (bathrooms, condition, pets, add-ons, square footage). This page targets "house cleaning cost Edmonton" searches and must read from the same `bk-config.json` snapshot as the calculator and cards (see 1.5.4) so nothing on it can disagree with BookingKoala.

---

## Phase 4 — Structure, pages, and polish

### 4.1 Local pages (hub-and-spoke, small and real)
- **Calgary hub first** (`/calgary`): the company has a real office, local phone, and Calgary Chamber badge but almost no Calgary web presence. Re-localize every module: Calgary reviews, Calgary map pins, Calgary FAQ, Calgary office block.
- Then 8–15 real neighbourhood pages per city (`/edmonton/windermere`, `/calgary/mahogany`, …): ~70% shared template + genuinely unique copy about that area's housing stock. Link all from the footer. **20–30 real pages beats 138 thin ones** — no programmatic page generation.
- Give each service card a real service detail page so the site is a browsable tree, not 12 buttons dead-ending at one form.
- Keep and feature the existing genuinely-local assets: Edmonton-winter and high-rise-condo FAQ items, Oilers/River Valley references, the map with pins, both office address blocks (strong NAP signals).

### 4.2 Header, nav, CTAs
- Reduce header links; group secondary items. One orange "See my price" button; phone number stays (a real phone path is an advantage — the competitor is email-only; keep the floating Call button on mobile).
- Primary CTAs use booking language ("See my price & book"), secondaries use intent language ("See what's included", "Read the 24-hour promise"). Never repeat the identical button 12 times.
- Fix the floating Quote/Call buttons so they never overlap page content on desktop (currently they cover cards, video caption, and FAQ rows) — hide on desktop or reserve margin.

### 4.3 Design system (keep identity, add warmth and air)
- **Colour:** deep navy for authority sections, soft ivory/off-white content backgrounds, warm gold for subtle emphasis, orange exclusively for booking actions.
- **Type:** confident sans-serif for UI/body; optionally one refined display face for major section headings only.
- **Photography:** real Alberta homes, real team, hands-at-work detail, consented before/after shots; brighten the hero image so the human subject is visible (currently heavily darkened). **Keep the before/after gallery prominent** — it's proof the competitor doesn't have.
- **Rhythm:** one major idea per section with generous whitespace: hero/booking → how it works → guarantee story → team → pricing → reviews → local/map → FAQ. Consolidate the current overlapping "why choose us" sections (trust strip, ticker, promise cards, values cards all repeat the same claims — keep each claim in ONE place).
- **Badges to keep:** BBB Accredited + Edmonton and Calgary Chamber of Commerce (third-party validators; the competitor only has self-issued seals).

### 4.4 Supporting pages (lowest priority)
- `/offers`: 1–2 evergreen auto-applied codes with min-spend and max-discount caps (owns "duty cleaners promo code" searches). Build only after the calculator exists.
- Referral: "Give $25, get $25" page, tracked via code or GHL field (`TODO-OWNER` amounts).
- Full satisfaction-guarantee policy page (linked from 2.2).

---

## Appendix A — Lovable prompt (HISTORICAL — two parts superseded)

> ⚠️ Superseded in two places, kept for context only:
> 1. **GHL delivery**: the form-endpoint POST described below is dead (Turnstile). Delivery is via
>    the API relay per `GHL-INTEGRATION-BRIEF.md`.
> 2. **Step 3**: now ends in the prefilled BookingKoala redirect with NO extras selection — the
>    current spec is **Appendix B** below.

```
Restructure the instant-quote funnel into this exact 3-step flow. Do not invent any
service names, option labels, or prices — every option and price must come from the
BookingKoala config data (bk-config.json), matching dutycleaners.bookingkoala.com/booknow
verbatim.

STEP 1 of 3 — "About your home" (no contact fields, no price shown yet):
- Service (Standard Cleaning / Move in Move Out Cleaning), home type (Two Storey House /
  Two Story Townhouse (Duplex) / Bungalow / Basement Suite Only / Apartment or Condo),
  bedrooms with BookingKoala's sqft labels ("3 Bedrooms (Under 1700sqft)"), full
  bathrooms 1–7, half baths 0–4, frequency chips (One-Time / Weekly / Bi-Weekly /
  Every 4 Weeks) with the real recurring discount printed on each chip, Bi-Weekly
  pre-selected with a "Most Popular" badge.
- Do NOT ask for a postal code or address anywhere in this funnel — BookingKoala
  collects the full address at booking time.
- Progress bar "Step 1 of 3". Continue button.

STEP 2 of 3 — "Where should we send your quote?":
- Fields: Full name, Email, Phone. Nothing else. Button: "See my price →".
- Microcopy under the button: "You won't be charged today · No spam, no obligation ·
  Prefer to talk? (780) 913-6565".
- ON SUBMIT: POST to the GoHighLevel form endpoint
  https://api.bookin60.com/forms/submit for form ID AwJDnvuYtkojIN3aOysC
  (location 4OROmtMn8LQqaDsUJPjC) with these exact field names:
    full_name, email, phone,
    zZe52Ae37d5GYopA6Ozr = selected service,
    otoaEP8TY5qqswGWnUL4 = home type,
    NhySfYuxF5om26mXd0Cn = bedrooms,
    T8UTS5jMZjlggnAFfNTm = full bathrooms,
    ZH7gPapo6SSzd82UNkDf = half baths,
    jh1wUn1kdBcgytjX0YZu = frequency
  First replicate the exact request shape by inspecting one manual test submission of
  the form's public page (https://api.bookin60.com/widget/form/AwJDnvuYtkojIN3aOysC)
  in devtools — note the page renders a Cloudflare Turnstile token; verify whether the
  endpoint accepts posts without it before relying on this, and delete the test contact.
- Only advance to Step 3 on a successful (2xx) response. On failure: do NOT show the
  price or any success state — show "Something went wrong — call (780) 913-6565 and
  we'll honour your quote" and keep the entered data on screen.

STEP 3 of 3 — Price reveal + extras:
- Show the price computed from bk-config.json: "First clean $X · then $Y per visit"
  with a "Saving $Z per visit" chip when a recurring frequency is selected.
- Below it: "Anything extra?" — the extras list from bk-config.json with BookingKoala's
  real names and real prices (Deep Cleaning tiered by home size, Inside Windows, Inside
  Oven, Inside Fridge, pets surcharge, wall washing, blinds, etc.). Toggling extras
  updates the price live. Respect BookingKoala's rules for which extras apply to the
  first clean only.
- Small print near the price: "Addresses outside Edmonton or Calgary city limits may
  include a travel fee — we confirm before your clean."
- Final CTA: "Confirm my booking request →". On click, POST to the same GHL form
  endpoint again with the same email (GHL updates the existing contact) adding:
  site-quoted first-clean price, recurring price, and selected extras (custom fields).
- Success state: "Request received — we'll text you shortly to confirm your time."
  No date picker; do not promise time selection on the site.

Update all "how it works" copy to match: 1. Tell us about your home → 2. Tell us where
to send your quote → 3. See your price & customize. Keep the advertised step count
honest everywhere.
```

---

## Appendix B — Paste-ready Lovable prompt: Step 3 booking handoff (CURRENT, 2026-08-15)

```
CHANGE to Step 3 of the quote funnel: the price screen must end in a REAL booking on BookingKoala,
and extras selection is REMOVED from the site funnel entirely. Steps 1-2 and the GHL API relay
stay as built.

REMOVE EXTRAS FROM THE FUNNEL:
- Delete the "Anything extra?" add-on pickers wherever they exist (any step). Extras are chosen
  exactly once, on the BookingKoala page — BK cannot prefill them via URL, and duplicate selection
  makes the price visibly drop on handoff (the top abandonment trigger is surprise cost changes).
- The live price panel therefore shows the core clean only: base combination, first-clean price,
  recurring price with the frequency discount.
- Under the price add: "+ 5% GST" and the passive line "Popular add-ons like inside oven & fridge
  can be added on the booking page."
- Keep the small print: "Addresses outside Edmonton or Calgary city limits may include a travel
  fee — we confirm before your clean."

STEP 3 CTAs:
- PRIMARY: "Choose my date & time →". On click, in order:
  1. Fire the existing Step-3 GHL upsert (tag quote-confirmed + site-quoted prices). Omit the
     selected-extras field (nothing is selected on-site now). Do NOT block on this call — if it
     fails, log to quote_leads and continue; the lead already exists from Step 2.
  2. Redirect (window.location) to BookingKoala, built from the funnel selections.
- SECONDARY link: "Prefer we call you? Request a callback instead" — runs the previous confirm
  behavior (upsert + "Request received — we'll text you shortly to confirm your time.").

BOOKINGKOALA REDIRECT URL:
Base: https://dutycleaners.bookingkoala.com/booknow?industry_id=1&form_id=1
Append, ALL values URL-encoded:
  service_id   = 6 (Standard Cleaning) | 2 (Move in Move Out Cleaning)
  frequency_id = 1 One-Time | 3 Weekly | 4 Bi-Weekly | 64 Every 4 Weeks
                 *** Move In/Out ALWAYS sends frequency_id=1 ***
  f_name, l_name, email, phone (digits only)

Pricing parameters — CATEGORY AND OPTION IDS DIFFER PER SERVICE. Send only the set for the
selected service; if a value doesn't map, OMIT that parameter (wrong-category IDs are worse
than none):

  STANDARD (service_id=6):
    pricing_parameter[1] bedrooms:   1→87, 2→81, 3→82, 4→83, 5→84, 6→85, 7→86
    pricing_parameter[2] full baths: 1→88, 2→9, 3→11, 4→13, 5→15, 6→17, 7→19
    pricing_parameter[8] half baths: 0→51, 1→8, 2→10, 3→12, 4→16
  MOVE IN/OUT (service_id=2):
    pricing_parameter[5] bedrooms:   1→74, 2→75, 3→76, 4→77, 5→78, 6→79, 7→80
    pricing_parameter[6] full baths: 1→39, 2→40, 3→41, 4→42, 5→43, 6→44 (NO 7 — omit if 7)
    pricing_parameter[7] half baths: 0→58, 1→45, 2→46, 3→47, 4→48
  BOTH — home type:
    pricing_parameter[9]: Two Storey House (Main + Upper Floor)→90, Two Story Townhouse
    (Duplex)→89, Bungalow (Single Story Home)→54, Basement Suite Only→56, Apartment or Condo→55
    (Known BK bug: category 9 sometimes ignores preselection — send it anyway.)

Example (3-bed, 2-bath, 1-half, bungalow, bi-weekly Standard):
https://dutycleaners.bookingkoala.com/booknow?industry_id=1&form_id=1&service_id=6&frequency_id=4&pricing_parameter%5B9%5D=54&pricing_parameter%5B1%5D=82&pricing_parameter%5B2%5D=9&pricing_parameter%5B8%5D=8&f_name=Jane&l_name=Doe&email=jane%40example.ca&phone=7805550142

Put the mapping tables in ONE module with a unit test per option, plus: Move In/Out forces
frequency_id=1; unmapped values omit the param; 7 full baths on Move In/Out omits the param;
URL-encoding covers emails with +, names with spaces/accents.

COPY UPDATES:
- "How it works" Step 3 returns to "Pick your time" (now literally true).
- Step 3 headline: "Your price — lock in your time."

TEST CHECKLIST (walk me through it live):
1. Standard / 3 bed / 2 bath / 1 half / bungalow / bi-weekly → BK opens with service, frequency,
   bedrooms, baths, half baths preselected (home type may not — known BK bug), and BK's
   before-tax price equals our displayed price exactly.
2. Move In/Out / 2 bed / 2 bath → BK opens as One-Time with categories 5/6/7 preselected.
3. Callback path still updates GHL and shows the request-received state.
4. Kill the network during the Step-3 GHL call → redirect still happens; quote_leads records the
   delivery failure.
5. No extras picker appears anywhere on the site funnel.
```

---

## Appendix C — Paste-ready Lovable prompt: seamless handoff, Tier 1 (2026-08-15)

```
ADDITION on top of the Step 3 booking handoff (the BookingKoala redirect you built): make the
hop to BookingKoala feel like one continuous funnel. Four changes, no changes to the URL
mappings or GHL logic.

1. BOOKING DOMAIN AS ONE CONFIG CONSTANT
   Put the booking origin in a single constant, e.g. BOOKING_ORIGIN =
   "https://dutycleaners.bookingkoala.com". We are connecting the custom domain
   book.dutycleaners.ca on the BookingKoala side; when it's live, switching this one constant
   moves every redirect and preconnect to the branded domain. Nothing else may hard-code the
   booking host.

2. PRECONNECT
   On the funnel pages, add to <head>:
     <link rel="preconnect" href="{BOOKING_ORIGIN}" crossorigin>
     <link rel="dns-prefetch" href="{BOOKING_ORIGIN}">
   Must read from the same constant.

3. BRANDED TRANSITION INTERSTITIAL
   When the primary CTA ("Choose my date & time →") is clicked:
   - INSTANTLY (before the GHL call) cover the viewport with a full-screen overlay in our navy,
     with the logo, a subtle spinner, and two lines:
       "Locking in your ${firstCleanPrice} quote…"
       "Taking you to secure booking"
   - The overlay stays up through the GHL upsert and the redirect (page unload kills it).
   - Safety fallback: if navigation hasn't happened after 5 seconds, show on the same overlay:
     "Taking longer than expected — continue to booking" as a plain <a> link with the exact same
     BookingKoala URL (so a blocked script can never strand the visitor).
   - Accessibility: overlay is aria-live="polite"; honor prefers-reduced-motion (static text, no
     spinner animation).

4. PROGRESS CONTINUITY ("of 4")
   - In-funnel progress indicators change from "Step X of 3" to "Step X of 4":
     1 About your home · 2 Your details · 3 Your price · 4 Pick your time
   - Step 4 is labeled in the progress UI but happens on the booking page. Under the primary CTA
     add: "Step 4 takes about a minute — pick your time, add your address, done."
   - Keep the marketing "how it works" section's three-beat story (Tell us about your home →
     See your price → Pick your time) — only the in-funnel progress bar changes.
   - The booking page's own header will say "Last step — pick your time & confirm" (configured on
     the BookingKoala side, not yours).

TEST CHECKLIST:
1. Preconnect tags present on funnel pages and pointing at BOOKING_ORIGIN.
2. Click the CTA with network throttled to Slow 3G → overlay appears instantly, text readable,
   redirect eventually fires; at 5s the manual continue link appears and works.
3. prefers-reduced-motion: no animated spinner.
4. Change BOOKING_ORIGIN to https://book.dutycleaners.ca in the one constant → every redirect
   URL and preconnect follows, prefill params intact.
5. Progress shows "of 4" on all three funnel steps; step 4 hint under the CTA.
```

---

## Do-NOT list (anti-patterns observed on the competitor — copy the pattern, never these bugs)
1. No unmoderated review syndication (they show review-selling spam on their homepage).
2. No fake or empty metrics — no "0.00" ratings, no placeholder counts, no numbers that disagree between sections (they show four different review totals on one page).
3. No programmatic thin pages ("Cleaner Not Found" 404s, a footer city labeled "Unknown").
4. Advertised step count must match reality (they say "3 simple steps"; their funnel is 7). If our flow is 3 steps, say 3; recount if it changes.
5. No claims the visible data contradicts (their "no curation, no editing" feed is visibly curated).
6. No heavy video hero / JS-only booking page that renders "Loading…" on slow connections.
7. Don't copy their pastel/serif brand, their marketplace machinery (cleaner login/provider agreements), or their scale language ("3,100+ suburbs").
8. Don't remove the phone path — it converts customers the form never will.

## Owner inputs required before launch (`TODO-OWNER` checklist)
- [ ] Approve the BK-snapshot approach and own the re-sync trigger: whenever you change BookingKoala pricing/settings, tell the builder (or run the capture script) so `bk-config.json` is regenerated
- [ ] New-customer offer amounts, and whether the offer bar runs permanently or per-campaign
- [ ] Insurer name and coverage amount; background-check provider name
- [ ] Confirm: no charge before service? cancellation window? no contracts?
- [ ] Real stats: total cleans since 2017, rebook %, Google ratings + counts for Edmonton and Calgary
- [ ] Team members willing to be featured (photos + written consent)
- [ ] Referral amounts
- [ ] Add the missing fields to the existing "Website Form" (`AwJDnvuYtkojIN3aOysC`): postal code, city, add-ons, first-clean price, recurring price, discount %, page URL (hidden is fine) — the form endpoint IS the integration (no Inbound Webhook on this account); IDs/field keys already captured in 1.5.2
- [ ] BookingKoala subdomain/booking-page URL (replaces `replace-with-your-bookingkoala-url.com`) and whether the BK plan includes API access
- [ ] Realistic response-time promise for the post-submit message ("we'll text you within X")
- [ ] Verbatim real Google reviews to replace the placeholder homepage reviews

## Acceptance checklist (what "done" means)
- [ ] The funnel shows a real dollar price from `bk-config.json` immediately after the contact step — on screen, no callback, no "we'll email your quote"
- [ ] A step-2 submission creates the GHL lead even if the visitor abandons at step 3; a step-3 confirm updates the same contact (merged by email) with the site-quoted price and extras
- [ ] Every service, home type, bedroom/bath label, extra, and frequency in the funnel exists verbatim in BookingKoala's live form, and every displayed price matches a live BK quote for the same selections (spot-check at least 3 combinations)
- [ ] Submitting the form creates a GHL contact with the quoted price attached — verified with a live test, not assumed (the submit handler currently sends nothing)
- [ ] A failed submit never shows a success message
- [ ] The hero contains a working Step 1 input with a progress indicator
- [ ] Recurring options show discounts and a pre-selected default; price panel shows first-clean vs ongoing
- [ ] Risk-reversal lines sit beside every submit button and on the BookingKoala handoff
- [ ] Every price and review number on the site reads from one data file
- [ ] "Since 2017" everywhere; no "10+ years" remains
- [ ] Floating buttons never overlap content at 1440×900 and 1920×1080
- [ ] /calgary and /pricing exist and are fully localized/consistent
- [ ] Lighthouse mobile performance ≥ 90 on the homepage

---

## Appendix D — Paste-ready Lovable prompt: Tier 2 embedded booking (2026-08-15)

```
UPGRADE: embed the BookingKoala booking form inside our site at /book, so the customer
never leaves dutycleaners.ca. The current Step-3 redirect (Tier 1) stays as the fallback
and instant rollback. Build everything now behind a flag; we enable it after the custom
domain goes live.

CONFIRMED FACTS (verified in the BK admin — do not re-derive, do not invent):
- BK's official embed snippet is:
    <iframe src="https://<BOOKING_ORIGIN>/booknow?embed=true"
            style="border:none;height:1000px" width="100%" ...></iframe>
    <script src="https://<BOOKING_ORIGIN>/resources/embed.js"></script>
- /resources/embed.js IS iframe-resizer v4.1.1 (the parent-side script). The embedded form
  runs the child side and posts its height — the iframe AUTO-SIZES to content. Do NOT write
  your own resize/height logic; just load their script.
- ?embed=true renders the form without BK's own header/footer chrome.
- The embed src is the same /booknow route we already redirect to, so our existing prefill
  params are appended alongside embed=true (verify in TEST 1).

HARD PREREQUISITE (owner does this; you just gate on it):
- Enable embed mode ONLY once BOOKING_ORIGIN = https://book.dutycleaners.ca (custom domain).
- Why: book.dutycleaners.ca is SAME-SITE with dutycleaners.ca, so the iframe's
  cookies/storage are exempt from Safari/Firefox third-party storage partitioning and
  Chrome's cookie protections. Embedding the bookingkoala.com origin would be a cross-site
  iframe: the form mostly works, but in-frame customer login and session persistence get
  flaky in Safari/Firefox. Same-site removes that entire risk class.

IMPLEMENT:
1. Config: add BOOKING_MODE: 'redirect' | 'embed' (default 'redirect'). Keep BOOKING_ORIGIN
   and the Tier-1 preconnect exactly as they are.
2. New route /book — a minimal shell, not a full site page:
   - Thin header: logo + "Call (780) 913-6565" (tel: link). No nav links (no escape hatches
     mid-checkout).
   - One line under it: "Step 4 of 4 — pick your time. Your details are carried over."
   - Centered container, max-width ~1100px, holding the embed. Minimal or no footer.
3. The embed (React specifics):
   - src = `${BOOKING_ORIGIN}/booknow?embed=true&` + EXACTLY the query string the Step-3
     redirect builder produces (service_id, frequency_id, pricing_parameter[...], f_name,
     l_name, email, phone). Reuse that builder — one source of truth, zero drift.
   - Mount the iframe once and keep it stable: stable key, never change src after mount
     (a src change reloads the form and wipes the customer's progress). Wrap in React.memo
     or equivalent so parent re-renders can't remount it.
   - Load `${BOOKING_ORIGIN}/resources/embed.js` once via useEffect AFTER the iframe is in
     the DOM (iframe-resizer initializes against existing iframes); guard against double
     insertion (check for an existing script tag by src).
   - iframe attributes: title="Complete your booking — Duty Cleaners";
     style={{border:'none', width:'100%', minHeight:'1000px'}} (min-height is the fallback
     if the resizer handshake ever fails); allow="payment" (wallet buttons inside the
     payment fields); referrerPolicy="strict-origin-when-cross-origin"; loading="eager".
   - DO NOT: add a sandbox attribute (breaks cookies + payment), lazy-load, attempt to
     inject CSS into the frame or read its DOM (cross-origin; the form's styling is already
     brand-matched on the BK side), or invent a postMessage protocol beyond what their
     embed.js does on its own.
4. Loading + failure UX:
   - Skeleton shimmer (~70vh, navy-tinted) until the iframe's onLoad fires, then fade the
     iframe in.
   - If onLoad hasn't fired by 8s: keep the skeleton but add "Taking too long? Open the
     secure booking page →" linking to the same URL without embed=true (new tab).
   - If the iframe errors/is blocked: automatically fall back to the Tier-1 full redirect.
     A customer must never hit a dead end on this page.
5. Step-3 CTA behavior in embed mode: client-side navigate to /book (instant — no
   interstitial needed; keep the interstitial only for redirect mode). The Step-3 GHL
   upsert fires exactly as it does today, before navigation.
6. Analytics: fire booking_page_view on /book mount and bk_embed_loaded on iframe onLoad.
   Do not try to track inside the iframe; booking-completion tracking arrives later via
   BK-side triggers (separate task).

TEST CHECKLIST (run each, report actual results):
1. Prefill passthrough: arrive from Step 3 → inside the embedded form, service, frequency,
   bedrooms, bathrooms, half baths, home type, name, email, phone are all pre-selected.
   If embed=true breaks prefill, STOP and report — we stay on redirect and investigate.
2. Auto-height: walk the whole form (extras open/closed, date-picker popup, payment
   section) → the page grows/shrinks with it, no inner scrollbar, calendar popup fully
   visible, nothing clipped.
3. Complete one REAL test booking end-to-end inside the embed (test card) → verify it
   appears in BK admin → tell the owner so they can delete it.
4. Existing-customer path: enter an email BK already knows → password prompt → login works
   INSIDE the frame. Test this in Safari specifically — it is the cookie canary.
5. Mobile: iOS Safari + Android Chrome — page scrolls as one document (no scroll trap),
   keyboard doesn't break layout, wallet button shows if the gateway offers it.
6. Browser back from /book returns to Step 3 with the quote still displayed.
7. Throttle to Slow 3G → skeleton, then the 8s fallback link appears and works.
8. Run tests 1–6 on the PRODUCTION domain. The lovable.app preview origin is cross-site
   with book.dutycleaners.ca, so cookie behavior in preview is NOT representative.

ROLLBACK: set BOOKING_MODE='redirect'. That is the entire rollback.
```

---

## Appendix E — Deep Cleaning funnel path, FINAL (2026-08-15; supersedes all prior deep-clean drafts)

**Discovery that changed the design:** BookingKoala's /booknow URL prefill natively accepts
`extras[<extraId>]=<quantity>` (and `excludes[...]`, `area_parameter[...]`) — found in their own
parser (`checkParamAvail`/`createParamObjFromUrl` in main.js) and verified live on this account:
`&extras%5B148%5D=1` lands with the **Deep Cleaning package pre-selected**, priced at the correct
home-size tier ($139.99 on the 3BR test), exempted from the recurring total (deep first clean,
Standard upkeep — matches the price model exactly), GST correct. **Deep Cleaning extra ID = 148.**
Maintenance rule: if that extra is ever deleted/recreated in BK the ID changes — same re-verify
trigger as the label→ID maps. The office GHL quote-vs-booking cross-check stays as backstop.

**Paste-ready Lovable prompt (delta on the consolidated deep-cleaning spec):**

```
UPDATE to the deep-cleaning spec — the handoff seam is now closed natively.
BookingKoala's URL prefill accepts extras[<id>]=<quantity>, verified live on our
account. The Deep Cleaning package's extra ID is 148.

1. URL builder: when intent=deep, append extras%5B148%5D=1 to the booking URL
   (redirect AND embed src — same builder, one change). Everything else in the
   URL stays identical.
2. Handoff copy flips from instruction to confirmation. Replace "tick 'Deep
   Cleaning' — it's the first item under Select Extras" with:
   "Your Deep Cleaning package is already added — just pick your time."
3. Keep unchanged from the consolidated spec: entry points with ?intent=deep,
   compact/confirmed banner states on the service step, Move In/Out "already
   includes deep cleaning" sub-label, Step-3 line-item quote (Standard $A +
   package $B = $TOTAL, + 5% GST), recurring "then $C/visit" line, the
   Bi-Weekly gateway line, GHL deep-intent tag at Step 2 and package +
   deep total in the Step-3 upsert.
4. Config: put the extra ID in one named constant (DEEP_CLEANING_EXTRA_ID=148)
   next to the other BK ID maps.
5. Tests: (a) intent=deep entry → booking page loads with Deep Cleaning ticked
   and the summary showing the package at the right tier for the chosen home
   size; (b) recurring frequency → recurring total EXCLUDES the package;
   (c) no flag → no extras param in the URL, nothing pre-selected; (d) once
   embed mode ships, verify embed=true + extras[148]=1 together on production.
```

**Also unlocked (parked, owner's call later):** since extras are URL-prefillable after all,
other high-attach add-ons (Inside Oven 149?, Inside Fridge, etc. — IDs TBD from admin) could be
offered as one-tap chips on Step 3 and carried over the same way. Deliberately not doing this
now — the short-funnel decision stands; revisit only with data.

---

## Appendix F — CORRECTION to Appendix E: Deep Cleaning is 7 extras, not 1 (2026-08-15)

**Appendix E said "Deep Cleaning extra ID = 148". That was wrong and caused the failed live test.**
BK tiered extras are not one extra with a size-resolved price — **each size tier is its own extra
with its own ID**, gated by a `variables` array containing the bedroom option IDs it applies to.
Send an ID whose tier doesn't match the chosen bedrooms and BK **silently drops it** (every other
prefill param still applies, so it looks like the extras param "doesn't work").

Verified live (2-bed → tile is `extras-147`; 3-bed → `extras-148`; 6-bed → `extras-151`):

| Bedrooms | Bedroom option ID | Deep Cleaning extra ID | Package price |
|---|---|---|---|
| 1 | 87 | **146** | $99.99 |
| 2 | 81 | **147** | $119.99 |
| 3 | 82 | **148** | $139.99 |
| 4 | 83 | **149** | $159.99 |
| 5 | 84 | **150** | $179.99 |
| 6 | 85 | **152** | $199.99 |
| 7 | 86 | **151** | $219.99 |

**[UPDATED 2026-08-15 — the BK gating bug below was FIXED in admin with owner approval; the table
above already reflects the corrected mapping. Use it as-is.]** Previously extra **152 ($199.99) was
orphaned** — its `variables` list contains no bedroom ID, so it can
never appear on the form. Consequence: **a 6-bedroom deep clean really costs $219.99.** Any site
tier list that assigns $199.99 to 6 bedrooms (e.g. reading bk-config's flat 7-price list in order)
under-quotes by $20. Always derive tier→price from each extra's own `variables`, never by sort
order. Owner may want to fix the 151/152 gating in BK admin so the $199.99 tier is reachable.

**Paste-ready Lovable prompt:**

```
BUG: deep-clean prefill silently fails for every home size except 3 bedrooms.

Cause: my earlier spec was wrong. DEEP_CLEANING_EXTRA_ID=148 is not a single
constant — BookingKoala models each size tier as a SEPARATE extra with its own
ID. 148 is only the 3-bedroom tier. For any other bedroom count BK receives an
extra ID that isn't valid for that home size and silently ignores it, which is
exactly why the booking page showed nothing ticked (the rest of the prefill
still applied, so it looked like extras[] was unsupported — it isn't).

FIX: replace the constant with a bedrooms → extra ID map:
  1 bed -> 146   ($99.99)
  2 bed -> 147   ($119.99)
  3 bed -> 148   ($139.99)
  4 bed -> 149   ($159.99)
  5 bed -> 150   ($179.99)
  6 bed -> 151   ($219.99)
  7 bed -> 151   ($219.99)
Build the booking URL with extras[<mapped id>]=1 using the customer's selected
bedroom count. Keep everything else exactly as shipped — the URL construction,
encoding (extras%5B..%5D=1), and copy are all already correct; only the ID
lookup changes.

ALSO FIX (pricing accuracy): the Deep Cleaning package price shown on Step 3
must come from the SAME map, not from a positional read of the tier price list.
BK has a 7th Deep Cleaning entry priced $199.99 that is unreachable (it's gated
to no bedroom size), so a naive "6th price in the sorted list" lookup quotes
$199.99 for a 6-bedroom home when BookingKoala will actually charge $219.99.
Verify: a 6-bedroom deep quote must read $219.99, and a 7-bedroom must also
read $219.99.

TEST (do all seven, this is the exact class of bug that hid before):
For each bedroom count 1-7, run a deep-intent quote and confirm on the real
booking page that (a) the Deep Cleaning tile is TICKED, and (b) the package
price in BK's summary equals the package price Step 3 quoted. A tier is only
"passing" if both match.
```

---

## Appendix G — Go-live day: BK Header-Code auto-scroll script (HELD until Lovable site goes live)

**Decision (2026-08-19):** approved in principle, deliberately NOT installed yet. Install
when the Lovable site becomes the live site. Read-only scroll script — no field writes,
no PCI exposure; worst case it does nothing.

**What it does:** when a visitor arrives at /booknow with funnel prefill params, the BK
page auto-scrolls to the first section still needing input (first visible dropdown whose
selected option is "Select Option"). Keyed to option TEXT, not CSS classes, so BK DOM
updates rarely break it. Also benefits old-site bridge arrivals (same params).

**Install location:** BK Admin → Theme Builder → toolbar "Settings" ("Entire website
settings") → Tracking & Conversion tab → **Header code** → Save → **Save & Publish**.
(Field verified to exist, currently empty.)

```html
<script>
(function () {
  setTimeout(function () {
    try {
      var q = new URLSearchParams(location.search);
      if (!q.has('f_name') && !q.has('service_id')) return;  // funnel arrivals only
      var tries = 0;
      var timer = setInterval(function () {
        tries++;
        var pending = Array.prototype.slice.call(document.querySelectorAll('select'))
          .filter(function (s) {
            var o = s.options[s.selectedIndex];
            return o && /^\s*Select Option\s*$/i.test(o.text) && s.offsetParent;
          });
        if (pending.length) {
          clearInterval(timer);
          pending[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (tries > 40) { clearInterval(timer); }   // ~10s, give up silently
      }, 250);
    } catch (e) { /* never break the form */ }
  }, 1500);
})();
</script>
```

**Verify after install:** load /booknow with full prefill in a fresh browser → page
settles then scrolls to "How do we enter the home?"; load /booknow bare → no scroll;
complete a normal booking to confirm no interference.

**Embed-mode caveat:** once the funnel switches to embed (iframe-resizer full-height),
there is no internal scrollbar — scrollIntoView inside the child does nothing useful.
At embed flip, rework using iframe-resizer's parentIFrame scroll API or postMessage to
the parent. Until then (redirect mode) the plain script is correct.

**Same-day items:** BK "Change My Domain" → book.dutycleaners.ca + CNAME; flip
BOOKING_ORIGIN in Lovable; revalidation pass (7-size deep matrix, shelf parity, contact
prefill, live test booking); check old site's signup/login links still resolve; BK-side
basement/condo extras gating fix + Lovable config re-capture if not already done.
