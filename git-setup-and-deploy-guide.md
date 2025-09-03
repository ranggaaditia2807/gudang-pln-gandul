# Panduan Install Git, Inisialisasi Repository, dan Deploy ke GitHub Pages

## 1. Install Git
- Kunjungi https://git-scm.com/download/win
- Download dan install Git untuk Windows
- Setelah install, buka terminal baru dan ketik `git --version` untuk memastikan Git sudah terinstall

## 2. Inisialisasi Repository Git di Proyek
- Buka terminal di folder proyek Anda (`c:/Users/User/Documents/gudang-pln-gandul`)
- Jalankan perintah berikut:
  ```
  git init
  git remote add origin https://github.com/username/repository.git
  git add .
  git commit -m "Initial commit"
  git branch -M main
  git push -u origin main
  ```
  Ganti `https://github.com/username/repository.git` dengan URL repository GitHub Anda

## 3. Build Proyek
- Jalankan perintah:
  ```
  npm run build
  ```

## 4. Deploy ke GitHub Pages
- Jalankan perintah:
  ```
  npm run deploy
  ```
- Pastikan branch `gh-pages` sudah dibuat dan berisi hasil build

## 5. Aktifkan GitHub Pages di Repository
- Buka halaman repository GitHub Anda
- Masuk ke Settings > Pages
- Pilih branch `gh-pages` dan folder root `/`
- Simpan pengaturan

## 6. Akses Website
- Website Anda akan dapat diakses di URL yang diberikan GitHub Pages, biasanya:
  ```
  https://username.github.io/repository/
  ```

Jika Anda membutuhkan bantuan lebih lanjut, silakan beri tahu saya.
