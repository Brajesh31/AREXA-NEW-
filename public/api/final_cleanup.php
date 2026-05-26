<?php
// public/api/final_cleanup.php
require 'db.php';
echo "<h1>🚀 Database Setup & Cleanup</h1><hr>";

try {
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 1. ENSURE TECH TABLE EXISTS (Vital for Step 1 to work)
    $conn->exec("CREATE TABLE IF NOT EXISTS fact_tech_fingerprints (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        visitor_id VARCHAR(64) NOT NULL,
        session_id VARCHAR(64) NOT NULL,
        screen_resolution VARCHAR(20),
        viewport_size VARCHAR(20),
        pixel_ratio DECIMAL(3,1),
        gpu_renderer VARCHAR(255),
        browser_language VARCHAR(10),
        connection_type VARCHAR(10),
        captured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_tech_visit (visitor_id)
    ) ENGINE=InnoDB;");
    echo "<p style='color:green'>✅ Verified Tech Table (fact_tech_fingerprints).</p>";

    // 2. DROP UNUSED TABLES (Monetization only)
    $drop = ['fact_orders', 'dim_products'];
    foreach ($drop as $table) {
        $conn->exec("DROP TABLE IF EXISTS $table");
        echo "<p style='color:orange'>🗑️ Dropped unused table: <b>$table</b></p>";
    }

    echo "<h2>✨ Done. You can now delete this file.</h2>";
} catch (Exception $e) { echo $e->getMessage(); }
?>