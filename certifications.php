<?php
$currentPage = 'certifications';
require __DIR__ . '/includes/certifications-data.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.certifications.title">Sertifikat | Kamiliya</title>
    <meta id="page-description" name="description" content="Sertifikasi Kamiliya dalam web development, administrasi sistem, dan keamanan siber." data-i18n-content="meta.certifications.description">
    <link rel="icon" type="image/png" href="assets/images/logo.png">
    <link rel="apple-touch-icon" href="assets/images/logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="assets/css/style-navbar.css">
    <link rel="stylesheet" href="assets/css/style-site.css">
    <script src="assets/js/theme.js" defer></script>
</head>
<body data-page="certifications">
    <?php include 'navbar.html'; ?>
    <main class="page-shell">
        <section class="page-heading">
            <span class="eyebrow" data-i18n="certifications.eyebrow">Sertifikat</span>
            <h1 data-i18n="certifications.title">Belajar, berkembang, dan membuktikan kompetensi.</h1>
            <p data-i18n="certifications.description">Sertifikasi dan pelatihan saya dalam pengembangan web, administrasi sistem, data, dan keamanan siber.</p>
        </section>
        <section class="certifications-home panel" aria-labelledby="certificates-title">
            <div class="section-heading">
                <p class="section-kicker" data-i18n="certifications.collection">Koleksi Sertifikat</p>
                <h2 id="certificates-title" data-i18n="certifications.listTitle">Sertifikasi dan pelatihan</h2>
            </div>
            <div class="certifications-grid">
                <?php foreach ($certifications as $certificate): ?>
                    <?php
                    $certificateUrl = $certificate['links']['view']
                        ?? $certificate['links']['drive']
                        ?? $certificate['links']['credly']
                        ?? $certificate['links']['download']
                        ?? '#';
                    $certificateAvailable = $certificateUrl !== '#';
                    ?>
                    <article class="certification-entry">
                        <div class="certification-badge" aria-hidden="true">
                            <i class="bi <?php echo htmlspecialchars($certificate['icon'], ENT_QUOTES, 'UTF-8'); ?>"></i>
                        </div>
                        <div class="certification-copy">
                            <h3><?php echo htmlspecialchars($certificate['title'], ENT_QUOTES, 'UTF-8'); ?></h3>
                            <div class="certification-meta-list">
                                <p><span data-i18n="home.certifications.issuerLabel">Issuer</span><strong><?php echo htmlspecialchars($certificate['issuer'], ENT_QUOTES, 'UTF-8'); ?></strong></p>
                                <p><span data-i18n="home.certifications.yearLabel">Year</span><strong><?php echo htmlspecialchars($certificate['year'], ENT_QUOTES, 'UTF-8'); ?></strong></p>
                            </div>
                        </div>
                        <div class="certification-actions">
                            <?php if ($certificateAvailable): ?>
                                <a class="button-primary small-button certification-button" href="<?= htmlspecialchars($certificateUrl, ENT_QUOTES, 'UTF-8') ?>" target="_blank" rel="noreferrer" data-i18n="home.certifications.viewCta">View Certificate</a>
                            <?php else: ?>
                                <span class="button-primary small-button certification-button is-disabled" data-i18n="certifications.unavailable">Dokumen belum tersedia</span>
                            <?php endif; ?>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
        </section>
    </main>
    <?php include 'footer.php'; ?>
</body>
</html>