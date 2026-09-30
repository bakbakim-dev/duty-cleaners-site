import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

/**
 * A returning visitor's earlier quote must not linger on the contact
 * (2026-09-30). A live test found a one-time quote still showing a $241.99
 * recurring price and "left at the price screen" from a visit a week earlier:
 * the upsert skips empty values, so an old value was never replaced. Each
 * price-check submission now clears the quote fields it leaves empty, and the
 * "left at" step, in a separate best-effort PUT after the lead is in.
 * Runs the real PHP; skipped where PHP 8.2+ is not installed.
 */
const relay = resolve(__dirname, "..", "..", "public", "api", "ghl-quote.php");
const hasPhp = spawnSync("php", ["-r", "exit(PHP_VERSION_ID >= 80200 ? 0 : 1);"]).status === 0;

const IDS = `[
  'contact.what_type_of_service_would_you_like' => 'f-service',
  'contact.what_type_of_home_do_you_have' => 'f-home',
  'contact.bedrooms_in_total' => 'f-bed',
  'contact.bathrooms' => 'f-bath',
  'contact.half_baths' => 'f-half',
  'contact.frequency_in_bookings' => 'f-freq',
  'contact.site_quoted_first_clean_price' => 'f-first',
  'contact.site_quoted_recurring_price' => 'f-recurring',
  'contact.selected_extras' => 'f-extras',
  'contact.quote_page_url' => 'f-url',
]`;

function cleared(payload: string, stepId = "'f-step'"): string[] {
  const script = `require ${JSON.stringify(relay)}; echo json_encode(dc_ghl_stale_fields(${IDS}, ${payload}, ${stepId}));`;
  const run = spawnSync("php", ["-r", script], { env: { ...process.env, DC_GHL_LIBRARY_ONLY: "1" }, encoding: "utf8" });
  expect(run.status, run.stderr).toBe(0);
  const fields = JSON.parse(run.stdout) as { id: string; field_value: string }[];
  for (const field of fields) expect(field.field_value).toBe("");
  return fields.map((field) => field.id).sort();
}

const STEP1 = `'service' => 'Standard Cleaning', 'home_type' => 'Apartment or Condo', 'bedrooms' => 2, 'full_bathrooms' => 1, 'half_baths' => 0, 'page_url' => 'https://dutycleaners.ca/'`;

describe.skipIf(!hasPhp)("a new quote clears an earlier visit's leftovers", () => {
  it("a one-time confirmation clears the old recurring price and the left-at step, and keeps what it sent", () => {
    const ids = cleared(`[${STEP1}, 'frequency' => 'One-Time', 'first_clean_price' => 169, 'recurring_price' => null, 'addons' => []]`);
    expect(ids).toEqual(["f-extras", "f-recurring", "f-step"]);
  });

  it("a new price check clears the earlier quote's prices, plan and extras", () => {
    const ids = cleared(`[${STEP1}]`);
    expect(ids).toEqual(["f-extras", "f-first", "f-freq", "f-recurring", "f-step"]);
  });

  it("a confirmation with every value clears only the step", () => {
    const ids = cleared(`[${STEP1}, 'frequency' => 'Bi-Weekly', 'first_clean_price' => 169, 'recurring_price' => 143.65, 'addons' => ['Inside Oven']]`);
    expect(ids).toEqual(["f-step"]);
  });

  it("works without the step field", () => {
    expect(cleared(`[${STEP1}, 'frequency' => 'Bi-Weekly', 'first_clean_price' => 169, 'recurring_price' => 143.65, 'addons' => ['x']]`, "null")).toEqual([]);
  });
});

describe("the relay", () => {
  it("clears only for the quote funnel, after the tags, and never lets a refused clear cost the lead", () => {
    const code = readFileSync(join(__dirname, "..", "..", "public", "api", "ghl-quote.php"), "utf8");
    expect(code).toMatch(
      /if \(!\$isCareers && !\$isContact\) \{\s*try \{\s*\$stepFieldId = dc_ghl_optional_field_id\(\$config, 'contact\.funnel_last_step'\);\s*\$stale = dc_ghl_stale_fields\(\$fieldIds, \$payload, \$stepFieldId\);\s*if \(\$stale !== \[\]\) dc_ghl_put_fields\(\$headers, \$contactId, \[\], \$stale\);\s*\} catch \(Throwable\) \{/,
    );
    const deliver = code.split("function dc_ghl_deliver")[1] ?? "";
    expect(deliver.indexOf("dc_ghl_stale_fields(")).toBeGreaterThan(deliver.indexOf("GHL tag response"));
  });
});
