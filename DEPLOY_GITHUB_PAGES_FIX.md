# Panduan Lengkap Memperbaiki Error 404 pada GitHub Pages untuk Proyek Vite React

## Penyebab Umum
- Base path di vite.config.ts tidak sesuai dengan nama repository.
- Folder build (dist) belum dibuild atau belum dideploy ke branch gh-pages.
- GitHub Pages belum diarahkan ke branch gh-pages.
- Cache browser atau propagasi DNS belum selesai.

## Langkah Perbaikan

1. **Periksa vite.config.ts**
   Pastikan ada konfigurasi base path seperti ini:
   ```ts
   export default defineConfig(({ mode }) => ({
     base: mode === "production" ? "/nama-repo/" : "/",
     // konfigurasi lain...
   }));
   ```
   Ganti `nama-repo` dengan nama repository GitHub Anda.

2. **Build Proyek**
   Jalankan perintah:
   ```
   npm run build
   ```
   Pastikan folder `dist` muncul dan berisi file hasil build.

3. **Deploy ke GitHub Pages**
   Pastikan package `gh-pages` sudah terinstall:
   ```
   npm install gh-pages --save-dev
   ```
   Jalankan perintah deploy:
   ```
   npm run deploy
   ```
   Ini akan mengupload isi folder `dist` ke branch `gh-pages`.

4. **Atur GitHub Pages di Repository**
   - Buka halaman repository di GitHub.
   - Masuk ke **Settings** > **Pages**.
   - Pilih branch `gh-pages` sebagai source.
   - Simpan pengaturan.

5. **Clear Cache dan Tunggu Propagasi**
   - Clear cache browser Anda.
   - Tunggu beberapa menit agar GitHub Pages selesai memproses.

6. **Cek Website**
   Akses URL:
   ```
   https://username.github.io/nama-repo/
   ```
   Ganti `username` dan `nama-repo` sesuai akun dan repository Anda.

## Troubleshooting
- Jika masih error 404, ulangi langkah build dan deploy.
- Pastikan tidak ada file `.nojekyll` yang menghalangi.
- Periksa console browser untuk error resource.

---

Jika Anda butuh bantuan lebih lanjut, silakan hubungi saya kembali.
