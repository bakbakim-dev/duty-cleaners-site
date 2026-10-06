import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hasRelayPhp, relayHarness, type RelayHarness } from "./ghl-relay-php-harness";

/**
 * Enquiry evidence (enquiry-evidence.php, live since 2026-10-03, reviewed
 * 2026-10-06). A confirmed quote, call-back or contact form writes "Last
 * qualifying enquiry date" and "Qualifying enquiry evidence" on the contact,
 * which Long Term Nurture's consent gates read. The date comes from the
 * server's own receipt, never the browser. The three extra GoHighLevel calls
 * used to run before the tags and fail the whole delivery, so one hiccup left
 * the lead untagged and the office's automations waited; they now run after
 * everything else, keep their own state, and retry on their own up to six
 * tries before form-health hears. Runs the real PHP with GoHighLevel faked;
 * skipped where PHP with OpenSSL is not installed.
 */
let relay: RelayHarness;
beforeEach(() => {
  if (hasRelayPhp) relay = relayHarness();
});
afterEach(() => relay?.cleanup());

describe.skipIf(!hasRelayPhp)("enquiry evidence", () => {
  it("is dated from the server's receipt in Edmonton time, never the browser's clock", () => {
    const out = relay.run(`
      $record = ['created_at' => '2026-10-03T05:59:00Z', 'receipt_id' => str_repeat('a', 32), 'submitted_at' => '2099-01-01'];
      $receipt = dc_enquiry_receipt($record, strtotime('2026-10-03T06:00:00Z'));
      $fails = static function (callable $fn): bool { try { $fn(); return false; } catch (Throwable) { return true; } };
      echo json_encode([
          'receipt' => $receipt,
          'later' => dc_enquiry_receipt($record, strtotime('2026-11-03T06:00:00Z')) === $receipt,
          'impossible' => $fails(fn () => dc_enquiry_receipt(['created_at' => '2026-02-30T00:00:00Z', 'receipt_id' => str_repeat('a', 32)], time())),
          'future' => $fails(fn () => dc_enquiry_receipt(['created_at' => '2099-01-01T00:00:00Z', 'receipt_id' => str_repeat('a', 32)], time())),
          'anonymous' => $fails(fn () => dc_enquiry_receipt(['created_at' => '2026-10-03T05:59:00Z'], time())),
      ]);
    `);
    expect(out.receipt).toEqual({
      date: "2026-10-02",
      evidence: `Website enquiry; server receipt ${"a".repeat(32)}; received 2026-10-03T05:59:00Z`,
    });
    expect(out.later).toBe(true);
    expect([out.impossible, out.future, out.anonymous]).toEqual([true, true, true]);
  });

  it("counts a confirmed quote, call-back or contact form, never a price check or a job application", () => {
    const out = relay.run(`echo json_encode([
      dc_enquiry_candidate(['source' => 'dutycleaners.ca instant quote', 'stage' => 'confirm']),
      dc_enquiry_candidate(['source' => 'dutycleaners.ca instant quote (call-back requested)', 'stage' => 'confirm']),
      dc_enquiry_candidate(['source' => 'contact-form main', 'stage' => 'lead']),
      dc_enquiry_candidate(['source' => 'dutycleaners.ca instant quote', 'stage' => 'lead']),
      dc_enquiry_candidate(['source' => 'careers-application', 'stage' => 'confirm']),
    ]);`);
    expect(out).toEqual([true, true, true, false, false]);
  });

  it("never shortens a newer enquiry date or overwrites same-day evidence", () => {
    const out = relay.run(`
      $receipt = ['date' => '2026-10-02', 'evidence' => 'this receipt'];
      $contact = fn (string $date, string $evidence) => ['customFields' => [['id' => 'date', 'value' => $date], ['id' => 'evidence', 'value' => $evidence]]];
      try { dc_enquiry_plan($receipt, $contact('nonsense', 'x'), 'date', 'evidence'); $malformed = 'written'; } catch (RuntimeException) { $malformed = 'held'; }
      echo json_encode([
          'newer' => dc_enquiry_plan($receipt, $contact('2026-10-03', 'later enquiry'), 'date', 'evidence'),
          'sameDay' => dc_enquiry_plan($receipt, $contact('2026-10-02', 'earlier same-day enquiry'), 'date', 'evidence'),
          'sameDayBlank' => count(dc_enquiry_plan($receipt, $contact('2026-10-02', ''), 'date', 'evidence')),
          'older' => dc_enquiry_plan($receipt, $contact('2026-09-01', 'old'), 'date', 'evidence'),
          'blank' => count(dc_enquiry_plan($receipt, ['customFields' => []], 'date', 'evidence')),
          'malformed' => $malformed,
      ]);
    `);
    expect(out.newer).toEqual([]);
    expect(out.sameDay).toEqual([]);
    expect(out.sameDayBlank).toBe(2);
    expect(out.older).toEqual([
      { id: "date", field_value: "2026-10-02" },
      { id: "evidence", field_value: "this receipt" },
    ]);
    expect(out.blank).toBe(2);
    expect(out.malformed).toBe("held");
  });

  it("writes the date and evidence together and counts them only once GoHighLevel reads them back", () => {
    const out = relay.run(`
      $record = ['created_at' => '2026-10-03T05:00:00Z', 'receipt_id' => str_repeat('b', 32)];
      $update = fn () => dc_enquiry_update($config, dc_ghl_headers($config), 'contact-1', $record);
      $update();
      $first = fake_calls('#^(GET|PUT) /contacts/contact-1$#');
      $written = fake_bodies('#^PUT /contacts/contact-1$#')[0];
      $saved = $GLOBALS['fake']['fields'];
      $n = count(fake_calls()); $update(); $again = array_slice(fake_calls(), $n);
      $GLOBALS['fake']['fields'] = ['f-last_qualifying_enquiry_date' => '2026-10-04', 'f-qualifying_enquiry_evidence' => 'newer enquiry'];
      $n = count(fake_calls()); $update(); $newer = [array_slice(fake_calls(), $n), $GLOBALS['fake']['fields']];
      $GLOBALS['fake']['fields'] = []; $GLOBALS['fake']['keep_puts'] = false;
      try { $update(); $unkept = 'counted'; } catch (RuntimeException $error) { $unkept = $error->getMessage(); }
      $GLOBALS['fake']['keep_puts'] = true;
      fake_fail('#^PUT /contacts/contact-1$#', 503);
      try { $update(); $refused = 'counted'; } catch (RuntimeException $error) { $refused = $error->getMessage(); }
      echo json_encode(['first' => $first, 'written' => $written, 'saved' => $saved, 'again' => $again, 'newer' => $newer, 'unkept' => $unkept, 'refused' => [$refused, $GLOBALS['fake']['fields']]]);
    `);
    expect(out.first).toEqual(["GET /contacts/contact-1", "PUT /contacts/contact-1", "GET /contacts/contact-1"]);
    expect(Object.keys(out.written)).toEqual(["customFields"]);
    expect(out.saved).toEqual({
      "f-last_qualifying_enquiry_date": "2026-10-02",
      "f-qualifying_enquiry_evidence": `Website enquiry; server receipt ${"b".repeat(32)}; received 2026-10-03T05:00:00Z`,
    });
    // A retry only reads; a newer enquiry already on the contact is kept.
    expect(out.again).toEqual(["GET /contacts/contact-1"]);
    expect(out.newer).toEqual([["GET /contacts/contact-1"], { "f-last_qualifying_enquiry_date": "2026-10-04", "f-qualifying_enquiry_evidence": "newer enquiry" }]);
    expect(out.unkept).toBe("enquiry update verification failed");
    expect(out.refused).toEqual(["enquiry field update failed", []]);
  });

  it("is written after the confirmed quote's tags, and a failure never holds them up", () => {
    const out = relay.run(`
      fake_fail('#^GET /contacts/contact-1$#', 503);
      $path = fake_store($config);
      $record = dc_ghl_attempt($config, fake_record($path), $path);
      $first = fake_calls();
      fake_patch($path, ['enquiry_evidence' => ['next_retry_at' => 0] + fake_record($path)['enquiry_evidence']]);
      $cron = dc_ghl_retry_pending($config);
      echo json_encode([
          'record' => array_diff_key($record, ['payload' => 1]), 'first' => $first, 'retry' => array_slice(fake_calls(), count($first)),
          'cron' => $cron, 'final' => fake_record($path)['enquiry_evidence'], 'mail' => $GLOBALS['fake']['mail'], 'now' => time(),
      ]);
    `);
    expect(out.record).toMatchObject({ state: "delivered", attempts: 1, enquiry_evidence: { status: "pending", attempts: 1, error: "enquiry contact read failed" } });
    expect(out.record.enquiry_evidence.next_retry_at - out.now).toBeGreaterThanOrEqual(299);
    const tags = out.first.indexOf("POST /contacts/contact-1/tags");
    expect(tags).toBeGreaterThan(out.first.indexOf("POST /contacts/upsert"));
    expect(out.first.indexOf("MAIL office")).toBeGreaterThan(tags);
    expect(out.first.indexOf("GET /contacts/contact-1")).toBeGreaterThan(out.first.indexOf("MAIL office"));
    expect(out.mail).toEqual(["Quote confirmed - Test Customer ($169.00) - went to booking page"]);
    // The retry runs the enquiry step alone: no upsert, no tags, no second email.
    expect(out.retry).toEqual(["GET /contacts/contact-1", "PUT /contacts/contact-1", "GET /contacts/contact-1"]);
    expect(out.cron).toMatchObject({ checked: 1, delivered: 1 });
    expect(out.final).toEqual({ status: "saved", attempts: 2 });
  });

  it("that keeps failing is retried on the lead's schedule, six tries at most, then reported once", () => {
    const out = relay.run(`
      fake_fail('#^GET /contacts/contact-1$#', ...array_fill(0, 10, 503));
      $path = fake_store($config, ['source' => 'contact-form main', 'stage' => 'lead', 'first_clean_price' => null]);
      $state = dc_ghl_attempt($config, fake_record($path), $path)['enquiry_evidence'];
      $delays = [$state['next_retry_at'] - time()];
      for ($i = 0; $i < 5; $i++) {
          fake_patch($path, ['enquiry_evidence' => ['next_retry_at' => 0] + fake_record($path)['enquiry_evidence']]);
          $state = dc_ghl_attempt($config, fake_record($path), $path)['enquiry_evidence'];
          if ($state['status'] === 'pending') $delays[] = $state['next_retry_at'] - time();
      }
      dc_ghl_retry_pending($config);
      $final = fake_record($path);
      echo json_encode([
          'final' => $final['enquiry_evidence'], 'delivery' => [$final['state'], $final['attempts']], 'owed' => dc_ghl_follow_up_at($final),
          'reads' => count(fake_calls('#^GET /contacts/contact-1$#')), 'tags' => count(fake_calls('#^POST /contacts/contact-1/tags$#')),
          'minutes' => array_map(fn ($seconds) => (int) round($seconds / 60), $delays), 'health' => $GLOBALS['fake']['health'],
      ]);
    `);
    expect(out.final).toMatchObject({ status: "failed", attempts: 6, next_retry_at: null, error: "enquiry contact read failed" });
    expect(out.minutes).toEqual([5, 30, 120, 720, 1440]);
    expect(out.reads).toBe(6);
    expect(out.owed).toBeNull();
    // The contact form itself stays delivered and tagged once.
    expect(out.delivery).toEqual(["delivered", 1]);
    expect(out.tags).toBe(1);
    expect(out.health).toEqual([{ event: "failed", form: "contact-form", stage: "ghl-delivery", category: "delivery", status: 0, path: "/server/ghl-quote" }]);
  });

  it("is never written for a price check", () => {
    const out = relay.run(`
      $path = fake_store($config, ['stage' => 'lead', 'first_clean_price' => null]);
      $record = dc_ghl_attempt($config, fake_record($path), $path);
      echo json_encode(['state' => $record['state'], 'evidence' => $record['enquiry_evidence'] ?? null, 'reads' => count(fake_calls('#^GET /contacts/contact-1$#'))]);
    `);
    expect(out).toEqual({ state: "delivered", evidence: null, reads: 0 });
  });
});
