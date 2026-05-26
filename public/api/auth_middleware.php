<?php
// public/api/auth_middleware.php

function verifySession($conn) {
    // 1. Get Token from Headers
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';

    // Check if the header starts with "Bearer "
    if (!preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(["error" => "No token provided"]);
        exit();
    }

    $token = $matches[1];

    // 2. Anti-Hacking: Clean the token
    $token = htmlspecialchars(strip_tags($token));

    try {
        // 3. Check DB: Is this token valid AND not expired?
        // We now fetch 'role' as well to use it for permission checks
        $stmt = $conn->prepare("SELECT id, role FROM admin_users WHERE session_token = ? AND token_expiry > NOW()");
        $stmt->execute([$token]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            // FAILED: Either time ran out OR you logged in somewhere else
            http_response_code(401);
            echo json_encode(["error" => "Session expired or invalid. Please login again."]);
            exit();
        }

        // 4. SUCCESS: Reset the 30-minute timer (Rolling Session)
        // Changed from 10 MINUTE to 30 MINUTE as requested
        $update = $conn->prepare("UPDATE admin_users SET token_expiry = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE id = ?");
        $update->execute([$user['id']]);

        // Return ARRAY with ID and Role (Crucial for the next step)
        return ["id" => $user['id'], "role" => $user['role']];

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(["error" => "Auth Error"]);
        exit();
    }
}
?>