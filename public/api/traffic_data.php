<?php
// public/api/traffic_data.php

// 1. SILENCE OUTPUT & SETUP HEADERS
ini_set('display_errors', 0);
error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

require 'vendor/autoload.php';

use Google\Analytics\Data\V1beta\BetaAnalyticsDataClient;
use Google\Analytics\Data\V1beta\DateRange;
use Google\Analytics\Data\V1beta\Dimension;
use Google\Analytics\Data\V1beta\Metric;

try {
    // 2. AUTHENTICATION
    $keyFile = 'service-account.json';
    $realPath = realpath(__DIR__ . '/' . $keyFile) ?: (__DIR__ . '/' . $keyFile);

    if (!file_exists($realPath)) {
        throw new Exception("Key file missing");
    }

    putenv('GOOGLE_APPLICATION_CREDENTIALS=' . $realPath);
    $client = new BetaAnalyticsDataClient();
    $propertyId = '518309966'; // YOUR PROPERTY ID

    // =========================================================
    // 3. GET REAL-TIME DATA (Right Now)
    // =========================================================

    // A. Active Users
    $rt_users = 0;
    try {
        $resp = $client->runRealtimeReport([
            'property' => 'properties/' . $propertyId,
            'metrics' => [new Metric(['name' => 'activeUsers'])]
        ]);
        foreach ($resp->getRows() as $row) {
            $rt_users = (int)$row->getMetricValues()[0]->getValue();
        }
    } catch (Exception $e) { $rt_users = 0; }

    // B. Helper for lists
    function getRtList($client, $pid, $dim, $met) {
        try {
            $r = $client->runRealtimeReport([
                'property' => 'properties/' . $pid,
                'dimensions' => [new Dimension(['name' => $dim])],
                'metrics' => [new Metric(['name' => $met])],
                'limit' => 5
            ]);
            $out = [];
            foreach ($r->getRows() as $row) {
                $out[] = [
                    'name' => $row->getDimensionValues()[0]->getValue(),
                    'value' => (int)$row->getMetricValues()[0]->getValue()
                ];
            }
            return $out;
        } catch (Exception $e) { return []; }
    }

    $rt_pages = getRtList($client, $propertyId, 'pageTitle', 'screenPageViews');
    $rt_events = getRtList($client, $propertyId, 'eventName', 'eventCount');
    $rt_sources = getRtList($client, $propertyId, 'firstUserSource', 'activeUsers');
    $rt_countries = getRtList($client, $propertyId, 'country', 'activeUsers'); // Added Country back

    // C. Calculate Real-Time Page Views (from Events)
    $rt_pageViews = 0;
    foreach ($rt_events as $event) {
        if ($event['name'] === 'page_view') {
            $rt_pageViews = $event['value'];
        }
    }
    // Fallback: If no event data, assume 1 view per active user
    if ($rt_pageViews == 0 && $rt_users > 0) {
        $rt_pageViews = $rt_users;
    }

    // =========================================================
    // 4. GET HISTORICAL DATA (Last 30 Days)
    // =========================================================

    $dailyData = [];
    $totalUsers = 0;
    $totalViews = 0;
    $todayDate = date('Ymd');
    $foundToday = false;

    try {
        $histResp = $client->runReport([
            'property' => 'properties/' . $propertyId,
            'dateRanges' => [new DateRange(['start_date' => '30daysAgo', 'end_date' => 'today'])],
            'dimensions' => [new Dimension(['name' => 'date'])],
            'metrics' => [
                new Metric(['name' => 'activeUsers']),
                new Metric(['name' => 'screenPageViews'])
            ]
        ]);

        foreach ($histResp->getRows() as $row) {
            $date = $row->getDimensionValues()[0]->getValue();
            $u = (int)$row->getMetricValues()[0]->getValue();
            $v = (int)$row->getMetricValues()[1]->getValue();

            // ✅ INJECTION: Add Real-Time numbers to Today's history
            if ($date === $todayDate) {
                $u += $rt_users;
                $v += $rt_pageViews;
                $foundToday = true;
            }

            $totalUsers += $u;
            $totalViews += $v;

            $dailyData[] = ['date' => $date, 'users' => $u, 'views' => $v];
        }
    } catch (Exception $e) { }

    // ✅ INJECTION: Create Today if missing
    if (!$foundToday && $rt_users > 0) {
        $dailyData[] = ['date' => $todayDate, 'users' => $rt_users, 'views' => $rt_pageViews];
        $totalUsers += $rt_users;
        $totalViews += $rt_pageViews;
    }

    // 5. PER PAGE STATS (Historical + Real-Time Merge)
    $pageStats = [];
    try {
        $pageResp = $client->runReport([
            'property' => 'properties/' . $propertyId,
            'dateRanges' => [new DateRange(['start_date' => '30daysAgo', 'end_date' => 'today'])],
            'dimensions' => [new Dimension(['name' => 'pageTitle'])],
            'metrics' => [
                new Metric(['name' => 'screenPageViews']),
                new Metric(['name' => 'activeUsers']),
                new Metric(['name' => 'userEngagementDuration'])
            ],
            'limit' => 10
        ]);

        foreach ($pageResp->getRows() as $row) {
            $pageStats[] = [
                'title' => $row->getDimensionValues()[0]->getValue(),
                'views' => (int)$row->getMetricValues()[0]->getValue(),
                'users' => (int)$row->getMetricValues()[1]->getValue(),
                'time' => (int)$row->getMetricValues()[2]->getValue()
            ];
        }
    } catch (Exception $e) { }

    // ✅ MERGE REAL-TIME PAGES INTO PAGE STATS TABLE
    // This ensures the bottom table shows pages active RIGHT NOW, even if they have 0 history.
    foreach ($rt_pages as $rtPage) {
        $found = false;
        foreach ($pageStats as &$stat) {
            if ($stat['title'] === $rtPage['name']) {
                $stat['views'] += $rtPage['value']; // Add live views
                $stat['users'] += $rtPage['value']; // Add live users (approx)
                $found = true;
                break;
            }
        }
        // If this page wasn't in the 30-day history, add it now
        if (!$found) {
            $pageStats[] = [
                'title' => $rtPage['name'],
                'views' => $rtPage['value'],
                'users' => $rtPage['value'],
                'time' => 0 // New pages have no avg time yet
            ];
        }
    }

    // =========================================================
    // 6. RESPONSE
    // =========================================================
    echo json_encode([
        "status" => "success",
        "realtime" => [
            "total_active" => $rt_users,
            "pages" => $rt_pages,
            "events" => $rt_events,
            "sources" => $rt_sources,
            "countries" => $rt_countries
        ],
        "historical" => [
            "total_users" => $totalUsers,
            "total_views" => $totalViews,
            "daily_stats" => $dailyData,
            "page_stats" => $pageStats
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>