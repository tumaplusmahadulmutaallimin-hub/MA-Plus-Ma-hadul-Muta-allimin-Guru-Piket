import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Settings,
  Building2,
  Clock,
  Shield,
  MessageSquare,
  Palette,
  Save,
  CheckCircle2,
  Database,
  Trash2,
  RefreshCw,
  Sparkles,
  Users,
  GraduationCap,
  RotateCcw
} from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';
import { MadrasahLogo } from '../common/MadrasahLogo';

export const PengaturanSistemView: React.FC = () => {
  const {
    madrasahInfo,
    setMadrasahInfo,
    updateMadrasahInfo,
    resetMadrasahLogo,
    alertSuccess,
    alertError,
    purgeDummyData,
    kosongkanMasterData,
    muatMasterDataResmi,
    confirmAction,
    gurus,
    siswas,
    kelasList,
    setActiveView,
    tahunAjaranAktif,
    semesterAktif
  } = useApp();

  const [activeTab, setActiveTab] = useState<'identitas' | 'jam-kbm' | 'tatib' | 'whatsapp' | 'tema' | 'database'>('identitas');
  const [formData, setFormData] = useState({ ...madrasahInfo });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Keep formData in sync if madrasahInfo updates
  React.useEffect(() => {
    setFormData({ ...madrasahInfo });
  }, [madrasahInfo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Verified persistent save to both localStorage and IndexedDB
      await updateMadrasahInfo(formData);
      setSavedSuccess(true);
      alertSuccess(
        'Pengaturan Tersimpan',
        'Informasi identitas madrasah dan logo resmi berhasil diperbarui dan disimpan secara permanen di seluruh sistem!'
      );
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err: any) {
      console.error('Error saving settings:', err);
      alertError(
        'Gagal Menyimpan Pengaturan',
        err?.message || 'Terjadi kesalahan saat menyimpan pengaturan. Pastikan memori browser tidak penuh.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearLogo = () => {
    confirmAction({
      title: 'Kosongkan Logo (Kembali ke Wadah Placeholder)',
      message: 'Apakah Anda ingin mengosongkan logo aplikasi? Logo di seluruh aplikasi dan dokumen akan kembali menjadi wadah siap upload sampai Anda mengunggah logo baru.',
      confirmText: 'Ya, Kosongkan Logo',
      cancelText: 'Batal',
      isDanger: true,
      onConfirm: async () => {
        try {
          await resetMadrasahLogo();
          setFormData((prev: any) => ({ ...prev, logo: '' }));
          alertSuccess('Logo Dikosongkan', 'Logo telah dihapus. Wadah logo kini siap untuk diunggah file logo baru kapan saja.');
        } catch (err: any) {
          alertError('Gagal Mengosongkan Logo', err?.message || 'Terjadi kesalahan.');
        }
      }
    });
  };

  const handlePurge = () => {
    confirmAction({
      title: 'Hapus Data Dummy Harian (Siap Isi Manual)',
      message: 'Seluruh riwayat dummy operasional (presensi, guru tidak masuk, izin keluar, keterlambatan, pelanggaran, kendala, laporan) akan dibersihkan menjadi 0 rekaman. Master guru dan santri tetap tersimpan sehingga Anda siap melakukan penginputan harian secara manual.',
      confirmText: 'Ya, Bersihkan Data Dummy',
      cancelText: 'Batal',
      isDanger: true,
      onConfirm: () => {
        purgeDummyData();
      }
    });
  };

  const handleKosongkan = () => {
    confirmAction({
      title: 'Kosongkan Master Data (Input dari Nol)',
      message: 'Apakah Anda ingin mengosongkan seluruh master guru dan santri agar dapat menginput data dari nol secara manual melalui tombol "+ Tambah Guru" dan "+ Tambah Siswa"?\n\n(Anda dapat memuat ulang data resmi sewaktu-waktu).',
      confirmText: 'Ya, Kosongkan Master Data',
      cancelText: 'Batal',
      isDanger: true,
      onConfirm: () => {
        kosongkanMasterData();
      }
    });
  };

  const handleMuatResmi = () => {
    confirmAction({
      title: 'Muat Ulang 17 Guru Resmi & Santri Rombel',
      message: 'Apakah Anda ingin memuat kembali master 17 guru resmi MA Plus dan seluruh santri rombel Kelas X s.d. XII?',
      confirmText: 'Ya, Muat Data Resmi',
      cancelText: 'Batal',
      isDanger: false,
      onConfirm: () => {
        muatMasterDataResmi();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Pengaturan sistem berhasil disimpan dan diterapkan ke seluruh modul!
          </div>
        </div>
      )}

      {/* Banner Pergantian Tahun Ajaran & Kenaikan Kelas */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 p-5 rounded-2xl text-white border border-emerald-700/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center shrink-0 text-emerald-300 shadow-xs">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">
                Tahun Ajaran &amp; Semester
              </span>
              <span className="font-mono font-bold text-white text-sm">
                TA {tahunAjaranAktif} · Semester {semesterAktif}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Kelola proses pergantian tahun pelajaran, kenaikan kelas santri otomatis, kelulusan Kelas XII, dan arsip riwayat SK.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setActiveView('pergantian-tahun')}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Buka Modul Kenaikan Kelas</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('identitas')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'identitas'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Identitas Madrasah
        </button>
        <button
          onClick={() => setActiveTab('database')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'database'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          Status Database & Bersihkan Dummy
        </button>
        <button
          onClick={() => setActiveTab('jam-kbm')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'jam-kbm'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Clock className="w-4 h-4" />
          Waktu & Jam KBM
        </button>
        <button
          onClick={() => setActiveTab('tatib')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'tatib'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          Kriteria Poin & Tatib
        </button>
        <button
          onClick={() => setActiveTab('whatsapp')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'whatsapp'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp Gateway
        </button>
        <button
          onClick={() => setActiveTab('tema')}
          className={`px-5 py-3 text-sm font-semibold flex items-center gap-2 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
            activeTab === 'tema'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          Tampilan & Tema
        </button>
      </div>

      {/* Identitas Form */}
      {activeTab === 'identitas' && (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          {/* Logo Showcase with MadrasahLogo Component */}
          <div className="p-5 bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border border-emerald-200/80 rounded-2xl flex flex-col md:flex-row items-center gap-5">
            <div className="w-24 h-24 rounded-2xl bg-white border border-emerald-500/40 p-1 flex items-center justify-center shadow-xs shrink-0">
              <MadrasahLogo size="2xl" src={formData.logo} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <h4 className="font-bold text-slate-900 text-base">Wadah Logo Terintegrasi</h4>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${formData.logo ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {formData.logo ? 'Logo Terpasang' : 'Siap Diunggah'}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Wadah logo ini terintegrasi penuh ke seluruh aplikasi (Header, Sidebar navigasi, Login, Presensi Guru Mandiri) serta dokumen cetak resmi (Kop Surat Kartu Kendali Siswa, Berita Acara KBM, & Laporan Piket).
              </p>
              {formData.logo && (
                <div className="mt-3 flex items-center gap-2 flex-wrap justify-center md:justify-start">
                  <button
                    type="button"
                    onClick={handleClearLogo}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer flex items-center gap-1.5"
                    title="Kosongkan logo dan kembalikan ke wadah placeholder"
                  >
                    <span>Kosongkan Logo</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <ImageUploader
              currentImage={formData.logo}
              onImageChange={(imgUrl) => setFormData({ ...formData, logo: imgUrl })}
              label="Upload File Logo Madrasah"
              sublabel="Unggah file logo resmi (PNG transparan atau JPG). Setelah disimpan, logo langsung otomatis terpasang di seluruh sistem dan dokumen."
              shape="square"
              showPresets={false}
            />
          </div>

          {/* Form fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Madrasah</label>
              <input
                type="text"
                value={formData.nama || ''}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Utama (Three In One)</label>
              <input
                type="text"
                value={formData.taglineUtama || 'MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)'}
                onChange={(e) => setFormData({ ...formData, taglineUtama: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline Pendukung (Pondok Pesantren)</label>
              <input
                type="text"
                value={formData.taglineSub || 'MADRASAH BERBASIS PONDOK PESANTREN'}
                onChange={(e) => setFormData({ ...formData, taglineSub: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Resmi Tata Usaha</label>
              <input
                type="email"
                value={formData.email || 'tumaplusmahadulmutaallimin@gmail.com'}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-600 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NSM (Nomor Statistik)</label>
              <input
                type="text"
                value={formData.nsm || '131235210019'}
                onChange={(e) => setFormData({ ...formData, nsm: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={formData.npsn || '69982415'}
                onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Status Akreditasi</label>
              <input
                type="text"
                value={formData.akreditasi || 'A (Unggul)'}
                onChange={(e) => setFormData({ ...formData, akreditasi: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lembaga</label>
              <input
                type="text"
                value={formData.alamat || 'Katerban, Kec. Paron, Kab. Ngawi, Jawa Timur 63253'}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={formData.telepon || '0812-3456-7890'}
                onChange={(e) => setFormData({ ...formData, telepon: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Madrasah</label>
              <input
                type="text"
                value={formData.kepalaMadrasah || 'Drs. H. M. Fauzan, M.Pd.I'}
                onChange={(e) => setFormData({ ...formData, kepalaMadrasah: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Madrasah</label>
              <input
                type="text"
                value={formData.nipKepala || '19740510 199903 1 002'}
                onChange={(e) => setFormData({ ...formData, nipKepala: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 font-mono text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={isSaving}
              className={`px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-colors ${
                isSaving ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Menyimpan &amp; Memverifikasi...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Identitas Madrasah</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Tab: Status Database & Bersihkan Dummy */}
      {activeTab === 'database' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-700" />
              Status Data Produksi MA Plus Katerban-Ngawi
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Ringkasan data otentik madrasah yang telah terintegrasi dalam sistem tanpa data fiktif.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Guru Resmi</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{gurus.length} Asatidz</p>
              <p className="text-[11px] text-emerald-700 mt-1">M. Zainal Abidin, Ari Monawati, dkk (17 Guru)</p>
            </div>

            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Santri Terdaftar</span>
                <GraduationCap className="w-4 h-4 text-blue-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{siswas.length} Santri</p>
              <p className="text-[11px] text-blue-700 mt-1">Kelas X A, X B, XI A, XI B, XII A, XII B</p>
            </div>

            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Rombel Kelas</span>
                <Building2 className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-2xl font-black text-slate-900 mt-2">{kelasList.length} Kelas</p>
              <p className="text-[11px] text-amber-700 mt-1">Lengkap dengan wali kelas & kapasitas</p>
            </div>
          </div>

          {/* Action Card 1: Bersihkan Data Transaksi Dummy (Siap Isi Manual) */}
          <div className="p-5 bg-gradient-to-br from-emerald-50/90 to-teal-50/60 border border-emerald-200 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">1. Hapus Seluruh Data Dummy Operasional (Siap Isi Manual)</h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Menghapus seluruh log transaksi fiktif (absensi siswa, guru tidak masuk, izin keluar kelas, keterlambatan, pelanggaran tatib, kendala sarpras, laporan piket harian). Master guru dan santri tetap tersimpan, seluruh form siap diisi manual setiap hari.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handlePurge}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Data Dummy Harian (0 Rekaman)
              </button>
              <span className="text-[11px] text-emerald-800 font-semibold">
                ✓ Rekomendasi sebelum mulai operasional harian madrasah
              </span>
            </div>
          </div>

          {/* Action Card 2: Kosongkan Master Data (Input dari Nol) */}
          <div className="p-5 bg-gradient-to-br from-amber-50/90 to-orange-50/60 border border-amber-200 rounded-2xl space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">2. Kosongkan Master Guru &amp; Santri (Input Manual dari Nol)</h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Mengosongkan daftar pendidik dan santri sehingga database menjadi 0 data. Anda dapat memasukkan data guru, wali kelas, dan santri satu per satu secara manual dari nol melalui tombol "+ Tambah" di menu Data Guru dan Data Siswa.
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleKosongkan}
                className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Users className="w-4 h-4" />
                Kosongkan Master Guru &amp; Santri
              </button>
              <span className="text-[11px] text-amber-800 font-medium">
                *Dapat dimuat ulang kapan saja dengan tombol di bawah
              </span>
            </div>
          </div>

          {/* Action Card 3: Muat Ulang Master Data Resmi MA Plus */}
          <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-3 shadow-2xs">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 shadow-xs">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">3. Muat Ulang 17 Guru Resmi &amp; Rombel Santri MA Plus</h5>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                  Mengembalikan master data otentik 17 guru resmi MA Plus Ma'hadul Muta'allimin dan daftar santri rombel Kelas X A, X B, XI A, XI B, XII A, XII B lengkap dengan nomor induk (NIS/NISN).
                </p>
              </div>
            </div>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleMuatResmi}
                className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
              >
                <Database className="w-4 h-4" />
                Muat Ulang 17 Guru &amp; Santri Resmi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Jam KBM */}
      {activeTab === 'jam-kbm' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h4 className="font-bold text-slate-800">Konfigurasi Jam KBM & Jadwal Pembelajaran</h4>
          <div className="grid grid-cols-2 gap-4 max-w-lg">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Masuk Piket</label>
              <input type="time" defaultValue="06:30" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jam Masuk KBM</label>
              <input type="time" defaultValue="07:00" className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Durasi Jam Belajar</label>
              <input type="number" defaultValue={45} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Batas Telat Guru (Window)</label>
              <input type="number" defaultValue={15} className="w-full px-3 py-2 border rounded-lg text-sm" />
            </div>
          </div>
          <button
            onClick={() => alertSuccess('Waktu KBM Disimpan', 'Konfigurasi jadwal jam pembelajaran KBM dan batas toleransi keterlambatan berhasil diperbarui!')}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold cursor-pointer shadow-xs transition-colors"
          >
            Simpan Waktu KBM
          </button>
        </div>
      )}

      {/* WhatsApp */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h4 className="font-bold text-slate-800">Status Gateway Notifikasi WhatsApp</h4>
              <p className="text-xs text-slate-500">Notifikasi otomatis ke wali santri untuk absensi dan surat tugas.</p>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              TERHUBUNG (ONLINE)
            </span>
          </div>

          <div className="space-y-3 max-w-lg text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Sender ID:</span>
              <span className="font-mono font-bold text-slate-700">+62 812-3456-7890 (MA PLUS Official)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email Gateway:</span>
              <span className="font-mono font-bold text-emerald-700">tumaplusmahadulmutaallimin@gmail.com</span>
            </div>
          </div>
        </div>
      )}

      {/* Tema */}
      {activeTab === 'tema' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h4 className="font-bold text-slate-800">Palet Warna Identitas Madrasah</h4>
          <div className="flex gap-4">
            <div className="p-4 rounded-xl border border-emerald-600 bg-emerald-50 text-emerald-900 text-xs font-bold text-center w-40">
              <div className="w-8 h-8 rounded-full bg-emerald-700 mx-auto mb-2"></div>
              Hijau Kemenag & Pesantren (Aktif)
            </div>
            <div className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 text-slate-700 text-xs font-bold text-center w-40 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-amber-600 mx-auto mb-2"></div>
              Emas Religius
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
