import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  FileText,
  Phone,
  Eye,
  AlertTriangle
} from 'lucide-react';
import { formatIndonesianDate } from '../../utils/dateUtils';

export const MonitoringGuruKepalaView: React.FC = () => {
  const { guruList, guruTidakMasukList } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Hadir' | 'Izin/Tidak Masuk'>('Semua');

  const absentGuruNames = new Set(guruTidakMasukList.map((g: any) => g.guruNama));

  const teacherStatuses = guruList.map((guru: any) => {
    const isAbsent = absentGuruNames.has(guru.nama);
    const absenceDetail = guruTidakMasukList.find((g: any) => g.guruNama === guru.nama);
    return {
      guru,
      statusPresensi: isAbsent ? (absenceDetail?.alasan || 'Izin') : 'Hadir Tepat Waktu',
      jamMasuk: isAbsent ? '-' : '06:45 WIB',
      guruPengganti: absenceDetail?.jadwalTerdampak?.[0]?.guruPengganti || '-',
      keterangan: absenceDetail?.keterangan || 'Mengajar Sesuai Jadwal'
    };
  });

  const filtered = teacherStatuses.filter((item: any) => {
    const matchSearch = item.guru.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const isHadir = item.statusPresensi === 'Hadir Tepat Waktu';
    const matchStatus =
      statusFilter === 'Semua' ? true : statusFilter === 'Hadir' ? isHadir : !isHadir;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{guruList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Dewan Guru</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {guruList.length - guruTidakMasukList.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Guru Hadir Hari Ini</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <UserX className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600">{guruTidakMasukList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Berhalangan / Izin</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">100%</div>
            <div className="text-xs text-slate-500 font-medium">Cover Guru Pengganti</div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari guru..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
          >
            <option value="Semua">Semua Status Kehadiran</option>
            <option value="Hadir">Hadir</option>
            <option value="Izin/Tidak Masuk">Izin / Berhalangan</option>
          </select>
        </div>
      </div>

      {/* Teacher Monitoring Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 font-bold text-slate-800">
          Status Presensi &amp; Tugas Guru ({formatIndonesianDate(new Date(), { withDay: true, shortMonth: false })})
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Guru</th>
                <th className="py-3 px-4">Mata Pelajaran</th>
                <th className="py-3 px-4 text-center">Jam Hadir</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4">Guru Pengganti / Tugas</th>
                <th className="py-3 px-4">Catatan KBM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item: any, idx: number) => (
                <tr key={item.guru.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 text-center text-slate-400">{idx + 1}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {item.guru.nama}, {item.guru.gelar}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">
                    {Array.isArray(item.guru.mataPelajaran)
                      ? item.guru.mataPelajaran.join(', ')
                      : String(item.guru.mataPelajaran || '-')}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-600">
                    {item.jamMasuk}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      item.statusPresensi === 'Hadir Tepat Waktu'
                        ? 'bg-emerald-100 text-emerald-800'
                        : item.statusPresensi === 'Sakit'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.statusPresensi}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {item.guruPengganti !== '-' ? (
                      <span className="font-semibold text-blue-700 text-xs">{item.guruPengganti}</span>
                    ) : (
                      <span className="text-slate-400 text-xs">Mengajar Mandiri</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{item.keterangan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
