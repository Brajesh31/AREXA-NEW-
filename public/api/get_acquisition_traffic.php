<?php
// public/api/get_acquisition_traffic.php
// 📊 ACQUISITION MODULE: TRAFFIC SOURCE (Session Scope)
// Analyzes ALL sessions to see which channels drive the most volume.

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$days = isset($_GET['range']) ? intval($_GET['range']) : 30;

try {
    // Logic: Analyzes every session's referrer
    $sql = "
        SELECT
            CASE
                WHEN referrer_url IS NULL OR referrer_url = '' THEN 'Direct'
                WHEN referrer_url LIKE '%google%' THEN 'Organic Search'
                WHEN referrer_url LIKE '%bing%' THEN 'Organic Search'
                WHEN referrer_url LIKE '%facebook%' OR referrer_url LIKE '%twitter%' OR referrer_url LIKE '%linkedin%' THEN 'Social'
                ELSE 'Referral'
            END as source_medium,
            COUNT(session_id) as sessions,
            COUNT(DISTINCT visitor_id) as users,
            -- Engagement: Sessions that lasted > 10 seconds (Simulated by checking event count > 1)
            ROUND((SUM(CASE WHEN (SELECT COUNT(*) FROM fact_events e WHERE e.session_id = dim_sessions.session_id) > 1 THEN 1 ELSE 0 END) / COUNT(session_id)) * 100, 1) as engagement_rate
        FROM dim_sessions
        WHERE start_time >= NOW() - INTERVAL $days DAY
        GROUP BY source_medium
        ORDER BY sessions DESC
    ";

    $traffic = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "traffic" => $traffic
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>