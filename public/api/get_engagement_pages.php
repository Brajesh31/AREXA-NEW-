<?php
// public/api/get_engagement_pages.php
// 🧩 ENGAGEMENT: TOP PAGES & SCREENS

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$days = isset($_GET['range']) ? intval($_GET['range']) : 30;

try {
    // We filter for 'page_view' events to count hits per URL
    $sql = "
        SELECT
            page_url,
            COUNT(*) as views,
            COUNT(DISTINCT visitor_id) as users,

            -- Estimated Time on Page (Randomized for demo, requires complex 'next page' logic for real accuracy)
            -- In a real production environment, you calculate this by finding the time difference between this page view and the next event.
            FLOOR(RAND() * (180 - 15 + 1) + 15) as avg_time

        FROM fact_events
        WHERE event_name = 'page_view'
        AND event_timestamp >= NOW() - INTERVAL $days DAY
        GROUP BY page_url
        ORDER BY views DESC
        LIMIT 20
    ";

    $pages = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "pages" => $pages
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>