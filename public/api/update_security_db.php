<?php
// public/api/update_security_db.php
require 'db.php';

try {
    // Add column to track failed logins
    $sql = "ALTER TABLE admin_users ADD COLUMN failed_login_attempts INT DEFAULT 0";
    $conn->exec($sql);
    echo "<h1>✅ Security Column Added Successfully.</h1>";
    echo "<p>You can now delete this file.</p>";
} catch (PDOException $e) {
    echo "<h3>ℹ️ Column likely already exists or error: " . $e->getMessage() . "</h3>";
}
?>