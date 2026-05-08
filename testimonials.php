<?php $currentPage = 'testimonials'; ?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title id="page-title" data-i18n="meta.testimonials.title">Testimonials | Kamiliya</title>
    <meta id="page-description" name="description" content="Contoh testimonial dan impresi kerja untuk portofolio Kamiliya." data-i18n-content="meta.testimonials.description">
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
<body data-page="testimonials">
    <?php include 'navbar.html'; ?>

    <main class="page-shell">
        <section class="page-heading">
            <span class="eyebrow" data-i18n="testimonials.heading.eyebrow">Testimonials</span>
            <h1 data-i18n="testimonials.heading.title">Kesan kerja yang ingin saya bangun melalui hasil dan komunikasi.</h1>
            <p data-i18n="testimonials.heading.text">Halaman ini menampilkan contoh gaya testimonial untuk memperkuat personal branding dan kepercayaan calon klien atau recruiter.</p>
        </section>

        <section class="testimonials-section">
            <div class="testimonial-grid">
                <article class="testimonial-card">
                    <p data-i18n="testimonials.items.one.quote">"Tampilannya rapi, mudah dipahami, dan revisi yang diberikan juga cepat disesuaikan."</p>
                    <strong>Sarah L.</strong>
                    <span data-i18n="testimonials.items.one.role">Marketing Team</span>
                </article>
                <article class="testimonial-card">
                    <p data-i18n="testimonials.items.two.quote">"Komunikasi jelas, hasil layout terasa profesional, dan pengerjaan terlihat terstruktur."</p>
                    <strong>James R.</strong>
                    <span data-i18n="testimonials.items.two.role">Startup Founder</span>
                </article>
                <article class="testimonial-card">
                    <p data-i18n="testimonials.items.three.quote">"Sangat membantu untuk merapikan visual website agar lebih konsisten dan siap dipresentasikan."</p>
                    <strong>Nadia P.</strong>
                    <span data-i18n="testimonials.items.three.role">Business Owner</span>
                </article>
                <article class="testimonial-card">
                    <p data-i18n="testimonials.items.four.quote">"Cocok untuk project yang butuh tampilan modern, responsif, dan pengembangan bertahap."</p>
                    <strong>Kevin T.</strong>
                    <span data-i18n="testimonials.items.four.role">Product Team</span>
                </article>
            </div>
        </section>
    </main>

    <?php include 'footer.php'; ?>
</body>
</html>
