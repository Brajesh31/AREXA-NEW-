<?php
// public/api/get_ip_stats.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Authorization");
header("Content-Type: application/json");

require 'db.php';

// (Optional) Add your Auth check here if this is for Admin only
// require 'auth_middleware.php';

try {
    // This MAGIC QUERY creates the columns you wanted on the fly     $sql = "
        SELECT
            ip_address,
            MAX(created_at) as last_seen,
            COUNT(*) as total_all_time,

            -- Calculate rolling windows instantly
            SUM(CASE WHEN created_at >= NOW() - INTERVAL 24 HOUR THEN 1 ELSE 0 END) as visits_24h,
            SUM(CASE WHEN created_at >= NOW() - INTERVAL 7 DAY THEN 1 ELSE 0 END) as visits_7d,
            SUM(CASE WHEN created_at >= NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) as visits_30d,
            SUM(CASE WHEN created_at >= NOW() - INTERVAL 90 DAY THEN 1 ELSE 0 END) as visits_90d,
            SUM(CASE WHEN created_at >= NOW() - INTERVAL 365 DAY THEN 1 ELSE 0 END) as visits_365d

        FROM visitor_logs
        GROUP BY ip_address
        ORDER BY last_seen DESC
        LIMIT 100; -- Show top 100 active IPs
    ";

    $stmt = $conn->query($sql);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Calculate Global Totals
    $totalVisitors = count($data); // Unique IPs
    $totalHits = array_sum(array_column($data, 'total_all_time'));

    echo json_encode([
        "summary" => [
            "unique_visitors" => $totalVisitors,
            "total_hits" => $totalHits
        ],
        "ip_details" => $data
    ]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>