# Contact Form — MySQL localhost

Koneksi hanya menuju `localhost`, database `portfolio_kamiliya`, user `ppkpipos`.
Tidak ada konfigurasi hosting atau perubahan skema database.

1. Buka `database.local.php` dan isi password sesuai koneksi MySQL Workbench.
   Gunakan password milik akun `ppkpipos`.
2. Isi `port` sesuai koneksi Workbench (default 3306).
3. Pastikan Apache berjalan dan tabel `contact_messages` sudah dibuat.
4. Buka `http://localhost/portofolio-kamiliya/contact.php`.
5. Isi Nama `Kamiliya`, Email `kamiliya@example.com`, Pesan
   `Testing contact form portfolio`, lalu klik Kirim Pesan.
6. Periksa data melalui Workbench:

```sql
USE portfolio_kamiliya;
SELECT * FROM contact_messages ORDER BY created_at DESC;
```

Form melakukan POST ke contact.php. Controller memeriksa token CSRF dan
memvalidasi input sebelum menggunakan PDO prepared statement untuk INSERT.
Status dan created_at menggunakan nilai default tabel. Setelah POST, server
mengembalikan redirect HTTP 303 ke GET halaman Contact. Pesan hasil disimpan
sementara dalam session. Isian dikosongkan hanya setelah INSERT berhasil.
Refresh GET tidak mengulang INSERT; token yang sudah dipakai juga ditolak.

Pesan disimpan di database, bukan dikirim sebagai email.
Error database hanya menghasilkan pesan umum bagi pengunjung.
Kode 1045 saat pemeriksaan koneksi berarti autentikasi akun MySQL ditolak:
cocokkan akun/password/port dengan koneksi Workbench yang berhasil.

`database.local.php` diabaikan Git. File contoh disediakan untuk setup lokal
baru. `.htaccess` menolak akses HTTP ke folder konfigurasi.
