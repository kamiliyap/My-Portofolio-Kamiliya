const btn = document.getElementById('theme-button');
const navbar = document.querySelector('.navbar-custom');
const navbarBurger = document.getElementById('navbar-burger');
const navbarMenuLinks = document.querySelectorAll('.navbar-menu .nav-link');
const languageButtons = document.querySelectorAll('[data-lang]');

const translations = {
  id: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',
    'nav.toggle': 'Buka menu navigasi',
    'theme.toggle': 'Ganti tema',
    'footer.copy': 'Junior Web Programmer yang fokus pada antarmuka cepat, rapi, dan mudah dikembangkan.',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.instagram': 'Instagram',
    'chat.toggle': 'Q&A',
    'chat.kicker': 'Chatbox',
    'chat.title': 'Tanya seputar portofolio',
    'chat.close': 'Tutup chatbox',
    'chat.quick.services': 'Layanan',
    'chat.quick.projects': 'Proyek',
    'chat.quick.skills': 'Skill',
    'chat.quick.contact': 'Kontak',
    'chat.placeholder': 'Tulis pertanyaan...',
    'chat.send': 'Kirim',
    'chat.greeting': 'Halo, saya bisa bantu jawab pertanyaan tentang layanan, proyek, skill, atau kontak Kamiliya.',
    'chat.loading': 'Bot sedang mengetik...',
    'chat.apiUnavailable': 'Backend Python belum aktif, jadi chat memakai jawaban lokal sementara.',
    'chat.answers.services': 'Kamiliya fokus pada web design, web development, dan UI refinement untuk website yang rapi dan responsif.',
    'chat.answers.projects': 'Contoh proyek mencakup company profile, dashboard internal, dan website personal branding.',
    'chat.answers.skills': 'Skill utama yang ditampilkan adalah HTML, CSS, JavaScript, PHP, Bootstrap, Git, dan implementasi UI responsif.',
    'chat.answers.contact': 'Kamu bisa hubungi lewat email kamiliyaprasmaisya@gmail.com atau halaman contact untuk diskusi lebih lanjut.',
    'chat.answers.default': 'Pertanyaan itu belum ada di daftar Q&A sederhana ini. Coba tanya tentang layanan, proyek, skill, atau kontak.',
    'meta.home.title': 'Kamiliya — Full Stack Developer Portfolio',
    'meta.home.description': 'Portofolio junior web programmer profesional dengan fokus pada website responsif, performa, dan pengalaman pengguna.',
    'meta.about.title': 'About | Kamiliya',
    'meta.about.description': 'Profil Kamiliya sebagai junior web programmer, skill, tools, dan fokus kerja.',
    'meta.services.title': 'Services | Kamiliya',
    'meta.services.description': 'Layanan yang ditawarkan Kamiliya untuk web design, web development, dan UI refinement.',
    'meta.projects.title': 'Proyek | Kamiliya',
    'meta.projects.description': 'Kumpulan proyek portofolio junior web programmer Kamiliya.',
    'meta.testimonials.title': 'Testimonials | Kamiliya',
    'meta.testimonials.description': 'Contoh testimonial dan impresi kerja untuk portofolio Kamiliya.',
    'meta.contact.title': 'Kontak | Kamiliya',
    'meta.contact.description': 'Hubungi Kamiliya untuk kolaborasi web development dan freelance project.',
    'home.hero.eyebrow': 'BNSP Certified Junior Programmer',
    'home.hero.title': "Halo, saya Kamiliya",
    'home.hero.role': 'Junior Fullstack Web Developer',
    'home.hero.text': 'Saya membangun sistem web berbasis PHP & MySQL dengan tampilan responsif dan struktur kode yang rapi, siap digunakan untuk kebutuhan bisnis nyata.',
    'home.hero.ctaProjects': 'Lihat Proyek',
    'home.hero.ctaContact': 'Hubungi Saya',
    'home.hero.metricOne': 'Sertifikasi Junior Programming',
    'home.hero.metricTwo': 'Project nyata dan akademik',
    'home.hero.metricThree': 'Frontend dan backend berbasis PHP',
    'home.heroBanner.eyebrow': 'KAMILIYA PRASMAISYA',
    'home.heroBanner.title': "<span class=\"hero-intro\">Hay! I'm</span> Kamiliya I'm a Developer",
    'home.heroBanner.text': 'Junior Fullstack Web Developer yang fokus membangun website responsif, performa cepat, dan backend PHP + MySQL yang siap dipakai untuk kebutuhan bisnis.',
    'home.heroBanner.cta': 'GET IN TOUCH',
    'home.summary.label': 'Ringkasan Profil',
    'home.summary.title': 'Junior Fullstack Developer dengan sertifikasi resmi dan project nyata.',
    'home.summary.pointOne': 'Memiliki Sertifikat BNSP Junior Programming',
    'home.summary.pointTwo': 'Mengerjakan sistem sales order, company profile, dan dashboard Laravel',
    'home.summary.pointThree': 'Terbiasa membangun web responsif dengan frontend dan backend terintegrasi',
    'home.overview.kicker': 'Positioning',
    'home.overview.title': 'Bukan sekadar project latihan, tetapi pengalaman yang sudah relevan untuk kebutuhan nyata.',
    'home.overview.text': 'Saya sudah mengerjakan project nyata seperti sistem sales order Catering Sonokembang Jakarta, website company profile komunitas Aerox, web toko buku Laravel, hingga web peta tematik DKI Jakarta.',
    'home.profile.kicker': 'Profile',
    'home.profile.photoLabel': 'Foto profil mini',
    'home.profile.text': 'Berpengalaman di frontend dan backend dengan fokus pada sistem web yang rapi, responsif, dan siap dipakai.',
    'home.profile.github': 'GitHub: @kamiliyap',
    'home.stack.kicker': 'Tech Stack',
    'home.stack.title': 'Teknologi yang saya gunakan untuk membangun web modern.',
    'home.explore.kicker': 'Pengalaman Kerja',
    'home.explore.title': 'Ringkasan pengalaman dan project yang sudah saya kerjakan.',
    'home.cards.about.title': 'Dashboard Sales Order Internal',
    'home.cards.about.badge': 'Internal Project',
    'home.cards.about.text': 'Membangun dashboard analisis sales order internal berbasis PHP Native dan MySQL untuk monitoring penjualan, analisis kota, arsip dokumen, serta export Excel dan PDF.',
    'home.cards.about.cta': 'Lihat Detail',
    'home.cards.services.title': 'Website CV Aerox Club Motor',
    'home.cards.services.badge': 'Community Project',
    'home.cards.services.text': 'Mengerjakan website company profile komunitas motor Aerox dengan tampilan modern, responsif, dan fokus pada identitas komunitas serta publikasi kegiatan.',
    'home.cards.services.cta': 'Lihat Detail',
    'home.cards.testimonials.title': 'Website Toko Buku Pintar',
    'home.cards.testimonials.badge': 'Web App',
    'home.cards.testimonials.text': 'Mengembangkan website toko buku berbasis Laravel untuk katalog buku, pengelolaan data produk, dan kebutuhan sistem CRUD yang rapi dan mudah dikembangkan.',
    'home.cards.testimonials.cta': 'Lihat Detail',
    'home.highlights.roleKicker': 'Nilai Utama',
    'home.highlights.roleTitle': 'Sertifikasi resmi, pengalaman nyata, dan pondasi fullstack.',
    'home.highlights.roleText': 'Saya membawa kombinasi sertifikasi BNSP, pengalaman project riil, dan kemampuan membangun sistem berbasis PHP, MySQL, serta UI yang responsif.',
    'home.highlights.processKicker': 'Project Nyata',
    'home.highlights.processTitle': 'Sales order, company profile, dashboard, dan web tematik.',
    'home.highlights.processText': 'Pengalaman saya mencakup project pelatihan kerja PPKPI Jakarta, sistem catering, komunitas otomotif, dashboard penjualan Laravel, dan web peta tematik saat kuliah.',
    'home.contact.kicker': 'Contact',
    'home.contact.title': 'Mari diskusikan kebutuhan website kamu dari halaman kontak terpisah.',
    'home.contact.text': 'Terbuka untuk project freelance, kerja sama magang, atau posisi junior web programmer.',
    'home.contact.email': '<strong>Email:</strong> kamiliyaprasmaisya@gmail.com',
    'home.contact.linkedin': '<strong>LinkedIn:</strong> linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228',
    'home.contact.github': '<strong>GitHub:</strong> github.com/kamiliyap',
    'home.contact.emailCta': 'Email Me',
    'home.contact.pageCta': 'Open Contact Page',
    'about.heading.eyebrow': 'About',
    'about.heading.title': 'Junior Fullstack Developer dengan sertifikasi resmi dan pengalaman project nyata.',
    'about.heading.text': 'Saya tidak hanya belajar dari latihan, tetapi juga membangun sistem dan website yang sudah relevan untuk kebutuhan bisnis, organisasi, dan project pelatihan kerja.',
    'about.photo.label': 'Tempat foto profil',
    'about.photo.text': 'Foto Kamu',
    'about.profile.kicker': 'Profile',
    'about.profile.title': 'Pengalaman yang sudah mewakili kapasitas kerja nyata.',
    'about.profile.text': 'Saya memiliki Sertifikat BNSP Junior Programming dan pengalaman mengerjakan sistem sales order, company profile, dashboard Laravel, project PPKPI Jakarta, serta web peta tematik. Fokus saya adalah membangun sistem yang rapi, jelas, dan siap dikembangkan.',
    'about.profile.skill': '<strong>Skill:</strong> HTML, CSS, JavaScript, PHP, MySQL, Laravel',
    'about.profile.focus': '<strong>Fokus:</strong> Fullstack web development, dashboard, company profile, sistem bisnis',
    'about.profile.tools': '<strong>Pengalaman:</strong> BNSP, PPKPI Jakarta, Sales Order Catering, Aerox, Web Toko Buku, Peta Tematik DKI',
    'about.strength.kicker': 'Strength',
    'about.strength.title': 'Memiliki pondasi teknis sekaligus bukti pengalaman.',
    'about.strength.text': 'Kekuatan saya bukan hanya pada tampilan, tetapi pada kemampuan menyusun sistem web yang utuh dari frontend sampai backend, dengan pendekatan yang rapi dan mudah dipelihara.',
    'about.goal.kicker': 'Goal',
    'about.goal.title': 'Menampilkan kualitas kerja sejelas kemampuan yang saya miliki.',
    'about.goal.text': 'Target saya adalah berkontribusi sebagai Junior Fullstack Developer yang siap kerja, bukan hanya karena potensi, tetapi karena sudah punya sertifikasi dan pengalaman project yang bisa dipertanggungjawabkan.',
    'services.heading.eyebrow': 'Services',
    'services.heading.title': 'Layanan yang bisa saya bantu untuk website kamu.',
    'services.heading.text': 'Fokus layanan saya ada pada tampilan web, implementasi frontend, dan perapihan website agar terlihat lebih profesional.',
    'services.items.design.title': 'Web Design',
    'services.items.design.text': 'Menyusun layout halaman yang terstruktur, modern, dan nyaman dipakai di desktop maupun mobile.',
    'services.items.dev.title': 'Web Development',
    'services.items.dev.text': 'Mengubah desain menjadi kode HTML, CSS, JavaScript, dan PHP sederhana yang rapi.',
    'services.items.ui.title': 'UI Refinement',
    'services.items.ui.text': 'Merapikan tampilan existing website supaya lebih konsisten, responsif, dan layak presentasi.',
    'projects.heading.eyebrow': 'Selected Works',
    'projects.heading.title': 'Proyek yang mencerminkan cara saya bekerja.',
    'projects.heading.text': 'Saya menyiapkan studi kasus sederhana dengan fokus pada tampilan profesional, struktur yang rapi, dan kebutuhan user yang jelas.',
    'projects.items.company.badge': 'Company Profile',
    'projects.items.company.title': 'Website CV Aerox Club Motor',
    'projects.items.company.text': 'Website company profile komunitas motor Aerox dengan tampilan modern untuk menampilkan profil komunitas, aktivitas, dan informasi penting secara lebih profesional.',
    'projects.items.company.pointOne': 'Menampilkan identitas dan profil komunitas dengan layout yang jelas',
    'projects.items.company.pointTwo': 'Responsif di desktop dan mobile untuk kebutuhan publikasi komunitas',
    'projects.items.company.pointThree': 'Visual branding yang lebih kuat untuk klub motor Aerox',
    'projects.items.dashboard.badge': 'Admin Dashboard',
    'projects.items.dashboard.title': 'Dashboard Data Internal',
    'projects.items.dashboard.text': 'Tampilan dashboard untuk memonitor data, status pekerjaan, dan ringkasan performa dalam satu halaman.',
    'projects.items.dashboard.pointOne': 'Navigasi sidebar yang sederhana',
    'projects.items.dashboard.pointTwo': 'Komponen kartu statistik reusable',
    'projects.items.dashboard.pointThree': 'Fokus pada keterbacaan data',
    'projects.items.portfolio.badge': 'Portfolio Template',
    'projects.items.portfolio.title': 'Personal Branding Website',
    'projects.items.portfolio.text': 'Template portofolio untuk web programmer junior agar terlihat lebih profesional saat melamar kerja atau freelance.',
    'projects.items.portfolio.pointOne': 'Section profil, skill, dan proyek',
    'projects.items.portfolio.pointTwo': 'Theme toggle dengan local storage',
    'projects.items.portfolio.pointThree': 'Struktur file mudah dikembangkan',
    'projects.items.bookstore.badge': 'Web App',
    'projects.items.bookstore.title': 'Website Toko Buku',
    'projects.items.bookstore.text': 'Website toko buku berbasis Laravel untuk menampilkan katalog, mengelola data buku, dan membantu proses pengelolaan informasi produk secara lebih rapi.',
    'projects.items.bookstore.pointOne': 'Manajemen data buku dan katalog dalam satu sistem',
    'projects.items.bookstore.pointTwo': 'Struktur backend Laravel yang rapi dan mudah dikembangkan',
    'projects.items.bookstore.pointThree': 'Cocok untuk latihan sistem CRUD dan pengelolaan produk',
    'testimonials.heading.eyebrow': 'Testimonials',
    'testimonials.heading.title': 'Kesan kerja yang ingin saya bangun melalui hasil dan komunikasi.',
    'testimonials.heading.text': 'Halaman ini menampilkan contoh gaya testimonial untuk memperkuat personal branding dan kepercayaan calon klien atau recruiter.',
    'testimonials.items.one.quote': '"Tampilannya rapi, mudah dipahami, dan revisi yang diberikan juga cepat disesuaikan."',
    'testimonials.items.one.role': 'Marketing Team',
    'testimonials.items.two.quote': '"Komunikasi jelas, hasil layout terasa profesional, dan pengerjaan terlihat terstruktur."',
    'testimonials.items.two.role': 'Startup Founder',
    'testimonials.items.three.quote': '"Sangat membantu untuk merapikan visual website agar lebih konsisten dan siap dipresentasikan."',
    'testimonials.items.three.role': 'Business Owner',
    'testimonials.items.four.quote': '"Cocok untuk project yang butuh tampilan modern, responsif, dan pengembangan bertahap."',
    'testimonials.items.four.role': 'Product Team',
    'contact.heading.eyebrow': 'Kontak',
    'contact.heading.title': 'Siap untuk diskusi kerja, freelance, atau kolaborasi.',
    'contact.heading.text': 'Jika Anda membutuhkan web programmer junior yang detail pada tampilan dan siap berkembang di tim, saya terbuka untuk percakapan lebih lanjut.',
    'contact.info.kicker': 'Informasi Kontak',
    'contact.info.emailLabel': 'Email Kamiliya',
    'contact.info.githubLabel': 'GitHub Kamiliya',
    'contact.info.linkedinLabel': 'LinkedIn Kamiliya',
    'contact.info.instagramLabel': 'Instagram Kamiliya',
    'contact.availability.kicker': 'Ketersediaan',
    'contact.availability.title': 'Terbuka untuk:',
    'contact.availability.pointOne': 'Posisi junior frontend atau web developer',
    'contact.availability.pointTwo': 'Freelance landing page dan website profil',
    'contact.availability.pointThree': 'Kolaborasi desain ke implementasi HTML/CSS',
    'contact.availability.cta': 'Mulai Diskusi',
    'contact.availability.href': 'mailto:kamiliyaprasmaisya@gmail.com?subject=Diskusi%20Project',
    'contact.response.kicker': 'Respons',
    'contact.response.title': 'Komunikasi yang jelas dan profesional.',
    'contact.response.text': 'Saya berusaha menjaga komunikasi tetap singkat, jelas, dan fokus pada hasil agar kebutuhan proyek bisa diterjemahkan dengan tepat.',
    'contact.work.kicker': 'Kerja Sama',
    'contact.work.title': 'Terbuka untuk project kecil hingga pengembangan awal.',
    'contact.work.text': 'Cocok untuk landing page, company profile, portofolio personal, atau perapihan UI website yang sudah ada.'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.projects': 'Projects',
    'nav.services': 'Services',
    'nav.testimonials': 'Testimonials',
    'nav.contact': 'Contact',
    'nav.toggle': 'Open navigation menu',
    'theme.toggle': 'Toggle theme',
    'footer.copy': 'Junior Web Programmer focused on fast, polished, and maintainable interfaces.',
    'footer.github': 'GitHub',
    'footer.linkedin': 'LinkedIn',
    'footer.instagram': 'Instagram',
    'chat.toggle': 'Q&A',
    'chat.kicker': 'Chatbox',
    'chat.title': 'Ask about the portfolio',
    'chat.close': 'Close chatbox',
    'chat.quick.services': 'Services',
    'chat.quick.projects': 'Projects',
    'chat.quick.skills': 'Skills',
    'chat.quick.contact': 'Contact',
    'chat.placeholder': 'Type your question...',
    'chat.send': 'Send',
    'chat.greeting': 'Hi, I can answer questions about Kamiliya\'s services, projects, skills, or contact details.',
    'chat.loading': 'Bot is typing...',
    'chat.apiUnavailable': 'The Python backend is not running yet, so the chat is using local fallback replies.',
    'chat.answers.services': 'Kamiliya focuses on web design, web development, and UI refinement for clean and responsive websites.',
    'chat.answers.projects': 'Project examples include company profiles, internal dashboards, and personal branding websites.',
    'chat.answers.skills': 'The main skills shown are HTML, CSS, JavaScript, PHP, Bootstrap, Git, and responsive UI implementation.',
    'chat.answers.contact': 'You can reach out via kamiliyaprasmaisya@gmail.com or the contact page for further discussion.',
    'chat.answers.default': 'That question is not in this simple Q&A list yet. Try asking about services, projects, skills, or contact.',
    'meta.home.title': 'Kamiliya — Full Stack Developer Portfolio',
    'meta.home.description': 'A junior web programmer portfolio focused on responsive websites, performance, and user experience.',
    'meta.about.title': 'About | Kamiliya',
    'meta.about.description': 'Kamiliya profile as a junior web programmer, including skills, tools, and work focus.',
    'meta.services.title': 'Services | Kamiliya',
    'meta.services.description': 'Services offered by Kamiliya for web design, web development, and UI refinement.',
    'meta.projects.title': 'Projects | Kamiliya',
    'meta.projects.description': 'Selected portfolio projects by junior web programmer Kamiliya.',
    'meta.testimonials.title': 'Testimonials | Kamiliya',
    'meta.testimonials.description': 'Sample testimonials and work impressions for Kamiliya portfolio.',
    'meta.contact.title': 'Contact | Kamiliya',
    'meta.contact.description': 'Contact Kamiliya for web development collaboration and freelance projects.',
    'home.hero.eyebrow': 'BNSP Certified Junior Programmer',
    'home.hero.title': 'Hello, I am Kamiliya',
    'home.hero.role': 'Junior Fullstack Web Developer',
    'home.hero.text': 'I build PHP and MySQL based web systems with responsive interfaces and clean code structure, ready for real business needs.',
    'home.hero.ctaProjects': 'View Projects',
    'home.hero.ctaContact': 'Contact Me',
    'home.hero.metricOne': 'Junior Programming certification',
    'home.hero.metricTwo': 'Real and academic projects',
    'home.hero.metricThree': 'PHP-based frontend and backend',
    'home.heroBanner.eyebrow': 'KAMILIYA PRASMAISYA',
    'home.heroBanner.title': "<span class=\"hero-intro\">Hi! I'm</span> Kamiliya I'm a Developer",
    'home.heroBanner.text': 'Junior Fullstack Web Developer focused on building responsive websites, fast performance, and PHP + MySQL backends ready for business needs.',
    'home.heroBanner.cta': 'GET IN TOUCH',
    'home.summary.label': 'Profile Summary',
    'home.summary.title': 'A Junior Fullstack Developer with official certification and real project experience.',
    'home.summary.pointOne': 'Holds a BNSP Junior Programming certification',
    'home.summary.pointTwo': 'Worked on sales order systems, company profiles, and Laravel dashboards',
    'home.summary.pointThree': 'Used to building responsive web systems with integrated frontend and backend',
    'home.overview.kicker': 'Positioning',
    'home.overview.title': 'Not just practice projects, but experience already relevant to real-world needs.',
    'home.overview.text': 'I have worked on real projects such as the Catering Sonokembang Jakarta sales order system, the Aerox community company profile website, a Laravel bookstore app, and a thematic map website for Jakarta.',
    'home.profile.kicker': 'Profile',
    'home.profile.photoLabel': 'Mini profile photo',
    'home.profile.text': 'Experienced in both frontend and backend with a focus on web systems that are polished, responsive, and ready to use.',
    'home.profile.github': 'GitHub: @kamiliyap',
    'home.stack.kicker': 'Tech Stack',
    'home.stack.title': 'Technologies I use to build modern websites.',
    'home.explore.kicker': 'Work History',
    'home.explore.title': 'A summary of the experience and projects I have worked on.',
    'home.cards.about.title': 'Internal Sales Order Dashboard',
    'home.cards.about.badge': 'Internal Project',
    'home.cards.about.text': 'Built an internal sales order analytics dashboard using native PHP and MySQL for sales monitoring, city analysis, document archiving, and Excel/PDF export.',
    'home.cards.about.cta': 'View Details',
    'home.cards.services.title': 'Aerox Motor Club CV Website',
    'home.cards.services.badge': 'Community Project',
    'home.cards.services.text': 'Developed a modern and responsive company profile website for the Aerox motor community, focused on community identity and activity publication.',
    'home.cards.services.cta': 'View Details',
    'home.cards.testimonials.title': 'Toko Buku Pintar Website',
    'home.cards.testimonials.badge': 'Web App',
    'home.cards.testimonials.text': 'Developed a Laravel-based bookstore website for book catalogs, product data management, and clean, extensible CRUD functionality.',
    'home.cards.testimonials.cta': 'View Details',
    'home.highlights.roleKicker': 'Core Value',
    'home.highlights.roleTitle': 'Official certification, real experience, and a fullstack foundation.',
    'home.highlights.roleText': 'I bring a combination of BNSP certification, real project experience, and the ability to build systems with PHP, MySQL, and responsive UI.',
    'home.highlights.processKicker': 'Real Projects',
    'home.highlights.processTitle': 'Sales order, company profile, dashboards, and thematic web apps.',
    'home.highlights.processText': 'My experience includes PPKPI Jakarta training projects, catering systems, automotive community websites, Laravel sales dashboards, and a thematic map web app during college.',
    'home.contact.kicker': 'Contact',
    'home.contact.title': 'Let’s discuss your website needs from the dedicated contact page.',
    'home.contact.text': 'Open for freelance projects, internship collaborations, or junior web programmer roles.',
    'home.contact.email': '<strong>Email:</strong> kamiliyaprasmaisya@gmail.com',
    'home.contact.linkedin': '<strong>LinkedIn:</strong> linkedin.com/in/kamiliya-latifah-prasmaisya-a54786228',
    'home.contact.github': '<strong>GitHub:</strong> github.com/kamiliyap',
    'home.contact.emailCta': 'Email Me',
    'home.contact.pageCta': 'Open Contact Page',
    'about.heading.eyebrow': 'About',
    'about.heading.title': 'A Junior Fullstack Developer with official certification and real project experience.',
    'about.heading.text': 'I have not only learned through exercises, but also built systems and websites that are already relevant for business, organizational, and workforce training needs.',
    'about.photo.label': 'Profile photo placeholder',
    'about.photo.text': 'Your Photo',
    'about.profile.kicker': 'Profile',
    'about.profile.title': 'Experience that already reflects real working capacity.',
    'about.profile.text': 'I hold a BNSP Junior Programming certification and have worked on sales order systems, company profile websites, Laravel dashboards, PPKPI Jakarta projects, and thematic map websites. My focus is building systems that are clean, clear, and ready to grow.',
    'about.profile.skill': '<strong>Skills:</strong> HTML, CSS, JavaScript, PHP, MySQL, Laravel',
    'about.profile.focus': '<strong>Focus:</strong> Fullstack web development, dashboards, company profiles, business systems',
    'about.profile.tools': '<strong>Experience:</strong> BNSP, PPKPI Jakarta, Catering Sales Order, Aerox, Bookstore Web, Jakarta Thematic Map',
    'about.strength.kicker': 'Strength',
    'about.strength.title': 'A technical foundation backed by real experience.',
    'about.strength.text': 'My strength is not only visual implementation, but also the ability to structure complete web systems from frontend to backend with a clean and maintainable approach.',
    'about.goal.kicker': 'Goal',
    'about.goal.title': 'To present my work quality as clearly as the capability I already have.',
    'about.goal.text': 'My goal is to contribute as a job-ready Junior Fullstack Developer, supported not only by potential, but also by certification and project experience that can be demonstrated clearly.',
    'services.heading.eyebrow': 'Services',
    'services.heading.title': 'Services I can help with for your website.',
    'services.heading.text': 'My service focus is on web presentation, frontend implementation, and refining websites to look more professional.',
    'services.items.design.title': 'Web Design',
    'services.items.design.text': 'Structuring page layouts that feel modern, organized, and comfortable to use on desktop and mobile.',
    'services.items.dev.title': 'Web Development',
    'services.items.dev.text': 'Turning designs into clean HTML, CSS, JavaScript, and simple PHP code.',
    'services.items.ui.title': 'UI Refinement',
    'services.items.ui.text': 'Improving existing website visuals so they feel more consistent, responsive, and presentation-ready.',
    'projects.heading.eyebrow': 'Selected Works',
    'projects.heading.title': 'Project examples that reflect how I work.',
    'projects.heading.text': 'I prepare simple case studies focused on professional visuals, clean structure, and clear user needs.',
    'projects.items.company.badge': 'Company Profile',
    'projects.items.company.title': 'Aerox Motor Club CV Website',
    'projects.items.company.text': 'A modern company profile website for the Aerox motor community to present the club profile, activities, and important information more professionally.',
    'projects.items.company.pointOne': 'Clear layout to present the club identity and profile',
    'projects.items.company.pointTwo': 'Responsive on desktop and mobile for community publication needs',
    'projects.items.company.pointThree': 'Stronger visual branding for the Aerox motor club',
    'projects.items.dashboard.badge': 'Admin Dashboard',
    'projects.items.dashboard.title': 'Internal Data Dashboard',
    'projects.items.dashboard.text': 'A dashboard interface to monitor data, work status, and performance summaries in one place.',
    'projects.items.dashboard.pointOne': 'Simple sidebar navigation',
    'projects.items.dashboard.pointTwo': 'Reusable statistic card components',
    'projects.items.dashboard.pointThree': 'Focus on data readability',
    'projects.items.portfolio.badge': 'Portfolio Template',
    'projects.items.portfolio.title': 'Personal Branding Website',
    'projects.items.portfolio.text': 'A portfolio template for junior web programmers to look more professional when applying for jobs or freelance work.',
    'projects.items.portfolio.pointOne': 'Profile, skills, and project sections',
    'projects.items.portfolio.pointTwo': 'Theme toggle with local storage',
    'projects.items.portfolio.pointThree': 'Easy-to-extend file structure',
    'projects.items.bookstore.badge': 'Web App',
    'projects.items.bookstore.title': 'Bookstore Website',
    'projects.items.bookstore.text': 'A Laravel-based bookstore website to display catalogs, manage book data, and organize product information more neatly.',
    'projects.items.bookstore.pointOne': 'Book and catalog data management in one system',
    'projects.items.bookstore.pointTwo': 'Clean Laravel backend structure that is easy to extend',
    'projects.items.bookstore.pointThree': 'Suitable for CRUD system practice and product management',
    'testimonials.heading.eyebrow': 'Testimonials',
    'testimonials.heading.title': 'The working impression I aim to build through results and communication.',
    'testimonials.heading.text': 'This page shows sample testimonial styles to strengthen personal branding and build trust with prospective clients or recruiters.',
    'testimonials.items.one.quote': '"The interface was neat, easy to understand, and revisions were adjusted quickly."',
    'testimonials.items.one.role': 'Marketing Team',
    'testimonials.items.two.quote': '"Communication was clear, the layout felt professional, and the execution looked structured."',
    'testimonials.items.two.role': 'Startup Founder',
    'testimonials.items.three.quote': '"Very helpful in refining the website visuals to be more consistent and ready to present."',
    'testimonials.items.three.role': 'Business Owner',
    'testimonials.items.four.quote': '"A strong fit for projects that need a modern, responsive interface with room for gradual development."',
    'testimonials.items.four.role': 'Product Team',
    'contact.heading.eyebrow': 'Contact',
    'contact.heading.title': 'Ready for work discussions, freelance, or collaboration.',
    'contact.heading.text': 'If you need a junior web programmer who pays attention to interface details and is ready to grow in a team, I am open to further conversation.',
    'contact.info.kicker': 'Contact Information',
    'contact.info.emailLabel': 'Kamiliya email',
    'contact.info.githubLabel': 'Kamiliya GitHub',
    'contact.info.linkedinLabel': 'Kamiliya LinkedIn',
    'contact.info.instagramLabel': 'Kamiliya Instagram',
    'contact.availability.kicker': 'Availability',
    'contact.availability.title': 'Open to:',
    'contact.availability.pointOne': 'Junior frontend or web developer roles',
    'contact.availability.pointTwo': 'Freelance landing pages and profile websites',
    'contact.availability.pointThree': 'Design-to-HTML/CSS implementation collaboration',
    'contact.availability.cta': 'Start Discussion',
    'contact.availability.href': 'mailto:kamiliyaprasmaisya@gmail.com?subject=Project%20Discussion',
    'contact.response.kicker': 'Response',
    'contact.response.title': 'Clear and professional communication.',
    'contact.response.text': 'I aim to keep communication concise, clear, and focused on results so project needs can be translated accurately.',
    'contact.work.kicker': 'Collaboration',
    'contact.work.title': 'Open to small projects and early-stage development.',
    'contact.work.text': 'Suitable for landing pages, company profiles, personal portfolios, or refining the UI of existing websites.'
  }
};

const chatConversations = {
  id: [
    { sender: 'bot', text: 'Bot: Halo 👋 Terima kasih sudah mengunjungi portofolio saya. Ada yang bisa saya bantu?' },
    { sender: 'user', text: 'Visitor: Halo, saya lihat kamu bisa bikin website ya?' },
    { sender: 'bot', text: 'Bot: Iya betul 😊 Saya fokus di Web Development (Frontend & Backend). Kakak butuh website seperti apa?' },
    { sender: 'user', text: 'Visitor: Untuk company profile sederhana dulu.' },
    { sender: 'bot', text: 'Bot: Baik 👍 Company profile biasanya terdiri dari:\n- Home\n- Tentang Kami\n- Layanan\n- Portfolio\n- Kontak\nApakah ada fitur khusus yang dibutuhkan?' },
    { sender: 'user', text: 'Visitor: Bisa ada form pemesanan nggak?' },
    { sender: 'bot', text: 'Bot: Bisa banget. Form bisa langsung masuk ke database dan admin bisa lihat di dashboard.' },
    { sender: 'user', text: 'Visitor: Kamu pakai teknologi apa?' },
    { sender: 'bot', text: 'Bot: Biasanya saya menggunakan:\n- HTML, CSS, JavaScript\n- Bootstrap / Tailwind\n- PHP & MySQL\n- Git untuk version control' },
    { sender: 'user', text: 'Visitor: Bisa pakai Laravel?' },
    { sender: 'bot', text: 'Bot: Bisa, tapi untuk project kecil biasanya saya pakai native PHP supaya lebih ringan.' },
    { sender: 'user', text: 'Visitor: Berapa lama pengerjaannya?' },
    { sender: 'bot', text: 'Bot: Untuk company profile + form sekitar 7–14 hari tergantung revisi.' },
    { sender: 'user', text: 'Visitor: Kalau harga?' },
    { sender: 'bot', text: 'Bot: Untuk basic company profile mulai dari 2,5 juta. Jika ada dashboard admin dan fitur tambahan bisa 3–5 juta.' },
    { sender: 'user', text: 'Visitor: Bisa nego?' },
    { sender: 'bot', text: 'Bot: Bisa diskusi 😊 Biasanya saya sesuaikan dengan kebutuhan dan budget.' },
    { sender: 'user', text: 'Visitor: Hosting dan domain termasuk?' },
    { sender: 'bot', text: 'Bot: Bisa saya bantu urus, atau bisa juga dari pihak kakak. Saya biasanya rekomendasikan Hostinger atau Niagahoster.' },
    { sender: 'user', text: 'Visitor: Apakah bisa responsive di HP?' },
    { sender: 'bot', text: 'Bot: Pasti 👍 Semua website yang saya buat sudah mobile friendly.' },
    { sender: 'user', text: 'Visitor: SEO gimana?' },
    { sender: 'bot', text: 'Bot: Saya optimasi dasar seperti:\n- Meta tag\n- Struktur heading\n- Kecepatan loading\n- Sitemap' },
    { sender: 'user', text: 'Visitor: Bisa integrasi WhatsApp?' },
    { sender: 'bot', text: 'Bot: Bisa, tombol WhatsApp langsung ke nomor bisnis kakak.' },
    { sender: 'user', text: 'Visitor: Kalau saya mau lihat project sebelumnya?' },
    { sender: 'bot', text: 'Bot: Bisa cek di bagian Portfolio ya 😊 Ada beberapa project yang sudah saya kerjakan.' },
    { sender: 'user', text: 'Visitor: Kamu kerja sendiri atau tim?' },
    { sender: 'bot', text: 'Bot: Untuk sekarang saya handle sendiri, tapi jika project besar saya bisa kolaborasi dengan tim.' },
    { sender: 'user', text: 'Visitor: Apakah ada garansi?' },
    { sender: 'bot', text: 'Bot: Ada free maintenance 1 bulan setelah website selesai.' },
    { sender: 'user', text: 'Visitor: Kalau mau mulai gimana?' },
    { sender: 'bot', text: 'Bot: Biasanya kita diskusi detail dulu, lalu DP 30%, setelah itu saya mulai development.' },
    { sender: 'user', text: 'Visitor: Pembayaran bisa transfer?' },
    { sender: 'bot', text: 'Bot: Bisa via BCA / Mandiri.' },
    { sender: 'user', text: 'Visitor: Oke nanti saya kabari ya.' },
    { sender: 'bot', text: 'Bot: Baik 😊 Saya tunggu kabarnya. Terima kasih sudah menghubungi.' }
  ],
  en: [
    { sender: 'bot', text: 'Bot: Hello 👋 Thank you for visiting my portfolio. How can I help you?' },
    { sender: 'user', text: 'Visitor: Hi, I saw that you can build websites?' },
    { sender: 'bot', text: 'Bot: Yes 😊 I focus on Web Development (Frontend & Backend). What kind of website do you need?' },
    { sender: 'user', text: 'Visitor: A simple company profile first.' },
    { sender: 'bot', text: 'Bot: Sure 👍 A company profile usually includes:\n- Home\n- About Us\n- Services\n- Portfolio\n- Contact\nDo you need any special features?' },
    { sender: 'user', text: 'Visitor: Can it include an order form?' },
    { sender: 'bot', text: 'Bot: Absolutely. The form can go straight into the database and the admin can review it in the dashboard.' },
    { sender: 'user', text: 'Visitor: What technologies do you use?' },
    { sender: 'bot', text: 'Bot: I usually use:\n- HTML, CSS, JavaScript\n- Bootstrap / Tailwind\n- PHP & MySQL\n- Git for version control' },
    { sender: 'user', text: 'Visitor: Can you use Laravel?' },
    { sender: 'bot', text: 'Bot: Yes, but for small projects I usually use native PHP so it stays lighter.' },
    { sender: 'user', text: 'Visitor: How long does it take?' },
    { sender: 'bot', text: 'Bot: For a company profile plus form, around 7-14 days depending on revisions.' },
    { sender: 'user', text: 'Visitor: What about the price?' },
    { sender: 'bot', text: 'Bot: A basic company profile starts from 2.5 million IDR. With admin dashboard and extra features, it is usually around 3-5 million IDR.' },
    { sender: 'user', text: 'Visitor: Is the price negotiable?' },
    { sender: 'bot', text: 'Bot: We can discuss it 😊 I usually adjust it to the project scope and budget.' },
    { sender: 'user', text: 'Visitor: Are hosting and domain included?' },
    { sender: 'bot', text: 'Bot: I can help arrange them, or you can provide them yourself. I usually recommend Hostinger or Niagahoster.' },
    { sender: 'user', text: 'Visitor: Will it be responsive on mobile?' },
    { sender: 'bot', text: 'Bot: Definitely 👍 All websites I build are mobile friendly.' },
    { sender: 'user', text: 'Visitor: How about SEO?' },
    { sender: 'bot', text: 'Bot: I handle basic optimization such as:\n- Meta tags\n- Heading structure\n- Loading speed\n- Sitemap' },
    { sender: 'user', text: 'Visitor: Can you integrate WhatsApp?' },
    { sender: 'bot', text: 'Bot: Yes, I can add a WhatsApp button that goes directly to your business number.' },
    { sender: 'user', text: 'Visitor: Can I see your previous projects?' },
    { sender: 'bot', text: 'Bot: Sure, you can check the Portfolio section 😊 There are several projects there.' },
    { sender: 'user', text: 'Visitor: Do you work alone or with a team?' },
    { sender: 'bot', text: 'Bot: Right now I handle projects myself, but for larger work I can collaborate with a team.' },
    { sender: 'user', text: 'Visitor: Is there any warranty?' },
    { sender: 'bot', text: 'Bot: Yes, there is 1 month of free maintenance after the website is completed.' },
    { sender: 'user', text: 'Visitor: How do we get started?' },
    { sender: 'bot', text: 'Bot: Usually we discuss the details first, then a 30% down payment, and after that I start development.' },
    { sender: 'user', text: 'Visitor: Can payment be done by bank transfer?' },
    { sender: 'bot', text: 'Bot: Yes, via BCA / Mandiri.' },
    { sender: 'user', text: 'Visitor: Okay, I will let you know later.' },
    { sender: 'bot', text: 'Bot: Alright 😊 I will wait for your update. Thank you for reaching out.' }
  ]
};

if (btn) {
  const moon = btn.querySelector('.bi-moon');
  const sun = btn.querySelector('.bi-sun');
  const savedTheme = localStorage.getItem('theme') || 'dark';

  setTheme(savedTheme);

  btn.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('light') ? 'dark' : 'light';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light');
      moon.style.display = 'inline';
      sun.style.display = 'none';
    } else {
      document.body.classList.remove('light');
      sun.style.display = 'inline';
      moon.style.display = 'none';
    }

    localStorage.setItem('theme', theme);
  }
}

if (navbar && navbarBurger) {
  navbarBurger.addEventListener('click', () => {
    const isOpen = navbar.classList.toggle('is-open');
    navbarBurger.setAttribute('aria-expanded', String(isOpen));
  });

  navbarMenuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navbar.classList.remove('is-open');
      navbarBurger.setAttribute('aria-expanded', 'false');
    });
  });
}

const params = new URLSearchParams(window.location.search);
const languageFromUrl = params.get('lang');
const savedLanguage = localStorage.getItem('language') || 'id';
const initialLanguage = translations[languageFromUrl] ? languageFromUrl : savedLanguage;
let currentLanguage = initialLanguage;
let renderChatGreeting = null;
const chatApiBaseUrl = `http://${window.location.hostname || '127.0.0.1'}:5000/api`;
const chatApiEnabled = document.body.dataset.chatApi === 'enabled';
let chatApiAvailable = chatApiEnabled;

setLanguage(initialLanguage);

languageButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    setLanguage(button.dataset.lang);

    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('lang', button.dataset.lang);
    window.history.replaceState({}, '', nextUrl);
  });
});

function setLanguage(language) {
  const activeLanguage = translations[language] ? language : 'id';
  currentLanguage = activeLanguage;

  document.documentElement.lang = activeLanguage;

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = translations[activeLanguage][element.dataset.i18n];
    if (value) {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-html]').forEach((element) => {
    const value = translations[activeLanguage][element.dataset.i18nHtml];
    if (value) {
      element.innerHTML = value;
    }
  });

  document.querySelectorAll('[data-i18n-aria-label]').forEach((element) => {
    const value = translations[activeLanguage][element.dataset.i18nAriaLabel];
    if (value) {
      element.setAttribute('aria-label', value);
    }
  });

  document.querySelectorAll('[data-i18n-content]').forEach((element) => {
    const value = translations[activeLanguage][element.dataset.i18nContent];
    if (value) {
      element.setAttribute('content', value);
    }
  });

  document.querySelectorAll('[data-i18n-href]').forEach((element) => {
    const value = translations[activeLanguage][element.dataset.i18nHref];
    if (value) {
      element.setAttribute('href', value);
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const value = translations[activeLanguage][element.dataset.i18nPlaceholder];
    if (value) {
      element.setAttribute('placeholder', value);
    }
  });

  document.querySelectorAll('a[href]').forEach((element) => {
    const href = element.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http://') || href.startsWith('https://')) {
      return;
    }

    const nextUrl = new URL(href, window.location.href);
    nextUrl.searchParams.set('lang', activeLanguage);
    element.setAttribute('href', `${nextUrl.pathname.split('/').pop()}${nextUrl.search}`);
  });

  const pageTitle = document.getElementById('page-title');
  if (pageTitle) {
    document.title = pageTitle.textContent;
  }

  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === activeLanguage;
    button.classList.toggle('is-active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  localStorage.setItem('language', activeLanguage);

  if (typeof renderChatGreeting === 'function') {
    renderChatGreeting();
  }
}

const chatboxToggle = document.getElementById('chatbox-toggle');
const chatboxClose = document.getElementById('chatbox-close');
const chatboxPanel = document.getElementById('chatbox-panel');
const chatboxMessages = document.getElementById('chatbox-messages');
const chatboxForm = document.getElementById('chatbox-form');
const chatboxInput = document.getElementById('chatbox-input');
const chatboxQuickQuestions = document.querySelectorAll('.chatbox-chip');
let chatHistory = [];

if (chatboxToggle && chatboxPanel && chatboxMessages) {
  let hasRenderedGreeting = false;

  chatboxToggle.addEventListener('click', () => {
    const isOpen = !chatboxPanel.hasAttribute('hidden');
    chatboxPanel.toggleAttribute('hidden', isOpen);
    chatboxToggle.setAttribute('aria-expanded', String(!isOpen));

    if (!isOpen && !hasRenderedGreeting) {
      renderChatGreeting();
      hasRenderedGreeting = true;
    }
  });

  if (chatboxClose) {
    chatboxClose.addEventListener('click', () => {
      chatboxPanel.setAttribute('hidden', '');
      chatboxToggle.setAttribute('aria-expanded', 'false');
    });
  }

  if (chatboxForm && chatboxInput) {
    chatboxForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const question = chatboxInput.value.trim();

      if (!question) {
        return;
      }

      await handleChatQuestion(question);
      chatboxInput.value = '';
    });
  }

  chatboxQuickQuestions.forEach((button) => {
    button.addEventListener('click', async () => {
      await handleChatQuestion(button.textContent.trim(), button.dataset.question);
    });
  });

  renderChatGreeting = async function renderChatGreetingMessage() {
    chatboxMessages.innerHTML = '';
    chatHistory = [];

    const conversation = await fetchDemoConversation();
    conversation.forEach((message) => {
      appendChatMessage(message.text, message.sender);
    });
  };
}

function appendChatMessage(text, sender) {
  if (!chatboxMessages) {
    return;
  }

  const message = document.createElement('div');
  message.className = `chatbox-message ${sender}`;
  message.textContent = text;
  chatboxMessages.appendChild(message);
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
}

async function handleChatQuestion(question, presetKey = '') {
  appendChatMessage(question, 'user');
  chatHistory.push({ sender: 'user', text: question });

  const loadingMessage = appendTemporaryLoadingMessage();
  const reply = await fetchChatReply(question, presetKey);
  loadingMessage.remove();

  appendChatMessage(reply, 'bot');
  chatHistory.push({ sender: 'bot', text: reply });
}

function appendTemporaryLoadingMessage() {
  const message = document.createElement('div');
  message.className = 'chatbox-message bot';
  message.textContent = translations[currentLanguage]['chat.loading'];
  chatboxMessages.appendChild(message);
  chatboxMessages.scrollTop = chatboxMessages.scrollHeight;
  return message;
}

async function fetchDemoConversation() {
  if (!chatApiEnabled) {
    return chatConversations[currentLanguage] || chatConversations.id;
  }

  try {
    const response = await fetch(`${chatApiBaseUrl}/demo-conversation?lang=${encodeURIComponent(currentLanguage)}`);
    if (!response.ok) {
      throw new Error('demo conversation request failed');
    }

    const data = await response.json();
    chatApiAvailable = true;
    return Array.isArray(data.messages) ? data.messages : (chatConversations[currentLanguage] || chatConversations.id);
  } catch (error) {
    chatApiAvailable = false;
    const conversation = [...(chatConversations[currentLanguage] || chatConversations.id)];
    conversation.unshift({
      sender: 'bot',
      text: translations[currentLanguage]['chat.apiUnavailable']
    });
    return conversation;
  }
}

async function fetchChatReply(question, presetKey = '') {
  if (!chatApiEnabled) {
    return resolveFallbackReply(question, presetKey);
  }

  try {
    const response = await fetch(`${chatApiBaseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: question,
        lang: currentLanguage,
        history: chatHistory,
        preset: presetKey || null
      })
    });

    if (!response.ok) {
      throw new Error('chat request failed');
    }

    const data = await response.json();
    chatApiAvailable = true;
    return data.reply || resolveFallbackReply(question, presetKey);
  } catch (error) {
    if (chatApiAvailable) {
      chatApiAvailable = false;
      return `${translations[currentLanguage]['chat.apiUnavailable']}\n\n${resolveFallbackReply(question, presetKey)}`;
    }

    return resolveFallbackReply(question, presetKey);
  }
}

function resolvePresetAnswer(key) {
  const map = {
    services: 'chat.answers.services',
    projects: 'chat.answers.projects',
    skills: 'chat.answers.skills',
    contact: 'chat.answers.contact'
  };

  return translations[currentLanguage][map[key]] || translations[currentLanguage]['chat.answers.default'];
}

function resolveAnswer(question) {
  const lowerQuestion = question.toLowerCase();

  if (lowerQuestion.includes('service') || lowerQuestion.includes('layanan')) {
    return translations[currentLanguage]['chat.answers.services'];
  }

  if (lowerQuestion.includes('project') || lowerQuestion.includes('proyek') || lowerQuestion.includes('portfolio')) {
    return translations[currentLanguage]['chat.answers.projects'];
  }

  if (lowerQuestion.includes('skill') || lowerQuestion.includes('teknologi') || lowerQuestion.includes('tech')) {
    return translations[currentLanguage]['chat.answers.skills'];
  }

  if (lowerQuestion.includes('contact') || lowerQuestion.includes('kontak') || lowerQuestion.includes('email')) {
    return translations[currentLanguage]['chat.answers.contact'];
  }

  return translations[currentLanguage]['chat.answers.default'];
}

function resolveFallbackReply(question, presetKey = '') {
  if (presetKey) {
    return resolvePresetAnswer(presetKey);
  }

  return resolveAnswer(question);
}
