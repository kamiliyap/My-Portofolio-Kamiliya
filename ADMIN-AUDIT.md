# Audit akhir Kamiliya Admin — 8 Oktober 2026

**Laporan terbaru setelah empat perbaikan:** lihat `FINAL-AUDIT.md` untuk hasil 60/60. Detail di bawah adalah histori sebelum perbaikan error kontak, pemetaan tema, view PDF public, serta proteksi/paket Git.

**Pembaruan konfigurasi:** sesuai instruksi terbaru, seluruh koneksi admin sekarang menggunakan database existing `portfolio_kamiliya`. SQL final hanya untuk pembuatan manual tabel `users` dan `projects` di phpMyAdmin. Tidak ada SQL yang dijalankan untuk pembaruan ini; tabel `contact_messages` dan struktur database aktif tidak diubah. Pengujian login/CRUD ditunda sampai pengguna mengonfirmasi tabel selesai dibuat. Bagian berikut adalah hasil historis sebelum perubahan nama database, bukan hasil pengujian ulang konfigurasi terbaru.

Implementasi admin telah selesai dan lulus pengujian HTTP/MariaDB terisolasi serta browser Edge headless. Database dan akun existing tidak diubah. Tidak ada push atau deployment.

**Batasan setup aktif:** akun MySQL existing ditolak saat mengakses/membuat `portfolio_db` (driver code 1044). Akun root tanpa password juga ditolak (1045). Karena itu database/tabel baru belum dapat dipasang pada MySQL aktif. Import `database/portfolio.sql` dengan akun berizin, grant akun aplikasi, lalu buat admin pertama. Tidak ada akun/password admin default.

## Day 8

Status mencakup kondisi workspace dan setup aktif. Database, skema, serta semua query terbukti berhasil pada MariaDB pengujian terisolasi; status konfigurasi aktif tetap ditandai perlu perbaikan sampai akses MySQL disiapkan.

| Requirement | Status | File | Bukti |
|---|---|---|---|
| 1. Database `portfolio_db` | ⚠️ PERLU PERBAIKAN | `database/portfolio.sql`, `connection.php` | DDL dan DSN menggunakan nama tersebut; pembuatan/import lulus di database uji. Akun MySQL aktif belum berizin. |
| 2. Tabel `projects` dan tujuh kolom wajib | ⚠️ PERLU PERBAIKAN | `database/portfolio.sql` | Skema teruji: `id` PK AUTO_INCREMENT, `title`, `description`, `tech`, `category`, `file_path`, `created_at`. Instalasi di database aktif menunggu izin. |
| 3. `connection.php` dan PDO | ✅ TERPENUHI | `connection.php` | PDO MySQL, `utf8mb4`, exception, associative fetch, native prepared statements. |
| 4. SELECT project dari database | ✅ TERPENUHI | `includes/admin-bootstrap.php`, `project-library.php`, `admin/projects.php` | Query SELECT database untuk daftar, detail, dan dashboard. Public `project.php` existing tetap dipertahankan sesuai instruksi. |
| 5. Looping PHP `foreach` | ✅ TERPENUHI | `includes/admin-layout.php`, `project-library.php` | Hasil SELECT dirender melalui `foreach`. |
| 6. Halaman tambah | ✅ TERPENUHI | `admin/add_project.php` | Halaman hanya dapat dibuka setelah login. |
| 7. Form judul/deskripsi/tech/kategori/file | ✅ TERPENUHI | `includes/admin-project-form.php` | Semua field tersedia; `multipart/form-data`, Simpan, Batal. |
| 8. INSERT | ✅ TERPENUHI | `admin/add_project.php` | Prepared INSERT teruji melalui HTTP multipart dan browser. |
| 9. `mkdir()` otomatis | ✅ TERPENUHI | `includes/project-storage.php` | Test menghapus folder uploads fixture; upload membuat ulang folder serta `.htaccess`. |
| 10. File di uploads dan relative `file_path` | ✅ TERPENUHI | `includes/project-storage.php`, `admin/add_project.php` | `move_uploaded_file()`, nama acak 128 bit, path `uploads/NAMA.ext`. |
| 11. Validasi input tidak kosong | ✅ TERPENUHI | `includes/project-storage.php` | Validasi tipe, trim, UTF-8, batas panjang; file wajib saat create. |
| 12. PDF/JPG/JPEG/PNG | ✅ TERPENUHI | `includes/project-storage.php` | Whitelist extension dan MIME `finfo`; file palsu ditolak, seluruh format valid diterima. |
| 13. Maksimal 2 MB | ✅ TERPENUHI | `includes/project-storage.php` | Ukuran aktual maksimum 2 × 1024 × 1024 byte; file kosong/terlalu besar ditolak. |
| 14. Pesan validasi jelas | ✅ TERPENUHI | `includes/project-storage.php`, `includes/admin-project-form.php` | Pesan input wajib, format, ukuran, dan kegagalan upload ditampilkan dengan escaping. |
| 15. Aksi hapus per project | ✅ TERPENUHI | `includes/admin-layout.php`, `assets/js/admin.js` | Modal menampilkan judul, warning permanen, Batal/Hapus. |
| 16. DELETE berdasarkan ID | ✅ TERPENUHI | `admin/delete_project.php` | ID integer positif, POST+CSRF, prepared DELETE, transaction/row lock. |
| 17. `unlink()` file terkait | ✅ TERPENUHI | `includes/project-storage.php`, `admin/delete_project.php` | File dihapus setelah commit; kegagalan filesystem dilog dan diberi warning. |
| 18. Download file project | ✅ TERPENUHI | `download-project.php`, `project-library.php` | Public/admin download berdasarkan ID; byte dan header attachment teruji. |
| 19. Kesiapan hosting | ⚠️ PERLU PERBAIKAN | `connection.php`, `config/portfolio.local.example.php`, `ADMIN-README.md` | Endpoint admin memakai base URL relatif dan aset lokal; environment config tersedia. Setup DB aktif, izin folder, HTTPS, serta proteksi Apache/Nginx harus diverifikasi di hosting. Tidak dideploy. |
| 20. Bonus Edit/UPDATE | ✅ TERPENUHI | `admin/edit_project.php` | Field lama terisi, upload opsional, prepared UPDATE; file lama dihapus setelah commit. |

**Ringkasan:** 16 dari 19 requirement wajib terpenuhi pada implementasi yang sudah diuji; 3 membutuhkan setup/validasi lingkungan aktif (1, 2, 19). Bonus Edit/Update terpenuhi. Tidak ada fitur wajib yang belum dibuat.

## Admin dan keamanan

| Requirement | Status | File | Bukti |
|---|---|---|---|
| Login tersembunyi | ✅ TERPENUHI | `admin-login.php` | Tidak ada perubahan navbar/footer atau penambahan link login public. |
| Show/hide password | ✅ TERPENUHI | `assets/js/admin.js` | Toggle input diuji di browser, label serta aria diperbarui. |
| Hash/verify password | ✅ TERPENUHI | `scripts/create-admin.php`, `admin-login.php` | Hash tersimpan, bukan plaintext; `password_verify`, rehash jika perlu. |
| Session regeneration | ✅ TERPENUHI | `admin-login.php` | Cookie session ID berubah setelah login berhasil. |
| Tabel `users` | ✅ TERPENUHI | `database/portfolio.sql` | Skema id PK AUTO_INCREMENT, username UNIQUE, password VARCHAR(255), created_at; teruji pada DB terisolasi. |
| Session protection | ✅ TERPENUHI | `includes/admin-bootstrap.php`, semua `admin/*.php` | Semua endpoint admin menolak guest; strict session, idle timeout 30 menit, HttpOnly, SameSite, Secure saat HTTPS. |
| Dashboard/sidebar/statistik | ✅ TERPENUHI | `admin/dashboard.php`, `includes/admin-layout.php` | Statistik berdasarkan SELECT, tabel terbaru, menu Dashboard/Projects/Tambah/Logout. |
| Detail | ✅ TERPENUHI | `admin/detail_project.php` | Title, description, tech, category, created_at, file dan aksi tersedia. |
| CSRF CRUD/login/logout | ✅ TERPENUHI | `includes/admin-bootstrap.php`, handler POST | Request dengan token salah ditolak 403; GET tidak dapat delete/logout. |
| Prepared statements/injection | ✅ TERPENUHI | `includes/admin-bootstrap.php`, handler CRUD, `scripts/create-admin.php` | Semua query PHP baru memakai prepare/execute; payload SQL login ditolak. |
| Output escaping | ✅ TERPENUHI | `includes/admin-layout.php`, form/detail/library | `htmlspecialchars` ENT_QUOTES+ENT_SUBSTITUTE; payload script tampil sebagai teks pada semua tampilan data. |
| Path traversal | ✅ TERPENUHI | `download-project.php`, `includes/project-storage.php` | Tidak menerima path request; regex relative path, realpath containment, penolakan symlink; traversal ID/path DB ditolak. |
| Cleanup saat query gagal | ✅ TERPENUHI | `admin/add_project.php`, `admin/edit_project.php` | Test kegagalan INSERT membersihkan file baru; kegagalan UPDATE rollback, file lama bertahan, file baru dibersihkan. |
| Aman saat DELETE gagal | ✅ TERPENUHI | `admin/delete_project.php` | Test kegagalan DELETE rollback tanpa unlink file. |
| Error DB umum + server log | ✅ TERPENUHI | `includes/admin-bootstrap.php`, handler CRUD/login | Error user tidak memuat SQLSTATE/exception; detail masuk server log. Berlaku untuk kode baru; handler kontak existing tidak diubah. |
| Logout session cleanup | ✅ TERPENUHI | `logout.php` | Session dikosongkan/dihancurkan, cookie dihapus; akses dashboard setelah logout ditolak. |
| Public Read/Download saja | ✅ TERPENUHI | `project-library.php`, `download-project.php` | Endpoint public tidak memiliki mutation; endpoint CRUD memerlukan login. |
| Light/dark/responsive | ✅ TERPENUHI | `assets/css/admin.css`, `assets/js/admin.js` | Browser memverifikasi light headings, tema, modal, upload, logout dan tabel scroll mobile tanpa overflow halaman. |

## Verifikasi

- Lint seluruh 37 file PHP dan `navbar.html` berhasil menggunakan PHP 8.2.12.
- `node --check` admin JS dan browser test berhasil.
- Pengujian HTTP menggunakan `E_ALL` tidak mencatat PHP warning, fatal, notice, parse error, atau deprecation.
- Pengujian browser Edge headless tidak mencatat uncaught JavaScript exception.
- Test mencakup validasi upload, CSRF, injection, traversal, session, query failure/rollback/cleanup, download dan CRUD sukses.
- Login, asset URL, dashboard, library public, dan logout juga diuji dengan aplikasi dipasang pada subfolder, sesuai struktur URL XAMPP project.
- Delapan halaman public existing tetap HTTP 200 dan memuat robot assistant serta language switch. File tracked public, CSS/JS existing, dan koneksi kontak tidak diubah. Integrasi berjalan pada salinan temporary, dengan pemeriksaan hash file workspace.
- Pemeriksaan ini tidak menyatakan semua cabang fitur public sudah diuji secara end-to-end; jalur kirim kontak existing tidak diuji INSERT agar data kontak tidak berubah.
- Proteksi `.htaccess` perlu diverifikasi melalui Apache/hosting; server PHP built-in pengujian tidak menjalankan `.htaccess`.
- Login limiter saat ini per session. Untuk deployment publik, rate limit IP pada web server disarankan sesuai petunjuk setup.

## File baru

```text
connection.php
admin-login.php
logout.php
download-project.php
project-library.php
admin/dashboard.php
admin/projects.php
admin/add_project.php
admin/edit_project.php
admin/detail_project.php
admin/delete_project.php
includes/admin-bootstrap.php
includes/admin-layout.php
includes/admin-project-form.php
includes/project-storage.php
assets/css/admin.css
assets/js/admin.js
config/portfolio.local.example.php
config/portfolio.local.php (privat, diabaikan Git)
database/portfolio.sql
database/.htaccess
scripts/create-admin.php
scripts/create-admin.ps1
scripts/.htaccess
uploads/.htaccess
tests/admin_integration.py
tests/admin_browser.mjs
tests/.htaccess
ADMIN-README.md
ADMIN-AUDIT.md
```

File existing yang diubah hanya `.gitignore` untuk mengabaikan konfigurasi privat dan upload. Semua halaman public existing dipertahankan. Screenshot pengujian berada di temporary directory `kamiliya-admin-preview`.
