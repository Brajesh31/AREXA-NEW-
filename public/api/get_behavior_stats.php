<?php
// public/api/get_behavior_stats.php
// 🧠 PHASE 6: BEHAVIOR ENGINE (Heatmaps & Flows)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

try {
    // 1. SCROLL DEPTH ANALYSIS
    // Calculate average scroll depth per page
    $scrollSql = "
        SELECT
            page_url,
            COUNT(*) as total_views,
            SUM(CASE WHEN event_properties LIKE '%25%' THEN 1 ELSE 0 END) as s25,
            SUM(CASE WHEN event_properties LIKE '%50%' THEN 1 ELSE 0 END) as s50,
            SUM(CASE WHEN event_properties LIKE '%75%' THEN 1 ELSE 0 END) as s75,
            SUM(CASE WHEN event_properties LIKE '%90%' THEN 1 ELSE 0 END) as s90
        FROM fact_events
        WHERE event_name = 'scroll_depth' OR event_name = 'page_view'
        GROUP BY page_url
        ORDER BY total_views DESC
        LIMIT 5
    ";
    $scrollData = $conn->query($scrollSql)->fetchAll(PDO::FETCH_ASSOC);

    // 2. TOP CLICKED ELEMENTS (Interaction Heatmap)
    // Extracts the 'text' property from JSON
    $clickSql = "
        SELECT
            JSON_UNQUOTE(JSON_EXTRACT(event_properties, '$.text')) as btn_text,
            COUNT(*) as clicks
        FROM fact_events
        WHERE event_name = 'click'
        GROUP BY btn_text
        ORDER BY clicks DESC
        LIMIT 10
    ";
    $clickData = $conn->query($clickSql)->fetchAll(PDO::FETCH_ASSOC);

    // 3. EXIT PAGES (Leakage)
    // Last page visited in a session
    $exitSql = "
        SELECT page_url, COUNT(*) as exits
        FROM fact_events e1
        WHERE event_timestamp = (
            SELECT MAX(event_timestamp)
            FROM fact_events e2
            WHERE e2.session_id = e1.session_id
        )
        GROUP BY page_url
        ORDER BY exits DESC
        LIMIT 5
    ";
    $exitData = $conn->query($exitSql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "scrolls" => $scrollData,
        "clicks" => $clickData,
        "exits" => $exitData
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>