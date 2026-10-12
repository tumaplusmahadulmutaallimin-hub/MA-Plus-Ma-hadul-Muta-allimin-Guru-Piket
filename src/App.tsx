import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { PanduanOperasionalView } from './components/common/PanduanOperasionalView';
import { KartuKendaliView } from './components/common/KartuKendaliView';

// Auth & Public
import { LoginView } from './components/auth/LoginView';
import { PublicLaporGuruTidakMasukView } from './components/auth/PublicLaporGuruTidakMasukView';
import { KonfirmasiKehadiranGuruMandiriView } from './components/auth/KonfirmasiKehadiranGuruMandiriView';

// Guru Piket Views
import { DashboardGuruPiket } from './components/guru-piket/DashboardGuruPiket';
import { TugasGuruIzinView } from './components/guru-piket/TugasGuruIzinView';
import { MonitoringKBMView } from './components/guru-piket/MonitoringKBMView';
import { AbsensiSiswaInputView } from './components/guru-piket/AbsensiSiswaInputView';
import { SiswaTidakMasukView } from './components/guru-piket/SiswaTidakMasukView';
import { SiswaTerlambatView } from './components/guru-piket/SiswaTerlambatView';
import { IzinKeluarKelasView } from './components/guru-piket/IzinKeluarKelasView';
import { SiswaTugasKhususView } from './components/guru-piket/SiswaTugasKhususView';
import { PelanggaranSiswaView } from './components/guru-piket/PelanggaranSiswaView';
import { LaporKendalaGuruPiketView } from './components/guru-piket/LaporKendalaGuruPiketView';
import { KirimLaporanKepalaView } from './components/guru-piket/KirimLaporanKepalaView';

// Admin Views
import { DashboardAdmin } from './components/admin/DashboardAdmin';
import { DataGuruView } from './components/admin/DataGuruView';
import { DataSiswaView } from './components/admin/DataSiswaView';
import { DataKelasView } from './components/admin/DataKelasView';
import { DataMapelRuangView } from './components/admin/DataMapelRuangView';
import { JadwalKBMView } from './components/admin/JadwalKBMView';
import { JadwalGuruPiketView } from './components/admin/JadwalGuruPiketView';
import { KategoriMasterView } from './components/admin/KategoriMasterView';
import { UserManagementView } from './components/admin/UserManagementView';
import { LaporanAdminView } from './components/admin/LaporanAdminView';
import { PengaturanSistemView } from './components/admin/PengaturanSistemView';
import { PergantianTahunAjaranView } from './components/admin/PergantianTahunAjaranView';

// Kepala Madrasah Views
import { DashboardKepala } from './components/kepala/DashboardKepala';
import { MonitoringGuruKepalaView } from './components/kepala/MonitoringGuruKepalaView';
import { MonitoringSiswaKepalaView } from './components/kepala/MonitoringSiswaKepalaView';
import { MonitoringKBMKepalaView } from './components/kepala/MonitoringKBMKepalaView';
import { LaporanPiketKepalaView } from './components/kepala/LaporanPiketKepalaView';
import { KendalaTindakLanjutKepalaView } from './components/kepala/KendalaTindakLanjutKepalaView';
import { RekapStatistikKepalaView } from './components/kepala/RekapStatistikKepalaView';
import { PengumumanKepalaView } from './components/kepala/PengumumanKepalaView';

const AppContent: React.FC = () => {
  const { isLoggedIn, currentUser, activeView, setActiveView } = useApp();
  const [isPublicReportOpen, setIsPublicReportOpen] = useState(false);
  const [isTeacherConfirmOpen, setIsTeacherConfirmOpen] = useState(false);
  const [teacherConfirmParams, setTeacherConfirmParams] = useState<any>(null);

  // Check URL parameters for confirmation link (?konfirmasi=ID or ?id=ID or #konfirmasi...)
  React.useEffect(() => {
    const checkUrlParams = () => {
      if (typeof window === 'undefined') return;
      const urlParams = new URLSearchParams(window.location.search);
      const hash = window.location.hash;
      const confirmId =
        urlParams.get('konfirmasi') ||
        urlParams.get('confirm') ||
        urlParams.get('id');
      const isHashConfirm = hash.startsWith('#konfirmasi');

      if (confirmId || isHashConfirm || urlParams.get('portal') === 'konfirmasi') {
        setIsTeacherConfirmOpen(true);
        setTeacherConfirmParams({
          recordId: confirmId || hash.replace('#konfirmasi-', '').replace('#konfirmasi', ''),
          guru: urlParams.get('guru') || '',
          kelas: urlParams.get('kelas') || '',
          jam: urlParams.get('jam') ? Number(urlParams.get('jam')) : undefined,
          mapel: urlParams.get('mapel') || ''
        });
      }
    };

    checkUrlParams();
    window.addEventListener('popstate', checkUrlParams);
    window.addEventListener('hashchange', checkUrlParams);
    return () => {
      window.removeEventListener('popstate', checkUrlParams);
      window.removeEventListener('hashchange', checkUrlParams);
    };
  }, []);

  // If public teacher absence reporting screen is requested
  if (isPublicReportOpen) {
    return <PublicLaporGuruTidakMasukView onBack={() => setIsPublicReportOpen(false)} />;
  }

  // If teacher confirmation screen is requested via WhatsApp link, mobile URL, or portal
  if (isTeacherConfirmOpen) {
    return (
      <KonfirmasiKehadiranGuruMandiriView
        initialParams={teacherConfirmParams}
        onBack={() => {
          setIsTeacherConfirmOpen(false);
          if (typeof window !== 'undefined' && window.history?.pushState) {
            const cleanUrl = window.location.origin + window.location.pathname;
            window.history.pushState({}, '', cleanUrl);
          }
        }}
      />
    );
  }

  // If not logged in, show authentic login screen
  if (!isLoggedIn) {
    return (
      <LoginView
        onOpenPublicReport={() => setIsPublicReportOpen(true)}
        onOpenTeacherConfirm={() => setIsTeacherConfirmOpen(true)}
      />
    );
  }

  // Router for main authenticated interface
  const renderActiveView = () => {
    // Universal view for all roles
    if (activeView === 'panduan-operasional' || activeView === 'panduan-sop') {
      return <PanduanOperasionalView />;
    }

    // 1. GURU PIKET
    if (currentUser.role === 'Guru Piket') {
      switch (activeView) {
        case 'dashboard':
          return <DashboardGuruPiket />;
        case 'tugas-guru-izin':
          return <TugasGuruIzinView />;
        case 'monitoring-kbm':
          return <MonitoringKBMView />;
        case 'absensi-siswa':
          return <AbsensiSiswaInputView />;
        case 'siswa-tidak-masuk':
          return <SiswaTidakMasukView />;
        case 'siswa-terlambat':
          return <SiswaTerlambatView />;
        case 'izin-keluar-kelas':
          return <IzinKeluarKelasView />;
        case 'kartu-kendali':
          return <KartuKendaliView />;
        case 'siswa-tugas-khusus':
          return <SiswaTugasKhususView />;
        case 'pelanggaran-siswa':
          return <PelanggaranSiswaView />;
        case 'lapor-kendala':
          return <LaporKendalaGuruPiketView />;
        case 'rekap-hari-ini':
          return <SiswaTidakMasukView />;
        case 'kirim-laporan-kepala':
        case 'selesaikan-tugas-piket':
          return <KirimLaporanKepalaView />;
        default:
          return <DashboardGuruPiket />;
      }
    }

    // 2. ADMINISTRATOR
    if (currentUser.role === 'Administrator') {
      switch (activeView) {
        case 'dashboard':
          return <DashboardAdmin />;
        case 'data-guru':
          return <DataGuruView />;
        case 'data-siswa':
          return <DataSiswaView />;
        case 'kartu-kendali':
          return <KartuKendaliView />;
        case 'data-kelas':
          return <DataKelasView />;
        case 'data-mapel':
          return <DataMapelRuangView initialTab="mapel" />;
        case 'data-ruang':
          return <DataMapelRuangView initialTab="ruang" />;
        case 'jadwal-kbm':
          return <JadwalKBMView />;
        case 'jadwal-guru-piket':
          return <JadwalGuruPiketView />;
        case 'program-tugas-khusus':
        case 'kategori-tugas-khusus':
          return <KategoriMasterView initialType="tugas-khusus" />;
        case 'kategori-pelanggaran':
          return <KategoriMasterView initialType="pelanggaran" />;
        case 'kategori-kendala':
          return <KategoriMasterView initialType="kendala" />;
        case 'user-role':
          return <UserManagementView />;
        case 'rekap-guru-piket':
        case 'rekap-siswa':
        case 'laporan-kepala':
          return <LaporanAdminView />;
        case 'pengaturan-sistem':
          return <PengaturanSistemView />;
        case 'pergantian-tahun':
        case 'kenaikan-kelas':
          return <PergantianTahunAjaranView />;
        default:
          return <DashboardAdmin />;
      }
    }

    // 3. KEPALA MADRASAH
    if (currentUser.role === 'Kepala Madrasah') {
      switch (activeView) {
        case 'dashboard':
          return <DashboardKepala />;
        case 'monitoring-guru':
          return <MonitoringGuruKepalaView />;
        case 'monitoring-siswa':
          return <MonitoringSiswaKepalaView />;
        case 'kartu-kendali':
          return <KartuKendaliView />;
        case 'monitoring-kbm-kepala':
          return <MonitoringKBMKepalaView />;
        case 'laporan-guru-piket-kepala':
          return <LaporanPiketKepalaView />;
        case 'kendala-tindak-lanjut-kepala':
          return <KendalaTindakLanjutKepalaView />;
        case 'rekap-absensi-kepala':
          return <LaporanAdminView />;
        case 'rekap-statistik-kepala':
          return <RekapStatistikKepalaView />;
        case 'pengumuman-kepala':
          return <PengumumanKepalaView />;
        case 'pergantian-tahun':
        case 'kenaikan-kelas':
          return <PergantianTahunAjaranView />;
        default:
          return <DashboardKepala />;
      }
    }

    // Default fallback
    return <DashboardGuruPiket />;
  };

  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-800 overflow-hidden">
      {/* Sidebar navigation */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Universal Top Header */}
        <Header />

        {/* Dynamic View Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {renderActiveView()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
