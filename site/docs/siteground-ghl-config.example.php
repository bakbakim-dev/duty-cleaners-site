<?php
// Install as ../private/ghl-config.php, outside public_html.
// Never place the real values in the repository or public website folder.
return [
    'token' => 'PASTE_THE_ROTATED_GHL_PRIVATE_INTEGRATION_TOKEN_HERE',
    'encryption_key' => 'GENERATE_A_RANDOM_64_CHARACTER_SECRET',
    'retry_secret' => 'GENERATE_A_DIFFERENT_RANDOM_64_CHARACTER_SECRET',
    'queue_dir' => __DIR__ . '/ghl-queue',
    'form_health_config' => __DIR__ . '/form-health-config.php',
    'form_health_url' => 'https://dutycleaners.ca/api/form-health.php',
];
