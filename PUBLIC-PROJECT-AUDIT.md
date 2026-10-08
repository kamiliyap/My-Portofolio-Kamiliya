# Sinkronisasi admin → public project

**Status terbaru:** gambar tetap thumbnail tanpa unduh; PDF mendapat Lihat PDF (inline, berdasarkan ID). Tema public/admin kini menggunakan state canonical bersama. Audit ulang lengkap ada di `FINAL-AUDIT.md`; paragraf berikut merupakan histori perubahan sebelumnya.

Pembaruan video demo: field link opsional dan tombol Video Demo sudah disiapkan untuk Google Drive/YouTube. Tidak ada tombol unduh pada card project database. Kolom `projects.demo_url` harus ditambahkan manual dengan `database/add-demo-url.sql`; kolom belum ditemukan saat pemeriksaan sehingga penyimpanan link belum diuji pada database aktif. Pemeriksaan sintaks, validasi URL, escaping tombol, dan fallback query tanpa kolom berhasil. Tidak ada perubahan skema database yang dijalankan.

Pembaruan terbaru: tombol public sekarang `Unduh Rekap Data`, menuju `download-project-recap.php?id=...`. Export CSV berisi ID, judul, deskripsi, teknologi, kategori, dan tanggal dibuat; tidak berisi file gambar atau path upload. Thumbnail tetap digunakan untuk tampilan. Library public juga memakai tombol rekap; download file di admin tetap tersedia. Verifikasi HTTP read-only berhasil untuk isi/header CSV, ID/EN, ID tidak valid, dan project tidak ditemukan. Tidak ada penulisan database pada pembaruan ini. Catatan pengujian file di bawah merupakan hasil sebelum perubahan tombol menjadi rekap.

`project.php` sekarang melakukan prepared SELECT pada `portfolio_kamiliya.projects` setiap request dan menggunakan card/looping existing. Data database terbaru tampil lebih dahulu, lalu tiga project static lama tetap ditampilkan tanpa perubahan data, migrasi otomatis, atau penghapusan. Halaman menggunakan `Cache-Control: no-store` agar hasil edit dan file pengganti tidak tertahan cache.

Mapping: title → judul, description → deskripsi, tech (pemisah koma/titik koma/baris baru) → badge teknologi, category → label kategori. JPG/JPEG/PNG ditampilkan melalui `project-image.php?id=...`; PDF memakai placeholder dokumen dan tombol download existing. `created_at` digunakan untuk urutan, tanpa menambahkan tanggal pada desain.

Endpoint gambar hanya menerima ID integer positif, melakukan prepared SELECT, membatasi path ke uploads dengan regex/realpath dan penolakan symlink, serta memverifikasi MIME gambar aktual. PDF dan path mentah ditolak. Semua output data dalam card memakai `htmlspecialchars`. Kegagalan database dilog server-side; public mendapat pesan umum dan tetap dapat melihat showcase static.

Key i18n static tidak dipasang pada judul/deskripsi/kategori database, sehingga language switch tidak menimpa isi project dari admin. Label download/pesan ketersediaan diberi terjemahan ID/EN. CSS, navbar, footer, robot assistant, analytics, kontak, dan data static tidak diubah.

| Pengujian | Hasil |
|---|---|
| Login dengan akun admin existing | Lulus |
| Tambah lewat admin dengan PNG → tampil di `project.php` | Lulus |
| Edit judul/deskripsi/tech/kategori → public mengikuti | Lulus |
| Ganti PNG menjadi PDF → download, tanpa img | Lulus |
| Ganti PDF menjadi JPEG → preview dan MIME mengikuti | Lulus |
| Hapus lewat admin → card, upload, dan endpoint file hilang | Lulus |
| File download dan preview berdasarkan ID | Lulus |
| Traversal ID/path mentah | Ditolak |
| Payload HTML/script pada data project | Tampil sebagai teks; tidak dieksekusi |
| Browser ID/EN, tema, robot/navbar, decoding thumbnail | Lulus |
| Tiga card static tetap utuh setelah CRUD | Lulus |
| Data project existing dan jumlah contact_messages sebelum/sesudah | Sama |
| PHP E_ALL: warning/fatal/notice/deprecation | Tidak ditemukan |
| Lint seluruh 39 file PHP dan navbar.html | Lulus |

Test menggunakan satu project sementara pada database existing melalui form admin dan membersihkannya setelah selesai. Tidak ada CREATE/ALTER/DROP, import skema, push Git, atau deploy.

File yang diubah: `project.php`, `includes/portfolio-functions.php`, `assets/js/theme.js` (hanya key terjemahan baru), dan dokumentasi admin. File baru: `includes/public-projects.php`, `project-image.php`, `tests/public_project_sync.py`, dan laporan ini.
