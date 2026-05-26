<?php
// public/api/get_traffic_stats.php
// 🚦 TRAFFIC ENGINE: Page Performance & Trends

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db.php';

try {
    // 1. KPI: TRAFFIC HEALTH
    // ----------------------
    $totalPages = $conn->query("SELECT COUNT(*) FROM page_analytics")->fetchColumn();
    $totalHits = $conn->query("SELECT SUM(total_hits) FROM page_analytics")->fetchColumn();

    // Count "Dead Pages" (No visits in 30 days but have history)
    $deadPages = $conn->query("SELECT COUNT(*) FROM page_analytics WHERE visits_30d = 0 AND total_hits > 0")->fetchColumn();

    // 2. CHART: TOP 10 PAGES (Dominance)
    // ----------------------------------
    $topPagesStmt = $conn->query("
        SELECT page_url as name, total_hits as value
        FROM page_analytics
        ORDER BY total_hits DESC
        LIMIT 10
    ");
    $topPages = $topPagesStmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. TABLE: PAGE INTELLIGENCE (Detailed Metrics)
    // ----------------------------------------------
    // We calculate a "Trend Score" (24h vs 7d avg)
    $matrixStmt = $conn->query("
        SELECT
            page_url,
            visits_24h,
            visits_7d,
            visits_30d,
            total_hits,
            last_visited
        FROM page_analytics
        ORDER BY visits_24h DESC
        LIMIT 20
    ");
    $pageMatrix = $matrixStmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. DEAD CONTENT LIST (For Cleanup)
    // ----------------------------------
    $graveyardStmt = $conn->query("
        SELECT page_url, total_hits, last_visited
        FROM page_analytics
        WHERE visits_30d = 0 AND total_hits > 0
        ORDER BY last_visited ASC
        LIMIT 5
    ");
    $graveyard = $graveyardStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "kpi" => [
            "total_pages" => $totalPages,
            "total_hits" => $totalHits,
            "dead_pages" => $deadPages,
            "avg_hits" => $totalPages > 0 ? round($totalHits / $totalPages) : 0
        ],
        "charts" => [
            "dominance" => $topPages
        ],
        "page_matrix" => $pageMatrix,
        "graveyard" => $graveyard
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>