<?php
// public/api/db.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

// ✅ NEW: GLOBAL SECURITY HEADERS
// Since this file is used by every API endpoint, we enforce security here.
header("X-Frame-Options: DENY");                                     // Prevents Clickjacking (Can't be embedded in frames)
header("X-Content-Type-Options: nosniff");                           // Prevents MIME-sniffing attacks
header("X-XSS-Protection: 1; mode=block");                           // Stops Cross-Site Scripting
header("Strict-Transport-Security: max-age=31536000; includeSubDomains"); // Forces HTTPS
header("Referrer-Policy: strict-origin-when-cross-origin");          // Protects privacy of traffic sources

// Handle pre-flight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 🔒 SECURITY: Read credentials from the hidden config.ini file
// We go up two levels: from /api/ -> /public_html/ -> /files/ (Root)
$configPath = __DIR__ . '/../../config.ini';

// Check if the file exists before trying to read it
if (!file_exists($configPath)) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Server Configuration Error: config file missing."]);
    exit();
}

// Parse the file
$config = parse_ini_file($configPath);

try {
    // Connect using the credentials from the hidden file
    $conn = new PDO(
        "mysql:host=" . $config['host'] . ";dbname=" . $config['db_name'],
        $config['username'],
        $config['password']
    );

    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch(PDOException $e) {
    // If connection fails, show a generic error (never show the real password/error)
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database connection failed."]);
    exit();
}
?>