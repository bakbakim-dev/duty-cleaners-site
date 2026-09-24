<?php
declare(strict_types=1);

/*
 * Duty Cleaners' SiteGround-native lead receiver.
 *
 * A submission is encrypted and durably written outside public_html before a
 * success receipt is returned. GHL delivery is then attempted immediately.
 * Failed deliveries stay queued for the SiteGround cron job to retry.
 */

const DC_GHL_LOCATION_ID = '4OROmtMn8LQqaDsUJPjC';
const DC_GHL_API = 'https://services.leadconnectorhq.com';
const DC_GHL_VERSION = '2021-07-28';
const DC_GHL_MAX_ATTEMPTS = 6;
const DC_GHL_RETRY_MINUTES = [5, 30, 120, 720, 1440, 2880];
const DC_GHL_ALLOWED_ORIGINS = [
    'https://dutycleaners.ca',
    'https://www.dutycleaners.ca',
    'https://duty-cleaners-preview.netlify.app',
    'https://mikaily131.sg-host.com',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
];
const DC_GHL_FIELD_MAP = [
    'contact.what_type_of_service_would_you_like' => 'service',
    'contact.what_type_of_home_do_you_have' => 'home_type',
    'contact.bedrooms_in_total' => 'bedrooms',
    'contact.bathrooms' => 'full_bathrooms',
    'contact.half_baths' => 'half_baths',
    'contact.frequency_in_bookings' => 'frequency',
    'contact.site_quoted_first_clean_price' => 'first_clean_price',
    'contact.site_quoted_recurring_price' => 'recurring_price',
    'contact.selected_extras' => 'addons',
    'contact.quote_page_url' => 'page_url',
];

function dc_ghl_json(int $status, array $body): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($body, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

/**
 * Return a durable receipt before contacting HighLevel.
 *
 * A normal quote delivery makes at least two upstream API calls (contact
 * upsert, then tag add). Waiting for both calls can exceed the browser's
 * bounded request time even though the encrypted queue write succeeded. On
 * PHP-FPM, finish the customer response first and continue delivery after the
 * connection closes. Other SAPIs (SiteGround's among them) leave the record
 * pending: the browser's follow-up "deliver" request delivers it within
 * seconds, and the five-minute retry cron catches anything that misses.
 */
function dc_ghl_accept_then_deliver(array $config, array $record, string $path): never
{
    http_response_code(202);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    $body = json_encode([
        'ok' => true,
        'stored' => true,
        'delivery' => 'pending',
        'status' => 202,
        'receiptId' => $record['receipt_id'],
        'contactId' => $record['contact_id'] ?? null,
    ], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    header('Content-Length: ' . strlen($body));
    echo $body;

    if (function_exists('fastcgi_finish_request')) {
        fastcgi_finish_request();
        ignore_user_abort(true);
        dc_ghl_attempt($config, $record, $path);
    }
    exit;
}

function dc_ghl_private_root(): string
{
    $documentRoot = (string) ($_SERVER['DOCUMENT_ROOT'] ?? '');
    return $documentRoot !== '' ? dirname($documentRoot) : dirname(__DIR__, 2);
}

function dc_ghl_config(): array
{
    $explicit = getenv('DC_GHL_CONFIG') ?: '';
    $path = $explicit !== '' ? $explicit : dc_ghl_private_root() . '/private/ghl-config.php';
    if (!is_file($path)) throw new RuntimeException('unconfigured');
    $config = require $path;
    if (!is_array($config)) throw new RuntimeException('unconfigured');
    $required = ['token', 'encryption_key'];
    foreach ($required as $key) {
        if (!is_string($config[$key] ?? null) || strlen($config[$key]) < 32) {
            throw new RuntimeException('unconfigured');
        }
    }
    $config['queue_dir'] = is_string($config['queue_dir'] ?? null) && $config['queue_dir'] !== ''
        ? $config['queue_dir']
        : dc_ghl_private_root() . '/private/ghl-queue';
    return $config;
}

function dc_ghl_text(mixed $value, int $max, bool $required = false): string
{
    if ($value === null && !$required) return '';
    if (!is_string($value)) throw new InvalidArgumentException('invalid');
    $value = trim($value);
    if (($required && $value === '') || strlen($value) > $max) {
        throw new InvalidArgumentException('invalid');
    }
    return $value;
}

function dc_ghl_number(mixed $value): int|float|null
{
    if ($value === null) return null;
    if (!is_int($value) && !is_float($value)) throw new InvalidArgumentException('invalid');
    if (!is_finite((float) $value) || abs((float) $value) > 1000000) {
        throw new InvalidArgumentException('invalid');
    }
    return $value;
}

function dc_ghl_payload_request_id(mixed $value): string
{
    $requestId = dc_ghl_text($value, 100, true);
    if (!preg_match('/^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|dc-[A-Za-z0-9-]{12,80})$/i', $requestId)) {
        throw new InvalidArgumentException('invalid');
    }
    return $requestId;
}

function dc_ghl_payload(mixed $input): array
{
    if (!is_array($input) || array_is_list($input)) throw new InvalidArgumentException('invalid');
    $requestId = dc_ghl_payload_request_id($input['request_id'] ?? '');
    $email = dc_ghl_text($input['email'] ?? '', 200, true);
    if (filter_var($email, FILTER_VALIDATE_EMAIL) === false) throw new InvalidArgumentException('invalid');
    $phone = dc_ghl_text($input['phone'] ?? '', 40, true);
    if (strlen((string) preg_replace('/\D/', '', $phone)) < 7) throw new InvalidArgumentException('invalid');

    $stage = dc_ghl_text($input['stage'] ?? 'lead', 10, true);
    if (!in_array($stage, ['lead', 'confirm'], true)) throw new InvalidArgumentException('invalid');
    $intent = $input['intent'] ?? null;
    if ($intent !== null && $intent !== 'deep') throw new InvalidArgumentException('invalid');

    $addons = $input['addons'] ?? [];
    if (!is_array($addons) || count($addons) > 40) throw new InvalidArgumentException('invalid');
    $cleanAddons = [];
    foreach ($addons as $addon) $cleanAddons[] = dc_ghl_text($addon, 600, true);

    $tracking = $input['tracking'] ?? [];
    if (!is_array($tracking) || ($tracking !== [] && array_is_list($tracking)) || count($tracking) > 30) {
        throw new InvalidArgumentException('invalid');
    }
    $cleanTracking = [];
    foreach ($tracking as $key => $value) {
        if (!is_string($key) || strlen($key) > 80 || !is_string($value) || strlen($value) > 500) {
            throw new InvalidArgumentException('invalid');
        }
        $cleanTracking[$key] = $value;
    }

    $sessionId = dc_ghl_session_id($input['session_id'] ?? '');

    $openedAt = $input['formOpenedAt'] ?? null;
    if ($openedAt !== null && !is_int($openedAt) && !is_float($openedAt)) {
        throw new InvalidArgumentException('invalid');
    }

    return [
        'request_id' => $requestId,
        'stage' => $stage,
        'city' => dc_ghl_text($input['city'] ?? '', 80),
        'service' => dc_ghl_text($input['service'] ?? '', 200),
        'home_type' => dc_ghl_text($input['home_type'] ?? '', 200),
        'bedrooms' => dc_ghl_text(isset($input['bedrooms']) ? (string) $input['bedrooms'] : '', 200),
        'full_bathrooms' => dc_ghl_text(isset($input['full_bathrooms']) ? (string) $input['full_bathrooms'] : '', 200),
        'half_baths' => dc_ghl_text(isset($input['half_baths']) ? (string) $input['half_baths'] : '', 200),
        'frequency' => dc_ghl_text($input['frequency'] ?? '', 200),
        'frequency_discount_pct' => dc_ghl_number($input['frequency_discount_pct'] ?? null),
        'addons' => $cleanAddons,
        'first_clean_price' => dc_ghl_number($input['first_clean_price'] ?? null),
        'recurring_price' => dc_ghl_number($input['recurring_price'] ?? null),
        'currency' => dc_ghl_text($input['currency'] ?? 'CAD', 8),
        'full_name' => dc_ghl_text($input['full_name'] ?? '', 120, true),
        'email' => strtolower($email),
        'phone' => $phone,
        'page_url' => dc_ghl_text($input['page_url'] ?? '', 2000),
        'submitted_at' => dc_ghl_text($input['submitted_at'] ?? '', 40),
        'source' => dc_ghl_text($input['source'] ?? 'dutycleaners.ca website', 120),
        'website' => dc_ghl_text($input['website'] ?? '', 200),
        'formOpenedAt' => $openedAt,
        'notes' => dc_ghl_text($input['notes'] ?? '', 2000),
        'intent' => $intent,
        'tracking' => $cleanTracking,
        'session_id' => $sessionId,
    ];
}

/** The funnel's per-visit id: random, no personal data. Empty when absent. */
function dc_ghl_session_id(mixed $value): string
{
    if ($value === null || $value === '') return '';
    if (!is_string($value) || !preg_match('/^[A-Za-z0-9-]{8,80}$/', $value)) throw new InvalidArgumentException('invalid');
    return $value;
}

function dc_ghl_e164(string $phone): string
{
    if (str_starts_with(trim($phone), '+')) return '+' . preg_replace('/\D/', '', substr(trim($phone), 1));
    $digits = (string) preg_replace('/\D/', '', $phone);
    if (strlen($digits) === 10) return '+1' . $digits;
    if (strlen($digits) === 11 && str_starts_with($digits, '1')) return '+' . $digits;
    return '+' . $digits;
}

function dc_ghl_encrypt(array $payload, string $secret): array
{
    $iv = random_bytes(12);
    $tag = '';
    $key = hash('sha256', 'duty-cleaners-ghl-queue:' . $secret, true);
    $plain = json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $cipher = openssl_encrypt($plain, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag, 'duty-cleaners-ghl:v1', 16);
    if ($cipher === false) throw new RuntimeException('storage');
    return ['iv' => base64_encode($iv), 'data' => base64_encode($cipher), 'tag' => base64_encode($tag)];
}

function dc_ghl_decrypt(array $encrypted, string $secret): array
{
    $key = hash('sha256', 'duty-cleaners-ghl-queue:' . $secret, true);
    $iv = base64_decode((string) ($encrypted['iv'] ?? ''), true);
    $cipher = base64_decode((string) ($encrypted['data'] ?? ''), true);
    $tag = base64_decode((string) ($encrypted['tag'] ?? ''), true);
    if ($iv === false || $cipher === false || $tag === false) throw new RuntimeException('storage');
    $plain = openssl_decrypt($cipher, 'aes-256-gcm', $key, OPENSSL_RAW_DATA, $iv, $tag, 'duty-cleaners-ghl:v1');
    if ($plain === false) throw new RuntimeException('storage');
    $payload = json_decode($plain, true, 32, JSON_THROW_ON_ERROR);
    if (!is_array($payload)) throw new RuntimeException('storage');
    return $payload;
}

function dc_ghl_queue_dir(array $config): string
{
    $dir = rtrim((string) $config['queue_dir'], DIRECTORY_SEPARATOR);
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        throw new RuntimeException('storage');
    }
    return $dir;
}

function dc_ghl_rate_limited(array $config): bool
{
    $forwarded = (string) ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '');
    $ip = trim(explode(',', $forwarded)[0] ?: (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    $key = hash_hmac('sha256', $ip, $config['encryption_key']);
    $path = dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . 'rate-limit.json';
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) return false;
    try {
        $raw = stream_get_contents($handle);
        $state = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
        if (!is_array($state)) $state = [];
        $now = time();
        foreach ($state as $hash => $timestamps) {
            if (!is_array($timestamps)) {
                unset($state[$hash]);
                continue;
            }
            $state[$hash] = array_values(array_filter($timestamps, static fn ($time) => is_int($time) && $time > $now - 60));
            if ($state[$hash] === []) unset($state[$hash]);
        }
        $recent = $state[$key] ?? [];
        $limited = count($recent) >= 8;
        if (!$limited) $recent[] = $now;
        $state[$key] = $recent;
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($state, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
        fflush($handle);
        @chmod($path, 0600);
        return $limited;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function dc_ghl_record_path(array $config, string $requestId): string
{
    return dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . hash_hmac('sha256', $requestId, $config['encryption_key']) . '.json';
}

function dc_ghl_stable_payload(array $payload): string
{
    unset($payload['submitted_at']);
    ksort($payload);
    return json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
}

function dc_ghl_store(array $config, array $payload): array
{
    $path = dc_ghl_record_path($config, $payload['request_id']);
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) throw new RuntimeException('storage');
    try {
        $raw = stream_get_contents($handle);
        if (is_string($raw) && $raw !== '') {
            $record = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
            if (!is_array($record)) throw new RuntimeException('storage');
            $existing = dc_ghl_decrypt((array) ($record['payload'] ?? []), $config['encryption_key']);
            if (!hash_equals(dc_ghl_stable_payload($existing), dc_ghl_stable_payload($payload))) {
                throw new DomainException('conflict');
            }
            return [$record, $path];
        }
        $now = gmdate('c');
        $record = [
            'version' => 1,
            'receipt_id' => bin2hex(random_bytes(16)),
            'created_at' => $now,
            'updated_at' => $now,
            'state' => 'pending',
            'attempts' => 0,
            'next_retry_at' => time(),
            'last_status' => 0,
            'contact_id' => null,
            'last_error' => null,
            'payload' => dc_ghl_encrypt($payload, $config['encryption_key']),
        ];
        rewind($handle);
        ftruncate($handle, 0);
        if (fwrite($handle, json_encode($record, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR)) === false) {
            throw new RuntimeException('storage');
        }
        fflush($handle);
        if (function_exists('fsync')) fsync($handle);
        @chmod($path, 0600);
        return [$record, $path];
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function dc_ghl_write_record(string $path, array $record): void
{
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) throw new RuntimeException('storage');
    try {
        rewind($handle);
        ftruncate($handle, 0);
        if (fwrite($handle, json_encode($record, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR)) === false) {
            throw new RuntimeException('storage');
        }
        fflush($handle);
        if (function_exists('fsync')) fsync($handle);
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function dc_ghl_http(string $url, string $method, array $headers, ?string $body = null): array
{
    if (!function_exists('curl_init')) throw new RuntimeException('curl unavailable');
    $curl = curl_init($url);
    if ($curl === false) throw new RuntimeException('curl unavailable');
    curl_setopt_array($curl, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_TIMEOUT => 12,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_POSTFIELDS => $body,
    ]);
    $response = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    $error = curl_error($curl);
    curl_close($curl);
    return [$status, is_string($response) ? $response : '', $error];
}

function dc_ghl_field_ids(array $config): array
{
    $cachePath = dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . 'field-cache.json';
    if (is_file($cachePath) && filemtime($cachePath) !== false && filemtime($cachePath) > time() - 21600) {
        $cached = json_decode((string) file_get_contents($cachePath), true);
        if (is_array($cached) && count($cached) === count(DC_GHL_FIELD_MAP)) return $cached;
    }
    [$status, $body] = dc_ghl_http(
        DC_GHL_API . '/locations/' . DC_GHL_LOCATION_ID . '/customFields',
        'GET',
        ['Authorization: Bearer ' . $config['token'], 'Version: ' . DC_GHL_VERSION, 'Accept: application/json']
    );
    if ($status < 200 || $status >= 300) throw new RuntimeException('custom fields ' . $status);
    $json = json_decode($body, true, 32, JSON_THROW_ON_ERROR);
    $byKey = [];
    foreach (($json['customFields'] ?? []) as $field) {
        if (is_array($field) && is_string($field['fieldKey'] ?? null) && is_string($field['id'] ?? null)) {
            $byKey[$field['fieldKey']] = $field['id'];
        }
    }
    $resolved = [];
    foreach (DC_GHL_FIELD_MAP as $fieldKey => $_payloadKey) {
        if (!isset($byKey[$fieldKey])) throw new RuntimeException('missing custom field');
        $resolved[$fieldKey] = $byKey[$fieldKey];
    }
    @file_put_contents($cachePath, json_encode($resolved, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR), LOCK_EX);
    @chmod($cachePath, 0600);
    return $resolved;
}

function dc_ghl_custom_value(mixed $value): string
{
    if ($value === null) return '';
    if (is_array($value)) return implode('; ', array_map('strval', $value));
    return (string) $value;
}

function dc_ghl_headers(array $config): array
{
    return [
        'Authorization: Bearer ' . $config['token'],
        'Version: ' . DC_GHL_VERSION,
        'Accept: application/json',
        'Content-Type: application/json',
    ];
}

/** Best effort: a tag that is already absent is not an error. */
function dc_ghl_remove_tags(array $headers, string $contactId, array $tags): void
{
    dc_ghl_http(
        DC_GHL_API . '/contacts/' . rawurlencode($contactId) . '/tags',
        'DELETE',
        $headers,
        json_encode(['tags' => $tags], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
    );
}

/*
 * Leave detection (owner, 2026-09-23). The funnel reports "still here" about
 * once a minute while someone is actively using it (quote-presence.ts). When
 * those reports stop for DC_GHL_QUIET_SECONDS and the visit never reached the
 * booking page or a call-back, the visitor has left: this server emails the
 * office (dc_ghl_office_alert), then the contact gets the funnel_last_step
 * field and the quote-left tag, which starts the "Price-check left" workflow
 * (Text 1 in texting hours, then the quote follow-up).
 * Session files hold no personal data: state, step, times and the lead's
 * queue file name.
 */
const DC_GHL_QUIET_SECONDS = 300;
const DC_GHL_SESSION_TTL_SECONDS = 172800;
const DC_GHL_STEPS = ['price' => 'the price screen', 'details' => 'the last details screen'];

function dc_ghl_session_path(array $config, string $sessionId): string
{
    $dir = dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . 'sessions';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) throw new RuntimeException('storage');
    return $dir . DIRECTORY_SEPARATOR . hash_hmac('sha256', 'session:' . $sessionId, $config['encryption_key']) . '.json';
}

/**
 * Read-modify-write one session under a lock. $change receives the current
 * session (null when none) and returns the new one, or null to leave it.
 */
function dc_ghl_session_update(string $path, callable $change): ?array
{
    $handle = @fopen($path, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) return null;
    try {
        $raw = stream_get_contents($handle);
        $current = is_string($raw) && $raw !== '' ? json_decode($raw, true) : null;
        $next = $change(is_array($current) ? $current : null);
        if (!is_array($next)) return is_array($current) ? $current : null;
        rewind($handle);
        ftruncate($handle, 0);
        fwrite($handle, json_encode($next, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
        fflush($handle);
        @chmod($path, 0600);
        return $next;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

/** A stored funnel submission opens (lead) or closes (confirm) its session. */
function dc_ghl_session_record(array $config, array $payload, string $recordPath): void
{
    if (($payload['session_id'] ?? '') === '' || str_starts_with($payload['source'], 'contact-form')) return;
    $now = time();
    dc_ghl_session_update(dc_ghl_session_path($config, $payload['session_id']), static function (?array $session) use ($payload, $recordPath, $now) {
        $session ??= ['created_at' => $now];
        if ($payload['stage'] === 'confirm') {
            $session['state'] = 'confirmed';
        } else {
            $session['state'] = 'open';
            $session['step'] = 'price';
            $session['lead'] = basename($recordPath);
        }
        $session['last_seen'] = $now;
        return $session;
    });
}

/** "Still here" from the funnel. Only an open session can be kept alive. */
function dc_ghl_session_ping(array $config, string $sessionId, string $step): void
{
    if (!isset(DC_GHL_STEPS[$step])) throw new InvalidArgumentException('invalid');
    $path = dc_ghl_session_path($config, $sessionId);
    if (!is_file($path)) return;
    dc_ghl_session_update($path, static function (?array $session) use ($step) {
        if (($session['state'] ?? '') !== 'open') return null;
        $session['last_seen'] = time();
        $session['step'] = $step;
        return $session;
    });
}

/** A custom field that may not exist yet in GoHighLevel: null, never an error. */
function dc_ghl_optional_field_id(array $config, string $fieldKey): ?string
{
    $cachePath = dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . 'field-cache-optional.json';
    $cached = is_file($cachePath) ? json_decode((string) file_get_contents($cachePath), true) : null;
    if (is_array($cached) && (int) ($cached['at'] ?? 0) > time() - 21600 && array_key_exists($fieldKey, (array) ($cached['ids'] ?? []))) {
        return $cached['ids'][$fieldKey];
    }
    [$status, $body] = dc_ghl_http(
        DC_GHL_API . '/locations/' . DC_GHL_LOCATION_ID . '/customFields',
        'GET',
        ['Authorization: Bearer ' . $config['token'], 'Version: ' . DC_GHL_VERSION, 'Accept: application/json']
    );
    if ($status < 200 || $status >= 300) return null;
    // Remember every field this lookup saw, so a batch of optional fields
    // costs one request per cache period instead of one each.
    $ids = is_array($cached['ids'] ?? null) ? $cached['ids'] : [];
    foreach ((json_decode($body, true)['customFields'] ?? []) as $field) {
        if (is_array($field) && is_string($field['fieldKey'] ?? null) && is_string($field['id'] ?? null)) $ids[$field['fieldKey']] = $field['id'];
    }
    $id = is_string($ids[$fieldKey] ?? null) ? $ids[$fieldKey] : null;
    $ids[$fieldKey] = $id;
    @file_put_contents($cachePath, json_encode(['at' => time(), 'ids' => $ids], JSON_UNESCAPED_SLASHES), LOCK_EX);
    return $id;
}

/*
 * The office alert for a visitor who left (owner, 2026-09-23). This server
 * sends it, not GoHighLevel: GHL's shared mail server sends as the profile's
 * Gmail address and Google filed the alert as spam. Mail from this server
 * passes SPF, DKIM and DMARC for dutycleaners.ca (proved by the form-health
 * alerts). The private config may override office_alert_to / office_alert_from.
 */
const DC_GHL_OFFICE_ALERT_TO = ['support@dutycleaners.ca'];
const DC_GHL_OFFICE_ALERT_FROM = 'website-alerts@dutycleaners.ca';

/** Compose the alert; null when the lead cannot be read. Kept apart from mail() for the tests. */
function dc_ghl_office_alert_message(array $config, array $lead, string $contactId, array $session): ?array
{
    try {
        $payload = dc_ghl_decrypt((array) ($lead['payload'] ?? []), $config['encryption_key']);
    } catch (Throwable) {
        return null;
    }
    $line = static fn (mixed $value): string => trim((string) preg_replace('/[\r\n\t]+/', ' ', is_scalar($value) ? (string) $value : ''));
    $name = $line($payload['full_name'] ?? '') ?: 'A website visitor';
    $step = DC_GHL_STEPS[$session['step'] ?? 'price'] ?? DC_GHL_STEPS['price'];
    $lastActive = (new DateTimeImmutable('@' . (int) ($session['last_seen'] ?? time())))
        ->setTimezone(new DateTimeZone('America/Edmonton'))
        ->format('D M j, g:i A');
    $lines = [
        $name . ' saw their price on the website and left ' . $step . ' without booking or asking for a call. Please call them now.',
        '',
        'Phone: ' . $line($payload['phone'] ?? ''),
        'Email: ' . $line($payload['email'] ?? ''),
    ];
    $details = [
        'Branch' => ['edmonton' => 'Edmonton', 'calgary' => 'Calgary', 'reddeer' => 'Red Deer'][$line($payload['city'] ?? '')] ?? ucfirst($line($payload['city'] ?? '')),
        'Service' => $line($payload['service'] ?? ''),
        'Home type' => $line($payload['home_type'] ?? ''),
        'Bedrooms' => $line($payload['bedrooms'] ?? ''),
        'Bathrooms' => $line($payload['full_bathrooms'] ?? ''),
        'Half baths' => $line($payload['half_baths'] ?? ''),
        'Page' => $line($payload['page_url'] ?? ''),
    ];
    foreach ($details as $label => $value) {
        if ($value !== '') $lines[] = $label . ': ' . $value;
    }
    array_push(
        $lines,
        'Last active: ' . $lastActive . ' (Edmonton time)',
        '',
        'Contact in GoHighLevel: https://crm.bookin60.com/v2/location/' . DC_GHL_LOCATION_ID . '/contacts/detail/' . rawurlencode($contactId),
        '',
        'Unless they book first, they get one text in texting hours (Mon-Sat 8:00-19:30), then the quote follow-up emails and texts. Move their card in the Sales Pipeline once you have spoken to them; that stops the automatic follow-up.',
    );
    return [
        'subject' => 'Left without booking - ' . $name . ' (call now)',
        'body' => implode("\n", $lines),
    ];
}

function dc_ghl_office_alert(array $config, array $lead, string $contactId, array $session): bool
{
    return dc_ghl_office_send($config, dc_ghl_office_alert_message($config, $lead, $contactId, $session));
}

/**
 * The office alert for a confirmed quote: a call-back request (call them) or
 * a visitor handed to the booking page (watch for the booking). Replaces the
 * GoHighLevel emails of "Call-back Request Alert" and "Instant Quote
 * Automation" for the same spam reason. The customer's notes for the cleaner
 * can hold entry codes, so they stay on the GoHighLevel contact, not in email.
 */
function dc_ghl_confirm_alert_message(array $payload, ?string $contactId): array
{
    $line = static fn (mixed $value): string => trim((string) preg_replace('/[\r\n\t]+/', ' ', is_scalar($value) ? (string) $value : ''));
    $money = static fn (mixed $value): string => is_int($value) || is_float($value) ? '$' . number_format((float) $value, 2) : '';
    $name = $line($payload['full_name'] ?? '') ?: 'A website visitor';
    $callBack = str_contains((string) ($payload['source'] ?? ''), '(call-back requested)');
    $price = $money($payload['first_clean_price'] ?? null);
    $lines = [
        $callBack
            ? $name . ' asked us to call them about their quote. Please call them now. GoHighLevel has texted them that we will call (after opening time if the office is closed).'
            : $name . ' confirmed their quote on the website and went to the booking page to pick a date. If no booking comes through in BookingKoala, give them a call.',
        '',
        'Phone: ' . $line($payload['phone'] ?? ''),
        'Email: ' . $line($payload['email'] ?? ''),
    ];
    $recurring = $money($payload['recurring_price'] ?? null);
    $details = [
        'Branch' => ['edmonton' => 'Edmonton', 'calgary' => 'Calgary', 'reddeer' => 'Red Deer'][$line($payload['city'] ?? '')] ?? ucfirst($line($payload['city'] ?? '')),
        'Service' => $line($payload['service'] ?? ''),
        'Home type' => $line($payload['home_type'] ?? ''),
        'Bedrooms' => $line($payload['bedrooms'] ?? ''),
        'Bathrooms' => $line($payload['full_bathrooms'] ?? ''),
        'Half baths' => $line($payload['half_baths'] ?? ''),
        'How often' => $line($payload['frequency'] ?? ''),
        'First clean' => $price === '' ? '' : $price . ' before GST',
        'Each visit after' => $recurring === '' ? '' : $recurring . ' before GST',
        'Extras' => implode(', ', array_map($line, is_array($payload['addons'] ?? null) ? $payload['addons'] : [])),
        'Page' => $line($payload['page_url'] ?? ''),
    ];
    foreach ($details as $label => $value) {
        if ($value !== '') $lines[] = $label . ': ' . $value;
    }
    $lines[] = '';
    $lines[] = is_string($contactId) && $contactId !== ''
        ? 'Contact in GoHighLevel (notes for the cleaner are there): https://crm.bookin60.com/v2/location/' . DC_GHL_LOCATION_ID . '/contacts/detail/' . rawurlencode($contactId)
        : 'GoHighLevel has not accepted this contact yet; the website keeps retrying. Search GoHighLevel for the phone number later.';
    return [
        'subject' => $callBack
            ? 'Call-back requested - ' . $name . ' (call now)'
            : 'Quote confirmed - ' . $name . ($price === '' ? '' : ' (' . $price . ')') . ' - went to booking page',
        'body' => implode("\n", $lines),
    ];
}

/** Email the office once per confirmed quote, whether or not GoHighLevel took it. */
function dc_ghl_confirm_alert(array $config, array $payload, ?string $contactId): bool
{
    $source = (string) ($payload['source'] ?? '');
    if (($payload['stage'] ?? '') !== 'confirm' || str_starts_with($source, 'contact-form') || str_starts_with($source, 'careers-application')) return false;
    return dc_ghl_office_send($config, dc_ghl_confirm_alert_message($payload, $contactId));
}

function dc_ghl_office_send(array $config, ?array $message): bool
{
    $to = $config['office_alert_to'] ?? DC_GHL_OFFICE_ALERT_TO;
    $from = $config['office_alert_from'] ?? DC_GHL_OFFICE_ALERT_FROM;
    if (!is_array($to) || $to === [] || !is_string($from) || filter_var($from, FILTER_VALIDATE_EMAIL) === false) return false;
    foreach ($to as $address) {
        if (!is_string($address) || filter_var($address, FILTER_VALIDATE_EMAIL) === false) return false;
    }
    if ($message === null) return false;
    $headers = [
        'From: Duty Cleaners Website <' . $from . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Auto-Response-Suppress: All',
    ];
    $subject = '=?UTF-8?B?' . base64_encode($message['subject']) . '?=';
    return @mail(implode(',', $to), $subject, $message['body'], implode("\r\n", $headers));
}

/**
 * Mark visitors who went quiet as left. Runs from the cron job and after
 * funnel pings, so a busy site notices within a minute and a quiet one
 * within the cron interval. A lead not yet in GoHighLevel waits for delivery.
 */
function dc_ghl_sweep_sessions(array $config, int $limit = 10): int
{
    $dir = dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . 'sessions';
    $marked = 0;
    $now = time();
    foreach (glob($dir . DIRECTORY_SEPARATOR . '*.json') ?: [] as $path) {
        $session = json_decode((string) @file_get_contents($path), true);
        if (!is_array($session)) continue;
        if ((int) ($session['created_at'] ?? 0) < $now - DC_GHL_SESSION_TTL_SECONDS) {
            @unlink($path);
            continue;
        }
        if (($session['state'] ?? '') !== 'open' || (int) ($session['last_seen'] ?? $now) > $now - DC_GHL_QUIET_SECONDS) continue;
        if ($marked >= $limit) break;
        $lead = json_decode((string) @file_get_contents(dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . basename((string) ($session['lead'] ?? ''))), true);
        $contactId = is_array($lead) && ($lead['state'] ?? '') === 'delivered' ? ($lead['contact_id'] ?? null) : null;
        if (!is_string($contactId) || $contactId === '') continue;
        // Claim the session first so two sweeps can never tag the same visit.
        $won = false;
        $claimed = dc_ghl_session_update($path, static function (?array $current) use ($now, &$won) {
            if (($current['state'] ?? '') !== 'open' || (int) ($current['last_seen'] ?? $now) > $now - DC_GHL_QUIET_SECONDS) return null;
            $current['state'] = 'left';
            $current['left_at'] = $now;
            $won = true;
            return $current;
        });
        if (!$won || !is_array($claimed)) continue;
        $session = $claimed;
        // The office hears first, and even if GoHighLevel is down.
        dc_ghl_office_alert($config, $lead, $contactId, $session);
        $headers = dc_ghl_headers($config);
        // The field first: the workflow started by the tag reads it.
        $fieldId = dc_ghl_optional_field_id($config, 'contact.funnel_last_step');
        if ($fieldId !== null) {
            dc_ghl_http(DC_GHL_API . '/contacts/' . rawurlencode($contactId), 'PUT', $headers, json_encode([
                'customFields' => [['id' => $fieldId, 'field_value' => DC_GHL_STEPS[$session['step'] ?? 'price'] ?? DC_GHL_STEPS['price']]],
            ], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
        }
        dc_ghl_http(DC_GHL_API . '/contacts/' . rawurlencode($contactId) . '/tags', 'POST', $headers, json_encode(['tags' => ['quote-left']], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
        $marked++;
    }
    return $marked;
}

/*
 * Branch and lead source (owner, 2026-09-23). GoHighLevel had no way to tell
 * which branch or which ad a website lead came from: every lead looked like
 * "direct". These contact fields are optional (created in GHL on 2026-09-23);
 * a missing one is skipped, never an error. The site keeps the first tagged
 * landing of the visit (tracking.ts), so the values describe the visit that
 * produced this lead. Lead Channel is always written; the UTM and click-ID
 * fields only when the visit carried them.
 */
const DC_GHL_BRANCHES = ['edmonton' => 'Edmonton', 'calgary' => 'Calgary', 'reddeer' => 'Red Deer', 'red deer' => 'Red Deer'];
/*
 * The office line a follow-up message tells the customer to call (owner,
 * 2026-09-23): the branch's own number, which rings the office's Dialpad,
 * never the GoHighLevel texting number. Must match CITY_PROOF.<city>.phone in
 * src/data/proof.ts (guarded). A lead with no branch (homepage quote) gets
 * the two main offices.
 */
const DC_GHL_BRANCH_PHONES = [
    'Edmonton' => '(780) 913-6565',
    'Calgary' => '(403) 768-1341',
    'Red Deer' => '(587) 570-6979',
];
const DC_GHL_NO_BRANCH_PHONE = 'Edmonton (780) 913-6565 or Calgary (403) 768-1341';

/** @return array<string,string> GHL field key => value (empty values are skipped). */
function dc_ghl_source_values(array $payload): array
{
    $tracking = is_array($payload['tracking'] ?? null) ? $payload['tracking'] : [];
    $get = static fn (string $key): string => substr(trim((string) preg_replace('/[\r\n\t]+/', ' ', is_string($tracking[$key] ?? null) ? $tracking[$key] : '')), 0, 200);
    $clickId = $get('gclid') ?: ($get('gbraid') ?: $get('wbraid'));
    $source = $get('utm_source');
    $medium = $get('utm_medium');
    $channel = $clickId !== ''
        ? 'Google Ads'
        : ($source !== '' ? $source . ($medium !== '' ? ' / ' . $medium : '') : 'Website (no ad or campaign tags)');
    $branch = DC_GHL_BRANCHES[strtolower(trim((string) ($payload['city'] ?? '')))] ?? '';
    return [
        'contact.branch' => $branch,
        'contact.branch_phone' => DC_GHL_BRANCH_PHONES[$branch] ?? DC_GHL_NO_BRANCH_PHONE,
        'contact.lead_channel' => $channel,
        'contact.utm_source' => $source,
        'contact.utm_medium' => $medium,
        'contact.utm_campaign' => $get('utm_campaign') ?: $get('utm_id'),
        'contact.utm_term' => $get('utm_term'),
        'contact.ad_click_id' => $clickId,
    ];
}

function dc_ghl_deliver(array $config, array $payload): array
{
    $fieldIds = dc_ghl_field_ids($config);
    $customFields = [];
    foreach (DC_GHL_FIELD_MAP as $fieldKey => $payloadKey) {
        $value = dc_ghl_custom_value($payload[$payloadKey] ?? null);
        if ($value !== '') $customFields[] = ['id' => $fieldIds[$fieldKey], 'field_value' => $value];
    }
    foreach (dc_ghl_source_values($payload) as $fieldKey => $value) {
        if ($value === '') continue;
        $fieldId = dc_ghl_optional_field_id($config, $fieldKey);
        if ($fieldId !== null) $customFields[] = ['id' => $fieldId, 'field_value' => $value];
    }
    $parts = preg_split('/\s+/', trim($payload['full_name'])) ?: [];
    $isCareers = $payload['source'] === 'careers-application';
    $isContact = str_starts_with($payload['source'], 'contact-form');
    if ($isCareers) {
        $tags = ['careers-applicant'];
    } elseif ($isContact) {
        $tags = ['website-contact'];
        // The form's "Office Cleaning" choice sends the service "commercial".
        // This tag starts the GoHighLevel workflow that opens a card in the
        // Office Cleaning pipeline; website-contact alone cannot, because a
        // returning contact already carries it and GHL fires only on a new tag.
        if ($payload['service'] === 'commercial') $tags[] = 'office-enquiry';
    } else {
        // The first funnel submission captures an unfinished quote. Only the
        // confirmation submission has a price, so only that submission may
        // start the customer-facing instant-quote workflow.
        $tags = $payload['stage'] === 'confirm'
            ? ['instant-quote', 'quote-confirmed']
            : ['quote-started'];
        if ($payload['city'] !== '') $tags[] = strtolower($payload['city']);
        if ($payload['intent'] === 'deep') $tags[] = 'deep-intent';
        // A call-back request travels the confirmed-quote path like a booking;
        // this tag is what lets GoHighLevel alert the office to call. It must
        // NOT carry instant-quote (owner, 2026-09-23): that tag starts the
        // "continue on the booking page" text, wrong for someone who asked us
        // to call. The call-back workflow sends its own office-hours reply.
        if (str_contains($payload['source'], '(call-back requested)')) {
            $tags = array_values(array_diff($tags, ['instant-quote']));
            $tags[] = 'callback-requested';
        }
    }
    $request = [
        'locationId' => DC_GHL_LOCATION_ID,
        'name' => $payload['full_name'],
        'firstName' => $parts[0] ?? '',
        'lastName' => implode(' ', array_slice($parts, 1)),
        'email' => $payload['email'],
        'phone' => dc_ghl_e164($payload['phone']),
        'source' => $payload['source'],
        'customFields' => $customFields,
    ];
    $headers = [
        'Authorization: Bearer ' . $config['token'],
        'Version: ' . DC_GHL_VERSION,
        'Accept: application/json',
        'Content-Type: application/json',
    ];
    [$status, $body, $networkError] = dc_ghl_http(
        DC_GHL_API . '/contacts/upsert',
        'POST',
        $headers,
        json_encode($request, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
    );
    $decoded = json_decode($body, true);
    $contactId = is_array($decoded) ? ($decoded['contact']['id'] ?? $decoded['id'] ?? null) : null;
    if ($status < 200 || $status >= 300 || !is_string($contactId) || $contactId === '') {
        return ['ok' => false, 'status' => $status, 'error' => $networkError !== '' ? $networkError : 'GHL response ' . $status];
    }
    $isQuoteLead = !$isCareers && !$isContact && $payload['stage'] !== 'confirm';
    // A new price check starts the price-check stage afresh (2026-09-23):
    // GoHighLevel fires "tag added" only for a tag the contact lacks, so any
    // leftover from an earlier visit would silently block the workflows.
    if ($isQuoteLead) dc_ghl_remove_tags($headers, $contactId, ['quote-started', 'quote-left', 'text1-sent']);
    // HighLevel's upsert endpoint overwrites every existing contact tag when
    // `tags` is included. Add tags through the dedicated endpoint instead so
    // a returning customer keeps all prior CRM history and segmentation.
    [$tagStatus, $_tagBody, $tagError] = dc_ghl_http(
        DC_GHL_API . '/contacts/' . rawurlencode($contactId) . '/tags',
        'POST',
        $headers,
        json_encode(['tags' => array_values(array_unique($tags))], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
    );
    if ($tagStatus < 200 || $tagStatus >= 300) {
        return [
            'ok' => false,
            'status' => $tagStatus,
            'error' => $tagError !== '' ? $tagError : 'GHL tag response ' . $tagStatus,
        ];
    }
    // A confirmed quote (booking or call-back) ends the price-check stage
    // (owner, 2026-09-23): dropping quote-started makes the "Price-check lead"
    // workflow skip its text, and a later price check adds the tag again, so
    // that workflow starts afresh. Best effort: a stale tag costs one text.
    if (!$isCareers && !$isContact && $payload['stage'] === 'confirm') {
        dc_ghl_remove_tags($headers, $contactId, ['quote-started', 'quote-left']);
    }
    if (trim($payload['notes']) !== '') {
        [$noteStatus, $_noteBody, $noteError] = dc_ghl_http(
            DC_GHL_API . '/contacts/' . rawurlencode($contactId) . '/notes',
            'POST',
            $headers,
            json_encode(['body' => trim($payload['notes'])], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR)
        );
        if ($noteStatus < 200 || $noteStatus >= 300) {
            return [
                'ok' => false,
                'status' => $noteStatus,
                'error' => $noteError !== '' ? $noteError : 'GHL note response ' . $noteStatus,
            ];
        }
    }
    return ['ok' => true, 'status' => $status, 'contact_id' => $contactId, 'error' => ''];
}

function dc_ghl_form_name(string $source): string
{
    if (str_starts_with($source, 'contact-form')) return 'contact-form';
    if (str_starts_with($source, 'careers-application')) return 'careers-application';
    return 'quote-funnel';
}

function dc_ghl_health(array $config, string $event, string $category, int $status, string $source): void
{
    $healthPath = $config['form_health_config'] ?? (dc_ghl_private_root() . '/private/form-health-config.php');
    if (!is_string($healthPath) || !is_file($healthPath)) return;
    $health = require $healthPath;
    $secret = is_array($health) ? ($health['shared_secret'] ?? '') : '';
    $url = $config['form_health_url'] ?? 'https://dutycleaners.ca/api/form-health.php';
    if (!is_string($secret) || strlen($secret) < 32 || !is_string($url)) return;
    try {
        dc_ghl_http($url, 'POST', ['Content-Type: application/json', 'X-Form-Health-Secret: ' . $secret], json_encode([
            'event' => $event,
            'form' => dc_ghl_form_name($source),
            'stage' => 'ghl-delivery',
            'category' => $category,
            'status' => max(0, min(599, $status)),
            'path' => '/server/ghl-quote',
        ], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));
    } catch (Throwable) {
        // Monitoring must never block lead storage or delivery.
    }
}

function dc_ghl_attempt(array $config, array $record, string $path): array
{
    $deliveryLock = @fopen($path . '.lock', 'c+');
    if ($deliveryLock === false || !flock($deliveryLock, LOCK_EX | LOCK_NB)) {
        if (is_resource($deliveryLock)) fclose($deliveryLock);
        return $record;
    }
    try {
        $latest = json_decode((string) @file_get_contents($path), true);
        if (is_array($latest)) $record = $latest;
        if (($record['state'] ?? '') === 'delivered' && is_string($record['contact_id'] ?? null)) return $record;
        $payload = dc_ghl_decrypt((array) ($record['payload'] ?? []), $config['encryption_key']);
        $attempt = (int) ($record['attempts'] ?? 0) + 1;
        try {
            $result = dc_ghl_deliver($config, $payload);
        } catch (Throwable $error) {
            $result = ['ok' => false, 'status' => 0, 'error' => $error->getMessage()];
        }
        $record['attempts'] = $attempt;
        $record['updated_at'] = gmdate('c');
        $record['last_status'] = (int) ($result['status'] ?? 0);
        if (($result['ok'] ?? false) === true) {
            $record['state'] = 'delivered';
            $record['contact_id'] = $result['contact_id'];
            $record['last_error'] = null;
            $record['next_retry_at'] = null;
            if ($attempt > 1) dc_ghl_health($config, 'recovered', 'delivery', $record['last_status'], (string) $payload['source']);
        } else {
            $terminal = $attempt >= DC_GHL_MAX_ATTEMPTS;
            $record['state'] = $terminal ? 'failed' : 'pending';
            $record['last_error'] = substr((string) ($result['error'] ?? 'delivery failed'), 0, 300);
            $delay = DC_GHL_RETRY_MINUTES[min($attempt - 1, count(DC_GHL_RETRY_MINUTES) - 1)];
            $record['next_retry_at'] = $terminal ? null : time() + ($delay * 60);
            dc_ghl_health($config, 'failed', ((int) $record['last_status']) === 401 ? 'configuration' : 'delivery', $record['last_status'], (string) $payload['source']);
        }
        // Once per confirmed quote, after the first attempt either way: the
        // office hears even when GoHighLevel is down (link only when it is not).
        if (!($record['office_alerted'] ?? false) && ($payload['stage'] ?? '') === 'confirm') {
            $record['office_alerted'] = true;
            dc_ghl_confirm_alert($config, $payload, ($record['state'] ?? '') === 'delivered' ? (string) $record['contact_id'] : null);
        }
        dc_ghl_write_record($path, $record);
        return $record;
    } finally {
        flock($deliveryLock, LOCK_UN);
        fclose($deliveryLock);
    }
}

function dc_ghl_retry_pending(array $config): array
{
    $checked = 0;
    $delivered = 0;
    $pending = 0;
    $due = [];
    foreach (glob(dc_ghl_queue_dir($config) . DIRECTORY_SEPARATOR . '*.json') ?: [] as $path) {
        if (in_array(basename($path), ['field-cache.json', 'rate-limit.json'], true)) continue;
        $record = json_decode((string) @file_get_contents($path), true);
        if (!is_array($record) || ($record['state'] ?? '') !== 'pending' || (int) ($record['next_retry_at'] ?? PHP_INT_MAX) > time()) continue;
        $due[] = [$path, $record];
    }
    // Oldest first (2026-09-23): file names are hashes, so glob order is random,
    // and a confirmation delivered before its own price-check lead let that lead
    // re-add quote-started and trigger the "you checked your price" text.
    usort($due, static fn (array $a, array $b) => strcmp((string) ($a[1]['created_at'] ?? ''), (string) ($b[1]['created_at'] ?? '')));
    foreach ($due as [$path, $record]) {
        $checked++;
        $record = dc_ghl_attempt($config, $record, $path);
        if (($record['state'] ?? '') === 'delivered') $delivered++; else $pending++;
        if ($checked >= 20) break;
    }
    $left = dc_ghl_sweep_sessions($config);
    return ['ok' => true, 'checked' => $checked, 'delivered' => $delivered, 'pending' => $pending, 'left' => $left];
}

// The automated test suite can load the functions without running the HTTP or
// CLI entry point. Production never sets this process-only environment flag.
if (getenv('DC_GHL_LIBRARY_ONLY') === '1') return;

// SiteGround cron: php /home/customer/www/dutycleaners.ca/public_html/api/ghl-quote.php retry
if (PHP_SAPI === 'cli') {
    try {
        $config = dc_ghl_config();
        echo json_encode(dc_ghl_retry_pending($config), JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . PHP_EOL;
        exit(0);
    } catch (Throwable $error) {
        fwrite(STDERR, "GHL retry failed: " . $error->getMessage() . PHP_EOL);
        exit(1);
    }
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowedOrigin = in_array($origin, DC_GHL_ALLOWED_ORIGINS, true);
if ($allowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: content-type,x-ghl-retry-secret');
    header('Access-Control-Allow-Methods: POST,OPTIONS');
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    if (!$allowedOrigin) dc_ghl_json(403, ['ok' => false]);
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST' || !$allowedOrigin) dc_ghl_json(403, ['ok' => false]);

try {
    $config = dc_ghl_config();
} catch (Throwable) {
    dc_ghl_json(503, ['ok' => false, 'stored' => false, 'status' => 503, 'error' => 'relay unavailable']);
}

if (dc_ghl_rate_limited($config)) {
    dc_ghl_json(429, ['ok' => false, 'stored' => false, 'status' => 429, 'error' => 'rate limited']);
}

$raw = file_get_contents('php://input', false, null, 0, 65537);
if ($raw === false || strlen($raw) > 65536) dc_ghl_json(413, ['ok' => false, 'stored' => false, 'status' => 413]);

try {
    $input = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
    if (is_array($input) && ($input['operation'] ?? null) === 'retry_pending') {
        $expected = $config['retry_secret'] ?? '';
        $provided = $_SERVER['HTTP_X_GHL_RETRY_SECRET'] ?? '';
        if (!is_string($expected) || strlen($expected) < 32 || !is_string($provided) || !hash_equals($expected, $provided)) {
            dc_ghl_json(401, ['ok' => false]);
        }
        dc_ghl_json(200, dc_ghl_retry_pending($config));
    }
    // Sent by the browser right after its receipt, without waiting for an
    // answer (SiteGround has no fastcgi_finish_request, so the receipt request
    // cannot deliver after replying). Delivering here makes a lead reach
    // GoHighLevel in seconds; the cron job remains the safety net.
    if (is_array($input) && ($input['operation'] ?? null) === 'deliver') {
        $path = dc_ghl_record_path($config, dc_ghl_payload_request_id($input['request_id'] ?? ''));
        $record = is_file($path) ? json_decode((string) @file_get_contents($path), true) : null;
        if (is_array($record) && ($record['state'] ?? '') === 'pending') {
            ignore_user_abort(true);
            dc_ghl_attempt($config, $record, $path);
        }
        dc_ghl_sweep_sessions($config, 3);
        dc_ghl_json(200, ['ok' => true]);
    }
    if (is_array($input) && ($input['operation'] ?? null) === 'ping') {
        dc_ghl_session_ping($config, dc_ghl_session_id($input['session_id'] ?? ''), (string) ($input['step'] ?? ''));
        ignore_user_abort(true);
        dc_ghl_sweep_sessions($config, 3);
        dc_ghl_json(200, ['ok' => true]);
    }
    $payload = dc_ghl_payload($input);
    $fillElapsedMs = $payload['formOpenedAt'] === null
        ? null
        : (int) floor(microtime(true) * 1000) - (int) $payload['formOpenedAt'];
    // The browser and web server do not necessarily share the same clock.
    // Only treat a non-negative elapsed time under three seconds as an instant
    // bot submission. A negative value is clock skew, not evidence of spam.
    if ($payload['website'] !== '' || ($fillElapsedMs !== null && $fillElapsedMs >= 0 && $fillElapsedMs < 3000)) {
        dc_ghl_json(202, ['ok' => true, 'stored' => false, 'delivery' => 'pending', 'status' => 202]);
    }
    [$record, $path] = dc_ghl_store($config, $payload);
    dc_ghl_session_record($config, $payload, $path);
    if (($record['state'] ?? '') !== 'delivered') {
        dc_ghl_accept_then_deliver($config, $record, $path);
    }
    dc_ghl_json(200, [
        'ok' => true,
        'stored' => true,
        'delivery' => 'delivered',
        'status' => 200,
        'receiptId' => $record['receipt_id'],
        'contactId' => $record['contact_id'] ?? null,
    ]);
} catch (DomainException) {
    dc_ghl_json(409, ['ok' => false, 'stored' => false, 'status' => 409, 'error' => 'request conflict']);
} catch (InvalidArgumentException) {
    dc_ghl_json(400, ['ok' => false, 'stored' => false, 'status' => 400, 'error' => 'invalid request']);
} catch (Throwable) {
    dc_ghl_health($config, 'failed', 'storage', 503, 'dutycleaners.ca instant quote');
    dc_ghl_json(503, ['ok' => false, 'stored' => false, 'status' => 503, 'error' => 'capture unavailable']);
}
