<?php
// public/api/get_acquisition_overview.php
// 📊 ACQUISITION MODULE: OVERVIEW
// High-level summary of how the user base is growing.

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$days = isset($_GET['range']) ? intval($_GET['range']) : 30;

try {
    // 1. KPI CARDS
    $kpiSql = "
        SELECT
            COUNT(DISTINCT visitor_id) as total_users,
            (SELECT COUNT(*) FROM dim_visitors WHERE first_seen >= NOW() - INTERVAL $days DAY) as new_users,
            COUNT(session_id) as sessions
        FROM dim_sessions
        WHERE start_time >= NOW() - INTERVAL $days DAY
    ";
    $kpi = $conn->query($kpiSql)->fetch(PDO::FETCH_ASSOC);

    // 2. GROWTH TREND (Users vs New Users)
    $trendSql = "
        SELECT
            DATE(start_time) as date,
            COUNT(DISTINCT visitor_id) as users,
            SUM(CASE WHEN visitor_id IN (SELECT visitor_id FROM dim_visitors WHERE DATE(first_seen) = DATE(start_time)) THEN 1 ELSE 0 END) as new_users
        FROM dim_sessions
        WHERE start_time >= NOW() - INTERVAL $days DAY
        GROUP BY DATE(start_time)
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