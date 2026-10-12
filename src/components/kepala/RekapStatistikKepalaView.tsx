import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const RekapStatistikKepalaView: React.FC = () => {
  const { alertSuccess } = useApp();
  const [periode, setPeriode] = useState('Bulanan');

  const handleExportXLSX = () => {
    const headers = ['Indikator Kinerja Madrasah', 'Capaian Saat Ini', 'Target Minimum', 'Status Ketercapaian'];
    const rows = [
      ['Tingkat Kehadiran Guru', '96.4%', '95.0%', 'Melampaui Target'],
      ['Ketepatan Waktu KBM Santri', '94.8%', '90.0%', 'Sangat Baik'],
      ['Penyaluran MBG (Makan Bergizi)', '100%', '100%', 'Sempurna (128 Porsi)'],
      ['Penyelesaian Kendala Sarpras', '92.3%', '85.0%', 'Optimal'],
      ['Rasio Guru Inval Ditugaskan', '100%', '100%', 'Tuntas Tercover']
    ];

    exportToXLSX({
      filename: `Statistik_Kinerja_Madrasah_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Statistik Kinerja',
      headers,
      data: rows,
      colWidths: [32, 20, 20, 26]
    });

    alertSuccess('Export Berhasil', 'Data statistik kinerja madrasah berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah rapi.');
  };

  return (
    <div className="space-y-6">
      {/* Header and Print Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Statistik Komprehensif & Analisis Kinerja Madrasah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan agregat kehadiran guru, kedisiplinan santri, dan kelancaran program MBG semester ini.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Cetak Statistik
          </button>
          <button
            onClick={handleExportXLSX}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export (.xlsx)
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tren Kehadiran Guru</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">+1.8% vs Bulan Lalu</span>
          </div>
          <div className="text-3xl font-bold text-slate-800">97.4%</div>
          <p className="text-xs text-slate-500">
            Sebagian besar izin dikarenakan tugas kedinasan MGMP Kemenag dan kondisi sakit.
          </p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '97.4%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tren Kedisiplinan Siswa</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">96.7% Rata-rata</span>
          </div>
          <div className="text-3xl font-bold text-blue-700">0.8%</div>
          <p className="text-xs text-slate-500">
            Angka alpa/tanpa keterangan sangat minim berkat panggilan langsung ke wali santri via WhatsApp.
          </p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full" style={{ width: '96.7%' }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Distribusi Manfaat MBG</span>
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">100% Terserap</span>
          </div>
          <div className="text-3xl font-bold text-amber-600">8,544 Porsi</div>
          <p className="text-xs text-slate-500">
            Total porsi makan bergizi tersalurkan selama bulan September 2026 tanpa kendala higienitas.
          </p>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* Monthly Attendance Chart Mock */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-bold text-slate-800 text-sm">Grafik Rekap Kehadiran Mingguan (Bulan September 2026)</h3>
          <span className="text-xs text-slate-400">Diperbarui otomatis tiap akhir pekan</span>
        </div>

        <div className="grid grid-cols-4 gap-4 text-center pt-2">
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-slate-500">Minggu I</div>
            <div className="text-2xl font-bold text-slate-800">96.2%</div>
            <div className="text-[11px] text-emerald-600 font-medium">Tertib Penuh</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-slate-500">Minggu II</div>
            <div className="text-2xl font-bold text-slate-800">97.1%</div>
            <div className="text-[11px] text-emerald-600 font-medium">Tertib Penuh</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl space-y-2">
            <div className="text-xs font-semibold text-slate-500">Minggu III</div>
            <div className="text-2xl font-bold text-slate-800">95.8%</div>
            <div className="text-[11px] text-amber-600 font-medium">Hujan Lebat</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl space-y-2 border border-blue-200">
            <div className="text-xs font-semibold text-blue-700">Minggu IV (Berjalan)</div>
            <div className="text-2xl font-bold text-blue-800">96.7%</div>
            <div className="text-[11px] text-blue-600 font-medium">Sedang Berlangsung</div>
          </div>
        </div>
      </div>
    </div>
  );
};
