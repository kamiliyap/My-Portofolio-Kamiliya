<?php
require __DIR__ . '/includes/admin-bootstrap.php';
require __DIR__ . '/includes/project-storage.php';
$project = adminProject(adminId());
$path = projectFile($project['file_path']);
if ($path === null) adminFail(404, 'File project tidak ditemukan atau tidak dapat diakses.');
$handle = fopen($path, 'rb');
if ($handle === false) adminFail(404, 'File project tidak dapat dibaca.');
$extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
$types = ['pdf' => 'application/pdf', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png'];
session_write_close();
header('Content-Type: ' . $types[$extension]);
$disposition = $extension === 'pdf' && ($_GET['view'] ?? '') === '1' ? 'inline' : 'attachment';
header('Content-Disposition: ' . $disposition . '; filename="project-' . (int) $project['id'] . '.' . $extension . '"');
header('Content-Length: ' . fstat($handle)['size']);
fpassthru($handle); fclose($handle); exit;
