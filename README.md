# Batik Sejawat — Brand Hub (Static)

Ringkasan: proyek ini adalah situs statis sederhana untuk menampilkan dokumen brand seperti Brand Bible, Buyer Persona, Brand Guideline, dan Content Pillars. Tujuan awal: cepat, mudah update, dan interaktif.

Cara menjalankan (lokal):

1. Buka file `index.html` di browser (double-click atau drag ke browser).
2. Atau jalankan server sederhana, mis. Python:

```bash
python -m http.server 8000
# lalu buka http://localhost:8000
```

Menambahkan halaman baru:
- Tambahkan file HTML ke folder `pages/` bernama `your-page-id.html`.
- Tambahkan entri ke `data/site-config.json` dengan `id` yang sama dan `title`.
- Halaman akan muncul di navigasi otomatis.

Update konten berkala:
- Page disimpan sebagai HTML sehingga mudah diupdate.
- Untuk workflow yang lebih terstruktur, hubungkan ke headless CMS atau gunakan file JSON yang di-render di client.

Pertanyaan atau ingin saya tambahkan CMS sederhana atau sistem edit in-place?
