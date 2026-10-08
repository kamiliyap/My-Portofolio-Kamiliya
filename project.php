<?php
ini_set('display_errors', '0');
$currentPage = 'projects';
require __DIR__ . '/includes/portfolio-data.php';
require __DIR__ . '/includes/portfolio-functions.php';
require __DIR__ . '/includes/public-projects.php';
$databaseUnavailable = false;
$projects = publicProjectCards($projects, $databaseUnavailable);
header('Cache-Control: no-store');
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.projects.title">Proyek | Kamiliya</title>
    <meta id="page-description" name="description" content="Kumpulan proyek portofolio junior web programmer Kamiliya." data-i18n-content="meta.projects.description">
    <link rel="icon" type="image/png" href="assets/images/logo.png">
    <link rel="apple-touch-icon" href="assets/images/logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="assets/css/style-navbar.css">
    <link rel="stylesheet" href="assets/css/style-site.css">
    <script src="assets/js/site-theme.js" defer></script>
    <script src="assets/js/theme.js" defer></script>
</head>
<body data-page="projects">
    <?php include 'navbar.html'; ?>

    <main class="page-shell">
        <section class="page-heading">
            <span class="eyebrow" data-i18n="projects.heading.eyebrow">Selected Works</span>
            <h1 data-i18n="projects.heading.title">Contoh proyek yang menunjukkan gaya kerja saya.</h1>
            <p data-i18n="projects.heading.text">Saya menyiapkan studi kasus sederhana dengan fokus pada tampilan profesional, struktur yang rapi, dan kebutuhan user yang jelas.</p>
        </section>

        <?php if ($databaseUnavailable): ?>
            <p role="status" data-i18n="projects.databaseUnavailable">Project terbaru belum dapat dimuat. Silakan coba kembali.</p>
        <?php endif; ?>
        <?php renderPortfolioSection($projects); ?>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
