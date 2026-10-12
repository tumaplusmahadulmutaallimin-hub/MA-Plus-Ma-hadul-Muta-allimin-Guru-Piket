import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  MapPin,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Building2,
  Clock
} from 'lucide-react';

interface DataMapelRuangViewProps {
  initialTab?: 'mapel' | 'ruang';
}

export const DataMapelRuangView: React.FC<DataMapelRuangViewProps> = ({ initialTab = 'mapel' }) => {
  const { mapelList, setMapelList, ruangList, setRuangList, confirmAction, alertSuccess } = useApp();
  const [activeTab, setActiveTab] = useState<'mapel' | 'ruang'>(initialTab);
  const [searchMapel, setSearchMapel] = useState('');
  const [searchRuang, setSearchRuang] = useState('');

  // Modals
  const [showAddMapelModal, setShowAddMapelModal] = useState(false);
  const [showAddRuangModal, setShowAddRuangModal] = useState(false);

  // Form states
  const [newMapel, setNewMapel] = useState({
    kode: '',
    nama: '',
    kelompok: 'Kelompok A (Umum)',
    jamPekan: 2
  });

  const [newRuang, setNewRuang] = useState({
    nama: '',
    gedung: 'Gedung Utama Lt. 1',
    kapasitas: 32,
    kondisi: 'Baik',
    tipe: 'Ruang Kelas Teori'
  });

  const filteredMapel = mapelList.filter((m) =>
    m.nama.toLowerCase().includes(searchMapel.toLowerCase()) ||
    m.kode.toLowerCase().includes(searchMapel.toLowerCase()) ||
    m.kelompok.toLowerCase().includes(searchMapel.toLowerCase())
  );

  const filteredRuang = ruangList.filter((r: any) =>
    r.nama.toLowerCase().includes(searchRuang.toLowerCase()) ||
    r.gedung.toLowerCase().includes(searchRuang.toLowerCase()) ||
    (r.tipe || r.kategori || '').toLowerCase().includes(searchRuang.toLowerCase())
  );

  const handleSaveMapel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMapel.nama) return;

    const item: any = {
      id: `m-${Date.now()}`,
      kode: newMapel.kode || `MP-${Math.floor(100 + Math.random() * 900)}`,
      nama: newMapel.nama,
      kelompok: newMapel.kelompok,
      jamPekan: newMapel.jamPekan,
      kkm: 75
    };

    setMapelList(prev => [item, ...prev]);
    setShowAddMapelModal(false);
    alertSuccess('Mapel Ditambahkan', `Mata pelajaran "${newMapel.nama}" berhasil didaftarkan ke kurikulum.`);
    setNewMapel({ kode: '', nama: '', kelompok: 'Kelompok A (Umum)', jamPekan: 2 });
  };

  const handleSaveRuang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuang.nama) return;

    const item: any = {
      id: `r-${Date.now()}`,
      kode: `R-${Math.floor(10 + Math.random() * 90)}`,
      nama: newRuang.nama,
      gedung: newRuang.gedung,
      kapasitas: newRuang.kapasitas,
      kondisi: newRuang.kondisi,
      tipe: newRuang.tipe
    };

    setRuangList(prev => [item, ...prev]);
    setShowAddRuangModal(false);
    alertSuccess('Ruangan Ditambahkan', `Ruang/lokasi "${newRuang.nama}" berhasil ditambahkan.`);
    setNewRuang({ nama: '', gedung: 'Gedung Utama Lt. 1', kapasitas: 32, kondisi: 'Baik', tipe: 'Ruang Kelas Teori' });
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('mapel')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'mapel'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Data Mata Pelajaran ({mapelList.length})
        </button>
        <button
          onClick={() => setActiveTab('ruang')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors ${
            activeTab === 'ruang'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          Data Ruangan & Lokasi KBM ({ruangList.length})
        </button>
      </div>

      {activeTab === 'mapel' ? (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari mata pelajaran, kode, kelompok..."
                value={searchMapel}
                onChange={(e) => setSearchMapel(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <button
              onClick={() => setShowAddMapelModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Mapel</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">No</th>
                  <th className="py-3 px-4">Kode</th>
                  <th className="py-3 px-4">Nama Mata Pelajaran</th>
                  <th className="py-3 px-4">Kelompok Mapel</th>
                  <th className="py-3 px-4 text-center">Beban Jam / Pekan</th>
                  <th className="py-3 px-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredMapel.map((m, idx) => (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-4 font-mono text-xs font-bold text-emerald-700">{m.kode}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{m.nama}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        m.kelompok.includes('Agama')
                          ? 'bg-emerald-100 text-emerald-800'
                          : m.kelompok.includes('Peminatan')
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {m.kelompok}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">
                      {(m as any).jamPekan || m.kkm || 2} Jam
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => {
                          confirmAction({
                            isDanger: true,
                            title: 'Hapus Mata Pelajaran',
                            message: `Apakah Anda yakin ingin menghapus mata pelajaran "${m.nama}" (${m.kode})?`,
                            confirmText: 'Ya, Hapus',
                            onConfirm: () => {
                              setMapelList(prev => prev.filter(x => x.id !== m.id));
                              alertSuccess('Mapel Dihapus', `Mata pelajaran ${m.nama} berhasil dihapus.`);
                            }
                          });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Hapus Mapel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Cari ruang kelas, laboratorium, gedung..."
                value={searchRuang}
                onChange={(e) => setSearchRuang(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <button
              onClick={() => setShowAddRuangModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>+ Tambah Ruang</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredRuang.map((r: any) => (
              <div key={r.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800">{r.nama}</h4>
                      <p className="text-xs text-slate-400 font-mono">{r.kode} • {r.gedung}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      (r.kondisi || r.status || 'Baik') === 'Baik' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {r.kondisi || r.status || 'Baik'}
                    </span>
                    <button
                      onClick={() => {
                        confirmAction({
                          isDanger: true,
                          title: 'Hapus Ruangan',
                          message: `Apakah Anda yakin ingin menghapus ruangan "${r.nama}"?`,
                          confirmText: 'Ya, Hapus',
                          onConfirm: () => {
                            setRuangList(prev => prev.filter(x => x.id !== r.id));
                            alertSuccess('Ruangan Dihapus', `Ruangan ${r.nama} berhasil dihapus.`);
                          }
                        });
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                      title="Hapus Ruangan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tipe Fasilitas:</span>
                    <span className="font-semibold text-slate-700">{r.tipe || r.kategori || 'Fasilitas KBM'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Kapasitas Maksimal:</span>
                    <span className="font-semibold text-slate-700">{r.kapasitas} Orang</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Koneksi Proyektor / AC:</span>
                    <span className="font-semibold text-emerald-700">Tersedia</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Tambah Mapel */}
      {showAddMapelModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Tambah Mata Pelajaran Baru</h3>
              <button onClick={() => setShowAddMapelModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveMapel} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Fiqih Ibadah"
                  value={newMapel.nama}
                  onChange={(e) => setNewMapel({ ...newMapel, nama: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Mapel</label>
                  <input
                    type="text"
                    placeholder="Contoh: FIQ-10"
                    value={newMapel.kode}
                    onChange={(e) => setNewMapel({ ...newMapel, kode: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jam / Pekan</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newMapel.jamPekan}
                    onChange={(e) => setNewMapel({ ...newMapel, jamPekan: parseInt(e.target.value) || 2 })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kelompok Mata Pelajaran</label>
                <select
                  value={newMapel.kelompok}
                  onChange={(e) => setNewMapel({ ...newMapel, kelompok: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                >
                  <option value="Kelompok A (Umum)">Kelompok A (Umum)</option>
                  <option value="Kelompok B (Umum)">Kelompok B (Umum)</option>
                  <option value="Kelompok Peminatan MIPA">Kelompok Peminatan MIPA</option>
                  <option value="Kelompok Peminatan IPS">Kelompok Peminatan IPS</option>
                  <option value="Pendidikan Agama Islam">Pendidikan Agama Islam</option>
                  <option value="Muatan Lokal Madrasah">Muatan Lokal Madrasah</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddMapelModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Simpan Mapel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Ruang */}
      {showAddRuangModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Tambah Ruangan / Fasilitas Baru</h3>
              <button onClick={() => setShowAddRuangModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveRuang} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Ruangan *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Lab Bahasa & Multimedia"
                  value={newRuang.nama}
                  onChange={(e) => setNewRuang({ ...newRuang, nama: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gedung / Lokasi</label>
                  <input
                    type="text"
                    placeholder="Gedung Barat Lt. 2"
                    value={newRuang.gedung}
                    onChange={(e) => setNewRuang({ ...newRuang, gedung: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kapasitas (Siswa)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newRuang.kapasitas}
                    onChange={(e) => setNewRuang({ ...newRuang, kapasitas: parseInt(e.target.value) || 30 })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRuangModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg cursor-pointer"
                >
                  Simpan Ruangan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
