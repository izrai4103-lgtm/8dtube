# 8DTUBE 🎥

Website video **seperti YouTube dengan tampilan 3D**, bernama **8DTUBE**.
Semua video + fitur (beranda, kategori, pencarian, pemutar, komentar, shorts, 8D Cinema AI) **dimuat langsung dari**
[eight-dee-tube-clone.lovable.app](https://eight-dee-tube-clone.lovable.app) melalui proxy server-ke-server.

## Stack

- **[Next.js](https://nextjs.org)** — framework/template open-source dari `vercel/next.js` (100k+ stars di GitHub)
- **Three.js** — latar belakang 3D (bintang, cincin logo 8D, parallax mouse)
- **Tailwind CSS 4** — styling + efek 3D CSS (kartu tilt, glassmorphism, neon)
- **seroval** — dekode protokol server-function TanStack Start milik situs asli

## Cara kerja koneksi ke situs asli

1. Server aplikasi ini memanggil endpoint internal `/_serverFn/*` milik
   `eight-dee-tube-clone.lovable.app` dengan header protokol TanStack Start.
2. Payload di-encode dengan `seroval` (`toJSON`) dan respons didecode (`fromJSON`).
3. Data bersih dikirim ke klien lewat API route `/api/tube`.
4. Video diputar via `youtube.com/embed/<id>`.

## Menjalankan lokal

```bash
npm install
npm run dev
# buka http://localhost:3000
```

Opsional: ganti sumber data dengan env var:

```bash
LOVABLE_SOURCE=https://eight-dee-tube-clone.lovable.app npm run dev
```

## Halaman

| Rute | Fitur |
| --- | --- |
| `/` | Beranda: kategori + video trending |
| `/results?q=...` | Pencarian video |
| `/watch?v=...` | Pemutar video, channel, komentar, video terkait, **8D Cinema AI** |
| `/shorts` | Feed Shorts vertikal autoplay |

## Deploy

Deploy otomatis ke Vercel:

```bash
npx vercel --prod
```
