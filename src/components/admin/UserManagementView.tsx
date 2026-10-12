import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserAccount, UserRole } from '../../types';
import {
  UserCheck,
  Shield,
  Key,
  Search,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Mail,
  User,
  CheckCircle2,
  X,
  Check,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';

export const UserManagementView: React.FC = () => {
  const { userList, addUser, updateUser, deleteUser, confirmAction, alertSuccess, alertInfo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('Semua');

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserAccount | null>(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordInModal, setShowPasswordInModal] = useState(false);

  const [formData, setFormData] = useState<Partial<UserAccount>>({
    namaLengkap: '',
    username: '',
    email: '',
    role: 'Guru Piket',
    status: 'Aktif'
  });

  // Sesuai instruksi: Akun Administrator & Kepala Madrasah bersifat pribadi & rahasia,
  // sehingga TIDAK DIPERLIHATKAN di daftar tabel pengguna publik/staf madrasah.
  const isPrivateAccount = (u: UserAccount) => {
    const roleLower = (u.role || '').toLowerCase();
    const userLower = (u.username || '').toLowerCase();
    return (
      roleLower.includes('admin') ||
      roleLower.includes('kepala') ||
      userLower === 'admin' ||
      userLower === 'kepala'
    );
  };

  // Hanya tampilkan akun pengguna non-pribadi (Guru Piket, Guru Mapel, Wali Kelas, Staf TU)
  const visibleUsers = userList.filter((u) => !isPrivateAccount(u));

  const filteredUsers = visibleUsers.filter((u) => {
    const matchSearch =
      u.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = roleFilter === 'Semua' ? true : u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleOpenAdd = () => {
    setEditingUser(null);
    setPasswordInput('madrasah123');
    setFormData({
      namaLengkap: '',
      username: '',
      email: '',
      role: 'Guru Piket',
      status: 'Aktif'
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (user: UserAccount) => {
    if (isPrivateAccount(user)) {
      alertInfo('Akun Pribadi', 'Akun Administrator dan Kepala Madrasah bersifat pribadi dan tidak dapat disunting dari daftar umum.');
      return;
    }
    setEditingUser(user);
    setPasswordInput(user.password || '');
    setFormData({ ...user });
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.namaLengkap) return;

    if (editingUser) {
      updateUser(editingUser.id, {
        ...formData,
        ...(passwordInput ? { password: passwordInput } : {})
      });
      alertSuccess('Akun Diperbarui', `Data akun ${formData.namaLengkap} berhasil diperbarui.`);
    } else {
      const newUser: UserAccount = {
        id: `u-${Date.now()}`,
        namaLengkap: formData.namaLengkap || '',
        username: formData.username || '',
        password: passwordInput || 'madrasah123',
        email: formData.email || '',
        role: formData.role as UserRole,
        terakhirLogin: 'Baru dibuat',
        status: 'Aktif',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      };
      addUser(newUser);
      alertSuccess('Akun Dibuat', `Akun baru ${newUser.namaLengkap} (${newUser.username}) telah berhasil didaftarkan ke sistem madrasah.`);
    }
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3 shadow-2xs">
        <Shield className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs">
          <div className="font-bold text-amber-950 flex items-center gap-1.5">
            <span>Perlindungan Privasi: Akun Pribadi Administrator & Kepala Madrasah Dirahasiakan</span>
            <span className="px-2 py-0.5 bg-amber-200/60 text-amber-900 rounded text-[10px] font-bold">Privat</span>
          </div>
          <p className="text-amber-800/90 mt-1 leading-relaxed">
            Akun <strong>Administrator</strong> dan <strong>Kepala Madrasah</strong> adalah akun pribadi dengan otoritas tertinggi sehingga disembunyikan dari daftar publik staf untuk menjaga privasi dan kerahasiaan madrasah.
          </p>
        </div>
      </div>

      {/* Top Banner Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{visibleUsers.length}</div>
            <div className="text-xs text-slate-500 font-medium">Akun Staf & Guru Terkelola</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">
              {visibleUsers.filter((u) => u.role === 'Guru Piket').length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Akun Guru Piket Aktif</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">
              {visibleUsers.filter((u) => u.role === 'Guru' || u.role === 'Wali Kelas').length}
            </div>
            <div className="text-xs text-slate-500 font-medium">Akun Guru & Wali Kelas</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-extrabold text-amber-800">Terenkripsi</div>
            <div className="text-[11px] text-slate-500 font-medium">Akun Admin & Kepala Privat</div>
          </div>
        </div>
      </div>

      {/* Filter and Action Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama pengguna, username, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500 font-medium"
          >
            <option value="Semua">Semua Peran (Staf & Guru)</option>
            <option value="Guru Piket">Guru Piket</option>
            <option value="Guru">Guru Mata Pelajaran</option>
            <option value="Wali Kelas">Wali Kelas</option>
          </select>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          + Tambah Pengguna
        </button>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 font-semibold text-slate-800">
          Daftar Hak Akses Akun Pengguna Sistem
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Pengguna</th>
                <th className="py-3 px-4">Username</th>
                <th className="py-3 px-4">Role Akses</th>
                <th className="py-3 px-4">Terakhir Login</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u, idx) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={(u as any).avatarUrl || (u as any).avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={u.namaLengkap}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">{u.namaLengkap}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium">
                    <div className="text-blue-700 font-bold">{u.username}</div>
                    <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                      <Lock className="w-2.5 h-2.5 text-slate-400" />
                      <span>••••••••</span>
                      {(u.role === 'Administrator' || u.role === 'Kepala Madrasah') && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-50 text-amber-800 font-sans font-semibold border border-amber-200/60 ml-0.5">
                          Privat
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      u.role === 'Administrator'
                        ? 'bg-purple-100 text-purple-800'
                        : u.role === 'Kepala Madrasah'
                        ? 'bg-amber-100 text-amber-800'
                        : u.role === 'Guru Piket'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-slate-500">{u.terakhirLogin}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(u)}
                        title="Edit User"
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          confirmAction({
                            title: 'Reset Password Akun',
                            message: `Apakah Anda yakin ingin mereset password untuk akun "${u.namaLengkap}" (${u.username})?`,
                            confirmText: 'Ya, Reset Password',
                            onConfirm: () => {
                              const newPass = `${u.username}123`;
                              updateUser(u.id, { password: newPass });
                              alertSuccess(
                                'Password Direset',
                                `Password untuk akun ${u.namaLengkap} berhasil direset. Silakan berikan kata sandi baru kepada pemilik akun secara aman.`
                              );
                            }
                          });
                        }}
                        title="Reset Password"
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer"
                      >
                        <Key className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          confirmAction({
                            isDanger: true,
                            title: 'Hapus Akun Pengguna',
                            message: `Apakah Anda yakin ingin menghapus akun "${u.namaLengkap}" (${u.username}) dari sistem madrasah?\n\nPengguna tidak akan dapat masuk kembali ke sistem.`,
                            confirmText: 'Ya, Hapus Akun',
                            onConfirm: () => {
                              deleteUser(u.id);
                              alertSuccess('Akun Dihapus', `Akun pengguna ${u.namaLengkap} telah berhasil dihapus.`);
                            }
                          });
                        }}
                        title="Hapus User"
                        className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">
                {editingUser ? 'Edit Akun Pengguna' : 'Tambah Pengguna Baru'}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap dengan Gelar"
                  value={formData.namaLengkap || ''}
                  onChange={(e) => setFormData({ ...formData, namaLengkap: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="username"
                    value={formData.username || ''}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role / Peran</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                  >
                    <option value="Guru Piket">Guru Piket</option>
                    <option value="Guru">Guru Mata Pelajaran</option>
                    <option value="Wali Kelas">Wali Kelas</option>
                    <option value="Tata Usaha">Staf Tata Usaha</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="user@maplus.sch.id"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {editingUser ? 'Password Akun (Ubah jika ingin mengganti)' : 'Password Awal *'}
                </label>
                <div className="relative">
                  <input
                    type={showPasswordInModal ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Masukkan password akun"
                    className="w-full pl-3 pr-10 py-2 text-sm rounded-lg border border-slate-200 font-mono"
                    required={!editingUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordInModal(!showPasswordInModal)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPasswordInModal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Password bersifat pribadi dan digunakan untuk login resmi ke portal madrasah.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
