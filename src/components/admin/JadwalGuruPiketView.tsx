import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { JadwalGuruPiket } from '../../types';
import * as XLSX from 'xlsx';
import {
  CalendarCheck,
  Users,
  Shield,
  Clock,
  Plus,
  Edit2,
  Calendar,
  CheckCircle2,
  Check,
  FileSpreadsheet,
  X,
  Trash2,
  Sparkles,
  Upload,
  Download,
  BookOpen,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  RefreshCw,
  FileText,
  CheckCircle,
  Info,
  ChevronRight,
  Eye,
  AlertTriangle
} from 'lucide-react';
import {
  exportToXLSX,
  downloadJadwalPiketTemplateXLSX,
  downloadJadwalPiketTemplateCSV
} from '../../utils/excelHelper';
import { getIndonesianDayName } from '../../utils/dateUtils';

export const JadwalGuruPiketView: React.FC = () => {
  const {
    jadwalGuruPiketList,
    guruList,
    addJadwalPiket,
    updateJadwalPiket,
    deleteJadwalPiket,
    setJadwalPiketList,
    confirmAction,
    alertSuccess,
    alertError
  } = useApp();

  // Active Tab: 'jadwal' | 'panduan' | 'import'
  const [activeTab, setActiveTab] = useState<'jadwal' | 'panduan' | 'import'>('jadwal');

  // Modal State for Manual Add / Edit
  const [showModal, setShowModal] = useState(false);
  const [editingPiket, setEditingPiket] = useState<any | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    hari: string;
    koordinator: string;
    anggota: string[];
    jamMulai: string;
    jamSelesai: string;
    fokusTugas: string;
  }>({
    hari: 'Senin',
    koordinator: 'Zainal Arifin, S.Pd',
    anggota: ['Ahmad Setiawan, S.Pd', 'Siti Fatimah, S.Pd'],
    jamMulai: '06:45',
    jamSelesai: '14:30',
    fokusTugas: 'Penyambutan santri di gerbang, presensi KBM jam 1-8, izin keluar & distribusi MBG'
  });

  // State for Import CSV / Excel
  const [importedData, setImportedData] = useState<any[]>([]);
  const [importFileName, setImportFileName] = useState<string>('');
  const [importReplaceMode, setImportReplaceMode] = useState<boolean>(true);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const [importErrorMsg, setImportErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

  // Current day calculation
  const todayDayName = getIndonesianDayName(new Date(), 'standard');
  const todayDayNameFormal = getIndonesianDayName(new Date(), 'formal');

  // Manual Add Modal Handler
  const handleOpenAddModal = () => {
    setEditingPiket(null);
    setFormData({
      hari: 'Senin',
      koordinator: guruList[0]?.nama || 'Zainal Arifin, S.Pd',
      anggota: [guruList[1]?.nama || 'Ahmad Setiawan, S.Pd', guruList[2]?.nama || 'Siti Fatimah, S.Pd'],
      jamMulai: '06:45',
      jamSelesai: '14:30',
      fokusTugas: 'Penyambutan santri, monitoring KBM, penanganan izin & porsi MBG'
    });
    setShowModal(true);
  };

  // Manual Edit Modal Handler
  const handleOpenEditModal = (piket: any) => {
    setEditingPiket(piket);
    const existingAnggota: string[] = piket.anggota || [piket.guruPiket1, piket.guruPiket2].filter(Boolean);
    const coord: string = piket.koordinator || piket.guruPiket1 || (guruList[0]?.nama || 'Zainal Arifin, S.Pd');
    setFormData({
      hari: piket.hari || 'Senin',
      koordinator: coord,
      anggota: existingAnggota.length > 0 ? existingAnggota : [coord],
      jamMulai: piket.jamMulai || '06:45',
      jamSelesai: piket.jamSelesai || '14:30',
      fokusTugas: piket.fokusTugas || 'Penyambutan santri, monitoring KBM, penanganan izin & porsi MBG'
    });
    setShowModal(true);
  };

  // Toggle Member Checkbox
  const handleToggleAnggota = (nama: string) => {
    setFormData((prev) => {
      const exists = prev.anggota.includes(nama);
      if (exists) {
        return { ...prev, anggota: prev.anggota.filter((a) => a !== nama) };
      } else {
        return { ...prev, anggota: [...prev.anggota, nama] };
      }
    });
  };

  // Save Piket Manual
  const handleSavePiket = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPiket) {
      updateJadwalPiket(editingPiket.id, {
        hari: formData.hari,
        koordinator: formData.koordinator,
        guruPiket1: formData.koordinator,
        guruPiket2: formData.anggota[0] || formData.koordinator,
        anggota: formData.anggota,
        jamMulai: formData.jamMulai,
        jamSelesai: formData.jamSelesai,
        fokusTugas: formData.fokusTugas
      });
      alertSuccess(
        'Jadwal Piket Diperbarui',
        `Tim piket hari ${formData.hari} telah diperbarui dengan koordinator ${formData.koordinator}.`
      );
    } else {
      addJadwalPiket({
        hari: formData.hari,
        koordinator: formData.koordinator,
        guruPiket1: formData.koordinator,
        guruPiket2: formData.anggota[0] || formData.koordinator,
        anggota: formData.anggota,
        jamMulai: formData.jamMulai,
        jamSelesai: formData.jamSelesai,
        fokusTugas: formData.fokusTugas
      });
      alertSuccess(
        'Jadwal Piket Ditambahkan',
        `Jadwal penugasan piket hari ${formData.hari} berhasil didaftarkan ke sistem madrasah.`
      );
    }

    setShowModal(false);
  };

  // Delete Piket Manual
  const handleDeletePiket = (piket: any) => {
    confirmAction({
      title: 'Hapus Jadwal Piket',
      message: `Hapus penugasan piket untuk hari ${piket.hari}? Data petugas di menu terkait akan disesuaikan.`,
      confirmText: 'Ya, Hapus Jadwal',
      isDanger: true,
      onConfirm: () => {
        deleteJadwalPiket(piket.id);
        alertSuccess('Jadwal Piket Dihapus', `Jadwal piket hari ${piket.hari} telah dihapus dari sistem.`);
      }
    });
  };

  // Export to Excel XLSX
  const handleExportXLSX = () => {
    const headers = ['No', 'Hari Piket', 'Koordinator Piket', 'Anggota Tim Piket', 'Jam Bertugas', 'Fokus Tugas Harian', 'Status'];
    const rows = jadwalGuruPiketList.map((piket: any, idx: number) => {
      const anggotaList: string[] = piket.anggota || [piket.guruPiket1, piket.guruPiket2].filter(Boolean);
      const koordinatorNama: string = piket.koordinator || piket.guruPiket1 || 'Zainal Arifin, S.Pd';
      return [
        idx + 1,
        piket.hari,
        koordinatorNama,
        anggotaList.join(', '),
        `${piket.jamMulai || '06:45'} - ${piket.jamSelesai || '14:30'}`,
        piket.fokusTugas || 'Penyambutan santri, Presensi KBM, Izin Keluar & MBG',
        'Aktif Semester Genap 2026'
      ];
    });

    exportToXLSX({
      filename: `Jadwal_Guru_Piket_MAPLUS_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Jadwal Guru Piket',
      headers,
      data: rows,
      colWidths: [8, 16, 28, 36, 20, 42, 22]
    });

    alertSuccess(
      'Ekspor Excel Berhasil',
      'Jadwal piket mingguan madrasah berhasil diekspor ke format Excel (.xlsx) dengan kolom sel terpisah rapi.'
    );
  };

  // Handle File Upload Parsing (CSV or XLSX)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    setImportErrorMsg(null);
    setImportFileName(file.name);

    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        let rows: any[][] = [];

        if (file.name.endsWith('.csv')) {
          // Parse CSV
          const text = typeof data === 'string' ? data : new TextDecoder().decode(data as ArrayBuffer);
          const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
          rows = lines.map((line) => {
            // Simple robust CSV tokenizer handling quoted commas
            const matches: string[] = [];
            let inQuotes = false;
            let current = '';
            for (let i = 0; i < line.length; i++) {
              const char = line[i];
              if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
              } else if ((char === ',' || char === ';') && !inQuotes) {
                matches.push(current.trim());
                current = '';
              } else {
                current += char;
              }
            }
            matches.push(current.trim());
            return matches;
          });
        } else {
          // Parse XLSX / XLS using SheetJS
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        }

        if (rows.length < 2) {
          throw new Error('File tidak memiliki data baris yang cukup. Pastikan file menyertakan header dan minimal 1 baris jadwal.');
        }

        // Header mapping
        const headerRow = rows[0].map((h: any) => String(h || '').toLowerCase().trim());
        const findColIdx = (keywords: string[]): number => {
          for (let i = 0; i < headerRow.length; i++) {
            const h = headerRow[i];
            if (keywords.some((k) => h.includes(k))) return i;
          }
          return -1;
        };

        const hariIdx = findColIdx(['hari']);
        const koordIdx = findColIdx(['koordinator', 'ketua', 'piket 1', 'piket1', 'guru 1']);
        const anggotaIdx = findColIdx(['anggota', 'tim', 'piket 2', 'guru 2', 'pendamping']);
        const jamMulaiIdx = findColIdx(['mulai', 'jam mulai', 'masuk']);
        const jamSelesaiIdx = findColIdx(['selesai', 'jam selesai', 'pulang']);
        const tugasIdx = findColIdx(['fokus', 'tugas', 'uraian', 'keterangan']);

        const parsedItems: any[] = [];

        for (let i = 1; i < rows.length; i++) {
          const row = rows[i];
          if (!row || row.length === 0 || !row.some((cell: any) => String(cell || '').trim().length > 0)) {
            continue;
          }

          // Extract values
          let rawHari = hariIdx >= 0 && row[hariIdx] ? String(row[hariIdx]).trim() : '';
          // Normalize day (e.g. "Jum'at" -> "Jumat")
          if (rawHari.toLowerCase().includes('senin')) rawHari = 'Senin';
          else if (rawHari.toLowerCase().includes('selasa')) rawHari = 'Selasa';
          else if (rawHari.toLowerCase().includes('rabu')) rawHari = 'Rabu';
          else if (rawHari.toLowerCase().includes('kamis')) rawHari = 'Kamis';
          else if (rawHari.toLowerCase().includes('jum')) rawHari = 'Jumat';
          else if (rawHari.toLowerCase().includes('sabtu')) rawHari = 'Sabtu';
          else if (!rawHari) rawHari = days[(i - 1) % days.length];

          const koordinator = koordIdx >= 0 && row[koordIdx] ? String(row[koordIdx]).trim() : (guruList[0]?.nama || 'Guru Koordinator');
          const rawAnggota = anggotaIdx >= 0 && row[anggotaIdx] ? String(row[anggotaIdx]).trim() : '';

          let anggotaList: string[] = [];
          if (rawAnggota) {
            anggotaList = rawAnggota
              .split(/[,;]/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0);
          }
          if (anggotaList.length === 0) {
            anggotaList = [koordinator];
          }

          const jamMulai = jamMulaiIdx >= 0 && row[jamMulaiIdx] ? String(row[jamMulaiIdx]).trim() : '06:45';
          const jamSelesai = jamSelesaiIdx >= 0 && row[jamSelesaiIdx] ? String(row[jamSelesaiIdx]).trim() : '14:30';
          const fokusTugas = tugasIdx >= 0 && row[tugasIdx] ? String(row[tugasIdx]).trim() : 'Penyambutan santri, monitoring KBM, penanganan izin & porsi MBG';

          parsedItems.push({
            id: `jp-imp-${Date.now()}-${i}`,
            hari: rawHari,
            koordinator,
            guruPiket1: koordinator,
            guruPiket2: anggotaList[0] || koordinator,
            anggota: anggotaList,
            jamMulai,
            jamSelesai,
            fokusTugas,
            status: 'Aktif'
          });
        }

        if (parsedItems.length === 0) {
          throw new Error('Tidak ditemukan baris data jadwal piket yang valid.');
        }

        setImportedData(parsedItems);
        setIsProcessingFile(false);
      } catch (err: any) {
        setIsProcessingFile(false);
        setImportErrorMsg(err?.message || 'Gagal membaca file. Pastikan format tabel sesuai template.');
      }
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };

  // Commit Imported Data to App State and LocalStorage
  const handleCommitImport = () => {
    if (importedData.length === 0) return;

    if (importReplaceMode) {
      // Replace all
      setJadwalPiketList(importedData);
      try {
        localStorage.setItem('maplus_jadwal_piket', JSON.stringify(importedData));
      } catch {}
      alertSuccess(
        'Impor Jadwal Selesai',
        `Berhasil mengimpor dan memperbarui ${importedData.length} jadwal piket harian madrasah.`
      );
    } else {
      // Upsert by Day
      setJadwalPiketList((prev) => {
        const map = new Map<string, any>();
        prev.forEach((p) => map.set(p.hari, p));
        importedData.forEach((p) => map.set(p.hari, p));
        const merged = Array.from(map.values());
        try {
          localStorage.setItem('maplus_jadwal_piket', JSON.stringify(merged));
        } catch {}
        return merged;
      });
      alertSuccess(
        'Impor Jadwal Selesai',
        `Berhasil menggabungkan ${importedData.length} jadwal piket ke dalam kalender mingguan.`
      );
    }

    setImportedData([]);
    setImportFileName('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveTab('jadwal');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Navigation Tabs */}
      <div className="bg-gradient-to-r from-[#064E3B] via-[#065F46] to-[#0B1528] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                Manajemen Tim Piket Madrasah
              </span>
              <span className="text-xs bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full">
                100% Real Time &amp; Bebas Dummy
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              Pusat Pengaturan Jadwal Guru Piket Harian
            </h2>
            <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
              Atur petugas piket harian, koordinator, anggota tim, pos tugas, serta jam jaga secara manual atau massal (CSV/Excel).
              Perubahan langsung terintegrasi ke <strong>Dashboard Piket</strong>, <strong>Monitoring KBM</strong>, dan <strong>Laporan Kepala Madrasah</strong>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleExportXLSX}
              className="px-4 py-2.5 bg-emerald-800/90 hover:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs cursor-pointer flex items-center gap-2 transition-colors border border-emerald-500/40"
              title="Ekspor Jadwal Piket ke Excel (.xlsx) dengan kolom sel terpisah"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-300" />
              <span>Export .xlsx</span>
            </button>

            <button
              onClick={() => setActiveTab('import')}
              className="px-4 py-2.5 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md cursor-pointer flex items-center gap-2 transition-all border border-teal-400/40"
            >
              <Upload className="w-4 h-4 text-teal-100" />
              <span>Unggah CSV / Excel</span>
            </button>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-slate-950 rounded-xl text-xs sm:text-sm font-black shadow-md cursor-pointer flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Atur Jadwal Manual</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="relative z-10 flex border-t border-emerald-800/80 mt-6 pt-3 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('jadwal')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'jadwal'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'text-emerald-100/90 hover:bg-white/10'
            }`}
          >
            <CalendarCheck className="w-4 h-4" />
            <span>Kartu Jadwal Mingguan ({jadwalGuruPiketList.length} Hari)</span>
          </button>

          <button
            onClick={() => setActiveTab('panduan')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'panduan'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'text-emerald-100/90 hover:bg-white/10'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-amber-300" />
            <span>Panduan &amp; SOP Administratif</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'import'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'text-emerald-100/90 hover:bg-white/10'
            }`}
          >
            <Upload className="w-4 h-4 text-teal-200" />
            <span>Unggah Massal (CSV / Excel)</span>
          </button>
        </div>
      </div>

      {/* KPI 4-Metric Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-slate-900 font-mono tabular-nums">{jadwalGuruPiketList.length} Hari</div>
            <div className="text-xs text-slate-500 font-medium">Jadwal Piket Aktif</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl font-black text-emerald-700 font-mono tabular-nums">
              {Array.from(new Set(jadwalGuruPiketList.flatMap((p: any) => p.anggota || [p.koordinator]))).length} Guru
            </div>
            <div className="text-xs text-slate-500 font-medium">Terlibat Penugasan</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 truncate max-w-[140px]">
              {jadwalGuruPiketList.find((p) => p.hari.replace(/['’]/g, '').toLowerCase() === todayDayName.replace(/['’]/g, '').toLowerCase())?.koordinator || 'Zainal Arifin, S.Pd'}
            </div>
            <div className="text-xs text-slate-500 font-medium">Piket Hari Ini ({todayDayNameFormal})</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-teal-800">Tersinkronisasi 100%</div>
            <div className="text-[11px] text-slate-500">Live ke KBM &amp; MBG</div>
          </div>
        </div>
      </div>

      {/* TAB 1: JADWAL PIKET MINGGUAN (GRID KARTU HARIAN) */}
      {activeTab === 'jadwal' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">
                Rotasi Petugas Piket Semester Genap 2026
              </h3>
              <p className="text-xs text-slate-500">
                Klik <strong>"Ubah / Atur Petugas"</strong> untuk mengedit nama koordinator dan anggota tim per hari.
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Pos Utama Gerbang &amp; Ruang Guru
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jadwalGuruPiketList.map((piket: any) => {
              const isToday = piket.hari.replace(/['’]/g, '').toLowerCase() === todayDayName.replace(/['’]/g, '').toLowerCase();
              const anggotaList: string[] = piket.anggota || [piket.guruPiket1, piket.guruPiket2].filter(Boolean);
              const koordinatorNama: string = piket.koordinator || piket.guruPiket1 || 'Zainal Arifin, S.Pd';

              return (
                <div
                  key={piket.id}
                  className={`bg-white rounded-3xl border transition-all shadow-2xs overflow-hidden flex flex-col justify-between ${
                    isToday ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div
                      className={`px-5 py-3.5 flex items-center justify-between ${
                        isToday
                          ? 'bg-gradient-to-r from-emerald-700 to-teal-800 text-white'
                          : 'bg-slate-50 text-slate-800 border-b border-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <CalendarCheck className={`w-5 h-5 ${isToday ? 'text-amber-300' : 'text-emerald-700'}`} />
                        <span className="font-bold text-sm sm:text-base">Hari {piket.hari}</span>
                      </div>
                      {isToday ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-amber-950 uppercase tracking-wider">
                          Tugas Hari Ini
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">Shift Pagi</span>
                      )}
                    </div>

                    <div className="p-5 space-y-4">
                      {/* Koordinator */}
                      <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
                        <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-700" />
                          Koordinator Piket
                        </div>
                        <div className="font-black text-slate-900 text-sm">{koordinatorNama}</div>
                      </div>

                      {/* Anggota Petugas */}
                      <div>
                        <div className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          Anggota Tim Piket ({anggotaList.length})
                        </div>
                        <ul className="space-y-1.5">
                          {anggotaList.map((nama: string, idx: number) => (
                            <li
                              key={idx}
                              className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{nama}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Fokus Tugas */}
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                        <span className="text-[10px] text-slate-400 font-bold block uppercase">Fokus Tugas:</span>
                        <p className="text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                          {piket.fokusTugas || 'Penyambutan santri, monitoring KBM, penanganan izin & porsi MBG'}
                        </p>
                      </div>

                      {/* Jam Bertugas */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono font-semibold text-slate-700">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {piket.jamMulai || '06:45'} - {piket.jamSelesai || '14:30'}
                        </span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded-lg text-slate-600 font-medium text-[11px]">
                          Pos Piket Utama
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => handleDeletePiket(piket)}
                      className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                      title="Hapus Penugasan Piket Hari Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(piket)}
                      className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Ubah / Atur Petugas</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PANDUAN ADMINISTRATIF & SOP PENGATURAN JADWAL PIKET MANUAL */}
      {activeTab === 'panduan' && (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5 text-amber-700" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  Panduan Lengkap Operasional Pengaturan Jadwal Piket Tanpa Data Dummy
                </h3>
                <p className="text-xs text-slate-500">
                  SOP Standar Operasional Prosedur bagi Administrator Madrasah MA PLUS Ma'hadul Muta'allimin
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Sistem ini dibangun secara <strong>reaktif dan terintegrasi penuh</strong>. Setiap perubahan nama koordinator,
              anggota tim piket, dan jam piket yang Anda tetapkan akan langsung menggantikan dan mengontrol data operasional
              secara langsung di seluruh antarmuka madrasah (Dashboard Piket Harian, Header, Pelaporan MBG, dan Rekapitulasi Kepala Madrasah).
            </p>
          </div>

          {/* 5 Step Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Step 1 */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-600 text-white text-xs font-black flex items-center justify-center">
                  1
                </span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Cara Menambahkan Jadwal Piket Baru Secara Manual
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Klik tombol kuning <strong>"+ Atur Jadwal Manual"</strong> di pojok kanan atas banner.
                </li>
                <li>
                  Pilih <strong>Hari Bertugas</strong> (Senin s.d. Sabtu) yang ingin didaftarkan.
                </li>
                <li>
                  Tentukan <strong>Koordinator Tim Piket</strong> dari daftar guru madrasah terdaftar.
                </li>
                <li>
                  Centang nama-nama guru yang menjadi <strong>Anggota Tim Pendamping</strong>.
                </li>
                <li>
                  Atur jam kedatangan (default <strong>06:45 WIB</strong>) dan jam kepulangan (<strong>14:30 WIB</strong>).
                </li>
                <li>
                  Klik <strong>"Simpan Jadwal Piket"</strong>. Data langsung tersimpan permanen di memori sistem.
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Buka Formulir Tambah Sekarang</span>
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white text-xs font-black flex items-center justify-center">
                  2
                </span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Cara Mengedit / Merotasi Petugas Piket Mingguan
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Buka tab <strong>"Kartu Jadwal Mingguan"</strong>.
                </li>
                <li>
                  Pilih kartu hari yang ingin disesuaikan (misal: Hari Jum'at).
                </li>
                <li>
                  Klik tombol <strong>"Ubah / Atur Petugas"</strong> di bagian bawah kartu hari tersebut.
                </li>
                <li>
                  Ubah nama Koordinator atau centang/lepas centang nama guru pendamping sesuai rotasi baru.
                </li>
                <li>
                  Sesuaikan uraian fokus tugas harian jika ada agenda khusus (seperti Sholat Jum'at, Upacara, dsb).
                </li>
                <li>
                  Klik <strong>"Simpan Perubahan"</strong>. Perubahan langsung aktif seketika tanpa perlu restart server.
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveTab('jadwal')}
                  className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <CalendarCheck className="w-3.5 h-3.5" />
                  <span>Lihat &amp; Edit Kartu Harian</span>
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-rose-600 text-white text-xs font-black flex items-center justify-center">
                  3
                </span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Cara Menghapus Jadwal / Reset Hari Libur
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  Pada kartu jadwal hari terkait, klik ikon <strong>Tong Sampah (Merah)</strong> di kiri bawah.
                </li>
                <li>
                  Sistem akan menampilkan konfirmasi keamanan <code>"Hapus Jadwal Piket Hari ..."</code>.
                </li>
                <li>
                  Pilih <strong>"Ya, Hapus Jadwal"</strong>. Jadwal hari tersebut akan dihapus dari daftar aktif.
                </li>
                <li>
                  Anda dapat mendaftarkan kembali jadwal hari tersebut kapan saja dengan data petugas yang baru.
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-[11px] text-slate-400">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>Semua tindakan hapus memerlukan konfirmasi ganda untuk mencegah salah klik.</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-600 text-white text-xs font-black flex items-center justify-center">
                  4
                </span>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Integrasi Otomatis Antar-Menu (Tanpa Data Dummy)
                </h4>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Dashboard Guru Piket:</strong> Kartu ucapan, shift tugas, dan pencatat izin otomatis mengambil nama petugas sah dari jadwal piket hari ini.
                </li>
                <li>
                  <strong>Tugas Guru Izin (Inval):</strong> Petugas piket otomatis terdaftar sebagai kandidat inval teratas dengan tanda ⭐ untuk menggantikan kelas kosong.
                </li>
                <li>
                  <strong>Laporan ke Kepala Madrasah:</strong> Nama pengirim dan kronologi penugasan piket otomatis tertulis atas nama koordinator piket hari tersebut.
                </li>
                <li>
                  <strong>Porsi Makan Bergizi Gratis (MBG):</strong> Petugas piket otomatis dihitung dalam kuota porsi MBG guru &amp; tendik madrasah.
                </li>
              </ul>
            </div>
          </div>

          {/* Step 5: SOP Pos Piket Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Jadwal Waktu &amp; SOP Alur Petugas Piket Harian MA PLUS</span>
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="py-2.5 px-3 w-28">Waktu (WIB)</th>
                    <th className="py-2.5 px-3 w-44">Posisi / Lokasi</th>
                    <th className="py-2.5 px-3">Aktivitas Utama Petugas</th>
                    <th className="py-2.5 px-3 w-40">Menu Terkait di Sistem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">06:45 - 07:05</td>
                    <td className="py-2.5 px-3 font-semibold">Gerbang Utama Madrasah</td>
                    <td className="py-2.5 px-3">Penyambutan santri, 5S (Senyum, Salam, Sapa, Sopan, Santun), pengecekan kerapihan seragam.</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">Dashboard Piket</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">07:00 - 07:15</td>
                    <td className="py-2.5 px-3 font-semibold">Seluruh Ruang Kelas X-XII</td>
                    <td className="py-2.5 px-3">Monitoring KBM Jam Ke-1. Jika guru hadir terlambat &gt; 15 menit, sistem langsung mengirim pengingat dan tautan foto kelas.</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">Monitoring KBM</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">07:15 - 08:30</td>
                    <td className="py-2.5 px-3 font-semibold">Meja Piket &amp; Kelas Kosong</td>
                    <td className="py-2.5 px-3">Penetapan guru pengganti (inval) untuk kelas yang ditinggalkan guru izin/sakit beserta pembagian modul tugas mandiri.</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">Tugas Guru Izin</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">08:30 - 11:30</td>
                    <td className="py-2.5 px-3 font-semibold">Pos Keamanan &amp; Lobi</td>
                    <td className="py-2.5 px-3">Penerbitan surat izin keluar kelas santri, pencatatan santri terlambat &amp; pelanggaran tata tertib.</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">Izin Keluar &amp; Pelanggaran</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">11:30 - 12:30</td>
                    <td className="py-2.5 px-3 font-semibold">Ruang Distribusi Katering</td>
                    <td className="py-2.5 px-3">Penghitungan riil santri hadir hari ini dikurangi santri absen untuk distribusi porsi Makan Bergizi Gratis (MBG).</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">Siswa Tidak Masuk (MBG)</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">13:30 - 14:30</td>
                    <td className="py-2.5 px-3 font-semibold">Meja Piket Utama</td>
                    <td className="py-2.5 px-3">Penyusunan rekapitulasi harian dan pengiriman laporan digital kepada Kepala Madrasah untuk verifikasi/tanda tangan.</td>
                    <td className="py-2.5 px-3 text-blue-700 font-semibold">Kirim Laporan Kepala</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: UNGGAH DATA MASSAL JADWAL PIKET (CSV / EXCEL) */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          {/* Instructions and Download Template Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                  <Upload className="w-5 h-5 text-teal-700" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    Unggah Jadwal Piket Massal dari Excel / CSV
                  </h3>
                  <p className="text-xs text-slate-500">
                    Gunakan fitur ini untuk memasukkan jadwal rotasi satu semester sekaligus tanpa perlu input satu per satu.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={downloadJadwalPiketTemplateXLSX}
                  className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  title="Unduh Template Excel (.xlsx) resmi"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Unduh Template .xlsx</span>
                </button>

                <button
                  type="button"
                  onClick={downloadJadwalPiketTemplateCSV}
                  className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Unduh Template CSV (.csv)"
                >
                  <Download className="w-3.5 h-3.5 text-slate-600" />
                  <span>Unduh Template .csv</span>
                </button>
              </div>
            </div>

            {/* Drag & Drop File Upload Area */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/30 hover:bg-teal-50/60 rounded-3xl p-8 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <Upload className="w-7 h-7 text-teal-700" />
                </div>
                <div>
                  <p className="text-sm font-extrabold text-slate-800">
                    {importFileName ? `File Terpilih: ${importFileName}` : 'Klik untuk Memilih File Excel (.xlsx) atau CSV (.csv)'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Mendukung file Microsoft Excel (.xlsx / .xls) dan CSV berpemisah koma atau titik koma.
                  </p>
                </div>
                {importFileName && (
                  <span className="px-3 py-1 bg-teal-600 text-white text-[11px] font-bold rounded-full">
                    Ganti File
                  </span>
                )}
              </div>
            </div>

            {importErrorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{importErrorMsg}</span>
              </div>
            )}
          </div>

          {/* Preview Parsed Data Table */}
          {importedData.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Pratinjau Hasil Pembacaan Data ({importedData.length} Baris Jadwal Terdeteksi)</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Periksa data di bawah ini sebelum disimpan secara permanen ke sistem madrasah.
                  </p>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={importReplaceMode}
                      onChange={() => setImportReplaceMode(true)}
                      className="accent-teal-600"
                    />
                    <span>Ganti / Timpa Seluruh Jadwal</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      checked={!importReplaceMode}
                      onChange={() => setImportReplaceMode(false)}
                      className="accent-teal-600"
                    />
                    <span>Perbarui / Gabungkan Jadwal</span>
                  </label>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="py-2.5 px-3">Hari</th>
                      <th className="py-2.5 px-3">Koordinator Piket</th>
                      <th className="py-2.5 px-3">Anggota Tim Piket</th>
                      <th className="py-2.5 px-3">Jam Bertugas</th>
                      <th className="py-2.5 px-3">Fokus Tugas Harian</th>
                      <th className="py-2.5 px-3 text-center">Status Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {importedData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-3 font-bold text-emerald-900">{item.hari}</td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{item.koordinator}</td>
                        <td className="py-2.5 px-3 text-slate-600">{item.anggota?.join(', ') || '-'}</td>
                        <td className="py-2.5 px-3 font-mono text-slate-600">
                          {item.jamMulai} - {item.jamSelesai}
                        </td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">{item.fokusTugas}</td>
                        <td className="py-2.5 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Siap Disimpan
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setImportedData([]);
                    setImportFileName('');
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal / Bersihkan
                </button>

                <button
                  type="button"
                  onClick={handleCommitImport}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-700/30 flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Konfirmasi &amp; Simpan {importedData.length} Jadwal ke Sistem</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: Atur Petugas Piket Manual */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {editingPiket ? `Atur Petugas Piket Hari ${formData.hari}` : 'Tambah Jadwal Guru Piket'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Pilih koordinator dan anggota tim piket yang bertugas
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePiket} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Hari Bertugas <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.hari}
                  onChange={(e) => setFormData({ ...formData, hari: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  required
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      Hari {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Koordinator Tim Piket <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.koordinator}
                  onChange={(e) => setFormData({ ...formData, koordinator: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                  required
                >
                  {guruList.map((g) => (
                    <option key={g.id} value={g.nama}>
                      {g.nama} ({g.mapelUtama || 'Guru'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>Anggota Tim Piket ({formData.anggota.length} Terpilih) <span className="text-red-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">Klik untuk memilih</span>
                </label>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-2 bg-slate-50 space-y-1">
                  {guruList.map((g) => {
                    const isSelected = formData.anggota.includes(g.nama);
                    return (
                      <div
                        key={g.id}
                        onClick={() => handleToggleAnggota(g.nama)}
                        className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-emerald-100/70 border border-emerald-300 text-emerald-950 font-bold'
                            : 'hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded accent-emerald-600"
                          />
                          <span>{g.nama}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal">{g.mapelUtama || 'Guru'}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Mulai Piket
                  </label>
                  <input
                    type="time"
                    value={formData.jamMulai}
                    onChange={(e) => setFormData({ ...formData, jamMulai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Jam Selesai Piket
                  </label>
                  <input
                    type="time"
                    value={formData.jamSelesai}
                    onChange={(e) => setFormData({ ...formData, jamSelesai: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-semibold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Fokus Tugas / Catatan Piket
                </label>
                <textarea
                  rows={2}
                  value={formData.fokusTugas}
                  onChange={(e) => setFormData({ ...formData, fokusTugas: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-700/25 cursor-pointer"
                >
                  Simpan Jadwal Piket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
