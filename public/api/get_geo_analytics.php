<?php
// public/api/get_geo_analytics.php
// 🗺️ ATLAS ENGINE: Connects Locations to Traffic Volume

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Content-Type: application/json");

require 'db.php';

try {
    // 1. KPI: GLOBAL REACH
    // --------------------
    $totalCountries = $conn->query("SELECT COUNT(*) FROM geo_countries")->fetchColumn();
    $totalCities = $conn->query("SELECT COUNT(DISTINCT city) FROM geo_city_records")->fetchColumn();

    // Calculate "Top Region" (The region with the most IPs)
    $topRegionStmt = $conn->query("SELECT region, COUNT(*) as c FROM geo_city_records GROUP BY region ORDER BY c DESC LIMIT 1");
    $topRegion = $topRegionStmt->fetch(PDO::FETCH_ASSOC);


    // 2. CHART DATA: TOP 10 COUNTRIES (By Volume)
    // -------------------------------------------
    // We get the specific visitor count from the master country table
    $countriesStmt = $conn->query("SELECT country_name as name, total_visitors as value FROM geo_countries ORDER BY total_visitors DESC LIMIT 10");
    $topCountries = $countriesStmt->fetchAll(PDO::FETCH_ASSOC);


    // 3. DEEP DIVE: TOP 20 CITIES (The "Heatmap" List)
    // ------------------------------------------------
    // COMPLEX JOIN: We sum 'total_visits' from visitor_stats for all IPs belonging to a specific city.
    $citySql = "
        SELECT
            g.city,
            g.country_code,
            g.region,
            COUNT(g.ip_address) as unique_ips,
            SUM(v.total_visits) as total_hits
        FROM geo_city_records g
        JOIN visitor_stats v ON g.ip_address = v.ip_address
        GROUP BY g.city, g.country_code, g.region
        ORDER BY total_hits DESC
        LIMIT 20
    ";
    $topCities = $conn->query($citySql)->fetchAll(PDO::FETCH_ASSOC);


    // 4. CONTINENT DISTRIBUTION (Simplified Estimation)
    // -------------------------------------------------
    // Since we don't store continent, we group by Country Code prefix loosely or just send raw country data for frontend grouping
    // We will send the top 5 Countries relative to total for a Pie Chart

    echo json_encode([
        "status" => "success",
        "kpi" => [
            "countries" => $totalCountries,
            "cities" => $totalCities,
            "top_region" => $topRegion['region'] ?? 'Unknown',
            "region_count" => $topRegion['c'] ?? 0
        ],
        "charts" => [
            "countries" => $topCountries
        ],
        "city_matrix" => $topCities
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>