<?php
require __DIR__ . '/includes/admin-bootstrap.php';
require __DIR__ . '/includes/admin-layout.php';
if (!empty($_SESSION['admin_id'])) adminRedirect('admin/dashboard.php');
$error = '';
$username = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    adminCsrf();
    $username = is_string($_POST['username'] ?? null) ? trim($_POST['username']) : '';
    $password = is_string($_POST['password'] ?? null) ? $_POST['password'] : '';
    $attempts = $_SESSION['login_attempts'] ?? ['count' => 0, 'until' => 0];
    if ($attempts['until'] <= time()) $attempts = ['count' => 0, 'until' => time() + 300];
    if ($attempts['count'] >= 5) {
        $error = 'Terlalu banyak percobaan. Tunggu 5 menit sebelum mencoba kembali.';
    } elseif ($username === '' || $password === '' || strlen($username) > 80 || strlen($password) > 1024) {
        $error = 'Username dan password wajib diisi dengan nilai yang valid.';
    } else {
        try {
            $user = adminQuery('SELECT id, username, password FROM users WHERE username = ?', [$username])->fetch();
            $hash = $user ? $user['password'] : password_hash(bin2hex(random_bytes(16)), PASSWORD_DEFAULT);
            if (password_verify($password, $hash) && $user) {
                session_regenerate_id(true);
                $_SESSION = ['admin_id' => (int) $user['id'], 'admin_username' => $user['username'], 'admin_seen' => time(), 'admin_csrf' => bin2hex(random_bytes(32))];
                if (password_needs_rehash($user['password'], PASSWORD_DEFAULT)) {
                    adminQuery('UPDATE users SET password = ? WHERE id = ?', [password_hash($password, PASSWORD_DEFAULT), $user['id']]);
                }
                adminRedirect('admin/dashboard.php');
            }
            $attempts['count']++;
            $_SESSION['login_attempts'] = $attempts;
            $error = 'Username atau password salah.';
        } catch (Throwable $exception) {
            adminLog($exception); $error = 'Login belum tersedia. Silakan coba kembali atau hubungi administrator.';
        }
    }
}
adminHeader('Admin Access', '', false);
?>
<section class="admin-card login-card"><div class="login-heading"><div class="dialog-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3"/></svg></div><h2>Kamiliya Admin</h2><p>Masuk untuk mengelola project<br>portfolio kamu.</p></div>
<?php if ($error): ?><div class="notice error" role="alert"><?= adminEscape($error) ?></div><?php endif; ?>
<form class="admin-form" method="post" action="<?= adminEscape(adminUrl('admin-login.php')) ?>">
<input type="hidden" name="csrf_token" value="<?= adminEscape(adminToken()) ?>">
<div class="field"><label for="username">Username</label><input id="username" name="username" value="<?= adminEscape($username) ?>" maxlength="80" autocomplete="username" required></div>
<div class="field"><label for="password">Password</label><div class="password-field"><input id="password" name="password" type="password" maxlength="1024" autocomplete="current-password" required><button type="button" class="admin-button secondary" data-show-password aria-controls="password" aria-pressed="false">Lihat</button></div></div>
<button class="admin-button login-submit" type="submit">Login →</button></form></section>
<?php adminFooter(false); ?>
