<?php
// public/api/optimize_analytics_db.php
// 🚀 DATABASE OPTIMIZER: Adds Indexes for Instant Dashboards

require 'db.php';

echo "<h1>🚀 Optimizing Analytics Engine...</h1><hr>";

function addIndex($conn, $table, $column, $indexName) {
    try {
        // Check if index exists to avoid errors
        $check = $conn->query("SHOW INDEX FROM $table WHERE Key_name = '$indexName'");
        if ($check->rowCount() == 0) {
            $conn->exec("CREATE INDEX $indexName ON $table ($column)");
            echo "<p style='color:green'>✅ Added Index: <b>$indexName</b> on $table($column)</p>";
        } else {
            echo "<p style='color:gray'>ℹ️ Index <b>$indexName</b> already exists.</p>";
        }
    } catch (Exception $e) {
        echo "<p style='color:red'>❌ Error: " . $e->getMessage() . "</p>";
    }
}

try {
    // 1. OPTIMIZE VISITOR STATS (For Overview & Ledger)
    echo "<h3>1. Optimizing Visitor Stats...</h3>";
    addIndex($conn, 'visitor_stats', 'last_seen', 'idx_last_seen');       // For "Online Now" & Sparklines
    addIndex($conn, 'visitor_stats', 'total_visits', 'idx_total_visits'); // For "Power Users"
    addIndex($conn, 'visitor_stats', 'country', 'idx_country_filter');    // For Filtering

    // 2. OPTIMIZE GEO DATA (For Atlas View)
    echo "<h3>2. Optimizing Geo Data...</h3>";
    addIndex($conn, 'geo_city_records', 'city', 'idx_city_lookup');
    addIndex($conn, 'geo_city_records', 'region', 'idx_region_lookup');
    addIndex($conn, 'geo_countries', 'total_visitors', 'idx_country_rank');

    // 3. OPTIMIZE PAGE ANALYTICS (For Traffic Flow)
    echo "<h3>3. Optimizing Page Traffic...</h3>";
    addIndex($conn, 'page_analytics', 'visits_24h', 'idx_trend_24h');     // For Sorting Top Pages
    addIndex($conn, 'page_analytics', 'total_hits', 'idx_total_hits');    // For "All Time" Rank
    addIndex($conn, 'page_analytics', 'last_visited', 'idx_last_visit');  // For "Dead Content"

    // 4. OPTIMIZE CONTENT (For ROI View)
    echo "<h3>4. Optimizing Content Tables...</h3>";
    addIndex($conn, 'blogs', 'real_clicks', 'idx_blog_clicks');
    addIndex($conn, 'blogs', 'date', 'idx_blog_date');
    addIndex($conn, 'case_studies', 'real_clicks', 'idx_insight_clicks');

    echo "<hr><h2 style='color:green'>🎉 System Optimized! Dashboard is now Production-Ready.</h2>";

} catch (PDOException $e) {
    echo "<h2>Error: " . $e->getMessage() . "</h2>";
}
?>