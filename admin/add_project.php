<?php
require __DIR__ . '/../includes/admin-bootstrap.php';
adminRequireLogin();
require __DIR__ . '/../includes/admin-layout.php';
require __DIR__ . '/../includes/project-storage.php';
$demoEnabled = projectDemoColumnReady();
$values = ['title' => '', 'description' => '', 'tech' => '', 'category' => '', 'demo_url' => ''];
$errors = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    adminCsrf();
    $errors = projectValidate($values);
    if (!$demoEnabled && $values['demo_url'] !== '') $errors[] = 'Field video demo belum aktif. Tambahkan kolom demo_url melalui phpMyAdmin terlebih dahulu.';
    $newFile = null;
    try {
        $newFile = projectReceiveUpload(true, $errors);
        if (!$errors && $newFile !== null) {
            $params = [$values['title'], $values['description'], $values['tech'], $values['category'], $newFile];
            if ($demoEnabled) {
                $params[] = $values['demo_url'] !== '' ? $values['demo_url'] : null;
                adminQuery('INSERT INTO projects (title, description, tech, category, file_path, demo_url) VALUES (?, ?, ?, ?, ?, ?)', $params);
            } else {
                adminQuery('INSERT INTO projects (title, description, tech, category, file_path) VALUES (?, ?, ?, ?, ?)', $params);
            }
            adminFlash('Project berhasil ditambahkan.'); adminRedirect('admin/projects.php');
        }
    } catch (Throwable $error) {
        adminLog($error);
        if ($newFile !== null) projectRemoveFile($newFile);
        $errors[] = 'Project belum dapat disimpan. Silakan coba kembali.';
    }
}
adminHeader('Tambah Project', 'add');
require __DIR__ . '/../includes/admin-project-form.php';
adminFooter();
