import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Megaphone,
  Send,
  Calendar,
  Users,
  MessageSquare,
  Plus,
  CheckCircle2,
  Trash2,
  Tag
} from 'lucide-react';

export const PengumumanKepalaView: React.FC = () => {
  const { pengumumanList, addPengumuman } = useApp();

  const [judul, setJudul] = useState('');
  const [isi, setIsisi] = useState('');
  const [target, setTarget] = useState<'Semua' | 'Guru' | 'Siswa' | 'Guru Piket'>('Semua');
  const [prioritas, setPrioritas] = useState<'Normal' | 'Penting' | 'Mendesak'>('Penting');
  const [sendWA, setSendWA] = useState(true);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!judul || !isi) return;

    addPengumuman({
      id: `p-${Date.now()}`,
      judul,
      isi,
      target,
      tanggal: '04 September 2026',
      penulis: 'Kepala Madrasah (Drs. H. M. Fauzan, M.Pd.I)',
      prioritas
    });

    setJudul('');
    setIsisi('');
    setPublishedSuccess(true);
    setTimeout(() => setPublishedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {publishedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            Pengumuman resmi berhasil dipublikasikan dan disiarkan ke dashboard madrasah!
          </div>
        </div>
      )}

      {/* Two Columns: Left Broadcast Form, Right Published List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Broadcast */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Buat Instruksi / Pengumuman</h3>
              <p className="text-xs text-slate-400">Siaran resmi pimpinan madrasah</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Judul Pengumuman *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Kedisiplinan Seragam Hari Senin & Persiapan MBG"
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Audiens
                </label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Semua">Semua Warga</option>
                  <option value="Guru">Dewan Guru</option>
                  <option value="Guru Piket">Petugas Piket</option>
                  <option value="Siswa">Peserta Didik</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tingkat Prioritas
                </label>
                <select
                  value={prioritas}
                  onChange={(e) => setPrioritas(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white"
                >
                  <option value="Normal">Normal</option>
                  <option value="Penting">Penting</option>
                  <option value="Mendesak">Mendesak (Darurat)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Isi Pengumuman / Instruksi *
              </label>
              <textarea
                rows={4}
                required
                placeholder="Tuliskan isi edaran atau instruksi resmi di sini..."
                value={isi}
                onChange={(e) => setIsisi(e.target.value)}
                className="w-full p-3 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <input
                type="checkbox"
                id="sendWaCheck"
                checked={sendWA}
                onChange={(e) => setSendWA(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="sendWaCheck" className="text-xs font-semibold text-emerald-900 cursor-pointer">
                Kirim broadcast langsung via WhatsApp Gateway
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Siarkan Pengumuman
            </button>
          </form>
        </div>

        {/* List of Announcements */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            Riwayat Pengumuman Resmi Aktif ({pengumumanList.length})
          </h3>

          <div className="space-y-3">
            {pengumumanList.map((p: any) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      p.prioritas === 'Mendesak'
                        ? 'bg-rose-100 text-rose-800'
                        : p.prioritas === 'Penting'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {p.prioritas || 'Penting'}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      Target: {p.target || p.targetPenerima?.join(', ') || 'Semua Warga'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 font-mono">{p.tanggalTerbit || p.tanggal}</span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 text-base">{p.judul}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                    {p.isi}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                  <span>Diterbitkan oleh: <strong className="text-slate-700">{p.penulis || 'Kepala Madrasah'}</strong></span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ditayangkan
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
