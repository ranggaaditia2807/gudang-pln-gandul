# Cara Deploy Manual ke GitHub Pages (Alternatif tanpa gh-pages package)

## Jika Tidak Ada Opsi gh-pages di GitHub

Jika branch `gh-pages` belum ada, Anda perlu membuatnya secara manual.

## Langkah-langkah

### 1. Build Proyek
```bash
npm run build
```

### 2. Inisialisasi Repository Git (jika belum)
```bash
git init
git remote add origin https://github.com/username/repository.git
git add .
git commit -m "Initial commit"
git branch -M main
git push -u origin main
```

### 3. Buat Branch gh-pages
```bash
# Buat branch orphan gh-pages
git checkout --orphan gh-pages

# Hapus semua file di working directory
git rm -rf .

# Copy isi folder dist ke root
cp -r dist/* .

# Tambahkan dan commit
git add .
git commit -m "Deploy to GitHub Pages"

# Push branch gh-pages
git push origin gh-pages
```

### 4. Aktifkan GitHub Pages
1. Buka repository GitHub Anda
2. Klik **Settings**
3. Scroll ke **Pages**
4. Pada **Source**, pilih branch **gh-pages**
5. Klik **Save**

### 5. Akses Website
Website akan tersedia di:
```
https://username.github.io/repository-name/
```

## Untuk Update Website
```bash
# Kembali ke branch main
git checkout main

# Lakukan perubahan dan commit
# ...

# Build ulang
npm run build

# Switch ke gh-pages
git checkout gh-pages

# Update dengan file baru dari dist
git rm -rf .
cp -r ../dist/* .
git add .
git commit -m "Update website"
git push origin gh-pages

# Kembali ke main
git checkout main
```

## Catatan
- Pastikan Git sudah terinstall
- Ganti `username` dan `repository` dengan yang sesuai
- Jika ada error saat copy, gunakan perintah yang sesuai dengan OS Anda
