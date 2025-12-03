# 🔢 Simulasi PayLater Indonesia  
**Hitung cicilan, bunga, dan estimasi denda keterlambatan dari berbagai platform PayLater populer di Indonesia.**  
Dibangun dengan **React + Vite** dan **Tailwind CSS**.

---

## 🚀 Demo Aplikasi
**Live Demo:**  
👉 https://simulasi-paylater.vercel.app/

---

## 📌 Tentang Aplikasi
Aplikasi **Simulasi PayLater Indonesia** dibuat untuk membantu pengguna memahami:

- Estimasi cicilan bulanan
- Total bunga selama tenor
- Biaya admin awal
- Simulasi denda keterlambatan
- Perbandingan platform PayLater

Platform yang saat ini didukung:

| Platform | Estimasi Bunga | Tipe Denda |
|---------|----------------|------------|
| SPayLater | ±2.95% / bulan | 5% dari cicilan (simulasi) |
| Kredivo | ±2.6% / bulan | ~10% dari cicilan (simulasi) |
| GoPayLater | ±2.5% / bulan | Rp 50.000 / Rp 80.000 (fixed tier) |
| Traveloka PayLater | ±3.5% / bulan | 5% dari cicilan |
| Akulaku | ±2.8% / bulan | 6% dari cicilan |

> **Catatan:** Semua angka di atas adalah *estimasi simulasi*, bukan data resmi.  
> Nilai bunga dan denda setiap platform dapat berubah sewaktu-waktu.

---

## 🧮 Fitur Utama

### 🔸 1. Input Pokok Pinjaman  
Pengguna memasukkan nilai kredit (misal: Rp 1.500.000).

### 🔸 2. Pilihan Platform PayLater  
Dengan icon interaktif:

- Shopee SPayLater  
- Kredivo  
- GoPayLater  
- Traveloka PayLater  
- Akulaku  

### 🔸 3. Pilihan Tenor  
Tenor simulasi: **1, 3, 6, 12 bulan**.

### 🔸 4. Simulasi Keterlambatan  
Masukkan total hari keterlambatan → aplikasi menghitung:

- berapa siklus denda  
- total denda  
- tagihan yang harus dibayar bulan tersebut  

### 🔸 5. Hasil Perhitungan Lengkap
Aplikasi menampilkan:

- Angsuran bulanan (flat rate)
- Total bunga selama tenor
- Biaya admin awal
- Total kewajiban akhir
- Total denda (jika telat)
- Total tagihan bulan itu (angsuran + denda)

### 🔸 6. UI Modern & Responsif  
Dibangun menggunakan:

- **React**
- **Tailwind CSS**
- **Lucide React Icons**

---

## 🛠️ Teknologi yang Digunakan

| Teknologi | Keterangan |
|----------|------------|
| React + Vite | Frontend framework & bundler |
| Tailwind CSS | Utility-first styling |
| Lucide Icons | Ikon modern & ringan |
| JavaScript | Bahasa utama |
| Vercel | Deployment |