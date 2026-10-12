import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  GraduationCap,
  Users,
  AlertOctagon,
  Clock,
  Utensils,
  Search,
  Filter,
  CheckCircle2,
  Calendar
} from 'lucide-react';

export const MonitoringSiswaKepalaView: React.FC = () => {
  const { siswaList, siswaTidakMasukList, siswaTerlambatList, pelanggaranList } = useApp();

  const [activeTab, setActiveTab] = useState<'presensi' | 'terlambat' | 'tatib'>('presensi');

  return (
    <div className="space-y-6">
      {/* Top Banner Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{siswaList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Total Santri Madrasah</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {Math.max(0, siswaList.length - siswaTidakMasukList.length)}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Santri Hadir ({siswaList.length > 0 ? `${((Math.max(0, siswaList.length - siswaTidakMasukList.length) / siswaList.length) * 100).toFixed(1)}%` : '100%'})
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600">{siswaTerlambatList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Siswa Terlambat Hari Ini</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
            <AlertOctagon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-rose-600">{pelanggaranList.length}</div>
            <div className="text-xs text-slate-500 font-medium">Catatan Pelanggaran</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('presensi')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'presensi'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Daftar Siswa Tidak Hadir ({siswaTidakMasukList.length})
        </button>
        <button
          onClick={() => setActiveTab('terlambat')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'terlambat'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Siswa Terlambat Masuk ({siswaTerlambatList.length})
        </button>
        <button
          onClick={() => setActiveTab('tatib')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 cursor-pointer transition-colors ${
            activeTab === 'tatib'
              ? 'border-blue-700 text-blue-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Disiplin & Pelanggaran ({pelanggaranList.length})
        </button>
      </div>

      {activeTab === 'presensi' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Keterangan</th>
                <th className="py-3 px-4">Alasan</th>
                <th className="py-3 px-4 text-center">Surat Dokter / Izin</th>
                <th className="py-3 px-4 text-center">Porsi MBG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {siswaTidakMasukList.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{s.nama}</td>
                  <td className="py-3.5 px-4 font-medium">{s.kelas}</td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      s.keterangan === 'Sakit'
                        ? 'bg-blue-100 text-blue-800'
                        : s.keterangan === 'Izin'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {s.keterangan}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{s.alasan}</td>
                  <td className="py-3.5 px-4 text-center">
                    {s.suratAda ? (
                      <span className="text-xs font-semibold text-emerald-600">Ada Surat</span>
                    ) : (
                      <span className="text-xs text-slate-400">Tidak Ada</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="text-xs font-semibold text-rose-600">Dibatalkan (-1)</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'terlambat' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Waktu Hadir</th>
                <th className="py-3 px-4">Durasi Keterlambatan</th>
                <th className="py-3 px-4">Alasan</th>
                <th className="py-3 px-4">Tindakan Piket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {siswaTerlambatList.map((s: any) => (
                <tr key={s.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{s.nama}</td>
                  <td className="py-3.5 px-4 font-medium">{s.kelas}</td>
                  <td className="py-3.5 px-4 font-mono text-xs">{s.waktuTerlambat || s.jamMasuk} WIB</td>
                  <td className="py-3.5 px-4 text-amber-700 font-bold">{s.menitTerlambat || s.keterlambatanMenit || 15} Menit</td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{s.keterangan || s.alasan}</td>
                  <td className="py-3.5 px-4 text-xs font-medium text-blue-700">{s.tindakan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'tatib' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Kelas</th>
                <th className="py-3 px-4">Jenis Pelanggaran</th>
                <th className="py-3 px-4 text-center">Poin</th>
                <th className="py-3 px-4">Tindakan Disiplin</th>
                <th className="py-3 px-4">Petugas Pelapor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {pelanggaranList.map((p: any) => (
                <tr key={p.id} className="hover:bg-slate-50/80">
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{p.nama || p.namaSiswa}</td>
                  <td className="py-3.5 px-4">{p.kelas}</td>
                  <td className="py-3.5 px-4 text-slate-700">{p.jenisPelanggaran}</td>
                  <td className="py-3.5 px-4 text-center font-bold text-rose-600">+{p.poin} Poin</td>
                  <td className="py-3.5 px-4 text-xs text-slate-600">{p.tindakan}</td>
                  <td className="py-3.5 px-4 text-xs text-slate-400">{p.dicatatOleh || p.petugasPiket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
