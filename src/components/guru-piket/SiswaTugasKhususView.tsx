import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCw,
  Search,
  Plus,
  Eye,
  Check,
  ChevronRight,
  Info,
  Calendar,
  X,
  FileSpreadsheet
} from 'lucide-react';
import { exportToXLSX } from '../../utils/excelHelper';

export const SiswaTugasKhususView: React.FC = () => {
  const { tugasKhususList, setTugasKhususList, markTugasKhususReturned, confirmAction, alertSuccess } = useApp();
  const [activeTab, setActiveTab] = useState<'hari-ini' | 'data-siswa' | 'rekap' | 'pengaturan'>('hari-ini');
  const [selectedStudent, setSelectedStudent] = useState<any>(tugasKhususList[0]);
  const [filterProgram, setFilterProgram] = useState('Semua');
  const [filterKelas, setFilterKelas] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = tugasKhususList.filter((item) => {
    const matchProg = filterProgram === 'Semua' || item.program === filterProgram;
    const matchKelas = filterKelas === 'Semua' || item.kelas === filterKelas;
    const matchStatus = filterStatus === 'Semua' || item.statusHariIni.includes(filterStatus);
    const matchSearch = item.nama.toLowerCase().includes(searchQuery.toLowerCase());
    return matchProg && matchKelas && matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* 6 Top Metric Widgets */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">28</p>
          <p className="text-xs text-slate-500 font-medium">Total Siswa Tugas Khusus</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">20</p>
          <p className="text-xs text-slate-500 font-medium">Program Tetap (Aktif)</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">8</p>
          <p className="text-xs text-slate-500 font-medium">Utusan / Insidental</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">16</p>
          <p className="text-xs text-slate-500 font-medium">Sedang Bertugas</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono tabular-nums">10</p>
          <p className="text-xs text-slate-500 font-medium">Sudah Selesai</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2 font-mono tabular-nums">2</p>
          <p className="text-xs text-rose-800 font-medium">Melebihi Waktu</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('hari-ini')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'hari-ini'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          Daftar Hari Ini (STU)
        </button>
        <button
          onClick={() => setActiveTab('data-siswa')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'data-siswa'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          Data Siswa & Program
        </button>
        <button
          onClick={() => setActiveTab('rekap')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rekap'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          Rekap & Riwayat
        </button>
        <button
          onClick={() => setActiveTab('pengaturan')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'pengaturan'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-white'
          }`}
        >
          Pengaturan Program
        </button>
      </div>

      {/* Filters & Actions */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>04/09/2026</span>
          </div>

          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Program</option>
            <option value="Tahfidz Al-Qur'an">Tahfidz Al-Qur'an</option>
            <option value="Perpustakaan">Perpustakaan</option>
            <option value="Tim IT Madrasah">Tim IT Madrasah</option>
            <option value="Kader Adiwiyata">Kader Adiwiyata</option>
          </select>

          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Kelas</option>
            <option value="XA">XA</option>
            <option value="XB">XB</option>
            <option value="XIA">XIA</option>
            <option value="XIIA">XIIA</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-medium"
          >
            <option value="Semua">Semua Status</option>
            <option value="Sedang Bertugas">Sedang Bertugas</option>
            <option value="Dalam waktu kembali">Dalam Waktu Kembali</option>
            <option value="Selesai">Selesai</option>
            <option value="Melebihi Waktu">Melebihi Waktu</option>
          </select>

          <div className="relative min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama siswa atau NIS..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterProgram('Semua');
              setFilterKelas('Semua');
              alertSuccess('Data Dimuat Ulang', 'Daftar santri tugas khusus telah disegarkan.');
            }}
            className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 transition-colors cursor-pointer"
            title="Muat Ulang Data"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const headers = ['No', 'NIS', 'Nama Siswa', 'Kelas', 'Program Khusus', 'Waktu Mulai', 'Lapor Selesai', 'Status'];
              const data = tugasKhususList.map((item, idx) => [
                idx + 1,
                item.nis,
                item.nama,
                item.kelas,
                item.program,
                item.mulaiTugas,
                item.laporSelesai || 'Sedang Bertugas',
                item.statusHariIni
              ]);
              exportToXLSX({
                filename: `Siswa_Tugas_Khusus_${new Date().toISOString().slice(0, 10)}.xlsx`,
                sheetName: 'Tugas Khusus',
                headers,
                data,
                colWidths: [6, 14, 26, 12, 24, 14, 16, 16]
              });
              alertSuccess('Export Berhasil', 'Data siswa tugas khusus berhasil diekspor ke file Excel (.xlsx) dengan kolom sel terpisah.');
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Ekspor ke Excel (.xlsx) dengan kolom sel terpisah"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export .xlsx</span>
          </button>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Siswa Tugas Khusus</span>
        </button>
      </div>

      {/* Main Content: Left Table & Right Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
                <tr>
                  <th className="py-3 px-3">No</th>
                  <th className="py-3 px-3">Nama Siswa</th>
                  <th className="py-3 px-3">Kelas</th>
                  <th className="py-3 px-3">Program / Tugas</th>
                  <th className="py-3 px-3">Mulai</th>
                  <th className="py-3 px-3">Lapor Selesai</th>
                  <th className="py-3 px-3">Batas Kembali</th>
                  <th className="py-3 px-3">Kembali</th>
                  <th className="py-3 px-3">Status Hari Ini</th>
                  <th className="py-3 px-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((item, idx) => (
                  <tr
                    key={item.id}
                    onClick={() => setSelectedStudent(item)}
                    className={`hover:bg-blue-50/40 cursor-pointer transition-colors ${
                      selectedStudent?.id === item.id ? 'bg-blue-50/60' : ''
                    }`}
                  >
                    <td className="py-3 px-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">{item.nama}</td>
                    <td className="py-3 px-3 font-semibold text-blue-600">{item.kelas}</td>
                    <td className="py-3 px-3 text-slate-800">{item.program}</td>
                    <td className="py-3 px-3 font-mono">{item.mulaiTugas}</td>
                    <td className="py-3 px-3 font-mono">{item.laporSelesai || '-'}</td>
                    <td className="py-3 px-3 font-mono text-slate-500">{item.batasKembali || '-'}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      {item.kembali || '-'}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-block ${
                          item.statusHariIni.includes('Selesai')
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.statusHariIni.includes('Dalam waktu')
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.statusHariIni.includes('Melebihi')
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {item.statusHariIni}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      {item.statusHariIni === 'Sedang Bertugas' && (
                        <button
                          onClick={() => {
                            confirmAction({
                              title: 'Konfirmasi Lapor Selesai',
                              message: `Konfirmasi bahwa santri "${item.nama}" telah selesai bertugas program ${item.program} dan mulai kembali ke kelas?`,
                              confirmText: 'Ya, Tandai Selesai',
                              onConfirm: () => {
                                const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                setTugasKhususList(prev => prev.map(t => t.id === item.id ? {
                                  ...t,
                                  statusHariIni: 'Dalam waktu kembali',
                                  laporSelesai: now,
                                  batasKembali: 'Dalam 15 menit'
                                } : t));
                                setSelectedStudent((prev: any) => prev?.id === item.id ? {
                                  ...prev,
                                  statusHariIni: 'Dalam waktu kembali',
                                  laporSelesai: now,
                                  batasKembali: 'Dalam 15 menit'
                                } : prev);
                                alertSuccess('Status Diperbarui', `Laporan selesai tugas khusus untuk ${item.nama} telah dicatat.`);
                              }
                            });
                          }}
                          className="px-2.5 py-1 bg-blue-600 text-white rounded-lg text-[10px] font-bold hover:bg-blue-700 cursor-pointer shadow-2xs"
                        >
                          Lapor Selesai
                        </button>
                      )}
                      {item.statusHariIni.includes('Melebihi') && (
                        <button
                          onClick={() => {
                            confirmAction({
                              title: 'Konfirmasi Santri Kembali',
                              message: `Konfirmasi bahwa santri "${item.nama}" telah tiba kembali di kelas ${item.kelas}?`,
                              confirmText: 'Ya, Sudah Kembali',
                              onConfirm: () => {
                                markTugasKhususReturned(item.id);
                                alertSuccess('Tuntas', `Santri ${item.nama} telah dicatat kembali ke kelas.`);
                              }
                            });
                          }}
                          className="px-2.5 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700 cursor-pointer shadow-2xs"
                        >
                          Kembali
                        </button>
                      )}
                      {item.statusHariIni.includes('Dalam waktu') && (
                        <button
                          onClick={() => {
                            confirmAction({
                              title: 'Konfirmasi Santri Kembali',
                              message: `Konfirmasi bahwa santri "${item.nama}" telah tiba kembali di kelas ${item.kelas}?`,
                              confirmText: 'Ya, Sudah Kembali',
                              onConfirm: () => {
                                markTugasKhususReturned(item.id);
                                alertSuccess('Tuntas', `Santri ${item.nama} telah dicatat kembali ke kelas.`);
                              }
                            });
                          }}
                          className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer"
                          title="Tandai Sudah Kembali"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {item.statusHariIni.includes('Selesai') && (
                        <span className="text-[10px] font-bold text-emerald-600 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tuntas</span>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Detail Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Detail Tugas Siswa
            </h4>
            <span className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
              {selectedStudent?.program}
            </span>
          </div>

          {selectedStudent && (
            <div className="space-y-4 text-xs">
              {/* Profile Card */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-blue-200 text-blue-800 font-bold flex items-center justify-center text-sm">
                  {selectedStudent.nama.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 text-sm">{selectedStudent.nama}</h5>
                  <p className="text-slate-400 font-mono text-[11px]">
                    NIS: {selectedStudent.nis} · Kelas {selectedStudent.kelas}
                  </p>
                  <p className="text-slate-600 text-[11px] mt-0.5">
                    Pembimbing: <strong>{selectedStudent.pembimbing}</strong>
                  </p>
                </div>
              </div>

              {/* Step-by-Step Progress Timeline */}
              <div className="space-y-3 pt-2">
                <p className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">
                  Timeline Hari Ini
                </p>

                <div className="space-y-3 pl-2 border-l-2 border-blue-200 ml-2">
                  <div className="relative pl-4">
                    <span className="absolute -left-[13px] top-0.5 w-3 h-3 rounded-full bg-blue-600 ring-2 ring-white"></span>
                    <span className="font-mono font-bold text-slate-900 block">
                      {selectedStudent.mulaiTugas}
                    </span>
                    <p className="text-[11px] text-slate-500">Mulai bertugas (dicatat saat berangkat)</p>
                  </div>

                  <div className="relative pl-4">
                    <span className="absolute -left-[13px] top-0.5 w-3 h-3 rounded-full bg-blue-600 ring-2 ring-white"></span>
                    <span className="font-mono font-bold text-slate-900 block">
                      {selectedStudent.laporSelesai || '08:10'}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Lapor selesai oleh Ustadz ({selectedStudent.catatan || 'Hafalan 10 juz'})
                    </p>
                  </div>

                  <div className="relative pl-4">
                    <span className="absolute -left-[13px] top-0.5 w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white"></span>
                    <span className="font-mono font-bold text-slate-900 block">
                      {selectedStudent.batasKembali || '08:30 – 08:35'}
                    </span>
                    <p className="text-[11px] text-slate-500">Rentang waktu kembali (20-25 menit)</p>
                  </div>

                  <div className="relative pl-4">
                    <span
                      className={`absolute -left-[13px] top-0.5 w-3 h-3 rounded-full ring-2 ring-white ${
                        selectedStudent.kembali && selectedStudent.kembali !== '-'
                          ? 'bg-emerald-500'
                          : 'bg-slate-300'
                      }`}
                    ></span>
                    <span className="font-mono font-bold text-slate-900 block">
                      {selectedStudent.kembali && selectedStudent.kembali !== '-'
                        ? selectedStudent.kembali
                        : 'Belum kembali'}
                    </span>
                    <p className="text-[11px] text-slate-500">
                      {selectedStudent.kembali && selectedStudent.kembali !== '-'
                        ? 'Siswa sudah sampai kelas dengan tertib'
                        : 'Siswa masih dalam perjalanan kembali'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Alert Box */}
              <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                  Status Saat Ini
                </span>
                <p className="font-bold text-blue-900">{selectedStudent.statusHariIni}</p>
                <p className="text-[11px] text-blue-700">
                  Sisa toleransi waktu kembali: 15 menit
                </p>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  confirmAction({
                    title: 'Konfirmasi Siswa Kembali',
                    message: `Konfirmasi bahwa santri "${selectedStudent.nama}" telah tiba dan kembali belajar di kelas ${selectedStudent.kelas}?`,
                    confirmText: 'Ya, Tandai Kembali',
                    onConfirm: () => {
                      markTugasKhususReturned(selectedStudent.id);
                      setSelectedStudent((prev: any) => prev ? {
                        ...prev,
                        statusHariIni: 'Selesai (Tepat Waktu)',
                        kembali: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      } : prev);
                      alertSuccess('Tugas Selesai', `Santri ${selectedStudent.nama} telah kembali ke kelas.`);
                    }
                  });
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all uppercase tracking-wide text-xs cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Siswa Sudah Kembali ke Kelas</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Alur Proses Diagram */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Alur Proses Tugas Khusus (Tahfidz - Contoh)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-1 text-[11px]">
              1
            </span>
            <p className="font-bold text-slate-800">Siswa Berangkat</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Mulai tugas tahfidz</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-1 text-[11px]">
              2
            </span>
            <p className="font-bold text-slate-800">Ustadz Lapor Selesai</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Waktu tercatat otomatis</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-1 text-[11px]">
              3
            </span>
            <p className="font-bold text-slate-800">Perhitungan Sistem</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Toleransi jalan 20-25m</p>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mx-auto mb-1 text-[11px]">
              4
            </span>
            <p className="font-bold text-slate-800">Guru Piket Konfirmasi</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Klik "Siswa Sudah Kembali"</p>
          </div>

          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
            <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center mx-auto mb-1 text-[11px]">
              5
            </span>
            <p className="font-bold text-emerald-900">Status Akhir Selesai</p>
            <p className="text-[10px] text-emerald-700 mt-0.5">Tepat Waktu / Disiplin</p>
          </div>
        </div>
      </div>
    </div>
  );
};
