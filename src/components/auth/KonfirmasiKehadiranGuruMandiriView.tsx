import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Camera,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Upload,
  Check,
  Building2,
  ArrowLeft,
  BookOpen,
  School,
  UserCheck,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { MadrasahLogo } from '../common/MadrasahLogo';

interface KonfirmasiKehadiranGuruMandiriViewProps {
  initialParams?: {
    recordId?: string;
    guru?: string;
    kelas?: string;
    jam?: number;
    mapel?: string;
  };
  onBack: () => void;
}

export const KonfirmasiKehadiranGuruMandiriView: React.FC<KonfirmasiKehadiranGuruMandiriViewProps> = ({
  initialParams,
  onBack
}) => {
  const { monitoringKBMList, confirmTeacherKBMArrival, gurus, alertSuccess } = useApp();
  const kelases = ['XA', 'XB', 'XC', 'XIA', 'XIB', 'XIIA', 'XIIB', 'XIIC'];

  // URL Query / Params State
  const [recordId, setRecordId] = useState<string>(initialParams?.recordId || '');
  const [guruNama, setGuruNama] = useState<string>(initialParams?.guru || '');
  const [kelas, setKelas] = useState<string>(initialParams?.kelas || 'XA');
  const [jamKe, setJamKe] = useState<number>(initialParams?.jam || 1);
  const [mapel, setMapel] = useState<string>(initialParams?.mapel || '');

  // Form inputs
  const [menitTerlambat, setMenitTerlambat] = useState<number>(15);
  const [catatan, setCatatan] = useState<string>('Sudah tiba di kelas, pembelajaran sedang berlangsung dengan tertib.');
  const [fotoBukti, setFotoBukti] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedTime, setConfirmedTime] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize from URL parameters or initialParams
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const urlRecordId = urlParams.get('konfirmasi') || urlParams.get('confirm') || urlParams.get('id') || initialParams?.recordId;
      const urlGuru = urlParams.get('guru') || initialParams?.guru;
      const urlKelas = urlParams.get('kelas') || initialParams?.kelas;
      const urlJam = urlParams.get('jam') ? Number(urlParams.get('jam')) : initialParams?.jam;
      const urlMapel = urlParams.get('mapel') || initialParams?.mapel;

      if (urlRecordId) setRecordId(urlRecordId);
      if (urlGuru) setGuruNama(urlGuru);
      if (urlKelas) setKelas(urlKelas);
      if (urlJam) setJamKe(urlJam);
      if (urlMapel) setMapel(urlMapel);

      // Try finding record in existing monitoring list
      if (urlRecordId) {
        const found = monitoringKBMList.find(m => m.id === urlRecordId);
        if (found) {
          if (found.guruJadwal) setGuruNama(found.guruJadwal);
          if (found.kelas) setKelas(found.kelas);
          if (found.jamKe) setJamKe(found.jamKe);
          if (found.mapel) setMapel(found.mapel);
          if (found.menitTerlambat) setMenitTerlambat(found.menitTerlambat);
          if (found.dikonfirmasiGuru) {
            setIsSuccess(true);
            setConfirmedTime(found.waktuKonfirmasiHadir || 'Terkonfirmasi');
            if (found.fotoBuktiKelas) setFotoBukti(found.fotoBuktiKelas);
          }
        }
      }
    }
  }, [initialParams, monitoringKBMList]);

  // Handle Photo selection from camera or file
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        if (loadEvent.target?.result) {
          setFotoBukti(loadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample photo generator for quick testing if device camera unavailable
  const handleUseSamplePhoto = (sampleIdx: number) => {
    const samples = [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80'
    ];
    setFotoBukti(samples[sampleIdx % samples.length]);
  };

  // Submit confirmation
  const handleConfirmArrival = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fotoBukti) {
      alert('Mohon lampirkan foto suasana kelas siswa sebagai bukti kehadiran.');
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} WIB`;

    const finalRecordId = recordId || `mk-${Date.now()}`;

    // Confirm in Context
    confirmTeacherKBMArrival(finalRecordId, {
      fotoBuktiKelas: fotoBukti,
      catatan,
      waktuKonfirmasiHadir: timeStr,
      menitTerlambat,
      kelas,
      jamKe,
      guruNama: guruNama || 'Guru Pengajar',
      mapel: mapel || 'Mata Pelajaran'
    });

    // Also dispatch custom event for cross-component immediate reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('maplus_kbm_confirmed', {
        detail: {
          recordId: finalRecordId,
          kelas,
          jamKe,
          menitTerlambat,
          waktu: timeStr
        }
      }));
    }

    setConfirmedTime(timeStr);
    setIsSubmitting(false);
    setIsSuccess(true);
    alertSuccess('Konfirmasi Berhasil', `Kehadiran Bapak/Ibu ${guruNama || ''} di kelas ${kelas} telah diverifikasi.`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-3 sm:p-6">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-600 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full mx-auto my-auto py-4">
        {/* Top Header Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 mb-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md shrink-0 border border-emerald-400/30">
                <MadrasahLogo size="lg" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  MA PLUS MA'HADUL MUTA'ALLIMIN
                </h1>
                <p className="text-[11px] text-amber-300 font-extrabold uppercase tracking-tight">
                  MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)
                </p>
                <p className="text-[10px] text-emerald-400 font-semibold">
                  MADRASAH BERBASIS PONDOK PESANTREN · Portal Konfirmasi Mandiri Guru
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/60 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Kembali</span>
            </button>
          </div>

          {/* Official Warning Banner (Matching exactly the requested message) */}
          <div className="p-4 bg-amber-500/15 border border-amber-500/40 rounded-xl text-amber-200 mb-2">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm space-y-1.5">
                <p className="font-extrabold text-amber-300 tracking-wider uppercase text-[11px] sm:text-xs">
                  PEMBERITAHUAN PERINGATAN
                </p>
                <p className="font-semibold text-white">
                  Kepada Bapak/Ibu <span className="text-amber-300 underline font-bold">{guruNama || 'Guru Pengajar'}</span> pengajar kelas <span className="text-amber-300 underline font-bold">{kelas}</span>
                </p>
                <p className="text-amber-100/90 leading-relaxed text-xs">
                  "Ada Kewajiban mengajar dan HAK murid untuk mendapatkan ilmu dimohon segera hadir ke kelas."
                </p>
                <p className="text-[11px] text-amber-300/80 italic">
                  Klik formulir konfirmasi di bawah ini dengan menyertakan foto suasana kelas siswa. Keterangan terlambat akan otomatis terdata di sistem monitoring KBM.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="bg-slate-800/95 border border-emerald-500/50 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider mb-2">
              Kehadiran Terverifikasi
            </span>

            <h2 className="text-xl font-bold text-white mb-2">
              Konfirmasi Kehadiran Telah Diterima!
            </h2>
            <p className="text-sm text-slate-300 mb-6 max-w-md mx-auto">
              Terima kasih Bapak/Ibu <strong className="text-white">{guruNama}</strong>. Status kehadiran di kelas <strong className="text-white">{kelas}</strong> telah diperbarui di sistem Monitoring KBM Guru Piket & Pimpinan Madrasah.
            </p>

            {/* Confirmation Summary Card */}
            <div className="bg-slate-900/80 rounded-xl p-4 text-left border border-slate-700/80 mb-6 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Guru Pengajar:</span>
                <span className="font-bold text-white">{guruNama || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Kelas & Mata Pelajaran:</span>
                <span className="font-bold text-emerald-300">{kelas} ({mapel || 'KBM'})</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Jam Pembelajaran:</span>
                <span className="font-bold text-white">Jam Ke-{jamKe}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-800">
                <span className="text-slate-400">Waktu Konfirmasi Tiba:</span>
                <span className="font-bold text-amber-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {confirmedTime || 'Hari ini'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Status Monitoring:</span>
                <span className="inline-flex items-center gap-1 font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-sm">
                  <Check className="w-3 h-3 text-emerald-400" />
                  Hadir Terlambat ({menitTerlambat} Menit) - Terkonfirmasi
                </span>
              </div>

              {fotoBukti && (
                <div className="pt-2 border-t border-slate-800">
                  <p className="text-slate-400 text-[11px] mb-2 font-medium">Foto Bukti Suasana Kelas Siswa:</p>
                  <div className="w-full h-44 rounded-lg overflow-hidden border border-slate-700 bg-black flex items-center justify-center">
                    <img src={fotoBukti} alt="Bukti Kelas" className="w-full h-full object-cover" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                type="button"
                onClick={() => setIsSuccess(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Ubah / Perbarui Data</span>
              </button>
              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-emerald-900/40 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Selesai & Ke Halaman Utama</span>
              </button>
            </div>
          </div>
        ) : (
          /* Confirmation Form */
          <form
            onSubmit={handleConfirmArrival}
            className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 sm:p-6 shadow-xl backdrop-blur-md space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60">
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Formulir Konfirmasi Kehadiran Guru
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Akses Perangkat Guru
              </span>
            </div>

            {/* Teacher and Class details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Nama Guru Pengajar <span className="text-red-400">*</span>
                </label>
                {gurus && gurus.length > 0 ? (
                  <select
                    value={guruNama}
                    onChange={(e) => setGuruNama(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  >
                    <option value="">-- Pilih Nama Guru --</option>
                    {gurus.map((g) => (
                      <option key={g.id} value={g.nama}>
                        {g.nama}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={guruNama}
                    onChange={(e) => setGuruNama(e.target.value)}
                    required
                    placeholder="Nama Lengkap Guru"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kelas yang Diajar <span className="text-red-400">*</span>
                </label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                >
                  {kelases && kelases.length > 0 ? (
                    kelases.map((k: string) => (
                      <option key={k} value={k}>
                        {k}
                      </option>
                    ))
                  ) : (
                    <>
                      <option value="X-A">X-A</option>
                      <option value="X-B">X-B</option>
                      <option value="XI-IPA">XI-IPA</option>
                      <option value="XI-IPS">XI-IPS</option>
                      <option value="XII-IPA">XII-IPA</option>
                      <option value="XII-IPS">XII-IPS</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={mapel}
                  onChange={(e) => setMapel(e.target.value)}
                  placeholder="Misal: Fiqih, Matematika, Fisika"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Jam Pelajaran Ke-
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setJamKe(num)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        jamKe === num
                          ? 'bg-emerald-600 border-emerald-500 text-white'
                          : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Delay duration selection */}
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-700/60">
              <label className="block text-xs font-semibold text-amber-300 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  Keterangan Keterlambatan Waktu Tiba:
                </span>
                <span className="text-white font-extrabold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                  {menitTerlambat} Menit
                </span>
              </label>

              <div className="flex flex-wrap gap-2 mb-2">
                {[15, 20, 25, 30, 40, 45].map((menit) => (
                  <button
                    key={menit}
                    type="button"
                    onClick={() => setMenitTerlambat(menit)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      menitTerlambat === menit
                        ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-md'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    Terlambat {menit} Menit
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={menitTerlambat}
                  onChange={(e) => setMenitTerlambat(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Classroom Photo Verification Upload (CRITICAL REQUIREMENT) */}
            <div>
              <label className="block text-xs font-bold text-white mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-emerald-400" />
                  Foto Bukti Kehadiran di Kelas Siswa <span className="text-red-400">*</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">Wajib dilampirkan</span>
              </label>

              {fotoBukti ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-emerald-500 bg-black group">
                  <img
                    src={fotoBukti}
                    alt="Bukti Kehadiran Kelas"
                    className="w-full h-52 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-500 cursor-pointer shadow-lg"
                    >
                      Ganti Foto
                    </button>
                    <button
                      type="button"
                      onClick={() => setFotoBukti('')}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-bold hover:bg-red-500 cursor-pointer shadow-lg"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-emerald-950/80 backdrop-blur-xs text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Foto Kelas Siap Dikirim</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-600 hover:border-emerald-500 rounded-xl p-5 text-center bg-slate-900/50 hover:bg-slate-900 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Ambil Foto Kamera / Unggah Foto Kelas
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Klik untuk membuka kamera HP atau memilih foto suasana kelas santri
                      </p>
                    </div>
                  </div>

                  {/* Desktop / Quick Test Helper Buttons */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">Atau pilih contoh foto cepat:</span>
                    <button
                      type="button"
                      onClick={() => handleUseSamplePhoto(0)}
                      className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-300 rounded-md border border-slate-700 cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Foto Kelas A</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUseSamplePhoto(1)}
                      className="text-[11px] px-2 py-1 bg-slate-800 hover:bg-slate-700 text-teal-300 rounded-md border border-slate-700 cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Foto Kelas B</span>
                    </button>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            {/* Note / Reason */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Catatan Guru / Keterangan Kondisi
              </label>
              <textarea
                rows={2}
                value={catatan}
                onChange={(e) => setCatatan(e.target.value)}
                placeholder="Misal: Sudah tiba di kelas, santri sedang mengerjakan tugas..."
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {/* Submit Action Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 active:from-emerald-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-xl shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 tracking-wide uppercase cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>MENYIMPAN KONFIRMASI...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5 text-white" />
                    <span>KONFIRMASI SAYA SUDAH HADIR DI KELAS</span>
                  </>
                )}
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Setelah tombol diklik, status di Monitoring KBM akan otomatis tercatat <strong className="text-amber-300">"Hadir Terlambat ({menitTerlambat} Menit) - Terkonfirmasi"</strong> beserta foto bukti.
              </p>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="text-center text-slate-500 text-xs mt-6">
          Sistem Informasi Guru Piket & Monitoring KBM &copy; {new Date().getFullYear()} MA PLUS Ma'hadul Muta'allimin
        </div>
      </div>
    </div>
  );
};
