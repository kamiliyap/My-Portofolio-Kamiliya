<?php
declare(strict_types=1);
require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/project-demo.php';
ini_set('display_errors', '0');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: same-origin');
header("Content-Security-Policy: default-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'; object-src 'none'");
session_name('kamiliya_admin');
session_start([
    'use_strict_mode' => true, 'cookie_httponly' => true,
    'cookie_samesite' => 'Strict',
    'cookie_secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'cookie_path' => '/',
]);

function adminEscape(mixed $value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
function adminUrl(string $path): string
{
    $script = str_replace('\\', '/', $_SERVER['SCRIPT_NAME']);
    $base = str_contains($script, '/admin/') ? dirname(dirname($script)) : dirname($script);
    return rtrim(str_replace('\\', '/', $base), '/') . '/' . ltrim($path, '/');
}
function adminRedirect(string $path): never
{
    header('Location: ' . adminUrl($path), true, 303); exit;
}
function adminFail(int $status, string $message): never
{
    http_response_code($status);
    echo '<!doctype html><html lang="id"><meta charset="utf-8"><title>Kamiliya</title><p>' . adminEscape($message) . '</p></html>'; exit;
}
function adminRequireLogin(): void
{
    if (empty($_SESSION['admin_id'])) adminRedirect('admin-login.php');
    if (time() - ($_SESSION['admin_seen'] ?? 0) > 1800) {
        $_SESSION = []; session_regenerate_id(true); adminRedirect('admin-login.php');
    }
    $_SESSION['admin_seen'] = time();
}
function adminToken(): string
{
    return $_SESSION['admin_csrf'] ??= bin2hex(random_bytes(32));
}
function adminCsrf(): void
{
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') adminFail(405, 'Gunakan formulir untuk melakukan tindakan ini.');
    $token = $_POST['csrf_token'] ?? null;
    if (!is_string($token) || !hash_equals(adminToken(), $token)) adminFail(403, 'Sesi formulir tidak valid. Muat ulang halaman lalu coba kembali.');
}
function adminLog(Throwable $error): void
{
    error_log('[Kamiliya admin] ' . $error);
}
function adminId(): int
{
    $id = filter_var($_GET['id'] ?? $_POST['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    if ($id === false || $id === null) adminFail(400, 'ID project tidak valid.');
    return $id;
}
function adminQuery(string $sql, array $params = []): PDOStatement
{
    $statement = portfolioDatabase()->prepare($sql); $statement->execute($params); return $statement;
}
function adminProject(int $id): array
{
    $demoColumn = projectDemoSelectColumn();
    $project = adminQuery("SELECT id, title, description, tech, category, file_path, created_at, {$demoColumn} FROM projects WHERE id = ?", [$id])->fetch();
    if (!$project) adminFail(404, 'Project tidak ditemukan.');
    return $project;
}
function adminProjects(): array
{
    $demoColumn = projectDemoSelectColumn();
    return adminQuery("SELECT id, title, description, tech, category, file_path, created_at, {$demoColumn} FROM projects ORDER BY created_at DESC, id DESC")->fetchAll();
}
set_exception_handler(static function (Throwable $error): void {
    adminLog($error);
    adminFail(503, 'Layanan belum tersedia. Silakan coba kembali atau hubungi administrator.');
});
function adminFlash(string $message, string $kind = 'success'): void
{
    $_SESSION['admin_flash'] = ['message' => $message, 'kind' => $kind];
}
