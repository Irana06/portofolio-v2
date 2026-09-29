# yusufnova — backend portfolio (v2)

Portfolio yang fokus ke backend: tema gelap, gaya terminal / API docs, dibangun dengan React + Vite + TypeScript + Tailwind.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + build ke dist/
npm run lint
```

## Cara update konten

**Semua konten ada di satu file: [`src/data/portfolio.ts`](src/data/portfolio.ts).**
Komponen tidak perlu disentuh. Cari `TODO` untuk bagian yang perlu diisi.

| Mau ubah…                     | Edit bagian              |
| ----------------------------- | ------------------------ |
| Nama, role, tagline, about    | `profile`                |
| Status "open to work"         | `profile.available`      |
| Skill / tech stack            | `stack` (level: `daily` · `proficient` · `familiar` · `learning`) |
| Project                       | `projects` (status: `live` → 200, `in-progress` → 202, `archived` → 410) |
| Pengalaman kerja              | `experience` (tanggal `"YYYY-MM"`, `end: null` = masih bekerja) |
| Sertifikat                    | `certificates`           |
| Pendidikan, bahasa            | `education`, `languages` |
| Sosmed & kontak               | `socials`, `contactFormEndpoint` |

Angka seperti total tahun pengalaman, jumlah project, dan sertifikat dihitung otomatis dari data.

### Menambah gambar / file

Taruh file di `src/assets/...`, `import` di bagian atas `portfolio.ts`, lalu pakai di data
(lihat contoh `badmintoonImg` atau `certInternship`).

## Struktur

```
src/
├── data/          # ← konten (portfolio.ts) + tipe data
├── sections/      # Hero, About, Stack, Projects, Experience, Certificates, Contact
├── components/    # Navbar, Footer, UI primitives (Window, SectionHeader, …)
├── pages/         # /cv (CV siap print) dan 404
└── lib/           # helper format tanggal & durasi
```

## Halaman

- `/` — portfolio utama
- `/cv` — CV bersih berbasis data yang sama, bisa di-print / save as PDF
