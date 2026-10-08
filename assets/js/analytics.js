// Dashboard terisolasi: tidak mengubah global theme.js, robot, atau hero.
(() => {
  'use strict';
  const root = document.querySelector('.analytics-page');
  if (!root) return;
  const skills = [
    { name: 'PHP', value: 85 }, { name: 'MySQL', value: 85 },
    { name: 'Laravel', value: 80 }, { name: 'JavaScript', value: 75 },
    { name: 'React', value: 65 }, { name: 'Flutter', value: 60 }
  ];
  const learningProgress = [
    { month: 'Apr', value: 45 }, { month: 'May', value: 55 },
    { month: 'Jun', value: 62 }, { month: 'Jul', value: 70 },
    { month: 'Aug', value: 78 }, { month: 'Sep', value: 85 }, { month: 'Oct', value: 90 }
  ];
  const projects = ['Sales Order System', 'SDIT Report System', 'TKIT Finance', 'Portfolio', 'OveerPeople'];
  // Contoh data tugas: 1 = digunakan, 0 = tidak digunakan; bukan persentase.
  const technologies = [
    { name: 'PHP', values: [1, 1, 1, 1, 0] },
    { name: 'JavaScript', values: [1, 1, 1, 1, 1] },
    { name: 'MySQL', values: [1, 1, 1, 1, 1] },
    { name: 'Laravel', values: [0, 1, 1, 0, 1] },
    { name: 'React', values: [0, 0, 0, 0, 1] },
    { name: 'Flutter', values: [0, 0, 0, 0, 1] }
  ];
  const difficulty = [
    { x: 4, y: 65, project: 'Portfolio' }, { x: 8, y: 90, project: 'Sales Order' },
    { x: 6, y: 85, project: 'SDIT Report' }, { x: 5, y: 78, project: 'TKIT Finance' },
    { x: 3, y: 70, project: 'OveerPeople' }
  ];
  const copy = {
    en: {
      subtitle: 'A visual overview of my skills, projects, and continuous learning journey.',
      projects: 'Completed Projects', technologies: 'Technologies', certifications: 'Certifications', experience: 'Years Experience',
      refresh: 'Refresh Analytics', advanced: 'Advanced Analytics', skillsTitle: 'Skill Overview', categoriesTitle: 'Project Categories', learningTitle: 'Learning Progress', technologyTitle: 'Technology by Project', difficultyTitle: 'Project Difficulty vs Duration',
      note: 'Bootcamp dataset · Illustrative project categories and technology usage.',
      skillsNote: 'Skill score / 100 · Blue ≥ 80 · Purple ≥ 65 · Teal < 65.',
      categoriesNote: '10 category entries in the assignment dataset; separate from the portfolio summary.',
      learningNote: 'Learning score / 100 · April–October.',
      technologyNote: 'Illustrative usage: each segment = one technology used in a project.',
      difficultyNote: 'Hover over a point to see the project, duration, and complexity.',
      score: 'Score', weeks: 'Duration (weeks)', complexity: 'Complexity score', count: 'Technologies used',
      categories: ['Web Application', 'Dashboard', 'Mobile Application', 'School System'],
      months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
      refreshed: 'Analytics refreshed', error: 'Charts could not load. Check your connection and reload.',
      sorted: 'Skills sorted by score', original: 'Original skill order restored'
    },
    id: {
      subtitle: 'Gambaran visual tentang keahlian, proyek, dan perjalanan belajar saya.',
      projects: 'Proyek Selesai', technologies: 'Teknologi', certifications: 'Sertifikasi', experience: 'Tahun Pengalaman',
      refresh: 'Perbarui Analytics', advanced: 'Analitik Lanjutan', skillsTitle: 'Ringkasan Keahlian', categoriesTitle: 'Kategori Proyek', learningTitle: 'Perkembangan Belajar', technologyTitle: 'Teknologi per Proyek', difficultyTitle: 'Kesulitan vs Durasi Proyek',
      note: 'Dataset bootcamp · Contoh kategori proyek dan pemakaian teknologi.',
      skillsNote: 'Skor keahlian / 100 · Biru ≥ 80 · Ungu ≥ 65 · Toska < 65.',
      categoriesNote: '10 entri kategori pada dataset tugas; terpisah dari ringkasan portofolio.',
      learningNote: 'Skor belajar / 100 · April–Oktober.',
      technologyNote: 'Contoh pemakaian: setiap segmen = satu teknologi yang digunakan dalam proyek.',
      difficultyNote: 'Arahkan kursor ke titik untuk melihat proyek, durasi, dan kompleksitas.',
      score: 'Skor', weeks: 'Durasi (minggu)', complexity: 'Skor kompleksitas', count: 'Teknologi digunakan',
      categories: ['Aplikasi Web', 'Dashboard', 'Aplikasi Mobile', 'Sistem Sekolah'],
      months: ['Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt'],
      refreshed: 'Analytics diperbarui', error: 'Grafik gagal dimuat. Periksa koneksi lalu muat ulang halaman.',
      sorted: 'Keahlian diurutkan berdasarkan skor', original: 'Urutan awal keahlian dipulihkan'
    }
  };
  const text = () => copy[document.documentElement.lang.startsWith('en') ? 'en' : 'id'];
  const status = document.getElementById('analytics-status');
  const refreshButton = document.getElementById('refresh-analytics');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const charts = [];
  let refreshCount = 0;
  let sorted = false;
  const updateText = () => {
    root.querySelectorAll('[data-analytics]').forEach((element) => {
      element.textContent = text()[element.dataset.analytics];
    });
    status.textContent = refreshCount ? `${text().refreshed} (${refreshCount}) · ${sorted ? text().sorted : text().original}` : '';
  };
  updateText();

  // Anime.js v3.2.2 estetik saja; konten tidak disembunyikan jika CDN gagal.
  const animatedElements = root.querySelectorAll('.analytics-summary-card, .analytics-chart-card');
  if (typeof window.anime === 'function' && !reducedMotion.matches) {
    window.anime({ targets: root.querySelectorAll('.analytics-summary-card'), opacity: [0, 1], translateY: [14, 0], delay: window.anime.stagger(100), duration: 850, easing: 'easeOutQuad' });
    window.anime({ targets: root.querySelectorAll('.analytics-chart-card'), opacity: [0, 1], translateY: [22, 0], delay: window.anime.stagger(120, { start: 250 }), duration: 950, easing: 'easeOutQuad' });
  }
  if (typeof window.Chart !== 'function') {
    status.textContent = text().error;
    refreshButton.disabled = true;
    new MutationObserver(() => { updateText(); status.textContent = text().error; }).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return;
  }
  const palette = ['#3b82f6', '#a78bfa', '#2dd4bf', '#f472b6', '#fbbf24', '#38bdf8'];
  const options = (legend = false) => ({
    responsive: true, maintainAspectRatio: false,
    animation: reducedMotion.matches ? false : { duration: 700 },
    plugins: { legend: { display: legend, position: 'bottom', labels: { usePointStyle: true, boxWidth: 10, padding: 16 } } }
  });
  const makeChart = (id, type, data, extra = {}, legend = false) => {
    const chart = new window.Chart(document.getElementById(`${id}-chart`), { type, data, options: { ...options(legend), ...extra } });
    charts.push(chart);
    return chart;
  };
  // Scriptable Option: warna dihitung dari nilai, bukan daftar warna per skill.
  const skillColor = (context) => {
    const value = context.parsed ? context.parsed.y : 0;
    if (value >= 80) return palette[0];
    else if (value >= 65) return palette[1];
    else return palette[2];
  };
  const skillChart = makeChart('skills', 'bar', {
    labels: skills.map((skill) => skill.name),
    datasets: [{ label: text().score, data: skills.map((skill) => skill.value), backgroundColor: skillColor, borderRadius: 7 }]
  }, { scales: { y: { beginAtZero: true, max: 100 } } });
  const categoryChart = makeChart('categories', 'doughnut', {
    labels: text().categories,
    datasets: [{ data: [4, 3, 1, 2], backgroundColor: palette.slice(0, 4), borderWidth: 0, hoverOffset: 6 }]
  }, { cutout: '66%' }, true);
  const learningChart = makeChart('learning', 'line', {
    labels: text().months,
    datasets: [{ label: text().score, data: learningProgress.map((entry) => entry.value), borderColor: palette[0], backgroundColor: 'rgba(59,130,246,0.12)', fill: true, tension: 0.35, pointRadius: 4 }]
  }, { scales: { y: { beginAtZero: true, max: 100 } } });
  const technologyChart = makeChart('technology', 'bar', {
    labels: projects,
    datasets: technologies.map((technology, index) => ({ label: technology.name, data: technology.values, backgroundColor: palette[index], borderRadius: 3 }))
  }, { indexAxis: 'y', scales: { x: { stacked: true, beginAtZero: true, ticks: { stepSize: 1 }, title: { display: true, text: text().count } }, y: { stacked: true } } }, true);
  const scatterChart = makeChart('difficulty', 'scatter', {
    datasets: [{ label: text().complexity, data: difficulty, backgroundColor: palette[1], pointRadius: 7, pointHoverRadius: 9 }]
  }, {
    scales: { x: { beginAtZero: true, title: { display: true, text: text().weeks } }, y: { beginAtZero: true, max: 100, title: { display: true, text: text().complexity } } },
    plugins: { legend: { display: false }, tooltip: { callbacks: {
      label: (context) => `${context.raw.project}: ${context.raw.x} ${text().weeks.toLowerCase()}, ${text().complexity.toLowerCase()}: ${context.raw.y}`
    } } }
  });

  // Canvas perlu diperbarui eksplisit saat bahasa atau tema berubah.
  const syncCharts = () => {
    updateText();
    categoryChart.data.labels = text().categories;
    learningChart.data.labels = text().months;
    skillChart.data.datasets[0].label = text().score;
    learningChart.data.datasets[0].label = text().score;
    technologyChart.options.scales.x.title.text = text().count;
    scatterChart.options.scales.x.title.text = text().weeks;
    scatterChart.options.scales.y.title.text = text().complexity;
    scatterChart.data.datasets[0].label = text().complexity;
    const dark = document.body.classList.contains('dark');
    const color = dark ? '#d8d5ef' : '#52617c';
    charts.forEach((chart) => {
      chart.options.color = color;
      if (chart.options.plugins.legend) chart.options.plugins.legend.labels.color = color;
      Object.values(chart.options.scales || {}).forEach((scale) => {
        scale.ticks.color = color;
        scale.grid.color = dark ? 'rgba(190,180,240,0.12)' : 'rgba(100,130,170,0.12)';
        scale.title.color = color;
      });
      // Fallback canvas berisi data untuk pembaca layar.
      chart.canvas.textContent = chart.data.labels
        ? chart.data.labels.map((label, index) => `${label}: ${chart.data.datasets.map((dataset) => `${dataset.label || ''} ${dataset.data[index]}`).join(', ')}`).join('; ')
        : difficulty.map((point) => `${point.project}: ${point.x}, ${point.y}`).join('; ');
      chart.update('none');
    });
  };
  syncCharts();
  new MutationObserver(syncCharts).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  new MutationObserver(syncCharts).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // Programmatic event: urutan berubah tanpa memalsukan nilai pencapaian.
  refreshButton.addEventListener('click', () => {
    sorted = !sorted;
    let refreshedSkills = [...skills];
    if (sorted) refreshedSkills.sort((a, b) => a.value - b.value);
    skillChart.data.labels = refreshedSkills.map((skill) => skill.name);
    skillChart.data.datasets[0].data = refreshedSkills.map((skill) => skill.value);
    skillChart.update();
    refreshCount += 1;
    updateText();
    console.log('[Analytics] Refresh Analytics', { refreshCount, sorted, skills: refreshedSkills });
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches && typeof window.anime === 'function') {
      window.anime.remove(animatedElements);
      animatedElements.forEach((element) => { element.style.removeProperty('opacity'); element.style.removeProperty('transform'); });
    }
    charts.forEach((chart) => { chart.options.animation = reducedMotion.matches ? false : { duration: 700 }; chart.update('none'); });
  });
  console.log('[Analytics] Loaded', { charts: charts.length, chartVersion: window.Chart.version, animeVersion: window.anime?.version });
})();
