import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Guru } from '../../types';
import {
  Users,
  UserCheck,
  UserX,
  CalendarCheck,
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Upload,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  BookOpen,
  X,
  Check,
  Award,
  Camera
} from 'lucide-react';
import { ImageUploader } from '../common/ImageUploader';
import { exportToXLSX, readXLSXFile, downloadGuruTemplateXLSX } from '../../utils/excelHelper';

export const DataGuruView: React.FC = () => {
  const { guruList, addGuru, updateGuru, deleteGuru, confirmAction, alertSuccess, alertInfo } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Aktif' | 'Tidak Aktif'>('Semua');
  const [kepegawaianFilter, setKepegawaianFilter] = useState<string>('Semua');
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importedRows, setImportedRows] = useState<any[]>([]);
  const [selectedGuru, setSelectedGuru] = useState<Guru | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Guru>>({
    nama: '',
    gelar: '',
    nip: '',
    nuptk: '',
    jenisKelamin: 'L',
    statusKepegawaian: 'Tetap Yayasan',
    mataPelajaran: [],
    noHp: '',
    email: '',
    status: 'Aktif'
  });
  const [mapelInput, setMapelInput] = useState('');

  // Filtered teachers
  const filteredGuru = guruList.filter((g: any) => {
    const mapelStr = Array.isArray(g.mataPelajaran) ? g.mataPelajaran.join(' ') : String(g.mataPelajaran || '');
    const matchSearch =
      g.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.nip.includes(searchTerm) ||
      mapelStr.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'Semua' ? true : g.status === statusFilter;
    const matchKepegawaian = kepegawaianFilter === 'Semua' ? true : g.statusKepegawaian === kepegawaianFilter;
    return matchSearch && matchStatus && matchKepegawaian;
  });

  const totalGuru = guruList.length;
  const guruAktif = guruList.filter((g) => g.status === 'Aktif').length;
  const guruTidakAktif = totalGuru - guruAktif;
  const guruPNS = guruList.filter((g) => g.statusKepegawaian.includes('DPK') || g.statusKepegawaian.includes('PNS')).length;
  const guruTetap = guruList.filter((g) => g.statusKepegawaian === 'Tetap Yayasan').length;

  const handleOpenAdd = () => {
    setIsEditing(false);
    setFormData({
      nama: '',
      gelar: 'S.Pd',
      nip: '',
      nuptk: '',
      jenisKelamin: 'L',
      statusKepegawaian: 'Tetap Yayasan',
      mataPelajaran: [],
      noHp: '',
      email: '',
      status: 'Aktif'
    });
    setMapelInput('');
    setShowAddModal(true);
  };

  const handleOpenEdit = (guru: Guru) => {
    setIsEditing(true);
    setFormData({ ...guru });
    const mapelString = Array.isArray(guru.mataPelajaran)
      ? guru.mataPelajaran.join(', ')
      : String(guru.mataPelajaran || '');
    setMapelInput(mapelString);
    setShowAddModal(true);
  };

  const handleSaveGuru = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama) return;

    const mapelArr = mapelInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (isEditing && formData.id) {
      updateGuru(formData.id, {
        ...formData,
        mataPelajaran: mapelArr,
        foto: formData.foto || formData.avatarUrl
      });
      alertSuccess('Data Diperbarui', `Data tenaga pendidik ${formData.nama} berhasil diperbarui.`);
    } else {
      const defaultFoto = formData.jenisKelamin === 'P'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200';

      const newGuru: Guru = {
        id: `g-${Date.now()}`,
        nama: formData.nama || '',
        gelar: formData.gelar || '',
        nip: formData.nip || '-',
        nuptk: formData.nuptk || '-',
        jenisKelamin: (formData.jenisKelamin as 'L' | 'P') || 'L',
        statusKepegawaian: (formData.statusKepegawaian as any) || 'Tetap Yayasan',
        mataPelajaran: mapelArr.length > 0 ? mapelArr : ['Umum'],
        noHp: formData.noHp || '-',
        email: formData.email || '-',
        foto: formData.foto || defaultFoto,
        avatarUrl: formData.foto || defaultFoto,
        status: (formData.status as any) || 'Aktif'
      };
      addGuru(newGuru);
      alertSuccess('Guru Ditambahkan', `Data guru ${newGuru.nama} berhasil ditambahkan ke sistem.`);
    }

    setShowAddModal(false);
  };

  const handleExportXLSX = () => {
    const headers = [
      'No',
      'Nama Lengkap Guru',
      'Gelar',
      'NIP',
      'NUPTK',
      'Jenis Kelamin',
      'Status Kepegawaian',
      'Mata Pelajaran',
      'Nomor WhatsApp',
      'Email Madrasah',
      'Status Keaktifan'
    ];
    const rows = filteredGuru.map((g: any, idx: number) => [
      idx + 1,
      g.nama,
      g.gelar || '-',
      g.nip || '-',
      g.nuptk || '-',
      g.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan',
      g.statusKepegawaian,
      Array.isArray(g.mataPelajaran) ? g.mataPelajaran.join(', ') : g.mataPelajaran,
      g.noHp || '-',
      g.email || '-',
      g.status
    ]);

    exportToXLSX({
      filename: `Data_Guru_MAPLUS_${new Date().toISOString().slice(0, 10)}.xlsx`,
      sheetName: 'Data Guru',
      headers,
      data: rows,
      colWidths: [8, 28, 12, 22, 20, 16, 22, 32, 18, 26, 16]
    });

    alertSuccess(
      'Ekspor Excel Berhasil',
      'Data tenaga pendidik berhasil diekspor ke format Excel (.xlsx) dengan kolom sel terpisah rapi.'
    );
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportLoading(true);
    setImportFileName(file.name);
    try {
      const rows = await readXLSXFile(file);
      if (rows.length <= 1) {
        alertInfo('File Kosong', 'File Excel tidak memuat baris data.');
        setImportLoading(false);
        return;
      }

      // Skip header row, map remaining data rows
      const dataRows = rows.slice(1);
      const parsedGurus: Partial<Guru>[] = [];

      dataRows.forEach((row, i) => {
        if (!row || row.length === 0) return;
        // Check if row has a 'No' column in index 0
        const isFirstColNumber = !isNaN(Number(row[0])) && String(row[0]).trim() !== '' && row.length > 2;
        const colOffset = isFirstColNumber ? 1 : 0;

        const nama = String(row[colOffset] || '').trim();
        if (!nama || nama.toLowerCase() === 'nama' || nama.toLowerCase() === 'nama lengkap') return;

        const gelar = String(row[colOffset + 1] || '').trim();
        const nipRaw = String(row[colOffset + 2] || '').trim();
        const nip = nipRaw !== '-' && nipRaw !== '' ? nipRaw : undefined;
        const mapelRaw = String(row[colOffset + 3] || 'Umum').trim();
        const mapel = mapelRaw.split(/[,;/]/).map(m => m.trim()).filter(Boolean);
        const statusKepegawaian = String(row[colOffset + 5] || row[colOffset + 4] || 'Tetap Yayasan').trim() as any;
        const noHp = String(row[colOffset + 6] || row[colOffset + 5] || '').trim();

        parsedGurus.push({
          id: `g-imp-${Date.now()}-${i}`,
          nama,
          gelar: gelar || undefined,
          nip,
          mataPelajaran: mapel.length > 0 ? mapel : ['Umum'],
          statusKepegawaian: statusKepegawaian || 'Tetap Yayasan',
          noHp,
          jenisKelamin: 'L',
          status: 'Aktif',
          foto: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150'
        });
      });

      setImportedRows(parsedGurus);
      alertSuccess('File Excel Terbaca', `Berhasil membaca ${parsedGurus.length} data guru dari file .xlsx dengan kolom sel terpisah rapi.`);
    } catch (err: any) {
      alertInfo('Gagal Membaca Excel', err?.message || 'Format spreadsheet tidak sesuai.');
    } finally {
      setImportLoading(false);
      e.target.value = '';
    }
  };

  const handleApplyImport = () => {
    if (importedRows.length === 0) {
      alertInfo('Tidak Ada Data', 'Silakan pilih file Excel (.xlsx) terlebih dahulu.');
      return;
    }
    importedRows.forEach(g => {
      addGuru(g as Guru);
    });
    alertSuccess('Impor Berhasil', `${importedRows.length} data tenaga pendidik berhasil diimpor dari file .xlsx dan disinkronkan ke sistem.`);
    setImportedRows([]);
    setImportFileName(null);
    setShowImportModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{totalGuru}</div>
              <div className="text-xs text-slate-500 font-medium">Total Guru & Tendik</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">{guruAktif}</div>
              <div className="text-xs text-slate-500 font-medium">Guru Aktif Mengajar</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-600">{guruTetap}</div>
              <div className="text-xs text-slate-500 font-medium">Tetap Yayasan (GTY)</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-700 rounded-lg">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-indigo-600">3</div>
              <div className="text-xs text-slate-500 font-medium">Guru Piket Hari Ini</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-lg">
              <UserX className="w-5 h-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-rose-600">{guruTidakAktif}</div>
              <div className="text-xs text-slate-500 font-medium">Tidak Aktif / Cuti</div>
            </div>
          </div>
        </div>
      </div>

      {/* Action and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama guru, NIP, mapel..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>

          {/* Filter Kepegawaian */}
          <select
            value={kepegawaianFilter}
            onChange={(e) => setKepegawaianFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="Semua">Semua Status Kepegawaian</option>
            <option value="Tetap Yayasan">Tetap Yayasan</option>
            <option value="DPK/Kemenag">DPK / Kemenag</option>
            <option value="Tidak Tetap">Guru Tidak Tetap (GTT)</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </button>
          <button
            onClick={handleExportXLSX}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Export Excel (.xlsx)
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            + Tambah Guru
          </button>
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="font-semibold text-slate-800">
            Daftar Tenaga Pendidik & Kependidikan ({filteredGuru.length} Data)
          </div>
          <span className="text-xs text-slate-500">Tahun Ajaran 2026/2027 Semester Ganjil</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 w-12 text-center">No</th>
                <th className="py-3 px-4">Nama Lengkap & NIP</th>
                <th className="py-3 px-4">L/P</th>
                <th className="py-3 px-4">Status Pegawai</th>
                <th className="py-3 px-4">Mata Pelajaran Diampu</th>
                <th className="py-3 px-4">Kontak (HP/Email)</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredGuru.map((guru, idx) => (
                <tr key={guru.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{idx + 1}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={guru.foto}
                        alt={guru.nama}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-slate-800">
                          {guru.nama}{guru.gelar ? `, ${guru.gelar}` : ''}
                        </div>
                        <div className="text-xs text-slate-400">
                          NIP: {guru.nip} {guru.nuptk !== '-' && `• NUPTK: ${guru.nuptk}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                      guru.jenisKelamin === 'L' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                    }`}>
                      {guru.jenisKelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                      {guru.statusKepegawaian}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(Array.isArray(guru.mataPelajaran) ? guru.mataPelajaran : [guru.mataPelajaran]).map((m: any, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs border border-blue-100">
                          {m}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {guru.noHp}
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {guru.email}
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      guru.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {guru.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => setSelectedGuru(guru)}
                        title="Lihat Detail"
                        className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(guru)}
                        title="Edit Data"
                        className="p-1.5 text-slate-500 hover:text-amber-700 hover:bg-amber-50 rounded cursor-pointer transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          confirmAction({
                            isDanger: true,
                            title: 'Hapus Data Guru',
                            message: `Apakah Anda yakin ingin menghapus data guru "${guru.nama}"?\n\nData jadwal dan riwayat presensi terkait guru ini akan diperbarui.`,
                            confirmText: 'Ya, Hapus Data',
                            onConfirm: () => {
                              deleteGuru(guru.id);
                              alertSuccess('Data Dihapus', `Data guru ${guru.nama} berhasil dihapus.`);
                            }
                          });
                        }}
                        title="Hapus Data"
                        className="p-1.5 text-slate-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer transition-colors"
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

      {/* Modal Add / Edit Guru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {isEditing ? 'Edit Data Tenaga Pendidik' : 'Tambah Guru / Tenaga Pendidik Baru'}
                </h3>
                <p className="text-xs text-slate-500">
                  Lengkapi identitas guru untuk sinkronisasi jadwal KBM dan piket.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGuru} className="space-y-4">
              {/* Photo Upload & Preview */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl">
                <ImageUploader
                  currentImage={formData.foto || (formData as any).avatarUrl}
                  onImageChange={(imgUrl) => setFormData({ ...formData, foto: imgUrl, avatarUrl: imgUrl })}
                  label="Foto Profil Guru"
                  sublabel="Unggah foto formal guru atau pilih dari galeri sampel. Foto bisa diubah kapan saja."
                  shape="circle"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Zainal"
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Gelar Akademik
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: S.Pd, M.Pd"
                    value={formData.gelar || ''}
                    onChange={(e) => setFormData({ ...formData, gelar: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIP / NIPTTK
                  </label>
                  <input
                    type="text"
                    placeholder="19850112 201001 1 004"
                    value={formData.nip || ''}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NUPTK
                  </label>
                  <input
                    type="text"
                    placeholder="7445763664200032"
                    value={formData.nuptk || ''}
                    onChange={(e) => setFormData({ ...formData, nuptk: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Kepegawaian
                  </label>
                  <select
                    value={formData.statusKepegawaian}
                    onChange={(e) => setFormData({ ...formData, statusKepegawaian: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    <option value="Tetap Yayasan">Tetap Yayasan (GTY)</option>
                    <option value="DPK/Kemenag">DPK / Kemenag (PNS)</option>
                    <option value="Tidak Tetap">Tidak Tetap (GTT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mata Pelajaran yang Diampu (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Matematika Peminatan, Fisika"
                  value={mapelInput}
                  onChange={(e) => setMapelInput(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="081234567890"
                    value={formData.noHp || ''}
                    onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Madrasah
                  </label>
                  <input
                    type="email"
                    placeholder="guru@maplus.sch.id"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Keaktifan
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="Aktif">Aktif Mengajar</option>
                  <option value="Tidak Aktif">Tidak Aktif / Cuti</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isEditing ? 'Simpan Perubahan' : 'Tambahkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Drawer Detail Guru */}
      {selectedGuru && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h4 className="font-bold text-slate-800">Detail Informasi Tenaga Pendidik</h4>
                <button
                  onClick={() => setSelectedGuru(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center space-y-2">
                <div className="relative inline-block mx-auto">
                  <img
                    src={(selectedGuru as any).foto || selectedGuru.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={selectedGuru.nama}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-emerald-100 shadow-sm"
                  />
                  <label
                    title="Ganti Foto Guru"
                    className="absolute bottom-0 right-0 p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md cursor-pointer transition-transform hover:scale-110"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              const newFoto = ev.target.result as string;
                              updateGuru(selectedGuru.id, { foto: newFoto, avatarUrl: newFoto });
                              setSelectedGuru(prev => prev ? { ...prev, foto: newFoto, avatarUrl: newFoto } : null);
                              alertSuccess('Foto Diperbarui', `Foto profil ${selectedGuru.nama} berhasil diubah.`);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <h3 className="text-lg font-bold text-slate-800">
                  {selectedGuru.nama}{selectedGuru.gelar ? `, ${selectedGuru.gelar}` : ''}
                </h3>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 rounded-full text-xs font-semibold">
                  {selectedGuru.statusKepegawaian}
                </span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">NIP:</span>
                  <span className="font-semibold text-slate-700">{selectedGuru.nip}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">NUPTK:</span>
                  <span className="font-semibold text-slate-700">{selectedGuru.nuptk || '-'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Jenis Kelamin:</span>
                  <span className="font-semibold text-slate-700">
                    {selectedGuru.jenisKelamin === 'L' || selectedGuru.jenisKelamin === 'Laki-laki' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">No. WhatsApp:</span>
                  <span className="font-semibold text-blue-600">{selectedGuru.noHp}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200">
                  <span className="text-slate-500">Email:</span>
                  <span className="font-semibold text-slate-700">{selectedGuru.email}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Status Keaktifan:</span>
                  <span className="font-semibold text-emerald-600">{selectedGuru.status}</span>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Mata Pelajaran
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {(Array.isArray(selectedGuru.mataPelajaran)
                    ? selectedGuru.mataPelajaran
                    : [selectedGuru.mataPelajaran]
                  ).map((m: any, idx: number) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Jadwal Piket Terdaftar
                </h5>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                  <div className="font-semibold">Hari Piket: Jumat (Minggu I & III)</div>
                  <div className="text-amber-700 text-[11px] mt-0.5">
                    Tugas: Pengecekan KBM Kelas XII & Koordinasi Presensi MBG
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => {
                  setSelectedGuru(null);
                  handleOpenEdit(selectedGuru);
                }}
                className="flex-1 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg text-sm font-semibold cursor-pointer"
              >
                Edit Guru
              </button>
              <button
                onClick={() => setSelectedGuru(null)}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm hover:bg-slate-50 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Import Excel */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Import Data Guru (.xlsx)</h3>
                <p className="text-xs text-slate-500">Impor data tenaga pendidik langsung dari tabel Excel</p>
              </div>
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportedRows([]);
                  setImportFileName(null);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <label className="block border-2 border-dashed border-emerald-300 hover:border-emerald-600 rounded-2xl p-5 text-center bg-emerald-50/40 hover:bg-emerald-50 transition-colors cursor-pointer group">
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileImport}
                className="hidden"
              />
              <FileSpreadsheet className="w-9 h-9 text-emerald-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <div className="text-sm font-bold text-slate-800">
                {importFileName ? (
                  <span className="text-emerald-700">File Terpilih: {importFileName}</span>
                ) : (
                  <span>Pilih atau Unggah Berkas Excel (.xlsx)</span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                {importLoading ? (
                  'Sedang mengurai sel kolom spreadsheet...'
                ) : importedRows.length > 0 ? (
                  <span className="font-semibold text-emerald-600">✓ {importedRows.length} baris data terdeteksi dalam sel kolom terpisah</span>
                ) : (
                  'Format standar .xlsx dengan kolom sel mandiri (A: Nama, B: Gelar, C: NIP, D: Mapel, E: Status)'
                )}
              </div>
            </label>

            {/* Live Preview Table of Discrete Cells */}
            {importedRows.length > 0 && (
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-between">
                  <span>Pratinjau Sel Kolom Terpisah ({importedRows.length} data guru):</span>
                  <span className="text-emerald-700 text-[10px] bg-emerald-100/70 px-2 py-0.5 rounded-full font-semibold">Tersusun Rapi per Kolom</span>
                </div>
                <div className="max-h-36 overflow-y-auto">
                  <table className="w-full text-[11px] text-left border-collapse">
                    <thead className="bg-slate-200/70 text-slate-600 text-[10px]">
                      <tr>
                        <th className="p-1.5 border-r border-slate-300">Kolom A (Nama)</th>
                        <th className="p-1.5 border-r border-slate-300">Kolom B (Gelar)</th>
                        <th className="p-1.5 border-r border-slate-300">Kolom C (NIP)</th>
                        <th className="p-1.5 border-r border-slate-300">Kolom D (Mapel)</th>
                        <th className="p-1.5">Kolom E (Status)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      {importedRows.slice(0, 4).map((g, idx) => (
                        <tr key={idx} className="hover:bg-emerald-50/40">
                          <td className="p-1.5 font-medium text-slate-800 border-r border-slate-200">{g.nama}</td>
                          <td className="p-1.5 text-slate-600 border-r border-slate-200">{g.gelar || '-'}</td>
                          <td className="p-1.5 font-mono text-slate-600 border-r border-slate-200">{g.nip || '-'}</td>
                          <td className="p-1.5 text-slate-600 border-r border-slate-200">
                            {Array.isArray(g.mataPelajaran) ? g.mataPelajaran.join(', ') : g.mataPelajaran}
                          </td>
                          <td className="p-1.5 text-slate-600">{g.statusKepegawaian}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-emerald-900 bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <div>
                <span className="font-bold">Unduh Template Standar .xlsx:</span>
                <p className="text-[10px] text-emerald-700">Sudah terkonfigurasi kolom sel terpisah siap isi.</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  downloadGuruTemplateXLSX();
                  alertSuccess('Template Diunduh', 'File format Template_Import_Data_Guru_MAPLUS.xlsx berhasil diunduh.');
                }}
                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[11px] shadow-2xs cursor-pointer flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .xlsx</span>
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportedRows([]);
                  setImportFileName(null);
                }}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={importedRows.length === 0 || importLoading}
                onClick={handleApplyImport}
                className="px-5 py-2 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed rounded-xl cursor-pointer shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Simpan {importedRows.length > 0 ? `(${importedRows.length}) Data` : 'Data Impor'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
