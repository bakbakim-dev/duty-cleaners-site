# Travel fee doesn't arrive preselected on BookingKoala

## What I verified first

I drove the funnel in a real browser, answered "No" to the city-limits question, and captured the exact URL we hand off to BookingKoala:

```text
/booknow?industry_id=1&form_id=1&service_id=6&frequency_id=1
  &pricing_parameter[9]=55&pricing_parameter[1]=81&pricing_parameter[2]=88&pricing_parameter[8]=51
  &extras[108]=1&f_name=...&email=...&phone=...
```

The travel fee (`extras[108]=1`, $29.99, the row named "Outside Edmonton/Calgary(Surrounding areas) - Travel fee") **is** in the URL, at the right id, with the right quantity. So the bug is not that we forget to send it — it is that BookingKoala's booking page isn't applying what we send. I can't confirm from here which of the possible causes it is, so the first step of the plan is to pin that down rather than guess.

## Step 1 — Pin down what BookingKoala accepts (before any code change)

Open the captured URL on the live booking page and note, for each case, whether the tick lands:

1. `extras[108]=1` alone (travel fee only) — the reported failure.
2. `extras[123]=1` (Inside Oven) alone — if this ticks and 108 doesn't, the problem is specific to that one row (likely hidden/disabled on the front-end booking form even though it exists in config).
3. Both together — tells us whether one extra crowds out the other.
4. Alternate encodings for the same row: `extras[]=108`, `extras[108]=on`, `extras[108][quantity]=1`.

That's four page loads and it decides everything below.

## Step 2 — Fix, chosen by what Step 1 shows

- **If a different encoding works** — change the one line in the shared query builder that writes `extras[<id>]` to the encoding BK honours. Every path (redirect, embed, deep-clean package, pets, oven/fridge shelf) uses the same builder, so they all get fixed at once, and the unit tests get updated to assert the new shape.
- **If no extras prefill at all** — the `extras[...]` parameters are dead weight and the fee has to travel the same way the cleaner details do: through the BookingKoala-side script that already reads our `dc_*` parameters. We'd send `dc_travel=1` and have that script tick the travel-fee checkbox after the form renders.
- **If only row 108 is rejected** — it's a BookingKoala configuration issue on that extra (status/visibility for the Standard form), not something the site can fix by sending different text. In that case the change is on the BK admin side, and the site keeps sending `extras[108]=1` as-is.

## Step 3 — Keep the customer honest either way

Whatever the outcome, the price we show and the price BK shows must agree. If the fee genuinely cannot be preselected, the handoff screen and the price card gain one plain line — "Add the $29.99 travel fee on the next page; your total there will match the $198.99 shown here" — so nobody lands on BK, sees a lower total, and books the wrong thing.

## Technical notes

- Handoff URL is built in one place: `buildBookingQuery` in `src/lib/booking-redirect.ts` (the `extras[${extra.id}]` write, currently line 324). Ids are resolved from `src/data/bk-config.json` via `src/lib/bk-extras.ts` — nothing is hard-coded and nothing needs re-mapping.
- Config row 108: `service_categories` includes 6 (Standard) and 2 (Move In/Out), `quantity_based: 1`, `enable_quantity_based: "no"`, `exempt_extra_from_freq_disc: true`, `status: 1`. `enable_quantity_based: "no"` is the one plausible reason a `=1` quantity value could be dropped — case 4 in Step 1 tests exactly that.
- Tests to extend in `src/lib/booking-redirect.test.ts` once the encoding is known.

## What I need from you

Step 1 needs the live BookingKoala page, which I can't reach from here. Tell me what you see for cases 1 and 2 (does Inside Oven prefill?), or paste a screenshot of the landing page for each, and I'll implement the matching branch of Step 2 straight away.
