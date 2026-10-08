<?php
require __DIR__ . '/includes/admin-bootstrap.php';
adminRequireLogin();
adminCsrf();
$_SESSION = [];
if (ini_get('session.use_cookies')) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', ['expires' => time() - 42000, 'path' => $params['path'], 'domain' => $params['domain'], 'secure' => $params['secure'], 'httponly' => $params['httponly'], 'samesite' => $params['samesite']]);
}
session_destroy();
adminRedirect('admin-login.php');
