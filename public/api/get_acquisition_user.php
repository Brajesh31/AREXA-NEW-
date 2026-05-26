<?php
// public/api/get_acquisition_user.php
// 📊 ACQUISITION MODULE: USER SOURCE (First Touch)
// Analyzes the FIRST session of every user to see what channel brings in fresh blood.

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$days = isset($_GET['range']) ? intval($_GET['range']) : 30;

try {
    // Logic: We look at dim_visitors joined with their FIRST session info
    // We derive 'Channel' from the referrer of their first session.

    $sql = "
        SELECT
            CASE
                WHEN s.referrer_url IS NULL OR s.referrer_url = '' THEN 'Direct'
                WHEN s.referrer_url LIKE '%google%' THEN 'Organic Search'
                WHEN s.referrer_url LIKE '%bing%' THEN 'Organic Search'
                WHEN s.referrer_url LIKE '%facebook%' OR s.referrer_url LIKE '%t.co%' OR s.referrer_url LIKE '%linkedin%' THEN 'Social'
                ELSE 'Referral'
            END as channel_group,
            COUNT(DISTINCT v.visitor_id) as new_users,
            ROUND(AVG(v.ltv_score), 2) as avg_ltv
        FROM dim_visitors v
        JOIN dim_sessions s ON v.visitor_id = s.visitor_id
        WHERE v.first_seen >= NOW() - INTERVAL $days DAY
        AND s.start_time = v.first_seen -- Only count their very first moment
        GROUP BY channel_group
        ORDER BY new_users DESC
    ";

    $channels = $conn->query($sql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "channels" => $channels
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>