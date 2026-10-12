import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  School,
  Calendar,
  AlertTriangle,
  Camera,
  Eye,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const MonitoringKBMKepalaView: React.FC = () => {
  const { monitoringKBMList, kelasList, alertSuccess } = useApp();
  const [selectedJam, setSelectedJam] = useState<number>(1);
  const [filterKelas, setFilterKelas] = useState('Semua');

  // Preview Photo Modal for Kepala Madrasah
  const [previewPhotoModal, setPreviewPhotoModal] = useState<{
    guruNama: string;
    kelas: string;
    mapel: string;
    jamKe: number;
    waktuHadir: string;
    menitTerlambat: number;
    fotoUrl: string;
    catatan?: string;
  } | null>(null);

  const filtered = monitoringKBMList.filter((m) => {
    const matchJam = m.jamKe === selectedJam;
    const matchKelas = filterKelas === 'Semua' ? true : m.kelas === filterKelas;
    return matchJam && matchKelas;
  });

  return (
    <div className="space-y-6">
      {/* Jam Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((jam) => (
          <button
            key={jam}
            onClick={() => setSelectedJam(jam)}
            className={`flex-1 min-w-[110px] py-3 px-3 text-center rounded-xl transition-all cursor-pointer ${
              selectedJam === jam
                ? 'bg-blue-700 text-white shadow-sm'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="text-xs font-semibold">Jam Ke-{jam}</div>
            <div className={`text-[11px] font-mono mt-0.5 ${selectedJam === jam ? 'text-blue-100' : 'text-slate-400'}`}>
              {jam === 1 ? '07:00 - 07:45' : jam === 2 ? '07:45 - 08:30' : '08:30 - 09:15'}
            </div>
          </button>
        ))}
      </div>

      {/* Toolbar: Filter & Export XLSX */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap">Filter Kelas:</span>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white cursor-pointer"
          >
            <option value="Semua">Semua Rombel (12 Kelas)</option>
            {['XA', 'XB', 'XC', 'XIA', 'XIB', 'XIIA', 'XIIB', 'XIIC'].map((k) => (
              <option key={k} value={k}>
                Kelas {k}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => {
            const headers = ['No', 'Jam Ke', 'Waktu', 'Kelas', 'Mata Pelajaran', 'Guru Jadwal', 'Status Kehadiran', 'Konfirmasi Guru', 'Waktu Hadir', 'Menit Terlambat', 'Catatan Piket'];
            const data = monitoringKBMList.map((item, idx) => [
              idx + 1,
              item.jamKe,
              item.waktu,
              item.kelas,
              item.mapel,
              item.guruJadwal,
              item.statusGuru,
              item.dikonfirmasiGuru ? 'Terkonfirmasi (Ada Foto)' : 'Belum Konfirmasi',
              item.waktuKonfirmasiHadir || '-',
              item.menitTerlambat || 0,
              item.catatan || '-'
            ]);
            exportToXLSX({
              filename: `Rekap_Monitoring_KBM_Kepala_${new Date().toISOString().slice(0, 10)}.xlsx`,
              sheetName: 'Monitoring KBM',
              headers,
              data,
              colWidths: [6, 10, 14, 12, 24, 26, 30, 22, 14, 16, 35]
            });
            alertSuccess('Export Berhasil', 'Rekapitulasi monitoring KBM berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah.');
          }}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
          title="Ekspor ke Excel (.xlsx) dengan kolom sel terpisah"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          <span>Export .xlsx (Monitoring KBM)</span>
        </button>
      </div>

      {/* Classroom Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item: any) => {
          const isLate = item.statusGuru?.toLowerCase().includes('terlambat');
          const isConfirmed = item.dikonfirmasiGuru;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border shadow-xs p-5 space-y-4 transition-colors ${
                isLate ? (isConfirmed ? 'border-amber-300' : 'border-red-300 ring-1 ring-red-200') : 'border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-bold text-base text-slate-800">{item.kelas}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  item.kondisiPembelajaran?.includes('baik')
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {item.kondisiPembelajaran || 'Kondusif'}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400">Mata Pelajaran:</span>
                  <div className="font-semibold text-slate-800 text-sm mt-0.5">{item.mapel}</div>
                </div>

                <div>
                  <span className="text-slate-400">Guru Pengajar / Pengganti:</span>
                  <div className="font-bold text-blue-700 mt-0.5">
                    {item.guruPengganti || item.guruJadwal || 'Zainal Arifin, S.Pd'}
                  </div>
                </div>

                <div className="flex justify-between py-1 border-t border-slate-100 pt-2">
                  <span className="text-slate-400">Status Guru:</span>
                  <span className="font-semibold text-slate-700">{item.statusGuru}</span>
                </div>

                {/* Reminder and Confirmation Badge */}
                {item.notifikasiPeringatanTerkirim && (
                  <div className={`p-2.5 rounded-xl border text-[11px] ${
                    isConfirmed
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span className="flex items-center gap-1">
                        {isConfirmed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        )}
                        <span>
                          {isConfirmed
                            ? `Terlambat ${item.menitTerlambat || 18} Menit (Dikonfirmasi Guru)`
                            : 'Peringatan Terkirim (Menunggu Konfirmasi)'}
                        </span>
                      </span>

                      {item.fotoBuktiKelas && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewPhotoModal({
                              guruNama: item.guruJadwal,
                              kelas: item.kelas,
                              mapel: item.mapel,
                              jamKe: item.jamKe,
                              waktuHadir: item.waktuKonfirmasiHadir || '07:18 WIB',
                              menitTerlambat: item.menitTerlambat || 18,
                              fotoUrl: item.fotoBuktiKelas,
                              catatan: item.catatanKonfirmasiGuru
                            })
                          }
                          className="px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Foto Kelas</span>
                        </button>
                      )}
                    </div>
                    {isConfirmed && item.waktuKonfirmasiHadir && (
                      <p className="text-[10px] text-emerald-700 mt-1">
                        Hadir di kelas pukul {item.waktuKonfirmasiHadir} dengan bukti foto santri.
                      </p>
                    )}
                  </div>
                )}

                <div className="flex justify-between">
                  <span className="text-slate-400">Catatan Piket:</span>
                  <span className="text-slate-600 italic">{item.catatan || 'KBM berjalan lancar'}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Waktu Cek: {item.waktuCek || '07:15 WIB'}</span>
                <span>Pemeriksa: Tim Piket</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Preview Foto untuk Kepala Madrasah */}
      {previewPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Bukti Foto Kehadiran Kelas Siswa (Pimpinan)
                </h4>
                <p className="text-xs text-slate-200 font-semibold mt-0.5">
                  Bapak/Ibu {previewPhotoModal.guruNama} • Kelas {previewPhotoModal.kelas} ({previewPhotoModal.mapel})
                </p>
              </div>
              <button
                onClick={() => setPreviewPhotoModal(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={previewPhotoModal.fotoUrl}
                  alt="Foto Bukti Kelas"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Status Konfirmasi:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                    ✓ Terverifikasi Foto Kelas
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Keterangan Waktu:</span>
                  <span className="font-bold text-amber-700">
                    Terlambat {previewPhotoModal.menitTerlambat} Menit (Tiba {previewPhotoModal.waktuHadir})
                  </span>
                </div>
                {previewPhotoModal.catatan && (
                  <div className="pt-1 border-t border-slate-200 text-slate-600 text-[11px] italic">
                    "{previewPhotoModal.catatan}"
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setPreviewPhotoModal(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
