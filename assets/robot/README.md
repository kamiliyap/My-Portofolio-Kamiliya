# Robot portfolio

Komponen dimuat hanya di `index.php` melalui `assets/css/robot.css` dan
`assets/js/robot.js`. Tidak membutuhkan library tambahan.

Ganti gambar PNG transparan pada folder ini untuk mengubah karakter:

- `robot-idle.png`: diam / melayang dan fallback gambar.
- `robot-walk.png`: mengikuti cursor.
- `robot-fly.png`: masuk / keluar layar.
- `robot-surprised.png`: kaget selama satu detik.
- `robot-love.png`: nyaman dan senang.

Gunakan kanvas persegi dengan posisi kepala/badan konsisten antargambar.
Area elus berada pada 55% bagian atas karakter. Tiga pembalikan arah
horizontal dengan jarak minimal 6 px dan kecepatan maksimal 0,65 px/ms
memicu satu elusan. Tiga elusan memicu state happy. Robot menunggu
1,5 detik setelah cursor meninggalkan kepala sebelum kembali mengikuti.

Teks ID/EN berada di objek `words` dalam `robot.js`; bahasa mengikuti
atribut `lang` website. Warna menggunakan variabel tema website.
Bubble dibatasi satu setiap enam detik. Di perangkat sentuh robot melayang
di sudut layar; ketuk dua kali untuk ekspresi kaget. Keyboard: fokus robot
lalu Enter/Space untuk kaget, Escape untuk memulangkan.

Animasi dekoratif dinonaktifkan saat prefers-reduced-motion aktif.
Loop requestAnimationFrame berhenti ketika robot tersembunyi atau tab tidak aktif.
