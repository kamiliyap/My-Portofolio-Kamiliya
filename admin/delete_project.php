<?php
require __DIR__ . '/../includes/admin-bootstrap.php';
adminRequireLogin(); adminCsrf();
require __DIR__ . '/../includes/project-storage.php';
$id = adminId();
$pdo = portfolioDatabase();
try {
    $pdo->beginTransaction();
    $project = adminQuery('SELECT id, file_path FROM projects WHERE id = ? FOR UPDATE', [$id])->fetch();
    if (!$project) { $pdo->rollBack(); adminFail(404, 'Project tidak ditemukan.'); }
    adminQuery('DELETE FROM projects WHERE id = ?', [$id]);
    $pdo->commit();
    $clean = projectRemoveFile($project['file_path']);
    adminFlash($clean ? 'Project dan file berhasil dihapus.' : 'Data project dihapus, tetapi file belum dapat dihapus. Administrator perlu memeriksa log server.', $clean ? 'success' : 'error');
} catch (Throwable $error) {
    if ($pdo->inTransaction()) $pdo->rollBack();
    adminLog($error); adminFlash('Project belum dapat dihapus. Silakan coba kembali.', 'error');
}
adminRedirect('admin/projects.php');
