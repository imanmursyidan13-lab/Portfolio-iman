Personal Portfolio - Iman Mursyidan

Cara membuka: klik dua kali index.html (butuh internet untuk memuat font Plus Jakarta Sans).

File:
- index.html : struktur dan isi konten
- style.css  : tampilan (warna ada di bagian :root paling atas)
- script.js  : interaksi; di bagian atas ada PHOTO_SRC (foto profil) dan PROJECTS (daftar proyek)

Menambah foto profil (pilih salah satu cara):
1. Cara Paling Mudah: Masukkan foto Anda ke dalam folder ini dengan nama "foto.jpg" (otomatis muncul).
2. Lewat index.html: Buka index.html, cari baris <img id="photo" src="foto.jpg" ...> dan ubah nama filenya sesuai foto Anda.
3. Lewat script.js: Buka script.js, isi nilai PHOTO_SRC di baris ke-3, misalnya const PHOTO_SRC = "foto-saya.jpg";
* Catatan: Jika foto belum ditambahkan atau nama file tidak ditemukan, lingkaran akan otomatis menampilkan inisial "IM".
Menambah proyek: tambahkan objek ke PROJECTS di script.js:
  { title: "Nama proyek", description: "Deskripsi singkat", tags: ["MySQL"], link: "https://...", image: "gambar.jpg" }
