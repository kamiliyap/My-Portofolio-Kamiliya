<?php
declare(strict_types=1);

require_once __DIR__ . '/../connection.php';
require_once __DIR__ . '/project-storage.php';

function publicProjectCards(array $legacyProjects, bool &$unavailable): array
{
    $unavailable = false;
    try {
        $demoColumn = projectDemoSelectColumn();
        $statement = portfolioDatabase()->prepare(
            "SELECT id, title, description, tech, category, file_path, created_at, {$demoColumn} FROM projects ORDER BY created_at DESC, id DESC"
        );
        $statement->execute();
        $rows = $statement->fetchAll();
    } catch (Throwable $error) {
        error_log('[Kamiliya public projects] ' . $error);
        $unavailable = true;
        return $legacyProjects;
    }

    $cards = [];
    foreach ($rows as $row) {
        $path = null;
        try {
            $path = projectFile($row['file_path']);
        } catch (Throwable $error) {
            error_log('[Kamiliya public project file] ' . $error);
        }
        $extension = $path !== null ? strtolower(pathinfo($path, PATHINFO_EXTENSION)) : '';
        $image = $path !== null && in_array($extension, ['jpg', 'jpeg', 'png'], true);
        $technologies = preg_split('/[,;\r\n]+/u', $row['tech']) ?: [];
        $demoUrl = projectDemoUrl($row['demo_url'] ?? null);
        $cards[] = [
            'id' => (int) $row['id'],
            'title' => $row['title'],
            'description' => $row['description'],
            'tech' => array_values(array_filter(array_map('trim', $technologies), static fn(string $value): bool => $value !== '')),
            'badge' => $row['category'],
            // IDs are the only input to public file endpoints. Never expose a DB path as a URL.
            'image' => $image ? 'project-image.php?id=' . (int) $row['id'] : '',
            'imageAlt' => $row['title'],
            'fileLabel' => $extension === 'pdf' ? 'PDF' : 'FILE',
            'pdfViewUrl' => $extension === 'pdf' ? 'download-project.php?id=' . (int) $row['id'] . '&view=1' : '',
            'link' => $demoUrl ?? '',
            'showAction' => $demoUrl !== null,
            'linkLabel' => 'Video Demo',
            'linkKey' => 'projects.actions.demo',
            'external' => true,
            'points' => [],
        ];
    }

    // Keep the original showcase intact. No title-based deduplication or database migration.
    return array_merge($cards, $legacyProjects);
}
