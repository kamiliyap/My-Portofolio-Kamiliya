<?php $currentPage = 'services'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.services.title">Services | Kamiliya</title>
    <meta id="page-description" name="description" content="Layanan yang ditawarkan Kamiliya untuk web design, web development, dan UI refinement." data-i18n-content="meta.services.description">
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
<body data-page="services">
    <?php include 'navbar.html'; ?>

    <main class="page-shell">
        <section class="page-heading">
            <span class="eyebrow" data-i18n="services.heading.eyebrow">Services</span>
            <h1 data-i18n="services.heading.title">Layanan yang bisa saya bantu untuk website kamu.</h1>
            <p data-i18n="services.heading.text">Fokus layanan saya ada pada tampilan web, implementasi frontend, dan perapihan website agar terlihat lebih profesional.</p>
        </section>

        <section class="services-section panel">
            <div class="services-grid">
                <article class="service-item">
                    <div class="service-icon"><i class="bi bi-window-stack"></i></div>
                    <h3 data-i18n="services.items.design.title">Web Design</h3>
                    <p data-i18n="services.items.design.text">Menyusun layout halaman yang terstruktur, modern, dan nyaman dipakai di desktop maupun mobile.</p>
                </article>
                <article class="service-item">
                    <div class="service-icon"><i class="bi bi-code-slash"></i></div>
                    <h3 data-i18n="services.items.dev.title">Web Development</h3>
                    <p data-i18n="services.items.dev.text">Mengubah desain menjadi kode HTML, CSS, JavaScript, dan PHP sederhana yang rapi.</p>
                </article>
                <article class="service-item">
                    <div class="service-icon"><i class="bi bi-layout-text-window-reverse"></i></div>
                    <h3 data-i18n="services.items.ui.title">UI Refinement</h3>
                    <p data-i18n="services.items.ui.text">Merapikan tampilan existing website supaya lebih konsisten, responsif, dan layak presentasi.</p>
                </article>
            </div>
        </section>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
