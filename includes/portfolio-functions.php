<?php
function escapeHtml($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function renderProjectCard($title, $description, $tech, $link, $details = [])
{
    $translationAttribute = static function ($key): string {
        return is_string($key) && $key !== '' ? ' data-i18n="' . escapeHtml($key) . '"' : '';
    };
    $projectId = isset($details['id']) ? ' data-project-id="' . escapeHtml($details['id']) . '"' : '';
    echo '<article class="project-card"' . $projectId . '>';
    echo '<div class="project-thumb project-thumb-image">';
    if ($details['image'] !== '') {
        echo '<img src="' . escapeHtml($details['image']) . '" alt="' . escapeHtml($details['imageAlt']) . '">';
    } else {
        // The existing thumbnail area remains; PDF content is never passed to an img element.
        echo '<svg width="100%" height="180" viewBox="0 0 300 180" role="img" aria-label="' . escapeHtml($details['fileLabel'] ?? 'FILE') . '"><g fill="none" stroke="#2563eb" stroke-width="3"><path d="M126 38h35l22 22v82h-57z"/><path d="M161 38v22h22M140 79h28M140 92h28"/></g><text x="154" y="123" text-anchor="middle" fill="#2563eb" font-family="Arial, sans-serif" font-size="17">' . escapeHtml($details['fileLabel'] ?? 'FILE') . '</text></svg>';
    }
    echo '</div>';
    echo '<div class="project-card-copy">';
    echo '<div class="project-badge"' . $translationAttribute($details['badgeKey'] ?? null) . '>' . escapeHtml($details['badge']) . '</div>';
    echo '<h2' . $translationAttribute($details['titleKey'] ?? null) . '>' . escapeHtml($title) . '</h2>';
    echo '<p' . $translationAttribute($details['descriptionKey'] ?? null) . '>' . escapeHtml($description) . '</p>';
    echo '<div class="project-tags">';
    foreach ($tech as $technology) {
        echo '<span>' . escapeHtml($technology) . '</span>';
    }
    echo '</div>';
    if ($details['points']) {
        echo '<ul class="project-points">';
        foreach ($details['points'] as $point) {
            echo '<li' . $translationAttribute($point['key'] ?? null) . '>' . escapeHtml($point['text']) . '</li>';
        }
        echo '</ul>';
    }
    $pdfViewUrl = $details['pdfViewUrl'] ?? '';
    if ($pdfViewUrl !== '') echo '<div class="project-card-actions">';
    if (($details['showAction'] ?? true) && $link !== '') {
        echo '<a class="button-primary small-button" href="' . escapeHtml($link) . '"' . ($details['external'] ? ' target="_blank" rel="noopener noreferrer"' : '') . $translationAttribute($details['linkKey'] ?? null) . '>' . escapeHtml($details['linkLabel'] ?? 'Visit Website') . '</a>';
    } elseif ($details['showAction'] ?? true) {
        echo '<span class="button-primary small-button" aria-disabled="true"' . $translationAttribute($details['unavailableKey'] ?? null) . '>' . escapeHtml($details['unavailableLabel'] ?? 'No public link') . '</span>';
    }
    if ($pdfViewUrl !== '') {
        echo '<a class="button-primary small-button" href="' . escapeHtml($pdfViewUrl) . '" target="_blank" rel="noopener noreferrer" data-i18n="projects.actions.viewPdf">Lihat PDF</a></div>';
    }
    echo '</div></article>';
}

function renderPortfolioSection($projects)
{
    echo '<section class="project-grid">';
    foreach ($projects as $project) {
        renderProjectCard($project['title'], $project['description'], $project['tech'], $project['link'], $project);
    }
    echo '</section>';
}
