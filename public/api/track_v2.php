<?php
// public/api/track_v2.php
// HANDLES: Cookies, Visits, Unique IPs, Consent, AND CLICKS

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

require 'db.php';

$data = json_decode(file_get_contents("php://input"));
$action = $_GET['action'] ?? '';

// =========================================================
// ACTION A: INITIALIZE SESSION (Page Load)
// =========================================================
if ($action === 'init') {
    $clientIP = $_SERVER['REMOTE_ADDR'];
    $clientToken = $data->token ?? null;

    // 1. New User (No Token)
    if (!$clientToken) {
        $newToken = bin2hex(random_bytes(32));
        $expires = date('Y-m-d H:i:s', strtotime('+1 year'));

        // Create "Pending" row. If they decline later, we DELETE this.
        $stmt = $conn->prepare("INSERT INTO visitor_sessions (ip_address, cookie_token, expires_at, consent_status) VALUES (?, ?, ?, 'pending')");
        $stmt->execute([$clientIP, $newToken, $expires]);

        echo json_encode(["status" => "new_user", "token" => $newToken, "consent" => "pending"]);
    }
    // 2. Returning User (Has Token)
    else {
        $stmt = $conn->prepare("SELECT consent_status FROM visitor_sessions WHERE cookie_token = ?");
        $stmt->execute([$clientToken]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // User exists in DB (Must have accepted previously)
            echo json_encode(["status" => "returning", "token" => $clientToken, "consent" => $user['consent_status']]);
        } else {
            // Token sent but NOT in DB?
            // This happens if they declined last time (row was deleted).
            // Treat as NEW USER -> Show Popup Again.
            $newToken = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', strtotime('+1 year'));

            $stmt = $conn->prepare("INSERT INTO visitor_sessions (ip_address, cookie_token, expires_at, consent_status) VALUES (?, ?, ?, 'pending')");
            $stmt->execute([$clientIP, $newToken, $expires]);

            echo json_encode(["status" => "reset", "token" => $newToken, "consent" => "pending"]);
        }
    }
}

// =========================================================
// ACTION B: UPDATE CONSENT (Popup Click) - ✅ UPDATED LOGIC
// =========================================================
elseif ($action === 'consent') {
    $token = $data->token;
    $choice = $data->choice;

    if ($token) {
        if ($choice === 'accepted') {
            // ACCEPTED: Save for 1 Year
            $newExpiry = date('Y-m-d H:i:s', strtotime('+1 year'));
            $stmt = $conn->prepare("UPDATE visitor_sessions SET consent_status = 'accepted', expires_at = ? WHERE cookie_token = ?");
            $stmt->execute([$newExpiry, $token]);
            echo json_encode(["status" => "success", "message" => "Consent saved for 1 year"]);
        }
        elseif ($choice === 'declined') {
            // DECLINED: Delete immediately!
            // Next time they visit, they won't exist in DB, so popup will show.
            $stmt = $conn->prepare("DELETE FROM visitor_sessions WHERE cookie_token = ?");
            $stmt->execute([$token]);
            echo json_encode(["status" => "success", "message" => "User deleted from records"]);
        }
    }
}

// =========================================================
// ACTION C: TRACK CLICK (Blog or Insight Click)
// =========================================================
elseif ($action === 'click') {
    $type = $data->type;
    $id = $data->id;

    if ($type && $id) {
        $table = ($type === 'blog') ? 'blogs' : 'case_studies';
        try {
            $sql = "UPDATE $table SET real_clicks = real_clicks + 1 WHERE id = ?";
            $stmt = $conn->prepare($sql);
            $stmt->execute([$id]);
            echo json_encode(["status" => "success"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error"]);
        }
    }
}
?>