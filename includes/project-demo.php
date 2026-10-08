<?php
declare(strict_types=1);
require_once __DIR__ . '/../connection.php';

function projectDemoColumnReady(): bool
{
    static $ready;
    if (is_bool($ready)) return $ready;
    $statement = portfolioDatabase()->prepare(
        'SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?'
    );
    $statement->execute(['projects', 'demo_url']);
    return $ready = (int) $statement->fetchColumn() > 0;
}

function projectDemoSelectColumn(): string
{
    // Both expressions are fixed SQL, never user input. Old schemas remain usable.
    return projectDemoColumnReady() ? 'demo_url' : 'NULL AS demo_url';
}

function projectDemoUrl(mixed $value): ?string
{
    if (!is_string($value)) return null;
    $url = trim($value);
    if ($url === '' || strlen($url) > 2048 || !filter_var($url, FILTER_VALIDATE_URL) || preg_match('/[\x00-\x20\x7F]/', $url)) return null;
    $parts = parse_url($url);
    if (!$parts || strtolower($parts['scheme'] ?? '') !== 'https' || isset($parts['user']) || isset($parts['pass']) || isset($parts['port'])) return null;
    $hosts = ['drive.google.com', 'docs.google.com', 'youtube.com', 'www.youtube.com', 'm.youtube.com', 'youtu.be'];
    return in_array(strtolower($parts['host'] ?? ''), $hosts, true) ? $url : null;
}
