<?php
// public/api/get_user_overview.php
// 👤 USER: OVERVIEW (Key User Metrics)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$days = isset($_GET['range']) ? intval($_GET['range']) : 30;

try {
    // 1. KPI CARDS
    // ✅ FIX: Changed 'visitor_id' to 'ip_address' to match visitor_stats table
    $kpiSql = "
        SELECT
            COUNT(DISTINCT ip_address) as total_users,

            -- Retention: Users seen in multiple sessions (total_visits > 1)
            ROUND((COUNT(DISTINCT CASE WHEN total_visits > 1 THEN ip_address END) / COUNT(DISTINCT ip_address)) * 100, 1) as retention_rate,

            -- Whales: Users with > 10 visits
            COUNT(DISTINCT CASE WHEN total_visits > 10 THEN ip_address END) as power_users,

            -- Average 'Lifetime' (Days between first and last seen)
            -- If first_seen doesn't exist in legacy, we estimate or use last_seen
            ROUND(AVG(DATEDIFF(last_seen, created_at)), 0) as avg_lifetime_days
        FROM visitor_stats
    ";

    // Check if 'created_at' exists, otherwise use fallback for lifetime
    // We wrap in try/catch for the specific query or just use a safer query
    try {
        $kpi = $conn->query($kpiSql)->fetch(PDO::FETCH_ASSOC);
    } catch (Exception $e) {
        // Fallback if created_at is missing
        $kpiSqlSafe = "
            SELECT
                COUNT(DISTINCT ip_address) as total_users,
                ROUND((COUNT(DISTINCT CASE WHEN total_visits > 1 THEN ip_address END) / COUNT(DISTINCT ip_address)) * 100, 1) as retention_rate,
                COUNT(DISTINCT CASE WHEN total_visits > 10 THEN ip_address END) as power_users,
                0 as avg_lifetime_days
            FROM visitor_stats
        ";
        $kpi = $conn->query($kpiSqlSafe)->fetch(PDO::FETCH_ASSOC);
    }

    // 2. DISTRIBUTION (Proxy for Demographics)
    $demoSql = "
        SELECT country as name, COUNT(*) as value
        FROM visitor_stats
        WHERE country != 'Unknown'
        GROUP BY country
        ORDER BY value DESC
        LIMIT 5
    ";
    $demographics = $conn->query($demoSql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "kpi" => $kpi,
        "distribution" => $demographics
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>