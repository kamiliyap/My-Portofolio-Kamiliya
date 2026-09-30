<?php

function contactDatabase(): PDO
{
    $config = require __DIR__ . '/database.local.php';

    $host = $config['host'];
    $port = $config['port'] ?? 3306;
    $database = $config['database'];
    $username = $config['username'];
    $password = $config['password'];

    $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";

    return new PDO(
        $dsn,
        $username,
        $password,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );
}