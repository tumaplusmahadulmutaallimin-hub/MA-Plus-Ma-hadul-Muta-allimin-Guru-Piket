import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  BookOpen,
  PlusCircle,
  HelpCircle,
  AlertTriangle,
  Send,
  MessageCircle,
  ExternalLink,
  Copy,
  Camera,
  Image as ImageIcon,
  Check,
  X,
  Eye,
  FileSpreadsheet,
  Sparkles,
  Laptop,
  Wrench,
  Shirt,
  CookingPot,
  Share2
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';
import { ImageUploader, ImagePreset } from '../common/ImageUploader';

const CLASSROOM_PHOTO_PRESETS: ImagePreset[] = [
  {
    label: 'Suasana Belajar Kelas X-A',
    url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=700',
    category: 'kelas'
  },
  {
    label: 'Santri Menyimak Materi di Meja',
    url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700',
    category: 'kelas'
  },
  {
    label: 'Aktivitas Belajar Berkelompok',
    url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=700',
    category: 'kelas'
  },
  {
    label: 'Santri Menulis di Papan Tulis',
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=700',
    category: 'kelas'
  }
];

export const MonitoringKBMView: React.FC = () => {
  const {
    monitoringKBMList,
    saveMonitoringKBM,
    confirmTeacherKBMArrival,
    jadwalKBMList,
    gurus,
    siswas,
    siswaTidakMasukList,
    catatSiswaTidakMasukJam1,
    cutOffPulangAwalList,
    localWisdomList,
    updateLocalWisdomStatus,
    generateWaTextLocalWisdom,
    setActiveView,
    alertSuccess,
    alertError,
    alertInfo
  } = useApp();

  // Tab mode: 'kbm-reguler' | 'piket-local-wisdom'
  const [activeKBMTab, setActiveKBMTab] = useState<'kbm-reguler' | 'piket-local-wisdom'>('kbm-reguler');
  const [selectedLWDay, setSelectedLWDay] = useState<'Rabu' | 'Kamis' | 'Sabtu'>('Rabu');
  const [activeLWModal, setActiveLWModal] = useState<any>(null);
  const [lwConfirmStatus, setLwConfirmStatus] = useState<'Hadir Lengkap' | 'Ada Siswa Absen' | 'Selesai'>('Hadir Lengkap');
  const [lwCatatan, setLwCatatan] = useState<string>('');

  const [activePeriod, setActivePeriod] = useState<number>(1);
  const [selectedKelas, setSelectedKelas] = useState('XA');
  const [selectedMapel, setSelectedMapel] = useState('Matematika');
  const [statusGuru, setStatusGuru] = useState<string>('Guru hadir (tepat waktu)');
  const [menitTerlambatInput, setMenitTerlambatInput] = useState<number>(15);
  const [kondisiPembelajaran, setKondisiPembelajaran] = useState<'Berlangsung dengan baik' | 'Kurang kondusif' | 'Tidak berlangsung'>('Berlangsung dengan baik');
  const [kondisiSiswa, setKondisiSiswa] = useState<'Tertib' | 'Kurang tertib' | 'Gaduh' | 'Banyak siswa tidak fokus'>('Tertib');
  const [catatan, setCatatan] = useState('');
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  // Modal Khusus Jam Ke-1: Input Absensi Manual Santri Tidak Hadir
  const [showJam1Modal, setShowJam1Modal] = useState(false);
  const [jam1Nama, setJam1Nama] = useState('');
  const [jam1Status, setJam1Status] = useState<'Sakit' | 'Izin' | 'Alpa'>('Sakit');
  const [jam1Keterangan, setJam1Keterangan] = useState('');

  // Modal 1: Dialog Pengiriman Peringatan Keterlambatan ke Guru
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningModalData, setWarningModalData] = useState<{
    guruNama: string;
    kelas: string;
    mapel: string;
    jamKe: number;
    noHp: string;
    recordId: string;
    messageText: string;
    confirmUrl: string;
  } | null>(null);

  // Modal 2: Formulir Konfirmasi Kehadiran Mandiri Guru (dilengkapi Foto Kelas)
  const [showTeacherConfirmModal, setShowTeacherConfirmModal] = useState(false);
  const [activeConfirmRecord, setActiveConfirmRecord] = useState<{
    id: string;
    guruNama: string;
    kelas: string;
    mapel: string;
    jamKe: number;
    startTime: string;
    menitTerlambat: number;
  } | null>(null);
  const [teacherPhoto, setTeacherPhoto] = useState<string>('');
  const [teacherNote, setTeacherNote] = useState<string>('');
  const [customMinutes, setCustomMinutes] = useState<number>(15);

  // Modal 3: Pratinjau Foto Bukti Kelas yang Telah Dikonfirmasi
  const [viewPhotoModal, setViewPhotoModal] = useState<{
    guruNama: string;
    kelas: string;
    mapel: string;
    jamKe: number;
    waktuHadir: string;
    menitTerlambat: number;
    fotoUrl: string;
    catatan?: string;
  } | null>(null);

  // Live countdown timer for the 15-minute monitoring window
  const [remainingSecs, setRemainingSecs] = useState<number>(168); // 02:48

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSecs(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const periods = [
    { num: 1, time: '07:00 - 07:45', status: 'Sedang Berlangsung', startHour: 7, startMin: 0 },
    { num: 2, time: '07:45 - 08:30', status: 'Belum Dimulai', startHour: 7, startMin: 45 },
    { num: 3, time: '08:30 - 09:15', status: 'Belum Dimulai', startHour: 8, startMin: 30 },
    { num: 4, time: '09:45 - 10:30', status: 'Belum Dimulai', startHour: 9, startMin: 45 },
    { num: 5, time: '10:30 - 11:15', status: 'Belum Dimulai', startHour: 10, startMin: 30 },
    { num: 6, time: '11:15 - 12:00', status: 'Belum Dimulai', startHour: 11, startMin: 15 }
  ];

  // Lookup current teacher & subject from schedule
  const currentJadwal = jadwalKBMList.find(
    j => j.kelas === selectedKelas && Number(j.jamKe) === Number(activePeriod)
  );

  const currentGuruNama =
    currentJadwal?.guru ||
    currentJadwal?.guruPengajar ||
    (selectedKelas.startsWith('X') ? 'Ahmad Fauzan, S.Pd' : 'Nur Hidayah, S.Pd');

  const currentGuruContact = gurus.find(
    g => g.nama.toLowerCase().includes(currentGuruNama.toLowerCase()) || currentGuruNama.toLowerCase().includes(g.nama.toLowerCase())
  );
  const noHpGuru = currentGuruContact?.noHp || '081234567890';

  // Automatically sync mapel from schedule when available
  useEffect(() => {
    if (currentJadwal?.mapel) {
      setSelectedMapel(currentJadwal.mapel);
    }
  }, [selectedKelas, activePeriod, currentJadwal]);

  // Handle form submission
  const handleSaveMonitoring = (e: React.FormEvent) => {
    e.preventDefault();

    const isLate15 = statusGuru.includes('terlambat');
    const now = new Date();
    const nowTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const targetPeriod = periods.find(p => p.num === activePeriod);
    const sessionTime = targetPeriod?.time || '07:00 - 07:45';
    const recordId = `mk-${Date.now()}`;

    // Link konfirmasi kehadiran guru mandiri (dapat diakses di smartphone / perangkat guru tanpa login)
    const currentOrigin = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'http://localhost:3000';
    const confirmationLink = `${currentOrigin}?konfirmasi=${recordId}&kelas=${encodeURIComponent(selectedKelas)}&jam=${activePeriod}&guru=${encodeURIComponent(currentGuruNama)}&mapel=${encodeURIComponent(selectedMapel)}`;

    // Format pesan persis sesuai instruksi user
    const warningMessage = `*PEMBERITAHUAN PERINGATAN*\nKepada Bapak/Ibu *${currentGuruNama}* pengajar kelas *${selectedKelas}*\n\nAda Kewajiban mengajar dan HAK murid untuk mendapatkan ilmu dimohon segera hadir ke kelas.\n\nKlik Link Konfirmasi Kehadiran dibawah ini:\n${confirmationLink}\n\n_(Mohon konfirmasi kehadiran dengan menyertakan foto suasana kelas santri)_`;

    saveMonitoringKBM({
      id: recordId,
      jamKe: activePeriod,
      waktu: sessionTime,
      kelas: selectedKelas,
      mapel: selectedMapel,
      guruJadwal: currentGuruNama,
      statusGuru: isLate15
        ? `Hadir Terlambat (${menitTerlambatInput} Menit) - Menunggu Konfirmasi Guru`
        : statusGuru,
      kondisiPembelajaran,
      kondisiSiswa,
      catatan,
      notifikasiPeringatanTerkirim: isLate15,
      waktuKirimPeringatan: isLate15 ? nowTimeStr : undefined,
      pesanPeringatan: isLate15 ? warningMessage : undefined,
      menitTerlambat: isLate15 ? menitTerlambatInput : undefined
    });

    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3500);

    // Jika dipilih Hadir Terlambat 15 menit, setelah diklik langsung kirimkan pesan peringatan
    if (isLate15) {
      setWarningModalData({
        guruNama: currentGuruNama,
        kelas: selectedKelas,
        mapel: selectedMapel,
        jamKe: activePeriod,
        noHp: noHpGuru,
        recordId,
        messageText: warningMessage,
        confirmUrl: confirmationLink
      });
      setShowWarningModal(true);
      alertSuccess(
        'Peringatan Terkirim',
        `Peringatan keterlambatan untuk Bapak/Ibu ${currentGuruNama} (Kelas ${selectedKelas}) berhasil dibuat. Silakan kirimkan via WhatsApp atau buka tautan konfirmasi.`
      );
    } else {
      alertSuccess(
        'Hasil Pantauan Disimpan',
        `Pantauan KBM kelas ${selectedKelas} (${selectedMapel}) Jam Ke-${activePeriod} berhasil dicatat.`
      );
    }
  };

  // Open teacher confirmation modal directly
  const handleOpenTeacherConfirmation = (
    recId: string,
    guruNama: string,
    kelas: string,
    mapel: string,
    jamKe: number,
    initialMinutes = 18
  ) => {
    setActiveConfirmRecord({
      id: recId,
      guruNama,
      kelas,
      mapel,
      jamKe,
      startTime: '07:00 WIB',
      menitTerlambat: initialMinutes
    });
    setCustomMinutes(initialMinutes);
    setTeacherPhoto(CLASSROOM_PHOTO_PRESETS[0].url);
    setTeacherNote('');
    setShowTeacherConfirmModal(true);
  };

  // Submit teacher self confirmation with classroom photo
  const handleConfirmArrivalWithPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConfirmRecord) return;

    if (!teacherPhoto) {
      alertInfo('Foto Diperlukan', 'Silakan unggah atau pilih foto bukti kelas santri.');
      return;
    }

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    confirmTeacherKBMArrival(activeConfirmRecord.id, {
      fotoBuktiKelas: teacherPhoto,
      catatan: teacherNote || 'Guru telah tiba di kelas dan KBM sedang berlangsung.',
      waktuKonfirmasiHadir: timeStr,
      menitTerlambat: customMinutes
    });

    setShowTeacherConfirmModal(false);
    setShowWarningModal(false);

    alertSuccess(
      'Kehadiran Berhasil Dikonfirmasi!',
      `Bapak/Ibu ${activeConfirmRecord.guruNama} tercatat hadir pada pukul ${timeStr} (Terlambat ${customMinutes} Menit) dengan bukti foto kelas siswa.`
    );
  };

  // Export Monitoring KBM directly to Excel (.xlsx) with separated column cells
  const handleExportKBMXLSX = () => {
    const headers = [
      'No',
      'Jam Ke',
      'Waktu KBM',
      'Kelas',
      'Mata Pelajaran',
      'Guru Terjadwal',
      'Status Kehadiran',
      'Kondisi Pembelajaran',
      'Kondisi Siswa',
      'Status Konfirmasi Guru',
      'Waktu Tiba Guru',
      'Keterlambatan (Menit)',
      'Catatan Petugas Piket'
    ];

    const data = monitoringKBMList.map((item, idx) => [
      idx + 1,
      item.jamKe,
      item.waktu,
      item.kelas,
      item.mapel,
      item.guruJadwal,
      item.statusGuru,
      item.kondisiPembelajaran,
      item.kondisiSiswa,
      item.dikonfirmasiGuru ? 'Terkonfirmasi (Bukti Foto Terlampir)' : 'Belum Konfirmasi',
      item.waktuKonfirmasiHadir || '-',
      item.menitTerlambat || 0,
      item.catatan || '-'
    ]);

    exportToXLSX({
      filename: `Monitoring_KBM_Hari_Ini_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Monitoring KBM',
      headers,
      data,
      colWidths: [6, 10, 14, 10, 24, 26, 30, 22, 16, 26, 16, 18, 35]
    });

    alertSuccess('Export Berhasil', 'Data monitoring KBM berhasil diekspor ke Microsoft Excel (.xlsx) dengan kolom sel terpisah.');
  };

  // Classes list for current period with live status
  const classes = ['XA', 'XB', 'XIA', 'XIB', 'XIIA', 'XIIB', 'XIIC'];

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800">
              Monitoring KBM & Ketepatan Hadir Guru
            </h3>
            <p className="text-[11px] text-slate-400">
              Total {monitoringKBMList.length} pantauan tercatat hari ini
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <button
            type="button"
            onClick={handleExportKBMXLSX}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Ekspor ke Excel (.xlsx) dengan kolom sel terpisah"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export .xlsx</span>
          </button>

          <a
            href="?portal=konfirmasi"
            target="_blank"
            rel="noreferrer"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Buka portal mandiri guru pengajar di tab terpisah"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            <span>Portal HP Guru</span>
          </a>
        </div>
      </div>
      {/* Primary Sub-Tabs: KBM Reguler vs Piket Local Wisdom */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-200/80 rounded-2xl w-full sm:w-fit border border-slate-300/80 shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveKBMTab('kbm-reguler')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeKBMTab === 'kbm-reguler'
              ? 'bg-white text-slate-900 shadow-md border border-slate-200'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
          }`}
        >
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Monitoring KBM Reguler (Kelas)</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded-md font-mono">
            {monitoringKBMList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveKBMTab('piket-local-wisdom')}
          className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
            activeKBMTab === 'piket-local-wisdom'
              ? 'bg-gradient-to-r from-teal-700 to-emerald-700 text-white shadow-md'
              : 'text-slate-600 hover:text-teal-900 hover:bg-white/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Piket Local Wisdom (Lab &amp; Bengkel)</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-md font-bold bg-amber-400 text-slate-950">
            {localWisdomList.filter(l => l.statusKonfirmasi === 'Menunggu Konfirmasi').length} Menunggu
          </span>
        </button>
      </div>

      {/* JIKA TAB PIKET LOCAL WISDOM AKTIF */}
      {activeKBMTab === 'piket-local-wisdom' && (
        <div className="bg-white p-5 sm:p-7 rounded-3xl border border-teal-200/80 shadow-xs space-y-6 animate-in fade-in">
          {/* Header Modul Piket Local Wisdom */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-700 text-white flex items-center justify-center shadow-md shadow-teal-900/20 shrink-0">
                <Sparkles className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                    Modul Piket Local Wisdom (Delegasi Lab / Bengkel)
                  </h3>
                  <span className="text-[10px] font-extrabold bg-teal-100 text-teal-900 px-2 py-0.5 rounded-full border border-teal-300">
                    Delegasi Kehadiran Praktikum
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
                  Guru piket mendelegasikan verifikasi kehadiran siswa di ruang kejuruan (Lab TIK Komputer, Bengkel TKRO, Ruang Jahit BLK Busana, Dapur Tata Boga) kepada guru/instruktur pengampu. Status otomatis <strong>'Menunggu Konfirmasi'</strong> hingga instruktur melakukan konfirmasi mandiri via WhatsApp atau portal.
                </p>
              </div>
            </div>

            {/* Pilihan Hari / Angkatan */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl text-xs font-bold shrink-0 border border-slate-200">
              {(['Rabu', 'Kamis', 'Sabtu'] as const).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedLWDay(day)}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                    selectedLWDay === day
                      ? 'bg-teal-700 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {day} {day === 'Rabu' ? '(Kelas 11)' : day === 'Kamis' ? '(Kelas 10)' : '(Kelas 12)'}
                </button>
              ))}
            </div>
          </div>

          {/* SOP Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-teal-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-600 animate-ping"></span>
              <p className="text-teal-950 font-medium">
                <strong>Alur Operasional Piket:</strong> Klik icon WhatsApp atau salin link konfirmasi mandiri untuk dikirimkan kepada guru pengampu. Guru membuka link di HP dan memverifikasi presensi siswa.
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-white text-teal-800 rounded-lg border border-teal-200 shadow-2xs shrink-0">
              SOP Madrasah Tiga in One
            </span>
          </div>

          {/* Cards Sesi Praktikum Local Wisdom */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {localWisdomList.filter(l => l.hari === selectedLWDay).map((session) => {
              const isConfirmed = session.statusKonfirmasi === 'Hadir Lengkap' || session.statusKonfirmasi === 'Selesai';
              const isIssue = session.statusKonfirmasi === 'Ada Siswa Absen';
              const isWaiting = session.statusKonfirmasi === 'Menunggu Konfirmasi';

              // Generated Portal Link for direct teacher self confirmation
              const currentOrigin = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'http://localhost:3000';
              const teacherSelfLink = `${currentOrigin}?portal=konfirmasi&id=${session.id}&guru=${encodeURIComponent(session.instruktur)}&kelas=${encodeURIComponent(session.tingkatKelas)}&mapel=${encodeURIComponent(session.jurusan + ' (' + session.lokasi + ')')}`;

              return (
                <div
                  key={session.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3.5 ${
                    isConfirmed
                      ? 'bg-emerald-50/50 border-emerald-300 shadow-xs'
                      : isIssue
                      ? 'bg-rose-50/50 border-rose-300 shadow-xs'
                      : 'bg-white border-amber-300 ring-1 ring-amber-400/20 shadow-xs'
                  }`}
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-teal-700 shadow-2xs">
                          {session.jurusan.includes('IT') ? (
                            <Laptop className="w-4.5 h-4.5 text-blue-600" />
                          ) : session.jurusan.includes('TKRO') ? (
                            <Wrench className="w-4.5 h-4.5 text-amber-600" />
                          ) : session.jurusan.includes('Busana') ? (
                            <Shirt className="w-4.5 h-4.5 text-rose-600" />
                          ) : (
                            <CookingPot className="w-4.5 h-4.5 text-emerald-600" />
                          )}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 leading-tight">
                            {session.jurusan}
                          </h4>
                          <p className="text-[10px] text-teal-800 font-bold mt-0.5">
                            {session.lokasi}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-[9.5px] font-extrabold px-2 py-0.5 rounded-full border tracking-wide whitespace-nowrap ${
                          isConfirmed
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : isIssue
                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                            : 'bg-amber-100 text-amber-900 border-amber-300 animate-pulse'
                        }`}
                      >
                        {session.statusKonfirmasi}
                      </span>
                    </div>

                    {/* Detail Info */}
                    <div className="mt-3.5 space-y-1.5 text-xs bg-slate-50/80 p-2.5 rounded-xl border border-slate-200/80">
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Guru Pengampu:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[120px]">{session.instruktur}</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Jumlah Siswa:</span>
                        <span className="font-mono font-bold text-slate-800">{session.jumlahSiswa} Santri</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-500">
                        <span>Tingkat Rombel:</span>
                        <span className="font-semibold text-slate-700">{session.tingkatKelas}</span>
                      </div>
                      {session.waktuKonfirmasi && (
                        <div className="flex justify-between items-center text-[11px] text-emerald-700 font-semibold pt-1 border-t border-slate-200/60">
                          <span>Waktu Konfirmasi:</span>
                          <span className="font-mono">{session.waktuKonfirmasi}</span>
                        </div>
                      )}
                      {session.catatanInstruktur && (
                        <p className="text-[11px] text-slate-700 bg-white p-2 rounded-lg border border-slate-200 mt-1.5 italic">
                          "{session.catatanInstruktur}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for Guru Piket */}
                  <div className="space-y-2 pt-2 border-t border-slate-200/80">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveLWModal(session);
                          setLwConfirmStatus(session.statusKonfirmasi as any);
                          setLwCatatan(session.catatanInstruktur || '');
                        }}
                        className="flex-1 py-1.5 px-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer"
                        title="Verifikasi atau ubah status konfirmasi rombel"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verifikasi</span>
                      </button>

                      {/* Kirim WhatsApp ke Guru Pengampu */}
                      <a
                        href={`https://api.whatsapp.com/send?phone=${session.noWaInstruktur}&text=${encodeURIComponent(
                          generateWaTextLocalWisdom(session) + `\n\nLink Konfirmasi Mandiri Guru:\n${teacherSelfLink}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all cursor-pointer shadow-2xs"
                        title="Kirim Pesan WhatsApp Permohonan Konfirmasi ke Guru Pengampu"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      {/* Salin Tautan Mandiri Guru */}
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(teacherSelfLink);
                          alertSuccess('Tautan Disalin', `Link portal mandiri untuk ${session.instruktur} berhasil disalin ke clipboard.`);
                        }}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl transition-all cursor-pointer shadow-2xs"
                        title="Salin Tautan Konfirmasi Mandiri Guru"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {isWaiting && (
                      <p className="text-[10px] text-amber-800 font-semibold text-center bg-amber-50 py-1 rounded-lg border border-amber-200">
                        ⏳ Menunggu aksi dari Bapak/Ibu {session.instruktur}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Period Selection Bar (Hanya tampil saat tab KBM Reguler aktif) */}
      {activeKBMTab === 'kbm-reguler' && (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {periods.map((p) => {
          const isActive = activePeriod === p.num;
          return (
            <button
              key={p.num}
              onClick={() => setActivePeriod(p.num)}
              className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black font-mono ${
                    isActive ? 'bg-white text-blue-600' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {p.num}
                </span>
                <span className="text-xs font-bold font-mono">{p.time}</span>
              </div>
              <span
                className={`text-[10px] font-semibold mt-1.5 inline-block px-1.5 py-0.5 rounded ${
                  isActive
                    ? 'bg-blue-500/50 text-white'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {p.status}
              </span>
            </button>
          );
        })}
      </div>
      )}

      {/* Main Grid: Form Left & Sidebars Right (Hanya tampil saat KBM Reguler aktif) */}
      {activeKBMTab === 'kbm-reguler' && (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Monitoring Form */}
        <div className="lg:col-span-8 bg-white p-5 sm:p-7 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
                Form Monitoring Kelas
              </h3>
              <p className="text-xs text-slate-400">
                Isi hasil pengecekan kelas berdasarkan kondisi yang sebenarnya.
              </p>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-[11px] font-semibold">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              <span>Pengisian dilakukan maksimal 15 menit setelah bel berbunyi.</span>
            </div>
          </div>

          {isSavedNotice && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Hasil monitoring kelas {selectedKelas} berhasil disimpan dan disinkronkan ke rekapitulasi!</span>
            </div>
          )}

          <form onSubmit={handleSaveMonitoring} className="space-y-6">
            {/* Top row selects: Kelas, Jam, Mapel */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  1. Pilih Kelas <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls}>
                      Kelas {cls}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  2. Jam Ke <span className="text-red-500">*</span>
                </label>
                <select
                  value={activePeriod}
                  onChange={(e) => setActivePeriod(Number(e.target.value))}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  {periods.map((p) => (
                    <option key={p.num} value={p.num}>
                      Jam Ke-{p.num} ({p.time})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  3. Pilih Mata Pelajaran <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedMapel}
                  onChange={(e) => setSelectedMapel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 cursor-pointer"
                >
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Fiqih">Fiqih</option>
                  <option value="SKI">SKI</option>
                  <option value="Ekonomi">Ekonomi</option>
                  <option value="Kimia">Kimia</option>
                  <option value="Fisika">Fisika</option>
                  <option value="Biologi">Biologi</option>
                </select>
              </div>
            </div>

            {/* Auto Schedule Info Box */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl flex flex-wrap items-center justify-between text-xs gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="font-bold text-blue-900">Informasi Jadwal Guru (Otomatis):</span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-700 text-[11px]">
                <span>Guru: <strong className="text-blue-950 font-bold">{currentGuruNama}</strong></span>
                <span>Kontak: <strong className="font-mono text-emerald-800">{noHpGuru}</strong></span>
                <span>Ruang: <strong>R. {selectedKelas}</strong></span>
                <span>Bel Masuk: <strong>07:00 WIB</strong></span>
              </div>
            </div>

            {/* Solusi Kepulangan Lebih Awal: Banner Informasi Cut-Off Dispensasi Aktif */}
            {cutOffPulangAwalList.some(c => c.status === 'Aktif' && (c.tipe === 'Massal' || c.kelasTerdampak.includes(selectedKelas) || c.kelasTerdampak.includes('Semua Kelas'))) && (
              <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5 animate-pulse" />
                <div>
                  <span className="font-extrabold uppercase text-[10px] bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full inline-block mb-1">
                    Dispensasi Pulang Lebih Awal Berlaku
                  </span>
                  <p className="leading-relaxed">
                    Kelas {selectedKelas} memiliki ketetapan cut-off jam kepulangan pukul <strong>{cutOffPulangAwalList.find(c => c.status === 'Aktif')?.jamCutOff} WIB</strong> ({cutOffPulangAwalList.find(c => c.status === 'Aktif')?.alasan}). Pembelajaran setelah cut-off tidak dihitung kosong atau alpa.
                  </p>
                </div>
              </div>
            )}

            {/* KHUSUS JAM KE-1: Input Absensi Manual Santri Tidak Hadir */}
            {activePeriod === 1 && (
              <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50 via-teal-50/60 to-amber-50/40 border-2 border-emerald-400 rounded-2xl space-y-3.5 shadow-2xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-emerald-200/90">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold shrink-0 shadow-2xs">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-emerald-950 uppercase tracking-wide flex items-center gap-2">
                        <span>Presensi Manual Siswa Tidak Hadir (Khusus Jam Ke-1)</span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full font-bold">Wajib Dicek</span>
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-medium mt-0.5 leading-snug">
                        <strong>Aturan Sistem:</strong> Jika santri <u>tidak diinputkan</u> di sini, maka otomatis diakui <strong>HADIR</strong> dalam seluruh rekapitulasi kehadiran madrasah.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setJam1Nama('');
                      setJam1Keterangan('');
                      setShowJam1Modal(true);
                    }}
                    className="px-3 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition-all"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>+ Catat Santri Tidak Hadir</span>
                  </button>
                </div>

                {/* Status Santri Jam 1 Kelas Ini */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">Daftar Santri Kelas {selectedKelas} Tidak Hadir Jam ke-1:</span>
                    <span className="font-mono text-slate-500 font-bold text-[10px]">
                      {siswaTidakMasukList.filter(s => s.kelas === selectedKelas && s.jamKe === 1).length} Santri Tercatat
                    </span>
                  </div>

                  {siswaTidakMasukList.filter(s => s.kelas === selectedKelas && s.jamKe === 1).length === 0 ? (
                    <div className="p-3 bg-white/90 rounded-xl border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2 font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Seluruh santri Kelas {selectedKelas} otomatis dianggap <strong>HADIR LENGKAP</strong> karena belum ada input ketidakhadiran di jam ke-1.</span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {siswaTidakMasukList
                        .filter(s => s.kelas === selectedKelas && s.jamKe === 1)
                        .map((s) => (
                          <div key={s.id} className="p-2.5 bg-white rounded-xl border border-rose-200 flex items-center justify-between text-xs shadow-2xs">
                            <div>
                              <p className="font-bold text-slate-900">{s.nama}</p>
                              <p className="text-[10px] text-slate-500">{s.keterangan || 'Tidak hadir jam 1'}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                s.status === 'Sakit' ? 'bg-amber-100 text-amber-800' :
                                s.status === 'Izin' ? 'bg-blue-100 text-blue-800' :
                                'bg-rose-100 text-rose-800'
                              }`}>
                                {s.status} (Permanen)
                              </span>
                              <span className="block text-[9px] text-slate-400 mt-0.5">Rekap: Tidak Hadir</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Radio Group 4: Status Guru di Kelas */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                  4. Status Guru di Kelas <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Pilih salah satu kondisi riil</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {[
                  { id: 'tepat', label: 'Guru hadir (tepat waktu)', desc: 'Guru telah berada di kelas saat bel berbunyi' },
                  { id: 'terlambat15', label: 'Guru hadir (terlambat 15 menit)', desc: 'Guru belum tiba > 15 menit (Pemicu Peringatan Otomatis)' },
                  { id: 'pengganti', label: 'Guru pengganti hadir', desc: 'Diisi oleh guru inval/pengganti yang ditugaskan' },
                  { id: 'kosong', label: 'Guru tidak hadir / kelas kosong', desc: 'Kelas belum ada guru dan siswa tanpa pendamping' }
                ].map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer font-medium transition-all ${
                      statusGuru === opt.label
                        ? opt.id === 'terlambat15'
                          ? 'border-amber-500 bg-amber-50/80 text-amber-950 shadow-xs ring-1 ring-amber-300'
                          : 'border-blue-600 bg-blue-50/70 text-blue-900 shadow-xs ring-1 ring-blue-300'
                        : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="statusGuru"
                      checked={statusGuru === opt.label}
                      onChange={() => setStatusGuru(opt.label)}
                      className="mt-0.5 text-blue-600 focus:ring-blue-500 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <span>{opt.label}</span>
                        {opt.id === 'terlambat15' && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 text-[9px] font-extrabold uppercase">
                            Pengingat Aktif
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {/* Dynamic Warning Notification Box if Terlambat 15 Menit is selected */}
              {statusGuru === 'Guru hadir (terlambat 15 menit)' && (
                <div className="p-4 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300 rounded-2xl text-xs space-y-3 shadow-xs animate-in fade-in">
                  <div className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-amber-500 text-white rounded-lg shrink-0 mt-0.5">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-amber-950 text-xs">
                        Fitur Otomatis: Pengiriman PEMBERITAHUAN PERINGATAN ke Guru
                      </h4>
                      <p className="text-amber-900/90 text-[11px] mt-0.5 leading-relaxed">
                        Setelah menekan tombol <strong>Simpan Hasil Monitoring</strong>, sistem akan otomatis membuka dialog pengingat resmi yang memuat hak murid untuk mendapatkan ilmu serta tautan konfirmasi kehadiran mandiri guru dengan foto kelas siswa.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white/90 p-3 rounded-xl border border-amber-200 text-[11px] text-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Estimasi Keterlambatan Awal:</span>
                      <div className="flex items-center gap-1.5">
                        {[15, 20, 25, 30].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setMenitTerlambatInput(mins)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                              menitTerlambatInput === mins
                                ? 'bg-amber-600 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {mins} mnt
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="text-[10px] text-amber-800 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-600" />
                      <span>Catatan menit riil keterlambatan akan dihitung kembali saat guru mengklik konfirmasi & mengunggah foto kelas.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Radio Group 5 & 6: Kondisi Pembelajaran & Kondisi Siswa */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  5. Kondisi Pembelajaran <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {['Berlangsung dengan baik', 'Kurang kondusif', 'Tidak berlangsung'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer font-medium transition-all ${
                        kondisiPembelajaran === opt
                          ? 'border-blue-600 bg-blue-50/60 text-blue-800 font-semibold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="kondisiPembelajaran"
                        checked={kondisiPembelajaran === opt}
                        onChange={() => setKondisiPembelajaran(opt as any)}
                        className="text-blue-600 cursor-pointer"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  6. Kondisi Siswa <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2 text-xs">
                  {['Tertib', 'Kurang tertib', 'Gaduh', 'Banyak siswa tidak fokus'].map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer font-medium transition-all ${
                        kondisiSiswa === opt
                          ? 'border-blue-600 bg-blue-50/60 text-blue-800 font-semibold'
                          : 'border-slate-200 bg-slate-50/50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="kondisiSiswa"
                        checked={kondisiSiswa === opt}
                        onChange={() => setKondisiSiswa(opt as any)}
                        className="text-blue-600 cursor-pointer"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. Catatan / Temuan */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                7. Catatan / Temuan Piket
              </label>
              <textarea
                rows={3}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Tulis catatan hasil monitoring (misal: guru terlambat karena menyiapkan media di lab, proyektor mati)..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-600 font-medium"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setCatatan('');
                  setStatusGuru('Guru hadir (tepat waktu)');
                  setKondisiPembelajaran('Berlangsung dengan baik');
                  setKondisiSiswa('Tertib');
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-xs font-semibold text-slate-600 cursor-pointer"
              >
                Reset Form
              </button>

              <button
                type="submit"
                className="px-6 py-2.8 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 active:from-blue-900 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-700/25 tracking-wide uppercase transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simpan Hasil Monitoring</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (4 cols): Window Countdown, Class checklist */}
        <div className="lg:col-span-4 space-y-4">
          {/* Time Window Countdown Card */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-slate-900">
                  Waktu Monitoring Jam Ke {activePeriod}
                </h4>
              </div>
              <span className="text-[10px] text-slate-400 font-medium">07:00 - 07:15</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${(remainingSecs / 900) * 100}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <span className="text-[10px] text-slate-400 block">Bel berbunyi: 07:00 WIB</span>
                <span className="text-[10px] text-slate-400 block">Batas toleransi: 15 menit</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-semibold block">Sisa waktu:</span>
                <span className="text-lg font-black text-emerald-600 font-mono">
                  {formatCountdown(remainingSecs)}
                </span>
              </div>
            </div>
          </div>

          {/* Class Checklist for Current Period */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Daftar Kelas Jam Ke {activePeriod}</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono">{classes.length} Rombel</span>
            </div>

            <div className="divide-y divide-slate-100 text-xs max-h-[380px] overflow-y-auto pr-1">
              {classes.map((clsName) => {
                const rec = monitoringKBMList.find(
                  m => m.kelas === clsName && Number(m.jamKe) === Number(activePeriod)
                );

                const isFilled = Boolean(rec && rec.statusIsi === 'Sudah diisi');
                const isLate = rec?.statusGuru?.toLowerCase().includes('terlambat');
                const isConfirmed = rec?.dikonfirmasiGuru;

                return (
                  <div key={clsName} className="py-2.5 flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-xs">Kelas {clsName}</span>
                        {rec?.guruJadwal && (
                          <span className="text-[10px] text-slate-400 truncate max-w-[110px]">
                            • {rec.guruJadwal}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedKelas(clsName);
                            if (rec?.mapel) setSelectedMapel(rec.mapel);
                            if (rec?.statusGuru) setStatusGuru(rec.statusGuru);
                            if (rec?.catatan) setCatatan(rec.catatan);
                          }}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded cursor-pointer ${
                            selectedKelas === clsName
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {selectedKelas === clsName ? 'Aktif' : isFilled ? 'Tinjau' : 'Isi Form'}
                        </button>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px]">
                      {isFilled ? (
                        isLate ? (
                          isConfirmed ? (
                            <div className="flex items-center justify-between w-full bg-emerald-50 text-emerald-800 px-2 py-1 rounded-lg border border-emerald-200">
                              <span className="font-bold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>Terlambat {rec.menitTerlambat || 18} Menit (Dikonfirmasi)</span>
                              </span>
                              {rec.fotoBuktiKelas && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setViewPhotoModal({
                                      guruNama: rec.guruJadwal,
                                      kelas: rec.kelas,
                                      mapel: rec.mapel,
                                      jamKe: rec.jamKe,
                                      waktuHadir: rec.waktuKonfirmasiHadir || '07:18 WIB',
                                      menitTerlambat: rec.menitTerlambat || 18,
                                      fotoUrl: rec.fotoBuktiKelas || '',
                                      catatan: rec.catatanKonfirmasiGuru
                                    })
                                  }
                                  className="text-[10px] font-bold text-emerald-700 hover:underline flex items-center gap-0.5 cursor-pointer"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Lihat Foto</span>
                                </button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between w-full bg-amber-50 text-amber-800 px-2 py-1 rounded-lg border border-amber-200">
                              <span className="font-semibold flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3 text-amber-600" />
                                <span>Peringatan Terkirim (Menunggu Guru)</span>
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  if (rec) {
                                    const currentOrigin = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'http://localhost:3000';
                                    const confirmationLink = `${currentOrigin}?konfirmasi=${rec.id}&kelas=${encodeURIComponent(rec.kelas)}&jam=${rec.jamKe}&guru=${encodeURIComponent(rec.guruJadwal)}&mapel=${encodeURIComponent(rec.mapel)}`;
                                    const msg = `*PEMBERITAHUAN PERINGATAN*\nKepada Bapak/Ibu *${rec.guruJadwal}* pengajar kelas *${rec.kelas}*\n\nAda Kewajiban mengajar dan HAK murid untuk mendapatkan ilmu dimohon segera hadir ke kelas.\n\nKlik Link Konfirmasi Kehadiran dibawah ini:\n${confirmationLink}\n\n_(Mohon konfirmasi kehadiran dengan menyertakan foto suasana kelas santri)_`;

                                    setWarningModalData({
                                      guruNama: rec.guruJadwal,
                                      kelas: rec.kelas,
                                      mapel: rec.mapel,
                                      jamKe: rec.jamKe,
                                      noHp: noHpGuru,
                                      recordId: rec.id,
                                      messageText: msg,
                                      confirmUrl: confirmationLink
                                    });
                                    setShowWarningModal(true);
                                  }
                                }}
                                className="text-[10px] font-bold text-amber-900 bg-amber-200 hover:bg-amber-300 px-1.5 py-0.5 rounded cursor-pointer"
                              >
                                Link Konfirmasi
                              </button>
                            </div>
                          )
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100 flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            <span>Hadir Tepat Waktu ({rec?.waktuCek || '07:05'})</span>
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-medium">
                          Belum Diisi
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick link: Pendataan Siswa Tidak Masuk */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-200 space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">
                  Pendataan Siswa Tidak Masuk
                </h4>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  Catat siswa yang tidak hadir pada hari ini. Data otomatis terhubung ke perhitungan porsi MBG madrasah.
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveView('siswa-tidak-masuk')}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Buka Presensi Siswa Tidak Masuk</span>
            </button>
          </div>
        </div>
      </div>
      )}

      {/* MODAL 1: PEMBERITAHUAN PERINGATAN KETERLAMBATAN GURU */}
      {showWarningModal && warningModalData && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            {/* Header Dialog */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-red-100 text-red-700 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wide">
                    PEMBERITAHUAN PERINGATAN
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Keterlambatan Hadir KBM &gt; 15 Menit di Kelas {warningModalData.kelas}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWarningModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Official Message Notice Box (Formatted exactly as requested) */}
            <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-sans text-xs space-y-3 shadow-inner border border-slate-800">
              <div className="border-b border-slate-700/80 pb-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                  Format Pesan Pengingat Resmi:
                </span>
                <h4 className="text-sm font-black text-white mt-1">
                  PEMBERITAHUAN PERINGATAN
                </h4>
                <p className="text-amber-200 font-semibold text-xs mt-0.5">
                  Kepada Bapak/Ibu {warningModalData.guruNama} pengajar kelas {warningModalData.kelas}
                </p>
              </div>

              <div className="text-slate-200 text-xs leading-relaxed space-y-2">
                <p className="font-medium text-emerald-200">
                  Ada Kewajiban mengajar dan HAK murid untuk mendapatkan ilmu dimohon segera hadir ke kelas.
                </p>
                <div className="p-3 bg-slate-800/95 rounded-xl border border-slate-700 text-[11px] space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-400 font-semibold">Klik Link Konfirmasi Kehadiran dibawah ini:</p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(warningModalData.confirmUrl);
                        alertSuccess('Link Disalin', 'Tautan konfirmasi kehadiran berhasil disalin ke clipboard.');
                      }}
                      className="px-2 py-0.5 rounded bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 text-[10px] font-bold border border-cyan-700/60 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-2.5 h-2.5" />
                      <span>Salin Link</span>
                    </button>
                  </div>

                  <a
                    href={warningModalData.confirmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 hover:text-cyan-100 font-mono text-[11px] break-all underline flex items-center gap-1 p-2 bg-slate-900/80 rounded-lg border border-cyan-800/40"
                    title="Buka langsung di tab / browser baru"
                  >
                    <span className="flex-1">{warningModalData.confirmUrl}</span>
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
                  </a>

                  {/* QR Code preview for smartphone scanning */}
                  <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-700 flex items-center gap-3">
                    <div className="w-16 h-16 bg-white p-1 rounded-lg shrink-0 shadow-xs flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(warningModalData.confirmUrl)}`}
                        alt="QR Code Konfirmasi Guru"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-[10px] text-slate-300 space-y-0.5 leading-snug">
                      <p className="font-bold text-amber-300">📱 Scan QR Code dari HP Guru:</p>
                      <p className="text-slate-400">
                        Arahkan kamera smartphone guru ke kode QR ini untuk langsung membuka formulir konfirmasi & foto kelas tanpa perlu login.
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 italic">
                    (Setelah klik link yang berisi konfirmasi saya sudah hadir dengan memberikan foto kelas siswa. Setelah diklik maka di monitoring akan terdapat keterangan terlambat berapa menitnya)
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons for Sending Reminder */}
            <div className="space-y-2 pt-1">
              <a
                href={`https://wa.me/${warningModalData.noHp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(warningModalData.messageText)}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim Pesan WhatsApp ke Guru ({warningModalData.noHp})</span>
              </a>

              <a
                href={warningModalData.confirmUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-cyan-200" />
                <span>Buka Link Konfirmasi Guru di Tab Baru (Unggah Foto Kelas)</span>
                <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
              </a>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(warningModalData.messageText);
                    alertSuccess('Disalin', 'Teks pesan peringatan resmi berhasil disalin ke clipboard.');
                  }}
                  className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Salin Pesan WA</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleOpenTeacherConfirmation(
                      warningModalData.recordId,
                      warningModalData.guruNama,
                      warningModalData.kelas,
                      warningModalData.mapel,
                      warningModalData.jamKe,
                      18
                    );
                  }}
                  className="py-2 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                  title="Simulasi dialog pop-up konfirmasi guru di layar ini"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Dialog Popup</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowWarningModal(false)}
                  className="px-5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: FORMULIR KONFIRMASI KEHADIRAN MANDIRI GURU DENGAN FOTO KELAS */}
      {showTeacherConfirmModal && activeConfirmRecord && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Camera className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Konfirmasi Kehadiran Mandiri Guru di Kelas
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Bapak/Ibu <strong>{activeConfirmRecord.guruNama}</strong> • Kelas <strong>{activeConfirmRecord.kelas}</strong> ({activeConfirmRecord.mapel})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTeacherConfirmModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Time & Late Calculation Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-800 font-medium">Jam Bel Mulai KBM:</span>
                <span className="font-bold font-mono text-slate-800">{activeConfirmRecord.startTime}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-amber-800 font-medium">Waktu Konfirmasi Sekarang:</span>
                <span className="font-bold font-mono text-emerald-700">
                  {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                </span>
              </div>
              <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950">Keterangan Waktu Terlambat:</span>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-1 bg-amber-600 text-white rounded-lg text-xs font-black font-mono">
                    Terlambat {customMinutes} Menit
                  </span>
                </div>
              </div>

              {/* Minute adjustment buttons */}
              <div className="flex items-center justify-end gap-1 pt-1 text-[10px]">
                <span className="text-slate-500 mr-1">Sesuaikan:</span>
                {[15, 18, 20, 25, 30].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCustomMinutes(m)}
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      customMinutes === m
                        ? 'bg-amber-700 text-white font-bold'
                        : 'bg-white text-slate-600 border border-amber-200 hover:bg-amber-100'
                    }`}
                  >
                    {m} mnt
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleConfirmArrivalWithPhoto} className="space-y-4">
              {/* Photo Upload: Classroom & Students Proof */}
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5 flex items-center justify-between">
                  <span>Foto Bukti Suasana Kelas Santri (Wajib) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-emerald-700 font-semibold">Tersimpan dalam buku monitoring</span>
                </label>
                <ImageUploader
                  currentImage={teacherPhoto}
                  onImageChange={(url) => setTeacherPhoto(url)}
                  label="Foto Kelas & Santri"
                  sublabel="Ambil/unggah foto ruang kelas beserta santri sebagai bukti kehadiran mengajar"
                  shape="rectangle"
                  presets={CLASSROOM_PHOTO_PRESETS}
                  showPresets={true}
                />
              </div>

              {/* Teacher Note */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keterangan Singkat Keterlambatan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={teacherNote}
                  onChange={(e) => setTeacherNote(e.target.value)}
                  placeholder="Contoh: Menyiapkan alat peraga sains di lab / koordinasi berkas di ruang guru..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Submit confirmation button */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowTeacherConfirmModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!teacherPhoto}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Konfirmasi Saya Sudah Hadir di Kelas</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: LIHAT FOTO BUKTI KELAS */}
      {viewPhotoModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  Bukti Foto Kehadiran Kelas Siswa
                </h4>
                <p className="text-xs text-slate-200 font-semibold mt-0.5">
                  Bapak/Ibu {viewPhotoModal.guruNama} • Kelas {viewPhotoModal.kelas} ({viewPhotoModal.mapel})
                </p>
              </div>
              <button
                onClick={() => setViewPhotoModal(null)}
                className="text-slate-400 hover:text-white p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img
                  src={viewPhotoModal.fotoUrl}
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
                    Terlambat {viewPhotoModal.menitTerlambat} Menit (Tiba {viewPhotoModal.waktuHadir})
                  </span>
                </div>
                {viewPhotoModal.catatan && (
                  <div className="pt-1 border-t border-slate-200 text-slate-600 text-[11px] italic">
                    "{viewPhotoModal.catatan}"
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setViewPhotoModal(null)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: INPUT ABSENSI MANUAL SANTRI TIDAK HADIR JAM KE-1 */}
      {showJam1Modal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Input Santri Tidak Hadir Jam ke-1
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Kelas {selectedKelas} • Khusus Jam Pelajaran Pertama
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowJam1Modal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 leading-relaxed font-medium">
              💡 <strong>Ketentuan Rekap:</strong> Santri yang diinputkan di sini akan ditetapkan status <strong>Tidak Hadir (Permanen)</strong> dalam rekapitulasi presensi madrasah. Santri lain yang tidak diinput otomatis dianggap <strong>Hadir</strong>.
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!jam1Nama.trim()) {
                  alertError('Nama Santri Diperlukan', 'Silakan pilih atau ketik nama santri yang tidak hadir.');
                  return;
                }
                catatSiswaTidakMasukJam1({
                  nama: jam1Nama.trim(),
                  kelas: selectedKelas,
                  status: jam1Status,
                  keterangan: jam1Keterangan.trim() || `Tidak hadir jam ke-1 (${jam1Status})`
                });
                alertSuccess(
                  'Presensi Tidak Hadir Dicatat',
                  `Santri ${jam1Nama} (${selectedKelas}) berhasil dicatat ${jam1Status} pada jam ke-1.`
                );
                setShowJam1Modal(false);
                setJam1Nama('');
                setJam1Keterangan('');
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Santri <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  list="siswa-kelas-list"
                  value={jam1Nama}
                  onChange={(e) => setJam1Nama(e.target.value)}
                  placeholder="Ketik atau pilih nama santri..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  required
                />
                <datalist id="siswa-kelas-list">
                  {siswas
                    .filter(s => s.kelas === selectedKelas)
                    .map(s => (
                      <option key={s.id} value={s.nama} />
                    ))}
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Status Ketidakhadiran <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Sakit', 'Izin', 'Alpa'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setJam1Status(st)}
                      className={`py-2 px-3 rounded-xl font-bold text-xs border transition-all cursor-pointer ${
                        jam1Status === st
                          ? st === 'Sakit'
                            ? 'bg-amber-100 border-amber-400 text-amber-900 shadow-xs'
                            : st === 'Izin'
                            ? 'bg-blue-100 border-blue-400 text-blue-900 shadow-xs'
                            : 'bg-rose-100 border-rose-400 text-rose-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Keterangan / Alasan
                </label>
                <input
                  type="text"
                  value={jam1Keterangan}
                  onChange={(e) => setJam1Keterangan(e.target.value)}
                  placeholder="Misal: Surat dokter terlampir / Izin keluarga..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowJam1Modal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-700/20 cursor-pointer"
                >
                  Simpan Tidak Hadir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: VERIFIKASI & CATAT KONFIRMASI LOCAL WISDOM INSTUKTUR */}
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
                    Konfirmasi Kehadiran Praktikum Local Wisdom
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {activeLWModal.jurusan} · {activeLWModal.lokasi} ({activeLWModal.tingkatKelas})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveLWModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WhatsApp Template Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  Format Permohonan Konfirmasi WhatsApp:
                </span>
                <button
                  type="button"
                  onClick={() => {
                    const currentOrigin = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'http://localhost:3000';
                    const teacherSelfLink = `${currentOrigin}?portal=konfirmasi&id=${activeLWModal.id}&guru=${encodeURIComponent(activeLWModal.instruktur)}&kelas=${encodeURIComponent(activeLWModal.tingkatKelas)}&mapel=${encodeURIComponent(activeLWModal.jurusan + ' (' + activeLWModal.lokasi + ')')}`;
                    const fullText = generateWaTextLocalWisdom(activeLWModal) + `\n\nLink Konfirmasi Mandiri Guru:\n${teacherSelfLink}`;
                    navigator.clipboard?.writeText(fullText);
                    alertSuccess('Pesan Disalin', 'Pesan WhatsApp beserta link portal mandiri guru berhasil disalin.');
                  }}
                  className="text-emerald-700 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Salin Pesan WA</span>
                </button>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-[11px] font-mono text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto leading-relaxed">
                {generateWaTextLocalWisdom(activeLWModal)}
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${activeLWModal.noWaInstruktur}&text=${encodeURIComponent(
                    generateWaTextLocalWisdom(activeLWModal) +
                    `\n\nLink Konfirmasi Mandiri Guru:\n${(typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : 'http://localhost:3000')}?portal=konfirmasi&id=${activeLWModal.id}&guru=${encodeURIComponent(activeLWModal.instruktur)}&kelas=${encodeURIComponent(activeLWModal.tingkatKelas)}&mapel=${encodeURIComponent(activeLWModal.jurusan + ' (' + activeLWModal.lokasi + ')')}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim via WhatsApp ke {activeLWModal.instruktur}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                </a>

                <a
                  href={`?portal=konfirmasi&id=${activeLWModal.id}&guru=${encodeURIComponent(activeLWModal.instruktur)}&kelas=${encodeURIComponent(activeLWModal.tingkatKelas)}&mapel=${encodeURIComponent(activeLWModal.jurusan + ' (' + activeLWModal.lokasi + ')')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  title="Buka form konfirmasi mandiri guru di tab terpisah"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Buka Portal Mandiri</span>
                </a>
              </div>
            </div>

            {/* Form Catat Respon Guru Pengampu */}
            <div className="pt-3 border-t border-slate-100 space-y-3 text-xs">
              <h4 className="font-bold text-slate-800">Catat Respon / Konfirmasi Guru Pengampu:</h4>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Status Kehadiran Rombel</label>
                <select
                  value={lwConfirmStatus}
                  onChange={(e) => setLwConfirmStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white"
                >
                  <option value="Hadir Lengkap">Hadir Lengkap (Seluruh Siswa Hadir di Lab/Bengkel)</option>
                  <option value="Ada Siswa Absen">Ada Siswa Absen (Ada Siswa Sakit / Izin / Alpa)</option>
                  <option value="Selesai">Kegiatan Praktik Telah Selesai</option>
                  <option value="Menunggu Konfirmasi">Menunggu Konfirmasi Guru Pengampu</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-600 mb-1">Catatan Guru Pengampu / Siswa Sakit</label>
                <textarea
                  rows={2}
                  value={lwCatatan}
                  onChange={(e) => setLwCatatan(e.target.value)}
                  placeholder="Contoh: Seluruh siswa hadir lengkap, 2 siswa izin ke UKS..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveLWModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateLocalWisdomStatus(activeLWModal.id, lwConfirmStatus, lwCatatan);
                    alertSuccess('Status Diperbarui', `Status praktikum ${activeLWModal.jurusan} berhasil diubah menjadi '${lwConfirmStatus}'.`);
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
