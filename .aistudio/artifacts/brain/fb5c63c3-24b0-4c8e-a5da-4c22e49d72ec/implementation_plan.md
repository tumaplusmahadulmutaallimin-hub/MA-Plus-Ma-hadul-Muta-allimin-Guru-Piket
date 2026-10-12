# Pembaruan Total Logo Resmi & Master Data MA Plus Ma'hadul Muta'allimin

Pembaruan identitas visual institusi dengan logo resmi MA Plus Ma'hadul Muta'allimin Katerban-Ngawi, implementasi dual tagline "MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)" dan "MADRASAH BERBASIS PONDOK PESANTREN", pembersihan seluruh data dummy, serta integrasi 17 guru resmi dan data santri Kelas X sampai Kelas XII berbasis dokumen otentik madrasah.

### User Review & Critical Decisions

> [!IMPORTANT]
> Keputusan berdasarkan jawaban klarifikasi pengguna:
> - **Cakupan Data**: Menghapus seluruh data dummy dan mengintegrasikan 17 data guru resmi serta seluruh data siswa Kelas X, Kelas XI, dan Kelas XII dengan NIS/NISN otentik dari berkas madrasah.
> - **Penerapan Logo Resmi Baru**: Logo resmi MA Plus Ma'hadul Muta'allimin Katerban-Ngawi diterapkan menyeluruh di Header navigasi, Sidebar, Kop Surat Berita Acara & Laporan Cetak, serta Kartu Kendali Izin Santri.
> - **Tagline & Kontak Resmi**: Tagline *"MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)"* dan *"MADRASAH BERBASIS PONDOK PESANTREN"*, serta email Tata Usaha `tumaplusmahadulmutaallimin@gmail.com` disinkronkan secara konsisten.

- **Confirmed Decision 1**: Mengganti data dummy guru dengan 17 guru otentik MA Plus Katerban-Ngawi (M. Zainal Abidin, M.Pd, Ari Monawati, S.Pd, Arif Syaifudin, S.H, dkk).
- **Confirmed Decision 2**: Mengganti data dummy siswa dengan seluruh santri Kelas X A (24 santri), Kelas X B (26 santri), Kelas XI A (29 santri), Kelas XI B (27 santri), dan Kelas XII sesuai database madrasah.
- **Confirmed Decision 3**: Menyediakan komponen SVG presisi tinggi dan aset logo resmi MA Plus Ma'hadul Muta'allimin Katerban-Ngawi yang tajam dan responsif di semua resolusi layar dan cetak.

---

### 1. Overview & Core Concept

- **What It Does**: Membawa aplikasi SIM Guru Piket & Monitoring KBM ke status *clean production* dengan identitas riil lembaga:
  1. Logo resmi MA Plus Ma'hadul Muta'allimin Katerban-Ngawi (perisai hijau Kemenag, kubah masjid & bulan sabit biru, bola dunia putih-biru, Al-Qur'an kuning terbuka, dan bintang melingkar).
  2. Profil lembaga terverifikasi: NSM 131232050019, Akreditasi A, beralamat di Katerban, Ngawi, Jawa Timur, email `tumaplusmahadulmutaallimin@gmail.com`.
  3. Master data guru: 17 guru riil dengan jabatan, mapel, dan tugas piket/wali kelas yang akurat.
  4. Master data santri: 106+ santri riil dari kelas X A, X B, XI A, XI B, dan XII dengan NIS dan NISN riil.
  5. Seluruh log transaksi dummy (kendala, pelanggaran, siswa terlambat, izin keluar lama) di-purge dan diatur dalam keadaan awal siap operasional.
- **Target Audience / Persona**: Guru Piket, Asatidz Pengampu, Tim Tata Usaha, dan Kepala Madrasah MA Plus Ma'hadul Muta'allimin Katerban-Ngawi.
- **Key Value**: Sistem langsung siap digunakan secara nyata oleh civitas madrasah tanpa tercampur data contoh fiktif.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. *Dashboard & Navigasi Utama*: Pengguna langsung melihat logo resmi madrasah Katerban-Ngawi di pojok kiri atas Header dan Sidebar dengan badge *"MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)"* dan *"MADRASAH BERBASIS PONDOK PESANTREN"*.
  2. *Menu Data Guru*: Menampilkan 17 asatidz resmi madrasah dengan foto avatar profesional, NIP/status kepegawaian, mapel yang diampu, dan status aktif.
  3. *Menu Data Santri*: Tabel santri menampilkan daftar nama riil dari kelas X sampai XII dengan pencarian instan berdasar nama, NIS, atau kelas.
  4. *Modul Cetak Laporan & Kartu Kendali*: Kop surat madrasah otomatis memuat logo resmi tajam berformat vektor, alamat Katerban-Ngawi, NSM, dan email Tata Usaha resmi.
- **Visual Identity & Theme**:
  - *Warna Dominan*: Hijau Kemenag/Madrasah (`#1e7e48`, `#166534`), Emas Pesantren (`#d97706`), dan Biru Langit Globe (`#0284c7`).
  - *Typography*: Inter / Plus Jakarta Sans dikombinasikan dengan angka tabular (`tabular-nums`) untuk NIS dan NISN.
  - *Empty State Elegance*: Jika ada filter yang kosong atau hari baru dimulai, tampilan empty state memberikan pesan ramah dan tombol aksi yang jelas.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Desain Logo Vektor Presisi Tinggi (Crisp Vector Asset)**
  - *Chosen Approach*: Membuat komponen `MadrasahLogo` berbasis SVG detail yang identik 100% dengan logo yang diunggah pengguna, sehingga tajam sempurna di layar Retina, HP, maupun cetak PDF/kertas A4 tanpa pecah pixel.
  - *Why*: Logo berbasis gambar raster seringkali buram pada dokumen kop surat cetak atau ukuran kecil di header mobile.
  - *Alternatives Considered*: Menggunakan gambar raster saja — SVG dipilih sebagai opsi utama dengan fallback gambar.

- **Decision 2: Pembersihan Total (Purge) Data Dummy & Penyimpanan LocalStorage Bersih**
  - *Chosen Approach*: Memperbarui `src/data/mockData.ts` dan menyediakan mekanisme `purgeDummyData()` di `AppContext.tsx` yang membersihkan cache lama dari browser secara otomatis pada pembaruan ini, lalu mengisi dataset resmi 17 guru dan santri kelas X–XII.
  - *Why*: Menjamin browser pengguna tidak lagi memuat nama-nama dummy lama yang tersimpan di `localStorage`.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        DATA RESMI MADRASAH                             │
│  - Logo: MA Plus Ma'hadul Muta'allimin (Katerban - Ngawi)             │
│  - Profil: NSM 131232050019 | Email: tumaplusmahadulmutaallimin@...    │
│  - 17 Guru Resmi (M. Zainal Abidin, Ari Monawati, Arif Syaifudin, dll) │
│  - Santri Resmi: X A (24), X B (26), XI A (29), XI B (27), XII         │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────▼─────────────────┐
                  │    mockData.ts & AppContext.tsx   │
                  │   - INITIAL_MADRASAH_INFO         │
                  │   - INITIAL_GURU (17 guru)        │
                  │   - INITIAL_SISWA (Kelas X - XII) │
                  │   - INITIAL_KELAS                 │
                  └─────────────────┬─────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       │                            │                            │
┌──────▼──────┐              ┌──────▼──────┐              ┌──────▼──────┐
│ Header.tsx  │              │ Sidebar.tsx │              │ Cetak & Kop │
│  & Top Nav  │              │ Navigasi    │              │ Kartu/Surat │
└─────────────┘              └─────────────┘              └─────────────┘
```

- **Rencana File yang Dimodifikasi**:
  1. `src/components/common/MadrasahLogo.tsx`: Komponen logo resmi SVG otentik MA Plus Ma'hadul Muta'allimin Katerban-Ngawi.
  2. `src/data/mockData.ts`: Master data 17 guru resmi, daftar lengkap santri Kelas X A, X B, XI A, XI B, dan XII dengan NIS/NISN otentik, serta kelas resmi.
  3. `src/context/AppContext.tsx`: Inisialisasi data madrasah resmi, sinkronisasi dual tagline, email Tata Usaha, dan pembersihan cache dummy otomatis.
  4. `src/components/common/Header.tsx` & `src/components/common/Sidebar.tsx`: Integrasi logo resmi baru dan penegasan dual tagline institusi.
  5. `src/components/admin/PengaturanSistemView.tsx`: Form identitas madrasah terisi data resmi Katerban-Ngawi dan tombol sinkronisasi.
  6. Kop surat pada laporan piket & kartu kendali izin siswa.
