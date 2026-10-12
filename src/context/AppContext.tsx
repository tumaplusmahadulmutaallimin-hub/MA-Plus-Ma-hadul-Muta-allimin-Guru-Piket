import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserAccount,
  Guru,
  Siswa,
  Kelas,
  MataPelajaran,
  RuangLokasi,
  JadwalKBM,
  JadwalGuruPiket,
  GuruTidakMasukItem,
  MonitoringKBMRecord,
  SiswaTerlambatData,
  IzinKeluarData,
  SiswaTugasKhususData,
  PelanggaranSiswaData,
  LaporKendalaData,
  LaporanGuruPiketData,
  PengumumanData,
  CutOffPulangAwal,
  LocalWisdomSession,
  MasterKategoriItem,
  RiwayatPergantianTahun
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_GURU,
  INITIAL_SISWA,
  INITIAL_KELAS,
  INITIAL_MAPEL,
  INITIAL_RUANG,
  INITIAL_JADWAL_KBM,
  INITIAL_JADWAL_PIKET,
  INITIAL_GURU_TIDAK_MASUK,
  INITIAL_MONITORING_KBM,
  INITIAL_SISWA_TIDAK_MASUK,
  INITIAL_SISWA_TERLAMBAT,
  INITIAL_IZIN_KELUAR,
  INITIAL_TUGAS_KHUSUS,
  INITIAL_PELANGGARAN,
  INITIAL_KENDALA,
  INITIAL_LAPORAN_PIKET,
  INITIAL_PENGUMUMAN,
  INITIAL_MADRASAH_INFO
} from '../data/mockData';
import { GlobalModalPopup, PopupConfig } from '../components/common/GlobalModalPopup';
import {
  getStoredLogoSync,
  getStoredLogoAsync,
  persistLogo,
  resetLogoToDefault,
  DEFAULT_LOGO_URL
} from '../utils/logoStorage';

interface AppContextType {
  purgeDummyData: () => void;
  kosongkanMasterData: () => void;
  muatMasterDataResmi: () => void;
  currentUser: UserAccount;
  setCurrentUser: (user: UserAccount) => void;
  users: UserAccount[];
  isLoggedIn: boolean;
  setIsLoggedIn: (status: boolean) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  activeTabSub: string;
  setActiveTabSub: (tab: string) => void;
  isPublicReportOpen: boolean;
  setIsPublicReportOpen: (open: boolean) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  toggleMobileSidebar: () => void;

  // Real data state
  gurus: Guru[];
  guruList: Guru[];
  setGurus: React.Dispatch<React.SetStateAction<Guru[]>>;
  siswas: Siswa[];
  siswaList: Siswa[];
  setSiswas: React.Dispatch<React.SetStateAction<Siswa[]>>;
  userList: UserAccount[];
  kelasList: Kelas[];
  setKelasList: React.Dispatch<React.SetStateAction<Kelas[]>>;
  mapelList: MataPelajaran[];
  setMapelList: React.Dispatch<React.SetStateAction<MataPelajaran[]>>;
  ruangList: RuangLokasi[];
  setRuangList: React.Dispatch<React.SetStateAction<RuangLokasi[]>>;
  jadwalKBMList: JadwalKBM[];
  setJadwalKBMList: React.Dispatch<React.SetStateAction<JadwalKBM[]>>;
  jadwalPiketList: JadwalGuruPiket[];
  jadwalGuruPiketList: JadwalGuruPiket[];
  setJadwalPiketList: React.Dispatch<React.SetStateAction<JadwalGuruPiket[]>>;
  guruTidakMasukList: GuruTidakMasukItem[];
  setGuruTidakMasukList: React.Dispatch<React.SetStateAction<GuruTidakMasukItem[]>>;
  monitoringKBMList: MonitoringKBMRecord[];
  setMonitoringKBMList: React.Dispatch<React.SetStateAction<MonitoringKBMRecord[]>>;
  siswaTidakMasukList: any[];
  setSiswaTidakMasukList: React.Dispatch<React.SetStateAction<any[]>>;
  siswaTerlambatList: SiswaTerlambatData[];
  setSiswaTerlambatList: React.Dispatch<React.SetStateAction<SiswaTerlambatData[]>>;
  izinKeluarList: IzinKeluarData[];
  setIzinKeluarList: React.Dispatch<React.SetStateAction<IzinKeluarData[]>>;
  tugasKhususList: SiswaTugasKhususData[];
  setTugasKhususList: React.Dispatch<React.SetStateAction<SiswaTugasKhususData[]>>;
  pelanggaranList: PelanggaranSiswaData[];
  setPelanggaranList: React.Dispatch<React.SetStateAction<PelanggaranSiswaData[]>>;
  kendalaList: LaporKendalaData[];
  setKendalaList: React.Dispatch<React.SetStateAction<LaporKendalaData[]>>;
  laporanPiketList: LaporanGuruPiketData[];
  laporanList: any[];
  setLaporanPiketList: React.Dispatch<React.SetStateAction<LaporanGuruPiketData[]>>;
  pengumumanList: PengumumanData[];
  setPengumumanList: React.Dispatch<React.SetStateAction<PengumumanData[]>>;
  madrasahInfo: any;
  setMadrasahInfo: (info: any) => void;
  updateMadrasahInfo: (info: any) => Promise<boolean>;
  resetMadrasahLogo: () => Promise<boolean>;

  // Actions
  switchRole: (role: 'Administrator' | 'Guru Piket' | 'Kepala Madrasah') => void;
  assignSubstituteTeacher: (itemId: string, jamKe: number, kelas: string, substituteTeacher: string, notes?: string) => void;
  markSiswaReturned: (izinId: string) => void;
  markTugasKhususReturned: (tkId: string) => void;
  addKendala: (kendala: Partial<LaporKendalaData>) => void;
  addPelanggaran: (pelanggaran: Partial<PelanggaranSiswaData>) => void;
  addIzinKeluar: (izin: Partial<IzinKeluarData>) => void;
  addGuruTidakMasuk: (report: Partial<GuruTidakMasukItem>) => void;
  submitPiketReportToKepala: (notes: string) => void;
  verifyPiketReportByKepala: (reportId: string, status: 'Diterima' | 'Ditolak', catatan: string) => void;
  addGuru: (guru: any) => void;
  updateGuru: (id: string, guru: any) => void;
  deleteGuru: (id: string) => void;
  addSiswa: (siswa: any) => void;
  updateSiswa: (id: string, siswa: any) => void;
  deleteSiswa: (id: string) => void;
  addKelas: (kelas: any) => void;
  updateKelas: (id: string, kelas: any) => void;
  deleteKelas: (id: string) => void;
  addMapel: (mapel: any) => void;
  updateMapel: (id: string, mapel: any) => void;
  deleteMapel: (id: string) => void;
  addRuang: (ruang: any) => void;
  updateRuang: (id: string, ruang: any) => void;
  deleteRuang: (id: string) => void;
  addJadwalKBM: (data: Partial<JadwalKBM>) => void;
  updateJadwalKBM: (id: string, data: Partial<JadwalKBM>) => void;
  deleteJadwalKBM: (id: string) => void;
  addJadwalPiket: (data: Partial<JadwalGuruPiket>) => void;
  updateJadwalPiket: (id: string, data: Partial<JadwalGuruPiket>) => void;
  deleteJadwalPiket: (id: string) => void;
  addUser: (user: any) => void;
  updateUser: (id: string, user: any) => void;
  deleteUser: (id: string) => void;
  addSiswaTidakMasuk: (data: any) => void;
  saveMonitoringKBM: (record: Partial<MonitoringKBMRecord> & { kelas: string; jamKe: number }) => void;
  confirmTeacherKBMArrival: (recordId: string, payload: {
    fotoBuktiKelas: string;
    catatan?: string;
    waktuKonfirmasiHadir?: string;
    menitTerlambat?: number;
    kelas?: string;
    jamKe?: number;
    guruNama?: string;
    mapel?: string;
  }) => void;
  updateKendalaStatus: (id: string, status: any, tindakLanjut?: string) => void;
  updateLaporanStatus: (id: string, status: any, catatan?: string) => void;
  addPengumuman: (p: any) => void;

  // Global Popup & Confirmation System
  popupConfig: PopupConfig | null;
  showPopup: (config: PopupConfig) => void;
  closePopup: () => void;
  confirmAction: (options: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }) => void;
  alertSuccess: (title: string, message: string) => void;
  alertError: (title: string, message: string) => void;
  alertInfo: (title: string, message: string) => void;

  // Operasional Khusus: Cut-off Kepulangan Lebih Awal & Local Wisdom
  cutOffPulangAwalList: CutOffPulangAwal[];
  setCutOffPulangAwalList: React.Dispatch<React.SetStateAction<CutOffPulangAwal[]>>;
  tambahCutOffPulangAwal: (data: Omit<CutOffPulangAwal, 'id' | 'tanggal' | 'status'>) => void;
  batalkanCutOffPulangAwal: (id: string) => void;
  localWisdomList: LocalWisdomSession[];
  setLocalWisdomList: React.Dispatch<React.SetStateAction<LocalWisdomSession[]>>;
  updateLocalWisdomStatus: (id: string, status: any, catatan?: string) => void;
  generateWaTextLocalWisdom: (session: LocalWisdomSession) => string;

  // Master Data Kategori & Program Dinamis
  masterKategoriList: MasterKategoriItem[];
  setMasterKategoriList: React.Dispatch<React.SetStateAction<MasterKategoriItem[]>>;
  tambahMasterKategori: (item: Omit<MasterKategoriItem, 'id'>) => void;
  editMasterKategori: (id: string, item: Partial<MasterKategoriItem>) => void;
  hapusMasterKategori: (id: string) => void;

  // Presensi & KBM
  tindakSiswaTerlambat: (id: string, tindakan: 'Teguran' | 'Dicatat' | 'Pembinaan' | 'Panggil Orang Tua') => void;
  catatSiswaTidakMasukJam1: (data: { nama: string; kelas: string; status: 'Sakit' | 'Izin' | 'Alpa'; keterangan?: string }) => void;
  activeIzinLuarCount: number;
  activeIzinKamarMandiCount: number;
  maxKuotaLuarLingkungan: number;
  maxKuotaKamarMandi: number;

  // Authentication & Security
  login: (username: string, password: string) => { success: boolean; message: string; user?: UserAccount };
  logout: () => void;

  // Tahun Ajaran & Kenaikan Kelas
  tahunAjaranAktif: string;
  semesterAktif: 'Gasal' | 'Genap';
  riwayatTahunAjaranList: RiwayatPergantianTahun[];
  gantiSemester: (semesterBaru: 'Gasal' | 'Genap') => void;
  updateTahunAjaranManual: (tahunAjaran: string, semester: 'Gasal' | 'Genap') => void;
  prosesKenaikanKelasDanKelulusan: (params: {
    tahunAjaranBaru: string;
    semesterBaru: 'Gasal' | 'Genap';
    decisions: Record<string, {
      status: 'Lulus' | 'Naik' | 'Tinggal' | 'Mutasi';
      kelasTujuan?: string;
      catatan?: string;
    }>;
    resetPresensiHarian?: boolean;
    resetPoinPelanggaran?: boolean;
    catatanPergantian?: string;
  }) => { success: boolean; message: string; summary: any };
  rollbackPergantianTahun: (historyId: string) => { success: boolean; message: string };
}

const INITIAL_CUTOFF_LIST: CutOffPulangAwal[] = [];

const INITIAL_LOCAL_WISDOM_LIST: LocalWisdomSession[] = [];

const INITIAL_MASTER_KATEGORI_LIST: MasterKategoriItem[] = [
  { id: 'mk-1', nama: 'Ke Puskesmas / Faskes', grup: 'Izin Keluar', jenis: 'Kesehatan', kuota: 6, keterangan: 'Pemeriksaan darurat medis' },
  { id: 'mk-2', nama: 'Urusan Keluarga Mendesak', grup: 'Izin Keluar', jenis: 'Keluarga', kuota: 6, keterangan: 'Dijemput orang tua/wali' },
  { id: 'mk-3', nama: 'Ke Bank / Administrasi', grup: 'Izin Keluar', jenis: 'Keuangan', kuota: 6, keterangan: 'Keperluan ATM/Bank madrasah' },
  { id: 'mk-4', nama: 'Ke Toilet / Kamar Mandi', grup: 'Izin Keluar', jenis: 'Kamar Mandi', kuota: 12, keterangan: 'Maks 12 orang (keluar berpasangan 2 siswa)' },
  { id: 'mk-5', nama: 'Izin Pulang Sakit', grup: 'Izin Keluar', jenis: 'Pulang Awal', kuota: 6, keterangan: 'Dispensasi pulang kondisi lemah' },
  { id: 'mk-6', nama: 'Tim Distribusi MBG', grup: 'Program Tugas Khusus', jenis: 'Tetap Harian', jam: '11:30 - 12:45', kuota: 12, keterangan: 'Membantu pembagian makan bergizi gratis' },
  { id: 'mk-7', nama: 'Tahfidz Al-Qur\'an', grup: 'Program Tugas Khusus', jenis: 'Program Tetap', jam: '06:30 - 08:30', kuota: 15, keterangan: 'Setoran hafalan Al-Qur\'an santri' },
  { id: 'mk-8', nama: 'Pengurus OSIS / MPK', grup: 'Program Tugas Khusus', jenis: 'Organisasi', jam: 'Kondisional', kuota: 24, keterangan: 'Kegiatan rapat dan koordinasi agenda madrasah' },
  { id: 'mk-9', nama: 'Tim IT Madrasah', grup: 'Program Tugas Khusus', jenis: 'Program Tetap', jam: 'Kondisional', kuota: 8, keterangan: 'Dukungan lab TIK dan streaming' },
  { id: 'mk-10', nama: 'Petugas Upacara / Paskibra', grup: 'Program Tugas Khusus', jenis: 'Kepanitiaan', jam: '06:30 - 07:45', kuota: 18, keterangan: 'Latihan upacara hari Senin' },
  { id: 'mk-11', nama: 'Duta Madrasah & Perlombaan', grup: 'Program Tugas Khusus', jenis: 'Insidental', jam: 'Dispensasi', kuota: 6, keterangan: 'Delegasi kompetisi luar madrasah' },
  { id: 'mk-12', nama: 'Teguran Lisan & Pembinaan', grup: 'Tindakan Terlambat', bobotPoin: 2, keterangan: 'Diakui HADIR dalam rekapitulasi' },
  { id: 'mk-13', nama: 'Pencatatan Buku Piket', grup: 'Tindakan Terlambat', bobotPoin: 3, keterangan: 'Dicatat dan diakui HADIR' },
  { id: 'mk-14', nama: 'Pembinaan Khusus Piket', grup: 'Tindakan Terlambat', bobotPoin: 5, keterangan: 'Tugas kebersihan dan diakui HADIR' },
  { id: 'mk-15', nama: 'Pemanggilan Orang Tua / BK', grup: 'Tindakan Terlambat', bobotPoin: 15, keterangan: 'Untuk keterlambatan berulang' },
  { id: 'mk-16', nama: 'Pelajaran Local Wisdom (Kejuruan)', grup: 'Program Madrasah', keterangan: 'Praktik di Lab TIK, Bengkel TKRO, BLK Busana, Dapur Boga' },
  { id: 'mk-17', nama: 'Program Makan Bergizi Gratis (MBG)', grup: 'Program Madrasah', keterangan: 'Katering nutrisi santri dan asatidz' }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  // Default to Guru Piket (Zainal Arifin) as featured on key screens, can switch freely!
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[1]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [activeTabSub, setActiveTabSub] = useState<string>('all');
  const [isPublicReportOpen, setIsPublicReportOpen] = useState<boolean>(false);
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const toggleMobileSidebar = () => setIsMobileSidebarOpen((prev) => !prev);

  // Enforce authentic MA Plus Katerban-Ngawi dataset version (Hanya Data Guru Resmi 17 Orang yang dipertahankan, seluruh data dummy dibersihkan)
  const CURRENT_DATA_VERSION = 'v12_maplus_pure_guru_only_clean';
  const isMigrated = (() => {
    try {
      return localStorage.getItem('maplus_data_version') === CURRENT_DATA_VERSION;
    } catch {
      return false;
    }
  })();

  const [gurus, setGurus] = useState<Guru[]>(() => {
    try {
      const saved = localStorage.getItem('maplus_guru_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return INITIAL_GURU;
  });

  const [siswas, setSiswas] = useState<Siswa[]>(() => {
    try {
      if (isMigrated) {
        const saved = localStorage.getItem('maplus_siswa_list');
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_SISWA;
  });

  const [kelasList, setKelasList] = useState<Kelas[]>(() => {
    try {
      if (isMigrated) {
        const saved = localStorage.getItem('maplus_kelas_list');
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_KELAS;
  });

  const [mapelList, setMapelList] = useState<MataPelajaran[]>(() => {
    try {
      if (isMigrated) {
        const saved = localStorage.getItem('maplus_mapel_list');
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_MAPEL;
  });

  const [ruangList, setRuangList] = useState<RuangLokasi[]>(() => {
    try {
      if (isMigrated) {
        const saved = localStorage.getItem('maplus_ruang_list');
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_RUANG;
  });

  const [jadwalKBMList, setJadwalKBMList] = useState<JadwalKBM[]>(() => {
    try {
      if (isMigrated) {
        const saved = localStorage.getItem('maplus_jadwal_kbm');
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_JADWAL_KBM;
  });

  const [jadwalPiketList, setJadwalPiketList] = useState<JadwalGuruPiket[]>(() => {
    try {
      if (isMigrated) {
        const saved = localStorage.getItem('maplus_jadwal_piket');
        if (saved) return JSON.parse(saved);
      }
    } catch {}
    return INITIAL_JADWAL_PIKET;
  });

  const [guruTidakMasukList, setGuruTidakMasukList] = useState<GuruTidakMasukItem[]>(() => {
    try {
      const saved = localStorage.getItem('maplus_guru_tidak_masuk');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_GURU_TIDAK_MASUK;
  });

  const [monitoringKBMList, setMonitoringKBMList] = useState<MonitoringKBMRecord[]>(() => {
    try {
      const saved = localStorage.getItem('maplus_monitoring_kbm');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MONITORING_KBM;
  });
  const [siswaTidakMasukList, setSiswaTidakMasukList] = useState<any[]>(INITIAL_SISWA_TIDAK_MASUK);
  const [siswaTerlambatList, setSiswaTerlambatList] = useState<SiswaTerlambatData[]>(() => {
    // Pastikan siswa yang sudah ada tindakan langsung memiliki statusRekapKehadiran Hadir
    return INITIAL_SISWA_TERLAMBAT.map(st => ({
      ...st,
      statusRekapKehadiran: (st.tindakan && st.tindakan !== 'Belum Ditindak') ? ('Hadir (Selesai Ditindak)' as const) : ('Belum Ditindak' as const)
    }));
  });
  const [izinKeluarList, setIzinKeluarList] = useState<IzinKeluarData[]>(INITIAL_IZIN_KELUAR);
  const [tugasKhususList, setTugasKhususList] = useState<SiswaTugasKhususData[]>(INITIAL_TUGAS_KHUSUS);
  const [pelanggaranList, setPelanggaranList] = useState<PelanggaranSiswaData[]>(INITIAL_PELANGGARAN);
  const [kendalaList, setKendalaList] = useState<LaporKendalaData[]>(INITIAL_KENDALA);
  const [laporanPiketList, setLaporanPiketList] = useState<LaporanGuruPiketData[]>(INITIAL_LAPORAN_PIKET);
  const [pengumumanList, setPengumumanList] = useState<PengumumanData[]>(INITIAL_PENGUMUMAN);

  // Operasional Khusus State
  const [cutOffPulangAwalList, setCutOffPulangAwalList] = useState<CutOffPulangAwal[]>(() => {
    try {
      const saved = localStorage.getItem('maplus_cutoff_list');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_CUTOFF_LIST;
  });

  const [localWisdomList, setLocalWisdomList] = useState<LocalWisdomSession[]>(() => {
    try {
      const saved = localStorage.getItem('maplus_local_wisdom');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_LOCAL_WISDOM_LIST;
  });

  const [masterKategoriList, setMasterKategoriList] = useState<MasterKategoriItem[]>(() => {
    try {
      const saved = localStorage.getItem('maplus_master_kategori');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_MASTER_KATEGORI_LIST;
  });

  // Auto-sync persistent datasets to localStorage
  useEffect(() => {
    try { localStorage.setItem('maplus_guru_list', JSON.stringify(gurus)); } catch {}
  }, [gurus]);

  useEffect(() => {
    try { localStorage.setItem('maplus_siswa_list', JSON.stringify(siswas)); } catch {}
  }, [siswas]);

  useEffect(() => {
    try { localStorage.setItem('maplus_kelas_list', JSON.stringify(kelasList)); } catch {}
  }, [kelasList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_mapel_list', JSON.stringify(mapelList)); } catch {}
  }, [mapelList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_ruang_list', JSON.stringify(ruangList)); } catch {}
  }, [ruangList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_jadwal_kbm', JSON.stringify(jadwalKBMList)); } catch {}
  }, [jadwalKBMList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_jadwal_piket', JSON.stringify(jadwalPiketList)); } catch {}
  }, [jadwalPiketList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_guru_tidak_masuk', JSON.stringify(guruTidakMasukList)); } catch {}
  }, [guruTidakMasukList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_cutoff_list', JSON.stringify(cutOffPulangAwalList)); } catch {}
  }, [cutOffPulangAwalList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_local_wisdom', JSON.stringify(localWisdomList)); } catch {}
  }, [localWisdomList]);

  useEffect(() => {
    try { localStorage.setItem('maplus_master_kategori', JSON.stringify(masterKategoriList)); } catch {}
  }, [masterKategoriList]);

  // Enforce version v12 on initial load: Bersihkan seluruh data dummy siswa & log transaksi, pertahankan data guru resmi
  useEffect(() => {
    try {
      if (localStorage.getItem('maplus_data_version') !== CURRENT_DATA_VERSION) {
        localStorage.setItem('maplus_siswa_list', JSON.stringify([]));
        localStorage.setItem('maplus_guru_tidak_masuk', JSON.stringify([]));
        localStorage.setItem('maplus_monitoring_kbm', JSON.stringify([]));
        localStorage.setItem('maplus_siswa_tidak_masuk', JSON.stringify([]));
        localStorage.setItem('maplus_siswa_terlambat', JSON.stringify([]));
        localStorage.setItem('maplus_izin_keluar', JSON.stringify([]));
        localStorage.setItem('maplus_tugas_khusus', JSON.stringify([]));
        localStorage.setItem('maplus_pelanggaran', JSON.stringify([]));
        localStorage.setItem('maplus_kendala', JSON.stringify([]));
        localStorage.setItem('maplus_laporan_piket', JSON.stringify([]));
        localStorage.setItem('maplus_pengumuman', JSON.stringify([]));
        localStorage.setItem('maplus_cutoff_list', JSON.stringify([]));
        localStorage.setItem('maplus_local_wisdom', JSON.stringify([]));
        localStorage.setItem('maplus_data_version', CURRENT_DATA_VERSION);
        setSiswas([]);
        setGuruTidakMasukList([]);
        setMonitoringKBMList([]);
        setSiswaTidakMasukList([]);
        setSiswaTerlambatList([]);
        setIzinKeluarList([]);
        setTugasKhususList([]);
        setPelanggaranList([]);
        setKendalaList([]);
        setLaporanPiketList([]);
        setPengumumanList([]);
        setCutOffPulangAwalList([]);
        setLocalWisdomList([]);
      }
    } catch {}
  }, []);

  // Sync monitoring state across browser tabs & devices in realtime
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'maplus_monitoring_kbm' && e.newValue) {
        try {
          setMonitoringKBMList(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'maplus_jadwal_kbm' && e.newValue) {
        try {
          setJadwalKBMList(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === 'maplus_jadwal_piket' && e.newValue) {
        try {
          setJadwalPiketList(JSON.parse(e.newValue));
        } catch {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Switch role helper
  const switchRole = (role: 'Administrator' | 'Guru Piket' | 'Kepala Madrasah') => {
    const userFound = users.find(u => u.role === role);
    if (userFound) {
      setCurrentUser(userFound);
      setActiveView('dashboard');
    }
  };

  // Assign substitute teacher (inval) with cross-system integration to Monitoring KBM
  const assignSubstituteTeacher = (
    itemId: string,
    jamKe: number,
    kelas: string,
    substituteTeacher: string,
    notes?: string
  ) => {
    // 1. Update guruTidakMasukList
    setGuruTidakMasukList(prev => prev.map(item => {
      if (item.id === itemId) {
        const updatedJadwal = item.jadwalTerdampak.map(j => {
          if (j.jamKe === jamKe && j.kelas === kelas) {
            return {
              ...j,
              guruPengganti: substituteTeacher,
              status: 'Ditetapkan' as const,
              catatan: notes || j.catatan
            };
          }
          return j;
        });
        const unassigned = updatedJadwal.filter(j => j.status === 'Belum Ada').length;
        return {
          ...item,
          jadwalTerdampak: updatedJadwal,
          belumAdaPengganti: unassigned
        };
      }
      return item;
    }));

    // 2. Direct integration into monitoringKBMList so Guru Piket and Kepala immediately see the substitute teacher!
    setMonitoringKBMList(prev => {
      let found = false;
      const updated = prev.map(rec => {
        if (rec.kelas === kelas && Number(rec.jamKe) === Number(jamKe)) {
          found = true;
          return {
            ...rec,
            guruPengganti: substituteTeacher,
            statusGuru: `Didampingi Inval (${substituteTeacher})`,
            catatan: notes ? `${rec.catatan ? rec.catatan + ' | ' : ''}Guru Inval: ${substituteTeacher} (${notes})` : rec.catatan
          };
        }
        return rec;
      });

      if (!found) {
        const newRecord: MonitoringKBMRecord = {
          id: `mk-${Date.now()}`,
          jamKe,
          waktu: '07:00 - 07:45',
          kelas,
          mapel: 'KBM Terjadwal',
          guruJadwal: 'Guru Izin',
          guruPengganti: substituteTeacher,
          statusGuru: `Didampingi Inval (${substituteTeacher})`,
          kondisiPembelajaran: 'Berlangsung dengan baik',
          kondisiSiswa: 'Tertib',
          waktuCek: '07:15',
          statusIsi: 'Sudah diisi' as const,
          catatan: notes ? `Guru Inval: ${substituteTeacher} (${notes})` : `Guru Inval: ${substituteTeacher}`
        };
        const res = [newRecord, ...updated];
        try { localStorage.setItem('maplus_monitoring_kbm', JSON.stringify(res)); } catch {}
        return res;
      }

      try { localStorage.setItem('maplus_monitoring_kbm', JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const markSiswaReturned = (izinId: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setIzinKeluarList(prev => prev.map(item => {
      if (item.id === izinId) {
        return {
          ...item,
          status: 'Kembali',
          waktuKembali: timeStr
        };
      }
      return item;
    }));
  };

  const markTugasKhususReturned = (tkId: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setTugasKhususList(prev => prev.map(item => {
      if (item.id === tkId) {
        return {
          ...item,
          statusHariIni: 'Selesai (Tepat Waktu)',
          kembali: timeStr
        };
      }
      return item;
    }));
  };

  const addKendala = (newKendala: Partial<LaporKendalaData>) => {
    const item: LaporKendalaData = {
      id: `knd-${Date.now()}`,
      no: kendalaList.length + 1,
      noTiket: `#KND-2026-00${kendalaList.length + 1}`,
      tanggalWaktu: '04/09/2026 09:15',
      kategori: newKendala.kategori || 'Fasilitas',
      judulKendala: newKendala.judulKendala || 'Kendala baru',
      lokasi: newKendala.lokasi || 'Area Madrasah',
      pelapor: currentUser.namaLengkap,
      status: 'Perlu Tindak Lanjut',
      prioritas: newKendala.prioritas || 'Normal',
      deskripsi: newKendala.deskripsi || '',
      fotoUrls: newKendala.fotoUrls || [],
      tujukanKepada: newKendala.tujukanKepada,
      riwayatTindakLanjut: [
        { waktu: '04 Sep 2026 09:15', keterangan: `Laporan dibuat oleh ${currentUser.namaLengkap}`, oleh: currentUser.namaLengkap }
      ]
    };
    setKendalaList(prev => [item, ...prev]);
  };

  const addPelanggaran = (newPel: Partial<PelanggaranSiswaData>) => {
    const item: PelanggaranSiswaData = {
      id: `p-${Date.now()}`,
      no: pelanggaranList.length + 1,
      nis: newPel.nis || '1234567890',
      waktu: '09:15',
      nama: newPel.nama || 'Siswa',
      kelas: newPel.kelas || 'XA',
      jenisPelanggaran: newPel.jenisPelanggaran || 'Terlambat',
      tingkat: newPel.tingkat || 'Ringan',
      poin: newPel.poin || 5,
      keterangan: newPel.keterangan || '',
      dicatatOleh: currentUser.namaLengkap,
      tindakan: newPel.tindakan || 'Teguran',
      buktiFotoUrl: newPel.buktiFotoUrl,
      tanggal: '04/09/2026'
    };
    setPelanggaranList(prev => [item, ...prev]);
  };

  const addIzinKeluar = (newIzin: Partial<IzinKeluarData>) => {
    const item: IzinKeluarData = {
      id: `ik-${Date.now()}`,
      no: izinKeluarList.length + 1,
      nama: newIzin.nama || 'Siswa',
      kelas: newIzin.kelas || 'XA',
      tujuan: newIzin.tujuan || 'Ke Puskesmas',
      jenisIzin: newIzin.jenisIzin || 'Izin Keluar',
      kategoriTempat: newIzin.kategoriTempat || (newIzin.tujuan === 'Ke Kamar Mandi' ? 'Kamar Mandi' : 'Luar Lingkungan'),
      waktuKeluar: newIzin.waktuKeluar || '09:15',
      estimasiKembali: newIzin.estimasiKembali || '10:30',
      durasi: newIzin.durasi || '1j 15m',
      status: 'Masih Keluar',
      dicatatOleh: currentUser.namaLengkap,
      tanggal: '04/09/2026',
      keterangan: newIzin.keterangan,
      noHp: newIzin.noHp,
      pendamping: newIzin.pendamping
    };
    setIzinKeluarList(prev => [item, ...prev]);
  };

  const tindakSiswaTerlambat = (id: string, tindakan: 'Teguran' | 'Dicatat' | 'Pembinaan' | 'Panggil Orang Tua') => {
    setSiswaTerlambatList(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          tindakan,
          statusRekapKehadiran: 'Hadir (Selesai Ditindak)' as const
        };
      }
      return s;
    }));
    alertSuccess('Tindakan Berhasil Dicatat', `Siswa telah diberikan ${tindakan}. Status dalam rekapitulasi madrasah diakui HADIR.`);
  };

  const catatSiswaTidakMasukJam1 = (data: { nama: string; kelas: string; status: 'Sakit' | 'Izin' | 'Alpa'; keterangan?: string }) => {
    const newItem = {
      id: `stm-${Date.now()}`,
      no: siswaTidakMasukList.length + 1,
      nama: data.nama,
      kelas: data.kelas,
      status: data.status,
      keterangan: data.keterangan || `Dicatat pada Monitoring KBM Jam ke-1`,
      tanggal: '04/09/2026',
      dicatatPadaJam: 1,
      dicatatOleh: currentUser.namaLengkap
    };
    setSiswaTidakMasukList(prev => [newItem, ...prev]);
    alertSuccess('Presensi Jam ke-1 Tersimpan', `${data.nama} (${data.kelas}) dicatat ${data.status}. Siswa lain otomatis diakui HADIR.`);
  };

  const tambahCutOffPulangAwal = (data: Omit<CutOffPulangAwal, 'id' | 'tanggal' | 'status'>) => {
    const newCutoff: CutOffPulangAwal = {
      id: `co-${Date.now()}`,
      ...data,
      tanggal: '04/09/2026',
      status: 'Aktif'
    };
    const updated = [newCutoff, ...cutOffPulangAwalList];
    setCutOffPulangAwalList(updated);
    try { localStorage.setItem('maplus_cutoff_list', JSON.stringify(updated)); } catch {}
    alertSuccess('Dispensasi Pulang Awal Ditetapkan', `Kepulangan pukul ${data.jamCutOff} (${data.tipe}) berhasil diaktifkan.`);
  };

  const batalkanCutOffPulangAwal = (id: string) => {
    const updated = cutOffPulangAwalList.filter(c => c.id !== id);
    setCutOffPulangAwalList(updated);
    try { localStorage.setItem('maplus_cutoff_list', JSON.stringify(updated)); } catch {}
    alertInfo('Dispensasi Dibatalkan', 'Status jam kepulangan dikembalikan normal sesuai jadwal.');
  };

  const updateLocalWisdomStatus = (id: string, status: any, catatan?: string) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const updated = localWisdomList.map(session => {
      if (session.id === id) {
        return {
          ...session,
          statusKonfirmasi: status,
          waktuKonfirmasi: timeStr,
          catatanInstruktur: catatan !== undefined ? catatan : session.catatanInstruktur
        };
      }
      return session;
    });
    setLocalWisdomList(updated);
    try { localStorage.setItem('maplus_local_wisdom', JSON.stringify(updated)); } catch {}
    alertSuccess('Konfirmasi Diperbarui', `Presensi Local Wisdom untuk ${updated.find(s => s.id === id)?.jurusan} berhasil disinkronkan.`);
  };

  const generateWaTextLocalWisdom = (session: LocalWisdomSession) => {
    return `*PERMOHONAN KONFIRMASI PRESENSI LOCAL WISDOM*\n` +
      `*MA PLUS MA'HADUL MUTA'ALLIMIN*\n\n` +
      `Assalamu'alaikum Wr. Wb.\n` +
      `Yth. Bpk/Ibu ${session.instruktur}\n` +
      `Instruktur / Guru Praktik: ${session.jurusan}\n` +
      `Lokasi Praktik: ${session.lokasi}\n\n` +
      `Hari/Tanggal: ${session.hari}, 4 September 2026\n` +
      `Tingkat Kelas: ${session.tingkatKelas}\n` +
      `Jumlah Siswa: ${session.jumlahSiswa} Orang\n\n` +
      `Sehubungan pelaksanaan praktik kejuruan Local Wisdom di luar kelas reguler, mohon konfirmasi:\n` +
      `1. Apakah seluruh santri telah hadir dan mengikuti kegiatan di ${session.lokasi}?\n` +
      `2. Jika ada siswa yang berhalangan/sakit/izin, mohon kirimkan nama siswa bersangkutan.\n\n` +
      `Pesan ini dikirimkan via Portal Guru Piket Madrasah.\n` +
      `Petugas Piket: ${currentUser.namaLengkap}\n` +
      `Wassalamu'alaikum Wr. Wb.`;
  };

  const tambahMasterKategori = (item: Omit<MasterKategoriItem, 'id'>) => {
    const newItem: MasterKategoriItem = {
      id: `mk-${Date.now()}`,
      ...item
    };
    const updated = [...masterKategoriList, newItem];
    setMasterKategoriList(updated);
    try { localStorage.setItem('maplus_master_kategori', JSON.stringify(updated)); } catch {}
    alertSuccess('Kategori Berhasil Ditambahkan', `Item "${item.nama}" berhasil disimpan ke Master Data.`);
  };

  const editMasterKategori = (id: string, item: Partial<MasterKategoriItem>) => {
    const updated = masterKategoriList.map(k => k.id === id ? { ...k, ...item } : k);
    setMasterKategoriList(updated);
    try { localStorage.setItem('maplus_master_kategori', JSON.stringify(updated)); } catch {}
    alertSuccess('Perubahan Tersimpan', 'Data kategori berhasil diperbarui.');
  };

  const hapusMasterKategori = (id: string) => {
    const updated = masterKategoriList.filter(k => k.id !== id);
    setMasterKategoriList(updated);
    try { localStorage.setItem('maplus_master_kategori', JSON.stringify(updated)); } catch {}
    alertInfo('Kategori Dihapus', 'Item kategori berhasil dihapus dari sistem.');
  };

  const maxKuotaLuarLingkungan = 6;
  const maxKuotaKamarMandi = 12;

  const activeIzinLuarCount = izinKeluarList.filter(
    ik => ik.status === 'Masih Keluar' && (ik.kategoriTempat === 'Luar Lingkungan' || (!ik.kategoriTempat && ik.tujuan !== 'Ke Kamar Mandi' && ik.tujuan !== 'Ke UKS'))
  ).length;

  const activeIzinKamarMandiCount = izinKeluarList.filter(
    ik => ik.status === 'Masih Keluar' && (ik.kategoriTempat === 'Kamar Mandi' || ik.tujuan === 'Ke Kamar Mandi')
  ).reduce((acc, ik) => acc + (ik.pendamping ? 2 : 1), 0);

  const addGuruTidakMasuk = (report: Partial<GuruTidakMasukItem>) => {
    const newItem: GuruTidakMasukItem = {
      id: `gtm-${Date.now()}`,
      tanggal: 'Jumat, 4 September 2026',
      guruNama: report.guruNama || 'Guru Madrasah',
      alasan: report.alasan || 'Sakit',
      keterangan: report.keterangan || '',
      totalJadwal: report.jadwalTerdampak?.length || 1,
      belumAdaPengganti: report.jadwalTerdampak?.length || 1,
      jadwalTerdampak: report.jadwalTerdampak || []
    };
    setGuruTidakMasukList(prev => [newItem, ...prev]);
  };

  const submitPiketReportToKepala = (notes: string) => {
    const newReport: LaporanGuruPiketData = {
      id: `lp-${Date.now()}`,
      no: laporanPiketList.length + 1,
      tanggal: '4 Sep 2026',
      hari: 'Jum\'at',
      guruPiket: currentUser.namaLengkap,
      shift: 'Pagi',
      waktuKirim: '4 Sep 2026 11:30',
      ringkasan: `Laporan guru piket harian oleh ${currentUser.namaLengkap}. KBM berlangsung lancar.`,
      status: 'Menunggu',
      kelasDimonitor: '12 / 12',
      guruTidakMasukCount: guruTidakMasukList.length,
      guruPenggantiCount: 2,
      siswaTidakMasukCount: 12,
      siswaTerlambatCount: siswaTerlambatList.length,
      siswaTugasKhususCount: tugasKhususList.length,
      pelanggaranCount: pelanggaranList.length,
      izinKeluarCount: izinKeluarList.length,
      kendalaCount: kendalaList.length,
      catatanGuruPiket: notes || 'Kegiatan KBM dan ketertiban madrasah berjalan sesuai ketentuan.',
      kronologi: [
        { waktu: '07:05', kegiatan: 'Monitoring KBM', detail: 'Kelas XA - Jam Ke-1', menuTerkait: 'Monitoring KBM' },
        { waktu: '07:12', kegiatan: 'Pendataan siswa', detail: 'Mencatat siswa tidak masuk', menuTerkait: 'Siswa Tidak Masuk' },
        { waktu: '07:20', kegiatan: 'Penetapan guru pengganti', detail: 'Guru pengganti ditetapkan', menuTerkait: 'Tugas Guru Izin' },
        { waktu: '09:10', kegiatan: 'Pencatatan pelanggaran', detail: 'Pencatatan pelanggaran siswa', menuTerkait: 'Pelanggaran Siswa' },
        { waktu: '10:05', kegiatan: 'Pelaporan kendala', detail: 'Pelaporan kendala sarpras', menuTerkait: 'Lapor Kendala' }
      ]
    };
    setLaporanPiketList(prev => [newReport, ...prev]);
  };

  const [madrasahInfo, setMadrasahInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('maplus_madrasah_info');
      let base = INITIAL_MADRASAH_INFO;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.nsm === '131235210019' && parsed.taglineUtama) {
          base = parsed;
        }
      }
      // Prioritize dedicated stored custom logo if present
      const storedLogo = getStoredLogoSync();
      const resolvedLogo = storedLogo || base.logo || '';
      // If legacy hardcoded image path, clear it so user starts with clean container
      const finalLogo = resolvedLogo.includes('MAPLUSLOGO') || resolvedLogo.includes('logo_madrasah') ? '' : resolvedLogo;
      return {
        ...base,
        logo: finalLogo
      };
    } catch {}
    return INITIAL_MADRASAH_INFO;
  });

  // Background hydration check from IndexedDB (survives localStorage quota resets)
  useEffect(() => {
    getStoredLogoAsync().then((persistentLogo) => {
      if (persistentLogo && !persistentLogo.includes('MAPLUSLOGO') && !persistentLogo.includes('logo_madrasah')) {
        setMadrasahInfo((prev: any) => {
          if (prev.logo !== persistentLogo) {
            return { ...prev, logo: persistentLogo };
          }
          return prev;
        });
      }
    });
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(madrasahInfo));
    } catch (err) {
      console.warn('Could not auto-sync maplus_madrasah_info:', err);
    }
  }, [madrasahInfo]);

  /**
   * Verified persistent update for Madrasah Info & Logo
   */
  const updateMadrasahInfo = async (newInfo: any): Promise<boolean> => {
    if (!newInfo) throw new Error('Data informasi madrasah tidak valid.');

    // 1. If logo is provided, persistently save it to both localStorage & IndexedDB with verification
    // If empty string, reset stored logo so the container reverts to placeholder
    if (newInfo.logo && newInfo.logo.trim() !== '') {
      await persistLogo(newInfo.logo);
    } else if (newInfo.logo === '') {
      await resetLogoToDefault();
    }

    // 2. Persistently save full madrasah info to localStorage
    try {
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(newInfo));
    } catch (err: any) {
      console.warn('localStorage write error for madrasahInfo:', err);
    }

    // 3. Update React state
    setMadrasahInfo(newInfo);
    return true;
  };

  /**
   * Reset logo back to empty placeholder container
   */
  const resetMadrasahLogo = async (): Promise<boolean> => {
    await resetLogoToDefault();
    const updated = {
      ...madrasahInfo,
      logo: ''
    };
    try {
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(updated));
    } catch {}
    setMadrasahInfo(updated);
    return true;
  };

  // 1. Membersihkan seluruh data dummy siswa & log operasional harian (mempertahankan 17 guru resmi)
  const purgeDummyData = () => {
    setSiswas([]);
    setGuruTidakMasukList([]);
    setMonitoringKBMList([]);
    setSiswaTidakMasukList([]);
    setSiswaTerlambatList([]);
    setIzinKeluarList([]);
    setTugasKhususList([]);
    setPelanggaranList([]);
    setKendalaList([]);
    setLaporanPiketList([]);
    setPengumumanList([]);
    setCutOffPulangAwalList([]);
    setLocalWisdomList([]);
    try {
      localStorage.setItem('maplus_siswa_list', JSON.stringify([]));
      localStorage.setItem('maplus_guru_tidak_masuk', JSON.stringify([]));
      localStorage.setItem('maplus_monitoring_kbm', JSON.stringify([]));
      localStorage.setItem('maplus_siswa_tidak_masuk', JSON.stringify([]));
      localStorage.setItem('maplus_siswa_terlambat', JSON.stringify([]));
      localStorage.setItem('maplus_izin_keluar', JSON.stringify([]));
      localStorage.setItem('maplus_tugas_khusus', JSON.stringify([]));
      localStorage.setItem('maplus_pelanggaran', JSON.stringify([]));
      localStorage.setItem('maplus_kendala', JSON.stringify([]));
      localStorage.setItem('maplus_laporan_piket', JSON.stringify([]));
      localStorage.setItem('maplus_pengumuman', JSON.stringify([]));
      localStorage.setItem('maplus_cutoff_list', JSON.stringify([]));
      localStorage.setItem('maplus_local_wisdom', JSON.stringify([]));
      localStorage.setItem('maplus_data_version', CURRENT_DATA_VERSION);
    } catch {}
    alertSuccess(
      'Data Dummy Dibersihkan',
      'Seluruh data dummy (siswa, absensi, pelanggaran, kendala) telah dibersihkan! Data guru tetap dipertahankan dan sistem siap diisi manual.'
    );
  };

  // 2. Kosongkan seluruh data guru dan santri agar dapat diinput manual dari nol
  const kosongkanMasterData = () => {
    setGurus([]);
    setSiswas([]);
    setJadwalKBMList([]);
    setJadwalPiketList([]);
    setGuruTidakMasukList([]);
    setMonitoringKBMList([]);
    setSiswaTidakMasukList([]);
    setSiswaTerlambatList([]);
    setIzinKeluarList([]);
    setTugasKhususList([]);
    setPelanggaranList([]);
    setKendalaList([]);
    setLaporanPiketList([]);
    setPengumumanList([]);
    setCutOffPulangAwalList([]);
    setLocalWisdomList([]);
    try {
      localStorage.setItem('maplus_guru_list', JSON.stringify([]));
      localStorage.setItem('maplus_siswa_list', JSON.stringify([]));
      localStorage.setItem('maplus_jadwal_kbm', JSON.stringify([]));
      localStorage.setItem('maplus_jadwal_piket', JSON.stringify([]));
      localStorage.setItem('maplus_guru_tidak_masuk', JSON.stringify([]));
      localStorage.setItem('maplus_monitoring_kbm', JSON.stringify([]));
      localStorage.setItem('maplus_data_version', CURRENT_DATA_VERSION);
    } catch {}
    alertSuccess(
      'Master Data Dikosongkan',
      'Daftar guru, santri, dan jadwal telah dikosongkan. Anda dapat mengisinya satu per satu secara manual melalui tombol "+ Tambah".'
    );
  };

  // 3. Muat kembali master data resmi MA Plus (17 guru resmi, santri tetap kosong untuk input manual)
  const muatMasterDataResmi = () => {
    setGurus(INITIAL_GURU);
    setSiswas([]);
    setKelasList(INITIAL_KELAS);
    setMapelList(INITIAL_MAPEL);
    setRuangList(INITIAL_RUANG);
    setJadwalKBMList(INITIAL_JADWAL_KBM);
    setJadwalPiketList(INITIAL_JADWAL_PIKET);
    setMadrasahInfo(INITIAL_MADRASAH_INFO);
    try {
      localStorage.setItem('maplus_guru_list', JSON.stringify(INITIAL_GURU));
      localStorage.setItem('maplus_siswa_list', JSON.stringify([]));
      localStorage.setItem('maplus_kelas_list', JSON.stringify(INITIAL_KELAS));
      localStorage.setItem('maplus_mapel_list', JSON.stringify(INITIAL_MAPEL));
      localStorage.setItem('maplus_ruang_list', JSON.stringify(INITIAL_RUANG));
      localStorage.setItem('maplus_jadwal_kbm', JSON.stringify(INITIAL_JADWAL_KBM));
      localStorage.setItem('maplus_jadwal_piket', JSON.stringify(INITIAL_JADWAL_PIKET));
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(INITIAL_MADRASAH_INFO));
      localStorage.setItem('maplus_data_version', CURRENT_DATA_VERSION);
    } catch {}
    alertSuccess(
      'Data Guru Resmi Dimuat',
      'Master data 17 guru resmi MA Plus berhasil dimuat. Data santri siap diinput manual dari nol.'
    );
  };

  // State Riwayat Pergantian Tahun Ajaran
  const [riwayatTahunAjaranList, setRiwayatTahunAjaranList] = useState<RiwayatPergantianTahun[]>(() => {
    try {
      const saved = localStorage.getItem('maplus_riwayat_tahun_ajaran');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'rta-init',
        tanggal: '15 Juli 2026',
        waktu: '08:00 WIB',
        tahunLama: '2025/2026',
        semesterLama: 'Genap',
        tahunBaru: '2026/2027',
        semesterBaru: 'Gasal',
        totalSiswaLulus: 38,
        totalSiswaNaikKelas: 106,
        totalSiswaTinggal: 0,
        totalSiswaMutasi: 0,
        totalSiswaSebelum: 144,
        totalSiswaSesudah: 146,
        diprosesOleh: 'Administrator (Sistem Kemenag)',
        catatan: 'Inisialisasi Tahun Ajaran Baru 2026/2027 Semester Gasal MA Plus Ma\'hadul Muta\'allimin Katerban-Ngawi.'
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('maplus_riwayat_tahun_ajaran', JSON.stringify(riwayatTahunAjaranList));
    } catch {}
  }, [riwayatTahunAjaranList]);

  const tahunAjaranAktif = madrasahInfo.tahunAjaranAktif || '2026/2027';
  const semesterAktif = (madrasahInfo.semesterAktif || 'Gasal') as 'Gasal' | 'Genap';

  // Pergantian Semester sederhana (Gasal <-> Genap)
  const gantiSemester = (semesterBaru: 'Gasal' | 'Genap') => {
    const updated = {
      ...madrasahInfo,
      semesterAktif: semesterBaru
    };
    setMadrasahInfo(updated);
    try {
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(updated));
    } catch {}

    // Bersihkan presensi harian untuk menyambut semester baru
    setGuruTidakMasukList([]);
    setMonitoringKBMList([]);
    setSiswaTidakMasukList([]);
    setSiswaTerlambatList([]);
    setIzinKeluarList([]);

    alertSuccess(
      'Semester Berhasil Diubah',
      `Tahun Ajaran ${tahunAjaranAktif} kini aktif pada Semester ${semesterBaru}. Log absensi harian telah disiapkan bersih.`
    );
  };

  // Update Tahun Ajaran Manual
  const updateTahunAjaranManual = (tahunAjaran: string, semester: 'Gasal' | 'Genap') => {
    const updated = {
      ...madrasahInfo,
      tahunAjaranAktif: tahunAjaran,
      semesterAktif: semester
    };
    setMadrasahInfo(updated);
    try {
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(updated));
    } catch {}
    alertSuccess('Pengaturan Disimpan', `Tahun ajaran aktif diubah ke ${tahunAjaran} (${semester}).`);
  };

  // Proses Kenaikan Kelas & Kelulusan Siswa
  const prosesKenaikanKelasDanKelulusan = (params: {
    tahunAjaranBaru: string;
    semesterBaru: 'Gasal' | 'Genap';
    decisions: Record<string, {
      status: 'Lulus' | 'Naik' | 'Tinggal' | 'Mutasi';
      kelasTujuan?: string;
      catatan?: string;
    }>;
    resetPresensiHarian?: boolean;
    resetPoinPelanggaran?: boolean;
    catatanPergantian?: string;
  }) => {
    const {
      tahunAjaranBaru,
      semesterBaru,
      decisions,
      resetPresensiHarian = true,
      resetPoinPelanggaran = true,
      catatanPergantian
    } = params;

    const tahunLama = madrasahInfo.tahunAjaranAktif || '2026/2027';
    const semesterLama = madrasahInfo.semesterAktif || 'Genap';
    const snapshotSiswaJson = JSON.stringify(siswas);

    let countLulus = 0;
    let countNaik = 0;
    let countTinggal = 0;
    let countMutasi = 0;

    const updatedSiswas = siswas.map((s) => {
      const decision = decisions[s.id];
      const previousClass = s.kelas;
      const historyRecord = {
        tahunAjaran: tahunLama,
        kelas: previousClass,
        status: decision?.status || (s.kelas.includes('XII') ? 'Lulus' : 'Naik'),
        tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      };
      const existingHistory = s.riwayatKelas || [];

      // Jika ada keputusan eksplisit
      if (decision) {
        if (decision.status === 'Lulus') {
          countLulus++;
          return {
            ...s,
            status: 'Lulus',
            kelas: 'Alumni (Lulus)',
            tahunLulus: tahunLama,
            poinPelanggaran: resetPoinPelanggaran ? 0 : s.poinPelanggaran,
            catatan: decision.catatan || s.catatan || 'Lulus dari MA Plus Ma\'hadul Muta\'allimin',
            riwayatKelas: [...existingHistory, { ...historyRecord, status: 'Lulus' }]
          };
        } else if (decision.status === 'Naik') {
          countNaik++;
          const target = decision.kelasTujuan || (
            s.kelas.includes('XI') ? s.kelas.replace('XI', 'XII') : s.kelas.replace('X', 'XI')
          );
          return {
            ...s,
            status: 'Aktif',
            kelas: target,
            poinPelanggaran: resetPoinPelanggaran ? 0 : s.poinPelanggaran,
            catatan: decision.catatan || s.catatan,
            riwayatKelas: [...existingHistory, { ...historyRecord, status: `Naik ke ${target}` }]
          };
        } else if (decision.status === 'Tinggal') {
          countTinggal++;
          return {
            ...s,
            status: 'Aktif',
            poinPelanggaran: resetPoinPelanggaran ? 0 : s.poinPelanggaran,
            catatan: `Tinggal kelas di ${s.kelas} pada TA ${tahunAjaranBaru}. ${decision.catatan || ''}`,
            riwayatKelas: [...existingHistory, { ...historyRecord, status: `Tinggal di ${s.kelas}` }]
          };
        } else if (decision.status === 'Mutasi') {
          countMutasi++;
          return {
            ...s,
            status: 'Mutasi / Keluar',
            catatan: decision.catatan || 'Mutasi / Pindah sekolah',
            riwayatKelas: [...existingHistory, { ...historyRecord, status: 'Mutasi' }]
          };
        }
      }

      // Default jika tidak ada override:
      if (s.kelas.includes('XII')) {
        countLulus++;
        return {
          ...s,
          status: 'Lulus',
          kelas: 'Alumni (Lulus)',
          tahunLulus: tahunLama,
          poinPelanggaran: resetPoinPelanggaran ? 0 : s.poinPelanggaran,
          riwayatKelas: [...existingHistory, { ...historyRecord, status: 'Lulus' }]
        };
      } else if (s.kelas.includes('XI')) {
        countNaik++;
        const target = s.kelas.replace('XI', 'XII');
        return {
          ...s,
          status: 'Aktif',
          kelas: target,
          poinPelanggaran: resetPoinPelanggaran ? 0 : s.poinPelanggaran,
          riwayatKelas: [...existingHistory, { ...historyRecord, status: `Naik ke ${target}` }]
        };
      } else if (s.kelas.includes('X')) {
        countNaik++;
        const target = s.kelas.replace('X', 'XI');
        return {
          ...s,
          status: 'Aktif',
          kelas: target,
          poinPelanggaran: resetPoinPelanggaran ? 0 : s.poinPelanggaran,
          riwayatKelas: [...existingHistory, { ...historyRecord, status: `Naik ke ${target}` }]
        };
      }

      return s;
    });

    setSiswas(updatedSiswas);
    try {
      localStorage.setItem('maplus_siswa_list', JSON.stringify(updatedSiswas));
    } catch {}

    const updatedInfo = {
      ...madrasahInfo,
      tahunAjaranAktif: tahunAjaranBaru,
      semesterAktif: semesterBaru
    };
    setMadrasahInfo(updatedInfo);
    try {
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(updatedInfo));
    } catch {}

    // Reset data transaksi operasional jika dicentang
    if (resetPresensiHarian) {
      setGuruTidakMasukList([]);
      setMonitoringKBMList([]);
      setSiswaTidakMasukList([]);
      setSiswaTerlambatList([]);
      setIzinKeluarList([]);
      setTugasKhususList([]);
      setPelanggaranList([]);
      setKendalaList([]);
      setLaporanPiketList([]);
      try {
        localStorage.setItem('maplus_guru_tidak_masuk', JSON.stringify([]));
        localStorage.setItem('maplus_monitoring_kbm', JSON.stringify([]));
        localStorage.setItem('maplus_siswa_tidak_masuk', JSON.stringify([]));
        localStorage.setItem('maplus_siswa_terlambat', JSON.stringify([]));
        localStorage.setItem('maplus_izin_keluar', JSON.stringify([]));
        localStorage.setItem('maplus_tugas_khusus', JSON.stringify([]));
        localStorage.setItem('maplus_pelanggaran', JSON.stringify([]));
        localStorage.setItem('maplus_kendala', JSON.stringify([]));
        localStorage.setItem('maplus_laporan_piket', JSON.stringify([]));
      } catch {}
    }

    const historyRecord: RiwayatPergantianTahun = {
      id: `rta-${Date.now()}`,
      tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      tahunLama,
      semesterLama,
      tahunBaru: tahunAjaranBaru,
      semesterBaru,
      totalSiswaLulus: countLulus,
      totalSiswaNaikKelas: countNaik,
      totalSiswaTinggal: countTinggal,
      totalSiswaMutasi: countMutasi,
      totalSiswaSebelum: siswas.length,
      totalSiswaSesudah: updatedSiswas.filter(s => s.status === 'Aktif').length,
      diprosesOleh: currentUser?.namaLengkap || 'Administrator',
      catatan: catatanPergantian || `Pergantian tahun ajaran resmi dari ${tahunLama} ke ${tahunAjaranBaru} (${semesterBaru}).`,
      snapshotSiswaJson
    };

    setRiwayatTahunAjaranList(prev => [historyRecord, ...prev]);

    return {
      success: true,
      message: `Pergantian Tahun Ajaran ke ${tahunAjaranBaru} (${semesterBaru}) berhasil! ${countLulus} Siswa Lulus, ${countNaik} Siswa Naik Kelas.`,
      summary: {
        tahunBaru: tahunAjaranBaru,
        semesterBaru,
        countLulus,
        countNaik,
        countTinggal,
        countMutasi,
        totalAktif: updatedSiswas.filter(s => s.status === 'Aktif').length
      }
    };
  };

  // Rollback Pergantian Tahun
  const rollbackPergantianTahun = (historyId: string) => {
    const record = riwayatTahunAjaranList.find(r => r.id === historyId);
    if (!record || !record.snapshotSiswaJson) {
      alertError('Gagal Rollback', 'Data snapshot siswa untuk riwayat ini tidak tersedia.');
      return { success: false, message: 'Snapshot tidak tersedia' };
    }

    try {
      const restored = JSON.parse(record.snapshotSiswaJson);
      setSiswas(restored);
      localStorage.setItem('maplus_siswa_list', JSON.stringify(restored));

      const revertedInfo = {
        ...madrasahInfo,
        tahunAjaranAktif: record.tahunLama,
        semesterAktif: (record.semesterLama === 'Genap' ? 'Genap' : 'Gasal') as 'Gasal' | 'Genap'
      };
      setMadrasahInfo(revertedInfo);
      localStorage.setItem('maplus_madrasah_info', JSON.stringify(revertedInfo));

      setRiwayatTahunAjaranList(prev => prev.filter(r => r.id !== historyId));

      alertSuccess('Rollback Berhasil', `Data santri berhasil dipulihkan ke kondisi Tahun Ajaran ${record.tahunLama} (${record.semesterLama}).`);
      return { success: true, message: 'Berhasil dikembalikan' };
    } catch (e: any) {
      alertError('Gagal Rollback', e.message || 'Terjadi kesalahan saat memulihkan data.');
      return { success: false, message: e.message };
    }
  };

  const addGuru = (guru: any) => setGurus(prev => [guru, ...prev]);
  const updateGuru = (id: string, guru: any) =>
    setGurus(prev => prev.map(g => (g.id === id ? { ...g, ...guru } : g)));
  const deleteGuru = (id: string) => setGurus(prev => prev.filter(g => g.id !== id));

  const addSiswa = (siswa: any) => setSiswas(prev => [siswa, ...prev]);
  const updateSiswa = (id: string, siswa: any) =>
    setSiswas(prev => prev.map(s => (s.id === id ? { ...s, ...siswa } : s)));
  const deleteSiswa = (id: string) => setSiswas(prev => prev.filter(s => s.id !== id));

  const addKelas = (kelas: any) => {
    const newItem: Kelas = {
      id: kelas.id || `k-${Date.now()}`,
      nama: kelas.nama,
      tingkat: kelas.tingkat || 'X',
      waliKelas: kelas.waliKelas || 'Belum Ditentukan',
      jumlahSiswa: Number(kelas.jumlahSiswa) || 30,
      kapasitas: Number(kelas.kapasitas) || 32,
      ruang: kelas.ruang || 'Ruang Teori'
    };
    setKelasList(prev => [newItem, ...prev]);
  };

  const updateKelas = (id: string, kelas: any) =>
    setKelasList(prev => prev.map(k => (k.id === id ? { ...k, ...kelas } : k)));

  const deleteKelas = (id: string) => setKelasList(prev => prev.filter(k => k.id !== id));

  const addMapel = (mapel: any) => {
    const newItem: MataPelajaran = {
      id: mapel.id || `m-${Date.now()}`,
      kode: mapel.kode || `MP-${Math.floor(100 + Math.random() * 900)}`,
      nama: mapel.nama,
      kelompok: mapel.kelompok || 'Kelompok A (Umum)',
      jamPekan: Number(mapel.jamPekan) || 2,
      kkm: Number(mapel.kkm) || 75
    };
    setMapelList(prev => [newItem, ...prev]);
  };

  const updateMapel = (id: string, mapel: any) =>
    setMapelList(prev => prev.map(m => (m.id === id ? { ...m, ...mapel } : m)));

  const deleteMapel = (id: string) => setMapelList(prev => prev.filter(m => m.id !== id));

  const addRuang = (ruang: any) => {
    const newItem: RuangLokasi = {
      id: ruang.id || `r-${Date.now()}`,
      kode: ruang.kode || `R-${Math.floor(10 + Math.random() * 90)}`,
      nama: ruang.nama,
      gedung: ruang.gedung || 'Gedung Utama',
      kapasitas: Number(ruang.kapasitas) || 32,
      kondisi: ruang.kondisi || 'Baik',
      tipe: ruang.tipe || 'Ruang Kelas Teori'
    };
    setRuangList(prev => [newItem, ...prev]);
  };

  const updateRuang = (id: string, ruang: any) =>
    setRuangList(prev => prev.map(r => (r.id === id ? { ...r, ...ruang } : r)));

  const deleteRuang = (id: string) => setRuangList(prev => prev.filter(r => r.id !== id));

  const addJadwalKBM = (data: Partial<JadwalKBM>) => {
    const newItem: JadwalKBM = {
      id: data.id || `jk-${Date.now()}`,
      hari: data.hari || 'Senin',
      jamKe: data.jamKe || 1,
      waktuMulai: data.waktuMulai || '07:00',
      waktuSelesai: data.waktuSelesai || '07:45',
      kelas: data.kelas || 'XA',
      mapel: data.mapel || 'Mata Pelajaran',
      guru: data.guru || data.guruPengajar || 'Guru Pengajar',
      guruPengajar: data.guruPengajar || data.guru || 'Guru Pengajar',
      ruang: data.ruang || 'Ruang Kelas',
      status: 'Aktif'
    };
    setJadwalKBMList(prev => [newItem, ...prev]);
  };

  const updateJadwalKBM = (id: string, data: Partial<JadwalKBM>) => {
    setJadwalKBMList(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              ...data,
              guru: data.guru || data.guruPengajar || item.guru,
              guruPengajar: data.guruPengajar || data.guru || item.guruPengajar
            }
          : item
      )
    );
  };

  const deleteJadwalKBM = (id: string) => {
    setJadwalKBMList(prev => prev.filter(item => item.id !== id));
  };

  const addJadwalPiket = (data: Partial<JadwalGuruPiket>) => {
    const newItem: any = {
      id: data.id || `jp-${Date.now()}`,
      hari: data.hari || 'Senin',
      koordinator: data.koordinator || 'Zainal Arifin, S.Pd',
      guruPiket1: data.koordinator || 'Zainal Arifin, S.Pd',
      guruPiket2: (data.anggota && data.anggota[0]) || 'Ahmad Setiawan, S.Pd',
      anggota: data.anggota || ['Ahmad Setiawan, S.Pd', 'Siti Fatimah, S.Pd'],
      jamMulai: data.jamMulai || '06:45',
      jamSelesai: data.jamSelesai || '14:30',
      fokusTugas: data.fokusTugas || 'Penyambutan santri, Presensi KBM, Izin Keluar & MBG',
      status: 'Aktif'
    };
    setJadwalPiketList(prev => {
      const filtered = prev.filter(p => p.hari !== data.hari);
      return [...filtered, newItem];
    });
  };

  const updateJadwalPiket = (id: string, data: Partial<JadwalGuruPiket>) => {
    setJadwalPiketList(prev =>
      prev.map(item =>
        item.id === id || item.hari === data.hari
          ? {
              ...item,
              ...data,
              guruPiket1: data.koordinator || item.koordinator || item.guruPiket1,
              koordinator: data.koordinator || item.koordinator
            }
          : item
      )
    );
  };

  const deleteJadwalPiket = (id: string) => {
    setJadwalPiketList(prev => prev.filter(item => item.id !== id));
  };

  const addUser = (newUser: any) => {
    setUsers(prev => [newUser, ...prev]);
  };

  const updateUser = (id: string, updatedUser: any) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, ...updatedUser } : u)));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  // Global Popup Implementation
  const showPopup = (config: PopupConfig) => {
    setPopupConfig(config);
  };

  const closePopup = () => {
    setPopupConfig(null);
  };

  const confirmAction = ({
    title,
    message,
    confirmText,
    cancelText,
    isDanger = false,
    onConfirm
  }: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }) => {
    setPopupConfig({
      type: isDanger ? 'delete' : 'confirm',
      title,
      message,
      confirmText: confirmText || (isDanger ? 'Ya, Hapus Data' : 'OK, Lanjutkan'),
      cancelText: cancelText || 'Batal',
      showCancel: true,
      onConfirm
    });
  };

  const alertSuccess = (title: string, message: string) => {
    setPopupConfig({
      type: 'success',
      title,
      message,
      confirmText: 'OK, Selesai',
      showCancel: false
    });
  };

  const alertError = (title: string, message: string) => {
    setPopupConfig({
      type: 'error',
      title,
      message,
      confirmText: 'Tutup',
      showCancel: false
    });
  };

  const alertInfo = (title: string, message: string) => {
    setPopupConfig({
      type: 'info',
      title,
      message,
      confirmText: 'Mengerti',
      showCancel: false
    });
  };

  // Secure Authentication Engine
  const login = (usernameInput: string, passwordInput: string) => {
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // Find account by username, email, or role keywords
    const matchedUser = users.find(u => {
      const uName = u.username.toLowerCase();
      const uEmail = u.email.toLowerCase();
      if (uName === cleanUser || uEmail === cleanUser) return true;
      if (cleanUser === 'admin' && (uName === 'ahmad' || u.role === 'Administrator')) return true;
      if (cleanUser === 'kepala' && (uName === 'kepala' || u.role === 'Kepala Madrasah')) return true;
      if (cleanUser === 'piket' && (uName === 'zainal' || u.role === 'Guru Piket')) return true;
      return false;
    });

    if (!matchedUser) {
      return {
        success: false,
        message: 'Username / NIP tidak terdaftar dalam sistem madrasah. Silakan periksa kembali akun Anda.'
      };
    }

    const expectedPassword = matchedUser.password || (
      matchedUser.role === 'Administrator' ? 'admin123' :
      matchedUser.role === 'Kepala Madrasah' ? 'kepala123' :
      'piket123'
    );

    if (cleanPass !== expectedPassword) {
      return {
        success: false,
        message: `Kata sandi (password) salah untuk akun "${matchedUser.namaLengkap}". Pastikan memasukkan kata sandi yang valid.`
      };
    }

    setCurrentUser(matchedUser);
    setIsLoggedIn(true);
    setActiveView('dashboard');
    return {
      success: true,
      message: `Login berhasil! Selamat bertugas di MA PLUS Ma'hadul Muta'allimin.`,
      user: matchedUser
    };
  };

  const logout = () => {
    setIsLoggedIn(false);
  };

  const addSiswaTidakMasuk = (data: any) => {
    setSiswaTidakMasukList(prev => [data, ...prev]);
  };

  const saveMonitoringKBM = (data: Partial<MonitoringKBMRecord> & { kelas: string; jamKe: number }) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setMonitoringKBMList(prev => {
      let updated: MonitoringKBMRecord[];
      const existingIdx = prev.findIndex(item => item.kelas === data.kelas && Number(item.jamKe) === Number(data.jamKe));
      if (existingIdx >= 0) {
        updated = [...prev];
        updated[existingIdx] = {
          ...updated[existingIdx],
          ...data,
          waktuCek: timeStr,
          statusIsi: 'Sudah diisi'
        };
      } else {
        const newItem: MonitoringKBMRecord = {
          id: data.id || `mk-${Date.now()}`,
          jamKe: data.jamKe,
          waktu: data.waktu || '07:00 - 07:45',
          kelas: data.kelas,
          mapel: data.mapel || 'Matematika',
          guruJadwal: data.guruJadwal || 'Ahmad Setiawan, S.Pd',
          guruPengganti: data.guruPengganti,
          statusGuru: data.statusGuru || 'Hadir Tepat Waktu',
          kondisiPembelajaran: data.kondisiPembelajaran || 'Berlangsung dengan baik',
          kondisiSiswa: data.kondisiSiswa || 'Tertib',
          catatan: data.catatan || '',
          waktuCek: timeStr,
          statusIsi: 'Sudah diisi',
          notifikasiPeringatanTerkirim: data.notifikasiPeringatanTerkirim,
          waktuKirimPeringatan: data.waktuKirimPeringatan,
          pesanPeringatan: data.pesanPeringatan,
          menitTerlambat: data.menitTerlambat
        };
        updated = [newItem, ...prev];
      }

      try {
        localStorage.setItem('maplus_monitoring_kbm', JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const confirmTeacherKBMArrival = (recordId: string, payload: {
    fotoBuktiKelas: string;
    catatan?: string;
    waktuKonfirmasiHadir?: string;
    menitTerlambat?: number;
    kelas?: string;
    jamKe?: number;
    guruNama?: string;
    mapel?: string;
  }) => {
    const now = new Date();
    const timeStr = payload.waktuKonfirmasiHadir || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;
    const minutesLate = payload.menitTerlambat ?? 15;

    setMonitoringKBMList(prev => {
      let found = false;
      const updated = prev.map(rec => {
        const isMatch =
          rec.id === recordId ||
          (payload.kelas && rec.kelas === payload.kelas && payload.jamKe && Number(rec.jamKe) === Number(payload.jamKe));

        if (isMatch) {
          found = true;
          return {
            ...rec,
            dikonfirmasiGuru: true,
            waktuKonfirmasiHadir: timeStr,
            menitTerlambat: minutesLate,
            fotoBuktiKelas: payload.fotoBuktiKelas,
            catatanKonfirmasiGuru: payload.catatan,
            statusGuru: `Hadir Terlambat (${minutesLate} Menit) - Terverifikasi Foto`,
            statusIsi: 'Sudah diisi' as const
          };
        }
        return rec;
      });

      let finalResult = updated;
      if (!found && payload.kelas) {
        const newRecord: MonitoringKBMRecord = {
          id: recordId || `mk-${Date.now()}`,
          jamKe: payload.jamKe || 1,
          waktu: '07:00 - 07:45',
          kelas: payload.kelas,
          mapel: payload.mapel || 'Mata Pelajaran',
          guruJadwal: payload.guruNama || 'Guru Pengajar',
          statusGuru: `Hadir Terlambat (${minutesLate} Menit) - Terverifikasi Foto`,
          statusIsi: 'Sudah diisi' as const,
          kondisiPembelajaran: 'Berlangsung dengan baik',
          kondisiSiswa: 'Tertib',
          catatan: payload.catatan || 'Dikonfirmasi mandiri oleh guru dengan bukti foto',
          waktuCek: timeStr,
          dikonfirmasiGuru: true,
          waktuKonfirmasiHadir: timeStr,
          fotoBuktiKelas: payload.fotoBuktiKelas,
          catatanKonfirmasiGuru: payload.catatan,
          menitTerlambat: minutesLate
        };
        finalResult = [newRecord, ...updated];
      }

      try {
        localStorage.setItem('maplus_monitoring_kbm', JSON.stringify(finalResult));
      } catch {}

      return finalResult;
    });
  };

  const updateKendalaStatus = (id: string, status: any, tindakLanjut?: string) => {
    setKendalaList(prev =>
      prev.map(k => (k.id === id ? { ...k, status, tindakLanjutNote: tindakLanjut } : k))
    );
  };

  const updateLaporanStatus = (id: string, status: any, catatan?: string) => {
    setLaporanPiketList(prev =>
      prev.map(l => (l.id === id ? { ...l, status, catatanKepala: catatan } : l))
    );
  };

  const addPengumuman = (p: any) => {
    const item: PengumumanData = {
      id: p.id || `p-${Date.now()}`,
      no: pengumumanList.length + 1,
      tanggalTerbit: p.tanggal || '04 Sep 2026',
      judul: p.judul,
      isi: p.isi,
      targetPenerima: [p.target || 'Semua'],
      status: 'Terkirim',
      terkirimCount: 42,
      dibacaCount: 38,
      dibacaPersen: 90,
      kirimWa: true
    };
    setPengumumanList(prev => [item, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        isLoggedIn,
        setIsLoggedIn,
        activeView,
        setActiveView,
        activeTabSub,
        setActiveTabSub,
        isPublicReportOpen,
        setIsPublicReportOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        toggleMobileSidebar,
        gurus,
        guruList: gurus,
        setGurus,
        siswas,
        siswaList: siswas,
        setSiswas,
        userList: users,
        kelasList,
        setKelasList,
        mapelList,
        setMapelList,
        ruangList,
        setRuangList,
        jadwalKBMList,
        setJadwalKBMList,
        jadwalPiketList,
        jadwalGuruPiketList: jadwalPiketList,
        setJadwalPiketList,
        guruTidakMasukList,
        setGuruTidakMasukList,
        monitoringKBMList,
        setMonitoringKBMList,
        siswaTidakMasukList,
        setSiswaTidakMasukList,
        siswaTerlambatList,
        setSiswaTerlambatList,
        izinKeluarList,
        setIzinKeluarList,
        tugasKhususList,
        setTugasKhususList,
        pelanggaranList,
        setPelanggaranList,
        kendalaList,
        setKendalaList,
        laporanPiketList,
        laporanList: laporanPiketList,
        setLaporanPiketList,
        pengumumanList,
        setPengumumanList,
        madrasahInfo,
        setMadrasahInfo,
        updateMadrasahInfo,
        resetMadrasahLogo,
        switchRole,
        assignSubstituteTeacher,
        markSiswaReturned,
        markTugasKhususReturned,
        addKendala,
        addPelanggaran,
        addIzinKeluar,
        addGuruTidakMasuk,
        submitPiketReportToKepala,
        verifyPiketReportByKepala: (reportId: string, status: 'Diterima' | 'Ditolak', catatan: string) => {
          setLaporanPiketList(prev => prev.map(rep => {
            if (rep.id === reportId) {
              return {
                ...rep,
                status,
                catatanKepala: catatan,
                tanggalVerifikasi: '4 Sep 2026 14:15',
                tandaTanganKepala: status === 'Diterima'
              };
            }
            return rep;
          }));
        },
        addGuru,
        updateGuru,
        deleteGuru,
        addSiswa,
        updateSiswa,
        deleteSiswa,
        addKelas,
        updateKelas,
        deleteKelas,
        addMapel,
        updateMapel,
        deleteMapel,
        addRuang,
        updateRuang,
        deleteRuang,
        addJadwalKBM,
        updateJadwalKBM,
        deleteJadwalKBM,
        addJadwalPiket,
        updateJadwalPiket,
        deleteJadwalPiket,
        purgeDummyData,
        kosongkanMasterData,
        muatMasterDataResmi,
        addUser,
        updateUser,
        deleteUser,
        addSiswaTidakMasuk,
        saveMonitoringKBM,
        confirmTeacherKBMArrival,
        updateKendalaStatus,
        updateLaporanStatus,
        addPengumuman,
        cutOffPulangAwalList,
        setCutOffPulangAwalList,
        tambahCutOffPulangAwal,
        batalkanCutOffPulangAwal,
        localWisdomList,
        setLocalWisdomList,
        updateLocalWisdomStatus,
        generateWaTextLocalWisdom,
        masterKategoriList,
        setMasterKategoriList,
        tambahMasterKategori,
        editMasterKategori,
        hapusMasterKategori,
        tindakSiswaTerlambat,
        catatSiswaTidakMasukJam1,
        activeIzinLuarCount,
        activeIzinKamarMandiCount,
        maxKuotaLuarLingkungan,
        maxKuotaKamarMandi,
        popupConfig,
        showPopup,
        closePopup,
        confirmAction,
        alertSuccess,
        alertError,
        alertInfo,
        login,
        logout,
        tahunAjaranAktif,
        semesterAktif,
        riwayatTahunAjaranList,
        gantiSemester,
        updateTahunAjaranManual,
        prosesKenaikanKelasDanKelulusan,
        rollbackPergantianTahun
      }}
    >
      {children}
      <GlobalModalPopup config={popupConfig} onClose={closePopup} />
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
