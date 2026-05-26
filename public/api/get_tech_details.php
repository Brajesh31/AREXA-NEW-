<?php
// public/api/get_tech_details.php
// 💻 TECH: DEEP DIVE (Hardware Specs)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

try {
    // 1. SCREEN RESOLUTIONS
    $screenSql = "
        SELECT screen_resolution as name, COUNT(*) as value
        FROM fact_tech_fingerprints
        WHERE screen_resolution != 'unknown'
        GROUP BY screen_resolution
        ORDER BY value DESC
        LIMIT 8
    ";
    $screens = $conn->query($screenSql)->fetchAll(PDO::FETCH_ASSOC);

    // 2. GPU RENDERERS (Identifies High-End Devices)
    $gpuSql = "
        SELECT gpu_renderer as name, COUNT(*) as value
        FROM fact_tech_fingerprints
        WHERE gpu_renderer != 'unknown'
        GROUP BY gpu_renderer
        ORDER BY value DESC
        LIMIT 8
    ";
    $gpus = $conn->query($gpuSql)->fetchAll(PDO::FETCH_ASSOC);

    // 3. CONNECTION TYPE (4g, wifi, etc.)
    $connSql = "
        SELECT connection_type as name, COUNT(*) as value
        FROM fact_tech_fingerprints
        WHERE connection_type != 'unknown'
        GROUP BY connection_type
        ORDER BY value DESC
    ";
    $connections = $conn->query($connSql)->fetchAll(PDO::FETCH_ASSOC);

    // 4. BROWSER & OS (From Dim Sessions)
    $osSql = "
        SELECT os as name, COUNT(*) as value
        FROM dim_sessions
        GROUP BY os
        ORDER BY value DESC
        LIMIT 5
    ";
    $os = $conn->query($osSql)->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "screens" => $screens,
        "gpus" => $gpus,
        "connections" => $connections,
        "os" => $os
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>