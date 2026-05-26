<?php
// public/api/get_engagement_events.php
// 🧩 ENGAGEMENT: EVENT BREAKDOWN

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$days = isset($_GET['range']) ? intval($_GET['range']) : 30;

try {
    $sql = "
        SELECT
            event_name,
            COUNT(*) as event_count,
            COUNT(DISTINCT visitor_id) as total_users,
            ROUND(COUNT(*) / COUNT(DISTINCT visitor_id), 1) as events_per_user
        FROM fact_events
        WHERE event_timestamp >= NOW() - INTERVAL $days DAY
        GROUP BY event_name
        ORDER BY event_count DESC
        LIMIT 20
    ";

    $events = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "events" => $events
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>