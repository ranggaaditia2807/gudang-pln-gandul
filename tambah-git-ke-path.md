# Cara Menambahkan Git ke PATH di Windows (Panduan Lengkap dari Win+R)

## Jika Git Sudah Terinstall tapi Tidak Dikenali di Terminal

### Langkah 1: Buka System Properties
1. Tekan `Win + R` pada keyboard (tombol Windows + R)
2. Ketik `sysdm.cpl` dan klik **OK**

### Langkah 2: Buka Environment Variables
1. Di jendela System Properties, klik tab **Advanced**
2. Klik tombol **Environment Variables** di bagian bawah

### Langkah 3: Edit Path Variable
1. Di bagian **System variables** (bagian bawah), cari variabel bernama **Path**
2. Klik pada **Path**, lalu klik tombol **Edit**

### Langkah 4: Tambahkan Path Git
1. Di jendela Edit Environment Variable, klik tombol **New**
2. Ketik: `C:\Program Files\Git\cmd`
3. Pastikan path tersebut muncul di daftar
4. Klik **OK** untuk menutup semua dialog

### Langkah 5: Verifikasi dan Restart
1. Klik **OK** di semua jendela dialog untuk menyimpan perubahan
2. Restart VSCode (tutup dan buka lagi)
3. Buka terminal baru di VSCode (Ctrl + Shift + `)
4. Ketik perintah: `git --version`
5. Jika berhasil, akan muncul versi Git seperti `git version 2.x.x`

## Jika Path Git Berbeda
Jika Git terinstall di lokasi lain (bukan `C:\Program Files\Git`), Anda perlu mencari folder instalasi Git:
1. Buka File Explorer
2. Cari folder Git (biasanya di `C:\Program Files` atau `C:\Users\[nama]\AppData\Local\Programs`)
3. Tambahkan path ke folder `cmd` atau `bin` di dalam folder Git

## Troubleshooting
- Jika masih tidak berfungsi setelah restart, coba restart komputer
- Pastikan tidak ada spasi tambahan di path
- Gunakan backslash `\` bukan forward slash `/`

## Alternatif: Gunakan Git Bash
Jika PATH masih bermasalah, Anda bisa:
1. Cari "Git Bash" di menu Start
2. Gunakan Git Bash untuk menjalankan perintah Git
3. Terminal VSCode akan menggunakan Git dari Git Bash

## Setelah Git Berfungsi
Setelah Git dikenali, Anda dapat melanjutkan dengan panduan deploy di file `cara-deploy-manual-gh-pages.md` untuk membuat branch gh-pages dan deploy ke GitHub Pages.
