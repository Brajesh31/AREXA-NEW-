<?php
// public/api/upload.php

// 1. DISABLE ERROR DISPLAY (Prevents HTML errors from breaking JSON)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

// 2. SET CORS HEADERS (Must be the very first output)
// We explicitly allow 'Authorization' and 'X-Requested-With' to fix your error.
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// 3. HANDLE PREFLIGHT (OPTIONS) REQUEST
// If the browser is just checking permission, say "Yes" and stop.
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

try {
    // 4. CHECK FOR SERVER SIZE LIMITS
    $contentLength = (int) ($_SERVER['CONTENT_LENGTH'] ?? 0);
    if (empty($_FILES) && empty($_POST) && $contentLength > 0) {
        throw new Exception("File is too large! It exceeds the server's post_max_size limit.");
    }

    // 5. CHECK IF FILE WAS RECEIVED
    if (!isset($_FILES['file'])) {
        throw new Exception("No file received. Please try again.");
    }

    $file = $_FILES['file'];

    // 6. CHECK FOR PHP UPLOAD ERRORS
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $uploadErrors = [
            1 => 'The uploaded file exceeds the upload_max_filesize directive in php.ini',
            2 => 'The uploaded file exceeds the MAX_FILE_SIZE directive in the HTML form',
            3 => 'The uploaded file was only partially uploaded',
            4 => 'No file was uploaded',
            6 => 'Missing a temporary folder',
            7 => 'Failed to write file to disk',
            8 => 'A PHP extension stopped the file upload'
        ];
        throw new Exception($uploadErrors[$file['error']] ?? "Unknown upload error code: " . $file['error']);
    }

    // 7. SETUP PATHS
    $base_dir = __DIR__ . "/../uploads/";
    $folderName = isset($_POST['folder']) ? preg_replace('/[^a-zA-Z0-9_-]/', '', $_POST['folder']) : 'misc';
    $target_dir = $base_dir . $folderName . "/";

    // 8. CREATE DIRECTORY IF MISSING
    if (!is_dir($target_dir)) {
        if (!mkdir($target_dir, 0755, true)) {
            throw new Exception("Failed to create directory: uploads/$folderName. Check folder permissions.");
        }
    }

    // 9. VALIDATE EXTENSION
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'mp4', 'pdf'];
    if (!in_array($ext, $allowed)) {
        throw new Exception("Invalid file type: $ext");
    }

    // 10. MOVE FILE
    $newFilename = time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;
    $target_file = $target_dir . $newFilename;

    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        $web_url = "https://arexa.co/uploads/" . $folderName . "/" . $newFilename;
        echo json_encode(["status" => "success", "url" => $web_url]);
    } else {
        throw new Exception("Failed to move uploaded file. Check folder permissions (755 or 777).");
    }

} catch (Exception $e) {
    // Return JSON error even if something crashes
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => $e->getMessage()
    ]);
}
?>