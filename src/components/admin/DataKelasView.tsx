import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Kelas } from '../../types';
import {
  School,
  Users,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  MapPin,
  UserCheck
} from 'lucide-react';

export const DataKelasView: React.FC = () => {
  const { kelasList, guruList, siswaList, updateKelas } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [tingkatFilter, setTingkatFilter] = useState<'Semua' | '10' | '11' | '12'>('Semua');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);

  const [formData, setFormData] = useState<any>({
    tingkat: 'X',
    nama: '',
    kode: '',
    waliKelas: '',
    ketuaKelas: '',
    ruang: '',
    kapasitas: 32,
    jumlahSiswa: 0
  });

  const filteredKelas = kelasList.filter((k: any) => {
    const matchSearch =
      k.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.waliKelas.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.ruang || k.ruangan || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchTingkat = tingkatFilter === 'Semua' ? true : k.tingkat?.toString() === tingkatFilter;
    return matchSearch && matchTingkat;
  });

  const handleEdit = (k: Kelas) => {
    setEditingKelas(k);
    setFormData({ ...k });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKelas && editingKelas.id) {
      updateKelas(editingKelas.id, formData);
    }
    setShowAddModal(false);
  };

  const totalSiswaRombel = siswaList.length;

  return (
    <div className="space-y-6">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <School className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{kelasList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Rombel / Kelas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{totalSiswaRombel}</div>
            <div className="text-xs text-slate-500 font-medium">Total Siswa Terdaftar</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{kelasList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Wali Kelas Bertugas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">{kelasList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Ruang Kelas Aktif</div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari kelas, wali kelas, ruang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={tingkatFilter}
            onChange={(e) => setTingkatFilter(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700"
          >
            <option value="Semua">Semua Tingkat</option>
            <option value="10">Kelas 10 (X)</option>
            <option value="11">Kelas 11 (XI)</option>
            <option value="12">Kelas 12 (XII)</option>
          </select>
        </div>

        <button
          onClick={() => {
            setEditingKelas(null);
            setFormData({
              tingkat: 10,
              nama: '',
              kode: '',
              waliKelas: guruList[0]?.nama || '',
              ketuaKelas: '',
              ruangan: 'Gedung A',
              kapasitas: 32,
              jumlahSiswa: 0
            });
            setShowAddModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Tambah Kelas
        </button>
      </div>

      {/* Classes Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 font-semibold text-slate-800">
          Daftar Rombongan Belajar (Rombel) MA PLUS Ma'hadul Muta'allimin
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Kelas</th>
                <th className="py-3 px-4">Tingkat</th>
                <th className="py-3 px-4">Wali Kelas</th>
                <th className="py-3 px-4">Ketua Kelas</th>
                <th className="py-3 px-4">Ruang Lokasi</th>
                <th className="py-3 px-4 text-center">Siswa / Kapasitas</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredKelas.map((k, idx) => (
                <tr key={k.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">{k.nama}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                      Tingkat {k.tingkat}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-800">{k.waliKelas}</td>
                  <td className="py-3.5 px-4 text-slate-600">{k.ketuaKelas || '-'}</td>
                  <td className="py-3.5 px-4 text-slate-600">{k.ruang || k.ruangan || 'Gedung A'}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-semibold text-slate-800">
                      {siswaList.filter((s: any) => s.kelas === k.nama).length}
                    </span>
                    <span className="text-slate-400 text-xs"> / {k.kapasitas}</span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleEdit(k)}
                      className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Kelas */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                {editingKelas ? 'Edit Rombel Kelas' : 'Tambah Rombel Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: X - IPA 1"
                  value={formData.nama || ''}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tingkat</label>
                  <select
                    value={formData.tingkat}
                    onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  >
                    <option value="X">10 (X)</option>
                    <option value="XI">11 (XI)</option>
                    <option value="XII">12 (XII)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ruangan</label>
                  <input
                    type="text"
                    placeholder="Gedung A R.101"
                    value={formData.ruang || formData.ruangan || ''}
                    onChange={(e) => setFormData({ ...formData, ruang: e.target.value, ruangan: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Wali Kelas</label>
                <select
                  value={formData.waliKelas}
                  onChange={(e) => setFormData({ ...formData, waliKelas: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                >
                  {guruList.map((g: any) => (
                    <option key={g.id} value={g.nama}>
                      {g.nama}{g.gelar ? `, ${g.gelar}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kapasitas</label>
                  <input
                    type="number"
                    value={formData.kapasitas || 32}
                    onChange={(e) => setFormData({ ...formData, kapasitas: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Siswa</label>
                  <input
                    type="number"
                    value={formData.jumlahSiswa || 30}
                    onChange={(e) => setFormData({ ...formData, jumlahSiswa: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  Simpan Kelas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
