<?php
// public/api/get_engagement_overview.php
// 🧩 ENGAGEMENT: HIGH-LEVEL KPI & TRENDS

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$days = isset($_GET['range']) ? intval($_GET['range']) : 30;

try {
    // 1. KPI CARDS
    // Logic: Avg Engagement Time = Avg duration between first and last event of a session
    $kpiSql = "
        SELECT
            COUNT(*) as total_events,
            COUNT(DISTINCT session_id) as total_sessions,

            -- Complex Calc: Average Session Duration in Seconds
            ROUND(AVG(session_duration), 0) as avg_engagement_time,

            -- Events per Session
            ROUND(COUNT(*) / COUNT(DISTINCT session_id), 1) as events_per_session
        FROM (
            SELECT
                session_id,
                TIMESTAMPDIFF(SECOND, MIN(event_timestamp), MAX(event_timestamp)) as session_duration
            FROM fact_events
            WHERE event_timestamp >= NOW() - INTERVAL $days DAY
            GROUP BY session_id
        ) as session_stats
    ";
    $kpi = $conn->query($kpiSql)->fetch(PDO::FETCH_ASSOC);

    // 2. TREND CHART (Events vs Active Users)
    $trendSql = "
        SELECT
            DATE(event_timestamp) as date,
            COUNT(*) as event_count,
            COUNT(DISTINCT visitor_id) as active_users
        FROM fact_events
        WHERE event_timestamp >= NOW() - INTERVAL $days DAY
        GROUP BY DATE(event_timestamp)
        ORDER BY date ASC
    ";
    $trend = $conn->query($trendSql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "kpi" => $kpi,
        "trend" => $trend
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>