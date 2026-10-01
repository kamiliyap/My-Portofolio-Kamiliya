# Robot Portfolio Assistant

Komponen baru dimuat melalui `footer.php` dan `includes/robot-assistant.php`.
Logic dibuat independen di `assets/js/robot-assistant.js`; gaya di
`assets/css/robot-assistant.css`. File robot lama tidak lagi dimuat.

Anime.js resmi 3.2.2 disimpan tanpa modifikasi di
`assets/js/vendor/anime-3.2.2.es.js`, sumber:
https://cdn.jsdelivr.net/npm/animejs@3.2.2/lib/anime.es.js
Lisensi MIT tercantum di file. Import module tidak mengubah `window.anime`
yang dipakai hero v4 dan Analytics v3.

Asset PNG di `assets/robot/` tetap asli. Perkenalan ada di method `story()`;
teks UI ada di `renderControls()`; greeting native ada di `greeting()`.
Suara hanya dimulai dari klik tombol, dengan bahasa mengikuti ID/EN.
Bubble diperbarui per kalimat/segmen menggunakan event speech `end`.
Stop, close, pergantian bahasa, navigasi, dan tab tersembunyi membatalkan suara.
Jika API/mesin suara tidak tersedia, semua narasi tersedia sebagai teks.
Ketersediaan suara dan pelafalan bergantung pada browser serta voice OS.

Hover memberi ekspresi love; double click, double tap, atau Enter/Space
memberi ekspresi surprised. Ekspresi tidak menyela speech. Escape menutup
panel. Tombol pembuka memungkinkan pengguna menampilkan kembali assistant.
Reduced motion menghentikan animasi dekoratif.
