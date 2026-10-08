<?php
declare(strict_types=1);

function portfolioDatabase(): PDO
{
    static $pdo;
    if ($pdo instanceof PDO) return $pdo;
    $path = __DIR__ . '/config/portfolio.local.php';
    $config = is_file($path) ? require $path : [];
    $get = static function (string $key, mixed $default = null) use ($config): mixed {
        $value = getenv('PORTFOLIO_DB_' . strtoupper($key));
        return $value !== false ? $value : ($config[$key] ?? $default);
    };
    $host = (string) $get('host', 'localhost');
    $port = (int) $get('port', 3306);
    $user = $get('username');
    $password = $get('password');
    if (!is_string($user) || $user === '' || !is_string($password)) {
        throw new RuntimeException('Portfolio database configuration is incomplete.');
    }
    return $pdo = new PDO("mysql:host={$host};port={$port};dbname=portfolio_kamiliya;charset=utf8mb4", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
}
