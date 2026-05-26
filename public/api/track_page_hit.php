<?php
// public/api/track_page_hit.php
// ✅ PAGE TRACKER: Calculates 24h, 7d, 14d... 365d stats per URL

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");

require 'db.php';

// Get the clean URL (e.g., "/about" instead of "https://arexa.co/about")
$fullUrl = $_GET['url'] ?? '';
$pathOnly = parse_url($fullUrl, PHP_URL_PATH) ?? 'home';

// Use IP to ensure we are connecting to a valid visitor session (Optional security check)
$ip = $_SERVER['REMOTE_ADDR'];
$now = time();

try {
    // 1. Get existing stats for this SPECIFIC PAGE
    $stmt = $conn->prepare("SELECT * FROM page_analytics WHERE page_url = ?");
    $stmt->execute([$pathOnly]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $history = [];
    if ($row) {
        $history = json_decode($row['visit_history'], true) ?? [];
    }

    // 2. Add New Visit
    $history[] = $now;

    // 3. RE-CALCULATE SLIDING WINDOWS
    // Initialize counters
    $c24h = 0; $c7d = 0; $c14d = 0; $c30d = 0;
    $c60d = 0; $c90d = 0; $c120d = 0; $c180d = 0; $c365d = 0;

    $cleanHistory = [];

    foreach ($history as $time) {
        $age = $now - $time; // Seconds since visit

        // Logic: Keep only visits < 365 Days (Older data is deleted)
        if ($age <= 31536000) {
            $cleanHistory[] = $time;

            // Increment based on exact seconds
            if ($age <= 86400)    $c24h++;
            if ($age <= 604800)   $c7d++;
            if ($age <= 1209600)  $c14d++;
            if ($age <= 2592000)  $c30d++;
            if ($age <= 5184000)  $c60d++;
            if ($age <= 7776000)  $c90d++;
            if ($age <= 10368000) $c120d++;
            if ($age <= 15552000) $c180d++;
            $c365d++;
        }
    }

    $total = count($cleanHistory);
    $jsonHistory = json_encode($cleanHistory);

    // 4. SAVE TO DB
    if ($row) {
        $sql = "UPDATE page_analytics SET
                visits_24h=?, visits_7d=?, visits_14d=?, visits_30d=?,
                visits_60d=?, visits_90d=?, visits_120d=?, visits_180d=?, visits_365d=?,
                total_hits=?, last_visited=NOW(), visit_history=?
                WHERE page_url=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$c24h, $c7d, $c14d, $c30d, $c60d, $c90d, $c120d, $c180d, $c365d, $total, $jsonHistory, $pathOnly]);
    } else {
        $sql = "INSERT INTO page_analytics (page_url, visits_24h, visits_7d, visits_14d, visits_30d, visits_60d, visits_90d, visits_120d, visits_180d, visits_365d, total_hits, visit_history)
                VALUES (?, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$pathOnly, $jsonHistory]);
    }

    // =============================================================
    // 🌉 BRIDGE TO NEW ANALYTICS
    // Syncs page views to the new system
    // =============================================================

    try {
        $visitorId_new = md5($_SERVER['REMOTE_ADDR']);
        // We create a temporary session ID for page hits since we don't have the context here
        // (In a full React app, this session_id would be passed from localStorage)
        $sessionId_new = "hit_" . time() . "_" . substr($visitorId_new, 0, 5);

        $stmtMNC_Page = $conn->prepare("
            INSERT INTO fact_events (session_id, visitor_id, event_name, page_url, event_timestamp)
            VALUES (?, ?, 'page_view', ?, NOW())
        ");
        $stmtMNC_Page->execute([$sessionId_new, $visitorId_new, $pathOnly]);

    } catch (Exception $e) {
        // Silent fail so we don't break legacy tracking
    }
    // =============================================================

    echo json_encode(["status" => "tracked", "page" => $pathOnly]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>