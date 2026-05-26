<?php
// public/api/get_user_demographics.php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
require 'db.php';

$startDate = $_GET['start_date'] ?? date('Y-m-d', strtotime('-30 days'));
$endDate = $_GET['end_date'] ?? date('Y-m-d');

$startDateTime = $startDate . " 00:00:00";
$endDateTime = $endDate . " 23:59:59";

try {
    // 1. TOP COUNTRIES
    $countrySql = "
        SELECT
            COALESCE(s.country, 'Unknown') as country_name,
            COUNT(DISTINCT s.visitor_id) as total_visitors,
            MAX(s.start_time) as last_active
        FROM dim_sessions s
        WHERE s.start_time >= :start1 AND s.start_time <= :end1
        GROUP BY country_name
        ORDER BY total_visitors DESC
        LIMIT 15
    ";
    $countryStmt = $conn->prepare($countrySql);
    $countryStmt->execute([':start1' => $startDateTime, ':end1' => $endDateTime]);
    $countries = $countryStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. TOP CITIES
    $citySql = "
        SELECT
            s.city,
            s.country as country_code,
            '' as region,
            COUNT(s.session_id) as sessions
        FROM dim_sessions s
        WHERE s.start_time >= :start2 AND s.start_time <= :end2
        GROUP BY s.city, s.country
        ORDER BY sessions DESC
        LIMIT 15
    ";
    $cityStmt = $conn->prepare($citySql);
    $cityStmt->execute([':start2' => $startDateTime, ':end2' => $endDateTime]);
    $cities = $cityStmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "status" => "success",
        "countries" => $countries,
        "cities" => $cities
    ]);

} catch (PDOException $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>