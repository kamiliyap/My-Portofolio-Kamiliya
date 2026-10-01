// Scope lokal menjaga variabel hero terpisah dari theme.js, robot, dan contact form.
(() => {
  const hero = document.querySelector('.portfolio-hero');
  if (!hero) return;

  // Teks availability mengikuti bahasa yang dikelola theme.js.
  const availability = hero.querySelector('.hero-availability-copy');
  const updateAvailability = () => {
    if (!availability) return;
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    const emphasis = document.createElement('strong');
    emphasis.textContent = english ? 'Opportunities' : 'Peluang Baru';
    availability.replaceChildren(document.createTextNode(english ? 'Available for ' : 'Terbuka untuk '), emphasis);
  };
  updateAvailability();

  // Label statistik mengikuti ID/EN; angka pencapaian tetap sama.
  const statsBar = document.querySelector('.hero-stats');
  const statItems = statsBar ? Array.from(statsBar.querySelectorAll('.stat-item')) : [];
  const updateStatsLanguage = () => {
    if (!statsBar) return;
    const english = document.documentElement.lang.toLowerCase().startsWith('en');
    const labels = english
      ? { projects: 'Completed Projects', experience: 'Years of Experience', certifications: 'Certifications', learning: 'Learning & Growing' }
      : { projects: 'Proyek Selesai', experience: 'Tahun Pengalaman', certifications: 'Sertifikasi', learning: 'Belajar & Berkembang' };
    statsBar.querySelectorAll('[data-stat-label]').forEach((label) => {
      label.textContent = labels[label.dataset.statLabel];
    });
  };
  updateStatsLanguage();

  // Ikuti bahasa tanpa mengubah handler theme.js.
  new MutationObserver(() => {
    updateAvailability();
    updateStatsLanguage();
  }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

  // Konten tetap tampil jika CDN tidak tersedia.
  const anime = window.anime;
  console.log("Anime.js loaded:", typeof anime !== "undefined");
  // Bundle IIFE v4 menyediakan object global, bukan fungsi anime({...}) v3.
  if (!anime || typeof anime.animate !== 'function' || typeof anime.createTimeline !== 'function') {
    console.warn('[Hero animation] Anime.js v4 tidak tersedia; konten tetap tersedia.');
    return;
  }
  const { animate, createTimeline, stagger } = anime;

  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const title = hero.querySelector('.hero-title-single');
  const summary = hero.querySelector('.hero-dark-summary');
  const buttons = Array.from(hero.querySelectorAll('.hero-banner-actions > a'));
  // Foto tetap statis; hanya badge dekoratif yang floating.
  const techBadges = Array.from(hero.querySelectorAll('.hero-tech-badge'));
  let badgeMotion;
  const startBadgeMotion = () => {
    if (!techBadges.length) return;
    badgeMotion = animate(techBadges, {
      translateY: [0, -8],
      duration: 3000,
      delay: stagger(650),
      ease: 'inOutSine',
      alternate: true,
      loop: true
    });
  };
  const entranceTargets = [title, summary, ...buttons, statsBar, ...statItems].filter(Boolean);
  let entrance;

  // Hapus style animasi setelah selesai agar hover tombol tetap bekerja normal.
  const clearEntrance = () => {
    entranceTargets.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
    });
  };

  if (!motionPreference.matches) {
    startBadgeMotion();
    // API timeline v4: targets dipisahkan dari parameter; animasi saling overlap halus.
    entrance = createTimeline({ defaults: { ease: 'outCubic', duration: 1000 }, onComplete: clearEntrance });
    entrance
      .add(title, { opacity: [0, 1], translateX: [-40, 0] }, 200)
      .add(summary, { opacity: [0, 1], translateY: [24, 0] }, 400)
      .add(buttons, { opacity: [0, 1], translateY: [18, 0], delay: stagger(180) }, 600);
    // Card naik perlahan, diikuti item statistik satu per satu melalui API v4.
    if (statsBar) {
      entrance
        .add(statsBar, { opacity: [0, 1], translateY: [24, 0], duration: 900 }, 950)
        .add(statItems, { opacity: [0, 1], translateY: [12, 0], duration: 700, delay: anime.stagger(160) }, 1350);
    }
  }

  // Hormati perubahan preferensi reduced motion, termasuk ketika halaman terbuka.
  motionPreference.addEventListener('change', () => {
    if (motionPreference.matches) {
      if (entrance) entrance.pause();
      clearEntrance();
      if (badgeMotion) badgeMotion.pause();
      techBadges.forEach((badge) => badge.style.removeProperty('transform'));
    } else {
      if (badgeMotion) badgeMotion.play();
      else startBadgeMotion();
    }
  });
})();
