# DMS Converter

Sebuah aplikasi web Front-End modern untuk mengonversi koordinat geografis antara format **Decimal Degrees (DD)** dan **Degrees, Minutes, Seconds (DMS)** secara presisi. Proyek ini dilengkapi dengan peta interaktif menggunakan OpenLayers untuk memvisualisasikan titik koordinat dan memilih koordinat langsung dari peta.


## Fitur Utama

- **Konversi Dua Arah**: Mengonversi dari format DD ke DMS dan sebaliknya dengan akurat.
- **Penanda Lokasi**: Penanda lokasi untuk menandai titik koordinat pada peta.
- **Integrasi Peta Interaktif**: Didukung oleh OpenLayers untuk melihat titik koordinat pada peta, klik pada peta untuk mengisi otomatis form koordinat, dan melihat perubahan secara *real-time*.
- **Validasi Input**: Validasi *real-time* untuk mencegah input koordinat yang tidak valid (misalnya garis lintang yang melebihi ±90°, menit/detik di luar batas, serta kasus khusus seperti kutub/batas penanggalan internasional).

## Teknologi yang Digunakan (Tech Stack)

- **Framework:** React dengan TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Map:** OpenLayers
- **Icons:** Lucide React
- **Testing:** Jest, ts-jest, dan React Testing Library
- **Formatting:** ESLint dan Prettier

## Persyaratan Sistem

Pastikan Anda telah menginstal perangkat lunak berikut di komputer Anda sebelum melanjutkan:
- **Node.js** (Disarankan versi v18.0.0 atau lebih baru)
- **npm** (Bawaan dari Node.js)

---

## Instalasi & Persiapan

Ikuti langkah-langkah sederhana berikut untuk menjalankan proyek ini di komputer lokal Anda.

### 1. Clone repository
Buka terminal Anda, *clone* proyek ini, lalu masuk ke direktori proyek:
```bash
git clone <url git>
cd dms-converter
```
*(Catatan: Ganti `<url-repository-anda>` dengan URL Git yang sebenarnya dari proyek ini)*

### 2. Install dependencies
Instal semua paket yang dibutuhkan menggunakan npm:
```bash
npm install
```

---

## Menjalankan Aplikasi

Untuk memulai *development server* menggunakan Vite:

```bash
npm run dev
```

Setelah server berjalan, buka browser Anda dan kunjungi:
**[http://localhost:5173](http://localhost:5173)**

---

## Pengujian (Testing)

Proyek ini menggunakan Jest untuk menguji algoritma inti konversi koordinat dan validasinya secara ketat, demi menjamin akurasi data geografis.

Untuk menjalankan seluruh *test suite*:
```bash
npm run test
```

*(Perintah ini akan mengeksekusi semua unit test yang berada di dalam direktori `src/__tests__/`).*

---

## Code quality

Proyek ini menerapkan *type-checking* TypeScript yang sangat ketat (termasuk *explicit return types*) serta standar *Clean Code*.

Untuk memeriksa *linting error* di seluruh basis kode:
```bash
npm run lint
```

---

## Gambaran Struktur Proyek

Aplikasi ini menggunakan arsitektur modular yang berbasis komponen:

```text
src/
├── components/
│   ├── ConversionForm/    # Logika konversi utama (DMS ke DD & DD ke DMS)
│   ├── FloatingButton/    # Tombol UI untuk membuka/menutup panel form
│   ├── Map/               # Integrasi OpenLayers Map (MapView)
│   └── ui/                # UI reusable (Input, Button, Select)
├── hooks/                 # Custom React hooks (contoh: useMapPoints)
├── types/                 # Interface global TypeScript (DDCoordinate, DMSCoordinate)
├── utils/                 # Algoritma konversi dan validasi
├── __tests__/             # Unit test Jest
├── App.tsx                # Orkestrator utama yang menghubungkan Map dan Form
└── main.tsx               # Entry point aplikasi
```
