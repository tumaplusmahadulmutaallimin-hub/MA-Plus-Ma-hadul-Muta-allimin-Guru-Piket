import React, { useState } from 'react';
import {
  HelpCircle,
  X,
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
  PhoneCall,
  Search,
  RotateCcw
} from 'lucide-react';
import { MadrasahLogo } from './MadrasahLogo';

interface MenuGuide {
  id: string;
  role: 'Guru Piket' | 'Administrator' | 'Kepala Madrasah' | 'Semua Role';
  title: string;
  category: string;
  icon: any;
  summary: string;
  steps: string[];
  tips: string;
  highlightTag?: string;
}

const MENU_GUIDES: MenuGuide[] = [
  {
    id: 'dashboard-piket',
    role: 'Guru Piket',
    category: 'Utama',
    title: 'Dashboard Piket',
    icon: LayoutDashboard,
    summary: 'Pusat komando patroli madrasah harian: ringkasan statistik kehadiran siswa, guru izin, cut-off kepulangan lebih awal, dan delegasi pelajaran Local Wisdom.',
    steps: [
      'Cek kartu ringkasan di bagian atas (Kehadiran Siswa, Guru Tidak Hadir, Izin Keluar, dll).',
      'Gunakan tombol "Cut-Off Pulang Awal" jika ada rapat dinas atau peringatan khusus untuk memulangkan siswa lebih awal.',
      'Periksa status "Local Wisdom": delegasikan pengecekan siswa di Lab TIK, Bengkel TKRO, BLK Busana, atau Dapur Boga langsung kepada instruktur.',
      'Kirim tautan konfirmasi WhatsApp ke instruktur langsung dari kartu Local Wisdom.'
    ],
    tips: 'Setiap aksi sinkron langsung ke rekap harian Kepala Madrasah tanpa perlu input ganda.'
  },
  {
    id: 'piket-local-wisdom',
    role: 'Guru Piket',
    category: 'Monitoring KBM',
    title: 'Piket Local Wisdom (Lab / Bengkel)',
    icon: Sparkles,
    highlightTag: 'Fitur Baru',
    summary: 'Delegasi verifikasi kehadiran siswa praktikum kejuruan (Lab TIK, Bengkel TKRO, BLK Busana, Dapur Boga) langsung kepada guru/instruktur pengampu.',
    steps: [
      'Buka tab "Piket Local Wisdom" di menu Monitoring KBM atau di Dashboard Piket.',
      'Pilih hari pelaksanaan (Rabu untuk Kelas 11, Kamis untuk Kelas 10, Sabtu untuk Kelas 12).',
      'Lihat sesi praktikum yang berstatus "Menunggu Konfirmasi".',
      'Klik tombol WhatsApp untuk mengirim tautan konfirmasi mandiri ke guru pengampu, atau klik "Salin Link Portal Guru".',
      'Guru pengampu membuka link di ponsel/laptopnya lalu memilih status (Hadir Lengkap / Ada Siswa Absen / Selesai) serta catatan.',
      'Status pada sistem Guru Piket akan otomatis berubah menjadi "Hadir Lengkap" atau catatan absensi siswa.'
    ],
    tips: 'Guru piket tidak perlu keliling mencari siswa ke bengkel atau lab yang jauh; cukup pantau status konfirmasi mandiri instruktur.'
  },
  {
    id: 'monitoring-kbm',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Monitoring KBM & Keterlambatan Guru',
    icon: BookOpen,
    summary: 'Pemantauan ketertiban KBM tiap jam pelajaran, input dispensasi cut-off, dan peringatan keterlambatan guru mengajar.',
    steps: [
      'Pilih nomor jam pelajaran yang sedang aktif (Jam 1 s.d. Jam 6/8).',
      'Pilih kelas yang sedang dicek atau dipantau.',
      'Khusus Jam Ke-1: Bila ada siswa tidak hadir (Sakit/Izin/Alpa), klik "Input Siswa Tidak Hadir Jam 1". Jika tidak ada catatan, seluruh siswa otomatis dianggap HADIR LENGKAP.',
      'Jika guru terlambat > 15 menit, pilih status "Hadir Terlambat" lalu kirim notifikasi WhatsApp otomatis berisi link konfirmasi mandiri guru.',
      'Ekspor hasil monitoring ke file Excel (.xlsx) dengan kolom sel terpisah kapan saja.'
    ],
    tips: 'Gunakan tombol "Portal HP Guru" untuk simulasi atau bantuan bagi guru yang membutuhkan panduan konfirmasi langsung.'
  },
  {
    id: 'tugas-guru-izin',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Tugas Guru Izin & Penetapan Inval',
    icon: ClipboardList,
    summary: 'Pusat pengelolaan guru yang tidak hadir/izin mengajar dan penetapan guru pengganti (inval) secara manual maupun otomatis.',
    steps: [
      'Lihat daftar laporan guru tidak hadir hari ini.',
      'Klik tombol "Tugaskan Inval" pada jadwal kelas yang terdampak.',
      'Pilih guru pengganti dari daftar guru piket atau guru yang sedang jam bebas (pilih manual).',
      'Tulis catatan instruksi tugas (misal: "Mengerjakan LKS halaman 45").',
      'Status guru pengganti langsung masuk ke lembar Monitoring KBM kelas bersangkutan.'
    ],
    tips: 'Guru yang berhalangan hadir juga dapat mengisi form izin mandiri melalui tombol "Lapor Guru Tidak Masuk" di halaman depan.'
  },
  {
    id: 'siswa-tidak-masuk',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Siswa Tidak Masuk',
    icon: UserX,
    summary: 'Pencatatan rekapitulasi siswa yang absen karena Sakit (S), Izin (I), maupun Alpa (A) terpusat.',
    steps: [
      'Pilih kelas siswa yang dilaporkan tidak hadir.',
      'Cari nama siswa atau masukkan data baru.',
      'Pilih status alasan (Sakit dengan surat, Izin keperluan keluarga, atau Alpa).',
      'Unggah foto bukti surat dokter/keterangan orang tua jika tersedia.',
      'Data otomatis tersinkron ke Rekap Absensi Siswa di Administrator dan Kepala Madrasah.'
    ],
    tips: 'Data siswa sakit akan otomatis dievaluasi jika ada kegiatan fisik/olahraga pada jam berikutnya.'
  },
  {
    id: 'siswa-terlambat',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Siswa Terlambat',
    icon: Clock,
    summary: 'Pencatatan siswa yang datang terlambat di gerbang madrasah beserta tindak lanjut pembinaan dan surat izin masuk kelas.',
    steps: [
      'Input nama siswa, kelas, dan jam tiba di madrasah.',
      'Pilih alasan keterlambatan (bangun kesiangan, kendala kendaraan, dll).',
      'Pilih tindakan pembinaan (baca Al-Qur\'an, literasi perpustakaan, pembinaan piket).',
      'Cetak / berikan kartu izin masuk kelas agar diterima guru pengajar.',
      'Siswa yang sudah ditindaklanjuti akan diakui status kehadirannya di rekapitulasi harian.'
    ],
    tips: 'Siswa yang tercatat terlambat namun sudah ditangani piket tidak dihitung sebagai Alpa.'
  },
  {
    id: 'izin-keluar-kelas',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Izin Keluar Kelas (Dispensasi & Kuota)',
    icon: DoorOpen,
    summary: 'Pengendalian santri keluar lingkungan madrasah (maksimal kuota 6 siswa serentak) dan izin ke kamar mandi/toilet.',
    steps: [
      'Pilih siswa yang memohon izin keluar.',
      'Pilih kategori tempat: "Luar Lingkungan Madrasah" atau "Kamar Mandi / Toilet".',
      'Sistem akan memvalidasi kuota aktif (maks 6 santri di luar madrasah). Bila kuota penuh, tombol pengajuan akan memberi peringatan.',
      'Untuk izin kamar mandi, dapat dicatat berpasangan (checklist 2 siswa) sesuai tata tertib asrama/madrasah.',
      'Saat siswa kembali, klik tombol "Tandai Sudah Kembali" untuk mengembalikan kuota.'
    ],
    tips: 'Waktu izin terpantau secara realtime dengan penghitung menit otomatis.'
  },
  {
    id: 'siswa-tugas-khusus',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Siswa Tugas Khusus',
    icon: Award,
    summary: 'Pencatatan dispensasi resmi santri yang bertugas sebagai petugas upacara, lomba, MBG, tahfidz, atau kepanitiaan madrasah.',
    steps: [
      'Pilih program/kategori tugas khusus (misal: Petugas MBG, Duta Sains, Lomba KSM).',
      'Pilih siswa yang bertugas dan jam pelajaran yang ditinggalkan.',
      'Siswa dengan tugas khusus tetap dihitung Hadir (Dispensasi) dan bebas dari sanksi alpa.'
    ],
    tips: 'Program tugas khusus dapat dikelola dan ditambah secara manual oleh Administrator.'
  },
  {
    id: 'pelanggaran-siswa',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Pelanggaran Siswa & Poin Disiplin',
    icon: AlertOctagon,
    summary: 'Pencatatan pelanggaran tata tertib madrasah / pesantren (seragam, atribut, kedisiplinan, gadget) dan akumulasi poin.',
    steps: [
      'Pilih siswa dan jenis pelanggaran dari daftar kategori.',
      'Poin pelanggaran otomatis terisi sesuai pedoman tata tertib.',
      'Lampirkan foto bukti atau keterangan kejadian.',
      'Berikan tindakan pembinaan langsung atau teruskan ke Guru BK / Wali Kelas.'
    ],
    tips: 'Akumulasi poin siswa dapat dipantau oleh Kepala Madrasah untuk evaluasi berkala.'
  },
  {
    id: 'lapor-kendala',
    role: 'Guru Piket',
    category: 'Monitoring & Pencatatan',
    title: 'Lapor Kendala Sarpras & KBM',
    icon: AlertTriangle,
    summary: 'Pelaporan kendala fasilitas kelas (AC, proyektor, listrik, sound, dll) dengan nomor tiket otomatis.',
    steps: [
      'Klik tombol "Lapor Kendala Baru".',
      'Pilih kategori kendala (Sarana Prasarana, Listrik, Kebersihan, Keamanan).',
      'Tulis judul, lokasi ruangan, dan deskripsi detail kendala.',
      'Lampirkan foto kendala (misal: proyektor rusak).',
      'Laporan langsung terdisposisi ke akun Kepala Madrasah dan teknisi.'
    ],
    tips: 'Tiket kendala akan tercatat riwayat penanganannya hingga status dinyatakan Selesai.'
  },
  {
    id: 'kirim-laporan-kepala',
    role: 'Guru Piket',
    category: 'Pelaporan & Rekap',
    title: 'Kirim Laporan ke Kepala Madrasah',
    icon: Send,
    summary: 'Penutupan tugas piket harian dan pengiriman laporan komprehensif ke meja Kepala Madrasah untuk verifikasi dan tanda tangan.',
    steps: [
      'Periksa lembar rekapitulasi harian (kehadiran guru, rekap presensi siswa, kendala, pelanggaran).',
      'Tulis catatan umum kinerja piket hari ini.',
      'Tanda tangani secara digital pada kolom tanda tangan.',
      'Klik tombol "Kirim Laporan ke Kepala Madrasah". Laporan akan langsung berstatus "Menunggu TTD Kepala".'
    ],
    tips: 'Setelah dikirim, laporan akan diarsipkan dan dapat diunduh dalam format PDF/Cetak Resmi.'
  },
  {
    id: 'kategori-master',
    role: 'Administrator',
    category: 'Master Data & Pengaturan',
    title: 'Manajemen Kategori Master (Admin)',
    icon: Settings,
    summary: 'Pengelolaan data kategori dan program secara manual oleh Administrator (Tugas Khusus, Pelanggaran, Kendala).',
    steps: [
      'Buka menu Kategori & Program di sidebar Admin.',
      'Pilih tab kategori yang ingin dikelola (Tugas Khusus, Pelanggaran, atau Kendala).',
      'Klik tombol "Tambah Kategori/Program Baru".',
      'Isi nama, kode, poin/bobot, serta deskripsi.',
      'Kategori baru akan langsung muncul pada pilihan dropdown di formulir Guru Piket.'
    ],
    tips: 'Admin memiliki kewenangan penuh menambah, mengedit, atau menonaktifkan kategori sesuai kebijakan madrasah.'
  },
  {
    id: 'pergantian-tahun-ajaran',
    role: 'Administrator',
    category: 'Akademik & Kesiswaan',
    title: 'Pergantian Tahun Ajaran & Kenaikan Kelas',
    icon: RotateCcw,
    summary: 'Proses transisi tahun ajaran baru, kenaikan kelas berjenjang (X ke XI, XI ke XII), penetapan kelulusan santri Kelas XII (Alumni), dan penerbitan SK Resmi Kepala Madrasah.',
    steps: [
      'Buka menu "Tahun Ajaran & Kenaikan" di sidebar Admin atau tombol pintas di Dashboard.',
      'Tentukan Target Tahun Ajaran Baru (misal: 2027/2028) dan Semester (Gasal).',
      'Atur opsi Reset Catatan Operasional Harian & Poin Pelanggaran.',
      'Langkah 1: Tetapkan Kelulusan Santri Kelas XII (Lulus Massal atau status per siswa).',
      'Langkah 2: Tetapkan Kenaikan Kelas Santri XI ke XII (Pilih Naik Kelas atau Tinggal).',
      'Langkah 3: Tetapkan Kenaikan Kelas Santri X ke XI (Pilih Naik Kelas atau Tinggal).',
      'Langkah 4: Tinjau ringkasan akhir dan klik "Jalankan Pergantian Tahun Ajaran Sekarang".',
      'Cetak Surat Keputusan (SK) Resmi Kepala Madrasah ber-kop resmi dan tanda tangan digital.'
    ],
    tips: 'Jika terjadi kesalahan penetapan, Administrator dapat menggunakan fitur "Rollback" pada tab Riwayat untuk mengembalikan seluruh status santri ke kondisi sebelum pergantian tahun.'
  }
];

interface PanduanOperasionalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PanduanOperasionalModal: React.FC<PanduanOperasionalModalProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedGuideId, setSelectedGuideId] = useState<string>('piket-local-wisdom');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('Semua');

  if (!isOpen) return null;

  const filteredGuides = MENU_GUIDES.filter((g) => {
    const matchSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = filterRole === 'Semua' || g.role === filterRole || g.role === 'Semua Role';
    return matchSearch && matchRole;
  });

  const activeGuide = MENU_GUIDES.find((g) => g.id === selectedGuideId) || MENU_GUIDES[0];
  const ActiveIcon = activeGuide.icon;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-5xl w-full h-[90vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-[#06281C] via-[#093526] to-[#0D4431] text-white flex items-center justify-between border-b border-emerald-900/60 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white border border-emerald-500/40 p-0.5 flex items-center justify-center shadow-xs shrink-0">
              <MadrasahLogo size="md" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Buku Panduan Operasional Sistem
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 font-semibold">
                  Versi 2026.1
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                Penjelasan Seluruh Menu &amp; Langkah Penggunaan
              </h2>
              <p className="text-[11px] text-emerald-200/90 font-medium">
                MA PLUS Ma'hadul Muta'allimin · Madrasah Three in One (Religius, Sains and Skill)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            title="Tutup Panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari menu, fitur, atau langkah..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {['Semua', 'Guru Piket', 'Administrator'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setFilterRole(role)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                  filterRole === role
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Content Body: Left Menu List & Right Detail View */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 min-h-0 overflow-hidden">
          {/* Left: Guides List */}
          <div className="md:col-span-5 lg:col-span-4 border-r border-slate-200 overflow-y-auto p-3 space-y-2 bg-slate-50/50">
            {filteredGuides.length === 0 ? (
              <div className="text-center py-12 px-4 text-slate-400 text-xs">
                Tidak ada menu yang sesuai dengan kata kunci pencarian.
              </div>
            ) : (
              filteredGuides.map((guide) => {
                const Icon = guide.icon;
                const isSelected = selectedGuideId === guide.id;
                return (
                  <button
                    key={guide.id}
                    type="button"
                    onClick={() => setSelectedGuideId(guide.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isSelected
                        ? 'bg-white border-emerald-600 shadow-md ring-1 ring-emerald-600/30'
                        : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-emerald-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {guide.category}
                        </span>
                        {guide.highlightTag && (
                          <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                            {guide.highlightTag}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {guide.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                        {guide.summary}
                      </p>
                    </div>

                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform ${
                        isSelected ? 'text-emerald-700 translate-x-0.5' : 'text-slate-300'
                      }`}
                    />
                  </button>
                );
              })
            )}
          </div>

          {/* Right: Active Guide Detail */}
          <div className="md:col-span-7 lg:col-span-8 overflow-y-auto p-5 sm:p-7 space-y-5 bg-white">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white flex items-center justify-center shadow-md shadow-emerald-950/20 shrink-0">
                  <ActiveIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Peran: {activeGuide.role}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      Kategori: {activeGuide.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-1">
                    {activeGuide.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Deskripsi Menu */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                Deskripsi &amp; Fungsi Menu:
              </h4>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {activeGuide.summary}
              </p>
            </div>

            {/* Langkah-langkah Penggunaan */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Langkah-Langkah Operasional Terstruktur:
              </h4>

              <div className="space-y-2.5">
                {activeGuide.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 border border-slate-200/90 rounded-xl flex items-start gap-3 hover:bg-emerald-50/30 transition-colors"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-700 text-white text-xs font-extrabold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips & Catatan Penting */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 font-bold text-xs">
                💡
              </div>
              <div>
                <h5 className="text-xs font-bold text-amber-950">
                  Tips &amp; Standar Operasional Prosedur (SOP):
                </h5>
                <p className="text-xs text-amber-900/90 mt-0.5 leading-relaxed">
                  {activeGuide.tips}
                </p>
              </div>
            </div>

            {/* Banner Madrasah Three In One */}
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white flex items-center justify-between text-xs">
              <div>
                <p className="font-extrabold text-amber-300 tracking-wide text-[11px]">
                  MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)
                </p>
                <p className="text-[10px] text-emerald-200">
                  MADRASAH BERBASIS PONDOK PESANTREN · TERTIB &amp; AMANAH
                </p>
              </div>
              <span className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded border border-white/20">
                SOP Terstandar
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-500 font-medium">
            Butuh bantuan teknis? Hubungi Admin Madrasah atau gunakan panduan ini sewaktu-waktu.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
