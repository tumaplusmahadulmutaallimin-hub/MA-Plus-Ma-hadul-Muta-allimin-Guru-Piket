import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  UserCheck,
  Building2,
  Send,
  ShieldAlert,
  Shield,
  KeyRound
} from 'lucide-react';
import { MadrasahLogo } from '../common/MadrasahLogo';

interface LoginViewProps {
  onOpenPublicReport: () => void;
  onOpenTeacherConfirm?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onOpenPublicReport, onOpenTeacherConfirm }) => {
  const { login, alertError } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Silakan masukkan username dan password Anda.');
      return;
    }

    const result = login(username.trim(), password);
    if (!result.success) {
      setErrorMessage(result.message);
      alertError('Gagal Masuk', result.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#04160F] via-[#06261B] to-[#0B1528] flex flex-col justify-between p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      {/* Background Architectural Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/madrasah_building_1791093694458.jpg"
          alt="Madrasah Campus"
          className="w-full h-full object-cover filter blur-xs"
        />
      </div>

      {/* Decorative Golden Star Patterns */}
      <div className="absolute top-12 left-12 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-12 right-12 w-72 h-72 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <div className="flex justify-between items-center z-10 max-w-5xl mx-auto w-full text-slate-300 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold tracking-wide text-white">MA PLUS Ma'hadul Muta'allimin Katerban-Ngawi</span>
        </div>
        <span className="font-mono text-emerald-300/80 hidden sm:inline">
          Tahun Ajaran 2026/2027 • Semester Gasal
        </span>
      </div>

      {/* Main Container */}
      <div className="z-10 w-full max-w-md mx-auto my-auto py-6">
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-white p-1.5 mx-auto shadow-2xl shadow-emerald-950/60 border border-emerald-400/40 flex items-center justify-center mb-3">
            <MadrasahLogo size="2xl" />
          </div>

          <span className="font-arabic text-sm text-amber-200/90 block mb-1">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </span>

          <h1 className="text-2xl font-black text-white tracking-wide uppercase">
            SISTEM GURU PIKET & SIM
          </h1>
          <p className="text-sm font-semibold text-emerald-200/90 mt-0.5">
            MA PLUS Ma'hadul Muta'allimin Katerban-Ngawi
          </p>
          <div className="mt-2 space-y-0.5">
            <p className="text-[11px] font-extrabold text-amber-300 uppercase tracking-wider">
              MADRASAH THREE IN ONE (RELIGIUS, SAINS AND SKILL)
            </p>
            <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-tight">
              MADRASAH BERBASIS PONDOK PESANTREN
            </p>
          </div>
          <p className="text-xs font-serif italic text-amber-200/80 mt-1.5 px-4">
            "Ikhlas Beramal, Cerdas dalam Tugas, Tertib untuk Madrasah"
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-7 border border-emerald-900/10">
          <div className="mb-5 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Autentikasi Aman & Hak Akses Terlindungi</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">Masuk ke Portal Madrasah</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Silakan masukkan username/NIP dan kata sandi akun resmi Anda
            </p>
          </div>

          {/* Error Message Banner */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-800 animate-in fade-in">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Akses Ditolak:</p>
                <p className="text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Username / NIP
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Masukkan username atau NIP"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all font-medium"
                  required
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Masukkan kata sandi akun"
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 transition-all font-medium"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  tabIndex={-1}
                  aria-label="Lihat kata sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.8 px-4 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:from-emerald-800 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-700/30 transition-all flex items-center justify-center gap-2 tracking-wider uppercase cursor-pointer"
            >
              <span>MASUK KE SISTEM</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Privacy & Confidentiality Notice (Admin & Kepala accounts are private) */}
          <div className="mt-5 pt-4 border-t border-slate-100 space-y-3">
            <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 flex items-start gap-2.5 text-[11px] text-emerald-950">
              <Shield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-emerald-900">Perlindungan Akun Pribadi & Privasi:</p>
                <p className="text-emerald-800/80 mt-0.5 leading-relaxed">
                  Akun <strong>Administrator</strong> dan <strong>Kepala Madrasah</strong> bersifat pribadi & rahasia. Akses hanya dapat dibuka menggunakan kata sandi sah masing-masing pemegang wewenang.
                </p>
              </div>
            </div>

            {/* Quick helper only for general Piket officer testing */}
            <div className="flex items-center justify-between px-1 text-[11px]">
              <span className="text-slate-400">Petugas Piket Bertugas:</span>
              <button
                type="button"
                onClick={() => {
                  setUsername('piket');
                  setPassword('piket123');
                  setErrorMessage(null);
                }}
                className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Isi Akun Piket Harian</span>
              </button>
            </div>
          </div>
        </div>

        {/* Public Action Links for Teachers */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-center items-center">
          <button
            type="button"
            onClick={onOpenPublicReport}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-xs text-xs font-semibold text-emerald-200 transition-colors border border-white/15 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5 text-amber-300" />
            <span>Guru Tidak Hadir? Formulir Mandiri</span>
          </button>

          {onOpenTeacherConfirm && (
            <button
              type="button"
              onClick={onOpenTeacherConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-600/30 hover:bg-emerald-600/50 backdrop-blur-xs text-xs font-semibold text-amber-200 transition-colors border border-amber-300/30 cursor-pointer shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Konfirmasi Kehadiran KBM Guru (Foto Kelas)</span>
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="z-10 text-center text-slate-400 text-[11px]">
        <p>© 2026 MA PLUS Ma'hadul Muta'allimin. Hak Cipta Dilindungi Undang-Undang.</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Sistem Informasi Presensi & Manajemen Piket Madrasah Terenkripsi
        </p>
      </div>
    </div>
  );
};
