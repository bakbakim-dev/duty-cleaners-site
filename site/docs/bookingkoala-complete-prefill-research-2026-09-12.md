# Duty Cleaners BookingKoala Prefill Feasibility

## Conclusion

Duty Cleaners can plausibly eliminate repeated entry of the ordinary booking information already collected in its custom sales funnel. The strongest near-term design combines BookingKoala's documented selection parameters with a small, merchant-installed script inside the BookingKoala booking page. That script would receive the remaining answers, apply them to the native form, verify acceptance, and guide the customer to unfinished sections. This is a feasible engineering approach, not an end-to-end integration already proven in this account.

The target experience is: property details → required name, email and phone → price and extras → remaining service details → BookingKoala's live calendar, secure payment and final confirmation. The existing contact-before-price requirement can remain unchanged. A branded embedded completion stage is an optional subsequent improvement; the initial redirected checkout can use the same data-transfer approach.

The boundary is important. Previously supplied answers can be transferred; an unasked question cannot be answered accurately by automation. A calendar preference is not a reserved slot. Card details, any authentication challenge, and the final booking decision should remain in BookingKoala's payment and confirmation experience.

Evidence is current to September 12, 2026. The public booking page and local source were inspected, including a non-contact prefill test. No customer was created, no booking was submitted, no payment was entered, and no account settings were changed. Live record persistence and payment completion remain untested.

## Current capabilities and developments

### Documented field preselection

BookingKoala documents URL parameters for contact details, industry/form/location, service, frequency, postal code, pricing variables, extras, coupon, minutes and date. Its published complete list does not include street address, apartment, arbitrary custom questions, arrival-window selection or payment credentials. The article was last updated March 13, 2023 and remains accessible as current official documentation; its age makes account-level verification important. [BookingKoala: Query parameters and preselected fields](https://help.bookingkoala.com/help/pre-select-fields-on-the-booking-form).

### Integration actions are more capable than older descriptions suggest

The statement that BookingKoala has only Zapier triggers is outdated. BookingKoala's own February 18, 2025 instructions describe a **Create Lead** action, and the current Zapier listing exposes it with contact and address fields. This can place prospects in BookingKoala's leads module. It is not evidence of a booking, saved quote, authenticated customer checkout or availability reservation. [BookingKoala: Zapier in the leads module](https://help.bookingkoala.com/help/setting-up-zapier-in-the-leads-module); [Zapier: BookingKoala integration](https://zapier.com/apps/bookingkoala/integrations).

The more interesting lead is Make. Its current BookingKoala listing identifies the app as maintained by BookingKoala LLC and exposes two actions: **Create Lead** and **Make an API Call**. The generic call may provide a vendor-supported route to additional operations, but the listing does not document an availability endpoint or quote/booking creation endpoint. A module's existence does not establish what its credential can do. This is the first question to resolve with BookingKoala before investing in a more extensive custom integration. [Make: BookingKoala modules](https://www.make.com/en/integrations/bookingkoala).

BookingKoala's official Make setup guide describes enabling the integration and generating its dedicated key. No key was generated or inspected for this assessment. Make's separate application-documentation page labels its explanatory text AI-generated and potentially mistaken, so it should not be treated as proof of additional endpoint capabilities. [BookingKoala: Make integration guide](https://help.bookingkoala.com/help/make-integromat-integration-guide); [Make application documentation](https://apps.make.com/bookingkoala).

No released, general-purpose public booking/availability API documentation was found. The search-indexed official feedback board still lists Open API as Gathering Feedback; the dynamically rendered board did not consistently expose the same entries. This is insufficient to rule out private, partner or account-specific access. The precise conclusion is **public availability and booking-write capabilities remain unverified**, not that BookingKoala has no APIs of any kind. [BookingKoala feedback board](https://feedback.bookingkoala.com/contribute/).

### Native quotes and completion links

BookingKoala supports staff-created saved quotes and shareable quote links, including expiry and configurable customer editing. Its May 2024 release notes describe retaining saved date and address information in draft forms. A supported way to create such a quote from the custom funnel and return its completion link could be cleaner than browser-field adaptation. The missing piece is a documented, authorized automated quote-creation operation; Create Lead alone does not establish one. [BookingKoala: Send a quote](https://help.bookingkoala.com/help/send-a-quote); [BookingKoala: May 2024 release notes](https://feedback.bookingkoala.com/changelog/feature-release-update-may-2024-1034).

### Embedded forms and merchant-installed scripts

BookingKoala officially supports embedding its forms on an existing website. Its tracking documentation also provides a Header Code installation area and explains that code for embedded forms must be installed on the BookingKoala pages. Together, these provide a credible installation path for a cooperating script inside the booking document. They do not constitute a supported custom-field JavaScript SDK or a guarantee that every arbitrary script, external request or DOM adaptation is supported. [BookingKoala: Embed forms](https://help.bookingkoala.com/help/embed-the-forms-on-your-existing-website); [BookingKoala: Header code installation](https://help.bookingkoala.com/help/google-adwords).

## Field-by-field assessment

The table distinguishes documented capabilities, observed behavior and proposed work. “Candidate” means an implementation must still be validated against BookingKoala's form state and saved record.

| Information | Current funnel/handoff | Recommended treatment |
|---|---|---|
| First and last name, email, phone | Sent through documented contact parameters; full name is split in code | Preserve the gate. Verify names and phone masks, including returning customers. Do not manufacture a missing surname. Prefer secure transport for personal data once the companion script works. |
| Service, frequency, home type, bedrooms, bathrooms, half baths | Native parameter mapping exists; a representative public test visibly accepted these | Retain the mappings and test all offered combinations and edits. |
| Deep clean and other extras, including quantities | Existing code resolves configuration-specific extra IDs | Retain dependency-aware mapping. Confirm selected quantities, price, duration and recalculation in live test records. |
| Postal code | Code emits only `dc_zip`; public test with both `zipcode` and `dc_zip` left the address field blank | Add the documented parameter in the account-verified Canadian format; retain a verified companion-script path for the address field. Do not assume this change alone resolves it. |
| Street address, unit, city, province | Not collected by the funnel. The header script has receiver mappings, but no sender fields | Collect once after price if the goal is to finish all ordinary details before handoff; otherwise collect once in BookingKoala. Never infer a service address from a phone number or postal code. |
| Entry method | Collected and emitted as `dc_entry`; custom value was not applied in the public test | Companion-script candidate, after correcting the lockbox/mailbox mismatch. |
| Home condition | Funnel asks cleaning recency; BookingKoala asks a condition rating | Correct the meaning before transfer. Collect actual condition; treat recency as separate optional information. |
| Parking | Collected and emitted as `dc_park`; not applied in the public test | Companion-script candidate with an exact option mapping and saved-record verification. |
| Date/time flexibility | Present on BookingKoala; absent from funnel schema and script | Collect it once or leave it beside the live calendar. Do not assume the customer is flexible. Mandatory status still needs account validation. |
| Special notes and access instructions | Collected; transferred in `dc_notes`; receiver searches for the notes textarea | Secure transfer, length validation and round-trip verification. Avoid duplicating appended notes or placing access codes in URLs. |
| Date and arrival window | Chosen on BookingKoala | Keep native live selection. A transferred preference must be revalidated; it cannot reserve a crew. |
| Waiting-list choice | Visible on BookingKoala | Keep a deliberate customer choice. Do not silently substitute a waiting-list request for a booking. |
| Coupon and gift card | Coupon transfer exists; no equivalent documented gift-card parameter was established | Verify native coupon application. Keep gift-card redemption native unless a supported integration is confirmed. |
| Card details, authentication, stored payment method | Native Stripe UI inside BookingKoala | Do not collect raw cards in the custom funnel or forward them through a prefill script. Preserve native payment and eligible autofill. |
| Terms, marketing preferences, final submission | BookingKoala displays its own disclosure and final booking button | Present the applicable terms clearly. Do not silently assume new consent or click final submission. Review native wording against the funnel's promises. |

Native parameter support in this table comes from the preselection documentation; all Duty Cleaners implementation and public-form findings come from the local files and observations recorded below. [BookingKoala: Preselection reference](https://help.bookingkoala.com/help/pre-select-fields-on-the-booking-form).

## Confirmed gaps in Duty Cleaners

### Semantic mismatches

`QuoteFlow.tsx` labels the `mailbox` value “Key in a lockbox.” The receiver in `bk-header-fill.html` maps that value to BookingKoala's “Key will be in the mailbox” option. A lockbox and mailbox are different entry instructions. Merely activating the script would transmit an incorrect answer.

The funnel also labels `cleanliness=5` “Never professionally,” while the receiver maps it to “Very Dirty.” A customer who has never hired a professional cleaner may still have a clean home. Likewise, “Within 2 weeks” is not necessarily “Almost Spotless.” The current deep-clean recommendation also uses this numeric value, so correcting it must cover both the handoff and the recommendation logic.

Recommended correction: use a genuinely equivalent condition question with clear labels. Retain “When was it last cleaned?” only as a separate answer if operationally useful. For entry, use a distinct `lockbox` value and an equivalent BookingKoala option; if an option cannot be added, map to “Other” with explicit lockbox instructions only after validating that approach. Do not preserve a misleading legacy enum merely to avoid changing tests.

### Missing and unverified mappings

`CleanerDetails` contains entry, cleanliness, parking, notes and postal code. It lacks a complete address and flexibility. Although the header script accepts `dc_addr`, `dc_apt`, `dc_city` and `dc_prov`, the current URL builder never supplies them. Its existence therefore does not mean those fields are transferred.

The public test left entry, cleanliness and parking unselected. This is consistent with the repository's deployment note that the header script has not been published, but the observation alone does not establish whether the script is absent, blocked or failing. Publishing the current file without its semantic corrections would not be an acceptable fix.

### A visible filled value is not sufficient proof

The script polls for visible controls for up to 30 seconds, sets values, dispatches events and marks the elements with `data-dc-filled`. It stops when it believes it has finished. It does not demonstrate that BookingKoala's application state accepted every change or that the final booking stores it.

A later-mounted step, rerendered control or dependent selection can fall outside that mechanism. It can also overwrite a dropdown selection made by the customer before its first fill. Exceptions stop the entire polling loop without an actionable customer message. It needs a lifecycle-aware, customer-edit-aware adapter with explicit acknowledgement and recoverable failure behavior.

The existing iframe message listener only establishes that a message came from the booking origin. It does not verify the sending frame, message schema or accepted field set. Height-resizer traffic is not proof of data acceptance. Redirect mode remains the configured launch mode.

## Recommended architecture

### 1. Preserve the funnel and capture only genuinely missing answers

Keep name, email and phone required before the complete price-and-extras screen. Keep the current online-bookable service restrictions; this project only maps Standard and Move In/Out to the home-cleaning checkout. Quote-only services should not be pushed into another industry without a separate verified scope and mapping.

After price, collect the service address and accurately worded cleaner details if the business wants all ordinary details finished before handoff. Ask flexibility with the calendar if that makes the choice easier to understand. Every newly added question increases work before availability, so the success criterion should be “answer once,” not “move every possible question earlier.”

### 2. Transfer data to a cooperating script inside BookingKoala

For a redirect, a recommended design is an opaque, high-entropy, short-lived handoff ticket. The funnel sends the approved handoff data to a controlled backend. The BookingKoala-side script redeems the ticket over HTTPS and receives only the fields necessary for this booking. Whether BookingKoala's page policy allows this request must be tested. This is a proposed backend, not a claim that the existing quote receipt endpoint provides it.

For an embed, the parent and companion script can exchange a versioned payload with `postMessage`. Both sides must validate the exact allowed origin, the expected sending window and payload schema. Use a ready/transfer/acknowledgement sequence and bounded retry; never treat arbitrary BookingKoala messages as acceptance. Browser messaging is supported across origins when both documents cooperate. [MDN: Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage).

An own-domain booking subdomain can improve branding and potentially session behavior. It does not make `www.dutycleaners.ca` and `book.dutycleaners.ca` the same origin. Parent JavaScript still cannot directly reach inside the booking frame, and moving the React frontend to SiteGround does not change that. A cooperating script remains necessary. [MDN: Same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy).

### 3. Fill in dependency order and verify the result

Use documented parameters where reliable. The companion script fills remaining supported native controls after they exist. Apply service and property dimensions before dependent extras; wait for recalculation before treating price, duration or availability as current. The field adapter should use explicit mappings and observed identifiers rather than broad position-based selectors.

Each field should have a result such as applied, already matching, customer edited, missing control or rejected value. Read back the visible state and compare the native booking summary. In a controlled test, also verify the saved booking record: a DOM readback is necessary but not a substitute for persistence testing. Preserve customer edits and selected saved addresses, especially for returning logged-in customers.

Do not scrape a calendar into a separate custom availability database. BookingKoala's availability can depend on service and provider configuration, so duplicating the displayed dates would introduce freshness and validation risks. [BookingKoala: Scheduling settings](https://help.bookingkoala.com/help/setting-up-your-store-options-scheduling-tab).

### 4. Make the remaining work obvious

After verified transfer, show an editable summary of completed details and focus the next unfinished section. Collapse completed sections only where validation and error recovery remain accessible. An error must reopen the relevant field; no required field should become an invisible blocker. Never auto-select a slot, waiting-list status or agreement.

If the custom script fails, BookingKoala's ordinary form must remain usable. Show a clear partial-transfer message rather than an unconditional promise that everything carried over. An embedded version also needs a same-tab/full-page fallback that preserves the customer's submitted details without creating a second booking session behind the scenes.

### 5. Keep payment native

The inspected Duty Cleaners checkout contains Stripe card fields and an “Autofill with Link” button. Stripe documents that Link can reuse stored payment details after any required customer authentication. This already provides a legitimate opportunity to reduce card entry for eligible visitors, although it is not available in every browser or layout. No payment or Link authentication was attempted. [Stripe: Link in the Card Element](https://docs.stripe.com/payments/link/card-element-link).

A custom Stripe form would require a supported way to attach its resulting payment method to BookingKoala's customer and booking lifecycle. Possessing a payment token alone does not establish compatibility. Do not assume a separate checkout could preserve BookingKoala's temporary hold, later charge, refunds and recurring payment behavior. Any wallet or newer Stripe component upgrade inside the native checkout is a BookingKoala integration question.

## Alternatives and tradeoffs

| Route | Potential benefit | Limitation / decision |
|---|---|---|
| Official prefill plus BookingKoala-side companion | Keeps the custom funnel; can reach remaining ordinary fields | Recommended bounded prototype. Custom adapter is maintenance-sensitive until vendor-supported hooks are confirmed. |
| Supported automated quote creation plus native completion link | Native saved state could remove much DOM adaptation | Prefer if BookingKoala confirms quote-write access, custom-field support and completion behavior. Not established by public documentation. |
| Make generic API action | A real vendor-maintained integration entry point | Investigate its allowed endpoints. Do not equate generic HTTP capability with availability or booking-write access. |
| Zapier/Make Create Lead | Useful for staff follow-up or a BK leads pipeline | Does not by itself continue a customer checkout. Avoid duplicate GHL/BK follow-up messages. |
| Native BK form styled/reordered as the whole funnel | One form state and native validation throughout | Strong fallback; may reduce design freedom. Confirm contact gating and section requirements before replacing the current experience. |
| Browser address/contact autofill | Reduces typing without a booking API | Depends on each customer's browser and stored information; not deterministic transfer from the funnel. |
| Customer-side AI/agent autofill | Could assist some individuals with navigating ordinary controls | Cannot be assumed available for every visitor; adds nondeterminism to a fixed field-mapping problem. No verified BK checkout agent endpoint was found. |
| Staff-side browser automation for draft quotes | Could support an assisted sales operation | Separate operational workflow with credentials, retries, duplicate prevention and human checks. Not the recommended live checkout dependency. |
| Private endpoint recreation, reverse proxy, copied booking application | Could imitate a native request in a technical experiment | Unsupported authentication, validation, payment and upgrade assumptions. Do not make this the production sales path without vendor cooperation. |

BookingKoala documents single-, two- and multi-step layouts and section reordering; its multi-step guide states that layout requires Premium. Account entitlement was not checked. Layout customization provides a fallback, but changing pricing dependencies merely to move sections can change behavior and needs its own test. [BookingKoala: Form layouts](https://help.bookingkoala.com/help/how-to-set-up-the-single-step-two-step-or-multi-step-form-for-customers); [BookingKoala: Rearrange sections](https://help.bookingkoala.com/help/rearrange-sections-on-my-booking-form).

Standard `autocomplete` attributes can help browsers identify address and contact fields. They are useful supplementary UX, not a mechanism that lets one unrelated origin retrieve another origin's stored answers. [MDN: autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete).

## Privacy and operational safeguards

The current builder places contact information and free-text notes into URLs. Adding a full address and door code would increase the exposure. HTTPS does not prevent query strings from appearing in browser history, request logs or monitoring systems; analytics redaction on the main site alone is not complete protection. [OWASP: Information exposure through query strings](https://community.owasp.org/vulnerabilities/Information_exposure_through_query_strings_in_url).

The proposed ticket should have a limited lifetime, minimal payload and narrowly scoped redemption. CORS is not authorization: an exact-origin allowlist must be paired with an unguessable capability and server-side validation. Use no-store responses, rate limits, bounded retry, redacted logs and a designed refresh/back-navigation flow. A ticket in a fragment avoids transmission of that fragment in the initial HTTP request, but scripts on the page can still read it; it is not inherently private from all third parties.

Do not include payment credentials, secret API keys or account authentication in the handoff. Avoid retaining access codes longer than operationally necessary. An iframe payload should be sent only to the expected booking frame, and acknowledgement telemetry should contain status and field names rather than names, addresses or notes.

The live booking disclosure includes marketing authorization language broader than simply arranging a clean. This should be reviewed for consistency with the custom funnel's stated purpose before automated transfer is activated. The report does not determine legal compliance or authorize a consent-setting change.

## Implementation sequence and acceptance criteria

1. **Correct the data contract.** Separate condition from cleaning recency; correct lockbox handling; add explicit flexibility and address fields where they will be collected. Ensure UI labels, enum values, notes and BK options have identical meanings.
2. **Resolve the vendor integration question.** Request documented Make/API capabilities for quote creation and availability, plus stable custom-field hooks. Choose a supported quote-link route if it genuinely covers this account.
3. **Build a bounded companion proof of concept.** In an isolated, owner-approved test environment, prove one contact/address pair and the four custom dropdowns can populate, survive recalculation and be saved correctly. Do not publish the existing header script unchanged.
4. **Implement secure transport and verification.** Use the redirect ticket first to preserve the configured launch path. Add explicit per-field status, customer-edit precedence, price reconciliation and a recoverable partial-transfer view.
5. **Validate full service combinations.** Test Standard, Deep-as-an-extra, Move In/Out, each offered frequency, home types, room-count extremes, quantity extras, pets and travel fees. Test Edmonton, Calgary, Red Deer and surrounding-area addresses. Never silently omit an unsupported selection.
6. **Validate customer states.** New customer, existing email, logged-in customer, saved address, surname edge cases, phone formatting, invalid/out-of-area postal code, optional unit, long notes and changed answers after handoff.
7. **Validate timing and recovery.** Slow network, blocked script, changed field labels, delayed controls beyond 30 seconds, refresh, back/forward, expired ticket, duplicate click, duplicate iframe and unexpected postMessage sender. Each should leave a clear recovery path.
8. **Validate actual booking persistence and payment in the approved environment.** Confirm fields in the saved booking, selected arrival window, exact tax/price, later customer edits and duplicate prevention. Payment authentication, declined cards and successful confirmation require a separate controlled payment test.
9. **Only then consider the embedded completion stage.** Test Safari/iPhone, Chrome/Android, desktop browsers and in-app browsers, including cookies, login, Stripe Link and payment authentication. Preserve a full-page fallback.
10. **Measure accepted transfers rather than iframe loads.** Track handoff started, native form ready, required fields accepted, partial transfer, calendar interaction, payment interaction and confirmed booking. A click or a page load is not a completed booking.

Success means every supplied answer reaches the correct saved field without changing its meaning, the customer does not repeat it, the native price agrees or explains a difference, live availability remains authoritative, and failure never prevents ordinary booking. No conversion uplift percentage is justified before controlled measurement.

BookingKoala's documented “test mode” can hide a form from customers by putting it under maintenance. It should not be assumed to be a payment sandbox, and it should not be enabled on the active customer form just to test this integration. Arrange a separate approved environment and confirm payment-test behavior with BookingKoala. [BookingKoala: Test mode](https://help.bookingkoala.com/help/turn-off-delete-forms-industries).

## Questions for BookingKoala support

The following is a draft inquiry; it has not been sent.

> Duty Cleaners uses a custom website funnel and your Form 1 home-cleaning checkout. Your official Make app currently exposes “Make an API Call.” Which documented endpoints can this credential access? Specifically, can it create a draft/quote with pricing variables, quantities, address and custom-section answers, then return a customer completion URL without creating a confirmed booking or sending messages? Is there a supported live-availability endpoint, and does it enforce the same provider, duration and location rules as the customer form?
>
> If those operations are unavailable, do you support a merchant-installed Header Code script that fills native booking fields? Are there stable custom-field IDs, a JavaScript setter/readback API, form-ready/change events or a documented postMessage interface? Does Header Code run in both the hosted and embedded booking form, and are requests to our own handoff backend permitted?
>
> For Canadian addresses, does `zipcode` populate the address postal-code field, a separate service-location field, or both? What format and form settings are required? In a public test, the core service/property parameters worked but the address postal-code field stayed empty.
>
> Please also confirm an isolated testing method, the requirements for customer-editable quote completion, and current support for Stripe Link and wallet checkout in your customer form.

## Public test record and local evidence

The public test opened `https://dutycleaners.bookingkoala.com/booknow` with these non-contact values: industry 1, form 1, service 6, frequency 1; pricing categories 9→55, 1→81, 2→88 and 8→51; `zipcode=T5J0N3`, `dc_zip=T5J0N3`, `dc_entry=home`, `dc_clean=3`, and `dc_park=street`.

The native summary displayed Standard Cleaning, One-Time, Apartment or Condo, 2 Bedrooms, 1 Full Bath and 0 Half Baths. It displayed $169.00 before tax and $177.45 total for that selection. These amounts describe this test only and are not a new pricing policy. Custom dropdowns remained at Select Option; the address postal-code input's value was empty. Manually entering the formatted postal code populated the field, but the date control remained disabled in the incomplete form. That does not establish a lack of crew availability or identify the remaining dependency.

Contact parameters, notes, gift cards, selected extras, saved records and payment were not exercised in this public test. No conclusion about their full runtime behavior should be inferred from this limited case. Exact required-field rules are also not proved by the absence of HTML `required` attributes; the application may implement its own validation.

Local evidence, inspected September 12, 2026:

- [QuoteFlow.tsx](<C:/Users/Marketplace/Documents/Claude Code Projects/Duty cleaners GHL BK Fix/site/src/components/quote/QuoteFlow.tsx:96>): entry and cleanliness options, required cleaner-details step, current copy promising that answers can be skipped at checkout.
- [booking-redirect.ts](<C:/Users/Marketplace/Documents/Claude Code Projects/Duty cleaners GHL BK Fix/site/src/lib/booking-redirect.ts:280>): cleaner-details schema and parameter construction; redirect remains selected at line 54.
- [bk-header-fill.html](<C:/Users/Marketplace/Documents/Claude Code Projects/Duty cleaners GHL BK Fix/bk-header-fill.html:34>): custom dropdown and address receiver, 30-second polling and completion markers.
- [BookingEmbed.tsx](<C:/Users/Marketplace/Documents/Claude Code Projects/Duty cleaners GHL BK Fix/site/src/components/quote/BookingEmbed.tsx:41>): existing origin-only message handling and fallback behavior.
- [CLAUDE.md](<C:/Users/Marketplace/Documents/Claude Code Projects/Duty cleaners GHL BK Fix/CLAUDE.md>): account publication notes and current service constraints, treated as local project records rather than proof of current remote deployment.

## Sources

All web sources below were accessed September 12, 2026. An article's listed update date is not a claim that the feature was released that day. Undated live listings were evaluated as current listings, with the limitations stated above.

| Publisher | Source | Listed update / evidence date |
|---|---|---|
| BookingKoala | [Query parameters and preselected fields](https://help.bookingkoala.com/help/pre-select-fields-on-the-booking-form) | March 13, 2023 |
| BookingKoala | [Setting up Zapier in the leads module](https://help.bookingkoala.com/help/setting-up-zapier-in-the-leads-module) | February 18, 2025 |
| Zapier | [BookingKoala integration](https://zapier.com/apps/bookingkoala/integrations) | Current listing; no release date established |
| Make | [BookingKoala modules](https://www.make.com/en/integrations/bookingkoala) | Current vendor-maintained listing |
| BookingKoala | [Make integration guide](https://help.bookingkoala.com/help/make-integromat-integration-guide) | October 22, 2024 |
| Make | [BookingKoala application documentation](https://apps.make.com/bookingkoala) | Undated; explicit AI-generated-content caveat |
| BookingKoala | [Feedback board](https://feedback.bookingkoala.com/contribute/) | Current indexed listing; dynamic-rendering limitation |
| BookingKoala | [Send a quote](https://help.bookingkoala.com/help/send-a-quote) | September 30, 2024 |
| BookingKoala | [May 2024 feature release](https://feedback.bookingkoala.com/changelog/feature-release-update-may-2024-1034) | May 2024 release title |
| BookingKoala | [Embed forms](https://help.bookingkoala.com/help/embed-the-forms-on-your-existing-website) | September 2, 2025 |
| BookingKoala | [Google Adwords / header code](https://help.bookingkoala.com/help/google-adwords) | June 27, 2022; used only for code installation, not current Google Ads instructions |
| BookingKoala | [Form layouts](https://help.bookingkoala.com/help/how-to-set-up-the-single-step-two-step-or-multi-step-form-for-customers) | April 14, 2022 |
| BookingKoala | [Rearrange sections](https://help.bookingkoala.com/help/rearrange-sections-on-my-booking-form) | September 13, 2024 |
| BookingKoala | [Scheduling settings](https://help.bookingkoala.com/help/setting-up-your-store-options-scheduling-tab) | Current retrieved guidance; exact update date not recorded |
| BookingKoala | [Test mode](https://help.bookingkoala.com/help/turn-off-delete-forms-industries) | February 1, 2022 |
| MDN | [Window.postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage), [same-origin policy](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Same-origin_policy), [autocomplete](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/autocomplete) | Current reference pages |
| Stripe | [Link in the Card Element](https://docs.stripe.com/payments/link/card-element-link) | Current reference page |
| OWASP; Robert Gilbert, contributor Michal Biesiada | [Information exposure through query strings](https://community.owasp.org/vulnerabilities/Information_exposure_through_query_strings_in_url) | Current reference page; no publication date established |
| Duty Cleaners | [Public booking form](https://dutycleaners.bookingkoala.com/booknow) | Direct observation September 12, 2026 |

