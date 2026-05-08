<?php $currentPage = 'contact'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.contact.title">Kontak | Kamiliya</title>
    <meta id="page-description" name="description" content="Hubungi Kamiliya untuk kolaborasi web development dan freelance project." data-i18n-content="meta.contact.description">
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
<body data-page="contact">
    <?php include 'navbar.html'; ?>

    <main class="page-shell">
        <section class="page-heading">
            <span class="eyebrow" data-i18n="contact.heading.eyebrow">Kontak</span>
            <h1 data-i18n="contact.heading.title">Siap untuk diskusi kerja, freelance, atau kolaborasi.</h1>
            <p data-i18n="contact.heading.text">Jika Anda membutuhkan web programmer junior yang detail pada tampilan dan siap berkembang di tim, saya terbuka untuk percakapan lebih lanjut.</p>
        </section>

        <section class="contact-layout">
            <article class="panel">
                <p class="section-kicker" data-i18n="contact.info.kicker">Informasi Kontak</p>
                <div class="contact-list">
                    <a href="mailto:kamiliyaprasmaisya@gmail.com" data-i18n-aria-label="contact.info.emailLabel">
                        <i class="bi bi-envelope"></i>
                        <span>kamiliyaprasmaisya@gmail.com</span>
                    </a>
                    <a href="https://github.com/kamiliyap" target="_blank" rel="noreferrer" data-i18n-aria-label="contact.info.githubLabel">
                        <i class="bi bi-github"></i>
                        <span>github.com/kamiliyap</span>
                    </a>
                    <a href="https://www.linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228/" target="_blank" rel="noreferrer" data-i18n-aria-label="contact.info.linkedinLabel">
                        <i class="bi bi-linkedin"></i>
                        <span>linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228</span>
                    </a>
                    <a href="https://www.instagram.com/kamiliya_latifah" target="_blank" rel="noreferrer" data-i18n-aria-label="contact.info.instagramLabel">
                        <i class="bi bi-instagram"></i>
                        <span>@kamiliya_latifah</span>
                    </a>
                </div>
            </article>

            <article class="panel availability-card">
                <p class="section-kicker" data-i18n="contact.availability.kicker">Ketersediaan</p>
                <h2 data-i18n="contact.availability.title">Terbuka untuk:</h2>
                <ul class="check-list">
                    <li data-i18n="contact.availability.pointOne">Posisi junior frontend atau web developer</li>
                    <li data-i18n="contact.availability.pointTwo">Freelance landing page dan website profil</li>
                    <li data-i18n="contact.availability.pointThree">Kolaborasi desain ke implementasi HTML/CSS</li>
                </ul>
                <a class="button-primary full-width" href="mailto:kamiliyaprasmaisya@gmail.com?subject=Diskusi%20Project" data-i18n="contact.availability.cta" data-i18n-href="contact.availability.href">Mulai Diskusi</a>
            </article>
        </section>

        <section class="content-grid">
            <article class="panel">
                <p class="section-kicker" data-i18n="contact.response.kicker">Respons</p>
                <h2 data-i18n="contact.response.title">Komunikasi yang jelas dan profesional.</h2>
                <p data-i18n="contact.response.text">Saya berusaha menjaga komunikasi tetap singkat, jelas, dan fokus pada hasil agar kebutuhan proyek bisa diterjemahkan dengan tepat.</p>
            </article>
            <article class="panel">
                <p class="section-kicker" data-i18n="contact.work.kicker">Kerja Sama</p>
                <h2 data-i18n="contact.work.title">Terbuka untuk project kecil hingga pengembangan awal.</h2>
                <p data-i18n="contact.work.text">Cocok untuk landing page, company profile, portofolio personal, atau perapihan UI website yang sudah ada.</p>
            </article>
        </section>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
