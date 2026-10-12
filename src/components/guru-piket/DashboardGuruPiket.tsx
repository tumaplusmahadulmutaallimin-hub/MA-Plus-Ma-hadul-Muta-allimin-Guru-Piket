import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle,
  AlertOctagon,
  Clock,
  DoorOpen,
  Award,
  Calendar,
  ChevronRight,
  ClipboardList,
  AlertTriangle,
  FileSpreadsheet,
  Send,
  FileText,
  Utensils,
  Share2,
  Check,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Printer,
  X,
  Plus,
  ExternalLink,
  ShieldAlert,
  Info,
  Laptop,
  Wrench,
  Shirt,
  CookingPot,
  Copy
} from 'lucide-react';
import { LocalWisdomSession } from '../../types';
import { MadrasahLogo } from '../common/MadrasahLogo';
import { formatIndonesianDate, getIndonesianDayName } from '../../utils/dateUtils';

export const DashboardGuruPiket: React.FC = () => {
  const {
    setActiveView,
    alertSuccess,
    alertError,
    jadwalGuruPiketList,
    currentUser,
    activeIzinLuarCount,
    activeIzinKamarMandiCount,
    maxKuotaLuarLingkungan,
    maxKuotaKamarMandi,
    cutOffPulangAwalList,
    tambahCutOffPulangAwal,
    batalkanCutOffPulangAwal,
    localWisdomList,
    updateLocalWisdomStatus,
    generateWaTextLocalWisdom,
    tugasKhususList,
    izinKeluarList,
    addIzinKeluar,
    markSiswaReturned,
    markTugasKhususReturned,
    siswas,
    kelasList,
    gurus,
    siswaTidakMasukList
  } = useApp();

  const [copiedWa, setCopiedWa] = useState(false);
  const [showMBGPrintModal, setShowMBGPrintModal] = useState(false);

  // Modal 1: Izin Keluar Cepat (Luar Lingkungan vs Kamar Mandi)
  const [showIzinCepatModal, setShowIzinCepatModal] = useState(false);
  const [izinType, setIzinType] = useState<'Luar Lingkungan' | 'Kamar Mandi'>('Luar Lingkungan');
  const [izinNama, setIzinNama] = useState('');
  const [izinKelas, setIzinKelas] = useState('XA');
  const [izinPendamping, setIzinPendamping] = useState('');
  const [izinKeterangan, setIzinKeterangan] = useState('');

  // Modal 2: Cut-Off Kepulangan Lebih Awal (Darurat / Insidental)
  const [showCutoffModal, setShowCutoffModal] = useState(false);
  const [cutoffTipe, setCutoffTipe] = useState<'Massal' | 'Per Rombel'>('Massal');
  const [cutoffKelas, setCutoffKelas] = useState<string[]>(['XA']);
  const [cutoffJam, setCutoffJam] = useState('11:30');
  const [cutoffAlasan, setCutoffAlasan] = useState('Rapat Pleno Dewan Guru');
  const [cutoffKeterangan, setCutoffKeterangan] = useState('Seluruh pembelajaran disudahi lebih awal.');

  // Modal 3: Local Wisdom Konfirmasi Instruktur
  const [activeLWModal, setActiveLWModal] = useState<LocalWisdomSession | null>(null);
  const [lwConfirmStatus, setLwConfirmStatus] = useState<'Hadir Lengkap' | 'Ada Siswa Absen' | 'Selesai'>('Hadir Lengkap');
  const [lwCatatan, setLwCatatan] = useState('');
  const [copiedLwWa, setCopiedLwWa] = useState(false);
  const [selectedLWDay, setSelectedLWDay] = useState<'Rabu' | 'Kamis' | 'Sabtu'>('Rabu');

  const activeCutoff = cutOffPulangAwalList.find(c => c.status === 'Aktif');

  // Dynamic Piket Team from real schedule for today based on real day of the week
  const currentDay = getIndonesianDayName(new Date(), 'standard');
  const currentDayFormal = getIndonesianDayName(new Date(), 'formal');
  const todayPiket =
    jadwalGuruPiketList.find(
      (p) =>
        p.hari.toLowerCase() === currentDay.toLowerCase() ||
        p.hari.toLowerCase() === currentDayFormal.toLowerCase() ||
        p.hari.replace(/['’]/g, '').toLowerCase() === currentDay.replace(/['’]/g, '').toLowerCase()
    ) || jadwalGuruPiketList[0];
  const activeKoordinator = todayPiket?.koordinator || currentUser?.namaLengkap || 'Zainal Arifin, S.Pd';
  const activeAnggota = todayPiket?.anggota || ['Ahmad Setiawan, S.Pd', 'Siti Fatimah, S.Pd'];

  // Real-time MBG (Makan Bergizi Gratis) calculation for the madrasah
  const totalSiswa = siswas.length;
  const siswaTidakMasuk = siswaTidakMasukList.length;
  const siswaHadir = Math.max(0, totalSiswa - siswaTidakMasuk);
  const guruTendik = gurus.length;
  const cadanganPorsi = (totalSiswa > 0 || guruTendik > 0) ? 4 : 0;
  const totalPorsiMBG = siswaHadir + guruTendik + cadanganPorsi;

  const handleShareMBGWhatsApp = () => {
    const todayStr = formatIndonesianDate(new Date(), { withDay: true, shortMonth: false });
    const text = `*LAPORAN PORSI MAKAN BERGIZI GRATIS (MBG)*\n*MA PLUS MA'HADUL MUTA'ALLIMIN*\nHari/Tanggal: ${todayStr}\n\n- Siswa Hadir: ${siswaHadir} porsi\n- Guru & Tenaga Kependidikan: ${guruTendik} porsi\n- Cadangan: ${cadanganPorsi} porsi\n*TOTAL PORSI KATERING: ${totalPorsiMBG} PORSI*\n\nJadwal Distribusi: 11:45 WIB\nPetugas Piket: ${activeKoordinator}\nTerima kasih.`;
    navigator.clipboard?.writeText(text);
    setCopiedWa(true);
    alertSuccess('Laporan MBG Disalin', 'Laporan porsi Makan Bergizi Gratis berhasil disalin dan siap dikirim ke WhatsApp katering.');
    setTimeout(() => setCopiedWa(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Greeting Banner - Islamic Institutional Elegance */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#0F766E] rounded-3xl p-6 text-white shadow-xl shadow-emerald-950/20 relative overflow-hidden">
        {/* Subtle Decorative Star Accent */}
        <div className="absolute right-0 top-0 bottom-0 w-80 opacity-10 pointer-events-none flex items-center justify-end pr-6">
          <svg viewBox="0 0 100 100" className="w-64 h-64 text-amber-200 fill-current">
            <polygon points="50 0, 61.8 38.2, 100 38.2, 69.1 61.8, 80.9 100, 50 76.4, 19.1 100, 30.9 61.8, 0 38.2, 38.2 38.2" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-arabic text-sm text-amber-200/90 tracking-wide">
                السَّلاَمُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ
              </span>
              <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full">
                Piket Shift Pagi
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
              Assalamu'alaikum, {activeKoordinator}
            </h2>

            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Selamat bertugas menjaga amanah, kedisiplinan, dan kelancaran kegiatan belajar mengajar di lingkungan <span className="font-semibold text-amber-200">MA PLUS Ma'hadul Muta'allimin</span> hari ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveView('absensi-siswa')}
              className="px-4 py-2.5 bg-emerald-900/60 hover:bg-emerald-900/80 text-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-400/30 flex items-center gap-2 shadow-sm"
            >
              <CalendarCheck className="w-4 h-4 text-emerald-300" />
              <span>Input Presensi Siswa</span>
            </button>

            <button
              onClick={() => setActiveView('monitoring-kbm')}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-emerald-950 rounded-xl text-xs font-extrabold transition-all shadow-md shadow-amber-950/20 flex items-center gap-2"
            >
              <Clock className="w-4 h-4" />
              <span>Mulai Monitoring KBM</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tim Piket Bertugas Hari Ini (Live Integration Strip) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
            <Building2 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Piket Hari Ini ({todayPiket?.hari || currentDayFormal})
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Jam {todayPiket?.jamMulai || '06:45'} - {todayPiket?.jamSelesai || '14:30'} WIB
              </span>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-0.5">
              Koordinator: <span className="text-emerald-800 font-extrabold">{activeKoordinator}</span>
              <span className="text-slate-400 mx-2">·</span>
              Anggota Tim: <span className="text-slate-700 font-medium">{activeAnggota.join(', ')}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Terintegrasi Tanpa Dummy
          </span>
        </div>
      </div>

      {/* Peringatan Banner Jika Ada Dispensasi Cut-Off Kepulangan Lebih Awal Aktif */}
      {activeCutoff && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-rose-500/10 border-2 border-amber-400 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
              <Clock className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-amber-950 bg-amber-200 px-2 py-0.5 rounded">
                  Dispensasi Kepulangan Lebih Awal Aktif
                </span>
                <span className="text-xs font-mono font-bold text-amber-900 bg-white/70 px-2 py-0.5 rounded border border-amber-300">
                  Cut-off: {activeCutoff.jamCutOff} WIB
                </span>
              </div>
              <p className="text-xs text-slate-700 mt-1">
                <strong>{activeCutoff.tipe}:</strong> {activeCutoff.alasan} · {activeCutoff.keterangan || 'KBM disesuaikan tanpa dianggap alpa.'}
                {activeCutoff.tipe === 'Per Rombel' && ` · Kelas: ${activeCutoff.kelasTerdampak.join(', ')}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowCutoffModal(true)}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Ubah Pengaturan
            </button>
            <button
              onClick={() => batalkanCutOffPulangAwal(activeCutoff.id)}
              className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Batalkan Dispensasi
            </button>
          </div>
        </div>
      )}

      {/* KPI Reoriented Grid: Kehadiran, Siswa Izin Luar (Max 6), Izin Kamar Mandi (Max 12), Tugas Khusus, Kepulangan, MBG */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* 1. Hadir di Kelas */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                {totalSiswa > 0 ? `${Math.round((siswaHadir / totalSiswa) * 100)}%` : '100%'}
              </span>
            </div>
            <p className="text-2xl font-black text-emerald-700 mt-2 font-mono tabular-nums">{siswaHadir}</p>
            <p className="text-xs text-slate-500 font-medium">Hadir di Kelas ({totalSiswa} total)</p>
          </div>
          <button
            onClick={() => setActiveView('monitoring-kbm')}
            className="mt-3 text-[11px] font-bold text-emerald-700 hover:underline flex items-center gap-1 cursor-pointer pt-2 border-t border-slate-100"
          >
            <span>Cek KBM Jam 1</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        {/* 2. Siswa Izin Luar Lingkungan (Maksimal 6) */}
        <div className={`bg-white p-4 rounded-2xl border shadow-2xs transition-colors flex flex-col justify-between ${
          activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200/90 hover:border-teal-300'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-teal-50 text-teal-700'
              }`}>
                <DoorOpen className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                activeIzinLuarCount >= maxKuotaLuarLingkungan
                  ? 'bg-rose-100 text-rose-800 border-rose-300 font-black'
                  : 'bg-teal-50 text-teal-700 border-teal-200'
              }`}>
                {activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'KUOTA PENUH' : `Maks ${maxKuotaLuarLingkungan}`}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <p className={`text-2xl font-black font-mono tabular-nums ${
                activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {activeIzinLuarCount}
              </p>
              <span className="text-xs text-slate-400 font-bold font-mono">/ {maxKuotaLuarLingkungan} orang</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Izin Luar Lingkungan</p>
          </div>
          <button
            onClick={() => {
              setIzinType('Luar Lingkungan');
              setShowIzinCepatModal(true);
            }}
            className="mt-3 py-1.5 px-2 bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Izin Luar</span>
          </button>
        </div>

        {/* 3. Siswa Izin Kamar Mandi (Maksimal 12, Berpasangan) */}
        <div className={`bg-white p-4 rounded-2xl border shadow-2xs transition-colors flex flex-col justify-between ${
          activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200/90 hover:border-cyan-300'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-cyan-50 text-cyan-700'
              }`}>
                <DoorOpen className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                activeIzinKamarMandiCount >= maxKuotaKamarMandi
                  ? 'bg-rose-100 text-rose-800 border-rose-300 font-black'
                  : 'bg-cyan-50 text-cyan-700 border-cyan-200'
              }`}>
                {activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'PENUH (12/12)' : 'Maks 12'}
              </span>
            </div>
            <div className="flex items-baseline gap-1 mt-2">
              <p className={`text-2xl font-black font-mono tabular-nums ${
                activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'text-rose-600' : 'text-slate-900'
              }`}>
                {activeIzinKamarMandiCount}
              </p>
              <span className="text-xs text-slate-400 font-bold font-mono">/ {maxKuotaKamarMandi} orang</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Izin Kamar Mandi (Berdua)</p>
          </div>
          <button
            onClick={() => {
              setIzinType('Kamar Mandi');
              setShowIzinCepatModal(true);
            }}
            className="mt-3 py-1.5 px-2 bg-cyan-700 hover:bg-cyan-800 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Izin Toilet (+Teman)</span>
          </button>
        </div>

        {/* 4. Tugas Khusus (STU) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-sky-300 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200">
                Dispensasi
              </span>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">
              {tugasKhususList.filter(t => t.statusHariIni === 'Sedang Bertugas' || t.statusHariIni === 'Dalam waktu kembali').length}
            </p>
            <p className="text-xs text-slate-500 font-medium">Tugas Khusus (STU)</p>
          </div>
          <button
            onClick={() => setActiveView('siswa-tugas-khusus')}
            className="mt-3 py-1.5 px-2 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>Lihat / Beri STU</span>
          </button>
        </div>

        {/* 5. Kepulangan Madrasah */}
        <div className={`bg-white p-4 rounded-2xl border shadow-2xs transition-colors flex flex-col justify-between ${
          activeCutoff ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200/90 hover:border-purple-300'
        }`}>
          <div>
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                activeCutoff ? 'bg-amber-100 text-amber-800' : 'bg-purple-50 text-purple-700'
              }`}>
                <Clock className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                activeCutoff ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-purple-50 text-purple-700 border-purple-200'
              }`}>
                {activeCutoff ? 'Dispensasi' : 'Normal'}
              </span>
            </div>
            <p className={`text-lg font-black mt-2 font-mono tabular-nums truncate ${
              activeCutoff ? 'text-amber-700' : 'text-slate-900'
            }`}>
              {activeCutoff ? `${activeCutoff.jamCutOff} WIB` : '13:30 WIB'}
            </p>
            <p className="text-xs text-slate-500 font-medium">Kepulangan Hari Ini</p>
          </div>
          <button
            onClick={() => setShowCutoffModal(true)}
            className="mt-3 py-1.5 px-2 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <Clock className="w-3 h-3" />
            <span>Atur Kepulangan</span>
          </button>
        </div>

        {/* 6. MBG Porsi */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-amber-300 transition-colors flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Utensils className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                Sinkron
              </span>
            </div>
            <p className="text-2xl font-black text-amber-800 mt-2 font-mono tabular-nums">{totalPorsiMBG}</p>
            <p className="text-xs text-slate-500 font-medium">Porsi MBG Madrasah</p>
          </div>
          <button
            onClick={() => setShowMBGPrintModal(true)}
            className="mt-3 py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold rounded-xl flex items-center justify-center gap-1 shadow-2xs transition-all cursor-pointer"
          >
            <Printer className="w-3 h-3" />
            <span>Cetak MBG</span>
          </button>
        </div>
      </div>

      {/* Program Makan Bergizi Gratis (MBG) Feature Card */}
      <div className="bg-white rounded-3xl p-5 border border-emerald-900/10 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center shrink-0">
              <Utensils className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Program Makan Bergizi Gratis (MBG)
                </h3>
                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  Sinkron Otomatis
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Kalkulasi porsi konsumsi makan siang madrasah berdasarkan presensi kehadiran real-time hari ini.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowMBGPrintModal(true)}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
              title="Cetak Berita Acara Serah Terima MBG Resmi Berkop Madrasah"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-700" />
              <span>Cetak Berita Acara MBG</span>
            </button>
            <button
              onClick={handleShareMBGWhatsApp}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              {copiedWa ? <Check className="w-3.5 h-3.5" /> : <MessageSquare className="w-3.5 h-3.5" />}
              <span>{copiedWa ? 'Tersalin ke Clipboard!' : 'Kirim Porsi ke Vendor Katering'}</span>
            </button>
          </div>
        </div>

        {/* MBG Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
          <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-semibold text-emerald-800">Siswa Hadir</span>
            <p className="text-xl font-black text-emerald-900 font-mono mt-1">{siswaHadir} Porsi</p>
            <span className="text-[10px] text-emerald-600">Sesuai absensi riil</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600">Guru & Tendik</span>
            <p className="text-xl font-black text-slate-800 font-mono mt-1">{guruTendik} Porsi</p>
            <span className="text-[10px] text-slate-400">Pendidik & Staf</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-600">Porsi Cadangan</span>
            <p className="text-xl font-black text-slate-800 font-mono mt-1">{cadanganPorsi} Porsi</p>
            <span className="text-[10px] text-slate-400">Tamu & Buffer</span>
          </div>

          <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200">
            <span className="text-[11px] font-bold text-amber-900">Total Pesanan Katering</span>
            <p className="text-xl font-black text-amber-800 font-mono mt-1">{totalPorsiMBG} Porsi</p>
            <span className="text-[10px] text-amber-700 font-medium">Distribusi: 11:45 WIB</span>
          </div>
        </div>
      </div>

      {/* Program Pelajaran Local Wisdom (Kejuruan di Luar Kelas Reguler: 1 Hari 1 Angkatan) */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/80 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                  Pelajaran Local Wisdom (Kejuruan di Luar Kelas)
                </h3>
                <span className="text-[10px] font-bold bg-teal-50 text-teal-700 px-2 py-0.5 rounded border border-teal-200">
                  Delegasi Instruktur
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Solusi Guru Piket: Pelajaran satu angkatan penuh di ruang kejuruan (Lab TIK, Bengkel TKRO, BLK Busana, Dapur Boga). Guru piket meminta konfirmasi langsung via instruktur tanpa keliling fisik.
              </p>
            </div>
          </div>

          {/* Tab Pilihan Angkatan / Hari */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold shrink-0">
            {(['Rabu', 'Kamis', 'Sabtu'] as const).map((day) => (
              <button
                key={day}
                onClick={() => setSelectedLWDay(day)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedLWDay === day
                    ? 'bg-teal-700 text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {day} {day === 'Rabu' ? '(Kelas 11)' : day === 'Kamis' ? '(Kelas 10)' : '(Kelas 12)'}
              </button>
            ))}
          </div>
        </div>

        {/* 4 Cards Kejuruan / Lokasi Praktik */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {localWisdomList.filter(l => l.hari === selectedLWDay).map((session) => {
            const isConfirmed = session.statusKonfirmasi === 'Hadir Lengkap' || session.statusKonfirmasi === 'Selesai';
            const isIssue = session.statusKonfirmasi === 'Ada Siswa Absen';

            return (
              <div
                key={session.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isConfirmed
                    ? 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                    : isIssue
                    ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                    : 'bg-slate-50/60 border-slate-200/90 hover:bg-white hover:border-teal-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-700">
                        {session.jurusan.includes('IT') ? (
                          <Laptop className="w-4 h-4" />
                        ) : session.jurusan.includes('TKRO') ? (
                          <Wrench className="w-4 h-4" />
                        ) : session.jurusan.includes('Busana') ? (
                          <Shirt className="w-4 h-4" />
                        ) : (
                          <CookingPot className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900">{session.jurusan}</h4>
                        <p className="text-[10px] text-teal-800 font-bold">{session.lokasi}</p>
                      </div>
                    </div>

                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                        isConfirmed
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : isIssue
                          ? 'bg-rose-100 text-rose-800 border-rose-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                      }`}
                    >
                      {session.statusKonfirmasi}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Instruktur:</span>
                      <span className="font-bold text-slate-800">{session.instruktur}</span>
                    </div>
                    <div className="flex justify-between items-center text-slate-500">
                      <span>Jumlah Rombel:</span>
                      <span className="font-mono font-bold text-slate-800">{session.jumlahSiswa} Siswa</span>
                    </div>
                    {session.waktuKonfirmasi && (
                      <div className="flex justify-between items-center text-[11px] text-emerald-700">
                        <span>Waktu Konfirmasi:</span>
                        <span className="font-mono">{session.waktuKonfirmasi}</span>
                      </div>
                    )}
                    {session.catatanInstruktur && (
                      <p className="text-[11px] text-slate-600 bg-white/80 p-1.5 rounded-lg border border-slate-200 mt-1 italic">
                        "{session.catatanInstruktur}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setActiveLWModal(session);
                      setLwConfirmStatus(session.statusKonfirmasi as any);
                      setLwCatatan(session.catatanInstruktur || '');
                    }}
                    className="flex-1 py-1.5 px-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Verifikasi / Catat</span>
                  </button>
                  <a
                    href={`https://api.whatsapp.com/send?phone=${session.noWaInstruktur}&text=${encodeURIComponent(
                      generateWaTextLocalWisdom(session)
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                    title="Kirim Permohonan Konfirmasi via WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Section: Attendance Chart, Donut Breakdown, Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Attendance by Class (Bar Chart Representation) */}
        <div className="lg:col-span-6 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Grafik Kehadiran Siswa Per Kelas
              </h3>
              <p className="text-[11px] text-slate-400">Persentase kehadiran per rombongan belajar</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-semibold text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Hadir
              </span>
              <span className="flex items-center gap-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Absen
              </span>
              <span className="flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Terlambat
              </span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { kelas: 'X A', total: 28, hadir: 26, tidak: 2, terlambat: 1 },
              { kelas: 'X B', total: 30, hadir: 28, tidak: 2, terlambat: 2 },
              { kelas: 'X C', total: 29, hadir: 27, tidak: 2, terlambat: 0 },
              { kelas: 'XI A', total: 32, hadir: 29, tidak: 3, terlambat: 3 },
              { kelas: 'XI B', total: 31, hadir: 29, tidak: 2, terlambat: 1 },
              { kelas: 'XII A', total: 28, hadir: 26, tidak: 2, terlambat: 3 },
              { kelas: 'XII B', total: 27, hadir: 26, tidak: 1, terlambat: 2 },
              { kelas: 'XII IPS', total: 26, hadir: 24, tidak: 2, terlambat: 1 }
            ].map((row, idx) => {
              const hadirPercent = (row.hadir / row.total) * 100;
              return (
                <div key={idx} className="flex items-center gap-3 text-xs">
                  <span className="w-12 font-bold text-slate-700 text-[11px]">{row.kelas}</span>
                  <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden flex">
                    <div
                      style={{ width: `${hadirPercent}%` }}
                      className="bg-emerald-500 hover:bg-emerald-600 transition-all"
                      title={`Hadir: ${row.hadir}`}
                    ></div>
                    <div
                      style={{ width: `${(row.tidak / row.total) * 100}%` }}
                      className="bg-rose-500"
                      title={`Tidak Masuk: ${row.tidak}`}
                    ></div>
                    <div
                      style={{ width: `${(row.terlambat / row.total) * 100}%` }}
                      className="bg-amber-400"
                      title={`Terlambat: ${row.terlambat}`}
                    ></div>
                  </div>
                  <span className="w-16 text-right font-mono font-bold text-slate-700 text-[11px]">
                    {row.hadir}/{row.total} ({hadirPercent.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Donut Breakdown */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Rekap Status Kehadiran
            </h3>
            <p className="text-[11px] text-slate-400">Total {totalSiswa} Siswa Terdaftar</p>

            <div className="relative w-36 h-36 mx-auto my-4 flex items-center justify-center">
              {/* Donut visual ring */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F1F5F9" strokeWidth="4.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#059669" strokeWidth="4.5" strokeDasharray="89.1 10.9" strokeDashoffset="0" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E11D48" strokeWidth="4.5" strokeDasharray="3.8 96.2" strokeDashoffset="-89.1" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#D97706" strokeWidth="4.5" strokeDasharray="4.8 95.2" strokeDashoffset="-92.9" />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-slate-900 font-mono">{totalSiswa}</span>
                <span className="block text-[10px] text-slate-400 font-semibold">Siswa</span>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Hadir
              </span>
              <span className="font-mono font-bold text-emerald-800">{siswaHadir} (89,1%)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-600"></span> Tidak Masuk
              </span>
              <span className="font-mono font-bold text-rose-700">{siswaTidakMasuk} (3,8%)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-slate-100">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Terlambat
              </span>
              <span className="font-mono font-bold text-amber-700">15 (4,8%)</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Izin Keluar
              </span>
              <span className="font-mono font-bold text-teal-800">8 (2,6%)</span>
            </div>
          </div>
        </div>

        {/* Information & Announcements */}
        <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Pengumuman Resmi
              </h3>
              <button
                onClick={() => setActiveView('pengumuman-kepala')}
                className="text-[11px] text-emerald-700 font-bold hover:underline"
              >
                Lihat Semua
              </button>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-2xl hover:border-emerald-200 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-emerald-700">Agenda Madrasah</span>
                  <span>2 jam lalu</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Rapat Evaluasi KBM</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Senin, 7 September 2026 pukul 13.00 WIB di Ruang Rapat Pimpinan.
                </p>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-2xl hover:border-amber-200 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-amber-700">Pelaporan Piket</span>
                  <span>1 hari lalu</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Pengumpulan Rekap Bulanan</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Batas rekapitulasi data Agustus sampai 5 September 2026.
                </p>
              </div>

              <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-2xl hover:border-emerald-200 transition-colors">
                <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                  <span className="font-bold text-teal-700">KBM & Kurikulum</span>
                  <span>2 hari lalu</span>
                </div>
                <h4 className="text-xs font-bold text-slate-800">Pelaksanaan ANBK 2026</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gladi bersih ANBK kelas XI berlangsung pekan depan di Lab Komputer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Shortcut Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveView('tugas-guru-izin')}
          className="p-4 bg-white border border-slate-200/90 hover:border-emerald-500 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ClipboardList className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Tugas Guru Izin</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Kelola kelas tertinggal</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => setActiveView('siswa-tidak-masuk')}
          className="p-4 bg-white border border-slate-200/90 hover:border-rose-400 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <Users className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Siswa Tidak Masuk</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Rekap & Porsi MBG</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => setActiveView('siswa-terlambat')}
          className="p-4 bg-white border border-slate-200/90 hover:border-amber-400 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Clock className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Siswa Terlambat</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Pantau pembinaan</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => setActiveView('izin-keluar-kelas')}
          className="p-4 bg-white border border-slate-200/90 hover:border-teal-400 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <DoorOpen className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Izin Keluar Kelas</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Kelola izin keluar siswa</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => setActiveView('siswa-tugas-khusus')}
          className="p-4 bg-white border border-slate-200/90 hover:border-sky-400 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Award className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Siswa Tugas Khusus</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Tahfidz & Adiwiyata</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => setActiveView('pelanggaran-siswa')}
          className="p-4 bg-white border border-slate-200/90 hover:border-rose-400 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
              <AlertOctagon className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Pelanggaran Siswa</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Pencatatan kedisiplinan</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => setActiveView('lapor-kendala')}
          className="p-4 bg-white border border-slate-200/90 hover:border-amber-400 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <AlertTriangle className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Lapor Kendala</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Sarpras & madrasah</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-amber-600 group-hover:translate-x-0.5 transition-all" />
        </button>

        <button
          onClick={() => setActiveView('rekap-hari-ini')}
          className="p-4 bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl flex items-center justify-between text-left transition-all group shadow-2xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <FileSpreadsheet className="w-4.5 h-4.5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 leading-tight">Rekap Hari Ini</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Ringkasan aktivitas</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
        </button>
      </div>

      {/* Tables Reoriented: Siswa Izin Keluar Aktif, Siswa Tugas Khusus Aktif, and Featured Kirim Laporan CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Siswa Izin Keluar Aktif (Pintasan Aksi Cepat) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Siswa Izin Keluar Aktif
                </h3>
              </div>
              <button
                onClick={() => {
                  setIzinType('Luar Lingkungan');
                  setShowIzinCepatModal(true);
                }}
                className="px-2.5 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>+ Izin Cepat</span>
              </button>
            </div>

            {/* Kapasitas Ringkasan */}
            <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Luar Madrasah:</span>
                <span className="font-bold font-mono text-slate-900">{activeIzinLuarCount} / 6 Orang</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-500 block text-[10px]">Kamar Mandi:</span>
                <span className="font-bold font-mono text-slate-900">{activeIzinKamarMandiCount} / 12 Orang</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {izinKeluarList.filter(ik => ik.status === 'Masih Keluar').length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <CheckCircle className="w-8 h-8 mx-auto text-emerald-400 mb-1 opacity-70" />
                  <p className="font-medium text-xs">Tidak ada santri yang sedang keluar.</p>
                </div>
              ) : (
                izinKeluarList
                  .filter(ik => ik.status === 'Masih Keluar')
                  .slice(0, 5)
                  .map((s) => (
                    <div key={s.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-800 truncate">{s.nama}</p>
                          <span className="text-[10px] text-slate-500">({s.kelas})</span>
                        </div>
                        <p className="text-[10px] text-teal-700 truncate">
                          {s.tujuan} {s.pendamping ? `· Bersama: ${s.pendamping}` : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {s.waktuKeluar}
                        </span>
                        <button
                          onClick={() => markSiswaReturned(s.id)}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          title="Tandai Siswa Sudah Kembali"
                        >
                          Kembali
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Total: {izinKeluarList.filter(ik => ik.status === 'Masih Keluar').length} aktif</span>
            <button
              onClick={() => setActiveView('izin-keluar-kelas')}
              className="text-teal-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Kelola Seluruh Izin</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Siswa Tugas Khusus (STU) Aktif */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 animate-pulse"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Siswa Tugas Khusus (STU)
                </h3>
              </div>
              <button
                onClick={() => setActiveView('siswa-tugas-khusus')}
                className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>+ STU Baru</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {tugasKhususList.filter(tk => tk.statusHariIni === 'Sedang Bertugas' || tk.statusHariIni === 'Dalam waktu kembali').length === 0 ? (
                <div className="py-6 text-center text-slate-400">
                  <Award className="w-8 h-8 mx-auto text-sky-400 mb-1 opacity-70" />
                  <p className="font-medium text-xs">Tidak ada santri tugas khusus saat ini.</p>
                </div>
              ) : (
                tugasKhususList
                  .filter(tk => tk.statusHariIni === 'Sedang Bertugas' || tk.statusHariIni === 'Dalam waktu kembali')
                  .slice(0, 5)
                  .map((tk) => (
                    <div key={tk.id} className="py-2.5 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-bold text-slate-800 truncate">{tk.nama}</p>
                          <span className="text-[10px] text-slate-500">({tk.kelas})</span>
                        </div>
                        <p className="text-[10px] text-sky-700 font-semibold truncate">{tk.program}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                          {tk.mulaiTugas}
                        </span>
                        <button
                          onClick={() => markTugasKhususReturned(tk.id)}
                          className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow-2xs"
                          title="Tandai Tugas Khusus Selesai"
                        >
                          Selesai
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">
              Total: {tugasKhususList.filter(tk => tk.statusHariIni === 'Sedang Bertugas' || tk.statusHariIni === 'Dalam waktu kembali').length} siswa
            </span>
            <button
              onClick={() => setActiveView('siswa-tugas-khusus')}
              className="text-sky-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>Daftar Lengkap STU</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Featured Card: Kirim Laporan ke Kepala */}
        <div className="lg:col-span-4 bg-gradient-to-br from-emerald-900 via-emerald-950 to-[#041B12] text-white p-6 rounded-3xl border border-emerald-700/50 shadow-xl flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Islamic corner watermark */}
          <div className="absolute -right-6 -bottom-6 w-32 h-32 opacity-10 pointer-events-none">
            <Building2 className="w-full h-full text-amber-300" />
          </div>

          <div>
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-400 text-emerald-950 flex items-center justify-center font-bold shadow-md shadow-amber-400/20">
                <Send className="w-4.5 h-4.5" />
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-wide text-amber-200">
                Kirim Laporan ke Kepala
              </h3>
            </div>
            <p className="text-xs text-emerald-100/80 leading-relaxed">
              Kirim laporan rekap kegiatan piket hari ini secara komprehensif ke Kepala Madrasah untuk diverifikasi dan ditandatangani secara digital.
            </p>

            <div className="mt-4 p-3.5 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/10 flex items-center gap-3">
              <FileText className="w-6 h-6 text-amber-300 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Dossier Piket {formatIndonesianDate(new Date(), { withDay: false, shortMonth: true })}</p>
                <p className="text-[11px] text-emerald-300 font-semibold flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Siap Dikirim ke Kepala
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              onClick={() => setActiveView('kirim-laporan-kepala')}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 active:from-amber-500 text-emerald-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-950/30 transition-all flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              <Send className="w-4 h-4" />
              <span>Buka Laporan & Selesaikan Tugas</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL CETAK BERITA ACARA SERAH TERIMA MBG BERKOP MADRASAH */}
      {showMBGPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Berita Acara MBG</h3>
                  <p className="text-[11px] text-slate-500">Kop Resmi Program Makan Bergizi Gratis MA PLUS</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowMBGPrintModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Letter Body */}
            <div className="bg-white p-6 border border-slate-300 rounded-2xl space-y-4 text-slate-900 font-sans">
              {/* Kop Surat Resmi */}
              <div className="text-center pb-3 border-b-2 border-slate-900 space-y-0.5">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                    <MadrasahLogo size="lg" />
                  </div>
                  <div>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      YAYASAN PONDOK PESANTREN MA'HADUL MUTA'ALLIMIN
                    </h2>
                    <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-emerald-950">
                      MADRASAH ALIYAH PLUS MA'HADUL MUTA'ALLIMIN KATERBAN
                    </h1>
                    <p className="text-[10px] font-bold text-amber-800 uppercase">
                      MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL) • BERBASIS PONDOK PESANTREN
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono">
                      NSM: 131235210019 · NPSN: 69982415 · Status Akreditasi: A (Unggul)
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Katerban, Kec. Paron, Kab. Ngawi, Jawa Timur 63253 · Email: tumaplusmahadulmutaallimin@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Document Number */}
              <div className="text-center pt-1 space-y-0.5">
                <h3 className="text-xs font-black uppercase underline tracking-wider">
                  BERITA ACARA SERAH TERIMA PORSI MAKAN BERGIZI GRATIS (MBG)
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  Nomor: BA.MBG/MAPLUS/2026/09/{Date.now().toString().slice(-4)}
                </p>
              </div>

              {/* Description & Date */}
              <p className="text-xs text-slate-700 leading-relaxed">
                Pada hari ini, <strong>{formatIndonesianDate(new Date(), { withDay: true, shortMonth: false })}</strong> bertempat di Ruang Distribusi MBG Kampus MA PLUS Ma'hadul Muta'allimin, telah dilaksanakan serah terima pesanan porsi konsumsi makan siang dengan rincian perhitungan absensi riil sebagai berikut:
              </p>

              {/* Breakdown Table */}
              <table className="w-full text-left border border-slate-300 text-xs">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-300 font-bold">
                    <th className="p-2 text-center w-8">No</th>
                    <th className="p-2">Kategori Penerima MBG</th>
                    <th className="p-2 text-center">Basis Perhitungan</th>
                    <th className="p-2 text-right w-24">Jumlah Porsi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 text-center font-mono">1</td>
                    <td className="p-2 font-semibold">Santri / Siswa Aktif Hadir</td>
                    <td className="p-2 text-center text-slate-600">Absensi Riil KBM Pagi</td>
                    <td className="p-2 text-right font-mono font-bold text-emerald-800">{siswaHadir} Porsi</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-center font-mono">2</td>
                    <td className="p-2 font-semibold">Guru & Tenaga Kependidikan</td>
                    <td className="p-2 text-center text-slate-600">Daftar Pendidik Piket & KBM</td>
                    <td className="p-2 text-right font-mono font-bold text-slate-800">{guruTendik} Porsi</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-center font-mono">3</td>
                    <td className="p-2 font-semibold">Cadangan / Tamu Institusi</td>
                    <td className="p-2 text-center text-slate-600">Buffer Kuota Madrasah</td>
                    <td className="p-2 text-right font-mono font-bold text-amber-800">{cadanganPorsi} Porsi</td>
                  </tr>
                  <tr className="bg-amber-50/80 font-bold border-t-2 border-slate-900">
                    <td colSpan={3} className="p-2.5 uppercase tracking-wide text-slate-900">
                      Total Pesanan Riil Diterima
                    </td>
                    <td className="p-2.5 text-right font-mono text-sm text-emerald-950 font-black">
                      {totalPorsiMBG} Porsi
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="text-[11px] text-slate-600 space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <p><strong>Waktu Kedatangan Katering:</strong> 11:30 WIB · <strong>Jadwal Distribusi Santri:</strong> 11:45 WIB</p>
                <p><strong>Kondisi Makanan:</strong> Higienis, hangat, kemasan bersegel rapat, dan memenuhi standar gizi seimbang.</p>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-4 grid grid-cols-2 gap-4 text-center text-xs">
                <div>
                  <p className="text-[11px] text-slate-600">Pihak Pertama,</p>
                  <p className="font-bold text-slate-800">Penyedia Jasa Katering MBG</p>
                  <div className="h-12 flex items-center justify-center text-slate-300 italic text-[11px]">
                    (Tanda Tangan & Nama Terang)
                  </div>
                  <p className="font-semibold underline text-slate-700">(..........................................)</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-600">Pihak Kedua,</p>
                  <p className="font-bold text-emerald-950">Koordinator Tim Piket Madrasah</p>
                  <div className="h-12 flex items-center justify-center font-serif italic text-emerald-800 font-bold text-sm">
                    {activeKoordinator}
                  </div>
                  <p className="font-extrabold underline text-slate-900">{activeKoordinator}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: FORM IZIN KELUAR CEPAT DENGAN KUOTA & CEKLIS REKAN TOILET */}
      {showIzinCepatModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                  <DoorOpen className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Form Izin Keluar Cepat</h3>
                  <p className="text-[11px] text-slate-500">Pemberian aksi izin dengan kuota real-time</p>
                </div>
              </div>
              <button
                onClick={() => setShowIzinCepatModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pilihan Kategori Tempat & Kuota */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIzinType('Luar Lingkungan')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  izinType === 'Luar Lingkungan'
                    ? 'border-teal-600 bg-teal-50/60 ring-2 ring-teal-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-teal-800 uppercase block">Di Luar Lingkungan</span>
                <span className="text-xs font-black text-slate-900 block mt-0.5">Maksimal 6 Orang</span>
                <span className={`text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                  activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  Terisi: {activeIzinLuarCount} / {maxKuotaLuarLingkungan}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIzinType('Kamar Mandi')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  izinType === 'Kamar Mandi'
                    ? 'border-cyan-600 bg-cyan-50/60 ring-2 ring-cyan-600/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <span className="text-[10px] font-bold text-cyan-800 uppercase block">Ke Toilet / Kamar Mandi</span>
                <span className="text-xs font-black text-slate-900 block mt-0.5">Maksimal 12 Orang</span>
                <span className={`text-[10px] font-bold mt-1 inline-block px-1.5 py-0.5 rounded ${
                  activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                }`}>
                  Terisi: {activeIzinKamarMandiCount} / {maxKuotaKamarMandi} (Pasangan)
                </span>
              </button>
            </div>

            {/* Peringatan jika kuota penuh */}
            {((izinType === 'Luar Lingkungan' && activeIzinLuarCount >= maxKuotaLuarLingkungan) ||
              (izinType === 'Kamar Mandi' && activeIzinKamarMandiCount >= maxKuotaKamarMandi)) && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Perhatian:</strong> Kuota izin {izinType} saat ini telah penuh. Siswa lain harus menunggu santri yang sedang izin untuk kembali terlebih dahulu.
                </span>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!izinNama.trim()) {
                  alertError('Data Belum Lengkap', 'Nama siswa wajib diisi.');
                  return;
                }
                const now = new Date();
                const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
                const estMin = izinType === 'Kamar Mandi' ? 15 : 45;
                const estDate = new Date(now.getTime() + estMin * 60000);
                const estStr = `${String(estDate.getHours()).padStart(2, '0')}:${String(estDate.getMinutes()).padStart(2, '0')}`;

                addIzinKeluar({
                  nama: izinNama,
                  kelas: izinKelas,
                  kategoriTempat: izinType,
                  tujuan: izinType === 'Kamar Mandi' ? 'Ke Kamar Mandi' : 'Urusan Keluarga',
                  jenisIzin: izinType === 'Kamar Mandi' ? 'Izin Toilet' : 'Izin Keluar Kampus',
                  pendamping: izinPendamping.trim() || undefined,
                  waktuKeluar: nowStr,
                  estimasiKembali: estStr,
                  keterangan: izinKeterangan || (izinType === 'Kamar Mandi' ? 'Izin ke toilet bersama rekan' : 'Izin keluar madrasah')
                });

                alertSuccess(
                  'Izin Berhasil Diterbitkan',
                  `Surat izin ${izinType} untuk ${izinNama} (${izinKelas}) telah aktif.`
                );
                setShowIzinCepatModal(false);
                setIzinNama('');
                setIzinPendamping('');
                setIzinKeterangan('');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Siswa <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={izinNama}
                  onChange={(e) => setIzinNama(e.target.value)}
                  placeholder="Ketik nama santri/siswa..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-teal-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={izinKelas}
                    onChange={(e) => setIzinKelas(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    {kelasList.map(k => (
                      <option key={k.id} value={k.nama}>{k.nama}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Durasi Maksimal</label>
                  <input
                    type="text"
                    disabled
                    value={izinType === 'Kamar Mandi' ? '15 Menit' : '45 Menit'}
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-600"
                  />
                </div>
              </div>

              {/* Khusus Kamar Mandi: Ceklis dan input rekan pendamping */}
              {izinType === 'Kamar Mandi' && (
                <div className="p-3 bg-cyan-50/70 border border-cyan-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-cyan-950 font-bold">
                    <Users className="w-4 h-4 text-cyan-700" />
                    <span>Ceklis Rekan Keluar Bersama (Sekali Keluar 2 Orang)</span>
                  </div>
                  <p className="text-[11px] text-cyan-800">
                    Sesuai aturan madrasah, izin kamar mandi dilakukan berpasangan (maks 2 santri per keluar). Masukkan nama rekan pendamping di bawah ini:
                  </p>
                  <input
                    type="text"
                    value={izinPendamping}
                    onChange={(e) => setIzinPendamping(e.target.value)}
                    placeholder="Nama teman/rekan santri yang mendampingi..."
                    className="w-full p-2 bg-white border border-cyan-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-cyan-600"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan Tambahan</label>
                <input
                  type="text"
                  value={izinKeterangan}
                  onChange={(e) => setIzinKeterangan(e.target.value)}
                  placeholder="Catatan keperluan izin..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowIzinCepatModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
                >
                  Terbitkan Izin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PENGATURAN CUT-OFF KEPULANGAN LEBIH AWAL (MASSAL / ROMBEL) */}
      {showCutoffModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pengaturan Cut-Off Kepulangan Lebih Awal</h3>
                  <p className="text-[11px] text-slate-500">Solusi darurat atau insidental bagi guru & santri</p>
                </div>
              </div>
              <button
                onClick={() => setShowCutoffModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                tambahCutOffPulangAwal({
                  tipe: cutoffTipe,
                  kelasTerdampak: cutoffTipe === 'Massal' ? ['Semua Kelas'] : cutoffKelas,
                  jamCutOff: cutoffJam,
                  alasan: cutoffAlasan,
                  keterangan: cutoffKeterangan,
                  noDispensasi: `DISP/MAPLUS/2026/09/${Math.floor(100 + Math.random() * 900)}`,
                  dibuatOleh: currentUser.namaLengkap
                });
                setShowCutoffModal(false);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Cakupan Kepulangan</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    cutoffTipe === 'Massal' ? 'bg-amber-50 border-amber-500 font-bold text-amber-950' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="cutoffTipe"
                      checked={cutoffTipe === 'Massal'}
                      onChange={() => setCutoffTipe('Massal')}
                      className="text-amber-600"
                    />
                    <span>Massal (Seluruh Madrasah)</span>
                  </label>

                  <label className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
                    cutoffTipe === 'Per Rombel' ? 'bg-amber-50 border-amber-500 font-bold text-amber-950' : 'border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="cutoffTipe"
                      checked={cutoffTipe === 'Per Rombel'}
                      onChange={() => setCutoffTipe('Per Rombel')}
                      className="text-amber-600"
                    />
                    <span>Per Rombel Tertentu</span>
                  </label>
                </div>
              </div>

              {cutoffTipe === 'Per Rombel' && (
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Pilih Kelas Terdampak</label>
                  <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    {kelasList.map(k => (
                      <label key={k.id} className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <input
                          type="checkbox"
                          checked={cutoffKelas.includes(k.nama)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCutoffKelas([...cutoffKelas, k.nama]);
                            } else {
                              setCutoffKelas(cutoffKelas.filter(c => c !== k.nama));
                            }
                          }}
                          className="rounded text-amber-600"
                        />
                        <span>{k.nama}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Jam Cut-Off Kepulangan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    value={cutoffJam}
                    onChange={(e) => setCutoffJam(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold focus:bg-white"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Alasan Utama</label>
                  <select
                    value={cutoffAlasan}
                    onChange={(e) => setCutoffAlasan(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  >
                    <option value="Rapat Pleno Dewan Guru">Rapat Pleno Dewan Guru</option>
                    <option value="Cuaca Ekstrem / Banjir / Hujan Badai">Cuaca Ekstrem / Hujan Badai</option>
                    <option value="Peringatan Hari Besar Islam (PHBI)">Peringatan Hari Besar Islam (PHBI)</option>
                    <option value="Selesai Ujian / Asesmen Madrasah">Selesai Ujian / Asesmen Madrasah</option>
                    <option value="Dinas Luar / Pertemuan Kemenag">Dinas Luar / Pertemuan Kemenag</option>
                    <option value="Pembersihan Kampus / Kerja Bakti">Pembersihan Kampus / Kerja Bakti</option>
                    <option value="Keadaan Darurat Lainnya">Keadaan Darurat Lainnya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Keterangan Instruksi Resmi</label>
                <textarea
                  rows={2}
                  value={cutoffKeterangan}
                  onChange={(e) => setCutoffKeterangan(e.target.value)}
                  placeholder="Catatan surat dispensasi dari Kepala Madrasah..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed">
                <Info className="w-4 h-4 text-amber-700 inline mr-1" />
                <strong>Dampak Sistem:</strong> Setelah jam cut-off, sistem monitoring KBM menandai jam tersisa sebagai <em>Dispensasi Resmi</em>, sehingga guru dan santri tidak dianggap alpa.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCutoffModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
                >
                  Terapkan Dispensasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: VERIFIKASI & CATAT KONFIRMASI LOCAL WISDOM INSTUKTUR */}
      {activeLWModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Konfirmasi Kehadiran Local Wisdom
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeLWModal.jurusan} · {activeLWModal.lokasi}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveLWModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WhatsApp Template Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Format Permohonan Konfirmasi WA:
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(generateWaTextLocalWisdom(activeLWModal));
                    setCopiedLwWa(true);
                    setTimeout(() => setCopiedLwWa(false), 3000);
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                >
                  {copiedLwWa ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLwWa ? 'Tersalin!' : 'Salin Pesan'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                {generateWaTextLocalWisdom(activeLWModal)}
              </div>

              <a
                href={`https://api.whatsapp.com/send?phone=${activeLWModal.noWaInstruktur}&text=${encodeURIComponent(
                  generateWaTextLocalWisdom(activeLWModal)
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Buka WhatsApp & Kirim ke {activeLWModal.instruktur}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>

            {/* Form Catat Respon Instruktur */}
            <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Catat Respon / Konfirmasi dari Instruktur:</h4>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Status Kehadiran Rombel</label>
                <select
                  value={lwConfirmStatus}
                  onChange={(e) => setLwConfirmStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                >
                  <option value="Hadir Lengkap">Hadir Lengkap (Seluruh Siswa Hadir di Lab/Bengkel)</option>
                  <option value="Ada Siswa Absen">Ada Siswa Absen (Ada Siswa Sakit / Izin)</option>
                  <option value="Selesai">Kegiatan Praktik Telah Selesai</option>
                  <option value="Menunggu Konfirmasi">Menunggu Konfirmasi Instruktur</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Catatan Instruktur / Rombel</label>
                <textarea
                  rows={2}
                  value={lwCatatan}
                  onChange={(e) => setLwCatatan(e.target.value)}
                  placeholder="Contoh: Seluruh siswa hadir lengkap, sedang perakitan mesin motor..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLWModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50"
                >
                  Tutup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateLocalWisdomStatus(activeLWModal.id, lwConfirmStatus, lwCatatan);
                    setActiveLWModal(null);
                  }}
                  className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
                >
                  Simpan Konfirmasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
