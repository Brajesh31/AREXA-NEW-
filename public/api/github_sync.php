<?php
// public/api/github_sync.php

function syncToGithub($type, $data) {
    // ⚠️ YOUR TOKEN (Preserved)
    $token = "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";

    $repoOwner = "arexa-dev";
    $repoName = "Arexa_NEW";
    $branch = "main";

    // ✅ FILE MAPPING: Defines where the Silent Backup goes
    $fileMap = [
        'blogs' => 'src/data/blogData.ts',
        'insights' => 'src/data/casestudy.ts',
        'works' => 'src/data/workData.ts',
        'brands' => 'src/data/brandData.ts' // Added Brands Backup Path
    ];

    if (!isset($fileMap[$type])) return ["status" => "error", "msg" => "Invalid Type"];

    $filePath = $fileMap[$type];

    // Generate the content (Convert DB Data -> TypeScript File)
    $content = generateTSContent($type, $data);

    if (!$content) return ["status" => "error", "msg" => "Content Generation Failed"];

    // 1. GET SHA (Check if file exists so we can update it)
    $ch = curl_init("https://api.github.com/repos/$repoOwner/$repoName/contents/$filePath?ref=$branch");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Arexa-CMS');
    curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: token $token"]);
    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    // Stop if Auth fails
    if ($httpCode === 401) return ["status" => "error", "msg" => "GitHub Token Invalid (401)"];

    $fileInfo = json_decode($res, true);
    $sha = $fileInfo['sha'] ?? null;

    // 2. PUSH CONTENT (Silent Backup)
    $payload = json_encode([
        "message" => "CMS Silent Backup: $type", // Commit message
        "content" => base64_encode($content),
        "sha" => $sha,
        "branch" => $branch
    ]);

    $ch = curl_init("https://api.github.com/repos/$repoOwner/$repoName/contents/$filePath");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Arexa-CMS');
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Authorization: token $token",
        "Content-Type: application/json"
    ]);
    $res = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 || $httpCode === 201) {
        return ["status" => "success", "code" => $httpCode];
    } else {
        return ["status" => "error", "code" => $httpCode, "response" => $res];
    }
}

// --- HELPER: CONVERT DB ARRAY -> TYPESCRIPT FILE STRING ---
function generateTSContent($type, $data) {

    // 1. BLOGS BACKUP
    if ($type === 'blogs') {
        $ts = "// src/data/blogData.ts\n// ⚠️ BACKUP FILE. Live site uses Database.\n\n";
        $ts .= "export interface BlogPost {\n    id: string;\n    title: string;\n    excerpt: string;\n    author: string;\n    readTime: string;\n    date: string;\n    image: string;\n    category: string;\n    hashnodeUrl: string;\n    views: string;\n}\n\n";

        $formatted = array_map(function($item){
            $item['id'] = (string)$item['id'];
            return $item;
        }, $data);

        return $ts . "export const blogPosts: BlogPost[] = " . json_encode($formatted, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";";
    }

    // 2. INSIGHTS BACKUP
    if ($type === 'insights') {
        $ts = "// src/data/casestudy.ts\n// ⚠️ BACKUP FILE. Live site uses Database.\n\n";
        $ts .= "export interface CaseStudy {\n    id: string;\n    title: string;\n    excerpt: string;\n    category: string;\n    brandLogo: string;\n    image: string;\n    heroImage: string;\n    date: string;\n    isoDate: string;\n    readTime: string;\n    author: string;\n    industry: string;\n    platform: string;\n    content: string;\n}\n\n";

        return $ts . "export const caseStudies: CaseStudy[] = " . json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";";
    }

    // 3. WORKS BACKUP
    if ($type === 'works') {
        $ts = "// src/data/workData.ts\n// ⚠️ BACKUP FILE. Live site uses Database.\n\n";
        $ts .= "export interface WorkItem {\n    id: number;\n    title: string;\n    category: string;\n    video: string;\n    thumbnail: string;\n}\n\n";

        $formatted = array_map(function($item){
            return [
                "id" => (int)$item['id'],
                "title" => $item['title'],
                "category" => $item['category'],
                "video" => $item['video_url'],
                "thumbnail" => $item['thumbnail_url']
            ];
        }, $data);

        return $ts . "export const workItems: WorkItem[] = " . json_encode($formatted, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";";
    }

    // 4. BRANDS BACKUP (New Logic)
    if ($type === 'brands') {
        $ts = "// src/data/brandData.ts\n// ⚠️ BACKUP FILE. Live site uses Database.\n\n";
        $ts .= "export interface Brand {\n    id: number;\n    name: string;\n    logo_url: string;\n    is_active: number;\n    created_at?: string;\n}\n\n";

        $formatted = array_map(function($item){
            return [
                "id" => (int)$item['id'],
                "name" => $item['name'],
                "logo_url" => $item['logo_url'],
                "is_active" => (int)$item['is_active'],
                "created_at" => $item['created_at'] ?? null
            ];
        }, $data);

        return $ts . "export const brandData: Brand[] = " . json_encode($formatted, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES) . ";";
    }

    return "";
}
?>