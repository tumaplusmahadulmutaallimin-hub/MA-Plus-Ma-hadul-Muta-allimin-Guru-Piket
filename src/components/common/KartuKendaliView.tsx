import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MadrasahLogo } from './MadrasahLogo';
import {
  Printer,
  ShieldCheck,
  Search,
  Sparkles,
  Utensils,
  Award,
  Users,
  CheckCircle2,
  Calendar,
  FileText,
  Download
} from 'lucide-react';

export const KartuKendaliView: React.FC = () => {
  const { siswaList, madrasahInfo, alertSuccess } = useApp();
  const [selectedId, setSelectedId] = useState<string>(siswaList[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');

  const currentSiswa =
    siswaList.find((s) => s.id === selectedId) || siswaList[0];

  const filteredOptions = siswaList.filter((s) => {
    const matchKelas = filterKelas === 'Semua' || s.kelas === filterKelas;
    const matchSearch =
      s.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nis.includes(searchQuery) ||
      (s.nisn || '').includes(searchQuery);
    return matchKelas && matchSearch;
  });

  const isMale =
    currentSiswa?.jenisKelamin === 'L' ||
    currentSiswa?.jenisKelamin === 'Laki-laki';

  return (
    <div className="space-y-6">
      {/* Control Banner (Hidden in print) */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Kartu Kendali Ketertiban &amp; KBM Santri
            </h2>
            <p className="text-xs text-slate-500">
              Dokumen resmi kendali disiplin dan capaian program Tiga Pilar "Three In One" MA Plus Katerban-Ngawi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-900/20 transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <Printer className="w-4 h-4 text-amber-300" />
            <span>Cetak Kartu Kendali (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* Filter and Student Selection Bar (Hidden in print) */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari santri berdasarkan nama / NIS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600 text-xs shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-slate-600 font-bold">Kelas:</span>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-white font-semibold text-slate-700 focus:outline-none text-xs"
          >
            <option value="Semua">Semua Rombel ({siswaList.length} Santri)</option>
            <option value="X A">Kelas X A (24 Santri)</option>
            <option value="X B">Kelas X B (26 Santri)</option>
            <option value="XI A">Kelas XI A (29 Santri)</option>
            <option value="XI B">Kelas XI B (27 Santri)</option>
            <option value="XII A">Kelas XII A (20 Santri)</option>
            <option value="XII B">Kelas XII B (20 Santri)</option>
          </select>

          <span className="text-slate-600 font-bold">Pilih Santri:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-3 py-2 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-900 font-bold focus:outline-none text-xs max-w-[260px] truncate"
          >
            {filteredOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nama} ({s.kelas}) - NIS: {s.nis}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Printable Document Card */}
      {currentSiswa && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm max-w-4xl mx-auto print:border-none print:shadow-none print:p-0 print:max-w-none text-slate-900 font-sans">
          {/* KOP SURAT RESMI */}
          <div className="border-b-2 border-slate-900 pb-3.5 text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="w-20 h-20 shrink-0 flex items-center justify-center">
                <MadrasahLogo size="xl" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
                  YAYASAN PONDOK PESANTREN MA'HADUL MUTA'ALLIMIN
                </h2>
                <h1 className="text-base sm:text-xl font-black uppercase tracking-tight text-emerald-950 leading-tight">
                  MADRASAH ALIYAH PLUS MA'HADUL MUTA'ALLIMIN
                </h1>
                <p className="text-[11px] font-black text-amber-800 uppercase tracking-wide">
                  MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)
                </p>
                <p className="text-[10px] font-extrabold text-emerald-800 uppercase">
                  MADRASAH BERBASIS PONDOK PESANTREN
                </p>
                <p className="text-[10px] text-slate-600 font-mono mt-0.5">
                  NSM: 131235210019 • NPSN: 69982415 • Terakreditasi: A (Unggul)
                </p>
                <p className="text-[9px] text-slate-500">
                  Alamat: Katerban, Kec. Paron, Kab. Ngawi, Jawa Timur 63253 • Email: {madrasahInfo.email}
                </p>
              </div>
            </div>
          </div>

          {/* JUDUL DOKUMEN */}
          <div className="text-center my-4.5">
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 underline underline-offset-4">
              KARTU KENDALI PRESTASI, KETERTIBAN &amp; KBM SANTRI
            </h3>
            <p className="text-[11px] font-semibold text-slate-600 mt-1">
              Tahun Ajaran 2026/2027 • Semester Gasal • Dokumen Kontrol Akademik &amp; Karakter
            </p>
          </div>

          {/* BIODATA SANTRI */}
          <div className="bg-slate-50/80 rounded-2xl p-4.5 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-y-2.5 gap-x-8 mb-6">
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Nama Lengkap Santri:</span>
              <span className="font-extrabold text-slate-900 text-right">{currentSiswa.nama}</span>
            </div>
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Nomor Induk Siswa (NIS):</span>
              <span className="font-bold text-slate-800 font-mono">{currentSiswa.nis}</span>
            </div>
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Kelas / Rombel:</span>
              <span className="font-extrabold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {currentSiswa.kelas}
              </span>
            </div>
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">NISN:</span>
              <span className="font-bold text-slate-800 font-mono">
                {(currentSiswa as any).nisn || currentSiswa.nis}
              </span>
            </div>
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Jenis Kelamin:</span>
              <span className="font-semibold text-slate-800">
                {isMale ? 'Laki-laki (Putra)' : 'Perempuan (Putri)'}
              </span>
            </div>
            <div className="flex items-start justify-between border-b border-slate-200/80 pb-1.5">
              <span className="text-slate-500 font-medium">Status Santri:</span>
              <span className="font-semibold text-slate-800">
                Santri Mukim Pondok Pesantren
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Nama Orang Tua / Wali:</span>
              <span className="font-semibold text-slate-800">
                {currentSiswa.namaWali || 'Wali Santri'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span className="text-slate-500 font-medium">Program Makan Bergizi (MBG):</span>
              <span className="font-bold text-amber-800 flex items-center gap-1">
                <Utensils className="w-3.5 h-3.5 text-amber-600" />
                Penerima MBG Terdaftar
              </span>
            </div>
          </div>

          {/* TIGA PILAR UTAMA */}
          <div className="mb-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              Matriks Capaian Tiga Pilar "Three In One"
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-center">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <div className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                  1. PILAR RELIGIUS
                </div>
                <div className="text-lg font-black text-emerald-950 mt-1">
                  MUMTAZ (A)
                </div>
                <p className="text-[9.5px] text-slate-600 mt-1">
                  Shalat Berjamaah, Tahfidz Al-Qur'an, Tajwid &amp; Kitab Kuning
                </p>
              </div>
              <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl">
                <div className="text-[10px] font-black text-blue-800 uppercase tracking-wider">
                  2. PILAR SAINS
                </div>
                <div className="text-lg font-black text-blue-950 mt-1">
                  TUNTAS (88.5)
                </div>
                <p className="text-[9.5px] text-slate-600 mt-1">
                  KBM Kelas &amp; Praktikum Laboratorium Sains (Biologi, Fisika, Kimia)
                </p>
              </div>
              <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl">
                <div className="text-[10px] font-black text-amber-800 uppercase tracking-wider">
                  3. PILAR SKILL
                </div>
                <div className="text-lg font-black text-amber-950 mt-1">
                  TERAMPIL (A)
                </div>
                <p className="text-[9.5px] text-slate-600 mt-1">
                  Teknologi Informasi &amp; Komputer (TIK) serta Keterampilan Mandiri
                </p>
              </div>
            </div>
          </div>

          {/* LEMBAR KENDALI HARIAN */}
          <div className="mb-6">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2.5">
              Lembar Validasi &amp; Catatan Kedisiplinan KBM
            </h4>
            <div className="border border-slate-300 rounded-xl overflow-hidden">
              <table className="w-full text-[11px] text-left">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
                  <tr>
                    <th className="p-2.5 text-center w-10">No</th>
                    <th className="p-2.5 w-32">Aspek Kendali</th>
                    <th className="p-2.5">Uraian Standar &amp; Target Madrasah</th>
                    <th className="p-2.5 text-center w-28">Status Keaktifan</th>
                    <th className="p-2.5 text-center w-28">Paraf Piket</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  <tr>
                    <td className="p-2.5 text-center font-mono">1</td>
                    <td className="p-2.5 font-semibold">Kehadiran KBM</td>
                    <td className="p-2.5">Masuk kelas tepat waktu pukul 07.00 WIB setiap hari aktif KBM</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700">Tertib (Hadir Prima)</td>
                    <td className="p-2.5 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-mono">2</td>
                    <td className="p-2.5 font-semibold">Ibadah Jamaah</td>
                    <td className="p-2.5">Shalat Dzuhur berjamaah di Masjid Ma'hadul Muta'allimin</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700">Istiqomah</td>
                    <td className="p-2.5 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-mono">3</td>
                    <td className="p-2.5 font-semibold">Ketertiban Atribut</td>
                    <td className="p-2.5">Seragam madrasah rapi, bersepatu hitam, peci hitam/jilbab resmi</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700">Lengkap</td>
                    <td className="p-2.5 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-mono">4</td>
                    <td className="p-2.5 font-semibold">Izin Keluar Kampus</td>
                    <td className="p-2.5">Tidak keluar lingkungan tanpa surat izin resmi dari guru piket</td>
                    <td className="p-2.5 text-center font-bold text-emerald-700">Terpantau</td>
                    <td className="p-2.5 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-center font-mono">5</td>
                    <td className="p-2.5 font-semibold">Program MBG</td>
                    <td className="p-2.5">Makan bergizi tertib dengan adab pesantren dan menjaga kebersihan</td>
                    <td className="p-2.5 text-center font-bold text-amber-700">Tertib Adab</td>
                    <td className="p-2.5 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* STATUS POIN & REKOMENDASI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-8">
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="font-bold text-slate-800">Catatan Poin Tata Tertib:</div>
              <div className="text-xl font-black text-emerald-700 mt-1">
                {(currentSiswa as any).poinPelanggaran || 0} Poin Pelanggaran
              </div>
              <p className="text-[10px] text-slate-500 mt-0.5">
                Santri teladan, taat peraturan dan bebas dari sanksi kedisiplinan.
              </p>
            </div>
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="font-bold text-slate-800">Catatan Pembinaan Guru Piket &amp; Wali Kelas:</div>
              <p className="text-[11px] text-slate-700 mt-1 italic leading-relaxed">
                "Pertahankan ketertiban KBM, istiqomah dalam ibadah harian serta aktif mengembangkan minat sains dan kejuruan."
              </p>
            </div>
          </div>

          {/* TANDA TANGAN RESMI */}
          <div className="grid grid-cols-3 gap-4 text-center text-xs pt-4 border-t border-slate-300">
            <div className="space-y-14">
              <p className="font-semibold text-slate-700">Mengetahui,<br />Orang Tua / Wali Santri</p>
              <p className="font-bold text-slate-900 border-t border-slate-400 mx-4 pt-1">
                ( {currentSiswa.namaWali || '................................'} )
              </p>
            </div>

            <div className="space-y-14">
              <p className="font-semibold text-slate-700">Katerban, Ngawi<br />Guru Piket Harian</p>
              <p className="font-bold text-slate-900 border-t border-slate-400 mx-4 pt-1">
                ( M. Zainal Abidin, M.Pd )
              </p>
            </div>

            <div className="space-y-14">
              <p className="font-semibold text-slate-700">Kepala Madrasah,<br />MA Plus Ma'hadul Muta'allimin</p>
              <div>
                <p className="font-bold text-slate-900 border-t border-slate-400 mx-4 pt-1">
                  {madrasahInfo.kepalaMadrasah}
                </p>
                <p className="text-[9px] text-slate-500 font-mono">
                  NIP. {madrasahInfo.nipKepala}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-6 pt-2 border-t border-dashed border-slate-200 text-center text-[9px] text-slate-400">
            Dokumen Resmi SIM MA Plus Ma'hadul Muta'allimin Katerban-Ngawi • Dicetak secara digital dan sah
          </div>
        </div>
      )}
    </div>
  );
};
