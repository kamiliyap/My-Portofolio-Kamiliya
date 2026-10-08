<?php
// This controller runs before any HTML is sent by contact.php.
ini_set('display_errors', '0');
session_start([
    'use_strict_mode' => true,
    'cookie_httponly' => true,
    'cookie_samesite' => 'Lax',
]);
header('Cache-Control: no-store');
$contactMessages = require __DIR__ . '/contact-messages.php';
$contactLang = ($_GET['lang'] ?? '') === 'en' ? 'en' : 'id';
$contactValues = ['name' => '', 'email' => '', 'message' => ''];
$contactErrors = [];
$contactSuccess = false;
if (empty($_SESSION['contact_csrf'])) {
    $_SESSION['contact_csrf'] = bin2hex(random_bytes(32));
}
function contactEscape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $contactLang = ($_POST['lang'] ?? '') === 'en' ? 'en' : 'id';
    foreach ($contactValues as $key => $unused) {
        $contactValues[$key] = is_string($_POST[$key] ?? null) ? trim($_POST[$key]) : '';
        if (!mb_check_encoding($contactValues[$key], 'UTF-8')) $contactValues[$key] = '';
    }
    $token = $_POST['csrf_token'] ?? null;
    if (!is_string($token) || !hash_equals($_SESSION['contact_csrf'], $token)) {
        $contactErrors[] = 'csrf';
    } else {
        // Consume the token so a replay of the same POST cannot insert twice.
        $_SESSION['contact_csrf'] = bin2hex(random_bytes(32));
        if ($contactValues['name'] === '') $contactErrors[] = 'nameRequired';
        elseif (mb_strlen($contactValues['name']) > 100) $contactErrors[] = 'nameLength';
        if ($contactValues['email'] === '') $contactErrors[] = 'emailRequired';
        elseif (mb_strlen($contactValues['email']) > 150) $contactErrors[] = 'emailLength';
        elseif (!filter_var($contactValues['email'], FILTER_VALIDATE_EMAIL)) $contactErrors[] = 'emailInvalid';
        if ($contactValues['message'] === '') $contactErrors[] = 'messageRequired';
        elseif (mb_strlen($contactValues['message']) > 5000) $contactErrors[] = 'messageLength';
        if (!$contactErrors) {
            try {
                require_once __DIR__ . '/../config/database.php';
                $pdo = contactDatabase();
                $statement = $pdo->prepare('INSERT INTO contact_messages (nama, email, pesan) VALUES (:nama, :email, :pesan)');
                $statement->execute([
                    ':nama' => $contactValues['name'],
                    ':email' => $contactValues['email'],
                    ':pesan' => $contactValues['message'],
                ]);
                $contactSuccess = true;
                $contactValues = ['name' => '', 'email' => '', 'message' => ''];
            } catch (Throwable $exception) {
                error_log('[Kamiliya contact] ' . get_class($exception) . ' [' . $exception->getCode() . ']: ' . $exception->getMessage());
                $contactErrors[] = 'database';
            }
        }
    }
    // Bound session storage even when browser maxlength is bypassed.
    foreach (['name' => 100, 'email' => 150, 'message' => 5000] as $key => $limit) {
        $contactValues[$key] = mb_substr($contactValues[$key], 0, $limit);
    }
    $_SESSION['contact_flash'] = ['values' => $contactValues, 'errors' => $contactErrors, 'success' => $contactSuccess];
    session_write_close();
    header('Location: contact.php?lang=' . $contactLang . '#contact-form', true, 303);
    exit;
}
if (isset($_SESSION['contact_flash'])) {
    $flash = $_SESSION['contact_flash'];
    unset($_SESSION['contact_flash']);
    $contactValues = $flash['values'];
    $contactErrors = $flash['errors'];
    $contactSuccess = $flash['success'];
}
$contactToken = $_SESSION['contact_csrf'];
session_write_close();
