<?php
// public/api/track_analytics.php

// 1. ALLOW ACCESS (CORS)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json");

// Handle "pre-flight" checks from browser
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

require 'db.php';

// 2. GET DATA FROM FRONTEND
$data = json_decode(file_get_contents("php://input"));
$type = $_GET['type'] ?? '';

// =========================================================
// LOGIC A: TRACK A VISIT (Runs when website opens)
// =========================================================
if ($type === 'visit') {
    $ip = $_SERVER['REMOTE_ADDR'];
    $page = $data->page ?? 'home';
    $isFirstTime = $data->first_visit ?? false; // Frontend tells us if cookie was missing

    try {
        // We log every visit.
        // If 'first_visit' is true, we mark them as a 'new_visitor'
        $visitType = $isFirstTime ? 'new_visitor' : 'session';

        $stmt = $conn->prepare("INSERT INTO visitor_logs (ip_address, visit_type, page_url) VALUES (?, ?, ?)");
        $stmt->execute([$ip, $visitType, $page]);

        echo json_encode(["status" => "success", "message" => "Visit logged"]);
    } catch (PDOException $e) {
        // If analytics fail, we don't want to crash the site, so we just return error.
        echo json_encode(["status" => "error"]);
    }
}

// =========================================================
// LOGIC B: TRACK BLOG CLICK (Runs when user clicks a card)
// =========================================================
elseif ($type === 'view_blog') {
    $blogId = $data->id ?? null;

    if ($blogId) {
        try {
            // INCREMENT ONLY 'VIEWS' (Real Clicks)
            // We DO NOT touch 'base_views' (Your manual number).
            // This ensures your 1.2k base stays safe, and organic clicks just add on top.
            $stmt = $conn->prepare("UPDATE blogs SET views = views + 1 WHERE id = ?");
            $stmt->execute([$blogId]);

            echo json_encode(["status" => "success", "message" => "View counted"]);
        } catch (PDOException $e) {
            echo json_encode(["status" => "error"]);
        }
    }
}
?>