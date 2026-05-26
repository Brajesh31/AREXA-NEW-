<?php
// public/api/record_tech_details.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) { echo json_encode(["status" => "error"]); exit; }

$visitorId = md5($_SERVER['REMOTE_ADDR']);
$sessionId = 'tech_' . substr(md5(session_id() . $_SERVER['REMOTE_ADDR']), 0, 10);

try {
    // Only save once per 24 hours per visitor to prevent database bloating
    $check = $conn->prepare("SELECT id FROM fact_tech_fingerprints WHERE visitor_id = ? AND captured_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
    $check->execute([$visitorId]);

    if (!$check->fetch()) {
        // Create the record
        $stmt = $conn->prepare("INSERT INTO fact_tech_fingerprints (visitor_id, session_id, screen_resolution, viewport_size, pixel_ratio, gpu_renderer, browser_language, connection_type, captured_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $visitorId,
            $sessionId,
            $data['screen_resolution'] ?? 'unknown',
            $data['viewport_size'] ?? 'unknown',
            $data['pixel_ratio'] ?? 1,
            $data['gpu_renderer'] ?? 'unknown',
            $data['browser_language'] ?? 'en',
            $data['connection_type'] ?? 'unknown'
        ]);
    }
    echo json_encode(["status" => "success"]);
} catch (Exception $e) {
    // If table missing, it fails silently
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>