<?php
declare(strict_types=1);

/*
 * The booking link in the "finish booking" text (owner, 2026-09-25).
 *
 * .htaccess rewrites https://dutycleaners.ca/r/<code> here. The code names a
 * confirmed quote the lead relay saved (ghl-quote.php, dc_ghl_resume_link).
 * The customer lands on BookingKoala's booking page with that quote's
 * selections, and their name, email and phone sealed in a fresh 20-minute
 * handoff that the booking page's header script unseals, exactly as when they
 * came from the funnel. An unknown, expired or unreadable code, or any error,
 * still lands on the booking page, just without the answers: a text-message
 * link must never show an error page.
 */
define('DC_GHL_LIBRARY', true);
define('DC_HANDOFF_LIBRARY', true);
require __DIR__ . '/ghl-quote.php';
require __DIR__ . '/booking-handoff.php';

function dc_resume_go(string $url): never
{
    header('Cache-Control: no-store');
    header('Referrer-Policy: no-referrer');
    header('X-Robots-Tag: noindex, nofollow');
    header('Location: ' . $url, true, 302);
    exit;
}

$fallback = DC_GHL_BOOKING_ORIGIN . '/booknow';
if (!in_array($_SERVER['REQUEST_METHOD'] ?? '', ['GET', 'HEAD'], true)) {
    http_response_code(405);
    header('Allow: GET, HEAD');
    exit;
}
$code = is_string($_GET['c'] ?? null) ? $_GET['c'] : '';

try {
    $config = dc_ghl_config();
    if (dc_ghl_rate_limited($config)) dc_resume_go($fallback);
    $resume = dc_ghl_resume_open($config, $code);
    if ($resume === null) dc_resume_go($fallback);
    $url = $fallback . ($resume['query'] !== '' ? '?' . $resume['query'] : '');
    $secret = dc_handoff_secret();
    if ($resume['fields'] !== [] && strlen($secret) >= 32) {
        try {
            $url .= '#dc_handoff=' . dc_seal($resume['fields'], $secret, (int) floor(microtime(true) * 1000));
        } catch (Throwable) {
            // The selections alone still save the customer most of the typing.
        }
    }
    dc_resume_go($url);
} catch (Throwable) {
    dc_resume_go($fallback);
}
