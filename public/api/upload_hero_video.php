<?php
// Include your secure database connection
require_once 'db.php';
header('Content-Type: application/json');

// Only allow POST requests for uploads
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["status" => "error", "message" => "Invalid request method."]);
    exit();
}

// Ensure a file was uploaded
if (!isset($_FILES['video']) || $_FILES['video']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(["status" => "error", "message" => "No valid video file uploaded."]);
    exit();
}

$file = $_FILES['video'];
$ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));

// Enforce .webm or .mp4 for security and performance
if ($ext !== 'webm' && $ext !== 'mp4') {
    echo json_encode(["status" => "error", "message" => "Only .webm and .mp4 files are allowed."]);
    exit();
}

// Setup directories (Adjust this to match your server's public html structure)
// Assuming API is in /public_html/api/ and uploads go to /public_html/uploads/hero/
$uploadDir = __DIR__ . '/../uploads/hero/';
if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
}

// Generate unique filenames to prevent overwriting
$uniqueName = uniqid('hero_') . '_' . time();
$videoFilename = $uniqueName . '.' . $ext;
$thumbnailFilename = $uniqueName . '_thumbnail.jpg';

$videoFilePath = $uploadDir . $videoFilename;
$thumbnailFilePath = $uploadDir . $thumbnailFilename;

// Move the uploaded video to the server
if (move_uploaded_file($file['tmp_name'], $videoFilePath)) {

    // --- SERVER-SIDE MAGIC: GENERATE THUMBNAIL USING FFMPEG ---
    // This command extracts the frame at 0.1 seconds and saves it as a JPG
    $ffmpegCommand = "ffmpeg -i " . escapeshellarg($videoFilePath) . " -ss 00:00:00.100 -vframes 1 " . escapeshellarg($thumbnailFilePath) . " 2>&1";
    exec($ffmpegCommand, $output, $returnCode);

    // If FFmpeg fails (e.g., not installed on server), set a fallback thumbnail
    if ($returnCode !== 0 || !file_exists($thumbnailFilePath)) {
        $thumbnailUrl = '/fallback-thumbnail.jpg'; // Ensure you have a fallback image in your public folder
    } else {
        $thumbnailUrl = '/uploads/hero/' . $thumbnailFilename;
    }

    $videoUrl = '/uploads/hero/' . $videoFilename;

    // --- SAVE TO DATABASE ---
    try {
        // Get the current highest position index to place this at the end
        $posStmt = $conn->query("SELECT MAX(position_index) as max_pos FROM hero_videos");
        $posRow = $posStmt->fetch(PDO::FETCH_ASSOC);
        $nextPos = ($posRow['max_pos'] !== null) ? $posRow['max_pos'] + 1 : 0;

        $stmt = $conn->prepare("INSERT INTO hero_videos (video_url, thumbnail_url, position_index) VALUES (:video_url, :thumbnail_url, :pos)");
        $stmt->bindParam(':video_url', $videoUrl);
        $stmt->bindParam(':thumbnail_url', $thumbnailUrl);
        $stmt->bindParam(':pos', $nextPos);
        $stmt->execute();

        echo json_encode([
            "status" => "success",
            "message" => "Video uploaded and thumbnail auto-generated!",
            "video_url" => $videoUrl,
            "thumbnail_url" => $thumbnailUrl
        ]);

    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Database insertion failed."]);
    }

} else {
    echo json_encode(["status" => "error", "message" => "Failed to move uploaded file."]);
}
?>