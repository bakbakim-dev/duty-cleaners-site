import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hasRelayPhp, relayHarness, type RelayHarness } from "./ghl-relay-php-harness";

/**
 * Lead Channel (ghl-quote.php, AuditSpur #320). A visit with no ad or campaign
 * tags used to read "Website (no ad or campaign tags)" whatever sent it, so
 * GoHighLevel could not tell Google search or the Business Profile from a
 * typed-in visit. The referring hostname (tracking.ts) now names the channel;
 * ad clicks and UTM tags still win, and no referrer keeps the old wording.
 */
let relay: RelayHarness;
beforeEach(() => {
  if (hasRelayPhp) relay = relayHarness();
});
afterEach(() => relay?.cleanup());

describe.skipIf(!hasRelayPhp)("lead channel", () => {
  it("names the referring site when the visit carried no ad or campaign tags", () => {
    const out = relay.run(`
      $channel = fn (array $tracking): string => dc_ghl_source_values(['city' => '', 'tracking' => $tracking])['contact.lead_channel'];
      echo json_encode([
          $channel(['referrer_host' => 'google.ca']),
          $channel(['referrer_host' => 'm.facebook.com']),
          $channel(['referrer_host' => 'chatgpt.com']),
          $channel(['referrer_host' => 'homestars.com']),
          $channel(['referrer_host' => 'example.org']),
          $channel(['referrer_host' => 'evil.com/path?x=1']),
          $channel([]),
          $channel(['referrer_host' => 'google.ca', 'gclid' => 'abc']),
          $channel(['referrer_host' => 'google.ca', 'utm_source' => 'gbp', 'utm_medium' => 'organic']),
      ]);
    `);
    expect(out).toEqual([
      "Google (search, Maps or Business Profile)",
      "Facebook",
      "ChatGPT",
      "HomeStars",
      "Referral: example.org",
      "Website (no ad or campaign tags)",
      "Website (no ad or campaign tags)",
      "Google Ads",
      "gbp / organic",
    ]);
  });
});
