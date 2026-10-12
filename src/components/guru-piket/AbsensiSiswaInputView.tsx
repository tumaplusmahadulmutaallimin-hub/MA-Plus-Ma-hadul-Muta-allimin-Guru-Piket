import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarCheck,
  Users,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  Save,
  Check,
  Send,
  Calendar,
  RotateCw,
  Utensils
} from 'lucide-react';

export const AbsensiSiswaInputView: React.FC = () => {
  const { kelasList, siswaList, addSiswaTidakMasuk, alertSuccess } = useApp();

  const [selectedKelas, setSelectedKelas] = useState('X - IPA 1');
  const [selectedTanggal, setSelectedTanggal] = useState('2026-09-04');
  const [jamKe, setJamKe] = useState('1 - 2');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Filter students by selected class
  const classStudents = siswaList.filter((s: any) => s.kelas === selectedKelas);

  // Attendance state mapping student id to 'H' | 'S' | 'I' | 'A'
  const [attendance, setAttendance] = useState<Record<string, { status: 'H' | 'S' | 'I' | 'A'; catatan: string }>>(() => {
    const initial: Record<string, { status: 'H' | 'S' | 'I' | 'A'; catatan: string }> = {};
    classStudents.forEach((s: any, idx: number) => {
      // simulate couple absences
      if (idx === 3) initial[s.id] = { status: 'S', catatan: 'Demam flu, surat menyusul' };
      else if (idx === 7) initial[s.id] = { status: 'I', catatan: 'Ada urusan keluarga di luar kota' };
      else initial[s.id] = { status: 'H', catatan: '' };
    });
    return initial;
  });

  const handleStatusChange = (id: string, status: 'H' | 'S' | 'I' | 'A') => {
    setAttendance((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { catatan: '' }),
        status
      }
    }));
  };

  const handleCatatanChange = (id: string, catatan: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || { status: 'H' }),
        catatan
      }
    }));
  };

  const markAllPresent = () => {
    setAttendance((prev) => {
      const next = { ...prev };
      classStudents.forEach((s) => {
        next[s.id] = { status: 'H', catatan: '' };
      });
      return next;
    });
  };

  // Counts
  const counts = classStudents.reduce(
    (acc, s) => {
      const st = attendance[s.id]?.status || 'H';
      acc[st] = (acc[st] || 0) + 1;
      return acc;
    },
    { H: 0, S: 0, I: 0, A: 0 } as Record<'H' | 'S' | 'I' | 'A', number>
  );

  const handleSave = () => {
    // Push absences to global state
    classStudents.forEach((s) => {
      const rec = attendance[s.id];
      if (rec && rec.status !== 'H') {
        const keteranganType = rec.status === 'S' ? 'Sakit' : rec.status === 'I' ? 'Izin' : 'Alpa';
        addSiswaTidakMasuk({
          id: `stm-${Date.now()}-${s.id}`,
          siswaId: s.id,
          nama: s.nama,
          nis: s.nis,
          kelas: s.kelas,
          keterangan: keteranganType,
          alasan: rec.catatan || `Tercatat ${keteranganType} pada jam ke ${jamKe}`,
          tanggal: selectedTanggal,
          suratAda: rec.status === 'S',
          penerimaMBG: s.penerimaMBG
        });
      }
    });

    setSavedSuccess(true);
    alertSuccess('Presensi Berhasil Disimpan', `Presensi kelas ${selectedKelas} (${counts.H} Hadir, ${counts.S} Sakit, ${counts.I} Izin, ${counts.A} Alpa) berhasil disimpan dan disinkronkan ke rekapitulasi.`);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Selection */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Tanggal Presensi
            </label>
            <input
              type="date"
              value={selectedTanggal}
              onChange={(e) => setSelectedTanggal(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Rombel / Kelas
            </label>
            <select
              value={selectedKelas}
              onChange={(e) => setSelectedKelas(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white font-semibold text-blue-700"
            >
              {kelasList.map((k) => (
                <option key={k.id} value={k.nama}>
                  {k.nama} ({k.jumlahSiswa} Siswa)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Sesi Jam Pelajaran
            </label>
            <select
              value={jamKe}
              onChange={(e) => setJamKe(e.target.value)}
              className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 font-medium"
            >
              <option value="1 - 2">Jam ke 1 - 2 (Pagi)</option>
              <option value="3 - 4">Jam ke 3 - 4 (Menjelang Istirahat)</option>
              <option value="5 - 6">Jam ke 5 - 6 (Siang)</option>
              <option value="7 - 8">Jam ke 7 - 8 (Sore)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={markAllPresent}
            className="px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer flex items-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Tandai Semua Hadir
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Simpan Presensi
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Presensi kelas {selectedKelas} berhasil disimpan! Data siswa yang tidak hadir otomatis disinkronkan ke rekap piket dan pengurangan porsi MBG.
          </div>
        </div>
      )}

      {/* Quick Summary Pill Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
          <div className="text-xs text-slate-500 font-medium">Total Santri di Kelas</div>
          <div className="text-xl font-bold text-slate-800 mt-0.5">{classStudents.length} Santri</div>
        </div>

        <div className="bg-emerald-50 p-3.5 rounded-xl border border-emerald-200 text-center">
          <div className="text-xs text-emerald-700 font-semibold">Hadir (H)</div>
          <div className="text-xl font-bold text-emerald-800 mt-0.5">{counts.H} Santri</div>
        </div>

        <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-200 text-center">
          <div className="text-xs text-blue-700 font-semibold">Sakit (S)</div>
          <div className="text-xl font-bold text-blue-800 mt-0.5">{counts.S} Santri</div>
        </div>

        <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-center">
          <div className="text-xs text-amber-700 font-semibold">Izin (I)</div>
          <div className="text-xl font-bold text-amber-800 mt-0.5">{counts.I} Santri</div>
        </div>

        <div className="bg-rose-50 p-3.5 rounded-xl border border-rose-200 text-center">
          <div className="text-xs text-rose-700 font-semibold">Alpa / Tanpa Ket (A)</div>
          <div className="text-xl font-bold text-rose-800 mt-0.5">{counts.A} Santri</div>
        </div>
      </div>

      {/* Attendance Sheet Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-700" />
            Lembar Presensi Peserta Didik — Kelas {selectedKelas}
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Pilihlah salah satu status (H / S / I / A) per siswa
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4 w-28 text-center">NIS</th>
                <th className="py-3 px-4 w-20 text-center">L/P</th>
                <th className="py-3 px-4 w-64 text-center">Status Kehadiran</th>
                <th className="py-3 px-4">Keterangan / Alasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {classStudents.map((s: any, idx: number) => {
                const currentStatus = attendance[s.id]?.status || 'H';
                const currentCatatan = attendance[s.id]?.catatan || '';

                return (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{s.nama}</div>
                      {s.penerimaMBG && (
                        <div className="text-[11px] text-amber-600 flex items-center gap-1 font-medium">
                          <Utensils className="w-3 h-3" />
                          MBG Aktif
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-500">{s.nis}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        s.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {s.jenisKelamin === 'L' ? 'L' : 'P'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'H')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                            currentStatus === 'H'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          H
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'S')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                            currentStatus === 'S'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          S
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'I')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                            currentStatus === 'I'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          I
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStatusChange(s.id, 'A')}
                          className={`px-3 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                            currentStatus === 'A'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          A
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {currentStatus !== 'H' ? (
                        <input
                          type="text"
                          placeholder="Masukkan alasan izin / sakit..."
                          value={currentCatatan}
                          onChange={(e) => handleCatatanChange(s.id, e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs rounded border border-amber-300 bg-amber-50/50 focus:outline-none focus:border-amber-500"
                        />
                      ) : (
                        <span className="text-xs text-slate-400 italic">Hadir di kelas</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
