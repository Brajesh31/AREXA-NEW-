<?php
// public/api/get_user_audiences.php
// 🎯 USER: AUDIENCES (Segmentation)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

try {
    // 1. SEGMENTATION TIERS
    // We group users by their total visit count
    $tiers = [
        'New (1 visit)' => 0,
        'Returning (2-9 visits)' => 0,
        'Loyal (10-49 visits)' => 0,
        'Fanatic (50+ visits)' => 0
    ];

    $sql = "SELECT total_visits FROM visitor_stats";
    $stmt = $conn->query($sql);

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $v = intval($row['total_visits']);
        if ($v === 1) $tiers['New (1 visit)']++;
        elseif ($v < 10) $tiers['Returning (2-9 visits)']++;
        elseif ($v < 50) $tiers['Loyal (10-49 visits)']++;
        else $tiers['Fanatic (50+ visits)']++;
    }

    // Format for Chart
    $chartData = [];
    foreach ($tiers as $k => $v) {
        $chartData[] = ['name' => $k, 'value' => $v];
    }

    // 2. RECENT WHALES (Top Users List)
    $whaleSql = "
        SELECT ip_address, country, city, total_visits, last_seen
        FROM visitor_stats
        WHERE total_visits > 5
        ORDER BY last_seen DESC
        LIMIT 10
    ";
    $whales = $conn->query($whaleSql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "segments" => $chartData,
        "whales" => $whales
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>