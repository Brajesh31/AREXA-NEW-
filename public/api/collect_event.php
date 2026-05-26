<?php
// public/api/collect_event.php
// 🧠 PHASE 2: THE INGESTION ENGINE (MNC Upgraded)
// Receives raw signals, processes identity, and routes data to specific Fact Tables.

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require 'db.php';

// 1. RECEIVE RAW DATA
$input = json_decode(file_get_contents('php://input'), true);

if (!$input || !isset($input['event_name'])) {
    echo json_encode(["status" => "ignored", "reason" => "empty_payload"]);
    exit;
}

// Extract Core Data
$visitor_id = $input['visitor_id'] ?? 'anonymous';
$session_id = $input['session_id'] ?? 'unknown';
$event_name = $input['event_name'];
$page_url   = $input['page_url'];
$timestamp  = date('Y-m-d H:i:s');
$ip_address = $_SERVER['REMOTE_ADDR'];
$user_agent = $_SERVER['HTTP_USER_AGENT'];
$properties = $input['properties'] ?? [];

try {
    // 2. VISITOR IDENTITY (Upsert)
    // Ensure this visitor exists in our dimension table
    $stmtVisitor = $conn->prepare("
        INSERT INTO dim_visitors (visitor_id, first_seen, last_seen, device_fingerprint)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE last_seen = VALUES(last_seen)
    ");
    $stmtVisitor->execute([$visitor_id, $timestamp, $timestamp, $properties['fingerprint'] ?? null]);

    // 3. SESSION CONTEXT (Ignore if exists)
    // Only fetch Geo if this is a NEW session (Performance Optimization)
    $checkSession = $conn->prepare("SELECT session_id FROM dim_sessions WHERE session_id = ?");
    $checkSession->execute([$session_id]);

    if ($checkSession->rowCount() == 0) {
        // A. Parse User Agent (Basic)
        $deviceType = 'desktop';
        if (preg_match('/(mobile|android|iphone|ipad)/i', $user_agent)) $deviceType = 'mobile';
        if (preg_match('/(tablet|ipad)/i', $user_agent)) $deviceType = 'tablet';

        // B. Geo Lookup (External API)
        $geoUrl = "http://ip-api.com/json/" . $ip_address . "?fields=status,countryCode,city";
        $geoData = json_decode(@file_get_contents($geoUrl), true);
        $country = $geoData['countryCode'] ?? 'XX';
        $city    = $geoData['city'] ?? 'Unknown';

        // C. Insert Session Context
        $stmtSession = $conn->prepare("
            INSERT INTO dim_sessions
            (session_id, visitor_id, start_time, ip_address, device_type, user_agent, country, city, landing_page, referrer_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmtSession->execute([
            $session_id, $visitor_id, $timestamp, $ip_address, $deviceType, $user_agent,
            $country, $city, $page_url, $input['referrer'] ?? ''
        ]);
    }

    // 4. LOG THE GENERIC EVENT
    $stmtEvent = $conn->prepare("
        INSERT INTO fact_events (session_id, visitor_id, event_name, page_url, event_properties, event_timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmtEvent->execute([$session_id, $visitor_id, $event_name, $page_url, json_encode($properties), $timestamp]);

    // ======================================================
    // ⚡ 5. SPECIAL ROUTING (MNC Logic)
    // ======================================================

    // A. HANDLE TRANSACTIONS (Monetization)
    if ($event_name === 'purchase') {
        $stmtOrder = $conn->prepare("
            INSERT INTO fact_orders
            (order_id, visitor_id, session_id, total_amount, currency, coupon_code, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmtOrder->execute([
            $properties['order_id'] ?? uniqid('ord_'),
            $visitor_id,
            $session_id,
            $properties['value'] ?? 0.00,
            $properties['currency'] ?? 'USD',
            $properties['coupon'] ?? null,
            'completed'
        ]);
    }

    // B. HANDLE TECH SPECS (Device Fingerprinting)
    if ($event_name === 'tech_profile') {
        $stmtTech = $conn->prepare("
            INSERT INTO fact_tech_fingerprints
            (visitor_id, session_id, screen_resolution, gpu_renderer, browser_language, connection_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmtTech->execute([
            $visitor_id,
            $session_id,
            $properties['screen_resolution'] ?? 'unknown',
            $properties['gpu_renderer'] ?? 'unknown',
            $properties['language'] ?? 'en',
            $properties['connection'] ?? 'unknown'
        ]);
    }

    echo json_encode(["status" => "success", "id" => $conn->lastInsertId()]);

} catch (PDOException $e) {
    // Log error silently so we don't break the client
    error_log("Analytics Error: " . $e->getMessage());
    echo json_encode(["status" => "error", "message" => "Internal Error"]);
}
?>