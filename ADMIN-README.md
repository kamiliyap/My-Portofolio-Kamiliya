# Kamiliya Admin

Area admin terpisah; navbar/footer, database kontak, robot, analytics, dan language switch dipertahankan. Perbaikan terakhir mencakup error kontak, pemetaan tema bersama, view PDF public, dan proteksi Git.

## Setup database

1. Gunakan database existing `portfolio_kamiliya`. Pengguna membuat tabel `users` dan `projects` sendiri di phpMyAdmin dengan SQL dalam `database/portfolio.sql`. Tidak membuat database baru, tidak menjalankan import otomatis, dan tidak mengubah tabel `contact_messages`.
2. Setup lokal ini menggunakan `config/portfolio.local.php` yang mengambil credential privat existing, tanpa mengubah konfigurasi kontak. Untuk hosting, salin `config/portfolio.local.example.php` ke `config/portfolio.local.php`, lalu isi host/port/username/password privat. Alternatif: environment `PORTFOLIO_DB_HOST`, `PORTFOLIO_DB_PORT`, `PORTFOLIO_DB_USERNAME`, `PORTFOLIO_DB_PASSWORD`. Nama database selalu `portfolio_kamiliya`.
3. PHP 8.1+ dengan `pdo_mysql`, `mbstring`, `fileinfo`, sessions. Atur `upload_max_filesize` minimal `2M` dan `post_max_size` lebih besar, misalnya `4M`. User PHP membutuhkan izin tulis ke `uploads/` dan direktori parent jika folder belum ada.

**Status terbaru:** tabel manual `users`, `projects`, dan tabel existing `contact_messages` sudah terdeteksi. Akun admin telah dibuat sesuai permintaan pengguna. Pengujian sinkronisasi CRUD → public sudah dijalankan atas instruksi terbaru, tanpa perubahan skema database.

## Akun admin pertama

Di PowerShell dari root project:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\create-admin.ps1
```

Masukkan username dan password yang diminta. Password disembunyikan saat diketik, dikirim melalui stdin, dan hanya hash `password_hash()` disimpan. Tidak ada akun/password default. CLI dapat membuat akun berikutnya; username harus unik. Untuk Linux gunakan input password tersembunyi dari shell dan kirim melalui stdin ke `php scripts/create-admin.php USERNAME`.

## URL dan alur

- Login: `/portofolio-kamiliya/admin-login.php` (tidak ada link di navbar/footer public).
- Dashboard: `/portofolio-kamiliya/admin/dashboard.php`.
- Library Read/Download public terpisah: `/portofolio-kamiliya/project-library.php`.
- Halaman public utama `/portofolio-kamiliya/project.php` mengambil project dari database dan menggabungkannya dengan tiga project static lama. Data baru terlihat saat halaman dimuat ulang, termasuk perubahan edit/hapus. Tidak ada migrasi otomatis atau penghapusan project lama.
- Preview gambar berdasarkan ID: `/portofolio-kamiliya/project-image.php?id=1`; PDF menggunakan download, tidak dirender sebagai gambar.
- Gambar public tetap thumbnail tanpa tombol unduh. PDF mendapat tombol Lihat PDF melalui `/portofolio-kamiliya/download-project.php?id=1&view=1`; download file asli pada admin tetap tersedia.
- Download public berdasarkan ID: `/portofolio-kamiliya/download-project.php?id=1`.

Login → dashboard → daftar/tambah/detail/edit project → modal hapus atau logout. Semua halaman `admin/` memerlukan session admin. Session idle berakhir setelah 30 menit. Login, logout, dan CRUD POST memakai token CSRF. Lima login gagal dibatasi per session selama lima menit; untuk hosting publik, tambahkan rate limit berbasis IP pada reverse proxy/web server.

## File dan hosting

### Video demo (link)

Admin tambah/edit memiliki field opsional `Link Video Demo` untuk URL HTTPS Google Drive atau YouTube. Link tersimpan dalam `projects.demo_url`; tombol Video Demo muncul pada card public, detail admin, dan daftar admin jika link valid terisi. Kosongkan link melalui edit untuk menyembunyikan tombol. Tidak ada upload video langsung atau perubahan pada thumbnail.

Pengguna harus menambahkan kolom sendiri melalui phpMyAdmin dengan `database/add-demo-url.sql`:

```sql
USE portfolio_kamiliya;
ALTER TABLE projects ADD COLUMN demo_url VARCHAR(2048) NULL DEFAULT NULL AFTER file_path;
```

Aplikasi tidak menjalankan SQL tersebut. Sebelum kolom tersedia, CRUD existing tetap menggunakan skema lama dan field demo dinonaktifkan. Setelah kolom ditambahkan, field otomatis aktif pada request berikutnya. Pastikan link video dapat diakses pengunjung. Validasi hanya mengizinkan domain Google Drive/Docs dan YouTube resmi, tanpa javascript, HTTP, userinfo, atau port khusus.

- Upload hanya PDF/JPG/JPEG/PNG, maksimal 2 MiB, extension + MIME aktual diperiksa. Nama acak 128 bit; database menyimpan `uploads/NAMA.ext`.
- Edit tanpa file baru mempertahankan file existing. Saat file diganti, update database dikomit sebelum file lama dihapus. File baru dibersihkan bila query gagal.
- Delete mengunci row, menghapus data, lalu `unlink()` file terkait. Jika pembersihan gagal, admin menerima warning dan detail masuk server log. Periksa file yatim saat terjadi masalah filesystem; jangan menghapus file berdasarkan path input pengunjung.
- `uploads/.htaccess` menolak akses langsung; file hanya dilayani endpoint download attachment. Proteksi ini juga dibuat ulang oleh aplikasi bila folder dibuat otomatis. Pastikan Apache mengizinkan aturan `.htaccess`. Pada Nginx gunakan `location` deny untuk `/uploads/`, `/config/`, `/database/`, `/scripts/`, `/tests/` dan file tersembunyi.
- Jangan upload `.git`, `__pycache__`, atau `tests/` ke hosting. Gunakan HTTPS, secret privat di luar version control, dan backup database beserta upload.
- Error database ditulis ke log server; public/admin menampilkan pesan umum. Kontak mempertahankan alur sukses lama dan memakai flash/redirect yang sama saat terjadi kegagalan.

## Tema dan paket lokal

`assets/js/site-theme.js` dipakai public/admin: key localStorage `theme`, light=terang dan dark=gelap. Preferensi public legacy yang terbalik dimigrasikan sekali dengan marker `kamiliya-theme-version=2`; palet/layout existing tetap dipertahankan.

Root `.htaccess` menolak akses HTTP ke `.git` dan metadata Git. Untuk membuat ZIP lokal yang mengecualikan Git serta secret:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build-deploy.ps1
```

ZIP disimpan di luar web root, pada temporary directory `kamiliya-deployment`. Paket tidak memuat `.git`, `.vscode`, tests, scripts, database SQL, dokumentasi internal, `.env*`, atau konfigurasi `*.local.php` privat. `.htaccess`, aset, upload existing, dan runtime aplikasi tetap disertakan. Ini hanya membuat paket lokal; tidak push atau deploy. Credential/config privat perlu disiapkan terpisah di hosting.

## Pengujian

Pengujian integrasi sebelumnya dilakukan pada salinan dan MariaDB terisolasi. Hasil historis ada di `ADMIN-AUDIT.md`. Runner lama tetap dinonaktifkan agar tidak menjalankan setup skema otomatis.

Runner audit terbaru adalah `tests/final_audit.py`: password admin dibaca dari stdin, bukan disimpan dalam source/argumen. Script memakai database existing, satu project sementara, dan browser opsional melalui `TEST_BROWSER`. Tidak mengimpor schema atau membuat tabel/database. Skenario CRUD, PDF, tema, robot, analytics, session, CSRF, dan XSS diuji; fixture project dibersihkan setelah tes. Tes kontak valid dan kegagalan PDO terisolasi juga telah dijalankan. Laporan terbaru: `FINAL-AUDIT.md`; laporan lain merupakan histori implementasi sebelumnya.

Screenshot pengujian sebelumnya disimpan di temporary directory `kamiliya-admin-preview`, bukan di folder public atau Git.
