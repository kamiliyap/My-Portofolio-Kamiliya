<?php
function escapeHtml($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function renderProjectCard($title, $description, $tech, $link, $details = [])
{
    echo '<article class="project-card">';
    echo '<div class="project-thumb project-thumb-image"><img src="' . escapeHtml($details['image']) . '" alt="' . escapeHtml($details['imageAlt']) . '"></div>';
    echo '<div class="project-card-copy">';
    echo '<div class="project-badge" data-i18n="' . escapeHtml($details['badgeKey']) . '">' . escapeHtml($details['badge']) . '</div>';
    echo '<h2 data-i18n="' . escapeHtml($details['titleKey']) . '">' . escapeHtml($title) . '</h2>';
    echo '<p data-i18n="' . escapeHtml($details['descriptionKey']) . '">' . escapeHtml($description) . '</p>';
    echo '<div class="project-tags">';
    foreach ($tech as $technology) {
        echo '<span>' . escapeHtml($technology) . '</span>';
    }
    echo '</div>';
    echo '<ul class="project-points">';
    foreach ($details['points'] as $point) {
        echo '<li data-i18n="' . escapeHtml($point['key']) . '">' . escapeHtml($point['text']) . '</li>';
    }
    echo '</ul>';
    if ($link !== '') {
        echo '<a class="button-primary small-button" href="' . escapeHtml($link) . '"' . ($details['external'] ? ' target="_blank" rel="noreferrer"' : '') . '>Visit Website</a>';
    } else {
        echo '<span class="button-primary small-button" aria-disabled="true">No public link</span>';
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