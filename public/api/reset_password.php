<?php
// public/api/reset_password.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ NEW: Add Rate Limiting (10 attempts per minute)
// We allow slightly more attempts here in case of typos, but block spam bots.
require_once 'rate_limit.php';
checkRateLimit(10, 60);

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->token) && isset($data->email) && isset($data->new_password)) {
    $now = date("Y-m-d H:i:s");

    // 1. Verify Token
    $stmt = $conn->prepare("SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > ?");
    $stmt->execute([$data->email, $data->token, $now]);

    if($stmt->rowCount() > 0) {
        $hash = password_hash($data->new_password, PASSWORD_DEFAULT);

        // ✅ ACCOUNT UNLOCK FIX:
        // We update the password AND reset 'failed_login_attempts' to 0 simultaneously.
        // This ensures the user is not still locked out after resetting their password.
        $conn->prepare("UPDATE admin_users SET password_hash = ?, failed_login_attempts = 0 WHERE email = ?")->execute([$hash, $data->email]);

        // 2. Delete the used token so it cannot be used again
        $conn->prepare("DELETE FROM password_resets WHERE email = ?")->execute([$data->email]);

        echo json_encode(["status" => "success", "message" => "Password reset successful. Account unlocked."]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid or expired token."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing required fields."]);
}
?>