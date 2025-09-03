# Panduan Mengatasi Error "Running scripts is disabled on this system" di PowerShell Windows

Error ini terjadi karena kebijakan eksekusi (Execution Policy) di PowerShell membatasi menjalankan skrip, termasuk skrip npm.

## Langkah-langkah Mengatasi:

1. **Buka PowerShell sebagai Administrator**
   - Klik tombol Start
   - Ketik "PowerShell"
   - Klik kanan pada "Windows PowerShell" dan pilih "Run as administrator"

2. **Cek Execution Policy saat ini**
   Jalankan perintah berikut:
   ```
   Get-ExecutionPolicy
   ```
   Biasanya hasilnya adalah `Restricted` atau `AllSigned`.

3. **Ubah Execution Policy menjadi RemoteSigned**
   Jalankan perintah berikut:
   ```
   Set-ExecutionPolicy RemoteSigned
   ```
   Jika muncul konfirmasi, ketik `Y` lalu tekan Enter.

4. **Tutup PowerShell dan buka kembali terminal Anda**
   Setelah ini, Anda seharusnya bisa menjalankan perintah npm tanpa error.

## Catatan:
- `RemoteSigned` mengizinkan menjalankan skrip lokal tanpa tanda tangan, tapi skrip yang diunduh dari internet harus memiliki tanda tangan digital.
- Jika Anda menggunakan terminal lain seperti Git Bash atau CMD, masalah ini biasanya tidak muncul.

Jika Anda membutuhkan bantuan lebih lanjut, silakan beri tahu saya.
