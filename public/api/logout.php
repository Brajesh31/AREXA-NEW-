<?php
// public/api/logout.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Handle pre-flight request (Browser check)
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

require 'db.php';

// 1. Get the Token from the Browser
$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';

// Check if a token was actually sent
if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
    $token = $matches[1];

    // 2. KILL THE SESSION IN THE DATABASE
    // This wipes the token from the user's record.
    // Even if someone stole the old token, it is now useless.
    $stmt = $conn->prepare("UPDATE admin_users SET session_token = NULL, token_expiry = NULL WHERE session_token = ?");
    $stmt->execute([$token]);

    echo json_encode(["status" => "success", "message" => "Logged out securely."]);
} else {
    // If no token was sent, we just say "Success" so the browser can proceed to clear its own cache.
    echo json_encode(["status" => "success", "message" => "No active session found."]);
}
?>