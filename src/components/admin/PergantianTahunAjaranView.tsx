import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MadrasahLogo } from '../common/MadrasahLogo';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  Printer,
  Search,
  Filter,
  Check,
  X,
  Users,
  Building2,
  BookOpen,
  Award,
  Clock,
  ShieldAlert,
  History,
  HelpCircle,
  FileText
} from 'lucide-react';

export const PergantianTahunAjaranView: React.FC = () => {
  const {
    siswas,
    kelasList,
    madrasahInfo,
    currentUser,
    tahunAjaranAktif,
    semesterAktif,
    riwayatTahunAjaranList,
    gantiSemester,
    prosesKenaikanKelasDanKelulusan,
    rollbackPergantianTahun,
    confirmAction,
    alertSuccess,
    alertError
  } = useApp();

  const [activeTab, setActiveTab] = useState<'wizard-kenaikan' | 'ganti-semester' | 'riwayat'>('wizard-kenaikan');
  const [subStep, setSubStep] = useState<'xii' | 'xi' | 'x' | 'review'>('xii');

  // Compute next academic year automatically (e.g., 2026/2027 -> 2027/2028)
  const computeNextYear = (currentYearStr: string) => {
    try {
      const parts = currentYearStr.split('/');
      if (parts.length === 2) {
        const start = parseInt(parts[0], 10);
        const end = parseInt(parts[1], 10);
        if (!isNaN(start) && !isNaN(end)) {
          return `${start + 1}/${end + 1}`;
        }
      }
    } catch {}
    return '2027/2028';
  };

  const [targetTahunAjaran, setTargetTahunAjaran] = useState(() => computeNextYear(tahunAjaranAktif));
  const [targetSemester, setTargetSemester] = useState<'Gasal' | 'Genap'>('Gasal');
  const [resetPresensi, setResetPresensi] = useState(true);
  const [resetPoin, setResetPoin] = useState(true);
  const [catatanPergantian, setCatatanPergantian] = useState('Proses resmi kenaikan kelas dan kelulusan santri akhir tahun pelajaran.');
  const [searchFilter, setSearchFilter] = useState('');
  const [showSKModal, setShowSKModal] = useState(false);
  const [lastExecutedSummary, setLastExecutedSummary] = useState<any>(null);

  // Individual student decisions state: studentId -> { status, kelasTujuan, catatan }
  const [decisions, setDecisions] = useState<Record<string, {
    status: 'Lulus' | 'Naik' | 'Tinggal' | 'Mutasi';
    kelasTujuan?: string;
    catatan?: string;
  }>>({});

  // Segment students by class levels
  const aktifSiswas = siswas.filter(s => s.status === 'Aktif' || !s.status);
  const kelasXIISiswas = aktifSiswas.filter(s => s.kelas.includes('XII'));
  const kelasXISiswas = aktifSiswas.filter(s => s.kelas.includes('XI'));
  const kelasXSiswas = aktifSiswas.filter(s => s.kelas.includes('X') && !s.kelas.includes('XI') && !s.kelas.includes('XII'));
  const alumniSiswas = siswas.filter(s => s.status === 'Lulus' || s.kelas.includes('Alumni'));

  const handleSetDecision = (siswaId: string, status: 'Lulus' | 'Naik' | 'Tinggal' | 'Mutasi', kelasTujuan?: string, catatan?: string) => {
    setDecisions(prev => ({
      ...prev,
      [siswaId]: {
        status,
        kelasTujuan,
        catatan
      }
    }));
  };

  const handleBulkSetStatus = (studentList: typeof siswas, status: 'Lulus' | 'Naik' | 'Tinggal') => {
    const nextDecisions = { ...decisions };
    studentList.forEach(s => {
      let targetClass: string | undefined = undefined;
      if (status === 'Naik') {
        if (s.kelas.includes('XI')) targetClass = s.kelas.replace('XI', 'XII');
        else if (s.kelas.includes('X')) targetClass = s.kelas.replace('X', 'XI');
      }
      nextDecisions[s.id] = {
        status,
        kelasTujuan: targetClass
      };
    });
    setDecisions(nextDecisions);
    alertSuccess('Status Diatur Massal', `Seluruh ${studentList.length} santri berhasil diatur ke status "${status}".`);
  };

  const countLulusPlanned = kelasXIISiswas.filter(s => (decisions[s.id]?.status || 'Lulus') === 'Lulus').length;
  const countNaikXIPlanned = kelasXISiswas.filter(s => (decisions[s.id]?.status || 'Naik') === 'Naik').length;
  const countNaikXPlanned = kelasXSiswas.filter(s => (decisions[s.id]?.status || 'Naik') === 'Naik').length;
  const countTinggalPlanned = Object.values(decisions).filter(d => d.status === 'Tinggal').length;
  const countMutasiPlanned = Object.values(decisions).filter(d => d.status === 'Mutasi').length;

  const handleExecuteRollover = () => {
    confirmAction({
      title: `Konfirmasi Pergantian Tahun Ajaran ${targetTahunAjaran}`,
      message: `Anda akan memproses kenaikan kelas dan kelulusan santri:\n\n• ${countLulusPlanned} Santri Kelas XII dinyatakan LULUS (Alumni)\n• ${countNaikXIPlanned} Santri Kelas XI NAIK ke Kelas XII\n• ${countNaikXPlanned} Santri Kelas X NAIK ke Kelas XI\n• ${countTinggalPlanned} Santri Tinggal Kelas\n• Tahun Ajaran Baru: ${targetTahunAjaran} (Semester ${targetSemester})\n\nLanjutkan pemrosesan?`,
      confirmText: 'Ya, Jalankan Pergantian Sekarang',
      cancelText: 'Periksa Kembali',
      isDanger: false,
      onConfirm: () => {
        const result = prosesKenaikanKelasDanKelulusan({
          tahunAjaranBaru: targetTahunAjaran,
          semesterBaru: targetSemester,
          decisions,
          resetPresensiHarian: resetPresensi,
          resetPoinPelanggaran: resetPoin,
          catatanPergantian
        });
        if (result.success) {
          setLastExecutedSummary(result.summary);
          setShowSKModal(true);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Status Tahun Ajaran */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-emerald-700/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-emerald-500/10 to-transparent pointer-events-none"></div>
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center p-1.5 shrink-0 shadow-md">
              <MadrasahLogo size="lg" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2.5 py-0.5 rounded-full shadow-2xs">
                  Modul Akademik
                </span>
                <span className="text-xs text-emerald-200 font-semibold">
                  MA Plus Ma'hadul Muta'allimin Katerban-Ngawi
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Pergantian Tahun Ajaran &amp; Kenaikan Kelas
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Kelola transisi tahun pelajaran, proses kenaikan tingkat santri Kelas X &amp; XI, penetapan kelulusan santri Kelas XII, serta pengarsipan data induk resmi madrasah.
              </p>
            </div>
          </div>

          {/* Current Active Badge Box */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4 shrink-0 shadow-lg">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Tahun Ajaran Aktif
              </p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-white font-mono">{tahunAjaranAktif}</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md border border-amber-300/30">
                  Semester {semesterAktif}
                </span>
              </div>
              <p className="text-[10px] text-slate-300 mt-1">
                Total Terdaftar: <strong className="text-white">{aktifSiswas.length} Santri Aktif</strong> · {alumniSiswas.length} Alumni
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('wizard-kenaikan')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'wizard-kenaikan'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Kenaikan Kelas &amp; Kelulusan (Tahun Baru)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ganti-semester')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'ganti-semester'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Ganti Semester (Gasal &harr; Genap)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('riwayat')}
          className={`flex items-center gap-2 px-5 py-3 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-all whitespace-nowrap ${
            activeTab === 'riwayat'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Riwayat &amp; Rollback Pergantian ({riwayatTahunAjaranList.length})</span>
        </button>
      </div>

      {/* ================= TAB 1: WIZARD KENAIKAN KELAS & KELULUSAN ================= */}
      {activeTab === 'wizard-kenaikan' && (
        <div className="space-y-6">
          {/* Target Year & Config Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  Konfigurasi Target Tahun Ajaran Baru
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tentukan tahun ajaran baru dan sesuaikan opsi reset catatan operasional harian.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Tahun Ajaran Baru:</label>
                  <input
                    type="text"
                    value={targetTahunAjaran}
                    onChange={(e) => setTargetTahunAjaran(e.target.value)}
                    placeholder="Contoh: 2027/2028"
                    className="w-32 px-3 py-1.5 rounded-xl border border-emerald-500 bg-emerald-50 text-emerald-900 font-black text-center text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-slate-700">Semester Awal:</label>
                  <select
                    value={targetSemester}
                    onChange={(e) => setTargetSemester(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 text-xs focus:outline-none"
                  >
                    <option value="Gasal">Semester Gasal</option>
                    <option value="Genap">Semester Genap</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={resetPresensi}
                  onChange={(e) => setResetPresensi(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-slate-800">Bersihkan Log Presensi &amp; Ketertiban Harian</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mereset data absensi harian, izin keluar, dan keterlambatan untuk memulai buku piket baru yang bersih.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-2xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={resetPoin}
                  onChange={(e) => setResetPoin(e.target.checked)}
                  className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="font-bold text-slate-800">Reset Poin Pelanggaran Tata Tertib</span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mengembalikan saldo poin tatib santri aktif ke 0 untuk tahun ajaran baru (arsip tetap tercatat).
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Sub-steps Indicator (Kelas XII, Kelas XI, Kelas X, Review) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              type="button"
              onClick={() => setSubStep('xii')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                subStep === 'xii'
                  ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800">Langkah 1</span>
                <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                  {kelasXIISiswas.length} Santri
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">1. Kelulusan Kelas XII</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Penetapan status Alumni / Lulus</p>
            </button>

            <button
              type="button"
              onClick={() => setSubStep('xi')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                subStep === 'xi'
                  ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800">Langkah 2</span>
                <span className="text-xs font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-full">
                  {kelasXISiswas.length} Santri
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">2. Kenaikan XI &rarr; XII</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Promosi santri ke tingkat akhir</p>
            </button>

            <button
              type="button"
              onClick={() => setSubStep('x')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                subStep === 'x'
                  ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800">Langkah 3</span>
                <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                  {kelasXSiswas.length} Santri
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">3. Kenaikan X &rarr; XI</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Promosi santri ke kelas menengah</p>
            </button>

            <button
              type="button"
              onClick={() => setSubStep('review')}
              className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                subStep === 'review'
                  ? 'border-emerald-600 bg-emerald-50 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-800">Langkah 4</span>
                <span className="text-xs font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded-full">
                  Final
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-900 mt-1">4. Ringkasan &amp; Eksekusi</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Validasi &amp; cetak Berita Acara</p>
            </button>
          </div>

          {/* ================= SUB-STEP 1: KELAS XII (KELULUSAN) ================= */}
          {subStep === 'xii' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Penetapan Kelulusan Santri Kelas XII ({kelasXIISiswas.length} Santri)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Secara default seluruh santri kelas XII (XII A &amp; XII B) ditetapkan <strong>Lulus (Alumni)</strong>. Anda dapat mengubah keputusan per santri jika ada yang tinggal kelas atau mutasi.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBulkSetStatus(kelasXIISiswas, 'Lulus')}
                    className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Set Semua LULUS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubStep('xi')}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Lanjut ke Kelas XI</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Table Santri Kelas XII */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">No</th>
                      <th className="py-2.5 px-3">Nama Santri &amp; NIS</th>
                      <th className="py-2.5 px-3">Kelas Saat Ini</th>
                      <th className="py-2.5 px-3 text-center w-40">Status Kelulusan</th>
                      <th className="py-2.5 px-3">Catatan / SK Kelulusan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {kelasXIISiswas.map((s, idx) => {
                      const currentDecision = decisions[s.id]?.status || 'Lulus';
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{s.nama}</div>
                            <div className="text-[10px] text-slate-400 font-mono">NIS: {s.nis} · NISN: {s.nisn || '-'}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              {s.kelas}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <select
                              value={currentDecision}
                              onChange={(e) => handleSetDecision(s.id, e.target.value as any)}
                              className={`w-full px-2.5 py-1 rounded-xl text-xs font-bold border focus:outline-none ${
                                currentDecision === 'Lulus'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : currentDecision === 'Tinggal'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Lulus">Lulus (Alumni)</option>
                              <option value="Tinggal">Tidak Lulus / Tinggal di XII</option>
                              <option value="Mutasi">Mutasi / Pindah</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              placeholder="Catatan prestasi / nomor ijazah..."
                              value={decisions[s.id]?.catatan || ''}
                              onChange={(e) => handleSetDecision(s.id, currentDecision as any, undefined, e.target.value)}
                              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= SUB-STEP 2: KELAS XI (KENAIKAN KE XII) ================= */}
          {subStep === 'xi' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Kenaikan Santri Kelas XI ke Kelas XII ({kelasXISiswas.length} Santri)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Santri kelas XI A secara otomatis dipromosikan ke XII A, dan XI B ke XII B. Anda dapat memindahkan rombel tujuan santri atau menetapkan tinggal kelas.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBulkSetStatus(kelasXISiswas, 'Naik')}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Set Semua NAIK KELAS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubStep('x')}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Lanjut ke Kelas X</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Table Santri Kelas XI */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">No</th>
                      <th className="py-2.5 px-3">Nama Santri &amp; NIS</th>
                      <th className="py-2.5 px-3">Kelas Saat Ini</th>
                      <th className="py-2.5 px-3 text-center w-36">Keputusan</th>
                      <th className="py-2.5 px-3 text-center w-36">Kelas Tujuan</th>
                      <th className="py-2.5 px-3">Catatan Kenaikan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {kelasXISiswas.map((s, idx) => {
                      const currentDecision = decisions[s.id]?.status || 'Naik';
                      const currentTarget = decisions[s.id]?.kelasTujuan || (s.kelas.includes('A') ? 'XII A' : 'XII B');
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{s.nama}</div>
                            <div className="text-[10px] text-slate-400 font-mono">NIS: {s.nis} · NISN: {s.nisn || '-'}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {s.kelas}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <select
                              value={currentDecision}
                              onChange={(e) => handleSetDecision(s.id, e.target.value as any, currentTarget)}
                              className={`w-full px-2 py-1 rounded-xl text-xs font-bold border focus:outline-none ${
                                currentDecision === 'Naik'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : currentDecision === 'Tinggal'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Naik">Naik Kelas</option>
                              <option value="Tinggal">Tinggal di Kelas XI</option>
                              <option value="Mutasi">Mutasi / Pindah</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {currentDecision === 'Naik' ? (
                              <select
                                value={currentTarget}
                                onChange={(e) => handleSetDecision(s.id, 'Naik', e.target.value)}
                                className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 text-xs"
                              >
                                <option value="XII A">Kelas XII A</option>
                                <option value="XII B">Kelas XII B</option>
                              </select>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              placeholder="Catatan prestasi / peringkat..."
                              value={decisions[s.id]?.catatan || ''}
                              onChange={(e) => handleSetDecision(s.id, currentDecision as any, currentTarget, e.target.value)}
                              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= SUB-STEP 3: KELAS X (KENAIKAN KE XI) ================= */}
          {subStep === 'x' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Kenaikan Santri Kelas X ke Kelas XI ({kelasXSiswas.length} Santri)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Santri kelas X A dipromosikan ke XI A, dan X B ke XI B. Rombel kelas X berikutnya akan siap untuk angkatan santri baru (PPDB).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBulkSetStatus(kelasXSiswas, 'Naik')}
                    className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                  >
                    Set Semua NAIK KELAS
                  </button>
                  <button
                    type="button"
                    onClick={() => setSubStep('review')}
                    className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <span>Lanjut ke Review Final</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Table Santri Kelas X */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 text-center w-10">No</th>
                      <th className="py-2.5 px-3">Nama Santri &amp; NIS</th>
                      <th className="py-2.5 px-3">Kelas Saat Ini</th>
                      <th className="py-2.5 px-3 text-center w-36">Keputusan</th>
                      <th className="py-2.5 px-3 text-center w-36">Kelas Tujuan</th>
                      <th className="py-2.5 px-3">Catatan Kenaikan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {kelasXSiswas.map((s, idx) => {
                      const currentDecision = decisions[s.id]?.status || 'Naik';
                      const currentTarget = decisions[s.id]?.kelasTujuan || (s.kelas.includes('A') ? 'XI A' : 'XI B');
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{s.nama}</div>
                            <div className="text-[10px] text-slate-400 font-mono">NIS: {s.nis} · NISN: {s.nisn || '-'}</div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                              {s.kelas}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <select
                              value={currentDecision}
                              onChange={(e) => handleSetDecision(s.id, e.target.value as any, currentTarget)}
                              className={`w-full px-2 py-1 rounded-xl text-xs font-bold border focus:outline-none ${
                                currentDecision === 'Naik'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : currentDecision === 'Tinggal'
                                  ? 'bg-rose-50 text-rose-800 border-rose-300'
                                  : 'bg-amber-50 text-amber-800 border-amber-300'
                              }`}
                            >
                              <option value="Naik">Naik Kelas</option>
                              <option value="Tinggal">Tinggal di Kelas X</option>
                              <option value="Mutasi">Mutasi / Pindah</option>
                            </select>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {currentDecision === 'Naik' ? (
                              <select
                                value={currentTarget}
                                onChange={(e) => handleSetDecision(s.id, 'Naik', e.target.value)}
                                className="px-2 py-1 rounded-lg border border-slate-300 bg-white font-bold text-slate-800 text-xs"
                              >
                                <option value="XI A">Kelas XI A</option>
                                <option value="XI B">Kelas XI B</option>
                              </select>
                            ) : (
                              <span className="text-slate-400 text-[11px]">-</span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <input
                              type="text"
                              placeholder="Catatan prestasi / peringkat..."
                              value={decisions[s.id]?.catatan || ''}
                              onChange={(e) => handleSetDecision(s.id, currentDecision as any, currentTarget, e.target.value)}
                              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================= SUB-STEP 4: REVIEW & EXECUTE ================= */}
          {subStep === 'review' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    Review Ringkasan &amp; Eksekusi Kenaikan Kelas / Kelulusan
                  </h4>
                  <p className="text-xs text-slate-500">
                    Periksa rekapitulasi data sebelum menjalankan perubahan permanen ke database madrasah.
                  </p>
                </div>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-center">
                  <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                    Santri Lulus (Alumni)
                  </div>
                  <div className="text-3xl font-black text-emerald-950 mt-1 font-mono">
                    {countLulusPlanned}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Dari Kelas XII A &amp; XII B</p>
                </div>

                <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl text-center">
                  <div className="text-[10px] font-black uppercase text-blue-800 tracking-wider">
                    Naik ke Kelas XII
                  </div>
                  <div className="text-3xl font-black text-blue-950 mt-1 font-mono">
                    {countNaikXIPlanned}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Dari Kelas XI A &amp; XI B</p>
                </div>

                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-center">
                  <div className="text-[10px] font-black uppercase text-amber-800 tracking-wider">
                    Naik ke Kelas XI
                  </div>
                  <div className="text-3xl font-black text-amber-950 mt-1 font-mono">
                    {countNaikXPlanned}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">Dari Kelas X A &amp; X B</p>
                </div>

                <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl text-center">
                  <div className="text-[10px] font-black uppercase text-purple-800 tracking-wider">
                    Tinggal / Mutasi
                  </div>
                  <div className="text-3xl font-black text-purple-950 mt-1 font-mono">
                    {countTinggalPlanned + countMutasiPlanned}
                  </div>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    {countTinggalPlanned} Tinggal · {countMutasiPlanned} Mutasi
                  </p>
                </div>
              </div>

              {/* Summary Detail Box */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Tahun Ajaran Lama:</span>
                  <span className="font-bold text-slate-900 font-mono">{tahunAjaranAktif} (Semester {semesterAktif})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Tahun Ajaran Baru yang Akan Diaktifkan:</span>
                  <span className="font-black text-emerald-800 font-mono text-sm">{targetTahunAjaran} (Semester {targetSemester})</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-600">Status Rombel Kelas X Baru:</span>
                  <span className="font-bold text-amber-800">Dikosongkan, siap untuk Penerimaan Santri Baru (PPDB)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-600">Jaminan Keamanan Data (Snapshot Backup):</span>
                  <span className="font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Snapshot otomatis dibuat, dapat dibatalkan (Rollback) kapan saja.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSubStep('x')}
                  className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold cursor-pointer"
                >
                  &larr; Kembali ke Langkah Sebelumnya
                </button>

                <button
                  type="button"
                  onClick={handleExecuteRollover}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-2xl text-xs sm:text-sm font-black shadow-lg shadow-emerald-700/25 flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>JALANKAN KENAIKAN KELAS &amp; KELULUSAN SEKARANG</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: GANTI SEMESTER SAJA ================= */}
      {activeTab === 'ganti-semester' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 max-w-2xl mx-auto space-y-6">
          <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                Pergantian Semester (Gasal &harr; Genap)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Gunakan menu ini jika masih dalam tahun pelajaran yang sama dan hanya berganti paruh semester. Siswa tetap berada di kelasnya masing-masing.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Tahun Ajaran Aktif:</span>
              <span className="font-bold text-slate-800 font-mono">{tahunAjaranAktif}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Semester Saat Ini:</span>
              <span className="font-black text-amber-800">Semester {semesterAktif}</span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">Pilih Semester Baru:</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => gantiSemester('Gasal')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  semesterAktif === 'Gasal'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-bold'
                }`}
              >
                <div className="text-base">Semester Gasal</div>
                <div className="text-[10px] text-slate-500 mt-1">Juli s.d. Desember</div>
              </button>

              <button
                type="button"
                onClick={() => gantiSemester('Genap')}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  semesterAktif === 'Genap'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-black shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700 font-bold'
                }`}
              >
                <div className="text-base">Semester Genap</div>
                <div className="text-[10px] text-slate-500 mt-1">Januari s.d. Juni</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: RIWAYAT & ROLLBACK ================= */}
      {activeTab === 'riwayat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="font-extrabold text-base text-slate-900">
                Riwayat Pergantian Tahun Ajaran &amp; Cadangan Snapshot
              </h4>
              <p className="text-xs text-slate-500">
                Log seluruh transisi tahun pelajaran. Setiap transisi dilengkapi cadangan snapshot yang dapat dikembalikan (Rollback) jika ada kesalahan penetapan.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {riwayatTahunAjaranList.map((item) => (
              <div
                key={item.id}
                className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-slate-900">
                      TA {item.tahunLama} ({item.semesterLama}) &rarr; TA {item.tahunBaru} ({item.semesterBaru})
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Tercatat Sah
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Diproses pada: <strong>{item.tanggal} ({item.waktu})</strong> oleh {item.diprosesOleh}
                  </p>
                  <p className="text-xs text-emerald-800 font-medium">
                    Hasil: <strong>{item.totalSiswaLulus} Santri Lulus</strong> · <strong>{item.totalSiswaNaikKelas} Santri Naik Kelas</strong> · {item.totalSiswaTinggal} Tinggal
                  </p>
                  {item.catatan && (
                    <p className="text-[11px] text-slate-500 italic mt-0.5">"{item.catatan}"</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.snapshotSiswaJson && (
                    <button
                      type="button"
                      onClick={() => {
                        confirmAction({
                          title: 'Konfirmasi Rollback Tahun Ajaran',
                          message: `Apakah Anda yakin ingin membatalkan pergantian tahun ajaran ini dan memulihkan seluruh data santri ke kondisi TA ${item.tahunLama} (${item.semesterLama})?`,
                          confirmText: 'Ya, Kembalikan Data (Rollback)',
                          cancelText: 'Batal',
                          isDanger: true,
                          onConfirm: () => {
                            rollbackPergantianTahun(item.id);
                          }
                        });
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-300 rounded-xl text-xs font-bold cursor-pointer transition-colors"
                      title="Kembalikan data santri ke kondisi sebelum transisi ini"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Rollback Snapshot</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= MODAL CETAK BERITA ACARA SK KELULUSAN & KENAIKAN KELAS ================= */}
      {showSKModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 print:p-0 print:bg-white print:static overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] print:max-h-none print:border-none print:shadow-none print:rounded-none">
            {/* Control Bar (Hidden when printing) */}
            <div className="p-4 bg-emerald-950 text-white flex items-center justify-between gap-3 print:hidden">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Berita Acara &amp; SK Kenaikan Kelas &amp; Kelulusan Santri
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak SK / Berita Acara (Print / PDF)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSKModal(false)}
                  className="p-2 text-white/70 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Document Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-100 print:bg-white print:p-0">
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-300 max-w-3xl mx-auto print:border-none print:shadow-none print:p-0 font-sans text-slate-900 space-y-4">
                {/* Kop Surat Resmi */}
                <div className="border-b-2 border-slate-900 pb-3 text-center">
                  <div className="flex items-center justify-center gap-4">
                    <div className="w-18 h-18 shrink-0 flex items-center justify-center">
                      <MadrasahLogo size="xl" />
                    </div>
                    <div>
                      <h2 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-slate-800">
                        YAYASAN PONDOK PESANTREN MA'HADUL MUTA'ALLIMIN
                      </h2>
                      <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-emerald-950">
                        MADRASAH ALIYAH PLUS MA'HADUL MUTA'ALLIMIN KATERBAN
                      </h1>
                      <p className="text-[10px] font-black text-amber-800 uppercase">
                        MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL) · BERBASIS PONDOK PESANTREN
                      </p>
                      <p className="text-[10px] text-slate-600 font-mono">
                        NSM: 131235210019 · NPSN: 69982415 · Status Akreditasi: A (Unggul)
                      </p>
                      <p className="text-[9px] text-slate-500">
                        Katerban, Kec. Paron, Kab. Ngawi, Jawa Timur 63253 · Email: {madrasahInfo.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Judul Surat Keputusan */}
                <div className="text-center pt-2 space-y-1">
                  <h3 className="text-xs sm:text-sm font-black uppercase underline tracking-wider">
                    SURAT KEPUTUSAN KEPALA MADRASAH ALIYAH PLUS MA'HADUL MUTA'ALLIMIN
                  </h3>
                  <p className="text-[10px] font-mono text-slate-700">
                    NOMOR: SK/MAPLUS/KENAIKAN-KELULUSAN/{new Date().getFullYear()}/042
                  </p>
                  <p className="text-xs font-bold text-slate-800 pt-1">
                    TENTANG PENETAPAN KELULUSAN DAN KENAIKAN KELAS PESERTA DIDIK<br />
                    TAHUN PELAJARAN {tahunAjaranAktif}
                  </p>
                </div>

                {/* Isi Surat */}
                <div className="text-xs leading-relaxed space-y-3 pt-2 text-justify">
                  <p>
                    Menimbang hasil Rapat Pleno Dewan Guru MA Plus Ma'hadul Muta'allimin Katerban-Ngawi tentang kriteria kelulusan dan kenaikan kelas peserta didik, serta evaluasi komprehensif akademik, ketertiban santri, dan keaktifan program <em>Three in One (Religius, Sains and Skill)</em>, dengan ini Kepala Madrasah memutuskan:
                  </p>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
                      <span>1. Total Santri Kelas XII Dinyatakan LULUS:</span>
                      <span className="text-emerald-800 font-black">{lastExecutedSummary?.countLulus || countLulusPlanned} Santri</span>
                    </div>
                    <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
                      <span>2. Total Santri Kelas XI Naik ke Kelas XII:</span>
                      <span className="text-blue-800 font-black">{lastExecutedSummary?.countNaikXI || countNaikXIPlanned} Santri</span>
                    </div>
                    <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
                      <span>3. Total Santri Kelas X Naik ke Kelas XI:</span>
                      <span className="text-amber-800 font-black">{lastExecutedSummary?.countNaikX || countNaikXPlanned} Santri</span>
                    </div>
                    <div className="flex justify-between font-bold">
                      <span>4. Berlakunya Tahun Pelajaran Baru:</span>
                      <span className="text-purple-800 font-black font-mono">TA {targetTahunAjaran} (Semester {targetSemester})</span>
                    </div>
                  </div>

                  <p>
                    Demikian Berita Acara dan Surat Keputusan ini dibuat dengan sebenarnya untuk menjadi dasar penetapan rombel dan buku induk madrasah.
                  </p>
                </div>

                {/* Tanda Tangan Resmi */}
                <div className="grid grid-cols-2 gap-8 text-center text-xs pt-8">
                  <div className="space-y-14">
                    <p className="font-semibold text-slate-700">Mengetahui,<br />Waka Kurikulum</p>
                    <p className="font-bold text-slate-900 border-t border-slate-400 mx-6 pt-1">
                      ( Ari Monawati, S.Pd )
                    </p>
                  </div>

                  <div className="space-y-14">
                    <p className="font-semibold text-slate-700">Katerban, Ngawi<br />Kepala Madrasah</p>
                    <div>
                      <p className="font-bold text-slate-900 border-t border-slate-400 mx-6 pt-1">
                        {madrasahInfo.kepalaMadrasah}
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono">
                        NIP. {madrasahInfo.nipKepala}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Watermark / Footer */}
                <div className="text-center text-[9px] text-slate-400 pt-4 border-t border-dashed border-slate-200">
                  Dokumen Resmi SIM MA Plus Ma'hadul Muta'allimin Katerban-Ngawi · Dicetak secara digital
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
