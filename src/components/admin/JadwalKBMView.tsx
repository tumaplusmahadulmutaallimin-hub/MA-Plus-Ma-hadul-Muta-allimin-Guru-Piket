import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { JadwalKBM } from '../../types';
import {
  Calendar,
  Clock,
  BookOpen,
  School,
  Search,
  Plus,
  Filter,
  Download,
  FileSpreadsheet,
  Users,
  Edit2,
  Trash2,
  X,
  Check,
  Building2,
  MapPin,
  Sparkles
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const JadwalKBMView: React.FC = () => {
  const {
    jadwalKBMList,
    kelasList,
    guruList,
    mapelList,
    ruangList,
    addJadwalKBM,
    updateJadwalKBM,
    deleteJadwalKBM,
    confirmAction,
    alertSuccess
  } = useApp();

  const [selectedHari, setSelectedHari] = useState<string>('Jumat');
  const [selectedKelas, setSelectedKelas] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<JadwalKBM | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    hari: string;
    jamKe: number;
    waktuMulai: string;
    waktuSelesai: string;
    kelas: string;
    mapel: string;
    guru: string;
    ruang: string;
  }>({
    hari: 'Jumat',
    jamKe: 1,
    waktuMulai: '07:00',
    waktuSelesai: '07:45',
    kelas: 'XA',
    mapel: 'Matematika Wajib',
    guru: 'Ahmad Fauzan, S.Pd',
    ruang: 'R-101 (Lt. 1)'
  });

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Default times per period
  const periodTimes: Record<number, { mulai: string; selesai: string }> = {
    1: { mulai: '07:00', selesai: '07:45' },
    2: { mulai: '07:45', selesai: '08:30' },
    3: { mulai: '08:30', selesai: '09:15' },
    4: { mulai: '09:30', selesai: '10:15' },
    5: { mulai: '10:15', selesai: '11:00' },
    6: { mulai: '11:00', selesai: '11:45' },
    7: { mulai: '12:30', selesai: '13:15' },
    8: { mulai: '13:15', selesai: '14:00' }
  };

  const filteredJadwal = jadwalKBMList.filter((j) => {
    const matchHari = j.hari === selectedHari;
    const matchKelas = selectedKelas === 'Semua' ? true : j.kelas === selectedKelas;
    const matchSearch =
      !searchQuery ||
      j.mapel?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.guru || j.guruPengajar || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.kelas?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (j.ruang || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchHari && matchKelas && matchSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    const defaultJam = 1;
    setFormData({
      hari: selectedHari,
      jamKe: defaultJam,
      waktuMulai: periodTimes[defaultJam]?.mulai || '07:00',
      waktuSelesai: periodTimes[defaultJam]?.selesai || '07:45',
      kelas: selectedKelas !== 'Semua' ? selectedKelas : (kelasList[0]?.nama || 'XA'),
      mapel: mapelList[0]?.nama || 'Pendidikan Agama Islam',
      guru: guruList[0]?.nama || 'Ahmad Fauzan, S.Pd',
      ruang: ruangList[0]?.nama || 'Ruang Kelas XA'
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (item: JadwalKBM) => {
    setEditingItem(item);
    const itemJam = Array.isArray(item.jamKe) ? Number(item.jamKe[0]) : Number(item.jamKe);
    setFormData({
      hari: item.hari || selectedHari,
      jamKe: itemJam || 1,
      waktuMulai: item.waktuMulai || '07:00',
      waktuSelesai: item.waktuSelesai || '07:45',
      kelas: item.kelas || 'XA',
      mapel: item.mapel || 'Matematika',
      guru: item.guru || item.guruPengajar || (guruList[0]?.nama || 'Guru Pengajar'),
      ruang: item.ruang || 'Ruang Kelas'
    });
    setShowModal(true);
  };

  const handleSaveJadwal = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingItem) {
      updateJadwalKBM(editingItem.id, {
        hari: formData.hari,
        jamKe: formData.jamKe,
        waktuMulai: formData.waktuMulai,
        waktuSelesai: formData.waktuSelesai,
        kelas: formData.kelas,
        mapel: formData.mapel,
        guru: formData.guru,
        guruPengajar: formData.guru,
        ruang: formData.ruang
      });
      alertSuccess(
        'Jadwal Berhasil Diperbarui',
        `Jadwal ${formData.mapel} kelas ${formData.kelas} hari ${formData.hari} telah diperbarui dan langsung tersinkron ke sistem monitoring KBM.`
      );
    } else {
      addJadwalKBM({
        hari: formData.hari,
        jamKe: formData.jamKe,
        waktuMulai: formData.waktuMulai,
        waktuSelesai: formData.waktuSelesai,
        kelas: formData.kelas,
        mapel: formData.mapel,
        guru: formData.guru,
        guruPengajar: formData.guru,
        ruang: formData.ruang
      });
      alertSuccess(
        'Jadwal Berhasil Ditambahkan',
        `Jadwal baru ${formData.mapel} untuk kelas ${formData.kelas} berhasil ditambahkan ke kalender KBM madrasah.`
      );
    }

    setShowModal(false);
  };

  const handleDeleteJadwal = (item: JadwalKBM) => {
    confirmAction({
      title: 'Hapus Jadwal KBM',
      message: `Apakah Anda yakin ingin menghapus jadwal "${item.mapel}" untuk kelas ${item.kelas} pada hari ${item.hari} Jam Ke-${item.jamKe}?`,
      confirmText: 'Ya, Hapus Jadwal',
      isDanger: true,
      onConfirm: () => {
        deleteJadwalKBM(item.id);
        alertSuccess('Jadwal Dihapus', 'Sesi jadwal KBM telah dihapus dari sistem.');
      }
    });
  };

  const handleExportXLSX = () => {
    const headers = ['No', 'Hari', 'Jam Ke', 'Waktu KBM', 'Kelas / Rombel', 'Mata Pelajaran', 'Guru Pengampu', 'Ruang'];
    const rows = filteredJadwal.map((j, idx) => [
      idx + 1,
      j.hari,
      `Jam Ke-${j.jamKe}`,
      j.waktuMulai && j.waktuSelesai ? `${j.waktuMulai} - ${j.waktuSelesai}` : '-',
      j.kelas,
      j.mapel,
      j.guru || j.guruPengajar || '-',
      j.ruang || '-'
    ]);

    exportToXLSX({
      filename: `Jadwal_KBM_MAPLUS_${selectedHari}_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: `Jadwal ${selectedHari}`,
      headers,
      data: rows,
      colWidths: [8, 14, 14, 18, 16, 28, 28, 16]
    });

    alertSuccess(
      'Ekspor Excel Berhasil',
      `Jadwal KBM hari ${selectedHari} berhasil diekspor ke format Excel (.xlsx) dengan kolom sel terpisah rapi.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Day Selector Tabs */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs overflow-x-auto gap-1">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedHari(d)}
            className={`flex-1 min-w-[100px] py-2.5 px-4 text-center rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedHari === d
                ? 'bg-blue-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {d}
            {d === 'Jumat' && (
              <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded-full ${
                selectedHari === d ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-700 font-bold'
              }`}>
                Hari Ini
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter Kelas:</label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-700 focus:bg-white cursor-pointer"
            >
              <option value="Semua">Semua Kelas</option>
              {kelasList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama}
                </option>
              ))}
            </select>
          </div>

          <div className="relative flex-1 sm:w-48">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari mapel / guru..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white font-medium"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={handleExportXLSX}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl cursor-pointer transition-colors shadow-2xs"
            title="Ekspor Jadwal ke Excel (.xlsx) dengan kolom sel terpisah"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export .xlsx</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-xl cursor-pointer shadow-md shadow-blue-700/20 transition-all uppercase tracking-wide"
          >
            <Plus className="w-4 h-4" />
            <span>+ Atur / Tambah Jadwal</span>
          </button>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap justify-between items-center gap-2">
          <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-700" />
            <span>Jadwal Kegiatan Belajar Mengajar — Hari {selectedHari}</span>
          </div>
          <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-full">
            {filteredJadwal.length} Sesi Terjadwal
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200 uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4 w-24 text-center">Jam Ke</th>
                <th className="py-3 px-4 w-32">Waktu</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4">Guru Pengampu</th>
                <th className="py-3 px-4">Ruang</th>
                <th className="py-3 px-4 text-center w-28">Aksi Manual</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredJadwal.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada jadwal KBM yang ditemukan untuk hari {selectedHari} dengan filter ini.
                  </td>
                </tr>
              ) : (
                filteredJadwal.map((j: any) => (
                  <tr key={j.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                        Jam {Array.isArray(j.jamKe) ? j.jamKe.join(', ') : j.jamKe}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{j.waktuMulai} - {j.waktuSelesai}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">{j.kelas}</td>
                    <td className="py-3.5 px-4 font-bold text-blue-700">{j.mapel}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-800">{j.guru || j.guruPengajar}</td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {j.ruang}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(j)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Ubah / Edit Jadwal"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteJadwal(j)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Jadwal"
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

      {/* MODAL: Tambah / Edit Jadwal KBM Manual Admin */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingItem ? 'Edit Jadwal KBM Manual' : 'Tambah Jadwal KBM Manual'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Data akan langsung terintegrasi ke monitoring KBM & tugas guru
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJadwal} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Hari KBM <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.hari}
                    onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    required
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>
                        Hari {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Ke <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.jamKe}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      const t = periodTimes[num] || { mulai: '07:00', selesai: '07:45' };
                      setFormData({
                        ...formData,
                        jamKe: num,
                        waktuMulai: t.mulai,
                        waktuSelesai: t.selesai
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    required
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <option key={num} value={num}>
                        Jam Ke-{num} ({periodTimes[num]?.mulai || ''} - {periodTimes[num]?.selesai || ''})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    value={formData.waktuMulai}
                    onChange={(e) => setFormData({ ...formData, waktuMulai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    value={formData.waktuSelesai}
                    onChange={(e) => setFormData({ ...formData, waktuSelesai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kelas / Rombel <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.kelas}
                  onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  required
                >
                  {kelasList.map((k) => (
                    <option key={k.id} value={k.nama}>
                      {k.nama} (Wali: {k.waliKelas})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.mapel}
                  onChange={(e) => setFormData({ ...formData, mapel: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  required
                >
                  {mapelList.map((m) => (
                    <option key={m.id} value={m.nama}>
                      {m.nama} ({m.kelompok})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Guru Pengampu <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.guru}
                  onChange={(e) => setFormData({ ...formData, guru: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  required
                >
                  {guruList.map((g) => (
                    <option key={g.id} value={g.nama}>
                      {g.nama} ({g.mapelUtama || 'Guru'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Ruang Pembelajaran
                </label>
                <select
                  value={formData.ruang}
                  onChange={(e) => setFormData({ ...formData, ruang: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {ruangList.map((r) => (
                    <option key={r.id} value={r.nama}>
                      {r.nama} ({r.gedung})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-700/25 cursor-pointer"
                >
                  {editingItem ? 'Simpan Perubahan' : 'Tambah Jadwal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
