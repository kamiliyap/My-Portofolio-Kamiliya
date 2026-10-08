# Audit ulang Day 8 — empat perbaikan final

Hasil: **60/60 TERPENUHI**, **0 PERLU PERBAIKAN**, **0 BELUM ADA** dalam rubric yang diminta. Dua belas skenario functional test lulus; bonus Edit/Update tetap terpenuhi. Kesiapan pengumpulan berdasarkan rubric: **100%**. Penilaian ini untuk implementasi dan lingkungan lokal yang diuji, bukan verifikasi konfigurasi Hostinger yang belum dideploy.

Perubahan hanya mencakup error kontak, pemetaan tema bersama, preview PDF public, dan proteksi/paket deployment tanpa Git. Tidak ada fitur admin baru, perubahan skema database, Git push, atau deployment.

## Empat temuan

- Kontak: exception dicatat melalui error_log; pengunjung mendapat pesan umum ID/EN. Kegagalan disimulasikan dengan konfigurasi test terisolasi. Detail PDO hanya muncul di log; input dipertahankan dan redirect 303 tetap bekerja. Alur INSERT sukses, pengosongan isian, dan feedback lama juga lulus.
- Tema: public/admin menggunakan assets/js/site-theme.js, key localStorage theme, serta mapping light=terang/dark=gelap. Preferensi public lama dimigrasikan sekali untuk mempertahankan palet yang sebelumnya terlihat. Warna/rules CSS existing dibandingkan dengan baseline: tetap sama, kecuali nama selector tema dan wrapper aksi PDF.
- PDF: placeholder tetap bukan img; tombol Lihat PDF menggunakan ID dan view=1, membuka file dengan Content-Disposition inline. Download attachment admin tetap bekerja. Gambar public tetap thumbnail tanpa tombol unduh.
- Git: Apache mengembalikan 403 untuk .git/HEAD, .git/config, .GIT/HEAD, dan %2egit/HEAD. project.php tetap 200. Paket lokal dari scripts/build-deploy.ps1 mengecualikan .git, konfigurasi privat, development tools, tests, database scripts, dan dokumentasi internal. Proteksi .htaccess tetap disertakan.

## 60 requirement

| No | Requirement | Status | File terkait | Bukti | Masalah | Rekomendasi |
|---|---|---|---|---|---|---|
| 1 | Database portfolio_kamiliya | ✅ TERPENUHI | connection.php; config/database.php | Koneksi/database aktif terverifikasi. | — | — |
| 2 | contact_messages tetap utuh | ✅ TERPENUHI | Database aktif | Lima record existing tetap sama setelah tes. | — | — |
| 3 | projects dan kolom wajib | ✅ TERPENUHI | Database; database/portfolio.sql | Tujuh kolom wajib, PK AUTO_INCREMENT; demo_url tambahan tersedia. | — | — |
| 4 | users dan kolom wajib | ✅ TERPENUHI | Database; database/portfolio.sql | id, username UNIQUE, password VARCHAR(255), created_at. | — | — |
| 5 | PDO/prepared dan credential privat | ✅ TERPENUHI | connection.php; config/database.php; contact-handler.php | Native prepare, secret diabaikan Git, HTTP config 403; error detail hanya log. | — | Konfigurasi privat tetap perlu disiapkan di hosting. |
| 6 | Login tersembunyi dari navbar/footer | ✅ TERPENUHI | navbar.html; footer.php | Tidak ada link login admin public. | — | — |
| 7 | Login melalui URL langsung | ✅ TERPENUHI | admin-login.php | Endpoint langsung tersedia. | — | — |
| 8 | password_hash/password_verify | ✅ TERPENUHI | scripts/create-admin.php; admin-login.php | Hash bcrypt dan login aktual terverifikasi. | — | — |
| 9 | Session aman/regenerasi | ✅ TERPENUHI | admin-bootstrap.php; admin-login.php | Strict mode, HttpOnly, SameSite, Secure saat HTTPS; ID berubah setelah login. | — | Verifikasi HTTPS pada hosting. |
| 10 | Seluruh admin terlindungi | ✅ TERPENUHI | admin/*.php | Enam endpoint redirect guest ke login. | — | — |
| 11 | Logout menghancurkan session | ✅ TERPENUHI | logout.php | Cookie/session dibersihkan; replay session lama ditolak. | — | — |
| 12 | Dashboard mengambil database | ✅ TERPENUHI | admin/dashboard.php; admin-bootstrap.php | Statistik dan daftar memakai SELECT. | — | — |
| 13 | Tambah INSERT | ✅ TERPENUHI | admin/add_project.php | Form multipart berhasil membuat record uji. | — | — |
| 14 | Edit UPDATE | ✅ TERPENUHI | admin/edit_project.php | Field dan penggantian file berhasil. | — | — |
| 15 | Hapus DELETE | ✅ TERPENUHI | admin/delete_project.php | Record uji dihapus melalui endpoint. | — | — |
| 16 | Prepared statement project | ✅ TERPENUHI | Handler CRUD dan endpoint public | Seluruh query memakai prepare/execute; ekspresi kolom demo hanya dua konstanta. | — | — |
| 17 | Delete POST | ✅ TERPENUHI | admin/delete_project.php | GET delete menghasilkan 405. | — | — |
| 18 | CSRF Create/Edit/Delete | ✅ TERPENUHI | Bootstrap dan handler CRUD | Token salah ditolak 403 pada ketiga aksi. | — | — |
| 19 | mkdir otomatis | ✅ TERPENUHI | project-storage.php | Guard !is_dir memanggil mkdir; proteksi folder dibuat bila belum ada. | — | Pastikan izin folder pada hosting. |
| 20 | move_uploaded_file | ✅ TERPENUHI | project-storage.php | File upload menjadi file fisik. | — | — |
| 21 | Nama file unik | ✅ TERPENUHI | project-storage.php | Nama acak 128 bit/32 karakter hex. | — | — |
| 22 | Maksimal 2 MB | ✅ TERPENUHI | project-storage.php | Ukuran aktual dibatasi; file terlalu besar ditolak. | — | — |
| 23 | PDF/JPG/JPEG/PNG | ✅ TERPENUHI | project-storage.php | Whitelist extension; PHP ditolak. | — | — |
| 24 | Extension dan finfo MIME | ✅ TERPENUHI | project-storage.php | PNG palsu berisi teks ditolak. | — | — |
| 25 | Path relatif | ✅ TERPENUHI | Storage dan CRUD | uploads/nama-unik.ext terverifikasi. | — | — |
| 26 | Delete ikut unlink file | ✅ TERPENUHI | Delete dan storage | File fisik tidak ada setelah delete. | — | — |
| 27 | Update membersihkan file lama | ✅ TERPENUHI | admin/edit_project.php | PNG lama hilang setelah update ke PDF dikomit. | — | — |
| 28 | Proteksi traversal | ✅ TERPENUHI | project-storage.php; endpoint file | Regex, realpath, symlink guard; payload traversal ditolak. | — | — |
| 29 | Download file tersedia | ✅ TERPENUHI | download-project.php; UI admin | Byte PNG/PDF cocok dengan file fisik. | — | — |
| 30 | Download berdasarkan ID | ✅ TERPENUHI | download-project.php | ID divalidasi; path mentah tidak diterima. | — | — |
| 31 | PDF/gambar ditangani benar | ✅ TERPENUHI | Download/image endpoint | MIME sesuai; thumbnail menolak PDF; view inline hanya PDF. | — | — |
| 32 | Public SELECT projects | ✅ TERPENUHI | project.php; public-projects.php | Prepared SELECT pada setiap request. | — | — |
| 33 | Tambah muncul public | ✅ TERPENUHI | Loader/renderer public | Project uji muncul saat halaman dimuat ulang. | — | — |
| 34 | Edit muncul public | ✅ TERPENUHI | Loader/renderer public | Judul, deskripsi, tech, kategori, demo mengikuti UPDATE. | — | — |
| 35 | Delete hilang public | ✅ TERPENUHI | Loader/renderer public | Card uji hilang setelah DELETE. | — | — |
| 36 | foreach | ✅ TERPENUHI | portfolio-functions.php | Loop card/badge menggunakan foreach. | — | — |
| 37 | htmlspecialchars | ✅ TERPENUHI | Renderer dan template | Output HTML/script ter-escape. | — | — |
| 38 | Gambar menjadi thumbnail | ✅ TERPENUHI | project-image.php; public loader | PNG terdekode browser dan byte/MIME valid. | — | — |
| 39 | PDF bukan img, view tersedia | ✅ TERPENUHI | Public loader/renderer; download-project.php | Placeholder PDF + Lihat PDF; inline header dan byte PDF terverifikasi. | — | — |
| 40 | Desain public tetap utuh | ✅ TERPENUHI | CSS public; navbar/footer | Rules/warna/layout baseline sama setelah normalisasi selector; wrapper PDF memakai button existing. | — | — |
| 41 | Account di topbar kanan | ✅ TERPENUHI | admin-layout.php | Browser memverifikasi dropdown account. | — | — |
| 42 | Sidebar menu utama saja | ✅ TERPENUHI | admin-layout.php | Dashboard, Projects, Tambah Project; account di dropdown. | — | — |
| 43 | Dashboard responsive | ✅ TERPENUHI | admin.css | Dashboard diuji 320/390 px tanpa overflow halaman. | — | — |
| 44 | Tema admin/public sinkron | ✅ TERPENUHI | site-theme.js; theme.js; admin.js; CSS | Light kedua halaman #f3f6fb; state dark dibawa public ke admin; migrasi hanya sekali. | — | — |
| 45 | Modal hapus | ✅ TERPENUHI | Admin layout/JS | Modal berisi nama project; Batal bekerja. | — | — |
| 46 | Modal logout | ✅ TERPENUHI | Admin layout/JS; logout.php | Modal terbuka; logout berhasil. | — | — |
| 47 | Robot assistant | ✅ TERPENUHI | robot-assistant.js/CSS | Wake dan pesan tetap berfungsi. | — | — |
| 48 | Analytics | ✅ TERPENUHI | analytics.js; analytics.php | Lima chart dan refresh bekerja; warna mengikuti kelas dark baru. | — | — |
| 49 | Contact form | ✅ TERPENUHI | contact.php; contact-handler.php | INSERT sukses, redirect 303, input kosong dan feedback sukses lama; validasi tetap bekerja. | — | — |
| 50 | ID/EN | ✅ TERPENUHI | theme.js; contact messages | Switch bahasa/label demo dan pesan error ID/EN lulus. | — | — |
| 51 | Tema public | ✅ TERPENUHI | site-theme.js; theme.js | Toggle canonical light/dark dan state persisten bekerja. | — | — |
| 52 | Download CV | ✅ TERPENUHI | download-cv.php | HTTP 200/attachment, byte sesuai PDF sumber. | — | — |
| 53 | Navbar public | ✅ TERPENUHI | navbar.html; theme.js | Menu mobile membuka dan memperbarui aria-expanded. | — | — |
| 54 | php -l seluruh PHP | ✅ TERPENUHI | 41 PHP + navbar.html | Semua lulus dengan PHP 8.2.12. | — | — |
| 55 | E_ALL | ✅ TERPENUHI | Halaman public/admin | GET, login, CRUD, download, logout, kontak sukses/gagal diuji. | — | — |
| 56 | Tanpa warning/fatal | ✅ TERPENUHI | Log tes | Tidak ada warning/fatal/notice/deprecation pada jalur yang diuji. | — | — |
| 57 | Exception DB tidak tampil | ✅ TERPENUHI | contact-handler.php dan handler lainnya | Fault PDO canary hanya ada dalam server log, tidak di HTML; generic flash message tampil. | — | — |
| 58 | Mitigasi SQL injection | ✅ TERPENUHI | Query aplikasi | Prepared statements; payload SQL login ditolak. | — | — |
| 59 | Mitigasi stored XSS | ✅ TERPENUHI | Renderer dan validator URL | Payload HTML/script tampil sebagai teks; window.auditXss tidak terbentuk. | — | — |
| 60 | Upload tidak mengeksekusi script | ✅ TERPENUHI | uploads/.htaccess; validator | Direct upload HTTP 403; file PHP/fake MIME ditolak. | — | Verifikasi proteksi server hosting sebelum publikasi. |

## Functional test dan batas scope

Login → tambah PNG → tampil admin/public → edit → public berubah → download → ganti PDF/view → hapus → file fisik hilang → card hilang → logout → akses admin/replay cookie ditolak. Semua lulus.

Project/pesan kontak sementara dibersihkan; data existing tetap 1 project dan 5 pesan kontak. Tidak ada CREATE/ALTER/DROP selama perbaikan/pengujian. Paket ZIP disiapkan lokal saja, tidak di-upload. Konfigurasi database privat memang tidak disertakan dalam ZIP dan harus disiapkan terpisah saat deployment diizinkan.

Pembatasan login berbasis IP yang disebut dalam audit sebelumnya tidak diubah karena bukan bagian dari empat temuan yang diminta. Pemeriksaan hosting aktual tetap dilakukan pada tahap deployment nanti.
