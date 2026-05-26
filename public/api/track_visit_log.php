<?php
// public/api/track_visit_log.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Content-Type: application/json");

// Enable error reporting for debugging (Remove in production if desired)
ini_set('display_errors', 0);
error_reporting(E_ALL);

require 'db.php';

$ip = $_SERVER['REMOTE_ADDR'];
$now = time();

// --- ROBUST GEO FUNCTION ---
function getGeoLocation($ip) {
    // If running on localhost, return dummy data
    if ($ip === '127.0.0.1' || $ip === '::1') {
        return ['code' => 'XX', 'country' => 'Localhost', 'region' => 'Local', 'city' => 'Local'];
    }

    $url = "http://ip-api.com/json/" . $ip . "?fields=status,country,countryCode,regionName,city";

    // Use try/catch style logic for cURL
    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 2); // 2 second timeout max
        $response = curl_exec($ch);

        if (curl_errno($ch)) {
            return ['code' => 'XX', 'country' => 'Unknown', 'region' => 'Unknown', 'city' => 'Unknown'];
        }
        curl_close($ch);

        $data = json_decode($response, true);
        if ($data && isset($data['status']) && $data['status'] === 'success') {
            return [
                'code'    => $data['countryCode'] ?? 'XX',
                'country' => $data['country'] ?? 'Unknown',
                'region'  => $data['regionName'] ?? 'Unknown',
                'city'    => $data['city'] ?? 'Unknown'
            ];
        }
    } catch (Exception $e) {
        // Ignore errors, just return unknown
    }

    return ['code' => 'XX', 'country' => 'Unknown', 'region' => 'Unknown', 'city' => 'Unknown'];
}

try {
    // 1. Get existing data
    $stmt = $conn->prepare("SELECT * FROM visitor_stats WHERE ip_address = ?");
    $stmt->execute([$ip]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    $history = $row ? (json_decode($row['visit_history'], true) ?? []) : [];
    $history[] = $now;

    // 2. Calculate Rolling Window
    $c24h = 0; $c7d = 0; $c30d = 0; $c90d = 0; $c365d = 0;
    $cleanHistory = [];

    foreach ($history as $time) {
        $age = $now - $time;
        if ($age <= 31536000) {
            $cleanHistory[] = $time;
            if ($age <= 86400) $c24h++;
            if ($age <= 604800) $c7d++;
            if ($age <= 2592000) $c30d++;
            if ($age <= 7776000) $c90d++;
            $c365d++;
        }
    }

    $total = count($cleanHistory);
    $jsonHistory = json_encode($cleanHistory);

    // 3. SAVE DATA
    if ($row) {
        // Update Existing
        $sql = "UPDATE visitor_stats SET
                visits_24h=?, visits_7d=?, visits_30d=?, visits_90d=?, visits_365d=?,
                total_visits=?, last_seen=NOW(), visit_history=?
                WHERE ip_address=?";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$c24h, $c7d, $c30d, $c90d, $c365d, $total, $jsonHistory, $ip]);
    } else {
        // New Visitor
        $geo = getGeoLocation($ip);

        // A. Insert into Main Stats
        $sql = "INSERT INTO visitor_stats (ip_address, country, city, region, visits_24h, visits_7d, visits_30d, visits_90d, visits_365d, total_visits, visit_history)
                VALUES (?, ?, ?, ?, 1, 1, 1, 1, 1, 1, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->execute([$ip, $geo['country'], $geo['city'], $geo['region'], $jsonHistory]);

        // B. Insert into City Records
        $sqlCity = "INSERT IGNORE INTO geo_city_records (ip_address, country_code, city, region) VALUES (?, ?, ?, ?)";
        $conn->prepare($sqlCity)->execute([$ip, $geo['code'], $geo['city'], $geo['region']]);

        // C. Update Country List
        $sqlCountry = "INSERT INTO geo_countries (country_code, country_name, total_visitors) VALUES (?, ?, 1)
                       ON DUPLICATE KEY UPDATE total_visitors = total_visitors + 1";
        $conn->prepare($sqlCountry)->execute([$geo['code'], $geo['country']]);
    }

    // =============================================================
    // 🌉 BRIDGE TO NEW ANALYTICS (MNC System)
    // Automatically syncs this visit to the new tables
    // =============================================================
    try {
        // 1. Define ID
        $visitorId_new = md5($ip); // Consistent ID based on IP
        $sessionId_new = "sess_" . uniqid();

        // 2. Sync Visitor
        $stmtMNC1 = $conn->prepare("
            INSERT INTO dim_visitors (visitor_id, first_seen, last_seen)
            VALUES (?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE last_seen = NOW()
        ");
        $stmtMNC1->execute([$visitorId_new]);

        // 3. Sync Session
        // Use geo data (fetch again to ensure availability for returning visitors)
        $geoMNC = getGeoLocation($ip);

        $stmtMNC2 = $conn->prepare("
            INSERT INTO dim_sessions (session_id, visitor_id, start_time, ip_address, country, city)
            VALUES (?, ?, NOW(), ?, ?, ?)
        ");
        $stmtMNC2->execute([$sessionId_new, $visitorId_new, $ip, $geoMNC['country'], $geoMNC['city']]);

        // 4. Sync Event
        $stmtMNC3 = $conn->prepare("
            INSERT INTO fact_events (session_id, visitor_id, event_name, event_timestamp)
            VALUES (?, ?, 'session_start', NOW())
        ");
        $stmtMNC3->execute([$sessionId_new, $visitorId_new]);

    } catch (Exception $e) {
        // Silent fail so we don't break the old tracking
    }
    // =============================================================


    echo json_encode(["status" => "success", "ip" => $ip]);

} catch (PDOException $e) {
    // If database error, return it so we can see it in Network Tab
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>