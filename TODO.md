# TODO: Perbaikan Halaman Laporan (Reports)

## Masalah yang Ditemukan
- Halaman laporan tidak dapat diakses dengan baik.
- Tidak ada loading state saat laporan sedang diproses.
- Penanganan error pada laporan kurang baik.
- Data laporan kadang tidak terinisialisasi dengan benar.
- Tampilan data laporan kurang sesuai untuk beberapa tipe laporan.

## Rencana Perbaikan
1. Tambahkan loading state di komponen Reports.tsx untuk menandakan proses generate laporan.
2. Tambahkan error handling di Reports.tsx untuk menangani kegagalan generate laporan.
3. Pastikan data transaksi dan inventaris sudah terinisialisasi sebelum render laporan.
4. Perbaiki logika tampilan data untuk tipe laporan: inventory, transactions, monthly, custom.
5. Lakukan testing menyeluruh untuk semua tipe laporan.
6. Verifikasi tidak ada error di console dan UI berjalan lancar.

## File yang Akan Diedit
- src/pages/Reports.tsx
- src/contexts/TransactionContext.tsx (jika perlu perbaikan inisialisasi data)

## Testing
- Test generate laporan inventaris.
- Test generate laporan transaksi.
- Test generate laporan bulanan.
- Test generate laporan kustom.
- Pastikan tidak ada error di console.
- Pastikan UI responsif dan user friendly.
