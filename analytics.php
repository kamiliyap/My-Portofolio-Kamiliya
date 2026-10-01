<?php $currentPage = 'analytics'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Developer Analytics | Kamiliya</title>
    <meta name="description" content="Developer Analytics: skills, projects, and continuous learning by Kamiliya.">
    <link rel="icon" type="image/png" href="assets/images/logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="assets/css/style-navbar.css">
    <link rel="stylesheet" href="assets/css/style-site.css">
    <link rel="stylesheet" href="assets/css/analytics.css">
    <!-- Library khusus halaman Analytics; hero-animation.js tidak dimuat di sini. -->
    <script src="assets/js/theme.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js" defer></script>
    <script src="https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.min.js" defer></script>
    <script src="assets/js/analytics.js" defer></script>
</head>
<body data-page="analytics">
    <?php include 'navbar.html'; ?>
    <main class="page-shell analytics-page">
        <header class="page-heading">
            <span class="eyebrow">SKILLS · PROJECTS · GROWTH</span>
            <h1>Developer Analytics</h1>
            <p data-analytics="subtitle">A visual overview of my skills, projects, and continuous learning journey.</p>
        </header>
        <!-- Ringkasan pencapaian; angka sesuai data tugas. -->
        <section class="analytics-summary" aria-label="Summary">
            <?php foreach ([['5+', 'projects', 'Completed Projects', 'laptop'], ['8+', 'technologies', 'Technologies', 'code-slash'], ['5+', 'certifications', 'Certifications', 'award'], ['1+', 'experience', 'Years Experience', 'mortarboard']] as [$value, $key, $label, $icon]): ?>
            <article class="analytics-summary-card">
                <i class="bi bi-<?= $icon ?>" aria-hidden="true"></i>
                <strong><?= $value ?></strong><span data-analytics="<?= $key ?>"><?= $label ?></span>
            </article>
            <?php endforeach; ?>
        </section>
        <div class="analytics-toolbar">
            <p data-analytics="note">Bootcamp dataset · Illustrative project categories and technology usage.</p>
            <button class="button-primary" id="refresh-analytics" type="button"><i class="bi bi-arrow-clockwise" aria-hidden="true"></i> <span data-analytics="refresh">Refresh Analytics</span></button>
        </div>
        <p id="analytics-status" role="status" aria-live="polite"></p>
        <section class="analytics-grid" aria-label="Charts">
            <?php foreach ([['skills', 'skillsTitle', 'Skill Overview'], ['categories', 'categoriesTitle', 'Project Categories'], ['learning', 'learningTitle', 'Learning Progress']] as [$id, $key, $title]): ?>
            <article class="analytics-chart-card">
                <h2 id="<?= $id ?>-title" data-analytics="<?= $key ?>"><?= $title ?></h2>
                <div class="analytics-canvas"><canvas id="<?= $id ?>-chart" role="img" aria-labelledby="<?= $id ?>-title"></canvas></div>
                <p class="analytics-caption" data-analytics="<?= $id ?>Note"></p>
            </article>
            <?php endforeach; ?>
        </section>
        <section class="analytics-advanced">
            <div class="section-heading"><p class="section-kicker">DEEPER INSIGHTS</p><h2 data-analytics="advanced">Advanced Analytics</h2></div>
            <div class="analytics-grid">
                <article class="analytics-chart-card">
                    <h2 id="technology-title" data-analytics="technologyTitle">Technology by Project</h2>
                    <div class="analytics-canvas"><canvas id="technology-chart" role="img" aria-labelledby="technology-title"></canvas></div>
                    <p class="analytics-caption" data-analytics="technologyNote"></p>
                </article>
                <article class="analytics-chart-card">
                    <h2 id="difficulty-title" data-analytics="difficultyTitle">Project Difficulty vs Duration</h2>
                    <div class="analytics-canvas"><canvas id="difficulty-chart" role="img" aria-labelledby="difficulty-title"></canvas></div>
                    <p class="analytics-caption" data-analytics="difficultyNote"></p>
                </article>
            </div>
        </section>
        <noscript>Aktifkan JavaScript untuk menampilkan grafik / Enable JavaScript to view charts.</noscript>
    </main>
    <?php include 'footer.php'; ?>
</body>
</html>
