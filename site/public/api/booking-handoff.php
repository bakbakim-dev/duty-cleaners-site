<?php
declare(strict_types=1);

// Duty Cleaners' SiteGround-native encrypted field handoff. This endpoint
// seals/unseals a short-lived payload; it cannot read or create bookings.
const DC_HANDOFF_TTL_MS = 1200000;
const DC_HANDOFF_AAD = 'duty-cleaners:booking-handoff:v1';
const DC_HANDOFF_KEYS = [
    'f_name', 'l_name', 'email', 'phone', 'dc_entry', 'dc_clean', 'dc_park',
    'dc_flex', 'dc_notes', 'dc_addr', 'dc_apt', 'dc_city', 'dc_prov', 'dc_zip',
];

$websiteOrigins = [
    'https://dutycleaners.ca',
    'https://www.dutycleaners.ca',
    'https://duty-cleaners-preview.netlify.app',
    'https://mikaily131.sg-host.com',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
];
$bookingOrigins = [
    'https://dutycleaners.bookingkoala.com',
    'https://book.dutycleaners.ca',
];

function dc_json(int $status, array $data = []): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    exit;
}

function dc_b64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function dc_b64url_decode(string $value): string
{
    $raw = base64_decode(strtr($value, '-_', '+/'), true);
    if ($raw === false) {
        throw new RuntimeException('invalid');
    }
    return $raw;
}

function dc_validate_fields(mixed $input): array
{
    if (!is_array($input) || array_is_list($input) || $input === []) {
        throw new RuntimeException('invalid');
    }
    $output = [];
    foreach ($input as $key => $value) {
        if (!is_string($key) || !in_array($key, DC_HANDOFF_KEYS, true) || !is_string($value)) {
            throw new RuntimeException('invalid');
        }
        $max = $key === 'dc_notes' ? 500 : 120;
        if (strlen($value) > $max) {
            throw new RuntimeException('invalid');
        }
        $output[$key] = $value;
    }
    return $output;
}

function dc_key(string $secret): string
{
    if (strlen($secret) < 32) {
        throw new RuntimeException('unavailable');
    }
    return hash('sha256', 'duty-cleaners-handoff:' . $secret, true);
}

function dc_seal(array $fields, string $secret, int $now): string
{
    $iv = random_bytes(12);
    $payload = json_encode([
        'v' => 1,
        'issued' => $now,
        'expires' => $now + DC_HANDOFF_TTL_MS,
        'fields' => dc_validate_fields($fields),
    ], JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $tag = '';
    $encrypted = openssl_encrypt($payload, 'aes-256-gcm', dc_key($secret), OPENSSL_RAW_DATA, $iv, $tag, DC_HANDOFF_AAD, 16);
    if ($encrypted === false || strlen($tag) !== 16) {
        throw new RuntimeException('unavailable');
    }
    return dc_b64url_encode($iv) . '.' . dc_b64url_encode($encrypted . $tag);
}

function dc_unseal(string $token, string $secret, int $now): array
{
    if (!preg_match('/^[A-Za-z0-9_-]{16}\.[A-Za-z0-9_-]{32,10000}$/', $token)) {
        throw new RuntimeException('invalid');
    }
    [$encodedIv, $encodedData] = explode('.', $token, 2);
    $iv = dc_b64url_decode($encodedIv);
    $data = dc_b64url_decode($encodedData);
    if (strlen($iv) !== 12 || strlen($data) < 17) {
        throw new RuntimeException('invalid');
    }
    $tag = substr($data, -16);
    $ciphertext = substr($data, 0, -16);
    $plaintext = openssl_decrypt($ciphertext, 'aes-256-gcm', dc_key($secret), OPENSSL_RAW_DATA, $iv, $tag, DC_HANDOFF_AAD);
    if ($plaintext === false) {
        throw new RuntimeException('invalid');
    }
    $payload = json_decode($plaintext, true, 32, JSON_THROW_ON_ERROR);
    if (!is_array($payload) || ($payload['v'] ?? null) !== 1 || !is_int($payload['issued'] ?? null) ||
        !is_int($payload['expires'] ?? null) || $payload['issued'] > $now + 60000 ||
        $payload['expires'] !== $payload['issued'] + DC_HANDOFF_TTL_MS || $payload['expires'] <= $now) {
        throw new RuntimeException('invalid');
    }
    return dc_validate_fields($payload['fields'] ?? null);
}

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$isWebsite = in_array($origin, $websiteOrigins, true);
$isBooking = in_array($origin, $bookingOrigins, true);
if (!$isWebsite && !$isBooking) {
    dc_json(403, ['error' => 'origin']);
}
header('Access-Control-Allow-Origin: ' . $origin);
header('Access-Control-Allow-Headers: content-type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Vary: Origin');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    dc_json(405, ['error' => 'method']);
}

$raw = file_get_contents('php://input', false, null, 0, 16385);
if ($raw === false || strlen($raw) > 16384) {
    dc_json(413, ['error' => 'size']);
}

// Preferred production setup: /home/customer/www/<host>/private, next to
// public_html. The optional environment variable is useful for local testing.
if (!function_exists('openssl_encrypt') || !function_exists('openssl_decrypt')) {
    dc_json(503, ['error' => 'crypto_unavailable']);
}
$secret = getenv('DC_BOOKING_HANDOFF_SECRET') ?: '';
$privateFile = dirname((string) ($_SERVER['DOCUMENT_ROOT'] ?? __DIR__)) . '/private/booking-handoff-secret.php';
if ($secret === '' && is_file($privateFile)) {
    $loaded = require $privateFile;
    $secret = is_string($loaded) ? $loaded : '';
}
if (strlen($secret) < 32) {
    dc_json(503, ['error' => 'unavailable']);
}

try {
    $body = json_decode($raw, true, 32, JSON_THROW_ON_ERROR);
    $now = (int) floor(microtime(true) * 1000);
    if (($body['action'] ?? null) === 'seal' && $isWebsite) {
        dc_json(200, ['token' => dc_seal($body['fields'] ?? [], $secret, $now)]);
    }
    if (($body['action'] ?? null) === 'unseal' && $isBooking && is_string($body['token'] ?? null)) {
        dc_json(200, ['fields' => dc_unseal($body['token'], $secret, $now)]);
    }
    dc_json(400, ['error' => 'invalid']);
} catch (Throwable) {
    // Do not log or return payloads, tokens, decryption details or the key.
    dc_json(400, ['error' => 'invalid_or_expired']);
}
