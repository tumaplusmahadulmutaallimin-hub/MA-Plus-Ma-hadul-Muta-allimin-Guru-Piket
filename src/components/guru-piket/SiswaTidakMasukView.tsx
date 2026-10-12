import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle,
  AlertOctagon,
  Utensils,
  Calendar,
  Search,
  RotateCw,
  LayoutGrid,
  List,
  FileSpreadsheet,
  Printer,
  ChevronRight,
  Info
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const SiswaTidakMasukView: React.FC = () => {
  const { siswas, alertSuccess } = useApp();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [selectedDate, setSelectedDate] = useState('04/09/2026');
  const [filterJenjang, setFilterJenjang] = useState('Semua');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Class absence breakdown with MBG portions
  const classCards = [
    {
      kelas: 'Kelas XA',
      total: 36,
      masuk: 34,
      persen: '94,4%',
      tidakMasuk: 2,
      persenTidak: '5,6%',
      porsiMBG: 34,
      absentList: [
        { nama: 'Ahmad Fauzan', status: 'Sakit' },
        { nama: 'Siti Nur Aisyah', status: 'Izin' }
      ]
    },
    {
      kelas: 'Kelas XB',
      total: 35,
      masuk: 34,
      persen: '97,1%',
      tidakMasuk: 1,
      persenTidak: '2,9%',
      porsiMBG: 34,
      absentList: [
        { nama: 'Nabila Putri', status: 'Izin' }
      ]
    },
    {
      kelas: 'Kelas XC',
      total: 34,
      masuk: 34,
      persen: '100%',
      tidakMasuk: 0,
      persenTidak: '0%',
      porsiMBG: 34,
      absentList: []
    },
    {
      kelas: 'Kelas XIA',
      total: 38,
      masuk: 36,
      persen: '94,7%',
      tidakMasuk: 2,
      persenTidak: '5,3%',
      porsiMBG: 36,
      absentList: [
        { nama: 'Rafi Hidayat', status: 'Alpa' },
        { nama: 'Zahra Maulida', status: 'Sakit' }
      ]
    },
    {
      kelas: 'Kelas XIB',
      total: 37,
      masuk: 37,
      persen: '100%',
      tidakMasuk: 0,
      persenTidak: '0%',
      porsiMBG: 37,
      absentList: []
    },
    {
      kelas: 'Kelas XIIA',
      total: 34,
      masuk: 31,
      persen: '91,2%',
      tidakMasuk: 3,
      persenTidak: '8,8%',
      porsiMBG: 31,
      absentList: [
        { nama: 'Dimas Saputra', status: 'Sakit' },
        { nama: 'Nurul Hidayah', status: 'Izin' },
        { nama: 'Fathan Rizky', status: 'Alpa' }
      ]
    },
    {
      kelas: 'Kelas XIIB',
      total: 35,
      masuk: 34,
      persen: '97,1%',
      tidakMasuk: 1,
      persenTidak: '2,9%',
      porsiMBG: 34,
      absentList: [
        { nama: 'Lailatul Fitri', status: 'Sakit' }
      ]
    },
    {
      kelas: 'Kelas XIIC',
      total: 32,
      masuk: 32,
      persen: '100%',
      tidakMasuk: 0,
      persenTidak: '0%',
      porsiMBG: 32,
      absentList: []
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top 4 KPI Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">368</p>
            <p className="text-xs text-slate-500 font-medium">Total Siswa (Semua Kelas)</p>
          </div>
        </div>

        {/* Siswa Masuk */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">356</p>
              <span className="text-xs font-bold text-emerald-600">96,7%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Siswa Masuk</p>
          </div>
        </div>

        {/* Siswa Tidak Masuk */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">12</p>
              <span className="text-xs font-bold text-red-600">3,3%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Siswa Tidak Masuk</p>
          </div>
        </div>

        {/* Porsi MBG Hari Ini */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 shadow-2xs flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Utensils className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-950 font-mono tabular-nums">356</p>
            <p className="text-xs text-amber-900 font-medium">Porsi MBG Hari Ini</p>
            <span className="text-[10px] text-amber-700 block">(Sesuai siswa hadir)</span>
          </div>
        </div>
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent font-medium focus:outline-hidden w-24"
            />
          </div>

          <select
            value={filterJenjang}
            onChange={(e) => setFilterJenjang(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Jenjang</option>
            <option value="X">Kelas X</option>
            <option value="XI">Kelas XI</option>
            <option value="XII">Kelas XII</option>
          </select>

          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Kelas</option>
            <option value="XA">Kelas XA</option>
            <option value="XB">Kelas XB</option>
            <option value="XIA">Kelas XIA</option>
            <option value="XIIA">Kelas XIIA</option>
          </select>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau kelas..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterKelas('Semua');
              setFilterJenjang('Semua');
              alertSuccess('Data Dimuat Ulang', 'Daftar presensi siswa tidak masuk telah diperbarui.');
            }}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Muat Ulang / Reset Filter"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const headers = ['No', 'Kelas', 'Total Siswa', 'Siswa Masuk', 'Tidak Masuk', 'Porsi MBG', 'Detail Siswa Tidak Masuk'];
              const data = classCards.map((c, idx) => [
                idx + 1,
                c.kelas,
                c.total,
                c.masuk,
                c.tidakMasuk,
                c.porsiMBG,
                c.absentList.map(a => `${a.nama} (${a.status})`).join('; ') || 'Nihil'
              ]);
              exportToXLSX({
                filename: `Rekap_Siswa_Tidak_Masuk_MBG_${new Date().toISOString().slice(0, 10)}.xlsx`,
                sheetName: 'Presensi & MBG',
                headers,
                data,
                colWidths: [6, 16, 14, 14, 14, 14, 45]
              });
              alertSuccess('Export Berhasil', 'Rekap presensi siswa & porsi MBG berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah.');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Ekspor ke Excel (.xlsx) dengan kolom sel terpisah"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export .xlsx</span>
          </button>
        </div>

        {/* View Switcher: Card vs Table */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Tampilan Kartu</span>
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              viewMode === 'table'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Tampilan Tabel</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Class Cards & Right Sidebar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Cards Grid or Table */}
        <div className="lg:col-span-8">
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {classCards.map((cls, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col justify-between hover:border-blue-300 transition-all space-y-3"
                >
                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <h4 className="font-extrabold text-slate-900 text-xs">{cls.kelas}</h4>
                      <span className="text-[11px] font-mono text-slate-400 font-semibold">
                        {cls.total} siswa
                      </span>
                    </div>

                    {/* In / Out Stats */}
                    <div className="grid grid-cols-2 gap-2 my-2.5">
                      <div className="p-2 bg-emerald-50/70 rounded-xl">
                        <span className="text-base font-black text-emerald-700 font-mono block">
                          {cls.masuk}
                        </span>
                        <span className="text-[10px] text-emerald-800 font-medium">
                          Masuk ({cls.persen})
                        </span>
                      </div>
                      <div className="p-2 bg-red-50/70 rounded-xl">
                        <span className="text-base font-black text-red-700 font-mono block">
                          {cls.tidakMasuk}
                        </span>
                        <span className="text-[10px] text-red-800 font-medium">
                          Tidak Masuk ({cls.persenTidak})
                        </span>
                      </div>
                    </div>

                    {/* MBG Portion Tag */}
                    <div className="flex items-center justify-between px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-xs font-semibold text-amber-900 mb-3">
                      <span className="flex items-center gap-1.5">
                        <Utensils className="w-3.5 h-3.5 text-amber-700" />
                        <span>Porsi MBG:</span>
                      </span>
                      <strong className="font-mono text-sm">{cls.porsiMBG}</strong>
                    </div>

                    {/* Absent Students List */}
                    <div className="space-y-1.5 min-h-[60px]">
                      {cls.absentList.length > 0 ? (
                        cls.absentList.map((st, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-center justify-between text-xs py-1 border-b border-slate-50"
                          >
                            <span className="font-medium text-slate-700 truncate pr-2">
                              {st.nama}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                st.status === 'Sakit'
                                  ? 'bg-red-50 text-red-700'
                                  : st.status === 'Izin'
                                  ? 'bg-amber-50 text-amber-700'
                                  : 'bg-rose-50 text-rose-800'
                              }`}
                            >
                              {st.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-slate-400 text-xs">
                          <CheckCircle className="w-4 h-4 mx-auto mb-1 text-emerald-500" />
                          <span>Tidak ada siswa yang tidak masuk</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button className="w-full text-center text-[11px] font-bold text-blue-600 hover:text-blue-800 pt-2 border-t border-slate-100 flex items-center justify-center gap-1">
                    <span>Lihat Detail</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Kelas</th>
                      <th className="py-3 px-4 text-center">Total Siswa</th>
                      <th className="py-3 px-4 text-center">Masuk</th>
                      <th className="py-3 px-4 text-center">Tidak Masuk</th>
                      <th className="py-3 px-4 text-center">Porsi MBG</th>
                      <th className="py-3 px-4">Siswa Tidak Hadir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classCards.map((c, idx) => (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{c.kelas}</td>
                        <td className="py-3 px-4 text-center font-mono">{c.total}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-emerald-600">
                          {c.masuk}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-red-600">
                          {c.tidakMasuk}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-black text-amber-700 bg-amber-50/50">
                          {c.porsiMBG}
                        </td>
                        <td className="py-3 px-4 text-slate-600">
                          {c.absentList.length > 0 ? (
                            c.absentList.map(a => `${a.nama} (${a.status})`).join(', ')
                          ) : (
                            <span className="text-emerald-600 font-medium">Lengkap</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Rekap Keseluruhan, Donut Distribusi, Export */}
        <div className="lg:col-span-4 space-y-4">
          {/* Rekap Keseluruhan */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Rekap Keseluruhan
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Total Siswa</span>
                <span className="font-mono font-bold text-slate-900">368</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Siswa Masuk
                </span>
                <span className="font-mono font-bold text-emerald-600">356 (96,7%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Siswa Tidak Masuk
                </span>
                <span className="font-mono font-bold text-red-600">12 (3,3%)</span>
              </div>
              <div className="flex justify-between items-center py-1 pt-1.5 bg-amber-50/80 p-2 rounded-xl border border-amber-200">
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5 text-amber-700" />
                  <span>Porsi MBG Hari Ini</span>
                </span>
                <span className="font-mono font-black text-amber-950 text-sm">356</span>
              </div>
            </div>
          </div>

          {/* Distribusi Status Ketidakhadiran */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3 text-center">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider text-left">
              Distribusi Status Ketidakhadiran
            </h4>

            <div className="relative w-32 h-32 mx-auto my-3 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="41.7 58.3" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="33.3 66.7" strokeDashoffset="-41.7" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#DC2626" strokeWidth="4.5" strokeDasharray="25.0 75.0" strokeDashoffset="-75.0" />
              </svg>
              <div className="absolute">
                <span className="text-xl font-black text-slate-900 font-mono">12</span>
                <span className="block text-[10px] text-slate-400 font-semibold">Siswa</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-left">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Sakit
                </span>
                <span className="font-mono font-bold text-slate-800">5 (41,7%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Izin
                </span>
                <span className="font-mono font-bold text-slate-800">4 (33,3%)</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-rose-700"></span> Alpa
                </span>
                <span className="font-mono font-bold text-slate-800">3 (25,0%)</span>
              </div>
            </div>
          </div>

          {/* Informasi MBG */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Data siswa tidak masuk diambil dari hasil input pada menu <strong>Monitoring KBM (Jam Ke-1)</strong>. Data ini digunakan sebagai acuan valid pembagian MBG madrasah.
            </p>
          </div>

          {/* Export & Cetak */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              Export & Cetak
            </h4>
            <button
              onClick={() => {
                const headers = ['No', 'Kelas', 'Total Siswa', 'Hadir', 'Tidak Hadir', 'Sakit', 'Izin', 'Alpha', 'Porsi MBG Disalurkan'];
                const rows = classCards.map((c, idx) => {
                  const sakitCount = c.absentList.filter(a => a.status === 'Sakit').length;
                  const izinCount = c.absentList.filter(a => a.status === 'Izin').length;
                  const alphaCount = c.absentList.filter(a => a.status === 'Alpa' || a.status === 'Alpha').length;
                  return [
                    idx + 1,
                    `"${c.kelas}"`,
                    c.total,
                    c.masuk,
                    c.tidakMasuk,
                    sakitCount,
                    izinCount,
                    alphaCount,
                    c.porsiMBG
                  ];
                });
                const csv = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Rekap_Kehadiran_Siswa_${new Date().toISOString().slice(0, 10)}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                alertSuccess('Export Berhasil', 'Data rekap kehadiran dan porsi MBG siswa berhasil diekspor ke file CSV.');
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export ke Excel</span>
            </button>
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap per Kelas</span>
            </button>
            <button
              onClick={() => window.print()}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap Lengkap</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
