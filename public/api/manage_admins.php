<?php
// public/api/manage_admins.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

require 'db.php';
require 'auth_middleware.php';

// 1. Verify Requestor is Super Admin
$session = verifySession($conn);
if ($session['role'] !== 'super_admin') {
    http_response_code(403);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

$method = $_SERVER['REQUEST_METHOD'];

// --- LIST ALL ADMINS ---
if ($method === 'GET') {
    $stmt = $conn->query("SELECT id, email, role, created_at, failed_login_attempts FROM admin_users ORDER BY role DESC, created_at DESC");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

// --- UPDATE ROLE (Promote/Demote) ---
if ($method === 'POST') {
    $data = json_decode(file_get_contents("php://input"));

    // Check for Permanent Admins (Requirement #7)
    $permanentAdmins = ['arexa.dev@gmail.com', 'chhavi@arexa.co', 'bk117134@gmail.com'];

    // Get target user email to check if they are permanent
    $stmt = $conn->prepare("SELECT email FROM admin_users WHERE id = ?");
    $stmt->execute([$data->id]);
    $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (in_array($targetUser['email'], $permanentAdmins)) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "This user is a Permanent Super Admin and cannot be modified."]);
        exit();
    }

    $stmt = $conn->prepare("UPDATE admin_users SET role = ? WHERE id = ?");
    if ($stmt->execute([$data->role, $data->id])) {
        echo json_encode(["status" => "success"]);
    }
}

// --- DELETE USER ---
if ($method === 'DELETE') {
    $id = $_GET['id'];

    // Check for Permanent Admins (Requirement #7)
    $permanentAdmins = ['arexa.dev@gmail.com', 'chhavi@arexa.co', 'bk117134@gmail.com'];

    $stmt = $conn->prepare("SELECT email FROM admin_users WHERE id = ?");
    $stmt->execute([$id]);
    $targetUser = $stmt->fetch(PDO::FETCH_ASSOC);

    if (in_array($targetUser['email'], $permanentAdmins)) {
        http_response_code(403);
        echo json_encode(["status" => "error", "message" => "This user is a Permanent Super Admin and cannot be removed."]);
        exit();
    }

    $stmt = $conn->prepare("DELETE FROM admin_users WHERE id = ?");
    if ($stmt->execute([$id])) {
        echo json_encode(["status" => "success"]);
    }
}
?>