import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LaporKendalaData } from '../../types';
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  Wrench,
  Search,
  Filter,
  Check,
  Send,
  MessageSquare
} from 'lucide-react';

export const KendalaTindakLanjutKepalaView: React.FC = () => {
  const { kendalaList, updateKendalaStatus } = useApp();

  const [selectedKendala, setSelectedKendala] = useState<LaporKendalaData | null>(null);
  const [tindakLanjutInput, setTindakLanjutInput] = useState('');
  const [statusInput, setStatusInput] = useState<'Menunggu' | 'Dalam Proses' | 'Sudah Ditindaklanjuti'>('Dalam Proses');

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKendala) return;

    updateKendalaStatus(
      selectedKendala.id,
      statusInput,
      tindakLanjutInput || 'Telah didisposisikan kepada unit terkait.'
    );
    setSelectedKendala(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Disposisi & Monitoring Kendala Sarpras / KBM Madrasah
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan kendala operasional dari Guru Piket yang membutuhkan persetujuan tindakan dan anggaran perbaikan.
          </p>
        </div>
      </div>

      {/* Grid of Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kendalaList.map((k) => (
          <div
            key={k.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:border-slate-300 transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  k.prioritas === 'Tinggi'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  Prioritas {k.prioritas}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  k.status === 'Sudah Ditindaklanjuti'
                    ? 'bg-emerald-100 text-emerald-800'
                    : k.status === 'Dalam Proses'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-100 text-slate-700'
                }`}>
                  {k.status}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 text-base">{k.judulKendala}</h4>
                <p className="text-xs text-slate-500 mt-1">{k.deskripsi}</p>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl space-y-1">
                <div>Lokasi: <span className="font-semibold text-slate-800">{k.lokasi}</span></div>
                <div>Pelapor: <span className="font-semibold text-slate-800">{k.pelapor}</span></div>
                {k.tindakLanjutNote && (
                  <div className="pt-1 text-emerald-700 font-medium">
                    Tindak Lanjut: {k.tindakLanjutNote}
                  </div>
                )}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  setSelectedKendala(k);
                  setStatusInput(k.status as any);
                  setTindakLanjutInput(k.tindakLanjutNote || '');
                }}
                className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Disposisi Tindakan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Disposisi */}
      {selectedKendala && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-800 mb-2">
              Disposisi Kepala Madrasah: {selectedKendala.judulKendala}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{selectedKendala.deskripsi}</p>

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Penanganan
                </label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Menunggu">Menunggu / Antrean</option>
                  <option value="Diproses">Sedang Dikerjakan (Diproses)</option>
                  <option value="Selesai">Tuntas / Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Instruksi / Disposisi Tindak Lanjut
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Disposisi ke Sarpras untuk penggantian unit baru besok pagi."
                  value={tindakLanjutInput}
                  onChange={(e) => setTindakLanjutInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedKendala(null)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  Simpan Disposisi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
