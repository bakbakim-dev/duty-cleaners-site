import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CITY_PROOF } from "@/data/proof";

/**
 * Leave detection and instant delivery (owner, 2026-09-23).
 *
 * The funnel reports "still here" while someone is actively on the price or
 * details screen; the relay marks the visit left after five quiet minutes and
 * tags the contact quote-left, which starts GoHighLevel's office alert and
 * first text. Leads reach GoHighLevel in seconds through a follow-up
 * "deliver" request instead of waiting for the five-minute cron job.
 */
const ROOT = join(__dirname, "..", "..");
const codeOf = (file: string) => readFileSync(join(ROOT, file), "utf8");

describe("the relay", () => {
  it("a new price check clears the leftover price-check tags first", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(
      /if \(\$isQuoteLead\) dc_ghl_remove_tags\(\$headers, \$contactId, \['quote-started', 'quote-left', 'text1-sent'\]\);[\s\S]{0,400}'\/tags',\s*'POST'/,
    );
  });

  it("a visit counts as left after five quiet minutes", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(/const DC_GHL_QUIET_SECONDS = 300;/);
    expect(relay).toMatch(/\(\$current\['state'\] \?\? ''\) !== 'open' \|\| \(int\) \(\$current\['last_seen'\] \?\? \$now\) > \$now - DC_GHL_QUIET_SECONDS\) return null;/);
  });

  it("a left visit sets the step field, then adds quote-left", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(/contact\.funnel_last_step[\s\S]{0,600}json_encode\(\['tags' => \['quote-left'\]\]/);
  });

  it("a left visit emails the office from this server before tagging", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(/dc_ghl_office_alert\(\$config, \$lead, \$contactId, \$session\);[\s\S]{0,1200}json_encode\(\['tags' => \['quote-left'\]\]/);
    expect(relay).toMatch(/return @mail\(implode\(',', \$to\), \$subject, \$message\['body'\]/);
  });

  it("the office alert is sent as dutycleaners.ca, never the GHL Gmail sender", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toContain("const DC_GHL_OFFICE_ALERT_FROM = 'website-alerts@dutycleaners.ca';");
    expect(relay).toContain("const DC_GHL_OFFICE_ALERT_TO = ['support@dutycleaners.ca'];");
  });

  it("a confirmed quote or call-back emails the office once, from this server", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(
      /if \(!\(\$record\['office_alerted'\] \?\? false\) && \(\$payload\['stage'\] \?\? ''\) === 'confirm'\) \{\s*\$record\['office_alerted'\] = true;\s*dc_ghl_confirm_alert\(\$config, \$payload, /,
    );
    expect(relay).toMatch(/function dc_ghl_confirm_alert\([\s\S]{0,400}return dc_ghl_office_send\(\$config, dc_ghl_confirm_alert_message\(/);
  });

  it("office emails never carry the customer's notes (they can hold entry codes)", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    const composer = relay.split("function dc_ghl_confirm_alert_message")[1]?.split("function dc_ghl_confirm_alert(")[0] ?? "";
    expect(composer.length).toBeGreaterThan(500);
    expect(composer).not.toMatch(/'notes'/);
  });

  it("every lead carries its branch and lead source into GoHighLevel", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(/foreach \(dc_ghl_source_values\(\$payload\) as \$fieldKey => \$value\) \{[\s\S]{0,200}dc_ghl_optional_field_id\(\$config, \$fieldKey\)/);
    for (const key of ["branch", "lead_channel", "utm_source", "utm_medium", "utm_campaign", "utm_term", "ad_click_id"]) {
      expect(relay).toContain(`'contact.${key}' => `);
    }
  });

  it("follow-up messages name the branch office line, from proof.ts, never the GHL texting number", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toContain(`'Edmonton' => '${CITY_PROOF.edmonton.phone}'`);
    expect(relay).toContain(`'Calgary' => '${CITY_PROOF.calgary.phone}'`);
    expect(relay).toContain(`'Red Deer' => '${CITY_PROOF.reddeer.phone}'`);
    expect(relay).toContain(`const DC_GHL_NO_BRANCH_PHONE = 'Edmonton ${CITY_PROOF.edmonton.phone} or Calgary ${CITY_PROOF.calgary.phone}';`);
    expect(relay).toMatch(/'contact\.branch_phone' => DC_GHL_BRANCH_PHONES\[\$branch\] \?\? DC_GHL_NO_BRANCH_PHONE/);
    expect(relay).not.toMatch(/812-4907/);
  });

  it("a Google Ads click is labelled Google Ads", () => {
    expect(codeOf("public/api/ghl-quote.php")).toMatch(/\$clickId !== ''\s*\? 'Google Ads'/);
  });

  it("answers the deliver and ping operations and sweeps from the cron job", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(/\['operation'\] \?\? null\) === 'deliver'/);
    expect(relay).toMatch(/\['operation'\] \?\? null\) === 'ping'/);
    expect(relay).toMatch(/\$left = dc_ghl_sweep_sessions\(\$config\);/);
    expect(relay).toMatch(/dc_ghl_session_record\(\$config, \$payload, \$path\);/);
  });
});

describe("the funnel", () => {
  it("a stored submission asks the relay to deliver it now", () => {
    expect(codeOf("src/lib/quote-submit.ts")).toMatch(/if \(result\?\.delivery === "pending"\) requestDelivery\(requestId\);/);
  });

  it("funnel submissions carry the visit id", () => {
    expect(codeOf("src/lib/quote-submit.ts")).toContain("...(options.sessionId ? { session_id: options.sessionId } : {}),");
    const flow = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(flow.match(/sessionId: presenceSessionRef\.current \?\? undefined/g)?.length).toBe(4);
  });

  it("reports only while the page is on screen and recently used", () => {
    expect(codeOf("src/lib/quote-presence.ts")).toContain(
      'document.visibilityState === "visible" && Date.now() - lastInteraction < PRESENCE_IDLE_MS',
    );
  });

  it("reports stop when the visitor is handed to the booking page", () => {
    const flow = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(flow).toMatch(/markHandoffFired\(\);\s*setPresenceDone\(true\);/);
    expect(flow).toMatch(/const watching = isOpen && step === 2 && contactDoneRef\.current && !presenceDone && !submitted && !restored;/);
  });
});

/**
 * The quote on screen (owner, 2026-09-24). A price check used to reach
 * GoHighLevel with no price: the price only travelled with the confirmation.
 * Now the "still here" reports carry the quote the visitor is looking at, so
 * the "left without booking" email and the contact name the price and home
 * they saw. It rides nested under `shown` on the reports, never as a
 * submission price, so a price check stays a lead.
 */
const between = (text: string, start: string, end: string) => text.split(start)[1]?.split(end)[0] ?? "";

describe("the quote on screen", () => {
  it("the left-visit office email names the shown price", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    const composer = between(relay, "function dc_ghl_office_alert_message", "function dc_ghl_office_alert(");
    expect(composer.length).toBeGreaterThan(500);
    expect(composer).toContain("$shown = dc_ghl_session_shown($config, $session);");
    expect(composer).toMatch(/'Price shown: ' \. \$priceShown,/);
    expect(composer).toContain("'price on request (custom quote, no online price)'");
    expect(composer).toMatch(/'Each visit after' => \$recurring === '' \? '' : \$recurring \. ' before GST'/);
    expect(composer).not.toMatch(/'notes'|'entry/);
  });

  it("the shown quote is allow-listed: never notes, entry or contact details", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toContain(
      "const DC_GHL_SHOWN_TEXT_KEYS = ['city', 'service', 'home_type', 'bedrooms', 'full_bathrooms', 'half_baths', 'frequency'];",
    );
    expect(relay).toContain("const DC_GHL_SHOWN_PRICE_KEYS = ['first_clean_price', 'first_clean_price_high', 'recurring_price'];");
    const snapshot = between(codeOf("src/components/quote/QuoteFlow.tsx"), "const shownQuote: ShownQuote | null", "shownQuoteRef.current = shownQuote;");
    expect(snapshot.length).toBeGreaterThan(300);
    expect(snapshot).not.toMatch(/details\.|notes|entry|contact\./);
  });

  it("a left visit writes the shown quote to the contact in the step's PUT, before quote-left", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toMatch(
      /dc_ghl_put_fields\(\$headers, \$contactId, \$stepField, dc_ghl_shown_fields\(\$config, \$session\)\);\s*dc_ghl_http\([^;]*\['tags' => \['quote-left'\]\]/,
    );
    expect(relay).toMatch(/\[\$status\] = \$put\(array_merge\(\$required, \$extra\)\);/);
    const fields = between(relay, "function dc_ghl_shown_fields", "function dc_ghl_put_fields");
    expect(fields).toMatch(/foreach \(DC_GHL_FIELD_MAP as \$fieldKey => \$payloadKey\)/);
  });

  it("a shown price never makes a lead a confirmation", () => {
    expect(codeOf("src/lib/quote-presence.ts")).toContain(
      'JSON.stringify({ operation: "ping", session_id: sessionId, step, ...(shown ? { shown } : {}) })',
    );
    expect(codeOf("src/lib/quote-submit.ts")).toMatch(
      /"first_clean_price" in payload \|\| "recurring_price" in payload \? "confirm" : "lead"/,
    );
    const relay = codeOf("public/api/ghl-quote.php");
    const ping = between(relay, "function dc_ghl_session_ping", "function dc_ghl_optional_field_id");
    expect(ping.length).toBeGreaterThan(300);
    expect(ping).not.toMatch(/\['state'\]\s*=|dc_ghl_store|'stage'/);
    expect(between(relay, "function dc_ghl_payload(", "function dc_ghl_session_id")).not.toContain("shown");
    const flow = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(between(flow, "const quoteDetailFields = () => ({", "});")).not.toMatch(/price/);
    expect(flow).not.toMatch(/submitQuote\([^)]*shown/);
  });

  it("shouting names are proper-cased on the way into GoHighLevel", () => {
    const relay = codeOf("public/api/ghl-quote.php");
    expect(relay).toContain("$fullName = dc_ghl_name_case(trim($payload['full_name']));");
    expect(relay).toContain("$parts = preg_split('/\\s+/', $fullName) ?: [];");
    expect(relay).toContain("'name' => $fullName,");
    // Mixed case ("McCaffrey", "DeSouza") stays as typed.
    expect(relay).toContain("if ($lower === $upper || ($word !== $lower && $word !== $upper)) return $word;");
  });

  it("the price screen reports the quote on screen", () => {
    const flow = codeOf("src/components/quote/QuoteFlow.tsx");
    expect(flow).toContain("startPresence(presenceSessionRef.current ?? createPresenceSessionId(), where, shownQuoteRef.current)");
    expect(flow).toContain("presenceRef.current?.shown(shownQuoteRef.current);");
    expect(flow).toMatch(/first_clean_price: quote\.quoteOnly\s*\? null/);
    expect(codeOf("public/api/ghl-quote.php")).toContain(
      "dc_ghl_session_ping($config, dc_ghl_session_id($input['session_id'] ?? ''), (string) ($input['step'] ?? ''), dc_ghl_shown_quote($input['shown'] ?? null));",
    );
  });

  it("a changed quote is reported within the relay's request budget, and before the page goes", () => {
    const presence = codeOf("src/lib/quote-presence.ts");
    expect(presence).toContain("export const PRESENCE_MIN_GAP_MS = 30_000;");
    expect(presence).toContain("const wait = Math.max(SHOWN_SETTLE_MS, lastReportAt + PRESENCE_MIN_GAP_MS - Date.now());");
    expect(presence).toMatch(/\} else if \(!stopped && shownKey !== sentShownKey\) \{[\s\S]{0,200}send\(\);/);
  });
});
