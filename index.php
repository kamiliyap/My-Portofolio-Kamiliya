<?php
$currentPage = 'home';
require __DIR__ . '/includes/certifications-data.php';
require __DIR__ . '/includes/portfolio-data.php';
require __DIR__ . '/includes/portfolio-functions.php';
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.home.title">Kamiliya — Full Stack Developer Portfolio</title>
    <meta id="page-description" name="description" content="Portofolio <?php echo escapeHtml($portfolioRole); ?> profesional dengan fokus pada website responsif, performa, dan pengalaman pengguna." data-i18n-content="meta.home.description">
    <link rel="icon" type="image/png" href="assets/images/logo.png">
    <link rel="apple-touch-icon" href="assets/images/logo.png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link rel="stylesheet" href="assets/css/style-navbar.css">
    <link rel="stylesheet" href="assets/css/style-site.css">
    <script src="assets/js/theme.js" defer></script>
    <!-- Anime.js v4 khusus animasi hero; greeting kini berada di robot assistant. -->
    <script src="https://cdn.jsdelivr.net/npm/animejs/lib/anime.iife.min.js" defer></script>
    <script src="assets/js/hero-animation.js" defer></script>
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
                        <span class="eyebrow" data-i18n="home.heroBanner.eyebrow"><?php echo escapeHtml($portfolioFullName); ?></span>
                        <h1 class="hero-title-single" data-i18n-html="home.heroBanner.title"><span class="hero-intro">Hay! I'm</span> <?php echo escapeHtml($portfolioName); ?> I'm a Developer</h1>
                        <div class="hero-dark-summary">
                            <p class="hero-dark-text" data-i18n="home.heroBanner.text">
                                Junior Fullstack Web Developer yang fokus membangun website responsif, performa cepat,
                                dan backend PHP + MySQL yang siap dipakai untuk kebutuhan bisnis.
                            </p>
                        </div>
                        <div class="hero-banner-actions">
                            <a class="button-primary" href="contact.php"><i class="bi bi-send"></i> <span data-i18n="home.heroBanner.cta">GET IN TOUCH</span></a>
                            <a class="button-secondary hero-download-link" href="<?php echo escapeHtml($cvFile); ?>" download><i class="bi bi-download"></i> Download CV</a>
                            <a class="button-secondary hero-secondary-link" href="about.php">Open About</a>
                        </div>
                        <p class="hero-download-note">HRD dapat langsung mengunduh CV terbaru dalam format PDF dari halaman ini.</p>
                        <div class="hero-socials">
                            <span>Find me on</span>
                            <div class="hero-social-links">
                                <a href="<?php echo escapeHtml($portfolioGitHub); ?>" target="_blank" rel="noreferrer" aria-label="GitHub <?php echo escapeHtml($portfolioName); ?>"><i class="bi bi-github"></i></a>
                                <a href="<?php echo escapeHtml($portfolioLinkedIn); ?>" target="_blank" rel="noreferrer" aria-label="LinkedIn <?php echo escapeHtml($portfolioName); ?>"><i class="bi bi-linkedin"></i></a>
                                <a href="mailto:<?php echo escapeHtml($portfolioEmail); ?>" aria-label="Email <?php echo escapeHtml($portfolioName); ?>"><i class="bi bi-envelope-fill"></i></a>
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
                        <img src="assets/images/Foto.png" alt="Foto <?php echo escapeHtml($portfolioName); ?>" class="hero-dark-image">
                        <!-- Badge dekoratif mengelilingi foto; foto tetap statis. -->
                        <div class="hero-photo-badges">
                            <span class="hero-tech-badge hero-tech-code" aria-hidden="true"><i class="bi bi-code-slash"></i></span>
                            <span class="hero-tech-badge hero-tech-database" aria-hidden="true"><i class="bi bi-database"></i></span>
                            <span class="hero-tech-badge hero-tech-device" aria-hidden="true"><i class="bi bi-laptop"></i></span>
                            <div class="hero-availability">
                                <span class="hero-availability-dot" aria-hidden="true"></span>
                                <span class="hero-availability-copy">Terbuka untuk <strong>Peluang Baru</strong></span>
                            </div>
                        </div>
                        <span class="hero-spark hero-spark-left"></span>
                    </div>
                </section>

                <!-- Stats di bawah hero tanpa mengubah posisi konten dan foto hero. -->
                <dl class="hero-stats">
                    <div class="stat-item">
                        <span class="stat-icon stat-icon-projects" aria-hidden="true"><i class="bi bi-laptop"></i></span>
                        <dt data-stat-label="projects">Proyek Selesai</dt><dd>5+</dd>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon stat-icon-experience" aria-hidden="true"><i class="bi bi-mortarboard"></i></span>
                        <dt data-stat-label="experience">Tahun Pengalaman</dt><dd>1+</dd>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon stat-icon-certifications" aria-hidden="true"><i class="bi bi-award"></i></span>
                        <dt data-stat-label="certifications">Sertifikasi</dt><dd>5+</dd>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon stat-icon-learning" aria-hidden="true"><i class="bi bi-people"></i></span>
                        <dt data-stat-label="learning">Belajar & Berkembang</dt><dd>100%</dd>
                    </div>
                </dl>

                <section class="project-showcase project-showcase-home">
                    <div class="section-heading split-heading">
                        <div>
                            <p class="section-kicker" data-i18n="home.explore.kicker">Pengalaman Kerja</p>
                            <h2 data-i18n="home.explore.title">Ringkasan pengalaman dan project yang sudah saya kerjakan.</h2>
                        </div>
                        <a class="button-secondary compact-button" href="project.php">Lihat Project</a>
                    </div>
                    <div class="project-grid">
                        <?php foreach ($homeProjects as $project): ?>
                            <article class="project-card">
                                <div class="<?php echo escapeHtml($project['thumbClass']); ?>">
                                    <img src="<?php echo escapeHtml($project['image']); ?>" alt="<?php echo escapeHtml($project['imageAlt']); ?>">
                                </div>
                                <div class="project-badge" data-i18n="<?php echo escapeHtml($project['badgeKey']); ?>"><?php echo escapeHtml($project['badge']); ?></div>
                                <h2 data-i18n="<?php echo escapeHtml($project['titleKey']); ?>"><?php echo escapeHtml($project['title']); ?></h2>
                                <p data-i18n="<?php echo escapeHtml($project['descriptionKey']); ?>"><?php echo escapeHtml($project['description']); ?></p>
                                <a class="button-primary small-button" href="project.php" data-i18n="<?php echo escapeHtml($project['linkKey']); ?>">Lihat Detail</a>
                            </article>
                        <?php endforeach; ?>
                    </div>
                </section>
            </div>
        </section>

        <section class="home-bottom-grid">
            <section class="stack-section panel side-stack-section">
                <p class="section-kicker" data-i18n="home.stack.kicker">Tech Stack</p>
                <h2 data-i18n="home.stack.title">Teknologi yang saya gunakan untuk membangun web modern.</h2>
                    <div class="stack-chips">
                        <?php foreach ($skills as $skill): ?>
                            <span aria-label="<?php echo escapeHtml($skill['name']); ?>" title="<?php echo escapeHtml($skill['title']); ?>"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/<?php echo escapeHtml($skill['icon']); ?>/<?php echo escapeHtml($skill['icon']); ?>-original.svg" alt="<?php echo escapeHtml($skill['name']); ?>"></span>
                        <?php endforeach; ?>
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

        <section id="certifications" class="certifications-home panel reveal-on-scroll">
            <div class="section-heading split-heading certifications-heading">
                <div>
                    <p class="section-kicker" data-i18n="home.certifications.kicker">Certifications</p>
                    <h2 data-i18n="home.certifications.title">Sertifikasi yang memperkuat pengalaman teknis dan kesiapan kerja saya.</h2>
                </div>
                <div>
                    <p class="certifications-intro" data-i18n="home.certifications.text">Sertifikasi dan pelatihan dalam pengembangan web, administrasi sistem, data, dan keamanan siber.</p>
                    <a class="button-secondary small-button" href="certifications.php" data-i18n="certifications.viewAll">Lihat Semua Sertifikat</a>
                </div>
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
                    <article class="certification-entry reveal-on-scroll">
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
                            <a class="button-primary small-button certification-button<?php echo $certificateAvailable ? '' : ' is-disabled'; ?>" href="<?php echo htmlspecialchars($certificateUrl, ENT_QUOTES, 'UTF-8'); ?>" <?php echo $certificateAvailable ? 'target="_blank" rel="noreferrer"' : 'aria-disabled="true" tabindex="-1"'; ?> data-i18n="home.certifications.viewCta">View Certificate</a>
                        </div>
                    </article>
                <?php endforeach; ?>
            </div>
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
                        <p data-i18n-html="home.contact.email"><strong>Email:</strong> <?php echo escapeHtml($portfolioEmail); ?></p>
                        <p data-i18n-html="home.contact.linkedin"><strong>LinkedIn:</strong> <?php echo escapeHtml($portfolioLinkedInLabel); ?></p>
                        <p data-i18n-html="home.contact.github"><strong>GitHub:</strong> <?php echo escapeHtml($portfolioGitHubLabel); ?></p>
                    </div>
                </div>
                <div class="contact-actions">
                    <a class="button-primary full-width" href="mailto:<?php echo escapeHtml($portfolioEmail); ?>" data-i18n="home.contact.emailCta">Email Me</a>
                    <a class="button-secondary full-width" href="contact.php" data-i18n="home.contact.pageCta">Open Contact Page</a>
                </div>
            </div>
        </section>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
