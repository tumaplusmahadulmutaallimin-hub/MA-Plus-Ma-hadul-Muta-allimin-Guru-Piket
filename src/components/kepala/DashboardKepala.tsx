import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  GraduationCap,
  BookOpen,
  FileCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  Send,
  Award,
  ChevronRight,
  TrendingUp,
  Megaphone,
  Printer,
  ShieldCheck,
  Utensils
} from 'lucide-react';
import { useLiveDateTime } from '../../utils/dateUtils';

export const DashboardKepala: React.FC = () => {
  const { time, dateFormattedLong } = useLiveDateTime();
  const {
    currentUser,
    setActiveView,
    laporanPiketList,
    kendalaList,
    guruTidakMasukList,
    gurus,
    siswas,
    siswaTidakMasukList,
    confirmAction,
    alertSuccess
  } = useApp();

  const pendingLaporan = laporanPiketList.find((l: any) => l.status === 'Menunggu') || laporanPiketList[0];
  const urgentKendala = kendalaList.filter((k: any) => k.status !== 'Sudah Ditindaklanjuti');

  const totalGuru = gurus.length;
  const guruIzin = guruTidakMasukList.length;
  const guruHadir = Math.max(0, totalGuru - guruIzin);
  const persenGuru = totalGuru > 0 ? ((guruHadir / totalGuru) * 100).toFixed(1) : '100.0';

  const totalSiswa = siswas.length;
  const siswaAbsen = siswaTidakMasukList.length;
  const siswaHadir = Math.max(0, totalSiswa - siswaAbsen);
  const persenSiswa = totalSiswa > 0 ? ((siswaHadir / totalSiswa) * 100).toFixed(1) : '100.0';

  return (
    <div className="space-y-6">
      {/* Executive Welcome Card */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#0F766E] rounded-3xl p-6 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full opacity-10 bg-[radial-gradient(circle_at_center,white,transparent)] pointer-events-none"></div>

        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-400/20 text-amber-300 rounded-full text-xs font-bold border border-amber-400/30">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              PORTAL EKSEKUTIF KEPALA MADRASAH
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              Assalamu'alaikum, {currentUser?.namaLengkap || 'Drs. H. M. Fauzan, M.Pd.I'}
            </h1>
            <p className="text-emerald-100/90 text-xs max-w-2xl leading-relaxed">
              Selamat datang di dashboard monitoring strategis MA PLUS Ma'hadul Muta'allimin. Pantau keterlaksanaan
              KBM hari ini secara real-time, validasi laporan guru piket harian, dan tangani kendala fasilitas madrasah.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-right space-y-1">
            <div className="text-xs text-emerald-200 flex items-center justify-end gap-1.5 font-medium">
              <Calendar className="w-3.5 h-3.5 text-amber-300" />
              {dateFormattedLong} M
            </div>
            <div className="text-xl font-black text-white tracking-wider font-mono">{time} WIB</div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              ● KBM Aktif Real-Time
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Guru Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tingkat Kehadiran Guru</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-slate-800">{persenGuru}%</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-emerald-600">{guruHadir} Hadir</span> •
              <span className="text-rose-600 font-semibold">{guruIzin} Izin/Cuti</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${persenGuru}%` }}></div>
          </div>
        </div>

        {/* Siswa Attendance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Tingkat Kehadiran Santri</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-slate-800">{persenSiswa}%</div>
            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <span className="font-semibold text-blue-600">{siswaHadir} Hadir</span> •
              <span className="text-amber-600 font-semibold">{siswaAbsen} Absen</span>
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${persenSiswa}%` }}></div>
          </div>
        </div>

        {/* KBM Execution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Keterlaksanaan KBM</span>
            <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <div className="text-3xl font-bold text-indigo-700">98.0%</div>
            <div className="text-xs text-slate-500 mt-1">
              Guru pengganti telah terdistribusi ke semua kelas
            </div>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '98%' }}></div>
          </div>
        </div>

        {/* Laporan Piket Status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Laporan Piket Hari Ini</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="my-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              {pendingLaporan?.status || 'Siap Direview'}
            </span>
            <div className="text-xs text-slate-500 mt-2 font-medium">
              Koordinator: {pendingLaporan?.guruPiket || (pendingLaporan as any)?.guruPiketNama || 'Zainal Arifin, S.Pd'}
            </div>
          </div>
          <button
            onClick={() => setActiveView('laporan-guru-piket-kepala')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 cursor-pointer"
          >
            Review & Sahkan Sekarang <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Action Prompt / Review Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl mt-1">
            <FileCheck className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 text-base">Laporan Piket Harian Menunggu Verifikasi</h3>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                Piket Jumat
              </span>
            </div>
            <p className="text-xs text-slate-600 max-w-xl">
              Koordinator piket Bapak Zainal Arifin, S.Pd telah mengirimkan rangkuman KBM hari ini lengkap dengan
              catatan 2 guru berhalangan, 5 siswa terlambat, dan 356 porsi MBG yang terbagikan.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('laporan-guru-piket-kepala')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
          >
            Tinjau Detail
          </button>
          <button
            onClick={() => {
              confirmAction({
                title: 'Sahkan Laporan Piket Harian',
                message: 'Apakah Bapak Kepala Madrasah menyetujui dan mengesahkan seluruh rekap laporan piket harian ini secara digital?',
                confirmText: 'Ya, Sahkan & TTD Digital',
                onConfirm: () => {
                  alertSuccess(
                    'Laporan Telah Disahkan',
                    'Laporan Guru Piket berhasil disetujui dan disahkan secara digital dengan stempel resmi Kepala Madrasah!'
                  );
                }
              });
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            Setujui & Tanda Tangani
          </button>
        </div>
      </div>

      {/* Two Column Layout: Urgent Obstacles & Daily Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Issues Needing Action */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="font-bold text-slate-800 text-sm">Kendala Fasilitas & KBM Perlu Tindak Lanjut</h4>
            </div>
            <button
              onClick={() => setActiveView('kendala-tindak-lanjut-kepala')}
              className="text-xs text-blue-700 font-semibold hover:underline cursor-pointer"
            >
              Lihat Semua ({urgentKendala.length})
            </button>
          </div>

          <div className="space-y-3">
            {urgentKendala.slice(0, 3).map((k: any) => (
              <div
                key={k.id}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-800">{k.judulKendala || k.judul}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                      {k.kategori}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{k.deskripsi}</p>
                  <div className="text-[11px] text-slate-400">
                    Lokasi: {k.lokasi} • Dilaporkan: {k.pelapor || k.pelaporNama}
                  </div>
                </div>

                <button
                  onClick={() => setActiveView('kendala-tindak-lanjut-kepala')}
                  className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold shrink-0 cursor-pointer"
                >
                  Disposisi
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Teacher & MBG Summary */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-700" />
              <h4 className="font-bold text-slate-800 text-sm">Pemantauan Guru Izin & Pengganti</h4>
            </div>
            <button
              onClick={() => setActiveView('monitoring-guru')}
              className="text-xs text-blue-700 font-semibold hover:underline cursor-pointer"
            >
              Detail Guru
            </button>
          </div>

          <div className="space-y-3">
            {guruTidakMasukList.map((g: any) => (
              <div
                key={g.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-slate-800">{g.guruNama}</div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    g.alasan === 'Sakit' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {g.alasan}
                  </span>
                </div>
                <div className="text-xs text-slate-600">Alasan: {g.keterangan}</div>
                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">
                    Guru Pengganti: <span className="text-emerald-700 font-bold">{g.jadwalTerdampak?.[0]?.guruPengganti || 'M. Ridwan, S.Kom'}</span>
                  </span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Terisi
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
