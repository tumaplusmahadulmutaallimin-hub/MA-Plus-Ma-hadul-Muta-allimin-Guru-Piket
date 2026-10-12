import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Calendar,
  Clock,
  FileText,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  ChevronUp,
  Search,
  CheckCircle,
  AlertCircle,
  Eye,
  X,
  Share2,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Download,
  UserCheck
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const TugasGuruIzinView: React.FC = () => {
  const { guruTidakMasukList, gurus, assignSubstituteTeacher, confirmAction, alertSuccess, alertError } = useApp();
  const [expandedId, setExpandedId] = useState<string>('gtm-1');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewingFile, setViewingFile] = useState<{ title: string; content: string } | null>(null);

  // WhatsApp Broadcast Modal state
  const [activeWaModal, setActiveWaModal] = useState<{
    title: string;
    teacherName: string;
    text: string;
  } | null>(null);
  const [copiedModalText, setCopiedModalText] = useState(false);

  // Manual Inval Assignment Modal state
  const [invalModal, setInvalModal] = useState<{
    itemId: string;
    guruNama: string;
    alasan: string;
    kelas: string;
    jamKe: number;
    mapel: string;
    tugas: string;
    currentPengganti?: string;
  } | null>(null);
  const [selectedSubstitute, setSelectedSubstitute] = useState<string>('');
  const [invalNotes, setInvalNotes] = useState<string>('');

  // Available teachers to substitute
  const substituteCandidates = gurus.map(g => g.nama);

  // Open WhatsApp Broadcast Modal
  const handleOpenWaBroadcast = (item: any, specificClass?: any) => {
    if (specificClass) {
      const text = `*INSTRUKSI TUGAS KBM MANDIRI - KELAS ${specificClass.kelas}*\n*MA PLUS MA'HADUL MUTA'ALLIMIN*\n📅 _Jum'at, 4 September 2026 · Jam Ke-${specificClass.jamKe}_\n\nAssalamu'alaikum Wr. Wb. Siswa-siswi Kelas *${specificClass.kelas}*,\n\nDikarenakan guru pengajar *${item.guruNama}* berhalangan hadir (${item.alasan}), berikut instruksi tugas mandiri untuk kelas Anda:\n\n📖 *Mata Pelajaran:* ${specificClass.mapel}\n📝 *Tugas:* ${specificClass.tugas}\n📎 *Modul/File:* ${specificClass.fileName || 'Tersedia di meja guru piket'}\n👨‍🏫 *Guru Pengganti / Pendamping:* ${specificClass.guruPengganti || 'Guru Piket'}\n\nHarap seluruh siswa tetap tertib di dalam kelas dan menyelesaikan tugas tepat waktu.\nWassalamu'alaikum Wr. Wb.\n\n_Guru Piket MA PLUS Ma'hadul Muta'allimin_`;
      setActiveWaModal({
        title: `Kirim Tugas ke Grup WA Kelas ${specificClass.kelas}`,
        teacherName: item.guruNama,
        text
      });
    } else {
      const text = `*PEMBERITAHUAN KETIDAKHADIRAN GURU & TUGAS KBM*\n*MA PLUS MA'HADUL MUTA'ALLIMIN*\n📅 _Hari/Tanggal: ${item.tanggal}_\n\nAssalamu'alaikum Wr. Wb.\nDiberitahukan kepada Bapak/Ibu Guru, Tim Piket, dan Pimpinan bahwa:\n👤 *Nama Guru:* ${item.guruNama}\n📌 *Alasan:* ${item.alasan}\n📝 *Keterangan:* ${item.keterangan}\n\n*JADWAL KELAS TERDAMPAK & TUGAS HARI INI:*\n` +
        item.jadwalTerdampak.map((j: any, i: number) => 
          `${i + 1}. 🏫 *Kelas ${j.kelas}* (Jam Ke-${j.jamKe} · ${j.mapel}):\n   - Tugas: ${j.tugas}\n   - Guru Pengganti: ${j.guruPengganti || 'Belum Ada (Menunggu Penetapan)'}`
        ).join('\n\n') +
        `\n\n⚠️ *Catatan:* Guru piket mohon mendampingi kelas yang belum ada guru penggantinya.\nWassalamu'alaikum Wr. Wb.\n\n_Pusat Informasi Guru Piket MA PLUS Ma'hadul Muta'allimin_`;
      setActiveWaModal({
        title: `Kirim ke WhatsApp Grup Madrasah (${item.guruNama})`,
        teacherName: item.guruNama,
        text
      });
    }
  };

  const handleCopyWaText = () => {
    if (activeWaModal) {
      navigator.clipboard?.writeText(activeWaModal.text);
      setCopiedModalText(true);
      setTimeout(() => setCopiedModalText(false), 3000);
    }
  };

  const handleExportXLSX = () => {
    const headers = ['No', 'Tanggal', 'Nama Guru', 'Alasan', 'Keterangan', 'Total Jadwal', 'Belum Ada Pengganti', 'Detail Kelas & Pengganti'];
    const data = guruTidakMasukList.map((item, idx) => [
      idx + 1,
      item.tanggal,
      item.guruNama,
      item.alasan,
      item.keterangan,
      item.totalJadwal,
      item.belumAdaPengganti,
      item.jadwalTerdampak.map(j => `Jam ${j.jamKe} ${j.kelas} (${j.mapel}) -> ${j.guruPengganti || 'Belum Ada'}`).join('; ')
    ]);
    exportToXLSX({
      filename: `Rekap_Tugas_Guru_Izin_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Guru Izin',
      headers,
      data,
      colWidths: [6, 14, 26, 16, 26, 14, 18, 50]
    });
    alertSuccess('Export Berhasil', 'Data tugas guru izin berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah.');
  };

  // Filtered teachers
  const filteredList = guruTidakMasukList.filter(item => {
    const matchSearch =
      item.guruNama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keterangan.toLowerCase().includes(searchQuery.toLowerCase());

    const matchKelas =
      filterKelas === 'Semua'
        ? true
        : item.jadwalTerdampak.some(j => j.kelas === filterKelas);

    const matchStatus =
      filterStatus === 'Semua'
        ? true
        : filterStatus === 'Belum Ada'
        ? item.belumAdaPengganti > 0
        : item.belumAdaPengganti === 0;

    return matchSearch && matchKelas && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top 4 Stat Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">{guruTidakMasukList.length}</p>
            <p className="text-xs text-slate-500 font-medium">Guru Izin / Tidak Hadir</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {guruTidakMasukList.reduce((acc, curr) => acc + curr.totalJadwal, 0)}
            </p>
            <p className="text-xs text-slate-500 font-medium">Total Jadwal Terdampak</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {guruTidakMasukList.reduce((acc, curr) => acc + curr.belumAdaPengganti, 0)}
            </p>
            <p className="text-xs text-slate-500 font-medium">Belum Ada Pengganti</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 font-mono tabular-nums">
              {guruTidakMasukList.reduce((acc, curr) => acc + (curr.totalJadwal - curr.belumAdaPengganti), 0)}
            </p>
            <p className="text-xs text-slate-500 font-medium">Sudah Ada Pengganti</p>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Content (Teacher Cards) & Right Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Filters & Teacher Cards */}
        <div className="lg:col-span-8 space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>04/09/2026</span>
            </div>

            <select
              value={filterKelas}
              onChange={(e) => setFilterKelas(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
            >
              <option value="Semua">Semua Kelas</option>
              <option value="XA">Kelas XA</option>
              <option value="XB">Kelas XB</option>
              <option value="XC">Kelas XC</option>
              <option value="XIA">Kelas XIA</option>
              <option value="XIB">Kelas XIB</option>
              <option value="XIIA">Kelas XIIA</option>
              <option value="XIIB">Kelas XIIB</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
            >
              <option value="Semua">Semua Status Inval</option>
              <option value="Belum Ada">Perlu Guru Pengganti</option>
              <option value="Sudah Ada">Sudah Lengkap</option>
            </select>

            <div className="relative flex-1 min-w-[150px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari guru atau keterangan..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Teacher Cards List */}
          <div className="space-y-4">
            {filteredList.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden transition-all"
                >
                  {/* Card Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? '' : item.id)}
                    className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-blue-600/10 text-blue-700 font-bold flex items-center justify-center text-sm border border-blue-200 shrink-0">
                        {item.guruNama.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-sm">{item.guruNama}</h3>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              item.alasan === 'Sakit'
                                ? 'bg-red-50 text-red-700 border border-red-200'
                                : item.alasan === 'Dinas Luar'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {item.alasan}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {item.tanggal}
                          </span>
                          <span>•</span>
                          <span className="text-slate-600 line-clamp-1">{item.keterangan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="hidden sm:flex items-center gap-2 text-xs">
                        <div className="px-2.5 py-1 bg-slate-100 rounded-lg text-slate-700 font-medium">
                          Total: <strong className="font-mono">{item.totalJadwal}</strong>
                        </div>
                        <div className="px-2.5 py-1 bg-rose-50 rounded-lg text-rose-700 font-medium border border-rose-100">
                          Belum Ada: <strong className="font-mono">{item.belumAdaPengganti}</strong>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Schedule and Task Assignment Table */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 p-4 sm:p-5 bg-slate-50/40 space-y-4">
                      {/* WhatsApp Broadcast Shortcut Toolbar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs">
                        <div className="flex items-center gap-2 text-emerald-950">
                          <MessageSquare className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-bold">Notifikasi WhatsApp:</span>
                          <span className="text-slate-600 text-[11px]">
                            Bagikan rekap tugas {item.guruNama} ke grup resmi
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenWaBroadcast(item)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                            <span>Kirim ke Grup WA Madrasah</span>
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                              <th className="py-2.5 px-3">No</th>
                              <th className="py-2.5 px-3">Jam Ke</th>
                              <th className="py-2.5 px-3">Kelas</th>
                              <th className="py-2.5 px-3">Mapel</th>
                              <th className="py-2.5 px-3">Tugas untuk Siswa</th>
                              <th className="py-2.5 px-3">File Modul</th>
                              <th className="py-2.5 px-3">Guru Pengganti</th>
                              <th className="py-2.5 px-3">Status</th>
                              <th className="py-2.5 px-3 text-center">Aksi / WA</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {item.jadwalTerdampak.map((j, jIdx) => (
                              <tr key={jIdx} className="hover:bg-white transition-colors">
                                <td className="py-3 px-3 font-mono text-slate-500">{jIdx + 1}</td>
                                <td className="py-3 px-3 font-bold text-slate-700 font-mono">
                                  Jam {j.jamKe}
                                </td>
                                <td className="py-3 px-3 font-bold text-emerald-800">{j.kelas}</td>
                                <td className="py-3 px-3 text-slate-800">{j.mapel}</td>
                                <td className="py-3 px-3 text-slate-600 max-w-xs">{j.tugas}</td>
                                <td className="py-3 px-3">
                                  {j.fileName ? (
                                    <button
                                      onClick={() =>
                                        setViewingFile({
                                          title: `${j.fileName} (Kelas ${j.kelas})`,
                                          content: `Instruksi Tugas Mandiri:\nMapel: ${j.mapel}\nKelas: ${j.kelas}\nJam Ke: ${j.jamKe}\n\nInstruksi:\n${j.tugas}\n\nCatatan Guru: Siswa mengerjakan di buku tugas masing-masing dan dikumpulkan kepada guru piket / guru pengganti.`
                                        })
                                      }
                                      className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 rounded-md"
                                    >
                                      <FileText className="w-3 h-3" />
                                      <span>Lihat File</span>
                                    </button>
                                  ) : (
                                    <span className="text-slate-400 italic text-[11px]">Buku/LKS</span>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  {j.guruPengganti ? (
                                    <span className="font-semibold text-emerald-700 flex items-center gap-1">
                                      <CheckCircle className="w-3.5 h-3.5" />
                                      {j.guruPengganti}
                                    </span>
                                  ) : (
                                    <span className="text-amber-600 font-semibold flex items-center gap-1">
                                      <AlertCircle className="w-3.5 h-3.5" />
                                      Belum ada pengganti
                                    </span>
                                  )}
                                </td>
                                <td className="py-3 px-3">
                                  <span
                                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                      j.status === 'Ditetapkan'
                                        ? 'bg-emerald-50 text-emerald-700'
                                        : 'bg-amber-50 text-amber-700'
                                    }`}
                                  >
                                    {j.status}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        const defaultCandidate = j.guruPengganti || substituteCandidates.find(c => c !== item.guruNama) || 'Zainal Arifin, S.Pd (Guru Piket)';
                                        setInvalModal({
                                          itemId: item.id,
                                          guruNama: item.guruNama,
                                          alasan: item.alasan,
                                          kelas: j.kelas,
                                          jamKe: j.jamKe,
                                          mapel: j.mapel,
                                          tugas: j.tugas,
                                          currentPengganti: j.guruPengganti
                                        });
                                        setSelectedSubstitute(defaultCandidate);
                                        setInvalNotes('');
                                      }}
                                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                                        j.status === 'Ditetapkan'
                                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                          : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs'
                                      }`}
                                    >
                                      {j.status === 'Ditetapkan' ? 'Ubah (Manual)' : 'Pilih Inval (Manual)'}
                                    </button>

                                    <button
                                      onClick={() => handleOpenWaBroadcast(item, j)}
                                      className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer"
                                      title={`Kirim WA ke Grup Kelas ${j.kelas}`}
                                    >
                                      <Share2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Petunjuk, Rekap Status & Export */}
        <div className="lg:col-span-4 space-y-4">
          {/* Instructions Box */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Petunjuk Penetapan Pengganti
            </h4>
            <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside leading-relaxed">
              <li>Pilih guru pengganti pada setiap jadwal yang terdampak.</li>
              <li>Pastikan guru pengganti tersedia pada jam pelajaran tersebut.</li>
              <li>Klik tombol <strong>"Inval / Tetapkan"</strong> untuk menugaskan guru pengganti.</li>
              <li>Klik ikon <strong>Share WA</strong> untuk membagikan tugas ke grup kelas terkait.</li>
              <li>Jadwal yang sudah ditetapkan akan otomatis muncul pada menu <strong>Monitoring KBM</strong>.</li>
            </ol>
          </div>

          {/* Rekap Status */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Rekap Status Hari Ini
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Belum ada pengganti
                </span>
                <span className="font-mono font-bold text-amber-700">
                  {guruTidakMasukList.reduce((acc, curr) => acc + curr.belumAdaPengganti, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sudah ada pengganti
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {guruTidakMasukList.reduce((acc, curr) => acc + (curr.totalJadwal - curr.belumAdaPengganti), 0)}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Guru sedang mengganti
                </span>
                <span className="font-mono font-bold text-slate-900">1</span>
              </div>
            </div>
          </div>

          {/* Unduh Data */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Unduh & Cetak Laporan
            </h4>
            <div className="space-y-2">
              <button
                onClick={handleExportXLSX}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                title="Ekspor ke Excel (.xlsx) dengan kolom sel terpisah"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Export .xlsx</span>
              </button>
              <button
                onClick={() => window.print()}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Lembar Inval</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Broadcast Modal */}
      {activeWaModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                  <MessageSquare className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    {activeWaModal.title}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Guru: {activeWaModal.teacherName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveWaModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Bubble WhatsApp Preview */}
            <div className="p-3.5 bg-[#E5DDD5] rounded-2xl border border-slate-200">
              <div className="bg-[#DCF8C6] text-slate-900 p-3.5 rounded-2xl rounded-tl-none shadow-xs text-xs font-sans leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto border border-emerald-200">
                {activeWaModal.text}
              </div>
              <div className="flex justify-end mt-1 text-[10px] text-slate-500 font-mono">
                Jum'at, 4 Sep 2026 · 07:15 WIB ✓✓
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={handleCopyWaText}
                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
              >
                {copiedModalText ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedModalText ? 'Tersalin!' : 'Salin Teks'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(activeWaModal.text)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Buka WhatsApp</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                {viewingFile.title}
              </h3>
              <button
                onClick={() => setViewingFile(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="my-4 p-4 bg-slate-50 rounded-xl font-mono text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
              {viewingFile.content}
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setViewingFile(null)}
                className="px-4 py-2 bg-emerald-700 text-white font-bold text-xs rounded-xl hover:bg-emerald-800"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Inval Assignment Modal */}
      {invalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <UserCheck className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">
                    Pilih Manual Guru Pengganti (Inval)
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Penugasan fleksibel oleh Guru Piket
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInvalModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Rincian Kelas & Guru Berhalangan */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Guru Berhalangan:</span>
                <span className="font-bold text-slate-900">{invalModal.guruNama} ({invalModal.alasan})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Jadwal Terdampak:</span>
                <span className="font-bold text-emerald-800">
                  Kelas {invalModal.kelas} · Jam Ke-{invalModal.jamKe} ({invalModal.mapel})
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200/80">
                <span className="text-slate-500 block text-[11px]">Tugas untuk Siswa:</span>
                <p className="font-medium text-slate-700 italic mt-0.5">"{invalModal.tugas}"</p>
              </div>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!selectedSubstitute) {
                  alertError('Pilih Guru', 'Silakan pilih guru pengganti terlebih dahulu.');
                  return;
                }
                assignSubstituteTeacher(
                  invalModal.itemId,
                  invalModal.jamKe,
                  invalModal.kelas,
                  selectedSubstitute,
                  invalNotes
                );
                alertSuccess(
                  'Guru Pengganti Ditetapkan',
                  `${selectedSubstitute} berhasil ditugaskan secara manual untuk mendampingi Kelas ${invalModal.kelas}.`
                );
                setInvalModal(null);
              }}
              className="space-y-3.5 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Pilih Guru Pengganti / Pendamping <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedSubstitute}
                  onChange={(e) => setSelectedSubstitute(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:bg-white focus:ring-1 focus:ring-emerald-600"
                  required
                >
                  <option value="">-- Pilih Guru yang Tersedia --</option>
                  <option value="Zainal Arifin, S.Pd (Guru Piket)">Zainal Arifin, S.Pd (Guru Piket Hari Ini)</option>
                  <option value="Ahmad Setiawan, S.Pd (Guru Piket)">Ahmad Setiawan, S.Pd (Guru Piket Hari Ini)</option>
                  <option value="Siti Fatimah, S.Pd (Guru Piket)">Siti Fatimah, S.Pd (Guru Piket Hari Ini)</option>
                  {substituteCandidates
                    .filter(name => name !== invalModal.guruNama)
                    .map((name, idx) => (
                      <option key={idx} value={name}>{name}</option>
                    ))}
                </select>
                <p className="text-[10px] text-slate-400 mt-1">
                  Pilihlah guru yang sedang jam kosong atau guru piket yang bersedia mendampingi kelas.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Catatan / Instruksi Khusus untuk Guru Pengganti
                </label>
                <textarea
                  rows={2}
                  value={invalNotes}
                  onChange={(e) => setInvalNotes(e.target.value)}
                  placeholder="Contoh: Dampingi pengerjaan tugas modul hal 24, buku dikumpulkan di akhir jam..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:bg-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInvalModal(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-all cursor-pointer"
                >
                  Tetapkan Guru Pengganti
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
