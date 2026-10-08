<?php
declare(strict_types=1);
ini_set('display_errors', '0');
require __DIR__ . '/connection.php';

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
$id = filter_var($_GET['id'] ?? null, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
if ($id === false || $id === null) {
    http_response_code(400); exit('ID project tidak valid.');
}
try {
    $statement = portfolioDatabase()->prepare('SELECT id, title, description, tech, category, created_at FROM projects WHERE id = ?');
    $statement->execute([$id]);
    $project = $statement->fetch();
    if (!$project) {
        http_response_code(404); exit('Project tidak ditemukan.');
    }
    $csv = fopen('php://temp', 'w+');
    if ($csv === false) throw new RuntimeException('Unable to prepare CSV recap.');
    // Neutralize spreadsheet formulas while preserving the project's text and UTF-8.
    $cell = static function (mixed $value): string {
        $text = (string) $value;
        return preg_match('/^(?:\s*[=+@-]|[\t\r\n])/u', $text) ? "'" . $text : $text;
    };
    fwrite($csv, "\xEF\xBB\xBF");
    $english = ($_GET['lang'] ?? '') === 'en';
    fputcsv($csv, $english
        ? ['ID', 'Title', 'Description', 'Technologies', 'Category', 'Created at']
        : ['ID', 'Judul', 'Deskripsi', 'Teknologi', 'Kategori', 'Tanggal Dibuat'], ',', '"', '');
    fputcsv($csv, array_map($cell, array_values($project)), ',', '"', '');
    $size = ftell($csv);
    rewind($csv);
    header('Content-Type: text/csv; charset=UTF-8');
    header('Content-Disposition: attachment; filename="rekap-project-' . $id . '.csv"');
    header('Content-Length: ' . $size);
    fpassthru($csv); fclose($csv);
} catch (Throwable $error) {
    error_log('[Kamiliya project recap] ' . $error);
    http_response_code(503); echo 'Rekap data belum dapat diunduh. Silakan coba kembali.';
}
