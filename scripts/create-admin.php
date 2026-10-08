<?php
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require __DIR__ . '/../connection.php';
$username = $argv[1] ?? '';
if (strlen($username) < 3 || strlen($username) > 80 ||
    (!preg_match('/^[A-Za-z0-9_.-]{3,80}$/D', $username) && !filter_var($username, FILTER_VALIDATE_EMAIL))) {
    fwrite(STDERR, "Username: 3–80 karakter berupa nama pengguna atau alamat email valid.\n"); exit(1);
}
// Password comes only from standard input, never a command-line argument.
$password = rtrim((string) fgets(STDIN), "\r\n");
if (strlen($password) < 12 || strlen($password) > 72 || !mb_check_encoding($password, 'UTF-8')) {
    fwrite(STDERR, "Password wajib 12–72 byte dengan UTF-8 valid.\n"); exit(1);
}
try {
    $pdo = portfolioDatabase();
    $statement = $pdo->prepare('INSERT INTO users (username, password) VALUES (?, ?)');
    $statement->execute([$username, password_hash($password, PASSWORD_DEFAULT)]);
    unset($password);
    echo "Akun admin berhasil dibuat.\n";
} catch (Throwable $error) {
    error_log('[Kamiliya create admin] ' . $error);
    fwrite(STDERR, "Akun belum dapat dibuat. Periksa konfigurasi database, skema, dan kemungkinan username sudah digunakan.\n"); exit(1);
}
