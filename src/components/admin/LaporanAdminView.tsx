import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FileSpreadsheet,
  Printer,
  Download,
  Calendar,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Award
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const LaporanAdminView: React.FC = () => {
  const { guruTidakMasukList, kendalaList, siswaList, alertSuccess } = useApp();

  const [activeTab, setActiveTab] = useState<'rekap-piket' | 'rekap-siswa' | 'laporan-kepala'>('rekap-piket');
  const [bulan, setBulan] = useState('09');
  const [tahun, setTahun] = useState('2026');

  const handleExportReportXLSX = () => {
    if (activeTab === 'rekap-piket') {
      const headers = ['No', 'Tanggal', 'Guru Piket Bertugas', 'Status Pelaksanaan', 'Kelas Dimonitor', 'Guru Tidak Masuk', 'Guru Pengganti', 'Siswa Sakit/Izin', 'Siswa Terlambat'];
      const rows = [
        ['1', '01-09-2026', 'Zainal Arifin, S.Pd', 'Terlaksana', '12 / 12', '2', '2', '10', '6'],
        ['2', '02-09-2026', 'Ahmad Fauzan, S.Pd', 'Terlaksana', '12 / 12', '0', '0', '8', '4'],
        ['3', '03-09-2026', 'Abdul Malik, S.Ag', 'Terlaksana', '12 / 12', '1', '1', '7', '5'],
        ['4', '04-09-2026', 'Fathan Rizky, S.Pd', 'Hari Ini', '12 / 12', '3', '2', '12', '8']
      ];
      exportToXLSX({
        filename: `Rekap_Piket_MAPLUS_${bulan}_${tahun}.xlsx`,
        sheetName: 'Rekap Guru Piket',
        headers,
        data: rows,
        colWidths: [8, 16, 26, 20, 18, 18, 18, 18, 18]
      });
      alertSuccess('Ekspor Berhasil', `Rekap piket bulan ${bulan}/${tahun} berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah rapi.`);
    } else {
      const headers = ['No', 'Kelas', 'Jumlah Siswa', 'Rata-rata Hadir (%)', 'Sakit (S)', 'Izin (I)', 'Alpa (A)', 'Porsi MBG Terdistribusi'];
      const rows = [
        ['1', 'X A', '28', '94.2%', '1', '1', '0', '26'],
        ['2', 'X B', '30', '93.3%', '2', '0', '0', '28'],
        ['3', 'X C', '29', '96.5%', '1', '0', '0', '28'],
        ['4', 'XI A', '32', '90.6%', '2', '1', '0', '29'],
        ['5', 'XI B', '31', '93.5%', '1', '1', '0', '29'],
        ['6', 'XII A', '28', '96.4%', '1', '0', '0', '27'],
        ['7', 'XII B', '27', '96.3%', '1', '0', '0', '26'],
        ['8', 'XII IPS', '26', '92.3%', '1', '1', '0', '24']
      ];
      exportToXLSX({
        filename: `Rekap_Presensi_Siswa_MAPLUS_${bulan}_${tahun}.xlsx`,
        sheetName: 'Rekap Presensi Siswa',
        headers,
        data: rows,
        colWidths: [8, 14, 16, 22, 14, 14, 14, 26]
      });
      alertSuccess('Ekspor Berhasil', `Rekap presensi siswa bulan ${bulan}/${tahun} berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah rapi.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Export Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-slate-700">Periode Rekap:</span>
          </div>

          <select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="07">Juli 2026</option>
            <option value="08">Agustus 2026</option>
            <option value="09">September 2026</option>
            <option value="10">Oktober 2026</option>
          </select>

          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 bg-white font-medium text-slate-700"
          >
            <option value="2026">Tahun 2026</option>
            <option value="2027">Tahun 2027</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            Cetak PDF
          </button>
          <button
            onClick={handleExportReportXLSX}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('rekap-piket')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'rekap-piket'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Rekapitulasi Kinerja Guru Piket
        </button>
        <button
          onClick={() => setActiveTab('rekap-siswa')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'rekap-siswa'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Rekapitulasi Kehadiran & Pelanggaran Siswa
        </button>
        <button
          onClick={() => setActiveTab('laporan-kepala')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'laporan-kepala'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Laporan Eksekutif Bulanan Kepala Madrasah
        </button>
      </div>

      {activeTab === 'rekap-piket' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Hari Kerja Efektif</div>
              <div className="text-2xl font-bold text-slate-800 mt-1">24 Hari</div>
              <div className="text-[11px] text-emerald-600 mt-0.5">100% Picket Terisi</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Total Sesi KBM Terpantau</div>
              <div className="text-2xl font-bold text-blue-700 mt-1">192 Jam</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Rata-rata 8 jam/hari</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Guru Pengganti Ditugaskan</div>
              <div className="text-2xl font-bold text-amber-600 mt-1">8 Kali</div>
              <div className="text-[11px] text-slate-400 mt-0.5">100% kelas tercover</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="text-xs text-slate-500 font-medium">Kendala Selesai Ditangani</div>
              <div className="text-2xl font-bold text-emerald-600 mt-1">
                {kendalaList.filter((k: any) => k.status === 'Sudah Ditindaklanjuti' || k.status === 'Selesai').length} / {kendalaList.length}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">Tingkat resolusi 75%</div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200 font-bold text-slate-800">
              Daftar Petugas Piket & Rekap Keterisian Laporan
            </div>
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Koordinator Piket</th>
                  <th className="py-3 px-4">Status KBM</th>
                  <th className="py-3 px-4 text-center">Izin Guru</th>
                  <th className="py-3 px-4 text-center">Siswa Terlambat</th>
                  <th className="py-3 px-4 text-center">Status Laporan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">04 September 2026</td>
                  <td className="py-3.5 px-4">Zainal Arifin, S.Pd</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-medium">Tertib Terkendali</td>
                  <td className="py-3.5 px-4 text-center font-bold">2 Guru</td>
                  <td className="py-3.5 px-4 text-center font-bold text-amber-600">5 Siswa</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      Terkirim ke Kepala
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">03 September 2026</td>
                  <td className="py-3.5 px-4">M. Ridwan, S.Kom</td>
                  <td className="py-3.5 px-4 text-emerald-700 font-medium">Lengkap & Tertib</td>
                  <td className="py-3.5 px-4 text-center font-bold">1 Guru</td>
                  <td className="py-3.5 px-4 text-center font-bold text-amber-600">3 Siswa</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Disetujui Kepala
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'rekap-siswa' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-slate-800">Rekapitulasi Kehadiran & Ketertiban Santri</h3>
              <p className="text-xs text-slate-500">Tingkat kehadiran madrasah bulan September 2026 mencapai 96.7%</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-600">96.7%</div>
              <div className="text-xs text-slate-400">Rata-rata Presensi</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 text-center py-2">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <div className="text-xl font-bold text-emerald-700">356</div>
              <div className="text-xs text-emerald-600 font-medium">Rata-rata Hadir/Hari</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
              <div className="text-xl font-bold text-blue-700">4</div>
              <div className="text-xs text-blue-600 font-medium">Rata-rata Sakit (S)</div>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <div className="text-xl font-bold text-amber-700">6</div>
              <div className="text-xs text-amber-600 font-medium">Rata-rata Izin (I)</div>
            </div>
            <div className="p-3 bg-rose-50 rounded-xl">
              <div className="text-xl font-bold text-rose-700">2</div>
              <div className="text-xs text-rose-600 font-medium">Tanpa Keterangan (A)</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'laporan-kepala' && (
        <div className="bg-white rounded-2xl border border-slate-300 p-8 shadow-xs max-w-4xl mx-auto space-y-6">
          <div className="text-center border-b-2 border-slate-800 pb-4">
            <h2 className="font-bold text-lg text-slate-900 tracking-wide uppercase">
              MA PLUS MA'HADUL MUTA'ALLIMIN
            </h2>
            <p className="text-xs text-slate-600">
              Jl. Imogiri Timur Km. 10, Bantul, D.I. Yogyakarta · NSM: 131232050012 · NPSN: 69982415
            </p>
            <h3 className="font-bold text-base text-emerald-950 uppercase mt-4">
              LAPORAN BULANAN KETERTIBAN & KINERJA GURU PIKET
            </h3>
            <p className="text-xs text-slate-500">Periode: September 2026</p>
          </div>

          <div className="space-y-4 text-sm text-slate-800 leading-relaxed">
            <p>
              Berdasarkan hasil pemantauan dan pencatatan harian oleh Tim Guru Piket MA PLUS Ma'hadul Muta'allimin,
              dengan ini dilaporkan pelaksanaan kegiatan belajar mengajar dan ketertiban madrasah sebagai berikut:
            </p>

            <ol className="list-decimal pl-5 space-y-2 text-xs">
              <li>
                <strong>Tingkat Keterlaksanaan KBM:</strong> Mencapai 98.2% dengan penugasan guru pengganti pada kelas
                yang gurunya berhalangan hadir.
              </li>
              <li>
                <strong>Distribusi Porsi MBG:</strong> Program Makan Bergizi Gratis telah tersalurkan secara konsisten
                sebanyak rata-rata 356 porsi per hari belajar efektif.
              </li>
              <li>
                <strong>Kedisiplinan Siswa:</strong> Tercatat penurunan angka keterlambatan santri sebesar 14%
                dibandingkan bulan sebelumnya berkat pengetatan di pos gerbang piket.
              </li>
              <li>
                <strong>Tindak Lanjut Fasilitas:</strong> Masalah proyektor dan AC ruang kelas telah dikoordinasikan
                dengan unit Sarana & Prasarana.
              </li>
            </ol>
          </div>

          <div className="pt-8 flex justify-between items-end text-xs">
            <div className="text-center">
              <div>Mengetahui,</div>
              <div className="font-semibold">Koordinator Guru Piket</div>
              <div className="h-16 flex items-center justify-center font-serif italic text-emerald-800 text-sm">
                Zainal Arifin
              </div>
              <div className="font-bold text-slate-900 underline">Zainal Arifin, S.Pd</div>
              <div className="text-slate-500">NIP. 19850112 201001 1 004</div>
            </div>

            <div className="text-center">
              <div>Bantul, 30 September 2026</div>
              <div className="font-semibold">Kepala MA PLUS Ma'hadul Muta'allimin</div>
              <div className="h-16 flex items-center justify-center">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 font-bold rounded-lg border border-emerald-300 shadow-2xs">
                  ✓ TELAH DITANDATANGANI
                </span>
              </div>
              <div className="font-bold text-slate-900 underline">Drs. H. Syahrul Munir, M.Pd.I</div>
              <div className="text-slate-500">NIP. 19720315 199803 1 003</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
