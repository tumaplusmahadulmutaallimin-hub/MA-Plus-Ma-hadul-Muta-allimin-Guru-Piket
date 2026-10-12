import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Plus,
  Search,
  RotateCw,
  Camera,
  X,
  MapPin,
  Calendar,
  Send,
  Eye,
  Check,
  Building,
  Upload,
  Trash2,
  FileSpreadsheet
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';
import { LaporKendalaData } from '../../types';
import { ImageUploader } from '../common/ImageUploader';

export const LaporKendalaGuruPiketView: React.FC = () => {
  const { kendalaList, addKendala, setKendalaList, confirmAction, alertSuccess, alertError } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedKendala, setSelectedKendala] = useState<LaporKendalaData | null>(kendalaList[0]);
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [formKategori, setFormKategori] = useState<'Fasilitas' | 'Kebersihan' | 'Keamanan' | 'KBM' | 'Kedisiplinan' | 'Teknologi' | 'Lainnya'>('Fasilitas');
  const [formPrioritas, setFormPrioritas] = useState<'Rendah' | 'Sedang' | 'Tinggi' | 'Normal'>('Tinggi');
  const [formJudul, setFormJudul] = useState('');
  const [formLokasi, setFormLokasi] = useState('Ruang Kelas XA');
  const [formDeskripsi, setFormDeskripsi] = useState('');
  const [formTujuan, setFormTujuan] = useState('Bagian Sarpras');
  const [formPhoto, setFormPhoto] = useState<string | null>(null);

  const handleSaveKendala = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formJudul) {
      alertError('Form Belum Lengkap', 'Silakan isi judul kendala fasilitas/sarpras.');
      return;
    }

    addKendala({
      kategori: formKategori,
      prioritas: formPrioritas,
      judulKendala: formJudul,
      lokasi: formLokasi,
      deskripsi: formDeskripsi,
      tujukanKepada: formTujuan,
      fotoUrls: formPhoto ? [formPhoto] : ['/src/assets/images/projector_broken_1791093717920.jpg']
    });

    setShowAddModal(false);
    alertSuccess('Kendala Dilaporkan', `Tiket kendala "${formJudul}" berhasil dicatat dan diteruskan ke ${formTujuan}.`);
    setFormJudul('');
    setFormDeskripsi('');
    setFormPhoto(null);
  };

  const filtered = kendalaList.filter((k) => {
    const matchK = filterKategori === 'Semua' || k.kategori === filterKategori;
    const matchS = filterStatus === 'Semua' || k.status === filterStatus;
    const matchQ =
      k.judulKendala.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.lokasi.toLowerCase().includes(searchQuery.toLowerCase());
    return matchK && matchS && matchQ;
  });

  return (
    <div className="space-y-6">
      {/* 4 Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-slate-400">Bulan Ini</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">12</p>
          <p className="text-xs text-slate-500 font-medium">Total Laporan Bulan Ini</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded font-mono">
              25% dari total
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">3</p>
          <p className="text-xs text-slate-500 font-medium">Perlu Tindak Lanjut</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded font-mono">
              58%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">7</p>
          <p className="text-xs text-slate-500 font-medium">Sudah Ditindaklanjuti</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded font-mono">
              17%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">2</p>
          <p className="text-xs text-slate-500 font-medium">Dalam Proses</p>
        </div>
      </div>

      {/* Main Grid: Left Table & Right Detail Drawer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Filters & Table */}
        <div className="lg:col-span-8 space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>01/09/2026 - 04/09/2026</span>
              </div>

              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="Semua">Semua Kategori</option>
                <option value="Fasilitas">Fasilitas</option>
                <option value="Kebersihan">Kebersihan</option>
                <option value="Keamanan">Keamanan</option>
                <option value="KBM">KBM</option>
                <option value="Kedisiplinan">Kedisiplinan</option>
                <option value="Lainnya">Lainnya</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
              >
                <option value="Semua">Semua Status</option>
                <option value="Dalam Proses">Dalam Proses</option>
                <option value="Sudah Ditindaklanjuti">Sudah Ditindaklanjuti</option>
                <option value="Perlu Tindak Lanjut">Perlu Tindak Lanjut</option>
              </select>

              <div className="relative min-w-[180px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul, lokasi..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white"
                />
              </div>

              <button
                onClick={() => {
                  setFilterKategori('Semua');
                  setFilterStatus('Semua');
                  setSearchQuery('');
                  alertSuccess('Filter Direset', 'Daftar kendala sarpras & madrasah telah disegarkan.');
                }}
                className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
                title="Reset Filter"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  const headers = ['No', 'No Tiket', 'Tanggal & Waktu', 'Kategori', 'Judul Kendala', 'Lokasi', 'Pelapor', 'Prioritas', 'Status', 'Deskripsi'];
                  const data = filtered.map((item, idx) => [
                    idx + 1,
                    item.noTiket,
                    item.tanggalWaktu,
                    item.kategori,
                    item.judulKendala,
                    item.lokasi,
                    item.pelapor,
                    item.prioritas,
                    item.status,
                    item.deskripsi
                  ]);
                  exportToXLSX({
                    filename: `Data_Kendala_Madrasah_${new Date().toISOString().slice(0, 10)}.xlsx`,
                    sheetName: 'Laporan Kendala',
                    headers,
                    data,
                    colWidths: [6, 16, 18, 16, 26, 20, 20, 14, 20, 45]
                  });
                  alertSuccess('Export Berhasil', 'Data kendala berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah.');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Ekspor ke Excel (.xlsx) dengan kolom sel terpisah"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export .xlsx</span>
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all uppercase tracking-wide cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Lapor Kendala Baru</span>
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-3">No</th>
                    <th className="py-3 px-3">Tanggal & Waktu</th>
                    <th className="py-3 px-3">Kategori</th>
                    <th className="py-3 px-3">Judul Kendala</th>
                    <th className="py-3 px-3">Lokasi</th>
                    <th className="py-3 px-3">Pelapor</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((item, idx) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelectedKendala(item)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                        selectedKendala?.id === item.id ? 'bg-blue-50/60' : ''
                      }`}
                    >
                      <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-3 px-3 font-mono text-slate-700">{item.tanggalWaktu}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.kategori === 'Fasilitas'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : item.kategori === 'Kebersihan'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.kategori === 'Keamanan'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {item.kategori}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900">{item.judulKendala}</td>
                      <td className="py-3 px-3 text-slate-600">{item.lokasi}</td>
                      <td className="py-3 px-3 text-slate-700">{item.pelapor}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                            item.status === 'Sudah Ditindaklanjuti'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : item.status === 'Dalam Proses'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedKendala(item)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-blue-600"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Detail Laporan Drawer Panel */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Detail Laporan Kendala
            </h4>
            {selectedKendala?.noTiket && (
              <span className="text-[10px] font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                {selectedKendala.noTiket}
              </span>
            )}
          </div>

          {selectedKendala && (
            <div className="space-y-4 text-xs">
              {/* Photo Attachment */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 h-36 flex items-center justify-center">
                <img
                  src={selectedKendala.fotoUrls?.[0] || '/src/assets/images/projector_broken_1791093717920.jpg'}
                  alt="Foto Kendala"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-blue-800 shadow-xs">
                  {selectedKendala.kategori}
                </span>
              </div>

              <div>
                <h5 className="font-extrabold text-slate-900 text-sm">{selectedKendala.judulKendala}</h5>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {selectedKendala.deskripsi}
                </p>
              </div>

              <div className="space-y-1.5 pt-1 text-[11px] border-t border-slate-100">
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Lokasi Kejadian:</span>
                  <span className="font-bold text-slate-800">{selectedKendala.lokasi}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Pelapor:</span>
                  <span className="font-medium text-slate-800">{selectedKendala.pelapor}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Waktu Lapor:</span>
                  <span className="font-mono text-slate-800">{selectedKendala.tanggalWaktu}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Status Saat Ini:</span>
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                    {selectedKendala.status}
                  </span>
                </div>
              </div>

              {/* Tindak Lanjut Box */}
              <div className="p-3 bg-slate-50 rounded-xl space-y-1 border border-slate-100">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Catatan Tindak Lanjut:
                </p>
                <p className="text-slate-600 text-[11px]">
                  {selectedKendala.tindakLanjutNote || 'Sedang dalam penanganan bagian terkait.'}
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-2 pt-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Riwayat Tindak Lanjut
                </p>
                <div className="space-y-2 pl-2 border-l-2 border-slate-200 ml-1">
                  {selectedKendala.riwayatTindakLanjut?.map((r, rIdx) => (
                    <div key={rIdx} className="relative pl-3 text-[11px]">
                      <span className="absolute -left-[9px] top-1 w-2 h-2 rounded-full bg-blue-600"></span>
                      <span className="font-mono text-slate-400 text-[10px] block">{r.waktu}</span>
                      <span className="text-slate-700 font-medium">{r.keterangan}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    confirmAction({
                      title: 'Konfirmasi Kendala Selesai',
                      message: `Tandai kendala "${selectedKendala.judulKendala}" di lokasi ${selectedKendala.lokasi} telah selesai ditindaklanjuti?`,
                      confirmText: 'Ya, Tandai Selesai',
                      onConfirm: () => {
                        setKendalaList(prev => prev.map(k => {
                          if (k.id === selectedKendala.id) {
                            return {
                              ...k,
                              status: 'Sudah Ditindaklanjuti',
                              riwayatTindakLanjut: [
                                ...k.riwayatTindakLanjut,
                                { waktu: '04 Sep 2026 10:15', keterangan: 'Ditandai selesai oleh Guru Piket' }
                              ]
                            };
                          }
                          return k;
                        }));
                        setSelectedKendala(prev => prev ? { ...prev, status: 'Sudah Ditindaklanjuti' } : null);
                        alertSuccess('Status Diperbarui', 'Kendala sarpras telah ditandai selesai ditindaklanjuti.');
                      }
                    });
                  }}
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Tandai Selesai</span>
                </button>
                <button
                  onClick={() => {
                    confirmAction({
                      isDanger: true,
                      title: 'Hapus Laporan Kendala',
                      message: `Apakah Anda yakin ingin menghapus tiket laporan "${selectedKendala.judulKendala}"?`,
                      confirmText: 'Ya, Hapus',
                      onConfirm: () => {
                        setKendalaList(prev => prev.filter(k => k.id !== selectedKendala.id));
                        setSelectedKendala(null);
                        alertSuccess('Laporan Dihapus', 'Tiket kendala berhasil dihapus.');
                      }
                    });
                  }}
                  className="py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-xl font-bold flex items-center justify-center transition-colors cursor-pointer"
                  title="Hapus Tiket Kendala"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Lapor Kendala Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Lapor Kendala Baru</h3>
                <p className="text-[11px] text-slate-500">Catat kendala atau kejadian yang memerlukan tindak lanjut.</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveKendala} className="space-y-4 my-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    1. Kategori Kendala <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formKategori}
                    onChange={(e) => setFormKategori(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    <option value="Fasilitas">Fasilitas</option>
                    <option value="Kebersihan">Kebersihan</option>
                    <option value="Keamanan">Keamanan</option>
                    <option value="KBM">KBM</option>
                    <option value="Kedisiplinan">Kedisiplinan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    2. Prioritas <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formPrioritas}
                    onChange={(e) => setFormPrioritas(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    <option value="Tinggi">Tinggi (Mendesak)</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Normal">Normal</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  3. Judul Kendala <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formJudul}
                  onChange={(e) => setFormJudul(e.target.value)}
                  placeholder="Contoh: AC tidak dingin, Pintu kelas rusak..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    4. Lokasi / Tempat Kejadian <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formLokasi}
                    onChange={(e) => setFormLokasi(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    <option value="Ruang Kelas XA">Ruang Kelas XA</option>
                    <option value="Ruang Kelas XB">Ruang Kelas XB</option>
                    <option value="Ruang Kelas XIA">Ruang Kelas XIA</option>
                    <option value="Ruang Kelas XIIA">Ruang Kelas XIIA</option>
                    <option value="Laboratorium Komputer">Laboratorium Komputer</option>
                    <option value="Perpustakaan">Perpustakaan</option>
                    <option value="Area Kantin">Area Kantin</option>
                    <option value="Pintu Gerbang Utama">Pintu Gerbang Utama</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    5. Waktu Kejadian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="04/09/2026 09:15"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  6. Deskripsi Kendala <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formDeskripsi}
                  onChange={(e) => setFormDeskripsi(e.target.value)}
                  placeholder="Jelaskan kendala atau kejadian secara detail, kondisi saat ini, dan dampaknya..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  required
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <ImageUploader
                  currentImage={formPhoto || undefined}
                  onImageChange={(img) => setFormPhoto(img)}
                  label="7. Foto Bukti Kendala (Opsional)"
                  sublabel="Unggah foto bukti kerusakan atau pilih sampel. Foto bisa diubah sewaktu-waktu."
                  shape="rectangle"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  8. Tujukan Kepada (Opsional)
                </label>
                <select
                  value={formTujuan}
                  onChange={(e) => setFormTujuan(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                >
                  <option value="Bagian Sarpras">Bagian Sarpras</option>
                  <option value="Tata Usaha">Tata Usaha</option>
                  <option value="Kepala Madrasah">Kepala Madrasah</option>
                  <option value="Tim IT">Tim IT</option>
                </select>
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
                  Simpan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
