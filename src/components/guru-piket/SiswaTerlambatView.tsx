import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Search,
  RotateCw,
  Info,
  Lightbulb,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const SiswaTerlambatView: React.FC = () => {
  const { siswaTerlambatList, tindakSiswaTerlambat, alertSuccess } = useApp();
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterJam, setFilterJam] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTindakSiswa, setSelectedTindakSiswa] = useState<any | null>(null);
  const [tindakanPilihan, setTindakanPilihan] = useState<'Teguran' | 'Dicatat' | 'Pembinaan' | 'Panggil Orang Tua'>('Teguran');

  const filteredData = siswaTerlambatList.filter((item) => {
    const matchKelas = filterKelas === 'Semua' || item.kelas === filterKelas;
    const matchJam = filterJam === 'Semua' || String(item.jamKe) === filterJam;
    const matchSearch =
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase());
    return matchKelas && matchJam && matchSearch;
  });

  const handleExportXLSX = () => {
    const headers = ['No', 'Waktu Terlambat', 'Nama Siswa', 'Kelas', 'Jam Ke', 'Menit Terlambat', 'Alasan / Keterangan', 'Tindak Lanjut Piket', 'Status'];
    const rows = filteredData.map((item, idx) => [
      idx + 1,
      item.waktuTerlambat || '07:15',
      item.nama,
      item.kelas,
      `Jam Ke-${item.jamKe}`,
      item.menitTerlambat ? `${item.menitTerlambat} Menit` : '15 Menit',
      item.keterangan || '-',
      item.tindakan || 'Teguran & Pembinaan',
      'Selesai Ditangani'
    ]);

    exportToXLSX({
      filename: `Siswa_Terlambat_MAPLUS_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Siswa Terlambat',
      headers,
      data: rows,
      colWidths: [8, 16, 28, 12, 14, 16, 32, 28, 16]
    });

    alertSuccess(
      'Ekspor Excel Berhasil',
      'Data santri terlambat berhasil diekspor ke format Excel (.xlsx) dengan kolom sel terpisah rapi.'
    );
  };

  return (
    <div className="space-y-6">
      {/* 4 Stat Summary Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Total Terlambat */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              ↑ +5 dari kemarin
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">18</p>
          <p className="text-xs text-slate-500 font-medium">Total Siswa Terlambat Hari Ini</p>
        </div>

        {/* Jam Ke-1 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono">
              66,7%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">12</p>
          <p className="text-xs text-slate-500 font-medium">Terlambat Jam Ke-1</p>
        </div>

        {/* Jam Ke-2 */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono">
              22,2%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">4</p>
          <p className="text-xs text-slate-500 font-medium">Terlambat Jam Ke-2</p>
        </div>

        {/* Jam Ke-3 dst */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded font-mono">
              11,1%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">2</p>
          <p className="text-xs text-slate-500 font-medium">Terlambat Jam Ke-3 dst.</p>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>04/09/2026</span>
        </div>

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
          <option value="XIIB">Kelas XIIB</option>
          <option value="XIIC">Kelas XIIC</option>
        </select>

        <select
          value={filterJam}
          onChange={(e) => setFilterJam(e.target.value)}
          className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
        >
          <option value="Semua">Semua Jam Ke</option>
          <option value="1">Jam Ke 1</option>
          <option value="2">Jam Ke 2</option>
          <option value="3">Jam Ke 3</option>
          <option value="4">Jam Ke 4</option>
          <option value="5">Jam Ke 5</option>
        </select>

        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama siswa, NIS, atau keterangan..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={() => {
            setFilterKelas('Semua');
            setFilterJam('Semua');
            setSearchQuery('');
          }}
          className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
          title="Reset Filter"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={handleExportXLSX}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          title="Ekspor Data Siswa Terlambat ke Excel (.xlsx) dengan kolom sel terpisah"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Export .xlsx</span>
        </button>
      </div>

      {/* Main Grid: Left Table & Right Sidebars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {/* Policy Banner: Rekapitulasi Presensi Siswa Terlambat */}
          <div className="p-4 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-b border-emerald-200 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-black uppercase text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full inline-block mb-1">
                Aturan Rekapitulasi Presensi Madrasah
              </span>
              <p className="text-emerald-900 leading-relaxed">
                Santri terlambat yang <strong>sudah ditindak</strong> oleh Guru Piket (Teguran / Dicatat / Pembinaan) secara resmi <strong>DIAKUI HADIR</strong> dalam rekapitulasi kehadiran madrasah. Berbeda dengan santri yang ditetapkan pada input absensi jam ke-1 yang berstatus <em>Tidak Hadir Permanen</em>.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Daftar Siswa Terlambat & Rekap Kehadiran
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Total Data: {filteredData.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3">Waktu</th>
                  <th className="py-3 px-3">Jam Ke</th>
                  <th className="py-3 px-3">Tindakan Piket</th>
                  <th className="py-3 px-3">Status Rekap</th>
                  <th className="py-3 px-3 text-center">Aksi Piket</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item, idx) => {
                  const isDone = item.sudahDitindak || item.statusKehadiranRekap === 'Dianggap Hadir' || (item.tindakan && item.tindakan !== 'Belum Ditindak');
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-slate-900">{item.nama}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-[160px]">{item.keterangan || '-'}</div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-blue-600">{item.kelas}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-800">
                        {item.waktuTerlambat || '07:15'}
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">
                        Ke-{item.jamKe}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.tindakan === 'Teguran'
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : item.tindakan === 'Dicatat'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : item.tindakan === 'Pembinaan'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : item.tindakan === 'Panggil Orang Tua'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : 'bg-slate-100 text-slate-600 border border-slate-300'
                          }`}
                        >
                          {item.tindakan || 'Teguran'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {isDone ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Dianggap HADIR</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Belum Ditindak</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedTindakSiswa(item);
                            setTindakanPilihan((item.tindakan as any) || 'Teguran');
                          }}
                          className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[10px] font-bold transition-all shadow-2xs cursor-pointer"
                        >
                          {isDone ? 'Ubah Tindakan' : 'Beri Tindakan'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Menampilkan 1 - {filteredData.length} dari 18 data</span>
            <div className="flex items-center gap-1 font-mono font-bold">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                1
              </span>
              <span className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center cursor-pointer text-slate-700">
                2
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Rekap per Kelas & Rekap per Jam */}
        <div className="lg:col-span-4 space-y-4">
          {/* Rekap per Kelas Bar Progress */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Rekap per Kelas
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { kelas: 'XA', count: 3, max: 5 },
                { kelas: 'XB', count: 2, max: 5 },
                { kelas: 'XIA', count: 4, max: 5 },
                { kelas: 'XIB', count: 1, max: 5 },
                { kelas: 'XIIA', count: 3, max: 5 },
                { kelas: 'XIIB', count: 2, max: 5 },
                { kelas: 'XIIC', count: 1, max: 5 },
                { kelas: 'XII-IPA', count: 1, max: 5 },
                { kelas: 'XII-IPS', count: 1, max: 5 }
              ].map((k, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-14 font-bold text-slate-700 text-[11px]">{k.kelas}</span>
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-400 h-full rounded-full"
                      style={{ width: `${(k.count / k.max) * 100}%` }}
                    ></div>
                  </div>
                  <span className="font-mono font-bold text-slate-900 w-4 text-right">
                    {k.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Rekap per Jam Ke */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Rekap per Jam Ke
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { jam: 'Jam Ke-1', count: 12, percent: '66,7%' },
                { jam: 'Jam Ke-2', count: 4, percent: '22,2%' },
                { jam: 'Jam Ke-3', count: 1, percent: '5,6%' },
                { jam: 'Jam Ke-4', count: 1, percent: '5,6%' },
                { jam: 'Jam Ke-5', count: 0, percent: '0%' },
                { jam: 'Jam Ke-6', count: 0, percent: '0%' }
              ].map((j, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-semibold text-slate-700">{j.jam}</span>
                    <span className="font-mono font-bold text-slate-900">
                      {j.count} <span className="text-slate-400 text-[10px]">({j.percent})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: j.percent }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Informasi Box */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-blue-600" />
              <span>Ketentuan Rekapitulasi Presensi:</span>
            </p>
            <ol className="text-[11px] text-slate-600 space-y-1 list-decimal list-inside leading-relaxed">
              <li>Santri terlambat yang telah ditindak otomatis DIAKUI HADIR dalam rekapitulasi madrasah.</li>
              <li>Santri yang tidak hadir jam 1 (monitoring KBM) berstatus Tidak Hadir Permanen.</li>
              <li>Tindakan piket meliputi teguran lisan, pencatatan buku sanksi, atau pembinaan langsung.</li>
            </ol>
          </div>
        </div>
      </div>

      {/* MODAL BERI TINDAKAN SANTRI TERLAMBAT */}
      {selectedTindakSiswa && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Beri Tindakan & Akui Hadir
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    {selectedTindakSiswa.nama} • {selectedTindakSiswa.kelas} (Jam Ke-{selectedTindakSiswa.jamKe})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTindakSiswa(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 leading-relaxed">
              ✅ <strong>Konfirmasi Kebijakan:</strong> Memberikan tindakan kepada santri terlambat ini akan otomatis mencatatnya sebagai <strong>DIANGGAP HADIR</strong> dalam rekapitulasi absensi sekolah.
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                tindakSiswaTerlambat(selectedTindakSiswa.id, tindakanPilihan);
                alertSuccess(
                  'Tindakan Berhasil Ditetapkan',
                  `Santri ${selectedTindakSiswa.nama} berhasil diberi tindakan "${tindakanPilihan}" dan kini resmi DIAKUI HADIR dalam rekapitulasi.`
                );
                setSelectedTindakSiswa(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">
                  Pilih Tindakan Guru Piket <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'Teguran', label: 'Teguran Lisan', desc: 'Peringatan & nasihat di tempat' },
                    { id: 'Dicatat', label: 'Dicatat Buku Piket', desc: 'Pencatatan poin kedisiplinan' },
                    { id: 'Pembinaan', label: 'Pembinaan Piket', desc: 'Tugas khusus kebersihan/hafalan' },
                    { id: 'Panggil Orang Tua', label: 'Panggil Ortu / BK', desc: 'Keterlambatan berulang' }
                  ].map((t) => (
                    <label
                      key={t.id}
                      className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                        tindakanPilihan === t.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold">{t.label}</span>
                        <input
                          type="radio"
                          name="tindakanOption"
                          checked={tindakanPilihan === t.id}
                          onChange={() => setTindakanPilihan(t.id as any)}
                          className="text-emerald-600"
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal mt-1">{t.desc}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedTindakSiswa(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  Tindak & Akui Hadir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
