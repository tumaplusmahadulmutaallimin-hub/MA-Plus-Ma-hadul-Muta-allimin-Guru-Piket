import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Send,
  Upload,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  UserCheck,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Plus,
  Trash2,
  FileText
} from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';
import { MadrasahLogo } from '../common/MadrasahLogo';

interface PublicLaporGuruTidakMasukViewProps {
  onBack: () => void;
}

interface ClassTaskItem {
  id: string;
  kelas: string;
  jamKe: string;
  mapel: string;
  deskripsi: string;
  fileName: string;
}

export const PublicLaporGuruTidakMasukView: React.FC<PublicLaporGuruTidakMasukViewProps> = ({ onBack }) => {
  const { gurus, addGuruTidakMasuk, alertSuccess, confirmAction } = useApp();

  const [selectedGuru, setSelectedGuru] = useState('');
  const [alasan, setAlasan] = useState<'Sakit' | 'Dinas Luar' | 'Urusan Keluarga' | 'Terlambat' | 'Lainnya'>('Sakit');
  const [keterangan, setKeterangan] = useState('');
  const [fotoSurat, setFotoSurat] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [copiedGeneral, setCopiedGeneral] = useState(false);
  const [copiedClassId, setCopiedClassId] = useState<string | null>(null);
  const [autoBroadcastSuccess, setAutoBroadcastSuccess] = useState(true);

  // Dynamic class tasks for all classes taught by this teacher
  const [taskList, setTaskList] = useState<ClassTaskItem[]>([
    {
      id: 'task-1',
      kelas: 'XA',
      jamKe: '1-2',
      mapel: 'Matematika',
      deskripsi: 'Mengerjakan soal latihan LKS halaman 45-47 nomor 1 sampai 15. Dikerjakan di buku tugas dan dikumpulkan ke Guru Piket.',
      fileName: 'lks_matematika_bab3.pdf'
    },
    {
      id: 'task-2',
      kelas: 'XB',
      jamKe: '3-4',
      mapel: 'Matematika',
      deskripsi: 'Membaca modul materi bab matriks halaman 50, kemudian merangkum rumus penting dan mengerjakan 5 soal contoh.',
      fileName: 'modul_matriks_ringkas.pdf'
    }
  ]);

  // When teacher changes, auto-fill mapel
  const handleTeacherChange = (namaGuru: string) => {
    setSelectedGuru(namaGuru);
    const found = gurus.find(g => g.nama === namaGuru);
    if (found) {
      const mapelName = Array.isArray(found.mataPelajaran)
        ? found.mataPelajaran.join(', ')
        : String(found.mataPelajaran || 'Pelajaran Umum');

      setTaskList(prev =>
        prev.map(t => ({
          ...t,
          mapel: mapelName
        }))
      );
    }
  };

  const handleAddTask = () => {
    const found = gurus.find(g => g.nama === selectedGuru);
    const mapelName = found
      ? (Array.isArray(found.mataPelajaran) ? found.mataPelajaran.join(', ') : String(found.mataPelajaran || 'Mata Pelajaran'))
      : 'Mata Pelajaran';

    setTaskList(prev => [
      ...prev,
      {
        id: `task-${Date.now()}`,
        kelas: 'XIA',
        jamKe: '5-6',
        mapel: mapelName,
        deskripsi: '',
        fileName: ''
      }
    ]);
  };

  const handleRemoveTask = (id: string) => {
    if (taskList.length <= 1) return;
    confirmAction({
      isDanger: true,
      title: 'Hapus Tugas Kelas Ini?',
      message: 'Apakah Anda yakin ingin menghapus slot tugas kelas ini dari formulir izin?',
      confirmText: 'Ya, Hapus',
      onConfirm: () => {
        setTaskList(prev => prev.filter(t => t.id !== id));
      }
    });
  };

  const handleTaskFieldChange = (id: string, field: keyof ClassTaskItem, val: string) => {
    setTaskList(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: val } : t))
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuru) {
      return;
    }

    const affectedClasses = taskList.map(t => ({
      jamKe: parseInt(t.jamKe.split('-')[0] || '1', 10),
      kelas: t.kelas,
      mapel: t.mapel || 'Pelajaran',
      tugas: t.deskripsi || 'Mengerjakan tugas mandiri.',
      fileName: t.fileName || 'tugas_mandiri.pdf',
      status: 'Belum Ada' as const
    }));

    addGuruTidakMasuk({
      guruNama: selectedGuru,
      alasan,
      keterangan: keterangan || `Izin ${alasan} pada hari ini.`,
      jadwalTerdampak: affectedClasses
    });

    setIsSuccess(true);
    alertSuccess('Laporan Izin Terkirim!', 'Data ketidakhadiran telah tersimpan dan format pesan WhatsApp untuk grup madrasah & grup kelas telah disiapkan.');
  };

  // Generate WhatsApp Message for Madrasah Group (All Teachers & Guru Piket)
  const generateMadrasahGroupMessage = () => {
    const header = `*PEMBERITAHUAN KETIDAKHADIRAN GURU & TUGAS KBM*\n*MA PLUS MA'HADUL MUTA'ALLIMIN*\n📅 _Hari/Tanggal: Jum'at, 4 September 2026_\n\nAssalamu'alaikum Warahmatullahi Wabarakatuh,\n\nDiberitahukan kepada Bapak/Ibu Dewan Guru, Petugas Guru Piket, dan Wali Kelas bahwa:\n👤 *Nama Guru:* ${selectedGuru || 'Bapak/Ibu Guru'}\n📌 *Status:* ${alasan}\n📝 *Keterangan:* ${keterangan || 'Berhalangan hadir karena keperluan penting'}\n\n*DAFTAR KELAS YANG DIAMPU & TUGAS KBM HARI INI:*\n`;

    const body = taskList
      .map((t, idx) => {
        return `${idx + 1}. 🏫 *Kelas ${t.kelas}* (Jam Ke-${t.jamKe || '1'} · ${t.mapel}):\n   📖 *Instruksi Tugas:* ${t.deskripsi || 'Mengerjakan tugas mandiri'}\n   📎 *File/Modul:* ${t.fileName || 'Tersedia di meja piket / modul kelas'}\n   👨‍🏫 *Pendamping:* Guru Pengganti / Guru Piket`;
      })
      .join('\n\n');

    const footer = `\n\n⚠️ *Imbauan Ketertiban:*\nSiswa diharapkan tetap tertib di dalam kelas masing-masing dan menyelesaikan tugas dengan penuh tanggung jawab di bawah pendampingan Guru Piket.\n\nTerima kasih atas perhatian dan kerja samanya.\nWassalamu'alaikum Warahmatullahi Wabarakatuh.\n\n_Pusat Informasi Guru Piket MA PLUS Ma'hadul Muta'allimin_`;

    return header + body + footer;
  };

  // Generate WhatsApp Message for specific Class Group
  const generateClassGroupMessage = (task: ClassTaskItem) => {
    return `*INSTRUKSI TUGAS KBM MANDIRI - KELAS ${task.kelas}*\n*MA PLUS MA'HADUL MUTA'ALLIMIN*\n📅 _Jum'at, 4 September 2026 · Jam Ke-${task.jamKe || '1'}_\n\nAssalamu'alaikum Wr. Wb. Anak-anakku Kelas *${task.kelas}*,\n\nDikarenakan *${selectedGuru}* hari ini berhalangan hadir (*${alasan}*), maka pembelajaran *${task.mapel}* dilaksanakan secara mandiri dengan ketentuan sebagai berikut:\n\n📌 *Instruksi Tugas:*\n${task.deskripsi || 'Mengerjakan latihan soal di buku tugas masing-masing.'}\n\n📎 *Bahan Ajar / File:*\n${task.fileName ? `File: ${task.fileName} (Unduh di portal madrasah atau hubungi guru piket)` : 'Menggunakan buku pegangan / LKS yang sudah dibagikan'}\n\n⏰ *Waktu Pengerjaan:*\nSelama jam pelajaran ke-${task.jamKe || '1'} berlangsung.\n\nMohon seluruh siswa tetap berada di ruang kelas, menjaga ketertiban, dan mengumpulkan hasil tugas kepada *Guru Piket / Ketua Kelas* tepat waktu.\n\nSelamat belajar dan tetap semangat!\nWassalamu'alaikum Wr. Wb.\n\n_${selectedGuru} & Guru Piket MA PLUS_`;
  };

  const handleCopyMadrasahMessage = () => {
    const text = generateMadrasahGroupMessage();
    navigator.clipboard?.writeText(text);
    setCopiedGeneral(true);
    setTimeout(() => setCopiedGeneral(false), 3000);
  };

  const handleCopyClassMessage = (task: ClassTaskItem) => {
    const text = generateClassGroupMessage(task);
    navigator.clipboard?.writeText(text);
    setCopiedClassId(task.id);
    setTimeout(() => setCopiedClassId(null), 3000);
  };

  const madrasahWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(generateMadrasahGroupMessage())}`;

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-slate-800 pb-16">
      {/* Top Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white border border-emerald-500/30 flex items-center justify-center p-0.5 shadow-xs shrink-0">
              <MadrasahLogo size="sm" />
            </div>
            <div>
              <span className="font-extrabold text-emerald-950 text-sm tracking-wide block leading-tight">MA PLUS</span>
              <span className="text-[11px] text-slate-500 block leading-tight">Ma'hadul Muta'allimin · Layanan Guru</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Halaman Depan</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {/* Banner with Title and Graphic */}
        <div className="bg-gradient-to-r from-[#064E3B] via-[#047857] to-[#0F766E] rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-emerald-950/20 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="max-w-xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>Portal Mandiri Ketidakhadiran & Notifikasi WhatsApp</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              GURU TIDAK MASUK? LAPORKAN DI SINI
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
              Isi data ketidakhadiran dan berikan tugas untuk seluruh kelas yang diampu. Setelah formulir dikirim, sistem akan otomatis merangkum pesan resmi untuk diteruskan langsung ke <strong>Grup WhatsApp Madrasah</strong> dan <strong>Grup Masing-Masing Kelas</strong>.
            </p>
          </div>

          <div className="w-36 h-36 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex flex-col items-center justify-center p-4 shadow-lg shrink-0 text-center">
            <MessageSquare className="w-10 h-10 mb-2 text-amber-300" />
            <span className="text-[11px] font-extrabold tracking-wide">WA BROADCAST</span>
            <span className="text-[9px] text-emerald-200">Kirim Tugas Otomatis</span>
          </div>
        </div>

        {isSuccess ? (
          /* SUCCESS STATE WITH INSTANT WHATSAPP BROADCAST CENTER */
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            {/* Success Notification Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md text-center">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Laporan Berhasil Disimpan & Diterima Guru Piket!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-2 leading-relaxed">
                Data ketidakhadiran <strong>{selectedGuru}</strong> ({alasan}) telah masuk ke sistem piket harian. Selanjutnya, silakan kirimkan format pesan berikut ke <strong>Grup WhatsApp Madrasah</strong> dan <strong>Grup WhatsApp Kelas</strong> yang diampu agar KBM tetap berlangsung kondusif.
              </p>

              {/* Automated Gateway Status */}
              <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Gateway WhatsApp Madrasah Aktif · Siap Kirim ke Grup</span>
              </div>
            </div>

            {/* WhatsApp Dispatch Action Center */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (7 cols): WhatsApp Grup Madrasah */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        1. Kirim ke Grup WhatsApp Madrasah
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Untuk Dewan Guru, Guru Piket, dan Pimpinan Madrasah
                      </p>
                    </div>
                  </div>
                </div>

                {/* WhatsApp Chat Preview Bubble */}
                <div className="p-4 bg-[#E5DDD5] rounded-2xl border border-slate-200">
                  <div className="bg-[#DCF8C6] text-slate-900 p-4 rounded-2xl rounded-tl-none shadow-xs text-xs font-sans leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto border border-emerald-200">
                    {generateMadrasahGroupMessage()}
                  </div>
                  <div className="flex justify-end mt-1.5 text-[10px] text-slate-500 font-mono">
                    Jum'at, 4 Sep 2026 · 07:15 WIB ✓✓
                  </div>
                </div>

                {/* Action Buttons for Madrasah Group */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <a
                    href={madrasahWaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-[200px] py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>BUKA WHATSAPP SEKARANG</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyMadrasahMessage}
                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200"
                  >
                    {copiedGeneral ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedGeneral ? 'Tersalin!' : 'Salin Teks'}</span>
                  </button>
                </div>
              </div>

              {/* Right Column (5 cols): WhatsApp Per Kelas yang Diampu */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold shadow-xs">
                      <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        2. Kirim ke Grup Masing-Masing Kelas
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Teks khusus berisi instruksi tugas untuk rombel terkait
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {taskList.map((task) => {
                    const classWaUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(generateClassGroupMessage(task))}`;
                    const isCopied = copiedClassId === task.id;

                    return (
                      <div
                        key={task.id}
                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-900 rounded-lg font-extrabold text-xs">
                            Kelas {task.kelas}
                          </span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Jam Ke-{task.jamKe} · {task.mapel}
                          </span>
                        </div>

                        <p className="text-xs text-slate-700 line-clamp-2 italic">
                          "{task.deskripsi || 'Tugas mandiri'}"
                        </p>

                        <div className="flex items-center gap-2 pt-1">
                          <a
                            href={classWaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-colors"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Kirim ke Grup {task.kelas}</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleCopyClassMessage(task)}
                            className="py-2 px-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-[11px] rounded-xl flex items-center justify-center gap-1 transition-colors"
                            title="Salin pesan untuk kelas ini"
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{isCopied ? 'Tersalin' : 'Salin'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs text-emerald-900 leading-relaxed">
                  💡 <strong>Tip Praktis:</strong> Pesan ini otomatis dikhususkan untuk siswa di kelas tersebut agar mereka mengetahui tugas yang harus diselesaikan tanpa mengganggu jam pelajaran lain.
                </div>
              </div>
            </div>

            {/* Bottom Navigation */}
            <div className="flex flex-wrap justify-between items-center gap-3 pt-4 border-t border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setIsSuccess(false);
                  setKeterangan('');
                }}
                className="px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl shadow-2xs"
              >
                ← Buat Laporan Baru
              </button>

              <button
                type="button"
                onClick={onBack}
                className="px-6 py-2.5 bg-slate-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Selesai & Kembali ke Portal Utama
              </button>
            </div>
          </div>
        ) : (
          /* FORM SUBMISSION */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200 space-y-7">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Nama Guru */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  1. Nama Tenaga Pendidik / Guru <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedGuru}
                  onChange={(e) => handleTeacherChange(e.target.value)}
                  className="w-full px-3.5 py-2.8 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 transition-all font-semibold"
                  required
                >
                  <option value="">-- Pilih Nama Guru --</option>
                  {gurus.map((g) => {
                    const mapelLabel = Array.isArray(g.mataPelajaran)
                      ? g.mataPelajaran.join(', ')
                      : String(g.mataPelajaran || '');
                    return (
                      <option key={g.id} value={g.nama}>
                        {g.nama} {mapelLabel ? `(${mapelLabel})` : ''}
                      </option>
                    );
                  })}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Pilih nama Anda atau guru yang berhalangan hadir.
                </p>
              </div>

              {/* 2. Alasan Tidak Masuk */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  2. Alasan Tidak Hadir <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['Sakit', 'Dinas Luar', 'Urusan Keluarga', 'Terlambat', 'Lainnya'] as const).map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer text-xs font-semibold transition-all ${
                        alasan === opt
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 shadow-xs'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="alasan"
                        checked={alasan === opt}
                        onChange={() => setAlasan(opt)}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Keterangan Rinci */}
            <div>
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                3. Keterangan & Rincian Izin
              </label>
              <textarea
                rows={2}
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Contoh: Sedang dalam perawatan medis di RS / Menghadiri rapat dinas MGMP di Kemenag Kabupaten..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 font-medium"
              />
            </div>

            {/* Lampiran Bukti Surat Izin / Keterangan Dokter */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
              <ImageUploader
                currentImage={fotoSurat || undefined}
                onImageChange={(img) => setFotoSurat(img)}
                label="Foto Surat Keterangan / Surat Dokter / Surat Tugas (Opsional)"
                sublabel="Unggah foto atau scan bukti fisik izin Anda. Foto dapat diganti dan diubah kapan saja."
                shape="rectangle"
              />
            </div>

            {/* 4. Daftar Kelas yang Diampu & Tugas KBM */}
            <div className="space-y-4 pt-2 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    4. Daftar Seluruh Kelas yang Diampu & Tugas KBM Hari Ini <span className="text-red-500">*</span>
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Masukkan instruksi tugas untuk setiap kelas yang ditinggalkan agar dapat diteruskan ke grup WhatsApp kelas dan guru piket.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddTask}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors self-start cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Tambah Kelas Diampu</span>
                </button>
              </div>

              <div className="space-y-3">
                {taskList.map((task, idx) => (
                  <div
                    key={task.id}
                    className="p-4 bg-slate-50/80 border border-slate-200 rounded-2xl hover:border-emerald-300 transition-all space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="text-xs font-bold text-slate-700">Rombel:</label>
                          <select
                            value={task.kelas}
                            onChange={(e) => handleTaskFieldChange(task.id, 'kelas', e.target.value)}
                            className="text-xs font-extrabold text-emerald-950 bg-white border border-slate-200 rounded-lg px-2.5 py-1"
                          >
                            {['XA', 'XB', 'XC', 'XIA', 'XIB', 'XIC', 'XIIA', 'XIIB', 'XIIC', 'XII IPS', 'X IPA', 'XI IPA'].map(c => (
                              <option key={c} value={c}>Kelas {c}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="font-semibold text-slate-600">Jam Ke:</span>
                          <input
                            type="text"
                            placeholder="Contoh: 1-2 atau 3"
                            value={task.jamKe}
                            onChange={(e) => handleTaskFieldChange(task.id, 'jamKe', e.target.value)}
                            className="w-24 text-xs font-mono font-bold text-slate-800 bg-white border border-slate-200 rounded-lg px-2 py-1"
                          />
                        </div>

                        {taskList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveTask(task.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus kelas ini"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-8">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Petunjuk & Instruksi Tugas Belajar:
                        </label>
                        <textarea
                          rows={2}
                          value={task.deskripsi}
                          onChange={(e) => handleTaskFieldChange(task.id, 'deskripsi', e.target.value)}
                          placeholder="Tuliskan materi, nomor soal, atau instruksi pengerjaan..."
                          className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-emerald-600 font-medium"
                          required
                        />
                      </div>

                      <div className="md:col-span-4">
                        <label className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                          Lampiran Modul / Lembar Kerja (File):
                        </label>
                        <label className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white border border-dashed border-slate-300 rounded-xl text-xs font-medium text-slate-600 cursor-pointer hover:border-emerald-600 hover:text-emerald-700 transition-colors">
                          <Upload className="w-4 h-4" />
                          <span className="truncate max-w-[150px]">
                            {task.fileName || 'Pilih File (PDF/DOC)'}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleTaskFieldChange(task.id, 'fileName', f.name);
                            }}
                          />
                        </label>
                        <p className="text-[9px] text-slate-400 mt-1">
                          File akan dicantumkan di link pesan WhatsApp.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp Integration Notice */}
            <div className="flex items-start gap-3 p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-emerald-950 text-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Share2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold">Otomatisasi Kirim ke Grup WhatsApp:</p>
                <p className="text-emerald-900 mt-0.5 leading-relaxed">
                  Setelah tombol kirim ditekan, sistem langsung menyiapkan format pesan siap kirim ke <strong>Grup WhatsApp Madrasah</strong> serta tombol kirim langsung ke masing-masing <strong>Grup WA Kelas yang diampu</strong>.
                </p>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:from-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-700/30 flex items-center gap-2.5 tracking-wider uppercase transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>KIRIM LAPORAN & SIAPKAN PESAN WHATSAPP</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
