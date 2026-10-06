import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hasRelayPhp, relayHarness, type RelayHarness } from "./ghl-relay-php-harness";

/**
 * The relay's follow-ups after a lead is in (2026-10-02, reviewed 2026-10-06).
 *
 * A visitor who leaves the price screen: the office email, then the step and
 * quote fields, then quote-left, each acknowledged on its own and retried with
 * backoff, the tag only once the fields are in, and a confirmation cancelling
 * whatever is still pending. Retries stop two hours after the leave, so a mail
 * outage cannot end in a burst of stale "call now" emails; form-health hears.
 *
 * A confirmed quote's office email: tried once after the first delivery
 * attempt, retried by the cron job while unsent, never replaying the delivery,
 * and given up after 24 tries (about two hours) with a form-health report.
 *
 * Runs the real PHP with GoHighLevel and mail faked; skipped where PHP with
 * OpenSSL is not installed.
 */
let relay: RelayHarness;
beforeEach(() => {
  if (hasRelayPhp) relay = relayHarness();
});
afterEach(() => relay?.cleanup());

const CONTACT_CALLS = "'#^(MAIL|PUT|POST|DELETE) /?(office|contacts/contact-1)#'";

describe.skipIf(!hasRelayPhp)("a visitor who leaves the price screen", () => {
  it("gets one office email, then the step and quote fields, then quote-left", () => {
    const out = relay.run(`
      $recent = fake_quiet_visit($config, 120);
      $left = fake_quiet_visit($config);
      $marked = dc_ghl_sweep_sessions($config);
      $first = fake_calls(${CONTACT_CALLS});
      dc_ghl_sweep_sessions($config);
      echo json_encode([
          'marked' => $marked, 'first' => $first, 'second' => array_slice(fake_calls(${CONTACT_CALLS}), count($first)),
          'put' => fake_bodies('#^PUT /contacts/contact-1$#')[0], 'tags' => fake_bodies('#^POST /contacts/contact-1/tags$#'),
          'mail' => $GLOBALS['fake']['mail'], 'left' => fake_session($left), 'recent' => fake_session($recent)['state'],
      ]);
    `);
    expect(out.marked).toBe(1);
    expect(out.first).toEqual(["MAIL office", "PUT /contacts/contact-1", "POST /contacts/contact-1/tags"]);
    expect(out.put.customFields).toContainEqual({ id: "f-funnel_last_step", field_value: "the price screen" });
    expect(out.tags).toEqual([{ tags: ["quote-left"] }]);
    expect(out.mail).toEqual(["Left without booking - Test Customer (call now)"]);
    expect(out.left).toMatchObject({ state: "left", left_office_acked: true, left_fields_acked: true, left_tag_acked: true });
    expect(out.second).toEqual([]);
    // Someone quiet for two minutes may still be reading: left alone.
    expect(out.recent).toBe("open");
  });

  it("is kept pending while GoHighLevel refuses the fields, and never tagged before they are in", () => {
    const out = relay.run(`
      $session = fake_quiet_visit($config);
      fake_fail('#^PUT /contacts/contact-1$#', 503, 503);
      dc_ghl_sweep_sessions($config);
      $pending = fake_session($session);
      $calls = fake_calls(${CONTACT_CALLS});
      fake_session_patch($session, ['left_retry_at' => 0]);
      dc_ghl_sweep_sessions($config);
      echo json_encode(['pending' => $pending, 'calls' => $calls, 'retry' => array_slice(fake_calls(${CONTACT_CALLS}), count($calls)), 'final' => fake_session($session)['state'], 'now' => time()]);
    `);
    expect(out.pending.state).toBe("left_pending");
    expect(out.pending.left_office_acked).toBe(true);
    expect(out.pending.left_fields_acked).toBeUndefined();
    expect(out.pending.left_retry_at - out.now).toBeGreaterThanOrEqual(59);
    // The quote fields, then the step alone; no tag either time.
    expect(out.calls).toEqual(["MAIL office", "PUT /contacts/contact-1", "PUT /contacts/contact-1"]);
    expect(out.retry).toEqual(["PUT /contacts/contact-1", "POST /contacts/contact-1/tags"]);
    expect(out.final).toBe("left");
  });

  it("retries only the step that failed: a refused tag alone, a failed email alone", () => {
    const out = relay.run(`
      $tagRefused = fake_quiet_visit($config);
      fake_fail('#^POST /contacts/contact-1/tags$#', 503);
      dc_ghl_sweep_sessions($config);
      fake_session_patch($tagRefused, ['left_retry_at' => 0]);
      dc_ghl_sweep_sessions($config);
      $tagCalls = fake_calls(${CONTACT_CALLS});
      $mailFailed = fake_quiet_visit($config);
      $GLOBALS['fake']['mail_ok'] = false;
      dc_ghl_sweep_sessions($config);
      $GLOBALS['fake']['mail_ok'] = true;
      fake_session_patch($mailFailed, ['left_retry_at' => 0]);
      dc_ghl_sweep_sessions($config);
      echo json_encode([
          'tag' => [$tagCalls, fake_session($tagRefused)['state']],
          'mail' => [array_slice(fake_calls(${CONTACT_CALLS}), count($tagCalls)), fake_session($mailFailed)['state']],
      ]);
    `);
    expect(out.tag).toEqual([["MAIL office", "PUT /contacts/contact-1", "POST /contacts/contact-1/tags", "POST /contacts/contact-1/tags"], "left"]);
    expect(out.mail).toEqual([["MAIL office", "PUT /contacts/contact-1", "POST /contacts/contact-1/tags", "MAIL office"], "left"]);
  });

  it("is left alone by a sweep that finds its delivery lock taken", () => {
    const out = relay.run(`
      $session = fake_quiet_visit($config);
      $lock = fopen($session . '.delivery.lock', 'c+');
      flock($lock, LOCK_EX);
      $marked = dc_ghl_sweep_sessions($config);
      flock($lock, LOCK_UN); fclose($lock);
      echo json_encode(['marked' => $marked, 'calls' => fake_calls(${CONTACT_CALLS}), 'state' => fake_session($session)['state']]);
    `);
    expect(out).toEqual({ marked: 0, calls: [], state: "open" });
  });

  it("stops at a confirmation: no fields after one during the email, no quote-left after one during the fields", () => {
    const out = relay.run(`
      $confirm = static fn (string $session) => static fn () => fake_session_patch($session, ['state' => 'confirmed']);
      $duringEmail = fake_quiet_visit($config);
      fake_on('#^MAIL#', $confirm($duringEmail));
      dc_ghl_sweep_sessions($config);
      $emailCalls = fake_calls(${CONTACT_CALLS});
      $GLOBALS['fake']['on'] = [];
      $duringFields = fake_quiet_visit($config);
      fake_on('#^PUT /contacts/contact-1$#', $confirm($duringFields));
      dc_ghl_sweep_sessions($config);
      echo json_encode([
          'email' => [$emailCalls, fake_session($duringEmail)['state']],
          'fields' => [array_slice(fake_calls(${CONTACT_CALLS}), count($emailCalls)), fake_session($duringFields)['state']],
      ]);
    `);
    expect(out.email).toEqual([["MAIL office"], "confirmed"]);
    expect(out.fields).toEqual([["MAIL office", "PUT /contacts/contact-1"], "confirmed"]);
  });

  it("starts afresh when the visitor comes back for a new price check", () => {
    const out = relay.run(`
      $session = fake_quiet_visit($config);
      dc_ghl_sweep_sessions($config);
      $left = fake_session($session);
      $leadPath = dirname($session, 2) . DIRECTORY_SEPARATOR . $left['lead'];
      dc_ghl_session_record($config, dc_ghl_decrypt(fake_record($leadPath)['payload'], $config['encryption_key']), $leadPath);
      echo json_encode(['left' => $left['state'], 'again' => fake_session($session)]);
    `);
    expect(out.left).toBe("left");
    expect(out.again.state).toBe("open");
    expect(Object.keys(out.again).filter((key) => key.startsWith("left_"))).toEqual([]);
  });

  it("is given up two hours after the leave, reported to form-health once, then expires with the visit", () => {
    const out = relay.run(`
      $GLOBALS['fake']['mail_ok'] = false;
      $a = fake_quiet_visit($config);
      $b = fake_quiet_visit($config);
      dc_ghl_sweep_sessions($config);
      $pending = [fake_session($a)['state'], fake_session($b)['state']];
      foreach ([$a, $b] as $session) fake_session_patch($session, ['left_retry_at' => 0, 'left_at' => time() - 7000]);
      dc_ghl_sweep_sessions($config);
      $inside = [fake_session($a)['state'], count($GLOBALS['fake']['mail'])];
      foreach ([$a, $b] as $session) fake_session_patch($session, ['left_retry_at' => time() + 600, 'left_at' => time() - 7201]);
      $calls = count(fake_calls());
      dc_ghl_sweep_sessions($config);
      $gaveUp = [fake_session($a)['state'], fake_session($b)['state'], count(fake_calls()) - $calls, $GLOBALS['fake']['health']];
      dc_ghl_sweep_sessions($config);
      $after = [count(fake_calls()) - $calls, count($GLOBALS['fake']['health'])];
      fake_session_patch($a, ['created_at' => time() - DC_GHL_SESSION_TTL_SECONDS - 60]);
      dc_ghl_sweep_sessions($config);
      echo json_encode(['pending' => $pending, 'inside' => $inside, 'gaveUp' => $gaveUp, 'after' => $after, 'expired' => !is_file($a), 'kept' => fake_session($b)['state']]);
    `);
    expect(out.pending).toEqual(["left_pending", "left_pending"]);
    // Inside the window the email is still retried.
    expect(out.inside).toEqual(["left_pending", 4]);
    // Past it: no more email or GoHighLevel calls, one report for the sweep.
    expect(out.gaveUp).toEqual([
      "left_failed",
      "left_failed",
      0,
      [{ event: "failed", form: "quote-funnel", stage: "ghl-delivery", category: "delivery", status: 0, path: "/server/ghl-quote" }],
    ]);
    expect(out.after).toEqual([0, 1]);
    expect(out.expired).toBe(true);
    expect(out.kept).toBe("left_failed");
  });
});

describe.skipIf(!hasRelayPhp)("a confirmed quote's office email", () => {
  it("is sent once, even while GoHighLevel is down", () => {
    const out = relay.run(`
      fake_fail('#^POST /contacts/upsert$#', 503, 503);
      $path = fake_store($config);
      $states = [];
      for ($i = 0; $i < 3; $i++) $states[] = dc_ghl_attempt($config, fake_record($path), $path)['state'];
      $record = fake_record($path);
      echo json_encode(['states' => $states, 'mail' => $GLOBALS['fake']['mail'], 'alert' => [$record['office_alerted'], $record['office_alert_pending'], $record['office_alert_attempts']]]);
    `);
    expect(out.states).toEqual(["pending", "pending", "delivered"]);
    expect(out.mail).toEqual(["Quote confirmed - Test Customer ($169.00) - went to booking page"]);
    expect(out.alert).toEqual([true, false, 1]);
  });

  it("that failed is retried by the cron job when due, never replaying the delivery", () => {
    const out = relay.run(`
      $GLOBALS['fake']['mail_ok'] = false;
      $path = fake_store($config, ['source' => 'dutycleaners.ca instant quote (call-back requested)']);
      $record = dc_ghl_attempt($config, fake_record($path), $path);
      $first = [$record['office_alerted'], $record['office_alert_pending'], $record['office_alert_attempts'], $record['office_alert_retry_at'] - time()];
      $GLOBALS['fake']['mail_ok'] = true;
      $calls = count(fake_calls());
      dc_ghl_retry_office_alert($config, $path);
      $early = count($GLOBALS['fake']['mail']);
      fake_patch($path, ['office_alert_retry_at' => 0]);
      $cron = dc_ghl_retry_pending($config);
      fake_patch($path, ['office_alert_retry_at' => 0]);
      dc_ghl_retry_office_alert($config, $path);
      $final = fake_record($path);
      echo json_encode([
          'first' => $first, 'early' => $early, 'mail' => $GLOBALS['fake']['mail'], 'ghl' => array_values(array_filter(array_slice(fake_calls(), $calls), fn ($call) => $call !== 'MAIL office')),
          'final' => [$final['office_alerted'], $final['office_alert_pending'], $final['office_alert_attempts'], $final['state'], $final['attempts']],
      ]);
    `);
    expect(out.first.slice(0, 3)).toEqual([false, true, 1]);
    expect(out.first[3]).toBeGreaterThanOrEqual(59);
    expect(out.early).toBe(1);
    expect(out.mail).toEqual(["Call-back requested - Test Customer (call now)", "Call-back requested - Test Customer (call now)"]);
    expect(out.ghl).toEqual([]);
    expect(out.final).toEqual([true, false, 2, "delivered", 1]);
  });

  it("that keeps failing stops after 24 tries in all and is reported to form-health", () => {
    const out = relay.run(`
      $GLOBALS['fake']['mail_ok'] = false;
      $path = fake_store($config);
      dc_ghl_attempt($config, fake_record($path), $path);
      for ($i = 0; $i < 30; $i++) {
          fake_patch($path, ['office_alert_retry_at' => 0]);
          dc_ghl_retry_office_alert($config, $path);
      }
      dc_ghl_retry_pending($config);
      $record = fake_record($path);
      echo json_encode(['tries' => count($GLOBALS['fake']['mail']), 'alert' => [$record['office_alerted'], $record['office_alert_pending'], $record['office_alert_attempts']], 'health' => $GLOBALS['fake']['health'], 'cap' => DC_GHL_OFFICE_ALERT_MAX_ATTEMPTS]);
    `);
    expect(out.cap).toBe(24);
    expect(out.tries).toBe(24);
    expect(out.alert).toEqual([false, false, 24]);
    expect(out.health).toEqual([{ event: "failed", form: "quote-funnel", stage: "ghl-delivery", category: "delivery", status: 0, path: "/server/ghl-quote" }]);
  });
});
