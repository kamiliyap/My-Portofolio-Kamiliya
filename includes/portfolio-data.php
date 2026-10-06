<?php
$portfolioName = 'Kamiliya';
$portfolioFullName = 'KAMILIYA LATIFAH PRASMAISYA';
$portfolioRole = 'junior web programmer';
$portfolioEmail = 'kamiliyaprasmaisya@gmail.com';
$portfolioGitHub = 'https://github.com/kamiliyap';
$portfolioLinkedIn = 'https://www.linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228/';
$portfolioGitHubLabel = 'github.com/kamiliyap';
$portfolioLinkedInLabel = 'linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228';
$cvFile = 'download-cv.php';

$skills = [
    ['name' => 'HTML5', 'title' => 'HTML5', 'icon' => 'html5'],
    ['name' => 'CSS3', 'title' => 'CSS3', 'icon' => 'css3'],
    ['name' => 'JavaScript', 'title' => 'JavaScript', 'icon' => 'javascript'],
    ['name' => 'PHP', 'title' => 'PHP', 'icon' => 'php'],
    ['name' => 'Laravel', 'title' => 'Laravel', 'icon' => 'laravel'],
    ['name' => 'Bootstrap', 'title' => 'Bootstrap', 'icon' => 'bootstrap'],
    ['name' => 'MySQL', 'title' => 'MySQL', 'icon' => 'mysql'],
    ['name' => 'Git', 'title' => 'Git', 'icon' => 'git'],
    ['name' => 'Figma', 'title' => 'Figma to Code', 'icon' => 'figma'],
];

$homeProjects = [
    [
        'image' => 'assets/images/Gambar_Dasboard.png',
        'imageAlt' => 'Preview Dashboard Sales Order Internal',
        'thumbClass' => 'project-thumb project-thumb-image',
        'badgeKey' => 'home.cards.about.badge',
        'badge' => 'Internal Project',
        'titleKey' => 'home.cards.about.title',
        'title' => 'Dashboard Sales Order Internal',
        'descriptionKey' => 'home.cards.about.text',
        'description' => 'Membangun dashboard analisis sales order internal berbasis PHP Native dan MySQL untuk monitoring penjualan, analisis kota, arsip dokumen, serta export Excel dan PDF.',
        'linkKey' => 'home.cards.about.cta',
    ],
    [
        'image' => 'assets/images/project-aerox.jpg',
        'imageAlt' => 'Preview Website CV Aerox Club Motor',
        'thumbClass' => 'project-thumb project-thumb-image project-thumb-image-aerox',
        'badgeKey' => 'home.cards.services.badge',
        'badge' => 'Community Project',
        'titleKey' => 'home.cards.services.title',
        'title' => 'Website CV Aerox Club Motor',
        'descriptionKey' => 'home.cards.services.text',
        'description' => 'Mengerjakan website company profile komunitas motor Aerox dengan tampilan modern, responsif, dan fokus pada identitas komunitas serta publikasi kegiatan.',
        'linkKey' => 'home.cards.services.cta',
    ],
    [
        'image' => 'assets/images/project-tokobuku.png',
        'imageAlt' => 'Preview Website Toko Buku Pintar',
        'thumbClass' => 'project-thumb project-thumb-image',
        'badgeKey' => 'home.cards.testimonials.badge',
        'badge' => 'Web App',
        'titleKey' => 'home.cards.testimonials.title',
        'title' => 'Website Toko Buku Pintar',
        'descriptionKey' => 'home.cards.testimonials.text',
        'description' => 'Mengembangkan website toko buku berbasis Laravel untuk katalog buku, pengelolaan data produk, dan kebutuhan sistem CRUD yang rapi dan mudah dikembangkan.',
        'linkKey' => 'home.cards.testimonials.cta',
    ],
];

$projects = [
    [
        'title' => 'Website CV Aerox Club Motor',
        'description' => 'Website company profile komunitas motor Aerox dengan tampilan modern untuk menampilkan profil komunitas, aktivitas, dan informasi penting secara lebih profesional.',
        'tech' => ['HTML', 'CSS', 'JavaScript'],
        'link' => 'https://website-motor.vercel.app/',
        'image' => 'assets/images/project-aerox.jpg',
        'imageAlt' => 'Preview website CV Aerox Club Motor',
        'badge' => 'Company Profile',
        'badgeKey' => 'projects.items.company.badge',
        'titleKey' => 'projects.items.company.title',
        'descriptionKey' => 'projects.items.company.text',
        'points' => [
            ['key' => 'projects.items.company.pointOne', 'text' => 'Menampilkan identitas dan profil komunitas dengan layout yang jelas'],
            ['key' => 'projects.items.company.pointTwo', 'text' => 'Responsif di desktop dan mobile untuk kebutuhan publikasi komunitas'],
            ['key' => 'projects.items.company.pointThree', 'text' => 'Visual branding yang lebih kuat untuk klub motor Aerox'],
        ],
        'external' => true,
    ],
    [
        'title' => 'Dashboard Data Internal',
        'description' => 'Tampilan dashboard untuk memonitor data, status pekerjaan, dan ringkasan performa dalam satu halaman.',
        'tech' => ['PHP', 'Bootstrap', 'MySQL'],
        'link' => '',
        'image' => 'assets/images/Gambar_Dasboard.png',
        'imageAlt' => 'Preview dashboard data internal',
        'badge' => 'Admin Dashboard',
        'badgeKey' => 'projects.items.dashboard.badge',
        'titleKey' => 'projects.items.dashboard.title',
        'descriptionKey' => 'projects.items.dashboard.text',
        'points' => [
            ['key' => 'projects.items.dashboard.pointOne', 'text' => 'Navigasi sidebar yang sederhana'],
            ['key' => 'projects.items.dashboard.pointTwo', 'text' => 'Komponen kartu statistik reusable'],
            ['key' => 'projects.items.dashboard.pointThree', 'text' => 'Fokus pada keterbacaan data'],
        ],
        'external' => false,
    ],
    [
        'title' => 'Website Toko Buku',
        'description' => 'Website toko buku berbasis Laravel untuk menampilkan katalog, mengelola data buku, dan membantu proses pengelolaan informasi produk secara lebih rapi.',
        'tech' => ['Laravel', 'PHP', 'MySQL'],
        'link' => 'https://darkcyan-barracuda-362155.hostingersite.com/',
        'image' => 'assets/images/project-tokobuku.png',
        'imageAlt' => 'Preview website Toko Buku Pintar',
        'badge' => 'Web App',
        'badgeKey' => 'projects.items.bookstore.badge',
        'titleKey' => 'projects.items.bookstore.title',
        'descriptionKey' => 'projects.items.bookstore.text',
        'points' => [
            ['key' => 'projects.items.bookstore.pointOne', 'text' => 'Manajemen data buku dan katalog dalam satu sistem'],
            ['key' => 'projects.items.bookstore.pointTwo', 'text' => 'Struktur backend Laravel yang rapi dan mudah dikembangkan'],
            ['key' => 'projects.items.bookstore.pointThree', 'text' => 'Cocok untuk latihan sistem CRUD dan pengelolaan produk'],
        ],
        'external' => true,
    ],
];