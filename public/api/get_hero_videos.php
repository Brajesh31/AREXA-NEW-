<?php
// Include your secure database connection
require_once 'db.php';

// Return JSON format
header('Content-Type: application/json');

try {
    // Fetch all active videos, ordered by their position
    $stmt = $conn->prepare("SELECT video_url, thumbnail_url, position_index FROM hero_videos WHERE is_active = 1 ORDER BY position_index ASC");
    $stmt->execute();

    $videos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the array to the React frontend
    echo json_encode([
        "status" => "success",
        "data" => $videos
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to fetch videos."]);
}
?>