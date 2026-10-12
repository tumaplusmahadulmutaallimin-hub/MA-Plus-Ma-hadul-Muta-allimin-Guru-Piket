import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  FileSpreadsheet,
  DoorOpen,
  Calendar,
  Send,
  Check,
  Printer,
  X
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';
import { MadrasahLogo } from '../common/MadrasahLogo';

export const IzinKeluarKelasView: React.FC = () => {
  const {
    izinKeluarList,
    addIzinKeluar,
    markSiswaReturned,
    siswas,
    activeIzinLuarCount,
    activeIzinKamarMandiCount,
    maxKuotaLuarLingkungan,
    maxKuotaKamarMandi,
    confirmAction,
    alertSuccess,
    alertError
  } = useApp();

  const [namaSiswa, setNamaSiswa] = useState('');
  const [kelas, setKelas] = useState('XA');
  const [tujuan, setTujuan] = useState<'Ke Puskesmas' | 'Urusan Keluarga' | 'Ke UKS' | 'Ke Bank' | 'Izin Pulang' | 'Ke Kamar Mandi' | 'Lainnya'>('Ke Puskesmas');
  const [jenisIzin, setJenisIzin] = useState('Pemeriksaan Kesehatan');
  const [waktuKeluar, setWaktuKeluar] = useState('10:24');
  const [estimasiKembali, setEstimasiKembali] = useState('11:00');
  const [pendamping, setPendamping] = useState('');
  const [noHp, setNoHp] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [selectedIzinToPrint, setSelectedIzinToPrint] = useState<any | null>(null);

  const handleExportXLSX = () => {
    const headers = ['No', 'Nama Santri', 'Kelas', 'Tujuan', 'Jenis Izin', 'Waktu Keluar', 'Estimasi Kembali', 'Status', 'Pendamping', 'No HP Wali', 'Keterangan'];
    const rows = izinKeluarList.map((item, idx) => [
      idx + 1,
      item.nama,
      item.kelas,
      item.tujuan,
      item.jenisIzin,
      item.waktuKeluar,
      item.estimasiKembali,
      item.status,
      item.pendamping || '-',
      item.noHp || '-',
      item.keterangan || '-'
    ]);

    exportToXLSX({
      filename: `Rekap_Izin_Keluar_Siswa_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Izin Keluar Santri',
      headers,
      data: rows,
      colWidths: [8, 28, 12, 22, 24, 16, 18, 16, 22, 18, 30]
    });

    alertSuccess(
      'Ekspor Excel Berhasil',
      'Data izin keluar kelas santri berhasil diekspor ke format Excel (.xlsx) dengan kolom sel terpisah rapi.'
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaSiswa.trim()) {
      alertError('Form Belum Lengkap', 'Silakan pilih atau isi nama siswa yang mengajukan izin.');
      return;
    }

    if (tujuan === 'Ke Kamar Mandi') {
      if (activeIzinKamarMandiCount >= maxKuotaKamarMandi) {
        alertError('Kuota Kamar Mandi Penuh', `Batas maksimal izin ke kamar mandi (${maxKuotaKamarMandi} siswa) telah terpenuhi. Mohon menunggu santri yang sedang izin kembali.`);
        return;
      }
      if (!pendamping.trim()) {
        alertError('Wajib Berpasangan', 'Untuk izin ke kamar mandi, santri wajib keluar berpasangan (minimal 2 santri). Silakan isi nama santri pendamping (dia sama siapa).');
        return;
      }
    } else {
      if (activeIzinLuarCount >= maxKuotaLuarLingkungan) {
        alertError('Kuota Luar Lingkungan Penuh', `Batas maksimal santri berada di luar lingkungan madrasah (${maxKuotaLuarLingkungan} orang) telah tercapai. Harap menunggu hingga santri lain kembali.`);
        return;
      }
    }

    addIzinKeluar({
      nama: namaSiswa.trim(),
      kelas,
      tujuan,
      jenisIzin: tujuan === 'Ke Kamar Mandi' ? 'Izin Toilet (Berpasangan)' : jenisIzin,
      kategoriTempat: tujuan === 'Ke Kamar Mandi' ? 'Kamar Mandi' : 'Luar Lingkungan',
      waktuKeluar,
      estimasiKembali,
      pendamping: pendamping.trim() || undefined,
      noHp: noHp.trim() || undefined,
      keterangan: keterangan.trim() || undefined
    });

    setSavedSuccess(true);
    alertSuccess('Izin Keluar Dicatat', `Surat izin keluar untuk ${namaSiswa} (${kelas}) berhasil dicatat dalam buku piket.`);
    setTimeout(() => setSavedSuccess(false), 3000);
    setNamaSiswa('');
    setPendamping('');
    setKeterangan('');
  };

  const activeExits = izinKeluarList.filter((i) => i.status === 'Masih Keluar');
  const completedExits = izinKeluarList.filter((i) => i.status === 'Kembali');

  return (
    <div className="space-y-6">
      {/* 4 Stat Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {izinKeluarList.length}
            </p>
            <p className="text-xs text-slate-500 font-medium">Total Izin Keluar Hari Ini</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                {completedExits.length}
              </p>
              <span className="text-xs font-bold text-emerald-600 font-mono">
                {izinKeluarList.length > 0 ? Math.round((completedExits.length / izinKeluarList.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Sudah Kembali</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
                {activeExits.length}
              </p>
              <span className="text-xs font-bold text-amber-600 font-mono">
                {izinKeluarList.length > 0 ? Math.round((activeExits.length / izinKeluarList.length) * 100) : 0}%
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Masih Keluar</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">0</p>
              <span className="text-xs font-bold text-slate-400 font-mono">(0%)</span>
            </div>
            <p className="text-xs text-slate-500 font-medium">Lewat Batas Waktu</p>
          </div>
        </div>
      </div>

      {/* Real-time Quota Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'bg-rose-50 border-rose-300' : 'bg-teal-50/70 border-teal-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'bg-rose-500 text-white animate-pulse' : 'bg-teal-600 text-white'
            }`}>
              <DoorOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800">Kuota Luar Lingkungan</span>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {activeIzinLuarCount} dari Maksimal {maxKuotaLuarLingkungan} Santri
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-teal-100 text-teal-800'
          }`}>
            {activeIzinLuarCount >= maxKuotaLuarLingkungan ? 'KUOTA PENUH' : `${maxKuotaLuarLingkungan - activeIzinLuarCount} Tersisa`}
          </span>
        </div>

        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'bg-rose-50 border-rose-300' : 'bg-cyan-50/70 border-cyan-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
              activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'bg-rose-500 text-white animate-pulse' : 'bg-cyan-600 text-white'
            }`}>
              <Users className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800">Kuota Kamar Mandi (Berpasangan)</span>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {activeIzinKamarMandiCount} dari Maksimal {maxKuotaKamarMandi} Santri
              </p>
            </div>
          </div>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'bg-rose-100 text-rose-800 border border-rose-300' : 'bg-cyan-100 text-cyan-800'
          }`}>
            {activeIzinKamarMandiCount >= maxKuotaKamarMandi ? 'PENUH (12/12)' : `${maxKuotaKamarMandi - activeIzinKamarMandiCount} Tersisa`}
          </span>
        </div>
      </div>

      {/* Main Form (Left) & Active/History Tables (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Form Izin Keluar Siswa */}
        <div className="lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <DoorOpen className="w-4 h-4 text-blue-600" />
                <span>Form Izin Keluar Siswa</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Isi data siswa yang akan keluar dari lingkungan madrasah.
              </p>
            </div>
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Surat izin keluar berhasil dibuat dan dicatat!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Nama Siswa <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={namaSiswa}
                onChange={(e) => setNamaSiswa(e.target.value)}
                placeholder="Cari nama siswa atau ketik NIS..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white focus:ring-1 focus:ring-blue-600"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kelas</label>
                <select
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                >
                  <option value="XA">XA</option>
                  <option value="XB">XB</option>
                  <option value="XIA">XIA</option>
                  <option value="XIB">XIB</option>
                  <option value="XIIA">XIIA</option>
                  <option value="XIIB">XIIB</option>
                  <option value="XIIC">XIIC</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Jenis Izin <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={jenisIzin}
                  onChange={(e) => setJenisIzin(e.target.value)}
                  placeholder="Misal: Sakit, Kepentingan"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Waktu Keluar <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={waktuKeluar}
                    onChange={(e) => setWaktuKeluar(e.target.value)}
                    className="w-full bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Estimasi Kembali <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={estimasiKembali}
                    onChange={(e) => setEstimasiKembali(e.target.value)}
                    className="w-full bg-transparent focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Tujuan Keluar <span className="text-red-500">*</span>
              </label>
              <select
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              >
                <option value="Ke Puskesmas">Ke Puskesmas (Luar Lingkungan)</option>
                <option value="Urusan Keluarga">Urusan Keluarga (Luar Lingkungan)</option>
                <option value="Ke Bank">Ke Bank / ATM (Luar Lingkungan)</option>
                <option value="Izin Pulang">Izin Pulang Sakit (Luar Lingkungan)</option>
                <option value="Ke Kamar Mandi">Ke Kamar Mandi (Toilet - Wajib Berpasangan)</option>
                <option value="Ke UKS">Ke UKS Madrasah</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {tujuan === 'Ke Kamar Mandi' && (
              <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-xs text-cyan-900 space-y-1">
                <span className="font-extrabold flex items-center gap-1.5 text-cyan-950">
                  <Users className="w-4 h-4 text-cyan-700" />
                  Aturan Izin Kamar Mandi (Toilet)
                </span>
                <p className="text-[11px] leading-relaxed">
                  Sesuai ketentuan madrasah: Maksimal 12 santri keluar ke kamar mandi sekaligus, dan santri <strong>wajib berpasangan (dia sama siapa)</strong>.
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {tujuan === 'Ke Kamar Mandi' ? (
                    <>Santri Pendamping (Dia sama siapa?) <span className="text-red-500">*</span></>
                  ) : (
                    'Pendamping (Jika Ada)'
                  )}
                </label>
                <input
                  type="text"
                  list="santri-pendamping-list"
                  value={pendamping}
                  onChange={(e) => setPendamping(e.target.value)}
                  placeholder={tujuan === 'Ke Kamar Mandi' ? 'Ketik nama santri pasangan...' : 'Nama guru / wali / teman'}
                  className={`w-full p-2.5 bg-slate-50 border rounded-xl font-medium focus:bg-white ${
                    tujuan === 'Ke Kamar Mandi' && !pendamping ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200'
                  }`}
                  required={tujuan === 'Ke Kamar Mandi'}
                />
                <datalist id="santri-pendamping-list">
                  {siswas.filter(s => s.kelas === kelas).map(s => (
                    <option key={s.id} value={s.nama} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">No. HP (Jika Diperlukan)</label>
                <input
                  type="text"
                  value={noHp}
                  onChange={(e) => setNoHp(e.target.value)}
                  placeholder="0812xxxx"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Keterangan</label>
              <textarea
                rows={2}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Tambahkan keterangan jika diperlukan..."
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setNamaSiswa('');
                  setKeterangan('');
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl font-semibold text-slate-600"
              >
                Reset Form
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl shadow-md shadow-blue-600/30 tracking-wide uppercase transition-all"
              >
                Simpan Data Izin Keluar
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (7 cols): Siswa Sedang Keluar & Riwayat */}
        <div className="lg:col-span-7 space-y-5">
          {/* Siswa yang Sedang Keluar Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Siswa yang Sedang Keluar</span>
              </h4>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportXLSX}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                  title="Ekspor Data Izin Keluar ke Excel (.xlsx) dengan kolom sel terpisah"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Export .xlsx</span>
                </button>
                <button
                  onClick={() => alertSuccess('Data Dimuat Ulang', 'Daftar santri sedang izin keluar telah diperbarui.')}
                  className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
                  title="Muat Ulang Data"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Tujuan</th>
                    <th className="py-2.5 px-3">Waktu Keluar</th>
                    <th className="py-2.5 px-3">Estimasi</th>
                    <th className="py-2.5 px-3">Durasi</th>
                    <th className="py-2.5 px-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeExits.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-amber-50/30">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{item.nama}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-600">{item.kelas}</td>
                      <td className="py-2.5 px-3 text-slate-700">{item.tujuan}</td>
                      <td className="py-2.5 px-3 font-mono font-medium">{item.waktuKeluar}</td>
                      <td className="py-2.5 px-3 font-mono font-medium">{item.estimasiKembali}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-mono">
                          {item.durasi || '25m'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedIzinToPrint(item)}
                            className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                            title="Cetak Surat Izin Keluar Resmi"
                          >
                            <Printer className="w-3.5 h-3.5 text-blue-600" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              confirmAction({
                                title: 'Konfirmasi Siswa Kembali',
                                message: `Konfirmasi bahwa siswa "${item.nama}" (${item.kelas}) telah kembali ke kelas setelah keperluan "${item.tujuan}"?`,
                                confirmText: 'Ya, Tandai Kembali',
                                onConfirm: () => {
                                  markSiswaReturned(item.id);
                                  alertSuccess('Status Diperbarui', `Siswa ${item.nama} telah dicatat kembali ke kelas.`);
                                }
                              });
                            }}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            Kembali
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Riwayat Izin Keluar Hari Ini */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Riwayat Izin Keluar Hari Ini</span>
              </h4>
              <button
                onClick={() => {
                  const headers = ['No', 'Nama Siswa', 'Kelas', 'Tujuan Keperluan', 'Waktu Keluar', 'Waktu Kembali', 'Durasi', 'Status'];
                  const data = completedExits.map((item, idx) => [
                    idx + 1,
                    item.nama,
                    item.kelas,
                    item.tujuan,
                    item.waktuKeluar,
                    item.waktuKembali || '-',
                    item.durasi || '-',
                    item.status
                  ]);
                  exportToXLSX({
                    filename: `Riwayat_Izin_Keluar_${new Date().toISOString().slice(0, 10)}.xlsx`,
                    sheetName: 'Riwayat Izin',
                    headers,
                    data,
                    colWidths: [6, 26, 12, 30, 14, 14, 12, 16]
                  });
                  alertSuccess('Export Berhasil', 'Riwayat izin keluar berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah.');
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export .xlsx</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="py-2.5 px-3">No</th>
                    <th className="py-2.5 px-3">Nama Siswa</th>
                    <th className="py-2.5 px-3">Kelas</th>
                    <th className="py-2.5 px-3">Tujuan</th>
                    <th className="py-2.5 px-3">Keluar</th>
                    <th className="py-2.5 px-3">Kembali</th>
                    <th className="py-2.5 px-3">Durasi</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-center">Cetak</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {completedExits.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.nama}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-600">{item.kelas}</td>
                      <td className="py-2.5 px-3 text-slate-600">{item.tujuan}</td>
                      <td className="py-2.5 px-3 font-mono">{item.waktuKeluar}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-700">
                        {item.waktuKembali}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-slate-500">{item.durasi}</td>
                      <td className="py-2.5 px-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => setSelectedIzinToPrint(item)}
                          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer"
                          title="Cetak Arsip Surat Izin"
                        >
                          <Printer className="w-3.5 h-3.5 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Donut Chart, Class Bar, and Rules */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Donut Chart: Tujuan Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Statistik Tujuan Keluar
          </h4>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#E2E8F0" strokeWidth="4.5" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="4.5" strokeDasharray="33.3 66.7" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10B981" strokeWidth="4.5" strokeDasharray="33.3 66.7" strokeDashoffset="-33.3" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F59E0B" strokeWidth="4.5" strokeDasharray="16.7 83.3" strokeDashoffset="-66.6" />
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="#EF4444" strokeWidth="4.5" strokeDasharray="16.7 83.3" strokeDashoffset="-83.3" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono font-bold text-sm text-slate-900">
                <span>6</span>
                <span className="text-[8px] text-slate-400 font-sans">Izin</span>
              </div>
            </div>

            <div className="space-y-1 text-[11px] flex-1">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Urusan Keluarga
                </span>
                <span className="font-bold">2 (33,3%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ke Puskesmas
                </span>
                <span className="font-bold">2 (33,3%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Ke UKS
                </span>
                <span className="font-bold">1 (16,7%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span> Lainnya
                </span>
                <span className="font-bold">1 (16,7%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Rekap per Kelas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Rekap per Kelas
          </h4>
          <div className="space-y-2 text-xs">
            {[
              { kelas: 'XA', count: 1 },
              { kelas: 'XIA', count: 2 },
              { kelas: 'XIB', count: 1 },
              { kelas: 'XIIA', count: 1 },
              { kelas: 'XIIC', count: 1 }
            ].map((k, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-12 font-bold text-slate-700 text-[11px]">{k.kelas}</span>
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: `${(k.count / 3) * 100}%` }}
                  ></div>
                </div>
                <span className="font-mono font-bold text-slate-900 w-3">{k.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Peraturan & Catatan */}
        <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-2xl space-y-2 text-xs text-amber-950">
          <h4 className="font-bold text-amber-900 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Peraturan & Catatan:</span>
          </h4>
          <ol className="text-[11px] text-amber-900/80 space-y-1 list-decimal list-inside leading-relaxed">
            <li>Izin keluar hanya untuk keperluan penting dan mendesak.</li>
            <li>Siswa wajib kembali sesuai estimasi waktu yang dicatat.</li>
            <li>Jika lebih dari 2 jam belum kembali, segera konfirmasi ke wali kelas/orang tua.</li>
            <li>Semua izin keluar harus dicatat dan ditandatangani oleh Guru Piket.</li>
          </ol>
        </div>
      </div>

      {/* MODAL CETAK SURAT IZIN RESMI BERKOP MADRASAH */}
      {selectedIzinToPrint && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto">
            {/* Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 no-print">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Surat Izin Keluar Resmi</h3>
                  <p className="text-[11px] text-slate-500">Kop Resmi Madrasah Aliyah Plus Ma'hadul Muta'allimin</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak / Simpan PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedIzinToPrint(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Madrasah Letter Body (Print-optimized) */}
            <div className="bg-white p-6 border border-slate-300 rounded-2xl space-y-4 text-slate-900 font-sans">
              {/* Kop Surat Resmi */}
              <div className="text-center pb-3 border-b-2 border-slate-900 space-y-0.5">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                    <MadrasahLogo size="lg" />
                  </div>
                  <div>
                    <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      YAYASAN PONDOK PESANTREN MA'HADUL MUTA'ALLIMIN
                    </h2>
                    <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-emerald-950">
                      MADRASAH ALIYAH PLUS MA'HADUL MUTA'ALLIMIN KATERBAN
                    </h1>
                    <p className="text-[10px] font-bold text-amber-800 uppercase">
                      MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL) • BERBASIS PONDOK PESANTREN
                    </p>
                    <p className="text-[10px] text-slate-600 font-mono">
                      NSM: 131235210019 · NPSN: 69982415 · Status Akreditasi: A (Unggul)
                    </p>
                    <p className="text-[9px] text-slate-500">
                      Katerban, Kec. Paron, Kab. Ngawi, Jawa Timur 63253 · Email: tumaplusmahadulmutaallimin@gmail.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Title & Document Number */}
              <div className="text-center pt-1 space-y-0.5">
                <h3 className="text-xs font-black uppercase underline tracking-wider">
                  SURAT KETERANGAN IZIN KELUAR MADRASAH
                </h3>
                <p className="text-[10px] text-slate-500 font-mono">
                  Nomor: SK.IZIN/MAPLUS/2026/{String(selectedIzinToPrint.id || '001').substring(0, 8).toUpperCase()}
                </p>
              </div>

              {/* Santri Data Table */}
              <div className="text-xs space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <p className="text-[11px] text-slate-700">
                  Yang bertanda tangan di bawah ini Guru Piket MA PLUS Ma'hadul Muta'allimin menerangkan bahwa:
                </p>
                <div className="grid grid-cols-3 gap-y-1.5 text-xs">
                  <span className="text-slate-500">Nama Lengkap Santri</span>
                  <span className="col-span-2 font-bold text-slate-900">: {selectedIzinToPrint.nama}</span>

                  <span className="text-slate-500">Kelas / Rombel</span>
                  <span className="col-span-2 font-bold text-blue-700">: Kelas {selectedIzinToPrint.kelas}</span>

                  <span className="text-slate-500">Hari / Tanggal Izin</span>
                  <span className="col-span-2 font-medium">: Jum'at, 4 September 2026</span>

                  <span className="text-slate-500">Waktu Keluar</span>
                  <span className="col-span-2 font-mono font-bold">: {selectedIzinToPrint.waktuKeluar} WIB</span>

                  <span className="text-slate-500">Batas Waktu Kembali</span>
                  <span className="col-span-2 font-mono font-bold text-amber-700">: {selectedIzinToPrint.estimasiKembali} WIB</span>

                  <span className="text-slate-500">Keperluan / Tujuan</span>
                  <span className="col-span-2 font-semibold text-slate-800">: {selectedIzinToPrint.tujuan}</span>

                  <span className="text-slate-500">Keterangan / Pendamping</span>
                  <span className="col-span-2 text-slate-700">: {selectedIzinToPrint.keterangan || selectedIzinToPrint.pendamping || 'Mandiri (Disetujui Guru Piket)'}</span>
                </div>
              </div>

              {/* Ketentuan */}
              <div className="text-[10px] text-slate-500 space-y-1 border-t border-slate-100 pt-2 leading-relaxed">
                <p className="font-bold text-slate-700">Ketentuan Santri Izin Keluar:</p>
                <p>1. Santri wajib membawa surat izin ini dan menunjukkannya kepada petugas keamanan di pos gerbang.</p>
                <p>2. Santri wajib kembali ke madrasah sebelum batas waktu yang telah disepakati.</p>
                <p>3. Santri wajib melapor kembali ke Meja Guru Piket setibanya di kampus madrasah.</p>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-4 grid grid-cols-2 gap-4 text-center text-xs">
                <div>
                  <p className="text-[11px] text-slate-600">Mengetahui,</p>
                  <p className="font-bold text-slate-800">Guru Jam Mengajar / Wali Kelas</p>
                  <div className="h-12 flex items-center justify-center text-slate-300 italic text-[11px]">
                    (Paraf Petugas)
                  </div>
                  <p className="font-semibold underline text-slate-700">(..........................................)</p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-600">Bantul, 4 September 2026</p>
                  <p className="font-bold text-emerald-950">Petugas Guru Piket</p>
                  <div className="h-12 flex items-center justify-center font-serif italic text-emerald-800 font-bold text-sm">
                    Zainal Arifin, S.Pd
                  </div>
                  <p className="font-extrabold underline text-slate-900">Zainal Arifin, S.Pd</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
