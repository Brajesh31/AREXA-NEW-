<?php
// public/api/login.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// ✅ NEW: Add Rate Limiting (5 attempts per 60 seconds)
// This protects your login page from brute-force attacks.
require_once 'rate_limit.php';
checkRateLimit(5, 60);

require 'db.php';

$data = json_decode(file_get_contents("php://input"));

if(isset($data->email) && isset($data->password)) {
    $inputEmail = $data->email;

    // 1. Fetch User (MySQL case-insensitive fetch)
    $stmt = $conn->prepare("SELECT * FROM admin_users WHERE email = ?");
    $stmt->execute([$inputEmail]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // If user doesn't exist, generic error (Security best practice)
    if (!$user) {
        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid credentials."]);
        exit();
    }

    // 2. CHECK LOCK STATUS (Security Requirement #4)
    // If they have 5 or more failed attempts, the account is LOCKED.
    if ($user['failed_login_attempts'] >= 5) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "Account Locked. Too many failed attempts. Please check your email to reset your password."]);
        exit();
    }

    // 3. VERIFY PASSWORD & STRICT EMAIL CASE (Requirement #1)
    if ($user['email'] === $inputEmail && password_verify($data->password, $user['password_hash'])) {

        // --- SUCCESS CASE ---

        // A. Reset failed attempts counter to 0 (Unlock if previously locked)
        $conn->prepare("UPDATE admin_users SET failed_login_attempts = 0 WHERE id = ?")->execute([$user['id']]);

        // B. Generate Token
        $token = bin2hex(random_bytes(32));

        // C. Update Session (30 Minutes) (Requirement #2)
        $update = $conn->prepare("UPDATE admin_users SET session_token = ?, token_expiry = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE id = ?");
        $update->execute([$token, $user['id']]);

        echo json_encode([
            "status" => "success",
            "token" => $token,
            "user" => ["id" => $user['id'], "email" => $user['email'], "role" => $user['role']]
        ]);

    } else {

        // --- FAILURE CASE ---

        // A. Increment failed attempts
        $newCount = $user['failed_login_attempts'] + 1;
        $conn->prepare("UPDATE admin_users SET failed_login_attempts = ? WHERE id = ?")->execute([$newCount, $user['id']]);

        // B. CHECK IF THIS WAS THE 5TH FAILURE
        if ($newCount >= 5) {
            // !!! TRIGGER AUTOMATIC PASSWORD RESET !!!

            // Generate Reset Token
            $resetToken = bin2hex(random_bytes(50));
            $expiry = date("Y-m-d H:i:s", strtotime('+1 hour'));

            // Save to DB
            $conn->prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)")->execute([$user['email'], $resetToken, $expiry]);

            // Send Email
            $link = "https://arexa.co/admin/reset-password?token=$resetToken&email=" . $user['email'];
            $subject = "SECURITY ALERT: Account Locked - Arexa";
            $message = "Your account has been locked due to 5 failed login attempts.\n\nTo regain access, you must reset your password immediately:\n" . $link;
            $headers = "From: security@arexa.co";

            mail($user['email'], $subject, $message, $headers);

            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Security Alert: 5 Failed Attempts. Account has been locked and a password reset link sent to your email."]);
        } else {
            // Standard Error (Show remaining attempts)
            $remaining = 5 - $newCount;
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid credentials. You have $remaining attempts remaining."]);
        }
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Missing email or password"]);
}
?>