import React, { useState } from 'react';
import {
  Tag,
  AlertOctagon,
  AlertTriangle,
  Award,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ShieldAlert,
  DoorOpen,
  Sparkles,
  Clock,
  X,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MasterKategoriItem } from '../../types';

interface KategoriMasterViewProps {
  initialType?: 'tugas-khusus' | 'izin-keluar' | 'tindakan-terlambat' | 'pelanggaran' | 'kendala' | 'program-madrasah';
}

export const KategoriMasterView: React.FC<KategoriMasterViewProps> = ({
  initialType = 'tugas-khusus'
}) => {
  const {
    masterKategoriList,
    tambahMasterKategori,
    editMasterKategori,
    hapusMasterKategori,
    alertSuccess,
    confirmAction
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'tugas-khusus' | 'izin-keluar' | 'tindakan-terlambat' | 'pelanggaran' | 'kendala' | 'program-madrasah'
  >(initialType);

  // Modal State for Manual CRUD
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MasterKategoriItem | null>(null);

  // Form Fields
  const [formNama, setFormNama] = useState('');
  const [formGrup, setFormGrup] = useState<MasterKategoriItem['grup']>('Program Tugas Khusus');
  const [formJenis, setFormJenis] = useState('');
  const [formJam, setFormJam] = useState('');
  const [formKuota, setFormKuota] = useState<number | undefined>(undefined);
  const [formBobotPoin, setFormBobotPoin] = useState<number | undefined>(undefined);
  const [formKeterangan, setFormKeterangan] = useState('');

  const openAddModal = (grup: MasterKategoriItem['grup']) => {
    setEditingItem(null);
    setFormNama('');
    setFormGrup(grup);
    setFormJenis('');
    setFormJam('');
    setFormKuota(grup === 'Izin Keluar' ? 6 : grup === 'Program Tugas Khusus' ? 12 : undefined);
    setFormBobotPoin(grup === 'Bobot Pelanggaran' ? 5 : undefined);
    setFormKeterangan('');
    setModalOpen(true);
  };

  const openEditModal = (item: MasterKategoriItem) => {
    setEditingItem(item);
    setFormNama(item.nama);
    setFormGrup(item.grup);
    setFormJenis(item.jenis || '');
    setFormJam(item.jam || '');
    setFormKuota(item.kuota);
    setFormBobotPoin(item.bobotPoin);
    setFormKeterangan(item.keterangan || '');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNama.trim()) return;

    if (editingItem) {
      editMasterKategori(editingItem.id, {
        nama: formNama.trim(),
        grup: formGrup,
        jenis: formJenis.trim() || undefined,
        jam: formJam.trim() || undefined,
        kuota: formKuota,
        bobotPoin: formBobotPoin,
        keterangan: formKeterangan.trim() || undefined
      });
      alertSuccess('Perubahan Tersimpan', `Kategori "${formNama}" berhasil diperbarui.`);
    } else {
      tambahMasterKategori({
        nama: formNama.trim(),
        grup: formGrup,
        jenis: formJenis.trim() || undefined,
        jam: formJam.trim() || undefined,
        kuota: formKuota,
        bobotPoin: formBobotPoin,
        keterangan: formKeterangan.trim() || undefined
      });
      alertSuccess('Kategori Baru Ditambahkan', `"${formNama}" berhasil ditambahkan secara manual.`);
    }

    setModalOpen(false);
  };

  const handleDelete = (item: MasterKategoriItem) => {
    confirmAction({
      title: 'Hapus Kategori / Program',
      message: `Apakah Anda yakin ingin menghapus "${item.nama}" dari Master Data?`,
      isDanger: true,
      onConfirm: () => {
        hapusMasterKategori(item.id);
        alertSuccess('Dihapus', `Kategori "${item.nama}" telah dihapus.`);
      }
    });
  };

  // Filter items by active tab group
  const tabGrupMap: Record<typeof activeTab, MasterKategoriItem['grup']> = {
    'tugas-khusus': 'Program Tugas Khusus',
    'izin-keluar': 'Izin Keluar',
    'tindakan-terlambat': 'Tindakan Terlambat',
    'pelanggaran': 'Bobot Pelanggaran',
    'kendala': 'Kendala Sarpras',
    'program-madrasah': 'Program Madrasah'
  };

  const currentItems = masterKategoriList.filter(
    k => k.grup === tabGrupMap[activeTab]
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Intro */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <h2 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">
              Master Kategori & Program Operasional
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pengelolaan manual seluruh master kategori, kuota izin, pembinaan terlambat, dan program madrasah tanpa ketergantungan data statis.
          </p>
        </div>

        <button
          onClick={() => openAddModal(tabGrupMap[activeTab])}
          className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/20 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Tambah Data Manual</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-white rounded-t-2xl px-2 gap-1 text-xs">
        <button
          onClick={() => setActiveTab('tugas-khusus')}
          className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'tugas-khusus'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Program Tugas Khusus</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">
            {masterKategoriList.filter(k => k.grup === 'Program Tugas Khusus').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('izin-keluar')}
          className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'izin-keluar'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <DoorOpen className="w-4 h-4" />
          <span>Izin Keluar & Kuota</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">
            {masterKategoriList.filter(k => k.grup === 'Izin Keluar').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('tindakan-terlambat')}
          className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'tindakan-terlambat'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Tindakan Terlambat & Rekap</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">
            {masterKategoriList.filter(k => k.grup === 'Tindakan Terlambat').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('pelanggaran')}
          className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'pelanggaran'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertOctagon className="w-4 h-4" />
          <span>Bobot Poin Tatib</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">
            {masterKategoriList.filter(k => k.grup === 'Bobot Pelanggaran').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('kendala')}
          className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'kendala'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Kendala Sarpras & KBM</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">
            {masterKategoriList.filter(k => k.grup === 'Kendala Sarpras').length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('program-madrasah')}
          className={`px-4 py-3 font-bold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'program-madrasah'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Local Wisdom & MBG</span>
          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full font-mono">
            {masterKategoriList.filter(k => k.grup === 'Program Madrasah').length}
          </span>
        </button>
      </div>

      {/* Table Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800">
            Daftar Master Data: {tabGrupMap[activeTab]}
          </span>
          <span className="text-slate-400 font-mono">
            Total {currentItems.length} Entri Aktif
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px]">
              <tr>
                <th className="py-3 px-4">No</th>
                <th className="py-3 px-4">Nama Program / Kategori</th>
                <th className="py-3 px-4">Jenis / Klasifikasi</th>
                {activeTab === 'tugas-khusus' && <th className="py-3 px-4">Jam Tugas</th>}
                {(activeTab === 'tugas-khusus' || activeTab === 'izin-keluar') && (
                  <th className="py-3 px-4 text-center">Batas Kuota</th>
                )}
                {activeTab === 'pelanggaran' && (
                  <th className="py-3 px-4 text-center">Bobot Poin</th>
                )}
                <th className="py-3 px-4">Keterangan / Ketentuan</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Belum ada kategori yang ditambahkan. Klik tombol <strong>+ Tambah Data Manual</strong> di atas.
                  </td>
                </tr>
              ) : (
                currentItems.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-extrabold text-slate-900">{item.nama}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {item.jenis || '-'}
                      </span>
                    </td>
                    {activeTab === 'tugas-khusus' && (
                      <td className="py-3 px-4 font-mono text-slate-600">{item.jam || '-'}</td>
                    )}
                    {(activeTab === 'tugas-khusus' || activeTab === 'izin-keluar') && (
                      <td className="py-3 px-4 text-center font-bold text-slate-800 font-mono">
                        {item.kuota !== undefined ? `${item.kuota} Siswa` : '-'}
                      </td>
                    )}
                    {activeTab === 'pelanggaran' && (
                      <td className="py-3 px-4 text-center font-bold text-rose-600 font-mono">
                        +{item.bobotPoin || 0}
                      </td>
                    )}
                    <td className="py-3 px-4 text-slate-500 max-w-xs">{item.keterangan || '-'}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openEditModal(item)}
                          className="p-1.5 text-slate-400 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Manual"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL MANUAL CRUD: TAMBAH / EDIT KATEGORI */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5 text-blue-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {editingItem ? 'Edit Master Kategori' : 'Tambah Master Data Manual'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {formGrup} • MA PLUS Ma'hadul Muta'allimin
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kelompok / Grup Data <span className="text-red-500">*</span>
                </label>
                <select
                  value={formGrup}
                  onChange={(e) => setFormGrup(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white cursor-pointer"
                >
                  <option value="Program Tugas Khusus">Program Tugas Khusus (STU)</option>
                  <option value="Izin Keluar">Izin Keluar & Kuota Lingkungan</option>
                  <option value="Tindakan Terlambat">Tindakan Terlambat & Rekap Hadir</option>
                  <option value="Bobot Pelanggaran">Bobot Pelanggaran Tatib</option>
                  <option value="Kendala Sarpras">Kendala Sarpras & Fasilitas</option>
                  <option value="Program Madrasah">Program Khusus (Local Wisdom & MBG)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Kategori / Program <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formNama}
                  onChange={(e) => setFormNama(e.target.value)}
                  placeholder="Contoh: Ke Lab TIK, Izin Sakit, Pembinaan Kebersihan..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-blue-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jenis / Klasifikasi
                  </label>
                  <input
                    type="text"
                    value={formJenis}
                    onChange={(e) => setFormJenis(e.target.value)}
                    placeholder="Misal: Rutin, Darurat, Ringan..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Waktu / Jam Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={formJam}
                    onChange={(e) => setFormJam(e.target.value)}
                    placeholder="Misal: 07:00 - 08:30 / Kondisional"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Batas Kuota Siswa (Jika Ada)
                  </label>
                  <input
                    type="number"
                    value={formKuota ?? ''}
                    onChange={(e) => setFormKuota(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Maksimal siswa..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bobot Poin / Sanksi
                  </label>
                  <input
                    type="number"
                    value={formBobotPoin ?? ''}
                    onChange={(e) => setFormBobotPoin(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Poin kedisiplinan..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan / Ketentuan SOP
                </label>
                <textarea
                  rows={2}
                  value={formKeterangan}
                  onChange={(e) => setFormKeterangan(e.target.value)}
                  placeholder="Tuliskan keterangan detail operasional atau ketentuan teknis..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-700/20 cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambahkan Kategori'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
