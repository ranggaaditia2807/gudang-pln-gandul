# Cara Membuat Branch gh-pages untuk GitHub Pages

## Persyaratan
- Git sudah terinstall
- Repository Git sudah diinisialisasi dan terhubung dengan GitHub
- Package `gh-pages` sudah terinstall (`npm install gh-pages --save-dev`)

## Langkah-langkah

### 1. Build Proyek
```bash
npm run build
```
Ini akan membuat folder `dist/` dengan file-file yang siap di-deploy.

### 2. Install gh-pages (jika belum)
```bash
npm install gh-pages --save-dev
```

### 3. Deploy ke GitHub Pages
```bash
npm run deploy
```
Perintah ini akan:
- Membuat branch `gh-pages` (jika belum ada)
- Mengupload isi folder `dist/` ke branch `gh-pages`
- Mengatur branch tersebut sebagai source untuk GitHub Pages

### 4. Aktifkan GitHub Pages di Repository
1. Buka halaman repository GitHub Anda
2. Klik **Settings**
3. Scroll ke bagian **Pages**
4. Pada **Source**, pilih branch `gh-pages`
5. Klik **Save**

### 5. Akses Website
Website Anda akan dapat diakses di:
```
https://username.github.io/repository-name/
```

## Troubleshooting
- Jika deploy gagal, pastikan Git sudah terkonfigurasi dengan benar
- Pastikan repository GitHub sudah diinisialisasi dan remote origin sudah di-set
- Jika masih ada error 404, periksa konfigurasi base path di `vite.config.ts`

## Catatan
- Branch `gh-pages` akan dibuat otomatis oleh `gh-pages` package
- File-file di branch `gh-pages` akan di-overwrite setiap kali Anda menjalankan `npm run deploy`
- Untuk update website, cukup jalankan `npm run build` dan `npm run deploy` lagi
