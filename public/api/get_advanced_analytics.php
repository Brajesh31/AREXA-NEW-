<?php
// public/api/get_advanced_analytics.php
// 🧠 PHASE 4: THE QUERY ENGINE
// A flexible API that generates reports from the Data Warehouse.

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'db.php';

// Get Query Parameters
$view = $_GET['view'] ?? 'overview'; // 'overview', 'realtime', 'acquisition', 'behavior'
$range = $_GET['range'] ?? '7d';     // '24h', '7d', '30d', 'custom'
$start = $_GET['start'] ?? null;
$end   = $_GET['end'] ?? null;

// Helper: Date Logic
$dateCondition = "event_timestamp >= NOW() - INTERVAL 7 DAY"; // Default
if ($range === '24h') $dateCondition = "event_timestamp >= NOW() - INTERVAL 24 HOUR";
if ($range === '30d') $dateCondition = "event_timestamp >= NOW() - INTERVAL 30 DAY";
if ($range === 'custom' && $start && $end) {
    $dateCondition = "event_timestamp BETWEEN '$start' AND '$end'";
}

try {
    $response = ["status" => "success", "meta" => ["view" => $view, "range" => $range]];

    // --- 1. REAL-TIME WAR ROOM (Last 30 Minutes) ---
    if ($view === 'realtime') {
        // Active Users (Heartbeats in last 5 mins)
        $activeSql = "SELECT COUNT(DISTINCT visitor_id) as c FROM fact_events WHERE event_timestamp >= NOW() - INTERVAL 5 MINUTE";
        $response['active_users'] = $conn->query($activeSql)->fetchColumn();

        // Live Feed (Last 50 Actions)
        $feedSql = "
            SELECT e.event_name, e.page_url, e.event_timestamp, s.city, s.country, s.device_type
            FROM fact_events e
            JOIN dim_sessions s ON e.session_id = s.session_id
            WHERE e.event_timestamp >= NOW() - INTERVAL 30 MINUTE
            ORDER BY e.event_timestamp DESC LIMIT 50
        ";
        $response['live_feed'] = $conn->query($feedSql)->fetchAll(PDO::FETCH_ASSOC);

        // Top Active Pages
        $pagesSql = "
            SELECT page_url, COUNT(*) as hits
            FROM fact_events
            WHERE event_timestamp >= NOW() - INTERVAL 30 MINUTE
            GROUP BY page_url ORDER BY hits DESC LIMIT 5
        ";
        $response['top_pages'] = $conn->query($pagesSql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- 2. ACQUISITION REPORT (Where do they come from?) ---
    else if ($view === 'acquisition') {
        // Sessions by Source
        $sql = "
            SELECT
                COALESCE(utm_source, referrer_domain, 'Direct') as source,
                COUNT(session_id) as sessions,
                COUNT(DISTINCT visitor_id) as users
            FROM dim_sessions
            WHERE start_time >= NOW() - INTERVAL 30 DAY
            GROUP BY source
            ORDER BY sessions DESC
            LIMIT 10
        ";
        $response['sources'] = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

        // Device Breakdown
        $devSql = "SELECT device_type, COUNT(*) as count FROM dim_sessions GROUP BY device_type";
        $response['devices'] = $conn->query($devSql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- 3. BEHAVIOR REPORT (What do they do?) ---
    else if ($view === 'behavior') {
        // Top Events (Clicks, Scrolls)
        $evtSql = "
            SELECT event_name, COUNT(*) as count
            FROM fact_events
            WHERE $dateCondition
            GROUP BY event_name
            ORDER BY count DESC LIMIT 10
        ";
        $response['events'] = $conn->query($evtSql)->fetchAll(PDO::FETCH_ASSOC);

        // Core Web Vitals (Performance)
        $perfSql = "
            SELECT metric_name, AVG(metric_value) as avg_val
            FROM fact_performance
            GROUP BY metric_name
        ";
        $response['performance'] = $conn->query($perfSql)->fetchAll(PDO::FETCH_ASSOC);
    }

    // --- 4. OVERVIEW (The Big Picture) ---
    else {
        // Main Graph Data (Sessions over Time)
        // Group by Day for > 24h, Hour for <= 24h
        $groupBy = ($range === '24h') ? "HOUR(start_time)" : "DATE(start_time)";
        $label = ($range === '24h') ? "CONCAT(HOUR(start_time), ':00')" : "DATE_FORMAT(start_time, '%Y-%m-%d')";

        $graphSql = "
            SELECT $label as time_label, COUNT(*) as sessions
            FROM dim_sessions
            WHERE start_time >= NOW() - INTERVAL 30 DAY
            GROUP BY $groupBy
            ORDER BY start_time ASC
        ";
        $response['chart'] = $conn->query($graphSql)->fetchAll(PDO::FETCH_ASSOC);

        // Big Numbers
        $response['total_sessions'] = $conn->query("SELECT COUNT(*) FROM dim_sessions")->fetchColumn();
        $response['total_events'] = $conn->query("SELECT COUNT(*) FROM fact_events")->fetchColumn();

        // Bounce Rate Calculation (Sessions with only 1 event)
        // Note: This is an approximation for speed
        $bounced = $conn->query("
            SELECT COUNT(s.session_id)
            FROM dim_sessions s
            JOIN (SELECT session_id, COUNT(*) as c FROM fact_events GROUP BY session_id HAVING c=1) e ON s.session_id = e.session_id
        ")->fetchColumn();

        $totalS = max(1, $response['total_sessions']);
        $response['bounce_rate'] = round(($bounced / $totalS) * 100, 1);
    }

    echo json_encode($response);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>