<?php
$cvPath = __DIR__ . '/assets/cv/CV - KAMILIYA LATIFAH PRASMAISYA-IT 2026.pdf';
$downloadName = 'CV-Kamiliya-Latifah-Prasmaisya-IT-2026.pdf';

if (!is_file($cvPath)) {
    http_response_code(404);
    exit('File CV tidak ditemukan.');
}

header('Content-Description: File Transfer');
header('Content-Type: application/pdf');
header('Content-Disposition: attachment; filename="' . $downloadName . '"');
header('Content-Length: ' . filesize($cvPath));
header('Cache-Control: no-cache, must-revalidate');
header('Pragma: public');

readfile($cvPath);
exit;
