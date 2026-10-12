import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  Clock,
  BookOpen,
  Bell,
  ChevronRight,
  UserCheck,
  Shield,
  Award,
  CheckCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  Printer,
  ChevronDown,
  LogOut,
  Smartphone,
  Download,
  X,
  HelpCircle,
  Menu
} from 'lucide-react';
import { PanduanOperasionalModal } from './PanduanOperasionalModal';
import { MadrasahLogo } from './MadrasahLogo';
import { useLiveDateTime } from '../../utils/dateUtils';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: string[];
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  icon,
  breadcrumbs
}) => {
  const {
    currentUser,
    activeView,
    setActiveView,
    switchRole,
    setIsLoggedIn,
    tahunAjaranAktif,
    semesterAktif,
    toggleMobileSidebar
  } = useApp();

  const { time, dateFormatted, hijriDate } = useLiveDateTime();

  const displayTitle =
    title ||
    (activeView === 'dashboard'
      ? 'Dashboard'
      : activeView === 'pergantian-tahun'
      ? 'Tahun Ajaran & Kenaikan Kelas'
      : activeView
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' '));

  const displayBreadcrumbs = breadcrumbs || ['Madrasah', currentUser?.role || 'Guru Piket', displayTitle];
  const [showBellDropdown, setShowBellDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [showPanduanModal, setShowPanduanModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleTriggerInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null);
      });
    } else {
      setShowInstallModal(true);
    }
  };

  // Quotes matching screenshots & Islamic wisdom
  const quotes: Record<string, string> = {
    'Data Guru': '"Guru hebat, madrasah bermartabat, generasi berkualitas."',
    'Data Siswa': '"Setiap siswa adalah amanah, mari kelola data dengan penuh tanggung jawab."',
    'Data Kelas': '"Kelas yang tertata, mencetak generasi yang luar biasa."',
    'Data Mata Pelajaran': '"Ilmu adalah cahaya, dan setiap mata pelajaran adalah jalan menuju kebaikan."',
    'Data Ruang/Lokasi': '"Lingkungan yang tertata mendukung proses belajar yang lebih baik."',
    'Jadwal KBM': '"Waktu yang teratur melahirkan generasi yang unggul."',
    'Jadwal Guru Piket': '"Tugas piket adalah bagian dari ibadah, karena menjaga lingkungan madrasah adalah menjaga amanah."',
    'Program Tugas Khusus': '"Setiap tugas adalah amanah, setiap amanah adalah jalan menuju kemuliaan."',
    'Kategori Tugas Khusus': '"Kategorisasi yang baik, memudahkan pengelolaan dan pelaksanaan."',
    'Kategori Pelanggaran': '"Disiplin hari ini, karakter yang lebih baik esok hari."',
    'Kategori Kendala': '"Setiap kendala adalah kesempatan untuk mencari solusi yang lebih baik."',
    'User & Role': '"Orang yang tepat di posisi yang tepat, akan melahirkan hasil yang lebih baik."',
    'Monitoring KBM': '"Ketertiban hari ini, lahir dari kepedulian kita bersama."',
    'Siswa Tidak Masuk': '"Disiplin hari ini, masa depan yang lebih baik esok."',
    'Siswa Terlambat': '"Menghargai waktu adalah awal dari pembentukan akhlak mulia."',
    'Izin Keluar Kelas': '"Menjaga mereka adalah bagian dari amanah pendidikan."',
    'Siswa Tugas Khusus': '"Tugas yang diamanahkan adalah bagian dari pendidikan."',
    'Pelanggaran Siswa': '"Kedisiplinan hari ini adalah keberhasilan di masa depan."',
    'Lapor Kendala': '"Setiap kendala adalah peluang untuk perbaikan."',
    'Kirim Laporan ke Kepala': '"Setiap laporan yang jujur adalah bagian dari amanah."',
    'Pengumuman': '"Informasi yang baik, membangun langkah yang lebih baik."',
    'Dashboard': '"Data yang rapi, melahirkan madrasah yang tertib."'
  };

  const currentQuote =
    (title && quotes[title]) ||
    (displayTitle && quotes[displayTitle]) ||
    '"Ikhlas Beramal, Cerdas dalam Tugas, Tertib untuk Madrasah"';

  return (
    <header className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-2.5 sm:py-3.5 sticky top-0 z-30 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Breadcrumbs & Title */}
        <div className="flex flex-col gap-0.5">
          <nav className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
            {displayBreadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                <span className={idx === displayBreadcrumbs.length - 1 ? 'text-emerald-700 font-bold' : 'hover:text-slate-600'}>
                  {crumb}
                </span>
              </React.Fragment>
            ))}
          </nav>

          <div className="flex items-center gap-2.5 sm:gap-3 mt-0.5">
            {/* Tombol Garis Tiga Navigasi Menu (Buka Menu Navigasi di mode apa saja) */}
            <button
              type="button"
              onClick={toggleMobileSidebar}
              className="flex items-center gap-1.5 px-2.5 py-2 sm:px-3 sm:py-2 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-800 text-white hover:from-emerald-800 hover:to-teal-900 border border-emerald-600 shadow-sm transition-all shrink-0 cursor-pointer active:scale-95 group"
              aria-label="Buka Menu Navigasi"
              title="Menu Navigasi (Tanda Garis Tiga - Klik untuk Buka Menu)"
            >
              <Menu className="w-5 h-5 text-amber-300 group-hover:rotate-6 transition-transform" />
              <span className="text-xs font-bold text-amber-200">Menu</span>
            </button>

            {/* Official Madrasah Logo */}
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white border border-emerald-500/40 p-0.5 flex items-center justify-center shadow-xs shrink-0">
              <MadrasahLogo size="md" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">{displayTitle}</h1>
                <span className="hidden sm:inline-block font-arabic text-xs text-emerald-800/80 font-normal">
                  بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                </span>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)
                </span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {subtitle ? (
                  <p className="text-xs text-slate-500 font-medium">
                    {subtitle} • <span className="text-amber-800 font-bold">MADRASAH BERBASIS PONDOK PESANTREN</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-amber-800 font-bold tracking-tight">
                    MADRASAH BERBASIS PONDOK PESANTREN • MA PLUS MA'HADUL MUTA'ALLIMIN KATERBAN-NGAWI
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Date/Clock Card, Quote Card, Notifications, User */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Active Academic Year Badge */}
          <button
            type="button"
            onClick={() => {
              if (currentUser?.role === 'Administrator' || currentUser?.role === 'Kepala Madrasah') {
                setActiveView('pergantian-tahun');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900/90 hover:bg-emerald-900 text-white border border-emerald-600/40 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer group"
            title="Tahun Pelajaran Aktif (Klik untuk Kelola Kenaikan Kelas & Kelulusan)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 group-hover:scale-125 transition-transform"></span>
            <span className="font-mono text-emerald-100 font-extrabold">{tahunAjaranAktif}</span>
            <span className="text-[9.5px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black">
              {semesterAktif}
            </span>
          </button>

          {/* Menu Panduan Operasional Button in Top Navigation */}
          <button
            type="button"
            onClick={() => setShowPanduanModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border border-emerald-500/30 group"
            title="Buka Buku Panduan Operasional Seluruh Menu & Langkah"
          >
            <HelpCircle className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
            <span className="font-extrabold tracking-wide">Panduan Operasional</span>
            <span className="text-[9px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-black hidden sm:inline">
              SOP
            </span>
          </button>
          {/* Live Date and Digital Clock with Hijri Date */}
          <div className="flex items-center gap-2.5 px-3.5 py-1.5 bg-gradient-to-r from-emerald-50/90 via-teal-50/50 to-amber-50/60 border border-emerald-200/70 rounded-xl shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="text-right leading-tight">
              <div className="flex items-center justify-end gap-1 text-[10px] font-semibold text-emerald-900">
                <span>{dateFormatted}</span>
                <span className="text-amber-700">· {hijriDate}</span>
              </div>
              <span className="text-sm font-extrabold text-slate-800 tracking-wider tabular-nums font-mono">
                {time} <span className="text-[9px] font-bold text-emerald-700">WIB</span>
              </span>
            </div>
          </div>

          {/* Inspirational Quote Card */}
          <div className="hidden xl:flex items-center gap-2.5 px-3.5 py-1.5 bg-amber-50/80 border border-amber-200/70 rounded-xl max-w-xs shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <p className="text-[11px] font-serif italic text-amber-950 line-clamp-2 leading-tight">
              {currentQuote}
            </p>
          </div>

          {/* PWA Install Button */}
          <button
            type="button"
            onClick={handleTriggerInstall}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            title="Pasang Aplikasi di Layar Utama HP / Komputer"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pasang Aplikasi</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowBellDropdown(!showBellDropdown)}
              className="relative p-2 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-2xs"
              title="Notifikasi Madrasah"
            >
              <Bell className="w-4.5 h-4.5 text-slate-600" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
                3
              </span>
            </button>

            {showBellDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2.5 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="text-xs font-bold text-slate-900">Notifikasi Madrasah</span>
                  </div>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                    3 Baru
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="p-3 hover:bg-emerald-50/40 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-slate-800">Guru Tidak Masuk Hari Ini</p>
                      <span className="text-[10px] text-slate-400">07:15</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">Ahmad Fauzan, S.Pd (Sakit) - 3 jadwal perlu penetapan guru pengganti.</p>
                  </div>
                  <div className="p-3 hover:bg-emerald-50/40 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-slate-800">Laporan Kendala Fasilitas</p>
                      <span className="text-[10px] text-slate-400">08:12</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">Proyektor Ruang Kelas XA tidak menyala, tiket #KND-2026-004.</p>
                  </div>
                  <div className="p-3 hover:bg-emerald-50/40 cursor-pointer transition-colors">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-slate-800">Edaran ANBK 2026</p>
                      <span className="text-[10px] text-slate-400">2j lalu</span>
                    </div>
                    <p className="text-slate-600 text-[11px] mt-0.5">Gladi bersih ANBK kelas XI dijadwalkan pekan depan di Lab Komputer.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleDropdown(!showRoleDropdown)}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-emerald-900/10 bg-gradient-to-r from-white to-emerald-50/40 hover:to-emerald-50 text-left transition-all shadow-2xs group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold flex items-center justify-center text-xs shadow-xs border border-emerald-400/30">
                {currentUser.role === 'Administrator' ? 'AS' : currentUser.role === 'Guru Piket' ? 'ZA' : 'SM'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="text-xs font-bold text-slate-900 block leading-tight">
                  {currentUser.namaLengkap}
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 block leading-none">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
            </button>

            {showRoleDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white font-extrabold flex items-center justify-center text-sm shadow-xs border border-emerald-400/30 shrink-0">
                    {currentUser.role === 'Administrator' ? 'AS' : currentUser.role === 'Guru Piket' ? 'ZA' : 'SM'}
                  </div>
                  <div className="overflow-hidden flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {currentUser.namaLengkap}
                    </p>
                    <p className="text-[11px] text-emerald-700 font-semibold truncate">
                      {currentUser.role}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>

                <div className="my-2.5 p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1.5 border border-slate-100">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Hak Akses:</span>
                    <span className="font-bold text-slate-800">{currentUser.role}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Status Sesi:</span>
                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Terotentikasi Aman
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Keamanan Akun:</span>
                    <span className="text-[10px] text-slate-500 font-mono">Privat & Terenkripsi</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">Ganti Akun?</span>
                  <button
                    onClick={() => {
                      setShowRoleDropdown(false);
                      setIsLoggedIn(false);
                    }}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PWA INSTALLATION MODAL */}
      {showInstallModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Smartphone className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pasang di Layar Utama HP</h3>
                  <p className="text-[11px] text-slate-500">Progressive Web App (PWA)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-3 leading-relaxed">
              <p>
                Aplikasi <strong>Sistem Guru Piket MA PLUS</strong> dapat diinstal langsung ke layar beranda smartphone Android atau iPhone Anda agar dapat diakses dengan cepat dan nyaman saat patroli keliling madrasah.
              </p>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2 text-emerald-950">
                <p className="font-bold text-emerald-900">Petunjuk untuk Pengguna Android (Chrome):</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-emerald-800">
                  <li>Ketuk tombol menu titik tiga (<strong>⋮</strong>) di pojok kanan atas browser.</li>
                  <li>Pilih opsi <strong>"Instal aplikasi"</strong> atau <strong>"Tambahkan ke Layar Utama"</strong>.</li>
                  <li>Ketuk <strong>"Instal"</strong>. Ikon aplikasi akan muncul di layar ponsel Anda.</li>
                </ol>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-slate-800">
                <p className="font-bold text-slate-900">Petunjuk untuk Pengguna iPhone (Safari):</p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600">
                  <li>Ketuk tombol <strong>Share</strong> (ikon kotak dengan panah ke atas) di bagian bawah.</li>
                  <li>Gulir ke bawah dan pilih <strong>"Add to Home Screen"</strong> (Tambahkan ke Layar Utama).</li>
                  <li>Ketuk <strong>"Add"</strong> (Tambah) di pojok kanan atas.</li>
                </ol>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowInstallModal(false)}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                Mengerti &amp; Siap Digunakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PANDUAN OPERASIONAL MODAL */}
      <PanduanOperasionalModal
        isOpen={showPanduanModal}
        onClose={() => setShowPanduanModal(false)}
      />
    </header>
  );
};
