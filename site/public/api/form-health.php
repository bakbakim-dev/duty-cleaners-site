<?php
declare(strict_types=1);

// Privacy-safe form incident recorder and notifier for Duty Cleaners.
// It accepts operational labels only. Form values and arbitrary messages are
// rejected so customer personal data cannot enter logs or alert emails.

const DC_HEALTH_FORMS = [
    'quote-funnel', 'contact-form', 'careers-application', 'booking-handoff',
];
const DC_HEALTH_STAGES = [
    'lead', 'confirmation', 'callback', 'secure-transfer',
    'ghl-delivery', 'durable-capture', 'form-submit',
];
const DC_HEALTH_CATEGORIES = [
    'network', 'timeout', 'http', 'invalid-response',
    'storage', 'delivery', 'configuration',
];
const DC_HEALTH_EVENTS = ['failed', 'recovered'];

$allowedOrigins = [
    'https://dutycleaners.ca',
    'https://www.dutycleaners.ca',
    'https://duty-cleaners-preview.netlify.app',
    'https://mikaily131.sg-host.com',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
];

function dc_health_json(int $status, array $data): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function dc_health_string(mixed $value, array $allowed): string
{
    if (!is_string($value) || !in_array($value, $allowed, true)) {
        throw new RuntimeException('invalid');
    }
    return $value;
}

function dc_health_config(): array
{
    $explicit = getenv('DC_FORM_HEALTH_CONFIG') ?: '';
    $path = $explicit !== ''
        ? $explicit
        : dirname((string) ($_SERVER['DOCUMENT_ROOT'] ?? __DIR__)) . '/private/form-health-config.php';
    if (!is_file($path)) {
        throw new RuntimeException('unconfigured');
    }
    $config = require $path;
    if (!is_array($config)) {
        throw new RuntimeException('unconfigured');
    }
    return $config;
}

function dc_health_payload(array $body): array
{
    $allowedKeys = ['event', 'form', 'stage', 'category', 'status', 'path'];
    foreach (array_keys($body) as $key) {
        if (!is_string($key) || !in_array($key, $allowedKeys, true)) {
            throw new RuntimeException('invalid');
        }
    }
    $status = $body['status'] ?? 0;
    $path = $body['path'] ?? '/';
    if (!is_int($status) || $status < 0 || $status > 599 ||
        !is_string($path) || strlen($path) > 300 || !str_starts_with($path, '/') ||
        str_contains($path, '?') || str_contains($path, '#')) {
        throw new RuntimeException('invalid');
    }
    return [
        'event' => dc_health_string($body['event'] ?? null, DC_HEALTH_EVENTS),
        'form' => dc_health_string($body['form'] ?? null, DC_HEALTH_FORMS),
        'stage' => dc_health_string($body['stage'] ?? null, DC_HEALTH_STAGES),
        'category' => dc_health_string($body['category'] ?? null, DC_HEALTH_CATEGORIES),
        'status' => $status,
        'path' => $path,
    ];
}

function dc_health_label(string $value): string
{
    return ucwords(str_replace('-', ' ', $value));
}

function dc_health_email(array $config, array $event, array $incident): bool
{
    if (($config['email_enabled'] ?? true) !== true) {
        return false;
    }
    $recipients = $config['recipients'] ?? [];
    $from = $config['from'] ?? '';
    if (!is_array($recipients) || $recipients === [] || !is_string($from) ||
        filter_var($from, FILTER_VALIDATE_EMAIL) === false) {
        return false;
    }
    foreach ($recipients as $recipient) {
        if (!is_string($recipient) || filter_var($recipient, FILTER_VALIDATE_EMAIL) === false) {
            return false;
        }
    }
    $recovered = $event['event'] === 'recovered';
    $subject = sprintf(
        '[Duty Cleaners] %s: %s',
        $recovered ? 'Form recovered' : 'Form problem',
        dc_health_label($event['form'])
    );
    $body = implode("\n", [
        $recovered ? 'A previously failing website form is working again.' : 'A customer-facing website form reported a failure.',
        '',
        'Form: ' . dc_health_label($event['form']),
        'Step: ' . dc_health_label($event['stage']),
        'Problem type: ' . dc_health_label($event['category']),
        'HTTP status: ' . (string) $event['status'],
        'Page: ' . $event['path'],
        'First failure (UTC): ' . ($incident['first_failure_at'] ?? 'unknown'),
        'Latest event (UTC): ' . $event['recorded_at'],
        'Failures in this incident: ' . (string) ($incident['failure_count'] ?? 0),
        '',
        'No customer names, contact details, addresses, messages or access instructions are included in this alert.',
    ]);
    $headers = [
        'From: Duty Cleaners Website Alerts <' . $from . '>',
        'Content-Type: text/plain; charset=UTF-8',
        'X-Auto-Response-Suppress: All',
    ];
    return @mail(implode(',', $recipients), $subject, $body, implode("\r\n", $headers));
}

function dc_health_webhook(array $config, array $event, array $incident): bool
{
    $url = $config['webhook_url'] ?? '';
    if (!is_string($url) || $url === '' || filter_var($url, FILTER_VALIDATE_URL) === false ||
        !str_starts_with(strtolower($url), 'https://') || !function_exists('curl_init')) {
        return false;
    }
    $payload = json_encode([
        'service' => 'Duty Cleaners website',
        'event' => $event['event'],
        'form' => $event['form'],
        'stage' => $event['stage'],
        'category' => $event['category'],
        'status' => $event['status'],
        'path' => $event['path'],
        'recorded_at' => $event['recorded_at'],
        'failure_count' => $incident['failure_count'] ?? 0,
    ], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $curl = curl_init($url);
    if ($curl === false) {
        return false;
    }
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $payload,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
        CURLOPT_CONNECTTIMEOUT => 3,
    ]);
    curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);
    return $status >= 200 && $status < 300;
}

function dc_health_record(array $config, array $event): array
{
    $logDir = $config['log_dir'] ?? '';
    if (!is_string($logDir) || $logDir === '') {
        $logDir = dirname((string) ($_SERVER['DOCUMENT_ROOT'] ?? __DIR__)) . '/private/form-health';
    }
    if (!is_dir($logDir) && !@mkdir($logDir, 0700, true) && !is_dir($logDir)) {
        throw new RuntimeException('storage');
    }
    $statePath = rtrim($logDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'incidents.json';
    $stateHandle = @fopen($statePath, 'c+');
    if ($stateHandle === false || !flock($stateHandle, LOCK_EX)) {
        if (is_resource($stateHandle)) fclose($stateHandle);
        throw new RuntimeException('storage');
    }
    try {
        $raw = stream_get_contents($stateHandle);
        $state = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
        if (!is_array($state)) $state = [];
        $key = $event['form'] . ':' . $event['stage'];
        $incident = is_array($state[$key] ?? null) ? $state[$key] : [];
        $now = time();
        $cooldown = max(300, min(86400, (int) ($config['cooldown_seconds'] ?? 1800)));
        $shouldNotify = false;
        if ($event['event'] === 'failed') {
            $wasOpen = ($incident['open'] ?? false) === true;
            $lastNotification = (int) ($incident['last_notification_unix'] ?? 0);
            $incident['open'] = true;
            $incident['first_failure_at'] = $wasOpen
                ? ($incident['first_failure_at'] ?? $event['recorded_at'])
                : $event['recorded_at'];
            $incident['failure_count'] = $wasOpen ? ((int) ($incident['failure_count'] ?? 0) + 1) : 1;
            $incident['last_failure_at'] = $event['recorded_at'];
            $shouldNotify = !$wasOpen || $now - $lastNotification >= $cooldown;
        } else {
            $shouldNotify = ($incident['open'] ?? false) === true;
            $incident['open'] = false;
            $incident['recovered_at'] = $event['recorded_at'];
        }
        if ($shouldNotify) {
            $incident['last_notification_unix'] = $now;
        }
        $state[$key] = $incident;
        rewind($stateHandle);
        ftruncate($stateHandle, 0);
        fwrite($stateHandle, json_encode($state, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
        fflush($stateHandle);
    } finally {
        flock($stateHandle, LOCK_UN);
        fclose($stateHandle);
    }

    $emailSent = $shouldNotify && dc_health_email($config, $event, $incident);
    $webhookSent = $shouldNotify && dc_health_webhook($config, $event, $incident);
    $record = $event + [
        'notification_due' => $shouldNotify,
        'email_sent' => $emailSent,
        'webhook_sent' => $webhookSent,
    ];
    $logPath = rtrim($logDir, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR . 'events.jsonl';
    $written = @file_put_contents(
        $logPath,
        json_encode($record, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR) . "\n",
        FILE_APPEND | LOCK_EX
    );
    if ($written === false) {
        throw new RuntimeException('storage');
    }
    return ['notification_due' => $shouldNotify, 'notification_sent' => $emailSent || $webhookSent];
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isAllowedOrigin = in_array($origin, $allowedOrigins, true);
if ($isAllowedOrigin) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Headers: content-type,x-form-health-secret');
    header('Access-Control-Allow-Methods: GET,POST,OPTIONS');
    header('Vary: Origin');
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    if (!$isAllowedOrigin) dc_health_json(403, ['ok' => false]);
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET') {
    try {
        $healthConfig = dc_health_config();
        $healthSecret = $healthConfig['shared_secret'] ?? '';
        if (!is_string($healthSecret) || strlen($healthSecret) < 32) {
            throw new RuntimeException('unconfigured');
        }
        $emailEnabled = ($healthConfig['email_enabled'] ?? true) === true;
        $webhook = $healthConfig['webhook_url'] ?? '';
        $alertsEnabled = $emailEnabled || (is_string($webhook) && str_starts_with(strtolower($webhook), 'https://'));
        dc_health_json(200, [
            'ok' => true,
            'service' => 'form-health',
            'version' => 1,
            'alerts_enabled' => $alertsEnabled,
        ]);
    } catch (Throwable) {
        dc_health_json(503, ['ok' => false, 'service' => 'form-health', 'version' => 1]);
    }
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    dc_health_json(405, ['ok' => false]);
}

try {
    $config = dc_health_config();
    $configuredSecret = $config['shared_secret'] ?? '';
    $givenSecret = $_SERVER['HTTP_X_FORM_HEALTH_SECRET'] ?? '';
    $isAuthenticatedServer = is_string($configuredSecret) && strlen($configuredSecret) >= 32 &&
        is_string($givenSecret) && hash_equals($configuredSecret, $givenSecret);
    if (!$isAllowedOrigin && !$isAuthenticatedServer) {
        dc_health_json(403, ['ok' => false]);
    }
    $raw = file_get_contents('php://input', false, null, 0, 4097);
    if (!is_string($raw) || strlen($raw) > 4096) {
        dc_health_json(413, ['ok' => false]);
    }
    $body = json_decode($raw, true, 16, JSON_THROW_ON_ERROR);
    if (!is_array($body) || array_is_list($body)) {
        throw new RuntimeException('invalid');
    }
    $event = dc_health_payload($body);
    $event['recorded_at'] = gmdate('c');
    $result = dc_health_record($config, $event);
    dc_health_json(200, ['ok' => true, 'recorded' => true] + $result);
} catch (RuntimeException $error) {
    $kind = $error->getMessage();
    dc_health_json($kind === 'unconfigured' ? 503 : ($kind === 'invalid' ? 400 : 500), ['ok' => false]);
} catch (Throwable) {
    dc_health_json(500, ['ok' => false]);
}
