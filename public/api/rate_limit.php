<?php
// public/api/rate_limit.php

function checkRateLimit($limit = 5, $seconds = 60) {
    // 1. Identify the user by IP address
    $ip = $_SERVER['REMOTE_ADDR'];
    // Create a unique file for this IP in the server's temp folder
    $file = sys_get_temp_dir() . "/rate_limit_" . md5($ip);

    $current_time = time();
    $data = ['count' => 0, 'start_time' => $current_time];

    // 2. Read existing record
    if (file_exists($file)) {
        $data = json_decode(file_get_contents($file), true);
    }

    // 3. Reset if the time window has passed
    if ($current_time - $data['start_time'] > $seconds) {
        $data['count'] = 0;
        $data['start_time'] = $current_time;
    }

    // 4. Increment the count
    $data['count']++;

    // 5. Save the new count
    file_put_contents($file, json_encode($data));

    // 6. BLOCK if limit exceeded
    if ($data['count'] > $limit) {
        header('HTTP/1.1 429 Too Many Requests');
        header('Retry-After: ' . $seconds); // Tell browser to wait
        echo json_encode([
            "status" => "error",
            "message" => "Too many attempts. Please wait " . ($seconds / 60) . " minute(s) before trying again."
        ]);
        exit(); // Stop the script immediately
    }
}
?>