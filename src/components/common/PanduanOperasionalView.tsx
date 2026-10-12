import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  BookOpen,
  LayoutDashboard,
  ClipboardList,
  CalendarCheck,
  UserX,
  Clock,
  DoorOpen,
  Award,
  AlertOctagon,
  AlertTriangle,
  Send,
  FileSpreadsheet,
  Users,
  School,
  Settings,
  Sparkles,
  ExternalLink,
  Smartphone,
  ChevronRight,
  CheckCircle2,
  Printer,
  Search,
  MessageCircle,
  ShieldCheck,
  Building2,
  FileCheck,
  Tag,
  GraduationCap,
  MapPin,
  Calendar,
  RotateCcw
} from 'lucide-react';
import { MadrasahLogo } from './MadrasahLogo';

interface MenuGuideItem {
  id: string;
  role: 'Guru Piket' | 'Administrator' | 'Kepala Madrasah';
  targetViewId: string;
  title: string;
  category: string;
  icon: any;
  summary: string;
  steps: string[];
  rules: string[];
  tips: string;
  highlightTag?: string;
}

const ALL_MENU_GUIDES: MenuGuideItem[] = [
  // --- GURU PIKET ---
  {
    id: 'guide-piket-local-wisdom',
    role: 'Guru Piket',
    targetViewId: 'monitoring-kbm',
    category: 'Monitoring KBM',
    title: 'Piket Local Wisdom (Lab & Bengkel Kejuruan)',
    icon: Sparkles,
    highlightTag: 'Delegasi Otomatis',
    summary: 'Modul khusus di dalam Monitoring KBM yang memungkinkan Guru Piket mendelegasikan verifikasi kehadiran siswa praktikum di Lab/Bengkel kejuruan langsung kepada Guru Pengampu, tanpa perlu patroli fisik bolak-balik.',
    steps: [
      'Buka menu "Monitoring KBM", lalu pilih sub-tab "Piket Local Wisdom (Lab & Bengkel)".',
      'Pilih hari praktikum yang aktif: Rabu (Angkatan Kelas 11), Kamis (Angkatan Kelas 10), atau Sabtu (Angkatan Kelas 12).',
      'Periksa 4 sesi kejuruan: Lab TIK Komputer, Bengkel TKRO Otomotif, Ruang Jahit BLK Tata Busana, dan Dapur Tata Boga.',
      'Sesi yang belum diverifikasi berstatus default "Menunggu Konfirmasi" dengan badge animasi khusus.',
      'Klik tombol "WhatsApp" untuk mengirim pesan permohonan konfirmasi otomatis dan tautan mandiri langsung ke nomor ponsel instruktur.',
      'Atau klik tombol "Salin Tautan" dan bagikan tautan portal mandiri ke instruktur melalui grup atau chat.',
      'Guru Pengampu membuka link di smartphone/komputer lalu memverifikasi kehadiran rombelnya.',
      'Guru Piket juga dapat mengklik "Verifikasi" jika instruktur memberikan laporan langsung secara lisan/telepon.'
    ],
    rules: [
      'Status tetap "Menunggu Konfirmasi" hingga instruktur melakukan aksi konfirmasi kehadiran mandiri.',
      'Instruktur dapat mengonfirmasi "Hadir Lengkap", "Ada Siswa Absen", atau "Selesai" beserta catatan siswa sakit/izin.',
      'Data hasil verifikasi tersinkronisasi realtime ke Laporan Rekapitulasi Harian Kepala Madrasah.'
    ],
    tips: 'Sangat menghemat tenaga dan waktu patroli guru piket di area madrasah & pondok pesantren yang luas.'
  },
  {
    id: 'guide-monitoring-kbm',
    role: 'Guru Piket',
    targetViewId: 'monitoring-kbm',
    category: 'Monitoring & Pencatatan',
    title: 'Monitoring KBM Reguler & Peringatan Guru Terlambat',
    icon: BookOpen,
    summary: 'Pemantauan ketertiban KBM jam ke jam di seluruh ruang kelas madrasah, presensi manual jam ke-1, dan pengiriman peringatan keterlambatan mengajar guru.',
    steps: [
      'Pilih nomor Jam Pelajaran yang sedang aktif (Jam 1 s.d. Jam 6/8).',
      'Pilih kelas yang sedang dipantau (misal: XA, XB, XIIC). Nama guru dan mata pelajaran otomatis tersinkron dari Jadwal KBM.',
      'Khusus Jam Ke-1: Jika ada siswa tidak hadir (Sakit, Izin, Alpa), klik "Input Siswa Tidak Hadir Jam 1". Jika tidak ada input, seluruh siswa kelas tersebut otomatis diakui HADIR LENGKAP.',
      'Jika guru belum hadir > 15 menit, pilih status "Hadir Terlambat" dan simpan.',
      'Sistem akan menampilkan dialog peringatan resmi dan tombol WhatsApp untuk dikirimkan langsung ke guru bersangkutan.',
      'Guru pengajar dapat mengonfirmasi kehadiran mandiri dengan melampirkan foto suasana kelas siswa.',
      'Gunakan tombol "Export .xlsx" untuk mengunduh rekapitulasi KBM ke lembar kerja Excel berkolom sel terpisah.'
    ],
    rules: [
      'Pengisian monitoring dilakukan maksimal 15 menit setelah bel masuk berbunyi.',
      'Guru yang terlambat wajib melampirkan foto bukti suasana kelas siswa saat melakukan konfirmasi mandiri.'
    ],
    tips: 'Gunakan tombol "Portal HP Guru" di toolbar atas jika guru meminta panduan cara konfirmasi di ponsel mereka.'
  },
  {
    id: 'guide-tugas-guru-izin',
    role: 'Guru Piket',
    targetViewId: 'tugas-guru-izin',
    category: 'Monitoring & Pencatatan',
    title: 'Tugas Guru Izin & Penetapan Inval Manual',
    icon: ClipboardList,
    summary: 'Pengelolaan daftar guru yang berhalangan hadir (Sakit, Izin Dinas, Keperluan Keluarga) dan penetapan guru pengganti (inval) untuk mendampingi kelas.',
    steps: [
      'Periksa daftar guru tidak hadir yang masuk dari portal publik atau laporan piket.',
      'Lihat jadwal mengajar yang terdampak pada hari ini.',
      'Klik tombol "Tugaskan Inval" pada jadwal yang belum memiliki guru pengganti.',
      'Pilih guru pengganti dari daftar guru piket atau guru yang sedang jam bebas secara manual.',
      'Tulis catatan materi/tugas yang harus dikerjakan santri.',
      'Klik "Tetapkan Guru Pengganti". Status guru pengganti langsung masuk ke lembar monitoring kelas.'
    ],
    rules: [
      'Guru pengganti yang sudah ditetapkan tidak dapat ditugaskan ganda pada jam yang sama di kelas lain.',
      'Guru yang izin dapat mengisi formulir mandiri lewat tautan "Lapor Guru Tidak Masuk" di halaman depan.'
    ],
    tips: 'Prioritaskan guru serumpun mata pelajaran saat memilih guru inval agar materi tetap berlanjut.'
  },
  {
    id: 'guide-izin-keluar-kelas',
    role: 'Guru Piket',
    targetViewId: 'izin-keluar-kelas',
    category: 'Monitoring & Pencatatan',
    title: 'Izin Keluar Kelas (Pengendalian Kuota & Kamar Mandi)',
    icon: DoorOpen,
    summary: 'Pengendalian ketat santri yang keluar ruang kelas selama jam KBM aktif, dengan pembatasan kuota maksimal 6 santri ke luar lingkungan dan checklist izin kamar mandi.',
    steps: [
      'Klik "Beri Izin Keluar" dan pilih siswa pemohon serta kelasnya.',
      'Pilih kategori tempat: "Luar Lingkungan Madrasah" atau "Kamar Mandi / Toilet".',
      'Untuk Luar Lingkungan: Sistem memvalidasi kuota aktif (maks 6 santri). Jika kuota penuh, tombol pengajuan akan terkunci otomatis.',
      'Untuk Kamar Mandi: Dapat mencatat santri berpasangan (checklist 2 santri) sesuai tata tertib madrasah berasrama.',
      'Tentukan batas durasi izin dan alasan keperluan.',
      'Saat santri kembali ke kelas, klik "Tandai Sudah Kembali" untuk mengembalikan kuota aktif.'
    ],
    rules: [
      'Kuota aktif santri di luar lingkungan madrasah dibatasi maksimal 6 orang secara bersamaan.',
      'Santri yang melewati batas waktu (overdue) akan ditandai dengan badge merah berkedip.'
    ],
    tips: 'Periksa kartu indikator kuota di bagian atas layar sebelum memberikan izin keluar madrasah.'
  },
  {
    id: 'guide-siswa-terlambat',
    role: 'Guru Piket',
    targetViewId: 'siswa-terlambat',
    category: 'Monitoring & Pencatatan',
    title: 'Siswa Terlambat & Pengakuan Kehadiran Rekap',
    icon: Clock,
    summary: 'Pencatatan santri yang terlambat tiba di madrasah, pemberian tindakan pembinaan piket, dan pemberian surat izin masuk kelas.',
    steps: [
      'Input nama santri, kelas, dan jam tiba di gerbang.',
      'Pilih alasan keterlambatan dan tindakan pembinaan (baca Al-Qur\'an, literasi, pembinaan piket).',
      'Klik "Simpan & Beri Izin Masuk".',
      'Siswa yang sudah ditindaklanjuti secara resmi diakui hadir di rekapitulasi harian dan tidak dianggap Alpa.'
    ],
    rules: [
      'Santri terlambat yang telah ditangani piket dihitung HADIR dengan catatan Terlambat.',
      'Santri yang tidak melapor ke meja piket tetap dihitung TIDAK MASUK (Alpa).'
    ],
    tips: 'Cetak surat izin masuk kelas untuk diserahkan santri kepada guru pengajar di kelas.'
  },
  {
    id: 'guide-kirim-laporan-kepala',
    role: 'Guru Piket',
    targetViewId: 'kirim-laporan-kepala',
    category: 'Pelaporan & Rekap',
    title: 'Kirim Laporan Harian ke Kepala Madrasah',
    icon: Send,
    summary: 'Penutupan tugas piket harian, rekapitulasi data kehadiran terpadu, tanda tangan digital, dan pengiriman berkas ke meja Kepala Madrasah.',
    steps: [
      'Buka menu "Kirim Laporan ke Kepala" di akhir jam piket.',
      'Tinjau rangkuman: Kehadiran Guru, Guru Inval, Presensi Santri, Kendala Sarpras, dan Pelanggaran.',
      'Tulis catatan umum kinerja piket dan saran perbaikan.',
      'Bubuhkan tanda tangan digital guru piket di kolom tanda tangan.',
      'Klik "Kirim Laporan ke Kepala Madrasah".',
      'Laporan langsung masuk ke dashboard eksekutif Kepala Madrasah dengan status "Menunggu TTD Kepala".'
    ],
    rules: [
      'Laporan yang telah dikirim akan terkunci dari pengeditan langsung dan diarsipkan secara permanen.',
      'Kepala Madrasah akan memverifikasi dan menandatangani laporan secara digital.'
    ],
    tips: 'Pastikan seluruh kelas telah terisi pantauan KBM-nya sebelum mengirimkan laporan penutupan piket.'
  },

  // --- ADMINISTRATOR ---
  {
    id: 'guide-admin-master-kategori',
    role: 'Administrator',
    targetViewId: 'kategori-tugas-khusus',
    category: 'Master Data & Pengaturan',
    title: 'Pengelolaan Kategori & Program Manual (Admin)',
    icon: Tag,
    summary: 'Kewenangan Administrator untuk membuat, mengedit, dan menghapus kategori dan program secara mandiri (Tugas Khusus, Pelanggaran, Kendala).',
    steps: [
      'Buka menu "Kategori & Program" di sidebar Admin.',
      'Pilih tab: "Tugas Khusus", "Pelanggaran Siswa", atau "Kendala Fasilitas".',
      'Klik tombol "Tambah Kategori Baru".',
      'Isi formulir: Nama Kategori, Kode, Bobot Poin (untuk pelanggaran), dan Deskripsi.',
      'Klik "Simpan Kategori".',
      'Kategori baru akan langsung muncul pada dropdown pilihan formulir Guru Piket.'
    ],
    rules: [
      'Hanya akun dengan role Administrator yang memiliki hak akses CRUD pada menu ini.',
      'Kategori yang sedang digunakan dalam rekaman aktif tidak disarankan untuk dihapus.'
    ],
    tips: 'Gunakan kode kategori yang teratur (misal: TK-01, PEL-01, KND-01) agar mudah diidentifikasi.'
  },
  {
    id: 'guide-admin-jadwal',
    role: 'Administrator',
    targetViewId: 'jadwal-kbm',
    category: 'Master Data',
    title: 'Pengelolaan Jadwal KBM & Guru Piket',
    icon: Calendar,
    summary: 'Pengaturan jadwal pelajaran mingguan per rombel serta pembagian shift tugas guru piket harian.',
    steps: [
      'Buka menu "Jadwal KBM Mingguan" atau "Jadwal Guru Piket".',
      'Gunakan tombol "Tambah Jadwal" atau "Import Excel" untuk memuat jadwal pelajaran.',
      'Tentukan Hari, Jam Ke, Kelas, Mata Pelajaran, dan Guru Pengampu.',
      'Jadwal KBM otomatis menjadi acuan dasar pada modul Monitoring KBM Guru Piket.'
    ],
    rules: [
      'Satu guru tidak boleh dijadwalkan mengajar di dua kelas berbeda pada jam yang bersamaan.'
    ],
    tips: 'Perbarui jadwal piket setiap awal semester gasal dan genap.'
  },
  {
    id: 'guide-admin-pergantian-tahun',
    role: 'Administrator',
    targetViewId: 'pergantian-tahun',
    category: 'Akademik & Kesiswaan',
    title: 'Pergantian Tahun Ajaran & Kenaikan Kelas Santri',
    icon: RotateCcw,
    summary: 'Proses transisi tahun pelajaran baru, penetapan kenaikan kelas berjenjang (X ke XI, XI ke XII), kelulusan Kelas XII (Alumni), serta penerbitan Surat Keputusan (SK) resmi ber-kop madrasah.',
    steps: [
      'Buka menu "Tahun Ajaran & Kenaikan" di sidebar Admin atau klik kartu spotlight di Dashboard.',
      'Tentukan Target Tahun Pelajaran Baru (misal: 2027/2028) dan Semester (Gasal).',
      'Atur opsi Reset Data Operasional Harian (Presensi, Izin, Pelanggaran).',
      'Masuk ke Tab Wizard: Tinjau penetapan kelulusan Kelas XII, kenaikan Kelas XI ke XII, dan Kelas X ke XI.',
      'Administrator dapat mengatur status massal atau menyesuaikan status per siswa jika ada santri yang tinggal kelas atau mutasi.',
      'Klik tombol "Jalankan Pergantian Tahun Ajaran Sekarang" dan konfirmasi.',
      'Setelah selesai, cetak Surat Keputusan (SK) Resmi Kepala Madrasah untuk arsip dan pengumuman.'
    ],
    rules: [
      'Santri Kelas XII yang diluluskan akan otomatis berstatus "Lulus" (Alumni) dan tetap tersimpan di database.',
      'Santri Kelas X dan XI yang naik kelas akan berpindah ke rombel tingkat di atasnya.',
      'Fitur Rollback tersedia jika sewaktu-waktu perlu membatalkan transisi tahun ajaran.'
    ],
    tips: 'Lakukan proses pergantian tahun ajaran pada saat rapat pleno kenaikan kelas di akhir semester genap.'
  },

  // --- KEPALA MADRASAH ---
  {
    id: 'guide-kepala-verifikasi',
    role: 'Kepala Madrasah',
    targetViewId: 'laporan-guru-piket-kepala',
    category: 'Monitoring & Evaluasi',
    title: 'Verifikasi & Tanda Tangan Digital Laporan Piket',
    icon: FileCheck,
    summary: 'Pemeriksaan laporan kinerja harian guru piket, pemberian disposisi catatan kepala madrasah, dan pengesahan tanda tangan resmi.',
    steps: [
      'Buka menu "Verifikasi Laporan Piket" di dashboard Kepala Madrasah.',
      'Pilih laporan piket berstatus "Menunggu TTD".',
      'Periksa ringkasan statistik: guru tidak hadir, efektivitas inval, presensi santri, dan kendala sarpras.',
      'Berikan catatan pembinaan / evaluasi kepala madrasah.',
      'Klik tombol "Terima & Tanda Tangani Laporan".',
      'Laporan resmi bertanda tangan digital siap diunduh atau dicetak untuk arsip madrasah.'
    ],
    rules: [
      'Kepala Madrasah dapat menolak laporan jika data belum lengkap dengan mengklik "Minta Revisi".'
    ],
    tips: 'Laporan yang telah ditandatangani otomatis tersimpan di arsip digital madrasah.'
  }
];

export const PanduanOperasionalView: React.FC = () => {
  const { currentUser, setActiveView } = useApp();
  const [selectedRole, setSelectedRole] = useState<'Semua' | 'Guru Piket' | 'Administrator' | 'Kepala Madrasah'>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGuideId, setActiveGuideId] = useState<string>('guide-piket-local-wisdom');

  const filteredGuides = ALL_MENU_GUIDES.filter((g) => {
    const matchRole = selectedRole === 'Semua' || g.role === selectedRole;
    const matchSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchRole && matchSearch;
  });

  const activeGuide = ALL_MENU_GUIDES.find((g) => g.id === activeGuideId) || ALL_MENU_GUIDES[0];
  const ActiveIcon = activeGuide.icon;

  const handlePrintSOP = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner with Official Identity */}
      <div className="bg-gradient-to-r from-[#06281C] via-[#093526] to-[#0D4431] text-white p-6 sm:p-8 rounded-3xl border border-emerald-900/60 shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md shrink-0 border border-emerald-400/30">
              <MadrasahLogo size="xl" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider font-sans">
                  STANDAR OPERASIONAL PROSEDUR (SOP)
                </span>
                <span className="text-[10px] font-semibold text-emerald-300">
                  Tahun Ajaran 2026/2027
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-1">
                Buku Panduan Operasional Menu &amp; Fitur Sistem
              </h1>
              <p className="text-xs sm:text-sm font-extrabold text-amber-300 mt-0.5">
                MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)
              </p>
              <p className="text-xs text-emerald-200/90 font-medium">
                MADRASAH BERBASIS PONDOK PESANTREN · MA PLUS MA'HADUL MUTA'ALLIMIN
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrintSOP}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/20 flex items-center gap-2 cursor-pointer"
              title="Cetak Ringkasan SOP Meja Piket"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Cetak Ringkasan SOP</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari panduan menu, fitur, atau kata kunci..."
            className="w-full pl-10 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['Semua', 'Guru Piket', 'Administrator', 'Kepala Madrasah'] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setSelectedRole(r)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                selectedRole === r
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Guide List Left & Guide Detail Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (5 cols): Menu Guides List */}
        <div className="lg:col-span-5 bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-2.5 max-h-[800px] overflow-y-auto">
          <div className="px-2 py-1 flex items-center justify-between text-xs text-slate-400 font-bold border-b border-slate-100 pb-2">
            <span>DAFTAR MENU &amp; FITUR</span>
            <span>{filteredGuides.length} Panduan</span>
          </div>

          {filteredGuides.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              Tidak ada panduan yang sesuai dengan filter pencarian.
            </div>
          ) : (
            filteredGuides.map((guide) => {
              const Icon = guide.icon;
              const isSelected = activeGuideId === guide.id;
              return (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => setActiveGuideId(guide.id)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-emerald-50 to-teal-50/50 border-emerald-600 shadow-md ring-1 ring-emerald-600/30'
                      : 'bg-slate-50/60 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-2xs ${
                      isSelected
                        ? 'bg-emerald-700 text-white'
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                        {guide.category} · {guide.role}
                      </span>
                      {guide.highlightTag && (
                        <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 shadow-2xs">
                          {guide.highlightTag}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                      {guide.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {guide.summary}
                    </p>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform mt-2 ${
                      isSelected ? 'text-emerald-700 translate-x-1' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })
          )}
        </div>

        {/* Right Column (7 cols): Selected Guide Full Detail */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-950/20 shrink-0">
                <ActiveIcon className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase">
                    Role: {activeGuide.role}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    Kategori: {activeGuide.category}
                  </span>
                </div>
                <h2 className="text-lg font-black text-slate-900 mt-1">
                  {activeGuide.title}
                </h2>
              </div>
            </div>

            {/* Quick Go to View Button */}
            {currentUser.role === activeGuide.role && (
              <button
                type="button"
                onClick={() => setActiveView(activeGuide.targetViewId)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <span>Buka Menu Ini</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Ringkasan Fungsi Menu */}
          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl">
            <h3 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              Deskripsi &amp; Fungsi Menu
            </h3>
            <p className="text-xs text-emerald-900 leading-relaxed font-medium">
              {activeGuide.summary}
            </p>
          </div>

          {/* Langkah-langkah Penggunaan Terstruktur */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Langkah-Langkah Operasional Step-by-Step
            </h3>

            <div className="space-y-2.5">
              {activeGuide.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 hover:bg-emerald-50/30 transition-colors"
                >
                  <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-black flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {st}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Aturan & Validasi Sistem */}
          {activeGuide.rules && activeGuide.rules.length > 0 && (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Aturan &amp; Validasi Sistem yang Berlaku:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs text-slate-600 font-medium leading-relaxed">
                {activeGuide.rules.map((rl, rIdx) => (
                  <li key={rIdx}>{rl}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Tips SOP & Catatan Penting */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
            <span className="text-base leading-none">💡</span>
            <div>
              <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                Tips Praktis &amp; Standar Operasional Meja Piket:
              </h4>
              <p className="text-xs text-amber-900/90 mt-1 leading-relaxed font-medium">
                {activeGuide.tips}
              </p>
            </div>
          </div>

          {/* Identitas Motto Footer */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div>
              <p className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wide">
                MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)
              </p>
              <p className="text-[10px] text-emerald-200">
                MADRASAH BERBASIS PONDOK PESANTREN · TERTIB, AMANAH &amp; UNGGUL
              </p>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 border border-white/20 self-start sm:self-auto">
              SOP Resmi 2026
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
