import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

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
