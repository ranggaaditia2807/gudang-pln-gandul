# TODO - Perbaikan Error 404 main.tsx

- [x] Periksa file src/main.tsx, sudah ada dan benar.
- [x] Periksa index.html, ubah script src dari /src/main.tsx ke src/main.tsx agar path relatif.
- [x] Periksa vite.config.ts, base path sudah sesuai dengan basename React Router.
- [x] Jalankan npm run dev, server berjalan tanpa error 404 main.tsx.
- [ ] Jalankan build, periksa folder dist, saat ini kosong.
- [ ] Periksa error build di terminal lokal karena output build tidak muncul.
- [ ] Jika build berhasil, deploy dan cek apakah error 404 masih muncul.
- [ ] Jika error masih muncul, periksa konfigurasi server hosting.

Langkah selanjutnya:
- Periksa output error build di terminal lokal.
- Pastikan build menghasilkan file di folder dist.
- Jika perlu, perbaiki konfigurasi build atau dependencies.
