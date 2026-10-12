export type UserRole = 'Administrator' | 'Guru Piket' | 'Kepala Madrasah' | 'Guru' | 'Wali Kelas' | 'Tata Usaha' | 'BK' | 'Operator' | 'IT Support';

export interface UserAccount {
  id: string;
  namaLengkap: string;
  username: string;
  password?: string;
  email: string;
  role: UserRole;
  unit?: string;
  status: 'Aktif' | 'Nonaktif';
  terakhirLogin: string;
  avatarUrl?: string;
  avatar?: string;
}

export interface Guru {
  id: string;
  no?: number;
  nip: string;
  nuptk?: string;
  nama: string;
  gelar?: string;
  jabatan?: string;
  mataPelajaran: any;
  status: any;
  jenisKelamin: any;
  tempatLahir?: string;
  tanggalLahir?: string;
  agama?: string;
  statusKepegawaian: any;
  tanggalMasuk?: string;
  alamat?: string;
  email: string;
  noHp: string;
  avatarUrl?: string;
  foto?: string;
  kehadiranBulanIni?: {
    hadir: number;
    total: number;
    persen: number;
  };
  tugasKhusus?: string;
  mapelUtama?: string;
}

export interface Siswa {
  id: string;
  no?: number;
  nis: string;
  nisn?: string;
  nama: string;
  kelas: string;
  tingkat?: any;
  jenisKelamin: any;
  status: any;
  tempatLahir?: string;
  tanggalLahir?: string;
  agama?: string;
  tahunMasuk?: string;
  alamat?: string;
  namaWali?: string;
  noHpWali?: string;
  catatan?: string;
  penerimaMBG?: boolean;
  poinPelanggaran?: number;
  statusHariIni?: 'Hadir' | 'Tidak Masuk' | 'Terlambat' | 'Izin';
  alasanTidakMasuk?: 'Sakit' | 'Izin' | 'Alpa';
  kehadiranBulanIni?: {
    hadir: number;
    total: number;
    persen: number;
  };
  pelanggaranCount?: number;
  prestasi?: string;
  avatarUrl?: string;
  foto?: string;
  tahunLulus?: string;
  riwayatKelas?: { tahunAjaran: string; kelas: string; status: string; tanggal?: string }[];
}

export interface Kelas {
  id: string;
  no?: number;
  nama: string;
  tingkat: any;
  waliKelas: string;
  jumlahSiswa: number;
  kapasitas: number;
  ruang?: string;
  ruangan?: string;
  ketuaKelas?: string;
  status?: 'Aktif' | 'Nonaktif';
  keterangan?: string;
  tahunAjaran?: string;
  urutan?: number;
  kode?: string;
}

export interface MataPelajaran {
  id: string;
  no?: number;
  kode: string;
  nama: string;
  kelompok: any;
  tingkat?: string[];
  kkm?: number;
  jamPekan?: number;
  status?: 'Aktif' | 'Nonaktif';
  keterangan?: string;
}

export interface RuangLokasi {
  id: string;
  no?: number;
  kode: string;
  nama: string;
  kategori?: any;
  tipe?: string;
  jenis?: string;
  kondisi?: string;
  kapasitas: number;
  gedung: string;
  status?: 'Aktif' | 'Nonaktif';
  keterangan?: string;
}

export interface JadwalKBM {
  id: string;
  no?: number;
  hari: any;
  jamKe: any;
  waktuMulai: string;
  waktuSelesai: string;
  kelas: string;
  mapel: string;
  guruPengajar?: string;
  guru?: string;
  ruang: string;
  status?: 'Aktif' | 'Nonaktif';
  keterangan?: string;
}

export interface JadwalGuruPiket {
  id: string;
  no?: number;
  tanggal?: string;
  hari: any;
  guruPiket1?: string;
  guruPiket2?: string;
  koordinator?: string;
  anggota?: string[];
  jamMulai?: string;
  jamSelesai?: string;
  fokusTugas?: string;
  status?: any;
  keterangan?: string;
}

export interface GuruTidakMasukItem {
  id: string;
  tanggal: string;
  guruNama: string;
  alasan: 'Sakit' | 'Dinas Luar' | 'Terlambat' | 'Lainnya' | 'Urusan Keluarga';
  keterangan: string;
  totalJadwal: number;
  belumAdaPengganti: number;
  jadwalTerdampak: {
    jamKe: number;
    kelas: string;
    mapel: string;
    tugas: string;
    fileName?: string;
    guruPengganti?: string;
    catatan?: string;
    status: 'Belum Ada' | 'Ditetapkan' | 'Sedang Mengganti' | 'Dibatalkan';
  }[];
}

export interface MonitoringKBMRecord {
  id: string;
  jamKe: number;
  waktu: string;
  kelas: string;
  mapel: string;
  guruJadwal: string;
  guruPengganti?: string;
  statusGuru: string;
  kondisiPembelajaran: string;
  kondisiSiswa: string;
  catatan?: string;
  waktuCek: string;
  statusIsi: 'Sudah diisi' | 'Belum diisi';
  // Fitur pengingat & konfirmasi kehadiran guru terlambat
  notifikasiPeringatanTerkirim?: boolean;
  waktuKirimPeringatan?: string;
  pesanPeringatan?: string;
  dikonfirmasiGuru?: boolean;
  waktuKonfirmasiHadir?: string;
  menitTerlambat?: number;
  fotoBuktiKelas?: string;
  catatanKonfirmasiGuru?: string;
}

export interface SiswaTidakMasukData {
  id: string;
  nama: string;
  kelas: string;
  status: 'Sakit' | 'Izin' | 'Alpa';
  keterangan?: string;
  tanggal: string;
}

export interface SiswaTerlambatData {
  id: string;
  no: number;
  nama: string;
  kelas: string;
  waktuTerlambat: string;
  menitTerlambat: number;
  jamKe: number;
  keterangan: string;
  dicatatOleh: string;
  tindakan: 'Teguran' | 'Dicatat' | 'Pembinaan' | 'Panggil Orang Tua' | 'Belum Ditindak';
  statusRekapKehadiran?: 'Hadir (Selesai Ditindak)' | 'Belum Ditindak' | 'Tidak Hadir';
  statusKehadiranRekap?: string;
  sudahDitindak?: boolean;
  tanggal: string;
}

export interface IzinKeluarData {
  id: string;
  no: number;
  nama: string;
  kelas: string;
  tujuan: 'Ke Puskesmas' | 'Urusan Keluarga' | 'Ke UKS' | 'Ke Bank' | 'Izin Pulang' | 'Ke Kamar Mandi' | 'Lainnya';
  jenisIzin: string;
  kategoriTempat?: 'Luar Lingkungan' | 'Kamar Mandi' | 'Lingkungan Sekolah';
  waktuKeluar: string;
  estimasiKembali: string;
  waktuKembali?: string;
  durasi?: string;
  pendamping?: string; // Pendamping (misal teman ke kamar mandi berdua atau pengantar)
  noHp?: string;
  keterangan?: string;
  status: 'Masih Keluar' | 'Kembali' | 'Lewat Batas Waktu';
  dicatatOleh: string;
  tanggal: string;
}

export interface CutOffPulangAwal {
  id: string;
  tipe: 'Massal' | 'Per Rombel';
  kelasTerdampak: string[];
  jamCutOff: string;
  alasan: string;
  keterangan?: string;
  noDispensasi?: string;
  tanggal: string;
  dibuatOleh: string;
  status: 'Aktif' | 'Selesai';
}

export interface LocalWisdomSession {
  id: string;
  hari: 'Senin' | 'Selasa' | 'Rabu' | 'Kamis' | 'Jumat' | 'Sabtu';
  tingkatKelas: string; // 'Kelas 10' | 'Kelas 11' | 'Kelas 12'
  jurusan: string; // 'IT / TIK' | 'Teknik Otomotif (TKRO)' | 'Tata Busana' | 'Tata Boga'
  lokasi: string; // 'Lab TIK' | 'Bengkel TKRO' | 'Ruang Jahit BLK' | 'Dapur Tata Boga'
  instruktur: string;
  noWaInstruktur: string;
  jumlahSiswa: number;
  statusKonfirmasi: 'Menunggu Konfirmasi' | 'Hadir Lengkap' | 'Ada Siswa Absen' | 'Selesai';
  waktuKonfirmasi?: string;
  catatanInstruktur?: string;
}

export interface MasterKategoriItem {
  id: string;
  nama: string;
  grup: 'Izin Keluar' | 'Program Tugas Khusus' | 'Tindakan Terlambat' | 'Program Madrasah' | 'Kendala' | 'Bobot Pelanggaran' | 'Kendala Sarpras';
  jenis?: string;
  jam?: string;
  kuota?: number;
  keterangan?: string;
  bobotPoin?: number;
}

export interface SiswaTugasKhususData {
  id: string;
  no: number;
  nis: string;
  nama: string;
  kelas: string;
  program: 'Tahfidz Al-Qur\'an' | 'Perpustakaan' | 'Tim IT Madrasah' | 'Kader Adiwiyata' | 'Utusan Lomba' | 'Utusan Kegiatan' | 'Duta Literasi';
  jenis: 'Program Tetap' | 'Insidental';
  statusProgram: 'Aktif' | 'Nonaktif';
  mulaiTugas: string;
  laporSelesai?: string;
  batasKembali?: string;
  kembali?: string;
  statusHariIni: 'Sedang Bertugas' | 'Dalam waktu kembali' | 'Selesai (Tepat Waktu)' | 'Melebihi Waktu (+12 menit)' | 'Belum mulai';
  catatan?: string;
  pembimbing: string;
}

export interface PelanggaranSiswaData {
  id: string;
  no: number;
  nis: string;
  waktu: string;
  nama: string;
  kelas: string;
  jenisPelanggaran: 'Terlambat' | 'Tidak Memakai Atribut' | 'Tidak Masuk KBM' | 'Melanggar Tata Tertib' | 'Lainnya' | 'Bermain HP';
  tingkat: 'Ringan' | 'Sedang' | 'Berat';
  poin: number;
  keterangan: string;
  dicatatOleh: string;
  tindakan: 'Teguran' | 'Dicatat' | 'Peringatan' | 'Panggil Orang Tua' | 'Pembinaan Khusus';
  buktiFotoUrl?: string;
  tanggal: string;
}

export interface LaporKendalaData {
  id: string;
  no: number;
  noTiket?: string;
  tanggalWaktu: string;
  kategori: 'Fasilitas' | 'Kebersihan' | 'Keamanan' | 'KBM' | 'Kedisiplinan' | 'Teknologi' | 'Lainnya';
  judulKendala: string;
  lokasi: string;
  pelapor: string;
  status: 'Dalam Proses' | 'Sudah Ditindaklanjuti' | 'Perlu Tindak Lanjut' | 'Menunggu';
  prioritas: 'Rendah' | 'Sedang' | 'Tinggi' | 'Normal';
  deskripsi: string;
  fotoUrls?: string[];
  tujukanKepada?: string;
  tindakLanjutNote?: string;
  riwayatTindakLanjut: {
    waktu: string;
    keterangan: string;
    oleh?: string;
  }[];
  terverifikasiKepala?: boolean;
}

export interface LaporanGuruPiketData {
  id: string;
  no: number;
  tanggal: string;
  hari: string;
  guruPiket: string;
  shift: 'Pagi' | 'Sore';
  waktuKirim: string;
  ringkasan: string;
  status: 'Diterima' | 'Ditolak' | 'Menunggu';
  kelasDimonitor: string;
  guruTidakMasukCount: number;
  guruPenggantiCount: number;
  siswaTidakMasukCount: number;
  siswaTerlambatCount: number;
  siswaTugasKhususCount: number;
  pelanggaranCount: number;
  izinKeluarCount: number;
  kendalaCount: number;
  catatanGuruPiket: string;
  kronologi: {
    waktu: string;
    kegiatan: string;
    detail: string;
    menuTerkait: string;
  }[];
  catatanKepala?: string;
  tanggalVerifikasi?: string;
  tandaTanganKepala?: boolean;
}

export interface PengumumanData {
  id: string;
  no: number;
  tanggalTerbit: string;
  judul: string;
  isi: string;
  targetPenerima: string[];
  status: 'Terkirim' | 'Terjadwal' | 'Draft';
  terkirimCount: number;
  dibacaCount: number;
  dibacaPersen: number;
  kirimWa: boolean;
}

export interface RiwayatPergantianTahun {
  id: string;
  tanggal: string;
  waktu: string;
  tahunLama: string;
  semesterLama: string;
  tahunBaru: string;
  semesterBaru: string;
  totalSiswaLulus: number;
  totalSiswaNaikKelas: number;
  totalSiswaTinggal: number;
  totalSiswaMutasi: number;
  totalSiswaSebelum: number;
  totalSiswaSesudah: number;
  diprosesOleh: string;
  catatan?: string;
  snapshotSiswaJson?: string;
}

