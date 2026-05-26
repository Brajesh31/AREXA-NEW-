<?php
// public/api/get_conversion_stats.php
// 📉 PHASE 5: CONVERSION ENGINE (Funnels & Cohorts)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

require 'db.php';

$type = $_GET['type'] ?? 'funnel'; // 'funnel' or 'cohort'

try {
    // --- 1. FUNNEL ANALYSIS ENGINE ---
    // Logic: Tracks users flowing through step A -> B -> C
    if ($type === 'funnel') {
        // Default Flow: Home -> Services -> Contact (You can make this dynamic later)
        $steps = [
            ['name' => 'Entry (Home)', 'url' => '/'],
            ['name' => 'Interest (Services)', 'url' => '/services'],
            ['name' => 'Action (Contact)', 'url' => '/contact']
        ];

        $funnelData = [];
        $prevCount = 0;

        foreach ($steps as $index => $step) {
            $url = $step['url'];

            if ($index === 0) {
                // Step 1: All unique visitors who visited this page in last 30d
                $sql = "SELECT COUNT(DISTINCT visitor_id) FROM fact_events
                        WHERE page_url LIKE ? AND event_timestamp >= NOW() - INTERVAL 30 DAY";
                $stmt = $conn->prepare($sql);
                $stmt->execute(["%$url%"]);
                $count = $stmt->fetchColumn();
            } else {
                // Step 2+: Visitors who visited this page AND the previous page
                // Note: For true sequence (A then B), we utilize time checks.
                $prevUrl = $steps[$index-1]['url'];
                $sql = "
                    SELECT COUNT(DISTINCT t2.visitor_id)
                    FROM fact_events t1
                    JOIN fact_events t2 ON t1.visitor_id = t2.visitor_id
                    WHERE t1.page_url LIKE ?
                    AND t2.page_url LIKE ?
                    AND t2.event_timestamp > t1.event_timestamp -- Sequence Check
                    AND t1.event_timestamp >= NOW() - INTERVAL 30 DAY
                ";
                $stmt = $conn->prepare($sql);
                $stmt->execute(["%$prevUrl%", "%$url%"]);
                $count = $stmt->fetchColumn();
            }

            // Calculations
            $dropOff = ($index === 0) ? 0 : round((($prevCount - $count) / max(1, $prevCount)) * 100, 1);
            $conversion = ($index === 0) ? 100 : round(($count / max(1, $prevCount)) * 100, 1);

            $funnelData[] = [
                'step' => $step['name'],
                'users' => $count,
                'conversion_rate' => $conversion,
                'drop_off' => $dropOff
            ];
            $prevCount = $count;
        }

        echo json_encode(["status" => "success", "funnel" => $funnelData]);
    }

    // --- 2. COHORT ANALYSIS ENGINE ---
    // Logic: Groups users by "First Seen Week" and tracks return visits
    else if ($type === 'cohort') {
        $cohorts = [];

        // Analyze last 4 weeks
        for ($i = 0; $i < 4; $i++) {
            // Define Week Range (Mon-Sun)
            $startWeek = date('Y-m-d', strtotime("-$i week monday"));
            $endWeek   = date('Y-m-d', strtotime("-$i week sunday"));

            // 1. Get Cohort Size (New users acquired this week)
            $sqlSize = "SELECT COUNT(*) FROM dim_visitors WHERE first_seen BETWEEN '$startWeek' AND '$endWeek 23:59:59'";
            $size = $conn->query($sqlSize)->fetchColumn();

            // 2. Calculate Retention (Did they come back AFTER this week?)
            $retentionData = [];
            if ($size > 0) {
                $sqlRet = "
                    SELECT COUNT(DISTINCT visitor_id)
                    FROM dim_sessions
                    WHERE visitor_id IN (
                        SELECT visitor_id FROM dim_visitors WHERE first_seen BETWEEN '$startWeek' AND '$endWeek 23:59:59'
                    )
                    AND start_time > '$endWeek 23:59:59' -- Returned after cohort week
                ";
                $returned = $conn->query($sqlRet)->fetchColumn();
                $retentionData = ['week_1' => round(($returned / $size) * 100, 1)];
            } else {
                $retentionData = ['week_1' => 0];
            }

            $cohorts[] = [
                'week' => date('M d', strtotime($startWeek)),
                'new_users' => $size,
                'retention' => $retentionData
            ];
        }

        echo json_encode(["status" => "success", "cohorts" => $cohorts]);
    }

} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>