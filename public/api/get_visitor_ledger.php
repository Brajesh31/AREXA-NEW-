<?php
// public/api/get_visitor_ledger.php
// 🕵️ FORENSICS ENGINE: Granular User Data

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db.php';

try {
    // 1. KPI: USER CLASSIFICATION
    // ---------------------------
    $total = $conn->query("SELECT COUNT(*) FROM visitor_stats")->fetchColumn();
    $active = $conn->query("SELECT COUNT(*) FROM visitor_stats WHERE last_seen >= NOW() - INTERVAL 5 MINUTE")->fetchColumn();
    $returning = $conn->query("SELECT COUNT(*) FROM visitor_stats WHERE total_visits > 1")->fetchColumn();
    $whales = $conn->query("SELECT COUNT(*) FROM visitor_stats WHERE total_visits > 20")->fetchColumn();

    // 2. THE LEDGER (Recent 50 Users)
    // -------------------------------
    $sql = "
        SELECT
            id,
            ip_address,
            country,
            city,
            region,
            visits_24h,
            visits_7d,
            total_visits,
            last_seen,
            visit_history
        FROM visitor_stats
        ORDER BY last_seen DESC
        LIMIT 50
    ";
    $users = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    // 3. PROCESS USERS (Add Intelligence)
    // -----------------------------------
    $processedUsers = [];
    foreach ($users as $u) {
        // Decode history to generate sparkline data
        $history = json_decode($u['visit_history'], true) ?? [];
        $sparkline = [];

        // Simple sparkline: Count visits per day for last 7 days
        $now = time();
        for ($i = 6; $i >= 0; $i--) {
            $dayStart = $now - ($i * 86400);
            $dayEnd = $dayStart + 86400;
            $count = 0;
            foreach ($history as $ts) {
                if ($ts >= $dayStart && $ts < $dayEnd) $count++;
            }
            $sparkline[] = $count;
        }

        // Determine "Loyalty Tier"
        $tier = 'Newbie';
        if ($u['total_visits'] > 5) $tier = 'Returner';
        if ($u['total_visits'] > 20) $tier = 'Fanatic';
        if ($u['total_visits'] > 50) $tier = 'VIP';

        $processedUsers[] = [
            'id' => $u['id'],
            'ip' => $u['ip_address'], // In a real app, maybe mask this for privacy
            'location' => $u['city'] . ', ' . $u['country'],
            'flag' => $u['country'], // Country name for UI flag lookup
            'last_seen' => $u['last_seen'],
            'total_visits' => $u['total_visits'],
            'tier' => $tier,
            'sparkline' => $sparkline
        ];
    }

    echo json_encode([
        "status" => "success",
        "kpi" => [
            "total_db" => $total,
            "currently_online" => $active,
            "retention_rate" => $total > 0 ? round(($returning / $total) * 100, 1) : 0,
            "power_users" => $whales
        ],
        "ledger" => $processedUsers
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>