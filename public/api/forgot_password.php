<?php
// public/api/forgot_password.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ NEW: Add Rate Limiting (3 attempts per minute)
// This prevents hackers from spamming reset emails to annoy users.
require_once 'rate_limit.php';
checkRateLimit(3, 60);

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email)) {
    $email = $data->email;

    // 1. Check if user exists
    $stmt = $conn->prepare("SELECT id FROM admin_users WHERE email = ?");
    $stmt->execute([$email]);

    if($stmt->rowCount() > 0) {
        // 2. Generate Reset Token
        $token = bin2hex(random_bytes(50));
        $expiry = date("Y-m-d H:i:s", strtotime('+1 hour'));

        // 3. Save to DB
        $conn->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)")->execute([$email, $token, $expiry]);

        // 4. Send Email
        $link = "https://arexa.co/admin/reset-password?token=$token&email=$email";
        $subject = "Admin Password Reset - Arexa";
        $message = "Secure Reset Link: " . $link;
        $headers = "From: security@arexa.co";

        mail($email, $subject, $message, $headers);
    }

    // Always return success so hackers can't check which emails exist (Security Best Practice)
    echo json_encode(["status" => "success", "message" => "If this email exists, a reset link has been sent."]);
}
?>