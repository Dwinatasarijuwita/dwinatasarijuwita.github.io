# Desain Portofolio Bergaya macOS

Tanggal: 2026-09-30
Status: Menunggu review

## Tujuan

Portofolio personal branding untuk Dwi Natasari Juwita yang tampil seperti desktop macOS di laptop dan seperti home screen iPhone di HP. Pengunjung menjelajahi portofolio dengan membuka "aplikasi", bukan dengan scroll halaman.

Versi pertama berhasil jika:

- Di layar ≥ 768px, pengunjung melihat desktop macOS (wallpaper, menu bar, Dock) dan bisa membuka, menggeser, menutup, minimize, dan maximize 4 jendela aplikasi.
- Di layar < 768px, pengunjung melihat home screen iPhone dan bisa membuka keempat aplikasi layar penuh lalu kembali.
- `npm run build`, `npm run lint`, dan `npm test` lolos.

## Ruang lingkup

**Termasuk:**

- 4 aplikasi: About Me, Resume, Contact, Music Favorite
- Jendela bisa digeser dan diklik ke depan
- Tombol merah/kuning/hijau berfungsi (tutup, minimize, maximize)
- Dock yang membesar saat dilewati kursor, dengan titik penanda aplikasi terbuka
- Menu bar dengan nama aplikasi aktif dan jam
- Tampilan iPhone untuk HP

**Tidak termasuk (bisa ditambah nanti):** layar boot, lock screen, dark mode, resize jendela, menu dropdown di menu bar, ikon di desktop, menyimpan posisi jendela.

## Teknologi

- React 19 + Vite + JavaScript + Tailwind CSS v4 (sudah terpasang)
- React Router (sudah terpasang). Rute `/` menampilkan desktop atau home screen, dan `*` menampilkan 404.
- **Motion** (paket `motion`, dulu `framer-motion`) untuk semua animasi dan fitur geser jendela. `react-draggable` tidak dipakai karena bermasalah di React 19 dan fiturnya sudah ada di Motion.
- Vitest + React Testing Library untuk pengujian.

## Struktur file

```
src/
├── data/
│   ├── profile.js        nama, inisial, tagline, perkenalan, email
│   ├── songs.js          daftar lagu favorit
│   └── apps.js           daftar aplikasi (id, nama, ikon, komponen isi, ukuran bawaan)
├── apps/
│   ├── AboutApp.jsx
│   ├── ResumeApp.jsx
│   ├── ContactApp.jsx
│   └── MusicApp.jsx
├── components/
│   ├── desktop/
│   │   ├── Desktop.jsx   wallpaper + menu bar + jendela + Dock
│   │   ├── MenuBar.jsx
│   │   ├── Dock.jsx
│   │   └── Window.jsx    bingkai jendela, title bar, tombol lampu lalu lintas
│   ├── mobile/
│   │   ├── HomeScreen.jsx
│   │   └── AppSheet.jsx  aplikasi layar penuh di HP
│   ├── AppIcon.jsx       ikon aplikasi (SVG/CSS), dipakai desktop & HP
│   └── Avatar.jsx        avatar inisial bergradasi
├── hooks/
│   ├── useWindowManager.js
│   └── useIsMobile.js
├── pages/
│   ├── Home/index.jsx    memilih Desktop atau HomeScreen
│   └── NotFound/index.jsx
└── routes/index.jsx
```

Yang dihapus: `components/Navbar.jsx`, `layouts/MainLayout.jsx`, folder `sections/`.

**Prinsip:**

- `apps.js` adalah satu-satunya daftar aplikasi. Dock, desktop, dan home screen membaca dari sana. Menambah aplikasi cukup dengan membuat komponen di `apps/` lalu mendaftarkannya di `apps.js`.
- Komponen di `apps/` hanya berisi konten. Mereka tidak tahu apakah sedang tampil di `Window` (desktop) atau `AppSheet` (HP).
- Isi portofolio diubah lewat `data/`, bukan lewat komponen.

## Pengelola jendela (`useWindowManager`)

State per aplikasi:

```js
{
  isOpen: boolean,
  isMinimized: boolean,
  isMaximized: boolean,
  position: { x, y },   // posisi terakhir (piksel, relatif ke area desktop)
  zIndex: number,
}
```

Plus `activeId`, yaitu id jendela paling depan yang tidak di-minimize, atau `null`.

Aksi:

| Aksi | Perilaku |
|---|---|
| `open(id)` | Jika tertutup: buka di posisi awal bawaan (bertingkat per aplikasi), lalu fokus. Jika di-minimize: kembalikan, lalu fokus. Jika sudah terbuka: fokus saja. |
| `close(id)` | Tutup dan reset posisi ke posisi awal. |
| `minimize(id)` | Sembunyikan. Tetap dianggap terbuka (titik di Dock tetap menyala). `activeId` pindah ke jendela terbuka berikutnya yang paling atas. |
| `toggleMaximize(id)` | Beralih antara ukuran penuh dan ukuran/posisi sebelumnya. |
| `focus(id)` | Beri `zIndex` tertinggi dan jadikan `activeId`. |
| `move(id, position)` | Simpan posisi baru setelah selesai digeser. |

Logikanya ditulis sebagai fungsi reducer murni supaya bisa diuji tanpa render.

## Perilaku desktop

**Jendela (`Window.jsx`):**

- Membuka: animasi membesar dan memudar masuk.
- Klik di mana saja pada jendela akan memfokuskannya. Jendela aktif punya bayangan lebih tebal, dan title bar jendela tidak aktif sedikit pudar.
- Geser hanya lewat title bar (Motion `drag` dengan `dragControls` dan `dragListener={false}`), dibatasi di dalam area antara menu bar dan tepi layar (`dragConstraints`), tanpa efek pantul (`dragMomentum={false}`).
- 🔴 Tutup: animasi mengecil dan menghilang (`AnimatePresence`).
- 🟡 Minimize: jendela menyusut dan bergerak ke arah Dock, lalu hilang. Klik ikon Dock untuk memunculkannya lagi di posisi terakhir.
- 🟢 Maximize: memenuhi area di antara menu bar dan Dock. Klik lagi, atau klik dua kali title bar, untuk kembali.
- Ukuran bawaan diatur per aplikasi di `apps.js`. Tidak bisa di-resize.

**Dock (`Dock.jsx`):**

- Berada di tengah bawah, dengan latar kaca buram (`backdrop-blur`).
- Efek membesar: jarak kursor ke tiap ikon dipetakan ke ukuran ikon memakai `useMotionValue`, `useTransform`, dan `useSpring`, jadi ikon di sebelahnya ikut membesar.
- Label nama aplikasi muncul saat kursor berada di atas ikon.
- Titik kecil di bawah ikon aplikasi yang terbuka, termasuk yang di-minimize.

**Menu bar (`MenuBar.jsx`):**

- Kiri: logo Apple (SVG), lalu nama aplikasi aktif (tebal), atau "Finder" jika tidak ada.
- Kanan: tanggal dan jam, format `id-ID`, misalnya "Rab 30 Sep 14.05", diperbarui setiap menit.
- Hanya tampilan, tanpa menu dropdown.

**Reduce motion:** jika `prefers-reduced-motion` aktif, semua animasi diganti fade singkat (`useReducedMotion` dari Motion).

## Perilaku HP (< 768px)

- `useIsMobile` memakai `matchMedia('(max-width: 767px)')` dan ikut berubah saat ukuran layar berubah.
- **HomeScreen:** wallpaper yang sama; status bar (jam di kiri, ikon sinyal/Wi-Fi/baterai sebagai hiasan di kanan); widget sapaan di atas (avatar "DJ", nama, tagline); Dock iPhone di bawah berisi 4 aplikasi dengan latar kaca buram. Grid ikon baru dipakai jika aplikasi bertambah lebih dari 4.
- **AppSheet:** ketuk ikon, lalu aplikasi terbuka layar penuh dengan animasi dari posisi ikon. Ada header dengan tombol "‹ Kembali" dan judul aplikasi, isi yang bisa di-scroll, dan garis home di bawah yang bisa diketuk atau diusap ke atas untuk menutup.
- **Tombol Back browser:** saat aplikasi dibuka, tambahkan entri history (`history.pushState`). Event `popstate` menutup aplikasi. Menutup lewat tombol di layar juga memanggil `history.back()` supaya history tetap sinkron.

## Isi aplikasi

**About Me:** gaya "About This Mac". Avatar "DJ" besar, nama, tagline, paragraf perkenalan, dan daftar singkat (Sedang belajar, Hobi, Lokasi). Tagline dan perkenalan menyusul, sementara diisi teks penanda yang jelas, misalnya "Tulis perkenalanmu di sini".

**Resume:**

- Desktop: PDF ditampilkan dengan `<iframe>` di dalam jendela, ditambah toolbar dengan tombol "Unduh" (`<a download>`).
- HP: ringkasan singkat, tombol "Buka PDF", dan tombol "Unduh CV".
- File: `public/resume.pdf`. Saat ini ada `public/Dwi Natasari Juwita - cv.pdf`, yang akan di-rename ke `resume.pdf` supaya URL-nya bersih. Atribut `download` memakai nama "Dwi Natasari Juwita - CV.pdf" supaya file yang diunduh pengunjung tetap bernama lengkap.
- Jika file tidak ada (iframe gagal dimuat atau `fetch` HEAD 404), tampilkan pesan "CV segera hadir", bukan error.

**Contact:** gaya kartu Contacts. Avatar, nama, baris Email (`mailto:tasyakstr@gmail.com`), dan tombol "Salin email" (`navigator.clipboard.writeText`) yang menampilkan "Tersalin ✓" selama 2 detik. Jika clipboard tidak tersedia, tombol disembunyikan.

**Music Favorite:** gaya playlist Apple Music.

- Header: kotak gradasi besar, judul "Lagu Favorit DJ", dan jumlah lagu.
- Tiap baris: nomor, kotak gradasi kecil dengan ikon ♪ (warna ditentukan dari hash judul supaya konsisten), judul, dan artis.
- Klik baris untuk membuka link di tab baru (`target="_blank" rel="noopener noreferrer"`).
- Link kosong diganti `https://open.spotify.com/search/<judul artis>` (di-encode).
- Tanpa cover album asli dan tanpa komentar.

## Data

`src/data/profile.js`:

```js
export const profile = {
  name: 'Dwi Natasari Juwita',
  initials: 'DJ',
  tagline: 'Tulis tagline-mu di sini',
  intro: ['Tulis perkenalanmu di sini.'],
  facts: [
    { label: 'Sedang belajar', value: '...' },
    { label: 'Hobi', value: '...' },
    { label: 'Lokasi', value: '...' },
  ],
  email: 'tasyakstr@gmail.com',
}
```

`src/data/songs.js` (parameter pelacakan `?si=` dihapus dari link):

| # | Judul | Artis | Link |
|---|---|---|---|
| 1 | Baby Now That I Found You | Ella Bright | https://open.spotify.com/track/3pnVh7sYDBQ9D2tkKAWnhs |
| 2 | Lost Stars | Adam Levine | https://open.spotify.com/track/1Duym1lVQurgKHHSqpOWhY |
| 3 | Dan Sore Itu | Monica Christiana | https://open.spotify.com/track/1yt2oBcSF7xveB4Gic5qQk |
| 4 | Teh Hijau | Tulus | https://open.spotify.com/track/4R9G7azXaZe93KTX65P9fU |
| 5 | Love Never Felt So Good | Michael Jackson & Justin Timberlake | https://open.spotify.com/track/48td6xvpokdYwvbl3JIiXP |

## Aset

| File | Lokasi | Status |
|---|---|---|
| Wallpaper | `src/assets/wallpaper.jpg` | Ada (4242×3081, 626 KB) |
| CV | `public/resume.pdf` | Ada dengan nama lain, akan di-rename |

Jika wallpaper tidak ada, dipakai gradasi CSS ala macOS sebagai cadangan. Ikon aplikasi, logo Apple, ikon status bar, avatar, dan kotak lagu semuanya dibuat dengan SVG/CSS, jadi tidak ada file gambar lain.

## Penanganan error

- PDF tidak ada: tampilkan pesan "CV segera hadir".
- Clipboard tidak tersedia: sembunyikan tombol salin, link `mailto:` tetap ada.
- Link lagu kosong: pakai link pencarian Spotify.
- URL tidak dikenal: tampilkan halaman 404 (sudah ada). `dist/404.html` tetap dibuat saat build untuk GitHub Pages.

## Pengujian

**Otomatis (Vitest + React Testing Library + jsdom):**

- Reducer `useWindowManager`: open, close (reset posisi), focus (urutan zIndex dan `activeId`), minimize lalu open lagi (posisi tetap), minimize memindahkan `activeId`, toggleMaximize bolak-balik, open pada jendela yang sudah terbuka hanya memfokuskan.
- `MusicApp`: tiap lagu memiliki link yang benar, dan lagu tanpa link memakai URL pencarian Spotify.
- `ContactApp`: tombol salin memanggil clipboard dan menampilkan "Tersalin ✓".
- `Home`: menampilkan Desktop saat `matchMedia` tidak cocok dan HomeScreen saat cocok (dengan mock `matchMedia`).

**Manual di browser (desktop 1440px dan HP 390px):** geser jendela beserta batasnya, fokus, ketiga tombol lampu lalu lintas, efek Dock, jam di menu bar, membuka dan menutup aplikasi di HP, serta tombol Back browser.

**Syarat selesai:** `npm run build`, `npm run lint`, dan `npm test` lolos.
