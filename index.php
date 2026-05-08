<?php $currentPage = 'home'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.home.title">Kamiliya — Full Stack Developer Portfolio</title>
    <meta id="page-description" name="description" content="Portofolio junior web programmer profesional dengan fokus pada website responsif, performa, dan pengalaman pengguna." data-i18n-content="meta.home.description">
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
<body data-page="home">
    <?php include 'navbar.html'; ?>

    <main class="page-shell">
        <section class="portfolio-home-layout">
            <div class="portfolio-home-main">
                <section class="hero-banner hero-dark portfolio-hero">
                    <span class="hero-tech-lines"></span>
                    <span class="hero-tech-lines-right"></span>
                    <div class="hero-dark-content">
                        <span class="eyebrow" data-i18n="home.heroBanner.eyebrow">KAMILIYA PRASMAISYA</span>
                        <h1 class="hero-title-single" data-i18n-html="home.heroBanner.title"><span class="hero-intro">Hay! I'm</span> Kamiliya I'm a Developer</h1>
                        <div class="hero-dark-summary">
                            <p class="hero-dark-text" data-i18n="home.heroBanner.text">
                                Junior Fullstack Web Developer yang fokus membangun website responsif, performa cepat,
                                dan backend PHP + MySQL yang siap dipakai untuk kebutuhan bisnis.
                            </p>
                        </div>
                        <div class="hero-banner-actions">
                            <a class="button-primary" href="contact.php"><i class="bi bi-send"></i> <span data-i18n="home.heroBanner.cta">GET IN TOUCH</span></a>
                            <a class="button-secondary hero-secondary-link" href="about.php">Open About</a>
                        </div>
                        <div class="hero-socials">
                            <span>Find me on</span>
                            <div class="hero-social-links">
                                <a href="https://github.com/kamiliyap" target="_blank" rel="noreferrer" aria-label="GitHub Kamiliya"><i class="bi bi-github"></i></a>
                                <a href="https://www.linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228/" target="_blank" rel="noreferrer" aria-label="LinkedIn Kamiliya"><i class="bi bi-linkedin"></i></a>
                                <a href="mailto:kamiliyaprasmaisya@gmail.com" aria-label="Email Kamiliya"><i class="bi bi-envelope-fill"></i></a>
                            </div>
                        </div>
                        <div class="hero-dots hero-dots-right"></div>
                        <div class="hero-blob hero-blob-right"></div>
                        <span class="hero-spark hero-spark-right"></span>
                    </div>
                    <div class="hero-dark-image-wrap">
                        <div class="hero-dots hero-dots-left"></div>
                        <div class="hero-blob hero-blob-left"></div>
                        <div class="hero-photo-orbit"></div>
                        <img src="assets/images/Foto.png" alt="Foto Kamiliya" class="hero-dark-image">
                        <span class="hero-spark hero-spark-left"></span>
                    </div>
                </section>

                <section class="project-showcase project-showcase-home">
                    <div class="section-heading split-heading">
                        <div>
                            <p class="section-kicker" data-i18n="home.explore.kicker">Pengalaman Kerja</p>
                            <h2 data-i18n="home.explore.title">Ringkasan pengalaman dan project yang sudah saya kerjakan.</h2>
                        </div>
                        <a class="button-secondary compact-button" href="project.php">Lihat Project</a>
                    </div>
                    <div class="project-grid">
                        <article class="project-card">
                            <div class="project-thumb project-thumb-image">
                                <img src="assets/images/Gambar_Dasboard.png" alt="Preview Dashboard Sales Order Internal">
                            </div>
                            <div class="project-badge" data-i18n="home.cards.about.badge">Internal Project</div>
                            <h2 data-i18n="home.cards.about.title">Dashboard Sales Order Internal</h2>
                            <p data-i18n="home.cards.about.text">Membangun dashboard analisis sales order internal berbasis PHP Native dan MySQL untuk monitoring penjualan, analisis kota, arsip dokumen, serta export Excel dan PDF.</p>
                            <a class="button-primary small-button" href="project.php" data-i18n="home.cards.about.cta">Lihat Detail</a>
                        </article>
                        <article class="project-card">
                            <div class="project-thumb project-thumb-image project-thumb-image-aerox">
                                <img src="assets/images/project-aerox.jpg" alt="Preview Website CV Aerox Club Motor">
                            </div>
                            <div class="project-badge" data-i18n="home.cards.services.badge">Community Project</div>
                            <h2 data-i18n="home.cards.services.title">Website CV Aerox Club Motor</h2>
                            <p data-i18n="home.cards.services.text">Mengerjakan website company profile komunitas motor Aerox dengan tampilan modern, responsif, dan fokus pada identitas komunitas serta publikasi kegiatan.</p>
                            <a class="button-primary small-button" href="project.php" data-i18n="home.cards.services.cta">Lihat Detail</a>
                        </article>
                        <article class="project-card">
                            <div class="project-thumb project-thumb-image">
                                <img src="assets/images/project-tokobuku.png" alt="Preview Website Toko Buku Pintar">
                            </div>
                            <div class="project-badge" data-i18n="home.cards.testimonials.badge">Web App</div>
                            <h2 data-i18n="home.cards.testimonials.title">Website Toko Buku Pintar</h2>
                            <p data-i18n="home.cards.testimonials.text">Mengembangkan website toko buku berbasis Laravel untuk katalog buku, pengelolaan data produk, dan kebutuhan sistem CRUD yang rapi dan mudah dikembangkan.</p>
                            <a class="button-primary small-button" href="project.php" data-i18n="home.cards.testimonials.cta">Lihat Detail</a>
                        </article>
                    </div>
                </section>
            </div>
        </section>

        <section class="home-bottom-grid">
            <section class="stack-section panel side-stack-section">
                <p class="section-kicker" data-i18n="home.stack.kicker">Tech Stack</p>
                <h2 data-i18n="home.stack.title">Teknologi yang saya gunakan untuk membangun web modern.</h2>
                    <div class="stack-chips">
                        <span aria-label="HTML5" title="HTML5"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" alt="HTML5"></span>
                        <span aria-label="CSS3" title="CSS3"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" alt="CSS3"></span>
                        <span aria-label="JavaScript" title="JavaScript"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript"></span>
                        <span aria-label="PHP" title="PHP"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg" alt="PHP"></span>
                        <span aria-label="Laravel" title="Laravel"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg" alt="Laravel"></span>
                        <span aria-label="Bootstrap" title="Bootstrap"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg" alt="Bootstrap"></span>
                        <span aria-label="MySQL" title="MySQL"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" alt="MySQL"></span>
                        <span aria-label="Git" title="Git"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git"></span>
                        <span aria-label="Figma" title="Figma to Code"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg" alt="Figma"></span>
                </div>
            </section>

            <section class="highlight-card certification-card accent">
                <p class="section-kicker" data-i18n="home.highlights.roleKicker">Nilai Utama</p>
                <h2 data-i18n="home.highlights.roleTitle">Sertifikasi resmi, pengalaman nyata, dan pondasi fullstack.</h2>
                <p data-i18n="home.highlights.roleText">Saya membawa kombinasi sertifikasi BNSP, pengalaman project riil, dan kemampuan membangun sistem berbasis PHP, MySQL, serta UI yang responsif.</p>
                <div class="certification-meta">
                    <div><span>Status</span><strong>BNSP Junior Programming</strong></div>
                    <div><span>Fokus</span><strong>PHP, MySQL, UI Responsif</strong></div>
                </div>
            </section>
        </section>

        <section class="contact-home panel contact-home-banner">
            <div class="section-heading">
                <p class="section-kicker" data-i18n="home.contact.kicker">Contact</p>
                <h2 data-i18n="home.contact.title">Mari diskusikan kebutuhan website kamu dari halaman kontak terpisah.</h2>
            </div>
            <div class="contact-home-grid">
                <div>
                    <p data-i18n="home.contact.text">Terbuka untuk project freelance, kerja sama magang, atau posisi junior web programmer.</p>
                    <div class="about-points">
                        <p data-i18n-html="home.contact.email"><strong>Email:</strong> kamiliyaprasmaisya@gmail.com</p>
                        <p data-i18n-html="home.contact.linkedin"><strong>LinkedIn:</strong> linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228</p>
                        <p data-i18n-html="home.contact.github"><strong>GitHub:</strong> github.com/kamiliyap</p>
                    </div>
                </div>
                <div class="contact-actions">
                    <a class="button-primary full-width" href="mailto:kamiliyaprasmaisya@gmail.com" data-i18n="home.contact.emailCta">Email Me</a>
                    <a class="button-secondary full-width" href="contact.php" data-i18n="home.contact.pageCta">Open Contact Page</a>
                </div>
            </div>
        </section>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
