# portofolio-v2

Portfolio of Yusuf Novandra, backend developer. React, Vite, TypeScript, Tailwind, and GSAP.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck and build to dist/
npm run lint
```

## Mengubah konten

Semua isi ada di satu file: [`src/data/portfolio.ts`](src/data/portfolio.ts). Komponen tidak perlu disentuh. Cari `TODO` untuk bagian yang masih perlu diisi.

| Mau ubah | Edit bagian |
| --- | --- |
| Nama, role, intro, status kerja | `profile` |
| Yang sedang dipelajari | `profile.learning` (kosong = tidak tampil) |
| Skill dan tools | `skills` |
| Project | `projects` (status: `in-progress` atau `finished`; `diagram` untuk diagram arsitektur) |
| Pengalaman kerja | `experience` (tanggal `"YYYY-MM"`, `end: null` kalau masih bekerja) |
| Sertifikat, pendidikan, bahasa | `certificates`, `education`, `languages` |
| Link kontak dan form | `contactLinks`, `contactFormEndpoint` |

Tulis hanya yang benar-benar terjadi. Section yang datanya kosong otomatis disembunyikan.

Terminal di hero otomatis menjawab dari data yang sama, jadi tidak perlu diubah terpisah.

Gambar atau PDF baru: taruh di `src/assets/`, `import` di bagian atas `portfolio.ts`, lalu pakai di data.

## Desain

Arah desain dan alasan tiap keputusan ada di [`DESIGN.md`](DESIGN.md). Aturan anti "AI slop" dari [antislop](https://github.com/miqdadbadjuber/anti-slop) ada di `.claude/skills/` dan otomatis dibaca Claude Code lewat `CLAUDE.md`.

## Halaman

- `/`: portfolio
- `/cv`: CV dari data yang sama, siap print atau simpan sebagai PDF
