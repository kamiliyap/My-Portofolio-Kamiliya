<?php $currentPage = 'projects'; ?>
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

        <section class="project-grid">
            <article class="project-card">
                <div class="project-thumb project-thumb-image">
                    <img src="assets/images/project-aerox.jpg" alt="Preview website CV Aerox Club Motor">
                </div>
                <div class="project-card-copy">
                    <div class="project-badge" data-i18n="projects.items.company.badge">Company Profile</div>
                    <h2 data-i18n="projects.items.company.title">Website CV Aerox Club Motor</h2>
                    <p data-i18n="projects.items.company.text">Website company profile komunitas motor Aerox dengan tampilan modern untuk menampilkan profil komunitas, aktivitas, dan informasi penting secara lebih profesional.</p>
                    <div class="project-tags">
                        <span>HTML</span>
                        <span>CSS</span>
                        <span>JavaScript</span>
                    </div>
                    <ul class="project-points">
                        <li data-i18n="projects.items.company.pointOne">Menampilkan identitas dan profil komunitas dengan layout yang jelas</li>
                        <li data-i18n="projects.items.company.pointTwo">Responsif di desktop dan mobile untuk kebutuhan publikasi komunitas</li>
                        <li data-i18n="projects.items.company.pointThree">Visual branding yang lebih kuat untuk klub motor Aerox</li>
                    </ul>
                    <a class="button-primary small-button" href="https://website-motor.vercel.app/" target="_blank" rel="noreferrer">Visit Website</a>
                </div>
            </article>

            <article class="project-card">
                <div class="project-thumb project-thumb-image">
                    <img src="assets/images/Gambar_Dasboard.png" alt="Preview dashboard data internal">
                </div>
                <div class="project-card-copy">
                    <div class="project-badge" data-i18n="projects.items.dashboard.badge">Admin Dashboard</div>
                    <h2 data-i18n="projects.items.dashboard.title">Dashboard Data Internal</h2>
                    <p data-i18n="projects.items.dashboard.text">Tampilan dashboard untuk memonitor data, status pekerjaan, dan ringkasan performa dalam satu halaman.</p>
                    <div class="project-tags">
                        <span>PHP</span>
                        <span>Bootstrap</span>
                        <span>MySQL</span>
                    </div>
                    <ul class="project-points">
                        <li data-i18n="projects.items.dashboard.pointOne">Navigasi sidebar yang sederhana</li>
                        <li data-i18n="projects.items.dashboard.pointTwo">Komponen kartu statistik reusable</li>
                        <li data-i18n="projects.items.dashboard.pointThree">Fokus pada keterbacaan data</li>
                    </ul>
                </div>
            </article>

            <article class="project-card">
                <div class="project-thumb project-thumb-image">
                    <img src="assets/images/project-tokobuku.png" alt="Preview website Toko Buku Pintar">
                </div>
                <div class="project-card-copy">
                    <div class="project-badge" data-i18n="projects.items.bookstore.badge">Web App</div>
                    <h2 data-i18n="projects.items.bookstore.title">Website Toko Buku</h2>
                    <p data-i18n="projects.items.bookstore.text">Website toko buku berbasis Laravel untuk menampilkan katalog, mengelola data buku, dan membantu proses pengelolaan informasi produk secara lebih rapi.</p>
                    <div class="project-tags">
                        <span>Laravel</span>
                        <span>PHP</span>
                        <span>MySQL</span>
                    </div>
                    <ul class="project-points">
                        <li data-i18n="projects.items.bookstore.pointOne">Manajemen data buku dan katalog dalam satu sistem</li>
                        <li data-i18n="projects.items.bookstore.pointTwo">Struktur backend Laravel yang rapi dan mudah dikembangkan</li>
                        <li data-i18n="projects.items.bookstore.pointThree">Cocok untuk latihan sistem CRUD dan pengelolaan produk</li>
                    </ul>
                    <a class="button-primary small-button" href="https://darkcyan-barracuda-362155.hostingersite.com/" target="_blank" rel="noreferrer">Visit Website</a>
                </div>
            </article>
        </section>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
