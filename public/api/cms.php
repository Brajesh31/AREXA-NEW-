<?php
// public/api/cms.php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: POST, GET, DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') { http_response_code(200); exit(); }

require 'db.php';
require 'github_sync.php';
require 'auth_middleware.php';

$method = $_SERVER['REQUEST_METHOD'];
$type = $_GET['type'] ?? '';

// 🟢 AUTH CHECK & ROLE EXTRACTION
$userRole = null;
if ($method === 'POST' || $method === 'DELETE') {
    $userSession = verifySession($conn);
    $userId = $userSession['id'];
    $userRole = $userSession['role'];
}

// --- HELPER: SMART FILE DELETION ---
function deleteServerFile($url) {
    if (empty($url) || !is_string($url)) return;

    $matches = [];
    if (preg_match('/uploads\/(.*)/', $url, $matches)) {
        $relativePath = $matches[1];
        $filePath = __DIR__ . "/../uploads/" . $relativePath;

        if (file_exists($filePath)) {
            unlink($filePath);
            error_log("✅ Deleted File: " . $filePath);
        } else {
            error_log("⚠️ File not found for deletion: " . $filePath);
        }
    }
}

// --- HELPER: PARSE "1.2k" -> 1200 ---
// This ensures that if you type "1.5k" in the admin panel, it saves as a number.
function parseViewString($str) {
    $str = strtolower(trim((string)$str));
    if (strpos($str, 'k') !== false) {
        return floatval(preg_replace('/[^0-9.]/', '', $str)) * 1000;
    }
    return (int)preg_replace('/[^0-9]/', '', $str);
}

try {
    // =========================================================
    // 1. GET DATA (Public & Admin)
    // =========================================================
    if ($method === 'GET') {
        if ($type === 'settings') {
            $stmt = $conn->prepare("SELECT setting_value FROM site_settings WHERE setting_key = ?");
            $stmt->execute([$_GET['key']]);
            echo json_encode($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            $table = match($type) {
                'blogs' => 'blogs',
                'works' => 'works',
                'brands' => 'brands',
                'insights' => 'case_studies',
                default => ''
            };

            if($table) {
                if ($type === 'brands') {
                    $isAdmin = isset($_GET['admin']) && $_GET['admin'] === 'true';
                    if ($isAdmin) {
                        $stmt = $conn->query("SELECT * FROM brands ORDER BY created_at DESC");
                    } else {
                        $stmt = $conn->query("SELECT * FROM brands WHERE is_active = 1 ORDER BY created_at DESC");
                    }
                } else {
                    $stmt = $conn->query("SELECT * FROM $table ORDER BY created_at DESC");
                }
                echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
            } else { echo json_encode([]); }
        }
    }

    // =========================================================
    // 2. POST DATA (Create/Update)
    // =========================================================
    if ($method === 'POST') {
        $data = json_decode(file_get_contents("php://input"), true);
        $syncResult = ["status" => "skipped"];

        // --- BLOGS ---
        if ($type === 'blogs') {
            // ✅ Fix: Parse manual_base correctly
            $manualBase = parseViewString($data['manual_base'] ?? 0);

            if (isset($data['id']) && !empty($data['id'])) {
                // UPDATE: Use manual_base instead of views
                $stmt = $conn->prepare("UPDATE blogs SET title=?, excerpt=?, author=?, readTime=?, date=?, image=?, category=?, hashnodeUrl=?, manual_base=? WHERE id=?");
                $stmt->execute([$data['title'], $data['excerpt'], $data['author'], $data['readTime'], $data['date'], $data['image'], $data['category'], $data['hashnodeUrl'], $manualBase, $data['id']]);
            } else {
                // INSERT: Use manual_base instead of views
                $stmt = $conn->prepare("INSERT INTO blogs (title, excerpt, author, readTime, date, image, category, hashnodeUrl, manual_base) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$data['title'], $data['excerpt'], $data['author'], $data['readTime'], $data['date'], $data['image'], $data['category'], $data['hashnodeUrl'], $manualBase]);
            }
            $stmt = $conn->query("SELECT * FROM blogs ORDER BY created_at DESC");
            $syncResult = syncToGithub('blogs', $stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        // --- INSIGHTS ---
        elseif ($type === 'insights') {
            // ✅ Fix: Parse manual_base correctly for Insights too
            $manualBase = parseViewString($data['manual_base'] ?? 0);

            $check = $conn->prepare("SELECT id FROM case_studies WHERE id = ?");
            $check->execute([$data['id']]);

            if ($check->rowCount() > 0) {
                $stmt = $conn->prepare("UPDATE case_studies SET title=?, excerpt=?, category=?, brandLogo=?, image=?, heroImage=?, date=?, isoDate=?, readTime=?, author=?, industry=?, platform=?, content=?, manual_base=? WHERE id=?");
                $stmt->execute([$data['title'], $data['excerpt'], $data['category'], $data['brandLogo'], $data['image'], $data['heroImage'], $data['date'], $data['isoDate'], $data['readTime'], $data['author'], $data['industry'], $data['platform'], $data['content'], $manualBase, $data['id']]);
            } else {
                $stmt = $conn->prepare("INSERT INTO case_studies (id, title, excerpt, category, brandLogo, image, heroImage, date, isoDate, readTime, author, industry, platform, content, manual_base) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
                $stmt->execute([$data['id'], $data['title'], $data['excerpt'], $data['category'], $data['brandLogo'], $data['image'], $data['heroImage'], $data['date'], $data['isoDate'], $data['readTime'], $data['author'], $data['industry'], $data['platform'], $data['content'], $manualBase]);
            }
            $stmt = $conn->query("SELECT * FROM case_studies ORDER BY created_at DESC");
            $syncResult = syncToGithub('insights', $stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        // --- WORKS ---
        elseif ($type === 'works') {
             if (isset($data['id']) && !empty($data['id'])) {
                $stmt = $conn->prepare("UPDATE works SET title=?, client_name=?, category=?, video_url=?, thumbnail_url=? WHERE id=?");
                $stmt->execute([$data['title'], $data['client_name'], $data['category'], $data['video_url'], $data['thumbnail_url'], $data['id']]);
             } else {
                $stmt = $conn->prepare("INSERT INTO works (title, client_name, category, video_url, thumbnail_url) VALUES (?, ?, ?, ?, ?)");
                $stmt->execute([$data['title'], $data['client_name'], $data['category'], $data['video_url'], $data['thumbnail_url']]);
             }
             $stmt = $conn->query("SELECT * FROM works ORDER BY created_at DESC");
             $syncResult = syncToGithub('works', $stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        // --- BRANDS ---
        elseif ($type === 'brands') {
             $isActive = isset($data['is_active']) ? (int)$data['is_active'] : 1;

             if (isset($data['id']) && !empty($data['id'])) {
                 $stmt = $conn->prepare("UPDATE brands SET name=?, logo_url=?, is_active=? WHERE id=?");
                 $stmt->execute([$data['name'], $data['logo_url'], $isActive, $data['id']]);
             } else {
                 $stmt = $conn->prepare("INSERT INTO brands (name, logo_url, is_active) VALUES (?, ?, ?)");
                 $stmt->execute([$data['name'], $data['logo_url'], $isActive]);
             }
             $stmt = $conn->query("SELECT * FROM brands ORDER BY created_at DESC");
             $syncResult = syncToGithub('brands', $stmt->fetchAll(PDO::FETCH_ASSOC));
        }

        // --- SETTINGS ---
        elseif ($type === 'settings') {
            $stmt = $conn->prepare("INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
            $stmt->execute([$data['key'], $data['value']]);
        }

        echo json_encode(["status" => "success", "sync_debug" => $syncResult]);
    }

    // =========================================================
    // 3. DELETE DATA
    // =========================================================
    if ($method === 'DELETE') {

        if ($userRole !== 'super_admin') {
            http_response_code(403);
            echo json_encode(["status" => "error", "message" => "Permission Denied."]);
            exit();
        }

        $id = $_GET['id'] ?? null;
        $table = match($type) {
            'blogs' => 'blogs', 'works' => 'works', 'brands' => 'brands', 'insights' => 'case_studies', default => ''
        };

        if($table && $id) {
            $stmt = $conn->prepare("SELECT * FROM $table WHERE id = ?");
            $stmt->execute([$id]);
            $item = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($item) {
                if ($type === 'blogs') deleteServerFile($item['image']);
                elseif ($type === 'works') {
                    deleteServerFile($item['video_url']);
                    deleteServerFile($item['thumbnail_url']);
                }
                elseif ($type === 'brands') deleteServerFile($item['logo_url']);
                elseif ($type === 'insights') {
                    deleteServerFile($item['brandLogo']);
                    deleteServerFile($item['image']);
                    deleteServerFile($item['heroImage']);
                    if (!empty($item['content'])) {
                        $blocks = json_decode($item['content'], true);
                        if (is_array($blocks)) {
                            foreach ($blocks as $block) {
                                if (isset($block['type']) && $block['type'] === 'image' && !empty($block['value'])) {
                                    deleteServerFile($block['value']);
                                }
                            }
                        }
                    }
                }

                $stmt = $conn->prepare("DELETE FROM $table WHERE id = ?");
                $stmt->execute([$id]);

                // GitHub Sync logic
                $syncResult = ["status" => "skipped"];
                if ($type === 'blogs') {
                    $stmt = $conn->query("SELECT * FROM blogs ORDER BY created_at DESC");
                    $syncResult = syncToGithub('blogs', $stmt->fetchAll(PDO::FETCH_ASSOC));
                } elseif ($type === 'insights') {
                    $stmt = $conn->query("SELECT * FROM case_studies ORDER BY created_at DESC");
                    $syncResult = syncToGithub('insights', $stmt->fetchAll(PDO::FETCH_ASSOC));
                } elseif ($type === 'works') {
                    $stmt = $conn->query("SELECT * FROM works ORDER BY created_at DESC");
                    $syncResult = syncToGithub('works', $stmt->fetchAll(PDO::FETCH_ASSOC));
                } elseif ($type === 'brands') {
                    $stmt = $conn->query("SELECT * FROM brands ORDER BY created_at DESC");
                    $syncResult = syncToGithub('brands', $stmt->fetchAll(PDO::FETCH_ASSOC));
                }

                echo json_encode(["status" => "success", "message" => "Item deleted.", "sync_debug" => $syncResult]);
            } else {
                echo json_encode(["status" => "error", "message" => "Item not found"]);
            }
        } else {
            http_response_code(400);
            echo json_encode(["error" => "No ID provided"]);
        }
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>