<?php
declare(strict_types=1);
ini_set('display_errors', '0');
require __DIR__ . '/connection.php';
require __DIR__ . '/includes/project-storage.php';

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');
$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false || $id === null) {
    http_response_code(400); exit('ID project tidak valid.');
}
try {
    $statement = portfolioDatabase()->prepare('SELECT file_path FROM projects WHERE id = ?');
    $statement->execute([$id]);
    $project = $statement->fetch();
    $path = $project ? projectFile($project['file_path']) : null;
    $extension = $path !== null ? strtolower(pathinfo($path, PATHINFO_EXTENSION)) : '';
    $types = ['jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png'];
    if ($path === null || !isset($types[$extension]) || (new finfo(FILEINFO_MIME_TYPE))->file($path) !== $types[$extension]) {
        http_response_code(404); exit('Gambar project tidak ditemukan.');
    }
    $handle = fopen($path, 'rb');
    if ($handle === false) {
        http_response_code(404); exit('Gambar project tidak dapat dibaca.');
    }
    header('Content-Type: ' . $types[$extension]);
    header('Content-Disposition: inline; filename="project-' . $id . '.' . $extension . '"');
    header('Content-Length: ' . fstat($handle)['size']);
    fpassthru($handle); fclose($handle);
} catch (Throwable $error) {
    error_log('[Kamiliya public project image] ' . $error);
    http_response_code(503); echo 'Gambar belum dapat dimuat. Silakan coba kembali.';
}
