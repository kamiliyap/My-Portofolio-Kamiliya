<?php
declare(strict_types=1);
require_once __DIR__ . '/project-demo.php';

function projectUploads(): string
{
    $directory = dirname(__DIR__) . '/uploads';
    if (!is_dir($directory) && !mkdir($directory, 0750, true) && !is_dir($directory)) {
        throw new RuntimeException('Unable to create uploads directory.');
    }
    $real = realpath($directory);
    if ($real === false) throw new RuntimeException('Uploads directory unavailable.');
    if (!is_file($real . '/.htaccess') && file_put_contents($real . '/.htaccess', "Options -Indexes -ExecCGI\nRequire all denied\n", LOCK_EX) === false) {
        throw new RuntimeException('Unable to protect uploads directory.');
    }
    return $real;
}
function projectFile(string $relative): ?string
{
    if (!preg_match('~^uploads/[a-f0-9]{32}\.(pdf|jpg|jpeg|png)$~D', $relative)) return null;
    $root = projectUploads();
    $candidate = $root . DIRECTORY_SEPARATOR . basename($relative);
    if (is_link($candidate)) return null;
    $real = realpath($candidate);
    return $real !== false && is_file($real) && dirname($real) === $root ? $real : null;
}
function projectRemoveFile(string $relative): bool
{
    try {
        $path = projectFile($relative);
        if ($path === null) {
            error_log('[Kamiliya files] Missing or rejected file: ' . $relative);
            return false;
        }
        if (!unlink($path)) throw new RuntimeException('Unable to unlink uploaded file.');
        return true;
    } catch (Throwable $error) { adminLog($error); return false; }
}
function projectReceiveUpload(bool $required, array &$errors): ?string
{
    $file = $_FILES['file'] ?? null;
    if ($file === null || (is_array($file) && ($file['error'] ?? null) === UPLOAD_ERR_NO_FILE)) {
        if ($required) $errors[] = 'File project wajib diupload.';
        return null;
    }
    if (!is_array($file) || !isset($file['error'], $file['name'], $file['size'], $file['tmp_name']) ||
        !is_int($file['error']) || !is_string($file['name']) || !is_string($file['tmp_name']) || !is_int($file['size'])) {
        $errors[] = 'Data upload tidak valid.'; return null;
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = in_array($file['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true)
            ? 'Ukuran file maksimal 2 MB.' : 'Upload gagal. Pilih file dan coba kembali.';
        return null;
    }
    if (!is_uploaded_file($file['tmp_name'])) { $errors[] = 'File upload tidak valid.'; return null; }
    $size = filesize($file['tmp_name']);
    if ($size === false || $size === 0 || $size > 2 * 1024 * 1024) { $errors[] = 'File tidak boleh kosong dan maksimal 2 MB.'; return null; }
    $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $types = ['pdf' => 'application/pdf', 'jpg' => 'image/jpeg', 'jpeg' => 'image/jpeg', 'png' => 'image/png'];
    if (!isset($types[$extension]) || (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']) !== $types[$extension]) {
        $errors[] = 'Hanya PDF, JPG, JPEG, atau PNG dengan isi file yang sesuai yang diperbolehkan.'; return null;
    }
    if ($errors) return null;
    $name = bin2hex(random_bytes(16)) . '.' . $extension;
    if (!move_uploaded_file($file['tmp_name'], projectUploads() . DIRECTORY_SEPARATOR . $name)) {
        throw new RuntimeException('Unable to move uploaded file.');
    }
    return 'uploads/' . $name;
}
function projectValidate(array &$values): array
{
    $errors = [];
    foreach (['title' => 200, 'description' => 10000, 'tech' => 500, 'category' => 100] as $key => $limit) {
        $value = $_POST[$key] ?? null;
        $values[$key] = is_string($value) ? trim($value) : '';
        if ($values[$key] === '') $errors[] = ucfirst($key) . ' wajib diisi.';
        elseif (!mb_check_encoding($values[$key], 'UTF-8') || mb_strlen($values[$key]) > $limit) {
            $errors[] = ucfirst($key) . ' harus berupa teks valid, maksimal ' . $limit . ' karakter.';
        }
    }
    $demo = $_POST['demo_url'] ?? '';
    $values['demo_url'] = is_string($demo) ? trim($demo) : '';
    if (!is_string($demo) || ($values['demo_url'] !== '' && projectDemoUrl($values['demo_url']) === null)) {
        $errors[] = 'Link video demo harus berupa URL HTTPS Google Drive atau YouTube yang valid (maksimal 2048 karakter).';
    }
    return $errors;
}
