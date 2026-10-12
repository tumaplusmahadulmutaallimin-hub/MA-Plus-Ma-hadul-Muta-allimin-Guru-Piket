import React, { useState } from 'react';
import { Siswa } from '../../types';
import { useApp } from '../../context/AppContext';
import { MadrasahLogo } from './MadrasahLogo';
import {
  Printer,
  X,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  Award,
  Utensils,
  BookOpen,
  Sparkles,
  Search,
  Filter
} from 'lucide-react';

interface KartuKendaliModalProps {
  initialSiswa?: Siswa | null;
  isOpen: boolean;
  onClose: () => void;
}

export const KartuKendaliModal: React.FC<KartuKendaliModalProps> = ({
  initialSiswa,
  isOpen,
  onClose
}) => {
  const { siswaList, madrasahInfo } = useApp();
  const [selectedId, setSelectedId] = useState<string>(
    initialSiswa?.id || siswaList[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');

  if (!isOpen) return null;

  const currentSiswa =
    siswaList.find((s) => s.id === selectedId) ||
    initialSiswa ||
    siswaList[0];

  const handlePrint = () => {
    window.print();
  };

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
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="p-4 sm:px-6 bg-gradient-to-r from-emerald-800 via-teal-800 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-emerald-700/60 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide">
                Kartu Kendali Ketertiban &amp; KBM Santri
              </h3>
              <p className="text-[11px] text-emerald-200">
                Format Resmi Dokumen MA Plus Ma'hadul Muta'allimin Katerban-Ngawi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Kartu Kendali (Print / PDF)</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter & Selector Bar (Hidden when printing) */}
        <div className="p-3 sm:px-6 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs print:hidden">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari santri berdasarkan nama / NIS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-emerald-600 text-xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Filter Kelas:</span>
            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:outline-none text-xs"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="X A">Kelas X A</option>
              <option value="X B">Kelas X B</option>
              <option value="XI A">Kelas XI A</option>
              <option value="XI B">Kelas XI B</option>
              <option value="XII A">Kelas XII A</option>
              <option value="XII B">Kelas XII B</option>
            </select>

            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-emerald-500 bg-emerald-50 text-emerald-900 font-bold focus:outline-none text-xs max-w-[220px] truncate"
            >
              {filteredOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nama} ({s.kelas})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Printable Document Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/60 print:bg-white print:p-0 print:overflow-visible">
          {currentSiswa ? (
            <div
              id="printable-kartu-kendali"
              className="max-w-[780px] mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-300 text-slate-900 font-sans print:border-none print:shadow-none print:p-0 print:max-w-none"
            >
              {/* Kop Surat Resmi Madrasah Aliyah Plus Ma'hadul Muta'allimin */}
              <div className="border-b-2 border-slate-900 pb-3 text-center">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-18 h-18 shrink-0 flex items-center justify-center">
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

              {/* Document Header Title */}
              <div className="text-center my-4">
                <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 underline underline-offset-4">
                  KARTU KENDALI PRESTASI, KETERTIBAN &amp; KBM SANTRI
                </h3>
                <p className="text-[11px] font-semibold text-slate-600 mt-1">
                  Nomor Induk Madrasah: {currentSiswa.nis} • Tahun Ajaran 2026/2027
                </p>
              </div>

              {/* Biodata Santri Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 mb-5">
                <div className="flex items-start justify-between border-b border-slate-200/80 pb-1.5">
                  <span className="text-slate-500 font-medium">Nama Lengkap:</span>
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
                  <span className="text-slate-500 font-medium">Nama Wali Santri:</span>
                  <span className="font-semibold text-slate-800">
                    {currentSiswa.namaWali || 'Wali Santri'}
                  </span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-500 font-medium">Porsi MBG (Makan Bergizi):</span>
                  <span className="font-bold text-amber-800 flex items-center gap-1">
                    <Utensils className="w-3 h-3 text-amber-600" />
                    Penerima Terdaftar
                  </span>
                </div>
              </div>

              {/* Matriks Tiga Pilar: Three in One Indicator */}
              <div className="mb-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-emerald-950 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  Capaian Kendali Mandiri "Three In One"
                </h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                    <div className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                      1. PILAR RELIGIUS
                    </div>
                    <div className="text-base font-black text-emerald-950 mt-1">
                      MUMTAZ (A)
                    </div>
                    <p className="text-[9.5px] text-slate-600 mt-0.5">
                      Jamaah Shalat, Tahfidz &amp; Kitab Pesantren
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
                    <div className="text-[10px] font-extrabold text-blue-800 uppercase tracking-wider">
                      2. PILAR SAINS
                    </div>
                    <div className="text-base font-black text-blue-950 mt-1">
                      TUNTAS (88.5)
                    </div>
                    <p className="text-[9.5px] text-slate-600 mt-0.5">
                      KBM Teori &amp; Praktikum Lab IPA/Sains
                    </p>
                  </div>
                  <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                    <div className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">
                      3. PILAR SKILL
                    </div>
                    <div className="text-base font-black text-amber-950 mt-1">
                      TERAMPIL (A)
                    </div>
                    <p className="text-[9.5px] text-slate-600 mt-0.5">
                      TIK Komputer &amp; Vokasi Pondok
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabel Lembar Kendali Harian / Mingguan */}
              <div className="mb-5">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 mb-2">
                  Lembar Kendali Kedisiplinan &amp; Kehadiran KBM
                </h4>
                <div className="border border-slate-300 rounded-lg overflow-hidden">
                  <table className="w-full text-[11px] text-left">
                    <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-300">
                      <tr>
                        <th className="p-2 text-center w-10">No</th>
                        <th className="p-2 w-28">Aspek Kendali</th>
                        <th className="p-2">Uraian / Target Madrasah</th>
                        <th className="p-2 text-center w-24">Status</th>
                        <th className="p-2 text-center w-24">Paraf Piket</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-slate-800">
                      <tr>
                        <td className="p-2 text-center font-mono">1</td>
                        <td className="p-2 font-semibold">Kehadiran KBM</td>
                        <td className="p-2">Masuk kelas tepat waktu pukul 07.00 WIB setiap hari aktif</td>
                        <td className="p-2 text-center font-bold text-emerald-700">Tertib (Hadir)</td>
                        <td className="p-2 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-mono">2</td>
                        <td className="p-2 font-semibold">Ibadah Jamaah</td>
                        <td className="p-2">Shalat Dzuhur berjamaah di Masjid Ma'hadul Muta'allimin</td>
                        <td className="p-2 text-center font-bold text-emerald-700">Istiqomah</td>
                        <td className="p-2 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-mono">3</td>
                        <td className="p-2 font-semibold">Ketertiban Atribut</td>
                        <td className="p-2">Seragam madrasah lengkap, peci hitam/jilbab resmi madrasah</td>
                        <td className="p-2 text-center font-bold text-emerald-700">Lengkap</td>
                        <td className="p-2 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-mono">4</td>
                        <td className="p-2 font-semibold">Izin Keluar Kampus</td>
                        <td className="p-2">Tidak keluar lingkungan madrasah/pesantren tanpa surat izin resmi piket</td>
                        <td className="p-2 text-center font-bold text-emerald-700">Terpantau</td>
                        <td className="p-2 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-center font-mono">5</td>
                        <td className="p-2 font-semibold">Program MBG</td>
                        <td className="p-2">Makan bersama tertib di ruang santri dengan doa dan adab</td>
                        <td className="p-2 text-center font-bold text-amber-700">Tertib Adab</td>
                        <td className="p-2 text-center text-slate-400 font-mono">✓ Tervalidasi</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Status Pelanggaran & Catatan Wali Kelas */}
              <div className="grid grid-cols-2 gap-4 text-xs mb-6">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-800">Catatan Poin Tata Tertib:</div>
                  <div className="text-xl font-black text-emerald-700 mt-1">
                    {(currentSiswa as any).poinPelanggaran || 0} Poin Pelanggaran
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Santri berprestasi baik dan bersih dari pelanggaran disiplin.
                  </p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-800">Catatan Pembinaan Guru Piket:</div>
                  <p className="text-[11px] text-slate-700 mt-1 italic leading-relaxed">
                    "Tingkatkan istiqomah belajar sains dan hafalan Al-Qur'an serta aktif dalam kegiatan ekstrakurikuler madrasah."
                  </p>
                </div>
              </div>

              {/* Tanda Tangan & Pengesahan Dokumen */}
              <div className="grid grid-cols-3 gap-4 text-center text-xs pt-4 border-t border-slate-300">
                <div className="space-y-12">
                  <p className="font-semibold text-slate-700">Mengetahui,<br />Orang Tua / Wali Santri</p>
                  <p className="font-bold text-slate-900 border-t border-slate-400 mx-4 pt-1">
                    ( {currentSiswa.namaWali || '................................'} )
                  </p>
                </div>

                <div className="space-y-12">
                  <p className="font-semibold text-slate-700">Katerban, Ngawi<br />Guru Piket Harian</p>
                  <p className="font-bold text-slate-900 border-t border-slate-400 mx-4 pt-1">
                    ( M. Zainal Abidin, M.Pd )
                  </p>
                </div>

                <div className="space-y-12">
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

              {/* Footer stempel watermark */}
              <div className="mt-4 pt-2 border-t border-dashed border-slate-200 text-center text-[9px] text-slate-400">
                Dokumen Resmi SIM MA Plus Ma'hadul Muta'allimin Katerban-Ngawi • Dicetak secara digital dan sah
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              Santri tidak ditemukan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
