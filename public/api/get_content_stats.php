<?php
// public/api/get_content_stats.php
// 📰 CONTENT ENGINE: Analyzes ROI of Blogs & Insights

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db.php';

try {
    // 1. FETCH ALL CONTENT (Blogs + Case Studies)
    // -------------------------------------------
    // We combine them to analyze total content performance

    $blogs = $conn->query("SELECT id, title, category, real_clicks, manual_base, date, 'Blog' as type FROM blogs")->fetchAll(PDO::FETCH_ASSOC);
    $insights = $conn->query("SELECT id, title, category, real_clicks, manual_base, date, 'Insight' as type FROM case_studies")->fetchAll(PDO::FETCH_ASSOC);

    $allContent = array_merge($blogs, $insights);

    // 2. PROCESS METRICS (PHP Logic for Date Parsing)
    // -----------------------------------------------
    $totalItems = count($allContent);
    $totalViews = 0;
    $categories = [];
    $scatterData = [];
    $topContent = [];

    $now = time();

    foreach ($allContent as $item) {
        // Calculate Total Views (Manual Base + Real Clicks)
        // Handle "1.2k" string format in manual_base if present
        $base = 0;
        $baseStr = strtolower(trim((string)$item['manual_base']));
        if (strpos($baseStr, 'k') !== false) {
            $base = floatval($baseStr) * 1000;
        } else {
            $base = intval($baseStr);
        }

        $views = $base + intval($item['real_clicks']);
        $totalViews += $views;

        // Process Date (Calculate Age)
        // Formats can vary ("July 12, 2025" or "2025-07-12")
        $pubDate = strtotime($item['date']);
        if (!$pubDate) $pubDate = $now; // Fallback

        $ageDays = max(1, round(($now - $pubDate) / 86400)); // Avoid division by zero
        $velocity = round($views / $ageDays, 2); // Views per day

        // Build Scatter Plot Data (Viral Analysis)
        $scatterData[] = [
            "x" => $ageDays,      // Age (Days)
            "y" => $views,        // Total Views
            "z" => $velocity,     // Velocity (Bubble Size)
            "name" => $item['title'],
            "type" => $item['type']
        ];

        // Build Category Data
        $cat = $item['category'] ?: 'Uncategorized';
        if (!isset($categories[$cat])) $categories[$cat] = 0;
        $categories[$cat] += $views;

        // Build Leaderboard List
        $topContent[] = [
            "title" => $item['title'],
            "category" => $cat,
            "type" => $item['type'],
            "views" => $views,
            "velocity" => $velocity,
            "date" => $item['date']
        ];
    }

    // Sort Leaderboard
    usort($topContent, function($a, $b) {
        return $b['views'] - $a['views'];
    });
    $topContent = array_slice($topContent, 0, 10);

    // Format Categories for Radar Chart
    $radarData = [];
    foreach ($categories as $cat => $val) {
        $radarData[] = ["subject" => $cat, "A" => $val, "fullMark" => max($categories)];
    }

    echo json_encode([
        "status" => "success",
        "kpi" => [
            "total_items" => $totalItems,
            "total_views" => $totalViews,
            "avg_views" => $totalItems > 0 ? round($totalViews / $totalItems) : 0,
            "content_velocity" => $totalItems > 0 ? round($totalViews / array_sum(array_column($scatterData, 'x')), 2) : 0
        ],
        "charts" => [
            "scatter" => $scatterData,
            "radar" => $radarData
        ],
        "leaderboard" => $topContent
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>