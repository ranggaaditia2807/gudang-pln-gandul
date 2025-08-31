# Panduan Lengkap Memperbaiki Error 404 pada GitHub Pages untuk Proyek Vite React

## Penyebab Umum
- Base path di vite.config.ts tidak sesuai dengan nama repository.
- Folder build (dist) belum dibuild atau belum dideploy ke branch gh-pages.
- GitHub Pages belum diarahkan ke branch gh-pages.
- Cache browser atau propagasi DNS belum selesai.
- **Masalah khusus SPA: Refresh halaman mengakibatkan 404 karena server tidak mengenali route SPA**

## Langkah Cepat Mengatasi Refresh 404

Jika Anda mengalami masalah refresh 404, ikuti langkah ini:

1. **Build ulang dan deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

2. **Tunggu propagasi** (5-10 menit)

3. **Clear cache browser**:
   - Tekan `Ctrl+Shift+R` (Windows/Linux) atau `Cmd+Shift+R` (Mac)
   - Atau gunakan mode incognito

4. **Test refresh** di berbagai halaman

5. **Jika masih bermasalah**, periksa apakah file `404.html` sudah terdeploy dengan mengakses:
   ```
   https://username.github.io/gudang-pln-gandul/404.html
   ```

## Konfigurasi Package.json untuk Deploy

Pastikan `package.json` Anda memiliki script deploy yang benar:

```json
{
  "scripts": {
    "build": "vite build",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://username.github.io/gudang-pln-gandul/"
}
```

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

## Solusi Khusus untuk Masalah Refresh 404 di SPA

### Mengapa Terjadi Refresh 404?
Ketika Anda refresh halaman di route seperti `/dashboard` atau `/transactions`, server GitHub Pages mencari file `dashboard.html` yang tidak ada, sehingga mengembalikan error 404. Ini adalah masalah umum di Single Page Application (SPA).

### Solusi yang Sudah Diterapkan
Proyek ini sudah menggunakan solusi standar untuk SPA di GitHub Pages:

1. **File `public/404.html`** - Berisi script redirect yang mengkonversi URL yang tidak ditemukan kembali ke format query string yang bisa ditangani oleh SPA.
2. **Script di `src/main.tsx`** - Menangani redirect dari query string kembali ke route SPA yang benar.

### Langkah Verifikasi Solusi

1. **Pastikan File 404.html Terdeploy**
   Setelah deploy, pastikan file `404.html` ada di root folder GitHub Pages Anda:
   ```
   https://username.github.io/nama-repo/404.html
   ```

2. **Test Refresh di Berbagai Route**
   - Akses website utama: `https://username.github.io/nama-repo/`
   - Navigasi ke halaman lain (misal: `/dashboard`, `/transactions`)
   - Refresh halaman tersebut
   - Jika masih 404, lanjut ke troubleshooting di bawah

### Troubleshooting Khusus Refresh 404

1. **Periksa Apakah 404.html Bekerja**
   - Akses langsung: `https://username.github.io/nama-repo/404.html`
   - Jika redirect otomatis ke halaman utama, berarti script berfungsi

2. **Clear Cache Browser**
   - Tekan `Ctrl+Shift+R` (Windows/Linux) atau `Cmd+Shift+R` (Mac)
   - Atau gunakan mode incognito/private browsing

3. **Periksa Console Browser**
   - Buka Developer Tools (F12)
   - Lihat tab Console untuk error JavaScript
   - Pastikan tidak ada error yang menghalangi script redirect

4. **Verifikasi Build Process**
   - Pastikan file `dist/404.html` ada setelah build
   - Periksa apakah script redirect masih ada di file tersebut

5. **Alternative: Gunakan .nojekyll**
   Jika masalah berlanjut, tambahkan file `.nojekyll` ke folder `public/`:
   ```
   touch public/.nojekyll
   ```
   Ini memberitahu GitHub Pages untuk tidak memproses Jekyll.

## Troubleshooting
- Jika masih error 404, ulangi langkah build dan deploy.
- Pastikan tidak ada file `.nojekyll` yang menghalangi.
- Periksa console browser untuk error resource.

---

Jika Anda butuh bantuan lebih lanjut, silakan hubungi saya kembali.
