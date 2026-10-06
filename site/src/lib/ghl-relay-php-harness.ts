import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

/**
 * Runs the real lead relay (public/api/ghl-quote.php with callback-task.php and
 * enquiry-evidence.php) against a scratch queue folder, with GoHighLevel and
 * mail() replaced by an in-process fake: no network, no email, no SiteGround.
 * Only dc_ghl_http and dc_ghl_office_send are swapped out; storage,
 * encryption, locking, retries and both helpers are the deployed code. Used by
 * the relay's *-php.test.ts files, which skip where PHP 8.2+ with OpenSSL is
 * not installed (locally: point PHPRC at a php.ini that enables openssl).
 */
export const API = resolve(__dirname, "..", "..", "public", "api");
export const hasRelayPhp =
  spawnSync("php", ["-r", 'exit(PHP_VERSION_ID >= 80200 && function_exists("openssl_encrypt") ? 0 : 1);']).status === 0;

/*
 * The fake. Calls are recorded as [method, path, body], and each office email
 * as a "MAIL office" call so tests can check the order; fake_fail() queues
 * statuses for the next calls matching a "METHOD /path" regex (-1 throws, as a
 * broken transport would); fake_on() runs a hook when a call matches. One
 * contact exists, "contact-1", with custom fields, notes, tags and tasks.
 */
const FAKE = String.raw`<?php
declare(strict_types=1);
$GLOBALS['fake'] = ['calls' => [], 'fail' => [], 'on' => [], 'tasks' => [], 'fields' => [], 'keep_puts' => true, 'mail' => [], 'mail_ok' => true, 'health' => []];
const FAKE_FIELD_KEYS = [
    'what_type_of_service_would_you_like', 'what_type_of_home_do_you_have', 'bedrooms_in_total', 'bathrooms', 'half_baths',
    'frequency_in_bookings', 'site_quoted_first_clean_price', 'site_quoted_recurring_price', 'selected_extras', 'quote_page_url',
    'funnel_last_step', 'site_booking_link', 'branch', 'branch_phone', 'lead_channel',
    'last_qualifying_enquiry_date', 'qualifying_enquiry_evidence',
];

function fake_fail(string $pattern, int ...$statuses): void { $GLOBALS['fake']['fail'][$pattern] = $statuses; }
function fake_on(string $pattern, callable $hook): void { $GLOBALS['fake']['on'][$pattern] = $hook; }

/** The GoHighLevel calls so far as "METHOD /path" lines, those matching $pattern only. */
function fake_calls(string $pattern = '/./'): array
{
    $lines = array_map(static fn (array $call): string => $call[0] . ' ' . $call[1], $GLOBALS['fake']['calls']);
    return array_values(array_filter($lines, static fn (string $line): bool => (bool) preg_match($pattern, $line)));
}

/** The bodies of the calls matching $pattern. */
function fake_bodies(string $pattern): array
{
    $calls = array_filter($GLOBALS['fake']['calls'], static fn (array $call): bool => (bool) preg_match($pattern, $call[0] . ' ' . $call[1]));
    return array_values(array_map(static fn (array $call) => $call[2], $calls));
}

function dc_ghl_http(string $url, string $method, array $headers, ?string $body = null): array
{
    $fake = &$GLOBALS['fake'];
    $path = (string) parse_url($url, PHP_URL_PATH);
    $data = $body === null ? null : json_decode($body, true);
    if (str_ends_with($path, '/form-health.php')) {
        $fake['health'][] = $data;
        return [200, '{"ok":true}', ''];
    }
    $fake['calls'][] = [$method, $path, $data];
    $line = $method . ' ' . $path;
    foreach ($fake['on'] as $pattern => $hook) if (preg_match($pattern, $line)) $hook();
    foreach ($fake['fail'] as $pattern => $statuses) {
        if ($statuses === [] || !preg_match($pattern, $line)) continue;
        $status = array_shift($fake['fail'][$pattern]);
        if ($status === -1) throw new RuntimeException('fake transport fault');
        return [$status, '{}', $status === 0 ? 'fake network error' : ''];
    }
    $json = static fn (int $status, array $value): array => [$status, json_encode($value, JSON_THROW_ON_ERROR), ''];
    if ($method === 'GET' && preg_match('#^/locations/[^/]+/customFields$#', $path)) {
        return $json(200, ['customFields' => array_map(static fn (string $key): array => ['id' => 'f-' . $key, 'fieldKey' => 'contact.' . $key], FAKE_FIELD_KEYS)]);
    }
    if ($method === 'POST' && $path === '/contacts/upsert') return $json(200, ['contact' => ['id' => 'contact-1']]);
    if (!preg_match('#^/contacts/contact-1(/tags|/notes|/tasks)?$#', $path, $match)) return $json(404, []);
    $tail = $match[1] ?? '';
    if ($tail === '/tags' || $tail === '/notes') return $json(200, []);
    if ($tail === '/tasks' && $method === 'GET') return $json(200, ['tasks' => $fake['tasks']]);
    if ($tail === '/tasks' && $method === 'POST') {
        $id = 'task-' . (count($fake['tasks']) + 1);
        $fake['tasks'][] = ['id' => $id] + $data;
        return $json(201, ['task' => ['id' => $id]]);
    }
    if ($method === 'PUT') {
        if ($fake['keep_puts']) foreach ($data['customFields'] ?? [] as $field) $fake['fields'][$field['id']] = $field['field_value'];
        return $json(200, []);
    }
    if ($method === 'GET') {
        $fields = [];
        foreach ($fake['fields'] as $id => $value) $fields[] = ['id' => $id, 'value' => $value];
        return $json(200, ['contact' => ['id' => 'contact-1', 'customFields' => $fields]]);
    }
    return $json(405, []);
}

function dc_ghl_office_send(array $config, ?array $message): bool
{
    $GLOBALS['fake']['calls'][] = ['MAIL', 'office', null];
    foreach ($GLOBALS['fake']['on'] as $pattern => $hook) if (preg_match($pattern, 'MAIL office')) $hook();
    $GLOBALS['fake']['mail'][] = $message['subject'] ?? '(no message)';
    return $GLOBALS['fake']['mail_ok'];
}

/** A funnel submission as the receiver validates it; confirmed unless overridden. */
function fake_submission(array $overrides = []): array
{
    return dc_ghl_payload($overrides + [
        'request_id' => 'dc-test-' . bin2hex(random_bytes(8)),
        'stage' => 'confirm',
        'source' => 'dutycleaners.ca instant quote',
        'full_name' => 'Test Customer',
        'email' => 'test@example.com',
        'phone' => '780 555 0100',
        'city' => 'edmonton',
        'service' => 'Standard Cleaning',
        'first_clean_price' => 169,
    ]);
}

/** Store a submission the way the receiver does; returns the record path. */
function fake_store(array $config, array $overrides = []): string
{
    [, $path] = dc_ghl_store($config, fake_submission($overrides));
    return $path;
}

function fake_record(string $path): array { return json_decode((string) file_get_contents($path), true); }
function fake_patch(string $path, array $changes): void { dc_ghl_write_record($path, array_replace(fake_record($path), $changes)); }

/** A delivered price-check lead whose visitor went quiet $quietFor seconds ago; returns the session path. */
function fake_quiet_visit(array $config, int $quietFor = 600): string
{
    $payload = fake_submission(['stage' => 'lead', 'first_clean_price' => null, 'session_id' => 'visit-' . bin2hex(random_bytes(6))]);
    [$record, $path] = dc_ghl_store($config, $payload);
    dc_ghl_write_record($path, ['state' => 'delivered', 'contact_id' => 'contact-1'] + $record);
    dc_ghl_session_record($config, $payload, $path);
    $session = dc_ghl_session_path($config, $payload['session_id']);
    fake_session_patch($session, ['last_seen' => time() - $quietFor]);
    return $session;
}

function fake_session(string $path): array { return json_decode((string) file_get_contents($path), true); }
function fake_session_patch(string $path, array $changes): void { dc_ghl_session_update($path, static fn (?array $session): array => array_replace((array) $session, $changes)); }
`;

const php = (value: string) => JSON.stringify(value);

function swap(source: string, from: string, to: string): string {
  const parts = source.split(from);
  if (parts.length !== 2) throw new Error(`harness: expected "${from}" once in ghl-quote.php, found ${parts.length - 1}`);
  return parts.join(to);
}

export interface RelayHarness {
  /** The scratch folder: queue/, resume/ and the swapped relay live here. */
  dir: string;
  queue: string;
  /** Runs PHP after the relay is loaded and `$config` is set; returns what it echoes, parsed as JSON. */
  run: <T = any>(body: string) => T;
  cleanup: () => void;
}

export function relayHarness(): RelayHarness {
  const dir = mkdtempSync(join(tmpdir(), "dc-relay-"));
  const queue = join(dir, "queue");
  mkdirSync(join(queue, "sessions"), { recursive: true });
  let relay = readFileSync(join(API, "ghl-quote.php"), "utf8");
  relay = swap(relay, "function dc_ghl_http(", "function dc_ghl_http_unused(");
  relay = swap(relay, "function dc_ghl_office_send(", "function dc_ghl_office_send_unused(");
  writeFileSync(join(dir, "ghl-quote.php"), relay);
  for (const helper of ["callback-task.php", "enquiry-evidence.php"]) copyFileSync(join(API, helper), join(dir, helper));
  writeFileSync(join(dir, "fake-ghl.php"), FAKE);
  writeFileSync(join(dir, "form-health-config.php"), `<?php return ['shared_secret' => '${"s".repeat(40)}'];`);
  const config = `[
    'token' => 'fake-token-0123456789-0123456789-abcdef',
    'encryption_key' => 'fake-encryption-key-0123456789-abcdef',
    'queue_dir' => ${php(queue)},
    'resume_dir' => ${php(join(dir, "resume"))},
    'form_health_config' => ${php(join(dir, "form-health-config.php"))},
    'form_health_url' => 'https://fake.invalid/api/form-health.php',
  ]`;
  let n = 0;
  return {
    dir,
    queue,
    run: (body) => {
      const file = join(dir, `case-${++n}.php`);
      writeFileSync(file, `<?php\ndeclare(strict_types=1);\nrequire __DIR__ . '/fake-ghl.php';\nrequire __DIR__ . '/ghl-quote.php';\n$config = ${config};\n${body}\n`);
      const result = spawnSync("php", [file], { env: { ...process.env, DC_GHL_LIBRARY_ONLY: "1" }, encoding: "utf8" });
      if (result.status !== 0 || result.stdout.trim() === "") throw new Error(`PHP failed:\n${result.stderr}\n${result.stdout}`);
      try {
        return JSON.parse(result.stdout);
      } catch {
        throw new Error(`PHP printed more than its JSON (a warning?):\n${result.stdout}`);
      }
    },
    cleanup: () => rmSync(dir, { recursive: true, force: true }),
  };
}
