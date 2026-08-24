# GHL Lead Delivery — Revised Architecture Brief (for Lovable)

**Date:** 2026-08-15 · **Status:** replaces the "disable captcha on the form" plan
**Applies to:** the Duty Cleaners instant-quote funnel (Step 2 lead capture, Step 3 confirm)

---

## 1. What happened, and why we're changing approach

Step 2's relay posted to the GHL form endpoint for form `AwJDnvuYtkojIN3aOysC` and got:

```
429 {"message":"No tokens provided","errorCodes":["missing-input-response"]}
```

That endpoint now enforces **Cloudflare Turnstile**, and the form's Turnstile sitekey is
domain-locked to GHL's own domains (rendering it on dutycleaners.ca fails with error 600010).
So no valid token can ever be produced from our site. The previously proposed fix was to disable
the captcha on that one form.

**We are NOT doing that.** Research into current HighLevel capabilities shows a strictly better,
officially supported path that the existing relay can use directly:

## 2. The decision: GHL API v2 `contacts/upsert` with a Private Integration token

Instead of impersonating a form submission, the relay calls HighLevel's documented v2 API and
upserts the contact directly.

Why this beats captcha-off:

1. **No security downgrade.** The form keeps its captcha; we never open an unauthenticated
   endpoint to the internet. (Open GHL form endpoints are actively targeted by spam bots, and
   junk leads can fire paid SMS automations.)
2. **Documented, versioned contract.** `POST /contacts/upsert` is a public, stable API
   (docs: marketplace.gohighlevel.com). The form endpoint is undocumented internals — today's
   Turnstile enforcement is exactly the kind of silent change that path is exposed to.
3. **Upsert semantics match our funnel perfectly.** Step 2 creates the contact; Step 3 updates
   the same contact (matched by email/phone per the location's duplicate settings) with the
   quoted price and extras. No fragile "GHL will merge it" assumption — it's the API's defined
   behavior.
4. **Tags, source, and custom fields are first-class** — no reverse-engineering form field IDs.
5. **Auth is a static Bearer token** (Private Integration) stored server-side in the relay —
   no OAuth dance, no refresh tokens. HighLevel recommends 90-day rotation with a 7-day overlap.

The `quote_leads` backup table and "row first, then deliver, then record outcome" flow from the
previous plan **stay exactly as designed** — that part was right.

---

## 3. Owner setup (one-time, ~5 minutes — NOT Lovable's job)

1. In the GHL sub-account (crm.bookin60.com, Duty Cleaners, location `4OROmtMn8LQqaDsUJPjC`):
   **Settings → Private Integrations** (if not visible, enable it under Settings → Labs, or ask
   the agency to grant the permission under Team → Roles & Permissions).
2. **Create new Integration**, name it `dutycleaners.ca website funnel`, and select ONLY these
   scopes: **View Contacts, Edit Contacts** (contacts.write includes create/update), and
   **View Custom Fields** (locations/customFields.readonly) so the relay can map field IDs.
3. Copy the token immediately (it cannot be viewed again) and give it to Lovable **as a backend
   secret** (e.g. `GHL_PI_TOKEN`). It must never appear in client-side code, git, or the browser.
4. Create the contact **custom fields** if not already present (Settings → Custom Fields):
   service, home type, bedrooms, full bathrooms, half baths, frequency, city, selected extras,
   first-clean price, recurring price, page URL. (Some already exist from the Website Form —
   reuse those, don't duplicate.)
5. **Workflow changes:** the old trigger was "Form Submitted". Replace with:
   - Main lead workflow → trigger **Contact Tag Added = `instant-quote`** (fires when the relay
     tags a new lead). Keep all existing actions (office notification, customer SMS/email,
     pipeline opportunity, BookingKoala step).
   - Optional second workflow → trigger **Contact Tag Added = `quote-confirmed`** for Step 3
     confirms, if a distinct follow-up for "saw price and confirmed" is wanted.
   - Note: a returning visitor who requests a second quote updates fields but adds no new tag,
     so no duplicate workflow runs — that's the desired behavior. If per-request notifications
     are ever wanted, add a workflow on the "Contact Field Update" trigger watching the
     first-clean-price field.

If Private Integrations turns out to be unavailable on this account (agency restriction), fall
back to the previous plan (captcha off on the one form + honeypot + min-fill-time + rate limit +
GHL-side workflow guard on plausible phone/email). That is Plan B, not the default.

---

## 4. Relay implementation spec (Lovable)

### 4.1 Keep the existing flow shape

```
browser → relay:
  1. validate + honeypot + min-fill-time + per-browser rate limit  (keep all of this)
  2. INSERT row into quote_leads (status: pending)
  3. call GHL API (below)
  4. UPDATE row with delivery outcome
  5. return the REAL outcome to the browser
     — Step 3 opens only on genuine success
     — on failure the funnel shows the phone fallback, never a fake success
```

### 4.2 One-time field-ID mapping (startup or cached config)

Contact custom-field IDs are location-scoped and are NOT the same as the old form's field IDs.
Fetch them once and cache:

```
GET https://services.leadconnectorhq.com/locations/4OROmtMn8LQqaDsUJPjC/customFields
Headers:
  Authorization: Bearer {GHL_PI_TOKEN}
  Version: 2021-07-28
```

Map by field key → id. **All fields exist as of 2026-08-16** (the four site-quote fields were
created in the General Info folder on this date):

| Purpose | Field key |
|---|---|
| Service | `contact.what_type_of_service_would_you_like` |
| Home type | `contact.what_type_of_home_do_you_have` |
| Bedrooms | `contact.bedrooms_in_total` |
| Full bathrooms | `contact.bathrooms` |
| Half baths | `contact.half_baths` |
| Frequency | `contact.frequency_in_bookings` |
| First-clean price (site quote) | `contact.site_quoted_first_clean_price` |
| Recurring price (site quote) | `contact.site_quoted_recurring_price` |
| Selected extras | `contact.selected_extras` |
| Page URL | `contact.quote_page_url` |

(City rides on the tags `edmonton`/`calgary` — no custom field needed. Ignore the older duplicate
fields CHOOSE YOUR SERVICE / Bedrooms / FREQUENCY / Frequency of Service — legacy data lives there;
do not delete, do not use.) Fail loudly at startup if any mapped key is missing.

### 4.3 Step 2 — create the lead

```
POST https://services.leadconnectorhq.com/contacts/upsert
Headers:
  Authorization: Bearer {GHL_PI_TOKEN}
  Version: 2021-07-28
  Content-Type: application/json

{
  "locationId": "4OROmtMn8LQqaDsUJPjC",
  "name": "<full name as typed>",
  "firstName": "<first token>",
  "lastName": "<rest>",
  "email": "<email>",
  "phone": "<E.164, e.g. +17805551234>",
  "source": "dutycleaners.ca instant quote",
  "tags": ["instant-quote", "<edmonton|calgary>"],
  "customFields": [
    { "id": "<service field id>",        "field_value": "Standard Cleaning" },
    { "id": "<home type field id>",      "field_value": "Two Storey House (Main + Upper Floor)" },
    { "id": "<bedrooms field id>",       "field_value": "3 Bedrooms (Under 1700sqft)" },
    { "id": "<full baths field id>",     "field_value": "2 Full Bath(s)" },
    { "id": "<half baths field id>",     "field_value": "1 Half Bath (With Only A Toilet or Sink)" },
    { "id": "<frequency field id>",      "field_value": "Bi-Weekly (Every 2 Weeks)" },
    { "id": "<city field id>",           "field_value": "Edmonton" },
    { "id": "<page url field id>",       "field_value": "<page URL + UTM params>" }
  ]
}
```

Rules:
- **Values use BookingKoala's exact labels** (from bk-config.md) so CRM, site, and BK all match.
- Normalize phone to E.164 (+1...) before sending; reject obviously invalid phones client-side.
- Success = HTTP 200/201 with a contact id in the response. Anything else = failure path.
- Timeout 10s; one retry on network error or 5xx; never retry 4xx.
- Rate limits are 100 requests / 10 s per location — irrelevant at lead volume, no special handling.

### 4.4 Step 3 — confirm with price + extras

Same `contacts/upsert` call with the same email/phone (GHL matches the existing contact per the
location's duplicate-detection settings), adding:

```
  "tags": ["instant-quote", "<city>", "quote-confirmed"],
  "customFields": [
    ...same as step 2...,
    { "id": "<selected extras field id>",    "field_value": "Deep Cleaning; Inside Oven" },
    { "id": "<first clean price field id>",  "field_value": "251.29" },
    { "id": "<recurring price field id>",    "field_value": "213.60" }
  ]
}
```

Prices are the **site-quoted** numbers (a CRM snapshot of what the customer saw) — BookingKoala
remains the source of the true final price at booking time.

### 4.5 Secrets & rotation

- `GHL_PI_TOKEN` lives only in backend secrets. If it leaks, the owner rotates it in
  Settings → Private Integrations ("rotate and expire now"); the relay just gets a new secret value.
- Log delivery failures with the GHL response body into `quote_leads` — those rows are the
  recovery queue if anything breaks.

---

## 5. Test checklist (run before calling it done)

- [ ] Startup field-mapping fetch succeeds and finds every required custom field
- [ ] Step 2 test submit → contact appears in GHL with tags `instant-quote` + city and all home-detail fields populated
- [ ] Main workflow fires (office notification + customer message) from the Tag Added trigger
- [ ] Step 3 confirm → same contact (no duplicate) now has extras + both prices, tag `quote-confirmed`
- [ ] Repeat Step 2 with the same email → contact is updated, not duplicated
- [ ] Kill the token (temporarily use a wrong one) → funnel shows the phone fallback, `quote_leads` row records the failure, no fake success
- [ ] Restore token, delete all test contacts and test rows
- [ ] Confirm the GHL form's captcha is still ON (we changed nothing about the form)
