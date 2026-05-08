<?php $currentPage = 'about'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.about.title">About | Kamiliya</title>
    <meta id="page-description" name="description" content="Profil Kamiliya sebagai junior web programmer, skill, tools, dan fokus kerja." data-i18n-content="meta.about.description">
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
<body data-page="about">
    <?php include 'navbar.html'; ?>

    <main class="page-shell">
        <section class="page-heading">
            <span class="eyebrow" data-i18n="about.heading.eyebrow">About</span>
            <h1 data-i18n="about.heading.title">Junior Fullstack Developer dengan sertifikasi resmi dan pengalaman project nyata.</h1>
            <p data-i18n="about.heading.text">Saya tidak hanya belajar dari latihan, tetapi juga membangun sistem dan website yang sudah relevan untuk kebutuhan bisnis, organisasi, dan project pelatihan kerja.</p>
        </section>

        <section class="about-section panel">
            <div class="about-photo-wrap">
                <div class="profile-photo-frame large">
                    <img
                        class="profile-photo-image"
                        src="assets/images/Kamiliya.jpg"
                        alt="Foto profil Kamiliya"
                        data-i18n-aria-label="about.photo.label"
                    >
                </div>
            </div>
            <div class="about-copy">
                <p class="section-kicker" data-i18n="about.profile.kicker">Profile</p>
                <h2 data-i18n="about.profile.title">Pengalaman yang sudah mewakili kapasitas kerja nyata.</h2>
                <p data-i18n="about.profile.text">Saya memiliki Sertifikat BNSP Junior Programming dan pengalaman mengerjakan sistem sales order, company profile, dashboard Laravel, project PPKPI Jakarta, serta web peta tematik. Fokus saya adalah membangun sistem yang rapi, jelas, dan siap dikembangkan.</p>
                <div class="about-points">
                    <p data-i18n-html="about.profile.skill"><strong>Skill:</strong> HTML, CSS, JavaScript, PHP, MySQL, Laravel</p>
                    <p data-i18n-html="about.profile.focus"><strong>Fokus:</strong> Fullstack web development, dashboard, company profile, sistem bisnis</p>
                    <p data-i18n-html="about.profile.tools"><strong>Pengalaman:</strong> BNSP, PPKPI Jakarta, Sales Order Catering, Aerox, Web Toko Buku, Peta Tematik DKI</p>
                </div>
            </div>
        </section>

        <section class="content-grid">
            <article class="panel">
                <p class="section-kicker" data-i18n="about.strength.kicker">Strength</p>
                <h2 data-i18n="about.strength.title">Memiliki pondasi teknis sekaligus bukti pengalaman.</h2>
                <p data-i18n="about.strength.text">Kekuatan saya bukan hanya pada tampilan, tetapi pada kemampuan menyusun sistem web yang utuh dari frontend sampai backend, dengan pendekatan yang rapi dan mudah dipelihara.</p>
            </article>
            <article class="panel">
                <p class="section-kicker" data-i18n="about.goal.kicker">Goal</p>
                <h2 data-i18n="about.goal.title">Menampilkan kualitas kerja sejelas kemampuan yang saya miliki.</h2>
                <p data-i18n="about.goal.text">Target saya adalah berkontribusi sebagai Junior Fullstack Developer yang siap kerja, bukan hanya karena potensi, tetapi karena sudah punya sertifikasi dan pengalaman project yang bisa dipertanggungjawabkan.</p>
            </article>
        </section>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
