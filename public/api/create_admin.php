<?php
require 'db.php';
$data = json_decode(file_get_contents("php://input"));

if(isset($data->creator_email) && isset($data->creator_password) && isset($data->new_email)) {

    // 1. Verify the CREATOR is a Super Admin
    $stmt = $conn->prepare("SELECT * FROM admin_users WHERE email = ?");
    $stmt->execute([$data->creator_email]);
    $creator = $stmt->fetch(PDO::FETCH_ASSOC);

    if(!$creator || !password_verify($data->creator_password, $creator['password_hash'])) {
        echo json_encode(["status" => "error", "message" => "Authorization Failed: Incorrect Password"]);
        exit();
    }

    if($creator['role'] !== 'super_admin') {
        echo json_encode(["status" => "error", "message" => "Permission Denied: Only Super Admins can add users."]);
        exit();
    }

    // 2. Create the New Admin
    $check = $conn->prepare("SELECT id FROM admin_users WHERE email = ?");
    $check->execute([$data->new_email]);
    if($check->rowCount() > 0) {
        echo json_encode(["status" => "error", "message" => "User already exists"]);
        exit();
    }

    $newHash = password_hash($data->new_password, PASSWORD_DEFAULT);
    $newRole = $data->new_role; // 'editor' or 'super_admin'

    $insert = $conn->prepare("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)");
    if($insert->execute([$data->new_email, $newHash, $newRole])) {
        echo json_encode(["status" => "success", "message" => "New Admin Created Successfully"]);
    }
}
?>