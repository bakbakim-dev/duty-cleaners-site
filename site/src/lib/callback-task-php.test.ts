import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hasRelayPhp, relayHarness, type RelayHarness } from "./ghl-relay-php-harness";

/**
 * Call-back tasks (callback-task.php, live since 2026-10-02, reviewed
 * 2026-10-06). Each new call-back request becomes one GoHighLevel task for the
 * office: Sherree on weekdays, Gelica at weekends, due at the next open hour in
 * Edmonton (call-back hours, owner 2026-10-06: Mon-Fri 8:00-20:00, Saturday
 * 8:00-18:00, Sunday 9:00-15:00). A task is never posted twice: the intent is
 * saved first, and a lost acknowledgement is looked up, never re-posted. A task
 * that cannot be made is retried at most six times and reported to form-health
 * like a failed delivery. Runs the real PHP with GoHighLevel faked; skipped
 * where PHP with OpenSSL is not installed.
 */
const SHERREE = "Q025D9sWDzPXv3HxAI9f";
const GELICA = "VN18G5NOq8hFMxzETT49";
const CALL_BACK = "'source' => 'dutycleaners.ca instant quote (call-back requested)'";

let relay: RelayHarness;
beforeEach(() => {
  if (hasRelayPhp) relay = relayHarness();
});
afterEach(() => relay?.cleanup());

describe.skipIf(!hasRelayPhp)("call-back tasks", () => {
  it("are due at the next open call-back hour, Sherree's on weekdays and Gelica's at weekends", () => {
    const cases: [received: string, due: string, owner: string][] = [
      ["2026-10-02T12:00:00-06:00", "2026-10-02T18:00:00Z", SHERREE], // Friday noon: now
      ["2026-10-02T07:00:00-06:00", "2026-10-02T14:00:00Z", SHERREE], // Friday before opening: 8:00
      ["2026-10-02T19:59:00-06:00", "2026-10-03T01:59:00Z", SHERREE], // Friday 19:59: still open
      ["2026-10-02T20:00:00-06:00", "2026-10-03T14:00:00Z", GELICA], // Friday 20:00: Saturday 8:00
      ["2026-10-03T17:30:00-06:00", "2026-10-03T23:30:00Z", GELICA], // Saturday 17:30: now
      ["2026-10-03T18:00:00-06:00", "2026-10-04T15:00:00Z", GELICA], // Saturday 18:00: Sunday 9:00
      ["2026-10-03T19:30:00-06:00", "2026-10-04T15:00:00Z", GELICA], // Saturday 19:30: Sunday 9:00
      ["2026-10-04T08:59:00-06:00", "2026-10-04T15:00:00Z", GELICA], // Sunday before opening: 9:00
      ["2026-10-04T15:00:00-06:00", "2026-10-05T14:00:00Z", SHERREE], // Sunday 15:00: Monday 8:00
      ["2026-11-01T00:00:00-06:00", "2026-11-01T16:00:00Z", GELICA], // the night the clocks go back
      ["2027-03-14T00:00:00-07:00", "2027-03-14T15:00:00Z", GELICA], // the night the clocks go forward
    ];
    const slots = relay.run<{ dueDate: string; assignedTo: string }[]>(
      `echo json_encode(array_map('dc_callback_slot', ${JSON.stringify(cases.map(([received]) => received))}));`,
    );
    expect(slots.map((slot) => [slot.dueDate, slot.assignedTo])).toEqual(cases.map(([, due, owner]) => [due, owner]));
  });

  it("save their intent before posting and are never posted twice", () => {
    const out = relay.run(`
      $requests = []; $writes = [];
      $http = function (string $method, string $path, ?array $body) use (&$requests): array {
          $requests[] = $method;
          return $method === 'GET' ? [200, ['tasks' => []]] : [201, ['task' => ['id' => 'task-test']]];
      };
      $save = function (array $state) use (&$writes): void { $writes[] = $state['status']; };
      $first = dc_callback_task('contact-1', 'request-1', '2026-10-02T12:00:00-06:00', [], $http, $save);
      $before = count($requests);
      $again = dc_callback_task('contact-1', 'request-1', '2026-10-02T12:00:00-06:00', $first, $http, $save);
      echo json_encode(['first' => $first, 'requests' => $requests, 'writes' => $writes, 'repeat' => count($requests) - $before, 'again' => $again['task_id']]);
    `);
    expect(out.first).toMatchObject({ status: "saved", task_id: "task-test", assignedTo: SHERREE });
    expect(out.requests).toEqual(["GET", "POST"]);
    expect(out.writes).toEqual(["posting", "saved"]);
    expect(out.repeat).toBe(0);
    expect(out.again).toBe("task-test");
  });

  it("look a lost acknowledgement up and never post blindly", () => {
    const out = relay.run(`
      $requests = []; $tasks = [];
      $http = function (string $method, string $path, ?array $body) use (&$requests, &$tasks): array {
          $requests[] = $method;
          return $method === 'GET' ? [200, ['tasks' => $tasks]] : [0, []];
      };
      $save = function (array $state): void {};
      $at = '2026-10-02T12:00:00-06:00';
      $lost = dc_callback_task('contact-1', 'request-2', $at, [], $http, $save);
      $requests = [];
      $checked = dc_callback_task('contact-1', 'request-2', $at, $lost, $http, $save);
      $lookupOnly = $requests;
      $tasks = [['id' => 'task-found', 'body' => $lost['marker'], 'completed' => true]];
      $found = dc_callback_task('contact-1', 'request-2', $at, $lost, $http, $save);
      $tasks[] = $tasks[0];
      $twice = dc_callback_task('contact-1', 'request-2', $at, [], $http, $save);
      $tasks = [];
      $denied = dc_callback_task('contact-1', 'request-3', $at, [], fn () => [403, []], $save);
      $requests = [];
      try {
          dc_callback_task('contact-1', 'request-4', $at, [], $http, function (): void { throw new RuntimeException('disk full'); });
      } catch (RuntimeException) {}
      echo json_encode([
          'lost' => $lost['status'], 'checked' => $checked['status'], 'lookupOnly' => $lookupOnly,
          'found' => [$found['status'], $found['task_id']], 'twice' => $twice['status'],
          'denied' => [$denied['status'], $denied['issue']], 'unsaved' => $requests,
      ]);
    `);
    expect(out.lost).toBe("uncertain");
    expect(out.checked).toBe("uncertain");
    expect(out.lookupOnly).toEqual(["GET"]);
    // A task the office already completed is recognised, not reopened.
    expect(out.found).toEqual(["saved", "task-found"]);
    expect(out.twice).toBe("review");
    expect(out.denied).toEqual(["pending", "task lookup unavailable"]);
    // No durable intent, no POST.
    expect(out.unsaved).toEqual(["GET"]);
  });

  it("are made by the relay once per new call-back, after its tags, routed by when they are made", () => {
    const out = relay.run(`
      $path = fake_store($config, [${CALL_BACK}]);
      $before = dc_callback_slot(gmdate('c'));
      $record = dc_ghl_attempt($config, fake_record($path), $path);
      $after = dc_callback_slot(gmdate('c'));
      $first = fake_calls();
      dc_ghl_attempt($config, fake_record($path), $path);
      $repeat = array_slice(fake_calls(), count($first));
      $old = fake_store($config, [${CALL_BACK}, 'request_id' => 'dc-test-historical-receipt']);
      $historical = fake_record($old);
      unset($historical['callback_requested'], $historical['callback_task']);
      dc_ghl_write_record($old, $historical);
      $n = count(fake_calls());
      dc_ghl_attempt($config, fake_record($old), $old);
      echo json_encode([
          'record' => array_diff_key($record, ['payload' => 1]), 'first' => $first, 'repeat' => $repeat,
          'historical' => count(array_filter(array_slice(fake_calls(), $n), fn ($call) => str_ends_with($call, '/tasks'))),
          'posted' => fake_bodies('#^POST /contacts/contact-1/tasks$#'), 'slots' => [$before, $after],
      ]);
    `);
    expect(out.record).toMatchObject({ state: "delivered", attempts: 1, callback_task: { status: "saved", task_id: "task-1", attempts: 1 } });
    const tags = out.first.indexOf("POST /contacts/contact-1/tags");
    expect(tags).toBeGreaterThan(-1);
    expect(out.first.indexOf("GET /contacts/contact-1/tasks")).toBeGreaterThan(tags);
    expect(out.first.filter((call: string) => call === "POST /contacts/contact-1/tasks")).toHaveLength(1);
    expect(out.posted).toHaveLength(1);
    // Routed by the time the task is made (an outage can push it into another shift).
    const slot = out.slots.find((s: { dueDate: string }) => s.dueDate === out.posted[0].dueDate);
    expect(slot, "the task is due at the slot for the time it was made").toBeDefined();
    expect(out.posted[0].assignedTo).toBe(slot.assignedTo);
    expect([SHERREE, GELICA]).toContain(out.posted[0].assignedTo);
    // Nothing is replayed once the task exists.
    expect(out.repeat).toEqual([]);
    // Receipts stored before call-back tasks existed never get one.
    expect(out.historical).toBe(0);
  });

  it("that cannot be made are retried every five minutes, six tries at most, and reported to form-health", () => {
    const out = relay.run(`
      fake_fail('#^GET /contacts/contact-1/tasks$#', ...array_fill(0, 10, 403));
      $path = fake_store($config, [${CALL_BACK}]);
      $first = dc_ghl_attempt($config, fake_record($path), $path)['callback_task'];
      $states = [];
      for ($i = 0; $i < 7; $i++) {
          fake_patch($path, ['callback_task' => ['next_retry_at' => 0] + fake_record($path)['callback_task']]);
          $states[] = dc_ghl_attempt($config, fake_record($path), $path)['callback_task']['status'];
      }
      $final = fake_record($path);
      echo json_encode([
          'first' => $first, 'states' => $states, 'final' => $final['callback_task'], 'owed' => dc_ghl_follow_up_at($final),
          'lookups' => count(fake_calls('#^GET /contacts/contact-1/tasks$#')), 'posts' => count(fake_calls('#^POST /contacts/contact-1/tasks$#')),
          'upserts' => count(fake_calls('#^POST /contacts/upsert$#')), 'health' => $GLOBALS['fake']['health'], 'now' => time(),
      ]);
    `);
    expect(out.first).toMatchObject({ status: "pending", attempts: 1, issue: "task lookup unavailable" });
    expect(out.first.next_retry_at - out.now).toBeGreaterThanOrEqual(299);
    expect(out.states).toEqual(["pending", "pending", "pending", "pending", "review", "review", "review"]);
    expect(out.final).toMatchObject({ status: "review", attempts: 6 });
    expect(out.lookups).toBe(6);
    expect(out.posts).toBe(0);
    expect(out.owed).toBeNull();
    // The lead itself was delivered once and never replayed.
    expect(out.upserts).toBe(1);
    expect(out.health).toHaveLength(6);
    for (const event of out.health) {
      expect(event).toEqual({ event: "failed", form: "quote-funnel", stage: "callback", category: "delivery", status: 0, path: "/server/ghl-quote" });
    }
  });

  it("treat a fault inside the task step as one failed try, never the end of the cron run", () => {
    const out = relay.run(`
      fake_fail('#^GET /contacts/contact-1/tasks$#', -1);
      $path = fake_store($config, [${CALL_BACK}]);
      $fault = dc_ghl_attempt($config, fake_record($path), $path)['callback_task'];
      fake_patch($path, ['callback_task' => ['next_retry_at' => 0] + fake_record($path)['callback_task']]);
      $cron = dc_ghl_retry_pending($config);
      echo json_encode(['fault' => $fault, 'cron' => $cron, 'final' => fake_record($path)['callback_task'], 'health' => array_column($GLOBALS['fake']['health'], 'event')]);
    `);
    expect(out.fault).toMatchObject({ status: "pending", attempts: 1, issue: "task attempt failed" });
    expect(out.cron).toMatchObject({ ok: true, checked: 1, delivered: 1 });
    expect(out.final).toMatchObject({ status: "saved", attempts: 2, task_id: "task-1" });
    expect(out.health).toEqual(["failed", "recovered"]);
  });
});
