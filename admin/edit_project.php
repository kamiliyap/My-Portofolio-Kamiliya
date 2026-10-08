<?php
require __DIR__ . '/../includes/admin-bootstrap.php';
adminRequireLogin();
require __DIR__ . '/../includes/admin-layout.php';
require __DIR__ . '/../includes/project-storage.php';
$project = adminProject(adminId());
$demoEnabled = projectDemoColumnReady();
$values = array_intersect_key($project, array_flip(['title', 'description', 'tech', 'category', 'demo_url']));
$values['demo_url'] ??= '';
$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    adminCsrf();
    $errors = projectValidate($values);
    if (!$demoEnabled && $values['demo_url'] !== '') $errors[] = 'Field video demo belum aktif. Tambahkan kolom demo_url melalui phpMyAdmin terlebih dahulu.';
    $newFile = null;
    $pdo = null;
    try {
        $newFile = projectReceiveUpload(false, $errors);
        if (!$errors) {
            $pdo = portfolioDatabase(); $pdo->beginTransaction();
            $current = adminQuery('SELECT id, file_path FROM projects WHERE id = ? FOR UPDATE', [$project['id']])->fetch();
            if (!$current) throw new RuntimeException('Project was removed during editing.');
            $path = $newFile ?? $current['file_path'];
            $params = [$values['title'], $values['description'], $values['tech'], $values['category'], $path];
            if ($demoEnabled) {
                $params[] = $values['demo_url'] !== '' ? $values['demo_url'] : null;
                $params[] = $project['id'];
                adminQuery('UPDATE projects SET title = ?, description = ?, tech = ?, category = ?, file_path = ?, demo_url = ? WHERE id = ?', $params);
            } else {
                $params[] = $project['id'];
                adminQuery('UPDATE projects SET title = ?, description = ?, tech = ?, category = ?, file_path = ? WHERE id = ?', $params);
            }
            $pdo->commit();
            $clean = $newFile === null || projectRemoveFile($current['file_path']);
            adminFlash($clean ? 'Project berhasil diperbarui.' : 'Project diperbarui, tetapi file lama belum dapat dihapus. Administrator perlu memeriksa log server.', $clean ? 'success' : 'error');
            adminRedirect('admin/detail_project.php?id=' . $project['id']);
        }
    } catch (Throwable $error) {
        if ($pdo && $pdo->inTransaction()) $pdo->rollBack();
        adminLog($error);
        if ($newFile !== null) projectRemoveFile($newFile);
        $errors[] = 'Project belum dapat diperbarui. Muat ulang halaman dan coba kembali.';
    }
}
adminHeader('Edit Project', 'projects');
require __DIR__ . '/../includes/admin-project-form.php';
adminFooter();
