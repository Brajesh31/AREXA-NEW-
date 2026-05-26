<?php
require 'db.php';

// 1. Create Tables
$sqlUsers = "CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'editor') DEFAULT 'editor',
    permissions JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

$sqlResets = "CREATE TABLE IF NOT EXISTS password_resets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

$conn->exec($sqlUsers);
$conn->exec($sqlResets);

// 2. The 3 Super Admins
$admins = [
    ['email' => 'arexa.dev@gmail.com', 'pass' => 'pimga9-tostoq-faBhej', 'role' => 'super_admin'],
    ['email' => 'chhavi@arexa.co', 'pass' => 'xyjmu0-waqfaq-qIszod', 'role' => 'super_admin'],
    ['email' => 'bk117134@gmail.com', 'pass' => 'brajesh3101004', 'role' => 'super_admin']
];

foreach ($admins as $admin) {
    $check = $conn->prepare("SELECT id FROM admin_users WHERE email = ?");
    $check->execute([$admin['email']]);

    if($check->rowCount() == 0) {
        $hash = password_hash($admin['pass'], PASSWORD_DEFAULT);
        // Grant Super Admin Privileges
        $stmt = $conn->prepare("INSERT INTO admin_users (email, password_hash, role) VALUES (?, ?, ?)");
        $stmt->execute([$admin['email'], $hash, $admin['role']]);
        echo "✅ Created Super Admin: " . $admin['email'] . "<br>";
    } else {
        echo "ℹ️ Admin already exists: " . $admin['email'] . "<br>";
    }
}
echo "<h3>Security Setup Complete.</h3>";
?>