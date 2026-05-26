<?php
// public/api/get_dashboard_stats.php
// 🧠 BRAIN of the Database Dashboard (Overview Section)

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

require 'db.php';
// require 'auth_middleware.php'; // Uncomment when ready to secure

try {
    // 1. HEADLINE METRICS (The Big Numbers)
    // -------------------------------------

    // A. Total Unique Visitors (All Time)
    $stmt = $conn->query("SELECT COUNT(*) as count FROM visitor_stats");
    $totalUsers = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // B. Total Page Hits (All Time)
    $stmt = $conn->query("SELECT SUM(total_hits) as count FROM page_analytics");
    $totalHits = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

    // C. Active Countries
    $stmt = $conn->query("SELECT COUNT(*) as count FROM geo_countries");
    $totalCountries = $stmt->fetch(PDO::FETCH_ASSOC)['count'];

    // D. Content Engagement (Blogs + Insights Clicks)
    $stmt = $conn->query("SELECT SUM(real_clicks) as count FROM blogs");
    $blogClicks = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

    $stmt = $conn->query("SELECT SUM(real_clicks) as count FROM case_studies");
    $insightClicks = $stmt->fetch(PDO::FETCH_ASSOC)['count'] ?? 0;

    $totalEngagement = $blogClicks + $insightClicks;


    // 2. GROWTH & TRENDS (Last 24 Hours)
    // ----------------------------------

    // New Users (Last 24h) - Checking 'visits_24h' column
    // Logic: If 'visits_24h' > 0 and 'total_visits' == 'visits_24h', they are likely new today.
    // Simpler approximation: Count IPs added to DB in last 24h (using id/created logic if available, or just visits_24h)
    $stmt = $conn->query("SELECT COUNT(*) as count FROM visitor_stats WHERE visits_24h > 0");
    $activeUsers24h = $stmt->fetch(PDO::FETCH_ASSOC)['count'];


    // 3. CHART DATA: TRAFFIC HISTORY (The Main Graph)
    // -----------------------------------------------
    // We will pull the last 30 days of daily traffic from page_analytics
    // Note: Since we store history in JSON, doing this via SQL is hard.
    // We will send a simplified "Last 7 Days" summary using the columns we built.

    $chartData = [
        "24h" => $conn->query("SELECT SUM(visits_24h) FROM page_analytics")->fetchColumn(),
        "7d"  => $conn->query("SELECT SUM(visits_7d) FROM page_analytics")->fetchColumn(),
        "30d" => $conn->query("SELECT SUM(visits_30d) FROM page_analytics")->fetchColumn(),
        "90d" => $conn->query("SELECT SUM(visits_90d) FROM page_analytics")->fetchColumn(),
    ];


    // 4. TOP PERFORMING REGIONS
    // -------------------------
    $stmt = $conn->query("SELECT country_name, total_visitors FROM geo_countries ORDER BY total_visitors DESC LIMIT 5");
    $topCountries = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // 5. LIVE ACTIVITY FEED (The Ticker)
    // ----------------------------------
    // Fetches the 10 most recently active users
    $stmt = $conn->query("SELECT ip_address, country, city, last_seen FROM visitor_stats ORDER BY last_seen DESC LIMIT 10");
    $recentActivity = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // FINAL RESPONSE
    echo json_encode([
        "status" => "success",
        "kpi" => [
            "total_users" => $totalUsers,
            "total_hits" => $totalHits,
            "active_countries" => $totalCountries,
            "engagement" => $totalEngagement,
            "active_24h" => $activeUsers24h
        ],
        "chart_summary" => $chartData,
        "top_countries" => $topCountries,
        "recent_activity" => $recentActivity
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>