import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LaporanGuruPiketData } from '../../types';
import {
  FileCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Printer,
  Eye,
  FileText,
  UserCheck,
  Send,
  MessageSquare,
  Award
} from 'lucide-react';

export const LaporanPiketKepalaView: React.FC = () => {
  const { laporanPiketList, updateLaporanStatus } = useApp();

  const [selectedLaporan, setSelectedLaporan] = useState<any>(laporanPiketList[0] || null);
  const [catatanKepala, setCatatanKepala] = useState('');
  const [signedSuccess, setSignedSuccess] = useState(false);

  const handleApprove = (id: string) => {
    updateLaporanStatus(id, 'Diterima', catatanKepala || 'Disetujui dan disahkan oleh Kepala Madrasah.');
    setSignedSuccess(true);
    setTimeout(() => setSignedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {signedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Laporan Guru Piket berhasil disetujui & ditandatangani secara digital oleh Kepala Madrasah!
          </div>
        </div>
      )}

      {/* Grid: Left List, Right Detailed Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Laporan Feed */}
        <div className="space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">Daftar Laporan Guru Piket</h3>
          {laporanPiketList.map((lap: any) => {
            const isSelected = selectedLaporan?.id === lap.id;
            return (
              <div
                key={lap.id}
                onClick={() => setSelectedLaporan(lap)}
                className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-slate-800">{lap.hari}, {lap.tanggal}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    lap.status === 'Diterima' || lap.status === 'Disetujui'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {lap.status}
                  </span>
                </div>
                <div className="text-xs text-slate-600 font-medium">Koordinator: {lap.guruPiket}</div>
                <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Waktu: {lap.waktuKirim} WIB</span>
                  <span className="text-blue-700 font-semibold">Tinjau Laporan →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Document Preview & Sign */}
        {selectedLaporan && (
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">
                  Verifikasi Dokumen Resmi
                </span>
                <h2 className="text-lg font-bold text-slate-800 mt-1">
                  Laporan Guru Piket: {selectedLaporan.hari}, {selectedLaporan.tanggal}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Cetak Lembar
                </button>
              </div>
            </div>

            {/* Official Report Content Box */}
            <div className="bg-slate-50/50 p-5 rounded-xl border border-slate-200 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-slate-400">Koordinator Piket:</span>
                  <div className="font-bold text-slate-800">{selectedLaporan.guruPiket}</div>
                </div>
                <div>
                  <span className="text-slate-400">Waktu Pengiriman:</span>
                  <div className="font-semibold text-slate-700">{selectedLaporan.waktuKirim} WIB</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-1">Rangkuman KBM & Presensi</h4>
                <p className="text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {selectedLaporan.ringkasan}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-slate-400 text-[10px]">Guru Izin</div>
                  <div className="font-bold text-rose-600 text-sm">{selectedLaporan.guruTidakMasukCount || 2}</div>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-slate-400 text-[10px]">Siswa Absen</div>
                  <div className="font-bold text-amber-600 text-sm">{selectedLaporan.siswaTidakMasukCount || 12}</div>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-slate-400 text-[10px]">Siswa Telat</div>
                  <div className="font-bold text-blue-600 text-sm">{selectedLaporan.siswaTerlambatCount || 5}</div>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <div className="text-slate-400 text-[10px]">MBG Dibagikan</div>
                  <div className="font-bold text-emerald-600 text-sm">356 Porsi</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-700 mb-1">Catatan Evaluasi Guru Piket</h4>
                <p className="text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
                  {selectedLaporan.catatanGuruPiket || 'Seluruh kelas terpantau kondusif dengan kehadiran guru pengganti.'}
                </p>
              </div>
            </div>

            {/* Approval / Sign Box */}
            <div className="p-5 bg-blue-50/70 border border-blue-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-700" />
                <h4 className="font-bold text-blue-900 text-sm">Lembar Pengesahan Kepala Madrasah</h4>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan / Instruksi Kepala Madrasah (Opsional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Contoh: Laporan diterima. Untuk proyektor kelas XI segera ganti unit cadangan dari lab komputer."
                  value={catatanKepala}
                  onChange={(e) => setCatatanKepala(e.target.value)}
                  className="w-full p-2.5 text-xs bg-white rounded-lg border border-blue-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="text-[11px] text-slate-500">
                  Status saat ini:{' '}
                  <span className="font-bold text-slate-800">{selectedLaporan.status}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(selectedLaporan.id)}
                    className="px-5 py-2 text-xs font-bold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Setujui & Tanda Tangani Laporan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
