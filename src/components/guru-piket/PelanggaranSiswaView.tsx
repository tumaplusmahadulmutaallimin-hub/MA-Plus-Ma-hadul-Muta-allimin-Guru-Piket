import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertOctagon,
  Users,
  CheckCircle2,
  Calendar,
  Plus,
  Search,
  RotateCw,
  Camera,
  Trash2,
  Edit2,
  X,
  Check,
  Upload,
  FileSpreadsheet,
  ShieldCheck
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';
import { PelanggaranSiswaData } from '../../types';
import { ImageUploader } from '../common/ImageUploader';
import { KartuKendaliModal } from '../common/KartuKendaliModal';

export const PelanggaranSiswaView: React.FC = () => {
  const { pelanggaranList, addPelanggaran, setPelanggaranList, siswas, confirmAction, alertSuccess } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showKartuKendaliModal, setShowKartuKendaliModal] = useState(false);
  const [selectedPelanggaran, setSelectedPelanggaran] = useState<PelanggaranSiswaData>(pelanggaranList[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterJenis, setFilterJenis] = useState('Semua');

  // Form states for Add Modal
  const [formSiswa, setFormSiswa] = useState('Ahmad Fauzan');
  const [formKelas, setFormKelas] = useState('XA');
  const [formJenis, setFormJenis] = useState<'Terlambat' | 'Tidak Memakai Atribut' | 'Tidak Masuk KBM' | 'Melanggar Tata Tertib' | 'Lainnya'>('Terlambat');
  const [formTindakan, setFormTindakan] = useState<'Teguran' | 'Dicatat' | 'Peringatan' | 'Panggil Orang Tua' | 'Pembinaan Khusus'>('Teguran');
  const [formKeterangan, setFormKeterangan] = useState('Terlambat masuk kelas setelah istirahat.');
  const [formFoto, setFormFoto] = useState<string | null>(null);

  const handleSavePelanggaran = (e: React.FormEvent) => {
    e.preventDefault();
    addPelanggaran({
      nama: formSiswa,
      kelas: formKelas,
      jenisPelanggaran: formJenis,
      tindakan: formTindakan,
      keterangan: formKeterangan,
      buktiFotoUrl: formFoto || undefined
    });
    setShowAddModal(false);
    alertSuccess('Pelanggaran Dicatat', `Catatan ketertiban untuk santri ${formSiswa} (${formKelas}) berhasil disimpan.`);
  };

  const filtered = pelanggaranList.filter((p) => {
    const matchK = filterKelas === 'Semua' || p.kelas === filterKelas;
    const matchJ = filterJenis === 'Semua' || p.jenisPelanggaran === filterJenis;
    const matchS = p.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchK && matchJ && matchS;
  });

  return (
    <div className="space-y-6">
      {/* 4 Stat Summary Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertOctagon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
              ↑ +4 dari kemarin
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">12</p>
          <p className="text-xs text-slate-500 font-medium">Total Pelanggaran Hari Ini</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">7 siswa unik</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">8</p>
          <p className="text-xs text-slate-500 font-medium">Siswa Melanggar Hari Ini</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
              ≥ 3 kali
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">5</p>
          <p className="text-xs text-slate-500 font-medium">Pelanggaran Berulang</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">September 2026</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">96</p>
          <p className="text-xs text-slate-500 font-medium">Total Pelanggaran Bulan Ini</p>
        </div>
      </div>

      {/* Main Grid: Left Table & Right Stats/Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
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
                <option value="XA">XA</option>
                <option value="XB">XB</option>
                <option value="XIA">XIA</option>
                <option value="XIIA">XIIA</option>
              </select>

              <select
                value={filterJenis}
                onChange={(e) => setFilterJenis(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="Semua">Semua Jenis</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Tidak Memakai Atribut">Tidak Memakai Atribut</option>
                <option value="Tidak Masuk KBM">Tidak Masuk KBM</option>
                <option value="Melanggar Tata Tertib">Melanggar Tata Tertib</option>
              </select>

              <div className="relative min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari siswa, NIS..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white"
                />
              </div>

              <button
                onClick={() => {
                  setFilterKelas('Semua');
                  setFilterJenis('Semua');
                  setSearchQuery('');
                  alertSuccess('Filter Direset', 'Daftar pelanggaran telah disegarkan.');
                }}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
                title="Reset Filter"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const headers = ['No', 'Tanggal', 'Waktu', 'NIS', 'Nama Siswa', 'Kelas', 'Jenis Pelanggaran', 'Tingkat', 'Poin', 'Tindakan', 'Keterangan', 'Dicatat Oleh'];
                  const data = filtered.map((item, idx) => [
                    idx + 1,
                    item.tanggal,
                    item.waktu,
                    item.nis,
                    item.nama,
                    item.kelas,
                    item.jenisPelanggaran,
                    item.tingkat,
                    item.poin,
                    item.tindakan,
                    item.keterangan,
                    item.dicatatOleh
                  ]);
                  exportToXLSX({
                    filename: `Data_Pelanggaran_Siswa_${new Date().toISOString().slice(0, 10)}.xlsx`,
                    sheetName: 'Pelanggaran Siswa',
                    headers,
                    data,
                    colWidths: [6, 12, 10, 14, 26, 10, 22, 12, 8, 18, 35, 20]
                  });
                  alertSuccess('Export Berhasil', 'Data pelanggaran siswa berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Ekspor ke Excel (.xlsx) dengan kolom sel terpisah"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export .xlsx</span>
              </button>

              <button
                type="button"
                onClick={() => setShowKartuKendaliModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Buka Kartu Kendali Santri Berkop Resmi Madrasah"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
                <span>Kartu Kendali</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all uppercase tracking-wide cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Catat Pelanggaran</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3">Waktu</th>
                    <th className="py-3 px-3">Nama Siswa</th>
                    <th className="py-3 px-3">Kelas</th>
                    <th className="py-3 px-3">Jenis Pelanggaran</th>
                    <th className="py-3 px-3">Keterangan</th>
                    <th className="py-3 px-3">Dicatat Oleh</th>
                    <th className="py-3 px-3">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item, idx) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedPelanggaran(item)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                        selectedPelanggaran?.id === item.id ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{item.waktu}</td>
                      <td className="py-3 px-3 font-bold text-slate-900">{item.nama}</td>
                      <td className="py-3 px-3 font-semibold text-blue-600">{item.kelas}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.jenisPelanggaran === 'Terlambat'
                              ? 'bg-amber-50 text-amber-800'
                              : item.jenisPelanggaran === 'Tidak Memakai Atribut'
                              ? 'bg-blue-50 text-blue-800'
                              : item.jenisPelanggaran === 'Tidak Masuk KBM'
                              ? 'bg-rose-50 text-rose-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          {item.jenisPelanggaran}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-xs truncate">
                        {item.keterangan}
                      </td>
                      <td className="py-3 px-3 text-slate-700">{item.dicatatOleh}</td>
                      <td className="py-3 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {item.tindakan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Breakdown & Selected Detail */}
        <div className="lg:col-span-4 space-y-4">
          {/* Jenis Pelanggaran Donut */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Jenis Pelanggaran Hari Ini
            </h4>

            <div className="flex items-center gap-4">
              <div className="relative w-24 h-24 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="41.7 58.3" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="25 75" strokeDashoffset="-41.7" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="16.7 83.3" strokeDashoffset="-66.7" />
                  <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="8.3 91.7" strokeDashoffset="-83.4" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center font-mono font-bold text-sm text-slate-900">
                  <span>12</span>
                  <span className="text-[8px] text-slate-400 font-sans">Kasus</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px] flex-1">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span> Terlambat
                  </span>
                  <span className="font-bold">5 (41,7%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Tidak Masuk KBM
                  </span>
                  <span className="font-bold">3 (25,0%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> Atribut
                  </span>
                  <span className="font-bold">2 (16,7%)</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Tertib
                  </span>
                  <span className="font-bold">1 (8,3%)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top 5 Pelanggar Terbanyak */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Siswa dengan Pelanggaran Terbanyak (Bulan Ini)
            </h4>

            <div className="space-y-2 text-xs">
              {[
                { no: 1, nama: 'Rafi Hidayat (XIA)', count: 8 },
                { no: 2, nama: 'Ahmad Fauzan (XA)', count: 6 },
                { no: 3, nama: 'Dimas Saputra (XIIB)', count: 5 },
                { no: 4, nama: 'Nabila Putri (XB)', count: 4 },
                { no: 5, nama: 'Fathan Rizky (XIB)', count: 4 }
              ].map((s) => (
                <div key={s.no} className="flex items-center justify-between py-1 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center text-[10px]">
                      {s.no}
                    </span>
                    <span className="font-bold text-slate-800">{s.nama}</span>
                  </div>
                  <span className="font-mono font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                    {s.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Detail Pelanggaran Panel */}
          {selectedPelanggaran && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4 text-xs">
              <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                  Detail Pelanggaran
                </h4>
                <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  {selectedPelanggaran.tindakan}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-sm">
                  {selectedPelanggaran.nama.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{selectedPelanggaran.nama}</h5>
                  <p className="text-slate-400 font-mono text-[11px]">
                    NIS: {selectedPelanggaran.nis} · Kelas {selectedPelanggaran.kelas}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Jenis:</span>
                  <span className="font-bold text-slate-800">{selectedPelanggaran.jenisPelanggaran}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Waktu:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedPelanggaran.waktu} WIB</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400">Keterangan:</span>
                  <span className="font-medium text-slate-800 text-right max-w-[180px]">
                    {selectedPelanggaran.keterangan}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Dicatat Oleh:</span>
                  <span className="font-medium text-slate-700">{selectedPelanggaran.dicatatOleh}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    setFormSiswa(selectedPelanggaran.nama);
                    setFormKelas(selectedPelanggaran.kelas);
                    setFormJenis(selectedPelanggaran.jenisPelanggaran as any);
                    setFormTindakan(selectedPelanggaran.tindakan as any);
                    setFormKeterangan(selectedPelanggaran.keterangan);
                    setFormFoto(selectedPelanggaran.buktiFotoUrl || null);
                    setShowAddModal(true);
                  }}
                  className="flex-1 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-emerald-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Ubah Data</span>
                </button>
                <button
                  onClick={() => {
                    confirmAction({
                      isDanger: true,
                      title: 'Hapus Rekam Pelanggaran',
                      message: `Apakah Anda yakin ingin menghapus catatan pelanggaran untuk siswa "${selectedPelanggaran.nama}"?`,
                      confirmText: 'Ya, Hapus',
                      onConfirm: () => {
                        setPelanggaranList(prev => prev.filter(p => p.id !== selectedPelanggaran.id));
                        setSelectedPelanggaran(null as any);
                        alertSuccess('Data Dihapus', 'Catatan pelanggaran siswa berhasil dihapus.');
                      }
                    });
                  }}
                  className="py-2 px-3 bg-red-50 text-red-700 hover:bg-red-100 font-bold rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  title="Hapus Catatan Pelanggaran"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Tambah Pelanggaran Siswa */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tambah Pelanggaran Siswa</h3>
                <p className="text-[11px] text-slate-500">Catat pelanggaran siswa dengan lengkap dan jelas.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePelanggaran} className="space-y-4 my-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  1. Pilih Siswa <span className="text-red-500">*</span>
                </label>
                <select
                  value={formSiswa}
                  onChange={(e) => {
                    setFormSiswa(e.target.value);
                    const s = siswas.find(x => x.nama === e.target.value);
                    if (s) setFormKelas(s.kelas);
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                >
                  {siswas.map((s) => (
                    <option key={s.id} value={s.nama}>
                      {s.nama} ({s.kelas} - NIS: {s.nis})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  2. Waktu Kejadian <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  defaultValue="04/09/2026 07:48"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. Jenis Pelanggaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={formJenis}
                  onChange={(e) => setFormJenis(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                >
                  <option value="Terlambat">Terlambat</option>
                  <option value="Tidak Memakai Atribut">Tidak Memakai Atribut</option>
                  <option value="Tidak Masuk KBM">Tidak Masuk KBM</option>
                  <option value="Melanggar Tata Tertib">Melanggar Tata Tertib</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  4. Keterangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Keterangan detail..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  5. Tindakan <span className="text-red-500">*</span>
                </label>
                <select
                  value={formTindakan}
                  onChange={(e) => setFormTindakan(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                >
                  <option value="Teguran">Teguran Lisan</option>
                  <option value="Dicatat">Dicatat dalam Buku Pelanggaran</option>
                  <option value="Peringatan">Surat Peringatan</option>
                  <option value="Panggil Orang Tua">Panggil Orang Tua</option>
                  <option value="Pembinaan Khusus">Pembinaan Khusus</option>
                </select>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <ImageUploader
                  currentImage={formFoto || undefined}
                  onImageChange={(img) => setFormFoto(img)}
                  label="6. Bukti Foto Pelanggaran (Opsional)"
                  sublabel="Unggah foto bukti dokumentasi. Foto dapat diubah sewaktu-waktu."
                  shape="rectangle"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 tracking-wide uppercase transition-all"
                >
                  Simpan Pelanggaran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Kartu Kendali Resmi Santri */}
      <KartuKendaliModal
        isOpen={showKartuKendaliModal}
        onClose={() => setShowKartuKendaliModal(false)}
      />
    </div>
  );
};
